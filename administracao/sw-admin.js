// ===== INÍCIO: SERVICE WORKER ADMIN v4 =====
const CACHE = 'adm-paroquial-v4';
const ARQUIVOS = ['./index.html', './links.html', './manifest.json', './icone-admin-192.png', './icone-admin-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) {
        const copia = res.clone();
        caches.open(CACHE).then(c => c.put(req, copia));
      }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./links.html')))
  );
});
// ===== FIM: SERVICE WORKER ADMIN v4 =====
