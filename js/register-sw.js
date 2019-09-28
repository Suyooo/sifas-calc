/**
 * @file Functions related to the service worker, registering it and handling update notifications.
 */

/**
 * Register the service worker, and listen for updates.
 */
navigator.serviceWorker.register('serviceworker.js').then(function (reg) {
    reg.addEventListener('updatefound', function () {
        reg.installing.addEventListener('statechange', function (evt) {
            if (evt.target.state === "installed") {
                // only show update notification if it's not the first visit - this value is null if no service
                // worker has been installed before this
                if (navigator.serviceWorker.controller) {
                    showUpdatePrompt(evt.target);
                }
            }
        });
    });
});


/**
 * Called after the listener finds an update and the update finishes installing.
 */
function showUpdatePrompt(waitingServiceWorker) {
    var t = M.toast({
        html: "<span>An update has been downloaded. You can apply it now by reloading, or wait until " +
        "your next visit.</span><div><a id='updateprompt-reload' class='btn-flat toast-action'>Reload</a><br>" +
        "<a id='updateprompt-dismiss' class='btn-flat toast-action'>Not Now</a></div>", displayLength: 60000
    });
    $("#updateprompt-reload", t.el).click(function () {
        // instead of just reloading, make the service worker skip waiting to make sure it's activated
        waitingServiceWorker.postMessage({action: "doUpdateRefresh"});
        // then wait for the controller change event to do the reload
        navigator.serviceWorker.addEventListener("controllerchange", function handler() {
            navigator.serviceWorker.removeEventListener("controllerchange", handler);
            window.location.reload();
        });
    });
    $("#updateprompt-dismiss", t.el).click(function () {
        t.dismiss();
    });
}