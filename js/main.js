(function () {
  "use strict";

  // ========================
  // DATA & LOADING SECTION
  // ========================
  // Data from grammarData.js, kanjiData.js, vocabData.js

  const state = {
    currentTab: "vocab",
    filter: {
      isOnelesson: false,
      vocabLessonFrom: "1",
      vocabLessonTo: "",
      vocabCategory: "all",
      kanjiRadical: [],
      kanjiLevel: "n3",
      grammarLesson: "all",
      vocabSearch: "",
      vocabMastered: "all",
      kanjiSearch: "",
      grammarSearch: ""
    },
    displaySettings: {
      romaji: true,
      category: false,
      lession: true,
      hiragana: true,
      kanji: true,
      hanviet: true,
      meaning: true,
      vru: false,
      type: true,
      note: false,
      voice: true,
    },
    testState: {
      isActive: false,
      isFinished: false,
      questions: [],
      currentIndex: 0,
      correctCount: 0,
      answers: [],
      selectedCategory: "all",
      lessonMax: 50,
      questionCount: 20,
      optionCount: 6,
      questionField: "hiragana",
      answerField: "meaning",
      isStar: false,
      isNotMastered: false,
    },
    tts: {
      active: false,
      index: 0,
      lastKey: ""
    },
    kanjiTestState: {
      isActive: false,
      isFinished: false,
      questions: [],
      currentIndex: 0,
      correctCount: 0,
      answers: [],
      questionCount: 20,
      optionCount: 6,
      fromIdx: 0,
      toIdx: null,
      modes: [4],
      isStar: false,
      /** Sau mỗi câu: hiện chi tiết Kanji, bấm Tiếp tục để sang câu tiếp (mặc định tắt) */
      showAnswerKanjiDetailAfterEach: false
    },
    kanjiViewMode: "grid",
    note: {
      currentDocKey:
        window.DOC_CONFIG && window.DOC_CONFIG.defaultKey
          ? window.DOC_CONFIG.defaultKey
          : null,
      fontSize: 14,
      manualContent: null
    },
    selected: {
      vocabIndex: null,
      kanjiIndex: null,
      grammarIndex: null
    },
    kanjiHistory: [],
    ui: {
      displaySettingsOpen: false,
      detailModal: {
        isOpen: false,
        lastType: null
      },
      writingPractice: {
        penType: "calligraphy",
        lineWidth: 13
      },
      vocabListKey: "",
      kanjiVocabFavOnly: false,
      /** Khi mở chi tiết Kanji từ tab ⭐(kanji), đóng modal thì quay lại tab này */
      kanjiDetailReturnTab: null
    },
    vocabFavorites: {},
    vocabMastered: {},
    kanjiFavorites: {},
    kanjiVocabFavorites: {},
    vocabFavOnly: false,
    kanjiFavOnly: false,
    autoPlay: {
      active: false,
      timer: null,
      filteredIndices: []
    }
  };

  function clearVocabTtsFocus() {
    state.tts.index = 0;
    state.tts.lastKey = "";
    var highlighted = document.querySelectorAll(".vocab-item--highlight");
    highlighted.forEach(function (el) {
      el.classList.remove("vocab-item--highlight");
    });
    // Nếu không đang đọc, reset text nút về đúng trạng thái
    if (!state.tts.active) {
      var btn = document.getElementById("vocab-tts-btn");
      if (btn) {
        btn.textContent = "Đọc danh sách";
        btn.classList.remove("autoplay-btn--active");
        btn.title = "Đọc toàn bộ danh sách đang lọc";
      }
    }
  }

  function stopVocabTts() {
    state.tts.active = false;
    try { window.speechSynthesis.cancel(); } catch (e) { }
    var btn = document.getElementById("vocab-tts-btn");
    if (btn) {
      btn.textContent = state.tts.lastKey ? "Đọc tiếp" : "Đọc danh sách";
      btn.classList.remove("autoplay-btn--active");
      btn.title = state.tts.lastKey ? "Đọc tiếp danh sách" : "Đọc toàn bộ danh sách đang lọc";
    }
  }

  function exportVocabToMarkdown() {
    var list = applyVocabFilters();
    if (!list || list.length === 0) {
      alert("Không có từ vựng nào trong danh sách lọc để xuất!");
      return;
    }

    var mdContent = "";
    list.forEach(function (raw, index) {
      var hira = raw.hiragana != null ? raw.hiragana : raw.Hiragana;
      var kanji = raw.kanji != null ? raw.kanji : raw.Kanji;
      var mean = raw.meaning != null ? raw.meaning : raw.Meaning;

      // Mỗi từ là một dòng dạng danh sách
      var line = "- **" + hira + "**" + (kanji ? " (" + kanji + ")" : "") + ": " + mean;
      mdContent += line + "\n";
      if (index < list.length - 1) {
        mdContent += "---\n";
      }
    });

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(mdContent).then(function () {
        alert("Đã copy danh sách Markdown vào Clipboard thành công!");
        switchToManualNote(mdContent);
      }).catch(function (err) {
        alert("Lỗi khi copy vào Clipboard: " + err);
      });
    } else {
      // Fallback cho các trình duyệt cũ hoặc môi trường không hỗ trợ navigator.clipboard
      var textArea = document.createElement("textarea");
      textArea.value = mdContent;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert("Đã copy danh sách Markdown vào Clipboard thành công!");
        switchToManualNote(mdContent);
      } catch (err) {
        alert("Không thể copy vào Clipboard.");
      }
      document.body.removeChild(textArea);
    }
  }

  function switchToManualNote(content) {
    state.note.manualContent = content;
    state.note.currentDocKey = "__manual__";
    populateNoteSelect();
    window.location.hash = "#note";
  }

  function findBestVoiceByLang(langPrefix) {
    try {
      var voices = window.speechSynthesis && window.speechSynthesis.getVoices
        ? window.speechSynthesis.getVoices()
        : [];
      if (!voices || !voices.length) return null;
      var pref = String(langPrefix || "").toLowerCase();
      // ưu tiên voice đúng prefix lang (vi / ja)
      for (var i = 0; i < voices.length; i++) {
        var v = voices[i];
        if (v && v.lang && String(v.lang).toLowerCase().indexOf(pref) === 0) {
          return v;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function startVocabTts() {
    // TTS cần user gesture (click). Button này là gesture hợp lệ.
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      return;
    }
    stopAutoPlay(); // tránh 2 luồng audio chạy cùng lúc
    // Không clear highlight ở đây để có thể đọc tiếp
    stopVocabTts();

    state.tts.active = true;
    var btn = document.getElementById("vocab-tts-btn");
    if (btn) {
      btn.textContent = "Dừng đọc";
      btn.classList.add("autoplay-btn--active");
      btn.title = "Dừng đọc";
    }

    var list = applyVocabFilters();
    var key = list.map(function (r) { return String(vocabData.indexOf(r)); }).join(",");
    if (key !== state.tts.lastKey) {
      // Danh sách thay đổi -> reset lại từ đầu và clear focus
      state.tts.index = 0;
      clearVocabTtsFocus();
      state.tts.lastKey = key;
    }
    var idx = state.tts.index || 0;

    function getItemFields(raw) {
      return {
        hiragana: raw && (raw.hiragana != null ? raw.hiragana : raw.Hiragana),
        // Ưu tiên đúng cột Meaning (dữ liệu chuẩn), fallback cho dữ liệu cũ
        meaning: raw && (raw.Meaning != null ? raw.Meaning : raw.meaning)
      };
    }

    function speakUtterance(utter, onDone) {
      if (!utter) {
        onDone();
        return;
      }
      utter.onend = function () { onDone(); };
      utter.onerror = function () { onDone(); };
      try {
        window.speechSynthesis.speak(utter);
      } catch (e) {
        onDone();
      }
    }

    function speakNext() {
      if (!state.tts.active) return;
      if (idx >= list.length) {
        // đọc lại từ đầu khi hết danh sách
        idx = 0;
      }

      // Focus + scroll theo từ đang đọc
      var vocabIndexForFocus = vocabData.indexOf(list[idx]);
      if (vocabIndexForFocus !== -1) {
        var listContainer = document.getElementById("vocab-list-container");
        var prev = listContainer ? listContainer.querySelector(".vocab-item--highlight") : null;
        if (prev) prev.classList.remove("vocab-item--highlight");
        var el = listContainer
          ? listContainer.querySelector('.vocab-item[data-vocab-index="' + vocabIndexForFocus + '"]')
          : null;
        if (el) {
          el.classList.add("vocab-item--highlight");
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }

      var fields = getItemFields(list[idx]);
      state.tts.index = idx;
      idx += 1;

      var hira = String(fields.hiragana || "").trim();
      var mean = String(fields.meaning || "").trim();
      if (!hira && !mean) {
        speakNext();
        return;
      }

      // Preload voices (một số browser chỉ populate sau lần gọi đầu)
      try { window.speechSynthesis.getVoices(); } catch (e) { }

      var u1 = null;
      if (hira) {
        var hiraClean = String(hira).replace(/、/g, ",");
        u1 = new SpeechSynthesisUtterance(hiraClean);
        u1.lang = "ja-JP";
        u1.rate = 1;
        u1.volume = 1;
        var jaVoice = findBestVoiceByLang("ja");
        if (jaVoice) u1.voice = jaVoice;
      }

      var u2 = null;
      if (mean) {
        var meanClean = String(mean)
          .replace(/\s*\/\s*/g, ", ")
          .replace(/\s*,\s*/g, ", ")
          .replace(/,\s*,+/g, ", ")
          .trim();
        u2 = new SpeechSynthesisUtterance("có nghĩa là: " + meanClean);
        u2.lang = "vi-VN";
        u2.rate = 1;
        u2.volume = 0.4;
        var viVoice = findBestVoiceByLang("vi");
        if (viVoice) u2.voice = viVoice;
      }

      // Chain: JP -> VI -> next
      speakUtterance(u1, function () {
        speakUtterance(u2, function () {
          setTimeout(speakNext, 120);
        });
      });
    }

    speakNext();
  }

  function toggleVocabTts() {
    if (state.tts.active) {
      stopVocabTts();
    } else {
      startVocabTts();
    }
  }

  // Load favorites from localStorage
  try {
    var savedVF = localStorage.getItem("jp_vocab_favorites");
    if (savedVF) state.vocabFavorites = JSON.parse(savedVF);
    var savedVM = localStorage.getItem("jp_vocab_mastered");
    if (savedVM) state.vocabMastered = JSON.parse(savedVM);
    var savedKF = localStorage.getItem("jp_kanji_favorites");
    if (savedKF) state.kanjiFavorites = JSON.parse(savedKF);
    var savedKVF = localStorage.getItem("jp_kanji_vocab_favorites");
    if (savedKVF) state.kanjiVocabFavorites = JSON.parse(savedKVF);
    var savedDS = localStorage.getItem("jp_display_settings");
    if (savedDS) Object.assign(state.displaySettings, JSON.parse(savedDS));
  } catch (e) {
    // ignore parse errors
  }

  function saveVocabFavorites() {
    try { localStorage.setItem("jp_vocab_favorites", JSON.stringify(state.vocabFavorites)); } catch (e) { }
  }
  function saveVocabMastered() {
    try { localStorage.setItem("jp_vocab_mastered", JSON.stringify(state.vocabMastered)); } catch (e) { }
  }
  function saveDisplaySettings() {
    try { localStorage.setItem("jp_display_settings", JSON.stringify(state.displaySettings)); } catch (e) { }
  }
  function saveKanjiFavorites() {
    try { localStorage.setItem("jp_kanji_favorites", JSON.stringify(state.kanjiFavorites)); } catch (e) { }
  }
  function saveKanjiVocabFavorites() {
    try { localStorage.setItem("jp_kanji_vocab_favorites", JSON.stringify(state.kanjiVocabFavorites)); } catch (e) { }
  }

  // ========================
  // HELPER FUNCTIONS
  // ========================

  function normalizeText(str) {
    return String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getKanjiVocabFavKey(kanjiIndex, parts) {
    // parts: [word, reading, meaning]
    // Key includes kanjiIndex to avoid collisions between different kanji
    var w = String(parts && parts[0] != null ? parts[0] : "").trim();
    var r = String(parts && parts[1] != null ? parts[1] : "").trim();
    var m = String(parts && parts[2] != null ? parts[2] : "").trim();
    return String(kanjiIndex) + "|" + w + "|" + r + "|" + m;
  }

  /** Parse key lưu trong localStorage (jp_kanji_vocab_favorites) */
  function parseKanjiVocabFavKeyStorage(key) {
    var s = String(key || "");
    var i0 = s.indexOf("|");
    if (i0 === -1) {
      return null;
    }
    var ki = parseInt(s.slice(0, i0), 10);
    if (isNaN(ki) || ki < 0) {
      return null;
    }
    var rest = s.slice(i0 + 1);
    var p = rest.split("|");
    return {
      kanjiIndex: ki,
      word: p[0] != null ? p[0] : "",
      read: p[1] != null ? p[1] : "",
      mean: p[2] != null ? p[2] : ""
    };
  }

  function refreshStarsTabIfActive() {
    if (state.currentTab === "stars") {
      renderStarsTab();
    }
  }

  /**
   * Chuỗi đưa vào TTS cho từ trong list ⭐(kanji) — giống chi tiết Kanji:
   * chỉ đọc phần trước "(" của cột word (không đọc hiragana trong ngoặc).
   */
  function getStarsKanjiVocabSpeakText(parsed) {
    return String(parsed.word || "").split("(")[0].trim();
  }

  function getRadicalVietnameseLabel(radicalText) {
    var raw = String(radicalText || "").trim();
    if (!raw) return "";
    var dashIdx = raw.indexOf("-");
    if (dashIdx === -1) {
      return normalizeText(raw);
    }
    return normalizeText(raw.slice(dashIdx + 1).trim());
  }

  function selectKanjiRadicalsByVietnamese(vietnameseLabel) {
    var radicalSelect = document.getElementById("kanji-radical-filter");
    if (!radicalSelect) {
      return;
    }
    var targetLabel = normalizeText(vietnameseLabel || "");
    if (!targetLabel) {
      return;
    }

    var selectedValues = [];
    Array.prototype.forEach.call(radicalSelect.options, function (opt) {
      var optLabel = getRadicalVietnameseLabel(opt.value);
      var isMatch = optLabel && optLabel === targetLabel;
      opt.selected = !!isMatch;
      if (isMatch) {
        selectedValues.push(opt.value);
      }
    });

    state.filter.kanjiRadical = selectedValues;
    renderKanjiList();
    closeDetailModal();
  }

  // Map radicals / variant forms to canonical kanji for linking
  // Key: hình xuất hiện trong phần "Cấu tạo"
  // Value: kanji chuẩn có trong kanjiData (hoặc chính nó nếu trùng)
  const radicalToKanjiMap = {
    // 214 bộ thủ cơ bản (tự map vào chính nó)
    "一": "一", "丨": "丨", "丶": "丶", "丿": "丿", "乙": "乙", "亅": "亅",
    "二": "二", "亠": "亠", "人": "人", "儿": "儿", "入": "入", "八": "八",
    "冂": "冂", "冖": "冖", "冫": "冫", "几": "几", "凵": "凵", "刀": "刀",
    "力": "力", "勹": "勹", "匕": "匕", "匚": "匚", "匸": "匸", "十": "十",
    "卜": "卜", "卩": "卩", "厂": "厂", "厶": "厶", "又": "又", "口": "口",
    "囗": "囗", "土": "土", "士": "士", "夂": "夂", "夊": "夊", "夕": "夕",
    "大": "大", "女": "女", "子": "子", "宀": "宀", "寸": "寸", "小": "小",
    "尢": "尢", "尸": "尸", "屮": "屮", "山": "山", "巛": "巛", "工": "工",
    "己": "己", "巾": "巾", "干": "干", "幺": "幺", "广": "广", "廴": "廴",
    "廾": "廾", "弋": "弋", "弓": "弓", "彐": "彐", "彡": "彡", "彳": "彳",
    "心": "心", "戈": "戈", "戶": "戶", "手": "手", "支": "支", "攴": "攴",
    "文": "文", "斗": "斗", "斤": "斤", "方": "方", "无": "无", "日": "日",
    "曰": "曰", "月": "月", "木": "木", "欠": "欠", "止": "止", "歹": "歹",
    "殳": "殳", "毋": "毋", "比": "比", "毛": "毛", "氏": "氏", "气": "气",
    "水": "水", "火": "火", "爪": "爪", "父": "父", "爻": "爻", "爿": "爿",
    "片": "片", "牙": "牙", "牛": "牛", "犬": "犬", "玄": "玄", "玉": "玉",
    "瓜": "瓜", "瓦": "瓦", "甘": "甘", "生": "生", "用": "用", "田": "田",
    "疋": "疋", "疒": "疒", "癶": "癶", "白": "白", "皮": "皮", "皿": "皿",
    "目": "目", "矛": "矛", "矢": "矢", "石": "石", "示": "示", "禸": "禸",
    "禾": "禾", "穴": "穴", "立": "立", "竹": "竹", "米": "米", "糸": "糸",
    "缶": "缶", "网": "网", "羊": "羊", "羽": "羽", "老": "老", "而": "而",
    "耒": "耒", "耳": "耳", "聿": "聿", "肉": "肉", "臣": "臣", "自": "自",
    "至": "至", "臼": "臼", "舌": "舌", "舛": "舛", "舟": "舟", "艮": "艮",
    "色": "色", "艸": "艸", "虍": "虍", "虫": "虫", "血": "血", "行": "行",
    "衣": "衣", "襾": "襾", "見": "見", "角": "角", "言": "言", "谷": "谷",
    "豆": "豆", "豕": "豕", "豸": "豸", "貝": "貝", "赤": "赤", "走": "走",
    "足": "足", "身": "身", "車": "車", "辛": "辛", "辰": "辰", "辵": "辵",
    "邑": "邑", "酉": "酉", "釆": "釆", "里": "里", "金": "金", "長": "長",
    "門": "門", "阜": "阜", "隶": "隶", "隹": "隹", "雨": "雨", "靑": "靑",
    "非": "非", "面": "面", "革": "革", "韋": "韋", "韭": "韭", "音": "音",
    "頁": "頁", "風": "風", "飛": "飛", "食": "食", "首": "首", "香": "香",
    "馬": "馬", "骨": "骨", "高": "高", "髟": "髟", "鬥": "鬥", "鬯": "鬯",
    "鬲": "鬲", "鬼": "鬼", "魚": "魚", "鳥": "鳥", "鹵": "鹵", "鹿": "鹿",
    "麥": "麥", "麻": "麻", "黃": "黃", "黍": "黍", "黑": "黑", "黹": "黹",
    "黽": "黽", "鼎": "鼎", "鼓": "鼓", "鼠": "鼠", "鼻": "鼻", "齊": "齊",
    "齒": "齒", "龍": "龍", "龜": "龜", "龠": "龠",

    // Biến thể thường gặp (nét rút gọn, dạng "bên trái / bên phải")
    "ハ": "八",    // dạng bộ bát
    "丷": "八",

    "氵": "水",    // tam điểm thủy
    "冫": "水",    // băng

    "灬": "火",    // hỏa dưới

    "扌": "手",    // thủ đứng

    "忄": "心",    // tâm đứng

    "牜": "牛",    // ngưu bên trái

    "犭": "犬",    // khuyển bên trái

    "礻": "示",    // thị bên trái

    "⺾": "艸",    // thảo đầu
    "艹": "艸",

    "⻌": "辵",    // sước
    "辶": "辵",

    "阝": "阜",   // phụ/ấp – chuẩn hóa về 阜 (tuỳ bộ dữ liệu)

    "钅": "金",   // kim giản thể

    "飠": "食",   // thực bên trái
    "饣": "食",

    "糹": "糸",   // mịch giản thể
    "纟": "糸",

    "⺼": "肉",   // nhục

    "广": "广",   // nghiễm – đã có ở trên nhưng giữ lại cho rõ ý nghĩa

    "戸": "戶"    // hộ (nghiêng) chuẩn hóa
  };

  function findKanjiIndexByChar(ch) {
    var raw = String(ch || "").trim();
    if (!raw) return -1;
    var target = radicalToKanjiMap[raw] || raw;
    if (!target) return -1;
    for (var i = 0; i < kanjiData.length; i++) {
      if (kanjiData[i] && kanjiData[i].kanji === target) {
        return i;
      }
    }
    return -1;
  }

  function linkifyKanjiText(text, excludeChar) {
    var str = String(text || "");
    if (!str) return "";
    var result = "";
    for (var i = 0; i < str.length; i++) {
      var ch = str[i];
      if (excludeChar && ch === excludeChar) {
        result += ch;
        continue;
      }
      var code = ch.charCodeAt(0);
      var hasMapping = !!radicalToKanjiMap[ch];
      if (hasMapping || (code >= 0x4e00 && code <= 0x9faf)) {
        var idx = findKanjiIndexByChar(ch);
        if (idx !== -1) {
          result +=
            '<span class="kd-inline-kanji-link" data-kanji-index="' +
            idx +
            '">' +
            ch +
            "</span>";
          continue;
        }
      }
      result += ch;
    }
    return result;
  }

  // Vocab audio: dùng TTS tiếng Nhật (không dùng mp3)
  function speakJapanese(text, btn) {
    var t = String(text || "").trim().replace(/、/g, ",");
    if (!t) return;
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      return;
    }

    // Stop any current speech
    try { window.speechSynthesis.cancel(); } catch (e) { }

    var prevBtn = document.querySelector(".audio-btn--playing");
    if (prevBtn) prevBtn.classList.remove("audio-btn--playing");
    if (btn) btn.classList.add("audio-btn--playing");

    // Preload voices
    try { window.speechSynthesis.getVoices(); } catch (e) { }

    var u = new SpeechSynthesisUtterance(t);
    u.lang = "ja-JP";
    u.rate = 1;
    u.volume = 1;
    var jaVoice = findBestVoiceByLang("ja");
    if (jaVoice) u.voice = jaVoice;
    u.onend = function () {
      if (btn) btn.classList.remove("audio-btn--playing");
    };
    u.onerror = function () {
      if (btn) btn.classList.remove("audio-btn--playing");
    };
    try {
      window.speechSynthesis.speak(u);
    } catch (e) {
      if (btn) btn.classList.remove("audio-btn--playing");
    }
  }

  function createAudioBtn(textToSpeak) {
    var btn = createElement("button", "audio-btn", "🔊");
    btn.type = "button";
    btn.title = "Đọc tiếng Nhật";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      speakJapanese(textToSpeak, btn);
    });
    return btn;
  }

  function addVocab(kanji, hiragana, meaning) {
    let vocabData = JSON.parse(localStorage.getItem('vocab_extra_list')) || [];
    const item = {
      "Lesson": 9999,
      "Hiragana": hiragana,
      "Romaji": '',
      "Kanji": kanji,
      "Meaning": meaning,
      "category": '',
      "Vru": '',
      "type": '',
      "note": ''
    };

    vocabData.push(item);

    localStorage.setItem('vocab_extra_list', JSON.stringify(vocabData));
    alert("Đã thêm từ này vào list từ vựng mới!")

  }

  function createAddVocab(kanji, hiragana, meaning) {
    var btn = createElement("button", "audio-btn", "+");
    btn.type = "button";
    btn.title = "Thêm từ vựng";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      addVocab(kanji, hiragana, meaning);
    });
    return btn;
  }

  // ========================
  // AUTO-PLAY
  // ========================
  var _autoPlayIndex = 0;

  function stopAutoPlay() {
    state.autoPlay.active = false;
    try { window.speechSynthesis.cancel(); } catch (e) { }
    // Remove all highlights
    var highlighted = document.querySelectorAll(".vocab-item--highlight");
    highlighted.forEach(function (el) {
      el.classList.remove("vocab-item--highlight");
    });
    var prevPlayingBtn = document.querySelector(".audio-btn--playing");
    if (prevPlayingBtn) prevPlayingBtn.classList.remove("audio-btn--playing");
    // Update autoplay button
    var apBtn = document.getElementById("vocab-autoplay-btn");
    if (apBtn) {
      apBtn.textContent = "▶";
      apBtn.classList.remove("autoplay-btn--active");
      apBtn.title = "Phát tự động";
    }
  }

  function autoPlayNext() {
    if (!state.autoPlay.active) return;

    var listContainer = document.getElementById("vocab-list-container");
    var items = listContainer ? listContainer.querySelectorAll(".vocab-item") : [];

    if (_autoPlayIndex >= items.length) {
      // Finished all items
      stopAutoPlay();
      return;
    }

    // Remove previous highlight
    var prev = listContainer.querySelector(".vocab-item--highlight");
    if (prev) prev.classList.remove("vocab-item--highlight");

    var currentItem = items[_autoPlayIndex];
    // Highlight current item
    currentItem.classList.add("vocab-item--highlight");
    // Scroll into view
    currentItem.scrollIntoView({ behavior: "smooth", block: "center" });

    // Find audio button inside this item and speak (TTS)
    var audioBtn = currentItem.querySelector(".audio-btn");
    var vocabIdx = currentItem.getAttribute("data-vocab-index");
    var raw = vocabIdx != null ? vocabData[parseInt(vocabIdx)] : null;
    var hiraAuto = raw
      ? (raw.hiragana != null ? raw.hiragana : raw.Hiragana)
      : "";
    if (hiraAuto) {
      if (audioBtn) audioBtn.classList.add("audio-btn--playing");
      try { window.speechSynthesis.cancel(); } catch (e) { }
      // Preload voices
      try { window.speechSynthesis.getVoices(); } catch (e) { }
      var u = new SpeechSynthesisUtterance(String(hiraAuto).replace(/、/g, ","));
      u.lang = "ja-JP";
      u.rate = 1;
      u.volume = 1;
      var jaVoice = findBestVoiceByLang("ja");
      if (jaVoice) u.voice = jaVoice;
      u.onend = function () {
        if (audioBtn) audioBtn.classList.remove("audio-btn--playing");
        if (!state.autoPlay.active) return;
        setTimeout(function () {
          _autoPlayIndex++;
          autoPlayNext();
        }, 350);
      };
      u.onerror = function () {
        if (audioBtn) audioBtn.classList.remove("audio-btn--playing");
        if (!state.autoPlay.active) return;
        setTimeout(function () {
          _autoPlayIndex++;
          autoPlayNext();
        }, 200);
      };
      try {
        window.speechSynthesis.speak(u);
      } catch (e) {
        if (audioBtn) audioBtn.classList.remove("audio-btn--playing");
        setTimeout(function () {
          _autoPlayIndex++;
          autoPlayNext();
        }, 200);
      }
    } else {
      setTimeout(function () {
        _autoPlayIndex++;
        autoPlayNext();
      }, 500);
    }
  }

  function startAutoPlay() {
    state.autoPlay.active = true;
    _autoPlayIndex = 0;
    var apBtn = document.getElementById("vocab-autoplay-btn");
    if (apBtn) {
      apBtn.textContent = "⏹";
      apBtn.classList.add("autoplay-btn--active");
      apBtn.title = "Dừng phát";
    }
    autoPlayNext();
  }

  function toggleAutoPlay() {
    if (state.autoPlay.active) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }

  function createElement(tagName, className, textContent) {
    const el = document.createElement(tagName);
    if (className) {
      el.className = className;
    }
    if (typeof textContent === "string") {
      el.textContent = textContent;
    }
    return el;
  }

  function getUniqueSorted(array) {
    const set = new Set(array);
    return Array.from(set).sort(function (a, b) {
      if (typeof a === "number" && typeof b === "number") {
        return a - b;
      }
      return String(a).localeCompare(String(b));
    });
  }

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function pickUniqueIndices(count, maxExclusive) {
    const n = Math.min(count, maxExclusive);
    const indices = [];
    for (let i = 0; i < maxExclusive; i += 1) {
      indices.push(i);
    }
    const shuffled = shuffleArray(indices);
    return shuffled.slice(0, n);
  }

  // Hiragana → Romaji để đặt tên file âm thanh
  const _HIRA_DIGRAPHS = {
    "きゃ": "kya", "きゅ": "kyu", "きょ": "kyo",
    "しゃ": "sha", "しゅ": "shu", "しょ": "sho",
    "ちゃ": "cha", "ちゅ": "chu", "ちょ": "cho",
    "にゃ": "nya", "にゅ": "nyu", "にょ": "nyo",
    "ひゃ": "hya", "ひゅ": "hyu", "ひょ": "hyo",
    "みゃ": "mya", "みゅ": "myu", "みょ": "myo",
    "りゃ": "rya", "りゅ": "ryu", "りょ": "ryo",
    "ぎゃ": "gya", "ぎゅ": "gyu", "ぎょ": "gyo",
    "じゃ": "ja", "じゅ": "ju", "じょ": "jo",
    "びゃ": "bya", "びゅ": "byu", "びょ": "byo",
    "ぴゃ": "pya", "ぴゅ": "pyu", "ぴょ": "pyo"
  };

  const _HIRA_TABLE = {
    "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
    "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
    "さ": "sa", "し": "shi", "す": "su", "せ": "se", "そ": "so",
    "た": "ta", "ち": "chi", "つ": "tsu", "て": "te", "と": "to",
    "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
    "は": "ha", "ひ": "hi", "ふ": "fu", "へ": "he", "ほ": "ho",
    "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
    "や": "ya", "ゆ": "yu", "よ": "yo",
    "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
    "わ": "wa", "を": "o",
    "ん": "n",
    "が": "ga", "ぎ": "gi", "ぐ": "gu", "げ": "ge", "ご": "go",
    "ざ": "za", "じ": "ji", "ず": "zu", "ぜ": "ze", "ぞ": "zo",
    "だ": "da", "ぢ": "ji", "づ": "zu", "で": "de", "ど": "do",
    "ば": "ba", "び": "bi", "ぶ": "bu", "べ": "be", "ぼ": "bo",
    "ぱ": "pa", "ぴ": "pi", "ぷ": "pu", "ぺ": "pe", "ぽ": "po",
    "ぁ": "a", "ぃ": "i", "ぅ": "u", "ぇ": "e", "ぉ": "o",
    "ゃ": "ya", "ゅ": "yu", "ょ": "yo",
    "っ": "",   // xử lý riêng (nhân đôi phụ âm)
    "ー": ""    // xử lý riêng (kéo dài âm)
  };

  function _lastVowel(str) {
    var match = String(str || "").match(/[aeiou](?!.*[aeiou])/);
    return match ? match[0] : "";
  }

  function extractHiragana(text) {
    return String(text || "").replace(/[^\p{Script=Hiragana}ー]/gu, "");
  }

  function hiraganaToRomaji(hiraRaw) {
    var hira = extractHiragana(hiraRaw);
    var result = "";
    var i = 0;

    while (i < hira.length) {
      var ch = hira[i];
      var next = hira[i + 1] || "";
      var pair = ch + next;

      // Digraph きゃ, しゃ, ちゃ, ...
      if (_HIRA_DIGRAPHS[pair]) {
        result += _HIRA_DIGRAPHS[pair];
        i += 2;
        continue;
      }

      // Small-tsu っ: nhân đôi phụ âm đầu âm tiếp theo
      if (ch === "っ") {
        var after = hira[i + 1] || "";
        var afterNext = hira[i + 2] || "";
        var afterPair = after + afterNext;
        var romNext = "";

        if (_HIRA_DIGRAPHS[afterPair]) {
          romNext = _HIRA_DIGRAPHS[afterPair];
        } else if (_HIRA_TABLE[after] != null) {
          romNext = _HIRA_TABLE[after];
        }

        if (romNext) {
          var firstChar = romNext.charAt(0);
          if (/[bcdfghjklmnpqrstvwxyz]/.test(firstChar)) {
            result += firstChar;
          }
        }
        i += 1;
        continue;
      }

      // Ký tự thường
      if (_HIRA_TABLE[ch] != null) {
        var rom = _HIRA_TABLE[ch];

        // Kéo dài âm nếu sau là ー
        if (next === "ー") {
          var v = _lastVowel(rom);
          if (v) {
            rom += v;
          }
        }

        result += rom;
      }

      i += 1;
    }

    return result;
  }

  function audioFileNameFromHiragana(text) {
    var romaji = hiraganaToRomaji(text);
    return romaji.toLowerCase().replace(/[^a-z]/g, "");
  }

  function getCategoryLabel(rawCategory) {
    if (!rawCategory) {
      return "";
    }
    var cat = String(rawCategory).toLowerCase();
    if (cat === "verb") {
      return "Động từ";
    }
    if (cat === "noun") {
      return "Danh từ";
    }
    if (cat === "adjective") {
      return "Tính từ";
    }
    if (cat === "adjective i" || cat === "tính từ i") {
      return "Tính từ i";
    }
    if (cat === "adjective na" || cat === "tính từ na") {
      return "Tính từ na";
    }
    if (cat === "adverb") {
      return "Trạng từ";
    }
    if (cat === "conjunction" || cat === "conjunctions") {
      return "Liên từ";
    }
    if (cat === "question") {
      return "Từ để hỏi";
    }
    if (cat === "country") {
      return "Quốc gia";
    }
    if (cat === "place") {
      return "Địa điểm";
    }
    return String(rawCategory);
  }

  function normalizeSearchText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[\s-]+/g, "");
  }

  function isSmallScreen() {
    return window.innerWidth <= 720;
  }

  /** Deep link chi tiết Kanji: #kanji/日 hoặc #stars/日 (encodeURIComponent cho ký tự đặc biệt). */
  function replaceLocationHash(hash) {
    if (window.history && window.history.replaceState) {
      var path = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", path + hash);
    } else {
      window.location.hash = hash;
    }
  }

  function findKanjiIndexByChar(char) {
    if (!char) {
      return -1;
    }
    for (var i = 0; i < kanjiData.length; i++) {
      if (kanjiData[i] && kanjiData[i].kanji === char) {
        return i;
      }
    }
    return -1;
  }

  function parseKanjiDetailHash(rawHash) {
    var h = rawHash || "";
    if (h.indexOf("#kanji/") === 0) {
      try {
        return { tab: "kanji", slug: decodeURIComponent(h.slice("#kanji/".length)) };
      } catch (e) {
        return { tab: "kanji", slug: h.slice("#kanji/".length) };
      }
    }
    if (h.indexOf("#stars/") === 0) {
      try {
        return { tab: "stars", slug: decodeURIComponent(h.slice("#stars/".length)) };
      } catch (e) {
        return { tab: "stars", slug: h.slice("#stars/".length) };
      }
    }
    return { tab: null, slug: null };
  }

  var KANJI_DETAIL_RESUME_KEY = "jpstudy_kanji_detail_resume_v1";

  function saveKanjiDetailResumeHint() {
    if (state.currentTab !== "kanji" && state.currentTab !== "stars") {
      return;
    }
    if (state.selected.kanjiIndex == null) {
      return;
    }
    var raw = kanjiData[state.selected.kanjiIndex];
    if (!raw || !raw.kanji) {
      return;
    }
    try {
      sessionStorage.setItem(
        KANJI_DETAIL_RESUME_KEY,
        JSON.stringify({ t: state.currentTab, k: raw.kanji })
      );
    } catch (err) {
      /* quota / private mode */
    }
  }

  function clearKanjiDetailResumeHint() {
    try {
      sessionStorage.removeItem(KANJI_DETAIL_RESUME_KEY);
    } catch (err) {
      /* ignore */
    }
  }

  function readKanjiDetailResumeHint() {
    try {
      var s = sessionStorage.getItem(KANJI_DETAIL_RESUME_KEY);
      if (!s) {
        return null;
      }
      var o = JSON.parse(s);
      if (!o || !o.k || (o.t !== "kanji" && o.t !== "stars")) {
        return null;
      }
      return { t: o.t, k: String(o.k) };
    } catch (err) {
      return null;
    }
  }

  function hashAllowsKanjiResume(savedTab) {
    var h = window.location.hash || "";
    if (savedTab === "kanji") {
      return h === "#kanji" || h.indexOf("#kanji/") === 0;
    }
    if (savedTab === "stars") {
      return h === "#stars" || h.indexOf("#stars/") === 0;
    }
    return false;
  }

  /**
   * Khi quay lại Safari/PWA sau khi nền hóa: nếu modal chi tiết bị mất nhưng URL hoặc session
   * vẫn ở flow Kanji/⭐ thì mở lại chi tiết (không hiển thị trên màn hình Home — chỉ trong app).
   */
  function tryRestoreKanjiDetailAfterResume() {
    if (document.hidden || !detailModalState.el) {
      return;
    }
    if (state.ui.detailModal.isOpen) {
      return;
    }

    var h = window.location.hash || "";
    var dh = parseKanjiDetailHash(h);
    if (dh.tab && dh.slug && (dh.tab === "kanji" || dh.tab === "stars")) {
      var idx = findKanjiIndexByChar(dh.slug);
      if (idx >= 0) {
        state.currentTab = dh.tab;
        state.kanjiHistory = [];
        state.selected.kanjiIndex = idx;
        renderTabs();
        if (dh.tab === "stars") {
          renderStarsTab();
        }
        renderKanjiList();
        renderKanjiDetail();
        return;
      }
    }

    var hint = readKanjiDetailResumeHint();
    if (!hint) {
      return;
    }
    if (!hashAllowsKanjiResume(hint.t)) {
      return;
    }
    var idx2 = findKanjiIndexByChar(hint.k);
    if (idx2 < 0) {
      clearKanjiDetailResumeHint();
      return;
    }

    state.kanjiHistory = [];
    state.selected.kanjiIndex = idx2;
    state.currentTab = hint.t;
    renderTabs();
    if (hint.t === "stars") {
      renderStarsTab();
    }
    renderKanjiList();
    var enc = encodeURIComponent(hint.k);
    replaceLocationHash("#" + hint.t + "/" + enc);
    renderKanjiDetail();
  }

  function syncKanjiDetailHash() {
    if (state.currentTab !== "kanji" && state.currentTab !== "stars") {
      return;
    }
    if (state.selected.kanjiIndex == null) {
      return;
    }
    var raw = kanjiData[state.selected.kanjiIndex];
    if (!raw || !raw.kanji) {
      return;
    }
    var enc = encodeURIComponent(raw.kanji);
    var target = state.currentTab === "stars" ? "#stars/" + enc : "#kanji/" + enc;
    if (window.location.hash !== target) {
      replaceLocationHash(target);
    }
    saveKanjiDetailResumeHint();
  }

  function clearKanjiDetailSlugFromLocation() {
    var h = window.location.hash || "";
    if (h.indexOf("#kanji/") === 0) {
      window.location.hash = "#kanji";
    } else if (h.indexOf("#stars/") === 0) {
      window.location.hash = "#stars";
    }
  }

  const detailModalState = {
    el: null,
    bodyEl: null,
    titleEl: null,
    navEl: null,
    closeBtn: null
  };

  function openDetailModal(title, htmlContentOrNode, headerNavNode) {
    if (!detailModalState.el) {
      return;
    }
    detailModalState.titleEl.textContent = title || "";
    if (detailModalState.navEl) {
      detailModalState.navEl.innerHTML = "";
      if (headerNavNode && headerNavNode instanceof Node) {
        detailModalState.navEl.appendChild(headerNavNode);
      }
    }
    detailModalState.bodyEl.innerHTML = "";
    if (htmlContentOrNode instanceof Node) {
      detailModalState.bodyEl.appendChild(htmlContentOrNode);
    } else {
      detailModalState.bodyEl.innerHTML = htmlContentOrNode || "";
    }
    detailModalState.el.classList.add("detail-modal--open");
    detailModalState.el.setAttribute("aria-hidden", "false");
    state.ui.detailModal.isOpen = true;
  }

  function closeDetailModal() {
    if (!detailModalState.el) {
      return;
    }
    detailModalState.el.classList.remove("detail-modal--open");
    detailModalState.el.classList.remove("detail-modal--practice");
    detailModalState.el.setAttribute("aria-hidden", "true");
    state.ui.detailModal.isOpen = false;
    clearKanjiDetailResumeHint();
    var ret = state.ui.kanjiDetailReturnTab;
    state.ui.kanjiDetailReturnTab = null;
    if (ret === "stars") {
      state.currentTab = "stars";
      var hsh = window.location.hash || "";
      if (hsh !== "#stars") {
        window.location.hash = "#stars";
      }
      renderTabs();
      renderStarsTab();
    } else {
      clearKanjiDetailSlugFromLocation();
    }
  }

  function openKanjiPracticeModal(kanjiChar) {
    if (!kanjiChar) return;

    const wrap = createElement("div", "kd-writing-modal", "");

    const canvasWrap = createElement("div", "kd-writing-canvas-wrap", "");
    const canvas = document.createElement("canvas");
    canvas.className = "kd-writing-canvas";
    canvas.width = 520;
    canvas.height = 520;
    canvas.setAttribute("aria-label", "Vùng tập viết kanji");

    const referenceDiv = createElement("div", "kd-writing-reference", "");
    referenceDiv.style.pointerEvents = "none";
    referenceDiv.setAttribute("aria-hidden", "false");
    referenceDiv.style.visibility = "hidden";
    canvasWrap.appendChild(referenceDiv);
    canvasWrap.appendChild(canvas);

    const actions = createElement("div", "kd-writing-actions", "");
    const settings = createElement("div", "kd-writing-settings", "");
    const penTypeGroup = createElement("label", "kd-writing-setting", "");
    const penTypeText = createElement("span", "kd-writing-setting-label", "Loại bút");
    const penTypeSelect = document.createElement("select");
    penTypeSelect.className = "kd-writing-select";
    [
      { value: "ink", label: "Bút mực" },
      { value: "marker", label: "Bút dạ" },
      { value: "pencil", label: "Bút chì" },
      { value: "calligraphy", label: "Bút thư pháp" }
    ].forEach(function (optData) {
      var opt = document.createElement("option");
      opt.value = optData.value;
      opt.textContent = optData.label;
      penTypeSelect.appendChild(opt);
    });
    penTypeGroup.appendChild(penTypeText);
    penTypeGroup.appendChild(penTypeSelect);

    const lineWidthGroup = createElement("label", "kd-writing-setting", "");
    const lineWidthText = createElement("span", "kd-writing-setting-label", "Độ dày nét");
    const lineWidthRange = document.createElement("input");
    lineWidthRange.type = "range";
    lineWidthRange.className = "kd-writing-range";
    lineWidthRange.min = "1";
    lineWidthRange.max = "16";
    lineWidthRange.step = "1";
    const lineWidthValue = createElement("span", "kd-writing-range-value", "");
    lineWidthGroup.appendChild(lineWidthText);
    lineWidthGroup.appendChild(lineWidthRange);
    lineWidthGroup.appendChild(lineWidthValue);

    settings.appendChild(penTypeGroup);
    settings.appendChild(lineWidthGroup);

    var strokeEls = [];
    var strokeTimers = [];
    var svgLoaded = false;
    var svgLoadPromise = null;
    const strokeColors = ["#00d1b2", "#3498db", "#9b59b6", "#e74c3c", "#f1c40f", "#e67e22"];

    function clearStrokeTimers() {
      strokeTimers.forEach(function (t) {
        clearTimeout(t);
      });
      strokeTimers = [];
    }

    function getKanjiVGUrls(ch) {
      var hex = ch.codePointAt(0).toString(16).padStart(5, "0");
      // Prefer CDN to avoid local-file/CORS/network blocks on raw.githubusercontent.com
      return [
        "https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg/kanji/" + hex + ".svg",
        "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/" + hex + ".svg"
      ];
    }

    function resetStrokesForAnimation() {
      strokeEls.forEach(function (p) {
        var len = p.getTotalLength ? p.getTotalLength() : 0;
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
        p.style.opacity = "0";
      });
    }

    function runStrokeAnimation() {
      if (!strokeEls.length) return;
      clearStrokeTimers();
      resetStrokesForAnimation();

      var totalDelay = 0;
      strokeEls.forEach(function (p, i) {
        var len = p.getTotalLength ? p.getTotalLength() : 0;
        var duration = 500 + len * 4;
        var color = strokeColors[i % strokeColors.length];
        p.style.stroke = color;

        var t = setTimeout(function () {
          p.style.transition = "opacity 200ms ease";
          p.style.opacity = "1";
          // ensure opacity applies before dash animation
          setTimeout(function () {
            p.style.transition = "stroke-dashoffset " + duration + "ms cubic-bezier(0.25, 0.1, 0.25, 1)";
            p.style.strokeDashoffset = "0";
          }, 20);
        }, totalDelay);
        strokeTimers.push(t);
        totalDelay += duration + 250;
      });
    }

    async function loadReferenceSvgIfNeeded() {
      if (svgLoaded) return;
      if (svgLoadPromise) return svgLoadPromise;

      referenceDiv.textContent = "";
      var loading = createElement("div", "kd-writing-reference-loading", "Đang tải mẫu...");
      referenceDiv.appendChild(loading);

      svgLoadPromise = (async function () {
        try {
          var urls = getKanjiVGUrls(String(kanjiChar));
          var svgText = null;
          for (var i = 0; i < urls.length; i++) {
            var res = await fetch(urls[i]);
            if (res && res.ok) {
              svgText = await res.text();
              break;
            }
          }
          if (!svgText) {
            throw new Error("Không tải được SVG từ CDN/GitHub");
          }
          var parser = new DOMParser();
          var xml = parser.parseFromString(svgText, "image/svg+xml");

          var dList = Array.from(xml.querySelectorAll("path"))
            .map(function (p) {
              return p.getAttribute("d");
            })
            .filter(Boolean);
          if (!dList.length) {
            throw new Error("SVG không có path nét vẽ");
          }

          referenceDiv.textContent = "";
          var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("viewBox", "0 0 109 109");
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          svg.setAttribute("aria-label", "Kanji mẫu (animation)");

          var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          svg.appendChild(g);

          strokeEls = dList.map(function (d, i) {
            var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
            p.setAttribute("d", d);
            p.setAttribute("fill", "none");
            p.setAttribute("stroke", strokeColors[i % strokeColors.length]);
            p.setAttribute("stroke-width", "4.5");
            p.setAttribute("stroke-linecap", "round");
            p.setAttribute("stroke-linejoin", "round");
            p.classList.add("kd-writing-ref-stroke");
            g.appendChild(p);
            return p;
          });

          referenceDiv.appendChild(svg);
          svgLoaded = true;
          resetStrokesForAnimation();
        } catch (e) {
          referenceDiv.textContent = "";
          var msg = createElement("div", "kd-writing-reference-loading", "Không tải được mẫu. Hãy thử mở bằng server (Live Server) hoặc kiểm tra mạng.");
          referenceDiv.appendChild(msg);
          svgLoaded = false;
        }
      })();

      return svgLoadPromise;
    }

    const drawBtn = createElement("button", "kd-writing-btn", "Vẽ");
    drawBtn.type = "button";
    const toggleRefBtn = createElement("button", "kd-writing-btn", "Hiện mẫu");
    toggleRefBtn.type = "button";
    const clearBtn = createElement("button", "kd-writing-btn", "Clear");
    clearBtn.type = "button";

    toggleRefBtn.addEventListener("click", function () {
      var hidden = referenceDiv.style.visibility === "hidden";
      referenceDiv.style.visibility = hidden ? "visible" : "hidden";
      toggleRefBtn.textContent = hidden ? "Ẩn mẫu" : "Hiện mẫu";
    });
    clearBtn.addEventListener("click", function () {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    drawBtn.addEventListener("click", function () {
      // Ensure sample is visible when drawing sample strokes
      referenceDiv.style.visibility = "visible";
      toggleRefBtn.textContent = "Ẩn mẫu";
      loadReferenceSvgIfNeeded().then(function () {
        runStrokeAnimation();
      });
    });

    wrap.appendChild(settings);
    actions.appendChild(drawBtn);
    actions.appendChild(toggleRefBtn);
    actions.appendChild(clearBtn);

    wrap.appendChild(canvasWrap);
    wrap.appendChild(actions);

    (function initCanvasDrawing() {
      var ctx = canvas.getContext("2d");
      var drawing = false;
      var writingConfig = state.ui.writingPractice || { penType: "calligraphy", lineWidth: 13 };
      var lastPos = null;
      var lastMoveTime = 0;

      function getPenStyle(penType) {
        if (penType === "marker") {
          return { color: "rgba(30, 41, 59, 0.75)", cap: "square", join: "round" };
        }
        if (penType === "pencil") {
          return { color: "rgba(55, 65, 81, 0.6)", cap: "round", join: "round" };
        }
        if (penType === "calligraphy") {
          return { color: "#111827", cap: "butt", join: "miter" };
        }
        return { color: "#1f2937", cap: "round", join: "round" };
      }
      function getCalligraphyWidth(currPos) {
        if (!lastPos) return writingConfig.lineWidth;
        var dx = currPos.x - lastPos.x;
        var dy = currPos.y - lastPos.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var now = Date.now();
        var dt = Math.max(16, now - (lastMoveTime || now));
        var speed = dist / dt;
        var angle = Math.atan2(Math.abs(dy), Math.abs(dx || 0.0001));
        var directionFactor = 0.7 + Math.abs(Math.cos(angle)) * 0.6;
        var speedFactor = Math.max(0.7, Math.min(1.2, 1.1 - speed * 1.8));
        return Math.max(1, writingConfig.lineWidth * directionFactor * speedFactor);
      }
      function applyBrushSettings() {
        var style = getPenStyle(writingConfig.penType);
        ctx.strokeStyle = style.color;
        ctx.lineCap = style.cap;
        ctx.lineJoin = style.join;
        ctx.lineWidth = writingConfig.lineWidth;
      }
      function syncSettingsUI() {
        penTypeSelect.value = writingConfig.penType;
        lineWidthRange.value = String(writingConfig.lineWidth);
        lineWidthValue.textContent = String(writingConfig.lineWidth) + " px";
      }
      syncSettingsUI();
      applyBrushSettings();

      penTypeSelect.addEventListener("change", function () {
        writingConfig.penType = penTypeSelect.value;
        state.ui.writingPractice = writingConfig;
        applyBrushSettings();
      });
      lineWidthRange.addEventListener("input", function () {
        var size = parseInt(lineWidthRange.value, 10);
        if (!isNaN(size)) {
          writingConfig.lineWidth = size;
          state.ui.writingPractice = writingConfig;
          lineWidthValue.textContent = String(size) + " px";
          applyBrushSettings();
        }
      });

      function getPos(e) {
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: (clientX - rect.left) * scaleX,
          y: (clientY - rect.top) * scaleY
        };
      }

      function startDraw(e) {
        e.preventDefault();
        drawing = true;
        var pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        lastPos = pos;
        lastMoveTime = Date.now();
      }
      function moveDraw(e) {
        if (!drawing) return;
        e.preventDefault();
        var pos = getPos(e);
        if (writingConfig.penType === "calligraphy") {
          ctx.lineWidth = getCalligraphyWidth(pos);
        } else {
          ctx.lineWidth = writingConfig.lineWidth;
        }
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPos = pos;
        lastMoveTime = Date.now();
      }
      function endDraw() {
        drawing = false;
        lastPos = null;
      }

      canvas.addEventListener("mousedown", startDraw);
      canvas.addEventListener("mousemove", moveDraw);
      canvas.addEventListener("mouseup", endDraw);
      canvas.addEventListener("mouseleave", endDraw);

      canvas.addEventListener("touchstart", startDraw, { passive: false });
      canvas.addEventListener("touchmove", moveDraw, { passive: false });
      canvas.addEventListener("touchend", endDraw);
    })();

    const navRow = createElement("div", "kd-nav-row kd-nav-row--header", "");
    const backBtn = createElement("button", "kd-nav-btn kd-nav-btn--back", "‹");
    backBtn.type = "button";
    backBtn.title = "Quay lại chi tiết Kanji";
    backBtn.addEventListener("click", function () {
      renderKanjiDetail();
    });
    navRow.appendChild(backBtn);

    openDetailModal("Tập viết", wrap, navRow);
    if (detailModalState.el) {
      detailModalState.el.classList.add("detail-modal--practice");
    }

    // preload sample; auto-show + auto-animate once loaded
    loadReferenceSvgIfNeeded().then(function () {
      referenceDiv.style.visibility = "visible";
      toggleRefBtn.textContent = "Ẩn mẫu";
      runStrokeAnimation();
    });
  }

  function createHeroMidKanjiAutoStroke(kanjiChar) {
    const box = createElement("div", "kd-hero-mid-kanji", "");
    if (!kanjiChar) return box;

    const replayBtn = createElement("button", "kd-hero-mid-replay", "⟳");
    replayBtn.type = "button";
    replayBtn.title = "Vẽ lại";
    box.appendChild(replayBtn);

    var strokeEls = [];
    var strokeTimers = [];
    const strokeColors = ["#00d1b2", "#3498db", "#9b59b6", "#e74c3c", "#f1c40f", "#e67e22"];
    var ready = false;

    function clearStrokeTimers() {
      strokeTimers.forEach(function (t) {
        clearTimeout(t);
      });
      strokeTimers = [];
    }

    function getKanjiVGUrls(ch) {
      var hex = ch.codePointAt(0).toString(16).padStart(5, "0");
      return [
        "https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg/kanji/" + hex + ".svg",
        "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/" + hex + ".svg"
      ];
    }

    function resetStrokesForAnimation() {
      strokeEls.forEach(function (p) {
        var len = p.getTotalLength ? p.getTotalLength() : 0;
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
        p.style.opacity = "0";
      });
    }

    function runStrokeAnimationLoop() {
      if (!strokeEls.length) return;
      clearStrokeTimers();
      resetStrokesForAnimation();

      var totalDelay = 0;
      strokeEls.forEach(function (p, i) {
        var len = p.getTotalLength ? p.getTotalLength() : 0;
        var duration = 450 + len * 3.5;
        var color = strokeColors[i % strokeColors.length];
        p.style.stroke = color;

        var t = setTimeout(function () {
          p.style.transition = "opacity 200ms ease";
          p.style.opacity = "1";
          setTimeout(function () {
            p.style.transition = "stroke-dashoffset " + duration + "ms cubic-bezier(0.25, 0.1, 0.25, 1)";
            p.style.strokeDashoffset = "0";
          }, 20);
        }, totalDelay);
        strokeTimers.push(t);
        totalDelay += duration + 220;
      });
    }

    function replayOnce() {
      if (!ready) return;
      runStrokeAnimationLoop();
    }

    replayBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      replayOnce();
    });

    (async function init() {
      try {
        var urls = getKanjiVGUrls(String(kanjiChar));
        var svgText = null;
        for (var i = 0; i < urls.length; i++) {
          var res = await fetch(urls[i]);
          if (res && res.ok) {
            svgText = await res.text();
            break;
          }
        }
        if (!svgText) throw new Error("Không tải được SVG");

        var parser = new DOMParser();
        var xml = parser.parseFromString(svgText, "image/svg+xml");
        var dList = Array.from(xml.querySelectorAll("path"))
          .map(function (p) {
            return p.getAttribute("d");
          })
          .filter(Boolean);
        if (!dList.length) throw new Error("SVG không có path");

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 109 109");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("aria-hidden", "true");
        svg.style.pointerEvents = "none";

        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.appendChild(g);

        strokeEls = dList.map(function (d, idx) {
          var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.setAttribute("d", d);
          p.setAttribute("fill", "none");
          p.setAttribute("stroke", strokeColors[idx % strokeColors.length]);
          p.setAttribute("stroke-width", "4.5");
          p.setAttribute("stroke-linecap", "round");
          p.setAttribute("stroke-linejoin", "round");
          p.classList.add("kd-writing-ref-stroke");
          g.appendChild(p);
          return p;
        });

        // Keep replay button; replace only drawing content behind it
        Array.from(box.querySelectorAll("svg")).forEach(function (n) {
          n.remove();
        });
        box.appendChild(svg);
        resetStrokesForAnimation();
        ready = true;

        // Start animation after layout
        requestAnimationFrame(function () {
          replayOnce();
        });
      } catch (e) {
        box.textContent = "";
        box.appendChild(replayBtn);
        box.appendChild(createElement("div", "kd-hero-mid-fallback", String(kanjiChar)));
      }
    })();

    return box;
  }

  // ========================
  // RENDER FUNCTIONS
  // ========================

  function renderTabs() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(function (tab) {
      const tabName = tab.getAttribute("data-tab");
      if (tabName === state.currentTab) {
        tab.classList.add("tab--active");
      } else {
        tab.classList.remove("tab--active");
      }
    });

    const sections = [
      { id: "section-vocab", tab: "vocab" },
      { id: "section-kanji", tab: "kanji" },
      { id: "section-grammar", tab: "grammar" },
      { id: "section-stars", tab: "stars" },
      { id: "section-note", tab: "note" }
    ];

    sections.forEach(function (entry) {
      const sec = document.getElementById(entry.id);
      if (state.currentTab === entry.tab) {
        sec.classList.add("section--active");
      } else {
        sec.classList.remove("section--active");
      }
    });
  }

  // ----- Vocab -----
  function applyVocabFilters() {
    var filtered = vocabData.filter(function (item) {
      if (!item) {
        return false;
      }

      // Bỏ qua từ vựng không có hiragana
      var hira = "";
      if (Object.prototype.hasOwnProperty.call(item, "hiragana")) {
        hira = String(item.hiragana || "").trim();
      } else if (Object.prototype.hasOwnProperty.call(item, "Hiragana")) {
        hira = String(item.Hiragana || "").trim();
      } else {
        hira = String(item.hiragana || item.Hiragana || "").trim();
      }
      if (!hira) {
        return false;
      }

      var lessonValue = item.lesson != null ? item.lesson : item.Lesson;
      var categoryValue = item.category != null ? item.category : item.Category;

      var search = String(state.filter.vocabSearch || "").trim().toLowerCase();
      if (search) {
        var meaning = "";
        if (Object.prototype.hasOwnProperty.call(item, "meaning")) {
          meaning = String(item.meaning || "").trim();
        } else if (Object.prototype.hasOwnProperty.call(item, "Meaning")) {
          meaning = String(item.Meaning || "").trim();
        } else {
          meaning = String(item.meaning || item.Meaning || "").trim();
        }

        var kanji = "";
        if (Object.prototype.hasOwnProperty.call(item, "kanji")) {
          kanji = String(item.kanji || "").trim();
        } else if (Object.prototype.hasOwnProperty.call(item, "Kanji")) {
          kanji = String(item.Kanji || "").trim();
        } else {
          kanji = String(item.kanji || item.Kanji || "").trim();
        }

        // Hỗ trợ cả Romaji (đúng chính tả) và Romazi (dữ liệu cũ nếu có)
        var romaji = "";
        if (Object.prototype.hasOwnProperty.call(item, "romaji")) {
          romaji = String(item.romaji || "").trim();
        } else if (Object.prototype.hasOwnProperty.call(item, "Romaji")) {
          romaji = String(item.Romaji || "").trim();
        } else if (Object.prototype.hasOwnProperty.call(item, "romazi")) {
          romaji = String(item.romazi || "").trim();
        } else if (Object.prototype.hasOwnProperty.call(item, "Romazi")) {
          romaji = String(item.Romazi || "").trim();
        } else {
          romaji = String(item.romaji || item.Romaji || item.romazi || item.Romazi || "").trim();
        }

        var textAll = (hira + " " + kanji + " " + meaning + " " + romaji).toLowerCase();
        var searchNorm = normalizeSearchText(search);
        var textNorm = normalizeSearchText(textAll);
        if (textNorm.indexOf(searchNorm) === -1) {
          return false;
        }
      }

      if (!search) {
        if (state.filter.vocabLessonFrom !== "" || state.filter.vocabLessonTo !== "") {
          var from = state.filter.vocabLessonFrom !== "" ? Number(state.filter.vocabLessonFrom) : -Infinity;
          var to = state.filter.vocabLessonTo !== "" ? Number(state.filter.vocabLessonTo) : Infinity;
          var current = Number(lessonValue);
          if (current < from || current > to) {
            return false;
          }
        }
        if (state.filter.vocabCategory !== "all" &&
          categoryValue !== state.filter.vocabCategory) {
          return false;
        }

        var vIdx = vocabData.indexOf(item);

        // Filter favorites only
        if (state.vocabFavOnly) {
          if (!state.vocabFavorites[vIdx]) {
            return false;
          }
        }

        var mastered = !!state.vocabMastered[vIdx];
        if (state.filter.vocabMastered === "mastered" && !mastered) {
          return false;
        }
        if (state.filter.vocabMastered === "not" && mastered) {
          return false;
        }
      }

      return true;
    });
    // Danh sách: bài (Lesson) tăng dần, trong cùng bài thì id tăng dần
    filtered.sort(function (a, b) {
      var la = a.lesson != null ? a.lesson : a.Lesson;
      var lb = b.lesson != null ? b.lesson : b.Lesson;
      var na = Number(la);
      var nb = Number(lb);
      if (isNaN(na)) na = 0;
      if (isNaN(nb)) nb = 0;
      if (na !== nb) {
        return na - nb;
      }
      var ia = Number(a.id);
      var ib = Number(b.id);
      if (isNaN(ia)) ia = 0;
      if (isNaN(ib)) ib = 0;
      return ia - ib;
    });
    return filtered;
  }

  function renderVocabFilterSummary(filteredList) {
    const el = document.getElementById("vocab-filter-summary");
    if (!el) return;
    const lessonsSet = new Set(
      filteredList.map(function (v) {
        return v.lesson != null ? v.lesson : v.Lesson;
      })
    );
    const categoriesSet = new Set(
      filteredList.map(function (v) { return v.category; })
    );

    const lessonLabel = (state.filter.vocabLessonFrom === "" && state.filter.vocabLessonTo === "")
      ? "Tất cả các bài"
      : (state.filter.vocabLessonTo === "" || state.filter.vocabLessonFrom === state.filter.vocabLessonTo
        ? "Bài " + (state.filter.vocabLessonFrom || state.filter.vocabLessonTo)
        : (state.filter.vocabLessonFrom === "" ? "≤ Bài " + state.filter.vocabLessonTo
          : "Bài " + state.filter.vocabLessonFrom + " → " + state.filter.vocabLessonTo)
      );
    const categoryLabel = state.filter.vocabCategory === "all"
      ? "Tất cả loại từ"
      : state.filter.vocabCategory + (categoriesSet.size === 1 ? "" : " (filtered)");

    var masteredLabel = "Tất cả (đã/chưa thuộc)";
    if (state.filter.vocabMastered === "mastered") {
      masteredLabel = "Chỉ đã thuộc";
    } else if (state.filter.vocabMastered === "not") {
      masteredLabel = "Chỉ chưa thuộc";
    }

    el.textContent = lessonLabel + " · " + categoryLabel + " · " + masteredLabel;
  }

  function renderVocabList() {
    // Stop auto-play when list re-renders
    if (state.autoPlay.active) {
      stopAutoPlay();
    }
    if (state.tts.active) {
      stopVocabTts();
    }

    const listContainer = document.getElementById("vocab-list-container");
    const countLabel = document.getElementById("vocab-count-label");

    const filtered = applyVocabFilters();
    // Nếu danh sách thay đổi (filter/search/reset) thì reset focus/highlight
    var newKey = filtered.map(function (r) { return String(vocabData.indexOf(r)); }).join(",");
    if (newKey !== state.ui.vocabListKey) {
      clearVocabTtsFocus();
      state.ui.vocabListKey = newKey;
    }
    countLabel.textContent = filtered.length + " từ";
    renderVocabFilterSummary(filtered);

    listContainer.innerHTML = "";

    if (filtered.length === 0) {
      const empty = createElement("div", "detail-empty", "Không có từ vựng phù hợp với bộ lọc hiện tại.");
      listContainer.appendChild(empty);
      return;
    }

    const listWrapper = createElement("div", "vocab-list", "");
    filtered.forEach(function (raw) {
      const vocabIndex = vocabData.indexOf(raw);

      const row = createElement("div", "vocab-item", "");
      row.setAttribute("data-vocab-index", String(vocabIndex));

      // Star button
      var isFav = !!state.vocabFavorites[vocabIndex];
      var starBtn = createElement("button", "star-btn" + (isFav ? " star-btn--active" : ""), isFav ? "★" : "☆");
      starBtn.type = "button";
      starBtn.title = "Yêu thích";
      starBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (state.vocabFavorites[vocabIndex]) {
          delete state.vocabFavorites[vocabIndex];
        } else {
          state.vocabFavorites[vocabIndex] = true;
        }
        saveVocabFavorites();
        renderVocabList();
        refreshStarsTabIfActive();
      });

      var isMastered = !!state.vocabMastered[vocabIndex];
      var masteredBtn = createElement(
        "button",
        "mastered-btn" + (isMastered ? " mastered-btn--active" : ""),
        isMastered ? "✓" : "○"
      );
      masteredBtn.type = "button";
      masteredBtn.title = isMastered ? "Đã thuộc — bấm để bỏ đánh dấu" : "Đánh dấu đã thuộc";
      masteredBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (state.vocabMastered[vocabIndex]) {
          delete state.vocabMastered[vocabIndex];
        } else {
          state.vocabMastered[vocabIndex] = true;
        }
        saveVocabMastered();
        renderVocabList();
      });

      const mainRow = createElement("div", "vocab-item-main", "");
      const item = {
        lesson: raw.lesson != null ? raw.lesson : raw.Lesson,
        hiragana: raw.hiragana != null ? raw.hiragana : raw.Hiragana,
        // Ưu tiên Romaji, fallback sang Romazi nếu còn dữ liệu cũ
        romaji: raw.romaji != null ? raw.romaji
          : (raw.Romaji != null ? raw.Romaji
            : (raw.romazi != null ? raw.romazi : raw.Romazi)),
        kanji: raw.kanji != null ? raw.kanji : raw.Kanji,
        meaning: raw.meaning != null ? raw.meaning : raw.Meaning,
        vru: raw.vru != null ? raw.vru : raw.Vru,
        type: raw.type != null ? raw.type : raw.Type,
        note: raw.note != null ? raw.note : raw.Note,
        category: raw.category != null ? raw.category : raw.Category
      };
      const fields = [];

      // Hiragana là từ chính trong list
      if (state.displaySettings.hiragana && item.hiragana) {
        const hiraEl = createElement("div", "vocab-hira", item.hiragana);
        fields.push(hiraEl);
      }

      // Romaji hiển thị ngay sau hiragana
      if (state.displaySettings.romaji && item.romaji) {
        const romajiEl = createElement("div", "vocab-romazi", "(" + item.romaji + ")");
        fields.push(romajiEl);
      }

      if (state.displaySettings.kanji && item.kanji) {
        const outputKanji = boldKanji(item.kanji);

        const kanjiEl = createElement("div", "vocab-kanji");
        kanjiEl.innerHTML = "(" + outputKanji + ") ";

        // Thêm event cho các thẻ <b> bên trong
        kanjiEl.querySelectorAll("b").forEach(b => {
          const index = kanjiData.findIndex(k => k.kanji === b.textContent);
          if (index > 0) b.classList.add("vocab-kanji--linked");

          b.addEventListener("click", function () {
            const idx = kanjiData.findIndex(item => item.kanji === this.textContent);
            if (idx > 0) {
              state.selected.kanjiIndex = idx;
              renderKanjiDetail();
            } else {
              openDetailModal("Thông báo", "<p>Không có data của chữ này!</p><a href='/jptest/addKanji/index.html?kanji="+decodeURIComponent(this.textContent)+"'>Thêm từ kanji</a>");
            }
          });
        });

        fields.push(kanjiEl);
      }
      if (state.displaySettings.hanviet && item.kanji && window.getHanViet) {
        const hv = window.getHanViet(item.kanji);
        if (hv) {
          const hvEl = createElement("div", "vocab-hanviet", "[" + hv + "]");
          fields.push(hvEl);
        }
      }

      if (state.displaySettings.meaning && item.meaning) {
        const meanEl = createElement("div", "vocab-meaning", " " + item.meaning);
        fields.push(meanEl);
      }

      if (fields.length === 0) {
        const fallback = createElement("div", "vocab-hira", item.hiragana || item.kanji || "");
        fields.push(fallback);
      }

      fields.forEach(function (fieldEl) {
        mainRow.appendChild(fieldEl);
      });

      // Audio button: dùng TTS đọc tiếng Nhật (hiragana)
      var audioBtn = item.hiragana && state.displaySettings.voice ? createAudioBtn(item.hiragana) : null;

      var vocabTopRow = createElement("div", "", "");
      vocabTopRow.style.cssText = "display:flex;align-items:center;gap:4px";
      vocabTopRow.appendChild(mainRow);
      if (audioBtn) vocabTopRow.appendChild(audioBtn);
      vocabTopRow.appendChild(masteredBtn);
      vocabTopRow.appendChild(starBtn);
      mainRow.style.flex = "1";
      row.appendChild(vocabTopRow);

      const metaRow = createElement("div", "vocab-meta-row", "");

      if (state.displaySettings.lesson && item.lesson) {
        const pillLesson = createElement(
          "span",
          "pill pill--lesson",
          "Bài " + (item.lesson != null ? item.lesson : item.Lesson)
        );
        metaRow.appendChild(pillLesson);
      }

      if (state.displaySettings.type && item.type) {
        const pillType = createElement("span", "pill pill--type", item.type);
        metaRow.appendChild(pillType);
      }
      ``
      if (state.displaySettings.category && item.category) {
        const pillCat = createElement("span", "pill", getCategoryLabel(item.category));
        metaRow.appendChild(pillCat);
      }

      if (state.displaySettings.vru && item.vru) {
        const p = createElement("span", "pill pill--soft-accent", "Vる: " + item.vru);
        metaRow.appendChild(p);
      }
      if (state.displaySettings.note && item.note) {
        const p = createElement("span", "pill", "Note: " + item.note);
        metaRow.appendChild(p);
      }

      if (metaRow.childNodes.length > 0) {
        row.appendChild(metaRow);
      }

      listWrapper.appendChild(row);
    });

    listContainer.appendChild(listWrapper);
  }

  // renderVocabDetail removed — detail popup no longer used

  function renderDisplaySettingsUI() {
    const body = document.getElementById("display-settings-body");
    const panel = document.querySelector(".settings-panel");
    const linkToggle = document.getElementById("display-settings-toggle-link");
    const isOpen = state.ui.displaySettingsOpen;

    if (panel) {
      if (isOpen) {
        panel.classList.remove("settings-panel--hidden");
      } else {
        panel.classList.add("settings-panel--hidden");
      }
    }
    if (body) {
      if (isOpen) {
        body.classList.add("settings-body--open");
      } else {
        body.classList.remove("settings-body--open");
      }
    }
    if (linkToggle) {
      linkToggle.textContent = isOpen ? "✕" : "⊞";
    }

    if (!body) {
      return;
    }

    const chips = body.querySelectorAll(".checkbox-chip");
    chips.forEach(function (chip) {
      const checkbox = chip.querySelector("input[type='checkbox']");
      const field = checkbox.getAttribute("data-display-field");
      const checked = Boolean(state.displaySettings[field]);
      checkbox.checked = checked;
      if (checked) {
        chip.classList.add("checkbox-chip--active");
      } else {
        chip.classList.remove("checkbox-chip--active");
      }
    });
  }

  // ----- Test vocab -----
  function buildTestQuestions(source, count) {
    if (!Array.isArray(source) || source.length === 0) {
      return [];
    }
    var total = (typeof count === "number" && count >= 1) ? count : 20;
    const indices = pickUniqueIndices(total, source.length);
    const questions = indices.map(function (idx) {
      return source[idx];
    });
    return questions;
  }

  function renderTestInitialMessage() {
    const container = document.getElementById("vocab-test-container");
    if (container) {
      container.innerHTML = "";
    }

    const wrapper = createElement("div", "test-result", "");
    const title = createElement("div", "score-main", "Cấu hình bài test");
    const desc = createElement(
      "div",
      "score-detail",
      "Chọn khoảng bài (từ bài ... đến bài ...). Chọn category (mặc định tất cả)."
    );
    wrapper.appendChild(title);
    wrapper.appendChild(desc);

    // Grid container to keep settings compact
    const configGrid = createElement("div", "test-config-fields", "");

    // Từ bài
    const lessonMinField = createElement("div", "field-group", "");
    const lessonMinLabel = createElement("div", "field-label", "Từ bài");
    const lessonMinInput = createElement("input", "input-text", "");
    lessonMinInput.type = "number";
    lessonMinInput.min = 1;
    lessonMinInput.max = 999;
    lessonMinInput.value = String(state.testState.lessonMin != null ? state.testState.lessonMin : 1);
    lessonMinInput.id = "vocab-test-lesson-min";
    lessonMinField.appendChild(lessonMinLabel);
    lessonMinField.appendChild(lessonMinInput);
    configGrid.appendChild(lessonMinField);

    // Đến bài
    const lessonField = createElement("div", "field-group", "");
    const lessonLabel = createElement("div", "field-label", "Đến bài");
    const lessonInput = createElement("input", "input-text", "");
    lessonInput.type = "number";
    lessonInput.min = 1;
    lessonInput.max = 999;
    lessonInput.value = String(state.testState.lessonMax != null ? state.testState.lessonMax : 50);
    lessonInput.id = "vocab-test-lesson-max";
    lessonField.appendChild(lessonLabel);
    lessonField.appendChild(lessonInput);
    configGrid.appendChild(lessonField);

    const field = createElement("div", "field-group", "");
    const label = createElement("div", "field-label", "Category");
    const select = createElement("select", "", "");
    select.id = "vocab-test-category-select";

    var optionAll = createElement("option", "", "Tất cả");
    optionAll.value = "all";
    select.appendChild(optionAll);

    const categories = getUniqueSorted(
      vocabData.map(function (v) { return v.category; }).filter(function (c) { return c; })
    );
    categories.forEach(function (cat) {
      const opt = createElement("option", "", getCategoryLabel(cat));
      opt.value = cat;
      select.appendChild(opt);
    });

    field.appendChild(label);
    field.appendChild(select);
    configGrid.appendChild(field);

    const qCountField = createElement("div", "field-group", "");
    const qCountLabel = createElement("div", "field-label", "Số câu hỏi (5–100)");
    const qCountInput = createElement("input", "input-text", "");
    qCountInput.type = "number";
    qCountInput.min = 5;
    qCountInput.max = 100;
    qCountInput.value = String(state.testState.questionCount != null ? state.testState.questionCount : 20);
    qCountInput.id = "vocab-test-question-count";
    qCountField.appendChild(qCountLabel);
    qCountField.appendChild(qCountInput);
    configGrid.appendChild(qCountField);

    const optCountField = createElement("div", "field-group", "");
    const optCountLabel = createElement("div", "field-label", "Số đáp án (4–12)");
    const optCountInput = createElement("input", "input-text", "");
    optCountInput.type = "number";
    optCountInput.min = 4;
    optCountInput.max = 14;
    optCountInput.value = String(state.testState.optionCount != null ? state.testState.optionCount : 6);
    optCountInput.id = "vocab-test-option-count";
    optCountField.appendChild(optCountLabel);
    optCountField.appendChild(optCountInput);
    configGrid.appendChild(optCountField);

    // Setting: Câu hỏi hiển thị field nào
    var fieldOptions = [
      { value: "hiragana", label: "Hiragana" },
      { value: "kanji", label: "Kanji" },
      { value: "meaning", label: "Nghĩa tiếng Việt" }
    ];

    const qFieldGroup = createElement("div", "field-group", "");
    const qFieldLabel = createElement("div", "field-label", "Câu hỏi");
    const qFieldSelect = createElement("select", "", "");
    qFieldSelect.id = "vocab-test-question-field";
    fieldOptions.forEach(function (fo) {
      const o = createElement("option", "", fo.label);
      o.value = fo.value;
      if (fo.value === (state.testState.questionField || "hiragana")) {
        o.selected = true;
      }
      qFieldSelect.appendChild(o);
    });
    qFieldGroup.appendChild(qFieldLabel);
    qFieldGroup.appendChild(qFieldSelect);
    configGrid.appendChild(qFieldGroup);

    // Setting: Đáp án hiển thị field nào
    const aFieldGroup = createElement("div", "field-group", "");
    const aFieldLabel = createElement("div", "field-label", "Đáp án");
    const aFieldSelect = createElement("select", "", "");
    aFieldSelect.id = "vocab-test-answer-field";
    fieldOptions.forEach(function (fo) {
      const o = createElement("option", "", fo.label);
      o.value = fo.value;
      if (fo.value === (state.testState.answerField || "meaning")) {
        o.selected = true;
      }
      aFieldSelect.appendChild(o);
    });
    aFieldGroup.appendChild(aFieldLabel);
    aFieldGroup.appendChild(aFieldSelect);
    configGrid.appendChild(aFieldGroup);

    // Setting: có check star ko
    const sStarField = createElement("div", "field-group", "");
    const sStarLabel = createElement("div", "field-label", "Chỉ test từ vựng có ★");
    const sStarInput = createElement("input", "", "");
    sStarInput.checked = state.testState.isStar;
    sStarInput.type = 'checkbox';
    sStarInput.style = 'text-align: left';
    sStarInput.id = "vocab-test-star";
    sStarField.appendChild(sStarLabel);
    sStarField.appendChild(sStarInput);
    configGrid.appendChild(sStarField);

    // Setting: chỉ test từ chưa thuộc
    const sNotMasteredField = createElement("div", "field-group", "");
    const sNotMasteredLabel = createElement("div", "field-label", "Chỉ test từ chưa thuộc");
    const sNotMasteredInput = createElement("input", "", "");
    sNotMasteredInput.checked = state.testState.isNotMastered;
    sNotMasteredInput.type = 'checkbox';
    sNotMasteredInput.style = 'text-align: left';
    sNotMasteredInput.id = "vocab-test-not-mastered";
    sNotMasteredField.appendChild(sNotMasteredLabel);
    sNotMasteredField.appendChild(sNotMasteredInput);
    configGrid.appendChild(sNotMasteredField);

    wrapper.appendChild(configGrid);

    const btnRow = createElement("div", "btn-row", "");
    const startBtn = createElement("button", "btn", "Bắt đầu test");
    startBtn.type = "button";
    startBtn.addEventListener("click", function () {
      var selectedCat = select.value || "all";
      var questionField = qFieldSelect.value || "hiragana";
      var answerField = aFieldSelect.value || "meaning";
      if (questionField === answerField) {
        alert("Câu hỏi và đáp án không được trùng trường hiển thị.");
        return;
      }
      var questionCount = parseInt(qCountInput.value, 10);
      if (isNaN(questionCount) || questionCount < 5) {
        questionCount = 5;
      }
      if (questionCount > 100) {
        questionCount = 100;
      }
      var optionCount = parseInt(optCountInput.value, 10);
      if (isNaN(optionCount) || optionCount < 4) {
        optionCount = 4;
      }
      if (optionCount > 12) {
        optionCount = 12;
      }
      // Phạm vi bài
      var lessonMin = parseInt(lessonMinInput.value, 10);
      if (isNaN(lessonMin) || lessonMin < 1) {
        lessonMin = 1;
      }
      if (lessonMin > 999) {
        lessonMin = 999;
      }

      var lessonMax = parseInt(lessonInput.value, 10);
      if (isNaN(lessonMax) || lessonMax < 1) {
        lessonMax = 50;
      }
      if (lessonMax > 999) {
        lessonMax = 999;
      }
      if (lessonMax < lessonMin) {
        // Nếu người dùng nhập ngược thì tự chỉnh lại cho hợp lý
        var tmp = lessonMin;
        lessonMin = lessonMax;
        lessonMax = tmp;
      }
      var isStar = sStarInput.checked || false;
      var isNotMastered = sNotMasteredInput.checked || false;

      var pool = vocabData.filter(function (raw) {
        if (!raw) {
          return false;
        }
        var idx = vocabData.indexOf(raw);
        // Filter favorites only
        if (isStar) {
          if (!state.vocabFavorites[idx]) {
            return false;
          }
        }
        if (isNotMastered) {
          if (state.vocabMastered[idx]) {
            return false;
          }
        }
        var lesson = raw.lesson != null ? raw.lesson : raw.Lesson;
        var lessonNum = typeof lesson === "number" ? lesson : parseInt(lesson, 10);
        if (isNaN(lessonNum) || lessonNum < lessonMin || lessonNum > lessonMax) {
          return false;
        }
        var hira = raw.hiragana != null ? raw.hiragana : raw.Hiragana;
        if (!String(hira || "").trim()) {
          return false;
        }
        if (selectedCat === "all") {
          return true;
        }
        return raw.category === selectedCat;
      });

      const questions = buildTestQuestions(pool, questionCount);
      if (questions.length === 0) {
        alert("Không có từ vựng phù hợp (phạm vi bài " + lessonMin + "–" + lessonMax + " và category đã chọn).");
        return;
      }

      state.testState.isActive = true;
      state.testState.isFinished = false;
      state.testState.questions = questions;
      state.testState.currentIndex = 0;
      state.testState.correctCount = 0;
      state.testState.answers = [];
      state.testState.selectedCategory = selectedCat;
      state.testState.lessonMin = lessonMin;
      state.testState.lessonMax = lessonMax;
      state.testState.questionCount = questionCount;
      state.testState.optionCount = optionCount;
      state.testState.questionField = questionField;
      state.testState.answerField = answerField;
      state.testState.isStar = isStar;
      state.testState.isNotMastered = isNotMastered;
      renderTestQuestion();
    });

    const cancelBtn = createElement("button", "btn-ghost", "Đóng");
    cancelBtn.type = "button";
    cancelBtn.addEventListener("click", function () {
      closeDetailModal();
    });

    btnRow.appendChild(startBtn);
    btnRow.appendChild(cancelBtn);
    wrapper.appendChild(btnRow);

    if (detailModalState.bodyEl) {
      openDetailModal("Test từ vựng", "");
      detailModalState.bodyEl.innerHTML = "";
      detailModalState.bodyEl.appendChild(wrapper);
    } else if (container) {
      container.appendChild(wrapper);
    }
  }

  function renderTestQuestion() {
    const container = document.getElementById("vocab-test-container");
    if (container) {
      container.innerHTML = "";
    }

    const testState = state.testState;

    if (!testState.isActive || testState.questions.length === 0) {
      renderTestInitialMessage();
      return;
    }

    if (testState.isFinished || testState.currentIndex >= testState.questions.length) {
      renderTestResult();
      return;
    }

    const questionIndex = testState.currentIndex;
    const rawQuestion = testState.questions[questionIndex];
    if (!rawQuestion) {
      renderTestInitialMessage();
      return;
    }

    // Chuẩn hóa field cho câu hỏi hiện tại
    const questionWord = {
      hiragana: rawQuestion.hiragana != null ? rawQuestion.hiragana : rawQuestion.Hiragana,
      kanji: rawQuestion.kanji != null ? rawQuestion.kanji : rawQuestion.Kanji,
      meaning: rawQuestion.meaning != null ? rawQuestion.meaning : rawQuestion.Meaning
    };

    // Sau khi chọn đáp án: đọc lại từ vựng bằng TTS (tiếng Nhật)
    var vocabTextForTts = questionWord.hiragana || "";

    // Lấy field câu hỏi và đáp án từ setting
    const qField = testState.questionField || "hiragana";
    const aField = testState.answerField || "meaning";

    const questionText = questionWord[qField] || questionWord.hiragana || questionWord.kanji || "";
    const correctAnswer = questionWord[aField] || "";

    var fieldLabelMap = { hiragana: "Hiragana", kanji: "Kanji", meaning: "Nghĩa" };
    var qSubText = "Chọn " + (fieldLabelMap[aField] || "đáp án") + " đúng cho " + (fieldLabelMap[qField] || "từ") + " trên";

    // Lọc đáp án sai theo cùng category và phạm vi lesson đã chọn
    const selectedCategory = testState.selectedCategory || "all";
    const lessonMin = testState.lessonMin != null ? testState.lessonMin : 1;
    const lessonMax = testState.lessonMax != null ? testState.lessonMax : 50;
    const answerPool = vocabData.filter(function (v) {
      if (!v) {
        return false;
      }
      if (testState.isStar) {
        var idx = vocabData.indexOf(v);
        // console.log(idx);
        if (!state.vocabFavorites[idx]) {
          return false;
        }
      }
      var lesson = v.lesson != null ? v.lesson : v.Lesson;
      var lessonNum = typeof lesson === "number" ? lesson : parseInt(lesson, 10);
      if (isNaN(lessonNum) || lessonNum < lessonMin || lessonNum > lessonMax) {
        return false;
      }


      if (selectedCategory === "all") {
        return true;
      }
      return v.category === selectedCategory;
    });

    // Lấy danh sách đáp án từ answerField
    const otherMeanings = answerPool
      .map(function (v) {
        if (!v) return null;
        if (aField === "hiragana") return v.hiragana != null ? v.hiragana : v.Hiragana;
        if (aField === "kanji") return v.kanji != null ? v.kanji : v.Kanji;
        return v.meaning != null ? v.meaning : v.Meaning;
      })
      .filter(function (m) { return m; });

    const totalOptions = testState.optionCount != null ? testState.optionCount : 6;
    const shuffledOthers = shuffleArray(otherMeanings);
    const wrongOptions = shuffledOthers.slice(0, totalOptions - 1);

    const rawOptions = [correctAnswer].concat(wrongOptions);
    const uniqueOptions = Array.from(new Set(rawOptions));

    let options = uniqueOptions;
    if (uniqueOptions.length < totalOptions) {
      const additional = shuffledOthers.filter(function (m) {
        return uniqueOptions.indexOf(m) === -1;
      });
      const need = totalOptions - uniqueOptions.length;
      options = uniqueOptions.concat(additional.slice(0, need));
    }
    options = options.slice(0, totalOptions);

    if (options.indexOf(correctAnswer) === -1) {
      options[0] = correctAnswer;
    }

    const shuffledOptions = shuffleArray(options);

    const questionWrapper = createElement("div", "test-question", "");

    const header = createElement("div", "test-question-header", "");
    const left = createElement("div", "", "Câu " + (questionIndex + 1) + " / " + testState.questions.length);
    const right = createElement("div", "", "Đã đúng: " + testState.correctCount);
    header.appendChild(left);
    header.appendChild(right);
    questionWrapper.appendChild(header);

    const qMain = createElement("div", "test-question-main", "");
    const qText = createElement("div", "test-question-text", questionText || "");
    const qSub = createElement("div", "test-question-sub", qSubText);
    qMain.appendChild(qText);
    qMain.appendChild(qSub);

    const progressBarOuter = createElement("div", "test-progress", "");
    const progressInner = createElement("div", "test-progress-bar", "");
    const progressRatio = (questionIndex / testState.questions.length) * 100;
    progressInner.style.width = progressRatio.toFixed(2) + "%";
    progressBarOuter.appendChild(progressInner);
    qMain.appendChild(progressBarOuter);

    questionWrapper.appendChild(qMain);

    var vocabIdxForTest = vocabData.indexOf(rawQuestion);
    if (vocabIdxForTest >= 0) {
      var testMasteredRow = createElement("div", "test-mastered-row", "");
      var testMasteredBtn = createElement(
        "button",
        "test-mastered-btn" + (state.vocabMastered[vocabIdxForTest] ? " test-mastered-btn--active" : ""),
        state.vocabMastered[vocabIdxForTest] ? "Đã đánh dấu thuộc" : "Đánh dấu đã thuộc"
      );
      testMasteredBtn.id = "test-mastered-btn-current";
      testMasteredBtn.type = "button";
      testMasteredBtn.title = "Đánh dấu từ vựng này đã thuộc. Nếu trả lời sai sẽ tự động bỏ đánh dấu.";
      testMasteredBtn.addEventListener("click", function () {
        if (state.vocabMastered[vocabIdxForTest]) {
          delete state.vocabMastered[vocabIdxForTest];
        } else {
          state.vocabMastered[vocabIdxForTest] = true;
        }
        saveVocabMastered();
        testMasteredBtn.textContent = state.vocabMastered[vocabIdxForTest] ? "Đã đánh dấu thuộc" : "Đánh dấu đã thuộc";
        testMasteredBtn.classList.toggle("test-mastered-btn--active", !!state.vocabMastered[vocabIdxForTest]);
      });
      testMasteredRow.appendChild(testMasteredBtn);
      questionWrapper.appendChild(testMasteredRow);
    }

    const optionsGrid = createElement("div", "options-grid", "");
    shuffledOptions.forEach(function (opt, idx) {
      const btn = createElement("button", "option-btn", "");
      const idxSpan = createElement("span", "option-index", String(idx + 1));
      const textSpan = createElement("span", "", opt);
      btn.appendChild(idxSpan);
      btn.appendChild(textSpan);
      btn.addEventListener("click", function () {
        handleSelectAnswer(questionWord, correctAnswer, opt, vocabTextForTts, vocabIdxForTest);
      });
      optionsGrid.appendChild(btn);
    });

    questionWrapper.appendChild(optionsGrid);

    if (detailModalState.bodyEl) {
      openDetailModal("Test từ vựng", "");
      detailModalState.bodyEl.innerHTML = "";
      detailModalState.bodyEl.appendChild(questionWrapper);
    } else if (container) {
      container.appendChild(questionWrapper);
    }
  }

  function renderTestResult() {
    const container = document.getElementById("vocab-test-container");
    if (container) {
      container.innerHTML = "";
    }

    const testState = state.testState;
    const total = testState.questions.length;
    const score = testState.correctCount;
    const percent = total > 0 ? (score / total) * 100 : 0;
    const wrongList = testState.answers.filter(function (a) {
      return !a.isCorrect;
    });
    const correctList = testState.answers.filter(function (a) {
      return a.isCorrect;
    });

    const wrapper = createElement("div", "test-result", "");

    const scoreMain = createElement("div", "score-main", score + " / " + total);
    const scoreDetail = createElement(
      "div",
      "score-detail",
      "Hoàn thành bài test. Số câu sai: " + wrongList.length + "."
    );
    wrapper.appendChild(scoreMain);
    wrapper.appendChild(scoreDetail);

    // Đánh giá theo tỷ lệ đúng
    var commentText = "";
    if (percent > 90) {
      commentText = "%Kinh vãi (^_^)";
    } else if (percent > 80) {
      commentText = "Cũng được đó bạn (-_-)";
    } else if (percent > 60) {
      commentText = "Căng nha bạn (@_@)";
    } else if (percent > 40) {
      commentText = "è è è è è è è è è";
    } else {
      commentText = "Tôi chịu thua bạn rồi (~_#)";
    }
    const commentEl = createElement("div", "score-detail", commentText);
    wrapper.appendChild(commentEl);

    const btnRow = createElement("div", "btn-row", "");
    const retryBtn = createElement("button", "btn", "Làm lại test");
    retryBtn.type = "button";
    retryBtn.addEventListener("click", function () {
      startVocabTest();
    });
    btnRow.appendChild(retryBtn);
    wrapper.appendChild(btnRow);

    if (wrongList.length > 0) {
      const wrongHeader = createElement("div", "card-subtitle", "Danh sách câu sai:");
      wrapper.appendChild(wrongHeader);

      const wrongContainer = createElement("div", "wrong-list", "");
      wrongList.forEach(function (w) {
        const item = createElement("div", "wrong-item", "");

        const q = createElement("div", "wrong-q", w.questionWord);
        item.appendChild(q);

        const correct = createElement(
          "div",
          "wrong-a wrong-a--correct",
          "Đáp án đúng: "
        );
        const correctSpan = createElement("span", "", w.correctMeaning);
        correct.appendChild(correctSpan);

        const selected = createElement(
          "div",
          "wrong-a wrong-a--selected",
          "Bạn chọn: "
        );
        const selectedSpan = createElement("span", "", w.selectedMeaning || "(không chọn)");
        selected.appendChild(selectedSpan);

        item.appendChild(correct);
        item.appendChild(selected);
        wrongContainer.appendChild(item);
      });

      wrapper.appendChild(wrongContainer);
    }

    if (correctList.length > 0) {
      const correctHeader = createElement("div", "card-subtitle", "Danh sách câu đúng:");
      wrapper.appendChild(correctHeader);

      const correctContainer = createElement("div", "wrong-list", "");
      correctList.forEach(function (c) {
        const item = createElement("div", "wrong-item", "");

        const q = createElement("div", "wrong-q", c.questionWord);
        item.appendChild(q);

        const ansRow = createElement(
          "div",
          "wrong-a wrong-a--correct",
          "Đáp án: "
        );
        const ansSpan = createElement("span", "", c.correctMeaning);
        ansRow.appendChild(ansSpan);

        item.appendChild(ansRow);
        correctContainer.appendChild(item);
      });

      wrapper.appendChild(correctContainer);
    }

    if (detailModalState.bodyEl) {
      openDetailModal("Test từ vựng", "");
      detailModalState.bodyEl.innerHTML = "";
      detailModalState.bodyEl.appendChild(wrapper);
    } else if (container) {
      container.appendChild(wrapper);
    }
  }

  // ----- Kanji -----
  function applyKanjiFilter() {
    return kanjiData.filter(function (item) {
      if (state.filter.kanjiLevel !== "all") {
        if ((item.level || "n45") !== state.filter.kanjiLevel) {
          return false;
        }
      }
      var selectedRadicals = Array.isArray(state.filter.kanjiRadical)
        ? state.filter.kanjiRadical
        : [];
      if (selectedRadicals.length > 0) {
        var itemRadicals = String(item.radicals || "")
          .split("|")
          .map(function (rad) { return rad.trim(); })
          .filter(function (rad) { return rad; });
        var matched = selectedRadicals.some(function (rad) {
          return itemRadicals.indexOf(rad) !== -1;
        });
        if (!matched) {
          return false;
        }
      }
      // Search across all fields
      var search = normalizeText(String(state.filter.kanjiSearch || "").trim());
      if (search) {
        var textAll = [
          item.kanji,
          item.hanviet,
          item.on_reading,
          item.kun_reading,
          item.radicals,
          item.core_meaning,
          item.story_image,
          item.logic_development,
          item.memory_tip,
          item.adjectives,
          item.vocabulary
        ].map(function (v) { return normalizeText(v); }).join(" ");
        if (textAll.indexOf(search) === -1) {
          return false;
        }
      }
      // Filter favorites only
      if (state.kanjiFavOnly) {
        var idx = kanjiData.indexOf(item);
        if (!state.kanjiFavorites[idx]) {
          return false;
        }
      }
      return true;
    });
  }

  /** Số trên ô lưới = raw.stt hoặc thứ tự trong danh sách đang lọc (1-based) */
  function findGlobalKanjiIndexByGridStt(nRaw) {
    var nNum = parseInt(String(nRaw).trim(), 10);
    if (isNaN(nNum) || nNum < 1) {
      return -1;
    }
    var filtered = applyKanjiFilter();
    for (var di = 0; di < filtered.length; di++) {
      var raw = filtered[di];
      var shown = raw.stt != null ? Number(raw.stt) : di + 1;
      if (!isNaN(shown) && shown === nNum) {
        return kanjiData.indexOf(raw);
      }
    }
    return -1;
  }

  function clearKanjiGridJumpFocus() {
    var nodes = document.querySelectorAll(".kanji-grid-item--jump-focus");
    nodes.forEach(function (n) {
      n.classList.remove("kanji-grid-item--jump-focus");
    });
  }

  function renderKanjiList() {
    const container = document.getElementById("kanji-list-container");
    const countLabel = document.getElementById("kanji-count-label");
    container.innerHTML = "";

    const filtered = applyKanjiFilter();
    countLabel.textContent = filtered.length + " chữ";

    if (filtered.length === 0) {
      const empty = createElement("div", "detail-empty", "Không có Kanji phù hợp với bộ lọc hiện tại.");
      container.appendChild(empty);
      return;
    }

    // Chỉ dùng grid view
    state.kanjiViewMode = "grid";

    const grid = createElement("div", "kanji-grid", "");
    filtered.forEach(function (raw, displayIdx) {
      const globalIndex = kanjiData.indexOf(raw);
      const item = {
        stt: raw.stt != null ? raw.stt : (displayIdx + 1),
        kanji: raw.kanji,
        name: raw.hanviet
      };

      const cell = createElement("div", "kanji-grid-item", "");
      cell.setAttribute("data-kanji-index", String(globalIndex));

      // Số thứ tự
      const numEl = createElement("div", "kanji-grid-num", String(item.stt));
      cell.appendChild(numEl);

      // Star
      var isKanjiFav = !!state.kanjiFavorites[globalIndex];
      var starBtn = createElement("button", "star-btn" + (isKanjiFav ? " star-btn--active" : ""), isKanjiFav ? "⭐" : "☆");
      starBtn.type = "button";
      starBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (state.kanjiFavorites[globalIndex]) {
          delete state.kanjiFavorites[globalIndex];
        } else {
          state.kanjiFavorites[globalIndex] = true;
        }
        saveKanjiFavorites();
        renderKanjiList();
        refreshStarsTabIfActive();
      });
      cell.appendChild(starBtn);

      const charEl = createElement("div", "kanji-grid-char", item.kanji || "");
      const nameEl = createElement("div", "kanji-grid-name", item.name || "");
      cell.appendChild(charEl);
      cell.appendChild(nameEl);

      cell.addEventListener("click", function () {
        clearKanjiGridJumpFocus();
        state.kanjiHistory = [];
        state.selected.kanjiIndex = globalIndex;
        renderKanjiDetail();
      });

      grid.appendChild(cell);
    });
    container.appendChild(grid);
  }

  /** Nội dung chi tiết Kanji vào một phần tử (dùng chung giữa panel và Test Kanji) */
  function appendKanjiDetailSections(targetEl, kanjiIndex, opts) {
    opts = opts || {};
    var embeddedReadOnly = !!opts.embeddedReadOnly;
    var testReveal = !!opts.testReveal;
    // testReveal: cho phép star, ẩn Mazii/JDict/tập viết/link kanji
    var readOnly = embeddedReadOnly || testReveal;
    var raw = kanjiData[kanjiIndex];
    var item = {
      kanji: raw.kanji,
      hanviet: raw.hanviet,
      kun_reading: raw.kun_reading,
      on_reading: raw.on_reading,
      stroke_count: raw.stroke_count,
      radicals: raw.radicals,
      core_meaning: raw.core_meaning,
      story_image: raw.story_image,
      logic_development: raw.logic_development,
      memory_tip: raw.memory_tip,
      adjectives: raw.adjectives,
      vocabulary: raw.vocabulary
    };
    var globalIndex = kanjiIndex;
    var isKanjiFav = !!state.kanjiFavorites[globalIndex];
    var hero = createElement("div", "kd-hero", "");
    var heroActions = createElement("div", "kd-hero-actions", "");

    // Star: hiển thị khi không phải readOnly (bình thường hoặc testReveal)
    if (!embeddedReadOnly) {
      var starBtn = createElement(
        "button",
        "star-btn" + (isKanjiFav ? " star-btn--active" : ""),
        isKanjiFav ? "⭐" : "☆"
      );
      starBtn.type = "button";
      starBtn.title = "Yêu thích";
      starBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (state.kanjiFavorites[globalIndex]) {
          delete state.kanjiFavorites[globalIndex];
        } else {
          state.kanjiFavorites[globalIndex] = true;
        }
        saveKanjiFavorites();
        if (!testReveal) renderKanjiDetail();
        refreshStarsTabIfActive();
      });
      heroActions.appendChild(starBtn);
    }

    // Mazii / JDict / Tập viết: ẩn khi testReveal
    if (!testReveal) {
      var maziiLink = document.createElement("a");
      maziiLink.className = "kd-mazii-link";
      maziiLink.href = "https://mazii.net/vi-VN/search/kanji/javi/" + encodeURIComponent(item.kanji);
      maziiLink.target = "_blank";
      maziiLink.rel = "noopener noreferrer";
      maziiLink.textContent = "Mazii";
      var jdictLink = document.createElement("a");
      jdictLink.className = "kd-mazii-link kd-jdict-link";
      jdictLink.href = "https://jdict.net/kanji/" + encodeURIComponent(item.kanji);
      jdictLink.target = "_blank";
      jdictLink.rel = "noopener noreferrer";
      jdictLink.textContent = "JDict";
      var pipStt = raw.stt != null ? String(raw.stt) : String(globalIndex + 1);
      var pipUrl = new URL("pip-kanji-pwa/index.html", window.location.href);
      pipUrl.hash = "kanji=" + encodeURIComponent(pipStt);
      var pipLink = document.createElement("a");
      pipLink.className = "kd-mazii-link kd-pip-link";
      pipLink.href = pipUrl.href;
      pipLink.target = "_blank";
      pipLink.rel = "noopener noreferrer";
      pipLink.textContent = "PiP";
      pipLink.title = "Kanji PiP Lab (id " + pipStt + ")";
      var openWriteBtn = createElement("button", "kd-writing-toggle-btn", "✏️");
      openWriteBtn.type = "button";
      openWriteBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openKanjiPracticeModal(item.kanji);
      });
      heroActions.appendChild(maziiLink);
      heroActions.appendChild(jdictLink);
      heroActions.appendChild(pipLink);
      heroActions.appendChild(openWriteBtn);
    }
    var indexLabel = createElement("div", "kd-index", String(globalIndex + 1));
    var kanjiEl = createElement("div", "kd-char", item.kanji);
    var meaningBadge = createElement("div", "kd-meaning-badge", item.core_meaning || "");
    var hanvietEl = createElement("div", "kd-hanviet", item.hanviet || "");
    var heroMain = createElement("div", "kd-hero-main", "");
    var heroMeta = createElement("div", "kd-hero-meta", "");
    heroMain.appendChild(indexLabel);
    heroMain.appendChild(kanjiEl);
    if (item.core_meaning) heroMeta.appendChild(meaningBadge);
    if (item.hanviet) heroMeta.appendChild(hanvietEl);
    if (heroMeta.childNodes.length) heroMain.appendChild(heroMeta);
    var heroBody = createElement("div", "kd-hero-body", "");
    heroBody.appendChild(heroActions);
    heroBody.appendChild(createHeroMidKanjiAutoStroke(item.kanji));
    heroBody.appendChild(heroMain);
    hero.appendChild(heroBody);
    targetEl.appendChild(hero);

    var sec1 = createElement("div", "kd-section kd-section--blue", "");
    sec1.appendChild(createElement("div", "kd-section-title", "Phát âm & Cấu tạo"));
    var sec1Grid = createElement("div", "kd-pills-grid", "");

    function addPillGroup(label, value, mod) {
      if (!value) return;
      var group = createElement("div", "kd-pill-group", "");
      group.appendChild(createElement("div", "kd-pill-label", label));
      var valWrap = createElement("div", "kd-pill-values", "");
      value.split("|").forEach(function (v) {
        var trimmed = String(v || "").trim();
        if (!trimmed) return;
        var pill = createElement("span", "kd-pill" + (mod ? " kd-pill--" + mod : ""), trimmed);
        if (mod === "radical" && !readOnly) {
          pill.classList.add("kd-pill--radical-clickable");
          pill.title = "Click để lọc các bộ thủ cùng nghĩa tiếng Việt";
          pill.addEventListener("click", function () {
            selectKanjiRadicalsByVietnamese(getRadicalVietnameseLabel(trimmed));
          });
        }
        valWrap.appendChild(pill);
      });
      group.appendChild(valWrap);
      sec1Grid.appendChild(group);
    }

    addPillGroup("Âm On", item.on_reading, "on");
    addPillGroup("Âm Kun", item.kun_reading, "kun");

    if (item.stroke_count != null) {
      var strokeGroup = createElement("div", "kd-pill-group", "");
      strokeGroup.appendChild(createElement("div", "kd-pill-label", "Số nét"));
      strokeGroup.appendChild(createElement("span", "kd-pill kd-pill--stroke", String(item.stroke_count) + " nét"));
      sec1Grid.appendChild(strokeGroup);
    }

    addPillGroup("Bộ thủ", item.radicals, "radical");
    sec1.appendChild(sec1Grid);
    targetEl.appendChild(sec1);

    function addStoryRow(sec, icon, label, value) {
      if (!value) return;
      var row = createElement("div", "kd-story-row", "");
      row.appendChild(createElement("span", "kd-story-icon", icon));
      var rowBody = createElement("div", "kd-story-body", "");
      rowBody.appendChild(createElement("div", "kd-story-label", label));
      var rowValue = createElement("div", "kd-story-value", "");
      if (label === "Cấu tạo") {
        if (readOnly) {
          rowValue.textContent = value;
        } else {
          rowValue.innerHTML = linkifyKanjiText(value, item.kanji);
          rowValue.addEventListener("click", function (e) {
            var target = e.target;
            if (target && target.classList.contains("kd-inline-kanji-link")) {
              var idxAttr = target.getAttribute("data-kanji-index");
              var idx = parseInt(idxAttr, 10);
              if (!isNaN(idx) && idx >= 0 && idx < kanjiData.length) {
                if (state.selected.kanjiIndex != null) {
                  state.kanjiHistory.push(state.selected.kanjiIndex);
                }
                state.selected.kanjiIndex = idx;
                renderKanjiDetail();
              }
            }
          });
        }
      } else {
        rowValue.textContent = value;
      }
      rowBody.appendChild(rowValue);
      row.appendChild(rowBody);
      sec.appendChild(row);
    }

    var sec2 = createElement("div", "kd-section kd-section--amber", "");
    sec2.appendChild(createElement("div", "kd-section-title", "Ký ức & Hình ảnh"));
    addStoryRow(sec2, "🖼️", "Tượng hình", item.story_image);
    addStoryRow(sec2, "🔗", "Cấu tạo", item.logic_development);
    targetEl.appendChild(sec2);

    if (item.adjectives && String(item.adjectives).trim() && String(item.adjectives).toLowerCase() !== "không có") {
      var sec3 = createElement("div", "kd-section kd-section--green", "");
      var adjWrap = createElement("div", "kd-vocab-pills", "");
      item.adjectives.split("|").forEach(function (a) {
        var trimmed = String(a).trim();
        if (!trimmed || trimmed.toLowerCase() === "không có") return;
        var parts = trimmed.split(":");
        var chip = createElement("div", "kd-vocab-chip", "");
        chip.appendChild(createElement("span", "kd-vocab-chip-word", parts[0] || ""));
        chip.appendChild(createElement("span", "kd-vocab-chip-meaning", parts[1] || ""));
        adjWrap.appendChild(chip);
      });
      if (adjWrap.children.length > 0) {
        sec3.appendChild(adjWrap);
        targetEl.appendChild(sec3);
      }
    }

    if (item.vocabulary && String(item.vocabulary).trim() && String(item.vocabulary).toLowerCase() !== "không có") {
      var sec4 = createElement("div", "kd-section kd-section--purple", "");

      item.vocabulary.split("|").forEach(function (v) {
        var trimmed = String(v).trim();
        if (!trimmed || trimmed.toLowerCase() === "không có") return;
        var parts = trimmed.split(":");
        var kanjiIndexForFav = kanjiIndex;
        var favKey = getKanjiVocabFavKey(kanjiIndexForFav, parts);
        var isFav = !!state.kanjiVocabFavorites[favKey];
        if (!readOnly && state.ui.kanjiVocabFavOnly && !isFav) {
          return;
        }

        var row = createElement("div", "kd-vocab-row", "");
        var wordEl = createElement("span", "kd-vocab-word", "");
        var wordText = parts[0] || "";
        if (readOnly) {
          wordEl.textContent = wordText;
        } else {
          wordEl.innerHTML = linkifyKanjiText(wordText, item.kanji);
        }
        row.appendChild(wordEl);
        row.appendChild(createElement("span", "kd-vocab-read", parts[1] ? "(" + parts[1] + ")" : ""));
        row.appendChild(createElement("span", "kd-vocab-mean", parts[2] || ""));

        if (!readOnly) {
          var rowStarBtn = createElement("button", "star-btn kd-vocab-star" + (isFav ? " star-btn--active" : ""), isFav ? "⭐" : "☆");
          rowStarBtn.type = "button";
          rowStarBtn.title = isFav ? "Bỏ gắn sao từ vựng" : "Gắn sao từ vựng";
          rowStarBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            if (state.kanjiVocabFavorites[favKey]) {
              delete state.kanjiVocabFavorites[favKey];
            } else {
              state.kanjiVocabFavorites[favKey] = true;
            }
            saveKanjiVocabFavorites();
            renderKanjiDetail();
            refreshStarsTabIfActive();
          });
          row.appendChild(rowStarBtn);
          wordEl.addEventListener("click", function (e) {
            var target = e.target;
            if (target && target.classList.contains("kd-inline-kanji-link")) {
              var idxAttr = target.getAttribute("data-kanji-index");
              var idx = parseInt(idxAttr, 10);
              if (!isNaN(idx) && idx >= 0 && idx < kanjiData.length) {
                if (state.selected.kanjiIndex === idx) {
                  return;
                }
                if (state.selected.kanjiIndex != null) {
                  state.kanjiHistory.push(state.selected.kanjiIndex);
                }
                state.selected.kanjiIndex = idx;
                renderKanjiDetail();
              }
            }
          });
        }

        var kanjiWordOnly = String(parts[0] || "").split("(")[0].trim();
        if (kanjiWordOnly) {
          row.appendChild(createAudioBtn(kanjiWordOnly));
        }

        sec4.appendChild(row);

        let match = parts[0].match(/^(.+?)\((.+?)\)$/);
        let kanji = '';
        let hiragana = '';
        if (match) {
            kanji = match[1];
            hiragana = match[2];
        }

        row.appendChild(createAddVocab(kanji, hiragana , parts[1]));
        sec4.appendChild(row);
      });

      if (sec4.children.length > 0) {
        targetEl.appendChild(sec4);
      }
    }
  }

  function buildKanjiDetailNavRow() {
    var navRow = createElement("div", "kd-nav-row kd-nav-row--header", "");
    var hasBack = Array.isArray(state.kanjiHistory) && state.kanjiHistory.length > 0;
    if (hasBack) {
      var backBtn = createElement("button", "kd-nav-btn kd-nav-btn--back", "← Quay lại");
      backBtn.type = "button";
      backBtn.addEventListener("click", function () {
        if (!state.kanjiHistory.length) return;
        var prevIdx = state.kanjiHistory.pop();
        if (prevIdx != null && prevIdx >= 0 && prevIdx < kanjiData.length) {
          state.selected.kanjiIndex = prevIdx;
          renderKanjiDetail();
        }
      });
      navRow.appendChild(backBtn);
    } else {
      var filtered = applyKanjiFilter();
      var currentIdxInFiltered = filtered.findIndex(function (r) {
        return kanjiData.indexOf(r) === state.selected.kanjiIndex;
      });
      var hasPrev = currentIdxInFiltered > 0;
      var hasNext = currentIdxInFiltered >= 0 && currentIdxInFiltered < filtered.length - 1;

      var prevBtn = createElement("button", "kd-nav-btn", "‹");
      prevBtn.type = "button";
      prevBtn.disabled = !hasPrev;
      prevBtn.addEventListener("click", function () {
        if (!hasPrev) return;
        state.selected.kanjiIndex = kanjiData.indexOf(filtered[currentIdxInFiltered - 1]);
        renderKanjiDetail();
      });
      var nextBtn = createElement("button", "kd-nav-btn", "›");
      nextBtn.type = "button";
      nextBtn.disabled = !hasNext;
      nextBtn.addEventListener("click", function () {
        if (!hasNext) return;
        state.selected.kanjiIndex = kanjiData.indexOf(filtered[currentIdxInFiltered + 1]);
        renderKanjiDetail();
      });
      navRow.appendChild(prevBtn);
      navRow.appendChild(nextBtn);
    }
    return navRow;
  }

  function renderKanjiDetail() {
    var container = document.getElementById("kanji-detail-container");
    container.innerHTML = "";

    if (state.selected.kanjiIndex == null) {
      container.appendChild(createElement("div", "detail-empty", "Chưa chọn Kanji nào."));
      return;
    }

    var raw = kanjiData[state.selected.kanjiIndex];
    if (!raw || !raw.kanji) {
      container.appendChild(createElement("div", "detail-empty", "Không tìm thấy dữ liệu Kanji."));
      return;
    }

    if (state.currentTab === "stars") {
      state.ui.kanjiDetailReturnTab = "stars";
    } else {
      state.ui.kanjiDetailReturnTab = null;
    }

    appendKanjiDetailSections(container, state.selected.kanjiIndex, { embeddedReadOnly: false });
    var contentDiv = createElement("div", "kd-detail-content", "");
    while (container.firstChild) {
      contentDiv.appendChild(container.firstChild);
    }
    openDetailModal("", contentDiv, buildKanjiDetailNavRow());
    syncKanjiDetailHash();
  }

  function renderKanjiTestAnswerReveal(kanjiIndexReveal, reveal) {
    var ts = state.kanjiTestState;
    if (kanjiIndexReveal == null || kanjiIndexReveal < 0 || kanjiIndexReveal >= kanjiData.length) {
      if (ts.currentIndex < ts.questions.length - 1) {
        ts.currentIndex += 1;
        renderKanjiTestQuestion();
      } else {
        ts.isFinished = true;
        renderKanjiTestResult();
      }
      return;
    }
    var modeLabels = {
      1: "Kanji → Âm On", 2: "Kanji → Âm Kun",
      3: "Hán Việt → Kanji", 4: "Kanji → Hán Việt",
      5: "Từ vựng → Nghĩa", 6: "Nghĩa → Kanji",
      7: "Nghĩa → Hiragana", 8: "Hiragana → Kanji", 9: "Hiragana → Nghĩa"
    };
    var work = document.createElement("div");
    appendKanjiDetailSections(work, kanjiIndexReveal, { testReveal: true });
    var contentDiv = createElement("div", "kd-detail-content kd-detail-content--test-reveal", "");
    while (work.firstChild) {
      contentDiv.appendChild(work.firstChild);
    }

    var wrap = createElement("div", "kt-test-reveal", "");
    var banner = createElement("div", "kt-test-reveal-banner", "");
    banner.classList.add(reveal.isCorrect ? "kt-test-reveal-banner--correct" : "kt-test-reveal-banner--wrong");
    banner.appendChild(createElement("div", "kt-test-reveal-status", reveal.isCorrect ? "Đúng rồi!" : "Chưa đúng."));
    var ansRow = createElement("div", "kt-test-reveal-answer", "");
    ansRow.appendChild(document.createTextNode("Đáp án đúng: "));
    ansRow.appendChild(createElement("span", "kt-test-reveal-em", reveal.correct != null ? String(reveal.correct) : ""));
    banner.appendChild(ansRow);
    var pickRow = createElement("div", "kt-test-reveal-pick", "");
    pickRow.appendChild(document.createTextNode("Bạn chọn: "));
    pickRow.appendChild(createElement("span", "kt-test-reveal-em", reveal.selected != null ? String(reveal.selected) : ""));
    banner.appendChild(pickRow);
    banner.appendChild(createElement("div", "kt-test-reveal-mode", "Dạng câu: " + (modeLabels[reveal.mode] || "")));

    var footer = createElement("div", "kt-test-reveal-footer", "");
    var continueBtn = createElement("button", "btn kt-test-reveal-continue", "Tiếp tục");
    continueBtn.type = "button";
    continueBtn.addEventListener("click", function () {
      if (ts.currentIndex < ts.questions.length - 1) {
        ts.currentIndex += 1;
        renderKanjiTestQuestion();
      } else {
        ts.isFinished = true;
        renderKanjiTestResult();
      }
    });
    footer.appendChild(continueBtn);

    wrap.appendChild(banner);
    wrap.appendChild(contentDiv);
    wrap.appendChild(footer);
    if (detailModalState.bodyEl) {
      openDetailModal("Test Kanji", wrap, null);
    }
  }

  // ----- Grammar -----
  function applyGrammarFilter() {
    return grammarData.filter(function (item) {
      if (!item) {
        return false;
      }
      var lessonValue = item.lesson != null ? item.lesson : item.Lesson;
      if (state.filter.grammarLesson !== "all" &&
        String(lessonValue) !== String(state.filter.grammarLesson)) {
        return false;
      }
      var searchRaw = String(state.filter.grammarSearch || "").trim();
      if (searchRaw) {
        var search = normalizeText(searchRaw);
        var text = [
          item.Structure || item.structure,
          item.Meaning,
          item.Explanation
        ].map(function (v) { return normalizeText(v || ""); }).join(" ");
        if (text.indexOf(search) === -1) {
          return false;
        }
      }
      return true;
    });
  }

  function renderGrammarList() {
    const container = document.getElementById("grammar-list-container");
    const countLabel = document.getElementById("grammar-count-label");
    container.innerHTML = "";

    const filtered = applyGrammarFilter();
    countLabel.textContent = filtered.length;

    if (filtered.length === 0) {
      const empty = createElement("div", "detail-empty", "Không có mẫu ngữ pháp phù hợp với bộ lọc hiện tại.");
      container.appendChild(empty);
      return;
    }

    const list = createElement("div", "simple-list simple-list--grammar", "");
    filtered.forEach(function (raw) {
      const globalIndex = grammarData.indexOf(raw);
      const item = {
        stt: raw.STT,
        lesson: raw.lesson != null ? raw.lesson : raw.Lesson,
        structure: raw.structure != null ? raw.structure : raw.Structure,
        content: raw.Meaning
      };
      const row = createElement("div", "simple-item", "");
      row.setAttribute("data-grammar-index", String(globalIndex));

      // Cột STT
      const sttCol = createElement(
        "div",
        "simple-stt",
        item.stt != null ? String(item.stt) : ""
      );

      // Khối nội dung chính: cấu trúc + lesson + preview meaning
      const main = createElement("div", "simple-main simple-main--grammar", "");
      const titleRow = createElement("div", "simple-main-title-row", "");
      const left = createElement("div", "simple-main-text", item.structure);
      const right = createElement(
        "div",
        "simple-sub-text",
        "Lesson " + (item.lesson != null ? item.lesson : item.Lesson)
      );
      titleRow.appendChild(left);
      titleRow.appendChild(right);
      main.appendChild(titleRow);

      var contentPreview = "";
      if (item.content) {
        contentPreview = String(item.content).split("\n").join(" / ");
        if (contentPreview.length > 140) {
          contentPreview = contentPreview.slice(0, 137) + "...";
        }
      }
      if (contentPreview) {
        const sub = createElement(
          "div",
          "simple-sub-text simple-sub-text--grammar",
          contentPreview
        );
        main.appendChild(sub);
      }

      row.appendChild(sttCol);
      row.appendChild(main);

      row.addEventListener("click", function () {
        state.selected.grammarIndex = globalIndex;
        renderGrammarDetail();
      });

      list.appendChild(row);
    });

    container.appendChild(list);
  }

  function renderStarsTab() {
    var kvBox = document.getElementById("stars-kanji-vocab-list");
    if (!kvBox) {
      return;
    }

    kvBox.innerHTML = "";

    var kvKeys = Object.keys(state.kanjiVocabFavorites || {}).filter(function (k) {
      return !!state.kanjiVocabFavorites[k];
    });
    kvKeys.sort(function (a, b) {
      var pa = parseKanjiVocabFavKeyStorage(a);
      var pb = parseKanjiVocabFavKeyStorage(b);
      if (!pa || !pb) {
        return String(a).localeCompare(String(b));
      }
      if (pa.kanjiIndex !== pb.kanjiIndex) {
        return pa.kanjiIndex - pb.kanjiIndex;
      }
      return String(pa.word).localeCompare(String(pb.word));
    });
    if (kvKeys.length === 0) {
      kvBox.appendChild(createElement("div", "detail-empty", "Chưa gắn sao từ nào trong phần “Từ vựng ứng dụng” của chi tiết Kanji."));
    } else {
      var kvList = createElement("div", "simple-list", "");
      kvKeys.forEach(function (key) {
        var parsed = parseKanjiVocabFavKeyStorage(key);
        if (!parsed) {
          return;
        }
        var rawK = kanjiData[parsed.kanjiIndex];
        var kj = rawK && rawK.kanji ? rawK.kanji : "#" + parsed.kanjiIndex;
        var row = createElement("div", "stars-fav-row", "");
        var main = createElement("div", "stars-fav-row-main", "");
        var line1 = createElement("div", "", "");
        line1.textContent = "【" + kj + "】 " + (parsed.word || "");
        main.appendChild(line1);
        var sub = [];
        if (parsed.read) {
          sub.push("(" + parsed.read + ")");
        }
        if (parsed.mean) {
          sub.push(parsed.mean);
        }
        if (sub.length) {
          main.appendChild(createElement("div", "stars-fav-row-meta", sub.join(" — ")));
        }
        var speakText = getStarsKanjiVocabSpeakText(parsed);
        var starBtn = createElement("button", "star-btn star-btn--active", "⭐");
        starBtn.type = "button";
        starBtn.title = "Bỏ sao";
        starBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          delete state.kanjiVocabFavorites[key];
          saveKanjiVocabFavorites();
          // Chỉ bỏ sao — không gọi renderKanjiDetail (tránh mở modal chi tiết Kanji)
          renderStarsTab();
        });
        row.appendChild(main);
        if (speakText) {
          row.appendChild(createAudioBtn(speakText));
        }
        row.appendChild(starBtn);
        row.addEventListener("click", function () {
          state.kanjiHistory = [];
          state.selected.kanjiIndex = parsed.kanjiIndex;
          state.currentTab = "stars";
          renderTabs();
          renderKanjiList();
          renderKanjiDetail();
        });
        kvList.appendChild(row);
      });
      kvBox.appendChild(kvList);
    }
  }

  function splitGrammarExampleLines(text) {
    const lines = [];
    String(text || "").split(/\r?\n/).forEach(function (block) {
      block.split("|").forEach(function (seg) {
        const t = String(seg).trim();
        if (t) {
          lines.push(t);
        }
      });
    });
    return lines;
  }

  function renderGrammarDetail() {
    const container = document.getElementById("grammar-detail-container");
    container.innerHTML = "";

    if (state.selected.grammarIndex == null) {
      const empty = createElement("div", "detail-empty", "Chưa chọn mẫu ngữ pháp nào.");
      container.appendChild(empty);
      return;
    }

    const raw = grammarData[state.selected.grammarIndex];
    const item = {
      lesson: raw.lesson != null ? raw.lesson : raw.Lesson,
      structure: raw.structure != null ? raw.structure : raw.Structure,
      content: raw.Meaning,
      explain: raw.Explanation,
      example: raw.Example
    };
    if (!item) {
      const notFound = createElement("div", "detail-empty", "Không tìm thấy dữ liệu ngữ pháp.");
      container.appendChild(notFound);
      return;
    }

    const root = createElement("div", "grammar-detail", "");

    const structure = createElement("div", "grammar-structure", item.structure);
    root.appendChild(structure);

    const lessonInfo = createElement(
      "div",
      "detail-sub grammar-lesson-chip",
      "Lesson " + (item.lesson != null ? item.lesson : item.Lesson)
    );
    root.appendChild(lessonInfo);

    // Meaning section
    if (item.content) {
      const meaningSection = createElement("div", "grammar-section grammar-section--meaning", "");
      const meaningHeader = createElement("div", "grammar-section__header", "");
      const meaningLabel = createElement("div", "grammar-section__title", "Ý nghĩa");
      meaningHeader.appendChild(meaningLabel);
      meaningSection.appendChild(meaningHeader);

      const meaningBody = createElement("div", "grammar-section__body", "");
      const contentLines = String(item.content).split("\n");
      contentLines.forEach(function (line) {
        const p = createElement("div", "detail-value grammar-section__line", line);
        meaningBody.appendChild(p);
      });
      meaningSection.appendChild(meaningBody);

      root.appendChild(meaningSection);
    }

    // Explanation section
    if (item.explain) {
      const explainSection = createElement("div", "grammar-section grammar-section--explanation", "");
      const explainHeader = createElement("div", "grammar-section__header", "");
      const explainLabel = createElement("div", "grammar-section__title", "Giải thích");
      explainHeader.appendChild(explainLabel);
      explainSection.appendChild(explainHeader);

      const explainBody = createElement("div", "grammar-section__body", "");
      const explainLines = String(item.explain).split("\n");
      explainLines.forEach(function (line) {
        const p = createElement("div", "detail-value grammar-section__line", line);
        explainBody.appendChild(p);
      });
      explainSection.appendChild(explainBody);

      root.appendChild(explainSection);
    }

    // Example section (each segment after | becomes its own line)
    if (item.example) {
      const exampleSection = createElement("div", "grammar-section grammar-section--example", "");
      const exampleHeader = createElement("div", "grammar-section__header", "");
      const exampleLabel = createElement("div", "grammar-section__title", "Ví dụ");
      exampleHeader.appendChild(exampleLabel);
      exampleSection.appendChild(exampleHeader);

      const exampleBody = createElement("div", "grammar-section__body", "");
      const exampleLines = splitGrammarExampleLines(item.example);
      exampleLines.forEach(function (line) {
        const p = createElement("div", "detail-value grammar-section__line grammar-section__line--example", line);
        exampleBody.appendChild(p);
      });
      exampleSection.appendChild(exampleBody);

      root.appendChild(exampleSection);
    }

    openDetailModal("Chi tiết ngữ pháp", root);
  }

  // ----- Note -----
  function populateNoteSelect() {
    var select = document.getElementById("note-doc-select");
    if (!select || !window.DOC_CONFIG || !Array.isArray(window.DOC_CONFIG.docs)) {
      return;
    }

    select.innerHTML = "";

    // Thêm tùy chọn cho nội dung Markdown vừa xuất nếu có
    if (state.note.manualContent) {
      var manualOpt = document.createElement("option");
      manualOpt.value = "__manual__";
      manualOpt.textContent = "[MD] Nội dung vừa xuất";
      select.appendChild(manualOpt);
    }

    window.DOC_CONFIG.docs.forEach(function (doc) {
      var opt = document.createElement("option");
      opt.value = doc.key;
      opt.textContent = doc.label;
      select.appendChild(opt);
    });

    var defaultKey =
      state.note.currentDocKey || window.DOC_CONFIG.defaultKey || null;
    if (defaultKey) {
      select.value = defaultKey;
      state.note.currentDocKey = defaultKey;
    }
  }

  function setupNoteSelect() {
    populateNoteSelect();
    var select = document.getElementById("note-doc-select");
    if (!select) {
      return;
    }

    select.addEventListener("change", function () {
      state.note.currentDocKey = select.value;
      renderNoteContent();
    });

    var incBtn = document.getElementById("note-font-inc");
    var decBtn = document.getElementById("note-font-dec");
    if (incBtn) {
      incBtn.addEventListener("click", function () {
        state.note.fontSize = Math.min(32, state.note.fontSize + 1);
        var container = document.getElementById("note-content-container");
        if (container) container.style.fontSize = state.note.fontSize + "px";
      });
    }
    if (decBtn) {
      decBtn.addEventListener("click", function () {
        state.note.fontSize = Math.max(10, state.note.fontSize - 1);
        var container = document.getElementById("note-content-container");
        if (container) container.style.fontSize = state.note.fontSize + "px";
      });
    }
  }

  function renderNoteContent() {
    const container = document.getElementById("note-content-container");
    if (!container) {
      return;
    }
    container.style.fontSize = state.note.fontSize + "px";

    if (state.note.currentDocKey === "__manual__" && state.note.manualContent) {
      container.classList.remove("note-content-markdown");
      if (typeof marked !== "undefined") {
        container.innerHTML = marked.parse(state.note.manualContent);
        container.classList.add("note-content-markdown");
      } else {
        var pre = document.createElement("pre");
        pre.className = "note-content-text";
        pre.textContent = state.note.manualContent;
        container.innerHTML = "";
        container.appendChild(pre);
      }
      return;
    }

    container.innerHTML = "<span class=\"detail-empty\">Đang tải...</span>";

    const docs = (window.DOC_CONFIG && window.DOC_CONFIG.docs) || [];
    const key = state.note.currentDocKey;
    const target =
      docs.find(function (d) { return d.key === key; }) || docs[0];

    if (!target) {
      container.innerHTML = "<span class=\"detail-empty\">Không tìm thấy tài liệu.</span>";
      return;
    }

    function getNoteFilePath(doc) {
      const type = String(doc.type || "md").toLowerCase();
      var filePath = String(doc.file || "");
      if (filePath.indexOf("/") === -1) {
        // Keep old behavior: `file: "theT"` => `data/doc/theT.md` (default)
        const hasExt = /\.[a-z0-9]+$/i.test(filePath);
        if (!hasExt) {
          if (type === "pdf") {
            filePath = filePath + ".pdf";
          } else if (type === "xlsx") {
            filePath = filePath + ".xlsx";
          } else if (type === "img") {
            // For images, `file` should usually include extension (e.g. a.jpg)
            filePath = filePath;
          } else {
            filePath = filePath + ".md";
          }
        }
        filePath = "data/doc/" + filePath;
      }
      return filePath;
    }

    const type = String(target.type || "md").toLowerCase();
    const filePath = getNoteFilePath(target);

    container.classList.remove("note-content-markdown");

    if (type === "img") {
      const img = document.createElement("img");
      img.src = filePath;
      img.alt = target.label || "image";
      img.loading = "lazy";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.display = "block";
      container.innerHTML = "";
      container.appendChild(img);
      return;
    }

    if (type === "pdf") {
      const wrap = document.createElement("div");
      const link = document.createElement("a");
      link.href = filePath;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Mở PDF: " + filePath;
      link.style.display = "inline-block";
      link.style.marginBottom = "10px";

      const iframe = document.createElement("iframe");
      iframe.src = filePath;
      iframe.title = target.label || "PDF";
      iframe.style.width = "100%";
      iframe.style.height = "75vh";
      iframe.style.border = "1px solid rgba(255,255,255,0.12)";
      iframe.loading = "lazy";

      wrap.appendChild(link);
      wrap.appendChild(iframe);
      container.innerHTML = "";
      container.appendChild(wrap);
      return;
    }

    if (type === "xlsx") {
      const wrap = document.createElement("div");
      const link = document.createElement("a");
      link.href = filePath;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Mở / tải file Excel: " + filePath;
      link.style.display = "inline-block";
      link.style.marginBottom = "10px";

      const content = document.createElement("div");

      wrap.appendChild(link);
      wrap.appendChild(content);
      container.innerHTML = "";
      container.appendChild(wrap);

      if (typeof XLSX === "undefined" || !XLSX || !XLSX.read) {
        const hint = document.createElement("div");
        hint.className = "detail-empty";
        hint.textContent = "Chưa load được thư viện đọc Excel (XLSX).";
        content.appendChild(hint);
        return;
      }

      fetch(filePath)
        .then(function (res) {
          if (!res.ok) {
            throw new Error("HTTP " + res.status);
          }
          return res.arrayBuffer();
        })
        .then(function (buf) {
          const wb = XLSX.read(buf, { type: "array" });
          const firstSheetName = wb.SheetNames && wb.SheetNames[0];
          if (!firstSheetName) {
            content.innerHTML = "<span class=\"detail-empty\">File Excel không có sheet.</span>";
            return;
          }

          const sheet = wb.Sheets[firstSheetName];
          // Render as HTML table (simple + fast). You can swap to sheet_to_json if needed.
          const html = XLSX.utils.sheet_to_html(sheet, {
            id: "xlsx-preview-table",
            editable: false
          });
          content.innerHTML = html;

          const table = content.querySelector("table");
          if (table) {
            table.style.width = "100%";
            table.style.borderCollapse = "collapse";
            table.style.background = "rgba(0,0,0,0.15)";
          }

          // minimal cell styling
          const cells = content.querySelectorAll("td, th");
          for (var i = 0; i < cells.length; i++) {
            cells[i].style.border = "1px solid rgba(255,255,255,0.12)";
            cells[i].style.padding = "6px 8px";
            cells[i].style.verticalAlign = "top";
          }
        })
        .catch(function (err) {
          const msg = err && err.message ? err.message : "unknown";
          content.innerHTML =
            "<span class=\"detail-empty\">Không đọc được file: " +
            filePath +
            " (" +
            msg +
            ").</span>";
        });

      return;
    }

    // default: markdown
    fetch(filePath)
      .then(function (res) {
        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }
        return res.text();
      })
      .then(function (md) {
        if (typeof marked !== "undefined") {
          container.innerHTML = marked.parse(md);
          container.classList.add("note-content-markdown");
        } else {
          var pre = document.createElement("pre");
          pre.className = "note-content-text";
          pre.textContent = md;
          container.innerHTML = "";
          container.appendChild(pre);
        }
      })
      .catch(function () {
        container.innerHTML = "<span class=\"detail-empty\">Không tải được file: " + filePath + ".</span>";
      });
  }

  // ========================
  // LOGIC / EVENT HANDLERS
  // ========================

  function handleHashChange() {
    const rawHash = window.location.hash || "#vocab";
    var detail = parseKanjiDetailHash(rawHash);
    var hash = rawHash;
    if (detail.tab && detail.slug) {
      hash = "#" + detail.tab;
    }
    var tabName = "vocab";
    if (hash === "#kanji") {
      tabName = "kanji";
    } else if (hash === "#grammar") {
      tabName = "grammar";
    } else if (hash === "#stars") {
      tabName = "stars";
    } else if (hash === "#note") {
      tabName = "note";
    } else {
      tabName = "vocab";
    }
    state.currentTab = tabName;
    renderTabs();
    if (tabName === "note") {
      renderNoteContent();
    } else if (tabName === "stars") {
      renderStarsTab();
    }

    if (detail.tab && detail.slug && (tabName === "kanji" || tabName === "stars")) {
      var idx = findKanjiIndexByChar(detail.slug);
      if (idx >= 0) {
        state.kanjiHistory = [];
        state.selected.kanjiIndex = idx;
        renderKanjiList();
        renderKanjiDetail();
      } else {
        window.location.hash = "#" + tabName;
      }
    } else if (tabName === "kanji" || tabName === "stars") {
      renderKanjiList();
    }
  }

  function setupTabs() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const tabName = tab.getAttribute("data-tab");
        if (!tabName) {
          return;
        }
        const targetHash = "#" + tabName;
        if (window.location.hash !== targetHash) {
          window.location.hash = targetHash;
        } else {
          state.currentTab = tabName;
          renderTabs();
        }
      });
    });

    window.addEventListener("hashchange", handleHashChange);
  }

  function setupKanjiDetailResumeListeners() {
    window.addEventListener("pageshow", function () {
      tryRestoreKanjiDetailAfterResume();
    });
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        tryRestoreKanjiDetailAfterResume();
      }
    });
  }

  function setupVocabFilters() {
    const isOnelesson = document.getElementById("vocab-one-lesson");
    const lessonFrom = document.getElementById("vocab-lesson-from");
    const lessonTo = document.getElementById("vocab-lesson-to");
    const lessonPre = document.getElementById("vocab-lesson-pre");
    const lessonNext = document.getElementById("vocab-lesson-next");
    const categorySelect = document.getElementById("vocab-category-filter");
    const notMasteredCb = document.getElementById("vocab-not-mastered-cb");
    const searchInput = document.getElementById("vocab-search-input");
    const addKanji = document.getElementById("add-kanji");

    var savedFT = localStorage.getItem("jp_fillter");
    lessonFrom.value = "1";
    if (savedFT) {
      state.filter = JSON.parse(savedFT);
      if (state.filter.isOnelesson) {
        lessonTo.readOnly = true;
      }
      isOnelesson.checked = state.filter.isOnelesson;
      lessonFrom.value = state.filter.vocabLessonFrom;
      lessonTo.value = state.filter.vocabLessonTo;
      notMasteredCb.checked = state.filter.vocabMastered === "not";
    }

    function saveFillter() {
        try { localStorage.setItem("jp_fillter", JSON.stringify(state.filter)); } catch (e) { }
    }

    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    params.delete("search");

const newUrl =
  window.location.pathname +
  (params.toString() ? "?" + params.toString() : "") +
  window.location.hash;
history.replaceState({}, "", newUrl);

    if (search) {
      searchInput.value = search;
      state.filter.vocabSearch = search;
    }

    function syncLessons() {
      state.filter.vocabLessonFrom = lessonFrom.value.trim();
      if (isOnelesson.checked) {
        state.filter.isOnelesson = true;
        lessonTo.value = lessonFrom.value;
        state.filter.vocabLessonTo = lessonFrom.value.trim();
        lessonTo.readOnly = true; // Chuyển sang chế độ chỉ đọc
        lessonTo.classList.add("disabled-gray");
      } else {
        state.filter.isOnelesson = false;
        state.filter.vocabLessonTo = lessonTo.value.trim();
        lessonTo.readOnly = false; // Mở lại quyền chỉnh sửa khi bỏ chọn
        lessonTo.classList.remove("disabled-gray");
      }
      renderVocabList();
      saveFillter();
    }

    function nextLesson() {
      let next = Number(lessonFrom.value.trim()) + 1;
      state.filter.vocabLessonFrom = next;
      lessonFrom.value = next;
      if (isOnelesson.checked) {
        lessonTo.value = next;
        state.filter.vocabLessonTo = next;
      } else {
        state.filter.vocabLessonTo = lessonTo.value.trim();
      }
      renderVocabList();
      saveFillter();
    }
    function preLesson() {
      let next = Number(lessonFrom.value.trim()) - 1;
      state.filter.vocabLessonFrom = next;
      lessonFrom.value = next;
      if (isOnelesson.checked) {
        lessonTo.value = next;
        state.filter.vocabLessonTo = next;
      } else {
        state.filter.vocabLessonTo = lessonTo.value.trim();
      }
      renderVocabList();
      saveFillter();
    }

    // Lắng nghe sự kiện
    isOnelesson.addEventListener("change", syncLessons);
    lessonFrom.addEventListener("input", syncLessons);
    lessonNext.addEventListener("click", nextLesson);
    lessonPre.addEventListener("click", preLesson);

    function redirectKanji() {
      const kanji = searchInput.value.trim();
      if (!kanji) return;
      window.location.href = `index.html?kanji=${encodeURIComponent(kanji)}#kanji`;
    }

    addKanji.addEventListener("click", redirectKanji);

    

    const categories = getUniqueSorted(
      vocabData.map(function (v) { return v.category; }).filter(function (c) { return c; })
    );
    categories.forEach(function (cat) {
      const opt = createElement("option", "", getCategoryLabel(cat));
      opt.value = cat;
      categorySelect.appendChild(opt);
    });

    lessonFrom.addEventListener("input", function () {
      state.filter.vocabLessonFrom = lessonFrom.value.trim();
      renderVocabList();
    });

    lessonTo.addEventListener("input", function () {
      state.filter.vocabLessonTo = lessonTo.value.trim();
      renderVocabList();
    });

    categorySelect.addEventListener("change", function () {
      state.filter.vocabCategory = categorySelect.value;
      renderVocabList();
    });

    if (notMasteredCb) {
      notMasteredCb.checked = (state.filter.vocabMastered === "not");
      notMasteredCb.addEventListener("change", function () {
        state.filter.vocabMastered = notMasteredCb.checked ? "not" : "all";
        renderVocabList();
        saveFillter();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.filter.vocabSearch = searchInput.value || "";
        renderVocabList();
      });
    }

    const resetBtn = document.getElementById("reset-vocab-filter-btn");
    resetBtn.addEventListener("click", function () {
      state.filter.vocabLessonFrom = "1";
      state.filter.vocabLessonTo = "";
      state.filter.vocabCategory = "all";
      state.filter.vocabSearch = "";
      state.filter.vocabMastered = "all";
      lessonFrom.value = "1";
      lessonTo.value = "";
      categorySelect.value = "all";
      if (notMasteredCb) notMasteredCb.checked = false;
      if (searchInput) {
        searchInput.value = "";
      }
      clearVocabTtsFocus();
      renderVocabList();
    });
  }

  function setupDisplaySettings() {
    const body = document.getElementById("display-settings-body");
    const toggleHeader = document.getElementById("display-settings-toggle");
    const linkToggle = document.getElementById("display-settings-toggle-link");

    if (toggleHeader) {
      toggleHeader.addEventListener("click", function () {
        state.ui.displaySettingsOpen = !state.ui.displaySettingsOpen;
        renderDisplaySettingsUI();
      });
    }

    if (linkToggle) {
      linkToggle.addEventListener("click", function () {
        state.ui.displaySettingsOpen = !state.ui.displaySettingsOpen;
        renderDisplaySettingsUI();
      });
    }

    body.addEventListener("change", function (event) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      const field = target.getAttribute("data-display-field");
      if (!field) {
        return;
      }
      state.displaySettings[field] = target.checked;
      saveDisplaySettings();
      renderDisplaySettingsUI();
      renderVocabList();
    });
  }

  function setupFilterToggles() {
    function attachFilterToggle(toggleId, rowId) {
      const toggle = document.getElementById(toggleId);
      const row = document.getElementById(rowId);
      if (!toggle || !row) {
        return;
      }
      toggle.addEventListener("click", function () {
        const isHidden = row.classList.toggle("filters-row--hidden");
        if (toggle.classList.contains("filter-icon-btn")) {
          toggle.textContent = isHidden ? "☰" : "✕";
        } else {
          toggle.textContent = isHidden ? "Hiện bộ lọc" : "Ẩn bộ lọc";
        }
      });
    }

    // Nav menu shared popup (☰ ở mọi section)
    var navMenuPopup = document.getElementById("nav-menu-popup");
    if (navMenuPopup) {
      function closeNavMenu() {
        navMenuPopup.classList.remove("nav-menu-popup--open");
        document.querySelectorAll(".nav-menu-btn").forEach(function (b) { b.textContent = "☰"; });
      }
      document.addEventListener("click", function (e) {
        var btn = e.target.closest(".nav-menu-btn");
        if (btn) {
          e.stopPropagation();
          var isOpen = navMenuPopup.classList.contains("nav-menu-popup--open");
          closeNavMenu();
          if (!isOpen) {
            var rect = btn.getBoundingClientRect();
            navMenuPopup.style.top = (rect.bottom + 6) + "px";
            navMenuPopup.style.left = rect.left + "px";
            navMenuPopup.classList.add("nav-menu-popup--open");
            btn.textContent = "✕";
          }
          return;
        }
        if (!navMenuPopup.contains(e.target)) closeNavMenu();
      });
      navMenuPopup.addEventListener("click", function (e) {
        var item = e.target.closest("[data-tab]");
        if (!item) return;
        var tabBtn = document.querySelector('.tab[data-tab="' + item.getAttribute("data-tab") + '"]');
        if (tabBtn) tabBtn.click();
        closeNavMenu();
      });
    }
    attachFilterToggle("kanji-filters-toggle", "kanji-filters-row");

    // Star filter toggles
    var vocabFavBtn = document.getElementById("vocab-fav-filter");
    if (vocabFavBtn) {
      vocabFavBtn.addEventListener("click", function () {
        state.vocabFavOnly = !state.vocabFavOnly;
        vocabFavBtn.textContent = state.vocabFavOnly ? "★" : "☆";
        vocabFavBtn.classList.toggle("star-filter-btn--active", state.vocabFavOnly);
        renderVocabList();
      });
    }
    var kanjiFavBtn = document.getElementById("kanji-fav-filter");
    if (kanjiFavBtn) {
      kanjiFavBtn.addEventListener("click", function () {
        state.kanjiFavOnly = !state.kanjiFavOnly;
        kanjiFavBtn.textContent = state.kanjiFavOnly ? "★" : "☆";
        kanjiFavBtn.classList.toggle("star-filter-btn--active", state.kanjiFavOnly);
        renderKanjiList();
      });
    }

    // Auto-play button
    var autoPlayBtn = document.getElementById("vocab-autoplay-btn");
    if (autoPlayBtn) {
      autoPlayBtn.addEventListener("click", function () {
        toggleAutoPlay();
      });
    }

    var ttsBtn = document.getElementById("vocab-tts-btn");
    if (ttsBtn) {
      ttsBtn.addEventListener("click", function () {
        toggleVocabTts();
      });
    }

    var exportMdBtn = document.getElementById("vocab-export-md-btn");
    if (exportMdBtn) {
      exportMdBtn.addEventListener("click", function () {
        exportVocabToMarkdown();
      });
    }
  }

  function startVocabTest() {
    state.testState.isActive = false;
    state.testState.isFinished = false;
    state.testState.questions = [];
    state.testState.currentIndex = 0;
    state.testState.correctCount = 0;
    state.testState.answers = [];
    state.testState.selectedCategory = "all";
    state.testState.lessonMax = 50;
    state.testState.questionCount = 20;
    state.testState.optionCount = 6;
    state.testState.questionField = "hiragana";
    state.testState.answerField = "meaning";
    renderTestInitialMessage();
  }

  function resetVocabTest() {
    state.testState.isActive = false;
    state.testState.isFinished = false;
    state.testState.questions = [];
    state.testState.currentIndex = 0;
    state.testState.correctCount = 0;
    state.testState.answers = [];
    state.testState.selectedCategory = "all";
    state.testState.lessonMax = 50;
    state.testState.questionCount = 20;
    state.testState.optionCount = 6;
    state.testState.questionField = "hiragana";
    state.testState.answerField = "meaning";
    renderTestInitialMessage();
  }
  let isProcessing = false;
  var _overlayTimeout = null;

  function handleSelectAnswer(questionWord, correctAnswer, selectedAnswer, ttsText, vocabIndex) {
    if (isProcessing) return; // chặn spam
    isProcessing = true;

    const testState = state.testState;
    const isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
      testState.correctCount += 1;
    } else {
      // Nếu trả lời sai, hủy đánh dấu đã thuộc (nếu có)
      if (vocabIndex >= 0 && state.vocabMastered[vocabIndex]) {
        delete state.vocabMastered[vocabIndex];
        saveVocabMastered();

        // Cập nhật UI nút "Đã thuộc" về trạng thái chưa thuộc ngay lập tức để phản hồi
        var mBtn = document.getElementById("test-mastered-btn-current");
        if (mBtn) {
          mBtn.textContent = "Đánh dấu đã thuộc";
          mBtn.classList.remove("test-mastered-btn--active");
        }
      }
    }

    // Hiển thị cả hiragana và kanji trong kết quả
    var labelParts = [];
    if (questionWord.hiragana) {
      labelParts.push(String(questionWord.hiragana));
    }
    if (questionWord.kanji) {
      labelParts.push("(" + String(questionWord.kanji) + ")");
    }
    if (questionWord.meaning) {
      labelParts.push("– " + String(questionWord.meaning));
    }
    var qLabel = labelParts.join(" ");
    if (!qLabel) {
      qLabel = questionWord.kanji || questionWord.hiragana || "";
    }

    testState.answers.push({
      questionWord: qLabel,
      correctMeaning: correctAnswer,
      selectedMeaning: selectedAnswer,
      isCorrect: isCorrect
    });

    // Sau khi chọn đáp án thì đọc lại từ vựng (hiragana) bằng TTS
    if (ttsText) {
      speakJapanese(ttsText, null);
    }

    setTimeout(() => {
      isProcessing = false;
      if (testState.currentIndex < testState.questions.length - 1) {
        testState.currentIndex += 1;
        renderTestQuestion();
      } else {
        testState.isFinished = true;
        renderTestResult();
      }
    }, 1500); // 1500ms = 1.5 giây
  }

  function setupTestSection() {
    const startBtn = document.getElementById("start-vocab-test-btn");
    const resetBtn = document.getElementById("reset-test-btn");

    startBtn.addEventListener("click", function () {
      startVocabTest();
    });

    resetBtn.addEventListener("click", function () {
      resetVocabTest();
    });
  }

  // ----- Kanji Test -----

  function parseKanjiVocab(vocabStr) {
    if (!vocabStr) return [];
    return vocabStr.split("|").map(function (raw) {
      var s = String(raw || "").trim();
      if (!s) return { word: "", reading: "", meaning: "" };

      // Định dạng thực tế trong data:
      //   "日本(にほん):Nhật Bản"
      //   "木(き):Cây"
      // => word = phần trước "(", reading = trong ngoặc, meaning = sau ":"
      var openIdx = s.indexOf("(");
      var closeIdx = s.indexOf(")", openIdx + 1);
      var colonIdx = s.indexOf(":");

      var word = "";
      var reading = "";
      var meaning = "";

      if (openIdx !== -1 && closeIdx !== -1 && closeIdx > openIdx) {
        word = s.slice(0, openIdx).trim();
        reading = s.slice(openIdx + 1, closeIdx).trim();
      } else {
        // Fallback: không có hiragana trong ngoặc, coi toàn bộ trước ":" là "word"
        word = (colonIdx !== -1 ? s.slice(0, colonIdx) : s).trim();
      }

      if (colonIdx !== -1 && colonIdx + 1 < s.length) {
        meaning = s.slice(colonIdx + 1).trim();
      }

      return { word: word, reading: reading, meaning: meaning };
    }).filter(function (v) {
      return v.word || v.reading || v.meaning;
    });
  }

  function kanjiModeAvailable(raw, mode) {
    if (mode === 1) return !!(raw.kanji && raw.on_reading);
    if (mode === 2) return !!(raw.kanji && raw.kun_reading);
    if (mode === 3) return !!(raw.hanviet && raw.kanji);
    if (mode === 4) return !!(raw.kanji && raw.hanviet);
    if (mode >= 5 && mode <= 9) return !!(raw.vocabulary && parseKanjiVocab(raw.vocabulary).length > 0);
    return false;
  }

  function buildKanjiPool(mode) {
    if (mode === 1) {
      return kanjiData.map(function (r) {
        return r.on_reading ? r.on_reading.split("|")[0].trim() : "";
      }).filter(Boolean);
    }
    if (mode === 2) {
      return kanjiData.map(function (r) {
        return r.kun_reading ? r.kun_reading.split("|")[0].trim() : "";
      }).filter(Boolean);
    }
    if (mode === 3) {
      return kanjiData.map(function (r) { return r.kanji; }).filter(Boolean);
    }
    if (mode === 6 || mode === 8) {
      var pool = [];
      kanjiData.forEach(function (r) {
        parseKanjiVocab(r.vocabulary).forEach(function (v) { if (v.word) pool.push(v.word); });
      });
      return pool;
    }
    if (mode === 4) {
      return kanjiData.map(function (r) { return r.hanviet; }).filter(Boolean);
    }
    if (mode === 5 || mode === 9) {
      var pool = [];
      kanjiData.forEach(function (r) {
        parseKanjiVocab(r.vocabulary).forEach(function (v) { if (v.meaning) pool.push(v.meaning); });
      });
      return pool;
    }
    if (mode === 7) {
      var pool = [];
      kanjiData.forEach(function (r) {
        parseKanjiVocab(r.vocabulary).forEach(function (v) { if (v.reading) pool.push(v.reading); });
      });
      return pool;
    }
    return [];
  }

  function buildKanjiTestQuestions(config) {
    var fromIdx = (config.fromIdx != null) ? config.fromIdx : 0;
    var toIdx = (config.toIdx != null) ? Math.min(config.toIdx, kanjiData.length - 1) : kanjiData.length - 1;
    var selectedModes = (config.modes && config.modes.length > 0) ? config.modes : [4];
    var count = config.questionCount || 20;
    var isStar = !!config.isStar;

    var candidates = [];
    for (var i = fromIdx; i <= toIdx; i++) {
      if (isStar && !state.kanjiFavorites[i]) continue;
      var raw = kanjiData[i];
      if (!raw) continue;
      selectedModes.forEach(function (mode) {
        if (!kanjiModeAvailable(raw, mode)) return;
        if (mode >= 5 && mode <= 9) {
          parseKanjiVocab(raw.vocabulary).forEach(function (v) {
            candidates.push({ kanjiIdx: i, mode: mode, vocabEntry: v });
          });
        } else {
          candidates.push({ kanjiIdx: i, mode: mode, vocabEntry: null });
        }
      });
    }
    return shuffleArray(candidates).slice(0, count);
  }

  function renderKanjiTestQuestion() {
    const testState = state.kanjiTestState;

    if (!testState.isActive || testState.questions.length === 0) {
      renderKanjiTestInitialMessage(); return;
    }
    if (testState.isFinished || testState.currentIndex >= testState.questions.length) {
      renderKanjiTestResult(); return;
    }

    const qMeta = testState.questions[testState.currentIndex];
    const raw = kanjiData[qMeta.kanjiIdx];
    if (!raw) { renderKanjiTestInitialMessage(); return; }

    const mode = qMeta.mode;
    const ve = qMeta.vocabEntry; // vocab entry for modes 5–9

    var questionText = "";
    var questionHint = "";
    var questionSub = "";
    var correct = "";
    var pool = [];

    if (mode === 1) {
      questionText = raw.kanji;
      questionSub = "Âm On của kanji này là gì?";
      correct = raw.on_reading.split("|")[0].trim();
      pool = buildKanjiPool(1);
    } else if (mode === 2) {
      questionText = raw.kanji;
      questionSub = "Âm Kun của kanji này là gì?";
      correct = raw.kun_reading.split("|")[0].trim();
      pool = buildKanjiPool(2);
    } else if (mode === 3) {
      questionText = raw.hanviet;
      questionSub = "Hán Việt này là của kanji nào?";
      correct = raw.kanji;
      pool = buildKanjiPool(3);
    } else if (mode === 4) {
      questionText = raw.kanji;
      questionSub = "Hán Việt của kanji này là gì?";
      correct = raw.hanviet;
      pool = buildKanjiPool(4);
    } else if (mode === 5) {
      questionText = ve.word;
      questionHint = ve.reading + "　[" + raw.kanji + " " + raw.hanviet + "]";
      questionSub = "Nghĩa tiếng Việt của từ này là gì?";
      correct = ve.meaning;
      pool = buildKanjiPool(5);
    } else if (mode === 6) {
      questionText = ve.meaning;
      questionHint = "";
      questionSub = "Từ vựng kanji nào có nghĩa này?";
      correct = ve.word;
      pool = buildKanjiPool(6);
    } else if (mode === 7) {
      questionText = ve.meaning;
      questionHint = "";
      questionSub = "Hiragana của từ vựng này là gì?";
      correct = ve.reading;
      pool = buildKanjiPool(7);
    } else if (mode === 8) {
      questionText = ve.reading;
      questionHint = "";
      questionSub = "Từ vựng kanji nào có cách đọc này?";
      correct = ve.word;
      pool = buildKanjiPool(8);
    } else if (mode === 9) {
      questionText = ve.reading;
      questionHint = "";
      questionSub = "Nghĩa tiếng Việt của từ vựng này là gì?";
      correct = ve.meaning;
      pool = buildKanjiPool(9);
    }

    var optCount = testState.optionCount || 6;
    var others = shuffleArray(pool.filter(function (x) { return x && x !== correct; }));
    var options = Array.from(new Set([correct].concat(others.slice(0, optCount - 1))));
    if (options.length < optCount) {
      var more = others.filter(function (x) { return options.indexOf(x) === -1; });
      options = options.concat(more.slice(0, optCount - options.length));
    }
    if (options.indexOf(correct) === -1) options[0] = correct;
    options = shuffleArray(options).slice(0, optCount);

    // Build UI
    const wrapper = createElement("div", "test-question", "");
    const header = createElement("div", "test-question-header", "");
    header.appendChild(createElement("div", "", "Câu " + (testState.currentIndex + 1) + " / " + testState.questions.length));
    header.appendChild(createElement("div", "", "Đúng: " + testState.correctCount));
    wrapper.appendChild(header);

    const qMain = createElement("div", "test-question-main", "");
    qMain.appendChild(createElement("div", "test-question-text", questionText || ""));
    if (questionHint) {
      qMain.appendChild(createElement("div", "test-question-hint", questionHint));
    }
    qMain.appendChild(createElement("div", "test-question-sub", questionSub));
    wrapper.appendChild(qMain);

    const optionsGrid = createElement("div", "options-grid", "");
    options.forEach(function (opt, idx) {
      const btn = createElement("button", "option-btn", "");
      btn.appendChild(createElement("span", "option-index", String(idx + 1)));
      btn.appendChild(createElement("span", "", opt));
      btn.addEventListener("click", function () {
        handleKanjiSelectAnswer(
          { kanji: raw.kanji, name: raw.hanviet, ve: ve },
          mode,
          correct,
          opt,
          qMeta.kanjiIdx
        );
      });
      optionsGrid.appendChild(btn);
    });
    wrapper.appendChild(optionsGrid);

    if (detailModalState.bodyEl) {
      openDetailModal("Test Kanji", "");
      detailModalState.bodyEl.innerHTML = "";
      detailModalState.bodyEl.appendChild(wrapper);
    }
  }

  function renderKanjiTestInitialMessage() {
    const ts = state.kanjiTestState;
    const total = kanjiData.length;

    const wrapper = createElement("div", "test-result", "");
    wrapper.appendChild(createElement("div", "score-main", "Cấu hình Test Kanji"));

    // --- Range ---
    const rangeSection = createElement("div", "kt-section", "");
    rangeSection.appendChild(createElement("div", "kt-section-label", "Phạm vi kanji"));
    const rangeRow = createElement("div", "kt-range-row", "");

    const fromField = createElement("div", "field-group", "");
    fromField.appendChild(createElement("div", "field-label", "Từ số"));
    const fromInput = createElement("input", "input-text", "");
    fromInput.type = "number"; fromInput.min = 1; fromInput.max = total;
    fromInput.value = String((ts.fromIdx != null ? ts.fromIdx : 0) + 1);
    fromField.appendChild(fromInput);

    const toField = createElement("div", "field-group", "");
    toField.appendChild(createElement("div", "field-label", "Đến số"));
    const toInput = createElement("input", "input-text", "");
    toInput.type = "number"; toInput.min = 1; toInput.max = total;
    toInput.value = String((ts.toIdx != null ? ts.toIdx : total - 1) + 1);
    toField.appendChild(toInput);

    rangeRow.appendChild(fromField);
    rangeRow.appendChild(toField);
    rangeSection.appendChild(rangeRow);
    wrapper.appendChild(rangeSection);

    // --- Số câu / Số đáp án ---
    const configSection = createElement("div", "kt-section", "");
    configSection.appendChild(createElement("div", "kt-section-label", "Cài đặt câu hỏi"));
    const configGrid = createElement("div", "test-config-fields", "");

    const qCountField = createElement("div", "field-group", "");
    qCountField.appendChild(createElement("div", "field-label", "Số câu hỏi (5–100)"));
    const qCountInput = createElement("input", "input-text", "");
    qCountInput.type = "number"; qCountInput.min = 5; qCountInput.max = 100;
    qCountInput.value = String(ts.questionCount || 20);
    qCountField.appendChild(qCountInput);

    const optCountField = createElement("div", "field-group", "");
    optCountField.appendChild(createElement("div", "field-label", "Số đáp án (4–14)"));
    const optCountInput = createElement("input", "input-text", "");
    optCountInput.type = "number"; optCountInput.min = 4; optCountInput.max = 14;
    optCountInput.value = String(ts.optionCount || 6);
    optCountField.appendChild(optCountInput);

    configGrid.appendChild(qCountField);
    configGrid.appendChild(optCountField);
    configSection.appendChild(configGrid);
    wrapper.appendChild(configSection);

    // --- Chỉ test chữ có sao ---
    const isStarField = createElement("div", "field-group", "");
    const isStarLabel = createElement("label", "kt-mode-label", "");
    const isStarInput = document.createElement("input");
    isStarInput.type = "checkbox";
    isStarInput.checked = ts.isStar || false;
    isStarLabel.appendChild(isStarInput);
    isStarLabel.appendChild(document.createTextNode(" Chỉ test chữ có ★"));
    isStarField.appendChild(isStarLabel);
    configSection.appendChild(isStarField);

    var revealDetailField = createElement("div", "field-group", "");
    var revealDetailLabel = createElement("label", "kt-mode-label", "");
    var revealDetailInput = document.createElement("input");
    revealDetailInput.type = "checkbox";
    revealDetailInput.checked = !!ts.showAnswerKanjiDetailAfterEach;
    revealDetailLabel.appendChild(revealDetailInput);
    revealDetailLabel.appendChild(document.createTextNode("Hiển thị kết quả sau mỗi câu"));
    revealDetailField.appendChild(revealDetailLabel);
    configSection.appendChild(revealDetailField);

    // --- Dạng câu hỏi ---
    const modeSection = createElement("div", "kt-section", "");
    modeSection.appendChild(createElement("div", "kt-section-label", "Dạng câu hỏi"));
    const modeGrid = createElement("div", "kt-mode-grid", "");

    var savedModes = ts.modes || [4];
    var modeDefs = [
      { id: 4, label: "Kanji → Hán Việt" },
      { id: 3, label: "Hán Việt → Kanji" },
      { id: 1, label: "Kanji → Âm On" },
      { id: 2, label: "Kanji → Âm Kun" },
      { id: 5, label: "Từ vựng → Nghĩa" },
      { id: 6, label: "Nghĩa → Kanji" },
      { id: 7, label: "Nghĩa → Hiragana" },
      { id: 8, label: "Hiragana → Kanji" },
      { id: 9, label: "Hiragana → Nghĩa" }
    ];
    var modeCheckboxes = [];
    modeDefs.forEach(function (def) {
      const lbl = createElement("label", "kt-mode-label", "");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.value = String(def.id);
      cb.checked = savedModes.indexOf(def.id) !== -1;
      cb.className = "kt-mode-cb";
      lbl.appendChild(cb);
      lbl.appendChild(document.createTextNode(" " + def.label));
      modeCheckboxes.push(cb);
      modeGrid.appendChild(lbl);
    });
    modeSection.appendChild(modeGrid);
    wrapper.appendChild(modeSection);

    // --- Buttons ---
    const btnRow = createElement("div", "btn-row", "");
    const startBtn = createElement("button", "btn", "Bắt đầu test");
    startBtn.type = "button";
    startBtn.addEventListener("click", function () {
      var fromVal = parseInt(fromInput.value, 10);
      var toVal = parseInt(toInput.value, 10);
      if (isNaN(fromVal) || fromVal < 1) fromVal = 1;
      if (isNaN(toVal) || toVal < fromVal) toVal = fromVal;
      if (fromVal > total) fromVal = total;
      if (toVal > total) toVal = total;

      var qCount = parseInt(qCountInput.value, 10);
      if (isNaN(qCount) || qCount < 5) qCount = 5;
      if (qCount > 100) qCount = 100;

      var optCount = parseInt(optCountInput.value, 10);
      if (isNaN(optCount) || optCount < 4) optCount = 4;
      if (optCount > 14) optCount = 14;

      var selectedModes = modeCheckboxes
        .filter(function (cb) { return cb.checked; })
        .map(function (cb) { return parseInt(cb.value, 10); });
      if (selectedModes.length === 0) selectedModes = [4];

      var isStarVal = isStarInput.checked || false;
      ts.showAnswerKanjiDetailAfterEach = !!revealDetailInput.checked;
      ts.fromIdx = fromVal - 1;
      ts.toIdx = toVal - 1;
      ts.questionCount = qCount;
      ts.optionCount = optCount;
      ts.modes = selectedModes;
      ts.isStar = isStarVal;
      ts.isActive = true;
      ts.isFinished = false;
      ts.currentIndex = 0;
      ts.correctCount = 0;
      ts.answers = [];
      ts.questions = buildKanjiTestQuestions({
        fromIdx: ts.fromIdx,
        toIdx: ts.toIdx,
        modes: selectedModes,
        questionCount: qCount,
        isStar: isStarVal
      });

      if (ts.questions.length === 0) {
        var msg = "Không có câu hỏi phù hợp với cài đặt hiện tại.";
        if (isStarVal) {
          msg += " Bạn chưa gắn sao chữ nào hoặc phạm vi không có chữ có sao. Hãy gắn sao vài chữ kanji trước.";
        } else {
          msg += " Hãy mở rộng phạm vi hoặc chọn thêm dạng câu hỏi.";
        }
        alert(msg);
        return;
      }
      renderKanjiTestQuestion();
    });

    const cancelBtn = createElement("button", "btn-ghost", "Đóng");
    cancelBtn.type = "button";
    cancelBtn.addEventListener("click", function () { closeDetailModal(); });

    btnRow.appendChild(startBtn);
    btnRow.appendChild(cancelBtn);
    wrapper.appendChild(btnRow);

    if (detailModalState.bodyEl) {
      openDetailModal("Test Kanji", "");
      detailModalState.bodyEl.innerHTML = "";
      detailModalState.bodyEl.appendChild(wrapper);
    }
  }

  function renderKanjiTestResult() {
    const testState = state.kanjiTestState;
    const total = testState.questions.length;
    const score = testState.correctCount;

    const wrapper = createElement("div", "test-result", "");
    const scoreMain = createElement("div", "score-main", score + " / " + total);
    const scoreDetail = createElement(
      "div",
      "score-detail",
      "Hoàn thành test Kanji."
    );
    wrapper.appendChild(scoreMain);
    wrapper.appendChild(scoreDetail);

    const modeLabels = {
      1: "Kanji → Âm On", 2: "Kanji → Âm Kun",
      3: "Hán Việt → Kanji", 4: "Kanji → Hán Việt",
      5: "Từ vựng → Nghĩa", 6: "Nghĩa → Kanji",
      7: "Nghĩa → Hiragana", 8: "Hiragana → Kanji", 9: "Hiragana → Nghĩa"
    };

    const wrongList = testState.answers.filter(function (a) { return !a.isCorrect; });
    const correctList = testState.answers.filter(function (a) { return a.isCorrect; });

    if (wrongList.length > 0) {
      const wrongHeader = createElement("div", "card-subtitle", "Danh sách câu sai:");
      wrapper.appendChild(wrongHeader);

      const wrongContainer = createElement("div", "wrong-list", "");
      wrongList.forEach(function (w, idx) {
        const itemBox = createElement("div", "wrong-item", "");
        const k = w.item || {};

        const titleText = (k.kanji ? k.kanji : "") + (k.name ? " (" + k.name + ")" : "") || ("Câu " + (idx + 1));
        itemBox.appendChild(createElement("div", "wrong-q", titleText));

        const modeBadge = createElement("div", "wrong-mode-badge", modeLabels[w.mode] || "");
        itemBox.appendChild(modeBadge);

        if (k.ve && (k.ve.word || k.ve.reading)) {
          const veInfo = createElement("div", "wrong-a", k.ve.word + " (" + k.ve.reading + "): " + k.ve.meaning);
          itemBox.appendChild(veInfo);
        }

        const correctRow = createElement("div", "wrong-a wrong-a--correct", "Đúng: ");
        correctRow.appendChild(createElement("span", "", w.correct));
        const selectedRow = createElement("div", "wrong-a wrong-a--selected", "Bạn chọn: ");
        selectedRow.appendChild(createElement("span", "", w.selected || "(không chọn)"));

        itemBox.appendChild(correctRow);
        itemBox.appendChild(selectedRow);
        wrongContainer.appendChild(itemBox);
      });

      wrapper.appendChild(wrongContainer);
    }

    if (correctList.length > 0) {
      const correctHeader = createElement("div", "card-subtitle", "Danh sách câu đúng:");
      wrapper.appendChild(correctHeader);

      const correctContainer = createElement("div", "wrong-list", "");
      correctList.forEach(function (c, idx) {
        const itemBox = createElement("div", "wrong-item", "");
        const k = c.item || {};

        const titleText = (k.kanji ? k.kanji : "") + (k.name ? " (" + k.name + ")" : "") || ("Câu " + (idx + 1));
        itemBox.appendChild(createElement("div", "wrong-q", titleText));

        const modeBadge = createElement("div", "wrong-mode-badge", modeLabels[c.mode] || "");
        itemBox.appendChild(modeBadge);

        if (k.ve && (k.ve.word || k.ve.reading)) {
          const veInfo = createElement("div", "wrong-a", k.ve.word + " (" + k.ve.reading + "): " + k.ve.meaning);
          itemBox.appendChild(veInfo);
        }

        const correctRow = createElement("div", "wrong-a wrong-a--correct", "Đáp án: ");
        correctRow.appendChild(createElement("span", "", c.correct));
        itemBox.appendChild(correctRow);

        correctContainer.appendChild(itemBox);
      });

      wrapper.appendChild(correctContainer);
    }

    const btnRow = createElement("div", "btn-row", "");
    const retryBtn = createElement("button", "btn", "Làm lại");
    retryBtn.type = "button";
    retryBtn.addEventListener("click", function () {
      var ts = state.kanjiTestState;
      ts.isActive = false;
      ts.isFinished = false;
      ts.questions = [];
      ts.currentIndex = 0;
      ts.correctCount = 0;
      ts.answers = [];
      renderKanjiTestInitialMessage();
    });
    const closeBtn = createElement("button", "btn-ghost", "Đóng");
    closeBtn.type = "button";
    closeBtn.addEventListener("click", function () {
      closeDetailModal();
    });
    btnRow.appendChild(retryBtn);
    btnRow.appendChild(closeBtn);
    wrapper.appendChild(btnRow);

    if (detailModalState.bodyEl) {
      openDetailModal("Test Kanji", "");
      detailModalState.bodyEl.innerHTML = "";
      detailModalState.bodyEl.appendChild(wrapper);
    }
  }

  function handleKanjiSelectAnswer(item, mode, correct, selected, kanjiIdxForReveal) {
    var testState = state.kanjiTestState;
    var isCorrect = selected === correct;
    if (isCorrect) testState.correctCount += 1;
    testState.answers.push({ item: item, mode: mode, correct: correct, selected: selected, isCorrect: isCorrect });

    if (item && item.ve && item.ve.reading) {
      speakJapanese(item.ve.reading, null);
    }

    if (testState.showAnswerKanjiDetailAfterEach) {
      renderKanjiTestAnswerReveal(kanjiIdxForReveal, {
        mode: mode,
        correct: correct,
        selected: selected,
        isCorrect: isCorrect
      });
      return;
    }

    if (testState.currentIndex < testState.questions.length - 1) {
      testState.currentIndex += 1;
      renderKanjiTestQuestion();
    } else {
      testState.isFinished = true;
      renderKanjiTestResult();
    }
  }

  function setupKanjiFilters() {
    const radicalSelect = document.getElementById("kanji-radical-filter");
    const radicals = kanjiData
      .map(function (k) { return k.radicals; })
      .filter(function (b) { return b; })
      .reduce(function (all, rads) {
        return all.concat(String(rads).split("|"));
      }, [])
      .map(function (rad) { return rad.trim(); })
      .filter(function (rad) { return rad; })
      .filter(function (rad, idx, arr) { return arr.indexOf(rad) === idx; })
      .sort(function (a, b) {
        return getRadicalVietnameseLabel(a).localeCompare(
          getRadicalVietnameseLabel(b),
          "vi",
          { sensitivity: "base" }
        );
      });

    if (radicalSelect) {
      radicalSelect.innerHTML = "";
    }
    radicals.forEach(function (radical) {
      const opt = createElement("option", "", radical);
      opt.value = radical;
      radicalSelect.appendChild(opt);
    });

    radicalSelect.addEventListener("change", function () {
      state.filter.kanjiRadical = Array.prototype.map.call(
        radicalSelect.selectedOptions,
        function (opt) { return opt.value; }
      );
      renderKanjiList();
    });

    var kanjiSearchInput = document.getElementById("kanji-search-input");

    const params = new URLSearchParams(window.location.search);
    const kanjiOfUrl = params.get("kanji");
    if (kanjiOfUrl) {
        kanjiSearchInput.value = kanjiOfUrl;
        state.filter.kanjiSearch = kanjiOfUrl;
        state.filter.kanjiLevel = "all";
        document.querySelector('#kanji-level-chips .chip--active')?.classList.remove('chip--active');

      document.querySelector('#kanji-level-chips .chip[data-level="all"]').classList.add('chip--active');
        renderKanjiList();
    }
    if (kanjiSearchInput) {
      kanjiSearchInput.addEventListener("input", function () {
        state.filter.kanjiSearch = kanjiSearchInput.value;
        state.filter.kanjiLevel = "all";
        renderKanjiList();
      });
    }

    var kanjiSttJumpInput = document.getElementById("kanji-stt-jump-input");
    if (kanjiSttJumpInput) {
      kanjiSttJumpInput.addEventListener("change", function () {
        var v = kanjiSttJumpInput.value;
        if (!v || !String(v).trim()) {
          return;
        }
        var gIdx = findGlobalKanjiIndexByGridStt(v);
        if (gIdx < 0) {
          return;
        }
        requestAnimationFrame(function () {
          var el = document.querySelector('.kanji-grid-item[data-kanji-index="' + gIdx + '"]');
          clearKanjiGridJumpFocus();
          if (el) {
            el.scrollIntoView({ block: "nearest", behavior: "smooth" });
            el.classList.add("kanji-grid-item--jump-focus");
          }
        });
      });
    }

    var levelChipsContainer = document.getElementById("kanji-level-chips");
    if (levelChipsContainer) {
      levelChipsContainer.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-level]");
        if (!btn) return;
        state.filter.kanjiLevel = btn.getAttribute("data-level");
        Array.prototype.forEach.call(
          levelChipsContainer.querySelectorAll("[data-level]"),
          function (b) { b.classList.remove("chip--active"); }
        );
        btn.classList.add("chip--active");
        renderKanjiList();
      });
    }

    var resetKanjiFilterBtn = document.getElementById("reset-kanji-filter-btn");
    if (resetKanjiFilterBtn) {
      resetKanjiFilterBtn.addEventListener("click", function () {
        state.filter.kanjiRadical = [];
        state.filter.kanjiLevel = "n3";
        state.filter.kanjiSearch = "";
        state.kanjiFavOnly = false;
        if (levelChipsContainer) {
          Array.prototype.forEach.call(
            levelChipsContainer.querySelectorAll("[data-level]"),
            function (b) { b.classList.remove("chip--active"); }
          );
          var n3Chip = levelChipsContainer.querySelector('[data-level="n3"]');
          if (n3Chip) n3Chip.classList.add("chip--active");
        }
        if (radicalSelect) {
          Array.prototype.forEach.call(radicalSelect.options, function (opt) {
            opt.selected = false;
          });
        }
        if (kanjiSearchInput) {
          kanjiSearchInput.value = "";
        }
        var kanjiFavBtn = document.getElementById("kanji-fav-filter");
        if (kanjiFavBtn) {
          kanjiFavBtn.textContent = "☆";
          kanjiFavBtn.classList.remove("star-filter-btn--active");
        }
        var kanjiSttJumpClear = document.getElementById("kanji-stt-jump-input");
        if (kanjiSttJumpClear) {
          kanjiSttJumpClear.value = "";
        }
        renderKanjiList();
      });
    }

    var addKanji2 = document.getElementById("add-kanji-2");
    if (addKanji2) {
      addKanji2.addEventListener("click", function () {
          const kanji = kanjiSearchInput.value.trim();
          window.location.href = `addKanji/index.html?kanji=${encodeURIComponent(kanji)}`;
      });
    }

    // Kanji chỉ dùng grid view (không toggle mode)
    state.kanjiViewMode = "grid";

    const startKanjiTestBtn = document.getElementById("start-kanji-test-btn");
    if (startKanjiTestBtn) {
      startKanjiTestBtn.addEventListener("click", function () {
        state.kanjiTestState.isActive = false;
        state.kanjiTestState.isFinished = false;
        state.kanjiTestState.questions = [];
        state.kanjiTestState.currentIndex = 0;
        state.kanjiTestState.correctCount = 0;
        state.kanjiTestState.answers = [];
        renderKanjiTestInitialMessage();
      });
    }
  }

  function setupGrammarFilters() {
    const lessonSelect = document.getElementById("grammar-lesson-filter");
    const searchInput = document.getElementById("grammar-search-input");
    const lessons = getUniqueSorted(
      grammarData.map(function (g) {
        return g.lesson != null ? g.lesson : g.Lesson;
      })
    );
    lessons.forEach(function (lesson) {
      const opt = createElement("option", "", "Lesson " + lesson);
      opt.value = String(lesson);
      lessonSelect.appendChild(opt);
    });

    lessonSelect.addEventListener("change", function () {
      state.filter.grammarLesson = lessonSelect.value;
      renderGrammarList();
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.filter.grammarSearch = searchInput.value || "";
        renderGrammarList();
      });
    }

    const resetGrammarFilterBtn = document.getElementById("reset-grammar-filter-btn");
    if (resetGrammarFilterBtn) {
      resetGrammarFilterBtn.addEventListener("click", function () {
        state.filter.grammarLesson = "all";
        state.filter.grammarSearch = "";
        lessonSelect.value = "all";
        if (searchInput) {
          searchInput.value = "";
        }
        renderGrammarList();
      });
    }
  }

  function setupDetailModal() {
    const el = document.getElementById("detail-modal");
    const bodyEl = document.getElementById("detail-modal-body");
    const titleEl = document.getElementById("detail-modal-title");
    const navEl = document.getElementById("detail-modal-nav");
    const closeBtn = document.getElementById("detail-modal-close-btn");

    if (!el || !bodyEl || !titleEl || !closeBtn) {
      return;
    }

    detailModalState.el = el;
    detailModalState.bodyEl = bodyEl;
    detailModalState.titleEl = titleEl;
    detailModalState.navEl = navEl || null;
    detailModalState.closeBtn = closeBtn;

    closeBtn.addEventListener("click", function () {
      closeDetailModal();
    });

    el.addEventListener("click", function (event) {
      if (event.target === el || event.target.classList.contains("detail-modal__backdrop")) {
        closeDetailModal();
      }
    });

    window.addEventListener("resize", function () {
      if (!isSmallScreen()) {
        closeDetailModal();
      }
    });
  }

  function boldKanji(text) {
    return text.replace(/\p{Script=Han}/gu, match => `<b>${match}</b>`);
  }

  // ========================
  // INIT
  // ========================

  document.addEventListener("DOMContentLoaded", function () {
    // Merge N3 vocab từ các file vocabData_1.js, vocabData_2.js (nếu có)
    if (window._vocabExtra && window._vocabExtra.length) {
      vocabData.push.apply(vocabData, window._vocabExtra);
    }
    // Merge N3 kanji từ các file kanjiData_1.js, kanjiData_2.js (nếu có)
    if (window._kanjiExtra && window._kanjiExtra.length) {
      kanjiData.push.apply(kanjiData, window._kanjiExtra);
    }

    setupTabs();
    setupKanjiDetailResumeListeners();
    setupVocabFilters();
    setupDisplaySettings();
    setupTestSection();
    setupKanjiFilters();
    setupGrammarFilters();
    setupFilterToggles();
    setupNoteSelect();
    setupDetailModal();

    renderDisplaySettingsUI();
    renderVocabList();
    renderKanjiList();
    renderKanjiDetail();
    renderGrammarList();
    renderGrammarDetail();

    if (!window.location.hash) {
      window.location.hash = "#vocab";
    } else {
      handleHashChange();
    }
    tryRestoreKanjiDetailAfterResume();
  });
})();