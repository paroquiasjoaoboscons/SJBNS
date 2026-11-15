const CACHE_NAME = 'paroquia-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest-paroquia.json',
  './icone-192.png',
  './icone-512.png',
  './padre.jpg',
  './igreja-paroquia.jpg',
  // Adicione aqui as fotos da paróquia se quiser que elas carreguem offline
  './paroquia1.jpg',
  './paroquia2.jpg',
  './paroquia3.jpg'
];

// Instala o Service Worker e salva os arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aberto com sucesso');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativa o Service Worker e limpa caches antigos se houver atualização
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta as requisições (Network First, fallback to Cache)
self.addEventListener('fetch', (event) => {
  // Ignora requisições de API ou extensões do navegador
  if (event.request.url.includes('api-paroquia.paroquiasjoaoboscons.workers.dev')) {
    return; 
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a rede respondeu, atualiza o cache com a versão mais nova
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Se a rede falhar (offline), tenta buscar no cache
        return caches.match(event.request);
      })
  );
});
