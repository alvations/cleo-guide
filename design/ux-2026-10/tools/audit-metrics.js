#!/usr/bin/env node
// Measures audit evidence on the CURRENT live pages (read-only): depth of the first place card, number of
// interactive controls above it, tap targets under 44px on mobile, low-contrast text, page height, and a
// close-up of one place card. Writes design/ux-2026-10/audit-metrics.json + card close-ups.
//   NODE_PATH=$(npm root -g) node design/ux-2026-10/tools/audit-metrics.js
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
const OUT = path.join(__dirname, '..');
const BASE = 'https://cleo.local/';
const LEAF = path.join(ROOT, 'tools/node_modules/leaflet/dist');
const PAGES = ['cities/tokyo.html', 'cities/chicago.html', 'cleveland.html', 'Singapore/toa-payoh.html', 'index.html', 'Japan/index.html', 'Singapore/index.html'];

function lum(c) { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b] = m.slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; }

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  const res = {};
  for (const rel of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.route('**/*', route => {
      const u = route.request().url();
      if (u.startsWith(BASE)) { const f = path.join(ROOT, decodeURIComponent(u.slice(BASE.length).split(/[?#]/)[0])); return fs.existsSync(f) ? route.fulfill({ path: f }) : route.fulfill({ status: 404, body: '' }); }
      const m = u.match(/leaflet(?:@[\d.]+\/dist|\/1\.9\.4)\/(leaflet(?:\.min)?\.(js|css))/);
      if (m) return route.fulfill({ path: path.join(LEAF, 'leaflet.' + m[2]) });
      if (/fonts\.(googleapis|gstatic)\.com/.test(u)) return fontFetch(route);
      return route.abort();
    });
    const t0 = Date.now();
    await page.goto(BASE + rel, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
    const loadMs = Date.now() - t0;
    await page.waitForTimeout(1500);
    const m = await page.evaluate(() => {
      const first = document.querySelector('article.entry, .entry');
      const firstY = first ? first.getBoundingClientRect().top + scrollY : null;
      const ctrls = [...document.querySelectorAll('button, a, input, select, label.chip, .chip')].filter(e => e.offsetParent);
      const above = firstY == null ? ctrls.length : ctrls.filter(e => e.getBoundingClientRect().top + scrollY < firstY).length;
      const small = ctrls.filter(e => { const r = e.getBoundingClientRect(); return r.height > 0 && r.height < 44 && r.width > 0; }).length;
      const texts = [...document.querySelectorAll('p, span, a, button, li, h1, h2, h3, div')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 2) && e.offsetParent).slice(0, 4000);
      const samples = texts.map(e => { const cs = getComputedStyle(e); let bg = 'rgba(0,0,0,0)', p = e; while (p && /rgba\(0, 0, 0, 0\)|transparent/.test(bg)) { bg = getComputedStyle(p).backgroundColor; p = p.parentElement; } return { c: cs.color, bg, fs: parseFloat(cs.fontSize), fw: cs.fontWeight }; });
      const fonts = [...new Set(texts.slice(0, 800).map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, '')))];
      const monoLabels = texts.filter(e => /mono/i.test(getComputedStyle(e).fontFamily)).length;
      const entries = document.querySelectorAll('article.entry').length;
      const mapEl = document.querySelector('#map, .map, [id*=map]');
      return { firstY, controlsAboveFirstCard: above, controls: ctrls.length, under44: small, pageHeight: document.documentElement.scrollHeight,
        entriesInDom: entries, fonts, monoTextNodes: monoLabels, samples, mapTop: mapEl ? mapEl.getBoundingClientRect().top + scrollY : null };
    });
    // contrast
    let lowAA = 0, n = 0;
    for (const s of m.samples) { const a = lum(s.c), b = lum(s.bg); if (a == null || b == null) continue; n++; const cr = (Math.max(a, b) + .05) / (Math.min(a, b) + .05); const large = s.fs >= 24 || (s.fs >= 18.66 && +s.fw >= 700); if (cr < (large ? 3 : 4.5)) lowAA++; }
    delete m.samples; m.textNodesChecked = n; m.textNodesBelowAA = lowAA; m.loadMs = loadMs;
    m.screensToFirstCard = m.firstY ? +(m.firstY / 844).toFixed(1) : null;
    res[rel] = m;
    const card = page.locator('article.entry').first();
    if (await card.count()) {
      await card.scrollIntoViewIfNeeded();
      const id = rel.replace(/[\/.]/g, '-').replace(/-html$/, '');
      await card.screenshot({ path: path.join(OUT, 'screenshots', `before-card-${id}.jpg`), type: 'jpeg', quality: 70 });
    }
    console.log(rel, JSON.stringify(m));
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'audit-metrics.json'), JSON.stringify(res, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
