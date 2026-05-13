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
          word: String(e.word || ""),
          reading: String(e.reading || ""),
          meaning: String(e.meaning || "")
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

    if (!c || !c.captureStream) {
      return { ok: false, reason: "Trình duyệt không hỗ trợ canvas.captureStream()." };
    }
    if (!v || !v.requestPictureInPicture) {
      return { ok: false, reason: "Trình duyệt không hỗ trợ PiP." };
    }

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
        continue;
      }

      if (cur.trim()) lines.push(cur.trim());

      cur = p;

      while (cur.length && ctx.measureText(cur).width > maxW) {
        var lo = 1, hi = cur.length;

        while (lo < hi) {
          var mid = Math.ceil((lo + hi) / 2);
          if (ctx.measureText(cur.slice(0, mid)).width <= maxW) lo = mid;
          else hi = mid - 1;
        }

        var cut = Math.max(1, lo);
        lines.push(cur.slice(0, cut));
        cur = cur.slice(cut);
      }
    }

    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }

  function drawParagraphCenter(cx, y, maxW, lineHeight, lines) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], cx, y + lineHeight / 2);
      y += lineHeight;
    }

    return y;
  }

  /* =========================================================
     ONLY CHANGE: UI DRAW (2 COLUMNS)
     - KHÔNG đụng logic khác
  ========================================================= */
  function drawCanvas() {
    var item = state.selected;
    if (!item || !ctx) return;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.save();

    const leftW = 150;
    const gap = 14;
    const rightX = leftW + gap;
    const rightW = CANVAS_W - rightX - 14;

    /* LEFT BG */
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, leftW, CANVAS_H);

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(leftW, 0, 1, CANVAS_H);

    /* ================= LEFT ================= */

    let lx = leftW / 2;
    let ly = 60;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 88px system-ui";

    ctx.fillText(item.kanji || "", lx, ly);
    ly += 70;

    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 18px system-ui";
      ctx.fillText(item.hanviet, lx, ly);
      ly += 30;
    }

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "14px system-ui";

    let onLines = wrapLinesToArray("On: " + (item.on || "—"), leftW - 10);
    ly = drawParagraphCenter(lx, ly, leftW - 10, 18, onLines) + 8;

    let kunLines = wrapLinesToArray("Kun: " + (item.kun || "—"), leftW - 10);
    ly = drawParagraphCenter(lx, ly, leftW - 10, 18, kunLines) + 10;

    if (item.radicals) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px system-ui";

      let radLines = wrapLinesToArray("Bộ thủ: " + item.radicals, leftW - 10);
      ly = drawParagraphCenter(lx, ly, leftW - 10, 17, radLines);
    }

    /* ================= RIGHT ================= */

    let rx = rightX;
    let ry = 34;

    ctx.textAlign = "left";

    ctx.fillStyle = "#f1f5f9";
    ctx.font = "600 18px system-ui";
    ctx.fillText("Ý nghĩa", rx, ry);

    ry += 26;

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "15px system-ui";

    let meanLines = wrapLinesToArray(item.meaning || "", rightW);
    for (let i = 0; i < meanLines.length; i++) {
      ctx.fillText(meanLines[i], rx, ry);
      ry += 20;
    }

    ry += 10;

    if (item.memory_tip) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 14px system-ui";
      ctx.fillText("Gợi nhớ", rx, ry);
      ry += 20;

      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px system-ui";

      let tipLines = wrapLinesToArray(item.memory_tip, rightW);
      for (let i = 0; i < tipLines.length; i++) {
        ctx.fillText(tipLines[i], rx, ry);
        ry += 18;
      }

      ry += 8;
    }

    let vocabs = item._vocabs || [];
    if (vocabs.length) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 14px system-ui";
      ctx.fillText("Từ vựng", rx, ry);

      ry += 20;

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "13px system-ui";

      vocabs.forEach(v => {
        let line = "• " + v.word;
        if (v.reading) line += " (" + v.reading + ")";
        if (v.meaning) line += " - " + v.meaning;

        let lines = wrapLinesToArray(line, rightW);

        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], rx, ry);
          ry += 16;
        }

        ry += 6;
      });
    }

    ctx.restore();
  }

  /* ================= KEEP ORIGINAL FLOW ================= */

  function loop() {
    drawCanvas();
    state.rafId = requestAnimationFrame(loop);
  }

  function attachStreamToVideo() {
    var cap = supportsPipFromCanvas();
    if (!cap.ok) {
      setFallback(cap.reason);
      return;
    }

    try {
      if (state.stream) {
        state.stream.getTracks().forEach(t => t.stop());
      }

      state.stream = els.canvas.captureStream(30);
      els.video.srcObject = state.stream;
      els.video.muted = true;
    } catch (e) {
      setFallback("Stream error");
    }
  }

  function renderDetail() {
    if (!state.selected) return;

    els.detailPanel.hidden = false;
    attachStreamToVideo();
    drawCanvas();

    if (!state.rafId) {
      state.rafId = requestAnimationFrame(loop);
    }
  }

  function openPipFromUserGesture() {
    var v = els.video;
    if (!v || !v.requestPictureInPicture) return;

    try {
      v.play().catch(() => {});
      v.requestPictureInPicture().catch(() => {});
    } catch (e) {}
  }

  els.btnPip.addEventListener("click", openPipFromUserGesture);

})();