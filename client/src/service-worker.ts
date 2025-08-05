/// <reference lib="webworker" />
export default null;

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => {
  void self.skipWaiting();
});

self.addEventListener('activate', () => {
  console.log('Service worker activated');
});
