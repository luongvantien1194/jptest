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

  // --- HELPER FUNCTIONS ---

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

  function wrapLinesToArray(text, maxW, font) {
    ctx.font = font;
    var s = String(text || "").trim();
    if (!s) return [];
    var lines = [];
    var words = s.split(" ");
    var cur = "";
    for (var i = 0; i < words.length; i++) {
      var test = cur + (cur ? " " : "") + words[i];
      if (ctx.measureText(test).width <= maxW) {
        cur = test;
      } else {
        if (cur) lines.push(cur);
        cur = words[i];
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // --- CORE DRAWING ENGINE (STYLED) ---

  function drawCanvas() {
    var item = state.selected;
    if (!item || !ctx) return;

    // 1. Phông nền Gradient tối sâu
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, "#0f172a"); // Slate 900
    grad.addColorStop(1, "#020617"); // Slate 950
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    var cx = CANVAS_W / 2;
    var pad = 24;
    var maxW = CANVAS_W - 2 * pad;
    
    // 2. VẼ KANJI CHÍNH (Tiêu điểm)
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 145px 'Hiragino Sans', 'Yu Gothic', sans-serif";
    ctx.fillText(item.kanji, cx, 95);
    ctx.restore();

    // 3. TAG HÁN VIỆT (Box bo góc nổi bật)
    var hvText = (item.hanviet || "").toUpperCase();
    ctx.font = "bold 24px system-ui, sans-serif";
    var hvW = ctx.measureText(hvText).width + 30;
    ctx.fillStyle = "#38bdf8"; // Sky 400
    ctx.beginPath();
    ctx.roundRect(cx - hvW/2, 175, hvW, 40, 8);
    ctx.fill();
    
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.fillText(hvText, cx, 195);

    // 4. NGHĨA TIẾNG VIỆT
    ctx.fillStyle = "#f8fafc";
    var fontSizeMeaning = "600 28px system-ui, sans-serif";
    var meaningLines = wrapLinesToArray(item.meaning, maxW, fontSizeMeaning);
    var yMeaning = 245;
    ctx.font = fontSizeMeaning;
    meaningLines.slice(0, 2).forEach((line, i) => {
        ctx.fillText(line, cx, yMeaning + (i * 35));
    });

    // 5. CHI TIẾT ON/KUN/NÉT (Dạng lưới nhỏ)
    var yInfo = 320;
    ctx.fillStyle = "#94a3b8"; // Slate 400
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText(`On: ${item.on || "—"}`, cx, yInfo);
    ctx.fillText(`Kun: ${item.kun || "—"}`, cx, yInfo + 25);
    ctx.fillStyle = "#0ea5e9";
    ctx.font = "bold 16px system-ui, sans-serif";
    ctx.fillText(`Số nét: ${item.strokes || "—"}`, cx, yInfo + 50);

    // 6. TỪ VỰNG (Dạng Card chọn lọc)
    var vocabs = item._vocabs || [];
    if (vocabs.length) {
      var yVocab = 405;
      // Vẽ line phân cách mờ
      ctx.strokeStyle = "rgba(51, 65, 85, 0.5)";
      ctx.beginPath(); ctx.moveTo(pad, yVocab - 20); ctx.lineTo(CANVAS_W - pad, yVocab - 20); ctx.stroke();

      // Chỉ lấy 1 từ vựng chất lượng nhất để đảm bảo chữ to rõ
      var v = vocabs[0];
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "bold 15px system-ui, sans-serif";
      ctx.fillText("VÍ DỤ TIÊU BIỂU", cx, yVocab);

      ctx.fillStyle = "#f1f5f9";
      ctx.font = "bold 24px system-ui, sans-serif";
      var vMain = v.word + (v.reading ? ` [${v.reading}]` : "");
      ctx.fillText(vMain, cx, yVocab + 35);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "italic 18px system-ui, sans-serif";
      var vMean = wrapLinesToArray(v.meaning, maxW, "18px system-ui");
      if(vMean.length) ctx.fillText(vMean[0], cx, yVocab + 65);
    }
  }

  // --- STREAMING & PIP LOGIC ---

  function loop() {
    drawCanvas();
    state.rafId = requestAnimationFrame(loop);
  }

  function attachStreamToVideo() {
    if (!els.canvas.captureStream) return;
    try {
      if (state.stream) state.stream.getTracks().forEach(t => t.stop());
      state.stream = els.canvas.captureStream(30);
      els.video.srcObject = state.stream;
      els.video.muted = true;
      els.video.play().catch(() => {});
    } catch (e) { console.error("Stream error:", e); }
  }

  async function openPipFromUserGesture() {
    if (!els.video.requestPictureInPicture) return;
    try {
      await els.video.play();
      await els.video.requestPictureInPicture();
      state.pipActive = true;
    } catch (e) { console.error("PiP error:", e); }
  }

  function renderDetail(opts = {}) {
    if (!state.selected) return;
    els.detailPanel.hidden = false;
    attachStreamToVideo();
    if (!state.rafId) loop();
    if (state.autoPipOnSelect && !opts.skipAutoPip) openPipFromUserGesture();
  }

  // --- BOOTSTRAP ---

  function bootFromKanjiData(arr) {
    state.items = (Array.isArray(arr) ? arr : []).map((raw, idx) => ({
      id: String(raw.stt || idx + 1),
      kanji: raw.kanji || "",
      meaning: raw.core_meaning || "",
      on: String(raw.on_reading || "").replace(/\|/g, "、"),
      kun: String(raw.kun_reading || "").replace(/\|/g, "、"),
      strokes: raw.stroke_count,
      hanviet: raw.hanviet || "",
      _vocabs: normalizeVocabularyList({ vocabulary: raw.vocabulary })
    }));
    if (state.items.length) {
      state.selected = state.items[0];
      renderDetail({ skipAutoPip: true });
    }
  }

  els.btnPip.addEventListener("click", openPipFromUserGesture);

  document.addEventListener("visibilitychange", () => {
    if (state.pipActive && document.visibilityState === "hidden") {
      state.hiddenPipTimer = setInterval(() => {
        drawCanvas();
        let t = state.stream?.getVideoTracks()[0];
        if (t?.requestFrame) t.requestFrame();
      }, 100);
    } else {
      clearInterval(state.hiddenPipTimer);
    }
  });

  const kd = (typeof kanjiData !== "undefined") ? kanjiData : (window.kanjiData || null);
  if (kd) bootFromKanjiData(kd);

})();
