const CACHE_NAME = "53k3-cache-v1";
const FILES_TO_CACHE = [
  "/camera-time-drift/",
  "/camera-time-drift/index.html",
  "/camera-time-drift/css/style.css",
  "/camera-time-drift/js/app.js",
  "/camera-time-drift/manifest.json"
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
