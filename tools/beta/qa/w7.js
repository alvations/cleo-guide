#!/usr/bin/env node
/**
 * Beta QA — Wave 7 probe (design/beta/eval/W7-BRIEFS.md incl. Amendment 2; ROUNDS-6-9.md D1–D13). QA lane.
 * Supersedes w6.js for Atlas (the R6 tray it drives is retired). Independent of metrics.js and atlas-ms.js: it measures
 * what a reader can do in Atlas map-search, so the lanes' W7 measurement edits can be ratified against the user outcome.
 * Real Chromium; every off-origin request is blocked (images — tiles included — stubbed 1×1 so tile hosts are recorded).
 *   atlasd   1440×900 #view=atlas: map ≥ 58 % wide, on the left, full height; 2-column card grid; zoom/pan changes the
 *            count, "Show all" restores N, paging by 40 reaches every place; card hover → pin, pin hover → card;
 *            B-07 (W7 rule, below): pin → preview (same place) → detail (Close, Esc, Back stays in Atlas);
 *            OSM attribution visible, readable and clear of every control
 *   atlasm   390×844 #view=atlas: ≥ 70 % of the first screen is map; the city is named on the first screen;
 *            B-07 (W7 rule): real tap on a reachable pin → its card selected and wholly in view in the carousel → tap the
 *            card → detail (Close, Esc, Back stays in Atlas); carousel swipe → its pin selected; List pill → list, Back →
 *            map; OSM attribution visible and clear; B-04 (rail on the first phone screen) recorded
 *   reach    Atlas: #p= opens the detail for EVERY id (view kept), phone + desktop; search by name (25 samples);
 *            "Show all" + "Show 40 more" until the end lists every place exactly once
 *   lens     every landing editorial-rail deep link: the results header total == the promise == the cards a reader can
 *            page through (Show all + pager), and every one of them matches the lens
 *   nocdn    Leaflet blocked: "Map unavailable", every place pageable, a card on screen, 0 JS errors (phone + desktop)
 *   storage  localStorage/sessionStorage throw: Atlas renders, map, base switch, Must see, List pill work, 0 JS errors
 *   cluster  phone, default zoom: drawn .pp ∪ bubble members == pinned places, no overlap, bubble sums match
 *   tiles    every tile request in the run went to tile.openstreetmap.org or server.arcgisonline.com
 *   b08      FE-A's proposed B-08 exemption (.cbar, .mappill): every Gallery title scrolled to reading position (centre)
 *            hit-tests to itself, phone + desktop; and the floaters' size
 *   gallery  closed places stay flagged on the Gallery card although .pl-w/.pl-k/.pl-ad are hidden; "Recommended by"
 *            visible on every on-screen card
 *   detail   place detail: media fills its slot (no letterbox), sticky action bar (Save · Directions · Share) stays on
 *            screen while the detail scrolls, Back and Esc close it
 *   type     the shipped faces (Bricolage Grotesque + Inter) draw every letter on the Vietnam pages, the pilots and the
 *            landing; CJK falls back to a CJK system face; macrons at DPR 1 (18/24 px) in both faces
 *   a11y     axe 4.10 (vendored) on 4 views × 5 pilots × phone/desktop × light/dark, plus the landing and every country
 *            hub; body copy ≥ 16 px; targets ≥ 44 px (inline text links in prose exempt); focus rings on the first 40 stops
 *   perf     D-38, measured independently: first load (no scroll, network idle + 2 s), each URL once, transfer = gzip for
 *            text + images/fonts as sent; desktop 1440 and phone 390@3×; Tokyo Gallery, Tokyo Atlas, landing, Japan hub;
 *            FCP at 4× CPU (median of 3); DOM nodes at first load; tile requests (stubbed) counted for the record
 * Usage: cd tools && node beta/qa/w7.js [--only atlasd,atlasm,…]   Output: design/beta/eval/w7/qa/w7*.json + *.jpg
 *
 * B-07 (W7 map-search rule, QA R7): the map is up (phone: at load in Atlas, or after the map pill elsewhere); the
 * visible map/list control is ≥ 44 × 44; a real tap on a reachable pin (its label hit-tests to itself) shows THAT place —
 * desktop: a preview card on the map naming it; phone: its card selected and wholly on screen in the carousel — and
 * from there one tap opens the place detail with a visible Close; Esc closes it; re-opened, Back closes it and the
 * reader is still in Atlas on the same page. Every step of the W6 rule is kept; the pin → detail path gains one step.
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const OUT = path.join(ROOT, 'design', 'beta', 'eval', 'w7', 'qa');
fs.mkdirSync(OUT, { recursive: true });
const PILOTS = process.env.QA_PILOTS ? process.env.QA_PILOTS.split(',') : ['cleveland.html', 'cities/tokyo.html', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html'];
const VP = {
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  phone3: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
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
const TILES = {};   // host → count, over the whole run
const isTile = u => /\/\d+\/\d+\/\d+(\.png)?$/.test(new URL(u).pathname);
let browser, base;
async function open(rel, vp, o = {}) {
  const ctx = await browser.newContext({ ...VP[vp], serviceWorkers: 'block', reducedMotion: o.motion || 'reduce', colorScheme: o.scheme || 'light', javaScriptEnabled: o.js !== false });
  if (o.noStorage) await ctx.addInitScript(NO_STORAGE);
  if (o.pref) await ctx.addInitScript(v => { try { localStorage.setItem('cleo:v1:view', JSON.stringify(v)); } catch (e) { /* none */ } }, o.pref);
  const page = await ctx.newPage();
  const st = { errors: [], tiles: 0 };
  const origin = new URL(base).origin;
  await ctx.route('**/*', route => {
    const u = route.request().url();
    if (o.noLeaflet && /\/assets\/vendor\/leaflet\//.test(u)) return route.abort('blockedbyclient');
    if (u.startsWith(origin) || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    if (route.request().resourceType() === 'image') {
      const h = new URL(u).host; if (isTile(u)) { TILES[h] = (TILES[h] || 0) + 1; st.tiles++; }
      if (o.noTiles && isTile(u)) return route.abort('blockedbyclient');
      return route.fulfill({ status: 200, contentType: 'image/png', body: PNG1 });
    }
    return route.abort('blockedbyclient');
  });
  page.on('pageerror', e => st.errors.push('pageerror: ' + String(e.message || e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error' && !BLOCKED_NET.test(m.text())) st.errors.push(m.text().slice(0, 200)); });
  page.on('dialog', d => d.accept());
  await page.goto(base + 'beta/' + rel + (o.hash || ''), { waitUntil: 'load', timeout: 60000 });
  if (o.waitMap !== false && /view=atlas/.test(o.hash || '')) await page.waitForFunction(() => document.querySelector('.leaflet-marker-icon') || document.documentElement.classList.contains('ms-nomap'), null, { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(o.settle || 1200);
  await page.evaluate(HELP);
  return { ctx, page, st };
}
const shot = (page, name, clip) => page.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 60, clip }).catch(() => {});
const slug = rel => rel.replace(/\//g, '_').replace('.html', '');

const R = { head: null, checks: [], info: {} };
function check(group, name, ok, evidence) {
  R.checks.push({ group, name, ok: ok === null ? null : !!ok, evidence });
  console.log(`  ${ok === null ? 'INFO' : ok ? 'PASS' : 'FAIL'}  [${group}] ${name}` + (evidence !== undefined ? ' = ' + JSON.stringify(evidence).slice(0, 360) : ''));
}
const DATA = {};
for (const f of fs.readdirSync(path.join(BETA, 'data', 'places'))) { const d = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'places', f), 'utf8')); DATA[d.beta] = d; }
const clean = n => String(n).replace(/\s*[—–-]+\s*CLOSED\b.*$/i, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));

// in-page helpers
const HELP = `(() => {
  window.__R = e => { if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height), b: Math.round(b.bottom), r: Math.round(b.right) }; };
  window.__vis = e => { if (!e || e.closest('[hidden]')) return false; const cs = getComputedStyle(e), b = e.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0 && b.width > 1 && b.height > 1; };
  window.__ring = e => { const cs = getComputedStyle(e); return (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 1) || (cs.boxShadow && cs.boxShadow !== 'none'); };
  window.__C = () => window.Cleo && Cleo.city;
  window.__sheet = () => { const t = document.getElementById('sh-t'), d = t && t.closest('[role=dialog]'); return d && __vis(d) ? { title: t.textContent.trim(), close: !![...d.querySelectorAll('button,a')].find(b => /close|×|✕|back/i.test((b.getAttribute('aria-label') || '') + ' ' + b.textContent) && __vis(b)) } : null; };
  // photo credits on visible cards: never clipped by an ancestor, never squeezed (< 60 px wide), never ellipsised
  window.__capClip = () => { const bad = []; let n = 0; for (const c of document.querySelectorAll('li.pl')) { if (!__vis(c)) continue; const cr = c.getBoundingClientRect(); if (cr.bottom < 0 || cr.top > innerHeight || cr.right < 0 || cr.left > innerWidth) continue;
      for (const cap of c.querySelectorAll('figcaption, .credit')) { if (!__vis(cap)) continue; n++; const r = cap.getBoundingClientRect(); let clip = null;
        for (let e = cap.parentElement; e && e !== document.body && !clip; e = e.parentElement) { const s = getComputedStyle(e); if ((s.overflowX !== 'visible' || s.overflowY !== 'visible') && !/auto|scroll/.test(s.overflowX + s.overflowY)) { /* a scroll pane only scrolls a credit away; a hidden-overflow box cuts it */ const q = e.getBoundingClientRect(); if (r.bottom > q.bottom + 1 || r.right > q.right + 1 || r.top < q.top - 1 || r.left < q.left - 1) clip = e.className.toString().slice(0, 24) + ' ' + Math.round(q.width) + '×' + Math.round(q.height); } }
        if (clip || r.width < 60 || cap.scrollWidth > cap.clientWidth + 1 || cap.scrollHeight > cap.clientHeight + 1) bad.push(c.id.slice(2, 26) + ': ' + Math.round(r.width) + '×' + Math.round(r.height) + (clip ? ' clipped by ' + clip : '')); } }
    return { n, bad }; };
  window.__count = () => { const b = document.querySelector('.ms-head .ms-count b'); return b ? +b.textContent.replace(/[^0-9]/g, '') : null; };
  window.__shown = () => [...document.querySelectorAll('li.pl')].filter(c => !c.hidden && !c.classList.contains('ms-out') && !c.closest('[hidden]') && getComputedStyle(c).display !== 'none');
  // pins a finger can reach: the label box on screen in the band and hit-testing to the pin itself
  window.__pins = (band) => { const C = __C(), out = []; for (const id of Object.keys(C.markers)) { const k = C.markers[id], e = k.getElement && k.getElement(); if (!e || !e.classList.contains('pp')) continue;
      const l = e.firstElementChild || e, r = l.getBoundingClientRect(); if (!r.width || r.left < band.l || r.right > innerWidth - band.r || r.top < band.t || r.bottom > innerHeight - band.b) continue;
      const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!h || !e.contains(h)) continue; out.push({ id, x: r.left + r.width / 2, y: r.top + r.height / 2 }); }
    return out; };
})()`;

/* ---------------- B-07 (W7 rule) shared step: detail from wherever the place is shown, Close/Esc/Back ---------------- */
async function detailFrom(page, openIt, want) {
  const r = {};
  await openIt(); await page.waitForTimeout(800);
  r.open = await page.evaluate(() => __sheet());
  r.same = !!r.open && r.open.title.toLowerCase().includes(want.toLowerCase().split(/\s+/)[0]);
  r.hash1 = await page.evaluate(() => location.hash);
  if (!r.open) return r;
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  r.esc = await page.evaluate(() => !__sheet());
  await openIt(); await page.waitForTimeout(800);
  r.reopen = !!(await page.evaluate(() => __sheet()));
  await page.goBack({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(700);
  r.back = await page.evaluate(() => !__sheet());
  r.stay = await page.evaluate(() => ({ view: document.documentElement.getAttribute('data-view'), url: location.pathname }));
  return r;
}

/* ---------------- Atlas, desktop ---------------- */
async function atlasd(rel) {
  const d = DATA[rel], N = d.places.length;
  const { ctx, page, st } = await open(rel, 'desktop', { hash: '#view=atlas', settle: 1500 });
  const s0 = await page.evaluate(() => { const m = document.getElementById('cleo-map'), r = m.getBoundingClientRect();
    const cards = __shown().filter(c => __vis(c)).slice(0, 8), cols = new Set(cards.map(c => Math.round(c.getBoundingClientRect().left))).size;
    return { mapW: Math.round(r.width / innerWidth * 100), left: Math.round(r.left), top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight, cols, count: __count(), head: (document.querySelector('.ms-count') || {}).textContent, more: (document.querySelector('.ms-more') || {}).textContent, scrollH: document.documentElement.scrollHeight }; });
  check('atlasd', `${rel}: map ≥ 58 % wide, on the left, to the bottom of the screen`, s0.mapW >= 58 && s0.left <= 1 && s0.bottom >= s0.vh - 2, s0);
  check('atlasd', `${rel}: the list is a 2-column card grid`, s0.cols === 2, s0.cols);
  const capD = await page.evaluate(() => __capClip());
  check('atlasd', `${rel}: photo credits on the grid cards are whole`, !capD.bad.length, capD);
  await shot(page, 'atlas-1440-' + slug(rel));
  // search as I move the map: zoom in → fewer, "more outside" + Show all → N
  const z = await page.evaluate(async () => { const m = __C().map(); const v = [m.getCenter(), m.getZoom()]; m.setZoom(m.getZoom() + 2, { animate: false }); await new Promise(r => setTimeout(r, 900)); const a = __count();
    const s = m.getSize(); m.panBy([s.x * 0.4, s.y * 0.3], { animate: false }); await new Promise(r => setTimeout(r, 900)); const b = __count(), more = (document.querySelector('.ms-more') || {}).textContent;
    m.setView(v[0], v[1], { animate: false }); await new Promise(r => setTimeout(r, 900)); return { a, b, more, c: __count() }; });
  // SPEC-v3 rev 4 §2.3 (Atlas FE-1; QA ratified 2026-10-16): the "N more outside" line may give way to a "Show all <N>"
  // control; either says more places exist outside the area, one tap away. Accepted only when the Show-all total exceeds
  // the area count shown (so it really signals places outside), and the count must still change on zoom and pan.
  const allN = s => { const m = /Show all ([\d,]+)/.exec(s || ''); return m ? +m[1].replace(/,/g, '') : null; };
  const moreSignal = /more outside/.test(z.more || '') || (allN(z.more) != null && allN(z.more) > z.b);
  check('atlasd', `${rel}: zoom/pan changes the count; "N more outside" or "Show all <N > shown>" offered`, z.a !== s0.count && z.b !== z.a && moreSignal, { first: s0.count, zoomed: z.a, panned: z.b, more: z.more });
  // Show all + paging: every place, once
  const pg = await page.evaluate(async () => { const all = document.querySelector('.ms-more [data-ms="all"]'); if (all) all.click(); await new Promise(r => setTimeout(r, 500));
    const head = (document.querySelector('.ms-count') || {}).textContent; let clicks = 0;
    for (; clicks < 60; clicks++) { const b = document.querySelector('.ms-pager:not([hidden]) button'); if (!b) break; b.click(); await new Promise(r => setTimeout(r, 120)); }
    const ids = __shown().map(c => c.id); return { head, clicks, n: ids.length, uniq: new Set(ids).size }; });
  check('atlasd', `${rel}: "Show all" + "Show 40 more" lists every place once (${N})`, pg.n === N && pg.uniq === N && new RegExp(N.toLocaleString('en-US')).test(pg.head), pg);
  await page.evaluate(async () => { const a = document.querySelector('.ms-more [data-ms="area"]'); if (a) a.click(); await new Promise(r => setTimeout(r, 500)); });
  // hover sync both ways (real mouse)
  const band = { l: 60, r: 0, t: 200, b: 80 };
  let pins = await page.evaluate(b => __pins(b).filter(p => p.x < innerWidth * 0.55), band);
  for (let i = 0; i < 3 && pins.length < 3; i++) { await page.evaluate(async () => { const m = __C().map(); m.setZoom(m.getZoom() + 1, { animate: false }); await new Promise(r => setTimeout(r, 800)); }); pins = await page.evaluate(b => __pins(b).filter(p => p.x < innerWidth * 0.55), band); }
  let p2c = null, b07 = null;
  if (pins.length) {
    const p = pins[Math.floor(pins.length / 2)];
    await page.mouse.move(p.x, p.y); await page.waitForTimeout(250);
    p2c = await page.evaluate(id => { const c = document.getElementById('p-' + id); return !!c && (c.classList.contains('is-hover') || c.classList.contains('hot')); }, p.id);
    await page.mouse.click(p.x, p.y); await page.waitForTimeout(900);
    const pv = await page.evaluate(id => { const po = document.getElementById('cleo-poi'), c = document.getElementById('p-' + id), lp = document.querySelector('.listpane').getBoundingClientRect(), r = c && c.getBoundingClientRect();
      return { open: !!po && !po.hidden && po.offsetHeight > 60, name: po && (po.querySelector('.ms-pv-n') || {}).textContent, want: c && c.querySelector('.pl-n').textContent.trim(), sel: !!c && c.classList.contains('is-sel'),
        cardInView: !!r && r.top >= lp.top - 2 && r.bottom <= lp.bottom + 2, scrollY: Math.round(scrollY) }; }, p.id);
    await shot(page, 'atlas-1440-preview-' + slug(rel));
    const want = clean(pv.want || '');
    const viaPreview = async () => { if (!(await page.evaluate(() => { const po = document.getElementById('cleo-poi'); return !!po && !po.hidden; }))) {
        // the pin again, wherever the map left it (the detail centres the map on its place)
        const q = await page.evaluate(id => { const e = __C().markers[id].getElement(), l = e && (e.firstElementChild || e), r = l && l.getBoundingClientRect(); return r && r.width ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, p.id);
        if (q) { await page.mouse.click(q.x, q.y); await page.waitForTimeout(800); } }
      await page.click('#cleo-poi a.ms-pv', { timeout: 3000 }).catch(() => {}); };
    b07 = { pv, d: pv.open ? await detailFrom(page, viaPreview, want) : null };
    if (b07.d && b07.d.open) await shot(page, 'atlas-1440-detail-' + slug(rel));
  }
  check('atlasd', `${rel}: hovering a pin lights its card (real mouse)`, p2c === true, p2c);
  const pv = b07 && b07.pv, dd = b07 && b07.d;
  check('atlasd', `${rel}: pin → its card in view in the list pane, the page never scrolls`, !!pv && pv.sel && pv.cardInView && pv.scrollY === 0, pv);
  check('atlasd', `${rel}: B-07 (W7) pin → preview naming the place → detail (Close) → Esc closes → Back closes, still in Atlas`,
    !!pv && pv.open && clean(pv.want || '') && (pv.name || '').includes(clean(pv.want || '').slice(0, 12)) && dd && dd.open && dd.open.close && dd.same && dd.esc && dd.reopen && dd.back && dd.stay.view === 'atlas', { pv: pv && [pv.open, pv.name], dd });
  await page.evaluate(() => { location.hash = '#view=atlas'; window.scrollTo(0, 0); }); await page.waitForTimeout(600);
  // a card whose pin (or the bubble holding it) is on the map; scrolled into the list pane's view, then a real mouse over its name
  const card = await page.evaluate(() => { const C = __C(), el = x => C.pinEl(x) || (C.inCl[x.id.slice(2)] && C.inCl[x.id.slice(2)].getElement && C.inCl[x.id.slice(2)].getElement());
    const c = __shown().find(x => __vis(x) && el(x)); if (!c) return null; const lp = document.querySelector('.listpane'); lp.scrollTop += c.getBoundingClientRect().top - lp.getBoundingClientRect().top - lp.clientHeight / 2; window.scrollTo(0, 0); const r = c.querySelector('.pl-n').getBoundingClientRect(); return { id: c.id, x: r.left + 10, y: r.top + r.height / 2 }; });
  let c2p = null;
  if (card) { await page.mouse.move(card.x, card.y); await page.waitForTimeout(250); c2p = await page.evaluate(id => { const C = __C(), x = document.getElementById(id), e = C.pinEl(x) || (C.inCl[id.slice(2)] && C.inCl[id.slice(2)].getElement()); return !!e && e.classList.contains('hot'); }, card.id); await page.mouse.move(5, 5); }
  check('atlasd', `${rel}: hovering a card lights its pin (real mouse)`, c2p === true, { card: card && card.id, c2p });
  // OSM attribution: visible, readable and clear of every control
  const att = await page.evaluate(() => { const a = document.querySelector('.leaflet-control-attribution'); if (!a || !__vis(a)) return null; const r = a.getBoundingClientRect(), cs = getComputedStyle(a);
    const hitOwn = [[r.left + 4, r.top + r.height / 2], [r.right - 4, r.top + r.height / 2]].every(([x, y]) => { const h = document.elementFromPoint(x, y); return !!h && a.contains(h); });
    const others = [...document.querySelectorAll('.leaflet-control, .ms-toggle, .mappill, #cleo-poi, .ms-here, .ms-bar')].filter(e => e !== a && !e.contains(a) && __vis(e)).filter(e => { const b = e.getBoundingClientRect(); return !(b.right <= r.left || b.left >= r.right || b.bottom <= r.top || b.top >= r.bottom); }).map(e => e.className.toString().slice(0, 30));
    return { text: a.textContent.trim().slice(0, 60), osm: /OpenStreetMap/.test(a.textContent), px: parseFloat(cs.fontSize), box: __R(a), hitOwn, overlaps: others }; });
  check('atlasd', `${rel}: OSM attribution visible, ≥ 12 px, not covered, clear of every control`, !!att && att.osm && att.px >= 12 && att.hitOwn && !att.overlaps.length, att);
  check('atlasd', `${rel}: 0 JS errors`, !st.errors.length, st.errors.slice(0, 3));
  await ctx.close();
}

/* ---------------- Atlas, phone ---------------- */
async function atlasm(rel) {
  const d = DATA[rel], N = d.places.length;
  const { ctx, page, st } = await open(rel, 'mobile', { hash: '#view=atlas', settle: 1500 });
  const s0 = await page.evaluate(name => {
    const m = document.getElementById('cleo-map'), mr = m.getBoundingClientRect(), bar = document.querySelector('.ms-bar'), lp = document.querySelector('.listpane');
    const top = Math.max(mr.top, bar && __vis(bar) ? bar.getBoundingClientRect().bottom : 0, document.querySelector('.sitebar, header') ? document.querySelector('.sitebar, header').getBoundingClientRect().bottom : 0);
    const bot = Math.min(mr.bottom, innerHeight, lp && __vis(lp) ? lp.getBoundingClientRect().top : innerHeight);
    // the city named on the first screen: any visible text node on screen that holds the city name
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n, named = null;
    while ((n = w.nextNode())) { const p = n.parentElement; if (!p || !n.textContent.includes(name) || !__vis(p) || p.closest('[aria-hidden=true], .leaflet-container')) continue; const r = p.getBoundingClientRect(); if (r.top >= 0 && r.bottom <= innerHeight) { named = p.tagName + '.' + p.className.toString().slice(0, 20) + ': ' + p.textContent.trim().slice(0, 40); break; } }
    const rail = document.getElementById('cleo-rail'), rr = rail && __vis(rail) ? rail.getBoundingClientRect() : null;
    const tog = document.querySelector('.ms-toggle'), tr = tog && __vis(tog) ? tog.getBoundingClientRect() : null;
    return { mapBox: Math.round((Math.min(mr.bottom, innerHeight) - Math.max(mr.top, 0)) * mr.width / (innerWidth * innerHeight) * 100), mapClear: Math.round((bot - top) * mr.width / (innerWidth * innerHeight) * 100), named,
      railOnScreen: !!rr && rr.top < innerHeight && rr.bottom > 0, toggle: tr && [Math.round(tr.width), Math.round(tr.height), tog.textContent.trim()], overflowX: document.documentElement.scrollWidth - innerWidth }; }, d.name);
  check('atlasm', `${rel}: ≥ 70 % of the first screen is map (box), and the uncovered map share recorded`, s0.mapBox >= 70, { box: s0.mapBox, clear: s0.mapClear });
  check('atlasm', `${rel}: the city ("${d.name}") is named on the first screen`, !!s0.named, s0.named);
  const capM = await page.evaluate(() => __capClip());
  check('atlasm', `${rel}: photo credits on the carousel cards are whole (not clipped, squeezed or ellipsised)`, !capM.bad.length, capM);
  check('atlasm', `${rel}: List pill ≥ 44 × 44, no horizontal overflow`, !!s0.toggle && s0.toggle[0] >= 44 && s0.toggle[1] >= 44 && s0.overflowX <= 0, s0.toggle);
  check('atlasm', `${rel}: B-04 rail on the first phone screen (Atlas; D-36 by design) — recorded`, null, s0.railOnScreen);
  await shot(page, 'atlas-390-' + slug(rel));
  // B-07 (W7): real tap on a reachable pin → its card selected + wholly on screen → tap → detail → Esc → Back
  const band = { l: 16, r: 16, t: 170, b: 260 };
  let pins = await page.evaluate(b => __pins(b), band), tries = 0;
  while (!pins.length && tries++ < 4) {   // all clustered: a real tap on a bubble zooms in
    const bub = await page.evaluate(b => { const e = [...document.querySelectorAll('.leaflet-marker-icon.pin-cl')].map(x => [x, x.getBoundingClientRect()]).find(([x, r]) => r.top > b.t && r.bottom < innerHeight - b.b && r.left > b.l && r.right < innerWidth - b.r); return e ? { x: e[1].left + e[1].width / 2, y: e[1].top + e[1].height / 2 } : null; }, band);
    if (!bub) break; await page.touchscreen.tap(bub.x, bub.y); await page.waitForTimeout(1200); pins = await page.evaluate(b => __pins(b), band);
  }
  let b07 = null;
  if (pins.length) {
    const p = pins[Math.floor(pins.length / 2)];
    await page.touchscreen.tap(p.x, p.y); await page.waitForTimeout(1000);
    const car = await page.evaluate(id => { const c = document.getElementById('p-' + id), r = c && c.getBoundingClientRect(), sel = document.querySelectorAll('li.pl.is-sel');
      const pe = __C().pinEl(c);
      return { sel: !!c && c.classList.contains('is-sel'), nSel: sel.length, inView: !!r && r.left >= -1 && r.right <= innerWidth + 1 && r.top >= 0 && r.bottom <= innerHeight + 1, r: __R(c), pinSel: !!pe && pe.classList.contains('sel'), want: c && c.querySelector('.pl-n').textContent.trim(), sheet: !!__sheet() }; }, p.id);
    await shot(page, 'atlas-390-pin-' + slug(rel));
    const want = clean(car.want || '');
    const tapCard = async () => { const b = await page.evaluate(id => { const a = document.querySelector('#p-' + id + ' .pl-n a'); if (!a) return null; const r = a.getBoundingClientRect(); return { x: r.left + Math.min(20, r.width / 2), y: r.top + r.height / 2 }; }, p.id); if (b) await page.touchscreen.tap(b.x, b.y); };
    b07 = { pin: p.id, car, d: car.sel ? await detailFrom(page, tapCard, want) : null };
    if (b07.d && b07.d.open) { await tapCard(); await page.waitForTimeout(700); await shot(page, 'detail-390-' + slug(rel)); await page.goBack().catch(() => {}); await page.waitForTimeout(600); }
  }
  const car = b07 && b07.car, dd = b07 && b07.d;
  check('atlasm', `${rel}: B-07 (W7) real pin tap → its card selected, wholly on screen in the carousel, pin marked`, !!car && car.sel && car.nSel === 1 && car.inView && car.pinSel && !car.sheet, b07 ? { pin: b07.pin, ...car } : 'no reachable pin');
  check('atlasm', `${rel}: B-07 (W7) … card → detail (Close) → Esc closes → Back closes, still in Atlas`, !!dd && dd.open && dd.open.close && dd.same && dd.esc && dd.reopen && dd.back && dd.stay.view === 'atlas', dd);
  // swipe the carousel: the card in the middle becomes the selection and its pin lights
  const sw = await page.evaluate(async () => { const lp = document.querySelector('.listpane'), cs = [...lp.querySelectorAll('li.pl')].filter(c => __vis(c)); if (cs.length < 4) return { n: cs.length };
    const c = cs[3]; lp.scrollTo({ left: c.offsetLeft - (lp.clientWidth - c.offsetWidth) / 2 }); lp.dispatchEvent(new Event('scroll')); await new Promise(r => setTimeout(r, 1200));
    const e = __C().pinEl(c), cl = __C().inCl && __C().inCl[c.id.slice(2)], ce = cl && cl.getElement && cl.getElement();
    return { id: c.id, sel: c.classList.contains('is-sel'), pin: !!e && e.classList.contains('sel'), bubble: !!ce && ce.classList.contains('sel') }; });
  check('atlasm', `${rel}: swiping the carousel selects the centred card and marks its pin (or its bubble)`, sw.sel && (sw.pin || sw.bubble), sw);
  // List ⇄ Map
  const lm = {};
  await page.click('.ms-toggle').catch(e => { lm.err = e.message.slice(0, 60); }); await page.waitForTimeout(700);
  Object.assign(lm, await page.evaluate(() => ({ list: document.documentElement.classList.contains('ms-list'), cards: __shown().filter(c => __vis(c)).length, w7: document.querySelector('.listpane').classList.contains('w7-cards'), tog: document.querySelector('.ms-toggle').textContent.trim() })));
  await shot(page, 'atlas-390-list-' + slug(rel));
  const capL = await page.evaluate(() => __capClip());
  check('atlasm', `${rel}: photo credits in the phone list are whole`, !capL.bad.length, capL);
  await page.goBack().catch(() => {}); await page.waitForTimeout(700);
  lm.back = await page.evaluate(() => ({ list: document.documentElement.classList.contains('ms-list'), view: document.documentElement.getAttribute('data-view'), url: location.pathname }));
  check('atlasm', `${rel}: List pill → image-first list; Back → the map, still in Atlas`, lm.list && lm.cards > 0 && lm.w7 && !lm.back.list && lm.back.view === 'atlas', lm);
  // OSM attribution
  const att = await page.evaluate(() => { const a = document.querySelector('.leaflet-control-attribution'); if (!a || !__vis(a)) return null; const r = a.getBoundingClientRect(), cs = getComputedStyle(a);
    const hitOwn = [[r.left + 4, r.top + r.height / 2], [r.right - 4, r.top + r.height / 2]].every(([x, y]) => { const h = document.elementFromPoint(x, y); return !!h && a.contains(h); });
    const others = [...document.querySelectorAll('.leaflet-control, .ms-toggle, .ms-bar, .listpane, .ms-here, .cbar')].filter(e => e !== a && !e.contains(a) && __vis(e)).filter(e => { const b = e.getBoundingClientRect(); return !(b.right <= r.left || b.left >= r.right || b.bottom <= r.top || b.top >= r.bottom); }).map(e => e.className.toString().slice(0, 30));
    return { text: a.textContent.trim().slice(0, 60), osm: /OpenStreetMap/.test(a.textContent), px: parseFloat(cs.fontSize), box: __R(a), onScreen: r.top >= 0 && r.bottom <= innerHeight, hitOwn, overlaps: others }; });
  check('atlasm', `${rel}: OSM attribution visible, ≥ 12 px, not covered, clear of every control`, !!att && att.osm && att.onScreen && att.px >= 12 && att.hitOwn && !att.overlaps.length, att);
  check('atlasm', `${rel}: 0 JS errors`, !st.errors.length, st.errors.slice(0, 3));
  await ctx.close();
}

/* ---------------- cluster partition (phone, default zoom) ---------------- */
async function cluster(rel) {
  const { ctx, page } = await open(rel, 'mobile', { hash: '#view=atlas', settle: 1500 });
  const r = await page.evaluate(() => { const C = __C(), map = C.map(); if (!map) return null; const ids = Object.keys(C.markers).filter(id => { const c = C.byId[id] || (C.stub && C.stub(id)); return c && !c.hidden; });
    const drawn = ids.filter(id => map.hasLayer(C.markers[id])), inCl = ids.filter(id => C.inCl[id]);
    const overlap = drawn.filter(id => C.inCl[id]).length, lost = ids.filter(id => !map.hasLayer(C.markers[id]) && !C.inCl[id]).length;
    const bub = [...document.querySelectorAll('.leaflet-marker-icon.pin-cl')].reduce((t, b) => t + +b.textContent, 0);
    return { pinned: ids.length, drawn: drawn.length, clustered: inCl.length, overlap, lost, bubbleSum: bub, zoom: map.getZoom(), ppDom: document.querySelectorAll('.leaflet-marker-icon.pp').length }; });
  check('cluster', `${rel}: phone default zoom — drawn ∪ clustered == pinned, overlap 0, lost 0, bubble sum == clustered, .pp DOM == drawn`, !!r && r.drawn + r.clustered === r.pinned && !r.overlap && !r.lost && r.bubbleSum === r.clustered && r.ppDom === r.drawn, r);
  await ctx.close();
}

/* ---------------- reachability in Atlas ---------------- */
async function reach(rel) {
  const d = DATA[rel], N = d.places.length;
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page, st } = await open(rel, vp, { hash: '#view=atlas', settle: 1500 });
    const miss = await page.evaluate(async list => { const bad = [];
      for (const p of list) { location.hash = '#view=atlas&p=' + encodeURIComponent(p.id); await new Promise(r => setTimeout(r, 70));
        const s = __sheet(), w = p.n.split(/\s+/)[0].toLowerCase();
        if (!s || !s.title.toLowerCase().includes(w) || document.documentElement.getAttribute('data-view') !== 'atlas') bad.push(p.id); }
      return bad; }, d.places.map(p => ({ id: p.id, n: clean(p.n) })));
    check('reach', `${rel} ${vp}: Atlas #p= opens the detail for every one of ${N} places, Atlas kept`, !miss.length, { missing: miss.length, e: miss.slice(0, 4), err: st.errors.slice(0, 2) });
    await ctx.close();
    const { ctx: c2, page: p2, st: s2 } = await open(rel, vp, { hash: '#view=atlas', settle: 1500 });
    const step = Math.max(1, Math.floor(N / 25)), sample = d.places.filter((p, i) => i % step === 0).slice(0, 25), bad = [];
    if (vp === 'mobile') { await p2.click('.ms-bar .spill, .spill').catch(() => {}); await p2.waitForTimeout(300); }
    const box = p2.locator('#cleo-filter').first();
    if (!(await box.count())) bad.push('no #cleo-filter');
    else for (const p of sample) { await box.fill(clean(p.n)).catch(e => bad.push('fill ' + e.message.slice(0, 40)));
      // listed = on the list's first page (not paged away), polled up to 3 s (the search index loads on first focus)
      const ok = await p2.waitForFunction(id => { const c = document.getElementById('p-' + id); return !!c && !c.hidden && !c.closest('[hidden]') && !c.classList.contains('ms-out'); }, p.id, { timeout: 3000 }).then(() => true).catch(() => false); if (!ok) bad.push(p.id); }
    check('reach', `${rel} ${vp}: search by name lists the place (${sample.length} samples)`, !bad.length, { bad: bad.slice(0, 5), err: s2.errors.slice(0, 2) });
    await c2.close();
  }
}

/* ---------------- lens deep links (landing editorial rail) ---------------- */
async function lens() {
  const land = fs.readFileSync(path.join(BETA, 'index.html'), 'utf8');
  const links = [...land.matchAll(/<span class="theme-c">([\s\S]*?)<\/span><\/li>/g)].flatMap(m => [...m[1].matchAll(/<a href="([^"]+)">[^<]*<b>(\d+)<\/b><\/a>/g)].map(x => [x[1], +x[2]]));
  const hubLinks = [];
  for (const f of ['Japan', 'Singapore', 'Germany', 'Belgium'].map(k => k + '/index.html')) { const p = path.join(BETA, f); if (!fs.existsSync(p)) continue; const h = fs.readFileSync(p, 'utf8');
    for (const m of h.matchAll(/<a[^>]+href="([^"]+#[^"]*view=atlas[^"]*)"[^>]*>[\s\S]{0,300}?<b>(\d+)<\/b>/g)) hubLinks.push([path.posix.join(path.posix.dirname(f), m[1]), +m[2]]); }
  const all = links.concat(hubLinks), bad = [], rows = [];
  // each link three ways: as shared (default view), for a reader whose remembered view is Atlas, and with view=atlas
  for (const [href, n] of all) for (const how of ['default', 'pref-atlas', 'hash-atlas']) {
    const [rel, hash] = href.split('#');
    const { ctx, page, st } = await open(path.posix.normalize(rel), 'desktop', { hash: '#' + hash + (how === 'hash-atlas' ? '&view=atlas' : ''), pref: how === 'pref-atlas' ? 'atlas' : null, settle: 1500 });
    const r = await page.evaluate(async () => { const hd = __count(), view = document.documentElement.getAttribute('data-view');
      const a = document.querySelector('.ms-more [data-ms="all"]'); if (a) a.click(); const g = document.querySelector('.g-pager [data-pg="all"]'); if (g && __vis(g)) g.click(); await new Promise(r => setTimeout(r, 500));
      for (let i = 0; i < 60; i++) { const b = document.querySelector('.ms-pager:not([hidden]) button'); if (!b) break; b.click(); await new Promise(r => setTimeout(r, 120)); }
      const shown = __shown().filter(c => !c.closest('.rail, .g-row, [data-cleo-rail]')); return { view, header: hd, paged: shown.length, uniq: new Set(shown.map(c => c.id)).size }; });
    rows.push({ href, how, promised: n, ...r, err: st.errors.length });
    const ok = r.view === 'atlas' ? r.header === n && r.paged === n && r.uniq === n : r.paged === n;
    if (!ok || st.errors.length) bad.push({ href, how, promised: n, ...r, errors: st.errors.slice(0, 1) });
    await ctx.close();
  }
  R.info.lens = rows;
  check('lens', `${all.length} lens deep links (landing rail + hubs) × default / remembered Atlas / view=atlas: Atlas header total == promise == cards a reader can page through; elsewhere cards == promise`, all.length > 0 && !bad.length, { bad: bad.length, eg: bad.slice(0, 5), atlasRows: rows.filter(r => r.view === 'atlas').length });
}

/* ---------------- no map library / no storage ---------------- */
async function nocdn(rel) {
  const N = DATA[rel].places.length;
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page, st } = await open(rel, vp, { hash: '#view=atlas', settle: 2500, noLeaflet: true });
    const s = await page.evaluate(async () => {
      const note = document.querySelector('.ms-nomap-n'), first = __shown().find(c => __vis(c) && c.getBoundingClientRect().top < innerHeight && c.getBoundingClientRect().bottom > 0);
      for (let i = 0; i < 60; i++) { const b = document.querySelector('.ms-pager:not([hidden]) button'); if (!b) break; b.click(); await new Promise(r => setTimeout(r, 120)); }
      return { leaflet: !!document.querySelector('.leaflet-pane'), view: document.documentElement.getAttribute('data-view'), note: note && __vis(note) ? note.textContent.trim().slice(0, 60) : null,
        first: first ? first.querySelector('.pl-n').textContent.trim().slice(0, 30) : null, paged: __shown().length }; });
    check('nocdn', `${rel} ${vp}: Leaflet blocked — "Map unavailable", a card on screen, every place pageable (${N}), 0 JS errors`, !s.leaflet && s.view === 'atlas' && !!s.note && !!s.first && s.paged === N && !st.errors.length, { ...s, err: st.errors.slice(0, 2) });
    if (rel === 'cities/tokyo.html') await shot(page, 'nocdn-' + vp + '-' + slug(rel));
    await ctx.close();
  }
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page, st } = await open(rel, vp, { hash: '#view=atlas', settle: 2000, noStorage: true });
    const s0 = await page.evaluate(() => ({ view: document.documentElement.getAttribute('data-view'), leaflet: !!document.querySelector('.leaflet-pane'), count: __count() }));
    const acts = [];
    for (const sel of ['.m-base', '.ms-must', vp === 'mobile' ? '.ms-toggle' : null]) { if (!sel) continue; const l = page.locator(sel).first(); if (await l.count()) { await l.click({ timeout: 3000 }).then(() => acts.push(sel)).catch(e => acts.push(sel + ' ✗ ' + e.message.slice(0, 40))); await page.waitForTimeout(600); } else acts.push(sel + ' missing'); }
    const s1 = await page.evaluate(() => ({ hash: location.hash, base: (document.querySelector('.m-base') || {}).getAttribute && document.querySelector('.m-base').getAttribute('aria-label'), list: document.documentElement.classList.contains('ms-list') }));
    check('storage', `${rel} ${vp}: storage throws — Atlas + map render, base switch, Must see${vp === 'mobile' ? ', List pill' : ''} work, 0 JS errors`, s0.view === 'atlas' && s0.leaflet && /t=1/.test(s1.hash) && /Satellite/.test(s1.base || '') && (vp !== 'mobile' || s1.list) && !acts.some(a => /✗|missing/.test(a)) && !st.errors.length, { ...s0, ...s1, acts, err: st.errors.slice(0, 2) });
    await ctx.close();
  }
}

/* ---------------- B-08 proposal: titles under .cbar / .mappill ---------------- */
async function b08(rel) {
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page } = await open(rel, vp, { settle: 1500 });
    const r = await page.evaluate(async () => {
      const fl = ['.cbar', '.mappill'].map(s => document.querySelector(s)).filter(e => e && __vis(e)).map(e => ({ cls: e.className.toString().slice(0, 20), pos: getComputedStyle(e).position, h: Math.round(e.getBoundingClientRect().height), w: Math.round(e.getBoundingClientRect().width) }));
      const ts = [...document.querySelectorAll('li.pl .pl-n')].filter(t => __vis(t)); const step = Math.max(1, Math.floor(ts.length / 30)); let seen = 0; const cov = [];
      for (let i = 0; i < ts.length; i += step) { const t = ts[i]; t.scrollIntoView({ block: 'center' }); await new Promise(r => requestAnimationFrame(() => r())); const b = t.getBoundingClientRect(); if (b.right < 0 || b.left > innerWidth || b.bottom < 0 || b.top > innerHeight) continue; /* a sideways rail card off screen: not at reading position */ const h = document.elementFromPoint(b.left + Math.min(12, b.width / 2), b.top + b.height / 2); seen++; if (!h || !(t.contains(h) || h.contains(t))) cov.push((h ? h.className.toString().slice(0, 24) : 'none') + ' over ' + t.textContent.trim().slice(0, 24)); }
      // and at the top edge (just below the sticky bars): a title scrolled under the bar is only "passing", like the site header
      const bars = [...document.querySelectorAll('header, .sitebar, .cbar')].filter(e => __vis(e) && /sticky|fixed/.test(getComputedStyle(e).position)).map(e => e.getBoundingClientRect().bottom), topEdge = Math.max(0, ...bars);
      return { floaters: fl, seen, covered: cov.length, eg: cov.slice(0, 3), stickyBottom: Math.round(topEdge) }; });
    check('b08', `${rel} ${vp}: every sampled Gallery title at reading position (centre) is uncovered; floaters ${JSON.stringify(r.floaters)}`, r.seen > 0 && !r.covered, r);
    await ctx.close();
  }
}

