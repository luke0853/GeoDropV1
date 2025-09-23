// Combined Service Worker: PWA + Monetag
// Meta tag: <meta name="monetag" content="b00fce803326b992b17d240b6baadba4">

const CACHE_NAME = 'geodrop-v1';
const MONETAG_META = 'b00fce803326b992b17d240b6baadba4';

// Install event - PWA caching
self.addEventListener('install', function(event) {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache opened');
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/css/styles.css',
                    '/js/firebase.js',
                    '/js/navigation.js',
                    '/js/geocard.js',
                    '/js/mining-functions.js',
                    '/images/logo.png',
                    '/images/startseite-bg.png'
                ]);
            })
    );
    self.skipWaiting();
});

// Activate event - PWA activation
self.addEventListener('activate', function(event) {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - PWA + Monetag
self.addEventListener('fetch', function(event) {
    // Monetag ad requests - let through
    if (event.request.url.includes('monetag') || 
        event.request.url.includes('ads') ||
        event.request.url.includes('banner')) {
        console.log('Monetag ad request:', event.request.url);
        return;
    }
    
    // PWA caching for other requests
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Monetag verification
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'MONETAG_VERIFY') {
        event.ports[0].postMessage({
            verified: true,
            meta: MONETAG_META
        });
    }
});

console.log('Combined Service Worker loaded - PWA + Monetag');
console.log('Monetag meta:', MONETAG_META);