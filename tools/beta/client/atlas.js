/* atlas.js (Atlas lane, W7 Amendment 2): the map half of Atlas map-search — the real-estate map-search pattern, for
 * travel. Loaded with the map (city.js need('atlas')), so a visitor who never opens the map never pays for it.
 *   · map-area filter: the list shows the places inside the map ("Search as I move the map", desktop, on by default);
 *     phones refresh on "Search this area" after a pan, never live. "N more outside this area · Show all" keeps every
 *     place one tap away; the open place (#p=) and the selected card are never filtered out.
 *   · pin ⇄ card: hover lights both ways (city.js); a pin click selects its card — desktop: the card comes into view in
 *     the list pane (the page never scrolls) and a preview card opens on the map; phones: the carousel brings it in.
 *     Swiping the carousel lights the pin and pans the map gently (not at all under reduced motion).
 *   · clusters: below zoom 15, pins closer than ~72 px gather into a round count bubble (unlike the label pins); a click
 *     zooms in. Day routes never cluster. Nothing is hidden for good: every pin returns as you zoom.
 *   · controls: zoom, locate-me (opt-in, one reading, in memory only — never stored, never sent), Street / Satellite
 *     (OSM + Esri only, never a key-required host) and a minimal legend. */
(() => {
  'use strict';
  const Cleo = window.Cleo || {}, C = Cleo.city, d = document, H = d.documentElement; if (!C || C.atlasTools) return;
  const $ = (s, el) => (el || d).querySelector(s), qa = (s, el) => [].slice.call((el || d).querySelectorAll(s));
  const at = (el, a) => el.getAttribute(a), on = (el, ev, f) => el && el.addEventListener(ev, f);
  const S = C.S, store = Cleo.store || { get: (k, x) => x, set: () => {} }, lp = $('.listpane'), mp = $('.mappane');
  const pl = n => n.toLocaleString('en-US') + (n === 1 ? ' place' : ' places'), rec = id => C.byId[id] || C.stub(id);
  const llOf = c => { const v = (at(c, 'data-ll') || '').split(','); return v.length === 2 ? [+v[0], +v[1]] : null; };
  const atlas = () => C.view === 'atlas', desk = () => C.desk();

  /* ---- clusters: count bubbles, drawn unlike the label pins ---- */
  const CL_Z = 15, CL_N = 30, CL_PX = 72, inCl = C.inCl;
  let clL = null;
  C.cluster = () => {
    const map = C.map(), L = window.L, markers = C.markers; if (!map || !L) return;
    if (!clL) clL = L.layerGroup().addTo(map);
    clL.clearLayers();
    Object.keys(inCl).forEach(id => { const k = markers[id], c = rec(id); delete inCl[id]; if (k && c && !c.hidden && !map.hasLayer(k)) k.addTo(map); });
    const z = map.getZoom(), vis = Object.keys(markers).filter(id => { const c = rec(id); return c && !c.hidden; });
    if (z >= CL_Z || vis.length <= CL_N || S.day) return;
    const cells = {};
    vis.forEach(id => { const p = map.project(markers[id].getLatLng(), z), k = Math.floor(p.x / CL_PX) + ':' + Math.floor(p.y / CL_PX); (cells[k] = cells[k] || []).push(id); });
    Object.keys(cells).forEach(k => {
      const ids = cells[k]; if (ids.length < 2) return;
      const b = L.latLngBounds(ids.map(id => markers[id].getLatLng()));
      const best = ids.map(rec).sort((x, y) => (+at(x, 'data-t') || 9) - (+at(y, 'data-t') || 9) || C.num(x) - C.num(y))[0];
      const sz = ids.length < 10 ? 36 : ids.length < 50 ? 42 : 48;
      const m = L.marker(b.getCenter(), { icon: L.divIcon({ className: 'pin-cl', html: '<span>' + ids.length + '</span>', iconSize: [sz, sz] }),
        title: pl(ids.length) + ' here — zoom in', alt: pl(ids.length), keyboard: false, riseOnHover: true, zIndexOffset: 500 }).addTo(clL);
      m.on('click', () => {
        C.auto(); map.flyToBounds(b, Object.assign(C.overMap(), { maxZoom: CL_Z + 1, duration: C.still() ? 0 : 0.5, animate: !C.still() }));
        if (desk()) { const id = C.pid(best), r = C.byId[id] || (Cleo.defer && Cleo.defer.stampFor(id)); if (r) setTimeout(() => select(r, 'cluster'), C.still() ? 0 : 560); }
      });
      ids.forEach(id => { inCl[id] = m; if (map.hasLayer(markers[id])) map.removeLayer(markers[id]); });
    });
  };

  /* ---- the map-area filter ---- */
  const box = () => {   // the uncovered part of the map (phones: between the chip row and the carousel), as lat/lng bounds
    const map = C.map(), sz = map.getSize(), o = C.overMap(), L = window.L;
    const tl = L.point(Math.min(sz.x - 1, o.paddingTopLeft[0] - 24), Math.min(sz.y - 1, o.paddingTopLeft[1] - 24)), br = L.point(Math.max(tl.x + 1, sz.x - o.paddingBottomRight[0] + 24), Math.max(tl.y + 1, sz.y - o.paddingBottomRight[1] + 24));
    return L.latLngBounds(map.containerPointToLatLng(tl), map.containerPointToLatLng(br));
  };
  let selC = null;
  // the list pages like listing results: the first 40 places in the area (guide order: area, then rank), "Show 40 more"
  // after them; only the cards on show are stamped, so a city-wide view never builds every card (DOM stays small)
  const PER = 40; let lim = PER, pager = null;
  const msArea = C.msArea = more => {
    const map = C.map();
    // the list always pages by 48 in Atlas (a day route excepted): filtered to the map area while the map is up and
    // "Search as I move" is on; the whole lens when there is no map (or "Show all") — never every card at once
    if (!atlas() || S.day) { qa('li.pl.ms-out').forEach(c => c.classList.remove('ms-out')); H.classList.remove('ms-on'); C.msN = null; if (pager) pager.hidden = true; held(); if (C.msPaint) C.msPaint(); return; }
    const area = !!map && map.getSize().x > 0 && !C.msAll && (!desk() || C.msLive !== false);
    if (more !== true) lim = PER;
    // a place without a verified pin has no "outside": it is always listed (last), so no lens count ever loses it
    const b = area ? box() : null, keep = c => c.classList && (c.classList.contains('is-target') || c === selC), inB = c => { const ll = llOf(c); return !b || !ll || b.contains(ll) || keep(c); };
    // which places make each page: the guide's own order (area, then rank within it — tiers are graded per area), the
    // order the list is shown in; page 1 reuses the cards the page already rendered, so a first fit builds ≤ 1 page
    const ord = {}; C.sections.forEach((s, i) => { ord[at(s, 'data-area')] = i; });
        const all = qa('li.pl').filter(c => !c.hidden).concat(Cleo.defer ? Cleo.defer.peek() : []);
    const inn = all.filter(inB).sort((x, y) => !llOf(x) - !llOf(y) || (S.sort ? 0 : (ord[at(x, 'data-a')] || 0) - (ord[at(y, 'data-a')] || 0) || C.num(x) - C.num(y)));
    // only the cards on show are built: exactly these ids (Cleo.defer.stampIds splits their chunks), never the whole area
    const show = {}, need = new Set(); inn.slice(0, lim).concat(inn.filter(keep)).forEach(c => { show[C.pid(c)] = 1; if (!C.byId[C.pid(c)]) need.add('p-' + C.pid(c)); });   // the selected / open place always shows
    // while the map is still on its way, page what is already built: its own first fit picks the page to build
    if (need.size && Cleo.defer && (map || H.classList.contains('ms-nomap'))) { if (Cleo.defer.stampIds) Cleo.defer.stampIds(need); else need.forEach(id => Cleo.defer.stampFor(id.slice(2))); }
    qa('li.pl').forEach(c => c.classList.toggle('ms-out', !c.hidden && !show[C.pid(c)] && !keep(c)));
    qa('section.area').forEach(s => s.classList.toggle('ms-empty', !s.querySelector('li.pl:not([hidden]):not(.ms-out)')));
    if (!pager && lp) { pager = d.createElement('p'); pager.className = 'ms-pager'; lp.insertBefore(pager, $('#how-we-choose', lp)); on(pager, 'click', e => { if (e.target.closest('button')) { lim += PER; msArea(true); } }); }
    const left = inn.length - lim;
    if (pager) { pager.hidden = left <= 0; pager.innerHTML = left > 0 ? '<button type="button" class="btn btn-ghost">Show ' + Math.min(PER, left) + ' more</button> <span>' + lim.toLocaleString('en-US') + ' of ' + pl(inn.length) + (area ? ' in this area' : '') + '</span>' : ''; }
    deco(); face(); C.msN = area ? [inn.length, all.length - inn.length] : null; H.classList.add('ms-on'); held(); here(false);
    if (C.msPaint) C.msPaint();
  };
  // while the map-area filter is on, Atlas stamps exactly its page (like the Gallery pager): the lazy scroll stamping
  // holds, so scrolling the list never builds hidden cards; "Show all" lifts the hold (D.resume) and stamping goes on
  if (Cleo.defer) { const h0 = Cleo.defer.hold; Cleo.defer.hold = () => !!(h0 && h0()) || (atlas() && H.classList.contains('ms-on')); }
  let wasOn = false; const held = () => { const o = H.classList.contains('ms-on'); if (wasOn && !o && Cleo.defer && Cleo.defer.resume) Cleo.defer.resume(); wasOn = o; };
  C.after.push(() => { if (atlas()) msArea(); });

  /* ---- "Search this area" (phones, after the reader pans or zooms; never live, so the carousel never jumps) ---- */
  let hereB = null;
  const here = o => {
    if (!hereB && o) { hereB = d.createElement('button'); hereB.type = 'button'; hereB.className = 'btn ms-here'; hereB.innerHTML = C.icon('pin') + '<span>Search this area</span>'; mp.appendChild(hereB);
      on(hereB, 'click', () => { C.msAll = false; msArea(); if (lp) lp.scrollLeft = 0; }); }
    if (hereB) hereB.hidden = !o;
  };

  /* ---- selection: pin → card, card (swipe) → pin ---- */
  const pinSel = (c, o) => { const el = C.pinEl(c), m = inCl[C.pid(c)], ce = m && m.getElement && m.getElement(); if (el) el.classList.toggle('sel', o); if (ce) ce.classList.toggle('sel', o);
    const k = C.markers[C.pid(c)]; if (k && k.setZIndexOffset) k.setZIndexOffset(o ? 1200 : at(c, 'data-t') === '1' ? 600 : 0); };
  let quiet = 0;
  const select = C.select = (c, how) => {
    if (!c) return;
    if (selC && selC !== c) { selC.classList.remove('is-sel', 'is-focus'); pinSel(selC, false); }
    const again = selC === c; selC = c; c.classList.add('is-sel', 'is-focus'); pinSel(c, true);
    if (c.classList.contains('ms-out')) msArea(true);
    if (desk()) {
      // the list pane scrolls, the page never does; once more after late stamping above it settles
      const into = sm => { if (!lp || !lp.scrollTo || selC !== c) return; const r = c.getBoundingClientRect(), pr = lp.getBoundingClientRect(), hd = $('.ms-head', lp), top = pr.top + (hd ? hd.offsetHeight : 0);
        if (r.top < top || r.bottom > pr.bottom) lp.scrollTo({ top: lp.scrollTop + r.top - pr.top - (pr.height - r.height) / 2, behavior: sm && !C.still() ? 'smooth' : 'auto' }); };
      into(1); setTimeout(() => into(0), 650);
      if (how === 'pin') preview(c);
      return;
    }
    if (how === 'swipe') {   // the card leads: light its pin and bring it into the uncovered band, gently
      const map = C.map(), k = C.markers[C.pid(c)]; if (!map || !k || again) return;
      quiet = Date.now(); try { map.panInside(k.getLatLng(), Object.assign(C.overMap(), { animate: !C.still(), duration: 0.35 })); } catch (e) {}
      return;
    }
    if (lp && lp.scrollTo && !H.classList.contains('ms-list')) { qSwipe = Date.now(); lp.scrollTo({ left: c.offsetLeft - (lp.clientWidth - c.offsetWidth) / 2, behavior: C.still() ? 'auto' : 'smooth' }); }
  };
  // the carousel: the card nearest the middle after a swipe settles is the selected one
  let st = 0, qSwipe = 0;
  on(lp, 'scroll', () => {
    if (desk() || !atlas() || H.classList.contains('ms-list')) return;
    clearTimeout(st); st = setTimeout(() => {
      const mid = lp.getBoundingClientRect().left + lp.clientWidth / 2;
      const c = qa('li.pl', lp).filter(x => x.offsetWidth && !x.hidden).sort((x, y) => { const a = x.getBoundingClientRect(), b = y.getBoundingClientRect(); return Math.abs(a.left + a.width / 2 - mid) - Math.abs(b.left + b.width / 2 - mid); })[0];
      if (c && c !== selC) select(c, Date.now() - qSwipe < 900 ? 'pinned' : 'swipe');
    }, 140);
  }, { passive: true });

  /* ---- the preview card on the map (desktop): photo or calm cover, name, one line, sources → the place ---- */
  const poi = $('#cleo-poi');
  let pvC = null;
  const closePoi = C.closePoi = () => { if (poi && !poi.hidden) { poi.hidden = true; poi.innerHTML = ''; } pvC = null; };
  const place = () => {
    const map = C.map(); if (!map || !pvC || !poi || poi.hidden) return;
    const k = C.markers[C.pid(pvC)]; if (!k) return;
    const p = map.latLngToContainerPoint(k.getLatLng()), sz = map.getSize(), w = poi.offsetWidth || 300, h = poi.offsetHeight || 240;
    const x = Math.max(12, Math.min(sz.x - w - 12, p.x - w / 2)), y = p.y - h - 22 >= 12 ? p.y - h - 22 : Math.min(sz.y - h - 12, p.y + 22);
    poi.style.left = Math.round(x) + 'px'; poi.style.top = Math.round(Math.max(12, y)) + 'px';
  };
  const preview = c => {
    if (!poi) return; pvC = c;
    const ph = $('.pl-photo img, figure.photo img', c), cov = $('.pl-cover', c), nm = $('.pl-n a', c), w = $('.pl-w', c), s = $('.pl-s', c);
    const r = Cleo.route.parse(); delete r.pg; delete r.all; r.p = C.pid(c);
    const media = ph ? '<img src="' + C.esc(ph.currentSrc || ph.src) + '" alt="" loading="lazy" decoding="async">' : cov ? '<div class="pl-cover" aria-hidden="true">' + cov.innerHTML + '</div>' : '';
    const nmT = nm ? (C.name(c) || nm.textContent) : '';
    poi.innerHTML = '<a class="ms-pv" href="' + C.esc(Cleo.route.href(r)) + '">' + '<span class="ms-pv-m' + (ph ? ' ph' : '') + '">' + media + '</span>' +
      '<span class="ms-pv-b"><span class="ms-pv-e">' + ($('.pl-e', c) ? C.esc($('.pl-e', c).textContent.replace(/\s+/g, ' ').trim()) : '') + '</span>' +
      '<span class="ms-pv-n">' + C.esc(nmT) + '</span>' + (w ? '<span class="ms-pv-w">' + C.esc(w.textContent.trim()) + '</span>' : '') +
      (s ? '<span class="ms-pv-s">' + C.esc(s.textContent.replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim()) + '</span>' : '') + '</span></a>' +
      (ph && $('figcaption', ph.closest('figure') || c) ? '<p class="ms-pv-c">' + $('figcaption', ph.closest('figure')).innerHTML + '</p>' : '') +
      '<button type="button" class="btn btn-icon ms-pv-x" aria-label="Close the preview">' + C.icon('close') + '</button>';
    poi.hidden = false; place();
  };
  C.openPoi = c => preview(c);
  if (poi) {
    on(poi, 'click', e => { if (e.target.closest('.ms-pv-x')) { closePoi(); return; } const a = e.target.closest('a.ms-pv'); if (!a) return;
      e.preventDefault(); const h = at(a, 'href'); closePoi(); location.hash = h; });
    on(poi, 'keydown', e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); const c = pvC; closePoi(); const a = c && $('.pl-n a', c); if (a) a.focus({ preventScroll: true }); } });
  }
  on(d, 'keydown', e => { if (e.key === 'Escape' && poi && !poi.hidden && !(Cleo.sheet && Cleo.sheet.isOpen())) closePoi(); });

  /* ---- the Atlas card face (W7 review): image-first on FE-A's shared li.pl — media on top (credited 500w photo or the
   * calm cover) with the heart, a small rank badge, the Must see sun sticker / Closed; below: the name (2 lines), area ·
   * kind, "Recommended by <first source> +N". Only additions, hidden outside Atlas (atlas.css); the card stays FE-A's. */
  const info = C.info;
  const deco = () => qa('li.pl').forEach(c => {
    if (c.hasAttribute('data-ms')) return; c.setAttribute('data-ms', '');
    const t1 = at(c, 'data-t') === '1', cl = c.hasAttribute('data-closed'), n = at(c, 'data-n'), a = ((info.areas || {})[at(c, 'data-a')] || {}).n || '';
    const inT = ($('.pl-e .in', c) || {}).textContent || '', dish = inT.split(' · ').slice(1).join(' · ').trim();
    const g = (at(c, 'data-g') || '').split(' ').filter(x => x && x !== 'FREE' && x !== 'ICON')[0], kind = dish || (at(c, 'data-k') === 'f' ? 'Eat & drink' : ((info.cats || {})[g] || 'Sight'));
    const ss = (at(c, 'data-src') || '').split(' ').filter(x => x && x !== 'guide'), s0 = ss[0] && ((info.src || {})[ss[0]] || [ss[0]])[0];
    const fig = $('figure.pl-photo', c), cap = fig && $('figcaption', fig), cl0 = cap && [].slice.call(cap.querySelectorAll('a')).pop();
    c.insertAdjacentHTML('afterbegin', '<span class="ms-bd"><b class="ms-rk" aria-hidden="true">' + (t1 && !cl ? '★ ' : '') + C.esc(n) + '</b>' +
      (cl ? '<span class="sticker ms-cl">Closed</span>' : t1 ? '<span class="sticker ms-st">Must see</span>' : '') + '</span>' +
      (cl0 ? '<a class="ms-cr" href="' + C.esc(cl0.href) + '" target="_blank" rel="noopener" title="' + C.esc(cap.textContent.trim()) + '" aria-label="Photo credit: ' + C.esc(cap.textContent.trim()) + '">©</a>' : ''));
    const nm = $('.pl-n', c); if (nm) nm.insertAdjacentHTML('afterend', '<p class="ms-k"><span class="ms-a">' + C.esc(a) + ' · </span>' + C.esc(kind) + '</p>' +
      '<p class="ms-rec">' + (s0 ? 'Recommended by <b>' + C.esc(s0) + '</b>' + (ss.length > 1 ? ' +' + (ss.length - 1) : '') : 'Added by the guide') + '</p>');
    const im = fig && $('img', fig); if (im && !im.hasAttribute('data-sizes0')) im.setAttribute('data-sizes0', im.getAttribute('sizes') || '');
  });
  const undeco = () => { qa('li.pl img[data-sizes0]').forEach(im => { im.setAttribute('sizes', at(im, 'data-sizes0')); im.removeAttribute('data-sizes0'); });
    qa('li.pl[data-ms]').forEach(x => x.removeAttribute('data-ms')); qa('li.pl :is(.ms-bd,.ms-cr,.ms-k,.ms-rec)').forEach(x => x.remove()); };
  on(d, 'cleo:stamped', () => { if (atlas()) { deco(); face(); } });

  /* ---- the Atlas chrome (moved off the eager path): filter bar, results line, List / Map pill ---- */
  const split = $('.split'), tb = $('[data-cleo-toolbar]'), nav = $('[data-cleo-views]'), achips = $('.area-chips');
  let moved = [], bar = null, head = null, tog = null, listOn = false, pushedList = 0;
  const park = (el, host, before) => { if (el && el.parentNode !== host) { moved.push([el, el.parentNode, el.nextSibling]); host.insertBefore(el, before || null); } };
  const unpark = () => moved.splice(0).reverse().forEach(([el, par, nx]) => { if (nx && nx.parentNode === par) par.insertBefore(el, nx); else par.appendChild(el); });
  const SORT = [['', 'Top ranked'], ['src', 'Most sources'], ['az', 'A–Z'], ['near', 'Nearest to me']];
  function build() {
    if (bar || !split) return;
    bar = d.createElement('div'); bar.className = 'ms-bar'; bar.setAttribute('role', 'search'); bar.setAttribute('aria-label', 'Search and filter the map');
    bar.innerHTML = '<div class="ms-x"><button type="button" class="chip ms-must" aria-pressed="false"><i class="tg t1" aria-hidden="true"></i><span>Must see</span></button>' +
      '<button type="button" class="chip ms-mine" aria-pressed="false">' + C.icon('heart') + '<span>Saved</span> <span class="n"></span></button>' +
      '<label class="ms-sort"><span class="vh">Sort places</span><select>' + SORT.map(x => '<option value="' + x[0] + '">' + x[1] + '</option>').join('') + '</select></label></div>';
    split.parentNode.insertBefore(bar, split);
    head = d.createElement('div'); head.className = 'ms-head';
    head.innerHTML = '<p class="ms-nomap-n">Map unavailable right now — every place is listed here.</p><div class="ms-row"><p class="ms-count" aria-live="polite"></p>' +
      '<label class="ms-live"><input type="checkbox"> <span>Search as I move the map</span></label></div><p class="ms-more"></p>';
    if (lp) lp.insertBefore(head, lp.firstChild);
    const lv = $('.ms-live input', head); lv.checked = C.msLive = store.get('msLive', true) !== false;
    on(lv, 'change', () => { C.msLive = lv.checked; store.set('msLive', lv.checked); msArea(); });
    tog = d.createElement('button'); tog.type = 'button'; tog.className = 'btn btn-primary ms-toggle'; split.appendChild(tog);
    on(tog, 'click', () => listMode(!listOn, true));
    on(bar, 'click', e => { const b = e.target.closest('button'); if (!b) return; const r = Cleo.route.parse(); delete r.p; delete r.pg; delete r.all;
      if (b.classList.contains('ms-must')) { if (r.t === '1') delete r.t; else r.t = '1'; C.go(r); }
      else if (b.classList.contains('ms-mine')) { if (r.mine) delete r.mine; else r.mine = '1'; C.go(r); } });
    on($('select', bar), 'change', e => { const v = e.target.value, r = Cleo.route.parse(); delete r.p; if (v) r.sort = v; else delete r.sort; C.go(r);
      if (v === 'near' && !C.dist) C.need('foryou', () => C.near()); });
    on(head, 'click', e => { const b = e.target.closest('[data-ms]'); if (!b) return; C.msAll = at(b, 'data-ms') === 'all'; msArea(); });
  }
  // the results line: "86 places in this map area · Top ranked" + "12 more outside this area. Show all"; without the
  // map it is simply every place in the lens
  const paintMs = C.msPaint = () => {
    if (!head) return;
    const pend = Cleo.defer ? Cleo.defer.peek().length : 0, N = qa('li.pl').filter(c => !c.hidden).length + pend, n = C.msN, onA = !!n && H.classList.contains('ms-on'), all = !!C.msAll && !!C.map();
    const tot = '<span class="ms-sortby" title="Ordered by tier within each area, then by number of named sources">' + (SORT.filter(x => x[0] === (S.sort || ''))[0] || SORT[0])[1] + '</span>';
    $('.ms-count', head).innerHTML = onA ? '<b>' + n[0].toLocaleString('en-US') + '</b> ' + (n[0] === 1 ? 'place' : 'places') + ' in this map area · ' + tot
      : (all ? 'Showing all <b>' : 'All <b>') + N.toLocaleString('en-US') + '</b> ' + (N === 1 ? 'place' : 'places') + ' · ' + tot;
    $('.ms-more', head).innerHTML = onA && n[1] ? n[1].toLocaleString('en-US') + ' more outside this area. <button type="button" class="btn btn-quiet" data-ms="all">Show all ' + (n[0] + n[1]).toLocaleString('en-US') + '</button>'
      : all ? '<button type="button" class="btn btn-quiet" data-ms="area">Only show this map area</button>' : '';
    $('.ms-live', head).hidden = !C.map() || !desk();
    $('.ms-must', bar).setAttribute('aria-pressed', String(S.t === '1')); $('.ms-mine', bar).setAttribute('aria-pressed', String(!!S.mine));
    const sv = Cleo.saved ? Object.keys(Cleo.saved.all()).filter(r => r.slice(0, r.lastIndexOf('/')) === C.key).length : 0; $('.ms-mine .n', bar).textContent = sv || '';
    $('select', bar).value = S.sort || '';
    const k = onA ? n[0] : N;
    tog.innerHTML = listOn ? C.icon('map') + '<span>Map</span>' : C.icon('list') + '<span>List · ' + k.toLocaleString('en-US') + '</span>';
    tog.setAttribute('aria-pressed', String(listOn)); tog.setAttribute('aria-label', listOn ? 'Show the map' : 'Show the list of ' + pl(k));
  };
  C.after.push(paintMs); on(d, 'cleo:stamped', () => { if (atlas()) requestAnimationFrame(paintMs); }); on(d, 'cleo:saved', paintMs);
  // phones: List ⇄ Map. The list is the full-screen image-first list of the places in the map area (Back closes it).
  // FE-A's shared card face, except the carousel; phone thumbs ask for the 500w copy (carousel 120px, list 240px)
  const face = () => { const car = atlas() && !desk() && !listOn; if (lp) lp.classList.toggle('w7-cards', atlas() && !car);
    const s = car ? '120px' : atlas() && !desk() ? '240px' : null;   // phone list: the 500w copy too (budget); desktop: the card default
    qa('li.pl img[data-sizes0]').forEach(im => { const v = s || at(im, 'data-sizes0'); if (at(im, 'sizes') !== v) im.setAttribute('sizes', v); }); };
  const listMode = C.listMode = (o, push) => {
    if (!!o === listOn && !push) return; listOn = !!o && !desk(); H.classList.toggle('ms-list', listOn); face();
    if (listOn && push && !pushedList) { try { history.pushState({ msList: 1 }, '', location.href); pushedList = 1; } catch (e) {} }
    if (!listOn && pushedList && push) { pushedList = 0; try { history.back(); } catch (e) {} }
    if (lp) { lp.scrollTop = 0; lp.scrollLeft = 0; }
    paintMs(); const m = C.map(); if (m) setTimeout(() => { try { m.invalidateSize(); } catch (e) {} }, 60);
  };
  on(window, 'popstate', () => { if (pushedList) { pushedList = 0; if (listOn) listMode(false); } });
  on(d, 'keydown', e => { if (e.key !== 'Escape' || !atlas() || !listOn || (Cleo.sheet && Cleo.sheet.isOpen()) || $('.overlay:not([hidden])')) return; listMode(false, true); });
  C.onNoMap = () => { C.msN = null; if (atlas() && !desk()) listMode(true); msArea(); };
  // a typed search keeps the phone search pill open (it collapses to a 44 px button when empty)
  const fq = $('#cleo-filter'), sq = () => { const s = fq && fq.closest('.spill'); if (s) s.classList.toggle('has-q', !!fq.value); };
  on(fq, 'input', sq);
  C.msIn = () => {
    build(); unpark(); deco(); face(); sq();
    const x = $('.ms-x', bar);
    // phones: the chip row carries FE-A's search pill (in the toolbar) and the switcher last; desktop: area chips in the results head
    if (!desk()) { park(tb, bar, x); park(nav, bar, null); } else { park(tb, bar, x); if (achips) park(achips, head, $('.ms-more', head).nextSibling); }
    if (desk() && listOn) listMode(false);
    if (H.classList.contains('ms-nomap')) C.onNoMap();
    msArea();
  };
  C.msOut = () => { listOn = false; unpark(); undeco(); if (lp) lp.classList.remove('w7-cards'); closePoi(); held(); };

  /* ---- locate-me: opt-in, one reading, memory only ---- */
  let me = null, meL = null;
  const locate = b => {
    const map = C.map(), live = $('#cleo-view-live'), say = t => { if (live) live.textContent = t; b.title = t; };
    if (!map) return;
    if (me) { C.fly(me); return; }
    if (!navigator.geolocation) { say('This browser can’t share a location.'); return; }
    b.classList.add('busy');
    navigator.geolocation.getCurrentPosition(p => {
      const m = C.map(); b.classList.remove('busy'); if (!m) return; me = window.L.latLng(p.coords.latitude, p.coords.longitude); b.setAttribute('aria-pressed', 'true');
      if (!meL) meL = window.L.layerGroup().addTo(m); meL.clearLayers();
      if (p.coords.accuracy) window.L.circle(me, { radius: p.coords.accuracy, className: 'me-acc', weight: 1, interactive: false }).addTo(meL);
      window.L.circleMarker(me, { radius: 7, weight: 2, fillOpacity: 1, interactive: false, className: 'me' }).addTo(meL);
      say('You are here — shown on this device only, never stored, gone when you reload.'); C.fly(me);
    }, err => { b.classList.remove('busy'); say(err && err.code === 1 ? 'Location permission was declined. Nothing was stored.' : 'Couldn’t get your location.'); },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  };

  C.atlasTools = (L, el) => {
    const map = C.map(); if (!map) return;
    const dk = desk();
    const ctl = (pos, mk) => { const X = L.Control.extend({ options: { position: pos }, onAdd: () => { const n = mk(); L.DomEvent.disableClickPropagation(n); L.DomEvent.disableScrollPropagation(n); return n; } }); map.addControl(new X()); };
    const btn = (cls, lbl, html) => { const b = d.createElement('button'); b.type = 'button'; b.className = 'am-ctl ' + cls; b.setAttribute('aria-label', lbl); b.title = lbl; b.innerHTML = html; return b; };
    ctl(dk ? 'topleft' : 'topright', () => { const b = btn('m-locate', 'Show my location on the map (stays on this device)', C.icon('locate')); b.setAttribute('aria-pressed', 'false'); on(b, 'click', () => locate(b)); return b; });
    ctl('topright', () => {
      const s = btn('m-base', '', C.icon('grid') + '<span></span>');
      const lab = () => { const sat = store.get('base', 'street') === 'satellite', n = sat ? 'Satellite' : 'Street'; $('span', s).textContent = sat ? 'Street' : 'Satellite';
        s.setAttribute('aria-label', 'Map style: ' + n + '. Switch to ' + (sat ? 'Street' : 'Satellite')); s.title = 'Map style: ' + n; s.setAttribute('aria-pressed', String(sat)); };
      on(s, 'click', () => { C.setBase(store.get('base', 'street') === 'satellite' ? 'street' : 'satellite'); lab(); }); lab(); return s;
    });
    ctl(dk ? 'bottomleft' : 'topright', () => {
      const g = d.createElement('details'); g.className = 'am-ctl m-legend';
      g.innerHTML = '<summary aria-label="Map key">' + C.icon('info') + '<span>Key</span></summary><ul>' +
        '<li><b class="pp pp-s"><span>12</span></b>Sight · the guide’s number</li><li><b class="pp pp-f"><span>12</span></b>Eat &amp; drink</li>' +
        '<li><b class="pp pp-s pp-1"><span><i>★</i>3</span></b>Must see</li><li><b class="pp pp-s pp-x"><span>9</span></b>Closed, kept for the record</li>' +
        '<li><b class="pin-cl"><span>24</span></b>Nearby places · zoom in</li></ul>';
      return g;
    });
    // map moves → the list follows (desktop, live) / "Search this area" (phones, after the reader moves the map)
    let user = 0, mt = 0;
    map.on('dragstart', () => { user = 1; closePoi(); });
    map.on('zoomstart', () => { if (Date.now() - C.autoAt() > 1500 && Date.now() - quiet > 1500) user = 1; });
    map.on('move zoom', place);
    map.on('click', () => closePoi());
    map.on('moveend', () => {
      const u = user; user = 0; place(); if (!atlas()) return;
      if (desk()) { clearTimeout(mt); mt = setTimeout(msArea, 180); return; }
      if (u) { if (H.classList.contains('ms-on')) here(true); return; }   // the reader moved the map: offer, never jump
      if (Date.now() - quiet < 1200) return;      // the carousel's own gentle pan never reshuffles the carousel
      msArea();
    });
    msArea();
  };
  if (atlas()) C.msIn();
})();
