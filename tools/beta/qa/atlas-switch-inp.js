#!/usr/bin/env node
'use strict';
/**
 * atlas-switch-inp.js (platform) — guard for the desktop "switch → Atlas" interaction. Tokyo at 1440, every card built
 * (Cleo.defer.all(), what a filter or search does first), click the Atlas segment; the interaction's longest Event Timing
 * duration, 1× CPU, median of 3. FAIL above the ceiling (default 1,500 ms; good heads measure ≈ 250 ms).
 * Why: 797258c2 made the Atlas list ONE grid of every built card (display: contents sections + per-card CSS order); each
 * forced read in the switch (h1 focus, fitSplit, a city.js read) re-laid out all 488 cards, 0.6–0.9 s each: 280 ms → 2.4 s
 * here, 21 s in beta:perf at 4× CPU. Usage: node tools/beta/qa/atlas-switch-inp.js [ceilingMs] [page]
 */
const http = require('http'), fs = require('fs'), path = require('path');
let chromium; for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright']) { try { ({ chromium } = require(t)); break; } catch (e) { /* next */ } }
const ROOT = path.resolve(__dirname, '..', '..', '..'), CEIL = +(process.argv[2] || 1500), PAGE = process.argv[3] || 'cities/tokyo.html';
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };
if (!chromium) { console.log('>>> SKIP — Playwright not available'); process.exit(0); }
const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
srv.listen(0, '127.0.0.1', async () => {
  const base = 'http://127.0.0.1:' + srv.address().port, b = await chromium.launch(), runs = [];
  for (let i = 0; i < 3; i++) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', reducedMotion: 'reduce' });
    await ctx.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.request().resourceType() === 'image' ? r.fulfill({ status: 200, contentType: 'image/png', body: PNG }) : r.abort());
    const p = await ctx.newPage();
    await p.addInitScript(() => { window.__ev = []; new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.interactionId) __ev.push(e.duration); }).observe({ type: 'event', buffered: true, durationThreshold: 16 }); });
    await p.goto(base + '/beta/' + PAGE, { waitUntil: 'load' }); await p.waitForTimeout(2500);
    await p.evaluate(() => { if (window.Cleo && Cleo.defer) Cleo.defer.all(); }); await p.waitForTimeout(1200);
    await p.evaluate(() => { __ev = []; }); await p.locator('[data-cleo-views] button[data-view="atlas"]').first().click(); await p.waitForTimeout(4000);
    runs.push(await p.evaluate(() => Math.round(Math.max(0, ...__ev)))); await ctx.close();
  }
  await b.close(); srv.close(); runs.sort((x, y) => x - y); const m = runs[1], ok = m <= CEIL;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${PAGE} 1440, every card built: switch → Atlas INP ${m} ms (runs ${runs.join(', ')}), ceiling ${CEIL} ms at 1× CPU`);
  console.log(ok ? '\n>>> PASS — desktop switch → Atlas INP' : '\n>>> FAIL — desktop switch → Atlas INP over the ceiling');
  process.exit(ok ? 0 : 1);
});
