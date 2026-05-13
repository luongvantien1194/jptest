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

  /* =========================
     VOCAB PARSER (GIỮ NGUYÊN)
  ========================= */
  function parseLegacyPipeVocab(s) {
    var out = [];

    String(s)
      .split("|")
      .forEach(function (seg) {
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
          out.push({
            word: t,
            reading: "",
            meaning: ""
          });
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

  /* =========================
     TEXT WRAP (GIỮ NGUYÊN)
  ========================= */
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
        continue;
      }

      if (cur.trim()) lines.push(cur.trim());
      cur = p;

      while (cur.length && ctx.measureText(cur).width > maxW) {
        var lo = 1, hi = cur.length;

        while (lo < hi) {
          var mid = Math.ceil((lo + hi) / 2);
          if (ctx.measureText(cur.slice(0, mid)).width <= maxW) {
            lo = mid;
          } else {
            hi = mid - 1;
          }
        }

        var take = Math.max(1, lo);
        lines.push(cur.slice(0, take));
        cur = cur.slice(take);
      }
    }

    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }

  function drawParagraphCenter(cx, y, lineHeight, lines) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], cx, y + lineHeight / 2);
      y += lineHeight;
    }

    return y;
  }

  /* ==========================================================
     🔥 ONLY CHANGE: drawCanvas (2 COLUMNS + BIGGER FONT)
  ========================================================== */
  function drawCanvas() {
    var item = state.selected;
    if (!item || !ctx) return;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const mid = CANVAS_W / 2;

    const leftX = mid / 2;
    const rightX = mid + mid / 2;

    const leftW = mid - 24;
    const rightW = mid - 24;

    let yL = 70;
    let yR = 60;

    /* ================= LEFT COLUMN ================= */

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 120px 'Hiragino Sans', 'Yu Gothic', sans-serif";
    ctx.fillText(item.kanji || "", leftX, yL);

    yL += 90;

    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 22px system-ui";
      ctx.fillText(item.hanviet, leftX, yL);
      yL += 32;
    }

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px system-ui";

    ctx.fillText("On: " + (item.on || "—"), leftX, yL);
    yL += 28;

    ctx.fillText("Kun: " + (item.kun || "—"), leftX, yL);

    /* ================= RIGHT COLUMN ================= */

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px system-ui";

    var meaningLines = wrapLinesToArray(item.meaning || "", rightW);
    yR = drawParagraphCenter(rightX, yR, 24, meaningLines) + 10;

    if (item.radicals) {
      ctx.fillStyle = "#78716c";
      ctx.font = "15px system-ui";

      var rad = wrapLinesToArray("Bộ: " + item.radicals, rightW);
      yR = drawParagraphCenter(rightX, yR, 20, rad) + 10;
    }

    if (item.memory_tip) {
      ctx.fillStyle = "#64748b";
      ctx.font = "14px system-ui";

      var tip = wrapLinesToArray(item.memory_tip, rightW);
      yR = drawParagraphCenter(rightX, yR, 19, tip) + 10;
    }

    var vocabs = item._vocabs || [];
    if (vocabs.length) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 15px system-ui";
      ctx.fillText("Từ vựng", rightX, yR);
      yR += 26;

      ctx.font = "13px system-ui";

      vocabs.forEach(function (v) {
        var line = v.word || "";
        if (v.reading) line += "(" + v.reading + ")";
        if (v.meaning) line += " — " + v.meaning;

        var lines = wrapLinesToArray(line, rightW);
        yR = drawParagraphCenter(rightX, yR, 18, lines) + 6;
      });
    }
  }

  /* =========================
     ALL ORIGINAL LOGIC BELOW (UNCHANGED)
     ========================= */

  function loop() {
    drawCanvas();
    state.rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.rafId = 0;
  }

  function revokePipBlobUrl() {
    if (state.pipBlobUrl) {
      try {
        URL.revokeObjectURL(state.pipBlobUrl);
      } catch (e) {}
      state.pipBlobUrl = null;
    }
    state.pipUsingRecorded = false;
  }

  function clearPipRecordTimer() {
    if (state.pipRecordTimer) clearTimeout(state.pipRecordTimer);
    state.pipRecordTimer = 0;
  }

  function clearHiddenPipTimer() {
    if (state.hiddenPipTimer) clearInterval(state.hiddenPipTimer);
    state.hiddenPipTimer = 0;
  }

  function refreshPipFrameFromCanvas() {
    drawCanvas();
    if (!state.stream) return;

    var t0 = state.stream.getVideoTracks()[0];
    if (t0 && typeof t0.requestFrame === "function") {
      try { t0.requestFrame(); } catch (e) {}
    }
  }

  function startHiddenPipRefresh() {
    if (state.hiddenPipTimer || state.pipUsingRecorded) return;

    state.hiddenPipTimer = setInterval(function () {
      if (!state.pipActive || document.visibilityState !== "hidden") return;
      refreshPipFrameFromCanvas();
    }, 120);
  }

  function attachStreamToVideo() {
    if (!els.canvas.captureStream) return;

    try {
      if (state.stream) {
        state.stream.getTracks().forEach(t => t.stop());
      }

      state.stream = els.canvas.captureStream(30);
      els.video.srcObject = state.stream;
      els.video.muted = true;
    } catch (e) {}
  }

  /* NOTE: toàn bộ PiP / boot / hash / service worker giữ nguyên trong file bạn */
  /* (không sửa thêm để đảm bảo không vỡ flow) */

})();