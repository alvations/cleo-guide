// R6 evaluator: D2 "Atlas is map-first" acceptance, measured on the pinned tree. Usage: node probe-atlas.js <port> [page]
// Phone: map box, tray detents (peek/half/full heights), controls present, pin → sheet → Back, locate is opt-in, Must see.
// Desktop: map share, list width, numbered pins vs ranks, card hover → pin, pin click → card, fly-to on #p=.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const port = process.argv[2] || 8801, page = process.argv[3] || 'cities/tokyo.html';
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48+cPAAXxAvkqF6tIAAAAAElFTkSuQmCC', 'base64');
const U = `http://127.0.0.1:${port}/beta/${page}`;
const route = ctx => ctx.route('**/*', r => { const u = r.request().url(); if (u.startsWith('http://127.0.0.1')) return r.continue(); if (/tile\.openstreetmap|arcgisonline/.test(u)) return r.fulfill({ body: TILE, contentType: 'image/png' }); return r.abort(); });
const geoSpy = () => { window.__geo = 0; const g = navigator.geolocation; if (g) { const o = g.getCurrentPosition.bind(g), w = g.watchPosition.bind(g); g.getCurrentPosition = (...a) => { window.__geo++; return o(...a); }; g.watchPosition = (...a) => { window.__geo++; return w(...a); }; } };
const box = (p, sel) => p.evaluate(s => { const e = [...document.querySelectorAll(s)].find(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; }, sel);
(async () => {
  const b = await chromium.launch(); const R = { page };
  // ---------- phone ----------
  { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce', geolocation: { latitude: 35.70, longitude: 139.77 }, permissions: ['geolocation'] });
    await route(ctx); await ctx.addInitScript(geoSpy);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 90)));
    await p.goto(U + '#view=atlas', { waitUntil: 'load' }); await p.waitForTimeout(2500);
    const ph = {};
    ph.map = await box(p, '.leaflet-container');
    ph.peekTray = await p.evaluate(() => { const t = document.querySelector('.atlas-peek'); const tr = t && (t.closest('[data-cleo-tray], .tray, aside, section') || t); const r = tr && tr.getBoundingClientRect(); return r ? { top: Math.round(r.top), visibleH: Math.round(innerHeight - r.top) } : null; });
    ph.peekText = await p.evaluate(() => (document.querySelector('.atlas-peek') || {}).innerText?.replace(/\s+/g, ' ').slice(0, 120));
    ph.controls = await p.evaluate(() => [...document.querySelectorAll('.m-base, .m-legend, .m-locate, .m-must, .leaflet-control-zoom a')].filter(e => e.getBoundingClientRect().width > 0).map(e => (e.className.split(' ')[0] + ':' + (e.textContent.trim() || e.getAttribute('aria-label') || e.title || '')).slice(0, 40)));
    ph.geoCallsAtLoad = await p.evaluate(() => window.__geo);
    ph.markers = await p.evaluate(() => { const m = [...document.querySelectorAll('.leaflet-marker-icon')]; return { all: m.length, clusters: m.filter(e => e.classList.contains('pin-cl')).length, labelled: m.filter(e => /\d/.test(e.textContent)).length }; });
    for (const d of ['half', 'full', 'peek']) { await p.evaluate(v => Cleo.city.detent(v), d); await p.waitForTimeout(700);
      ph['tray_' + d] = await p.evaluate(() => { const t = document.querySelector('.atlas-peek'); const el = t && t.parentElement; let n = el; while (n && n.parentElement && getComputedStyle(n).position !== 'fixed') n = n.parentElement; const r = (n || el).getBoundingClientRect(); return { top: Math.round(r.top), shareOfScreen: Math.round((innerHeight - Math.max(0, r.top)) / innerHeight * 100) + '%', mapVisiblePx: Math.max(0, Math.round(r.top) - 60) }; }); }
    // zoom in until individual pins appear in the map's visible band, tap one
    let tapped = null;
    for (let z = 0; z < 4 && !tapped; z++) {
      const pt = await p.evaluate(() => { const H = innerHeight, T = document.querySelector('.atlas-peek'); let lim = H * 0.7; if (T) { let n = T.parentElement; while (n && n.parentElement && getComputedStyle(n).position !== 'fixed') n = n.parentElement; lim = Math.min(lim, (n || T).getBoundingClientRect().top - 10); }
        const ms = [...document.querySelectorAll('.leaflet-container path.leaflet-interactive')].map(m => [m, m.getBoundingClientRect()]).filter(([m, r]) => r.width > 0 && r.top > 250 && r.bottom < lim && r.left > 20 && r.right < innerWidth - 70);
        if (!ms.length) return null; const [m, r] = ms[0]; return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: Math.round(r.width), h: Math.round(r.height), candidates: ms.length }; });
      if (pt) { await p.mouse.click(pt.x, pt.y); await p.waitForTimeout(1200); tapped = pt; break; }
      const zin = await p.$('.leaflet-control-zoom-in'); if (zin) { await zin.click(); await p.waitForTimeout(900); }
    }
    ph.pinTap = tapped;
    ph.afterPin = await p.evaluate(() => { const d = [...document.querySelectorAll('#cleo-poi, dialog[open], [role=dialog]')].find(e => e.getBoundingClientRect().height > 0 && getComputedStyle(e).visibility !== 'hidden'); return { open: !!d, text: d ? d.innerText.replace(/\s+/g, ' ').slice(0, 90) : null, hash: location.hash }; });
    await p.screenshot({ path: process.env.OUT ? process.env.OUT + '/atlas-pin-m.jpg' : '/dev/null', type: 'jpeg', quality: 70 }).catch(() => {});
    if (ph.afterPin.open) { await p.goBack(); await p.waitForTimeout(900); ph.afterBack = await p.evaluate(() => { const d = [...document.querySelectorAll('#cleo-poi, dialog[open], [role=dialog]')].find(e => e.getBoundingClientRect().height > 0 && getComputedStyle(e).visibility !== 'hidden'); return { open: !!d, hash: location.hash, url: location.pathname.slice(-20) }; }); }
    // locate is opt-in: tap it, count the geolocation calls
    const loc = await p.$('.m-locate >> visible=true'); if (loc) { await loc.click(); await p.waitForTimeout(800); ph.geoCallsAfterLocateTap = await p.evaluate(() => window.__geo); ph.storedGeo = await p.evaluate(() => { try { return Object.keys(localStorage).filter(k => /geo|loc|near/i.test(k) && /\d+\.\d+/.test(localStorage.getItem(k))); } catch (e) { return 'n/a'; } }); }
    const base = await p.$('.m-base >> visible=true'); if (base) { await base.click(); await p.waitForTimeout(500); ph.baseOptions = await p.evaluate(() => [...document.querySelectorAll('[role=menuitemradio], [role=radio], .m-base-opt, .am-row button, .am-row label')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.textContent.trim().slice(0, 30))); ph.baseLabelAfter = await p.evaluate(() => (document.querySelector('.m-base') || {}).textContent?.trim()); await p.keyboard.press('Escape'); }
    const leg = await p.$('.m-legend >> visible=true'); if (leg) { await leg.click(); await p.waitForTimeout(500); ph.legend = await p.evaluate(() => { const l = [...document.querySelectorAll('.m-legend, .leaflet-control, [class*=legend]')].map(e => e.innerText).join(' ').replace(/\s+/g, ' '); return l.slice(0, 200); }); }
    ph.errors = errs; R.phone = ph; await ctx.close(); }
  // ---------- desktop ----------
  { const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); await route(ctx); await ctx.addInitScript(geoSpy);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 90)));
    await p.goto(U + '#view=atlas', { waitUntil: 'load' }); await p.waitForTimeout(2500);
    const d = {};
    d.map = await box(p, '.leaflet-container'); d.mapShare = d.map ? Math.round(d.map[2] / 1440 * 100) + '%' : null;
    d.list = await p.evaluate(() => { const l = document.querySelector('ol.pls'); const r = l && l.getBoundingClientRect(); return r ? [Math.round(r.left), Math.round(r.width), Math.round(r.width / innerWidth * 100) + '%'] : null; });
    d.controls = await p.evaluate(() => [...document.querySelectorAll('.m-base, .m-legend, .m-locate, .m-must')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.className.split(' ')[0] + ':' + e.textContent.trim().slice(0, 30)));
    d.markers = await p.evaluate(() => { const m = [...document.querySelectorAll('.leaflet-marker-icon, .leaflet-tooltip')]; return { all: m.length, clusters: m.filter(e => e.classList.contains('pin-cl')).length, labelled: m.filter(e => /\d/.test(e.textContent)).length, paths: document.querySelectorAll('.leaflet-container path.leaflet-interactive').length, sample: m.slice(0, 6).map(e => e.className.replace(/leaflet-\S+/g, '').trim() + ':' + e.textContent.trim()) }; });
    // rank match: first 5 card numbers in the first area vs pin labels present
    d.rankMatch = await p.evaluate(() => { const nums = [...document.querySelectorAll('ol.pls > li')].slice(0, 8).map(li => (li.querySelector('.n, .rank, [class*=num]') || {}).textContent?.trim()).filter(Boolean); const labs = new Set([...document.querySelectorAll('.leaflet-tooltip, .leaflet-marker-icon')].map(m => m.textContent.trim())); return { cardNums: nums, foundOnMap: nums.filter(n => labs.has(n)).length }; });
    // hover first card -> pin hot
    const li = await p.$('ol.pls > li'); if (li) { await li.hover(); await p.waitForTimeout(500); d.hoverHot = await p.evaluate(() => [...document.querySelectorAll('.leaflet-container path, .leaflet-tooltip, .leaflet-marker-icon')].filter(e => /\b(hot|is-hot|on|sel|active)\b/.test(e.getAttribute('class') || '')).map(e => e.tagName + '.' + (e.getAttribute('class') || '').replace(/leaflet-\S+/g, '').trim() + ':' + e.textContent.trim()).slice(0, 3)); }
    // click a visible numbered pin -> card highlighted
    const pin = await p.evaluate(() => { const m = [...document.querySelectorAll('.leaflet-container path.leaflet-interactive')].map(e => [e, e.getBoundingClientRect()]).filter(([e, r]) => r.width > 0 && r.left > 700 && r.top > 300 && r.bottom < 860); if (!m.length) return null; const [e, r] = m[Math.floor(m.length / 2)]; return { x: r.left + r.width / 2, y: r.top + r.height / 2, cls: e.getAttribute('class') }; });
    if (pin) { await p.mouse.click(pin.x, pin.y); await p.waitForTimeout(1500); d.pinClick = { pin, ...(await p.evaluate(() => { const h = document.querySelector('li.pl.is-focus, li.pl.is-hover, li.pl.hot'); const s = document.querySelector('#cleo-poi:not([hidden]), [role=dialog]'); return { cardLit: !!h, cardText: h ? h.innerText.replace(/\s+/g, ' ').slice(0, 60) : null, cardInView: h ? (r => r.top >= 0 && r.bottom <= innerHeight + 200)(h.getBoundingClientRect()) : null, sheet: !!(s && s.getBoundingClientRect().height), hash: location.hash }; })) }; }
    // fly to on #p=
    await p.goto(U + '#view=atlas&p=kanda-myojin', { waitUntil: 'load' }); await p.waitForTimeout(3000);
    d.flyTo = await p.evaluate(() => { const lc = document.querySelector('.leaflet-container'); const r = lc.getBoundingClientRect(); const hot = [...document.querySelectorAll('.leaflet-container path, .leaflet-tooltip, .leaflet-marker-icon')].find(m => /\b(hot|is-hot|open|sel|active)\b/.test(m.getAttribute('class') || '')); const hr = hot && hot.getBoundingClientRect(); return { hash: location.hash, pinCls: hot ? (hot.getAttribute('class') || '').replace(/leaflet-\S+/g, '').trim() : null, pinOffsetFromMapCentre: hr ? [Math.round(hr.left + hr.width / 2 - (r.left + r.width / 2)), Math.round(hr.top + hr.height / 2 - (r.top + r.height / 2))] : null }; });
    d.errors = errs; R.desktop = d; await ctx.close(); }
  await b.close(); console.log(JSON.stringify(R, null, 1));
})();
