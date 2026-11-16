// Service Worker para habilitar a instalação do PWA
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
    // Se a requisição for para navegar (abrir a página), deixa o navegador buscar da rede (não intercepta)
    if (event.request.mode === 'navigate') {
        return;
    }
    // Para os demais recursos (imagens, scripts), deixa o navegador buscar da rede também
    // Isso evita o "looping" e garante que o Staticrypt carregue o HTML verdadeiro
    return;
});
