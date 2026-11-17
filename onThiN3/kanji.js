// ===== Ôn Kanji N3 =====
(function () {
  "use strict";
  var esc = N3.esc;

  var TYPES = {
    am: "Cùng thanh phù → cùng âm On",
    giong: "Na ná – dễ nhầm",
    kun: "Cùng âm Kun (bẫy 表記)",
    bo: "Cùng bộ / chủ đề",
    doi: "Cặp trái nghĩa"
  };
  var TYPE_SHORT = { am: "Thanh phù", giong: "Na ná", kun: "Âm Kun", bo: "Bộ/Chủ đề", doi: "Trái nghĩa" };

  // ---------- Dữ liệu kanji ----------
  var KMAP = {}; // kanji -> {info, lv: 'n3'|'n45'|'nx'}
  function addKanji(list, lv) {
    (list || []).forEach(function (k) {
      if (!k || !k.kanji || KMAP[k.kanji]) return;
      KMAP[k.kanji] = { d: k, lv: lv };
    });
  }
  var extra = window._kanjiExtra || [];
  try { extra = extra.concat(JSON.parse(localStorage.getItem("kanji_extra_list")) || []); } catch (e) { }
  addKanji(extra.filter(function (k) { return k.level === "n3"; }), "n3");
  addKanji(typeof kanjiData !== "undefined" ? kanjiData : [], "n45");
  addKanji(extra.filter(function (k) { return k.level !== "n3"; }), "nx");
  var FB = window.N3_KANJI_FALLBACK || {};
  Object.keys(FB).forEach(function (ch) {
    if (KMAP[ch]) return;
    KMAP[ch] = { d: { kanji: ch, hanviet: FB[ch][0], core_meaning: FB[ch][1], on_reading: FB[ch][2], kun_reading: FB[ch][3], vocabulary: "" }, lv: "fb" };
  });

  var N3_LIST = extra.filter(function (k) { return k.level === "n3"; })
    .sort(function (a, b) { return a.stt - b.stt; })
    .filter(function (k, i, arr) { return arr.findIndex(function (x) { return x.kanji === k.kanji; }) === i; });

  // ---------- Từ vựng: index theo từng chữ kanji ----------
  var VIDX = {};
  function addVocab(list) {
    (list || []).forEach(function (v) {
      var w = String(v.Kanji || "").split(/[、,／/・\s]/)[0].replace(/[〜~（(].*$/, "");
      if (!w || !/[一-鿿]/.test(w) || !v.Hiragana) return;
      var item = { w: w, r: String(v.Hiragana).split(/[、,／/]/)[0], m: v.Meaning || "", lv: v.level || "" };
      var seen = {};
      for (var i = 0; i < w.length; i++) {
        var ch = w[i];
        if (!N3.isKanji(ch) || seen[ch]) continue;
        seen[ch] = 1;
        (VIDX[ch] = VIDX[ch] || []).push(item);
      }
    });
  }
  addVocab(typeof vocabData !== "undefined" ? vocabData : []);
  var vx = window._vocabExtra || [];
  try { vx = vx.concat(JSON.parse(localStorage.getItem("vocab_extra_list")) || []); } catch (e) { }
  addVocab(vx);
  var LV_ORDER = { n5: 0, n4: 1, n3: 2 };
  Object.keys(VIDX).forEach(function (ch) {
    var seen = {};
    VIDX[ch] = VIDX[ch].filter(function (it) {
      if (seen[it.w]) return false;
      seen[it.w] = 1;
      return true;
    }).sort(function (a, b) {
      return ((LV_ORDER[a.lv] != null ? LV_ORDER[a.lv] : 3) - (LV_ORDER[b.lv] != null ? LV_ORDER[b.lv] : 3)) || a.w.length - b.w.length;
    });
  });

  function parseVocabField(s) {
    return String(s || "").split("|").map(function (x) {
      var m = x.trim().match(/^(.+?)[(（](.+?)[)）]\s*[:：]\s*(.*)$/);
      return m ? { w: m[1].trim(), r: m[2].trim(), m: m[3].trim() } : null;
    }).filter(Boolean);
  }

  // Từ vựng của 1 chữ: từ trong data kanji + từ trong bộ từ vựng N5/N4/N3 chứa chữ đó
  function wordsOf(ch, max) {
    var k = KMAP[ch];
    var list = k ? parseVocabField(k.d.vocabulary) : [];
    var seen = {};
    list.forEach(function (x) { seen[x.w] = 1; });
    var more = (VIDX[ch] || []).filter(function (x) { return !seen[x.w]; });
    return { own: list, more: more.slice(0, max || 6), moreTotal: more.length };
  }

  // ---------- Nhóm ----------
  var GROUPS = (window.N3_KANJI_GROUPS || []).map(function (g, i) {
    var chars = Array.from(g[3]).filter(function (c, idx, a) { return a.indexOf(c) === idx; });
    return { id: "g" + i, type: g[0], title: g[1], on: g[2], chars: chars, tip: [].concat(g[4] || []) };
  });
  var CHAR_GROUPS = {};
  GROUPS.forEach(function (g) {
    g.chars.forEach(function (c) { (CHAR_GROUPS[c] = CHAR_GROUPS[c] || []).push(g); });
  });

  // ---------- Trạng thái ----------
  var known = new N3.KnownSet("n3review_kanji_known");
  var ui = N3.load("n3review_kanji_ui", { type: "all", hide: false, unknown: false, allFilter: "all" });
  var openSet = new Set();

  function lvOf(ch) { return KMAP[ch] ? KMAP[ch].lv : "none"; }
  function n3CharsOf(g) { return g.chars.filter(function (c) { return lvOf(c) === "n3"; }); }

  function updateProgress() {
    var n = N3_LIST.filter(function (k) { return known.has(k.kanji); }).length;
    var pct = N3_LIST.length ? Math.round(n * 100 / N3_LIST.length) : 0;
    document.getElementById("prog-fill").style.width = pct + "%";
    document.getElementById("prog-text").textContent = "Đã thuộc " + n + "/" + N3_LIST.length + " chữ N3 (" + pct + "%)";
    document.getElementById("sub").textContent = GROUPS.length + " cụm";
  }

  // ---------- Render helpers ----------
  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }

  // Tô màu từng chữ trong từ theo cấp độ, kèm Hán Việt khi rê chuột
  function colorWord(w) {
    return Array.from(w).map(function (ch) {
      var k = KMAP[ch];
      if (!k || k.lv === "fb") return esc(ch);
      var cls = k.lv === "n3" ? "w-n3" : k.lv === "n45" ? "w-n45" : "w-nx";
      return '<span class="' + cls + '" data-k="' + esc(ch) + '" title="' + esc(k.d.hanviet + " – " + k.d.core_meaning) + '">' + esc(ch) + "</span>";
    }).join("");
  }

  function lvBadge(lv) {
    if (lv === "n3") return '<span class="badge badge--n3">N3</span>';
    if (lv === "n45") return '<span class="badge badge--n45">N4/5</span>';
    if (lv === "nx") return '<span class="badge badge--nx">Bổ sung</span>';
    return '<span class="badge badge--type">Tham khảo</span>';
  }

  function vocabChip(x, lv) {
    var lvTxt = lv ? '<span class="vw__lv' + (lv === "n3" ? " vw__lv--n3" : "") + '">' + esc(lv.toUpperCase()) + "</span>" : "";
    return '<span class="vw"><span class="vw__w">' + colorWord(x.w) + '</span><span class="vw__r hideable">' + esc(x.r) +
      "</span>" + lvTxt + ' <span class="hideable">' + esc(x.m) + "</span></span>";
  }

  function kanjiItem(ch, gid) {
    var k = KMAP[ch];
    if (!k) return "";
    var d = k.d, isKnown = known.has(ch);
    var ws = wordsOf(ch, k.lv === "n3" ? 6 : 3);
    var html = '<div class="kitem"' + (gid ? ' data-anchor="k:' + gid + ":" + esc(ch) + '"' : "") + ">";
    html += '<div><div class="kitem__char" data-k="' + esc(ch) + '">' + esc(ch) + '</div><div class="kitem__lv">' + lvBadge(k.lv) + "</div></div>";
    html += "<div>";
    html += '<div class="kitem__top"><span class="kitem__hv hideable">' + esc(d.hanviet) + '</span><span class="kitem__mean hideable">' + esc(d.core_meaning) + "</span>";
    if (k.lv !== "fb") {
      html += '<span class="kitem__right"><button type="button" class="known-btn' + (isKnown ? " known-btn--on" : "") + '" data-known="' + esc(ch) + '">' +
        (isKnown ? "✓ Đã thuộc" : "Đánh dấu thuộc") + "</button></span>";
    }
    html += "</div>";
    html += '<div class="kitem__read hideable"><b>On</b>' + esc(String(d.on_reading || "–").replace(/\|/g, "・")) +
      '　<b>Kun</b>' + esc(String(d.kun_reading || "–").replace(/\|/g, "・")) + "</div>";
    if (d.memory_tip || d.radicals) {
      html += '<div class="kitem__memo">' + (d.radicals ? "Bộ: " + esc(String(d.radicals).replace(/\|/g, ", ")) + ". " : "") + esc(d.memory_tip || "") + "</div>";
    }
    var chips = ws.own.map(function (x) { return vocabChip(x, ""); })
      .concat(ws.more.map(function (x) { return vocabChip(x, x.lv); }));
    if (chips.length) html += '<div class="vocab">' + chips.join("") + "</div>";
    html += "</div></div>";
    return html;
  }

  function groupKnownCount(g) {
    var n3 = n3CharsOf(g);
    return { k: n3.filter(function (c) { return known.has(c); }).length, t: n3.length };
  }

  function groupHead(g) {
    var cnt = groupKnownCount(g);
    var html = '<div class="card__head" data-toggle="' + g.id + '"><div style="flex:1;min-width:0">';
    html += '<div class="card__title jp">' + esc(g.title) + "</div>";
    html += '<div class="card__meta"><span class="badge badge--type">' + esc(TYPE_SHORT[g.type] || g.type) + "</span> " +
      (g.on ? '<span class="jp">' + esc(g.on) + "</span> · " : "") +
      (cnt.t ? (cnt.k === cnt.t ? '<span class="badge badge--ok">Thuộc ' + cnt.k + "/" + cnt.t + "</span>" : "Thuộc " + cnt.k + "/" + cnt.t + " chữ N3") : "") + "</div>";
    html += '<div class="kchars">' + g.chars.map(function (c) {
      var lv = lvOf(c);
      return '<span class="kc kc--' + lv + (known.has(c) ? " kc--known" : "") + '" title="' + esc(KMAP[c] ? KMAP[c].d.hanviet : "") + '">' + esc(c) + "</span>";
    }).join("") + "</div>";
    html += '</div><span class="caret">▼</span></div>';
    return html;
  }

  function groupBody(g) {
    var html = '<div class="tip">' + (g.tip.length > 1 ? "<ul>" + g.tip.map(function (t) { return "<li>" + md(t) + "</li>"; }).join("") + "</ul>" : md(g.tip[0] || "")) + "</div>";
    html += g.chars.map(function (c) { return kanjiItem(c, g.id); }).join("");
    html += '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn btn--sm" data-quiz="' + g.id + '">🎯 Kiểm tra cụm này</button>' +
      '<button type="button" class="btn btn--ghost btn--sm" data-known-all="' + g.id + '">✓ Đánh dấu thuộc cả cụm</button></div>';
    return html;
  }

  // ---------- Lọc ----------
  function norm(s) { return String(s || "").toLowerCase().normalize("NFC"); }

  function groupMatches(g, q) {
    if (!q) return true;
    if (norm(g.title).indexOf(q) >= 0 || norm(g.on).indexOf(q) >= 0 || g.tip.some(function (t) { return norm(t).indexOf(q) >= 0; })) return true;
    return g.chars.some(function (c) {
      if (c === q) return true;
      var k = KMAP[c];
      if (!k) return false;
      var d = k.d;
      return [d.hanviet, d.core_meaning, d.on_reading, d.kun_reading, d.vocabulary].some(function (x) { return norm(x).indexOf(q) >= 0; });
    });
  }

  function filteredGroups() {
    var q = norm(document.getElementById("g-search").value.trim());
    return GROUPS.filter(function (g) {
      if (ui.type !== "all" && g.type !== ui.type) return false;
      if (ui.unknown) {
        var c = groupKnownCount(g);
        if (c.t && c.k === c.t) return false;
      }
      return groupMatches(g, q);
    });
  }

  function renderChips() {
    var box = document.getElementById("type-chips");
    var items = [["all", "Tất cả"]].concat(Object.keys(TYPES).map(function (t) { return [t, TYPES[t]]; }));
    box.innerHTML = items.map(function (it) {
      var n = it[0] === "all" ? GROUPS.length : GROUPS.filter(function (g) { return g.type === it[0]; }).length;
      return '<button type="button" class="chip' + (ui.type === it[0] ? " chip--on" : "") + '" data-type="' + it[0] + '">' + esc(it[1]) + " (" + n + ")</button>";
    }).join("");
  }

  function renderGroups() {
    if (typeof updateNextBtn === "function") setTimeout(updateNextBtn, 0);
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
    var head = card.querySelector(".card__head");
    head.outerHTML = groupHead(g);
    if (openSet.has(id)) card.querySelector(".card__body").innerHTML = groupBody(g);
  }

  function toggleCard(id) {
    var card = document.getElementById("card-" + id);
    if (!card) return;
    var g = GROUPS.find(function (x) { return x.id === id; });
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

  // ---------- Tất cả chữ N3 ----------
  function renderAll() {
    var chips = [["all", "Tất cả"], ["unknown", "Chưa thuộc"], ["known", "Đã thuộc"]];
    document.getElementById("all-chips").innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip' + (ui.allFilter === c[0] ? " chip--on" : "") + '" data-all="' + c[0] + '">' + c[1] + "</button>";
    }).join("");
    var q = norm(document.getElementById("a-search").value.trim());
    var list = N3_LIST.filter(function (k) {
      var kn = known.has(k.kanji);
      if (ui.allFilter === "known" && !kn) return false;
      if (ui.allFilter === "unknown" && kn) return false;
      if (!q) return true;
      return k.kanji === q || [k.hanviet, k.core_meaning, k.on_reading, k.kun_reading].some(function (x) { return norm(x).indexOf(q) >= 0; });
    });
    setTimeout(updateNextBtn, 0);
    document.getElementById("all-grid").innerHTML = list.length ? list.map(function (k) {
      return '<button type="button" class="tile' + (known.has(k.kanji) ? " tile--known" : "") + '" data-k="' + esc(k.kanji) + '" data-anchor="t:' + esc(k.kanji) + '"><div class="tile__c">' +
        esc(k.kanji) + '</div><div class="tile__hv">' + esc(k.hanviet) + "</div></button>";
    }).join("") : '<div class="empty" style="grid-column:1/-1">Không có chữ nào.</div>';
  }

  // ---------- Chi tiết 1 chữ ----------
  var detailModal = document.getElementById("detail-modal");
  function openDetail(ch) {
    if (!KMAP[ch]) return;
    var gs = CHAR_GROUPS[ch] || [];
    var ws = wordsOf(ch, 30);
    var html = kanjiItem(ch);
    if (ws.moreTotal > 6) {
      html += '<div class="section-label">Tất cả từ đã học chứa「' + esc(ch) + "」(" + ws.moreTotal + ")</div>";
      html += '<div class="vocab">' + ws.more.map(function (x) { return vocabChip(x, x.lv); }).join("") + "</div>";
    }
    if (gs.length) {
      html += '<div class="section-label">Nằm trong ' + gs.length + " cụm</div>";
      html += '<div class="group-links">' + gs.map(function (g) {
        return '<button type="button" class="chip" data-goto="' + g.id + '">' + esc(g.title) + "</button>";
      }).join("") + "</div>";
    }
    detailModal.querySelector(".modal__body").innerHTML = html;
    detailModal.classList.add("modal--open");
  }
  function closeDetail() { detailModal.classList.remove("modal--open"); }
  detailModal.querySelector(".modal__backdrop").addEventListener("click", closeDetail);
  detailModal.querySelector(".modal__close").addEventListener("click", closeDetail);

  function gotoGroup(id) {
    closeDetail();
    var g = GROUPS.find(function (x) { return x.id === id; });
    if (!g) return;
    switchView("groups");
    document.getElementById("g-search").value = "";
    ui.type = "all";
    ui.unknown = false;
    document.getElementById("opt-unknown").checked = false;
    openSet.add(id);
    renderChips();
    renderGroups();
    var el = document.getElementById("card-" + id);
    if (el) N3.scrollToEl(el);
  }

  // ---------- Quiz ----------
  var quiz = new N3.Quiz(document.getElementById("quiz-modal"));
  var lastQuizGroups = null;

  // Biến thể cách đọc dễ nhầm: trường âm, っ, âm đục
  var DAKU = { か: "が", き: "ぎ", く: "ぐ", け: "げ", こ: "ご", さ: "ざ", し: "じ", す: "ず", せ: "ぜ", そ: "ぞ", た: "だ", ち: "ぢ", つ: "づ", て: "で", と: "ど", は: "ば", ひ: "び", ふ: "ぶ", へ: "べ", ほ: "ぼ" };
  var UNDAKU = {};
  Object.keys(DAKU).forEach(function (k) { UNDAKU[DAKU[k]] = k; });
  function readingVariants(r) {
    var out = new Set();
    // trường âm
    out.add(r.replace(/(ょ|ゅ|[こそとのほもよろごぞどぼぽ])う/, "$1"));
    out.add(r.replace(/([きしちにひみりぎじびぴ][ょゅ])(?!う)/, "$1う"));
    out.add(r.replace(/([こそとほごぞど])(?![うょゅ])/, "$1う"));
    out.add(r.replace(/([けせてねへめれげぜでべ])い/, "$1"));
    // っ
    out.add(r.replace(/っ/, "つ"));
    out.add(r.replace(/っ/, ""));
    out.add(r.replace(/([くきつち])([かきくけこさしすせそたちつてとぱぴぷぺぽ])/, "っ$2"));
    // âm đục
    var i = r.search(/[かきくけこさしすせそたちつてとはひふへほ]/);
    if (i > 0) out.add(r.slice(0, i) + DAKU[r[i]] + r.slice(i + 1));
    var j = r.search(/[がぎぐげござじずぜぞだぢづでどばびぶべぼ]/);
    if (j >= 0) out.add(r.slice(0, j) + UNDAKU[r[j]] + r.slice(j + 1));
    out.delete(r);
    return Array.from(out).filter(function (x) { return x && x.length > 1; });
  }

  // Chữ có cùng âm On đầu tiên (đáp án nhiễu kiểu 表記)
  var ON_IDX = null;
  function firstOn(ch) { return String((KMAP[ch] && KMAP[ch].d.on_reading) || "").split("|")[0].trim(); }
  function sameOn(ch) {
    if (!ON_IDX) {
      ON_IDX = {};
      Object.keys(KMAP).forEach(function (c) {
        if (KMAP[c].lv === "fb") return;
        var on = firstOn(c);
        if (on) (ON_IDX[on] = ON_IDX[on] || []).push(c);
      });
    }
    return (ON_IDX[firstOn(ch)] || []).filter(function (c) { return c !== ch; });
  }

  function hvMean(ch) { var d = KMAP[ch].d; return esc(d.hanviet) + " – " + esc(d.core_meaning); }

  function makeOptions(answer, pool, n, keepOrder) {
    var opts = [answer], seen = {};
    seen[answer] = 1;
    (keepOrder ? pool : N3.shuffle(pool)).forEach(function (p) {
      if (opts.length >= n || seen[p]) return;
      seen[p] = 1;
      opts.push(p);
    });
    if (opts.length < 2) return null;
    opts = N3.shuffle(opts);
    return { options: opts, answer: opts.indexOf(answer) };
  }

  function explainChar(ch, word) {
    var d = KMAP[ch].d;
    var s = "<b class='jp'>" + esc(ch) + "</b> " + esc(d.hanviet) + " – " + esc(d.core_meaning) +
      " · On: <span class='jp'>" + esc(String(d.on_reading || "–").replace(/\|/g, "・")) + "</span>";
    if (word) s += "<br><span class='jp'>" + esc(word.w) + "（" + esc(word.r) + "）</span>: " + esc(word.m);
    return s;
  }

  function buildQuestions(groups, limit) {
    var chars = [], seenC = {};
    groups.forEach(function (g) {
      g.chars.forEach(function (c) {
        if (seenC[c] || !KMAP[c] || KMAP[c].lv === "fb") return;
        seenC[c] = 1;
        chars.push({ c: c, g: g });
      });
    });
    var allN3 = N3_LIST.map(function (k) { return k.kanji; });
    var qs = [];
    N3.shuffle(chars).forEach(function (it) {
      var ch = it.c, g = it.g;
      var mates = (CHAR_GROUPS[ch] || []).reduce(function (a, gg) { return a.concat(gg.chars); }, [])
        .filter(function (c) { return c !== ch && KMAP[c] && KMAP[c].lv !== "fb"; });
      var words = parseVocabField(KMAP[ch].d.vocabulary).filter(function (w) { return w.w.indexOf(ch) >= 0 && /^[぀-ゟー]+$/.test(w.r); });
      var kinds = ["mean"];
      if (words.length) kinds.push("read", "write");
      var kind = kinds[Math.floor(Math.random() * kinds.length)];
      var q = null;

      if (kind === "write") {
        // 表記: chọn cách viết đúng — thay chữ đích bằng chữ cùng cụm
        var w = words[Math.floor(Math.random() * words.length)];
        var subs = N3.shuffle(mates).concat(N3.shuffle(sameOn(ch)), N3.sample(allN3, 8)).filter(function (c) { return c !== ch; })
          .map(function (c) { return w.w.split(ch).join(c); });
        var o = makeOptions(w.w, subs, 4, true);
        if (o) q = { kind: "表記 – Chọn cách viết đúng", q: esc(w.r) + '<div style="font-size:15px;font-family:system-ui" class="muted">' + esc(w.m) + "</div>", options: o.options.map(esc), answer: o.answer, explain: explainChar(ch, w) };
        else kind = "read";
      }
      if (!q && kind === "read") {
        // 漢字読み: chọn cách đọc đúng
        var w2 = words[Math.floor(Math.random() * words.length)];
        var pool = readingVariants(w2.r);
        mates.forEach(function (c) {
          parseVocabField(KMAP[c].d.vocabulary).forEach(function (x) {
            if (x.r.length === w2.r.length || Math.abs(x.r.length - w2.r.length) <= 1) pool.push(x.r);
          });
        });
        pool = N3.shuffle(readingVariants(w2.r)).slice(0, 2).concat(N3.shuffle(pool));
        var o2 = makeOptions(w2.r, pool, 4, true);
        if (o2) q = { kind: "漢字読み – Chọn cách đọc đúng", q: '<span class="big" style="font-size:44px">' + esc(w2.w) + "</span>", options: o2.options.map(esc), answer: o2.answer, explain: explainChar(ch, w2) };
      }
      if (!q) {
        // Nghĩa / Hán Việt
        var poolC = mates.concat(N3.sample(allN3, 10)).filter(function (c) { return c !== ch && KMAP[c]; });
        var o3 = makeOptions(ch, poolC, 4);
        if (o3) q = { kind: "Nghĩa – Chữ này là gì?", q: '<span class="big">' + esc(ch) + "</span>", options: o3.options.map(hvMean), answer: o3.answer, explain: explainChar(ch) + (g ? "<br>Cụm: " + esc(g.title) : "") };
      }
      if (q) qs.push(q);
    });
    return qs.slice(0, limit || 15);
  }

  function startQuiz(groups, title) {
    lastQuizGroups = groups;
    quiz.opts.regen = function () { return buildQuestions(lastQuizGroups, 15); };
    quiz.open(title, buildQuestions(groups, 15));
  }

  // ---------- Mẹo thi ----------
  function renderTips() {
    document.getElementById("view-tips").innerHTML =
      '<div class="card"><div class="card__body" style="border-top:none">' +
      "<h2>Phần 文字・語彙 (Chữ – Từ vựng) N3</h2>" +
      "<p>Thời gian <b>30 phút</b>, 35 câu. Điểm phần 言語知識 (gồm cả ngữ pháp) tối đa 60, <b>điểm liệt dưới 19</b>; đỗ khi tổng ≥ 95/180.</p>" +
      '<div class="table-scroll"><table class="cmp"><tr><th>Mondai</th><th>Dạng</th><th>Câu</th><th>Cách ôn với trang này</th></tr>' +
      "<tr><td>問題1 漢字読み</td><td>Chọn cách đọc của kanji</td><td>8</td><td>Quiz dạng 漢字読み; chú ý trường âm, っ, âm đục</td></tr>" +
      "<tr><td>問題2 表記</td><td>Chọn kanji đúng cho từ hiragana</td><td>6</td><td>Cụm <b>Thanh phù</b>, <b>Na ná</b>, <b>Âm Kun</b> + quiz 表記</td></tr>" +
      "<tr><td>問題3 文脈規定</td><td>Chọn từ hợp ngữ cảnh</td><td>11</td><td>Học từ ghép trong mỗi chữ</td></tr>" +
      "<tr><td>問題4 言い換え類義</td><td>Chọn từ/câu đồng nghĩa</td><td>5</td><td>Cụm <b>Trái nghĩa</b>, nghĩa Hán Việt</td></tr>" +
      "<tr><td>問題5 用法</td><td>Chọn câu dùng từ đúng</td><td>5</td><td>Đọc kỹ nghĩa của từ ghép</td></tr></table></div>" +
      "<h3>1. Đoán âm On từ âm Hán Việt</h3>" +
      "<p>Âm Hán Việt và âm On cùng gốc tiếng Hán cổ, nên phần <b>cuối âm</b> khá đều:</p>" +
      '<div class="table-scroll"><table class="cmp hv-table"><tr><th>Hán Việt kết thúc</th><th>Âm On thường kết thúc</th><th>Ví dụ</th></tr>' +
      "<tr><td>-ng, -nh</td><td>trường âm う / い</td><td class='jp'>東 ĐÔNG とう・生 SINH せい・経 KINH けい・定 ĐỊNH てい</td></tr>" +
      "<tr><td>-c, -ch</td><td>く / き</td><td class='jp'>学 HỌC がく・石 THẠCH せき・確 XÁC かく・席 TỊCH せき</td></tr>" +
      "<tr><td>-t</td><td>つ / ち</td><td class='jp'>決 QUYẾT けつ・日 NHẬT にち・失 THẤT しつ・必 TẤT ひつ</td></tr>" +
      "<tr><td>-p</td><td>う (cũ: ふ), dễ thành っ</td><td class='jp'>合 HỢP ごう・十 THẬP じゅう・協 HIỆP きょう</td></tr>" +
      "<tr><td>-m, -n</td><td>ん</td><td class='jp'>安 AN あん・心 TÂM しん・満 MÃN まん・単 ĐƠN たん</td></tr></table></div>" +
      "<p>⇒ Nếu Hán Việt có <b>-ng/-nh</b> mà đáp án không có trường âm → gần như chắc chắn sai (VD: 正 CHÍNH = <span class='jp'>せい</span>, không phải <span class='jp'>せ</span>).</p>" +
      "<h3>2. Bẫy hay gặp ở 漢字読み</h3><ul>" +
      "<li><b>Trường âm</b>: <span class='jp'>紹介 しょうかい</span> vs <span class='jp'>書類 しょるい</span>; <span class='jp'>都合 つごう</span>, <span class='jp'>普通 ふつう</span>.</li>" +
      "<li><b>Âm ngắt っ</b> khi chữ đầu kết thúc bằng く/つ/ち và chữ sau bắt đầu bằng k/s/t/p: <span class='jp'>結果 けっか, 出発 しゅっぱつ, 学校 がっこう, 一回 いっかい</span>.</li>" +
      "<li><b>Âm đục</b> ở chữ thứ hai: <span class='jp'>本棚 ほんだな, 三階 さんがい, 手紙 てがみ</span>.</li>" +
      "<li><b>On hay Kun?</b> Từ 2 kanji thường đọc On–On; chữ có okurigana (送り仮名) đọc Kun: <span class='jp'>増加 ぞうか</span> vs <span class='jp'>増える ふえる</span>.</li></ul>" +
      "<h3>3. Bẫy ở 表記</h3><ul>" +
      "<li>3 đáp án nhiễu thường là chữ <b>cùng âm On</b> (険/検/験) hoặc <b>na ná</b> (未/末, 失/夫) → học theo cụm <b>Thanh phù</b> và <b>Na ná</b>.</li>" +
      "<li>Từ có okurigana: phân biệt <b>âm Kun giống nhau</b> (暖かい/温かい, 治す/直す, 計る/測る/量る) → cụm <b>Âm Kun</b>.</li>" +
      "<li>Nhìn <b>bộ bên trái</b> để đoán nghĩa: 氵 nước, 扌 tay, 言 lời nói, 糸 sợi, 貝 tiền, 阝(trái) đồi, 礻 thần, 衤 áo.</li></ul>" +
      "<h3>4. Chiến lược làm bài</h3><ul>" +
      "<li>Phần chữ – từ vựng làm nhanh (~30–40 giây/câu), câu nào không biết thì chọn theo quy tắc âm Hán Việt ở trên rồi đi tiếp.</li>" +
      "<li>Đừng học kanji đơn lẻ: học <b>2–3 từ ghép</b> cho mỗi chữ, ưu tiên từ có chữ N4/N5 đã biết (tô xanh trong thẻ từ).</li>" +
      "<li>Mỗi ngày: mở 3–5 cụm, bật <b>Che nghĩa & âm</b> để tự kiểm tra, rồi làm <b>🎯 Kiểm tra cụm</b>; chữ nào chắc chắn thì đánh dấu thuộc.</li>" +
      "<li>Trước ngày thi: lọc <b>Ẩn cụm đã thuộc hết</b> và chỉ ôn phần còn lại.</li></ul>" +
      "</div></div>";
  }

  // ---------- Điều hướng ----------
  var currentView = "groups";
  function switchView(v) {
    if (["groups", "all", "tips"].indexOf(v) < 0) v = "groups";
    currentView = v;
    ["groups", "all", "tips"].forEach(function (x) { document.getElementById("view-" + x).hidden = x !== v; });
    document.querySelectorAll(".view-btn[data-view]").forEach(function (b) {
      b.classList.toggle("view-btn--active", b.getAttribute("data-view") === v);
    });
    if (v === "all") renderAll();
    if (v === "tips" && !document.getElementById("view-tips").innerHTML) renderTips();
    updateNextBtn();
    if (mem && !mem.lock) mem.save();
  }

  // ---------- Nút "tới chữ chưa thuộc" ----------
  var nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "fab-next";
  nextBtn.title = "Cuộn tới kanji N3 chưa thuộc tiếp theo";
  document.body.appendChild(nextBtn);

  // Danh sách chữ N3 chưa thuộc theo thứ tự hiển thị (mỗi chữ lấy lần xuất hiện đầu tiên)
  function unknownTargets() {
    var out = [], seen = {};
    if (currentView === "all") {
      document.querySelectorAll("#all-grid .tile:not(.tile--known)").forEach(function (el) {
        out.push({ el: el });
      });
      return out;
    }
    filteredGroups().forEach(function (g) {
      g.chars.forEach(function (c, idx) {
        if (lvOf(c) !== "n3" || known.has(c) || seen[c]) return;
        seen[c] = 1;
        out.push({ gid: g.id, ch: c, idx: idx });
      });
    });
    return out;
  }

  function updateNextBtn() {
    if (currentView === "tips") { nextBtn.hidden = true; return; }
    var n = unknownTargets().length;
    nextBtn.hidden = false;
    nextBtn.textContent = n ? "↓ Chưa thuộc (" + n + ")" : "✓ Đã thuộc hết";
  }

  function targetEl(t) {
    if (t.el) return t.el;
    return document.querySelector('[data-anchor="k:' + t.gid + ":" + t.ch + '"]') || document.getElementById("card-" + t.gid);
  }

  function goNextUnknown() {
    var targets = unknownTargets();
    if (!targets.length) { N3.toast("Đã thuộc hết các chữ N3 trong danh sách đang lọc 🎉"); return; }
    var line = N3.headerLine() + 14;
    var pick = null;
    for (var i = 0; i < targets.length; i++) {
      var el = targetEl(targets[i]);
      if (!el) continue;
      // Chữ trong cụm đang đóng: lấy vị trí đầu cụm (+idx để giữ thứ tự trong cụm)
      var top = el.getBoundingClientRect().top + (el.classList.contains("card") ? (targets[i].idx || 0) * 0.01 : 0);
      if (top > line) { pick = targets[i]; break; }
    }
    if (!pick) {
      pick = targets[0];
      N3.toast("Đã hết chữ chưa thuộc phía dưới – quay lại từ đầu");
    }
    if (pick.gid && !openSet.has(pick.gid)) toggleCard(pick.gid);
    var dest = targetEl(pick);
    if (!dest) return;
    N3.scrollToEl(dest);
    N3.flash(dest);
  }

  nextBtn.addEventListener("click", goNextUnknown);

  function saveUi() { N3.save("n3review_kanji_ui", ui); }

  function setKnown(ch) {
    known.toggle(ch);
    setTimeout(updateNextBtn, 0);
    (CHAR_GROUPS[ch] || []).forEach(function (g) { refreshCard(g.id); });
    updateProgress();
  }

  // ---------- Sự kiện ----------
  document.getElementById("views").addEventListener("click", function (e) {
    var b = e.target.closest("[data-view]");
    if (b) switchView(b.getAttribute("data-view"));
  });

  document.getElementById("quiz-filtered-btn").addEventListener("click", function () {
    // Ưu tiên chữ chưa thuộc trong các cụm đang lọc
    var gs = filteredGroups();
    var unk = gs.filter(function (g) { var c = groupKnownCount(g); return !c.t || c.k < c.t; });
    startQuiz(unk.length ? unk : gs, ui.type === "all" ? "Kiểm tra tổng hợp" : "Kiểm tra – " + TYPES[ui.type]);
  });

  document.getElementById("type-chips").addEventListener("click", function (e) {
    var b = e.target.closest("[data-type]");
    if (!b) return;
    ui.type = b.getAttribute("data-type");
    saveUi();
    renderChips();
    renderGroups();
  });

  var t1;
  document.getElementById("g-search").addEventListener("input", function () {
    clearTimeout(t1);
    t1 = setTimeout(renderGroups, 180);
  });
  var t2;
  document.getElementById("a-search").addEventListener("input", function () {
    clearTimeout(t2);
    t2 = setTimeout(renderAll, 180);
  });

  var optHide = document.getElementById("opt-hide");
  optHide.checked = !!ui.hide;
  document.body.classList.toggle("hide-mode", !!ui.hide);
  optHide.addEventListener("change", function () {
    ui.hide = optHide.checked;
    document.body.classList.toggle("hide-mode", ui.hide);
    saveUi();
  });

  var optUnknown = document.getElementById("opt-unknown");
  optUnknown.checked = !!ui.unknown;
  optUnknown.addEventListener("change", function () {
    ui.unknown = optUnknown.checked;
    saveUi();
    renderGroups();
  });

  document.getElementById("expand-all").addEventListener("click", function () {
    filteredGroups().forEach(function (g) { openSet.add(g.id); });
    renderGroups();
    mem.save();
  });
  document.getElementById("collapse-all").addEventListener("click", function () {
    openSet.clear();
    renderGroups();
    mem.save();
  });

  document.getElementById("all-chips").addEventListener("click", function (e) {
    var b = e.target.closest("[data-all]");
    if (!b) return;
    ui.allFilter = b.getAttribute("data-all");
    saveUi();
    renderAll();
  });

  document.addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-known]"))) { setKnown(t.getAttribute("data-known")); if (detailModal.classList.contains("modal--open")) openDetail(t.getAttribute("data-known")); return; }
    if ((t = e.target.closest("[data-known-all]"))) {
      var g = GROUPS.find(function (x) { return x.id === t.getAttribute("data-known-all"); });
      var n3 = n3CharsOf(g);
      var allKnown = n3.every(function (c) { return known.has(c); });
      n3.forEach(function (c) { if (known.has(c) === allKnown) known.toggle(c); });
      var touched = {};
      n3.forEach(function (c) { (CHAR_GROUPS[c] || []).forEach(function (gg) { touched[gg.id] = 1; }); });
      Object.keys(touched).forEach(refreshCard);
      updateProgress();
      updateNextBtn();
      return;
    }
    if ((t = e.target.closest("[data-quiz]"))) {
      var gq = GROUPS.find(function (x) { return x.id === t.getAttribute("data-quiz"); });
      startQuiz([gq], gq.title);
      return;
    }
    if ((t = e.target.closest("[data-goto]"))) { gotoGroup(t.getAttribute("data-goto")); return; }
    if ((t = e.target.closest("[data-toggle]"))) { toggleCard(t.getAttribute("data-toggle")); return; }
    if ((t = e.target.closest("[data-k]"))) {
      if (e.target.closest(".hide-mode .hideable")) return;
      openDetail(t.getAttribute("data-k"));
    }
  });

  document.addEventListener("keydown", function (e) {
    quiz.key(e);
    if (e.key === "Escape") closeDetail();
  });

  // Khi đóng modal chi tiết ở tab "328 chữ" → cập nhật lại lưới (trạng thái thuộc)
  detailModal.querySelector(".modal__close").addEventListener("click", function () {
    if (!document.getElementById("view-all").hidden) renderAll();
  });

  // ---------- Khởi tạo: khôi phục tab, cụm đang mở và vị trí đã lướt tới ----------
  var mem = new N3.ScrollMemory("n3review_kanji_pos", function () {
    return { view: currentView, open: Array.from(openSet) };
  });
  var saved = mem.saved || {};
  (saved.open || []).forEach(function (id) {
    if (GROUPS.some(function (g) { return g.id === id; })) openSet.add(id);
  });
  renderChips();
  renderGroups();
  updateProgress();
  switchView(saved.view || "groups");
  N3.addToTop();
  mem.restore();
})();
