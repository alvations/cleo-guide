/* Cleo beta — core.js (platform). Shared by every beta page; classic script, no modules, no framework.
 * Provides window.Cleo: store (localStorage wrapped in try/catch, in-memory fallback), saved list,
 * hash router, share, lazy search index, service-worker registration. Nothing here is needed to READ a
 * page: all content is server-rendered, so this file failing costs features, never places. */
(function () {
  'use strict';
  var Cleo = window.Cleo = window.Cleo || {};

  // Site root, from this script's own URL (…/beta/assets/js/core.js → …/beta/).
  var me = document.currentScript && document.currentScript.src || '';
  Cleo.root = me ? me.replace(/assets\/js\/core\.js.*$/, '') : '';

  /* ---- storage: never throws (CLAUDE.md rule 5) ---- */
  var mem = {};
  function rawGet(k) {
    try { var v = window.localStorage.getItem(k); if (v !== null && v !== undefined) return v; } catch (e) {}
    return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
  }
  function rawSet(k, v) {
    mem[k] = v;
    try { window.localStorage.setItem(k, v); } catch (e) {}
  }
  Cleo.store = {
    get: function (k, d) { var v = rawGet('cleo:v1:' + k); if (v === null) return d; try { return JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { rawSet('cleo:v1:' + k, JSON.stringify(v)); }
  };

  function emit(name, detail) {
    var ev; try { ev = new CustomEvent(name, { detail: detail }); } catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent(name, false, false, detail); }
    document.dispatchEvent(ev);
  }
  Cleo.emit = emit;

  /* ---- saved places: { "<pageKey>/<placeId>": {t: savedAtMs} } ---- */
  Cleo.saved = {
    all: function () { var s = Cleo.store.get('saved', {}); return s && typeof s === 'object' ? s : {}; },
    has: function (ref) { return !!this.all()[ref]; },
    toggle: function (ref) {
      var s = this.all(); if (s[ref]) delete s[ref]; else s[ref] = { t: Date.now() };
      Cleo.store.set('saved', s); emit('cleo:saved', { ref: ref, on: !!s[ref] }); return !!s[ref];
    },
    add: function (refs) { var s = this.all(); refs.forEach(function (r) { if (!s[r]) s[r] = { t: Date.now() }; }); Cleo.store.set('saved', s); emit('cleo:saved', {}); },
    count: function () { return Object.keys(this.all()).length; }
  };

  /* ---- list codec: the share-link grammar for saved lists and day plans (platform contract) ----
   * refs are "<pageKey>/<placeId>"; on the wire they group by page:  tokyo:kanda-myojin,isegen;kyoto:x
   * Place ids are [a-z0-9-] and page keys [a-z0-9/-], so ':' ',' ';' never collide. */
  Cleo.listCodec = {
    encode: function (refs) {
      var by = {}, order = [];
      refs.forEach(function (r) { var i = r.lastIndexOf('/'); var k = r.slice(0, i); if (!by[k]) { by[k] = []; order.push(k); } by[k].push(r.slice(i + 1)); });
      return order.map(function (k) { return k + ':' + by[k].join(','); }).join(';');
    },
    decode: function (s) {
      var out = [];
      String(s || '').split(';').forEach(function (grp) {
        var i = grp.indexOf(':'); if (i < 1) { if (grp.indexOf('/') > 0) out.push(grp); return; }
        var k = grp.slice(0, i); grp.slice(i + 1).split(',').forEach(function (id) { if (id) out.push(k + '/' + id); });
      });
      return out;
    }
  };

  /* ---- hash router: #p=<id>&c=<collection>&cz=<cuisine>&mode=sights|food&q=<text> ---- */
  Cleo.route = {
    parse: function () {
      var h = location.hash.replace(/^#/, ''), o = {};
      if (!h || h.indexOf('=') < 0) return o;            // plain in-page anchors (#area-X) are not routes
      h.split('&').forEach(function (kv) {
        var i = kv.indexOf('='); if (i < 1) return;
        try { o[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1)); } catch (e) {}
      });
      return o;
    },
    href: function (o) {
      var parts = []; Object.keys(o).forEach(function (k) { if (o[k] !== undefined && o[k] !== null && o[k] !== '') parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(o[k])); });
      return parts.length ? '#' + parts.join('&') : '#';
    },
    go: function (o, replace) {
      var h = this.href(o);
      if (replace && history.replaceState) { history.replaceState(null, '', h === '#' ? location.pathname + location.search : h); emit('cleo:route', o); }
      else location.hash = h;
    }
  };

  /* ---- share: Web Share where available, clipboard otherwise ---- */
  Cleo.share = function (title, url) {
    if (navigator.share) return navigator.share({ title: title, url: url }).catch(function () {});
    try { if (navigator.clipboard) return navigator.clipboard.writeText(url).then(function () { emit('cleo:toast', 'Link copied'); }); } catch (e) {}
    window.prompt('Copy this link', url);
  };

  /* ---- lazy site-wide search index (beta/data/search.json) ---- */
  var idx = null;
  Cleo.searchIndex = function () {
    if (idx) return idx;
    idx = (window.fetch ? fetch(Cleo.root + 'data/search.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      : Promise.reject(new Error('no fetch')));
    idx.catch(function () { idx = null; });
    return idx;
  };
  var fold = function (s) { return String(s || '').normalize ? String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase() : String(s).toLowerCase(); };
  Cleo.fold = fold;
  /** All matches, best first. Every term must match name, area or guide name. Never truncated. */
  Cleo.search = function (data, q) {
    var terms = fold(q).split(/\s+/).filter(Boolean); if (!terms.length) return [];
    var out = [];
    data.items.forEach(function (it) {
      var pg = data.pages[it[0]], name = fold(it[2]), hay = name + ' ' + fold(it[6]) + ' ' + fold(pg[1]);
      for (var i = 0; i < terms.length; i++) if (hay.indexOf(terms[i]) < 0) return;
      var score = (name.indexOf(terms[0]) === 0 ? 0 : name.indexOf(terms[0]) >= 0 ? 1 : 2) * 10 + it[4] + (it[5] ? 5 : 0);
      out.push({ s: score, it: it, pg: pg });
    });
    out.sort(function (a, b) { return a.s - b.s; });
    return out;
  };

  /* ---- per-page dataset (beta/data/places/<fileKey>.json): sources index, art projections, stats ---- */
  var pd = {};
  Cleo.pageData = function (key) {
    var f = String(key || '').replace(/\//g, '--');
    if (!pd[f]) {
      pd[f] = window.fetch ? fetch(Cleo.root + 'data/places/' + f + '.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        : Promise.reject(new Error('no fetch'));
      pd[f].catch(function () { delete pd[f]; });
    }
    return pd[f];
  };

  /* ---- "your guide" data (build-time, tools/beta/lib/guide.js): signature, foodOrder, days, closed ---- */
  Cleo.guide = function (key) { return Cleo.pageData(key).then(function (d) { return d.guide; }); };

  /* ---- distances (day-plan legs, opt-in Near me). Always straight-line (VOICE.md rule 9). The position a
   * caller passes in is never stored or sent anywhere by this file. ---- */
  Cleo.geo = {
    km: function (a, b) {                              // a, b: {la, ln} or [lat, lng]
      var A = a.length ? { la: a[0], ln: a[1] } : a, B = b.length ? { la: b[0], ln: b[1] } : b, t = Math.PI / 180;
      var h = Math.pow(Math.sin((B.la - A.la) * t / 2), 2) + Math.cos(A.la * t) * Math.cos(B.la * t) * Math.pow(Math.sin((B.ln - A.ln) * t / 2), 2);
      return 2 * 6371.0088 * Math.asin(Math.min(1, Math.sqrt(h)));
    },
    fmt: function (km) { return km < 0.1 ? 'next door (under 0.1 km straight-line)' : (km < 10 ? km.toFixed(1) : Math.round(km)) + ' km straight-line'; },
    ll: function (el) { var v = (el && el.getAttribute('data-ll') || '').split(','); return v.length === 2 ? [+v[0], +v[1]] : null; }
  };

  /* ---- map art (build-time SVG from verified pins, tools/beta/lib/art.js): place a locator dot ----
   * proj = {w,h,pad,box:[minLat,minLng,maxLat,maxLng],kx,ky}; returns [x,y] in the SVG's own units. */
  Cleo.art = {
    xy: function (proj, la, ln) {
      return [proj.pad + (ln - proj.box[1]) * proj.kx, proj.pad + (proj.box[2] - la) * proj.ky];
    }
  };

  /* ---- tiles: report a base layer that never loads (blocked network, tile host down) ----
   * Calls onFail once when `n` tile errors arrive before any tile loads, so the page can keep the
   * data-drawn schematic and say "Map tiles couldn't load" instead of showing a grey box. */
  Cleo.watchTiles = function (layer, onFail, n) {
    var errs = 0, ok = false, done = false; n = n || 4;
    layer.on('tileload', function () { ok = true; });
    layer.on('tileerror', function () { if (!ok && !done && ++errs >= n) { done = true; onFail(); } });
  };

  /* ---- tiles failed: drop the dead map, show the build-time schematic + the VOICE.md copy ---- */
  Cleo.mapFallback = function (el, map) {
    try { if (map && map.remove) map.remove(); } catch (e) {}
    var art = el.getAttribute('data-art'), alt = el.getAttribute('data-art-alt') || '';
    el.innerHTML = (art ? '<figure class="map-art map-fallback"><img alt="" decoding="async" style="max-width:100%;height:auto"><figcaption></figcaption></figure>'
      : '<div class="map-fallback"><p></p></div>');
    var img = el.querySelector('img'); if (img) { img.src = art; img.alt = alt; }
    var cap = el.querySelector('figcaption, p');
    cap.innerHTML = '<strong>The map couldn\u2019t load.</strong> The list still has every place, address and source. ' +
      'We\u2019re showing map art from our own pins until tiles return. <button type="button" class="map-retry">Try again</button>';
    cap.querySelector('button').addEventListener('click', function () { location.reload(); });
    el.setAttribute('data-tiles', 'failed');
    emit('cleo:tiles-failed', {});
  };

  /* ---- progressive rendering (M3-06; tools/beta/lib/chunk.js): later cards ship inside
   * <noscript data-cleo-defer> — raw text while JS runs, real HTML when it doesn't. Stamp a chunk as its list
   * nears the viewport, and stamp EVERYTHING before anything that must see every place: a route/deep link, a
   * lens, the tray, the filter box, a source chip, the map toggle, find-in-page, print. Each stamp emits
   * `cleo:stamped` {cards} synchronously, so page scripts adopt the new cards before their own handlers run. ---- */
  var D = Cleo.defer = {
    pending: function () { return [].slice.call(document.querySelectorAll('noscript[data-cleo-defer]')); },
    stamp: function (ns) {
      if (!ns || !ns.parentNode) return [];
      var t = document.createElement('template'), ol = ns.parentNode;
      t.innerHTML = ns.children && ns.children.length ? ns.innerHTML : ns.textContent;   // scripting off in this parser → already elements
      var cards = [].slice.call(t.content.querySelectorAll('li.pl'));
      ol.insertBefore(t.content, ns); ol.removeChild(ns);
      var gap = ol.querySelector('.cleo-defer-gap');
      if (gap) { var left = 0; [].forEach.call(ol.querySelectorAll('noscript[data-cleo-defer]'), function (x) { left += +x.getAttribute('data-n') || 0; });
        if (left) gap.style.height = Math.round(left * (+gap.getAttribute('data-est') || 0)) + 'px'; else ol.removeChild(gap); }
      if (cards.length) emit('cleo:stamped', { cards: cards });
      return cards;
    },
    all: function () { var out = []; D.pending().forEach(function (ns) { out = out.concat(D.stamp(ns)); }); if (io) { io.disconnect(); io = null; } return out; },
    /** Stamp the chunk holding place `id` (a map pin of a not-yet-stamped card). Returns the card or null. */
    stampFor: function (id) {
      var el = document.getElementById('p-' + id); if (el) return el;
      var hit = D.pending().filter(function (ns) { return ns.textContent.indexOf('id="p-' + id + '"') >= 0 || ns.innerHTML.indexOf('id="p-' + id + '"') >= 0; })[0];
      if (hit) D.stamp(hit);
      return document.getElementById('p-' + id);
    },
    /** Lightweight stand-ins for unstamped cards, parsed from their start tags only: {id, getAttribute, hasAttribute}.
     *  Enough to draw a map pin (data-ll, data-n, data-a, data-t, data-closed) without building the card. */
    peek: function () {
      var out = [];
      D.pending().forEach(function (ns) {
        var src = ns.children && ns.children.length ? ns.innerHTML : ns.textContent, re = /<li class="pl[ "][^>]*>/g, m;
        while ((m = re.exec(src))) {
          var at = {}, a = /([a-z-]+)(?:="([^"]*)")?/g, x, tag = m[0].slice(3, -1);
          while ((x = a.exec(tag))) at[x[1]] = x[2] === undefined ? '' : x[2].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
          out.push({ id: at.id, stub: true, getAttribute: function (k) { return Object.prototype.hasOwnProperty.call(this._a, k) ? this._a[k] : null; },
            hasAttribute: function (k) { return Object.prototype.hasOwnProperty.call(this._a, k); }, _a: at });
        }
      });
      return out;
    }
  };
  var io = null;
  function deferInit() {
    var list = D.pending(); if (!list.length) return;
    var h = location.hash;
    // anything addressed by the URL (a place, a lens, an area anchor) needs every card now; so does a browser
    // without IntersectionObserver (and jsdom) — degrade to "all cards", never to "some cards"
    if ((h && h !== '#') || !('IntersectionObserver' in window)) {
      D.all();
      if (h && h !== '#') emit('cleo:route', {});     // page scripts that already routed (inline/jsdom order) route again
      return;
    }
    // hold each deferred list's height so the scrollbar and anchors don't jump while it is unstamped
    var live = document.querySelector('ol.pls'), cards = live ? live.querySelectorAll(':scope > li.pl') : [];
    var est = cards.length && live.offsetHeight ? live.offsetHeight / cards.length : 0;
    // watch the card just before each list's next chunk (or the list itself when it has no live card); when it
    // nears the viewport, stamp that one chunk and move the watch to the new last card
    var watch = function (ol) {
      var ns = ol.querySelector('noscript[data-cleo-defer]'); if (!ns || !io) return;
      var t = ns.previousElementSibling || ol; t._cleoNext = ns; io.observe(t);
    };
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting || !io) return;
        io.unobserve(e.target);
        var ns = e.target._cleoNext, ol = ns && ns.parentNode; e.target._cleoNext = null;
        if (ol) { D.stamp(ns); watch(ol); }
      });
    }, { rootMargin: '1200px 0px' });
    list.forEach(function (ns) {
      var ol = ns.parentNode; if (ol.getAttribute('data-cleo-deferred')) return;
      ol.setAttribute('data-cleo-deferred', '1');
      if (est) {                                    // a spacer (not min-height: grid rows would stretch to fill it)
        var n = 0; [].forEach.call(ol.querySelectorAll('noscript[data-cleo-defer]'), function (x) { n += +x.getAttribute('data-n') || 0; });
        var g = document.createElement('div'); g.className = 'cleo-defer-gap'; g.setAttribute('aria-hidden', 'true'); g.setAttribute('data-est', est.toFixed(1));
        g.style.cssText = 'grid-column:1/-1;margin:0;padding:0;border:0;height:' + Math.round(n * est) + 'px';
        ol.appendChild(g);
      }
      watch(ol);
    });
    var allNow = function () { if (D.pending().length) D.all(); };
    window.addEventListener('hashchange', allNow);                 // registered before any page script's listener
    document.addEventListener('cleo:route', allNow);
    window.addEventListener('beforeprint', allNow);
    var NEEDS_ALL = '[data-mode],[data-cleo-all],.rail-i,.pl-s button.src,[data-cleo-tray],[data-cleo-map],[data-unset],[data-tr],[data-cleo-day],[data-cleo-near],[data-cleo-foryou],[data-cleo-mine]';
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest(NEEDS_ALL)) allNow(); }, true);
    document.addEventListener('focusin', function (e) { if (e.target.matches && e.target.matches('#cleo-filter,main input[type=search]')) allNow(); }, true);
    document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F' || e.key === 'g')) allNow(); }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', deferInit); else deferInit();

  /* ---- saved counter in the site bar ---- */
  function paintCount() {
    var n = Cleo.saved.count();
    Array.prototype.forEach.call(document.querySelectorAll('[data-cleo-saved-count]'), function (el) { el.textContent = n ? String(n) : ''; });
  }
  document.addEventListener('cleo:saved', paintCount);
  document.addEventListener('DOMContentLoaded', paintCount);

  /* ---- offline: register the service worker on http(s) only ---- */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && Cleo.root) {
    window.addEventListener('load', function () { navigator.serviceWorker.register(Cleo.root + 'sw.js').catch(function () {}); });
  }
})();
