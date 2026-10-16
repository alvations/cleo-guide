#!/usr/bin/env node
/**
 * Beta QA — Wave 6 probe (design/beta/eval/W6-BRIEFS.md; ROUNDS-6-9.md D1–D11). QA lane.
 * Independent of metrics.js: it measures what a reader can do in the map-first Atlas and with the W6 type, so the
 * metrics.js / test-beta.js rule edits made by the Atlas lane can be ratified (or not) against the user outcome.
 * Real Chromium, every off-origin request blocked (images stubbed 1×1 so tile hosts are still recorded).
 *   phone     390×844 #view=atlas: map fills the viewport; tray peek (area chip + first ranked place) → half → full by
 *             keyboard (Enter on the grab, Esc steps down), "List" opens full and Back steps down; 44 px controls;
 *             pin tap → sheet, Esc and Back close it; cluster partition (drawn ∪ bubbles == pinned, no overlap) and every
 *             pin back at zoom 13; titles clipped by the tray vs covered (independent B-08); identity on screen
 *   desktop   1440×900 #view=atlas: map ≥ 60 % wide, fills the screen; numbered pins == card ranks (every pin);
 *             card hover → pin; pin click → card in the list pane; wheel over the list keeps the map (independent B-06);
 *             area lens fits the map; deep link flies to the place; legend; base switch; Must see lens; locate-me opt-in
 *   reach     Atlas: #p= opens the sheet for EVERY id (view kept); search (25 samples); every card in the list
 *   nocdn     Leaflet blocked too: content renders, every card present, 0 JS errors, only the map missing (phone + desktop)
 *   storage   localStorage/sessionStorage throw: Atlas renders, tray, base switch and Must see work, 0 JS errors
 *   tiles     every tile request across the run goes to tile.openstreetmap.org or server.arcgisonline.com
 *   focus     every focusable map/tray control shows a focus ring (outline or box-shadow)
 *   type      the shipped faces cover every character on the Vietnamese pages and the pilots (CDP platform fonts);
 *             CJK falls back to a CJK system face; macrons at DPR 1 (18/24 px) in both faces
 *   axe       axe-core 4.10 (vendored) in all four views on the pilots, phone + desktop, light + night
 *   perf      Tokyo Gallery (default) and Atlas: same-origin bytes (raw + gzip est.) and FCP at 4× CPU (median of 3)
 * Usage: cd tools && node beta/qa/w6.js [--only phone,desktop,…]   Output: design/beta/eval/w6/qa/w6.json + *.jpg
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const OUT = path.join(ROOT, 'design', 'beta', 'eval', 'w6', 'qa');
fs.mkdirSync(OUT, { recursive: true });
const PILOTS = process.env.QA_PILOTS ? process.env.QA_PILOTS.split(',') : ['cleveland.html', 'cities/tokyo.html', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html'];
const VP = {
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  dpr1: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 },
};
const argv = process.argv.slice(2);
const ONLY = (() => { const i = argv.indexOf('--only'); return i >= 0 ? argv[i + 1].split(',') : null; })();
const want = k => !ONLY || ONLY.includes(k);
const TILE_OK = new Set(['tile.openstreetmap.org', 'server.arcgisonline.com']);

function loadPlaywright() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) {
    try { return require(t); } catch (e) { /* next */ }
  }
  throw new Error('playwright not found');
}
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.webp': 'image/webp' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0].split('#')[0]));
      if (!f.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
      try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
      fs.readFile(f, (err, buf) => {
        if (err) { rsp.writeHead(404); return rsp.end('404'); }
        rsp.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); rsp.end(buf);
      });
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const BLOCKED_NET = /net::ERR_|Failed to load resource|ERR_BLOCKED|ERR_FAILED/;
const NO_STORAGE = () => {
  for (const k of ['localStorage', 'sessionStorage']) {
    try { Object.defineProperty(window, k, { configurable: true, get() { throw new DOMException('blocked', 'SecurityError'); } }); } catch (e) { /* ignore */ }
  }
};
// counts geolocation reads, so "locate-me is opt-in" is measured, not assumed
const GEO_SPY = () => {
  window.__geoCalls = 0;
  if (navigator.geolocation) for (const k of ['getCurrentPosition', 'watchPosition']) {
    const f = navigator.geolocation[k].bind(navigator.geolocation);
    navigator.geolocation[k] = (...a) => { window.__geoCalls++; return f(...a); };
  }
};

