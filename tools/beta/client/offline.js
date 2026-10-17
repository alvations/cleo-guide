/* offline.js (platform): Cleo.offline — after the service worker registers, core.js loads it (Cleo.need('offline')) and
 * saves this page for offline. Lazy (eager-JS budget): nothing at first paint needs it. */
(function () {
  'use strict';
  var Cleo = window.Cleo; if (!Cleo || Cleo.offline) return;
  var emit = Cleo.emit;
  /* "Keep this page offline": the page + every same-origin file it loaded (CSS, JS, fonts, art) + its dataset. Runs
   * once the worker is active on every visit (the first page of a visit loads before the worker controls it), and on
   * demand via Cleo.offline.save(). Resolves {n, ok} from the worker, or rejects when there is no worker. */
  Cleo.offline = {
    urls: function () {
      var o = location.origin, out = [location.href.split('#')[0]], main = document.getElementById('main'), key = main && main.getAttribute('data-city');
      try { (performance.getEntriesByType('resource') || []).forEach(function (r) { if (r.name.indexOf(o) === 0) out.push(r.name); }); } catch (e) {}
      if (key) out.push(Cleo.root + 'data/places/' + key.replace(/\//g, '--') + '.json');
      return out.filter(function (u, i) { return out.indexOf(u) === i; });
    },
    save: function () {
      if (!navigator.serviceWorker) return Promise.reject(new Error('no service worker'));
      return navigator.serviceWorker.ready.then(function (reg) {
        return new Promise(function (ok) {
          var t = setTimeout(function () { ok({ n: 0, ok: 0, timeout: true }); }, 15000);
          navigator.serviceWorker.addEventListener('message', function h(e) { if (e.data && e.data.type === 'cached') { clearTimeout(t); navigator.serviceWorker.removeEventListener('message', h); emit('cleo:offline', e.data); ok(e.data); } });
          reg.active.postMessage({ type: 'cache', urls: Cleo.offline.urls() });
        });
      });
    }
  };
  if (Cleo.need && Cleo.need.done) Cleo.need.done('offline');
})();
