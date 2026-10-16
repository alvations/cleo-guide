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
const pickCard = page => page.evaluate(() => {
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
          return { sheet: !!sh, pinUnderSheet: under, onMap, z: m && m.getZoom(), scrollY: Math.round(scrollY) }; }, id);
        R[`${key}-${vn}-deeplink`] = r;
        chk(`#1 ${key} ${vn}: deep link — the place is on the map, not under the detail, zoom ≥ 15, scrollY 0`, r.sheet && !r.pinUnderSheet && r.onMap && r.z >= 15 && r.scrollY === 0, r);
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
        const ring = (st.outlineStyle !== 'none' && parseFloat(st.outlineWidth) > 0) || (st.boxShadow && st.boxShadow !== 'none') || (!!ws && ws.boxShadow && ws.boxShadow !== 'none');
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