const TILES = {};   // host → count, over the whole run
let browser, base;
async function open(rel, vp, o = {}) {
  const ctx = await browser.newContext({ ...VP[vp], serviceWorkers: 'block', reducedMotion: o.motion || 'reduce', colorScheme: o.scheme || 'light',
    permissions: o.geo ? ['geolocation'] : [], geolocation: o.geo || undefined, javaScriptEnabled: o.js !== false });
  if (o.noStorage) await ctx.addInitScript(NO_STORAGE);
  await ctx.addInitScript(GEO_SPY);
  const page = await ctx.newPage();
  const st = { errors: [], raw: 0, gz: 0, urls: [] };
  const origin = new URL(base).origin;
  await ctx.route('**/*', route => {
    const u = route.request().url();
    if (o.noLeaflet && /\/assets\/vendor\/leaflet\//.test(u)) return route.abort('blockedbyclient');
    if (u.startsWith(origin) || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    if (route.request().resourceType() === 'image') {
      const h = new URL(u).host; if (/\/\d+\/\d+\/\d+(\.png)?$/.test(new URL(u).pathname)) TILES[h] = (TILES[h] || 0) + 1;
      return route.fulfill({ status: 200, contentType: 'image/png', body: PNG1 });
    }
    return route.abort('blockedbyclient');
  });
  page.on('pageerror', e => st.errors.push('pageerror: ' + String(e.message || e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error' && !BLOCKED_NET.test(m.text())) st.errors.push(m.text().slice(0, 200)); });
  if (o.weigh) page.on('response', async r => { try { if (!r.url().startsWith(origin)) return; st.urls.push(r.url().slice(origin.length)); const b = await r.body(); st.raw += b.length;
    st.gz += /\.(png|jpg|woff2|webp)$/.test(r.url().split('?')[0]) ? b.length : zlib.gzipSync(b).length; } catch (e) { /* aborted */ } });
  page.on('dialog', d => d.accept());
  await page.goto(base + 'beta/' + rel + (o.hash || ''), { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(o.settle || 1500);
  return { ctx, page, st };
}
const shot = (page, name, clip) => page.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 60, clip }).catch(() => {});
const slug = rel => rel.replace(/\//g, '_').replace('.html', '');

const R = { head: null, checks: [], info: {} };
function check(group, name, ok, evidence) {
  R.checks.push({ group, name, ok: ok === null ? null : !!ok, evidence });
  console.log(`  ${ok === null ? 'INFO' : ok ? 'PASS' : 'FAIL'}  [${group}] ${name}` + (evidence !== undefined ? ' = ' + JSON.stringify(evidence).slice(0, 320) : ''));
}
const placesDir = path.join(BETA, 'data', 'places');
const DATA = {};
for (const f of fs.readdirSync(placesDir)) { const d = JSON.parse(fs.readFileSync(path.join(placesDir, f), 'utf8')); DATA[d.beta] = d; }
const clean = n => String(n).replace(/\s*[—–-]+\s*CLOSED\b.*$/i, '').replace(/\s*\([^)]*\)\s*$/, '').trim();

// in-page helpers (serialised into each evaluate)
const H = `
  window.__R = e => { if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height), b: Math.round(b.bottom), r: Math.round(b.right) }; };
  window.__vis = e => { if (!e || e.closest('[hidden]')) return false; const cs = getComputedStyle(e), b = e.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0 && b.width > 1 && b.height > 1; };
  // the part of an element a reader can see: its rect cut by every clipping ancestor and the viewport
  window.__seen = e => { let b = e.getBoundingClientRect(), t = Math.max(0, b.top), l = Math.max(0, b.left), btm = Math.min(innerHeight, b.bottom), r = Math.min(innerWidth, b.right);
    for (let a = e.parentElement; a && a !== document.documentElement; a = a.parentElement) { const cs = getComputedStyle(a), q = a.getBoundingClientRect(); if (a === document.body) continue;
      if (cs.overflowY !== 'visible') { t = Math.max(t, q.top); btm = Math.min(btm, q.bottom); } if (cs.overflowX !== 'visible') { l = Math.max(l, q.left); r = Math.min(r, q.right); } }
    return btm - t > 2 && r - l > 2 ? { t, l, b: btm, r } : null; };
  window.__ring = e => { const cs = getComputedStyle(e); return (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 1) || (cs.boxShadow && cs.boxShadow !== 'none'); };
  window.__C = () => window.Cleo && Cleo.city;
`;
const prep = async page => { await page.evaluate(H); };

/* ---------------- Atlas, phone ---------------- */
async function phone(rel) {
  const N = DATA[rel].places.length;
  const { ctx, page, st } = await open(rel, 'mobile', { hash: '#view=atlas', settle: 2200 });
  await prep(page);
  const s0 = await page.evaluate(() => {
    const m = document.getElementById('cleo-map'), lp = document.querySelector('.listpane'), sp = document.querySelector('.split');
    const first = [...lp.querySelectorAll('li.pl')].find(c => !c.hidden && __vis(c)), t = first && first.querySelector('.pl-n');
    const tSeen = t && __seen(t), h1 = document.querySelector('h1'), h1Seen = h1 && __vis(h1) && __seen(h1);
    // is the city named anywhere a sighted reader can see on this first screen?
    const city = (h1 && h1.textContent.trim().split(/\s+/)[0]) || '';
    const named = [...document.querySelectorAll('header *, .masthead *, [data-cleo-views] *, .tray-head *, .leaflet-control *')].some(e => e.children.length === 0 && __vis(e) && __seen(e) && e.textContent.includes(city));
    return { view: document.documentElement.getAttribute('data-view'), cls: document.documentElement.className, det: sp && sp.getAttribute('data-detent'),
      map: __R(m), leaflet: !!m.querySelector('.leaflet-pane'), lp: __R(lp), peekA: __vis(document.querySelector('.peek-a')) ? __R(document.querySelector('.peek-a')) : null,
      peekText: (document.querySelector('.peek-a') || {}).textContent, firstName: t && t.textContent.trim().slice(0, 40), firstSeen: !!tSeen, firstRank: first && (first.querySelector('.pl-num') || {}).textContent,
      h1Seen: !!h1Seen, city, named, vh: innerHeight, vw: innerWidth };
  });
  check('phone', `${rel}: Atlas opens map-first (map ≥ 95 % wide, ≥ 70 % tall, Leaflet mounted)`, s0.view === 'atlas' && s0.leaflet && s0.map.w >= 0.95 * s0.vw && s0.map.h >= 0.7 * s0.vh, { map: s0.map, det: s0.det });
  check('phone', `${rel}: tray at peek shows the area chip and the first ranked place`, s0.det === 'peek' && !!s0.peekA && s0.peekA.b <= s0.vh && s0.firstSeen && s0.firstRank === '1',
    { det: s0.det, chip: (s0.peekText || '').trim().replace(/\s+/g, ' '), first: s0.firstName, rank: s0.firstRank, trayTop: s0.lp.y });
  check('phone', `${rel}: the city is named on the first screen`, s0.named || s0.h1Seen, { city: s0.city, h1Visible: s0.h1Seen, namedInChrome: s0.named });
  await shot(page, 'phone-peek-' + slug(rel));

  // 44 px targets on the map chrome and tray head
  const small = await page.evaluate(() => [...document.querySelectorAll('.tray-head button, .tray-head a, .mapclose, .am-ctl, .am-ctl summary, .leaflet-control-zoom a, .leaflet-control-attribution a, [data-cleo-views] button, [data-cleo-views] a')]
    .filter(__vis).filter(e => __seen(e)).map(e => ({ e: (e.className || e.tagName).toString().slice(0, 30) + ' ' + (e.textContent || '').trim().slice(0, 16), ...__R(e) })).filter(x => x.w < 44 || x.h < 44));
  const attrib = small.filter(x => /leaflet-control-attribution|^A /.test(x.e) || /OpenStreetMap|Leaflet|Esri/.test(x.e));
  check('phone', `${rel}: map/tray controls ≥ 44 × 44 px (attribution links reported apart)`, small.length === attrib.length, { under44: small.filter(x => !attrib.includes(x)).slice(0, 5), attributionLinks: attrib.length });

  // keyboard: Enter on the grab steps up, Esc steps down
  const det = () => page.evaluate(() => document.querySelector('.split').getAttribute('data-detent'));
  const trayTop = () => page.evaluate(() => Math.round(document.querySelector('.listpane').getBoundingClientRect().top));
  const seq = [];
  await page.focus('.grab'); seq.push(['focus', await det(), await trayTop(), await page.evaluate(() => __ring(document.activeElement))]);
  await page.keyboard.press('Enter'); await page.waitForTimeout(400); seq.push(['Enter', await det(), await trayTop()]);
  await shot(page, 'phone-half-' + slug(rel));
  await page.keyboard.press('Enter'); await page.waitForTimeout(400); seq.push(['Enter', await det(), await trayTop()]);
  await shot(page, 'phone-full-' + slug(rel));
  await page.keyboard.press('Escape'); await page.waitForTimeout(400); seq.push(['Esc', await det(), await trayTop()]);
  await page.keyboard.press('Escape'); await page.waitForTimeout(400); seq.push(['Esc', await det(), await trayTop()]);
  const ds = seq.map(x => x[1]).join('>');
  check('phone', `${rel}: keyboard — Enter on the grab: peek→half→full; Esc: full→half→peek; ring on the grab`, ds === 'peek>half>full>half>peek' && seq[0][3] && seq[1][2] < seq[0][2] && seq[2][2] < seq[1][2], seq);
  // the rail (lenses) one step up: D-36 says the rail sits in the tray, one swipe up
  await page.keyboard.press('Enter'); await page.waitForTimeout(400);
  const railHalf = await page.evaluate(() => { const r = document.getElementById('cleo-rail'); return r && __vis(r) && !!__seen(r) ? __R(r) : null; });
  check('phone', `${rel}: D-36 — the rail is on screen at the half detent (one step up)`, !!railHalf || !(await page.evaluate(() => !!document.getElementById('cleo-rail'))), { rail: railHalf });
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  // "List" opens the full list; Back steps down and stays on the page
  const url0 = page.url();
  const lb = page.locator('.mapclose').first();
  let listFlow = null;
  if (await lb.count() && await lb.isVisible()) {
    await lb.click(); await page.waitForTimeout(500); const d1 = await det();
    const inList = await page.evaluate(() => { if (Cleo.defer && Cleo.defer.all) Cleo.defer.all(); return document.querySelectorAll('.listpane li.pl').length; });
    await page.goBack(); await page.waitForTimeout(600); const d2 = await det();
    listFlow = { afterList: d1, cardsInTray: inList, afterBack: d2, samePage: page.url().split('#')[0] === url0.split('#')[0], view: await page.evaluate(() => document.documentElement.getAttribute('data-view')) };
    check('phone', `${rel}: "List" opens the full tray with every card; Back steps it down and stays on the page`, d1 === 'full' && inList === N && d2 !== 'full' && listFlow.samePage && listFlow.view === 'atlas', listFlow);
  } else check('phone', `${rel}: "List" control visible over the map`, false, 'none');
  for (let i = 0; i < 2 && await det() !== 'peek'; i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); }

  // independent B-08: at each detent, every title a reader can see is not covered by something else
  const cover = async () => page.evaluate(() => {
    let seen = 0, covered = [];
    for (const t of document.querySelectorAll('li.pl .pl-n')) { if (!__vis(t)) continue; const s = __seen(t); if (!s) continue; seen++;
      const x = (s.l + s.r) / 2, y = (s.t + s.b) / 2, hit = document.elementFromPoint(x, y);
      if (hit && !t.contains(hit) && !hit.contains(t) && !(hit.closest('li.pl') === t.closest('li.pl'))) covered.push((hit.className || hit.tagName).toString().slice(0, 30) + ' over ' + t.textContent.trim().slice(0, 24)); }
    return { seen, covered: covered.length, eg: covered.slice(0, 3) }; });
  const cv = { peek: await cover() };
  await page.focus('.grab'); await page.keyboard.press('Enter'); await page.waitForTimeout(400); cv.half = await cover();
  await page.evaluate(() => { const lp = document.querySelector('.listpane'); lp.scrollTop = 1200; }); await page.waitForTimeout(250); cv.halfScrolled = await cover();
  await page.keyboard.press('Enter'); await page.waitForTimeout(400); await page.evaluate(() => { document.querySelector('.listpane').scrollTop = 2500; }); await page.waitForTimeout(250); cv.fullScrolled = await cover();
  check('phone', `${rel}: independent B-08 — no visible title covered (peek, half, half scrolled, full scrolled)`, Object.values(cv).every(c => c.covered === 0), cv);
  for (let i = 0; i < 3 && await det() !== 'peek'; i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); }

  // clustering: a partition of the pinned places, and every pin back at zoom ≥ 13
  const part = await page.evaluate(() => {
    const C = __C(), map = C.map(), mk = C.markers, inCl = C.inCl;
    const shown = Object.keys(mk).filter(id => { const c = C.byId[id] || C.stub(id); return c && !c.hidden; });
    const drawn = shown.filter(id => map.hasLayer(mk[id])), cl = Object.keys(inCl), both = drawn.filter(id => inCl[id]);
    const bubbles = [...document.querySelectorAll('.pin-cl')], bsum = bubbles.reduce((t, b) => t + +b.textContent, 0);
    const lost = shown.filter(id => !map.hasLayer(mk[id]) && !inCl[id]);
    return { zoom: map.getZoom(), shown: shown.length, drawn: drawn.length, clustered: cl.length, overlap: both.length, lost: lost.length, bubbles: bubbles.length, bubbleSum: bsum };
  });
  check('phone', `${rel}: clustering is a partition — every pinned place drawn or in exactly one bubble, bubble counts add up`, part.overlap === 0 && part.lost === 0 && part.bubbleSum === part.clustered && part.drawn + part.clustered === part.shown, part);
  // tap a bubble → zooms in
  if (part.bubbles) {
    const z0 = part.zoom; const bsel = await page.evaluate(() => { const b = [...document.querySelectorAll('.pin-cl')].find(x => { const r = x.getBoundingClientRect(); const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return h && x.contains(h) && r.top > 120; }); if (b) b.setAttribute('data-qa-b', '1'); return !!b; });
    if (bsel) { await page.tap('[data-qa-b]').catch(() => page.click('[data-qa-b]')); await page.waitForTimeout(900); }
    const z1 = await page.evaluate(() => __C().map().getZoom());
    check('phone', `${rel}: a tap on a count bubble zooms in`, bsel && z1 > z0, { z0, z1 });
  }
  const z13 = await page.evaluate(async () => { const C = __C(), map = C.map(); map.setZoom(13, { animate: false }); await new Promise(r => setTimeout(r, 500));
    const mk = C.markers, shown = Object.keys(mk).filter(id => { const c = C.byId[id] || C.stub(id); return c && !c.hidden; });
    return { zoom: map.getZoom(), bubbles: document.querySelectorAll('.pin-cl').length, clustered: Object.keys(C.inCl).length, drawn: shown.filter(id => map.hasLayer(mk[id])).length, shown: shown.length }; });
  check('phone', `${rel}: at zoom ≥ 13 no bubbles — every pin drawn`, z13.bubbles === 0 && z13.drawn === z13.shown, z13);

  // pin tap → sheet; Esc closes; Back closes and stays on the page
  const pinTap = async () => {
    const ok = await page.evaluate(() => { document.querySelectorAll('[data-qa-pin]').forEach(e => e.removeAttribute('data-qa-pin'));
      const ps = [...document.querySelectorAll('.leaflet-overlay-pane path.leaflet-interactive')].filter(p => { const b = p.getBoundingClientRect(); if (!(b.width > 0 && b.top > 130 && b.bottom < innerHeight - 260 && b.left > 10 && b.right < innerWidth - 10)) return false;
        const h = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return h === p; });
      if (!ps.length) return false; ps[Math.floor(ps.length / 2)].setAttribute('data-qa-pin', '1'); return true; });
    if (!ok) return null;
    const b = await page.locator('[data-qa-pin]').boundingBox(); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(700);
    return page.evaluate(() => { const p = document.getElementById('cleo-poi'); return p && !p.hidden ? { sheet: true, h: Math.round(p.getBoundingClientRect().height), dialog: p.getAttribute('role') || (p.querySelector('[role=dialog]') ? 'child' : ''), close: __vis(p.querySelector('[data-poi="x"]')) } : { sheet: false }; });
  };
  await page.evaluate(() => { const C = __C(); C.map().setZoom(14, { animate: false }); }); await page.waitForTimeout(500);
  const t1 = await pinTap();
  if (t1 && t1.sheet) await shot(page, 'phone-pinsheet-' + slug(rel));
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  const escClosed = await page.evaluate(() => { const p = document.getElementById('cleo-poi'); return !p || p.hidden; });
  const t2 = await pinTap();
  await page.goBack(); await page.waitForTimeout(700);
  const back = await page.evaluate(() => { const p = document.getElementById('cleo-poi'); return { closed: !p || p.hidden, view: document.documentElement.getAttribute('data-view'), url: location.pathname }; });
  check('phone', `${rel}: pin tap → sheet with Close; Esc closes; Back closes and stays in Atlas`, t1 && t1.sheet && t1.close && escClosed && t2 && t2.sheet && back.closed && back.view === 'atlas' && back.url.endsWith(rel.split('/').pop()), { t1, escClosed, t2, back });
  check('phone', `${rel}: 0 JS errors`, !st.errors.length, st.errors.slice(0, 3));
  await ctx.close();
}

/* ---------------- Atlas, desktop ---------------- */
async function desktop(rel) {
  const d = DATA[rel];
  const { ctx, page, st } = await open(rel, 'desktop', { hash: '#view=atlas', settle: 2500, geo: { latitude: 41.5, longitude: -81.7 } });
  await prep(page);
  const g = await page.evaluate(() => { const m = document.getElementById('cleo-map'), lp = document.querySelector('.listpane');
    return { map: __R(m), lp: __R(lp), vw: innerWidth, vh: innerHeight, geo: window.__geoCalls, legend: [...document.querySelectorAll('.m-legend li')].length, legendOpen: !!(document.querySelector('.m-legend') || {}).open }; });
  const pct = Math.round(g.map.w / g.vw * 100);
  check('desktop', `${rel}: map ≥ 60 % of the width and fills the first screen`, pct >= 60 && g.map.b >= g.vh - 2 && g.map.y < g.vh * 0.35, { mapPct: pct, listPct: Math.round(g.lp.w / g.vw * 100), map: g.map });
  check('desktop', `${rel}: area legend on the map`, g.legend >= 3, { items: g.legend, open: g.legendOpen });
  check('desktop', `${rel}: locate-me is opt-in — no location read on load`, g.geo === 0, { geoCalls: g.geo });
  await shot(page, 'desktop-' + slug(rel));

  // numbered pins == card ranks, every pin with a number
  const nums = await page.evaluate(() => { if (Cleo.defer && Cleo.defer.all) Cleo.defer.all(); const C = __C(); let n = 0, bad = [], none = 0;
    for (const id of Object.keys(C.markers)) { const k = C.markers[id], tt = k.getTooltip && k.getTooltip(), el = tt && tt.getElement && tt.getElement(); const c = document.getElementById('p-' + id); if (!c) continue;
      const cn = ((c.querySelector('.pl-num') || {}).textContent || '').trim(); if (!el) { none++; continue; } n++; const pn = el.textContent.trim(); if (pn !== cn) bad.push(id + ' pin ' + pn + ' card ' + cn); }
    return { checked: n, noLabel: none, mismatch: bad.length, eg: bad.slice(0, 4) }; });
  check('desktop', `${rel}: every numbered pin carries its card's rank`, nums.checked > 0 && nums.mismatch === 0, nums);

  // card hover → its pin lights (or its bubble)
  const hv = await page.evaluate(() => { const C = __C(); const c = [...document.querySelectorAll('.listpane li.pl[data-ll]')].find(x => { const b = x.getBoundingClientRect(); return b.top > 0 && b.top < innerHeight - 120 && !x.hidden; });
    if (!c) return null; c.setAttribute('data-qa-hv', '1'); const id = c.id.replace(/^p-/, ''); return { id, r0: C.markers[id] && C.markers[id].options.radius }; });
  if (hv) { const box = await page.locator('[data-qa-hv]').boundingBox(); await page.mouse.move(box.x + 40, box.y + 30); await page.waitForTimeout(250); }
  const hv2 = hv && await page.evaluate(id => { const C = __C(), k = C.markers[id], b = C.inCl[id] && C.inCl[id].getElement(); return { r1: k && k.options.radius, bubbleHot: !!(b && b.classList.contains('hot')) }; }, hv.id);
  check('desktop', `${rel}: card hover → its pin (or bubble) lights`, hv && hv2 && (hv2.r1 > hv.r0 || hv2.bubbleHot), { ...hv, ...hv2 });
  await page.mouse.move(g.map.x + g.map.w / 2, 20);

  // pin click → its card in the list pane (pick a pin whose card is far down the list)
  const pk = await page.evaluate(() => { const C = __C(), lp = document.querySelector('.listpane'), lr = lp.getBoundingClientRect();
    const ps = Object.keys(C.markers).map(id => [id, C.markers[id]]).filter(([id, k]) => { const p = k.getElement && k.getElement(); if (!p) return false; const b = p.getBoundingClientRect();
      if (!(b.left > lr.right + 70 && b.right < innerWidth - 20 && b.top > 250 && b.bottom < innerHeight - 40)) return false; const h = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return h === p; });
    const far = ps.map(([id, k]) => [id, k, document.getElementById('p-' + id)]).filter(x => x[2]).sort((a, b) => b[2].getBoundingClientRect().top - a[2].getBoundingClientRect().top)[0];
    if (!far) return null; far[1].getElement().setAttribute('data-qa-pk', '1'); return { id: far[0], cardTop0: Math.round(far[2].getBoundingClientRect().top) }; });
  if (pk) { await page.click('[data-qa-pk]', { force: true }); await page.waitForTimeout(1400); }
  const pk2 = pk && await page.evaluate(id => { const c = document.getElementById('p-' + id), s = c && __seen(c); return { focus: c && c.classList.contains('is-focus'), inPane: !!s, top: c && Math.round(c.getBoundingClientRect().top) }; }, pk.id);
  check('desktop', `${rel}: pin click → its card is focused and in view in the list pane`, pk && pk2.focus && pk2.inPane, { ...pk, ...pk2 });

  // independent B-06: wheel over the list scrolls the list; the map stays in view
  await page.evaluate(() => { document.querySelector('.listpane').scrollTop = 0; scrollTo(0, 0); });
  await page.mouse.move(g.lp.x + g.lp.w / 2, Math.min(g.vh - 60, g.lp.y + 300));
  for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(40); }
  await page.waitForTimeout(300);
  const wh = await page.evaluate(() => { const m = document.getElementById('cleo-map').getBoundingClientRect(), lp = document.querySelector('.listpane');
    return { paneScroll: Math.round(lp.scrollTop), winScroll: Math.round(scrollY), mapTop: Math.round(m.top), mapBottom: Math.round(m.bottom), mapInView: m.top < innerHeight && m.bottom > innerHeight * 0.8 && m.height > 400 }; });
  check('desktop', `${rel}: independent B-06 — wheel over the list moves the list; the map stays in view`, (wh.paneScroll > 1000 || wh.winScroll > 1000) && wh.mapInView, wh);
  await page.evaluate(() => { document.querySelector('.listpane').scrollTop = 0; scrollTo(0, 0); });

  // area lens fits the map; Must see filter; base switch; locate-me
  const areas = [...new Set(d.places.filter(p => p.la != null).map(p => p.a))];
  const a2 = areas[Math.min(1, areas.length - 1)];
  if (a2) {
    await page.evaluate(a => { location.hash = Cleo.route.href({ view: 'atlas', a }); }, a2); await page.waitForTimeout(1800);
    const fit = await page.evaluate(a => { const C = __C(), map = C.map(), bd = map.getBounds(); const ids = Object.keys(C.markers).filter(id => { const c = C.byId[id] || C.stub(id); return c && c.getAttribute('data-a') === a; });
      const inB = ids.filter(id => bd.contains(C.markers[id].getLatLng())).length; return { a, pins: ids.length, inBounds: inB, zoom: map.getZoom() }; }, a2);
    check('desktop', `${rel}: area lens fits the map to that area (≥ 90 % of its pins in view)`, fit.pins > 0 && fit.inBounds >= 0.9 * fit.pins, fit);
    await page.evaluate(() => { location.hash = Cleo.route.href({ view: 'atlas' }); }); await page.waitForTimeout(800);
  }
  const must = page.locator('.m-must').first();
  if (await must.count()) {
    const n0 = await page.evaluate(() => [...document.querySelectorAll('li.pl')].filter(c => !c.hidden).length + (Cleo.defer ? Cleo.defer.peek().length : 0));
    await must.click(); await page.waitForTimeout(900);
    const m1 = await page.evaluate(() => { if (Cleo.defer && Cleo.defer.all) Cleo.defer.all(); const vis = [...document.querySelectorAll('li.pl')].filter(c => !c.hidden && !c.closest('[hidden]'));
      const C = __C(), map = C.map(), shownPins = Object.keys(C.markers).filter(id => map.hasLayer(C.markers[id]) || C.inCl[id]);
      return { hash: location.hash, shown: vis.length, nonT1: vis.filter(c => c.getAttribute('data-t') !== '1').length, pins: shownPins.length, pinnedShown: vis.filter(c => c.hasAttribute('data-ll')).length, pressed: document.querySelector('.m-must').getAttribute('aria-pressed') }; });
    await must.click(); await page.waitForTimeout(900);
    const n2 = await page.evaluate(() => [...document.querySelectorAll('li.pl')].filter(c => !c.hidden).length + (Cleo.defer ? Cleo.defer.peek().length : 0));
    check('desktop', `${rel}: "Must see" on the map — list and pins follow the t=1 lens; a second tap restores all`, /t=1/.test(m1.hash) && m1.nonT1 === 0 && m1.shown > 0 && m1.pins === m1.pinnedShown && m1.pressed === 'true' && n2 === n0, { n0, ...m1, n2 });
  } else check('desktop', `${rel}: Must see control`, false, 'none');
  const bs = page.locator('.m-base').first(), labels = [];
  if (await bs.count()) { for (let i = 0; i < 3; i++) { await bs.click(); await page.waitForTimeout(500); labels.push(await bs.textContent()); } }
  check('desktop', `${rel}: base switch cycles Street → Light → Satellite (OSM / Esri)`, labels.length === 3 && new Set(labels.map(s => s.trim())).size === 3, labels.map(s => s.trim()));
  const loc = page.locator('.m-locate').first();
  if (await loc.count()) {
    await loc.click(); await page.waitForTimeout(900);
    const L1 = await page.evaluate(() => { const ss = []; try { for (let i = 0; i < localStorage.length; i++) ss.push(localStorage.key(i) + '=' + localStorage.getItem(localStorage.key(i))); } catch (e) {}
      try { for (let i = 0; i < sessionStorage.length; i++) ss.push(sessionStorage.key(i) + '=' + sessionStorage.getItem(sessionStorage.key(i))); } catch (e) {}
      return { geo: window.__geoCalls, me: document.querySelectorAll('.leaflet-overlay-pane path.me').length, pressed: document.querySelector('.m-locate').getAttribute('aria-pressed'), stored: ss.filter(s => /41\.5|-81\.7|lat|lng|geo/i.test(s)) }; });
    check('desktop', `${rel}: locate-me reads the position only on tap, draws it, stores nothing`, L1.geo === 1 && L1.me === 1 && !L1.stored.length, L1);
  }
  check('desktop', `${rel}: 0 JS errors`, !st.errors.length, st.errors.slice(0, 3));
  await ctx.close();

  // deep link load → the map flies to the place
  const pl = d.places.filter(p => p.la != null)[Math.floor(d.places.length * 0.7)] || d.places[0];
  { const { ctx, page } = await open(rel, 'desktop', { hash: '#view=atlas&p=' + encodeURIComponent(pl.id), settle: 2800 }); await prep(page);
    const f = await page.evaluate(id => { const C = __C(), map = C.map(), k = C.markers[id]; return { sheet: !!(Cleo.sheet && Cleo.sheet.isOpen()), inView: !!(map && k && map.getBounds().contains(k.getLatLng())), view: document.documentElement.getAttribute('data-view') }; }, pl.id);
    check('desktop', `${rel}: deep link #view=atlas&p= opens the place and the map shows its pin`, f.sheet && f.inView && f.view === 'atlas', { id: pl.id, ...f });
    await ctx.close(); }
}

/* ---------------- reachability in Atlas ---------------- */
async function reach(rel) {
  const d = DATA[rel], N = d.places.length;
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page, st } = await open(rel, vp, { hash: '#view=atlas', settle: 1800 });
    const miss = await page.evaluate(async list => { const bad = [];
      for (const p of list) { location.hash = '#view=atlas&p=' + encodeURIComponent(p.id); await new Promise(r => setTimeout(r, 60));
        const t = document.getElementById('sh-t'), dlg = t && t.closest('[role=dialog]'), w = p.n.split(/\s+/)[0].toLowerCase();
        if (!dlg || dlg.hidden || !t.textContent.toLowerCase().includes(w) || document.documentElement.getAttribute('data-view') !== 'atlas') bad.push(p.id); }
      return bad; }, d.places.map(p => ({ id: p.id, n: clean(p.n) })));
    check('reach', `${rel} ${vp}: Atlas #p= opens the sheet for every one of ${N} places, Atlas kept`, !miss.length, { missing: miss.length, e: miss.slice(0, 4), err: st.errors.slice(0, 2) });
    await ctx.close();
    // search + list
    const { ctx: c2, page: p2, st: s2 } = await open(rel, vp, { hash: '#view=atlas', settle: 1800 });
    if (vp === 'mobile') { await p2.click('.mapclose').catch(() => {}); await p2.waitForTimeout(500); }
    const all = await p2.evaluate(() => { if (Cleo.defer && Cleo.defer.all) Cleo.defer.all(); return document.querySelectorAll('.listpane li.pl').length; });
    const step = Math.max(1, Math.floor(N / 25)), sample = d.places.filter((p, i) => i % step === 0).slice(0, 25), bad = [];
    const box = p2.locator('#cleo-filter').first();
    if (!(await box.count()) || !(await box.isVisible())) bad.push('no visible #cleo-filter');
    else for (const p of sample) { await box.fill(clean(p.n)); await p2.waitForTimeout(220);
      const ok = await p2.evaluate(id => { const c = document.getElementById('p-' + id); return !!(c && !c.hidden && !c.closest('[hidden]')); }, p.id); if (!ok) bad.push(p.id); }
    check('reach', `${rel} ${vp}: Atlas list holds every card (${N}); search by name shows the place (${sample.length} samples)`, all === N && !bad.length, { list: all, bad: bad.slice(0, 5), err: s2.errors.slice(0, 2) });
    await c2.close();
  }
}

