const CACHE = 'kraft-pwa-v3';

self.addEventListener('install', (event) => {
  // Skip waiting to immediately activate new service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Clean up ALL old caches
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through - no caching for now to avoid issues
  // This will prevent all caching errors
  return;
});
