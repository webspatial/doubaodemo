const CACHE_NAME = "avatar-dropdown-demo-v1";
const CORE_ASSETS = ["/", "/index.html", "/manifest.webmanifest", "/pwa-icon.svg"];
const LOCAL_DEV_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const IS_LOCAL_DEV = LOCAL_DEV_HOSTS.has(self.location.hostname);

const clearDemoCaches = async () => {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => key.startsWith("avatar-dropdown-demo-"))
      .map((key) => caches.delete(key)),
  );
};

const addToCache = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const response = await fetch(request);

  if (response.ok) {
    await cache.put(request, response.clone());
  }

  return response;
};

self.addEventListener("install", (event) => {
  if (IS_LOCAL_DEV) {
    event.waitUntil(clearDemoCaches());
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  if (IS_LOCAL_DEV) {
    event.waitUntil(
      clearDemoCaches()
        .then(() => self.registration.unregister())
        .then(() => self.clients.claim()),
    );
    return;
  }

  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((key) => key === CACHE_NAME ? undefined : caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_URLS") {
    return;
  }

  const urls = event.data.urls.filter((url) => {
    try {
      return new URL(url).origin === self.location.origin;
    } catch {
      return false;
    }
  });

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urls))
      .catch(() => undefined),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  if (IS_LOCAL_DEV) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      addToCache(request).catch(() => caches.match("/index.html")),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached ?? addToCache(request)),
  );
});
