/* atlas-nav.js (Atlas FE-2 lane): the Atlas map's interaction state. Shipped inside assets/js/atlas.js (build.js
 * appends it), so it costs no request and always runs right after atlas.js, with the same Cleo.city (C).
 *   · round-trip (SPEC-v3 §3.2, PANEL-R1 #1): opening a place from a card, a pin or the preview never moves the map or
 *     scrolls the page; closing it (Escape, Close, Back) restores the centre, zoom, page and list scroll, the list and
 *     its count, and puts focus back on the card or pin that opened it. A fresh #p= load centres the place in the part
 *     of the map the detail doesn't cover.
 *   · the view in the URL (§3.5, #13): #…&at=lat,lng,zoom, written with replaceState on moveend (never a history
 *     entry). Opening such a link restores that view; it wins over the stored session view. The share toast says what
 *     the link opens. (`c=` is the category lens key, so the view key is `at`.)
 * Hooks this file provides to city.js / atlas.js — each is optional, so either file works without this one:
 *   C.placeOpen(card, marker) → true when Atlas hosts the detail (city.js onRoute then neither scrolls nor flies)
 *   C.atView() → true when the URL's view was applied (city.js mountMap then skips its own first fit)
 *   C.navHold() → true while a detail is open or being closed (atlas.js moveend stands still)
 *   C.navScrollHold() → true while the detail is open or the restore's own scroll is settling (atlas.js carousel scroll)
 *   C.navKeep() → true while only the open place changed (atlas.js: the route's list refresh stands still)
 *   C.navFitPending() → true until the map's first fit has landed (atlas.js: no map-area pass on the starting view)
 *   C.freshPlace() → true when a fresh #p= load is being placed (city.js mountMap then doesn't fly)
 *   C.clearPin() → pan the open place out from under the detail, by the minimum needed
 *   C.navPrivate() → true while the map is still the one centred on the reader (atlas.js keepView then stores nothing)
 *   C.onLocate(latlng) → true when Atlas takes the reading: nearest first, a walking time per card (atlas.js locate-me)
 *   · keyboard (§5, #11): "Skip to the map" / "Skip to the results"; arrows move between pins by map priority.
 *   · near me (§3.4, #3): locate-me sorts one list nearest first across areas, and every card shows its distance and an
 *     estimated walking time (straight line at 80 m a minute, said so). The location lives in memory only. */
