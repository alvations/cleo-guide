#!/usr/bin/env node
/**
 * QA helper (R7 re-sign; resume rule 7): open one beta page in real Chromium, wait, evaluate one expression and print
 * its JSON; optionally screenshot. Serves the repo root this file lives in, so run it from any worktree.
 *   node tools/beta/qa/page-eval.js <m|m3|d> '<page#hash>' '<async js expression>' [shot.jpg] [--tiles stub|block]
 *   m = 390×844 @2, m3 = 390×844 @3, d = 1440×900. Images (tiles included) are stubbed 1×1 by default ("stub");
 *   "block" aborts every off-origin request, so the map gives way to the list (metrics.js's state).
 * Examples (R7 re-sign checks):
 *   QC-01   node tools/beta/qa/page-eval.js d 'cities/tokyo.html#view=insights' "(async()=>{await new Promise(r=>setTimeout(r,1800));return [...document.querySelectorAll('a[href]')].filter(a=>/cz=|c=/.test(a.getAttribute('href'))).map(a=>[a.textContent.trim().slice(0,30),a.getAttribute('href')])})()"
 *   QA-65   node tools/beta/qa/page-eval.js d 'cities/tokyo.html#p=tempura-abe-honten' "(async()=>{await new Promise(r=>setTimeout(r,2500));return /quoted from the source/.test(document.getElementById('sh-t').closest('[role=dialog]').innerText)})()"
 *   QA-69   node tools/beta/qa/page-eval.js m 'cleveland.html#view=gallery' "(async()=>{await new Promise(r=>setTimeout(r,1500));const p=document.querySelector('.mappill');return [p.className,getComputedStyle(p).visibility]})()"
 */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
let chromium; for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright']) { try { ({ chromium } = require(t)); break; } catch (e) { /* next */ } }
const ROOT = path.resolve(__dirname, '..', '..', '..');
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const VP = { m: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, m3: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }, d: { viewport: { width: 1440, height: 900 } } };
const [vp, page, expr, shot] = process.argv.slice(2).filter(a => !a.startsWith('--') && a !== 'stub' && a !== 'block');
const tiles = process.argv.includes('block') ? 'block' : 'stub';
if (!VP[vp] || !page || !expr) { console.error('usage: page-eval.js <m|m3|d> <page#hash> <expr> [shot.jpg] [--tiles stub|block]'); process.exit(2); }
const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
srv.listen(0, '127.0.0.1', async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ ...VP[vp], reducedMotion: 'reduce', serviceWorkers: 'block' }); const p = await ctx.newPage();
  const origin = 'http://127.0.0.1:' + srv.address().port;
  await p.route('**/*', r => { const u = r.request().url(); if (u.startsWith(origin)) return r.continue();
    if (tiles === 'stub' && r.request().resourceType() === 'image') return r.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }); return r.abort(); });
  const errs = []; p.on('pageerror', e => errs.push(String(e.message || e).slice(0, 160)));
  await p.goto(origin + '/beta/' + page, { waitUntil: 'load', timeout: 60000 });
  const out = await p.evaluate(expr);
  console.log(JSON.stringify(out)); if (errs.length) console.error('page errors:', JSON.stringify(errs));
  if (shot) await p.screenshot({ path: shot, type: 'jpeg', quality: 70 });
  await b.close(); srv.close();
});
