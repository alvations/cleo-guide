/* Insights view (FE-B, W3 B-02) — the guide in numbers. design/beta/views/SPEC.md §3.4.
 *
 * Stat tiles, 7 chart cards drawn as inline SVG (no chart library, no CDN), each with a caption naming its measure and
 * denominator, a legend, value labels, a <title> on every mark, "Show as a table" and a footnote saying what it does
 * not count; then the "All N places" index, so every place stays reachable from this view. Every bar is a link that
 * applies the lens (same route keys as every other view). Two renders per chart (640- and 360-wide viewBox) keep chart
 * text ≥ 12 px at 390 px; CSS shows one. Colours are tokens (--series-1…6, --series-other), so dark mode picks the dark
 * set by token, never by flipping.
 *
 * Numbers come from the platform's `insights` block in data/places/<page>.json (P-03) when it is there; otherwise the
 * same numbers are computed here from the records with the same rules. Loads in node too, for the gates.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.CleoInsights = api;
    var def = { title: 'Insights', mount: api.mount, unmount: api.unmount };
    if (root.Cleo && root.Cleo.views && root.Cleo.views.register) root.Cleo.views.register('insights', def);
    else (root.CleoViewQueue = root.CleoViewQueue || []).push(['insights', def]);
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var SER = ['var(--series-1,#2a78d6)', 'var(--series-2,#eb6834)', 'var(--series-3,#1baf7a)', 'var(--series-4,#eda100)', 'var(--series-5,#e87ba4)', 'var(--series-6,#6250d6)'];
  var OTHER = 'var(--series-other,#b4ada2)', CLOSED = 'var(--closed,#9b4a3c)';
  var TIER = { 1: 'Must see', 2: 'Worth the detour', 3: 'Deep cut' };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var plural = function (n, w, pl) { return n + ' ' + (n === 1 ? w : (pl || w + 's')); };
  var shortArea = function (n) { return String(n || '').split(/\s+[(—–]\s*|\s+\(/)[0].trim(); };
  var clip = function (s, n) { s = String(s); return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+$/, '') + '…'; };
  var pct = function (n, d) { return d ? Math.round(100 * n / d) : 0; };
  var href = function (o) { return '#' + Object.keys(o).filter(function (k) { return o[k] !== '' && o[k] != null; }).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(o[k]); }).join('&'); };
  var km = function (a, b) {
    var R = 6371, r = Math.PI / 180, f1 = a.la * r, f2 = b.la * r, df = f2 - f1, dl = (b.ln - a.ln) * r;
    var h = Math.pow(Math.sin(df / 2), 2) + Math.cos(f1) * Math.cos(f2) * Math.pow(Math.sin(dl / 2), 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  };
  var median = function (xs) { var s = xs.slice().sort(function (a, b) { return a - b; }); return s[s.length >> 1]; };

  /* ---- the numbers (P-03 shape when the build ships it; the same rules otherwise) ---- */
  function numbers(d) {
    var places = d.places, N = places.length, g = d.guide || {}, pop = {}, areas = (d.areas || []).slice(), by = {};
    ((g.popCulture && g.popCulture.c) || []).forEach(function (c) { pop[c] = 1; });
    var hasPop = Object.keys(pop).length > 0;
    var k3 = function (p) { return p.kind === 'food' ? 'food' : (p.g || []).some(function (c) { return pop[c]; }) ? 'pop' : 'sight'; };
    areas.forEach(function (a) { by[a.id] = []; });
    places.forEach(function (p, i) { if (!by[p.a]) { by[p.a] = []; areas.push({ id: p.a, n: p.a }); } by[p.a].push({ p: p, i: i }); });
    areas = areas.filter(function (a) { return by[a.id].length; });
    areas.forEach(function (a) {
      by[a.id].sort(function (x, y) {
        if (typeof x.p.rank === 'number' && typeof y.p.rank === 'number') return x.p.rank - y.p.rank;
        return (!!x.p.closed - !!y.p.closed) || (x.p.t - y.p.t) || ((y.p.src || []).length - (x.p.src || []).length) || (x.i - y.i);
      });
      by[a.id] = by[a.id].map(function (x) { return x.p; });
    });
    var pinned = function (p) { var pv = p.pv || {}; return (pv.pin === 'high' || pv.pin === 'med') && p.la != null; };
    var count = function (xs, f) { var c = {}; xs.forEach(function (x) { [].concat(f(x)).forEach(function (k) { if (k != null) c[k] = (c[k] || 0) + 1; }); }); return c; };
    var cites = count(places, function (p) { return p.src || []; });
    var top = Object.keys(cites).sort(function (a, b) { return cites[b] - cites[a] || (a < b ? -1 : 1); }).slice(0, 5);
    var K3 = count(places, k3);
    var canon = g.canon || null;
    var I = {
      N: N, areas: areas.map(function (a) { return { id: a.id, name: shortArea(a.n), c: (d.colors || {})[a.id] || '#888' }; }),
      tiles: { places: N, areas: areas.length, sights: (K3.sight || 0) + (K3.pop || 0), food: K3.food || 0, pop: hasPop ? (K3.pop || 0) : null,
        sources: (d.stats || {}).sources || Object.keys(cites).length, citations: places.reduce(function (s, p) { return s + (p.src || []).length; }, 0),
        closed: places.filter(function (p) { return p.closed; }).length, lastChecked: (d.stats || {}).lastChecked || '' },
      kind: { whole: K3, perArea: {} }, src: { top: top, perArea: {}, all: Object.keys(cites).length }, perArea: {}, spread: {}, spreadPins: 0,
      closed: {}, months: count(places, function (p) { return ((p.pv || {}).checked || '').slice(0, 7) || 'not recorded'; }),
      canon: canon && canon.dishes && canon.dishes.length ? { title: canon.title, cz: canon.cz, n: canon.n, open: canon.open,
        dishes: canon.dishes.map(function (x) { return { t: x.t, n: x.n }; }),
        named: Object.keys(count(canon.dishes, function (x) { return x.ids || []; })).length } : null,
      tiers: {}, popC: Object.keys(pop).sort()[0] || null, order: {}
    };
    areas.forEach(function (a) {
      var lst = by[a.id];
      I.order[a.id] = lst.map(function (p) { return p.id; });
      I.kind.perArea[a.id] = count(lst, k3);
      I.src.perArea[a.id] = count(lst, function (p) { return (p.src || []).map(function (s) { return top.indexOf(s) >= 0 ? s : '_o'; }); });
      I.perArea[a.id] = lst.length;
      I.closed[a.id] = lst.filter(function (p) { return p.closed; }).length;
      I.tiers[a.id] = count(lst.filter(function (p) { return !p.closed; }), function (p) { return p.t; });
      var pin = lst.filter(function (p) { return !p.closed && pinned(p); });
      I.spreadPins += pin.length;
      if (pin.length >= 2) {
        var c = { la: median(pin.map(function (p) { return p.la; })), ln: median(pin.map(function (p) { return p.ln; })) };
        I.spread[a.id] = Math.round(10 * median(pin.map(function (p) { return km(c, p); }))) / 10;
      }
    });
    return I;
  }

  /* ---- the platform's P-03 block (RFC §13) mapped onto the same shape; its notes become the footnotes ---- */
  function fromPlatform(d) {
    var P = d.insights;
    if (!P || P.N !== d.places.length || !P.mix || !P.tiers) return null;
    var I = numbers(d), byA = function (rows) { var o = {}; (rows || []).forEach(function (r) { if (r.a) o[r.a] = r; }); return o; };
    var counts = function (r, keys) { var o = {}; keys.forEach(function (k) { if (r && r[k]) o[k] = r[k]; }); return o; };
    var ser = P.mix.series || ['sight', 'food'], mx = byA(P.mix.rows), sr = byA(P.sources.rows), pa = byA(P.perArea.rows), sp = byA(P.spread.rows), cl = byA(P.closed.rows), ti = byA(P.tiers.rows);
    I.tiles = P.tiles;
    I.kind.whole = counts(P.mix.rows.filter(function (r) { return !r.a; })[0], ser);
    I.src.top = P.sources.top.slice(); I.src.all = P.sources.nSources;
    I.spreadPins = P.spread.of; I.spread = {}; I.months = {};
    (P.closed.months || []).forEach(function (m) { I.months[m.m] = m.n; });
    I.areas.forEach(function (a) {
      var id = a.id;
      I.kind.perArea[id] = counts(mx[id], ser);
      I.src.perArea[id] = counts(sr[id], P.sources.top); if (sr[id] && sr[id]._other) I.src.perArea[id]._o = sr[id]._other;
      I.perArea[id] = (pa[id] || {}).n || 0;
      if (sp[id] && sp[id].km != null) I.spread[id] = sp[id].km;
      I.closed[id] = (cl[id] || {}).n || 0;
      I.tiers[id] = counts(ti[id], ['1', '2', '3']);
    });
    I.canon = P.canon && P.canon.rows && P.canon.rows.length ? { title: P.canon.title, cz: P.canon.cz, n: P.canon.of, open: P.canon.open, named: P.canon.named, dishes: P.canon.rows.map(function (x) { return { t: x.t, n: x.n }; }) } : null;
    I.notes = { mix: P.mix.note, src: P.sources.note, den: P.perArea.note, spr: P.spread.note, cls: P.closed.note, can: P.canon && P.canon.note, tier: P.tiers.note };
    I.from = 'platform';
    return I;
  }

  /* ---- chart primitives: one axis, 2 px gaps, rounded ends, value labels, <title> on every mark. Bars stay 24 px tall,
   * but every row is 44 px and every link carries a transparent 44 px hit rect (W5, ROUND-4 gap #8): a plain bar row is
   * one link over its whole label + bar; a stacked row's label is a link to the whole row and each segment is 44 px
   * tall. "Show as a table" stays as the fallback. ---- */
  var RH = 44, BY = 10;
  var hit = function (x, y, w) { return '<rect class="hit" x="' + x.toFixed(1) + '" y="' + y + '" width="' + Math.max(w, 1).toFixed(1) + '" height="' + RH + '" style="fill:transparent;stroke:none"/>'; };
  function stackSvg(rows, series, link, uid, asPct, W, LW, narrow) {
    var G = 2, span0 = W - LW - 44;
    var mx = Math.max.apply(null, rows.map(function (r) { return sum(r.v); }).concat(1));
    var out = ['<svg class="chart" viewBox="0 0 ' + W + ' ' + (rows.length * RH + 26) + '" role="img" aria-labelledby="' + uid + '-t ' + uid + '-d">'];
    [0, .25, .5, .75, 1].forEach(function (t) {
      var x = (LW + t * span0).toFixed(1);
      out.push('<line class="grid" x1="' + x + '" x2="' + x + '" y1="0" y2="' + rows.length * RH + '"/><text class="ax" x="' + x + '" y="' + (rows.length * RH + 16) + '" text-anchor="middle">' + (asPct ? Math.round(t * 100) + '%' : Math.round(t * mx)) + '</text>');
    });
    rows.forEach(function (r, i) {
      var y0 = i * RH, y = y0 + BY, tot = sum(r.v) || 1, x = LW, span = span0 * (asPct ? 1 : tot / mx);
      var lb = '<text class="lb" x="' + (LW - 10) + '" y="' + (y + 16) + '" text-anchor="end">' + esc(clip(r.label, narrow ? 15 : LW >= 200 ? 30 : 24)) + '</text>';
      // the whole-guide row ("All of …") has no lens to apply, so its label stays text
      out.push(r.key ? '<a href="' + esc(link(r.key, '')) + '" aria-label="' + esc(r.label + ' · all ' + sum(r.v)) + '">' + hit(0, y0, LW - 4) + lb + '</a>' : lb);
      series.forEach(function (s) {
        var n = r.v[s.id] || 0; if (!n) return;
        var w = span * n / tot;
        out.push('<a href="' + esc(link(r.key, s.id)) + '" aria-label="' + esc(r.label + ' · ' + s.name + ': ' + n) + '">' + hit(x, y0, w - G) + '<rect class="bar" x="' + x.toFixed(1) + '" y="' + y + '" width="' + Math.max(w - G, 1).toFixed(1) + '" height="24" rx="3" style="fill:' + s.c + '">' +
          '<title>' + esc(r.label + ' · ' + s.name + ': ' + n + ' of ' + tot + ' (' + pct(n, tot) + '%)') + '</title></rect></a>');
        x += w;
      });
      out.push('<text class="vl" x="' + (x + 6).toFixed(1) + '" y="' + (y + 16) + '">' + sum(r.v) + '</text>');
    });
    return out.join('') + '</svg>';
  }
  function barSvg(rows, link, uid, unit, W, LW, narrow) {
    var mx = Math.max.apply(null, rows.map(function (r) { return r.n; }).concat(0)) || 1;
    var out = ['<svg class="chart" viewBox="0 0 ' + W + ' ' + (rows.length * RH + 2) + '" role="img" aria-labelledby="' + uid + '-t ' + uid + '-d">'];
    rows.forEach(function (r, i) {
      var y0 = i * RH, y = y0 + BY, w = (W - LW - 70) * r.n / mx;
      out.push('<a href="' + esc(link(r.key)) + '" aria-label="' + esc(r.label + ': ' + r.n + unit) + '">' + hit(0, y0, LW + Math.max(w, 2) + 4) +
        '<text class="lb" x="' + (LW - 10) + '" y="' + (y + 16) + '" text-anchor="end">' + esc(clip(r.label, narrow ? 15 : LW >= 200 ? 30 : 24)) + '</text>' +
        '<rect class="bar" x="' + LW + '" y="' + y + '" width="' + Math.max(w, 2).toFixed(1) + '" height="24" rx="3" style="fill:' + r.c + '"><title>' + esc(r.label + ': ' + r.n + unit) + '</title></rect></a>' +
        '<text class="vl" x="' + (LW + w + 6).toFixed(1) + '" y="' + (y + 16) + '">' + r.n + esc(unit) + '</text>');
    });
    return out.join('') + '</svg>';
  }
  var sum = function (v) { return Object.keys(v).reduce(function (s, k) { return s + v[k]; }, 0); };
  // two renders (wide / narrow); the browser re-renders both at the card's measured width so 1 viewBox unit = 1 px
  // in the browser (opt.only) just the render CSS shows is drawn, and table bodies (opt.lazyTables) are built when their
  // <details> opens — the same numbers, about 1,100 fewer nodes on Tokyo (W5, ROUND-4 gap #5: ≤ 3 k nodes)
  var SIZE = { W: 640, Wn: 320 }, ONLY = '', TBL = null;
  var both = function (fn, args) {
    return (ONLY !== 'n' ? '<div class="cw">' + fn.apply(null, args.concat([SIZE.W, SIZE.W < 480 ? 104 : SIZE.W < 560 ? 168 : 200, SIZE.W < 480])) + '</div>' : '') +
      (ONLY !== 'w' ? '<div class="cn">' + fn.apply(null, args.concat([SIZE.Wn, 104, true])) + '</div>' : '');
  };
  var details = function (summary, table) {
    if (!TBL) return '<details class="tbl"><summary>' + summary + '</summary>' + table + '</details>';
    TBL.push(table);
    return '<details class="tbl" data-tbl="' + (TBL.length - 1) + '"><summary>' + summary + '</summary></details>';
  };
  function stacked(rows, series, head, link, uid, asPct) {
    var legend = '<ul class="legend">' + series.map(function (s) { return '<li><i style="background:' + s.c + '"></i>' + esc(s.name) + '</li>'; }).join('') + '</ul>';
    var table = details('Show as a table', '<table><thead><tr><th scope="col">' + esc(head) + '</th>' + series.map(function (s) { return '<th scope="col">' + esc(s.name) + '</th>'; }).join('') + '<th scope="col">Total</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><th scope="row">' + esc(r.label) + '</th>' + series.map(function (s) { return '<td>' + (r.v[s.id] || 0) + '</td>'; }).join('') + '<td>' + sum(r.v) + '</td></tr>'; }).join('') + '</tbody></table>');
    return legend + both(stackSvg, [rows, series, link, uid, asPct]) + table;
  }
  function bars(rows, link, uid, unit) {
    var table = details('Show as a table', '<table><tbody>' + rows.map(function (r) { return '<tr><th scope="row">' + esc(r.label) + '</th><td>' + r.n + esc(unit) + '</td></tr>'; }).join('') + '</tbody></table>');
    return both(barSvg, [rows, link, uid, unit]) + table;
  }
  var card = function (uid, title, sub, body, foot) {
    return '<section class="icard" id="in-' + uid + '" aria-labelledby="' + uid + '-t"><h2 class="d3" id="' + uid + '-t">' + esc(title) + '</h2><p class="sub" id="' + uid + '-d">' + esc(sub) + '</p>' + body + (foot ? '<p class="fn">' + esc(foot) + '</p>' : '') + '</section>';
  };

  /* ---- the whole view as an HTML string ---- */
  function render(d, opt) {
    SIZE = { W: (opt && opt.W) || 640, Wn: (opt && opt.Wn) || 320 }; ONLY = (opt && opt.only) || ''; TBL = opt && opt.lazyTables ? [] : null;
    var I = fromPlatform(d) || numbers(d), T = I.tiles, N = I.N, name = d.name, NO = I.notes || {};
    var note = function (k, mine) { return NO[k] || mine; };
    var gal = function (o) { var r = { view: 'gallery' }; Object.keys(o).forEach(function (k) { r[k] = o[k]; }); return href(r); };
    var A = I.areas, srcName = {};
    (d.sourceIndex || []).forEach(function (s) { srcName[s.id] = s.id === 'guide' ? 'Added by the guide' : String(s.name).split(/\s+[·—(]\s*/)[0].slice(0, 34); });
    var tiles = [['Places', T.places, 'in ' + plural(T.areas, 'area')], ['Sights', T.sights, pct(T.sights, N) + '% of the guide'], ['Eat & drink', T.food, pct(T.food, N) + '% of the guide'],
      ['Pop culture (trail)', T.pop == null ? '—' : T.pop, T.pop == null ? 'no pop-culture collection in this city’s data' : 'sights on the pop-culture trail'],
      ['Named sources', T.sources, plural(T.citations, 'citation')], ['Closed, kept', T.closed, T.lastChecked ? 'status checked to ' + T.lastChecked : 'kept for the record']];
    var tilesH = '<div class="tiles">' + tiles.map(function (t) { return '<div class="tile"><span class="tl">' + esc(t[0]) + '</span><b>' + esc(t[1]) + '</b><span class="ts">' + esc(t[2]) + '</span></div>'; }).join('') + '</div>';

    // 1 · what each area is for
    var ks = [{ id: 'sight', name: 'Sights', c: SER[0] }, { id: 'food', name: 'Eat & drink', c: SER[1] }].concat(T.pop == null ? [] : [{ id: 'pop', name: 'Pop culture', c: SER[2] }]);
    var kq = function (k) { return k === 'food' ? { mode: 'food' } : k === 'pop' ? { c: I.popC } : { mode: 'sights' }; };
    var kRows = [{ label: 'All of ' + name, key: '', v: I.kind.whole }].concat(A.map(function (a) { return { label: a.name, key: a.id, v: I.kind.perArea[a.id] }; }));
    var c1 = card('mix', 'What each area is for', 'Share of sights, places to eat and pop-culture places, per area. All ' + N + ' places counted once; tap a bar to open those places.',
      stacked(kRows, ks, 'Area', function (a, k) { var o = k ? kq(k) : {}; if (a) o.a = a; return gal(o); }, 'mix', true),
      note('mix', T.pop == null ? 'This city has no pop-culture collection in its data, so the third segment is absent rather than zero-filled.' : 'Pop culture = places in the city’s pop-culture collections; a place counts in one segment only.'));
    // 2 · who recommends each area
    var ss = I.src.top.map(function (s, i) { return { id: s, name: srcName[s] || s, c: SER[i] }; }).concat([{ id: '_o', name: 'Other sources', c: OTHER }]);
    var c2 = card('src', 'Who recommends each area', 'Citations per area by source: the ' + I.src.top.length + ' most-cited sources, then all others. A place named by three sources counts three times (' + T.citations + ' citations over ' + N + ' places).',
      stacked(A.map(function (a) { return { label: a.name, key: a.id, v: I.src.perArea[a.id] }; }), ss, 'Area', function (a, s) { var o = { a: a }; if (s && s !== '_o') o.src = s; return gal(o); }, 'src', true),
      note('src', I.src.all + ' sources in all. “Added by the guide” marks general-knowledge additions and is never relabelled as sourced.'));
    // 3 · where the places are
    var c3 = card('den', 'Where the places are', 'Places per area, ' + N + ' in all (bars use each area’s map colour). Tap to open the area.',
      bars(A.map(function (a) { return { label: a.name, key: a.id, n: I.perArea[a.id], c: a.c }; }), function (a) { return gal({ a: a }); }, 'den', ''), note('den', ''));
    // 4 · how far you walk
    var spr = A.filter(function (a) { return I.spread[a.id] != null; });
    var c4 = card('spr', 'How far you walk', 'Median straight-line distance from each area’s middle pin to its open, verified pins. Small = a walkable cluster.',
      spr.length ? bars(spr.map(function (a) { return { label: a.name, key: a.id, n: I.spread[a.id], c: a.c }; }), function (a) { return href({ view: 'atlas', a: a }); }, 'spr', ' km') : '<p class="empty">Not enough verified pins to measure.</p>',
      note('spr', 'Computed from ' + I.spreadPins + ' open places with a verified pin; straight-line, not walking routes.' + (spr.length < A.length ? ' Areas with fewer than 2 such pins are absent rather than zero-filled.' : '')));
    // 5 · closures
    var cl = A.filter(function (a) { return I.closed[a.id]; });
    var months = Object.keys(I.months).sort();
    var c5 = card('cls', 'Closures, kept for the record', T.closed + ' of ' + N + ' places have closed. They stay in every view, flagged, and never carry a tier.',
      (cl.length ? bars(cl.map(function (a) { return { label: a.name, key: a.id, n: I.closed[a.id], c: CLOSED }; }), function (a) { return gal({ a: a, closed: '1' }); }, 'cls', '') : '<p class="empty">No closures on record.</p>') +
      details('When each place’s status was last checked', '<table><thead><tr><th scope="col">Month</th><th scope="col">Places</th></tr></thead><tbody>' +
      months.map(function (m) { return '<tr><th scope="row">' + esc(m) + '</th><td>' + I.months[m] + '</td></tr>'; }).join('') + '</tbody></table>'),
      note('cls', 'Every one of the ' + N + ' places is counted in the status-check table.'));
    // 6 · the signature canon
    var cn = I.canon;
    var c6 = cn ? card('can', 'The signature canon: ' + cn.title, cn.n + ' places in the canon’s cuisines (' + cn.open + ' open). Bars count places whose own write-up names the dish.',
      bars(cn.dishes.map(function (x) { return { label: x.t, key: x.t, n: x.n, c: SER[0] }; }), function () { return gal({ cz: (cn.cz || [])[0] }); }, 'can', ''),
      note('can', cn.named + ' of ' + cn.n + ' canon places name one of these dishes; the rest serve the canon cuisine without naming a dish, so they are not counted here.'))
      : card('can', 'The signature canon', 'This city has no named-dish canon in its data yet.', '<p class="empty">Stated, not filled.</p>');
    // 7 · the tier ladder
    var ts = [{ id: '1', name: TIER[1], c: SER[5] }, { id: '2', name: TIER[2], c: SER[0] }, { id: '3', name: TIER[3], c: OTHER }];
    var c7 = card('tier', 'The tier ladder per area', 'Open places by tier (' + (N - T.closed) + ' of ' + N + '). Tiers are graded within each area, so every area has its own must-sees.',
      stacked(A.map(function (a) { return { label: a.name, key: a.id, v: I.tiers[a.id] }; }), ts, 'Area', function (a, t) { return gal({ a: a, t: t }); }, 'tier', false),
      note('tier', T.closed + ' closed places carry no tier and are counted in the closures card instead.'));
    // the "All N places" index
    var byId = {}; d.places.forEach(function (p) { byId[p.id] = p; });
    var parts = A.map(function (a) {
      var ids = I.order[a.id];
      return '<section class="ix"><h3 class="d3"><i style="background:' + esc(a.c) + '"></i>' + esc(a.name) + ' <span class="meta">' + ids.length + '</span></h3><ul>' +
        ids.map(function (id) { var p = byId[id]; return '<li class="ixi" data-id="' + esc(id) + '"><a href="' + esc(href({ view: 'insights', p: id })) + '">' + esc(String(p.n).replace(/\s*[—–-]+\s*CLOSED\s*$/i, '')) + '</a>' + (p.closed ? ' <span class="flag closed">Closed</span>' : '') + '</li>'; }).join('') + '</ul></section>';
    }), idx = parts.join('');
    var nIdx = A.reduce(function (s, a) { return s + I.order[a.id].length; }, 0);
    if (nIdx !== N) throw new Error('insights index lost records: ' + nIdx + ' != ' + N);
    var top = '<div class="ins" data-cleo-insights><header class="ins-h"><h1 class="d2" tabindex="-1">' + esc(name) + ' in numbers</h1>' +
      '<p class="sub">Every number below is computed from the ' + N + ' places in this guide. Every chart accounts for all of them, and every bar opens those places in the Gallery.</p></header>' +
      tilesH + '<div class="igrid">' + c1 + c2 + c3 + c4 + c5 + c6 + c7 + '</div>' +
      '<section class="icard ixall" aria-labelledby="ix-t"><h2 class="d3" id="ix-t">All ' + N + ' places</h2><p class="sub">Every place the charts count, by area in rank order. Each opens its entry.</p><div class="ixg">';
    // `lazy` (W4 gap #6): the same page with the index body empty; mount() streams its area sections in on approach
    var tables = TBL; TBL = null; ONLY = '';
    return { html: top + idx + '</div></section></div>', lazy: top + '</div></section></div>', parts: parts, numbers: I, index: nIdx, tables: tables };
  }

  /* ---- browser ---- */
  var host = null, ix = null;
  function mount(el, ctx) {
    host = el; ctx = ctx || {};
    var C = window.Cleo || {}, main = document.getElementById('main'), key = ctx.key || (main && main.getAttribute('data-city'));
    el.classList.add('vw', 'view-insights'); el.setAttribute('aria-busy', 'true');
    return C.pageData(ctx.file || key).then(function (d) {
      if (host !== el) return;
      // draw only the render CSS shows, with table bodies built on open; the index starts empty when C.chunks streams it
      var nw = !!(window.matchMedia && matchMedia('(max-width: 639px)').matches), o = { only: nw ? 'n' : 'w', lazyTables: true };
      var r = render(d, o), lazy = !!C.chunks;
      el.innerHTML = lazy ? r.lazy : r.html; el.removeAttribute('aria-busy');
      // chart text stays at its CSS size (≥ 12 px): redraw at the card's real content width, once
      var c = el.querySelector('.icard'), cs = c && getComputedStyle(c);
      var w = c ? Math.floor(c.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) : 0;
      if (w > 200) { o[nw ? 'Wn' : 'W'] = w; r = render(d, o); el.innerHTML = lazy ? r.lazy : r.html; }
      el.insTables = r.tables || [];
      if (!el.fillTables) {   // one listener per host, reading the latest render's tables
        var fill = function (dt) { var k = dt.getAttribute('data-tbl'); if (k != null && !dt.querySelector('table') && el.insTables[+k]) dt.insertAdjacentHTML('beforeend', el.insTables[+k]); };
        el.addEventListener('toggle', function (e) { if (e.target && e.target.open) fill(e.target); }, true);
        el.fillTables = function () { [].forEach.call(el.querySelectorAll('details[data-tbl]'), fill); };
      }
      window.addEventListener('beforeprint', el.fillTables);
      // one render is drawn, so crossing the 640 px breakpoint (rotation, resize) redraws the other one
      if (window.matchMedia && !el.insMq) {
        el.insMq = matchMedia('(max-width: 639px)');
        var redraw = function () { if (host === el) { if (ix) { ix.cancel(); ix = null; } mount(el, ctx); } };
        if (el.insMq.addEventListener) el.insMq.addEventListener('change', redraw); else if (el.insMq.addListener) el.insMq.addListener(redraw);
      }
      // the "All N places" index is the heaviest part: mount it area by area as it nears the viewport, and all of it
      // on Cleo.defer.all() (lens, search, print) — the charts above stay complete (W4, ROUND-3 gap #6)
      if (lazy) ix = C.chunks(el.querySelector('.ixg'), r.parts, { initial: 0, est: 900 });
      return r;
    }, function () {
      if (host !== el) return;
      el.removeAttribute('aria-busy');
      el.innerHTML = '<p class="state" data-cleo-state="view-failed">The numbers couldn’t load just now. Every place is still in the list — switch to another view, or try again when you’re back online.</p>';
    });
  }
  function unmount() { if (ix) { ix.cancel(); ix = null; } if (host) { if (host.fillTables) window.removeEventListener('beforeprint', host.fillTables); host.innerHTML = ''; host.classList.remove('view-insights'); } host = null; }
  return { numbers: numbers, fromPlatform: fromPlatform, render: render, mount: mount, unmount: unmount };
});
