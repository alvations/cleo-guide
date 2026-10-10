/* Salon prototype engine (2026-10 UX proposal — NOT shipped).
   Content renders with zero network: data is a local script, the map draws an offline schematic from
   the real sourced coordinates, and Leaflet + OSM/Esri tiles are a progressive enhancement that only
   takes over once a tile actually loads. No document.write. Every storage call is try/catch-wrapped.
   No place is ever capped or hidden: the list renders progressively, every record stays reachable. */
(function () {
  'use strict';
  const Q = new URLSearchParams(location.search);
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => [...(el || document).querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ── storage: degrade to memory (CLAUDE.md rule 5) ─────────────────────── */
  const mem = {};
  const store = {
    get(k, d) { try { const v = localStorage.getItem('cleo.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : d; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem('cleo.' + k, JSON.stringify(v)); } catch (e) { /* sandboxed: in-memory only */ } },
  };

  /* ── theme ("Night out") ───────────────────────────────────────────────── */
  function applyTheme(t) { if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); }
  applyTheme(Q.get('theme') || store.get('theme', null));
  function isDark() { const t = document.documentElement.getAttribute('data-theme'); return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }

  /* ── icons (inline line icons; no icon font, no CDN) ───────────────────── */
  const I = {
    mark: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="16" cy="16" r="14.5"/><circle cx="16" cy="16" r="10" stroke-dasharray="1.2 2.2"/><path d="M16 3.5 18.6 13.4 28.5 16 18.6 18.6 16 28.5 13.4 18.6 3.5 16 13.4 13.4Z" fill="currentColor" fill-opacity=".18"/><circle cx="16" cy="16" r="1.6" fill="currentColor"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 18h18M5 18a7 7 0 0 1 14 0M12 8V6m-2 0h4"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>',
    seal: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0l2 2.6 3.2-.4.4 3.2L16 8l-2.4 2.6-.4 3.2-3.2-.4L8 16l-2-2.6-3.2.4-.4-3.2L0 8l2.4-2.6.4-3.2 3.2.4z"/></svg>',
    diamond: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 1.5 14.5 8 8 14.5 1.5 8z"/></svg>',
    key: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="5" cy="8" r="3"/><path d="M8 8h7m-2 0v3"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14m6-12v14"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    locate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
    route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/></svg>',
    // interest glyphs
    hist: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 27h24M6 27V14m20 13V14M3 14h26L16 5zM11 27V17m10 10V17m-5 10V17"/></svg>',
    food: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 16h22a11 11 0 0 1-22 0zM9 27h14M20 4l-6 12m10-9-8 9"/></svg>',
    pop: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M16 3l3.6 8.4 9 .8-6.8 6 2 8.8L16 22.4 8.2 27l2-8.8-6.8-6 9-.8z"/><circle cx="16" cy="15.5" r="2.2" fill="currentColor"/></svg>',
  };
  window.CleoIcons = I;

  /* ── data + taxonomy ───────────────────────────────────────────────────── */
  const C = window.CLEO_CITY || { meta: { areas: [], ac: {}, cats: [], cuisines: [] }, recs: [] };
  const M = C.meta, R = C.recs;
  const AREA = Object.fromEntries(M.areas.map(a => [a.id, a]));
  const shortArea = id => { const n = (AREA[id] || {}).n || id; return n.split(/\s+[—(]/)[0].replace(/\s*\(.*$/, ''); };
  const areaSub = id => { const n = (AREA[id] || {}).n || ''; const m = n.match(/\(([^)]*)\)|—\s*(.*)$/); return m ? (m[1] || m[2]) : ''; };
  const CAT = Object.fromEntries(M.cats.map(c => [c.id, c.n]));
  const CZ = Object.fromEntries(M.cuisines.map(c => [c.id, c.n]));
  const AUTH = /michelin|james beard|national park|unesco|nps\b/i;   // institutional authority only — tourism boards are sources, not seals
  const HIST = new Set(['CASTLE', 'TEMPLE', 'UNESCO', 'MUS', 'ARCH', 'ICON', 'GARDEN', 'FLW', 'HIST']);
  const POPC = new Set(['ANIME', 'POP', 'ARTS', 'MURAL', 'SPORT']);
  const NIGHTG = new Set(['NIGHT', 'SPEAK', 'ROOF']);
  const NIGHTC = new Set(['IZAKAYA', 'SAKE', 'BAR']);
  const INTERESTS = [
    { id: 'history', icon: 'hist', label: 'History & landmarks', sub: 'castles, shrines, museums, the icons' },
    { id: 'food', icon: 'food', label: 'Foodie', sub: 'the city’s own dishes, counters to Michelin' },
    { id: 'pop', icon: 'pop', label: 'Pop culture', sub: 'anime, film, music, the delightfully odd' },
  ];
  const VIBES = [
    { id: 'gems', label: 'Hidden gems' }, { id: 'icons', label: 'The icons' }, { id: 'late', label: 'Late-night' },
  ];
  function tags(r) {
    const t = new Set();
    if (r.kind === 'sight' && r.g.some(g => HIST.has(g))) t.add('history');
    if (r.kind === 'food') t.add('food');
    if (r.g.some(g => POPC.has(g))) t.add('pop');
    if (r.g.some(g => NIGHTG.has(g)) || r.cz.some(c => NIGHTC.has(c))) t.add('late');
    return t;
  }
  R.forEach(r => { r._tags = tags(r); });

  /* ── personal state ────────────────────────────────────────────────────── */
  const prefs = Q.get('prefs') != null
    ? { interests: Q.get('prefs').split(',').filter(Boolean), vibe: Q.get('vibe') || '' }
    : store.get('prefs', null);
  const S = {
    prefs, mode: Q.get('mode') || 'all', area: 'ALL', coll: '', sort: prefs ? 'foryou' : 'area',
    saved: new Set(store.get('saved.' + M.key, [])), shown: 30, sel: null, here: null,
  };
  function personal(r) {
    let s = { 1: 3, 2: 2, 3: 1 }[r.t] || 1;
    s += Math.min(r.s.length, 4) * 0.25 + (r.s.some(x => AUTH.test(x[0])) ? 0.6 : 0);
    const p = S.prefs; if (!p) return s;
    let hit = 0; (p.interests || []).forEach(i => { if (r._tags.has(i)) hit++; });
    s += hit * 2.4;
    if (p.vibe === 'gems') s += r.t === 3 ? 2 : r.t === 2 ? 0.8 : -0.6;
    if (p.vibe === 'icons') s += r.t === 1 ? 2 : 0;
    if (p.vibe === 'late') s += r._tags.has('late') ? 2.4 : 0;
    if (r.closed) s -= 6;   // stays listed, just not recommended first
    return s;
  }
  function forYou(r) {
    const p = S.prefs; if (!p || r.closed) return '';
    const i = (p.interests || []).find(x => r._tags.has(x));
    if (!i) return p.vibe === 'late' && r._tags.has('late') ? 'Late-night' : '';
    return { history: 'For you · history', food: 'For you · foodie', pop: 'For you · pop culture' }[i];
  }

  /* ── geometry ──────────────────────────────────────────────────────────── */
  function km(a, b) { const R6 = 6371, t = Math.PI / 180, dLa = (b.lat - a.lat) * t, dLo = (b.lng - a.lng) * t;
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * t) * Math.cos(b.lat * t) * Math.sin(dLo / 2) ** 2; return 2 * R6 * Math.asin(Math.sqrt(h)); }
  const fmtKm = d => d < 1 ? Math.round(d * 1000 / 10) * 10 + ' m' : (d < 10 ? d.toFixed(1) : Math.round(d)) + ' km';
  function hull(pts) {
    if (pts.length < 3) return pts; const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (const q of p.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  const pct = (arr, q) => { const a = arr.slice().sort((x, y) => x - y); return a[Math.max(0, Math.min(a.length - 1, Math.round(q * (a.length - 1))))]; };

  /* ── Map: offline schematic first, Leaflet when a tile proves it can load ─ */
  function SchemMap(host, opts) {
    opts = opts || {};
    host.classList.add('map');
    host.innerHTML = '<svg class="schem" role="img" aria-label="Schematic map of the places listed; the list is the accessible equivalent"></svg><div class="lf" aria-hidden="true"></div>'
      + (opts.legend === false ? '' : '<div class="legend" aria-hidden="true"></div>')
      + '<div class="maphud"><span class="mapnote">Offline map · drawn from each place’s sourced coordinates</span></div>';
    const svg = $('svg', host), lfEl = $('.lf', host), note = $('.mapnote', host);
    let pts = [], focus = null, route = null, lf = null, layer = null, routeLayer = null;
    function draw() {
      const W = host.clientWidth || 600, H = host.clientHeight || 500;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      if (!pts.length) { svg.innerHTML = ''; return; }
      const base = focus || pts;
      const lat0 = base.reduce((s, r) => s + r.lat, 0) / base.length, kx = Math.cos(lat0 * Math.PI / 180);
      const q = base.length > 120 ? 0.1 : base.length > 25 ? 0.04 : 0;
      let x0 = pct(base.map(r => r.lng), q), x1 = pct(base.map(r => r.lng), 1 - q), y0 = pct(base.map(r => r.lat), q), y1 = pct(base.map(r => r.lat), 1 - q);
      if (x1 - x0 < 0.004) { x0 -= 0.004; x1 += 0.004; } if (y1 - y0 < 0.004) { y0 -= 0.004; y1 += 0.004; }
      const pad = 54, top = opts.legend === false ? 30 : 64, bot = 70 + (opts.bottom || 0) * H;
      const sc = Math.min((W - pad * 2) / ((x1 - x0) * kx), (H - top - bot) / (y1 - y0));
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const midY = top + (H - top - bot) / 2;
      const P = r => [W / 2 + (r.lng - cx) * kx * sc, midY + (cy - r.lat) * sc];
      let out = '';
      // graticule — a quiet engraved grid every ~1 km
      const step = 0.01 * Math.max(1, Math.round(80 / (0.01 * sc * kx)));
      for (let lg = Math.floor((cx - W / sc) / step) * step; lg < cx + W / sc; lg += step) { const x = W / 2 + (lg - cx) * kx * sc; if (x > 0 && x < W) out += `<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${H}" stroke="var(--map-grid)"/>`; }
      for (let la = Math.floor((cy - H / sc) / step) * step; la < cy + H / sc; la += step) { const y = midY + (cy - la) * sc; if (y > 0 && y < H) out += `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="var(--map-grid)"/>`; }
      const inb = ([x, y]) => x > 8 && x < W - 8 && y > 8 && y < H - bot + 40;
      // area hulls + labels
      const byA = {}; pts.forEach(r => { const p = P(r); if (inb(p)) (byA[r.a] = byA[r.a] || []).push(p); });
      let labels = ''; const placed = [];
      Object.keys(byA).sort((x, y) => byA[y].length - byA[x].length);
      Object.entries(byA).sort((x, y) => y[1].length - x[1].length).forEach(([a, ps]) => {
        const col = M.ac[a] || '#999';
        if (ps.length >= 5) out += `<polygon points="${hull(ps).map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${col}" fill-opacity="var(--map-hull)" stroke="${col}" stroke-opacity=".25" stroke-linejoin="round" stroke-width="1"/>`;
        if (ps.length >= 4 && !route) { const mx = ps.reduce((s, p) => s + p[0], 0) / ps.length, my = Math.max(top + 30, Math.min(...ps.map(p => p[1])) - 8);
          const lw = shortArea(a).length * 7.4 + 8;   // greedy collision check: skip a label that would overlap one already placed
          if (!placed.some(b => Math.abs(b[0] - mx) < (b[2] + lw) / 2 && Math.abs(b[1] - my) < 15)) { placed.push([mx, my, lw]);
            labels += `<text class="mlabel" x="${mx.toFixed(1)}" y="${my.toFixed(1)}" text-anchor="middle" paint-order="stroke" stroke="var(--map-bg)" stroke-width="4">${esc(shortArea(a))}</text>`; } }
      });
      // route
      if (route && route.length > 1) out += `<polyline points="${route.map(r => P(r).map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/>`;
      // points (sorted so must-sees sit on top)
      const edge = { n: 0, s: 0, e: 0, w: 0 };
      pts.slice().sort((a, b) => b.t - a.t).forEach(r => {
        let [x, y] = P(r); const col = M.ac[r.a] || '#888';
        if (!inb([x, y])) { if (y <= 8) edge.n++; else if (y >= H - bot + 40) edge.s++; else if (x >= W - 8) edge.e++; else edge.w++; return; }
        const rad = route ? 11 : (r.t === 1 ? 6.5 : r.t === 2 ? 4.6 : 3.4);
        const sel = S.sel === r.id;
        out += `<circle class="pt${sel ? ' sel' : ''}" data-id="${r.id}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sel ? rad + 3 : rad}" fill="${r.closed ? 'var(--paper)' : col}" fill-opacity="${r.closed ? 1 : r.t === 3 ? .55 : .9}" stroke="${r.closed ? 'var(--lacquer)' : 'var(--map-bg)'}" stroke-width="${r.closed ? 2 : 1.2}"><title>${esc(r.n)}</title></circle>`;
        if (route) out += `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" style="font:700 11px var(--text);fill:#fff;pointer-events:none">${route.indexOf(r) + 1}</text>`;
      });
      const et = (n, x, y, a, s) => n ? `<text class="edge" x="${x}" y="${y}" text-anchor="${a}">${s} ${n} further out</text>` : '';
      out += labels + et(edge.n, W / 2, top + 14, 'middle', '↑') + et(edge.s, W / 2, H - bot + 18, 'middle', '↓') + et(edge.e, W - 10, H / 2, 'end', '→') + et(edge.w, 10, H / 2, 'start', '←');
      svg.innerHTML = out;
      const lg = $('.legend', host);
      if (lg) { const seen = [...new Set(pts.map(r => r.a))]; lg.innerHTML = seen.slice(0, 7).map(a => `<span><i style="background:${M.ac[a]}"></i>${esc(shortArea(a))}</span>`).join('') + (seen.length > 7 ? `<span>+${seen.length - 7} areas</span>` : ''); }
    }
    svg.addEventListener('click', e => { const c = e.target.closest('.pt'); if (c && opts.onPick) opts.onPick(+c.dataset.id); });
    // Leaflet progressive enhancement — appended script element with onload/onerror (rule 3), never document.write
    function mountLeaflet() {
      if (!window.L || lf) return;
      try {
        lf = L.map(lfEl, { zoomControl: true, attributionControl: true, preferCanvas: true });
        const dark = isDark();
        const url = dark ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
        const tl = L.tileLayer(url, { maxZoom: 16, attribution: 'Tiles © Esri' });
        let ok = false;
        tl.on('tileload', () => { if (!ok) { ok = true; host.classList.add('live'); lfEl.setAttribute('aria-hidden', 'false'); if (note) note.remove(); } });
        tl.addTo(lf); syncLeaflet(true);
      } catch (e) { lf = null; }
    }
    function syncLeaflet(fit) {
      if (!lf) return;
      if (layer) layer.remove(); if (routeLayer) routeLayer.remove();
      layer = L.layerGroup(pts.map(r => L.circleMarker([r.lat, r.lng], { radius: r.t === 1 ? 7 : r.t === 2 ? 5 : 4, color: r.closed ? '#A8321F' : '#fff', weight: 1.2, fillColor: r.closed ? '#fff' : M.ac[r.a], fillOpacity: .9 })
        .on('click', () => opts.onPick && opts.onPick(r.id)).bindTooltip(r.n))).addTo(lf);
      if (route) routeLayer = L.polyline(route.map(r => [r.lat, r.lng]), { color: '#1D1B18', weight: 2, dashArray: '2 6' }).addTo(lf);
      const b = (focus || pts); if (fit && b.length) lf.fitBounds(b.map(r => [r.lat, r.lng]), { padding: [40, 40], maxZoom: 15 });
    }
    function loadLeaflet() {
      if (window.L) return mountLeaflet();
      const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'; document.head.appendChild(css);
      const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      s.onload = mountLeaflet; s.onerror = () => { /* stay on the schematic — content never depended on it */ };
      document.head.appendChild(s);
    }
    new ResizeObserver(() => draw()).observe(host);
    setTimeout(loadLeaflet, 50);
    return {
      set(list, o) { pts = list; o = o || {}; focus = o.focus || null; route = o.route || null; draw(); syncLeaflet(true); },
      redraw() { draw(); syncLeaflet(false); },
      flyTo(r) { if (lf) lf.setView([r.lat, r.lng], Math.max(lf.getZoom(), 15)); },
    };
  }

  /* ── shared UI pieces ──────────────────────────────────────────────────── */
  function tierHtml(r) {
    if (r.t === 1) return `<span class="tier t1">${I.seal}${r.kind === 'food' ? 'Must eat' : 'Must see'}</span>`;
    if (r.t === 2) return `<span class="tier t2">${I.diamond}Worth the detour</span>`;
    return `<span class="tier t3">${I.key}Deep cut</span>`;
  }
  // `k` is a know-before tip in most cities but bare search keywords in some (e.g. Chicago) — only voice real tips
  const tip = r => r.k && /[,.;:—–0-9A-Z]/.test(r.k) ? r.k : '';
  const dishLine = r => r.kind === 'food' && r.cz.length ? r.cz.map(c => (CZ[c] || c)).join(' · ') : '';
  const collLine = r => r.kind === 'sight' ? r.g.filter(g => g !== 'FREE').slice(0, 2).map(g => (CAT[g] || g).replace('★ ', '')).join(' · ') : '';
  function recChips(r, max) {
    max = max || 3;
    const s = r.s.slice(0, max).map(([l, u]) => u ? `<a class="src${AUTH.test(l) ? ' auth' : ''}" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>` : `<span class="src${AUTH.test(l) ? ' auth' : ''}">${esc(l)}</span>`).join('');
    return `<div class="recs"><span class="lbl">Recommended by</span>${s}${r.s.length > max ? `<span class="src">+${r.s.length - max}</span>` : ''}</div>`;
  }
  function cardHtml(r, o) {
    o = o || {};
    const fy = o.noFy ? '' : forYou(r);
    const sub = dishLine(r) || collLine(r);
    const free = r.kind === 'sight' && r.g.includes('FREE') ? ' · Free' : '';
    return `<article class="card${r.closed ? ' closed' : ''}${fy ? ' hl' : ''}" data-id="${r.id}">
      <div class="top"><span class="adot" style="background:${M.ac[r.a]}"></span><span class="aname">${esc(shortArea(r.a))}${o.compact ? '' : `<span class="kind"> · ${r.kind === 'food' ? 'Eat & drink' : 'Sight'}${free}</span>`}</span><span class="sp"></span>${r.closed ? '<span class="closedtag">Closed</span>' : tierHtml(r)}</div>
      ${fy ? `<span class="foryou${fy.includes('pop') ? ' pop' : ''}">${I.spark}${esc(fy)}</span>` : ''}
      <h3><a href="#place-${r.id}" data-open="${r.id}">${esc(r.n)}</a></h3>
      ${r.jp ? `<p class="jp cjk" lang="ja">${esc(r.jp)}</p>` : ''}
      ${r.closed ? `<p class="closedwhy">Permanently closed — kept on the map for the record, never as a suggestion.</p>` : ''}
      ${sub ? `<span class="dish">${esc(sub)}</span>` : ''}
      <p class="why">${esc(r.w)}</p>
      ${tip(r) && !o.compact ? `<p class="note">${I.spark}<span>${esc(r.k)}</span></p>` : ''}
      ${recChips(r)}
      ${o.compact ? '' : `<div class="acts"><button class="iconbtn" data-save="${r.id}" aria-pressed="${S.saved.has(r.id)}" aria-label="Save ${esc(r.n)}" title="Save">${I.heart}</button>
        <button class="iconbtn" data-day="${r.id}" aria-label="Add ${esc(r.n)} to a day" title="Add to a day" ${r.closed ? 'disabled' : ''}>${I.plus}</button>
        <button class="iconbtn" data-show="${r.id}" aria-label="Show ${esc(r.n)} on the map" title="Show on map">${I.pin}</button></div>`}
    </article>`;
  }
  let toastT;
  function toast(msg) { let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); } t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2400); }

  /* ── detail sheet ──────────────────────────────────────────────────────── */
  let lastFocus = null;
  function openSheet(id) {
    const r = R[id]; if (!r) return;
    S.sel = id; if (mapApi) mapApi.redraw();
    const near = R.filter(x => x.id !== id && !x.closed).map(x => [x, km(r, x)]).sort((a, b) => a[1] - b[1]).slice(0, 4);
    const sheet = $('#sheet'), body = $('.sbody', sheet);
    const apple = `https://maps.apple.com/?ll=${r.lat},${r.lng}&q=${encodeURIComponent(r.n)}`;
    const osm = `https://www.openstreetmap.org/?mlat=${r.lat}&mlon=${r.lng}#map=17/${r.lat}/${r.lng}`;
    body.innerHTML = `
      <div class="top" style="display:flex;gap:8px;align-items:center;font:600 12.5px var(--text);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-2)">
        <span class="adot" style="width:9px;height:9px;border-radius:50%;background:${M.ac[r.a]}"></span>${esc(shortArea(r.a))} · ${esc(M.name)}</div>
      <h2 id="sheet-title">${esc(r.n)}</h2>${r.jp ? `<p class="jp cjk" lang="ja">${esc(r.jp)}</p>` : ''}
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">${r.closed ? '<span class="closedtag">Permanently closed</span>' : tierHtml(r)}${dishLine(r) || collLine(r) ? `<span class="dish" style="color:var(--jade);font-weight:600;font-size:14px">${esc(dishLine(r) || collLine(r))}</span>` : ''}</div>
      <p class="why">${esc(r.w)}</p>
      ${tip(r) ? `<div class="butler">${I.bell}<p><span class="who">Your guide’s note</span>${esc(tip(r))}</p></div>` : ''}
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn primary" data-save="${r.id}" aria-pressed="${S.saved.has(r.id)}">${I.heart}${S.saved.has(r.id) ? 'Saved' : 'Save'}</button>
        <a class="btn" href="itinerary.html?area=${r.a}${S.prefs ? '&prefs=' + (S.prefs.interests || []).join(',') : ''}">${I.route}Plan a day in ${esc(shortArea(r.a))}</a>
      </div>
      <p class="h4">Recommended by · ${r.s.length} source${r.s.length > 1 ? 's' : ''}</p>
      <ul class="reclist">${r.s.map(([l, u]) => `<li><a href="${esc(u || '#')}" target="_blank" rel="noopener"><span class="badge">${esc(l[0])}</span><span class="nm">${esc(l)}</span><span class="u">${esc((u || '').replace(/^https?:\/\/(www\.)?/, ''))}</span>↗</a></li>`).join('')}</ul>
      <dl class="facts2">
        <dt>Address</dt><dd>${esc(r.ad)}<br><a href="${apple}" target="_blank" rel="noopener">Apple Maps ↗</a> · <a href="${osm}" target="_blank" rel="noopener">OpenStreetMap ↗</a></dd>
        <dt>Status</dt><dd>${r.closed ? '<span class="bad">Permanently closed</span>' : r.status === 'open' ? '<span class="ok">Open</span>' : 'Not yet checked'}${r.statusChecked ? ` · checked ${esc(r.statusChecked)}` : ''}${r.statusSource ? `<br><small style="color:var(--ink-2)">${esc(r.statusSource)}</small>` : ''}</dd>
        <dt>Pin</dt><dd>${esc(r.conf)} confidence${r.verified ? ` · verified ${esc(r.verified)}` : ''}<br><small style="color:var(--ink-2)">${esc(r.geoSource)}</small></dd>
      </dl>
      <p class="h4">Close by · straight-line</p>
      <div class="near">${near.map(([x, d]) => `<button data-open="${x.id}"><span class="adot" style="width:8px;height:8px;border-radius:50%;background:${M.ac[x.a]}"></span><span><b style="font-weight:600">${esc(x.n)}</b><br><small style="color:var(--ink-2)">${x.kind === 'food' ? esc(dishLine(x) || 'Eat & drink') : esc(collLine(x) || 'Sight')}</small></span><span class="d">${fmtKm(d)}</span></button>`).join('')}</div>`;
    lastFocus = document.activeElement;
    sheet.classList.add('open'); $('#scrim').classList.add('open'); sheet.setAttribute('aria-hidden', 'false');
    body.scrollTop = 0; setTimeout(() => $('.shead .iconbtn', sheet).focus(), 30);
    if (mapApi) mapApi.flyTo(r);
  }
  function closeSheet() { const sh = $('#sheet'); if (!sh) return; sh.classList.remove('open'); $('#scrim').classList.remove('open'); sh.setAttribute('aria-hidden', 'true'); if (lastFocus) lastFocus.focus(); }

  /* ── concierge ─────────────────────────────────────────────────────────── */
  function openConcierge() {
    const el = $('#concierge'); if (!el) return;
    const cur = S.prefs || { interests: [], vibe: '' };
    const pick = new Set(cur.interests); let vibe = cur.vibe;
    const hr = new Date().getHours(), greet = hr < 12 ? 'Good morning.' : hr < 18 ? 'Good afternoon.' : 'Good evening.';
    el.innerHTML = `<div class="cpanel" role="dialog" aria-modal="true" aria-labelledby="c-title">
      <p class="eyebrow">Your guide · ${esc(M.name)}</p>
      <h2 id="c-title">${greet} What are you in the mood for?</h2>
      <p class="lead">Two taps and I’ll lead with what you love — nothing is hidden, everything else stays one scroll away.</p>
      <p class="step">1 · I’m into <span style="font-weight:500;text-transform:none;letter-spacing:0">(pick any)</span></p>
      <div class="picks">${INTERESTS.map(i => `<button class="pick" data-i="${i.id}" aria-pressed="${pick.has(i.id)}">${I[i.icon]}<span><b>${i.label}</b><small>${i.sub}</small></span></button>`).join('')}</div>
      <p class="step">2 · The mood</p>
      <div class="vibes">${VIBES.map(v => `<button class="chip" data-v="${v.id}" aria-pressed="${vibe === v.id}">${v.label}</button>`).join('')}</div>
      <div class="cfoot"><button class="btn primary" data-go>Curate my ${esc(M.name)}</button><button class="btn" data-skip>Just browse</button>
        <span class="note">Kept on this device only. Clear it any time.</span></div></div>`;
    el.classList.add('open');
    el.onclick = e => {
      const p = e.target.closest('[data-i]'), v = e.target.closest('[data-v]');
      if (p) { const i = p.dataset.i; pick.has(i) ? pick.delete(i) : pick.add(i); p.setAttribute('aria-pressed', pick.has(i)); }
      if (v) { vibe = vibe === v.dataset.v ? '' : v.dataset.v; $$('[data-v]', el).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === vibe)); }
      if (e.target.closest('[data-go]')) { S.prefs = pick.size || vibe ? { interests: [...pick], vibe } : null; store.set('prefs', S.prefs); S.sort = S.prefs ? 'foryou' : 'area'; S.shown = 30; closeC(); render(); toast(S.prefs ? 'Curated. Your picks lead; everything else follows.' : 'Browsing everything.'); }
      if (e.target.closest('[data-skip]') || e.target === el) { if (!S.prefs) store.set('prefs', null); closeC(); }
    };
    function closeC() { el.classList.remove('open'); el.innerHTML = ''; }
    setTimeout(() => $('.pick', el).focus(), 30);
  }

  /* ── city page ─────────────────────────────────────────────────────────── */
  let mapApi = null, mobMap = null;
  function filtered() {
    return R.filter(r => (S.mode === 'all' || r.kind === S.mode) && (S.area === 'ALL' || r.a === S.area)
      && (!S.coll || (S.coll.startsWith('cz:') ? r.cz.includes(S.coll.slice(3)) : S.coll === 'saved' ? S.saved.has(r.id) : r.g.includes(S.coll))));
  }
  function ordered(list) {
    if (S.here) return list.slice().sort((a, b) => km(S.here, a) - km(S.here, b));
    if (S.sort === 'foryou') return list.slice().sort((a, b) => personal(b) - personal(a));
    const ord = Object.fromEntries(M.areas.map((a, i) => [a.id, i]));
    return list.slice().sort((a, b) => ord[a.a] - ord[b.a] || a.closed - b.closed || a.t - b.t || (a.kind === b.kind ? 0 : a.kind === 'sight' ? -1 : 1) || personal(b) - personal(a));
  }
  function renderRibbon() {
    const rb = $('#ribbon'); if (!rb) return;
    if (S.prefs) {
      const lab = [...(S.prefs.interests || []).map(i => INTERESTS.find(x => x.id === i).label), ...(S.prefs.vibe ? [VIBES.find(v => v.id === S.prefs.vibe).label] : [])];
      rb.innerHTML = `${I.spark}<span>Curated for <b>${esc(lab.join(' · ').toLowerCase())}</b> — your picks lead, all ${R.length} places stay listed.</span><button data-concierge>Change</button>`;
    } else rb.innerHTML = `${I.bell}<span><b>Tell your guide what you love</b> — history, food, pop culture — and ${esc(M.name)} reorders itself around you.</span><button data-concierge>Start · 2 taps</button>`;
  }
  function renderTools() {
    const n = k => R.filter(r => k === 'all' || r.kind === k).length;
    const colls = M.cats.filter(c => R.some(r => r.g.includes(c.id)));
    const czs = M.cuisines.filter(c => R.some(r => r.cz.includes(c.id)));
    $('#tools').innerHTML = `<div class="wrap"><div class="row" role="toolbar" aria-label="Filters">
      <div class="seg" role="group" aria-label="Show">${[['all', 'Everything'], ['sight', 'Sights'], ['food', 'Eat & drink']].map(([k, l]) => `<button data-mode="${k}" aria-pressed="${S.mode === k}">${l}<small>${n(k)}</small></button>`).join('')}</div>
      <span class="vr"></span>
      <label class="sr" for="areaSel">Jump to area</label>
      <select class="chip" id="areaSel"><option value="ALL">All ${M.areas.length} areas</option>${M.areas.map(a => `<option value="${a.id}"${S.area === a.id ? ' selected' : ''}>${esc(shortArea(a.id))}</option>`).join('')}</select>
      <label class="sr" for="collSel">Collection</label>
      <select class="chip" id="collSel"><option value="">All collections</option><option value="saved"${S.coll === 'saved' ? ' selected' : ''}>♡ Saved (${S.saved.size})</option><optgroup label="Sights">${colls.map(c => `<option value="${c.id}"${S.coll === c.id ? ' selected' : ''}>${esc(c.n)}</option>`).join('')}</optgroup><optgroup label="Eat & drink">${czs.map(c => `<option value="cz:${c.id}"${S.coll === 'cz:' + c.id ? ' selected' : ''}>${esc(c.n)}</option>`).join('')}</optgroup></select>
      ${colls.filter(c => /★/.test(c.n)).map(c => `<button class="chip pop" data-coll="${c.id}" aria-pressed="${S.coll === c.id}">${I.spark}${esc(c.n.replace('★ ', ''))}<span class="n">${R.filter(r => r.g.includes(c.id)).length}</span></button>`).join('')}
      <span class="vr"></span>
      <button class="chip" data-sort="foryou" aria-pressed="${S.sort === 'foryou' && !S.here}">${I.spark}For you</button>
      <button class="chip" data-sort="area" aria-pressed="${S.sort === 'area' && !S.here}">By area</button>
      <button class="chip" data-near aria-pressed="${!!S.here}">${I.locate}Near me</button>
    </div></div>`;
  }
  function render() {
    renderRibbon(); renderTools();
    const list = ordered(filtered());
    const vis = list.slice(0, S.shown);
    let html = '', lastA = null;
    const byArea = S.sort === 'area' && !S.here;
    vis.forEach(r => {
      if (byArea && r.a !== lastA) {
        if (lastA !== null) html += '</div>';
        const tot = list.filter(x => x.a === r.a).length;
        html += `<header class="areahead" id="area-${r.a}"><span class="dot" style="background:${M.ac[r.a]}"></span><div><h2>${esc(shortArea(r.a))}</h2><p class="sub">${esc(areaSub(r.a))}</p></div><span class="n">${tot} place${tot > 1 ? 's' : ''}</span></header><div class="cards">`;
        lastA = r.a;
      }
      if (!byArea && !lastA) { html += '<div class="cards">'; lastA = '_'; }
      html += cardHtml(r);
    });
    if (lastA !== null) html += '</div>';
    const rest = list.length - vis.length;
    html += rest > 0 ? `<div class="more" id="more"><button class="btn" data-more>Show ${Math.min(30, rest)} more</button><span>${rest} more below · nothing is left out</span></div>` : `<div class="more"><span>That’s all ${list.length} — every place in this view.</span></div>`;
    $('#list').innerHTML = html;
    const closedN = list.filter(r => r.closed).length;
    $('#count').innerHTML = `<b>${list.length}</b> of ${R.length} places${S.area !== 'ALL' ? ` in ${esc(shortArea(S.area))}` : ''}${closedN ? ` · ${closedN} closed, kept for the record` : ''}${S.here ? ' · nearest first' : S.sort === 'foryou' ? ' · your picks first' : ' · by area'}`;
    const focus = S.area === 'ALL' ? null : list;
    if (mapApi) mapApi.set(list, { focus });
    if (mobMap && $('#mapsheet').classList.contains('open')) { mobMap.set(list, { focus }); renderPeek(list); }
    const fab = $('#fab'); if (fab) fab.innerHTML = `${I.map}Map · ${list.length}`;
  }
  function renderPeek(list) {
    const p = $('#peek'); if (!p) return;
    const sel = S.sel != null ? R[S.sel] : null;
    const items = sel ? [sel, ...list.filter(r => r.id !== sel.id).map(r => [r, km(sel, r)]).sort((a, b) => a[1] - b[1]).slice(0, 9).map(x => x[0])] : list.slice(0, 10);
    p.innerHTML = `<div class="grab"></div><p class="hint">${sel ? 'Selected · then what’s closest' : `Top of your list · tap any pin`} — ${list.length} on the map</p><div class="carousel">${items.map(r => cardHtml(r, { compact: true })).join('')}</div>`;
  }

  function initCity() {
    document.title = `${M.name} — your guide`;
    mapApi = SchemMap($('#map'), { onPick: id => { openSheet(id); } });
    render();
    document.addEventListener('click', e => {
      const t = e.target;
      const o = t.closest('[data-open]'); if (o) { e.preventDefault(); openSheet(+o.dataset.open); return; }
      const sv = t.closest('[data-save]');
      if (sv) { const id = +sv.dataset.save; S.saved.has(id) ? S.saved.delete(id) : S.saved.add(id); store.set('saved.' + M.key, [...S.saved]);
        $$(`[data-save="${id}"]`).forEach(b => { b.setAttribute('aria-pressed', S.saved.has(id)); if (b.classList.contains('btn')) b.innerHTML = I.heart + (S.saved.has(id) ? 'Saved' : 'Save'); });
        toast(S.saved.has(id) ? `Saved · ${R[id].n}` : 'Removed from saved'); return; }
      const dy = t.closest('[data-day]'); if (dy) { const id = +dy.dataset.day; location.href = `itinerary.html?area=${R[id].a}&start=${id}${S.prefs ? '&prefs=' + (S.prefs.interests || []).join(',') : ''}`; return; }
      const sh = t.closest('[data-show]'); if (sh) { S.sel = +sh.dataset.show; if (innerWidth < 1024) openMobileMap(); else { mapApi.redraw(); mapApi.flyTo(R[S.sel]); } return; }
      if (t.closest('[data-concierge]')) { openConcierge(); return; }
      const md = t.closest('[data-mode]'); if (md) { S.mode = md.dataset.mode; S.shown = 30; render(); return; }
      const so = t.closest('[data-sort]'); if (so) { S.sort = so.dataset.sort; S.here = null; S.shown = 30; render(); return; }
      const co = t.closest('[data-coll]'); if (co) { S.coll = S.coll === co.dataset.coll ? '' : co.dataset.coll; S.shown = 30; render(); return; }
      if (t.closest('[data-more]')) { S.shown += 30; render(); return; }
      if (t.closest('[data-near]')) {
        if (S.here) { S.here = null; render(); return; }
        if (!navigator.geolocation) return toast('Location isn’t available here — try an area instead.');
        navigator.geolocation.getCurrentPosition(p => { S.here = { lat: p.coords.latitude, lng: p.coords.longitude }; S.shown = 30; render(); toast('Nearest first.'); },
          () => toast('Location isn’t available here — try an area instead.'), { timeout: 6000 });
        return;
      }
      const card = t.closest('.card'); if (card && !t.closest('a,button')) { openSheet(+card.dataset.id); return; }
      if (t.closest('[data-closesheet]') || t.id === 'scrim') closeSheet();
      if (t.closest('[data-theme-toggle]')) { const d = !isDark(); applyTheme(d ? 'dark' : 'light'); store.set('theme', d ? 'dark' : 'light'); themeBtn(); if (mapApi) mapApi.redraw(); }
      if (t.closest('#fab')) openMobileMap();
      if (t.closest('[data-closemap]')) { $('#mapsheet').classList.remove('open'); document.body.style.overflow = ''; }
    });
    document.addEventListener('change', e => {
      if (e.target.id === 'areaSel') { S.area = e.target.value; S.shown = 30; render(); if (S.area !== 'ALL' && S.sort === 'area') { const h = document.getElementById('area-' + S.area); if (h) h.scrollIntoView({ behavior: 'smooth' }); } }
      if (e.target.id === 'collSel') { S.coll = e.target.value; S.shown = 30; render(); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSheet(); const c = $('#concierge.open'); if (c) { c.classList.remove('open'); c.innerHTML = ''; } } });
    // progressive rendering: auto-extend as the sentinel nears the viewport (button stays for keyboard users)
    new IntersectionObserver(es => { if (es.some(x => x.isIntersecting) && $('#more')) { S.shown += 30; render(); } }, { rootMargin: '600px' }).observe($('#sentinel'));
    themeBtn();
    if (Q.get('concierge')) setTimeout(openConcierge, 80);
    if (Q.get('open')) { const pickR = R.find(r => /Sensō-ji|Senso-ji/i.test(r.n)) || R.find(r => r.t === 1 && r.k); setTimeout(() => openSheet(pickR.id), 120); }
    if (Q.get('view') === 'map') { S.sel = (R.find(r => /Sensō-ji/i.test(r.n)) || R[0]).id; setTimeout(openMobileMap, 80); }
  }
  function openMobileMap() {
    const ms = $('#mapsheet'); ms.classList.add('open'); document.body.style.overflow = 'hidden';
    if (!mobMap) mobMap = SchemMap($('#mmap'), { legend: false, bottom: 0.48, onPick: id => { S.sel = id; mobMap.redraw(); renderPeek(ordered(filtered())); } });
    const list = ordered(filtered());
    const sel = S.sel != null ? R[S.sel] : null;
    mobMap.set(list, { focus: sel ? list.filter(r => r.a === sel.a) : (S.area === 'ALL' ? null : list) });
    renderPeek(list);
  }
  function themeBtn() { const b = $('[data-theme-toggle]'); if (b) { b.innerHTML = isDark() ? I.sun : I.moon; b.setAttribute('aria-label', isDark() ? 'Switch to day mode' : 'Switch to night-out mode'); } }

  window.Cleo = { store, I, R, M, shortArea, areaSub, km, fmtKm, personal, tags, cardHtml, tierHtml, dishLine, collLine, SchemMap, toast, isDark, applyTheme, themeBtn, esc, AUTH, INTERESTS, VIBES, S };
  document.addEventListener('DOMContentLoaded', () => {
    $$('[data-icon]').forEach(el => { el.innerHTML = I[el.dataset.icon] + el.innerHTML; });
    if ($('#list')) initCity();
  });
})();