/* ---------------- no map library / no storage ---------------- */
async function nocdn(rel) {
  const N = DATA[rel].places.length;
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page, st } = await open(rel, vp, { hash: '#view=atlas', settle: 2200, noLeaflet: true }); await prep(page);
    const s = await page.evaluate(() => { if (Cleo.defer && Cleo.defer.all) Cleo.defer.all();
      const first = [...document.querySelectorAll('li.pl')].find(c => !c.hidden && __vis(c) && __seen(c.querySelector('.pl-n') || c));
      const m = document.getElementById('cleo-map');
      return { cards: document.querySelectorAll('li.pl').length, leaflet: !!document.querySelector('.leaflet-pane'), view: document.documentElement.getAttribute('data-view'),
        firstOnScreen: first ? (first.querySelector('.pl-n') || {}).textContent.trim().slice(0, 40) : null, mapText: m ? m.textContent.trim().replace(/\s+/g, ' ').slice(0, 80) : '' }; });
    check('nocdn', `${rel} ${vp}: Leaflet blocked — every card, a card on screen, 0 JS errors, only the map missing`, s.cards === N && !s.leaflet && !!s.firstOnScreen && !st.errors.length && s.view === 'atlas', { ...s, err: st.errors.slice(0, 2) });
    if (rel === 'cities/tokyo.html') await shot(page, 'nocdn-' + vp + '-' + slug(rel));
    // the List control still opens every card
    if (vp === 'mobile') { await page.click('.mapclose', { timeout: 2000 }).catch(() => {}); await page.waitForTimeout(400);
      const n = await page.evaluate(() => [...document.querySelectorAll('.listpane li.pl')].filter(c => !c.hidden).length + (Cleo.defer ? Cleo.defer.peek().length : 0));
      check('nocdn', `${rel} phone: Leaflet blocked — "List" still opens the list (${N})`, n === N, { n }); }
    await ctx.close();
  }
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page, st } = await open(rel, vp, { hash: '#view=atlas', settle: 2200, noStorage: true });
    const s0 = await page.evaluate(() => ({ view: document.documentElement.getAttribute('data-view'), cards: document.querySelectorAll('li.pl').length + (Cleo.defer ? Cleo.defer.peek().length : 0), leaflet: !!document.querySelector('.leaflet-pane') }));
    const acts = [];
    for (const sel of ['.m-base', '.m-must', vp === 'mobile' ? '.grab' : null]) { if (!sel) continue; const l = page.locator(sel).first(); if (await l.count()) { await l.click().catch(e => acts.push(sel + ' ' + e.message.slice(0, 40))); await page.waitForTimeout(500); acts.push(sel); } }
    const s1 = await page.evaluate(() => ({ hash: location.hash, det: (document.querySelector('.split') || {}).getAttribute && document.querySelector('.split').getAttribute('data-detent'), base: (document.querySelector('.m-base') || {}).textContent }));
    check('storage', `${rel} ${vp}: storage throws — Atlas renders, map, base switch / Must see / tray work, 0 JS errors`, s0.view === 'atlas' && s0.cards === N && s0.leaflet && /t=1/.test(s1.hash) && !st.errors.length, { ...s0, ...s1, acts, err: st.errors.slice(0, 2) });
    await ctx.close();
  }
}

