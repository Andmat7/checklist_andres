// Phones keep serving stale modules after a deploy; going to the network every time makes a plain reload show the latest change.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const is_own_file = new URL(event.request.url).origin === self.location.origin;
  if (!is_own_file || event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request, { cache: 'no-store' }));
});
