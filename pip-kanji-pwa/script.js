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

  // =====================================================
  // VOCAB
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

  // =====================================================
  // PiP
  // =====================================================

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

  // =====================================================
  // TEXT
  // =====================================================

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
            ctx.measureText(cur.slice(0, mid)).width <= maxW
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

  // =====================================================
  // DRAW
  // =====================================================

  function drawCanvas() {
    var item = state.selected;

    if (!item || !ctx) {
      return;
    }

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

    // =====================================================
    // LAYOUT
    // =====================================================

    var leftW = 136;
    var rightX = leftW + 24;
    var rightW = CANVAS_W - rightX - 18;

    // =====================================================
    // LEFT PANEL
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
      "rgba(255,255,255,0.06)";

    ctx.lineWidth = 1;

    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // =====================================================
    // KANJI
    // =====================================================

    ctx.fillStyle = "#f8fafc";

    ctx.font =
      "bold 76px 'Hiragino Sans', 'Yu Gothic', 'PingFang SC', sans-serif";

    ctx.shadowColor =
      "rgba(255,255,255,0.18)";

    ctx.shadowBlur = 18;

    ctx.fillText(
      item.kanji || "",
      12 + leftW / 2,
      100
    );

    ctx.shadowBlur = 0;

    // =====================================================
    // HANVIET
    // =====================================================

    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "700 21px system-ui, sans-serif";

      ctx.fillText(
        item.hanviet,
        12 + leftW / 2,
        160
      );
    }

    // divider

    ctx.strokeStyle =
      "rgba(255,255,255,0.08)";

    ctx.beginPath();

    ctx.moveTo(28, 208);

    ctx.lineTo(
      12 + leftW - 28,
      208
    );

    ctx.stroke();

    // =====================================================
    // ON
    // =====================================================

    ctx.fillStyle = "#64748b";

    ctx.font =
      "700 12px system-ui, sans-serif";

    ctx.fillText(
      "ON",
      12 + leftW / 2,
      245
    );

    ctx.fillStyle = "#f1f5f9";

    ctx.font =
      "16px system-ui, sans-serif";

    var onLines =
      wrapLinesToArray(
        item.on || "—",
        108
      );

    drawParagraphCenter(
      12 + leftW / 2,
      262,
      21,
      onLines
    );

    // =====================================================
    // KUN
    // =====================================================

    ctx.fillStyle = "#64748b";

    ctx.font =
      "700 12px system-ui, sans-serif";

    ctx.fillText(
      "KUN",
      12 + leftW / 2,
      360
    );

    ctx.fillStyle = "#f1f5f9";

    ctx.font =
      "16px system-ui, sans-serif";

    var kunLines =
      wrapLinesToArray(
        item.kun || "—",
        108
      );

    drawParagraphCenter(
      12 + leftW / 2,
      377,
      21,
      kunLines
    );

    // =====================================================
    // RIGHT
    // =====================================================

    ctx.textAlign = "left";

    var y = 34;

    function sectionTitle(title) {
      ctx.fillStyle = "#7dd3fc";

      ctx.font =
        "700 15px system-ui, sans-serif";

      ctx.fillText(
        title,
        rightX,
        y
      );

      y += 20;
    }

    // =====================================================
    // MEANING
    // =====================================================

    if (item.meaning) {
      sectionTitle("Ý nghĩa");

      ctx.fillStyle = "#f8fafc";

      ctx.font =
        "17px system-ui, sans-serif";

      var meaningLines =
        wrapLinesToArray(
          item.meaning,
          rightW
        );

      meaningLines.forEach(function (line) {
        ctx.fillText(
          line,
          rightX,
          y
        );

        y += 20;
      });

      y += 12;
    }

    // =====================================================
    // RADICAL
    // =====================================================

    if (item.radicals) {
      sectionTitle("Bộ thủ");

      ctx.fillStyle = "#cbd5e1";

      ctx.font =
        "15px system-ui, sans-serif";

      var radLines =
        wrapLinesToArray(
          item.radicals,
          rightW
        );

      radLines.forEach(function (line) {
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
    // MEMORY
    // =====================================================

    if (item.memory_tip) {
      sectionTitle("Gợi nhớ");

      ctx.fillStyle = "#94a3b8";

      ctx.font =
        "14px system-ui, sans-serif";

      var tipLines =
        wrapLinesToArray(
          item.memory_tip,
          rightW
        );

      tipLines.forEach(function (line) {
        ctx.fillText(
          line,
          rightX,
          y
        );

        y += 17;
      });

      y += 14;
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
            "rgba(255,255,255,0.045)";

          ctx.beginPath();

          ctx.roundRect(
            rightX - 7,
            y - 8,
            rightW + 10,
            74,
            16
          );

          ctx.fill();

          // title

          ctx.fillStyle = "#ffffff";

          ctx.font =
            "700 20px system-ui, sans-serif";

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
            rightX + 5,
            y + 14
          );

          // meaning

          if (v.meaning) {
            ctx.fillStyle =
              "#94a3b8";

            ctx.font =
              "15px system-ui, sans-serif";

            var mLines =
              wrapLinesToArray(
                v.meaning,
                rightW - 12
              );

            var my = y + 38;

            mLines
              .slice(0, 2)
              .forEach(function (line) {
                ctx.fillText(
                  line,
                  rightX + 5,
                  my
                );

                my += 18;
              });
          }

          y += 84;
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
      cancelAnimationFrame(
        state.rafId
      );

      state.rafId = 0;
    }
  }

  // =====================================================
  // PiP STREAM
  // =====================================================

  function attachStreamToVideo() {
    var cap =
      supportsPipFromCanvas();

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
        "Không tạo được MediaStream."
      );
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
  // PiP OPEN
  // =====================================================

  function openPipFromUserGesture() {
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

      var pip =
        v.requestPictureInPicture();

      if (
        pip &&
        typeof pip.then === "function"
      ) {
        pip
          .then(function () {
            state.pipActive = true;

            setFallback("");
          })
          .catch(function (err) {
            setFallback(
              "Không bật được PiP: " +
                err.message
            );
          });
      }

    } catch (e) {
      setFallback(
        "Lỗi PiP: " + e.message
      );
    }
  }

  els.btnPip.addEventListener(
    "click",
    function () {
      openPipFromUserGesture();
    }
  );

  // =====================================================
  // LOAD
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
    var m =
      (window.location.hash || "")
        .match(/^#kanji=(.+)$/);

    if (!m || !state.items.length) {
      return;
    }

    try {
      var id =
        decodeURIComponent(m[1]);

      var found =
        state.items.find(function (x) {
          return (
            String(x.id) ===
            String(id)
          );
        });

      if (found) {
        state.selected = found;

        renderDetail();

        clearLoadError();
      }

    } catch (e) {}
  }

  function registerSw() {
    if (
      location.protocol === "file:"
    ) {
      return;
    }

    if (
      typeof window.isSecureContext !==
        "undefined" &&
      !window.isSecureContext
    ) {
      return;
    }

    if (
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    navigator.serviceWorker
      .register("./sw.js", {
        scope: "./"
      })
      .catch(function () {});
  }

  function bootFromKanjiData(arr) {
    state.items =
      (Array.isArray(arr)
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

          kanji:
            raw.kanji || "",

          meaning:
            raw.core_meaning || "",

          on: on,

          kun: kun,

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

      history.replaceState(
        { id: state.selected.id },
        "",
        "#kanji=" +
          encodeURIComponent(
            state.selected.id
          )
      );
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
    var kd =
      getKanjiDataArray();

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