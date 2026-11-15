const CACHE_NAME = 'carmo-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  '../icone-192.png', // Volta uma pasta para achar o ícone na raiz
  '../icone-512.png',
  './igreja.jpg',
  './igreja1.jpg',
  './igreja2.jpg',
  './igreja3.jpg'
];

// Instala o Service Worker e salva os arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache do Carmo aberto');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativa o Service Worker e limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Limpando cache antigo do Carmo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta as requisições
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('api-paroquia.paroquiasjoaoboscons.workers.dev')) {
    return; 
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
