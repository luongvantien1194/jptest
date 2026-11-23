// ===== Trick trường âm (長音) của âm On – suy ra từ âm Hán Việt =====
// Thống kê, ví dụ và ngoại lệ được tính trực tiếp từ dữ liệu kanji của app (N5–N3).
(function () {
  "use strict";
  var esc = N3.esc;

  // ---------- Dữ liệu ----------
  var RAW = [].concat(typeof kanjiData !== "undefined" ? kanjiData : [], window._kanjiExtra || []);
  function k2h(s) { return String(s || "").replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); }); }
  function stripTone(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̣̀́̃̉]/g, "").normalize("NFC");
  }
  function isLong(r) {
    return /[おこそとのほもよろごぞどぼぽょ]う$/.test(r) || /[うくすつぬふむゆるぐずづぶぷゅ]う$/.test(r) || /[えけせてねへめれげぜでべぺ]い$/.test(r);
  }

  var KANJI = [], seen = {};
  RAW.forEach(function (k) {
    if (!k || !k.kanji || seen[k.kanji] || !k.on_reading || !k.hanviet) return;
    var hv = String(k.hanviet).split(/[\s,，、\/|・_]+/)[0];
    var ons = String(k.on_reading).split(/[|、,・\s]+/).map(function (s) { return k2h(s.trim()); }).filter(function (s) { return /^[ぁ-ゖー]+$/.test(s); });
    if (!hv || !ons.length) return;
    seen[k.kanji] = 1;
    var lv = /n3/i.test(k.level) ? "n3" : /n4|n5|n45/i.test(k.level) ? "n45" : "nx";
    KANJI.push({ k: k.kanji, hv: hv, hvn: stripTone(hv), on: ons[0], ons: ons, lv: lv, mean: k.core_meaning || "", long: isLong(ons[0]) });
  });

  // ---------- Quy tắc theo vần Hán Việt ----------
  // predict: "long" | "short" | "mixed"
  var RULES = [
    { id: "ng", re: /(ng|nh)$/, predict: "long", title: "Vần **-ng / -nh** → CÓ trường âm",
      why: "Âm mũi cuối của tiếng Hán cổ (-ng) biến thành **う / い** trong tiếng Nhật. Đây là quy tắc mạnh nhất, đúng gần như tuyệt đối.",
      ex: "東 Đông → とう ・ 生 Sinh → せい ・ 京 Kinh → きょう ・ 場 Trường → じょう ・ 名 Danh → めい" },
    { id: "vu", re: /(iêu|ieu|ao|au|âu|êu|eo|ưu)$/, predict: "long", title: "Vần **-ao / -au / -âu / -iêu / -ưu** → CÓ trường âm (う)",
      why: "Vần kết thúc bằng âm \"u/o\" sau nguyên âm khác → **〜う** kéo dài (こう, しょう, ちょう, きゅう, ゆう).",
      ex: "高 Cao → こう ・ 小 Tiểu → しょう ・ 調 Điệu → ちょう ・ 九 Cửu → きゅう ・ 友 Hữu → ゆう" },
    { id: "p", re: /p$/, predict: "long", title: "Vần **-p** → thường CÓ trường âm",
      why: "Âm -p cổ trong tiếng Nhật xưa viết là 〜ふ (はふ, がふ, じふ), sau thành **〜う**. Ngoại lệ: một số chữ thành **〜つ** (立 りつ, 接 せつ, 雑 ざつ).",
      ex: "法 Pháp → ほう ・ 合 Hợp → ごう ・ 十 Thập → じゅう ・ 習 Tập → しゅう ・ 業 Nghiệp → ぎょう" },
    { id: "nm", re: /(n|m)$/, predict: "short", title: "Vần **-n / -m** → KHÔNG trường âm (kết thúc ん)",
      why: "-n và -m đều thành **ん**.",
      ex: "安 An → あん ・ 新 Tân → しん ・ 三 Tam → さん ・ 心 Tâm → しん" },
    { id: "ct", re: /(c|ch|t)$/, predict: "short", title: "Vần **-c / -ch / -t** → KHÔNG trường âm (く・き・つ・ち)",
      why: "-c / -ch → **く / き**; -t → **つ / ち**. Không kéo dài – nhưng là nguồn của **っ** khi ghép từ (xem mục dưới).",
      ex: "学 Học → がく ・ 国 Quốc → こく ・ 石 Thạch → せき ・ 発 Phát → はつ ・ 一 Nhất → いち" },
    { id: "ee", re: /ê$/, predict: "mixed", title: "Vần **-ê** → nửa **えい** (dài), nửa **あい** – phải học thuộc",
      why: "Không có quy tắc chắc chắn. Nhóm えい hay gặp: 計 kế, 世 thế, 例 lệ, 低 đê. Nhóm あい: 体 thể, 題 đề, 第 đệ, 細 tế, 際 tế.",
      ex: "" },
    { id: "u", re: /(u|o)$/, predict: "mixed", title: "Vần **-u** (đơn) → KHÔNG chắc – học thuộc nhóm dài",
      why: "Phần lớn ngắn (主 chủ しゅ, 手 thủ しゅ, 部 bộ ぶ…) nhưng nhóm **trú / chú / chu / thu / du** lại dài: 注 ちゅう, 昼 ちゅう, 住 じゅう, 週 しゅう, 秋 しゅう, 遊 ゆう.",
      ex: "" },
    { id: "short", re: /.*/, predict: "short", title: "Vần kết thúc bằng **nguyên âm khác** (a, i, y, ư, ô, ơ, ai, ôi…) → KHÔNG trường âm",
      why: "Ví dụ 古 Cổ → こ, 書 Thư → しょ, 去 Khứ → きょ, 気 Khí → き, 語 Ngữ → ご, 海 Hải → かい (あい là 2 nguyên âm, không phải trường âm). Ngoại lệ hiếm: 数 số → すう, 乗 thừa → じょう.",
      ex: "" }
  ];

  function ruleOf(x) {
    for (var i = 0; i < RULES.length; i++) if (RULES[i].re.test(x.hvn)) return RULES[i];
    return RULES[RULES.length - 1];
  }
  KANJI.forEach(function (x) { x.rule = ruleOf(x); });
  function fits(x) { return x.rule.predict === "mixed" ? null : (x.rule.predict === "long") === x.long; }

  // ょう hay ゅう
  var YOU_RE = /(ương|uong|ưng|uông|iêu|ieu|iêp|iep|ang|ăng|anh|inh|ênh|ynh|iao)$/;
  var YUU_RE = /(ưu|uu|âu|u|âp|ap|ưp|up)$/;
  var MIX_RE = /(ung|ông|ong)$/; // trung ちゅう / chung しゅう nhưng cộng きょう / cung きょう → học thuộc

  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }
  function chip(x, bad) {
    return '<span class="kchip kchip--' + x.lv + (bad ? " kchip--bad" : "") + '" title="' + esc(x.mean) + '"><b class="jp">' + esc(x.k) + "</b>" +
      '<span class="kchip__hv">' + esc(x.hv) + '</span><span class="kchip__on jp">' + esc(x.ons.join("・")) + "</span></span>";
  }

  // ---------- Render quy tắc ----------
  function renderRules() {
    var h = "";
    RULES.forEach(function (r, i) {
      var list = KANJI.filter(function (x) { return x.rule === r; });
      if (!list.length) return;
      var nLong = list.filter(function (x) { return x.long; }).length;
      var ok = r.predict === "mixed" ? null : list.filter(function (x) { return fits(x); });
      var bad = r.predict === "mixed" ? null : list.filter(function (x) { return !fits(x); });
      var pct = ok ? Math.round(ok.length * 100 / list.length) : null;
      h += '<article class="card rule" data-anchor="r:' + r.id + '"><div class="card__body" style="border-top:none">';
      h += '<div class="rule__head"><span class="rule__no">' + (i + 1) + '</span><h2 class="rule__title">' + md(r.title) + "</h2>" +
        (pct != null ? '<span class="rule__pct' + (pct >= 90 ? " rule__pct--hi" : pct >= 70 ? " rule__pct--mid" : "") + '">đúng ' + pct + "%</span>" : '<span class="rule__pct">' + nLong + "/" + list.length + " dài</span>") + "</div>";
      h += '<p class="rule__why">' + md(r.why) + "</p>";
      if (r.ex) h += '<p class="rule__ex jp">' + esc(r.ex) + "</p>";
      h += '<div class="muted rule__stat">' + list.length + " kanji trong dữ liệu" + (ok ? " · " + ok.length + " theo quy tắc · " + bad.length + " ngoại lệ" : "") + "</div>";
      if (r.predict === "mixed") {
        var L = list.filter(function (x) { return x.long; }), S = list.filter(function (x) { return !x.long; });
        h += '<div class="section-label">Có trường âm (' + L.length + ")</div><div class=\"kchips\">" + L.map(function (x) { return chip(x); }).join("") + "</div>";
        h += '<div class="section-label">Không trường âm (' + S.length + ")</div><div class=\"kchips\">" + S.map(function (x) { return chip(x); }).join("") + "</div>";
      } else {
        if (bad.length) h += '<div class="section-label" style="color:var(--primary)">⚠️ Ngoại lệ – học thuộc (' + bad.length + ")</div><div class=\"kchips\">" + bad.map(function (x) { return chip(x, true); }).join("") + "</div>";
        h += '<details class="more"><summary>Xem ' + ok.length + " kanji theo đúng quy tắc</summary><div class=\"kchips\">" + ok.map(function (x) { return chip(x); }).join("") + "</div></details>";
      }
      h += "</div></article>";
    });
    document.getElementById("rules").innerHTML = h;
  }

  // ---------- ょう / ゅう ----------
  function renderYou() {
    var L = KANJI.filter(function (x) { return /[ょゅ]う$/.test(x.on); });
    var you = L.filter(function (x) { return /ょう$/.test(x.on); }), yuu = L.filter(function (x) { return /ゅう$/.test(x.on); });
    var mix = L.filter(function (x) { return MIX_RE.test(x.hvn); });
    you = you.filter(function (x) { return mix.indexOf(x) < 0; });
    yuu = yuu.filter(function (x) { return mix.indexOf(x) < 0; });
    var youOk = you.filter(function (x) { return YOU_RE.test(x.hvn); }), yuuOk = yuu.filter(function (x) { return YUU_RE.test(x.hvn) && !YOU_RE.test(x.hvn); });
    var youBad = you.filter(function (x) { return youOk.indexOf(x) < 0; }), yuuBad = yuu.filter(function (x) { return yuuOk.indexOf(x) < 0; });
    var h = '<p class="rule__why">Khi đã biết là trường âm, còn phải chọn <b class="jp">ょう</b> hay <b class="jp">ゅう</b> (しょう/しゅう, きょう/きゅう, ちょう/ちゅう, じょう/じゅう, りょう/りゅう) – lỗi rất hay gặp ở 漢字読み.</p>' +
      '<table class="cmp"><tr><th>Vần Hán Việt</th><th>Đọc</th><th>Ví dụ</th></tr>' +
      '<tr><td>-ương, -ưng, -iêu, -iêp (-ang, -inh…)</td><td class="jp">〜ょう</td><td class="jp">長 trường ちょう・小 tiểu しょう・業 nghiệp ぎょう・京 kinh きょう</td></tr>' +
      '<tr><td>-ưu, -âu, -âp, -u</td><td class="jp">〜ゅう</td><td class="jp">九 cửu きゅう・急 cấp きゅう・十 thập じゅう・週 chu しゅう・留 lưu りゅう</td></tr>' +
      '<tr><td>-ung, -ông (lẫn lộn)</td><td class="jp">cả hai</td><td class="jp">中 trung ちゅう・終 chung しゅう ↔ 共 cộng きょう・供 cung きょう</td></tr></table>' +
      '<div class="muted rule__stat">Dữ liệu: 〜ょう ' + youOk.length + "/" + you.length + " đúng quy tắc · 〜ゅう " + yuuOk.length + "/" + yuu.length + " đúng quy tắc</div>";
    if (youBad.length || yuuBad.length) {
      h += '<div class="section-label" style="color:var(--primary)">⚠️ Ngoại lệ</div><div class="kchips">' + youBad.concat(yuuBad).map(function (x) { return chip(x, true); }).join("") + "</div>";
    }
    if (mix.length) h += '<div class="section-label">Vần -ung / -ông: học thuộc (' + mix.length + ')</div><div class="kchips">' + mix.map(function (x) { return chip(x); }).join("") + "</div>";
    h += '<p class="rule__why" style="margin-top:10px">Mẹo nhớ: <b>\"ương\" có ơ → お-đoạn → ょう</b>; <b>\"ưu/âu/âp\" có u → う-đoạn → ゅう</b>.</p>';
    document.getElementById("you-yuu").innerHTML = h;
  }

  // ---------- Tra nhanh ----------
  function lookup() {
    var q = document.getElementById("lk-input").value.trim();
    var box = document.getElementById("lk-result");
    if (!q) { box.innerHTML = '<div class="muted">Nhập 1 kanji (ví dụ 調) hoặc âm Hán Việt (ví dụ \"điệu\", \"kinh\").</div>'; return; }
    var qn = stripTone(q);
    var list = KANJI.filter(function (x) { return q.indexOf(x.k) >= 0 || x.hvn === qn; }).slice(0, 30);
    if (!list.length) {
      // Không có trong dữ liệu: vẫn dự đoán theo vần
      var fake = { hvn: qn };
      var r = ruleOf(fake);
      box.innerHTML = /[a-zà-ỹ]/i.test(q)
        ? '<div class="lk-row">Không có kanji \"' + esc(q) + '\" trong dữ liệu. Dự đoán theo vần: <b>' + (r.predict === "long" ? "CÓ trường âm" : r.predict === "short" ? "KHÔNG trường âm" : "không chắc – học thuộc") + "</b> (" + md(r.title) + ")</div>"
        : '<div class="muted">Không tìm thấy trong dữ liệu kanji N5–N3.</div>';
      return;
    }
    box.innerHTML = list.map(function (x) {
      var f = fits(x);
      return '<div class="lk-row"><span class="lk-k jp">' + esc(x.k) + '</span><div style="min-width:0"><div><b>' + esc(x.hv) + '</b> · On: <span class="jp">' + esc(x.ons.join("・")) + "</span> · " +
        (x.long ? '<span class="badge badge--n3">trường âm</span>' : '<span class="badge badge--n45">âm ngắn</span>') + "</div>" +
        '<div class="muted" style="font-size:13px">' + md(x.rule.title) + " → " + (f === null ? "nhóm phải học thuộc" : f ? "✓ đúng quy tắc" : "⚠️ ngoại lệ") + "</div></div></div>";
    }).join("");
  }

  // ---------- Quiz ----------
  var quiz = new N3.Quiz(document.getElementById("quiz-modal"), { regen: buildQuiz });

  function variants(x) {
    var r = x.on, out = [];
    function add(v) { if (v && v !== r && x.ons.indexOf(v) < 0 && out.indexOf(v) < 0) out.push(v); }
    if (/[うい]$/.test(r) && x.long) add(r.slice(0, -1));
    else if (/[おこそとのほもよろごぞどぼぽうくすつぬふむゆるぐずづぶぷょゅ]$/.test(r) && !/[つく]$/.test(r)) add(r + "う");
    else if (/[えけせてねへめれげぜでべぺ]$/.test(r)) add(r + "い");
    if (/ょ/.test(r)) add(r.replace("ょ", "ゅ"));
    if (/ゅ/.test(r)) add(r.replace("ゅ", "ょ"));
    if (/[ょゅ]$/.test(r)) add(r.replace(/ょ$/, "ゅう").replace(/ゅ$/, "ょう"));
    if (/[ょゅ]う$/.test(r)) add(r.replace(/([ょゅ])う$/, function (m, c) { return c === "ょ" ? "ゅ" : "ょ"; }));
    if (/っ/.test(r)) add(r.replace("っ", ""));
    if (/[おこそとのほもよろごぞどぼぽうくすぬふむゆるぐずづぶぷ]つ$/.test(r)) add(r.replace(/つ$/, "う"));
    if (/う$/.test(r) && !/[ょゅ]う$/.test(r)) add(r.replace(/う$/, "つ"));
    return out;
  }

  function buildQuiz() {
    var pool = KANJI.filter(function (x) { return variants(x).length >= 1; });
    var pick = N3.shuffle(pool.filter(function (x) { return x.lv === "n3"; })).slice(0, 10).concat(N3.shuffle(pool.filter(function (x) { return x.lv !== "n3"; })).slice(0, 5));
    return N3.shuffle(pick).map(function (x) {
      var wr = variants(x).slice(0, 3);
      // Thiếu đáp án nhiễu: lấy âm On của chữ khác cùng hàng
      if (wr.length < 2) {
        N3.shuffle(KANJI).some(function (y) {
          if (y.on !== x.on && x.ons.indexOf(y.on) < 0 && wr.indexOf(y.on) < 0 && y.on[0] === x.on[0]) wr.push(y.on);
          return wr.length >= 3;
        });
      }
      if (wr.length < 2) {
        N3.shuffle(KANJI).some(function (y) {
          if (y.on !== x.on && x.ons.indexOf(y.on) < 0 && wr.indexOf(y.on) < 0 && Math.abs(y.on.length - x.on.length) <= 1) wr.push(y.on);
          return wr.length >= 3;
        });
      }
      var opts = N3.shuffle([x.on].concat(wr.slice(0, 3)));
      var f = fits(x);
      return {
        kind: "Âm On đúng là? (gợi ý: Hán Việt " + x.hv + ")",
        q: '<span class="big">' + esc(x.k) + '</span><span style="font-size:16px;font-family:system-ui,sans-serif">' + esc(x.hv) + "</span>",
        options: opts.map(esc),
        answer: opts.indexOf(x.on),
        explain: '<b class="jp">' + esc(x.k) + "</b> " + esc(x.hv) + " → <b class=\"jp\">" + esc(x.ons.join("・")) + "</b><br>" + md(x.rule.title) +
          " → " + (f === null ? "nhóm phải học thuộc" : f ? "✓ đúng quy tắc" : "⚠️ ngoại lệ, cần nhớ riêng")
      };
    });
  }

  // ---------- Khởi tạo ----------
  document.getElementById("sub").textContent = KANJI.length + " kanji trong dữ liệu";
  renderRules();
  renderYou();
  lookup();
  var t;
  document.getElementById("lk-input").addEventListener("input", function () { clearTimeout(t); t = setTimeout(lookup, 150); });
  document.getElementById("quiz-btn").addEventListener("click", function () { quiz.open("Trường âm", buildQuiz()); });
  document.getElementById("quiz-btn2").addEventListener("click", function () { quiz.open("Trường âm", buildQuiz()); });
  document.addEventListener("keydown", function (e) { quiz.key(e); });
  N3.addToTop();
  var mem = new N3.ScrollMemory("n3review_truongam_pos");
  mem.restore();

  window.N3TA = { kanji: KANJI, rules: RULES, buildQuiz: buildQuiz, variants: variants };
})();
