#!/usr/bin/env node
/* test-count-lines.js (platform, 2026-10-17): every view's OWN count line says the right numbers. Replaces the three
 * test-views rows for Cleo.countLine, which no view called any more (Gallery, Atlas and Guidebook each draw their own line).
 * Tokyo in real Chromium, 1440 × 900, no lens and the Must-see lens (t=1). N = every card in the built page; F = the
 * must-see cards that are open (a closed place carries no tier). Exit 1 on any FAIL; SKIP without Playwright. */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
const load = () => { for (const p of [process.env.NODE_PATH, '/opt/node22/lib/node_modules', path.join(ROOT, 'tools/node_modules')]) { try { return require(require.resolve('playwright', { paths: [p].filter(Boolean) })); } catch (e) { /* next */ } } return null; };
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const PAGE = 'cities/tokyo.html', html = fs.readFileSync(path.join(ROOT, 'beta', PAGE), 'utf8');
const tags = [...html.matchAll(/<li class="pl[ "][^>]*>/g)].map(m => m[0]);
const N = tags.length, F = tags.filter(t => /\bdata-t="1"/.test(t) && !/\bdata-closed\b/.test(t)).length;
const num = s => +String(s).replace(/,/g, '');
let fail = 0;
const chk = (ok, name, ev) => { if (!ok) fail++; console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name} = ${JSON.stringify(ev)}`); };
(async () => {
  const pw = load(); if (!pw) { console.log('  SKIP  test-count-lines: playwright not found'); return; }
  const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const o = `http://127.0.0.1:${srv.address().port}`;
  let b; try { b = await pw.chromium.launch(); } catch (e) { b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  console.log(`== every view's own count line (Tokyo: N ${N}, Must see F ${F}) ==`);
  const read = async (hash, sel) => {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
    await ctx.route('**/*', r => r.request().url().startsWith(o) ? r.continue() : r.request().resourceType() === 'image' ? r.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }) : r.abort());
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 120)));
    await p.goto(o + '/beta/' + PAGE + '#' + hash, { waitUntil: 'load' });
    await p.waitForFunction(s => { const e = document.querySelector(s); return e && /\d/.test(e.textContent); }, sel, { timeout: 15000 }).catch(() => {});
    const t = await p.evaluate(s => { const e = document.querySelector(s); return e ? e.textContent.replace(/\s+/g, ' ').trim() : null; }, sel);
    await ctx.close(); return { t, errs };
  };
  // Gallery: the pager's line ("Showing 1–48 of N — all N places" / "… of F (all N places in the guide)")
  let r = await read('view=gallery', '.g-pager .pg-line');
  chk(!!r.t && (r.t.match(/[\d,]+/g) || []).map(num).filter(x => x === N).length >= 2 && !r.errs.length, 'Gallery, no lens: the pager line names all N places', r);
  r = await read('view=gallery&t=1', '.g-pager .pg-line');
  chk(!!r.t && new RegExp('of ' + F + '\\b').test(r.t) && new RegExp('all ' + N + '\\b').test(r.t) && !r.errs.length, 'Gallery, Must see: "… of F (all N places …)"', r);
  r = await read('view=gallery&t=1', '#cleo-shown');
  chk(!!r.t && new RegExp('Showing ' + F + ' of ' + N + '\\b').test(r.t), 'Gallery, Must see: the results line "Showing F of N places"', r);
  // Atlas: the list head ("n places here" with no lens; "F places here, of all N" with one)
  r = await read('view=atlas', '.ms-count');
  chk(!!r.t && /^[\d,]+ places? here/.test(r.t) && num(r.t.match(/[\d,]+/)[0]) <= N && !r.errs.length, 'Atlas, no lens: "n places here" (n ≤ N)', r);
  r = await read('view=atlas&t=1', '.ms-count');
  chk(!!r.t && new RegExp('^' + F + ' places? here, of all ' + N + '\\b').test(r.t), 'Atlas, Must see: "F places here, of all N"', r);
  // Guidebook: "All N places" / "F of all N places match this lens"
  r = await read('view=guidebook', 'p.count');
  chk(r.t === `All ${N} places`, 'Guidebook, no lens: "All N places"', r);
  r = await read('view=guidebook&t=1', 'p.count');
  chk(!!r.t && new RegExp('^' + F + ' of all ' + N + ' places').test(r.t), 'Guidebook, Must see: "F of all N places …"', r);
  await b.close(); srv.close();
  if (fail) { console.log(`>>> FAIL — ${fail} count line(s) wrong`); process.exit(1); }
  console.log('>>> PASS — every view\'s count line says its numbers');
})();
