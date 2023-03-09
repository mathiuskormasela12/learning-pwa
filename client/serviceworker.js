const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
	'/',
	'/fallback.json',
	'/css/style.css',
	'/js/main.js',
	'/img/wp5556283.jpeg'
];

self.addEventListener('install', (event) => {
	// Perform Install steps
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('in install service worker... cache opened!');
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('active', (event) => {
	event.waitUntil(
		caches.keys().then(((cacheNames) => {
			return Promise.all(
				cacheNames
				.filter((cacheName) => {
					return cacheName !== CACHE_NAME;
				})
				.map((cacheName) => {
					return caches.delete(cacheName);
				})
			);
		}))
	);
});

// self.addEventListener('fetch', (event) => {
// 	event.respondWith(
// 		caches
// 		.match(event.request)
// 		.then((response) => {
// 			if(response) {
// 				return response;
// 			}

// 			return fetch(event.request);
// 		})
// 	);
// });

self.addEventListener('fetch', (event) => {
	const request = event.request;
	const url = new URL(request.url);

	// Separate API Request & Internal
	if(url.origin === location.origin) {
		event.respondWith(
			caches.match(request)
			.then((response) => {
				return response || fetch(request);
			})
		);
	} else {
		event.respondWith(
			caches.
			open('members-cache')
			.then((cache) => {
				return fetch(request)
				.then((liveResponse) => {
					cache.put(request, liveResponse.clone());
					return liveResponse;
				})
				.catch(() => {
					caches
					.match(request)
					.then((response) => {
						if(response) return response;
						return caches.match('/fallback.json');
					})
				})
			})
		);
	}
});