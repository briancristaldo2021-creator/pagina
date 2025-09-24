const CACHE_NAME = "lcdm-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/album.html",
  "/ranking.html",
  "/registro.html",
  "/panel.html",
  "/perfil.html",
  "/style.css",
  "/script.js",
  "/codigos.js",
  "/qr.js",
  "/img/logo.png"
];

// Instalar
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activar
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// Interceptar requests
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
