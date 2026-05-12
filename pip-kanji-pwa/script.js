(function () {
  "use strict";

  const CANVAS_W = 720;
  const CANVAS_H = 405;

  const state = {
    items: [],
    selected: null,
    /** 0 = chữ lớn + nghĩa (dễ đọc khi PiP); 1 = nghĩa + On/Kun đầy đủ */
    face: 0,
    stream: null,
    pipActive: false,
    rafId: 0,
    lastDraw: 0,
    /** Tự gọi PiP sau khi chạm chọn Kanji (cùng user gesture) */
    autoPipOnSelect: true
  };

  const els = {
    loadStatus: document.getElementById("load-status"),
    list: document.getElementById("kanji-list"),
    detailPanel: document.getElementById("detail-panel"),
    detailTitle: document.getElementById("detail-title"),
    detailMeta: document.getElementById("detail-meta"),
    canvas: document.getElementById("main-canvas"),
    btnPip: document.getElementById("btn-pip"),
    btnFlip: document.getElementById("btn-flip"),
    video: document.getElementById("pip-video"),
    fallback: document.getElementById("fallback-box"),
    swStatus: document.getElementById("sw-status"),
    autoPipCheckbox: document.getElementById("auto-pip")
  };

  const ctx = els.canvas.getContext("2d");

  function parseLegacyPipeVocab(s) {
    var out = [];
    String(s)
      .split("|")
      .forEach(function (seg) {
        var t = String(seg).trim();
        if (!t) {
          return;
        }
        var m = t.match(/^(.+?)\(([^)]+)\)\s*:\s*(.+)$/);
        if (m) {
          out.push({ word: m[1].trim(), reading: m[2].trim(), meaning: m[3].trim() });
        } else {
          out.push({ word: t, reading: "", meaning: "" });
        }
      });
    return out;
  }

  function normalizeVocabularyList(raw) {
    if (Array.isArray(raw.vocabulary)) {
      return raw.vocabulary.map(function (e) {
        if (typeof e === "string") {
          return { word: e, reading: "", meaning: "" };
        }
        return {
          word: e.word != null ? String(e.word) : "",
          reading: e.reading != null ? String(e.reading) : "",
          meaning: e.meaning != null ? String(e.meaning) : ""
        };
      });
    }
    if (typeof raw.vocabulary === "string" && raw.vocabulary.trim()) {
      return parseLegacyPipeVocab(raw.vocabulary);
    }
    return [];
  }

  function vocabPreviewLine(vocabs, maxChars) {
    maxChars = maxChars || 22;
    if (!vocabs || !vocabs.length) {
      return "";
    }
    var s = vocabs
      .map(function (v) {
        return v.word;
      })
      .join("、");
    if (s.length > maxChars) {
      s = s.slice(0, maxChars - 1) + "…";
    }
    return "Từ: " + s;
  }

  function supportsPipFromCanvas() {
    var c = els.canvas;
    var v = els.video;
    if (!c || !c.captureStream) {
      return { ok: false, reason: "Trình duyệt không hỗ trợ canvas.captureStream()." };
    }
    if (!v || !v.requestPictureInPicture) {
      return { ok: false, reason: "Trình duyệt không hỗ trợ video.requestPictureInPicture()." };
    }
    return { ok: true };
  }

  function setFallback(msg) {
    if (!els.fallback) return;
    els.fallback.hidden = !msg;
    els.fallback.textContent = msg || "";
  }

  function drawTruncatedCenterLine(text, cx, y, maxW, fontPx) {
    var t = String(text || "");
    if (!t) {
      return;
    }
    ctx.font = fontPx + "px system-ui, sans-serif";
    while (t.length > 1 && ctx.measureText(t).width > maxW) {
      t = t.slice(0, -2) + "…";
    }
    ctx.fillText(t, cx, y);
  }

  function drawCanvas() {
    var item = state.selected;
    if (!item || !ctx) {
      return;
    }

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.save();
    ctx.translate(CANVAS_W / 2, CANVAS_H / 2);

    var vocabs = item._vocabs || [];

    if (state.face === 0) {
      ctx.fillStyle = "#f8fafc";
      ctx.font =
        "bold 200px 'Hiragino Sans', 'Yu Gothic', 'PingFang SC', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.kanji || "", 0, -72);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "24px system-ui, sans-serif";
      wrapText(ctx, item.meaning || "", 0, 28, CANVAS_W - 48, 28);
      ctx.fillStyle = "#64748b";
      ctx.font = "20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("On " + (item.on || "—") + "  ·  Kun " + (item.kun || "—"), 0, 132);
      ctx.font = "18px system-ui, sans-serif";
      ctx.fillText("Stroke: " + (item.strokes != null ? item.strokes : "—"), 0, 162);
      var preview = vocabPreviewLine(vocabs, 36);
      if (preview) {
        ctx.fillStyle = "#475569";
        ctx.textAlign = "center";
        drawTruncatedCenterLine(preview, 0, 188, CANVAS_W - 56, 15);
      }
    } else {
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "28px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      wrapText(ctx, item.meaning || "", 0, -130, CANVAS_W - 80, 30);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "22px system-ui, sans-serif";
      var lines = ["On: " + (item.on || "—"), "Kun: " + (item.kun || "—")];
      lines.forEach(function (line, i) {
        ctx.fillText(line, 0, -40 + i * 30);
      });
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 17px system-ui, sans-serif";
      ctx.fillText("Từ vựng", 0, 10);
      ctx.font = "16px system-ui, sans-serif";
      ctx.fillStyle = "#94a3b8";
      var startY = 32;
      vocabs.slice(0, 5).forEach(function (v, i) {
        var line = v.word || "";
        if (v.reading) {
          line += "(" + v.reading + ")";
        }
        if (v.meaning) {
          line += " — " + v.meaning;
        }
        wrapText(ctx, line, 0, startY + i * 26, CANVAS_W - 56, 24);
      });
    }

    ctx.restore();
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = String(text).split(/\s+/);
    var line = "";
    var cy = y;
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + " ";
      var metrics = context.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        context.fillText(line, x, cy);
        line = words[n] + " ";
        cy += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, cy);
  }

  function loop() {
    drawCanvas();
    state.rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
  }

  function attachStreamToVideo() {
    var cap = supportsPipFromCanvas();
    if (!cap.ok) {
      els.btnPip.disabled = true;
      setFallback(cap.reason + " Dùng canvas trong trang hoặc mở bằng Safari iOS mới hơn.");
      return;
    }
    try {
      if (state.stream) {
        state.stream.getTracks().forEach(function (t) {
          t.stop();
        });
      }
      state.stream = els.canvas.captureStream(30);
      els.video.srcObject = state.stream;
      els.video.muted = true;
      els.video.setAttribute("playsinline", "");
      els.video.setAttribute("webkit-playsinline", "");
      els.btnPip.disabled = false;
      setFallback("");
      if (document.pictureInPictureElement === els.video) {
        els.video.play().catch(function () {});
      }
    } catch (e) {
      els.btnPip.disabled = true;
      setFallback("Không tạo được MediaStream từ canvas: " + (e && e.message ? e.message : e));
    }
  }

  function renderDetail(opts) {
    opts = opts || {};
    var item = state.selected;
    if (!item) {
      els.detailPanel.hidden = true;
      stopLoop();
      return;
    }
    els.detailPanel.hidden = false;
    els.detailTitle.textContent = "Kanji: " + item.kanji;
    els.detailMeta.innerHTML =
      "<strong>Nghĩa:</strong> " +
      escapeHtml(item.meaning) +
      (item.hanviet
        ? "<br><strong>Hán Việt:</strong> " + escapeHtml(item.hanviet)
        : "") +
      "<br><strong>On:</strong> " +
      escapeHtml(item.on) +
      " · <strong>Kun:</strong> " +
      escapeHtml(item.kun) +
      formatVocabHtml(item);

    attachStreamToVideo();
    drawCanvas();
    if (!state.rafId) {
      state.rafId = requestAnimationFrame(loop);
    }
    if (
      opts.skipAutoPip !== true &&
      state.autoPipOnSelect &&
      supportsPipFromCanvas().ok
    ) {
      openPipFromUserGesture({ silent: true });
    }
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatVocabHtml(item) {
    var list = item._vocabs || [];
    if (!list.length) {
      return "";
    }
    var li = list
      .map(function (v) {
        var line = escapeHtml(v.word);
        if (v.reading) {
          line += " (" + escapeHtml(v.reading) + ")";
        }
        if (v.meaning) {
          line += " — " + escapeHtml(v.meaning);
        }
        return "<li>" + line + "</li>";
      })
      .join("");
    return '<div class="detail-vocab"><strong>Từ vựng</strong><ul>' + li + "</ul></div>";
  }

  function renderList() {
    els.list.innerHTML = "";
    state.items.forEach(function (item) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "kanji-btn";
      b.textContent = item.kanji;
      b.setAttribute("aria-current", state.selected && state.selected.id === item.id ? "true" : "false");
      b.addEventListener("click", function () {
        state.selected = item;
        state.face = 0;
        document.querySelectorAll(".kanji-btn").forEach(function (btn) {
          btn.setAttribute("aria-current", "false");
        });
        b.setAttribute("aria-current", "true");
        renderDetail();
        history.replaceState({ id: item.id }, "", "#kanji=" + encodeURIComponent(item.id));
      });
      els.list.appendChild(b);
    });
    els.list.hidden = false;
  }

  function openPipFromUserGesture(opts) {
    opts = opts || {};
    var v = els.video;
    var pip = v && v.requestPictureInPicture;
    if (!pip) {
      if (!opts.silent) {
        setFallback("Không có Picture-in-Picture trên trình duyệt này.");
      }
      return Promise.resolve(false);
    }

    /**
     * Safari / Chromium: requestPictureInPicture() phải được gọi trong cùng "user activation"
     * với thao tác chạm. Gọi sau play().then(...) sẽ mất activation → lỗi
     * "The request is not triggered by a user activation".
     * Giải pháp: play() không await; gọi requestPictureInPicture() ngay trong cùng stack đồng bộ.
     */
    try {
      var playP = v.play();
      if (playP && typeof playP.catch === "function") {
        playP.catch(function () {});
      }
    } catch (playErr) {
      if (!opts.silent) {
        setFallback("Video.play: " + (playErr && playErr.message ? playErr.message : playErr));
      }
      return Promise.resolve(false);
    }

    var pipP;
    try {
      pipP = v.requestPictureInPicture();
    } catch (err) {
      if (!opts.silent) {
        setFallback("Không bật được PiP: " + (err && err.message ? err.message : err));
      }
      return Promise.resolve(false);
    }

    if (pipP && typeof pipP.then === "function") {
      return pipP
        .then(function () {
          state.pipActive = true;
          setFallback("");
          return true;
        })
        .catch(function (err) {
          if (!opts.silent) {
            setFallback(
              "Không bật được PiP: " +
                (err && err.message ? err.message : err) +
                " (thử bấm lại nút PiP.)"
            );
          }
          return false;
        });
    }

    state.pipActive = true;
    setFallback("");
    return Promise.resolve(true);
  }

  els.btnPip.addEventListener("click", function () {
    openPipFromUserGesture({ silent: false });
  });

  els.btnFlip.addEventListener("click", function () {
    state.face = state.face === 0 ? 1 : 0;
  });

  if (els.video) {
    els.video.addEventListener("leavepictureinpicture", function () {
      state.pipActive = false;
    });
  }

  function bootFromHash() {
    var m = (window.location.hash || "").match(/^#kanji=(.+)$/);
    if (!m || !state.items.length) {
      return;
    }
    try {
      var id = decodeURIComponent(m[1]);
      var found = state.items.find(function (x) {
        return String(x.id) === String(id);
      });
      if (found) {
        state.selected = found;
        state.face = 0;
        document.querySelectorAll(".kanji-btn").forEach(function (btn) {
          btn.setAttribute("aria-current", btn.textContent === found.kanji ? "true" : "false");
        });
        renderDetail({ skipAutoPip: true });
      }
    } catch (e) {
      /* ignore */
    }
  }

  if (els.autoPipCheckbox) {
    els.autoPipCheckbox.checked = state.autoPipOnSelect;
    els.autoPipCheckbox.addEventListener("change", function () {
      state.autoPipOnSelect = !!els.autoPipCheckbox.checked;
    });
  }

  function registerSw() {
    if (!els.swStatus) {
      return;
    }
    if (location.protocol === "file:") {
      els.swStatus.textContent =
        "Service Worker không chạy khi mở file cục bộ (file://). Đẩy lên server HTTPS hoặc mở qua http://localhost (vd. npx serve trong app10_files → vào pip-kanji-pwa) thì SW và cache Kanji sẽ hoạt động.";
      return;
    }
    if (typeof window.isSecureContext !== "undefined" && !window.isSecureContext) {
      els.swStatus.textContent = "Service Worker: cần HTTPS hoặc localhost (secure context).";
      return;
    }
    if (!("serviceWorker" in navigator)) {
      els.swStatus.textContent = "Service Worker: không hỗ trợ trên trình duyệt này.";
      return;
    }
    navigator.serviceWorker
      .register("./sw.js", { scope: "./" })
      .then(function () {
        els.swStatus.textContent = "Service Worker: đã đăng ký (cache file chính khi có mạng).";
      })
      .catch(function (err) {
        els.swStatus.textContent =
          "Service Worker: đăng ký thất bại. " + (err && err.message ? err.message : err);
      });
  }

  function bootFromKanjiData(arr) {
    state.items = (Array.isArray(arr) ? arr : []).map(function (raw, idx) {
      var on = (raw.on_reading || "").replace(/\|/g, "、");
      var kun = (raw.kun_reading || "").replace(/\|/g, "、");
      var o = {
        id: String(raw.stt != null ? raw.stt : idx + 1),
        kanji: raw.kanji || "",
        meaning: raw.core_meaning || "",
        on: on,
        kun: kun,
        strokes: raw.stroke_count != null ? raw.stroke_count : "",
        hanviet: raw.hanviet || "",
        vocabulary: raw.vocabulary
      };
      o._vocabs = normalizeVocabularyList({ vocabulary: raw.vocabulary });
      return o;
    });
    els.loadStatus.textContent = "Chọn một chữ Kanji:";
    renderList();
    bootFromHash();
    if (!state.selected && state.items.length) {
      state.selected = state.items[0];
      state.face = 0;
      var first = els.list.querySelector(".kanji-btn");
      if (first) {
        first.setAttribute("aria-current", "true");
      }
      renderDetail({ skipAutoPip: true });
      history.replaceState({ id: state.selected.id }, "", "#kanji=" + encodeURIComponent(state.selected.id));
    }
  }

  function getKanjiDataArray() {
    if (typeof kanjiData !== "undefined" && Array.isArray(kanjiData) && kanjiData.length) {
      return kanjiData;
    }
    if (window.kanjiData && Array.isArray(window.kanjiData) && window.kanjiData.length) {
      return window.kanjiData;
    }
    return null;
  }

  function loadKanjiData() {
    var kd = getKanjiDataArray();
    if (kd) {
      bootFromKanjiData(kd);
      if (location.protocol === "file:" && els.loadStatus) {
        els.loadStatus.textContent =
          "Chọn một chữ Kanji: (dữ liệu từ data/kanjiData.js — Service Worker chỉ khi mở qua http://localhost)";
      }
      return;
    }
    if (els.loadStatus) {
      var cur = els.loadStatus.textContent || "";
      if (cur.indexOf("Đã thử:") !== -1 || cur.indexOf("kanjiData.json") !== -1) {
        return;
      }
      els.loadStatus.textContent =
        "Lỗi: không có kanjiData. Ưu tiên file pip-kanji-pwa/kanjiData.json (cần mở qua http://localhost, không dùng file://). Nếu vẫn lỗi: chạy server từ thư mục app10_files để có ../data/kanjiData.js, hoặc chép data/kanjiData.js vào pip-kanji-pwa/kanjiData.js.";
    }
  }

  window.addEventListener("hashchange", bootFromHash);
  registerSw();
  loadKanjiData();
})();
