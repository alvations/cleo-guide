#!/usr/bin/env node
/**
 * W8 platform probe (R7 gap 7, `npm run beta:qa:w8p`). Real Chromium, phone 390×844 @3× (touch), off-origin blocked
 * (map tiles answered with a 1×1 PNG so the phone Atlas shows its carousel, not the no-map list).
 *   1. A phone @3× never fetches a 960w photo for a slot under 200 CSS px — every view of the pilots, the landing and
 *      hubs, scrolled to the end, and the phone Atlas carousel (104 px thumbs).
 *   3. QA-51: on desktop the place detail's media (≈ 1,024 px) takes the 960w copy, not the card's 500w.
 *   2. Tokyo phone @3× first load ≤ 700 KB transfer (default view, no scroll, network idle + 2 s; gzip for text,
 *      images and fonts as sent; each URL once) — Gallery and Atlas.
 * Exit 1 on any failure.
 */
'use strict';
const http = require('http'); const fs = require('fs'); const path = require('path'); const zlib = require('zlib');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const { chromium } = (() => { for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright']) { try { return require(t); } catch (e) {} } throw new Error('playwright not found'); })();
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const PHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, serviceWorkers: 'block' };
let fails = 0; const chk = (ok, msg, v) => { console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${msg}${v !== undefined ? ' = ' + JSON.stringify(v) : ''}`); if (!ok) fails++; };

(async () => {
  const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) {}
    fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Content-Length': b.length }); r.end(b); }); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const base = `http://127.0.0.1:${srv.address().port}/beta/`;
  const browser = await chromium.launch();
  const ctxOf = async () => { const c = await browser.newContext(PHONE);
    await c.route('**/*', r => r.request().url().startsWith(base.slice(0, -5)) ? r.continue() : r.request().resourceType() === 'image' ? r.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }) : r.abort()); return c; };

  console.log('== 1. no 960w photo for a slot under 200 CSS px (phone @3×) ==');
  const pages = ['index.html', 'Japan/index.html', 'Singapore/index.html', 'saved.html', 'cleveland.html', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html',
    ...['gallery', 'atlas', 'guidebook', 'insights'].map(v => 'cities/tokyo.html#view=' + v), 'cities/tokyo.html#p=kanda-myojin'];
  const bad = [];
  for (const u of pages) {
    const ctx = await ctxOf(), p = await ctx.newPage(), got = new Set();
    // the 960w files this load actually FETCHED (a browser reusing an already-loaded larger candidate for a small slot
    // fetches nothing: currentSrc alone would flag that, e.g. a deep-linked card next to its open detail photo, D-46)
    p.on('request', q => { if (/-960\.(jpe?g|png)(\?|$)/.test(q.url())) got.add(q.url().split('?')[0]); });
    await p.goto(base + u, { waitUntil: 'load' }); await p.waitForTimeout(1500);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
    // the phone Atlas carousel scrolls sideways: walk it too
    await p.evaluate(async () => { const g = document.querySelector('#cleo-grid'); if (g && g.scrollWidth > g.clientWidth + 10) for (let x = 0; x < g.scrollWidth; x += 300) { g.scrollLeft = x; await new Promise(r => setTimeout(r, 40)); } });
    await p.waitForTimeout(800);
    // a fetched 960w is wasted when every visible image showing it sits in a slot under 200 CSS px
    const r = await p.evaluate(urls => urls.map(url => { const on = [...document.images].filter(i => i.currentSrc.split('?')[0] === url).map(i => Math.round(i.getBoundingClientRect().width)).filter(w => w > 0);
      return { w: on.length ? Math.max(...on) : 0, src: url.split('/').pop() }; }).filter(x => x.w > 0 && x.w < 200), [...got]);
    r.forEach(x => bad.push(u + ' ' + x.w + 'px ' + x.src));
    await ctx.close();
  }
  chk(bad.length === 0, `960w fetched for a < 200 px slot, over ${pages.length} page/views`, bad.slice(0, 6));

  console.log('== 2. Tokyo phone @3× first load ≤ 700 KB transfer ==');
  for (const u of ['cities/tokyo.html', 'cities/tokyo.html#view=atlas']) {
    const ctx = await ctxOf(), p = await ctx.newPage(), seen = new Map(), pend = [];
    p.on('response', r => { const url = r.url(); if (!url.startsWith(base.slice(0, -5)) || seen.has(url) || r.status() >= 300) return; seen.set(url, 0);
      pend.push(r.body().then(b => seen.set(url, /\.(png|jpe?g|webp|avif|gif|woff2?)(\?|$)/.test(url) ? b.length : zlib.gzipSync(b).length)).catch(() => {})); });
    await p.goto(base + u, { waitUntil: 'load' }); await p.waitForLoadState('networkidle').catch(() => {}); await p.waitForTimeout(2000); await Promise.all(pend);
    const kb = Math.round([...seen.values()].reduce((a, c) => a + c, 0) / 1024);
    chk(kb <= 700, `${u}: first-load transfer ≤ 700 KB`, kb + ' KB');
    await ctx.close();
  }
  console.log('== 3. QA-51: the desktop detail photo is not the upscaled 500w card copy ==');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' }), p = await ctx.newPage();
    await p.goto(base + 'cities/tokyo.html#p=kanda-myojin', { waitUntil: 'load' }); await p.waitForTimeout(2500);
    const r = await p.evaluate(() => [...document.querySelectorAll('[role=dialog] img[srcset]')].filter(i => i.getBoundingClientRect().width > 400).map(i => ({ w: Math.round(i.getBoundingClientRect().width), src: i.currentSrc.split('/').pop() })));
    chk(r.length > 0 && r.every(x => /-960\./.test(x.src)), 'Tokyo #p=kanda-myojin, 1440: detail media takes the 960w copy', r);
    await ctx.close();
  }
  await browser.close(); srv.close();
  console.log(fails ? `\n>>> FAIL — W8 platform: ${fails} check(s)` : '\n>>> PASS — W8 platform: photo sizes per slot, Tokyo phone first load');
  process.exit(fails ? 1 : 0);
})();