/* ---------------- focus rings on the map + tray controls ---------------- */
async function focus(rel) {
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page } = await open(rel, vp, { hash: '#view=atlas', settle: 2200 }); await prep(page);
    const sels = await page.evaluate(() => { const els = [...document.querySelectorAll('.tray-head button, .mapclose, .am-ctl:not(details), .m-legend summary, .leaflet-control-zoom a, .leaflet-marker-icon.pin-cl, [data-cleo-views] button, [data-cleo-views] a')].filter(e => __vis(e) && __seen(e));
      els.forEach((e, i) => e.setAttribute('data-qa-f', String(i))); return els.length; });
    const bad = [];
    for (let i = 0; i < sels; i++) {
      // keyboard focus (focus-visible): Tab from the previous element is not stable, so focus then press Shift to mark keyboard modality
      await page.evaluate(i => { const e = document.querySelector(`[data-qa-f="${i}"]`); if (e && e.tagName === 'SUMMARY') e.setAttribute('tabindex', e.getAttribute('tabindex') || '0'); }, i);
      await page.keyboard.press('Shift'); await page.focus(`[data-qa-f="${i}"]`).catch(() => {});
      const r = await page.evaluate(i => { const e = document.querySelector(`[data-qa-f="${i}"]`); return { el: (e.className || e.tagName).toString().slice(0, 34) + ' ' + (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 18), focused: document.activeElement === e, ring: __ring(e) }; }, i);
      if (r.focused && !r.ring) bad.push(r.el); if (!r.focused) bad.push('not focusable: ' + r.el);
    }
    check('focus', `${rel} ${vp}: every Atlas map / tray control shows a focus ring (${sels} controls)`, sels > 0 && !bad.length, { bad: bad.slice(0, 6) });
    if (rel === 'cities/tokyo.html') { await page.focus('.m-must').catch(() => {}); await shot(page, 'focus-' + vp + '-must'); }
    await ctx.close();
  }
}

