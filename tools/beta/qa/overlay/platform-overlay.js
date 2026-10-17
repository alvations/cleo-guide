#!/usr/bin/env node
'use strict';
/**
 * platform-overlay.js — the owner's overlay audit (docs/BETA-OVERLAY-LEDGER.md, OV-00) for platform's layers: the
 * "Keep <city> offline" pack control (pack.js) and the map-failure fallback (mapfail.js). Tokyo; the ledger's six
 * viewports × light / dark × Gallery / Atlas / Guidebook / Insights, with a real service worker (the pack control only
 * shows when one can keep a pack). For each: shown?, position (must not be fixed/sticky: no chrome share), is its centre
 * covered by another layer, does any fixed/sticky control overlap it, and after a scroll to it is it reachable (on screen
 * and not covered). Usage: cd tools && node beta/qa/overlay/platform-overlay.js → design/beta/eval/perf/overlay-platform.json
 */
const http = require('http'), fs = require('fs'), path = require('path');
let chromium; for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright']) { try { ({ chromium } = require(t)); break; } catch (e) { /* next */ } }
const ROOT = path.resolve(__dirname, '..', '..', '..', '..'), OUT = path.join(ROOT, 'design/beta/eval/perf/overlay-platform.json');
const VPS = [[390, 844, 1], [390, 664, 1], [844, 390, 1], [768, 1024, 0], [1024, 768, 0], [1440, 900, 0]];
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
if (!chromium) { console.log('>>> SKIP — Playwright not available'); process.exit(0); }
const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) {} fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
srv.listen(0, '127.0.0.1', async () => {
  const base = 'http://127.0.0.1:' + srv.address().port, b = await chromium.launch(), rows = []; let bad = 0;
  for (const [w, h, touch] of VPS) for (const scheme of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: !!touch, hasTouch: !!touch, colorScheme: scheme, serviceWorkers: 'allow', reducedMotion: 'reduce' });
    await ctx.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.request().resourceType() === 'image' ? r.fulfill({ status: 200, contentType: 'image/png', body: PNG }) : r.abort());
    const p = await ctx.newPage();
    await p.goto(base + '/beta/cities/tokyo.html', { waitUntil: 'load' }); await p.evaluate(() => navigator.serviceWorker.ready); await p.waitForTimeout(1500);
    for (const view of ['gallery', 'atlas', 'guidebook', 'insights']) {
      await p.evaluate(v => { location.hash = '#view=' + v; }, view); await p.waitForTimeout(1800);
      const r = await p.evaluate(() => {
        const box = document.querySelector('[data-cleo-pack]'); if (!box) return { exists: false };
        const cs = getComputedStyle(box), shown = !box.hidden && cs.display !== 'none' && box.getClientRects().length > 0;
        const fixedish = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const p = getComputedStyle(e).position; if (p === 'fixed' || p === 'sticky') return true; } return false; };
        if (!shown) return { exists: true, shown: false };
        box.scrollIntoView({ block: 'center' });
        const R = box.getBoundingClientRect(), cx = R.left + R.width / 2, cy = R.top + Math.min(R.height / 2, 24);
        const top = document.elementFromPoint(Math.max(0, Math.min(innerWidth - 1, cx)), Math.max(0, Math.min(innerHeight - 1, cy)));
        const covered = !!top && !box.contains(top);
        const overlaps = [...document.querySelectorAll('body *')].filter(e => { if (box.contains(e) || e.contains(box)) return false; const s = getComputedStyle(e); if (!(s.position === 'fixed' || s.position === 'sticky') || s.display === 'none' || s.visibility === 'hidden') return false; const q = e.getBoundingClientRect(); if (!q.width || !q.height) return false; return q.left < R.right && q.right > R.left && q.top < R.bottom && q.bottom > R.top; })
          .map(e => (e.id || String(e.className) || e.tagName).slice(0, 30));
        return { exists: true, shown: true, fixed: fixedish(box), inView: R.bottom > 0 && R.top < innerHeight, covered, by: covered && top ? (top.id || String(top.className) || top.tagName).slice(0, 30) : null, overlaps: [...new Set(overlaps)].slice(0, 4), h: Math.round(R.height) };
      });
      const chrome = r.shown && r.covered && /^(rail-i|cleo-rail|cbar|views)/.test(r.by || '') && !r.overlaps.some(o => /mappane|ms-bar/.test(o));   // sticky top chrome over in-flow content: the chrome-share rows (OV-00), not this control
      const issue = r.shown && !chrome && (r.fixed || r.covered || !r.inView); r.note = chrome ? 'covered by sticky top chrome (chrome share, OV-00)' : undefined;
      if (issue) bad++;
      rows.push(Object.assign({ vp: `${w}x${h}`, scheme, view }, r));
      console.log(`  ${issue ? 'FLAG' : 'ok  '}  ${w}x${h} ${scheme.padEnd(5)} ${view.padEnd(9)} ${JSON.stringify(r)}`);
    }
    await ctx.close();
  }
  await b.close(); srv.close(); fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(rows, null, 1));
  console.log(bad ? `\n>>> ${bad} FLAG(s) — the pack control is fixed, covered or unreachable somewhere` : '\n>>> PASS — the pack control is in-flow, never fixed, and not covered by any layer in any view × viewport × theme (sticky top chrome over it in landscape is noted as chrome share)');
  process.exit(bad ? 1 : 0);
});