/* ---------------- Gallery card: closures + attribution with the hidden lines ---------------- */
async function gallery(rel) {
  const d = DATA[rel], closed = d.places.filter(p => /CLOSED/i.test(p.n)).map(p => p.id);
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page } = await open(rel, vp, { settle: 1500 });
    const r = await page.evaluate(async ids => {
      const all = document.querySelector('.g-pager [data-pg="all"]'); if (all) { all.click(); await new Promise(r => setTimeout(r, 400)); }
      const vc = [...document.querySelectorAll('li.pl')].filter(c => __vis(c));
      const noRec = vc.filter(c => { const s = c.querySelector('.pl-s'); return !(s && __vis(s) && /recommended by|added by/i.test(s.textContent)); }).map(c => c.id).slice(0, 5);
      const cl = [];
      for (const id of ids) { location.hash = '#view=gallery&p=' + id; await new Promise(r => setTimeout(r, 500)); history.back(); await new Promise(r => setTimeout(r, 500));
        const c = document.getElementById('p-' + id); if (c) { c.scrollIntoView({ block: 'center' }); await new Promise(r => setTimeout(r, 200)); }
        cl.push({ id, shown: !!c && __vis(c), visibleClosed: !!c && /closed/i.test(c.innerText) }); }
      const hiddenLines = ['.pl-w', '.pl-k', '.pl-ad'].map(s => { const e = document.querySelector('li.pl ' + s); return s + ':' + (e ? (__vis(e) ? 'shown' : 'in DOM, hidden') : 'absent'); });
      return { cards: vc.length, noRec, closed: cl, hiddenLines }; }, closed);
    check('gallery', `${rel} ${vp}: every visible Gallery card shows "Recommended by"/"Added by"; every closed place reads "Closed" on its card`, r.cards > 0 && !r.noRec.length && r.closed.every(c => c.visibleClosed), r);
    await ctx.close();
  }
}

