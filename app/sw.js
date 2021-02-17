self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll([
                "./",
                "./app.js",
                "./style.css",
                "./extensions/JQuery/jquery.js",
                "./extensions/Bootstrap/bootstrap.min.css",
            ]);
        })
    );
    console.log("ServiceWorker installed!");
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            return res || fetch(e.request);
        })
    );
});