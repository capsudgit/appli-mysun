workbox.setConfig({
  debug: false
})

// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)

// lines needed to download all assets in __precacheManifest to app storage

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
workbox.routing.registerNavigationRoute('/index.html')

workbox.skipWaiting()
workbox.clientsClaim()

// workbox.routing.registerRoute(
//     new RegExp('http:\/\/groupe-capsud.com\/.*'),
//     workbox.strategies.networkFirst({
//         cacheName: 'apiHttp',
//         networkTimeoutSeconds: 5
//     })
// )
// workbox.routing.registerRoute(
//     new RegExp('https:\/\/groupe-capsud.com\/.*'),
//     workbox.strategies.networkFirst({
//         cacheName: 'apiHttps',
//         networkTimeoutSeconds: 5
//     })
// )
