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
    audioContext: null // Lưu trữ để tái sử dụng
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

  // --- HÀM TẠO ÂM THANH IM LẶNG ---
  function createSilentAudioTrack() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!state.audioContext) {
        state.audioContext = new AudioContext();
      }
      const oscillator = state.audioContext.createOscillator();
      const dst = state.audioContext.createMediaStreamDestination();
      oscillator.connect(dst);
      oscillator.start();
      // Trả về track âm thanh im lặng
      return dst.stream.getAudioTracks()[0];
    } catch (e) {
      console.warn("Không thể tạo audio im lặng:", e);
      return null;
    }
  }

  function parseLegacyPipeVocab(s) {
    var out = [];
    String(s)
      .split("|")
      .forEach(function (seg) {
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
    var c = els.canvas;
    var v = els.video;
    if (!c || !c.captureStream) return { ok: false, reason: "Trình duyệt không hỗ trợ canvas.captureStream()." };
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

  function drawCanvas() {
    var item = state.selected;
    if (!item || !ctx) return;

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
    ctx.font = "bold 96px 'Hiragino Sans', 'Yu Gothic', 'PingFang SC', sans-serif";
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
    ctx.fillText("On: " + (item.on || "—"), cx, y); y += 24;
    ctx.fillText("Kun: " + (item.kun || "—"), cx, y); y += 24;
    ctx.fillText("Nét: " + (item.strokes != null ? item.strokes : "—"), cx, y); y += 28;

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
      ctx.fillText("Từ vựng", cx, y); y += 24;
      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px system-ui, sans-serif";
      vocabs.forEach(function (v) {
        var line = (v.word || "") + (v.reading ? "(" + v.reading + ")" : "") + (v.meaning ? " — " + v.meaning : "");
        var vl = wrapLinesToArray(line, maxW);
        y = drawParagraphCenter(cx, y, maxW, 18, vl) + 8;
      });
    }
    ctx.restore();
  }

  // Sử dụng setInterval thay cho requestAnimationFrame để duy trì tốt hơn trên iOS
  function startLoop() {
    stopLoop();
    state.rafId = setInterval(drawCanvas, 200); // 5 FPS là đủ cho text tĩnh, tiết kiệm pin
  }

  function stopLoop() {
    if (state.rafId) {
      clearInterval(state.rafId);
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
        state.stream.getTracks().forEach(t => t.stop());
      }
      
      // 1. Lấy luồng hình ảnh từ Canvas
      state.stream = els.canvas.captureStream(10); 

      // 2. TẠO VÀ CHÈN TRACK ÂM THANH IM LẶNG
      const silentTrack = createSilentAudioTrack();
      if (silentTrack) {
        state.stream.addTrack(silentTrack);
      }

      els.video.srcObject = state.stream;
      els.video.muted = false; // Tắt mute để iOS không coi là video rác
      els.video.volume = 0;    // Nhưng để volume = 0 để không có tiếng rè
      
      els.video.setAttribute("playsinline", "");
      els.video.setAttribute("webkit-playsinline", "");
      els.btnPip.disabled = false;
      setFallback("");
    } catch (e) {
      els.btnPip.disabled = true;
      setFallback("Lỗi stream: " + e.message);
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
    startLoop();

    if (opts.skipAutoPip !== true && state.autoPipOnSelect && supportsPipFromCanvas().ok) {
      openPipFromUserGesture({ silent: true });
    }
  }

  function openPipFromUserGesture(opts) {
    opts = opts || {};
    var v = els.video;
    if (!v || !v.requestPictureInPicture) return Promise.resolve(false);

    // Kích hoạt AudioContext nếu bị trình duyệt chặn
    if (state.audioContext && state.audioContext.state === 'suspended') {
      state.audioContext.resume();
    }

    try {
      v.play().catch(() => {});
      return v.requestPictureInPicture()
        .then(() => {
          state.pipActive = true;
          return true;
        })
        .catch(err => {
          if (!opts.silent) setFallback("PiP Error: " + err.message);
          return false;
        });
    } catch (err) {
      return Promise.resolve(false);
    }
  }

  els.btnPip.addEventListener("click", function () {
    openPipFromUserGesture({ silent: false });
  });

  if (els.video) {
    els.video.addEventListener("leavepictureinpicture", function () {
      state.pipActive = false;
    });
  }

  function bootFromHash() {
    var m = (window.location.hash || "").match(/^#kanji=(.+)$/);
    if (!m || !state.items.length) return;
    try {
      var id = decodeURIComponent(m[1]);
      var found = state.items.find(x => String(x.id) === String(id));
      if (found) {
        state.selected = found;
        renderDetail({ skipAutoPip: true });
      }
    } catch (e) {}
  }

  function bootFromKanjiData(arr) {
    state.items = (Array.isArray(arr) ? arr : []).map(function (raw, idx) {
      var o = {
        id: String(raw.stt != null ? raw.stt : idx + 1),
        kanji: raw.kanji || "",
        meaning: raw.core_meaning || "",
        on: String(raw.on_reading || "").replace(/\|/g, "、"),
        kun: String(raw.kun_reading || "").replace(/\|/g, "、"),
        strokes: raw.stroke_count || "",
        hanviet: raw.hanviet || "",
        radicals: String(raw.radicals || ""),
        memory_tip: String(raw.memory_tip || ""),
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
    var kd = (typeof kanjiData !== "undefined" && kanjiData) || (window.kanjiData);
    if (kd) bootFromKanjiData(kd);
    else if (els.loadStatus) els.loadStatus.textContent = "Không tìm thấy dữ liệu.";
  }

  window.addEventListener("hashchange", bootFromHash);
  loadKanjiData();
})();