/* ---------------- type: coverage of the scripts in our data ---------------- */
async function type() {
  const VN = fs.readdirSync(path.join(BETA, 'Vietnam')).filter(f => f.endsWith('.html')).map(f => 'Vietnam/' + f);
  const pages = [...VN, ...PILOTS, 'index.html'];
  const faces = /^(Playfair|Inter)\b/;
  for (const rel of pages) {
    const { ctx, page } = await open(rel, 'mobile', { settle: 1500 });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    // every character in the page's visible text, set in each shipped face, then ask the renderer which font drew it
    const chars = await page.evaluate(() => { if (window.Cleo && Cleo.defer && Cleo.defer.all) Cleo.defer.all(); const s = new Set();
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const p = n.parentElement; if (!p || p.closest('script,style,noscript,svg,[aria-hidden=true]')) continue; for (const ch of n.textContent) s.add(ch); }
      return [...s].filter(c => /\S/.test(c)).join(''); });
    const cjk = [...chars].filter(c => /[　-鿿가-힯＀-￯]/.test(c)).join('');
    const latin = [...chars].filter(c => !cjk.includes(c)).join('');
    const cdp = await ctx.newCDPSession(page); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    const res = {};
    for (const [face, txt] of [['display', latin], ['ui', latin], ['cjk', cjk]]) {
      if (!txt) continue;
      await page.evaluate(([face, txt]) => { const e = document.createElement('div'); e.id = 'qa-type-' + face; e.textContent = txt;
        e.style.cssText = 'position:absolute;left:0;top:0;width:360px;font-size:20px;white-space:normal;word-break:break-all;font-family:' + (face === 'display' ? 'var(--font-display)' : face === 'ui' ? 'var(--font-ui)' : 'var(--font-native, var(--font-ui))');
        document.body.appendChild(e); }, [face, txt]);
      await page.evaluate(() => document.fonts && document.fonts.ready); await page.waitForTimeout(300);
      const { root } = await cdp.send('DOM.getDocument', { depth: 1 });
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#qa-type-' + face });
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
      res[face] = fonts.map(f => f.familyName + ':' + f.glyphCount);
      // which characters fell back: render them one by one only when some glyphs came from another font
      if (face !== 'cjk' && fonts.some(f => !faces.test(f.familyName))) {
        const fb = [];
        for (const ch of txt) { await page.evaluate(ch => { document.getElementById('qa-type-x') || document.body.insertAdjacentHTML('beforeend', '<span id="qa-type-x"></span>'); const x = document.getElementById('qa-type-x'); x.textContent = ch; x.style.fontFamily = getComputedStyle(document.querySelector('[id^=qa-type-]:not(#qa-type-x)')).fontFamily; }, ch);
          const { root: r2 } = await cdp.send('DOM.getDocument', { depth: 1 }); const q = await cdp.send('DOM.querySelector', { nodeId: r2.nodeId, selector: '#qa-type-x' });
          const f2 = (await cdp.send('CSS.getPlatformFontsForNode', { nodeId: q.nodeId })).fonts; if (f2.some(f => !faces.test(f.familyName))) fb.push(ch + ' U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')); }
        res[face + 'Fallback'] = fb;
        await page.evaluate(() => { const x = document.getElementById('qa-type-x'); if (x) x.remove(); });
      }
      await page.evaluate(face => document.getElementById('qa-type-' + face).remove(), face);
    }
    const vn = [...latin].filter(c => /[ăâđêôơưĂÂĐÊÔƠƯẠ-ỹ]/.test(c)).length;
    const fbD = res.displayFallback || [], fbU = res.uiFallback || [];
    const okFb = x => /U\+2192|U\+2190|U\+2197|U\+2605|U\+2606|U\+2713|U\+2715|U\+2726|U\+25|U\+2B|U\+1F|U\+27/.test(x);   // arrows, stars, ticks, geometric/emoji symbols: system symbol face by design
    check('type', `${rel}: shipped faces draw every letter on the page (${[...latin].length} chars, ${vn} Vietnamese)`, !fbD.filter(x => !okFb(x)).length && !fbU.filter(x => !okFb(x)).length,
      { display: res.display, ui: res.ui, displayFallback: fbD.slice(0, 12), uiFallback: fbU.slice(0, 12) });
    if (cjk) check('type', `${rel}: CJK (${[...cjk].length} chars) falls back to a CJK system face, no gaps`, (res.cjk || []).every(f => /CJK|Hei|Mincho|Gothic|Noto|WenQuanYi|Droid|IPA|Han/i.test(f) || /^(Playfair|Inter):/.test(f)) && (res.cjk || []).some(f => !/^(Playfair|Inter):/.test(f)), res.cjk);
    if (/Vietnam\//.test(rel) && rel !== 'Vietnam/index.html') { await page.evaluate(() => { const h = document.querySelector('li.gc, li.pl'); if (h) h.scrollIntoView({ block: 'start' }); }); await page.waitForTimeout(300); await shot(page, 'type-vn-' + slug(rel)); }
    await ctx.close();
  }
  // macrons at DPR 1 in BOTH faces, 18 and 24 px
  const { ctx, page } = await open('cities/tokyo.html', 'dpr1', { settle: 1500 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  for (const fam of ['var(--font-display)', 'var(--font-ui)']) for (const px of [18, 24]) {
    const r = await page.evaluate(({ px, fam }) => { const mk = (t, x) => { const s = document.createElement('span'); s.textContent = t; s.className = 'qa-mac';
      s.style.cssText = `position:fixed;left:${x}px;top:10px;font-size:${px}px;font-family:${fam};line-height:1.6;color:#000;background:#fff;padding:4px;z-index:99999`; document.body.appendChild(s); return s.getBoundingClientRect(); };
      const a = mk('ō', 10), b = mk('o', 80); return { a: [a.x, a.y, a.width, a.height], b: [b.x, b.y, b.width, b.height] }; }, { px, fam });
    await page.waitForTimeout(150);
    const A = await page.screenshot({ clip: { x: r.a[0], y: r.a[1], width: r.a[2], height: r.a[3] } }), B = await page.screenshot({ clip: { x: r.b[0], y: r.b[1], width: r.a[2], height: r.a[3] } });
    check('type', `DPR 1, ${px} px, ${fam}: "ō" draws its macron (pixels differ from "o")`, !A.equals(B), { a: A.length, b: B.length });
    await page.evaluate(() => document.querySelectorAll('.qa-mac').forEach(e => e.remove()));
  }
  await page.evaluate(() => { const s = document.createElement('div'); s.id = 'qa-mac-sample'; s.style.cssText = 'position:fixed;left:0;top:0;width:390px;background:#fff;color:#111;padding:10px;z-index:99999';
    s.innerHTML = ['18px', '24px'].map(px => `<div style="font:400 ${px}/1.4 var(--font-display)">Kanda Myōjin · Ōkunoshima · Tōdai-ji</div><div style="font:500 ${px}/1.4 var(--font-ui)">Kanda Myōjin · Ōkunoshima · Tōdai-ji</div>`).join('') + '<div style="font:400 24px/1.4 var(--font-display)">Hồ Chí Minh · Phở · Bánh mì · Đà Nẵng</div><div style="font:400 20px/1.4 var(--font-native, var(--font-ui))">東京 浅草寺 神田明神</div>';
    document.body.appendChild(s); });
  await page.waitForTimeout(400); await shot(page, 'type-macron-vn-cjk-dpr1', { x: 0, y: 0, width: 390, height: 330 });
  await ctx.close();
}

/* ---------------- axe in all four views ---------------- */
async function axe() {
  const AXE = fs.readFileSync(path.join(__dirname, 'vendor', 'axe.min.js'), 'utf8');
  const rows = [];
  for (const rel of PILOTS) for (const view of ['gallery', 'atlas', 'guidebook', 'insights']) for (const vp of ['mobile', 'desktop']) for (const scheme of ['light', 'dark']) {
    const { ctx, page } = await open(rel, vp, { scheme, hash: '#view=' + view, settle: 1800 });
    await page.addScriptTag({ content: AXE });
    const res = await page.evaluate(async () => {
      const r = await axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } });
      return r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, eg: v.nodes.slice(0, 2).map(n => n.target.join(' ') + ' — ' + (n.failureSummary || '').split('\n').slice(1, 2).join('').trim().slice(0, 140)) }));
    });
    const sc = res.filter(v => v.impact === 'serious' || v.impact === 'critical');
    rows.push({ rel, view, vp, scheme, serious: sc, other: res.filter(v => !sc.includes(v)).map(v => v.id + '(' + v.impact + ')×' + v.n) });
    check('axe', `${rel} ${view} ${vp} ${scheme}: axe serious/critical = 0`, !sc.length, sc.map(v => `${v.id}×${v.n}: ${v.eg[0]}`).slice(0, 3));
    await ctx.close();
  }
  R.axe = rows;
}

