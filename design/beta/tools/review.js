#!/usr/bin/env node
// Design review harness (UI/UX lane, wave 1+). Screenshots the GENERATED beta pilot pages + hubs at
// 390×844 @DPR2 (touch) and 1440×900, served from disk with EVERY off-origin request aborted (so what you see
// is what a no-CDN visitor sees), and measures the M1 design rows of docs/BETA-BENCHMARK.md:
//   B-01 first card (screens) · B-03 controls above first card · B-11/B-12 tier glyphs + closed-with-glyph ·
//   B-14 cards with a cover · B-16 cards per mobile screen · B-18 font families · B-19 uppercase share ·
//   B-20 small targets · B-21 smallest text · B-22 overflow · B-24 skin accent.
//   NODE_PATH=$(npm root -g) node design/beta/tools/review.js [--dark] [--wave W1] [id ...]
// Output: design/beta/screenshots/review-<wave>/<id>-<m|d>[-s1].jpg + metrics.json (both committed).
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../../..');
const args = process.argv.slice(2);
const wave = (args.find(a => a.startsWith('--wave=')) || '--wave=W1').split('=')[1];
const dark = args.includes('--dark');
const only = args.filter(a => !a.startsWith('--'));
const OUT = path.join(__dirname, '..', 'screenshots', 'review-' + wave.toLowerCase());
const BASE = 'https://cleo.local/';
const M = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const DK = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const SETS = [
  { id: 'hub', url: 'beta/index.html' },
  { id: 'tokyo', url: 'beta/cities/tokyo.html' },
  { id: 'cleveland', url: 'beta/cleveland.html' },
  { id: 'newyork', url: 'beta/cities/newyork.html' },
  { id: 'chinatown', url: 'beta/Singapore/chinatown.html' },
  { id: 'wheeling', url: 'beta/cities/wheeling.html' },
  { id: 'japan-hub', url: 'beta/Japan/index.html' },
  { id: 'singapore-hub', url: 'beta/Singapore/index.html' },
];
const CT = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };

