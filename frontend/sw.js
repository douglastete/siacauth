const resourcesToCache = ['index.html'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
      .open('v1')
      .then(function(cache) {
        return cache.addAll(resourcesToCache);
      })
      .then(self.skipWaiting())
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request)
          .then(function(response) {
            let responseClone = response.clone();

            caches.open('v1').then(function(cache) {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(function() {
            return caches.match('/sw-test/gallery/myLittleVader.jpg');
          });
      }
    })
  );
});
