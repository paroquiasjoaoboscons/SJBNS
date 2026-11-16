self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
    // Permite que o navegador carregue a página normalmente (sem cache)
    // Se a requisição for para a própria página (navegação), deixa passar direto.
    if (event.request.mode === 'navigate') {
        return;
    }
    // Para outros recursos, não faz nada (deixa o navegador buscar da rede)
    return;
});
