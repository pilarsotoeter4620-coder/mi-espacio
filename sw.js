// Service worker: deja abrir la app sin internet (guarda una copia de los archivos propios).
var V="mi-espacio-v2";
var ARCHIVOS=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(ARCHIVOS)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  var r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return; // Spotify, Gmail, etc. van directo a internet
  e.respondWith(caches.open(V).then(function(c){
    return c.match(r,{ignoreSearch:true}).then(function(hit){
      var red=fetch(r).then(function(res){if(res&&res.ok)c.put(r,res.clone());return res}).catch(function(){return hit});
      return hit||red; // abre rápido desde la copia y se actualiza solo
    });
  }));
});
