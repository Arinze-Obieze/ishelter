// public/sw.js
const CACHE_NAME = 'ishelter-v1';

// Only cache essential files that definitely exist
const urlsToCache = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Use addAll with error handling
        return cache.addAll(urlsToCache).catch((error) => {
          console.log('Cache addAll error:', error);
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip caching for API routes and non-GET requests
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Only cache successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();
            
            // Cache it for future use (but don't wait for it)
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch(() => {
                // Silently fail if caching fails
              });

            return response;
          })
          .catch((error) => {
            // If fetch fails, just return the error
            // Don't try to cache failed requests
            console.log('Fetch failed:', error);
            throw error;
          });
      })
  );
});