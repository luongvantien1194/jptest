// Tab "Luyện thi" — thi thử JLPT (文字・語彙 / 文法 / 読解, không có 聴解).
// Luồng: chọn level + lượng câu (1/3, 1/2, như đề thật) → app soạn prompt theo đúng cấu trúc đề JLPT thật rồi mở ChatGPT
// (prompt cũng được copy sẵn) → ChatGPT tự sinh câu hỏi + đáp án theo level (không dùng data từ vựng/ngữ pháp của app)
// → dán JSON lại vào app → làm bài có giới hạn thời gian, chọn hết đáp án rồi nộp → chấm điểm theo thang JLPT (bỏ phần nghe).
// Cấu hình, đề đang chờ dán data, bài đang làm (đáp án + thời gian đã dùng) và lịch sử đều lưu localStorage
// (prefix jp_ → có trong file sao lưu) nên lỡ thoát ra / tải lại trang vẫn thi tiếp được; thời gian chỉ chạy khi đang mở bài thi.
(function () {
  "use strict";

  var CONFIG_KEY = "jp_exam_config";
  var PENDING_KEY = "jp_exam_pending";
  var SESSION_KEY = "jp_exam_session";
  var HISTORY_KEY = "jp_exam_history";
  var HISTORY_MAX = 30;
  var CHATGPT_URL = "https://chatgpt.com/";
  /** URL ?q= dài hơn mức này thì chỉ mở ChatGPT trống, người dùng tự dán prompt đã copy */
  var URL_MAX = 12000;
  /** Khối lượng tối đa ChatGPT trả trong 1 lần (đơn vị ≈ 1 câu trắc nghiệm ngắn); đề lớn hơn thì chia nhiều lần */
  var BATCH_LIMIT = 50;
  /** Tốc độ đọc (chữ / phút) dùng để tính thời gian đọc bài */
  var READ_CPM = 100;
  /** Bỏ phần nghe: điểm còn thang 120 → quy đổi mốc đậu từ thang 180 */
  var PASS_SCALE = 120 / 180;
  /** Điểm liệt từng phần (thang 60) của N1-N3 */
  var SECTION_MIN_60 = 19;

  var FRACTIONS = [
    { value: "1/3", ratio: 1 / 3, label: "1/3 đề" },
    { value: "1/2", ratio: 1 / 2, label: "1/2 đề" },
    { value: "1", ratio: 1, label: "Như đề thật" }
  ];

  var SECTIONS = [
    { key: "vocab", jp: "文字・語彙", vi: "Từ vựng" },
    { key: "grammar", jp: "文法", vi: "Ngữ pháp" },
    { key: "reading", jp: "読解", vi: "Đọc hiểu" }
  ];

  // Các dạng câu hỏi của đề JLPT. w: số phút / câu (tính thời gian làm bài); out: khối lượng ChatGPT phải viết / câu;
  // passage: dạng có bài đọc (thời gian đọc tính thêm theo độ dài bài); spec: mô tả dạng câu cho prompt ({len} = số chữ).
  var PARTS = {
    KANJI: {
      section: "vocab", jp: "漢字読み", vi: "Cách đọc Kanji", w: 0.5, out: 1,
      ins: "＿＿のことばの読み方として最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn cách đọc của từ gạch chân.",
      spec: "q là 1 câu, trong đó 1 từ viết bằng kanji đặt trong 【】; options là 4 cách đọc bằng hiragana (sai kiểu trường âm, âm đục, âm ngắt, âm On/Kun dễ nhầm)."
    },
    HYOKI: {
      section: "vocab", jp: "表記", vi: "Cách viết", w: 0.5, out: 1,
      ins: "＿＿のことばを漢字で書くとき、最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn cách viết (Kanji / Katakana) của từ gạch chân.",
      spec: "q là 1 câu, trong đó 1 từ viết bằng hiragana đặt trong 【】; options là 4 cách viết bằng kanji (hoặc katakana) giống nhau về hình / âm."
    },
    GOKEI: {
      section: "vocab", jp: "語形成", vi: "Ghép từ", w: 0.6, out: 1,
      ins: "（　）に入れるのに最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn tiền tố / hậu tố ghép vào từ.",
      spec: "q là 1 câu có （　） viết liền với 1 từ (chỗ cần tiền tố / hậu tố tạo từ ghép, vd 再～, ～化, ～的, 未～); options là 4 tiền tố / hậu tố."
    },
    BUNMYAKU: {
      section: "vocab", jp: "文脈規定", vi: "Điền từ theo ngữ cảnh", w: 0.7, out: 1,
      ins: "（　）に入れるのに最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn từ hợp ngữ cảnh điền vào chỗ trống.",
      spec: "q là 1 câu có （　）; options là 4 từ cùng loại từ, chỉ 1 từ hợp ngữ cảnh."
    },
    IIKAE: {
      section: "vocab", jp: "言い換え類義", vi: "Từ gần nghĩa", w: 0.7, out: 1.2,
      ins: "＿＿に意味が最も近いものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn từ / câu gần nghĩa nhất với phần gạch chân.",
      spec: "q là 1 câu có 1 từ / cụm đặt trong 【】; options là 4 từ / cụm (hoặc 4 câu ngắn), chỉ 1 cái gần nghĩa nhất với phần 【】."
    },
    YOUHOU: {
      section: "vocab", jp: "用法", vi: "Cách dùng từ", w: 1.2, out: 2.5,
      ins: "つぎのことばの使い方として最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn câu dùng từ đã cho đúng nhất.",
      spec: "q chỉ ghi đúng từ được hỏi; options là 4 câu đều có dùng từ đó, chỉ 1 câu dùng đúng nghĩa / ngữ cảnh."
    },
    KEISHIKI: {
      section: "grammar", jp: "文法形式の判断", vi: "Chọn ngữ pháp đúng", w: 0.8, out: 1,
      ins: "つぎの文の（　）に入れるのに最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn mẫu ngữ pháp / trợ từ / cách chia điền vào chỗ trống.",
      spec: "q là 1 câu (có thể là hội thoại ngắn A：… B：…) có （　）; options là 4 mẫu ngữ pháp / trợ từ / cách chia, chỉ 1 đúng."
    },
    NARABE: {
      section: "grammar", jp: "文の組み立て", vi: "Sắp xếp câu (★)", w: 1.2, out: 1.5,
      ins: "つぎの文の ★ に入る最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Sắp xếp 4 cụm thành câu đúng, chọn cụm nằm ở vị trí ★.",
      spec: "q là câu có đúng 4 chỗ trống viết ＿＿ cách nhau bằng dấu cách, 1 trong 4 chỗ thay bằng ★ (vị trí ★ đổi giữa các câu), vd: \"あそこで ＿＿ ＿＿ ★ ＿＿ は田中さんです。\"; options là 4 cụm cần xếp vào 4 chỗ trống; answer là cụm đứng ở vị trí ★; thêm full: câu hoàn chỉnh đã xếp đúng."
    },
    BUNSHOU: {
      section: "grammar", jp: "文章の文法", vi: "Ngữ pháp trong đoạn văn", w: 1, out: 2, passage: true,
      ins: "つぎの文章を読んで、文章全体の内容を考えて、（1）、（2）…の中に入る最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Đọc đoạn văn, chọn cụm điền vào từng chỗ trống đánh số.",
      spec: "passage là 1 bài văn / bức thư ~{len} chữ có các chỗ trống đánh số （1）（2）… theo thứ tự; mỗi câu hỏi q chỉ ghi số chỗ trống, vd \"（1）\"; options là 4 cụm (ngữ pháp, từ nối, cách chia, từ chỉ định) điền vào chỗ đó."
    },
    TANBUN: {
      section: "reading", jp: "内容理解（短文）", vi: "Đọc hiểu đoạn ngắn", w: 1.5, out: 2, passage: true,
      ins: "つぎの文章を読んで、質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。",
      hint: "Đọc đoạn văn ngắn và trả lời câu hỏi.",
      spec: "passage là 1 đoạn văn ngắn ~{len} chữ (thư, email, thông báo, ghi chú, đoạn nhận xét…); câu hỏi về ý chính / chi tiết / điều người viết muốn nói."
    },
    CHUBUN: {
      section: "reading", jp: "内容理解（中文）", vi: "Đọc hiểu đoạn trung bình", w: 1.5, out: 2, passage: true,
      ins: "つぎの文章を読んで、質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。",
      hint: "Đọc bài văn độ dài trung bình và trả lời câu hỏi.",
      spec: "passage là bài văn ~{len} chữ (bài luận, giải thích, tuỳ bút…); câu hỏi về nguyên nhân, lý do, ý nghĩa của câu / cụm đặt trong 【】 trong bài, ý người viết."
    },
    CHOUBUN: {
      section: "reading", jp: "内容理解（長文）", vi: "Đọc hiểu đoạn dài", w: 1.5, out: 2, passage: true,
      ins: "つぎの文章を読んで、質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。",
      hint: "Đọc bài văn dài và trả lời câu hỏi.",
      spec: "passage là bài văn dài ~{len} chữ; câu hỏi về toàn bài: diễn biến, lập luận, ý chính, ý người viết."
    },
    TOUGOU: {
      section: "reading", jp: "統合理解", vi: "Đọc hiểu tổng hợp (A–B)", w: 2, out: 2, passage: true, twin: true,
      ins: "つぎのAとBの文章を読んで、後の質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。",
      hint: "Đọc 2 bài A và B cùng chủ đề, so sánh / tổng hợp để trả lời.",
      spec: "passage gồm 2 bài A và B cùng 1 chủ đề nhưng quan điểm khác nhau, mỗi bài ~{len} chữ, dòng đầu mỗi bài chỉ ghi \"A\" / \"B\"; câu hỏi so sánh, tổng hợp ý 2 bài."
    },
    SHUCHOU: {
      section: "reading", jp: "主張理解（長文）", vi: "Hiểu chủ trương (dài)", w: 2, out: 2, passage: true,
      ins: "つぎの文章を読んで、後の質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。",
      hint: "Đọc bài bình luận dài, nắm chủ trương / ý kiến của tác giả.",
      spec: "passage là bài bình luận / xã luận dài ~{len} chữ có lập luận rõ ràng; câu hỏi về chủ trương, ý kiến của tác giả."
    },
    JOUHOU: {
      section: "reading", jp: "情報検索", vi: "Tìm thông tin", w: 1.5, out: 2, passage: true,
      ins: "右のページを見て、下の質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。",
      hint: "Đọc thông báo / tờ rơi / bảng thông tin, tìm thông tin theo điều kiện.",
      spec: "passage là thông báo / tờ rơi / hướng dẫn / bảng giá ~{len} chữ, trình bày bằng xuống dòng (có thể kẻ bảng dạng text); câu hỏi tìm thông tin theo điều kiện cho trước (người hỏi có hoàn cảnh cụ thể)."
    }
  };

  function P(code, count, per, len, extra) {
    return { code: code, count: count, per: per || 1, len: len || 0, extra: !!extra };
  }

  // Cấu trúc đề thật (số câu mỗi dạng, theo đề JLPT từ 12/2020). minutes: thời gian thi phần 言語知識 + 読解.
  // pass: điểm đậu tổng (thang 180). extra: dạng bổ sung (đề thật N4/N5 không có 長文) — không tính vào thời gian chuẩn.
  var LEVELS = {
    N5: {
      minutes: 60, pass: 80, combined: true,
      parts: [
        P("KANJI", 7), P("HYOKI", 5), P("BUNMYAKU", 6), P("IIKAE", 3),
        P("KEISHIKI", 9), P("NARABE", 4), P("BUNSHOU", 4, 4, 180),
        P("TANBUN", 2, 1, 80), P("CHUBUN", 2, 2, 250), P("CHOUBUN", 2, 2, 350, true), P("JOUHOU", 1, 1, 150)
      ]
    },
    N4: {
      minutes: 80, pass: 90, combined: true,
      parts: [
        P("KANJI", 7), P("HYOKI", 5), P("BUNMYAKU", 8), P("IIKAE", 4), P("YOUHOU", 4),
        P("KEISHIKI", 13), P("NARABE", 4), P("BUNSHOU", 4, 4, 250),
        P("TANBUN", 3, 1, 120), P("CHUBUN", 3, 3, 400), P("CHOUBUN", 3, 3, 500, true), P("JOUHOU", 2, 2, 300)
      ]
    },
    N3: {
      minutes: 100, pass: 95,
      parts: [
        P("KANJI", 8), P("HYOKI", 6), P("BUNMYAKU", 11), P("IIKAE", 5), P("YOUHOU", 5),
        P("KEISHIKI", 13), P("NARABE", 5), P("BUNSHOU", 5, 5, 350),
        P("TANBUN", 4, 1, 180), P("CHUBUN", 6, 3, 350), P("CHOUBUN", 4, 4, 550), P("JOUHOU", 2, 2, 500)
      ]
    },
    N2: {
      minutes: 105, pass: 90,
      parts: [
        P("KANJI", 5), P("HYOKI", 5), P("GOKEI", 3), P("BUNMYAKU", 7), P("IIKAE", 5), P("YOUHOU", 5),
        P("KEISHIKI", 12), P("NARABE", 5), P("BUNSHOU", 5, 5, 500),
        P("TANBUN", 5, 1, 200), P("CHUBUN", 9, 3, 500), P("TOUGOU", 2, 2, 300), P("SHUCHOU", 3, 3, 900), P("JOUHOU", 2, 2, 600)
      ]
    },
    N1: {
      minutes: 110, pass: 100,
      parts: [
        P("KANJI", 6), P("BUNMYAKU", 7), P("IIKAE", 6), P("YOUHOU", 6),
        P("KEISHIKI", 10), P("NARABE", 5), P("BUNSHOU", 5, 5, 600),
        P("TANBUN", 4, 1, 220), P("CHUBUN", 9, 3, 500), P("CHOUBUN", 4, 4, 1000), P("TOUGOU", 2, 2, 350),
        P("SHUCHOU", 4, 4, 1000), P("JOUHOU", 2, 2, 700)
      ]
    }
  };
  var LEVEL_KEYS = ["N5", "N4", "N3", "N2", "N1"];

  /** view: màn đang hiển thị (home / paste / exam / result); reviewFilter: lọc câu ở màn kết quả */
  var ui = { view: null, section: "vocab", reviewFilter: "all", showNav: false };
  var session = null;
  var timer = { last: 0, saveCounter: 0 };

  // ===================== Helpers =====================

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text != null) e.textContent = String(text);
    return e;
  }
  function btn(className, text, onClick, title) {
    var b = el("button", className, text);
    b.type = "button";
    if (title) b.title = title;
    if (onClick) b.addEventListener("click", onClick);
    return b;
  }
  function load(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch (e) { return null; }
  }
  function save(key, value) {
    try {
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { }
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  /** Text tiếng Nhật do ChatGPT sinh: escape HTML, phần trong 【】 hoặc <u></u> → gạch chân, ★ → tô màu */
  function richHtml(s) {
    return escapeHtml(s)
      .replace(/&lt;u&gt;([\s\S]*?)&lt;\/u&gt;/g, "<span class=\"ex-ul\">$1</span>")
      .replace(/【([^【】]*)】/g, "<span class=\"ex-ul\">$1</span>")
      .replace(/★/g, "<span class=\"ex-star\">★</span>");
  }
  function rich(tag, className, s) {
    var e = el(tag, className);
    e.innerHTML = richHtml(s);
    return e;
  }
  function fmtTime(sec) {
    sec = Math.max(0, Math.round(sec));
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  function fmtDate(ts) {
    var d = new Date(ts);
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return p(d.getDate()) + "/" + p(d.getMonth() + 1) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }
  function pct(a, b) {
    return b ? Math.round(a * 100 / b) : 0;
  }
  function fractionOf(value) {
    return FRACTIONS.filter(function (f) { return f.value === value; })[0] || FRACTIONS[0];
  }
  function sectionOf(key) {
    return SECTIONS.filter(function (s) { return s.key === key; })[0];
  }

  /** Copy đồng bộ (execCommand) trước: ngay sau đó mở tab ChatGPT làm trang mất focus, Clipboard API bất đồng bộ dễ bị từ chối */
  function copyText(text, callback) {
    var ok = false;
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      ok = document.execCommand("copy");
      document.body.removeChild(ta);
    } catch (e) {
      ok = false;
    }
    if (ok || !(navigator.clipboard && navigator.clipboard.writeText)) {
      if (callback) callback(ok);
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      if (callback) callback(true);
    }, function () {
      if (callback) callback(false);
    });
  }
  function chatGptUrl(prompt) {
    var url = CHATGPT_URL + "?q=" + encodeURIComponent(prompt);
    return url.length > URL_MAX ? CHATGPT_URL : url;
  }

  function getContainer() {
    return document.getElementById("exam-container");
  }
  function isSectionActive() {
    var sec = document.getElementById("section-exam");
    return !!sec && sec.classList.contains("section--active");
  }

  // ===================== Cấu hình & cấu trúc đề =====================

  function loadConfig() {
    var c = load(CONFIG_KEY) || {};
    return {
      level: LEVELS[c.level] ? c.level : "N3",
      fraction: fractionOf(c.fraction).value
    };
  }

  /** Chia `count` câu vào `n` bài đọc đều nhau, vd 5 câu / 2 bài → [3, 2] */
  function distribute(count, n) {
    var out = [];
    for (var i = 0; i < n; i++) {
      out.push(Math.floor(count / n) + (i < count % n ? 1 : 0));
    }
    return out;
  }

  /** Cấu trúc đề sau khi thu nhỏ theo tỉ lệ: mỗi dạng ít nhất 1 câu, dạng bài đọc ít nhất 2 câu / bài (nếu đề thật có) */
  function buildPlanParts(level, fractionValue) {
    var ratio = fractionOf(fractionValue).ratio;
    return LEVELS[level].parts.map(function (p) {
      var def = PARTS[p.code];
      var count = Math.max(1, Math.round(p.count * ratio));
      var part = { code: p.code, section: def.section, count: count, len: p.len, extra: p.extra };
      if (def.passage) {
        count = Math.min(p.count, Math.max(Math.min(p.per, 2), count));
        part.count = count;
        part.passages = distribute(count, Math.max(1, Math.round(count / p.per)));
      }
      return part;
    });
  }

  function partMinutes(code, count, passageCount, len) {
    var def = PARTS[code];
    var readChars = def.passage ? passageCount * len * (def.twin ? 2 : 1) : 0;
    return count * def.w + readChars / READ_CPM;
  }

  /**
   * Thời gian làm bài: lấy đúng thời gian thi thật của level, chia theo tỉ lệ khối lượng
   * (số câu × thời gian / câu của từng dạng + thời gian đọc bài) so với đề thật, làm tròn lên phút.
   */
  function calcTimeLimitSec(level, parts) {
    var lv = LEVELS[level];
    var full = 0;
    lv.parts.forEach(function (p) {
      if (!p.extra) full += partMinutes(p.code, p.count, Math.max(1, Math.round(p.count / p.per)), p.len);
    });
    var used = 0;
    parts.forEach(function (p) {
      used += partMinutes(p.code, p.count, p.passages ? p.passages.length : 0, p.len);
    });
    var minutes = Math.max(5, Math.ceil(lv.minutes * used / full));
    return minutes * 60;
  }

  function countPlanQuestions(parts) {
    return parts.reduce(function (sum, p) { return sum + p.count; }, 0);
  }

  // ===================== Prompt ChatGPT =====================

  /** Chia các dạng thành nhiều lần trả lời để ChatGPT không bị cắt giữa chừng */
  function buildBatches(parts) {
    var batches = [];
    var cur = [];
    var curW = 0;
    parts.forEach(function (p) {
      var def = PARTS[p.code];
      var w = def.passage
        ? p.passages.length * p.len * (def.twin ? 2 : 1) / 100 + p.count * def.out
        : p.count * def.out;
      if (cur.length && curW + w > BATCH_LIMIT) {
        batches.push(cur);
        cur = [];
        curW = 0;
      }
      cur.push(p.code);
      curW += w;
    });
    if (cur.length) batches.push(cur);
    return batches;
  }

  function describePartCount(p) {
    if (!p.passages) return p.count + " câu";
    if (p.passages.length === 1) return "1 bài × " + p.count + " câu";
    var same = p.passages.every(function (n) { return n === p.passages[0]; });
    return p.passages.length + " bài" + (same ? " × " + p.passages[0] + " câu" : " (" + p.passages.join(" + ") + " câu)") +
      " = " + p.count + " câu";
  }

  function buildPrompt(level, parts, batches) {
    var lines = [
      "Bạn là người ra đề thi JLPT. Hãy soạn 1 đề thi thử JLPT " + level + " (chỉ phần 言語知識 và 読解, không có 聴解). " +
      "Toàn bộ câu hỏi do bạn tự soạn mới, đúng độ khó, từ vựng, ngữ pháp, chủ đề và văn phong của đề JLPT " + level + " thật.",
      "",
      "Cấu trúc đề (mã | phần | dạng | số lượng):"
    ];
    parts.forEach(function (p) {
      var def = PARTS[p.code];
      lines.push(p.code + " | " + sectionOf(def.section).jp + " | " + def.jp + " | " + describePartCount(p));
    });
    lines.push(
      "",
      "Yêu cầu chung:",
      "- Mỗi câu có đúng 4 đáp án, chỉ 1 đúng; 3 đáp án sai phải hợp lý, dễ nhầm như đề thật. answer: chép y nguyên nội dung đáp án đúng (không ghi số thứ tự).",
      "- Từ / phần được gạch chân đặt trong 【】; chỗ trống viết （　）. Câu hỏi và đáp án viết bằng tiếng Nhật như đề thật.",
      "- explain: tiếng Việt, 1-2 câu, nêu vì sao đáp án đúng (kèm nghĩa từ / mẫu ngữ pháp / câu then chốt), không nhắc tới số thứ tự đáp án.",
      "- Không lặp lại từ, mẫu ngữ pháp hay chủ đề giữa các câu; vị trí đáp án đúng phân bố ngẫu nhiên.",
      "",
      "Mô tả từng dạng:"
    );
    parts.forEach(function (p) {
      lines.push("- " + p.code + ": " + PARTS[p.code].spec.replace("{len}", String(p.len)));
    });
    lines.push(
      "",
      "Định dạng: chỉ trả về code block JSON {\"items\":[...]} (không viết gì ngoài code block). Mỗi phần tử là:",
      "- câu lẻ: {\"part\":\"KANJI\",\"q\":\"\",\"options\":[\"\",\"\",\"\",\"\"],\"answer\":\"\",\"explain\":\"\"}" +
      (parts.some(function (p) { return p.code === "NARABE"; }) ? " (NARABE thêm \"full\":\"\")" : ""),
      "- bài đọc (mỗi bài 1 phần tử): {\"part\":\"" + (parts.filter(function (p) { return p.passages; })[0] || { code: "CHUBUN" }).code +
      "\",\"passage\":\"\",\"questions\":[{\"q\":\"\",\"options\":[\"\",\"\",\"\",\"\"],\"answer\":\"\",\"explain\":\"\"}]}",
      "Xuống dòng trong passage dùng \\n."
    );
    if (batches.length > 1) {
      var desc = batches.map(function (b, i) { return "lần " + (i + 1) + ": " + b.join(", "); }).join("; ");
      lines.push(
        "",
        "Đề dài nên trả làm " + batches.length + " lần, mỗi lần đúng 1 code block {\"items\":[...]} riêng (" + desc + "). " +
        "Trả lần 1 rồi dừng; mỗi khi tôi nhắn \"tiếp\" thì trả lần kế tiếp."
      );
    }
    return lines.join("\n");
  }

  // ===================== Đọc data ChatGPT =====================

  function str(v) { return v == null ? "" : String(v).trim(); }
  function strList(v) { return Array.isArray(v) ? v.map(str).filter(Boolean) : []; }
  function normAnswer(s) {
    return String(s == null ? "" : s).replace(/[\s　～~〜。、【】「」]/g, "").replace(/^[1-4１-４][\.．:：、)）]/, "");
  }

  /** Câu hỏi: { q, options, answer (index trong options), explain, full } hoặc null nếu không hợp lệ */
  function parseQuestion(obj, code) {
    if (!obj || typeof obj !== "object") return null;
    var options = strList(obj.options).filter(function (o, i, arr) { return arr.indexOf(o) === i; });
    var answer = str(obj.answer);
    var idx = -1;
    options.forEach(function (o, i) {
      if (idx === -1 && normAnswer(o) === normAnswer(answer)) idx = i;
    });
    // Phòng khi ChatGPT ghi số thứ tự đáp án (1-4) thay vì nội dung
    if (idx === -1 && /^[1-4]$/.test(answer) && Number(answer) <= options.length) idx = Number(answer) - 1;
    var q = str(obj.q || obj.question);
    if (options.length < 2 || idx === -1) return null;
    if (!q && code !== "BUNSHOU") return null;
    return { q: q, options: options, answer: idx, explain: str(obj.explain), full: str(obj.full) };
  }

  function parseGroup(obj) {
    if (!obj || typeof obj !== "object") return null;
    var code = str(obj.part || obj.type).toUpperCase();
    var def = PARTS[code];
    if (!def) return null;
    if (def.passage) {
      var passage = str(obj.passage);
      if (!passage || !Array.isArray(obj.questions)) return null;
      var qs = obj.questions.map(function (q) { return parseQuestion(q, code); }).filter(Boolean);
      return qs.length ? { part: code, passage: passage, questions: qs } : null;
    }
    var one = parseQuestion(obj, code);
    return one ? { part: code, questions: [one] } : null;
  }

  /** Nhặt từng object {...} còn trọn vẹn — cho data nhiều phần dán nối nhau hoặc phần cuối bị cắt dở */
  function salvageObjects(src) {
    var found = [];
    var stack = [];
    var inString = false;
    for (var i = 0; i < src.length; i++) {
      var ch = src.charAt(i);
      if (inString) {
        if (ch === "\\") i++;
        else if (ch === "\"") inString = false;
      } else if (ch === "\"") {
        inString = true;
      } else if (ch === "{") {
        stack.push(i);
      } else if (ch === "}" && stack.length) {
        var chunk = src.slice(stack.pop(), i + 1);
        try {
          found.push(JSON.parse(chunk));
        } catch (e) {
          try { found.push(JSON.parse(chunk.replace(/,\s*([}\]])/g, "$1"))); } catch (e2) { }
        }
      }
    }
    return found;
  }

  /** → { groups, skipped } hoặc { error } */
  function parseData(text) {
    var src = String(text || "").trim();
    if (!src) return { error: "Chưa dán dữ liệu." };
    src = src.replace(/```[a-z]*/gi, "\n");
    var start = src.search(/[\[{]/);
    if (start === -1) return { error: "Không tìm thấy dữ liệu JSON trong nội dung đã dán." };
    src = src.slice(start);
    var body = src.slice(0, Math.max(src.lastIndexOf("}"), src.lastIndexOf("]")) + 1);
    var data = null;
    var firstError = "";
    [body, body.replace(/,\s*([}\]])/g, "$1")].forEach(function (c) {
      if (data != null) return;
      try { data = JSON.parse(c); } catch (e) { if (!firstError) firstError = e.message; }
    });
    var list;
    if (data != null) {
      list = Array.isArray(data) ? data : (data.items || [data]);
      if (!Array.isArray(list)) list = [];
    } else {
      // Nhiều code block dán nối nhau / bị cắt dở: chỉ lấy object có "part" (bỏ object câu hỏi con bên trong)
      list = salvageObjects(src).filter(function (o) { return o && typeof o === "object" && (o.part || o.type); });
    }
    var groups = [];
    var seen = {};
    var skipped = 0;
    list.forEach(function (obj) {
      var g = parseGroup(obj);
      if (!g) {
        if (obj && typeof obj === "object" && (obj.part || obj.options || obj.passage)) skipped++;
        return;
      }
      var key = JSON.stringify(g);
      if (seen[key]) return;
      seen[key] = true;
      groups.push(g);
    });
    if (!groups.length) {
      return { error: data == null && !list.length ? "JSON không hợp lệ: " + firstError : "Không có câu hỏi hợp lệ (cần part, q / passage, 4 options và answer nằm trong options)." };
    }
    return { groups: groups, skipped: skipped };
  }

  /** Số câu đã nhận được của từng dạng (giới hạn theo cấu trúc đề) */
  function receivedByPart(planParts, groups) {
    var out = {};
    planParts.forEach(function (p) {
      out[p.code] = takeGroups(p, groups).reduce(function (sum, g) { return sum + g.questions.length; }, 0);
    });
    return out;
  }
  function takeGroups(planPart, groups) {
    var gs = groups.filter(function (g) { return g.part === planPart.code; });
    return gs.slice(0, planPart.passages ? planPart.passages.length : planPart.count);
  }

  // ===================== Bài thi =====================

  function loadSession() {
    var s = load(SESSION_KEY);
    if (!s || !Array.isArray(s.parts) || !s.parts.length || !s.answers) return null;
    return s;
  }
  function saveSession() {
    save(SESSION_KEY, session);
  }

  function buildSession(pending, groups) {
    var n = 0;
    var parts = [];
    pending.parts.forEach(function (pp) {
      var gs = takeGroups(pp, groups);
      if (!gs.length) return;
      var count = 0;
      var groupsOut = gs.map(function (g) {
        return {
          passage: g.passage || "",
          questions: g.questions.map(function (q) {
            count++;
            // Xáo vị trí đáp án (ChatGPT hay dồn đáp án đúng vào 1 vị trí)
            var order = shuffle(q.options.map(function (_, i) { return i; }));
            return {
              id: "q" + (++n),
              q: q.q,
              options: order.map(function (i) { return q.options[i]; }),
              answer: order.indexOf(q.answer),
              explain: q.explain,
              full: q.full
            };
          })
        };
      });
      parts.push({ code: pp.code, section: pp.section, len: pp.len, groups: groupsOut, count: count });
    });
    var timeParts = parts.map(function (p) {
      return { code: p.code, count: p.count, len: p.len, passages: PARTS[p.code].passage ? p.groups : null };
    });
    return {
      id: Date.now(),
      level: pending.level,
      fraction: pending.fraction,
      timeLimitSec: calcTimeLimitSec(pending.level, timeParts),
      elapsedSec: 0,
      parts: parts,
      answers: {},
      submitted: false,
      timedOut: false,
      result: null,
      prompt: pending.prompt
    };
  }

  function allQuestions(s) {
    var list = [];
    s.parts.forEach(function (p) {
      p.groups.forEach(function (g) {
        g.questions.forEach(function (q) { list.push({ q: q, part: p }); });
      });
    });
    return list;
  }
  function answeredCount(s, sectionKey) {
    return allQuestions(s).filter(function (x) {
      return (!sectionKey || x.part.section === sectionKey) && s.answers[x.q.id] != null;
    }).length;
  }
  function sectionQuestionCount(s, sectionKey) {
    return allQuestions(s).filter(function (x) { return x.part.section === sectionKey; }).length;
  }
  function sessionSections(s) {
    return SECTIONS.filter(function (sec) {
      return s.parts.some(function (p) { return p.section === sec.key; });
    });
  }

  // ===================== Chấm điểm =====================

  function grade(s) {
    var stats = { vocab: { c: 0, t: 0 }, grammar: { c: 0, t: 0 }, reading: { c: 0, t: 0 } };
    var byPart = s.parts.map(function (p) {
      var c = 0;
      var t = 0;
      p.groups.forEach(function (g) {
        g.questions.forEach(function (q) {
          t++;
          if (s.answers[q.id] === q.answer) c++;
        });
      });
      stats[p.section].c += c;
      stats[p.section].t += t;
      return { code: p.code, section: p.section, correct: c, total: t };
    });
    var lv = LEVELS[s.level];
    var knowC = stats.vocab.c + stats.grammar.c;
    var knowT = stats.vocab.t + stats.grammar.t;
    // Điểm JLPT thật là điểm quy đổi (scaled); ở đây ước tính theo tỉ lệ đúng: 言語知識 60 + 読解 60
    var know60 = knowT ? Math.round(knowC * 60 / knowT) : 0;
    var read60 = stats.reading.t ? Math.round(stats.reading.c * 60 / stats.reading.t) : 0;
    var total = know60 + read60;
    var passMark = Math.round(lv.pass * PASS_SCALE);
    var scores;
    var pass;
    if (lv.combined) {
      var minCombined = 38;
      scores = [{ label: "言語知識（文字・語彙・文法）・読解", value: total, max: 120, min: minCombined }];
      pass = total >= passMark && total >= minCombined;
    } else {
      scores = [
        { label: "言語知識（文字・語彙・文法）", value: know60, max: 60, min: SECTION_MIN_60 },
        { label: "読解", value: read60, max: 60, min: SECTION_MIN_60 }
      ];
      pass = total >= passMark && know60 >= SECTION_MIN_60 && read60 >= SECTION_MIN_60;
    }
    var all = allQuestions(s);
    var correct = all.filter(function (x) { return s.answers[x.q.id] === x.q.answer; }).length;
    return {
      total: total,
      passMark: passMark,
      pass: pass,
      scores: scores,
      stats: stats,
      byPart: byPart,
      correct: correct,
      count: all.length,
      answered: answeredCount(s),
      elapsedSec: s.elapsedSec,
      timeLimitSec: s.timeLimitSec,
      timedOut: !!s.timedOut
    };
  }

  function submitExam(timedOut) {
    if (!session || session.submitted) return;
    session.submitted = true;
    session.timedOut = !!timedOut;
    session.submittedAt = Date.now();
    session.result = grade(session);
    saveSession();
    var history = load(HISTORY_KEY) || [];
    history.unshift({
      at: session.submittedAt,
      level: session.level,
      fraction: session.fraction,
      total: session.result.total,
      passMark: session.result.passMark,
      pass: session.result.pass,
      correct: session.result.correct,
      count: session.result.count,
      elapsedSec: session.elapsedSec
    });
    save(HISTORY_KEY, history.slice(0, HISTORY_MAX));
    ui.view = "result";
    ui.reviewFilter = "all";
    render();
    var scroller = document.querySelector("#exam-container .ex-scroll");
    if (scroller) scroller.scrollTop = 0;
    if (timedOut) {
      setTimeout(function () { alert("Hết giờ! Bài thi đã được tự động nộp."); }, 50);
    }
  }

  // ===================== Đồng hồ =====================

  /** Thời gian chỉ chạy khi đang ở màn làm bài của tab Luyện thi và trang đang hiển thị */
  function tick() {
    var now = Date.now();
    var delta = (now - (timer.last || now)) / 1000;
    timer.last = now;
    if (!session || session.submitted || ui.view !== "exam" || !isSectionActive() || document.hidden) return;
    // Máy ngủ / tab bị treo lâu thì không tính phần thời gian đó
    session.elapsedSec += Math.min(delta, 3);
    if (session.elapsedSec >= session.timeLimitSec) {
      session.elapsedSec = session.timeLimitSec;
      submitExam(true);
      return;
    }
    if (++timer.saveCounter >= 5) {
      timer.saveCounter = 0;
      saveSession();
    }
    updateTimerLabel();
  }
  function updateTimerLabel() {
    var label = document.getElementById("exam-timer");
    if (!label || !session) return;
    var remain = session.timeLimitSec - session.elapsedSec;
    label.textContent = "⏱ " + fmtTime(remain);
    label.classList.toggle("ex-timer--warn", remain <= 300);
  }

  // ===================== Render =====================

  function render() {
    var root = getContainer();
    if (!root) return;
    if (!ui.view) {
      session = loadSession();
      if (session && session.section) ui.section = session.section;
      if (session && !session.submitted) ui.view = "exam";
      else if (load(PENDING_KEY)) ui.view = "paste";
      else ui.view = "home";
    }
    root.innerHTML = "";
    if (ui.view === "exam" && session && !session.submitted) renderExam(root);
    else if (ui.view === "result" && session && session.submitted) renderResult(root);
    else if (ui.view === "paste" && load(PENDING_KEY)) renderPaste(root);
    else {
      ui.view = "home";
      renderHome(root);
    }
  }

  function header(root, title, chips, actions) {
    var head = el("div", "section-header ex-header");
    var navBtn = btn("filter-icon-btn nav-menu-btn", "☰", null, "Menu điều hướng");
    head.appendChild(navBtn);
    var main = el("div", "daily-header-main");
    main.appendChild(el("span", "daily-title", title));
    (chips || []).forEach(function (c) {
      var chip = el("span", "chip", c.text);
      if (c.id) chip.id = c.id;
      main.appendChild(chip);
    });
    head.appendChild(main);
    (actions || []).forEach(function (a) { head.appendChild(a); });
    root.appendChild(head);
  }

  // ----- Màn chọn level -----

  function renderHome(root) {
    header(root, "Luyện thi JLPT");
    var scroll = el("div", "ex-scroll scroll-thin");
    root.appendChild(scroll);
    var cfg = loadConfig();

    var s = session || loadSession();
    if (s && !s.submitted) {
      var resume = el("div", "ex-card ex-card--resume");
      resume.appendChild(el("div", "ex-card-title", "Bài thi đang làm dở"));
      resume.appendChild(el("div", "ex-muted",
        s.level + " · " + fractionOf(s.fraction).label + " · đã làm " + answeredCount(s) + "/" + allQuestions(s).length +
        " câu · còn " + fmtTime(s.timeLimitSec - s.elapsedSec)));
      var row = el("div", "btn-row");
      row.appendChild(btn("btn", "▶ Thi tiếp", function () {
        session = s;
        if (s.section) ui.section = s.section;
        ui.view = "exam";
        render();
      }));
      row.appendChild(btn("btn-ghost btn-ghost--danger", "Bỏ bài này", function () {
        if (!confirm("Bỏ bài thi đang làm dở? Đáp án đã chọn sẽ bị xoá.")) return;
        save(SESSION_KEY, null);
        session = null;
        render();
      }));
      resume.appendChild(row);
      scroll.appendChild(resume);
    } else if (s && s.submitted) {
      var last = el("div", "ex-card");
      last.appendChild(el("div", "ex-card-title", "Bài thi gần nhất"));
      last.appendChild(el("div", "ex-muted",
        s.level + " · " + fractionOf(s.fraction).label + " · " + s.result.total + "/120 điểm · " + (s.result.pass ? "Đạt" : "Chưa đạt")));
      var lastRow = el("div", "btn-row");
      lastRow.appendChild(btn("btn-ghost", "Xem kết quả & đáp án", function () {
        session = s;
        ui.view = "result";
        render();
      }));
      last.appendChild(lastRow);
      scroll.appendChild(last);
    }

    var pending = load(PENDING_KEY);
    if (pending) {
      var pend = el("div", "ex-card");
      pend.appendChild(el("div", "ex-card-title", "Đề đang chờ dán data từ ChatGPT"));
      pend.appendChild(el("div", "ex-muted", pending.level + " · " + fractionOf(pending.fraction).label + " · tạo lúc " + fmtDate(pending.createdAt)));
      var pendRow = el("div", "btn-row");
      pendRow.appendChild(btn("btn", "📋 Dán data", function () { ui.view = "paste"; render(); }));
      pendRow.appendChild(btn("btn-ghost", "Huỷ đề này", function () { save(PENDING_KEY, null); render(); }));
      pend.appendChild(pendRow);
      scroll.appendChild(pend);
    }

    var card = el("div", "ex-card");
    card.appendChild(el("div", "ex-card-title", "Tạo đề thi thử mới"));
    card.appendChild(el("div", "ex-field-label", "Level"));
    var levelRow = el("div", "chip-group ex-chips");
    LEVEL_KEYS.forEach(function (lv) {
      var b = btn("chip ex-chip" + (cfg.level === lv ? " chip--active" : ""), lv, function () {
        cfg.level = lv;
        save(CONFIG_KEY, cfg);
        render();
      });
      levelRow.appendChild(b);
    });
    card.appendChild(levelRow);

    card.appendChild(el("div", "ex-field-label", "Số lượng câu hỏi"));
    var fracRow = el("div", "chip-group ex-chips");
    FRACTIONS.forEach(function (f) {
      fracRow.appendChild(btn("chip ex-chip" + (cfg.fraction === f.value ? " chip--active" : ""), f.label, function () {
        cfg.fraction = f.value;
        save(CONFIG_KEY, cfg);
        render();
      }));
    });
    card.appendChild(fracRow);

    var parts = buildPlanParts(cfg.level, cfg.fraction);
    var timeSec = calcTimeLimitSec(cfg.level, parts);
    var lv = LEVELS[cfg.level];
    card.appendChild(el("div", "ex-summary",
      countPlanQuestions(parts) + " câu · " + Math.round(timeSec / 60) + " phút (đề thật " + lv.minutes + " phút, không tính phần nghe)"));

    var table = el("div", "ex-structure");
    SECTIONS.forEach(function (sec) {
      var ps = parts.filter(function (p) { return p.section === sec.key; });
      var box = el("div", "ex-structure-sec");
      box.appendChild(el("div", "ex-structure-head", sec.jp + " · " + sec.vi + " (" + countPlanQuestions(ps) + " câu)"));
      ps.forEach(function (p) {
        var def = PARTS[p.code];
        var line = el("div", "ex-structure-row");
        line.appendChild(el("span", "ex-structure-name", def.jp));
        line.appendChild(el("span", "ex-muted", def.vi + (p.extra ? " (bổ sung)" : "")));
        line.appendChild(el("span", "ex-structure-count", describePartCount(p)));
        box.appendChild(line);
      });
      table.appendChild(box);
    });
    card.appendChild(table);
    if (lv.parts.some(function (p) { return p.extra; })) {
      card.appendChild(el("div", "ex-note",
        "(bổ sung): đề " + cfg.level + " thật không có đọc hiểu đoạn dài — thêm vào để luyện đủ dạng ngắn / trung bình / dài."));
    }

    var genRow = el("div", "btn-row");
    genRow.appendChild(btn("btn", "✨ Tạo đề (ChatGPT)", function () {
      var cur = loadSession();
      if (cur && !cur.submitted && !confirm("Đang có bài thi làm dở. Tạo đề mới thì bài đó sẽ bị bỏ khi bắt đầu thi đề mới. Tiếp tục?")) return;
      var batches = buildBatches(parts);
      var p = {
        createdAt: Date.now(),
        level: cfg.level,
        fraction: cfg.fraction,
        parts: parts,
        batches: batches.length,
        prompt: buildPrompt(cfg.level, parts, batches),
        draft: ""
      };
      save(PENDING_KEY, p);
      copyText(p.prompt);
      window.open(chatGptUrl(p.prompt), "_blank", "noopener");
      ui.view = "paste";
      render();
    }));
    card.appendChild(genRow);
    card.appendChild(el("div", "ex-note",
      "App soạn prompt theo cấu trúc đề JLPT thật rồi mở ChatGPT (prompt cũng được copy sẵn). ChatGPT tự sinh câu hỏi & đáp án theo level; " +
      "copy khối JSON ChatGPT trả về rồi quay lại đây dán vào để bắt đầu thi."));
    scroll.appendChild(card);

    renderHistory(scroll);
  }

  function renderHistory(parent) {
    var history = load(HISTORY_KEY) || [];
    if (!history.length) return;
    var card = el("div", "ex-card");
    card.appendChild(el("div", "ex-card-title", "Lịch sử thi thử"));
    var list = el("div", "ex-history");
    history.slice(0, 15).forEach(function (h) {
      var row = el("div", "ex-history-row");
      row.appendChild(el("span", "ex-muted", fmtDate(h.at)));
      row.appendChild(el("span", "ex-history-level", h.level + " · " + fractionOf(h.fraction).label));
      row.appendChild(el("span", "", h.total + "/120 · đúng " + h.correct + "/" + h.count));
      row.appendChild(el("span", "ex-badge " + (h.pass ? "ex-badge--pass" : "ex-badge--fail"), h.pass ? "Đạt" : "Chưa đạt"));
      list.appendChild(row);
    });
    card.appendChild(list);
    parent.appendChild(card);
  }

  // ----- Màn dán data -----

  function renderPaste(root) {
    var pending = load(PENDING_KEY);
    header(root, "Dán đề từ ChatGPT", [{ text: pending.level + " · " + fractionOf(pending.fraction).label }]);
    var scroll = el("div", "ex-scroll scroll-thin");
    root.appendChild(scroll);
    var card = el("div", "ex-card");
    scroll.appendChild(card);

    var prefilled = chatGptUrl(pending.prompt) !== CHATGPT_URL;
    var steps = el("ol", "gx-steps");
    [
      prefilled
        ? "ChatGPT đã mở với prompt soạn sẵn (prompt cũng đã được copy — nếu ô chat còn trống thì dán vào rồi gửi)."
        : "Prompt dài nên ChatGPT mở ô chat trống: dán prompt (đã được copy sẵn) vào rồi gửi.",
      pending.batches > 1
        ? "Đề dài nên ChatGPT trả làm " + pending.batches + " lần: copy khối JSON của mỗi lần, dán vào đây, rồi nhắn \"tiếp\" để nhận lần sau."
        : "Chờ ChatGPT trả lời xong, bấm Copy ở khối JSON.",
      "Quay lại đây bấm \"Dán từ clipboard\" (các lần dán được nối tiếp vào ô bên dưới). Đủ câu thì bấm \"Bắt đầu thi\"."
    ].forEach(function (t) { steps.appendChild(el("li", "", t)); });
    card.appendChild(steps);

    var linkRow = el("div", "btn-row");
    var openLink = el("a", "btn-ghost", "↗ Mở lại ChatGPT");
    openLink.href = chatGptUrl(pending.prompt);
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.addEventListener("click", function () { copyText(pending.prompt); });
    linkRow.appendChild(openLink);
    linkRow.appendChild(btn("btn-ghost", "📋 Copy prompt", function () {
      copyText(pending.prompt, function (ok) { setStatus(ok ? "Đã copy prompt." : "Không copy được prompt.", !ok); });
    }));
    card.appendChild(linkRow);

    var textarea = el("textarea", "input-text gx-textarea ex-textarea");
    textarea.rows = 7;
    textarea.spellcheck = false;
    textarea.placeholder = "{\"items\":[ ... ]}";
    textarea.value = pending.draft || "";
    card.appendChild(textarea);
    var status = el("div", "gx-status");
    card.appendChild(status);
    var progress = el("div", "ex-progress-list");
    card.appendChild(progress);

    function setStatus(text, isError) {
      status.textContent = text || "";
      status.className = "gx-status" + (text ? (isError ? " gx-status--error" : " gx-status--ok") : "");
    }
    var lastParse = null;
    function refresh() {
      pending.draft = textarea.value;
      save(PENDING_KEY, pending);
      progress.innerHTML = "";
      lastParse = textarea.value.trim() ? parseData(textarea.value) : null;
      var groups = lastParse && lastParse.groups ? lastParse.groups : [];
      var got = receivedByPart(pending.parts, groups);
      var gotTotal = 0;
      pending.parts.forEach(function (p) {
        gotTotal += Math.min(got[p.code], p.count);
        var ok = got[p.code] >= p.count;
        var row = el("div", "ex-progress-row" + (ok ? " ex-progress-row--ok" : (got[p.code] ? " ex-progress-row--part" : "")));
        row.appendChild(el("span", "ex-progress-code", p.code));
        row.appendChild(el("span", "", PARTS[p.code].jp));
        row.appendChild(el("span", "ex-progress-count", (ok ? "✓ " : "") + got[p.code] + "/" + p.count));
        progress.appendChild(row);
      });
      if (!lastParse) setStatus("");
      else if (lastParse.error) setStatus(lastParse.error, true);
      else setStatus("Đã đọc được " + gotTotal + "/" + countPlanQuestions(pending.parts) + " câu" +
        (lastParse.skipped ? " (bỏ qua " + lastParse.skipped + " mục không hợp lệ)" : "") + ".", false);
    }
    textarea.addEventListener("input", refresh);
    refresh();

    var row = el("div", "btn-row");
    if (navigator.clipboard && navigator.clipboard.readText) {
      row.appendChild(btn("btn", "📥 Dán từ clipboard", function () {
        navigator.clipboard.readText().then(function (text) {
          var cur = textarea.value.trim();
          if (!text.trim()) return;
          textarea.value = cur && cur.indexOf(text.trim()) === -1 ? cur + "\n" + text : (cur || text);
          refresh();
        }).catch(function () {
          setStatus("Trình duyệt không cho đọc clipboard — hãy nhấn giữ vào ô trên và chọn Dán.", true);
          textarea.focus();
        });
      }));
    }
    row.appendChild(btn(row.children.length ? "btn-ghost" : "btn", "▶ Bắt đầu thi", function () {
      refresh();
      if (!lastParse || lastParse.error) {
        setStatus(lastParse ? lastParse.error : "Chưa dán dữ liệu.", true);
        return;
      }
      var got = receivedByPart(pending.parts, lastParse.groups);
      var missing = pending.parts.filter(function (p) { return got[p.code] < p.count; });
      if (missing.length && !confirm(
        "Còn thiếu câu ở: " + missing.map(function (p) { return PARTS[p.code].jp + " (" + got[p.code] + "/" + p.count + ")"; }).join(", ") + ".\n" +
        "OK: thi luôn với các câu đã có (thời gian tính lại theo số câu).\nHuỷ: dán thêm phần còn lại.")) return;
      var s = buildSession(pending, lastParse.groups);
      if (!s.parts.length) {
        setStatus("Không có câu hỏi nào khớp với cấu trúc đề.", true);
        return;
      }
      session = s;
      ui.section = s.parts[0].section;
      ui.showNav = false;
      saveSession();
      save(PENDING_KEY, null);
      ui.view = "exam";
      render();
    }));
    row.appendChild(btn("btn-ghost", "Xoá ô dán", function () {
      textarea.value = "";
      refresh();
    }));
    row.appendChild(btn("btn-ghost", "← Quay lại", function () {
      ui.view = "home";
      render();
    }));
    card.appendChild(row);
  }

  // ----- Màn làm bài -----

  function renderExam(root) {
    var s = session;
    var sections = sessionSections(s);
    if (!sections.some(function (sec) { return sec.key === ui.section; })) ui.section = sections[0].key;
    var total = allQuestions(s).length;

    var bar = el("div", "ex-bar");
    bar.appendChild(btn("filter-icon-btn nav-menu-btn", "☰", null, "Menu điều hướng"));
    bar.appendChild(el("span", "ex-bar-level", s.level));
    var timerLabel = el("span", "ex-timer");
    timerLabel.id = "exam-timer";
    bar.appendChild(timerLabel);
    var countLabel = el("span", "chip ex-answered", answeredCount(s) + "/" + total);
    countLabel.id = "exam-answered";
    countLabel.title = "Số câu đã chọn đáp án";
    bar.appendChild(countLabel);
    var spacer = el("span", "ex-spacer");
    bar.appendChild(spacer);
    bar.appendChild(btn("filter-icon-btn" + (ui.showNav ? " ex-active" : ""), "▦", function () {
      ui.showNav = !ui.showNav;
      render();
    }, "Danh sách câu hỏi"));
    bar.appendChild(btn("filter-icon-btn", "⏸", function () {
      saveSession();
      ui.view = "home";
      render();
    }, "Tạm thoát (thời gian dừng lại, quay lại thi tiếp được)"));
    bar.appendChild(btn("btn ex-submit-btn", "Nộp bài", confirmSubmit));
    root.appendChild(bar);

    var tabs = el("div", "ex-sec-tabs");
    sections.forEach(function (sec) {
      var b = btn("ex-sec-tab" + (sec.key === ui.section ? " ex-sec-tab--active" : ""), "", function () {
        ui.section = sec.key;
        render();
      });
      b.appendChild(el("span", "ex-sec-tab-jp", sec.jp));
      var cnt = el("span", "ex-sec-tab-count", answeredCount(s, sec.key) + "/" + sectionQuestionCount(s, sec.key));
      cnt.setAttribute("data-sec-count", sec.key);
      b.appendChild(cnt);
      tabs.appendChild(b);
    });
    root.appendChild(tabs);

    if (ui.showNav) root.appendChild(buildNavGrid(s));

    var scroll = el("div", "ex-scroll scroll-thin");
    root.appendChild(scroll);
    // Nhớ phần + vị trí cuộn đang làm để thoát ra / tải lại trang vẫn quay về đúng chỗ
    if (s.section !== ui.section) {
      s.section = ui.section;
      saveSession();
    }
    var restoreTop = s.scroll && s.scroll.section === ui.section ? s.scroll.top : 0;
    var scrollSaveTimer = null;
    scroll.addEventListener("scroll", function () {
      clearTimeout(scrollSaveTimer);
      scrollSaveTimer = setTimeout(function () {
        s.scroll = { section: ui.section, top: scroll.scrollTop };
        saveSession();
      }, 400);
    });
    var mondai = 0;
    s.parts.forEach(function (p) {
      if (p.section !== ui.section) return;
      mondai++;
      scroll.appendChild(buildPartBlock(s, p, mondai, false));
    });

    var idx = sections.map(function (sec) { return sec.key; }).indexOf(ui.section);
    var nav = el("div", "btn-row ex-bottom-row");
    if (idx > 0) {
      nav.appendChild(btn("btn-ghost", "← " + sections[idx - 1].jp, function () {
        ui.section = sections[idx - 1].key;
        render();
      }));
    }
    if (idx < sections.length - 1) {
      nav.appendChild(btn("btn", sections[idx + 1].jp + " →", function () {
        ui.section = sections[idx + 1].key;
        render();
        var sc = document.querySelector("#exam-container .ex-scroll");
        if (sc) sc.scrollTop = 0;
      }));
    } else {
      nav.appendChild(btn("btn", "Nộp bài", confirmSubmit));
    }
    scroll.appendChild(nav);
    if (restoreTop) scroll.scrollTop = restoreTop;
    updateTimerLabel();
  }

  function confirmSubmit() {
    var total = allQuestions(session).length;
    var left = total - answeredCount(session);
    var msg = left
      ? "Còn " + left + " câu chưa chọn đáp án (JLPT không trừ điểm câu sai — nên chọn hết).\nVẫn nộp bài?"
      : "Nộp bài và xem kết quả?";
    if (confirm(msg)) submitExam(false);
  }

  function buildNavGrid(s) {
    var grid = el("div", "ex-nav-grid");
    allQuestions(s).forEach(function (x) {
      var no = x.q.id.slice(1);
      var b = btn("ex-nav-cell" + (s.answers[x.q.id] != null ? " ex-nav-cell--done" : ""), no, function () {
        ui.section = x.part.section;
        ui.showNav = false;
        render();
        var target = document.getElementById("exq-" + x.q.id);
        if (target) target.scrollIntoView({ block: "center" });
      });
      b.setAttribute("data-nav-q", x.q.id);
      grid.appendChild(b);
    });
    return grid;
  }

  function buildPartBlock(s, p, mondai, reviewMode) {
    var def = PARTS[p.code];
    var block = el("div", "ex-part");
    var head = el("div", "ex-part-head");
    head.appendChild(el("span", "ex-part-no", "問題" + mondai));
    head.appendChild(el("span", "ex-part-name", def.jp));
    head.appendChild(el("span", "ex-muted", def.vi));
    block.appendChild(head);
    if (!reviewMode) {
      block.appendChild(el("div", "ex-part-ins", def.ins));
      block.appendChild(el("div", "ex-part-hint", def.hint));
    }
    p.groups.forEach(function (g, gi) {
      var groupBox = el("div", def.passage ? "ex-group" : "");
      if (def.passage) {
        var passageWrap = reviewMode ? el("details", "ex-passage-wrap") : el("div", "ex-passage-wrap");
        if (reviewMode) passageWrap.appendChild(el("summary", "ex-muted", "Bài đọc " + (gi + 1)));
        else if (p.groups.length > 1) passageWrap.appendChild(el("div", "ex-passage-title", "（" + (gi + 1) + "）"));
        passageWrap.appendChild(rich("div", "ex-passage", g.passage));
        groupBox.appendChild(passageWrap);
      }
      g.questions.forEach(function (q) {
        if (reviewMode && ui.reviewFilter === "wrong" && s.answers[q.id] === q.answer) return;
        groupBox.appendChild(reviewMode ? buildReviewQuestion(s, p, q) : buildQuestion(s, p, q));
      });
      if (reviewMode && ui.reviewFilter === "wrong" && !groupBox.querySelector(".ex-q")) return;
      block.appendChild(groupBox);
    });
    return block;
  }

  /** Đáp án dài (câu) thì xếp 1 cột, ngắn thì lưới 2 cột như đề giấy */
  function optionsClass(q) {
    var long = q.options.some(function (o) { return o.length > 14; });
    return "ex-opts" + (long ? " ex-opts--long" : "");
  }

  function buildQuestion(s, p, q) {
    var box = el("div", "ex-q" + (s.answers[q.id] != null ? " ex-q--done" : ""));
    box.id = "exq-" + q.id;
    var head = el("div", "ex-q-head");
    head.appendChild(el("span", "ex-q-no", q.id.slice(1)));
    head.appendChild(rich("div", "ex-q-text" + (p.code === "YOUHOU" ? " ex-q-text--word" : ""), q.q));
    box.appendChild(head);
    var opts = el("div", optionsClass(q));
    q.options.forEach(function (o, i) {
      var b = btn("ex-opt" + (s.answers[q.id] === i ? " ex-opt--sel" : ""), "", function () {
        s.answers[q.id] = i;
        saveSession();
        Array.prototype.forEach.call(opts.children, function (c, ci) {
          c.classList.toggle("ex-opt--sel", ci === i);
        });
        box.classList.add("ex-q--done");
        updateAnsweredLabels();
      });
      b.appendChild(el("span", "ex-opt-no", String(i + 1)));
      b.appendChild(rich("span", "ex-opt-text", o));
      opts.appendChild(b);
    });
    box.appendChild(opts);
    return box;
  }

  function updateAnsweredLabels() {
    var s = session;
    var label = document.getElementById("exam-answered");
    if (label) label.textContent = answeredCount(s) + "/" + allQuestions(s).length;
    Array.prototype.forEach.call(document.querySelectorAll("[data-sec-count]"), function (c) {
      var key = c.getAttribute("data-sec-count");
      c.textContent = answeredCount(s, key) + "/" + sectionQuestionCount(s, key);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-nav-q]"), function (c) {
      c.classList.toggle("ex-nav-cell--done", s.answers[c.getAttribute("data-nav-q")] != null);
    });
  }

  // ----- Màn kết quả -----

  function assessment(r, s) {
    var notes = [];
    var p = pct(r.correct, r.count);
    // Đánh giá theo điểm quy đổi so với mốc đậu (không theo % đúng thô vì 読解 ít câu nhưng chiếm nửa số điểm)
    var gap = r.total - r.passMark;
    var level;
    if (!r.pass && gap >= 0) level = "Đủ điểm tổng nhưng dính điểm liệt — phần dưới mốc liệt cần ôn gấp.";
    else if (gap >= 25) level = "Rất tốt — vững trình độ " + s.level + ", có thể thử level cao hơn.";
    else if (gap >= 10) level = "Tốt — đủ sức đậu " + s.level + " nếu giữ phong độ.";
    else if (gap >= 0) level = "Vừa đủ mốc đậu — còn sát, nên chắc thêm các phần yếu.";
    else if (gap >= -12) level = "Gần mốc đậu (thiếu " + (-gap) + " điểm) — ôn thêm các dạng yếu là có thể đậu.";
    else level = "Còn xa mốc đậu (thiếu " + (-gap) + " điểm) — nên ôn lại từ vựng / ngữ pháp " + s.level + " trước khi thi thử tiếp.";
    notes.push(level);
    var blank = r.count - r.answered;
    if (blank) notes.push("Bỏ trống " + blank + " câu — JLPT không trừ điểm câu sai, lần sau nhớ chọn hết đáp án.");
    if (r.timedOut) notes.push("Hết giờ trước khi nộp — cần phân bổ thời gian tốt hơn (làm nhanh phần từ vựng, dành thời gian cho đọc hiểu).");
    else if (r.elapsedSec < r.timeLimitSec * 0.5 && p < 70) notes.push("Làm khá nhanh (" + fmtTime(r.elapsedSec) + ") nhưng sai nhiều — nên đọc kỹ đề hơn.");
    var weak = r.byPart.filter(function (b) { return b.total && b.correct / b.total < 0.6; })
      .sort(function (a, b) { return a.correct / a.total - b.correct / b.total; })
      .slice(0, 3);
    if (weak.length) {
      notes.push("Cần ôn: " + weak.map(function (b) {
        return PARTS[b.code].jp + " (" + PARTS[b.code].vi + ", " + pct(b.correct, b.total) + "%)";
      }).join("; ") + ".");
    }
    return notes;
  }

  function renderResult(root) {
    var s = session;
    var r = s.result || grade(s);
    header(root, "Kết quả thi thử", [{ text: s.level + " · " + fractionOf(s.fraction).label }]);
    var scroll = el("div", "ex-scroll scroll-thin");
    root.appendChild(scroll);

    var banner = el("div", "ex-banner " + (r.pass ? "ex-banner--pass" : "ex-banner--fail"));
    banner.appendChild(el("div", "ex-banner-verdict", r.pass ? "合格 · Đạt" : "不合格 · Chưa đạt"));
    banner.appendChild(el("div", "ex-banner-score", r.total + " / 120"));
    banner.appendChild(el("div", "ex-banner-sub",
      "Mốc đậu quy đổi (bỏ phần nghe): " + r.passMark + "/120 · mốc thật " + LEVELS[s.level].pass + "/180"));
    scroll.appendChild(banner);

    var scores = el("div", "ex-score-grid");
    r.scores.forEach(function (sc) {
      var ok = sc.value >= sc.min;
      var c = el("div", "ex-score-card");
      c.appendChild(el("div", "ex-score-label", sc.label));
      c.appendChild(el("div", "ex-score-value", sc.value + " / " + sc.max));
      c.appendChild(el("div", "ex-score-min " + (ok ? "ex-ok" : "ex-ng"), (ok ? "✓ " : "✗ ") + "Điểm liệt: " + sc.min));
      scores.appendChild(c);
    });
    scroll.appendChild(scores);

    var done = el("div", "ex-card");
    done.appendChild(el("div", "ex-card-title", "Mức độ hoàn thành"));
    var stat = el("div", "ex-stat-row");
    [
      ["Đã trả lời", r.answered + "/" + r.count + " (" + pct(r.answered, r.count) + "%)"],
      ["Đúng", r.correct + "/" + r.count + " (" + pct(r.correct, r.count) + "%)"],
      ["Thời gian", fmtTime(r.elapsedSec) + " / " + fmtTime(r.timeLimitSec) + (r.timedOut ? " (hết giờ)" : "")]
    ].forEach(function (x) {
      var cell = el("div", "ex-stat");
      cell.appendChild(el("div", "ex-muted", x[0]));
      cell.appendChild(el("div", "ex-stat-value", x[1]));
      stat.appendChild(cell);
    });
    done.appendChild(stat);
    var notes = el("ul", "ex-notes");
    assessment(r, s).forEach(function (n) { notes.appendChild(el("li", "", n)); });
    done.appendChild(notes);
    scroll.appendChild(done);

    var breakdown = el("div", "ex-card");
    breakdown.appendChild(el("div", "ex-card-title", "Kết quả theo phần"));
    SECTIONS.forEach(function (sec) {
      var st = r.stats[sec.key];
      if (!st.t) return;
      breakdown.appendChild(buildBarRow(sec.jp + " · " + sec.vi, st.c, st.t, "ex-bar-row--head"));
      r.byPart.forEach(function (b) {
        if (b.section === sec.key) breakdown.appendChild(buildBarRow(PARTS[b.code].jp, b.correct, b.total, ""));
      });
    });
    scroll.appendChild(breakdown);

    var actions = el("div", "btn-row");
    actions.appendChild(btn("btn", "✨ Tạo đề mới", function () { ui.view = "home"; render(); }));
    actions.appendChild(btn("btn-ghost", "↻ Làm lại đề này", function () {
      if (!confirm("Làm lại đề này từ đầu (xoá đáp án đã chọn, đặt lại thời gian)?")) return;
      session.answers = {};
      session.elapsedSec = 0;
      session.submitted = false;
      session.timedOut = false;
      session.result = null;
      session.scroll = null;
      session.parts.forEach(function (p) {
        p.groups.forEach(function (g) {
          g.questions.forEach(function (q) {
            var correct = q.options[q.answer];
            q.options = shuffle(q.options);
            q.answer = q.options.indexOf(correct);
          });
        });
      });
      ui.section = session.parts[0].section;
      saveSession();
      ui.view = "exam";
      render();
    }));
    scroll.appendChild(actions);

    var review = el("div", "ex-card");
    review.appendChild(el("div", "ex-card-title", "Xem lại đáp án"));
    var filterRow = el("div", "chip-group ex-chips");
    [["all", "Tất cả"], ["wrong", "Chỉ câu sai / bỏ trống"]].forEach(function (f) {
      filterRow.appendChild(btn("chip ex-chip" + (ui.reviewFilter === f[0] ? " chip--active" : ""), f[1], function () {
        ui.reviewFilter = f[0];
        var y = scroll.scrollTop;
        render();
        var sc = document.querySelector("#exam-container .ex-scroll");
        if (sc) sc.scrollTop = y;
      }));
    });
    review.appendChild(filterRow);
    sessionSections(s).forEach(function (sec) {
      review.appendChild(el("div", "ex-review-sec", sec.jp + " · " + sec.vi));
      var mondai = 0;
      s.parts.forEach(function (p) {
        if (p.section !== sec.key) return;
        mondai++;
        var block = buildPartBlock(s, p, mondai, true);
        if (block.querySelector(".ex-q")) review.appendChild(block);
      });
    });
    scroll.appendChild(review);
  }

  function buildBarRow(label, c, t, extraClass) {
    var p = pct(c, t);
    var row = el("div", "ex-bar-row " + extraClass);
    row.appendChild(el("span", "ex-bar-label", label));
    var track = el("span", "ex-bar-track");
    var fill = el("span", "ex-bar-fill " + (p >= 70 ? "ex-bar-fill--good" : p >= 50 ? "ex-bar-fill--mid" : "ex-bar-fill--low"));
    fill.style.width = p + "%";
    track.appendChild(fill);
    row.appendChild(track);
    row.appendChild(el("span", "ex-bar-value", c + "/" + t + " · " + p + "%"));
    return row;
  }

  function buildReviewQuestion(s, p, q) {
    var chosen = s.answers[q.id];
    var right = chosen === q.answer;
    var box = el("div", "ex-q ex-q--review " + (right ? "ex-q--right" : "ex-q--wrong"));
    var head = el("div", "ex-q-head");
    head.appendChild(el("span", "ex-q-no", q.id.slice(1)));
    head.appendChild(rich("div", "ex-q-text" + (p.code === "YOUHOU" ? " ex-q-text--word" : ""), q.q));
    head.appendChild(el("span", "ex-q-mark", right ? "○" : (chosen == null ? "—" : "×")));
    box.appendChild(head);
    var opts = el("div", optionsClass(q));
    q.options.forEach(function (o, i) {
      var cls = "ex-opt ex-opt--static";
      if (i === q.answer) cls += " ex-opt--correct";
      else if (i === chosen) cls += " ex-opt--wrong";
      var b = el("div", cls);
      b.appendChild(el("span", "ex-opt-no", String(i + 1)));
      b.appendChild(rich("span", "ex-opt-text", o));
      opts.appendChild(b);
    });
    box.appendChild(opts);
    if (chosen == null) box.appendChild(el("div", "ex-explain ex-ng", "Chưa chọn đáp án."));
    if (q.full) box.appendChild(rich("div", "ex-explain ex-full", "Câu đúng: " + q.full));
    if (q.explain) box.appendChild(el("div", "ex-explain", q.explain));
    return box;
  }

  // ===================== Khởi tạo =====================

  function setup() {
    var sec = document.getElementById("section-exam");
    if (!sec) return;
    // Mỗi lần tab Luyện thi được mở thì vẽ lại màn hiện tại (thi tiếp ngay nếu đang làm dở)
    var wasActive = false;
    var observer = new MutationObserver(function () {
      var active = isSectionActive();
      if (active && !wasActive) {
        timer.last = Date.now();
        render();
      }
      if (!active && wasActive && session && !session.submitted) saveSession();
      wasActive = active;
    });
    observer.observe(sec, { attributes: true, attributeFilter: ["class"] });
    if (isSectionActive()) {
      wasActive = true;
      render();
    }
    timer.last = Date.now();
    setInterval(tick, 1000);
    function persist() {
      if (session && !session.submitted) saveSession();
    }
    document.addEventListener("visibilitychange", function () {
      timer.last = Date.now();
      if (document.hidden) persist();
    });
    window.addEventListener("pagehide", persist);
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