/* ---------------- place detail: media, sticky action bar, Back/Esc ---------------- */
async function detail(rel) {
  const d = DATA[rel];
  const ph = JSON.parse(fs.readFileSync(path.join(BETA, 'assets/img/CREDITS.json'), 'utf8')).credits.filter(c => c.record && (c.record.page === d.key || c.record.page === rel.replace('.html', '').replace('cities/', ''))).map(c => c.record.id);
  const id = ph[0] || d.places[0].id;
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page } = await open(rel, vp, { hash: '#p=' + id, settle: 1800 });
    await shot(page, 'detail-' + (vp === 'desktop' ? '1440-' : '390-') + slug(rel));
    const r = await page.evaluate(async () => {
      const t = document.getElementById('sh-t'), dlg = t && t.closest('[role=dialog]'); if (!dlg) return null;
      const img = dlg.querySelector('.hero-plate img, figure img'), ir = img && img.getBoundingClientRect(), slot = img && (img.closest('.hero-plate') || img.parentElement).getBoundingClientRect();
      const srcW = img && +((/-(\d+)\.(jpg|webp|png)$/.exec(img.currentSrc || '') || [])[1] || 0), need = img && Math.round(ir.width * devicePixelRatio);
      const fit = img && getComputedStyle(img).objectFit, nat = img && img.naturalWidth ? img.naturalWidth / img.naturalHeight : null;
      // letterbox = the photo does not fill the media slot's width, or (not cover-fit) its box and the picture disagree
      const letter = !!img && (Math.abs(ir.width - slot.width) > 2 || (fit !== 'cover' && nat && Math.abs(ir.width / ir.height - nat) > 0.02));
      const cap = dlg.querySelector('figcaption, .credit'), capTxt = cap ? cap.textContent.trim() : null;
      const bar = [...dlg.querySelectorAll('*')].find(e => /sticky|fixed/.test(getComputedStyle(e).position) && /save/i.test(e.textContent) && /direction/i.test(e.textContent) && /share/i.test(e.textContent));
      const sc = [...dlg.querySelectorAll('*')].concat([dlg]).find(e => { const o = getComputedStyle(e).overflowY; return (o === 'auto' || o === 'scroll') && e.scrollHeight > e.clientHeight + 20; });
      const b0 = bar && __R(bar); if (sc) { sc.scrollTop = sc.scrollHeight; await new Promise(r => setTimeout(r, 200)); } const b1 = bar && __R(bar);
      const btns = bar ? [...bar.querySelectorAll('a,button')].filter(__vis).map(b => [b.textContent.trim().slice(0, 12), Math.round(b.getBoundingClientRect().width), Math.round(b.getBoundingClientRect().height)]) : [];
      return { title: t.textContent.trim().slice(0, 40), img: !!img, media: ir && [Math.round(ir.width), Math.round(ir.height)], slot: slot && [Math.round(slot.width), Math.round(slot.height)], fit, letter, credit: capTxt && capTxt.slice(0, 90),
        bar: !!bar, barOnScreen: !!b1 && b1.y >= 0 && b1.b <= innerHeight + 1, scrolled: !!sc, btns, b0, b1, srcW, need, rank: (dlg.querySelector('.sh-rank') || {}).textContent }; });
    check('detail', `${rel} ${vp}: place detail — photo fills its slot (no letterbox) with its credit; sticky Save · Directions · Share stay on screen when scrolled; buttons ≥ 44 px`,
      !!r && (!ph.length || (r.img && !r.letter && /Photo|by/.test(r.credit || ''))) && r.bar && r.barOnScreen && r.btns.length >= 3 && r.btns.every(b => b[2] >= 44), r);
    // Esc and Back
    const e = {};
    await page.keyboard.press('Escape'); await page.waitForTimeout(500); e.esc = await page.evaluate(() => !__sheet());
    await page.evaluate(id => { location.hash = '#p=' + id; }, id); await page.waitForTimeout(700); e.re = !!(await page.evaluate(() => __sheet()));
    await page.goBack().catch(() => {}); await page.waitForTimeout(600); e.back = await page.evaluate(() => !__sheet()); e.url = await page.evaluate(() => location.pathname);
    if (r && r.img) check('detail', `${rel} ${vp}: the detail photo's chosen source is at least its displayed width × DPR (not upscaled)`, r.srcW >= Math.min(r.need, 960), { chosen: r.srcW, needed: r.need });
    const rk = /No\. (\d+) of (\d+)/.exec((r && r.rank) || ''), pl = d.places.find(p => p.id === id);
    check('detail', `${rel} ${vp}: the detail's "No. n of N in <area>" matches the data (deep link on load)`, !!rk && +rk[1] === +pl.rank && +rk[2] === +pl.of, { shown: r && r.rank, data: pl && [pl.rank, pl.of] });
    check('detail', `${rel} ${vp}: Esc closes the detail; Back closes it and stays on the page`, e.esc && e.re && e.back && /beta/.test(e.url), e);
    await ctx.close();
  }
}

