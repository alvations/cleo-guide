#!/usr/bin/env node
'use strict';
/**
 * design/beta/style/v2/tools/shots.js — W7 designer: screenshots of the generated beta/ served from disk, optionally
 * with a direction's token file layered on top (so every palette direction is shown on the REAL pages, not a mock).
 *
 *   NODE_PATH=$(npm root -g) node design/beta/style/v2/tools/shots.js --out <dir> [--css <tokens.css>] [--tag a]
 *        [--only landing,hub,gallery,atlas,place] [--themes light,dark] [--sizes m,d]
 *
 * Same-origin files come from disk; map tiles get a flat neutral tile (no tile host is contacted); anything else
 * off-origin is aborted.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/style/v2/after'));
const CSS = arg('--css', '') ? fs.readFileSync(path.resolve(ROOT, arg('--css')), 'utf8') : '';
const TAG = arg('--tag', 'v2');
const ONLY = (arg('--only', '') || '').split(',').filter(Boolean);
const THEMES = arg('--themes', 'light,dark').split(',');
const SIZES = arg('--sizes', 'm,d').split(',');
const BASE = 'https://cleo.local/';
const VP = { m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true },
             d: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } };
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
const SHOTS = [
  { id: 'landing', url: 'beta/index.html' },
  { id: 'hub', url: 'beta/Japan/index.html' },
  { id: 'gallery', url: 'beta/cities/tokyo.html' },
  { id: 'atlas', url: 'beta/cities/tokyo.html#view=atlas', wait: 1200 },
  { id: 'place', url: 'beta/cities/tokyo.html#p=kanda-myojin', wait: 900 },
  { id: 'guidebook', url: 'beta/cities/tokyo.html#view=guidebook', wait: 1200 },
  { id: 'gallery-cle', url: 'beta/cleveland.html' },
  { id: 'gallery-vn', url: 'beta/Vietnam/index.html' },
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const tileColor = { light: '#E9E6E1', dark: '#22211F' };
  const browser = await chromium.launch(process.env.PW_EXE ? { executablePath: process.env.PW_EXE } : {});
  for (const theme of THEMES) for (const sz of SIZES) {
    const ctx = await browser.newContext({ ...VP[sz], colorScheme: theme, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await ctx.route('**/*', async (route) => {
      const u = new URL(route.request().url());
      if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u.host)) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="${tileColor[theme]}"/></svg>`;
        return route.fulfill({ status: 200, contentType: 'image/svg+xml', body: svg });
      }
      if (u.host !== 'cleo.local') return route.abort();
      let p = path.join(ROOT, decodeURIComponent(u.pathname));
      if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
      if (!fs.existsSync(p)) return route.fulfill({ status: 404, body: 'nf' });
      return route.fulfill({ status: 200, contentType: TYPES[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) });
    });
    // seed two saved places so the accent is visible where it is spent (filled hearts, the saved count)
    const seed = { saved: { 'tokyo/kanda-myojin': { t: 1760000000000 }, 'tokyo/imperial-palace-east-gardens': { t: 1760000000001 }, 'tokyo/senso-ji': { t: 1760000000002 } } };
    await ctx.addInitScript(o => { try { for (const k in o) localStorage.setItem('cleo:v1:' + k, JSON.stringify(o[k])); } catch (e) {} }, seed);
    if (CSS) await ctx.addInitScript((css) => { document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.id = 'dir-tokens'; s.textContent = css; document.head.appendChild(s); }); }, CSS);
    for (const s of SHOTS) {
      if (ONLY.length && !ONLY.includes(s.id)) continue;
      const page = await ctx.newPage();
      await page.goto(BASE + s.url, { waitUntil: 'load' }).catch(e => console.error(s.id, e.message));
      await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
      await page.waitForTimeout(s.wait || 500);
      const f = path.join(OUT, `${s.id}-${sz}-${theme}${TAG ? '' : ''}.jpg`);
      await page.screenshot({ path: f, type: 'jpeg', quality: 72, fullPage: false });
      console.log('shot', path.relative(ROOT, f));
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
})();
