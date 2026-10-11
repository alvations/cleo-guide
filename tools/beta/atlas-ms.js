#!/usr/bin/env node
'use strict';
/**
 * tools/beta/atlas-ms.js — Atlas map-search (W7 Amendment 2) evidence + acceptance probes, Atlas lane.
 *
 *   NODE_PATH=$(npm root -g) node tools/beta/atlas-ms.js [--out design/beta/eval/w7/atlas] [--only tokyo] [--no-shots]
 *
 * Same-origin files are served from disk. Tiles: "stub" serves a locally drawn street-like tile (no tile host is ever
 * contacted; it only makes the screenshots read like a map), "blocked" aborts every tile request (the sandbox's real
 * state: the map gives way to the list). Anything else off-origin is aborted, so the run also proves no CDN.
 * Probes (the Amendment 2 acceptance): desktop map share + full height, 2-column grid, pan changes the count and
 * "Show all" restores N, hover card → pin and pin → card, pin → preview → detail; phone first screen ≥ 70 % map,
 * pin → carousel card in view, List/Map toggle, "Search this area"; 0 page errors with stub and with blocked tiles.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/eval/w7/atlas'));
const ONLY = arg('--only', '');
const SHOTS = process.argv.indexOf('--no-shots') < 0;
const BASE = 'https://cleo.local/';
const M = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const D = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };

// a quiet street-like stub tile (PNG, drawn here): warm ground, a few white streets, the odd park block
const crcT = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc = b => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (t, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(t), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
function tile(x, y, dark) {
  const W = 256, raw = Buffer.alloc((W * 3 + 1) * W), h = (a, b) => ((a * 73856093) ^ (b * 19349663)) >>> 0;
  const g = dark ? [38, 36, 34] : [242, 239, 233], st = dark ? [70, 66, 62] : [255, 255, 255], pk = dark ? [40, 52, 42] : [214, 230, 205], wt = dark ? [30, 40, 52] : [190, 214, 232];
  const vx = [0, 1, 2].map(i => h(x, i) % W), hy = [0, 1].map(i => h(y + 7, i) % W), park = h(x, y) % 5 === 0, water = h(x * 3, y) % 11 === 0;
  for (let r = 0; r < W; r++) { raw[r * (W * 3 + 1)] = 0; for (let c = 0; c < W; c++) {
    let p = g; if (water && c > 150 && r > 120) p = wt; else if (park && c > 30 && c < 120 && r > 40 && r < 140) p = pk;
    if (vx.some(v => Math.abs(c - v) < (v % 2 ? 4 : 2)) || hy.some(v => Math.abs(r - v) < (v % 2 ? 4 : 2))) p = st;
    const o = r * (W * 3 + 1) + 1 + c * 3; raw[o] = p[0]; raw[o + 1] = p[1]; raw[o + 2] = p[2]; } }
  const ih = Buffer.alloc(13); ih.writeUInt32BE(W, 0); ih.writeUInt32BE(W, 4); ih[8] = 8; ih[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

async function context(browser, vp, o) {
  const ctx = await browser.newContext(Object.assign({ reducedMotion: 'reduce', colorScheme: o.dark ? 'dark' : 'light' }, vp));
  ctx.off = 0;
  await ctx.route('**/*', route => {
    const u = new URL(route.request().url());
    if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u.host)) {
      if (o.tiles !== 'stub') return route.abort();
      const m = /\/(\d+)\/(\d+)\/(\d+)/.exec(u.pathname) || [0, 0, 0, 0];
      return route.fulfill({ body: tile(+m[2], +m[3], o.dark), headers: { 'content-type': 'image/png' } });
    }
    if (u.origin + '/' !== BASE) { ctx.off++; return route.abort(); }
    const p = path.join(ROOT, decodeURIComponent(u.pathname));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return route.fulfill({ status: 404, body: 'not found' });
    return route.fulfill({ body: fs.readFileSync(p), headers: { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' } });
  });
  return ctx;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function open(browser, vp, url, o) {
  const ctx = await context(browser, vp, o), page = await ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));
  await page.goto(BASE + url, { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelector('.leaflet-marker-icon') || document.documentElement.classList.contains('ms-nomap'), null, { timeout: 8000 }).catch(() => {});
  await sleep(o.wait || 900);
  return { ctx, page, errors };
}
const snap = async (page, name) => { if (SHOTS) await page.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 72 }); };

