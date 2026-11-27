var V = 'sd8', VV = 'sd4v';
var CORE = ["favicon.ico","app.css","app.js","feat.js","font.css","icon.svg","manifest.webmanifest","vbtn.js","welcome.js","stickers.js","stickers2.js","stickers3.js","stickers4.js","stickers5.js","stickers6.js","stickers7.js","stickers8.js","stickers9.js","stickers10.js","mcq.json","defs.json","search-index.json","cards.html","contact.html","corp.html","corp1.html","corp2.html","corp3.html","corp4.html","corp5.html","crisis.html","crisis1.html","crisis2.html","crisis3.html","dash.html","explain.html","index.html","law.html","law1.html","law2.html","law3.html","mock.html","ops.html","ops1.html","ops2.html","ops3.html","ops4.html","pf.html","pf1.html","pf2.html","pf3.html","pfb1.html","pfb2.html","pfb3.html","practice.html","report.html","report1.html","report2.html","report3.html","report4.html","report5.html","tips.html","words.html","search.html","term2/","term2/index.html"];
self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(V).then(function (c) {
      return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); }));
    })
  );
});
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (k) {
      return Promise.all(k.filter(function (n) { return n !== V && n !== VV; }).map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});
function serveVid(hit, r) {
  var rg = r.headers.get('range');
  if (!rg) return hit;
  return hit.arrayBuffer().then(function (buf) {
    var m = /bytes=(\d+)-(\d*)/.exec(rg) || [];
    var s = +m[1] || 0;
    var e2 = m[2] ? Math.min(+m[2], buf.byteLength - 1) : Math.min(s + 1048575, buf.byteLength - 1);
    return new Response(buf.slice(s, e2 + 1), { status: 206, headers: { 'Content-Range': 'bytes ' + s + '-' + e2 + '/' + buf.byteLength, 'Accept-Ranges': 'bytes', 'Content-Type': 'video/mp4', 'Content-Length': e2 - s + 1 } });
  });
}
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (/\.mp4($|\?)/.test(r.url)) {
    e.respondWith(caches.open(VV).then(function (c) {
      return c.match(r.url.split('?')[0]).then(function (hit) {
        if (hit) return serveVid(hit, r);
        return fetch(new Request(r.url.split('?')[0])).then(function (full) {
          if (full.ok && full.status === 200) c.put(r.url.split('?')[0], full.clone()).catch(function () {});
          return serveVid(full, r);
        });
      });
    }));
    return;
  }
  e.respondWith(
    fetch(new Request(r, { cache: 'no-cache' })).then(function (x) {
      var c = x.clone();
      caches.open(V).then(function (s) { s.put(r, c); }).catch(function () {});
      return x;
    }).catch(function () {
      return caches.match(r, { ignoreSearch: true }).then(function (m) {
        if (m) return m;
        return r.mode === 'navigate' ? caches.match('index.html') : Response.error();
      });
    })
  );
});
