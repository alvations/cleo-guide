#!/usr/bin/env node
// Screenshots of the beta design mockups at mobile 390×844 and desktop 1440×900 (JPEG q70).
//   NODE_PATH=$(npm root -g) node design/beta/tools/shots.js [id ...]
// Files are served straight from disk via route.fulfill. Google Fonts are fetched with curl (which trusts the
// sandbox proxy CA) and handed to the page, so type renders as designed. Any other network request is aborted —
// which also proves the mockups render with no CDN.
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../../..');
const OUT = path.join(__dirname, '..', 'screenshots');
const BASE = 'https://cleo.local/';
const M = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const DK = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const _fc = {};
function fontFetch(route) {
  const u = route.request().url();
  try {
    if (!_fc[u]) _fc[u] = execFileSync('curl', ['-sS', '--max-time', '20', '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36', u], { maxBuffer: 1 << 26 });
    return route.fulfill({ body: _fc[u], headers: { 'content-type': /googleapis/.test(u) ? 'text/css' : 'font/woff2', 'access-control-allow-origin': '*' } });
  } catch (e) { return route.abort(); }
}
const MK = 'design/beta/mockups/';
const SETS = [
  { id: 'landing', url: MK + 'landing.html', scrolls: [1] },
  { id: 'hub-japan', url: MK + 'hub-japan.html', scrolls: [1] },
  { id: 'city-tokyo', url: MK + 'city-tokyo.html', scrolls: [1] },
  { id: 'city-tokyo-dark', url: MK + 'city-tokyo.html', dark: true },
  { id: 'city-cleveland', url: MK + 'city-cleveland.html', scrolls: [1] },
  { id: 'city-cleveland-gap', url: MK + 'city-cleveland.html', to: '.gap', mobileOnly: true },
  { id: 'place-detail', url: MK + 'place-tokyo.html', scrolls: [1] },
  { id: 'map-sheet', url: MK + 'map-sheet.html' },
  { id: 'guide-picker', url: MK + 'guide-picker.html', scrolls: [1] },
  { id: 'day-plan', url: MK + 'day-plan.html', scrolls: [1] },
  { id: 'saved', url: MK + 'saved.html' },
  { id: 'components', url: MK + 'components.html', full: true, desktopOnly: true },
  { id: 'components-m', url: MK + 'components.html', scrolls: [2.6, 4, 7.2, 9], mobileOnly: true },
];
const metrics = {};
async function shoot(browser, s, vp, tag) {
  const ctx = await browser.newContext({ ...vp, colorScheme: s.dark ? 'dark' : 'light' });
  const page = await ctx.newPage();
  const blocked = new Set();
  await page.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith(BASE)) {
      const f = path.join(ROOT, decodeURIComponent(new URL(u).pathname));
      if (!fs.existsSync(f)) return route.fulfill({ status: 404, body: '' });
      const ext = path.extname(f);
      const ct = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml' }[ext] || 'application/octet-stream';
      return route.fulfill({ body: fs.readFileSync(f), headers: { 'content-type': ct + (ct.startsWith('text') ? '; charset=utf-8' : '') } });
    }
    if (/fonts\.(googleapis|gstatic)\.com/.test(u)) return fontFetch(route);
    blocked.add(new URL(u).host); return route.abort();
  });
  await page.goto(BASE + s.url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(400);
  const m = await page.evaluate(() => {
    const vw = innerWidth, sw = document.documentElement.scrollWidth;
    const ctrls = [...document.querySelectorAll('a:not(.skip),button,input,select,[role=switch]')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && getComputedStyle(e).visibility !== 'hidden'; });
    const small = ctrls.filter(e => { const r = e.getBoundingClientRect(); return r.height < 44 && r.width < 44 ? true : r.height < 24; });
    const card = document.querySelector('article.card');
    const fams = new Set([...document.querySelectorAll('body *')].slice(0, 4000).map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, '').trim()));
    return { overflowX: sw - vw, firstPlaceScreens: card ? +(card.getBoundingClientRect().top / innerHeight).toFixed(2) : null,
      controlsAboveFirstPlace: card ? ctrls.filter(e => { const r = e.getBoundingClientRect(); return r.bottom <= card.getBoundingClientRect().top && r.right > 0 && r.left < innerWidth; }).length : null,
      controls: ctrls.length, cards: document.querySelectorAll('article.card').length, fontFamilies: [...fams] };
  });
  metrics[`${s.id}-${tag}`] = { ...m, blockedHosts: [...blocked] };
  const shots = [];
  if (s.full) shots.push([`${s.id}-${tag}`, { fullPage: true }]);
  else {
    if (s.to) { await page.evaluate(sel => { const e = document.querySelector(sel); if (e) scrollTo(0, e.getBoundingClientRect().top + scrollY - 140); }, s.to); await page.waitForTimeout(200); }
    shots.push([`${s.id}-${tag}`, {}]);
  }
  for (const [name, opt] of shots) await page.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 70, ...opt });
  for (const [i, k] of (s.scrolls || []).entries()) {
    await page.evaluate(k => scrollTo(0, innerHeight * k), k); await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(OUT, `${s.id}-${tag}-s${i + 1}.jpg`), type: 'jpeg', quality: 70 });
  }
  await ctx.close();
}
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const only = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? undefined : undefined });
  for (const s of SETS) {
    if (only.length && !only.includes(s.id)) continue;
    if (!s.desktopOnly) await shoot(browser, s, M, 'm');
    if (!s.mobileOnly) await shoot(browser, s, DK, 'd');
  }
  await browser.close();
  const mf = path.join(OUT, 'metrics.json');
  let prev = {}; try { prev = JSON.parse(fs.readFileSync(mf, 'utf8')); } catch (e) {}
  fs.writeFileSync(mf, JSON.stringify({ ...prev, ...metrics }, null, 1));
  for (const [k, v] of Object.entries(metrics)) console.log(k, JSON.stringify({ ox: v.overflowX, first: v.firstPlaceScreens, above: v.controlsAboveFirstPlace, fam: v.fontFamilies.length, blocked: v.blockedHosts }));
})();
