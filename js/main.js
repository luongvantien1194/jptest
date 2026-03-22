(function () {
  "use strict";

  // ========================
  // DATA & LOADING SECTION
  // ========================
  // Data from grammarData.js, kanjiData.js, vocabData.js

  const state = {
    currentTab: "vocab",
    filter: {
      vocabLesson: "all",
      vocabCategory: "all",
      kanjiRadical: "all",
      grammarLesson: "all",
      vocabSearch: "",
      kanjiSearch: "",
      grammarSearch: ""
    },
    displaySettings: {
      hiragana: true,
      kanji: true,
      meaning: true,
      vru: false,
      type: true,
      note: false
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
      isStar: false
    },
    kanjiViewMode: "grid",
    note: {
      currentDocKey:
        window.DOC_CONFIG && window.DOC_CONFIG.defaultKey
          ? window.DOC_CONFIG.defaultKey
          : null
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
      }
    },
    vocabFavorites: {},
    kanjiFavorites: {},
    vocabFavOnly: false,
    kanjiFavOnly: false,
    autoPlay: {
      active: false,
      timer: null,
      filteredIndices: []
    }
  };

  // Load favorites from localStorage
  try {
    var savedVF = localStorage.getItem("jp_vocab_favorites");
    if (savedVF) state.vocabFavorites = JSON.parse(savedVF);
    var savedKF = localStorage.getItem("jp_kanji_favorites");
    if (savedKF) state.kanjiFavorites = JSON.parse(savedKF);
  } catch (e) {
    // ignore parse errors
  }

  function saveVocabFavorites() {
    try { localStorage.setItem("jp_vocab_favorites", JSON.stringify(state.vocabFavorites)); } catch (e) {}
  }
  function saveKanjiFavorites() {
    try { localStorage.setItem("jp_kanji_favorites", JSON.stringify(state.kanjiFavorites)); } catch (e) {}
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

  // Play vocab audio từ sounds/vol/{romaji}.mp3
  var _currentAudio = null;
  function playVocabAudio(audioKey, btn) {
    if (!audioKey) return;
    // Stop current if playing
    if (_currentAudio) {
      _currentAudio.pause();
      _currentAudio = null;
      var prevBtn = document.querySelector(".audio-btn--playing");
      if (prevBtn) prevBtn.classList.remove("audio-btn--playing");
    }
    var audio = new Audio("sounds/vol/" + audioKey + ".mp3");
    _currentAudio = audio;
    if (btn) btn.classList.add("audio-btn--playing");
    audio.addEventListener("ended", function () {
      if (btn) btn.classList.remove("audio-btn--playing");
      _currentAudio = null;
    });
    audio.addEventListener("error", function () {
      if (btn) btn.classList.remove("audio-btn--playing");
      _currentAudio = null;
    });
    audio.play().catch(function () {
      if (btn) btn.classList.remove("audio-btn--playing");
      _currentAudio = null;
    });
  }

  function createAudioBtn(audioKey) {
    var btn = createElement("button", "audio-btn", "🔊");
    btn.type = "button";
    btn.title = "Phát âm thanh";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      playVocabAudio(audioKey, btn);
    });
    return btn;
  }

  // ========================
  // AUTO-PLAY
  // ========================
  var _autoPlayIndex = 0;

  function stopAutoPlay() {
    state.autoPlay.active = false;
    if (_currentAudio) {
      _currentAudio.pause();
      _currentAudio = null;
    }
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

    // Find audio button inside this item and play (nếu có file)
    var audioBtn = currentItem.querySelector(".audio-btn");
    var vocabIdx = currentItem.getAttribute("data-vocab-index");
    var raw = vocabIdx != null ? vocabData[parseInt(vocabIdx)] : null;
    var hiraAuto = raw
      ? (raw.hiragana != null ? raw.hiragana : raw.Hiragana)
      : "";
    var audioKeyAuto = audioFileNameFromHiragana(hiraAuto || "");
    var hasAudioAuto = typeof listMp3 !== "undefined" &&
      Array.isArray(listMp3) &&
      listMp3.indexOf(audioKeyAuto) !== -1;

    if (hasAudioAuto && audioKeyAuto) {
      // Play audio and wait for it to finish, then move to next
      if (_currentAudio) {
        _currentAudio.pause();
        _currentAudio = null;
      }
      var prevBtn = document.querySelector(".audio-btn--playing");
      if (prevBtn) prevBtn.classList.remove("audio-btn--playing");

      var audio = new Audio("sounds/vol/" + audioKeyAuto + ".mp3");
      _currentAudio = audio;
      if (audioBtn) audioBtn.classList.add("audio-btn--playing");

      audio.addEventListener("ended", function () {
        if (audioBtn) audioBtn.classList.remove("audio-btn--playing");
        _currentAudio = null;
        if (!state.autoPlay.active) return;
        // Small delay before next word
        setTimeout(function () {
          _autoPlayIndex++;
          autoPlayNext();
        }, 500);
      });
      audio.addEventListener("error", function () {
        if (audioBtn) audioBtn.classList.remove("audio-btn--playing");
        _currentAudio = null;
        if (!state.autoPlay.active) return;
        // Skip to next on error after short delay
        setTimeout(function () {
          _autoPlayIndex++;
          autoPlayNext();
        }, 300);
      });
      audio.play().catch(function () {
        if (audioBtn) audioBtn.classList.remove("audio-btn--playing");
        _currentAudio = null;
        if (!state.autoPlay.active) return;
        setTimeout(function () {
          _autoPlayIndex++;
          autoPlayNext();
        }, 300);
      });
    } else {
      // No audio, move to next after short delay
      setTimeout(function () {
        _autoPlayIndex++;
        autoPlayNext();
      }, 800);
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
    "じゃ": "ja",  "じゅ": "ju",  "じょ": "jo",
    "びゃ": "bya", "びゅ": "byu", "びょ": "byo",
    "ぴゃ": "pya", "ぴゅ": "pyu", "ぴょ": "pyo"
  };

  const _HIRA_TABLE = {
    "あ":"a","い":"i","う":"u","え":"e","お":"o",
    "か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko",
    "さ":"sa","し":"shi","す":"su","せ":"se","そ":"so",
    "た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to",
    "な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no",
    "は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho",
    "ま":"ma","み":"mi","む":"mu","め":"me","も":"mo",
    "や":"ya","ゆ":"yu","よ":"yo",
    "ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro",
    "わ":"wa","を":"o",
    "ん":"n",
    "が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go",
    "ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo",
    "だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do",
    "ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo",
    "ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po",
    "ぁ":"a","ぃ":"i","ぅ":"u","ぇ":"e","ぉ":"o",
    "ゃ":"ya","ゅ":"yu","ょ":"yo",
    "っ":"",   // xử lý riêng (nhân đôi phụ âm)
    "ー":""    // xử lý riêng (kéo dài âm)
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

    const referenceDiv = createElement("div", "kd-writing-reference", String(kanjiChar));
    referenceDiv.style.pointerEvents = "none";
    canvasWrap.appendChild(referenceDiv);
    canvasWrap.appendChild(canvas);

    const actions = createElement("div", "kd-writing-actions", "");
    const toggleRefBtn = createElement("button", "kd-writing-btn", "Ẩn kanji mẫu");
    toggleRefBtn.type = "button";
    const clearBtn = createElement("button", "kd-writing-btn", "Clear");
    clearBtn.type = "button";

    toggleRefBtn.addEventListener("click", function () {
      var hidden = referenceDiv.style.visibility === "hidden";
      referenceDiv.style.visibility = hidden ? "visible" : "hidden";
      toggleRefBtn.textContent = hidden ? "Ẩn kanji mẫu" : "Hiện kanji mẫu";
    });
    clearBtn.addEventListener("click", function () {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    actions.appendChild(toggleRefBtn);
    actions.appendChild(clearBtn);

    wrap.appendChild(canvasWrap);
    wrap.appendChild(actions);

    (function initCanvasDrawing() {
      var ctx = canvas.getContext("2d");
      var drawing = false;

      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

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
      }
      function moveDraw(e) {
        if (!drawing) return;
        e.preventDefault();
        var pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
      function endDraw() {
        drawing = false;
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
    return vocabData.filter(function (item) {
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

      if (state.filter.vocabLesson !== "all" &&
          String(lessonValue) !== String(state.filter.vocabLesson)) {
        return false;
      }
      if (state.filter.vocabCategory !== "all" &&
          categoryValue !== state.filter.vocabCategory) {
        return false;
      }

      // Filter favorites only
      if (state.vocabFavOnly) {
        var idx = vocabData.indexOf(item);
        if (!state.vocabFavorites[idx]) {
          return false;
        }
      }

      return true;
    });
  }

  function renderVocabFilterSummary(filteredList) {
    const el = document.getElementById("vocab-filter-summary");
    const lessonsSet = new Set(
      filteredList.map(function (v) {
        return v.lesson != null ? v.lesson : v.Lesson;
      })
    );
    const categoriesSet = new Set(
      filteredList.map(function (v) { return v.category; })
    );

    const lessonLabel = state.filter.vocabLesson === "all"
      ? "Tất cả các bài"
      : "Bài " + state.filter.vocabLesson;
    const categoryLabel = state.filter.vocabCategory === "all"
      ? "Tất cả loại từ"
      : state.filter.vocabCategory + (categoriesSet.size === 1 ? "" : " (filtered)");

    el.textContent = lessonLabel + " · " + categoryLabel;
  }

  function renderVocabList() {
    // Stop auto-play when list re-renders
    if (state.autoPlay.active) {
      stopAutoPlay();
    }

    const listContainer = document.getElementById("vocab-list-container");
    const countLabel = document.getElementById("vocab-count-label");

    const filtered = applyVocabFilters();
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
      if (item.romaji) {
        const romajiEl = createElement("div", "vocab-romazi", "(" + item.romaji + ")");
        fields.push(romajiEl);
      }
      
      if (state.displaySettings.kanji && item.kanji) {
        const outputKanji = boldKanji(item.kanji);
      
        const kanjiEl = createElement("div", "vocab-kanji");
        kanjiEl.innerHTML = "(" + outputKanji + ") ";

        // Thêm event cho các thẻ <b> bên trong
        kanjiEl.querySelectorAll("b").forEach(b => {
          b.addEventListener("click", function () {
              const index = kanjiData.findIndex(item => item.kanji === this.textContent);

              if (index > 0) {
                state.selected.kanjiIndex = index;
                renderKanjiDetail();
              } else {
                openDetailModal("Thông báo", "<p>Không có data của chữ này!</p>");
              }

          });
        });
      
        fields.push(kanjiEl);
      }
      if (state.displaySettings.meaning && item.meaning) {
        const meanEl = createElement("div", "vocab-meaning", " "+item.meaning);
        fields.push(meanEl);
      }

      if (fields.length === 0) {
        const fallback = createElement("div", "vocab-hira", item.hiragana || item.kanji || "");
        fields.push(fallback);
      }

      fields.forEach(function (fieldEl) {
        mainRow.appendChild(fieldEl);
      });

      // Audio button: chỉ hiện nếu có file trong listMp3
      var audioKey = audioFileNameFromHiragana(item.hiragana || "");
      var hasAudio = typeof listMp3 !== "undefined" &&
        Array.isArray(listMp3) &&
        listMp3.indexOf(audioKey) !== -1;
      var audioBtn = hasAudio && audioKey ? createAudioBtn(audioKey) : null;

      var vocabTopRow = createElement("div", "", "");
      vocabTopRow.style.cssText = "display:flex;align-items:center;gap:4px";
      vocabTopRow.appendChild(mainRow);
      if (audioBtn) vocabTopRow.appendChild(audioBtn);
      vocabTopRow.appendChild(starBtn);
      mainRow.style.flex = "1";
      row.appendChild(vocabTopRow);

      const metaRow = createElement("div", "vocab-meta-row", "");
      const pillLesson = createElement(
        "span",
        "pill pill--lesson",
        "Bài " + (item.lesson != null ? item.lesson : item.Lesson)
      );
      metaRow.appendChild(pillLesson);

      if (state.displaySettings.type && item.type) {
        const pillType = createElement("span", "pill pill--type", item.type);
        metaRow.appendChild(pillType);
      }

      if (item.category) {
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
      linkToggle.textContent = isOpen ? "Ẩn tuỳ chọn cột" : "Hiện tuỳ chọn cột";
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

      var pool = vocabData.filter(function (raw) {
        if (!raw) {
          return false;
        } 
        // Filter favorites only
        if (isStar) {
          var idx = vocabData.indexOf(raw);
          // console.log(idx);
          if (!state.vocabFavorites[idx]) {
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

    // Lấy audioKey (romaji) để phát audio sau khi chọn đáp án
    var vocabIdForAudio = null;
    if (questionWord.hiragana) {
      var keyFromHira = audioFileNameFromHiragana(questionWord.hiragana);
      if (typeof listMp3 !== "undefined" &&
        Array.isArray(listMp3) &&
        listMp3.indexOf(keyFromHira) !== -1) {
        vocabIdForAudio = keyFromHira;
      }
    }

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

    const optionsGrid = createElement("div", "options-grid", "");
    shuffledOptions.forEach(function (opt, idx) {
      const btn = createElement("button", "option-btn", "");
      const idxSpan = createElement("span", "option-index", String(idx + 1));
      const textSpan = createElement("span", "", opt);
      btn.appendChild(idxSpan);
      btn.appendChild(textSpan);
      btn.addEventListener("click", function () {
        handleSelectAnswer(questionWord, correctAnswer, opt, vocabIdForAudio);
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
      if (state.filter.kanjiRadical !== "all") {
        var itemRadicals = String(item.radicals || "");
        if (itemRadicals.indexOf(state.filter.kanjiRadical) === -1) {
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

    var isGrid = state.kanjiViewMode === "grid";

    if (isGrid) {
      // ===== Grid view =====
      const grid = createElement("div", "kanji-grid", "");
      filtered.forEach(function (raw, displayIdx) {
        const globalIndex = kanjiData.indexOf(raw);
        const item = {
          stt: raw.stt != null ? raw.stt : (displayIdx + 1),
          kanji: raw.kanji,
          name: raw.hanviet
        };

        const cell = createElement("div", "kanji-grid-item", "");

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
        });
        cell.appendChild(starBtn);

        const charEl = createElement("div", "kanji-grid-char", item.kanji || "");
        const nameEl = createElement("div", "kanji-grid-name", item.name || "");
        cell.appendChild(charEl);
        cell.appendChild(nameEl);

        cell.addEventListener("click", function () {
          state.kanjiHistory = [];
          state.selected.kanjiIndex = globalIndex;
          renderKanjiDetail();
        });

        grid.appendChild(cell);
      });
      container.appendChild(grid);
    } else {
      // ===== List view (default) =====
      const list = createElement("div", "simple-list", "");
      filtered.forEach(function (raw, displayIdx) {
        const globalIndex = kanjiData.indexOf(raw);
        const item = {
          stt: raw.stt != null ? raw.stt : (displayIdx + 1),
          kanji: raw.kanji,
          name: raw.hanviet,
          kun: raw.kun_reading,
          on: raw.on_reading,
          core_meaning: raw.core_meaning
        };
        const row = createElement("div", "kl-item", "");
        row.setAttribute("data-kanji-index", String(globalIndex));

        // Sequential number badge (ưu tiên dùng stt trong dữ liệu)
        const numEl = createElement("div", "kl-num", String(item.stt));
        row.appendChild(numEl);

        // Large kanji character
        const charEl = createElement("div", "kl-char", item.kanji || "");
        row.appendChild(charEl);

        // Info block: hanviet + readings
        const infoEl = createElement("div", "kl-info", "");
        const nameEl = createElement("div", "kl-name", item.name || "");
        infoEl.appendChild(nameEl);

        const readingsEl = createElement("div", "kl-readings", "");
        if (item.on) {
          const onPill = createElement("span", "kl-pill kl-pill--on", item.on.replace(/\|/g, " · "));
          readingsEl.appendChild(onPill);
        }
        if (item.kun) {
          const kunPill = createElement("span", "kl-pill kl-pill--kun", item.kun.replace(/\|/g, " · "));
          readingsEl.appendChild(kunPill);
        }
        infoEl.appendChild(readingsEl);
        row.appendChild(infoEl);

        // Core meaning tag (right side)
        if (item.core_meaning) {
          const meaningEl = createElement("div", "kl-meaning", item.core_meaning);
          row.appendChild(meaningEl);
        }

        // Star button
        var isKanjiFav = !!state.kanjiFavorites[globalIndex];
        var kanjiStarBtn = createElement("button", "star-btn" + (isKanjiFav ? " star-btn--active" : ""), isKanjiFav ? "⭐" : "☆");
        kanjiStarBtn.type = "button";
        kanjiStarBtn.title = "Yêu thích";
        kanjiStarBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          if (state.kanjiFavorites[globalIndex]) {
            delete state.kanjiFavorites[globalIndex];
          } else {
            state.kanjiFavorites[globalIndex] = true;
          }
          saveKanjiFavorites();
          renderKanjiList();
        });
        row.appendChild(kanjiStarBtn);

        row.addEventListener("click", function () {
          state.kanjiHistory = [];
          state.selected.kanjiIndex = globalIndex;
          renderKanjiDetail();
        });

        list.appendChild(row);
      });

      container.appendChild(list);
    }
  }

  function renderKanjiDetail() {
    const container = document.getElementById("kanji-detail-container");
    container.innerHTML = "";

    if (state.selected.kanjiIndex == null) {
      const empty = createElement("div", "detail-empty", "Chưa chọn Kanji nào.");
      container.appendChild(empty);
      return;
    }

    const raw = kanjiData[state.selected.kanjiIndex];
    const item = {
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
    if (!item.kanji) {
      const notFound = createElement("div", "detail-empty", "Không tìm thấy dữ liệu Kanji.");
      container.appendChild(notFound);
      return;
    }

    // Hero: Kanji + Nghĩa + Hán Việt + sao
    const globalIndex = state.selected.kanjiIndex;
    const isKanjiFav = !!state.kanjiFavorites[globalIndex];
    const hero = createElement("div", "kd-hero", "");
    const starBtn = createElement(
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
      renderKanjiDetail();
    });
    hero.appendChild(starBtn);
    const indexLabel = createElement(
      "div",
      "kd-index",
      String(globalIndex + 1)
    );
    const kanjiEl = createElement("div", "kd-char", item.kanji);
    const meaningBadge = createElement("div", "kd-meaning-badge", item.core_meaning || "");
    const hanvietEl = createElement("div", "kd-hanviet", item.hanviet || "");
    hero.appendChild(indexLabel);
    hero.appendChild(kanjiEl);
    if (item.core_meaning) hero.appendChild(meaningBadge);
    if (item.hanviet) hero.appendChild(hanvietEl);
    container.appendChild(hero);

    // Section 1: Phát âm & Cấu tạo
    const sec1 = createElement("div", "kd-section kd-section--blue", "");
    const sec1Title = createElement("div", "kd-section-title", "Phát âm & Cấu tạo");
    sec1.appendChild(sec1Title);
    const sec1Grid = createElement("div", "kd-pills-grid", "");

    function addPillGroup(label, value, mod) {
      if (!value) return;
      const group = createElement("div", "kd-pill-group", "");
      const lbl = createElement("div", "kd-pill-label", label);
      const valWrap = createElement("div", "kd-pill-values", "");
      value.split("|").forEach(function (v) {
        var trimmed = String(v || "").trim();
        if (!trimmed) return;
        const pill = createElement("span", "kd-pill" + (mod ? " kd-pill--" + mod : ""), trimmed);
        valWrap.appendChild(pill);
      });
      group.appendChild(lbl);
      group.appendChild(valWrap);
      sec1Grid.appendChild(group);
    }

    addPillGroup("Âm On", item.on_reading, "on");
    addPillGroup("Âm Kun", item.kun_reading, "kun");

    if (item.stroke_count != null) {
      const strokeGroup = createElement("div", "kd-pill-group", "");
      const strokeLbl = createElement("div", "kd-pill-label", "Số nét");
      const strokeVal = createElement("span", "kd-pill kd-pill--stroke", String(item.stroke_count) + " nét");
      strokeGroup.appendChild(strokeLbl);
      strokeGroup.appendChild(strokeVal);
      sec1Grid.appendChild(strokeGroup);
    }

    addPillGroup("Bộ thủ", item.radicals, "radical");
    sec1.appendChild(sec1Grid);
    container.appendChild(sec1);

    // Section 2: Ký ức & Hình ảnh
    function addStoryRow(sec, icon, label, value) {
      if (!value) return;
      const row = createElement("div", "kd-story-row", "");
      const rowIcon = createElement("span", "kd-story-icon", icon);
      const rowBody = createElement("div", "kd-story-body", "");
      const rowLabel = createElement("div", "kd-story-label", label);
      const rowValue = createElement("div", "kd-story-value", "");

      if (label === "Cấu tạo") {
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
      } else {
        rowValue.textContent = value;
      }
      rowBody.appendChild(rowLabel);
      rowBody.appendChild(rowValue);
      row.appendChild(rowIcon);
      row.appendChild(rowBody);
      sec.appendChild(row);
    }

    const sec2 = createElement("div", "kd-section kd-section--amber", "");
    const sec2Title = createElement("div", "kd-section-title", "Ký ức & Hình ảnh");
    sec2.appendChild(sec2Title);
    addStoryRow(sec2, "🖼️", "Tượng hình", item.story_image);
    addStoryRow(sec2, "🔗", "Cấu tạo", item.logic_development);
    // Bỏ hiển thị "Mẹo nhớ" để tiết kiệm không gian
    container.appendChild(sec2);

    // Section 3: Tính từ (ẩn nếu không có)
    if (item.adjectives && String(item.adjectives).trim() && String(item.adjectives).toLowerCase() !== "không có") {
      const sec3 = createElement("div", "kd-section kd-section--green", "");

      const adjWrap = createElement("div", "kd-vocab-pills", "");
      item.adjectives.split("|").forEach(function (a) {
        var trimmed = String(a).trim();
        if (!trimmed || trimmed.toLowerCase() === "không có") return;
        var parts = trimmed.split(":");
        const chip = createElement("div", "kd-vocab-chip", "");
        const word = createElement("span", "kd-vocab-chip-word", parts[0] || "");
        const meaning = createElement("span", "kd-vocab-chip-meaning", parts[1] || "");
        chip.appendChild(word);
        chip.appendChild(meaning);
        adjWrap.appendChild(chip);
      });
      
      // Chỉ thêm section nếu có ít nhất 1 chip
      if (adjWrap.children.length > 0) {
        sec3.appendChild(adjWrap);
        container.appendChild(sec3);
      }
    }

    // Section 4: Từ vựng ứng dụng (ẩn nếu không có)
    if (item.vocabulary && String(item.vocabulary).trim() && String(item.vocabulary).toLowerCase() !== "không có") {
      const sec4 = createElement("div", "kd-section kd-section--purple", "");

      item.vocabulary.split("|").forEach(function (v) {
        var trimmed = String(v).trim();
        if (!trimmed || trimmed.toLowerCase() === "không có") return;
        var parts = trimmed.split(":");
        const row = createElement("div", "kd-vocab-row", "");
        const wordEl = createElement("span", "kd-vocab-word", "");
        var wordText = parts[0] || "";
        // Link hóa các chữ Kanji trong từ vựng (nếu tồn tại trong kanjiData)
        // excludeChar = item.kanji để không tự link chính chữ hiện tại
        wordEl.innerHTML = linkifyKanjiText(wordText, item.kanji);
        const readEl = createElement("span", "kd-vocab-read", parts[1] ? "(" + parts[1] + ")" : "");
        const meanEl = createElement("span", "kd-vocab-mean", parts[2] || "");

        row.appendChild(wordEl);
        row.appendChild(readEl);
        row.appendChild(meanEl);

        // Click vào Kanji trong từ vựng để mở chi tiết Kanji
        wordEl.addEventListener("click", function (e) {
          var target = e.target;
          if (target && target.classList.contains("kd-inline-kanji-link")) {
            var idxAttr = target.getAttribute("data-kanji-index");
            var idx = parseInt(idxAttr, 10);
            if (!isNaN(idx) && idx >= 0 && idx < kanjiData.length) {
              // Nếu trùng với kanji hiện tại thì bỏ qua
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

        // Nếu hiragana trong ví dụ (phần trong ngoặc) tồn tại trong listMp3 thì thêm icon loa
        // Ví dụ: "川(かわ):sông" -> audioFileNameFromHiragana sẽ lấy "かわ"
        var hiraRead = parts[0] || "";
        var audioKeyVocab = audioFileNameFromHiragana(hiraRead);
        var hasAudioVocab = audioKeyVocab &&
          typeof listMp3 !== "undefined" &&
          Array.isArray(listMp3) &&
          listMp3.indexOf(audioKeyVocab) !== -1;
        if (hasAudioVocab) {
          var audioBtnVocab = createAudioBtn(audioKeyVocab);
          row.appendChild(audioBtnVocab);
        }

        sec4.appendChild(row);
      });

      // Chỉ thêm section nếu có ít nhất 1 row
      if (sec4.children.length > 0) {
        container.appendChild(sec4);
      }
    }

    // Section: Kanji writing practice (open modal)
    const secWrite = createElement("div", "kd-section kd-section--writing", "");
    const secWriteTitle = createElement("div", "kd-section-title", "Tập viết");
    const openWriteBtn = createElement("button", "kd-writing-toggle-btn", "✏️ Tập viết");
    openWriteBtn.type = "button";
    secWrite.appendChild(secWriteTitle);
    secWrite.appendChild(openWriteBtn);
    openWriteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      openKanjiPracticeModal(item.kanji);
    });

    container.appendChild(secWrite);

    const contentDiv = createElement("div", "kd-detail-content", "");
    while (container.firstChild) {
      contentDiv.appendChild(container.firstChild);
    }

    const navRow = createElement("div", "kd-nav-row kd-nav-row--header", "");
    const hasBack = Array.isArray(state.kanjiHistory) && state.kanjiHistory.length > 0;
    if (hasBack) {
      const backBtn = createElement("button", "kd-nav-btn kd-nav-btn--back", "← Quay lại");
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
      const filtered = applyKanjiFilter();
      const currentIdxInFiltered = filtered.findIndex(function (r) {
        return kanjiData.indexOf(r) === state.selected.kanjiIndex;
      });
      const hasPrev = currentIdxInFiltered > 0;
      const hasNext = currentIdxInFiltered >= 0 && currentIdxInFiltered < filtered.length - 1;

      const prevBtn = createElement("button", "kd-nav-btn", "‹");
      prevBtn.type = "button";
      prevBtn.disabled = !hasPrev;
      prevBtn.addEventListener("click", function () {
        if (!hasPrev) return;
        state.selected.kanjiIndex = kanjiData.indexOf(filtered[currentIdxInFiltered - 1]);
        renderKanjiDetail();
      });
      const nextBtn = createElement("button", "kd-nav-btn", "›");
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

    // Không hiển thị tiêu đề để header gọn hơn, chỉ còn nút điều hướng
    openDetailModal("", contentDiv, navRow);
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
    countLabel.textContent = filtered.length + " mẫu";

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
  function setupNoteSelect() {
    if (!window.DOC_CONFIG || !Array.isArray(window.DOC_CONFIG.docs)) {
      return;
    }
    var select = document.getElementById("note-doc-select");
    if (!select) {
      return;
    }

    select.innerHTML = "";
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

    select.addEventListener("change", function () {
      state.note.currentDocKey = select.value;
      renderNoteContent();
    });
  }

  function renderNoteContent() {
    const container = document.getElementById("note-content-container");
    if (!container) {
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

    var filePath = String(target.file || "");
    if (filePath.indexOf("/") === -1 && filePath.slice(-3).toLowerCase() !== ".md") {
      filePath = "data/doc/" + filePath + ".md";
    }

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
    const hash = window.location.hash || "#vocab";
    var tabName = "vocab";
    if (hash === "#kanji") {
      tabName = "kanji";
    } else if (hash === "#grammar") {
      tabName = "grammar";
    } else if (hash === "#note") {
      tabName = "note";
    } else {
      tabName = "vocab";
    }
    state.currentTab = tabName;
    renderTabs();
    if (tabName === "note") {
      renderNoteContent();
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

  function setupVocabFilters() {
    const lessonSelect = document.getElementById("vocab-lesson-filter");
    const categorySelect = document.getElementById("vocab-category-filter");
    const searchInput = document.getElementById("vocab-search-input");

    const lessons = getUniqueSorted(
      vocabData.map(function (v) {
        return v.lesson != null ? v.lesson : v.Lesson;
      })
    );
    lessons.forEach(function (lesson) {
      const opt = createElement("option", "", "Bài " + lesson);
      opt.value = String(lesson);
      lessonSelect.appendChild(opt);
    });

    const categories = getUniqueSorted(
      vocabData.map(function (v) { return v.category; }).filter(function (c) { return c; })
    );
    categories.forEach(function (cat) {
      const opt = createElement("option", "", getCategoryLabel(cat));
      opt.value = cat;
      categorySelect.appendChild(opt);
    });

    lessonSelect.addEventListener("change", function () {
      state.filter.vocabLesson = lessonSelect.value;
      renderVocabList();
    });

    categorySelect.addEventListener("change", function () {
      state.filter.vocabCategory = categorySelect.value;
      renderVocabList();
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.filter.vocabSearch = searchInput.value || "";
        renderVocabList();
      });
    }

    const resetBtn = document.getElementById("reset-vocab-filter-btn");
    resetBtn.addEventListener("click", function () {
      state.filter.vocabLesson = "all";
      state.filter.vocabCategory = "all";
      state.filter.vocabSearch = "";
      lessonSelect.value = "all";
      categorySelect.value = "all";
      if (searchInput) {
        searchInput.value = "";
      }
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
        toggle.textContent = isHidden ? "Hiện bộ lọc" : "Ẩn bộ lọc";
      });
    }

    attachFilterToggle("vocab-filters-toggle", "vocab-filters-row");
    attachFilterToggle("kanji-filters-toggle", "kanji-filters-row");
    attachFilterToggle("grammar-filters-toggle", "grammar-filters-row");

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

  function handleSelectAnswer(questionWord, correctAnswer, selectedAnswer, vocabIdForAudio) {
    if (isProcessing) return; // chặn spam
    isProcessing = true;

    const testState = state.testState;
    const isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
      testState.correctCount += 1;
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

    // Sau khi chọn đáp án thì phát âm thanh từ vựng (nếu có id)
    if (vocabIdForAudio) {
      playVocabAudio(vocabIdForAudio, null);

      var overlay = document.getElementById("soundOverlay");

      // Clear timeout cũ nếu click liên tục
      if (_overlayTimeout) {
        clearTimeout(_overlayTimeout);
      }
    
      // Reset về 0 trước (để đảm bảo animation chạy lại)
      overlay.style.opacity = "0";
    
      // Force reflow để animation luôn chạy khi click nhanh
      void overlay.offsetWidth;
    
      // 👉 HIỆN icon
      overlay.style.opacity = "1";
    
      // 👉 Tự ẩn sau 1.3 giây
      _overlayTimeout = setTimeout(function () {
        overlay.style.opacity = "0";
      }, 1300);


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
        handleKanjiSelectAnswer({ kanji: raw.kanji, name: raw.hanviet, ve: ve }, mode, correct, opt);
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

    const wrongList = testState.answers.filter(function (a) { return !a.isCorrect; });
    if (wrongList.length > 0) {
      const wrongHeader = createElement("div", "card-subtitle", "Danh sách câu sai:");
      wrapper.appendChild(wrongHeader);

      const wrongContainer = createElement("div", "wrong-list", "");
      var modeLabels = {
        1: "Kanji → Âm On", 2: "Kanji → Âm Kun",
        3: "Hán Việt → Kanji", 4: "Kanji → Hán Việt",
        5: "Từ vựng → Nghĩa", 6: "Nghĩa → Kanji",
        7: "Nghĩa → Hiragana", 8: "Hiragana → Kanji", 9: "Hiragana → Nghĩa"
      };
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

  function handleKanjiSelectAnswer(item, mode, correct, selected) {
    const testState = state.kanjiTestState;
    const isCorrect = selected === correct;
    if (isCorrect) testState.correctCount += 1;
    testState.answers.push({ item: item, mode: mode, correct: correct, selected: selected, isCorrect: isCorrect });

    // Nếu câu hỏi dựa trên từ vựng (mode 5–9) thì sau khi chọn đáp án mới phát âm (nếu có file)
    if (item && item.ve && item.ve.reading) {
      var vocabAudioKey = audioFileNameFromHiragana(item.ve.reading);
      var hasVocabAudio = vocabAudioKey &&
        typeof listMp3 !== "undefined" &&
        Array.isArray(listMp3) &&
        listMp3.indexOf(vocabAudioKey) !== -1;
      if (hasVocabAudio) {
        playVocabAudio(vocabAudioKey, null);
      }
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
    const radicals = getUniqueSorted(
      kanjiData
        .map(function (k) { return k.radicals; })
        .filter(function (b) { return b; })
        .reduce(function (all, rads) {
          return all.concat(String(rads).split("|"));
        }, [])
        .map(function (rad) { return rad.trim(); })
        .filter(function (rad) { return rad; })
    );

    // Xóa các option bộ thủ cũ (giữ lại "Tất cả")
    if (radicalSelect) {
      while (radicalSelect.options.length > 1) {
        radicalSelect.remove(1);
      }
    }
    radicals.forEach(function (radical) {
      const opt = createElement("option", "", radical);
      opt.value = radical;
      radicalSelect.appendChild(opt);
    });

    radicalSelect.addEventListener("change", function () {
      state.filter.kanjiRadical = radicalSelect.value;
      renderKanjiList();
    });

    var kanjiSearchInput = document.getElementById("kanji-search-input");
    if (kanjiSearchInput) {
      kanjiSearchInput.addEventListener("input", function () {
        state.filter.kanjiSearch = kanjiSearchInput.value;
        renderKanjiList();
      });
    }

    var resetKanjiFilterBtn = document.getElementById("reset-kanji-filter-btn");
    if (resetKanjiFilterBtn) {
      resetKanjiFilterBtn.addEventListener("click", function () {
        state.filter.kanjiRadical = "all";
        state.filter.kanjiSearch = "";
        state.kanjiFavOnly = false;
        if (radicalSelect) {
          radicalSelect.value = "all";
        }
        if (kanjiSearchInput) {
          kanjiSearchInput.value = "";
        }
        var kanjiFavBtn = document.getElementById("kanji-fav-filter");
        if (kanjiFavBtn) {
          kanjiFavBtn.textContent = "☆";
          kanjiFavBtn.classList.remove("star-filter-btn--active");
        }
        renderKanjiList();
      });
    }

    // View mode toggle (list / grid)
    var listBtn = document.getElementById("kanji-view-list");
    var gridBtn = document.getElementById("kanji-view-grid");
    function updateViewToggle() {
      if (listBtn) listBtn.classList.toggle("view-toggle-btn--active", state.kanjiViewMode === "list");
      if (gridBtn) gridBtn.classList.toggle("view-toggle-btn--active", state.kanjiViewMode === "grid");
    }
    if (listBtn) {
      listBtn.addEventListener("click", function () {
        state.kanjiViewMode = "list";
        updateViewToggle();
        renderKanjiList();
      });
    }
    if (gridBtn) {
      gridBtn.addEventListener("click", function () {
        state.kanjiViewMode = "grid";
        updateViewToggle();
        renderKanjiList();
      });
    }

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
    // Toàn bộ dữ liệu (vocabData, kanjiData, grammarData) đã được dán sẵn trong code.
    // Không cần fetch / load từ CSV để tránh lỗi CORS khi mở file trực tiếp.

    setupTabs();
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
  });
})();