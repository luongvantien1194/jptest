(function () {
  "use strict";

  // Cấu hình kích thước Canvas (tỉ lệ phù hợp cho cửa sổ PiP)
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

  // --- PHẦN FIX LỖI MEDIASESSION & CHẠY NỀN ---

  /** 
   * Cập nhật MediaSession an toàn 
   * FIX: "Can't find variable: MediaSessionMetadata"
   */
  function updateMediaSession() {
    if ('mediaSession' in navigator && state.selected) {
      try {
        const metadataConfig = {
          title: "Học Kanji: " + state.selected.kanji,
          artist: state.selected.hanviet || "Kanji PiP",
          album: "Tự học Tiếng Nhật",
          artwork: [
            { 
              src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="%230f172a"/><text x="50%" y="50%" font-size="250" fill="white" text-anchor="middle" dominant-baseline="central">' + state.selected.kanji + '</text></svg>', 
              sizes: '512x512', 
              type: 'image/svg+xml' 
            }
          ]
        };

        // KIỂM TRA BIẾN TOÀN CỤC TRƯỚC KHI KHỞI TẠO
        if (window.MediaSessionMetadata) {
          navigator.mediaSession.metadata = new MediaSessionMetadata(metadataConfig);
        } else {
          // Nếu Safari không expose class này, gán Object thuần (Safari vẫn nhận diện được)
          navigator.mediaSession.metadata = metadataConfig;
        }
        
        navigator.mediaSession.playbackState = 'playing';
      } catch (e) {
        console.warn("MediaSession update failed:", e);
      }
    }
  }

  /** Tạo track âm thanh im lặng để duy trì PiP khi khóa màn hình (Dành riêng cho iOS) */
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

  // Heartbeat: requestAnimationFrame sẽ dừng khi ẩn tab, nên dùng setInterval để giữ Canvas sống
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

  // --- LOGIC XỬ LÝ DỮ LIỆU & VẼ ---

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

    // Background Dark
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    
    const cx = CANVAS_W / 2;
    const maxW = CANVAS_W - 30;
    let y = 60;

    // Vẽ Kanji chính
    ctx.textAlign = "center";
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 100px 'Hiragino Sans', 'Yu Gothic', sans-serif";
    ctx.fillText(item.kanji || "", cx, y);
    y += 65;

    // Hán Việt
    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 22px system-ui, sans-serif";
      ctx.fillText(item.hanviet, cx, y);
      y += 35;
    }

    // Nghĩa chính
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "20px system-ui, sans-serif";
    const meaningLines = wrapLinesToArray(item.meaning || "", maxW);
    y = drawParagraphCenter(cx, y, maxW, 26, meaningLines) + 20;

    // Chi tiết On/Kun/Nét
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("On: " + (item.on || "—"), cx, y); y += 25;
    ctx.fillText("Kun: " + (item.kun || "—"), cx, y); y += 25;
    ctx.fillText("Nét: " + (item.strokes || "—"), cx, y); y += 35;

    // Từ vựng ví dụ
    const vocabs = item._vocabs || [];
    if (vocabs.length) {
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 15px system-ui, sans-serif";
      ctx.fillText("Từ vựng phổ biến", cx, y); y += 25;
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

  // --- ĐIỀU KHIỂN PIP ---

  function setupStream() {
    if (!els.canvas.captureStream) return;
    try {
      if (state.stream) state.stream.getTracks().forEach(t => t.stop());
      
      const canvasStream = els.canvas.captureStream(15); // 15 FPS là đủ để học
      const silentAudio = createSilentAudioTrack();
      if (silentAudio) canvasStream.addTrack(silentAudio);

      state.stream = canvasStream;
      els.video.srcObject = state.stream;
    } catch (e) {
      console.error("Stream setup error:", e);
    }
  }

  async function openPip() {
    if (!els.video.requestPictureInPicture) {
        alert("Trình duyệt của bạn không hỗ trợ Picture-in-Picture.");
        return;
    }
    try {
      await els.video.play();
      await els.video.requestPictureInPicture();
      state.pipActive = true;
      updateMediaSession();
    } catch (err) {
      console.error("PiP Error:", err);
    }
  }

  els.btnPip.addEventListener("click", openPip);

  // --- KHỞI CHẠY ---

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
    
    // Check hash để hiển thị Kanji cụ thể
    const m = (window.location.hash || "").match(/^#kanji=(.+)$/);
    state.selected = m ? state.items.find(x => x.id === decodeURIComponent(m[1])) : state.items[0];

    if (state.selected) {
      els.detailPanel.hidden = false;
      setupStream();
      drawCanvas();
      loop();
    }
  }

  // Đợi dữ liệu từ file data.js
  if (typeof kanjiData !== "undefined") {
    init(kanjiData);
  } else {
    setTimeout(() => {
        if (typeof kanjiData !== "undefined") init(kanjiData);
        else if (els.loadStatus) els.loadStatus.textContent = "Lỗi: Không tải được dữ liệu Kanji.";
    }, 1000);
  }

})();
