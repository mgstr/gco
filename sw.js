// Static file — hand-edited, not generated. Bump CACHE_NAME when ASSETS
// changes so the activate handler purges the old cache; content updates to
// existing files don't need a bump (stale-while-revalidate refreshes them).
const CACHE_NAME = 'geocaches-v2';
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./data.json",
  "./icons/regular.png",
  "./icons/mystery.png",
  "./icons/multi.png",
  "./icons/virtual.png",
  "./icons/wherigo.png",
  "./icons/letterbox.png",
  "./icons/reverse.png",
  "./icons/webcam.png",
  "./icons/pwa/icon-192.png",
  "./icons/pwa/icon-512.png",
  "./icons/pwa/icon-180.png",
  "./icons/pwa/favicon-32.png",
  "./icons/pwa/favicon-16.png",
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: serve from cache instantly (works with no connectivity),
// refresh the cache from the network in the background when online.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => { if (res.ok) cache.put(req, res.clone()); return res; })
        .catch(() => cached);
      return cached || network;
    })
  );
});
