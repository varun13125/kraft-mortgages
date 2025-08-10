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

// Removing no-op fetch event listener that was causing warnings
// If fetch handling is needed later, implement proper cache strategy
