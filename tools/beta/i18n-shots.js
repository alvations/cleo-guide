#!/usr/bin/env node
'use strict';
/**
 * tools/beta/i18n-shots.js — i18n D-41 evidence: the Japanese (AI-reviewed) interface next to English.
 * Landing, Tokyo Gallery, Tokyo Atlas and a place detail; ja and en; 390×844 @2 and 1440×900; light (+ dark for ja).
 *
 *   NODE_PATH=$(npm root -g) node tools/beta/i18n-shots.js [--out design/beta/eval/i18n]
 *
 * Serves beta/ from disk; every off-origin request is aborted (so each shot also shows no CDN). ja is opened through
 * the page's own ?lang=ja route. Writes <page>-<locale>-<m|d>-<light|dark>.jpg and metrics.json: <html lang>, AI note
 * present, switcher target size, horizontal overflow, cumulative layout shift, JS errors.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/eval/i18n'));
const BASE = 'https://cleo.local/';
const PAGES = { landing: ['beta/index.html', ''], 'tokyo-gallery': ['beta/cities/tokyo.html', '#view=gallery'],
  'tokyo-atlas': ['beta/cities/tokyo.html', '#view=atlas'], 'tokyo-place': ['beta/cities/tokyo.html', '#p=imperial-palace-east-gardens'] };
const VP = { m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, d: { viewport: { width: 1440, height: 900 } } };
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(), metrics = {};
  for (const [name, [file, hash]] of Object.entries(PAGES)) for (const loc of ['en', 'ja']) for (const [vk, vp] of Object.entries(VP)) for (const scheme of loc === 'ja' ? ['light', 'dark'] : ['light']) {
    const ctx = await b.newContext(Object.assign({ colorScheme: scheme }, vp)), errs = [];
    await ctx.route('**/*', r => {
      const u = new URL(r.request().url());
      if (u.origin + '/' !== BASE) return r.abort();
      const f = path.join(ROOT, decodeURIComponent(u.pathname));
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({ status: 404, body: '' });
      return r.fulfill({ body: fs.readFileSync(f), headers: { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' } });
    });
    await ctx.addInitScript(() => { window.__cls = 0; try { new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true }); } catch (e) {} });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(String(e)));
    await p.goto(BASE + file + (loc === 'ja' ? '?lang=ja' : '') + hash, { waitUntil: 'load' }); await p.waitForTimeout(1500);
    const m = await p.evaluate(() => {
      const sw = [...document.querySelectorAll('[data-cleo-locale]')].filter(el => el.offsetWidth).map(el => { const r = el.getBoundingClientRect(); return [el.getAttribute('data-cleo-locale'), Math.round(r.width), Math.round(r.height)]; });
      return { lang: document.documentElement.lang, note: !!document.querySelector('.l10n-note'), switcher: sw, overflowX: document.documentElement.scrollWidth - innerWidth,
        cls: Math.round(window.__cls * 1000) / 1000, wordBreak: getComputedStyle(document.body).wordBreak, title: document.title };
    });
    const id = `${name}-${loc}-${vk}-${scheme}`;
    await p.screenshot({ path: path.join(OUT, `${id}.jpg`), type: 'jpeg', quality: 70 });
    if (name === 'landing') {                              // the footer: the longest catalogue sentences (colophon, about)
      await p.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })); await p.waitForTimeout(300);
      await p.screenshot({ path: path.join(OUT, `${id}-footer.jpg`), type: 'jpeg', quality: 70 });
    }
    metrics[id] = Object.assign(m, { jsErrors: errs });
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(path.join(OUT, 'metrics.json'), JSON.stringify(metrics, null, 1) + '\n');
  for (const [k, m] of Object.entries(metrics)) console.log(k.padEnd(30), `lang=${m.lang} note=${m.note} sw=${JSON.stringify(m.switcher)} ovX=${m.overflowX} cls=${m.cls} wb=${m.wordBreak} err=${m.jsErrors.length}`);
})();
