/* atlas.js (FE-A, W6 map-first): the live map-centred guide's map tools, rebuilt for Atlas and loaded with the map
 * (city.js need('atlas')), so a visitor who never opens the map never pays for them.
 *   · pin clustering only at dense zooms: below zoom 13, when more than 40 pins show, pins closer than ~64 px gather into
 *     one count bubble; a tap zooms in (and, on desktop, brings the best-ranked place in it to the list). Day routes and
 *     zoom ≥ 13 never cluster. Nothing is hidden for good: every pin returns as you zoom in; the list holds every place.
 *   · area-colour legend; base-layer switch (OSM + Esri only, never a key-required host); locate-me (opt-in, one reading,
 *     kept in memory only — never stored, never sent); the Must-see filter on the map (the same t=1 lens as the filter
 *     tray, so the list follows). */
(() => {
  'use strict';
  const Cleo = window.Cleo || {}, C = Cleo.city, d = document; if (!C || C.atlasTools) return;
  const $ = (s, el) => (el || d).querySelector(s), at = (el, a) => el.getAttribute(a), on = (el, ev, f) => el && el.addEventListener(ev, f);
  const info = C.info, S = C.S, store = Cleo.store || { get: (k, x) => x, set: () => {} };
  const pl = n => n + (n === 1 ? ' place' : ' places'), rec = id => C.byId[id] || C.stub(id);
  const accent = () => ((window.getComputedStyle && getComputedStyle(d.getElementById('main')).getPropertyValue('--city')) || '').trim() || '#C23A1C';

  const CL_Z = 13, CL_N = 40, CL_PX = 64, inCl = C.inCl;
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
      const ids = cells[k]; if (ids.length < 3) return;
      const b = L.latLngBounds(ids.map(id => markers[id].getLatLng())), cnt = {};
      ids.forEach(id => { const a = at(rec(id), 'data-a'); cnt[a] = (cnt[a] || 0) + 1; });
      const a0 = Object.keys(cnt).sort((x, y) => cnt[y] - cnt[x])[0], ac = ((info.areas || {})[a0] || {}).c || accent();
      const best = ids.map(rec).sort((x, y) => (+at(x, 'data-t') || 9) - (+at(y, 'data-t') || 9) || C.num(x) - C.num(y))[0];
      const sz = ids.length < 10 ? 34 : ids.length < 50 ? 40 : 46;
      const m = L.marker(b.getCenter(), { icon: L.divIcon({ className: 'pin-cl', html: '<span style="--ac:' + ac + '">' + ids.length + '</span>', iconSize: [sz, sz] }),
        title: pl(ids.length) + ' here — zoom in', alt: pl(ids.length), keyboard: true, riseOnHover: true }).addTo(clL);
      m.on('click', () => {
        C.auto(); map.flyToBounds(b, { padding: [48, 48], maxZoom: CL_Z + 1, duration: C.still() ? 0 : 0.5, animate: !C.still() });
        if (C.desk()) { const id = C.pid(best), r = C.byId[id] || (Cleo.defer && Cleo.defer.stampFor(id)); if (r) C.pin(r); }
      });
      ids.forEach(id => { inCl[id] = m; if (map.hasLayer(markers[id])) map.removeLayer(markers[id]); });
    });
  };

  const BASE_N = { street: 'Street', light: 'Light', satellite: 'Satellite' }, BASE_K = Object.keys(BASE_N);
  let me = null, meL = null;
  const locate = b => {
    const map = C.map(), live = $('#cleo-view-live'), say = t => { if (live) live.textContent = t; b.title = t; };
    if (me) { C.fly(me); return; }
    if (!navigator.geolocation) { say('This browser can’t share a location.'); return; }
    b.classList.add('busy');
    navigator.geolocation.getCurrentPosition(p => {
      b.classList.remove('busy'); me = window.L.latLng(p.coords.latitude, p.coords.longitude); b.setAttribute('aria-pressed', 'true');
      if (!meL) meL = window.L.layerGroup().addTo(map); meL.clearLayers();
      if (p.coords.accuracy) window.L.circle(me, { radius: p.coords.accuracy, color: '#2F6FD0', weight: 1, opacity: 0.6, fillColor: '#2F6FD0', fillOpacity: 0.1, interactive: false }).addTo(meL);
      window.L.circleMarker(me, { radius: 7, color: '#fff', weight: 2, fillColor: '#2F6FD0', fillOpacity: 1, interactive: false, className: 'me' }).addTo(meL);
      say('You are here — shown on this device only, never stored, gone when you reload.'); C.fly(me);
    }, err => { b.classList.remove('busy'); say(err && err.code === 1 ? 'Location permission was declined. Nothing was stored.' : 'Couldn’t get your location.'); },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  };

  // the phone tray's peek line: the area chip (opens the area picker) of the first ranked place in the tray — the lensed
  // area, else the guide's first — and "All N" (opens the list). Still-deferred stubs count, so the numbers match the guide.
  const peek = () => {
    const lp = $('.listpane'), th = lp && $('.tray-head', lp); if (!th) return;
    let pk = $('.atlas-peek', th);
    if (!pk) {
      th.insertAdjacentHTML('beforeend', '<div class="atlas-peek"><button type="button" class="chip peek-a" data-cleo-tray="area" aria-haspopup="dialog"><i aria-hidden="true"></i><span class="t"></span> <span class="n"></span></button>' +
        '<button type="button" class="btn btn-ghost peek-list">' + C.icon('list') + '<span></span></button></div>');
      pk = $('.atlas-peek', th); on($('.peek-list', pk), 'click', () => C.detent('full', true));
    }
    const all = [].slice.call(lp.querySelectorAll('li.pl')).filter(x => !x.hidden), st = Cleo.defer ? Cleo.defer.peek() : [];
    const a = all[0] ? at(all[0], 'data-a') : '', x = (info.areas || {})[a] || {}, nm = x.n || a || info.name;
    const n = all.concat(st).filter(y => at(y, 'data-a') === a).length, N = all.length + st.length, ch = $('.peek-a', pk);
    ch.style.setProperty('--area', x.c || 'var(--city)'); $('.t', ch).textContent = nm; $('.n', ch).textContent = n || '';
    ch.setAttribute('aria-label', 'Area: ' + nm + (n ? ', ' + pl(n) : '') + '. Choose an area');
    $('.peek-list span', pk).textContent = 'All ' + N.toLocaleString('en-US'); $('.peek-list', pk).setAttribute('aria-label', 'Show the list, ' + pl(N));
  };
  C.after.push(peek); peek();
  // desktop: the split fills the rest of the first screen (map bottom = viewport bottom), measured, never guessed
  const sp = $('.split'), fit = C.fitSplit = () => { if (!sp || !C.desk() || C.view !== 'atlas') return; sp.style.removeProperty('--atlas-top');
    const t = Math.round(sp.getBoundingClientRect().top + (window.scrollY || 0)); if (t > 0) sp.style.setProperty('--atlas-top', t + 'px'); const m = C.map(); if (m) m.invalidateSize(); };
  let rt; on(window, 'resize', () => { clearTimeout(rt); rt = setTimeout(fit, 150); }); if (d.fonts && d.fonts.ready) d.fonts.ready.then(fit); requestAnimationFrame(fit);
  // two-way hover: a pin lights its card; a card lights the bubble its pin sits in
  Object.keys(C.markers).forEach(id => { const k = C.markers[id], hv = o => () => { const r = C.byId[id]; if (r) r.classList.toggle('is-hover', o); }; k.on('mouseover', hv(true)); k.on('mouseout', hv(false)); });
  ['mouseover', 'mouseout'].forEach((ev, i) => on(d, ev, e => { const c = e.target.closest && e.target.closest('li.pl'), m = c && inCl[C.pid(c)], el = m && m.getElement && m.getElement(); if (el) el.classList.toggle('hot', !i); }));

  // desktop: locate under the zoom (top left), Must see + map style top right, legend bottom left (open when ≤ 6 areas);
  // phones: zoom + locate on the right, Must see + style + legend on the left, under the switcher
  C.atlasTools = (L, el) => {
    const map = C.map(), desk = C.desk(), zs = desk ? 'topleft' : 'topright';
    const ctl = (pos, mk) => { const X = L.Control.extend({ options: { position: pos }, onAdd: () => { const n = mk(); L.DomEvent.disableClickPropagation(n); L.DomEvent.disableScrollPropagation(n); return n; } }); map.addControl(new X()); };
    const btn = (cls, lbl, html) => { const b = d.createElement('button'); b.type = 'button'; b.className = 'am-ctl ' + cls; b.setAttribute('aria-label', lbl); b.title = lbl; b.innerHTML = html; return b; };
    ctl(zs, () => { const b = btn('m-locate', 'Show my location on the map (stays on this device)', C.icon('locate')); on(b, 'click', () => locate(b)); return b; });
    ctl(desk ? 'topright' : 'topleft', () => {
      const w = d.createElement('div'); w.className = 'am-row';
      const t = btn('m-must', 'Must see only', '<i class="tg t1" aria-hidden="true"></i><span>Must see</span>'); t.setAttribute('aria-pressed', String(S.t === '1'));
      on(t, 'click', () => { const r = Cleo.route.parse(); delete r.p; if (r.t === '1') delete r.t; else r.t = '1'; C.go(r); });
      const s = btn('m-base', '', C.icon('grid') + '<span></span>');
      const lab = () => { const n = BASE_N[store.get('base', 'street')] || BASE_N.street; $('span', s).textContent = n; s.setAttribute('aria-label', 'Map style: ' + n + '. Change the map style'); s.title = 'Map style: ' + n; };
      on(s, 'click', () => { const k = store.get('base', 'street'); C.setBase(BASE_K[(BASE_K.indexOf(k) + 1) % BASE_K.length]); lab(); }); lab();
      w.appendChild(t); w.appendChild(s); return w;
    });
    ctl(desk ? 'bottomleft' : 'topleft', () => {
      const g = d.createElement('details'), used = {}; g.className = 'am-ctl m-legend';
      C.cards.concat(Cleo.defer ? Cleo.defer.peek() : []).forEach(c => { if (c.hasAttribute('data-ll')) used[at(c, 'data-a')] = 1; });
      const ar = C.sections.map(x => at(x, 'data-area')).filter(a => used[a] && (info.areas || {})[a]); if (desk && ar.length <= 6) g.open = true;
      g.innerHTML = '<summary>' + C.icon('info') + '<span>Legend</span></summary><ul>' +
        ar.map(a => '<li><i style="--ac:' + (info.areas[a].c || '#555') + '"></i>' + C.esc(info.areas[a].n || a) + '</li>').join('') +
        '<li class="k"><i class="big"></i>Big pin = Must see</li><li class="k"><i class="gone"></i>Grey pin = closed, kept for the record</li><li class="k"><b class="cl">12</b>Bubble = nearby pins, zoom in</li></ul>';
      return g;
    });
    C.after.push(() => { const t = el.querySelector('.m-must'); if (t) t.setAttribute('aria-pressed', String(S.t === '1')); });
  };
})();
