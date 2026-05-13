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
    autoPipOnSelect: true
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
          "Trình duyệt không hỗ trợ Picture-in-Picture."
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

  // =====================================================
  // DRAW
  // =====================================================

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

    var leftW = 150;
    var rightX = leftW + 18;
    var rightW = CANVAS_W - rightX - 16;

    // LEFT PANEL
    ctx.fillStyle = "rgba(255,255,255,0.04)";

    roundRect(
      ctx,
      12,
      12,
      leftW,
      CANVAS_H - 24,
      18
    );

    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(255,255,255,0.12)";
    ctx.shadowBlur = 16;

    ctx.fillStyle = "#f8fafc";

    ctx.font =
      "bold 100px 'Hiragino Sans', 'Yu Gothic', 'PingFang SC', sans-serif";

    ctx.fillText(
      item.kanji || "",
      12 + leftW / 2,
      120
    );

    ctx.shadowBlur = 0;

    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "600 22px system-ui, sans-serif";

      ctx.fillText(
        item.hanviet,
        12 + leftW / 2,
        195
      );
    }

    ctx.fillStyle = "#94a3b8";

    ctx.font =
      "14px system-ui, sans-serif";

    ctx.fillText(
      "NÉT",
      12 + leftW / 2,
      255
    );

    ctx.fillStyle = "#f8fafc";

    ctx.font =
      "bold 34px system-ui, sans-serif";

    ctx.fillText(
      item.strokes != null
        ? String(item.strokes)
        : "—",
      12 + leftW / 2,
      295
    );

    // ON
    ctx.fillStyle = "#64748b";

    ctx.font =
      "bold 13px system-ui, sans-serif";

    ctx.fillText(
      "ON",
      12 + leftW / 2,
      360
    );

    ctx.fillStyle = "#e2e8f0";

    ctx.font =
      "14px system-ui, sans-serif";

    var onLines = wrapLinesToArray(
      item.on || "—",
      110
    );

    drawParagraphCenter(
      12 + leftW / 2,
      376,
      110,
      18,
      onLines
    );

    // KUN
    ctx.fillStyle = "#64748b";

    ctx.font =
      "bold 13px system-ui, sans-serif";

    ctx.fillText(
      "KUN",
      12 + leftW / 2,
      430
    );

    ctx.fillStyle = "#e2e8f0";

    ctx.font =
      "14px system-ui, sans-serif";

    var kunLines = wrapLinesToArray(
      item.kun || "—",
      110
    );

    drawParagraphCenter(
      12 + leftW / 2,
      446,
      110,
      18,
      kunLines
    );

    // RIGHT PANEL
    var y = 26;

    if (item.meaning) {
      ctx.textAlign = "left";

      ctx.fillStyle = "#f8fafc";

      ctx.font =
        "bold 18px system-ui, sans-serif";

      ctx.fillText(
        "Ý nghĩa",
        rightX,
        y
      );

      y += 18;

      ctx.fillStyle = "#cbd5e1";

      ctx.font =
        "15px system-ui, sans-serif";

      var meaningLines =
        wrapLinesToArray(
          item.meaning,
          rightW
        );

      meaningLines.forEach(function (line) {
        ctx.fillText(
          line,
          rightX,
          y + 20
        );

        y += 22;
      });

      y += 14;
    }

    if (item.radicals) {
      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "bold 15px system-ui, sans-serif";

      ctx.fillText(
        "Bộ thủ",
        rightX,
        y
      );

      y += 18;

      ctx.fillStyle = "#94a3b8";

      ctx.font =
        "14px system-ui, sans-serif";

      var radLines =
        wrapLinesToArray(
          item.radicals,
          rightW
        );

      radLines.forEach(function (line) {
        ctx.fillText(
          line,
          rightX,
          y + 18
        );

        y += 20;
      });

      y += 14;
    }

    if (item.memory_tip) {
      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "bold 15px system-ui, sans-serif";

      ctx.fillText(
        "Gợi nhớ",
        rightX,
        y
      );

      y += 18;

      ctx.fillStyle = "#64748b";

      ctx.font =
        "italic 13px system-ui, sans-serif";

      var tipLines =
        wrapLinesToArray(
          item.memory_tip,
          rightW
        );

      tipLines.forEach(function (line) {
        ctx.fillText(
          line,
          rightX,
          y + 17
        );

        y += 18;
      });

      y += 14;
    }

    var vocabs = item._vocabs || [];

    if (vocabs.length) {
      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "bold 15px system-ui, sans-serif";

      ctx.fillText(
        "Từ vựng",
        rightX,
        y
      );

      y += 20;

      vocabs.slice(0, 4).forEach(function (v) {
        ctx.fillStyle = "#f8fafc";

        ctx.font =
          "600 14px system-ui, sans-serif";

        var title = v.word || "";

        if (v.reading) {
          title += " (" + v.reading + ")";
        }

        var wordLines =
          wrapLinesToArray(
            title,
            rightW
          );

        wordLines.forEach(function (line) {
          ctx.fillText(
            line,
            rightX,
            y + 17
          );

          y += 18;
        });

        if (v.meaning) {
          ctx.fillStyle = "#94a3b8";

          ctx.font =
            "13px system-ui, sans-serif";

          var mLines =
            wrapLinesToArray(
              v.meaning,
              rightW - 6
            );

          mLines.forEach(function (line) {
            ctx.fillText(
              line,
              rightX + 6,
              y + 15
            );

            y += 16;
          });
        }

        y += 10;
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

  function stopLoop() {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
  }

  // =====================================================
  // PIP
  // =====================================================

  function attachStreamToVideo() {
    var cap = supportsPipFromCanvas();

    if (!cap.ok) {
      els.btnPip.disabled = true;
      setFallback(cap.reason);
      return;
    }

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

      els.btnPip.disabled = false;

      setFallback("");
    } catch (e) {
      els.btnPip.disabled = true;

      setFallback(
        "Không tạo được stream."
      );
    }
  }

  async function openPipFromUserGesture() {
    var v = els.video;

    if (
      !v ||
      !v.requestPictureInPicture
    ) {
      return;
    }

    try {
      await v.play();

      await v.requestPictureInPicture();

      state.pipActive = true;
    } catch (e) {
      console.warn(e);
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  function renderDetail() {
    var item = state.selected;

    if (!item) {
      els.detailPanel.hidden = true;
      stopLoop();
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
  // EVENTS
  // =====================================================

  els.btnPip.addEventListener(
    "click",
    function () {
      openPipFromUserGesture();
    }
  );

  // =====================================================
  // DATA
  // =====================================================

  function clearLoadError() {
    if (els.loadStatus) {
      els.loadStatus.textContent = "";
      els.loadStatus.hidden = true;
    }
  }

  function showLoadError(msg) {
    if (!els.loadStatus) return;

    els.loadStatus.textContent = msg;
    els.loadStatus.hidden = false;
  }

  function bootFromHash() {
    var m = (
      window.location.hash || ""
    ).match(/^#kanji=(.+)$/);

    if (!m || !state.items.length) {
      return;
    }

    try {
      var id = decodeURIComponent(m[1]);

      var found = state.items.find(
        function (x) {
          return (
            String(x.id) ===
            String(id)
          );
        }
      );

      if (found) {
        state.selected = found;

        renderDetail();

        clearLoadError();
      }
    } catch (e) {}
  }

  function bootFromKanjiData(arr) {
    state.items = (
      Array.isArray(arr)
        ? arr
        : []
    ).map(function (raw, idx) {
      var on = String(
        raw.on_reading != null
          ? raw.on_reading
          : ""
      ).replace(/\|/g, "、");

      var kun = String(
        raw.kun_reading != null
          ? raw.kun_reading
          : ""
      ).replace(/\|/g, "、");

      var o = {
        id: String(
          raw.stt != null
            ? raw.stt
            : idx + 1
        ),

        kanji: raw.kanji || "",

        meaning:
          raw.core_meaning || "",

        on: on,

        kun: kun,

        strokes:
          raw.stroke_count != null
            ? raw.stroke_count
            : "",

        hanviet:
          raw.hanviet || "",

        radicals:
          raw.radicals != null
            ? String(raw.radicals)
            : "",

        memory_tip:
          raw.memory_tip != null
            ? String(raw.memory_tip)
            : "",

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

    bootFromHash();

    if (
      !state.selected &&
      state.items.length
    ) {
      state.selected =
        state.items[0];

      renderDetail();

      // AUTO PIP
      setTimeout(function () {
        openPipFromUserGesture();
      }, 500);
    }

    clearLoadError();
  }

  function getKanjiDataArray() {
    if (
      typeof kanjiData !==
        "undefined" &&
      Array.isArray(kanjiData) &&
      kanjiData.length
    ) {
      return kanjiData;
    }

    if (
      window.kanjiData &&
      Array.isArray(
        window.kanjiData
      ) &&
      window.kanjiData.length
    ) {
      return window.kanjiData;
    }

    return null;
  }

  function loadKanjiData() {
    var kd = getKanjiDataArray();

    if (kd) {
      bootFromKanjiData(kd);
      return;
    }

    showLoadError(
      "Không tải được dữ liệu Kanji."
    );
  }

  // =====================================================
  // START
  // =====================================================

  window.addEventListener(
    "hashchange",
    bootFromHash
  );

  window.addEventListener(
    "load",
    function () {
      setTimeout(function () {
        loadKanjiData();
      }, 100);
    },
    { once: true }
  );
})();