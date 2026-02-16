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
      kanjiSearch: ""
    },
    displaySettings: {
      hiragana: true,
      kanji: true,
      meaning: true,
      vru: false,
      vt: false,
      vnai: false,
      vrare: false,
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
      optionCount: 6
    },
    kanjiViewMode: "grid",
    selected: {
      vocabIndex: null,
      kanjiIndex: null,
      grammarIndex: null
    },
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

  // Play vocab audio from sounds/vocab/{id}.mp3
  var _currentAudio = null;
  function playVocabAudio(vocabId, btn) {
    if (!vocabId) return;
    // Stop current if playing
    if (_currentAudio) {
      _currentAudio.pause();
      _currentAudio = null;
      var prevBtn = document.querySelector(".audio-btn--playing");
      if (prevBtn) prevBtn.classList.remove("audio-btn--playing");
    }
    var audio = new Audio("sounds/vocab/" + vocabId + ".mp3");
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

  function createAudioBtn(vocabId) {
    var btn = createElement("button", "audio-btn", "🔊");
    btn.type = "button";
    btn.title = "Phát âm thanh";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      playVocabAudio(vocabId, btn);
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

    // Find audio button inside this item and play
    var audioBtn = currentItem.querySelector(".audio-btn");
    var vocabIdx = currentItem.getAttribute("data-vocab-index");
    var raw = vocabIdx != null ? vocabData[parseInt(vocabIdx)] : null;
    var vocabId = raw ? (raw.id != null ? raw.id : raw.Id) : null;

    if (vocabId) {
      // Play audio and wait for it to finish, then move to next
      if (_currentAudio) {
        _currentAudio.pause();
        _currentAudio = null;
      }
      var prevBtn = document.querySelector(".audio-btn--playing");
      if (prevBtn) prevBtn.classList.remove("audio-btn--playing");

      var audio = new Audio("sounds/vocab/" + vocabId + ".mp3");
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

  function isSmallScreen() {
    return window.innerWidth <= 720;
  }

  const detailModalState = {
    el: null,
    bodyEl: null,
    titleEl: null,
    closeBtn: null
  };

  function openDetailModal(title, htmlContentOrNode) {
    if (!detailModalState.el) {
      return;
    }
    detailModalState.titleEl.textContent = title || "";
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
    detailModalState.el.setAttribute("aria-hidden", "true");
    state.ui.detailModal.isOpen = false;
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
      { id: "section-grammar", tab: "grammar" }
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

         var textAll = (hira + " " + kanji + " " + meaning).toLowerCase();
         if (textAll.indexOf(search) === -1) {
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
        kanji: raw.kanji != null ? raw.kanji : raw.Kanji,
        meaning: raw.meaning != null ? raw.meaning : raw.Meaning,
        vru: raw.vru != null ? raw.vru : raw.Vru,
        vt: raw.vt != null ? raw.vt : raw.Vt,
        vnai: raw.vnai != null ? raw.vnai : raw.Vnai,
        vrare: raw.vrare != null ? raw.vrare : raw.Vrare,
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
      
      if (state.displaySettings.kanji && item.kanji) {
        const outputKanji = boldKanji(item.kanji);
      
        const kanjiEl = createElement("div", "vocab-kanji");
        kanjiEl.innerHTML = "(" + outputKanji + ") ";

        // Thêm event cho các thẻ <b> bên trong
        kanjiEl.querySelectorAll("b").forEach(b => {
          b.addEventListener("click", function () {
              const index = kanjiData.findIndex(item => item.Kanji === this.textContent);

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

      // Audio button
      var vocabId = raw.id != null ? raw.id : raw.Id;
      var audioBtn = vocabId ? createAudioBtn(vocabId) : null;

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
      if (state.displaySettings.vt && item.vt) {
        const p = createElement("span", "pill pill--soft-accent", "Vて: " + item.vt);
        metaRow.appendChild(p);
      }
      if (state.displaySettings.vnai && item.vnai) {
        const p = createElement("span", "pill pill--soft-accent", "Vない: " + item.vnai);
        metaRow.appendChild(p);
      }
      if (state.displaySettings.vrare && item.vrare) {
        const p = createElement("span", "pill pill--soft-accent", "Vられる: " + item.vrare);
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

    // Lấy vocabId để phát audio sau khi chọn đáp án
    var vocabIdForAudio = null;
    if (rawQuestion) {
      if (rawQuestion.id != null) {
        vocabIdForAudio = rawQuestion.id;
      } else if (rawQuestion.Id != null) {
        vocabIdForAudio = rawQuestion.Id;
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
      if (state.filter.kanjiRadical !== "all" &&
          item.bo_thu !== state.filter.kanjiRadical) {
        return false;
      }
      // Search by kanji or name (Han Viet)
      var search = String(state.filter.kanjiSearch || "").trim().toLowerCase();
      if (search) {
        var kanjiVal = String(item.kanji != null ? item.kanji : item.Kanji || "").toLowerCase();
        var nameVal = String(item.name || "").toLowerCase();
        var kunVal = String(item.kun != null ? item.kun : item.Kun || "").toLowerCase();
        var onVal = String(item.on != null ? item.on : item.On || "").toLowerCase();
        var textAll = kanjiVal + " " + nameVal + " " + kunVal + " " + onVal;
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
      filtered.forEach(function (raw) {
        const globalIndex = kanjiData.indexOf(raw);
        const item = {
          kanji: raw.kanji != null ? raw.kanji : raw.Kanji,
          name: raw.name
        };

        const cell = createElement("div", "kanji-grid-item", "");

        // Star
        var isKanjiFav = !!state.kanjiFavorites[globalIndex];
        var starBtn = createElement("button", "star-btn" + (isKanjiFav ? " star-btn--active" : ""), isKanjiFav ? "★" : "☆");
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
          state.selected.kanjiIndex = globalIndex;
          renderKanjiDetail();
        });

        grid.appendChild(cell);
      });
      container.appendChild(grid);
    } else {
      // ===== List view (default) =====
      const list = createElement("div", "simple-list", "");
      filtered.forEach(function (raw) {
        const globalIndex = kanjiData.indexOf(raw);
        const item = {
          stt: raw.stt != null ? raw.stt : raw.STT,
          kanji: raw.kanji != null ? raw.kanji : raw.Kanji,
          name: raw.name,
          kun: raw.kun != null ? raw.kun : raw.Kun,
          on: raw.on != null ? raw.on : raw.On,
          bo_thu: raw.bo_thu != null ? raw.bo_thu : raw.bo_thu,
          example: raw.example != null ? raw.example : raw.Example
        };
        const row = createElement("div", "simple-item", "");
        row.setAttribute("data-kanji-index", String(globalIndex));

        // Star button
        var isKanjiFav = !!state.kanjiFavorites[globalIndex];
        var kanjiStarBtn = createElement("button", "star-btn" + (isKanjiFav ? " star-btn--active" : ""), isKanjiFav ? "★" : "☆");
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

        const main = createElement("div", "simple-main", "");
        main.style.cssText = "display:flex;align-items:center;gap:4px;flex:1";
        var kanjiMainContent = createElement("div", "", "");
        kanjiMainContent.style.flex = "1";
        const left = createElement("div", "simple-main-text", item.kanji + " (" + item.name + ")");
        const right = createElement("div", "simple-sub-text", "Bộ: " + item.bo_thu);
        kanjiMainContent.appendChild(left);
        kanjiMainContent.appendChild(right);
        main.appendChild(kanjiMainContent);
        main.appendChild(kanjiStarBtn);

        const sub = createElement(
          "div",
          "simple-sub-text",
          "Kun: " + item.kun + " · On: " + item.on
        );
        row.appendChild(main);
        row.appendChild(sub);

        if (item.example) {
          var exampleText = String(item.example);
          if (exampleText.length > 80) {
            exampleText = exampleText.slice(0, 77) + "...";
          }
          const ex = createElement(
            "div",
            "simple-sub-text",
            "Example: " + exampleText
          );
          row.appendChild(ex);
        }

        row.addEventListener("click", function () {
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
      stt: raw.stt != null ? raw.stt : raw.STT,
      kanji: raw.kanji != null ? raw.kanji : raw.Kanji,
      name: raw.name,
      kun: raw.kun != null ? raw.kun : raw.Kun,
      on: raw.on != null ? raw.on : raw.On,
      bo_thu: raw.bo_thu != null ? raw.bo_thu : raw.bo_thu,
      example: raw.example != null ? raw.example : raw.Example
    };
    if (!item) {
      const notFound = createElement("div", "detail-empty", "Không tìm thấy dữ liệu Kanji.");
      container.appendChild(notFound);
      return;
    }

    const kanjiEl = createElement("div", "kanji-large", item.kanji);
    container.appendChild(kanjiEl);

    const nameEl = createElement("div", "detail-sub");
    nameEl.innerHTML = "Hán Việt: <b>" + item.name + "</b>";
    container.appendChild(nameEl);

    const grid = createElement("div", "detail-grid", "");

    function addRow(label, value) {
      if (!value) {
        return;
      }
      const row = createElement("div", "detail-row", "");
      const labelEl = createElement("div", "detail-label", label);
      const valueEl = createElement("div", "detail-value", value);
      valueEl.style.whiteSpace = "pre-line";
      row.appendChild(labelEl);
      row.appendChild(valueEl);
      grid.appendChild(row);
    }

    addRow("Kun", item.kun);
    addRow("On", item.on);
    addRow("Bộ thủ", item.bo_thu);
    const formattedExample = item.example.replace(/;/g, '\n');
    addRow("Example", formattedExample);

    container.appendChild(grid);

    openDetailModal("Chi tiết Kanji", container.innerHTML);
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

    const list = createElement("div", "simple-list", "");
    filtered.forEach(function (raw) {
      const globalIndex = grammarData.indexOf(raw);
      const item = {
        lesson: raw.lesson != null ? raw.lesson : raw.Lesson,
        structure: raw.structure != null ? raw.structure : raw.Grammatical_structure,
        content: raw.content
      };
      const row = createElement("div", "simple-item", "");
      row.setAttribute("data-grammar-index", String(globalIndex));

      const main = createElement("div", "simple-main", "");
      const left = createElement("div", "simple-main-text", item.structure);
      const right = createElement(
        "div",
        "simple-sub-text",
        "Lesson " + (item.lesson != null ? item.lesson : item.Lesson)
      );
      main.appendChild(left);
      main.appendChild(right);

      var contentPreview = "";
      if (item.content) {
        contentPreview = String(item.content).split("\n").join(" / ");
        if (contentPreview.length > 140) {
          contentPreview = contentPreview.slice(0, 137) + "...";
        }
      }
      const sub = createElement(
        "div",
        "simple-sub-text",
        contentPreview
      );

      row.appendChild(main);
      row.appendChild(sub);

      row.addEventListener("click", function () {
        state.selected.grammarIndex = globalIndex;
        renderGrammarDetail();
      });

      list.appendChild(row);
    });

    container.appendChild(list);
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
      structure: raw.structure != null ? raw.structure : raw.Grammatical_structure,
      content: raw.content,
      explain: raw.explain,
      example: raw.example
    };
    if (!item) {
      const notFound = createElement("div", "detail-empty", "Không tìm thấy dữ liệu ngữ pháp.");
      container.appendChild(notFound);
      return;
    }

    const structure = createElement("div", "grammar-structure", item.structure);
    container.appendChild(structure);

    const lessonInfo = createElement(
      "div",
      "detail-sub",
      "Lesson " + (item.lesson != null ? item.lesson : item.Lesson)
    );
    container.appendChild(lessonInfo);

    if (item.content) {
      const contentLines = String(item.content).split("\n");
      contentLines.forEach(function (line) {
        const p = createElement("div", "detail-value", line);
        container.appendChild(p);
      });
    }

    if (item.explain) {
      const explainLabel = createElement("div", "detail-sub", "Giải thích:");
      container.appendChild(explainLabel);
      const explainLines = String(item.explain).split("\n");
      explainLines.forEach(function (line) {
        const p = createElement("div", "detail-value", line);
        container.appendChild(p);
      });
    }

    if (item.example) {
      const exampleLabel = createElement("div", "detail-sub", "Ví dụ:");
      container.appendChild(exampleLabel);
      const exampleLines = String(item.example).split("\n");
      exampleLines.forEach(function (line) {
        const p = createElement("div", "detail-value", line);
        container.appendChild(p);
      });
    }

    openDetailModal("Chi tiết ngữ pháp", container.innerHTML);
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
    } else {
      tabName = "vocab";
    }
    state.currentTab = tabName;
    renderTabs();
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
  function buildKanjiTestQuestions(count) {
    var total = kanjiData.length;
    var n = (typeof count === "number" && count >= 1) ? count : 20;
    const indices = pickUniqueIndices(n, total);
    return indices.map(function (idx) {
      return { index: idx };
    });
  }

  function renderKanjiTestQuestion() {
    const testState = state.kanjiTestState;

    if (!testState.isActive || testState.questions.length === 0) {
      renderKanjiTestInitialMessage();
      return;
    }

    if (testState.isFinished || testState.currentIndex >= testState.questions.length) {
      renderKanjiTestResult();
      return;
    }

    const qMeta = testState.questions[testState.currentIndex];
    const raw = kanjiData[qMeta.index];
    if (!raw) {
      renderKanjiTestInitialMessage();
      return;
    }

    const item = {
      kanji: raw.kanji != null ? raw.kanji : raw.Kanji,
      name: raw.name,
      kun: raw.kun != null ? raw.kun : raw.Kun,
      on: raw.on != null ? raw.on : raw.On,
      bo_thu: raw.bo_thu,
      example: raw.example != null ? raw.example : raw.Example
    };

    // Các mode:
    // 0: hiển thị Kanji -> chọn name
    // 1: hiển thị name -> chọn Kanji
    // 2: hiển thị Kanji -> chọn âm Kun
    // 3: hiển thị Kanji -> chọn âm On
    var availableModes = [];
    if (item.kanji && item.name) {
      availableModes.push(0, 1);
    }
    if (item.kanji && item.kun) {
      availableModes.push(2);
    }
    if (item.kanji && item.on) {
      availableModes.push(3);
    }
    if (availableModes.length === 0) {
      renderKanjiTestInitialMessage();
      return;
    }

    var mode = availableModes[Math.floor(Math.random() * availableModes.length)];
    var questionText = "";
    var correct = "";
    var pool = [];

    if (mode === 0) {
      questionText = item.kanji;
      correct = item.name;
      pool = kanjiData
        .map(function (r) { return r.name; })
        .filter(function (x) { return x; });
    } else if (mode === 1) {
      questionText = item.name;
      correct = item.kanji;
      pool = kanjiData
        .map(function (r) { return r.kanji != null ? r.kanji : r.Kanji; })
        .filter(function (x) { return x; });
    } else if (mode === 2) {
      questionText = item.kanji + " (Kun?)";
      correct = item.kun;
      pool = kanjiData
        .map(function (r) { return r.kun != null ? r.kun : r.Kun; })
        .filter(function (x) { return x; });
    } else {
      questionText = item.kanji + " (On?)";
      correct = item.on;
      pool = kanjiData
        .map(function (r) { return r.on != null ? r.on : r.On; })
        .filter(function (x) { return x; });
    }

    var kanjiOptCount = testState.optionCount != null ? testState.optionCount : 6;
    const shuffledOthers = shuffleArray(pool.filter(function (x) { return x && x !== correct; }));
    const wrongOptions = shuffledOthers.slice(0, kanjiOptCount - 1);
    const rawOptions = [correct].concat(wrongOptions);
    const uniqueOptions = Array.from(new Set(rawOptions));
    let options = uniqueOptions;
    if (options.length < kanjiOptCount) {
      const additional = shuffledOthers.filter(function (m) {
        return options.indexOf(m) === -1;
      });
      const need = kanjiOptCount - options.length;
      options = options.concat(additional.slice(0, need));
    }
    options = options.slice(0, kanjiOptCount);
    if (options.indexOf(correct) === -1) {
      options[0] = correct;
    }
    const shuffledOptions = shuffleArray(options);

    const wrapper = createElement("div", "test-question", "");
    const header = createElement("div", "test-question-header", "");
    const left = createElement("div", "", "Câu " + (testState.currentIndex + 1) + " / " + testState.questions.length);
    const right = createElement("div", "", "Đã đúng: " + testState.correctCount);
    header.appendChild(left);
    header.appendChild(right);
    wrapper.appendChild(header);

    const qMain = createElement("div", "test-question-main", "");
    const qText = createElement("div", "test-question-text", questionText || "");
    const qSub = createElement("div", "test-question-sub", "Chọn đáp án đúng cho Kanji");
    qMain.appendChild(qText);
    qMain.appendChild(qSub);
    wrapper.appendChild(qMain);

    const optionsGrid = createElement("div", "options-grid", "");
    shuffledOptions.forEach(function (opt, idx) {
      const btn = createElement("button", "option-btn", "");
      const idxSpan = createElement("span", "option-index", String(idx + 1));
      const textSpan = createElement("span", "", opt);
      btn.appendChild(idxSpan);
      btn.appendChild(textSpan);
      btn.addEventListener("click", function () {
        handleKanjiSelectAnswer({
          kanji: item.kanji,
          name: item.name,
          kun: item.kun,
          on: item.on,
          bo_thu: item.bo_thu,
          example: item.example
        }, mode, correct, opt);
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
    const wrapper = createElement("div", "test-result", "");
    const title = createElement("div", "score-main", "Cấu hình Test Kanji");
    const desc = createElement(
      "div",
      "score-detail",
      "Kanji ↔ Nghĩa, Kun, On. Chọn số câu và số đáp án."
    );
    wrapper.appendChild(title);
    wrapper.appendChild(desc);

    const configGrid = createElement("div", "test-config-fields", "");

    // Số câu hỏi
    const qCountField = createElement("div", "field-group", "");
    const qCountLabel = createElement("div", "field-label", "Số câu hỏi (5–100)");
    const qCountInput = createElement("input", "input-text", "");
    qCountInput.type = "number";
    qCountInput.min = 5;
    qCountInput.max = 100;
    qCountInput.value = String(state.kanjiTestState.questionCount != null ? state.kanjiTestState.questionCount : 20);
    qCountField.appendChild(qCountLabel);
    qCountField.appendChild(qCountInput);
    configGrid.appendChild(qCountField);

    // Số đáp án
    const optCountField = createElement("div", "field-group", "");
    const optCountLabel = createElement("div", "field-label", "Số đáp án (4–14)");
    const optCountInput = createElement("input", "input-text", "");
    optCountInput.type = "number";
    optCountInput.min = 4;
    optCountInput.max = 14;
    optCountInput.value = String(state.kanjiTestState.optionCount != null ? state.kanjiTestState.optionCount : 6);
    optCountField.appendChild(optCountLabel);
    optCountField.appendChild(optCountInput);
    configGrid.appendChild(optCountField);

    wrapper.appendChild(configGrid);

    const btnRow = createElement("div", "btn-row", "");
    const startBtn = createElement("button", "btn", "Bắt đầu test");
    startBtn.type = "button";
    startBtn.addEventListener("click", function () {
      var questionCount = parseInt(qCountInput.value, 10);
      if (isNaN(questionCount) || questionCount < 5) questionCount = 5;
      if (questionCount > 100) questionCount = 100;
      var optionCount = parseInt(optCountInput.value, 10);
      if (isNaN(optionCount) || optionCount < 4) optionCount = 4;
      if (optionCount > 14) optionCount = 14;

      state.kanjiTestState.isActive = true;
      state.kanjiTestState.isFinished = false;
      state.kanjiTestState.questions = buildKanjiTestQuestions(questionCount);
      state.kanjiTestState.currentIndex = 0;
      state.kanjiTestState.correctCount = 0;
      state.kanjiTestState.answers = [];
      state.kanjiTestState.questionCount = questionCount;
      state.kanjiTestState.optionCount = optionCount;
      renderKanjiTestQuestion();
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
      wrongList.forEach(function (w, idx) {
        const itemBox = createElement("div", "wrong-item", "");

        const k = w.item || {};
        const titleParts = [];
        if (k.kanji) {
          titleParts.push(k.kanji);
        }
        if (k.name) {
          titleParts.push("(" + k.name + ")");
        }
        const titleText = titleParts.length > 0 ? titleParts.join(" ") : "Câu " + (idx + 1);
        const titleEl = createElement("div", "wrong-q", titleText);
        itemBox.appendChild(titleEl);

        // Hiển thị đầy đủ thông tin Kanji để ôn lại
        const info = createElement("div", "wrong-a", "");
        if (k.kun) {
          info.appendChild(createElement("div", "", "Kun: " + k.kun));
        }
        if (k.on) {
          info.appendChild(createElement("div", "", "On: " + k.on));
        }
        if (k.bo_thu) {
          info.appendChild(createElement("div", "", "Bộ thủ: " + k.bo_thu));
        }
        if (k.example) {
          info.appendChild(createElement("div", "", "Ví dụ: " + k.example));
        }
        if (info.childNodes.length > 0) {
          itemBox.appendChild(info);
        }

        const correctRow = createElement(
          "div",
          "wrong-a wrong-a--correct",
          "Đáp án đúng: "
        );
        correctRow.appendChild(createElement("span", "", w.correct));

        const selectedRow = createElement(
          "div",
          "wrong-a wrong-a--selected",
          "Bạn chọn: "
        );
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
      state.kanjiTestState.isActive = false;
      state.kanjiTestState.isFinished = false;
      state.kanjiTestState.questions = [];
      state.kanjiTestState.currentIndex = 0;
      state.kanjiTestState.correctCount = 0;
      state.kanjiTestState.answers = [];
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
    if (isCorrect) {
      testState.correctCount += 1;
    }
    testState.answers.push({
      item: item,
      mode: mode,
      correct: correct,
      selected: selected,
      isCorrect: isCorrect
    });

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
      kanjiData.map(function (k) { return k.bo_thu; }).filter(function (b) { return b; })
    );
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
  }

  function setupDetailModal() {
    const el = document.getElementById("detail-modal");
    const bodyEl = document.getElementById("detail-modal-body");
    const titleEl = document.getElementById("detail-modal-title");
    const closeBtn = document.getElementById("detail-modal-close-btn");

    if (!el || !bodyEl || !titleEl || !closeBtn) {
      return;
    }

    detailModalState.el = el;
    detailModalState.bodyEl = bodyEl;
    detailModalState.titleEl = titleEl;
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