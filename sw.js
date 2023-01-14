const CACHE_NAME = "v6"

self.addEventListener("install", event => {
  self.skipWaiting()
})

self.addEventListener("activate", event=>{
  clients.claim()
  console.log(CACHE_NAME, "activate")
})

self.addEventListener("fetch", event => {
  console.log(CACHE_NAME)
  
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME)

    try {
      const fetchResponse = await fetch(event.request)
      cache.put(event.request, fetchResponse.clone())
      return fetchResponse
    } catch (e) {
      const cachedResponse = await cache.match(event.request)
      return cachedResponse;
    }
  })())
})