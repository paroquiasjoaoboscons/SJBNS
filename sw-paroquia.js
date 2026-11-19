// ===== INÍCIO: SERVICE WORKER PARÓQUIA v2 =====
const CACHE_NAME = 'paroquia-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest-paroquia.json',
  './icone-192.png',
  './icone-512.png',
  './padre.jpg',
  './igreja-paroquia.jpg',
  './paroquia1.jpg',
  './paroquia2.jpg',
  './paroquia3.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('api-paroquia.paroquiasjoaoboscons.workers.dev')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
// ===== FIM: SERVICE WORKER PARÓQUIA v2 =====
