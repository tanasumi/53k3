const CACHE_NAME = "53k3-cache-v1";
const FILES_TO_CACHE = [
  "/53k3/",
  "/53k3/index.html",
  "/53k3/css/style.css",
  "/53k3/js/app.js",
  "/53k3/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
