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

  // --- XỬ LÝ DỮ LIỆU ---

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

  // --- HÀM VẼ GIAO DIỆN (NEW DASHBOARD STYLE) ---

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
      while (cur.length > 0 && ctx.measureText(cur).width > maxW) {
        var lo = 1, hi = cur.length;
        while (lo < hi) {
          var mid = Math.ceil((lo + hi) / 2);
          if (ctx.measureText(cur.slice(0, mid)).width <= maxW) lo = mid;
          else hi = mid - 1;
        }
        var take = Math.max(1, lo);
        lines.push(cur.slice(0, take));
        cur = cur.slice(take);
      }
    }
    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }

  function drawCanvas() {
    var item = state.selected;
    if (!item || !ctx) return;

    // 1. Nền tổng thể
    ctx.fillStyle = "#020617"; 
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    
    const pad = 20;
    const colW = (CANVAS_W - pad * 3) / 2;

    // --- KHỐI TRÁI: KANJI & HÁN VIỆT ---
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(pad, pad, colW, 160, 12);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 110px 'Hiragino Sans', sans-serif";
    ctx.fillText(item.kanji || "", pad + colW / 2, pad + 70);

    const hv = (item.hanviet || "").toUpperCase();
    ctx.font = "bold 20px system-ui";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(hv, pad + colW / 2, pad + 135);

    // --- KHỐI PHẢI: ON/KUN/STROKES ---
    const rx = pad * 2 + colW;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    // Số nét
    ctx.fillStyle = "#7dd3fc";
    ctx.font = "bold 13px system-ui";
    ctx.fillText("SỐ NÉT: " + (item.strokes || "—"), rx, pad + 5);

    // On-reading
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 11px system-ui";
    ctx.fillText("ON-YOMI:", rx, pad + 32);
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "500 15px system-ui";
    var onL = wrapLinesToArray(item.on || "—", colW);
    onL.slice(0, 2).forEach((l, i) => ctx.fillText(l, rx, pad + 48 + (i * 18)));

    // Kun-reading
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 11px system-ui";
    ctx.fillText("KUN-YOMI:", rx, pad + 95);
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "500 15px system-ui";
    var kunL = wrapLinesToArray(item.kun || "—", colW);
    kunL.slice(0, 2).forEach((l, i) => ctx.fillText(l, rx, pad + 111 + (i * 18)));

    // --- DẢI GIỮA: NGHĨA TIẾNG VIỆT ---
    const mY = 200;
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#334155";
    ctx.beginPath();
    ctx.roundRect(pad, mY, CANVAS_W - pad * 2, 75, 10);
    ctx.fill(); ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px system-ui";
    var mLines = wrapLinesToArray(item.meaning || "", CANVAS_W - 60);
    mLines.slice(0, 2).forEach((l, i) => {
      ctx.fillText(l, CANVAS_W / 2, mY + 24 + (i * 30));
    });

    // --- DẢI DƯỚI: TỪ VỰNG CHI TIẾT ---
    const vY = 295;
    ctx.textAlign = "left";
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 12px system-ui";
    ctx.fillText("TỪ VỰNG TIÊU BIỂU", pad, vY);

    const vocabs = item._vocabs || [];
    vocabs.slice(0, 4).forEach((v, i) => {
      const iy = vY + 28 + (i * 44);
      // Bullet
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath(); ctx.arc(pad + 5, iy + 8, 3, 0, Math.PI * 2); ctx.fill();
      // Word
      ctx.fillStyle = "#f1f5f9";
      ctx.font = "bold 16px system-ui";
      ctx.fillText(v.word + (v.reading ? " (" + v.reading + ")" : ""), pad + 15, iy);
      // Meaning
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px system-ui";
      const vm = v.meaning.length > 42 ? v.meaning.substring(0, 39) + "..." : v.meaning;
      ctx.fillText(vm, pad + 15, iy + 20);
    });

    ctx.restore();
  }

  // --- LOGIC PIP & STREAMING (GIỮ NGUYÊN TỪ FILE GỐC) ---

  function loop() { drawCanvas(); state.rafId = requestAnimationFrame(loop); }
  function stopLoop() { if (state.rafId) cancelAnimationFrame(state.rafId); }
  
  function revokePipBlobUrl() {
    if (state.pipBlobUrl) { try { URL.revokeObjectURL(state.pipBlobUrl); } catch (e) {} state.pipBlobUrl = null; }
    state.pipUsingRecorded = false;
  }

  function startHiddenPipRefresh() {
    if (state.hiddenPipTimer || state.pipUsingRecorded) return;
    state.hiddenPipTimer = setInterval(function () {
      if (state.pipActive && document.visibilityState === "hidden") {
        drawCanvas();
        var t = state.stream?.getVideoTracks()[0];
        if (t?.requestFrame) t.requestFrame();
      }
    }, 120);
  }

  function attachStreamToVideo() {
    if (!els.canvas.captureStream) { els.btnPip.disabled = true; return; }
    try {
      revokePipBlobUrl();
      if (state.stream) state.stream.getTracks().forEach(t => t.stop());
      state.stream = els.canvas.captureStream(30);
      els.video.srcObject = state.stream;
      els.video.muted = true;
      els.video.play().catch(() => {});
      els.btnPip.disabled = false;
    } catch (e) {}
  }

  function openPipFromUserGesture(opts = {}) {
    var v = els.video;
    if (!v.requestPictureInPicture) return Promise.resolve(false);
    v.play().catch(() => {});
    return v.requestPictureInPicture()
      .then(() => { state.pipActive = true; return true; })
      .catch((err) => { return false; });
  }

  // --- KHỞI TẠO DỮ LIỆU ---

  function bootFromKanjiData(arr) {
    state.items = (Array.isArray(arr) ? arr : []).map(function (raw, idx) {
      return {
        id: String(raw.stt != null ? raw.stt : idx + 1),
        kanji: raw.kanji || "",
        meaning: raw.core_meaning || "",
        on: String(raw.on_reading || "").replace(/\|/g, "、"),
        kun: String(raw.kun_reading || "").replace(/\|/g, "、"),
        strokes: raw.stroke_count,
        hanviet: raw.hanviet || "",
        _vocabs: normalizeVocabularyList({ vocabulary: raw.vocabulary })
      };
    });
    if (state.items.length) {
      state.selected = state.items[0];
      renderDetail({ skipAutoPip: true });
    }
  }

  function renderDetail(opts = {}) {
    if (!state.selected) return;
    els.detailPanel.hidden = false;
    attachStreamToVideo();
    drawCanvas();
    if (!state.rafId) loop();
    if (!opts.skipAutoPip && state.autoPipOnSelect) openPipFromUserGesture();
  }

  // --- EVENT LISTENERS ---

  els.btnPip.addEventListener("click", () => openPipFromUserGesture());

  if (els.video) {
    els.video.addEventListener("enterpictureinpicture", () => { state.pipActive = true; });
    els.video.addEventListener("leavepictureinpicture", () => { 
      state.pipActive = false; 
      clearInterval(state.hiddenPipTimer); 
      state.hiddenPipTimer = 0;
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (state.pipActive && document.visibilityState === "hidden") startHiddenPipRefresh();
    else { clearInterval(state.hiddenPipTimer); state.hiddenPipTimer = 0; drawCanvas(); }
  });

  function loadKanjiData() {
    var kd = (typeof kanjiData !== "undefined") ? kanjiData : (window.kanjiData || null);
    if (kd) bootFromKanjiData(kd);
  }

  loadKanjiData();
})();
