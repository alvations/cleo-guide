#!/usr/bin/env node
/* css-parity.js — before/after screenshots for a CSS cut (R8 gap #6 proof).
 *   node design/beta/tools/css-parity.js --out DIR          # shoot the current build
 *   python3 design/beta/tools/css-parity.py BEFORE AFTER     # compare, list every shot that changed
 * 6 viewports × 4 views on 3 cities, plus the landing, a hub, trip and saved, in light (and dark at 390 and 1440). Map
 * tiles are blocked, so the shots are deterministic; animations are off. */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '../../..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(arg('--out', '/tmp/css-parity'));
function loadPlaywright() { for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { return require(t); } catch (e) { /* next */ } } throw new Error('playwright not found'); }
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const serve = () => new Promise(res => { const s = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0].split('#')[0]));
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
}); s.listen(0, '127.0.0.1', () => res(s)); });
const VP = [[390, 844], [390, 664], [844, 390], [768, 1024], [1024, 768], [1440, 900]];
const CITIES = ['cities/tokyo.html', 'cleveland.html', 'Singapore/chinatown.html'];
const VIEWS = ['atlas', 'gallery', 'guidebook', 'insights'];
const OTHER = ['index.html', 'Japan/index.html', 'trip.html', 'saved.html', 'how-we-choose.html'];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = await serve(), base = `http://127.0.0.1:${srv.address().port}/beta/`;
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });
  let n = 0;
  for (const [w, h] of VP) for (const theme of (w === 390 && h === 844) || w === 1440 ? ['light', 'dark'] : ['light']) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, reducedMotion: 'reduce', hasTouch: w < 900, isMobile: w < 900 });
    await ctx.route(/tile\.openstreetmap|arcgisonline/, r => r.abort());
    const page = await ctx.newPage();
    const urls = CITIES.flatMap(c => VIEWS.map(v => [`${c}#view=${v}`, `${c.replace(/\W+/g, '-')}-${v}`])).concat(OTHER.map(u => [u, u.replace(/\W+/g, '-')]));
    for (const [u, name] of urls) {
      await page.goto(base + u, { waitUntil: 'load' }).catch(() => {}); await page.waitForTimeout(900);
      await page.addStyleTag({ content: '*{caret-color:transparent!important} .leaflet-tile{visibility:hidden!important}' }).catch(() => {});
      await page.screenshot({ path: path.join(OUT, `${w}x${h}-${theme}-${name}.png`) }).catch(() => {}); n++;
      // and one scrolled frame, where sticky and compact chrome show
      await page.evaluate(() => scrollTo(0, 900)).catch(() => {}); await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(OUT, `${w}x${h}-${theme}-${name}-scrolled.png`) }).catch(() => {}); n++;
    }
    await ctx.close();
  }
  await browser.close(); srv.close();
  console.log(`css-parity: ${n} shots → ${OUT}`);
})();
