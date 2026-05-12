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
    pipHeartbeat: null 
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

  // --- FIX LỖI SAFARI & DUY TRÌ CHẠY NỀN ---

  /** 
   * Cập nhật MediaSession an toàn 
   * Fix lỗi "Can't find variable: MediaSessionMetadata" trên WebKit/iOS
   */
  function updateMediaSession() {
    if ('mediaSession' in navigator && state.selected) {
      try {
        const metadataConfig = {
          title: "Học Kanji: " + state.selected.kanji,
          artist: state.selected.hanviet || "Kanji PiP",
          album: "Học Tiếng Nhật",
          artwork: [
            { 
              src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="%230f172a"/><text x="50%" y="50%" font-size="250" fill="white" text-anchor="middle" dominant-baseline="central">' + state.selected.kanji + '</text></svg>', 
              sizes: '512x512', 
              type: 'image/svg+xml' 
            }
          ]
        };

        // KIỂM TRA BIẾN TOÀN CỤC: Nếu không có lớp MediaSessionMetadata, dùng Object thường
        if (window.MediaSessionMetadata) {
          navigator.mediaSession.metadata = new MediaSessionMetadata(metadataConfig);
        } else {
          navigator.mediaSession.metadata = metadataConfig;
        }
        
        navigator.mediaSession.playbackState = 'playing';
      } catch (e) {
        console.warn("MediaSession update failed:", e);
      }
    }
  }

  /** Tạo track âm thanh im lặng để iOS không đóng PiP khi khóa màn hình */
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

  // Chống đóng băng Canvas khi tab bị ẩn (Visibility API)
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

  function parseLegacyPipeVocab(s) {
    let out = [];
    String(s).split("|").forEach(seg => {
      let t = String(seg).trim();
      if (!t) return;
      let m = t.match(/^(.+?)\(([^)]+)\)\s*:\s*(.+)$/);
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
      return raw.vocabulary.map(e => {
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
        continue;
      }
      if (cur.trim()) lines.push(cur.trim());
      cur = p;
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
    ctx.save();
    
    const cx = CANVAS_W / 2;
    const maxW = CANVAS_W - 28;
    let y = 54;

    // Kanji chính
    ctx.textAlign = "center";
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 96px 'Hiragino Sans', 'Yu Gothic', sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(item.kanji || "", cx, y);
    y += 56;

    // Hán Việt
    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 19px system-ui, sans-serif";
      ctx.fillText(item.hanviet, cx, y);
      y += 28;
    }

    // Nghĩa
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px system-ui, sans-serif";
    const meaningLines = wrapLinesToArray(item.meaning || "", maxW);
    y = drawParagraphCenter(cx, y, maxW, 22, meaningLines) + 12;

    // Chi tiết On/Kun
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("On: " + (item.on || "—"), cx, y); y += 24;
    ctx.fillText("Kun: " + (item.kun || "—"), cx, y); y += 24;
    ctx.fillText("Nét: " + (item.strokes || "—"), cx, y); y += 28;

    // Bộ thủ & Memory Tip
    if (item.radicals) {
      ctx.fillStyle = "#78716c";
      ctx.font = "14px system-ui, sans-serif";
      y = drawParagraphCenter(cx, y, maxW, 19, wrapLinesToArray("Bộ: " + item.radicals, maxW)) + 10;
    }

    // Từ vựng ví dụ
    const vocabs = item._vocabs || [];
    if (vocabs.length) {
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText("Từ vựng", cx, y); y += 24;
      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px system-ui, sans-serif";
      vocabs.slice(0, 3).forEach(v => {
        let line = `${v.word}${v.reading ? " ("+v.reading+")" : ""} - ${v.meaning}`;
        y = drawParagraphCenter(cx, y, maxW, 18, wrapLinesToArray(line, maxW)) + 8;
      });
    }
    ctx.restore();
  }

  function loop() {
    if (!document.hidden) drawCanvas();
    state.rafId = requestAnimationFrame(loop);
  }

  // --- KHỞI TẠO PIP ---

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
      await els.video.play();
      await els.video.requestPictureInPicture();
      state.pipActive = true;
      updateMediaSession();
    } catch (err) {
      console.error("PiP Activate Error:", err);
    }
  }

  els.btnPip.addEventListener("click", openPip);

  // --- BOOTSTRAP ---

  function init(arr) {
    state.items = (arr || []).map((raw, idx) => ({
      id: String(raw.stt || idx + 1),
      kanji: raw.kanji || "",
      meaning: raw.core_meaning || "",
      on: String(raw.on_reading || "").replace(/\|/g, "、"),
      kun: String(raw.kun_reading || "").replace(/\|/g, "、"),
      strokes: raw.stroke_count || "",
      hanviet: raw.hanviet || "",
      radicals: String(raw.radicals || ""),
      _vocabs: normalizeVocabularyList({ vocabulary: raw.vocabulary })
    }));
    
    // Tự chọn Kanji theo Hash hoặc mặc định
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
  } else {
    if (els.loadStatus) els.loadStatus.textContent = "Không tìm thấy dữ liệu kanjiData.";
  }

})();
