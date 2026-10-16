#!/usr/bin/env node
'use strict';
/**
 * tools/beta/w8-feb-shots.js — FE-B W8 evidence: Guidebook and Insights on design system v2, 390×844 @2 and 1440×900,
 * light and dark, opened through the city page's own route (#view=guidebook | #view=insights).
 *
 *   NODE_PATH=$(npm root -g) node tools/beta/w8-feb-shots.js [--out design/beta/eval/w8/fe-b] [--tag after] [--cities tokyo,cleveland]
 *
 * Serves beta/ from disk; every off-origin request is aborted (so each shot also shows no CDN). Writes
 * <tag>-<city>-<view>[-s1]-<m|d>-<light|dark>.jpg and <tag>-metrics.json (JS errors, overflow, tap targets < 44).
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/eval/w8/fe-b'));
const TAG = arg('--tag', 'after');
const PAGES = { tokyo: 'beta/cities/tokyo.html', cleveland: 'beta/cleveland.html', kyoto: 'beta/cities/kyoto.html', hanoi: 'beta/Vietnam/hanoi.html' };
const CITIES = arg('--cities', 'tokyo,cleveland').split(',');
const BASE = 'https://cleo.local/';
const VP = { m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, d: { viewport: { width: 1440, height: 900 } } };
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(), metrics = {};
  for (const city of CITIES) for (const view of ['guidebook', 'insights']) for (const [vk, vp] of Object.entries(VP)) for (const scheme of ['light', 'dark']) {
    const ctx = await b.newContext(Object.assign({ colorScheme: scheme }, vp)), errs = [];
    await ctx.route('**/*', r => {
      const u = new URL(r.request().url());
      if (u.origin + '/' !== BASE) return r.abort();
      const f = path.join(ROOT, decodeURIComponent(u.pathname));
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({ status: 404, body: '' });
      return r.fulfill({ body: fs.readFileSync(f), headers: { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' } });
    });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(String(e)));
    await p.goto(BASE + PAGES[city] + '#view=' + view, { waitUntil: 'load' }); await p.waitForTimeout(1200);
    const id = `${TAG}-${city}-${view}`;
    const m = await p.evaluate(() => {
      const vis = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
      const small = [...document.querySelectorAll('.vw a[href], .vw button')].filter(vis).filter(el => !el.closest('p, li.prose') || el.matches('.btn, .pill'))
        .filter(el => { const r = el.getBoundingClientRect(); return r.width < 43.5 || r.height < 43.5; }).length;
      return { overflowX: document.documentElement.scrollWidth - innerWidth, tapSmall: small, view: document.documentElement.dataset.view };
    });
    await p.screenshot({ path: path.join(OUT, `${id}-${vk}-${scheme}.jpg`), type: 'jpeg', quality: 70 });
    await p.evaluate(() => { const v = document.querySelector('.vw:not([hidden])') || document.body; window.scrollTo({ top: v.getBoundingClientRect().top + scrollY + innerHeight * 0.9, behavior: 'instant' }); });
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, `${id}-s1-${vk}-${scheme}.jpg`), type: 'jpeg', quality: 70 });
    metrics[`${id}-${vk}-${scheme}`] = Object.assign(m, { jsErrors: errs });
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(path.join(OUT, `${TAG}-metrics.json`), JSON.stringify(metrics, null, 1));
  for (const [k, m] of Object.entries(metrics)) console.log(k.padEnd(40), `view=${m.view} ovX=${m.overflowX} tap<44=${m.tapSmall} err=${m.jsErrors.length}`);
})();
