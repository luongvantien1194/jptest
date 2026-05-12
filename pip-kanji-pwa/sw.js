/* eslint-disable no-restricted-globals */
var CACHE_NAME = "kanji-pip-lab-v34";
var ASSETS = ["./index.html", "./script.js", "./manifest.json", "../data/kanjiData.js"];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (k) {
            return k !== CACHE_NAME;
          })
          .map(function (k) {
            return caches.delete(k);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") {
    return;
  }
  var url = new URL(req.url);
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) {
        return cached;
      }
      return fetch(req)
        .then(function (res) {
          var copy = res.clone();
          if (res.status === 200) {
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(req, copy);
            });
          }
          return res;
        })
        .catch(function () {
          var p = url.pathname.toLowerCase();
          if (p.endsWith(".json") || p.endsWith(".js")) {
            return new Response("", { status: 503, statusText: "offline" });
          }
          return caches.match("./index.html");
        });
    })
  );
});
