#!/usr/bin/env node
// Screenshot harness for the 2026-10 UX proposal. Review aid only — not part of any build or gate.
//
//   NODE_PATH=$(npm root -g) node design/ux-2026-10/tools/shots.js before|after|tiles
//
// Sandbox notes: the org egress policy blocks the map CDNs and tile hosts, so Leaflet is served from
// tools/node_modules (same 1.9.4 build the pages ask the CDN for) and tile requests are aborted — the
// screenshots therefore show each page's no-tile state honestly. Google Fonts are fetched with curl (proxy CA)
// and handed to the page, so type renders as designed.
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
// Google Fonts via curl (which trusts the sandbox proxy's CA bundle; Chromium does not), cached per URL.
const _fc = {};
function fontFetch(route) {
  const u = route.request().url();
  try {
    if (!_fc[u]) _fc[u] = execFileSync('curl', ['-sS', '--max-time', '20', '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36', u], { maxBuffer: 1 << 26 });
    return route.fulfill({ body: _fc[u], headers: { 'content-type': /googleapis/.test(u) ? 'text/css' : 'font/woff2', 'access-control-allow-origin': '*' } });
  } catch (e) { return route.abort(); }
}
const ROOT = path.resolve(__dirname, '../../..');
const OUT = path.join(__dirname, '..', 'screenshots');
const BASE = 'https://cleo.local/';   // served straight from disk via route.fulfill (no HTTP server needed)
const LEAF = path.join(ROOT, 'tools/node_modules/leaflet/dist');
const MOBILE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };

const SETS = {
  before: [
    { id: 'before-root-hub', url: 'index.html' },
    { id: 'before-japan-hub', url: 'Japan/index.html' },
    { id: 'before-tokyo', url: 'cities/tokyo.html', scrolls: [1, 2.2] },
    { id: 'before-tokyo-cards', url: 'cities/tokyo.html', to: 'article.entry' },
    { id: 'before-chicago', url: 'cities/chicago.html', scrolls: [1.4] },
    { id: 'before-singapore-hub', url: 'Singapore/index.html' },
    { id: 'before-sg-toa-payoh', url: 'Singapore/toa-payoh.html', scrolls: [1.2] },
    { id: 'before-cleveland', url: 'cleveland.html', scrolls: [1.5] },
  ],
  after: [
    { id: 'after-hub', url: 'design/ux-2026-10/prototypes/hub.html?country=japan', scrolls: [0.95] },
    { id: 'after-hub-us', url: 'design/ux-2026-10/prototypes/hub.html?country=us', to: '#cities', desktopOnly: true },
    { id: 'after-tokyo', url: 'design/ux-2026-10/prototypes/tokyo.html', scrolls: [1.1] },
    { id: 'after-tokyo-concierge', url: 'design/ux-2026-10/prototypes/tokyo.html?concierge=1' },
    { id: 'after-tokyo-foryou', url: 'design/ux-2026-10/prototypes/tokyo.html?prefs=history,pop&vibe=late', to: '#count' },
    { id: 'after-tokyo-night', url: 'design/ux-2026-10/prototypes/tokyo.html?theme=dark&prefs=food&vibe=late', scrolls: [1.1] },
    { id: 'after-place-sheet', url: 'design/ux-2026-10/prototypes/tokyo.html?open=1' },
    { id: 'after-map-sheet', url: 'design/ux-2026-10/prototypes/tokyo.html?view=map', mobileOnly: true },
    { id: 'after-itinerary', url: 'design/ux-2026-10/prototypes/itinerary.html?area=TAITO&prefs=history,food,pop', scrolls: [0.9] },
    { id: 'after-chicago', url: 'design/ux-2026-10/prototypes/chicago.html', scrolls: [1.1] },
  ],
  tiles: [
    { id: 'tile-a-salon', url: 'design/ux-2026-10/prototypes/style-tiles.html#a', desktopOnly: true, el: '#a' },
    { id: 'tile-b-neon', url: 'design/ux-2026-10/prototypes/style-tiles.html#b', desktopOnly: true, el: '#b' },
    { id: 'tile-c-atelier', url: 'design/ux-2026-10/prototypes/style-tiles.html#c', desktopOnly: true, el: '#c' },
  ],
};

async function shoot(browser, s, vp, tag) {
  const ctx = await browser.newContext(vp);
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith(BASE)) {
      const f = path.join(ROOT, decodeURIComponent(u.slice(BASE.length).split(/[?#]/)[0]) || 'index.html');
      return fs.existsSync(f) ? route.fulfill({ path: f }) : route.fulfill({ status: 404, body: 'not found' });
    }
    const m = u.match(/leaflet(?:@[\d.]+\/dist|\/1\.9\.4)\/(leaflet(?:\.min)?\.(js|css))/);
    if (m) return route.fulfill({ path: path.join(LEAF, 'leaflet.' + m[2]) });
    if (/fonts\.(googleapis|gstatic)\.com/.test(u)) return fontFetch(route);
    return route.abort();   // tiles, analytics, anything else external
  });
  await page.goto(BASE + s.url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  try { await Promise.race([page.evaluate(() => document.fonts.ready), page.waitForTimeout(4000)]); } catch (e) {}
  await page.waitForTimeout(1200);
  const opt = { type: 'jpeg', quality: 70 };
  if (s.el) {
    await page.locator(s.el).screenshot({ ...opt, path: path.join(OUT, `${s.id}.jpg`) });
  } else {
    if (s.to) { await page.evaluate(sel => { const e = document.querySelector(sel); if (e) window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 140); }, s.to); await page.waitForTimeout(500); }
    await page.screenshot({ ...opt, path: path.join(OUT, `${s.id}-${tag}.jpg`) });
    let i = 0;
    for (const f of s.scrolls || []) {
      i++;
      await page.evaluate(f => window.scrollTo(0, Math.round(window.innerHeight * f)), f);
      await page.waitForTimeout(500);
      await page.screenshot({ ...opt, path: path.join(OUT, `${s.id}-${tag}-s${i}.jpg`) });
    }
  }
  if (errs.length) console.log(s.id, tag, 'page errors:', errs.slice(0, 2));
  await ctx.close();
}

(async () => {
  const which = process.argv[2] || 'before';
  const only = process.argv[3];
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '<-loopback>' } : undefined });
  for (const s of SETS[which]) {
    if (only && !s.id.includes(only)) continue;
    if (!s.desktopOnly) await shoot(browser, s, MOBILE, 'm');
    if (!s.mobileOnly) await shoot(browser, s, DESKTOP, 'd');
    console.log('shot', s.id);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
