/* Cleo beta — day.js (FE-A, M2-06). "Your day" per area: 4–6 open places with a verified pin, from the guide's own
 * order (build-time plan, or the platform's index), nearest next. Numbered route on the map, legs "x km straight-line",
 * total; move / remove a stop, add any open pinned place from its sheet. Edits live on this device; a day is shared as
 * a link (#day=AREA&s=id,id — ids only) and exported as KML or a Google Maps route. Closed / unpinned places never enter. */
(function () {
  'use strict';
  var Cleo = window.Cleo || {}, C = Cleo.city, d = document;
  if (!C) return;
  var info = C.info, DAYS = info.days || {}, esc = C.esc, icon = C.icon, store = Cleo.store || { get: function (k, x) { return x; }, set: function () {} };
  var NT = ' rel="noopener" target="_blank"', layer = null, editing = false;
  var mine = function () { var a = store.get('days', {}); return a && typeof a === 'object' && a[C.key] && typeof a[C.key] === 'object' ? a[C.key] : {}; };
  var keep = function (o) { var a = store.get('days', {}); if (!a || typeof a !== 'object') a = {}; a[C.key] = o; store.set('days', a); };
  var ok = function (id) { var c = C.byId[id]; return !!c && !c.hasAttribute('data-closed') && !!c.getAttribute('data-ll'); };
  var ll = function (id) { var p = C.byId[id].getAttribute('data-ll').split(','); return [+p[0], +p[1]]; };
  var R = Math.PI / 180, km = function (a, b) { var h = Math.pow(Math.sin((b[0] - a[0]) * R / 2), 2) + Math.cos(a[0] * R) * Math.cos(b[0] * R) * Math.pow(Math.sin((b[1] - a[1]) * R / 2), 2); return 12742 * Math.asin(Math.sqrt(h)); };
  // i18n D-41: interface strings from the catalogue (Cleo.t, head snippet); the English here equals en.json (test-i18n)
  var tt = function (k, e, v) { return Cleo.t ? Cleo.t(k, e, v) : v ? e.replace(/\{([a-z]+)\}/g, function (m, n) { return n in v ? v[n] : m; }) : e; };
  var DL = 'Suggested by the guide from sourced picks — check hours before you go. Distances are straight-line, not walking routes.';   // the guide's default day label (D-14)
  var fmt = function (v) { return v < 1 ? Math.round(v * 100) * 10 + ' m' : v.toFixed(1) + ' km'; };
  var total = function (ids) { var t = 0; ids.map(ll).forEach(function (p, i, a) { if (i) t += km(a[i - 1], p); }); return t; };
  var uniq = function (l) { return l.filter(function (x, i) { return l.indexOf(x) === i; }); };
  var shared = function (a) { var r = Cleo.route.parse(); return r.day === a && r.s ? r.s.split(',') : null; };
  function stops(a) { return uniq((shared(a) || mine()[a] || DAYS[a] || []).filter(ok)); }
  var edited = function (a) { return !!(shared(a) || mine()[a]); };
  // W8: a day from your saved places — this area's saved, open, pinned places, in guide order, then nearest next
  var savedIn = function (a) { var all = Cleo.saved ? Cleo.saved.all() : {}, p = C.key + '/';
    return Object.keys(all).filter(function (r) { return r.indexOf(p) === 0; }).map(function (r) { return r.slice(p.length); })
      .filter(function (id) { return ok(id) && (!a || C.byId[id].getAttribute('data-a') === a); })
      .sort(function (x, y) { return C.byId[x].compareDocumentPosition(C.byId[y]) & 4 ? -1 : 1; }); };
  function nearestNext(ids) { var out = ids.slice(0, 1), rest = ids.slice(1);
    while (rest.length) { var at = ll(out[out.length - 1]), bi = 0; rest.forEach(function (id, i) { if (km(at, ll(id)) < km(at, ll(rest[bi]))) bi = i; }); out.push(rest.splice(bi, 1)[0]); }
    return out; }
  var savedArea = function () { var n = {}, best = ''; savedIn().forEach(function (id) { var a = C.byId[id].getAttribute('data-a'); n[a] = (n[a] || 0) + 1; if (!best || n[a] > n[best]) best = a; }); return n[best] >= 2 ? best : ''; };
  // the lens to the top of the page, clear of the sticky bars (site bar, city bar, category bar) — never under them
  function toLens() {
    var l = d.getElementById('cleo-lens'), y = 0; if (!l || !l.getClientRects().length) return;
    [].forEach.call(d.querySelectorAll('[data-cleo-shell], .cbar, #cleo-rail'), function (b) { var c = getComputedStyle(b), r = b.getBoundingClientRect();
      if ((c.position === 'sticky' || c.position === 'fixed') && c.top !== 'auto' && r.height) y = Math.max(y, (parseFloat(c.top) || 0) + r.height); });
    scrollTo({ top: scrollY + l.getBoundingClientRect().top - y - 8, behavior: 'instant' });
  }
  function fromSaved(a) {
    a = a || savedArea(); var ids = a ? nearestNext(savedIn(a)) : [];
    if (ids.length < 2) { if (Cleo.emit) Cleo.emit('cleo:toast', tt('day.need', 'Save at least two open places in one area to plan a day.')); return; }
    var m = mine(); m[a] = ids; keep(m);
    var left = savedIn().length - ids.length;
    if (Cleo.emit) Cleo.emit('cleo:toast', tt('day.toast', 'Your day in {area}: {n} saved places, nearest next.', { area: C.label('a', a), n: ids.length }) + (left > 0 ? tt('day.toast.more', ' {n} more saved in other areas.', { n: left }) : ''));
    // after the route has re-applied (hashchange → the day lens drawn, the rows above settled), never before
    var done = 0, land = function () { if (done++) return; removeEventListener('hashchange', hc); requestAnimationFrame(function () { var h = d.getElementById('day-h'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); toLens(); } }); },
      hc = function () { setTimeout(land, 0); };
    addEventListener('hashchange', hc); setTimeout(land, 400); C.go({ day: a });
  }

  function save(a, list) { var m = mine(); m[a] = list; keep(m); var r = Cleo.route.parse(); if (r.s) { delete r.s; C.go(r, true); } C.apply(); }

  C.inDay = function (id) { return stops(C.S.day).indexOf(id) >= 0; };
  C.dayRank = function (c) { var i = stops(C.S.day).indexOf(C.pid(c)); return i < 0 ? 999 : i; };
  C.lens.day = function (n, nA, all) {
    var a = C.S.day, ids = stops(a), name = C.label('a', a), sv = savedIn(a), mineN = sv.length, other = Object.keys(DAYS).filter(function (x) { return x !== a; });
    var more = other.length ? '<p class="sm more">' + tt('day.more', 'More days:') + ' ' + other.map(function (x) { return '<a href="#day=' + encodeURIComponent(x) + '">' + esc(C.label('a', x)) + '</a>'; }).join(' · ') + '</p>' : '';
    var useSaved = mineN >= 2 && sv.slice().sort().join() !== ids.slice().sort().join() ? '<button type="button" class="btn btn-ghost" data-dy="fromsaved">' + icon('heart') + '<span>' + tt('day.usesaved', 'Use my {n} saved places', { n: mineN }) + '</span></button>' : '';
    if (ids.length < 2) return '<section class="day"><header><span class="eyebrow">' + tt('day.k', 'Your day') + '</span><h2>' + esc(tt('day.none', 'No day in {area} yet', { area: name })) + '</h2></header><p class="caveat">' + tt('day.none.p', 'The guide plans a day only where it has at least four open places with a verified pin close together, and doesn’t pad one') + ((info.dsk || {})[a] ? esc(tt('day.none.here', ' — here: {reason}', { reason: info.dsk[a] })) : '') + tt('day.none.add', '. Add places from their sheet with “Add to your day”') + (mineN >= 2 ? tt('day.none.saved', ', or plan one from the {n} places you saved here', { n: mineN }) : '') + '.</p><div class="sharebar">' + useSaved + all + '</div>' + more + '</section>';
    var pts = ids.map(ll), tot = 0, legs = pts.map(function (p, i) { var v = i ? km(pts[i - 1], p) : 0; tot += v; return v; });
    var food = ids.filter(function (id) { return C.byId[id].getAttribute('data-k') === 'f'; }).length;
    var row = function (id, i) {
      var c = C.byId[id], nm = C.name(c), f = c.getAttribute('data-k') === 'f';
      return '<li class="stop"><span class="n" aria-hidden="true">' + (i + 1) + '</span><a class="go" href="#p-' + esc(id) + '"><span class="vh">' + tt('day.stop', 'Stop {n}: ', { n: i + 1 }) + '</span>' + esc(nm) + '<span class="sm">' + esc(f ? tt('day.kind.food', 'eat & drink') : tt('day.kind.sight', 'sight')) + '</span></a><span class="ops">' +
        '<button type="button" class="btn btn-ghost" data-dy="up" data-i="' + i + '" aria-label="' + esc(tt('day.up', 'Move {name} earlier', { name: nm })) + '"' + (i ? '' : ' disabled') + '>' + icon('up') + '</button>' +
        '<button type="button" class="btn btn-ghost" data-dy="down" data-i="' + i + '" aria-label="' + esc(tt('day.down', 'Move {name} later', { name: nm })) + '"' + (i < ids.length - 1 ? '' : ' disabled') + '>' + icon('down') + '</button>' +
        '<button type="button" class="btn btn-ghost" data-dy="rm" data-i="' + i + '" aria-label="' + esc(tt('day.rm', 'Remove {name} from your day', { name: nm })) + '">' + icon('close') + '</button></span>' +
        (i < ids.length - 1 ? '<p class="leg">' + tt('day.leg', '{d} straight-line to stop {n}', { d: fmt(legs[i + 1]), n: i + 2 }) + '</p>' : '') + '</li>';
    };
    var g = 'https://www.google.com/maps/dir/?api=1&amp;travelmode=walking&amp;origin=' + pts[0].join(',') + '&amp;destination=' + pts[pts.length - 1].join(',') +
      (pts.length > 2 ? '&amp;waypoints=' + encodeURIComponent(pts.slice(1, -1).map(function (p) { return p.join(','); }).join('|')) : '');
    // DES 15.10 (d): header → .daysum → .caveat → .sharebar → ol.stops (compact rows; the cards follow below, in stop order)
    return '<section class="day' + (editing ? ' editing' : '') + '" aria-labelledby="day-h"><header><span class="eyebrow">' + esc(tt('day.k.city', 'Your day · {city}', { city: info.name })) + '</span><h2 id="day-h">' + esc(tt('day.h', 'A day in {area}', { area: name })) + '</h2></header>' +
      '<div class="daysum"><div><b>' + ids.length + '</b><span>' + tt('day.stops', 'stops') + '</span></div><div><b>' + fmt(tot) + '</b><span>' + tt('day.total', 'straight-line total') + '</span></div><div><b>' + food + '</b><span>' + (food === 1 ? tt('day.eat.one', 'place to eat') : tt('day.eat', 'places to eat')) + '</span></div></div>' +
      '<p class="caveat">' + (shared(a) ? tt('day.shared', 'A day shared with you as a link — edit it to keep your own copy on this device. ') : edited(a) ? tt('day.yours', 'Your version of the guide’s day. ') : '') + esc(info.dl && info.dl !== DL ? info.dl : tt('day.note', DL)) + '</p>' +
      '<div class="sharebar"><button type="button" class="btn btn-primary" data-dy="share">' + icon('share') + '<span>' + tt('day.share', 'Share this day') + '</span></button>' +
      '<a class="btn btn-ghost" href="' + g + '"' + NT + '>' + icon('directions') + '<span>' + tt('day.maps', 'Open in maps') + '</span></a>' +
      '<button type="button" class="btn btn-ghost" data-dy="print">' + tt('day.print', 'Print') + '</button>' +
      '<button type="button" class="btn btn-ghost" data-dy="kml">' + tt('day.kml', 'Export KML') + '</button>' + useSaved +
      '<button type="button" class="btn btn-ghost" data-dy="save">' + icon('heart') + '<span>' + tt('day.saveall', 'Save all') + '</span></button>' +
      '<button type="button" class="btn btn-ghost" data-dy="edit" aria-pressed="' + editing + '">' + (editing ? tt('day.done', 'Done') : tt('day.edit', 'Edit stops')) + '</button>' +
      '<button type="button" class="btn btn-ghost map-only" data-cleo-map="">' + icon('map') + '<span>' + tt('city.map.label', 'Map') + '</span></button>' +
      (edited(a) ? '<button type="button" class="btn btn-quiet" data-dy="reset">' + tt('day.reset', 'Reset to the guide’s day') + '</button>' : '') + all + '</div>' +
      '<ol class="stops">' + ids.map(row).join('') + '</ol>' + more + '</section>';
  };
  // route on the map: dashed line in stop order + numbered stops; fitted when the day opens
  var drawn = '', chip = null;
  C.after.push(function () {
    var map = C.map && C.map(), L = window.L;
    if (layer && map) { map.removeLayer(layer); layer = null; }
    if (map) map.getContainer().classList.toggle('day-on', !!C.S.day);
    var ids = C.S.day && map && L ? stops(C.S.day) : [];
    if (chip && (ids.length < 2 || chip._map !== map)) { chip.remove(); chip = null; }
    if (!C.S.day || !map || !L) { drawn = ''; return; }
    if (ids.length < 2) return;
    // W8: the day's summary rides on the map itself (any view, any width), so stops and distance never sit below a fold;
    // on a phone it sits bottom-left, above the list pill and clear of the attribution
    if (!chip) { chip = L.control({ position: C.desk && !C.desk() ? 'bottomleft' : 'topleft' }); chip.onAdd = function () { var el = L.DomUtil.create('div', 'day-chip'); el.setAttribute('role', 'status'); L.DomEvent.disableClickPropagation(el); return el; }; chip.addTo(map); }
    chip.getContainer().innerHTML = '<span class="eyebrow">' + tt('day.k', 'Your day') + '</span> <b>' + esc(C.label('a', C.S.day)) + '</b> <span>' + tt('day.chip', '{n} stops · {d}', { n: ids.length, d: fmt(total(ids)) }) + '</span>';
    var pts = ids.map(ll), accent = (getComputedStyle(d.getElementById('main')).getPropertyValue('--city') || '').trim() || '#C23A1C';
    layer = L.layerGroup([L.polyline(pts, { className: 'day-route', color: accent, weight: 3.5, opacity: 0.95, dashArray: '1 9', lineCap: 'round', interactive: false })].concat(pts.map(function (p, i) {
      return L.circleMarker(p, { radius: 9, weight: 2, color: '#fff', fillColor: accent, fillOpacity: 1 })
        .bindTooltip(String(i + 1), { permanent: true, direction: 'center', className: 'pin-n day', opacity: 1 })
        .on('click', function () { C.go({ day: C.S.day, p: ids[i] }); });
    }))).addTo(map);
    var k = C.S.day + ids.join();
    if (k !== drawn) { drawn = k; map.fitBounds(L.latLngBounds(pts), Object.assign(C.overMap ? C.overMap() : { padding: [48, 48] }, { maxZoom: 16, animate: false })); }   // above the phone carousel (Atlas)
  });

  function kml(title, ids) {
    var x = function (s) { return String(s).replace(/[<&>]/g, function (c) { return { '<': '&lt;', '&': '&amp;', '>': '&gt;' }[c]; }); };
    var body = ids.map(function (id, i) { var p = ll(id), c = C.byId[id]; return '<Placemark><name>' + (i + 1) + '. ' + x(C.name(c)) + '</name><description>' + x((c.querySelector('.pl-ad') || {}).textContent || '') + '</description><Point><coordinates>' + p[1] + ',' + p[0] + '</coordinates></Point></Placemark>'; }).join('');
    var line = '<Placemark><name>Route (straight lines)</name><LineString><coordinates>' + ids.map(function (id) { var p = ll(id); return p[1] + ',' + p[0]; }).join(' ') + '</coordinates></LineString></Placemark>';
    var a = d.createElement('a'), blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>' + x(title) + '</name>' + body + line + '</Document></kml>'], { type: 'application/vnd.google-earth.kml+xml' });
    a.href = URL.createObjectURL(blob); a.download = title.replace(/[^\w-]+/g, '-').toLowerCase() + '.kml'; d.body.appendChild(a); a.click(); a.remove();
  }
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-dy]'); if (!b) return;
    var a = C.S.day, ids = stops(a).slice(), i = +b.getAttribute('data-i'), k = b.getAttribute('data-dy'), t;
    if (k === 'up' || k === 'down') { var j = k === 'up' ? i - 1 : i + 1; t = ids[i]; ids[i] = ids[j]; ids[j] = t; save(a, ids); focusOp(k, j); }
    else if (k === 'rm') { ids.splice(i, 1); save(a, ids); }
    else if (k === 'edit') { editing = !editing; C.apply(); var eb = d.querySelector('[data-dy="edit"]'); if (eb) eb.focus(); }
    else if (k === 'reset') { var m = mine(); delete m[a]; keep(m); var r = Cleo.route.parse(); delete r.s; C.go(r, true); C.apply(); }
    else if (k === 'share') { if (Cleo.share) Cleo.share('A day in ' + C.label('a', a) + ' — ' + info.name, location.href.split('#')[0] + '#day=' + encodeURIComponent(a) + '&s=' + ids.join(',')); }
    else if (k === 'save') { if (Cleo.saved) { Cleo.saved.add(ids.map(function (id) { return C.key + '/' + id; })); if (Cleo.emit) Cleo.emit('cleo:toast', ids.length + ' places saved to your list on this device.'); } }
    else if (k === 'fromsaved') fromSaved(a);
    else if (k === 'print') { if (C.defer && C.defer.all) C.defer.all(); window.print(); }
    else if (k === 'kml') kml('A day in ' + C.label('a', a) + ' - ' + info.name, ids);
  });
  function focusOp(k, j) { var el = d.querySelector('.day [data-dy="' + k + '"][data-i="' + j + '"]'); if (el && !el.disabled) el.focus(); else if ((el = d.querySelector('.day [data-i="' + j + '"]'))) el.focus(); }

  C.day = {
    open: function (a) {
      if (!a) {                                  // the area being read, else the first planned area
        var y = innerHeight * 0.4, cur = [].filter.call(d.querySelectorAll('section.area'), function (s) { var r = s.getBoundingClientRect(); return r.top < y && r.bottom > y; })[0];
        a = cur && DAYS[cur.getAttribute('data-area')] ? cur.getAttribute('data-area') : Object.keys(DAYS)[0];
      }
      C.go({ day: a });
      setTimeout(toLens, 0);
    },
    fromSaved: fromSaved, savedArea: savedArea,
    has: function (id) { var c = C.byId[id]; return !!c && stops(c.getAttribute('data-a')).indexOf(id) >= 0; },
    toggle: function (id) {
      var c = C.byId[id]; if (!c || !ok(id)) return false;
      var a = c.getAttribute('data-a'), ids = stops(a).slice(), i = ids.indexOf(id);
      if (i >= 0) ids.splice(i, 1); else ids.push(id);
      save(a, ids); return i < 0;
    }
  };
  if (C.S.day) C.apply();
})();
