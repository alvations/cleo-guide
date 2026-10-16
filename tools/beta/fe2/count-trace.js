// Atlas FE-2 (QA-76): the count line and "N more outside" line every 100 ms during a fresh Atlas load.
//   NODE_PATH=$(npm root -g) node tools/beta/fe2/count-trace.js cities/tokyo.html [1440|390] [hash]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..'), BASE = 'https://cleo.local/', PNG = fs.readFileSync(path.join(ROOT, 'tools/node_modules/leaflet/dist/images/layers.png'));
const rel = process.argv[2] || 'cities/tokyo.html', w = +(process.argv[3] || 1440), hash = process.argv[4] || '#view=atlas';
(async () => { const b = await chromium.launch(), vp = w < 1024 ? { viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { viewport: { width: w, height: 900 } };
  const ctx = await b.newContext(Object.assign({ reducedMotion: 'reduce' }, vp));
  await ctx.route('**/*', r => { const u = new URL(r.request().url()); if (/arcgis|openstreetmap/.test(u.host)) return r.fulfill({ body: PNG, headers: { 'content-type': 'image/png' } }); if (u.origin + '/' !== BASE) return r.abort(); const p = path.join(ROOT, decodeURIComponent(u.pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' }); return r.fulfill({ body: fs.readFileSync(p) }); });
  const page = await ctx.newPage(); await page.addInitScript(() => { window.__t0 = performance.now(); });
  await page.goto(BASE + 'beta/' + rel + hash, { waitUntil: 'commit' }); let last = '';
  for (let i = 0; i < 45; i++) { const s = await page.evaluate(() => { const m = window.Cleo && Cleo.city && Cleo.city.map && Cleo.city.map(), H = document.documentElement;
      return [Math.round(performance.now() - window.__t0), ((document.querySelector('.ms-count') || {}).textContent || '').trim(), ((document.querySelector('.ms-more') || {}).textContent || '').trim(), m ? m.getZoom() : '-', ['ms-ready', 'ms-on'].filter(k => H.classList.contains(k)).join(' '), (Cleo.city && Cleo.city.msAll) ? 'msAll' : ''].join(' | '); }).catch(() => 'n/a');
    const k = s.replace(/^\d+ \| /, ''); if (k !== last) { console.log(s); last = k; } await page.waitForTimeout(100); }
  await b.close(); })();
