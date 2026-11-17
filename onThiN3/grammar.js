// ===== Ôn Ngữ pháp N3 =====
(function () {
  "use strict";
  var esc = N3.esc, ruby = N3.ruby;

  var N3G = {}, BASEG = {};
  (window._grammarData || []).forEach(function (g) { N3G[g.STT] = g; });
  (typeof grammarData !== "undefined" ? grammarData : []).forEach(function (g) { BASEG[g.STT] = g; });

  var GROUPS = (window.N3_GRAMMAR_GROUPS || []).map(function (g, i) {
    return {
      id: "c" + i, no: i + 1, title: g.title,
      n3: (g.n3 || []).filter(function (s) { return N3G[s]; }),
      base: (g.base || []).filter(function (s) { return BASEG[s]; }),
      extra: g.extra || [], compare: g.compare || [], tips: g.tips || []
    };
  });
  var STT_GROUPS = {};
  GROUPS.forEach(function (g) { g.n3.forEach(function (s) { (STT_GROUPS[s] = STT_GROUPS[s] || []).push(g); }); });

  var known = new N3.KnownSet("n3review_grammar_known");
  var ui = N3.load("n3review_grammar_ui", { hide: false, furi: true, unknown: false, listFilter: "all" });
  var openSet = new Set();
  var baseOpenSet = new Set(); // cụm đang mở khung "Đã học ở N4/N5"

  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFC"); }

  // ---------- Tách dữ liệu ----------
  function splitExplain(exp) {
    var s = String(exp || "");
    var i = s.indexOf("Cách dùng:");
    if (i < 0) return { exp: s.trim(), use: [] };
    var head = s.slice(0, i).replace(/\|\s*$/, "").trim();
    var use = s.slice(i + "Cách dùng:".length).split("|").map(function (x) { return x.trim(); }).filter(Boolean);
    return { exp: head, use: use };
  }

  function splitExamples(ex) {
    return String(ex || "").split(/\s\|\s/).map(function (x) {
      x = x.trim();
      var m = x.match(/^(.*?)\s*[（(]([^（()）]*[a-zA-ZÀ-ỹ][^（()）]*)[)）]\s*$/);
      return m ? { jp: m[1], vi: m[2] } : { jp: x, vi: "" };
    }).filter(function (e) { return e.jp; });
  }

  function exHtml(list) {
    return list.map(function (e) {
      return '<div class="ex">' + ruby(e.jp) + (e.vi ? '<div class="ex__vi hideable">' + esc(e.vi) + "</div>" : "") + "</div>";
    }).join("");
  }

  function n3Item(stt, gid) {
    var g = N3G[stt], sp = splitExplain(g.Explanation), isK = known.has(stt);
    var html = '<div class="gitem" id="g3-' + (gid ? gid + "-" : "") + stt + '"' + (gid ? ' data-anchor="g:' + gid + ":" + stt + '"' : "") + '><div class="gitem__top"><div style="min-width:0;flex:1">' +
      '<div class="gitem__s">' + esc(g.Structure) + ' <span class="badge badge--n3">N3 #' + stt + "</span></div>" +
      '<div class="gitem__m hideable">' + esc(g.Meaning) + "</div></div>" +
      '<div class="gitem__right"><button type="button" class="known-btn' + (isK ? " known-btn--on" : "") + '" data-known="' + stt + '">' +
      (isK ? "✓ Đã thuộc" : "Đánh dấu thuộc") + "</button></div></div>";
    if (sp.exp) html += '<div class="gitem__exp hideable">' + esc(sp.exp) + "</div>";
    if (sp.use.length) html += '<div class="gitem__use"><b>Cách dùng:</b> ' + sp.use.map(esc).join("<br>") + "</div>";
    html += exHtml(splitExamples(g.Example));
    return html + "</div>";
  }

  function baseItem(stt, gid) {
    var g = BASEG[stt];
    var html = '<div class="gitem gitem--base"' + (gid ? ' data-anchor="b:' + gid + ":" + stt + '"' : "") + ">";
    html += '<div class="gitem__s">' + esc(g.Structure) +
      ' <span class="badge badge--n45">Minna bài ' + esc(g.Lesson) + "</span></div>" +
      '<div class="gitem__m hideable">' + esc(g.Meaning) + "</div>";
    if (g.Explanation) html += '<div class="gitem__exp hideable">' + esc(g.Explanation) + "</div>";
    return html + exHtml(splitExamples(g.Example)) + "</div>";
  }

  function extraItem(x) {
    return '<div class="gitem gitem--base"><div class="gitem__s">' + esc(x.s) + ' <span class="badge badge--' + (x.lv === "N3" ? "n3" : "n45") + '">' + esc(x.lv) +
      ' (bổ sung)</span></div><div class="gitem__m hideable">' + esc(x.m) + "</div>" + (x.ex ? exHtml(splitExamples(x.ex)) : "") + "</div>";
  }

  // ---------- Cụm ----------
  function groupCount(g) {
    return { k: g.n3.filter(function (s) { return known.has(s); }).length, t: g.n3.length };
  }

  function groupHead(g) {
    var c = groupCount(g);
    return '<div class="card__head" data-toggle="' + g.id + '"><div style="flex:1;min-width:0">' +
      '<div class="card__title">' + g.no + ". " + esc(g.title) + "</div>" +
      '<div class="card__meta">' + g.n3.length + " mẫu N3 · " + (g.base.length + g.extra.length) + " mẫu N4/N5 liên quan · " +
      (c.k === c.t ? '<span class="badge badge--ok">Thuộc ' + c.k + "/" + c.t + "</span>" : "Thuộc " + c.k + "/" + c.t) + "</div>" +
      '<div class="card__meta jp" style="margin-top:4px">' + g.n3.map(function (s) {
        return (known.has(s) ? "✓" : "") + esc(N3G[s].Structure);
      }).join("　") + "</div>" +
      '</div><span class="caret">▼</span></div>';
  }

  function groupBody(g) {
    var html = "";
    if (g.compare.length) {
      html += '<div class="section-label">Bảng so sánh nhanh</div><div class="table-scroll"><table class="cmp"><tr><th>Mẫu</th><th>Ý chính / sắc thái</th><th>Cách nối – dấu hiệu</th></tr>' +
        g.compare.map(function (r) {
          return "<tr><td>" + esc(r[0]) + '</td><td class="hideable">' + md(r[1]) + '</td><td class="jp" style="font-size:13.5px">' + md(r[2]) + "</td></tr>";
        }).join("") + "</table></div>";
    }
    if (g.tips.length) {
      html += '<div class="trap"><b>⚠️ Bẫy đề & mẹo chọn đáp án</b><ul>' + g.tips.map(function (t) { return "<li>" + md(t) + "</li>"; }).join("") + "</ul></div>";
    }
    html += '<div class="section-label">Mẫu N3 trong cụm</div>' + g.n3.map(function (st) { return n3Item(st, g.id); }).join("");
    if (g.base.length || g.extra.length) {
      html += '<details class="base-box" data-gid="' + g.id + '"' + (baseOpenSet.has(g.id) ? " open" : "") + '><summary>Đã học ở N4/N5 – cùng chủ đề, dễ nhầm (' + (g.base.length + g.extra.length) + ")</summary>" +
        g.extra.map(extraItem).join("") + g.base.map(function (st) { return baseItem(st, g.id); }).join("") + "</details>";
    }
    html += '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn btn--sm" data-quiz="' + g.id + '">🎯 Kiểm tra cụm này</button>' +
      '<button type="button" class="btn btn--ghost btn--sm" data-known-all="' + g.id + '">✓ Đánh dấu thuộc cả cụm</button></div>';
    return html;
  }

  function groupText(g) {
    if (g._text) return g._text;
    var parts = [g.title].concat(g.tips, g.compare.map(function (r) { return r.join(" "); }));
    g.n3.forEach(function (s) { var x = N3G[s]; parts.push(x.Structure, x.Meaning, x.Explanation, N3.plain(x.Example)); });
    g.base.forEach(function (s) { var x = BASEG[s]; parts.push(x.Structure, x.Meaning); });
    g.extra.forEach(function (x) { parts.push(x.s, x.m); });
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
    if (!list.length) { box.innerHTML = '<div class="empty">Không có cụm nào khớp.</div>'; return; }
    box.innerHTML = list.map(function (g) {
      var open = openSet.has(g.id);
      return '<article class="card' + (open ? "" : " card--collapsed") + '" id="card-' + g.id + '" data-anchor="c:' + g.id + '">' + groupHead(g) +
        '<div class="card__body">' + (open ? groupBody(g) : "") + "</div></article>";
    }).join("");
  }

  function refreshCard(id) {
    var g = GROUPS.find(function (x) { return x.id === id; });
    var card = document.getElementById("card-" + id);
    if (!g || !card) return;
    card.querySelector(".card__head").outerHTML = groupHead(g);
    if (openSet.has(id)) {
      // Giữ trạng thái mở của khung N4/N5
      var det = card.querySelector("details.base-box");
      var wasOpen = det && det.open;
      card.querySelector(".card__body").innerHTML = groupBody(g);
      var det2 = card.querySelector("details.base-box");
      if (det2 && wasOpen) det2.open = true;
    }
  }

  function toggleCard(id) {
    var card = document.getElementById("card-" + id);
    var g = GROUPS.find(function (x) { return x.id === id; });
    if (!card || !g) return;
    if (openSet.has(id)) {
      openSet.delete(id);
      card.classList.add("card--collapsed");
    } else {
      openSet.add(id);
      card.querySelector(".card__body").innerHTML = groupBody(g);
      card.classList.remove("card--collapsed");
    }
    if (mem) mem.save();
  }

  function updateProgress() {
    var all = Object.keys(N3G).length;
    var n = Object.keys(N3G).filter(function (s) { return known.has(s); }).length;
    var pct = all ? Math.round(n * 100 / all) : 0;
    document.getElementById("prog-fill").style.width = pct + "%";
    document.getElementById("prog-text").textContent = "Đã thuộc " + n + "/" + all + " mẫu N3 (" + pct + "%)";
    document.getElementById("sub").textContent = GROUPS.length + " cụm";
  }

  // ---------- Danh sách 110 mẫu ----------
  function renderList() {
    var chips = [["all", "Tất cả"], ["unknown", "Chưa thuộc"], ["known", "Đã thuộc"]];
    document.getElementById("list-chips").innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip' + (ui.listFilter === c[0] ? " chip--on" : "") + '" data-lf="' + c[0] + '">' + c[1] + "</button>";
    }).join("");
    var q = norm(document.getElementById("l-search").value.trim());
    var items = Object.keys(N3G).map(Number).sort(function (a, b) { return a - b; }).filter(function (s) {
      var k = known.has(s);
      if (ui.listFilter === "known" && !k) return false;
      if (ui.listFilter === "unknown" && k) return false;
      var g = N3G[s];
      return !q || norm(g.Structure + " " + g.Meaning + " " + g.Explanation).indexOf(q) >= 0;
    });
    document.getElementById("list-box").innerHTML = items.length ? items.map(function (s) {
      var g = N3G[s], gs = STT_GROUPS[s] || [];
      return '<li data-goto="' + (gs[0] ? gs[0].id : "") + '" data-stt="' + s + '" data-anchor="l:' + s + '"><span class="no">' + s + '</span><span class="s">' + esc(g.Structure) +
        '</span><span class="m">' + esc(g.Meaning) + (gs[0] ? " · <i>Cụm " + gs[0].no + "</i>" : "") + "</span>" + (known.has(s) ? '<span class="ok">✓</span>' : "") + "</li>";
    }).join("") : '<li class="empty">Không có mẫu nào.</li>';
  }

  function gotoGroup(id, stt) {
    if (!id) return;
    switchView("groups");
    document.getElementById("g-search").value = "";
    ui.unknown = false;
    document.getElementById("opt-unknown").checked = false;
    openSet.add(id);
    renderGroups();
    var el = (stt && document.getElementById("g3-" + id + "-" + stt)) || document.getElementById("card-" + id);
    if (el) { N3.scrollToEl(el); N3.flash(el); }
  }

  // ---------- Quiz ----------
  var quiz = new N3.Quiz(document.getElementById("quiz-modal"));

  // Lấy các "lõi" tiếng Nhật của 1 mẫu để điền vào chỗ trống
  function cores(structure) {
    var out = [];
    String(structure || "").replace(/[～~]/g, "").split(/[／\/]/).forEach(function (p) {
      if (/[…。]|表現|縮形/.test(p)) return; // mẫu dạng mô tả / có nhiều vế – không dùng để điền
      var withOpt = p.replace(/[（(]([^）)]*)[）)]/g, "$1");
      var noOpt = p.replace(/[（(][^）)]*[）)]/g, "");
      [withOpt, noOpt].forEach(function (x) {
        x = x.replace(/[^぀-ヿ一-鿿々ー]/g, "");
        if (x.length >= 2 && out.indexOf(x) < 0) out.push(x);
      });
    });
    return out.sort(function (a, b) { return b.length - a.length; });
  }

  // Các nhóm gần nghĩa / thay thế được cho nhau → không dùng làm đáp án nhiễu của nhau
  var SYN = [
    ["について", "につき", "に関して", "に関し", "に関する"],
    ["わけがない", "はずがない"],
    ["しかない", "ほかない", "よりない", "よりほかない", "ほかしかたがない"],
    ["もちろん", "もとより", "はもちろん", "はもとより"],
    ["くらい", "ぐらい", "くらいなら", "ぐらいなら"],
    ["につれ", "につれて", "にしたがって", "にしたがい", "とともに", "にともなって", "にともない"],
    ["ばかりでなく", "だけでなく"],
    ["みたい", "みたいだ", "よう", "ようだ", "らしい", "っぽい"],
    ["とおり", "とおりに", "どおり", "どおりに"],
    ["を通じて", "を通して"],
    ["に違いない", "に決まっている", "はずだ", "はず"],
    ["のではないだろうか", "ないかと思う", "のではないか"],
    ["てたまらない", "てならない"],
    ["にもとづいて", "にもとづき", "をもとに", "をもとにして"],
    ["に対し", "に対して"],
    ["反面", "半面"]
  ];
  function synOf(c) {
    for (var i = 0; i < SYN.length; i++) if (SYN[i].indexOf(c) >= 0) return SYN[i];
    return [c];
  }

  // Lõi của tất cả mẫu N3 kèm cụm chứa nó
  var ALL_CORES = [];
  Object.keys(N3G).forEach(function (s) {
    var gid = (STT_GROUPS[s] || [])[0];
    cores(N3G[s].Structure).forEach(function (c) { ALL_CORES.push({ c: c, s: Number(s), g: gid ? gid.id : "" }); });
  });

  function fillQuestion(stt, g) {
    var item = N3G[stt];
    var exs = N3.shuffle(splitExamples(item.Example));
    var cs = cores(item.Structure);
    for (var i = 0; i < exs.length; i++) {
      var plain = N3.plain(exs[i].jp);
      for (var j = 0; j < cs.length; j++) {
        var c = cs[j], hit = c, dropDa = false;
        if (plain.indexOf(c) < 0 && /だ$/.test(c) && plain.indexOf(c.slice(0, -1)) >= 0) { hit = c.slice(0, -1); dropDa = true; }
        var at = plain.indexOf(hit);
        if (at < 0) continue;
        if (plain.charAt(at + hit.length) === "す") continue; // tránh cắt giữa từ: もので|すから
        // Đáp án nhiễu lấy từ CỤM KHÁC (tránh trường hợp 2 đáp án cùng đúng), loại các mẫu gần nghĩa
        var syn = synOf(c).concat(synOf(hit));
        var pool = ALL_CORES.filter(function (x) { return x.g !== g.id && x.s !== stt; })
          .map(function (x) { return dropDa ? x.c.replace(/だ$/, "") : x.c; })
          .filter(function (x) { return x.length >= 2 && x !== hit && cs.indexOf(x) < 0 && syn.indexOf(x) < 0 && plain.indexOf(x) < 0; });
        var opts = [hit].concat(N3.shuffle(pool.filter(function (x, k, a) { return a.indexOf(x) === k; })).slice(0, 3));
        if (opts.length < 3) return null;
        opts = N3.shuffle(opts);
        var q = esc(plain).replace(esc(hit), '<span class="blank">（　　）</span>');
        return {
          kind: "文法形式の判断 – Điền vào chỗ trống",
          q: '<div style="font-size:19px;text-align:left">' + q + "</div>" + (exs[i].vi ? '<div class="muted" style="font-size:14px;font-family:system-ui;margin-top:6px;text-align:left">' + esc(exs[i].vi) + "</div>" : ""),
          options: opts.map(esc), answer: opts.indexOf(hit),
          explain: "<b class='jp'>" + esc(item.Structure) + "</b>: " + esc(item.Meaning) + "<br><span class='muted'>Cụm: " + esc(g.title) + "</span>"
        };
      }
    }
    return null;
  }

  function buildQuestions(groups, limit) {
    var items = [];
    groups.forEach(function (g) { g.n3.forEach(function (s) { items.push({ s: s, g: g }); }); });
    var allStt = Object.keys(N3G).map(Number);
    var qs = [];
    N3.shuffle(items).forEach(function (it) {
      var s = it.s, g = it.g, item = N3G[s];
      var mates = g.n3.filter(function (x) { return x !== s; });
      var others = N3.sample(allStt.filter(function (x) { return x !== s && mates.indexOf(x) < 0; }), 6);
      var r = Math.random(), q = null;
      if (r < 0.45) q = fillQuestion(s, g);
      if (!q) {
        var cand = N3.shuffle(mates).concat(others).slice(0, 3);
        var structs = [s].concat(cand);
        var seen = {};
        structs = structs.filter(function (x) { var k = N3G[x].Meaning; if (seen[k]) return false; seen[k] = 1; return true; });
        structs = N3.shuffle(structs);
        if (r < 0.75) {
          q = {
            kind: "Nghĩa này là mẫu nào?",
            q: '<div style="font-family:system-ui;font-size:19px">' + esc(item.Meaning) + "</div>",
            options: structs.map(function (x) { return esc(N3G[x].Structure); }), answer: structs.indexOf(s),
            explain: exHtml(splitExamples(item.Example).slice(0, 1))
          };
        } else {
          q = {
            kind: "Mẫu này nghĩa là gì?",
            q: esc(item.Structure),
            options: structs.map(function (x) { return '<span style="font-family:system-ui">' + esc(N3G[x].Meaning) + "</span>"; }), answer: structs.indexOf(s),
            explain: exHtml(splitExamples(item.Example).slice(0, 1))
          };
        }
      }
      qs.push(q);
    });
    return qs.slice(0, limit || 15);
  }

  function startQuiz(groups, title) {
    quiz.opts.regen = function () { return buildQuestions(groups, 15); };
    quiz.open(title, buildQuestions(groups, 15));
  }

  // ---------- Mẹo thi ----------
  function renderTips() {
    document.getElementById("view-tips").innerHTML =
      '<div class="card"><div class="card__body" style="border-top:none">' +
      "<h2>Cấu trúc đề JLPT N3</h2>" +
      '<div class="table-scroll"><table class="cmp"><tr><th>Phần thi</th><th>Thời gian</th><th>Điểm</th></tr>' +
      "<tr><td>言語知識（文字・語彙）</td><td>30 phút</td><td rowspan='2'>0–60 (gộp với ngữ pháp)</td></tr>" +
      "<tr><td>言語知識（文法）・読解</td><td>70 phút</td></tr>" +
      "<tr><td>読解 (tính điểm riêng)</td><td>—</td><td>0–60</td></tr>" +
      "<tr><td>聴解</td><td>40 phút</td><td>0–60</td></tr></table></div>" +
      "<p>Đỗ khi <b>tổng ≥ 95/180</b> và <b>mỗi phần ≥ 19</b>. Ngữ pháp nằm chung giờ với đọc hiểu → làm ngữ pháp nhanh để dành thời gian cho 読解.</p>" +
      "<h3>Phần ngữ pháp gồm 3 dạng</h3>" +
      '<div class="table-scroll"><table class="cmp"><tr><th>Mondai</th><th>Dạng</th><th>Câu</th><th>Thời gian nên dùng</th></tr>' +
      "<tr><td>問題1 文法形式の判断</td><td>Chọn mẫu điền vào chỗ trống</td><td>13</td><td>~6–7 phút</td></tr>" +
      "<tr><td>問題2 文の組み立て</td><td>Sắp xếp 4 thẻ, chọn thẻ ở vị trí ★</td><td>5</td><td>~5 phút</td></tr>" +
      "<tr><td>問題3 文章の文法</td><td>Điền vào đoạn văn</td><td>5</td><td>~5 phút</td></tr></table></div>" +
      "<p>⇒ Tổng ~17–20 phút cho ngữ pháp, còn ~50 phút cho đọc hiểu.</p>" +
      "<h3>問題1 – Chọn mẫu ngữ pháp</h3><ul>" +
      "<li>Đọc <b>cả câu</b>, đặc biệt là phần <b>sau chỗ trống</b>: thì (た/る), khẳng định hay phủ định, có ý chí không (ください, ましょう, つもり).</li>" +
      "<li>Kiểm tra <b>cách nối</b> trước khi xét nghĩa: Nの / Naな / Vる / Vます. Đáp án sai về cách nối có thể loại ngay.</li>" +
      "<li>Nhớ các cặp <b>hô ứng</b>: たとえ～ても, いくら～ても, まるで～ようだ, もし～たら, 必ずしも～わけではない, せっかく～のに, ～ば～ほど, ～からといって～わけではない.</li>" +
      "<li>Hội thoại: chú ý ai làm cho ai (てあげる/てくれる/てもらう), kính ngữ – khiêm nhường (いらっしゃる vs 参る).</li>" +
      "<li>Các cụm trong trang này đều có <b>bảng so sánh</b> và <b>bẫy đề</b> – hãy học theo cụm để phân biệt đáp án nhiễu.</li></ul>" +
      "<h3>問題2 – Sắp xếp câu (★)</h3><ul>" +
      "<li>Bước 1: ghép các thẻ chắc chắn đi với nhau trước (N + について, Vば + Vるほど, Vた + とたん).</li>" +
      "<li>Bước 2: tìm thẻ nối được với phần <b>ngay sau chỗ trống cuối</b> (thường là động từ/danh từ cuối câu) – thẻ đó đứng ở vị trí 4.</li>" +
      "<li>Bước 3: đánh số thứ tự cả 4 thẻ ra giấy nháp rồi mới tô ★ – tránh nhầm vị trí.</li>" +
      "<li>Trợ từ (は/が/を/に) thường đứng sau danh từ; mệnh đề định ngữ đứng ngay trước danh từ nó bổ nghĩa.</li></ul>" +
      "<h3>問題3 – Ngữ pháp trong đoạn văn</h3><ul>" +
      "<li><b>Liên từ</b>: しかし / ところが (ngược), だから / そのため (kết quả), つまり (tóm lại), それに / さらに (thêm), たとえば (ví dụ), 一方 (mặt khác).</li>" +
      "<li><b>Chỉ thị từ</b>: この/その chỉ nội dung vừa nói; あの chỉ điều người đọc và người viết cùng biết.</li>" +
      "<li><b>Góc nhìn người viết</b>: てくる (hướng về mình) / ていく (rời xa); 〜られる (bị động) khi chủ ngữ là người viết.</li>" +
      "<li>Đuôi câu văn viết: のだ / のではないだろうか / と思われる / わけだ.</li></ul>" +
      "<h3>Kế hoạch ôn với trang này</h3><ul>" +
      "<li>Mỗi ngày 2–3 cụm: đọc bảng so sánh → đọc bẫy đề → bật <b>Che nghĩa</b> và tự nói nghĩa từng mẫu → <b>🎯 Kiểm tra cụm</b>.</li>" +
      "<li>Mẫu nào nói được nghĩa + đặt được 1 câu thì <b>Đánh dấu thuộc</b>. Cuối tuần dùng <b>Ẩn cụm đã thuộc hết</b> để ôn phần còn lại.</li>" +
      "<li>Mở phần <b>Đã học ở N4/N5</b> trong mỗi cụm: đề N3 rất hay lấy mẫu N4 làm đáp án nhiễu (ために/ように, そうだ/ようだ, のに/ても).</li></ul>" +
      "</div></div>";
  }

  // ---------- Điều hướng & sự kiện ----------
  var currentView = "groups";
  function switchView(v) {
    if (["groups", "list", "tips"].indexOf(v) < 0) v = "groups";
    currentView = v;
    ["groups", "list", "tips"].forEach(function (x) { document.getElementById("view-" + x).hidden = x !== v; });
    document.querySelectorAll(".view-btn[data-view]").forEach(function (b) {
      b.classList.toggle("view-btn--active", b.getAttribute("data-view") === v);
    });
    if (v === "list") renderList();
    if (v === "tips" && !document.getElementById("view-tips").innerHTML) renderTips();
    if (mem && !mem.lock) mem.save();
  }

  function saveUi() { N3.save("n3review_grammar_ui", ui); }

  document.getElementById("views").addEventListener("click", function (e) {
    var b = e.target.closest("[data-view]");
    if (b) switchView(b.getAttribute("data-view"));
  });

  document.getElementById("quiz-all-btn").addEventListener("click", function () {
    var gs = filteredGroups();
    var unk = gs.filter(function (g) { var c = groupCount(g); return c.k < c.t; });
    startQuiz(unk.length ? unk : gs, "Kiểm tra tổng hợp");
  });

  var t1, t2;
  document.getElementById("g-search").addEventListener("input", function () { clearTimeout(t1); t1 = setTimeout(renderGroups, 200); });
  document.getElementById("l-search").addEventListener("input", function () { clearTimeout(t2); t2 = setTimeout(renderList, 200); });

  var optHide = document.getElementById("opt-hide");
  optHide.checked = !!ui.hide;
  document.body.classList.toggle("hide-mode", !!ui.hide);
  optHide.addEventListener("change", function () { ui.hide = optHide.checked; document.body.classList.toggle("hide-mode", ui.hide); saveUi(); });

  var optFuri = document.getElementById("opt-furi");
  optFuri.checked = ui.furi !== false;
  document.body.classList.toggle("no-furi", ui.furi === false);
  optFuri.addEventListener("change", function () { ui.furi = optFuri.checked; document.body.classList.toggle("no-furi", !ui.furi); saveUi(); });

  var optUnknown = document.getElementById("opt-unknown");
  optUnknown.checked = !!ui.unknown;
  optUnknown.addEventListener("change", function () { ui.unknown = optUnknown.checked; saveUi(); renderGroups(); });

  document.getElementById("expand-all").addEventListener("click", function () {
    filteredGroups().forEach(function (g) { openSet.add(g.id); });
    renderGroups();
    mem.save();
  });
  document.getElementById("collapse-all").addEventListener("click", function () { openSet.clear(); renderGroups(); mem.save(); });

  // Ghi nhớ khung "Đã học ở N4/N5" đang mở (sự kiện toggle không nổi bọt → bắt ở pha capture)
  document.addEventListener("toggle", function (e) {
    var d = e.target;
    if (!d.matches || !d.matches("details.base-box")) return;
    var gid = d.getAttribute("data-gid");
    if (d.open) baseOpenSet.add(gid); else baseOpenSet.delete(gid);
    if (mem && !mem.lock) mem.save();
  }, true);

  document.getElementById("list-chips").addEventListener("click", function (e) {
    var b = e.target.closest("[data-lf]");
    if (!b) return;
    ui.listFilter = b.getAttribute("data-lf");
    saveUi();
    renderList();
  });

  document.addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-known]"))) {
      var stt = Number(t.getAttribute("data-known"));
      known.toggle(stt);
      (STT_GROUPS[stt] || []).forEach(function (g) { refreshCard(g.id); });
      updateProgress();
      return;
    }
    if ((t = e.target.closest("[data-known-all]"))) {
      var g = GROUPS.find(function (x) { return x.id === t.getAttribute("data-known-all"); });
      var allK = g.n3.every(function (s) { return known.has(s); });
      var touched = {};
      g.n3.forEach(function (s) {
        if (known.has(s) === allK) known.toggle(s);
        (STT_GROUPS[s] || []).forEach(function (gg) { touched[gg.id] = 1; });
      });
      Object.keys(touched).forEach(refreshCard);
      updateProgress();
      return;
    }
    if ((t = e.target.closest("[data-quiz]"))) {
      var gq = GROUPS.find(function (x) { return x.id === t.getAttribute("data-quiz"); });
      startQuiz([gq], gq.no + ". " + gq.title);
      return;
    }
    if ((t = e.target.closest("[data-goto]"))) { gotoGroup(t.getAttribute("data-goto"), t.getAttribute("data-stt")); return; }
    if ((t = e.target.closest("[data-toggle]"))) toggleCard(t.getAttribute("data-toggle"));
  });

  document.addEventListener("keydown", function (e) { quiz.key(e); });

  // Khởi tạo: khôi phục tab, cụm đang mở và vị trí đã đọc
  var mem = new N3.ScrollMemory("n3review_grammar_pos", function () {
    return { view: currentView, open: Array.from(openSet), base: Array.from(baseOpenSet) };
  });
  var saved = mem.saved || {};
  var validId = function (id) { return GROUPS.some(function (g) { return g.id === id; }); };
  (saved.open || []).filter(validId).forEach(function (id) { openSet.add(id); });
  (saved.base || []).filter(validId).forEach(function (id) { baseOpenSet.add(id); });
  renderGroups();
  updateProgress();
  switchView(saved.view || "groups");
  N3.addToTop();
  mem.restore();
})();