(() => {
  'use strict';
  const Cleo = window.Cleo || {}, C = Cleo.city, d = document, H = d.documentElement; if (!C || C.placeOpen) return;
  const $ = (s, el) => (el || d).querySelector(s), on = (el, ev, f, o) => el && el.addEventListener(ev, f, o);
  // i18n D-41: interface strings from the catalogue (Cleo.t, head snippet); the English here equals en.json (test-i18n)
  const tt = (k, e, v) => Cleo.t ? Cleo.t(k, e, v) : v ? e.replace(/\{([a-z]+)\}/g, (m, x) => x in v ? v[x] : m) : e;
  const atlas = () => C.view === 'atlas' || (!C.view && H.getAttribute('data-view') === 'atlas'), lp = () => $('.listpane');
  const route = () => Cleo.route.parse(), hasP = () => !!placeId();
  // the open place: #…&p=<id>, or a card's own #p-<id> anchor
  const placeId = () => { const p = route().p; if (p) return p; const m = /^#p-(.+)$/.exec(location.hash); try { return m ? decodeURIComponent(m[1]) : ''; } catch (e) { return ''; } };
  const sheetOpen = () => !!(Cleo.sheet && Cleo.sheet.isOpen());

  /* ---- the view in the URL: at=lat,lng,zoom ---- */
  const AT = /^(-?\d{1,2}(?:\.\d{1,7})?),(-?\d{1,3}(?:\.\d{1,7})?),(\d{1,2}(?:\.\d{1,2})?)$/;
  if (Cleo.route.KEYS) Cleo.route.KEYS.at = AT;
  const parseAt = () => { const m = AT.exec(route().at || ''); if (!m) return null; const v = [+m[1], +m[2], +m[3]]; return Math.abs(v[0]) <= 85 && Math.abs(v[1]) <= 180 && v[2] >= 1 && v[2] <= 19 ? v : null; };
  // 5 decimals (≈ 1 m) to zoom 15, 6 above it, so a copied view reopens within 1 px at every zoom
  const fmt = m => { const c = m.getCenter(), z = m.getZoom(), k = z > 15 ? 6 : 5; return (+c.lat.toFixed(k)) + ',' + (+c.lng.toFixed(k)) + ',' + (+z.toFixed(1)); };
  let atDone = false, ready = false;
  // the view right after locate-me is centred on the reader: it is never written anywhere (URL or session) until the
  // reader moves the map themselves
  let meView = false, meAt = 0;
  C.navPrivate = () => meView;
  const writeAt = () => {
    const m = C.map(); if (!m || !atlas() || !ready || meView || !m.getSize().x || /^#p-/.test(location.hash) || !history.replaceState) return;
    const r = route(), v = fmt(m); if (r.at === v) return; r.at = v;
    try { history.replaceState(history.state, '', Cleo.route.href(r)); } catch (e) {}
  };
  // the URL's view, once per page load; true while it is the view in charge (so no other first fit overrides it)
  C.atView = () => { const m = C.map(), v = parseAt(); if (!m || !v || !atlas() || !m.getSize().x) return false; if (atDone) return userAt === 0 || !ready;
    atDone = true; C.auto(); m.setView([v[0], v[1]], v[2], { animate: false }); return true; };
  const fd = C.fitDefault; C.fitDefault = () => C.atView() || (fd ? fd() : false);   // the URL's view wins over the session's

  /* ---- what the round-trip keeps: the map, the scrolls, and who opened the place ---- */
  const snapNow = () => { const m = C.map(), l = lp(); return { c: m ? m.getCenter() : null, z: m ? m.getZoom() : null, y: window.scrollY || 0, t: l ? l.scrollTop : 0, x: l ? l.scrollLeft : 0 }; };
  let last = null, frozen = null, opener = null, pvFrom = null, open = null, holdTo = 0, userAt = 0, seenNoP = !hasP();
  let closedAt = 0;
  const idle = () => !open && !hasP() && !sheetOpen() && Date.now() > holdTo;
  // the lenses, sort and search: when only the open place changes, the list the reader left is the list they come back to
  const sig = () => { const r = route(); delete r.p; delete r.at; delete r.view; delete r.pg; delete r.all; return JSON.stringify(r) + '|' + ((C.S || {}).q || ''); };
  let idleSig = null;
  const rec = () => { if (idle() && atlas()) { last = snapNow(); idleSig = sig(); } };
  C.navHold = () => !!open || Date.now() < holdTo;
  // the carousel's "middle card is selected" stands still only while the detail is open and for the scroll events the
  // restore itself makes, never for a reader's swipe after closing (QA-71)
  let ownScroll = 0;
  C.navScrollHold = () => !!open || Date.now() - ownScroll < 250;
  C.navKeep = () => atlas() && idleSig !== null && (!!open || hasP() || (Date.now() < holdTo && userAt <= closedAt)) && sig() === idleSig;
  ['pointerdown', 'wheel', 'keydown', 'touchstart'].forEach(ev => on(d, ev, e => { if (!e.isTrusted) return; userAt = Date.now(); }, { capture: true, passive: true }));
  // scroll events come in bursts (a view switch lays out hundreds of cards): take one snapshot per frame, never one per
  // event (each reads scrollTop, a forced layout; INP on the desktop switch to Atlas, 16 Oct). A click still snapshots
  // at once (mark → rec).
  let recQ = 0; const recSoon = () => { if (recQ) return; recQ = requestAnimationFrame(() => { recQ = 0; rec(); }); };
  on(window, 'scroll', recSoon, { passive: true });
  d.addEventListener('scroll', e => { if (e.target === lp()) recSoon(); }, { capture: true, passive: true });
  // the opener: a card (its name link, cover or photo), the preview (→ whatever opened the preview), or a pin
  const mark = e => {
    const t = e.target; if (!t || !t.closest || !atlas()) return;
    if (t.closest('#cleo-poi a.ms-pv')) { rec(); frozen = last; opener = pvFrom || null; return; }
    if (t.closest('#cleo-poi')) return;
    // a selection card elsewhere (FE-C's landscape side card, Cleo.side) marks its detail link data-nav-pin: like the preview
    if (t.closest('a[data-nav-pin]')) { rec(); frozen = last; opener = { pin: 1 }; return; }
    // the preview only ever opens from the map (a pin, the pill a hovered dot shows, or a dot on the canvas): focus goes
    // back to the open place's pin, which stays labelled while it is selected
    if (t.closest('#cleo-map')) { pvFrom = { pin: 1 }; return; }
    const li = t.closest('li.pl'); if (li && t.closest('a,.pl-cover,.pl-photo') && !t.closest('.pl-x,.ms-cr,figcaption')) { rec(); frozen = last; opener = { card: li.id }; }
  };
  on(d, 'click', mark, true);
  // PANEL-R3 #7 (the 108 px shift): a card's own link is "#p-<id>", a real fragment, so following it scrolled the nearest
  // scrollable ancestor (<body>, overflow:hidden in Atlas) to the card before any script ran. In Atlas a plain click
  // routes as #…&p=<id> instead (no fragment, no native scroll); a modified click (new tab, …) keeps the link.
  on(d, 'click', e => {
    if (!atlas() || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('li.pl a[href^="#p-"]'), m = a && /^#p-(.+)$/.exec(a.getAttribute('href') || ''); if (!m) return;
    e.preventDefault(); const r = route(); delete r.pg; delete r.all; try { r.p = decodeURIComponent(m[1]); } catch (x) { return; }
    location.hash = Cleo.route.href(r);
  });
  // ...and whatever else asks for it (an old #p- entry in the history, a focus), nothing above the map ever scrolls in
  // desktop Atlas: the page holds still and only the list column scrolls
  d.addEventListener('scroll', e => {
    if (!atlas() || !desktop()) return;
    const t = e.target === d ? d.scrollingElement : e.target, map = $('#cleo-map');
    if (t && t.scrollTop && map && t !== lp() && t.contains && t.contains(map)) t.scrollTop = 0;
  }, { capture: true, passive: true });
  on(d, 'keydown', e => { if (e.key === 'Enter') mark(e); }, true);

  /* ---- the open place in the part of the map the detail doesn't cover ---- */
  const clearRect = () => {   // map-container px: the uncovered map, less the chip row and the carousel (phones) and the detail
    const m = C.map(); if (!m) return null; const mr = m.getContainer().getBoundingClientRect(), o = C.overMap ? C.overMap() : { paddingTopLeft: [0, 0], paddingBottomRight: [0, 0] };
    let r = { l: mr.left + 16, r: mr.right - 16, t: mr.top + o.paddingTopLeft[1], b: mr.bottom - (sheetOpen() ? 16 : o.paddingBottomRight[1]) };
    const sh = $('#cleo-sheet:not([hidden]) .sheet'), s = sh && sh.getBoundingClientRect();
    if (s && s.width && s.right > r.l && s.left < r.r && s.bottom > r.t && s.top < r.b) {
      // the detail covers one side: keep the larger uncovered side (desktop: left of the panel; phones: above the sheet)
      const L = s.left - r.l, R = r.r - s.right, T = s.top - r.t, B = r.b - s.bottom, best = Math.max(L, R, T, B);
      if (best === L) r.r = s.left - 16; else if (best === R) r.l = s.right + 16; else if (best === T) r.b = s.top - 16; else r.t = s.bottom + 16;
    }
    return r.r - r.l > 40 && r.b - r.t > 40 ? { l: r.l - mr.left, r: r.r - mr.left, t: r.t - mr.top, b: r.b - mr.top } : null;
  };
  const markerOf = id => C.markers && C.markers[id];
  C.clearPin = () => {
    const m = C.map(), id = placeId(), k = id && markerOf(id), r = k && clearRect(); if (!r) return;
    const p = m.latLngToContainerPoint(k.getLatLng()), pad = 28;
    if (p.x >= r.l + pad && p.x <= r.r - pad && p.y >= r.t + pad && p.y <= r.b - pad) return;
    C.auto(); m.panBy([Math.round(p.x - (r.l + r.r) / 2), Math.round(p.y - (r.t + r.b) / 2)], { animate: false });
  };
  // city.js onRoute, when a #p= routes: Atlas hosts the detail, so the page never scrolls and the map never flies
  C.placeOpen = (card, k) => {
    if (!atlas()) return false;
    wrap();
    const m = C.map();
    if (open && sheetOpen()) { later(C.clearPin); return true; }     // previous / next inside the detail
    const fresh = !seenNoP || !last;
    open = { snap: fresh ? null : (frozen || last), opener: fresh ? null : opener && opener.pin ? { pin: placeId() } : opener, moved: false };
    frozen = null; opener = null;
    if (fresh) { open.fresh = true; freshPlace(); }
    else later(C.clearPin);   // in-page: only if the place sits under the detail (it opened from the visible map or list, so rarely)
    void k; return true;
  };
  // a fresh #p= load: the page at the top (Atlas never scrolls the document), the URL's view if it has one, else the
  // place at zoom ≥ 15 — once; then out from under the detail. Re-run as the map, this file and the sheet arrive.
  const freshPlace = () => {
    if (!open || !open.fresh || Date.now() - userAt < 1200) return;
    if (window.scrollY) window.scrollTo(0, 0);
    const m = C.map(), k = markerOf(placeId()); if (!m || !k) return;
    if (!open.placed) { open.placed = true; if (!C.atView()) { C.auto(); m.setView(k.getLatLng(), Math.max(m.getZoom(), 15), { animate: false }); } }
    C.clearPin();
  };
  C.freshPlace = () => { [0, 150, 500, 1200].forEach(t => setTimeout(freshPlace, t)); return !!(open && open.fresh); };
  const later = f => setTimeout(f, 0);

  /* ---- closing: everything back as it was ---- */
  let wrapped = false;
  const wrap = () => {
    if (wrapped || !Cleo.sheet) return; wrapped = true;
    const S = Cleo.sheet, close0 = S.close, open0 = S.open;
    S.open = function () { const r = open0.apply(this, arguments); if (open) later(C.clearPin); return r; };
    S.close = function () {
      const was = S.isOpen(), st = open; if (!was || !st) { open = null; return close0.apply(this, arguments); }
      open = null; holdTo = Date.now() + 900; closedAt = Date.now(); const t0 = closedAt, m = C.map(), s = st.snap;
      if (m && s && s.c && (Math.abs(m.getZoom() - s.z) > 1e-9 || m.getCenter().distanceTo(s.c) > 0.01)) { C.auto(); m.setView(s.c, s.z, { animate: false }); }
      const res = close0.apply(this, arguments);
      // the list follows the restored map once the route settles (the route change re-applies the lenses)
      // the restore re-applies while the route settles, but it stops the moment anything else moves the page, the list or
      // the carousel (QA-71: a swipe right after Back was put back; the carousel kept the place just opened)
      let gone = false, put = null;
      // (horizontal only: that is the phone carousel's swipe; the desktop list's own re-centring of the selected card is
      // vertical and programmatic, and is put back like the rest, unless the reader acts — userAt)
      const moved = l => put && l && l.scrollLeft !== put[2];
      const fix = () => {
        const l = lp(); if (gone || userAt > t0 || moved(l)) { gone = true; return; }
        if (s) { if ((window.scrollY || 0) !== s.y) window.scrollTo(0, s.y); if (l && (l.scrollTop !== s.t || l.scrollLeft !== s.x)) { ownScroll = Date.now(); l.scrollTop = s.t; l.scrollLeft = s.x; } }
        put = [window.scrollY || 0, l ? l.scrollTop : 0, l ? l.scrollLeft : 0];
        back(st.opener);
      };
      if (st.moved && C.msArea) setTimeout(() => { if (userAt <= t0) { C.msArea(); fix(); } }, 30);
      fix(); [30, 160, 450, 800].forEach(t => setTimeout(fix, t));
      // the carousel's own "the card in the middle is the selected one" stood still during the hold: once it lifts, let it
      // look again, so a swipe made meanwhile still selects its card (and an untouched carousel keeps the open place)
      setTimeout(() => { const l = lp(); if (l && !C.navScrollHold()) l.dispatchEvent(new Event('scroll')); }, 300);
      return res;
    };
  };
  // focus back on the opener: its pin (when a pin opened the preview), else its card's name link — never <body>
  const back = o => {
    const a = d.activeElement, host = $('#cleo-sheet');
    if (a && a !== d.body && !(host && host.contains(a)) && !(o && o.pin && a.closest && a.closest('li.pl'))) return;
    let el = null;
    if (o && o.pin) el = C.pinOf && C.pinOf(o.pin);
    if (!el) { const li = o && o.card ? d.getElementById(o.card) : o && o.pin ? d.getElementById('p-' + o.pin) : null; el = li && $('.pl-n a', li); }
    if (el && el.focus && el !== a) { if (el.classList.contains('leaflet-marker-icon') && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0'); el.focus({ preventScroll: true }); }
  };

  /* ---- routes and map moves ---- */
  const onRt = () => { if (!hasP()) { seenNoP = true; if (open && !sheetOpen()) open = null; } setTimeout(writeAt, 0); };
  on(window, 'hashchange', onRt); on(d, 'cleo:route', onRt);
  const hook = () => {
    const m = C.map(); if (!m || m._navHooked) return; m._navHooked = 1;

    // a click inside the preview card is not a click on the map (Leaflet would clear the selection and drop its pin)
    const pv = $('#cleo-poi'); if (pv) pv._leaflet_disable_click = true;
    m.on('moveend', () => { if (meView && userAt > meAt + 400) meView = false; if (open) open.moved = true; rec(); writeAt(); });
    // the map's own first fit (and a URL view) settle before the view is written or remembered
    setTimeout(() => { ready = true; if (!hasP() && !last) last = snapNow(); writeAt(); }, 1600);
    if (parseAt() && !atDone && !userAt) C.atView();
    if (open && open.fresh) C.freshPlace();
    setTimeout(() => motion(m), 0);
    setTimeout(() => halo(m), 0);   // after this file has run (motion is defined below)
  };
  // QA-76: until the map's first fit (city core, saved or shared view, area, lens or place) has landed, the map still
  // shows the page's starting centre, and a map-area pass there published "450 places here · Show all 488" for a
  // moment. The pass waits for that first fit (C.autoAt marks it), 1.5 s at most, then runs once. Armed before
  // atlas.js's own set-up pass runs.
  let fitWait = false;
  C.navFitPending = () => fitWait;
  const fitGate = () => { const m = C.map(); if (!m || m._navFit) return; m._navFit = 1; if (C.autoAt && C.autoAt() > 0) return; fitWait = true;
    const done = () => { if (!fitWait) return; fitWait = false; m.off('moveend', onFit); if (C.msArea) C.msArea(); };
    const onFit = () => { if (C.autoAt && C.autoAt() > 0) done(); }; m.on('moveend', onFit); setTimeout(done, 1500); };
  const t0 = C.atlasTools; C.atlasTools = function () { fitGate(); const r = t0 && t0.apply(this, arguments); hook(); return r; };
  if (C.map()) { fitGate(); hook(); }
  if (hasP() && atlas()) { open = { snap: null, opener: null, moved: false, fresh: true }; wrap(); C.freshPlace(); }   // a deep link that routed before this file

  /* ---- keyboard (§5, PANEL-R1 #11): skip links, and the arrow keys between pins ---- */
  // two skip links right after the page's own, to the map and to the results. Focus moves; the hash never changes (a
  // plain #anchor would re-route the page). They show on focus, like the page's own, and only in Atlas (atlas-nav.css).
  const firstCard = () => [].slice.call(d.querySelectorAll('.listpane li.pl:not([hidden]):not(.ms-out) .pl-n a')).filter(a => a.getClientRects().length)[0];
  const skips = () => { const s0 = $('a.skip'); if (!s0 || $('.ms-skip')) return;
    s0.insertAdjacentHTML('afterend', '<a class="skip ms-skip" href="#cleo-map" data-skip="map">' + tt('atl.skip.map', 'Skip to the map') + '</a><a class="skip ms-skip" href="#cleo-grid" data-skip="list">' + tt('atl.skip.list', 'Skip to the results') + '</a>'); };
  skips();
  // i18n D-41: skip links drawn before the catalogue arrived, said again in it
  on(d, 'cleo:locale', () => { const m = $('a.ms-skip[data-skip="map"]'), l = $('a.ms-skip[data-skip="list"]'); if (m) m.textContent = tt('atl.skip.map', 'Skip to the map'); if (l) l.textContent = tt('atl.skip.list', 'Skip to the results'); });
  on(d, 'click', e => { const a = e.target.closest && e.target.closest('a.ms-skip'); if (!a) return; e.preventDefault();
    if (a.getAttribute('data-skip') === 'map') { const m = C.map(), el = m ? m.getContainer() : $('#cleo-map'); if (!el) return; if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0'); el.focus({ preventScroll: true }); }
    else { const l = firstCard(); if (l) l.focus({ preventScroll: true }); if (l && !desktop()) { const li = l.closest('li.pl'), lp0 = lp(); if (li && lp0) lp0.scrollLeft = li.offsetLeft - (lp0.clientWidth - li.offsetWidth) / 2; } } });
  const desktop = () => (C.desk ? C.desk() : innerWidth >= 1024);
  // Tab order follows what you see (§5): in Atlas the map comes before the list in the document as it does on screen
  // (skip links → bar → map → its pins → list). Only the order of the two panes changes, never the layout; other views
  // get the list-first order back.
  const order = () => { const sp = $('.split'), mp = sp && $('.mappane', sp), l = sp && $('.listpane', sp); if (!mp || !l || mp.parentNode !== sp || l.parentNode !== sp) return;
    const mapFirst = !!(mp.compareDocumentPosition(l) & 4);
    if (atlas() && !mapFirst) sp.insertBefore(mp, l); else if (!atlas() && mapFirst) sp.insertBefore(l, mp); };
  order(); if (window.MutationObserver) new MutationObserver(order).observe(H, { attributes: true, attributeFilter: ['data-view'] });
  // a focused pin: → / ↓ the next pin by map priority, ← / ↑ the previous (the focused map itself keeps arrow-pan)
  on(d, 'keydown', e => {
    if (!/^Arrow(Left|Right|Up|Down)$/.test(e.key) || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const m = C.map(), pin = m && e.target.closest && e.target.closest('.leaflet-marker-icon.pp[data-id]'); if (!pin) return;
    const mp = id => { const v = C.mp ? C.mp(id) : undefined; return v === undefined ? 1e9 : v; };
    const els = [].slice.call(m.getPane('markerPane').querySelectorAll('.leaflet-marker-icon.pp[data-id]')).sort((a, b) => mp(a.getAttribute('data-id')) - mp(b.getAttribute('data-id')));
    const i = els.indexOf(pin), j = i + (/Right|Down/.test(e.key) ? 1 : -1); e.preventDefault(); e.stopPropagation();
    if (i >= 0 && j >= 0 && j < els.length) els[j].focus({ preventScroll: true });
  }, true);

  /* ---- near me (§3.4, PANEL-R1 #3): nearest first, a walking time on every card; the location stays in memory ---- */
  const rad = Math.PI / 180, kmTo = (a, b) => { const dl = (b[0] - a[0]) * rad, dn = (b[1] - a[1]) * rad, h = Math.sin(dl / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dn / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); };
  const llOf = c => { const v = (c.getAttribute('data-ll') || '').split(','); return v.length === 2 ? [+v[0], +v[1]] : null; };
  // locate-me (atlas.js) → every place's straight-line distance, the map on the person at zoom ≥ 15 in the uncovered band,
  // and the sort switched to "Nearest to me" (the count line says so); the reading is never stored or sent
  C.onLocate = me => {
    if (!atlas()) return false;
    if (Cleo.defer && Cleo.defer.all) Cleo.defer.all();
    const p0 = [me.lat, me.lng], dist = {}; C.cards.forEach(c => { const ll = llOf(c); if (ll) dist[C.pid(c)] = kmTo(p0, ll); });
    C.dist = dist; meView = true; meAt = Date.now();
    const m = C.map(); if (m) { C.auto(); m.setView(me, Math.max(15, m.getZoom()), { animate: false });
      const o = C.overMap ? C.overMap() : null, dy = o ? (o.paddingTopLeft[1] - o.paddingBottomRight[1]) / 2 : 0; if (Math.abs(dy) >= 1) { C.auto(); m.panBy([0, -Math.round(dy)], { animate: false }); } }
    const r = route(); delete r.p; delete r.pg; delete r.all; r.sort = 'near'; C.msAll = false; C.go(r);
    setTimeout(() => { const l = lp(); if (l) { l.scrollLeft = 0; l.scrollTop = 0; } }, 60);   // the carousel opens on the nearest in-bounds place
    return true;
  };
  // "Nearest to me" in Atlas is one list, nearest first, across areas (the guide's area grouping would put a farther
  // place first): the cards move into one list while it is on, and back to their own areas after
  let nearSec = null;
  const byBase = () => (C.S || {}).sort === 'base' && !!C.baseKm;
  const far = c => { if (byBase()) return C.baseKm(c); const v = C.dist && C.dist[C.pid(c)]; return v == null ? 1e9 : v; };
  const flat = () => {
    const S = C.S || {}, want = atlas() && ((S.sort === 'near' && !!C.dist) || byBase()), pane = lp(); if (!pane) return;
    if (want) {
      if (!nearSec) { nearSec = d.createElement('section'); nearSec.className = 'ms-near'; nearSec.setAttribute('aria-label', tt('city.door.near.t', 'Nearest first')); nearSec.innerHTML = '<ol class="pls"></ol>'; }
      const ol = nearSec.firstChild, s0 = $('section.area', pane);
      if (!nearSec.parentNode) { if (!s0) return; s0.parentNode.insertBefore(nearSec, s0); }
      const all = [].slice.call(pane.querySelectorAll('li.pl'));
      all.forEach(li => { if (!li._home && li.parentNode !== ol) li._home = li.parentNode; });
      const ord = all.slice().sort((x, y) => far(x) - far(y) || (+x.getAttribute('data-n')) - (+y.getAttribute('data-n')));
      if (ord.some((x, i) => ol.children[i] !== x)) ord.forEach(x => ol.appendChild(x));
      (C.sections || []).forEach(s => { s.hidden = !s.querySelector('li.pl:not([hidden]),noscript[data-cleo-defer]'); });
      H.classList.add('ms-near');
    } else if (nearSec && nearSec.parentNode) {
      [].slice.call(nearSec.querySelectorAll('li.pl')).forEach(li => { if (li._home) li._home.appendChild(li); });
      nearSec.parentNode.removeChild(nearSec); H.classList.remove('ms-near');
      Promise.resolve().then(() => C.apply());   // the guide's own order inside each area again
    }
  };
  // the distance on every card, first on its kind line, from THE walking estimate (core.js Cleo.geo.walk: straight-line,
  // 80 m a minute; metres to 10 under 1 km, one decimal above) — its assumption (Cleo.geo.ASSUME) is stated once
  const G = Cleo.geo || null;
  const fmtD = km => G && G.walk ? G.walk(km).text : (Math.round(km * 100) * 10) + ' m · ' + Math.max(1, Math.round(km * 1000 / 80)) + ' min walk';
  const dists = () => {
    const on1 = atlas() && !!C.dist;
    [].slice.call(d.querySelectorAll('.listpane li.pl')).forEach(c => { const k = $('.ms-k', c), sp = $('.ms-d', c), v = on1 && C.dist[C.pid(c)];
      if (v == null || v === false) { if (sp) sp.remove(); return; }
      if (!k) return; const t = fmtD(v) + ' · ';
      if (!sp) { k.insertAdjacentHTML('afterbegin', '<span class="ms-d" title="' + C.esc((G && G.ASSUME ? tt('geo.assume', 'Walk times are straight-line, about 80 m a minute — an estimate, not a route') : tt('atl.walk', 'Walk times are straight-line, about 80 m a minute'))) + '"></span>'); }
      $('.ms-d', c).textContent = t; });
    const head = $('.ms-head'); if (!head) return; let n = $('.ms-near-n', head);
    if (on1 && (C.S || {}).sort === 'near') { if (!n) { n = d.createElement('p'); n.className = 'ms-near-n'; const ref = $('.ms-more', head); head.insertBefore(n, ref ? ref.nextSibling : null); }
      n.textContent = tt('atl.near.note', 'Nearest first, from where you are. {assume}. Your location stays on this device and is gone when you reload.', { assume: tt('geo.assume', 'Walk times are straight-line, about 80 m a minute — an estimate, not a route') }); }
    else if (n) n.remove();
  };
  // phone list mode: the map sits behind the list, so "N places here" keeps the area the reader last saw — the map
  // mode's pads (chip row, peek or carousel), not a bare map; a lens applied from the list (For you, the doors) recounts
  // the same area instead of a larger one (D-46 doors, w2 "the count unchanged")
  { const om = C.overMap; let pad0 = null; const cp = o => ({ paddingTopLeft: o.paddingTopLeft.slice(), paddingBottomRight: o.paddingBottomRight.slice() });
    if (om) C.overMap = () => { const ph = !desktop() && H.classList.contains('atlas-m'), lst = ph && H.classList.contains('ms-list');
      if (lst && pad0) return cp(pad0); const o = om(); if (ph && !lst) pad0 = cp(o); return o; }; }
  // §2.0.7 (designer 3793b1d15, "List: the way back is the switch's Atlas icon"): in phone list mode the switch's Atlas
  // segment, already pressed, goes back to the map — the only way back in landscape (no Map pill there); one history step,
  // as the pill and Escape do, so Back and the round trip stay coherent. Focus stays on the segment.
  on(d, 'click', e => { const b = e.target.closest && e.target.closest('[data-cleo-views] button[data-view="atlas"]');
    if (!b || !atlas() || desktop() || !H.classList.contains('ms-list') || !C.listMode) return; C.listMode(false, true); }, true);
  // OV-00 "Near me once": in Atlas the list head's Near me door takes the map's own reading (the dot, the map on the reader,
  // nearest first, walking times); pressed again it clears, as before (foryou.js C.near)
  on(d, 'click', e => { const b = e.target.closest && e.target.closest('[data-cleo-near]'); if (!b || !atlas() || !C.map() || !C.locate || C.dist) return;
    e.preventDefault(); e.stopPropagation(); if (Cleo.defer && Cleo.defer.all) Cleo.defer.all(); C.locate(b); }, true);
  C.after.unshift(flat); C.after.push(dists); on(d, 'cleo:stamped', () => setTimeout(() => { if (C.dist) { flat(); dists(); } }, 0));

  /* ---- the walking ring from your base (W9-5, with FE-C's Cleo.base): 5, 10 or 15 minutes ---- */
  // With a base set, Atlas offers "Within a walk of <base>: 5 · 10 · 15 min". A choice draws the ring on the map (radius =
  // minutes × 80 m, straight-line, the stated assumption), fits the map to it and lenses the list to the places inside
  // (#…&ring=10, a lens like any other: "Any" or clearing the base lifts it; nothing is removed). Base marker included.
  const RING = [5, 10, 15];
  if (Cleo.route.KEYS) Cleo.route.KEYS.ring = /^(5|10|15)$/;
  const baseLL = () => (Cleo.base && Cleo.base.ll ? Cleo.base.ll() : null);
  const ringMin = () => { const r = +route().ring; return RING.indexOf(r) >= 0 && atlas() && baseLL() ? r : 0; };
  // city.js visible() hook: inside the ring (straight-line minutes from the base ≤ the ring), or no ring at all
  C.ringKeep = c => { const n = ringMin(); if (!n) return true; const o = baseLL(), ll = llOf(c); if (!ll) return true;   // unpinned places stay listed
    const km = G && G.km ? G.km(o, ll) : kmTo(o, ll); return (G && G.walk ? G.walk(km).min : Math.round(km * 1000 / 80)) <= n; };   // the minutes the card prints
  let ringL = null, ringBox = null, lastRing = 0;
  const drawRing = () => {
    const m = C.map(), L = window.L, n = ringMin(), o = baseLL(); if (!m || !L) return;
    if (!ringL) ringL = L.layerGroup().addTo(m); ringL.clearLayers();
    if (o) L.circleMarker(o, { radius: 7, weight: 3, color: tok('--surface', '#fff'), fillColor: tok('--ink', '#1C1917'), fillOpacity: 1, interactive: false, className: 'ms-base' }).addTo(ringL);
    if (n && o) { const c = L.circle(o, { radius: n * 80, weight: 2, dashArray: '6 6', color: tok('--ink', '#1C1917'), fill: true, fillOpacity: 0.04, interactive: false, className: 'ms-ring-c' }).addTo(ringL);
      if (n !== lastRing) { C.auto(); try { m.fitBounds(c.getBounds(), Object.assign(C.overMap ? C.overMap() : {}, { animate: false })); } catch (e) {} } }
    lastRing = n;
  };
  const tok = (v, x) => (getComputedStyle(H).getPropertyValue(v) || '').trim() || x;
  const paintRing = () => {
    const bar = $('.ms-bar .ms-x'), o = baseLL(); let g = $('.ms-ring');
    if (!atlas() || !bar || !o) { if (g) g.remove(); if (ringL) ringL.clearLayers(); lastRing = 0; return; }
    if (!g) { g = d.createElement('div'); g.className = 'ms-ring'; g.setAttribute('role', 'group'); bar.appendChild(g);
      on(g, 'click', e => { const b = e.target.closest('button[data-ring]'); if (!b) return; const r = route(); delete r.p; delete r.pg; delete r.all;
        const v = b.getAttribute('data-ring'); if (v && r.ring !== v) r.ring = v; else delete r.ring; C.go(r); }); }
    const n = ringMin(), nm = Cleo.base.name ? Cleo.base.name() : tt('atl.base.you', 'your base');
    if (n && Cleo.defer && Cleo.defer.all && Cleo.defer.peek && Cleo.defer.peek().length) { Cleo.defer.all(); setTimeout(() => C.apply(), 0); }   // every place is judged, stamped or not
    g.setAttribute('aria-label', tt('atl.ring', 'Walking distance from your base, {name}', { name: nm }));
    g.innerHTML = '<span class="ms-ring-l">' + tt('atl.ring.l', 'Within a walk of {name}', { name: C.esc(nm) }) + '</span>' + RING.map(x => '<button type="button" class="chip" data-ring="' + x + '" aria-pressed="' + (n === x) + '">' + tt('atl.min', '{n} min', { n: x }) + '</button>').join('') +
      (n ? '<button type="button" class="chip" data-ring="" aria-label="' + tt('atl.any.l', 'Any distance') + '">' + tt('atl.any', 'Any') + '</button>' : '') +
      '<span class="vh">' + C.esc((G && G.ASSUME ? tt('geo.assume', 'Walk times are straight-line, about 80 m a minute — an estimate, not a route') : tt('atl.walk', 'Walk times are straight-line, about 80 m a minute'))) + '</span>';
    g.title = G && G.ASSUME ? tt('geo.assume', 'Walk times are straight-line, about 80 m a minute — an estimate, not a route') : '';
    drawRing();
  };
  C.after.push(paintRing); on(d, 'cleo:base', () => setTimeout(() => { if (C.apply) C.apply(); }, 0)); on(d, 'cleo:base-ready', () => setTimeout(() => { if (C.apply) C.apply(); }, 0));

  /* ---- map motion (§3.7, R8 gap 3): two moments started by the reader, each ≤ 300 ms, none under reduced motion ---- */
  // 1. the preview card grows out of its pin (desktop) and fades on close; the phone carousel lifts in when it opens
  // 2. hovering a dot eases it from 7 to 11 px (≤ 8 redraws); the card ↔ pin hover styles are CSS (atlas-nav.css)
  const calm = () => (C.still ? C.still() : !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
  const EASE = 'cubic-bezier(.2,.8,.2,1)', anim = (el, k, ms, f) => { try { const a = el.animate(k, { duration: ms, easing: EASE }); if (f) a.onfinish = a.oncancel = f; return a; } catch (e) { if (f) f(); return null; } };
  let hand = 0; ['pointerdown', 'keydown'].forEach(ev => on(d, ev, () => { hand = Date.now(); }, true));
  const motion = m => {
    const poi = $('#cleo-poi');
    if (poi && window.MutationObserver) new MutationObserver(rs => {
      if (calm() || !atlas() || !desktop()) return;
      const gone = []; rs.forEach(r => [].forEach.call(r.removedNodes || [], n => { if (n.nodeType === 1) gone.push(n); }));
      if (poi.hidden) {   // closed: a 120 ms fade of what it showed, no scale; the ghost takes no clicks and no focus
        if (!gone.length || !poi.parentNode) return;
        const g = d.createElement('div'); g.className = 'ms-ghost'; g.setAttribute('aria-hidden', 'true'); g.setAttribute('inert', '');
        g.style.cssText = 'left:' + poi.style.left + ';top:' + poi.style.top + ';pointer-events:none'; gone.forEach(n => g.appendChild(n));
        poi.parentNode.insertBefore(g, poi.nextSibling); anim(g, [{ opacity: 1 }, { opacity: 0 }], 120, () => g.remove()); setTimeout(() => g.remove(), 400); return;
      }
      if (!poi.firstElementChild || !rs.some(r => r.type === 'childList' && r.addedNodes.length)) return;
      // the pin's point, in the card's own box: the card scales from there
      const sel = $('#cleo-grid li.pl.is-sel'), id = sel ? C.pid(sel) : placeId(), k = id && C.markers[id];
      let o = '50% 100%'; if (k) { const p = m.latLngToContainerPoint(k.getLatLng()), x = parseFloat(poi.style.left) || 0, y = parseFloat(poi.style.top) || 0; o = Math.round(p.x - x) + 'px ' + Math.round(p.y - y) + 'px'; }
      poi.style.transformOrigin = o;
      anim(poi, [{ transform: 'scale(.94)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], 200);
    }).observe(poi, { childList: true, attributes: true, attributeFilter: ['hidden'] });
    // the phone carousel lifts in when the reader opens it (never on load: no autoplay)
    if (window.MutationObserver) { let was = H.classList.contains('ms-car');
      new MutationObserver(() => { const now = H.classList.contains('ms-car'); if (now === was) return; was = now;
        if (!now || calm() || Date.now() - hand > 1200 || !atlas()) return;
        const l = lp(); if (!l) return; const lr = l.getBoundingClientRect();
        [].filter.call(l.querySelectorAll('li.pl'), c => { if (c.hidden || !c.offsetWidth) return false; const r = c.getBoundingClientRect(); return r.right > lr.left && r.left < lr.right; })
          .slice(0, 3).forEach(c => anim(c, [{ transform: 'translateY(12px)', opacity: 0 }, { transform: 'none', opacity: 1 }], 200));
      }).observe(H, { attributes: true, attributeFilter: ['class'] }); }
    // a hovered (or focused) dot grows 7 → 11 px in 120 ms, at most 8 redraws of that one dot; leaving reverses it
    const hot0 = C.hotId; if (!hot0 || hot0._nav) return;
    const grow = (id, up) => { const k = C.markers[id], c = C.byId[id] || (C.stub && C.stub(id)); if (!k || !k.setRadius || !c || !C.dotStyle) return;
      const r0 = C.dotStyle(c).radius || 3.5, r1 = r0 + 2, from = k.getRadius(), to = up ? r1 : r0; cancelAnimationFrame(k._navG);
      if (from === to) return; if (calm()) { k.setRadius(to); return; }
      const t0 = performance.now(); let n = 0;
      const step = t => { const q = Math.min(1, (t - t0) / 120); n++; k.setRadius(q >= 1 || n >= 8 ? to : from + (to - from) * (1 - Math.pow(1 - q, 3))); if (q < 1 && n < 8) k._navG = requestAnimationFrame(step); };
      k._navG = requestAnimationFrame(step); };
    C.hotId = function (id, o) { const r = hot0.apply(this, arguments); if (atlas()) grow(id, !!o); return r; }; C.hotId._nav = 1;
  };

  /* ---- D-43 (designer re-rule): an approximate pin sits on a soft uncertainty halo — "around here" (SPEC-v3 §1.1) ---- */
  // a 20 px disc, --ink at 10 % (light) / 16 % (dark), no stroke, under the dot or the pill's anchor; drawn on its own
  // canvas pane below the dots, only while that place's dot is on the map (lens, ring and disc rules still apply). A pin
  // the data lane upgrades (info.prov no longer 'l…') loses it by itself. The Key's "Approximate pin" swatch is atlas.js's.
  const lowIds = () => { const pv = (C.info && C.info.prov) || {}; return Object.keys(pv).filter(id => String(pv[id]).charAt(0) === 'l'); };
  C.navLow = () => lowIds().some(id => C.markers && C.markers[id]);
  const halo = m => {
    const L = window.L; if (!L || !m.createPane) return; if (!m.getPane('navHalo')) { const pn = m.createPane('navHalo'); pn.style.zIndex = 390; pn.style.pointerEvents = 'none'; }
    const cv = L.canvas({ pane: 'navHalo', padding: 0.2 }), lay = L.layerGroup().addTo(m), H0 = {};
    const ink = () => { const dk = H.getAttribute('data-theme') === 'dark' || (H.getAttribute('data-theme') !== 'light' && !!window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
      return { c: (getComputedStyle(H).getPropertyValue('--ink') || '#1C1917').trim(), o: dk ? 0.16 : 0.1 }; };
    const sync = () => { const k0 = ink(), on0 = {};
      lowIds().forEach(id => { const k = C.markers[id]; if (!k) return;
        if (!k._navHaloW) { k._navHaloW = 1; const st0 = k.setStyle; k.setStyle = function () { const r = st0.apply(this, arguments); soon(); return r; }; }   // a disc or a pin hides / shows the dot: follow it
        if (!k._map) return; const pinned = !!(C.pinOf && C.pinOf(id)); if (!pinned && !(k.options.opacity > 0)) return; on0[id] = 1;
        let h = H0[id]; if (!h) { h = H0[id] = L.circleMarker(k.getLatLng(), { renderer: cv, radius: 10, stroke: false, fillColor: k0.c, fillOpacity: k0.o, interactive: false }); h._navHalo = id; }
        else h.setStyle({ fillColor: k0.c, fillOpacity: k0.o });
        if (!lay.hasLayer(h)) h.addTo(lay); });
      Object.keys(H0).forEach(id => { if (!on0[id] && lay.hasLayer(H0[id])) lay.removeLayer(H0[id]); }); };
    let q = 0; const soon = () => { if (q) return; q = requestAnimationFrame(() => { q = 0; sync(); }); };
    m.on('moveend zoomend', soon); C.after.push(soon); on(d, 'cleo:stamped', soon);
    const f0 = C.feature; if (f0 && !f0._navHalo) { C.feature = function () { const r = f0.apply(this, arguments); soon(); return r; }; C.feature._navHalo = 1; }   // pins and density discs re-place: follow them
    if (window.MutationObserver) new MutationObserver(soon).observe(H, { attributes: true, attributeFilter: ['data-theme'] });
    C.navHalos = () => Object.keys(H0).filter(id => lay.hasLayer(H0[id]));   // probes: the places drawn with a halo now
    soon(); };

  /* ---- the share toast says what the link opens (§3.5) ---- */
  const share0 = Cleo.share;
  if (share0) Cleo.share = function (title, url) {
    if (!atlas() || navigator.share || !navigator.clipboard) return share0.apply(this, arguments);
    // a link from this page carries the map view it was shared from (the detail's link is built before the view is known)
    const m = C.map(), own = String(url).split('#')[0] === location.href.split('#')[0];
    if (m && own && ready && !/(?:^|[#&])at=/.test(url)) { url = String(url); url += (url.indexOf('#') < 0 ? '#' : /#$/.test(url) ? '' : '&') + 'at=' + encodeURIComponent(fmt(m)); }
    const h = (String(url).split('#')[1] || ''), p = /(?:^|&)p=([^&]+)/.exec(h), at0 = /(?:^|&)at=/.test(h);
    const c = p && C.byId[decodeURIComponent(p[1])], what = c ? (at0 ? tt('atl.copied.on', 'Link copied · opens {name} on this map view', { name: C.name(c) }) : tt('atl.copied.name', 'Link copied · opens {name}', { name: C.name(c) })) : at0 ? tt('atl.copied.view', 'Link copied · opens this map view') : tt('atl.copied.page', 'Link copied · opens this page');
    try { return navigator.clipboard.writeText(url).then(() => { if (Cleo.emit) Cleo.emit('cleo:toast', what); }, () => share0.call(this, title, url)); } catch (e) { return share0.apply(this, arguments); }
  };
})();
