/* generated copy of tools/beta/client/gallery.js — do not edit here */
/* gallery.js (FE-A, W3 A-03): the Gallery view's extras over the canonical card list — category rows drawn from
 * the page JSON one row at a time as they near the viewport (no server nodes), the hero lead card
 * (desktop), "See all n" lenses, hearts on row cards, and the data-drawn covers on the grid's current page (the
 * area's own pin art with this place ringed). The grid itself is the li.pl list, paged by views.js. */
(() => {
  'use strict';
  const Cleo = window.Cleo || {}, C = Cleo.city, d = document, html = d.documentElement;
  if (!C || C.gallery) return;
  C.gallery = 1;
  const $ = (s, el) => (el || d).querySelector(s), qa = (s, el) => [].slice.call((el || d).querySelectorAll(s));
  const at = (el, a) => el.getAttribute(a), on = (el, ev, f) => el && el.addEventListener(ev, f);
  const info = C.info, rowsHost = $('#cleo-rows-host'), grid = $('#cleo-grid'), isG = () => at(html, 'data-view') === 'gallery';
  let io = null, started = 0;

  // rows: chosen and drawn from the page JSON (same origin, cached by the
  // service worker), one row at a time as the last drawn row nears the viewport. No JSON (file://, offline first
  // visit): no rows — the All N grid below still holds every place.
  const esc = C.esc, TIER = ['', 'Must see', 'Worth the detour', 'Deep cut'], attrs = {};
  const att = (id, k) => { if (!attrs[id]) { const c = C.byId[id] || (Cleo.defer && Cleo.defer.peek().filter(x => x.id === 'p-' + id)[0]); attrs[id] = c || { getAttribute: () => null }; } return attrs[id].getAttribute(k); };
  const ringOf = r => { const a = (info.art || {})[r.a]; if (!a || r.la == null || r.closed) return '';
    const x = a[3] + (r.ln - a[5]) * a[8], y = a[3] + (a[6] - r.la) * a[9];
    return x >= 0 && y >= 0 && x <= a[1] && y <= a[2] ? '<i class="g-ring me" style="left:' + (100 * x / a[1]).toFixed(1) + '%;top:' + (100 * y / a[2]).toFixed(1) + '%"></i>' : ''; };
  const artOf = (aid, ring) => { const a = (info.art || {})[aid]; return a ? '<span class="g-art pinart" style="aspect-ratio:' + a[1] + '/' + a[2] + '"><img src="' + esc(a[0]) + '" alt="" width="' + a[1] + '" height="' + a[2] + '" loading="lazy" decoding="async">' + ring + '</span>' : ''; };
  const gcard = r => {
    const nat = r.nat && r.n.slice(-r.nat.length - 2) === '(' + r.nat + ')' ? r.nat : '', g = Array.from(nat);
    const nm = nat ? r.n.slice(0, -nat.length - 2).trim() : r.n.replace(/\s*[—–-]+\s*CLOSED\b.*$/i, ''), col = ((info.areas || {})[r.a] || {}).c;
    const plate = g.length && g.length <= 4 ? '<span class="plate v"' + (info.lang ? ' lang="' + info.lang + '"' : '') + '>' + esc(nat) + '</span>'
      : '<span class="plate i">' + esc((nm.replace(/^(The|La|Le|El|Il|Der|Die|Das)\s+/i, '').match(/[A-Za-z0-9À-ɏ]/) || ['·'])[0]) + '</span>';
    const ids = (r.src || []).filter(x => x !== 'guide'), chips = ids.slice(0, 2).map(x => '<button type="button" class="src" data-src="' + esc(x) + '">' + esc(((info.src || {})[x] || [x])[0]) + '</button>').join(', ');
    return '<li class="gc' + (r.closed ? ' gc--closed' : '') + '" data-id="' + esc(r.id) + '"><a class="gc-a" href="#p-' + esc(r.id) + '"><span class="cover' + (r.closed ? ' closed' : '') + '"' + (col ? ' style="--ac:' + col + '"' : '') + ' aria-hidden="true">' +
      artOf(r.a, ringOf(r)) + plate + '<span class="gl"><svg class="ico"><use href="#i-' + esc(att(r.id, 'data-gl') || 'compass') + '"/></svg></span></span>' +
      '<span class="gc-b"><span class="pl-e">' + (r.closed ? 'Closed · kept for the record' : (TIER[r.t] ? '<i class="tg t' + r.t + '" aria-hidden="true"></i><span class="vh">' + TIER[r.t] + ' · </span>' : '') + esc(C.label('a', r.a)) + ' · ' + (r.kind === 'food' ? 'Eat &amp; drink' : 'See')) + '</span>' +
      '<span class="gc-n">' + esc(nm) + '</span>' + (r.w ? '<span class="gc-w">' + esc(String(r.w).replace(/<[^>]+>/g, '')) + '</span>' : '') + '</span></a>' +
      '<p class="pl-s"><span class="lbl">Recommended by</span> ' + (chips || '<span class="added">Added by the guide (general knowledge)</span>') + (ids.length > 2 ? ' <span class="more">+' + (ids.length - 2) + '</span>' : '') + '</p>' +
      '<button type="button" class="heart gc-save" data-ref="' + esc(r.id) + '" aria-pressed="false" aria-label="Save ' + esc(nm) + '"><svg class="ico" aria-hidden="true"><use href="#i-heart"/></svg></button></li>';
  };
  // the rows, in SPEC §3.1 order: ★ signature, Must see, the food canon (when it is one lens), the 3 largest other
  // collections / cuisines, Recently closed. View order inside a row: area order, then rank (open first, tier, named
  // sources, live order). [title, subtitle, lens key, value, ★, n, records ≤ 12]
  const pl = n => n + (n === 1 ? ' place' : ' places');
  function rowsOf(j) {
    const ar = (j.areas || []).map(a => a.id), named = r => (r.src || []).filter(x => x !== 'guide').length, G = j.guide || {};
    const ord = (j.places || []).map((r, i) => [r, i]).sort(([x, i], [y, k]) => { const ax = ar.indexOf(x.a), ay = ar.indexOf(y.a);
      return (ax < 0 ? 1e3 : ax) - (ay < 0 ? 1e3 : ay) || (x.closed ? 1 : 0) - (y.closed ? 1 : 0) || x.t - y.t || named(y) - named(x) || i - k; }).map(p => p[0]);
    const inC = id => ord.filter(r => (r.g || []).indexOf(id) >= 0), inCz = id => ord.filter(r => (r.cz || []).indexOf(id) >= 0), out = [], used = {};
    const add = (t, sub, k, v, list, star) => { if (!list.length || used[k + '=' + v]) return; used[k + '=' + v] = 1; out.push([t, sub, k, v, star, list.length, list.slice(0, 12)]); };
    const star = (j.collections || []).filter(c => /^★/.test(c.n) && inC(c.id).length)[0], sg = G.signature;
    let sig = [];
    if (star) { sig = inC(star.id); add(star.n.replace(/^★\s*/, ''), pl(sig.length) + ' · the signature of ' + info.name, 'c', star.id, sig, 1); }
    else if (sg && sg.n) { const c = sg.kind === 'collection' && sg.c && (j.collections || []).filter(x => x.id === sg.c[0])[0];
      sig = c ? inC(c.id) : ord.filter(r => (sg.ids || []).indexOf(r.id) >= 0); add(c ? c.n : sg.title, pl(sig.length) + ' · the signature of ' + info.name, c ? 'c' : 'sig', c ? c.id : '1', sig, 1); }
    add('Must see', pl(ord.filter(r => r.t === 1 && !r.closed).length) + ' · the top tier, graded within each area', 't', '1', ord.filter(r => r.t === 1 && !r.closed), 0);
    if (G.canon && G.canon.cz && G.canon.cz.length === 1) add(G.canon.title || 'The canon', pl(inCz(G.canon.cz[0]).length) + ' · what ' + info.name + ' is known for', 'cz', G.canon.cz[0], inCz(G.canon.cz[0]), 0);
    (j.collections || []).map(c => ['c', c, inC(c.id)]).concat((j.cuisines || []).map(c => ['cz', c, inCz(c.id)]))
      .filter(x => x[2].length > 1 && x[1].id !== 'ICON' && !used[x[0] + '=' + x[1].id]).sort((x, y) => y[2].length - x[2].length).slice(0, 3)
      .forEach(([k, c, l]) => add(c.n.replace(/^★\s*/, ''), pl(l.length) + ' · ' + (k === 'cz' ? 'eat & drink' : 'a collection'), k, c.id, l, 0));
    const cl = (G.closed || []).map(x => ord.filter(r => r.id === x.id)[0]).filter(Boolean);
    add('Recently closed', pl(cl.length) + ' · kept for the record, newest check first', 'closed', '1', cl, 0);
    const lead = sig.filter(r => r.t === 1 && !r.closed)[0] || ord.filter(r => r.t === 1 && !r.closed)[0] || ord.filter(r => !r.closed)[0];
    return { rows: out, lead };
  }
  let lead = null;
  const pending = [];
  const rowHtml = (x, i) => '<section class="row g-row" aria-labelledby="gr-' + i + '"><header class="row-h"><div><h2 class="d2" id="gr-' + i + '">' + (x[4] ? '<span aria-hidden="true">★</span> ' : '') + esc(x[0]) + '</h2>' +
    '<p class="sub">' + esc(x[1]) + '</p></div><button type="button" class="btn btn-ghost" data-g-see="' + esc(x[2]) + '" data-v="' + esc(x[3]) + '">See all ' + x[5] + '</button></header>' +
    '<ol class="rail g-rail">' + x[6].map(gcard).join('') + '</ol></section>';
  let nRow = 0;
  const stampRow = () => { const x = pending.shift(); if (!x) return null; rowsHost.insertAdjacentHTML('beforeend', rowHtml(x, nRow++)); hearts(rowsHost); return rowsHost.lastElementChild; };
  const watch = el => { if (!el || !pending.length) return; if (!io) { while (pending.length) stampRow(); return; } io.observe(el); };
  function start() {
    if (started || !rowsHost || !Cleo.pageData) return; started = 1;
    Cleo.pageData(info.file || C.key).then(j => {
      const o = rowsOf(j); pending.push.apply(pending, o.rows); lead = o.lead;
      if ('IntersectionObserver' in window) io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); watch(stampRow()); }), { rootMargin: '200px 0px' });
      watch(stampRow());
      const mh = $('.masthead');
      if (lead && mh && !$('.g-lead-card', mh)) { mh.insertAdjacentHTML('beforeend', '<ol class="g-lead-card vw view-gallery">' + gcard(lead) + '</ol>'); hearts(mh); }
    }).catch(() => { started = 0; });
  }

  // hearts on row / lead cards: the same Cleo.saved.toggle(ref) as every card (SPEC §2.5)
  const hearts = root => { const s = Cleo.saved ? Cleo.saved.all() : {};
    qa('button.gc-save', root).forEach(b => { const o = !!s[C.key + '/' + at(b, 'data-ref')]; b.setAttribute('aria-pressed', String(o)); b.setAttribute('aria-label', (o ? 'Saved: ' : 'Save ') + b.getAttribute('aria-label').replace(/^(Saved: |Save )/, '')); }); };
  on(d, 'cleo:saved', () => hearts(d));
  on(d, 'click', e => {
    const t = e.target; let b;
    if ((b = t.closest('button.gc-save')) && Cleo.saved) { Cleo.saved.toggle(C.key + '/' + at(b, 'data-ref')); }
    else if ((b = t.closest('[data-g-see]'))) { const o = {}; o[at(b, 'data-g-see')] = at(b, 'data-v'); C.go(o); if (grid) grid.scrollIntoView({ block: 'start' }); }
    else if ((b = t.closest('[data-g-browse]'))) { e.preventDefault(); if (grid) grid.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  });

  // covers on the grid's current page: area pin art + this place ringed (one cached SVG per area)
  const cover = c => {
    const p = $('.pl-cover', c), ll = (at(c, 'data-ll') || '').split(','); if (!p || $('.g-art', p)) return;
    const r = { a: at(c, 'data-a'), la: ll.length === 2 ? +ll[0] : null, ln: +ll[1], closed: c.hasAttribute('data-closed') };
    p.insertAdjacentHTML('afterbegin', artOf(r.a, ringOf(r)));
  };
  const paint = () => {
    if (!isG()) return; start();
    qa('li.pl:not([hidden]):not(.pg-off)').forEach(cover);
    html.classList.toggle('lens-on', C.cards.some(c => c.hidden));   // a lens is on: the grid answers it, the rows step aside
  };
  on(d, 'cleo:paged', paint); on(d, 'cleo:view', paint); C.after.push(paint);
  paint();
})();
