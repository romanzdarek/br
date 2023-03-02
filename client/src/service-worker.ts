const cacheName = 'mini-battle-royal-v2';
//const cachedFiles = ['./index.html', './js/app.js'];
const cachedFiles = [];

self.addEventListener('install', (e: any) => {
	console.log('Install!');
	/*
	e.waitUntil(
		caches.open(cacheName).then((cache) => {
			return cache.addAll(cachedFiles);
		})
	);
	*/
});

self.addEventListener('activate', () => {
	console.log('Activate!');
});

// Network only!
/*
self.addEventListener('fetch', (e: any) => {
	e.respondWith(fetch(e.request));
});
*/

/*
//Cache falling back to the network
self.addEventListener('fetch', function (event: any) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});

//Network falling back to the cache
self.addEventListener('fetch', function (event: any) {
	event.respondWith(
		fetch(event.request).catch(function () {
			return caches.match(event.request);
		})
	);
});
*/

// Cache and update with stale-while-revalidate policy.

self.addEventListener('fetch', (event: any) => {
	const { request } = event;

	// Prevent Chrome Developer Tools error:
	// Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': 'only-if-cached' can be set only with 'same-origin' mode
	//
	// See also https://stackoverflow.com/a/49719964/1217468
	if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
		return;
	}

	event.respondWith(
		(async function () {
			const cache = await caches.open(cacheName);

			const cachedResponsePromise = await cache.match(request);
			let networkResponsePromise = fetch(request);

			if (request.url.startsWith(self.location.origin)) {
				event.waitUntil(
					(async function () {
						const networkResponse = await networkResponsePromise;
						await cache.put(request, networkResponse.clone());
					})()
				);
			}

			return cachedResponsePromise || networkResponsePromise;
		})()
	);
});
