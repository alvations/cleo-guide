/* Cleo beta — trip.js (FE-C, W9-4). "Make a trip": several days from your saved places, a named list, a shared list
 * link or a guide's collection. One area a day, at most 6 stops, nearest next. Every leg shows Cleo.geo.walk
 * (straight-line ÷ 80 m a minute, the assumption stated once). Closed, unpinned and unknown places are left out with
 * the reason, never dropped silently. The whole trip is one link: #trip=<day>~<day>…, ids and day breaks only
 * (Cleo.listCodec per day), plus a "!" segment for what was left out. It prints as a booklet (one day a page) and
 * exports KML. Each day opens on its guide's map in day mode through day.js's shared-day route
 * (#day=<area>&s=<ids>, plus &trip=…&d=<n> so the map can link back). Nothing leaves the browser: the only requests
 * are this site's own JSON. Storage (your trips on this device) goes through Cleo.store (try/catch). */
(function () {
  'use strict';
  var Cleo = window.Cleo = window.Cleo || {}, d = document;
  var MAXD = 7, PER = 6;
  var TIER = ['', 'Must see', 'Worth the detour', 'Deep cut'];
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var km = function (a, b) { return Cleo.geo.km(a, b); };
  var pl = function (n, w, ws) { return n + ' ' + (n === 1 ? w : ws || w + 's'); };

  /* ---------------------------------------------------------------- planning (pure; no DOM)
   * An item: {ref, key, id, a, ll:[lat,lng]|null, closed, t, rank, unknown}. */
  function why(x) { return x.unknown ? 'unknown' : x.closed ? 'closed' : !x.ll ? 'nopin' : ''; }
  var better = function (x, y) { return (x.t || 9) - (y.t || 9) || (x.rank || 1e9) - (y.rank || 1e9); };
  /** Nearest next, from the area's best-ranked stop. */
  function nearest(list) {
    if (!list.length) return [];
    var rest = list.slice(), bi = 0;
    rest.forEach(function (x, i) { if (better(x, rest[bi]) < 0) bi = i; });
    var out = [rest.splice(bi, 1)[0]];
    while (rest.length) {
      var at = out[out.length - 1].ll, j = 0;
      rest.forEach(function (x, i) { if (km(at, x.ll) < km(at, rest[j].ll)) j = i; });
      out.push(rest.splice(j, 1)[0]);
    }
    return out;
  }
  /** Contiguous runs of a nearest-next route, sizes as even as possible. */
  function split(list, k) {
    var out = [], base = Math.floor(list.length / k), extra = list.length % k, i = 0;
    for (var n = 0; n < k; n++) { var s = base + (n < extra ? 1 : 0); out.push(list.slice(i, i + s)); i += s; }
    return out;
  }
  var mid = function (u) { var la = 0, ln = 0; u.items.forEach(function (x) { la += x.ll[0]; ln += x.ll[1]; }); return [la / u.items.length, ln / u.items.length]; };
  /**
   * plan(items, days) → {days:[{key, a, items}], left:[{x, why}], asked}. One area a day (never mixed); an area with
   * more than 6 stops becomes several days. More days than places need is never padded: the trip has fewer days and
   * says so. Fewer days than places need: the largest days stay, the rest are left out with the reason "fit".
   */
  function plan(items, days) {
    days = Math.max(1, Math.min(MAXD, +days || 1));
    var left = [], seen = {}, groups = [], gi = {};
    items.forEach(function (x) {
      if (seen[x.ref]) return; seen[x.ref] = 1;
      var w = why(x); if (w) { left.push({ x: x, why: w }); return; }
      var g = x.key + '|' + x.a; if (!(g in gi)) { gi[g] = groups.length; groups.push({ key: x.key, a: x.a, items: [] }); }
      groups[gi[g]].items.push(x);
    });
    var units = [];
    groups.forEach(function (g) { var o = nearest(g.items); split(o, Math.ceil(o.length / PER)).forEach(function (c) { units.push({ key: g.key, a: g.a, items: c }); }); });
    // which days stay: the fullest, then the one holding the better-ranked place
    var keep = units.map(function (u, i) { return i; }).sort(function (i, j) {
      return units[j].items.length - units[i].items.length || better(units[i].items[0], units[j].items[0]) || i - j;
    }).slice(0, days);
    units.forEach(function (u, i) { if (keep.indexOf(i) < 0) u.items.forEach(function (x) { left.push({ x: x, why: 'fit' }); }); });
    var chosen = units.filter(function (u, i) { return keep.indexOf(i) >= 0; });
    // day order: by guide (first seen), then nearest next between day centres from the day holding the best place
    var keys = []; chosen.forEach(function (u) { if (keys.indexOf(u.key) < 0) keys.push(u.key); });
    var out = [];
    keys.forEach(function (k) {
      var rest = chosen.filter(function (u) { return u.key === k; }), bi = 0;
      rest.forEach(function (u, i) { if (better(u.items[0], rest[bi].items[0]) < 0) bi = i; });
      var cur = rest.splice(bi, 1)[0]; out.push(cur);
      while (rest.length) { var at = mid(cur), j = 0; rest.forEach(function (u, i) { if (km(at, mid(u)) < km(at, mid(rest[j]))) j = i; }); cur = rest.splice(j, 1)[0]; out.push(cur); }
    });
    return { days: out, left: left, asked: days };
  }

  /* ---------------------------------------------------------------- the link: ids and day breaks only */
  var codec = function () { return Cleo.listCodec; };
  function encode(t) {
    var segs = t.days.map(function (u) { return codec().encode(u.items.map(function (x) { return x.ref; })); });
    var lo = t.left.map(function (l) { return l.x.ref; });
    if (lo.length) segs.push('!' + codec().encode(lo));
    return segs.join('~');
  }
  /** → {days:[[ref…]…], left:[ref…]} — exactly what the link carries, in its order. */
  function decode(s) {
    var out = { days: [], left: [] };
    String(s || '').split('~').forEach(function (seg) {
      if (!seg) return;
      if (seg.charAt(0) === '!') { out.left = out.left.concat(codec().decode(seg.slice(1))); return; }
      var refs = codec().decode(seg); if (refs.length) out.days.push(refs);
    });
    return out;
  }

  Cleo.trip = { plan: plan, nearest: nearest, encode: encode, decode: decode, MAXD: MAXD, PER: PER };

  /* ---------------------------------------------------------------- the page (beta/trip.html) */
  var box = d.getElementById('cleo-trip');
  if (!box || !Cleo.store || !Cleo.listCodec || !Cleo.geo || !Cleo.geo.walk) return;
  var st = Cleo.store, data = {};
  var pg = function (r) { return r.slice(0, r.lastIndexOf('/')); }, idOf = function (r) { return r.slice(r.lastIndexOf('/') + 1); };
  var toast = function (m) { var el = d.createElement('p'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = m; d.body.appendChild(el); setTimeout(function () { el.remove(); }, 2600); };
  d.addEventListener('cleo:toast', function (e) { toast(e.detail === 'Link copied' ? 'Link copied — it reopens this exact trip.' : String(e.detail)); });

  function load(keys) {
    return Promise.all(keys.map(function (k) {
      if (k in data) return data[k];
      return Cleo.pageData(k).then(function (j) {
        var by = {}, src = {}, ar = {};
        (j.places || []).forEach(function (p) { by[p.id] = p; });
        (j.sourceIndex || []).forEach(function (x) { src[x.id] = String(x.name || x.id).split(' · ')[0]; });
        (j.areas || []).forEach(function (a) { ar[a.id] = String(a.n).split(/\s+[(—–]\s*|\s+\(/)[0]; });
        data[k] = { key: k, name: j.name || k, href: j.beta, by: by, src: src, ar: ar, col: j.colors || {}, colls: j.collections || [] };
        return data[k];
      }, function () { data[k] = null; return null; });
    }));
  }
  var placeOf = function (r) { var D = data[pg(r)]; return D && D.by[idOf(r)] || null; };
  function item(r) {
    var p = placeOf(r);
    if (!p) return { ref: r, key: pg(r), id: idOf(r), unknown: true };
    var closed = !!p.closed || /\bclosed\b/i.test((p.pv || {}).status || '') || / [—–-]+ CLOSED\b/.test(p.n);
    return { ref: r, key: pg(r), id: p.id, a: p.a, ll: p.la != null && p.ln != null ? [+p.la, +p.ln] : null, closed: closed, t: p.t, rank: p.rank, p: p };
  }
  var keysOf = function (refs) { return refs.map(pg).filter(function (k, i, a) { return k && a.indexOf(k) === i; }); };
  var label = function (p) { var nat = p.nat && p.n.slice(-p.nat.length - 2) === '(' + p.nat + ')' ? p.nat : ''; return nat ? p.n.slice(0, -nat.length - 2).trim() : p.n; };
  function firstSource(x) {
    var D = data[x.key], s = (x.p.src || []).filter(function (k) { return k !== 'guide'; });
    if (!s.length) return 'Added by the guide (general knowledge)';
    return 'Recommended by ' + (D.src[s[0]] || s[0]) + (s.length > 1 ? ' + ' + (s.length - 1) + ' more' : '');
  }
  function reason(l, asked) {
    var p = l.x.p || {}, pv = p.pv || {};
    if (l.why === 'closed') return 'Closed — kept for the record, never planned' + (pv.checked ? ' (checked ' + pv.checked + ')' : '') + (pv.ss ? '. Source: ' + pv.ss : '');
    if (l.why === 'nopin') return 'No verified pin, so it can’t be put in walking order';
    if (l.why === 'fit') return 'Didn’t fit in ' + pl(asked, 'day') + ' — choose more days to include it';
    return 'No longer listed in a guide';
  }

  // where the places come from: #from=all|been|<list id> · #list=<codec>&n= (a shared list) · #g=<guide>&c=<collection>
  function source(r) {
    var s = Cleo.saved ? Cleo.saved.all() : {}, ls = st.get('lists', []); if (!Array.isArray(ls)) ls = [];
    if (r.list) return { name: r.n || 'A shared list', refs: codec().decode(r.list) };
    if (r.g && r.c) return { name: null, refs: null, g: r.g, c: r.c };
    if (r.from === 'been') { var b = st.get('been', {}); return { name: 'Been there', refs: Object.keys(b && typeof b === 'object' ? b : {}) }; }
    var l = ls.filter(function (x) { return x && x.id === r.from && Array.isArray(x.r); })[0];
    if (l) return { name: l.n, refs: l.r.slice() };
    if (r.from === 'all') return { name: 'All saved', refs: Object.keys(s).sort(function (x, y) { return ((s[y] || {}).t || 0) - ((s[x] || {}).t || 0); }) };
    return null;
  }
  var trips = function () { var t = st.get('trips', []); return Array.isArray(t) ? t.filter(function (x) { return x && x.v; }) : []; };
  function remember(v, n) { var t = trips().filter(function (x) { return x.v !== v; }); t.unshift({ v: v, n: n, t: Date.now() }); st.set('trips', t.slice(0, 12)); }
  var tripHref = function (v, n) { return '#trip=' + v + (n ? '&n=' + encodeURIComponent(n) : ''); };

  function paint() {
    var r = Cleo.route.parse();
    if (r.trip) return view(r);
    var S = source(r);
    if (S) return build(r, S);
    home();
  }
  function focusH() { var h = d.getElementById('tp-h'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }

  /* ---- home: choose where the trip comes from; your trips on this device ---- */
  function home() {
    var s = Cleo.saved ? Cleo.saved.all() : {}, n = Object.keys(s).length, ls = st.get('lists', []), tr = trips();
    if (!Array.isArray(ls)) ls = [];
    var opts = [['all', 'All saved', n]].concat(ls.filter(function (l) { return l && l.id && Array.isArray(l.r); }).map(function (l) { return [l.id, l.n, l.r.length]; }));
    box.innerHTML = '<header class="tp-head"><span class="eyebrow">Trips</span><h1 id="tp-h" class="d1">Make a trip</h1>' +
      '<p class="lede">Turn places you saved into a plan of several days: one area a day, at most six stops, nearest next. Closed places never go in, and the trip says why each place was left out.</p></header>' +
      (n ? '<section class="tp-from" aria-labelledby="tp-from-h"><h2 id="tp-from-h">Start from</h2><ul class="tp-pick">' + opts.map(function (o) {
        return '<li><a class="btn btn-ghost" href="#from=' + encodeURIComponent(o[0]) + '"' + (o[2] ? '' : ' aria-disabled="true"') + '>' + esc(o[1]) + ' <span class="n">' + pl(o[2], 'place') + '</span></a></li>';
      }).join('') + '</ul></section>'
        : '<section class="sv-empty"><h2>Nothing saved yet</h2><p>Save places in any guide, then come back to make them a trip. A guide’s own collections work too, from their “Make a trip” link.</p><a class="btn btn-primary" href="index.html">Browse the guides</a></section>') +
      (tr.length ? '<section class="tp-mine" aria-labelledby="tp-mine-h"><h2 id="tp-mine-h">Your trips on this device</h2><ul>' + tr.map(function (t, i) {
        return '<li><a href="' + esc(tripHref(t.v, t.n)) + '">' + esc(t.n || 'A trip') + '</a> <button type="button" class="btn btn-quiet" data-tp="forget" data-i="' + i + '" aria-label="Forget ' + esc(t.n || 'this trip') + '">Forget</button></li>';
      }).join('') + '</ul></section>' : '');
  }

  /* ---- builder: how many days ---- */
  function build(r, S) {
    box.innerHTML = '<p>Loading the places…</p>';
    var go = function (refs, name) {
      load(keysOf(refs)).then(function () {
        var items = refs.map(item), probe = plan(items, MAXD), fit = probe.days.length;
        var placed = probe.days.reduce(function (n, u) { return n + u.items.length; }, 0), out = probe.left.filter(function (l) { return l.why !== 'fit'; });
        var cur = Math.max(1, Math.min(MAXD, +r.days || fit || 1)), guides = keysOf(refs).map(function (k) { return data[k] ? data[k].name : k; });
        var def = (fit ? pl(fit, 'day') : 'A trip') + ' in ' + guides.join(' and ');
        box.innerHTML = '<header class="tp-head"><span class="eyebrow">Make a trip</span><h1 id="tp-h" class="d1">From “' + esc(name) + '”</h1>' +
          '<p class="lede">' + pl(refs.length, 'place') + (guides.length ? ' in ' + esc(guides.join(', ')) : '') + '. ' +
          (placed ? pl(placed, 'place') + ' can go in a day' + (fit ? ', filling at most ' + pl(fit, 'day') : '') + '.' : 'None of them can go in a day.') +
          (out.length ? ' ' + pl(out.length, 'place') + ' will be left out, each with the reason.' : '') + '</p></header>' +
          (placed ? '<form class="tp-form" id="tp-form"><fieldset><legend>How many days?</legend><div class="tp-days-pick">' +
            [1, 2, 3, 4, 5, 6, 7].map(function (k) { return '<label><input type="radio" name="days" value="' + k + '"' + (k === cur ? ' checked' : '') + '><span>' + pl(k, 'day') + '</span></label>'; }).join('') +
            '</div><p class="sm">One area a day, at most six stops, nearest next. ' + (fit ? 'Your places fill ' + pl(fit, 'day') + '; more days than that stay empty rather than padded.' : '') + '</p></fieldset>' +
            '<label class="tp-name" for="tp-n">Name it (optional)</label><input id="tp-n" name="n" maxlength="60" placeholder="' + esc(def) + '">' +
            '<p><button class="btn btn-primary" type="submit">Make the trip</button> <a class="btn btn-quiet" href="#">Cancel</a></p></form>'
            : '<p><a class="btn btn-ghost" href="#">Back</a></p>');
        var f = d.getElementById('tp-form');
        if (f) f.onsubmit = function (e) {
          e.preventDefault();
          var k = +(f.querySelector('input[name=days]:checked') || {}).value || cur, t = plan(items, k);
          var nm = (f.querySelector('#tp-n').value || '').trim() || ((t.days.length ? pl(t.days.length, 'day') : 'A trip') + ' in ' + keysOf(t.days.map(function (u) { return u.items[0].ref; })).map(function (x) { return data[x].name; }).join(' and '));
          var v = encode(t); remember(v, nm); location.hash = tripHref(v, nm);
        };
        focusH();
      });
    };
    if (S.refs) return go(S.refs, S.name);
    load([S.g]).then(function () {                              // a guide collection: its places, in guide order
      var D = data[S.g]; if (!D) { box.innerHTML = '<p>That guide couldn’t load. Try again when online.</p>'; return; }
      var c = D.colls.filter(function (x) { return x.id === S.c; })[0];
      var refs = Object.keys(D.by).filter(function (id) { return (D.by[id].g || []).indexOf(S.c) >= 0; }).map(function (id) { return S.g + '/' + id; });
      go(refs, c ? String(c.n).replace(/^★\s*/, '') + ' · ' + D.name : S.c);
    });
  }

  /* ---- the trip ---- */
  function view(r) {
    var T = decode(r.trip), all = [].concat.apply([], T.days).concat(T.left), name = r.n || 'Your trip';
    box.innerHTML = '<p>Loading your trip…</p>';
    load(keysOf(all)).then(function () {
      var left = [], days = [], unknown = [];
      T.days.forEach(function (refs) {          // the link's days and order, exactly; a place that closed since is refused with its reason
        var its = []; refs.map(item).forEach(function (x) { var w = why(x); if (w === 'unknown') unknown.push(x.ref); else if (w) left.push({ x: x, why: w }); else its.push(x); });
        if (its.length) days.push({ key: its[0].key, a: its[0].a, items: its });
      });
      T.left.map(item).forEach(function (x) { var w = why(x); if (w === 'unknown') unknown.push(x.ref); else left.push({ x: x, why: w || 'fit' }); });
      var asked = T.days.length, stops = 0, tot = 0;
      var html = days.map(function (u, n) {
        var D = data[u.key], pts = u.items.map(function (x) { return x.ll; }), legs = pts.map(function (p, i) { return i ? km(pts[i - 1], p) : 0; });
        var dk = legs.reduce(function (s, v) { return s + v; }, 0), w = Cleo.geo.walk(dk); stops += u.items.length; tot += dk;
        var ids = u.items.map(function (x) { return x.id; }), area = D.ar[u.a] || u.a, col = /^#/.test(D.col[u.a] || '') ? D.col[u.a] : 'var(--city)';
        var mapHref = Cleo.root + D.href + '#day=' + encodeURIComponent(u.a) + '&s=' + ids.join(',') + '&trip=' + r.trip + '&d=' + (n + 1);
        return '<section class="tday" id="tday-' + (n + 1) + '" aria-labelledby="tday-h-' + (n + 1) + '" style="--area:' + esc(col) + '">' +
          '<header><span class="eyebrow">Day ' + (n + 1) + ' · ' + esc(D.name) + '</span><h2 id="tday-h-' + (n + 1) + '">' + esc(area) + '</h2>' +
          '<p class="tday-sum">' + pl(u.items.length, 'stop') + (u.items.length > 1 ? ' · ' + esc(w.dist) + ' between stops · about ' + w.min + ' min walking' : '') + '</p></header>' +
          sketch(pts, n + 1) +
          '<ol class="tstops">' + u.items.map(function (x, i) {
            var p = x.p, nx = u.items[i + 1], lw = nx ? Cleo.geo.walk(legs[i + 1]) : null;
            return '<li class="tstop"><span class="n" aria-hidden="true">' + (i + 1) + '</span><div class="tstop-b">' +
              '<a class="go" href="' + esc(Cleo.root + D.href + '#p=' + encodeURIComponent(p.id)) + '"><span class="vh">Stop ' + (i + 1) + ': </span>' + esc(label(p)) + '</a>' +
              '<span class="sm">' + (p.kind === 'food' ? 'eat & drink' : 'sight') + (TIER[p.t] ? ' · ' + TIER[p.t] : '') + '</span>' +
              '<p class="tstop-src">' + esc(firstSource(x)) + '</p>' +
              (p.pv && p.pv.checked ? '<p class="chk">Open when last checked · ' + esc(p.pv.checked) + '</p>' : '') + '</div>' +
              (lw ? '<p class="leg">' + esc(lw.text) + ' to stop ' + (i + 2) +
                ' <a href="https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&amp;route=' + x.ll.join('%2C') + '%3B' + nx.ll.join('%2C') + '" rel="noopener" target="_blank">Directions<span class="vh"> from ' + esc(label(p)) + ' to ' + esc(label(nx.p)) + '</span></a></p>' : '') +
              '</li>';
          }).join('') + '</ol>' +
          '<p class="tday-acts"><a class="btn btn-ghost" href="' + esc(mapHref) + '" data-tp-day="' + (n + 1) + '">Open day ' + (n + 1) + ' on the map</a></p></section>';
      }).join('');
      var tw = Cleo.geo.walk(tot);
      var lo = left.length ? '<section class="tp-left" aria-labelledby="tp-left-h"><h2 id="tp-left-h">Left out (' + left.length + ')</h2><ul>' + left.map(function (l) {
        var D = data[l.x.key], p = l.x.p;
        return '<li' + (l.why === 'closed' ? ' class="closed"' : '') + '><a href="' + esc(Cleo.root + D.href + '#p=' + encodeURIComponent(p.id)) + '">' + esc(label(p)) + '</a> <span class="sm">' + esc(D.name) + '</span><p>' + esc(reason(l, asked)) + '</p></li>';
      }).join('') + '</ul></section>' : '';
      var gone = unknown.length ? '<p class="tp-gone" role="note">' + pl(unknown.length, 'place') + ' in this link ' + (unknown.length === 1 ? 'is' : 'are') + ' no longer listed in a guide: ' + esc(unknown.map(idOf).join(', ')) + '. The link may be older than the guide.</p>' : '';
      var guides = keysOf(days.map(function (u) { return u.items[0].ref; })).map(function (k) { return data[k].name; });
      box.innerHTML = '<header class="tp-head tp-cover"><span class="eyebrow">Your trip' + (guides.length ? ' · ' + esc(guides.join(', ')) : '') + '</span><h1 id="tp-h" class="d1">' + esc(name) + '</h1>' +
        '<p class="tp-sum">' + pl(days.length, 'day') + ' · ' + pl(stops, 'stop') + (days.length ? ' · ' + esc(tw.dist) + ' between stops in all' : '') + '</p>' +
        '<p class="caveat" data-tp-assume>' + esc(Cleo.geo.ASSUME) + '. Check opening times before you go; the guide doesn’t list them.</p>' +
        '<div class="sharebar"><button type="button" class="btn btn-primary" data-tp="share">Share this trip</button>' +
        '<button type="button" class="btn btn-ghost" data-cleo-card="trip">Share as an image</button>' +
        '<button type="button" class="btn btn-ghost" data-tp="print">Print as a booklet</button>' +
        '<button type="button" class="btn btn-ghost" data-tp="kml">Export KML</button>' +
        '<a class="btn btn-quiet" href="#list=' + codec().encode(all) + '&n=' + encodeURIComponent(name) + '">Change the days</a></div>' +
        (days.length > 1 ? '<nav class="tp-nav" aria-label="Days">' + days.map(function (u, n) { return '<a href="#tday-' + (n + 1) + '" data-tp-go="' + (n + 1) + '">Day ' + (n + 1) + ' · ' + esc(data[u.key].ar[u.a] || u.a) + '</a>'; }).join('') + '</nav>' : '') +
        '</header>' + gone + (days.length ? html : '<p class="sv-empty">No day can be planned from this link: every place in it is closed, unpinned or no longer listed.</p>') + lo;
      box._trip = { name: name, days: days, left: left, unknown: unknown, asked: asked };
      Cleo.emit('cleo:trip', box._trip);                        // share-card.js (W9-7) and tests listen
      if (+r.d && d.getElementById('tday-' + r.d)) { var h = d.getElementById('tday-h-' + r.d); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); h.closest('section').scrollIntoView(); }
      else focusH();
    });
  }

  /** A route sketch from our own pins (no tiles): numbered dots and dashed straight lines, north up. */
  function sketch(pts, n) {
    if (pts.length < 2) return '';
    var W = 320, H = 150, P = 18, la = pts.map(function (p) { return p[0]; }), ln = pts.map(function (p) { return p[1]; });
    var y0 = Math.min.apply(0, la), y1 = Math.max.apply(0, la), x0 = Math.min.apply(0, ln), x1 = Math.max.apply(0, ln), cx = Math.cos((y0 + y1) / 2 * Math.PI / 180);
    var sx = (x1 - x0) * cx || 1e-6, sy = (y1 - y0) || 1e-6, k = Math.min((W - 2 * P) / sx, (H - 2 * P) / sy);
    var ox = (W - sx * k) / 2, oy = (H - sy * k) / 2;
    var xy = pts.map(function (p) { return [(ox + (p[1] - x0) * cx * k).toFixed(1), (oy + (y1 - p[0]) * k).toFixed(1)]; });
    return '<svg class="tday-sk" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Sketch of day ' + n + ': ' + pts.length + ' stops in walking order, drawn from the guide’s own pins">' +
      '<polyline points="' + xy.map(function (q) { return q.join(','); }).join(' ') + '" fill="none" stroke="var(--area,var(--city))" stroke-width="2.5" stroke-dasharray="1 7" stroke-linecap="round"/>' +
      xy.map(function (q, i) { return '<g><circle cx="' + q[0] + '" cy="' + q[1] + '" r="10" fill="var(--area,var(--city))" stroke="var(--surface)" stroke-width="2"/><text x="' + q[0] + '" y="' + q[1] + '" dy="4" text-anchor="middle">' + (i + 1) + '</text></g>'; }).join('') + '</svg>';
  }

  function kml(T) {
    var x = function (s) { return String(s).replace(/[<&>]/g, function (c) { return { '<': '&lt;', '&': '&amp;', '>': '&gt;' }[c]; }); };
    var body = T.days.map(function (u, n) {
      var D = data[u.key];
      return '<Folder><name>Day ' + (n + 1) + ' · ' + x(D.ar[u.a] || u.a) + '</name>' + u.items.map(function (it, i) {
        return '<Placemark><name>' + (i + 1) + '. ' + x(label(it.p)) + '</name><description>' + x(firstSource(it) + (it.p.ad ? ' — ' + it.p.ad : '')) + '</description><Point><coordinates>' + it.ll[1] + ',' + it.ll[0] + '</coordinates></Point></Placemark>';
      }).join('') + (u.items.length > 1 ? '<Placemark><name>Day ' + (n + 1) + ' route (straight lines)</name><LineString><coordinates>' + u.items.map(function (it) { return it.ll[1] + ',' + it.ll[0]; }).join(' ') + '</coordinates></LineString></Placemark>' : '') + '</Folder>';
    }).join('');
    var a = d.createElement('a');
    a.href = URL.createObjectURL(new Blob(['<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>' + x(T.name) + '</name><description>' + x(Cleo.geo.ASSUME) + '</description>' + body + '</Document></kml>'], { type: 'application/vnd.google-earth.kml+xml' }));
    a.download = (T.name.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'cleo-trip') + '.kml'; d.body.appendChild(a); a.click(); a.remove();
  }

  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-tp],[data-tp-go]'); if (!b || !box.contains(b)) return;
    if (b.hasAttribute('data-tp-go')) {
      e.preventDefault(); var h = d.getElementById('tday-h-' + b.getAttribute('data-tp-go'));
      if (h) { h.setAttribute('tabindex', '-1'); h.closest('section').scrollIntoView({ block: 'start' }); h.focus({ preventScroll: true }); }
      return;
    }
    var k = b.getAttribute('data-tp'), r = Cleo.route.parse(), T = box._trip;
    if (k === 'share' && T) Cleo.share(T.name + ' — Cleo', location.href.split('#')[0] + tripHref(r.trip, T.name));
    else if (k === 'print') window.print();
    else if (k === 'kml' && T) kml(T);
    else if (k === 'forget') { var t = trips(); t.splice(+b.getAttribute('data-i'), 1); st.set('trips', t); paint(); var f = d.querySelector('.tp-mine button, .tp-from a'); if (f) f.focus(); }
  });
  window.addEventListener('hashchange', function () { if (!/^#tday-\d+$/.test(location.hash)) paint(); });
  paint();
})();
