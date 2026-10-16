#!/usr/bin/env node
/**
 * Beta metrics harness (QA lane — backlog M0-04 / M1-21; benchmark docs/BETA-BENCHMARK.md).
 *
 * Measures every M1 acceptance metric on beta pages, in real Chromium, at mobile 390×844 (DPR3, touch)
 * and desktop 1440×900, with EVERY off-origin request blocked (the no-CDN case). Map tiles are answered
 * with a 1×1 PNG only for the map-sync probe; Leaflet itself is vendored same-origin by the generator.
 *
 * Per page × viewport it records (benchmark row in brackets):
 *   screens-to-first-card, masthead height            [B-01, B-02, M1-01]
 *   controls above the first card (all / on screen)   [B-03]
 *   collection rail on first screen                   [B-04]
 *   hub: city cards above the fold                    [B-05]
 *   split view + sticky map + two-way sync (desktop)  [B-06, B-09, M1-04]
 *   map toggle + sheet: detents, Close, Esc, Back      [B-07, B-17, M1-05, M1-12]
 *   floating elements over card titles (20 scrolls)   [B-08]
 *   filter tray with "Show N places"                  [B-10, M1-07]
 *   closed records with a tier glyph                  [B-12, M1-08]
 *   cards per mobile screen                           [B-16]
 *   font families actually rendered (CDP)             [B-18]
 *   uppercase text-node share                         [B-19]
 *   tap targets < 44×44 (prose links exempt)          [B-20, M1-16]
 *   smallest text                                     [B-21]
 *   horizontal overflow at 360 and 390                [B-22]
 *   WCAG AA text contrast, light + night themes       [B-23]
 *   focus visibility (keyboard Tab walk)              [B-23, M1-16]
 *   landmarks, skip link, unnamed controls            [M1-16]
 *   reachability: data records vs cards reachable via "All"+scroll, deep links, search, and with JS off
 *                                                      [G1, D-11]
 *   "Recommended by" on every card                    [G6]
 *   no-CDN render, JS errors                          [G4]
 *   performance: bytes, DOM nodes, FCP, FCP at 4× CPU [B-44, RFC §7.5]
 *
 * Usage:  cd tools && npm run beta:metrics                 # pilot set (D-27)
 *         node beta/metrics.js --all                       # every beta page (M1-22)
 *         node beta/metrics.js --only cities/tokyo --shots
 * Output: qa/beta-metrics.json (+ qa/beta-metrics.md table, qa/beta-shots/*.jpg with --shots)
 * Exit:   0 always unless --strict (then 1 when any hard gate G1/G4/G6/B-12 fails on a new-engine page).
 */
'use strict';
const http = require('http');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const BETA = path.join(ROOT, 'beta');
const argv = process.argv.slice(2);
const flag = n => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };

const PILOT = ['index.html', 'cleveland.html', 'cities/tokyo.html', 'cities/newyork.html',
  'Singapore/chinatown.html', 'cities/wheeling.html'];
const OUT_JSON = path.resolve(ROOT, opt('--out', 'qa/beta-metrics.json'));
const SHOTS = flag('--shots');
const STRICT = flag('--strict');
const CONC = +opt('--concurrency', 2);
// W3 Q-01: --view <gallery|atlas|guidebook|insights> measures that view (#view=… on every place-page load; hubs unchanged)
const VIEW = opt('--view', '');
const vhash = (rel, h) => VIEW && !/(^|\/)index\.html$/.test(rel) ? (h ? h + '&' : '#') + 'view=' + VIEW : (h || '');

const VP = {
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
  narrow: { viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
};

function loadPlaywright() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) {
    try { return require(t); } catch (e) { /* next */ }
  }
  throw new Error('playwright not found');
}

// ---------- page set ----------
function manifest() {
  try { return JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'manifest.json'), 'utf8')); } catch (e) { return { pages: [], generated: [] }; }
}
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!['data', 'assets'].includes(e.name)) walk(p, acc); }
    else if (e.name.endsWith('.html')) acc.push(path.relative(BETA, p).split(path.sep).join('/'));
  }
  return acc;
}
function pageSet() {
  let pages = flag('--all') ? walk(BETA).sort() : PILOT.slice();
  const only = opt('--only', '');
  if (only) pages = (flag('--all') ? pages : walk(BETA).sort()).filter(p => p.includes(only));
  return pages.filter(p => fs.existsSync(path.join(BETA, p)));
}
const MAN = manifest();
const byBeta = {}; for (const p of MAN.pages || []) byBeta[p.beta] = p;
function expected(rel) {
  const m = byBeta[rel];
  if (!m || !m.counts) return null;
  let names = null;
  try {
    const j = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'places', m.key + '.json'), 'utf8'));
    const list = j.places || j.p || [];
    names = Array.isArray(list) ? list.map(x => x.id).filter(Boolean) : null;
  } catch (e) { /* no index */ }
  const c = m.counts, sights = c.sights != null ? c.sights : c.P, food = c.food != null ? c.food : c.F;
  return { key: m.key, gen: m.gen, kind: m.kind, live: m.live, total: c.total != null ? c.total : sights + food, sights, food, ids: names };
}

// ---------- server ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0].split('#')[0]));
      if (!f.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
      try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
      fs.readFile(f, (err, buf) => {
        if (err) { rsp.writeHead(404); return rsp.end('404'); }
        rsp.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Content-Length': buf.length });
        rsp.end(buf);
      });
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const BLOCKED_NET = /net::ERR_|Failed to load resource|ERR_BLOCKED|ERR_FAILED/;
const ALLOWED_TILES = /^(tile\.openstreetmap\.org|[abc]\.tile\.openstreetmap\.org|server\.arcgisonline\.com|services\.arcgisonline\.com)$/;

async function open(browser, base, rel, vpName, o = {}) {
  const ctx = await browser.newContext({ ...VP[vpName], serviceWorkers: 'block', colorScheme: o.scheme || 'light',
    javaScriptEnabled: o.js !== false, reducedMotion: 'reduce' });
  // D-46 (QA): first-load CLS and the view set before first paint, recorded on every load
  await ctx.addInitScript(() => { try { window.__qaCls = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__qaCls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { /* no observer */ }
    try { requestAnimationFrame(() => { window.__qaViewPaint = document.documentElement.getAttribute('data-view'); }); } catch (e) { /* none */ } });
  const page = await ctx.newPage();
  // session (bytes) = the whole session: load + every probe, focus walk, reachability stress and tray flow, which scroll
  // every card and so load every lazy photo — INFORMATIONAL. initial = the default view at first load, no user scroll,
  // up to network idle + 2 s: only what the browser actually fetched (lazy images below the fold excluded), raw and as
  // a transfer estimate (gzip for text; images/fonts as sent) — GATED ≤ 2.0 MB (platform W7, proposed D-38).
  // ctx.route() (needed to block off-origin requests) disables Chromium's HTTP/memory cache, so a URL shown twice (a
  // card and its rail copy) or revisited during the stress loop is downloaded again — a real browser would not. Bytes
  // count each URL once; the raw sum of every response stays in bytesAllResponses for reference.
  const st = { errors: [], bytes: 0, bytesAll: 0, seen: new Set(), gz: 0, pend: [], load: null, offOrigin: 0, tileHosts: new Set(), local404: [] };
  const origin = new URL(base).origin;
  await ctx.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith(origin) || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    st.offOrigin++;
    if (o.tiles && route.request().resourceType() === 'image') {
      st.tileHosts.add(new URL(u).host);
      return route.fulfill({ status: 200, contentType: 'image/png', body: PNG1 });
    }
    return route.abort('blockedbyclient');
  });
  page.on('pageerror', e => st.errors.push('pageerror: ' + String(e.message || e).slice(0, 240)));
  page.on('console', m => { if (m.type() === 'error' && !BLOCKED_NET.test(m.text())) st.errors.push(m.text().slice(0, 240)); });
  page.on('response', r => {
    if (!r.url().startsWith(origin)) return;
    if (r.status() >= 400) st.local404.push(r.url().slice(origin.length));
    const cl = +(r.headers()['content-length'] || 0); st.bytesAll += cl;
    if (st.seen.has(r.url())) return;
    st.seen.add(r.url()); st.bytes += cl;
    if (!st.load && r.status() < 300) st.pend.push(r.body().then(b => { st.gz += /\.(png|jpe?g|webp|avif|gif|woff2?)$/.test(r.url().split('?')[0]) ? b.length : zlib.gzipSync(b).length; }).catch(() => {}));
  });
  let loadErr = null;
  try { await page.goto(base + 'beta/' + rel + vhash(rel, o.hash), { waitUntil: 'load', timeout: 45000 }); }
  catch (e) { loadErr = String(e.message || e).slice(0, 200); }
  await page.waitForTimeout(o.settle || 400);
  if (o.initial) { await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {}); await page.waitForTimeout(2000); }
  await Promise.all(st.pend); st.load = { bytes: st.bytes, gz: st.gz }; st.pend = [];
  return { ctx, page, st, loadErr };
}