/* ---------------- type ---------------- */
async function type() {
  const VN = fs.readdirSync(path.join(BETA, 'Vietnam')).filter(f => f.endsWith('.html')).map(f => 'Vietnam/' + f);
  const pages = [...VN, ...PILOTS, 'index.html', 'Japan/index.html'];
  const faces = /^(Bricolage|Inter)\b/;
  for (const rel of pages) {
    if (!fs.existsSync(path.join(BETA, rel))) continue;
    const { ctx, page } = await open(rel, 'mobile', { settle: 1200 });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const chars = await page.evaluate(() => { const s = new Set();
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const p = n.parentElement; if (!p || p.closest('script,style,noscript,svg,[aria-hidden=true]')) continue; for (const ch of n.textContent) s.add(ch); }
      for (const t of document.querySelectorAll('noscript[data-cleo-defer]')) for (const ch of t.textContent.replace(/<[^>]+>/g, '')) s.add(ch);
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
      await page.evaluate(() => document.fonts && document.fonts.ready); await page.waitForTimeout(400);
      const { root } = await cdp.send('DOM.getDocument', { depth: 1 });
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#qa-type-' + face });
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
      res[face] = fonts.map(f => f.familyName + ':' + f.glyphCount);
      if (face !== 'cjk' && fonts.some(f => !faces.test(f.familyName))) {
        const fb = [];
        for (const ch of txt) { await page.evaluate(([ch, face]) => { let x = document.getElementById('qa-type-x'); if (!x) { document.body.insertAdjacentHTML('beforeend', '<span id="qa-type-x"></span>'); x = document.getElementById('qa-type-x'); } x.textContent = ch; x.style.fontFamily = getComputedStyle(document.getElementById('qa-type-' + face)).fontFamily; }, [ch, face]);
          const { root: r2 } = await cdp.send('DOM.getDocument', { depth: 1 }); const q = await cdp.send('DOM.querySelector', { nodeId: r2.nodeId, selector: '#qa-type-x' });
          const f2 = (await cdp.send('CSS.getPlatformFontsForNode', { nodeId: q.nodeId })).fonts; if (f2.some(f => !faces.test(f.familyName))) fb.push(ch + ' U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0') + ' ' + f2.map(f => f.familyName).join('/')); }
        res[face + 'Fallback'] = fb;
        await page.evaluate(() => { const x = document.getElementById('qa-type-x'); if (x) x.remove(); });
      }
      await page.evaluate(face => document.getElementById('qa-type-' + face).remove(), face);
    }
    const vn = [...latin].filter(c => /[ăâđêôơưĂÂĐÊÔƠƯẠ-ỹ]/.test(c)).length;
    const fbD = res.displayFallback || [], fbU = res.uiFallback || [];
    const okFb = x => /U\+(2190|2192|2197|2605|2606|2713|2715|2726|25[0-9A-F]{2}|2B[0-9A-F]{2}|1F[0-9A-F]+|27[0-9A-F]{2}|2665|2661)/.test(x);   // arrows, stars, ticks, hearts, geometric/emoji symbols: system symbol face by design
    check('type', `${rel}: Bricolage + Inter draw every letter (${[...latin].length} chars, ${vn} Vietnamese)`, !fbD.filter(x => !okFb(x)).length && !fbU.filter(x => !okFb(x)).length,
      { display: res.display, ui: res.ui, displayFallback: fbD.slice(0, 10), uiFallback: fbU.slice(0, 10) });
    if (cjk) check('type', `${rel}: CJK (${[...cjk].length} chars) falls back to a CJK system face`, (res.cjk || []).some(f => !faces.test(f)) && (res.cjk || []).every(f => faces.test(f) || /CJK|Hei|Mincho|Gothic|Noto|WenQuanYi|Droid|IPA|Han|Song|Ming/i.test(f)), res.cjk);
    if (/^Vietnam\/(?!index)/.test(rel)) { await page.evaluate(() => { const h = document.querySelector('li.gc, li.pl'); if (h) h.scrollIntoView({ block: 'start' }); }); await page.waitForTimeout(300); await shot(page, 'type-vn-' + slug(rel)); }
    await ctx.close();
  }
  const { ctx, page } = await open('cities/tokyo.html', 'dpr1', { settle: 1200 });
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
  await page.evaluate(() => { const s = document.createElement('div'); s.style.cssText = 'position:fixed;left:0;top:0;width:390px;background:#fff;color:#111;padding:10px;z-index:99999';
    s.innerHTML = ['18px', '24px'].map(px => `<div style="font:600 ${px}/1.4 var(--font-display)">Kanda Myōjin · Ōkunoshima · Tōdai-ji</div><div style="font:400 ${px}/1.4 var(--font-ui)">Kanda Myōjin · Ōkunoshima · Tōdai-ji</div>`).join('') + '<div style="font:600 24px/1.4 var(--font-display)">Hồ Chí Minh · Phở · Bánh mì · Đà Nẵng</div><div style="font:400 18px/1.4 var(--font-ui)">Hồ Chí Minh · Phở · Bánh mì · Đà Nẵng</div><div style="font:400 20px/1.4 var(--font-native, var(--font-ui))">東京 浅草寺 神田明神</div>';
    document.body.appendChild(s); });
  await page.waitForTimeout(400); await shot(page, 'type-macron-vn-cjk-dpr1', { x: 0, y: 0, width: 390, height: 360 });
  await ctx.close();
}

