
(function () {
  "use strict";

  /** Dữ liệu Kanji nhúng trong script (không cần file JSON riêng). */
  const KANJI_INLINE_DATA = [
    { id: "1", kanji: "日", meaning: "Mặt trời / ngày", on: "ニチ、ジツ", kun: "ひ、び、か", strokes: 4 },
    { id: "2", kanji: "月", meaning: "Mặt trăng / tháng", on: "ゲツ、ガツ", kun: "つき", strokes: 4 },
    { id: "3", kanji: "木", meaning: "Cây", on: "モク、ボク", kun: "き、こ", strokes: 4 },
    { id: "4", kanji: "水", meaning: "Nước", on: "スイ", kun: "みず", strokes: 4 }
  ];

  const CANVAS_W = 720;
  const CANVAS_H = 405;

  const state = {
    items: [],
    selected: null,
    /** 0 = chữ lớn + nghĩa (dễ đọc khi PiP); 1 = nghĩa + On/Kun đầy đủ */
    face: 0,
    stream: null,
    pipActive: false,
    rafId: 0,
    lastDraw: 0,
    /** Tự gọi PiP sau khi chạm chọn Kanji (cùng user gesture) */
    autoPipOnSelect: true
  };

  const els = {
    loadStatus: document.getElementById("load-status"),
    list: document.getElementById("kanji-list"),
    detailPanel: document.getElementById("detail-panel"),
    detailTitle: document.getElementById("detail-title"),
    detailMeta: document.getElementById("detail-meta"),
    canvas: document.getElementById("main-canvas"),
    btnPip: document.getElementById("btn-pip"),
    btnFlip: document.getElementById("btn-flip"),
    video: document.getElementById("pip-video"),
    fallback: document.getElementById("fallback-box"),
    swStatus: document.getElementById("sw-status"),
    autoPipCheckbox: document.getElementById("auto-pip")
  };

  const ctx = els.canvas.getContext("2d");

  function supportsPipFromCanvas() {
    var c = els.canvas;
    var v = els.video;
    if (!c || !c.captureStream) {
      return { ok: false, reason: "Trình duyệt không hỗ trợ canvas.captureStream()." };
    }
    if (!v || !v.requestPictureInPicture) {
      return { ok: false, reason: "Trình duyệt không hỗ trợ video.requestPictureInPicture()." };
    }
    return { ok: true };
  }

  function setFallback(msg) {
    if (!els.fallback) return;
    els.fallback.hidden = !msg;
    els.fallback.textContent = msg || "";
  }

  function drawCanvas(now) {
    var item = state.selected;
    if (!item || !ctx) return;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    var pulse = 0.85 + 0.15 * Math.sin((now || 0) / 400);
    ctx.save();
    ctx.translate(CANVAS_W / 2, CANVAS_H / 2);

    if (state.face === 0) {
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold " + Math.floor(200 * pulse) + "px 'Hiragino Sans', 'Yu Gothic', 'PingFang SC', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.kanji || "", 0, -72);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "24px system-ui, sans-serif";
      wrapText(ctx, item.meaning || "", 0, 28, CANVAS_W - 48, 28);
      ctx.fillStyle = "#64748b";
      ctx.font = "20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("On " + (item.on || "—") + "  ·  Kun " + (item.kun || "—"), 0, 132);
      ctx.font = "18px system-ui, sans-serif";
      ctx.fillText("Stroke: " + (item.strokes != null ? item.strokes : "—"), 0, 162);
    } else {
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "28px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      wrapText(ctx, item.meaning || "", 0, -60, CANVAS_W - 80, 34);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "22px system-ui, sans-serif";
      var lines = ["On: " + (item.on || "—"), "Kun: " + (item.kun || "—")];
      lines.forEach(function (line, i) {
        ctx.fillText(line, 0, 40 + i * 32);
      });
    }

    ctx.restore();

    var t = Math.floor((now || 0) / 500) % 4;
    ctx.fillStyle = "#334155";
    ctx.font = "14px monospace";
    ctx.textAlign = "right";
    ctx.fillText("tick " + String(t), CANVAS_W - 12, CANVAS_H - 10);
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = String(text).split(/\s+/);
    var line = "";
    var cy = y;
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + " ";
      var metrics = context.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        context.fillText(line, x, cy);
        line = words[n] + " ";
        cy += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, cy);
  }

  function loop(now) {
    drawCanvas(now);
    state.rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    }
  }

  function attachStreamToVideo() {
    var cap = supportsPipFromCanvas();
    if (!cap.ok) {
      els.btnPip.disabled = true;
      setFallback(cap.reason + " Dùng canvas trong trang hoặc mở bằng Safari iOS mới hơn.");
      return;
    }
    try {
      if (state.stream) {
        state.stream.getTracks().forEach(function (t) {
          t.stop();
        });
      }
      state.stream = els.canvas.captureStream(30);
      els.video.srcObject = state.stream;
      els.video.muted = true;
      els.video.setAttribute("playsinline", "");
      els.video.setAttribute("webkit-playsinline", "");
      els.btnPip.disabled = false;
      setFallback("");
      if (document.pictureInPictureElement === els.video) {
        els.video.play().catch(function () {});
      }
    } catch (e) {
      els.btnPip.disabled = true;
      setFallback("Không tạo được MediaStream từ canvas: " + (e && e.message ? e.message : e));
    }
  }

  function renderDetail(opts) {
    opts = opts || {};
    var item = state.selected;
    if (!item) {
      els.detailPanel.hidden = true;
      stopLoop();
      return;
    }
    els.detailPanel.hidden = false;
    els.detailTitle.textContent = "Kanji: " + item.kanji;
    els.detailMeta.innerHTML =
      "<strong>Nghĩa:</strong> " +
      escapeHtml(item.meaning) +
      "<br><strong>On:</strong> " +
      escapeHtml(item.on) +
      " · <strong>Kun:</strong> " +
      escapeHtml(item.kun);

    attachStreamToVideo();
    drawCanvas(performance.now());
    if (!state.rafId) {
      state.rafId = requestAnimationFrame(loop);
    }
    if (
      opts.skipAutoPip !== true &&
      state.autoPipOnSelect &&
      supportsPipFromCanvas().ok
    ) {
      openPipFromUserGesture({ silent: true });
    }
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderList() {
    els.list.innerHTML = "";
    state.items.forEach(function (item) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "kanji-btn";
      b.textContent = item.kanji;
      b.setAttribute("aria-current", state.selected && state.selected.id === item.id ? "true" : "false");
      b.addEventListener("click", function () {
        state.selected = item;
        state.face = 0;
        document.querySelectorAll(".kanji-btn").forEach(function (btn) {
          btn.setAttribute("aria-current", "false");
        });
        b.setAttribute("aria-current", "true");
        renderDetail();
        history.replaceState({ id: item.id }, "", "#kanji=" + encodeURIComponent(item.id));
      });
      els.list.appendChild(b);
    });
    els.list.hidden = false;
  }

  function openPipFromUserGesture(opts) {
    opts = opts || {};
    var v = els.video;
    var pip = v && v.requestPictureInPicture;
    if (!pip) {
      if (!opts.silent) {
        setFallback("Không có Picture-in-Picture trên trình duyệt này.");
      }
      return Promise.resolve(false);
    }
    return v
      .play()
      .then(function () {
        return v.requestPictureInPicture();
      })
      .then(function () {
        state.pipActive = true;
        setFallback("");
        return true;
      })
      .catch(function (err) {
        if (!opts.silent) {
          setFallback(
            "Không bật được PiP: " +
              (err && err.message ? err.message : err) +
              " (thường do chưa tương tác hoặc iOS chặn)."
          );
        }
        return false;
      });
  }

  els.btnPip.addEventListener("click", function () {
    openPipFromUserGesture({ silent: false });
  });

  els.btnFlip.addEventListener("click", function () {
    state.face = state.face === 0 ? 1 : 0;
  });

  if (els.video) {
    els.video.addEventListener("leavepictureinpicture", function () {
      state.pipActive = false;
    });
  }

  function bootFromHash() {
    var m = (window.location.hash || "").match(/^#kanji=(.+)$/);
    if (!m || !state.items.length) {
      return;
    }
    try {
      var id = decodeURIComponent(m[1]);
      var found = state.items.find(function (x) {
        return String(x.id) === String(id);
      });
      if (found) {
        state.selected = found;
        state.face = 0;
        document.querySelectorAll(".kanji-btn").forEach(function (btn) {
          btn.setAttribute("aria-current", btn.textContent === found.kanji ? "true" : "false");
        });
        renderDetail({ skipAutoPip: true });
      }
    } catch (e) {
      /* ignore */
    }
  }

  if (els.autoPipCheckbox) {
    els.autoPipCheckbox.checked = state.autoPipOnSelect;
    els.autoPipCheckbox.addEventListener("change", function () {
      state.autoPipOnSelect = !!els.autoPipCheckbox.checked;
    });
  }

  function registerSw() {
    if (!("serviceWorker" in navigator)) {
      els.swStatus.textContent = "Service Worker: không hỗ trợ (mở qua HTTPS hoặc localhost để cache offline).";
      return;
    }
    navigator.serviceWorker
      .register("./sw.js", { scope: "./" })
      .then(function () {
        els.swStatus.textContent = "Service Worker: đã đăng ký (cache file chính khi có mạng).";
      })
      .catch(function (err) {
        els.swStatus.textContent =
          "Service Worker: đăng ký thất bại — thường do mở file:// hoặc sai path. " + (err && err.message ? err.message : "");
      });
  }

  function bootAppData(data) {
    state.items = Array.isArray(data) ? data : [];
    els.loadStatus.textContent = "Chọn một chữ Kanji:";
    renderList();
    bootFromHash();
    if (!state.selected && state.items.length) {
      state.selected = state.items[0];
      state.face = 0;
      var first = els.list.querySelector(".kanji-btn");
      if (first) {
        first.setAttribute("aria-current", "true");
      }
      renderDetail({ skipAutoPip: true });
      history.replaceState({ id: state.selected.id }, "", "#kanji=" + encodeURIComponent(state.selected.id));
    }
  }

  window.addEventListener("hashchange", bootFromHash);
  registerSw();

  bootAppData(KANJI_INLINE_DATA);
})();