// ---------- in-page probe (layout, typography, controls, contrast) ----------
/* eslint-disable no-undef */
const PROBE = () => {
  const vw = innerWidth, vh = innerHeight, de = document.documentElement;
  // visible = has a box, on the page (not parked off-screen like an unfocused skip link), not clipped to 1px
  const vis = el => { if (!el || !el.getBoundingClientRect) return false; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 1 && r.height > 1 && r.right > 0 && r.bottom + scrollY > 0 && r.left < de.scrollWidth && cs.visibility !== 'hidden' && cs.display !== 'none'
      && +cs.opacity !== 0 && !el.closest('[hidden]') && !el.closest('.vh, .sr-only, .visually-hidden'); };
  const desc = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
    (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') +
    (el.textContent ? ' "' + el.textContent.trim().replace(/\s+/g, ' ').slice(0, 24) + '"' : '');
  const absTop = el => el.getBoundingClientRect().top + scrollY;
  const kind = de.getAttribute('data-cleo-page') || (document.getElementById('list') && document.getElementById('modeFood') ? 'legacy-engine' : 'legacy');

  // cards
  const allCards = [...document.querySelectorAll('li.pl')];
  const legacyCards = allCards.length ? [] : [...document.querySelectorAll('#list .entry, .entry')];
  const cards = allCards.length ? allCards : legacyCards;
  const visCards = cards.filter(vis);
  // W5 (FE-A ↔ QA, BETA-QA.md "Gallery as default"): in the Gallery the first place card may be the lead or a row card
  // (li.gc[data-id]: cover, name, Recommended by, heart, opens the place) — the paged All-N grid comes after the rows
  const placeCards = de.getAttribute('data-view') === 'gallery' ? [...document.querySelectorAll('li.gc[data-id]')].filter(vis) : [];
  const first = visCards.concat(placeCards).sort((a, b) => absTop(a) - absTop(b))[0] || null;
  const firstTop = first ? absTop(first) : null;

  // masthead
  // priority order (querySelector with a list returns the first in DOM order, which is the shell header)
  const mastEl = ['.masthead', '[data-cleo-masthead]', 'header.hero', '.hero'].map(q => document.querySelector(q)).find(Boolean);
  // W6 (FE-A, coordinated): on the Atlas phone map the masthead collapses to 0 px (visually hidden, h1 kept for AT)
  const mastBottom = mastEl && vis(mastEl) ? Math.round(mastEl.getBoundingClientRect().bottom + scrollY) : mastEl && de.classList.contains('atlas-m') ? 0 : null;

  // interactive controls
  const CTRL = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab], [role=link], [tabindex]:not([tabindex="-1"])';
  const ctrls = [...document.querySelectorAll(CTRL)].filter(el => vis(el) && !el.closest('.leaflet-container'));
  const above = firstTop == null ? [] : ctrls.filter(el => absTop(el) < firstTop);
  const aboveOn = above.filter(el => { const r = el.getBoundingClientRect(); return r.right > 0 && r.left < vw; });
  // prose links are exempt from the 44px rule: an <a> sitting inside running text
  const inProse = el => {
    if (el.tagName !== 'A') return false;
    const p = el.parentElement; if (!p) return false;
    const pt = (p.textContent || '').trim().length, at = (el.textContent || '').trim().length;
    return /^(P|LI|DD|SPAN|EM|SMALL|BLOCKQUOTE|FIGCAPTION|TD)$/.test(p.tagName) && pt > at + 15;
  };
  const small = [];
  for (const el of ctrls) {
    if (inProse(el) || el.closest('.vh, .sr-only')) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 44 || r.height < 44) small.push(desc(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
  }
  const smallKinds = {}; for (const s of small) { const k = s.split(' "')[0]; smallKinds[k] = (smallKinds[k] || 0) + 1; }

  // text nodes: uppercase share, smallest size, fonts sample, contrast
  const parseRGB = s => { const m = (s || '').match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const blend = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1]; };
  const bgOf = el => {
    const stack = []; let e = el, unknown = false;
    // on screen: use what is actually painted under the text (catches overlays such as a header over a hero band)
    const r = el.getBoundingClientRect(), cx = r.left + Math.min(r.width / 2, 8), cy = r.top + r.height / 2;
    if (cx >= 0 && cy >= 0 && cx < vw && cy < vh) {
      // QA R7 (QA-66): elementsFromPoint skips layers with pointer-events:none, so a painted decorative layer under the
      // text (e.g. the switcher's sliding indicator) was missed and the text was graded against the track behind it.
      // Make such painted layers near the text hit-testable for this one reading, then restore them. This measures what
      // is actually painted; an exempted element would not be — and a pe:none layer ABOVE the text now counts as covering it.
      const lifted = [];
      for (let a = el.parentElement, d = 0; a && d < 4; a = a.parentElement, d++) {
        for (const u of a.querySelectorAll('*')) {
          if (u === el || u.contains(el) || lifted.includes(u)) continue;
          const us = getComputedStyle(u); if (us.pointerEvents !== 'none') continue;
          const ub = parseRGB(us.backgroundColor); if (!(ub && ub[3] > 0) && (!us.backgroundImage || us.backgroundImage === 'none')) continue;
          const q = u.getBoundingClientRect(); if (cx < q.left || cx > q.right || cy < q.top || cy > q.bottom) continue;
          lifted.push(u); u.dataset.qaPe = u.style.pointerEvents; u.style.pointerEvents = 'auto';
        }
      }
      const pile = document.elementsFromPoint(cx, cy);
      lifted.forEach(u => { u.style.pointerEvents = u.dataset.qaPe; delete u.dataset.qaPe; });
      const top = pile.find(u => !(u !== el && el.contains(u)));
      if (top && top !== el && !top.contains(el)) return { bg: null, unknown: true, occluded: true };   // covered (e.g. a rail arrow)
      for (const u of pile) {
        if (u !== el && el.contains(u)) continue;
        const cs = getComputedStyle(u);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') { unknown = true; break; }
        const c = parseRGB(cs.backgroundColor);
        if (c && c[3] > 0) { stack.push(c); if (c[3] >= 1) break; }
      }
      e = null;
    }
    while (e && e.nodeType === 1) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') { unknown = true; }
      const c = parseRGB(cs.backgroundColor);
      if (c && c[3] > 0) { stack.push(c); if (c[3] >= 1) break; }
      e = e.parentElement;
    }
    const dark = getComputedStyle(document.documentElement).colorScheme.indexOf('dark') >= 0 && matchMedia('(prefers-color-scheme: dark)').matches;
    let bg = dark ? [18, 18, 18, 1] : [255, 255, 255, 1];   // the UA canvas
    for (let i = stack.length - 1; i >= 0; i--) bg = blend(stack[i], bg);
    return { bg, unknown };
  };
  let tn = 0, upper = 0, minPx = 99, minEl = '';
  const contrastFails = []; let contrastChecked = 0, contrastUnknown = 0;
  const seen = new Set();
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  const fontSample = [];
  while ((n = tw.nextNode())) {
    const t = n.textContent.trim(); const el = n.parentElement;
    if (!t || !el || el.closest('script,style,noscript,svg,.leaflet-container')) continue;
    if (!/\p{L}/u.test(t)) continue;
    if (!vis(el)) continue;
    tn++;
    const cs = getComputedStyle(el);
    const letters = t.replace(/[^\p{L}]/gu, '');
    const isUpper = cs.textTransform === 'uppercase' || (letters.length >= 2 && letters === letters.toUpperCase() && letters !== letters.toLowerCase());
    if (isUpper) upper++;
    if (seen.has(el)) continue; seen.add(el);
    const px = parseFloat(cs.fontSize);
    if (px < minPx && !el.closest('.vh, .sr-only')) { minPx = px; minEl = desc(el); }
    if (fontSample.length < 400) fontSample.push(el);
    // contrast (WCAG 1.4.3 exempts text in an inactive UI component: a disabled control is not graded)
    if (el.closest('button:disabled, input:disabled, select:disabled, [aria-disabled="true"]')) continue;
    const fg = parseRGB(cs.color); if (!fg) continue;
    const { bg, unknown } = bgOf(el);
    if (unknown) { contrastUnknown++; continue; }
    const fgc = fg[3] < 1 ? blend(fg, bg) : fg;
    const L1 = lum(fgc), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const bold = (+cs.fontWeight || 400) >= 700;
    const large = px >= 24 || (bold && px >= 18.66);
    const need = large ? 3 : 4.5;
    contrastChecked++;
    if (ratio + 0.005 < need) contrastFails.push(desc(el) + ' ' + ratio.toFixed(2) + ':1 <' + need);
  }
  fontSample.forEach((el, i) => el.setAttribute('data-qa-font', String(i)));
  // declared families: first family of each computed font-family stack in use (B-18 grades this; CDP reports what rendered)
  const declared = {};
  for (const el of fontSample) { const f = getComputedStyle(el).fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, ''); declared[f] = (declared[f] || 0) + 1; }
  for (const el of ctrls) { const f = getComputedStyle(el).fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, ''); declared[f] = (declared[f] || 0) + 1; }

  // floating elements (fixed / sticky) that are not the site header
  const floaters = [...document.querySelectorAll('body *')].filter(el => {
    const p = getComputedStyle(el).position; if (p !== 'fixed' && p !== 'sticky') return false;
    if (!vis(el) || el.closest('header, [role=banner], .sitebar, .leaflet-container')) return false;
    return true;
  }).map(desc);

  // landmarks / a11y
  const unnamed = ctrls.filter(el => {
    const name = (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || el.getAttribute('alt') || el.value || el.getAttribute('placeholder') || '').trim();
    const lab = el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
    const lby = el.getAttribute('aria-labelledby');
    return !name && !lab && !lby && !el.querySelector('img[alt]:not([alt=""]), svg title');
  }).map(desc);

  // collection rail
  const rail = document.querySelector('[data-cleo-rail], .rail');
  const railVis = !!rail && vis(rail);
  const railTop = railVis ? Math.round(absTop(rail)) : null;
  const railItems = railVis ? [...rail.querySelectorAll('button, a')].filter(vis) : [];

  // hub: city cards above the fold
  const cityLinks = [...document.querySelectorAll('a[href]')].filter(a => vis(a) && /(^|\/)(cities\/[^/]+|[A-Z][a-z]+\/[^/]+|cleveland)\.html/.test(a.getAttribute('href') || '')
    && a.getBoundingClientRect().height >= 80);
  const cityCardsAbove = cityLinks.filter(a => { const r = a.getBoundingClientRect(); return r.top + scrollY < vh && r.bottom + scrollY <= vh + 1 && r.left < vw && r.right > 0; }).length;

  // cards per screen in the list (median card height)
  const hs = visCards.slice(0, 30).map(c => c.getBoundingClientRect().height).sort((a, b) => a - b);
  const medH = hs.length ? hs[Math.floor(hs.length / 2)] : null;

  // attribution + closed/tier (G6, B-12)
  const TIER_RE = /\b(Must see|Worth the detour|Deep cut)\b/;
  const noAttr = allCards.filter(c => { const s = c.querySelector('.pl-s'); return !s || !s.textContent.trim(); }).map(c => c.id);
  const closedCards = allCards.filter(c => c.hasAttribute('data-closed') || c.classList.contains('pl--closed'));
  const closedTier = closedCards.filter(c => c.querySelector('.tier, .pl-tier, [data-tier], .glyph-tier') || TIER_RE.test(c.querySelector('.pl-e') ? c.querySelector('.pl-e').textContent : ''))
    .map(c => c.id);
  const closedUnflagged = closedCards.filter(c => !/closed/i.test(c.textContent)).map(c => c.id);

  // skip link
  const skip = [...document.querySelectorAll('a[href^="#"]')].find(a => /skip/i.test(a.textContent));

  return {
    kind, vw, vh, title: document.title,
    overflowX: de.scrollWidth > vw + 1 ? de.scrollWidth - vw : 0,
    cards: cards.length, cardsVisible: visCards.length, legacy: !allCards.length,
    firstCardTop: firstTop == null ? null : Math.round(firstTop),
    screensToFirstCard: firstTop == null ? null : +(firstTop / vh).toFixed(2),
    mastheadPx: mastBottom,
    controlsAbove: above.length, controlsAboveOnScreen: aboveOn.length,
    controlsAboveList: aboveOn.slice(0, 40).map(desc),
    tapSmall: small.length, tapSmallKinds: smallKinds, tapSmallList: small.slice(0, 25),
    textNodes: tn, upperNodes: upper, upperPct: tn ? +(100 * upper / tn).toFixed(1) : 0,
    minFontPx: minPx === 99 ? null : minPx, minFontEl: minEl,
    contrastChecked, contrastUnknown, contrastFails: contrastFails.length, contrastFailList: contrastFails.slice(0, 20),
    floaters,
    railVisible: railVis, railTop, railOnFirstScreen: railVis && railTop < vh, railItems: railItems.length,
    railFirst: railItems[0] ? railItems[0].textContent.trim().replace(/\s+/g, ' ').slice(0, 40) : null,
    cityCardsAbove,
    cardMedianH: medH && Math.round(medH), cardsPerScreen: medH ? +(vh / medH).toFixed(2) : null,
    noAttribution: noAttr.length, noAttributionIds: noAttr.slice(0, 10),
    closed: closedCards.length, closedWithTier: closedTier.length, closedWithTierIds: closedTier.slice(0, 10),
    closedUnflagged: closedUnflagged.length,
    landmarks: { header: !!document.querySelector('header, [role=banner]'), nav: !!document.querySelector('nav, [role=navigation]'),
      main: !!document.querySelector('main, [role=main]'), footer: !!document.querySelector('footer, [role=contentinfo]') },
    skipLink: !!skip, unnamedControls: unnamed.length, unnamedList: unnamed.slice(0, 10),
    domNodes: document.getElementsByTagName('*').length,
    fcp: Math.round((performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || 0) || null,
    fontSampleN: fontSample.length, fontsDeclared: declared,
    hasMapEl: !!document.querySelector('#cleo-map, #map'),
  };
};
/* eslint-enable no-undef */

