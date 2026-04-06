const CACHE_NAME = 'mbtech-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/catalogo.html',
    '/styles.css',
    '/img.jpeg',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna do cache se encontrado
                if (response) {
                    return response;
                }
                // Senão, busca na rede
                return fetch(event.request);
            }
        )
    );
});