/* ---------------- performance: Tokyo Gallery (default) and Atlas ---------------- */
async function perf() {
  const med = a => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
  for (const [label, hash] of [['gallery (default)', ''], ['atlas', '#view=atlas']]) for (const vp of ['mobile', 'desktop']) {
    const w = await open('cities/tokyo.html', vp, { hash, weigh: true, settle: 3500 });
    const bytes = { rawKB: Math.round(w.st.raw / 1024), gzipKB: Math.round(w.st.gz / 1024), requests: w.st.urls.length, leaflet: w.st.urls.some(u => /leaflet\.js/.test(u)) };
    await w.ctx.close();
    const fcps = [];
    for (let i = 0; i < 3; i++) {
      const ctx = await browser.newContext({ ...VP[vp], serviceWorkers: 'block' }); const page = await ctx.newPage();
      const origin = new URL(base).origin;
      await ctx.route('**/*', r => { const u = r.request().url(); if (u.startsWith(origin) || u.startsWith('data:')) return r.continue(); if (r.request().resourceType() === 'image') return r.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }); return r.abort(); });
      const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await page.goto(base + 'beta/cities/tokyo.html' + hash, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(500);
      fcps.push(Math.round(await page.evaluate(() => { const e = performance.getEntriesByName('first-contentful-paint')[0]; return e ? e.startTime : -1; })));
      await ctx.close();
    }
    const m = med(fcps);
    R.info['perf ' + label + ' ' + vp] = { ...bytes, fcp4x: fcps, median: m };
    if (vp === 'mobile') {
      if (label.startsWith('gallery')) check('perf', `Tokyo ${label} ${vp}: transfer ≤ 2.0 MB and FCP at 4× ≤ 1.0 s (median of 3)`, w.st.raw <= 2.0 * 1024 * 1024 && m <= 1000, { ...bytes, fcp4x: fcps });
      else check('perf', `Tokyo ${label} ${vp}: transfer and FCP at 4× (recorded; same budget applied)`, w.st.raw <= 2.0 * 1024 * 1024 && m <= 1000, { ...bytes, fcp4x: fcps });
    } else check('perf', `Tokyo ${label} ${vp} (info)`, null, { ...bytes, fcp4x: fcps });
  }
}

