#!/usr/bin/env node
'use strict';
/**
 * tools/beta/i18n-ja-probe.js — i18n D-41: a real-browser check that a city page under ?lang=ja has no English
 * interface text in the parts the browser draws (sheet, rows, lens, pager, chips, toolbar, rail), and no JS errors.
 * Data (names, write-ups, sources, dishes, credits) is skipped by selector; what is printed is for a human to read.
 *
 *   node tools/beta/i18n-ja-probe.js [cities/tokyo.html] [hash ...]
 */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const page = process.argv[2] || 'cities/tokyo.html';
const hashes = process.argv.length > 3 ? process.argv.slice(3) : ['#view=gallery', '#view=atlas&t=1', '#p=imperial-palace-east-gardens', '#view=atlas&closed=1'];
(async () => {
  const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res));
  const base = `http://127.0.0.1:${srv.address().port}/beta/`, b = await chromium.launch();
  for (const h of hashes) for (const vp of [390, 1440]) {
    const ctx = await b.newContext({ viewport: { width: vp, height: 900 }, serviceWorkers: 'block' }), p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto(base + page + '?lang=ja' + h); await p.waitForTimeout(2500);
    const left = await p.evaluate(() => {
      const H = '#cleo-view, #cleo-sheet, #cleo-fy, #cleo-rows-host, .g-lead-card, #cleo-lens, #cleo-shown, [data-cleo-applied], .area-chips, .pager, #cleo-fyline, .pl-x, .nopin, .day-chip, .toolbar, .masthead .facts, .rail';
      const DATA = '.ge h4, .ge-w, .ad, .hoods, .gk, .urls, .srclist b, .note, .ixi a, .tl + b, h1, .legend li, .gsig, .ch-intro, .meta, .ch-h h2, .toc .t, .pl-n, .pl-w, .pl-k > :not(.lbl), .pl-ad, button.src, figure, figcaption, .credit, .gc-n, .gc-w, .gc-cred, .rail-i .t, .chip, h1, .sub, .srclist .nm, .srclist .ttl, .pills .pill, .closeby a, .sh-by b, #sh-t, .why, .tag, h2.d2, .g-row h2';
      const out = new Set();
      document.querySelectorAll(H).forEach(el => { if (el.hidden) return; const tw = document.createTreeWalker(el, 4);
        for (let n; (n = tw.nextNode());) { const pe = n.parentElement; if (pe.closest(DATA) || pe.closest('svg,script')) continue; const t = n.nodeValue.trim(); if (/[A-Za-z]{3,}/.test(t)) out.add(t.slice(0, 70)); } });
      return { lang: document.documentElement.lang, left: [...out].slice(0, 25) };
    });
    console.log(`${h} @${vp}  lang=${left.lang}  errors=${errs.length}  english-looking: ${JSON.stringify(left.left)}`);
    await ctx.close();
  }
  await b.close(); srv.close();
})();
