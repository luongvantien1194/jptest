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
    pipHeartbeat: null 
  };

  const els = {
    loadStatus: document.getElementById("load-status"),
    detailPanel: document.getElementById("detail-panel"),
    canvas: document.getElementById("main-canvas"),
    btnPip: document.getElementById("btn-pip"),
    video: document.getElementById("pip-video"),
  };

  const ctx = els.canvas.getContext("2d");

  // --- GIẢI PHÁP FIX LỖI TRIỆT ĐỂ CHO SAFARI ---

  function updateMediaSession() {
    // Chỉ chạy nếu navigator.mediaSession tồn tại
    if (!navigator.mediaSession) return;

    try {
      // Tạo object dữ liệu thuần, không dùng class MediaSessionMetadata
      const data = {
        title: "Học Kanji: " + (state.selected ? state.selected.kanji : ""),
        artist: (state.selected ? state.selected.hanviet : "") || "Kanji PiP",
        album: "Tự học Tiếng Nhật",
        artwork: [
          { 
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="%230f172a"/><text x="50%" y="50%" font-size="250" fill="white" text-anchor="middle" dominant-baseline="central">' + (state.selected ? state.selected.kanji : "") + '</text></svg>', 
            sizes: '512x512', 
            type: 'image/svg+xml' 
          }
        ]
      };

      /**
       * GIẢI PHÁP: Không dùng class, không dùng window.
       * Thử gán trực tiếp, nếu trình duyệt yêu cầu constructor, 
       * nó sẽ tự mapping object này vào metadata.
       */
      navigator.mediaSession.metadata = data;
      navigator.mediaSession.playbackState = 'playing';

    } catch (e) {
      // Nếu vẫn lỗi, ta bỏ qua hoàn toàn phần Metadata để app không bị crash
      console.log("MediaSession Metadata skipped to prevent crash");
    }
  }

  /** Track âm thanh im lặng giúp PiP không bị iOS "kill" khi khóa máy */
  function createSilentAudioTrack() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const dst = audioCtx.createMediaStreamDestination();
      oscillator.connect(dst);
      oscillator.start();
      return dst.stream.getAudioTracks()[0];
    } catch (e) {
      return null;
    }
  }

  // Giữ Canvas sống khi tab bị ẩn
  document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
      if (!state.pipHeartbeat) {
        state.pipHeartbeat = setInterval(() => drawCanvas(), 1000); 
      }
    } else {
      if (state.pipHeartbeat) {
        clearInterval(state.pipHeartbeat);
        state.pipHeartbeat = null;
      }
    }
  });

  // --- LOGIC VẼ (GIỮ NGUYÊN) ---

  function normalizeVocabularyList(raw) {
    if (Array.isArray(raw.vocabulary)) {
      return raw.vocabulary.map(e => {
        if (typeof e === "string") return { word: e, reading: "", meaning: "" };
        return {
          word: e.word != null ? String(e.word) : "",
          reading: e.reading != null ? String(e.reading) : "",
          meaning: e.meaning != null ? String(e.meaning) : ""
        };
      });
    }
    return [];
  }

  function wrapLinesToArray(text, maxW) {
    let s = String(text || "").trim();
    if (!s) return [];
    let lines = [];
    let parts = s.split(/(\s+)/);
    let cur = "";
    for (let p of parts) {
      if (!p) continue;
      let test = cur + p;
      if (ctx.measureText(test).width <= maxW) {
        cur = test;
      } else {
        if (cur.trim()) lines.push(cur.trim());
        cur = p;
      }
    }
    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }

  function drawParagraphCenter(cx, y, maxW, lineHeight, lines) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let line of lines) {
      ctx.fillText(line, cx, y + lineHeight / 2);
      y += lineHeight;
    }
    return y;
  }

  function drawCanvas() {
    const item = state.selected;
    if (!item || !ctx) return;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    
    const cx = CANVAS_W / 2;
    const maxW = CANVAS_W - 30;
    let y = 60;

    ctx.textAlign = "center";
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 100px 'Hiragino Sans', 'Yu Gothic', sans-serif";
    ctx.fillText(item.kanji || "", cx, y);
    y += 65;

    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 22px system-ui, sans-serif";
      ctx.fillText(item.hanviet, cx, y);
      y += 35;
    }

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "20px system-ui, sans-serif";
    const meaningLines = wrapLinesToArray(item.meaning || "", maxW);
    y = drawParagraphCenter(cx, y, maxW, 26, meaningLines) + 20;

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("On: " + (item.on || "—"), cx, y); y += 25;
    ctx.fillText("Kun: " + (item.kun || "—"), cx, y); y += 25;
    ctx.fillText("Nét: " + (item.strokes || "—"), cx, y); y += 35;

    const vocabs = item._vocabs || [];
    if (vocabs.length) {
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 15px system-ui, sans-serif";
      ctx.fillText("Ví dụ", cx, y); y += 25;
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px system-ui, sans-serif";
      vocabs.slice(0, 3).forEach(v => {
        let text = `${v.word} (${v.reading}): ${v.meaning}`;
        y = drawParagraphCenter(cx, y, maxW, 20, wrapLinesToArray(text, maxW)) + 10;
      });
    }
  }

  function loop() {
    if (!document.hidden) drawCanvas();
    state.rafId = requestAnimationFrame(loop);
  }

  // --- PIP CONTROL ---

  function setupStream() {
    if (!els.canvas.captureStream) return;
    try {
      if (state.stream) state.stream.getTracks().forEach(t => t.stop());
      
      const canvasStream = els.canvas.captureStream(10);
      const silentAudio = createSilentAudioTrack();
      if (silentAudio) canvasStream.addTrack(silentAudio);

      state.stream = canvasStream;
      els.video.srcObject = state.stream;
    } catch (e) {
      console.error("Stream setup error:", e);
    }
  }

  async function openPip() {
    if (!els.video.requestPictureInPicture) return;
    try {
      // Phải play video trước khi yêu cầu PiP
      await els.video.play();
      await els.video.requestPictureInPicture();
      state.pipActive = true;
      
      // Chạy updateMediaSession ngay sau khi PiP kích hoạt thành công
      updateMediaSession();
    } catch (err) {
      console.error("PiP Error:", err);
    }
  }

  els.btnPip.addEventListener("click", openPip);

  // --- INIT ---

  function init(arr) {
    state.items = (arr || []).map((raw, idx) => ({
      id: String(raw.stt || idx + 1),
      kanji: raw.kanji || "",
      meaning: raw.core_meaning || "",
      on: String(raw.on_reading || "").replace(/\|/g, "、"),
      kun: String(raw.kun_reading || "").replace(/\|/g, "、"),
      strokes: raw.stroke_count || "",
      hanviet: raw.hanviet || "",
      _vocabs: normalizeVocabularyList({ vocabulary: raw.vocabulary })
    }));
    
    const m = (window.location.hash || "").match(/^#kanji=(.+)$/);
    state.selected = m ? state.items.find(x => x.id === decodeURIComponent(m[1])) : state.items[0];

    if (state.selected) {
      els.detailPanel.hidden = false;
      setupStream();
      drawCanvas();
      loop();
    }
  }

  if (typeof kanjiData !== "undefined") {
    init(kanjiData);
  }

})();
