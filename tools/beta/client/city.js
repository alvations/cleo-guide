/* Cleo beta — city.js (lane FE-A). Progressive enhancement over the server-rendered city list:
 * filters (mode / collection / cuisine / text), deep links (#p=<id>), saved places, and the map.
 * Filters are lenses: they hide cards, never remove them, and "All" is always one tap away. */
(function () {
  'use strict';
  var Cleo = window.Cleo || {};
  var main = document.getElementById('main');
  if (!main) return;
  var cityKey = main.getAttribute('data-city');
  var cards = Array.prototype.slice.call(document.querySelectorAll('li.pl'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('section.area'));
  var pid = function (c) { return c.id.slice(2); };          // <li id="p-<placeId>">
  var byId = {}; cards.forEach(function (c) { byId[pid(c)] = c; });
  var geo = {}; try { geo = JSON.parse(document.getElementById('cleo-city').textContent); } catch (e) {}
  var state = { mode: 'all', c: '', cz: '', q: '' };
  var fold = Cleo.fold || function (s) { return String(s || '').toLowerCase(); };
  var text = {}; cards.forEach(function (c) { text[pid(c)] = fold(c.textContent); });

  /* ---- toolbar ---- */
  var bar = document.querySelector('[data-cleo-toolbar]');
  var countEl;
  if (bar) {
    var nS = cards.filter(function (c) { return c.getAttribute('data-k') === 's'; }).length;
    bar.innerHTML =
      '<div class="modes" role="group" aria-label="Show">' +
      '<button type="button" data-mode="all" aria-pressed="true">All <span class="n">' + cards.length + '</span></button>' +
      '<button type="button" data-mode="sights" aria-pressed="false">Sights <span class="n">' + nS + '</span></button>' +
      '<button type="button" data-mode="food" aria-pressed="false">Eat &amp; drink <span class="n">' + (cards.length - nS) + '</span></button>' +
      '</div>' +
      '<label class="vh" for="cleo-filter">Filter this guide</label>' +
      '<input id="cleo-filter" type="search" placeholder="Filter this guide" autocomplete="off">' +
      '<p class="shown" aria-live="polite"></p>';
    bar.hidden = false;
    countEl = bar.querySelector('.shown');
    bar.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-mode]'); if (!b) return;
      var r = Cleo.route.parse(); r.mode = b.getAttribute('data-mode') === 'all' ? '' : b.getAttribute('data-mode'); delete r.p;
      Cleo.route.go(r);
    });
    var t; bar.querySelector('#cleo-filter').addEventListener('input', function (e) {
      clearTimeout(t); var v = e.target.value; t = setTimeout(function () { state.q = v; apply(); }, 120);
    });
  }

  /* ---- collection rail: buttons (JS-only lenses), revealed once this script runs ---- */
  var rail = document.querySelector('[data-cleo-rail]'); if (rail) rail.hidden = false;
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.rail-i'); if (!b) return;
    if (b.hasAttribute('data-cleo-all')) { state.q = ''; var f = document.getElementById('cleo-filter'); if (f) f.value = ''; Cleo.route.go({}); return; }
    var r = {};
    if (b.hasAttribute('data-c')) r.c = b.getAttribute('data-c'); else r.cz = b.getAttribute('data-cz');
    if (state.mode !== 'all') r.mode = state.mode;
    Cleo.route.go(r);
  });

  function visible(c) {
    var id = pid(c);
    if (state.mode === 'sights' && c.getAttribute('data-k') !== 's') return false;
    if (state.mode === 'food' && c.getAttribute('data-k') !== 'f') return false;
    if (state.c && (' ' + (c.getAttribute('data-g') || '') + ' ').indexOf(' ' + state.c + ' ') < 0) return false;
    if (state.cz && (' ' + (c.getAttribute('data-cz') || '') + ' ').indexOf(' ' + state.cz + ' ') < 0) return false;
    if (state.q) { var terms = fold(state.q).split(/\s+/); for (var i = 0; i < terms.length; i++) if (terms[i] && text[id].indexOf(terms[i]) < 0) return false; }
    return true;
  }

  function apply() {
    var n = 0;
    cards.forEach(function (c) { var v = visible(c); c.hidden = !v; if (v) n++; });
    sections.forEach(function (s) { s.hidden = !s.querySelector('li.pl:not([hidden])'); });
    if (countEl) countEl.textContent = n === cards.length ? 'Showing all ' + n + ' places' : 'Showing ' + n + ' of ' + cards.length + ' places';
    if (bar) Array.prototype.forEach.call(bar.querySelectorAll('[data-mode]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === state.mode)); });
    Array.prototype.forEach.call(document.querySelectorAll('.rail-i'), function (a) {
      var on = (a.hasAttribute('data-c') && a.getAttribute('data-c') === state.c) || (a.hasAttribute('data-cz') && a.getAttribute('data-cz') === state.cz)
        || (a.hasAttribute('data-cleo-all') && !state.c && !state.cz && state.mode === 'all' && !state.q);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    syncMarkers();
  }

  function onRoute() {
    var r = Cleo.route.parse();
    // A card title links to its own anchor (#p-<id>), which works with no JS; treat it as a place route too.
    var m = /^#p-(.+)$/.exec(location.hash); if (m && byId[decodeURIComponent(m[1])]) r.p = decodeURIComponent(m[1]);
    state.mode = r.mode === 'sights' || r.mode === 'food' ? r.mode : 'all';
    state.c = r.c || ''; state.cz = r.cz || '';
    if (r.q !== undefined) { state.q = r.q; var f = document.getElementById('cleo-filter'); if (f) f.value = r.q; }
    var target = r.p && byId[r.p];
    if (target && !visible(target)) { state.mode = 'all'; state.c = ''; state.cz = ''; state.q = ''; }
    apply();
    Array.prototype.forEach.call(document.querySelectorAll('li.pl.is-target'), function (c) { c.classList.remove('is-target'); });
    if (target) {
      target.classList.add('is-target');
      if (target.scrollIntoView) target.scrollIntoView({ block: 'center' });
      var link = target.querySelector('.pl-n a'); if (link && link.focus) link.focus({ preventScroll: true });
      focusMarker(r.p);
    }
  }
  window.addEventListener('hashchange', onRoute);
  document.addEventListener('cleo:route', onRoute);

  /* ---- saved places ---- */
  function paintSaved() {
    var s = Cleo.saved ? Cleo.saved.all() : {};
    cards.forEach(function (c) {
      var x = c.querySelector('.pl-x'), b = x && x.querySelector('button.pl-save'); if (!b) return;
      var on = !!s[cityKey + '/' + pid(c)];
      x.hidden = false; b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Saved' : 'Save';
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button.pl-save'); if (!b || !Cleo.saved) return;
    Cleo.saved.toggle(cityKey + '/' + pid(b.closest('li.pl')));
  });
  document.addEventListener('cleo:saved', paintSaved);

  /* ---- map: progressive enhancement. Vendored Leaflet, OSM + Esri tiles only. ---- */
  var map = null, markers = {};
  function syncMarkers() {
    if (!map) return;
    cards.forEach(function (c) {
      var m = markers[pid(c)]; if (!m) return;
      var on = !c.hidden;
      if (on && !map.hasLayer(m)) m.addTo(map); else if (!on && map.hasLayer(m)) map.removeLayer(m);
    });
  }
  function focusMarker(id) { var m = map && markers[id]; if (m) { map.setView(m.getLatLng(), Math.max(map.getZoom(), 15)); } }
  function mountMap() {
    var L = window.L, el = document.getElementById('cleo-map');
    if (map || !L || !L.map || !el) return false;
    el.innerHTML = '';
    var ctr = geo.center || [0, 0, 2];
    map = L.map(el, { scrollWheelZoom: false }).setView([ctr[0], ctr[1]], ctr[2] || 11);
    var bases = {
      'Street': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
      'Light': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, maxNativeZoom: 16, attribution: 'Tiles &copy; Esri' }),
      'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles &copy; Esri' })
    };
    bases.Street.addTo(map);
    if (Cleo.watchTiles) Cleo.watchTiles(bases.Street, function () { Cleo.mapFallback(el, map); });   // M1-06
    L.control.layers(bases, null, { collapsed: true }).addTo(map);
    cards.forEach(function (c) {
      var ll = (c.getAttribute('data-ll') || '').split(','); if (ll.length !== 2) return;
      var id = pid(c), a = (geo.areas || {})[c.getAttribute('data-a')] || {};
      var closed = c.hasAttribute('data-closed');
      var m = L.circleMarker([+ll[0], +ll[1]], { radius: c.getAttribute('data-t') === '1' ? 7 : 5, weight: 1, color: '#222',
        fillColor: closed ? '#999' : (a.c || '#555'), fillOpacity: closed ? 0.4 : 0.85 });
      m.bindTooltip(c.querySelector('.pl-n').textContent);
      m.on('click', function () { var r = Cleo.route.parse(); r.p = id; Cleo.route.go(r); });
      markers[id] = m; m.addTo(map);
    });
    syncMarkers();
    return true;
  }
  Cleo.mountMap = mountMap;
  function loadMap() {
    if (window.L) { mountMap(); return; }
    var base = (Cleo.root || '../') + 'assets/vendor/leaflet/';
    var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = base + 'leaflet.css'; document.head.appendChild(css);
    var s = document.createElement('script'); s.src = base + 'leaflet.js'; s.async = true;
    s.onload = function () { mountMap(); };
    s.onerror = function () { /* keep the list; the fallback note stays */ };
    document.head.appendChild(s);
  }

  paintSaved();
  onRoute();
  if ('requestIdleCallback' in window) window.requestIdleCallback(loadMap, { timeout: 1500 }); else setTimeout(loadMap, 300);
})();
