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

  // --- [GIỮ NGUYÊN] PARSE & NORMALIZE ---
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

  // --- [CẤU TRÚC LẠI VÀ TĂNG SIZE CHỮ] ---
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
    
    // Background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    
    ctx.save();
    var cx = CANVAS_W / 2; var pad = 20; var maxW = CANVAS_W - 2 * pad;
    var y = 65;

    // 1. KANJI (Giữ kích thước lớn nhất)
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 105px 'Hiragino Sans', sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(item.kanji || "", cx, y);
    y += 70;

    // 2. HÁN VIỆT (Tăng size + Đổi vị trí lên trên)
    if (item.hanviet) {
      ctx.fillStyle = "#38bdf8"; // Sky blue sáng
      ctx.font = "bold 32px system-ui, sans-serif";
      ctx.fillText(item.hanviet.toUpperCase(), cx, y);
      y += 45;
    }

    // 3. NGHĨA CHÍNH (Tăng size + Màu nổi bật)
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "600 26px system-ui, sans-serif";
    var meaningLines = wrapLinesToArray(item.meaning || "", maxW);
    y = drawParagraphCenter(cx, y, maxW, 32, meaningLines) + 25;

    // Kẻ vạch ngang phân cách nhẹ
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(CANVAS_W - pad, y); ctx.stroke();
    y += 30;

    // 4. ON/KUN/NÉT (Nhóm lại và tăng size)
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "20px system-ui, sans-serif";
    ctx.textAlign = "left";
    var labelX = pad + 10;
    
    ctx.fillText("On: " + (item.on || "—"), labelX, y); y += 28;
    ctx.fillText("Kun: " + (item.kun || "—"), labelX, y); y += 28;
    ctx.fillText("Nét: " + (item.strokes != null ? item.strokes : "—"), labelX, y); y += 35;

    // 5. TỪ VỰNG (Nếu còn chỗ)
    var vocabs = item._vocabs || [];
    if (vocabs.length) {
      ctx.fillStyle = "#475569";
      ctx.font = "bold 18px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("VÍ DỤ TỪ VỰNG", cx, y); y += 28;
      
      ctx.fillStyle = "#94a3b8";
      ctx.font = "18px system-ui, sans-serif";
      vocabs.slice(0, 2).forEach(function (v) { // Lấy 2 từ tiêu biểu để tránh tràn
        var line = (v.word || "") + (v.reading ? " (" + v.reading + ")" : "");
        y = drawParagraphCenter(cx, y, maxW, 24, wrapLinesToArray(line, maxW)) + 5;
        if (v.meaning) {
          ctx.font = "italic 16px system-ui, sans-serif";
          y = drawParagraphCenter(cx, y, maxW, 20, wrapLinesToArray(v.meaning, maxW)) + 10;
          ctx.font = "18px system-ui, sans-serif";
        }
      });
    }

    ctx.restore();
  }

  // --- [GIỮ NGUYÊN LOGIC PIP & VIDEO] ---
  function loop() { drawCanvas(); state.rafId = requestAnimationFrame(loop); }
  function stopLoop() { if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = 0; } }
  
  function attachStreamToVideo() {
    if (!els.canvas.captureStream) return;
    try {
      if (state.stream) state.stream.getTracks().forEach(t => t.stop());
      state.stream = els.canvas.captureStream(30);
      els.video.srcObject = state.stream;
      els.video.muted = true;
      els.video.play().catch(function(){});
    } catch (e) {}
  }

  function renderDetail() {
    if (!state.selected) return;
    attachStreamToVideo();
    drawCanvas();
    if (!state.rafId) state.rafId = requestAnimationFrame(loop);
  }

  function openPipFromUserGesture() {
    var v = els.video;
    if (!v || !v.requestPictureInPicture) return;
    v.play().then(() => v.requestPictureInPicture()).then(() => {
      state.pipActive = true;
      state.autoPipDone = true;
    }).catch(() => {});
  }

  function autoPipTrigger() {
    if (!state.autoPipDone && state.selected) openPipFromUserGesture();
  }

  window.addEventListener("click", autoPipTrigger);
  window.addEventListener("touchstart", autoPipTrigger);

  // Giả lập boot dữ liệu
  window.addEventListener("load", function() {
    var kd = window.kanjiData;
    if (kd && kd.length) {
      state.items = kd.map((raw, idx) => ({
        id: idx,
        kanji: raw.kanji,
        meaning: raw.core_meaning,
        on: String(raw.on_reading || "").replace(/\|/g, "、"),
        kun: String(raw.kun_reading || "").replace(/\|/g, "、"),
        strokes: raw.stroke_count,
        hanviet: raw.hanviet || "",
        _vocabs: normalizeVocabularyList({ vocabulary: raw.vocabulary })
      }));
      state.selected = state.items[0];
      renderDetail();
    }
  });

})();
