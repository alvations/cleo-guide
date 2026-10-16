#!/usr/bin/env node
'use strict';
/**
 * design/beta/atlas/tools/panel-probe.js — the Atlas review panel's evidence pack (PANEL.md §6).
 *
 *   NODE_PATH=$(npm root -g) node design/beta/atlas/tools/panel-probe.js --root <checkout> --out design/beta/atlas/panel/R<n>
 *
 * Serves <checkout>/beta from disk (same origin https://cleo.local/). Tiles: "stub" = a flat neutral land colour
 * (no streets, so the basemap is NOT judged here), "blocked" = every tile request aborted, "nolib" = the map library
 * (assets/vendor/leaflet/*) aborted. Every other off-origin request is aborted.
 * Writes <out>/shots/*.jpg and <out>/measurements.json (+ a readable measurements.md). Read-only on the product.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { chromium } = require('playwright');

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ROOT = path.resolve(arg('--root', '.'));
const OUT = path.resolve(arg('--out', 'design/beta/atlas/panel/R0'));
const ONLY = arg('--only', '');
const SH = path.join(OUT, 'shots');
const BASE = 'https://cleo.local/';
const VP = {
  d: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  z200: { viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 },   // a 1440×900 window at 200 % browser zoom
};
const PAGES = [
  ['tokyo', 'beta/cities/tokyo.html'], ['cleveland', 'beta/cleveland.html'],
  ['chinatown', 'beta/Singapore/chinatown.html'], ['newyork', 'beta/cities/newyork.html'],
].filter(p => !ONLY || ONLY.split(',').includes(p[0]));
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };

// a flat neutral land tile (PNG): the basemap's look is judged only on real-tile shots
const crcT = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc = b => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (t, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(t), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const TILE = {};
const tile = dark => TILE[dark] || (TILE[dark] = (() => {
  const W = 256, raw = Buffer.alloc((W * 3 + 1) * W), g = dark ? [44, 42, 40] : [236, 233, 226];
  for (let r = 0; r < W; r++) { raw[r * (W * 3 + 1)] = 0; for (let c = 0; c < W; c++) { const o = r * (W * 3 + 1) + 1 + c * 3; const e = (r === 0 || c === 0) ? (dark ? 6 : -6) : 0; raw[o] = g[0] + e; raw[o + 1] = g[1] + e; raw[o + 2] = g[2] + e; } }
  const ih = Buffer.alloc(13); ih.writeUInt32BE(W, 0); ih.writeUInt32BE(W, 4); ih[8] = 8; ih[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
})());

const GZ = {};
async function context(browser, vp, o) {
  const ctx = await browser.newContext(Object.assign({ reducedMotion: o.motion || 'reduce', colorScheme: o.dark ? 'dark' : 'light' }, vp, o.geo ? { geolocation: o.geo, permissions: ['geolocation'] } : {}));
  ctx.bytes = 0; ctx.gz = 0; ctx.reqs = 0;
  await ctx.route('**/*', route => {
    const u = new URL(route.request().url());
    if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u.host)) {
      if (o.tiles === 'stub' || o.tiles === 'nolib') return route.fulfill({ body: tile(!!o.dark), headers: { 'content-type': 'image/png' } });
      return route.abort();
    }
    if (u.origin + '/' !== BASE) return route.abort();
    if (o.tiles === 'nolib' && /assets\/vendor\/leaflet\//.test(u.pathname)) return route.abort();
    const p = path.join(ROOT, decodeURIComponent(u.pathname));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return route.fulfill({ status: 404, body: 'not found' });
    const body = fs.readFileSync(p); ctx.bytes += body.length; ctx.reqs++;
    ctx.gz += /\.(html|css|js|json|svg|webmanifest)$/.test(p) ? (GZ[p] || (GZ[p] = zlib.gzipSync(body).length)) : body.length;
    return route.fulfill({ body, headers: { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' } });
  });
  return ctx;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function open(browser, vpk, url, o = {}) {
  const ctx = await context(browser, VP[vpk], o), page = await ctx.newPage(), errors = []; page.setDefaultTimeout(6000);
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));
  await page.goto(BASE + url, { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelector('.leaflet-marker-icon') || document.documentElement.classList.contains('ms-nomap'), null, { timeout: 9000 }).catch(() => {});
  await sleep(o.wait || 1200);
  return { ctx, page, errors };
}
const shots = [];
const snap = async (page, name, what) => { await page.screenshot({ path: path.join(SH, name + '.jpg'), type: 'jpeg', quality: 74 }); shots.push({ file: 'shots/' + name + '.jpg', what }); };

// ---------- the first-screen measurement, run in the page ----------
const MEASURE = () => {
  const W = innerWidth, H = innerHeight, D = document, HTML = D.documentElement;
  const vis = e => { if (!e) return false; const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W; };
  const inView = r => r.bottom > 0 && r.top < H && r.right > 0 && r.left < W;
  const m = D.getElementById('cleo-map'), mr = m && vis(m) ? m.getBoundingClientRect() : null;
  const clip = r => Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0));
  // overlays on the map (chrome drawn over it): the sticky bar, the carousel, the toggle pill, controls
  const over = ['.ms-bar', '.listpane', '.ms-toggle', '.leaflet-control-zoom', '.leaflet-control-attribution', '.leaflet-control-container .leaflet-bar', '.ms-key', '#cleo-poi']
    .flatMap(s => [...D.querySelectorAll(s)]).filter(vis);
  let mapShare = null, mapClear = null, chromeAbove = null, overlayPx = 0;
  if (mr && !HTML.classList.contains('ms-nomap')) {
    mapShare = Math.round(clip(mr) / (W * H) * 100);
    // sample a grid: share of the first screen where the map itself (tiles/pins) is what you see
    let hit = 0, tot = 0;
    for (let y = 4; y < H; y += 12) for (let x = 4; x < W; x += 12) { tot++; const e = D.elementFromPoint(x, y); if (e && m.contains(e) && !e.closest('.leaflet-control, .leaflet-control-container')) hit++; }
    mapClear = Math.round(hit / tot * 100);
    // chrome above the first clear map row (in the map's column)
    const bar = D.querySelector('.ms-bar'), br = vis(bar) ? bar.getBoundingClientRect() : null;
    chromeAbove = Math.round(Math.max(mr.top, br && br.top < mr.top + 160 ? br.bottom : 0));
    over.forEach(e => { if (m.contains(e) || e.getBoundingClientRect().top >= mr.top) overlayPx += clip(e.getBoundingClientRect()); });
  }
  const box = e => { const r = e.getBoundingClientRect(); return r.width > 1 ? r : (e.firstElementChild || e).getBoundingClientRect(); };
  const mk = [...D.querySelectorAll('.leaflet-marker-icon')].filter(e => { const r = box(e); return mr && r.width && inView(r) && r.left < mr.right && r.right > mr.left && r.top < mr.bottom && r.bottom > mr.top; });
  const txt = e => e.textContent.trim();
  // numbered = a bare number (rank or count); R0's markers were all bare numbers
  const pins = mk.filter(e => e.classList.contains('pp')), cls = mk.filter(e => e.classList.contains('pin-cl'));
  const numbered = mk.filter(e => /^[★\s]*[\d,]+\s*$/.test(txt(e))), named = mk.filter(e => /[A-Za-z぀-鿿]{3,}/.test(txt(e)));
  // obscured labels: centre covered by something else (another marker, a control)
  const covered = mk.filter(e => { const r = box(e), x = r.left + r.width / 2, y = r.top + r.height / 2; if (x < 0 || y < 0 || x > W || y > H) return false; const t = D.elementFromPoint(x, y); return t && !e.contains(t); }).length;
  // text sizes (visible text-bearing elements)
  const texts = []; const walk = D.createTreeWalker(D.body, NodeFilter.SHOW_TEXT, { acceptNode: n => n.nodeValue.trim().length > 1 ? 1 : 2 });
  for (let n; (n = walk.nextNode());) { const e = n.parentElement; if (!e || !vis(e) || e.closest('[aria-hidden="true"], .vh, .sr-only')) continue; const s = getComputedStyle(e); if (s.clip === 'rect(0px, 0px, 0px, 0px)' || s.clipPath === 'inset(50%)') continue; texts.push([e, n.nodeValue.trim(), parseFloat(s.fontSize), +s.fontWeight || 400, s]); }
  const zone = e => e.closest('.leaflet-marker-icon') ? 'pin' : e.closest('#cleo-poi') ? 'preview' : e.closest('.leaflet-control-container') ? 'mapctl' : e.closest('li.pl') ? (e.closest('figcaption, .pl-cr, .ms-cr, .cr') ? 'credit' : 'card') : e.closest('.ms-bar, .ms-head, header') ? 'chrome' : e.closest('#cleo-sheet') ? 'detail' : 'other';
  const fs = {}; texts.forEach(([e, t, f]) => { const z = zone(e); (fs[z] = fs[z] || []).push(f); });
  const fsum = {}; for (const z in fs) { const a = fs[z].sort((x, y) => x - y); fsum[z] = { n: a.length, min: a[0], median: a[a.length >> 1], under16: a.filter(x => x < 15.5).length, under12: a.filter(x => x < 11.5).length }; }
  // contrast (text on its first opaque ancestor background; text over photos skipped)
  const cv = D.createElement('canvas'); cv.width = cv.height = 1; const cx2 = cv.getContext('2d', { willReadFrequently: true });
  const rgb = c => { const m = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(c); if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
    if (!c || c === 'transparent') return null; cx2.clearRect(0, 0, 1, 1); cx2.fillStyle = '#000'; cx2.fillStyle = c; cx2.fillRect(0, 0, 1, 1); const d = cx2.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };   // color-mix()/oklab() → sRGB
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const bgOf = e => { let a = null; for (let x = e; x; x = x.parentElement) { const s = getComputedStyle(x); if (s.backgroundImage !== 'none' && !/gradient/.test(s.backgroundImage)) return 'img'; if (x.tagName === 'FIGURE' || x.querySelector && x.parentElement && x.parentElement.querySelector(':scope > img') && x !== e) {} const c = rgb(s.backgroundColor); if (c && c[3] > 0.6) { a = c; break; } } return a || rgb(getComputedStyle(D.body).backgroundColor) || [255, 255, 255, 1]; };
  const cfail = []; let cchk = 0;
  texts.forEach(([e, t, f, w, s]) => { const fg = rgb(s.color); if (!fg) return; const bg = bgOf(e); if (bg === 'img') return; const r = e.getBoundingClientRect(); const under = D.elementFromPoint(Math.min(W - 1, Math.max(0, r.left + 2)), Math.min(H - 1, Math.max(0, r.top + r.height / 2))); if (under && under.tagName === 'IMG') return;
    const blend = fg.slice(0, 3).map((v, i) => v * fg[3] + bg[i] * (1 - fg[3])); const L1 = lum(blend), L2 = lum(bg), cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const large = f >= 24 || (f >= 18.6 && w >= 700); cchk++; if (cr < (large ? 3 : 4.5)) cfail.push({ zone: zone(e), text: t.slice(0, 40), ratio: +cr.toFixed(2), fs: f }); });
  // targets
  const tsel = 'a[href], button, input, select, summary, [role="button"], [tabindex]:not([tabindex="-1"]), .leaflet-marker-icon';
  const targets = [...D.querySelectorAll(tsel)].filter(e => (e.classList.contains('leaflet-marker-icon') ? (e.firstElementChild && vis(e.firstElementChild) && mk.includes(e)) : vis(e)) && !e.closest('[aria-hidden="true"]') && !(e.tagName === 'INPUT' && e.type === 'checkbox' && e.closest('label') && vis(e.closest('label'))));
  const small = targets.map(e => { const r = (e.classList.contains('leaflet-marker-icon') && e.firstElementChild ? e.firstElementChild : e).getBoundingClientRect(); return { e, w: Math.round(r.width), h: Math.round(r.height) }; }).filter(t => t.w < 44 || t.h < 44);
  const desc = e => (e.classList.contains('leaflet-marker-icon') ? (e.classList.contains('pin-cl') ? 'cluster ' : 'pin ') : e.tagName.toLowerCase() + ' ') + ((e.getAttribute('aria-label') || txt(e)).replace(/\s+/g, ' ').slice(0, 28));
  const smallBy = {}; small.forEach(t => { const k = t.e.classList.contains('leaflet-marker-icon') ? (t.e.classList.contains('pin-cl') ? 'cluster' : 'pin') : zone(t.e); smallBy[k] = (smallBy[k] || 0) + 1; });
  const under24 = small.filter(t => t.w < 24 || t.h < 24);
  // map controls visible
  const ctl = [...D.querySelectorAll('.leaflet-control-container a, .leaflet-control-container button, .leaflet-control-container summary, .ms-toggle, .ms-here')].filter(vis).map(desc);
  const cards = [...D.querySelectorAll('li.pl')].filter(vis);
  const H1 = (D.querySelector('.ms-count') || {}).textContent || '';
  const counters = [...D.querySelectorAll('.ms-count, .ms-more, .ms-head *, .sm')].filter(vis).map(txt).filter(t => /\d/.test(t) && t.length < 80);
  return {
    vw: W, vh: H, cls: ['atlas-d', 'atlas-m', 'ms-list', 'ms-nomap'].filter(k => HTML.classList.contains(k)).join(' '), theme: HTML.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark(system)' : 'light'),
    map: mr ? { wPct: Math.round(mr.width / W * 100), top: Math.round(mr.top), left: Math.round(mr.left), h: Math.round(mr.height) } : null,
    mapSharePct: mapShare, mapClearPct: mapClear, chromeAbovePx: chromeAbove, overlayOnMapPct: mr ? Math.round(overlayPx / (W * H) * 100) : null,
    zoom: window.Cleo && Cleo.city.map && Cleo.city.map() ? Cleo.city.map().getZoom() : null,
    markers: { visible: mk.length, pins: pins.length, clusters: cls.length, numberedLabels: numbered.length, namedLabels: named.length, mustSeePins: pins.filter(e => e.classList.contains('pp-1')).length, foodPins: pins.filter(e => e.classList.contains('pp-f')).length, sightPins: pins.filter(e => e.classList.contains('pp-s')).length, closedPins: pins.filter(e => e.classList.contains('pp-x')).length, clusterCounts: cls.map(txt).map(Number).sort((a, b) => b - a).slice(0, 12), pinLabelsSample: pins.slice(0, 10).map(txt), coveredCentres: covered },
    canvas: (() => { const C = window.Cleo && Cleo.city, mm = C && C.map && C.map(); if (!mm) return null; const b = mm.getBounds(); let dots = 0, dotsShown = 0;
      for (const id in C.markers) { const k = C.markers[id]; if (!k || !k.getLatLng || k.getElement && k.getElement()) continue; if (!b.contains(k.getLatLng())) continue; dots++; if (k.options && k.options.opacity !== 0 && mm.hasLayer(k)) dotsShown++; }
      return { discs: C.discs || 0, dotsInView: dots, dotsShown }; })(),
    mapControls: ctl, cardsVisible: cards.length, countLine: H1.trim(), counterLines: [...new Set(counters)].slice(0, 12),
    fontSizes: fsum, contrast: { checked: cchk, fails: cfail.length, examples: cfail.slice(0, 8) },
    targets: { visible: targets.length, under44: small.length, under24: under24.length, by: smallBy, examples: small.slice(0, 10).map(t => desc(t.e) + ' ' + t.w + '×' + t.h) },
    nodes: D.getElementsByTagName('*').length, overflowX: HTML.scrollWidth - W, scrollY: Math.round(scrollY),
  };
};
const measure = page => page.evaluate(MEASURE);
const view = page => page.evaluate(() => { const m = window.Cleo && Cleo.city.map && Cleo.city.map(); if (!m) return null; const c = m.getCenter(); return { lat: +c.lat.toFixed(5), lng: +c.lng.toFixed(5), z: m.getZoom() }; });
const nIn = s => +((/([\d,]+)/.exec(s || '') || [0, '0'])[1].replace(/,/g, ''));

