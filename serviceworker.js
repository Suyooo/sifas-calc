self.addEventListener("install", function (evt) {
    console.log("[Calc SW] Installing new version.");
    evt.waitUntil(precache());
});

self.addEventListener("message", function (event) {
    if (event.data.action === "doUpdateRefresh") {
        self.skipWaiting();
    }
});

self.addEventListener("activate", function (evt) {
    console.log("[Calc SW] Update finished, waiting for reload.");
});

self.addEventListener("fetch", function (evt) {
    if (evt.request.url.startsWith(self.registration.scope)) {
        var filename = evt.request.url.substring(self.registration.scope.length);
        if (filename.length === 0) {
            //console.log("[Calc SW] Cache URL: " + evt.request.url);
            evt.respondWith(fromCache("index.html"));
        } else if (cache_files.has(filename)) {
            //console.log("[Calc SW] Cache URL: " + evt.request.url);
            evt.respondWith(fromCache(evt.request));
        } else {
            //console.log("[Calc SW] No Cache URL: " + evt.request.url);
            if (filename === "js/networkinfo.js") {
                evt.respondWith(fromNetwork(evt.request).catch(function () {
                    return fromCache("js/networkinfo_fallback.js");
                }));
            } else {
                evt.respondWith(fromNetwork(evt.request));
            }
        }
    } else {
        //console.log("[Calc SW] External URL: " + evt.request.url);
        evt.respondWith(fromNetwork(evt.request));
    }
});

function precache() {
    return caches.open(cache_name).then(function (cache) {
        return cache.addAll(Array.from(cache_files));
    });
}

function fromNetwork(request) {
    return new Promise(function (fulfill, reject) {
        fetch(request).then(function (response) {
            fulfill(response);
        }, reject);
    });
}


function fromCache(request) {
    return caches.open(cache_name).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject("request-not-in-cache");
        });
    });
}

var cache_name = "sifas-calc-cache";
// The declaration of cache_files is added by tools/build.sh, along with a timestamp so the SW is updated