/* ---------------- a11y ---------------- */
const HUBS = ['index.html', 'Japan/index.html', 'Singapore/index.html', 'Vietnam/index.html', 'Germany/index.html', 'Belgium/index.html'].filter(f => fs.existsSync(path.join(BETA, f)));
async function a11y() {
  const AXE = fs.readFileSync(path.join(__dirname, 'vendor', 'axe.min.js'), 'utf8');
  const rows = [];
  const runs = [];
  for (const rel of PILOTS) for (const view of ['gallery', 'atlas', 'guidebook', 'insights']) runs.push([rel, '#view=' + view, view]);
  for (const rel of HUBS) runs.push([rel, '', 'hub']);
  for (const [rel, hash, view] of runs) for (const vp of ['mobile', 'desktop']) for (const scheme of ['light', 'dark']) {
    const { ctx, page } = await open(rel, vp, { scheme, hash, settle: 1500 });
    await page.addScriptTag({ content: AXE });
    const res = await page.evaluate(async () => {
      const r = await axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } });
      return r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, eg: v.nodes.slice(0, 2).map(n => n.target.join(' ') + ' — ' + (n.failureSummary || '').split('\n').slice(1, 2).join('').trim().slice(0, 140)) }));
    });
    const sc = res.filter(v => v.impact === 'serious' || v.impact === 'critical');
    // body copy, targets, focus (light only, to keep the run bounded)
    let ux = null;
    if (scheme === 'light') ux = await page.evaluate(async () => {
      const main = document.querySelector('main') || document.body;
      // body copy: paragraphs / list text of ≥ 60 chars that people read (not credits, meta, captions, legal)
      const small = [...main.querySelectorAll('p, li, dd, blockquote')].filter(e => __vis(e) && e.children.length < 6 && e.textContent.trim().length >= 60 && !e.closest('figcaption, .credit, .pl-cr, small, .meta, footer, nav, .leaflet-container, .ms-pv, [aria-hidden=true]') && !e.querySelector('li, p'))
        .map(e => [parseFloat(getComputedStyle(e).fontSize), e.className.toString().slice(0, 20) || e.tagName, e.textContent.trim().slice(0, 30)]).filter(x => x[0] < 16);
      // targets: interactive, on screen in the first two screens; text links inside running prose are exempt (WCAG 2.5.8 inline)
      const tg = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, summary, [role=button], [role=tab]')].filter(e => __vis(e) && !e.closest('.leaflet-container, [aria-hidden=true], [inert]'))
        .filter(e => { const r = e.getBoundingClientRect(); return r.top < innerHeight * 2 && r.bottom > 0; })
        .filter(e => !(e.tagName === 'A' && e.closest('p, li.src, .pl-s, figcaption, .credit, dd, td') && getComputedStyle(e).display === 'inline'))
        .map(e => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), (e.className || e.tagName).toString().slice(0, 22) + ' ' + (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 16)]; })
        .filter(x => x[0] < 44 || x[1] < 44);
      // focus: the first 40 tab stops show a ring
      const foc = [...document.querySelectorAll('a[href], button, input, select, summary, [tabindex="0"]')].filter(e => __vis(e) && !e.closest('[inert], [aria-hidden=true]') && e.tabIndex >= 0).slice(0, 40);
      return { smallBody: small.slice(0, 5), smallN: small.length, targets: tg.slice(0, 6), targetsN: tg.length, focusN: foc.length, foc: foc.map((e, i) => { e.setAttribute('data-qa-f', i); return i; }).length };
    });
    if (ux) {
      const bad = [];
      for (let i = 0; i < ux.focusN; i++) { await page.keyboard.press('Shift'); await page.focus(`[data-qa-f="${i}"]`).catch(() => {});
        const f = await page.evaluate(i => { const e = document.querySelector(`[data-qa-f="${i}"]`); return document.activeElement === e ? __ring(e) : null; }, i);
        if (f === false) bad.push(await page.evaluate(i => { const e = document.querySelector(`[data-qa-f="${i}"]`); return (e.className || e.tagName).toString().slice(0, 30) + ' ' + (e.textContent || '').trim().slice(0, 16); }, i)); }
      ux.noRing = bad;
    }
    rows.push({ rel, view, vp, scheme, serious: sc, other: res.filter(v => !sc.includes(v)).map(v => v.id + '(' + v.impact + ')×' + v.n), ux });
    check('axe', `${rel} ${view} ${vp} ${scheme}: axe serious/critical = 0`, !sc.length, sc.map(v => `${v.id}×${v.n}: ${v.eg[0]}`).slice(0, 3));
    if (ux) {
      check('body', `${rel} ${view} ${vp}: body copy ≥ 16 px`, !ux.smallN, ux.smallBody);
      check('targets', `${rel} ${view} ${vp}: targets ≥ 44 × 44 in the first two screens (inline prose links exempt)`, !ux.targetsN, { n: ux.targetsN, eg: ux.targets });
      check('focus', `${rel} ${view} ${vp}: focus ring on the first ${ux.focusN} tab stops`, !ux.noRing.length, ux.noRing.slice(0, 5));
    }
    await ctx.close();
  }
  R.a11y = rows;
}

