#!/usr/bin/env node
// Screenshot + metrics harness for the 2026-10 competitive UX research. Review aid only — not part of any
// build or gate. Adapted from design/ux-2026-10/tools/shots.js (same sandbox handling).
//
//   NODE_PATH=$(npm root -g) node design/research-2026-10/ux-competitive/tools/shots.js [filter]
//
// Pages are served straight from disk via route.fulfill. Leaflet comes from tools/node_modules (the same 1.9.4
// build the pages request from the CDN); map tiles and every other external request are aborted, so maps show
// their no-tile state. Google Fonts are fetched with curl (which trusts the sandbox proxy CA) so type renders
// as designed. Only OUR pages are captured — never a competitor's.
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const _fc = {};
function fontFetch(route) {
  const u = route.request().url();
  try {
    if (!_fc[u]) _fc[u] = execFileSync('curl', ['-sS', '--max-time', '20', '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36', u], { maxBuffer: 1 << 26 });
    return route.fulfill({ body: _fc[u], headers: { 'content-type': /googleapis/.test(u) ? 'text/css' : 'font/woff2', 'access-control-allow-origin': '*' } });
  } catch (e) { return route.abort(); }
}
const ROOT = path.resolve(__dirname, '../../../..');
const OUT = path.join(__dirname, '..', 'screenshots');
const BASE = 'https://cleo.local/';
const LEAF = path.join(ROOT, 'tools/node_modules/leaflet/dist');
const MOBILE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };

// `card` = selector of the first place card, used for the "screens to first place" metric.
const SHOTS = [
  { id: 'beta-cleveland', url: 'beta/cleveland.html', card: 'article.entry', scrolls: [1, 2.5], to: 'article.entry' },
  { id: 'live-cleveland', url: 'cleveland.html', card: 'article.entry', scrolls: [1, 2.5], to: 'article.entry' },
  { id: 'live-tokyo', url: 'cities/tokyo.html', card: 'article.entry', scrolls: [1.5], to: 'article.entry' },
  { id: 'live-hub', url: 'index.html', scrolls: [1] },
  { id: 'beta-hub', url: 'beta/index.html', scrolls: [1] },
  { id: 'salon-hub', url: 'design/ux-2026-10/prototypes/hub.html?country=japan', scrolls: [1] },
  { id: 'salon-tokyo', url: 'design/ux-2026-10/prototypes/tokyo.html', card: 'article', scrolls: [1.1] },
  { id: 'salon-sheet', url: 'design/ux-2026-10/prototypes/tokyo.html?open=1' },
  { id: 'salon-map', url: 'design/ux-2026-10/prototypes/tokyo.html?view=map', mobileOnly: true },
  { id: 'salon-itinerary', url: 'design/ux-2026-10/prototypes/itinerary.html?area=TAITO&prefs=history,food,pop', scrolls: [0.9] },
];

async function metrics(page, card) {
  return page.evaluate(card => {
    const vh = innerHeight, vw = innerWidth;
    const first = card && document.querySelector(card);
    const top = first ? first.getBoundingClientRect().top + scrollY : null;
    const ctrls = [...document.querySelectorAll('a,button,input,select,[role=button],label.chip,.chip')]
      .filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && getComputedStyle(e).visibility !== 'hidden'; });
    const above = top == null ? null : ctrls.filter(e => e.getBoundingClientRect().top + scrollY < top).length;
    const small = ctrls.filter(e => e.getBoundingClientRect().height < 44).length;
    const fams = new Set(); let mono = 0, upper = 0, n = 0;
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (tw.nextNode()) { const t = tw.currentNode; if (!t.textContent.trim() || !t.parentElement) continue;
      const cs = getComputedStyle(t.parentElement); n++; fams.add(cs.fontFamily.split(',')[0].replace(/["']/g, '').trim());
      if (/mono/i.test(cs.fontFamily)) mono++; if (cs.textTransform === 'uppercase') upper++; }
    return { screensToFirstPlace: top == null ? null : +(top / vh).toFixed(1), controlsAboveFirstPlace: above,
      controls: ctrls.length, controlsUnder44px: small, pageHeight: document.documentElement.scrollHeight,
      overflowX: Math.max(0, document.documentElement.scrollWidth - vw), textNodes: n,
      uppercaseTextNodes: upper, monoTextNodes: mono, fontFamilies: [...fams].slice(0, 12),
      images: document.images.length };
  }, card);
}

async function shoot(browser, s, vp, tag, out) {
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
    return route.abort();
  });
  await page.goto(BASE + s.url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  try { await Promise.race([page.evaluate(() => document.fonts.ready), page.waitForTimeout(4000)]); } catch (e) {}
  await page.waitForTimeout(1200);
  const opt = { type: 'jpeg', quality: 70 };
  out[`${s.id}-${tag}`] = await metrics(page, s.card);
  await page.screenshot({ ...opt, path: path.join(OUT, `${s.id}-${tag}.jpg`) });
  let i = 0;
  for (const f of s.scrolls || []) {
    i++;
    await page.evaluate(f => window.scrollTo(0, Math.round(window.innerHeight * f)), f);
    await page.waitForTimeout(500);
    await page.screenshot({ ...opt, path: path.join(OUT, `${s.id}-${tag}-s${i}.jpg`) });
  }
  if (s.to) {
    await page.evaluate(sel => { const e = document.querySelector(sel); if (e) window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 80); }, s.to);
    await page.waitForTimeout(500);
    await page.screenshot({ ...opt, path: path.join(OUT, `${s.id}-${tag}-card.jpg`) });
  }
  if (errs.length) console.log(s.id, tag, 'page errors:', errs.slice(0, 2));
  await ctx.close();
}

(async () => {
  const only = process.argv[2];
  fs.mkdirSync(OUT, { recursive: true });
  const mf = path.join(__dirname, '..', 'metrics.json');
  const out = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : {};
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '<-loopback>' } : undefined });
  for (const s of SHOTS) {
    if (only && !s.id.includes(only)) continue;
    await shoot(browser, s, MOBILE, 'm', out);
    if (!s.mobileOnly) await shoot(browser, s, DESKTOP, 'd', out);
    console.log('shot', s.id);
  }
  await browser.close();
  fs.writeFileSync(mf, JSON.stringify(out, null, 1) + '\n');
})().catch(e => { console.error(e); process.exit(1); });
