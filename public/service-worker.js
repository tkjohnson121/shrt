const CACHE_NAME = '0.0.1';
const urlsToCache = ['/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

// add event listeners to handle any of PWA lifecycle event
// https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
self.addEventListener('installed', (event) => {
  self.skipWaiting();
  console.info(`SW: ${event.type} -> `, event);
});

self.addEventListener('controlling', (event) => {
  console.info(`SW: ${event.type} -> `, event);
});

self.addEventListener('activate', (event) => {
  console.info(`SW: ${event.type} -> `, event);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin

            return cacheName !== CACHE_NAME ? true : false;
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          }),
      );
    }),
  );
});

self.addEventListener('activated', (event) => {
  console.info(`SW: ${event.type} -> `, event);
});

// A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
// NOTE: set skipWaiting to false in next.config.js pwa object
// https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
self.addEventListener('waiting', (event) => {
  if (
    confirm(
      'A new version is installed, reload to use the new version immediately?',
    )
  ) {
    self.addEventListener('controlling', (event) => {
      window.location.reload();
    });
    self.messageSW({ type: 'SKIP_WAITING' });
  } else {
    // User rejected, new verion will be automatically load when user open the app next time.
  }
});

// ISSUE - this is not working as expected, why?
// I could only make message event listenser work when I manually add this listenser into sw.js file
self.addEventListener('message', (event) => {
  console.info(`SW: ${event.type} -> `, event);
});

self.addEventListener('redundant', (event) => {
  console.info(`SW: ${event.type} -> `, event);
});

self.addEventListener('externalinstalled', (event) => {
  console.info(`SW: ${event.type} -> `, event);
});

self.addEventListener('externalactivated', (event) => {
  console.info(`SW: ${event.type} -> `, event);
});

self.addEventListener('externalwaiting', (event) => {
  console.info(`SW: ${event.type} -> `, event);
});
