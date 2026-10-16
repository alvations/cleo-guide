#!/usr/bin/env node
'use strict';
/**
 * tools/beta/atlas-nav-ms.js — Atlas map interaction-state probes (Atlas FE-2 lane; PANEL-R1 #1, #3, #11, #13).
 *
 *   NODE_PATH=$(npm root -g) node tools/beta/atlas-nav-ms.js [--only tokyo] [--out <dir>]
 *
 * Run by tools/beta/atlas-ms.js too, so the Atlas gate covers it. Same harness rules: same-origin files from disk,
 * stub tiles drawn locally, anything else off-origin is aborted. Checks measure what the panel measures; they only
 * ever get stricter.
 *   #1  round-trip: a card or a pin → the detail → Escape / Back / Close, on 4 pages × 2 viewports: map centre within
 *       1 px, zoom identical, page scrollY and list scroll Δ 0, the List count unchanged, focus on the opener.
 *       Deep link #view=atlas&p=: the pin is not under the detail, and the page is not scrolled.
 *  #13  the view in the URL: panning writes #…&at=lat,lng,z by replaceState (no history entry); that URL reopens
 *       within 1 px and the same zoom; the share toast says exactly what the link opens.
 *  #11  keyboard: a skip link reaches the map and the list; the map is a Tab stop; pins are Tab stops (≤ 12 stops in);
 *       arrows on a pin move between pins in map-priority order; Enter opens the preview, Escape returns to the pin;
 *       every stop shows a visible ring.
 *   #3  near me (T3, Shibuya 35.6595, 139.7005 + Eat & drink): nearest first, every card shows a walking time, the
 *       first card within 1.2 km, Nonbei Yokochō or The Bellwood in the top 3, the carousel's first card in bounds,
 *       the phone pill equals the List-mode count. The location is never stored.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ONLY = arg('--only', '');
const OUT = arg('--out', '');
const BASE = 'https://cleo.local/';
const M = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const D = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
// a flat 256 px stub tile, drawn here (no tile host is ever contacted)
const TILE = (() => { const zlib = require('zlib'), T = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; T[n] = c >>> 0; }
  const crc = b => { let c = 0xffffffff; for (const x of b) c = T[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const ch = (t, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(t), data]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const W = 256, raw = Buffer.alloc((W * 3 + 1) * W, 236); for (let r = 0; r < W; r++) raw[r * (W * 3 + 1)] = 0;
  const ih = Buffer.alloc(13); ih.writeUInt32BE(W, 0); ih.writeUInt32BE(W, 4); ih[8] = 8; ih[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ch('IHDR', ih), ch('IDAT', zlib.deflateSync(raw)), ch('IEND', Buffer.alloc(0))]); })();
const PAGES = [['tokyo', 'beta/cities/tokyo.html'], ['cleveland', 'beta/cleveland.html'], ['newyork', 'beta/cities/newyork.html'], ['chinatown', 'beta/Singapore/chinatown.html']]
  .filter(p => !ONLY || ONLY.split(',').includes(p[0]));
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function open(browser, vp, url, o = {}) {
  const ctx = await browser.newContext(Object.assign({ reducedMotion: 'reduce', permissions: o.geo ? ['geolocation', 'clipboard-read', 'clipboard-write'] : ['clipboard-read', 'clipboard-write'], geolocation: o.geo }, vp));
  await ctx.route('**/*', route => {
    const u = new URL(route.request().url());
    if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u.host)) return route.fulfill({ body: TILE, headers: { 'content-type': 'image/png' } });
    if (u.origin + '/' !== BASE) return route.abort();
    const p = path.join(ROOT, decodeURIComponent(u.pathname));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return route.fulfill({ status: 404, body: 'not found' });
    return route.fulfill({ body: fs.readFileSync(p), headers: { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' } });
  });
  const page = await ctx.newPage(), errors = []; page.setDefaultTimeout(8000);
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));
  await page.goto(BASE + url, { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelector('.leaflet-marker-icon') || document.documentElement.classList.contains('ms-nomap'), null, { timeout: 8000 }).catch(() => {});
  await sleep(o.wait || 1600);
  return { ctx, page, errors };
}

// the whole Atlas state the round-trip must keep: the map (as a lat/lng + zoom), scrolls, the count, the pill
const snapState = page => page.evaluate(() => {
  const C = Cleo.city, m = C.map(), lp = document.querySelector('.listpane'), c = m && m.getCenter(), tg = document.querySelector('.ms-toggle');
  return { lat: c ? c.lat : null, lng: c ? c.lng : null, z: m ? m.getZoom() : null, scrollY: Math.round(scrollY), lpTop: lp ? Math.round(lp.scrollTop) : 0, lpLeft: lp ? Math.round(lp.scrollLeft) : 0,
    count: ((document.querySelector('.ms-count') || {}).textContent || '').trim(), pill: tg ? tg.textContent.trim() : '', hash: location.hash };
});
// how far (in px at the current zoom) the map centre moved from a saved lat/lng
const centrePx = (page, s) => page.evaluate(s => { const m = Cleo.city.map(); if (!m || s.lat === null) return null; const a = m.latLngToContainerPoint([s.lat, s.lng]), b = m.latLngToContainerPoint(m.getCenter()); return Math.round(Math.hypot(a.x - b.x, a.y - b.y) * 100) / 100; }, s);
const active = page => page.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return 'body';
  const li = a.closest('li.pl'); if (li) return 'card ' + li.id; const pin = a.closest('.leaflet-marker-icon'); if (pin) return 'pin p-' + pin.getAttribute('data-id'); return a.tagName.toLowerCase() + '.' + String(a.className).split(' ')[0]; });

// a card (desktop: in the list pane; phone: the carousel card nearest the middle) whose name link is fully on screen
// FE-1 (SPEC-v3 §2.2, rev 4): the phone's first screen is map + a list peek — the carousel (and its cards) appears after a
// selection, so on a phone with no card on screen a pin tap opens it first, as a reader would
const pickCard = async page => { let id = await pickCard0(page);
  if (!id && await page.evaluate(() => innerWidth < 1024 && !document.documentElement.classList.contains('ms-car'))) {
    await page.evaluate(() => { const e = [...document.querySelectorAll('#cleo-map .leaflet-marker-icon.pp')].find(x => { const r = x.getBoundingClientRect(); return r.top > 160 && r.bottom < innerHeight - 140 && r.left > 0 && r.right < innerWidth; }); if (e) e.click(); });
    // the tapped place may join the page as its last card: start from the carousel's first card, as a reader swiping back would
    await sleep(900); await page.evaluate(() => { const l = document.querySelector('.listpane'); if (l) l.scrollLeft = 0; }); await sleep(600); id = await pickCard0(page); }
  return id; };
