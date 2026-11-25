// ===== Ôn N3 theo chủ đề — engine dùng chung cho các trang topic-*.html =====
// Dữ liệu: window.N3_TOPIC = { key, title, short, kind: "vocab"|"grammar", intro, groups: [...], tips: [...] }
// Mục từ (vocab):   { w, pos, lv, m, pair, ctx, ex, vi, note, syn, fit, dis }
// Mục ngữ pháp:     { w, form, m, ex, vi, note, star, stt, syn, dis }
//   ex  : câu ví dụ, phần đáp án đặt trong ｛ ｝ (dùng cho câu hỏi điền chỗ trống)
//   pair: từ trái nghĩa (hiển thị + câu hỏi "từ trái nghĩa"); ctx: cụm ngữ cảnh khi 1 từ có nhiều từ trái nghĩa
//   syn : nhãn nhóm đồng nghĩa → các mục cùng nhãn không làm đáp án nhiễu cho nhau
//   fit : các từ khác cũng điền được vào câu ví dụ → loại khỏi đáp án nhiễu
//   dis : đáp án nhiễu viết sẵn cho câu điền chỗ trống (ưu tiên dùng)
(function () {
  "use strict";
  var T = window.N3_TOPIC;
  if (!T) return;
  var esc = N3.esc, ruby = N3.ruby, plain = N3.plain;
  var KEY = "n3topic_" + T.key;
  var IS_G = T.kind === "grammar";

  var POS = { na: "な形", i: "い形", n: "Danh từ", v: "Động từ", adv: "Phó từ", conj: "Từ nối", exp: "Cụm từ", suf: "Hậu tố", vi: "自動詞 (tự)", vt: "他動詞 (tha)" };

  var ITEMS = [], BY_ID = {};
  var GROUPS = (T.groups || []).map(function (g, gi) {
    var grp = { id: "g" + gi, no: gi + 1, title: g.title, desc: g.desc || "", tips: g.tips || [], compare: g.compare || [], head: g.head, items: [] };
    (g.items || []).forEach(function (it) {
      var id = plain(it.w) + (it.ctx ? "|" + plain(it.ctx) : "");
      while (BY_ID[id]) id += "'";
      var x = Object.assign({}, it, { id: id, gid: grp.id, gno: grp.no });
      x.base = plain(x.w).replace(/^[～~〜]/, "");
      x.ans = x.ex ? plain((x.ex.match(/｛([^｝]*)｝/) || [])[1] || "") : "";
      BY_ID[id] = x;
      ITEMS.push(x);
      grp.items.push(x);
    });
    return grp;
  });

  var known = new N3.KnownSet(KEY + "_known");
  var ui = N3.load(KEY + "_ui", { hide: false, furi: true, unknown: false, sumFilter: "all", detail: false, fs: 1 });
  var openSet = new Set();
  var openRows = new Set(); // các dòng bảng đang mở phần ví dụ

  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }
  // Văn bản có furigana + **đậm**
  function rmd(s) { return ruby(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFC"); }

  // Nghĩa tiếng Việt của từ trái nghĩa: ưu tiên mục cùng chữ trong chủ đề, sau đó bảng T.pairMeans
  // Tra theo chữ + furigana trước (辛[から]い ≠ 辛[つら]い), rồi bảng pairMeans, cuối cùng theo chữ không furigana
  var MEAN_RAW = {}, MEAN_PLAIN = {};
  ITEMS.forEach(function (x) {
    if (!MEAN_RAW[x.w]) MEAN_RAW[x.w] = x.m;
    var k = plain(x.w); if (!MEAN_PLAIN[k]) MEAN_PLAIN[k] = x.m;
  });
  function pairMean(raw) {
    var w = plain(raw);
    // Chỉ tra theo chữ không furigana khi từ trái nghĩa viết toàn kana (tránh lẫn 辛[から]い / 辛[つら]い)
    return MEAN_RAW[raw] || (T.pairMeans || {})[w] || (raw === w ? MEAN_PLAIN[w] : "") || "";
  }
  // "乱暴[らんぼう]・雑[ざつ]" → [{w: "乱暴[らんぼう]", m: "thô bạo…"}, …]
  function pairParts(pair) {
    return String(pair || "").split("・").filter(Boolean).map(function (w) { return { w: w, m: pairMean(w) }; });
  }
  // HTML: từ + (nghĩa) cho từng từ trái nghĩa; sep = ký tự ngăn cách
  function pairInline(pair, sep) {
    return pairParts(pair).map(function (p) {
      return '<span class="jp">' + ruby(p.w) + "</span>" + (p.m ? ' <span class="muted hideable pmean">' + md(p.m) + "</span>" : "");
    }).join(sep || "・");
  }
  function hl(s) { return ruby(s).replace(/｛/g, '<mark class="hl">').replace(/｝/g, "</mark>"); }
  function blank(s) { return ruby(String(s).replace(/｛[^｝]*｝/g, "\u0000")).replace("\u0000", '<span class="blank">　？　</span>'); }

  function lvBadge(lv) {
    if (!lv) return "";
    var c = lv === "N3" ? "n3" : (lv === "N4" || lv === "N5") ? "n45" : "nx";
    return '<span class="badge badge--' + c + '">' + esc(lv) + "</span>";
  }
  function stars(n) { return n ? '<span class="stars" title="Mức độ hay ra thi">' + "★★★".slice(0, n) + "☆☆☆".slice(0, 3 - n) + "</span>" : ""; }

  // ---------- Mục ----------
  function itemHtml(x) {
    var k = known.has(x.id);
    var h = '<div class="titem' + (k ? " titem--known" : "") + '" id="it-' + esc(x.id) + '" data-anchor="i:' + esc(x.id) + '">';
    h += '<div class="titem__top"><div class="titem__head">';
    h += '<span class="titem__w jp">' + ruby(x.w) + "</span>";
    if (x.ctx) h += ' <span class="titem__ctx jp">（' + ruby(x.ctx) + "）</span>";
    h += "</div>";
    h += '<button type="button" class="known-btn' + (k ? " known-btn--on" : "") + '" data-known="' + esc(x.id) + '">' + (k ? "✓ Thuộc" : "Thuộc?") + "</button></div>";
    h += '<div class="titem__badges">' + (IS_G ? stars(x.star) : "") + (x.pos ? '<span class="badge badge--type">' + esc(POS[x.pos] || x.pos) + "</span>" : "") +
      lvBadge(x.lv) + (x.stt ? '<a class="badge badge--n3" href="grammar.html" title="Xem trong trang Ôn ngữ pháp N3">N3 #' + x.stt + "</a>" : "") + "</div>";
    if (x.form) h += '<div class="titem__form jp">' + rmd(x.form) + "</div>";
    h += '<div class="titem__m hideable">' + md(x.m) + "</div>";
    if (x.pair) h += '<div class="titem__pair">↔ ' + pairInline(x.pair, " ・ ") + "</div>";
    if (x.ex) h += '<div class="ex">' + hl(x.ex) + (x.vi ? '<div class="ex__vi hideable">' + esc(x.vi) + "</div>" : "") + "</div>";
    if (x.note) h += '<div class="titem__note">💡 ' + rmd(x.note) + "</div>";
    return h + "</div>";
  }

  function groupCount(g) {
    return { k: g.items.filter(function (x) { return known.has(x.id); }).length, t: g.items.length };
  }

  function groupHead(g) {
    var c = groupCount(g);
    return '<div class="card__head" data-toggle="' + g.id + '"><div style="flex:1;min-width:0">' +
      '<div class="card__title">' + g.no + ". " + md(g.title) + "</div>" +
      '<div class="card__meta">' + g.items.length + (IS_G ? " mẫu" : " từ") + " · " +
      (c.k === c.t ? '<span class="badge badge--ok">Thuộc ' + c.k + "/" + c.t + "</span>" : "Thuộc " + c.k + "/" + c.t) + "</div>" +
      '<div class="card__meta jp" style="margin-top:4px">' + g.items.map(function (x) {
        return (known.has(x.id) ? "✓" : "") + esc(plain(x.w));
      }).join("　") + "</div>" +
      '</div><span class="caret">▼</span></div>';
  }

  function visibleItems(g) {
    return ui.unknown ? g.items.filter(function (x) { return !known.has(x.id); }) : g.items;
  }

  function groupBody(g) {
    var h = "";
    if (g.desc) h += '<p class="gdesc">' + rmd(g.desc) + "</p>";
    if (g.compare.length) {
      var head = g.head || (IS_G ? ["Mẫu", "Ý chính / sắc thái", "Dấu hiệu nhận biết"] : ["Từ", "Sắc thái", "Ví dụ / dấu hiệu"]);
      var tbl = '<div class="table-scroll"><table class="cmp"><tr>' +
        head.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr>" +
        g.compare.map(function (r) {
          return "<tr>" + r.map(function (c, i) { return "<td" + (i === 1 ? ' class="hideable"' : i > 1 ? ' class="jp"' : "") + ">" + rmd(c) + "</td>"; }).join("") + "</tr>";
        }).join("") + "</table></div>";
      h += ui.detail ? '<div class="section-label">Bảng phân biệt nhanh</div>' + tbl
        : '<details class="cmp-d"><summary>📌 Bảng phân biệt nhanh (' + g.compare.length + ")</summary>" + tbl + "</details>";
    }
    if (g.tips.length) {
      var tl = '<ul>' + g.tips.map(function (t) { return "<li>" + rmd(t) + "</li>"; }).join("") + "</ul>";
      h += ui.detail ? '<div class="trap"><b>⚠️ Bẫy đề & mẹo</b>' + tl + "</div>"
        : '<details class="trap trap-d"><summary><b>⚠️ Bẫy đề & mẹo (' + g.tips.length + ")</b></summary>" + tl + "</details>";
    }
    var vis = visibleItems(g);
    if (!vis.length) h += '<div class="empty" style="padding:16px">Đã thuộc hết nhóm này 🎉</div>';
    else h += ui.detail ? '<div class="titems">' + vis.map(itemHtml).join("") + "</div>" : tableHtml(g);
    h += '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn btn--sm" data-quiz="' + g.id + '">🎯 Kiểm tra nhóm này</button>' +
      '<button type="button" class="btn btn--ghost btn--sm" data-known-all="' + g.id + '">✓ Đánh dấu thuộc cả nhóm</button></div>';
    return h;
  }

  // ---------- Bảng gọn ----------
  // Ghép các cặp trong cùng nhóm (A.pair = B và B.pair = A) thành 1 dòng so sánh 2 cột
  function rowsOf(g) {
    if (g._rows) return g._rows;
    var withPair = g.items.filter(function (x) { return x.pair; }).length;
    g._pairMode = !IS_G && withPair * 2 >= g.items.length;
    var used = {}, rows = [];
    g.items.forEach(function (a) {
      if (used[a.id]) return;
      used[a.id] = 1;
      if (!g._pairMode) { rows.push({ key: a.id, items: [a], a: a }); return; }
      var pa = pairs(a), b = null;
      g.items.forEach(function (y) {
        if (!b && !used[y.id] && pa.indexOf(plain(y.w)) >= 0 && pairs(y).indexOf(plain(a.w)) >= 0) b = y;
      });
      if (b) used[b.id] = 1;
      var L = a, R = b, Lt = "", Rt = "";
      if (a.pos === "vt" || (b && b.pos === "vi")) { L = b; R = a; } // tự động từ luôn ở cột trái
      if (!L) Lt = a.pair; if (!R) Rt = a.pair;
      rows.push({ key: a.id, items: [L, R].filter(Boolean), L: L, R: R, Lt: Lt, Rt: Rt });
    });
    g._rows = rows;
    return rows;
  }

  function okBox(x) {
    var k = known.has(x.id);
    return '<button type="button" class="ok-box ok-box--sm' + (k ? " ok-box--on" : "") + '" data-known="' + esc(x.id) + '" aria-label="Đã thuộc">' + (k ? "✓" : "") + "</button>";
  }

  function cellHtml(x, txt) {
    if (!x) {
      if (!txt) return '<div class="pc pc--txt"><div class="pc__w">—</div></div>';
      return '<div class="pc pc--txt"><div class="pc__main">' + pairParts(txt).map(function (p) {
        return '<div class="pc__w jp">' + ruby(p.w) + "</div>" + (p.m ? '<div class="pc__m hideable">' + md(p.m) + "</div>" : "");
      }).join("") + "</div></div>";
    }
    return '<div class="pc' + (known.has(x.id) ? " pc--known" : "") + '" id="it-' + esc(x.id) + '"><div class="pc__main">' +
      '<div class="pc__w jp">' + ruby(x.w) + (x.ctx ? ' <span class="pc__ctx">（' + ruby(x.ctx) + "）</span>" : "") + "</div>" +
      '<div class="pc__m hideable">' + md(x.m) + "</div></div>" + okBox(x) + "</div>";
  }

  function detailHtml(row) {
    return row.items.map(function (x) {
      return '<div class="pdet__it"><b class="jp">' + ruby(x.w) + "</b>" +
        (x.ex ? '<div class="ex">' + hl(x.ex) + (x.vi ? '<div class="ex__vi hideable">' + esc(x.vi) + "</div>" : "") + "</div>" : "") +
        (x.note ? '<div class="titem__note">💡 ' + rmd(x.note) + "</div>" : "") + "</div>";
    }).join("");
  }

  function tableHtml(g) {
    var rows = rowsOf(g).filter(function (r) {
      return !ui.unknown || r.items.some(function (x) { return !known.has(x.id); });
    });
    var pm = g._pairMode, h;
    if (pm) {
      var ph = T.pairHead || ["Từ", "Trái nghĩa"];
      h = '<table class="ptable ptable--pair"><thead><tr><th>' + esc(ph[0]) + '</th><th class="pa"></th><th>' + esc(ph[1]) + "</th></tr></thead><tbody>";
    } else {
      h = '<table class="ptable"><thead><tr><th>' + (IS_G ? "Mẫu · cách nối" : "Từ") + "</th><th>Nghĩa</th><th class=\"pok\"></th></tr></thead><tbody>";
    }
    rows.forEach(function (r) {
      var open = openRows.has(r.key);
      var attrs = ' class="prow' + (open ? " prow--open" : "") + '" data-row="' + esc(r.key) + '" data-gid="' + g.id + '" data-anchor="i:' + esc(r.key) + '"';
      if (pm) {
        h += "<tr" + attrs + "><td>" + cellHtml(r.L, r.Lt) + '</td><td class="pa">↔</td><td>' + cellHtml(r.R, r.Rt) + "</td></tr>";
      } else {
        var x = r.a, k = known.has(x.id);
        var left = IS_G
          ? '<div class="pc__w jp">' + ruby(x.w) + " " + stars(x.star) + "</div>" + (x.form ? '<div class="pc__form jp">' + rmd(x.form) + "</div>" : "")
          : '<div class="pc__w jp">' + ruby(x.w) + "</div>";
        h += "<tr" + attrs.replace('class="prow', 'class="prow' + (k ? " prow--known" : "")) + ' id="it-' + esc(x.id) + '"><td class="pw">' + left + "</td>" +
          '<td class="pm"><span class="hideable">' + md(x.m) + "</span>" + (x.pair ? '<div class="pm__pair">↔ ' + pairInline(x.pair, " ・ ") + "</div>" : "") + "</td>" +
          '<td class="pok">' + okBox(x) + "</td></tr>";
      }
      if (open) h += '<tr class="pdet"><td colspan="3">' + detailHtml(r) + "</td></tr>";
    });
    return h + "</tbody></table>" + '<div class="muted phint">Chạm vào một dòng để xem ví dụ & ghi chú.</div>';
  }

  function groupText(g) {
    if (g._text) return g._text;
    var parts = [g.title, g.desc].concat(g.tips, g.compare.map(function (r) { return r.join(" "); }));
    g.items.forEach(function (x) { parts.push(x.w, plain(x.w), x.m, x.pair, plain(x.pair), x.ctx, x.form, plain(x.ex), x.vi, x.note); });
    g._text = norm(parts.join(" "));
    return g._text;
  }

  function filteredGroups() {
    var q = norm(document.getElementById("g-search").value.trim());
    return GROUPS.filter(function (g) {
      if (ui.unknown) { var c = groupCount(g); if (c.k === c.t) return false; }
      return !q || groupText(g).indexOf(q) >= 0;
    });
  }

  function renderGroups() {
    var list = filteredGroups();
    var box = document.getElementById("group-list");
    if (!list.length) { box.innerHTML = '<div class="empty">Không có nhóm nào khớp.</div>'; updateNextBtn(); return; }
    box.innerHTML = list.map(function (g) {
      var open = openSet.has(g.id);
      return '<article class="card' + (open ? "" : " card--collapsed") + '" id="card-' + g.id + '" data-anchor="c:' + g.id + '">' + groupHead(g) +
        '<div class="card__body">' + (open ? groupBody(g) : "") + "</div></article>";
    }).join("");
    updateNextBtn();
  }

  function refreshCard(id) {
    var g = GROUPS.find(function (x) { return x.id === id; });
    var card = document.getElementById("card-" + id);
    if (!g || !card) return;
    card.querySelector(".card__head").outerHTML = groupHead(g);
    if (openSet.has(id)) card.querySelector(".card__body").innerHTML = groupBody(g);
  }

  function toggleCard(id, forceOpen) {
    var card = document.getElementById("card-" + id);
    var g = GROUPS.find(function (x) { return x.id === id; });
    if (!card || !g) return;
    if (openSet.has(id) && !forceOpen) {
      openSet.delete(id);
      card.classList.add("card--collapsed");
    } else {
      openSet.add(id);
      card.querySelector(".card__body").innerHTML = groupBody(g);
      card.classList.remove("card--collapsed");
    }
    if (mem && !mem.lock) mem.save();
    updateNextBtn();
  }

  function updateProgress() {
    var n = ITEMS.filter(function (x) { return known.has(x.id); }).length, all = ITEMS.length;
    var pct = all ? Math.round(n * 100 / all) : 0;
    document.getElementById("prog-fill").style.width = pct + "%";
    document.getElementById("prog-text").textContent = "Đã thuộc " + n + "/" + all + (IS_G ? " mẫu" : " từ") + " (" + pct + "%)";
    document.getElementById("sub").textContent = GROUPS.length + " nhóm · " + all + (IS_G ? " mẫu" : " từ");
  }

  // ---------- Bảng tóm tắt ----------
  function renderSummary() {
    var chips = [["all", "Tất cả"], ["unknown", "Chưa thuộc"], ["known", "Đã thuộc"]];
    document.getElementById("sum-chips").innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip' + (ui.sumFilter === c[0] ? " chip--on" : "") + '" data-sf="' + c[0] + '">' + c[1] + "</button>";
    }).join("");
    var q = norm(document.getElementById("s-search").value.trim());
    var cols = IS_G ? ["Mẫu", "Nghĩa", "Cách nối"] : ["Từ", "Nghĩa", "Trái nghĩa"];
    var html = "";
    GROUPS.forEach(function (g) {
      var rows = g.items.filter(function (x) {
        var k = known.has(x.id);
        if (ui.sumFilter === "known" && !k) return false;
        if (ui.sumFilter === "unknown" && k) return false;
        return !q || norm([x.w, plain(x.w), x.m, x.pair, plain(x.pair), x.form].join(" ")).indexOf(q) >= 0;
      });
      if (!rows.length) return;
      html += '<div class="section-label" data-anchor="s:' + g.id + '">' + g.no + ". " + md(g.title) + "</div>";
      html += '<div class="table-scroll"><table class="cmp sumt"><tr>' + cols.map(function (c) { return "<th>" + c + "</th>"; }).join("") + '<th style="width:40px">✓</th></tr>' +
        rows.map(function (x) {
          var k = known.has(x.id);
          return '<tr data-goto="' + esc(x.id) + '"' + (k ? ' class="known"' : "") + "><td>" + ruby(x.w) + (x.ctx ? ' <span class="muted">（' + ruby(x.ctx) + "）</span>" : "") + "</td>" +
            '<td class="hideable">' + md(x.m) + "</td>" +
            '<td>' + (IS_G ? '<span class="jp">' + rmd(x.form || "") + "</span>" : pairInline(x.pair || "", "<br>")) + "</td>" +
            '<td style="text-align:center"><button type="button" class="ok-box' + (k ? " ok-box--on" : "") + '" data-known="' + esc(x.id) + '" aria-label="Đã thuộc">' + (k ? "✓" : "") + "</button></td></tr>";
        }).join("") + "</table></div>";
    });
    document.getElementById("sum-box").innerHTML = html || '<div class="empty">Không có mục nào.</div>';
  }

  function gotoItem(id) {
    var x = BY_ID[id];
    if (!x) return;
    switchView("groups");
    document.getElementById("g-search").value = "";
    if (ui.unknown && known.has(id)) { ui.unknown = false; document.getElementById("opt-unknown").checked = false; saveUi(); }
    openSet.add(x.gid);
    renderGroups();
    var el = document.getElementById("it-" + id) || document.getElementById("card-" + x.gid);
    if (el) { N3.scrollToEl(el); N3.flash(el); }
  }

  // ---------- Mẹo thi ----------
  function renderTips() {
    var h = T.intro ? '<div class="tip">' + rmd(T.intro) + "</div>" : "";
    (T.tips || []).forEach(function (s) {
      h += '<div class="card"><div class="card__body" style="border-top:none"><h2>' + md(s.h) + "</h2>";
      if (s.p) h += "<p>" + rmd(s.p) + "</p>";
      if (s.li) h += "<ul>" + s.li.map(function (t) { return "<li>" + rmd(t) + "</li>"; }).join("") + "</ul>";
      h += "</div></div>";
    });
    document.getElementById("view-tips").innerHTML = h;
  }

  // ---------- Quiz ----------
  var quiz = null; // tạo sau khi shell() dựng modal
  var lastQuizItems = [];

  // "乱暴[らんぼう]・雑[ざつ]" → ["乱暴", "雑"]
  function pairs(x) { return x.pair ? plain(x.pair).split("・").filter(Boolean) : []; }
  function isSyn(a, b) { return a === b || (a.syn && b.syn && a.syn === b.syn) || a.base === b.base; }
  function label(x) { return IS_G ? plain(x.w) : x.base; }

  // Lấy n đáp án nhiễu từ pool (ưu tiên khác nhóm), không trùng nhãn, không đồng nghĩa
  function pickDistractors(x, n, getLabel, preferOtherGroup, extraOk) {
    var used = {}, out = [];
    used[getLabel(x)] = 1;
    var fit = (x.fit || []).map(plain);
    function ok(y) {
      if (isSyn(x, y)) return false;
      var l = getLabel(y);
      if (!l || used[l] || fit.indexOf(l) >= 0 || fit.indexOf(y.base) >= 0) return false;
      return extraOk ? extraOk(y) : true;
    }
    var pools = preferOtherGroup
      ? [ITEMS.filter(function (y) { return y.gid !== x.gid && (!x.pos || y.pos === x.pos); }),
         ITEMS.filter(function (y) { return y.gid !== x.gid; })]
      : [ITEMS.filter(function (y) { return y.gid === x.gid; }), ITEMS.filter(function (y) { return y.gid !== x.gid && (!x.pos || y.pos === x.pos); }), ITEMS];
    pools.forEach(function (p) {
      N3.shuffle(p).forEach(function (y) {
        if (out.length < n && ok(y)) { used[getLabel(y)] = 1; out.push(getLabel(y)); }
      });
    });
    return out;
  }

  function mkQ(kind, q, answer, wrongs, explain, html, minW) {
    if (wrongs.length < (minW || 2)) return null;
    var opts = N3.shuffle([answer].concat(wrongs.slice(0, 3)));
    return { kind: kind, q: q, options: opts.map(function (o) { return html ? o : '<span class="jp">' + ruby(o) + "</span>"; }), answer: opts.indexOf(answer), explain: explain };
  }

  function explainOf(x) {
    return '<b class="jp">' + ruby(x.w) + "</b>" + (x.form ? ' <span class="muted jp">' + rmd(x.form) + "</span>" : "") + " – " + md(x.m) +
      (x.pair ? "<br>↔ " + pairInline(x.pair, " ・ ") : "") +
      (x.ex ? '<div class="ex">' + hl(x.ex) + (x.vi ? '<div class="ex__vi">' + esc(x.vi) + "</div>" : "") + "</div>" : "") +
      (x.note ? '<div class="muted" style="margin-top:6px">💡 ' + rmd(x.note) + "</div>" : "");
  }

  function questionsFor(x) {
    var out = [], ex = explainOf(x);
    // 1) Điền vào chỗ trống (文脈規定)
    if (x.ex && x.ans) {
      var surf = IS_G || T.fillSurface;
      var ans = surf ? x.ans : x.base;
      var wr = (x.dis && x.dis.length >= 3) ? x.dis.slice() : (T.binary && x.pa) ? [x.pa] : [];
      if (!wr.length) {
        // Từ cặp (trái nghĩa / tự–tha) là đáp án nhiễu "đắt" nhất
        if (x.pair) { var pp = surf ? (x.pa || "") : pairs(x)[0]; if (pp && pp !== ans) wr.push(pp); }
        pickDistractors(x, 3, function (y) { return surf ? y.ans : y.base; }, true, function (y) {
          return (!surf || !!y.ans) && wr.indexOf(surf ? y.ans : y.base) < 0;
        }).forEach(function (l) { if (wr.length < 3) wr.push(l); });
      }
      out.push(mkQ(IS_G ? "Chọn mẫu ngữ pháp điền vào chỗ trống" : T.binary ? "Tự hay tha? Nhìn trợ từ が／を và đuôi câu" : "Chọn từ thích hợp điền vào chỗ trống" + (!T.fillSurface && plain(x.ans) !== x.base ? " (đáp án ghi ở dạng gốc)" : ""),
        blank(x.ex), ans, wr, ex, false, T.binary ? 1 : 2));
    }
    // 2) Nghĩa → từ
    out.push(mkQ(IS_G ? "Mẫu nào mang nghĩa này?" : "Từ nào mang nghĩa này?", '<span style="font-family:system-ui,sans-serif;font-size:0.86em">' + md(x.m) + "</span>" +
      (x.ctx ? '<div class="muted" style="font-size:0.64em">（' + ruby(x.ctx) + "）</div>" : ""),
      label(x), pickDistractors(x, 3, label, false), ex));
    // 3) Từ → nghĩa
    var mq = mkQ("Nghĩa đúng là?", '<span class="jp" style="font-size:1.27em">' + ruby(x.w) + "</span>" + (x.ctx ? '<div class="muted jp" style="font-size:0.68em">（' + ruby(x.ctx) + "）</div>" : ""),
      md(x.m), pickDistractors(x, 3, function (y) { return md(y.m); }, false), ex, true);
    out.push(mq);
    // 4) Trái nghĩa
    if (x.pair) {
      var pl = pairs(x), a = pl[0];
      var wr2 = [], seen = {};
      pl.forEach(function (l) { seen[l] = 1; });
      seen[x.base] = 1;
      (x.alt || []).forEach(function (l) { seen[plain(l)] = 1; }); // các từ trái nghĩa khác cũng đúng
      // Ưu tiên: từ trái nghĩa khác của chính từ này (bẫy 1 từ nhiều nghĩa), rồi các từ/trái nghĩa cùng loại từ
      ITEMS.filter(function (y) { return y.base === x.base && y !== x && y.pair; }).forEach(function (y) {
        var l = pairs(y)[0]; if (!seen[l]) { seen[l] = 1; wr2.push(l); }
      });
      N3.shuffle(ITEMS.filter(function (y) { return y !== x && y.pos === x.pos; })).forEach(function (y) {
        if (isSyn(x, y)) return;
        [y.base, pairs(y)[0]].forEach(function (l) {
          if (l && !seen[l] && wr2.length < 3) { seen[l] = 1; wr2.push(l); }
        });
      });
      out.push(mkQ(T.pairQ || "Từ trái nghĩa là?", '<span class="jp" style="font-size:1.18em">' + ruby(x.ctx || x.w) + "</span><div class=\"muted\" style=\"font-size:0.64em\">⇄ ？</div>",
        a, wr2, ex));
    }
    return out.filter(Boolean);
  }

  function buildQuestions(items) {
    var qs = [];
    N3.shuffle(items).forEach(function (x) {
      var list = questionsFor(x);
      // Mỗi mục 1 câu: ưu tiên điền chỗ trống / trái nghĩa (giống đề thật), đôi khi hỏi nghĩa
      var pref = list.filter(function (q) { return /chỗ trống|trái nghĩa/.test(q.kind); });
      var pick = (pref.length && Math.random() < 0.75) ? N3.sample(pref, 1)[0] : N3.sample(list, 1)[0];
      if (pick) qs.push(pick);
    });
    return qs.slice(0, 20);
  }

  function startQuiz(items, title) {
    var unk = items.filter(function (x) { return !known.has(x.id); });
    lastQuizItems = unk.length >= 4 ? unk : items;
    quiz.open(title, buildQuestions(lastQuizItems));
  }

  // ---------- Nút "tới mục chưa thuộc" ----------
  var nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "fab-next";
  document.body.appendChild(nextBtn);

  function unknownTargets() {
    var out = [];
    filteredGroups().forEach(function (g) {
      g.items.forEach(function (x, idx) { if (!known.has(x.id)) out.push({ gid: g.id, id: x.id, idx: idx }); });
    });
    return out;
  }
  function targetEl(t) {
    return (openSet.has(t.gid) && document.getElementById("it-" + t.id)) || document.getElementById("card-" + t.gid);
  }
  function updateNextBtn() {
    if (currentView !== "groups") { nextBtn.hidden = true; return; }
    var n = unknownTargets().length;
    nextBtn.hidden = false;
    nextBtn.textContent = n ? "↓ Chưa thuộc (" + n + ")" : "✓ Đã thuộc hết";
  }
  function goNextUnknown() {
    var targets = unknownTargets();
    if (!targets.length) { N3.toast("Đã thuộc hết các mục trong danh sách đang lọc 🎉"); return; }
    var line = N3.headerLine() + 14, pick = null;
    for (var i = 0; i < targets.length; i++) {
      var el = targetEl(targets[i]);
      if (!el) continue;
      var top = el.getBoundingClientRect().top + (el.classList.contains("card") ? targets[i].idx * 0.01 : 0);
      if (top > line) { pick = targets[i]; break; }
    }
    if (!pick) { pick = targets[0]; N3.toast("Đã hết mục chưa thuộc phía dưới – quay lại từ đầu"); }
    if (!openSet.has(pick.gid)) toggleCard(pick.gid, true);
    var dest = targetEl(pick);
    if (!dest) return;
    N3.scrollToEl(dest);
    N3.flash(dest);
  }
  nextBtn.addEventListener("click", goNextUnknown);

  // ---------- Điều hướng & sự kiện ----------
  var currentView = "groups", mem = null;
  var VIEWS = ["groups", "summary", "tips"];
  function switchView(v) {
    if (VIEWS.indexOf(v) < 0) v = "groups";
    currentView = v;
    VIEWS.forEach(function (x) { document.getElementById("view-" + x).hidden = x !== v; });
    document.querySelectorAll(".view-btn[data-view]").forEach(function (b) {
      b.classList.toggle("view-btn--active", b.getAttribute("data-view") === v);
    });
    if (v === "summary") renderSummary();
    if (v === "tips" && !document.getElementById("view-tips").innerHTML) renderTips();
    updateNextBtn();
    if (mem && !mem.lock) mem.save();
  }

  function saveUi() { N3.save(KEY + "_ui", ui); }

  // Dựng khung trang (header, các tab, toolbar) để file HTML của từng chủ đề chỉ cần nạp dữ liệu
  function shell() {
    document.title = T.short ? "Ôn N3 – " + T.short : "Ôn N3";
    document.getElementById("app").innerHTML =
      '<header class="top"><div class="top__row">' +
      '<a class="top__back" href="topics.html">← Chủ đề</a>' +
      '<h1 class="top__title">' + rmd(T.title) + ' <small id="sub"></small></h1>' +
      '<div class="fs-ctl" title="Cỡ chữ"><button type="button" data-fs="-1" aria-label="Giảm cỡ chữ">A−</button>' +
      '<span id="fs-val">100%</span><button type="button" data-fs="1" aria-label="Tăng cỡ chữ">A+</button></div></div>' +
      '<div class="progress"><div class="progress__bar"><div class="progress__fill" id="prog-fill"></div></div><span id="prog-text"></span></div>' +
      '<nav class="views" id="views">' +
      '<button type="button" class="view-btn view-btn--active" data-view="groups">📚 Theo nhóm</button>' +
      '<button type="button" class="view-btn" data-view="summary">📋 Bảng tóm tắt</button>' +
      '<button type="button" class="view-btn" data-view="tips">💡 Mẹo thi</button>' +
      '<button type="button" class="view-btn" id="quiz-all-btn">🎯 Kiểm tra</button>' +
      "</nav></header>" +
      '<main class="wrap">' +
      '<section id="view-groups"><div class="toolbar"><input type="search" class="search" id="g-search" placeholder="Tìm từ, nghĩa, ví dụ…"></div>' +
      '<div class="toolbar">' +
      '<label class="toggle"><input type="checkbox" id="opt-hide"> Che nghĩa (tự kiểm tra)</label>' +
      '<label class="toggle"><input type="checkbox" id="opt-furi"> Furigana</label>' +
      '<label class="toggle"><input type="checkbox" id="opt-unknown"> Ẩn mục đã thuộc</label>' +
      '<label class="toggle"><input type="checkbox" id="opt-detail"> Dạng thẻ chi tiết</label>' +
      '<button type="button" class="btn btn--ghost btn--sm" id="expand-all">Mở tất cả</button>' +
      '<button type="button" class="btn btn--ghost btn--sm" id="collapse-all">Thu gọn</button></div>' +
      '<div id="group-list"></div></section>' +
      '<section id="view-summary" hidden><div class="toolbar"><input type="search" class="search" id="s-search" placeholder="Lọc bảng…"></div>' +
      '<div class="chips" id="sum-chips"></div><div class="card" style="padding:4px 12px 12px" id="sum-box"></div></section>' +
      '<section id="view-tips" class="guide" hidden></section></main>' +
      '<div class="modal" id="quiz-modal"><div class="modal__backdrop"></div><div class="modal__dialog">' +
      '<button type="button" class="modal__close" aria-label="Đóng">×</button><div class="modal__body"></div></div></div>';
  }

  shell();
  quiz = new N3.Quiz(document.getElementById("quiz-modal"), { regen: function () { return buildQuestions(lastQuizItems); } });

  document.getElementById("views").addEventListener("click", function (e) {
    var b = e.target.closest("[data-view]");
    if (b) switchView(b.getAttribute("data-view"));
  });

  document.getElementById("quiz-all-btn").addEventListener("click", function () {
    var items = [];
    filteredGroups().forEach(function (g) { items = items.concat(g.items); });
    startQuiz(items.length ? items : ITEMS, "Kiểm tra tổng hợp – " + (T.short || ""));
  });

  var t1, t2;
  document.getElementById("g-search").addEventListener("input", function () { clearTimeout(t1); t1 = setTimeout(renderGroups, 200); });
  document.getElementById("s-search").addEventListener("input", function () { clearTimeout(t2); t2 = setTimeout(renderSummary, 200); });

  var optHide = document.getElementById("opt-hide");
  optHide.checked = !!ui.hide;
  document.body.classList.toggle("hide-mode", !!ui.hide);
  optHide.addEventListener("change", function () { ui.hide = optHide.checked; document.body.classList.toggle("hide-mode", ui.hide); saveUi(); });

  var optFuri = document.getElementById("opt-furi");
  optFuri.checked = ui.furi !== false;
  document.body.classList.toggle("no-furi", ui.furi === false);
  optFuri.addEventListener("change", function () { ui.furi = optFuri.checked; document.body.classList.toggle("no-furi", !ui.furi); saveUi(); });

  // ---------- Cỡ chữ ----------
  var FS = [0.85, 1, 1.15, 1.3, 1.5, 1.75, 2];
  function applyFs() {
    var v = Number(ui.fs) || 1;
    if (FS.indexOf(v) < 0) v = 1;
    ui.fs = v;
    document.documentElement.style.setProperty("--fs", v);
    document.getElementById("fs-val").textContent = Math.round(v * 100) + "%";
  }
  applyFs();
  document.querySelector(".fs-ctl").addEventListener("click", function (e) {
    var b = e.target.closest("[data-fs]");
    if (!b) return;
    var i = FS.indexOf(ui.fs) + Number(b.getAttribute("data-fs"));
    ui.fs = FS[Math.max(0, Math.min(FS.length - 1, i))];
    applyFs();
    saveUi();
  });

  var optDetail = document.getElementById("opt-detail");
  optDetail.checked = !!ui.detail;
  optDetail.addEventListener("change", function () { ui.detail = optDetail.checked; saveUi(); renderGroups(); });

  var optUnknown = document.getElementById("opt-unknown");
  optUnknown.checked = !!ui.unknown;
  optUnknown.addEventListener("change", function () { ui.unknown = optUnknown.checked; saveUi(); renderGroups(); });

  document.getElementById("expand-all").addEventListener("click", function () {
    filteredGroups().forEach(function (g) { openSet.add(g.id); });
    renderGroups();
    mem.save();
  });
  document.getElementById("collapse-all").addEventListener("click", function () { openSet.clear(); renderGroups(); mem.save(); });

  document.getElementById("sum-chips").addEventListener("click", function (e) {
    var b = e.target.closest("[data-sf]");
    if (!b) return;
    ui.sumFilter = b.getAttribute("data-sf");
    saveUi();
    renderSummary();
  });

  document.addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-known]"))) {
      var id = t.getAttribute("data-known");
      known.toggle(id);
      if (BY_ID[id]) refreshCard(BY_ID[id].gid);
      if (currentView === "summary") renderSummary();
      updateProgress();
      updateNextBtn();
      return;
    }
    if ((t = e.target.closest("[data-known-all]"))) {
      var g = GROUPS.find(function (x) { return x.id === t.getAttribute("data-known-all"); });
      var allK = g.items.every(function (x) { return known.has(x.id); });
      g.items.forEach(function (x) { if (known.has(x.id) === allK) known.toggle(x.id); });
      refreshCard(g.id);
      updateProgress();
      updateNextBtn();
      return;
    }
    if ((t = e.target.closest("[data-quiz]"))) {
      var gq = GROUPS.find(function (x) { return x.id === t.getAttribute("data-quiz"); });
      startQuiz(gq.items, gq.no + ". " + plain(gq.title).replace(/\*\*/g, ""));
      return;
    }
    if ((t = e.target.closest("[data-row]"))) {
      var rk = t.getAttribute("data-row");
      if (openRows.has(rk)) openRows.delete(rk); else openRows.add(rk);
      refreshCard(t.getAttribute("data-gid"));
      return;
    }
    if ((t = e.target.closest("[data-goto]"))) { gotoItem(t.getAttribute("data-goto")); return; }
    if ((t = e.target.closest("[data-toggle]"))) toggleCard(t.getAttribute("data-toggle"));
  });

  document.addEventListener("keydown", function (e) { quiz.key(e); });

  // Khởi tạo: khôi phục tab, nhóm đang mở và vị trí đã đọc
  mem = new N3.ScrollMemory(KEY + "_pos", function () {
    return { view: currentView, open: Array.from(openSet) };
  });
  var saved = mem.saved || {};
  (saved.open || []).forEach(function (id) { if (GROUPS.some(function (g) { return g.id === id; })) openSet.add(id); });
  if (!saved.open && GROUPS[0]) openSet.add(GROUPS[0].id);
  renderGroups();
  updateProgress();
  switchView(saved.view || "groups");
  N3.addToTop();
  mem.restore();

  window.N3T = { items: ITEMS, groups: GROUPS, questionsFor: questionsFor, buildQuestions: buildQuestions };
})();
