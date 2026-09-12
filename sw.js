/* Service worker : l'app fonctionne hors ligne une fois ouverte une première fois. */
const CACHE = "menu-semaine-v1";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./recipes.js", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(ASSETS.map(a => cache.add(a).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache d'abord, réseau ensuite ; la réponse réseau rafraîchit le cache (polices Google incluses).
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(cached => {
      const network = fetch(req).then(res => {
        if (res && (res.ok || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
