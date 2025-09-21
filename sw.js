// GeoDrop Service Worker
const CACHE_NAME = 'geodrop-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/logo.png',
  '/css/styles.css',
  '/js/common.js',
  '/js/firebase.js',
  '/js/navigation.js'
];

// Install event
self.addEventListener('install', function(event) {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 Caching app shell');
        return cache.addAll(urlsToCache).catch(function(error) {
          console.log('⚠️ Cache addAll failed:', error);
          // Cache einzelne Dateien falls addAll fehlschlägt
          return Promise.all(
            urlsToCache.map(function(url) {
              return cache.add(url).catch(function(err) {
                console.log('⚠️ Failed to cache:', url, err);
                return Promise.resolve(); // Ignoriere Fehler für einzelne URLs
              });
            })
          );
        });
      })
      // .then(function() {
      //   // Force activation of new service worker
      //   console.log('🔄 Forcing service worker activation...');
      //   return self.skipWaiting();
      // })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          console.log('📦 Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request).catch(function() {
          // Return offline page if available
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      }
    )
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  console.log('✅ Service Worker activated');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    // }).then(function() {
    //   // Take control of all clients immediately
    //   console.log('🎯 Taking control of all clients...');
    //   return self.clients.claim();
    // })
  );
});

// Background sync for offline actions
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline actions when connection is restored
  return Promise.resolve();
}
