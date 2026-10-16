// Atlas FE-2 (QA-70): time from the phone "Show map" tap to the first labelled pin, metrics.js B-07's own path (390, DPR 3,
// no hash, stub 1 px tiles). NODE_PATH=$(npm root -g) node tools/beta/fe2/first-pin.js cities/tokyo.html cities/newyork.html
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '..', '..', '..'), PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
srv.listen(0, '127.0.0.1', async () => {
  const base = 'http://127.0.0.1:' + srv.address().port + '/', b = await chromium.launch();
  for (const rel of process.argv.slice(2)) for (let i = 0; i < 3; i++) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, serviceWorkers: 'block', reducedMotion: 'reduce' });
    await ctx.route('**/*', ro => { const u = ro.request().url(); if (u.startsWith(base)) return ro.continue(); if (ro.request().resourceType() === 'image') return ro.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }); return ro.abort('blockedbyclient'); });
    const page = await ctx.newPage(); await page.goto(base + 'beta/' + rel, { waitUntil: 'load' }); await page.waitForTimeout(900);
    const tg = await page.evaluate(() => { const vis = d => !!d && d.getBoundingClientRect().height > 0 && !d.closest('[hidden]');
      const mf = document.documentElement.classList.contains('atlas-m') && [...document.querySelectorAll('.mapclose, .ms-toggle')].find(vis); if (mf) return 'map-first';
      const c = document.querySelector('.map-toggle, [data-cleo-map=""]') || [...document.querySelectorAll('button, a, [role=button]')].find(b => /^(show (the )?)?map\b/i.test((b.getAttribute('aria-label') || b.textContent || '').trim()) && vis(b));
      if (!c || !vis(c)) return 'none'; c.setAttribute('data-qa-toggle', '1'); return (c.className + ' ' + c.textContent.trim()).slice(0, 60); });
    if (tg !== 'map-first' && tg !== 'none') await page.click('[data-qa-toggle]', { timeout: 3000 }).catch(() => {});
    const t0 = Date.now(); let tPin = -1, tFit = -1;
    for (let k = 0; k < 80; k++) { const q = await page.evaluate(() => { const m = window.Cleo && Cleo.city.map && Cleo.city.map(); return { pins: document.querySelectorAll('.leaflet-marker-icon.pp').length, z: m ? m.getZoom() : null }; });
      if (tFit < 0 && q.z !== null && q.z !== 11 && q.z !== 12.5) tFit = Date.now() - t0; if (q.pins) { tPin = Date.now() - t0; break; } await page.waitForTimeout(50); }
    console.log('TIMING', rel, 'firstPin ms', tPin);
    console.log('toggle', tg);
    const r = await page.evaluate(() => {
      const lab = p => p.classList.contains('pp') && p.firstElementChild ? p.firstElementChild : p, top = 200, bot = 260;
      const all = [...document.querySelectorAll('.leaflet-overlay-pane path.leaflet-interactive, .leaflet-marker-icon:not(.pin-cl)')];
      const why = all.map(p => { const b = lab(p).getBoundingClientRect(); if (!(b.width > 0)) return 'zero'; if (!(b.top > top && b.bottom < innerHeight - bot && b.left > 10 && b.right < innerWidth - 10)) return 'out of band ' + Math.round(b.top) + '-' + Math.round(b.bottom);
        const t = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return !t ? 'no hit' : (t === p || p.contains(t)) ? 'OK' : 'covered by ' + (t.tagName + '.' + String(t.className).split(' ')[0]); });
      const m = Cleo.city.map(), z = m && m.getZoom(), lp = document.querySelector('.listpane').getBoundingClientRect(), bar = document.querySelector('.ms-bar'); 
      return { view: document.documentElement.getAttribute('data-view'), cls: document.documentElement.className, z, pins: document.querySelectorAll('.leaflet-marker-icon.pp').length, ok: why.filter(x => x === 'OK').length, why: why.reduce((o, w) => { const k = w.replace(/\d+/g, '#'); o[k] = (o[k] || 0) + 1; return o; }, {}), lpTop: Math.round(lp.top), barBottom: bar && Math.round(bar.getBoundingClientRect().bottom), hash: location.hash };
    });
    console.log(rel, i, JSON.stringify(r)); await ctx.close();
  }
  await b.close(); srv.close();
});
