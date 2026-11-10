// Tra nhanh khi bôi đen / nhấn đúp chữ tiếng Nhật ở bất kỳ màn nào (đề luyện thi, ghi chú, ngữ pháp…):
// hiện popup gồm cách đọc, Hán Việt, nghĩa (tra từ điển dựng từ data từ vựng + từ ghép trong data Kanji của app),
// tách cụm thành từng từ, chi tiết từng chữ Kanji (Hán Việt / On / Kun / nghĩa), nút đọc (giọng ja-JP) và link tra ngoài.
// Động từ / tính từ đã chia (起きました, 書いて, 高くない…) được đưa về dạng gốc để tra.
// Bật/tắt ở menu ☰ → "Tra nhanh khi bôi đen" (lưu localStorage jp_lookup_settings).
(function () {
  "use strict";

  var SETTINGS_KEY = "jp_lookup_settings";
  /** Bôi đen dài hơn mức này (vd cả đoạn văn) thì không hiện popup */
  var MAX_LEN = 30;
  /** Từ dài nhất thử khớp khi tách cụm */
  var MAX_WORD = 12;
  var MAX_ENTRIES = 4;

  var settings = loadSettings();
  var dict = null;
  var kanjiMap = null;
  var dictSize = -1;
  var popup = null;
  var lastKey = "";
  var timer = null;

  function loadSettings() {
    try {
      var s = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
      return { enabled: s.enabled !== false };
    } catch (e) {
      return { enabled: true };
    }
  }
  function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { }
  }

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text != null) e.textContent = String(text);
    return e;
  }

  // ===================== Ký tự =====================

  function isKanji(ch) {
    var c = ch.codePointAt(0);
    return (c >= 0x4E00 && c <= 0x9FFF) || (c >= 0x3400 && c <= 0x4DBF) || ch === "々";
  }
  function isKana(ch) {
    var c = ch.codePointAt(0);
    return (c >= 0x3041 && c <= 0x309F) || (c >= 0x30A0 && c <= 0x30FF);
  }
  function hasJapanese(s) {
    for (var i = 0; i < s.length; i++) {
      if (isKanji(s[i]) || isKana(s[i])) return true;
    }
    return false;
  }
  function hasKanji(s) {
    for (var i = 0; i < s.length; i++) {
      if (isKanji(s[i])) return true;
    }
    return false;
  }
  /** Katakana → hiragana (để tra từ viết bằng katakana / so cách đọc) */
  function toHira(s) {
    return s.replace(/[ァ-ヶ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0x60); });
  }
  /** Bỏ khoảng trắng, dấu câu, ～, ngoặc trang trí */
  function clean(s) {
    return String(s || "").replace(/[\s　～~〜。、．，,.!！?？「」『』【】""'’"・…:：]/g, "");
  }

  // ===================== Từ điển =====================

  function getVocab() {
    // vocabData / kanjiData là biến const toàn cục của các file data (main.js đã gộp phần extra vào khi load)
    var v = typeof vocabData !== "undefined" && Array.isArray(vocabData) ? vocabData : [];
    return v;
  }
  function getKanjiList() {
    var k = typeof kanjiData !== "undefined" && Array.isArray(kanjiData) ? kanjiData : [];
    return k;
  }

  function addEntry(key, entry) {
    key = clean(key);
    if (!key || !hasJapanese(key)) return;
    var list = dict[key] || (dict[key] = []);
    for (var i = 0; i < list.length; i++) {
      if (list[i].w === entry.w && list[i].r === entry.r && list[i].m === entry.m) return;
    }
    list.push(entry);
  }

  /** "トイレ（お手洗い）" / "静か(な)" / "私/わたし" → các cách viết */
  function variants(s) {
    s = String(s || "");
    var out = [];
    var inner = /[（(]([^）)]*)[）)]/.exec(s);
    var base = s.replace(/[（(][^）)]*[）)]/g, "");
    base.split(/[\/／、,]/).forEach(function (x) { if (clean(x)) out.push(x); });
    if (inner && hasJapanese(inner[1]) && !/^な$/.test(inner[1])) out.push(inner[1]);
    return out;
  }

  /** Động từ lưu dạng ます (Minna) + Vru (dạng từ điển hiragana) → dạng từ điển viết Kanji, vd 起きます + おきる → 起きる */
  function kanjiDictForm(kanji, hira, vru) {
    if (!/ます$/.test(kanji) || !/ます$/.test(hira)) return "";
    var kStem = kanji.slice(0, -2);
    var hStem = hira.slice(0, -2);
    var i = 0;
    while (i < hStem.length && i < vru.length && hStem[i] === vru[i]) i++;
    var removed = hStem.slice(i);
    if (removed && kStem.slice(-removed.length) !== removed) return "";
    return kStem.slice(0, kStem.length - removed.length) + vru.slice(i);
  }

  function buildDict() {
    var vocab = getVocab();
    var kanjiList = getKanjiList();
    var size = vocab.length + kanjiList.length;
    if (dict && dictSize === size) return;
    dict = {};
    kanjiMap = {};
    dictSize = size;
    vocab.forEach(function (v) {
      if (!v) return;
      var hira = clean(variants(v.Hiragana)[0] || v.Hiragana);
      var meaning = String(v.Meaning || "").replace(/\s*\n\s*/g, "; ").trim();
      if (!meaning) return;
      var kanjiForms = variants(v.Kanji).map(clean).filter(Boolean);
      var word = kanjiForms[0] || hira;
      var entry = { w: word, r: hira, m: meaning, lv: String(v.level || "").toUpperCase() };
      kanjiForms.forEach(function (k) { addEntry(k, entry); });
      variants(v.Hiragana).forEach(function (h) { addEntry(h, entry); });
      var vru = clean(v.Vru);
      if (vru && hasJapanese(vru)) {
        var dictEntry = { w: kanjiDictForm(kanjiForms[0] || "", hira, vru) || vru, r: vru, m: meaning, lv: entry.lv, masu: word };
        addEntry(vru, dictEntry);
        if (dictEntry.w !== vru) addEntry(dictEntry.w, dictEntry);
      }
    });
    kanjiList.forEach(function (k) {
      if (!k || !k.kanji) return;
      var ch = String(k.kanji).trim();
      if (!kanjiMap[ch]) kanjiMap[ch] = k;
      // Từ ghép trong data Kanji: "日本(にほん):nhật bản|休日(きゅうじつ):ngày nghỉ"
      String(k.vocabulary || "").split("|").forEach(function (item) {
        var m = /^\s*([^(（:：]+)[(（]([^)）]+)[)）]\s*[:：]\s*(.+)$/.exec(item);
        if (!m) return;
        var entry = { w: clean(m[1]), r: clean(m[2]), m: m[3].trim(), lv: "" };
        addEntry(m[1], entry);
      });
    });
  }

  // ===================== Đưa từ đã chia về dạng gốc =====================

  var RULES = [];
  function rule(from, to, label) { RULES.push([from, to, label]); }
  (function buildRules() {
    ["ました", "ません", "ませんでした", "ましょう", "ませ"].forEach(function (s) { rule(s, "ます", "lịch sự"); });
    // Nhóm II (る): stem + đuôi
    [["ます", "lịch sự"], ["ました", "lịch sự, quá khứ"], ["ません", "phủ định lịch sự"], ["ませんでした", "phủ định quá khứ"],
      ["て", "thể て"], ["た", "thể た"], ["ない", "thể ない"], ["なかった", "phủ định quá khứ"], ["たい", "muốn"],
      ["られる", "bị động / khả năng"], ["させる", "sai khiến"], ["よう", "ý chí"], ["れば", "điều kiện"], ["ろ", "mệnh lệnh"],
      ["ず", "phủ định"], ["ながら", "vừa…vừa"], ["ている", "đang"], ["ていた", "đã đang"], ["ています", "đang"]
    ].forEach(function (x) { rule(x[0], "る", x[1]); });
    var I = "いきぎしちにびみり", U = "うくぐすつぬぶむる", A = "わかがさたなばまら", E = "えけげせてねべめれ", O = "おこごそとのぼもろ";
    for (var i = 0; i < U.length; i++) {
      [["ます", "lịch sự"], ["ました", "lịch sự, quá khứ"], ["ません", "phủ định lịch sự"], ["ませんでした", "phủ định quá khứ"],
        ["たい", "muốn"], ["たかった", "đã muốn"], ["ながら", "vừa…vừa"], ["ましょう", "rủ rê"]
      ].forEach(function (x) { rule(I[i] + x[0], U[i], x[1]); });
      [["ない", "thể ない"], ["なかった", "phủ định quá khứ"], ["れる", "bị động"], ["せる", "sai khiến"], ["ず", "phủ định"], ["なければ", "phải"]
      ].forEach(function (x) { rule(A[i] + x[0], U[i], x[1]); });
      [["る", "khả năng"], ["ば", "điều kiện"], ["ない", "khả năng phủ định"], ["ます", "khả năng lịch sự"]
      ].forEach(function (x) { rule(E[i] + x[0], U[i], x[1]); });
      rule(O[i] + "う", U[i], "ý chí");
      rule(E[i], U[i], "mệnh lệnh");
    }
    [["って", ["う", "つ", "る", "く"]], ["った", ["う", "つ", "る", "く"]], ["んで", ["む", "ぶ", "ぬ"]], ["んだ", ["む", "ぶ", "ぬ"]],
      ["いて", ["く"]], ["いた", ["く"]], ["いで", ["ぐ"]], ["いだ", ["ぐ"]], ["して", ["す"]], ["した", ["す"]]
    ].forEach(function (x) {
      x[1].forEach(function (to) { rule(x[0], to, x[0].slice(-1) === "て" || x[0].slice(-1) === "で" ? "thể て" : "thể た"); });
    });
    [["して", "thể て"], ["した", "thể た"], ["しない", "thể ない"], ["しなかった", "phủ định quá khứ"], ["します", "lịch sự"],
      ["しました", "lịch sự, quá khứ"], ["される", "bị động"], ["させる", "sai khiến"], ["しよう", "ý chí"], ["すれば", "điều kiện"],
      ["できる", "khả năng"], ["している", "đang"]
    ].forEach(function (x) { rule(x[0], "する", x[1]); });
    [["くない", "phủ định"], ["くなかった", "phủ định quá khứ"], ["かった", "quá khứ"], ["くて", "thể て"], ["く", "trạng từ"],
      ["ければ", "điều kiện"], ["さ", "danh từ hoá"], ["そう", "trông có vẻ"], ["くなる", "trở nên"]
    ].forEach(function (x) { rule(x[0], "い", x[1]); });
    [["な", "bổ nghĩa danh từ"], ["に", "trạng từ"], ["だ", ""], ["で", ""], ["です", ""], ["じゃない", "phủ định"], ["ではない", "phủ định"]
    ].forEach(function (x) { rule(x[0], "", x[1]); });
  })();

  /**
   * Tra 1 chuỗi: khớp nguyên văn trước, không có thì thử đưa về dạng gốc. → { entries, form, rule } | null.
   * inSentence: đang tách câu → bỏ luật cắt な/に/で/だ (dễ nuốt nhầm trợ từ, vd 図書館で)
   */
  function lookupWord(s, inSentence) {
    if (!s) return null;
    var keys = [s];
    var hira = toHira(s);
    if (hira !== s) keys.push(hira);
    for (var k = 0; k < keys.length; k++) {
      if (dict[keys[k]]) return { entries: dict[keys[k]], form: keys[k], surface: s };
    }
    for (var i = 0; i < RULES.length; i++) {
      var r = RULES[i];
      if (inSentence && r[1] === "") continue;
      if (s.length <= r[0].length || s.slice(-r[0].length) !== r[0]) continue;
      var form = s.slice(0, s.length - r[0].length) + r[1];
      if (dict[form]) return { entries: dict[form], form: form, surface: s, from: r[0], to: r[1], label: r[2] };
    }
    return null;
  }

  /** Cách đọc của dạng đang bôi đen (từ khớp qua dạng gốc thì đổi lại đuôi) */
  function surfaceReading(match, entry) {
    if (!match.from && match.from !== "") return entry.r;
    if (match.to && entry.r.slice(-match.to.length) !== match.to) return "";
    return entry.r.slice(0, entry.r.length - (match.to || "").length) + match.from;
  }

  /** Tách cụm thành các từ có trong từ điển (khớp dài nhất từ trái sang) */
  function segment(text) {
    var segs = [];
    var pos = 0;
    while (pos < text.length) {
      var found = null;
      for (var len = Math.min(MAX_WORD, text.length - pos); len >= 1; len--) {
        var sub = text.substr(pos, len);
        // Chuỗi toàn kana ngắn (は, して…) dễ khớp nhầm → chỉ nhận từ kana từ 3 chữ trở lên
        if (!hasKanji(sub) && len < 3) continue;
        var m = lookupWord(sub, true);
        if (m) {
          found = m;
          break;
        }
      }
      if (found) {
        segs.push({ text: found.surface, match: found });
        pos += found.surface.length;
      } else {
        var ch = text[pos];
        var last = segs[segs.length - 1];
        if (last && !last.match && !isKanji(ch) && !isKanji(last.text.slice(-1))) last.text += ch;
        else segs.push({ text: ch, match: null });
        pos++;
      }
    }
    return segs;
  }

  function hanViet(text) {
    var out = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (!isKanji(ch) || ch === "々") continue;
      var k = kanjiMap[ch];
      out.push(k && k.hanviet ? String(k.hanviet).split("|")[0].trim().toUpperCase() : "?");
    }
    return out.join(" ");
  }

  // ===================== Popup =====================

  function speak(text) {
    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      u.rate = 0.9;
      var ja = window.speechSynthesis.getVoices().filter(function (v) { return /^ja/i.test(v.lang); })[0];
      if (ja) u.voice = ja;
      window.speechSynthesis.speak(u);
    } catch (e) { }
  }

  function closePopup() {
    if (popup) popup.classList.remove("jl-popup--open");
    lastKey = "";
  }

  function ensurePopup() {
    if (popup) return popup;
    popup = el("div", "jl-popup");
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-label", "Tra nhanh");
    // Bấm trong popup không làm mất vùng đang bôi đen
    popup.addEventListener("mousedown", function (e) {
      if (!e.target.closest("a")) e.preventDefault();
    });
    document.body.appendChild(popup);
    return popup;
  }

  function entryBlock(entry, match) {
    var box = el("div", "jl-entry");
    var head = el("div", "jl-entry-head");
    head.appendChild(el("span", "jl-entry-word", entry.w));
    var reading = surfaceReading(match, entry);
    if (entry.r && entry.r !== entry.w) head.appendChild(el("span", "jl-entry-reading", "【" + entry.r + "】"));
    if (entry.lv) head.appendChild(el("span", "jl-entry-lv", entry.lv));
    box.appendChild(head);
    if (match.form !== match.surface) {
      var note = "Dạng gốc của " + match.surface + (match.label ? " (" + match.label + ")" : "");
      if (reading && reading !== match.surface) note += " · đọc: " + reading;
      box.appendChild(el("div", "jl-entry-note", note));
    }
    if (entry.masu && entry.masu !== entry.w) box.appendChild(el("div", "jl-entry-note", "Thể ます: " + entry.masu));
    box.appendChild(el("div", "jl-entry-meaning", entry.m));
    return box;
  }

  function linkBtn(text, href, title) {
    var a = el("a", "jl-link", text);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    if (title) a.title = title;
    return a;
  }

  function render(text) {
    buildDict();
    var p = ensurePopup();
    p.innerHTML = "";

    var head = el("div", "jl-head");
    head.appendChild(el("div", "jl-text", text));
    var speakBtn = el("button", "jl-icon-btn", "🔊");
    speakBtn.type = "button";
    speakBtn.title = "Đọc";
    speakBtn.addEventListener("click", function () { speak(text); });
    head.appendChild(speakBtn);
    var closeBtn = el("button", "jl-icon-btn", "✕");
    closeBtn.type = "button";
    closeBtn.title = "Đóng";
    closeBtn.addEventListener("click", closePopup);
    head.appendChild(closeBtn);
    p.appendChild(head);

    var body = el("div", "jl-body");
    p.appendChild(body);

    var whole = lookupWord(text);
    var segs = whole ? [{ text: text, match: whole }] : segment(text);

    // Cách đọc cả cụm: ghép từ các từ khớp được (thiếu chữ Kanji nào thì không ghép)
    var reading = "";
    var readable = segs.every(function (s) {
      if (s.match) {
        var r = surfaceReading(s.match, s.match.entries[0]);
        if (!r) return false;
        reading += r;
        return true;
      }
      if (hasKanji(s.text)) return false;
      reading += toHira(s.text);
      return true;
    });
    var info = el("div", "jl-info");
    if (readable && reading && reading !== text) info.appendChild(infoRow("Cách đọc", reading, "jl-reading"));
    var hv = hanViet(text);
    if (hv) info.appendChild(infoRow("Hán Việt", hv, "jl-hv"));
    if (info.children.length) body.appendChild(info);

    if (whole) {
      whole.entries.slice(0, MAX_ENTRIES).forEach(function (en) { body.appendChild(entryBlock(en, whole)); });
    } else {
      var words = segs.filter(function (s) { return s.match; });
      if (words.length) {
        body.appendChild(el("div", "jl-section-title", "Các từ trong cụm"));
        var chips = el("div", "jl-segs");
        segs.forEach(function (s) {
          chips.appendChild(el("span", s.match ? "jl-seg jl-seg--word" : "jl-seg", s.text));
        });
        body.appendChild(chips);
        var shown = {};
        words.forEach(function (s) {
          var en = s.match.entries[0];
          var key = en.w + "|" + en.r;
          if (shown[key]) return;
          shown[key] = true;
          body.appendChild(entryBlock(en, s.match));
        });
      } else {
        body.appendChild(el("div", "jl-empty", "Chưa có trong từ điển của app — xem cách đọc / nghĩa bằng các link bên dưới."));
      }
    }

    // Chi tiết từng chữ Kanji
    var seen = {};
    var kanjiBox = el("div", "jl-kanji-list");
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (!isKanji(ch) || ch === "々" || seen[ch]) continue;
      seen[ch] = true;
      var k = kanjiMap[ch];
      var row = el("div", "jl-kanji");
      row.appendChild(el("span", "jl-kanji-char", ch));
      var desc = el("div", "jl-kanji-desc");
      if (k) {
        var line1 = el("div", "jl-kanji-hv", String(k.hanviet || "").split("|").join(" / ").toUpperCase());
        if (k.core_meaning) line1.appendChild(el("span", "jl-kanji-mean", " · " + String(k.core_meaning).split("|").join(", ")));
        desc.appendChild(line1);
        var readings = [];
        if (k.on_reading) readings.push("On: " + String(k.on_reading).split("|").join("、"));
        if (k.kun_reading) readings.push("Kun: " + String(k.kun_reading).split("|").join("、"));
        if (readings.length) desc.appendChild(el("div", "jl-kanji-read", readings.join("  ·  ")));
      } else {
        desc.appendChild(el("div", "jl-kanji-read", "Chưa có trong data Kanji của app"));
      }
      row.appendChild(desc);
      kanjiBox.appendChild(row);
    }
    if (kanjiBox.children.length) {
      body.appendChild(el("div", "jl-section-title", "Kanji"));
      body.appendChild(kanjiBox);
    }

    var links = el("div", "jl-links");
    links.appendChild(linkBtn("Mazii", "https://mazii.net/vi-VN/search/word/javi/" + encodeURIComponent(text), "Tra từ điển Mazii (Nhật - Việt)"));
    links.appendChild(linkBtn("Google Dịch", "https://translate.google.com/?sl=ja&tl=vi&op=translate&text=" + encodeURIComponent(text)));
    links.appendChild(linkBtn("Hỏi ChatGPT", "https://chatgpt.com/?q=" + encodeURIComponent(
      "Giải thích từ / cụm tiếng Nhật 「" + text + "」 cho người Việt: cách đọc hiragana, âm Hán Việt, nghĩa tiếng Việt, " +
      "loại từ / cách dùng (nếu là dạng chia thì nêu dạng gốc), 2 câu ví dụ có dịch.")));
    p.appendChild(links);
  }

  function infoRow(label, value, cls) {
    var row = el("div", "jl-info-row");
    row.appendChild(el("span", "jl-info-label", label));
    row.appendChild(el("span", cls, value));
    return row;
  }

  function position(rect) {
    var p = popup;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var width = Math.min(360, vw - 16);
    p.style.width = width + "px";
    p.style.maxHeight = "";
    var left = Math.min(Math.max(8, rect.left + rect.width / 2 - width / 2), vw - width - 8);
    p.style.left = left + "px";
    var h = p.offsetHeight;
    var below = vh - rect.bottom - 10;
    var above = rect.top - 10;
    // Ưu tiên hiện phía dưới (phía trên thường là menu Copy / Tra cứu của điện thoại)
    if (below >= Math.min(h, 220) || below >= above) {
      p.style.top = (rect.bottom + 8) + "px";
      p.style.maxHeight = Math.max(160, below - 8) + "px";
    } else {
      p.style.maxHeight = Math.max(160, above - 8) + "px";
      p.style.top = Math.max(8, rect.top - 8 - Math.min(h, above - 8)) + "px";
    }
  }

  // ===================== Bắt sự kiện bôi đen =====================

  function selectionInfo() {
    var sel = window.getSelection ? window.getSelection() : null;
    if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
    var active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) return null;
    var range = sel.getRangeAt(0);
    var node = range.commonAncestorContainer;
    var elNode = node.nodeType === 1 ? node : node.parentElement;
    if (!elNode || (popup && popup.contains(elNode)) || elNode.closest("input, textarea, [contenteditable], .jl-popup")) return null;
    var text = clean(sel.toString());
    if (!text || text.length > MAX_LEN || !hasJapanese(text)) return null;
    var rect = range.getBoundingClientRect();
    if (!rect || (!rect.width && !rect.height)) return null;
    return { text: text, rect: rect };
  }

  function check() {
    if (!settings.enabled) return;
    var info = selectionInfo();
    if (!info) return;
    var key = info.text + "@" + Math.round(info.rect.top) + "," + Math.round(info.rect.left);
    if (key === lastKey && popup && popup.classList.contains("jl-popup--open")) return;
    lastKey = key;
    render(info.text);
    popup.classList.add("jl-popup--open");
    popup.scrollTop = 0;
    position(info.rect);
  }
  function schedule(delay) {
    clearTimeout(timer);
    timer = setTimeout(check, delay);
  }

  function updateMenuItem() {
    var item = document.getElementById("nav-menu-lookup");
    if (item) item.textContent = "🔎 Tra nhanh khi bôi đen: " + (settings.enabled ? "Bật" : "Tắt");
  }

  function setup() {
    // Chuột: thả chuột / nhấn đúp xong thì tra ngay; điện thoại: chờ kéo xong vùng chọn (selectionchange lặp liên tục)
    document.addEventListener("mouseup", function (e) {
      if (popup && popup.contains(e.target)) return;
      schedule(10);
    });
    document.addEventListener("selectionchange", function () { schedule(450); });
    document.addEventListener("pointerdown", function (e) {
      if (popup && popup.classList.contains("jl-popup--open") && !popup.contains(e.target)) closePopup();
    }, true);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePopup();
    });
    window.addEventListener("resize", closePopup);

    var item = document.getElementById("nav-menu-lookup");
    if (item) {
      updateMenuItem();
      item.addEventListener("click", function () {
        settings.enabled = !settings.enabled;
        saveSettings();
        updateMenuItem();
        if (!settings.enabled) closePopup();
      });
    }
  }

  // Cho phép module khác / console gọi thử: JpLookup.lookup("勉強しました")
  window.JpLookup = {
    lookup: function (text) {
      buildDict();
      var t = clean(text);
      return lookupWord(t) || { segments: segment(t), hanViet: hanViet(t) };
    }
  };

  document.addEventListener("DOMContentLoaded", setup);
})();
