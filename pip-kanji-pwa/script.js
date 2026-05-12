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

  /** Góp dòng (kể cả chuỗi không có khoảng trắng), căn giữa tại cx; trả về y dưới đoạn vừa vẽ. */
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
      if (!p) {
        continue;
      }
      var test = cur + p;
      if (ctx.measureText(test).width <= maxW) {
        cur = test;
        continue;
      }
      if (cur.trim()) {
        lines.push(cur.trim());
      }
      cur = p;
      while (cur.length > 0 && ctx.measureText(cur).width > maxW) {
        var lo = 1;
        var hi = cur.length;
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
    if (cur.trim()) {
      lines.push(cur.trim());
    }
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

    var cx = CANVAS_W / 2;
    var pad = 14;
    var maxW = CANVAS_W - 2 * pad;
    var y = 54;

    ctx.textAlign = "center";

    ctx.fillStyle = "#f8fafc";
    ctx.font =
      "bold 96px 'Hiragino Sans', 'Yu Gothic', 'PingFang SC', sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(item.kanji || "", cx, y);
    y += 56;

    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 19px system-ui, 'Segoe UI', sans-serif";
      ctx.fillText(item.hanviet, cx, y);
      y += 28;
    }

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px system-ui, sans-serif";
    var meaningLines = wrapLinesToArray(item.meaning || "", maxW);
    y = drawParagraphCenter(cx, y, maxW, 22, meaningLines) + 12;

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("On: " + (item.on || "—"), cx, y);
    y += 24;
    ctx.fillText("Kun: " + (item.kun || "—"), cx, y);
    y += 24;
    ctx.fillText("Nét: " + (item.strokes != null ? item.strokes : "—"), cx, y);
    y += 28;

    if (item.radicals) {
      ctx.fillStyle = "#78716c";
      ctx.font = "14px system-ui, sans-serif";
      var radLines = wrapLinesToArray("Bộ thủ: " + item.radicals, maxW);
      y = drawParagraphCenter(cx, y, maxW, 19, radLines) + 10;
    }

    if (item.memory_tip) {
      ctx.fillStyle = "#64748b";
      ctx.font = "13px system-ui, sans-serif";
      var tipLines = wrapLinesToArray(item.memory_tip, maxW);
      y = drawParagraphCenter(cx, y, maxW, 18, tipLines) + 12;
    }

    var vocabs = item._vocabs || [];
    if (vocabs.length) {
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText("Từ vựng", cx, y);
      y += 24;

      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px system-ui, sans-serif";
      vocabs.forEach(function (v) {
        var line = v.word || "";
        if (v.reading) {
          line += "(" + v.reading + ")";
        }
        if (v.meaning) {
          line += " — " + v.meaning;
        }
        var vl = wrapLinesToArray(line, maxW);
        y = drawParagraphCenter(cx, y, maxW, 18, vl) + 8;
      });
    }

    ctx.restore();

    // --- FIX IPHONE: Cập nhật poster ngay sau khi vẽ ---
    els.video.poster = els.canvas.toDataURL("image/jpeg", 0.8);
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
      
      // --- FIX IPHONE: Gán video mồi Base64 nếu video chưa có src thực ---
      if (!els.video.src || els.video.src.startsWith('data:')) {
        els.video.src = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc29tYXZjMQAAAAh0cmFmAAAAZHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAABAAAAAAByZWYAAAAIZWxtcwAAAAEAAAABAAAAAAAAbWRpYWhkcmEAAAAAAA==";
        els.video.loop = true;
      }

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

  if (els.video) {
    els.video.addEventListener("leavepictureinpicture", function () {
      state.pipActive = false;
    });
  }

  function clearLoadError() {
    if (els.loadStatus) {
      els.loadStatus.textContent = "";
      els.loadStatus.hidden = true;
    }
  }

  function showLoadError(msg) {
    if (!els.loadStatus) {
      return;
    }
    els.loadStatus.textContent = msg;
    els.loadStatus.hidden = false;
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
        renderDetail({ skipAutoPip: true });
        clearLoadError();
      }
    } catch (e) {
      /* ignore */
    }
  }

  function registerSw() {
    if (location.protocol === "file:") {
      return;
    }
    if (typeof window.isSecureContext !== "undefined" && !window.isSecureContext) {
      return;
    }
    if (!("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(function () {});
  }

  function bootFromKanjiData(arr) {
    state.items = (Array.isArray(arr) ? arr : []).map(function (raw, idx) {
      var on = String(raw.on_reading != null ? raw.on_reading : "").replace(/\|/g, "、");
      var kun = String(raw.kun_reading != null ? raw.kun_reading : "").replace(/\|/g, "、");
      var o = {
        id: String(raw.stt != null ? raw.stt : idx + 1),
        kanji: raw.kanji || "",
        meaning: raw.core_meaning || "",
        on: on,
        kun: kun,
        strokes: raw.stroke_count != null ? raw.stroke_count : "",
        hanviet: raw.hanviet || "",
        radicals: raw.radicals != null ? String(raw.radicals) : "",
        memory_tip: raw.memory_tip != null ? String(raw.memory_tip) : "",
        vocabulary: raw.vocabulary
      };
      o._vocabs = normalizeVocabularyList({ vocabulary: raw.vocabulary });
      return o;
    });
    bootFromHash();
    if (!state.selected && state.items.length) {
      state.selected = state.items[0];
      renderDetail({ skipAutoPip: true });
      history.replaceState({ id: state.selected.id }, "", "#kanji=" + encodeURIComponent(state.selected.id));
    }
    clearLoadError();
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
      return;
    }
    showLoadError("Không tải được dữ liệu Kanji (kanjiData.js).");
  }

  window.addEventListener("hashchange", bootFromHash);
  registerSw();
  loadKanjiData();
})();