(async () => {
  const { chromium } = loadPlaywright();
  try { browser = await chromium.launch(); } catch (e) { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const srv = await serve(); base = 'http://127.0.0.1:' + srv.address().port + '/';
  try { R.head = require('child_process').execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch (e) { /* no git */ }
  for (const rel of PILOTS) {
    console.log(`\n# ${rel}`);
    if (want('phone')) await phone(rel).catch(e => check('phone', rel + ': probe crashed', false, String(e.message).slice(0, 200)));
    if (want('desktop')) await desktop(rel).catch(e => check('desktop', rel + ': probe crashed', false, String(e.message).slice(0, 200)));
    if (want('reach')) await reach(rel).catch(e => check('reach', rel + ': probe crashed', false, String(e.message).slice(0, 200)));
    if (want('nocdn')) await nocdn(rel).catch(e => check('nocdn', rel + ': probe crashed', false, String(e.message).slice(0, 200)));
    if (want('focus')) await focus(rel).catch(e => check('focus', rel + ': probe crashed', false, String(e.message).slice(0, 200)));
  }
  if (want('phone') || want('desktop')) {
    const hosts = Object.keys(TILES);
    check('tiles', 'every tile request went to OSM or Esri', hosts.length > 0 && hosts.every(h => TILE_OK.has(h)), TILES);
  }
  if (want('type')) { console.log('\n# type'); await type().catch(e => check('type', 'probe crashed', false, String(e.stack).slice(0, 300))); }
  if (want('axe')) { console.log('\n# axe, four views'); await axe().catch(e => check('axe', 'probe crashed', false, String(e.message).slice(0, 200))); }
  if (want('perf')) { console.log('\n# perf'); await perf().catch(e => check('perf', 'probe crashed', false, String(e.message).slice(0, 200))); }
  await browser.close(); srv.close();
  const fails = R.checks.filter(c => c.ok === false).length, graded = R.checks.filter(c => c.ok !== null).length;
  const out = path.join(OUT, ONLY ? 'w6-' + ONLY.join('-') + '.json' : 'w6.json');
  fs.writeFileSync(out, JSON.stringify(R, null, 1));
  console.log(`\n>>> ${graded - fails}/${graded} PASS, ${fails} FAIL on ${R.head} → ${path.relative(ROOT, out)}`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
