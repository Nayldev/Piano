const CACHE_NAME = `v44`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(['/']);
  })());
});

self.addEventListener("activate", event=>{
  clients.claim()
  console.log(CACHE_NAME, "activate")
})

self.addEventListener('fetch', event => {
  console.log(CACHE_NAME)
  fetch("https://www.google.com/webhp?source=hp&ei=__rCY_GBOvWdkdUPz4e3sAo&iflsig=AK50M_UAAAAAY8MJD7SJKIGC19mAa-624vczHY1xbPwb").then(r=>{
    console.log(r)
  })
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      // Try to fetch the resource from the network.
      const fetchResponse = await fetch(event.request);

      // Save the resource in the cache.
      cache.put(event.request, fetchResponse.clone());

      // And return it.
      return fetchResponse;
    } catch (e) {
      // Fetching didn't work get the resource from the cache.
      const cachedResponse = await cache.match(event.request);

      // And return it.
      return cachedResponse;
    }
  })());
});