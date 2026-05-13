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

  // --- GIỮ NGUYÊN CÁC HÀM LOGIC DỮ LIỆU ---

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

  function supportsPipFromCanvas() {
    var c = els.canvas; var v = els.video;
    if (!c || !c.captureStream) return { ok: false, reason: "Trình duyệt không hỗ trợ captureStream." };
    if (!v || !v.requestPictureInPicture) return { ok: false, reason: "Trình duyệt không hỗ trợ PiP." };
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

  // --- CẤU TRÚC LẠI GIAO DIỆN VÀ CSS TRÊN CANVAS ---

  function drawCanvas() {
    var item = state.selected;
    if (!item || !ctx) return;

    // 1. Nền Gradient chiều sâu
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, "#0f172a"); // Slate 900
    grad.addColorStop(1, "#020617"); // Black
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.save();

    var cx = CANVAS_W / 2;
    var pad = 24;
    var maxW = CANVAS_W - 2 * pad;
    
    // 2. VẼ KANJI CHÍNH (Cực đại hóa)
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 145px 'Hiragino Sans', 'Yu Gothic', sans-serif";
    // Đổ bóng nhẹ cho chữ nổi khối
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fillText(item.kanji || "", cx, 100);
    ctx.shadowBlur = 0; // Tắt bóng cho các thành phần khác

    // 3. TAG HÁN VIỆT (Nổi bật trong box)
    var hv = (item.hanviet || "").toUpperCase();
    ctx.font = "bold 24px system-ui, sans-serif";
    var hvW = ctx.measureText(hv).width + 30;
    ctx.fillStyle = "#38bdf8"; // Sky Blue
    ctx.beginPath();
    ctx.roundRect(cx - hvW/2, 175, hvW, 42, 8);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.fillText(hv, cx, 198);

    // 4. NGHĨA CHÍNH (Chữ to, dễ đọc)
    ctx.fillStyle = "#f8fafc";
    ctx.font = "600 28px system-ui, sans-serif";
    var meaningLines = wrapLinesToArray(item.meaning || "", maxW);
    var yAfterMeaning = drawParagraphCenter(cx, 240, maxW, 34, meaningLines.slice(0, 2)) + 15;

    // 5. THÔNG TIN PHỤ (Gọn gàng)
    ctx.fillStyle = "#94a3b8"; // Slate 400
    ctx.font = "16px system-ui, sans-serif";
    var info = "On: " + (item.on || "—") + "  •  Kun: " + (item.kun || "—");
    ctx.fillText(info, cx, yAfterMeaning + 10);
    ctx.fillStyle = "#7dd3fc";
    ctx.fillText("Số nét: " + (item.strokes || "—"), cx, yAfterMeaning + 35);

    // 6. VÍ DỤ TIÊU BIỂU (Dạng Card)
    var vocabs = item._vocabs || [];
    if (vocabs.length) {
      var yVocab = 410;
      // Đường kẻ phân cách mờ
      ctx.strokeStyle = "rgba(51, 65, 85, 0.5)";
      ctx.beginPath(); ctx.moveTo(pad, yVocab - 20); ctx.lineTo(CANVAS_W - pad, yVocab - 20); ctx.stroke();

      var v = vocabs[0]; // Chỉ lấy 1 ví dụ chất lượng nhất để đảm bảo chữ to rõ
      ctx.fillStyle = "#f1f5f9";
      ctx.font = "bold 22px system-ui, sans-serif";
      var vText = v.word + (v.reading ? " [" + v.reading + "]" : "");
      ctx.fillText(vText, cx, yVocab + 10);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "italic 16px system-ui, sans-serif";
      var vMean = wrapLinesToArray(v.meaning, maxW);
      if(vMean.length) ctx.fillText(vMean[0], cx, yVocab + 38);
    }

    ctx.restore();
  }

  // --- GIỮ NGUYÊN TOÀN BỘ LOGIC ĐIỀU KHIỂN PIP VÀ STREAM CỦA FILE GỐC ---

  function loop() {
    drawCanvas();
    state.rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = 0; }
  }

  function revokePipBlobUrl() {
    if (state.pipBlobUrl) { try { URL.revokeObjectURL(state.pipBlobUrl); } catch (e) {} state.pipBlobUrl = null; }
    state.pipUsingRecorded = false;
  }

  function clearPipRecordTimer() {
    if (state.pipRecordTimer) { clearTimeout(state.pipRecordTimer); state.pipRecordTimer = 0; }
  }

  function clearHiddenPipTimer() {
    if (state.hiddenPipTimer) { clearInterval(state.hiddenPipTimer); state.hiddenPipTimer = 0; }
  }

  function refreshPipFrameFromCanvas() {
    drawCanvas();
    if (!state.stream) return;
    var tracks = state.stream.getVideoTracks();
    var t0 = tracks[0];
    if (t0 && typeof t0.requestFrame === "function") {
      try { t0.requestFrame(); } catch (e) {}
    }
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
    for (var i = 0; i < types.length; i++) {
      if (MediaRecorder.isTypeSupported(types[i])) return types[i];
    }
    return "";
  }

  function recordStreamToLoopingBlob(stream, durationMs, done) {
    if (!stream || typeof MediaRecorder === "undefined") { done(null); return; }
    var mime = pickMediaRecorderMime();
    var rec;
    try {
      rec = mime ? new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 2500000 }) : new MediaRecorder(stream);
    } catch (e1) {
      try { rec = new MediaRecorder(stream); } catch (e2) { done(null); return; }
    }
    var chunks = [];
    var outMime = mime || rec.mimeType || "video/mp4";
    var finished = false;
    function finishOnce(blob) { if (finished) return; finished = true; done(blob); }
    rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = function () { var blob = chunks.length ? new Blob(chunks, { type: outMime }) : null; finishOnce(blob); };
    try { rec.start(200); } catch (e) { finishOnce(null); return; }
    setTimeout(function () { if (rec.state === "recording") try { rec.stop(); } catch (e) {} }, durationMs);
    setTimeout(function () { if (!finished) finishOnce(null); }, durationMs + 2200);
  }

  function applyLoopingBlobToPipVideo(blob) {
    var v = els.video;
    if (!blob || !v) return;
    if (document.pictureInPictureElement !== v || !state.pipActive) return;
    revokePipBlobUrl();
    state.pipBlobUrl = URL.createObjectURL(blob);
    state.pipUsingRecorded = true;
    try { v.srcObject = null; } catch (e) {}
    v.src = state.pipBlobUrl;
    v.loop = true;
    v.muted = true;
    v.play().catch(function () {});
    clearHiddenPipTimer();
    if (state.stream) {
      state.stream.getTracks().forEach(function (t) { t.stop(); });
      state.stream = null;
    }
  }

  function schedulePipRecordedLoopSwap() {
    clearPipRecordTimer();
    if (state.pipUsingRecorded || typeof MediaRecorder === "undefined") return;
    state.pipRecordTimer = setTimeout(function () {
      state.pipRecordTimer = 0;
      if (!state.pipActive || document.pictureInPictureElement !== els.video || !state.stream) return;
      recordStreamToLoopingBlob(state.stream, 1600, function (blob) {
        if (blob && blob.size && state.pipActive && document.pictureInPictureElement === els.video) {
          applyLoopingBlobToPipVideo(blob);
        }
      });
    }, 450);
  }

  function attachStreamToVideo() {
    var cap = supportsPipFromCanvas();
    if (!cap.ok) { els.btnPip.disabled = true; return; }
    try {
      clearPipRecordTimer();
      revokePipBlobUrl();
      if (els.video) { els.video.removeAttribute("src"); els.video.src = ""; }
      if (state.stream) { state.stream.getTracks().forEach(function (t) { t.stop(); }); }
      state.stream = els.canvas.captureStream(30);
      els.video.srcObject = state.stream;
      els.video.muted = true;
      els.video.setAttribute("playsinline", "");
      els.btnPip.disabled = false;
      setFallback("");
      if (document.pictureInPictureElement === els.video) { els.video.play().catch(function () {}); }
    } catch (e) { els.btnPip.disabled = true; }
  }

  function renderDetail(opts) {
    opts = opts || {};
    var item = state.selected;
    if (!item) { els.detailPanel.hidden = true; stopLoop(); return; }
    els.detailPanel.hidden = false;
    attachStreamToVideo();
    drawCanvas();
    if (!state.rafId) { state.rafId = requestAnimationFrame(loop); }
    if (opts.skipAutoPip !== true && state.autoPipOnSelect && supportsPipFromCanvas().ok) {
      openPipFromUserGesture({ silent: true });
    }
    if (state.pipActive && els.video && document.pictureInPictureElement === els.video) {
      schedulePipRecordedLoopSwap();
    }
  }

  function openPipFromUserGesture(opts) {
    opts = opts || {};
    var v = els.video;
    if (!v || !v.requestPictureInPicture) return Promise.resolve(false);
    
    if (document.pictureInPictureElement === v) {
      state.pipActive = true;
      v.play().catch(function () {});
      schedulePipRecordedLoopSwap();
      return Promise.resolve(true);
    }

    try { v.play().catch(function () {}); } catch (e) {}

    return v.requestPictureInPicture()
      .then(function () {
        state.pipActive = true;
        setFallback("");
        schedulePipRecordedLoopSwap();
        return true;
      })
      .catch(function (err) {
        if (!opts.silent) setFallback("Lỗi PiP: " + err.message);
        return false;
      });
  }

  els.btnPip.addEventListener("click", function () { openPipFromUserGesture({ silent: false }); });

  if (els.video) {
    els.video.addEventListener("enterpictureinpicture", function () {
      state.pipActive = true;
      schedulePipRecordedLoopSwap();
    });
    els.video.addEventListener("leavepictureinpicture", function () {
      state.pipActive = false;
      clearHiddenPipTimer(); clearPipRecordTimer(); revokePipBlobUrl();
      if (state.selected) { attachStreamToVideo(); drawCanvas(); }
    });
  }

  document.addEventListener("visibilitychange", function () {
    if (state.pipActive && document.visibilityState === "hidden") {
      if (!state.pipUsingRecorded) startHiddenPipRefresh();
    } else if (state.pipActive) {
      clearHiddenPipTimer(); drawCanvas();
    }
  });

  function bootFromHash() {
    var m = (window.location.hash || "").match(/^#kanji=(.+)$/);
    if (!m || !state.items.length) return;
    try {
      var id = decodeURIComponent(m[1]);
      var found = state.items.find(function (x) { return String(x.id) === String(id); });
      if (found) { state.selected = found; renderDetail({ skipAutoPip: true }); }
    } catch (e) {}
  }

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
    bootFromHash();
    if (!state.selected && state.items.length) {
      state.selected = state.items[0];
      renderDetail({ skipAutoPip: true });
    }
  }

  function loadKanjiData() {
    var kd = (typeof kanjiData !== "undefined" && kanjiData.length) ? kanjiData : (window.kanjiData || null);
    if (kd) bootFromKanjiData(kd);
  }

  window.addEventListener("hashchange", bootFromHash);
  loadKanjiData();
})();