// Fonts actually rendered (B-18): CDP platform fonts over the sampled text elements.
const CJK_FONT = /CJK|Noto Sans JP|Hiragino|Yu Gothic|Meiryo|MS Gothic|PingFang|Heiti|SimSun|Microsoft YaHei|Apple SD|Malgun|Droid Sans Fallback|WenQuanYi|Source Han|Noto Color Emoji|Emoji|Symbol/i;
async function renderedFonts(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const doc = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: doc.root.nodeId, selector: '[data-qa-font]' });
  const fam = {};
  for (const id of nodeIds.slice(0, 400)) {
    try {
      const r = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: id });
      for (const f of r.fonts) fam[f.familyName] = (fam[f.familyName] || 0) + f.glyphCount;
    } catch (e) { /* node gone */ }
  }
  await cdp.detach().catch(() => {});
  const all = Object.keys(fam).sort((a, b) => fam[b] - fam[a]);
  return { all: fam, primary: all.filter(f => !CJK_FONT.test(f)), fallback: all.filter(f => CJK_FONT.test(f)) };
}

// Focus visibility: Tab through the first N focusables; each must show an outline, ring or shadow.
async function focusWalk(page, n = 30) {
  const out = { checked: 0, invisible: [] };
  await page.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement) document.activeElement.blur(); });
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const el = document.activeElement; if (!el || el === document.body) return null;
      if (el.closest('.leaflet-container')) return { skip: true };
      // the ring may sit on the element or on a close ancestor (e.g. `.pl:has(a:focus-visible)` draws it on the card)
      const has = e => { const cs = getComputedStyle(e); return (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none'); };
      let ring = false; for (let e = el, k = 0; e && k < 4 && !ring; e = e.parentElement, k++) ring = has(e);
      const d = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + ' "' + (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24) + '"';
      return { ring, d };
    });
    if (!r) break; if (r.skip) continue;
    out.checked++;
    if (!r.ring) out.invisible.push(r.d);
  }
  return out;
}

// Floating elements covering card titles (B-08), over 20 scroll positions.
async function overlapScan(page) {
  return page.evaluate(async () => {
    const H = document.documentElement.scrollHeight, vh = innerHeight; let hits = 0; const where = [];
    const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[hidden]'); };
    // R7 QA ratification 6 (docs/BETA-QA.md): the sticky city bar .cbar and the floating .mappill are exempt, as the site header is
    const floaters = [...document.querySelectorAll('body *')].filter(el => { const p = getComputedStyle(el).position; return (p === 'fixed' || p === 'sticky') && !el.closest('header, [role=banner], .sitebar, .cbar, .mappill, .leaflet-container, .mappane, [role=dialog]'); });
    for (let i = 0; i < 20; i++) {
      window.scrollTo(0, Math.round((H - vh) * i / 19)); await new Promise(r => requestAnimationFrame(() => r()));
      const fr = floaters.filter(vis).map(f => [f, f.getBoundingClientRect()]);
      if (!fr.length) continue;
      for (const t of document.querySelectorAll('li.pl .pl-n')) {
        if (!vis(t)) continue; const a0 = t.getBoundingClientRect(); if (a0.bottom < 0 || a0.top > vh) continue;
        // W6 (FE-A, coordinated): a title scrolled out of its own scroll pane (the Atlas tray) is clipped, not covered.
        // QA R7 (QA-68): the same for the PART of a title its pane clips, so a title straddling the pane edge is tested on
        // what the pane actually shows (the cut rect), never on its invisible part. Wholly-clipped titles skip, as before.
        let a = { left: a0.left, right: a0.right, top: a0.top, bottom: a0.bottom }, clip = false;
        for (let e = t.parentElement; e && e !== document.body && !clip; e = e.parentElement) { const st = getComputedStyle(e); if (st.overflowY !== 'visible' || st.overflowX !== 'visible') { const q = e.getBoundingClientRect();
          if (st.overflowY !== 'visible') { a.top = Math.max(a.top, q.top); a.bottom = Math.min(a.bottom, q.bottom); } if (st.overflowX !== 'visible') { a.left = Math.max(a.left, q.left); a.right = Math.min(a.right, q.right); }
          clip = a.bottom - a.top < 1 || a.right - a.left < 1; } }
        if (clip) continue;
        for (const [f, b] of fr) {
          if (f.contains(t)) continue;
          if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) { hits++; if (where.length < 5) where.push((f.className || f.tagName) + ' over ' + t.textContent.trim().slice(0, 30)); }
        }
      }
    }
    window.scrollTo(0, 0);
    return { positions: 20, hits, where };
  });
}

