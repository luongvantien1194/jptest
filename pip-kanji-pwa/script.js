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
    video: document.getElementById("pip-video")
  };

  const ctx = els.canvas.getContext("2d");

  // --- 1. FIX LỖI MEDIASESSION (DUCK TYPING) ---
  function updateMediaSession() {
    if ('mediaSession' in navigator && state.selected) {
      try {
        // Không dùng class MediaSessionMetadata để tránh ReferenceError
        const meta = {
          title: "Hán tự: " + state.selected.kanji,
          artist: state.selected.hanviet || "Học tiếng Nhật",
          album: "Kanji PiP",
          artwork: [
            { 
              src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="%230f172a"/><text x="50%" y="50%" font-size="250" fill="white" text-anchor="middle" dominant-baseline="central">' + state.selected.kanji + '</text></svg>', 
              sizes: '512x512', 
              type: 'image/svg+xml' 
            }
          ]
        };
        navigator.mediaSession.metadata = meta;
        navigator.mediaSession.playbackState = 'playing';
      } catch (e) {
        console.warn("MediaSession update skipped.");
      }
    }
  }

  // --- 2. DUY TRÌ CHẠY NỀN ---
  function createSilentAudioTrack() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const dst = audioCtx.createMediaStreamDestination();
      oscillator.connect(dst);
      oscillator.start();
      return dst.stream.getAudioTracks()[0];
    } catch (e) { return null; }
  }

  document.addEventListener("visibilitychange", function() {
    if (document.hidden && state.pipActive) {
      if (!state.pipHeartbeat) {
        state.pipHeartbeat = setInterval(() => drawCanvas(), 1000); 
      }
    } else {
      clearInterval(state.pipHeartbeat);
      state.pipHeartbeat = null;
    }
  });

  // --- 3. LOGIC VẼ (GIỮ NGUYÊN TỪ FILE CỦA BẠN) ---
  function wrapLinesToArray(text, maxW) {
    let s = String(text || "").trim();
    if (!s) return [];
    let lines = [], parts = s.split(/(\s+)/), cur = "";
    for (let p of parts) {
      if (!p) continue;
      if (ctx.measureText(cur + p).width <= maxW) { cur += p; } 
      else { if (cur.trim()) lines.push(cur.trim()); cur = p; }
    }
    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }

  function drawCanvas() {
    const item = state.selected;
    if (!item || !ctx) return;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const cx = CANVAS_W / 2;
    const maxW = CANVAS_W - 30;

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 100px sans-serif";
    ctx.fillText(item.kanji || "", cx, 80);

    ctx.fillStyle = "#7dd3fc";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(item.hanviet || "", cx, 160);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px sans-serif";
    const mLines = wrapLinesToArray(item.meaning, maxW);
    let y = 200;
    mLines.forEach(l => { ctx.fillText(l, cx, y); y += 25; });
  }

  function loop() {
    if (!document.hidden) drawCanvas();
    state.rafId = requestAnimationFrame(loop);
  }

  // --- 4. KÍCH HOẠT PIP (FIXED CHO SAFARI) ---
  async function openPip() {
    try {
      // BƯỚC 1: Thiết lập stream nếu chưa có
      if (!state.stream) {
        const canvasStream = els.canvas.captureStream(10);
        const silentTrack = createSilentAudioTrack();
        if (silentTrack) canvasStream.addTrack(silentTrack);
        state.stream = canvasStream;
        els.video.srcObject = state.stream;
      }

      // BƯỚC 2: Cấu hình video và PLAY trước khi gọi PiP (Bắt buộc cho iOS)
      els.video.muted = true;
      els.video.setAttribute("playsinline", "true");
      await els.video.play();

      // BƯỚC 3: Gọi PiP theo 2 chuẩn
      if (els.video.requestPictureInPicture) {
        await els.video.requestPictureInPicture();
      } else if (els.video.webkitSetPresentationMode) {
        els.video.webkitSetPresentationMode("picture-in-picture");
      } else {
        alert("Trình duyệt không hỗ trợ PiP.");
        return;
      }

      state.pipActive = true;
      updateMediaSession();
    } catch (err) {
      console.error("PiP Error:", err);
    }
  }

  els.btnPip.addEventListener("click", openPip);

  // --- 5. KHỞI TẠO ---
  function init(arr) {
    state.items = (arr || []).map((raw, idx) => ({
      id: String(raw.stt || idx + 1),
      kanji: raw.kanji || "",
      meaning: raw.core_meaning || "",
      hanviet: raw.hanviet || ""
    }));
    
    state.selected = state.items[0];
    if (state.selected) {
      els.detailPanel.hidden = false;
      drawCanvas();
      loop();
    }
  }

  if (typeof kanjiData !== "undefined") {
    init(kanjiData);
  } else {
    window.addEventListener('load', () => {
      if (typeof kanjiData !== "undefined") init(kanjiData);
    });
  }

})();
