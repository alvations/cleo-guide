/* pack.js (platform, W9-8): "Keep <city> offline" — the offline city pack's API (Cleo.pack) and its control. Lazy:
 * core.js loads it with Cleo.need('pack') on idle where the page has [data-cleo-pack] (eager-JS budget, 2026-10-16).
 * data/packs/<page>.json lists the files; the service worker stores them in `cleo-packs`, which a deploy never wipes.
 * Content never depends on it: no worker, no Cache Storage, or any storage failure → the control stays hidden or says so,
 * and the page works as before. Tiles are never cached (the pack lists none). */
(function () {
  'use strict';
  var Cleo = window.Cleo; if (!Cleo || Cleo.pack) return;
  function emit(name, detail) {
    var ev; try { ev = new CustomEvent(name, { detail: detail }); } catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent(name, false, false, detail); }
    document.dispatchEvent(ev);
  }
  var swCall = function (msg, want) {
    return navigator.serviceWorker.ready.then(function (reg) { return new Promise(function (ok) {
      var t = setTimeout(function () { ok({ ok: 0, error: 'timeout' }); }, 120000);
      navigator.serviceWorker.addEventListener('message', function h(e) { if (e.data && e.data.type === want && e.data.key === msg.key) { clearTimeout(t); navigator.serviceWorker.removeEventListener('message', h); ok(e.data); } });
      reg.active.postMessage(msg);
    }); });
  };
  Cleo.pack = {
    manifest: function (key) { return fetch(Cleo.root + 'data/packs/' + key + '.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); },
    /** the stored record {key, date, bytes, stated, urls…} or null */
    state: function (key) {
      if (!window.caches) return Promise.resolve(null);
      return caches.open('cleo-packs').then(function (c) { return c.match(new URL('__pack/' + encodeURIComponent(key), new URL(Cleo.root, location.href)).href); })
        .then(function (r) { return r ? r.json() : null; }).catch(function () { return null; });
    },
    save: function (key) {
      return Cleo.pack.manifest(key).then(function (m) {
        var base = new URL(Cleo.root, location.href);
        return swCall({ type: 'pack', key: key, urls: m.files.map(function (f) { return new URL(f[0], base).href; }), meta: { name: m.name, bytes: m.bytes } }, 'packed');
      });
    },
    remove: function (key) { return swCall({ type: 'unpack', key: key }, 'unpacked'); }
  };
  var mb = function (n) { return n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; };
  var dayOf = function (iso) { try { return new Date(iso).toLocaleDateString(document.documentElement.lang || 'en', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return String(iso).slice(0, 10); } };
  // box: the build-rendered [data-cleo-pack] section (primary: it also refreshes a kept pack), or a copy from mount()
  function packUi(box, primary) {
    if (!box || !('serviceWorker' in navigator) || !window.caches || !/^https?:$/.test(location.protocol)) return;
    var key = box.getAttribute('data-key'), q = function (s) { return box.querySelector(s); };
    var keep = q('[data-pack="keep"]'), rm = q('[data-pack="remove"]'), size = q('[data-pack-size]'), done = q('[data-pack-done]'), msg = q('[data-pack-msg]');
    var paint = function (st) {
      keep.hidden = !!st; rm.hidden = !st; done.hidden = !st; if (size) size.hidden = !!st;
      if (st) done.textContent = done.getAttribute('data-l').replace('{date}', dayOf(st.date)) + ' · ' + mb(st.bytes);
    };
    Cleo.pack.manifest(key).then(function (m) {
      size.textContent = size.getAttribute('data-l').replace('{size}', mb(m.bytes)); box.hidden = false;
      return Cleo.pack.state(key).then(function (st) {
        paint(st);
        // a kept city refreshes itself on an online visit, so it follows deploys (PERF-13) without a tap
        if (primary && st && navigator.onLine !== false) Cleo.pack.save(key).then(function (r) { if (r && r.ok) Cleo.pack.state(key).then(paint); });
      });
    }).catch(function () { /* no manifest (offline first visit, or not built): the control stays hidden */ });
    keep.addEventListener('click', function () {
      keep.disabled = true; msg.textContent = msg.getAttribute('data-l-saving');
      Cleo.pack.save(key).then(function (r) {
        keep.disabled = false;
        if (!r || !r.ok || r.ok < r.n) { msg.textContent = msg.getAttribute('data-l-failed'); return; }
        msg.textContent = ''; emit('cleo:pack', r); return Cleo.pack.state(key).then(paint);
      }, function () { keep.disabled = false; msg.textContent = msg.getAttribute('data-l-failed'); });
    });
    rm.addEventListener('click', function () {
      Cleo.pack.remove(key).then(function () { paint(null); msg.textContent = msg.getAttribute('data-l-removed'); emit('cleo:pack', { removed: key }); });
    });
    // every copy of the control shows the same state: one kept or removed elsewhere repaints this one
    box._cleoPaint = function () { Cleo.pack.state(key).then(paint); };
    document.addEventListener('cleo:pack', box._cleoPaint);
  }
  /** OV-38: the same control in another place (a phone Atlas slot, where the build's section is kept off the map). Copies
   *  the build's section (its localised strings ride on data-l attributes), renames its ids, and binds it. The copy has no
   *  [data-cleo-pack], so the rule that hides that section on phone Atlas leaves it alone. Idempotent per host (FE-1's
   *  Layers popover `.m-pack` calls it on every open): later calls repaint the state. Returns the copy, or null. */
  Cleo.pack.mount = function (host) {
    var src = document.querySelector('[data-cleo-pack]'), had = host && host.querySelector('[data-cleo-pack-copy]'); if (!src || !host) return null;
    if (had) { if (had._cleoPaint) had._cleoPaint(); return had; }   // idempotent: a popover calls this on every open; later calls refresh
    var x = src.cloneNode(true); x.removeAttribute('data-cleo-pack'); x.setAttribute('data-cleo-pack-copy', ''); x.hidden = true;
    [].forEach.call(x.querySelectorAll('[id]'), function (e) { e.id += '-m'; });
    if (x.getAttribute('aria-labelledby')) x.setAttribute('aria-labelledby', x.getAttribute('aria-labelledby') + '-m');
    host.appendChild(x); packUi(x, false); return x;
  };
  packUi(document.querySelector('[data-cleo-pack]'), true);
  if (Cleo.need && Cleo.need.done) Cleo.need.done('pack');
})();
