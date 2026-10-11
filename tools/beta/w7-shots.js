#!/usr/bin/env node
'use strict';
/**
 * tools/beta/w7-shots.js — FE-A W7 screenshots of the city page views at 390×844 (DPR 2, touch) and 1440×900, in
 * light and dark, against the generated beta/ on disk. Same-origin files are served from disk; map tiles get a flat
 * tile (no tile host is contacted); anything else off-origin is aborted, proving the page needs no CDN.
 *
 *   NODE_PATH=$(npm root -g) node tools/beta/w7-shots.js [--out design/beta/eval/w7/fe-a/after] [--only id,id] [--dark-only|--light-only]
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/eval/w7/fe-a/after'));
const ONLY = (arg('--only', '') || '').split(',').filter(Boolean);
const BASE = 'https://cleo.local/';
const VP = { m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, d: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } };
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN482YJAAT0Aqt4WyN2AAAAAElFTkSuQmCC', 'base64');
const SETS = [
  { id: 'tokyo-gallery', url: 'beta/cities/tokyo.html' },
  { id: 'tokyo-gallery-s1', url: 'beta/cities/tokyo.html', scroll: 1, wait: 600 },
  { id: 'tokyo-grid', url: 'beta/cities/tokyo.html#pg=2', wait: 600 },
  { id: 'cleveland-gallery', url: 'beta/cleveland.html' },
  { id: 'chinatown-gallery', url: 'beta/Singapore/chinatown.html' },
  { id: 'tokyo-atlas', url: 'beta/cities/tokyo.html#view=atlas', wait: 1000 },
  { id: 'tokyo-place', url: 'beta/cities/tokyo.html#p=kanda-myojin', wait: 900 },
  { id: 'tokyo-place-nophoto', url: 'beta/cities/tokyo.html#p=isegen', wait: 900 },
  { id: 'cleveland-place', url: 'beta/cleveland.html#p=west-side-market', wait: 900 },
  { id: 'chinatown-grid', url: 'beta/Singapore/chinatown.html#all=1', scroll: 2, wait: 600 },
  { id: 'cleveland-closed', url: 'beta/cleveland.html#closed=1&view=gallery', wait: 600 },
  { id: 'tokyo-guidebook', url: 'beta/cities/tokyo.html#view=guidebook', wait: 1200 },
  { id: 'tokyo-insights', url: 'beta/cities/tokyo.html#view=insights', wait: 1200 },
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? undefined : undefined });
  const schemes = process.argv.includes('--dark-only') ? ['dark'] : process.argv.includes('--light-only') ? ['light'] : ['light', 'dark'];
  for (const scheme of schemes) for (const [vk, vp] of Object.entries(VP)) {
    const ctx = await browser.newContext(Object.assign({ colorScheme: scheme, serviceWorkers: 'block' }, vp));
    await ctx.route('**/*', async r => {
      const u = r.request().url();
      if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u)) return r.fulfill({ status: 200, contentType: 'image/png', body: TILE });
      if (!u.startsWith(BASE)) return r.abort('blockedbyclient');
      const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname));
      if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
      return r.fulfill({ status: 200, contentType: TYPES[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) });
    });
    for (const s of SETS) {
      if (ONLY.length && !ONLY.includes(s.id)) continue;
      const page = await ctx.newPage();
      await page.goto(BASE + s.url, { waitUntil: 'load' });
      await page.waitForTimeout(s.wait || 500);
      if (s.scroll) { await page.evaluate(n => scrollBy(0, innerHeight * n), s.scroll); await page.waitForTimeout(500); }
      const f = path.join(OUT, `${s.id}-${vk}-${scheme}.jpg`);
      await page.screenshot({ path: f, type: 'jpeg', quality: 72 });
      console.log(path.relative(ROOT, f));
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
