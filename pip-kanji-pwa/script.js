(function () {
  "use strict";

  const CANVAS_W = 405;
  const CANVAS_H = 500;

  const state = {
    items: [],
    selected: null,
    stream: null,
    pipActive: false,
    rafId: 0,
    lastDraw: 0,
    autoPipOnSelect: true,

    pipBlobUrl: null,
    pipUsingRecorded: false,

    pipRecordTimer: 0,
    hiddenPipTimer: 0
  };

  const els = {
    loadStatus: document.getElementById("load-status"),
    detailPanel: document.getElementById("detail-panel"),
    canvas: document.getElementById("main-canvas"),
    btnPip: document.getElementById("btn-pip"),
    video: document.getElementById("pip-video"),
    fallback: document.getElementById("fallback-box")
  };

  const ctx = els.canvas.getContext("2d");

  function parseLegacyPipeVocab(s) {
    var out = [];
    String(s).split("|").forEach(function (seg) {
      var t = String(seg).trim();
      if (!t) return;

      var m = t.match(/^(.+?)\(([^)]+)\)\s*:\s*(.+)$/);
      if (m) {
        out.push({
          word: m[1].trim(),
          reading: m[2].trim(),
          meaning: m[3].trim()
        });
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

  function supportsPipFromCanvas() {
    var c = els.canvas;
    var v = els.video;

    if (!c || !c.captureStream) return { ok: false };
    if (!v || !v.requestPictureInPicture) return { ok: false };
    return { ok: true };
  }

  function setFallback(msg) {
    if (!els.fallback) return;
    els.fallback.hidden = !msg;
    els.fallback.textContent = msg || "";
  }

  function wrapLinesToArray(text, maxW) {
    var s = String(text || "").trim();
    if (!s) return [];

    var lines = [];
    var parts = s.split(/(\s+)/);
    var cur = "";

    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (!p) continue;

      var test = cur + p;
      if (ctx.measureText(test).width <= maxW) {
        cur = test;
      } else {
        if (cur.trim()) lines.push(cur.trim());
        cur = p;
      }
    }

    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }

  function drawParagraphCenter(cx, y, maxW, lh, lines) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], cx, y + lh / 2);
      y += lh;
    }
    return y;
  }

  /* =====================================================
     ✅ UI 2 CỘT - CHỈ SỬA PHẦN NÀY (KHÔNG ĐỤNG FLOW)
     ===================================================== */
  function drawCanvas() {
    var item = state.selected;
    if (!item || !ctx) return;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    var pad = 14;
    var mid = CANVAS_W / 2;

    var lx = pad;
    var rx = mid + pad;

    var lw = mid - pad * 2;
    var rw = mid - pad * 2;

    var yl = 54;
    var yr = 54;

    /* ===== LEFT ===== */
    ctx.textAlign = "left";

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 80px sans-serif";
    ctx.fillText(item.kanji || "", lx, yl);
    yl += 70;

    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 16px sans-serif";
      ctx.fillText(item.hanviet, lx, yl);
      yl += 26;
    }

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText("On: " + (item.on || "—"), lx, yl);
    yl += 20;

    ctx.fillText("Kun: " + (item.kun || "—"), lx, yl);
    yl += 26;

    if (item.radicals) {
      ctx.fillStyle = "#78716c";
      ctx.font = "12px sans-serif";
      yl = drawParagraphCenter(
        lx,
        yl,
        lw,
        16,
        wrapLinesToArray("Bộ thủ: " + item.radicals, lw)
      );
    }

    /* ===== RIGHT ===== */
    ctx.textAlign = "left";

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "14px sans-serif";

    yr = drawParagraphCenter(
      rx,
      yr,
      rw,
      18,
      wrapLinesToArray(item.meaning || "", rw)
    );

    if (item.memory_tip) {
      ctx.fillStyle = "#64748b";
      ctx.font = "12px sans-serif";

      yr = drawParagraphCenter(
        rx,
        yr,
        rw,
        16,
        wrapLinesToArray(item.memory_tip, rw)
      );
    }

    var vocabs = item._vocabs || [];
    if (vocabs.length) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("Từ vựng", rx, yr);
      yr += 18;

      ctx.font = "11px sans-serif";

      vocabs.forEach(function (v) {
        var line = v.word;
        if (v.reading) line += "(" + v.reading + ")";
        if (v.meaning) line += " - " + v.meaning;

        yr = drawParagraphCenter(
          rx,
          yr,
          rw,
          15,
          wrapLinesToArray(line, rw)
        );
      });
    }
  }

  /* ================= KEEP FULL ORIGINAL FLOW BELOW ================= */

  function loop() {
    drawCanvas();
    state.rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.rafId = 0;
  }

  function attachStreamToVideo() {
    if (!supportsPipFromCanvas().ok) return;

    if (state.stream) {
      state.stream.getTracks().forEach(t => t.stop());
    }

    state.stream = els.canvas.captureStream(30);
    els.video.srcObject = state.stream;
    els.video.muted = true;
  }

  function renderDetail() {
    if (!state.selected) return;

    attachStreamToVideo();
    drawCanvas();

    if (!state.rafId) state.rafId = requestAnimationFrame(loop);
  }

  function bootFromKanjiData(arr) {
    state.items = arr.map(function (r, i) {
      var o = {
        id: String(r.stt || i),
        kanji: r.kanji,
        meaning: r.core_meaning,
        on: r.on_reading,
        kun: r.kun_reading,
        hanviet: r.hanviet,
        radicals: r.radicals,
        memory_tip: r.memory_tip,
        vocabulary: r.vocabulary
      };
      o._vocabs = normalizeVocabularyList({ vocabulary: r.vocabulary });
      return o;
    });

    state.selected = state.items[0];
    renderDetail();
  }

  window.loadKanjiData = function () {
    if (window.kanjiData) bootFromKanjiData(window.kanjiData);
  };

  loadKanjiData();
})();