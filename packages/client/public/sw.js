const CACHE_NAME = 'great-game-cache-__BUILD_VERSION__'

const URLS = self.__SW_MANIFEST__ || ['/']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log('Service Worker: кеш открыт')
      await cache.addAll(URLS)
      await self.skipWaiting()
    })
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(async cacheNames => {
      await Promise.all(
        cacheNames
          .filter(
            name => name.startsWith('great-game-cache-') && name !== CACHE_NAME
          )
          .map(name => caches.delete(name))
      )
      await self.clients.claim()
    })
  )
})

self.addEventListener('fetch', event => {
  const request = event.request

  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)

  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return
  }

  event.respondWith(
    fetch(request).catch(async () => {
      if (request.mode === 'navigate') {
        return (await caches.match('/index.html')) || Response.error()
      }

      return (await caches.match(request)) || Response.error()
    })
  )
})
