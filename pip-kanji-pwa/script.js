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

  /* =========================================================
     UI MỚI
  ========================================================= */

  function drawCanvas() {
    var item = state.selected;

    if (!item || !ctx) {
      return;
    }

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.save();

    ctx.beginPath();
    ctx.rect(0, 0, CANVAS_W, CANVAS_H);
    ctx.clip();

    var leftW = 150;
    var rightX = leftW + 18;
    var rightW = CANVAS_W - rightX - 14;

    /* nền cột trái */

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, leftW, CANVAS_H);

    /* divider */

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(leftW, 0, 1, CANVAS_H);

    /* =====================================================
       CỘT TRÁI
    ===================================================== */

    var leftCenter = leftW / 2;
    var yLeft = 58;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#f8fafc";

    ctx.font =
      "bold 92px 'Hiragino Sans', 'Yu Gothic', 'PingFang SC', sans-serif";

    ctx.fillText(item.kanji || "", leftCenter, yLeft);

    yLeft += 72;

    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "600 20px system-ui, 'Segoe UI', sans-serif";

      ctx.fillText(item.hanviet, leftCenter, yLeft);

      yLeft += 36;
    }

    ctx.fillStyle = "#cbd5e1";

    ctx.font = "15px system-ui, sans-serif";

    var onLines = wrapLinesToArray(
      "On: " + (item.on || "—"),
      leftW - 18
    );

    yLeft =
      drawParagraphCenter(
        leftCenter,
        yLeft,
        leftW - 18,
        20,
        onLines
      ) + 12;

    var kunLines = wrapLinesToArray(
      "Kun: " + (item.kun || "—"),
      leftW - 18
    );

    yLeft =
      drawParagraphCenter(
        leftCenter,
        yLeft,
        leftW - 18,
        20,
        kunLines
      ) + 14;

    if (item.radicals) {
      ctx.fillStyle = "#94a3b8";

      ctx.font = "14px system-ui, sans-serif";

      var radLines = wrapLinesToArray(
        "Bộ thủ: " + item.radicals,
        leftW - 18
      );

      yLeft =
        drawParagraphCenter(
          leftCenter,
          yLeft,
          leftW - 18,
          18,
          radLines
        ) + 8;
    }

    /* =====================================================
       CỘT PHẢI
    ===================================================== */

    var yRight = 34;

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    /* nghĩa */

    ctx.fillStyle = "#f1f5f9";

    ctx.font =
      "600 20px system-ui, 'Segoe UI', sans-serif";

    ctx.fillText("Ý nghĩa", rightX, yRight);

    yRight += 28;

    ctx.fillStyle = "#cbd5e1";

    ctx.font = "17px system-ui, sans-serif";

    var meaningLines = wrapLinesToArray(
      item.meaning || "",
      rightW
    );

    for (var i = 0; i < meaningLines.length; i++) {
      ctx.fillText(
        meaningLines[i],
        rightX,
        yRight
      );

      yRight += 22;
    }

    yRight += 16;

    /* gợi nhớ */

    if (item.memory_tip) {
      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "600 16px system-ui, 'Segoe UI', sans-serif";

      ctx.fillText("Gợi nhớ", rightX, yRight);

      yRight += 24;

      ctx.fillStyle = "#94a3b8";

      ctx.font = "14px system-ui, sans-serif";

      var tipLines = wrapLinesToArray(
        item.memory_tip,
        rightW
      );

      for (var j = 0; j < tipLines.length; j++) {
        ctx.fillText(
          tipLines[j],
          rightX,
          yRight
        );

        yRight += 19;
      }

      yRight += 14;
    }

    /* từ vựng */

    var vocabs = item._vocabs || [];

    if (vocabs.length) {
      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "600 16px system-ui, 'Segoe UI', sans-serif";

      ctx.fillText("Từ vựng", rightX, yRight);

      yRight += 26;

      vocabs.forEach(function (v) {
        var line = "• " + (v.word || "");

        if (v.reading) {
          line += " (" + v.reading + ")";
        }

        if (v.meaning) {
          line += " — " + v.meaning;
        }

        ctx.fillStyle = "#e2e8f0";

        ctx.font =
          "600 14px system-ui, sans-serif";

        var lines = wrapLinesToArray(
          line,
          rightW
        );

        for (var k = 0; k < lines.length; k++) {
          ctx.fillText(
            lines[k],
            rightX,
            yRight
          );

          yRight += 18;
        }

        yRight += 10;
      });
    }

    ctx.restore();
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
      setFallback(cap.reason);
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
      els.video.setAttribute(
        "webkit-playsinline",
        ""
      );

      els.btnPip.disabled = false;

      setFallback("");
    } catch (e) {
      els.btnPip.disabled = true;

      setFallback(
        "Không tạo được stream: " +
          (e && e.message ? e.message : e)
      );
    }
  }

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
      state.rafId = requestAnimationFrame(loop);
    }
  }

  function openPipFromUserGesture() {
    var v = els.video;

    if (!v || !v.requestPictureInPicture) {
      return;
    }

    try {
      v.play().catch(function () {});

      v.requestPictureInPicture()
        .then(function () {
          state.pipActive = true;
        })
        .catch(function () {});
    } catch (e) {}
  }

  els.btnPip.addEventListener(
    "click",
    openPipFromUserGesture
  );

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
    var m = (window.location.hash || "").match(
      /^#kanji=(.+)$/
    );

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
        renderDetail();
        clearLoadError();
      }
    } catch (e) {}
  }

  function registerSw() {
    if (location.protocol === "file:") {
      return;
    }

    if (
      typeof window.isSecureContext !==
        "undefined" &&
      !window.isSecureContext
    ) {
      return;
    }

    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("./sw.js", {
        scope: "./"
      })
      .catch(function () {});
  }

  function bootFromKanjiData(arr) {
    state.items = (
      Array.isArray(arr) ? arr : []
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
          raw.stt != null ? raw.stt : idx + 1
        ),

        kanji: raw.kanji || "",

        meaning: raw.core_meaning || "",

        on: on,

        kun: kun,

        hanviet: raw.hanviet || "",

        radicals:
          raw.radicals != null
            ? String(raw.radicals)
            : "",

        memory_tip:
          raw.memory_tip != null
            ? String(raw.memory_tip)
            : "",

        vocabulary: raw.vocabulary
      };

      o._vocabs = normalizeVocabularyList({
        vocabulary: raw.vocabulary
      });

      return o;
    });

    bootFromHash();

    if (!state.selected && state.items.length) {
      state.selected = state.items[0];

      renderDetail();

      history.replaceState(
        { id: state.selected.id },
        "",
        "#kanji=" +
          encodeURIComponent(state.selected.id)
      );
    }

    clearLoadError();
  }

  function getKanjiDataArray() {
    if (
      typeof kanjiData !== "undefined" &&
      Array.isArray(kanjiData) &&
      kanjiData.length
    ) {
      return kanjiData;
    }

    if (
      window.kanjiData &&
      Array.isArray(window.kanjiData) &&
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

  window.addEventListener(
    "hashchange",
    bootFromHash
  );

  registerSw();

  loadKanjiData();
})();