importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log('✅ Workbox loaded');

  // Precache static files
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/assets/css/style.css', revision: '1' },
    { url: '/assets/js/main.js', revision: '1' },
    { url: '/public/logo.png', revision: '1' },
    { url: '/public/favicon.png', revision: '1' }
  ]);

  // Cache CSS/JS/Images: Cache First
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'assets-cache-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 ngày
        }),
      ],
    })
  );

  // Cache HTML Pages: Network First
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60, // 1 ngày
        }),
      ],
    })
  );

  // Fallback offline page (OPTIONAL - nếu bạn setup /offline.html)
  /*
  workbox.routing.setCatchHandler(async ({event}) => {
    if (event.request.destination === 'document') {
      return caches.match('/offline.html');
    }
    return Response.error();
  });
  */

} else {
  console.error('❌ Workbox failed to load');
}

// Immediate activation
self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  clients.claim();
});
