(function () {
  "use strict";

  const CANVAS_W = 405;
  const CANVAS_H = 500;

  const state = {
    items: [],
    selected: null,
    stream: null,
    pipActive: false,
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

  const ctx = els.canvas.getContext("2d", { alpha: false }); // alpha: false giúp render nhanh hơn

  function parseLegacyPipeVocab(s) {
    var out = [];
    String(s).split("|").forEach(function (seg) {
      var t = String(seg).trim();
      if (!t) return;
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
        if (typeof e === "string") return { word: e, reading: "", meaning: "" };
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

  function setFallback(msg) {
    if (!els.fallback) return;
    els.fallback.hidden = !msg;
    els.fallback.textContent = msg || "";
  }

  function wrapLinesToArray(text, maxW) {
    var s = String(text || "").trim();
    if (!s) return [];
    var lines = [], parts = s.split(/(\s+)/), cur = "";
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (!p) continue;
      var test = cur + p;
      if (ctx.measureText(test).width <= maxW) { cur = test; continue; }
      if (cur.trim()) lines.push(cur.trim());
      cur = p;
      while (cur.length > 0 && ctx.measureText(cur).width > maxW) {
        var lo = 1, hi = cur.length;
        while (lo < hi) {
          var mid = Math.ceil((lo + hi) / 2);
          if (ctx.measureText(cur.slice(0, mid)).width <= maxW) lo = mid; else hi = mid - 1;
        }
        var take = Math.max(1, lo);
        lines.push(cur.slice(0, take));
        cur = cur.slice(take);
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

  function drawCanvas() {
    var item = state.selected;
    if (!item || !ctx) return;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.save();

    var cx = CANVAS_W / 2;
    var maxW = CANVAS_W - 28;
    var y = 54;

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 96px sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(item.kanji || "", cx, y);
    y += 56;

    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 19px sans-serif";
      ctx.fillText(item.hanviet, cx, y);
      y += 28;
    }

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px sans-serif";
    var mLines = wrapLinesToArray(item.meaning || "", maxW);
    y = drawParagraphCenter(cx, y, maxW, 22, mLines) + 12;

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText("On: " + (item.on || "—"), cx, y); y += 24;
    ctx.fillText("Kun: " + (item.kun || "—"), cx, y); y += 24;
    
    ctx.restore();

    // --- FIX QUAN TRỌNG CHO IPHONE ---
    // Chuyển Canvas thành ảnh và đặt làm Poster
    const dataUrl = els.canvas.toDataURL("image/jpeg", 0.9);
    els.video.poster = dataUrl;
    
    // Mồi video trắng nếu chưa có src
    if (!els.video.src) {
      els.video.src = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc29tYXZjMQAAAAh0cmFmAAAAZHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAABAAAAAAByZWYAAAAIZWxtcwAAAAEAAAABAAAAAAAAbWRpYWhkcmEAAAAAAA==";
      els.video.loop = true;
    }
  }

  function attachStreamToVideo() {
    // Vẫn dùng captureStream để hỗ trợ PiP mượt hơn khi đang mở máy
    try {
      if (els.canvas.captureStream) {
        state.stream = els.canvas.captureStream(1); // Chỉ cần 1 FPS cho text tĩnh
        els.video.srcObject = state.stream;
      }
      els.video.muted = true;
      els.video.setAttribute("playsinline", "");
      els.video.setAttribute("webkit-playsinline", "");
    } catch (e) {}
  }

  function renderDetail(opts) {
    opts = opts || {};
    if (!state.selected) return;
    els.detailPanel.hidden = false;

    drawCanvas();
    attachStreamToVideo();

    if (opts.skipAutoPip !== true && state.autoPipOnSelect) {
      openPipFromUserGesture({ silent: true });
    }
  }

  function openPipFromUserGesture(opts) {
    opts = opts || {};
    var v = els.video;
    if (!v.requestPictureInPicture) return Promise.resolve(false);

    v.play().catch(function(){});
    return v.requestPictureInPicture()
      .then(function () {
        state.pipActive = true;
        return true;
      })
      .catch(function (err) {
        if (!opts.silent) setFallback("Bấm lại nút PiP để kích hoạt.");
        return false;
      });
  }

  els.btnPip.addEventListener("click", function () {
    openPipFromUserGesture({ silent: false });
  });

  function bootFromHash() {
    var m = (window.location.hash || "").match(/^#kanji=(.+)$/);
    if (!m || !state.items.length) return;
    var id = decodeURIComponent(m[1]);
    var found = state.items.find(x => String(x.id) === String(id));
    if (found) {
      state.selected = found;
      renderDetail({ skipAutoPip: true });
    }
  }

  function bootFromKanjiData(arr) {
    state.items = (Array.isArray(arr) ? arr : []).map(function (raw, idx) {
      var o = {
        id: String(raw.stt != null ? raw.stt : idx + 1),
        kanji: raw.kanji || "",
        meaning: raw.core_meaning || "",
        on: String(raw.on_reading || "").replace(/\|/g, "、"),
        kun: String(raw.kun_reading || "").replace(/\|/g, "、"),
        hanviet: raw.hanviet || "",
        vocabulary: raw.vocabulary
      };
      o._vocabs = normalizeVocabularyList({ vocabulary: raw.vocabulary });
      return o;
    });
    bootFromHash();
    if (!state.selected && state.items.length) {
      state.selected = state.items[0];
      renderDetail({ skipAutoPip: true });
    }
  }

  function loadKanjiData() {
    var kd = (typeof kanjiData !== "undefined" && kanjiData) || window.kanjiData;
    if (kd) bootFromKanjiData(kd);
  }

  window.addEventListener("hashchange", bootFromHash);
  loadKanjiData();
})();
