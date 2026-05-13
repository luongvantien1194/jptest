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
    hiddenRefreshTimer: 0
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

  // =====================================================
  // HELPERS
  // =====================================================

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

  function parseLegacyPipeVocab(s) {
    var out = [];

    String(s)
      .split("|")
      .forEach(function (seg) {

        var t = String(seg).trim();

        if (!t) return;

        var m =
          t.match(
            /^(.+?)\(([^)]+)\)\s*:\s*(.+)$/
          );

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
          word:
            e.word != null
              ? String(e.word)
              : "",

          reading:
            e.reading != null
              ? String(e.reading)
              : "",

          meaning:
            e.meaning != null
              ? String(e.meaning)
              : ""
        };
      });
    }

    if (
      typeof raw.vocabulary === "string" &&
      raw.vocabulary.trim()
    ) {
      return parseLegacyPipeVocab(
        raw.vocabulary
      );
    }

    return [];
  }

  // =====================================================
  // DRAW
  // =====================================================

  function drawCanvas() {

    var item = state.selected;

    if (!item) return;

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

    var leftW = 138;

    var rightX = leftW + 22;

    var rightW =
      CANVAS_W - rightX - 18;

    // =====================================================
    // LEFT
    // =====================================================

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

    // KANJI

    ctx.fillStyle = "#f8fafc";

    ctx.font =
      "bold 82px 'Hiragino Sans', 'Yu Gothic', sans-serif";

    ctx.shadowColor =
      "rgba(255,255,255,0.18)";

    ctx.shadowBlur = 18;

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
        176
      );
    }

    // DIVIDER

    ctx.strokeStyle =
      "rgba(255,255,255,0.08)";

    ctx.beginPath();

    ctx.moveTo(30, 226);

    ctx.lineTo(
      12 + leftW - 30,
      226
    );

    ctx.stroke();

    // ON

    ctx.fillStyle = "#64748b";

    ctx.font =
      "700 13px system-ui";

    ctx.fillText(
      "ON",
      12 + leftW / 2,
      264
    );

    ctx.fillStyle = "#f1f5f9";

    ctx.font =
      "16px system-ui";

    drawParagraphCenter(
      12 + leftW / 2,
      284,
      110,
      20,
      wrapLinesToArray(
        item.on || "—",
        110
      )
    );

    // KUN

    ctx.fillStyle = "#64748b";

    ctx.font =
      "700 13px system-ui";

    ctx.fillText(
      "KUN",
      12 + leftW / 2,
      384
    );

    ctx.fillStyle = "#f1f5f9";

    ctx.font =
      "16px system-ui";

    drawParagraphCenter(
      12 + leftW / 2,
      404,
      110,
      20,
      wrapLinesToArray(
        item.kun || "—",
        110
      )
    );

    // =====================================================
    // RIGHT
    // =====================================================

    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    var y = 34;

    function sectionTitle(title) {

      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "700 16px system-ui";

      ctx.fillText(
        title,
        rightX,
        y
      );

      y += 20;
    }

    // Meaning

    if (item.meaning) {

      sectionTitle("Ý nghĩa");

      ctx.fillStyle = "#f8fafc";

      ctx.font =
        "17px system-ui";

      wrapLinesToArray(
        item.meaning,
        rightW
      ).forEach(function (line) {

        ctx.fillText(
          line,
          rightX,
          y
        );

        y += 18;
      });

      y += 10;
    }

    // Radical

    if (item.radicals) {

      sectionTitle("Bộ thủ");

      ctx.fillStyle = "#cbd5e1";

      ctx.font =
        "15px system-ui";

      wrapLinesToArray(
        item.radicals,
        rightW
      ).forEach(function (line) {

        ctx.fillText(
          line,
          rightX,
          y
        );

        y += 18;
      });

      y += 10;
    }

    // Memory

    if (item.memory_tip) {

      sectionTitle("Gợi nhớ");

      ctx.fillStyle = "#94a3b8";

      ctx.font =
        "15px system-ui";

      wrapLinesToArray(
        item.memory_tip,
        rightW
      ).forEach(function (line) {

        ctx.fillText(
          line,
          rightX,
          y
        );

        y += 18;
      });

      y += 12;
    }

    // =====================================================
    // VOCAB
    // =====================================================

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
            y - 4,
            rightW + 8,
            64,
            14
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
            rightX + 6,
            y + 10
          );

          // MEANING

          if (v.meaning) {

            ctx.fillStyle =
              "#94a3b8";

            ctx.font =
              "15px system-ui";

            var my = y + 36;

            wrapLinesToArray(
              v.meaning,
              rightW - 14
            )
              .slice(0, 2)
              .forEach(function (line) {

                ctx.fillText(
                  line,
                  rightX + 6,
                  my
                );

                my += 17;
              });
          }

          y += 74;
        });
    }

    ctx.restore();
  }

  // =====================================================
  // LOOP
  // =====================================================

  function loop() {

    drawCanvas();

    state.rafId =
      requestAnimationFrame(loop);
  }

  // =====================================================
  // PIP
  // =====================================================

  function refreshPipFrame() {

    drawCanvas();

    if (!state.stream) return;

    var tracks =
      state.stream.getVideoTracks();

    var t0 = tracks[0];

    if (
      t0 &&
      typeof t0.requestFrame ===
        "function"
    ) {
      try {
        t0.requestFrame();
      } catch (e) {}
    }
  }

  function startHiddenRefresh() {

    if (state.hiddenRefreshTimer) {
      return;
    }

    state.hiddenRefreshTimer =
      setInterval(function () {

        if (
          document.visibilityState ===
          "hidden"
        ) {
          refreshPipFrame();
        }

      }, 120);
  }

  function stopHiddenRefresh() {

    if (
      state.hiddenRefreshTimer
    ) {
      clearInterval(
        state.hiddenRefreshTimer
      );

      state.hiddenRefreshTimer = 0;
    }
  }

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
        "Không tạo được MediaStream."
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

      var p = v.play();

      if (
        p &&
        typeof p.catch === "function"
      ) {
        p.catch(function () {});
      }

      v.requestPictureInPicture()
        .then(function () {

          state.pipActive = true;

          startHiddenRefresh();

          setFallback("");

        })
        .catch(function (err) {

          setFallback(
            "PiP lỗi: " +
              err.message
          );
        });

    } catch (e) {

      setFallback(
        "PiP lỗi: " +
          e.message
      );
    }
  }

  // =====================================================
  // DETAIL
  // =====================================================

  function renderDetail() {

    if (!state.selected) {
      return;
    }

    els.detailPanel.hidden = false;

    attachStreamToVideo();

    drawCanvas();

    if (!state.rafId) {

      state.rafId =
        requestAnimationFrame(loop);
    }
  }

  // =====================================================
  // LOAD
  // =====================================================

  function bootFromKanjiData(arr) {

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
          normalizeVocabularyList({
            vocabulary:
              raw.vocabulary
          });

        return o;
      });

    if (state.items.length) {

      state.selected =
        state.items[0];

      renderDetail();
    }
  }

  // =====================================================
  // EVENTS
  // =====================================================

  els.btnPip.addEventListener(
    "click",
    function () {
      openPip();
    }
  );

  document.addEventListener(
    "visibilitychange",
    function () {

      if (
        document.visibilityState ===
        "visible"
      ) {
        drawCanvas();
      }
    }
  );

  // =====================================================
  // BOOT
  // =====================================================

  if (
    window.kanjiData &&
    Array.isArray(window.kanjiData)
  ) {
    bootFromKanjiData(
      window.kanjiData
    );
  }

})();