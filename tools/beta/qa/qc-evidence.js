#!/usr/bin/env node
/**
 * Beta QC: evidence shots for filed QC-NN findings (docs/BETA-QC.md). QC lane. Same rig as qc.js: beta/ from disk,
 * OSM / Esri tiles stubbed, every other off-origin request aborted, service workers blocked.
 * Usage (from tools/): NODE_PATH=$(npm root -g) node beta/qa/qc-evidence.js --label <sha>
 * Output: design/beta/eval/qc/<label>/evidence/qc-NN-*.jpg (JPEG, cropped where the finding is local).
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const argv = process.argv.slice(2);
const LABEL = argv[argv.indexOf('--label') + 1] || 'working';
const OUT = path.join(ROOT, 'design', 'beta', 'eval', 'qc', LABEL, 'evidence');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const VP = { 390: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  768: { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  1440: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } };

// [file, page, viewport, hash, what to do before the shot (returns a selector to crop to, or null for the viewport)]
const ONLY = (argv[argv.indexOf('--only') + 1] || '').split(',').filter(x => argv.includes('--only') && x);
const SHOTS = [
  ['qc-01-canon-bars', 'cities/tokyo.html', 1440, '#view=insights', async p => cardOf(p, /signature canon/i)],
  ['qc-02-kind-bars', 'cities/tokyo.html', 1440, '#view=insights', async p => cardOf(p, /what each area is for/i)],
  ['qc-03-insights-lens', 'cities/tokyo.html', 1440, '#view=insights&a=CYD', async () => null],
  ['qc-04-no-pin-badge', 'cleveland.html', 1440, '#view=atlas', async () => null],
  ['qc-05-empty-search', 'cities/tokyo.html', 390, '#q=zzqxjv', async () => null],
  ['qc-06-switcher-768', 'cities/tokyo.html', 768, '', async () => '[data-cleo-views]'],
  ['qc-08-food-lens-top', 'cities/tokyo.html', 390, '#view=gallery&mode=food&a=CHUO', async () => null],
  ['qc-09-sheet-covers-switcher', 'cities/tokyo.html', 390, '#p=kanda-myojin', async () => null],
  ['qc-13-atlas-lens-count', 'cities/tokyo.html', 1440, '#view=atlas&a=CYD', async () => '.ms-head'],
  ['qc-15-base-esc', 'cities/tokyo.html', 390, '#p=kanda-myojin', async p => { await p.locator('[role=dialog] [data-cleo-base=set]').first().click(); await p.waitForTimeout(600); await p.keyboard.press('Escape'); await p.waitForTimeout(600); return null; }],
  ['qc-16-ja-insights', 'cities/tokyo.html?lang=ja', 1440, '#view=insights', async () => null],
  ['qc-17-base-card-clip', 'cities/tokyo.html', 390, '#base=kanda-myojin&view=atlas', async p => { await p.waitForTimeout(1500); return 'main li.pl'; }],
  ['qc-18-ja-switcher', 'cities/tokyo.html?lang=ja', 1440, '#view=insights', async () => '[data-cleo-views]'],
  ['qc-19-rating-no-note', 'cleveland.html', 1440, '#view=guidebook', async p => { await p.evaluate(() => { if (window.Cleo && Cleo.defer) Cleo.defer.all(); const e = document.querySelector('.ge[data-id="barroco-arepa-bar"]'); if (e) { e.setAttribute('data-qc-shot', ''); e.scrollIntoView({ block: 'center', behavior: 'instant' }); } }); await p.waitForTimeout(500); return '[data-qc-shot]'; }],
  ['qc-20-hours-in-text', 'cities/newyork.html', 1440, '#view=guidebook', async p => { await p.evaluate(() => { if (window.Cleo && Cleo.defer) Cleo.defer.all(); const e = document.querySelector('.ge[data-id="central-park"]'); if (e) { e.setAttribute('data-qc-shot', ''); e.scrollIntoView({ block: 'center', behavior: 'instant' }); } }); await p.waitForTimeout(500); return '[data-qc-shot]'; }],
];
async function cardOf(p, rx) {
  await p.evaluate(src => { const r = new RegExp(src, 'i'); const c = [...document.querySelectorAll('.icard')].find(x => r.test(x.textContent));
    if (c) { c.setAttribute('data-qc-shot', ''); c.scrollIntoView({ block: 'start', behavior: 'instant' }); } }, rx.source);
  await p.waitForTimeout(400); return '[data-qc-shot]';
}
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = http.createServer((req, rsp) => {
    let f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0].split('#')[0]));
    if (!f.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
    try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
    fs.readFile(f, (err, buf) => { if (err) { rsp.writeHead(404); return rsp.end(); } rsp.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); rsp.end(buf); });
  }).listen(0, '127.0.0.1');
  await new Promise(r => srv.on('listening', r));
  const base = `http://127.0.0.1:${srv.address().port}/`;
  const browser = await chromium.launch();
  for (const [name, rel, vp, hash, prep] of SHOTS.filter(x => !ONLY.length || ONLY.some(o => x[0].startsWith(o)))) {
    const ctx = await browser.newContext({ ...VP[vp], serviceWorkers: 'block' });
    await ctx.route('**/*', route => { const u = route.request().url(); if (u.startsWith(base)) return route.continue();
      if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u)) return route.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }); return route.abort(); });
    const page = await ctx.newPage();
    await page.goto(base + 'beta/' + rel + hash, { waitUntil: 'load' }); await page.waitForTimeout(1800);
    const sel = await prep(page); const f = path.join(OUT, name + '.jpg');
    const box = sel ? await page.locator(sel).first().boundingBox().catch(() => null) : null;
    await page.screenshot({ path: f, type: 'jpeg', quality: 60, scale: 'css', ...(box ? { clip: { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: Math.min(box.width + 16, VP[vp].viewport.width), height: Math.min(box.height + 16, 1400) } } : {}) });
    console.log('wrote', path.relative(ROOT, f));
    await ctx.close();
  }
  await browser.close(); srv.close();
})();
