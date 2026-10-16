// Atlas FE-2: INP of the desktop view switch Gallery → Atlas (Tokyo, 4× CPU), from the browser's own event timing.
//   NODE_PATH=$(npm root -g) node tools/beta/fe2/inp-switch.js [cities/tokyo.html] [1440]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..'), BASE = 'https://cleo.local/', PNG = fs.readFileSync(path.join(ROOT, 'tools/node_modules/leaflet/dist/images/layers.png'));
const rel = process.argv[2] || 'cities/tokyo.html', w = +(process.argv[3] || 1440);
(async () => { const b = await chromium.launch(), out = [];
  for (let i = 0; i < 3; i++) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    await ctx.route('**/*', r => { const u = new URL(r.request().url()); if (/arcgis|openstreetmap/.test(u.host)) return r.fulfill({ body: PNG, headers: { 'content-type': 'image/png' } }); if (u.origin + '/' !== BASE) return r.abort(); const p = path.join(ROOT, decodeURIComponent(u.pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' }); return r.fulfill({ body: fs.readFileSync(p) }); });
    const page = await ctx.newPage(); await page.goto(BASE + 'beta/' + rel + '#view=gallery'); await page.waitForTimeout(2500);
    const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.evaluate(() => { window.__ev = []; new PerformanceObserver(l => l.getEntries().forEach(e => window.__ev.push([e.name, Math.round(e.duration)]))).observe({ type: 'event', durationThreshold: 16, buffered: false }); });
    const btn = await page.$('[data-cleo-views] button[data-view="atlas"]'); const t0 = Date.now(); await btn.click(); await page.waitForTimeout(400);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)))); const wall = Date.now() - t0;
    await page.waitForTimeout(1500); const ev = await page.evaluate(() => window.__ev);
    out.push({ wall, maxEvent: Math.max(0, ...ev.map(e => e[1])), view: await page.evaluate(() => document.documentElement.getAttribute('data-view')) });
    await ctx.close(); }
  console.log(JSON.stringify(out)); await b.close(); })();