// Reachability (G1, D-11): "All" + scroll, every deep link, text search sample.
async function reachability(page, exp) {
  return page.evaluate(async (expIds) => {
    const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && !el.closest('[hidden]'); };
    const all = document.querySelector('[data-mode="all"], [data-cleo-all]'); if (all) all.click();
    await new Promise(r => setTimeout(r, 150));
    // W5 (BETA-QA.md "Gallery as default"): a paged view's own "Show all N on one page" is part of "All" — one tap, then scroll
    const sa = document.querySelector('.g-pager [data-pg="all"]'); if (sa && vis(sa)) { sa.click(); await new Promise(r => setTimeout(r, 250)); }
    const H = document.documentElement.scrollHeight;
    for (let y = 0; y < H; y += innerHeight * 2) { window.scrollTo(0, y); await new Promise(r => requestAnimationFrame(() => r())); }
    window.scrollTo(0, 0);
    const cards = [...document.querySelectorAll('li.pl')];
    const domIds = cards.map(c => c.id.replace(/^p-/, ''));
    const scrolled = cards.filter(vis).length;
    const missing = expIds ? expIds.filter(id => !domIds.includes(id)) : [];
    const dup = domIds.length - new Set(domIds).size;
    // deep links: route to every id with a lens applied first; the target must be visible
    let deepOk = 0, deepBad = []; const C = window.Cleo;
    if (C && C.route && C.route.go) {
      const food = cards.find(c => c.getAttribute('data-k') === 'f');
      const sight = cards.find(c => c.getAttribute('data-k') === 's');
      for (const c of cards) {
        const id = c.id.slice(2);
        // put a lens on that hides this card, then deep-link to it
        C.route.go({ mode: c.getAttribute('data-k') === 's' ? (food ? 'food' : '') : (sight ? 'sights' : '') });
        C.route.go({ p: id });
        await new Promise(r => setTimeout(r, 0));
        if (vis(c)) deepOk++; else if (deepBad.length < 10) deepBad.push(id);
      }
      C.route.go({});
    }
    // search: first distinctive word of every 10th name, through the page's own filter box
    const box = document.querySelector('#cleo-filter, input[type=search]');
    let sOk = 0, sN = 0; const sBad = [];
    if (box) {
      for (let i = 0; i < cards.length; i += Math.max(1, Math.floor(cards.length / 25))) {
        const c = cards[i]; const nm = (c.querySelector('.pl-n') || c).textContent.trim();
        box.value = nm; box.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(r => setTimeout(r, 160)); sN++;
        if (vis(c)) sOk++; else if (sBad.length < 5) sBad.push(nm);
      }
      box.value = ''; box.dispatchEvent(new Event('input', { bubbles: true })); await new Promise(r => setTimeout(r, 160));
    }
    return { dom: cards.length, scrolled, missing: missing.length, missingIds: missing.slice(0, 10), dup,
      deepLinks: { n: C && C.route ? cards.length : 0, ok: deepOk, bad: deepBad }, search: { n: sN, ok: sOk, bad: sBad } };
  }, exp && exp.ids);
}

// Desktop split view + two-way sync (B-06, B-09). Needs the vendored map mounted (tiles stubbed).
async function mapSync(page) {
  await page.waitForSelector('.leaflet-container', { timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(500);
  return page.evaluate(async () => {
    const r = { mounted: !!document.querySelector('.leaflet-container') };
    const mapEl = document.querySelector('#cleo-map, .leaflet-container');
    const list = document.querySelector('.listpane, #main ol, #main');
    if (mapEl) {
      const b = mapEl.getBoundingClientRect(); r.mapWidthPct = Math.round(100 * b.width / innerWidth);
      const lb = list && list.getBoundingClientRect();
      const fc = [...document.querySelectorAll('li.pl')].find(c => c.getBoundingClientRect().height > 0);
      const fr = fc && fc.getBoundingClientRect();
      // map beside the cards (W6: Atlas gives the map ≥ 60 %, so the list may be narrower than 40 %). W7 Atlas map-search
      // (Amendment 2) puts the map on the LEFT, so "beside" is either side, never overlapping (docs/BETA-LOG.md, QA to ratify)
      r.split = !!fr && b.width > innerWidth * 0.25 && (b.left >= fr.right - 2 || b.right <= fr.left + 2);
      // sticky = the map stays in view while the list scrolls — the window, or (W6 Atlas) the list's own scroll pane
      const pane = fc && (() => { for (let e = fc.parentElement; e && e !== document.body; e = e.parentElement) { const o = getComputedStyle(e).overflowY; if ((o === 'auto' || o === 'scroll') && e.scrollHeight > e.clientHeight) return e; } return null; })();
      if (pane) pane.scrollTop = 2500; else window.scrollTo(0, 2500); await new Promise(x => setTimeout(x, 120));
      const b2 = mapEl.getBoundingClientRect(); r.sticky = b2.top < innerHeight && b2.bottom > 0 && b2.height > 200;
      if (pane) pane.scrollTop = 0; window.scrollTo(0, 0); await new Promise(x => setTimeout(x, 120));
    }
    const paths = () => [...document.querySelectorAll('.leaflet-overlay-pane path.leaflet-interactive, .leaflet-marker-icon')];
    r.markers = paths().length;
    r.pinned = document.querySelectorAll('li.pl[data-ll]').length;
    r.markerNumbers = [...document.querySelectorAll('.leaflet-marker-icon, .leaflet-tooltip')].filter(m => /^\s*\d+\s*$/.test(m.textContent)).length;
    r.pinLabels = document.querySelectorAll('.leaflet-tooltip.pin-n').length;
    // SPEC-v3 (Atlas review loop): the map carries no numbers; pins are named (kind glyph + place name) — counted here
    r.namedPins = [...document.querySelectorAll('.leaflet-marker-icon.pp')].filter(m => /\p{L}/u.test(m.textContent)).length;
    // hover a card → some marker's style changes
    const snap = () => paths().map(p => (p.getAttribute('class') || '') + (p.getAttribute('stroke-width') || '') + (p.getAttribute('fill-opacity') || '') + (p.getAttribute('d') || '').length + (p.style.cssText || ''));
    const card = [...document.querySelectorAll('li.pl[data-ll]')].find(c => !c.closest('[hidden]'));
    if (card) {
      const before = snap();
      card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true })); card.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      const f = card.querySelector('a, button'); if (f) f.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await new Promise(x => setTimeout(x, 200));
      const after = snap();
      r.hoverHighlights = before.join('|') !== after.join('|');
      card.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true })); card.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    }
    // click a marker far down the list → its card scrolls into view and highlights
    const ps = paths();
    if (ps.length) {
      const p = ps[ps.length - 1];
      window.scrollTo(0, 0);
      p.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 1, clientY: 1 }));
      await new Promise(x => setTimeout(x, 1200));   // cards scroll smoothly into view
      const t = document.querySelector('li.pl.is-focus, li.pl.is-target, li.pl[aria-current], li.pl.is-active');
      const sheet = [...document.querySelectorAll('[role=dialog], .sheet, [data-cleo-sheet]')].find(d => d.getBoundingClientRect().height > 0 && !d.closest('[hidden]'));
      r.pinClick = { cardHighlighted: !!t, cardInView: !!t && (() => { const b = t.getBoundingClientRect(); return b.bottom > 0 && b.top < innerHeight; })(), sheet: !!sheet };
    }
    r.orderingStated = /ordered by/i.test(document.body.innerText);
    return r;
  });
}

