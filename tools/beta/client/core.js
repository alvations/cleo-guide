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