// a pin (not a cluster) well inside the map, zooming in until one is available
async function pinTarget(page, phone) {
  for (let i = 0; i < 5; i++) {
    const t = await page.evaluate(phone => { const mr = document.getElementById('cleo-map').getBoundingClientRect(), lp = document.querySelector('.listpane');
      const bot = phone && lp && lp.offsetHeight ? lp.getBoundingClientRect().top - 60 : mr.bottom - 80, top = (phone ? 230 : mr.top + 80);
      const els = [...document.querySelectorAll('.leaflet-marker-icon.pp')].map(e => [e, (e.firstElementChild || e).getBoundingClientRect()]).filter(([e, r]) => r.left > mr.left + 60 && r.right < mr.right - 70 && r.top > top && r.bottom < bot)
        .filter(([e, r]) => { const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return h && e.contains(h); });
      els.sort((a, b) => (b[0].classList.contains('pp-1') - a[0].classList.contains('pp-1')));
      const [e, r] = els[0] || []; return e ? { x: r.left + r.width / 2, y: r.top + r.height / 2, label: e.textContent } : null; }, phone);
    if (t) return t;
    await page.evaluate(() => { const m = Cleo.city.map(); m.setZoom(m.getZoom() + 1, { animate: false }); }); await sleep(700);
  }
  return null;
}

