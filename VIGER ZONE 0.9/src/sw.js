// ===== ZETA v0.9 — Service Worker (Offline PWA) =====
const CACHE_NAME = 'zeta-v0.9';
const OFFLINE_URL = 'index.html';

const PRECACHE_URLS = [
    './',
    './index.html',
    './games.html',
    './tools.html',
    './settings.html',
    './changelog.html',
    './css/style.css',
    './js/main.js',
    './js/xp.js',
    './js/lang.js',
    './js/achievements.js',
    './js/lucky-spin.js',
    './js/vau-games.js',
    './js/core/state.js',
    './js/core/telegram.js',
    './js/core/music.js',
    './js/core/navigation.js',
    './css/vau-games.css',
    './assets/logo.svg',
    './assets/favicon.svg',
    './manifest.json',
    './tools/notes.html',
    './tools/daily-routine.html',
    './tools/unit-converter.html',
    './audio/night-chill.mp3',
    './audio/ocean-waves.mp3',
    './audio/lofi-beat.mp3'
];

// Install — precache core shell
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Pre-caching app shell');
            return cache.addAll(PRECACHE_URLS);
        })
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// Fetch — Network First, fallback to Cache
self.addEventListener('fetch', event => {
    // Skip non-GET and external requests
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // For API calls (Binance, etc.) — network only, no caching
    if (url.hostname !== self.location.hostname) return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone and cache successful responses
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Offline fallback — serve from cache
                return caches.match(event.request).then(cached => {
                    if (cached) return cached;
                    // Ultimate fallback for navigation — show home page
                    if (event.request.mode === 'navigate') {
                        return caches.match(OFFLINE_URL);
                    }
                    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
                });
            })
    );
});