// Mobile (B-07, B-17). Part A: Map toggle → full-screen map → pin → sheet with Close; Esc and Back close it.
// Part B: tap a card title in the list → detail sheet: content, focus trap, Esc, Back, focus restored to the card.
const SHEET_VIS = `(() => { window.__qaVis = d => !!d && d.getBoundingClientRect().height > 0 && !d.closest('[hidden]') && getComputedStyle(d).visibility !== 'hidden' && getComputedStyle(d).display !== 'none'; })()`;
async function openSheetState(page) {
  return page.evaluate(() => {
    const d = [...document.querySelectorAll('[role=dialog], dialog[open], .sheet, [data-cleo-sheet]')].filter(x => !x.classList.contains('tray')).find(window.__qaVis);
    if (!d) return null;
    document.querySelectorAll('[data-qa-sheet]').forEach(x => x.removeAttribute('data-qa-sheet'));
    d.setAttribute('data-qa-sheet', '1');
    const close = [...d.querySelectorAll('button, a')].find(b => /close|done|×|✕/i.test((b.textContent || '') + ' ' + (b.getAttribute('aria-label') || '')) && window.__qaVis(b));
    const txt = d.innerText;
    return { cls: String(d.className).slice(0, 40), h: Math.round(d.getBoundingClientRect().height), closeVisible: !!close,
      modal: d.getAttribute('aria-modal') === 'true' || d.tagName === 'DIALOG', grab: !!d.querySelector('.grab, [data-detent], [data-detents]'),
      has: { sources: /recommended by/i.test(txt), directions: /directions|openstreetmap|apple maps/i.test(txt),
        pin: /pinned|confidence/i.test(txt), status: /status checked|checked/i.test(txt), save: /\bsave/i.test(txt), share: /share/i.test(txt) } };
  });
}
const sheetGone = page => page.evaluate(() => !window.__qaVis(document.querySelector('[data-qa-sheet]')));
async function sheetFlow(page) {
  const r = {};
  await page.evaluate(SHEET_VIS);
  r.toggle = await page.evaluate(() => {
    // W6 (FE-A, coordinated with QA): Atlas phones open map-first — the map is already full screen, so the toggle measured
    // is the visible one ("List" over the map), and it is not tapped before the pin test
    // W7 Atlas map-search (QA R7, additive): the visible "List" pill (.ms-toggle) is that control on the map-search phone
    const mf = document.documentElement.classList.contains('atlas-m') && [...document.querySelectorAll('.mapclose, .ms-toggle')].find(window.__qaVis);
    if (mf) { mf.setAttribute('data-qa-toggle', '1'); mf.setAttribute('data-qa-mapfirst', '1'); const b = mf.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height), name: 'map-first: ' + (mf.textContent || '').trim(), mapFirst: true }; }
    const c = document.querySelector('.map-toggle, [data-cleo-map=""]') || [...document.querySelectorAll('button, a, [role=button]')].find(b =>
      /^(show (the )?)?map\b/i.test((b.getAttribute('aria-label') || b.textContent || '').trim()) && window.__qaVis(b));
    if (!c || !window.__qaVis(c)) return null;
    c.setAttribute('data-qa-toggle', '1'); const b = c.getBoundingClientRect();
    return { w: Math.round(b.width), h: Math.round(b.height), name: (c.getAttribute('aria-label') || c.textContent).trim().slice(0, 30) };
  });
  if (r.toggle) {
    r.toggle.ok44 = r.toggle.w >= 44 && r.toggle.h >= 44;
    if (!r.toggle.mapFirst) await page.click('[data-qa-toggle]', { timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(900);
    r.fullMap = await page.evaluate(() => { const m = document.querySelector('#cleo-map, .leaflet-container'); if (!m) return false; const b = m.getBoundingClientRect(); return b.height >= innerHeight * 0.7 && b.width >= innerWidth * 0.95; });
    // a real tap on a visible pin
    const findPin = () => page.evaluate(() => {
      // a pin a finger can actually reach: on screen and not under the tray or a control (W6: not a cluster bubble)
      // W7 (QA R7, additive): a label-pill pin (.pp) is measured and tapped by its label, as a finger would; it must sit
      // in the uncovered band of the map (below the chip row, above the carousel) and hit-test to itself
      const lab = p => p.classList.contains('pp') && p.firstElementChild ? p.firstElementChild : p;
      const ms = !!document.querySelector('.ms-toggle'), top = ms ? 200 : 80, bot = ms ? 260 : 80;
      const ps = [...document.querySelectorAll('.leaflet-overlay-pane path.leaflet-interactive, .leaflet-marker-icon:not(.pin-cl)')].filter(p => { const b = lab(p).getBoundingClientRect(); if (!(b.width > 0 && b.top > top && b.bottom < innerHeight - bot && b.left > 10 && b.right < innerWidth - 10)) return false;
        const t = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return !!t && (t === p || p.contains(t)); });
      // QA R7 (b54b3745): only a place marker is a pin; a decorative layer that hit-tests (no entry in Cleo.city.markers)
      // is skipped, so the probe never taps something that cannot open a place
      const C = window.Cleo && Cleo.city, idOf = new Map();
      if (C && C.markers) for (const id of Object.keys(C.markers)) { const e = C.markers[id].getElement && C.markers[id].getElement(); if (e) idOf.set(e, id); }
      const pins = idOf.size ? ps.filter(p => idOf.has(p)) : ps;
      if (!pins.length) return false; const pk = pins[Math.floor(pins.length / 2)]; lab(pk).setAttribute('data-qa-pin', '1');
      if (idOf.has(pk)) { pk.setAttribute('data-qa-pin-id', idOf.get(pk)); window.__qaPinId = idOf.get(pk); }   // kept on window too: selecting a pin can re-render its element
      return true;
    });
    // QA R7 (3ba696e8 re-sign; ratified by QA): the first label pin can take 1–1.5 s to draw after the toggle on either
    // SHA, so the single look at +900 ms passed or failed on timing. Poll the same reachability rule for up to 3 s more
    // (settled state); the rule itself, the bubble zoom-in and the W6/W7 paths are unchanged.
    let pinSel = await findPin();
    for (let t = 0; t < 3000 && !pinSel && !await page.evaluate(() => !!document.querySelector('.leaflet-marker-icon')); t += 150) { await page.waitForTimeout(150); pinSel = await findPin(); }
    // … then let the first fit settle (markers can be re-added once right after they first appear) before the final look
    if (!pinSel) { await page.waitForTimeout(600); pinSel = await findPin(); }
    // W7 (QA R7, additive): on the map-search phone, pins below zoom 15 gather into count bubbles; when no single pin is
    // in reach, a real tap on a bubble zooms in (up to 3 times), as a reader would, then the pin rule above applies
    for (let i = 0; i < 3 && !pinSel && await page.evaluate(() => !!document.querySelector('.ms-toggle')); i++) {
      const bub = await page.evaluate(() => { const e = [...document.querySelectorAll('.leaflet-marker-icon.pin-cl')].map(x => [x, x.getBoundingClientRect()]).find(([x, b]) => b.top > 200 && b.bottom < innerHeight - 260 && b.left > 10 && b.right < innerWidth - 10 && (t => !!t && x.contains(t))(document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2)));
        return e ? { x: e[1].left + e[1].width / 2, y: e[1].top + e[1].height / 2 } : null; });
      if (!bub) break; await page.mouse.click(bub.x, bub.y); await page.waitForTimeout(1200); pinSel = await findPin();
    }
    if (pinSel) {
      await page.click('[data-qa-pin]', { force: true, timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(600);
      r.pinSheet = await openSheetState(page);
      if (!r.pinSheet && await page.evaluate(() => !!document.querySelector('.ms-toggle'))) r.msPin = await msPinFlow(page);
      if (r.pinSheet) {
        await page.keyboard.press('Escape'); await page.waitForTimeout(400);
        r.pinSheet.escCloses = await sheetGone(page);
        await page.click('[data-qa-pin]', { force: true, timeout: 3000 }).catch(() => {}); await page.waitForTimeout(600);
        if (await openSheetState(page)) {
          await page.goBack({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(500);
          r.pinSheet.backCloses = await sheetGone(page);
          r.pinSheet.stayedOnPage = /\/beta\//.test(page.url());
        }
      }
    }
    // back to the list (the toggle, a "List" button, or history)
    await page.evaluate(() => { const l = [...document.querySelectorAll('button, a')].find(b => /^list\b/i.test((b.textContent || b.getAttribute('aria-label') || '').trim()) && window.__qaVis(b)); if (l) l.click(); });
    await page.waitForTimeout(500);
  }
  // Part B: detail sheet from a card
  await page.evaluate(() => window.scrollTo(0, 0));
  const opened = await page.evaluate(() => {
    const a = [...document.querySelectorAll('li.pl .pl-n a, li.pl .pl-n button')].find(window.__qaVis);
    if (!a) return false; a.setAttribute('data-qa-card', '1'); return true;
  });
  if (opened) {
    await page.click('[data-qa-card]', { timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(600);
    r.detail = await openSheetState(page);
    if (r.detail) {
      let escaped = 0;
      for (let i = 0; i < 25; i++) {
        await page.keyboard.press('Tab');
        if (!(await page.evaluate(() => { const d = document.querySelector('[data-qa-sheet]'); return !!d && d.contains(document.activeElement); }))) escaped++;
      }
      r.detail.focusTrapped = escaped === 0;
      await page.keyboard.press('Escape'); await page.waitForTimeout(400);
      r.detail.escCloses = await sheetGone(page);
      r.detail.focusRestored = await page.evaluate(() => { const c = document.querySelector('[data-qa-card]'); const li = c && c.closest('li.pl'); return !!li && li.contains(document.activeElement); });
      await page.click('[data-qa-card]', { timeout: 3000 }).catch(() => {}); await page.waitForTimeout(600);
      if (await openSheetState(page)) {
        await page.goBack({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(500);
        r.detail.backCloses = await sheetGone(page);
        r.detail.stayedOnPage = /\/beta\//.test(page.url());
      }
    }
  }
  return r;
}

// B-07, W7 Atlas map-search (QA R7, BETA-QA.md "Wave 7 full pass"; ADDED, the W6 pin-sheet path still passes on its
// own): the tapped pin's OWN card is selected and wholly on screen in the carousel (no sheet over the map); one tap on that
// card opens the place detail with a visible Close; Esc closes it; re-opened, Back closes it and the reader is still in
// Atlas on the same page.
async function msPinFlow(page) {
  const r = {};
  r.card = await page.evaluate(() => { const id = (document.querySelector('[data-qa-pin-id]') || { getAttribute: () => null }).getAttribute('data-qa-pin-id') || window.__qaPinId || null, c = id && document.getElementById('p-' + id);
    const sel = document.querySelectorAll('li.pl.is-sel'), b = c && c.getBoundingClientRect();
    if (c) { const a = c.querySelector('.pl-n a, .pl-n button'); if (a) a.setAttribute('data-qa-mscard', '1'); }
    return { id, own: !!c && c.classList.contains('is-sel') && sel.length === 1, inView: !!b && b.left >= -1 && b.right <= innerWidth + 1 && b.top >= 0 && b.bottom <= innerHeight + 1 }; });
  if (!r.card.own || !r.card.inView) return r;
  const tap = () => page.click('[data-qa-mscard]', { timeout: 3000 }).catch(() => {});
  await tap(); await page.waitForTimeout(700);
  r.detail = await openSheetState(page);
  if (!r.detail) return r;
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  r.escCloses = await sheetGone(page);
  await tap(); await page.waitForTimeout(700);
  if (await openSheetState(page)) {
    await page.goBack({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(500);
    r.backCloses = await sheetGone(page);
    r.stayedOnPage = /\/beta\//.test(page.url()) && await page.evaluate(() => document.documentElement.getAttribute('data-view') === 'atlas');
  }
  r.ok = !!(r.detail.closeVisible && r.escCloses && r.backCloses && r.stayedOnPage);
  return r;
}

// Filter tray (B-10): a "Filters" control opens a tray with "Show N places".
async function trayFlow(page) {
  return page.evaluate(async () => {
    const vis = d => d.getBoundingClientRect().height > 0 && !d.closest('[hidden]');
    const b = [...document.querySelectorAll('[data-cleo-tray=""], button, [role=button]')].find(x => /^filters?\b/i.test((x.getAttribute('aria-label') || x.textContent || '').trim()) && vis(x));
    if (!b) return { button: false };
    b.click(); await new Promise(x => setTimeout(x, 300));
    const tray = [...document.querySelectorAll('.tray, [role=dialog]')].find(d => vis(d) && d.tagName !== 'BUTTON');
    if (!tray) return { button: true, tray: false };
    const show = [...tray.querySelectorAll('button')].find(x => /show\s+\d+/i.test(x.textContent));
    const r = { button: true, tray: true, showN: show ? show.textContent.trim() : null,
      groups: [...tray.querySelectorAll('fieldset, [role=group], h3, legend')].map(x => x.textContent.trim().slice(0, 20)).slice(0, 12) };
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise(x => setTimeout(x, 250)); r.escCloses = !vis(tray);
    return r;
  });
}

// ---------- per page ----------
// D-46 (QA, proposed for ratification in BETA-QA.md): the Atlas first screen at first load, no scroll. The map's share of
// the viewport, the peek tray (its text and size), and how many REAL places are named on screen: label pins that are
// wholly on screen and hit-test to themselves, plus cards wholly on screen, each matched to a card name in the page.
const ATLAS_FIRST = () => {
  const vh = innerHeight, vw = innerWidth, norm = t => (t || '').trim().replace(/\s+/g, ' ');
  const inView = r => r.width > 0 && r.height > 0 && r.top >= 0 && r.left >= -1 && r.bottom <= vh + 1 && r.right <= vw + 1;
  const hits = el => { const r = el.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!t && (t === el || el.contains(t)); };
  const names = [...new Set([...document.querySelectorAll('li.pl .pl-n')].map(n => norm(n.textContent)).filter(Boolean))];
  const real = t => !!t && names.some(n => n === t || (t.length >= 6 && n.startsWith(t.replace(/…$/, ''))));
  const map = document.querySelector('.leaflet-container'), mr = map && map.getBoundingClientRect();
  const mapH = mr ? Math.max(0, Math.min(mr.bottom, vh) - Math.max(mr.top, 0)) : 0;
  const pins = [...document.querySelectorAll('.leaflet-marker-icon.pp')].map(p => p.firstElementChild || p).filter(l => inView(l.getBoundingClientRect()) && hits(l)).map(l => norm(l.textContent)).filter(real);
  const cards = [...document.querySelectorAll('li.pl')].filter(c => !c.hidden && inView(c.getBoundingClientRect()) && hits(c)).map(c => norm((c.querySelector('.pl-n') || c).textContent)).filter(real);
  const tray = [...document.querySelectorAll('.ms-toggle, .mapclose')].find(e => inView(e.getBoundingClientRect()) && getComputedStyle(e).visibility !== 'hidden');
  const tr = tray && tray.getBoundingClientRect(), named = [...new Set(pins.concat(cards))];
  return { leaflet: !!map, mapPct: Math.round(100 * mapH / vh), tray: tray ? { text: norm(tray.textContent).slice(0, 60), w: Math.round(tr.width), h: Math.round(tr.height) } : null,
    named: named.length, namedEg: named.slice(0, 5), pinsNamed: pins.length, cardsNamed: cards.length };
};

async function measure(browser, base, rel) {
  const exp = expected(rel);
  const out = { page: rel, gen: exp ? exp.gen : ((MAN.generated || []).includes(rel) ? 'new' : 'mirror'), expected: exp && { total: exp.total, sights: exp.sights, food: exp.food, live: exp.live } };
  for (const vp of ['mobile', 'desktop']) {
    const v = out[vp] = {};
    let s = await open(browser, base, rel, vp, { initial: true });
    v.loadErr = s.loadErr;
    try {
      Object.assign(v, await s.page.evaluate(PROBE));
      if (vp === 'mobile' && SHOTS) {
        fs.mkdirSync(path.join(ROOT, 'qa', 'beta-shots'), { recursive: true });
        const f = rel.replace(/\//g, '__').replace(/\.html$/, '') + '.' + vp + '.jpg';
        await s.page.evaluate(() => window.scrollTo(0, 0));
        await s.page.screenshot({ path: path.join(ROOT, 'qa', 'beta-shots', f), type: 'jpeg', quality: 55, scale: 'css' }).catch(() => {});
        v.shot = 'qa/beta-shots/' + f;
      }
      if (vp === 'desktop' && SHOTS) {
        const f = rel.replace(/\//g, '__').replace(/\.html$/, '') + '.' + vp + '.jpg';
        fs.mkdirSync(path.join(ROOT, 'qa', 'beta-shots'), { recursive: true });
        await s.page.screenshot({ path: path.join(ROOT, 'qa', 'beta-shots', f), type: 'jpeg', quality: 55 }).catch(() => {});
        v.shot = 'qa/beta-shots/' + f;
      }
      v.fonts = await renderedFonts(s.page).catch(e => ({ err: String(e).slice(0, 120) }));
      v.focus = await focusWalk(s.page).catch(e => ({ err: String(e).slice(0, 120) }));
      v.overlap = await overlapScan(s.page).catch(e => ({ err: String(e).slice(0, 120) }));
      v.errorsLoad = s.st.errors.length;   // errors before the reachability stress loop (G4 grades these)
      if (vp === 'desktop' && v.cards && !v.legacy) {
        v.reach = await reachability(s.page, exp).catch(e => ({ err: String(e).slice(0, 160) }));
        v.tray = await trayFlow(s.page).catch(e => ({ err: String(e).slice(0, 120) }));
      }
    } catch (e) { v.probeErr = String(e.message || e).slice(0, 200); }
    v.errorsStress = s.st.errors.length - (v.errorsLoad || 0);
    v.errors = s.st.errors.slice(0, v.errorsLoad == null ? undefined : v.errorsLoad); v.stressErrorSample = [...new Set(s.st.errors.slice(v.errorsLoad || 0).map(e => e.slice(0, 120)))].slice(0, 3); v.local404 = s.st.local404; v.bytes = s.st.bytes; v.bytesAllResponses = s.st.bytesAll; v.initial = s.st.load; v.session = { bytes: s.st.bytes }; v.offOriginBlocked = s.st.offOrigin;
    await s.ctx.close();

    // night theme contrast
    {
      s = await open(browser, base, rel, vp, { scheme: 'dark' });
      try { const d = await s.page.evaluate(PROBE); v.night = { contrastChecked: d.contrastChecked, contrastFails: d.contrastFails, contrastFailList: d.contrastFailList.slice(0, 10) }; }
      catch (e) { v.night = { err: String(e).slice(0, 120) }; }
      await s.ctx.close();
    }
    // D-46 (QA): the first screen as a reader gets it — tiles answered (stubbed), first load, no scroll, network idle + 2 s:
    // CLS, the view at first paint, and (when the page opens in Atlas) the Atlas first screen once its first pins are drawn
    if (v.cards && !v.legacy) {
      s = await open(browser, base, rel, vp, { tiles: true, initial: true });
      try {
        v.view = await s.page.evaluate(() => ({ now: document.documentElement.getAttribute('data-view'), paint: window.__qaViewPaint || null, cls: +(window.__qaCls || 0).toFixed(4) }));
        if (v.view.now === 'atlas') {
          await s.page.waitForFunction(() => document.querySelector('.leaflet-marker-icon') || document.documentElement.classList.contains('ms-nomap'), null, { timeout: 3000 }).catch(() => {});
          v.atlasFirst = await s.page.evaluate(ATLAS_FIRST);
        }
      } catch (e) { v.view = v.view || { err: String(e).slice(0, 120) }; }
      await s.ctx.close();
    }
    // interactive map flows (tiles stubbed; never real network)
    if (v.cards && !v.legacy && v.hasMapEl) {
      s = await open(browser, base, rel, vp, { tiles: true, settle: 900 });
      try {
        if (vp === 'desktop') v.sync = await mapSync(s.page);
        else v.sheetFlow = await sheetFlow(s.page);
        v.tileHosts = [...s.st.tileHosts]; v.tileHostsOk = v.tileHosts.every(h => ALLOWED_TILES.test(h));
      } catch (e) { v.mapErr = String(e).slice(0, 160); }
      await s.ctx.close();
    }
  }
  // 360 px overflow (B-22)
  let s = await open(browser, base, rel, 'narrow');
  try { out.narrow = await s.page.evaluate(() => ({ vw: innerWidth, overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth) })); } catch (e) { out.narrow = { err: String(e).slice(0, 100) }; }
  await s.ctx.close();
  // JS disabled: every card still in the HTML (content is the HTML, RFC §5.1)
  s = await open(browser, base, rel, 'mobile', { js: false });
  try { out.noJs = await s.page.evaluate(() => ({ cards: document.querySelectorAll('li.pl').length, text: document.body.innerText.length })); } catch (e) { out.noJs = { err: String(e).slice(0, 100) }; }
  await s.ctx.close();
  // FCP at 4× CPU, mobile (B-44)
  s = await (async () => {
    const ctx = await browser.newContext({ ...VP.mobile, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    await ctx.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort('blockedbyclient'));
    const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const t0 = Date.now(); await page.goto(base + 'beta/' + rel + vhash(rel), { waitUntil: 'load', timeout: 60000 }).catch(() => {});
    const r = await page.evaluate(() => ({ fcp: Math.round((performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || 0) || null,
      dcl: Math.round(performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart) })).catch(() => ({}));
    r.loadMs = Date.now() - t0; out.cpu4x = r; return { ctx };
  })();
  await s.ctx.close();
  out.verdict = grade(out);
  return out;
}

// ---------- grading against the benchmark ----------
function grade(m) {
  const mo = m.mobile || {}, de = m.desktop || {}, rows = {};
  const isHub = (mo.kind === 'landing' || mo.kind === 'hub') || /(^|\/)index\.html$/.test(m.page);
  const city = !isHub && (m.expected || mo.cards);
  const P = (ok, val) => ({ pass: ok === null ? null : !!ok, val });
  const F = (ok, val) => ({ pass: !!ok, val });
  if (city) {
    // D-46 (QA, proposed): when the page opens in Atlas, B-01 (first card) and B-04 (rail) are Gallery criteria and are
    // recorded only; the Atlas first screen is graded by B-01a instead (phone: map-first with a peek tray naming real places)
    const atlasNow = !!(mo.view && mo.view.now === 'atlas'), af = mo.atlasFirst || {}, afd = de.atlasFirst || {};
    rows['B-01 screens to first card ≤1.0'] = atlasNow ? P(null, (mo.screensToFirstCard == null ? '—' : mo.screensToFirstCard) + ' (Atlas: recorded; see B-01a)') : P(mo.screensToFirstCard != null && mo.screensToFirstCard <= 1.0, mo.screensToFirstCard);
    if (atlasNow) rows['B-01a Atlas first screen: map + peek tray + ≥3 real places named (D-46)'] = F(
      (af.leaflet ? af.mapPct >= 50 && af.tray && af.tray.h >= 44 && /\d/.test(af.tray.text) && af.named >= 3 : af.cardsNamed >= 1) && (!de.view || de.view.now !== 'atlas' || afd.named >= 3),
      `phone map ${af.mapPct}% · tray ${af.tray ? '"' + af.tray.text + '" ' + af.tray.w + '×' + af.tray.h : 'none'} · named ${af.named} (${(af.namedEg || []).slice(0, 3).join(', ')}) · desktop named ${afd.named == null ? '—' : afd.named}`);
    rows['B-24 first load: CLS < 0.01, view set before first paint (D-46)'] = F(mo.view && de.view && mo.view.cls < 0.01 && de.view.cls < 0.01 && mo.view.paint === mo.view.now && de.view.paint === de.view.now,
      `CLS ${mo.view ? mo.view.cls : '?'} / ${de.view ? de.view.cls : '?'} · view at paint ${mo.view ? mo.view.paint + '→' + mo.view.now : '?'} / ${de.view ? de.view.paint + '→' + de.view.now : '?'}`);
    rows['B-02 masthead ≤0.6 screen'] = P(mo.mastheadPx != null && mo.mastheadPx <= 0.6 * 844, mo.mastheadPx);
    rows['B-03 controls above first card ≤14'] = P(mo.controlsAboveOnScreen != null && mo.controlsAboveOnScreen <= 14, mo.controlsAboveOnScreen + ' on-screen / ' + mo.controlsAbove + ' total');
    rows['B-04 rail on first screen'] = atlasNow ? P(null, 'Atlas (D-36, D-46): recorded — ' + (mo.railVisible ? 'top ' + mo.railTop : 'no rail')) : P(mo.railOnFirstScreen, mo.railVisible ? 'top ' + mo.railTop + ', ' + mo.railItems + ' tiles, first "' + mo.railFirst + '"' : 'no rail');
    rows['B-06 split view + sticky map + sync'] = de.sync ? F(de.sync.split && de.sync.sticky && de.sync.mapWidthPct >= 40 && de.sync.hoverHighlights && de.sync.pinClick && de.sync.pinClick.cardInView,
      `split ${de.sync.split}, sticky ${de.sync.sticky}, map ${de.sync.mapWidthPct}%, hover→pin ${de.sync.hoverHighlights}, pin→card ${de.sync.pinClick && de.sync.pinClick.cardInView}`) : P(false, 'map did not mount');
    const sf = mo.sheetFlow || {}, ps = sf.pinSheet, dt = sf.detail;
    // W7 (QA R7, additive): on the map-search phone a pin's place shows as its own carousel card, and the detail opens from
    // it — the row passes on the W6 path (pin sheet) OR the complete W7 path (msPinFlow); neither path is relaxed
    const mp = sf.msPin;
    rows['B-07 mobile map toggle + sheet (Close, Esc, Back)'] = F(sf.toggle && sf.toggle.ok44 && sf.fullMap && ((ps && ps.closeVisible && ps.escCloses && ps.backCloses && ps.stayedOnPage) || (mp && mp.ok)),
      `toggle ${sf.toggle ? sf.toggle.w + '×' + sf.toggle.h : 'none'}, full map ${!!sf.fullMap}, pin sheet ${ps ? `close ${ps.closeVisible}, esc ${ps.escCloses}, back ${ps.backCloses}` : 'none'}` +
      (mp ? `, map-search: own card ${mp.card && mp.card.own} in view ${mp.card && mp.card.inView} → detail ${!!mp.detail} close ${mp.detail && mp.detail.closeVisible} esc ${mp.escCloses} back ${mp.backCloses} atlas ${mp.stayedOnPage}` : ''));
    rows['B-08 floaters over titles = 0'] = P(mo.overlap && mo.overlap.hits === 0, mo.overlap ? mo.overlap.hits : null);
    rows['B-09 pin numbers == card numbers'] = de.sync ? P((de.sync.markerNumbers > 0 || de.sync.pinLabels > 0 || de.sync.namedPins > 0) && de.sync.orderingStated, `numbered pins ${de.sync.markerNumbers} (pin-n labels ${de.sync.pinLabels}), named pins ${de.sync.namedPins}, ordering stated ${de.sync.orderingStated}`) : P(false, 'n/a');
    rows['B-10 filter tray + "Show N places"'] = de.tray ? P(de.tray.tray && !!de.tray.showN, de.tray.tray ? de.tray.showN : (de.tray.button ? 'button, no tray' : 'no Filters control')) : P(false, 'n/a');
    rows['B-12 closed with tier glyph = 0'] = P(mo.closedWithTier === 0, mo.closedWithTier + ' of ' + mo.closed + ' closed');
    rows['B-16 cards per mobile screen ≥2'] = P(mo.cardsPerScreen != null && mo.cardsPerScreen >= 2, mo.cardsPerScreen);
    rows['B-17 sheet content (sources, directions, pin, status, save, share, trap)'] = dt
      ? F(Object.values(dt.has).every(Boolean) && dt.focusTrapped && dt.escCloses && dt.backCloses && dt.closeVisible,
        `missing: ${Object.entries(dt.has).filter(([, v]) => !v).map(([k]) => k).join(', ') || 'none'} · close ${dt.closeVisible} · trap ${dt.focusTrapped} · esc ${dt.escCloses} · back ${dt.backCloses} · focus restored ${dt.focusRestored}`)
      : F(false, 'no detail sheet from a card');
    rows['G1 reachability 100% (scroll, deep link, search, no-JS)'] = de.reach ? F(m.expected && de.reach.dom === m.expected.total && de.reach.scrolled === de.reach.dom && de.reach.missing === 0 && de.reach.dup === 0
      && de.reach.deepLinks.ok === de.reach.deepLinks.n && de.reach.search.ok === de.reach.search.n && m.noJs && m.noJs.cards === m.expected.total,
      `data ${m.expected && m.expected.total} · DOM ${de.reach.dom} · scrolled ${de.reach.scrolled} · deep ${de.reach.deepLinks.ok}/${de.reach.deepLinks.n} · search ${de.reach.search.ok}/${de.reach.search.n} · no-JS ${m.noJs && m.noJs.cards}`)
      : P(false, mo.legacy ? 'legacy mirror (no li.pl contract)' : 'not measured');
    rows['G6 "Recommended by" on every card'] = mo.legacy ? P(false, 'legacy mirror') : P(mo.noAttribution === 0 && mo.closedUnflagged === 0, `${mo.noAttribution} cards without · ${mo.closedUnflagged} closed unflagged`);
  } else if (isHub) {
    rows['B-05 hub: city cards above the fold ≥2'] = P(mo.cityCardsAbove >= 2, mo.cityCardsAbove);
  }
  const decl = Object.keys(mo.fontsDeclared || {}).filter(f => !CJK_FONT.test(f) && !/Mincho|Serif JP|native/i.test(f));
  rows['B-18 font families ≤2 (+CJK)'] = P(decl.length > 0 && decl.length <= 2, 'declared: ' + decl.join(', ') + (mo.fonts && mo.fonts.primary ? ' · rendered here: ' + mo.fonts.primary.join(', ') : ''));
  rows['B-19 uppercase text nodes <15%'] = P(mo.upperPct < 15, mo.upperPct + '% (' + mo.upperNodes + '/' + mo.textNodes + ')');
  rows['B-20 tap targets <44 = 0 (mobile)'] = P(mo.tapSmall === 0, mo.tapSmall);
  rows['B-21 smallest text ≥12px'] = P(mo.minFontPx != null && mo.minFontPx >= 12, mo.minFontPx + 'px ' + (mo.minFontEl || ''));
  rows['B-22 overflow 0 at 360 + 390'] = P(mo.overflowX === 0 && m.narrow && m.narrow.overflowX === 0, `390:${mo.overflowX} 360:${m.narrow && m.narrow.overflowX}`);
  rows['B-23 contrast AA light + night'] = P(mo.contrastFails === 0 && de.contrastFails === 0 && (!mo.night || mo.night.contrastFails === 0) && (!de.night || de.night.contrastFails === 0),
    `light ${mo.contrastFails}/${de.contrastFails} · night ${mo.night ? mo.night.contrastFails : '–'}/${de.night ? de.night.contrastFails : '–'} (mobile/desktop)`);
  rows['M1-16 focus visible'] = P(mo.focus && mo.focus.checked > 0 && mo.focus.invisible.length === 0, mo.focus ? (mo.focus.checked - mo.focus.invisible.length) + '/' + mo.focus.checked : null);
  rows['M1-16 landmarks + skip link + names'] = P(mo.landmarks && Object.values(mo.landmarks).every(Boolean) && mo.skipLink && mo.unnamedControls === 0,
    `${mo.landmarks ? Object.entries(mo.landmarks).filter(([, v]) => !v).map(([k]) => 'no ' + k).join(' ') || 'landmarks ok' : ''} · skip ${mo.skipLink} · unnamed ${mo.unnamedControls}`);
  rows['G4 no-CDN render, 0 JS errors'] = P(!mo.loadErr && !de.loadErr && !(mo.errors || []).length && !(de.errors || []).length && !(mo.local404 || []).length && (city ? mo.cards > 0 : mo.textNodes > 3),
    `errors ${(mo.errors || []).length + (de.errors || []).length} · 404 ${(mo.local404 || []).length} · off-origin blocked ${mo.offOriginBlocked + de.offOriginBlocked}`);
  if (city) rows['Stress: JS errors, every deep link at machine speed (info)'] = P(null, (de.errorsStress || 0) + ' errors' + (de.stressErrorSample && de.stressErrorSample.length ? ' — ' + de.stressErrorSample[0] : ''));
  rows['Tiles OSM/Esri only'] = P(!mo.tileHosts && !de.tileHosts ? null : (mo.tileHostsOk !== false && de.tileHostsOk !== false), [...new Set([...(mo.tileHosts || []), ...(de.tileHosts || [])])].join(', ') || 'no tiles requested');
  const kb = n => Math.round((n || 0) / 1024).toLocaleString('en-US') + ' KB';
  rows['Perf: bytes / DOM / FCP / FCP 4×'] = P(null, `${Math.round((de.bytes || 0) / 1024)} KB · ${de.domNodes} nodes · ${de.fcp} ms · ${m.cpu4x && m.cpu4x.fcp} ms`);
  // D-38 (ratified R7, on condition): map tiles are off-origin and blocked here, so they are EXCLUDED (Tokyo Atlas asks for
  // ~44 tiles on desktop, 27 on a phone). The budget is the default view at first load (no scroll, network idle + 2 s), transfer
  // ≤ 2.0 MB (2,000,000 B) on desktop AND phone @3×. The row above (whole session, unique URLs) stays informational.
  const ini = de.initial && mo.initial;
  rows['Perf: initial load transfer ≤ 2.0 MB, map tiles excluded (desktop · phone@3×; raw in brackets)'] = P(ini ? de.initial.gz <= 2e6 && mo.initial.gz <= 2e6 : false,
    ini ? `${kb(de.initial.gz)} (${kb(de.initial.bytes)}) · ${kb(mo.initial.gz)} (${kb(mo.initial.bytes)})` : 'not measured');
  const vals = Object.values(rows).filter(r => r.pass !== null);
  const hardKeys = Object.keys(rows).filter(k => /^(G1|G4|G6|B-12)/.test(k));
  return { rows, passed: vals.filter(r => r.pass).length, total: vals.length, hardFail: hardKeys.filter(k => rows[k].pass === false) };
}

function markdown(res) {
  if (res.length > 8) {   // many pages: one row per page, one column per criterion id
    const keys = [...new Set(res.flatMap(r => Object.keys(r.verdict.rows)))].filter(k => !/^Perf/.test(k));
    const id = k => k.split(' ')[0] + (k.startsWith('M1-16') ? (k.includes('focus') ? 'f' : 'a') : '');
    const head = '| Page | gen | ' + keys.map(id).join(' | ') + ' | score |';
    const sep = '|---|---|' + keys.map(() => ':-:').join('|') + '|---|';
    const body = res.map(r => '| `' + r.page + '` | ' + (r.gen || '') + ' | ' + keys.map(k => { const c = r.verdict.rows[k]; return !c ? '·' : c.pass === null ? 'i' : c.pass ? '✅' : '❌'; }).join(' | ') + ` | ${r.verdict.passed}/${r.verdict.total} |`);
    return ['Legend: ' + keys.map(k => '**' + id(k) + '** ' + k.slice(k.indexOf(' ') + 1)).join(' · '), '', head, sep, ...body].join('\n');
  }
  const keys = [...new Set(res.flatMap(r => Object.keys(r.verdict.rows)))];
  const head = '| Criterion | ' + res.map(r => '`' + r.page.replace(/\.html$/, '') + '`' + (r.gen === 'new' ? '' : ' (mirror)')).join(' | ') + ' |';
  const sep = '|---|' + res.map(() => '---').join('|') + '|';
  const body = keys.map(k => '| ' + k + ' | ' + res.map(r => {
    const c = r.verdict.rows[k]; if (!c) return '—';
    const v = String(c.val == null ? '' : c.val).replace(/\|/g, '/').slice(0, 90);
    return (c.pass === null ? 'ℹ️ ' : c.pass ? '✅ ' : '❌ ') + v;
  }).join(' | ') + ' |');
  return [head, sep, ...body, '| **Score** | ' + res.map(r => `${r.verdict.passed}/${r.verdict.total}`).join(' | ') + ' |'].join('\n');
}

// --regrade: re-apply grading + tables to an existing JSON (after a grading fix) without re-measuring.
if (opt('--regrade')) {
  const f = path.resolve(ROOT, opt('--regrade'));
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const r of j.pages) if (r.mobile) r.verdict = grade(r);
  fs.writeFileSync(f, JSON.stringify(j, null, 1));
  fs.writeFileSync(f.replace(/\.json$/, '.md'), '<!-- generated by tools/beta/metrics.js ' + j.generated + ' (regraded) -->\n' + markdown(j.pages) + '\n');
  console.log('regraded ' + path.relative(ROOT, f));
  process.exit(0);
}

(async () => {
  const pages = pageSet();
  if (!pages.length) { console.error('no beta pages matched'); process.exit(2); }
  const { chromium } = loadPlaywright();
  let browser;
  try { browser = await chromium.launch(); } catch (e) { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const srv = await serve();
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const res = []; let i = 0;
  async function worker() {
    while (i < pages.length) {
      const p = pages[i++];
      const t0 = Date.now();
      try { res.push(await measure(browser, base, p)); }
      catch (e) { res.push({ page: p, err: String(e.stack || e).slice(0, 300), verdict: { rows: {}, passed: 0, total: 0, hardFail: ['crash'] } }); }
      process.stderr.write(`  ${p} ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONC, pages.length) }, worker));
  await browser.close(); srv.close();
  const order = p => { const k = PILOT.indexOf(p); return k < 0 ? 100 : k; };
  res.sort((a, b) => order(a.page) - order(b.page) || a.page.localeCompare(b.page));
  const out = { generated: new Date().toISOString(), viewports: { mobile: '390x844@3 touch', desktop: '1440x900', narrow: '360x780' },
    network: 'all off-origin requests blocked (tiles stubbed 1x1 only in map-sync runs)', pages: res };
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 1));
  const md = markdown(res);
  fs.writeFileSync(OUT_JSON.replace(/\.json$/, '.md'), '<!-- generated by tools/beta/metrics.js ' + out.generated + ' -->\n' + md + '\n');
  console.log(md);
  const hard = res.filter(r => r.gen === 'new' && r.verdict.hardFail.length);
  for (const r of hard) console.log('HARD-GATE FAIL', r.page, r.verdict.hardFail.join('; '));
  console.log(`\nwrote ${path.relative(ROOT, OUT_JSON)} (${res.length} pages)`);
  process.exit(STRICT && hard.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
