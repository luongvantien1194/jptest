// ===== Ôn thi N3 — tiện ích dùng chung (kanji.html & grammar.html) =====
(function (root) {
  "use strict";

  // --- Cờ dev: ?dev=1 lưu vào localStorage, ?dev=0 thì xoá (giống index.html) ---
  try {
    var dev = new URLSearchParams(location.search).get("dev");
    if (dev === "1") localStorage.setItem("dev", "1");
    else if (dev === "0") localStorage.removeItem("dev");
  } catch (e) { }

  // --- Chế độ tối theo cài đặt của app chính ---
  try {
    if ((JSON.parse(localStorage.getItem("jp_display_settings")) || {}).darkMode) {
      document.documentElement.classList.add("theme-dark");
    }
  } catch (e) { }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function isKanji(ch) { return /[㐀-鿿豈-﫿々〆ヶ]/.test(ch); }
  function isKana(ch) { return /[぀-ヿー]/.test(ch); }

  // "毎日[まいにち]" → <ruby>毎日<rt>まいにち</rt></ruby>; hỗ trợ cả okurigana: "今にも[いまにも]"
  function ruby(text) {
    text = String(text == null ? "" : text);
    var re = /\[([぀-ヿー・]+)\]/g, out = "", last = 0, m;
    while ((m = re.exec(text))) {
      var before = text.slice(last, m.index), rd = m[1];
      var i = before.length;
      while (i > 0 && isKanji(before[i - 1])) i--;
      var base = before.slice(i);
      if (!base) {
        var j = before.length;
        while (j > 0 && isKana(before[j - 1])) j--;
        var k = j;
        while (k > 0 && isKanji(before[k - 1])) k--;
        var kana = before.slice(j, before.length);
        if (k < j && rd.slice(-kana.length) === kana) { i = k; base = before.slice(k); }
        else if (k < j) {
          // Dữ liệu đặt okurigana trước ngoặc (働き[はたら]): gắn furigana cho phần kanji, giữ kana phía sau
          out += esc(before.slice(0, k)) + "<ruby>" + esc(before.slice(k, j)) + "<rt>" + esc(rd) + "</rt></ruby>" + esc(kana);
          last = re.lastIndex;
          continue;
        }
      }
      out += esc(before.slice(0, i));
      out += base ? "<ruby>" + esc(base) + "<rt>" + esc(rd) + "</rt></ruby>" : esc(m[0]);
      last = re.lastIndex;
    }
    return out + esc(text.slice(last));
  }

  function plain(text) {
    return String(text == null ? "" : text).replace(/\[[぀-ヿー・]+\]/g, "");
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function sample(arr, n) { return shuffle(arr).slice(0, n); }

  // --- localStorage an toàn ---
  function load(key, def) {
    try {
      var v = localStorage.getItem(key);
      return v == null ? def : JSON.parse(v);
    } catch (e) { return def; }
  }

  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { }
  }

  // Tập "đã thuộc" lưu dạng mảng
  function KnownSet(key) {
    this.key = key;
    this.set = new Set(load(key, []));
  }
  KnownSet.prototype.has = function (id) { return this.set.has(String(id)); };
  KnownSet.prototype.toggle = function (id) {
    id = String(id);
    if (this.set.has(id)) this.set.delete(id); else this.set.add(id);
    save(this.key, Array.from(this.set));
    return this.set.has(id);
  };

  // --- Quiz dùng chung ---
  // questions: [{kind, q (html), options: [html], answer: index, explain (html)}]
  function Quiz(modalEl, opts) {
    this.el = modalEl;
    this.body = modalEl.querySelector(".modal__body");
    this.opts = opts || {};
    var self = this;
    modalEl.querySelector(".modal__backdrop").addEventListener("click", function () { self.close(); });
    modalEl.querySelector(".modal__close").addEventListener("click", function () { self.close(); });
  }

  Quiz.prototype.open = function (title, questions) {
    this.title = title;
    this.qs = questions;
    this.i = 0;
    this.score = 0;
    this.wrong = [];
    this.el.classList.add("modal--open");
    document.body.style.overflow = "hidden";
    if (!questions.length) {
      this.body.innerHTML = '<div class="empty">Không đủ dữ liệu để tạo câu hỏi cho phần này.</div>';
      return;
    }
    this.render();
  };

  Quiz.prototype.close = function () {
    this.el.classList.remove("modal--open");
    document.body.style.overflow = "";
  };

  Quiz.prototype.render = function () {
    var self = this, q = this.qs[this.i];
    var html = '<div class="quiz__count">' + esc(this.title) + " · Câu " + (this.i + 1) + "/" + this.qs.length +
      " · Đúng " + this.score + "</div>";
    html += '<div class="quiz__kind">' + esc(q.kind) + "</div>";
    html += '<div class="quiz__q jp">' + q.q + "</div>";
    html += '<div class="quiz__opts">';
    q.options.forEach(function (o, idx) {
      html += '<button type="button" class="quiz__opt jp" data-i="' + idx + '">' + (idx + 1) + ". " + o + "</button>";
    });
    html += "</div>";
    html += '<div class="quiz__explain">' + (q.explain || "") + "</div>";
    html += '<div class="quiz__foot"><span class="muted" style="font-size:12px">Phím 1–4 để chọn, Enter để tiếp</span>' +
      '<button type="button" class="btn quiz__next" style="display:none">Tiếp →</button></div>';
    this.body.innerHTML = html;
    this.answered = false;
    this.body.querySelectorAll(".quiz__opt").forEach(function (b) {
      b.addEventListener("click", function () { self.pick(Number(b.getAttribute("data-i"))); });
    });
    this.body.querySelector(".quiz__next").addEventListener("click", function () { self.next(); });
  };

  Quiz.prototype.pick = function (idx) {
    if (this.answered) return;
    this.answered = true;
    var q = this.qs[this.i];
    var btns = this.body.querySelectorAll(".quiz__opt");
    btns[q.answer].classList.add("quiz__opt--right");
    if (idx === q.answer) this.score++;
    else {
      if (btns[idx]) btns[idx].classList.add("quiz__opt--wrong");
      this.wrong.push(q);
    }
    this.body.querySelector(".quiz__explain").classList.add("quiz__explain--show");
    this.body.querySelector(".quiz__next").style.display = "";
  };

  Quiz.prototype.next = function () {
    if (!this.answered) return;
    this.i++;
    if (this.i < this.qs.length) { this.render(); return; }
    var pct = Math.round(this.score * 100 / this.qs.length);
    var html = '<div class="quiz__result"><div class="muted">' + esc(this.title) + "</div>" +
      '<div class="quiz__score">' + this.score + "/" + this.qs.length + "</div>" +
      "<div>" + (pct >= 90 ? "Xuất sắc! 🎉" : pct >= 70 ? "Khá tốt, ôn lại các câu sai nhé." : "Cần ôn thêm cụm này.") + "</div>";
    if (this.wrong.length) {
      html += '<ol class="wrong-list">';
      this.wrong.forEach(function (q) {
        html += "<li><span class='jp'>" + q.q.replace(/class="big"/g, "") + "</span> → <b class='jp'>" + q.options[q.answer] + "</b></li>";
      });
      html += "</ol>";
    }
    html += '<div style="margin-top:16px;display:flex;gap:8px;justify-content:center">' +
      '<button type="button" class="btn quiz__again">Làm lại</button>' +
      '<button type="button" class="btn btn--ghost quiz__done">Đóng</button></div></div>';
    this.body.innerHTML = html;
    var self = this;
    this.body.querySelector(".quiz__again").addEventListener("click", function () {
      self.open(self.title, self.opts.regen ? self.opts.regen() : shuffle(self.qs));
    });
    this.body.querySelector(".quiz__done").addEventListener("click", function () { self.close(); });
  };

  Quiz.prototype.key = function (e) {
    if (!this.el.classList.contains("modal--open")) return;
    if (e.key === "Escape") { this.close(); return; }
    if (/^[1-4]$/.test(e.key)) this.pick(Number(e.key) - 1);
    else if (e.key === "Enter") this.next();
  };

  // Nút về đầu trang
  function addToTop() {
    var b = document.createElement("button");
    b.className = "to-top";
    b.type = "button";
    b.title = "Lên đầu trang";
    b.textContent = "↑";
    b.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(b);
  }

  // Thông báo ngắn
  var toastTimer;
  function toast(msg) {
    var el = document.getElementById("n3-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "n3-toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("toast--show"); }, 2200);
  }

  // Chiều cao header dính (để cuộn không bị header che)
  function headerLine() {
    var h = document.querySelector(".top");
    // Header có thể không dính (trang chủ đề trên điện thoại) → khi đã cuộn qua thì mép trên màn hình là 0
    return h ? Math.max(0, h.getBoundingClientRect().bottom) : 0;
  }

  function scrollToEl(el, gap) {
    var y = el.getBoundingClientRect().top + window.scrollY - headerLine() - (gap == null ? 8 : gap);
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }

  function flash(el) {
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  }

  // ---------- Ghi nhớ vị trí đọc ----------
  // Lưu "điểm neo": phần tử [data-anchor] sâu nhất đang nằm ở mép dưới header + độ lệch,
  // kèm dữ liệu trang (tab, các cụm đang mở) do extra() trả về.
  // Không lưu scrollY thô vì chiều cao trang đổi khi mở/đóng cụm hoặc khi font tải xong.
  function ScrollMemory(key, extra) {
    var self = this;
    this.key = key;
    this.extra = extra || function () { return {}; };
    this.saved = load(key, null);
    this.lock = true; // khoá lưu cho tới khi restore() xong, tránh ghi đè vị trí cũ lúc trang đang dựng
    var t;
    try { history.scrollRestoration = "manual"; } catch (e) { }
    window.addEventListener("scroll", function () {
      if (self.lock) return;
      clearTimeout(t);
      t = setTimeout(function () { self.save(); }, 250);
    }, { passive: true });
    window.addEventListener("pagehide", function () { if (!self.lock) self.save(); });
    document.addEventListener("visibilitychange", function () { if (document.hidden && !self.lock) self.save(); });
  }

  ScrollMemory.prototype.anchor = function () {
    var line = headerLine() + 1, best = null;
    var list = document.querySelectorAll("[data-anchor]");
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (!el.offsetParent || el.closest(".modal")) continue;
      var r = el.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) best = { el: el, top: r.top };
    }
    return best;
  };

  ScrollMemory.prototype.save = function () {
    var a = this.anchor(), st = this.extra() || {};
    st.y = window.scrollY;
    st.a = a ? { id: a.el.getAttribute("data-anchor"), off: headerLine() - a.top } : null;
    save(this.key, st);
  };

  // Gọi sau khi trang đã render xong theo trạng thái đã lưu
  ScrollMemory.prototype.restore = function () {
    var self = this, s = this.saved;
    if (!s || (!s.a && !s.y)) { this.lock = false; return; }
    var userMoved = false;
    function mark() { userMoved = true; }
    ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (ev) {
      window.addEventListener(ev, mark, { once: true, passive: true });
    });
    function go() {
      if (userMoved) return;
      var el = s.a ? document.querySelector('[data-anchor="' + String(s.a.id).replace(/["\\]/g, "\\$&") + '"]') : null;
      var y = el ? el.getBoundingClientRect().top + window.scrollY - headerLine() + (s.a.off || 0) : (s.y || 0);
      window.scrollTo(0, Math.max(0, y));
    }
    this.lock = true;
    go();
    requestAnimationFrame(go);
    var unlock = function () { go(); setTimeout(function () { self.lock = false; self.save(); }, 150); };
    if (document.fonts && document.fonts.ready) {
      var done = false;
      document.fonts.ready.then(function () { if (!done) { done = true; unlock(); } });
      setTimeout(function () { if (!done) { done = true; unlock(); } }, 2500);
    } else {
      setTimeout(unlock, 300);
    }
  };

  // Click vào phần bị che (chế độ ôn) để hiện
  document.addEventListener("click", function (e) {
    var h = e.target.closest(".hide-mode .hideable");
    if (h) h.classList.toggle("revealed");
  });

  root.N3 = {
    esc: esc, ruby: ruby, plain: plain, shuffle: shuffle, sample: sample,
    load: load, save: save, KnownSet: KnownSet, Quiz: Quiz, isKanji: isKanji, addToTop: addToTop,
    toast: toast, headerLine: headerLine, scrollToEl: scrollToEl, flash: flash, ScrollMemory: ScrollMemory
  };
})(window);
