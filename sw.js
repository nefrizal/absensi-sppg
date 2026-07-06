const CACHE_NAME = 'absensi-sppg-v1';
const ASSETS = [
  '/absensi-sppg/',
  '/absensi-sppg/index.html',
  '/absensi-sppg/manifest.json',
  '/absensi-sppg/icon-192.png',
  '/absensi-sppg/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Requests ke Apps Script selalu fetch langsung (bukan cache)
  if (e.request.url.includes('script.google.com')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
