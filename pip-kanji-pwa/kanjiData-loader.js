/**
 * Tải dữ liệu Kanji: ưu tiên ./kanjiData.json (fetch + JSON.parse),
 * sau đó thử các URL .js (fetch + chèn script) như trước.
 */
(function () {
  function pushUrl(list, url, kind) {
    if (!url) {
      return;
    }
    var dup = list.some(function (e) {
      return e.url === url;
    });
    if (!dup) {
      list.push({ url: url, kind: kind });
    }
  }

  function buildSources() {
    var list = [];
    try {
      pushUrl(list, new URL("./kanjiData.json", location.href).href, "json");
    } catch (e) {}
    try {
      pushUrl(list, new URL("./kanjiData.js", location.href).href, "js");
    } catch (e2) {}
    try {
      pushUrl(list, new URL("../data/kanjiData.js", location.href).href, "js");
    } catch (e3) {}
    try {
      pushUrl(list, new URL("data/kanjiData.js", location.href).href, "js");
    } catch (e4) {}
    try {
      var path = decodeURI(location.pathname || "").replace(/\/index\.html$/i, "").replace(/\/$/, "");
      var lower = path.toLowerCase();
      var key = "/pip-kanji-pwa";
      var pos = lower.indexOf(key);
      if (pos !== -1) {
        pushUrl(list, location.origin + path.slice(0, pos) + "/data/kanjiData.js", "js");
      }
    } catch (e5) {}
    return list;
  }

  function removeFailedInjections() {
    document.querySelectorAll("script[data-pip-kanji-inject]").forEach(function (n) {
      n.parentNode.removeChild(n);
    });
  }

  function injectAndRunSource(jsText) {
    removeFailedInjections();
    var s = document.createElement("script");
    s.setAttribute("data-pip-kanji-inject", "1");
    s.textContent = jsText;
    (document.head || document.documentElement).appendChild(s);
  }

  function hasKanjiArray() {
    var kd = typeof kanjiData !== "undefined" ? kanjiData : window.kanjiData;
    return Array.isArray(kd) && kd.length > 0;
  }

  var sources = buildSources();
  var i = 0;
  var mainAppended = false;

  function appendMainScript() {
    if (mainAppended) {
      return;
    }
    mainAppended = true;
    var app = document.createElement("script");
    app.src = new URL("./script.js", location.href).href;
    document.body.appendChild(app);
  }

  function failMessage() {
    if (trySyncFileFallback()) {
      appendMainScript();
      return;
    }
    var st = document.getElementById("load-status");
    if (st) {
      st.textContent =
        "Không tải được dữ liệu Kanji. Đã thử: " +
        sources
          .map(function (s) {
            return s.url;
          })
          .join(" → ") +
        ". Kiểm tra pip-kanji-pwa/kanjiData.json; mở trang qua http:// (localhost), không dùng file://; hoặc chạy server từ app10_files (../data/kanjiData.js).";
    }
    appendMainScript();
  }

  function applyJsonArray(arr) {
    if (!Array.isArray(arr) || !arr.length) {
      return false;
    }
    window.kanjiData = arr;
    return true;
  }

  function looksLikeHtml(text) {
    var t = String(text || "").trim();
    return t.charAt(0) === "<" && /<!DOCTYPE|<html|<head|<body/i.test(t.slice(0, 80));
  }

  /** Trên file:// trình duyệt thường chặn fetch(); thử XHR đồng bộ cùng các URL. */
  function syncFetchText(url) {
    try {
      var x = new XMLHttpRequest();
      x.open("GET", url, false);
      x.send(null);
      if (x.status === 200 || x.status === 0) {
        return x.responseText;
      }
    } catch (e) {}
    return null;
  }

  function trySyncFileFallback() {
    if (location.protocol !== "file:") {
      return false;
    }
    for (var j = 0; j < sources.length; j++) {
      var item = sources[j];
      var text = syncFetchText(item.url);
      if (!text || (item.kind === "json" && looksLikeHtml(text))) {
        continue;
      }
      if (item.kind === "json") {
        try {
          if (applyJsonArray(JSON.parse(text))) {
            return true;
          }
        } catch (je) {}
        continue;
      }
      try {
        injectAndRunSource(text);
        if (hasKanjiArray()) {
          return true;
        }
      } catch (ie) {}
      removeFailedInjections();
    }
    return false;
  }

  function tryNext() {
    if (i >= sources.length) {
      failMessage();
      return;
    }
    var item = sources[i];
    i += 1;
    fetch(item.url, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) {
          throw new Error(String(res.status));
        }
        return res.text();
      })
      .then(function (text) {
        if (item.kind === "json") {
          if (looksLikeHtml(text)) {
            tryNext();
            return;
          }
          var data;
          try {
            data = JSON.parse(text);
          } catch (je) {
            tryNext();
            return;
          }
          if (!applyJsonArray(data)) {
            tryNext();
            return;
          }
          appendMainScript();
          return;
        }
        try {
          injectAndRunSource(text);
        } catch (parseErr) {
          tryNext();
          return;
        }
        if (!hasKanjiArray()) {
          removeFailedInjections();
          tryNext();
          return;
        }
        appendMainScript();
      })
      .catch(function () {
        tryNext();
      });
  }

  tryNext();
})();