const pickCard0 = page => page.evaluate(() => {
  const ok = a => { const r = a.getBoundingClientRect(), hit = r.width && document.elementFromPoint(r.left + Math.min(10, r.width / 2), r.top + r.height / 2); return r.width && r.top > 0 && r.bottom < innerHeight && r.left >= 0 && r.right <= innerWidth && hit && a.contains(hit); };
  const a = [...document.querySelectorAll('li.pl:not([hidden]):not(.ms-out) .pl-n a')].find(ok); return a ? a.closest('li.pl').id : null; });
// a labelled pin well inside the uncovered map
const pickPin = page => page.evaluate(() => {
  const mr = document.getElementById('cleo-map').getBoundingClientRect(), lp = document.querySelector('.listpane').getBoundingClientRect(), bar = document.querySelector('.ms-bar'), br = bar ? bar.getBoundingClientRect() : { bottom: 0 }, ph = innerWidth < 1024;
  const els = [...document.querySelectorAll('#cleo-map .leaflet-marker-icon.pp[data-id]')].map(e => [e, (e.firstElementChild || e).getBoundingClientRect()])
    .filter(([e, r]) => r.width && r.left > mr.left + 60 && r.right < (ph ? innerWidth : lp.left) - 60 && r.top > Math.max(mr.top, br.bottom) + 60 && r.bottom < (ph ? lp.top : mr.bottom) - 60);
  const [e] = els[Math.floor(els.length / 2)] || []; return e ? e.getAttribute('data-id') : null; });

