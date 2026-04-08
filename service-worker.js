/* VivaSculpt Studio service worker (basic offline cache)
   Note: service workers require https or localhost.
*/
const CACHE_NAME = "vivasculpt-cache-v1";
const ASSETS = [
	"/",
	"/index.html",
	"/styles.css",
	"/app.js",
	"/manifest.webmanifest"
	// Add icons if you want them cached:
	// "/icons/icon-192.png",
	// "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
		).then(() => self.clients.claim())
	);
});

self.addEventListener("fetch", (event) => {
	const req = event.request;
	event.respondWith(
		caches.match(req).then((cached) => {
			if (cached) return cached;
			return fetch(req)
				.then((res) => {
					// Cache same-origin GET requests
					try {
						const url = new URL(req.url);
						if (req.method === "GET" && url.origin === self.location.origin) {
							const copy = res.clone();
							caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
						}
					} catch {}
					return res;
				})
				.catch(() => {
					// Offline fallback
					return new Response(
						"Offline. Please reconnect and try again.",
						{ headers: { "Content-Type": "text/plain" }, status: 200 }
					);
				});
		})
	);
});