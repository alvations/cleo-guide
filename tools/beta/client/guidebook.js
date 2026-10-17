/* Guidebook view (FE-B, W3 B-01 + B-03) — chapters you can read and print. design/beta/views/SPEC.md §3.3.
 *
 * Drawn on demand from the page JSON (Cleo.pageData → data/places/<page>.json), so it costs the initial DOM nothing
 * (P-05). Every place appears exactly once, in view order (area order, then rank). The intro prose is a fixed template
 * filled only with computed numbers and record / source names. Print: chapter per page, every source of the page with
 * its URL, and the method notes verbatim.
 *
 * Plugs into FE-A's view registry: Cleo.views.register('guidebook', {mount, unmount}). Until the registry exists the
 * definition waits in window.CleoViewQueue. Also loads in node (module.exports) so the gates can render it from JSON.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.CleoGuidebook = api;
    var def = { title: 'Guidebook', mount: api.mount, unmount: api.unmount };
    if (root.Cleo && root.Cleo.views && root.Cleo.views.register) root.Cleo.views.register('guidebook', def);
    else (root.CleoViewQueue = root.CleoViewQueue || []).push(['guidebook', def]);
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // i18n D-41: interface strings from the catalogue (Cleo.t, the page's head snippet); the English here equals en.json
  // (test-i18n). In node (the gates) there is no Cleo, so the English is filled in place: output unchanged.
  var tt = function (k, e, v) { var C = typeof self !== 'undefined' && self.Cleo; return C && C.t ? C.t(k, e, v) : v ? e.replace(/\{([a-z]+)\}/g, function (m, n) { return n in v ? v[n] : m; }) : e; };
  var TIER = { get 1() { return tt('tier.1', 'Must see'); }, get 2() { return tt('tier.2', 'Worth the detour'); }, get 3() { return tt('tier.3', 'Deep cut'); } };
  var places = function (n) { return n === 1 ? tt('hub.places.one', '1 place') : tt('hub.places', '{n} places', { n: n }); };
  var LANG = { japan: 'ja', singapore: 'zh', vietnam: 'vi' };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var plural = function (n, w, pl) { return n + ' ' + (n === 1 ? w : (pl || w + 's')); };
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var longDate = function (v) { var m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(v || ''); if (!m) return String(v || ''); var mo = tt('land.month.names', MONTHS.join(',')).split(',')[+m[2] - 1];
    return m[3] ? tt('gb.date', '{d} {month} {y}', { d: +m[3], month: mo, y: m[1] }) : tt('gb.date.m', '{month} {y}', { month: mo, y: m[1] }); };
  var shortArea = function (n) { return String(n || '').split(/\s+[(—–]\s*|\s+\(/)[0].trim(); };

  /* ---- the view model: one record set, view order = area order then rank (P-01 `rank` when the build ships it) ---- */
  function model(d) {
    var places = d.places, N = places.length, pop = {}, src = {};
    ((d.guide && d.guide.popCulture && d.guide.popCulture.c) || []).forEach(function (c) { pop[c] = 1; });
    (d.sourceIndex || []).forEach(function (s) { src[s.id] = s; });
    var areas = (d.areas || []).slice(), by = {}, order = [];
    areas.forEach(function (a) { by[a.id] = []; });
    places.forEach(function (p, i) {
      if (!by[p.a]) { by[p.a] = []; areas.push({ id: p.a, n: p.a }); }
      by[p.a].push({ p: p, i: i });
    });
    var isPop = function (p) { return (p.g || []).some(function (g) { return pop[g]; }); };
    areas.forEach(function (a) {
      var lst = by[a.id];
      if (!lst.every(function (x) { return typeof x.p.rank === 'number'; }))
        lst.sort(function (x, y) { return (!!x.p.closed - !!y.p.closed) || (x.p.t - y.p.t) || ((y.p.src || []).length - (x.p.src || []).length) || (x.i - y.i); })
          .forEach(function (x, r) { x.rank = r + 1; });
      else lst.sort(function (x, y) { return x.p.rank - y.p.rank; }).forEach(function (x) { x.rank = x.p.rank; });
      by[a.id] = lst.map(function (x) {
        var p = x.p, nm = String(p.n).replace(/\s*[—–-]+\s*CLOSED\s*$/i, '');
        if (p.nat && nm.slice(-(p.nat.length + 2)) === '(' + p.nat + ')') nm = nm.slice(0, -(p.nat.length + 2)).trim();
        return { p: p, rank: x.rank, of: lst.length, open: !p.closed, name: nm, k3: p.k3 || (p.kind === 'food' ? 'food' : isPop(p) ? 'pop' : 'sight') };
      });
      order = order.concat(by[a.id]);
    });
    if (order.length !== N) throw new Error('view model lost records: ' + order.length + ' != ' + N);
    return { d: d, N: N, areas: areas.filter(function (a) { return by[a.id].length; }), by: by, order: order, src: src, isPop: isPop,
      hasPop: Object.keys(pop).length > 0, lang: LANG[d.country] || '', color: function (a) { return (d.colors || {})[a] || '#888'; } };
  }
  var srcShort = function (M, id) {
    if (id === 'guide') return tt('sheet.added', 'Added by the guide');
    var s = M.src[id]; return s ? String(s.name).split(/\s+[·—(]\s*/)[0].slice(0, 34) : id;
  };
  var hoods = function (n) {
    var m = /\(([^)]*)\)/.exec(n || ''); if (m) return m[1];
    var parts = String(n || '').split(/\s+[—–]\s+/); return parts.length > 1 ? parts.slice(1).join(' — ') : '';
  };
  var mostCited = function (lst, skipGuide) {
    var c = {}, best = null;
    lst.forEach(function (x) { (x.p.src || []).forEach(function (s) { if (skipGuide && s === 'guide') return; c[s] = (c[s] || 0) + 1; }); });
    Object.keys(c).forEach(function (s) { if (!best || c[s] > c[best]) best = s; });
    return best ? [best, c[best]] : null;
  };

  /* Intro prose — a fixed template. TEMPLATE lists every word it may add; the rest must be numbers or data names. */
  var TEMPLATE = 'holds place places in this guide: sight sights and to eat or drink. Its must-see is must-sees start with and here belong to the pop-culture trail. The source that names the most of them is has have closed; it stays they stay at the end of the chapter, flagged.';
  function intro(M, a, lst) {
    var op = lst.filter(function (x) { return x.open; });
    var s = op.filter(function (x) { return x.p.kind !== 'food'; }), f = op.filter(function (x) { return x.p.kind === 'food'; });
    var t1 = op.filter(function (x) { return x.p.t === 1; }), pop = op.filter(function (x) { return x.k3 === 'pop'; });
    var top = mostCited(lst, true), cl = lst.length - op.length;
    var out = [tt('gb.intro.holds', '{area} holds {places} in this guide: {sights} and {food} to eat or drink.', { area: shortArea(a.n), places: places(lst.length), sights: s.length === 1 ? tt('gb.sights.one', '1 sight') : tt('gb.sights', '{n} sights', { n: s.length }), food: places(f.length) })];
    if (t1.length) out.push(t1.length === 1 ? tt('gb.intro.t1.one', 'Its must-see is {a}.', { a: t1[0].name }) : t1[1] ? tt('gb.intro.t2', 'Its must-sees start with {a} and {b}.', { a: t1[0].name, b: t1[1].name }) : tt('gb.intro.t1', 'Its must-sees start with {a}.', { a: t1[0].name }));
    if (pop.length) out.push(tt('gb.intro.pop', '{places} here belong to the pop-culture trail.', { places: places(pop.length) }));
    if (top) out.push(tt('gb.intro.top', 'The source that names the most of them is {src} ({n}).', { src: srcShort(M, top[0]), n: top[1] }));
    if (cl) out.push(cl === 1 ? tt('gb.intro.closed.one', '{places} here has closed; it stays at the end of the chapter, flagged.', { places: places(cl) }) : tt('gb.intro.closed', '{places} here have closed; they stay at the end of the chapter, flagged.', { places: places(cl) }));
    return out.join(' ');
  }

  function entry(M, x) {
    var p = x.p, ref = M.d.key + '/' + p.id;
    var tier = x.open ? '<span class="tier t' + p.t + '"><i class="tg t' + p.t + '" aria-hidden="true"></i>' + TIER[p.t] + '</span>'
      : '<span class="flag closed">' + tt('gal.closed', 'Closed · kept for the record') + '</span>';
    var rec = (p.src || []).map(function (s) {
      return '<button type="button" class="src' + (s === 'guide' ? ' added' : '') + '" data-src="' + esc(s) + '">' + esc(srcShort(M, s)) + '</button>';
    }).join('<span class="sep">, </span>');
    return '<li class="ge" id="gb-' + esc(p.id) + '" data-id="' + esc(p.id) + '" data-a="' + esc(p.a) + '" data-k3="' + x.k3 + '" data-rank="' + x.rank + '"' + (x.open ? '' : ' data-closed') + '>' +
      '<h4><span class="rk" title="' + esc(tt('sheet.rank', 'No. {k} of {n} in {area}', { k: x.rank, n: x.of, area: shortArea((M.d.areas.filter(function (a) { return a.id === p.a; })[0] || {}).n || p.a) })) + '">' + x.rank + '</span><a href="#p=' + encodeURIComponent(p.id) + '" data-cleo-entry>' + esc(x.name) +
      (p.nat ? ' <span class="nat"' + (M.lang ? ' lang="' + M.lang + '"' : '') + '>' + esc(p.nat) + '</span>' : '') + '</a></h4>' +
      '<p class="ge-m">' + tier + (p.ad ? '<span class="ad">' + esc(p.ad) + '</span>' : '') + '</p>' +
      (p.w ? '<p class="ge-w">' + esc(p.w) + '</p>' : '') + (p.k ? '<p class="gk">' + tt('sheet.look', 'Look for:') + ' ' + esc(p.k) + '</p>' : '') +
      // D-39 (proposed): prose that quotes a price or a rating is labelled as a dated quote, never edited (`pq` from build)
      (p.pq ? '<p class="gq sm muted">' + esc(tt('sheet.quoted', 'Prices, ratings and times are quoted from the source at the time of research ({d}).', { d: p.pq })) + '</p>' : '') +
      '<p class="recby"><span>' + tt('card.recby', 'Recommended by') + '</span> ' + rec + '</p>' +
      '<button type="button" class="heart ge-save" data-cleo-ref="' + esc(ref) + '" aria-pressed="false" aria-label="' + esc(tt('gal.save', 'Save {name}', { name: x.name })) + '">' + tt('sheet.save', 'Save') + '</button></li>';
  }

  /* ---- the whole guidebook as an HTML string (no DOM needed: node renders the same thing for the gates) ---- */
  function render(d, opt) {
    opt = opt || {};
    var M = model(d), st = d.stats || {}, g = d.guide || {}, up = opt.root || '';
    var canon = {}; ((g.canon && g.canon.ids) || []).forEach(function (id) { canon[id] = 1; });
    var A = M.areas.length, chapters = [], toc = [], count = 0, parts = [];
    M.areas.forEach(function (a, n) {
      var lst = M.by[a.id], op = lst.filter(function (x) { return x.open; }), ac = M.color(a.id);
      var top = op.filter(function (x) { return x.p.t === 1; });
      var see = op.filter(function (x) { return x.p.t !== 1 && x.k3 === 'sight'; });
      var eat = op.filter(function (x) { return x.p.t !== 1 && x.k3 === 'food'; });
      var pop = op.filter(function (x) { return x.p.t !== 1 && x.k3 === 'pop'; });
      var gone = lst.filter(function (x) { return !x.open; });
      if (top.length + see.length + eat.length + pop.length + gone.length !== lst.length) throw new Error('guidebook section split lost records in ' + a.id);
      var secs = [['top', tt('gb.top', 'Top picks'), top], ['see', tt('gal.see', 'See'), see], ['eat', tt('gb.eat', 'Eat'), eat], ['pop', tt('fy.i.pop', 'Pop culture'), pop], ['gone', tt('city.door.closed.k', 'Kept for the record'), gone]]
        .filter(function (s) { return s[2].length; })
        .map(function (s) { count += s[2].length; return '<section class="gs gs-' + s[0] + '"><h3 class="d3">' + s[1] + ' <span class="meta">' + s[2].length + '</span></h3><ol class="gl">' + s[2].map(function (x) { return entry(M, x); }).join('') + '</ol></section>'; });
      var art = ((d.art || {}).areas || {})[a.id];
      var cited = mostCited(lst, false), pinned = lst.filter(function (x) { var pv = x.p.pv || {}; return pv.pin === 'high' || pv.pin === 'med'; }).length;
      var checked = lst.reduce(function (m, x) { var c = (x.p.pv || {}).checked || ''; return c > m ? c : m; }, '');
      var canonHere = op.filter(function (x) { return canon[x.p.id]; }).length;
      var side = '<aside class="facts-box" aria-label="' + esc(tt('gb.side', '{area} in numbers', { area: shortArea(a.n) })) + '">' +
        (art ? '<img class="sil" src="' + esc(up + art.src) + '" alt="" width="' + art.w + '" height="' + art.h + '" loading="lazy" decoding="async">' : '') +
        '<dl><dt>' + tt('gb.dt.places', 'Places') + '</dt><dd>' + lst.length + '</dd><dt>' + esc(tt('gb.dt.kinds', 'Sights · eat & drink')) + '</dt><dd>' + (lst.length - lst.filter(function (x) { return x.p.kind === 'food'; }).length) + ' · ' + lst.filter(function (x) { return x.p.kind === 'food'; }).length + '</dd>' +
        '<dt>' + TIER[1] + '</dt><dd>' + top.length + '</dd>' + (canonHere ? '<dt>' + esc(g.canon.title) + '</dt><dd>' + canonHere + '</dd>' : '') +
        '<dt>' + tt('gb.dt.closed', 'Closed, kept') + '</dt><dd>' + gone.length + '</dd>' + (cited ? '<dt>' + tt('gb.dt.cited', 'Most-cited source') + '</dt><dd>' + esc(srcShort(M, cited[0])) + ' (' + cited[1] + ')</dd>' : '') +
        '<dt>' + tt('gb.dt.pins', 'Pins verified') + '</dt><dd>' + tt('gb.of', '{a} of {b}', { a: pinned, b: lst.length }) + '</dd>' + (checked ? '<dt>' + tt('gb.dt.checked', 'Status checked') + '</dt><dd>' + tt('gb.to', 'to {d}', { d: '<time>' + esc(checked) + '</time>' }) + '</dd>' : '') + '</dl></aside>';
      var hd = hoods(a.n);
      // a chapter = shell (header, always mounted) + body (intro, sections, facts) — the body mounts on approach (gap #6)
      var shell = '<article class="ch" id="gb-area-' + esc(a.id) + '" data-area="' + esc(a.id) + '" aria-labelledby="gb-ch-' + esc(a.id) + '" style="--ac:' + esc(ac) + '">' +
        '<header class="ch-h"><p class="eyebrow">' + tt('gb.chapter', 'Chapter {n} of {total}', { n: n + 1, total: A }) + '</p><h2 id="gb-ch-' + esc(a.id) + '" class="d1" tabindex="-1">' + esc(shortArea(a.n)) + '</h2>' + (hd ? '<p class="hoods">' + esc(hd) + '</p>' : '') + '</header>' +
        '<div class="ch-g" data-gb-body="' + esc(a.id) + '">';
      // W8: the chapter leads with a credited photo where one exists (build: chapterPhotos — open sights only, never Vietnam);
      // the TASL credit sits under the media (cap is generated by the imagery credit gate, already escaped)
      var cp = (d.chapterPhotos || {})[a.id];
      var photo = cp ? '<figure class="photo ch-photo"><img src="' + esc(up + cp.src) + '"' +
        (cp.set && cp.set.length > 1 ? ' srcset="' + cp.set.map(function (w) { return esc(up + w[0]) + ' ' + w[1] + 'w'; }).join(', ') + '" sizes="(min-width: 1024px) 640px, 92vw"' : '') +
        ' width="' + cp.w + '" height="' + cp.h + '" alt="' + esc(cp.alt) + '" loading="lazy" decoding="async" style="aspect-ratio:3/2;height:auto;object-fit:cover"><figcaption>' + cp.cap + '</figcaption></figure>' : '';
      var body = '<div class="ch-main">' + photo + '<p class="ch-intro">' + esc(intro(M, a, lst)) + '</p>' + secs.join('') + '</div>' + side;
      parts.push({ id: a.id, shell: shell, body: body, n: lst.length });
      chapters.push(shell + body + '</div></article>');
      toc.push('<li><a href="#gb-area-' + esc(a.id) + '" data-gb-ch="' + esc(a.id) + '"><span class="n">' + (n + 1) + '</span><span class="t">' + esc(shortArea(a.n)) + '</span><span class="meta">' + lst.length + '</span></a></li>');
    });
    if (count !== M.N) throw new Error('guidebook lost records: ' + count + ' != ' + M.N);
    var sig = g.signature;
    var ed = edition(d), cp0 = d.coverPhoto;
    var cphoto = cp0 ? '<figure class="photo gc-photo"><img src="' + esc(up + cp0.src) + '"' +
      (cp0.set && cp0.set.length > 1 ? ' srcset="' + cp0.set.map(function (w) { return esc(up + w[0]) + ' ' + w[1] + 'w'; }).join(', ') + '" sizes="(min-width: 1024px) 760px, 92vw"' : '') +
      ' width="' + cp0.w + '" height="' + cp0.h + '" alt="' + esc(cp0.alt) + '" decoding="async" style="aspect-ratio:16/9;height:auto;object-fit:cover"><figcaption>' + cp0.cap + '</figcaption></figure>' : '';
    // W9-10: every number on the edition line is the page JSON's own (stats.total / stats.closed / stats.lastChecked)
    var edl = ed ? '<p class="edition" data-edition="' + ed + '"><b>' + tt('gb.edition', '{date} edition', { date: longDate(ed) }) + '</b> · <span data-n="total">' + places(st.total || M.N) + '</span>' +
      ' · <span data-n="closed">' + tt('city.facts.closed', '{n} closed', { n: st.closed || 0 }) + '</span>' + (st.lastChecked ? ' · <span data-d="checked">' + tt('gb.checkedto', 'checked to {d}', { d: '<time datetime="' + esc(st.lastChecked) + '">' + longDate(st.lastChecked) + '</time>' }) + '</span>' : '') + '</p>' : '';
    var cover = '<header class="gcover' + (cphoto ? ' has-photo' : '') + '">' + cphoto + '<p class="kicker">' + tt('gb.kicker', 'A field guide · {chapters} · {places}', { chapters: A === 1 ? tt('gb.chapters.one', '1 chapter') : tt('gb.chapters', '{n} chapters', { n: A }), places: places(M.N) }) + '</p>' +
      '<h1 class="hero-t" tabindex="-1">' + esc(d.name) + (d.nat ? ' <span class="native"' + (M.lang ? ' lang="' + M.lang + '"' : '') + '>' + esc(d.nat) + '</span>' : '') + '</h1>' + edl +
      (g.tileLine && g.tileLine.text ? '<p class="lead">' + esc(g.tileLine.text) + '</p>' : '') +
      '<p class="gfacts">' + [(st.sights || 0) === 1 ? tt('gb.sights.one', '1 sight') : tt('gb.sights', '{n} sights', { n: st.sights || 0 }), tt('gb.food', '{places} to eat and drink', { places: places(st.food || 0) }), (st.sources || 0) === 1 ? tt('gb.sources.one', '1 named source') : tt('gb.sources', '{n} named sources', { n: st.sources || 0 }),
        tt('gb.pins', '{a} of {b} pins verified', { a: st.verifiedPins || 0, b: st.pins || 0 })].concat(st.lastChecked ? [tt('gb.statusto', 'status checked to {d}', { d: longDate(st.lastChecked) })] : []).map(esc).join(' · ') + '</p>' +
      (sig ? '<p class="gsig">' + esc(tt('gb.sig', '★ {label}: {places}, marked through the chapters.', { label: sig.label || sig.title, places: places(sig.n) })) + '</p>' : '') + '</header>' + since(M, up);
    var nav = '<div class="bk" data-cleo-book>' +
      '<nav class="toc" aria-label="' + tt('gb.toc.label', 'Chapters') + '"><p class="eyebrow">' + tt('gb.toc', 'Contents') + '</p><ol>' + toc.join('') + '</ol>' +
      '<button type="button" class="btn btn-ghost" data-cleo-print>' + tt('gb.print', 'Print as booklet') + '</button></nav>' +
      '<div class="bk-main">' + cover;
    var app = appendix(M);
    // `lazy`: the same book, contents + chapter shells first; mount() fills each body (and the appendix) on approach
    var lazy = nav + parts.map(function (c) { return c.shell + '</div></article>'; }).join('') + '<div data-gb-appendix></div></div></div>';
    return { html: nav + chapters.join('') + app + '</div></div>', lazy: lazy, parts: parts, appendix: app, entries: count, model: M };
  }

  /* ---- W9-10 the dated edition: the edition = the newest month in the page's dated change log (data, never the clock) ---- */
  function edition(d) {
    var top = (d.changes || []).reduce(function (m, c) { return c.d > m ? c.d : m; }, '');
    return top.slice(0, 7);
  }
  // "Since the last edition": every dated change in the edition month, as the "What changed" page words it
  function since(M, root) {
    var d = M.d, ed = edition(d); if (!ed) return '';
    var line = function (c) {
      // the closure's sourced note is on the place and on "What changed" (it can quote money: the views carry no prices)
      if (c.kind === 'closed') return tt('gb.since.closed', 'Closed, kept for the record: {place}', { place: '<a href="#p=' + encodeURIComponent(c.id) + '">' + esc(c.name) + '</a>' });
      if (c.kind === 'checked') return tt('gb.since.checked', 'Open or closed status checked for {places}', { places: places(c.n) }) + (c.closed ? tt('gb.since.found', ' ({n} found closed)', { n: c.closed }) : '');
      return c.n === 1 ? tt('gb.since.pins.one', '1 map pin verified') : tt('gb.since.pins', '{n} map pins verified', { n: c.n });
    };
    var rows = (d.changes || []).filter(function (c) { return String(c.d).slice(0, 7) === ed; });
    return '<section class="gb-since" id="gb-since" aria-labelledby="gb-since-h" data-edition="' + ed + '"><h2 class="d2" id="gb-since-h">' + tt('gb.since.h', 'Since the last edition') + '</h2>' +
      '<p>' + esc(tt('gb.since.p', 'What changed in {city} during {month}, from the dated checks on record.', { city: d.name, month: longDate(ed) })) +
      (d.changesPage ? ' <a href="' + esc(root + d.changesPage) + '">' + tt('gb.since.all', 'Every change, with dates') + '</a>' : '') + '</p>' +
      '<ol class="since">' + rows.map(function (c) { return '<li data-kind="' + esc(c.kind) + '"><time datetime="' + esc(c.d) + '">' + longDate(c.d) + '</time> <span>' + line(c) + '</span></li>'; }).join('') + '</ol></section>';
  }

  /* ---- sources appendix (B-03): every source of the page with its URLs and record count, then the method notes ---- */
  function sourceUrls(M, s) {
    var seen = {}, out = [];
    var add = function (u) { if (/^https?:\/\//.test(u || '') && !seen[u]) { seen[u] = 1; out.push(u); } };
    (s.entries || []).forEach(function (e) { add(e.url); });
    M.d.places.forEach(function (p) {
      var i = (p.src || []).indexOf(s.id);
      if (i >= 0 && p.s && p.s.length === p.src.length && p.s[i]) add(p.s[i][1]);
    });
    if (!out.length) (s.domains || []).forEach(function (dm) { add('https://' + dm + '/'); });
    return out;
  }
  var host_ = function (u) { var m = /^https?:\/\/(?:www\.)?([^\/?#]+)/i.exec(u || ''); return m ? m[1].toLowerCase() : ''; };
  function appendix(M) {
    var per = {}, listed = {}, other = [];
    (M.d.sourceIndex || []).forEach(function (s) { per[s.id] = sourceUrls(M, s); per[s.id].forEach(function (u) { listed[u] = 1; }); });
    M.d.places.forEach(function (p) {
      (p.s || []).forEach(function (x) {
        var u = x && x[1]; if (!/^https?:\/\//.test(u || '') || listed[u]) return; listed[u] = 1;
        var h = host_(u), s = (M.d.sourceIndex || []).filter(function (s) { return (p.src || []).indexOf(s.id) >= 0 && (s.domains || []).some(function (dm) { return h === dm || h.slice(-dm.length - 1) === '.' + dm; }); })[0];
        if (s) per[s.id].push(u); else other.push(u);
      });
    });
    var rows = (M.d.sourceIndex || []).map(function (s) {
      var urls = per[s.id];
      return '<li><b>' + esc(s.name) + '</b> <span class="meta">' + places(s.n) + '</span>' +
        (urls.length ? '<ul class="urls">' + urls.map(function (u) { return '<li><a href="' + esc(u) + '" rel="noopener">' + esc(u) + '</a></li>'; }).join('') + '</ul>'
          : '<p class="sm">' + tt('gb.nourl', 'No web address on record for this source.') + '</p>') + '</li>';
    });
    var notes = (M.d.notes || []).map(function (n) { return '<section class="note"><h4>' + esc(n.title || n.k || '') + '</h4><p>' + esc(n.body || '') + '</p></section>'; });
    return '<section class="gb-appendix" id="gb-sources" aria-labelledby="gb-src-h"><h2 class="d2" id="gb-src-h">' + tt('gb.src.h', 'Sources and method') + '</h2>' +
      '<p>' + esc(tt('gb.src.p', 'Every source this guide cites for {city}, with the number of places it recommends and the pages it was read from.', { city: M.d.name })) + '</p>' +
      '<ol class="srclist">' + rows.join('') + '</ol>' +
      (other.length ? '<h3 class="d3">' + tt('gb.src.other', 'Other pages the records cite') + '</h3><ul class="urls">' + other.map(function (u) { return '<li><a href="' + esc(u) + '" rel="noopener">' + esc(u) + '</a></li>'; }).join('') + '</ul>' : '') + (notes.length ? '<div class="method">' + notes.join('') + '</div>' : '') + '</section>';
  }

  /* ---- browser: mount / unmount into the host FE-A's registry hands us ---- */
  var host = null, off = [], book = null;
  function syncSaved(el) {
    var C = window.Cleo; if (!C || !C.saved) return;
    [].forEach.call(el.querySelectorAll('[data-cleo-ref]'), function (b) { b.setAttribute('aria-pressed', C.saved.has(b.getAttribute('data-cleo-ref')) ? 'true' : 'false'); });
  }
  // Lenses: no second predicate here. Each entry mirrors its canonical card (li.pl#p-<id>), which the city page's lens
  // already hid or showed (including its own sig / been / mine / day lenses). A card still in a deferred chunk is asked
  // through the one shared predicate, Cleo.lens.match, on its attribute stub — so a lens never forces a stamp here.
  function syncLens(el) {
    var d = document, C = window.Cleo || {}, shown = 0, all = 0, stubs = null, hid = {};
    var route = C.route && C.lens ? C.lens.pick(C.route.parse()) : null;
    // decide every place from the model (chapters not mounted yet still count and hide), then mirror onto what's mounted
    (book ? book.order : []).forEach(function (x) {
      var id = x.p.id, c = d.getElementById('p-' + id), h; all++;
      if (!c && route && C.defer) {
        if (!stubs) { stubs = {}; C.defer.peek().forEach(function (s) { stubs[s.id.replace(/^p-/, '')] = s; }); }
        h = !!stubs[id] && !C.lens.match(stubs[id], route);
      } else h = !!(c && c.hidden);
      hid[id] = h; if (!h) shown++;
    });
    [].forEach.call(el.querySelectorAll('li.ge'), function (li) { li.hidden = !!hid[li.getAttribute('data-id')]; });
    [].forEach.call(el.querySelectorAll('section.gs'), function (s) { s.hidden = !s.querySelector('li.ge:not([hidden])'); });
    [].forEach.call(el.querySelectorAll('article.ch'), function (a) {
      a.hidden = !(book.by[a.getAttribute('data-area')] || []).some(function (x) { return !hid[x.p.id]; });
    });
    // QC-34: Contents counts what each chapter shows under the lens (not the build-time total); a chapter with nothing
    // under the lens leaves the Contents, as the chapter itself does
    [].forEach.call(el.querySelectorAll('a[data-gb-ch]'), function (a) {
      var n = (book.by[a.getAttribute('data-gb-ch')] || []).filter(function (x) { return !hid[x.p.id]; }).length, m = a.querySelector('.meta'), li = a.closest('li');
      if (m) m.textContent = n; if (li) li.hidden = !n;
    });
    var line = el.querySelector('[data-gb-count]');
    if (line) line.innerHTML = shown === all ? '<b>' + tt('gb.count.all', 'All {n} places', { n: all }) + '</b>' : '<b>' + tt('gb.count', '{s} of all {n} places', { s: shown, n: all }) + '</b>' + tt('gb.count.m', ' match this lens.') + ' <button type="button" class="btn btn-quiet" data-cleo-all>' + tt('city.showall', 'Show all {n}', { n: all }) + '</button>';
  }
  /* Lazy chapters (ROUND-3 gap #6): each chapter body is its own Cleo.chunks part (platform view chunks), so it mounts
   * as it nears the viewport, on a contents click or deep link (open()), and with everything else on Cleo.defer.all()
   * (lens, search, print, find-in-page). The contents and every chapter heading are in the DOM from the start. */
  var lazy = {};
  function open(aid) { var c = lazy[aid]; if (c) c.all(); }
  function areaOf(id) { var hit = null; (book ? book.order : []).some(function (x) { if (x.p.id === id) { hit = x.p.a; return true; } }); return hit; }
  var lastCtx = null;
  // i18n D-41: a book drawn before the ja catalogue arrived is drawn again in it
  if (typeof document !== 'undefined') document.addEventListener('cleo:locale', function () { var el = host, c = Object.assign({}, lastCtx, { user: false }); if (!el) return; unmount(); mount(el, c); });   // a redraw never moves focus (QC-10)
  function mount(el, ctx) {
    host = el; ctx = ctx || {}; lastCtx = ctx;
    var C = window.Cleo || {}, main = document.getElementById('main'), key = ctx.key || (main && main.getAttribute('data-city'));
    el.classList.add('vw', 'view-guidebook'); el.setAttribute('aria-busy', 'true');
    return C.pageData(ctx.file || key).then(function (d) {
      if (host !== el) return;
      var r = render(d, { root: C.root || '' }); book = r.model; lazy = {};
      if (C.chunks) {
        el.innerHTML = '<p class="count" data-gb-count></p>' + r.lazy;
        r.parts.forEach(function (c) {
          var b = el.querySelector('[data-gb-body="' + c.id + '"]');
          if (b) lazy[c.id] = C.chunks(b, [c.body], { initial: 0, est: 260 + c.n * 150 });
        });
        var ap = el.querySelector('[data-gb-appendix]'); if (ap) lazy[''] = C.chunks(ap, [r.appendix], { initial: 0, est: 1200 });
      } else el.innerHTML = '<p class="count" data-gb-count></p>' + r.html;
      el.removeAttribute('aria-busy');
      syncSaved(el); syncLens(el);
      // QC-10 (SPEC §5): after a switch by the user (ctx.user from views.js, or focus still on the switcher / its placeholder
      // heading), focus moves to the book's heading; never on the initial load
      var h1 = el.querySelector('h1');
      if (h1 && ctx.user) h1.focus({ preventScroll: true });
      ctx.user = false;   // once per user switch: a locale or lens remount (same ctx) never moves focus
      var on = function (t, ev, f) { t.addEventListener(ev, f); off.push(function () { t.removeEventListener(ev, f); }); };
      on(el, 'click', function (e) {
        var b = e.target.closest('[data-cleo-print]'); if (b) { printAll(); return; }
        if ((b = e.target.closest('[data-cleo-ref]')) && C.saved) { C.saved.toggle(b.getAttribute('data-cleo-ref')); syncSaved(el); return; }
        if ((b = e.target.closest('button.src[data-src]')) && C.route) { e.preventDefault(); var r0 = C.route.parse(); C.route.go({ view: r0.view || 'guidebook', src: b.getAttribute('data-src') }); return; }
        if ((b = e.target.closest('a[data-gb-ch]'))) { e.preventDefault(); open(b.getAttribute('data-gb-ch')); var h = document.getElementById('gb-ch-' + b.getAttribute('data-gb-ch')); if (h) { h.scrollIntoView({ block: 'start' }); h.focus({ preventScroll: true }); } }
      });
      on(document, 'cleo:saved', function () { syncSaved(el); });
      // OV (FE-B, overlay ledger): the phone / tablet Contents strip sticks right under the city bar, measured — the shared
      // `top:105px` sat 20–36 px under a 125–141 px bar, which covered it. Desktop keeps its side-column rule.
      var cbar = main && main.querySelector('.cbar'), pin = function () {
        if (!cbar) return; var cs = getComputedStyle(cbar), top = cs.position === 'sticky' || cs.position === 'fixed' ? (parseFloat(cs.top) || 0) + cbar.getBoundingClientRect().height : 0;
        el.style.setProperty('--gb-toc-top', Math.round(top) + 'px');
      };
      pin(); on(window, 'resize', pin);
      // OV-00 rule 1: the Contents strip is a guest row — it slides up behind the header on a scroll down, back on a scroll up
      var cmp = function () { var toc = host === el && el.querySelector('nav.toc'); if (toc && C.compact) off.push(C.compact(toc, 'is-away')); };
      if (C.compact) cmp(); else if (C.need) C.need('compact', cmp);   // compact.js: lazy here (not in the eager budget)
      if (window.ResizeObserver && cbar) { var ro = new ResizeObserver(pin); ro.observe(cbar); off.push(function () { ro.disconnect(); }); }
      // the city page sets `hidden` on its cards when a lens changes; follow those attribute flips (coalesced)
      var t = 0, later = function () { if (!t) t = setTimeout(function () { t = 0; if (host === el) syncLens(el); }, 0); };
      if (window.MutationObserver && main) {
        var mo = new MutationObserver(function (ms) { if (ms.some(function (m) { return m.target.classList && m.target.classList.contains('pl'); })) later(); });
        mo.observe(main, { subtree: true, attributes: true, attributeFilter: ['hidden'] }); off.push(function () { mo.disconnect(); });
      }
      on(document, 'cleo:stamped', later); on(window, 'hashchange', later);
      on(document, 'cleo:view-stamped', function (e) { var h = e.detail && e.detail.host; if (h && el.contains(h)) { syncSaved(h); later(); } });
      on(window, 'beforeprint', function () { if (C.defer) C.defer.all(); });
      var r1 = C.route ? C.route.parse() : {};
      if (r1.p) { open(areaOf(r1.p)); var li = document.getElementById('gb-' + r1.p); if (li) li.scrollIntoView({ block: 'center' }); }
      return r;
    }, function () {
      if (host !== el) return;
      el.removeAttribute('aria-busy');
      el.innerHTML = '<p class="state" data-cleo-state="view-failed">' + tt('gb.failed', 'The guidebook couldn’t load just now. Every place is still in the list — switch to another view, or try again when you’re back online.') + '</p>';
    });
  }
  function printAll() { var C = window.Cleo || {}; if (C.defer) C.defer.all(); if (host) syncLens(host); window.print(); }
  function unmount() { off.splice(0).forEach(function (f) { f(); }); Object.keys(lazy).forEach(function (k) { lazy[k].cancel(); }); lazy = {}; book = null; if (host) { host.innerHTML = ''; host.classList.remove('view-guidebook'); } host = null; }

  return { model: model, render: render, intro: intro, edition: edition, longDate: longDate, TEMPLATE: TEMPLATE, mount: mount, unmount: unmount, sourceUrls: sourceUrls, shortArea: shortArea };
});
