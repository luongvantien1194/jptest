// ===== Từ vựng kanji theo tần suất (BCCWJ) =====
(function () {
  "use strict";
  var esc = N3.esc;
  var PAGE = 150;

  // ---------- Kanji: cấp độ & thông tin ----------
  var KMAP = {};
  var kx = window._kanjiExtra || [];
  try { kx = kx.concat(JSON.parse(localStorage.getItem("kanji_extra_list")) || []); } catch (e) { }
  function addK(list, lv) {
    (list || []).forEach(function (k) { if (k && k.kanji && !KMAP[k.kanji]) KMAP[k.kanji] = { d: k, lv: lv }; });
  }
  addK(kx.filter(function (k) { return k.level === "n3"; }), "n3");
  addK(typeof kanjiData !== "undefined" ? kanjiData : [], "n45");
  addK(kx.filter(function (k) { return k.level !== "n3"; }), "nx");

  // ---------- Bảng tần suất BCCWJ ----------
  var FREQ = new Map(); // từ → [[cách đọc, hạng], ...]
  String(window.N3_WORD_FREQ || "").split("\n").forEach(function (line) {
    var p = line.split("\t");
    if (p.length < 3) return;
    var arr = FREQ.get(p[0]);
    if (!arr) FREQ.set(p[0], arr = []);
    arr.push([p[1], Number(p[2])]);
  });
  var KFREQ = window.N3_KANJI_FREQ || {};
  var META = window.N3_FREQ_META || {};

  function hira(s) {
    return String(s || "").replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); });
  }

  function lookup(w, r) {
    var arr = FREQ.get(w);
    if (!arr) return null;
    var best = null, exact = null;
    arr.forEach(function (x) {
      if (!best || x[1] < best[1]) best = x;
      if (r && x[0] === r && (!exact || x[1] < exact[1])) exact = x;
    });
    return exact ? { rank: exact[1], exact: true } : { rank: best[1], exact: false, r: best[0] };
  }

  // ---------- Chuẩn hoá từ trong data (ます → thể từ điển, bỏ [な], ～ …) ----------
  var I2U = { い: "う", き: "く", ぎ: "ぐ", し: "す", ち: "つ", に: "ぬ", び: "ぶ", み: "む", り: "る" };
  function clean(s) {
    return String(s || "")
      .replace(/[\[「（(][^\]」）)]*[\]」）)]/g, "")
      .replace(/^[～〜~－―\-…]+/, "")
      .replace(/[。．.！!？?、]+$/, "")
      .replace(/(ですね|です)$/, "")
      .trim();
  }

  // Trả về danh sách ứng viên { w, r } theo thứ tự ưu tiên
  function candidates(w0, r0) {
    var w = clean(w0), r = hira(clean(r0));
    var out = [{ w: w, r: r }];
    if (/します$/.test(w) && /します$/.test(r) && w.length > 3) {
      // 話します → 話す (ngũ đoạn す) hoặc 勉強します → 勉強する: thử cả hai, cái nào khớp cách đọc thì chọn
      out.unshift({ w: w.slice(0, -3) + "す", r: r.slice(0, -3) + "す" }, { w: w.slice(0, -3), r: r.slice(0, -3), suru: true });
    } else if (w === "来ます") {
      out.unshift({ w: "来る", r: "くる" });
    } else if (/ます$/.test(w) && /ます$/.test(r)) {
      var ws = w.slice(0, -2), rs = r.slice(0, -2), last = rs.slice(-1);
      if (I2U[last] && ws.slice(-1) === last) {
        out.unshift({ w: ws.slice(0, -1) + I2U[last], r: rs.slice(0, -1) + I2U[last] });
        out.splice(1, 0, { w: ws + "る", r: rs + "る" });
      } else if (I2U[last]) {
        // kanji ôm luôn âm i (見ます, 着ます…) → nhất đoạn; phòng hờ ngũ đoạn
        out.unshift({ w: ws + "る", r: rs + "る" });
      } else {
        out.unshift({ w: ws + "る", r: rs + "る" });
      }
    }
    if (!/ます$/.test(w) && /ます$/.test(r) && r.length > 2) {
      // Dữ liệu ghi chữ ở thể từ điển nhưng cách đọc dạng ます (見る / みます): đổi cách đọc
      var rs2 = r.slice(0, -2), l2 = rs2.slice(-1), opts = [];
      if (I2U[l2]) opts.push(rs2.slice(0, -1) + I2U[l2]);
      opts.push(rs2 + "る");
      opts.reverse().forEach(function (rr) { out.unshift({ w: w, r: rr }); });
    }
    if (/^[おご]/.test(w) && w.length > 1) out.push({ w: w.slice(1), r: r.slice(1) });
    return out;
  }

  // ---------- Gom từ vựng của bạn ----------
  var LV_ORDER = { n5: 1, n4: 2, n3: 3 };
  var ITEMS = [], BYKEY = {};

  function addWord(rawW, rawR, mean, lv, kanjiSrc) {
    if (!rawW || !/[一-鿿]/.test(rawW)) return;
    // Ưu tiên ứng viên khớp cả chữ lẫn cách đọc; không có thì lấy ứng viên đầu tiên khớp chữ
    var cands = candidates(rawW, rawR), hit = null, pick = cands[0], loose = null;
    for (var i = 0; i < cands.length; i++) {
      var c = cands[i];
      if (!/[\u4e00-\u9fff]/.test(c.w)) continue;
      var f = lookup(c.w, c.r);
      if (!f) continue;
      if (f.exact) { hit = f; pick = c; break; }
      if (!loose) loose = { f: f, c: c };
    }
    if (!hit && loose) { hit = loose.f; pick = loose.c; }
    var dispW = pick.suru ? pick.w + "する" : pick.w;
    var dispR = pick.suru ? pick.r + "する" : pick.r;
    if (!/[一-鿿]/.test(dispW)) { dispW = clean(rawW); dispR = hira(clean(rawR)); }
    var key = dispW + "|" + dispR;
    var it = BYKEY[key];
    if (!it) {
      it = BYKEY[key] = { key: key, w: dispW, r: dispR, m: "", lvs: {}, kl: {}, rank: hit ? hit.rank : null, exact: hit ? hit.exact : true };
      ITEMS.push(it);
    }
    if (LV_ORDER[lv]) {
      it.lvs[lv] = 1;
      if (!it.mFromList) { it.m = mean || it.m; it.mFromList = true; }
    } else if (!it.m) {
      it.m = mean || "";
    }
    if (kanjiSrc) it.kl[kanjiSrc] = 1;
  }

  function firstPart(s) { return String(s || "").split(/[、,／/]/)[0].trim(); }
  (typeof vocabData !== "undefined" ? vocabData : []).forEach(function (v) {
    addWord(firstPart(v.Kanji), firstPart(v.Hiragana), v.Meaning, v.level);
  });
  var vx = window._vocabExtra || [];
  try { vx = vx.concat(JSON.parse(localStorage.getItem("vocab_extra_list")) || []); } catch (e) { }
  vx.forEach(function (v) { addWord(firstPart(v.Kanji), firstPart(v.Hiragana), v.Meaning, v.level); });
  Object.keys(KMAP).forEach(function (ch) {
    String(KMAP[ch].d.vocabulary || "").split("|").forEach(function (x) {
      var m = x.trim().match(/^(.+?)[(（](.+?)[)）]\s*[:：]\s*(.*)$/);
      if (m) addWord(m[1].trim(), m[2].trim(), m[3].trim(), "", KMAP[ch].lv);
    });
  });
  ITEMS.forEach(function (it) {
    var lvs = Object.keys(it.lvs).sort(function (a, b) { return LV_ORDER[a] - LV_ORDER[b]; });
    it.lv = lvs[0] || "";
    it.hasN3k = Array.from(it.w).some(function (c) { return KMAP[c] && KMAP[c].lv === "n3"; });
    it.search = (it.w + " " + it.r + " " + it.m).toLowerCase();
  });
  ITEMS.sort(function (a, b) {
    if (a.rank == null && b.rank == null) return a.w.localeCompare(b.w);
    if (a.rank == null) return 1;
    if (b.rank == null) return -1;
    return a.rank - b.rank || a.w.localeCompare(b.w);
  });

  // Từ theo từng kanji (đã xếp theo tần suất)
  var BYCHAR = {};
  ITEMS.forEach(function (it) {
    var seen = {};
    Array.from(it.w).forEach(function (c) {
      if (!KMAP[c] || seen[c]) return;
      seen[c] = 1;
      (BYCHAR[c] = BYCHAR[c] || []).push(it);
    });
  });

  // ---------- Trạng thái ----------
  var knownW = new N3.KnownSet("n3review_vocab_known");
  var knownK = new N3.KnownSet("n3review_kanji_known"); // dùng chung với trang Ôn kanji
  var ui = N3.load("n3review_freq_ui", { lv: "all", band: "all", hide: false, n3k: false, unknown: false, klv: "n3", kunknown: false });
  var shown = { words: PAGE, kanji: PAGE };
  var currentView = "words";
  var openK = new Set();

  function saveUi() { N3.save("n3review_freq_ui", ui); }

  var BANDS = [
    ["all", "Tất cả", null],
    ["b1", "Top 1.000", function (r) { return r != null && r <= 1000; }],
    ["b2", "1.001–3.000", function (r) { return r > 1000 && r <= 3000; }],
    ["b3", "3.001–6.000", function (r) { return r > 3000 && r <= 6000; }],
    ["b4", "6.001–12.000", function (r) { return r > 12000 ? false : r > 6000; }],
    ["b5", "> 12.000", function (r) { return r > 12000; }],
    ["none", "Chưa có hạng", function (r) { return r == null; }]
  ];
  function bandOf(r) {
    for (var i = 1; i < BANDS.length; i++) if (BANDS[i][2](r)) return BANDS[i][0];
    return "none";
  }
  var LVS = [["all", "Tất cả"], ["n5", "N5"], ["n4", "N4"], ["n3", "N3"], ["kanji", "Chỉ có trong thẻ kanji"]];

  // ---------- Từ vựng ----------
  function colorWord(w) {
    return Array.from(w).map(function (ch) {
      var k = KMAP[ch];
      if (!k) return esc(ch);
      return '<span class="w-' + k.lv + '" title="' + esc(k.d.hanviet + " – " + k.d.core_meaning) + '">' + esc(ch) + "</span>";
    }).join("");
  }

  function lvBadge(it) {
    if (it.lv) return '<span class="badge badge--' + (it.lv === "n3" ? "n3" : "n45") + '">' + it.lv.toUpperCase() + "</span>";
    var kl = Object.keys(it.kl);
    var k = kl.indexOf("n3") >= 0 ? "N3" : kl.indexOf("n45") >= 0 ? "N4/5" : "khác";
    return '<span class="badge badge--nx" title="Từ ghép trong thẻ kanji">Thẻ kanji ' + k + "</span>";
  }

  function filteredWords() {
    var q = document.getElementById("w-search").value.trim().toLowerCase();
    var band = BANDS.find(function (b) { return b[0] === ui.band; });
    return ITEMS.filter(function (it) {
      if (ui.lv === "kanji" ? it.lv : (ui.lv !== "all" && !it.lvs[ui.lv])) return false;
      if (band && band[2] && !band[2](it.rank)) return false;
      if (ui.n3k && !it.hasN3k) return false;
      if (ui.unknown && knownW.has(it.key)) return false;
      return !q || it.search.indexOf(q) >= 0;
    });
  }

  function rowHtml(it) {
    var k = knownW.has(it.key);
    var rank = it.rank == null ? "—" : "<b>" + it.rank.toLocaleString("vi-VN") + "</b>" +
      (it.exact ? "" : ' <span class="approx" title="Khớp theo chữ viết, cách đọc trong BCCWJ khác">≈</span>');
    return '<tr data-anchor="w:' + esc(it.key) + '"' + (k ? ' class="known"' : "") + '>' +
      '<td class="c-rank"><span class="band band--' + bandOf(it.rank) + '"></span>' + rank + "</td>" +
      '<td class="c-word">' + colorWord(it.w) + "</td>" +
      '<td class="c-read hideable">' + esc(it.r) + "</td>" +
      '<td class="c-mean hideable">' + esc(it.m) + "</td>" +
      '<td class="c-lv">' + lvBadge(it) + "</td>" +
      '<td class="c-ok"><button type="button" class="ok-box' + (k ? " ok-box--on" : "") + '" data-kw="' + esc(it.key) + '" title="Đánh dấu đã thuộc">' + (k ? "✓" : "") + "</button></td></tr>";
  }

  function renderChips() {
    document.getElementById("lv-chips").innerHTML = LVS.map(function (c) {
      return '<button type="button" class="chip' + (ui.lv === c[0] ? " chip--on" : "") + '" data-lv="' + c[0] + '">' + c[1] + "</button>";
    }).join("");
    document.getElementById("band-chips").innerHTML = BANDS.map(function (b) {
      return '<button type="button" class="chip' + (ui.band === b[0] ? " chip--on" : "") + '" data-band="' + b[0] + '">' +
        (b[0] !== "all" ? '<span class="band band--' + b[0] + '"></span>' : "") + b[1] + "</button>";
    }).join("");
    document.getElementById("k-chips").innerHTML = [["n3", "Kanji N3"], ["n45", "Kanji N4/N5"], ["all", "Tất cả kanji đã có"]].map(function (c) {
      return '<button type="button" class="chip' + (ui.klv === c[0] ? " chip--on" : "") + '" data-klv="' + c[0] + '">' + c[1] + "</button>";
    }).join("");
  }

  function renderWords() {
    var list = filteredWords();
    var n = Math.min(shown.words, list.length);
    document.getElementById("w-body").innerHTML = list.slice(0, n).map(rowHtml).join("") ||
      '<tr><td colspan="6" class="empty">Không có từ nào khớp.</td></tr>';
    var kn = list.filter(function (it) { return knownW.has(it.key); }).length;
    document.getElementById("w-stat").textContent = list.length.toLocaleString("vi-VN") + " từ · đang hiện " + n + (ui.unknown ? "" : " · đã thuộc " + kn);
    var more = document.getElementById("w-more");
    more.hidden = n >= list.length;
    more.textContent = "Xem thêm (" + Math.min(PAGE, list.length - n) + " / còn " + (list.length - n) + ")";
  }

  // ---------- Kanji theo tần suất ----------
  function kanjiList() {
    var q = document.getElementById("k-search").value.trim().toLowerCase();
    return Object.keys(KMAP).filter(function (ch) {
      var k = KMAP[ch];
      if (ui.klv !== "all" && k.lv !== ui.klv) return false;
      if (ui.kunknown && knownK.has(ch)) return false;
      return !q || ch === q || (k.d.hanviet + " " + k.d.core_meaning).toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) {
      var ra = KFREQ[a] || 1e9, rb = KFREQ[b] || 1e9;
      return ra - rb || a.localeCompare(b);
    });
  }

  function kRowHtml(ch) {
    var k = KMAP[ch], words = BYCHAR[ch] || [], isK = knownK.has(ch);
    var top = words.slice(0, 4).map(function (it) {
      return "<b>" + esc(it.w) + "</b>（" + esc(it.r) + "）";
    }).join("・");
    var html = '<div class="krow' + (isK ? " known" : "") + (openK.has(ch) ? " krow--open" : "") + '" data-krow="' + esc(ch) + '" data-anchor="k:' + esc(ch) + '">' +
      '<div class="krow__rank"><b>' + (KFREQ[ch] ? KFREQ[ch] : "—") + "</b>hạng</div>" +
      '<div class="krow__c w-' + k.lv + '">' + esc(ch) + "</div>" +
      '<div><span class="krow__hv">' + esc(k.d.hanviet) + "</span> " + esc(k.d.core_meaning) +
      ' <span class="badge badge--' + (k.lv === "n3" ? "n3" : k.lv === "n45" ? "n45" : "nx") + '">' + (k.lv === "n3" ? "N3" : k.lv === "n45" ? "N4/5" : "Bổ sung") + "</span>" +
      '<div class="krow__words">' + (top || "<i>chưa có từ</i>") + (words.length > 4 ? " … (+" + (words.length - 4) + ")" : "") + "</div></div>" +
      '<button type="button" class="ok-box' + (isK ? " ok-box--on" : "") + '" data-kk="' + esc(ch) + '" title="Đánh dấu kanji đã thuộc (đồng bộ với trang Ôn kanji)">' + (isK ? "✓" : "") + "</button>";
    if (openK.has(ch)) {
      html += '<div class="krow__all"><table class="ftable"><tbody>' + words.slice(0, 40).map(rowHtml).join("") + "</tbody></table></div>";
    }
    return html + "</div>";
  }

  function renderKanji() {
    var list = kanjiList();
    var n = Math.min(shown.kanji, list.length);
    document.getElementById("k-list").innerHTML = list.slice(0, n).map(kRowHtml).join("") || '<div class="empty">Không có kanji nào khớp.</div>';
    document.getElementById("k-stat").textContent = list.length + " kanji, xếp theo mức xuất hiện trong văn bản tiếng Nhật (hạng 1 = gặp nhiều nhất). Bấm vào dòng để xem mọi từ chứa chữ đó.";
    var more = document.getElementById("k-more");
    more.hidden = n >= list.length;
    more.textContent = "Xem thêm (còn " + (list.length - n) + ")";
  }

  function updateProgress() {
    var list = ITEMS.filter(function (it) { return it.rank != null && it.rank <= 6000; });
    var n = list.filter(function (it) { return knownW.has(it.key); }).length;
    var pct = list.length ? Math.round(n * 100 / list.length) : 0;
    document.getElementById("prog-fill").style.width = pct + "%";
    document.getElementById("prog-text").textContent = "Thuộc " + n + "/" + list.length + " từ trong top 6.000 (" + pct + "%)";
    document.getElementById("sub").textContent = ITEMS.length.toLocaleString("vi-VN") + " từ";
  }

  // ---------- Hướng dẫn ----------
  function renderInfo() {
    var counts = {};
    ITEMS.forEach(function (it) { var b = bandOf(it.rank); counts[b] = (counts[b] || 0) + 1; });
    document.getElementById("view-info").innerHTML = '<div class="card"><div class="card__body" style="border-top:none">' +
      "<h2>Bảng này được làm thế nào?</h2>" +
      "<ul><li><b>Từ vựng</b>: lấy từ chính dữ liệu học của bạn – bài từ vựng N5, N4, N3 và các từ ghép trong thẻ kanji. Chỉ giữ từ có kanji.</li>" +
      "<li><b>Hạng tần suất</b>: theo <b>BCCWJ</b> (Balanced Corpus of Contemporary Written Japanese – kho ngữ liệu tiếng Nhật viết hiện đại của viện NINJAL, gồm sách, báo, tạp chí, blog, văn bản hành chính…). Hạng 1 = từ xuất hiện nhiều nhất.</li>" +
      "<li>Động từ dạng <span class='jp'>〜ます</span> trong bài học được đổi về thể từ điển để tra (<span class='jp'>行きます → 行く</span>, <span class='jp'>勉強します → 勉強する</span>).</li>" +
      "<li>Dấu <span class='approx'>≈</span>: khớp theo chữ viết nhưng cách đọc trong BCCWJ khác với dữ liệu của bạn – hạng chỉ mang tính tham khảo.</li>" +
      "<li><b>Hạng kanji</b>: ước lượng bằng tổng tần suất các từ chứa chữ đó trong BCCWJ.</li>" +
      "<li>Lưu ý: BCCWJ ghi cả những từ thường viết bằng kana dưới dạng kanji (<span class='jp'>事, 物, 為る</span>), nên vài từ như <span class='jp'>事・物</span> có hạng rất cao dù trong đề thường viết <span class='jp'>こと・もの</span>.</li></ul>" +
      "<h3>Phân bố từ của bạn theo nhóm tần suất</h3>" +
      '<table class="cmp"><tr><th>Nhóm</th><th>Số từ</th><th>Gợi ý</th></tr>' +
      "<tr><td><span class='band band--b1'></span>Top 1.000</td><td>" + (counts.b1 || 0) + "</td><td>Bắt buộc thuộc, gặp ở mọi phần thi</td></tr>" +
      "<tr><td><span class='band band--b2'></span>1.001–3.000</td><td>" + (counts.b2 || 0) + "</td><td>Rất hay gặp trong đọc hiểu, nghe</td></tr>" +
      "<tr><td><span class='band band--b3'></span>3.001–6.000</td><td>" + (counts.b3 || 0) + "</td><td>Trọng tâm từ vựng N3</td></tr>" +
      "<tr><td><span class='band band--b4'></span>6.001–12.000</td><td>" + (counts.b4 || 0) + "</td><td>Hay ra ở phần chữ – từ vựng</td></tr>" +
      "<tr><td><span class='band band--b5'></span>> 12.000</td><td>" + (counts.b5 || 0) + "</td><td>Ít gặp hơn, ôn sau</td></tr>" +
      "<tr><td><span class='band band--none'></span>Chưa có hạng</td><td>" + (counts.none || 0) + "</td><td>Cụm từ, câu chào, dạng đặc biệt không tra được</td></tr></table>" +
      "<h3>Cách ôn hiệu quả</h3><ul>" +
      "<li>Ôn theo thứ tự hạng: chọn nhóm <b>Top 1.000</b> → bật <b>Che cách đọc & nghĩa</b> → nhìn chữ tự đọc, bấm vào ô bị che để kiểm tra → đúng thì tick <b>Thuộc</b>.</li>" +
      "<li>Bật <b>Ẩn từ đã thuộc</b> để danh sách chỉ còn từ cần học; vị trí đang xem được ghi nhớ khi mở lại trang.</li>" +
      "<li>Bật <b>Chỉ từ có kanji N3</b> để tập trung vào chữ mới của N3 (chữ đỏ = kanji N3, chữ xanh = kanji N4/N5).</li>" +
      "<li>Tab <b>Kanji theo tần suất</b>: học kanji N3 phổ biến trước; dấu ✓ đồng bộ với trang Ôn kanji.</li></ul>" +
      "<p class='muted' style='font-size:12.5px'>Nguồn tần suất: " + esc(META.source || "BCCWJ") + " © NINJAL – dữ liệu tạo ngày " + esc(META.generated || "") +
      " bằng <code>onThiN3/tools/build_freq.py</code>.</p></div></div>";
  }

  // ---------- Điều hướng ----------
  function switchView(v) {
    if (["words", "kanji", "info"].indexOf(v) < 0) v = "words";
    currentView = v;
    ["words", "kanji", "info"].forEach(function (x) { document.getElementById("view-" + x).hidden = x !== v; });
    document.querySelectorAll(".view-btn[data-view]").forEach(function (b) {
      b.classList.toggle("view-btn--active", b.getAttribute("data-view") === v);
    });
    if (v === "words") renderWords();
    if (v === "kanji") renderKanji();
    if (v === "info") renderInfo();
    if (mem && !mem.lock) mem.save();
  }

  function setHeadVar() {
    document.documentElement.style.setProperty("--head-h", N3.headerLine() + "px");
  }

  // ---------- Sự kiện ----------
  document.getElementById("views").addEventListener("click", function (e) {
    var b = e.target.closest("[data-view]");
    if (b) switchView(b.getAttribute("data-view"));
  });

  function resetAndRender(view) {
    shown[view] = PAGE;
    if (view === "words") renderWords(); else renderKanji();
    window.scrollTo(0, 0);
  }

  document.addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-lv]"))) { ui.lv = t.getAttribute("data-lv"); saveUi(); renderChips(); resetAndRender("words"); return; }
    if ((t = e.target.closest("[data-band]"))) { ui.band = t.getAttribute("data-band"); saveUi(); renderChips(); resetAndRender("words"); return; }
    if ((t = e.target.closest("[data-klv]"))) { ui.klv = t.getAttribute("data-klv"); saveUi(); renderChips(); resetAndRender("kanji"); return; }
    if ((t = e.target.closest("[data-kw]"))) {
      var key = t.getAttribute("data-kw");
      var on = knownW.toggle(key);
      document.querySelectorAll('[data-kw="' + key.replace(/"/g, '\\"') + '"]').forEach(function (b) {
        b.classList.toggle("ok-box--on", on);
        b.textContent = on ? "✓" : "";
        var tr = b.closest("tr");
        if (tr) tr.classList.toggle("known", on);
      });
      updateProgress();
      return;
    }
    if ((t = e.target.closest("[data-kk]"))) {
      var ch = t.getAttribute("data-kk");
      var onK = knownK.toggle(ch);
      t.classList.toggle("ok-box--on", onK);
      t.textContent = onK ? "✓" : "";
      t.closest(".krow").classList.toggle("known", onK);
      return;
    }
    if ((t = e.target.closest("[data-krow]"))) {
      if (e.target.closest(".krow__all")) return;
      var c = t.getAttribute("data-krow");
      if (openK.has(c)) openK.delete(c); else openK.add(c);
      t.outerHTML = kRowHtml(c);
      return;
    }
  });

  document.getElementById("w-more").addEventListener("click", function () { shown.words += PAGE; renderWords(); });
  document.getElementById("k-more").addEventListener("click", function () { shown.kanji += PAGE; renderKanji(); });

  // Tự tải thêm khi cuộn gần cuối
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || (mem && mem.lock)) return;
        if (en.target.id === "w-sentinel" && currentView === "words" && !document.getElementById("w-more").hidden) { shown.words += PAGE; renderWords(); }
        if (en.target.id === "k-sentinel" && currentView === "kanji" && !document.getElementById("k-more").hidden) { shown.kanji += PAGE; renderKanji(); }
      });
    }, { rootMargin: "600px 0px" });
    io.observe(document.getElementById("w-sentinel"));
    io.observe(document.getElementById("k-sentinel"));
  }

  var t1, t2;
  document.getElementById("w-search").addEventListener("input", function () { clearTimeout(t1); t1 = setTimeout(function () { resetAndRender("words"); }, 220); });
  document.getElementById("k-search").addEventListener("input", function () { clearTimeout(t2); t2 = setTimeout(function () { resetAndRender("kanji"); }, 220); });

  function bindToggle(id, prop, after) {
    var el = document.getElementById(id);
    el.checked = !!ui[prop];
    el.addEventListener("change", function () { ui[prop] = el.checked; saveUi(); after(); });
  }
  bindToggle("opt-hide", "hide", function () { document.body.classList.toggle("hide-mode", ui.hide); });
  document.body.classList.toggle("hide-mode", !!ui.hide);
  bindToggle("opt-n3k", "n3k", function () { resetAndRender("words"); });
  bindToggle("opt-unknown", "unknown", function () { renderWords(); });
  bindToggle("opt-kunknown", "kunknown", function () { renderKanji(); });

  window.addEventListener("resize", setHeadVar);

  // ---------- Khởi tạo: khôi phục tab, số dòng đã tải và vị trí ----------
  var mem = new N3.ScrollMemory("n3review_freq_pos", function () {
    return { view: currentView, shown: shown };
  });
  var saved = mem.saved || {};
  if (saved.shown) {
    shown.words = Math.max(PAGE, Number(saved.shown.words) || PAGE);
    shown.kanji = Math.max(PAGE, Number(saved.shown.kanji) || PAGE);
  }
  renderChips();
  updateProgress();
  setHeadVar();
  switchView(saved.view || "words");
  N3.addToTop();
  mem.restore();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setHeadVar);
})();
