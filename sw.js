// MHA v34: Supabase app shell cache for offline launch.
// Supabase authentication and data require an online connection.
const MHA_SW_VERSION = 'mha-supabase-v35-supabase';
const SHELL = [
  '/', '/index.html', '/app.js?v=34', '/supabase-adapter.js?v=34', '/manifest.webmanifest?v=34',
  '/icon-32.png', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png'
];
const EXTERNAL_LIBS = ['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(MHA_SW_VERSION);
    await Promise.all(SHELL.map(async path => { try { const r = await fetch(path, {cache:'reload'}); if (r.ok) await cache.put(path, r); } catch (_) {} }));
    await Promise.all(EXTERNAL_LIBS.map(async url => { try { const r = await fetch(url, {mode:'cors', cache:'reload'}); if (r.ok) await cache.put(url, r); } catch (_) {} }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('mha-project2-') && k !== MHA_SW_VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;
  const shellRequest = sameOrigin && (url.pathname === '/' || url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('.webmanifest') || url.pathname.endsWith('.png'));
  const supabaseLibRequest = url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('/@supabase/supabase-js');
  if (!shellRequest && !supabaseLibRequest) return;
  event.respondWith((async () => {
    const cache = await caches.open(MHA_SW_VERSION);
    try {
      const fresh = await fetch(event.request);
      if (fresh && fresh.ok) cache.put(event.request, fresh.clone()).catch(() => {});
      return fresh;
    } catch (_) {
      const cached = await cache.match(event.request, {ignoreSearch:true}) || await cache.match(url.href) || (sameOrigin ? await cache.match(url.pathname) : null);
      if (cached) return cached;
      if (sameOrigin && (url.pathname === '/' || url.pathname.endsWith('.html'))) return (await cache.match('/index.html')) || Response.error();
      return Response.error();
    }
  })());
});