async function shoot(browser, s, vp, tag) {
  const ctx = await browser.newContext({ ...vp, colorScheme: dark ? 'dark' : 'light' });
  const page = await ctx.newPage();
  const blocked = new Set(); const errors = [];
  page.on('pageerror', e => errors.push(String(e.message || e)));
  await page.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith(BASE)) {
      const f = path.join(ROOT, decodeURIComponent(new URL(u).pathname));
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
      const ct = CT[path.extname(f)] || 'application/octet-stream';
      return route.fulfill({ body: fs.readFileSync(f), headers: { 'content-type': ct + (/^text|json/.test(ct) ? '; charset=utf-8' : '') } });
    }
    blocked.add(new URL(u).host); return route.abort();
  });
  if (!fs.existsSync(path.join(ROOT, s.url))) { await ctx.close(); return { missing: true }; }
  await page.goto(BASE + s.url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(500);
  const m = await page.evaluate(() => {
    const vw = innerWidth, vh = innerHeight;
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const ctrls = [...document.querySelectorAll('a:not(.skip):not(.vh),button,input,select,summary,[role=switch],[role=tab]')].filter(vis);
    const inProse = e => e.tagName === 'A' && e.closest('p,.pl-w,.pl-k,.note') && !e.closest('.pl-s,.pl-n,nav');
    const small = ctrls.filter(e => { if (inProse(e)) return false; const r = e.getBoundingClientRect(); return r.height < 44 || r.width < 44; });
    const cards = [...document.querySelectorAll('li.pl, article.card, .pl')].filter((e, i, a) => a.indexOf(e) === i);
    const first = cards.find(vis);
    const ft = first ? first.getBoundingClientRect().top + scrollY : null;
    const above = first ? ctrls.filter(e => { const r = e.getBoundingClientRect(); return r.bottom + scrollY <= ft && r.right > 0 && r.left < vw; }).length : null;
    const perScreen = cards.filter(e => { const r = e.getBoundingClientRect(); return vis(e) && r.top + scrollY >= ft && r.top + scrollY < ft + vh; }).length;
    const els = [...document.querySelectorAll('body *')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
    const sample = els.slice(0, 6000);
    const fams = new Set(); let upper = 0, minFs = 99, minEl = '';
    for (const e of sample) {
      const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      fams.add(cs.fontFamily.split(',')[0].replace(/["']/g, '').trim());
      const t = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      if (cs.textTransform === 'uppercase' || (t.length > 3 && /[A-Z]/.test(t) && t === t.toUpperCase() && /[A-Z]{3}/.test(t))) upper++;
      const fs = parseFloat(cs.fontSize); if (fs < minFs && !e.closest('.vh,[hidden],.leaflet-control-attribution')) { minFs = fs; minEl = e.tagName.toLowerCase() + '.' + [...e.classList].join('.'); }
    }
    // tier glyphs: a card "has a glyph" when its eyebrow carries the ::before mask or a .tier element
    const glyphOf = c => { const e = c.querySelector('.pl-e,.tier'); if (!e) return false; if (e.classList.contains('tier')) return true; const b = getComputedStyle(e, '::before'); return b.content !== 'none' && (b.maskImage || b.webkitMaskImage || 'none') !== 'none'; };
    const closed = cards.filter(c => c.hasAttribute('data-closed') || c.classList.contains('pl--closed') || c.classList.contains('closed'));
    const coverOf = c => { const b = getComputedStyle(c, '::before'); return c.querySelector('.plate,.pl-cover') || (b.content !== 'none' && b.backgroundColor !== 'rgba(0, 0, 0, 0)' && parseFloat(b.height) >= 60); };
    const root = getComputedStyle(document.documentElement);
    const main = document.querySelector('main') || document.body;
    return {
      overflowX: document.documentElement.scrollWidth - vw,
      firstCardScreens: ft == null ? null : +(ft / vh).toFixed(2), controlsAboveFirstCard: above, cardsPerScreen: perScreen,
      cards: cards.length, closed: closed.length,
      glyphCards: cards.filter(c => !closed.includes(c)).filter(glyphOf).length, closedWithGlyph: closed.filter(c => getComputedStyle(c.querySelector('.pl-e') || c, '::before').content !== 'none' && glyphOf(c)).length,
      coverCards: cards.slice(0, 400).filter(coverOf).length, coverSample: Math.min(cards.length, 400),
      smallTargets: small.length, smallSample: small.slice(0, 6).map(e => e.tagName.toLowerCase() + '.' + [...e.classList].join('.') + ' ' + Math.round(e.getBoundingClientRect().width) + '×' + Math.round(e.getBoundingClientRect().height)),
      fontFamilies: [...fams], uppercaseShare: +(upper / Math.max(1, sample.length)).toFixed(3), minFontPx: minFs, minFontEl: minEl,
      accent: getComputedStyle(main).getPropertyValue('--city').trim() || root.getPropertyValue('--city').trim(),
      textNodes: sample.length,
    };
  });
  await page.screenshot({ path: path.join(OUT, `${s.id}-${tag}${dark ? '-dark' : ''}.jpg`), type: 'jpeg', quality: 68 });
  if (!dark) { await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; scrollTo({ top: innerHeight, behavior: 'instant' }); }); await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(OUT, `${s.id}-${tag}-s1.jpg`), type: 'jpeg', quality: 68 }); }
  await ctx.close();
  return { ...m, blockedHosts: [...blocked], jsErrors: errors };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const mf = path.join(OUT, 'metrics.json');
  let metrics = {}; try { metrics = JSON.parse(fs.readFileSync(mf, 'utf8')); } catch (e) {}
  for (const s of SETS) {
    if (only.length && !only.includes(s.id)) continue;
    for (const [vp, tag] of [[M, 'm'], [DK, 'd']]) {
      const r = await shoot(browser, s, vp, tag);
      metrics[`${s.id}-${tag}${dark ? '-dark' : ''}`] = r;
      console.log(`${s.id}-${tag}`, JSON.stringify(r.missing ? { missing: true } : { ox: r.overflowX, first: r.firstCardScreens, above: r.controlsAboveFirstCard, perScr: r.cardsPerScreen, glyph: `${r.glyphCards}/${r.cards - r.closed}`, closedGlyph: r.closedWithGlyph, cover: `${r.coverCards}/${r.coverSample}`, small: r.smallTargets, fam: r.fontFamilies.length, up: r.uppercaseShare, minFs: r.minFontPx, accent: r.accent, err: r.jsErrors.length }));
    }
  }
  await browser.close();
  fs.writeFileSync(mf, JSON.stringify(metrics, null, 1));
})();
