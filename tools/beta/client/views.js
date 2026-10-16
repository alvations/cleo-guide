/* views.js (FE-A): view switcher + registry (SPEC §2.4), Gallery pager (§2.3); Atlas layout hooks (Atlas lane: atlas.js does the rest). Nothing removes a card. */
(() => {
  'use strict';
  const Cleo = window.Cleo || {}, C = Cleo.city, d = document, html = d.documentElement;
  if (!C || !Cleo.route || Cleo.views) return;                  // once per page, even if the file is evaluated twice
  const $ = (s, el) => (el || d).querySelector(s), qa = (s, el) => [].slice.call((el || d).querySelectorAll(s));
  const at = (el, a) => el.getAttribute(a), on = (el, ev, f) => el && el.addEventListener(ev, f);
  let byUser = '';
  const info = C.info, DEF = info.dv || 'atlas', NAME = { gallery: 'Gallery', atlas: 'Atlas', guidebook: 'Guidebook', insights: 'Insights' };
  const avail = (info.views || ['gallery', 'atlas']).filter(v => NAME[v]), store = Cleo.store || { get: (k, x) => x, set: () => {} };
  const nav = $('[data-cleo-views]'), host = $('#cleo-view'), live = $('#cleo-view-live'), split = $('.split'), lp = $('.listpane');
  // i18n D-41: interface strings from the catalogue (Cleo.t, head snippet); the English here equals en.json (test-i18n)
  const tt = (k, e, v) => Cleo.t ? Cleo.t(k, e, v) : v ? e.replace(/\{([a-z]+)\}/g, (m, n) => (n in v ? v[n] : m)) : e;
  const nm = v => tt('city.view.' + v, NAME[v]);
  const reg = {}, mem = {}, pl = n => n === 1 ? tt('hub.places.one', '1 place') : tt('hub.places', '{n} places', { n: n.toLocaleString('en-US') });
  const ok = v => avail.indexOf(v) >= 0;
  const isRoute = h => !h || h === '#' || h.indexOf('=') >= 0;          // #p-x / #area-X are anchors, not routes: keep the view
  let cur = ok(at(html, 'data-view')) ? at(html, 'data-view') : DEF;

  // no view= → the implied view (#day= or a lens → Atlas, the unpaged list; else the default); writes keep the view
  const LENS = ((Cleo.lens && Cleo.lens.KEYS) || ['mode', 'a', 't', 'c', 'cz', 'src', 'closed', 'q']).concat(['sig', 'gap']);
  const implied = r => (r.day || LENS.some(k => r[k])) && ok('atlas') ? 'atlas' : DEF;
  const href0 = Cleo.route.href.bind(Cleo.route);
  Cleo.route.href = o => { o = Object.assign({}, o || {}); const v = o.view || cur; delete o.view; if (v !== implied(o)) o = Object.assign({ view: v }, o); return href0(o); };

  const api = Cleo.views = {
    names: avail.slice(), current: () => cur, label: v => (NAME[v] ? nm(v) : v),
    get: name => reg[name] || null,
    register(name, m) { reg[name] = m; if (name === cur && host && m.mount && !m.on) mount(name); },
    show: (v, o) => show(v, o || {}),
    host: () => host,
    /** share URL for this page / place in this view: always writes view= (SPEC §2.4), whatever the receiver prefers */
    shareUrl(p) { const r = Cleo.route.parse(); delete r.p; delete r.view; const o = Object.assign({ view: cur }, r, p ? { p } : {});
      return location.href.split('#')[0] + href0(o); }
  };

  const need = n => { if (need[n]) return; need[n] = 1; const s = d.createElement('script'); s.src = (Cleo.root || '../') + 'assets/js/' + n + '.js?v=' + ((info.js || {})[n] || ''); s.async = true; d.head.appendChild(s); };
  const loadMod = (v, cb) => {
    if (reg[v]) { cb(); return; }
    const s = d.createElement('script'); s.src = (Cleo.root || '../') + 'assets/js/' + v + '.js?v=' + ((info.js || {})[v] || ''); s.async = true;
    s.onload = () => cb(); s.onerror = () => { if (cur === v) show(DEF, { replace: 1 }); }; d.head.appendChild(s);
  };
  function mount(v) {
    const m = reg[v]; if (!m || m.on) return;
    const user = byUser === v; byUser = '';   // FE-B QC-10: the module focuses its own heading once drawn after a user switch
    m.on = 1; if (host) { host.hidden = false; try { m.mount && m.mount(host, { key: C.key, file: info.file, city: C, total: info.total, go: C.go, view: v, user }); } catch (e) { if (window.console) console.error(e); } }

    if (v === 'insights') grow();
  }
  // ROUND-3 #5: Insights bars grow once in view (svg.bars-in); drawn full size first, so nothing is ever hidden
  function grow() {
    if (!host || !window.IntersectionObserver || !(C.moves && C.moves())) return;
    const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); e.target.classList.add('bars-in'); }), { threshold: 0.25 });
    const look = () => { const s = qa('svg', host).filter(x => x.querySelector('.bar') && !x.hasAttribute('data-grown')); s.forEach(x => { x.setAttribute('data-grown', ''); io.observe(x); }); return s.length; };
    if (look() || !window.MutationObserver) return;
    const mo = new MutationObserver(() => { if (look()) mo.disconnect(); }); mo.observe(host, { childList: true, subtree: true }); setTimeout(() => mo.disconnect(), 10000);
  }
  function unmount(v) { const m = reg[v]; if (m && m.on) { m.on = 0; try { m.unmount && m.unmount(host); } catch (e) {} } if (host && !(reg[cur] && reg[cur].on)) host.hidden = true; }

  function paintNav() { if (!nav) return; qa('button[data-view]', nav).forEach(b => b.setAttribute('aria-pressed', String(at(b, 'data-view') === cur))); }   // FE-B QC-09: pressed state only (no menu)
  function show(v, o) {
    if (!ok(v)) v = DEF;
    const prev = cur, changed = v !== prev || o.first;
    if (v !== prev) { mem[prev] = window.scrollY || 0; unmount(prev); }
    cur = v; html.setAttribute('data-view', v); C.view = v; paintNav();
    if (v === 'atlas') atlasIn(); else atlasOut();
    if (v !== 'gallery' && Cleo.defer && Cleo.defer.resume) Cleo.defer.resume();   // the lazy observer takes over again
    if (v === 'gallery' && !C.gallery) need('gallery');            // the Gallery extras (rows, covers) load on first use
    if (!NAME[v] || v === 'gallery' || v === 'atlas') { if (host) host.hidden = true; }
    else {
      // FE-B QC-10 (SPEC §5): a user switch to a drawn view takes focus to a heading at once — a placeholder h1 named for the
      // view while its module and data load (focused below), then the module's own h1 when it is drawn (ctx.user)
      if (o.user && host && !(reg[v] && reg[v].on)) { byUser = v; host.hidden = false; host.innerHTML = '<h1 class="d2" tabindex="-1" data-cleo-pending>' + NAME[v] + '</h1>'; }
      loadMod(v, () => { if (cur === v) mount(v); });
    }
    page();
    if (changed && !o.first) {
      if (C.beat) C.beat(html, 'view-in', 360);                      // ROUND-3 #5: cross-fade hook on a real switch (DES CSS)
      requestAnimationFrame(() => { try { window.scrollTo(0, mem[v] || 0); } catch (e) {} });
      if (live) live.textContent = tt('views.live', '{view} view, {places}', { view: nm(v), places: pl(info.total) });
      const h = v === 'gallery' || v === 'atlas' ? $('#main h1') : host && $('h1,h2', host);
      if (o.user && h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
    if (changed && Cleo.emit) Cleo.emit('cleo:view', { view: v, prev });
  }

  // switcher: one history entry per switch (Back returns to the previous view); lenses, the open sheet and saved state stay
  on(nav, 'click', e => {
    const b = e.target.closest && e.target.closest('button[data-view]'); if (!b) return;
    const v = at(b, 'data-view');
    // FE-B QC-09 (§v2.11): four segments at every width, one tap per switch; a tap with a sheet open closes it and switches
    const wasOpen = !!(Cleo.sheet && Cleo.sheet.isOpen && Cleo.sheet.isOpen());
    if (wasOpen) { try { Cleo.sheet.close(true); } catch (x) {} try { b.focus({ preventScroll: true }); } catch (x) {} }   // focus leaves the closed sheet for the segment; the new view then takes it to its heading
    if (Cleo.tray && Cleo.tray.close) { try { Cleo.tray.close(true); } catch (x) {} }
    if (v === cur) { if (wasOpen) { const r0 = Cleo.route.parse(); if (r0.p) { delete r0.p; location.hash = Cleo.route.href(r0); } } return; }
    store.set('view', v);
    const r = Cleo.route.parse(); delete r.pg; delete r.all; if (wasOpen) delete r.p; r.view = v;
    const h = Cleo.route.href(r);
    const go = () => {
      show(v, { user: 1 });                                        // first, so the hashchange below sees no change to undo
      if (h === '#') { try { history.pushState(null, '', location.pathname + location.search); } catch (x) {} }
      else location.hash = h;
    };
    // W4 #5: cross-fade via a view transition when motion is allowed; synchronous otherwise
    if (d.startViewTransition && C.moves && C.moves()) { try { d.startViewTransition(go); return; } catch (x) {} }
    go();
  });
  // the map lives in Atlas: outside it, a map button ("Map", "See these n on the map") is a switch to Atlas
  d.addEventListener('click', e => {
    const b = cur !== 'atlas' && e.target.closest && e.target.closest('[data-cleo-map]'); if (!b || !ok('atlas')) return;
    e.preventDefault(); e.stopPropagation(); store.set('view', 'atlas');
    const r = Cleo.route.parse(), a = at(b, 'data-cleo-map'); delete r.pg; delete r.all; delete r.p; r.view = 'atlas';
    if (a) r.map = a; else delete r.map;
    show('atlas', { user: 1 }); location.hash = Cleo.route.href(r);
  }, true);
  const fromHash = () => {
    if (!isRoute(location.hash)) return cur;
    const r = Cleo.route.parse(); if (!r.view) return implied(r);   // #day= or a lens implies Atlas
    if (!ok(r.view)) { delete r.view; try { history.replaceState(null, '', href0(r) === '#' ? location.pathname + location.search : href0(r)); } catch (e) {} return DEF; }
    return r.view;
  };
  const onHash = () => { const v = fromHash(); if (v !== cur) show(v, {}); else page(); };
  on(window, 'hashchange', onHash); on(window, 'popstate', onHash);

  /* ---- Gallery pager (SPEC §2.3): 24 / 48 per page; lenses, search, #p= and print use the full set ---- */
  const grid = $('#cleo-grid'), size = () => (!window.matchMedia || matchMedia('(min-width: 640px)').matches ? 48 : 24);
  let pager = null;
  const setPg = o => { const r = Cleo.route.parse(); delete r.p; delete r.pg; delete r.all; Object.assign(r, o); C.go(r); if (grid) grid.scrollIntoView({ block: 'start' }); };
  function page() {
    const cards = qa('li.pl'), secs = qa('section.area');
    if (cur !== 'gallery') { cards.forEach(c => c.classList.remove('pg-off')); secs.forEach(s => s.classList.remove('pg-empty')); if (pager) pager.hidden = true; return; }
    const r = Cleo.route.parse(), all = r.all === '1', per = size(), lensOn = cards.some(c => c.hidden);
    let pend = Cleo.defer ? Cleo.defer.peek().length : 0;
    let pg = Math.max(1, parseInt(r.pg, 10) || 1);
    const deep = !!r.p || /^#(p|area)-/.test(location.hash);          // an addressed place / area needs the true view order
    const fine = !!(Cleo.defer && Cleo.defer.order && Cleo.defer.stampIds);
    if (pend && (all || lensOn || (!fine && (pg > 1 || deep)))) { Cleo.defer.all(); pend = 0; if (lensOn) { C.apply(); return; } }   // re-apply: new cards must meet the lens
    const h = location.hash, mp = /^#p-(.+)$/.exec(h), ma = /^#area-(.+)$/.exec(h), tid = r.p || (mp && decodeURIComponent(mp[1]));
    // Platform W7 (R6 gap #5): with no lens, any page (a deep link, page > 1, page 1) stamps only the cards it shows, placed
    // by the full view order (stamped cards + deferred stubs) — not every card (a phone #p= built 12.8k nodes).
    let ord = pend && fine ? Cleo.defer.order() : null;
    if (ord) {
      const i0 = tid ? ord.findIndex(o => o.id === 'p-' + tid) : -1, p0 = Math.min(i0 >= 0 ? Math.floor(i0 / per) + 1 : pg, Math.max(1, Math.ceil(ord.length / per)));
      const want = new Set(ord.slice((p0 - 1) * per, p0 * per).filter(o => !o.el).map(o => o.id));
      if (want.size) { Cleo.defer.stampIds(want); ord = Cleo.defer.order(); }
      pend = Cleo.defer.peek().length; if (!pend) ord = null;
    }
    const live = qa('li.pl').filter(c => !c.hidden), N = ord ? ord.length : live.length + pend, pages = Math.max(1, Math.ceil(N / per));
    const at0 = ord ? new Map(ord.map((o, i) => [o.id, i])) : null, pos = c => at0 ? (at0.has(c.id) ? at0.get(c.id) : -1) : live.indexOf(c);
    if (pg > pages) pg = pages;
    // QA-29 (G1): a deep link or anchor always lands — #p=<id>, #p-<id> or #area-<A> on another page moves the pager there
    const tg = tid ? d.getElementById('p-' + tid) : ma ? $('li.pl:not([hidden])', d.getElementById('area-' + decodeURIComponent(ma[1])) || d.createElement('i')) : null, ti = tg ? pos(tg) : -1;
    if (!all && ti >= 0 && (ti < (pg - 1) * per || ti >= pg * per)) {
      pg = Math.floor(ti / per) + 1;
      if (!tid) requestAnimationFrame(() => { const s = tg.closest('section.area'); if (s) s.scrollIntoView({ block: 'start' }); });
      else if (r.p && (r.pg || pg > 1)) { const q = Cleo.route.parse(); if (pg > 1) q.pg = String(pg); else delete q.pg; try { history.replaceState(history.state, '', Cleo.route.href(q)); } catch (e) {} }
    }
    const a = all ? 0 : (pg - 1) * per, b = all ? N : Math.min(N, a + per);
    // page 1 may reach past the live cards (still deferred): keep their sections in layout; cleo:stamped re-pages
    const keep = new Set(ord ? ord.slice(a, b).filter(o => !o.el).map(o => o.a)
      : pend && b > live.length ? Cleo.defer.peek().slice(0, b - live.length).map(x => x.getAttribute('data-a')) : []);
    qa('li.pl').forEach(c => c.classList.remove('pg-off'));
    live.forEach(c => { const i = pos(c); if (i < a || i >= b) c.classList.add('pg-off'); });
    secs.forEach(s => s.classList.toggle('pg-empty', !s.querySelector('li.pl:not([hidden]):not(.pg-off)') && !keep.has(at(s, 'data-area'))));
    if (!pager) { pager = d.createElement('nav'); pager.className = 'pager g-pager vw view-gallery'; pager.setAttribute('aria-label', tt('views.pages', 'Pages of places'));
      const how = $('#how-we-choose'); if (how) how.parentNode.insertBefore(pager, how); else if (lp) lp.appendChild(pager);
      on(pager, 'click', e => { const x = e.target.closest('button'); if (!x) return; const v = at(x, 'data-pg');
        if (v === 'all') setPg({ all: '1' }); else if (v === 'paged') setPg({}); else setPg(+v > 1 ? { pg: v } : {}); }); }
    pager.hidden = false;
    const T = info.total, nums = [];
    if (!all && pages > 1) {
      const want = new Set([1, pages, pg - 1, pg, pg + 1].filter(x => x >= 1 && x <= pages)); let last = 0;
      [...want].sort((x, y) => x - y).forEach(x => { if (x - last > 1) nums.push('<span class="gap" aria-hidden="true">…</span>');
        nums.push('<button type="button" class="pg" data-pg="' + x + '"' + (x === pg ? ' aria-current="page"' : '') + ' aria-label="' + tt('views.page', 'Page {i} of {n}', { i: x, n: pages }) + '">' + x + '</button>'); last = x; });
    }
    const line = !N ? tt('views.none', 'No places match —') + ' <button type="button" class="btn btn-quiet" data-cleo-all>' + tt('views.none.all', 'show all {n}', { n: T }) + '</button>'
      : tt('views.showing', 'Showing {range} of {n}', { range: '<b>' + (a + 1) + '–' + b + '</b>', n: N.toLocaleString('en-US') }) + (N === T ? tt('views.all', ' — all {places}', { places: pl(T) }) : tt('views.inguide', ' (all {places} in the guide)', { places: pl(T) }));
    pager.innerHTML = (nums.length ? '<div class="pg-n"><button type="button" class="pg" data-pg="' + Math.max(1, pg - 1) + '"' + (pg === 1 ? ' disabled' : '') + ' aria-label="' + tt('views.prev', 'Previous page') + '">‹</button>' + nums.join('') +
      '<button type="button" class="pg" data-pg="' + Math.min(pages, pg + 1) + '"' + (pg === pages ? ' disabled' : '') + ' aria-label="' + tt('views.next', 'Next page') + '">›</button></div>' : '') +
      '<p class="pg-line tot" aria-live="polite">' + line + '</p>' +
      (pages > 1 || all ? '<p><button type="button" class="btn btn-ghost showall" data-pg="' + (all ? 'paged' : 'all') + '">' + (all ? tt('views.per', 'Show {n} per page', { n: per }) : tt('views.onepage', 'Show all {n} on one page', { n: N.toLocaleString('en-US') })) + '</button></p>' : '');
    if (Cleo.emit) Cleo.emit('cleo:paged', { a, b, n: N });
  }
  C.after.push(page);
  on(d, 'cleo:locale', () => { if (pager) page(); nopin(); });   // i18n D-41: redraw the pager and the badge in the loaded catalogue
  // the paged Gallery stamps exactly its page (above), so core's lazy observer holds while it shows (platform W7)
  if (Cleo.defer && Cleo.defer.resume) Cleo.defer.hold = () => cur === 'gallery' && Cleo.route.parse().all !== '1';
  on(d, 'cleo:stamped', () => { if (cur === 'gallery') requestAnimationFrame(page); });
  on(window, 'beforeprint', () => { if (Cleo.defer) Cleo.defer.all(); qa('li.pl.pg-off').forEach(c => c.classList.remove('pg-off')); qa('.pg-empty').forEach(s => s.classList.remove('pg-empty')); });
  on(window, 'afterprint', () => page());
  if (window.matchMedia) { const mq = matchMedia('(min-width: 640px)'); const f = () => page(); if (mq.addEventListener) mq.addEventListener('change', f); else if (mq.addListener) mq.addListener(f); }

  /* ---- Atlas = map search (W7 Amendment 2: the real-estate map-search pattern, for travel) ----
   * The layout is CSS on html[data-view=atlas] from first paint (atlas.css: desktop map-left split with a 2-column card
   * grid; phones the map is the screen with a card carousel). The filter bar, results line, List / Map pill and the
   * map-area filter are atlas.js (Atlas lane), loaded on entering Atlas — off the eager path. Without it, or without
   * the map, the list still holds every place. State classes on <html>: atlas-d / atlas-m (layout), ms-*. */
  C.mapFirst = () => cur === 'atlas' && !C.desk();
  // desktop: the split fills the rest of the first screen (map bottom = viewport bottom), measured, never guessed
  const fitSplit = C.fitSplit = () => { if (!split || !C.desk() || cur !== 'atlas') return; split.style.removeProperty('--atlas-top');
    const t = Math.round(split.getBoundingClientRect().top + (window.scrollY || 0)); if (t > 0) split.style.setProperty('--atlas-top', t + 'px'); const m = C.map && C.map(); if (m) m.invalidateSize(); };
  let rt; on(window, 'resize', () => { clearTimeout(rt); rt = setTimeout(fitSplit, 150); });
  // W7: the search pill lives in the city bar; on the phone map the city bar steps aside (the Atlas chip row holds the
  // switcher and the toolbar), so the pill rides in the toolbar there and comes home on leaving
  const spill = $('[data-cleo-search]'), spHome = spill && spill.parentNode, tbS = $('[data-cleo-toolbar]');
  const spillTo = a => { if (!spill || !tbS || !spHome) return; if (a) { if (spill.parentNode !== tbS) tbS.insertBefore(spill, tbS.firstChild); } else if (spill.parentNode !== spHome) spHome.insertBefore(spill, spHome.firstChild); };
  function atlasIn() {
    if (!split) return;
    const m = !C.desk(); html.classList.toggle('atlas-m', m); html.classList.toggle('atlas-d', !m);
    spillTo(m);
    if (C.need) C.need('atlas', () => { if (cur === 'atlas' && C.msIn) { C.msIn(); fitSplit(); } });
    if (C.loadMap) C.loadMap(() => { fitSplit(); if (C.msArea) C.msArea(); });
    requestAnimationFrame(fitSplit); if (d.fonts && d.fonts.ready) d.fonts.ready.then(fitSplit);
    nopin();
  }
  function atlasOut() {
    spillTo(false);
    ['atlas-m', 'atlas-d', 'ms-list', 'ms-on'].forEach(k => html.classList.remove(k));
    if (C.msOut) C.msOut(); if (split) split.style.removeProperty('--atlas-top');
  }
  if (window.matchMedia) { const mq = matchMedia('(min-width: 1024px)'); const f = () => { if (cur === 'atlas') atlasIn(); }; if (mq.addEventListener) mq.addEventListener('change', f); else if (mq.addListener) mq.addListener(f); }
  // places without a verified pin are listed, never dropped (R-17): a floating badge on the Atlas map says so
  function nopin() {
    const mp = $('.mappane'); if (!mp) return;
    const n = qa('li.pl').filter(c => !c.hasAttribute('data-ll')).length + (Cleo.defer ? Cleo.defer.peek().filter(c => !c.hasAttribute('data-ll')).length : 0);
    let b = $('.nopin', mp); if (!n) { if (b) b.remove(); return; }
    if (!b) { b = d.createElement('p'); b.className = 'nopin'; mp.appendChild(b); }
    b.textContent = tt('views.nopin', '{n} without a verified pin · in the list', { n });
  }
  // area chips (Atlas list head on desktop; the Area tray elsewhere): one tap = the area lens, a second tap clears it. Drawn here from the blob + card attrs.
  const chips = $('.area-chips');
  if (chips) { const n = {}; qa('li.pl').concat(Cleo.defer ? Cleo.defer.peek() : []).forEach(c => { const a = c.getAttribute('data-a'); n[a] = (n[a] || 0) + 1; });
    chips.innerHTML = qa('section.area[data-area]').map(s => at(s, 'data-area')).filter(a => n[a]).map(a => { const x = (info.areas || {})[a] || {};
      return '<button type="button" class="chip" data-cleo-area="' + C.esc(a) + '" aria-pressed="false"' + (x.c ? ' style="--area:' + x.c + '"' : '') + '><i aria-hidden="true"></i>' + C.esc(x.n || a) + ' <span class="n">' + n[a] + '</span></button>'; }).join(''); }
  on(d, 'click', e => { const b = e.target.closest && e.target.closest('[data-cleo-area]'); if (!b) return;
    const r = Cleo.route.parse(), a = at(b, 'data-cleo-area'); delete r.p; delete r.pg; delete r.all; if (r.a === a) delete r.a; else r.a = a; C.go(r); });
  C.after.push(() => { const a = Cleo.route.parse().a || ''; qa('[data-cleo-area]').forEach(b => b.setAttribute('aria-pressed', String(at(b, 'data-cleo-area') === a))); });

  // FE-B's modules may load before this file: they queue [name, def] on window.CleoViewQueue
  const q0 = window.CleoViewQueue; if (q0 && q0.splice) q0.splice(0).forEach(x => api.register(x[0], x[1]));
  window.CleoViewQueue = { push: x => api.register(x[0], x[1]) };

  // first paint: the head script set html[data-view]; a stored preference is written into the hash (Back, shares)
  // PERF (QA-70, bisected to 7e746d9b): the phone sheets' "below the switcher" rules key on data-views-on and the switcher's
  // "pinned while a sheet is open" rules on data-overlay-on (fe-a.css), not on :has() over <main>, which re-matched on every
  // card stamped into <main> and held the main thread ~1.5 s after "Show map"
  const mn0 = d.getElementById('main');
  if (nav) { nav.hidden = false; if (mn0) mn0.setAttribute('data-views-on', ''); }
  { const ov = ['cleo-sheet', 'cleo-fy', 'cleo-tray'].map(i => d.getElementById(i)).filter(Boolean);   // the old :has(>.overlay:not([hidden]):not(.side)) test
    const ovOn = () => { if (mn0) mn0.toggleAttribute('data-overlay-on', ov.some(e => !e.hidden && !e.classList.contains('side') && e.parentNode === mn0)); };
    if (mn0 && ov.length && window.MutationObserver) { const mo = new MutationObserver(ovOn); ov.forEach(e => mo.observe(e, { attributes: true, attributeFilter: ['hidden', 'class'] })); ovOn(); } }
  const r0 = Cleo.route.parse(), hv = isRoute(location.hash) && r0.view;
  const im = implied(r0), sv = store.get('view', '');
  let v0 = hv && ok(hv) ? hv : im !== DEF ? im : !isRoute(location.hash) ? cur : ok(sv) ? sv : DEF;
  if (hv && !ok(hv)) v0 = DEF;
  cur = v0; fromHash();
  // a #day= / lens link stays untouched (it implies Atlas)
  if (v0 !== im && !hv && isRoute(location.hash)) { const r = Cleo.route.parse(); r.view = v0; try { history.replaceState(null, '', href0(r)); } catch (e) {} }
  show(v0, { first: 1 });
})();
