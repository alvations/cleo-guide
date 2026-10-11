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
 *   C.navHold() → true while a detail is open or being closed (atlas.js moveend / carousel scroll stand still)
 *   C.navKeep() → true while only the open place changed (atlas.js: the route's list refresh stands still)
 *   C.freshPlace() → true when a fresh #p= load is being placed (city.js mountMap then doesn't fly)
 *   C.clearPin() → pan the open place out from under the detail, by the minimum needed */
(() => {
  'use strict';
  const Cleo = window.Cleo || {}, C = Cleo.city, d = document, H = d.documentElement; if (!C || C.placeOpen) return;
  const $ = (s, el) => (el || d).querySelector(s), on = (el, ev, f, o) => el && el.addEventListener(ev, f, o);
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
  const writeAt = () => {
    const m = C.map(); if (!m || !atlas() || !ready || !m.getSize().x || /^#p-/.test(location.hash) || !history.replaceState) return;
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
  C.navKeep = () => atlas() && idleSig !== null && (!!open || hasP() || (Date.now() < holdTo && userAt <= closedAt)) && sig() === idleSig;
  ['pointerdown', 'wheel', 'keydown', 'touchstart'].forEach(ev => on(d, ev, e => { if (!e.isTrusted) return; userAt = Date.now(); }, { capture: true, passive: true }));
  on(window, 'scroll', rec, { passive: true });
  d.addEventListener('scroll', e => { if (e.target === lp()) rec(); }, { capture: true, passive: true });
  // the opener: a card (its name link, cover or photo), the preview (→ whatever opened the preview), or a pin
  const mark = e => {
    const t = e.target; if (!t || !t.closest || !atlas()) return;
    if (t.closest('#cleo-poi a.ms-pv')) { rec(); frozen = last; opener = pvFrom || null; return; }
    if (t.closest('#cleo-poi')) return;
    // the preview only ever opens from the map (a pin, the pill a hovered dot shows, or a dot on the canvas): focus goes
    // back to the open place's pin, which stays labelled while it is selected
    if (t.closest('#cleo-map')) { pvFrom = { pin: 1 }; return; }
    const li = t.closest('li.pl'); if (li && t.closest('a,.pl-cover,.pl-photo') && !t.closest('.pl-x,.ms-cr,figcaption')) { rec(); frozen = last; opener = { card: li.id }; }
  };
  on(d, 'click', mark, true);
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
      const fix = () => {
        if (userAt > t0) return;
        if (s) { if ((window.scrollY || 0) !== s.y) window.scrollTo(0, s.y); const l = lp(); if (l) { if (l.scrollTop !== s.t) l.scrollTop = s.t; if (l.scrollLeft !== s.x) l.scrollLeft = s.x; } }
        back(st.opener);
      };
      if (st.moved && C.msArea) setTimeout(() => { if (userAt <= t0) { C.msArea(); fix(); } }, 30);
      fix(); [30, 160, 450, 800].forEach(t => setTimeout(fix, t));
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
    m.on('moveend', () => { if (open) open.moved = true; rec(); writeAt(); });
    // the map's own first fit (and a URL view) settle before the view is written or remembered
    setTimeout(() => { ready = true; if (!hasP() && !last) last = snapNow(); writeAt(); }, 1600);
    if (parseAt() && !atDone && !userAt) C.atView();
    if (open && open.fresh) C.freshPlace();
  };
  const t0 = C.atlasTools; C.atlasTools = function () { const r = t0 && t0.apply(this, arguments); hook(); return r; };
  if (C.map()) hook();
  if (hasP() && atlas()) { open = { snap: null, opener: null, moved: false, fresh: true }; wrap(); C.freshPlace(); }   // a deep link that routed before this file

  /* ---- the share toast says what the link opens (§3.5) ---- */
  const share0 = Cleo.share;
  if (share0) Cleo.share = function (title, url) {
    if (!atlas() || navigator.share || !navigator.clipboard) return share0.apply(this, arguments);
    // a link from this page carries the map view it was shared from (the detail's link is built before the view is known)
    const m = C.map(), own = String(url).split('#')[0] === location.href.split('#')[0];
    if (m && own && ready && !/(?:^|[#&])at=/.test(url)) { url = String(url); url += (url.indexOf('#') < 0 ? '#' : /#$/.test(url) ? '' : '&') + 'at=' + encodeURIComponent(fmt(m)); }
    const h = (String(url).split('#')[1] || ''), p = /(?:^|&)p=([^&]+)/.exec(h), at0 = /(?:^|&)at=/.test(h);
    const c = p && C.byId[decodeURIComponent(p[1])], what = c ? C.name(c) + (at0 ? ' on this map view' : '') : at0 ? 'this map view' : 'this page';
    try { return navigator.clipboard.writeText(url).then(() => { if (Cleo.emit) Cleo.emit('cleo:toast', 'Link copied · opens ' + what); }, () => share0.call(this, title, url)); } catch (e) { return share0.apply(this, arguments); }
  };
})();
