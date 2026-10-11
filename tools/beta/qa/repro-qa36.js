#!/usr/bin/env node
/**
 * QA-36 repro (W6 QA): load an Atlas phone page N times with every off-origin request (tiles included) blocked and
 * count loads with an uncaught page error. Usage: cd tools && node beta/qa/repro-qa36.js [page] [hash] [N]
 *   default: cleveland.html '#view=atlas&a=DT' 20   (2f22763: 20/20 · R5 6393291: 0/20)
 */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const [rel = 'cleveland.html', hash = '#view=atlas&a=DT', n = '20'] = process.argv.slice(2);
const pw = (() => { for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { return require(t); } catch (e) { /* next */ } } throw new Error('playwright not found'); })();
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
srv.listen(0, '127.0.0.1', async () => {
  const base = 'http://127.0.0.1:' + srv.address().port + '/', b = await pw.chromium.launch(); let bad = 0, eg = '';
  for (let i = 0; i < +n; i++) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await ctx.route('**/*', rt => rt.request().url().startsWith(base) ? rt.continue() : rt.abort());
    const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(base + 'beta/' + rel + hash, { waitUntil: 'load' }); await p.waitForTimeout(1500);
    if (errs.length) { bad++; eg = errs[0]; } await ctx.close();
  }
  console.log(`${rel}${hash}: page errors on ${bad}/${n} loads${eg ? ' — ' + eg : ''}`); await b.close(); srv.close(); process.exit(bad ? 1 : 0);
});
