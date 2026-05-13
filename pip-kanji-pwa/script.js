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
    hiddenPipTimer: 0,
    /** Cờ đánh dấu đã tự động kích hoạt PiP thành công */
    autoPipDone: false 
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

  // --- [GIỮ NGUYÊN] CÁC HÀM PARSE & NORMALIZE ---
  function parseLegacyPipeVocab(s) {
    var out = [];
    String(s).split("|").forEach(function (seg) {
      var t = String(seg).trim();
      if (!t) return;
      var m = t.match(/^(.+?)\(([^)]+)\)\s*:\s*(.+)$/);
      if (m) out.push({ word: m[1].trim(), reading: m[2].trim(), meaning: m[3].trim() });
      else out.push({ word: t, reading: "", meaning: "" });
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
    if (typeof raw.vocabulary === "string" && raw.vocabulary.trim()) return parseLegacyPipeVocab(raw.vocabulary);
    return [];
  }

  function supportsPipFromCanvas() {
    var c = els.canvas; var v = els.video;
    if (!c || !c.captureStream) return { ok: false, reason: "Browser không hỗ trợ captureStream." };
    if (!v || !v.requestPictureInPicture) return { ok: false, reason: "Browser không hỗ trợ PiP." };
    return { ok: true };
  }

  function setFallback(msg) {
    if (!els.fallback) return;
    els.fallback.hidden = !msg;
    els.fallback.textContent = msg || "";
  }

  // --- [GIỮ NGUYÊN] ENGINE VẼ ---
  function wrapLinesToArray(text, maxW) {
    var s = String(text || "").trim();
    if (!s) return [];
    var lines = [];
    var parts = s.split(/(\s+)/);
    var cur = "";
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i]; if (!p) continue;
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
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
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
    ctx.beginPath(); ctx.rect(0, 0, CANVAS_W, CANVAS_H); ctx.clip();
    var cx = CANVAS_W / 2; var pad = 14; var maxW = CANVAS_W - 2 * pad; var y = 54;
    ctx.textAlign = "center";
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 96px 'Hiragino Sans', sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(item.kanji || "", cx, y);
    y += 56;
    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 19px system-ui, sans-serif";
      ctx.fillText(item.hanviet, cx, y);
      y += 28;
    }
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px system-ui, sans-serif";
    var meaningLines = wrapLinesToArray(item.meaning || "", maxW);
    y = drawParagraphCenter(cx, y, maxW, 22, meaningLines) + 12;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("On: " + (item.on || "—"), cx, y); y += 24;
    ctx.fillText("Kun: " + (item.kun || "—"), cx, y); y += 24;
    ctx.fillText("Nét: " + (item.strokes != null ? item.strokes : "—"), cx, y); y += 28;
    if (item.radicals) {
      ctx.fillStyle = "#78716c"; ctx.font = "14px system-ui, sans-serif";
      var radLines = wrapLinesToArray("Bộ thủ: " + item.radicals, maxW);
      y = drawParagraphCenter(cx, y, maxW, 19, radLines) + 10;
    }
    if (item.memory_tip) {
      ctx.fillStyle = "#64748b"; ctx.font = "13px system-ui, sans-serif";
      var tipLines = wrapLinesToArray(item.memory_tip, maxW);
      y = drawParagraphCenter(cx, y, maxW, 18, tipLines) + 12;
    }
    var vocabs = item._vocabs || [];
    if (vocabs.length) {
      ctx.fillStyle = "#64748b"; ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText("Từ vựng", cx, y); y += 24;
      ctx.fillStyle = "#94a3b8"; ctx.font = "13px system-ui, sans-serif";
      vocabs.forEach(function (v) {
        var line = (v.word || "") + (v.reading ? "(" + v.reading + ")" : "") + (v.meaning ? " — " + v.meaning : "");
        y = drawParagraphCenter(cx, y, maxW, 18, wrapLinesToArray(line, maxW)) + 8;
      });
    }
    ctx.restore();
  }

  // --- [GIỮ NGUYÊN] QUẢN LÝ LUỒNG & GHI LẶP (RECORDING) ---
  function loop() { drawCanvas(); state.rafId = requestAnimationFrame(loop); }
  function stopLoop() { if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = 0; } }
  function revokePipBlobUrl() {
    if (state.pipBlobUrl) { try { URL.revokeObjectURL(state.pipBlobUrl); } catch (e) {} state.pipBlobUrl = null; }
    state.pipUsingRecorded = false;
  }
  function clearPipRecordTimer() { if (state.pipRecordTimer) { clearTimeout(state.pipRecordTimer); state.pipRecordTimer = 0; } }
  function clearHiddenPipTimer() { if (state.hiddenPipTimer) { clearInterval(state.hiddenPipTimer); state.hiddenPipTimer = 0; } }
  
  function startHiddenPipRefresh() {
    if (state.hiddenPipTimer || state.pipUsingRecorded) return;
    state.hiddenPipTimer = setInterval(function () {
      if (!state.pipActive || document.visibilityState !== "hidden") return;
      drawCanvas();
      if (state.stream) {
        var t0 = state.stream.getVideoTracks()[0];
        if (t0 && t0.requestFrame) t0.requestFrame();
      }
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
    var mime = pickMediaRecorderMime(); var rec;
    try { rec = new MediaRecorder(stream, mime ? { mimeType: mime } : {}); } catch (e) { done(null); return; }
    var chunks = [];
    rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = function () { done(chunks.length ? new Blob(chunks, { type: mime || rec.mimeType }) : null); };
    rec.start();
    setTimeout(function () { if (rec.state === "recording") rec.stop(); }, durationMs);
  }

  function applyLoopingBlobToPipVideo(blob) {
    var v = els.video; if (!blob || !v || !state.pipActive) return;
    revokePipBlobUrl();
    state.pipBlobUrl = URL.createObjectURL(blob);
    state.pipUsingRecorded = true;
    v.srcObject = null; v.src = state.pipBlobUrl; v.loop = true; v.play().catch(function(){});
    clearHiddenPipTimer();
    if (state.stream) { state.stream.getTracks().forEach(t => t.stop()); state.stream = null; }
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
    if (!cap.ok) { els.btnPip.disabled = true; setFallback(cap.reason); return; }
    try {
      clearPipRecordTimer(); revokePipBlobUrl();
      if (els.video) { els.video.removeAttribute("src"); els.video.src = ""; }
      if (state.stream) state.stream.getTracks().forEach(t => t.stop());
      state.stream = els.canvas.captureStream(30);
      els.video.srcObject = state.stream;
      els.video.muted = true;
      els.video.play().catch(function(){});
      els.btnPip.disabled = false;
    } catch (e) { setFallback("Stream Error: " + e.message); }
  }

  // --- [GIỮ NGUYÊN] RENDER & PIP LOGIC ---
  function renderDetail(opts) {
    opts = opts || {};
    if (!state.selected) { els.detailPanel.hidden = true; stopLoop(); return; }
    els.detailPanel.hidden = false;
    attachStreamToVideo();
    drawCanvas();
    if (!state.rafId) state.rafId = requestAnimationFrame(loop);
    
    if (opts.skipAutoPip !== true && state.autoPipOnSelect) {
      openPipFromUserGesture({ silent: true });
    }
    if (state.pipActive && document.pictureInPictureElement === els.video) {
      schedulePipRecordedLoopSwap();
    }
  }

  function openPipFromUserGesture(opts) {
    opts = opts || {};
    var v = els.video;
    if (!v || !v.requestPictureInPicture) return Promise.resolve(false);

    if (document.pictureInPictureElement === v) {
      state.pipActive = true;
      v.play().catch(function(){});
      schedulePipRecordedLoopSwap();
      return Promise.resolve(true);
    }

    // Thực hiện đồng bộ để tránh mất User Activation
    try { v.play().catch(function(){}); } catch(e) {}
    
    return v.requestPictureInPicture()
      .then(function () {
        state.pipActive = true;
        state.autoPipDone = true; // Đánh dấu đã bật thành công
        schedulePipRecordedLoopSwap();
        // Xóa các listener kích hoạt ngầm
        window.removeEventListener("click", autoPipTrigger);
        window.removeEventListener("touchstart", autoPipTrigger);
        return true;
      })
      .catch(function (err) {
        if (!opts.silent) setFallback("PiP Error: " + err.message);
        return false;
      });
  }

  // --- [MỚI] LOGIC TỰ ĐỐI ỨNG KÍCH HOẠT ---
  function autoPipTrigger() {
    if (!state.autoPipDone && state.selected) {
      openPipFromUserGesture({ silent: true });
    }
  }

  els.btnPip.addEventListener("click", function () {
    openPipFromUserGesture({ silent: false });
  });

  // Đăng ký sự kiện toàn cục: User click bất kỳ đâu -> PiP tự bật
  window.addEventListener("click", autoPipTrigger, { once: false });
  window.addEventListener("touchstart", autoPipTrigger, { once: false });

  if (els.video) {
    els.video.addEventListener("enterpictureinpicture", function () {
      state.pipActive = true; schedulePipRecordedLoopSwap();
    });
    els.video.addEventListener("leavepictureinpicture", function () {
      state.pipActive = false; clearHiddenPipTimer(); clearPipRecordTimer(); revokePipBlobUrl();
      if (state.selected) { attachStreamToVideo(); drawCanvas(); }
    });
  }

  document.addEventListener("visibilitychange", function () {
    if (!state.pipActive) return;
    if (document.visibilityState === "hidden") {
      if (!state.pipUsingRecorded) startHiddenPipRefresh();
    } else {
      clearHiddenPipTimer(); drawCanvas();
    }
  });

  // --- [GIỮ NGUYÊN] KHỞI CHẠY (BOOT) ---
  function bootFromHash() {
    var m = (window.location.hash || "").match(/^#kanji=(.+)$/);
    if (!m || !state.items.length) return;
    var found = state.items.find(x => String(x.id) === decodeURIComponent(m[1]));
    if (found) { state.selected = found; renderDetail({ skipAutoPip: true }); }
  }

  function bootFromKanjiData(arr) {
    state.items = (arr || []).map(function (raw, idx) {
      var o = {
        id: String(raw.stt != null ? raw.stt : idx + 1),
        kanji: raw.kanji || "",
        meaning: raw.core_meaning || "",
        on: String(raw.on_reading || "").replace(/\|/g, "、"),
        kun: String(raw.kun_reading || "").replace(/\|/g, "、"),
        strokes: raw.stroke_count,
        hanviet: raw.hanviet || "",
        radicals: raw.radicals,
        memory_tip: raw.memory_tip,
        _vocabs: normalizeVocabularyList({ vocabulary: raw.vocabulary })
      };
      return o;
    });
    bootFromHash();
    if (!state.selected && state.items.length) {
      state.selected = state.items[0];
      renderDetail({ skipAutoPip: true });
      history.replaceState(null, "", "#kanji=" + encodeURIComponent(state.selected.id));
    }
  }

  function loadKanjiData() {
    var kd = (typeof kanjiData !== "undefined") ? kanjiData : window.kanjiData;
    if (kd) bootFromKanjiData(kd);
    else if (els.loadStatus) els.loadStatus.textContent = "Không tìm thấy dữ liệu.";
  }

  window.addEventListener("hashchange", bootFromHash);
  loadKanjiData();
})();
