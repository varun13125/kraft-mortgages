const CACHE = 'kraft-pwa-v1';
const OFFLINE_URLS = [
  '/calculators/construction-pro', '/calculators/investment', '/calculators/self-employed', '/mli-select', '/learn/first-time-buyer',
  '/', '/calculators/payment', '/calculators/affordability', '/calculators/renewal'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(OFFLINE_URLS);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  event.respondWith((async () => {
    try {
      const network = await fetch(request);
      const cache = await caches.open(CACHE);
      cache.put(request, network.clone());
      return network;
    } catch (e) {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return caches.match('/');
      }
      throw e;
    }
  })());
});
