// Service Worker: só habilita a instalação, sem cache (evita tela branca/looping)
self.addEventListener('install', function () {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then(function (keys) { return Promise.all(keys.map(function (k) { return caches.delete(k); })); })
            .then(function () { return self.clients.claim(); })
    );
});

// Passa tudo direto para a rede
self.addEventListener('fetch', function (event) {
    event.respondWith(fetch(event.request));
});
