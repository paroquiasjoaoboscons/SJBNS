// Service worker mínimo para habilitar o PWA
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// Este evento é OBRIGATÓRIO para o Chrome liberar o botão "Instalar"
self.addEventListener('fetch', (event) => {
    // Deixa o navegador fazer o que quiser (não guarda cache, sempre busca da rede)
    return;
});
