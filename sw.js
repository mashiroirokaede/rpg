const CACHE_NAME = "starlight-rpg-v22";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./firebase-config.js",
  "./manifest.webmanifest",
  "./assets/app-icon.svg",
  "./assets/portraits/alchemist.png",
  "./assets/portraits/cook.png",
  "./assets/portraits/healer.png",
  "./assets/portraits/hunter.png",
  "./assets/portraits/jeweler.png",
  "./assets/portraits/knight.png",
  "./assets/portraits/mage.png",
  "./assets/portraits/ranger.png",
  "./assets/portraits/scout.png",
  "./assets/portraits/shinobi.png",
  "./assets/portraits/smith.png",
  "./assets/portraits/summoner.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    }),
  );
});
