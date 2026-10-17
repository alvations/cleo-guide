#!/usr/bin/env node
/**
 * Perf audit probe (platform; docs/BETA-PERF-AUDIT.md) — `npm run beta:perf`. Real Chromium, 4× CPU throttle,
 * phone 390×844 @3× (touch) and desktop 1440×900, off-origin blocked (map tiles answered with a 1×1 PNG).
 *
 *   load   LCP, CLS (load + 2.5 s) and TBT (Σ long-task time over 50 ms) on the 5 pilots, the landing and two hubs;
 *          median of --runs (default 3)
 *   inp    INP on the main interactions of Tokyo (open a place, switch view to Guidebook / Atlas, a collection filter in
 *          Gallery); median of --runs
 *
 * Targets (owner request, 2026-10-11): LCP ≤ 2.0 s and CLS ≤ 0.05 at phone@3× 4× CPU; INP ≤ 200 ms. Report-only:
 * prints ✅/❌ per row and exits 0, unless --strict (then 1 on any miss). Note: a local server has no network latency,
 * so LCP here is the rendering share of LCP, not a field number.
 *   node beta/qa/perf.js [--only load|inp] [--runs 3] [--strict] [--json out.json]
 */
'use strict';
const http = require('http'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const { chromium } = (() => { for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright']) { try { return require(t); } catch (e) {} } throw new Error('playwright not found'); })();
const argv = process.argv.slice(2), opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const RUNS = +opt('--runs', 3), ONLY = opt('--only', ''), STRICT = argv.includes('--strict'), JSON_OUT = opt('--json', '');
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const VP = { phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }, desk: { viewport: { width: 1440, height: 900 } } };
const PAGES = ['index.html', 'cleveland.html', 'cities/tokyo.html', 'cities/tokyo.html#view=atlas', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html', 'Japan/index.html', 'Singapore/index.html'];
const med = a => { const s = a.filter(x => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
let misses = 0; const out = { load: [], inp: [] };

(async () => {
  const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) {}
    fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Content-Length': b.length }); r.end(b); }); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const base = `http://127.0.0.1:${srv.address().port}/beta/`, origin = base.slice(0, -5);
  const browser = await chromium.launch();
  const page = async vn => { const ctx = await browser.newContext({ ...VP[vn], serviceWorkers: 'block', reducedMotion: 'reduce' });
    await ctx.route('**/*', r => r.request().url().startsWith(origin) ? r.continue() : r.request().resourceType() === 'image' ? r.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }) : r.abort());
    const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); return { ctx, p }; };

  if (ONLY !== 'inp') {
    console.log('== load: LCP / CLS / TBT (4× CPU, median of ' + RUNS + ') ==');
    for (const u of PAGES) for (const vn of ['phone', 'desk']) {
      const L = [], C = [], T = [];
      for (let i = 0; i < RUNS; i++) {
        const { ctx, p } = await page(vn);
        await p.addInitScript(() => { window.__v = { lcp: 0, cls: 0, lt: 0 };
          new PerformanceObserver(l => { for (const e of l.getEntries()) __v.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) __v.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
          try { new PerformanceObserver(l => { for (const e of l.getEntries()) __v.lt += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true }); } catch (e) {} });
        await p.goto(base + u, { waitUntil: 'load' }); await p.waitForTimeout(2500);
        const v = await p.evaluate(() => __v); L.push(v.lcp); C.push(v.cls); T.push(v.lt); await ctx.close();
      }
      const r = { page: u, vp: vn, lcp: Math.round(med(L)), cls: +med(C).toFixed(3), tbt: Math.round(med(T)) }; out.load.push(r);
      const okL = vn !== 'phone' || r.lcp <= 2000, okC = vn !== 'phone' || r.cls <= 0.05; if (!okL || !okC) misses++;
      console.log(`  ${okL && okC ? '✅' : '❌'} ${u.padEnd(30)} ${vn.padEnd(5)} LCP ${String(r.lcp).padStart(5)} ms  CLS ${r.cls.toFixed(3)}  TBT ${String(r.tbt).padStart(5)} ms`);
    }
  }
  if (ONLY !== 'load') {
    console.log('== inp: Tokyo main interactions (4× CPU, median of ' + RUNS + ') ==');
    const acts = {};
    for (let i = 0; i < RUNS; i++) for (const vn of ['phone', 'desk']) {
      const { ctx, p } = await page(vn);
      await p.addInitScript(() => { window.__ev = []; new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.interactionId) __ev.push({ id: e.interactionId, d: e.duration }); }).observe({ type: 'event', durationThreshold: 16, buffered: true }); });
      // the collection filter lives on the Gallery's rail; Atlas is the default view since D-46, so the run starts in the
      // Gallery (as R7's did), then opens a place and switches to Guidebook and Atlas from there
      await p.goto(base + 'cities/tokyo.html#view=gallery', { waitUntil: 'load' }); await p.waitForTimeout(3000);
      const tap = async loc => { await loc.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); if (vn === 'phone') await loc.tap(); else await loc.click(); };
      const mark = async (label, fn) => { await p.evaluate(() => { __ev = []; }); try { await fn(); } catch (e) { const k = vn + '|' + label + ' (NOT RUN: ' + String(e.message || e).split('\n')[0].slice(0, 60) + ')'; (acts[k] = acts[k] || []).push(null); return; } await p.waitForTimeout(1500);
        const ev = await p.evaluate(() => __ev); const by = {}; ev.forEach(e => { by[e.id] = Math.max(by[e.id] || 0, e.d); });
        const k = vn + '|' + label; (acts[k] = acts[k] || []).push(Object.values(by).length ? Math.max(...Object.values(by)) : 0); };
      const view = async v => { const b = p.locator(`.views[data-cleo-views] button[data-view="${v}"]`); if (!(await b.isVisible())) { await tap(p.locator('.views[data-cleo-views] button[aria-pressed="true"]')); await p.waitForTimeout(400); } await tap(b); };
      await mark('collection filter (Gallery)', () => tap(p.locator('.rail-i', { hasText: 'Must see' }).first()));
      await p.evaluate(() => { location.hash = '#view=gallery'; }); await p.waitForTimeout(1500); await p.evaluate(() => scrollTo(0, 0));
      await mark('open a place', () => tap(p.locator('li.pl .pl-n a').first()));
      await p.keyboard.press('Escape'); await p.waitForTimeout(800); await p.evaluate(() => scrollTo(0, 0));
      await mark('switch view → Guidebook', () => view('guidebook'));
      await mark('switch view → Atlas', () => view('atlas'));
      // D-46: a load lands in Atlas; the round trip back from Guidebook (which built every card) is its own row
      await p.goto(base + 'cities/tokyo.html', { waitUntil: 'load' }); await p.waitForTimeout(3000);
      await view('guidebook'); await p.waitForTimeout(1500);
      await mark('Atlas load → Guidebook → back to Atlas', () => view('atlas'));
      await ctx.close();
    }
    for (const [k, v] of Object.entries(acts)) { const [vn, label] = k.split('|'), m = med(v), ok = m != null && m <= 200; if (!ok) misses++;
      out.inp.push({ vp: vn, action: label, inp: m, runs: v }); console.log(`  ${ok ? '✅' : '❌'} ${vn.padEnd(5)} ${label.padEnd(30)} INP ${String(m).padStart(5)} ms  (${v.join(', ')})`); }
  }
  await browser.close(); srv.close();
  if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 1));
  console.log(misses ? `\n>>> ${misses} row(s) miss the targets (LCP ≤ 2.0 s, CLS ≤ 0.05 phone; INP ≤ 200 ms)` : '\n>>> PASS — every row meets the targets');
  process.exit(STRICT && misses ? 1 : 0);
})();
