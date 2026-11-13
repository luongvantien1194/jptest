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
      section: "vocab", jp: "漢字読み", vi: "Cách đọc Kanji", w: 0.5, out: 2,
      ins: "＿＿のことばの読み方として最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn cách đọc của từ gạch chân.",
      spec: "q là 1 câu, trong đó 1 từ viết bằng kanji đặt trong 【】; options là 4 cách đọc bằng hiragana (sai kiểu trường âm, âm đục, âm ngắt, âm On/Kun dễ nhầm)."
    },
    HYOKI: {
      section: "vocab", jp: "表記", vi: "Cách viết", w: 0.5, out: 2,
      ins: "＿＿のことばを漢字で書くとき、最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn cách viết (Kanji / Katakana) của từ gạch chân.",
      spec: "q là 1 câu, trong đó 1 từ viết bằng hiragana đặt trong 【】; options là 4 cách viết bằng kanji (hoặc katakana) giống nhau về hình / âm."
    },
    GOKEI: {
      section: "vocab", jp: "語形成", vi: "Ghép từ", w: 0.6, out: 2,
      ins: "（　）に入れるのに最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn tiền tố / hậu tố ghép vào từ.",
      spec: "q là 1 câu có （　） viết liền với 1 từ (chỗ cần tiền tố / hậu tố tạo từ ghép, vd 再～, ～化, ～的, 未～); options là 4 tiền tố / hậu tố."
    },
    BUNMYAKU: {
      section: "vocab", jp: "文脈規定", vi: "Điền từ theo ngữ cảnh", w: 0.7, out: 2.2,
      ins: "（　）に入れるのに最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn từ hợp ngữ cảnh điền vào chỗ trống.",
      spec: "q là 1 câu có （　）; options là 4 từ cùng loại từ, chỉ 1 từ hợp ngữ cảnh."
    },
    IIKAE: {
      section: "vocab", jp: "言い換え類義", vi: "Từ gần nghĩa", w: 0.7, out: 2.4,
      ins: "＿＿に意味が最も近いものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn từ / câu gần nghĩa nhất với phần gạch chân.",
      spec: "q là 1 câu có 1 từ / cụm đặt trong 【】; options là 4 từ / cụm (hoặc 4 câu ngắn), chỉ 1 cái gần nghĩa nhất với phần 【】."
    },
    YOUHOU: {
      section: "vocab", jp: "用法", vi: "Cách dùng từ", w: 1.2, out: 4,
      ins: "つぎのことばの使い方として最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn câu dùng từ đã cho đúng nhất.",
      spec: "q chỉ ghi đúng từ được hỏi; options là 4 câu đều có dùng từ đó, chỉ 1 câu dùng đúng nghĩa / ngữ cảnh."
    },
    KEISHIKI: {
      section: "grammar", jp: "文法形式の判断", vi: "Chọn ngữ pháp đúng", w: 0.8, out: 2.4,
      ins: "つぎの文の（　）に入れるのに最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Chọn mẫu ngữ pháp / trợ từ / cách chia điền vào chỗ trống.",
      spec: "q là 1 câu (có thể là hội thoại ngắn A：… B：…) có （　）; options là 4 mẫu ngữ pháp / trợ từ / cách chia, chỉ 1 đúng."
    },
    NARABE: {
      section: "grammar", jp: "文の組み立て", vi: "Sắp xếp câu (★)", w: 1.2, out: 3,
      ins: "つぎの文の ★ に入る最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Sắp xếp 4 cụm thành câu đúng, chọn cụm nằm ở vị trí ★.",
      spec: "q là câu có đúng 4 chỗ trống viết ＿＿ cách nhau bằng dấu cách, 1 trong 4 chỗ thay bằng ★ (vị trí ★ đổi giữa các câu), vd: \"あそこで ＿＿ ＿＿ ★ ＿＿ は田中さんです。\"; options là 4 cụm cần xếp vào 4 chỗ trống; answer là cụm đứng ở vị trí ★; thêm full: câu hoàn chỉnh đã xếp đúng."
    },
    BUNSHOU: {
      section: "grammar", jp: "文章の文法", vi: "Ngữ pháp trong đoạn văn", w: 1, out: 3, passage: true,
      ins: "つぎの文章を読んで、文章全体の内容を考えて、（1）、（2）…の中に入る最もよいものを、1・2・3・4から一つえらびなさい。",
      hint: "Đọc đoạn văn, chọn cụm điền vào từng chỗ trống đánh số.",
      spec: "passage là 1 bài văn / bức thư ~{len} chữ có các chỗ trống đánh số （1）（2）… theo thứ tự; mỗi câu hỏi q chỉ ghi số chỗ trống, vd \"（1）\"; options là 4 cụm (ngữ pháp, từ nối, cách chia, từ chỉ định) điền vào chỗ đó."
    },
    TANBUN: {
      section: "reading", jp: "内容理解（短文）", vi: "Đọc hiểu đoạn ngắn", w: 1.5, out: 2.8, passage: true,
      ins: "つぎの文章を読んで、質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。",
      hint: "Đọc đoạn văn ngắn và trả lời câu hỏi.",
      spec: "passage là 1 đoạn văn ngắn ~{len} chữ (thư, email, thông báo, ghi chú, đoạn nhận xét…); câu hỏi về ý chính / chi tiết / điều người viết muốn nói."
    },
    CHUBUN: {
      section: "reading", jp: "内容理解（中文）", vi: "Đọc hiểu đoạn trung bình", w: 1.5, out: 2.8, passage: true,
      ins: "つぎの文章を読んで、質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。",
      hint: "Đọc bài văn độ dài trung bình và trả lời câu hỏi.",
      spec: "passage là bài văn ~{len} chữ (bài luận, giải thích, tuỳ bút…); câu hỏi về nguyên nhân, lý do, ý nghĩa của câu / cụm đặt trong 【】 trong bài, ý người viết."
    },
    CHOUBUN: {
      section: "reading", jp: "内容理解（長文）", vi: "Đọc hiểu đoạn dài", w: 1.5, out: 2.8, passage: true,
      ins: "つぎの文章を読んで、質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。",
      hint: "Đọc bài văn dài và trả lời câu hỏi.",
      spec: "passage là bài văn dài ~{len} chữ; câu hỏi về toàn bài: diễn biến, lập luận, ý chính, ý người viết."
    },
    TOUGOU: {
      section: "reading", jp: "統合理解", vi: "Đọc hiểu tổng hợp (A–B)", w: 2, out: 2.8, passage: true, twin: true,
      ins: "つぎのAとBの文章を読んで、後の質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。",
      hint: "Đọc 2 bài A và B cùng chủ đề, so sánh / tổng hợp để trả lời.",
      spec: "passage gồm 2 bài A và B cùng 1 chủ đề nhưng quan điểm khác nhau, mỗi bài ~{len} chữ, dòng đầu mỗi bài chỉ ghi \"A\" / \"B\"; câu hỏi so sánh, tổng hợp ý 2 bài."
    },
    SHUCHOU: {
      section: "reading", jp: "主張理解（長文）", vi: "Hiểu chủ trương (dài)", w: 2, out: 2.8, passage: true,
      ins: "つぎの文章を読んで、後の質問に答えなさい。答えは、1・2・3・4から最もよいものを一つえらびなさい。",
      hint: "Đọc bài bình luận dài, nắm chủ trương / ý kiến của tác giả.",
      spec: "passage là bài bình luận / xã luận dài ~{len} chữ có lập luận rõ ràng; câu hỏi về chủ trương, ý kiến của tác giả."
    },
    JOUHOU: {
      section: "reading", jp: "情報検索", vi: "Tìm thông tin", w: 1.5, out: 2.8, passage: true,
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
      fraction: fractionOf(c.fraction).value,
      chunk: chunkOf(c.chunk).value
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

  /** Cỡ mỗi phần prompt (đơn vị ≈ 1 câu trắc nghiệm ngắn): ChatGPT trả quá dài hay bị dừng giữa chừng → chia nhỏ */
  var CHUNK_SIZES = [
    { value: "small", label: "Ít", limit: 20 },
    { value: "medium", label: "Vừa", limit: 32 },
    { value: "large", label: "Nhiều", limit: 50 }
  ];
  function chunkOf(value) {
    return CHUNK_SIZES.filter(function (c) { return c.value === value; })[0] || CHUNK_SIZES[1];
  }

  /** Khối lượng ChatGPT phải viết cho 1 cụm câu / bài đọc */
  function pieceWeight(code, count, passages, len) {
    var def = PARTS[code];
    return (def.passage ? passages * len * (def.twin ? 2 : 1) / 100 : 0) + count * def.out;
  }

  /** Tách 1 dạng quá lớn thành nhiều mảnh (theo câu, hoặc theo bài đọc) để mỗi mảnh không vượt `limit` */
  function splitPart(p, limit) {
    var def = PARTS[p.code];
    var base = { code: p.code, section: p.section, len: p.len, extra: p.extra };
    if (!def.passage) {
      var maxQ = Math.max(1, Math.floor(limit / def.out));
      return distribute(p.count, Math.ceil(p.count / maxQ)).map(function (n) {
        return Object.assign({}, base, { count: n });
      });
    }
    var pieces = [];
    var cur = null;
    p.passages.forEach(function (qn) {
      var w = pieceWeight(p.code, qn, 1, p.len);
      if (cur && cur.w + w > limit) {
        pieces.push(cur);
        cur = null;
      }
      if (!cur) cur = Object.assign({}, base, { count: 0, passages: [], w: 0 });
      cur.count += qn;
      cur.passages.push(qn);
      cur.w += w;
    });
    if (cur) pieces.push(cur);
    pieces.forEach(function (x) { delete x.w; });
    return pieces;
  }

  /** Chia đề thành nhiều phần, mỗi phần là 1 prompt riêng: [{ parts, count, codes }] */
  function buildBatches(parts, limit) {
    var batches = [];
    var cur = null;
    var curW = 0;
    parts.forEach(function (p) {
      splitPart(p, limit).forEach(function (piece) {
        var w = pieceWeight(piece.code, piece.count, piece.passages ? piece.passages.length : 0, piece.len);
        if (cur && curW + w > limit) {
          batches.push(cur);
          cur = null;
        }
        if (!cur) {
          cur = { parts: [], count: 0 };
          curW = 0;
        }
        var last = cur.parts[cur.parts.length - 1];
        if (last && last.code === piece.code) {
          last.count += piece.count;
          if (piece.passages) last.passages = last.passages.concat(piece.passages);
        } else {
          cur.parts.push(piece);
        }
        cur.count += piece.count;
        curW += w;
      });
    });
    if (cur) batches.push(cur);
    batches.forEach(function (b) { b.codes = b.parts.map(function (p) { return p.code; }); });
    return batches;
  }

  /** Bộ prompt của đề (hoặc phần bổ sung): mỗi phần 1 prompt độc lập, gửi lần lượt cho ChatGPT */
  function buildPromptSet(level, parts, chunkValue, opts) {
    var batches = buildBatches(parts, chunkOf(chunkValue).limit);
    return batches.map(function (b, i) {
      return {
        codes: b.codes,
        count: b.count,
        parts: b.parts,
        prompt: buildPrompt(level, b.parts, Object.assign({}, opts || {}, { index: i + 1, total: batches.length }))
      };
    });
  }

  function describePartCount(p) {
    if (!p.passages) return p.count + " câu";
    if (p.passages.length === 1) return "1 bài × " + p.count + " câu";
    var same = p.passages.every(function (n) { return n === p.passages[0]; });
    return p.passages.length + " bài" + (same ? " × " + p.passages[0] + " câu" : " (" + p.passages.join(" + ") + " câu)") +
      " = " + p.count + " câu";
  }

  /**
   * opts: { index, total } = phần thứ mấy / tổng số phần; supplement: true = prompt bổ sung câu còn thiếu;
   * used: [từ đã hỏi] để ChatGPT không ra trùng.
   */
  function buildPrompt(level, parts, opts) {
    opts = opts || {};
    var multi = opts.total > 1;
    var tag = multi ? " (phần " + opts.index + "/" + opts.total + ")" : "";
    var quality = "câu hỏi mới do bạn tự soạn, đúng độ khó, từ vựng, ngữ pháp, chủ đề và văn phong của đề JLPT " + level + " thật";
    var lines;
    if (opts.supplement) {
      lines = [
        "Bạn là người ra đề thi JLPT. Đề thi thử JLPT " + level + " (chỉ phần 言語知識 và 読解) của tôi đang bị THIẾU một số câu. " +
        "Hãy soạn BỔ SUNG" + tag + " đúng các câu dưới đây: " + quality + "; " +
        "không lặp lại câu / bài đọc đã ra trước đó trong cuộc trò chuyện này (nếu có).",
        "",
        "Cần bổ sung (mã | phần | dạng | số lượng):"
      ];
    } else if (multi) {
      lines = [
        "Bạn là người ra đề thi JLPT. Tôi soạn 1 đề thi thử JLPT " + level + " (chỉ phần 言語知識 và 読解, không có 聴解), " +
        "chia làm " + opts.total + " phần để mỗi lần trả lời không quá dài. Đây là PHẦN " + opts.index + "/" + opts.total +
        ": chỉ soạn đúng các mục dưới đây (các phần khác tôi gửi riêng). Yêu cầu " + quality + "; " +
        "không lặp lại câu, từ được hỏi hay bài đọc đã ra ở các phần trước trong cuộc trò chuyện này (nếu có).",
        "",
        "Phần này gồm (mã | phần | dạng | số lượng):"
      ];
    } else {
      lines = [
        "Bạn là người ra đề thi JLPT. Hãy soạn 1 đề thi thử JLPT " + level + " (chỉ phần 言語知識 và 読解, không có 聴解). " +
        "Toàn bộ là " + quality + ".",
        "",
        "Cấu trúc đề (mã | phần | dạng | số lượng):"
      ];
    }
    parts.forEach(function (p) {
      var def = PARTS[p.code];
      lines.push(p.code + " | " + sectionOf(def.section).jp + " | " + def.jp + " | " + describePartCount(p));
    });
    lines.push(
      "",
      "Yêu cầu chung:",
      "- Mỗi câu có đúng 4 đáp án, chỉ 1 đúng; 3 đáp án sai phải hợp lý, dễ nhầm như đề thật. answer: chép y nguyên nội dung đáp án đúng (không ghi số thứ tự).",
      "- Từ / phần được gạch chân đặt trong 【】; chỗ trống viết （　）. Câu hỏi và đáp án viết bằng tiếng Nhật như đề thật.",
      "- Lời giải (tiếng Việt, không nhắc tới số thứ tự đáp án): vi = dịch câu hỏi (câu có chỗ trống thì dịch câu hoàn chỉnh đã điền đáp án đúng); " +
      "explain = 2-4 câu giải thích chi tiết vì sao đáp án đúng; wrong = mảng, mỗi đáp án sai 1 phần tử dạng \"<đáp án>: nghĩa / vì sao sai\".",
      "- Không lặp lại từ, mẫu ngữ pháp hay chủ đề giữa các câu; vị trí đáp án đúng phân bố ngẫu nhiên."
    );
    if (opts.used && opts.used.length) {
      lines.push("- Các từ / cụm sau đã được hỏi, không dùng lại làm từ được hỏi: " + opts.used.join("、"));
    }
    var sectionsIn = {};
    parts.forEach(function (p) { sectionsIn[PARTS[p.code].section] = true; });
    if (sectionsIn.vocab) {
      lines.push("- Phần 文字・語彙: thêm words = các từ liên quan (từ được hỏi, đáp án đúng và các đáp án là từ vựng), mỗi từ {\"w\": cách viết, \"r\": cách đọc hiragana, \"m\": nghĩa tiếng Việt}.");
    }
    if (sectionsIn.grammar) {
      lines.push("- Phần 文法: thêm grammar = mẫu ngữ pháp dùng trong đáp án đúng (và mẫu dễ nhầm ở đáp án sai nếu có), mỗi mẫu " +
        "{\"pattern\": mẫu (vd ～ために), \"syntax\": cấu trúc nối (vd V辞書形 / Nの + ために), \"meaning\": nghĩa tiếng Việt, \"note\": lưu ý cách dùng / phân biệt với mẫu gần giống}.");
    }
    if (sectionsIn.reading) {
      lines.push("- Phần 読解: thêm evidence = câu trích nguyên văn trong bài làm căn cứ cho đáp án.");
    }
    lines.push(
      "",
      "Mô tả từng dạng:"
    );
    parts.forEach(function (p) {
      lines.push("- " + p.code + ": " + PARTS[p.code].spec.replace("{len}", String(p.len)));
    });
    lines.push(
      "",
      "Định dạng: chỉ trả về đúng 1 code block JSON {\"items\":[...]} (không viết gì ngoài code block). Mỗi phần tử theo mẫu:"
    );
    // Mẫu JSON cho từng kiểu có trong phần này (câu lẻ từ vựng / ngữ pháp, bài đọc ngữ pháp / đọc hiểu)
    var sampleKinds = {};
    parts.forEach(function (p) {
      var kind = PARTS[p.code].section + (p.passages ? "-passage" : "-single");
      if (!sampleKinds[kind]) sampleKinds[kind] = p.code;
    });
    Object.keys(sampleKinds).forEach(function (kind) {
      var code = sampleKinds[kind];
      var q = questionSample(PARTS[code].section);
      if (kind.indexOf("-passage") !== -1) {
        lines.push("- bài đọc " + code + " (mỗi bài 1 phần tử): " + JSON.stringify({ part: code, passage: "", questions: [q] }));
      } else {
        lines.push("- câu lẻ " + code + ": " + JSON.stringify(Object.assign({ part: code }, q)) +
          (parts.some(function (p) { return p.code === "NARABE"; }) && PARTS[code].section === "grammar" ? " (NARABE thêm \"full\": câu hoàn chỉnh)" : ""));
      }
    });
    if (parts.some(function (p) { return p.passages; })) lines.push("Xuống dòng trong passage dùng \\n.");
    if (multi || opts.supplement) {
      lines.push("Chỉ soạn đúng số lượng ở trên, không soạn thêm các dạng khác.");
    }
    return lines.join("\n");
  }

  /** Mẫu JSON 1 câu hỏi kèm lời giải theo phần (từ vựng: words, ngữ pháp: grammar, đọc hiểu: evidence) */
  function questionSample(section) {
    var q = { q: "", options: ["", "", "", ""], answer: "", vi: "", explain: "", wrong: ["", "", ""] };
    if (section === "vocab") q.words = [{ w: "", r: "", m: "" }];
    if (section === "grammar") q.grammar = [{ pattern: "", syntax: "", meaning: "", note: "" }];
    if (section === "reading") q.evidence = "";
    return q;
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
    return {
      q: q, options: options, answer: idx, explain: str(obj.explain), full: str(obj.full),
      vi: str(obj.vi || obj.translation), wrong: parseWrong(obj.wrong), words: parseWords(obj.words || obj.word),
      grammar: parseGrammar(obj.grammar), evidence: str(obj.evidence)
    };
  }

  // Lời giải chi tiết: ChatGPT có thể trả object / chuỗi thay vì mảng → chuẩn hoá, bỏ mục rỗng
  function asList(v) {
    if (v == null || v === "") return [];
    return Array.isArray(v) ? v : [v];
  }
  function parseWrong(v) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return Object.keys(v).map(function (k) { return k + ": " + str(v[k]); }).slice(0, 6);
    }
    return asList(v).map(function (x) {
      if (x && typeof x === "object") return str(x.option || x.answer || "") + ": " + str(x.reason || x.why || x.explain || "");
      return str(x);
    }).filter(function (x) { return x && x !== ":"; }).slice(0, 6);
  }
  function parseWords(v) {
    return asList(v).map(function (x) {
      if (typeof x === "string") return { w: str(x), r: "", m: "" };
      if (!x || typeof x !== "object") return null;
      return { w: str(x.w || x.word), r: str(x.r || x.reading), m: str(x.m || x.meaning) };
    }).filter(function (x) { return x && (x.w || x.m); }).slice(0, 8);
  }
  function parseGrammar(v) {
    return asList(v).map(function (x) {
      if (typeof x === "string") return { pattern: str(x), syntax: "", meaning: "", note: "" };
      if (!x || typeof x !== "object") return null;
      return {
        pattern: str(x.pattern || x.name || x.grammar),
        syntax: str(x.syntax || x.structure || x.form),
        meaning: str(x.meaning || x.m),
        note: str(x.note || x.usage)
      };
    }).filter(function (x) { return x && (x.pattern || x.syntax); }).slice(0, 4);
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

  /** Đọc 1 khối JSON → { list, error } (khối bị cắt dở thì nhặt các object còn trọn vẹn) */
  function parseChunk(chunk) {
    var start = chunk.search(/[\[{]/);
    if (start === -1) return { list: [] };
    var src = chunk.slice(start);
    var body = src.slice(0, Math.max(src.lastIndexOf("}"), src.lastIndexOf("]")) + 1);
    var data = null;
    var error = "";
    [body, body.replace(/,\s*([}\]])/g, "$1")].forEach(function (c) {
      if (data != null) return;
      try { data = JSON.parse(c); } catch (e) { if (!error) error = e.message; }
    });
    if (data != null) {
      var list = Array.isArray(data) ? data : (data.items || [data]);
      return { list: Array.isArray(list) ? list : [] };
    }
    // Bị cắt dở: chỉ lấy object có "part" (bỏ object câu hỏi con bên trong)
    return {
      list: salvageObjects(src).filter(function (o) { return o && typeof o === "object" && (o.part || o.type); }),
      error: error
    };
  }

  /**
   * → { groups, skipped } hoặc { error }.
   * Tách từng code block / từng khối {"items":…} ra đọc riêng: khối trước bị ChatGPT cắt giữa chừng (chuỗi chưa đóng)
   * không làm hỏng các khối dán sau (các lần "tiếp", data bổ sung).
   */
  function parseData(text) {
    var src = String(text || "").trim();
    if (!src) return { error: "Chưa dán dữ liệu." };
    var chunks = [];
    src.split(/```[a-z]*/i).forEach(function (part) {
      part.split(/(?=\{\s*"items"\s*:)/).forEach(function (c) {
        if (/[\[{]/.test(c)) chunks.push(c);
      });
    });
    if (!chunks.length) return { error: "Không tìm thấy dữ liệu JSON trong nội dung đã dán." };
    var list = [];
    var firstError = "";
    chunks.forEach(function (c) {
      var r = parseChunk(c);
      list = list.concat(r.list);
      if (r.error && !firstError) firstError = r.error;
    });
    var data = list.length ? true : null;
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
  /** Lấy lần lượt câu / bài đọc của dạng cho tới khi đủ số câu (bài đọc bổ sung cho phần thiếu cũng được tính) */
  function takeGroups(planPart, groups) {
    var out = [];
    var n = 0;
    groups.forEach(function (g) {
      if (g.part !== planPart.code || n >= planPart.count) return;
      out.push(g);
      n += g.questions.length;
    });
    return out;
  }

  /** Số câu còn thiếu theo dạng → cấu trúc đề bổ sung (chỉ gồm số câu / bài đọc còn thiếu) */
  function missingPartsFrom(pending, deficit) {
    var out = [];
    pending.parts.forEach(function (p) {
      var m = deficit[p.code] || 0;
      if (m <= 0) return;
      var part = { code: p.code, section: p.section, count: m, len: p.len, extra: p.extra };
      if (PARTS[p.code].passage) {
        var src = LEVELS[pending.level].parts.filter(function (x) { return x.code === p.code; })[0];
        var per = src ? src.per : 1;
        part.passages = distribute(m, Math.max(1, Math.round(m / per)));
      }
      out.push(part);
    });
    return out;
  }

  /** Bộ prompt từng phần của đề (đề cũ lưu trước khi có chia phần thì soạn lại) */
  function pendingPrompts(pending) {
    if (!Array.isArray(pending.prompts) || !pending.prompts.length) {
      pending.chunk = chunkOf(pending.chunk).value;
      pending.prompts = buildPromptSet(pending.level, pending.parts, pending.chunk);
    }
    return pending.prompts;
  }

  /**
   * Tình trạng từng phần prompt theo data đã dán: done (đủ) / partial (ChatGPT dừng giữa chừng) / waiting (chưa dán).
   * Dạng bị tách ra nhiều phần thì câu nhận được tính lần lượt cho phần trước rồi phần sau.
   */
  function promptStatus(pending, groups) {
    var got = receivedByPart(pending.parts, groups);
    var used = {};
    return pendingPrompts(pending).map(function (pr) {
      var have = 0;
      var deficit = {};
      pr.parts.forEach(function (p) {
        var before = used[p.code] || 0;
        var g = Math.max(0, Math.min(p.count, got[p.code] - before));
        have += g;
        deficit[p.code] = (deficit[p.code] || 0) + p.count - g;
        used[p.code] = before + p.count;
      });
      return { have: have, count: pr.count, deficit: deficit, state: have >= pr.count ? "done" : (have ? "partial" : "waiting") };
    });
  }

  /** Câu / từ đã có trong data (để dặn ChatGPT không ra trùng khi bổ sung) */
  function usedTopics(groups) {
    var words = [];
    groups.forEach(function (g) {
      g.questions.forEach(function (q) {
        var m = /【([^【】]+)】/.exec(q.q);
        if (m && words.indexOf(m[1]) === -1) words.push(m[1]);
      });
    });
    return words.slice(0, 60);
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
              full: q.full,
              vi: q.vi,
              wrong: q.wrong,
              words: q.words,
              grammar: q.grammar,
              evidence: q.evidence
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

    card.appendChild(el("div", "ex-field-label", "Mỗi lần ChatGPT sinh"));
    var chunkRow = el("div", "chip-group ex-chips");
    CHUNK_SIZES.forEach(function (c) {
      chunkRow.appendChild(btn("chip ex-chip" + (cfg.chunk === c.value ? " chip--active" : ""), c.label, function () {
        cfg.chunk = c.value;
        save(CONFIG_KEY, cfg);
        render();
      }));
    });
    card.appendChild(chunkRow);
    var promptCount = buildBatches(parts, chunkOf(cfg.chunk).limit).length;
    card.appendChild(el("div", "ex-note",
      promptCount > 1
        ? "Đề chia làm " + promptCount + " phần (mỗi phần 1 prompt riêng) để ChatGPT không bị dừng vì trả lời quá dài. ChatGPT vẫn bị dừng giữa chừng thì chọn \"Ít\" để chia nhỏ hơn."
        : "Cả đề sinh trong 1 lần. ChatGPT bị dừng giữa chừng thì chọn \"Ít\" để chia làm nhiều phần nhỏ."));

    var genRow = el("div", "btn-row");
    genRow.appendChild(btn("btn", "✨ Tạo đề (ChatGPT)", function () {
      var cur = loadSession();
      if (cur && !cur.submitted && !confirm("Đang có bài thi làm dở. Tạo đề mới thì bài đó sẽ bị bỏ khi bắt đầu thi đề mới. Tiếp tục?")) return;
      var prompts = buildPromptSet(cfg.level, parts, cfg.chunk);
      var p = {
        createdAt: Date.now(),
        level: cfg.level,
        fraction: cfg.fraction,
        chunk: cfg.chunk,
        parts: parts,
        prompts: prompts,
        prompt: prompts[0].prompt,
        copied: { 0: true },
        draft: ""
      };
      save(PENDING_KEY, p);
      copyText(prompts[0].prompt);
      window.open(chatGptUrl(prompts[0].prompt), "_blank", "noopener");
      ui.view = "paste";
      render();
    }));
    card.appendChild(genRow);
    card.appendChild(el("div", "ex-note",
      "App soạn prompt theo cấu trúc đề JLPT thật rồi mở ChatGPT với prompt phần 1 (prompt cũng được copy sẵn). ChatGPT tự sinh câu hỏi & đáp án theo level; " +
      "copy khối JSON ChatGPT trả về, quay lại đây dán vào rồi lấy prompt phần tiếp theo."));
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
    pendingPrompts(pending);
    pending.copied = pending.copied || {};
    header(root, "Dán đề từ ChatGPT", [{ text: pending.level + " · " + fractionOf(pending.fraction).label }]);
    var scroll = el("div", "ex-scroll scroll-thin");
    root.appendChild(scroll);
    var card = el("div", "ex-card");
    scroll.appendChild(card);

    var multi = pending.prompts.length > 1;
    var steps = el("ol", "gx-steps");
    [
      multi
        ? "Đề chia làm " + pending.prompts.length + " phần, mỗi phần 1 prompt. Gửi lần lượt từng prompt cho ChatGPT, nên gửi trong cùng 1 cuộc trò chuyện để không ra trùng câu."
        : "Gửi prompt cho ChatGPT (ChatGPT đã mở sẵn với prompt; nếu ô chat trống thì dán prompt đã copy vào).",
      "ChatGPT trả xong thì bấm Copy ở khối JSON, quay lại đây bấm \"Dán từ clipboard\" (các lần dán được nối tiếp vào ô dán)." +
        (multi ? " Rồi copy prompt phần kế tiếp." : ""),
      "ChatGPT dừng giữa chừng → app báo phần còn thiếu và soạn prompt bổ sung. Vẫn hay bị dừng → chọn cỡ \"Ít\" để chia nhỏ hơn.",
      "Đủ câu thì bấm \"Bắt đầu thi\"."
    ].forEach(function (t) { steps.appendChild(el("li", "", t)); });
    card.appendChild(steps);

    // Cỡ mỗi phần: đổi thì chia lại prompt (data đã dán vẫn giữ, tính theo số câu từng dạng)
    var chunkRow = el("div", "ex-chunk-row");
    chunkRow.appendChild(el("span", "ex-field-label", "Mỗi lần ChatGPT sinh:"));
    var chunkChips = el("div", "chip-group ex-chips");
    CHUNK_SIZES.forEach(function (c) {
      chunkChips.appendChild(btn("chip ex-chip" + (pending.chunk === c.value ? " chip--active" : ""), c.label, function () {
        if (pending.chunk === c.value) return;
        pending.chunk = c.value;
        pending.prompts = buildPromptSet(pending.level, pending.parts, pending.chunk);
        pending.prompt = pending.prompts[0].prompt;
        pending.copied = {};
        pending.draft = textarea.value;
        save(PENDING_KEY, pending);
        var cfg = loadConfig();
        cfg.chunk = c.value;
        save(CONFIG_KEY, cfg);
        render();
      }));
    });
    chunkRow.appendChild(chunkChips);
    card.appendChild(chunkRow);

    var promptList = el("div", "ex-prompt-list");
    card.appendChild(promptList);

    var textarea = el("textarea", "input-text gx-textarea ex-textarea");
    textarea.rows = 6;
    textarea.spellcheck = false;
    textarea.placeholder = "Dán khối JSON ChatGPT trả về: {\"items\":[ ... ]}";
    textarea.value = pending.draft || "";
    var status = el("div", "gx-status");

    var pasteRow = el("div", "btn-row");
    if (navigator.clipboard && navigator.clipboard.readText) {
      pasteRow.appendChild(btn("btn", "📥 Dán từ clipboard", function () {
        navigator.clipboard.readText().then(function (text) {
          var cur = textarea.value.trim();
          if (!text.trim()) return;
          textarea.value = cur && cur.indexOf(text.trim()) === -1 ? cur + "\n" + text : (cur || text);
          refresh();
        }).catch(function () {
          setStatus("Trình duyệt không cho đọc clipboard — hãy nhấn giữ vào ô dán và chọn Dán.", true);
          textarea.focus();
        });
      }));
    }
    pasteRow.appendChild(btn("btn-ghost", "Xoá ô dán", function () {
      if (textarea.value.trim() && !confirm("Xoá toàn bộ data đã dán?")) return;
      textarea.value = "";
      refresh();
    }));
    card.appendChild(pasteRow);
    card.appendChild(textarea);
    card.appendChild(status);
    var progress = el("div", "ex-progress-list");
    card.appendChild(progress);
    var missingBox = el("div", "ex-missing");
    card.appendChild(missingBox);

    function setStatus(text, isError) {
      status.textContent = text || "";
      status.className = "gx-status" + (text ? (isError ? " gx-status--error" : " gx-status--ok") : "");
    }

    /** Nút copy / mở ChatGPT cho 1 prompt */
    function promptButtons(prompt, onCopy, primary) {
      var row = el("div", "ex-prompt-btns");
      row.appendChild(btn(primary ? "btn ex-btn-sm" : "btn-ghost ex-btn-sm", "📋 Copy prompt", function () {
        copyText(prompt, function (ok) {
          setStatus(ok ? "Đã copy prompt — dán vào cuộc trò chuyện ChatGPT rồi gửi." : "Không copy được prompt.", !ok);
        });
        if (onCopy) onCopy();
      }, "Copy để dán vào cuộc trò chuyện ChatGPT đang mở (nên dùng)"));
      var link = el("a", "btn-ghost ex-btn-sm", "↗ ChatGPT mới");
      link.href = chatGptUrl(prompt);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.title = "Mở cuộc trò chuyện mới với prompt này";
      link.addEventListener("click", function () {
        copyText(prompt);
        if (onCopy) onCopy();
      });
      row.appendChild(link);
      return row;
    }

    function renderPromptList(statuses) {
      promptList.innerHTML = "";
      var nextIdx = -1;
      statuses.forEach(function (st, i) {
        if (nextIdx === -1 && st.state !== "done") nextIdx = i;
      });
      pending.prompts.forEach(function (pr, i) {
        var st = statuses[i];
        var row = el("div", "ex-prompt-row ex-prompt-row--" + st.state + (i === nextIdx ? " ex-prompt-row--next" : ""));
        var info = el("div", "ex-prompt-info");
        var title = el("div", "ex-prompt-title", (multi ? "Phần " + (i + 1) + "/" + pending.prompts.length : "Prompt đề thi") + " · " + pr.count + " câu");
        var stateText = st.state === "done" ? "✓ Đã đủ"
          : st.state === "partial" ? "Thiếu " + (st.count - st.have) + " câu"
            : (pending.copied[i] ? "Đã copy · chờ dán" : "Chưa dán");
        title.appendChild(el("span", "ex-prompt-state", stateText));
        info.appendChild(title);
        info.appendChild(el("div", "ex-muted", pr.parts.map(function (p) {
          return PARTS[p.code].jp + " " + p.count;
        }).join(" · ")));
        row.appendChild(info);
        if (st.state !== "done") {
          row.appendChild(promptButtons(pr.prompt, function () {
            pending.copied[i] = true;
            save(PENDING_KEY, pending);
            renderPromptList(statuses);
          }, i === nextIdx));
        }
        promptList.appendChild(row);
      });
    }

    function renderMissing(statuses, groups) {
      missingBox.innerHTML = "";
      // Chỉ bổ sung cho phần ChatGPT đã trả nhưng bị thiếu (phần chưa dán thì gửi prompt của phần đó)
      var deficit = {};
      statuses.forEach(function (st) {
        if (st.state !== "partial") return;
        Object.keys(st.deficit).forEach(function (code) { deficit[code] = (deficit[code] || 0) + st.deficit[code]; });
      });
      var parts = missingPartsFrom(pending, deficit);
      missingBox.style.display = parts.length ? "" : "none";
      if (!parts.length) return;
      missingBox.appendChild(el("div", "ex-missing-title",
        "⚠ ChatGPT trả thiếu " + countPlanQuestions(parts) + " câu ở " + parts.length + " dạng"));
      var list = el("ul", "ex-missing-list");
      parts.forEach(function (p) {
        var li = el("li", "");
        li.appendChild(el("span", "ex-progress-code", p.code));
        li.appendChild(document.createTextNode(" " + PARTS[p.code].jp + ": " + describePartCount(p)));
        list.appendChild(li);
      });
      missingBox.appendChild(list);
      var supp = buildPromptSet(pending.level, parts, pending.chunk, { supplement: true, used: usedTopics(groups) });
      missingBox.appendChild(el("div", "ex-note",
        "Gửi prompt bổ sung (chỉ xin đúng các câu còn thiếu ở trên)" + (supp.length > 1 ? ", chia " + supp.length + " phần" : "") +
        " rồi dán JSON bổ sung nối tiếp vào ô dán. Nên gửi vào cùng cuộc trò chuyện cũ để không ra trùng câu."));
      supp.forEach(function (pr, i) {
        var row = el("div", "ex-prompt-row ex-prompt-row--supp");
        var info = el("div", "ex-prompt-info");
        info.appendChild(el("div", "ex-prompt-title", "Bổ sung" + (supp.length > 1 ? " " + (i + 1) + "/" + supp.length : "") + " · " + pr.count + " câu"));
        info.appendChild(el("div", "ex-muted", pr.parts.map(function (p) { return PARTS[p.code].jp + " " + p.count; }).join(" · ")));
        row.appendChild(info);
        row.appendChild(promptButtons(pr.prompt, null, true));
        missingBox.appendChild(row);
      });
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
        var n = Math.min(got[p.code], p.count);
        gotTotal += n;
        var ok = n >= p.count;
        var row = el("div", "ex-progress-row" + (ok ? " ex-progress-row--ok" : (n ? " ex-progress-row--part" : "")));
        row.appendChild(el("span", "ex-progress-code", p.code));
        row.appendChild(el("span", "", PARTS[p.code].jp));
        row.appendChild(el("span", "ex-progress-count", (ok ? "✓ " : "") + n + "/" + p.count));
        progress.appendChild(row);
      });
      var statuses = promptStatus(pending, groups);
      renderPromptList(statuses);
      renderMissing(statuses, groups);
      if (!lastParse) setStatus("");
      else if (lastParse.error) setStatus(lastParse.error, true);
      else setStatus("Đã đọc được " + gotTotal + "/" + countPlanQuestions(pending.parts) + " câu" +
        (lastParse.skipped ? " (bỏ qua " + lastParse.skipped + " mục không hợp lệ)" : "") + ".", false);
    }
    textarea.addEventListener("input", refresh);
    refresh();

    var row = el("div", "btn-row");
    row.appendChild(btn("btn", "▶ Bắt đầu thi", function () {
      refresh();
      if (!lastParse || lastParse.error) {
        setStatus(lastParse ? lastParse.error : "Chưa dán dữ liệu.", true);
        return;
      }
      var got = receivedByPart(pending.parts, lastParse.groups);
      var missing = pending.parts.filter(function (p) { return got[p.code] < p.count; });
      if (missing.length && !confirm(
        "Còn thiếu câu ở: " + missing.map(function (p) { return PARTS[p.code].jp + " (" + got[p.code] + "/" + p.count + ")"; }).join(", ") + ".\n" +
        "OK: thi luôn với các câu đã có (thời gian tính lại theo số câu).\n" +
        "Huỷ: gửi tiếp prompt các phần còn lại / prompt bổ sung.")) {
        promptList.scrollIntoView({ block: "start", behavior: "smooth" });
        return;
      }
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
    box.appendChild(buildAnswerDetail(q, chosen));
    return box;
  }

  /** Lời giải chi tiết: đáp án đúng / đã chọn, dịch câu, mẫu ngữ pháp (cấu trúc), từ vựng, giải thích, vì sao đáp án khác sai */
  function buildAnswerDetail(q, chosen) {
    var d = el("div", "ex-detail");
    var ans = el("div", "ex-detail-answer");
    ans.appendChild(el("span", "ex-ok", "Đáp án: " + (q.answer + 1) + ". "));
    ans.appendChild(rich("span", "ex-detail-jp", q.options[q.answer]));
    if (chosen == null) ans.appendChild(el("span", "ex-ng", " · Chưa chọn đáp án"));
    else if (chosen !== q.answer) {
      ans.appendChild(el("span", "ex-ng", " · Bạn chọn: " + (chosen + 1) + ". "));
      ans.appendChild(rich("span", "ex-detail-jp", q.options[chosen]));
    }
    d.appendChild(ans);

    if (q.full) d.appendChild(detailRow("Câu đúng", rich("span", "ex-detail-jp", q.full)));
    if (q.vi) d.appendChild(detailRow("Dịch", el("span", "", q.vi)));

    (q.grammar || []).forEach(function (g) {
      var card = el("div", "ex-gram");
      if (g.pattern) card.appendChild(rich("div", "ex-gram-pattern", g.pattern));
      if (g.syntax) {
        var syn = el("div", "ex-gram-line");
        syn.appendChild(el("span", "ex-gram-label", "Cấu trúc"));
        syn.appendChild(el("span", "ex-gram-syntax", g.syntax));
        card.appendChild(syn);
      }
      if (g.meaning) {
        var mean = el("div", "ex-gram-line");
        mean.appendChild(el("span", "ex-gram-label", "Nghĩa"));
        mean.appendChild(el("span", "", g.meaning));
        card.appendChild(mean);
      }
      if (g.note) {
        var note = el("div", "ex-gram-line");
        note.appendChild(el("span", "ex-gram-label", "Lưu ý"));
        note.appendChild(el("span", "", g.note));
        card.appendChild(note);
      }
      d.appendChild(card);
    });

    if (q.words && q.words.length) {
      var words = el("div", "ex-words");
      q.words.forEach(function (w) {
        var row = el("div", "ex-word");
        row.appendChild(el("span", "ex-word-w", w.w));
        if (w.r && w.r !== w.w) row.appendChild(el("span", "ex-word-r", "【" + w.r + "】"));
        if (w.m) row.appendChild(el("span", "ex-word-m", w.m));
        words.appendChild(row);
      });
      d.appendChild(words);
    }

    if (q.evidence) d.appendChild(detailRow("Căn cứ", rich("span", "ex-detail-jp", "「" + q.evidence.replace(/^「|」$/g, "") + "」")));
    if (q.explain) d.appendChild(detailRow("Giải thích", el("span", "", q.explain)));
    if (q.wrong && q.wrong.length) {
      var wrongBox = el("div", "ex-detail-row");
      wrongBox.appendChild(el("span", "ex-detail-label", "Đáp án khác"));
      var ul = el("ul", "ex-wrong-list");
      q.wrong.forEach(function (w) { ul.appendChild(rich("li", "", w)); });
      wrongBox.appendChild(ul);
      d.appendChild(wrongBox);
    }
    return d;
  }

  function detailRow(label, valueNode) {
    var row = el("div", "ex-detail-row");
    row.appendChild(el("span", "ex-detail-label", label));
    var val = el("div", "ex-detail-value");
    val.appendChild(valueNode);
    row.appendChild(val);
    return row;
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
