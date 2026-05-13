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
          return {
            word: e,
            reading: "",
            meaning: ""
          };
        }

        return {
          word: e.word != null ? String(e.word) : "",
          reading: e.reading != null ? String(e.reading) : "",
          meaning: e.meaning != null ? String(e.meaning) : ""
        };
      });
    }

    if (
      typeof raw.vocabulary === "string" &&
      raw.vocabulary.trim()
    ) {
      return parseLegacyPipeVocab(raw.vocabulary);
    }

    return [];
  }

  function supportsPipFromCanvas() {
    var c = els.canvas;
    var v = els.video;

    if (!c || !c.captureStream) {
      return {
        ok: false,
        reason:
          "Trình duyệt không hỗ trợ canvas.captureStream()."
      };
    }

    if (!v || !v.requestPictureInPicture) {
      return {
        ok: false,
        reason:
          "Trình duyệt không hỗ trợ video.requestPictureInPicture()."
      };
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

    if (!s) {
      return [];
    }

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

      if (cur.trim()) {
        lines.push(cur.trim());
      }

      cur = p;

      while (
        cur.length > 0 &&
        ctx.measureText(cur).width > maxW
      ) {
        var lo = 1;
        var hi = cur.length;

        while (lo < hi) {
          var mid = Math.ceil((lo + hi) / 2);

          if (
            ctx.measureText(cur.slice(0, mid)).width <=
            maxW
          ) {
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

    if (cur.trim()) {
      lines.push(cur.trim());
    }

    return lines;
  }

  function drawParagraphCenter(
    cx,
    y,
    maxW,
    lineHeight,
    lines
  ) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], cx, y + lineHeight / 2);
      y += lineHeight;
    }

    return y;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();

    ctx.moveTo(x + r, y);

    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);

    ctx.closePath();
  }

  function drawCanvas() {
    var item = state.selected;

    if (!item || !ctx) {
      return;
    }

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    var bg = ctx.createLinearGradient(
      0,
      0,
      0,
      CANVAS_H
    );

    bg.addColorStop(0, "#020617");
    bg.addColorStop(1, "#0f172a");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.save();

    ctx.beginPath();
    ctx.rect(0, 0, CANVAS_W, CANVAS_H);
    ctx.clip();

    var cx = CANVAS_W / 2;
    var pad = 22;
    var maxW = CANVAS_W - pad * 2;
    var y = 34;

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(24, 26);
    ctx.lineTo(CANVAS_W - 24, 26);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(255,255,255,0.08)";
    ctx.shadowBlur = 12;

    ctx.fillStyle = "#f8fafc";

    ctx.font =
      "bold 104px 'Hiragino Sans', 'Yu Gothic', 'PingFang SC', sans-serif";

    ctx.fillText(item.kanji || "", cx, y + 56);

    ctx.shadowBlur = 0;

    y += 118;

    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font =
        "600 20px system-ui, sans-serif";

      ctx.fillText(item.hanviet, cx, y);

      y += 34;
    }

    if (item.meaning) {
      ctx.fillStyle = "#e2e8f0";
      ctx.font =
        "18px system-ui, sans-serif";

      var meaningLines = wrapLinesToArray(
        item.meaning,
        maxW
      );

      y = drawParagraphCenter(
        cx,
        y,
        maxW,
        26,
        meaningLines
      );

      y += 18;
    }

    var boxX = 24;
    var boxW = CANVAS_W - 48;
    var boxY = y;
    var rowH = 28;
    var boxH = rowH * 3 + 18;

    ctx.fillStyle = "rgba(255,255,255,0.04)";

    roundRect(
      ctx,
      boxX,
      boxY,
      boxW,
      boxH,
      14
    );

    ctx.fill();

    ctx.fillStyle = "#cbd5e1";

    ctx.font =
      "15px system-ui, sans-serif";

    ctx.textAlign = "left";

    ctx.fillText(
      "On:",
      boxX + 16,
      boxY + 24
    );

    ctx.fillText(
      "Kun:",
      boxX + 16,
      boxY + 24 + rowH
    );

    ctx.fillText(
      "Nét:",
      boxX + 16,
      boxY + 24 + rowH * 2
    );

    ctx.fillStyle = "#f8fafc";

    ctx.fillText(
      item.on || "—",
      boxX + 70,
      boxY + 24
    );

    ctx.fillText(
      item.kun || "—",
      boxX + 70,
      boxY + 24 + rowH
    );

    ctx.fillText(
      item.strokes != null
        ? String(item.strokes)
        : "—",
      boxX + 70,
      boxY + 24 + rowH * 2
    );

    y += boxH + 18;

    if (item.radicals) {
      ctx.textAlign = "center";

      ctx.fillStyle = "#94a3b8";

      ctx.font =
        "14px system-ui, sans-serif";

      var radLines = wrapLinesToArray(
        "Bộ thủ: " + item.radicals,
        maxW
      );

      y = drawParagraphCenter(
        cx,
        y,
        maxW,
        20,
        radLines
      );

      y += 12;
    }

    if (item.memory_tip) {
      ctx.fillStyle = "#64748b";

      ctx.font =
        "italic 13px system-ui, sans-serif";

      var tipLines = wrapLinesToArray(
        item.memory_tip,
        maxW
      );

      y = drawParagraphCenter(
        cx,
        y,
        maxW,
        18,
        tipLines
      );

      y += 18;
    }

    var vocabs = item._vocabs || [];

    if (vocabs.length) {
      ctx.textAlign = "center";

      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "bold 15px system-ui, sans-serif";

      ctx.fillText("TỪ VỰNG", cx, y);

      y += 22;

      vocabs.slice(0, 4).forEach(function (v) {
        ctx.fillStyle = "#f8fafc";

        ctx.font =
          "600 14px system-ui, sans-serif";

        var top = v.word || "";

        if (v.reading) {
          top += " (" + v.reading + ")";
        }

        var topLines = wrapLinesToArray(
          top,
          maxW
        );

        y = drawParagraphCenter(
          cx,
          y,
          maxW,
          18,
          topLines
        );

        if (v.meaning) {
          ctx.fillStyle = "#94a3b8";

          ctx.font =
            "13px system-ui, sans-serif";

          var meaningLines2 =
            wrapLinesToArray(
              v.meaning,
              maxW
            );

          y = drawParagraphCenter(
            cx,
            y,
            maxW,
            17,
            meaningLines2
          );
        }

        y += 10;
      });
    }

    ctx.restore();
  }

  window.__KANJI_DRAW_CANVAS__ = drawCanvas;
})();