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
  // i18n D-41: interface strings from the catalogue (Cleo.t, head snippet); the English here equals en.json (test-i18n).
  // Values are escaped before they are filled in, so the English output is unchanged.
  const tt = (k, e, v) => Cleo.t ? Cleo.t(k, e, v) : v ? e.replace(/\{([a-z]+)\}/g, (m, x) => x in v ? v[x] : m) : e;
  const pl = n => n === 1 ? tt('srch.place.n1', '1 place') : tt('srch.places.n', '{n} places', { n: n.toLocaleString('en-US') }), rec = id => C.byId[id] || C.stub(id);
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
  // (--ink at 72 %; dark mode 45 % / 80 %), both with a 1.5 px surface halo. No tier colour on dots: must-sees are a
  // third of the places, so sun dots read as confetti. A closed dot is hollow with a diagonal slash. Area colour only
  // under an area filter.
  const darkOn = () => { const t = H.getAttribute('data-theme'); return t === 'dark' || (t !== 'light' && !!window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); };
  C.dotStyle = c => { const cl = c.hasAttribute('data-closed'), f = at(c, 'data-k') === 'f', dk = darkOn();
    const a = S.a ? areaC(c) : mix(tok.ink, tok.paper, f ? (dk ? 0.8 : 0.72) : (dk ? 0.45 : 0.3));   // dark (designer, R4): circle 45 % ≥ 2:1, square 80 % ≥ 4.5:1 on the dark tile
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
      '<b' + (cutNm(nm, cl) !== short(nm) ? ' data-full="' + C.esc(short(nm) + (cl ? ' · ' + tt('sheet.closed', 'Closed') : '')) + '"' : '') + '>' + C.esc(cutNm(nm, cl)) + (cl ? ' · ' + tt('sheet.closed', 'Closed') : '') + '</b>' + (sv ? '<em class="pp-h" aria-hidden="true">♥</em>' : '') + '</span>'; };
  // OV-03: the name itself is cut to the label's cap (a CSS ellipsis would leave the whole name in the layout); the full name
  // is the link's aria-label / title, and shows on hover, focus or selection (atlas.css b[data-full]::after)
  const cutNm = (nm, cl) => { const t = short(nm), mx = Math.max(6, Math.floor((capW() - (desk() ? 48 : 40) - (cl ? 56 : 0)) / (desk() ? 8 : 7))); return t.length <= mx ? t : t.slice(0, mx - 1).trimEnd() + '…'; };
  const pinCls = (c, sv) => 'pp pp-' + (at(c, 'data-k') === 'f' ? 'f' : 's') + (isT1(c) ? ' pp-1' : '') + (c.hasAttribute('data-closed') ? ' pp-x' : '') + (sv ? ' pp-sv' : '');
  // the pin's accessible name (SPEC-v3 §1.2): full name, kind, [Must see], [Closed], [saved] — the kind never by colour alone
  const pinLabel = (c, nm, sv) => [nm, at(c, 'data-k') === 'f' ? tt('atl.pin.f', 'eat and drink') : tt('atl.pin.s', 'sight'), isT1(c) && !c.hasAttribute('data-closed') && tt('tier.1', 'Must see'), c.hasAttribute('data-closed') && tt('sheet.closed', 'Closed'), sv && tt('atl.pin.saved', 'saved')].filter(Boolean).join(', ');
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
  // OV-03 (SPEC-v3 §2.0.4): a label is at most 40 % of the phone map's width (220 px on desktop); longer names end in an
  // ellipsis (the full name stays in the link's aria-label and title, and shows on hover, focus or selection)
  const capW = () => { const m = C.map(); return desk() ? 220 : Math.floor((m ? m.getSize().x : innerWidth) * 0.4) - 1; };
  const boxOf = (c, nm) => Math.min(capW(), (desk() ? 48 : 40) + short(nm).length * (desk() ? 8 : 7) + (c.hasAttribute('data-closed') ? 56 : 0));
  // four anchors, tried in turn before a pill gives way to a dot (SPEC-v3 §1.3): above (with the stem), right, left, below
  const ANCH = ['t', 'r', 'l', 'b'];
  const boxAt = (p, w, a) => a === 't' ? { l: p.x - w / 2 - 2, r: p.x + w / 2 + 2, t: p.y - 41, b: p.y + 2 } : a === 'b' ? { l: p.x - w / 2 - 2, r: p.x + w / 2 + 2, t: p.y + 2, b: p.y + 38 }
    : a === 'r' ? { l: p.x + 2, r: p.x + w + 6, t: p.y - 18, b: p.y + 18 } : { l: p.x - w - 6, r: p.x - 2, t: p.y - 18, b: p.y + 18 };
  let ft = 0;
  C.feature = () => { clearTimeout(ft); ft = setTimeout(feature, 120); };
  // phones: the map runs under FE-A's switch row now (OV-00: nothing resizes when the bars tuck), so the top pad is the
  // lowest VISIBLE top bar — the switch row or the chip row (both off-screen while tucked) — even before the chip row is built
  { const om = C.overMap; C.overMap = () => { const o = om(); if (desk() || !H.classList.contains('atlas-m') || H.classList.contains('ms-list')) return o;
    const mt = $('#cleo-map').getBoundingClientRect().top, lo = Math.max(0, ...['main>.cbar', '.ms-bar'].map(q => { const e = $(q), r = e && e.getBoundingClientRect(); return r && r.height ? r.bottom - mt : 0; }));
    o.paddingTopLeft[1] = Math.max(o.paddingTopLeft[1], 24 + lo); return o; }; }
  const feature = () => {
    const map = C.map(), L = window.L; if (!map || !L || !map.getSize().x) return;
    let N = 8; const sv = savedSet(), sel = selC && C.pid(selC), b = atlas() ? box() : map.getBounds(), z = map.getZoom();
    const vis = Object.keys(C.markers).filter(id => { const c = rec(id); return c && shows(c) && C.dots.hasLayer(C.markers[id]); });
    const inV = vis.filter(id => b.contains(C.markers[id].getLatLng()));
    const first = id => (id === sel ? 0 : sv[id] ? 1 : 2);
    const cand = inV.slice().sort((x, y) => first(x) - first(y) || (MP[x] - MP[y]));
    const placed = [], want = {}, anc = {}, order = [], sz = map.getSize(), ob = atlas() ? C.overMap() : null;   // a pill never sits under the chip row or the carousel
    const topL = ob ? ob.paddingTopLeft[1] - 24 : 0, botL = ob ? sz.y - (ob.paddingBottomRight[1] - 24) : sz.y;
    // OV-03: the label count follows the clear map's area (§2.0.4): phone ÷ 24k px² (3–8, 10 in landscape), tablet ÷ 26k
    // (≤ 12), desktop ÷ 30k (≤ 16); and the union of pills stays within 8 / 7 / 6 % of the map (checked on the real pills)
    { const ar = sz.x * Math.max(0, botL - topL), cl = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.floor(v)));
      N = desk() ? cl(ar / 30000, 3, 16) : innerWidth >= 768 ? cl(ar / 26000, 3, 12) : cl(ar / 24000, 3, innerHeight < 500 ? 10 : 8); }
    map.getContainer().style.setProperty('--pp-max', capW() + 'px');
    // nor under a map control, the List / Map pill or "Search this area" (rects in map-container px)
    const mr = map.getContainer().getBoundingClientRect(), avoid = [...map.getContainer().querySelectorAll('.leaflet-control')].concat([$('.ms-toggle'), $('.ms-here'), $('#cleo-poi'), C.land && C.land() && H.classList.contains('ms-car') ? lp : null])   /* landscape: the carousel docks on the right (FE-2) */
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
      if (!a) { if (first(id) === 2) continue;
        // saved / selected: always labelled — an anchor clear of the map's controls and edges if one exists (other pills
        // give way to it), else above
        const clear = r => !(r.t < topL || r.b > botL || r.l < 0 || r.r > sz.x || avoid.some(q => r.l < q.r && r.r > q.l && r.t < q.b && r.b > q.t));
        a = ANCH.find(x => clear(boxAt(p, w, x))) || 't'; }
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
      let cov = 0; const lim = 0.95 * (desk() ? 0.06 : innerWidth >= 768 ? 0.07 : 0.08) * sz.x * sz.y;   // 5 % under the cap: rounding never tips it   // OV-03 coverage: a pill past it goes back to a dot
      order.forEach(id => { const k = pins[id], e = k && k.getElement(), sp = e && e.firstElementChild; if (!sp) return; const r = sp.getBoundingClientRect(); if (!r.width) return;
        const ha = r.width * r.height;   // the painted pill (the designer's budget: 7 labels at P2 within 8 % only holds for painted pills, not 44 px tap areas)
        if (first(id) === 2 && (kept.some(q => near(r, q)) || cov + ha > lim)) { map.removeLayer(k); delete pins[id]; return; }
        cov += ha; kept.push(r); }); }
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
    if (o) { const c = rec(id); hoverPin = mkPin(id, c, savedSet()[id]).addTo(map); hoverPin._id = id; hoverPin.setZIndexOffset(1000); const el = hoverPin.getElement(); if (el) { el.classList.add('hot'); el.style.pointerEvents = 'none'; el.tabIndex = -1; } }   // QC b1c7939f: the hover pin is drawn, never hit — under the pointer it flickered (canvas mouseout → removed → mouseover → re-added), so a press began on it or was lost and a drag from a dot selected instead of panning; the dot under it takes the press, and Leaflet tells a tap from a drag
  };
  C.hotPin = (c, o) => C.hotId(C.pid(c), o);

  /* ---- the map-area filter ---- */
  // D-46 (Atlas is the default view): the list shows AT ONCE, before the map library arrives. Its first page is the one
  // the map will open on — the same first fit city.js makes, done here in plain Web Mercator (Leaflet's getBoundsZoom /
  // fitBounds at zoomSnap 0.5), so the map mounting later changes nothing in the list: no wait and no shift. Only first
  // views that are pure maths are predicted (no hash, a shared #at= view, the session's last view); a #p= place, an area,
  // a lens link or Top picks hold the list for the first map pass as before (the 3 s JS / 4 s CSS backstops remain)
  const prj = (lat, lng, z) => { const k = 256 * Math.pow(2, z), si = Math.max(-0.9999, Math.min(0.9999, Math.sin(lat * Math.PI / 180))); return [k * (lng + 180) / 360, k * (0.5 - Math.log((1 + si) / (1 - si)) / (4 * Math.PI))]; };
  const unp = (x, y, z) => { const k = 256 * Math.pow(2, z); return [Math.atan(Math.sinh(Math.PI * (1 - 2 * y / k))) * 180 / Math.PI, x / k * 360 - 180]; };
  const fitZ = (ll, o, maxZ, sz) => { const tl = o.paddingTopLeft, br = o.paddingBottomRight;
    const s = Math.min(...ll.map(p => p[0])), n = Math.max(...ll.map(p => p[0])), w = Math.min(...ll.map(p => p[1])), e = Math.max(...ll.map(p => p[1]));
    const a = prj(n, w, 0), b = prj(s, e, 0), sc = Math.min((sz[0] - tl[0] - br[0]) / (b[0] - a[0]), (sz[1] - tl[1] - br[1]) / (b[1] - a[1]));
    let z = Math.log(sc) / Math.LN2; z = Math.round(z / 0.005) * 0.005; z = Math.min(maxZ, Math.max(0, Math.min(19, Math.floor(z / 0.5) * 0.5)));
    const p = prj(s, w, z), q = prj(n, e, z); return unp((p[0] + q[0] + br[0] - tl[0]) / 2, (p[1] + q[1] + br[1] - tl[1]) / 2, z).concat(z); };
  const lls = () => qa('li.pl').concat(Cleo.defer ? Cleo.defer.peek() : []).filter(c => !c.hasAttribute('data-np')).map(c => [C.pid(c), llOf(c), c]).filter(x => x[1]);
  const predict = () => {
    const el = $('#cleo-map'), r = Cleo.route.parse(); if (!el || !el.clientWidth || !el.clientHeight || r.p || r.top || topOn() || S.q || (S.mode && S.mode !== 'all') || (Cleo.lens && Cleo.lens.on && Cleo.lens.on(Cleo.lens.current()))) return null;   // any lens (an area too): the first map pass decides
    const sz = [el.clientWidth, el.clientHeight], at0 = /^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(\d+(?:\.\d+)?)$/.exec(r.at || '');
    if (r.at) return at0 ? { v: [+at0[1], +at0[2], +at0[3]], sz } : null;
    let v = null; try { v = JSON.parse(sessionStorage.getItem(VK) || 'null'); } catch (e) {}
    if (v && v.length === 3) return { v, sz };
    // fitDefault's own steps (below), on the same places: the top 30 (12 on phones) by map priority in the core, less outliers
    const all = lls().map(x => [x[0], x[1]]); if (all.length < 2) return null;
    const md = a => a.slice().sort((x, y) => x - y)[a.length >> 1], c0 = [md(all.map(p => p[1][0])), md(all.map(p => p[1][1]))];
    const dist = (p, c) => Math.hypot(p[0] - c[0], (p[1] - c[1]) * Math.cos(c[0] * Math.PI / 180));
    const ds = all.map(x => dist(x[1], c0)).sort((x, y) => x - y), core = ds[Math.min(ds.length - 1, Math.floor(ds.length * 0.6))];
    const k = all.filter(x => dist(x[1], c0) <= core).sort((x, y) => MP[x[0]] - MP[y[0]]).slice(0, desk() ? 30 : 12).map(x => x[1]);
    const c1 = [md(k.map(p => p[0])), md(k.map(p => p[1]))], m1 = md(k.map(p => dist(p, c1))) || 1e-6, top = k.filter(p => dist(p, c1) <= 2.5 * m1); if (!top.length) return null;
    const o = C.overMap(); o.paddingTopLeft = o.paddingTopLeft.map(x => x + 16); o.paddingBottomRight = o.paddingBottomRight.map(x => x + 16);
    let bb = top; const sym = top.concat(top.map(p => [2 * c1[0] - p[0], 2 * c1[1] - p[1]])), z0 = fitZ(bb, o, 16, sz)[2];
    if (!desk() && z0 < 16 && fitZ(sym, o, 16, sz)[2] >= z0 - 1) bb = sym;
    return { v: fitZ(bb, o, 16, sz), sz };
  };
  const box = () => {   // the uncovered part of the map (phones: between the chip row and the carousel), as lat/lng bounds
    const map = C.map(), o = C.overMap(), L = window.L;
    if (!map) { const pv = predict(); if (!pv) return null; const [la, ln, z] = pv.v, c = prj(la, ln, z), ox = c[0] - pv.sz[0] / 2, oy = c[1] - pv.sz[1] / 2;
      const nw = unp(ox + o.paddingTopLeft[0] - 24, oy + o.paddingTopLeft[1] - 24, z), se = unp(ox + pv.sz[0] - o.paddingBottomRight[0] + 24, oy + pv.sz[1] - o.paddingBottomRight[1] + 24, z);
      return { pred: true, contains: p => p[0] <= nw[0] && p[0] >= se[0] && p[1] >= nw[1] && p[1] <= se[1] }; }
    const sz = map.getSize();
    const tl = L.point(Math.min(sz.x - 1, o.paddingTopLeft[0] - 24), Math.min(sz.y - 1, o.paddingTopLeft[1] - 24)), br = L.point(Math.max(tl.x + 1, sz.x - o.paddingBottomRight[0] + 24), Math.max(tl.y + 1, sz.y - o.paddingBottomRight[1] + 24));
    return L.latLngBounds(map.containerPointToLatLng(tl), map.containerPointToLatLng(br));
  };
  let selC = null;
  // the list pages like listing results: the first 40 places in the area (guide order: area, then rank), "Show 40 more"
  // after them; only the cards on show are stamped, so a city-wide view never builds every card (DOM stays small)
  const PER = 36; let lim = PER, pager = null;   // D-46 DOM budget (platform): a 36-card first page keeps Tokyo Atlas under 2,900 nodes
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
    if (!atlas() || S.day || C.msOne) { topMap(null); C.msTop = null; flat(); if (C.msOne && atlas() && Cleo.defer) Cleo.defer.all(); qa('li.pl.ms-out').forEach(c => c.classList.remove('ms-out')); qa('section.area.ms-empty').forEach(s => s.classList.remove('ms-empty')); H.classList.remove('ms-on'); if (atlas()) H.classList.add('ms-ready', 'ms-paged'); C.msN = null; if (pager) pager.hidden = true; held(); deco(); face(); if (C.msPaint) C.msPaint(); return; }
    const T = topOn() ? topSet() : null; topMap(T);
    const pre = !map && !T && !C.msAll && !H.classList.contains('ms-nomap') && (!desk() || C.msLive !== false) ? box() : null;   // D-46: the map's first view, ahead of the map
    const area = !T && (!!map && map.getSize().x > 0 || !!pre) && !C.msAll && (!desk() || C.msLive !== false);
    if (more !== true && C.navKeep && C.navKeep()) { if (C.msPaint) C.msPaint(); return; }   // a round-trip keeps the list it left (atlas-nav.js)
    if (area && more !== true && C.navFitPending && C.navFitPending()) { if (C.msPaint) C.msPaint(); return; }   // QA-76: no map-area pass on the pre-fit view (atlas-nav.js)
    if (more !== true) lim = PER;
    // a place without a verified pin has no "outside": it is always listed (last), so no lens count ever loses it
    const b = area ? pre || box() : null, keep = c => c.classList && (c.classList.contains('is-target') || c === selC), inB = c => { if (T) return !!T[C.pid(c)] || keep(c); const ll = llOf(c); return !b || !ll || b.contains(ll) || keep(c); };
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
    if (need.size && Cleo.defer && (map || pre || H.classList.contains('ms-nomap'))) { if (Cleo.defer.stampIds) Cleo.defer.stampIds(need); else need.forEach(id => Cleo.defer.stampFor(id.slice(2))); }
    lastShow = show; qa('li.pl').forEach(c => c.classList.toggle('ms-out', !c.hidden && !show[C.pid(c)] && !keep(c)));
    if (area && map) lastB = map.getBounds();   // the area last searched (OV-02's 25 % rule)
    if (area) shed();   // D-46 DOM budget: the off-page cards go back to the deferred pool
    H.classList.add('ms-paged');   // INP: until this first pass, desktop Atlas lays out no card (atlas.css) — a Guidebook-built list was 488 cards reflowed per forced layout
    flat();
    qa('section.area').forEach(s => s.classList.toggle('ms-empty', !s.querySelector('li.pl:not([hidden]):not(.ms-out)')));
    // the first map-area pass has picked the page (or there is no map / the reader asked for all): the list can be drawn
    if (area || C.msAll || H.classList.contains('ms-nomap') || !C.loadMap) H.classList.add('ms-ready');
    // the pager keeps the paged views' contract (.g-pager [data-pg="all"] = everything in one list, the G1 probe's one tap)
    if (!pager && lp) { pager = d.createElement('p'); pager.className = 'ms-pager g-pager'; lp.insertBefore(pager, $('#how-we-choose', lp));
      on(pager, 'click', e => { const b = e.target.closest('button'); if (!b) return; if (at(b, 'data-pg') === 'all') { C.msAll = C.msOne = true; msArea(); } else { lim += PER; msArea(true); } }); }
    const left = inn.length - lim;
    if (pager) { pager.hidden = left <= 0; pager.innerHTML = left > 0 ? '<button type="button" class="btn btn-ghost">' + tt('atl.more', 'Show {n} more', { n: Math.min(PER, left) }) + '</button> <button type="button" class="btn btn-quiet" data-pg="all">' + tt('atl.one', 'Show all {n} in one list', { n: inn.length.toLocaleString('en-US') }) + '</button> <span>' + (area ? tt('atl.of.area', '{n} of {places} in this area', { n: lim.toLocaleString('en-US'), places: pl(inn.length) }) : tt('atl.of', '{n} of {places}', { n: lim.toLocaleString('en-US'), places: pl(inn.length) })) + '</span>' : ''; }
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
  let hereB = null, lastB = null;
  const here = o => {
    if (!hereB && o) { hereB = d.createElement('button'); hereB.type = 'button'; hereB.className = 'btn ms-here'; hereB.innerHTML = C.icon('pin') + '<span>' + tt('atl.here', 'Search this area') + '</span>'; mp.appendChild(hereB);
      on(hereB, 'click', () => { C.msAll = C.msOne = false; msArea(); if (lp) lp.scrollLeft = 0; }); }
    if (hereB) hereB.hidden = !o;
  };

  /* ---- selection: pin → card, card (swipe) → pin ---- */
  const pinSel = () => { if (C.feature) C.feature(); };   // the selected place is always a labelled pin (ink) — feature() decides
  let quiet = 0;
  // phones (SPEC-v3 §2.2): the first screen is the map + a 56 px list peek (rev 5a); the carousel appears only after a selection
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
      quiet = Date.now(); try { map.panInside(k.getLatLng(), Object.assign(C.overMap(), { animate: !C.still(), duration: 0.3 })); } catch (e) {}
      return;
    }
    // a near card glides into place; a far one (more than two widths away) jumps — a long glide is slow and reads as noise
    if (lp && lp.scrollTo && !H.classList.contains('ms-list')) { qSwipe = Date.now(); const x = c.offsetLeft - (lp.clientWidth - c.offsetWidth) / 2;
      lp.scrollTo({ left: x, behavior: C.still() || Math.abs(x - lp.scrollLeft) > 2 * lp.clientWidth ? 'auto' : 'smooth' }); }
    // the carousel now covers the bottom: keep the selected place in the uncovered band (no move when it already is)
    const map = C.map(), k = C.markers[C.pid(c)];
    // (not for a #p= route or under an open detail: atlas-nav.js places those, out from under the sheet)
    if (map && k && how !== 'route' && !H.classList.contains('ms-list') && !(Cleo.sheet && Cleo.sheet.isOpen()) && !(C.navHold && C.navHold())) { quiet = Date.now();
      // clear of the Near me / Map pills too (they stack bottom right, above the carousel), so its label has room
      const o = C.overMap(), cr = $('.leaflet-bottom.leaflet-right'), cb = cr ? cr.getBoundingClientRect() : { width: 0, height: 0 };
      o.paddingBottomRight = [Math.max(o.paddingBottomRight[0], Math.round(cb.width) + 24), o.paddingBottomRight[1] + Math.round(cb.height) + 48];   // + the label above the point
      try { map.panInside(k.getLatLng(), Object.assign(o, { animate: !C.still(), duration: 0.3 })); } catch (e) {} }
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
      (s ? '<span class="ms-pv-s">' + C.esc(s.textContent.replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim()) + '</span>' : '') +
      // D-43 (designer): a low-confidence pin draws like any dot; the preview says so in words — FE-C's card label, one string
      ($('.pl-approx', c) ? '<span class="ms-pv-a">' + C.esc($('.pl-approx', c).textContent.trim()) + '</span>' : '') + '</span></a>' +
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
    // off-page cards aren't decorated (DOM budget)
    if (c.hasAttribute('data-ms') || (c.classList.contains('ms-out') && H.classList.contains('ms-on'))) return; c.setAttribute('data-ms', '');
    const t1 = at(c, 'data-t') === '1', cl = c.hasAttribute('data-closed'), a = ((info.areas || {})[at(c, 'data-a')] || {}).n || '';
    const inT = ($('.pl-e .in', c) || {}).textContent || '', dish = inT.split(' · ').slice(1).join(' · ').trim();
    const g = (at(c, 'data-g') || '').split(' ').filter(x => x && x !== 'FREE' && x !== 'ICON')[0], kind = dish || (at(c, 'data-k') === 'f' ? tt('city.mode.food', 'Eat & drink') : ((info.cats || {})[g] || tt('srch.sight', 'Sight')));
    const ss = (at(c, 'data-src') || '').split(' ').filter(x => x && x !== 'guide'), s0 = ss[0];
    const fig = $('figure.pl-photo', c), cap = fig && $('figcaption', fig), cl0 = cap && [].slice.call(cap.querySelectorAll('a')).pop();
    c.insertAdjacentHTML('afterbegin', '<span class="ms-bd">' +
      (cl ? '<span class="sticker ms-cl">' + tt('sheet.closed', 'Closed') + '</span>' : t1 ? '<span class="sticker ms-st">' + tt('tier.1', 'Must see') + '</span>' : '') + '</span>' +
      (cl0 ? '<a class="ms-cr" href="' + C.esc(cl0.href) + '" target="_blank" rel="noopener" title="' + C.esc(cap.textContent.trim()) + '" aria-label="' + tt('atl.credit', 'Photo credit: {c}', { c: C.esc(cap.textContent.trim()) }) + '">©</a>' : ''));
    const nm = $('.pl-n', c); if (nm) nm.insertAdjacentHTML('afterend', '<p class="ms-k"><span class="ms-a">' + C.esc(a) + ' · </span>' + C.esc(kind) + '</p>' +
      '<p class="ms-rec">' + (s0 ? tt('card.recby', 'Recommended by') + ' <b>' + ss.slice(0, 2).map(x => C.esc(((info.src || {})[x] || [x])[0])).join('</b>, <b>') + '</b>' + (ss.length > 2 ? ' ' + tt('gal.more', '+{n} more', { n: ss.length - 2 }) : '') : tt('sheet.added', 'Added by the guide')) + '</p>');
    const im = fig && $('img', fig); if (im && !im.hasAttribute('data-sizes0')) im.setAttribute('data-sizes0', im.getAttribute('sizes') || '');
  });
  // D-46 DOM budget (FE-A: Tokyo Atlas 3,587 nodes against 3,000): a card off the map-area page goes back into a deferred
  // noscript chunk, undecorated, exactly as a never-stamped card waits — core's peek / stampIds / stamp-all and city.js's
  // stubs (C.stubs) treat it like any other; the selected, targeted or focused card always stays
  const shed = () => { if (!Cleo.defer || !C.stubs || !lp) return; const f = d.activeElement;
    qa('#cleo-grid li.pl.ms-out').forEach(c => { if (c === selC || c.classList.contains('is-target') || c.contains(f) || !c.parentNode) return;
      qa('img[data-sizes0]', c).forEach(im => { im.setAttribute('sizes', at(im, 'data-sizes0')); im.removeAttribute('data-sizes0'); });
      qa(':scope>:is(.ms-bd,.ms-cr), .ms-k, .ms-rec', c).forEach(x => x.remove()); c.removeAttribute('data-ms'); c.classList.remove('ms-out', 'is-hover', 'is-focus');
      c.style.removeProperty('order'); if (!c.getAttribute('style')) c.removeAttribute('style'); c.hidden = false;
      const a = {}; [].forEach.call(c.attributes, x => { a[x.name] = x.value; });
      const st = { id: c.id, stub: true, getAttribute: k => (Object.prototype.hasOwnProperty.call(a, k) ? a[k] : null), hasAttribute: k => Object.prototype.hasOwnProperty.call(a, k), _a: a };
      const n = d.createElement('noscript'); n.setAttribute('data-cleo-defer', ''); n.setAttribute('data-n', '1'); n.setAttribute('style', 'display:contents'); n.textContent = '\n' + c.outerHTML + '\n';
      c.parentNode.replaceChild(n, c); const id = C.pid(c), i = C.cards.indexOf(c); if (i >= 0) C.cards.splice(i, 1); if (C.byId[id] === c) delete C.byId[id]; C.stubs[id] = st; });   // forgotten by city.js; its place keeps a stub
    if (Cleo.defer.resume) Cleo.defer.resume(); };   // platform's contract (5): the lazy observer re-watches the lists' new chunks
  const undeco = () => { qa('li.pl img[data-sizes0]').forEach(im => { im.setAttribute('sizes', at(im, 'data-sizes0')); im.removeAttribute('data-sizes0'); });
    qa('li.pl[data-ms]').forEach(x => x.removeAttribute('data-ms')); qa('li.pl :is(.ms-bd,.ms-cr,.ms-k,.ms-rec)').forEach(x => x.remove()); };
  on(d, 'cleo:stamped', () => { if (atlas()) { deco(); face(); } });
  // i18n D-41: what Atlas drew before the catalogue arrived is said again in it. locale.js fires cleo:locale inside the
  // paint hold, after city.js's own apply() (which re-runs the pager, count line and Key via C.after); this re-says the
  // once-built bar, head, card faces and map controls, and puts the bar's aria-label back on its own key
  on(d, 'cleo:locale', () => {
    const set = (el, t) => { if (el) el.textContent = t; }, lab = (el, t) => { if (el) { el.setAttribute('aria-label', t); if (el.title) el.title = t; } };
    if (bar) { bar.setAttribute('aria-label', tt('atl.bar', 'Search and filter the map')); set($('.ms-top span', bar), tt('gb.top', 'Top picks'));
      set($('.ms-mine span', bar), tt('sheet.saved', 'Saved')); set($('.ms-sort .vh', bar), tt('atl.sort', 'Sort places'));
      const so = SORT(); qa('.ms-sort option', bar).forEach((o, i) => set(o, (so[i] || [])[1] || o.textContent)); }
    if (head) { set($('.ms-nomap-n', head), tt('atl.nomap', 'Map unavailable right now — every place is listed here.')); set($('.ms-live span', head), tt('atl.live', 'Search as I move the map'));
      set($('[data-cleo-foryou] span', head), tt('city.door.guide.t', 'For you')); set($('[data-cleo-day] span', head), tt('city.door.day.k', 'Your day')); set($('[data-cleo-near] span', head), tt('city.door.near.k', 'Near me')); }
    if (hereB) set($('span', hereB), tt('atl.here', 'Search this area'));
    lab($('.am-ctl.m-list'), tt('atl.m.list', 'Show the list')); lab($('.am-ctl.m-locate'), tt('city.door.near.k', 'Near me'));
    lab($('.m-layers'), tt('atl.layers', 'Map style and key')); lab($('.m-layers-pop'), tt('atl.layers', 'Map style and key')); lab($('.m-styles'), tt('atl.style', 'Map style'));
    set($('.m-styles [data-base="map"]'), tt('city.map.label', 'Map')); set($('.m-styles [data-base="satellite"]'), tt('city.base.satellite', 'Satellite'));
    lab($('.m-attr-i'), tt('atl.credits', 'Map credits')); set($('.ms-key legend'), tt('atl.key', 'Map key'));
    if (atlas()) { undeco(); deco(); face(); if (C.msPaint) C.msPaint(); }
  });

  /* ---- the Atlas chrome (moved off the eager path): filter bar, results line, List / Map pill ---- */
  const split = $('.split'), tb = $('[data-cleo-toolbar]'), nav = $('[data-cleo-views]'), achips = $('.area-chips');
  let moved = [], bar = null, head = null, tog = null, listOn = false, pushedList = 0;
  const park = (el, host, before) => { if (el && el.parentNode !== host) { moved.push([el, el.parentNode, el.nextSibling]); host.insertBefore(el, before || null); } };
  const unpark = () => moved.splice(0).reverse().forEach(([el, par, nx]) => { if (nx && nx.parentNode === par) par.insertBefore(el, nx); else par.appendChild(el); });
  const SORT0 = [['', 'atl.sort.top', 'Top ranked'], ['src', 'atl.sort.src', 'Most sources'], ['az', 'atl.sort.az', 'A–Z'], ['near', 'city.sort.near', 'Nearest to me']];
  const SORT = () => SORT0.map(x => [x[0], tt(x[1], x[2])]);   // i18n D-41: said in the catalogue at render time
  function build() {
    if (bar || !split) return;
    bar = d.createElement('div'); bar.className = 'ms-bar'; bar.setAttribute('role', 'search'); bar.setAttribute('aria-label', tt('atl.bar', 'Search and filter the map'));   // its own key: never the generic "Search {city}"
    bar.innerHTML = '<div class="ms-x"><button type="button" class="chip ms-top" aria-pressed="false">' + C.icon('star4') + '<span>' + tt('gb.top', 'Top picks') + '</span></button>' +
      '<button type="button" class="chip ms-mine" aria-pressed="false">' + C.icon('heart') + '<span>' + tt('sheet.saved', 'Saved') + '</span> <span class="n"></span></button>' +
      '<label class="ms-sort"><span class="vh">' + tt('atl.sort', 'Sort places') + '</span><select>' + SORT().map(x => '<option value="' + x[0] + '">' + x[1] + '</option>').join('') + '</select></label></div>';
    split.parentNode.insertBefore(bar, split); H.classList.add('ms-built');   // the bar takes the space held for it, in the same frame
    head = d.createElement('div'); head.className = 'ms-head';
    head.innerHTML = '<p class="ms-nomap-n">' + tt('atl.nomap', 'Map unavailable right now — every place is listed here.') + '</p><div class="ms-row"><p class="ms-count" aria-live="polite"></p>' +
      '<label class="ms-live"><input type="checkbox"> <span>' + tt('atl.live', 'Search as I move the map') + '</span></label></div><p class="ms-more"></p>' +
      // R7-g4 (e): the rail's doors, reachable in desktop Atlas without horizontal scroll (city.js handles them by attribute)
      '<p class="ms-doors"><button type="button" class="btn btn-quiet" data-cleo-foryou aria-haspopup="dialog">' + C.icon('spark') + '<span>' + tt('city.door.guide.t', 'For you') + '</span></button>' +
      '<button type="button" class="btn btn-quiet" data-cleo-day="">' + C.icon('route') + '<span>' + tt('city.door.day.k', 'Your day') + '</span></button>' +
      '<button type="button" class="btn btn-quiet" data-cleo-near aria-pressed="false">' + C.icon('locate') + '<span>' + tt('city.door.near.k', 'Near me') + '</span></button></p>';
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
    const tot = '<span class="ms-sortby" title="' + tt('atl.order.t', 'Ordered by tier within each area, then by number of named sources') + '">' + (SORT().filter(x => x[0] === (S.sort || ''))[0] || SORT()[0])[1] + '</span>';
    const tp = C.msTop, total = (C.info && C.info.total) || 0, lensOn = !!(Cleo.lens && Cleo.lens.on && Cleo.lens.on(Cleo.lens.current()));
    // QC-05: a search (or lens) that matches nothing says so and offers the way back — never a blank map and "0"
    const none = !tp && N === 0 && total > 0;
    // one empty state per view, in the catalogue's strings (FE-C hides theirs in Atlas) — never hard-coded English
    if (none) { const T = (k, e, v) => C.esc(Cleo.t ? Cleo.t(k, e, v) : e);
      $('.ms-count', head).innerHTML = S.q ? T('city.empty.q', 'No places match “{q}”.', { q: S.q }) : T('city.empty.f', 'No places match these filters.');
      $('.ms-more', head).innerHTML = (S.q ? '<button type="button" class="btn btn-quiet" data-ms-clear="q">' + T('city.empty.search', 'Clear search') + '</button> ' : '') + '<button type="button" class="btn btn-quiet" data-ms-clear="all">' + T('city.showall', 'Show all {n}', { n: total.toLocaleString('en-US') }) + '</button>'; }
    else $('.ms-count', head).innerHTML = tp ? tt('atl.c.top', 'Top {n} picks', { n: '<b>' + tp[0].toLocaleString('en-US') + '</b>' }) + ' · ' + tot
      : onA ? (lensOn && total ? (n[0] === 1 ? tt('atl.c.here.of.one', '{n} place here, of all {total}', { n: '<b>' + n[0].toLocaleString('en-US') + '</b>', total: total.toLocaleString('en-US') }) : tt('atl.c.here.of', '{n} places here, of all {total}', { n: '<b>' + n[0].toLocaleString('en-US') + '</b>', total: total.toLocaleString('en-US') }))
        : n[0] === 1 ? tt('atl.c.here.one', '{n} place here', { n: '<b>' + n[0].toLocaleString('en-US') + '</b>' }) : tt('atl.c.here', '{n} places here', { n: '<b>' + n[0].toLocaleString('en-US') + '</b>' })) + ' · ' + tot
      // QC-13: under a lens the line keeps the total — "43 of all 488 places"
      : lensOn && total && N < total ? tt('atl.c.of', '{n} of all {total} places', { n: '<b>' + N.toLocaleString('en-US') + '</b>', total: total.toLocaleString('en-US') }) + ' · ' + tot
      : (all ? (N === 1 ? tt('atl.c.showing.one', 'Showing all {n} place', { n: '<b>' + N.toLocaleString('en-US') + '</b>' }) : tt('atl.c.showing', 'Showing all {n} places', { n: '<b>' + N.toLocaleString('en-US') + '</b>' }))
        : N === 1 ? tt('atl.c.all.one', 'All {n} place', { n: '<b>' + N.toLocaleString('en-US') + '</b>' }) : tt('atl.c.all', 'All {n} places', { n: '<b>' + N.toLocaleString('en-US') + '</b>' })) + ' · ' + tot;
    if (!none) $('.ms-more', head).innerHTML = tp ? '<button type="button" class="btn btn-quiet" data-ms="all">' + tt('city.showall', 'Show all {n}', { n: tp[1].toLocaleString('en-US') }) + '</button>'
      : onA && n[1] ? '<button type="button" class="btn btn-quiet" data-ms="all">' + tt('city.showall', 'Show all {n}', { n: (n[0] + n[1]).toLocaleString('en-US') }) + '</button>'
      : all ? '<button type="button" class="btn btn-quiet" data-ms="area">' + (C.map() ? tt('atl.area', 'Only show this map area') : tt('atl.per', 'Show {n} at a time', { n: PER })) + '</button>' : '';
    $('.ms-live', head).hidden = !C.map() || !desk();   // its 44 px row is reserved (atlas.css .ms-row), so it arriving with the map moves nothing (D-46)
    $('.ms-top').setAttribute('aria-pressed', String(!!C.msTop)); $('.ms-mine', bar).setAttribute('aria-pressed', String(!!S.mine));
    const sv = Cleo.saved ? Object.keys(Cleo.saved.all()).filter(r => r.slice(0, r.lastIndexOf('/')) === C.key).length : 0; $('.ms-mine .n', bar).textContent = sv || '';
    $('select', bar).value = S.sort || '';
    const k = onA ? n[0] : N;
    // D-46 §1.7: the peek leads with up to 3 photo thumbnails — the top places on show by map priority that have an honest
    // photo (no glyph stand-ins); their names are in the peek's label. "checked <date>" moved to the list's count line
    const pkT = desk() || listOn ? [] : qa('#cleo-grid li.pl:not(.ms-out):not([hidden])').map(c => [c, $('figure.pl-photo img', c)]).filter(x => x[1] && (x[1].currentSrc || x[1].getAttribute('src')))
      .sort((a, b) => (MP[C.pid(a[0])] == null ? 1e9 : MP[C.pid(a[0])]) - (MP[C.pid(b[0])] == null ? 1e9 : MP[C.pid(b[0])])).slice(0, 3).map(x => [C.name(x[0]) || C.pid(x[0]), x[1].currentSrc || x[1].getAttribute('src')]);
    if (!none && listOn && !desk() && checked()) $('.ms-count', head).insertAdjacentHTML('beforeend', ' · <span class="ms-chk">' + tt('atl.checked', 'checked {d}', { d: checked() }) + '</span>');
    tog.innerHTML = listOn ? C.icon('map') + '<span>' + tt('city.map.label', 'Map') + '</span>' : desk() || H.classList.contains('ms-car') ? C.icon('list') + '<span>' + tt('atl.tog.list.n', 'List · {n}', { n: k.toLocaleString('en-US') }) + '</span>'
      : none ? '<i class="ms-handle" aria-hidden="true"></i><span>' + tt('atl.tog.none', 'No places match · Show the list') + '</span>'
      : '<i class="ms-handle" aria-hidden="true"></i><span class="ms-pk">' + (pkT.length ? '<span class="ms-th" aria-hidden="true">' + pkT.map(x => '<img src="' + C.esc(x[1]) + '" alt="" width="40" height="40" decoding="async">').join('') + '</span>' : '') +
        '<span>' + (k === 1 ? tt('atl.tog.n.one', '{n} place here · Show list', { n: '<b>' + k.toLocaleString('en-US') + '</b>' }) : tt('atl.tog.n', '{n} places here · Show list', { n: '<b>' + k.toLocaleString('en-US') + '</b>' })) + '</span></span>';   // the phone peek (SPEC-v3 §1.7)
    tog.setAttribute('aria-pressed', String(listOn)); tog.setAttribute('aria-label', listOn ? tt('atl.tog.map', 'Show the map') : pkT.length ? tt('atl.tog.led', 'Show the list of {places}, led by {names}', { places: pl(k), names: pkT.length > 1 ? pkT.slice(0, -1).map(x => x[0]).join(tt('atl.comma', ', ')) + tt('fy.and', ' and ') + pkT[pkT.length - 1][0] : pkT[0][0] }) : tt('atl.tog.list', 'Show the list of {places}', { places: pl(k) }));
  };
  // cards stamped later (a deep link, a route that builds more) join the page only if it shows them: a kept list stays the list
  // a source chip the card's width cuts (ellipsis) carries its whole name as a title — only those, so pages stay lean
  const cut = () => requestAnimationFrame(() => qa('#cleo-grid li.pl:not(.ms-out) .pl-s .src:not([title])').forEach(b => { if (b.scrollWidth > b.clientWidth + 1) b.title = b.textContent.trim(); }));
  C.after.push(cut); on(d, 'cleo:stamped', cut);
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
  d.addEventListener('keydown', e => { if (e.key !== 'Escape' || !atlas() || e.target.id === 'cleo-filter' || (Cleo.sheet && Cleo.sheet.isOpen()) || $('.overlay:not([hidden])') || $('.m-attr-pop:not([hidden])')) return;
    if (listOn) listMode(false, true); else if (H.classList.contains('ms-car')) { const c = selC; unselect(); car(false); back(c); } }, true);
  C.onNoMap = () => { C.msN = null; if (atlas() && !desk()) listMode(true); msArea(); };
  // rev 5a §2.2: on phones the header's search icon is the search — in Atlas it opens the in-page search row over the
  // chip row (and keeps the reader on the map) instead of the site search panel; a typed search keeps the row open
  const fq = $('#cleo-filter'), sq = () => { const s = fq && fq.closest('.spill'); if (s) s.classList.toggle('has-q', !!fq.value); if (bar) bar.classList.toggle('ms-q', !!(fq && fq.value)); };
  on(fq, 'input', sq);
  d.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-cleo-search-open]'); if (!a || !fq || !atlas() || desk() || !fq.closest('.ms-bar')) return;
    e.preventDefault(); e.stopPropagation(); fq.closest('.spill').classList.add('ms-open'); fq.focus(); }, true);
  on(fq, 'keydown', e => { if (e.key === 'Escape' && !fq.value && !desk()) { e.stopPropagation(); fq.blur(); } });
  on(fq, 'blur', () => { if (!fq.value) fq.closest('.spill').classList.remove('ms-open'); });   // closed again: not drawn, hit or tabbed to
  // a #p= that routed before this file arrived: select it now (selected + labelled on the map, SPEC-v3 §1.4)
  const routeSel = () => { const p = Cleo.route.parse().p, c = p && C.byId[p]; if (c && selC !== c) select(c, 'route'); };
  // OV-06 (SPEC-v3 §2.0.6): the phone chip row fades on each edge that has more chips beyond it, so it reads as scrollable
  const edge = () => { if (!bar) return; const o = bar.scrollWidth - bar.clientWidth > 2; bar.classList.toggle('ms-fl', o && bar.scrollLeft > 2); bar.classList.toggle('ms-fr', o && bar.scrollLeft < bar.scrollWidth - bar.clientWidth - 2); };
  const land = () => !!window.matchMedia && matchMedia('(max-height:499px) and (orientation:landscape)').matches;
  C.land = land;   // the one landscape predicate (FE-C's probes key on it too)
  C.msIn = () => {
    setTimeout(() => H.classList.add('ms-ready', 'ms-paged'), 3000);   // never hold the list longer than this, map or not
    if (!C._lq && window.matchMedia) { C._lq = 1; const q = matchMedia('(max-height:499px) and (orientation:landscape)'), f = () => { if (atlas() && !desk()) C.msIn(); }; if (q.addEventListener) q.addEventListener('change', f); }   // a rotation re-folds the bars
    build(); unpark(); deco(); face(); setTimeout(routeSel, 0); sq(); if (bar && !bar._e) { bar._e = 1; on(bar, 'scroll', edge, { passive: true }); on(window, 'resize', edge); } requestAnimationFrame(edge);
    const x = $('.ms-x', bar);
    // phones: the chip row carries FE-A's search pill (in the toolbar) and the switcher last; desktop: area chips in the results head
    // OV-00 §2.0.7 landscape (height < 500): one 48 px bar — the chip row folds away (its Filters button rides in the header,
    // atlas.css), and the kind chips and Top picks move into the Filters sheet, so it holds kind, Top picks and Area
    if (!desk() && land()) { const sc = $('#cleo-tray .scroll'), md = $('.modes', tb || bar), tp = $('.ms-top'); if (sc) { if (tp) park(tp, sc, sc.firstChild); if (md) park(md, sc, sc.firstChild); } }
    // OV-41 (platform): the page's offline-pack section (shown in Atlas when there is no map) rides at the end of the list —
    // in the page flow it sat under the phone's fixed list pane, covered, and on desktop below a document that never scrolls;
    // with a live map fe-a.css hides it wherever it is (the Layers popover holds the pack)
    { const pk = $('main>section.pack[data-cleo-pack]'); if (pk && lp) park(pk, lp, null); }
    if (!desk()) { park(tb, bar, x); } else {   // phones: the view switch stays in FE-A's city bar, its own row under the header (QC-09)
      // desktop (SPEC-v3 §2.1): ONE bar — the search pill (in the toolbar), the chips, then the view switch; the notes and
      // the footer go to the end of the list column, since the document does not scroll in Atlas
      const sp = $('[data-cleo-search]'); park(tb, bar, x); if (sp && tb) park(sp, tb, tb.firstChild); const tw = $('.topbar .wrap'); if (nav && nav.hasAttribute('data-pre')) { nav.removeAttribute('data-pre'); if (nav.parentNode === tw) moved.push([nav, $('main>.cbar .cbar-in'), null]); } park(nav, tw || bar, tw ? $('.top-actions', tw) : null);   // D-46: the page parked it at parse time (render/city.js), so the header never moves; its home is still the city bar   // the view switch: the header's right
      if (achips) park(achips, head, $('.ms-more', head).nextSibling);
      [$('main>.about'), $('body>.method'), $('body>.footer')].forEach(el => park(el, lp, null)); }   // the map-first DOM order (Tab reaches the map before the list) is atlas-nav.js's (FE-2)
    if (desk() && listOn) listMode(false);
    if (H.classList.contains('ms-nomap')) C.onNoMap();
    msArea();
  };
  C.msOut = () => { listOn = false; H.classList.remove('ms-paged'); qa('li.pl').forEach(c => { c.style.order = ''; }); unpark(); undeco(); if (lp) lp.classList.remove('w7-cards'); closePoi(); held(); };

  /* ---- locate-me: opt-in, one reading, memory only ---- */
  let meL = null;   // `me` (the reader's location, memory only) is declared at the top: feature() reads it
  const locate = b => {
    const map = C.map(), live = $('#cleo-view-live'), say = t => { if (live) live.textContent = t; b.title = t; };
    if (!map) return;
    if (me) { if (!(C.onLocate && C.onLocate(me))) C.fly(me); return; }   // a second press (after Near me was cleared) sorts again
    if (!navigator.geolocation) { say(tt('atl.geo.no', 'This browser can’t share a location.')); return; }
    b.classList.add('busy');
    navigator.geolocation.getCurrentPosition(p => {
      const m = C.map(); b.classList.remove('busy'); if (!m) return; me = window.L.latLng(p.coords.latitude, p.coords.longitude); b.setAttribute('aria-pressed', 'true');
      if (!meL) meL = window.L.layerGroup().addTo(m); meL.clearLayers();
      if (p.coords.accuracy) window.L.circle(me, { radius: p.coords.accuracy, className: 'me-acc', weight: 1, interactive: false }).addTo(meL);
      window.L.circleMarker(me, { radius: 7, weight: 2, fillOpacity: 1, interactive: false, className: 'me' }).addTo(meL);
      say(tt('atl.geo.here', 'You are here — shown on this device only, never stored, gone when you reload.')); car(true); if (!(C.onLocate && C.onLocate(me))) C.fly(me);   // atlas-nav.js: nearest first
    }, err => { b.classList.remove('busy'); say(err && err.code === 1 ? tt('atl.geo.denied', 'Location permission was declined. Nothing was stored.') : tt('atl.geo.failed', 'Couldn’t get your location.')); },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  };

  C.locate = locate;   // atlas-nav.js: the list head's Near me door runs this same reading (OV-00: Near me once)
  C.atlasTools = (L, el) => {
    const map = C.map(); if (!map) return;
    const dk = desk();
    const ctl = (pos, mk) => { const X = L.Control.extend({ options: { position: pos }, onAdd: () => { const n = mk(); L.DomEvent.disableClickPropagation(n); L.DomEvent.disableScrollPropagation(n); return n; } }); map.addControl(new X()); };
    const btn = (cls, lbl, html) => { const b = d.createElement('button'); b.type = 'button'; b.className = 'am-ctl ' + cls; b.setAttribute('aria-label', lbl); b.title = lbl; b.innerHTML = html; return b; };
    // phones (SPEC-v3 slice 2): the map's own controls sit bottom right above the cards; the OSM credit takes the top left, clear of them
    // the OSM credit on phones (SPEC-v3 §2.2): one line that cannot wrap, bottom LEFT (never a control's corner),
    // "© OpenStreetMap · Esri ⓘ" — the ⓘ opens the full credit with its links, so the licence stays one tap away
    if (map.attributionControl) map.attributionControl.setPrefix(false);   // designer: no "Leaflet" word or flag (its BSD licence needs no on-map credit); the tile and data credits stay
    if (!dk && map.attributionControl) { const ac = map.attributionControl, up = ac._update;
      ac.setPosition('bottomleft');
      ac._update = function () { up.call(this); const el = this._container; if (!el) return; const full = el.innerHTML; el.classList.add('m-attr');
        el.innerHTML = '<span class="m-attr-s">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · Esri</span>' +
          '<button type="button" class="m-attr-i" aria-expanded="false" aria-label="' + tt('atl.credits', 'Map credits') + '">ⓘ</button><div class="m-attr-pop" role="note" hidden>' + full + '</div>'; };
      ac._update();
      const box = ac.getContainer(), tog = o => { const b = $('.m-attr-i', box), pp = $('.m-attr-pop', box); if (!b || !pp) return; pp.hidden = !o; b.setAttribute('aria-expanded', String(o)); };
      on(box, 'click', e => { if (e.target.closest('.m-attr-i')) tog($('.m-attr-pop', box).hidden); });
      on(d, 'keydown', e => { if (e.key === 'Escape') tog(false); });
      map.on('click dragstart', () => tog(false));
      // OV-05 (SPEC-v3 §2.0.3): the one-line credit is there without interaction at load, and folds to its ⓘ (24 px, a 44 px
      // hit area, the full credit one tap away) on the reader's first pan or after 5 s
      const fold = () => box.classList.add('m-attr-c'); setTimeout(fold, 5000); map.once('dragstart', fold); setTimeout(() => map.once('movestart', () => { if (Date.now() - C.autoAt() > 600) fold(); }), 1500); map.getContainer().addEventListener('pointerdown', fold, { once: true }); }   // any reader touch folds it too
    // the Key (a fieldset), shown in the Layers popover (OV-00 §2.0.3)
    const keyBox = () => {
      const g = d.createElement('fieldset'); g.className = 'ms-key';
      const k = (cls, gl, t) => '<b class="pp ' + cls + '"><span><svg class="ico" aria-hidden="true"><use href="#i-' + gl + '"/></svg><b>' + t + '</b></span></b>';
      const fk = d.getElementById('i-forkknife') ? 'forkknife' : 'bowl';
      const paint = () => { const ar = S.a ? [S.a] : []; g.querySelector('ul').innerHTML = '<li>' + k('pp-s', 'columns', tt('srch.sight', 'Sight')) + '</li><li>' + k('pp-f', fk, C.esc(tt('city.mode.food', 'Eat & drink'))) + '</li>' +
        '<li>' + k('pp-s pp-x', 'columns', tt('sheet.closed', 'Closed')) + '</li>' +
        (C.navLow && C.navLow() ? '<li class="k"><i class="kd ms-halo-k"></i>' + C.esc(tt('sheet.pin.approx', 'Approximate pin')) + '</li>' : '') +   // D-43 (atlas-nav.js draws the halo)
        '<li class="k"><i class="kd"></i><i class="kd f"></i>' + tt('atl.key.more', 'More places · zoom in to see their names') + '</li>' +
        ar.map(a => '<li class="k"><i class="kd" style="background:' + areaC({ getAttribute: () => a, hasAttribute: () => false }) + '"></i>' + C.esc(((C.info.areas || {})[a] || {}).n || a) + '</li>').join('') +
        '<li class="k">' + (store.get('base', 'map') === 'street!' ? '<button type="button" class="btn btn-quiet" data-base="map">' + tt('atl.base.calm', 'Back to the calm map') + '</button>' : '<button type="button" class="btn btn-quiet" data-base="street">' + tt('atl.base.street', 'Show street detail') + '</button>') + '</li>'; };
      g.innerHTML = '<legend>' + tt('atl.key', 'Map key') + '</legend><ul class="m-legend-l"></ul>'; paint();
      on(g, 'click', e => { const b = e.target.closest('[data-base]'); if (!b) return; C.setBase(at(b, 'data-base')); paint(); });
      C.after.push(paint);
      return g;
    };
    // OV-00 §2.0.3 (D-47): phones get ONE icon-only stack, bottom-right — Locate, then Layers; desktop gets + / − then Layers,
    // top-left, and no locate on the map (the list head's "Near me" is the one). Layers opens a small popover: Map / Satellite
    // as a radio pair, the Key, and the offline pack (platform's Cleo.pack.mount). Esc closes it and returns focus to Layers
    if (!dk) ctl('bottomright', () => { const b = btn('m-list', tt('atl.m.list', 'Show the list'), C.icon('list')); on(b, 'click', () => listMode(true, true)); return b; });   // §2.0.7: landscape's List (no peek); hidden in portrait
    if (!dk) ctl('bottomright', () => { const b = btn('m-locate', tt('city.door.near.k', 'Near me'), C.icon('locate')); b.setAttribute('aria-pressed', 'false'); on(b, 'click', () => locate(b)); return b; });
    ctl(dk ? 'topleft' : 'bottomright', () => {
      const w = d.createElement('div'); w.className = 'am-ctl m-layers-w';
      w.innerHTML = '<button type="button" class="m-layers" aria-label="' + tt('atl.layers', 'Map style and key') + '" title="' + tt('atl.layers', 'Map style and key') + '" aria-expanded="false" aria-controls="m-layers-pop">' + C.icon('grid') + '</button>' +
        '<div class="m-layers-pop" id="m-layers-pop" role="dialog" aria-label="' + tt('atl.layers', 'Map style and key') + '" hidden><div class="m-styles" role="radiogroup" aria-label="' + tt('atl.style', 'Map style') + '">' +
        '<button type="button" role="radio" data-base="map">' + tt('city.map.label', 'Map') + '</button><button type="button" role="radio" data-base="satellite">' + tt('city.base.satellite', 'Satellite') + '</button></div><div class="m-pack"></div></div>';
      const b = $('.m-layers', w), pop = $('.m-layers-pop', w), rs = qa('[role=radio]', w);
      const lab = () => { const sat = store.get('base', 'map') === 'satellite'; rs.forEach(r => { const on1 = (at(r, 'data-base') === 'satellite') === sat; r.setAttribute('aria-checked', String(on1)); r.tabIndex = on1 ? 0 : -1; }); };
      const open = o => { pop.hidden = !o; b.setAttribute('aria-expanded', String(o)); if (o) { lab(); const hst = $('.m-pack', pop); if (Cleo.pack && Cleo.pack.mount) Cleo.pack.mount(hst); (rs.find(r => r.tabIndex === 0) || rs[0]).focus(); } };
      on(b, 'click', () => open(pop.hidden));
      on(pop, 'click', e => { const r = e.target.closest('[role=radio]'); if (!r) return; C.setBase(at(r, 'data-base')); lab(); r.focus(); });
      on(pop, 'keydown', e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); open(false); b.focus(); return; }
        const k = rs.indexOf(d.activeElement); if (k < 0 || !/^Arrow/.test(e.key)) return; e.preventDefault(); const n = rs[(k + (/Right|Down/.test(e.key) ? 1 : rs.length - 1)) % rs.length]; n.click(); });
      map.on('click dragstart', () => { if (!pop.hidden) open(false); });
      pop.insertBefore(keyBox(true), $('.m-pack', pop));
      lab(); C.after.push(lab); return w;
    });
    // (the Key now lives in the Layers popover, phone and desktop alike — OV-00 §2.0.3)
    // map moves → the list follows (desktop, live) / "Search this area" (phones, after the reader moves the map)
    let user = 0, mt = 0;
    map.on('dragstart', () => { user = 1; closePoi(); p0 = map.getCenter(); });
    map.on('zoomstart', () => { if (Date.now() - C.autoAt() > 1500 && Date.now() - quiet > 1500) { user = 1; tuck(); } });
    // OV-00 (SPEC-v3 §2.0.2, FE-A's Cleo.chrome): the reader's own drag (> 8 px) or pinch tucks the chip row, the switch row
    // and the peek away; they come back 1.2 s after the map settles, or on a tap on empty map. A programmatic fit never
    // tucks, nor does anything while a place is selected (the carousel is the reader's focus), nor landscape (one bar)
    let p0 = null; const tuck = () => { if (!desk() && !H.classList.contains('ms-car') && !H.classList.contains('ms-list') && innerHeight >= 500 && Cleo.chrome) Cleo.chrome.compact(true); };
    map.on('drag', () => { if (p0 && map.latLngToContainerPoint(p0).distanceTo(map.getSize().divideBy(2)) > 8) { p0 = null; tuck(); } });
    map.on('moveend', () => { if (Cleo.chrome && Cleo.chrome.on && !desk()) Cleo.chrome.idle(1200); });
    map.on('move zoom', place);
    // OV-02 (SPEC-v3 §2.0.5): "Search this area" leaves when the next move starts, and comes back only if the view then
    // differs from the area last searched by more than 25 % (1 − their overlap / their union)
    map.on('movestart', () => here(false));
    const moved = () => { const b = lastB, v = map.getBounds(); if (!b) return 1; const sp = (x, y) => Math.max(0, y - x);
      const ia = sp(Math.max(b.getWest(), v.getWest()), Math.min(b.getEast(), v.getEast())) * sp(Math.max(b.getSouth(), v.getSouth()), Math.min(b.getNorth(), v.getNorth()));
      const ar = x => sp(x.getWest(), x.getEast()) * sp(x.getSouth(), x.getNorth()), un = ar(v) + ar(b) - ia; return un ? 1 - ia / un : 0; };   // 1 − intersection/union: a pan, a zoom in or a zoom out alike
    map.on('click', () => { closePoi(); unselect(); car(false); if (Cleo.chrome) Cleo.chrome.compact(false); });   // an empty-map click clears the selection (phones: back to the peek)
    map.on('moveend zoomend', () => C.feature());
    map.on('moveend', () => {
      const u = user; user = 0; place(); if (!atlas() || (C.navHold && C.navHold())) return; keepView();   // a detail is open or closing (atlas-nav.js)
      if (desk()) { clearTimeout(mt); mt = setTimeout(msArea, 180); return; }
      if (u) { if (H.classList.contains('ms-on') && moved() > 0.25) here(true); return; }   // the reader moved the map: offer, never jump (OV-02: only past a 25 % change)
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
  // focus after a selection closes (FE-C, §2.0.7): the place's pin, else the map — never the page body. feature() may swap the
  // pin out 120 ms after unselect, so it re-resolves once more at 260 ms
  const back = c => { const f = () => { const k = c && C.markers[C.pid(c)], el = k && k.getElement && k.getElement(), mc = C.map() && C.map().getContainer(); const to = [el, mc].find(x => x && x.isConnected);
    if (to) { if (!to.hasAttribute('tabindex')) to.setAttribute('tabindex', '0'); to.focus({ preventScroll: true }); } }; f(); setTimeout(() => { if (d.activeElement === d.body) f(); }, 260); };
  const unselect = () => { if (!selC) return; selC.classList.remove('is-sel', 'is-focus'); selC = null; C.feature(); };
  // the bars tucked or back: the labels' free area changed (overMap reads the bars' boxes), so re-place them once settled
  if (window.MutationObserver) { let was = H.classList.contains('ov-c'); new MutationObserver(() => { const n = H.classList.contains('ov-c'); if (n !== was) { was = n; setTimeout(() => { if (C.feature) C.feature(); }, 240); } }).observe(H, { attributes: true, attributeFilter: ['class'] }); }
  if (atlas()) C.msIn();
})();
