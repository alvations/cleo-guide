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
  let me = null;   // the reader's location after Near me (memory only, never stored)
  // PERF-08: with selective stamping a lens stamps only the cards it shows; an unstamped stub has no `hidden`, so ask the lens
  const shows = c => (Cleo.lens && Cleo.lens.shows ? Cleo.lens.shows(c) : !c.hidden);
  const lensStubs = () => (Cleo.defer ? Cleo.defer.peek(Cleo.lens && Cleo.lens.current ? { lens: Cleo.lens.current() } : undefined) : []);

  /* ---- SPEC-v3 slice 1: places on a map, not numbers on a grid ----
   * Three levels, chosen per viewport: up to N labelled pins (kind glyph + name; N = 24 desktop / 12 phone) for the best
   * places in view, a quiet canvas dot for every other place (zero DOM nodes), and an unnumbered density disc where dots
   * would blur into a blob (region zoom). No count bubbles and no rank numbers on the map, at any zoom. */
  const css = n => (getComputedStyle(H).getPropertyValue(n) || '').trim();
  const hex = s => { const m = /^#?([0-9a-f]{6})$/i.exec((s || '').trim()); return m ? [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16)) : null; };
  const mix = (a, b, t) => { const x = hex(a), y = hex(b); return x && y ? '#' + x.map((v, i) => Math.round(v * t + y[i] * (1 - t)).toString(16).padStart(2, '0')).join('') : (a || b); };
  let tok = {};
  const readTok = () => { tok = { surface: css('--surface') || '#fff', paper: css('--paper') || '#F9F7F3', mute: css('--area-mute') || '#948B83', ink3: css('--ink-3') || '#68615B', sand: css('--sand') || '#F1EDE7', line: css('--line') || '#E7E2DB', sun: css('--sun') || '#E9A93B', onSun: css('--on-sun-wash') || '#5A3D0C', ink: css('--ink') || '#1C1917' }; };
  readTok();
  const areaC = c => mix(((C.info.areas || {})[at(c, 'data-a')] || {}).c || tok.mute, tok.mute, 0.5);
  const isT1 = c => at(c, 'data-t') === '1' && !c.hasAttribute('data-closed');
  // dots (SPEC-v3 §1.1, refined): ONE quiet neutral — ink at 38 % for sights, 62 % for eat & drink (mixed into the page
  // ground so the canvas needs no alpha), hollow when closed, a thin surface halo. Area colour only under an area filter.
  // Kind by shape (SPEC-v3 §1.1 rev 5): a sight is a light 7 px circle (--ink at 30 %), eat & drink a dark 8 px square
  // (--ink at 72 %; dark mode 30 % / 50 %), both with a 1.5 px surface halo. No tier colour on dots: must-sees are a
  // third of the places, so sun dots read as confetti. A closed dot is hollow with a diagonal slash. Area colour only
  // under an area filter.
  const darkOn = () => { const t = H.getAttribute('data-theme'); return t === 'dark' || (t !== 'light' && !!window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); };
  C.dotStyle = c => { const cl = c.hasAttribute('data-closed'), f = at(c, 'data-k') === 'f', dk = darkOn();
    const a = S.a ? areaC(c) : mix(tok.ink, tok.paper, f ? (dk ? 0.5 : 0.72) : 0.3);
    return { radius: f ? 4 : 3.5, shape: f ? 'sq' : '', slash: cl, weight: 1.5, color: cl ? a : tok.surface, opacity: 1, fillColor: a, fillOpacity: cl ? 0 : 1 }; };
  let lastA = S.a;   // an area filter turns its area colour on for the dots (and off again)
  C.after.push(() => { if (S.a !== lastA) { lastA = S.a; restyle(); } });
  const restyle = () => { readTok(); Object.keys(C.markers).forEach(id => { const c = rec(id); if (c) C.markers[id].setStyle(C.dotStyle(c)); }); if (C.feature) C.feature(); };
  if (window.matchMedia) { const mq = matchMedia('(prefers-color-scheme: dark)'); const f = () => setTimeout(restyle, 0); if (mq.addEventListener) mq.addEventListener('change', f); else if (mq.addListener) mq.addListener(f); }
  if (window.MutationObserver) new MutationObserver(() => setTimeout(restyle, 0)).observe(H, { attributes: true, attributeFilter: ['data-theme'] });

  // map priority (SPEC-v3 §1.3): tier ↑, then each area's own order (round-robin across areas: every area's best Must
  // see before any area's second), sources ↓, rank ↑ — computed here from the cards' attributes (stubs included)
  const MP = {}, NAME = {};
  (() => {
    const all = C.cards.concat(Cleo.defer ? Cleo.defer.peek() : []), ord = {}; C.sections.forEach((s, i) => { ord[at(s, 'data-area')] = i; });
    const tier = c => c.hasAttribute('data-closed') ? 4 : +at(c, 'data-t') || 3, ns = c => (at(c, 'data-src') || '').split(' ').filter(x => x && x !== 'guide').length;
    const by = {}; all.forEach(c => { const k = at(c, 'data-a') + '|' + tier(c); (by[k] = by[k] || []).push(c); });
    const ix = {}; Object.keys(by).forEach(k => by[k].sort((x, y) => ns(y) - ns(x) || C.num(x) - C.num(y)).forEach((c, i) => { ix[C.pid(c)] = i; }));
    all.slice().sort((x, y) => tier(x) - tier(y) || ix[C.pid(x)] - ix[C.pid(y)] || ns(y) - ns(x) || C.num(x) - C.num(y) || (ord[at(x, 'data-a')] || 0) - (ord[at(y, 'data-a')] || 0))
      .forEach((c, i) => { MP[C.pid(c)] = i; });
    // names: the stamped card's title; still-deferred places from their chunk's raw markup (no stamping)
    C.cards.forEach(c => { NAME[C.pid(c)] = C.name(c); });
    qa('noscript[data-cleo-defer]').forEach(ns0 => { const re = /<li\b[^>]*\bid="p-([^"]+)"[\s\S]*?<h3 class="pl-n"><a[^>]*>([\s\S]*?)<\/a>/g; let m;
      while ((m = re.exec(ns0.textContent))) if (!NAME[m[1]]) NAME[m[1]] = m[2].replace(/<span class="nat"[\s\S]*?<\/span>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim(); });
  })();
  C.mp = id => MP[id];
  const nameOf = id => { const c = C.byId[id]; return (c && C.name(c)) || NAME[id] || ''; };

  const pins = {}; let hoverPin = null, discL = null, hoverId = null;
  const savedSet = () => { const s = Cleo.saved ? Cleo.saved.all() : {}, o = {}; Object.keys(s).forEach(r => { const i = r.lastIndexOf('/'); if (r.slice(0, i) === C.key) o[r.slice(i + 1)] = 1; }); return o; };
  // one glyph, the kind: a sight's own glyph; eat & drink is the fork-and-knife (the cup for cafés)
  const glyph = c => { const g = at(c, 'data-mg') || at(c, 'data-gl') || ''; if (at(c, 'data-k') !== 'f') return g || 'pin'; return g === 'cup' ? 'cup' : d.getElementById('i-forkknife') ? 'forkknife' : 'bowl'; };
  // the short map name: up to the first ", " / " — " / " – ", parentheses dropped — never truncated (a pill that won't fit stays a dot)
  const short = nm => nm.replace(/\s*\([^)]*\)/g, '').split(/, | — | – /)[0].trim() || nm;
  const pinHtml = (c, nm, sv) => { const cl = c.hasAttribute('data-closed');
    return '<span><svg class="ico" aria-hidden="true"><use href="#i-' + C.esc(glyph(c)) + '"/></svg>' +
      '<b>' + C.esc(short(nm)) + (cl ? ' · Closed' : '') + '</b>' + (sv ? '<em class="pp-h" aria-hidden="true">♥</em>' : '') + '</span>'; };
  const pinCls = (c, sv) => 'pp pp-' + (at(c, 'data-k') === 'f' ? 'f' : 's') + (isT1(c) ? ' pp-1' : '') + (c.hasAttribute('data-closed') ? ' pp-x' : '') + (sv ? ' pp-sv' : '');
  // the pin's accessible name (SPEC-v3 §1.2): full name, kind, [Must see], [Closed], [saved] — the kind never by colour alone
  const pinLabel = (c, nm, sv) => [nm, at(c, 'data-k') === 'f' ? 'eat and drink' : 'sight', isT1(c) && !c.hasAttribute('data-closed') && 'Must see', c.hasAttribute('data-closed') && 'Closed', sv && 'saved'].filter(Boolean).join(', ');
  // each featured pin IS a link to its place (<a href="#…p=id">): one Tab stop, the marker element itself (keyboard: true)
  let PinIcon = null;
  const pinIcon = o => { const L = window.L; if (!PinIcon) PinIcon = L.DivIcon.extend({ createIcon: function () { const a = d.createElement('a'); a.href = this.options.href; a.innerHTML = this.options.html; this._setIconStyles(a, 'icon');
      a.setAttribute('aria-label', this.options.label); a.setAttribute('data-kind', this.options.kind); return a; } }); return new PinIcon(o); };
  const mkPin = (id, c, sv) => { const L = window.L, nm = nameOf(id), lab = pinLabel(c, nm, sv),
      k = L.marker(C.markers[id].getLatLng(), { icon: pinIcon({ className: pinCls(c, sv), iconSize: null, html: pinHtml(c, nm, sv), href: '#view=atlas&p=' + id, label: lab, kind: at(c, 'data-k') === 'f' ? 'food' : 'sight' }), keyboard: true, title: nm, alt: lab, zIndexOffset: isT1(c) ? 600 : 0 });
    // a link, not Leaflet's role=button; the click selects in place (the href serves a new tab / a copied link)
    k.on('add', () => { const e = k.getElement(); if (!e) return; e.removeAttribute('role'); if (!e._pv) { e._pv = 1; e.addEventListener('click', ev => { if (!ev.metaKey && !ev.ctrlKey && !ev.shiftKey) ev.preventDefault(); }); } });
    k.on('click', () => { const r = C.cardOf(id); if (r) C.pin(r); });
    k.on('mouseover', () => { const r = C.byId[id]; if (r) r.classList.add('is-hover'); });
    k.on('mouseout', () => { const r = C.byId[id]; if (r) r.classList.remove('is-hover'); });
    return k; };
  // the label box a pill needs, in px (Inter 600 14 px ≈ 8 px a character), for the greedy collision check
  const boxOf = (c, nm) => 48 + short(nm).length * 8 + (c.hasAttribute('data-closed') ? 56 : 0);
  // four anchors, tried in turn before a pill gives way to a dot (SPEC-v3 §1.3): above (with the stem), right, left, below
  const ANCH = ['t', 'r', 'l', 'b'];
  const boxAt = (p, w, a) => a === 't' ? { l: p.x - w / 2 - 2, r: p.x + w / 2 + 2, t: p.y - 41, b: p.y + 2 } : a === 'b' ? { l: p.x - w / 2 - 2, r: p.x + w / 2 + 2, t: p.y + 2, b: p.y + 38 }
    : a === 'r' ? { l: p.x + 2, r: p.x + w + 6, t: p.y - 18, b: p.y + 18 } : { l: p.x - w - 6, r: p.x - 2, t: p.y - 18, b: p.y + 18 };
  let ft = 0;
  C.feature = () => { clearTimeout(ft); ft = setTimeout(feature, 120); };
  const feature = () => {
    const map = C.map(), L = window.L; if (!map || !L || !map.getSize().x) return;
    const N = desk() ? 16 : 8, sv = savedSet(), sel = selC && C.pid(selC), b = atlas() ? box() : map.getBounds(), z = map.getZoom();
    const vis = Object.keys(C.markers).filter(id => { const c = rec(id); return c && shows(c) && C.dots.hasLayer(C.markers[id]); });
    const inV = vis.filter(id => b.contains(C.markers[id].getLatLng()));
    const first = id => (id === sel ? 0 : sv[id] ? 1 : 2);
    const cand = inV.slice().sort((x, y) => first(x) - first(y) || (MP[x] - MP[y]));
    const placed = [], want = {}, anc = {}, order = [], sz = map.getSize(), ob = atlas() ? C.overMap() : null;   // a pill never sits under the chip row or the carousel
    const topL = ob ? ob.paddingTopLeft[1] - 24 : 0, botL = ob ? sz.y - (ob.paddingBottomRight[1] - 24) : sz.y;
    // nor under a map control, the List / Map pill or "Search this area" (rects in map-container px)
    const mr = map.getContainer().getBoundingClientRect(), avoid = [...map.getContainer().querySelectorAll('.leaflet-control')].concat([$('.ms-toggle'), $('.ms-here'), $('#cleo-poi')])
      .filter(e => e && e.offsetWidth && !e.closest('[hidden]')).map(e => { const q = e.getBoundingClientRect(); return { l: q.left - mr.left - 4, r: q.right - mr.left + 4, t: q.top - mr.top - 4, b: q.bottom - mr.top + 4 }; });
    // the reader's location dot is a placed box: no label ever covers it (rev 5, R3 #4)
    if (me) { const q = map.latLngToContainerPoint(me); placed.push({ l: q.x - 11, r: q.x + 11, t: q.y - 11, b: q.y + 11 }); }
    const meN = me ? 1 : 0;
    for (const id of cand) {
      if (placed.length - meN >= N && first(id) === 2) break;
      const c = rec(id); if (c.hasAttribute('data-closed') && first(id) === 2) continue;   // closed: never featured unless saved / selected
      const p = map.latLngToContainerPoint(C.markers[id].getLatLng()), w = boxOf(c, nameOf(id));
      const fits = r => { const hit = q => r.l < q.r && r.r > q.l && r.t < q.b && r.b > q.t; return !(r.t < topL || r.b > botL || r.l < 0 || r.r > sz.x || placed.some(hit) || avoid.some(hit)); };
      let a = ANCH.find(x => fits(boxAt(p, w, x)));
      if (!a) { if (first(id) === 2) continue; a = 't'; }   // saved / selected: always labelled, above
      placed.push(boxAt(p, w, a)); want[id] = 1; anc[id] = a; order.push(id);
    }
    Object.keys(pins).forEach(id => { if (!want[id]) { map.removeLayer(pins[id]); delete pins[id]; } });
    Object.keys(want).forEach(id => { const c = rec(id), cls = pinCls(c, sv[id]);
      if (pins[id] && pins[id]._cls !== cls) { map.removeLayer(pins[id]); delete pins[id]; }
      if (!pins[id]) { pins[id] = mkPin(id, c, sv[id]).addTo(map); pins[id]._cls = cls; const e0 = pins[id].getElement(); if (e0) { e0.setAttribute('data-id', id); e0.setAttribute('data-a', at(c, 'data-a')); } }
      const el = pins[id].getElement(); if (el) { el.classList.toggle('sel', id === sel); el.classList.toggle('hot', id === hoverId); ANCH.forEach(x => el.classList.toggle('pp-a' + x, x !== 't' && anc[id] === x)); } });
    // the estimate placed them; the real pills decide (rev 5, R3 #4: label boxes ≥ 4 px apart, measured, not guessed) — a pill
    // nearer than 4 px to one already kept (or over the location dot) goes back to a dot; the selected and saved ones stay
    { const mr = map.getContainer().getBoundingClientRect(), kept = [];
      if (me) { const q = map.latLngToContainerPoint(me); kept.push({ left: mr.left + q.x - 11, right: mr.left + q.x + 11, top: mr.top + q.y - 11, bottom: mr.top + q.y + 11 }); }
      const near = (a, b) => a.left < b.right + 4 && a.right > b.left - 4 && a.top < b.bottom + 4 && a.bottom > b.top - 4;
      order.forEach(id => { const k = pins[id], e = k && k.getElement(), sp = e && e.firstElementChild; if (!sp) return; const r = sp.getBoundingClientRect(); if (!r.width) return;
        if (first(id) === 2 && kept.some(q => near(r, q))) { map.removeLayer(k); delete pins[id]; return; }
        kept.push(r); }); }
    // density discs (region zoom only): > 12 dots inside a 28 px cell read as one soft, unnumbered disc; a click zooms in
    if (!discL) discL = L.layerGroup().addTo(map); discL.clearLayers(); C.discs = 0;
    vis.forEach(id => { const k = C.markers[id]; if (k.options.opacity === 0) k.setStyle(C.dotStyle(rec(id))); });
    if (z <= 11 && !S.day) {
      const cells = {}; vis.forEach(id => { if (want[id]) return; const p = map.latLngToContainerPoint(C.markers[id].getLatLng()), k = Math.floor(p.x / 28) + ':' + Math.floor(p.y / 28); (cells[k] = cells[k] || []).push(id); });
      Object.keys(cells).forEach(k => { const ids = cells[k]; if (ids.length <= 12) return;
        const bb = L.latLngBounds(ids.map(id => C.markers[id].getLatLng())), r = ids.length < 30 ? 12 : ids.length < 80 ? 16 : 20;
        ids.forEach(id => C.markers[id].setStyle({ opacity: 0, fillOpacity: 0 }));
        L.circleMarker(bb.getCenter(), { renderer: C.canvas, radius: r, weight: 1, color: tok.line, opacity: 1, fillColor: tok.sand, fillOpacity: 0.8, bubblingMouseEvents: false })
          .on('click', () => { C.auto(); map.fitBounds(bb, Object.assign(C.overMap(), { maxZoom: z + 2, animate: !C.still() })); }).addTo(discL).bringToBack(); C.discs++; });
    }
  };
  C.pinOf = id => (pins[id] && pins[id].getElement()) || (hoverPin && hoverPin._id === id && hoverPin.getElement()) || null;
  // hover from the list (or a dot): the pin lights; a dot-only place shows as a labelled pill for the moment
  C.hotId = (id, o) => {
    const map = C.map(); if (!map || !C.markers[id]) return; hoverId = o ? id : (hoverId === id ? null : hoverId);
    if (pins[id]) { const el = pins[id].getElement(); if (el) el.classList.toggle('hot', o); pins[id].setZIndexOffset(o ? 1000 : isT1(rec(id)) ? 600 : 0); return; }
    if (hoverPin) { map.removeLayer(hoverPin); hoverPin = null; }
    if (o) { const c = rec(id); hoverPin = mkPin(id, c, savedSet()[id]).addTo(map); hoverPin._id = id; hoverPin.setZIndexOffset(1000); const el = hoverPin.getElement(); if (el) el.classList.add('hot'); }
  };
  C.hotPin = (c, o) => C.hotId(C.pid(c), o);

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
  // SPEC-v3 §2.4: ONE best-places control — "Top picks", the first N places by map priority (30 desktop / 12 phones), the
  // same set as the default fit; mp round-robins across areas, so it covers the city. Must see stays information (the
  // sun-wash pill, the card sticker, the Tier section in Filters) — never a second bar control
  if (Cleo.route && Cleo.route.KEYS && !Cleo.route.KEYS.top) Cleo.route.KEYS.top = /^1$/;
  const topOn = () => atlas() && !S.day && !!Cleo.route.parse().top;
  const topSet = () => { const o = {}; Object.keys(C.markers).filter(id => { const c = rec(id); return c && shows(c) && !c.hasAttribute('data-closed'); })
    .sort((x, y) => MP[x] - MP[y]).slice(0, desk() ? 30 : 12).forEach(id => { o[id] = 1; }); return o; };
  C.topSet = () => (topOn() ? topSet() : null);
  let topHid = [], topWas = false, topV = null, lastShow = null;
  const topMap = T => { const map = C.map(); if (!map) return;
    topHid.forEach(id => { const k = C.markers[id]; if (k && !C.dots.hasLayer(k)) k.addTo(C.dots); }); topHid = [];
    if (T) Object.keys(C.markers).forEach(id => { const k = C.markers[id]; if (!T[id] && C.dots.hasLayer(k)) { C.dots.removeLayer(k); topHid.push(id); } });
    // on: fit the picks (remembering the reader's view); off: back to that view
    if (!!T !== topWas) { topWas = !!T; C.auto();
      if (T) { topV = [map.getCenter(), map.getZoom()]; const ll = Object.keys(T).map(id => C.markers[id].getLatLng()); if (ll.length) map.fitBounds(window.L.latLngBounds(ll), Object.assign(C.overMap(), { maxZoom: 16, animate: !C.still() })); }
      else if (topV) { map.setView(topV[0], topV[1], { animate: !C.still() }); topV = null; } } };
  // the list's order is the ranking (map priority) — set as each card's CSS order while the sections and lists step aside
  // (display: contents), so the list reads as ONE ranked list with no DOM moves; a chosen sort keeps the guide's order
  const flat = () => { const on = atlas() && !S.sort; qa('li.pl').forEach(c => { const v = on ? String(MP[C.pid(c)] == null ? 99999 : MP[C.pid(c)]) : ''; if (c.style.order !== v) c.style.order = v; }); };
  C.flat = flat;
  const msArea = C.msArea = more => {
    const map = C.map();
    // the list always pages by 48 in Atlas (a day route excepted): filtered to the map area while the map is up and
    // "Search as I move" is on; the whole lens when there is no map (or "Show all") — never every card at once
    // QA-45 (G1): "Show all N in one list" — one tap puts every place in one scrollable list (all stamped, unpaged), as
    // the Gallery pager's "Show all on one page" does; "Only show this map area" / a pan of the map pages it again
    if (!atlas() || S.day || C.msOne) { topMap(null); C.msTop = null; flat(); if (C.msOne && atlas() && Cleo.defer) Cleo.defer.all(); qa('li.pl.ms-out').forEach(c => c.classList.remove('ms-out')); qa('section.area.ms-empty').forEach(s => s.classList.remove('ms-empty')); H.classList.remove('ms-on'); C.msN = null; if (pager) pager.hidden = true; held(); deco(); face(); if (C.msPaint) C.msPaint(); return; }
    const T = topOn() ? topSet() : null; topMap(T);
    const area = !T && !!map && map.getSize().x > 0 && !C.msAll && (!desk() || C.msLive !== false);
    if (more !== true && C.navKeep && C.navKeep()) { if (C.msPaint) C.msPaint(); return; }   // a round-trip keeps the list it left (atlas-nav.js)
    if (area && more !== true && C.navFitPending && C.navFitPending()) { if (C.msPaint) C.msPaint(); return; }   // QA-76: no map-area pass on the pre-fit view (atlas-nav.js)
    if (more !== true) lim = PER;
    // a place without a verified pin has no "outside": it is always listed (last), so no lens count ever loses it
    const b = area ? box() : null, keep = c => c.classList && (c.classList.contains('is-target') || c === selC), inB = c => { if (T) return !!T[C.pid(c)] || keep(c); const ll = llOf(c); return !b || !ll || b.contains(ll) || keep(c); };
    // which places make each page: the guide's own order (area, then rank within it — tiers are graded per area), the
    // order the list is shown in; page 1 reuses the cards the page already rendered, so a first fit builds ≤ 1 page
    const ord = {}; C.sections.forEach((s, i) => { ord[at(s, 'data-area')] = i; });
        const all = qa('li.pl').filter(c => !c.hidden).concat(lensStubs());
    // §2.3: the list follows the bounds, ranked by map priority — not grouped by area (a chosen sort keeps its own order)
    const mpOf = x => (MP[C.pid(x)] == null ? 1e9 : MP[C.pid(x)]);
    const inn = all.filter(inB).sort((x, y) => !llOf(x) - !llOf(y) || (S.sort ? 0 : mpOf(x) - mpOf(y) || (ord[at(x, 'data-a')] || 0) - (ord[at(y, 'data-a')] || 0) || C.num(x) - C.num(y)));
    // only the cards on show are built: exactly these ids (Cleo.defer.stampIds splits their chunks), never the whole area
    const show = {}, need = new Set(); inn.slice(0, lim).concat(inn.filter(keep)).forEach(c => { show[C.pid(c)] = 1; if (!C.byId[C.pid(c)]) need.add('p-' + C.pid(c)); });   // the selected / open place always shows
    // while the map is still on its way, page what is already built: its own first fit picks the page to build
    if (need.size && Cleo.defer && (map || H.classList.contains('ms-nomap'))) { if (Cleo.defer.stampIds) Cleo.defer.stampIds(need); else need.forEach(id => Cleo.defer.stampFor(id.slice(2))); }
    lastShow = show; qa('li.pl').forEach(c => c.classList.toggle('ms-out', !c.hidden && !show[C.pid(c)] && !keep(c)));
    flat();
    qa('section.area').forEach(s => s.classList.toggle('ms-empty', !s.querySelector('li.pl:not([hidden]):not(.ms-out)')));
    // the first map-area pass has picked the page (or there is no map / the reader asked for all): the list can be drawn
    if (area || C.msAll || H.classList.contains('ms-nomap') || !C.loadMap) H.classList.add('ms-ready');
    // the pager keeps the paged views' contract (.g-pager [data-pg="all"] = everything in one list, the G1 probe's one tap)
    if (!pager && lp) { pager = d.createElement('p'); pager.className = 'ms-pager g-pager'; lp.insertBefore(pager, $('#how-we-choose', lp));
      on(pager, 'click', e => { const b = e.target.closest('button'); if (!b) return; if (at(b, 'data-pg') === 'all') { C.msAll = C.msOne = true; msArea(); } else { lim += PER; msArea(true); } }); }
    const left = inn.length - lim;
    if (pager) { pager.hidden = left <= 0; pager.innerHTML = left > 0 ? '<button type="button" class="btn btn-ghost">Show ' + Math.min(PER, left) + ' more</button> <button type="button" class="btn btn-quiet" data-pg="all">Show all ' + inn.length.toLocaleString('en-US') + ' in one list</button> <span>' + lim.toLocaleString('en-US') + ' of ' + pl(inn.length) + (area ? ' in this area' : '') + '</span>' : ''; }
    deco(); face(); C.msN = area ? [inn.length, all.length - inn.length] : null; C.msTop = T ? [inn.length, all.length] : null; H.classList.add('ms-on'); held(); here(false);
    if (C.msPaint) C.msPaint();
  };
  // while the map-area filter is on, Atlas stamps exactly its page (like the Gallery pager): the lazy scroll stamping
  // holds, so scrolling the list never builds hidden cards; "Show all" lifts the hold (D.resume) and stamping goes on
  if (Cleo.defer) { const h0 = Cleo.defer.hold; Cleo.defer.hold = () => !!(h0 && h0()) || (atlas() && H.classList.contains('ms-on')); }
  let wasOn = false; const held = () => { const o = H.classList.contains('ms-on'); if (wasOn && !o && Cleo.defer && Cleo.defer.resume) Cleo.defer.resume(); wasOn = o; };
  // QA-54: a search fits the map to its matches (an exact name off the map is never "0 places in this map area")
  let lastQ = S.q || '';
  C.after.push(() => { if (!atlas()) return; const q = S.q || ''; if (q !== lastQ) { lastQ = q; if (q && C.fitLens && C.map()) { C.msOne = C.msAll = false; C.fitLens(); } } msArea(); });

  /* ---- "Search this area" (phones, after the reader pans or zooms; never live, so the carousel never jumps) ---- */
  let hereB = null;
  const here = o => {
    if (!hereB && o) { hereB = d.createElement('button'); hereB.type = 'button'; hereB.className = 'btn ms-here'; hereB.innerHTML = C.icon('pin') + '<span>Search this area</span>'; mp.appendChild(hereB);
      on(hereB, 'click', () => { C.msAll = C.msOne = false; msArea(); if (lp) lp.scrollLeft = 0; }); }
    if (hereB) hereB.hidden = !o;
  };

  /* ---- selection: pin → card, card (swipe) → pin ---- */
  const pinSel = () => { if (C.feature) C.feature(); };   // the selected place is always a labelled pin (ink) — feature() decides
  let quiet = 0;
  // phones (SPEC-v3 §2.2): the first screen is the map + a 64 px list peek; the carousel appears only after a selection
  // (a pin, a dot, a card, a search result) or Near me, and Escape or a tap on empty map brings the peek back
  // the selected-state carousel is as tall as the tallest card on show needs (wrapped names, sources, credit, the base
  // line) — never clipped (§3.3, QC-17); 196 px is the floor
  const fitCar = () => { if (desk() || !lp || !H.classList.contains('ms-car') || H.classList.contains('ms-list')) { H.style.removeProperty('--car-h'); return; }
    const L = lp.getBoundingClientRect(); let need = 196;
    qa('li.pl', lp).forEach(c => { const r = c.getBoundingClientRect(); if (!r.width || r.right < L.left || r.left > L.right) return;
      // the credit sits inside the display:contents figure, so it is measured too
      let b = r.top; [].forEach.call(c.querySelectorAll(':scope > *, :scope > figure > figcaption'), x => { const q = x.getBoundingClientRect(); if (q.height && getComputedStyle(x).position !== 'absolute') b = Math.max(b, q.bottom); });
      need = Math.max(need, Math.ceil(b - r.top + 12)); });
    need = Math.min(need, Math.round(innerHeight * 0.45)); if (need !== parseInt(H.style.getPropertyValue('--car-h') || '0', 10)) { H.style.setProperty('--car-h', need + 'px'); if (C.feature) C.feature(); } };   // the labels re-place clear of the taller carousel and the controls above it
  C.fitCar = fitCar;
  const car = o => { const was = H.classList.contains('ms-car'); H.classList.toggle('ms-car', !!o && !desk()); if (was !== H.classList.contains('ms-car')) { if (C.msPaint) C.msPaint(); if (C.feature) C.feature(); } requestAnimationFrame(fitCar); [250, 800].forEach(t => setTimeout(fitCar, t)); };   // again once photos and fonts settle
  C.car = car;
  const select = C.select = (c, how) => {
    if (!c) return;
    if (!desk()) car(true);
    if (selC && selC !== c) { selC.classList.remove('is-sel', 'is-focus'); pinSel(selC, false); }
    const again = selC === c; selC = c; c.classList.add('is-sel', 'is-focus'); pinSel(c, true);
    if (c.classList.contains('ms-out')) msArea(true);
    if (desk()) {
      // the list pane scrolls, the page never does; once more after late stamping above it settles
      const into = sm => { if (!lp || !lp.scrollTo || selC !== c) return; const r = c.getBoundingClientRect(), pr = lp.getBoundingClientRect(), hd = $('.ms-head', lp), top = pr.top + (hd ? hd.offsetHeight : 0);
        if (!r.height) return;   // not laid out yet (being stamped): the second pass places it
        const dy = r.top < top ? r.top - top - 12 : r.bottom > pr.bottom ? r.bottom - pr.bottom + 12 : 0;   // nearest edge, only when off-screen (R2 #13)
        if (dy) lp.scrollTo({ top: lp.scrollTop + dy, behavior: sm && !C.still() ? 'smooth' : 'auto' }); };
      into(1); setTimeout(() => into(0), 650);
      if (how === 'pin') preview(c);
      return;
    }
    if (how === 'swipe') {   // the card leads: light its pin and bring it into the uncovered band, gently
      const map = C.map(), k = C.markers[C.pid(c)]; if (!map || !k || again) return;
      quiet = Date.now(); try { map.panInside(k.getLatLng(), Object.assign(C.overMap(), { animate: !C.still(), duration: 0.35 })); } catch (e) {}
      return;
    }
    // a near card glides into place; a far one (more than two widths away) jumps — a long glide is slow and reads as noise
    if (lp && lp.scrollTo && !H.classList.contains('ms-list')) { qSwipe = Date.now(); const x = c.offsetLeft - (lp.clientWidth - c.offsetWidth) / 2;
      lp.scrollTo({ left: x, behavior: C.still() || Math.abs(x - lp.scrollLeft) > 2 * lp.clientWidth ? 'auto' : 'smooth' }); }
    // the carousel now covers the bottom: keep the selected place in the uncovered band (no move when it already is)
    const map = C.map(), k = C.markers[C.pid(c)];
    // (not for a #p= route or under an open detail: atlas-nav.js places those, out from under the sheet)
    if (map && k && how !== 'route' && !H.classList.contains('ms-list') && !(Cleo.sheet && Cleo.sheet.isOpen()) && !(C.navHold && C.navHold())) { quiet = Date.now(); try { map.panInside(k.getLatLng(), Object.assign(C.overMap(), { animate: !C.still(), duration: 0.35 })); } catch (e) {} }
  };
  // the carousel: the card nearest the middle after a swipe settles is the selected one
  let st = 0, qSwipe = 0;
  // while atlas-nav.js restores the carousel (its own restore only, C.navScrollHold), a scroll waits; once the hold ends the
  // card in the middle is read again — a swipe made during the hold still selects, a restore lands back on the same card
  const held2 = () => (C.navScrollHold ? C.navScrollHold() : !!(C.navHold && C.navHold()));
  const swiped = () => {
    if (desk() || !atlas() || H.classList.contains('ms-list')) return;
    if (held2()) { clearTimeout(st); st = setTimeout(swiped, 300); return; }
    clearTimeout(st); st = setTimeout(() => {
      const mid = lp.getBoundingClientRect().left + lp.clientWidth / 2;
      const c = qa('li.pl', lp).filter(x => x.offsetWidth && !x.hidden).sort((x, y) => { const a = x.getBoundingClientRect(), b = y.getBoundingClientRect(); return Math.abs(a.left + a.width / 2 - mid) - Math.abs(b.left + b.width / 2 - mid); })[0];
      if (c && c !== selC) select(c, Date.now() - qSwipe < 900 ? 'pinned' : 'swipe');
      fitCar();
    }, 140);
  };
  on(lp, 'scroll', swiped, { passive: true });

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
    // R2 #8 (SPEC-v3 §2.3): a photo, or NO media block — a text card led by a 40 px glyph chip beside the name
    const media = ph ? '<img src="' + C.esc(ph.currentSrc || ph.src) + '" alt="" loading="lazy" decoding="async">' : '';
    const chip = ph ? '' : '<span class="ms-pv-g" aria-hidden="true"><svg class="ico"><use href="#i-' + C.esc(glyph(c)) + '"/></svg></span>';
    const nmT = nm ? (C.name(c) || nm.textContent) : '';
    poi.innerHTML = '<a class="ms-pv' + (ph ? '' : ' ms-pv-t') + '" href="' + C.esc(Cleo.route.href(r)) + '">' + (ph ? '<span class="ms-pv-m ph">' + media + '</span>' : '') +
      '<span class="ms-pv-b"><span class="ms-pv-e">' + ($('.pl-e', c) ? C.esc($('.pl-e', c).textContent.replace(/\s+/g, ' ').trim()) : '') + '</span>' +
      '<span class="ms-pv-n">' + chip + C.esc(nmT) + '</span>' + (w ? '<span class="ms-pv-w">' + C.esc(w.textContent.trim()) + '</span>' : '') +
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
    const t1 = at(c, 'data-t') === '1', cl = c.hasAttribute('data-closed'), a = ((info.areas || {})[at(c, 'data-a')] || {}).n || '';
    const inT = ($('.pl-e .in', c) || {}).textContent || '', dish = inT.split(' · ').slice(1).join(' · ').trim();
    const g = (at(c, 'data-g') || '').split(' ').filter(x => x && x !== 'FREE' && x !== 'ICON')[0], kind = dish || (at(c, 'data-k') === 'f' ? 'Eat & drink' : ((info.cats || {})[g] || 'Sight'));
    const ss = (at(c, 'data-src') || '').split(' ').filter(x => x && x !== 'guide'), s0 = ss[0];
    const fig = $('figure.pl-photo', c), cap = fig && $('figcaption', fig), cl0 = cap && [].slice.call(cap.querySelectorAll('a')).pop();
    c.insertAdjacentHTML('afterbegin', '<span class="ms-bd">' +
      (cl ? '<span class="sticker ms-cl">Closed</span>' : t1 ? '<span class="sticker ms-st">Must see</span>' : '') + '</span>' +
      (cl0 ? '<a class="ms-cr" href="' + C.esc(cl0.href) + '" target="_blank" rel="noopener" title="' + C.esc(cap.textContent.trim()) + '" aria-label="Photo credit: ' + C.esc(cap.textContent.trim()) + '">©</a>' : ''));
    const nm = $('.pl-n', c); if (nm) nm.insertAdjacentHTML('afterend', '<p class="ms-k"><span class="ms-a">' + C.esc(a) + ' · </span>' + C.esc(kind) + '</p>' +
      '<p class="ms-rec">' + (s0 ? 'Recommended by <b>' + ss.slice(0, 2).map(x => C.esc(((info.src || {})[x] || [x])[0])).join('</b>, <b>') + '</b>' + (ss.length > 2 ? ' +' + (ss.length - 2) + ' more' : '') : 'Added by the guide') + '</p>');
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
    bar.innerHTML = '<div class="ms-x"><button type="button" class="chip ms-top" aria-pressed="false">' + C.icon('star4') + '<span>Top picks</span></button>' +
      '<button type="button" class="chip ms-mine" aria-pressed="false">' + C.icon('heart') + '<span>Saved</span> <span class="n"></span></button>' +
      '<label class="ms-sort"><span class="vh">Sort places</span><select>' + SORT.map(x => '<option value="' + x[0] + '">' + x[1] + '</option>').join('') + '</select></label></div>';
    split.parentNode.insertBefore(bar, split); H.classList.add('ms-built');   // the bar takes the space held for it, in the same frame
    head = d.createElement('div'); head.className = 'ms-head';
    head.innerHTML = '<p class="ms-nomap-n">Map unavailable right now — every place is listed here.</p><div class="ms-row"><p class="ms-count" aria-live="polite"></p>' +
      '<label class="ms-live"><input type="checkbox"> <span>Search as I move the map</span></label></div><p class="ms-more"></p>' +
      // R7-g4 (e): the rail's doors, reachable in desktop Atlas without horizontal scroll (city.js handles them by attribute)
      '<p class="ms-doors"><button type="button" class="btn btn-quiet" data-cleo-foryou aria-haspopup="dialog">' + C.icon('spark') + '<span>For you</span></button>' +
      '<button type="button" class="btn btn-quiet" data-cleo-day="">' + C.icon('route') + '<span>Your day</span></button>' +
      '<button type="button" class="btn btn-quiet" data-cleo-near aria-pressed="false">' + C.icon('locate') + '<span>Near me</span></button></p>';
    if (lp) lp.insertBefore(head, lp.firstChild);
    const lv = $('.ms-live input', head); lv.checked = C.msLive = store.get('msLive', true) !== false;
    on(lv, 'change', () => { C.msLive = lv.checked; store.set('msLive', lv.checked); msArea(); });
    tog = d.createElement('button'); tog.type = 'button'; tog.className = 'btn btn-primary ms-toggle'; split.appendChild(tog);
    on(tog, 'click', () => listMode(!listOn, true));
    on(bar, 'click', e => { const b = e.target.closest('button'); if (!b) return; const r = Cleo.route.parse(); delete r.p; delete r.pg; delete r.all;
      if (b.classList.contains('ms-top')) { if (r.top) delete r.top; else r.top = '1'; C.msOne = C.msAll = false; C.go(r); }
      else if (b.classList.contains('ms-mine')) { if (r.mine) delete r.mine; else r.mine = '1'; C.go(r); } });
    on($('select', bar), 'change', e => { const v = e.target.value, r = Cleo.route.parse(); delete r.p; if (v) r.sort = v; else delete r.sort; C.go(r);
      if (v === 'near' && !C.dist) C.need('foryou', () => C.near()); });
    // QC-05: the empty state's way back — clear the search, or every lens (the view and the map stay)
    on(head, 'click', e => { const x = e.target.closest('[data-ms-clear]'); if (!x) return; const r = Cleo.route.parse(), keep = { view: r.view || 'atlas' };
      if (r.at) keep.at = r.at; const fi = $('#cleo-filter'); if (fi && fi.value) { fi.value = ''; fi.dispatchEvent(new Event('input', { bubbles: true })); sq(); }
      if (at(x, 'data-ms-clear') === 'q') { delete r.q; C.go(r); } else C.go(keep); });
    on(head, 'click', e => { const b = e.target.closest('[data-ms]'); if (!b) return; C.msAll = C.msOne = at(b, 'data-ms') === 'all';
      const r = Cleo.route.parse(); if (C.msOne && r.top) { delete r.top; C.go(r); } else msArea(); });   // "Show all N" = one list (QA-45)
  }
  // the results line: "86 places in this map area · Top ranked" + "12 more outside this area. Show all"; without the
  // map it is simply every place in the lens
  // R7-g4 (d): the open/closed check date on the first phone screen — the EARLIEST check across the guide's places, so
  // "checked 2 Oct" is true of every place (each was checked on or after it)
  let chk0;
  const checked = () => { if (chk0 !== undefined) return chk0; let m = '';
    qa('li.pl[data-checked]').concat(Cleo.defer ? Cleo.defer.peek() : []).forEach(c => { const v = at(c, 'data-checked'); if (v && (!m || v < m)) m = v; });
    const x = /^(\d{4})-(\d{2})-(\d{2})/.exec(m); chk0 = x ? new Date(Date.UTC(+x[1], +x[2] - 1, +x[3])).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }) : ''; return chk0; };
  const paintMs = C.msPaint = () => {
    if (!head) return;
    const pend = lensStubs().length, N = qa('li.pl').filter(c => !c.hidden).length + pend, n = C.msN, onA = !!n && H.classList.contains('ms-on'), all = !!C.msOne || (!!C.msAll && !!C.map());
    const tot = '<span class="ms-sortby" title="Ordered by tier within each area, then by number of named sources">' + (SORT.filter(x => x[0] === (S.sort || ''))[0] || SORT[0])[1] + '</span>';
    const tp = C.msTop, total = (C.info && C.info.total) || 0, lensOn = !!(Cleo.lens && Cleo.lens.on && Cleo.lens.on(Cleo.lens.current()));
    // QC-05: a search (or lens) that matches nothing says so and offers the way back — never a blank map and "0"
    const none = !tp && N === 0 && total > 0;
    if (none) { $('.ms-count', head).innerHTML = S.q ? 'No places match “' + C.esc(S.q) + '”' : 'No places match these filters';
      $('.ms-more', head).innerHTML = (S.q ? '<button type="button" class="btn btn-quiet" data-ms-clear="q">Clear search</button> ' : '') + '<button type="button" class="btn btn-quiet" data-ms-clear="all">Show all ' + total.toLocaleString('en-US') + '</button>'; }
    else $('.ms-count', head).innerHTML = tp ? 'Top <b>' + tp[0].toLocaleString('en-US') + '</b> picks · ' + tot
      : onA ? '<b>' + n[0].toLocaleString('en-US') + '</b> ' + (n[0] === 1 ? 'place' : 'places') + ' here' + (lensOn && total ? ', of all ' + total.toLocaleString('en-US') : '') + ' · ' + tot
      // QC-13: under a lens the line keeps the total — "43 of all 488 places"
      : lensOn && total && N < total ? '<b>' + N.toLocaleString('en-US') + '</b> of all ' + total.toLocaleString('en-US') + ' places · ' + tot
      : (all ? 'Showing all <b>' : 'All <b>') + N.toLocaleString('en-US') + '</b> ' + (N === 1 ? 'place' : 'places') + ' · ' + tot;
    if (!none) $('.ms-more', head).innerHTML = tp ? '<button type="button" class="btn btn-quiet" data-ms="all">Show all ' + tp[1].toLocaleString('en-US') + '</button>'
      : onA && n[1] ? '<button type="button" class="btn btn-quiet" data-ms="all">Show all ' + (n[0] + n[1]).toLocaleString('en-US') + '</button>'
      : all ? '<button type="button" class="btn btn-quiet" data-ms="area">' + (C.map() ? 'Only show this map area' : 'Show 40 at a time') + '</button>' : '';
    $('.ms-live', head).hidden = !C.map() || !desk();
    $('.ms-top', bar).setAttribute('aria-pressed', String(!!C.msTop)); $('.ms-mine', bar).setAttribute('aria-pressed', String(!!S.mine));
    const sv = Cleo.saved ? Object.keys(Cleo.saved.all()).filter(r => r.slice(0, r.lastIndexOf('/')) === C.key).length : 0; $('.ms-mine .n', bar).textContent = sv || '';
    $('select', bar).value = S.sort || '';
    const k = onA ? n[0] : N;
    tog.innerHTML = listOn ? C.icon('map') + '<span>Map</span>' : desk() || H.classList.contains('ms-car') ? C.icon('list') + '<span>List · ' + k.toLocaleString('en-US') + '</span>'
      : none ? '<i class="ms-handle" aria-hidden="true"></i><span>No places match · Show the list</span>'
      : '<i class="ms-handle" aria-hidden="true"></i><span><b>' + k.toLocaleString('en-US') + '</b> ' + (k === 1 ? 'place' : 'places') + ' here' + (checked() ? ' · <span class="ms-chk">checked ' + checked() + '</span>' : '') + ' · Show list</span>';   // the phone peek
    tog.setAttribute('aria-pressed', String(listOn)); tog.setAttribute('aria-label', listOn ? 'Show the map' : 'Show the list of ' + pl(k));
  };
  // cards stamped later (a deep link, a route that builds more) join the page only if it shows them: a kept list stays the list
  C.after.push(paintMs); on(d, 'cleo:stamped', () => { if (!atlas()) return; if (lastShow && H.classList.contains('ms-on')) qa('li.pl:not(.ms-out)').forEach(c => { if (!c.hidden && !lastShow[C.pid(c)] && c !== selC && !c.classList.contains('is-target')) c.classList.add('ms-out'); }); flat(); requestAnimationFrame(() => { paintMs(); fitCar(); }); }); on(d, 'cleo:saved', paintMs);
  // phones: List ⇄ Map. The list is the full-screen image-first list of the places in the map area (Back closes it).
  // FE-A's shared card face, except the carousel; phone thumbs ask for the 500w copy (carousel 120px, list 240px)
  const face = () => { const car = atlas() && !desk() && !listOn; if (lp) lp.classList.toggle('w7-cards', atlas() && !car);
    const s = car ? '120px' : atlas() && !desk() ? '166px' : null;   // 166px: 500w even at 3× (platform W8; 240px × 3 picked 960w)   // phone list: the 500w copy too (budget); desktop: the card default
    qa('li.pl img[data-sizes0]').forEach(im => { const v = s || at(im, 'data-sizes0'); if (at(im, 'sizes') !== v) im.setAttribute('sizes', v); }); };
  const listMode = C.listMode = (o, push) => {
    if (!!o === listOn && !push) return; listOn = !!o && !desk(); H.classList.toggle('ms-list', listOn); face();
    if (listOn && push && !pushedList) { try { history.pushState({ msList: 1 }, '', location.href); pushedList = 1; } catch (e) {} }
    if (!listOn && pushedList && push) { pushedList = 0; try { history.back(); } catch (e) {} }
    if (lp) { lp.scrollTop = 0; lp.scrollLeft = 0; }
    paintMs(); const m = C.map(); if (m) setTimeout(() => { try { m.invalidateSize(); } catch (e) {} }, 60);
  };
  on(window, 'popstate', () => { if (pushedList) { pushedList = 0; if (listOn) listMode(false); } });
  // capture phase: decided before the sheet / tray handle the same Escape, so closing the detail never also drops the carousel
  d.addEventListener('keydown', e => { if (e.key !== 'Escape' || !atlas() || (Cleo.sheet && Cleo.sheet.isOpen()) || $('.overlay:not([hidden])') || $('.m-attr-pop:not([hidden])')) return;
    if (listOn) listMode(false, true); else if (H.classList.contains('ms-car')) { unselect(); car(false); } }, true);
  C.onNoMap = () => { C.msN = null; if (atlas() && !desk()) listMode(true); msArea(); };
  // a typed search keeps the phone search pill open (it collapses to a 44 px button when empty)
  const fq = $('#cleo-filter'), sq = () => { const s = fq && fq.closest('.spill'); if (s) s.classList.toggle('has-q', !!fq.value); };
  on(fq, 'input', sq);
  // a #p= that routed before this file arrived: select it now (selected + labelled on the map, SPEC-v3 §1.4)
  const routeSel = () => { const p = Cleo.route.parse().p, c = p && C.byId[p]; if (c && selC !== c) select(c, 'route'); };
  C.msIn = () => {
    setTimeout(() => H.classList.add('ms-ready'), 3000);   // never hold the list longer than this, map or not
    build(); unpark(); deco(); face(); setTimeout(routeSel, 0); sq();
    const x = $('.ms-x', bar);
    // phones: the chip row carries FE-A's search pill (in the toolbar) and the switcher last; desktop: area chips in the results head
    if (!desk()) { park(tb, bar, x); } else {   // phones: the view switch stays in FE-A's city bar, its own row under the header (QC-09)
      // desktop (SPEC-v3 §2.1): ONE bar — the search pill (in the toolbar), the chips, then the view switch; the notes and
      // the footer go to the end of the list column, since the document does not scroll in Atlas
      const sp = $('[data-cleo-search]'); park(tb, bar, x); if (sp && tb) park(sp, tb, tb.firstChild); const tw = $('.topbar .wrap'); park(nav, tw || bar, tw ? $('.top-actions', tw) : null);   // the view switch: the header's right
      if (achips) park(achips, head, $('.ms-more', head).nextSibling);
      [$('main>.about'), $('body>.method'), $('body>.footer')].forEach(el => park(el, lp, null)); }   // the map-first DOM order (Tab reaches the map before the list) is atlas-nav.js's (FE-2)
    if (desk() && listOn) listMode(false);
    if (H.classList.contains('ms-nomap')) C.onNoMap();
    msArea();
  };
  C.msOut = () => { listOn = false; qa('li.pl').forEach(c => { c.style.order = ''; }); unpark(); undeco(); if (lp) lp.classList.remove('w7-cards'); closePoi(); held(); };

  /* ---- locate-me: opt-in, one reading, memory only ---- */
  let meL = null;   // `me` (the reader's location, memory only) is declared at the top: feature() reads it
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
      say('You are here — shown on this device only, never stored, gone when you reload.'); car(true); if (!(C.onLocate && C.onLocate(me))) C.fly(me);   // atlas-nav.js: nearest first
    }, err => { b.classList.remove('busy'); say(err && err.code === 1 ? 'Location permission was declined. Nothing was stored.' : 'Couldn’t get your location.'); },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  };

  C.atlasTools = (L, el) => {
    const map = C.map(); if (!map) return;
    const dk = desk();
    const ctl = (pos, mk) => { const X = L.Control.extend({ options: { position: pos }, onAdd: () => { const n = mk(); L.DomEvent.disableClickPropagation(n); L.DomEvent.disableScrollPropagation(n); return n; } }); map.addControl(new X()); };
    const btn = (cls, lbl, html) => { const b = d.createElement('button'); b.type = 'button'; b.className = 'am-ctl ' + cls; b.setAttribute('aria-label', lbl); b.title = lbl; b.innerHTML = html; return b; };
    // phones (SPEC-v3 slice 2): the map's own controls sit bottom right above the cards; the OSM credit takes the top left, clear of them
    // the OSM credit on phones (SPEC-v3 §2.2): one line that cannot wrap, bottom LEFT (never a control's corner),
    // "© OpenStreetMap · Esri ⓘ" — the ⓘ opens the full credit with its links, so the licence stays one tap away
    if (!dk && map.attributionControl) { const ac = map.attributionControl, up = ac._update;
      ac.setPosition('bottomleft');
      ac._update = function () { up.call(this); const el = this._container; if (!el) return; const full = el.innerHTML; el.classList.add('m-attr');
        el.innerHTML = '<span class="m-attr-s">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · Esri</span>' +
          '<button type="button" class="m-attr-i" aria-expanded="false" aria-label="Map credits">ⓘ</button><div class="m-attr-pop" role="note" hidden>' + full + '</div>'; };
      ac._update();
      const box = ac.getContainer(), tog = o => { const b = $('.m-attr-i', box), pp = $('.m-attr-pop', box); if (!b || !pp) return; pp.hidden = !o; b.setAttribute('aria-expanded', String(o)); };
      on(box, 'click', e => { if (e.target.closest('.m-attr-i')) tog($('.m-attr-pop', box).hidden); });
      on(d, 'keydown', e => { if (e.key === 'Escape') tog(false); });
      map.on('click dragstart', () => tog(false)); }
    ctl(dk ? 'topleft' : 'bottomright', () => { const b = btn('m-locate', 'Near me: show my location on the map (stays on this device)', C.icon('locate') + (dk ? '' : '<span>Near me</span>')); b.setAttribute('aria-pressed', 'false'); on(b, 'click', () => locate(b)); return b; });
    ctl(dk ? 'topright' : 'bottomright', () => {
      const s = btn('m-base', '', C.icon('grid') + '<span></span>');
      // one button: Map ⇄ Satellite (SPEC-v3 §4; street detail lives in the Key)
      // desktop names the switch's target ("Satellite"); the phone pill names the style on show ("Map" / "Satellite") — SPEC-v3 §2.2
      const lab = () => { const sat = store.get('base', 'map') === 'satellite', n = sat ? 'Satellite' : 'Map'; $('span', s).textContent = dk ? (sat ? 'Map' : 'Satellite') : n;
        s.setAttribute('aria-label', 'Map style: ' + n + '. Switch to ' + (sat ? 'the map' : 'satellite')); s.title = 'Map style: ' + n; s.setAttribute('aria-pressed', String(sat)); };
      on(s, 'click', () => { C.setBase(store.get('base', 'map') === 'satellite' ? 'map' : 'satellite'); lab(); }); lab(); C.after.push(lab); return s;
    });
    // the Key: a map control on desktop; on phones it is never on the map — it is the last section of Filters (SPEC-v3 §2.2)
    const keyBox = () => {
      const g = d.createElement(dk ? 'details' : 'fieldset'); g.className = dk ? 'am-ctl m-legend' : 'ms-key'; if (!dk) g.setAttribute('data-fs', 'key');
      const k = (cls, gl, t) => '<b class="pp ' + cls + '"><span><svg class="ico" aria-hidden="true"><use href="#i-' + gl + '"/></svg><b>' + t + '</b></span></b>';
      const fk = d.getElementById('i-forkknife') ? 'forkknife' : 'bowl';
      const paint = () => { const ar = S.a ? [S.a] : []; g.querySelector('ul').innerHTML = '<li>' + k('pp-s', 'columns', 'Sight') + '</li><li>' + k('pp-f', fk, 'Eat &amp; drink') + '</li>' +
        '<li>' + k('pp-s pp-x', 'columns', 'Closed') + '</li>' +
        '<li class="k"><i class="kd"></i><i class="kd f"></i>More places · zoom in to see their names</li>' +
        ar.map(a => '<li class="k"><i class="kd" style="background:' + areaC({ getAttribute: () => a, hasAttribute: () => false }) + '"></i>' + C.esc(((C.info.areas || {})[a] || {}).n || a) + '</li>').join('') +
        '<li class="k">' + (store.get('base', 'map') === 'street!' ? '<button type="button" class="btn btn-quiet" data-base="map">Back to the calm map</button>' : '<button type="button" class="btn btn-quiet" data-base="street">Show street detail</button>') + '</li>'; };
      g.innerHTML = (dk ? '<summary aria-label="Map key">' + C.icon('info') + '<span>Key</span></summary>' : '<legend>Map key</legend>') + '<ul class="m-legend-l"></ul>'; paint();
      on(g, 'click', e => { const b = e.target.closest('[data-base]'); if (!b) return; C.setBase(at(b, 'data-base')); paint(); });
      C.after.push(paint);
      return g;
    };
    if (dk) ctl('bottomleft', keyBox); else { const sc = $('#cleo-tray .scroll'); if (sc && !$('.ms-key', sc)) sc.appendChild(keyBox()); }
    // map moves → the list follows (desktop, live) / "Search this area" (phones, after the reader moves the map)
    let user = 0, mt = 0;
    map.on('dragstart', () => { user = 1; closePoi(); });
    map.on('zoomstart', () => { if (Date.now() - C.autoAt() > 1500 && Date.now() - quiet > 1500) user = 1; });
    map.on('move zoom', place);
    map.on('click', () => { closePoi(); unselect(); car(false); });   // an empty-map click clears the selection (phones: back to the peek)
    map.on('moveend zoomend', () => C.feature());
    map.on('moveend', () => {
      const u = user; user = 0; place(); if (!atlas() || (C.navHold && C.navHold())) return; keepView();   // a detail is open or closing (atlas-nav.js)
      if (desk()) { clearTimeout(mt); mt = setTimeout(msArea, 180); return; }
      if (u) { if (H.classList.contains('ms-on')) here(true); return; }   // the reader moved the map: offer, never jump
      if (Date.now() - quiet < 1200) return;      // the carousel's own gentle pan never reshuffles the carousel
      msArea();
    });
    msArea(); setTimeout(() => { viewReady = true; }, 1500);   // a #p= / lens / area first fit settles first
  };
  // the default view (SPEC-v3 §1.4): the last Atlas view of this city (sessionStorage, so the detail round-trip and a
  // view switch never reset the map), else the top 30 places by map priority (12 on phones) inside the city core —
  // the circle round the median point holding 60 % of places — less outliers beyond 2.5× the median distance
  const VK = 'cleo:atlas-view:' + C.key;
  let viewReady = false;   // the map's own first set-up never counts as "the last view"
  const keepView = () => { const m = C.map(); if (!m || !atlas() || !viewReady || (C.navPrivate && C.navPrivate())) return; const c = m.getCenter(); try { sessionStorage.setItem(VK, JSON.stringify([+c.lat.toFixed(5), +c.lng.toFixed(5), m.getZoom()])); } catch (e) {} };   // never the view centred on the reader (atlas-nav.js)
  C.fitDefault = () => {
    const m = C.map(), L = window.L; if (!m || !m.getSize().x) return false;
    let v = null; try { v = JSON.parse(sessionStorage.getItem(VK) || 'null'); } catch (e) {}
    setTimeout(() => { viewReady = true; }, 400);
    if (v && v.length === 3) { C.auto(); m.setView([v[0], v[1]], v[2], { animate: false }); return true; }
    const ids = Object.keys(C.markers); if (ids.length < 2) return false;
    const ll = ids.map(id => C.markers[id].getLatLng()), md = a => a.slice().sort((x, y) => x - y)[a.length >> 1], c0 = [md(ll.map(p => p.lat)), md(ll.map(p => p.lng))];
    const dist = p => Math.hypot(p.lat - c0[0], (p.lng - c0[1]) * Math.cos(c0[0] * Math.PI / 180));
    const ds = ids.map(id => dist(C.markers[id].getLatLng())).sort((x, y) => x - y), core = ds[Math.min(ds.length - 1, Math.floor(ds.length * 0.6))];
    const k = ids.filter(id => dist(C.markers[id].getLatLng()) <= core).sort((x, y) => MP[x] - MP[y]).slice(0, desk() ? 30 : 12).map(id => C.markers[id].getLatLng());
    // then drop outliers among those: beyond 2.5× their own median distance from their own median point
    const c1 = [md(k.map(p => p.lat)), md(k.map(p => p.lng))], d1 = p => Math.hypot(p.lat - c1[0], (p.lng - c1[1]) * Math.cos(c1[0] * Math.PI / 180));
    const m1 = md(k.map(d1)) || 1e-6, top = k.filter(p => d1(p) <= 2.5 * m1);
    if (!top.length) return false;
    const o = C.overMap(); o.paddingTopLeft = o.paddingTopLeft.map(x => x + 16); o.paddingBottomRight = o.paddingBottomRight.map(x => x + 16);   // ≈ 48 px
    // centred on the top places' own median point (their busiest spot), not their bounds' middle — so zooming in from the
    // first screen lands among places, not in a gap between neighbourhoods (PANEL-R1 #4, phones; desktop keeps the bounds'
    // middle so its wide map pans between neighbourhoods); the frame may widen by ≤ 1 step
    let bb = L.latLngBounds(top); const sym = L.latLngBounds(top.concat(top.map(p => L.latLng(2 * c1[0] - p.lat, 2 * c1[1] - p.lng))));
    const op = Object.assign({}, o, { maxZoom: 16 }), z0 = m.getBoundsZoom(bb, false, L.point(op.paddingTopLeft).add(op.paddingBottomRight));
    if (!desk() && z0 < 16 && m.getBoundsZoom(sym, false, L.point(op.paddingTopLeft).add(op.paddingBottomRight)) >= z0 - 1) bb = sym;   // a small town already fits at street zoom: leave it
    C.auto(); m.fitBounds(bb, Object.assign(o, { maxZoom: 16, animate: false })); return true;
  };
  const unselect = () => { if (!selC) return; selC.classList.remove('is-sel', 'is-focus'); selC = null; C.feature(); };
  if (atlas()) C.msIn();
})();
