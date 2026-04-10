/* =====================================================
   VivaSculpt Studio – service-worker.js
   Caches core app shell for basic offline use.

   NOTE: Service workers require HTTPS or localhost.
   They will NOT work when opening index.html via
   file:// in your browser. Use VS Code Live Server
   or `python -m http.server 8080` instead.
   ===================================================== */

const CACHE_NAME = 'vivasculpt-v3';

const CORE_FILES = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/calendar.js',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];
  // '/icons/icon-192.png',
  // '/icons/icon-512.png',
  // Add your Google Font CSS here if you want offline font support:
  // (Fonts themselves require additional caching or self-hosting)
];

/* ── Install: cache core files ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching core files');
      return cache.addAll(CORE_FILES);
    })
  );
  self.skipWaiting(); // Activate new SW immediately
});

/* ── Activate: remove old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim(); // Take control of pages immediately
});

/* ── Fetch: network-first, fall back to cache ── */
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests (e.g. Google Fonts API)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && !url.href.includes('fonts.googleapis.com') && !url.href.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Network failed – try cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached;

          // Offline fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          // Generic offline response for other requests
          return new Response(
            '<h1 style="font-family:sans-serif;text-align:center;padding:2rem">You are offline. Please reconnect to use VivaSculpt Studio.</h1>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
  );
});