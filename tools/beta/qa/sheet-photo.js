#!/usr/bin/env node
/* PERF-19b probe (platform): tap a place card that has a photo → when the sheet shows its photo (the 500 w file) and when the
 * full file swaps in, and the layout shift across the swap. Phone (390 @3×) and desktop (1440), HTTP cache on ("cached":
 * the card's own photo was already loaded by the list) and off ("cold"). Real Chromium, local server, no throttling —
 * compare between SHAs, not with field numbers. Usage: node beta/qa/sheet-photo.js [page] (default cities/tokyo.html). */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), PAGE = process.argv[2] || 'cities/tokyo.html';
const load = () => { for (const p of [process.env.NODE_PATH, '/opt/node22/lib/node_modules', path.join(ROOT, 'tools/node_modules')]) { try { return require(require.resolve('playwright', { paths: [p].filter(Boolean) })); } catch (e) { /* next */ } } return require('playwright'); };
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const VP = { phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, desk: { viewport: { width: 1440, height: 900 } } };
(async () => {
  const { chromium } = load();
  const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'max-age=600' }); r.end(b); }); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const origin = `http://127.0.0.1:${srv.address().port}`;
  let b; try { b = await chromium.launch(); } catch (e) { b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  let fail = 0;
  for (const vn of ['phone', 'desk']) for (const mode of ['cached', 'cold']) {
    const ctx = await b.newContext({ ...VP[vn], serviceWorkers: 'block', reducedMotion: process.env.RM ? 'reduce' : 'no-preference' }); await ctx.route('**/*', r => r.request().url().startsWith(origin) ? r.continue() : r.abort());
    const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
    await p.addInitScript(() => { window.__cls = 0; window.__shifts = []; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__cls += e.value; window.__shifts.push([Math.round(e.startTime), +e.value.toFixed(4), (e.sources || []).some(x => x.node && x.node.closest && x.node.closest('#cleo-sheet .hero-plate')), (e.sources || []).map(x => x.node ? (x.node.nodeName + '.' + (x.node.className || '')).slice(0, 40) + (x.node.closest && x.node.closest('#cleo-sheet') ? '@sheet' : '@page') + ' ' + [x.previousRect, x.currentRect].map(r => [r.x, r.y, r.width, r.height].map(Math.round).join('/')).join('->') : '?').join(',')]); } }).observe({ type: 'layout-shift', buffered: true }); });
    await p.goto(origin + '/beta/' + PAGE + '#view=gallery', { waitUntil: 'load' }); await p.waitForTimeout(1500);
    const id = await p.evaluate(() => { const c = [...document.querySelectorAll('li.pl')].find(x => x.querySelector('.pl-photo img[srcset]')); if (!c) return null; c.scrollIntoView({ block: 'center' }); return c.id; });
    if (!id) { console.log(`  SKIP  ${vn} ${mode}: no stamped card with a photo`); await ctx.close(); continue; }
    await p.waitForTimeout(800);
    if (mode === 'cold') await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    const r = await p.evaluate(async id => {
      const t0 = performance.now(); document.querySelector('#' + CSS.escape(id) + ' .pl-n a').click();
      let first = null, full = null, box0 = null, box1 = null; const end = t0 + 4000;
      while (performance.now() < end && full == null) {
        await new Promise(r => requestAnimationFrame(r));
        const im = document.querySelector('#cleo-sheet:not([hidden]) .hero-plate img'); if (!im) continue;
        if (first == null && im.complete && im.naturalWidth) { first = [Math.round(performance.now() - t0), im.currentSrc.split('/').pop()]; const b = im.getBoundingClientRect(); box0 = [b.width, b.height].map(Math.round).join('×'); }
        if (first != null && /-(7\d\d|9\d\d|1\d{3})\.\w+$/.test(im.currentSrc) && im.complete) { full = [Math.round(performance.now() - t0), im.currentSrc.split('/').pop()]; const b = im.getBoundingClientRect(); box1 = [b.width, b.height].map(Math.round).join('×'); }
      }
      // the swap: a shift of the sheet's photo plate from 250 ms on (the swap cannot start earlier). Anything else belongs to
      // opening the sheet (page bars, the rise; the old build shows the same) and is reported, not graded here
      const sw = window.__shifts.filter(x => x[0] >= t0 + 250 && x[2]).reduce((a, x) => a + x[1], 0), op = window.__shifts.filter(x => x[0] >= t0 && !(x[0] >= t0 + 250 && x[2])).reduce((a, x) => a + x[1], 0);
      return { first, full, box0, box1, swapCls: +sw.toFixed(4), openCls: +op.toFixed(4), shifts: window.__shifts.filter(x => x[0] >= t0).map(x => [x[0] - Math.round(t0), x[1], x[3]]) };
    }, id);
    const ok = r.first && r.full && r.box0 === r.box1 && r.swapCls === 0; if (!ok) fail++;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${vn.padEnd(5)} ${mode.padEnd(6)} photo shown ${r.first ? r.first[0] + ' ms (' + r.first[1] + ')' : '—'} · full ${r.full ? r.full[0] + ' ms (' + r.full[1] + ')' : '—'} · box ${r.box0} → ${r.box1} · CLS across the swap ${r.swapCls} (everything else while opening: ${r.openCls}, info)`);
    if (process.env.SHIFTS) console.log('        shifts', JSON.stringify(r.shifts));
    await ctx.close();
  }
  await b.close(); srv.close();
  console.log(fail ? `>>> ${fail} FAIL` : '>>> PASS — the photo shows, the full file swaps in, the same box, no shift');
  process.exit(fail ? 1 : 0);
})();