/* ---------------- perf (D-38, independent) ---------------- */
async function weigh(rel, hash, vp, o = {}) {
  const ctx = await browser.newContext({ ...VP[vp], serviceWorkers: 'block', reducedMotion: 'no-preference' });
  const page = await ctx.newPage(), origin = new URL(base).origin, seen = new Map(); let tiles = 0;
  await ctx.route('**/*', r => { const u = r.request().url(); if (u.startsWith(origin) || u.startsWith('data:') || u.startsWith('blob:')) return r.continue();
    if (r.request().resourceType() === 'image') { if (isTile(u)) tiles++; if (o.noTiles && isTile(u)) return r.abort(); return r.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }); } return r.abort(); });
  const pend = [];
  page.on('response', r => { const u = r.url(); if (!u.startsWith(origin) || seen.has(u) || r.status() >= 300) return; seen.set(u, null);
    pend.push(r.body().then(b => seen.set(u, { raw: b.length, tx: /\.(png|jpe?g|webp|avif|gif|woff2?)$/.test(u.split('?')[0]) ? b.length : zlib.gzipSync(b, { level: 6 }).length })).catch(() => {})); });
  await page.goto(base + 'beta/' + rel + hash, { waitUntil: 'load', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {}); await page.waitForTimeout(2000);
  await Promise.all(pend);
  const v = [...seen.entries()].filter(([, x]) => x);
  const sum = k => v.reduce((t, [, x]) => t + x[k], 0), by = re => v.filter(([u]) => re.test(u)).reduce((t, [, x]) => t + x.tx, 0);
  const dom = await page.evaluate(() => document.getElementsByTagName('*').length);
  const r = { raw: sum('raw'), tx: sum('tx'), urls: v.length, img: by(/\.(jpe?g|png|webp)/), font: by(/\.woff2/), js: by(/\.js(\?|$)/), html: by(/\.html(\?|$)|\/$/), css: by(/\.css(\?|$)/), dom, tiles,
    photos: v.filter(([u]) => /assets\/img\/photos\//.test(u)).map(([u, x]) => u.split('/').pop() + ':' + Math.round(x.raw / 1024)) };
  await ctx.close();
  return r;
}
async function fcp4(rel, hash, vp) {
  const fcps = [];
  for (let i = 0; i < 3; i++) {
    const ctx = await browser.newContext({ ...VP[vp], serviceWorkers: 'block' }); const page = await ctx.newPage(), origin = new URL(base).origin;
    await ctx.route('**/*', r => { const u = r.request().url(); if (u.startsWith(origin) || u.startsWith('data:')) return r.continue(); if (r.request().resourceType() === 'image') return r.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }); return r.abort(); });
    const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.goto(base + 'beta/' + rel + hash, { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(500);
    fcps.push(Math.round(await page.evaluate(() => { const e = performance.getEntriesByName('first-contentful-paint')[0]; return e ? e.startTime : -1; })));
    await ctx.close();
  }
  return fcps;
}
async function perf() {
  const med = a => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
  const K = n => Math.round(n / 1024);
  const pages = [['Tokyo Gallery (default)', 'cities/tokyo.html', ''], ['Tokyo Atlas', 'cities/tokyo.html', '#view=atlas'], ['Landing', 'index.html', ''], ['Japan hub', 'Japan/index.html', '']];
  R.perf = [];
  for (const [label, rel, hash] of pages) for (const vp of ['desktop', 'phone3']) {
    const w = await weigh(rel, hash, vp);
    const wb = /atlas/.test(hash) ? await weigh(rel, hash, vp, { noTiles: true }) : null;
    const f = await fcp4(rel, hash, vp === 'phone3' ? 'mobile' : 'desktop');
    const row = { label, vp, txKB: K(w.tx), rawKB: K(w.raw), urls: w.urls, imgKB: K(w.img), fontKB: K(w.font), jsKB: K(w.js), htmlKB: K(w.html), cssKB: K(w.css), dom: w.dom, tiles: w.tiles, fcp4: f, fcpMed: med(f),
      tilesBlocked: wb && { txKB: K(wb.tx), rawKB: K(wb.raw), dom: wb.dom }, photos: w.photos.slice(0, 12) };
    R.perf.push(row);
    check('perf', `${label} ${vp === 'phone3' ? 'phone 390@3×' : 'desktop 1440'}: first-load transfer ≤ 2,000,000 B${wb ? ' (tiles stubbed AND tiles blocked)' : ''}`, w.tx <= 2e6 && (!wb || wb.tx <= 2e6), { tx: w.tx, raw: w.raw, blocked: wb && wb.tx, tiles: w.tiles });
    check('perf', `${label} ${vp === 'phone3' ? 'phone' : 'desktop'}: FCP at 4× CPU ≤ 1.0 s (median of 3)`, med(f) <= 1000, f);
    if (/Tokyo Atlas/.test(label)) check('perf', `${label} ${vp}: ≤ 3,000 DOM nodes at first load (tiles stubbed and blocked)`, w.dom <= 3000 && (!wb || wb.dom <= 3000), [w.dom, wb && wb.dom]);
  }
}

(async () => {
  const { chromium } = loadPlaywright();
  try { browser = await chromium.launch(); } catch (e) { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const srv = await serve(); base = 'http://127.0.0.1:' + srv.address().port + '/';
  try { R.head = require('child_process').execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch (e) { /* no git */ }
  const crash = (g, rel) => e => check(g, (rel || '') + ': probe crashed', false, String(e.message).slice(0, 220));
  for (const rel of PILOTS) {
    console.log(`\n# ${rel}`);
    for (const [k, f] of [['atlasd', atlasd], ['atlasm', atlasm], ['cluster', cluster], ['reach', reach], ['nocdn', nocdn], ['b08', b08], ['gallery', gallery], ['detail', detail]])
      if (want(k)) await f(rel).catch(crash(k, rel));
  }
  if (want('atlasd') || want('atlasm')) { const hosts = Object.keys(TILES); check('tiles', 'every tile request went to OSM or Esri', hosts.length > 0 && hosts.every(h => TILE_OK.has(h)), TILES); }
  if (want('lens')) { console.log('\n# lens deep links'); await lens().catch(crash('lens')); }
  if (want('type')) { console.log('\n# type'); await type().catch(crash('type')); }
  if (want('a11y')) { console.log('\n# a11y'); await a11y().catch(crash('a11y')); }
  if (want('perf')) { console.log('\n# perf'); await perf().catch(crash('perf')); }
  await browser.close(); srv.close();
  const fails = R.checks.filter(c => c.ok === false).length, graded = R.checks.filter(c => c.ok !== null).length;
  const out = path.join(OUT, ONLY ? 'w7-' + ONLY.join('-') + '.json' : 'w7.json');
  fs.writeFileSync(out, JSON.stringify(R, null, 1));
  console.log(`\n>>> ${graded - fails}/${graded} PASS, ${fails} FAIL on ${R.head} → ${path.relative(ROOT, out)}`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