(async () => {
  fs.mkdirSync(SH, { recursive: true });
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const M = { root: path.relative(process.cwd(), ROOT) || '.', tiles: 'stub = flat neutral land colour; basemap NOT judged from these', pages: {}, tasks: {} };
  const log = (...a) => console.log(...a);
  for (const [key, url] of PAGES) {
    const P = M.pages[key] = { url };
    // 1. default view: both viewports, light and dark
    for (const vk of ['d', 'm']) for (const dark of [false, true]) {
      const t = dark ? 'dark' : 'light', { ctx, page, errors } = await open(browser, vk, url + '#view=atlas', { tiles: 'stub', dark });
      const ms = await measure(page); ms.firstLoadKB = { raw: Math.round(ctx.bytes / 1024), gzipText: Math.round(ctx.gz / 1024), requests: ctx.reqs };
      ms.total = await page.evaluate(() => Cleo.city.info.total); ms.view = await view(page); ms.errors = errors;
      P[`${vk}-${t}-default`] = ms; await snap(page, `${key}-${vk === 'd' ? 1440 : 390}-${t}-default`, `${key} ${vk === 'd' ? 'desktop' : 'phone'} ${t}: Atlas default view`);
      log(key, vk, t, 'default', JSON.stringify({ share: ms.mapSharePct, clear: ms.mapClearPct, chrome: ms.chromeAbovePx, mk: ms.markers.visible, num: ms.markers.numberedLabels, nodes: ms.nodes, kb: ms.firstLoadKB }));
      // 2. zoomed in two steps
      await page.evaluate(() => { const m = Cleo.city.map(); m && m.setZoom(m.getZoom() + 2, { animate: false }); }); await sleep(900);
      P[`${vk}-${t}-zoom2`] = await measure(page); await snap(page, `${key}-${vk === 'd' ? 1440 : 390}-${t}-zoomed`, `${key} ${t}: zoomed in two steps from default`);
      // 3. a pin selected (desktop: preview card; phone: carousel card)
      const tp = await pinTarget(page, vk === 'm');
      if (tp) {
        if (vk === 'm') await page.touchscreen.tap(tp.x, tp.y); else { await page.mouse.move(tp.x, tp.y); await sleep(120); await page.mouse.click(tp.x, tp.y); }
        await sleep(900);
        const sel = await page.evaluate(() => { const p = document.getElementById('cleo-poi'), c = document.querySelector('li.pl.is-sel'), pin = document.querySelector('.leaflet-marker-icon.pp.sel');
          const pv = p && !p.hidden && p.offsetHeight ? { text: p.innerText.replace(/\s+/g, ' ').slice(0, 260), photo: !!p.querySelector('img'), h: p.offsetHeight, w: p.offsetWidth, fs: [...p.querySelectorAll('*')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim())).map(e => parseFloat(getComputedStyle(e).fontSize)) } : null;
          const r = c && c.getBoundingClientRect();
          return { preview: pv, card: c ? { id: c.id, inView: r.top < innerHeight && r.bottom > 0 && r.left < innerWidth && r.right > 0, text: c.innerText.replace(/\s+/g, ' ').slice(0, 200) } : null, pinSelected: !!pin, pinLabel: pin && pin.textContent }; });
        P[`${vk}-${t}-select`] = Object.assign({ tapped: tp.label }, sel, { m: await measure(page) });
        await snap(page, `${key}-${vk === 'd' ? 1440 : 390}-${t}-pin-selected`, `${key} ${t}: a pin selected (${vk === 'd' ? 'preview card' : 'carousel card'})`);
      } else P[`${vk}-${t}-select`] = { tapped: null };
      if (!dark && vk === 'd') {
        // 4. list after a pan
        await page.keyboard.press('Escape'); await sleep(200);
        const before = await measure(page);
        await page.evaluate(() => { const m = Cleo.city.map(), s = m.getSize(); m.panBy([s.x * 0.4, -s.y * 0.3], { animate: false }); }); await sleep(900);
        const after = await measure(page);
        P['d-light-pan'] = { before: before.countLine, after: after.countLine, more: await page.evaluate(() => (document.querySelector('.ms-more') || {}).textContent || ''), cardsVisible: after.cardsVisible, firstCards: await page.evaluate(() => [...document.querySelectorAll('li.pl')].filter(e => e.offsetParent).slice(0, 4).map(e => (e.querySelector('.pl-n') || e).textContent.trim().slice(0, 40))) };
        await snap(page, `${key}-1440-light-list-after-pan`, `${key} desktop: the list after a pan`);
      }
      if (!dark && vk === 'm') {
        // 5. phone list mode
        const tg = await page.$('.ms-toggle'); if (tg) { await page.evaluate(() => { const m = Cleo.city.map(); m && m.closePopup && 0; }); await tg.click(); await sleep(700); P['m-light-list'] = await measure(page); await snap(page, `${key}-390-light-list-mode`, `${key} phone: List mode`); }
      }
      if (errors.length) P[`${vk}-${t}-errors`] = errors.slice(0, 3);
      await ctx.close();
    }
    // 6. tiles blocked, map library blocked
    for (const [tk, mode] of [['tiles-blocked', 'blocked'], ['library-blocked', 'nolib']]) for (const vk of ['d', 'm']) {
      const { ctx, page, errors } = await open(browser, vk, url + '#view=atlas', { tiles: mode, wait: 2600 });
      const ms = await measure(page); ms.total = await page.evaluate(() => Cleo.city.info.total);
      ms.listed = await page.evaluate(() => document.querySelectorAll('li.pl').length + (window.Cleo && Cleo.defer && Cleo.defer.peek ? Cleo.defer.peek().length : 0));
      ms.notice = await page.evaluate(() => [...document.querySelectorAll('.ms-nomap-n, #cleo-map, .ms-head p')].filter(e => e.offsetParent).map(e => e.innerText.trim().slice(0, 120)).filter(Boolean).slice(0, 3));
      ms.errors = errors; P[`${vk}-${tk}`] = ms; await snap(page, `${key}-${vk === 'd' ? 1440 : 390}-${tk}`, `${key}: ${tk.replace('-', ' ')}`);
      await ctx.close();
    }
    // 7. #p= detail round-trip from a card: the map view before / after
    const layout = pg => pg.evaluate(() => { const m = document.querySelector('#cleo-map, .leaflet-container'), q = document.querySelector('input[type=search], .spill input');
      let maxScroll = 0; for (let e = m && m.parentElement; e; e = e.parentElement) maxScroll = Math.max(maxScroll, e.scrollTop || 0);
      return { mapTop: m ? Math.round(m.getBoundingClientRect().top) : null, searchTop: q ? Math.round(q.getBoundingClientRect().top) : null, ancestorScroll: maxScroll, winScroll: scrollY }; });
    for (const vk of ['d', 'm']) {
      const { ctx, page, errors } = await open(browser, vk, url + '#view=atlas', { tiles: 'stub' });
      await page.evaluate(() => { const m = Cleo.city.map(); m && m.setZoom(m.getZoom() + 1, { animate: false }); }); await sleep(800);
      const L0 = await layout(page), v0 = await view(page), h0 = await page.evaluate(() => location.hash), sc0 = await page.evaluate(() => { const l = document.querySelector('.listpane'); return l ? [l.scrollTop, l.scrollLeft] : null; });
      const link = await page.evaluateHandle(() => [...document.querySelectorAll('li.pl .pl-n a')].find(a => { const r = a.getBoundingClientRect(); return r.width && r.top > 0 && r.bottom < innerHeight && r.left >= 0 && r.right <= innerWidth; }));
      let rt = { opened: false };
      if (link.asElement()) {
        const nm = await link.evaluate(a => a.textContent.trim());
        await link.asElement().click(); await sleep(1000);
        const det = await page.evaluate(() => { const s = document.querySelector('#cleo-sheet:not([hidden])'); if (!s) return null; const t = s.innerText;
          return { hash: location.hash, srcCount: s.querySelectorAll('.srclist > li').length, why: (s.querySelector('.why') || {}).textContent || '', closedShown: /closed/i.test(t), hasShare: !!s.querySelector('[data-sh="share"]'), sheetW: s.querySelector('.sheet').offsetWidth, mapVisibleBeside: (() => { const m = document.getElementById('cleo-map'), r = m && m.getBoundingClientRect(), sr = s.querySelector('.sheet').getBoundingClientRect(); return r ? Math.round(Math.max(0, Math.min(r.right, sr.left) - r.left) / innerWidth * 100) : 0; })() }; });
        await snap(page, `${key}-${vk === 'd' ? 1440 : 390}-detail-from-card`, `${key}: place detail opened from a card`);
        const v1 = await view(page);
        await page.keyboard.press('Escape'); await sleep(700);
        const L2 = await layout(page), v2 = await view(page), h2 = await page.evaluate(() => location.hash), sc2 = await page.evaluate(() => { const l = document.querySelector('.listpane'); return l ? [l.scrollTop, l.scrollLeft] : null; });
        const focusBack = await page.evaluate(() => { const a = document.activeElement; return a ? (a.closest('li.pl') ? 'card ' + a.closest('li.pl').id : a.tagName + '.' + a.className) : null; });
        await snap(page, `${key}-${vk === 'd' ? 1440 : 390}-after-detail-close`, `${key}: back from the detail (Escape)`);
        // and with the browser Back button
        await link.asElement().click().catch(() => {}); await sleep(900); await page.goBack().catch(() => {}); await sleep(900);
        const L3 = await layout(page), v3 = await view(page), h3 = await page.evaluate(() => location.hash);
        rt = { opened: !!det, name: nm, detail: det, viewBefore: v0, viewDuringDetail: v1, viewAfterEscape: v2, viewAfterBack: v3, hashBefore: h0, hashAfterEscape: h2, hashAfterBack: h3, listScrollBefore: sc0, listScrollAfter: sc2, focusAfterClose: focusBack, layoutBefore: L0, layoutAfterEscape: L2, layoutAfterBack: L3,
          layoutKept: !!(L0 && L2 && L3 && L0.mapTop === L2.mapTop && L0.mapTop === L3.mapTop && L2.ancestorScroll === 0 && L3.ancestorScroll === 0),
          viewKept: !!(v0 && v2 && Math.abs(v0.lat - v2.lat) < 0.002 && Math.abs(v0.lng - v2.lng) < 0.002 && v0.z === v2.z) };
      }
      rt.errors = errors; P[`${vk}-roundtrip`] = rt; await ctx.close();
    }
    // 8. deep link #p= (fresh load)
    { const id = (/<li class="pl[^"]*" id="p-([a-z0-9-]+)"[^>]*data-ll="/.exec(fs.readFileSync(path.join(ROOT, url), 'utf8')) || [])[1];
      for (const vk of ['d', 'm']) { const { ctx, page, errors } = await open(browser, vk, url + '#view=atlas&p=' + id, { tiles: 'stub', wait: 1600 });
        P[`${vk}-deeplink`] = await page.evaluate(id => { const m = Cleo.city.map(), c = document.getElementById('p-' + id), ll = c.getAttribute('data-ll').split(',').map(Number); const ctr = m && m.getCenter(); const pt = m && m.latLngToContainerPoint(ll), sz = m && m.getSize();
          const sheet = document.querySelector('#cleo-sheet:not([hidden]) .sheet'), sr = sheet && sheet.getBoundingClientRect(), mr = document.getElementById('cleo-map').getBoundingClientRect();
          const px = pt ? [mr.left + pt.x, mr.top + pt.y] : null, hidden = !!(px && sr && px[0] >= sr.left && px[0] <= sr.right && px[1] >= sr.top && px[1] <= sr.bottom);
          return { id, sheet: !!sheet, inBounds: !!m && m.getBounds().contains(ll), pinOffsetFromCentrePx: pt ? Math.round(Math.hypot(pt.x - sz.x / 2, pt.y - sz.y / 2)) : null, pinUnderSheet: hidden, zoom: m && m.getZoom() }; }, id);
        P[`${vk}-deeplink`].errors = errors; await snap(page, `${key}-${vk === 'd' ? 1440 : 390}-deeplink`, `${key}: #view=atlas&p=${id} fresh load`); await ctx.close(); }
    }
    // 9. 200 % zoom (a 1440×900 window at 200 %)
    { const { ctx, page, errors } = await open(browser, 'z200', url + '#view=atlas', { tiles: 'stub', wait: 1500 });
      P['z200-default'] = await measure(page); P['z200-default'].errors = errors; await snap(page, `${key}-200pct-default`, `${key}: 200 % zoom (720×450 CSS px)`);
      const tg = await page.$('.ms-toggle'); if (tg && await tg.isVisible()) { await tg.click(); await sleep(600); P['z200-list'] = await measure(page); await snap(page, `${key}-200pct-list`, `${key}: 200 % zoom, list`); }
      await ctx.close(); }
  }

  // ---------- keyboard-only (desktop, Tokyo + Cleveland) ----------
  for (const [key, url] of PAGES.filter(p => ['tokyo', 'cleveland'].includes(p[0]))) {
    const { ctx, page, errors } = await open(browser, 'd', url + '#view=atlas', { tiles: 'stub' });
    const stops = []; let firstCard = -1, firstPin = -1, mapFocus = -1, noRing = 0;
    for (let i = 0; i < 450; i++) {
      await page.keyboard.press('Tab'); await sleep(30);
      const s = await page.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const st = getComputedStyle(a); let r = a.getBoundingClientRect(); if (r.width === 0 && a.firstElementChild) r = a.firstElementChild.getBoundingClientRect();   // a pin's anchor is 0x0; its pill is the first child
        const hasRing = x => { const q = getComputedStyle(x); return (q.outlineStyle !== 'none' && parseFloat(q.outlineWidth) > 0) || (q.boxShadow && q.boxShadow !== 'none'); };
        let ring = hasRing(a); for (let p = a.parentElement, i = 0; !ring && p && i < 3; p = p.parentElement, i++) ring = p.matches(':focus-within') && hasRing(p);   // a wrapper's :focus-within ring counts
        return { d: (a.className && a.className.baseVal === undefined ? a.tagName.toLowerCase() + '.' + String(a.className).split(' ')[0] : a.tagName.toLowerCase()) + ' ' + (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30), card: !!a.closest('li.pl'), pin: a.classList.contains('leaflet-marker-icon'), map: a.id === 'cleo-map' || a.classList.contains('leaflet-container'), ring, onScreen: r.bottom > 0 && r.top < innerHeight && r.width > 0 }; });
      if (!s) continue; stops.push(s);
      if (s.card && firstCard < 0) firstCard = stops.length; if (s.pin && firstPin < 0) firstPin = stops.length; if (s.map && mapFocus < 0) mapFocus = stops.length; if (!s.ring) noRing++;
      if (firstCard > 0 && (firstPin > 0 || mapFocus > 0) && stops.length > Math.max(firstCard, firstPin, mapFocus) + 3) break;   // R2 erratum: scan until the map and a pin are reached
    }
    // map keyboard: focus the map, arrows pan, +/- zoom
    let mapKeys = null;
    if (mapFocus > 0) { await page.focus('#cleo-map').catch(() => {}); const v0 = await view(page); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await sleep(500); const v1 = await view(page); await page.keyboard.press('Equal'); await sleep(500); const v2 = await view(page); mapKeys = { v0, afterArrows: v1, afterPlus: v2, list: await page.evaluate(() => (document.querySelector('.ms-count') || {}).textContent) }; }
    // a card by keyboard: Enter opens the detail, Escape closes, focus returns
    await page.focus('li.pl .pl-n a'); const nm = await page.evaluate(() => document.activeElement.textContent.trim());
    await page.keyboard.press('Enter'); await sleep(900);
    const kOpen = await page.evaluate(() => ({ sheet: !!document.querySelector('#cleo-sheet:not([hidden])'), focus: document.activeElement && (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent || '').trim().slice(0, 30) }));
    await snap(page, `${key}-1440-keyboard-detail`, `${key}: keyboard — Enter on a card opens the detail`);
    // a pin preview by keyboard? (Tab inside the open detail first)
    await page.keyboard.press('Escape'); await sleep(600);
    const kBack = await page.evaluate(() => ({ sheet: !!document.querySelector('#cleo-sheet:not([hidden])'), focus: document.activeElement && (document.activeElement.closest('li.pl') ? 'card ' + document.activeElement.closest('li.pl').id : document.activeElement.tagName) }));
    await page.focus('li.pl .pl-n a'); await sleep(200); await snap(page, `${key}-1440-keyboard-card-focus`, `${key}: keyboard focus on a card (pin highlight?)`);
    const pinHot = await page.evaluate(() => !!document.querySelector('.leaflet-marker-icon.hot'));
    M.tasks[`keyboard-${key}`] = { tabsToFirstCard: firstCard, tabsToFirstPin: firstPin, mapFocusableAt: mapFocus, stopsWithoutVisibleRing: noRing, of: stops.length, firstStops: stops.slice(0, Math.max(firstCard + 2, 16)).map(s => s.d + (s.ring ? '' : ' [no ring]') + (s.onScreen ? '' : ' [off-screen]')), mapKeys, cardEnter: { name: nm, ...kOpen }, escape: kBack, cardFocusLightsPin: pinHot, errors };
    await ctx.close();
  }

  // ---------- persona tasks ----------
  const T = M.tasks;
  // T1 — Tokyo: three must-sees, one for tonight, save two (phone and desktop)
  for (const vk of ['m', 'd']) {
    if (!PAGES.some(p => p[0] === 'tokyo')) break;
    const { ctx, page, errors } = await open(browser, vk, 'beta/cities/tokyo.html#view=atlas', { tiles: 'stub' });
    const steps = [];
    const firstScreen = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width && r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth; };
      return { namesVisible: [...document.querySelectorAll('li.pl .pl-n')].filter(vis).map(e => e.textContent.trim().slice(0, 40)), mustSeeNamedOnMap: [...document.querySelectorAll('.leaflet-marker-icon.pp-1')].filter(e => vis(e.firstElementChild || e)).map(e => e.textContent.trim()) }; });
    steps.push('open Atlas: names readable on first screen = ' + firstScreen.namesVisible.length + ' (' + firstScreen.namesVisible.slice(0, 4).join(' | ') + '); must-see pins on map show only "' + firstScreen.mustSeeNamedOnMap.slice(0, 5).join('", "') + '"');
    await page.click('.ms-bar .ms-must'); await sleep(900); steps.push('tap "Must see" chip');
    const ms = await page.evaluate(() => ({ count: (document.querySelector('.ms-count') || {}).textContent, names: [...document.querySelectorAll('li.pl')].filter(e => e.offsetParent && !e.hidden).slice(0, 6).map(e => e.querySelector('.pl-n').textContent.trim().slice(0, 40)) }));
    await snap(page, `T1-tokyo-${vk === 'd' ? 1440 : 390}-must-see`, 'T1: Tokyo after the Must see chip');
    // must-see names readable without scrolling/swiping
    const readable = await page.evaluate(() => [...document.querySelectorAll('li.pl .pl-n')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth && !e.closest('li.pl').hidden; }).length);
    let swipes = 0; if (vk === 'm' && readable < 3) { swipes = 3 - readable; steps.push(`swipe the carousel ${swipes}× to read three names (one card per screen)`); }
    // "tonight": is there any opening-hours / evening signal on cards or in the detail?
    const tonight = await page.evaluate(() => { const t = [...document.querySelectorAll('li.pl')].slice(0, 200).map(e => e.innerText).join(' '); return { hoursOnCards: /\b(open (now|until|late)|hours|closes|\d{1,2}(:\d\d)?\s?(am|pm))\b/i.test(t), eveningWords: (t.match(/\b(night|evening|late|bar|izakaya|illuminat)\w*/gi) || []).length }; });
    steps.push('find one for tonight: opening hours on cards = ' + tonight.hoursOnCards + '; evening words in card text = ' + tonight.eveningWords);
    // save two
    const saveSel = 'li.pl:not([hidden]) button.pl-save';
    const saves = await page.$$(saveSel); let saved = 0;
    for (let i = 0; i < 2 && i < saves.length; i++) { if (vk === 'm' && i === 1) { await page.evaluate(() => { const l = document.querySelector('.listpane'); l.scrollBy({ left: l.clientWidth * 0.86 }); }); await sleep(600); steps.push('swipe to the next card'); }
      const ok = await saves[i].isVisible(); if (ok) { await saves[i].click({ timeout: 3000 }).catch(() => {}); saved++; steps.push('tap heart ' + (i + 1)); await sleep(300); } }
    const savedN = await page.evaluate(() => { const b = document.querySelector('[data-cleo-mine-n], .ms-mine'); return b ? b.textContent.trim() : null; });
    await snap(page, `T1-tokyo-${vk === 'd' ? 1440 : 390}-saved`, 'T1: after saving two');
    T[`T1-${vk}`] = { steps: steps.length, log: steps, mustSeeChip: ms, readableNamesAfterChip: readable, saved, savedIndicator: savedN, errors };
    await ctx.close();
  }
  // T2 — half-day in one neighbourhood + lunch (Cleveland University Circle; Tokyo Taitō-ku)
  for (const [key, url, area] of [['cleveland', 'beta/cleveland.html', /University Circle/i], ['tokyo', 'beta/cities/tokyo.html', /Tait/i]]) for (const vk of ['d', 'm']) {
    if (!PAGES.some(p => p[0] === key)) continue;
    const { ctx, page, errors } = await open(browser, vk, url + '#view=atlas', { tiles: 'stub' }); const steps = []; let found = false;
    const chips = await page.$$('.ms-head [data-cleo-area]');
    for (const c of chips) { const t = await c.textContent(); if (area.test(t)) { if (!(await c.isVisible())) steps.push('scroll the area-chip row to find it'); await c.scrollIntoViewIfNeeded(); await c.click(); found = true; steps.push('tap area chip "' + t.trim() + '"'); break; } }
    if (!found) { const ab = await page.$('.ms-bar .area-btn'); if (ab && await ab.isVisible()) { await ab.click(); await sleep(600); steps.push('open "Area"'); const pill = (await page.$$('#cleo-tray .pill[data-f="a"]')); for (const p of pill) { if (area.test(await p.textContent())) { await p.click(); steps.push('pick "' + (await p.textContent()).trim() + '"'); await page.click('#cleo-tray [data-tr="go"]'); steps.push('tap "Show N places"'); found = true; break; } } } }
    await sleep(1100);
    const a1 = await page.evaluate(() => ({ count: (document.querySelector('.ms-count') || {}).textContent, view: (() => { const m = Cleo.city.map(); return m ? m.getZoom() : null; })(), top: [...document.querySelectorAll('li.pl')].filter(e => e.offsetParent && !e.hidden).slice(0, 5).map(e => e.querySelector('.pl-n').textContent.trim().slice(0, 36) + ' [' + e.getAttribute('data-k') + ']') }));
    await snap(page, `T2-${key}-${vk === 'd' ? 1440 : 390}-area`, `T2: ${key} neighbourhood chosen`);
    const food = await page.$('.ms-bar button[data-mode="food"]'); if (food) { try { await food.click({ timeout: 3000 }); steps.push('tap "Eat & drink"'); } catch (e) { await food.evaluate(b => b.click()); steps.push('tap "Eat & drink": BLOCKED by an overlay; scripted click'); } await sleep(900); }
    const a2 = await page.evaluate(() => ({ count: (document.querySelector('.ms-count') || {}).textContent, top: [...document.querySelectorAll('li.pl')].filter(e => e.offsetParent && !e.hidden).slice(0, 5).map(e => e.querySelector('.pl-n').textContent.trim().slice(0, 36)) }));
    await snap(page, `T2-${key}-${vk === 'd' ? 1440 : 390}-lunch`, `T2: ${key} Eat & drink in that area`);
    const dayRoute = await page.evaluate(() => !!document.querySelector('[data-cleo-day]'));
    T[`T2-${key}-${vk}`] = { steps: steps.length + 1, log: steps, areaFound: found, afterArea: a1, afterFood: a2, dayRouteEntryOnPage: dayRoute, errors };
    await ctx.close();
  }
  // T3 — at a fixed spot, the best food within ~15 min walk (≈1.2 km). Tokyo: Shibuya crossing area 35.6595,139.7005
  for (const vk of ['d', 'm']) {
    if (!PAGES.some(p => p[0] === 'tokyo')) break;
    const geo = { latitude: 35.6595, longitude: 139.7005 };
    const { ctx, page, errors } = await open(browser, vk, 'beta/cities/tokyo.html#view=atlas', { tiles: 'stub', geo }); const steps = [];
    const loc = await page.$('.leaflet-control-container [aria-label*="ocat"], .leaflet-control-container [title*="ocat"], .leaflet-control-container .ms-loc, .leaflet-control-container a[role="button"][aria-label*="me"]');
    let locOk = false, locCovered = null;
    if (loc && await loc.isVisible()) {
      try { await loc.click({ timeout: 3000 }); steps.push('tap locate-me'); locOk = true; }
      catch (e) { locCovered = (/<([a-z]+) class="([^"]+)"[^>]*>…<\/\1> from .* subtree intercepts pointer events/.exec(String(e)) || [])[2] || 'another element';
        steps.push('tap locate-me: BLOCKED, the tap lands on "' + locCovered + '"; fell back to a scripted click'); await loc.evaluate(b => b.click()); locOk = 'scripted'; }
      await sleep(1500); }
    const v = await view(page);
    const d0 = await page.evaluate(g => { const R = 6371, rad = x => x * Math.PI / 180, dist = (a, b) => { const dl = rad(b[0] - a[0]), dn = rad(b[1] - a[1]); const h = Math.sin(dl / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
      const all = [...document.querySelectorAll('li.pl[data-ll]')].map(e => ({ n: e.querySelector('.pl-n').textContent.trim().slice(0, 36), k: e.getAttribute('data-k'), t: e.getAttribute('data-t'), d: dist([g.latitude, g.longitude], e.getAttribute('data-ll').split(',').map(Number)) }));
      const near = all.filter(x => x.k === 'f' && x.d <= 1.2).sort((a, b) => (a.t - b.t) || a.d - b.d);
      return { foodWithin1200m: near.length, bestByTier: near.slice(0, 5).map(x => x.n + ' (' + x.d.toFixed(2) + ' km, tier ' + x.t + ')') }; }, geo);
    await snap(page, `T3-tokyo-${vk === 'd' ? 1440 : 390}-located`, 'T3: after locate-me at the fixed spot');
    const food = await page.$('.ms-bar button[data-mode="food"]'); if (food) { try { await food.click({ timeout: 3000 }); steps.push('tap "Eat & drink"'); } catch (e) { await food.evaluate(b => b.click()); steps.push('tap "Eat & drink": BLOCKED by an overlay; scripted click'); } await sleep(1000); }
    const shown = await page.evaluate(() => ({ count: (document.querySelector('.ms-count') || {}).textContent, top: [...document.querySelectorAll('li.pl')].filter(e => e.offsetParent && !e.hidden).slice(0, 5).map(e => e.querySelector('.pl-n').textContent.trim().slice(0, 36) + ((e.querySelector('.pl-dist') || {}).textContent ? ' · ' + e.querySelector('.pl-dist').textContent : '')) }));
    await snap(page, `T3-tokyo-${vk === 'd' ? 1440 : 390}-food-near`, 'T3: Eat & drink after locate-me');
    // is there a "near me" sort reachable from Atlas?
    const nearSort = await page.evaluate(() => [...document.querySelectorAll('select option, [data-v="near"], [data-cleo-near]')].map(e => (e.textContent || e.value || '').trim()).filter(t => /near|distance/i.test(t)).slice(0, 3));
    T[`T3-${vk}`] = { steps: steps.length + 1, log: steps, locateFound: locOk, locateCoveredBy: locCovered, viewAfterLocate: v, truth: d0, listShows: shown, nearSortOptions: nearSort, errors };
    await ctx.close();
  }
  // T4 — closed place in Cleveland: pin, card and detail mark it
  if (PAGES.some(p => p[0] === 'cleveland')) {
    const { ctx, page, errors } = await open(browser, 'd', 'beta/cleveland.html#view=atlas', { tiles: 'stub' });
    const c = await page.evaluate(() => { const e = document.querySelector('li.pl[data-closed]'); if (!e) return null; const id = e.id.slice(2), mk = Cleo.city.markers[id], el = mk && mk.getElement && mk.getElement();
      return { id, name: e.querySelector('.pl-n').textContent.trim(), cardText: e.innerText.replace(/\s+/g, ' ').slice(0, 160), pinClass: el ? el.className : '(clustered or not drawn at this zoom)', closedCount: document.querySelectorAll('li.pl[data-closed]').length }; });
    if (c) { await page.evaluate(id => { location.hash = '#view=atlas&p=' + id; }, c.id); await sleep(1200); c.detail = await page.evaluate(() => { const s = document.querySelector('#cleo-sheet:not([hidden])'); return s ? s.innerText.replace(/\s+/g, ' ').slice(0, 300) : null; });
      c.pinClassAtPlace = await page.evaluate(id => { const el = Cleo.city.markers[id] && Cleo.city.markers[id].getElement(); return el ? el.className + ' label="' + el.textContent + '"' : null; }, c.id);
      await snap(page, 'T4-cleveland-1440-closed-place', 'T4: a closed place opened in Atlas'); }
    T['T4-closed'] = Object.assign({ errors }, c || { none: true });
    await ctx.close();
  }
  // T5 — share a place / the current map view
  for (const vk of ['d', 'm']) {
    if (!PAGES.some(p => p[0] === 'tokyo')) break;
    const { ctx, page, errors } = await open(browser, vk, 'beta/cities/tokyo.html#view=atlas', { tiles: 'stub' });
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
    await page.evaluate(() => { const m = Cleo.city.map(); m.setView([35.7148, 139.7967], 15, { animate: false }); }); await sleep(900);   // Asakusa
    const viewHash = await page.evaluate(() => location.href.replace(/^https:\/\/cleo\.local\//, ''));
    const link = await page.evaluateHandle(() => [...document.querySelectorAll('li.pl .pl-n a')].find(a => { const r = a.getBoundingClientRect(); return r.width && r.top > 0 && r.bottom < innerHeight && r.left >= 0 && r.right <= innerWidth; }));
    let share = null;
    if (link.asElement()) { await link.asElement().click(); await sleep(900);
      const btn = await page.$('#cleo-sheet [data-sh="share"]');
      if (btn) { await btn.click(); await sleep(600); share = await page.evaluate(async () => { let clip = null; try { clip = await navigator.clipboard.readText(); } catch (e) { clip = 'unreadable'; } const toast = [...document.querySelectorAll('[role="status"], .toast, [aria-live]')].map(e => e.textContent.trim()).filter(Boolean).slice(0, 2); return { clip, toast, hash: location.hash }; }); }
      await snap(page, `T5-tokyo-${vk === 'd' ? 1440 : 390}-share`, 'T5: share from the detail'); }
    // reopen the shared link in a fresh context; and reopen the "current view" URL
    let reopen = null, reopenView = null;
    if (share && share.clip && /^https?:/.test(share.clip)) { const u = share.clip.replace(/^https?:\/\/[^/]+\/(cleo-guide\/)?/, ''); const r = await open(browser, vk, u.startsWith('beta/') ? u : 'beta/cities/tokyo.html' + (u.includes('#') ? u.slice(u.indexOf('#')) : ''), { tiles: 'stub', wait: 1600 });
      reopen = await r.page.evaluate(() => ({ hash: location.hash, sheet: !!document.querySelector('#cleo-sheet:not([hidden])'), title: (document.querySelector('#sh-t') || {}).textContent, atlas: document.documentElement.classList.contains('ms-on') })); reopen.sharedUrl = share.clip; await r.ctx.close(); }
    { const r = await open(browser, vk, viewHash, { tiles: 'stub', wait: 1400 }); reopenView = { url: viewHash, view: await view(r.page), wanted: { lat: 35.7148, lng: 139.7967, z: 15 } }; await snap(r.page, `T5-tokyo-${vk === 'd' ? 1440 : 390}-reopen-view`, 'T5: reopening the URL copied while looking at Asakusa'); await r.ctx.close(); }
    T[`T5-${vk}`] = { share, reopen, reopenView, mapViewInUrl: /[@&](ll|c|center|z|at)=/.test(viewHash), errors };
    await ctx.close();
  }

  await browser.close();
  M.shots = shots;
  fs.writeFileSync(path.join(OUT, 'measurements.json'), JSON.stringify(M, null, 1) + '\n');
  // readable summary
  const L = ['# Evidence pack — measurements', '', `Product tree: \`${M.root}\`. Tiles: ${M.tiles}.`, '', '## First screen (default Atlas view)', '', '| page | vp | theme | map share % (box / clear) | map width % | chrome above map px | visible markers (pins / clusters) | numbered labels | named labels | must-see pins | covered marker centres | targets < 44 px (< 24) | contrast fails / checked | min text px (card / chrome / pin) | nodes | first load KB (raw / text-gz) | canvas dots shown / density discs |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const k in M.pages) for (const vk of ['d', 'm']) for (const t of ['light', 'dark']) { const s = M.pages[k][`${vk}-${t}-default`]; if (!s) continue; const f = s.fontSizes;
    L.push(`| ${k} | ${vk === 'd' ? 1440 : 390} | ${t} | ${s.mapSharePct} / ${s.mapClearPct} | ${s.map && s.map.wPct} | ${s.chromeAbovePx} | ${s.markers.visible} (${s.markers.pins} / ${s.markers.clusters}) | ${s.markers.numberedLabels} | ${s.markers.namedLabels} | ${s.markers.mustSeePins} | ${s.markers.coveredCentres} | ${s.targets.under44} (${s.targets.under24}) | ${s.contrast.fails} / ${s.contrast.checked} | ${(f.card || {}).min} / ${(f.chrome || {}).min} / ${(f.pin || {}).min} | ${s.nodes} | ${s.firstLoadKB.raw} / ${s.firstLoadKB.gzipText} | ${s.canvas ? s.canvas.dotsShown + ' / ' + s.canvas.discs : '–'} |`); }
  L.push('', 'Full per-state data (zoomed, selected, pan, list mode, tiles/library blocked, round-trip, deep link, 200 %, keyboard, tasks) is in `measurements.json`.', '', '## Shots', '');
  shots.forEach(s => L.push(`- \`${s.file}\` — ${s.what}`));
  fs.writeFileSync(path.join(OUT, 'measurements.md'), L.join('\n') + '\n');
  log('done', shots.length, 'shots');
})();
