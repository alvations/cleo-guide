/* views.js (FE-A): view switcher + registry (SPEC §2.4), Gallery pager (§2.3), Atlas tray (§3.2). Nothing removes a card. */
(() => {
  'use strict';
  const Cleo = window.Cleo || {}, C = Cleo.city, d = document, html = d.documentElement;
  if (!C || !Cleo.route || Cleo.views) return;                  // once per page, even if the file is evaluated twice
  const $ = (s, el) => (el || d).querySelector(s), qa = (s, el) => [].slice.call((el || d).querySelectorAll(s));
  const at = (el, a) => el.getAttribute(a), on = (el, ev, f) => el && el.addEventListener(ev, f);
  const info = C.info, DEF = info.dv || 'atlas', NAME = { gallery: 'Gallery', atlas: 'Atlas', guidebook: 'Guidebook', insights: 'Insights' };
  const avail = (info.views || ['gallery', 'atlas']).filter(v => NAME[v]), store = Cleo.store || { get: (k, x) => x, set: () => {} };
  const nav = $('[data-cleo-views]'), host = $('#cleo-view'), live = $('#cleo-view-live'), split = $('.split'), lp = $('.listpane');
  const reg = {}, mem = {}, pl = n => n.toLocaleString('en-US') + (n === 1 ? ' place' : ' places');
  const ok = v => avail.indexOf(v) >= 0;
  const isRoute = h => !h || h === '#' || h.indexOf('=') >= 0;          // #p-x / #area-X are anchors, not routes: keep the view
  let cur = ok(at(html, 'data-view')) ? at(html, 'data-view') : DEF;

  // no view= → the implied view (#day= or a lens → Atlas, the unpaged list; else the default); writes keep the view
  const LENS = ((Cleo.lens && Cleo.lens.KEYS) || ['mode', 'a', 't', 'c', 'cz', 'src', 'closed', 'q']).concat(['sig', 'gap']);
  const implied = r => (r.day || LENS.some(k => r[k])) && ok('atlas') ? 'atlas' : DEF;
  const href0 = Cleo.route.href.bind(Cleo.route);
  Cleo.route.href = o => { o = Object.assign({}, o || {}); const v = o.view || cur; delete o.view; if (v !== implied(o)) o = Object.assign({ view: v }, o); return href0(o); };

  const api = Cleo.views = {
    names: avail.slice(), current: () => cur, label: v => NAME[v] || v,
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
    m.on = 1; if (host) { host.hidden = false; try { m.mount && m.mount(host, { key: C.key, file: info.file, city: C, total: info.total, go: C.go, view: v }); } catch (e) { if (window.console) console.error(e); } }

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

  function paintNav() { if (!nav) return; qa('button[data-view]', nav).forEach(b => { const p = at(b, 'data-view') === cur; b.setAttribute('aria-pressed', String(p)); if (p) b.setAttribute('aria-expanded', String(nav.classList.contains('open'))); else b.removeAttribute('aria-expanded'); }); }
  function show(v, o) {
    if (!ok(v)) v = DEF;
    const prev = cur, changed = v !== prev || o.first;
    if (v !== prev) { mem[prev] = window.scrollY || 0; unmount(prev); }
    cur = v; html.setAttribute('data-view', v); C.view = v; paintNav();
    if (v === 'atlas') atlasIn(); else atlasOut();
    if (v === 'gallery' && !C.gallery) need('gallery');            // the Gallery extras (rows, covers) load on first use
    if (!NAME[v] || v === 'gallery' || v === 'atlas') { if (host) host.hidden = true; }
    else loadMod(v, () => { if (cur === v) mount(v); });
    page();
    if (changed && !o.first) {
      if (C.beat) C.beat(html, 'view-in', 360);                      // ROUND-3 #5: cross-fade hook on a real switch (DES CSS)
      requestAnimationFrame(() => { try { window.scrollTo(0, mem[v] || 0); } catch (e) {} });
      if (live) live.textContent = NAME[v] + ' view, ' + pl(info.total);
      const h = v === 'gallery' || v === 'atlas' ? $('#main h1') : host && $('h1,h2', host);
      if (o.user && h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
    if (changed && Cleo.emit) Cleo.emit('cleo:view', { view: v, prev });
  }

  // switcher: one history entry per switch (Back returns to the previous view); lenses, the open sheet and saved state stay
  on(nav, 'click', e => {
    const b = e.target.closest && e.target.closest('button[data-view]'); if (!b) return;
    const v = at(b, 'data-view');
    // phones (< 640 px): the switcher is one "current view" button that opens the four (B-03 controls budget)
    if (v === cur) { if (window.matchMedia && matchMedia('(max-width: 639px)').matches) { const o = !nav.classList.contains('open'); nav.classList.toggle('open', o); b.setAttribute('aria-expanded', String(o)); } return; }
    nav.classList.remove('open');
    store.set('view', v);
    const r = Cleo.route.parse(); delete r.pg; delete r.all; r.view = v;
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
    // phones: the map opens in this same tap (ROUND-5 gap #3), not the Atlas list; desktop Atlas always shows it
    if (a || mobile()) r.map = a || '1'; else delete r.map;
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
    if (pend && (all || pg > 1 || lensOn || deep)) { Cleo.defer.all(); pend = 0; if (lensOn) { C.apply(); return; } }   // re-apply: new cards must meet the lens
    const live = qa('li.pl').filter(c => !c.hidden), N = live.length + pend, pages = Math.max(1, Math.ceil(N / per));
    if (pg > pages) pg = pages;
    // QA-29 (G1): a deep link or anchor always lands — #p=<id>, #p-<id> or #area-<A> on another page moves the pager there
    const h = location.hash, mp = /^#p-(.+)$/.exec(h), ma = /^#area-(.+)$/.exec(h), tid = r.p || (mp && decodeURIComponent(mp[1]));
    const tg = tid ? d.getElementById('p-' + tid) : ma ? $('li.pl:not([hidden])', d.getElementById('area-' + decodeURIComponent(ma[1])) || d.createElement('i')) : null, ti = tg ? live.indexOf(tg) : -1;
    if (!all && ti >= 0 && (ti < (pg - 1) * per || ti >= pg * per)) {
      pg = Math.floor(ti / per) + 1;
      if (!tid) requestAnimationFrame(() => { const s = tg.closest('section.area'); if (s) s.scrollIntoView({ block: 'start' }); });
      else if (r.p && (r.pg || pg > 1)) { const q = Cleo.route.parse(); if (pg > 1) q.pg = String(pg); else delete q.pg; try { history.replaceState(history.state, '', Cleo.route.href(q)); } catch (e) {} }
    }
    const a = all ? 0 : (pg - 1) * per, b = all ? N : Math.min(N, a + per);
    // page 1 may reach past the live cards (still deferred): keep their sections in layout; cleo:stamped re-pages
    const keep = new Set(pend && b > live.length ? Cleo.defer.peek().slice(0, b - live.length).map(x => x.getAttribute('data-a')) : []);
    qa('li.pl').forEach(c => c.classList.remove('pg-off'));
    live.forEach((c, i) => { if (i < a || i >= b) c.classList.add('pg-off'); });
    secs.forEach(s => s.classList.toggle('pg-empty', !s.querySelector('li.pl:not([hidden]):not(.pg-off)') && !keep.has(at(s, 'data-area'))));
    if (!pager) { pager = d.createElement('nav'); pager.className = 'pager g-pager vw view-gallery'; pager.setAttribute('aria-label', 'Pages of places');
      const how = $('#how-we-choose'); if (how) how.parentNode.insertBefore(pager, how); else if (lp) lp.appendChild(pager);
      on(pager, 'click', e => { const x = e.target.closest('button'); if (!x) return; const v = at(x, 'data-pg');
        if (v === 'all') setPg({ all: '1' }); else if (v === 'paged') setPg({}); else setPg(+v > 1 ? { pg: v } : {}); }); }
    pager.hidden = false;
    const T = info.total, nums = [];
    if (!all && pages > 1) {
      const want = new Set([1, pages, pg - 1, pg, pg + 1].filter(x => x >= 1 && x <= pages)); let last = 0;
      [...want].sort((x, y) => x - y).forEach(x => { if (x - last > 1) nums.push('<span class="gap" aria-hidden="true">…</span>');
        nums.push('<button type="button" class="pg" data-pg="' + x + '"' + (x === pg ? ' aria-current="page"' : '') + ' aria-label="Page ' + x + ' of ' + pages + '">' + x + '</button>'); last = x; });
    }
    const line = !N ? 'No places match — <button type="button" class="btn btn-quiet" data-cleo-all>show all ' + T + '</button>'
      : 'Showing <b>' + (a + 1) + '–' + b + '</b> of ' + N.toLocaleString('en-US') + (N === T ? ' — all ' + pl(T) : ' (all ' + pl(T) + ' in the guide)');
    pager.innerHTML = (nums.length ? '<div class="pg-n"><button type="button" class="pg" data-pg="' + Math.max(1, pg - 1) + '"' + (pg === 1 ? ' disabled' : '') + ' aria-label="Previous page">‹</button>' + nums.join('') +
      '<button type="button" class="pg" data-pg="' + Math.min(pages, pg + 1) + '"' + (pg === pages ? ' disabled' : '') + ' aria-label="Next page">›</button></div>' : '') +
      '<p class="pg-line tot" aria-live="polite">' + line + '</p>' +
      (pages > 1 || all ? '<p><button type="button" class="btn btn-ghost showall" data-pg="' + (all ? 'paged' : 'all') + '">' + (all ? 'Show ' + per + ' per page' : 'Show all ' + N.toLocaleString('en-US') + ' on one page') + '</button></p>' : '');
    if (Cleo.emit) Cleo.emit('cleo:paged', { a, b, n: N });
  }
  C.after.push(page);
  on(d, 'cleo:stamped', () => { if (cur === 'gallery') requestAnimationFrame(page); });
  on(window, 'beforeprint', () => { if (Cleo.defer) Cleo.defer.all(); qa('li.pl.pg-off').forEach(c => c.classList.remove('pg-off')); qa('.pg-empty').forEach(s => s.classList.remove('pg-empty')); });
  on(window, 'afterprint', () => page());
  if (window.matchMedia) { const mq = matchMedia('(min-width: 640px)'); const f = () => page(); if (mq.addEventListener) mq.addEventListener('change', f); else if (mq.addListener) mq.addListener(f); }

  /* ---- Atlas (SPEC §3.2): desktop split; phone map under a tray with peek / half / full detents (#map=1 = peek) ---- */
  const DET = ['peek', 'half', 'full'], tb = $('[data-cleo-toolbar]'), rail = $('#cleo-rail');
  let grab = null, moved = [], det = 'peek', pushedDet = 0;
  const mobile = () => !C.desk();
  const setDet = (v, push) => {
    det = v; if (split) split.setAttribute('data-detent', v);
    if (grab) { grab.setAttribute('aria-label', 'Tray: ' + v + '. Change the tray size'); grab.setAttribute('aria-expanded', String(v !== 'peek')); }
    if (push && v === 'full' && !pushedDet) { try { history.pushState({ detent: 1 }, '', location.href); pushedDet = 1; } catch (e) {} }
    const m = C.map && C.map(); if (m) setTimeout(() => { try { m.invalidateSize(); } catch (e) {} }, 220);
  };
  function atlasIn() {
    if (!split) return;
    html.classList.toggle('atlas-m', mobile());
    // phones: list first (the W2 page, QA-31); the tray detents live over the map, opened by Map / #map=
    if (mobile() && !Cleo.route.parse().map) { atlasOut(); return; }
    if (!mobile()) { atlasOut(true); if (C.loadMap) C.loadMap(() => { const m = C.map(); if (m) setTimeout(() => { try { m.invalidateSize(); } catch (e) {} }, 0); }); return; }
    if (!grab) {
      const th = d.createElement('div'); th.className = 'tray-head';
      th.innerHTML = '<button type="button" class="grab" data-detent-cycle aria-expanded="true"><span class="vh">Tray size</span></button>';
      grab = th.firstChild; lp.insertBefore(th, lp.firstChild);
      // swipe on the handle: up = one detent up, down = one down
      let y0 = null, swiped = 0; on(th, 'pointerdown', e => { y0 = e.clientY; swiped = 0; }); on(th, 'pointerup', e => { if (y0 == null) return; const dy = e.clientY - y0; y0 = null;
        if (Math.abs(dy) < 24) return; swiped = 1; const i = DET.indexOf(det); setDet(DET[Math.max(0, Math.min(2, i + (dy < 0 ? 1 : -1)))], dy < 0); });
      on(grab, 'click', () => { if (swiped) { swiped = 0; return; } const i = DET.indexOf(det); setDet(DET[(i + 1) % 3], true); });
    }
    const th = $('.tray-head', lp);
    [tb, rail].forEach(el => { if (el && el.parentNode !== th) { moved.push([el, el.parentNode, el.nextSibling]); th.appendChild(el); } });
    if (C.loadMap) C.loadMap(() => { const m = C.map(); if (m) m.invalidateSize(); });
    setDet(det);
    nopin();
  }
  function atlasOut(keep) {
    html.classList.remove('atlas-m'); if (lp) lp.removeAttribute('inert');   // a pin sheet's inert tray never outlives the phone map
    moved.splice(0).reverse().forEach(([el, par, nx]) => { if (nx && nx.parentNode === par) par.insertBefore(el, nx); else par.appendChild(el); });
    if (split && !keep) split.removeAttribute('data-detent');
    if (cur === 'atlas' && split) nopin();
  }
  on(d, 'keydown', e => { if (e.key !== 'Escape' || cur !== 'atlas' || !mobile() || det === 'peek') return;
    if ((Cleo.sheet && Cleo.sheet.isOpen()) || $('.overlay:not([hidden])') || ($('#cleo-poi') && !$('#cleo-poi').hidden)) return;
    setDet(det === 'full' ? 'half' : 'peek'); });
  on(window, 'popstate', () => { if (pushedDet) { pushedDet = 0; if (cur === 'atlas' && det === 'full') setDet('half'); } });
  on(window, 'hashchange', () => { if (cur === 'atlas' && mobile()) { const inMap = html.classList.contains('atlas-m'); if (!!Cleo.route.parse().map !== inMap) { if (!inMap) det = 'peek'; atlasIn(); } } });
  if (window.matchMedia) { const mq = matchMedia('(min-width: 1024px)'); const f = () => { if (cur === 'atlas') atlasIn(); }; if (mq.addEventListener) mq.addEventListener('change', f); else if (mq.addListener) mq.addListener(f); }
  // places without a verified pin are listed, never dropped (R-17): a floating badge on the Atlas map says so
  function nopin() {
    const mp = $('.mappane'); if (!mp) return;
    const n = qa('li.pl').filter(c => !c.hasAttribute('data-ll')).length + (Cleo.defer ? Cleo.defer.peek().filter(c => !c.hasAttribute('data-ll')).length : 0);
    let b = $('.nopin', mp); if (!n) { if (b) b.remove(); return; }
    if (!b) { b = d.createElement('p'); b.className = 'nopin'; mp.appendChild(b); }
    b.textContent = n + ' without a verified pin · listed below';
  }

  // area chips (Atlas tray head): one tap = the area lens, a second tap clears it. Drawn here from the blob + card attrs.
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
  if (nav) nav.hidden = false;
  const r0 = Cleo.route.parse(), hv = isRoute(location.hash) && r0.view;
  const im = implied(r0), sv = store.get('view', '');
  let v0 = hv && ok(hv) ? hv : im !== DEF ? im : !isRoute(location.hash) ? cur : ok(sv) ? sv : DEF;
  if (hv && !ok(hv)) v0 = DEF;
  cur = v0; fromHash();
  // a #day= / lens link stays untouched (it implies Atlas)
  if (v0 !== im && !hv && isRoute(location.hash)) { const r = Cleo.route.parse(); r.view = v0; try { history.replaceState(null, '', href0(r)); } catch (e) {} }
  show(v0, { first: 1 });
})();
