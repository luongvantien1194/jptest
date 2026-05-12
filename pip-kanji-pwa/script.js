(function () {
  "use strict";

  const CANVAS_W = 405;
  const CANVAS_H = 500;

  const state = {
    items: [],
    selected: null,
    stream: null,
    timerId: 0,
    autoPipOnSelect: true
  };

  const els = {
    detailPanel: document.getElementById("detail-panel"),
    canvas: document.getElementById("main-canvas"),
    btnPip: document.getElementById("btn-pip"),
    video: document.getElementById("pip-video"),
    fallback: document.getElementById("fallback-box")
  };

  const ctx = els.canvas.getContext("2d", { alpha: false }); // Tối ưu hiệu năng

  /** Vẽ lại nội dung lên Canvas */
  function draw() {
    const item = state.selected;
    if (!item || !ctx) return;

    // Vẽ nền
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const cx = CANVAS_W / 2;
    let y = 60;

    // Vẽ Kanji
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 100px sans-serif";
    ctx.fillText(item.kanji || "", cx, y);
    y += 70;

    // Vẽ Hán Việt
    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 22px sans-serif";
      ctx.fillText(item.hanviet, cx, y);
      y += 35;
    }

    // Vẽ Nghĩa
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px sans-serif";
    const lines = wrapText(item.meaning || "", CANVAS_W - 30);
    lines.forEach(line => {
      ctx.fillText(line, cx, y);
      y += 25;
    });

    // Ép luồng video cập nhật khung hình (Quan trọng cho iOS)
    if (state.stream) {
      const track = state.stream.getVideoTracks()[0];
      if (track && track.requestFrame) track.requestFrame();
    }
  }

  function wrapText(text, maxW) {
    const words = text.split(" ");
    const lines = [];
    let cur = "";
    words.forEach(w => {
      const test = cur ? cur + " " + w : w;
      if (ctx.measureText(test).width <= maxW) cur = test;
      else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  /** Khởi tạo luồng video ổn định */
  function setupStream() {
    try {
      if (state.stream) {
        state.stream.getTracks().forEach(t => t.stop());
      }

      // Chỉ lấy 2 khung hình/giây để iOS không coi là tác vụ nặng
      state.stream = els.canvas.captureStream(2); 
      els.video.srcObject = state.stream;
      
      // Bắt buộc các thuộc tính này để chạy nền
      els.video.muted = true;
      els.video.setAttribute("playsinline", "true");
      els.video.play().catch(() => {});
    } catch (e) {
      console.error("Stream setup failed", e);
    }
  }

  function startHeartbeat() {
    clearInterval(state.timerId);
    // Dùng setInterval thay vì RAF vì RAF chết khi khóa màn hình
    state.timerId = setInterval(draw, 500); 
  }

  async function togglePip() {
    try {
      setupStream();
      draw();
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
      await els.video.play();
      await els.video.requestPictureInPicture();
    } catch (e) {
      if (els.fallback) els.fallback.textContent = "Vui lòng thử lại: " + e.message;
    }
  }

  function renderDetail() {
    if (!state.selected) return;
    els.detailPanel.hidden = false;
    draw();
    startHeartbeat();
  }

  // Event Listeners
  els.btnPip.addEventListener("click", togglePip);

  // Khởi tạo dữ liệu (Giả định kanjiData đã có)
  function init() {
    const data = window.kanjiData || [];
    state.items = data.map((d, i) => ({
      id: d.stt || i,
      kanji: d.kanji,
      hanviet: d.hanviet,
      meaning: d.core_meaning
    }));
    if (state.items.length) {
      state.selected = state.items[0];
      renderDetail();
    }
  }

  init();
})();
