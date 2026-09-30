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
      checkboxGrammarN3: false,
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
      iphoneTaiTho: false,
      darkMode: false,
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
      readAfterAnswer: true,
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
      level: "all",
      fromStt: 1,
      toStt: null,
      modes: [4],
      isStar: false,
      /** Sau mỗi câu: hiện chi tiết Kanji, bấm Tiếp tục để sang câu tiếp (mặc định tắt) */
      showAnswerKanjiDetailAfterEach: false
    },
    mappingTestState: {
      isActive: false,
      isFinished: false,
      source: "vocab", // "vocab" | "kanji"
      pool: [],
      usedCount: 0,
      pairsPerRound: 9,
      timeLimit: 60,
      timeRemaining: 60,
      lives: 3,
      wrongCount: 0,
      correctCount: 0,
      roundTiles: [],
      selectedTileId: null,
      locked: false,
      endReason: "", // "timeout" | "lives" | "quit"
      // vocab config
      questionField: "hiragana",
      answerField: "meaning",
      selectedCategory: "all",
      lessonMin: 1,
      lessonMax: 50,
      isStar: false,
      isNotMastered: false,
      // kanji config
      level: "all",
      fromStt: 1,
      toStt: null,
      modes: [4]
    },
    assembleTestState: {
      isActive: false,
      isFinished: false,
      questions: [],
      currentIndex: 0,
      correctCount: 0,
      answers: [],
      selectedCategory: "all",
      lessonMin: 1,
      lessonMax: 50,
      questionCount: 20,
      isStar: false,
      isNotMastered: false,
      /** Hiện Kanji của từ (nếu Kanji chỉ là hiragana/katakana lặp lại thì luôn ẩn vì đó là data sai) */
      showKanji: true,
      readAfterAnswer: true,
      // Trạng thái ghép từ của câu hỏi hiện tại
      builtIndex: -1,
      tileBag: [],
      selectedIds: [],
      /** null = không đang gợi ý; nếu có giá trị N thì các ô từ vị trí N trở đi đang là tile gợi ý (⚡) */
      revealedFrom: null
    },
    kanjiViewMode: "grid",
    note: {
      currentDocKey:
        window.DOC_CONFIG && window.DOC_CONFIG.defaultKey
          ? window.DOC_CONFIG.defaultKey
          : null,
      fontSize: 14,
      manualContent: null,
      originalHtml: null,
      searchTerm: "",
      matches: [],
      matchIndex: -1,
      searchFocused: false
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
      vocabViewMode: "list",
      vocabFlashcardIndex: 0,
      vocabFlashcardVocabIndex: null,
      vocabFlashcardFlipped: false,
      vocabFlashcardRestored: false,
      /** "2" = thẻ 2 mặt (bấm để lật xem nghĩa), "1" = thẻ 1 mặt (hiện đủ cả 2 phía, không cần lật) */
      vocabFlashcardMode: "2",
      /** Bật thì cứ N giây tự chuyển sang thẻ tiếp theo (quay vòng về đầu khi hết danh sách) */
      vocabFlashcardAutoNext: false,
      /** Số giây giữa mỗi lần auto-next (xem VOCAB_AUTO_NEXT_DEFAULT_SECONDS) */
      vocabFlashcardAutoNextSeconds: 60,
      /** Chế độ trình chiếu toàn màn hình — không khôi phục lại sau khi tải lại trang */
      vocabFlashcardFullscreen: false,
      /** Hệ số cỡ chữ trên thẻ, chỉnh bằng nút A− / A+ (xem VOCAB_FLASHCARD_FONT_SCALE_*) */
      vocabFlashcardFontScale: 1,
      kanjiVocabFavOnly: false,
      /** Khi mở chi tiết Kanji từ tab ⭐(kanji), đóng modal thì quay lại tab này */
      kanjiDetailReturnTab: null
    },
    vocabFavorites: {},
    vocabMastered: {},
    /** Override cục bộ (localStorage) so với nền tảng data/dup.js: true = ẩn thêm, false = bỏ ẩn dù dup.js có ẩn, không có key = theo dup.js */
    vocabHidden: {},
    /** Nền tảng đọc từ data/dup.js lúc khởi động, không lưu localStorage */
    vocabHiddenBaseline: {},
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
    navigateToTab("note");
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
    var savedVH = localStorage.getItem("jp_vocab_hidden_words");
    if (savedVH) state.vocabHidden = JSON.parse(savedVH);
    var savedKF = localStorage.getItem("jp_kanji_favorites");
    if (savedKF) state.kanjiFavorites = JSON.parse(savedKF);
    var savedKVF = localStorage.getItem("jp_kanji_vocab_favorites");
    if (savedKVF) state.kanjiVocabFavorites = JSON.parse(savedKVF);
    var savedDS = localStorage.getItem("jp_display_settings");
    if (savedDS) Object.assign(state.displaySettings, JSON.parse(savedDS));
    var savedVVS = localStorage.getItem("jp_vocab_view_state");
    if (savedVVS) {
      var parsedVVS = JSON.parse(savedVVS);
      if (parsedVVS && (parsedVVS.mode === "list" || parsedVVS.mode === "flashcard")) {
        state.ui.vocabViewMode = parsedVVS.mode;
      }
      state.ui.vocabFlashcardVocabIndex = typeof parsedVVS.vocabIndex === "number" ? parsedVVS.vocabIndex : null;
      state.ui.vocabFlashcardFlipped = !!parsedVVS.flipped;
      if (parsedVVS.cardMode === "1" || parsedVVS.cardMode === "2") {
        state.ui.vocabFlashcardMode = parsedVVS.cardMode;
      }
      state.ui.vocabFlashcardAutoNext = !!parsedVVS.autoNext;
      if (typeof parsedVVS.autoNextSeconds === "number" && parsedVVS.autoNextSeconds >= 3) {
        state.ui.vocabFlashcardAutoNextSeconds = parsedVVS.autoNextSeconds;
      }
      if (typeof parsedVVS.fontScale === "number" && isFinite(parsedVVS.fontScale)) {
        state.ui.vocabFlashcardFontScale = parsedVVS.fontScale;
      }
    }
  } catch (e) {
    // ignore parse errors
  }

  function saveVocabFavorites() {
    try { localStorage.setItem("jp_vocab_favorites", JSON.stringify(state.vocabFavorites)); } catch (e) { }
  }
  function saveVocabMastered() {
    try { localStorage.setItem("jp_vocab_mastered", JSON.stringify(state.vocabMastered)); } catch (e) { }
  }
  function saveVocabHidden() {
    try { localStorage.setItem("jp_vocab_hidden_words", JSON.stringify(state.vocabHidden)); } catch (e) { }
  }
  function saveDisplaySettings() {
    try { localStorage.setItem("jp_display_settings", JSON.stringify(state.displaySettings)); } catch (e) { }
  }
  function saveVocabViewState(vocabIndex) {
    try {
      localStorage.setItem("jp_vocab_view_state", JSON.stringify({
        mode: state.ui.vocabViewMode,
        vocabIndex: typeof vocabIndex === "number" ? vocabIndex : null,
        flipped: !!state.ui.vocabFlashcardFlipped,
        cardMode: state.ui.vocabFlashcardMode,
        autoNext: !!state.ui.vocabFlashcardAutoNext,
        autoNextSeconds: state.ui.vocabFlashcardAutoNextSeconds,
        fontScale: state.ui.vocabFlashcardFontScale
      }));
    } catch (e) { }
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

  function getVocabHiragana(item) {
    if (!item) return "";
    if (Object.prototype.hasOwnProperty.call(item, "hiragana")) return String(item.hiragana || "").trim();
    if (Object.prototype.hasOwnProperty.call(item, "Hiragana")) return String(item.Hiragana || "").trim();
    return "";
  }
  function getVocabKanji(item) {
    if (!item) return "";
    if (Object.prototype.hasOwnProperty.call(item, "kanji")) return String(item.kanji || "").trim();
    if (Object.prototype.hasOwnProperty.call(item, "Kanji")) return String(item.Kanji || "").trim();
    return "";
  }
  function getVocabMeaning(item) {
    if (!item) return "";
    if (Object.prototype.hasOwnProperty.call(item, "meaning")) return String(item.meaning || "").trim();
    if (Object.prototype.hasOwnProperty.call(item, "Meaning")) return String(item.Meaning || "").trim();
    return "";
  }
  function getVocabLessonValue(item) {
    if (!item) return "";
    return item.lesson != null ? item.lesson : item.Lesson;
  }
  /** Khoá định danh 1 từ vựng theo nội dung (không theo index) để đánh dấu ẩn ổn định qua các lần sửa data. */
  function getVocabDupKey(item) {
    return getVocabHiragana(item) + "␟" + getVocabKanji(item) + "␟" + getVocabMeaning(item);
  }
  function parseVocabDupKey(key) {
    var parts = String(key || "").split("␟");
    return { Hiragana: parts[0] || "", Kanji: parts[1] || "", Meaning: parts[2] || "" };
  }
  /** true = ẩn, false = luôn hiện. Ưu tiên override cục bộ (localStorage), nếu không có thì lấy theo nền tảng data/dup.js. */
  function isKeyHidden(key) {
    if (Object.prototype.hasOwnProperty.call(state.vocabHidden, key)) {
      return !!state.vocabHidden[key];
    }
    return !!state.vocabHiddenBaseline[key];
  }

  // ========================
  // MASTERY ENGINE (điểm thành thạo từ vựng/kanji + cold start)
  // ========================
  // 2 store độc lập, cùng cấu trúc:
  //   state.vocabMastery  (localStorage jp_vocab_mastery)  key = getVocabDupKey(item)
  //   state.kanjiMastery  (localStorage jp_kanji_mastery)  key = getKanjiDupKey(raw) | getKanjiVocabDupKey(raw, ve)
  // Đều dùng key theo NỘI DUNG (không dùng index) để bền vững qua các lần sửa/sắp xếp lại data.
  var MASTERY_REVIEW_THRESHOLD = 60;   // < 60: chưa thuộc, cần học lại
  var MASTERY_MASTERED_THRESHOLD = 80; // >= 80: đã thuộc
  var MASTERY_COLD_START_SCORE = 50;   // điểm trung gian mặc định cho mục cũ chưa có dữ liệu
  var MASTERY_MIN = 0;
  var MASTERY_MAX = 100;
  // Lặp lại ngắt quãng (📅 Ôn hôm nay): trả lời đúng khi đã đến hạn -> giãn sang mốc tiếp theo (ngày),
  // trả lời sai (hoặc ghép từ phải làm lại / xem gợi ý) -> quay về mốc đầu, ôn lại từ ngày mai.
  var SRS_INTERVALS = [1, 3, 7, 14, 30, 60];

  function clampMasteryScore(v) {
    return Math.max(MASTERY_MIN, Math.min(MASTERY_MAX, v));
  }

  /** yyyy-mm-dd theo giờ máy của ngày `base` (mặc định hôm nay) cộng thêm `days` ngày */
  function masteryDateStr(days, base) {
    var d = base ? new Date(base) : new Date();
    d.setDate(d.getDate() + (days || 0));
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }

  function masteryTodayStr() {
    return masteryDateStr(0);
  }

  function masteryTomorrowStr() {
    return masteryDateStr(1);
  }

  function nextSrsInterval(interval) {
    for (var i = 0; i < SRS_INTERVALS.length; i += 1) {
      if (SRS_INTERVALS[i] > interval) return SRS_INTERVALS[i];
    }
    return SRS_INTERVALS[SRS_INTERVALS.length - 1];
  }

  /**
   * Lịch ôn { interval, due } của 1 bản ghi mastery, null nếu chưa test lần nào.
   * Bản ghi cũ (trước khi có due_at) được suy ra, không ghi đè dữ liệu:
   *   - còn cờ needs_review_tomorrow -> đến hạn từ review_after
   *   - điểm < 60 -> đến hạn ngay; 60–79 -> 3 ngày; >= 80 -> 7 ngày kể từ lần test cuối
   */
  function getSrsSchedule(rec) {
    if (!rec || !rec.is_calibrated) return null;
    if (rec.due_at) {
      return { interval: rec.srs_interval || SRS_INTERVALS[0], due: rec.due_at };
    }
    if (rec.needs_review_tomorrow) {
      return { interval: SRS_INTERVALS[0], due: rec.review_after || masteryTodayStr() };
    }
    var interval = rec.score < MASTERY_REVIEW_THRESHOLD ? 0 : (rec.score < MASTERY_MASTERED_THRESHOLD ? 3 : 7);
    return { interval: interval, due: masteryDateStr(interval, rec.last_test_at || Date.now()) };
  }

  /** Cập nhật lịch ôn sau 1 câu test. `schedule` là lịch TRƯỚC khi làm câu này. */
  function applySrsResult(rec, schedule, isGood) {
    if (!isGood) {
      rec.srs_interval = SRS_INTERVALS[0];
      rec.due_at = masteryTomorrowStr();
    } else if (!schedule || schedule.due <= masteryTodayStr()) {
      rec.srs_interval = nextSrsInterval(schedule ? schedule.interval : 0);
      rec.due_at = masteryDateStr(rec.srs_interval);
    } else if (!rec.due_at) {
      // Bản ghi cũ trả lời đúng khi chưa đến hạn: chốt lịch suy ra thành dữ liệu thật
      rec.srs_interval = schedule.interval;
      rec.due_at = schedule.due;
    }
    // Đúng khi chưa đến hạn (ôn sớm / làm nhiều lần trong ngày) thì giữ nguyên lịch
    delete rec.needs_review_tomorrow;
    delete rec.review_after;
  }

  // Load state.vocabMastery / state.kanjiMastery từ localStorage
  try {
    var savedMastery = localStorage.getItem("jp_vocab_mastery");
    state.vocabMastery = savedMastery ? JSON.parse(savedMastery) : {};
  } catch (e) {
    state.vocabMastery = {};
  }
  try {
    var savedKanjiMastery = localStorage.getItem("jp_kanji_mastery");
    state.kanjiMastery = savedKanjiMastery ? JSON.parse(savedKanjiMastery) : {};
  } catch (e) {
    state.kanjiMastery = {};
  }

  function saveVocabMastery() {
    try { localStorage.setItem("jp_vocab_mastery", JSON.stringify(state.vocabMastery)); } catch (e) { }
  }
  function saveKanjiMastery() {
    try { localStorage.setItem("jp_kanji_mastery", JSON.stringify(state.kanjiMastery)); } catch (e) { }
  }

  /** Lấy (và khởi tạo nếu chưa có) bản ghi mastery cho 1 key trong 1 store — mục cũ chưa test lần nào sẽ là cold-start: score=50, is_calibrated=false. */
  function getMasteryRecordFrom(store, key) {
    if (!store || !key) return null;
    var rec = store[key];
    if (!rec) {
      rec = {
        score: MASTERY_COLD_START_SCORE,
        is_calibrated: false,
        srs_interval: 0, // mốc lặp lại ngắt quãng hiện tại (ngày), xem SRS_INTERVALS
        due_at: null, // yyyy-mm-dd: từ ngày này mục đến hạn ôn (📅 Ôn hôm nay)
        last_test_at: null,
        last_test_type: null,
        history_count: 0
      };
      store[key] = rec;
    }
    return rec;
  }

  /**
   * Cập nhật điểm mastery của 1 mục (từ vựng hoặc kanji/từ-vựng-kanji) sau khi làm 1 câu test.
   * testType: "choice" (trắc nghiệm) | "mapping" (mapping) | "assemble" (ghép từ, chỉ áp dụng cho vocab)
   * payload:
   *   - choice / mapping: { isCorrect: boolean }
   *   - assemble: { attempts: number (số lần sai trước khi đúng), revealedAnswer: boolean (đã bấm xem gợi ý/đáp án) }
   */
  function applyMasteryTestResultTo(store, saveFn, key, testType, payload) {
    var rec = getMasteryRecordFrom(store, key);
    if (!rec) return null;
    payload = payload || {};

    var delta = 0;
    var coldStartSignalGood = null; // dùng riêng cho lần test hiệu chỉnh đầu tiên (cold start)
    var srsGood = false; // true = nhớ tốt -> giãn lịch ôn, false = ôn lại từ ngày mai
    var scheduleBefore = getSrsSchedule(rec);

    if (testType === "choice") {
      delta = payload.isCorrect ? 5 : -10;
      coldStartSignalGood = !!payload.isCorrect;
      srsGood = !!payload.isCorrect;
    } else if (testType === "mapping") {
      delta = payload.isCorrect ? 10 : -15;
      coldStartSignalGood = !!payload.isCorrect;
      srsGood = !!payload.isCorrect;
    } else if (testType === "assemble") {
      var attempts = payload.attempts || 0;
      if (payload.revealedAnswer) {
        delta = -5;
        coldStartSignalGood = false;
      } else if (attempts === 0) {
        delta = 15;
        coldStartSignalGood = true;
      } else if (attempts <= 2) {
        delta = 5;
        coldStartSignalGood = true;
      } else {
        delta = 0;
        coldStartSignalGood = false;
      }
      // Phải sửa sai (hoặc phải xem đáp án) -> bắt buộc ôn lại vào hôm sau, bất kể tổng điểm
      srsGood = attempts === 0 && !payload.revealedAnswer;
    } else {
      return rec;
    }

    if (!rec.is_calibrated) {
      // Cold start: lần test đầu tiên của mục cũ quyết định thẳng trạng thái, không cộng dồn mù mờ từ nền 50.
      rec.score = coldStartSignalGood
        ? clampMasteryScore(Math.max(70, MASTERY_COLD_START_SCORE + delta))
        : clampMasteryScore(Math.min(59, MASTERY_COLD_START_SCORE + delta));
      rec.is_calibrated = true;
    } else {
      rec.score = clampMasteryScore(rec.score + delta);
    }
    applySrsResult(rec, scheduleBefore, srsGood);

    rec.last_test_at = Date.now();
    rec.last_test_type = testType;
    rec.history_count = (rec.history_count || 0) + 1;
    saveFn();
    return rec;
  }

  function applyMasteryTestResult(vocabKey, testType, payload) {
    return applyMasteryTestResultTo(state.vocabMastery, saveVocabMastery, vocabKey, testType, payload);
  }
  function applyKanjiMasteryTestResult(kanjiKey, testType, payload) {
    return applyMasteryTestResultTo(state.kanjiMastery, saveKanjiMastery, kanjiKey, testType, payload);
  }

  /** true nếu mục đã đến hạn ôn theo lịch lặp lại ngắt quãng (tính đến hết ngày hôm nay + dayOffset). */
  function isMasteryDueToday(rec, dayOffset) {
    var schedule = getSrsSchedule(rec);
    return !!schedule && schedule.due <= masteryDateStr(dayOffset || 0);
  }

  /** true nếu mục này "chưa thuộc" (điểm < 60), dùng cho "Ôn lại chưa thuộc". Mục đến hạn theo lịch nằm ở "Ôn hôm nay". */
  function isDueForReviewIn(store, key) {
    var rec = store[key];
    if (!rec) return false; // chưa có dữ liệu -> để hàng đợi cold start ưu tiên đưa vào test hiệu chỉnh, chưa ép vào "chưa thuộc"
    return rec.score < MASTERY_REVIEW_THRESHOLD;
  }

  function isVocabDueForReview(item) {
    return isDueForReviewIn(state.vocabMastery, getVocabDupKey(item));
  }
  function isVocabMasteredByScore(item) {
    var rec = state.vocabMastery[getVocabDupKey(item)];
    return !!rec && rec.score >= MASTERY_MASTERED_THRESHOLD;
  }
  /** Toàn bộ danh sách từ "chưa thuộc" cần học lại, dùng để lọc khi tạo bộ đề test. */
  function getVocabReviewList() {
    return vocabData.filter(function (raw) { return isVocabDueForReview(raw); });
  }
  /** Từ vựng (không ẩn, có hiragana) đã đến hạn ôn theo lịch tính đến hết ngày hôm nay + dayOffset. */
  function getVocabDailyDueList(dayOffset) {
    return vocabData.filter(function (raw) {
      if (!raw || isVocabHidden(raw) || !getVocabHiragana(raw)) return false;
      return isMasteryDueToday(state.vocabMastery[getVocabDupKey(raw)], dayOffset);
    });
  }

  /**
   * Sắp xếp lại 1 danh sách bất kỳ theo độ ưu tiên mastery (không đổi kích thước danh sách):
   * 1) đã đến hạn ôn theo lịch (isMasteryDueToday) -> lên đầu
   * 2) chưa is_calibrated (cold start) -> ưu tiên tiếp theo
   * 3) score thấp hơn -> ưu tiên hơn
   * keyFn(item) phải trả về đúng key mastery của mục tương ứng trong `store`.
   * Truyền list đã shuffle sẵn để các phần tử cùng hạng ưu tiên vẫn ra ngẫu nhiên, tránh lặp thứ tự mỗi lần test.
   */
  function sortByMasteryPriority(list, keyFn, store) {
    store = store || state.vocabMastery;
    var scored = list.map(function (item) {
      var key = keyFn(item);
      var rec = key ? store[key] : null;
      return {
        item: item,
        calibrated: rec ? !!rec.is_calibrated : false,
        score: rec ? rec.score : MASTERY_COLD_START_SCORE,
        due: isMasteryDueToday(rec)
      };
    });
    scored.sort(function (a, b) {
      if (a.due !== b.due) return a.due ? -1 : 1;
      if (a.calibrated !== b.calibrated) return a.calibrated ? 1 : -1;
      return a.score - b.score;
    });
    return scored.map(function (s) { return s.item; });
  }

  /** Lấy ra tối đa `count` từ vựng ưu tiên nhất (đến hạn ôn > cold-start > điểm thấp) từ 1 pool từ vựng thô. */
  function pickVocabTestQueue(pool, count) {
    var prioritized = sortByMasteryPriority(shuffleArray(pool), getVocabDupKey, state.vocabMastery);
    if (typeof count === "number") {
      return prioritized.slice(0, count);
    }
    return prioritized;
  }

  // ----- Kanji mastery: key + review list + priority queue -----
  /** Key ổn định cho 1 chữ Kanji (dùng cho mode 1-4: On/Kun/Hán Việt). */
  function getKanjiDupKey(raw) {
    return "k␟" + String(raw && raw.kanji || "").trim();
  }
  /** Key ổn định cho 1 từ vựng thuộc về 1 Kanji (dùng cho mode 5-9: word/reading/meaning của kanji.vocabulary). */
  function getKanjiVocabDupKey(raw, ve) {
    return "kv␟" + String(raw && raw.kanji || "").trim() + "␟" +
      String(ve && ve.word || "").trim() + "␟" +
      String(ve && ve.reading || "").trim() + "␟" +
      String(ve && ve.meaning || "").trim();
  }
  /** Suy ra key mastery từ 1 candidate { kanjiIdx, mode, vocabEntry } dùng chung trong buildKanjiTestQuestions/mapping. */
  function getKanjiCandidateMasteryKey(candidate) {
    if (!candidate) return "";
    var raw = kanjiData[candidate.kanjiIdx];
    if (!raw) return "";
    if (candidate.mode >= 5 && candidate.mode <= 9 && candidate.vocabEntry) {
      return getKanjiVocabDupKey(raw, candidate.vocabEntry);
    }
    return getKanjiDupKey(raw);
  }

  function isKanjiDueForReview(key) {
    return isDueForReviewIn(state.kanjiMastery, key);
  }

  /**
   * Danh sách "candidate chưa thuộc" cần ôn lại cho Kanji, ở dạng { kanjiIdx, mode, vocabEntry } giống
   * candidate của buildKanjiTestQuestions — chỉ xét 2 dạng theo yêu cầu ôn tập: Kanji->Hán Việt (mode 4)
   * và Từ vựng(kanji)->Nghĩa (mode 5).
   */
  function getKanjiReviewCandidates() {
    var candidates = [];
    kanjiData.forEach(function (raw, i) {
      if (!raw) return;
      if (kanjiModeAvailable(raw, 4) && isKanjiDueForReview(getKanjiDupKey(raw))) {
        candidates.push({ kanjiIdx: i, mode: 4, vocabEntry: null });
      }
      if (kanjiModeAvailable(raw, 5)) {
        parseKanjiVocab(raw.vocabulary).forEach(function (ve) {
          if (isKanjiDueForReview(getKanjiVocabDupKey(raw, ve))) {
            candidates.push({ kanjiIdx: i, mode: 5, vocabEntry: ve });
          }
        });
      }
    });
    return candidates;
  }

  /** Lấy ra tối đa `count` candidate Kanji ưu tiên nhất từ 1 pool candidate thô (dùng chung cho test Kanji và Mapping Kanji). */
  function pickKanjiTestQueue(pool, count) {
    var prioritized = sortByMasteryPriority(shuffleArray(pool), getKanjiCandidateMasteryKey, state.kanjiMastery);
    if (typeof count === "number") {
      return prioritized.slice(0, count);
    }
    return prioritized;
  }
  /** Với các bản trùng nhau 100% (Hiragana+Kanji+Meaning giống hệt), lưu vị trí bản CUỐI CÙNG của mỗi khoá — mọi bản đứng trước sẽ tự động bị ẩn, không cần chọn thủ công. */
  var autoDedupLastIndexByKey = {};
  function buildAutoDedupIndex() {
    autoDedupLastIndexByKey = {};
    vocabData.forEach(function (item, idx) {
      autoDedupLastIndexByKey[getVocabDupKey(item)] = idx;
    });
  }
  function isAutoDedupHidden(item) {
    var key = getVocabDupKey(item);
    var lastIdx = autoDedupLastIndexByKey[key];
    if (lastIdx == null) {
      return false;
    }
    return vocabData.indexOf(item) !== lastIdx;
  }
  function isVocabHidden(item) {
    if (isAutoDedupHidden(item)) {
      return true;
    }
    return isKeyHidden(getVocabDupKey(item));
  }
  /** Copy text vào clipboard, có fallback cho môi trường file:// / không có Clipboard API. */
  function copyTextToClipboard(text, callback) {
    function fallbackCopy() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        callback(!!ok);
      } catch (e) {
        callback(false);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        callback(true);
      }).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  function loadVocabHiddenBaseline() {
    state.vocabHiddenBaseline = {};
    if (window._vocabDupHidden && window._vocabDupHidden.length) {
      window._vocabDupHidden.forEach(function (entry) {
        var key = getVocabDupKey(entry);
        if (key !== "␟␟") {
          state.vocabHiddenBaseline[key] = true;
        }
      });
    }
  }
  /**
   * Gom nhóm các từ có cùng Hiragana (bị trùng) để hiển thị ở tab "Từ trùng".
   * Các bản trùng nhau 100% đã được tự động ẩn (giữ bản cuối) nên KHÔNG cần liệt kê ra đây —
   * chỉ hiển thị nhóm nào sau khi gộp các bản giống hệt vẫn còn từ 2 nội dung khác nhau trở lên
   * (cần người dùng tự quyết định giữ từ nào).
   */
  function getVocabDupGroups() {
    var map = {};
    var order = [];
    vocabData.forEach(function (item) {
      var hira = getVocabHiragana(item);
      if (!hira) return;
      if (!map[hira]) {
        map[hira] = [];
        order.push(hira);
      }
      map[hira].push(item);
    });
    var groups = [];
    order.forEach(function (hira) {
      var items = map[hira];
      if (items.length <= 1) return;
      var distinctKeys = {};
      items.forEach(function (it) { distinctKeys[getVocabDupKey(it)] = true; });
      if (Object.keys(distinctKeys).length > 1) {
        groups.push({ hiragana: hira, items: items });
      }
    });
    return groups;
  }

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

  function syncRadicalMatrixActiveState() {
    var matrixEl = document.getElementById("kanji-radical-matrix");
    if (!matrixEl) return;
    var selected = Array.isArray(state.filter.kanjiRadical) ? state.filter.kanjiRadical : [];
    Array.prototype.forEach.call(matrixEl.querySelectorAll("[data-radical]"), function (tile) {
      var isActive = selected.indexOf(tile.getAttribute("data-radical")) !== -1;
      tile.classList.toggle("radical-tile--active", isActive);
      tile.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function setKanjiLevelFilterToAll() {
    state.filter.kanjiLevel = "all";
    var levelChipsContainer = document.getElementById("kanji-level-chips");
    if (levelChipsContainer) {
      Array.prototype.forEach.call(
        levelChipsContainer.querySelectorAll("[data-level]"),
        function (b) { b.classList.remove("chip--active"); }
      );
      var allChip = levelChipsContainer.querySelector('[data-level="all"]');
      if (allChip) allChip.classList.add("chip--active");
    }
  }

  function selectKanjiRadicalsByVietnamese(vietnameseLabel) {
    var matrixEl = document.getElementById("kanji-radical-matrix");
    if (!matrixEl) {
      return;
    }
    var targetLabel = normalizeText(vietnameseLabel || "");
    if (!targetLabel) {
      return;
    }

    var selectedValues = [];
    Array.prototype.forEach.call(matrixEl.querySelectorAll("[data-radical]"), function (tile) {
      var radicalValue = tile.getAttribute("data-radical");
      var optLabel = getRadicalVietnameseLabel(radicalValue);
      if (optLabel && optLabel === targetLabel) {
        selectedValues.push(radicalValue);
      }
    });

    state.filter.kanjiRadical = selectedValues;
    syncRadicalMatrixActiveState();
    // Bộ thủ có thể thuộc kanji ở bất kỳ cấp độ nào — bỏ giới hạn theo N3/N4-5.
    setKanjiLevelFilterToAll();
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

  /** true nếu chuỗi có ít nhất 1 ký tự Hán (Kanji thật sự, không phải hiragana/katakana) */
  function hasRealKanjiChar(str) {
    return /[㐀-鿿]/.test(String(str || ""));
  }

  /** Kanji của từ vựng để hiển thị; rỗng nếu data sai (chỉ có hiragana/katakana, không có chữ Hán) */
  function getVocabRealKanji(raw) {
    var kanji = String((raw && (raw.kanji != null ? raw.kanji : raw.Kanji)) || "").trim();
    return hasRealKanjiChar(kanji) ? kanji : "";
  }

  /** Tách một từ hiragana thành các "tile" theo âm tiết (mora): gộp ゃゅょ nhỏ vào ký tự đứng trước */
  function splitHiraganaTiles(str) {
    var YOON = { "ゃ": 1, "ゅ": 1, "ょ": 1, "ャ": 1, "ュ": 1, "ョ": 1 };
    var chars = Array.from(String(str || ""));
    var tiles = [];
    chars.forEach(function (c) {
      if (YOON[c] && tiles.length > 0) {
        tiles[tiles.length - 1] += c;
      } else {
        tiles.push(c);
      }
    });
    return tiles;
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

  // Category giờ lưu id số theo master dùng chung ở data/master.js (window.VOCAB_CATEGORY_MASTER).
  function getCategoryLabel(rawCategory) {
    if (!rawCategory && rawCategory !== 0) {
      return "";
    }
    if (window.getVocabCategoryLabel) {
      var label = window.getVocabCategoryLabel(rawCategory);
      if (label) {
        return label;
      }
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

  /** Điều hướng tab dùng query string: ?tab=kanji&k=日 hoặc ?tab=stars&k=日 (deep link chi tiết Kanji). */
  function getLocationParams() {
    return new URLSearchParams(window.location.search);
  }

  function buildLocationUrl(setParams, deleteKeys) {
    var params = getLocationParams();
    if (deleteKeys) {
      deleteKeys.forEach(function (k) {
        params.delete(k);
      });
    }
    if (setParams) {
      Object.keys(setParams).forEach(function (k) {
        var v = setParams[k];
        if (v === null || v === undefined) {
          params.delete(k);
        } else {
          params.set(k, v);
        }
      });
    }
    var qs = params.toString();
    return window.location.pathname + (qs ? "?" + qs : "") + window.location.hash;
  }

  function pushLocationQuery(setParams, deleteKeys) {
    var url = buildLocationUrl(setParams, deleteKeys);
    window.history.pushState(null, "", url);
  }

  function replaceLocationQuery(setParams, deleteKeys) {
    var url = buildLocationUrl(setParams, deleteKeys);
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", url);
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

  function parseKanjiDetailFromQuery() {
    var params = getLocationParams();
    var tab = params.get("tab");
    var slug = params.get("k");
    if ((tab === "kanji" || tab === "stars") && slug) {
      return { tab: tab, slug: slug };
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

  function queryAllowsKanjiResume(savedTab) {
    var tab = getLocationParams().get("tab");
    return tab === savedTab;
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

    var dh = parseKanjiDetailFromQuery();
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
    if (!queryAllowsKanjiResume(hint.t)) {
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
    replaceLocationQuery({ tab: hint.t, k: hint.k });
    renderKanjiDetail();
  }

  function syncKanjiDetailQuery() {
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
    var params = getLocationParams();
    if (params.get("tab") !== state.currentTab || params.get("k") !== raw.kanji) {
      replaceLocationQuery({ tab: state.currentTab, k: raw.kanji });
    }
    saveKanjiDetailResumeHint();
  }

  function clearKanjiDetailSlugFromLocation() {
    var params = getLocationParams();
    if (!params.has("k")) {
      return;
    }
    var tab = params.get("tab");
    if (tab === "kanji" || tab === "stars") {
      replaceLocationQuery({ tab: tab }, ["k"]);
    }
  }

  const detailModalState = {
    el: null,
    bodyEl: null,
    titleEl: null,
    navEl: null,
    closeBtn: null
  };

  var mappingTestTimerId = null;

  function clearMappingTestTimer() {
    if (mappingTestTimerId) {
      clearInterval(mappingTestTimerId);
      mappingTestTimerId = null;
    }
  }

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
    detailModalState.el.classList.toggle("detail-modal--taitho", !!state.displaySettings.iphoneTaiTho);
    detailModalState.el.setAttribute("aria-hidden", "false");
    state.ui.detailModal.isOpen = true;
  }

  function closeDetailModal() {
    if (!detailModalState.el) {
      return;
    }
    detailModalState.el.classList.remove("detail-modal--open");
    detailModalState.el.classList.remove("detail-modal--practice");
    detailModalState.el.classList.remove("detail-modal--mapping");
    detailModalState.el.classList.remove("detail-modal--taitho");
    detailModalState.el.setAttribute("aria-hidden", "true");
    state.ui.detailModal.isOpen = false;
    clearMappingTestTimer();
    state.mappingTestState.isActive = false;
    clearKanjiDetailResumeHint();
    var ret = state.ui.kanjiDetailReturnTab;
    state.ui.kanjiDetailReturnTab = null;
    if (ret === "stars") {
      state.currentTab = "stars";
      var params = getLocationParams();
      if (params.get("tab") !== "stars" || params.has("k")) {
        replaceLocationQuery({ tab: "stars" }, ["k"]);
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
        // Chế độ Tắt đèn: canvas nền tối → mực sáng
        var dark = !!state.displaySettings.darkMode;
        if (penType === "marker") {
          return { color: dark ? "rgba(231, 226, 220, 0.75)" : "rgba(30, 41, 59, 0.75)", cap: "square", join: "round" };
        }
        if (penType === "pencil") {
          return { color: dark ? "rgba(214, 208, 200, 0.6)" : "rgba(55, 65, 81, 0.6)", cap: "round", join: "round" };
        }
        if (penType === "calligraphy") {
          return { color: dark ? "#f3efe9" : "#111827", cap: "butt", join: "miter" };
        }
        return { color: dark ? "#e7e2dc" : "#1f2937", cap: "round", join: "round" };
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
      { id: "section-daily", tab: "daily" },
      { id: "section-note", tab: "note" },
      { id: "section-dup", tab: "dup" },
      { id: "section-vocab-edit", tab: "vocab-edit" }
    ];

    sections.forEach(function (entry) {
      const sec = document.getElementById(entry.id);
      if (state.currentTab === entry.tab) {
        sec.classList.add("section--active");
      } else {
        sec.classList.remove("section--active");
      }
    });
    syncFlashcardWakeLock();
    syncFlashcardScrollLock();
  }

  // ----- Vocab -----
  function applyVocabFilters(opts) {
    var ignoreCategory = !!(opts && opts.ignoreCategory);
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

      if (isVocabHidden(item)) {
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
      }

      if (!ignoreCategory && state.filter.vocabCategory !== "all" &&
        String(categoryValue) !== String(state.filter.vocabCategory)) {
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
      : state.filter.vocabCategory === ""
        ? "Chưa có danh mục"
        : getCategoryLabel(state.filter.vocabCategory) + (categoriesSet.size === 1 ? "" : " (filtered)");

    var masteredLabel = "Tất cả (đã/chưa thuộc)";
    if (state.filter.vocabMastered === "mastered") {
      masteredLabel = "Chỉ đã thuộc";
    } else if (state.filter.vocabMastered === "not") {
      masteredLabel = "Chỉ chưa thuộc";
    }

    el.textContent = lessonLabel + " · " + categoryLabel + " · " + masteredLabel;
  }

  function updateVocabCategoryOptions() {
    const categorySelect = document.getElementById("vocab-category-filter");
    if (!categorySelect) return;

    // Pool để suy ra danh mục còn phù hợp: áp dụng đúng các bộ lọc đang có (bài Từ/Đến,
    // search, chỉ ★, chưa thuộc...) NHƯNG bỏ qua category đang chọn, để tránh tự khoá
    // người dùng vào 1 category duy nhất.
    const pool = applyVocabFilters({ ignoreCategory: true });

    const poolCategoryValues = pool.map(function (v) { return v.category != null ? v.category : v.Category; });
    const categories = getUniqueSorted(poolCategoryValues.filter(function (c) { return c; }));
    // "" (rỗng) nghĩa là từ chưa được thiết lập danh mục — vẫn cho lọc riêng được, tách khỏi "all".
    const hasEmptyCategory = poolCategoryValues.some(function (c) { return c === "" || c == null; });

    // state.filter.vocabCategory có thể là "" (lọc từ chưa có danh mục) -> không được dùng "||"
    // ở đây vì "" bị coi là falsy, sẽ sai lệch về "all".
    let currentValue = state.filter.vocabCategory != null ? state.filter.vocabCategory : "all";
    categorySelect.innerHTML = "";
    const allOpt = createElement("option", "", "Tất cả");
    allOpt.value = "all";
    categorySelect.appendChild(allOpt);
    categories.forEach(function (cat) {
      const opt = createElement("option", "", getCategoryLabel(cat));
      opt.value = String(cat);
      categorySelect.appendChild(opt);
    });
    if (hasEmptyCategory) {
      const emptyOpt = createElement("option", "", "(Chưa có danh mục)");
      emptyOpt.value = "";
      categorySelect.appendChild(emptyOpt);
    }

    // category trong data là số, còn currentValue đọc từ <select>.value luôn là chuỗi
    // -> phải so sánh dạng chuỗi, nếu không sẽ luôn coi như "không tìm thấy" và bị reset về "all".
    const categoryValues = categories.map(String);
    if (hasEmptyCategory) {
      categoryValues.push("");
    }
    if (currentValue !== "all" && categoryValues.indexOf(String(currentValue)) === -1) {
      state.filter.vocabCategory = "all";
      currentValue = "all";
    }
    categorySelect.value = String(currentValue);
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
    updateVocabCategoryOptions();

    var fixedActions = document.getElementById("vocab-fixed-actions");
    if (fixedActions) {
      var hideFixedActions = state.ui.vocabViewMode === "flashcard" && !!state.ui.vocabFlashcardFullscreen;
      fixedActions.style.display = hideFixedActions ? "none" : "";
    }

    listContainer.innerHTML = "";

    if (state.ui.vocabViewMode === "flashcard") {
      renderVocabFlashcard(filtered, listContainer);
      return;
    }

    if (filtered.length === 0) {
      //window.location.href = `index.html?tab=kanji&kanji=${encodeURIComponent(kanji)}`;
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
        kanji: getVocabRealKanji(raw),
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
        wireVocabKanjiLinks(kanjiEl);

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
        const p = createElement("span", "pill pill--soft-accent", item.vru);
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

  var VOCAB_AUTO_NEXT_DEFAULT_SECONDS = 60;
  var VOCAB_AUTO_NEXT_MIN_SECONDS = 3;
  var VOCAB_AUTO_NEXT_MAX_SECONDS = 600;
  var vocabAutoNextTimer = null;

  function clearVocabAutoNextTimer() {
    if (vocabAutoNextTimer) {
      clearTimeout(vocabAutoNextTimer);
      vocabAutoNextTimer = null;
    }
  }

  function getVocabAutoNextDelayMs() {
    var secs = state.ui.vocabFlashcardAutoNextSeconds;
    if (typeof secs !== "number" || !isFinite(secs) || secs < VOCAB_AUTO_NEXT_MIN_SECONDS) {
      secs = VOCAB_AUTO_NEXT_DEFAULT_SECONDS;
    }
    if (secs > VOCAB_AUTO_NEXT_MAX_SECONDS) secs = VOCAB_AUTO_NEXT_MAX_SECONDS;
    return secs * 1000;
  }

  /** (Re)khởi động đếm ngược cho auto-next — gọi lại mỗi khi có điều hướng thủ công để tính lại từ đầu */
  function scheduleVocabAutoNextTimer() {
    clearVocabAutoNextTimer();
    if (!state.ui.vocabFlashcardAutoNext || state.ui.vocabViewMode !== "flashcard") return;
    if (vocabPipClip) return; // video PiP dựng sẵn đang tự chuyển từ
    vocabAutoNextTimer = setTimeout(vocabAutoNextTick, getVocabAutoNextDelayMs());
  }

  function vocabAutoNextTick() {
    var filtered = applyVocabFilters();
    if (filtered.length > 0) {
      var newIndex = state.ui.vocabFlashcardIndex + 1;
      if (newIndex > filtered.length - 1) newIndex = 0; // hết danh sách thì quay về thẻ đầu tiên
      state.ui.vocabFlashcardIndex = newIndex;
      state.ui.vocabFlashcardFlipped = false;
      saveVocabViewState(vocabData.indexOf(filtered[newIndex]));
      if (state.ui.vocabViewMode === "flashcard") {
        renderVocabList();
      }
    }
    scheduleVocabAutoNextTimer();
  }

  function advanceVocabFlashcard(delta) {
    if (state.ui.vocabViewMode !== "flashcard") return;
    var filtered = applyVocabFilters();
    if (filtered.length === 0) return;
    // Quay vòng: ở từ cuối bấm next thì về từ đầu, ở từ đầu bấm prev thì về từ cuối
    var newIndex = (state.ui.vocabFlashcardIndex + delta + filtered.length) % filtered.length;
    if (newIndex === state.ui.vocabFlashcardIndex) return;
    state.ui.vocabFlashcardIndex = newIndex;
    state.ui.vocabFlashcardFlipped = false;
    saveVocabViewState(vocabData.indexOf(filtered[newIndex]));
    renderVocabList();
    // Người dùng tự next/prev: tính lại đếm ngược 1 phút từ đầu
    scheduleVocabAutoNextTimer();
  }

  /** Chuẩn hoá 1 dòng vocabData thành dữ liệu hiển thị trên thẻ / PiP */
  function buildVocabPipItem(raw) {
    return {
      lesson: raw.lesson != null ? raw.lesson : raw.Lesson,
      hiragana: raw.hiragana != null ? raw.hiragana : raw.Hiragana,
      romaji: raw.romaji != null ? raw.romaji
        : (raw.Romaji != null ? raw.Romaji
          : (raw.romazi != null ? raw.romazi : raw.Romazi)),
      kanji: getVocabRealKanji(raw),
      meaning: raw.meaning != null ? raw.meaning : raw.Meaning,
      vru: raw.vru != null ? raw.vru : raw.Vru,
      type: raw.type != null ? raw.type : raw.Type,
      note: raw.note != null ? raw.note : raw.Note,
      category: raw.category != null ? raw.category : raw.Category
    };
  }

  function renderVocabFlashcard(filtered, listContainer) {
    if (filtered.length === 0) {
      const empty = createElement("div", "detail-empty", "Không có từ vựng phù hợp với bộ lọc hiện tại.");
      listContainer.appendChild(empty);
      updateVocabPip(null, 0, 0);
      return;
    }

    // Lần đầu vào flashcard sau khi tải trang: khôi phục đúng thẻ đã xem lần cuối
    if (!state.ui.vocabFlashcardRestored) {
      state.ui.vocabFlashcardRestored = true;
      if (typeof state.ui.vocabFlashcardVocabIndex === "number") {
        var restoredPos = filtered.findIndex(function (raw) {
          return vocabData.indexOf(raw) === state.ui.vocabFlashcardVocabIndex;
        });
        state.ui.vocabFlashcardIndex = restoredPos >= 0 ? restoredPos : 0;
      }
    }

    if (state.ui.vocabFlashcardIndex >= filtered.length) {
      state.ui.vocabFlashcardIndex = filtered.length - 1;
    }
    if (state.ui.vocabFlashcardIndex < 0) {
      state.ui.vocabFlashcardIndex = 0;
    }

    const pos = state.ui.vocabFlashcardIndex;
    const raw = filtered[pos];
    const vocabIndex = vocabData.indexOf(raw);
    state.ui.vocabFlashcardVocabIndex = vocabIndex;

    const item = buildVocabPipItem(raw);

    const wrap = createElement("div", "vocab-flashcard-wrap" + (state.ui.vocabFlashcardFullscreen ? " vocab-flashcard-wrap--fullscreen" : ""), "");
    const fontScale = getVocabFlashcardFontScale();
    wrap.style.setProperty("--fc-font-scale", String(fontScale));

    const topRow = createElement("div", "vocab-flashcard-top-row", "");
    const counter = createElement("div", "vocab-flashcard-counter", (pos + 1) + " / " + filtered.length);
    topRow.appendChild(counter);

    const cardMode = state.ui.vocabFlashcardMode === "1" ? "1" : "2";
    const modeToggle = createElement("div", "vocab-flashcard-mode-toggle", "");
    [["2", "2 mặt"], ["1", "1 mặt"]].forEach(function (pair) {
      var modeBtn = createElement("button", "vocab-flashcard-mode-btn" + (cardMode === pair[0] ? " vocab-flashcard-mode-btn--active" : ""), pair[1]);
      modeBtn.type = "button";
      modeBtn.title = pair[0] === "1" ? "Hiện cả hiragana/kanji và nghĩa cùng lúc, không cần lật thẻ" : "Bấm vào thẻ để lật xem nghĩa";
      modeBtn.addEventListener("click", function () {
        if (state.ui.vocabFlashcardMode === pair[0]) return;
        state.ui.vocabFlashcardMode = pair[0];
        state.ui.vocabFlashcardFlipped = false;
        saveVocabViewState(vocabIndex);
        renderVocabList();
      });
      modeToggle.appendChild(modeBtn);
    });
    topRow.appendChild(modeToggle);

    var isAutoNext = !!state.ui.vocabFlashcardAutoNext;
    var autoNextSecondsValue = (typeof state.ui.vocabFlashcardAutoNextSeconds === "number" && state.ui.vocabFlashcardAutoNextSeconds >= VOCAB_AUTO_NEXT_MIN_SECONDS)
      ? state.ui.vocabFlashcardAutoNextSeconds
      : VOCAB_AUTO_NEXT_DEFAULT_SECONDS;

    var autoNextGroup = createElement("div", "vocab-flashcard-autonext-group", "");

    var autoNextBtn = createElement("button", "vocab-flashcard-autonext-btn" + (isAutoNext ? " vocab-flashcard-autonext-btn--active" : ""), "⏱ Auto");
    autoNextBtn.type = "button";
    autoNextBtn.title = isAutoNext
      ? "Đang tự động chuyển thẻ mỗi " + autoNextSecondsValue + " giây — bấm để tắt"
      : "Bật để tự động chuyển sang thẻ tiếp theo mỗi " + autoNextSecondsValue + " giây (quay lại thẻ đầu khi hết danh sách)";
    autoNextBtn.addEventListener("click", function () {
      setVocabAutoNext(!state.ui.vocabFlashcardAutoNext);
    });
    autoNextGroup.appendChild(autoNextBtn);

    var autoNextSecondsInput = createElement("input", "vocab-flashcard-autonext-seconds", "");
    autoNextSecondsInput.type = "number";
    autoNextSecondsInput.min = String(VOCAB_AUTO_NEXT_MIN_SECONDS);
    autoNextSecondsInput.max = String(VOCAB_AUTO_NEXT_MAX_SECONDS);
    autoNextSecondsInput.step = "1";
    autoNextSecondsInput.value = String(autoNextSecondsValue);
    autoNextSecondsInput.title = "Số giây tự động chuyển thẻ tiếp theo";
    autoNextSecondsInput.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    autoNextSecondsInput.addEventListener("change", function () {
      var val = parseInt(autoNextSecondsInput.value, 10);
      if (!isFinite(val) || val < VOCAB_AUTO_NEXT_MIN_SECONDS) val = VOCAB_AUTO_NEXT_MIN_SECONDS;
      if (val > VOCAB_AUTO_NEXT_MAX_SECONDS) val = VOCAB_AUTO_NEXT_MAX_SECONDS;
      autoNextSecondsInput.value = String(val);
      state.ui.vocabFlashcardAutoNextSeconds = val;
      saveVocabViewState(vocabIndex);
      scheduleVocabAutoNextTimer();
      renderVocabList();
    });
    autoNextGroup.appendChild(autoNextSecondsInput);
    autoNextGroup.appendChild(createElement("span", "vocab-flashcard-autonext-unit", "giây"));

    topRow.appendChild(autoNextGroup);

    var isFullscreen = !!state.ui.vocabFlashcardFullscreen;
    var fullscreenBtn = createElement("button", "vocab-flashcard-fullscreen-btn" + (isFullscreen ? " vocab-flashcard-fullscreen-btn--active" : ""), isFullscreen ? "✕" : "⛶");
    fullscreenBtn.type = "button";
    fullscreenBtn.title = isFullscreen ? "Thoát chế độ trình chiếu toàn màn hình" : "Xem toàn màn hình (chế độ trình chiếu)";
    fullscreenBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleVocabFlashcardFullscreen();
    });

    var viewBtns = createElement("div", "vocab-flashcard-view-btns", "");

    var fontPercent = Math.round(fontScale * 100) + "%";
    var fontGroup = createElement("div", "vocab-flashcard-font-group", "");
    [[-1, "A−", "Giảm cỡ chữ", VOCAB_FLASHCARD_FONT_SCALE_MIN], [1, "A+", "Tăng cỡ chữ", VOCAB_FLASHCARD_FONT_SCALE_MAX]].forEach(function (cfg) {
      var fontBtn = createElement("button", "vocab-flashcard-font-btn", cfg[1]);
      fontBtn.type = "button";
      fontBtn.title = cfg[2] + " (đang " + fontPercent + ")";
      fontBtn.disabled = cfg[0] < 0 ? fontScale <= cfg[3] : fontScale >= cfg[3];
      fontBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        changeVocabFlashcardFontScale(cfg[0]);
      });
      fontGroup.appendChild(fontBtn);
    });
    viewBtns.appendChild(fontGroup);

    if (isCanvasPipSupported()) {
      var pipBtn = createElement("button", "vocab-flashcard-pip-btn", "PiP");
      pipBtn.type = "button";
      applyVocabPipBtnState(pipBtn);
      // Gắn sẵn stream vào video từ lúc nút hiện, để lúc bấm video đã có metadata (Safari cần gọi PiP ngay trong click)
      vocabPip.warm();
      pipBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (vocabPip.isActive()) {
          vocabPip.exit();
        } else {
          vocabPip.open();
        }
      });
      viewBtns.appendChild(pipBtn);
    }
    viewBtns.appendChild(fullscreenBtn);
    topRow.appendChild(viewBtns);
    wrap.appendChild(topRow);

    const stage = createElement("div", "vocab-flashcard-stage" +
      (vocabFlashcardEnterDir > 0 ? " vocab-flashcard-stage--enter-next" : (vocabFlashcardEnterDir < 0 ? " vocab-flashcard-stage--enter-prev" : "")), "");
    wireVocabFlashcardSwipe(stage, filtered.length > 1);

    const isSingleMode = cardMode === "1";
    const card = createElement("div", "vocab-flashcard" +
      (isSingleMode ? " vocab-flashcard--single" : (state.ui.vocabFlashcardFlipped ? " vocab-flashcard--flipped" : "")), "");

    // Mặt trước: hiragana / kanji / romaji
    const front = createElement("div", "vocab-flashcard-face vocab-flashcard-face--front", "");
    if (state.displaySettings.hiragana && item.hiragana) {
      front.appendChild(createElement("div", "vocab-hira", item.hiragana));
    }
    if (state.displaySettings.kanji && item.kanji) {
      const kanjiEl = createElement("div", "vocab-kanji");
      kanjiEl.innerHTML = "(" + boldKanji(item.kanji) + ")";
      wireVocabKanjiLinks(kanjiEl);
      front.appendChild(kanjiEl);
    }
    if (state.displaySettings.romaji && item.romaji) {
      front.appendChild(createElement("div", "vocab-romazi", "(" + item.romaji + ")"));
    }
    if (!isSingleMode) {
      front.appendChild(createElement("div", "vocab-flashcard-hint", "Chạm để xem nghĩa"));
    }

    // Mặt sau: nghĩa + các trường phụ
    const back = createElement("div", "vocab-flashcard-face vocab-flashcard-face--back", "");
    if (isSingleMode) {
      back.appendChild(createElement("div", "vocab-flashcard-divider", ""));
    }
    if (state.displaySettings.meaning && item.meaning) {
      back.appendChild(createElement("div", "vocab-meaning", item.meaning));
    }
    if (state.displaySettings.hanviet && item.kanji && window.getHanViet) {
      const hv = window.getHanViet(item.kanji);
      if (hv) back.appendChild(createElement("div", "vocab-hanviet", "[" + hv + "]"));
    }
    const backMeta = createElement("div", "vocab-meta-row", "");
    if (state.displaySettings.lesson && item.lesson) {
      backMeta.appendChild(createElement("span", "pill pill--lesson", "Bài " + item.lesson));
    }
    if (state.displaySettings.type && item.type) {
      backMeta.appendChild(createElement("span", "pill pill--type", item.type));
    }
    if (state.displaySettings.category && item.category) {
      backMeta.appendChild(createElement("span", "pill", getCategoryLabel(item.category)));
    }
    if (state.displaySettings.vru && item.vru) {
      backMeta.appendChild(createElement("span", "pill pill--soft-accent", item.vru));
    }
    if (state.displaySettings.note && item.note) {
      backMeta.appendChild(createElement("span", "pill", "Note: " + item.note));
    }
    if (backMeta.childNodes.length > 0) back.appendChild(backMeta);

    card.appendChild(front);
    card.appendChild(back);
    if (!isSingleMode) {
      card.addEventListener("click", function (e) {
        if (e.target.closest(".star-btn, .mastered-btn, .audio-btn")) return;
        state.ui.vocabFlashcardFlipped = !state.ui.vocabFlashcardFlipped;
        saveVocabViewState(vocabIndex);
        renderVocabList();
      });
    }

    stage.appendChild(card);

    // Star / mastered / audio nổi trên thẻ
    var isFav = !!state.vocabFavorites[vocabIndex];
    var starBtn = createElement("button", "star-btn vocab-flashcard-star" + (isFav ? " star-btn--active" : ""), isFav ? "★" : "☆");
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
    stage.appendChild(starBtn);

    var isMastered = !!state.vocabMastered[vocabIndex];
    var masteredBtn = createElement("button", "mastered-btn vocab-flashcard-mastered" + (isMastered ? " mastered-btn--active" : ""), isMastered ? "✓" : "○");
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
    stage.appendChild(masteredBtn);

    if (item.hiragana && state.displaySettings.voice) {
      var audioBtn = createAudioBtn(item.hiragana);
      audioBtn.classList.add("vocab-flashcard-audio");
      stage.appendChild(audioBtn);
    }

    wrap.appendChild(stage);

    const navRow = createElement("div", "detail-nav-row vocab-flashcard-nav", "");
    const prevBtn = createElement("button", "detail-nav-btn", "‹");
    prevBtn.type = "button";
    prevBtn.title = pos <= 0 ? "Từ trước (quay về từ cuối cùng)" : "Từ trước";
    prevBtn.disabled = filtered.length <= 1;
    prevBtn.addEventListener("click", function () {
      advanceVocabFlashcard(-1);
    });

    const nextBtn = createElement("button", "detail-nav-btn", "›");
    nextBtn.type = "button";
    nextBtn.title = pos >= filtered.length - 1 ? "Từ tiếp theo (quay về từ đầu tiên, hoặc bấm phím Space)" : "Từ tiếp theo (hoặc bấm phím Space)";
    nextBtn.disabled = filtered.length <= 1;
    nextBtn.addEventListener("click", function () {
      advanceVocabFlashcard(1);
    });

    navRow.appendChild(prevBtn);
    navRow.appendChild(nextBtn);
    wrap.appendChild(navRow);

    listContainer.appendChild(wrap);
    saveVocabViewState(vocabIndex);
    updateVocabPip(item, pos, filtered.length);
  }

  var VOCAB_FLASHCARD_FONT_SCALE_MIN = 0.6;
  var VOCAB_FLASHCARD_FONT_SCALE_MAX = 2;
  var VOCAB_FLASHCARD_FONT_SCALE_STEP = 0.1;

  function getVocabFlashcardFontScale() {
    var scale = state.ui.vocabFlashcardFontScale;
    if (typeof scale !== "number" || !isFinite(scale)) return 1;
    return Math.min(VOCAB_FLASHCARD_FONT_SCALE_MAX, Math.max(VOCAB_FLASHCARD_FONT_SCALE_MIN, scale));
  }

  function changeVocabFlashcardFontScale(steps) {
    var scale = getVocabFlashcardFontScale() + steps * VOCAB_FLASHCARD_FONT_SCALE_STEP;
    scale = Math.round(scale * 10) / 10; // tránh lệch số thực (0.1 + 0.2...)
    state.ui.vocabFlashcardFontScale = Math.min(VOCAB_FLASHCARD_FONT_SCALE_MAX, Math.max(VOCAB_FLASHCARD_FONT_SCALE_MIN, scale));
    saveVocabViewState(state.ui.vocabFlashcardVocabIndex);
    renderVocabList();
  }

  // ----- Vuốt ngang trên thẻ để chuyển từ: vuốt sang trái = từ tiếp theo, sang phải = từ trước -----
  var VOCAB_SWIPE_OUT_MS = 180;
  /** Hướng trượt vào của thẻ ở lần render kế tiếp (1 = từ tiếp theo, -1 = từ trước, 0 = không hiệu ứng) */
  var vocabFlashcardEnterDir = 0;

  function wireVocabFlashcardSwipe(stage, enabled) {
    var startX = 0;
    var startY = 0;
    var startTime = 0;
    var dx = 0;
    var tracking = false;
    var dragging = false;
    var leaving = false;
    var suppressClickUntil = 0;

    function setOffset(x) {
      var width = stage.offsetWidth || 300;
      stage.style.transform = x ? "translateX(" + x + "px) rotate(" + (x * 0.03) + "deg)" : "";
      stage.style.opacity = x ? String(Math.max(0.35, 1 - Math.abs(x) / (width * 1.4))) : "";
    }

    function snapBack() {
      stage.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
      setOffset(0);
    }

    stage.addEventListener("animationend", function () {
      stage.classList.remove("vocab-flashcard-stage--enter-next", "vocab-flashcard-stage--enter-prev");
    });

    stage.addEventListener("touchstart", function (e) {
      if (!enabled || leaving) return;
      if (e.touches.length !== 1) {
        // Chạm thêm ngón thứ 2 → huỷ vuốt
        if (dragging) snapBack();
        tracking = false;
        dragging = false;
        return;
      }
      stage.classList.remove("vocab-flashcard-stage--enter-next", "vocab-flashcard-stage--enter-prev");
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      dx = 0;
      tracking = true;
      dragging = false;
      stage.style.transition = "none";
    }, { passive: true });

    stage.addEventListener("touchmove", function (e) {
      if (!tracking) return;
      var mx = e.touches[0].clientX - startX;
      var my = e.touches[0].clientY - startY;
      if (!dragging) {
        if (Math.abs(mx) < 10 && Math.abs(my) < 10) return;
        // Kéo dọc thì bỏ qua, không coi là vuốt chuyển từ
        if (Math.abs(my) >= Math.abs(mx)) {
          tracking = false;
          return;
        }
        dragging = true;
      }
      if (e.cancelable) e.preventDefault();
      dx = mx;
      setOffset(dx);
    }, { passive: false });

    stage.addEventListener("touchend", function () {
      if (!tracking) return;
      tracking = false;
      if (!dragging) return;
      dragging = false;
      suppressClickUntil = Date.now() + 400;
      var width = stage.offsetWidth || 300;
      var speed = Math.abs(dx) / Math.max(1, Date.now() - startTime);
      // Qua được 1/4 thẻ, hoặc hất nhanh, thì chuyển từ; không thì thẻ bật về chỗ cũ
      var passed = Math.abs(dx) >= width * 0.25 || (Math.abs(dx) >= 40 && speed > 0.35);
      if (!passed) {
        snapBack();
        return;
      }
      var dir = dx < 0 ? 1 : -1;
      leaving = true;
      stage.style.transition = "transform " + VOCAB_SWIPE_OUT_MS + "ms ease-in, opacity " + VOCAB_SWIPE_OUT_MS + "ms ease-in";
      setOffset(-dir * width * 1.1);
      stage.style.opacity = "0";
      setTimeout(function () {
        vocabFlashcardEnterDir = dir;
        advanceVocabFlashcard(dir);
        vocabFlashcardEnterDir = 0;
      }, VOCAB_SWIPE_OUT_MS);
    });

    stage.addEventListener("touchcancel", function () {
      if (dragging) snapBack();
      tracking = false;
      dragging = false;
    });

    // Vừa vuốt xong thì không tính là chạm (không lật thẻ / không mở link kanji)
    stage.addEventListener("click", function (e) {
      if (Date.now() < suppressClickUntil) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  function setVocabAutoNext(on) {
    state.ui.vocabFlashcardAutoNext = !!on;
    saveVocabViewState(state.ui.vocabFlashcardVocabIndex);
    scheduleVocabAutoNextTimer();
    renderVocabList();
  }

  // ----- PiP từ canvas (dùng chung cho Flashcard từ vựng và chi tiết Kanji) -----
  // Vẽ nội dung lên canvas → captureStream vào <video> ẩn → requestPictureInPicture.
  var PIP_FONT_JP = '"Noto Serif JP", serif';
  var PIP_FONT_UI = 'system-ui, -apple-system, "Segoe UI", sans-serif';

  function isCanvasPipSupported() {
    return document.pictureInPictureEnabled !== false &&
      typeof HTMLVideoElement !== "undefined" && "requestPictureInPicture" in HTMLVideoElement.prototype &&
      typeof HTMLCanvasElement !== "undefined" && "captureStream" in HTMLCanvasElement.prototype;
  }

  // iOS/Safari: PiP phát trực tiếp stream canvas dễ bị đen khi chuyển app / khoá màn hình
  // → sau khi mở PiP, ghi vài giây stream thành video lặp rồi phát file đó (cách của trang pip-kanji-pwa)
  var PIP_USE_RECORDED_LOOP = (function () {
    if (typeof MediaRecorder === "undefined") return false;
    var ua = navigator.userAgent || "";
    var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var isSafari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|EdgiOS|Edg|OPR|Android/.test(ua);
    return isIOS || isSafari;
  })();

  function pickPipRecorderMime() {
    if (!MediaRecorder.isTypeSupported) return "";
    var types = ["video/mp4", "video/mp4; codecs=avc1.42E01E", "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
    for (var i = 0; i < types.length; i++) {
      if (MediaRecorder.isTypeSupported(types[i])) return types[i];
    }
    return "";
  }

  /** Ghi durationMs từ stream → gọi done(blob) (null nếu lỗi) */
  function recordPipStream(stream, durationMs, done) {
    var mime = pickPipRecorderMime();
    var rec;
    try {
      rec = mime ? new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 2500000 }) : new MediaRecorder(stream);
    } catch (e1) {
      try { rec = new MediaRecorder(stream); } catch (e2) { done(null); return; }
    }
    var chunks = [];
    var finished = false;
    function finish(blob) {
      if (finished) return;
      finished = true;
      done(blob);
    }
    rec.ondataavailable = function (e) {
      if (e.data && e.data.size) chunks.push(e.data);
    };
    rec.onstop = function () {
      finish(chunks.length ? new Blob(chunks, { type: mime || rec.mimeType || "video/mp4" }) : null);
    };
    try {
      rec.start(200);
    } catch (e) {
      finish(null);
      return;
    }
    setTimeout(function () {
      if (rec.state === "recording") {
        try { rec.stop(); } catch (e) { finish(null); }
      }
    }, durationMs);
    setTimeout(function () { finish(null); }, durationMs + 2200);
  }

  // Chẩn đoán PiP trên điện thoại: mở trang với ?pipdebug=1 (được nhớ lại), ?pipdebug=0 để tắt
  var PIP_DEBUG = (function () {
    try {
      var v = new URLSearchParams(location.search).get("pipdebug");
      if (v === "1") localStorage.setItem("jp_pip_debug", "1");
      if (v === "0") localStorage.removeItem("jp_pip_debug");
      return localStorage.getItem("jp_pip_debug") === "1";
    } catch (e) {
      return false;
    }
  })();
  var pipDebugTargets = [];

  /** Độ sáng trung bình 0 (đen) → 255 (trắng) của video / canvas, để biết hình có tới được video không */
  function pipDebugBrightness(source) {
    try {
      var c = document.createElement("canvas");
      c.width = 16;
      c.height = 16;
      var g = c.getContext("2d");
      g.drawImage(source, 0, 0, 16, 16);
      var d = g.getImageData(0, 0, 16, 16).data;
      var sum = 0;
      for (var i = 0; i < d.length; i += 4) sum += d[i] + d[i + 1] + d[i + 2];
      return Math.round(sum / (d.length / 4) / 3);
    } catch (e) {
      return "lỗi " + e.name;
    }
  }

  function setupPipDebugPanel() {
    if (!PIP_DEBUG) return;
    var panel = createElement("pre", "pip-debug-panel", "PiP debug: chưa mở PiP");
    panel.style.cssText = "position:fixed;left:4px;bottom:4px;z-index:100000;max-width:calc(100vw - 8px);margin:0;" +
      "padding:6px 8px;border-radius:6px;background:rgba(0,0,0,0.78);color:#4ade80;" +
      "font:10px/1.35 ui-monospace,Menlo,monospace;white-space:pre-wrap;pointer-events:none;";
    document.body.appendChild(panel);
    setInterval(function () {
      var lines = ["recordedLoop=" + PIP_USE_RECORDED_LOOP + " pipEl=" + (document.pictureInPictureElement ? "video" : "none")];
      pipDebugTargets.forEach(function (t) { lines.push(t()); });
      panel.textContent = lines.join("\n");
    }, 500);
  }

  /**
   * opts.name: tên hiện trong bảng chẩn đoán; opts.width / opts.height: kích thước canvas;
   * opts.draw(ctx, W, H): vẽ nội dung hiện tại;
   * opts.actions: { previoustrack, nexttrack, play, pause } cho các nút trong cửa sổ PiP (Chrome);
   * opts.playbackState(): "playing" | "paused" cho nút ⏯ (tuỳ chọn); opts.onChange(): khi mở / đóng PiP.
   * Cách làm theo trang pip-kanji-pwa (chạy được trên iOS): stream gắn sẵn vào video từ trước khi bấm,
   * vẽ trực tiếp lên canvas liên tục khi PiP mở, lúc bấm mới play() + requestPictureInPicture().
   */
  function createCanvasPip(opts) {
    var el = null; // { canvas, ctx, video, stream } — tạo khi nút PiP hiện lần đầu
    var pumpTimer = 0;
    var pumpUntil = 0;
    var recordTimer = 0;
    var recordedUrl = null; // đang phát video đã ghi thay cho stream trực tiếp
    var clip = null; // { handlers, ready } — đang phát video dựng sẵn (playClip), canvas không vẽ nữa
    var generation = 0; // tăng mỗi lần nội dung đổi, để bỏ bản ghi đã cũ
    var dbg = { frames: 0, draws: 0, playErr: "", reqErr: "", rec: "" };

    function isActive() {
      return !!el && document.pictureInPictureElement === el.video;
    }

    function play() {
      try {
        var p = el.video.play();
        if (p && typeof p.catch === "function") {
          p.catch(function (err) { dbg.playErr = err && err.name; });
        }
      } catch (e) {
        dbg.playErr = e && e.name;
      }
    }

    function syncPlaybackState() {
      if (!isActive() || !("mediaSession" in navigator)) return;
      try {
        navigator.mediaSession.playbackState = opts.playbackState ? opts.playbackState() : "none";
      } catch (e) { }
    }

    function setMediaSession(on) {
      if (!("mediaSession" in navigator)) return;
      ["previoustrack", "nexttrack", "play", "pause"].forEach(function (action) {
        try {
          navigator.mediaSession.setActionHandler(action, (on && opts.actions && opts.actions[action]) || null);
        } catch (e) { }
      });
      if (on) {
        syncPlaybackState();
      } else {
        try { navigator.mediaSession.playbackState = "none"; } catch (e) { }
      }
    }

    /** Vẽ nội dung lên canvas nguồn → stream nhận frame mới */
    function draw() {
      opts.draw(el.ctx, opts.width, opts.height);
      dbg.draws++;
      var track = el.stream && el.stream.getVideoTracks()[0];
      if (track && track.readyState === "live" && typeof track.requestFrame === "function") {
        try { track.requestFrame(); } catch (e) { }
      }
    }

    /** Vẽ lại liên tục (~30 fps) trong ms tới và suốt lúc PiP mở; khi đang phát video đã ghi thì không cần */
    function keepPumping(ms) {
      pumpUntil = Math.max(pumpUntil, Date.now() + ms);
      if (pumpTimer) return;
      pumpTimer = setInterval(function () {
        if (!isActive() && Date.now() > pumpUntil) {
          clearInterval(pumpTimer);
          pumpTimer = 0;
          return;
        }
        if (!recordedUrl) draw();
      }, 33);
    }

    /** (Tạo lại) stream trực tiếp từ canvas và gắn vào video, bỏ video đã ghi nếu có */
    function attachLiveStream() {
      clearTimeout(recordTimer);
      clip = null;
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
        recordedUrl = null;
      }
      if (el.stream) {
        el.stream.getTracks().forEach(function (t) { t.stop(); });
      }
      el.video.removeAttribute("src");
      el.video.loop = false;
      el.stream = el.canvas.captureStream(30);
      el.video.srcObject = el.stream;
      draw();
    }

    function scheduleRecordedLoop() {
      if (!PIP_USE_RECORDED_LOOP) return;
      clearTimeout(recordTimer);
      var gen = generation;
      recordTimer = setTimeout(function () {
        if (!isActive() || recordedUrl || gen !== generation) return;
        dbg.rec = "đang ghi";
        recordPipStream(el.stream, 1600, function (blob) {
          dbg.rec = blob ? (blob.type || "?") + " " + Math.round(blob.size / 1024) + "KB" : "ghi lỗi";
          if (!blob || !blob.size || !isActive() || recordedUrl || gen !== generation) return;
          recordedUrl = URL.createObjectURL(blob);
          el.video.srcObject = null;
          el.video.src = recordedUrl;
          el.video.loop = true;
          play();
          el.stream.getTracks().forEach(function (t) { t.stop(); });
        });
      }, 450);
    }

    /** Tạo canvas + video (1 lần) và gắn sẵn stream — gọi khi nút PiP được hiển thị, trước lúc bấm */
    function warm() {
      if (el) return;
      // Giống trang pip-kanji-pwa (chạy được trên iOS): canvas vẫn được vẽ ra màn hình (chỉ lộ 1px góc
      // trên-trái), video trong suốt nhưng nằm trong viewport — iOS không vẽ frame cho video bị coi là
      // không hiển thị → PiP đen. Style inline để không phụ thuộc style.css (bản cũ trong cache → canvas hiện nguyên khổ).
      var boxStyle = "position:fixed;left:0;top:0;width:1px;height:1px;overflow:hidden;pointer-events:none;";
      var srcBox = createElement("div", "canvas-pip-src", "");
      srcBox.style.cssText = boxStyle;
      var canvas = document.createElement("canvas");
      canvas.width = opts.width;
      canvas.height = opts.height;
      canvas.style.cssText = "position:absolute;left:0;top:0;";
      srcBox.appendChild(canvas);
      var videoBox = createElement("div", "canvas-pip-video", "");
      videoBox.style.cssText = boxStyle + "opacity:0;";
      var video = document.createElement("video");
      video.style.cssText = "position:absolute;left:0;top:0;";
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      videoBox.appendChild(video);
      document.body.appendChild(srcBox);
      document.body.appendChild(videoBox);

      el = { canvas: canvas, ctx: canvas.getContext("2d"), video: video, stream: null };
      attachLiveStream();
      keepPumping(1500);

      video.addEventListener("enterpictureinpicture", function () {
        setMediaSession(true);
        keepPumping(0);
        scheduleRecordedLoop();
        opts.onChange();
      });
      video.addEventListener("leavepictureinpicture", function () {
        // Đang chuyển sang PiP khác (vd. Flashcard → Kanji) thì không xoá nút của PiP mới
        if (!document.pictureInPictureElement) setMediaSession(false);
        if (recordedUrl) attachLiveStream();
        keepPumping(1500);
        opts.onChange();
      });
      video.addEventListener("timeupdate", function () {
        if (clip && clip.handlers.onTime) clip.handlers.onTime(video.currentTime);
      });
      video.addEventListener("playing", function () {
        if (clip) clip.ready = true;
      });
      video.addEventListener("pause", function () {
        // Bấm dừng trong cửa sổ PiP (iOS không qua mediaSession); chờ chút để bỏ qua lúc đóng PiP / đổi nguồn
        var c = clip;
        if (!c || !c.ready || !c.handlers.onPause) return;
        setTimeout(function () {
          if (clip === c && video.paused && isActive()) c.handlers.onPause();
        }, 300);
      });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { redraw(); });
      }

      if (PIP_DEBUG) {
        if (video.requestVideoFrameCallback) {
          var onFrame = function () {
            dbg.frames++;
            video.requestVideoFrameCallback(onFrame);
          };
          video.requestVideoFrameCallback(onFrame);
        }
        pipDebugTargets.push(function () {
          var v = el.video;
          var track = el.stream && el.stream.getVideoTracks()[0];
          return "[" + opts.name + "] pip=" + isActive() + " src=" + (clip ? "clip" : recordedUrl ? "recorded" : "live") +
            "\n  video rs=" + v.readyState + " paused=" + v.paused + " " + v.videoWidth + "x" + v.videoHeight +
            " t=" + v.currentTime.toFixed(1) + " frames=" + (v.requestVideoFrameCallback ? dbg.frames : "n/a") +
            "\n  sáng: video=" + pipDebugBrightness(v) + " canvas=" + pipDebugBrightness(el.canvas) + " draws=" + dbg.draws +
            "\n  track=" + (track ? track.readyState + (track.muted ? " muted" : "") : "none") +
            " rec=" + (dbg.rec || "-") + (dbg.playErr ? " playErr=" + dbg.playErr : "") + (dbg.reqErr ? " reqErr=" + dbg.reqErr : "");
        });
      }
    }

    /** Gọi khi nội dung đổi */
    function redraw() {
      if (!el) return;
      if (clip) {
        // Video dựng sẵn tự chạy nội dung, không vẽ đè
        syncPlaybackState();
        return;
      }
      generation++;
      if (isActive() && recordedUrl) attachLiveStream();
      draw();
      if (isActive()) {
        play();
        keepPumping(0);
        scheduleRecordedLoop();
      }
      syncPlaybackState();
    }

    function open() {
      warm();
      draw();
      keepPumping(3000);
      function request() {
        el.video.requestPictureInPicture().catch(function (err) {
          dbg.reqErr = err && err.name;
          alert("Không bật được PiP: " + (err && err.message ? err.message : err) + " (thử bấm lại nút PiP)");
        });
      }
      // Như trang cũ: play() rồi gọi requestPictureInPicture() ngay trong cùng lần bấm (Safari cần user activation)
      play();
      if (el.video.readyState >= 1) {
        request();
      } else {
        el.video.addEventListener("loadedmetadata", request, { once: true });
      }
    }

    function exit() {
      if (isActive() && document.exitPictureInPicture) {
        document.exitPictureInPicture().catch(function () { });
      }
    }

    /**
     * Phát video dựng sẵn (blob URL, lặp lại) thay cho canvas, bắt đầu từ giây startAt.
     * handlers.onTime(t): khi video chạy tới giây t; handlers.onPause(): khi bị dừng trong cửa sổ PiP.
     * Video tự chạy nên vẫn chuyển nội dung khi trang bị treo JS (iOS chuyển app / khoá màn hình).
     */
    function playClip(url, startAt, handlers) {
      if (!el) return;
      clearTimeout(recordTimer);
      generation++;
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      if (el.stream) {
        el.stream.getTracks().forEach(function (t) { t.stop(); });
        el.stream = null;
      }
      recordedUrl = url;
      clip = { handlers: handlers || {}, ready: false };
      el.video.srcObject = null;
      el.video.loop = true;
      el.video.addEventListener("loadedmetadata", function () {
        try { el.video.currentTime = startAt || 0; } catch (e) { }
      }, { once: true });
      el.video.src = url;
      play();
    }

    /** Bỏ video dựng sẵn, quay lại vẽ canvas trực tiếp */
    function stopClip() {
      if (!el || !clip) return;
      attachLiveStream();
      if (isActive()) {
        play();
        keepPumping(0);
        scheduleRecordedLoop();
      }
    }

    function isClip() {
      return !!clip;
    }

    function clipTime() {
      return clip ? el.video.currentTime : -1;
    }

    function seekClip(t) {
      if (!clip) return;
      try { el.video.currentTime = t; } catch (e) { }
      if (el.video.paused) play();
    }

    return {
      isActive: isActive, warm: warm, redraw: redraw, open: open, exit: exit,
      playClip: playClip, stopClip: stopClip, isClip: isClip, clipTime: clipTime, seekClip: seekClip
    };
  }

  // Dựng video mp4 (WebCodecs + mp4-muxer) từ nhiều khung hình, mỗi khung giữ N giây
  var MP4_MUXER_SRC = "https://cdn.jsdelivr.net/npm/mp4-muxer@5.2.2/build/mp4-muxer.min.js";
  var mp4MuxerPromise = null;

  function isPipClipSupported() {
    return typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined";
  }

  function loadMp4Muxer() {
    if (window.Mp4Muxer) return Promise.resolve(window.Mp4Muxer);
    if (!mp4MuxerPromise) {
      mp4MuxerPromise = new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = MP4_MUXER_SRC;
        s.onload = function () {
          if (window.Mp4Muxer) resolve(window.Mp4Muxer);
          else reject(new Error("Không tải được mp4-muxer"));
        };
        s.onerror = function () {
          mp4MuxerPromise = null;
          reject(new Error("Không tải được mp4-muxer"));
        };
        document.head.appendChild(s);
      });
    }
    return mp4MuxerPromise;
  }

  /**
   * Dựng video mp4 W×H gồm count khung, khung i do drawFrame(ctx, i) vẽ và giữ secs giây.
   * Trả Promise<Blob>, hoặc null nếu isCancelled() trả true giữa chừng.
   */
  function encodePipClip(W, H, count, secs, drawFrame, isCancelled) {
    return loadMp4Muxer().then(function (M) {
      var config = { codec: "avc1.42001f", width: W, height: H, bitrate: 1000000, framerate: 1 };
      return VideoEncoder.isConfigSupported(config).then(function (res) {
        if (!res || !res.supported) throw new Error("Trình duyệt không mã hoá được H.264");
        var canvas = document.createElement("canvas");
        canvas.width = W;
        canvas.height = H;
        var ctx = canvas.getContext("2d");
        var muxer = new M.Muxer({
          target: new M.ArrayBufferTarget(),
          video: { codec: "avc", width: W, height: H },
          fastStart: "in-memory"
        });
        var encodeErr = null;
        var encoder = new VideoEncoder({
          output: function (chunk, meta) { muxer.addVideoChunk(chunk, meta); },
          error: function (e) { encodeErr = e; }
        });
        encoder.configure(config);
        var dur = Math.round(secs * 1e6);
        var i = 0;

        function wait(ms) {
          return new Promise(function (r) { setTimeout(r, ms); });
        }

        function step() {
          if (encodeErr) throw encodeErr;
          if (isCancelled()) {
            try { encoder.close(); } catch (e) { }
            return null;
          }
          // Mỗi lượt vài khung rồi nhả luồng cho trang; hàng đợi encoder đầy thì chờ
          if (encoder.encodeQueueSize > 8) return wait(15).then(step);
          for (var n = 0; n < 5 && i < count; n++, i++) {
            drawFrame(ctx, i);
            var frame = new VideoFrame(canvas, { timestamp: i * dur, duration: dur });
            encoder.encode(frame, { keyFrame: true }); // mỗi từ là keyframe → tua tới từ nào cũng hiện ngay
            frame.close();
          }
          if (i < count) return wait(0).then(step);
          return encoder.flush().then(function () {
            if (encodeErr) throw encodeErr;
            encoder.close();
            muxer.finalize();
            return new Blob([muxer.target.buffer], { type: "video/mp4" });
          });
        }

        return step();
      });
    });
  }

  /** Tách dòng theo khoảng trắng; từ dài hơn 1 dòng (vd. tiếng Nhật không có khoảng trắng) thì cắt theo ký tự */
  function wrapCanvasText(ctx, text, maxW) {
    var lines = [];
    var cur = "";
    String(text).trim().split(/\s+/).forEach(function (word) {
      var test = cur ? cur + " " + word : word;
      if (ctx.measureText(test).width <= maxW) {
        cur = test;
        return;
      }
      if (cur) lines.push(cur);
      cur = "";
      Array.from(word).forEach(function (ch) {
        if (cur && ctx.measureText(cur + ch).width > maxW) {
          lines.push(cur);
          cur = "";
        }
        cur += ch;
      });
    });
    if (cur) lines.push(cur);
    return lines;
  }

  /**
   * Xếp các khối chữ (tự xuống dòng) vào khung rộng maxW; cao quá maxH thì thu nhỏ dần cỡ chữ.
   * block: { text, size, weight, family, color, gap } hoặc { divider: true, size } (khoảng trống có vạch kẻ)
   */
  function fitCanvasBlocks(ctx, blocks, maxW, maxH) {
    var lines = [];
    var height = 0;
    for (var scale = 1, tries = 0; tries < 10; tries++, scale *= 0.88) {
      lines = [];
      height = 0;
      blocks.forEach(function (b) {
        var size = Math.round(b.size * scale);
        if (b.divider) {
          lines.push({ divider: true, h: size });
          height += size;
          return;
        }
        var font = (b.weight || 400) + " " + size + "px " + b.family;
        ctx.font = font;
        wrapCanvasText(ctx, b.text, maxW).forEach(function (t) {
          lines.push({ text: t, font: font, color: b.color, h: size * 1.3 });
          height += size * 1.3;
        });
        if (b.gap) {
          lines.push({ h: b.gap * scale });
          height += b.gap * scale;
        }
      });
      if (height <= maxH) break;
    }
    return { lines: lines, height: height };
  }

  /** Bảng màu cho canvas PiP (canvas không đọc được CSS variables) — theo chế độ Tắt đèn */
  function getPipPalette() {
    if (state.displaySettings.darkMode) {
      return {
        bg: "#000000", text: "#e7e2dc", muted: "#a39a90", primary: "#e0675a",
        kanji: "#f0968b", accent: "#e3a064", reading: "#cfc7bd",
        divider: "rgba(231, 226, 220, 0.25)", rule: "rgba(231, 226, 220, 0.2)"
      };
    }
    return {
      bg: "#fdf8f0", text: "#1c1917", muted: "#78716c", primary: "#c0392b",
      kanji: "#9b2335", accent: "#92400e", reading: "#44403c",
      divider: "rgba(160, 100, 60, 0.3)", rule: "rgba(160, 100, 60, 0.25)"
    };
  }

  /** Vẽ các dòng từ fitCanvasBlocks, căn giữa theo cx (align = "left" thì cx là mép trái), bắt đầu từ y */
  function drawCanvasLines(ctx, lines, cx, y, dividerW, align) {
    ctx.textAlign = align || "center";
    ctx.textBaseline = "middle";
    lines.forEach(function (ln) {
      if (ln.divider) {
        ctx.strokeStyle = getPipPalette().divider;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(cx - dividerW / 2, y + ln.h / 2);
        ctx.lineTo(cx + dividerW / 2, y + ln.h / 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (ln.text != null) {
        ctx.font = ln.font;
        ctx.fillStyle = ln.color;
        ctx.fillText(ln.text, cx, y + ln.h / 2);
      }
      y += ln.h;
    });
  }

  // ----- PiP Flashcard: hiện thẻ đang học, đi theo mỗi lần chuyển thẻ -----
  var vocabPipCurrent = { item: null, pos: 0, total: 0 };
  var VOCAB_PIP_W = 800;
  var VOCAB_PIP_H = 450;
  var vocabPip = createCanvasPip({
    name: "flashcard",
    width: VOCAB_PIP_W,
    height: VOCAB_PIP_H,
    draw: drawVocabPip,
    actions: {
      previoustrack: function () { advanceVocabFlashcard(-1); },
      nexttrack: function () { advanceVocabFlashcard(1); },
      play: function () { setVocabAutoNext(true); },
      pause: function () { setVocabAutoNext(false); }
    },
    playbackState: function () { return state.ui.vocabFlashcardAutoNext ? "playing" : "paused"; },
    onChange: function () {
      syncVocabPipBtn();
      syncVocabPipClip();
    }
  });

  function applyVocabPipBtnState(btn) {
    var active = vocabPip.isActive();
    btn.classList.toggle("vocab-flashcard-pip-btn--active", active);
    btn.title = active
      ? "Đóng cửa sổ PiP"
      : "Mở cửa sổ nổi PiP cho danh sách đang học (trong cửa sổ PiP: ⏮ ⏭ chuyển từ, ⏯ bật/tắt Auto)";
  }

  function syncVocabPipBtn() {
    document.querySelectorAll(".vocab-flashcard-pip-btn").forEach(applyVocabPipBtnState);
  }

  /** Gọi mỗi lần render flashcard để cửa sổ PiP luôn hiện đúng thẻ đang học */
  function updateVocabPip(item, pos, total) {
    vocabPipCurrent = { item: item, pos: pos, total: total };
    vocabPip.redraw();
    syncVocabPipClip();
  }

  // ----- PiP Flashcard + Auto: dựng sẵn 1 video cả danh sách, mỗi từ giữ đúng số giây Auto -----
  // Video tự chạy nên vẫn chuyển từ khi trang bị treo (iOS chuyển app / khoá màn hình, tab nền bị hãm timer).
  var VOCAB_PIP_CLIP_MAX_WORDS = 200; // danh sách dài hơn thì dựng 200 từ tính từ từ đang học
  var vocabPipClip = null; // { base, start, count, total, secs } — video đang phát
  var vocabPipClipJob = null; // video đang dựng (cùng dạng)
  var vocabPipClipFailed = false; // trình duyệt không dựng được → dùng timer như cũ

  /** Vị trí của từ pos (trong danh sách lọc) bên trong video c, -1 nếu không có */
  function vocabPipClipOffset(c, pos) {
    var off = (pos - c.start + c.total) % c.total;
    return off < c.count ? off : -1;
  }

  function stopVocabPipClip() {
    vocabPipClipJob = null;
    if (!vocabPipClip) return;
    vocabPipClip = null;
    vocabPip.stopClip();
    scheduleVocabAutoNextTimer();
  }

  /** Gọi mỗi khi thẻ / danh sách / tuỳ chọn Auto / trạng thái PiP đổi: dựng, tua hoặc bỏ video cho khớp */
  function syncVocabPipClip() {
    var want = !vocabPipClipFailed && isPipClipSupported() && vocabPip.isActive() &&
      state.ui.vocabFlashcardAutoNext && state.ui.vocabViewMode === "flashcard";
    var filtered = want ? applyVocabFilters() : [];
    if (!filtered.length) {
      stopVocabPipClip();
      return;
    }
    var pos = state.ui.vocabFlashcardIndex;
    var secs = getVocabAutoNextDelayMs() / 1000;
    var base = secs + "|" + JSON.stringify(state.displaySettings) + "|" +
      filtered.map(function (r) { return vocabData.indexOf(r); }).join(",");

    var c = vocabPipClip;
    if (c && c.base === base && vocabPipClipOffset(c, pos) >= 0) {
      vocabPipClipJob = null;
      // Cùng video: người dùng tự chuyển từ thì tua video tới đúng từ đó
      var off = vocabPipClipOffset(c, pos);
      if (Math.floor(vocabPip.clipTime() / secs) !== off) vocabPip.seekClip(off * secs + 0.05);
      return;
    }
    var job = vocabPipClipJob;
    if (job && job.base === base && vocabPipClipOffset(job, pos) >= 0) return; // đang dựng đúng video này

    var total = filtered.length;
    var count = Math.min(total, VOCAB_PIP_CLIP_MAX_WORDS);
    job = { base: base, start: total > count ? pos : 0, count: count, total: total, secs: secs };
    vocabPipClipJob = job;
    var raws = [];
    for (var k = 0; k < count; k++) raws.push(filtered[(job.start + k) % total]);

    encodePipClip(VOCAB_PIP_W, VOCAB_PIP_H, count, secs, function (ctx, k) {
      var saved = vocabPipCurrent;
      vocabPipCurrent = { item: buildVocabPipItem(raws[k]), pos: (job.start + k) % total, total: total };
      drawVocabPip(ctx, VOCAB_PIP_W, VOCAB_PIP_H);
      vocabPipCurrent = saved;
    }, function () {
      return vocabPipClipJob !== job;
    }).then(function (blob) {
      if (!blob || vocabPipClipJob !== job) return;
      vocabPipClipJob = null;
      if (!vocabPip.isActive() || !state.ui.vocabFlashcardAutoNext) return;
      var off = vocabPipClipOffset(job, state.ui.vocabFlashcardIndex);
      vocabPipClip = job;
      clearVocabAutoNextTimer(); // từ giờ video tự chuyển từ
      vocabPip.playClip(URL.createObjectURL(blob), Math.max(0, off) * secs + 0.05, {
        onTime: onVocabPipClipTime,
        onPause: function () { setVocabAutoNext(false); }
      });
    }).catch(function (err) {
      if (vocabPipClipJob !== job) return;
      vocabPipClipJob = null;
      vocabPipClipFailed = true;
      console.warn("PiP: không dựng được video danh sách, dùng timer", err);
    });
  }

  /** Video chạy tới từ nào thì flashcard trong trang đi theo từ đó */
  function onVocabPipClipTime(t) {
    var c = vocabPipClip;
    if (!c || vocabPipClipJob || state.ui.vocabViewMode !== "flashcard") return;
    var off = Math.min(c.count - 1, Math.floor(t / c.secs));
    var pos = (c.start + off) % c.total;
    if (pos === state.ui.vocabFlashcardIndex) return;
    var filtered = applyVocabFilters();
    if (!filtered[pos]) return;
    state.ui.vocabFlashcardIndex = pos;
    state.ui.vocabFlashcardFlipped = false;
    saveVocabViewState(vocabData.indexOf(filtered[pos]));
    renderVocabList();
  }

  function drawVocabPip(ctx, W, H) {
    var pad = 24;
    var cur = vocabPipCurrent;
    var item = cur.item;
    var ds = state.displaySettings;
    var pal = getPipPalette();

    // Màu theo theme trong style.css (Warm Paper / Tắt đèn)
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.textBaseline = "middle";

    // Thanh trên: vị trí trong danh sách + trạng thái Auto
    ctx.font = "700 22px " + PIP_FONT_UI;
    if (cur.total) {
      ctx.textAlign = "left";
      ctx.fillStyle = pal.muted;
      ctx.fillText((cur.pos + 1) + " / " + cur.total, pad, 34);
    }
    if (state.ui.vocabFlashcardAutoNext) {
      ctx.textAlign = "right";
      ctx.fillStyle = pal.primary;
      ctx.fillText("⏱ Auto " + Math.round(getVocabAutoNextDelayMs() / 1000) + "s", W - pad, 34);
    }

    if (!item) {
      ctx.textAlign = "center";
      ctx.font = "26px " + PIP_FONT_UI;
      ctx.fillStyle = pal.muted;
      ctx.fillText("Không có từ vựng phù hợp với bộ lọc hiện tại.", W / 2, H / 2);
      return;
    }

    // Hiện đủ 2 mặt thẻ (trong PiP không lật được), theo tuỳ chọn hiển thị
    var blocks = [];
    if (ds.hiragana && item.hiragana) blocks.push({ text: item.hiragana, size: 96, weight: 700, family: PIP_FONT_JP, color: pal.text });
    if (ds.kanji && item.kanji) blocks.push({ text: "(" + item.kanji + ")", size: 72, weight: 600, family: PIP_FONT_JP, color: pal.kanji });
    if (ds.romaji && item.romaji) blocks.push({ text: "(" + item.romaji + ")", size: 32, family: PIP_FONT_UI, color: pal.muted });
    var frontCount = blocks.length;
    if (ds.meaning && item.meaning) blocks.push({ text: item.meaning, size: 56, weight: 600, family: PIP_FONT_UI, color: pal.text });
    if (ds.hanviet && item.kanji && window.getHanViet) {
      var hv = window.getHanViet(item.kanji);
      if (hv) blocks.push({ text: "[" + hv + "]", size: 36, family: PIP_FONT_UI, color: pal.accent });
    }
    if (frontCount > 0 && blocks.length > frontCount) {
      blocks.splice(frontCount, 0, { divider: true, size: 24 });
    }

    // Chừa thanh trên và dòng bài học phía dưới
    var top = 60;
    var areaH = H - 48 - top;
    var fit = fitCanvasBlocks(ctx, blocks, W - pad * 2, areaH);
    drawCanvasLines(ctx, fit.lines, W / 2, top + Math.max(0, (areaH - fit.height) / 2), 280);

    var meta = [];
    if (ds.lesson && item.lesson) meta.push("Bài " + item.lesson);
    if (ds.type && item.type) meta.push(item.type);
    if (meta.length) {
      ctx.font = "20px " + PIP_FONT_UI;
      ctx.fillStyle = pal.muted;
      ctx.fillText(meta.join(" · "), W / 2, H - 26);
    }
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

    const wrapper = createElement("div", "test-result test-config-form", "");

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
    select.value = state.testState.selectedCategory || "all";

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

    // Setting: đọc từ vựng bằng TTS sau khi chọn đáp án
    const readAfterAnswerField = createElement("div", "field-group", "");
    const readAfterAnswerLabel = createElement("div", "field-label", "Đọc từ vựng sau khi chọn đáp án");
    const readAfterAnswerInput = createElement("input", "", "");
    readAfterAnswerInput.checked = state.testState.readAfterAnswer !== false;
    readAfterAnswerInput.type = 'checkbox';
    readAfterAnswerInput.style = 'text-align: left';
    readAfterAnswerInput.id = "vocab-test-read-after-answer";
    readAfterAnswerField.appendChild(readAfterAnswerLabel);
    readAfterAnswerField.appendChild(readAfterAnswerInput);
    configGrid.appendChild(readAfterAnswerField);

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
      var readAfterAnswer = readAfterAnswerInput.checked || false;

      var pool = vocabData.filter(function (raw) {
        if (!raw) {
          return false;
        }
        if (isVocabHidden(raw)) {
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
        return String(raw.category) === String(selectedCat);
      });

      const questions = pickVocabTestQueue(pool, questionCount);
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
      state.testState.readAfterAnswer = readAfterAnswer;
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
      if (isVocabHidden(v)) {
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
      return String(v.category) === String(selectedCategory);
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

  /** Các mục (không trùng) của những câu sai trong `answers`, lấy theo answer[field] — dùng cho nút "Ôn lại câu sai". */
  function collectWrongItems(answers, field) {
    var items = [];
    (answers || []).forEach(function (a) {
      var item = a && !a.isCorrect ? a[field] : null;
      if (item && items.indexOf(item) === -1) items.push(item);
    });
    return items;
  }

  function createRetryWrongButton(count, onClick) {
    var btn = createElement("button", "btn", "🔁 Ôn lại " + count + " câu sai");
    btn.type = "button";
    btn.addEventListener("click", onClick);
    return btn;
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
    const wrongItems = collectWrongItems(testState.answers, "raw");
    if (wrongItems.length > 0) {
      btnRow.appendChild(createRetryWrongButton(wrongItems.length, function () {
        startVocabRetryWrong(wrongItems);
      }));
    }
    // Ôn hôm nay: còn từ đến hạn thì cho ôn tiếp lượt sau; Ôn lại chưa thuộc: làm lượt mới; còn lại về màn hình cấu hình
    var restartLabel = "Làm lại test";
    var restartFn = startVocabTest;
    if (testState.mode === "daily") {
      var remainingDue = getVocabDailyDueList().length;
      if (remainingDue > 0) {
        restartLabel = "📅 Ôn tiếp (" + remainingDue + " từ)";
        restartFn = startVocabDailyReview;
      }
    } else if (testState.mode === "review") {
      restartFn = startVocabReviewTest;
    } else if (testState.mode === "daily-set") {
      restartFn = startDailySetTest;
    }
    const retryBtn = createElement("button", wrongItems.length > 0 ? "btn-ghost" : "btn", restartLabel);
    retryBtn.type = "button";
    retryBtn.addEventListener("click", function () {
      restartFn();
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

  // ----- Test ghép từ (chọn tile hiragana ghép thành từ đúng) -----
  var assembleProcessing = false;

  function buildAssembleTilesForQuestion(rawQuestion, pool) {
    var hira = rawQuestion.hiragana != null ? rawQuestion.hiragana : rawQuestion.Hiragana;
    var correctTiles = splitHiraganaTiles(hira);
    var bag = correctTiles.map(function (t, i) {
      return { id: "c" + i, text: t };
    });

    var extrasNeeded = Math.min(6, Math.max(2, Math.ceil(correctTiles.length / 2)));
    var otherWords = shuffleArray((pool || []).filter(function (v) { return v !== rawQuestion; }));
    var extraTiles = [];
    otherWords.forEach(function (v) {
      var h = v.hiragana != null ? v.hiragana : v.Hiragana;
      splitHiraganaTiles(h).forEach(function (t) {
        extraTiles.push(t);
      });
    });
    extraTiles = shuffleArray(extraTiles);
    for (var i = 0; i < extraTiles.length && bag.length < correctTiles.length + extrasNeeded; i += 1) {
      bag.push({ id: "e" + i, text: extraTiles[i] });
    }
    return shuffleArray(bag);
  }

  function applyVocabScreenDefaultsToAssembleTestState() {
    var screenFrom = parseInt(state.filter.vocabLessonFrom, 10);
    var screenTo = parseInt(state.filter.vocabLessonTo, 10);
    state.assembleTestState.lessonMin = isNaN(screenFrom) ? 1 : screenFrom;
    state.assembleTestState.lessonMax = isNaN(screenTo) ? 50 : screenTo;
    state.assembleTestState.selectedCategory = state.filter.vocabCategory || "all";
  }

  function startAssembleTest() {
    var ts = state.assembleTestState;
    ts.isActive = false;
    ts.isFinished = false;
    ts.questions = [];
    ts.currentIndex = 0;
    ts.correctCount = 0;
    ts.answers = [];
    ts.builtIndex = -1;
    ts.tileBag = [];
    ts.selectedIds = [];
    applyVocabScreenDefaultsToAssembleTestState();
    ts.questionCount = 20;
    renderAssembleTestInitialMessage();
  }

  function renderAssembleTestInitialMessage() {
    var ts = state.assembleTestState;
    const wrapper = createElement("div", "test-result test-config-form", "");
    const configGrid = createElement("div", "test-config-fields", "");

    const lessonMinField = createElement("div", "field-group", "");
    lessonMinField.appendChild(createElement("div", "field-label", "Từ bài"));
    const lessonMinInput = createElement("input", "input-text", "");
    lessonMinInput.type = "number";
    lessonMinInput.min = 1;
    lessonMinInput.max = 999;
    lessonMinInput.value = String(ts.lessonMin != null ? ts.lessonMin : 1);
    lessonMinInput.id = "vocab-assemble-lesson-min";
    lessonMinField.appendChild(lessonMinInput);
    configGrid.appendChild(lessonMinField);

    const lessonMaxField = createElement("div", "field-group", "");
    lessonMaxField.appendChild(createElement("div", "field-label", "Đến bài"));
    const lessonMaxInput = createElement("input", "input-text", "");
    lessonMaxInput.type = "number";
    lessonMaxInput.min = 1;
    lessonMaxInput.max = 999;
    lessonMaxInput.value = String(ts.lessonMax != null ? ts.lessonMax : 50);
    lessonMaxInput.id = "vocab-assemble-lesson-max";
    lessonMaxField.appendChild(lessonMaxInput);
    configGrid.appendChild(lessonMaxField);

    const catField = createElement("div", "field-group", "");
    catField.appendChild(createElement("div", "field-label", "Category"));
    const catSelect = createElement("select", "", "");
    catSelect.id = "vocab-assemble-category-select";
    var optAll = createElement("option", "", "Tất cả");
    optAll.value = "all";
    catSelect.appendChild(optAll);
    var categories = getUniqueSorted(
      vocabData.map(function (v) { return v.category; }).filter(function (c) { return c; })
    );
    categories.forEach(function (cat) {
      const opt = createElement("option", "", getCategoryLabel(cat));
      opt.value = cat;
      catSelect.appendChild(opt);
    });
    catSelect.value = ts.selectedCategory || "all";
    catField.appendChild(catSelect);
    configGrid.appendChild(catField);

    const qCountField = createElement("div", "field-group", "");
    qCountField.appendChild(createElement("div", "field-label", "Số câu hỏi (5–50)"));
    const qCountInput = createElement("input", "input-text", "");
    qCountInput.type = "number";
    qCountInput.min = 5;
    qCountInput.max = 50;
    qCountInput.value = String(ts.questionCount != null ? ts.questionCount : 20);
    qCountInput.id = "vocab-assemble-question-count";
    qCountField.appendChild(qCountInput);
    configGrid.appendChild(qCountField);

    const sStarField = createElement("div", "field-group", "");
    sStarField.appendChild(createElement("div", "field-label", "Chỉ test từ vựng có ★"));
    const sStarInput = createElement("input", "", "");
    sStarInput.type = "checkbox";
    sStarInput.checked = !!ts.isStar;
    sStarInput.style = "text-align: left";
    sStarInput.id = "vocab-assemble-star";
    sStarField.appendChild(sStarInput);
    configGrid.appendChild(sStarField);

    const sNotMasteredField = createElement("div", "field-group", "");
    sNotMasteredField.appendChild(createElement("div", "field-label", "Chỉ test từ chưa thuộc"));
    const sNotMasteredInput = createElement("input", "", "");
    sNotMasteredInput.type = "checkbox";
    sNotMasteredInput.checked = !!ts.isNotMastered;
    sNotMasteredInput.style = "text-align: left";
    sNotMasteredInput.id = "vocab-assemble-not-mastered";
    sNotMasteredField.appendChild(sNotMasteredInput);
    configGrid.appendChild(sNotMasteredField);

    const showKanjiField = createElement("div", "field-group", "");
    showKanjiField.appendChild(createElement("div", "field-label", "Hiện Kanji của từ (nếu có)"));
    const showKanjiInput = createElement("input", "", "");
    showKanjiInput.type = "checkbox";
    showKanjiInput.checked = ts.showKanji !== false;
    showKanjiInput.style = "text-align: left";
    showKanjiInput.id = "vocab-assemble-show-kanji";
    showKanjiField.appendChild(showKanjiInput);
    configGrid.appendChild(showKanjiField);

    const readAfterAnswerField = createElement("div", "field-group", "");
    readAfterAnswerField.appendChild(createElement("div", "field-label", "Đọc từ vựng sau khi trả lời"));
    const readAfterAnswerInput = createElement("input", "", "");
    readAfterAnswerInput.type = "checkbox";
    readAfterAnswerInput.checked = ts.readAfterAnswer !== false;
    readAfterAnswerInput.style = "text-align: left";
    readAfterAnswerInput.id = "vocab-assemble-read-after-answer";
    readAfterAnswerField.appendChild(readAfterAnswerInput);
    configGrid.appendChild(readAfterAnswerField);

    wrapper.appendChild(configGrid);

    const hintEl = createElement(
      "div",
      "test-question-sub",
      "Ghép các mảnh hiragana theo đúng thứ tự để tạo thành từ. Bấm ⚡ nếu muốn xem đáp án đúng. " +
      "Lưu ý: từ nào Kanji bị sai (chỉ là hiragana/katakana) sẽ luôn tự động ẩn Kanji dù có bật hiển thị."
    );
    wrapper.appendChild(hintEl);

    const btnRow = createElement("div", "btn-row", "");
    const startBtn = createElement("button", "btn", "Bắt đầu");
    startBtn.type = "button";
    startBtn.addEventListener("click", function () {
      var lessonMin = parseInt(lessonMinInput.value, 10);
      if (isNaN(lessonMin) || lessonMin < 1) {
        lessonMin = 1;
      }
      var lessonMax = parseInt(lessonMaxInput.value, 10);
      if (isNaN(lessonMax) || lessonMax < lessonMin) {
        lessonMax = 999;
      }
      var selectedCat = catSelect.value || "all";
      var questionCount = parseInt(qCountInput.value, 10);
      if (isNaN(questionCount) || questionCount < 5) {
        questionCount = 5;
      }
      if (questionCount > 50) {
        questionCount = 50;
      }
      var isStar = !!sStarInput.checked;
      var isNotMastered = !!sNotMasteredInput.checked;
      var showKanji = !!showKanjiInput.checked;
      var readAfterAnswer = !!readAfterAnswerInput.checked;

      var pool = vocabData.filter(function (raw) {
        if (!raw) {
          return false;
        }
        if (isVocabHidden(raw)) {
          return false;
        }
        var idx = vocabData.indexOf(raw);
        if (isStar && !state.vocabFavorites[idx]) {
          return false;
        }
        if (isNotMastered && state.vocabMastered[idx]) {
          return false;
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
        return String(raw.category) === String(selectedCat);
      });

      var questions = pickVocabTestQueue(pool, questionCount);
      if (questions.length === 0) {
        alert("Không có từ vựng phù hợp (phạm vi bài " + lessonMin + "–" + lessonMax + " và category đã chọn).");
        return;
      }

      var ts2 = state.assembleTestState;
      ts2.isActive = true;
      ts2.isFinished = false;
      ts2.questions = questions;
      ts2.currentIndex = 0;
      ts2.correctCount = 0;
      ts2.answers = [];
      ts2.selectedCategory = selectedCat;
      ts2.lessonMin = lessonMin;
      ts2.lessonMax = lessonMax;
      ts2.questionCount = questionCount;
      ts2.isStar = isStar;
      ts2.isNotMastered = isNotMastered;
      ts2.showKanji = showKanji;
      ts2.readAfterAnswer = readAfterAnswer;
      ts2.builtIndex = -1;
      ts2.tileBag = [];
      ts2.selectedIds = [];
      ts2._pool = pool;
      renderAssembleTestQuestion();
    });

    const cancelBtn = createElement("button", "btn-ghost", "Đóng");
    cancelBtn.type = "button";
    cancelBtn.addEventListener("click", function () {
      closeDetailModal();
    });

    btnRow.appendChild(startBtn);
    btnRow.appendChild(cancelBtn);
    wrapper.appendChild(btnRow);

    openDetailModal("Ghép từ (Hiragana)", "");
    detailModalState.bodyEl.innerHTML = "";
    detailModalState.bodyEl.appendChild(wrapper);
  }

  function renderAssembleTestQuestion() {
    var ts = state.assembleTestState;
    if (!ts.isActive || ts.questions.length === 0) {
      renderAssembleTestInitialMessage();
      return;
    }
    if (ts.isFinished || ts.currentIndex >= ts.questions.length) {
      renderAssembleTestResult();
      return;
    }

    var rawQuestion = ts.questions[ts.currentIndex];
    if (!rawQuestion) {
      renderAssembleTestInitialMessage();
      return;
    }

    var hiragana = rawQuestion.hiragana != null ? rawQuestion.hiragana : rawQuestion.Hiragana;
    var kanji = rawQuestion.kanji != null ? rawQuestion.kanji : rawQuestion.Kanji;
    var meaning = rawQuestion.meaning != null ? rawQuestion.meaning : rawQuestion.Meaning;
    var correctTiles = splitHiraganaTiles(hiragana);

    if (ts.builtIndex !== ts.currentIndex) {
      ts.tileBag = buildAssembleTilesForQuestion(rawQuestion, ts._pool || vocabData);
      ts.selectedIds = [];
      ts.revealedFrom = null;
      ts.builtIndex = ts.currentIndex;
      ts.currentAttempts = 0;
      ts.currentRevealed = false;
    }

    // Chỉ hiện Kanji khi config bật VÀ chuỗi Kanji thực sự chứa Hán tự
    // (nếu Kanji chỉ toàn hiragana/katakana thì đó là data sai, luôn ẩn)
    var canShowKanji = !!(ts.showKanji && kanji && hasRealKanjiChar(kanji));

    var questionWrapper = createElement("div", "test-question", "");

    var header = createElement("div", "test-question-header", "");
    header.appendChild(createElement("div", "", "Câu " + (ts.currentIndex + 1) + " / " + ts.questions.length));
    header.appendChild(createElement("div", "", "Đã đúng: " + ts.correctCount));
    questionWrapper.appendChild(header);

    var qMain = createElement("div", "test-question-main", "");
    if (canShowKanji) {
      qMain.appendChild(createElement("div", "test-question-text", kanji));
      qMain.appendChild(createElement("div", "test-question-sub", meaning || ""));
    } else {
      qMain.appendChild(createElement("div", "test-question-text", meaning || ""));
    }
    var progressBarOuter = createElement("div", "test-progress", "");
    var progressInner = createElement("div", "test-progress-bar", "");
    progressInner.style.width = ((ts.currentIndex / ts.questions.length) * 100).toFixed(2) + "%";
    progressBarOuter.appendChild(progressInner);
    qMain.appendChild(progressBarOuter);
    questionWrapper.appendChild(qMain);

    // Hàng đáp án: dấu ⚡ (gợi ý, không viền/nền) nằm bên trái, cùng hàng với các ô ghép từ
    var answerWrap = createElement("div", "assemble-answer-wrap", "");

    var revealBtn = createElement("button", "assemble-reveal-btn", "⚡");
    revealBtn.type = "button";
    revealBtn.title = "Gợi ý: hiện đáp án đúng để tham khảo (không tự qua câu tiếp theo)";
    revealBtn.addEventListener("click", function () {
      if (assembleProcessing) {
        return;
      }
      revealAssembleAnswer();
    });
    answerWrap.appendChild(revealBtn);

    // Các ô đã chọn theo thứ tự - bấm vào để bỏ chọn lại (kể cả khi đang hiện gợi ý)
    var answerRow = createElement("div", "assemble-answer-row", "");
    ts.selectedIds.forEach(function (chosenId, slotIdx) {
      var chosenTile = ts.tileBag.filter(function (t) { return t.id === chosenId; })[0];
      var isHintTile = ts.revealedFrom != null && slotIdx >= ts.revealedFrom;
      var slotClass = "assemble-slot assemble-slot--filled" + (isHintTile ? " assemble-slot--revealed" : "");
      var slotBtn = createElement("button", slotClass, chosenTile ? chosenTile.text : "");
      slotBtn.type = "button";
      slotBtn.addEventListener("click", function () {
        if (assembleProcessing) {
          return;
        }
        ts.selectedIds.splice(slotIdx, 1);
        ts.revealedFrom = null;
        renderAssembleTestQuestion();
      });
      answerRow.appendChild(slotBtn);
    });
    for (var emptySlot = ts.selectedIds.length; emptySlot < correctTiles.length; emptySlot += 1) {
      answerRow.appendChild(createElement("button", "assemble-slot", ""));
    }
    answerWrap.appendChild(answerRow);
    // Spacer vô hình cùng kích thước với nút ⚡ để hàng đáp án thực sự nằm chính giữa
    var answerSpacer = createElement("div", "assemble-reveal-spacer", "");
    answerWrap.appendChild(answerSpacer);
    questionWrapper.appendChild(answerWrap);

    // Danh sách các mảnh hiragana đề xuất để chọn
    var poolGrid = createElement("div", "assemble-tile-pool", "");
    ts.tileBag.forEach(function (tile) {
      var used = ts.selectedIds.indexOf(tile.id) !== -1;
      var tileBtn = createElement("button", "assemble-tile" + (used ? " assemble-tile--used" : ""), tile.text);
      tileBtn.type = "button";
      tileBtn.disabled = used;
      tileBtn.addEventListener("click", function () {
        if (assembleProcessing || used) {
          return;
        }
        if (ts.selectedIds.length >= correctTiles.length) {
          return;
        }
        ts.selectedIds.push(tile.id);
        renderAssembleTestQuestion();
        if (ts.selectedIds.length === correctTiles.length) {
          checkAssembleAnswer();
        }
      });
      poolGrid.appendChild(tileBtn);
    });
    questionWrapper.appendChild(poolGrid);

    if (detailModalState.bodyEl) {
      openDetailModal("Ghép từ (Hiragana)", "");
      detailModalState.bodyEl.innerHTML = "";
      detailModalState.bodyEl.appendChild(questionWrapper);
    }
  }

  // Khi ghép đủ ô: đúng thì mới qua câu tiếp theo, sai thì reset để làm lại tại chỗ (bắt buộc phải đúng mới qua)
  function checkAssembleAnswer() {
    if (assembleProcessing) {
      return;
    }
    var ts = state.assembleTestState;
    var rawQuestion = ts.questions[ts.currentIndex];
    var hiragana = rawQuestion.hiragana != null ? rawQuestion.hiragana : rawQuestion.Hiragana;
    var selectedText = ts.selectedIds.map(function (id) {
      var t = ts.tileBag.filter(function (x) { return x.id === id; })[0];
      return t ? t.text : "";
    }).join("");

    if (selectedText === hiragana) {
      assembleProcessing = true;
      finishAssembleQuestion(hiragana, rawQuestion);
    } else {
      ts.currentAttempts = (ts.currentAttempts || 0) + 1;
      flashAssembleWrongThenReset();
    }
  }

  /** Ghép sai: rung nhẹ để báo sai rồi tự xoá các ô đã chọn cho user ghép lại, không qua câu tiếp theo */
  function flashAssembleWrongThenReset() {
    assembleProcessing = true;
    var ts = state.assembleTestState;
    var answerRow = detailModalState.bodyEl
      ? detailModalState.bodyEl.querySelector(".assemble-answer-row")
      : null;
    if (answerRow) {
      answerRow.classList.add("assemble-answer-row--wrong");
    }
    setTimeout(function () {
      ts.selectedIds = [];
      ts.revealedFrom = null;
      assembleProcessing = false;
      renderAssembleTestQuestion();
    }, 500);
  }

  /** Nút ⚡: chớp gợi ý đáp án đúng trong 1 giây rồi tự ẩn lại — không tính điểm và KHÔNG tự qua
   * câu tiếp theo. Những ô user đã xếp ĐÚNG từ trước (tính theo prefix liên tục từ đầu) được giữ
   * nguyên cả trong lúc chớp lẫn sau khi ẩn; chỉ phần còn thiếu/sai mới bị coi là gợi ý và bị xoá lại. */
  function revealAssembleAnswer() {
    if (assembleProcessing) {
      return;
    }
    var ts = state.assembleTestState;
    var rawQuestion = ts.questions[ts.currentIndex];
    var hiragana = rawQuestion.hiragana != null ? rawQuestion.hiragana : rawQuestion.Hiragana;
    ts.currentRevealed = true;
    var correctTiles = splitHiraganaTiles(hiragana);
    var correctIds = ts.tileBag
      .filter(function (t) { return t.id.charAt(0) === "c"; })
      .sort(function (a, b) { return parseInt(a.id.slice(1), 10) - parseInt(b.id.slice(1), 10); })
      .map(function (t) { return t.id; });

    // Xác định phần prefix user đã chọn đúng liên tục từ đầu (dừng lại ở ô đầu tiên sai/còn trống)
    var prefixLen = 0;
    while (prefixLen < correctTiles.length) {
      var curId = ts.selectedIds[prefixLen];
      var curTile = curId ? ts.tileBag.filter(function (t) { return t.id === curId; })[0] : null;
      if (!curTile || curTile.text !== correctTiles[prefixLen]) {
        break;
      }
      prefixLen += 1;
    }
    var keptIds = ts.selectedIds.slice(0, prefixLen);

    ts.selectedIds = keptIds.concat(correctIds.slice(prefixLen));
    ts.revealedFrom = prefixLen;
    assembleProcessing = true;
    renderAssembleTestQuestion();

    var builtIndexAtReveal = ts.builtIndex;
    setTimeout(function () {
      // Chỉ ẩn lại nếu vẫn đang ở đúng câu hỏi lúc bấm ⚡ (chưa bị xoá/next bởi thao tác khác)
      if (ts.builtIndex === builtIndexAtReveal) {
        ts.selectedIds = keptIds;
        ts.revealedFrom = null;
      }
      assembleProcessing = false;
      renderAssembleTestQuestion();
    }, 1000);
  }

  function finishAssembleQuestion(hiragana, rawQuestion) {
    var ts = state.assembleTestState;
    var attempts = ts.currentAttempts || 0;
    var revealed = !!ts.currentRevealed;
    // Chỉ tính là đúng khi ghép đúng ngay lần đầu và không xem gợi ý ⚡
    var isCleanCorrect = attempts === 0 && !revealed;
    if (isCleanCorrect) {
      ts.correctCount += 1;
    }

    applyMasteryTestResult(getVocabDupKey(rawQuestion), "assemble", {
      attempts: attempts,
      revealedAnswer: revealed
    });

    var kanji = rawQuestion.kanji != null ? rawQuestion.kanji : rawQuestion.Kanji;
    var meaning = rawQuestion.meaning != null ? rawQuestion.meaning : rawQuestion.Meaning;
    var qLabelParts = [String(hiragana || "")];
    if (kanji && hasRealKanjiChar(kanji)) {
      qLabelParts.push("(" + kanji + ")");
    }
    if (meaning) {
      qLabelParts.push("– " + meaning);
    }
    ts.answers.push({
      questionWord: qLabelParts.join(" "),
      correctMeaning: hiragana,
      isCorrect: isCleanCorrect,
      attempts: attempts,
      revealed: revealed,
      raw: rawQuestion
    });

    if (hiragana && ts.readAfterAnswer !== false) {
      speakJapanese(hiragana, null);
    }

    setTimeout(function () {
      assembleProcessing = false;
      if (ts.currentIndex < ts.questions.length - 1) {
        ts.currentIndex += 1;
        renderAssembleTestQuestion();
      } else {
        ts.isFinished = true;
        renderAssembleTestResult();
      }
    }, 700);
  }

  function renderAssembleTestResult() {
    var ts = state.assembleTestState;
    var total = ts.questions.length;
    var score = ts.correctCount;
    var percent = total > 0 ? (score / total) * 100 : 0;
    var wrongList = ts.answers.filter(function (a) { return !a.isCorrect; });
    var correctList = ts.answers.filter(function (a) { return a.isCorrect; });

    var wrapper = createElement("div", "test-result", "");
    wrapper.appendChild(createElement("div", "score-main", score + " / " + total));
    wrapper.appendChild(createElement("div", "score-detail", "Hoàn thành bài ghép từ. Số câu phải ghép lại / xem gợi ý: " + wrongList.length + "."));

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
    wrapper.appendChild(createElement("div", "score-detail", commentText));

    var btnRow = createElement("div", "btn-row", "");
    var wrongItems = collectWrongItems(ts.answers, "raw");
    if (wrongItems.length > 0) {
      btnRow.appendChild(createRetryWrongButton(wrongItems.length, function () {
        startAssembleRetryWrong(wrongItems);
      }));
    }
    var retryBtn = createElement("button", wrongItems.length > 0 ? "btn-ghost" : "btn", "Làm lại");
    retryBtn.type = "button";
    retryBtn.addEventListener("click", function () {
      startAssembleTest();
    });
    btnRow.appendChild(retryBtn);
    wrapper.appendChild(btnRow);

    if (wrongList.length > 0) {
      wrapper.appendChild(createElement("div", "card-subtitle", "Danh sách câu sai:"));
      var wrongContainer = createElement("div", "wrong-list", "");
      wrongList.forEach(function (w) {
        var item = createElement("div", "wrong-item", "");
        item.appendChild(createElement("div", "wrong-q", w.questionWord));
        var correct = createElement("div", "wrong-a wrong-a--correct", "Đáp án đúng: ");
        correct.appendChild(createElement("span", "", w.correctMeaning));
        var noteParts = [];
        if (w.attempts > 0) noteParts.push("ghép sai " + w.attempts + " lần");
        if (w.revealed) noteParts.push("đã xem gợi ý ⚡");
        var selected = createElement("div", "wrong-a wrong-a--selected", "Ghi chú: ");
        selected.appendChild(createElement("span", "", noteParts.join(", ")));
        item.appendChild(correct);
        item.appendChild(selected);
        wrongContainer.appendChild(item);
      });
      wrapper.appendChild(wrongContainer);
    }

    if (correctList.length > 0) {
      wrapper.appendChild(createElement("div", "card-subtitle", "Danh sách câu đúng:"));
      var correctContainer = createElement("div", "wrong-list", "");
      correctList.forEach(function (c) {
        var item = createElement("div", "wrong-item", "");
        item.appendChild(createElement("div", "wrong-q", c.questionWord));
        var ansRow = createElement("div", "wrong-a wrong-a--correct", "Đáp án: ");
        ansRow.appendChild(createElement("span", "", c.correctMeaning));
        item.appendChild(ansRow);
        correctContainer.appendChild(item);
      });
      wrapper.appendChild(correctContainer);
    }

    openDetailModal("Ghép từ (Hiragana)", "");
    detailModalState.bodyEl.innerHTML = "";
    detailModalState.bodyEl.appendChild(wrapper);
  }

  /** "Ôn lại câu sai" của bài ghép từ: giữ nguyên cấu hình + pool ô nhiễu của lượt trước. */
  function startAssembleRetryWrong(questions) {
    var ts = state.assembleTestState;
    ts.isActive = true;
    ts.isFinished = false;
    ts.questions = shuffleArray(questions);
    ts.currentIndex = 0;
    ts.correctCount = 0;
    ts.answers = [];
    ts.builtIndex = -1;
    ts.tileBag = [];
    ts.selectedIds = [];
    renderAssembleTestQuestion();
  }

  function setupAssembleTestSection() {
    var startBtn = document.getElementById("start-vocab-assemble-btn");
    if (startBtn) {
      startBtn.addEventListener("click", function () {
        startAssembleTest();
      });
    }
  }

  /** Menu lưới dùng chung cho cả Vocab và Kanji: mỗi mode = { icon, label, hint? (chuỗi hoặc hàm trả về chuỗi), isReview?, triggerId? | action() }. */
  function openTestModeMenu(title, modes) {
    var grid = createElement("div", "test-mode-grid");
    modes.forEach(function (mode) {
      var card = createElement("button", "test-mode-card" + (mode.isReview ? " test-mode-card--review" : ""));
      card.type = "button";
      card.appendChild(createElement("div", "test-mode-card__icon", mode.icon));
      card.appendChild(createElement("div", "test-mode-card__label", mode.label));
      var hint = typeof mode.hint === "function" ? mode.hint() : mode.hint;
      if (hint) {
        card.appendChild(createElement("div", "test-mode-card__hint", hint));
      }
      card.addEventListener("click", function () {
        closeDetailModal();
        if (typeof mode.action === "function") {
          mode.action();
          return;
        }
        var triggerBtn = document.getElementById(mode.triggerId);
        if (triggerBtn) {
          triggerBtn.click();
        }
      });
      grid.appendChild(card);
    });
    openDetailModal(title, grid);
  }

  var VOCAB_TEST_MODES = [
    { icon: "🔤", label: "Chọn đáp án", hint: "Trắc nghiệm 20 câu", triggerId: "start-vocab-test-btn" },
    { icon: "🔗", label: "Mapping", hint: "Nối từ - nghĩa", triggerId: "start-vocab-mapping-btn" },
    { icon: "🧩", label: "Ghép từ", hint: "Chọn hiragana ghép từ", triggerId: "start-vocab-assemble-btn" },
    {
      icon: "📅", label: "Ôn hôm nay", isReview: true,
      hint: function () {
        var dueCount = getVocabDailyDueList().length;
        return dueCount ? dueCount + " từ đến hạn ôn" : "Không có từ đến hạn";
      },
      action: function () { startVocabDailyReview(); }
    },
    { icon: "🔁", label: "Ôn lại từ chưa thuộc", hint: "Từ có điểm dưới 60", action: function () { startVocabReviewTest(); }, isReview: true }
  ];

  function openVocabTestModeMenu() {
    openTestModeMenu("Chọn kiểu test từ vựng", VOCAB_TEST_MODES);
  }

  function setupVocabTestModeMenu() {
    var openBtn = document.getElementById("open-vocab-test-menu-btn");
    if (openBtn) {
      openBtn.addEventListener("click", function () {
        openVocabTestModeMenu();
      });
    }
  }

  var KANJI_TEST_MODES = [
    { icon: "🈁", label: "Test Kanji", hint: "Trắc nghiệm On/Kun/Hán Việt", triggerId: "start-kanji-test-btn" },
    { icon: "🔗", label: "Mapping", hint: "Nối Kanji - Hán Việt / từ vựng", triggerId: "start-kanji-mapping-btn" },
    { icon: "🔁", label: "Ôn lại Kanji chưa thuộc", hint: "Kanji→Hán Việt / Từ vựng→Nghĩa", action: function () { startKanjiReviewTest(); }, isReview: true }
  ];

  function openKanjiTestModeMenu() {
    openTestModeMenu("Chọn kiểu test Kanji", KANJI_TEST_MODES);
  }

  function setupKanjiTestModeMenu() {
    var openBtn = document.getElementById("open-kanji-test-menu-btn");
    if (openBtn) {
      openBtn.addEventListener("click", function () {
        openKanjiTestModeMenu();
      });
    }
  }

  /** FAB góc dưới-phải (tab Vocab/Kanji): bấm nút tròn để xổ danh sách thao tác,
   *  chỉ thu lại khi bấm lại nút tròn (bấm item / bấm ra ngoài vẫn giữ menu mở). */
  function setupFabMenus() {
    document.querySelectorAll(".fab-menu").forEach(function (menu) {
      var toggle = menu.querySelector(".fab-menu__toggle");
      if (!toggle) return;
      toggle.addEventListener("click", function () {
        var open = menu.classList.toggle("fab-menu--open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Đóng danh sách thao tác" : "Mở danh sách thao tác");
      });
    });
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
      var pipBtn = null;
      if (isCanvasPipSupported()) {
        pipBtn = createElement("button", "kd-mazii-link kd-pip-link", "PiP");
        pipBtn.type = "button";
        pipBtn.setAttribute("data-kanji-index", String(globalIndex));
        applyKanjiPipBtnState(pipBtn);
        // Gắn sẵn stream vào video từ lúc nút hiện, để lúc bấm video đã có metadata (Safari cần gọi PiP ngay trong click)
        kanjiPip.warm();
        pipBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          toggleKanjiPip(globalIndex);
        });
      }
      var openWriteBtn = createElement("button", "kd-writing-toggle-btn", "✏️");
      openWriteBtn.type = "button";
      openWriteBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openKanjiPracticeModal(item.kanji);
      });
      heroActions.appendChild(maziiLink);
      heroActions.appendChild(jdictLink);
      if (pipBtn) heroActions.appendChild(pipBtn);
      heroActions.appendChild(openWriteBtn);
    }
    var kanjiStt = raw.stt != null ? raw.stt : (globalIndex + 1);
    var indexLabel = createElement("div", "kd-index", "" + kanjiStt);
    var indexRow = createElement("div", "kd-index-row", "");
    indexRow.appendChild(indexLabel);
    if (raw.level) {
      var levelLabel = createElement("div", "kd-index kd-index--level", String(raw.level).toUpperCase());
      indexRow.appendChild(levelLabel);
    }
    var kanjiEl = createElement("div", "kd-char", item.kanji);
    var meaningBadge = createElement("div", "kd-meaning-badge", item.core_meaning || "");
    var hanvietEl = createElement("div", "kd-hanviet", item.hanviet || "");
    var heroMain = createElement("div", "kd-hero-main", "");
    var heroMeta = createElement("div", "kd-hero-meta", "");
    heroMain.appendChild(indexRow);
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

    // Kanji Breakdown: sơ đồ cây phân rã đệ quy + câu chuyện/logic/mẹo nhớ đi kèm
    var breakdownParts = String(item.radicals || "")
      .split("|")
      .map(function (p) { return p.trim(); })
      .filter(Boolean);
    var hasStoryContent =
      (item.story_image && String(item.story_image).trim()) ||
      (item.logic_development && String(item.logic_development).trim()) ||
      (item.memory_tip && String(item.memory_tip).trim());
    var hasTree = breakdownParts.length > 0 && breakdownParts.some(function (p) {
      var dashIdx = p.indexOf("-");
      var c = dashIdx === -1 ? p : p.slice(0, dashIdx).trim();
      return c !== item.kanji;
    });

    if (hasTree || hasStoryContent) {
      var secBreak = createElement("div", "kd-section kd-section--amber", "");
      var breakToggle = createElement("button", "kd-breakdown-toggle", "");
      breakToggle.type = "button";
      var breakToggleLabel = createElement("span", "kd-breakdown-toggle-label", "🧩 Phân rã Kanji");
      var breakToggleIcon = createElement("span", "kd-breakdown-toggle-icon", "▸");
      breakToggle.appendChild(breakToggleLabel);
      breakToggle.appendChild(breakToggleIcon);
      var breakBody = createElement("div", "kd-breakdown-body kd-breakdown-body--collapsed", "");
      breakToggle.setAttribute("aria-expanded", "false");
      breakToggle.addEventListener("click", function () {
        var collapsed = breakBody.classList.toggle("kd-breakdown-body--collapsed");
        breakToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
        breakToggleIcon.textContent = collapsed ? "▸" : "▾";
      });
      secBreak.appendChild(breakToggle);
      secBreak.appendChild(breakBody);

      function goToKanjiIndex(idx) {
        if (idx === -1 || idx === state.selected.kanjiIndex) return;
        if (state.selected.kanjiIndex != null) {
          state.kanjiHistory.push(state.selected.kanjiIndex);
        }
        state.selected.kanjiIndex = idx;
        renderKanjiDetail();
      }

      // Sơ đồ cây: kanji gốc -> các thành phần -> đệ quy xuống thành phần con của chúng
      function parseRadicalsField(radicalsStr) {
        return String(radicalsStr || "")
          .split("|")
          .map(function (p) { return p.trim(); })
          .filter(Boolean)
          .map(function (p) {
            var dashIdx = p.indexOf("-");
            return {
              char: dashIdx === -1 ? p : p.slice(0, dashIdx).trim(),
              hv: dashIdx === -1 ? "" : p.slice(dashIdx + 1).trim(),
            };
          });
      }

      function buildTreeNode(char, hv, depth, ancestors) {
        var node = createElement("div", "kd-tree-node", "");
        var box = createElement("div", "kd-tree-box", "");
        var compIdx = findKanjiIndexByChar(char);
        var entry = compIdx !== -1 ? kanjiData[compIdx] : null;
        var label = entry ? (entry.core_meaning || hv) : hv;

        box.appendChild(createElement("div", "kd-tree-char", char));
        if (label) box.appendChild(createElement("div", "kd-tree-label", label));

        if (entry && !readOnly && char !== item.kanji) {
          box.classList.add("kd-tree-box--clickable");
          box.title = "Xem chi tiết " + char;
          box.addEventListener("click", function (e) {
            e.stopPropagation();
            goToKanjiIndex(compIdx);
          });
        }
        node.appendChild(box);

        var canonical = entry ? entry.kanji : char;
        var canRecurse = entry && depth < 4 && ancestors.indexOf(canonical) === -1;
        if (canRecurse) {
          var children = parseRadicalsField(entry.radicals).filter(function (c) {
            return c.char !== canonical; // bỏ bộ thủ tự-quy chiếu (kanji gốc là chính nó)
          });
          if (children.length) {
            var childrenWrap = createElement("div", "kd-tree-children", "");
            children.forEach(function (c) {
              childrenWrap.appendChild(buildTreeNode(c.char, c.hv, depth + 1, ancestors.concat(canonical)));
            });
            node.appendChild(childrenWrap);
          }
        }
        return node;
      }

      if (hasTree) {
        var treeWrap = createElement("div", "kd-tree-wrap", "");
        treeWrap.appendChild(buildTreeNode(item.kanji, item.hanviet, 0, []));
        breakBody.appendChild(treeWrap);
      }

      function addStoryRow(icon, label, text, linkify) {
        var raw = text ? String(text).trim() : "";
        if (!raw) return;
        var row = createElement("div", "kd-story-row", "");
        row.appendChild(createElement("div", "kd-story-icon", icon));
        var body = createElement("div", "kd-story-body", "");
        body.appendChild(createElement("div", "kd-story-label", label));
        var valueEl = createElement("div", "kd-story-value", "");
        if (linkify) {
          valueEl.innerHTML = linkifyKanjiText(raw, item.kanji);
          if (!readOnly) {
            valueEl.addEventListener("click", function (e) {
              var target = e.target;
              if (target && target.classList.contains("kd-inline-kanji-link")) {
                var idx = parseInt(target.getAttribute("data-kanji-index"), 10);
                if (!isNaN(idx)) goToKanjiIndex(idx);
              }
            });
          }
        } else {
          valueEl.textContent = raw;
        }
        body.appendChild(valueEl);
        row.appendChild(body);
        breakBody.appendChild(row);
      }

      addStoryRow("📖", "Câu chuyện ghi nhớ", item.story_image, false);
      addStoryRow("🔗", "Diễn giải cấu tạo", item.logic_development, true);
      addStoryRow("💡", "Mẹo nhớ", item.memory_tip, false);

      targetEl.appendChild(secBreak);
    }

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
      sec4.appendChild(createElement("div", "kd-section-title", "📚 Từ vựng ứng dụng"));
      var vocabList = createElement("div", "kd-vocab-list", "");

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

        var wordMatch = String(parts[0] || "").match(/^(.+?)\((.+?)\)$/);
        var wordOnly = (wordMatch ? wordMatch[1] : (parts[0] || "")).trim();
        var wordReading = wordMatch ? wordMatch[2] : "";
        var wordMeaning = parts[1] || "";
        var wordHanViet = window.getHanViet ? window.getHanViet(wordOnly) : "";

        var row = createElement("div", "kd-vocab-row", "");
        var rowMain = createElement("div", "kd-vocab-main", "");
        var rowHeadline = createElement("div", "kd-vocab-headline", "");
        var wordEl = createElement("span", "kd-vocab-word", "");
        if (readOnly) {
          wordEl.textContent = wordOnly;
        } else {
          wordEl.innerHTML = linkifyKanjiText(wordOnly, item.kanji);
        }
        rowHeadline.appendChild(wordEl);
        rowHeadline.appendChild(createElement("span", "kd-vocab-read", wordReading ? "(" + wordReading + ")" : ""));
        if (wordHanViet) {
          rowHeadline.appendChild(createElement("span", "kd-vocab-hanviet", wordHanViet));
        }
        rowMain.appendChild(rowHeadline);
        rowMain.appendChild(createElement("div", "kd-vocab-mean", wordMeaning));
        row.appendChild(rowMain);
        var rowActions = createElement("div", "kd-vocab-actions", "");

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
          rowActions.appendChild(rowStarBtn);
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

        if (wordOnly) {
          rowActions.appendChild(createAudioBtn(wordOnly));
        }
        rowActions.appendChild(createAddVocab(wordOnly, wordReading, wordMeaning));
        row.appendChild(rowActions);

        vocabList.appendChild(row);
      });

      if (vocabList.children.length > 0) {
        sec4.appendChild(vocabList);
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

  // ----- PiP chi tiết Kanji: mở ngay trong trang, đi theo chữ Kanji đang xem -----
  var kanjiPipIndex = null; // index trong kanjiData đang hiện trong PiP
  var kanjiPip = createCanvasPip({
    name: "kanji",
    width: 810,
    height: 1000,
    draw: drawKanjiPip,
    actions: {
      previoustrack: function () { advanceKanjiPip(-1); },
      nexttrack: function () { advanceKanjiPip(1); }
    },
    onChange: syncKanjiPipBtn
  });

  function applyKanjiPipBtnState(btn) {
    var active = kanjiPip.isActive() && String(kanjiPipIndex) === btn.getAttribute("data-kanji-index");
    btn.classList.toggle("kd-pip-link--active", active);
    btn.title = active
      ? "Đóng cửa sổ PiP"
      : "Mở cửa sổ nổi PiP cho chữ Kanji này (trong cửa sổ PiP: ⏮ ⏭ chuyển chữ)";
  }

  function syncKanjiPipBtn() {
    document.querySelectorAll(".kd-pip-link").forEach(applyKanjiPipBtnState);
  }

  function toggleKanjiPip(kanjiIndex) {
    if (kanjiPip.isActive() && kanjiPipIndex === kanjiIndex) {
      kanjiPip.exit();
      return;
    }
    kanjiPipIndex = kanjiIndex;
    if (kanjiPip.isActive()) {
      kanjiPip.redraw();
      syncKanjiPipBtn();
    } else {
      kanjiPip.open();
    }
  }

  function isKanjiDetailModalOpen() {
    return !!state.ui.detailModal.isOpen && !!detailModalState.bodyEl &&
      !!detailModalState.bodyEl.querySelector(".kd-detail-content:not(.kd-detail-content--test-reveal)");
  }

  /** ⏮ ⏭ trong PiP: chuyển chữ trước/sau trong danh sách đang lọc (giống nút ‹ › của chi tiết Kanji) */
  function advanceKanjiPip(delta) {
    var filtered = applyKanjiFilter();
    var pos = filtered.findIndex(function (r) {
      return kanjiData.indexOf(r) === kanjiPipIndex;
    });
    var target = pos >= 0 ? filtered[pos + delta] : null;
    if (!target) return;
    var idx = kanjiData.indexOf(target);
    if (isKanjiDetailModalOpen()) {
      // Chi tiết đang mở thì chuyển luôn trong trang (renderKanjiDetail cũng cập nhật PiP)
      state.kanjiHistory = [];
      state.selected.kanjiIndex = idx;
      renderKanjiDetail();
    } else {
      kanjiPipIndex = idx;
      kanjiPip.redraw();
    }
  }

  function drawKanjiPip(ctx, W, H) {
    var pal = getPipPalette();
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, W, H);
    var raw = kanjiPipIndex != null ? kanjiData[kanjiPipIndex] : null;
    if (!raw) return;

    // Phần đầu gọn: chữ Kanji bên trái, Hán Việt / nghĩa / cách đọc bên phải → nhường chỗ cho từ vựng
    var pad = 28;
    var kanjiW = 250;
    var headH = 250;
    var colX = pad + kanjiW + pad;
    var colW = W - colX - pad;

    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = pal.text;
    ctx.font = "700 220px " + PIP_FONT_JP;
    ctx.fillText(raw.kanji, pad + kanjiW / 2, pad + headH / 2);

    var readings = [raw.on_reading, raw.kun_reading].map(function (r) {
      return String(r || "").replace(/\|/g, "、").trim();
    }).filter(Boolean);
    var info = [];
    if (raw.hanviet) info.push({ text: raw.hanviet, size: 68, weight: 700, family: PIP_FONT_UI, color: pal.primary, gap: 4 });
    if (raw.core_meaning) info.push({ text: raw.core_meaning, size: 40, weight: 600, family: PIP_FONT_UI, color: pal.text, gap: 8 });
    if (readings.length) info.push({ text: readings.join(" | "), size: 42, family: PIP_FONT_JP, color: pal.reading });
    var infoFit = fitCanvasBlocks(ctx, info, colW, headH);
    // Căn giữa cả ngang lẫn dọc trong cột bên phải
    drawCanvasLines(ctx, infoFit.lines, colX + colW / 2, pad + Math.max(0, (headH - infoFit.height) / 2), 0);

    // Vạch ngang tách phần đầu với từ vựng
    var lineY = pad + headH + 14;
    ctx.strokeStyle = pal.rule;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(pad, lineY);
    ctx.lineTo(W - pad, lineY);
    ctx.stroke();

    // Phần còn lại: từ vựng, chữ to, căn trái
    var vocabs = parseKanjiVocab(raw.vocabulary).filter(function (v) {
      return v.word && v.word.toLowerCase() !== "không có";
    });
    if (!vocabs.length) return;
    var vb = vocabs.map(function (v) {
      return {
        text: v.word + (v.reading ? "(" + v.reading + ")" : "") + (v.meaning ? " — " + v.meaning : ""),
        size: 44, family: PIP_FONT_JP, color: pal.text, gap: 12
      };
    });
    var vTop = lineY + 18;
    var vFit = fitCanvasBlocks(ctx, vb, W - pad * 2, H - vTop - pad);
    drawCanvasLines(ctx, vFit.lines, pad, vTop, 0, "left");
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

    // PiP Kanji đang mở thì đi theo chữ đang xem
    if (kanjiPip.isActive() && kanjiPipIndex !== state.selected.kanjiIndex) {
      kanjiPipIndex = state.selected.kanjiIndex;
      kanjiPip.redraw();
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
    syncKanjiDetailQuery();
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
      if (state.filter.checkboxGrammarN3 === true) {
        if (item.Type != 'n3') {
          return false;
        }
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

  // ----- Tab "Từ trùng" -----
  var dupTabCache = []; // [{ hiragana, entries: [{ key, checkbox }] }]

  /** Sinh nội dung file data/dup.js mới từ trạng thái ẩn hiện tại (nền tảng dup.js + override cục bộ). */
  function buildDupFileContent() {
    var allKeys = {};
    Object.keys(state.vocabHiddenBaseline).forEach(function (k) { allKeys[k] = true; });
    Object.keys(state.vocabHidden).forEach(function (k) { allKeys[k] = true; });

    var finalEntries = Object.keys(allKeys)
      .filter(function (k) { return isKeyHidden(k); })
      .map(function (k) { return parseVocabDupKey(k); })
      .sort(function (a, b) {
        if (a.Hiragana !== b.Hiragana) return a.Hiragana.localeCompare(b.Hiragana);
        if (a.Kanji !== b.Kanji) return a.Kanji.localeCompare(b.Kanji);
        return a.Meaning.localeCompare(b.Meaning);
      });

    var lines = finalEntries.map(function (e) {
      return "  " + JSON.stringify(e) + ",";
    });

    return [
      "// Danh sách từ vựng bị ẩn do trùng (baseline dùng chung cho mọi máy, được commit vào git).",
      "// KHÔNG sửa tay từng dòng ở đây — hãy vào tab \"Từ trùng\" trong app, tick/bỏ tick các từ cần ẩn,",
      "// bấm nút \"Copy dup.js\", rồi dán đè toàn bộ nội dung file này và commit lại.",
      "//",
      "// localStorage trên từng máy chỉ lưu phần CHÊNH LỆCH so với file này (thêm ẩn hoặc bỏ ẩn),",
      "// nên khi export lại, mọi thay đổi cục bộ sẽ được gộp vào đây làm nền tảng chung.",
      "window._vocabDupHidden = [",
      lines.join("\n"),
      "];",
      ""
    ].join("\n");
  }

  function renderDupTab() {
    var container = document.getElementById("dup-list-container");
    var summaryEl = document.getElementById("dup-summary");
    var selectAllCb = document.getElementById("dup-select-all-cb");
    if (!container) {
      return;
    }

    var groups = getVocabDupGroups();
    container.innerHTML = "";
    dupTabCache = [];
    if (selectAllCb) {
      selectAllCb.checked = false;
    }

    var totalWords = 0;
    groups.forEach(function (g) { totalWords += g.items.length; });
    var allHiddenKeys = {};
    Object.keys(state.vocabHiddenBaseline).forEach(function (k) { allHiddenKeys[k] = true; });
    Object.keys(state.vocabHidden).forEach(function (k) { allHiddenKeys[k] = true; });
    var hiddenCount = Object.keys(allHiddenKeys).filter(function (k) {
      return isKeyHidden(k);
    }).length;
    if (summaryEl) {
      summaryEl.textContent = groups.length + " nhóm từ trùng cách viết (" + totalWords + " từ) · Đang ẩn " + hiddenCount + " từ (dup.js + cục bộ)";
    }

    if (groups.length === 0) {
      container.appendChild(createElement("div", "detail-empty", "Không tìm thấy từ vựng nào bị trùng cách viết (Hiragana)."));
      return;
    }

    groups.forEach(function (group) {
      var groupEl = createElement("div", "dup-group", "");
      groupEl.appendChild(createElement("div", "dup-group-head", group.hiragana + " (" + group.items.length + ")"));

      // Gộp các bản giống hệt nhau (cùng Hiragana+Kanji+Meaning) thành 1 dòng duy nhất:
      // việc ẩn/hiện áp dụng theo NỘI DUNG từ, nên các bản giống hệt luôn ẩn/hiện cùng nhau —
      // gộp lại để tránh hiểu nhầm là có thể ẩn riêng từng bản.
      var byKey = {};
      var keyOrder = [];
      group.items.forEach(function (raw) {
        var key = getVocabDupKey(raw);
        if (!byKey[key]) {
          byKey[key] = { raw: raw, count: 0 };
          keyOrder.push(key);
        }
        byKey[key].count += 1;
      });

      var groupEntries = [];
      keyOrder.forEach(function (key) {
        var info = byKey[key];
        var raw = info.raw;
        var kanji = getVocabKanji(raw);
        var meaning = getVocabMeaning(raw);
        var lesson = getVocabLessonValue(raw);

        var rowEl = createElement("label", "dup-row", "");
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "dup-row-cb";
        cb.checked = isKeyHidden(key);
        rowEl.appendChild(cb);
        var fromBaseline = !!state.vocabHiddenBaseline[key];
        rowEl.appendChild(createElement(
          "span",
          "dup-row-text",
          (kanji ? kanji + " · " : "") + (meaning || "(không có nghĩa)") + "  ·  Bài " + (lesson != null && lesson !== "" ? lesson : "?") +
          (info.count > 1 ? "  ·  ×" + info.count + " bản giống hệt" : "") +
          (fromBaseline ? "  ·  [dup.js]" : "")
        ));
        groupEl.appendChild(rowEl);

        groupEntries.push({ key: key, checkbox: cb });
      });

      dupTabCache.push({ hiragana: group.hiragana, entries: groupEntries });
      container.appendChild(groupEl);
    });
  }

  function setupDupTab() {
    var selectAllCb = document.getElementById("dup-select-all-cb");
    var saveBtn = document.getElementById("dup-save-btn");
    var scrollBottomBtn = document.getElementById("dup-scroll-bottom-btn");

    if (scrollBottomBtn) {
      scrollBottomBtn.addEventListener("click", function () {
        var container = document.getElementById("dup-list-container");
        if (container) {
          container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
        }
      });
    }

    var clearLocalBtn = document.getElementById("dup-clear-local-btn");
    if (clearLocalBtn) {
      clearLocalBtn.addEventListener("click", function () {
        var ok = window.confirm(
          "Xoá toàn bộ tuỳ chỉnh ẩn/hiện từ trùng đã lưu trên máy này (localStorage)?\n" +
          "Danh sách sẽ quay về đúng như nền tảng data/dup.js. Hành động này không xoá file data/dup.js."
        );
        if (!ok) {
          return;
        }
        state.vocabHidden = {};
        saveVocabHidden();
        renderDupTab();
        renderVocabList();
      });
    }

    if (selectAllCb) {
      selectAllCb.addEventListener("change", function () {
        if (selectAllCb.checked) {
          dupTabCache.forEach(function (group) {
            group.entries.forEach(function (entry, i) {
              entry.checkbox.checked = (i < group.entries.length - 1);
            });
          });
        } else {
          dupTabCache.forEach(function (group) {
            group.entries.forEach(function (entry) {
              entry.checkbox.checked = false;
            });
          });
        }
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        dupTabCache.forEach(function (group) {
          group.entries.forEach(function (entry) {
            var checked = entry.checkbox.checked;
            var inBaseline = !!state.vocabHiddenBaseline[entry.key];
            // Chỉ lưu vào localStorage phần CHÊNH LỆCH so với data/dup.js
            if (checked === inBaseline) {
              delete state.vocabHidden[entry.key];
            } else {
              state.vocabHidden[entry.key] = checked;
            }
          });
        });
        saveVocabHidden();
        renderDupTab();
        renderVocabList();
        alert("Đã lưu. Các từ đã ẩn sẽ không xuất hiện trong danh sách học/ôn tập nữa.");
      });
    }

    var exportBtn = document.getElementById("dup-export-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        var content = buildDupFileContent();
        copyTextToClipboard(content, function (ok) {
          if (ok) {
            alert("Đã copy nội dung data/dup.js vào clipboard. Dán đè vào file data/dup.js rồi commit.");
          } else {
            window.prompt("Không copy tự động được, hãy tự chọn & copy nội dung bên dưới:", content);
          }
        });
      });
    }
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

  // ----- Ôn tập mỗi ngày -----
  // Mỗi ngày tự chọn 1 bộ Kanji (có từ ví dụ) / từ vựng / ngữ pháp N4-N5 / ngữ pháp N3, số lượng theo cấu hình
  // (jp_daily_review_config). Bộ của ngày lưu theo khoá NỘI DUNG vào jp_daily_review:
  //   { date, keys: { phần: [khoá của hôm nay] }, history: { phần: [khoá đã học ở các ngày trước trong vòng hiện tại] },
  //     lastDayKeys: { phần: [khoá của ngày học gần nhất] } }
  // Trong ngày luôn hiện lại đúng bộ đó (đổi cấu hình thì bổ sung / bớt ngay trên bộ hôm nay);
  // sang ngày mới chỉ chọn mục chưa có trong history -> không trùng qua các ngày cho đến khi học hết pool,
  // lúc đó phần đó bắt đầu vòng mới.
  var DAILY_REVIEW_STORAGE_KEY = "jp_daily_review";
  var DAILY_REVIEW_CONFIG_KEY = "jp_daily_review_config";
  var DAILY_REVIEW_PART_DEFS = [
    { name: "kanji", label: "Kanji", defaultCount: 2, max: 20 },
    { name: "vocab", label: "Từ vựng", defaultCount: 20, max: 200 },
    { name: "grammarN45", label: "Ngữ pháp N4-N5", defaultCount: 1, max: 10 },
    { name: "grammarN3", label: "Ngữ pháp N3", defaultCount: 1, max: 10 }
  ];

  function isGrammarN3(raw) {
    return String(raw && raw.Type || "").toLowerCase() === "n3";
  }
  function getGrammarStructure(raw) {
    return String((raw && (raw.structure != null ? raw.structure : raw.Structure)) || "").trim();
  }
  function getGrammarDailyKey(raw) {
    var structure = getGrammarStructure(raw);
    if (!structure) return "";
    return (isGrammarN3(raw) ? "n3" : "n45") + "␟" + structure + "␟" + String(raw.Meaning || "").trim();
  }
  function getKanjiExamples(raw) {
    return parseKanjiVocab(raw && raw.vocabulary).filter(function (ve) { return ve.word; });
  }

  /** Số lượng mỗi phần theo cấu hình (thiếu/sai thì lấy mặc định, kẹp trong 0..max) */
  function getDailyReviewConfig() {
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(DAILY_REVIEW_CONFIG_KEY)) || {}; } catch (e) { }
    var config = {};
    DAILY_REVIEW_PART_DEFS.forEach(function (def) {
      var n = parseInt(saved[def.name], 10);
      config[def.name] = isNaN(n) ? def.defaultCount : Math.max(0, Math.min(def.max, n));
    });
    return config;
  }
  function saveDailyReviewConfig(config) {
    try { localStorage.setItem(DAILY_REVIEW_CONFIG_KEY, JSON.stringify(config)); } catch (e) { }
  }

  /** Pool nguồn của từng phần (mỗi khoá nội dung chỉ lấy 1 lần), kèm hàm lấy khoá */
  function getDailyReviewParts() {
    var pools = {
      kanji: {
        key: getKanjiDupKey,
        pool: kanjiData.filter(function (raw) { return raw && raw.kanji && getKanjiExamples(raw).length > 0; })
      },
      vocab: {
        key: getVocabDupKey,
        pool: vocabData.filter(function (raw) {
          return raw && !isVocabHidden(raw) && getVocabHiragana(raw) && getVocabMeaning(raw);
        })
      },
      grammarN45: {
        key: getGrammarDailyKey,
        pool: grammarData.filter(function (raw) { return raw && !isGrammarN3(raw); })
      },
      grammarN3: {
        key: getGrammarDailyKey,
        pool: grammarData.filter(function (raw) { return raw && isGrammarN3(raw); })
      }
    };
    return DAILY_REVIEW_PART_DEFS.map(function (def) {
      var byKey = {};
      var allKeys = [];
      pools[def.name].pool.forEach(function (raw) {
        var k = pools[def.name].key(raw);
        if (k && !Object.prototype.hasOwnProperty.call(byKey, k)) {
          byKey[k] = raw;
          allKeys.push(k);
        }
      });
      return { name: def.name, label: def.label, byKey: byKey, allKeys: allKeys };
    });
  }

  function toKeySet(list) {
    var set = {};
    (list || []).forEach(function (k) { set[k] = true; });
    return set;
  }

  function loadDailyReviewStore() {
    var store;
    try {
      store = JSON.parse(localStorage.getItem(DAILY_REVIEW_STORAGE_KEY));
    } catch (e) {
      return null;
    }
    if (!store || typeof store !== "object" || !store.keys) return null;
    store.history = store.history || {};
    // Dữ liệu bản cũ chỉ nhớ bộ của lần trước (prev) -> đưa vào history
    if (store.prev) {
      Object.keys(store.prev).forEach(function (name) {
        store.history[name] = mergeUniqueKeys(store.history[name], store.prev[name]);
      });
      delete store.prev;
    }
    return store;
  }
  function saveDailyReviewStore(store) {
    try { localStorage.setItem(DAILY_REVIEW_STORAGE_KEY, JSON.stringify(store)); } catch (e) { }
  }
  function mergeUniqueKeys(a, b) {
    var seen = toKeySet(a);
    var out = (a || []).slice();
    (b || []).forEach(function (k) {
      if (!seen[k]) {
        seen[k] = true;
        out.push(k);
      }
    });
    return out;
  }

  /**
   * Bộ ôn tập của hôm nay { kanji: [], vocab: [], grammarN45: [], grammarN3: [] } (raw data).
   * Gọi lại bất cứ lúc nào cũng được: chỉ thay đổi khi sang ngày mới, đổi cấu hình, hoặc có mục không còn trong data.
   */
  function getDailyReviewSet() {
    var today = masteryTodayStr();
    var config = getDailyReviewConfig();
    var store = loadDailyReviewStore();
    var changed = false;
    if (!store) {
      store = { date: today, keys: {}, history: {} };
      changed = true;
    } else if (store.date !== today) {
      // Kết thúc ngày cũ: bộ của ngày đó thành lịch sử, không được chọn lại
      Object.keys(store.keys).forEach(function (name) {
        store.history[name] = mergeUniqueKeys(store.history[name], store.keys[name]);
      });
      store.lastDayKeys = store.keys;
      store.keys = {};
      store.date = today;
      changed = true;
    }

    var result = {};
    getDailyReviewParts().forEach(function (part) {
      var count = config[part.name];
      var savedKeys = store.keys[part.name] || [];
      // Bỏ mục không còn trong data (bị xoá / ẩn), rồi bớt nếu cấu hình giảm
      var keys = savedKeys.filter(function (k) { return Object.prototype.hasOwnProperty.call(part.byKey, k); }).slice(0, count);
      if (keys.length < count) {
        var need = count - keys.length;
        var taken = toKeySet(keys);
        var learned = toKeySet(store.history[part.name]);
        var picked = shuffleArray(part.allKeys.filter(function (k) { return !taken[k] && !learned[k]; })).slice(0, need);
        if (picked.length < need) {
          // Đã học hết pool của phần này -> bắt đầu vòng mới; vẫn ưu tiên tránh bộ của ngày gần nhất
          store.history[part.name] = [];
          picked.forEach(function (k) { taken[k] = true; });
          var lastDay = toKeySet((store.lastDayKeys || {})[part.name]);
          var rest = part.allKeys.filter(function (k) { return !taken[k]; });
          var restFresh = shuffleArray(rest.filter(function (k) { return !lastDay[k]; }));
          var restLastDay = shuffleArray(rest.filter(function (k) { return lastDay[k]; }));
          picked = picked.concat(restFresh.concat(restLastDay).slice(0, need - picked.length));
        }
        keys = keys.concat(picked);
      }
      if (keys.join("\n") !== savedKeys.join("\n")) changed = true;
      store.keys[part.name] = keys;
      result[part.name] = keys.map(function (k) { return part.byKey[k]; });
    });
    if (changed) saveDailyReviewStore(store);
    return result;
  }

  /** Tiến độ vòng hiện tại của từng phần: đã học (các ngày trước + hôm nay) / tổng pool */
  function getDailyReviewProgress() {
    var store = loadDailyReviewStore() || { keys: {}, history: {} };
    return getDailyReviewParts().map(function (part) {
      var seen = toKeySet(mergeUniqueKeys(store.history[part.name], store.keys[part.name]));
      var done = part.allKeys.filter(function (k) { return seen[k]; }).length;
      return { name: part.name, label: part.label, done: done, total: part.allKeys.length };
    });
  }

  function formatDailyReviewDate() {
    var d = new Date();
    var weekdays = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    var dd = d.getDate(), mm = d.getMonth() + 1;
    return weekdays[d.getDay()] + ", " + (dd < 10 ? "0" : "") + dd + "/" + (mm < 10 ? "0" : "") + mm + "/" + d.getFullYear();
  }

  function createDailySectionTitle(text, count) {
    var title = createElement("div", "daily-section-title", text);
    if (count != null) title.appendChild(createElement("span", "chip", String(count)));
    return title;
  }

  function buildDailyKanjiCard(raw) {
    var kanjiIndex = kanjiData.indexOf(raw);
    var card = createElement("div", "daily-card daily-kanji-card", "");
    card.title = "Xem chi tiết Kanji";

    var head = createElement("div", "daily-kanji-head", "");
    head.appendChild(createElement("div", "daily-kanji-char", raw.kanji));
    var info = createElement("div", "daily-kanji-info", "");
    var hvRow = createElement("div", "daily-kanji-hanviet", raw.hanviet || "");
    hvRow.appendChild(createElement("span", "pill", raw.level === "n3" ? "N3" : "N4-N5"));
    info.appendChild(hvRow);
    if (raw.core_meaning) info.appendChild(createElement("div", "daily-kanji-meaning", raw.core_meaning));
    var readings = [];
    if (raw.on_reading) readings.push("On: " + String(raw.on_reading).split("|").join("・"));
    if (raw.kun_reading) readings.push("Kun: " + String(raw.kun_reading).split("|").join("・"));
    if (readings.length) info.appendChild(createElement("div", "daily-kanji-readings", readings.join("　")));
    head.appendChild(info);
    card.appendChild(head);

    var examples = createElement("div", "daily-kanji-examples", "");
    getKanjiExamples(raw).forEach(function (ve) {
      var row = createElement("div", "daily-kanji-example", "");
      var text = createElement("div", "daily-kanji-example-text", "");
      text.appendChild(createElement("span", "daily-kanji-example-word", ve.word));
      if (ve.reading) text.appendChild(createElement("span", "daily-kanji-example-reading", "(" + ve.reading + ")"));
      if (ve.meaning) text.appendChild(createElement("span", "daily-kanji-example-meaning", ve.meaning));
      row.appendChild(text);
      row.appendChild(createAudioBtn(ve.reading || ve.word));
      examples.appendChild(row);
    });
    card.appendChild(examples);

    card.addEventListener("click", function () {
      if (kanjiIndex < 0) return;
      state.kanjiHistory = [];
      state.selected.kanjiIndex = kanjiIndex;
      renderKanjiDetail();
    });
    return card;
  }

  function buildDailyVocabRow(raw, order) {
    var vocabIndex = vocabData.indexOf(raw);
    var hiragana = getVocabHiragana(raw);
    var kanji = getVocabRealKanji(raw);
    var lesson = getVocabLessonValue(raw);

    var row = createElement("div", "vocab-item daily-vocab-item", "");
    var top = createElement("div", "daily-vocab-top", "");
    top.appendChild(createElement("span", "daily-vocab-order", String(order)));
    var main = createElement("div", "daily-vocab-main", "");
    main.appendChild(createElement("span", "vocab-hira", hiragana));
    if (kanji) main.appendChild(createElement("span", "vocab-kanji", "(" + kanji + ")"));
    main.appendChild(createElement("span", "vocab-meaning", getVocabMeaning(raw)));
    top.appendChild(main);
    // 0 = chưa phân bài, 8888 / 9999 = nhóm từ thêm tay -> không phải bài thật, không hiện
    var lessonNum = parseInt(lesson, 10);
    if (lessonNum > 0 && lessonNum < 8888) top.appendChild(createElement("span", "pill pill--lesson", "Bài " + lessonNum));
    top.appendChild(createAudioBtn(hiragana));

    var isMastered = !!state.vocabMastered[vocabIndex];
    var masteredBtn = createElement("button", "mastered-btn" + (isMastered ? " mastered-btn--active" : ""), isMastered ? "✓" : "○");
    masteredBtn.type = "button";
    masteredBtn.title = isMastered ? "Đã thuộc — bấm để bỏ đánh dấu" : "Đánh dấu đã thuộc";
    masteredBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (vocabIndex < 0) return;
      if (state.vocabMastered[vocabIndex]) {
        delete state.vocabMastered[vocabIndex];
      } else {
        state.vocabMastered[vocabIndex] = true;
      }
      saveVocabMastered();
      var nowMastered = !!state.vocabMastered[vocabIndex];
      masteredBtn.textContent = nowMastered ? "✓" : "○";
      masteredBtn.title = nowMastered ? "Đã thuộc — bấm để bỏ đánh dấu" : "Đánh dấu đã thuộc";
      masteredBtn.classList.toggle("mastered-btn--active", nowMastered);
      renderVocabList();
    });
    top.appendChild(masteredBtn);
    row.appendChild(top);
    return row;
  }

  function buildDailyGrammarCard(raw) {
    var card = createElement("div", "daily-card daily-grammar-card", "");
    card.title = "Xem chi tiết ngữ pháp";
    var head = createElement("div", "daily-grammar-head", "");
    head.appendChild(createElement("span", "pill", isGrammarN3(raw) ? "N3" : "N4-N5"));
    head.appendChild(createElement("span", "daily-grammar-structure", getGrammarStructure(raw)));
    card.appendChild(head);
    if (raw.Meaning) {
      card.appendChild(createElement("div", "daily-grammar-meaning", String(raw.Meaning).split("\n").join(" ")));
    }
    var firstExample = splitGrammarExampleLines(raw.Example)[0];
    if (firstExample) {
      var ex = createElement("div", "daily-grammar-example", "");
      var match = firstExample.match(/^(.*?)\s*\[([^\]]*)\]\s*\(([^()]*)\)\s*$/);
      if (match) {
        ex.appendChild(createElement("div", "daily-grammar-example-jp", match[1].trim()));
        ex.appendChild(createElement("div", "daily-grammar-example-sub", match[2].trim()));
        ex.appendChild(createElement("div", "daily-grammar-example-sub", match[3].trim()));
      } else {
        ex.appendChild(createElement("div", "daily-grammar-example-jp", firstExample));
      }
      card.appendChild(ex);
    }
    card.addEventListener("click", function () {
      var idx = grammarData.indexOf(raw);
      if (idx < 0) return;
      state.selected.grammarIndex = idx;
      renderGrammarDetail();
    });
    return card;
  }

  function renderDailyReviewTab() {
    var container = document.getElementById("daily-review-container");
    if (!container) return;
    var set = getDailyReviewSet();
    state.dailyReviewDate = masteryTodayStr();
    state.dailyReviewVocab = set.vocab;

    var dateLabel = document.getElementById("daily-date-label");
    if (dateLabel) dateLabel.textContent = formatDailyReviewDate();

    container.innerHTML = "";

    if (set.kanji.length) {
      var kanjiSection = createElement("div", "daily-section", "");
      kanjiSection.appendChild(createDailySectionTitle("Kanji", set.kanji.length));
      var kanjiGrid = createElement("div", "daily-card-grid", "");
      set.kanji.forEach(function (raw) { kanjiGrid.appendChild(buildDailyKanjiCard(raw)); });
      kanjiSection.appendChild(kanjiGrid);
      container.appendChild(kanjiSection);
    }

    if (set.vocab.length) {
      var vocabSection = createElement("div", "daily-section", "");
      vocabSection.appendChild(createDailySectionTitle("Từ vựng", set.vocab.length));
      var vocabList = createElement("div", "daily-vocab-list", "");
      set.vocab.forEach(function (raw, i) { vocabList.appendChild(buildDailyVocabRow(raw, i + 1)); });
      vocabSection.appendChild(vocabList);
      container.appendChild(vocabSection);
    }

    var grammarItems = set.grammarN45.concat(set.grammarN3);
    if (grammarItems.length) {
      var grammarSection = createElement("div", "daily-section", "");
      grammarSection.appendChild(createDailySectionTitle("Ngữ pháp", grammarItems.length));
      var grammarGrid = createElement("div", "daily-card-grid", "");
      grammarItems.forEach(function (raw) { grammarGrid.appendChild(buildDailyGrammarCard(raw)); });
      grammarSection.appendChild(grammarGrid);
      container.appendChild(grammarSection);
    }

    if (!container.firstChild) {
      container.appendChild(createElement("div", "detail-empty", "Bộ ôn tập hôm nay đang trống. Bấm ⚙️ để chọn số lượng Kanji / từ vựng / ngữ pháp."));
    }

    var testBtn = document.getElementById("daily-test-btn");
    if (testBtn) testBtn.disabled = !set.vocab.length;
  }

  /** Modal ⚙️: chọn số lượng mỗi phần. Lưu xong áp dụng ngay cho hôm nay (tăng thì bổ sung, giảm thì bớt ở cuối). */
  function openDailyReviewConfig() {
    var config = getDailyReviewConfig();
    var progress = {};
    getDailyReviewProgress().forEach(function (p) { progress[p.name] = p; });

    var wrapper = createElement("div", "test-result test-config-form daily-config-form", "");
    var grid = createElement("div", "test-config-fields", "");
    var inputs = {};
    DAILY_REVIEW_PART_DEFS.forEach(function (def) {
      var field = createElement("div", "field-group", "");
      field.appendChild(createElement("div", "field-label", def.label + " (0–" + def.max + ")"));
      var input = createElement("input", "input-text", "");
      input.type = "number";
      input.min = 0;
      input.max = def.max;
      input.inputMode = "numeric";
      input.value = String(config[def.name]);
      input.id = "daily-config-" + def.name;
      field.appendChild(input);
      var p = progress[def.name];
      if (p) {
        field.appendChild(createElement("div", "daily-config-progress", "Vòng hiện tại: đã học " + p.done + " / " + p.total));
      }
      inputs[def.name] = input;
      grid.appendChild(field);
    });
    wrapper.appendChild(grid);
    wrapper.appendChild(createElement("div", "daily-config-note",
      "Lưu xong áp dụng ngay cho hôm nay: tăng thì bổ sung thêm, giảm thì bớt ở cuối danh sách. " +
      "Mục đã học ở các ngày trước sẽ không lặp lại cho đến khi học hết, sau đó phần đó bắt đầu vòng mới."));

    var btnRow = createElement("div", "btn-row", "");
    var saveBtn = createElement("button", "btn", "Lưu");
    saveBtn.type = "button";
    saveBtn.addEventListener("click", function () {
      var next = {};
      DAILY_REVIEW_PART_DEFS.forEach(function (def) {
        var n = parseInt(inputs[def.name].value, 10);
        next[def.name] = isNaN(n) ? config[def.name] : Math.max(0, Math.min(def.max, n));
      });
      saveDailyReviewConfig(next);
      closeDetailModal();
      renderDailyReviewTab();
    });
    var cancelBtn = createElement("button", "btn-ghost", "Đóng");
    cancelBtn.type = "button";
    cancelBtn.addEventListener("click", function () { closeDetailModal(); });
    btnRow.appendChild(saveBtn);
    btnRow.appendChild(cancelBtn);
    wrapper.appendChild(btnRow);

    openDetailModal("Cấu hình ôn tập mỗi ngày", wrapper);
  }

  /** Nút "📝 Test": trắc nghiệm Hiragana -> Nghĩa với đúng các từ vựng của bộ ôn tập hôm nay. */
  function startDailySetTest() {
    var set = getDailyReviewSet();
    if (!set.vocab.length) {
      alert("Chưa có từ vựng nào trong bộ ôn tập hôm nay.");
      return;
    }
    startVocabQuickChoiceTest("daily-set", shuffleArray(set.vocab));
  }

  function setupDailyReviewTab() {
    var testBtn = document.getElementById("daily-test-btn");
    if (testBtn) testBtn.addEventListener("click", startDailySetTest);
    var configBtn = document.getElementById("daily-config-btn");
    if (configBtn) configBtn.addEventListener("click", openDailyReviewConfig);
    // Để app mở qua đêm: quay lại màn hình mà đã sang ngày mới thì tự đổi bộ mới
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && state.currentTab === "daily" && state.dailyReviewDate !== masteryTodayStr()) {
        renderDailyReviewTab();
      }
    });
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

    openDetailModal("Chi tiết ngữ pháp", buildGrammarDetailNode(grammarData[state.selected.grammarIndex]));
  }

  /** Khối nội dung chi tiết 1 mẫu ngữ pháp (cấu trúc, ý nghĩa, giải thích, ví dụ) — dùng cho modal chi tiết và màn bài tập */
  function buildGrammarDetailNode(raw) {
    const item = {
      lesson: raw.lesson != null ? raw.lesson : raw.Lesson,
      structure: raw.structure != null ? raw.structure : raw.Structure,
      content: raw.Meaning,
      explain: raw.Explanation,
      example: raw.Example
    };
    const root = createElement("div", "grammar-detail", "");

    const structureRow = createElement("div", "grammar-structure-row", "");
    const structure = createElement("div", "grammar-structure", item.structure);
    structureRow.appendChild(structure);

    // Nút hỏi ChatGPT: giải thích mẫu ngữ pháp kèm nghĩa + ví dụ (trình độ N3)
    const gptPrompt =
      "Tôi đang học tiếng Nhật trình độ N3. Hãy giải thích chi tiết mẫu ngữ pháp 「" +
      String(item.structure || "").trim() + "」" +
      (item.content ? " (nghĩa: " + String(item.content).split("\n").join(" ").trim() + ")" : "") +
      " bằng tiếng Việt, gồm:\n" +
      "1. Ý nghĩa và sắc thái sử dụng\n" +
      "2. Cách kết hợp (cấu trúc với danh từ / động từ / tính từ)\n" +
      "3. 5 câu ví dụ trình độ N3, mỗi câu có: câu tiếng Nhật, cách đọc hiragana, nghĩa tiếng Việt\n" +
      "4. Lưu ý khi dùng và so sánh với các mẫu ngữ pháp dễ nhầm lẫn";
    const gptLink = document.createElement("a");
    gptLink.className = "kd-mazii-link grammar-gpt-link";
    gptLink.href = "https://chatgpt.com/?q=" + encodeURIComponent(gptPrompt);
    gptLink.target = "_blank";
    gptLink.rel = "noopener noreferrer";
    gptLink.title = "Hỏi ChatGPT về mẫu ngữ pháp này";
    gptLink.textContent = "Hỏi ChatGPT";
    structureRow.appendChild(gptLink);

    root.appendChild(structureRow);


    // Meaning section (inline "Ý nghĩa: xxxxx" — không tách header riêng)
    if (item.content) {
      const meaningSection = createElement("div", "grammar-section grammar-section--meaning grammar-section--inline", "");
      const meaningLine = createElement("div", "detail-value grammar-section__line grammar-section__line--inline", "");
      const meaningLabel = createElement("span", "grammar-section__title grammar-section__title--inline", "Ý nghĩa: ");
      meaningLine.appendChild(meaningLabel);
      meaningLine.appendChild(document.createTextNode(String(item.content).split("\n").join(" ")));
      meaningSection.appendChild(meaningLine);

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
      const explainLines = splitGrammarExampleLines(item.explain);
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
        const p = createElement(
            "div",
            "detail-value grammar-section__line grammar-section__line--example",
            ""
        );

        const match = line.match(/^(.*?)\s*\[([^\]]*)\]\s*\(([^()]*)\)\s*$/);

        if (match) {
            const [, japanese, reading, meaning] = match;

            p.innerHTML = `
                <div>${japanese.trim()}</div>
                <div>${reading.trim()}</div>
                <div>${meaning.trim()}</div>
            `;
        } else {
            p.textContent = line;
        }

        exampleBody.appendChild(p);

      });
      exampleSection.appendChild(exampleBody);

      root.appendChild(exampleSection);
    }

    return root;
  }

  // ----- Bài tập ngữ pháp (đề do ChatGPT sinh, dán lại vào app) -----
  // Luồng: chọn phạm vi → app bốc ngẫu nhiên số mẫu muốn làm, soạn prompt rồi mở ChatGPT
  // (prompt cũng được copy sẵn) → ChatGPT trả về khối JSON (đề dài thì có thể nhiều phần) → dán lại vào app để làm bài:
  //   - "order":  xem nghĩa tiếng Việt, xếp các cụm hiragana thành câu đúng (sai thì xếp lại tới khi đúng)
  //   - "choice": câu bị khuyết phần ngữ pháp, chọn 1 trong 4 đáp án (chọn xong luôn hiện đáp án đúng)
  // Xong mỗi câu đều hiện lại thông tin mẫu ngữ pháp. Cấu hình, đề đang chờ dán data và bộ bài đang làm
  // đều lưu localStorage để chuyển qua app ChatGPT rồi quay lại (kể cả khi trang bị tải lại) vẫn làm tiếp được.
  var GRAMMAR_EX_DEFAULT_COUNT = 10;
  /** Đề nhiều hơn số câu này thì dặn ChatGPT được trả làm nhiều phần (1 lần trả dài quá hay bị cắt giữa chừng) */
  var GRAMMAR_EX_SPLIT_THRESHOLD = 15;
  /** URL ?q= dài hơn mức này thì chỉ mở ChatGPT trống, người dùng tự dán prompt đã copy */
  var GRAMMAR_EX_URL_MAX = 12000;
  var GRAMMAR_EX_CONFIG_KEY = "jp_grammar_ex_config";
  var GRAMMAR_EX_PENDING_KEY = "jp_grammar_ex_pending";
  var GRAMMAR_EX_SESSION_KEY = "jp_grammar_ex_session";
  /** Đề đã tạo nhưng chưa dán data: quá hạn này thì mở bài tập sẽ về màn cấu hình thay vì màn dán data */
  var GRAMMAR_EX_PENDING_TTL = 24 * 60 * 60 * 1000;
  var GRAMMAR_EX_BLANK = "＿＿＿";
  var GRAMMAR_EX_LEVELS = [
    { value: "n45", label: "N4-N5 (Minna)", rangeLabel: "bài" },
    { value: "n3", label: "N3", rangeLabel: "STT" },
    { value: "filtered", label: "Theo danh sách đang lọc" }
  ];
  var GRAMMAR_EX_MODES = [
    { value: "mix", label: "Trộn 2 dạng" },
    { value: "order", label: "Chỉ sắp xếp câu" },
    { value: "choice", label: "Chỉ chọn đáp án" }
  ];
  var GRAMMAR_EX_TYPE_LABELS = { order: "Sắp xếp câu", choice: "Chọn đáp án" };

  /** session: bộ bài đang làm (lưu localStorage); q: trạng thái câu đang hiển thị (không lưu) */
  var grammarEx = { session: null, q: null };

  function loadGrammarExStore(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch (e) { return null; }
  }
  function saveGrammarExStore(key, value) {
    try {
      if (value == null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) { }
  }

  /** Id ổn định để ChatGPT trả lại & app tra ngược ra mẫu ngữ pháp: "N45-<STT>" / "N3-<STT>" */
  function getGrammarExId(raw) {
    return (isGrammarN3(raw) ? "N3-" : "N45-") + raw.STT;
  }
  function findGrammarByExId(id) {
    var key = String(id || "").trim().toUpperCase();
    if (!key) return null;
    for (var i = 0; i < grammarData.length; i++) {
      if (grammarData[i] && getGrammarExId(grammarData[i]) === key) return grammarData[i];
    }
    return null;
  }
  /** Số dùng để lọc phạm vi: N4-N5 theo số bài (Lesson), N3 không có Lesson nên theo STT */
  function getGrammarExRangeNumber(raw) {
    return parseInt(isGrammarN3(raw) ? raw.STT : (raw.lesson != null ? raw.lesson : raw.Lesson), 10);
  }
  function getGrammarExRangeMax(level) {
    var max = 0;
    grammarData.forEach(function (raw) {
      if (!raw || isGrammarN3(raw) !== (level === "n3")) return;
      var n = getGrammarExRangeNumber(raw);
      if (!isNaN(n) && n > max) max = n;
    });
    return max || 1;
  }
  function hasActiveGrammarFilter() {
    return state.filter.grammarLesson !== "all" || state.filter.checkboxGrammarN3 === true ||
      !!String(state.filter.grammarSearch || "").trim();
  }

  function loadGrammarExConfig() {
    var saved = loadGrammarExStore(GRAMMAR_EX_CONFIG_KEY) || {};
    var savedRanges = saved.ranges || {};
    var cfg = {
      level: GRAMMAR_EX_LEVELS.some(function (l) { return l.value === saved.level; }) ? saved.level : "n45",
      ranges: {},
      count: Math.max(1, parseInt(saved.count, 10) || GRAMMAR_EX_DEFAULT_COUNT),
      mode: GRAMMAR_EX_MODES.some(function (m) { return m.value === saved.mode; }) ? saved.mode : "mix",
      distractors: saved.distractors !== false,
      readAfter: saved.readAfter !== false
    };
    ["n45", "n3"].forEach(function (level) {
      var r = savedRanges[level] || {};
      var from = parseInt(r.from, 10);
      var to = parseInt(r.to, 10);
      cfg.ranges[level] = { from: isNaN(from) ? 1 : from, to: isNaN(to) ? getGrammarExRangeMax(level) : to };
    });
    // Đang lọc ở tab Ngữ pháp thì mặc định làm bài đúng danh sách đang lọc; hết lọc thì quay về N4-N5
    if (hasActiveGrammarFilter()) {
      cfg.level = "filtered";
    } else if (cfg.level === "filtered") {
      cfg.level = "n45";
    }
    return cfg;
  }

  function getGrammarExPool(cfg) {
    if (cfg.level === "filtered") {
      return applyGrammarFilter().filter(function (raw) { return !!getGrammarStructure(raw); });
    }
    var isN3 = cfg.level === "n3";
    var range = cfg.ranges[cfg.level];
    return grammarData.filter(function (raw) {
      if (!raw || isGrammarN3(raw) !== isN3 || !getGrammarStructure(raw)) return false;
      var n = getGrammarExRangeNumber(raw);
      return !isNaN(n) && n >= range.from && n <= range.to;
    });
  }

  /** Bốc ngẫu nhiên cfg.count mẫu trong phạm vi; chế độ trộn thì chia xen kẽ 2 dạng bài */
  function buildGrammarExPlan(pool, cfg) {
    return shuffleArray(pool).slice(0, cfg.count).map(function (raw, i) {
      return {
        id: getGrammarExId(raw),
        type: cfg.mode === "mix" ? (i % 2 === 0 ? "order" : "choice") : cfg.mode,
        structure: getGrammarStructure(raw),
        meaning: String(raw.Meaning || "").split("\n").join(" ").trim()
      };
    });
  }

  function buildGrammarExPrompt(plan, cfg) {
    var sampleOrder = plan.filter(function (p) { return p.type === "order"; })[0];
    var sampleChoice = plan.filter(function (p) { return p.type === "choice"; })[0];
    var lines = [
      "Bạn là giáo viên tiếng Nhật. Tạo " + plan.length + " bài tập ngữ pháp cho người Việt, mỗi dòng dưới đây là 1 bài, " +
      "câu của bài phải dùng đúng mẫu ngữ pháp của dòng đó (id N45 = trình độ N4-N5, N3 = trình độ N3; giữ nguyên id và dạng).",
      "",
      "id | dạng | mẫu ngữ pháp | nghĩa"
    ];
    plan.forEach(function (p) {
      lines.push(p.id + " | " + p.type + " | " + p.structure + " | " + p.meaning);
    });
    lines.push(
      "",
      "Yêu cầu chung:",
      "- Câu mới, tự nhiên, độ dài vừa phải, từ vựng đúng trình độ, thể hiện rõ mẫu ngữ pháp.",
      "- jp: câu hoàn chỉnh (kanji + kana, kết thúc bằng 。); kana: cả câu bằng hiragana (katakana cho từ ngoại lai); " +
      "vi: nghĩa tiếng Việt; explain: 1-2 câu tiếng Việt giải thích cách dùng mẫu ngữ pháp trong câu."
    );
    if (sampleOrder) {
      lines.push(
        "",
        "Dạng order (sắp xếp câu):",
        "- tiles: câu kana (bỏ 。) tách thành 4-8 cụm theo 文節 (trợ từ đi liền từ đứng trước), đúng thứ tự; nối tiles phải ra đúng kana.",
        "- Ưu tiên câu chỉ có 1 thứ tự đúng; nếu có thứ tự khác cũng tự nhiên thì thêm alt: [[tiles theo thứ tự đó]]."
      );
      if (cfg.distractors) {
        lines.push("- extra: 2 cụm gây nhiễu dễ nhầm (sai trợ từ hoặc sai cách chia), không dùng được trong câu đúng.");
      }
    }
    if (sampleChoice) {
      lines.push(
        "",
        "Dạng choice (chọn đáp án):",
        "- q: câu jp nhưng phần thể hiện mẫu ngữ pháp thay bằng " + GRAMMAR_EX_BLANK + "; qKana: cách đọc hiragana của q (giữ " + GRAMMAR_EX_BLANK + ").",
        "- options: 4 đáp án (1 đúng, 3 sai nhưng dễ nhầm: mẫu gần nghĩa hoặc chia sai); answer: chép y nguyên đáp án đúng trong options.",
        "- explain nói thêm ngắn gọn vì sao các đáp án còn lại sai."
      );
    }
    var samples = [];
    if (sampleOrder) {
      var orderSample = { id: sampleOrder.id, type: "order", jp: "", kana: "", vi: "", tiles: ["", ""] };
      if (cfg.distractors) orderSample.extra = ["", ""];
      orderSample.explain = "";
      samples.push(JSON.stringify(orderSample));
    }
    if (sampleChoice) {
      samples.push(JSON.stringify({
        id: sampleChoice.id, type: "choice", q: "", qKana: "", options: ["", "", "", ""], answer: "",
        jp: "", kana: "", vi: "", explain: ""
      }));
    }
    lines.push(
      "",
      "Chỉ trả về đúng 1 code block JSON (không viết gì ngoài code block), đủ " + plan.length + " phần tử, theo cấu trúc:",
      "{\"items\":[",
      samples.join(",\n"),
      "]}"
    );
    if (plan.length > GRAMMAR_EX_SPLIT_THRESHOLD) {
      lines.push(
        "Nếu không trả hết trong 1 lần: dừng ngay sau 1 phần tử trọn vẹn và đóng code block; khi tôi nhắn \"tiếp\" " +
        "thì trả các phần tử còn lại trong code block mới cùng cấu trúc {\"items\":[...]}."
      );
    }
    return lines.join("\n");
  }

  function getGrammarExChatGptUrl(prompt) {
    var url = "https://chatgpt.com/?q=" + encodeURIComponent(prompt);
    // URL quá dài có thể bị từ chối → chỉ mở ChatGPT, prompt đã được copy sẵn để dán tay
    return url.length > GRAMMAR_EX_URL_MAX ? "https://chatgpt.com/" : url;
  }
  function isGrammarExPromptPrefilled(prompt) {
    return getGrammarExChatGptUrl(prompt) !== "https://chatgpt.com/";
  }

  /** Copy đồng bộ (execCommand) trước: ngay sau đó mở tab ChatGPT làm trang mất focus, Clipboard API bất đồng bộ dễ bị từ chối */
  function copyGrammarExText(text, callback) {
    var ok = false;
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      ok = document.execCommand("copy");
      document.body.removeChild(ta);
    } catch (e) {
      ok = false;
    }
    if (ok) {
      if (callback) callback(true);
      return;
    }
    copyTextToClipboard(text, callback || function () { });
  }

  /** So đáp án bỏ qua khoảng trắng, dấu ～ và dấu câu (ChatGPT hay thêm/bớt những ký tự này) */
  function normalizeGrammarExAnswer(s) {
    return String(s == null ? "" : s).replace(/[\s　～~〜。、]/g, "");
  }

  function parseGrammarExItem(obj) {
    if (!obj || typeof obj !== "object") return null;
    function str(v) { return v == null ? "" : String(v).trim(); }
    function strList(v) { return Array.isArray(v) ? v.map(str).filter(Boolean) : []; }
    var type = str(obj.type).toLowerCase();
    if (type !== "order" && type !== "choice") {
      type = Array.isArray(obj.tiles) ? "order" : (Array.isArray(obj.options) ? "choice" : "");
    }
    var item = {
      id: str(obj.id).toUpperCase(),
      type: type,
      jp: str(obj.jp),
      kana: str(obj.kana),
      vi: str(obj.vi),
      explain: str(obj.explain)
    };
    if (type === "order") {
      item.tiles = strList(obj.tiles);
      if (item.tiles.length < 2) return null;
      var tilesKey = item.tiles.slice().sort().join("␟");
      var mainText = item.tiles.join("");
      // Thứ tự đúng khác chỉ nhận khi dùng đúng bộ cụm của đáp án chính
      item.alt = (Array.isArray(obj.alt) ? obj.alt : []).map(strList).filter(function (a) {
        return a.slice().sort().join("␟") === tilesKey && a.join("") !== mainText;
      });
      item.extra = strList(obj.extra).filter(function (t) { return item.tiles.indexOf(t) === -1; }).slice(0, 4);
      return item;
    }
    if (type === "choice") {
      // Chuẩn hoá các kiểu chỗ trống ChatGPT hay dùng (___, ＿＿, （　）) về 1 dạng
      var blankRe = /[＿_]{2,}|（\s*）|\(\s*\)/g;
      item.q = str(obj.q).replace(blankRe, GRAMMAR_EX_BLANK);
      item.qKana = str(obj.qKana).replace(blankRe, GRAMMAR_EX_BLANK);
      item.options = strList(obj.options).filter(function (o, i, arr) { return arr.indexOf(o) === i; });
      var answer = str(obj.answer);
      var answerIdx = -1;
      item.options.forEach(function (o, i) {
        if (answerIdx === -1 && normalizeGrammarExAnswer(o) === normalizeGrammarExAnswer(answer)) answerIdx = i;
      });
      // Phòng khi ChatGPT trả về chỉ số (0-based) thay vì nội dung đáp án
      if (answerIdx === -1 && /^\d+$/.test(answer) && Number(answer) < item.options.length) {
        answerIdx = Number(answer);
      }
      if (!item.q || item.options.length < 2 || answerIdx === -1) return null;
      item.answer = item.options[answerIdx];
      return item;
    }
    return null;
  }

  /** Nhặt từng object {...} còn trọn vẹn trong chuỗi — cho data bị cắt dở hoặc nhiều phần dán nối nhau */
  function salvageGrammarExObjects(src) {
    var found = [];
    var stack = [];
    var inString = false;
    for (var i = 0; i < src.length; i++) {
      var ch = src.charAt(i);
      if (inString) {
        if (ch === "\\") {
          i++;
        } else if (ch === "\"") {
          inString = false;
        }
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

  /**
   * Đọc data ChatGPT trả về: chấp nhận có/không có ```json```, chữ thừa trước/sau, dấu phẩy thừa, thiếu [ ],
   * nhiều phần (nhiều code block) dán nối nhau, hoặc phần cuối bị cắt dở (bỏ bài chưa trọn vẹn).
   */
  function parseGrammarExData(text) {
    var src = String(text || "").trim();
    if (!src) return { error: "Chưa dán dữ liệu." };
    src = src.replace(/```[a-z]*/gi, "\n");
    var start = src.search(/[\[{]/);
    if (start === -1) return { error: "Không tìm thấy dữ liệu JSON trong nội dung đã dán." };
    src = src.slice(start);
    var end = Math.max(src.lastIndexOf("}"), src.lastIndexOf("]"));
    var body = src.slice(0, end + 1);
    var noTrailingComma = body.replace(/,\s*([}\]])/g, "$1");
    var candidates = [body, noTrailingComma, "[" + noTrailingComma + "]"];
    var data = null;
    var firstError = "";
    for (var i = 0; i < candidates.length && data == null; i++) {
      try {
        data = JSON.parse(candidates[i]);
      } catch (e) {
        if (!firstError) firstError = e.message;
      }
    }
    var list;
    if (data != null) {
      list = Array.isArray(data) ? data : (data.items || data.exercises || data.data || [data]);
      if (!Array.isArray(list)) list = [];
    } else {
      list = salvageGrammarExObjects(src);
    }
    var items = [];
    var seen = {};
    var skipped = 0;
    list.forEach(function (obj) {
      var item = parseGrammarExItem(obj);
      if (!item) {
        // Chỉ đếm những object trông giống bài tập (bỏ qua object bọc ngoài {"items": ...})
        if (obj && typeof obj === "object" && (obj.type || obj.tiles || obj.options)) skipped++;
        return;
      }
      var key = JSON.stringify(item);
      if (seen[key]) return;
      seen[key] = true;
      items.push(item);
    });
    if (!items.length) {
      return {
        error: data == null
          ? "JSON không hợp lệ: " + firstError
          : "Không có bài hợp lệ (dạng order cần tiles; dạng choice cần q, options và answer nằm trong options)."
      };
    }
    return { items: items, skipped: skipped };
  }

  function loadGrammarExSession() {
    var s = loadGrammarExStore(GRAMMAR_EX_SESSION_KEY);
    if (!s || !Array.isArray(s.items) || !s.items.length || !Array.isArray(s.queue)) return null;
    if (!Array.isArray(s.results)) s.results = [];
    return s;
  }
  function saveGrammarExSession() {
    saveGrammarExStore(GRAMMAR_EX_SESSION_KEY, grammarEx.session);
  }
  function loadGrammarExPending() {
    var p = loadGrammarExStore(GRAMMAR_EX_PENDING_KEY);
    return p && Array.isArray(p.plan) && p.prompt ? p : null;
  }

  function startGrammarExSession(items) {
    grammarEx.session = {
      createdAt: Date.now(),
      items: items,
      queue: [],
      pos: 0,
      results: [],
      finished: false,
      readAfter: loadGrammarExConfig().readAfter
    };
    restartGrammarExSession(items.map(function (_, i) { return i; }));
  }
  /** Làm (lại) bộ hiện tại với danh sách câu `indices` (chỉ số trong session.items), xáo thứ tự */
  function restartGrammarExSession(indices) {
    var s = grammarEx.session;
    s.queue = shuffleArray(indices);
    s.pos = 0;
    s.results = [];
    s.finished = false;
    grammarEx.q = null;
    saveGrammarExSession();
    renderGrammarExQuestion();
  }

  function getGrammarExCurrentItem() {
    var s = grammarEx.session;
    return s && !s.finished && s.pos < s.queue.length ? s.items[s.queue[s.pos]] : null;
  }
  function countGrammarExCorrect() {
    return grammarEx.session.results.filter(function (r) { return r && r.correct; }).length;
  }

  function buildGrammarExQuestionState(item) {
    var q = {
      pos: grammarEx.session.pos,
      attempts: 0,
      hinted: false,
      gaveUp: false,
      answered: false,
      correct: false,
      locked: false,
      picked: null,
      selected: [],
      wrongFrom: null,
      showVi: false,
      justAnswered: false,
      rendered: false
    };
    if (item.type === "order") {
      var bag = item.tiles.map(function (t, i) { return { id: "c" + i, text: t }; })
        .concat(item.extra.map(function (t, i) { return { id: "e" + i, text: t }; }));
      var answerKey = item.tiles.join("␟");
      // Xáo lại vài lần để các cụm không hiện ra đúng luôn thứ tự đáp án
      for (var tries = 0; tries < 6; tries++) {
        q.bag = shuffleArray(bag);
        if (q.bag.map(function (t) { return t.text; }).join("␟").indexOf(answerKey) === -1) break;
      }
    } else {
      q.options = shuffleArray(item.options);
    }
    return q;
  }

  function getGrammarExSelectedTexts(q) {
    return q.selected.map(function (id) {
      var tile = q.bag.filter(function (t) { return t.id === id; })[0];
      return tile ? tile.text : "";
    });
  }
  /** Phần đầu đang xếp đúng liên tục dài nhất (so với đáp án chính và các thứ tự alt) */
  function getGrammarExBestPrefix(item, texts) {
    var best = { len: -1, order: item.tiles };
    [item.tiles].concat(item.alt || []).forEach(function (order) {
      var n = 0;
      while (n < texts.length && n < order.length && texts[n] === order[n]) n++;
      if (n > best.len) best = { len: n, order: order };
    });
    return best;
  }

  function pickGrammarExTile(tileId) {
    var q = grammarEx.q;
    var item = getGrammarExCurrentItem();
    if (!q || !item || q.answered || q.locked || q.selected.indexOf(tileId) !== -1 ||
      q.selected.length >= item.tiles.length) {
      return;
    }
    q.selected.push(tileId);
    if (q.selected.length === item.tiles.length) {
      checkGrammarExOrder();
    } else {
      renderGrammarExQuestion();
    }
  }

  /** Xếp đủ cụm: đúng thì xong câu; sai thì rung + tô đỏ phần sai rồi giữ lại phần đầu đã đúng để xếp tiếp */
  function checkGrammarExOrder() {
    var q = grammarEx.q;
    var item = getGrammarExCurrentItem();
    var best = getGrammarExBestPrefix(item, getGrammarExSelectedTexts(q));
    if (best.len === item.tiles.length) {
      finishGrammarExQuestion(q.attempts === 0 && !q.hinted);
      return;
    }
    q.attempts += 1;
    q.wrongFrom = best.len;
    q.locked = true;
    renderGrammarExQuestion();
    setTimeout(function () {
      if (grammarEx.q !== q) return;
      q.selected = q.selected.slice(0, best.len);
      q.wrongFrom = null;
      q.locked = false;
      renderGrammarExQuestion();
    }, 800);
  }

  /** 💡 Gợi ý: bỏ phần đang sai và điền thêm 1 cụm đúng tiếp theo (câu này không còn tính là đúng) */
  function hintGrammarExOrder() {
    var q = grammarEx.q;
    var item = getGrammarExCurrentItem();
    if (!q || !item || q.answered || q.locked) return;
    var best = getGrammarExBestPrefix(item, getGrammarExSelectedTexts(q));
    q.hinted = true;
    q.selected = q.selected.slice(0, best.len);
    var nextText = best.order[best.len];
    var tile = q.bag.filter(function (t) { return t.text === nextText && q.selected.indexOf(t.id) === -1; })[0];
    if (tile) q.selected.push(tile.id);
    if (q.selected.length === item.tiles.length) {
      checkGrammarExOrder();
    } else {
      renderGrammarExQuestion();
    }
  }

  function giveUpGrammarExOrder() {
    var q = grammarEx.q;
    var item = getGrammarExCurrentItem();
    if (!q || !item || q.answered || q.locked) return;
    var used = [];
    q.selected = item.tiles.map(function (text) {
      var tile = q.bag.filter(function (t) { return t.text === text && used.indexOf(t.id) === -1; })[0];
      used.push(tile.id);
      return tile.id;
    });
    q.gaveUp = true;
    finishGrammarExQuestion(false);
  }

  function pickGrammarExOption(opt) {
    var q = grammarEx.q;
    var item = getGrammarExCurrentItem();
    if (!q || !item || q.answered) return;
    q.picked = opt;
    finishGrammarExQuestion(opt === item.answer);
  }

  /** Chỉ tính đúng khi làm đúng ngay (dạng xếp câu: không sai lần nào, không dùng gợi ý) */
  function finishGrammarExQuestion(isCorrect) {
    var s = grammarEx.session;
    var q = grammarEx.q;
    var item = getGrammarExCurrentItem();
    q.answered = true;
    q.correct = isCorrect;
    q.locked = false;
    q.justAnswered = true;
    s.results[s.pos] = { item: s.queue[s.pos], correct: isCorrect };
    saveGrammarExSession();
    renderGrammarExQuestion();
    if (s.readAfter !== false) {
      speakJapanese(getGrammarExFullSentence(item), null);
    }
  }

  function nextGrammarExQuestion() {
    var s = grammarEx.session;
    s.pos += 1;
    grammarEx.q = null;
    if (s.pos >= s.queue.length) s.finished = true;
    saveGrammarExSession();
    if (s.finished) {
      renderGrammarExResult();
    } else {
      renderGrammarExQuestion();
    }
  }

  function getGrammarExFullSentence(item) {
    if (item.jp) return item.jp;
    if (item.type === "choice") return item.q.split(GRAMMAR_EX_BLANK).join(item.answer);
    return item.kana || item.tiles.join("");
  }

  /** Câu có chỗ trống ＿＿＿: chưa trả lời thì để ô trống, trả lời rồi thì điền đáp án đúng vào */
  function buildGrammarExBlankSentence(text, fill, className) {
    var el = createElement("div", className, "");
    String(text || "").split(GRAMMAR_EX_BLANK).forEach(function (part, i) {
      if (i > 0) {
        el.appendChild(createElement("span", "gx-blank" + (fill ? " gx-blank--filled" : ""), fill || "　　　"));
      }
      el.appendChild(document.createTextNode(part));
    });
    return el;
  }

  function renderGrammarExQuestion() {
    var s = grammarEx.session;
    var item = getGrammarExCurrentItem();
    if (!item) {
      renderGrammarExResult();
      return;
    }
    if (!grammarEx.q || grammarEx.q.pos !== s.pos) {
      grammarEx.q = buildGrammarExQuestionState(item);
    }
    var q = grammarEx.q;

    var root = createElement("div", "test-question gx-root", "");
    var header = createElement("div", "test-question-header", "");
    header.appendChild(createElement("div", "", "Câu " + (s.pos + 1) + " / " + s.queue.length + " · " + GRAMMAR_EX_TYPE_LABELS[item.type]));
    header.appendChild(createElement("div", "", "Đã đúng: " + countGrammarExCorrect()));
    root.appendChild(header);

    var main = createElement("div", "test-question-main gx-question", "");
    if (item.type === "order") {
      main.appendChild(createElement("div", "gx-question-label", "Sắp xếp các cụm thành câu có nghĩa:"));
      main.appendChild(createElement("div", "gx-question-vi", item.vi || "(ChatGPT không gửi nghĩa tiếng Việt)"));
    } else {
      main.appendChild(createElement("div", "gx-question-label", "Chọn đáp án đúng cho chỗ trống:"));
      main.appendChild(buildGrammarExBlankSentence(item.q, q.answered ? item.answer : "", "gx-sentence"));
      if (item.qKana) {
        main.appendChild(buildGrammarExBlankSentence(item.qKana, "", "gx-kana"));
      }
      if (item.vi) {
        if (q.showVi || q.answered) {
          main.appendChild(createElement("div", "gx-question-vi gx-question-vi--small", item.vi));
        } else {
          var viBtn = createElement("button", "gx-link-btn", "Xem nghĩa");
          viBtn.type = "button";
          viBtn.addEventListener("click", function () {
            q.showVi = true;
            renderGrammarExQuestion();
          });
          main.appendChild(viBtn);
        }
      }
    }
    var progressOuter = createElement("div", "test-progress", "");
    var progressInner = createElement("div", "test-progress-bar", "");
    progressInner.style.width = (((s.pos + (q.answered ? 1 : 0)) / s.queue.length) * 100).toFixed(2) + "%";
    progressOuter.appendChild(progressInner);
    main.appendChild(progressOuter);
    root.appendChild(main);

    if (item.type === "order") {
      appendGrammarExOrderUI(root, item, q);
    } else {
      appendGrammarExChoiceUI(root, item, q);
    }

    var reveal = null;
    if (q.answered) {
      reveal = buildGrammarExReveal(item, q);
      root.appendChild(reveal);
    }

    // Vẽ lại cùng 1 câu (chọn cụm, bỏ cụm...) thì giữ nguyên vị trí cuộn của modal
    var bodyEl = detailModalState.bodyEl;
    var keepScroll = bodyEl && q.rendered ? bodyEl.scrollTop : 0;
    openDetailModal("Bài tập ngữ pháp", root);
    q.rendered = true;
    if (bodyEl && keepScroll) bodyEl.scrollTop = keepScroll;
    if (reveal && q.justAnswered) {
      q.justAnswered = false;
      reveal.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function appendGrammarExOrderUI(root, item, q) {
    var build = createElement("div", "gx-build" + (q.wrongFrom != null ? " gx-build--wrong" : "") + (q.answered ? " gx-build--done" : ""), "");
    var texts = getGrammarExSelectedTexts(q);
    if (!texts.length) {
      build.appendChild(createElement("span", "gx-build-placeholder", "Chạm vào các cụm bên dưới theo đúng thứ tự"));
    }
    texts.forEach(function (text, idx) {
      var chip = createElement("button", "gx-chip" + (q.wrongFrom != null && idx >= q.wrongFrom ? " gx-chip--wrong" : ""), text);
      chip.type = "button";
      chip.disabled = q.answered;
      chip.title = "Bỏ cụm này";
      chip.addEventListener("click", function () {
        if (q.answered || q.locked) return;
        q.selected.splice(idx, 1);
        renderGrammarExQuestion();
      });
      build.appendChild(chip);
    });
    root.appendChild(build);
    if (q.answered) return;

    var pool = createElement("div", "gx-pool", "");
    q.bag.forEach(function (tile) {
      var used = q.selected.indexOf(tile.id) !== -1;
      var tileBtn = createElement("button", "gx-tile" + (used ? " gx-tile--used" : ""), tile.text);
      tileBtn.type = "button";
      tileBtn.disabled = used;
      tileBtn.addEventListener("click", function () {
        pickGrammarExTile(tile.id);
      });
      pool.appendChild(tileBtn);
    });
    root.appendChild(pool);

    var tools = createElement("div", "gx-tools", "");
    tools.appendChild(createElement("span", "gx-tools-count", texts.length + " / " + item.tiles.length + " cụm" +
      (q.attempts ? " · sai " + q.attempts + " lần" : "")));
    var hintBtn = createElement("button", "btn-ghost", "💡 Gợi ý 1 cụm");
    hintBtn.type = "button";
    hintBtn.addEventListener("click", hintGrammarExOrder);
    tools.appendChild(hintBtn);
    var giveUpBtn = createElement("button", "btn-ghost", "Xem đáp án");
    giveUpBtn.type = "button";
    giveUpBtn.addEventListener("click", giveUpGrammarExOrder);
    tools.appendChild(giveUpBtn);
    root.appendChild(tools);
  }

  function appendGrammarExChoiceUI(root, item, q) {
    var grid = createElement("div", "options-grid gx-options", "");
    q.options.forEach(function (opt, idx) {
      var cls = "option-btn";
      if (q.answered) {
        if (opt === item.answer) {
          cls += " gx-option--correct";
        } else if (opt === q.picked) {
          cls += " gx-option--wrong";
        } else {
          cls += " gx-option--dim";
        }
      }
      var btn = createElement("button", cls, "");
      btn.type = "button";
      btn.disabled = q.answered;
      btn.appendChild(createElement("span", "option-index", String(idx + 1)));
      btn.appendChild(createElement("span", "gx-option-text", opt));
      btn.addEventListener("click", function () {
        pickGrammarExOption(opt);
      });
      grid.appendChild(btn);
    });
    root.appendChild(grid);
  }

  function buildGrammarExReveal(item, q) {
    var s = grammarEx.session;
    var wrap = createElement("div", "gx-reveal", "");

    var status;
    if (q.correct) {
      status = "Đúng rồi!";
    } else if (item.type === "choice") {
      status = "Chưa đúng — đáp án: " + item.answer;
    } else if (q.gaveUp) {
      status = "Đáp án đúng";
    } else {
      var notes = [];
      if (q.attempts) notes.push("sai " + q.attempts + " lần");
      if (q.hinted) notes.push("có dùng gợi ý");
      status = "Đã xếp đúng (" + notes.join(", ") + ")";
    }
    var banner = createElement("div", "kt-test-reveal-banner " + (q.correct ? "kt-test-reveal-banner--correct" : "kt-test-reveal-banner--wrong"), "");
    banner.appendChild(createElement("div", "kt-test-reveal-status", status));

    var sentence = getGrammarExFullSentence(item);
    var sentenceRow = createElement("div", "gx-reveal-sentence-row", "");
    sentenceRow.appendChild(createElement("div", "gx-reveal-jp", sentence));
    var speakBtn = createElement("button", "gx-speak-btn", "🔊");
    speakBtn.type = "button";
    speakBtn.title = "Đọc câu";
    speakBtn.addEventListener("click", function () {
      speakJapanese(sentence, speakBtn);
    });
    sentenceRow.appendChild(speakBtn);
    banner.appendChild(sentenceRow);
    if (item.kana && item.kana !== sentence) {
      banner.appendChild(createElement("div", "gx-reveal-kana", item.kana));
    }
    if (item.vi) {
      banner.appendChild(createElement("div", "gx-reveal-vi", item.vi));
    }
    if (item.explain) {
      banner.appendChild(createElement("div", "gx-reveal-explain", "💡 " + item.explain));
    }
    wrap.appendChild(banner);

    var raw = findGrammarByExId(item.id);
    if (raw) {
      wrap.appendChild(buildGrammarDetailNode(raw));
    }

    var nextBar = createElement("div", "gx-next-bar", "");
    var isLast = s.pos >= s.queue.length - 1;
    var nextBtn = createElement("button", "btn", isLast ? "Xem kết quả" : "Câu tiếp theo →");
    nextBtn.type = "button";
    nextBtn.addEventListener("click", nextGrammarExQuestion);
    nextBar.appendChild(nextBtn);
    wrap.appendChild(nextBar);
    return wrap;
  }

  function renderGrammarExResult() {
    var s = grammarEx.session;
    var results = s.results.filter(Boolean);
    var total = s.queue.length;
    var correct = countGrammarExCorrect();

    var root = createElement("div", "test-result gx-root", "");
    root.appendChild(createElement("div", "score-main", correct + " / " + total));
    root.appendChild(createElement("div", "score-detail", "Hoàn thành bài tập ngữ pháp. Câu sai / phải xếp lại / dùng gợi ý: " + (total - correct) + "."));

    var list = createElement("div", "gx-result-list", "");
    results.forEach(function (r) {
      var item = s.items[r.item];
      var raw = findGrammarByExId(item.id);
      var row = createElement("div", "gx-result-row" + (r.correct ? "" : " gx-result-row--wrong"), "");
      row.appendChild(createElement("span", "gx-result-mark", r.correct ? "✓" : "✗"));
      var body = createElement("div", "gx-result-body", "");
      body.appendChild(createElement("div", "gx-result-structure", (raw ? getGrammarStructure(raw) : item.id) + " · " + GRAMMAR_EX_TYPE_LABELS[item.type]));
      body.appendChild(createElement("div", "gx-result-sentence", getGrammarExFullSentence(item)));
      row.appendChild(body);
      list.appendChild(row);
    });
    root.appendChild(list);

    var wrongIdx = [];
    results.forEach(function (r) {
      if (!r.correct && wrongIdx.indexOf(r.item) === -1) wrongIdx.push(r.item);
    });
    var btnRow = createElement("div", "btn-row", "");
    if (wrongIdx.length) {
      btnRow.appendChild(createRetryWrongButton(wrongIdx.length, function () {
        restartGrammarExSession(wrongIdx);
      }));
    }
    var againBtn = createElement("button", wrongIdx.length ? "btn-ghost" : "btn", "Làm lại bộ này");
    againBtn.type = "button";
    againBtn.addEventListener("click", function () {
      restartGrammarExSession(s.items.map(function (_, i) { return i; }));
    });
    btnRow.appendChild(againBtn);
    var newBtn = createElement("button", "btn-ghost", "✨ Tạo bộ mới");
    newBtn.type = "button";
    newBtn.addEventListener("click", renderGrammarExConfig);
    btnRow.appendChild(newBtn);
    root.appendChild(btnRow);

    openDetailModal("Bài tập ngữ pháp", root);
  }

  function renderGrammarExConfig() {
    var cfg = loadGrammarExConfig();
    var root = createElement("div", "test-result test-config-form gx-root", "");

    var s = grammarEx.session;
    if (s && !s.finished && s.pos < s.queue.length) {
      var resumeBtn = createElement("button", "btn-ghost gx-resume-btn", "▶ Làm tiếp bộ đang làm (câu " + (s.pos + 1) + " / " + s.queue.length + ")");
      resumeBtn.type = "button";
      resumeBtn.addEventListener("click", function () {
        grammarEx.q = null;
        renderGrammarExQuestion();
      });
      root.appendChild(resumeBtn);
    }

    var grid = createElement("div", "test-config-fields", "");
    function addField(label, control) {
      var field = createElement("div", "field-group", "");
      var labelEl = createElement("div", "field-label", label);
      field.appendChild(labelEl);
      field.appendChild(control);
      grid.appendChild(field);
      return { field: field, label: labelEl };
    }
    function addNumberInput(value, min, max) {
      var input = createElement("input", "input-text", "");
      input.type = "number";
      input.inputMode = "numeric";
      input.min = String(min);
      if (max != null) input.max = String(max);
      input.value = String(value);
      return input;
    }
    function addCheckbox(label, checked) {
      var input = createElement("input", "", "");
      input.type = "checkbox";
      input.checked = checked;
      addField(label, input);
      return input;
    }

    var levelSelect = createElement("select", "", "");
    GRAMMAR_EX_LEVELS.forEach(function (lv) {
      var label = lv.value === "filtered" ? lv.label + " (" + applyGrammarFilter().length + " mẫu)" : lv.label;
      var opt = createElement("option", "", label);
      opt.value = lv.value;
      levelSelect.appendChild(opt);
    });
    levelSelect.value = cfg.level;
    addField("Phạm vi ngữ pháp", levelSelect);

    var countInput = addNumberInput(cfg.count, 1, null);
    addField("Số câu", countInput);

    var fromInput = addNumberInput(1, 1, null);
    var toInput = addNumberInput(1, 1, null);
    var fromField = addField("", fromInput);
    var toField = addField("", toInput);

    var modeSelect = createElement("select", "", "");
    GRAMMAR_EX_MODES.forEach(function (m) {
      var opt = createElement("option", "", m.label);
      opt.value = m.value;
      modeSelect.appendChild(opt);
    });
    modeSelect.value = cfg.mode;
    addField("Dạng bài", modeSelect);

    var distractorInput = addCheckbox("Thêm cụm gây nhiễu (dạng sắp xếp)", cfg.distractors);
    var readAfterInput = addCheckbox("Đọc câu sau khi trả lời", cfg.readAfter);
    root.appendChild(grid);

    var scopeInfo = createElement("div", "test-question-sub gx-scope-info", "");
    root.appendChild(scopeInfo);

    /** Cấp độ đang hiển thị trong 2 ô Từ/Đến (khác levelSelect.value ngay lúc vừa đổi cấp độ) */
    var shownLevel = null;
    function readForm() {
      if (cfg.ranges[shownLevel]) {
        var from = parseInt(fromInput.value, 10);
        var to = parseInt(toInput.value, 10);
        cfg.ranges[shownLevel] = {
          from: isNaN(from) || from < 1 ? 1 : from,
          to: isNaN(to) ? getGrammarExRangeMax(shownLevel) : to
        };
      }
      cfg.level = levelSelect.value;
      cfg.count = Math.max(1, parseInt(countInput.value, 10) || GRAMMAR_EX_DEFAULT_COUNT);
      cfg.mode = modeSelect.value;
      cfg.distractors = !!distractorInput.checked;
      cfg.readAfter = !!readAfterInput.checked;
      return cfg;
    }
    function refresh() {
      var level = levelSelect.value;
      if (level !== shownLevel) {
        // Đổi cấp độ: lưu khoảng của cấp độ cũ rồi nạp khoảng đã lưu của cấp độ mới vào 2 ô Từ/Đến
        readForm();
        shownLevel = level;
        var lv = GRAMMAR_EX_LEVELS.filter(function (l) { return l.value === level; })[0];
        var hasRange = !!cfg.ranges[level];
        fromField.field.style.display = hasRange ? "" : "none";
        toField.field.style.display = hasRange ? "" : "none";
        if (hasRange) {
          var max = getGrammarExRangeMax(level);
          fromField.label.textContent = "Từ " + lv.rangeLabel;
          toField.label.textContent = "Đến " + lv.rangeLabel + " (tối đa " + max + ")";
          fromInput.max = String(max);
          toInput.max = String(max);
          fromInput.value = String(cfg.ranges[level].from);
          toInput.value = String(cfg.ranges[level].to);
        }
      }
      var c = readForm();
      var poolSize = getGrammarExPool(c).length;
      var takeCount = Math.min(poolSize, c.count);
      if (!poolSize) {
        scopeInfo.textContent = "Không có mẫu ngữ pháp nào trong phạm vi đã chọn.";
      } else {
        scopeInfo.textContent = "Phạm vi có " + poolSize + " mẫu ngữ pháp → " +
          (takeCount === poolSize ? "lấy cả " + poolSize + " mẫu (thứ tự ngẫu nhiên)" : "bốc ngẫu nhiên " + takeCount + " mẫu") +
          " để tạo đề." +
          (takeCount > GRAMMAR_EX_SPLIT_THRESHOLD ? " Đề nhiều câu nên ChatGPT có thể trả làm nhiều phần." : "");
      }
    }
    [levelSelect, modeSelect].forEach(function (el) { el.addEventListener("change", refresh); });
    [fromInput, toInput, countInput].forEach(function (el) { el.addEventListener("input", refresh); });
    refresh();

    root.appendChild(createElement(
      "div",
      "test-question-sub",
      "Bấm \"Tạo data\": app mở ChatGPT với prompt soạn sẵn (prompt cũng đã được copy). " +
      "Chờ ChatGPT trả lời xong, copy khối JSON rồi quay lại app dán vào để làm bài."
    ));

    var btnRow = createElement("div", "btn-row", "");
    var genBtn = createElement("button", "btn", "✨ Tạo data (ChatGPT)");
    genBtn.type = "button";
    genBtn.addEventListener("click", function () {
      var c = readForm();
      saveGrammarExStore(GRAMMAR_EX_CONFIG_KEY, c);
      var pool = getGrammarExPool(c);
      if (!pool.length) {
        alert("Không có mẫu ngữ pháp nào trong phạm vi đã chọn.");
        return;
      }
      var plan = buildGrammarExPlan(pool, c);
      var pending = { createdAt: Date.now(), plan: plan, prompt: buildGrammarExPrompt(plan, c) };
      saveGrammarExStore(GRAMMAR_EX_PENDING_KEY, pending);
      copyGrammarExText(pending.prompt);
      window.open(getGrammarExChatGptUrl(pending.prompt), "_blank", "noopener");
      renderGrammarExPaste(pending);
    });
    btnRow.appendChild(genBtn);

    var pasteBtn = createElement("button", "btn-ghost", "📋 Dán data");
    pasteBtn.type = "button";
    pasteBtn.title = "Dán data bài tập đã có sẵn (ChatGPT đã trả về trước đó)";
    pasteBtn.addEventListener("click", function () {
      saveGrammarExStore(GRAMMAR_EX_CONFIG_KEY, readForm());
      renderGrammarExPaste(loadGrammarExPending());
    });
    btnRow.appendChild(pasteBtn);

    var closeBtn = createElement("button", "btn-ghost", "Đóng");
    closeBtn.type = "button";
    closeBtn.addEventListener("click", function () {
      saveGrammarExStore(GRAMMAR_EX_CONFIG_KEY, readForm());
      closeDetailModal();
    });
    btnRow.appendChild(closeBtn);
    root.appendChild(btnRow);

    openDetailModal("Bài tập ngữ pháp", root);
  }

  function renderGrammarExPaste(pending) {
    var root = createElement("div", "test-result gx-root", "");
    var status = createElement("div", "gx-status", "");
    function setStatus(text, isError) {
      status.textContent = text || "";
      status.className = "gx-status" + (text ? (isError ? " gx-status--error" : " gx-status--ok") : "");
    }

    if (pending) {
      var isLarge = pending.plan.length > GRAMMAR_EX_SPLIT_THRESHOLD;
      var steps = createElement("ol", "gx-steps", "");
      [
        isGrammarExPromptPrefilled(pending.prompt)
          ? "ChatGPT đã mở với prompt soạn sẵn (prompt cũng đã được copy — nếu ô chat còn trống thì dán vào rồi gửi)."
          : "Prompt dài nên ChatGPT mở ô chat trống: dán prompt (đã được copy sẵn) vào rồi gửi.",
        isLarge
          ? "Chờ ChatGPT trả lời xong, bấm Copy ở khối JSON. Nếu ChatGPT dừng giữa chừng, nhắn \"tiếp\" để nhận phần còn lại."
          : "Chờ ChatGPT trả lời xong, bấm Copy ở khối JSON.",
        isLarge
          ? "Quay lại đây bấm \"Dán & bắt đầu\" — nhiều phần thì dán lần lượt từng phần, các phần được nối tiếp vào ô bên dưới."
          : "Quay lại đây, bấm \"Dán & bắt đầu\" (hoặc dán tay vào ô bên dưới)."
      ].forEach(function (text) { steps.appendChild(createElement("li", "", text)); });
      root.appendChild(steps);
      root.appendChild(createElement("div", "gx-scope-info", "Đề gồm " + pending.plan.length + " mẫu ngữ pháp:"));

      var planList = createElement("div", "gx-plan-list", "");
      pending.plan.forEach(function (p) {
        var chip = createElement("span", "gx-plan-chip", p.structure);
        chip.title = GRAMMAR_EX_TYPE_LABELS[p.type] + " · " + p.meaning;
        planList.appendChild(chip);
      });
      root.appendChild(planList);

      var linkRow = createElement("div", "btn-row", "");
      var openLink = createElement("a", "btn-ghost", "↗ Mở lại ChatGPT");
      openLink.href = getGrammarExChatGptUrl(pending.prompt);
      openLink.target = "_blank";
      openLink.rel = "noopener noreferrer";
      openLink.addEventListener("click", function () {
        copyGrammarExText(pending.prompt);
      });
      linkRow.appendChild(openLink);
      var copyBtn = createElement("button", "btn-ghost", "📋 Copy prompt");
      copyBtn.type = "button";
      copyBtn.addEventListener("click", function () {
        copyGrammarExText(pending.prompt, function (ok) {
          setStatus(ok ? "Đã copy prompt." : "Không copy được prompt.", !ok);
        });
      });
      linkRow.appendChild(copyBtn);
      root.appendChild(linkRow);
    } else {
      root.appendChild(createElement("div", "test-question-sub", "Dán data JSON bài tập (do ChatGPT sinh theo prompt của app) vào ô bên dưới."));
    }

    var textarea = createElement("textarea", "input-text gx-textarea", "");
    textarea.rows = 7;
    textarea.spellcheck = false;
    textarea.placeholder = "{\"items\":[ ... ]}";
    root.appendChild(textarea);
    root.appendChild(status);

    function tryStart() {
      var res = parseGrammarExData(textarea.value);
      if (res.error) {
        setStatus(res.error, true);
        return;
      }
      var skippedNote = res.skipped ? "Bỏ qua " + res.skipped + " bài không hợp lệ.\n" : "";
      var expected = pending ? pending.plan.length : 0;
      if (expected && res.items.length < expected) {
        // Thiếu bài (ChatGPT trả thiếu / đang trả nhiều phần): cho chọn làm luôn hay dán thêm phần tiếp theo
        var goNow = confirm(
          skippedNote + "Mới đọc được " + res.items.length + "/" + expected + " bài.\n" +
          "OK: làm luôn " + res.items.length + " bài.\n" +
          "Huỷ: dán thêm phần còn lại (nhắn \"tiếp\" cho ChatGPT, copy rồi bấm lại \"Dán & bắt đầu\")."
        );
        if (!goNow) {
          setStatus("Đã đọc " + res.items.length + "/" + expected + " bài — dán thêm phần còn lại rồi bấm lại.", false);
          return;
        }
      } else if (skippedNote) {
        alert(skippedNote + "Làm " + res.items.length + " bài còn lại.");
      }
      saveGrammarExStore(GRAMMAR_EX_PENDING_KEY, null);
      startGrammarExSession(res.items);
    }

    var btnRow = createElement("div", "btn-row", "");
    if (navigator.clipboard && navigator.clipboard.readText) {
      var clipBtn = createElement("button", "btn", "📥 Dán & bắt đầu");
      clipBtn.type = "button";
      clipBtn.addEventListener("click", function () {
        navigator.clipboard.readText().then(function (text) {
          // Ô đã có phần trước (ChatGPT trả nhiều phần) thì nối phần mới vào sau, trùng thì bỏ qua
          var current = textarea.value.trim();
          textarea.value = current && current.indexOf(text.trim()) === -1 ? current + "\n" + text : (current || text);
          tryStart();
        }).catch(function () {
          setStatus("Trình duyệt không cho đọc clipboard — hãy nhấn giữ vào ô trên và chọn Dán.", true);
          textarea.focus();
        });
      });
      btnRow.appendChild(clipBtn);
    }
    var startBtn = createElement("button", btnRow.children.length ? "btn-ghost" : "btn", "▶ Bắt đầu làm bài");
    startBtn.type = "button";
    startBtn.addEventListener("click", tryStart);
    btnRow.appendChild(startBtn);
    var backBtn = createElement("button", "btn-ghost", "← Cấu hình");
    backBtn.type = "button";
    backBtn.addEventListener("click", renderGrammarExConfig);
    btnRow.appendChild(backBtn);
    root.appendChild(btnRow);

    openDetailModal("Dán data bài tập", root);
  }

  /** Mở bài tập: còn đề vừa tạo chưa dán data (quay lại từ ChatGPT) thì vào thẳng màn dán data */
  function openGrammarExercise() {
    if (!grammarEx.session) {
      grammarEx.session = loadGrammarExSession();
    }
    var pending = loadGrammarExPending();
    if (pending && Date.now() - (pending.createdAt || 0) < GRAMMAR_EX_PENDING_TTL) {
      renderGrammarExPaste(pending);
    } else {
      renderGrammarExConfig();
    }
  }

  function setupGrammarExercise() {
    var btn = document.getElementById("grammar-exercise-btn");
    if (btn) {
      btn.addEventListener("click", openGrammarExercise);
    }
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

  // ----- Note: tìm kiếm text trong nội dung -----
  function escapeRegExpNote(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function noteSearchUpdateUI() {
    var box = document.querySelector(".note-search-box");
    var countEl = document.getElementById("note-search-count");
    var prevBtn = document.getElementById("note-search-prev");
    var nextBtn = document.getElementById("note-search-next");
    var clearBtn = document.getElementById("note-search-clear");
    var total = state.note.matches.length;
    var hasTerm = !!(state.note.searchTerm && state.note.searchTerm.trim());
    if (countEl) {
      countEl.hidden = !hasTerm;
      countEl.textContent = total ? (state.note.matchIndex + 1) + "/" + total : "0/0";
    }
    if (prevBtn) prevBtn.hidden = !hasTerm;
    if (nextBtn) nextBtn.hidden = !hasTerm;
    if (clearBtn) clearBtn.hidden = !hasTerm;
    // Đang focus vào ô search, HOẶC ô search đang có giá trị (kể cả khi đã rời focus): ghim nổi
    noteSearchApplyFixedState(!!state.note.searchFocused || hasTerm);
  }

  // .section / .app-shell có backdrop-filter, mà theo spec thì backdrop-filter khác none trên
  // tổ tiên sẽ tạo containing block riêng cho con position:fixed — khiến "fixed" bị nhốt lại bên
  // trong tổ tiên đó (cuộn trang là trôi theo luôn) thay vì thực sự ghim theo viewport.
  // Cách né: KHÔNG dời DOM (dời node đang được focus dễ gây mất focus/không gõ được — đã gặp lỗi
  // này), mà tạm tắt backdrop-filter của các tổ tiên đó (qua class) trong lúc đang ghim, để
  // .note-search-box--fixed (vẫn nằm nguyên vị trí cũ trong DOM) escape thẳng ra viewport thật.
  function noteSearchApplyFixedState(shouldFix) {
    var box = document.querySelector(".note-search-box");
    if (!box) {
      return;
    }
    box.classList.toggle("note-search-box--fixed", shouldFix);
    var shell = document.querySelector(".app-shell");
    var section = document.getElementById("section-note");
    if (shell) shell.classList.toggle("note-search-portal-open", shouldFix);
    if (section) section.classList.toggle("note-search-portal-open", shouldFix);
  }

  function noteSearchHighlightCurrent() {
    var matches = state.note.matches;
    for (var i = 0; i < matches.length; i++) {
      matches[i].classList.toggle("note-search-hit--current", i === state.note.matchIndex);
    }
    var current = matches[state.note.matchIndex];
    if (current && current.scrollIntoView) {
      current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  function noteSearchRun(term) {
    var container = document.getElementById("note-content-container");
    if (!container) {
      return;
    }

    // Khôi phục nội dung gốc (bỏ highlight cũ) trước khi tìm lại
    if (state.note.originalHtml != null) {
      container.innerHTML = state.note.originalHtml;
    } else {
      state.note.originalHtml = container.innerHTML;
    }

    state.note.matches = [];
    state.note.matchIndex = -1;
    state.note.searchTerm = term;

    var trimmed = String(term || "").trim();
    if (!trimmed) {
      noteSearchUpdateUI();
      return;
    }

    var re;
    try {
      re = new RegExp(escapeRegExpNote(trimmed), "gi");
    } catch (e) {
      noteSearchUpdateUI();
      return;
    }

    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.length) {
        textNodes.push(node);
      }
    }

    textNodes.forEach(function (textNode) {
      var text = textNode.nodeValue;
      re.lastIndex = 0;
      var match;
      var lastIndex = 0;
      var frag = null;
      while ((match = re.exec(text))) {
        if (!frag) frag = document.createDocumentFragment();
        if (match.index > lastIndex) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }
        var mark = document.createElement("mark");
        mark.className = "note-search-hit";
        mark.textContent = match[0];
        frag.appendChild(mark);
        state.note.matches.push(mark);
        lastIndex = match.index + match[0].length;
        if (match[0].length === 0) {
          re.lastIndex += 1;
        }
      }
      if (frag) {
        if (lastIndex < text.length) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        textNode.parentNode.replaceChild(frag, textNode);
      }
    });

    if (state.note.matches.length) {
      state.note.matchIndex = 0;
    }
    noteSearchUpdateUI();
    noteSearchHighlightCurrent();
  }

  function noteSearchGoTo(delta) {
    var total = state.note.matches.length;
    if (!total) {
      return;
    }
    state.note.matchIndex = (state.note.matchIndex + delta + total) % total;
    noteSearchUpdateUI();
    noteSearchHighlightCurrent();
  }

  function noteSearchReset() {
    var container = document.getElementById("note-content-container");
    state.note.originalHtml = container ? container.innerHTML : null;
    state.note.searchTerm = "";
    state.note.matches = [];
    state.note.matchIndex = -1;
    var input = document.getElementById("note-search-input");
    if (input) {
      input.value = "";
    }
    noteSearchUpdateUI();
    noteScrollToHash();
  }

  // Nội dung note (markdown) được tải bất đồng bộ (fetch) và chèn vào DOM
  // SAU khi trang đã load xong, nên nếu URL đã có sẵn #id thì trình duyệt sẽ
  // cố cuộn tới lúc phần tử đó chưa tồn tại và không tự thử lại. Gọi hàm này
  // mỗi khi nội dung note vừa render xong để tự cuộn tới đúng #id (nếu có).
  function noteScrollToHash() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) {
      return;
    }
    var id = "";
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch (e) {
      id = hash.slice(1);
    }
    if (!id) {
      return;
    }
    requestAnimationFrame(function () {
      var el = document.getElementById(id);
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    });
  }

  function setupNoteAnchors() {
    var container = document.getElementById("note-content-container");
    if (!container) {
      return;
    }
    container.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link || !container.contains(link)) {
        return;
      }
      var href = link.getAttribute("href") || "";
      if (href.length < 2) {
        return;
      }
      var id = "";
      try {
        id = decodeURIComponent(href.slice(1));
      } catch (err) {
        id = href.slice(1);
      }
      var target = document.getElementById(id);
      if (!target) {
        return;
      }
      e.preventDefault();
      target.scrollIntoView({ block: "start", behavior: "smooth" });
      if (history.pushState) {
        history.pushState(null, "", href);
      } else {
        window.location.hash = href;
      }
    });
  }

  function setupNoteSearch() {
    var input = document.getElementById("note-search-input");
    var prevBtn = document.getElementById("note-search-prev");
    var nextBtn = document.getElementById("note-search-next");
    var clearBtn = document.getElementById("note-search-clear");
    if (!input) {
      return;
    }

    input.addEventListener("input", function () {
      noteSearchRun(input.value);
    });
    input.addEventListener("focus", function () {
      state.note.searchFocused = true;
      noteSearchUpdateUI();
    });
    input.addEventListener("blur", function () {
      // Trì hoãn 1 tick: nếu blur này chỉ là hệ quả của việc bấm nút × (mousedown
      // làm input mất focus trước khi click chạy input.focus() lại) thì tới lúc này
      // input đã được focus lại — kiểm tra activeElement thật thay vì tin ngay là đã blur,
      // tránh việc bị coi là "mất focus" nhầm rồi ẩn/thu gọn quá sớm.
      setTimeout(function () {
        state.note.searchFocused = document.activeElement === input;
        noteSearchUpdateUI();
      }, 0);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        noteSearchGoTo(e.shiftKey ? -1 : 1);
      } else if (e.key === "Escape") {
        input.value = "";
        noteSearchRun("");
      }
    });
    if (prevBtn) {
      prevBtn.addEventListener("click", function () { noteSearchGoTo(-1); });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () { noteSearchGoTo(1); });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        input.value = "";
        noteSearchRun("");
        input.focus();
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
      noteSearchReset();
      return;
    }

    container.innerHTML = "<span class=\"detail-empty\">Đang tải...</span>";
    noteSearchReset();

    const docs = (window.DOC_CONFIG && window.DOC_CONFIG.docs) || [];
    const key = state.note.currentDocKey;
    const target =
      docs.find(function (d) { return d.key === key; }) || docs[0];

    if (!target) {
      container.innerHTML = "<span class=\"detail-empty\">Không tìm thấy tài liệu.</span>";
      noteSearchReset();
      return;
    }

    function getNoteFilePath(doc) {
      const type = String(doc.type || "md").toLowerCase();
      var filePath = String(doc.file || "");
      if (filePath.indexOf("/") === -1 && type === "video") {
        // Video: `file` là tên file đầy đủ (vd: a.mp4) => `data/video/a.mp4`
        return "data/video/" + filePath;
      }
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
      noteSearchReset();
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
      noteSearchReset();
      return;
    }

    if (type === "video") {
      // `file` có thể là file local (data/doc/abc.mp4) hoặc link YouTube
      const ytMatch = filePath.match(
        /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
      );
      const wrap = document.createElement("div");
      const link = document.createElement("a");
      link.href = filePath;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Mở video: " + filePath;
      link.style.display = "inline-block";
      link.style.marginBottom = "10px";

      var player;
      if (ytMatch) {
        player = document.createElement("iframe");
        player.src = "https://www.youtube.com/embed/" + ytMatch[1];
        player.title = target.label || "Video";
        player.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        player.allowFullscreen = true;
        player.referrerPolicy = "strict-origin-when-cross-origin";
        player.style.width = "100%";
        player.style.aspectRatio = "16 / 9";
        player.style.border = "0";
      } else {
        player = document.createElement("video");
        player.src = filePath;
        player.controls = true;
        player.preload = "metadata";
        player.style.width = "100%";
        player.style.maxHeight = "75vh";
        player.style.display = "block";
        player.style.background = "#000";
        player.addEventListener("error", function () {
          const err = document.createElement("div");
          err.className = "detail-empty";
          err.textContent = "Không tải được video: " + filePath;
          if (player.parentNode) player.parentNode.replaceChild(err, player);
        });
      }

      wrap.appendChild(link);
      wrap.appendChild(player);
      container.innerHTML = "";
      container.appendChild(wrap);
      noteSearchReset();
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
        noteSearchReset();
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
            noteSearchReset();
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
          noteSearchReset();
        })
        .catch(function (err) {
          const msg = err && err.message ? err.message : "unknown";
          content.innerHTML =
            "<span class=\"detail-empty\">Không đọc được file: " +
            filePath +
            " (" +
            msg +
            ").</span>";
          noteSearchReset();
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
        noteSearchReset();
      })
      .catch(function () {
        container.innerHTML = "<span class=\"detail-empty\">Không tải được file: " + filePath + ".</span>";
        noteSearchReset();
      });
  }

  // ========================
  // LOGIC / EVENT HANDLERS
  // ========================

  function handleLocationChange() {
    var params = getLocationParams();
    var rawTab = params.get("tab") || "vocab";
    var detail = parseKanjiDetailFromQuery();
    var tabName;
    if (rawTab === "kanji" || rawTab === "grammar" || rawTab === "stars" || rawTab === "daily" || rawTab === "note" || rawTab === "dup" || rawTab === "vocab-edit") {
      tabName = rawTab;
    } else {
      tabName = "vocab";
    }
    state.currentTab = tabName;
    renderTabs();
    if (tabName === "note") {
      renderNoteContent();
    } else if (tabName === "stars") {
      renderStarsTab();
    } else if (tabName === "dup") {
      renderDupTab();
    } else if (tabName === "daily") {
      renderDailyReviewTab();
    }

    if (detail.tab && detail.slug && (tabName === "kanji" || tabName === "stars")) {
      var idx = findKanjiIndexByChar(detail.slug);
      if (idx >= 0) {
        state.kanjiHistory = [];
        state.selected.kanjiIndex = idx;
        renderKanjiList();
        renderKanjiDetail();
      } else {
        replaceLocationQuery({ tab: tabName }, ["k"]);
      }
    } else if (tabName === "kanji" || tabName === "stars") {
      renderKanjiList();
    }
  }

  /** Chuyển tab bằng query string (?tab=xxx) thay vì #xxx, cập nhật history để back/forward hoạt động. */
  function navigateToTab(tabName) {
    var params = getLocationParams();
    if (params.get("tab") === tabName && !params.has("k")) {
      state.currentTab = tabName;
      renderTabs();
      return;
    }
    pushLocationQuery({ tab: tabName }, ["k"]);
    handleLocationChange();
  }

  function setupTabs() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const tabName = tab.getAttribute("data-tab");
        if (!tabName) {
          return;
        }
        navigateToTab(tabName);
      });
    });

    window.addEventListener("popstate", handleLocationChange);
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

  /** Chế độ Tắt đèn: bật/tắt class theme-dark trên <html> (CSS xử lý màu) */
  function applyTheme() {
    var isDark = !!state.displaySettings.darkMode;
    document.documentElement.classList.toggle("theme-dark", isDark);
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", isDark ? "#000000" : "#6366f1");
  }

  function renderScreen () {
    const appShell = document.querySelector(".app-shell");
    applyTheme();

    if (state.displaySettings.iphoneTaiTho) {
      if (appShell) {
          appShell.style.paddingTop = "30px";
          appShell.style.paddingBottom = "30px";
      }
    } else {
      if (appShell) {
          appShell.style.paddingTop = "0px";
          appShell.style.paddingBottom = "0px";
      }
    }

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
        lessonTo.classList.add("disabled-gray");
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
      window.location.href = `index.html?tab=kanji&kanji=${encodeURIComponent(kanji)}`;
    }

    addKanji.addEventListener("click", redirectKanji);

    const addVocabBtn = document.getElementById("add-vocab-btn");
    if (addVocabBtn) {
      addVocabBtn.addEventListener("click", function () {
        const word = searchInput.value.trim();
        window.location.href = `addVocab/index.html${word ? "?word=" + encodeURIComponent(word) : ""}`;
      });
    }

    lessonTo.addEventListener("input", function () {
      state.filter.vocabLessonTo = lessonTo.value.trim();
      renderVocabList();
      saveFillter();
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
      state.filter.isOnelesson = false;
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
      if (field === "darkMode") {
        applyTheme();
        vocabPip.redraw();
        kanjiPip.redraw();
      }
      renderDisplaySettingsUI();
      renderVocabList();
    });
  }

  function setupVocabViewModeToggle() {
    const btn = document.getElementById("vocab-view-mode-toggle");
    if (!btn) return;

    function syncBtn() {
      var isFlashcard = state.ui.vocabViewMode === "flashcard";
      btn.textContent = isFlashcard ? "🗇" : "🗂";
      btn.title = isFlashcard ? "Chuyển sang chế độ danh sách" : "Chuyển sang chế độ Flashcard";
      btn.classList.toggle("filter-icon-btn--active", isFlashcard);
    }
    syncBtn();
    scheduleVocabAutoNextTimer();

    btn.addEventListener("click", function () {
      state.ui.vocabViewMode = state.ui.vocabViewMode === "flashcard" ? "list" : "flashcard";
      state.ui.vocabFlashcardFlipped = false;
      if (state.ui.vocabViewMode !== "flashcard") {
        exitVocabFlashcardFullscreen();
        vocabPip.exit();
      }
      syncBtn();
      syncFlashcardWakeLock();
      syncFlashcardScrollLock();
      saveVocabViewState(state.ui.vocabFlashcardVocabIndex);
      renderVocabList();
      scheduleVocabAutoNextTimer();
    });

    document.addEventListener("keydown", function (e) {
      if (e.code !== "Space" && e.key !== " " && e.key !== "Spacebar") return;
      if (state.currentTab !== "vocab" || state.ui.vocabViewMode !== "flashcard") return;
      var tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target && e.target.isContentEditable)) return;
      e.preventDefault();
      advanceVocabFlashcard(1);
    });
  }

  /** Thoát chế độ trình chiếu toàn màn hình flashcard (nếu đang bật) */
  function exitVocabFlashcardFullscreen() {
    if (!state.ui.vocabFlashcardFullscreen) return;
    state.ui.vocabFlashcardFullscreen = false;
    if (document.fullscreenElement) {
      try { document.exitFullscreen(); } catch (e) { }
    }
  }

  function toggleVocabFlashcardFullscreen() {
    state.ui.vocabFlashcardFullscreen = !state.ui.vocabFlashcardFullscreen;
    if (state.ui.vocabFlashcardFullscreen) {
      var el = document.documentElement;
      if (el && el.requestFullscreen) {
        el.requestFullscreen().catch(function () { });
      }
    } else if (document.fullscreenElement) {
      try { document.exitFullscreen(); } catch (e) { }
    }
    renderVocabList();
  }

  // ----- Giữ màn hình luôn sáng khi đang học Flashcard (Screen Wake Lock API) -----
  var flashcardWakeLock = null;
  var flashcardWakeLockPending = false;

  function shouldKeepScreenOn() {
    return state.currentTab === "vocab" && state.ui.vocabViewMode === "flashcard" &&
      document.visibilityState === "visible";
  }

  /** Xin / nhả wake lock theo trạng thái hiện tại — gọi lại mỗi khi đổi tab, đổi chế độ xem, ẩn/hiện trang */
  function syncFlashcardWakeLock() {
    if (!("wakeLock" in navigator)) return;
    if (!shouldKeepScreenOn()) {
      if (flashcardWakeLock) {
        var held = flashcardWakeLock;
        flashcardWakeLock = null;
        held.release().catch(function () { });
      }
      return;
    }
    if (flashcardWakeLock || flashcardWakeLockPending) return;
    flashcardWakeLockPending = true;
    navigator.wakeLock.request("screen").then(function (lock) {
      flashcardWakeLockPending = false;
      flashcardWakeLock = lock;
      // Trình duyệt tự nhả khi trang bị ẩn (chuyển app, khoá màn hình) → xin lại khi trang hiện lại
      lock.addEventListener("release", function () {
        if (flashcardWakeLock === lock) flashcardWakeLock = null;
      });
      // Trạng thái có thể đã đổi trong lúc chờ
      if (!shouldKeepScreenOn()) syncFlashcardWakeLock();
    }).catch(function () {
      flashcardWakeLockPending = false;
    });
  }

  /** Khoá cuộn trang khi đang ở Flashcard (CSS chỉ áp dụng ở màn hình nhỏ) — gọi lại mỗi khi đổi tab / đổi chế độ xem */
  function syncFlashcardScrollLock() {
    var locked = state.currentTab === "vocab" && state.ui.vocabViewMode === "flashcard";
    document.documentElement.classList.toggle("vocab-flashcard-scroll-lock", locked);
  }

  function setupFlashcardWakeLock() {
    document.addEventListener("visibilitychange", syncFlashcardWakeLock);
    // Một số trình duyệt (Safari) chỉ cho xin wake lock sau thao tác của người dùng → thử lại khi chạm / bấm phím
    ["pointerup", "keydown"].forEach(function (type) {
      document.addEventListener(type, function () {
        if (!flashcardWakeLock) syncFlashcardWakeLock();
      }, { capture: true, passive: true });
    });
  }

  /** Đồng bộ state khi người dùng thoát fullscreen bằng Esc/F11 (không qua nút toggle) */
  function setupVocabFlashcardFullscreen() {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !state.ui.vocabFlashcardFullscreen) return;
      exitVocabFlashcardFullscreen();
      renderVocabList();
    });
    document.addEventListener("fullscreenchange", function () {
      if (!document.fullscreenElement && state.ui.vocabFlashcardFullscreen) {
        state.ui.vocabFlashcardFullscreen = false;
        renderVocabList();
      }
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
        if (e.target.closest("#nav-menu-reload")) {
          window.location.reload();
          return;
        }
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

  function applyVocabScreenDefaultsToTestState() {
    var screenFrom = parseInt(state.filter.vocabLessonFrom, 10);
    var screenTo = parseInt(state.filter.vocabLessonTo, 10);
    state.testState.lessonMin = isNaN(screenFrom) ? 1 : screenFrom;
    state.testState.lessonMax = isNaN(screenTo) ? 50 : screenTo;
    state.testState.selectedCategory = state.filter.vocabCategory || "all";
  }

  function startVocabTest() {
    state.testState.mode = "config";
    state.testState.isActive = false;
    state.testState.isFinished = false;
    state.testState.questions = [];
    state.testState.currentIndex = 0;
    state.testState.correctCount = 0;
    state.testState.answers = [];
    applyVocabScreenDefaultsToTestState();
    state.testState.questionCount = 20;
    state.testState.optionCount = 6;
    state.testState.questionField = "hiragana";
    state.testState.answerField = "meaning";
    renderTestInitialMessage();
  }

  /** Bấm "Ôn lại từ chưa thuộc": bỏ qua màn hình cấu hình, vào thẳng bài trắc nghiệm chỉ gồm các từ
   * đang mastery_score < 60 (không giới hạn theo bài/category đang lọc trên màn hình). */
  function startVocabReviewTest() {
    var reviewPool = getVocabReviewList().filter(function (raw) {
      return raw && !isVocabHidden(raw) && String(raw.hiragana || raw.Hiragana || "").trim();
    });
    if (reviewPool.length === 0) {
      alert("Chưa có từ nào cần ôn lại (mastery score đều ổn hoặc chưa đủ dữ liệu).");
      return;
    }
    startVocabQuickChoiceTest("review", pickVocabTestQueue(reviewPool, 20));
  }

  /** Bấm "📅 Ôn hôm nay": trắc nghiệm các từ đã đến hạn ôn theo lịch lặp lại ngắt quãng (tối đa 20 câu/lượt). */
  function startVocabDailyReview() {
    var duePool = getVocabDailyDueList();
    if (duePool.length === 0) {
      var tomorrowCount = getVocabDailyDueList(1).length;
      alert("Hôm nay không còn từ nào đến hạn ôn." +
        (tomorrowCount ? " Ngày mai có " + tomorrowCount + " từ." : " Hãy làm thêm bài test để lên lịch ôn cho từ mới."));
      return;
    }
    startVocabQuickChoiceTest("daily", pickVocabTestQueue(duePool, 20));
  }

  /** Vào thẳng bài trắc nghiệm Hiragana -> Nghĩa (6 đáp án) với bộ câu hỏi cho sẵn, đáp án nhiễu lấy từ toàn bộ từ vựng. */
  function startVocabQuickChoiceTest(mode, questions) {
    var questionCount = questions.length;
    state.testState.mode = mode;
    state.testState.isActive = true;
    state.testState.isFinished = false;
    state.testState.questions = questions;
    state.testState.currentIndex = 0;
    state.testState.correctCount = 0;
    state.testState.answers = [];
    state.testState.selectedCategory = "all";
    state.testState.lessonMin = 1;
    state.testState.lessonMax = 999;
    state.testState.questionCount = questionCount;
    state.testState.optionCount = 6;
    state.testState.questionField = "hiragana";
    state.testState.answerField = "meaning";
    state.testState.isStar = false;
    state.testState.isNotMastered = false;
    state.testState.readAfterAnswer = true;
    renderTestQuestion();
  }

  /** "Ôn lại câu sai": chạy lại ngay bài trắc nghiệm chỉ gồm các từ vừa sai, giữ nguyên cấu hình của lượt trước. */
  function startVocabRetryWrong(questions) {
    var ts = state.testState;
    ts.isActive = true;
    ts.isFinished = false;
    ts.questions = shuffleArray(questions);
    ts.currentIndex = 0;
    ts.correctCount = 0;
    ts.answers = [];
    renderTestQuestion();
  }

  function resetVocabTest() {
    state.testState.mode = "config";
    state.testState.isActive = false;
    state.testState.isFinished = false;
    state.testState.questions = [];
    state.testState.currentIndex = 0;
    state.testState.correctCount = 0;
    state.testState.answers = [];
    applyVocabScreenDefaultsToTestState();
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

    applyMasteryTestResult(getVocabDupKey(questionWord), "choice", { isCorrect: isCorrect });

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
      isCorrect: isCorrect,
      raw: testState.questions[testState.currentIndex]
    });

    // Sau khi chọn đáp án thì đọc lại từ vựng (hiragana) bằng TTS (nếu bật trong config)
    if (ttsText && testState.readAfterAnswer !== false) {
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

  var KANJI_TEST_MODE_DEFS = [
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

  function getKanjiSttMax(level) {
    var max = 0;
    kanjiData.forEach(function (item, i) {
      if (!item) return;
      if (level && level !== "all" && (item.level || "n45") !== level) return;
      var stt = item.stt != null ? item.stt : (i + 1);
      if (stt > max) max = stt;
    });
    return max || 1;
  }

  function buildKanjiTestQuestions(config) {
    var level = config.level || "all";
    var fromStt = (config.fromStt != null) ? config.fromStt : 1;
    var toStt = (config.toStt != null) ? config.toStt : Infinity;
    var selectedModes = (config.modes && config.modes.length > 0) ? config.modes : [4];
    var count = config.questionCount || 20;
    var isStar = !!config.isStar;

    var candidates = [];
    kanjiData.forEach(function (raw, i) {
      if (!raw) return;
      if (level !== "all" && (raw.level || "n45") !== level) return;
      var stt = raw.stt != null ? raw.stt : (i + 1);
      if (stt < fromStt || stt > toStt) return;
      if (isStar && !state.kanjiFavorites[i]) return;
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
    });
    return pickKanjiTestQueue(candidates, count);
  }

  /** Bấm "🔁 Ôn lại Kanji chưa thuộc": bỏ qua màn hình cấu hình, vào thẳng bài test Kanji chỉ gồm các
   * mục đang mastery_score < 60, trộn ngẫu nhiên 2 dạng câu hỏi:
   * Kanji -> Hán Việt (mode 4) và Từ vựng (của kanji) -> Nghĩa (mode 5). */
  function startKanjiReviewTest() {
    var candidates = getKanjiReviewCandidates();
    if (candidates.length === 0) {
      alert("Chưa có Kanji/từ vựng kanji nào cần ôn lại (mastery score đều ổn hoặc chưa đủ dữ liệu).");
      return;
    }
    var ts = state.kanjiTestState;
    var questionCount = Math.min(20, candidates.length);
    var questions = pickKanjiTestQueue(candidates, questionCount);

    ts.showAnswerKanjiDetailAfterEach = false;
    ts.level = "all";
    ts.fromStt = 1;
    ts.toStt = null;
    ts.questionCount = questionCount;
    ts.optionCount = 6;
    ts.modes = [4, 5];
    ts.isStar = false;
    ts.isActive = true;
    ts.isFinished = false;
    ts.currentIndex = 0;
    ts.correctCount = 0;
    ts.answers = [];
    ts.questions = questions;
    renderKanjiTestQuestion();
  }

  function buildVocabKanjiHanVietHint(word, raw) {
    if (!word) return "";
    var parts = [];
    for (var ch of word) {
      var code = ch.codePointAt(0);
      var isCjk = (code >= 0x4E00 && code <= 0x9FFF) || (code >= 0x3400 && code <= 0x4DBF);
      if (!isCjk) continue;
      var hv = (ch === raw.kanji && raw.hanviet)
        ? raw.hanviet
        : ((window.KANJI_HAN_VIET && window.KANJI_HAN_VIET[ch]) || "");
      parts.push(hv ? (ch + " " + hv) : ch);
    }
    return parts.join(" | ");
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
      questionHint = ve.reading + "　[" + buildVocabKanjiHanVietHint(ve.word, raw) + "]";
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
    var currentLevel = ts.level || "all";
    var maxStt = getKanjiSttMax(currentLevel);

    const wrapper = createElement("div", "test-result test-config-form", "");

    // --- Level ---
    const levelSection = createElement("div", "kt-section", "");
    levelSection.appendChild(createElement("div", "kt-section-label", "Cấp độ"));
    const levelField = createElement("div", "field-group", "");
    const levelSelect = document.createElement("select");
    levelSelect.className = "input-text";
    [
      { value: "all", label: "Tất cả" },
      { value: "n45", label: "N4-N5" },
      { value: "n3", label: "N3" }
    ].forEach(function (opt) {
      var optEl = document.createElement("option");
      optEl.value = opt.value;
      optEl.textContent = opt.label;
      levelSelect.appendChild(optEl);
    });
    levelSelect.value = currentLevel;
    levelField.appendChild(levelSelect);
    levelSection.appendChild(levelField);
    wrapper.appendChild(levelSection);

    // --- Range (theo STT trong data, không phải số thứ tự đếm tự động) ---
    const rangeSection = createElement("div", "kt-section", "");
    const rangeRow = createElement("div", "kt-range-row", "");

    const fromField = createElement("div", "field-group", "");
    fromField.appendChild(createElement("div", "field-label", "Từ STT"));
    const fromInput = createElement("input", "input-text", "");
    fromInput.type = "number"; fromInput.min = 1; fromInput.max = maxStt;
    fromInput.value = String(ts.fromStt != null ? ts.fromStt : 1);
    fromField.appendChild(fromInput);

    const toField = createElement("div", "field-group", "");
    toField.appendChild(createElement("div", "field-label", "Đến STT"));
    const toInput = createElement("input", "input-text", "");
    toInput.type = "number"; toInput.min = 1; toInput.max = maxStt;
    toInput.value = String(ts.toStt != null ? ts.toStt : maxStt);
    toField.appendChild(toInput);

    levelSelect.addEventListener("change", function () {
      var newMax = getKanjiSttMax(levelSelect.value);
      fromInput.max = newMax;
      toInput.max = newMax;
      if (parseInt(toInput.value, 10) > newMax || !toInput.value) {
        toInput.value = String(newMax);
      }
      if (parseInt(fromInput.value, 10) > newMax || !fromInput.value) {
        fromInput.value = "1";
      }
    });

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
    var modeDefs = KANJI_TEST_MODE_DEFS;
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
      var levelVal = levelSelect.value || "all";
      var currentMaxStt = getKanjiSttMax(levelVal);
      var fromVal = parseInt(fromInput.value, 10);
      var toVal = parseInt(toInput.value, 10);
      if (isNaN(fromVal) || fromVal < 1) fromVal = 1;
      if (isNaN(toVal) || toVal < fromVal) toVal = fromVal;
      if (fromVal > currentMaxStt) fromVal = currentMaxStt;
      if (toVal > currentMaxStt) toVal = currentMaxStt;

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
      ts.level = levelVal;
      ts.fromStt = fromVal;
      ts.toStt = toVal;
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
        level: ts.level,
        fromStt: ts.fromStt,
        toStt: ts.toStt,
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
    const wrongCandidates = collectWrongItems(testState.answers, "candidate");
    if (wrongCandidates.length > 0) {
      btnRow.appendChild(createRetryWrongButton(wrongCandidates.length, function () {
        startKanjiRetryWrong(wrongCandidates);
      }));
    }
    const retryBtn = createElement("button", wrongCandidates.length > 0 ? "btn-ghost" : "btn", "Làm lại");
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

  /** "Ôn lại câu sai" của test Kanji: chạy lại ngay các câu vừa sai (đúng dạng câu hỏi cũ), giữ nguyên cấu hình. */
  function startKanjiRetryWrong(candidates) {
    var ts = state.kanjiTestState;
    ts.isActive = true;
    ts.isFinished = false;
    ts.questions = shuffleArray(candidates);
    ts.currentIndex = 0;
    ts.correctCount = 0;
    ts.answers = [];
    renderKanjiTestQuestion();
  }

  function handleKanjiSelectAnswer(item, mode, correct, selected, kanjiIdxForReveal) {
    var testState = state.kanjiTestState;
    var isCorrect = selected === correct;

    var masteryKey = (mode >= 5 && mode <= 9 && item && item.ve)
      ? getKanjiVocabDupKey({ kanji: item.kanji }, item.ve)
      : getKanjiDupKey({ kanji: item && item.kanji });
    applyKanjiMasteryTestResult(masteryKey, "choice", { isCorrect: isCorrect });

    if (isCorrect) testState.correctCount += 1;
    testState.answers.push({
      item: item, mode: mode, correct: correct, selected: selected, isCorrect: isCorrect,
      candidate: testState.questions[testState.currentIndex]
    });

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
    const radicalMatrix = document.getElementById("kanji-radical-matrix");

    // Đếm số Kanji (ở MỌI cấp độ) sở hữu từng bộ thủ, để xếp bộ thủ nhiều chữ nhất lên trước.
    const radicalCounts = new Map();
    kanjiData.forEach(function (k) {
      String(k.radicals || "")
        .split("|")
        .map(function (rad) { return rad.trim(); })
        .filter(function (rad) { return rad; })
        .filter(function (rad, idx, arr) { return arr.indexOf(rad) === idx; }) // 1 kanji chỉ đếm 1 lần / bộ thủ
        .forEach(function (rad) {
          radicalCounts.set(rad, (radicalCounts.get(rad) || 0) + 1);
        });
    });

    const radicals = Array.from(radicalCounts.keys()).sort(function (a, b) {
      const countDiff = radicalCounts.get(b) - radicalCounts.get(a);
      if (countDiff !== 0) return countDiff;
      return getRadicalVietnameseLabel(a).localeCompare(
        getRadicalVietnameseLabel(b),
        "vi",
        { sensitivity: "base" }
      );
    });

    if (radicalMatrix) {
      radicalMatrix.innerHTML = "";
      radicals.forEach(function (radical) {
        const dashIdx = radical.indexOf("-");
        const radicalChar = dashIdx === -1 ? radical : radical.slice(0, dashIdx);
        const tile = createElement("div", "radical-tile", "");
        tile.setAttribute("data-radical", radical);
        tile.setAttribute("role", "option");
        tile.setAttribute("aria-selected", "false");
        tile.title = radical + " (" + radicalCounts.get(radical) + " chữ)";

        const charEl = createElement("div", "radical-tile-char", radicalChar);
        const labelEl = createElement("div", "radical-tile-label", getRadicalVietnameseLabel(radical));
        const countEl = createElement("div", "radical-tile-count", String(radicalCounts.get(radical)));
        tile.appendChild(charEl);
        tile.appendChild(labelEl);
        tile.appendChild(countEl);
        radicalMatrix.appendChild(tile);
      });

      radicalMatrix.addEventListener("click", function (e) {
        const tile = e.target.closest("[data-radical]");
        if (!tile) return;
        const radical = tile.getAttribute("data-radical");
        const current = Array.isArray(state.filter.kanjiRadical) ? state.filter.kanjiRadical.slice() : [];
        const idx = current.indexOf(radical);
        if (idx === -1) {
          current.push(radical);
        } else {
          current.splice(idx, 1);
        }
        state.filter.kanjiRadical = current;
        syncRadicalMatrixActiveState();
        // Bộ thủ được chọn có thể chỉ xuất hiện ở N4-N5 hoặc chỉ ở N3 — luôn hiện tất cả cấp độ khi lọc theo bộ thủ.
        setKanjiLevelFilterToAll();
        renderKanjiList();
      });
    }

    const params2 = new URLSearchParams(window.location.search);
    const searchKanji = params2.get("kanji");
    params2.delete("kanji");

    const newUrl =
      window.location.pathname +
      (params2.toString() ? "?" + params2.toString() : "") +
      window.location.hash;
    history.replaceState({}, "", newUrl);

    var kanjiSearchInput = document.getElementById("kanji-search-input");
    kanjiSearchInput.value = searchKanji;
    state.filter.kanjiSearch = searchKanji;
    state.filter.kanjiLevel = "n3";
    if (searchKanji) {
        kanjiSearchInput.value = searchKanji;
        state.filter.kanjiSearch = searchKanji;
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
        syncRadicalMatrixActiveState();
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

    var addVocabBtnKanji = document.getElementById("add-vocab-btn-kanji");
    if (addVocabBtnKanji) {
      addVocabBtnKanji.addEventListener("click", function () {
        const word = kanjiSearchInput.value.trim();
        window.location.href = `addVocab/index.html${word ? "?word=" + encodeURIComponent(word) : ""}`;
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
        state.kanjiTestState.level = state.filter.kanjiLevel || "all";
        state.kanjiTestState.fromStt = 1;
        state.kanjiTestState.toStt = null;
        renderKanjiTestInitialMessage();
      });
    }

    const startKanjiReviewBtn = document.getElementById("start-kanji-review-btn");
    if (startKanjiReviewBtn) {
      startKanjiReviewBtn.addEventListener("click", function () {
        startKanjiReviewTest();
      });
    }
  }

  // ----- Test mapping (vocab + kanji) -----
  var MAPPING_DIFFICULTY_PRESETS = [
    { key: "easy", label: "Dễ", seconds: 90 },
    { key: "medium", label: "Vừa", seconds: 60 },
    { key: "hard", label: "Khó", seconds: 30 }
  ];

  function buildVocabMappingPool(config) {
    var pool = vocabData.filter(function (raw) {
      if (!raw) return false;
      if (isVocabHidden(raw)) return false;
      var idx = vocabData.indexOf(raw);
      if (config.isStar && !state.vocabFavorites[idx]) return false;
      if (config.isNotMastered && state.vocabMastered[idx]) return false;
      var lesson = raw.lesson != null ? raw.lesson : raw.Lesson;
      var lessonNum = typeof lesson === "number" ? lesson : parseInt(lesson, 10);
      if (isNaN(lessonNum) || lessonNum < config.lessonMin || lessonNum > config.lessonMax) return false;
      var hira = raw.hiragana != null ? raw.hiragana : raw.Hiragana;
      if (!String(hira || "").trim()) return false;
      if (config.selectedCategory !== "all" && String(raw.category) !== String(config.selectedCategory)) return false;
      return true;
    });
    var items = pool.map(function (raw, i) {
      var normalized = {
        hiragana: raw.hiragana != null ? raw.hiragana : raw.Hiragana,
        kanji: raw.kanji != null ? raw.kanji : raw.Kanji,
        meaning: raw.meaning != null ? raw.meaning : raw.Meaning
      };
      var q = String(normalized[config.questionField] || "").trim();
      var a = String(normalized[config.answerField] || "").trim();
      if (!q || !a) return null;
      return { pairId: "v" + i, question: q, answer: a, vocabKey: getVocabDupKey(raw) };
    }).filter(Boolean);
    // Ưu tiên đưa từ điểm thấp/cold-start/đến hạn ôn lại vào các round đầu (ts.usedCount đi tuần tự theo thứ tự pool)
    return sortByMasteryPriority(shuffleArray(items), function (p) { return p.vocabKey; });
  }

  function mappingPairForKanjiMode(raw, mode, ve) {
    if (mode === 1) return { q: raw.kanji, a: raw.on_reading.split("|")[0].trim() };
    if (mode === 2) return { q: raw.kanji, a: raw.kun_reading.split("|")[0].trim() };
    if (mode === 3) return { q: raw.hanviet, a: raw.kanji };
    if (mode === 4) return { q: raw.kanji, a: raw.hanviet };
    if (mode === 5) return { q: ve.word, a: ve.meaning };
    if (mode === 6) return { q: ve.meaning, a: ve.word };
    if (mode === 7) return { q: ve.meaning, a: ve.reading };
    if (mode === 8) return { q: ve.reading, a: ve.word };
    if (mode === 9) return { q: ve.reading, a: ve.meaning };
    return null;
  }

  function buildKanjiMappingPool(config) {
    var maxStt = getKanjiSttMax(config.level);
    var toStt = (config.toStt != null) ? config.toStt : maxStt;
    var selectedModes = (config.modes && config.modes.length > 0) ? config.modes : [4];
    var pool = [];
    kanjiData.forEach(function (raw, i) {
      if (!raw) return;
      if (config.level !== "all" && (raw.level || "n45") !== config.level) return;
      var stt = raw.stt != null ? raw.stt : (i + 1);
      if (stt < config.fromStt || stt > toStt) return;
      if (config.isStar && !state.kanjiFavorites[i]) return;
      selectedModes.forEach(function (mode) {
        if (!kanjiModeAvailable(raw, mode)) return;
        if (mode >= 5 && mode <= 9) {
          parseKanjiVocab(raw.vocabulary).forEach(function (ve, vi) {
            var pair = mappingPairForKanjiMode(raw, mode, ve);
            var q = String((pair && pair.q) || "").trim();
            var a = String((pair && pair.a) || "").trim();
            if (!q || !a) return;
            pool.push({ pairId: "k" + i + "-m" + mode + "-" + vi, question: q, answer: a, vocabKey: getKanjiVocabDupKey(raw, ve) });
          });
        } else {
          var pair = mappingPairForKanjiMode(raw, mode, null);
          var q = String((pair && pair.q) || "").trim();
          var a = String((pair && pair.a) || "").trim();
          if (!q || !a) return;
          pool.push({ pairId: "k" + i + "-m" + mode, question: q, answer: a, vocabKey: getKanjiDupKey(raw) });
        }
      });
    });
    // Ưu tiên đưa cặp điểm thấp/cold-start/đến hạn ôn lại vào các round đầu
    return sortByMasteryPriority(shuffleArray(pool), function (p) { return p.vocabKey; }, state.kanjiMastery);
  }

  function startMappingTest(source) {
    var ts = state.mappingTestState;
    ts.isActive = false;
    ts.isFinished = false;
    ts.source = source;
    ts.pool = [];
    ts.usedCount = 0;
    ts.wrongCount = 0;
    ts.correctCount = 0;
    ts.roundTiles = [];
    ts.selectedTileId = null;
    ts.locked = false;
    ts.endReason = "";
    ts.lives = 3;
    if (source === "kanji") {
      ts.level = state.filter.kanjiLevel || "all";
      ts.fromStt = 1;
      ts.toStt = null;
    } else {
      var screenFrom = parseInt(state.filter.vocabLessonFrom, 10);
      var screenTo = parseInt(state.filter.vocabLessonTo, 10);
      ts.lessonMin = isNaN(screenFrom) ? 1 : screenFrom;
      ts.lessonMax = isNaN(screenTo) ? 50 : screenTo;
      ts.selectedCategory = state.filter.vocabCategory || "all";
    }
    renderMappingTestInitialMessage();
  }

  function renderMappingTestInitialMessage() {
    clearMappingTestTimer();
    if (detailModalState.el) {
      detailModalState.el.classList.remove("detail-modal--mapping");
    }
    var ts = state.mappingTestState;
    var isKanji = ts.source === "kanji";
    var wrapper = createElement("div", "test-result test-config-form", "");

    var configFields = [];

    if (isKanji) {
      var maxStt = getKanjiSttMax(ts.level || "all");
      var levelSection = createElement("div", "kt-section", "");
      levelSection.appendChild(createElement("div", "kt-section-label", "Cấp độ"));
      var levelField = createElement("div", "field-group", "");
      var levelSelect = document.createElement("select");
      levelSelect.className = "input-text";
      [
        { value: "all", label: "Tất cả" },
        { value: "n45", label: "N4-N5" },
        { value: "n3", label: "N3" }
      ].forEach(function (opt) {
        var optEl = document.createElement("option");
        optEl.value = opt.value;
        optEl.textContent = opt.label;
        levelSelect.appendChild(optEl);
      });
      levelSelect.value = ts.level || "all";
      levelField.appendChild(levelSelect);
      levelSection.appendChild(levelField);
      wrapper.appendChild(levelSection);

      var rangeSection = createElement("div", "kt-section", "");
      var rangeRow = createElement("div", "kt-range-row", "");
      var fromField = createElement("div", "field-group", "");
      fromField.appendChild(createElement("div", "field-label", "Từ STT"));
      var fromInput = createElement("input", "input-text", "");
      fromInput.type = "number"; fromInput.min = 1; fromInput.max = maxStt;
      fromInput.value = String(ts.fromStt != null ? ts.fromStt : 1);
      fromField.appendChild(fromInput);

      var toField = createElement("div", "field-group", "");
      toField.appendChild(createElement("div", "field-label", "Đến STT"));
      var toInput = createElement("input", "input-text", "");
      toInput.type = "number"; toInput.min = 1; toInput.max = maxStt;
      toInput.value = String(ts.toStt != null ? ts.toStt : maxStt);
      toField.appendChild(toInput);

      levelSelect.addEventListener("change", function () {
        var newMax = getKanjiSttMax(levelSelect.value);
        fromInput.max = newMax;
        toInput.max = newMax;
        if (parseInt(toInput.value, 10) > newMax || !toInput.value) {
          toInput.value = String(newMax);
        }
      });

      rangeRow.appendChild(fromField);
      rangeRow.appendChild(toField);
      rangeSection.appendChild(rangeRow);
      wrapper.appendChild(rangeSection);

      var starSection = createElement("div", "kt-section", "");
      var starField = createElement("div", "field-group", "");
      var starLabel = createElement("div", "field-label", "Chỉ dùng chữ có ★");
      var starInput = createElement("input", "", "");
      starInput.type = "checkbox";
      starInput.style = "text-align: left";
      starInput.checked = ts.isStar || false;
      starField.appendChild(starLabel);
      starField.appendChild(starInput);
      starSection.appendChild(starField);
      wrapper.appendChild(starSection);

      var modeSection = createElement("div", "kt-section", "");
      modeSection.appendChild(createElement("div", "kt-section-label", "Dạng câu hỏi"));
      var modeGrid = createElement("div", "kt-mode-grid", "");
      var savedModes = ts.modes || [4];
      var modeCheckboxes = [];
      KANJI_TEST_MODE_DEFS.forEach(function (def) {
        var lbl = createElement("label", "kt-mode-label", "");
        var cb = document.createElement("input");
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

      configFields.push({ levelSelect: levelSelect, fromInput: fromInput, toInput: toInput, starInput: starInput, modeCheckboxes: modeCheckboxes });
    } else {
      var configGrid = createElement("div", "test-config-fields", "");

      var lessonMinField = createElement("div", "field-group", "");
      lessonMinField.appendChild(createElement("div", "field-label", "Từ bài"));
      var lessonMinInput = createElement("input", "input-text", "");
      lessonMinInput.type = "number"; lessonMinInput.min = 1; lessonMinInput.max = 999;
      lessonMinInput.value = String(ts.lessonMin != null ? ts.lessonMin : 1);
      lessonMinField.appendChild(lessonMinInput);
      configGrid.appendChild(lessonMinField);

      var lessonMaxField = createElement("div", "field-group", "");
      lessonMaxField.appendChild(createElement("div", "field-label", "Đến bài"));
      var lessonMaxInput = createElement("input", "input-text", "");
      lessonMaxInput.type = "number"; lessonMaxInput.min = 1; lessonMaxInput.max = 999;
      lessonMaxInput.value = String(ts.lessonMax != null ? ts.lessonMax : 50);
      lessonMaxField.appendChild(lessonMaxInput);
      configGrid.appendChild(lessonMaxField);

      var catField = createElement("div", "field-group", "");
      catField.style.gridColumn = "1 / -1";
      catField.appendChild(createElement("div", "field-label", "Category"));
      var catSelect = document.createElement("select");
      var optAll = document.createElement("option");
      optAll.value = "all"; optAll.textContent = "Tất cả";
      catSelect.appendChild(optAll);
      var categories = getUniqueSorted(
        vocabData.map(function (v) { return v.category; }).filter(function (c) { return c; })
      );
      categories.forEach(function (cat) {
        var o = document.createElement("option");
        o.value = cat;
        o.textContent = getCategoryLabel(cat);
        catSelect.appendChild(o);
      });
      catSelect.value = ts.selectedCategory || "all";
      catField.appendChild(catSelect);
      configGrid.appendChild(catField);

      var fieldOptions = [
        { value: "hiragana", label: "Hiragana" },
        { value: "kanji", label: "Kanji" },
        { value: "meaning", label: "Nghĩa tiếng Việt" }
      ];

      var qFieldGroup = createElement("div", "field-group", "");
      qFieldGroup.appendChild(createElement("div", "field-label", "Cột 1"));
      var qFieldSelect = document.createElement("select");
      fieldOptions.forEach(function (fo) {
        var o = document.createElement("option");
        o.value = fo.value; o.textContent = fo.label;
        if (fo.value === (ts.questionField || "hiragana")) o.selected = true;
        qFieldSelect.appendChild(o);
      });
      qFieldGroup.appendChild(qFieldSelect);
      configGrid.appendChild(qFieldGroup);

      var aFieldGroup = createElement("div", "field-group", "");
      aFieldGroup.appendChild(createElement("div", "field-label", "Cột 2"));
      var aFieldSelect = document.createElement("select");
      fieldOptions.forEach(function (fo) {
        var o = document.createElement("option");
        o.value = fo.value; o.textContent = fo.label;
        if (fo.value === (ts.answerField || "meaning")) o.selected = true;
        aFieldSelect.appendChild(o);
      });
      aFieldGroup.appendChild(aFieldSelect);
      configGrid.appendChild(aFieldGroup);

      var starFieldV = createElement("div", "field-group", "");
      starFieldV.style.gridColumn = "1 / -1";
      var starLabelV = createElement("div", "field-label", "Chỉ dùng từ có ★");
      var starInputV = createElement("input", "", "");
      starInputV.type = "checkbox";
      starInputV.style = "text-align: left";
      starInputV.checked = ts.isStar || false;
      starFieldV.appendChild(starLabelV);
      starFieldV.appendChild(starInputV);
      configGrid.appendChild(starFieldV);

      var notMasteredFieldV = createElement("div", "field-group", "");
      notMasteredFieldV.style.gridColumn = "1 / -1";
      var notMasteredLabelV = createElement("div", "field-label", "Chỉ test từ chưa thuộc");
      var notMasteredInputV = createElement("input", "", "");
      notMasteredInputV.type = "checkbox";
      notMasteredInputV.style = "text-align: left";
      notMasteredInputV.checked = ts.isNotMastered || false;
      notMasteredFieldV.appendChild(notMasteredLabelV);
      notMasteredFieldV.appendChild(notMasteredInputV);
      configGrid.appendChild(notMasteredFieldV);

      wrapper.appendChild(configGrid);

      configFields.push({ lessonMinInput: lessonMinInput, lessonMaxInput: lessonMaxInput, catSelect: catSelect, qFieldSelect: qFieldSelect, aFieldSelect: aFieldSelect, starInput: starInputV, notMasteredInput: notMasteredInputV });
    }

    // --- Mức độ khó / giới hạn thời gian ---
    var diffSection = createElement("div", "kt-section", "");
    diffSection.appendChild(createElement("div", "kt-section-label", "Mức độ (giới hạn thời gian 1 lượt mapping)"));
    var diffRow = createElement("div", "kt-mode-grid", "");
    var diffRadios = [];
    var currentPresetKey = null;
    MAPPING_DIFFICULTY_PRESETS.forEach(function (preset) {
      if (ts.timeLimit === preset.seconds) currentPresetKey = preset.key;
    });
    MAPPING_DIFFICULTY_PRESETS.forEach(function (preset) {
      var lbl = createElement("label", "kt-mode-label", "");
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "mapping-difficulty";
      radio.value = String(preset.seconds);
      radio.checked = currentPresetKey ? preset.key === currentPresetKey : preset.key === "medium";
      lbl.appendChild(radio);
      lbl.appendChild(document.createTextNode(" " + preset.label + " (" + preset.seconds + "s)"));
      diffRadios.push(radio);
      diffRow.appendChild(lbl);
    });
    diffSection.appendChild(diffRow);

    var customField = createElement("div", "field-group", "");
    customField.appendChild(createElement("div", "field-label", "Hoặc tự nhập số giây (10-180)"));
    var customInput = createElement("input", "input-text", "");
    customInput.type = "number"; customInput.min = 10; customInput.max = 180;
    customInput.placeholder = "Ví dụ: 25";
    if (!currentPresetKey) {
      customInput.value = String(ts.timeLimit || 30);
    }
    customField.appendChild(customInput);
    diffSection.appendChild(customField);
    wrapper.appendChild(diffSection);

    var btnRow = createElement("div", "btn-row", "");
    var startBtn = createElement("button", "btn", "Bắt đầu mapping");
    startBtn.type = "button";
    startBtn.addEventListener("click", function () {
      var timeLimit = parseInt(customInput.value, 10);
      if (isNaN(timeLimit) || !customInput.value) {
        var checkedRadio = diffRadios.filter(function (r) { return r.checked; })[0];
        timeLimit = checkedRadio ? parseInt(checkedRadio.value, 10) : 30;
      }
      if (isNaN(timeLimit) || timeLimit < 10) timeLimit = 10;
      if (timeLimit > 180) timeLimit = 180;

      var pool;
      if (isKanji) {
        var cf = configFields[0];
        var maxSttVal = getKanjiSttMax(cf.levelSelect.value);
        var fromVal = parseInt(cf.fromInput.value, 10);
        var toVal = parseInt(cf.toInput.value, 10);
        if (isNaN(fromVal) || fromVal < 1) fromVal = 1;
        if (isNaN(toVal) || toVal < fromVal) toVal = fromVal;
        if (fromVal > maxSttVal) fromVal = maxSttVal;
        if (toVal > maxSttVal) toVal = maxSttVal;
        var selectedModes = cf.modeCheckboxes
          .filter(function (cb) { return cb.checked; })
          .map(function (cb) { return parseInt(cb.value, 10); });
        if (selectedModes.length === 0) selectedModes = [4];
        ts.level = cf.levelSelect.value || "all";
        ts.fromStt = fromVal;
        ts.toStt = toVal;
        ts.isStar = cf.starInput.checked || false;
        ts.modes = selectedModes;
        pool = buildKanjiMappingPool(ts);
      } else {
        var cfv = configFields[0];
        var lessonMinVal = parseInt(cfv.lessonMinInput.value, 10);
        var lessonMaxVal = parseInt(cfv.lessonMaxInput.value, 10);
        if (isNaN(lessonMinVal) || lessonMinVal < 1) lessonMinVal = 1;
        if (isNaN(lessonMaxVal) || lessonMaxVal < 1) lessonMaxVal = 50;
        if (lessonMaxVal < lessonMinVal) {
          var tmp = lessonMinVal; lessonMinVal = lessonMaxVal; lessonMaxVal = tmp;
        }
        var questionField = cfv.qFieldSelect.value || "hiragana";
        var answerField = cfv.aFieldSelect.value || "meaning";
        if (questionField === answerField) {
          alert("Cột 1 và Cột 2 không được trùng trường hiển thị.");
          return;
        }
        ts.lessonMin = lessonMinVal;
        ts.lessonMax = lessonMaxVal;
        ts.selectedCategory = cfv.catSelect.value || "all";
        ts.questionField = questionField;
        ts.answerField = answerField;
        ts.isStar = cfv.starInput.checked || false;
        ts.isNotMastered = cfv.notMasteredInput.checked || false;
        pool = buildVocabMappingPool(ts);
      }

      if (pool.length < 2) {
        alert("Không đủ dữ liệu phù hợp để tạo mapping (cần ít nhất 2 cặp). Hãy mở rộng phạm vi lọc.");
        return;
      }

      ts.timeLimit = timeLimit;
      ts.pool = pool;
      ts.usedCount = 0;
      ts.wrongCount = 0;
      ts.correctCount = 0;
      ts.isActive = true;
      ts.isFinished = false;
      ts.endReason = "";
      startMappingRound();
    });

    var cancelBtn = createElement("button", "btn-ghost", "Đóng");
    cancelBtn.type = "button";
    cancelBtn.addEventListener("click", function () { closeDetailModal(); });

    btnRow.appendChild(startBtn);
    btnRow.appendChild(cancelBtn);
    wrapper.appendChild(btnRow);

    if (detailModalState.bodyEl) {
      openDetailModal("", "");
      detailModalState.bodyEl.innerHTML = "";
      detailModalState.bodyEl.appendChild(wrapper);
    }
  }

  function startMappingRound() {
    var ts = state.mappingTestState;
    var remaining = ts.pool.length - ts.usedCount;
    if (remaining <= 0) {
      // Hết pool: xáo lại và tiếp tục random mapping thay vì kết thúc bài test
      ts.pool = shuffleArray(ts.pool);
      ts.usedCount = 0;
      remaining = ts.pool.length;
    }
    var batchSize = Math.min(ts.pairsPerRound, remaining);
    var batch = ts.pool.slice(ts.usedCount, ts.usedCount + batchSize);
    ts.usedCount += batchSize;

    var tiles = [];
    batch.forEach(function (pair, i) {
      tiles.push({ id: pair.pairId + "-q", pairId: pair.pairId, text: pair.question, matched: false, vocabKey: pair.vocabKey });
      tiles.push({ id: pair.pairId + "-a", pairId: pair.pairId, text: pair.answer, matched: false, vocabKey: pair.vocabKey });
    });
    ts.roundTiles = shuffleArray(tiles);
    ts.selectedTileId = null;
    ts.locked = false;
    ts.timeRemaining = ts.timeLimit;
    renderMappingTestGame();

    clearMappingTestTimer();
    mappingTestTimerId = setInterval(function () {
      ts.timeRemaining -= 1;
      var timerEl = document.getElementById("mapping-timer-value");
      if (timerEl) {
        timerEl.textContent = String(Math.max(0, ts.timeRemaining));
      }
      if (ts.timeRemaining <= 0) {
        clearMappingTestTimer();
        ts.isFinished = true;
        ts.endReason = "timeout";
        renderMappingTestResult();
      }
    }, 1000);
  }

  function renderMappingTestGame() {
    var ts = state.mappingTestState;
    if (detailModalState.el) {
      detailModalState.el.classList.add("detail-modal--mapping");
    }

    var wrapper = createElement("div", "mapping-game", "");

    var header = createElement("div", "mapping-header", "");

    var livesWrap = createElement("div", "mapping-lives", "");
    for (var i = 0; i < 3; i += 1) {
      var heart = createElement("span", "mapping-heart" + (i < ts.lives ? "" : " mapping-heart--lost"), "♥");
      livesWrap.appendChild(heart);
    }
    header.appendChild(livesWrap);

    var progressText = ts.usedCount + "/" + ts.pool.length + " cặp — 🏆 Điểm: " + ts.correctCount;
    header.appendChild(createElement("div", "mapping-progress-text", progressText));

    var timerWrap = createElement("div", "mapping-timer", "");
    timerWrap.appendChild(document.createTextNode("⏱ "));
    var timerValue = createElement("span", "", String(ts.timeRemaining));
    timerValue.id = "mapping-timer-value";
    timerWrap.appendChild(timerValue);
    timerWrap.appendChild(document.createTextNode("s"));
    header.appendChild(timerWrap);

    wrapper.appendChild(header);

    var grid = createElement("div", "mapping-grid", "");
    ts.roundTiles.forEach(function (tile) {
      var tileBtn = createElement("button", "mapping-tile", tile.text);
      tileBtn.type = "button";
      tileBtn.dataset.tileId = tile.id;
      if (tile.matched) {
        tileBtn.classList.add("mapping-tile--matched");
        tileBtn.disabled = true;
      }
      if (tile.id === ts.selectedTileId) {
        tileBtn.classList.add("mapping-tile--selected");
      }
      if (tile.wrongFlash) {
        tileBtn.classList.add("mapping-tile--wrong-flash");
      }
      tileBtn.addEventListener("click", function () {
        handleMappingTileClick(tile.id);
      });
      grid.appendChild(tileBtn);
    });
    wrapper.appendChild(grid);

    if (!state.displaySettings.iphoneTaiTho) {
      var btnRow = createElement("div", "btn-row", "");
      var quitBtn = createElement("button", "btn-ghost btn-ghost--danger", "Kết thúc");
      quitBtn.type = "button";
      quitBtn.addEventListener("click", function () {
        clearMappingTestTimer();
        ts.isFinished = true;
        ts.endReason = "quit";
        renderMappingTestResult();
      });
      btnRow.appendChild(quitBtn);
      wrapper.appendChild(btnRow);
    }

    if (detailModalState.bodyEl) {
      openDetailModal("", "");
      detailModalState.bodyEl.innerHTML = "";
      detailModalState.bodyEl.appendChild(wrapper);
    }
  }

  function handleMappingTileClick(tileId) {
    var ts = state.mappingTestState;
    if (!ts.isActive || ts.isFinished || ts.locked) return;
    var tile = ts.roundTiles.filter(function (t) { return t.id === tileId; })[0];
    if (!tile || tile.matched) return;

    if (!ts.selectedTileId) {
      ts.selectedTileId = tileId;
      renderMappingTestGame();
      return;
    }

    if (ts.selectedTileId === tileId) {
      ts.selectedTileId = null;
      renderMappingTestGame();
      return;
    }

    var firstTile = ts.roundTiles.filter(function (t) { return t.id === ts.selectedTileId; })[0];
    ts.selectedTileId = null;

    var applyMappingMastery = ts.source === "kanji" ? applyKanjiMasteryTestResult : applyMasteryTestResult;

    if (firstTile && firstTile.pairId === tile.pairId) {
      firstTile.matched = true;
      tile.matched = true;
      ts.correctCount += 1;
      if (tile.vocabKey) {
        applyMappingMastery(tile.vocabKey, "mapping", { isCorrect: true });
      }
      var remainingInRound = ts.roundTiles.filter(function (t) { return !t.matched; }).length;
      if (remainingInRound === 0) {
        clearMappingTestTimer();
        startMappingRound();
        return;
      }
      renderMappingTestGame();
    } else {
      ts.wrongCount += 1;
      // Không biết chắc user chưa thuộc bên nào, nên trừ điểm cả 2 mục liên quan đến cặp ghép sai
      if (firstTile && firstTile.vocabKey) {
        applyMappingMastery(firstTile.vocabKey, "mapping", { isCorrect: false });
      }
      if (tile.vocabKey && tile.vocabKey !== (firstTile && firstTile.vocabKey)) {
        applyMappingMastery(tile.vocabKey, "mapping", { isCorrect: false });
      }
      firstTile.wrongFlash = true;
      tile.wrongFlash = true;
      ts.locked = true;
      renderMappingTestGame();
      setTimeout(function () {
        firstTile.wrongFlash = false;
        tile.wrongFlash = false;
        ts.locked = false;
        ts.lives -= 1;
        if (ts.lives <= 0) {
          clearMappingTestTimer();
          ts.isFinished = true;
          ts.endReason = "lives";
          renderMappingTestResult();
          return;
        }
        renderMappingTestGame();
      }, 400);
    }
  }

  function renderMappingTestResult() {
    clearMappingTestTimer();
    var ts = state.mappingTestState;
    if (detailModalState.el) {
      detailModalState.el.classList.remove("detail-modal--mapping");
    }

    var wrapper = createElement("div", "test-result", "");
    var scoreMain = createElement("div", "score-main", "🏆 Điểm: " + ts.correctCount);
    wrapper.appendChild(scoreMain);

    var reasonText = "";
    if (ts.endReason === "timeout") {
      reasonText = "Hết giờ cho lượt mapping này.";
    } else if (ts.endReason === "lives") {
      reasonText = "Đã sai 3 lần, kết thúc bài test.";
    } else {
      reasonText = "Bạn đã dừng bài test.";
    }
    var scoreDetail = createElement("div", "score-detail", reasonText + " Số lần sai: " + ts.wrongCount + ".");
    wrapper.appendChild(scoreDetail);

    var btnRow = createElement("div", "btn-row", "");
    var retryBtn = createElement("button", "btn", "Làm lại");
    retryBtn.type = "button";
    retryBtn.addEventListener("click", function () {
      startMappingTest(ts.source);
    });
    var closeBtn = createElement("button", "btn-ghost", "Đóng");
    closeBtn.type = "button";
    closeBtn.addEventListener("click", function () { closeDetailModal(); });
    btnRow.appendChild(retryBtn);
    btnRow.appendChild(closeBtn);
    wrapper.appendChild(btnRow);

    if (detailModalState.bodyEl) {
      openDetailModal("Kết quả mapping", "");
      detailModalState.bodyEl.innerHTML = "";
      detailModalState.bodyEl.appendChild(wrapper);
    }
  }

  function setupMappingTestSection() {
    var startVocabMappingBtn = document.getElementById("start-vocab-mapping-btn");
    if (startVocabMappingBtn) {
      startVocabMappingBtn.addEventListener("click", function () {
        startMappingTest("vocab");
      });
    }
    var startKanjiMappingBtn = document.getElementById("start-kanji-mapping-btn");
    if (startKanjiMappingBtn) {
      startKanjiMappingBtn.addEventListener("click", function () {
        startMappingTest("kanji");
      });
    }
  }

  function setupGrammarFilters() {
    const lessonSelect = document.getElementById("grammar-lesson-filter");
    const checkboxGrammarN3 = document.getElementById("checkbox-grammar-n3");
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

    checkboxGrammarN3.addEventListener("change", function () {
        state.filter.checkboxGrammarN3 = checkboxGrammarN3.checked === true;
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

  /** Gắn sự kiện click cho từng chữ Hán bôi đậm trong kanjiEl (.vocab-kanji): mở chi tiết Kanji nếu có data, không thì gợi ý thêm mới */
  function wireVocabKanjiLinks(kanjiEl) {
    kanjiEl.querySelectorAll("b").forEach(function (b) {
      const index = kanjiData.findIndex(function (k) { return k.kanji === b.textContent; });
      if (index > 0) b.classList.add("vocab-kanji--linked");

      b.addEventListener("click", function (e) {
        e.stopPropagation();
        const clickedText = this.textContent;
        const idx = kanjiData.findIndex(function (item) { return item.kanji === clickedText; });
        if (idx > 0) {
          state.selected.kanjiIndex = idx;
          renderKanjiDetail();
        } else {
          openDetailModal("Thông báo", "<p>Không có data của chữ này!</p><a href='/jptest/addKanji/index.html?kanji=" + decodeURIComponent(this.textContent) + "'>Thêm từ kanji</a>");
        }
      });
    });
  }

  // ========================
  // INIT
  // ========================

  document.addEventListener("DOMContentLoaded", function () {
    // Merge N3 vocab từ các file vocabData_1.js, vocabData_2.js (nếu có)
    if (window._vocabExtra && window._vocabExtra.length) {
      vocabData.push.apply(vocabData, window._vocabExtra);
    }
    // Tự động ẩn các bản trùng nhau 100% (giữ lại bản cuối cùng)
    buildAutoDedupIndex();
    // Nền tảng từ vựng bị ẩn do trùng (data/dup.js), localStorage sẽ override lên trên
    loadVocabHiddenBaseline();
    // Merge N3 kanji từ các file kanjiData_1.js, kanjiData_2.js (nếu có)
    if (window._kanjiExtra && window._kanjiExtra.length) {
      kanjiData.push.apply(kanjiData, window._kanjiExtra);
    }

    if (window._grammarData && window._grammarData.length) {
      grammarData.push.apply(grammarData, window._grammarData);
    }

    setupTabs();
    setupKanjiDetailResumeListeners();
    setupVocabFilters();
    setupDisplaySettings();
    setupVocabViewModeToggle();
    setupVocabFlashcardFullscreen();
    setupFlashcardWakeLock();
    setupPipDebugPanel();
    setupTestSection();
    setupAssembleTestSection();
    setupVocabTestModeMenu();
    setupKanjiFilters();
    setupKanjiTestModeMenu();
    setupFabMenus();
    setupMappingTestSection();
    setupGrammarFilters();
    setupGrammarExercise();
    setupFilterToggles();
    setupNoteSelect();
    setupNoteSearch();
    setupNoteAnchors();
    setupDetailModal();
    setupDupTab();
    setupDailyReviewTab();

    renderDisplaySettingsUI();
    renderVocabList();
    renderKanjiList();
    renderKanjiDetail();
    renderGrammarList();
    renderGrammarDetail();
    renderScreen();

    if (!getLocationParams().get("tab")) {
      replaceLocationQuery({ tab: "vocab" });
    }
    handleLocationChange();
    tryRestoreKanjiDetailAfterResume();
  });
})();