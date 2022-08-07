// installing service working, adding files to precache, so that app can use the cache
// setting up event listeners
// service workers run before window object gets created so we don't use window.addEventListener

// defining files we'd like to cache
const FILES_TO_CACHE = [
	"./index.html",
	"./events.html",
	"./tickets.html",
	"./schedule.html",
	"./assets/css/style.css",
	"./assets/css/bootstrap.css",
	"./assets/css/tickets.css",
	"./dist/app.bundle.js",
	"./dist/events.bundle.js",
	"./dist/tickets.bundle.js",
	"./dist/schedule.bundle.js"
];

// more global constants needed
const APP_PREFIX = 'FoodFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;


self.addEventListener('install', function (e) {
	// tells browser to wait until work is complete before terminating service worker
	// ensures service worker doesn't mvoe on from installing phase until it's finished executing all its code
	e.waitUntil(
		// find specific cache by NAME, then add every file to FILES_TO_CACHE array to cache
		caches.open(CACHE_NAME).then(function (cache) {
			console.log('installing cache : ' + CACHE_NAME);
			return cache.addAll(FILES_TO_CACHE);
		})
	)
})

// clearing out any old data from cache, and tell service worker how to manage caches
self.addEventListener('activate', function (e) {
	e.waitUntil(
		// keys() returns array of all cache names, which we're calling keyList.
		// keyList is parameter that contains all cache names under <username>.github.io
		// filtering out caches that have app prefix, capture the ones that have prefix, stored in APP_PREFIX, and save them to array caleld cacheKeepList with .filter() method
		caches.keys().then(function (keyList) {
			let cacheKeepList = keyList.filter(function (key) {
				return key.indexOf(APP_PREFIX);
			});
			cacheKeepList.push(CACHE_NAME);


			return Promise.all(keyList.map(function (key, i) {
				if (cacheKeepList.indexOf(key) === -1) {
					console.log('deleting cache : ' + keyList[i]);
					return caches.delete(keyList[i]);
				}
			})
			);
		})
	);
});

// retrieving information from cache
self.addEventListener('fetch', function (e) {
	console.log('fetch request : ' + e.request.url)
	e.respondWith(
		caches.match(e.request).then(function (request) {
			if (request) { //if cache is available, respond with cache
				console.log('responding with cache : ' + e.request.url)
				return request;
			} else { // if there are no cache, try fetching request
				console.log('file is not cached, fetching : ' + e.request.url)
				return fetch(e.request);
			}

			// can omit if/else for console.log & put one line below like this too.
			// return request || fetch(e.request)
		})
	)
})

