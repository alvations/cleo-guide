#!/usr/bin/env node
'use strict';
/**
 * tools/beta/atlas-shots.js — W6 Atlas map-first evidence (FE-A): Tokyo, Cleveland and a Singapore town in Atlas at
 * 390×844 (DPR 2, touch) and 1440×900, plus the phone pin sheet and the full tray, with a few layout measurements.
 *
 *   NODE_PATH=$(npm root -g) node tools/beta/atlas-shots.js --tag before|after [--out design/beta/eval/w6/atlas]
 *
 * Same-origin files are served from disk; map tiles get a flat 1×1 tile (no tile host is contacted); anything else
 * off-origin is aborted, so the shots also prove the page needs no CDN.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/eval/w6/atlas'));
const TAG = arg('--tag', 'after');
const BASE = 'https://cleo.local/';
const M = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const D = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN482YJAAT0Aqt4WyN2AAAAAElFTkSuQmCC', 'base64');
const PAGES = [['tokyo', 'beta/cities/tokyo.html'], ['cleveland', 'beta/cleveland.html'], ['chinatown', 'beta/Singapore/chinatown.html']];
const SETS = [];
PAGES.forEach(([k, u]) => {
  SETS.push({ id: k, url: u + '#view=atlas', wait: 1200 });
  SETS.push({ id: k + '-pin', url: u + '#view=atlas', wait: 1200, pin: 1, mobileOnly: 1 });
  SETS.push({ id: k + '-full', url: u + '#view=atlas', wait: 1200, full: 1, mobileOnly: 1 });
});
SETS.push({ id: 'cleveland-place', url: 'beta/cleveland.html#view=atlas&p=the-arcade-old-arcade', wait: 1500 });

async function measure(page) {
  return page.evaluate(() => {
    const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('[hidden]'); };
    const m = document.getElementById('cleo-map'), mr = vis(m) ? m.getBoundingClientRect() : null;
    const lp = document.querySelector('.listpane'), lr = vis(lp) ? lp.getBoundingClientRect() : null;
    const first = [...document.querySelectorAll('li.pl')].filter(vis).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    const ft = first ? first.getBoundingClientRect().top + scrollY : null;
    // map share: the uncovered map band (minus the tray on phones) over the viewport
    const cover = lr && mr && lr.top > mr.top ? Math.max(0, mr.bottom - lr.top) : 0;
    return {
      mapWidthPct: mr ? Math.round(mr.width / innerWidth * 100) : null,
      mapVisiblePct: mr ? Math.round(Math.max(0, Math.min(mr.bottom, innerHeight) - Math.max(mr.top, 0) - cover) * Math.min(mr.width, innerWidth) / (innerWidth * innerHeight) * 100) : null,
      listWidthPct: lr ? Math.round(lr.width / innerWidth * 100) : null,
      firstCardTop: ft, screensToFirstCard: ft == null ? null : +(ft / innerHeight).toFixed(2),
      firstCard: first ? (first.querySelector('.pl-n') || first).textContent.trim().slice(0, 40) : null,
      detent: (document.querySelector('.split') || document.body).getAttribute('data-detent'),
      pins: document.querySelectorAll('.leaflet-overlay-pane path.leaflet-interactive').length,
      clusters: document.querySelectorAll('.pin-cl').length,
      overflowX: document.documentElement.scrollWidth - innerWidth,
    };
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const metrics = {};
  for (const [vk, vp] of [['m', M], ['d', D]]) {
    for (const s of SETS) {
      if (s.mobileOnly && vk === 'd') continue;
      const ctx = await browser.newContext(Object.assign({ reducedMotion: 'reduce' }, vp));
      let off = 0;
      await ctx.route('**/*', route => {
        const u = new URL(route.request().url());
        if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u.host)) return route.fulfill({ body: TILE, headers: { 'content-type': 'image/png' } });
        if (u.origin + '/' !== BASE) { off++; return route.abort(); }
        const p = path.join(ROOT, decodeURIComponent(u.pathname));
        if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return route.fulfill({ status: 404, body: 'not found' });
        return route.fulfill({ body: fs.readFileSync(p), headers: { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' } });
      });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(BASE + s.url, { waitUntil: 'load' });
      await page.waitForTimeout(s.wait || 600);
      if (s.full) {   // before: the phone list is the page (map one tap away); after: the tray's full detent
        await page.evaluate(() => { const g = document.querySelector('[data-detent-cycle]'); if (g && g.offsetParent) { g.click(); g.click(); } });
        await page.waitForTimeout(500);
      }
      if (s.pin) {
        await page.evaluate(() => { const t = document.querySelector('.map-toggle'); if (t && t.offsetParent && !document.documentElement.classList.contains('atlas-m')) t.click(); });
        await page.waitForTimeout(900);
        await page.evaluate(() => { const ps = [...document.querySelectorAll('.leaflet-overlay-pane path.leaflet-interactive')].filter(p => { const b = p.getBoundingClientRect(); return b.width && b.top > 140 && b.bottom < innerHeight - 220; });
          const p = ps[Math.floor(ps.length / 2)]; if (p) p.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
        await page.waitForTimeout(600);
      }
      const m = await measure(page);
      m.jsErrors = errors; m.offOriginAborted = off;
      metrics[`${s.id}-${vk}`] = m;
      await page.screenshot({ path: path.join(OUT, `${TAG}-${s.id}-${vk}.jpg`), type: 'jpeg', quality: 70 });
      await ctx.close();
    }
  }
  await browser.close();
  const mf = path.join(OUT, `${TAG}-metrics.json`);
  fs.writeFileSync(mf, JSON.stringify(metrics, null, 1) + '\n');
  for (const [k, m] of Object.entries(metrics)) console.log(k.padEnd(22), `mapW=${m.mapWidthPct}% mapVis=${m.mapVisiblePct}% listW=${m.listWidthPct}% 1st=${m.screensToFirstCard} det=${m.detent} pins=${m.pins} cl=${m.clusters} ovX=${m.overflowX} err=${m.jsErrors.length}${m.jsErrors.length ? ' ' + m.jsErrors[0].slice(0, 100) : ''}`);
})();
