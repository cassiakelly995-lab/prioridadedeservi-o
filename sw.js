// Service worker: guarda o app para funcionar sem internet.
// Ao mudar qualquer arquivo, aumente o número de CACHE para forçar a atualização.
const CACHE="psv-v5";
const ARQUIVOS=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","maskable-512.png","apple-touch-icon.png","favicon-32.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Estratégia: usa o cache na hora e atualiza em segundo plano (stale-while-revalidate)
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(c=>{
    const rede=fetch(e.request).then(r=>{if(r&&r.ok&&new URL(e.request.url).origin===location.origin){const cp=r.clone();caches.open(CACHE).then(x=>x.put(e.request,cp))}return r}).catch(()=>c);
    return c||rede;
  }));
});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window"}).then(l=>l.length?l[0].focus():self.clients.openWindow("./")))});
