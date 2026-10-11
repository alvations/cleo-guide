#!/usr/bin/env node
'use strict';
/**
 * tools/beta/w8-shots.js — FE-A W8 screenshots (day plans, place detail, grid density) at 390×844 (DPR 2, touch) and 1440×900, in
 * light and dark, against the generated beta/ on disk. Same-origin files are served from disk; map tiles get a flat
 * tile (no tile host is contacted); anything else off-origin is aborted, proving the page needs no CDN.
 *
 * A set may seed storage (`seed`, as the page's own cleo:v1: keys), pin a width (`w`: 1024 / 1280 for grid density) or run
 * `act` in the page before the shot.
 *
 *   NODE_PATH=$(npm root -g) node tools/beta/w8-shots.js [--out design/beta/eval/w8/fe-a/after] [--only id,id] [--dark-only|--light-only]
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/eval/w8/fe-a/after'));
const ONLY = (arg('--only', '') || '').split(',').filter(Boolean);
const BASE = 'https://cleo.local/';
const VP = { m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, d: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } };
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
// offline tile stub: a flat 1×1 PNG in a neutral land colour (light #F2EFE9, dark = the sand token #24211D); no tile host is contacted
const zlib = require('zlib');
const png1 = (r, g, b) => { const crc = buf => { let c, k, t = []; for (let n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } c = 0xFFFFFFFF; for (const x of buf) c = t[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  const chunk = (type, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(1, 0); ih.writeUInt32BE(1, 4); ih[8] = 8; ih[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(Buffer.from([0, r, g, b]))), chunk('IEND', Buffer.alloc(0))]); };
const TILES = { light: png1(0xF2, 0xEF, 0xE9), dark: png1(0x24, 0x21, 0x1D) };
const T5 = ['senso-ji', 'tokyo-national-museum', 'ueno-park', 'kappabashi-dogu-gai', 'yanaka-cemetery', 'ameya-yokocho', 'kanda-myojin'];
const SAVED = Object.fromEntries(T5.map(id => ['tokyo/' + id, { t: 1 }]));
const SETS = [
  { id: 'day-tokyo', url: 'beta/cities/tokyo.html#day=TAITO', wait: 900 },
  { id: 'day-tokyo-s1', url: 'beta/cities/tokyo.html#day=TAITO', wait: 900, scroll: 1 },
  { id: 'day-edit', url: 'beta/cities/tokyo.html#day=TAITO', wait: 900, act: () => { const b = document.querySelector('[data-dy="edit"]'); if (b) b.click(); } },
  { id: 'day-gallery', url: 'beta/cities/tokyo.html#view=gallery&day=TAITO', wait: 900, act: () => { const l = document.getElementById('cleo-lens'); if (l) scrollTo({ top: scrollY + l.getBoundingClientRect().top - 150, behavior: 'instant' }); } },
  { id: 'day-shared', url: 'beta/cities/tokyo.html#day=TAITO&s=kappabashi-dogu-gai,senso-ji,ameya-yokocho', wait: 1400 },
  { id: 'mine-tokyo', url: 'beta/cities/tokyo.html#mine=1', wait: 900, seed: { saved: SAVED }, act: () => { const l = document.getElementById('cleo-lens'); if (l) scrollTo({ top: scrollY + l.getBoundingClientRect().top - 150, behavior: 'instant' }); } },
  { id: 'day-atlas', url: 'beta/cities/tokyo.html#view=atlas&day=TAITO', wait: 1200 },
  { id: 'place-tokyo', url: 'beta/cities/tokyo.html#p=kanda-myojin', wait: 900 },
  { id: 'place-tokyo-end', url: 'beta/cities/tokyo.html#p=kanda-myojin', wait: 900, act: () => { const s = document.querySelector('#cleo-sheet .sheet-b, #cleo-sheet [data-sh-body], #cleo-sheet .body') || document.querySelector('#cleo-sheet'); [s].concat([...document.querySelectorAll('#cleo-sheet *')].filter(e => e.scrollHeight > e.clientHeight + 40)).forEach(e => e && (e.scrollTop = 1e5)); } },
  { id: 'place-closed', url: 'beta/cleveland.html#p=heinens-downtown', wait: 900 },
  { id: 'gallery-bar-scrolled', url: 'beta/cities/tokyo.html', wait: 700, scroll: 2.2 },
  { id: 'grid-1024', url: 'beta/cities/tokyo.html#all=1', wait: 700, scroll: 1.6, w: 1024 },
  { id: 'grid-1280', url: 'beta/cities/tokyo.html#all=1', wait: 700, scroll: 1.6, w: 1280 },
  { id: 'grid-1440', url: 'beta/cities/tokyo.html#all=1', wait: 700, scroll: 1.6, w: 1440 },
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? undefined : undefined });
  const schemes = process.argv.includes('--dark-only') ? ['dark'] : process.argv.includes('--light-only') ? ['light'] : ['light', 'dark'];
  for (const scheme of schemes) for (const [vk, vp] of Object.entries(VP)) {
    const ctx = await browser.newContext(Object.assign({ colorScheme: scheme, serviceWorkers: 'block' }, vp));
    await ctx.route('**/*', async r => {
      const u = r.request().url();
      if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u)) return r.fulfill({ status: 200, contentType: 'image/png', body: TILES[scheme] });
      if (!u.startsWith(BASE)) return r.abort('blockedbyclient');
      const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname));
      if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
      return r.fulfill({ status: 200, contentType: TYPES[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) });
    });
    for (const s of SETS) {
      if (ONLY.length && !ONLY.includes(s.id)) continue;
      if (s.w && vk === 'm') continue;
      const page = await ctx.newPage();
      if (s.seed) await page.addInitScript(o => { try { for (const k in o) localStorage.setItem('cleo:v1:' + k, JSON.stringify(o[k])); } catch (e) {} }, s.seed);
      if (s.w) await page.setViewportSize({ width: s.w, height: 900 });
      await page.goto(BASE + s.url, { waitUntil: 'load' });
      await page.waitForTimeout(s.wait || 500);
      if (s.act) { await page.evaluate(s.act); await page.waitForTimeout(400); }
      if (s.scroll) { await page.evaluate(n => scrollBy(0, innerHeight * n), s.scroll); await page.waitForTimeout(500); }
      const f = path.join(OUT, `${s.id}${s.w ? "" : "-" + vk}-${scheme}.jpg`);
      await page.screenshot({ path: f, type: 'jpeg', quality: 72 });
      console.log(path.relative(ROOT, f));
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