async function roundTrip(page, vk, how, close) {
  // a settled view that is not the default fit: one zoom step in, and the list scrolled a little
  await page.evaluate(() => { const m = Cleo.city.map(); m.setZoom(m.getZoom() + 1, { animate: false }); }); await sleep(900);
  // desktop: the list scrolled so its third card sits mid-pane (so a lost list scroll shows)
  if (vk === 'd') { await page.evaluate(() => { const l = document.querySelector('.listpane'), c = [...l.querySelectorAll('li.pl:not([hidden]):not(.ms-out)')][2]; if (!c) return;
    l.scrollTop += c.getBoundingClientRect().top - l.getBoundingClientRect().top - l.clientHeight / 2; }); await sleep(300); }
  if (how === 'pin' && vk === 'd') {
    const id = await pickPin(page); if (!id) return { skipped: 'no pin in the clear map' };
    const s0 = await snapState(page);
    await page.focus(`#cleo-map .leaflet-marker-icon.pp[data-id="${id}"]`).catch(() => {});
    const el = await page.$(`#cleo-map .leaflet-marker-icon.pp[data-id="${id}"]`); const b = el && await el.boundingBox(); if (!b) return { skipped: 'pin gone' };
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await sleep(700);
    const pv = await page.$('#cleo-poi:not([hidden]) a.ms-pv'); if (!pv) return { skipped: 'no preview' };
    const s1 = await snapState(page);   // the preview may scroll the list to the card: that is the state the detail must keep
    await pv.click(); await sleep(1000);
    // the pin of the place that opened (pills can overlap, so the click may land on a neighbour): focus returns to it
    const opened = await page.evaluate(() => Cleo.route.parse().p || (/^#p-(.+)$/.exec(location.hash) || [])[1] || '');
    return finish(page, s1, 'pin p-' + (opened || id), close, s0);
  }
  const id = await pickCard(page); if (!id) return { skipped: 'no card on screen' };
  const s0 = await snapState(page);
  await page.click(`#${id} .pl-n a`); await sleep(1000);
  return finish(page, s0, 'card ' + id, close);
}
async function finish(page, s0, opener, close) {
  const sheet = await page.evaluate(() => !!document.querySelector('#cleo-sheet:not([hidden])'));
  if (close === 'esc') await page.keyboard.press('Escape');
  else if (close === 'back') await page.goBack().catch(() => {});
  else await page.click('#cleo-sheet [data-sh="x"]').catch(() => {});
  await sleep(1100);
  const s2 = await snapState(page), px = await centrePx(page, s0), f = await active(page), shut = await page.evaluate(() => !document.querySelector('#cleo-sheet:not([hidden])'));
  return { opener, sheet, shut, px, zoom: [s0.z, s2.z], scrollY: [s0.scrollY, s2.scrollY], list: [[s0.lpTop, s0.lpLeft], [s2.lpTop, s2.lpLeft]], count: [s0.count, s2.count], pill: [s0.pill, s2.pill], focus: f,
    ok: sheet && shut && px !== null && px <= 1 && s0.z === s2.z && s0.scrollY === s2.scrollY && s0.lpTop === s2.lpTop && s0.lpLeft === s2.lpLeft && s0.count === s2.count && s0.pill === s2.pill && f === opener };
}

(async () => {
  const browser = await chromium.launch();
  const R = {}; let fails = 0;
  const chk = (k, v, d) => { if (!v) fails++; console.log(`${v ? 'PASS' : 'FAIL'}  ${k}${d !== undefined ? '  ' + JSON.stringify(d) : ''}`); };
  for (const [key, url] of PAGES) {
    for (const [vk, vp] of [['d', D], ['m', M]]) {
      const vn = vk === 'd' ? '1440' : '390';
      // #1 round-trip: card × {Escape, Back, Close}; desktop also pin → preview → detail × Escape
      for (const [how, close] of [['card', 'esc'], ['card', 'back'], ['card', 'x']].concat(vk === 'd' ? [['pin', 'esc']] : [])) {
        const { ctx, page, errors } = await open(browser, vp, url + '#view=atlas');
        const r = await roundTrip(page, vk, how, close); R[`${key}-${vn}-${how}-${close}`] = r;
        chk(`#1 ${key} ${vn}: ${how} → detail → ${close === 'x' ? 'Close' : close === 'esc' ? 'Escape' : 'Back'} keeps centre (≤ 1 px), zoom, scroll, count, pill and focus`, r.ok, r);
        if (errors.length) chk(`#1 ${key} ${vn} ${how}/${close}: 0 page errors`, false, errors.slice(0, 2));
        await ctx.close();
      }
      // #1 deep link: the pin is clear of the detail, and the page is not scrolled
      { const id = (/<li class="pl[^"]*" id="p-([a-z0-9-]+)"[^>]*data-ll="/.exec(fs.readFileSync(path.join(ROOT, url), 'utf8')) || [])[1];
        const { ctx, page, errors } = await open(browser, vp, url + '#view=atlas&p=' + id);
        const r = await page.evaluate(id => { const m = Cleo.city.map(), c = document.getElementById('p-' + id), ll = c.getAttribute('data-ll').split(',').map(Number), pt = m && m.latLngToContainerPoint(ll);
          const sh = document.querySelector('#cleo-sheet:not([hidden]) .sheet'), sr = sh && sh.getBoundingClientRect(), mr = document.getElementById('cleo-map').getBoundingClientRect();
          const px = pt ? [mr.left + pt.x, mr.top + pt.y] : null, under = !!(px && sr && px[0] >= sr.left && px[0] <= sr.right && px[1] >= sr.top && px[1] <= sr.bottom);
          const onMap = !!px && px[0] >= mr.left && px[0] <= mr.right && px[1] >= mr.top && px[1] <= mr.bottom;
          // R7-g4 (c): "not scrolled" means the window AND every ancestor of the map (Atlas holds html/body at overflow:hidden)
          const anc = []; for (let e = document.getElementById('cleo-map').parentElement; e; e = e.parentElement) if (e.scrollTop) anc.push((e.id || e.tagName.toLowerCase()) + ' ' + e.scrollTop);
          return { sheet: !!sh, pinUnderSheet: under, onMap, z: m && m.getZoom(), scrollY: Math.round(scrollY), ancestorsScrolled: anc }; }, id);
        R[`${key}-${vn}-deeplink`] = r;
        chk(`#1 ${key} ${vn}: deep link — the place is on the map, not under the detail, zoom ≥ 15, scrollY 0 (desktop: no map ancestor scrolled either)`, r.sheet && !r.pinUnderSheet && r.onMap && r.z >= 15 && r.scrollY === 0 && (vk === 'm' || r.ancestorsScrolled.length === 0), r);
        if (errors.length) chk(`#1 ${key} ${vn} deep link: 0 page errors`, false, errors.slice(0, 2));
        await ctx.close(); }
    }
  }
  // #13 the view in the URL, and the share toast (Tokyo + Chinatown, both viewports)
  for (const [key, url] of PAGES.filter(p => ['tokyo', 'chinatown'].includes(p[0]))) for (const [vk, vp] of [['d', D], ['m', M]]) {
    const vn = vk === 'd' ? '1440' : '390';
    const { ctx, page, errors } = await open(browser, vp, url + '#view=atlas');
    const h0 = await page.evaluate(() => history.length);
    await page.evaluate(() => { const m = Cleo.city.map(); m.fire('dragstart'); m.panBy([140, 90], { animate: false }); m.fire('dragend'); }); await sleep(400);
    await page.evaluate(() => { const m = Cleo.city.map(); m.setZoom(m.getZoom() + 1, { animate: false }); }); await sleep(600);
    const u = await page.evaluate(() => { const m = Cleo.city.map(), c = m.getCenter(); return { hash: location.hash, len: history.length, lat: c.lat, lng: c.lng, z: m.getZoom() }; });
    const at = /(?:^#|&)at=([^&]+)/.exec(u.hash);
    chk(`#13 ${key} ${vn}: panning and zooming write the view to the URL (#…&at=lat,lng,z) without a history entry`, !!at && u.len === h0, { hash: u.hash, history: [h0, u.len] });
    await ctx.close();
    if (at) { const o = await open(browser, vp, url + u.hash);
      const px = await centrePx(o.page, u), z = await o.page.evaluate(() => Cleo.city.map() && Cleo.city.map().getZoom());
      chk(`#13 ${key} ${vn}: that URL reopens the same view (≤ 1 px, same zoom)`, px !== null && px <= 1 && z === u.z, { px, zoom: [u.z, z] });
      if (o.errors.length) chk(`#13 ${key} ${vn}: 0 page errors`, false, o.errors.slice(0, 2));
      await o.ctx.close(); }
    // the share button in a place's detail: the toast names what the copied link opens, and the link opens it
    { const o = await open(browser, vp, url + '#view=atlas'); const pg = o.page;
      await pg.evaluate(() => { Object.defineProperty(navigator, 'share', { value: undefined, configurable: true }); });   // the clipboard path (desktop browsers)
      const id = await pickCard(pg); let r = { id };
      if (id) { await pg.click(`#${id} .pl-n a`); await sleep(900);
        const v1 = await pg.evaluate(() => { const m = Cleo.city.map(), c = m.getCenter(); return { lat: c.lat, lng: c.lng, z: m.getZoom() }; });
        await pg.click('#cleo-sheet [data-sh="share"]'); await sleep(500);
        r = Object.assign(r, await pg.evaluate(async () => ({ toast: [...document.querySelectorAll('.toast')].map(t => t.textContent).pop() || '', url: await navigator.clipboard.readText().catch(() => ''), name: Cleo.city.name(document.querySelector('li.pl.is-target')) })));
        const want = /p=([^&]+)/.test(r.url) && /at=/.test(r.url) ? 'Link copied · opens ' + r.name + ' on this map view' : null;
        chk(`#13 ${key} ${vn}: the share toast says exactly what the link opens`, !!want && r.toast === want, r);
        if (want) { const q = await open(browser, vp, r.url.replace(/^https?:\/\/[^/]+\//, ''));
          const back = await q.page.evaluate(() => ({ sheet: !!document.querySelector('#cleo-sheet:not([hidden])'), p: Cleo.route.parse().p }));
          const px = await centrePx(q.page, v1), z = await q.page.evaluate(() => Cleo.city.map() && Cleo.city.map().getZoom());
          chk(`#13 ${key} ${vn}: the shared place link opens that place on the sender's map view (≤ 1 px, same zoom)`, back.sheet && ('p-' + back.p) === id && px !== null && px <= 1 && z === v1.z, { back, px, zoom: [v1.z, z], sent: [+v1.lat.toFixed(6), +v1.lng.toFixed(6)], url: r.url.split('#')[1], got: await q.page.evaluate(() => { const c = Cleo.city.map().getCenter(); return [+c.lat.toFixed(6), +c.lng.toFixed(6)]; }) });
          await q.ctx.close(); } }
      else chk(`#13 ${key} ${vn}: a card to share`, false, r);
      if (o.errors.length) chk(`#13 ${key} ${vn} share: 0 page errors`, false, o.errors.slice(0, 2));
      await o.ctx.close(); }
  }
  // #11 keyboard (desktop Tokyo + Cleveland; the panel's Tab walk, scanned in full)
  for (const [key, url] of PAGES.filter(p => ['tokyo', 'cleveland'].includes(p[0]))) {
    const { ctx, page, errors } = await open(browser, D, url + '#view=atlas');
    const stops = []; let firstCard = -1, firstPin = -1, mapAt = -1, noRing = [];
    for (let i = 0; i < 400 && (firstCard < 0 || firstPin < 0 || mapAt < 0); i++) {
      await page.keyboard.press('Tab');
      const s = await page.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const st = getComputedStyle(a), w = a.closest('.spill'), ws = w && getComputedStyle(w);
        // a card's name link is ringed by its card (one ring per card, PANEL-R3 #9/#14), like the search box by its pill
        const li = a.closest('.pl-n') && a.closest('li.pl'), ls = li && getComputedStyle(li);
        const ring = (st.outlineStyle !== 'none' && parseFloat(st.outlineWidth) > 0) || (st.boxShadow && st.boxShadow !== 'none') || (!!ws && ws.boxShadow && ws.boxShadow !== 'none') || (!!ls && ls.outlineStyle !== 'none' && parseFloat(ls.outlineWidth) > 0);
        return { d: a.tagName.toLowerCase() + '.' + String(a.className).split(' ')[0] + ' ' + (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30), card: !!a.closest('li.pl'), pin: a.classList.contains('leaflet-marker-icon'), map: a.id === 'cleo-map' || a.classList.contains('leaflet-container'), ring }; });
      if (!s) continue; stops.push(s); const n = stops.length;
      if (s.card && firstCard < 0) firstCard = n; if (s.pin && firstPin < 0) firstPin = n; if (s.map && mapAt < 0) mapAt = n; if (!s.ring) noRing.push(n + ' ' + s.d);
    }
    // the card by Tab alone comes after the map and its pins (visual order: map left, list right); "Skip to the results"
    // is the short way to it (≤ 15 stops: it is stop 3, then Enter)
    const skipAt = stops.findIndex(s => /Skip to the results/.test(s.d)) + 1, skipMap = stops.findIndex(s => /Skip to the map/.test(s.d)) + 1;
    // the keyboard path of SPEC-v3 §5: "Skip to the map" → the map → its first pin, counted in stops from the top
    await page.focus('a.ms-skip[data-skip="map"]'); await page.keyboard.press('Enter'); await sleep(200); await page.keyboard.press('Tab'); await sleep(100);
    const viaSkip = await page.evaluate(() => { const a = document.activeElement; return !!a && a.classList.contains('leaflet-marker-icon') && a.classList.contains('pp'); });
    const pinBySkip = viaSkip ? skipMap + 2 : -1;
    chk(`#11 ${key} 1440: the first pin ≤ 12 stops in (via "Skip to the map"), the map before the list in Tab order, "Skip to the results" ≤ 15 stops in; every stop shows a visible ring`,
      pinBySkip > 0 && pinBySkip <= 12 && mapAt > 0 && mapAt < firstCard && firstPin < firstCard && skipAt > 0 && skipAt <= 14 && noRing.length === 0,
      { pinBySkip, tabOnly: { mapAt, firstPin, firstCard }, skipAt, noRing: noRing.slice(0, 4), first: stops.slice(0, 6).map(s => s.d) });
    // the skip links: the first stops after the page's own; each lands where it says, and the hash never changes
    await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
    const h0 = await page.evaluate(() => location.hash);
    const sk = {}; for (const k of ['map', 'list']) { await page.focus(`a.ms-skip[data-skip="${k}"]`).catch(() => {}); const vis = await page.evaluate(k => { const a = document.querySelector(`a.ms-skip[data-skip="${k}"]`); if (!a) return null; const r = a.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.width > 0; }, k);
      await page.keyboard.press('Enter'); await sleep(250); sk[k] = { visibleOnFocus: vis, to: await active(page), hash: await page.evaluate(() => location.hash) }; }
    chk(`#11 ${key} 1440: "Skip to the map" focuses the map and "Skip to the results" the first card, the hash untouched`, sk.map.visibleOnFocus && /^div\.map|^div\.leaflet/.test(sk.map.to) && /^card /.test(sk.list.to) && sk.map.hash === h0 && sk.list.hash === h0, sk);
    // pins: arrows move by map priority; Enter opens the preview; Escape closes it with focus on the pin
    const kb = await page.evaluate(async () => { const C = Cleo.city, m = C.map(), sl = ms => new Promise(r => setTimeout(r, ms));
      const els = [...m.getPane('markerPane').querySelectorAll('.leaflet-marker-icon.pp[data-id]')], mp = e => C.mp(e.getAttribute('data-id'));
      const top = els.slice().sort((a, b) => mp(a) - mp(b)); if (top.length < 3) return { pins: top.length };
      top[0].focus(); const seq = [top[0].getAttribute('data-id')];
      for (let i = 0; i < 2; i++) { document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })); await sl(50); seq.push(document.activeElement.getAttribute('data-id')); }
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })); await sl(50); seq.push(document.activeElement.getAttribute('data-id'));
      return { pins: top.length, seq, want: [0, 1, 2, 1].map(i => top[i].getAttribute('data-id')) }; });
    const arrowsOk = kb.seq && kb.seq.join() === kb.want.join();
    const v0 = await page.evaluate(() => { const c = Cleo.city.map().getCenter(); return { lat: c.lat, lng: c.lng }; });
    await page.keyboard.press('Enter'); await sleep(700);
    const pv = await page.evaluate(() => ({ preview: !!document.querySelector('#cleo-poi:not([hidden]) .ms-pv'), focus: (document.activeElement.getAttribute('data-id') || document.activeElement.tagName) }));
    await page.keyboard.press('Escape'); await sleep(400);
    const es = await page.evaluate(() => ({ preview: !!document.querySelector('#cleo-poi:not([hidden]) .ms-pv'), focusPin: document.activeElement.classList.contains('leaflet-marker-icon') }));
    chk(`#11 ${key} 1440: arrows move between pins in map-priority order; Enter opens the preview; Escape closes it, focus on the pin`, arrowsOk && pv.preview && !es.preview && es.focusPin, { kb, pv, es, v0: !!v0 });
    if (errors.length) chk(`#11 ${key}: 0 page errors`, false, errors.slice(0, 2));
    await ctx.close();
  }

  // #3 near me — T3: located at Shibuya (35.6595, 139.7005), then Eat & drink
  if (PAGES.some(p => p[0] === 'tokyo')) for (const [vk, vp] of [['d', D], ['m', M]]) {
    const vn = vk === 'd' ? '1440' : '390', geo = { latitude: 35.6595, longitude: 139.7005 };
    const { ctx, page, errors } = await open(browser, vp, 'beta/cities/tokyo.html#view=atlas', { geo });
    const loc = await page.$('.leaflet-control-container .m-locate'); let tap = 'none';
    if (loc) { try { await loc.click({ timeout: 2500 }); tap = 'click'; } catch (e) { await loc.evaluate(b => b.click()); tap = 'scripted (the tap was intercepted)'; } }
    await sleep(1500);
    const food = await page.$('.ms-bar button[data-mode="food"]'); if (food) { await food.evaluate(b => b.click()); await sleep(1200); }
    const r = await page.evaluate(g => { const C = Cleo.city, m = C.map(), R = 6371, rad = x => x * Math.PI / 180, dist = (a, b) => { const dl = rad(b[0] - a[0]), dn = rad(b[1] - a[1]); const h = Math.sin(dl / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
      const vis = [...document.querySelectorAll('li.pl')].filter(e => e.offsetParent && !e.hidden);
      const top = vis.slice(0, 5).map(e => ({ n: Cleo.city.name(e), km: +dist([g.latitude, g.longitude], e.getAttribute('data-ll').split(',').map(Number)).toFixed(2), d: ((e.querySelector('.ms-d') || {}).textContent || '').trim() }));
      const tg = document.querySelector('.ms-toggle'), pill = tg ? +((/([\d,]+)/.exec(tg.textContent) || [0, '0'])[1].replace(/,/g, '')) : null;
      const ll0 = vis[0] && vis[0].getAttribute('data-ll').split(',').map(Number);
      return { sort: Cleo.route.parse().sort, food: Cleo.route.parse().mode, top, allDist: vis.every(e => /min walk/.test((e.querySelector('.ms-d') || {}).textContent || '')), shown: vis.length, firstInBounds: !!(m && ll0 && m.getBounds().contains(ll0)), pill,
        count: (document.querySelector('.ms-count') || {}).textContent || '', stored: JSON.stringify(Object.assign({}, localStorage)) + JSON.stringify(Object.assign({}, sessionStorage)) }; }, geo);
    let listN = null; if (vk === 'm') { await page.click('.ms-toggle'); await sleep(600); listN = await page.evaluate(() => ({ count: +((/([\d,]+)/.exec((document.querySelector('.ms-count') || {}).textContent || '') || [0, '0'])[1].replace(/,/g, '')), cards: [...document.querySelectorAll('li.pl')].filter(e => e.offsetParent && !e.hidden).length })); }
    const top3 = r.top.slice(0, 3).map(x => x.n).join(' | ');
    chk(`#3 tokyo ${vn}: after locate-me + Eat & drink, nearest first — the first card within 1.2 km, Nonbei Yokochō or The Bellwood in the top 3`, r.sort === 'near' && r.top[0] && r.top[0].km <= 1.2 && /Nonbei|Bellwood/i.test(top3) && r.top.every((x, i, a) => !i || a[i - 1].km <= x.km + 1e-9), { tap, top: r.top.slice(0, 3), count: r.count });
    const cn = +((/([\d,]+)/.exec(r.count) || [0, '0'])[1].replace(/,/g, ''));
    chk(`#3 tokyo ${vn}: every card shows its distance and an estimated walking time; the cards shown are the map area's (≤ the count)`, r.allDist && r.shown > 0 && r.shown <= cn, { shown: r.shown, count: cn, eg: r.top.slice(0, 2).map(x => x.d) });
    chk(`#3 tokyo ${vn}: the first card is a place inside the map bounds`, r.firstInBounds, r.top[0]);
    if (vk === 'm') chk(`#3 tokyo 390: the List pill count equals the List-mode count`, r.pill !== null && listN && r.pill === listN.count, { pill: r.pill, list: listN });
    chk(`#3 tokyo ${vn}: the location is never stored`, !/35\.659|139\.700/.test(r.stored), r.stored.slice(0, 120));
    if (errors.length) chk(`#3 tokyo ${vn}: 0 page errors`, false, errors.slice(0, 2));
    await ctx.close();
  }
  // PANEL-R3 #7: the desktop Atlas layout never shifts. After a card focus, card → detail → Escape / Back and Share, the
  // map's top stays where it was, the search box stays on screen (top ≥ 56 px), and every ancestor of the map keeps
  // scrollTop 0 (html and body are overflow:hidden in Atlas, so a shifted container can't be scrolled back by a mouse)
  for (const [key, url] of PAGES) {
    const { ctx, page, errors } = await open(browser, D, url + '#view=atlas');
    const lay = () => page.evaluate(() => { const m = document.getElementById('cleo-map'), q = document.getElementById('cleo-filter'), anc = [];
      for (let e = m && m.parentElement; e; e = e.parentElement) if (e.scrollTop) anc.push((e.id || e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0]) + ' ' + e.scrollTop);
      if (document.scrollingElement.scrollTop) anc.push('document ' + document.scrollingElement.scrollTop);
      const qr = q && q.getBoundingClientRect(); return { mapTop: m ? Math.round(m.getBoundingClientRect().top) : null, searchTop: qr ? Math.round(qr.top) : null, searchVis: !!qr && qr.height > 0 && qr.top >= 0, anc }; });
    const L0 = await lay(), steps = {};
    const same = x => x.mapTop === L0.mapTop && x.anc.length === 0 && x.searchVis && x.searchTop >= 56;
    const id = await pickCard(page);
    if (id) {
      await page.focus(`#${id} .pl-n a`); await sleep(300); steps.focus = await lay();
      await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await sleep(300); steps.tab = await lay();
      await page.click(`#${id} .pl-n a`); await sleep(900); await page.keyboard.press('Escape'); await sleep(900); steps.esc = await lay();
      await page.click(`#${id} .pl-n a`); await sleep(900); await page.goBack(); await sleep(900); steps.back = await lay();
      await page.evaluate(() => { try { Object.defineProperty(navigator, 'share', { value: undefined, configurable: true }); } catch (e) {} });
      await page.click(`#${id} .pl-n a`); await sleep(900); await page.click('#cleo-sheet [data-sh="share"]').catch(() => {}); await sleep(400); await page.keyboard.press('Escape'); await sleep(900); steps.share = await lay();
    }
    const bad = Object.keys(steps).filter(k => !same(steps[k]));
    chk(`R3 #7 ${key} 1440: no layout shift — after card focus, Tab, card → detail → Escape / Back and Share the map top stays at ${L0.mapTop} px, the search box stays on screen (≥ 56 px), every map ancestor keeps scrollTop 0`,
      !!id && L0.anc.length === 0 && L0.searchTop >= 56 && bad.length === 0, { start: L0, bad: bad.map(k => [k, steps[k]]) });
    if (errors.length) chk(`R3 #7 ${key}: 0 page errors`, false, errors.slice(0, 2));
    await ctx.close();
  }

  // PANEL-R3 #8: a fresh shared view (#view=atlas&at=…, Asakusa z 15) lists only what that map shows: every desktop list
  // card and the first phone card (List mode; the phone opens on map + peek) are inside the visible bounds; the count
  // and pill equal the places listed
  if (PAGES.some(p => p[0] === 'tokyo')) for (const [vk, vp] of [['d', D], ['m', M]]) {
    const vn = vk === 'd' ? '1440' : '390', { ctx, page, errors } = await open(browser, vp, 'beta/cities/tokyo.html#view=atlas&at=35.7148,139.7967,15', { wait: 2200 });
    if (vk === 'm') { const tg = await page.$('.ms-toggle'); if (tg) { await tg.click().catch(() => {}); await sleep(700); } }
    const r = await page.evaluate(() => { const m = Cleo.city.map(), b = m && m.getBounds(), c = m && m.getCenter();
      const vis = [...document.querySelectorAll('li.pl')].filter(e => e.offsetParent && !e.hidden && e.getAttribute('data-ll'));
      const out = vis.filter(e => !b.contains(e.getAttribute('data-ll').split(',').map(Number))).map(e => Cleo.city.name(e)).slice(0, 4);
      const num = s => +((/([\d,]+)/.exec(s || '') || [0, '0'])[1].replace(/,/g, '')), tg = document.querySelector('.ms-toggle');
      return { centre: c && [+c.lat.toFixed(4), +c.lng.toFixed(4), m.getZoom()], first: vis[0] && Cleo.city.name(vis[0]), shown: vis.length, out, count: num((document.querySelector('.ms-count') || {}).textContent), pill: tg ? num(tg.textContent) : null, list: document.documentElement.classList.contains('ms-list') }; });
    chk(`R3 #8 tokyo ${vn}: a fresh #view=atlas&at=Asakusa z15 load lists only places inside the map (the first card included)`, r.centre && Math.abs(r.centre[0] - 35.7148) < 1e-3 && r.centre[2] === 15 && r.shown > 0 && r.out.length === 0, r);
    if (errors.length) chk(`R3 #8 tokyo ${vn}: 0 page errors`, false, errors.slice(0, 2));
    await ctx.close();
  }

  // PANEL-R3 #8 (2): after the reader zooms, the phone's count line and pill equal the places in view — or, until
  // "Search this area" is tapped, that button is on screen (the counts are then the last searched area's, said so)
  if (PAGES.some(p => p[0] === 'tokyo')) {
    const { ctx, page, errors } = await open(browser, M, 'beta/cities/tokyo.html#view=atlas', { wait: 2200 });
    await page.evaluate(() => { const m = Cleo.city.map(); m.fire('zoomstart'); m.setZoom(m.getZoom() + 2, { animate: false }); }); await sleep(900);
    const r = await page.evaluate(() => { const C = Cleo.city, m = C.map(), num = s => +((/([\d,]+)/.exec(s || '') || [0, '0'])[1].replace(/,/g, ''));
      const o = C.overMap(), sz = m.getSize(), L = window.L, tl = m.containerPointToLatLng(L.point(o.paddingTopLeft[0] - 24, o.paddingTopLeft[1] - 24)), br = m.containerPointToLatLng(L.point(sz.x - o.paddingBottomRight[0] + 24, sz.y - o.paddingBottomRight[1] + 24)), bb = L.latLngBounds(tl, br);
      const all = [...document.querySelectorAll('li.pl')].concat(Cleo.defer && Cleo.defer.peek ? Cleo.defer.peek() : []).filter(c => !c.hidden && c.getAttribute('data-ll'));
      const inView = all.filter(c => bb.contains(c.getAttribute('data-ll').split(',').map(Number))).length, tg = document.querySelector('.ms-toggle'), here = document.querySelector('.ms-here');
      return { inView, count: num((document.querySelector('.ms-count') || {}).textContent), pill: tg ? num(tg.textContent) : null, pillText: tg && tg.textContent.trim(), here: !!here && !here.hidden && here.offsetHeight > 0 }; });
    const fresh = r.pill === r.inView && (r.count === r.inView || !r.count);
    chk(`R3 #8 tokyo 390: after a zoom the pill and count equal the places in view, or "Search this area" is offered`, fresh || r.here, r);
    if (errors.length) chk(`R3 #8 tokyo 390 zoom: 0 page errors`, false, errors.slice(0, 2));
    await ctx.close();
  }

  // QC-26: a cold #view=atlas&a=<area>&p=<id> applies the lens on load — the detail reads "1 of <lens n>" and no card
  // outside the lens shows — for the page's first area (the PERF-08 case) and its second, on 3 pilots × 390 / 1440
  for (const ai of ['0', '1']) { const q = require('child_process').spawnSync(process.execPath, [path.join(__dirname, 'fe2', 'qc26.js')].concat(ONLY ? PAGES.filter(p => ['tokyo', 'cleveland', 'newyork'].includes(p[0])).map(p => p[1].replace(/^beta\//, '')) : []), { env: Object.assign({}, process.env, { AREA_IDX: ai }), encoding: 'utf8' });
    if (ONLY && !PAGES.some(p => ['tokyo', 'cleveland', 'newyork'].includes(p[0]))) continue;
    String(q.stdout || '').split('\n').filter(l => /^(PASS|FAIL)  QC-26/.test(l)).forEach(l => chk(l.replace(/^(PASS|FAIL)  /, '').replace(/  \{.*$/, '') + (ai === '0' ? ' [first area]' : ' [second area]'), /^PASS/.test(l), l.replace(/^.*?  \{/, '{').slice(0, 300)));
    if (q.status !== 0 && !/QC-26/.test(String(q.stdout))) chk(`QC-26 probe ran (area ${ai})`, false, String(q.stderr || '').slice(0, 300)); }

  // QA-76: no map-area count on the map's starting view. During a fresh load, every "N places here" (and any "Show all")
  // the count block shows is computed at the zoom the first fit settles on, never at the page's starting centre
  if (PAGES.some(p => p[0] === 'tokyo')) for (const [vk, vp] of [['d', D], ['m', M]]) for (const h of ['#view=atlas', '#view=atlas&t=1']) {
    const vn = vk === 'd' ? '1440' : '390', ctx = await browser.newContext(Object.assign({ reducedMotion: 'reduce' }, vp));
    await ctx.route('**/*', route => { const u = new URL(route.request().url()); if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u.host)) return route.fulfill({ body: TILE, headers: { 'content-type': 'image/png' } }); if (u.origin + '/' !== BASE) return route.abort(); const f = path.join(ROOT, decodeURIComponent(u.pathname)); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: 'not found' }); return route.fulfill({ body: fs.readFileSync(f), headers: { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' } }); });
    const page = await ctx.newPage(); await page.goto(BASE + 'beta/cities/tokyo.html' + h, { waitUntil: 'commit' }); const seen = [];
    for (let i = 0; i < 32; i++) { const x = await page.evaluate(() => { const m = window.Cleo && Cleo.city && Cleo.city.map && Cleo.city.map(); return { c: ((document.querySelector('.ms-count') || {}).textContent || '').trim(), more: ((document.querySelector('.ms-more') || {}).textContent || '').trim(), z: m ? m.getZoom() : null }; }).catch(() => null);
      if (x && (!seen.length || seen[seen.length - 1].c !== x.c || seen[seen.length - 1].more !== x.more || seen[seen.length - 1].z !== x.z)) seen.push(x); await sleep(100); }
    // D-46 (FE-1, logged): the list now shows before the map with the count of the view the map WILL open on (atlas.js
    // predict()), so a count before the fit is allowed only when it IS the settled count — any other count still fails
    const fin = seen[seen.length - 1] || {}, zf = seen.length ? fin.z : null, early = seen.filter(x => (/places here/.test(x.c) || /Show all/.test(x.more)) && x.z !== zf && (x.c !== fin.c || x.more !== fin.more));
    chk(`QA-76 tokyo ${vn} ${h}: no map-area count or "Show all" on the starting view before the first fit`, zf !== null && early.length === 0, { final: seen[seen.length - 1], early: early.slice(0, 2) });
    await ctx.close();
  }

  // PANEL-R3 #9/#14: exactly one unclipped focus ring at every stop inside a card (tools/beta/fe2/rings.js), phone + desktop,
  // light + dark, Tokyo and Cleveland
  for (const rel of ['cities/tokyo.html', 'cleveland.html']) { if (ONLY && !ONLY.split(',').some(k => rel.includes(k))) continue;
    const q = require('child_process').spawnSync(process.execPath, [path.join(__dirname, 'fe2', 'rings.js'), rel], { env: process.env, encoding: 'utf8' });
    const lines = String(q.stdout || '').split('\n').filter(l => /^(PASS|FAIL)  rings/.test(l));
    if (!lines.length) chk(`rings ${rel}: probe ran`, false, String(q.stderr || '').slice(0, 300));
    lines.forEach(l => chk('R3 #9/#14 ' + l.replace(/^(PASS|FAIL)  /, '').replace(/  \{.*$/, ''), /^PASS/.test(l), l.replace(/^.*?  \{/, '{').slice(0, 300))); }

  // D-46 (Atlas is the default city view): with no hash at all the page lands in Atlas, and everything above still holds
  // from a bare URL. Runs when the page's own default view (#cleo-city "dv") is Atlas; until then it says it was skipped.
  for (const [key, url] of PAGES) {
    const dv = (/"dv":"([a-z]+)"/.exec(fs.readFileSync(path.join(ROOT, url), 'utf8')) || [])[1];
    if (dv !== 'atlas') { console.log(`SKIP  D-46 ${key}: the page's default view is "${dv}", not Atlas yet`); continue; }
    for (const [vk, vp] of [['d', D], ['m', M]]) {
      const vn = vk === 'd' ? '1440' : '390';
      { const { ctx, page, errors } = await open(browser, vp, url);
        const r = await page.evaluate(() => ({ view: document.documentElement.getAttribute('data-view'), hash: location.hash, map: !!(Cleo.city.map && Cleo.city.map()), y: Math.round(scrollY) }));
        chk(`D-46 ${key} ${vn}: a bare URL lands in Atlas with the map, the page unscrolled, and at most the view written (#at=…, no view key)`, r.view === 'atlas' && r.map && r.y === 0 && /^(#at=[^&]+)?$/.test(r.hash), r);
        if (errors.length) chk(`D-46 ${key} ${vn} bare: 0 page errors`, false, errors.slice(0, 2));
        await ctx.close(); }
      for (const close of ['esc', 'back']) { const { ctx, page, errors } = await open(browser, vp, url);
        const r = await roundTrip(page, vk, 'card', close);
        chk(`D-46 ${key} ${vn}: from a bare URL, card → detail → ${close === 'esc' ? 'Escape' : 'Back'} keeps centre (≤ 1 px), zoom, scroll, count, pill and focus`, r.ok, r);
        if (errors.length) chk(`D-46 ${key} ${vn} ${close}: 0 page errors`, false, errors.slice(0, 2));
        await ctx.close(); }
    }
    { const { ctx, page } = await open(browser, D, url); await page.evaluate(() => { const m = Cleo.city.map(); m.fire('dragstart'); m.panBy([120, 80], { animate: false }); m.fire('dragend'); }); await sleep(600);
      const u = await page.evaluate(() => { const m = Cleo.city.map(), c = m.getCenter(); return { hash: location.hash, lat: c.lat, lng: c.lng, z: m.getZoom() }; }); await ctx.close();
      const o = await open(browser, D, url + u.hash), px = await centrePx(o.page, u), z = await o.page.evaluate(() => Cleo.city.map() && Cleo.city.map().getZoom()), v = await o.page.evaluate(() => document.documentElement.getAttribute('data-view'));
      chk(`D-46 ${key} 1440: a view link with no view key (${u.hash.slice(0, 40)}) reopens Atlas on the same view (≤ 1 px, same zoom)`, /^#at=/.test(u.hash) && v === 'atlas' && px !== null && px <= 1 && z === u.z, { hash: u.hash, view: v, px, zoom: [u.z, z] });
      await o.ctx.close(); }
  }

  // QA-71: after a place is opened and closed (card → detail → Back), swiping the phone carousel still moves the selection,
  // as it does before the round-trip: two swipes, the card in the middle is the selected one each time (QA's 5 pilots)
  for (const url of ['beta/cleveland.html', 'beta/cities/tokyo.html', 'beta/cities/newyork.html', 'beta/Singapore/chinatown.html', 'beta/cities/wheeling.html']) {
    if (ONLY && !ONLY.split(',').some(k => url.includes(k))) continue;
    const key = url.replace(/^.*\//, '').replace('.html', ''), { ctx, page, errors } = await open(browser, M, url + '#view=atlas');
    const mid = () => page.evaluate(() => { const lp = document.querySelector('.listpane'), m = lp.getBoundingClientRect().left + lp.clientWidth / 2;
      const c = [...lp.querySelectorAll('li.pl')].filter(x => x.offsetWidth && !x.hidden).sort((x, y) => { const a = x.getBoundingClientRect(), b = y.getBoundingClientRect(); return Math.abs(a.left + a.width / 2 - m) - Math.abs(b.left + b.width / 2 - m); })[0];
      return { mid: c && c.id, sel: (document.querySelector('li.pl.is-sel') || {}).id || null, left: Math.round(lp.scrollLeft) }; });
    const swipe = () => page.evaluate(async () => { const lp = document.querySelector('.listpane'); lp.scrollBy({ left: lp.clientWidth * 0.86 }); await new Promise(r => setTimeout(r, 900)); });
    const id = await pickCard(page); let r = { id };
    if (id) {
      await page.click(`#${id} .pl-n a`); await sleep(1000); r.sheet = await page.evaluate(() => !!document.querySelector('#cleo-sheet:not([hidden])'));
      await page.goBack(); await sleep(300); r.back = await mid();
      await swipe(); r.s1 = await mid(); await swipe(); r.s2 = await mid();
    }
    const okSw = x => !!x && !!x.mid && x.sel === x.mid;
    chk(`QA-71 ${key} 390: card → detail → Back, then two carousel swipes: the selection follows the card in the middle each time`,
      !!id && r.sheet && okSw(r.s1) && okSw(r.s2) && r.s1.mid !== r.back.mid && r.s2.mid !== r.s1.mid, r);
    if (errors.length) chk(`QA-71 ${key}: 0 page errors`, false, errors.slice(0, 2));
    await ctx.close();
  }

  // W9-5 the walking ring from your base (Tokyo, base = Nonbei Yokochō, Shibuya): 10 min → the circle, the lens, the count
  if (PAGES.some(p => p[0] === 'tokyo')) for (const [vk, vp] of [['d', D], ['m', M]]) {
    const vn = vk === 'd' ? '1440' : '390', base = 'nonbei-yokocho-shibuya';
    const { ctx, page, errors } = await open(browser, vp, 'beta/cities/tokyo.html#view=atlas&base=' + base, { wait: 2600 });
    const has = await page.waitForSelector('.ms-ring button[data-ring="10"]', { timeout: 6000 }).then(() => true, () => false);
    let r = { ring: has };
    if (has) {
      const total = await page.evaluate(() => [...document.querySelectorAll('li.pl')].filter(c => !c.hidden).length + (Cleo.defer && Cleo.defer.peek ? Cleo.defer.peek().length : 0));
      await page.evaluate(() => document.querySelector('.ms-ring button[data-ring="10"]').click()); await sleep(1500);
      r = Object.assign(r, await page.evaluate(() => { const C = Cleo.city, m = C.map(), o = Cleo.base.ll(), G = Cleo.geo;
        const mins = c => { const ll = G.ll(c); return ll ? G.walk(G.km(o, ll)).min : null; };
        const all = [...document.querySelectorAll('li.pl')], vis = all.filter(c => !c.hidden), hid = all.filter(c => c.hidden);
        const circ = document.querySelector('#cleo-map path.ms-ring-c'), b = m.getBounds(), R = 10 * 80 / 111320;
        return { hash: location.hash, pressed: (document.querySelector('.ms-ring [aria-pressed="true"]') || {}).textContent, circle: !!circ, inView: b.contains([o[0] + R * 0.95, o[1]]) && b.contains([o[0] - R * 0.95, o[1]]),
          outside: vis.filter(c => mins(c) !== null && mins(c) > 10).map(c => c.id).slice(0, 3), hiddenInside: hid.filter(c => mins(c) !== null && mins(c) <= 10 && Cleo.lens.match(c, {})).map(c => c.id).slice(0, 3),
          shown: vis.length, stubs: Cleo.defer && Cleo.defer.peek ? Cleo.defer.peek().length : 0, said: /straight-line/i.test((document.querySelector('.ms-ring') || {}).textContent || '') }; }));
      chk(`W9-5 tokyo ${vn}: "10 min" from your base draws the ring on the map, fits it, and the list holds exactly the places ≤ 10 min (the minutes the cards print), the assumption stated`,
        r.circle && r.inView && /ring=10/.test(r.hash) && r.outside.length === 0 && r.hiddenInside.length === 0 && r.shown > 0 && r.shown < total && r.stubs === 0 && r.said, Object.assign({ total }, r));
      await page.evaluate(() => { const b = document.querySelector('.ms-ring button[data-ring=""]'); if (b) b.click(); }); await sleep(1200);
      const back = await page.evaluate(() => ({ hash: location.hash, shown: [...document.querySelectorAll('li.pl')].filter(c => !c.hidden).length, circle: !!document.querySelector('#cleo-map path.ms-ring-c') }));
      chk(`W9-5 tokyo ${vn}: "Any" lifts the ring — every place back, no circle`, !/ring=/.test(back.hash) && back.shown === total && !back.circle, Object.assign({ total }, back));
    } else chk(`W9-5 tokyo ${vn}: the ring control shows when a base is set`, false, r);
    if (errors.length) chk(`W9-5 tokyo ${vn}: 0 page errors`, false, errors.slice(0, 2));
    await ctx.close();
  }
  await browser.close();
  if (OUT) { fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, 'nav-probe.json'), JSON.stringify(R, null, 1) + '\n'); }
  console.log(fails ? `\n>>> FAIL — ${fails} Atlas interaction-state check(s)` : '\n>>> PASS — Atlas interaction state');
  process.exit(fails ? 1 : 0);
})();
