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

  // --- LOGIC PHÂN TÍCH DỮ LIỆU (Giữ nguyên) ---

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

  // --- TỐI ƯU HIỂN THỊ CANVAS ---

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

    // Nền tối sâu chuyên nghiệp
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, CANVAS_W, CANVAS_H);
    ctx.clip();

    var cx = CANVAS_W / 2;
    var pad = 20;
    var maxW = CANVAS_W - 2 * pad;
    var y = 70;

    ctx.textAlign = "center";

    // 1. Chữ Kanji lớn (Ưu tiên hiển thị rõ trong PiP)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 110px 'Hiragino Sans', 'Yu Gothic', 'PingFang SC', sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(item.kanji || "", cx, y);
    y += 65;

    // 2. Hán Việt (Viết hoa, màu xanh nổi bật)
    if (item.hanviet) {
      ctx.fillStyle = "#38bdf8"; 
      ctx.font = "bold 24px system-ui, sans-serif";
      ctx.fillText(String(item.hanviet).toUpperCase(), cx, y);
      y += 35;
    }

    // 3. Nghĩa tiếng Việt
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "500 20px system-ui, sans-serif";
    var meaningLines = wrapLinesToArray(item.meaning || "", maxW);
    y = drawParagraphCenter(cx, y, maxW, 26, meaningLines) + 20;

    // 4. Thông tin On/Kun (Căn chỉnh lại cho thoáng)
    ctx.font = "16px system-ui, sans-serif";
    
    // Dòng On
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("On: ", cx - 40, y);
    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "left";
    ctx.fillText(item.on || "—", cx - 15, y);
    y += 25;

    // Dòng Kun
    ctx.textAlign = "center";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Kun: ", cx - 40, y);
    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "left";
    ctx.fillText(item.kun || "—", cx - 15, y);
    y += 30;

    // Số nét
    ctx.textAlign = "center";
    ctx.fillStyle = "#64748b";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("Số nét: " + (item.strokes || "—"), cx, y);
    y += 35;

    // 5. Bộ thủ & Mẹo nhớ (Thêm phân cách)
    if (item.radicals || item.memory_tip) {
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, y - 15); ctx.lineTo(CANVAS_W - pad, y - 15); ctx.stroke();

      if (item.radicals) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "italic 14px system-ui, sans-serif";
        var radLines = wrapLinesToArray("Bộ: " + item.radicals, maxW);
        y = drawParagraphCenter(cx, y, maxW, 20, radLines) + 10;
      }

      if (item.memory_tip) {
        ctx.fillStyle = "#fbbf24"; // Màu vàng nổi bật cho ghi chú
        ctx.font = "14px system-ui, sans-serif";
        var tipLines = wrapLinesToArray("💡 " + item.memory_tip, maxW);
        y = drawParagraphCenter(cx, y, maxW, 20, tipLines) + 15;
      }
    }

    // 6. Từ vựng ví dụ (Tối ưu 3 từ quan trọng nhất)
    var vocabs = item._vocabs || [];
    if (vocabs.length) {
      y += 5;
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.fillText("VÍ DỤ", cx, y);
      y += 22;

      ctx.font = "14px system-ui, sans-serif";
      vocabs.slice(0, 3).forEach(function (v) {
        ctx.fillStyle = "#f1f5f9";
        var wordPart = v.word + (v.reading ? " (" + v.reading + ")" : "");
        ctx.fillText(wordPart, cx, y);
        y += 20;
        ctx.fillStyle = "#64748b";
        var vmL = wrapLinesToArray(v.meaning, maxW);
        y = drawParagraphCenter(cx, y, maxW, 18, vmL) + 8;
      });
    }

    ctx.restore();
  }

  // --- LOGIC HỆ THỐNG & PIP (Giữ nguyên không đổi) ---

  function loop() { drawCanvas(); state.rafId = requestAnimationFrame(loop); }
  function stopLoop() { if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = 0; } }

  function supportsPipFromCanvas() {
    var c = els.canvas, v = els.video;
    if (!c || !c.captureStream) return { ok: false, reason: "Trình duyệt không hỗ trợ captureStream." };
    if (!v || !v.requestPictureInPicture) return { ok: false, reason: "Không hỗ trợ PiP." };
    return { ok: true };
  }

  function setFallback(msg) { if (els.fallback) { els.fallback.hidden = !msg; els.fallback.textContent = msg || ""; } }

  function revokePipBlobUrl() {
    if (state.pipBlobUrl) { try { URL.revokeObjectURL(state.pipBlobUrl); } catch (e) {} state.pipBlobUrl = null; }
    state.pipUsingRecorded = false;
  }

  function clearPipRecordTimer() { if (state.pipRecordTimer) { clearTimeout(state.pipRecordTimer); state.pipRecordTimer = 0; } }
  function clearHiddenPipTimer() { if (state.hiddenPipTimer) { clearInterval(state.hiddenPipTimer); state.hiddenPipTimer = 0; } }

  function refreshPipFrameFromCanvas() {
    drawCanvas();
    if (!state.stream) return;
    var t0 = state.stream.getVideoTracks()[0];
    if (t0 && typeof t0.requestFrame === "function") try { t0.requestFrame(); } catch (e) {}
  }

  function startHiddenPipRefresh() {
    if (state.hiddenPipTimer || state.pipUsingRecorded) return;
    state.hiddenPipTimer = setInterval(function () {
      if (!state.pipActive || document.visibilityState !== "hidden") return;
      refreshPipFrameFromCanvas();
    }, 120);
  }

  function pickMediaRecorderMime() {
    if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) return "";
    var types = ["video/mp4", "video/webm;codecs=vp9", "video/webm"];
    for (var i = 0; i < types.length; i++) if (MediaRecorder.isTypeSupported(types[i])) return types[i];
    return "";
  }

  function recordStreamToLoopingBlob(stream, durationMs, done) {
    if (!stream || typeof MediaRecorder === "undefined") { done(null); return; }
    var mime = pickMediaRecorderMime();
    var rec, chunks = [];
    try { rec = new MediaRecorder(stream, mime ? { mimeType: mime } : {}); } catch (e) { done(null); return; }
    rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = function () { done(chunks.length ? new Blob(chunks, { type: mime || rec.mimeType }) : null); };
    try { rec.start(); setTimeout(() => rec.stop(), durationMs); } catch (e) { done(null); }
  }

  function applyLoopingBlobToPipVideo(blob) {
    var v = els.video;
    if (!blob || !v || !state.pipActive) return;
    revokePipBlobUrl();
    state.pipBlobUrl = URL.createObjectURL(blob);
    state.pipUsingRecorded = true;
    v.srcObject = null;
    v.src = state.pipBlobUrl;
    v.loop = true;
    v.play().catch(() => {});
    clearHiddenPipTimer();
  }

  function schedulePipRecordedLoopSwap() {
    clearPipRecordTimer();
    if (state.pipUsingRecorded || typeof MediaRecorder === "undefined") return;
    state.pipRecordTimer = setTimeout(function () {
      if (!state.pipActive || !state.stream) return;
      recordStreamToLoopingBlob(state.stream, 1600, function (blob) {
        if (blob && state.pipActive) applyLoopingBlobToPipVideo(blob);
      });
    }, 450);
  }

  function attachStreamToVideo() {
    var cap = supportsPipFromCanvas();
    if (!cap.ok) { els.btnPip.disabled = true; return; }
    try {
      clearPipRecordTimer(); revokePipBlobUrl();
      if (state.stream) state.stream.getTracks().forEach(t => t.stop());
      state.stream = els.canvas.captureStream(30);
      els.video.srcObject = state.stream;
      els.video.muted = true;
      els.btnPip.disabled = false;
      if (document.pictureInPictureElement === els.video) els.video.play().catch(() => {});
    } catch (e) { setFallback("Stream Error: " + e.message); }
  }

  function renderDetail(opts = {}) {
    if (!state.selected) { els.detailPanel.hidden = true; stopLoop(); return; }
    els.detailPanel.hidden = false;
    attachStreamToVideo();
    drawCanvas();
    if (!state.rafId) state.rafId = requestAnimationFrame(loop);
    if (!opts.skipAutoPip && state.autoPipOnSelect) openPipFromUserGesture({ silent: true });
    if (state.pipActive && document.pictureInPictureElement === els.video) schedulePipRecordedLoopSwap();
  }

  function openPipFromUserGesture(opts = {}) {
    var v = els.video;
    if (!v || !v.requestPictureInPicture) return Promise.resolve(false);
    if (document.pictureInPictureElement === v) {
      state.pipActive = true;
      v.play().catch(() => {});
      schedulePipRecordedLoopSwap();
      return Promise.resolve(true);
    }
    v.play().catch(() => {});
    return v.requestPictureInPicture()
      .then(() => { state.pipActive = true; schedulePipRecordedLoopSwap(); return true; })
      .catch(err => { if (!opts.silent) setFallback("PiP Error: " + err.message); return false; });
  }

  // --- EVENTS ---

  els.btnPip.addEventListener("click", () => openPipFromUserGesture({ silent: false }));

  if (els.video) {
    els.video.addEventListener("enterpictureinpicture", () => { state.pipActive = true; schedulePipRecordedLoopSwap(); });
    els.video.addEventListener("leavepictureinpicture", () => {
      state.pipActive = false; clearHiddenPipTimer(); clearPipRecordTimer(); revokePipBlobUrl();
      els.video.srcObject = null; els.video.src = "";
      if (state.selected) { attachStreamToVideo(); drawCanvas(); }
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (!state.pipActive) return;
    if (document.visibilityState === "hidden") { if (!state.pipUsingRecorded) startHiddenPipRefresh(); }
    else { clearHiddenPipTimer(); drawCanvas(); }
  });

  // --- BOOTSTRAP ---

  function bootFromHash() {
    var m = (window.location.hash || "").match(/^#kanji=(.+)$/);
    if (!m || !state.items.length) return;
    var found = state.items.find(x => String(x.id) === decodeURIComponent(m[1]));
    if (found) { state.selected = found; renderDetail({ skipAutoPip: true }); }
  }

  function bootFromKanjiData(arr) {
    state.items = (Array.isArray(arr) ? arr : []).map((raw, idx) => {
      var o = {
        id: String(raw.stt != null ? raw.stt : idx + 1),
        kanji: raw.kanji || "",
        meaning: raw.core_meaning || "",
        on: String(raw.on_reading || "").replace(/\|/g, "、"),
        kun: String(raw.kun_reading || "").replace(/\|/g, "、"),
        strokes: raw.stroke_count || "",
        hanviet: raw.hanviet || "",
        radicals: raw.radicals ? String(raw.radicals) : "",
        memory_tip: raw.memory_tip ? String(raw.memory_tip) : ""
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
    var kd = (typeof kanjiData !== "undefined") ? kanjiData : (window.kanjiData || null);
    if (kd) bootFromKanjiData(kd);
    else if (els.loadStatus) els.loadStatus.textContent = "Không tìm thấy kanjiData.js";
  }

  window.addEventListener("hashchange", bootFromHash);
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
  loadKanjiData();
})();
