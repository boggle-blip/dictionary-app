const CACHE_NAME = 'dictionary-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './dictionary.csv',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});