(function () {
  "use strict";

  const CANVAS_W = 405;
  const CANVAS_H = 500;

  const state = {
    items: [],
    selected: null,
    pipActive: false,
    autoPipOnSelect: true
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

  // --- PHƯƠNG ÁN MỚI: DÙNG ẢNH TĨNH LÀM NGUỒN PIP ---
  // Cách này biến Canvas thành hình ảnh mỗi khi cập nhật, giúp iOS không phải render liên tục
  function updateVideoSource() {
    if (!state.selected) return;
    
    drawCanvas(); // Vẽ nội dung lên canvas
    
    // Xuất canvas ra ảnh chất lượng cao
    const dataUrl = els.canvas.toDataURL("image/jpeg", 0.9);
    
    // Đặt ảnh làm Poster cho video - PiP trên iOS thực tế hiển thị poster nếu video chưa play
    els.video.poster = dataUrl;
    
    // Tạo một video trắng siêu ngắn để "mồi" tính năng PiP
    if (!els.video.src) {
      // Một đoạn video MP4 trắng 1 giây dưới dạng Base64
      els.video.src = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc29tYXZjMQAAAAh0cmFmAAAAZHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAABAAAAAAByZWYAAAAIZWxtcwAAAAEAAAABAAAAAAAAbWRpYWhkcmEAAAAAAA==";
      els.video.loop = true;
    }
  }

  // --- GIỮ NGUYÊN LOGIC VẼ CANVAS (RÚT GỌN) ---
  function drawCanvas() {
    var item = state.selected;
    if (!item || !ctx) return;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    
    var cx = CANVAS_W / 2;
    var maxW = CANVAS_W - 28;
    var y = 54;

    ctx.textAlign = "center";
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 96px sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(item.kanji || "", cx, y);
    y += 60;

    if (item.hanviet) {
      ctx.fillStyle = "#7dd3fc";
      ctx.font = "600 20px sans-serif";
      ctx.fillText(item.hanviet, cx, y);
      y += 30;
    }

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px sans-serif";
    var lines = wrapLinesToArray(item.meaning || "", maxW);
    y = drawParagraphCenter(cx, y, maxW, 24, lines) + 20;

    // Các phần On, Kun, Nét...
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText("On: " + (item.on || "—"), cx, y); y += 24;
    ctx.fillText("Kun: " + (item.kun || "—"), cx, y); y += 24;
  }

  function wrapLinesToArray(text, maxW) {
    var s = String(text || "").trim();
    if (!s) return [];
    var lines = [], parts = s.split(/(\s+)/), cur = "";
    for (var i = 0; i < parts.length; i++) {
      var test = cur + parts[i];
      if (ctx.measureText(test).width <= maxW) { cur = test; }
      else { if (cur.trim()) lines.push(cur.trim()); cur = parts[i]; }
    }
    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }

  function drawParagraphCenter(cx, y, maxW, lineHeight, lines) {
    ctx.textAlign = "center";
    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], cx, y + lineHeight / 2);
      y += lineHeight;
    }
    return y;
  }

  // --- KÍCH HOẠT PIP ---
  async function openPipFromUserGesture() {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
      updateVideoSource();
      await els.video.play();
      await els.video.requestPictureInPicture();
    } catch (err) {
      console.error("PiP Fail:", err);
      setFallback("Bấm lại nút PiP để kích hoạt.");
    }
  }

  function renderDetail() {
    if (!state.selected) return;
    els.detailPanel.hidden = false;
    updateVideoSource();
  }

  function setFallback(msg) {
    if (els.fallback) {
      els.fallback.hidden = !msg;
      els.fallback.textContent = msg;
    }
  }

  // Sự kiện
  els.btnPip.addEventListener("click", openPipFromUserGesture);

  // Load Data
  function bootFromKanjiData(arr) {
    state.items = (arr || []).map((raw, idx) => ({
      id: String(raw.stt || idx + 1),
      kanji: raw.kanji || "",
      meaning: raw.core_meaning || "",
      on: (raw.on_reading || "").replace(/\|/g, "、"),
      kun: (raw.kun_reading || "").replace(/\|/g, "、"),
      hanviet: raw.hanviet || ""
    }));
    if (state.items.length) {
      state.selected = state.items[0];
      renderDetail();
    }
  }

  // Khởi tạo
  const kd = window.kanjiData;
  if (kd) bootFromKanjiData(kd);

})();
