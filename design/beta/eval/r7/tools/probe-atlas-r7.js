// R7 evaluator: Atlas map-search residual probe (independent of tools/beta/atlas-ms.js, which I also re-ran).
// Measures what the lane probe does not: pin hit-target size, cluster vs rank-pin styling, carousel credit clipping,
// "last checked" on the first phone screen, day route vs the carousel, desktop page scroll on pin / deep link, the
// desktop rail, and the Must see chip. Tiles answered with a flat stub. Usage: node probe-atlas-r7.js <port> <out.json>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const [port, out] = process.argv.slice(2);
const B = `http://127.0.0.1:${port}/beta/`;
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48+cPAAXxAvkqF6tIAAAAAElFTkSuQmCC', 'base64');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const route = ctx => ctx.route('**/*', r => { const u = r.request().url(); if (u.startsWith('http://127.0.0.1')) return r.continue(); if (/tile\.openstreetmap|arcgisonline/.test(u)) return r.fulfill({ body: TILE, contentType: 'image/png' }); return r.abort(); });
const CITIES = [['tokyo', 'cities/tokyo.html', 'TAITO'], ['cleveland', 'cleveland.html', null], ['chinatown', 'Singapore/chinatown.html', null]];
const pinStats = () => {
  const vis = r => r.width > 0 && r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
  const pins = [...document.querySelectorAll('.leaflet-marker-icon.pp')].map(e => [e, (e.firstElementChild || e).getBoundingClientRect()]).filter(([, r]) => vis(r));
  const cls = [...document.querySelectorAll('.leaflet-marker-icon.pin-cl')].map(e => [e, e.getBoundingClientRect()]).filter(([, r]) => vis(r));
  const ws = pins.map(([, r]) => r.width).sort((a, b) => a - b), hs = pins.map(([, r]) => r.height).sort((a, b) => a - b);
  const st = e => { const s = getComputedStyle(e.firstElementChild || e); return s.backgroundColor + ' / ' + s.color + ' / r ' + s.borderTopLeftRadius; };
  return { rankPins: pins.length, clusters: cls.length, pinW: ws.length ? [ws[0], ws[ws.length >> 1], ws[ws.length - 1]].map(Math.round) : null, pinH: hs.length ? [hs[0], hs[hs.length >> 1], hs[hs.length - 1]].map(Math.round) : null,
    pinLook: pins[0] ? st(pins[0][0]) : null, clusterLook: cls[0] ? st(cls[0][0]) : null, clusterSize: cls[0] ? Math.round(cls[0][1].width) : null };
};
(async () => {
  const b = await chromium.launch(); const res = {};
  // ---------- phone ----------
  for (const [key, url, day] of CITIES) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' }); await route(ctx);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 100)));
    await p.goto(B + url + '#view=atlas', { waitUntil: 'load' }); await sleep(2000);
    const r = {};
    r.first = await p.evaluate(() => {
      const l = document.querySelector('.leaflet-container'), lr = l && l.getBoundingClientRect();
      const txt = re => [...document.querySelectorAll('body *')].filter(e => e.children.length === 0 && re.test(e.textContent)).map(e => { const q = e.getBoundingClientRect(); const h = q.width && document.elementFromPoint(Math.min(innerWidth - 1, q.left + 4), q.top + q.height / 2); return { t: e.textContent.trim().slice(0, 40), top: Math.round(q.top), shown: !!q.width && q.top >= 0 && q.bottom <= innerHeight && !!h && (e.contains(h) || h.contains(e)) }; });
      return { mapBox: lr && [Math.round(lr.top), Math.round(lr.height)], mapShare: lr ? +(Math.max(0, Math.min(lr.bottom, innerHeight) - Math.max(lr.top, 0)) * lr.width / innerWidth / innerHeight).toFixed(2) : null,
        lastChecked: txt(/last checked|checked to|status checked/i).filter(x => x.shown).slice(0, 2), lastCheckedAny: txt(/last checked|checked to|status checked/i).length };
    });
    r.open = await p.evaluate(pinStats);
    // zoom in through clusters until rank pins are in reach (same approach as the lane probe), then measure and tap one
    for (let i = 0; i < 4; i++) { const n = await p.evaluate(() => { const ok = e => { const r = (e.firstElementChild || e).getBoundingClientRect(); return r.width && r.left > 30 && r.right < innerWidth - 70 && r.top > 200 && r.bottom < innerHeight - 260; };
      if ([...document.querySelectorAll('.leaflet-marker-icon.pp')].filter(ok).length >= 3) return 0; const c = [...document.querySelectorAll('.leaflet-marker-icon.pin-cl')].find(ok); if (c) c.dispatchEvent(new MouseEvent('click', { bubbles: true })); return c ? 1 : 0; }); if (!n) break; await sleep(900); }
    r.zoomed = await p.evaluate(pinStats);
    const tp = await p.evaluate(() => { const els = [...document.querySelectorAll('.leaflet-marker-icon.pp')].map(e => e.firstElementChild.getBoundingClientRect()).filter(r => r.left > 30 && r.right < innerWidth - 70 && r.top > 200 && r.bottom < innerHeight - 260); const q = els[0]; return q ? { x: q.left + q.width - 2, y: q.top + 2, w: q.width, h: q.height } : null; });
    if (tp) { await p.touchscreen.tap(tp.x, tp.y); await sleep(900); }   // tap near the pill's corner: is the visible label the target?
    r.pinTap = await p.evaluate(() => { const c = document.querySelector('li.pl.is-sel'), q = c && c.getBoundingClientRect(); return { tappedCorner: true, card: c && c.id, inView: !!q && q.left >= -2 && q.right <= innerWidth + 2 && q.bottom > 0 && q.top < innerHeight }; });
    // carousel: is any photo credit clipped inside its card?
    r.carouselCredit = await p.evaluate(() => { const out = []; for (const li of [...document.querySelectorAll('.listpane li.pl')].filter(l => { const q = l.getBoundingClientRect(); return q.width && q.left < innerWidth && q.right > 0 && q.top < innerHeight && q.bottom > 0; }).slice(0, 4)) {
      for (const e of li.querySelectorAll('*')) { if (e.children.length > 2 || !/Photo/.test(e.textContent) || e.textContent.length > 200) continue; const q = e.getBoundingClientRect(); let a = e.parentElement, clip = false; while (a && a !== li.parentElement) { const s = getComputedStyle(a); if (/hidden|clip/.test(s.overflow + s.overflowX + s.overflowY)) { const ar = a.getBoundingClientRect(); if (q.bottom > ar.bottom + 1 || q.right > ar.right + 1 || q.top < ar.top - 1) clip = true; } a = a.parentElement; }
        if (e.scrollHeight > e.clientHeight + 2 || clip) { out.push({ li: li.id, text: e.textContent.trim().slice(0, 50), clip, fs: getComputedStyle(e).fontSize, box: [Math.round(q.width), Math.round(q.height)] }); break; } } } return out; });
    // Must see chip on the map bar
    r.mustChip = await p.evaluate(() => [...document.querySelectorAll('.ms-bar button, .ms-bar a, .ms-bar [role=button], .ms-bar label')].map(e => e.textContent.trim()).filter(t => /must/i.test(t)).slice(0, 2));
    // a day route: does it fit above the carousel?
    if (day) { await p.goto(B + url + '#view=atlas&day=' + day, { waitUntil: 'load' }); await sleep(2200);
      r.day = await p.evaluate(() => { const ps = [...document.querySelectorAll('path.leaflet-interactive')].filter(e => (e.getAttribute('stroke-dasharray') || '').length || +e.getAttribute('stroke-width') >= 3); const car = document.querySelector('.listpane'), cr = car && car.getBoundingClientRect();
        const pr = ps.map(e => e.getBoundingClientRect()).filter(q => q.width || q.height); const bottom = pr.length ? Math.max(...pr.map(q => q.bottom)) : null; const top = pr.length ? Math.min(...pr.map(q => q.top)) : null;
        const stops = [...document.querySelectorAll('.leaflet-marker-icon')].filter(m => /day|stop|dn/.test(m.className)).map(m => (m.firstElementChild || m).getBoundingClientRect()).filter(q => q.width);
        return { routes: pr.length, routeTopBottom: [top, bottom].map(v => v == null ? v : Math.round(v)), carouselTop: cr && Math.round(cr.top), stops: stops.length, stopsUnderCarousel: cr ? stops.filter(q => q.top + q.height / 2 > cr.top).length : null, hash: location.hash }; }); }
    r.errors = errs.length; res[key + '-phone'] = r; await ctx.close();
  }
  // ---------- desktop ----------
  for (const [key, url] of CITIES.slice(0, 2)) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); await route(ctx);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 100)));
    await p.goto(B + url + '#view=atlas', { waitUntil: 'load' }); await sleep(2000);
    const r = {};
    r.layout = await p.evaluate(() => { const l = document.querySelector('.leaflet-container').getBoundingClientRect(); const lis = [...document.querySelectorAll('.listpane li.pl')].filter(e => { const q = e.getBoundingClientRect(); return q.width && q.top < innerHeight && q.bottom > 0; });
      const rail = ['data-cleo-foryou', 'data-cleo-day', 'data-cleo-near'].map(a => { const e = [...document.querySelectorAll('[' + a + ']')].find(x => { const q = x.getBoundingClientRect(); return q.width && q.top >= 0 && q.bottom <= innerHeight && q.left >= 0 && q.right <= innerWidth; }); return a.replace('data-cleo-', '') + ':' + (e ? 'in view' : 'not in view'); });
      return { mapPct: Math.round(l.width / innerWidth * 100), mapLeft: Math.round(l.left), mapH: Math.round(l.height), cols: new Set(lis.map(e => Math.round(e.getBoundingClientRect().left))).size, cardsInView: lis.length, rail, results: (document.querySelector('.ms-count') || {}).textContent }; });
    r.open = await p.evaluate(pinStats);
    for (let i = 0; i < 3; i++) { const n = await p.evaluate(() => { const ok = e => { const r = (e.firstElementChild || e).getBoundingClientRect(); return r.width && r.left > 60 && r.top > 200 && r.bottom < innerHeight - 100 && r.right < innerWidth * 0.55; };
      if ([...document.querySelectorAll('.leaflet-marker-icon.pp')].filter(ok).length >= 3) return 0; const c = [...document.querySelectorAll('.leaflet-marker-icon.pin-cl')].find(ok); if (c) c.dispatchEvent(new MouseEvent('click', { bubbles: true })); return c ? 1 : 0; }); if (!n) break; await sleep(900); }
    r.zoomed = await p.evaluate(pinStats);
    const tp = await p.evaluate(() => { const q = [...document.querySelectorAll('.leaflet-marker-icon.pp')].map(e => e.firstElementChild.getBoundingClientRect()).find(r => r.left > 60 && r.top > 200 && r.bottom < innerHeight - 100 && r.right < innerWidth * 0.55); return q ? { x: q.left + q.width - 2, y: q.top + 2 } : null; });
    if (tp) { await p.mouse.click(tp.x, tp.y); await sleep(1000); }
    r.pinClick = await p.evaluate(() => { const pv = document.getElementById('cleo-poi'), c = document.querySelector('li.pl.is-sel'), lp = document.querySelector('.listpane').getBoundingClientRect(), q = c && c.getBoundingClientRect(); return { preview: !!pv && !pv.hidden && pv.offsetHeight > 60, card: c && c.id, cardInView: !!q && q.top >= lp.top - 2 && q.bottom <= lp.bottom + 2, scrollY: Math.round(scrollY) }; });
    await p.goto(B + url + '#view=atlas&p=' + (key === 'tokyo' ? 'kanda-myojin' : 'soldiers-and-sailors-monument'), { waitUntil: 'load' }); await sleep(2000);
    r.deep = await p.evaluate(() => { const s = document.querySelector('#cleo-sheet:not([hidden])'); const l = document.querySelector('.leaflet-container').getBoundingClientRect(); return { sheet: !!s, scrollY: Math.round(scrollY), mapBottom: Math.round(l.bottom), bandUnderMap: Math.max(0, Math.round(innerHeight - l.bottom)) }; });
    r.errors = errs.length; res[key + '-desktop'] = r; await ctx.close();
  }
  await b.close();
  fs.writeFileSync(out, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res, null, 1));
})();
