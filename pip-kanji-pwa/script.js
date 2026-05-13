(function () {
  "use strict";

  const CANVAS_W = 405;
  const CANVAS_H = 500;

  const state = {
    items: [],
    selected: null,
    stream: null,
    pipActive: false,
    rafId: 0
  };

  const els = {
    canvas: document.getElementById("main-canvas"),
    video: document.getElementById("pip-video"),
    btnPip: document.getElementById("btn-pip"),
    detailPanel: document.getElementById("detail-panel"),
    fallback: document.getElementById("fallback-box")
  };

  const ctx = els.canvas.getContext("2d");

  // ======================================================
  // HELPERS
  // ======================================================

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

      if (cur.trim()) {
        lines.push(cur.trim());
      }

      cur = p;
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
      ctx.fillText(
        lines[i],
        cx,
        y + lineHeight / 2
      );

      y += lineHeight;
    }

    return y;
  }

  function setFallback(msg) {
    if (!els.fallback) return;

    els.fallback.hidden = !msg;
    els.fallback.textContent = msg || "";
  }

  // ======================================================
  // DRAW
  // ======================================================

  function drawCanvas() {
    var item = state.selected;

    if (!item) return;

    // BG

    var bg = ctx.createLinearGradient(
      0,
      0,
      0,
      CANVAS_H
    );

    bg.addColorStop(0, "#020617");
    bg.addColorStop(1, "#111827");

    ctx.fillStyle = bg;

    ctx.fillRect(
      0,
      0,
      CANVAS_W,
      CANVAS_H
    );

    ctx.save();

    // ======================================================
    // LAYOUT
    // ======================================================

    var leftW = 138;

    var rightX = leftW + 22;

    var rightW =
      CANVAS_W - rightX - 18;

    // ======================================================
    // LEFT PANEL
    // ======================================================

    ctx.fillStyle =
      "rgba(255,255,255,0.045)";

    ctx.beginPath();

    ctx.roundRect(
      12,
      12,
      leftW,
      CANVAS_H - 24,
      24
    );

    ctx.fill();

    ctx.strokeStyle =
      "rgba(255,255,255,0.07)";

    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // ======================================================
    // KANJI
    // ======================================================

    ctx.fillStyle = "#f8fafc";

    ctx.font =
      "bold 84px 'Hiragino Sans', 'Yu Gothic', sans-serif";

    ctx.shadowColor =
      "rgba(255,255,255,0.15)";

    ctx.shadowBlur = 16;

    ctx.fillText(
      item.kanji || "",
      12 + leftW / 2,
      108
    );

    ctx.shadowBlur = 0;

    // HANVIET

    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "700 22px system-ui";

      ctx.fillText(
        item.hanviet,
        12 + leftW / 2,
        175
      );
    }

    // divider

    ctx.strokeStyle =
      "rgba(255,255,255,0.08)";

    ctx.beginPath();

    ctx.moveTo(30, 225);

    ctx.lineTo(
      12 + leftW - 30,
      225
    );

    ctx.stroke();

    // ======================================================
    // ON
    // ======================================================

    ctx.fillStyle = "#64748b";

    ctx.font =
      "bold 13px system-ui";

    ctx.fillText(
      "ON",
      12 + leftW / 2,
      265
    );

    ctx.fillStyle = "#f1f5f9";

    ctx.font =
      "16px system-ui";

    var onLines =
      wrapLinesToArray(
        item.on || "—",
        110
      );

    drawParagraphCenter(
      12 + leftW / 2,
      285,
      110,
      20,
      onLines
    );

    // ======================================================
    // KUN
    // ======================================================

    ctx.fillStyle = "#64748b";

    ctx.font =
      "bold 13px system-ui";

    ctx.fillText(
      "KUN",
      12 + leftW / 2,
      385
    );

    ctx.fillStyle = "#f1f5f9";

    ctx.font =
      "16px system-ui";

    var kunLines =
      wrapLinesToArray(
        item.kun || "—",
        110
      );

    drawParagraphCenter(
      12 + leftW / 2,
      405,
      110,
      20,
      kunLines
    );

    // ======================================================
    // RIGHT PANEL
    // ======================================================

    ctx.textAlign = "left";

    var y = 34;

    function sectionTitle(title) {
      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "700 15px system-ui";

      ctx.fillText(
        title,
        rightX,
        y
      );

      // closer spacing
      y += 10;
    }

    // ======================================================
    // MEANING
    // ======================================================

    if (item.meaning) {
      sectionTitle("Ý nghĩa");

      ctx.fillStyle = "#f8fafc";

      ctx.font =
        "17px system-ui";

      var meaningLines =
        wrapLinesToArray(
          item.meaning,
          rightW
        );

      meaningLines.forEach(function (
        line
      ) {
        ctx.fillText(
          line,
          rightX,
          y + 13
        );

        y += 18;
      });

      y += 10;
    }

    // ======================================================
    // RADICAL
    // ======================================================

    if (item.radicals) {
      sectionTitle("Bộ thủ");

      ctx.fillStyle = "#cbd5e1";

      ctx.font =
        "15px system-ui";

      var radLines =
        wrapLinesToArray(
          item.radicals,
          rightW
        );

      radLines.forEach(function (
        line
      ) {
        ctx.fillText(
          line,
          rightX,
          y + 13
        );

        y += 18;
      });

      y += 10;
    }

    // ======================================================
    // MEMORY
    // ======================================================

    if (item.memory_tip) {
      sectionTitle("Gợi nhớ");

      ctx.fillStyle = "#94a3b8";

      ctx.font =
        "15px system-ui";

      var tipLines =
        wrapLinesToArray(
          item.memory_tip,
          rightW
        );

      tipLines.forEach(function (
        line
      ) {
        ctx.fillText(
          line,
          rightX,
          y + 13
        );

        y += 18;
      });

      y += 10;
    }

    // ======================================================
    // VOCAB
    // ======================================================

    var vocabs =
      item._vocabs || [];

    if (vocabs.length) {
      sectionTitle("Từ vựng");

      vocabs
        .slice(0, 4)
        .forEach(function (v) {

          ctx.fillStyle =
            "rgba(255,255,255,0.04)";

          ctx.beginPath();

          ctx.roundRect(
            rightX - 6,
            y - 1,
            rightW + 8,
            56,
            12
          );

          ctx.fill();

          // WORD

          ctx.fillStyle =
            "#ffffff";

          ctx.font =
            "700 20px system-ui";

          var title =
            v.word || "";

          if (v.reading) {
            title +=
              " (" +
              v.reading +
              ")";
          }

          ctx.fillText(
            title,
            rightX + 4,
            y + 16
          );

          // meaning

          if (v.meaning) {
            ctx.fillStyle =
              "#94a3b8";

            ctx.font =
              "15px system-ui";

            var mLines =
              wrapLinesToArray(
                v.meaning,
                rightW - 10
              );

            var my = y + 38;

            mLines
              .slice(0, 2)
              .forEach(function (
                line
              ) {
                ctx.fillText(
                  line,
                  rightX + 4,
                  my
                );

                my += 18;
              });
          }

          y += 64;
        });
    }

    ctx.restore();
  }

  // ======================================================
  // LOOP
  // ======================================================

  function loop() {
    drawCanvas();

    state.rafId =
      requestAnimationFrame(loop);
  }

  // ======================================================
  // PiP
  // ======================================================

  function attachStreamToVideo() {
    try {
      if (state.stream) {
        state.stream
          .getTracks()
          .forEach(function (t) {
            t.stop();
          });
      }

      state.stream =
        els.canvas.captureStream(30);

      els.video.srcObject =
        state.stream;

      els.video.muted = true;

      els.video.setAttribute(
        "playsinline",
        ""
      );

      els.video.setAttribute(
        "webkit-playsinline",
        ""
      );

      setFallback("");

    } catch (e) {
      setFallback(
        "Không tạo được stream."
      );
    }
  }

  function openPip() {
    var v = els.video;

    if (
      !v ||
      !v.requestPictureInPicture
    ) {
      setFallback(
        "Không hỗ trợ PiP."
      );

      return;
    }

    try {
      v.play().catch(function () {});

      v.requestPictureInPicture()
        .then(function () {
          state.pipActive = true;
        })
        .catch(function (e) {
          setFallback(
            "PiP lỗi: " +
              e.message
          );
        });

    } catch (e) {
      setFallback(
        "PiP lỗi: " +
          e.message
      );
    }
  }

  // ======================================================
  // DETAIL
  // ======================================================

  function renderDetail() {
    if (!state.selected) return;

    els.detailPanel.hidden = false;

    attachStreamToVideo();

    drawCanvas();

    if (!state.rafId) {
      state.rafId =
        requestAnimationFrame(loop);
    }
  }

  // ======================================================
  // DATA
  // ======================================================

  function normalizeData(arr) {
    state.items =
      (Array.isArray(arr)
        ? arr
        : []
      ).map(function (raw, idx) {

        var on = String(
          raw.on_reading || ""
        ).replace(/\|/g, "、");

        var kun = String(
          raw.kun_reading || ""
        ).replace(/\|/g, "、");

        var o = {
          id: String(
            raw.stt || idx + 1
          ),

          kanji:
            raw.kanji || "",

          meaning:
            raw.core_meaning || "",

          on: on,

          kun: kun,

          hanviet:
            raw.hanviet || "",

          radicals:
            raw.radicals || "",

          memory_tip:
            raw.memory_tip || "",

          vocabulary:
            raw.vocabulary
        };

        o._vocabs =
          Array.isArray(
            raw.vocabulary
          )
            ? raw.vocabulary
            : [];

        return o;
      });

    if (state.items.length) {
      state.selected =
        state.items[0];

      renderDetail();
    }
  }

  // ======================================================
  // EVENTS
  // ======================================================

  els.btnPip.addEventListener(
    "click",
    function () {
      openPip();
    }
  );

  // ======================================================
  // BOOT
  // ======================================================

  if (
    window.kanjiData &&
    Array.isArray(
      window.kanjiData
    )
  ) {
    normalizeData(
      window.kanjiData
    );
  }
})();