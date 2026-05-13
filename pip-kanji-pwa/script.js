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
    autoPipDone: false
  };

  const els = {
    canvas: document.getElementById("main-canvas"),
    btnPip: document.getElementById("btn-pip"),
    video: document.getElementById("pip-video"),
  };

  const ctx = els.canvas.getContext("2d");

  // --- NORMALIZE DATA ---
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
      return raw.vocabulary.map(e => (typeof e === "string" ? { word: e, reading: "", meaning: "" } : e));
    }
    if (typeof raw.vocabulary === "string" && raw.vocabulary.trim()) return parseLegacyPipeVocab(raw.vocabulary);
    return [];
  }

  // --- DRAW ENGINE ---
  function wrapLinesToArray(text, maxW) {
    var s = String(text || "").trim();
    if (!s) return [];
    var lines = [], parts = s.split(/(\s+)/), cur = "";
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (ctx.measureText(cur + p).width <= maxW) cur += p;
      else { if (cur.trim()) lines.push(cur.trim()); cur = p; }
    }
    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }

  function drawCanvas() {
    var item = state.selected;
    if (!item || !ctx) return;

    ctx.fillStyle = "#020617"; 
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    const pad = 20;
    const colW = (CANVAS_W - pad * 3) / 2;

    // BOX KANJI
    ctx.fillStyle = "#1e293b";
    ctx.beginPath(); ctx.roundRect(pad, pad, colW, 160, 12); ctx.fill();
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 110px sans-serif";
    ctx.fillText(item.kanji || "", pad + colW / 2, pad + 70);
    ctx.font = "bold 20px system-ui"; ctx.fillStyle = "#38bdf8";
    ctx.fillText((item.hanviet || "").toUpperCase(), pad + colW / 2, pad + 135);

    // BOX INFO
    const rx = pad * 2 + colW;
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillStyle = "#7dd3fc"; ctx.font = "bold 13px system-ui";
    ctx.fillText("SỐ NÉT: " + (item.strokes || "—"), rx, pad + 5);
    ctx.fillStyle = "#94a3b8"; ctx.font = "bold 11px system-ui"; ctx.fillText("ON-YOMI:", rx, pad + 32);
    ctx.fillStyle = "#f1f5f9"; ctx.font = "500 15px system-ui";
    wrapLinesToArray(item.on, colW).slice(0,2).forEach((l,i) => ctx.fillText(l, rx, pad+48+(i*18)));
    ctx.fillStyle = "#94a3b8"; ctx.font = "bold 11px system-ui"; ctx.fillText("KUN-YOMI:", rx, pad + 95);
    ctx.fillStyle = "#f1f5f9"; ctx.font = "500 15px system-ui";
    wrapLinesToArray(item.kun, colW).slice(0,2).forEach((l,i) => ctx.fillText(l, rx, pad+111+(i*18)));

    // BOX MEANING
    const mY = 200;
    ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.roundRect(pad, mY, CANVAS_W - pad*2, 75, 10); ctx.fill();
    ctx.textAlign = "center"; ctx.fillStyle = "#ffffff"; ctx.font = "bold 24px system-ui";
    wrapLinesToArray(item.meaning, CANVAS_W-60).slice(0,2).forEach((l,i) => ctx.fillText(l, CANVAS_W/2, mY+24+(i*30)));

    // VOCAB LIST
    const vY = 295;
    ctx.textAlign = "left"; ctx.fillStyle = "#64748b"; ctx.font = "bold 12px system-ui"; ctx.fillText("VÍ DỤ TIÊU BIỂU", pad, vY);
    (item._vocabs || []).slice(0, 4).forEach((v, i) => {
      const iy = vY + 28 + (i * 44);
      ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.arc(pad + 5, iy + 8, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f1f5f9"; ctx.font = "bold 16px system-ui";
      ctx.fillText(v.word + (v.reading ? ` (${v.reading})` : ""), pad + 15, iy);
      ctx.fillStyle = "#94a3b8"; ctx.font = "14px system-ui";
      ctx.fillText(v.meaning.substring(0, 42), pad + 15, iy + 20);
    });
  }

  // --- CORE PIP LOGIC ---
  function loop() { drawCanvas(); state.rafId = requestAnimationFrame(loop); }

  async function triggerPip() {
    if (state.pipActive || state.autoPipDone) return;
    try {
      await els.video.requestPictureInPicture();
      state.pipActive = true;
      state.autoPipDone = true;
    } catch (e) {
      console.log("Chờ tương tác người dùng để bật PiP...");
    }
  }

  function initStream() {
    if (state.stream) return;
    state.stream = els.canvas.captureStream(30);
    els.video.srcObject = state.stream;
    els.video.muted = true;
    els.video.play();
    loop();
  }

  // --- BOOT ---
  function boot(arr) {
    state.items = (arr || []).map((raw, idx) => ({
      id: raw.stt || idx + 1,
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
      initStream();
      
      // CHIẾN THUẬT AUTO-CLICK:
      // 1. Thử chạy ngay (thường thất bại do browser policy)
      triggerPip();

      // 2. Lắng nghe bất kỳ tương tác nào trên toàn bộ trang
      // Ngay khi bạn click bất kỳ đâu, PiP sẽ bật mà không cần nhấn đúng nút
      const autoPipHandler = () => {
        if (!state.autoPipDone) {
          triggerPip();
          // Xóa bỏ listener sau khi đã bật thành công
          if (state.autoPipDone) {
            window.removeEventListener('click', autoPipHandler);
            window.removeEventListener('keydown', autoPipHandler);
          }
        }
      };

      window.addEventListener('click', autoPipHandler);
      window.addEventListener('keydown', autoPipHandler);
    }
  }

  // Khởi chạy
  const data = (typeof kanjiData !== "undefined") ? kanjiData : (window.kanjiData || null);
  if (data) boot(data);

  els.video.addEventListener("enterpictureinpicture", () => state.pipActive = true);
  els.video.addEventListener("leavepictureinpicture", () => state.pipActive = false);
})();
