(function () {
  "use strict";

  const CANVAS_W = 400;
  const CANVAS_H = 500;

  const state = {
    items: [],
    selected: null,
    stream: null
  };

  const els = {
    canvas: document.getElementById("main-canvas"),
    btnPip: document.getElementById("btn-pip"),
    video: document.getElementById("pip-video"),
    detailPanel: document.getElementById("detail-panel")
  };

  const ctx = els.canvas.getContext("2d");

  // --- VẼ CANVAS (TỐI GIẢN) ---
  function drawCanvas() {
    const item = state.selected;
    if (!item || !ctx) return;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Kanji
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 100px sans-serif";
    ctx.fillText(item.kanji || "", CANVAS_W / 2, 100);

    // Hán Việt
    ctx.fillStyle = "#7dd3fc";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(item.hanviet || "", CANVAS_W / 2, 180);

    // Nghĩa
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "20px sans-serif";
    ctx.fillText(item.meaning || "", CANVAS_W / 2, 230);
  }

  // --- LOGIC PIP QUAN TRỌNG ---
  async function startPip() {
    try {
      // 1. Tạo stream từ canvas nếu chưa có
      if (!state.stream) {
        state.stream = els.canvas.captureStream(10); // 10 FPS
        els.video.srcObject = state.stream;
      }

      // 2. Mồi video: Quan trọng cho Safari
      els.video.muted = true;
      els.video.playsInline = true;
      
      await els.video.play();

      // 3. Yêu cầu PiP
      if (els.video.requestPictureInPicture) {
        await els.video.requestPictureInPicture();
      } else if (els.video.webkitSetPresentationMode) {
        // Cho Safari cũ hơn
        els.video.webkitSetPresentationMode("picture-in-picture");
      } else {
        alert("Trình duyệt không hỗ trợ PiP");
      }
    } catch (err) {
      console.error("PiP Error:", err);
      alert("Lỗi PiP: " + err.message);
    }
  }

  // --- KHỞI TẠO ---
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
      
      // Update canvas liên tục để video có dữ liệu
      setInterval(drawCanvas, 100);
    }
  }

  els.btnPip.addEventListener("click", startPip);

  // Đợi dữ liệu
  if (typeof kanjiData !== "undefined") {
    init(kanjiData);
  } else {
    window.addEventListener('load', () => {
      if (typeof kanjiData !== "undefined") init(kanjiData);
    });
  }

})();
