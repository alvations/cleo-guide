/* generated copy of tools/beta/client/guidebook.js — do not edit here */
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
  var TIER = { 1: 'Must see', 2: 'Worth the detour', 3: 'Deep cut' };
  var LANG = { japan: 'ja', singapore: 'zh', vietnam: 'vi' };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var plural = function (n, w, pl) { return n + ' ' + (n === 1 ? w : (pl || w + 's')); };
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
    if (id === 'guide') return 'Added by the guide';
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
    var out = [shortArea(a.n) + ' holds ' + plural(lst.length, 'place') + ' in this guide: ' + plural(s.length, 'sight') + ' and ' + plural(f.length, 'place') + ' to eat or drink.'];
    if (t1.length) out.push((t1.length === 1 ? 'Its must-see is ' : 'Its must-sees start with ') + t1[0].name + (t1.length > 1 ? ' and ' + t1[1].name : '') + '.');
    if (pop.length) out.push(plural(pop.length, 'place') + ' here belong to the pop-culture trail.');
    if (top) out.push('The source that names the most of them is ' + srcShort(M, top[0]) + ' (' + top[1] + ').');
    if (cl) out.push(plural(cl, 'place') + ' here ' + (cl === 1 ? 'has' : 'have') + ' closed; ' + (cl === 1 ? 'it stays' : 'they stay') + ' at the end of the chapter, flagged.');
    return out.join(' ');
  }

  function entry(M, x) {
    var p = x.p, ref = M.d.key + '/' + p.id;
    var tier = x.open ? '<span class="tier t' + p.t + '"><i class="tg t' + p.t + '" aria-hidden="true"></i>' + TIER[p.t] + '</span>'
      : '<span class="flag closed">Closed · kept for the record</span>';
    var rec = (p.src || []).map(function (s) {
      return '<button type="button" class="src' + (s === 'guide' ? ' added' : '') + '" data-src="' + esc(s) + '">' + esc(srcShort(M, s)) + '</button>';
    }).join('<span class="sep">, </span>');
    return '<li class="ge" id="gb-' + esc(p.id) + '" data-id="' + esc(p.id) + '" data-a="' + esc(p.a) + '" data-k3="' + x.k3 + '" data-rank="' + x.rank + '"' + (x.open ? '' : ' data-closed') + '>' +
      '<h4><span class="rk" title="No. ' + x.rank + ' of ' + x.of + ' in ' + esc(shortArea((M.d.areas.filter(function (a) { return a.id === p.a; })[0] || {}).n || p.a)) + '">' + x.rank + '</span><a href="#p=' + encodeURIComponent(p.id) + '" data-cleo-entry>' + esc(x.name) +
      (p.nat ? ' <span class="nat"' + (M.lang ? ' lang="' + M.lang + '"' : '') + '>' + esc(p.nat) + '</span>' : '') + '</a></h4>' +
      '<p class="ge-m">' + tier + (p.ad ? '<span class="ad">' + esc(p.ad) + '</span>' : '') + '</p>' +
      (p.w ? '<p class="ge-w">' + esc(p.w) + '</p>' : '') + (p.k ? '<p class="gk">Look for: ' + esc(p.k) + '</p>' : '') +
      '<p class="recby"><span>Recommended by</span> ' + rec + '</p>' +
      '<button type="button" class="heart ge-save" data-cleo-ref="' + esc(ref) + '" aria-pressed="false" aria-label="Save ' + esc(x.name) + '">Save</button></li>';
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
      var secs = [['top', 'Top picks', top], ['see', 'See', see], ['eat', 'Eat', eat], ['pop', 'Pop culture', pop], ['gone', 'Kept for the record', gone]]
        .filter(function (s) { return s[2].length; })
        .map(function (s) { count += s[2].length; return '<section class="gs gs-' + s[0] + '"><h3 class="d3">' + s[1] + ' <span class="meta">' + s[2].length + '</span></h3><ol class="gl">' + s[2].map(function (x) { return entry(M, x); }).join('') + '</ol></section>'; });
      var art = ((d.art || {}).areas || {})[a.id];
      var cited = mostCited(lst, false), pinned = lst.filter(function (x) { var pv = x.p.pv || {}; return pv.pin === 'high' || pv.pin === 'med'; }).length;
      var checked = lst.reduce(function (m, x) { var c = (x.p.pv || {}).checked || ''; return c > m ? c : m; }, '');
      var canonHere = op.filter(function (x) { return canon[x.p.id]; }).length;
      var side = '<aside class="facts-box" aria-label="' + esc(shortArea(a.n)) + ' in numbers">' +
        (art ? '<img class="sil" src="' + esc(up + art.src) + '" alt="" width="' + art.w + '" height="' + art.h + '" loading="lazy" decoding="async">' : '') +
        '<dl><dt>Places</dt><dd>' + lst.length + '</dd><dt>Sights · eat &amp; drink</dt><dd>' + (lst.length - lst.filter(function (x) { return x.p.kind === 'food'; }).length) + ' · ' + lst.filter(function (x) { return x.p.kind === 'food'; }).length + '</dd>' +
        '<dt>Must see</dt><dd>' + top.length + '</dd>' + (canonHere ? '<dt>' + esc(g.canon.title) + '</dt><dd>' + canonHere + '</dd>' : '') +
        '<dt>Closed, kept</dt><dd>' + gone.length + '</dd>' + (cited ? '<dt>Most-cited source</dt><dd>' + esc(srcShort(M, cited[0])) + ' (' + cited[1] + ')</dd>' : '') +
        '<dt>Pins verified</dt><dd>' + pinned + ' of ' + lst.length + '</dd>' + (checked ? '<dt>Status checked</dt><dd>to <time>' + esc(checked) + '</time></dd>' : '') + '</dl></aside>';
      var hd = hoods(a.n);
      // a chapter = shell (header, always mounted) + body (intro, sections, facts) — the body mounts on approach (gap #6)
      var shell = '<article class="ch" id="gb-area-' + esc(a.id) + '" data-area="' + esc(a.id) + '" aria-labelledby="gb-ch-' + esc(a.id) + '" style="--ac:' + esc(ac) + '">' +
        '<header class="ch-h"><p class="eyebrow">Chapter ' + (n + 1) + ' of ' + A + '</p><h2 id="gb-ch-' + esc(a.id) + '" class="d1" tabindex="-1">' + esc(shortArea(a.n)) + '</h2>' + (hd ? '<p class="hoods">' + esc(hd) + '</p>' : '') + '</header>' +
        '<div class="ch-g" data-gb-body="' + esc(a.id) + '">';
      var body = '<div class="ch-main"><p class="ch-intro">' + esc(intro(M, a, lst)) + '</p>' + secs.join('') + '</div>' + side;
      parts.push({ id: a.id, shell: shell, body: body, n: lst.length });
      chapters.push(shell + body + '</div></article>');
      toc.push('<li><a href="#gb-area-' + esc(a.id) + '" data-gb-ch="' + esc(a.id) + '"><span class="n">' + (n + 1) + '</span><span class="t">' + esc(shortArea(a.n)) + '</span><span class="meta">' + lst.length + '</span></a></li>');
    });
    if (count !== M.N) throw new Error('guidebook lost records: ' + count + ' != ' + M.N);
    var sig = g.signature;
    var cover = '<header class="gcover"><p class="kicker">A field guide · ' + plural(A, 'chapter') + ' · ' + plural(M.N, 'place') + '</p>' +
      '<h1 class="hero-t" tabindex="-1">' + esc(d.name) + (d.nat ? ' <span class="native"' + (M.lang ? ' lang="' + M.lang + '"' : '') + '>' + esc(d.nat) + '</span>' : '') + '</h1>' +
      (g.tileLine && g.tileLine.text ? '<p class="lead">' + esc(g.tileLine.text) + '</p>' : '') +
      '<p class="gfacts">' + [plural(st.sights || 0, 'sight'), plural(st.food || 0, 'place') + ' to eat and drink', plural(st.sources || 0, 'named source'),
        (st.verifiedPins || 0) + ' of ' + (st.pins || 0) + ' pins verified'].concat(st.lastChecked ? ['status checked to ' + st.lastChecked] : []).map(esc).join(' · ') + '</p>' +
      (sig ? '<p class="gsig">★ ' + esc(sig.title) + ': ' + plural(sig.n, 'place') + ', marked through the chapters.</p>' : '') + '</header>';
    var nav = '<div class="bk" data-cleo-book>' +
      '<nav class="toc" aria-label="Chapters"><p class="eyebrow">Contents</p><ol>' + toc.join('') + '</ol>' +
      '<button type="button" class="btn btn-ghost" data-cleo-print>Print this guide</button></nav>' +
      '<div class="bk-main">' + cover;
    var app = appendix(M);
    // `lazy`: the same book, contents + chapter shells first; mount() fills each body (and the appendix) on approach
    var lazy = nav + parts.map(function (c) { return c.shell + '</div></article>'; }).join('') + '<div data-gb-appendix></div></div></div>';
    return { html: nav + chapters.join('') + app + '</div></div>', lazy: lazy, parts: parts, appendix: app, entries: count, model: M };
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
      return '<li><b>' + esc(s.name) + '</b> <span class="meta">' + plural(s.n, 'place') + '</span>' +
        (urls.length ? '<ul class="urls">' + urls.map(function (u) { return '<li><a href="' + esc(u) + '" rel="noopener">' + esc(u) + '</a></li>'; }).join('') + '</ul>'
          : '<p class="sm">No web address on record for this source.</p>') + '</li>';
    });
    var notes = (M.d.notes || []).map(function (n) { return '<section class="note"><h4>' + esc(n.title || n.k || '') + '</h4><p>' + esc(n.body || '') + '</p></section>'; });
    return '<section class="gb-appendix" id="gb-sources" aria-labelledby="gb-src-h"><h2 class="d2" id="gb-src-h">Sources and method</h2>' +
      '<p>Every source this guide cites for ' + esc(M.d.name) + ', with the number of places it recommends and the pages it was read from.</p>' +
      '<ol class="srclist">' + rows.join('') + '</ol>' +
      (other.length ? '<h3 class="d3">Other pages the records cite</h3><ul class="urls">' + other.map(function (u) { return '<li><a href="' + esc(u) + '" rel="noopener">' + esc(u) + '</a></li>'; }).join('') + '</ul>' : '') + (notes.length ? '<div class="method">' + notes.join('') + '</div>' : '') + '</section>';
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
    var line = el.querySelector('[data-gb-count]');
    if (line) line.innerHTML = shown === all ? '<b>All ' + all + ' places</b>' : '<b>' + shown + ' of all ' + all + ' places</b> match this lens. <button type="button" class="btn btn-quiet" data-cleo-all>Show all ' + all + '</button>';
  }
  /* Lazy chapters (ROUND-3 gap #6): each chapter body is its own Cleo.chunks part (platform view chunks), so it mounts
   * as it nears the viewport, on a contents click or deep link (open()), and with everything else on Cleo.defer.all()
   * (lens, search, print, find-in-page). The contents and every chapter heading are in the DOM from the start. */
  var lazy = {};
  function open(aid) { var c = lazy[aid]; if (c) c.all(); }
  function areaOf(id) { var hit = null; (book ? book.order : []).some(function (x) { if (x.p.id === id) { hit = x.p.a; return true; } }); return hit; }
  function mount(el, ctx) {
    host = el; ctx = ctx || {};
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
      var on = function (t, ev, f) { t.addEventListener(ev, f); off.push(function () { t.removeEventListener(ev, f); }); };
      on(el, 'click', function (e) {
        var b = e.target.closest('[data-cleo-print]'); if (b) { printAll(); return; }
        if ((b = e.target.closest('[data-cleo-ref]')) && C.saved) { C.saved.toggle(b.getAttribute('data-cleo-ref')); syncSaved(el); return; }
        if ((b = e.target.closest('button.src[data-src]')) && C.route) { e.preventDefault(); var r0 = C.route.parse(); C.route.go({ view: r0.view || 'guidebook', src: b.getAttribute('data-src') }); return; }
        if ((b = e.target.closest('a[data-gb-ch]'))) { e.preventDefault(); open(b.getAttribute('data-gb-ch')); var h = document.getElementById('gb-ch-' + b.getAttribute('data-gb-ch')); if (h) { h.scrollIntoView({ block: 'start' }); h.focus({ preventScroll: true }); } }
      });
      on(document, 'cleo:saved', function () { syncSaved(el); });
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
      el.innerHTML = '<p class="state" data-cleo-state="view-failed">The guidebook couldn’t load just now. Every place is still in the list — switch to another view, or try again when you’re back online.</p>';
    });
  }
  function printAll() { var C = window.Cleo || {}; if (C.defer) C.defer.all(); if (host) syncLens(host); window.print(); }
  function unmount() { off.splice(0).forEach(function (f) { f(); }); Object.keys(lazy).forEach(function (k) { lazy[k].cancel(); }); lazy = {}; book = null; if (host) { host.innerHTML = ''; host.classList.remove('view-guidebook'); } host = null; }

  return { model: model, render: render, intro: intro, TEMPLATE: TEMPLATE, mount: mount, unmount: unmount, sourceUrls: sourceUrls, shortArea: shortArea };
});
