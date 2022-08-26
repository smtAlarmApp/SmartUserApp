'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "d9bffe8abd926f80272655dfedb752dc",
"index.html": "24537ab4fb8c05ff31f676d91067d4bc",
"/": "24537ab4fb8c05ff31f676d91067d4bc",
"main.dart.js": "429e72f09eca86eccf3e062f53485e94",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "445624b61fbcba12c2647599b180cb29",
"assets/AssetManifest.json": "09b92327cff850527780bd42e0f16b82",
"assets/NOTICES": "f8b2a361e8979912aedb0a52f758a789",
"assets/FontManifest.json": "e3f27be5eef0deb9d12546f23e79edab",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/icons/add.png": "50ee1701bac6d94ffde05f6de7d116a2",
"assets/assets/icons/snoghte.png": "fd90bb3246b50d0ca50cc9b27009df4d",
"assets/assets/icons/ic_circle_yellow_off.png": "77ba93876b03ec5a75e1a95cf8645423",
"assets/assets/icons/ic_on_lamp.png": "f264d9bd1a8a9425cfacf6c3a4d22690",
"assets/assets/icons/ic_home.png": "8e0e19e3a41a84692968abaceafb130f",
"assets/assets/icons/ic_stop.png": "69111f410910bf5cd5cf5bff43947595",
"assets/assets/icons/ic_lock.png": "8360666a01635aa3431869743fb66782",
"assets/assets/icons/home.png": "dca21620a5d0f3dd3ae585d3e5b491ac",
"assets/assets/icons/ic_intersection_wite.svg": "1601f9d702c97f6dc2fec0b29450c463",
"assets/assets/icons/ic_circle_graw_off.png": "87df516d4f1d4ccdd667ff5fa91c2622",
"assets/assets/icons/ic_intersection.svg": "cde1f772c51a58aa9144fbce268e773e",
"assets/assets/icons/menu.png": "9b8ea9cdcb090423ba4add1e31129f82",
"assets/assets/icons/ic_circle_graw.png": "34a28ed5e27d51d0eda42fd2721ad847",
"assets/assets/icons/ic_lock_off.png": "e83cef79691efa916601114f0ac24269",
"assets/assets/icons/logo.png": "2ae10198cca8d42dda051c66132e939b",
"assets/assets/icons/ic_quiz.png": "aa320e52655daa8b932ea303e6eba286",
"assets/assets/icons/offon.png": "040a10ffd0dd367ad5224a9f245565dd",
"assets/assets/icons/edit.png": "15abfbefa0ab8ae856aecad502152e10",
"assets/assets/icons/trash.png": "3f5fcf25a981da717234932a799fbbdd",
"assets/assets/icons/ic_circle_yellow.png": "86fa4006bbacebf484abd8f8d278d1e7",
"assets/assets/icons/ic_call.png": "758698ece2c4a9cc642820da2df8e75b",
"assets/assets/icons/ic_door.png": "730977b70f1a3f5a3ecfcade6086760c",
"assets/assets/icons/ic_off_lamp.png": "42b7636111a863e9af92cf4cccc84c2c",
"assets/assets/fonts/B%2520Yekan.ttf": "c843a31fadf883f2c603a5095ec6b9f5",
"assets/assets/fonts/IRANSans(FaNum).ttf": "1f20916062d2a26389128449c4823825",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
