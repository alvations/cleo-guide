/* Cleo beta — day.js (FE-A, M2-06). "Your day" per area: 4–6 open places with a verified pin, from the guide's own
 * order (build-time plan, or the platform's index), nearest next. Numbered route on the map, legs "x km straight-line",
 * total; move / remove a stop, add any open pinned place from its sheet. Edits live on this device; a day is shared as
 * a link (#day=AREA&s=id,id — ids only) and exported as KML or a Google Maps route. Closed / unpinned places never enter. */
(function () {
  'use strict';
  var Cleo = window.Cleo || {}, C = Cleo.city, d = document;
  if (!C) return;
  var info = C.info, DAYS = info.days || {}, esc = C.esc, icon = C.icon, store = Cleo.store || { get: function (k, x) { return x; }, set: function () {} };
  var NT = ' rel="noopener" target="_blank"', layer = null;
  var mine = function () { var a = store.get('days', {}); return a && typeof a === 'object' && a[C.key] && typeof a[C.key] === 'object' ? a[C.key] : {}; };
  var keep = function (o) { var a = store.get('days', {}); if (!a || typeof a !== 'object') a = {}; a[C.key] = o; store.set('days', a); };
  var ok = function (id) { var c = C.byId[id]; return !!c && !c.hasAttribute('data-closed') && !!c.getAttribute('data-ll'); };
  var ll = function (id) { var p = C.byId[id].getAttribute('data-ll').split(','); return [+p[0], +p[1]]; };
  var R = Math.PI / 180, km = function (a, b) { var h = Math.pow(Math.sin((b[0] - a[0]) * R / 2), 2) + Math.cos(a[0] * R) * Math.cos(b[0] * R) * Math.pow(Math.sin((b[1] - a[1]) * R / 2), 2); return 12742 * Math.asin(Math.sqrt(h)); };
  var fmt = function (v) { return v < 1 ? Math.round(v * 100) * 10 + ' m' : v.toFixed(1) + ' km'; };
  var uniq = function (l) { return l.filter(function (x, i) { return l.indexOf(x) === i; }); };
  var shared = function (a) { var r = Cleo.route.parse(); return r.day === a && r.s ? r.s.split(',') : null; };
  function stops(a) { return uniq((shared(a) || mine()[a] || DAYS[a] || []).filter(ok)); }
  var edited = function (a) { return !!(shared(a) || mine()[a]); };
  function save(a, list) { var m = mine(); m[a] = list; keep(m); var r = Cleo.route.parse(); if (r.s) { delete r.s; C.go(r, true); } C.apply(); }

  C.inDay = function (id) { return stops(C.S.day).indexOf(id) >= 0; };
  C.dayRank = function (c) { var i = stops(C.S.day).indexOf(C.pid(c)); return i < 0 ? 999 : i; };
  C.lens.day = function (n, nA, all) {
    var a = C.S.day, ids = stops(a), name = C.label('a', a), other = Object.keys(DAYS).filter(function (x) { return x !== a; });
    var more = other.length ? '<p class="sm">More days: ' + other.map(function (x) { return '<a href="#day=' + encodeURIComponent(x) + '">' + esc(C.label('a', x)) + '</a>'; }).join(' · ') + '</p>' : '';
    if (ids.length < 2) return '<div class="day"><span class="eyebrow">Your day</span><h2>No day in ' + esc(name) + ' yet</h2><p class="honest">The guide plans a day only where it has at least four open places with a verified pin close together, and doesn’t pad one' + ((info.dsk || {})[a] ? ' — here: ' + esc(info.dsk[a]) : '') + '. Add places from their sheet with “Add to your day”.</p><div class="row">' + all + '</div>' + more + '</div>';
    var pts = ids.map(ll), tot = 0, legs = pts.map(function (p, i) { var v = i ? km(pts[i - 1], p) : 0; tot += v; return v; });
    var food = ids.filter(function (id) { return C.byId[id].getAttribute('data-k') === 'f'; }).length;
    var row = function (id, i) {
      var c = C.byId[id], nm = C.name(c), f = c.getAttribute('data-k') === 'f';
      return '<li><span class="no" aria-hidden="true">' + (i + 1) + '</span><a class="stop" href="#p-' + esc(id) + '">' + esc(nm) + '<span class="sm">' + (f ? 'eat & drink' : 'sight') + '</span></a><span class="ops">' +
        '<button type="button" class="btn btn-ghost" data-dy="up" data-i="' + i + '" aria-label="Move ' + esc(nm) + ' earlier"' + (i ? '' : ' disabled') + '>' + icon('up') + '</button>' +
        '<button type="button" class="btn btn-ghost" data-dy="down" data-i="' + i + '" aria-label="Move ' + esc(nm) + ' later"' + (i < ids.length - 1 ? '' : ' disabled') + '>' + icon('down') + '</button>' +
        '<button type="button" class="btn btn-ghost" data-dy="rm" data-i="' + i + '" aria-label="Remove ' + esc(nm) + ' from your day">' + icon('close') + '</button></span>' +
        (i < ids.length - 1 ? '<span class="leg">' + fmt(legs[i + 1]) + ' to the next stop, straight-line</span>' : '') + '</li>';
    };
    var g = 'https://www.google.com/maps/dir/?api=1&amp;travelmode=walking&amp;origin=' + pts[0].join(',') + '&amp;destination=' + pts[pts.length - 1].join(',') +
      (pts.length > 2 ? '&amp;waypoints=' + encodeURIComponent(pts.slice(1, -1).map(function (p) { return p.join(','); }).join('|')) : '');
    return '<div class="day"><span class="eyebrow">Your day · ' + esc(info.name) + '</span><h2>A day in ' + esc(name) + '</h2>' +
      '<div class="tot"><span><b>' + ids.length + '</b>stops</span><span><b>' + fmt(tot) + '</b>straight-line total</span><span><b>' + food + '</b>' + (food === 1 ? 'place to eat' : 'places to eat') + '</span></div>' +
      '<p class="honest">' + (edited(a) ? 'Your version of the guide’s day. ' : 'Built from the guide’s own picks: open places with a verified pin, close together. ') +
      esc(info.dl || 'Suggested by the guide from sourced picks — check hours before you go. Distances are straight-line, not walking routes.') + '</p>' +
      '<ol>' + ids.map(row).join('') + '</ol>' +
      '<div class="row"><button type="button" class="btn btn-primary" data-dy="share">' + icon('share') + '<span>Share this day</span></button>' +
      '<a class="btn btn-ghost" href="' + g + '"' + NT + '>' + icon('directions') + '<span>Route in Google Maps</span></a>' +
      '<button type="button" class="btn btn-ghost" data-dy="kml">Export KML</button>' +
      '<button type="button" class="btn btn-ghost" data-dy="save">' + icon('heart') + '<span>Save all</span></button>' +
      '<button type="button" class="btn btn-ghost map-only" data-cleo-map="">' + icon('map') + '<span>Map</span></button>' +
      (edited(a) ? '<button type="button" class="btn btn-quiet" data-dy="reset">Reset to the guide’s day</button>' : '') + all + '</div>' + more + '</div>';
  };
  // route on the map: dashed line in stop order + numbered stops; fitted when the day opens
  var drawn = '';
  C.after.push(function () {
    var map = C.map && C.map(), L = window.L;
    if (layer && map) { map.removeLayer(layer); layer = null; }
    if (map) map.getContainer().classList.toggle('day-on', !!C.S.day);
    if (!C.S.day || !map || !L) { drawn = ''; return; }
    var ids = stops(C.S.day); if (ids.length < 2) return;
    var pts = ids.map(ll), accent = (getComputedStyle(d.getElementById('main')).getPropertyValue('--city') || '').trim() || '#C23A1C';
    layer = L.layerGroup([L.polyline(pts, { color: accent, weight: 3, opacity: 0.9, dashArray: '6 7', interactive: false })].concat(pts.map(function (p, i) {
      return L.circleMarker(p, { radius: 9, weight: 2, color: '#fff', fillColor: accent, fillOpacity: 1 })
        .bindTooltip(String(i + 1), { permanent: true, direction: 'center', className: 'pin-n day', opacity: 1 })
        .on('click', function () { C.go({ day: C.S.day, p: ids[i] }); });
    }))).addTo(map);
    var k = C.S.day + ids.join();
    if (k !== drawn) { drawn = k; map.fitBounds(L.latLngBounds(pts), { padding: [48, 48], maxZoom: 16, animate: false }); }
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
    else if (k === 'reset') { var m = mine(); delete m[a]; keep(m); var r = Cleo.route.parse(); delete r.s; C.go(r, true); C.apply(); }
    else if (k === 'share') { if (Cleo.share) Cleo.share('A day in ' + C.label('a', a) + ' — ' + info.name, location.href.split('#')[0] + '#day=' + encodeURIComponent(a) + '&s=' + ids.join(',')); }
    else if (k === 'save') { if (Cleo.saved) { Cleo.saved.add(ids.map(function (id) { return C.key + '/' + id; })); if (Cleo.emit) Cleo.emit('cleo:toast', ids.length + ' places saved to your list on this device.'); } }
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
      setTimeout(function () { var l = d.getElementById('cleo-lens'); if (l) l.scrollIntoView({ block: 'start' }); }, 0);
    },
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
