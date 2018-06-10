/* eslint-disable func-names, no-console*/

const version = 1;
const RUNTIME_CACHE_NAME = `mws-runtime-v${version}`;

// Install SW
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

// Activate updated version and get rid of old
self.addEventListener('activate', event => {
  const currentCaches = [ RUNTIME_CACHE_NAME ];
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(
          cacheName => !currentCaches.includes(cacheName)
        );
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// cache when requested
// Fallback on cache
self.addEventListener('fetch', event => {
  const whiteListUrls = [ 'http://localhost:8080' ];

  // Cache and Update Pattern
  if (whiteListUrls.indexOf(event.request.url) > -1) {
    // if in cache, return it and save it
    event.respondWith(
      // caches == STATIC and RUNTIME
      caches.match(event.request).then(cachedResponse => {
        return (
          cachedResponse ||
          caches.open(RUNTIME_CACHE_NAME).then(cache => {
            return fetch(event.request).then(res => {
              return cache.put(event.request, res.clone()).then(() => res);
            });
          })
        );
      })
    );
  }

  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        // if in cache, return that || open RUNTIME_CACHE_NAME and cache it
        return (
          cachedResponse ||
          caches.open(RUNTIME_CACHE_NAME).then(cache => {
            return fetch(event.request).then(response => {
              // Put a copy of the response in the runtime cache.
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          })
        );
      })
    );
  }
});
