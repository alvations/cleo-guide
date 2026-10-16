/* city.js (FE-A): lenses, rail, tray, deep links, saves, covers and the map (split view on desktop, full-screen
 * map + pin sheet on mobile) over the server-rendered list. Lenses hide, never remove. OSM + Esri tiles only. */
(() => {
  'use strict';
  const Cleo = window.Cleo || {}, d = document, main = d.getElementById('main'); if (!main) return;
  const $ = (s, el) => (el || d).querySelector(s), $$ = (s, el) => [].slice.call((el || d).querySelectorAll(s));
  const at = (el, a) => el.getAttribute(a), on = (el, ev, f) => el && el.addEventListener(ev, f);
  const key = at(main, 'data-city'), cards = $$('li.pl'), sections = $$('section.area'), byId = {}, text = {};
  const pid = c => c.id.slice(2);
  let info = {}; try { info = JSON.parse(d.getElementById('cleo-city').textContent); } catch (e) {}
  const fold = Cleo.fold || (s => String(s || '').toLowerCase());
  cards.forEach(c => { byId[pid(c)] = c; text[pid(c)] = fold(c.textContent); });
  const desk = () => !window.matchMedia || matchMedia('(min-width: 1024px)').matches;
  const LENS = ['sig', 'c', 'cz', 't', 'src', 'a', 'been', 'gap', 'closed', 'mine', 'day'], RAIL = ['sig', 'c', 'cz', 't', 'src', 'gap', 'closed'], S = { mode: 'all', q: '', sort: '' };
  const store = Cleo.store || { get: (k, x) => x, set: () => {} };
  const been = { all: () => { const b = store.get('been', {}); return b && typeof b === 'object' ? b : {}; },
    toggle(r) { const b = been.all(); if (b[r]) delete b[r]; else b[r] = 1; store.set('been', b); paint(); return !!b[r]; } };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const icon = n => '<svg class="ico" aria-hidden="true"><use href="#i-' + n + '"/></svg>';
  // i18n D-41: interface strings from the catalogue (Cleo.t, head snippet); the English here equals en.json (test-i18n)
  const tt = (k, e, v) => Cleo.t ? Cleo.t(k, e, v) : v ? e.replace(/\{([a-z]+)\}/g, (m, n) => (n in v ? v[n] : m)) : e;
  const pl = n => n === 1 ? tt('hub.places.one', '1 place') : tt('hub.places', '{n} places', { n }), ar = n => n === 1 ? tt('city.areas.one', '1 area') : tt('city.areas', '{n} areas', { n });
  const trap = (host, close) => on(host, 'keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const f = $$('a[href],button', host).filter(x => x.offsetParent !== null), l = f[f.length - 1];
    if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); l.focus(); } else if (!e.shiftKey && d.activeElement === l) { e.preventDefault(); f[0].focus(); }
  });
  // hooks for foryou.js / day.js: rank(card) → sort key (lower first) and why(card) → 'First because' text; lens[k](n) → html;
  // after[] run once per apply (map overlays); dist {id: km} while Near me is on (never stored)
  const nameOf = c => { const a = $('.pl-n a', c); if (!a) return ''; const x = a.cloneNode(true); if (c.querySelector('.pl-vert')) $$('.nat', x).forEach(v => v.remove()); return x.textContent.trim(); };
  const C = Cleo.city = { name: nameOf, byId, info, key, pid, been, desk, esc, icon, trap, cards, S, lens: {}, after: [], rank: null, why: null, dist: null };
  $$('[data-cleo-rail],[data-cleo-toolbar],[data-cleo-search],[data-cleo-mappill]').forEach(el => { el.hidden = false; });
  // QA-69: the floating "Show map" pill stays visible at load and at rest — the first screen's way to the map. (The W8
  // step-aside hid it at load whenever a card title sat under it; B-08 passes under the ratified .mappill exemption.)
  // For you / Near me (foryou.js) and Your day (day.js) load on first use — a tap, a stored interest or a #day= route
  const need = C.need = (n, cb) => {
    if ({ foryou: C.fy, day: C.day, atlas: C.atlasTools }[n]) { if (cb) cb(); return; }
    const q = need.q[n] = need.q[n] || []; q.push(cb); if (q.length > 1) return;
    const s = d.createElement('script'); s.src = (Cleo.root || '../') + 'assets/js/' + n + '.js?v=' + ((info.js || {})[n] || ''); s.async = true;
    s.onload = () => q.splice(0).forEach(f => f && f()); d.head.appendChild(s);
  };
  // FE-C W9-5 hook: "Set as my base" in the place sheet. base.js loads on the first sheet (core loads it at once when a base is set)
  { const prev = C.onSheet; C.onSheet = c => { if (prev) prev(c); if (Cleo.need) Cleo.need('base', () => C.baseSheet && C.baseSheet(c)); }; }
  need.q = {};
  const rail = $('#cleo-rail'), shown = $('#cleo-shown'), lens = $('#cleo-lens'), applied = $('[data-cleo-applied]'), fi = $('#cleo-filter'), split = $('.split');
  // R7 gap 2(c): the placeholder is never clipped mid-letter — "Search {city}" where it fits, else "Search" (a narrow
  // phone pill, a long guide name), else none; re-fitted whenever the box changes size
  if (fi) { let full = fi.placeholder; const cv = d.createElement('canvas').getContext('2d'), fit = () => { if (!fi.clientWidth) return;
      const c = getComputedStyle(fi), room = fi.clientWidth - parseFloat(c.paddingLeft) - parseFloat(c.paddingRight); cv.font = c.fontWeight + ' ' + c.fontSize + ' ' + c.fontFamily;
      fi.placeholder = cv.measureText(full).width <= room ? full : cv.measureText(tt('city.search.short', 'Search')).width <= room ? tt('city.search.short', 'Search') : ''; };
    on(d, 'cleo:locale', () => { full = tt('city.search', 'Search {city}', { city: info.name }); fit(); });   // i18n D-41   // '': the icon-only pill (Atlas toolbar); the label names it
    if (window.ResizeObserver) new ResizeObserver(fit).observe(fi); else on(window, 'resize', fit);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(fit); }
  const shown0 = shown ? shown.innerHTML : '';
  const go = C.go = (r, rep) => Cleo.route.go(r, rep);
  const cur = () => { const r = {}; if (S.mode !== 'all') r.mode = S.mode; LENS.concat('sort').forEach(k => { if (S[k]) r[k] = S[k]; }); return r; };
  const label = C.label = (k, v) => k === 'sig' ? (info.sig || {}).t || tt('city.sig.t', 'Signature') : k === 't' ? ['', tt('tier.1', 'Must see'), tt('tier.2', 'Worth the detour'), tt('tier.3', 'Deep cut')][v] : k === 'src' ? ((info.src || {})[v] || [v])[0] : k === 'closed' ? tt('city.door.closed.t', 'Recently closed') : k === 'mine' ? tt('shell.saved', 'Your list')
    : k === 'a' ? ((info.areas || {})[v] || {}).n || v : k === 'been' ? (v === 'hide' ? tt('city.been.hide', 'Hide been there') : tt('city.been.only', 'Only been there')) : k === 'q' ? '“' + v + '”' : (info.cats || {})[v] || v;

  on(d, 'click', e => {
    const t = e.target; let b;
    if ((b = t.closest('button[data-mode]'))) { const r = cur(); r.mode = at(b, 'data-mode') === 'all' ? '' : at(b, 'data-mode'); go(r); }
    else if ((b = t.closest('[data-cleo-all]'))) { S.q = ''; if (fi) fi.value = ''; go({}); }
    else if ((b = t.closest('[data-cleo-mine]'))) go(S.mine ? {} : { mine: '1' });
    else if ((b = t.closest('[data-cleo-foryou]'))) need('foryou', () => C.fy.open(b));
    else if ((b = t.closest('[data-cleo-near]'))) need('foryou', () => C.near(b));
    else if ((b = t.closest('[data-cleo-day]'))) need('day', () => C.day.open(at(b, 'data-cleo-day')));
    else if (t.closest('[data-cleo-dayfrom]')) need('day', () => C.day.fromSaved());
    else if ((b = t.closest('.rail-i'))) { const k = RAIL.filter(x => b.hasAttribute('data-' + x))[0], o = {}; if (k && S[k] !== at(b, 'data-' + k)) o[k] = at(b, 'data-' + k); go(o); }
    else if ((b = t.closest('.pl-s button.src'))) { e.preventDefault(); go({ src: at(b, 'data-src') }); }
    else if ((b = t.closest('[data-rail]'))) rail.scrollBy({ left: +at(b, 'data-rail') * rail.clientWidth * 0.8, behavior: 'smooth' });
    else if ((b = t.closest('[data-unset]'))) { const u = cur(), x = at(b, 'data-unset'); delete u[x]; if (x === 'q') { S.q = fi.value = ''; apply(); } go(u); }
    else if ((b = t.closest('[data-cleo-map]'))) {
      const m = Cleo.route.parse(), a = at(b, 'data-cleo-map');
      if (C.mapFirst && C.mapFirst()) { if (C.listMode) C.listMode(false); if (a && m.map !== a) { m.map = a; go(m); } else if (a) loadMap(() => fitArea(a)); }
      else if (a) loadMap(() => fitArea(a));
    }
    else if ((b = t.closest('[data-cleo-tray]'))) T.open(at(b, 'data-cleo-tray'), b);
    else if ((b = t.closest('button.pl-save')) && Cleo.saved) Cleo.saved.toggle(key + '/' + pid(b.closest('li.pl')));
  });
  let tq; on(fi, 'input', () => { clearTimeout(tq); tq = setTimeout(() => { S.q = fi.value; apply(); }, 120); });

  // THE lens predicate is platform's Cleo.lens.match (P-02: one predicate in every view); the page-only lenses follow
  const visible = c => {
    if (!Cleo.lens.match(c, { mode: S.mode === 'all' ? '' : S.mode, a: S.a, t: S.t, c: S.c, cz: S.cz, src: S.src, closed: S.closed })) return false;
    if (S.been) { const b = !!been.all()[key + '/' + pid(c)]; if (S.been === 'hide' ? b : !b) return false; }
    if (S.sig && !(info.sig && info.sig.ids.indexOf(pid(c)) >= 0)) return false;
    if ((S.mine && !(Cleo.saved && Cleo.saved.has(key + '/' + pid(c)))) || (S.day && C.inDay && !C.inDay(pid(c)))) return false;
    if (C.ringKeep && !C.ringKeep(c)) return false;   // Atlas FE-2 W9-5 hook: the walking ring from your base (atlas-nav.js)
    return !S.q || fold(S.q).split(/\s+/).every(w => !w || text[pid(c)].indexOf(w) >= 0);
  };
  const count = o => { const sv = {}; let n = 0; for (const k in o) { sv[k] = S[k]; S[k] = o[k]; } cards.forEach(c => { if (visible(c)) n++; }); Object.assign(S, sv); return n; };
  const nsrc = x => (at(x, 'data-src') || '').split(' ').length, num = x => +at(x, 'data-n');
  // FE-C W9-5 hook: "Nearest to my base" (sort=base) sorts like Near me, by km from your base (base.js: C.baseKm)
  const byBase = () => S.sort === 'base' && !!C.baseKm, nearOn = () => (S.sort === 'near' && !!C.dist) || byBase();
  const far = x => byBase() ? C.baseKm(x) : C.dist && C.dist[pid(x)] != null ? C.dist[pid(x)] : 1e9;
  const apply = () => {
    if (Cleo.defer && (C.rank || S.day || S.sort)) Cleo.defer.all();   // a reorder must see every card (M3-06)
    let n = 0; const areas = {}, tot = cards.length;
    $$('ol.pls').forEach(ol => {
      const base = S.sort === 'az' ? (x, y) => $('.pl-n', x).textContent.localeCompare($('.pl-n', y).textContent)
        : S.sort === 'src' ? (x, y) => nsrc(y) - nsrc(x) || num(x) - num(y) : nearOn() ? (x, y) => far(x) - far(y) || num(x) - num(y) : (x, y) => num(x) - num(y);
      const rk = S.day && C.dayRank ? C.dayRank : S.closed && info.co ? x => { const i = info.co.indexOf(pid(x)); return i < 0 ? 999 : i; } : C.rank;
      const li = $$('li.pl', ol).sort(rk ? (x, y) => rk(x) - rk(y) || base(x, y) : base);
      if (li.some((x, i) => ol.children[i] !== x)) li.forEach(x => ol.appendChild(x));
    });
    cards.forEach(c => { const v = visible(c); c.hidden = !v; if (v) { n++; areas[at(c, 'data-a')] = 1; }
      // DES 15.10 hooks on the eyebrow: .pl-why (For you) and .pl-dist (Near me)
      const y = C.why && C.why(c), w = $('.pl-why', c);
      if (y) { if (!w) $('.pl-e', c).insertAdjacentHTML('beforeend', ' <span class="pl-why"></span>'); $('.pl-why', c).textContent = y; } else if (w) w.remove();
      const dk = $('.pl-dist', c), dv = C.dist && C.dist[pid(c)];
      if (dv != null) { if (!dk) $('.pl-e', c).insertAdjacentHTML('beforeend', ' <span class="pl-dist"></span>'); $('.pl-dist', c).textContent = tt('city.away', '{d} away', { d: dv < 1 ? Math.round(dv * 100) * 10 + ' m' : dv.toFixed(1) + ' km' }); } else if (dk) dk.remove();
    });
    sections.forEach(s => { s.hidden = !s.querySelector('li.pl:not([hidden]),noscript[data-cleo-defer]'); });
    if (sections.length > 1) {   // Near me: the nearest area comes first; otherwise the guide's area order
      const ord = sections.slice().sort((x, y) => nearOn() ? Math.min.apply(0, $$('li.pl', x).map(far)) - Math.min.apply(0, $$('li.pl', y).map(far)) : 0);
      if (ord.some((x, i) => x !== $$('section.area')[i])) { const how = $('#how-we-choose'); ord.forEach(x => how.parentNode.insertBefore(x, how)); }
    }
    const nA = Object.keys(areas).length, act = LENS.filter(k => S[k] && k !== 'gap' && k !== 'day'), all = '<button class="btn btn-primary" data-cleo-all>' + tt('city.showall', 'Show all {n}', { n: tot }) + '</button>';
    const gap = t => '<div class="gap"><span class="eyebrow">' + tt('city.gap.k', 'Stated gap') + '</span>' + t + '</div>';
    if (shown) shown.innerHTML = n === tot ? shown0 : n ? tt('city.shown', 'Showing {n} of {total} places in {areas}', { n: '<b>' + n + '</b>', total: tot, areas: ar(nA) }) + tt('city.facts.order', '. Ordered by tier, then by number of named sources.')
      : '<b>' + tt('city.empty', 'No places match.') + '</b> ' + tt('city.empty.note', 'Filters never hide places for good.') + ' <button class="btn btn-quiet" data-cleo-all>' + tt('city.empty.clear', 'Clear filters ({places})', { places: pl(tot) }) + '</button>';
    const lk = ['day', 'sig', 'src', 'gap', 'closed', 'mine', 'c', 'cz', 't', 'a'].filter(k => S[k])[0];
    let h = '';
    if (C.lens[lk]) h = C.lens[lk](n, nA, all);
    else if (lk === 'closed') h = '<h2>' + tt('city.closed.h', 'Recently closed — kept for the record ({n})', { n }) + '</h2><p>' + tt('city.closed.p', 'Closed places stay on the guide, flagged, with the source and date of the closure check — so a pin never reads as “go here today”. Newest check first.') + '</p><div class="row">' + all + '</div>';
    else if (lk === 'sig' && info.sig) h = '<span class="eyebrow">' + tt('city.sig.k', '★ Signature') + ' · ' + esc(info.sig.why || '') + '</span><h2>' + esc(info.sig.t) + ' (' + n + ')</h2>' +
      (info.sig.dishes.length ? '<p>' + info.sig.dishes.map(x => '<b>' + esc(x[0]) + '</b> ' + x[1]).join(' · ') + '</p>' : '') + '<p>' + tt('city.across', '{places} across {areas}.', { places: pl(n), areas: ar(nA) }) + '</p><div class="row">' + all + '</div>';
    else if (lk === 'mine') {   // W8: a saved list becomes a day in one tap (the area with the most saved, open, pinned places)
      const per = {}; Object.keys(Cleo.saved ? Cleo.saved.all() : {}).forEach(r => { const c = r.slice(0, r.lastIndexOf('/')) === key && C.byId[r.slice(r.lastIndexOf('/') + 1)];
        if (c && !c.hasAttribute('data-closed') && c.getAttribute('data-ll')) per[c.getAttribute('data-a')] = (per[c.getAttribute('data-a')] || 0) + 1; });
      const plan = Object.keys(per).some(a => per[a] >= 2) ? '<button type="button" class="btn btn-primary" data-cleo-dayfrom>' + icon('route') + '<span>' + tt('city.dayfrom', 'Plan a day from these') + '</span></button>' : '';
      h = '<h2>' + esc(tt('city.mine.h', 'Your list in {city} ({n})', { city: info.name, n })) + '</h2><p>' + tt('city.mine.p', 'Saved on this device.') + ' <a href="' + (Cleo.root || '../') + 'saved.html">' + tt('city.mine.all', 'All your lists') + '</a></p><div class="row">' + plan + all + '</div>';
    }
    else if (lk === 'src') {
      const s = (info.src || {})[S.src] || [S.src, n, 0, '', ''];
      h = '<h2>' + esc(tt('city.src.h', 'Everything {source} recommends in {city} ({n})', { source: s[0], city: info.name, n })) + '</h2>' + (s[5] ? '<p>' + esc(s[5]) + '</p>' : '') +
        (s[2] ? '<p>' + tt('city.src.entries', 'All {n} of its numbered entries are here.', { n: s[2] }) + '</p>' : '') +
        '<div class="row">' + (s[4] ? '<a class="btn btn-ghost" href="' + esc(s[4]) + '" rel="noopener" target="_blank">' + tt('city.src.read', 'Read the source') + ' ' + icon('external') + '</a>' : '') + all + '</div>';
    } else if (lk === 'gap') { const g = (info.gaps || [])[+S.gap] || ['', '']; h = gap('<p class="d3">' + esc(g[0]) + '</p><p>“' + esc(g[1]) + '”</p>') + '<div class="row">' + all + '</div>'; }
    else if (lk) h = '<h2>' + esc(label(lk, S[lk])) + '</h2><p>' + (lk === 't' ? tt('city.across.t', '{places} across {areas}, graded within each area.', { places: pl(n), areas: ar(nA) }) : tt('city.across', '{places} across {areas}.', { places: pl(n), areas: ar(nA) })) + '</p>' +
      (lk === 'cz' ? (info.gaps || []).filter(x => x[2].indexOf(S.cz) >= 0).map(x => gap('<p>“' + esc(x[1]) + '”</p>')).join('') : '') + '<div class="row">' + all + '</div>';
    if (lens) { lens.innerHTML = h; lens.hidden = !h; lens.classList.toggle('is-day', lk === 'day'); }
    const chips = act.filter(k => k !== 'day').concat(S.q ? ['q'] : []);
    if (applied) applied.innerHTML = chips.map(k => { const l = esc(label(k, k === 'q' ? S.q : S[k])); return '<button class="chip-x" data-unset="' + k + '" aria-label="' + esc(tt('city.remove', 'Remove {name}', { name: label(k, k === 'q' ? S.q : S[k]) })) + '">' + l + icon('close') + '</button>'; }).join('') +
      (chips.length > 1 ? '<button class="clear" data-cleo-all>' + tt('city.tray.clear', 'Clear all') + '</button>' : '');
    const nf = $('[data-cleo-nf]'); if (nf) nf.textContent = act.length || '';
    $$('button[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(at(b, 'data-mode') === S.mode)));
    if (rail) rail.setAttribute('data-view', S.mode);
    $$('.rail-i').forEach(a => {
      // doors keep their own state (QA-27: For you stays pressed after a reload restores stored interests)
      const p = a.hasAttribute('data-cleo-all') ? !act.length && !S.gap && !S.day && S.mode === 'all' && !S.q : a.hasAttribute('data-cleo-foryou') ? !!C.rank
        : a.hasAttribute('data-cleo-mine') ? !!S.mine : a.hasAttribute('data-cleo-near') ? S.sort === 'near' && !!C.dist : RAIL.some(k => S[k] && at(a, 'data-' + k) === S[k]);
      a.setAttribute('aria-pressed', String(p)); if (p) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    syncMarkers(); C.after.forEach(f => f());
  };
  C.apply = () => apply();
  // R7 gap 3, delight 1: photos fade in (≤ 280 ms) from their dominant colour (--ph, set at build). Only once this script
  // runs (html.ph-fade), so a page without JS never hides a photo; a photo already loaded shows at once; a broken one
  // drops its placeholder too. Under reduced motion the CSS has no transition.
  { const done = im => { const f = im.closest('figure.photo, .gc .cover'); if (f) f.classList.add('in'); };
    $$('figure.photo img, .gc .cover img').forEach(im => { if (im.complete) done(im); });
    d.addEventListener('load', e => { if (e.target.tagName === 'IMG') done(e.target); }, true);
    d.addEventListener('error', e => { if (e.target.tagName === 'IMG') done(e.target); }, true);
    on(d, 'cleo:stamped', () => $$('figure.photo:not(.in) img, .gc .cover:not(.in) img').forEach(im => { if (im.complete) done(im); }));
    d.documentElement.classList.add('ph-fade'); }
  // R7 gap 3, delight 2: switching views — the switcher's selection slides to the new view and the content cross-fades
  // in (≤ 260 ms); none under reduced motion (CSS)
  { const nav = $('[data-cleo-views]');
    if (nav) { const ind = d.createElement('span'); ind.className = 'v-ind'; ind.setAttribute('aria-hidden', 'true'); nav.appendChild(ind);
      const place = () => { const b = $('button[aria-pressed="true"]', nav); if (!b || !b.offsetWidth) { ind.style.opacity = '0'; return; }
        ind.style.opacity = ''; ind.style.left = b.offsetLeft + 'px'; ind.style.width = b.offsetWidth + 'px'; ind.style.top = b.offsetTop + 'px'; ind.style.height = b.offsetHeight + 'px'; };
      nav.classList.add('has-ind'); place(); on(window, 'resize', place); on(d, 'cleo:locale', place);   // i18n D-41: the labels changed width if (d.fonts && d.fonts.ready) d.fonts.ready.then(place);
      on(d, 'cleo:view', () => { requestAnimationFrame(place); main.classList.remove('v-swap'); void main.offsetWidth; main.classList.add('v-swap');
        setTimeout(() => main.classList.remove('v-swap'), 400); }); } }
  // W8 grid density: an area's end actions take the rest of its last card row (a lone last card never sits by itself);
  // a full last row gets the actions on a row of their own. Counts what is shown (lens, pager), recomputed after every change
  let endsQ = 0;
  const fillEnds = () => { endsQ = 0; $$('.split section.area').forEach(sec => { const e = $(':scope > .area-end', sec); if (!e) return;
    const cols = getComputedStyle(sec).display === 'grid' ? getComputedStyle(sec).gridTemplateColumns.split(' ').length : 1;
    const n = $$('li.pl', sec).filter(c => !c.hidden && !c.classList.contains('pg-off')).length, rem = cols > 1 ? n % cols : 0;
    e.style.gridColumn = rem ? 'span ' + (cols - rem) : ''; }); };
  const ends = () => { if (!endsQ) endsQ = requestAnimationFrame(fillEnds); };
  C.after.push(ends); on(window, 'resize', ends); on(d, 'cleo:stamped', ends); on(window, 'hashchange', () => setTimeout(ends, 0));

  let lastP = '', lastA = '';
  const onRoute = C.onRoute = () => {
    const r = Cleo.route.parse(), mm = /^#p-(.+)$/.exec(location.hash);
    if (mm && byId[decodeURIComponent(mm[1])]) r.p = decodeURIComponent(mm[1]);
    if (r.day && !C.day) need('day', () => C.apply());
    S.mode = r.mode === 'sights' || r.mode === 'food' ? r.mode : 'all';
    LENS.forEach(k => { S[k] = r[k] || ''; }); S.sort = r.sort || '';
    if (r.q !== undefined) { S.q = r.q; if (fi) fi.value = r.q; }
    const tg = r.p && byId[r.p];
    if (tg && !visible(tg)) { S.mode = 'all'; LENS.forEach(k => { S[k] = ''; }); S.q = ''; if (fi) fi.value = ''; }
    apply();
    $$('li.pl.is-target').forEach(c => { if (c !== tg) c.classList.remove('is-target'); });
    const mob = !desk() && (C.view || d.documentElement.getAttribute('data-view')) === 'atlas', fa = r.map && r.map !== '1' ? r.map : S.a;
    if (split) { if (mob) split.setAttribute('data-view', 'map'); else split.removeAttribute('data-view'); }
    // the fit waits a frame: the Atlas tray (views.js) settles on this same route change, and overMap() measures it
    if (mob) loadMap(() => { if (!live()) return; map.invalidateSize(); if (fa && !tg) requestAnimationFrame(() => { if (live()) { map.invalidateSize(); fitArea(fa); } }); });
    else { if (C.closePoi) C.closePoi(1); if (S.a && S.a !== lastA && map && desk() && !tg && !S.day) fitArea(S.a); }
    lastA = S.a;
    if (tg) {
      tg.classList.add('is-target');
      if (r.p !== lastP || !(Cleo.sheet && Cleo.sheet.isOpen())) {
        // Atlas hosts the detail over a map that stays put (atlas-nav.js, SPEC-v3 §3.2): no page scroll, no fly
        if (!(C.placeOpen && C.placeOpen(tg, map && markers[r.p]))) { tg.scrollIntoView({ block: 'center' }); if (map && markers[r.p]) fly(markers[r.p].getLatLng()); }
        if (C.select && C.view === 'atlas') C.select(tg, 'route');   // selected + labelled on the map (SPEC-v3 §1.4)
        if (Cleo.sheet) Cleo.sheet.open(tg); else { const l = $('.pl-n a', tg); if (l && l.focus) l.focus({ preventScroll: true }); }
      }
    } else if (Cleo.sheet && Cleo.sheet.isOpen()) Cleo.sheet.close(true);
    lastP = r.p || '';
  };
  on(window, 'hashchange', onRoute); on(d, 'cleo:route', onRoute);

  // cover plate: the native name set vertically when the build says it fits (data-nat, ≤ 5 glyphs, sized by --n so it
  // never clips); otherwise a Didone initial. The native is printed once: the build drops it from the visible title.
  const cover = c => {
    const p = $('.pl-cover', c); if (!p || p.firstChild) return;
    const na = $('.pl-n .nat', c), g0 = Array.from(na ? na.textContent.replace(/^\s*\(|\)\s*$/g, '') : ''), g = g0.length <= 7 ? g0 : [], nm = $('.pl-n', c).textContent.replace(/\s*[—–-]+\s*CLOSED\b.*$/i, '');
    p.innerHTML = (g.length ? '<span class="pl-vert' + (g.length > 4 ? ' long' : '') + '"' + (info.lang ? ' lang="' + info.lang + '"' : '') + '>' + esc(g.join('')) + '</span>'
      : '<span class="pl-ini" data-i="' + esc((nm.replace(/^(The|La|Le|El|Il|Der|Die|Das)\s+/i, '').match(/[A-Za-z0-9À-ɏ]/) || ['·'])[0]) + '"></span>') +
      '<svg class="pl-glyph"><use href="#i-' + at(c, 'data-gl') + '"/></svg>' + dishOf(c);
  };
  // R7 gap 5 (food covers): food places never get photos (honesty rule), so their cover names the dish in display type
  // on the eat-and-drink tint, under the kind glyph — an intentional face, never a blank box that reads as "not loaded"
  const dishOf = c => { if (at(c, 'data-k') !== 'f') return ''; const x = $('.pl-e .in-d', c), t = x ? x.textContent.replace(/^\s*·\s*/, '').trim() : '';
    return '<span class="pl-dish">' + esc(t || tt('city.mode.food', 'Eat & drink')) + '</span>'; };
  const paint = () => {
    const s = Cleo.saved ? Cleo.saved.all() : {}, b = been.all();
    cards.forEach(c => {
      cover(c);
      const x = $('.pl-x', c), ref = key + '/' + pid(c); if (!x) return;
      // W7: the heart sits on the card's media, drawn by CSS (no extra nodes: DOM budget); the word stays for AT and search
      if (!x.firstChild) x.innerHTML = '<button class="pl-save heart" aria-pressed="false">' + tt('sheet.save', 'Save') + '</button>';
      const btn = x.firstChild, o = !!s[ref], st = $('.stamp', c); x.hidden = false;
      btn.setAttribute('aria-pressed', String(o)); btn.textContent = o ? tt('sheet.saved', 'Saved') : tt('sheet.save', 'Save'); btn.setAttribute('aria-label', o ? tt('gal.saved', 'Saved: {name}', { name: $('.pl-n', c).textContent }) : tt('gal.save', 'Save {name}', { name: $('.pl-n', c).textContent }));
      if (b[ref] && !st) c.insertAdjacentHTML('beforeend', '<span class="stamp">' + esc(tt('city.stamp', 'Been there')).replace(' ', '<br>') + '</span>'); else if (!b[ref] && st) c.removeChild(st);
    });
    const mine = $('[data-cleo-mine]'), nm = Object.keys(s).filter(r => r.slice(0, r.lastIndexOf('/')) === key).length;
    if (mine) { mine.hidden = !nm && !S.mine; $('[data-cleo-mine-n]', mine).textContent = nm; $('[data-cleo-mine-n]', mine).className = 'n' + (nm === 1 ? ' one' : ''); }
  };
  on(d, 'cleo:saved', () => { paint(); if (S.mine) apply(); else syncMarkers(); });
  on(d, 'cleo:locale', () => { $$('.stamp').forEach(x => x.remove()); paint(); apply(); });   // i18n D-41: redraw labels, lens and counts in the loaded catalogue
  // Platform hook (M3-06): later cards arrive from Cleo.defer (core.js) as their area nears the viewport, or all at
  // once before any lens/route. Adopt them so every lens, count and pin sees every place; stubs' pins become cards.
  on(d, 'cleo:stamped', e => { ((e.detail || {}).cards || []).forEach(c => { if (byId[pid(c)] === c) return; cards.push(c); byId[pid(c)] = c; text[pid(c)] = fold(c.textContent); });
    $$('section.area').forEach(s => { if (sections.indexOf(s) < 0) sections.push(s); }); paint(); });

  const tray = $('#cleo-tray'), TK = ['a', 't', 'src', 'c', 'cz', 'sort', 'been'];
  let P = {}, opener = null, pushed = 0, after = null;
  const tpaint = () => {
    $$('.pill', tray).forEach(b => { const k = at(b, 'data-f'); b.setAttribute('aria-pressed', String((k === 'base' ? ({ 'street!': 'street', satellite: 'satellite' })[store.get('base', 'map')] || 'light' : P[k] || '') === at(b, 'data-v'))); });
    const o = { gap: '' }; TK.forEach(k => { o[k] = P[k]; }); const n = count(o);
    $('[data-tr="go"]', tray).textContent = n ? tt('city.tray.show', 'Show {places}', { places: pl(n) }) : tt('city.tray.none', 'No places match — clear a filter');
  };
  const thide = () => { tray.hidden = true; d.body.style.overflow = ''; };
  const T = Cleo.tray = {
    open(sec, from) {
      if (Cleo.sheet) Cleo.sheet.close();
      P = {}; TK.forEach(k => { P[k] = S[k]; }); opener = from; tray.hidden = false; d.body.style.overflow = 'hidden'; tpaint();
      try { history.pushState({ tray: 1 }, ''); pushed = 1; } catch (e) {}
      const f = sec && $('[data-fs="' + sec + '"]', tray); if (f) f.scrollIntoView({ block: 'start' });
      ($('.pill', f || tray) || $('[data-tr="x"]', tray)).focus({ preventScroll: !!f });
    },
    close(silent, then) {
      if (!tray || tray.hidden) { if (then) then(); return; }
      thide(); if (!silent && opener) opener.focus();
      if (pushed) { pushed = 0; after = then || null; history.back(); } else if (then) then();
    }
  };
  on(window, 'popstate', () => { pushed = 0; if (tray && !tray.hidden) thide(); if (after) { const f = after; after = null; f(); } });
  on(tray, 'click', e => {
    const t = e.target, b = t.closest && t.closest('[data-tr],.pill');
    if (t === tray) { T.close(); return; } if (!b) return;
    const k = at(b, 'data-f'), v = at(b, 'data-v'), a = at(b, 'data-tr');
    if (k === 'base') C.setBase(v); else if (k) P[k] = P[k] === v && k !== 'sort' && k !== 'been' ? '' : v;
    else if (a === 'clear') TK.forEach(x => { P[x] = ''; });
    else if (a === 'x') { T.close(); return; }
    else if (a === 'go') { const r = {}; if (S.mode !== 'all') r.mode = S.mode; TK.forEach(x => { if (P[x]) r[x] = P[x]; });
      T.close(true, () => { go(r); if (r.sort === 'near' && !C.dist) need('foryou', () => C.near()); }); return; }
    tpaint();
  });
  if (tray) trap(tray, () => T.close());

  let map = null, loading = 0;
  const markers = {}, bases = {}, waiters = [];
  // SPEC-v3 slice 1 ("places on a map, not numbers on a grid"): every place is a quiet DOT on one shared canvas layer
  // (zero DOM nodes; city.js); atlas.js lifts the best places in view into labelled pins (kind glyph + name, ≤ 24) and
  // draws density discs at region zoom. No numbers on the map. Before atlas.js arrives the dots are plain.
  const dotStyle = c => (C.dotStyle ? C.dotStyle(c) : { radius: 3.5, weight: 1.5, color: '#fff', fillColor: '#948B83', fillOpacity: 1 });
  const pinEl = c => (c && C.pinOf ? C.pinOf(pid(c)) : null);
  const hot = (c, o) => { if (c && C.hotPin) C.hotPin(c, o); };
  ['mouseover', 'focusin', 'mouseout', 'focusout'].forEach((ev, i) => on(d, ev, e => {
    const c = e.target.closest && e.target.closest('li.pl'); if (c && !(e.relatedTarget && c.contains(e.relatedTarget))) hot(c, i < 2); }));
  const syncMarkers = () => { if (!map) return; try { map.stop(); } catch (e) {}
    cards.forEach(c => { const k = markers[pid(c)]; if (!k) return; if (!c.hidden) { if (!dots.hasLayer(k)) k.addTo(dots); } else if (dots.hasLayer(k)) dots.removeLayer(k); }); feature(); };
  let dots = null;   // the canvas layer group holding every dot
  const inCl = C.inCl = {}, feature = () => { if (map && C.feature) C.feature(); };
  const still = () => !window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches;
  let auto = 0; const stub = {};   // unstamped cards (Cleo.defer.peek) that already have a pin
  const live = () => !!map && !!map._loaded && !!map.getContainer().parentNode;   // R6 QA High: never touch a removed map (_leaflet_pos)
  const fly = ll => { if (!live() || !map.getSize().x) return; auto = Date.now(); try { if (still()) map.setView(ll, Math.max(map.getZoom(), 15), { animate: false }); else map.flyTo(ll, Math.max(map.getZoom(), 15), { duration: 0.6 }); } catch (e) {} };
  C.map = () => (live() ? map : null); C.markers = markers; C.loadMap = cb => loadMap(cb); C.pinEl = pinEl; C.hot = hot;
  C.stub = id => stub[id]; C.pin = c => pin(c); C.fly = ll => fly(ll); C.still = () => still(); C.auto = () => { auto = Date.now(); }; C.autoAt = () => auto; C.num = num; C.sections = sections;
  const el0 = () => d.getElementById('cleo-map') || main;
  // phones: the chip row (top) and the card carousel (bottom) float over the full-bleed map, so a fit that ignores them
  // parks pins underneath. Fit inside the uncovered band (QA-34; the day route sits above the carousel too).
  const overMap = C.overMap = () => { const m = el0().getBoundingClientRect(), lp = $('.listpane'), bar = $('.ms-bar'), H = d.documentElement; let t = 0, b = 0;
    if (!desk() && H.classList.contains('atlas-m') && !H.classList.contains('ms-list')) {
      if (lp && lp.offsetHeight) b = Math.max(0, m.bottom - lp.getBoundingClientRect().top);
      if (bar && bar.offsetHeight) t = Math.max(0, bar.getBoundingClientRect().bottom - m.top); }
    return { paddingTopLeft: [32, 24 + t], paddingBottomRight: [32, 24 + b] }; };
  const fitArea = C.fitArea = a => { if (!live() || !map.getSize().x) return; const ll = cards.concat(Cleo.defer ? Cleo.defer.peek() : []).filter(c => at(c, 'data-a') === a && markers[pid(c)]).map(c => markers[pid(c)].getLatLng());
    if (ll.length) { auto = Date.now(); map.fitBounds(window.L.latLngBounds(ll), Object.assign(overMap(), { maxZoom: 16, animate: !still() })); } };
  // pin → atlas.js's select (desktop: the card lights up in the list + a preview card on the map; phones: the carousel
  // brings the card into view). Before atlas.js arrives (it loads with the map), the card is simply brought into view.
  const pin = c => {
    if (C.select) { C.select(c, 'pin'); return; }
    $$('li.pl.is-focus').forEach(x => x.classList.remove('is-focus')); c.classList.add('is-focus'); c.scrollIntoView({ block: 'nearest' });
  };
  const mountMap = Cleo.mountMap = () => {
    const L = window.L, el = d.getElementById('cleo-map'); if (map || !L || !L.map || !el) return false;
    el.innerHTML = ''; el.removeAttribute('data-tiles');
    const z = info.center || [0, 0, 2], E = 'https://server.arcgisonline.com/ArcGIS/rest/services/', ea = { attribution: 'Tiles &copy; Esri', maxZoom: 19 };
    map = L.map(el, { scrollWheelZoom: desk(), zoomControl: false, zoomSnap: 0.5 }).setView([z[0], z[1]], z[2] || 11);
    // SPEC-v3 §4 (settled by the real-tile R0 shots): the default base is the calm Esri gray canvas that follows the
    // theme (light / dark), with its reference labels in their own pane below our dots and pins; Satellite is the one
    // alternative in the switch; OSM street detail is opt-in (the Key). OSM + Esri only, no key, never CARTO.
    map.createPane('labels').style.zIndex = 350; map.getPane('labels').style.pointerEvents = 'none';
    const ca = { attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxNativeZoom: 16, maxZoom: 19 };
    const canvas = t => L.layerGroup([L.tileLayer(E + 'Canvas/World_' + t + '_Gray_Base/MapServer/tile/{z}/{y}/{x}', ca), L.tileLayer(E + 'Canvas/World_' + t + '_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { pane: 'labels', opacity: 0.85, maxNativeZoom: 16, maxZoom: 19 })]);
    bases.mapLight = canvas('Light'); bases.mapDark = canvas('Dark');
    bases.street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });
    bases.satellite = L.tileLayer(E + 'World_Imagery/MapServer/tile/{z}/{y}/{x}', ea);
    const b0 = baseOf(store.get('base', 'map')); b0.addTo(map);
    // tiles that never load: drop the map (cleanly — every handler checks live()), keep the list whole, say so quietly.
    // Never mid-zoom (W7 FE-A): Leaflet's remove() leaves the zoom-end timer armed (`_leaflet_pos` of a removed pane)
    const fail = () => { const m0 = map; if (!m0) return; try { m0.stop(); } catch (e) {} if (m0._animatingZoom) { m0.once('zoomend', () => setTimeout(fail, 0)); return; }
      map = null; Object.keys(inCl).forEach(k => delete inCl[k]); Cleo.mapFallback(el, m0); d.documentElement.classList.add('ms-nomap'); if (C.onNoMap) C.onNoMap(); };
    if (Cleo.watchTiles) Cleo.watchTiles(b0.getLayers ? b0.getLayers()[0] : b0, fail);
    // every place gets its dot, stamped or not (unstamped = a start-tag stub from Cleo.defer.peek(); click stamps it) —
    // one canvas renderer, so 500+ places cost no DOM nodes and pan smoothly; a generous click tolerance (thumbs)
    const c2d = (() => { try { return !!d.createElement('canvas').getContext('2d'); } catch (e) { return false; } })();   // no 2D canvas → SVG dots, same API
    // tolerance 19: every dot gets a 44 px hit circle (SPEC-v3 §1.1)
    const cv = C.canvas = c2d ? L.canvas({ padding: 0.3, tolerance: 19 }) : L.svg({ padding: 0.3 });
    // a dot draws its kind by shape on the canvas: options.shape 'sq' (eat & drink), options.slash (closed); SVG keeps the circle
    const Dot = L.CircleMarker.extend({ _updatePath: function () { const r = this._renderer, o = this.options;
      if (!r._ctx || !r._fillStroke || (!o.shape && !o.slash)) return L.CircleMarker.prototype._updatePath.call(this);
      if (!r._drawing || this._empty()) return; const p = this._point, ctx = r._ctx, h = Math.max(this._radius, 1);
      ctx.beginPath(); if (o.shape === 'sq') { if (ctx.roundRect) ctx.roundRect(p.x - h, p.y - h, 2 * h, 2 * h, 1.5); else ctx.rect(p.x - h, p.y - h, 2 * h, 2 * h); } else ctx.arc(p.x, p.y, h, 0, Math.PI * 2, false);
      r._fillStroke(ctx, this);
      if (o.slash && o.opacity) { ctx.beginPath(); ctx.moveTo(p.x - h - 1, p.y + h + 1); ctx.lineTo(p.x + h + 1, p.y - h - 1); ctx.globalAlpha = o.opacity; ctx.lineWidth = 1.5; ctx.strokeStyle = o.color; ctx.stroke(); } } }); dots = C.dots = L.layerGroup().addTo(map);
    const card = id => byId[id] || (Cleo.defer && Cleo.defer.stampIds ? Cleo.defer.stampIds(new Set(['p-' + id]))[0] : Cleo.defer && Cleo.defer.stampFor(id));
    C.cardOf = id => byId[id] || card(id);
    cards.concat(Cleo.defer ? Cleo.defer.peek() : []).forEach(c => {
      // not a physical place (data-np): it stays in the list with its note, and never draws on the map (PANEL-R1 #15)
      const ll = (at(c, 'data-ll') || '').split(','); if (ll.length !== 2 || c.hasAttribute('data-np')) return;
      const id = pid(c), k = markers[id] = new Dot([+ll[0], +ll[1]], Object.assign({ renderer: cv, bubblingMouseEvents: false }, dotStyle(c))).addTo(dots); if (c.stub) stub[id] = c;
      // a canvas dot has no element of its own: the place's element is its featured pin, when it has one
      k.getElement = () => (C.pinOf ? C.pinOf(id) : null) || undefined;
      k.on('click', () => { const r = byId[id] || card(id); if (r) pin(r); });
      k.on('mouseover', () => { const r = byId[id]; if (r) r.classList.add('is-hover'); if (C.hotId) C.hotId(id, true); });
      k.on('mouseout', () => { const r = byId[id]; if (r) r.classList.remove('is-hover'); if (C.hotId) C.hotId(id, false); });
    });
    if (desk()) L.control.zoom({ position: 'topleft' }).addTo(map);   // phones pinch (SPEC-v3 §2.2)
    need('atlas', () => { if (C.atlasTools && live()) { C.atlasTools(L, el); feature(); } });
    syncMarkers(); C.after.forEach(f => f());
    const r0 = Cleo.route.parse().p;
    if (C.atView && C.atView()) { if (r0 && C.clearPin) setTimeout(C.clearPin, 0); }   // a shared view (#…&at=, atlas-nav.js) wins
    else if (r0 && markers[r0]) setTimeout(() => { if (!(C.freshPlace && C.view === 'atlas' && C.freshPlace())) fly(markers[r0].getLatLng()); }, 0);
    else if (S.a) setTimeout(() => fitArea(S.a), 0);
    else if (S.mode !== 'all' || S.q || LENS.some(k => S[k])) setTimeout(fitLens, 0);   // a lens link: every match on the map, so the count is the lens total
    else setTimeout(() => { if (!(C.fitDefault && C.fitDefault())) fitCore(); }, 0);   // the city core, or the last view of this city (atlas.js)
    return true;
  };
  const fitLens = C.fitLens = () => { if (!live() || !map.getSize().x) return; const ll = cards.filter(c => !c.hidden && markers[pid(c)]).map(c => markers[pid(c)].getLatLng());
    if (ll.length) { auto = Date.now(); map.fitBounds(window.L.latLngBounds(ll), Object.assign(overMap(), { maxZoom: 15, animate: false })); } };
  // QA-44: the first view fits the city's core (pins within 3× the median distance of the median point, else 95 %) (a far outlier — a day trip, a mis-filed place — never zooms
  // the city out to a country); every place stays in the list, behind "Show all" and a zoom out
  const fitCore = () => { if (!live() || !map.getSize().x) return; const ll = Object.keys(markers).map(id => markers[id].getLatLng()); if (ll.length < 2) return;
    const md = a => a.slice().sort((x, y) => x - y)[a.length >> 1], c = [md(ll.map(p => p.lat)), md(ll.map(p => p.lng))];
    const dd = ll.map(p => [Math.hypot(p.lat - c[0], (p.lng - c[1]) * Math.cos(c[0] * Math.PI / 180)), p]).sort((x, y) => x[0] - y[0]), cut = Math.max(dd[dd.length >> 1][0] * 3, 0.004);
    let k = dd.filter(x => x[0] <= cut); if (k.length < ll.length * 0.6) k = dd.slice(0, Math.ceil(ll.length * 0.95)); k = k.map(x => x[1]);   // the core: within 3× the median distance
    auto = Date.now(); map.fitBounds(window.L.latLngBounds(k), Object.assign(overMap(), { maxZoom: 15, animate: false })); };
  // 'map' = the theme's gray canvas (the old stored 'light' and the old default 'street' both read as it; street detail is
  // only ever an explicit choice from the Key, stored as 'street!')
  const dark = () => { const t = d.documentElement.getAttribute('data-theme'); return t === 'dark' || (t !== 'light' && !!window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); };
  const baseOf = k => k === 'satellite' ? bases.satellite : k === 'street!' ? bases.street : dark() ? bases.mapDark : bases.mapLight;
  C.setBase = k => { k = k === 'street' ? 'street!' : k === 'light' ? 'map' : k; store.set('base', k); if (!live()) return; const b = baseOf(k); for (const x in bases) if (bases[x] && bases[x] !== b && map.hasLayer(bases[x])) map.removeLayer(bases[x]); if (!map.hasLayer(b)) b.addTo(map); };
  const reTheme = () => { if (live()) C.setBase(store.get('base', 'map')); };   // the canvas follows a theme toggle live
  if (window.matchMedia) { const mq = matchMedia('(prefers-color-scheme: dark)'); if (mq.addEventListener) mq.addEventListener('change', reTheme); else if (mq.addListener) mq.addListener(reTheme); }
  if (window.MutationObserver) new MutationObserver(reTheme).observe(d.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  // Leaflet (≈ 144 KB) loads after first paint and after the page's own load: the list is the content, the map follows
  // (W7: Atlas Tokyo ≤ 2,000 KB, FCP untouched). A failed load costs the map, never a place: the list stays whole.
  const afterPaint = f => { const go = () => requestAnimationFrame(() => setTimeout(f, 0)); if (d.readyState === 'complete') go(); else on(window, 'load', go); };
  const loadMap = cb => {
    if (cb) waiters.push(cb);
    const done = () => { mountMap(); if (map) waiters.splice(0).forEach(f => f()); };
    if (window.L) { done(); return; }
    if (loading++) return;
    afterPaint(() => {
      const b = (Cleo.root || '../') + 'assets/vendor/leaflet/', l = d.createElement('link'), s = d.createElement('script');
      l.rel = 'stylesheet'; l.href = b + 'leaflet.css'; d.head.appendChild(l);
      s.src = b + 'leaflet.js'; s.async = true; s.onload = done;
      s.onerror = () => { d.documentElement.classList.add('ms-nomap'); if (C.onNoMap) C.onNoMap(); };
      d.head.appendChild(s);
    });
  };
  paint();
  // ROUND-3 #5 motion hooks (FE-A JS half; DES owns the CSS). Classes only, added for one beat and only when the
  // reader allows motion: .pop on a save / been control that just turned on, .stamp-in on a fresh stamp, .is-press on
  // a rail door while pressed. Nothing autoplays; under prefers-reduced-motion no class is ever added.
  const moves = C.moves = () => !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const beat = C.beat = (el, cls, ms) => { if (!el || !moves()) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms || 600); };
  on(d, 'click', e => { const b = e.target.closest && e.target.closest('button.pl-save,button.gc-save,button.ge-save,[data-sh="save"],[data-sh="been"]'); if (!b) return;
    setTimeout(() => { if (at(b, 'aria-pressed') === 'true') beat(b, 'pop', 600);
      const li = b.closest('li.pl'), st = li && $('.stamp', li); if (st && at(b, 'data-sh') === 'been') beat(st, 'stamp-in', 700); }, 0); });
  on(d, 'pointerdown', e => { const r = moves() && e.target.closest && e.target.closest('.rail-i,.door'); if (!r) return; r.classList.add('is-press');
    const up = () => { r.classList.remove('is-press'); ['pointerup', 'pointercancel', 'pointerleave'].forEach(k => r.removeEventListener(k, up)); };
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(k => r.addEventListener(k, up)); });
  onRoute();
  if ((store.get('interests', []) || []).length) need('foryou');
})();