const state = page => page.evaluate(() => {
  const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const m = document.getElementById('cleo-map'), mr = vis(m) ? m.getBoundingClientRect() : null, lp = document.querySelector('.listpane');
  const cards = [...document.querySelectorAll('li.pl')].filter(vis), H = document.documentElement;
  const cols = new Set(cards.slice(0, 8).map(c => Math.round(c.getBoundingClientRect().left))).size;
  // phone: the share of the first screen that shows the map (the map box minus the chip row and the carousel over it)
  const bar = document.querySelector('.ms-bar'), br = vis(bar) ? bar.getBoundingClientRect() : null, lr = vis(lp) ? lp.getBoundingClientRect() : null;
  const top = mr ? Math.max(mr.top, 0) : 0, bot = mr ? Math.min(mr.bottom, innerHeight) : 0;
  return {
    mapW: mr ? Math.round(mr.width / innerWidth * 100) : null, mapLeft: mr ? Math.round(mr.left) : null, mapTop: mr ? Math.round(mr.top) : null, mapBottomGap: mr ? Math.round(innerHeight - mr.bottom) : null,
    mapScreen: mr ? Math.round((bot - top) * mr.width / (innerWidth * innerHeight) * 100) : null,
    mapClear: mr ? Math.round((Math.min(bot, lr && lr.top > top ? lr.top : bot) - Math.max(top, br ? br.bottom : top)) * mr.width / (innerWidth * innerHeight) * 100) : null,
    cols, cardsVisible: cards.length, count: (document.querySelector('.ms-count') || {}).textContent || '', more: (document.querySelector('.ms-more') || {}).textContent || '',
    pins: document.querySelectorAll('.leaflet-marker-icon.pp').length, clusters: document.querySelectorAll('.leaflet-marker-icon.pin-cl').length,
    cls: ['atlas-d', 'atlas-m', 'ms-on', 'ms-list', 'ms-nomap'].filter(k => H.classList.contains(k)).join(' '), scrollY: Math.round(scrollY), overflowX: H.scrollWidth - innerWidth,
  };
});
const nIn = s => +((/([\d,]+)/.exec(s.count) || [0, '0'])[1].replace(/,/g, ''));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const R = {}, ok = {}; let fails = 0;
  const chk = (k, v, d) => { ok[k] = !!v; if (!v) fails++; console.log(`${v ? 'PASS' : 'FAIL'}  ${k}${d !== undefined ? '  ' + JSON.stringify(d) : ''}`); };
  const PAGES = [['tokyo', 'beta/cities/tokyo.html'], ['cleveland', 'beta/cleveland.html'], ['chinatown', 'beta/Singapore/chinatown.html']].filter(p => !ONLY || p[0] === ONLY);
  for (const [key, url] of PAGES) {
    const main = key === 'tokyo';
    // ---- desktop, stub tiles ----
    for (const dark of main ? [false, true] : [false]) {
      const t = dark ? '-dark' : '';
      let { ctx, page, errors } = await open(browser, D, url + '#view=atlas', { tiles: 'stub', dark });
      const s0 = await state(page); R[`${key}-d${t}`] = s0;
      if (!dark) { const nc = await page.evaluate(() => document.querySelectorAll('li.pl').length), live0 = (fs.readFileSync(path.join(ROOT, url), 'utf8').match(/<li class="pl[ "]/g) || []).length;
        chk(`${key} desktop: the first fit builds one page of cards, not the area (≤ 32 live + 48)`, nc <= 32 + 48 + 2, { cards: nc }); }
      await snap(page, `${key}-atlas-1440${t}`);
      if (!dark) {
        chk(`${key} desktop: map ≥ 58 % wide, on the left, full height`, s0.mapW >= 58 && s0.mapLeft <= 1 && Math.abs(s0.mapBottomGap) <= 2, [s0.mapW, s0.mapLeft, s0.mapBottomGap]);
        chk(`${key} desktop: list is a 2-column card grid`, s0.cols === 2, s0.cols);
        const N = nIn(s0) + nIn({ count: s0.more });
        const v0 = await page.evaluate(() => { const m = Cleo.city.map(), c = m.getCenter(); return [c.lat, c.lng, m.getZoom()]; });
        // pan: the list follows the map
        await page.evaluate(() => { const m = Cleo.city.map(); m.setZoom(m.getZoom() + 2, { animate: false }); });
        await sleep(700); const s1 = await state(page);
        chk(`${key} desktop: zooming in changes the list count (search as I move the map)`, nIn(s1) < nIn(s0) && /more outside/.test(s1.more), [s0.count, s1.count, s1.more]);
        await page.evaluate(() => { const m = Cleo.city.map(); const s = m.getSize(); m.panBy([s.x * 0.45, s.y * 0.35], { animate: false }); });
        await sleep(700); const s2 = await state(page);
        chk(`${key} desktop: panning changes the list count`, nIn(s2) !== nIn(s1), [s1.count, s2.count]);
        await page.click('.ms-more [data-ms="all"]'); await sleep(300); const s3 = await state(page);
        const total = await page.evaluate(() => Cleo.city.info.total);
        chk(`${key} desktop: "Show all" restores every place`, nIn(s3) === total && s3.cardsVisible > 0, [s3.count, total]);
        await page.click('.ms-more [data-ms="area"]'); await sleep(300);
        await page.evaluate(v => Cleo.city.map().setView([v[0], v[1]], v[2], { animate: false }), v0); await sleep(600);   // back to the first view for the sync checks
        // hover sync: card → pin and pin → card
        const hv = await page.evaluate(async () => {
          // a pin inside a cluster lights its bubble instead (the pin isn't drawn at this zoom)
          const el = x => Cleo.city.pinEl(x) || (Cleo.city.inCl[x.id.slice(2)] && Cleo.city.inCl[x.id.slice(2)].getElement());
          const c = [...document.querySelectorAll('li.pl[data-ll]')].find(x => x.offsetParent && el(x)); if (!c) return null;
          c.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); await new Promise(r => setTimeout(r, 50));
          const a = el(c).classList.contains('hot'); c.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
          return { id: c.id, cardToPin: a };
        });
        // a pin whose card is on the list's current page (the list pages by 48, like listing results)
        const findPin = () => page.evaluate(() => { const C = Cleo.city, els = Object.keys(C.markers).filter(id => C.byId[id] && C.byId[id].offsetParent).map(id => C.markers[id].getElement()).filter(Boolean).map(e => [e, e.firstElementChild.getBoundingClientRect()]).filter(([e, r]) => r.left > 120 && r.right < innerWidth * 0.55 && r.top > 260 && r.bottom < innerHeight - 120);
          const [e, r] = els[Math.floor(els.length / 2)] || []; return e ? { x: r.left + r.width / 2, y: r.top + r.height / 2, n: e.textContent } : null; });
        let pinBox = await findPin();
        for (let i = 0; i < 3 && !pinBox; i++) { await page.evaluate(() => { const m = Cleo.city.map(); m.setZoom(m.getZoom() + 1, { animate: false }); }); await sleep(700); pinBox = await findPin(); }   // zoom in until one is unclustered
        let p2c = null, pv = null, det = null;
        if (pinBox) {
          await page.mouse.move(pinBox.x, pinBox.y); await sleep(150);
          p2c = await page.evaluate(() => !!document.querySelector('li.pl.is-hover'));
          await page.mouse.click(pinBox.x, pinBox.y); await sleep(700);
          pv = await page.evaluate(() => { const p = document.getElementById('cleo-poi'), c = document.querySelector('li.pl.is-sel'), lp = document.querySelector('.listpane').getBoundingClientRect(), r = c && c.getBoundingClientRect();
            return { open: !!p && !p.hidden && p.offsetHeight > 80, name: p && (p.querySelector(".ms-pv-n") || {}).textContent, card: c && c.id, cardInView: !!r && r.top >= lp.top - 2 && r.bottom <= lp.bottom + 2, r: r && [Math.round(r.top), Math.round(r.bottom)], lp: [Math.round(lp.top), Math.round(lp.bottom)], scrollY }; });
          await snap(page, `${key}-atlas-1440-preview`);
          await page.click('#cleo-poi a.ms-pv'); await sleep(900);
          det = await page.evaluate(() => ({ hash: location.hash, sheet: !!document.querySelector('#cleo-sheet:not([hidden])') }));
          await snap(page, `${key}-atlas-1440-detail`);
        }
        chk(`${key} desktop: hovering a card highlights its pin`, hv && hv.cardToPin, hv);
        chk(`${key} desktop: hovering a pin highlights its card`, p2c === true, p2c);
        chk(`${key} desktop: pin → card in view in the list, page not scrolled`, pv && pv.cardInView && pv.scrollY === 0, pv);
        chk(`${key} desktop: pin → preview card on the map`, pv && pv.open, pv && pv.name);
        chk(`${key} desktop: preview → place detail (#p=, view kept)`, det && det.sheet && /view=atlas/.test(det.hash) && /p=/.test(det.hash), det);
        // area chip fits the map
        const ar = await page.evaluate(async () => { location.hash = '#view=atlas'; await new Promise(r => setTimeout(r, 300)); const b = document.querySelector('.ms-head [data-cleo-area]'); if (!b) return null;
          const z0 = Cleo.city.map().getZoom(); b.click(); await new Promise(r => setTimeout(r, 900)); const a = b.getAttribute('data-cleo-area'), m = Cleo.city.map(), bd = m.getBounds();
          const ll = [...document.querySelectorAll('li.pl[data-a="' + a + '"][data-ll]')].map(c => c.getAttribute('data-ll').split(',').map(Number));
          return { a, z0, z1: m.getZoom(), inside: ll.filter(p => bd.contains(p)).length, of: ll.length }; });
        if (ar || /<section class="area"[^]*<section class="area"/.test(fs.readFileSync(path.join(ROOT, url), 'utf8'))) chk(`${key} desktop: an area chip fits the map to that area`, ar && ar.inside >= ar.of * 0.9, ar);   // one-area pages have no chips
      }
      R[`${key}-d${t}-errors`] = errors; chk(`${key} desktop${t}: 0 page errors (stub tiles)`, errors.length === 0, errors.slice(0, 2)); await ctx.close();
    }
    // ---- desktop, tiles blocked ----
    { const { ctx, page, errors } = await open(browser, D, url + '#view=atlas', { tiles: 'blocked', wait: 2500 }); const s = await state(page); R[`${key}-d-blocked`] = s;
      const total = await page.evaluate(() => Cleo.city.info.total);
      await snap(page, `${key}-atlas-1440-tiles-blocked`);
      chk(`${key} desktop, tiles blocked: every place listed + "Map unavailable"`, /ms-nomap/.test(s.cls) && nIn(s) === total, [s.cls, s.count]);
      chk(`${key} desktop, tiles blocked: 0 page errors`, errors.length === 0, errors.slice(0, 2)); await ctx.close(); }
    // ---- phone ----
    for (const dark of main ? [false, true] : [false]) {
      const t = dark ? '-dark' : '';
      const { ctx, page, errors } = await open(browser, M, url + '#view=atlas', { tiles: 'stub', dark, wait: 1200 });
      const s0 = await state(page); R[`${key}-m${t}`] = s0;
      // the OSM credit never collides with the List pill or the carousel
      const att = await page.evaluate(() => { const a = document.querySelector('.leaflet-control-attribution'), r = a && a.getBoundingClientRect(); if (!r || !r.width) return null;
        const hit = el => { const b = el && el.getBoundingClientRect(); return !!b && b.width && !(b.right < r.left || b.left > r.right || b.bottom < r.top || b.top > r.bottom); };
        return { box: [Math.round(r.top), Math.round(r.bottom)], pill: hit(document.querySelector('.ms-toggle')), carousel: hit(document.querySelector('.listpane')), bar: hit(document.querySelector('.ms-bar')) }; });
      chk(`${key} phone${t}: the OSM credit is visible and clear of the pill, the carousel and the chip row`, att && !att.pill && !att.carousel && !att.bar, att);
      if (!dark) {
        const nc = await page.evaluate(() => document.querySelectorAll('li.pl').length);
        chk(`${key} phone: the first fit builds one page of cards, not the area (≤ 32 live + 48)`, nc <= 32 + 48 + 2, { cards: nc });
        const ov = await page.evaluate(() => { const s = document.querySelector('.ms-bar .spill'), r = s && s.getBoundingClientRect(); return { page: document.documentElement.scrollWidth - innerWidth, spill: r ? [Math.round(r.left), Math.round(r.right)] : null }; });
        chk(`${key} phone: no horizontal overflow; the search control is fully on screen`, ov.page <= 0 && (!ov.spill || (ov.spill[0] >= 0 && ov.spill[1] <= 390)), ov);
      }
      await snap(page, `${key}-atlas-390${t}`);
      if (!dark) {
        chk(`${key} phone: first screen ≥ 70 % map`, s0.mapClear >= 70 || s0.mapScreen >= 70, { box: s0.mapScreen, clear: s0.mapClear });
        // independent B-08 (w6.js's rule, QA-37): no visible card title is covered by something else — the carousel
        const cover = () => page.evaluate(() => { let seen = 0, cov = [];
          const lr = document.querySelector('.listpane').getBoundingClientRect();   // what the list pane clips is not seen
          for (const t of document.querySelectorAll('li.pl .pl-n')) { const b = t.getBoundingClientRect(), r = { left: Math.max(b.left, lr.left, 0), right: Math.min(b.right, lr.right, innerWidth), top: Math.max(b.top, lr.top, 0), bottom: Math.min(b.bottom, lr.bottom, innerHeight) };
            if (!b.width || r.right - r.left < 4 || r.bottom - r.top < 4 || getComputedStyle(t).visibility === 'hidden') continue;
            const x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2, hit = document.elementFromPoint(x, y); if (!hit) continue; seen++;
            if (!t.contains(hit) && hit.closest('li.pl') !== t.closest('li.pl')) cov.push((hit.className || hit.tagName).toString().slice(0, 30) + ' over ' + t.textContent.trim().slice(0, 24)); }
          return { seen, covered: cov.length, eg: cov.slice(0, 3) }; });
        const cvMap = await cover();
        // the city is named on the first screen (QA-40)
        const city = await page.evaluate(() => { const n = Cleo.city.info.name, e = [...document.querySelectorAll('.ms-city, header, h1')].find(x => { const r = x.getBoundingClientRect(); return r.width && r.top >= 0 && r.bottom <= innerHeight && x.textContent.includes(n) && getComputedStyle(x).visibility !== 'hidden'; }); return !!e; });
        chk(`${key} phone: the city is named on the first screen (QA-40)`, city, city);
        // tap a pin → its card in the carousel, in view
        for (let i = 0; i < 3; i++) { const b = await page.evaluate(() => { const ok = e => { const r = (e.firstElementChild || e).getBoundingClientRect(); return r.width && r.left > 30 && r.right < innerWidth - 70 && r.top > 200 && r.bottom < innerHeight - 260; };
          if ([...document.querySelectorAll('.leaflet-marker-icon.pp')].some(ok)) return 0; const c = [...document.querySelectorAll('.leaflet-marker-icon.pin-cl')].find(ok); if (c) c.dispatchEvent(new MouseEvent('click', { bubbles: true })); return c ? 1 : 0; });
          if (!b) break; await sleep(900); }   // a bubble zooms in until a pin is in reach
        const tp = await page.evaluate(() => { const els = [...document.querySelectorAll('.leaflet-marker-icon.pp')].map(e => [e, e.firstElementChild.getBoundingClientRect()]).filter(([e, r]) => r.left > 30 && r.right < innerWidth - 70 && r.top > 200 && r.bottom < innerHeight - 260);
          const [e, r] = els[Math.floor(els.length / 2)] || []; return e ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; });
        let pc = null;
        if (tp) { await page.touchscreen.tap(tp.x, tp.y); await sleep(900);
          pc = await page.evaluate(() => { const c = document.querySelector('li.pl.is-sel'), r = c && c.getBoundingClientRect(); return { card: c && c.id, inView: !!r && r.left >= -2 && r.right <= innerWidth + 2 && r.top < innerHeight && r.bottom > 0, pinSel: !!document.querySelector('.leaflet-marker-icon.pp.sel') }; }); }
        await snap(page, `${key}-atlas-390-pin`);
        chk(`${key} phone: pin → its carousel card in view`, pc && pc.inView && pc.pinSel, pc);
        // swipe the carousel → another pin lights
        const sw = await page.evaluate(async () => { const lp = document.querySelector('.listpane'), s0 = (document.querySelector('.pp.sel') || {}).textContent; lp.scrollBy({ left: lp.clientWidth * 0.86 }); await new Promise(r => setTimeout(r, 700));
          return { before: s0, after: (document.querySelector('.pp.sel') || {}).textContent, card: (document.querySelector('li.pl.is-sel') || {}).id }; });
        chk(`${key} phone: swiping the carousel selects the next card's pin`, sw.card && sw.card !== (pc || {}).card, sw);
        // pan → "Search this area" → the carousel refreshes
        const n0 = nIn(await state(page));
        const box = await page.evaluate(() => { const r = document.getElementById('cleo-map').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.4 }; });
        await page.evaluate(() => { const m = Cleo.city.map(); m.fire('dragstart'); m.panBy([0, -window.innerHeight * 0.45], { animate: false }); m.fire('dragend'); });
        await sleep(500);
        const hb = await page.evaluate(() => { const b = document.querySelector('.ms-here'); return !!b && !b.hidden && b.offsetHeight > 0; });
        await snap(page, `${key}-atlas-390-search-area`);
        if (hb) { await page.click('.ms-here'); await sleep(500); }
        const n1 = nIn(await state(page));
        chk(`${key} phone: a pan offers "Search this area", which refreshes the carousel`, hb && n1 !== n0, { button: hb, before: n0, after: n1 });
        // List / Map
        await page.click('.ms-toggle'); await sleep(500); const sl = await state(page);
        await snap(page, `${key}-atlas-390-list`);
        await page.click('.ms-toggle'); await sleep(500); const sm = await state(page);
        await page.click('.ms-toggle'); await sleep(400); await page.evaluate(() => { const l = document.querySelector('.listpane'); l.scrollTop = Math.min(1200, (l.scrollHeight - l.clientHeight) / 2); }); await sleep(250); const cvList = await cover(); await page.click('.ms-toggle'); await sleep(400);
        chk(`${key} phone: independent B-08 — no visible title covered (carousel, list scrolled) (QA-37)`, cvMap.covered === 0 && cvList.covered === 0 && cvMap.seen > 0 && cvList.seen > 0, { carousel: cvMap, list: cvList });
        chk(`${key} phone: List shows the full-screen list, Map returns`, /ms-list/.test(sl.cls) && sl.cardsVisible > 0 && !/ms-list/.test(sm.cls), [sl.cls, sl.cardsVisible, sm.cls]);
        void box;
      } else {
        await page.click('.ms-toggle'); await sleep(500); await snap(page, `${key}-atlas-390-list-dark`);
      }
      chk(`${key} phone${t}: 0 page errors`, errors.length === 0, errors.slice(0, 2)); await ctx.close();
    }
    { const { ctx, page, errors } = await open(browser, M, url + '#view=atlas', { tiles: 'blocked', wait: 2500 }); const s = await state(page); R[`${key}-m-blocked`] = s;
      const total = await page.evaluate(() => Cleo.city.info.total);
      await snap(page, `${key}-atlas-390-tiles-blocked`);
      chk(`${key} phone, tiles blocked: the list holds every place`, /ms-nomap/.test(s.cls) && /ms-list/.test(s.cls) && nIn(s) === total, [s.cls, s.count]);
      chk(`${key} phone, tiles blocked: 0 page errors`, errors.length === 0, errors.slice(0, 2)); await ctx.close(); }
    // ---- deep link: the detail opens with the map centred on the place ----
    for (const [vk, vp] of [['390', M], ['1440', D]]) {
      const id = (/<li class="pl[^"]*" id="p-([a-z0-9-]+)"[^>]*data-ll="/.exec(fs.readFileSync(path.join(ROOT, url), 'utf8')) || [])[1];
      const { ctx, page, errors } = await open(browser, vp, url + '#view=atlas&p=' + id, { tiles: 'stub', wait: 1500 });
      const r = await page.evaluate(id => { const m = Cleo.city.map(), c = document.getElementById('p-' + id), ll = c.getAttribute('data-ll').split(',').map(Number);
        return { sheet: !!document.querySelector('#cleo-sheet:not([hidden])'), inView: !!m && m.getBounds().contains(ll) }; }, id);
      await snap(page, `${key}-atlas-${vk}-deeplink`);
      chk(`${key} ${vk}: #view=atlas&p= opens the detail with the place on the map`, r.sheet && r.inView, r);
      chk(`${key} ${vk} deep link: 0 page errors`, errors.length === 0, errors.slice(0, 2)); await ctx.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify({ ok, states: R }, null, 1) + '\n');
  console.log(fails ? `\n>>> FAIL — ${fails} Atlas map-search check(s)` : '\n>>> PASS — Atlas map-search acceptance');
  process.exit(fails ? 1 : 0);
})();
