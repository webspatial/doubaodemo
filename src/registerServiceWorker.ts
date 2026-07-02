const collectBuildAssets = () => {
  const urls = new Set<string>([
    new URL("/", window.location.origin).href,
    new URL("/index.html", window.location.origin).href,
    new URL("/manifest.webmanifest", window.location.origin).href,
    new URL("/pwa-icon.svg", window.location.origin).href,
  ]);

  document
    .querySelectorAll<HTMLScriptElement | HTMLLinkElement>(
      'script[src], link[rel="stylesheet"][href]',
    )
    .forEach((element) => {
      const assetUrl =
        element instanceof HTMLScriptElement ? element.src : element.href;

      if (assetUrl) {
        urls.add(assetUrl);
      }
    });

  return [...urls];
};

export const registerServiceWorker = () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  if (import.meta.env.DEV) {
    window.addEventListener("load", () => {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister())),
        )
        .then(() => caches.keys())
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith("avatar-dropdown-demo-"))
              .map((key) => caches.delete(key)),
          ),
        )
        .catch((error) => {
          console.warn("[doubaodemo] service worker cleanup failed", error);
        });
    });
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => navigator.serviceWorker.ready.then(() => registration))
      .then((registration) => {
        registration.active?.postMessage({
          type: "CACHE_URLS",
          urls: collectBuildAssets(),
        });
      })
      .catch((error) => {
        console.warn("[doubaodemo] service worker registration failed", error);
      });
  });
};
