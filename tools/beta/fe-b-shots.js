#!/usr/bin/env node
'use strict';
/**
 * tools/beta/fe-b-shots.js — FE-B lane screenshots + measurements for the landing, hubs, method page, shell and
 * states (M1-16/17/18/19/09) at 390×844 (DPR 3, touch) and 1440×900, against the generated beta/ on disk.
 *
 *   NODE_PATH=$(npm root -g) node tools/beta/fe-b-shots.js [--out design/beta/screenshots] [--tag w1-feb]
 *
 * Every request is served from disk via route.fulfill; anything off-origin is aborted, so each shot also proves
 * the page renders with no CDN. Writes <tag>-<id>-<m|d>.jpg (JPEG q70) and <tag>-metrics.json.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/screenshots'));
const TAG = arg('--tag', 'w1-feb');
const BASE = 'https://cleo.local/';
const M = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const D = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

const SETS = [
  { id: 'landing', url: 'beta/index.html' },
  { id: 'landing-s1', url: 'beta/index.html', scroll: 1 },
  { id: 'hub-japan', url: 'beta/Japan/index.html' },
  { id: 'hub-singapore', url: 'beta/Singapore/index.html' },
  { id: 'method', url: 'beta/how-we-choose.html' },
  { id: 'accessibility', url: 'beta/accessibility.html' },
  { id: 'landing-themes', url: 'beta/index.html', anchor: 'themes' },
  { id: 'hub-us', url: 'beta/index.html', anchor: 'us' },
  { id: 'hub-belgium', url: 'beta/Belgium/index.html' },
  { id: 'search-guides', url: 'beta/index.html?q=kyoto' },
  { id: 'archive', url: 'beta/Singapore/singapore-old.html' },
  { id: 'search', url: 'beta/index.html?q=ramen' },
  { id: 'state-no-results', url: 'beta/index.html?q=zzqxv' },
  { id: 'state-offline', url: 'beta/Japan/index.html', offline: true },
  { id: 'state-storage', url: 'beta/saved.html', storageThrows: true },
  { id: 'state-unknown-page', url: 'beta/404.html' },
  { id: 'header-search', url: 'beta/how-we-choose.html', openSearch: 'senso-ji' },
  { id: 'header-city', url: 'beta/cities/tokyo.html' },
];

async function measure(page) {
  return page.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const inProse = el => !!el.closest('p, li.prose, .prose p, .prose li') && el.tagName === 'A' && !el.classList.contains('btn') && !el.classList.contains('pill');
    const small = [];
    for (const el of document.querySelectorAll('a[href], button, input, select, summary, [role=button]')) {
      if (!vis(el) || inProse(el) || el.classList.contains('skip')) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 44 - 0.5 || r.height < 44 - 0.5) small.push(`${el.tagName.toLowerCase()}.${el.className || ''} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    const H = innerHeight, tab = document.querySelector('.tabbar');
    const fold = tab && vis(tab) ? tab.getBoundingClientRect().top : H;
    const tiles = [...document.querySelectorAll('.tile')].filter(vis).map(t => t.getBoundingClientRect());
    const bar = document.querySelector('[data-cleo-shell="topbar"]');
    const named = [...document.querySelectorAll('a[href], button, input')].filter(vis).filter(el => !(el.getAttribute('aria-label') || el.textContent.trim() || (el.labels && el.labels.length) || el.getAttribute('title')));
    return {
      overflowX: document.documentElement.scrollWidth - innerWidth,
      headerH: bar ? Math.round(bar.getBoundingClientRect().height) : null,
      tilesFullyAboveFold: tiles.filter(r => r.top >= 0 && r.bottom <= fold).length,
      tilesNameAboveFold: [...document.querySelectorAll('.tile h3')].filter(vis).filter(h => { const r = h.getBoundingClientRect(); return r.top >= 0 && r.bottom <= fold; }).length,
      tapTargetsUnder44: small.length, tapTargetsUnder44List: small.slice(0, 12),
      controlsWithoutName: named.length,
      landmarks: ['header', 'nav', 'main', 'footer'].filter(s => document.querySelector(s)),
      skipLink: !!document.querySelector('a.skip[href="#main"]') && !!document.getElementById('main'),
      states: [...document.querySelectorAll('[data-cleo-state],[data-cleo-banner]')].map(e => e.getAttribute('data-cleo-state') || e.getAttribute('data-cleo-banner')),
    };
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const metrics = {};
  for (const [vk, vp] of [['m', M], ['d', D]]) {
    for (const s of SETS) {
      const ctx = await browser.newContext(vp);
      const offOrigin = [];
      await ctx.route('**/*', route => {
        const u = new URL(route.request().url());
        if (u.origin + '/' !== BASE) { offOrigin.push(u.href); return route.abort(); }
        const p = path.join(ROOT, decodeURIComponent(u.pathname));
        if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return route.fulfill({ status: 404, body: 'not found' });
        return route.fulfill({ body: fs.readFileSync(p), headers: { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' } });
      });
      if (s.storageThrows) await ctx.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(BASE + s.url, { waitUntil: 'load' });
      await page.waitForTimeout(250);
      if (s.offline) await page.evaluate(() => window.dispatchEvent(new Event('offline')));
      if (s.storageThrows) await page.evaluate(() => document.dispatchEvent(new CustomEvent('cleo:saved', { detail: {} })));
      if (s.openSearch) {
        await page.click('[data-cleo-search-open] >> nth=0');
        await page.fill('#cleo-pq', s.openSearch);
        await page.waitForTimeout(500);
      }
      if (s.anchor) await page.evaluate(id => { const e = document.getElementById(id); if (e) window.scrollTo({ top: e.getBoundingClientRect().top + scrollY - 70, behavior: 'instant' }); }, s.anchor);
      if (s.anchor) await page.waitForTimeout(400);
      if (s.scroll) await page.evaluate(n => window.scrollTo(0, innerHeight * n), s.scroll);
      if (/q=/.test(s.url)) { await page.waitForTimeout(400); await page.evaluate(() => { const r = document.getElementById('results'); if (r) window.scrollTo(0, r.getBoundingClientRect().top + scrollY - 70); }); }
      await page.waitForTimeout(150);
      const m = await measure(page);
      m.jsErrors = errors; m.offOriginAborted = offOrigin.length;
      metrics[`${s.id}-${vk}`] = m;
      await page.screenshot({ path: path.join(OUT, `${TAG}-${s.id}-${vk}.jpg`), type: 'jpeg', quality: 70 });
      await ctx.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, `${TAG}-metrics.json`), JSON.stringify(metrics, null, 1));
  for (const [k, m] of Object.entries(metrics)) console.log(k.padEnd(28), `ovX=${m.overflowX} hdr=${m.headerH} tiles(full/name)=${m.tilesFullyAboveFold}/${m.tilesNameAboveFold} tap<44=${m.tapTargetsUnder44} unnamed=${m.controlsWithoutName} err=${m.jsErrors.length} states=${m.states.join(',')}`);
})();
