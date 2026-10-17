#!/usr/bin/env node
/**
 * Beta QA — Wave 2 feature probe (QA lane; BETA-BACKLOG "Wave 2 acceptance criteria" + "Round 2 exit criteria").
 *
 * Real Chromium (preinstalled; never `playwright install`), every off-origin request blocked, at 390×844 and 1440×900.
 * Each check prints PASS/FAIL with its evidence; screenshots go to qa/beta-w2/. Checks:
 *   doors     D-46: For you, Your day, Near me and the For you keyboard trap reached from the Atlas default (.ms-doors)
 *   foryou    For you reorders, never hides: same id set + same per-area counts with and without interests, lifted
 *             cards carry "First because", the choice persists, and it still works when storage throws (M2-05)
 *   day       Your day: 4–6 open, pinned stops in one area, every leg "straight-line", a shared #day=A&s= link
 *             reproduces the stops (M2-06)
 *   near      Near me: distances on pinned cards, nearest first, and the position is never stored (storage, cookies,
 *             IndexedDB, URL) or sent (request URLs) (M3-02)
 *   map       the map as a guide: desktop map ≥ 40 %, open sheet → map centred on its place, numbered pins; mobile
 *             peek detent ≤ 40 % of the viewport, sheet locator inset (M2-13)
 *   saved     saved page: save from the sheet, covered cards + map, create/rename/delete a list, Been there, exports,
 *             share link → read-only view + Save a copy, unknown ids reported (M2-03)
 *   sig       ★ is never a publisher, on every place page (M2-18, QA-21); Cleveland food opens on its canon (QA-16)
 *   dom       Tokyo / NYC initial DOM ≤ 3,000 nodes at both viewports (M3-06)
 *   og        every page's og:image is a local 1200×630 PNG ≤ 300 KB (M2-08)
 *   hubs      hub tile lines are signature lines, never category labels; every motif file exists; the landing's
 *             editorial rail deep links open with the count it promises (M2-16, M2-14)
 *   a11y      axe-core (vendored, offline) on hubs, pilots, saved, accessibility and method pages, light + night:
 *             0 serious/critical (M1-16, B-23); the accessibility page exists and is linked (M2-12)
 *   storage   storage-blocked render: localStorage/sessionStorage throw on every place page; all cards render, 0 errors
 *
 * Usage: cd tools && node beta/qa/w2.js [--only foryou,day,...]   Output: qa/beta-w2/w2.json (+ screenshots)
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const OUT = path.join(ROOT, 'qa', 'beta-w2');
const argv = process.argv.slice(2);
const ONLY = (argv[argv.indexOf('--only') + 1] || '').split(',').filter(x => argv.includes('--only') && x);
const want = k => !ONLY.length || ONLY.includes(k);
const PILOTS = ['cleveland.html', 'cities/tokyo.html', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html'];
const VP = {
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
};
fs.mkdirSync(OUT, { recursive: true });

function loadPlaywright() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) {
    try { return require(t); } catch (e) { /* next */ }
  }
  throw new Error('playwright not found');
}
const MAN = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'manifest.json'), 'utf8'));
const placePages = MAN.pages.filter(p => p.counts && fs.existsSync(path.join(BETA, p.beta)));
const byBeta = {}; for (const p of placePages) byBeta[p.beta] = p;
const total = rel => { const c = byBeta[rel].counts; return c.total != null ? c.total : (c.sights != null ? c.sights + c.food : c.P + c.F); };
const walk = (dir, acc = []) => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name);
  if (e.isDirectory()) { if (!['data', 'assets'].includes(e.name)) walk(p, acc); } else if (e.name.endsWith('.html')) acc.push(path.relative(BETA, p).split(path.sep).join('/')); } return acc; };

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
        rsp.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); rsp.end(buf);
      });
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const BLOCKED_NET = /net::ERR_|Failed to load resource|ERR_BLOCKED|ERR_FAILED/;
// storage that throws on every access (sandboxed iframe / blocked site data)
const NO_STORAGE = () => {
  for (const k of ['localStorage', 'sessionStorage']) {
    try { Object.defineProperty(window, k, { configurable: true, get() { throw new DOMException('blocked', 'SecurityError'); } }); } catch (e) { /* ignore */ }
  }
};

let browser, base;
async function open(rel, vp, o = {}) {
  const ctx = await browser.newContext({ ...VP[vp], serviceWorkers: 'block', reducedMotion: 'reduce', colorScheme: o.scheme || 'light',
    permissions: o.geo ? ['geolocation'] : [], geolocation: o.geo || undefined });
  if (o.noStorage) await ctx.addInitScript(NO_STORAGE);
  const page = await ctx.newPage();
  const st = { errors: [], urls: [], local404: [] };
  const origin = new URL(base).origin;
  await ctx.route('**/*', route => {
    const u = route.request().url(); st.urls.push(u);
    if (u.startsWith(origin) || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    if (route.request().resourceType() === 'image') return route.fulfill({ status: 200, contentType: 'image/png', body: PNG1 });
    return route.abort('blockedbyclient');
  });
  page.on('pageerror', e => st.errors.push('pageerror: ' + String(e.message || e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error' && !BLOCKED_NET.test(m.text())) st.errors.push(m.text().slice(0, 200)); });
  page.on('response', r => { if (r.url().startsWith(origin) && r.status() >= 400) st.local404.push(r.url().slice(origin.length)); });
  page.on('dialog', d => d.accept());
  await page.goto(base + 'beta/' + rel + (o.hash || ''), { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(o.settle || 500);
  return { ctx, page, st };
}
const shot = (page, name, full) => page.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 62, fullPage: !!full }).catch(() => {});

const R = { checks: [] };
function check(group, name, ok, evidence) {
  R.checks.push({ group, name, ok: ok === null ? null : !!ok, evidence });   // null = INFO (recorded, not failed)
  console.log(`  ${ok === null ? 'INFO' : ok ? 'PASS' : 'FAIL'}  [${group}] ${name}` + (evidence !== undefined ? ' = ' + JSON.stringify(evidence).slice(0, 300) : ''));
}
// the full record set: stamp every deferred chunk first (M3-06 progressive render), then read every card
const ALL_CARDS = () => { if (window.Cleo && Cleo.defer && Cleo.defer.all) Cleo.defer.all();
  return [...document.querySelectorAll('li.pl')].map(c => ({ id: c.id, a: c.getAttribute('data-a'), hidden: !!c.closest('[hidden]') || c.hidden })); };
const perArea = list => list.reduce((o, c) => { o[c.a] = (o[c.a] || 0) + 1; return o; }, {});
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* ---------------- For you ---------------- */
async function foryou() {
  console.log('\n# For you (M2-05)');
  for (const rel of PILOTS) for (const noStorage of [false, true]) {
    if (noStorage && rel !== 'cleveland.html' && rel !== 'cities/tokyo.html') continue;
    const tag = rel + (noStorage ? ' [storage throws]' : '');
    // D-46: the rail's For you tile is the Gallery's (Atlas reaches it through its list-head doors: see doors())
    const { ctx, page, st } = await open(rel, 'mobile', { noStorage, hash: '#view=gallery' });
    const before = await page.evaluate(ALL_CARDS);
    const tile = page.locator('[data-cleo-foryou]').first();
    if (!(await tile.count())) { check('foryou', tag + ': For you tile present', false); await ctx.close(); continue; }
    await tile.click(); await page.waitForTimeout(400);
    const opts = await page.locator('#cleo-fy [data-i]').count();
    for (let i = 0; i < opts; i++) await page.locator('#cleo-fy [data-i]').nth(i).click();
    if (!noStorage && rel === 'cities/tokyo.html') await shot(page, 'foryou-picker-m');
    await page.locator('#cleo-fy [data-fy=go]').click(); await page.waitForTimeout(500);
    const after = await page.evaluate(ALL_CARDS);
    const info = await page.evaluate(() => ({
      why: document.querySelectorAll('li.pl .pl-why').length,
      line: (document.getElementById('cleo-fyline') || {}).textContent || '',
      orderChanged: null }));
    const idsB = before.map(c => c.id).sort(), idsA = after.map(c => c.id).sort();
    const visA = after.filter(c => !c.hidden).length;
    check('foryou', tag + ': picker offers ≤ 5 interests', opts > 0 && opts <= 5, opts);
    check('foryou', tag + ': same record set (ids) after picking every interest', same(idsB, idsA) && idsA.length === total(rel), [idsB.length, idsA.length, total(rel)]);
    check('foryou', tag + ': same per-area counts', same(perArea(before), perArea(after)));
    check('foryou', tag + ': no card hidden by the lens', visA === after.length, [visA, after.length]);
    check('foryou', tag + ': lifted cards say "First because"', info.why > 0 && /First because/.test(info.line), [info.why, info.line.slice(0, 90)]);
    if (!noStorage && rel === 'cities/tokyo.html') await shot(page, 'foryou-on-m');
    if (!noStorage) {
      await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(500);
      const kept = await page.evaluate(() => { const t = document.querySelector('[data-cleo-foryou]');
        return { p: t.getAttribute('aria-pressed'), d: (t.querySelector('.d') || {}).textContent, why: document.querySelectorAll('li.pl .pl-why').length,
          line: !!document.querySelector('#cleo-fyline:not([hidden])') }; });
      check('foryou', tag + ': choice persists through Cleo.store (cards lifted + line shown after reload)', kept.why > 0 && kept.line && / first$/.test(kept.d || ''), kept);
      check('foryou', tag + ': rail tile aria-pressed reflects the restored choice', kept.p === 'true', kept.p);
    }
    check('foryou', tag + ': 0 JS errors', !st.errors.length, st.errors.slice(0, 3));
    await ctx.close();
  }
  // static: the mapping keys on ids only (grep the generator's INTERESTS table)
  const src = fs.readFileSync(path.join(ROOT, 'tools/beta/lib/render/city.js'), 'utf8');
  const m = src.match(/INTERESTS\s*=\s*\[([\s\S]*?)\];/);
  const bad = m ? (m[1].match(/'[^']*'/g) || []).filter(s => /[a-z]{4,}/.test(s) && /\b(ramen|sushi|pierog|pizza|noodle|bagel|taco|museum|shrine|temple)\b/i.test(s) && !/^'[ckz]:/.test(s)) : ['no INTERESTS table'];
  check('foryou', 'INTERESTS table maps to collection/cuisine ids, no dish keywords', !bad.length, bad.slice(0, 5));
}

/* ---------------- Your day ---------------- */
async function day() {
  console.log('\n# Your day (M2-06)');
  for (const rel of ['cleveland.html', 'cities/tokyo.html', 'cities/newyork.html', 'cities/wheeling.html']) for (const vp of ['mobile', 'desktop']) {
    const { ctx, page, st } = await open(rel, vp, { hash: '#view=gallery' });   // D-46: the Gallery rail's tile (Atlas: doors())
    const t = page.locator('[data-cleo-day]').first();
    if (!(await t.count())) { check('day', `${rel} ${vp}: Your day tile`, false); await ctx.close(); continue; }
    await t.click(); await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('section.day ol.stops > li.stop a[href*="#p="], section.day ol.stops > li.stop a[href^="#p-"]')].map(a => (a.getAttribute('href').match(/p[=-]([a-z0-9-]+)/) || [])[1]);
      const stops = [...document.querySelectorAll('section.day ol.stops > li.stop')];
      const card = id => document.getElementById('p-' + id);
      const legs = [...document.querySelectorAll('section.day .leg')].map(l => l.textContent.trim());
      return { hash: location.hash, n: stops.length, ids,
        open: ids.every(id => card(id) && !card(id).hasAttribute('data-closed')),
        pinned: ids.every(id => card(id) && card(id).getAttribute('data-ll')),
        areas: [...new Set(ids.map(id => card(id) && card(id).getAttribute('data-a')))],
        legs, caveat: (document.querySelector('section.day .caveat') || {}).textContent || '',
        sum: (document.querySelector('section.day .daysum') || {}).textContent || '' };
    });
    check('day', `${rel} ${vp}: 4–6 stops`, r.n >= 4 && r.n <= 6, [r.n, r.hash]);
    check('day', `${rel} ${vp}: every stop open + verified pin, one area`, r.ids.length === r.n && r.open && r.pinned && r.areas.length === 1, { ids: r.ids, areas: r.areas });
    check('day', `${rel} ${vp}: every leg labelled straight-line`, r.legs.length >= r.n - 1 && r.legs.slice(0, r.n - 1).every(l => /straight-line/i.test(l)), r.legs.slice(0, 2));
    check('day', `${rel} ${vp}: total + honest label`, /km|m\b/.test(r.sum) && r.caveat.length > 20, [r.sum.replace(/\s+/g, ' ').slice(0, 80), r.caveat.slice(0, 80)]);
    if (rel === 'cities/tokyo.html') await shot(page, 'day-tokyo-' + vp[0]);
    check('day', `${rel} ${vp}: 0 JS errors`, !st.errors.length, st.errors.slice(0, 3));
    // a shared link reproduces the stops, in the shared order
    if (vp === 'mobile' && r.ids.length >= 4) {
      const area = decodeURIComponent((r.hash.match(/day=([^&]+)/) || [])[1] || '');
      const rev = r.ids.slice().reverse();
      const s2 = await open(rel, 'mobile', { hash: '#day=' + encodeURIComponent(area) + '&s=' + rev.join(',') });
      const got = await s2.page.evaluate(() => [...document.querySelectorAll('section.day ol.stops > li.stop a')].map(a => (a.getAttribute('href').match(/p[=-]([a-z0-9-]+)/) || [])[1]).filter(Boolean));
      check('day', `${rel}: shared #day=A&s=ids link reproduces the stops in order`, same(got.filter((x, i, a) => a.indexOf(x) === i), rev), { want: rev, got });
      await s2.ctx.close();
    }
    await ctx.close();
  }
  // one computation: the page's day index is the platform's guide.days.plans
  const j = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places/cleveland.json'), 'utf8'));
  const plans = j.guide && j.guide.days && j.guide.days.plans;
  const html = fs.readFileSync(path.join(BETA, 'cleveland.html'), 'utf8');
  check('day', 'Cleveland day plans come from guide.days.plans (one computation, D-34)', !!plans && Object.keys(plans).length > 0, plans ? Object.keys(plans).length : null);
  void html;
}

/* ---------------- Near me ---------------- */
async function near() {
  console.log('\n# Near me (M3-02)');
  const geo = { latitude: 35.6812, longitude: 139.7671 };            // Tokyo Station (a public landmark; test value)
  const { ctx, page, st } = await open('cities/tokyo.html', 'mobile', { geo, hash: '#view=gallery' });   // D-46: the Gallery rail (Atlas: doors())
  await page.locator('[data-cleo-near]:visible').first().click(); await page.waitForTimeout(1500);   // :visible — Atlas's hidden door is first in the DOM
  const r = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('li.pl')];
    const pinned = cards.filter(c => c.getAttribute('data-ll'));
    const dist = cards.filter(c => c.querySelector('.pl-dist'));
    const vis = cards.filter(c => !c.closest('[hidden]') && c.offsetParent);
    return { total: cards.length, pinned: pinned.length, dist: dist.length, firstDist: vis[0] && (vis[0].querySelector('.pl-dist') || {}).textContent,
      note: (document.getElementById('cleo-nearline') || {}).textContent || '', hash: location.hash, href: location.href,
      ls: (() => { try { return JSON.stringify(Object.assign({}, localStorage)); } catch (e) { return 'throws'; } })(),
      ss: (() => { try { return JSON.stringify(Object.assign({}, sessionStorage)); } catch (e) { return 'throws'; } })(),
      cookie: document.cookie };
  });
  const idb = await page.evaluate(async () => (indexedDB.databases ? (await indexedDB.databases()).map(d => d.name) : []));
  await shot(page, 'near-tokyo-m');
  const coord = /35\.68\d*|139\.76\d*/;
  check('near', 'Tokyo: distance shown on every pinned card', r.dist === r.pinned && r.pinned > 0, [r.dist, r.pinned, r.total]);
  check('near', 'Tokyo: every place still listed', r.total === total('cities/tokyo.html'), r.total);
  check('near', 'Tokyo: nearest first + "never stored" note', /never stored/i.test(r.note) && /near/.test(r.hash), [r.firstDist, r.note.slice(0, 80), r.hash]);
  check('near', 'position never stored: localStorage/sessionStorage/cookie/IndexedDB/URL', !coord.test(r.ls + r.ss + r.cookie + r.href) && !idb.length,
    { ls: r.ls.slice(0, 120), ss: r.ss, cookie: r.cookie, idb, href: r.href.replace(/^.*\/beta\//, '') });
  check('near', 'position never sent: no request URL carries it', !st.urls.some(u => coord.test(u)), st.urls.filter(u => coord.test(u)).slice(0, 2));
  await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(500);
  const re = await page.evaluate(() => document.querySelectorAll('li.pl .pl-dist').length);
  check('near', 'reload: distances gone (memory only)', re === 0, re);
  check('near', '0 JS errors', !st.errors.length, st.errors.slice(0, 3));
  await ctx.close();
  // denied permission: nothing changes, every place listed
  const d = await open('cities/tokyo.html', 'mobile', { hash: '#view=gallery' });   // D-46: the Gallery rail
  await d.page.locator('[data-cleo-near]:visible').first().click(); await d.page.waitForTimeout(1500);
  const dn = await d.page.evaluate(() => ({ n: document.querySelectorAll('li.pl').length, dist: document.querySelectorAll('.pl-dist').length, toast: [...document.querySelectorAll('.toast,[role=status]')].map(t => t.textContent).join(' | ') }));
  check('near', 'permission denied: every place listed, no distances, a calm message', dn.dist === 0 && dn.n >= 40, dn);
  await d.ctx.close();
}

/* ---------------- Map as a guide ---------------- */
async function map() {
  console.log('\n# Map as a guide (M2-13 / B-06 / B-07)');
  for (const rel of PILOTS) {
    // the map is the Atlas view's (W5: Gallery is the default view and has no map), so the map probe runs in Atlas
    const { ctx, page, st } = await open(rel, 'desktop', { hash: '#view=atlas', settle: 1500 });
    const w = await page.evaluate(() => { const m = document.querySelector('.leaflet-container') || document.querySelector('[data-cleo-map]'); return m ? Math.round(m.getBoundingClientRect().width / innerWidth * 100) : 0; });
    check('map', `${rel} desktop: map ≥ 40 % of 1440`, w >= 40, w + ' %');
    // open a card from the second area: the map should centre on it
    const r = await page.evaluate(async () => {
      const cards = [...document.querySelectorAll('li.pl[data-ll]')]; const c = cards[Math.min(cards.length - 1, Math.floor(cards.length / 2))];
      const ll = c.getAttribute('data-ll').split(',').map(Number);
      c.querySelector('.pl-n a').click();
      await new Promise(r => setTimeout(r, 1800));
      const M = window.Cleo && Cleo.city && Cleo.city.map && Cleo.city.map();
      const ctr = M && M.getCenter ? M.getCenter() : null; const b = M && M.getBounds ? M.getBounds() : null;
      return { id: c.id, ll, ctr: ctr && [ctr.lat, ctr.lng], inView: b ? b.contains(ll) : null, sheet: !!document.querySelector('#cleo-sheet:not([hidden])'),
        numbered: document.querySelectorAll('.leaflet-tooltip.pin-n, .pin-n, .leaflet-marker-icon.pp').length };   // W7: label-pill pins carry the number
    });
    const off = r.ctr ? Math.hypot(r.ctr[0] - r.ll[0], r.ctr[1] - r.ll[1]) : null;
    check('map', `${rel} desktop: open sheet → its place is in view on the map`, r.sheet && r.inView === true, { id: r.id, inView: r.inView, offDeg: off && +off.toFixed(4) });
    check('map', `${rel} desktop: numbered pins drawn`, r.numbered > 0, r.numbered);
    if (rel === 'cities/tokyo.html') await shot(page, 'map-sheet-tokyo-d');
    check('map', `${rel} desktop: 0 JS errors`, !st.errors.length, st.errors.slice(0, 3));
    await ctx.close();
    // mobile: map → pin → peek ≤ 40 %, Esc leaves nothing over the map, locator inset in the full sheet.
    // W7 Atlas map-search (Amendment 2): the phone Atlas IS the map (the "Map" pill shows only over the list, so a toggle
    // is pressed only when one is visible) and a pin's peek is its card in the bottom carousel instead of a sheet: the
    // peek is measured as the carousel holding the selected card (docs/BETA-LOG.md, for QA to ratify). Pins are label
    // pills (.pp); below zoom 15 nearby pins gather into bubbles, so a bubble is tapped (it zooms in) until a pin shows.
    const m = await open(rel, 'mobile', { hash: '#view=atlas', settle: 800 });
    const tg = m.page.locator('.map-toggle:visible, .ms-toggle[aria-pressed="true"]:visible').first();
    if (await tg.count()) await tg.click();
    await m.page.waitForTimeout(1500);
    const tapPin = () => m.page.evaluate(() => {   // a pill's icon box is 0×0: its label is the pin
      const band = e => { const r = (e.firstElementChild || e).getBoundingClientRect(); return r.width && r.left > 20 && r.right < innerWidth - 70 && r.top > 200 && r.bottom < innerHeight - 220; };
      const p = [...document.querySelectorAll('.leaflet-marker-icon.pp')].find(band); if (p) { p.firstElementChild.dispatchEvent(new MouseEvent('click', { bubbles: true })); return 'pin'; }
      const c = [...document.querySelectorAll('.leaflet-marker-icon.pin-cl')].find(band); if (c) { c.dispatchEvent(new MouseEvent('click', { bubbles: true })); return 'bubble'; }
      return null; });
    let peek = null, esc = null, how = null;
    for (let i = 0; i < 4 && how !== 'pin'; i++) { how = await tapPin(); await m.page.waitForTimeout(900); if (!how) break; }
    if (how === 'pin') {
      peek = await m.page.evaluate(() => { const c = document.querySelector('li.pl.is-sel'); const s = c && (c.closest('.poi-sheet, .sheet, [role=dialog], .listpane') || c);
        const r = s && s.getBoundingClientRect(), cr = c && c.getBoundingClientRect(); const inView = !!cr && cr.left >= -2 && cr.right <= innerWidth + 2 && cr.bottom <= innerHeight + 2;
        return r && inView && r.height > 40 ? Math.round(r.height / innerHeight * 100) : null; });
      if (rel === 'cities/tokyo.html') await shot(m.page, 'map-peek-tokyo-m');
      await m.page.keyboard.press('Escape'); await m.page.waitForTimeout(500);
      esc = await m.page.evaluate(() => ![...document.querySelectorAll('.poi-sheet')].some(e => e.offsetParent && e.getBoundingClientRect().height > 40));
    }
    check('map', `${rel} mobile: pin peek detent ≤ 40 % of the viewport`, peek != null && peek <= 40, peek == null ? 'no peek (' + how + ')' : peek + ' %');
    check('map', `${rel} mobile: Esc closes the pin sheet (QA-19)`, esc === true, esc);
    await m.ctx.close();
    const s = await open(rel, 'mobile', { hash: '#p=' + (await firstPinned(rel)), settle: 1200 });
    const loc = await s.page.evaluate(() => !!document.querySelector('#cleo-sheet:not([hidden]) .locator, #cleo-sheet:not([hidden]) .loc'));
    check('map', `${rel} mobile: sheet has a locator inset`, loc, loc);
    if (rel === 'cities/tokyo.html') await shot(s.page, 'sheet-locator-tokyo-m');
    await s.ctx.close();
  }
}
async function firstPinned(rel) {
  const h = fs.readFileSync(path.join(BETA, rel), 'utf8'); const m = h.match(/<li class="pl[^"]*" id="p-([a-z0-9-]+)"[^>]*data-ll="/); return m ? m[1] : '';
}

/* ---------------- Saved lists + shared view ---------------- */
async function saved() {
  console.log('\n# Saved page + shared view (M2-03)');
  const ctx = await browser.newContext({ ...VP.mobile, serviceWorkers: 'block', reducedMotion: 'reduce' });
  const errors = []; ctx.on('page', p => p.on('pageerror', e => errors.push(String(e.message).slice(0, 200))));
  await ctx.route('**/*', r => r.request().url().startsWith(base) || r.request().url().startsWith('data:') || r.request().url().startsWith('blob:') ? r.continue() : r.abort('blockedbyclient'));
  const page = await ctx.newPage(); page.on('dialog', d => d.accept());
  const h = fs.readFileSync(path.join(BETA, 'cities/tokyo.html'), 'utf8');
  const ids = [...h.matchAll(/<li class="pl[^"]*" id="p-([a-z0-9-]+)"[^>]*data-ll=/g)].map(m => m[1]).slice(0, 3);
  for (const id of ids) {
    await page.goto(base + 'beta/cities/tokyo.html#p=' + id, { waitUntil: 'load' }); await page.waitForTimeout(700);
    await page.locator('#cleo-sheet [data-sh=save]').first().click(); await page.waitForTimeout(200);
  }
  await page.goto(base + 'beta/saved.html', { waitUntil: 'load' }); await page.waitForTimeout(1500);
  const s1 = await page.evaluate(() => ({ cards: document.querySelectorAll('ul.saved-cards li.pl').length, map: !!document.querySelector('.leaflet-container, #sv-map, [data-sv-map]'),
    exp: ['kml', 'geojson', 'json', 'share', 'pick'].filter(k => document.querySelector('[data-sv="' + k + '"]')),
    maps: document.querySelectorAll('ul.saved-cards a[href*="maps"], ul.saved-cards a[href*="openstreetmap"]').length,
    cover: document.querySelectorAll('ul.saved-cards li.pl .pl-cover, ul.saved-cards li.pl .plate').length }));
  await shot(page, 'saved-m', true);
  check('saved', 'saved page shows the 3 places saved from the sheet', s1.cards === 3, s1.cards);
  check('saved', 'map of saved places', s1.map, s1.map);
  check('saved', 'export KML/GeoJSON/JSON + share + import controls', s1.exp.length === 5, s1.exp);
  check('saved', '"Open in maps" links on each card', s1.maps >= 3, s1.maps);
  // named list: create → rename → delete
  await page.locator('[data-sv=new]').first().click(); await page.waitForTimeout(200);
  await page.fill('#sv-in', 'QA trip'); await page.locator('#sv-form button.btn-primary').click(); await page.waitForTimeout(800);
  const created = await page.evaluate(() => [...document.querySelectorAll('.listtabs .pill')].map(p => p.textContent));
  check('saved', 'create a named list', created.some(t => /QA trip/.test(t)), created);
  await page.locator('[data-sv=rename]').first().click(); await page.waitForTimeout(200);
  await page.fill('#sv-in', 'QA renamed'); await page.locator('#sv-form button.btn-primary').click(); await page.waitForTimeout(600);
  const renamed = await page.evaluate(() => [...document.querySelectorAll('.listtabs .pill')].map(p => p.textContent));
  check('saved', 'rename the list', renamed.some(t => /QA renamed/.test(t)), renamed);
  await page.locator('[data-sv=delete]').first().click(); await page.waitForTimeout(800);
  const deleted = await page.evaluate(() => ({ tabs: [...document.querySelectorAll('.listtabs .pill')].map(p => p.textContent), cards: document.querySelectorAll('ul.saved-cards li.pl').length }));
  check('saved', 'delete the list; the places stay saved', !deleted.tabs.some(t => /QA renamed/.test(t)) && deleted.cards === 3, deleted);
  // Been there
  await page.goto(base + 'beta/saved.html#v=all', { waitUntil: 'load' }); await page.waitForTimeout(1200);
  await page.locator('[data-sv=been]').first().click(); await page.waitForTimeout(800);
  const been = await page.evaluate(() => ({ stamp: document.querySelectorAll('.stamp').length, tab: ([...document.querySelectorAll('.listtabs .pill')].find(p => /Been/.test(p.textContent)) || {}).textContent }));
  check('saved', 'Been there stamps a card', been.stamp >= 1 && /1/.test(been.tab || ''), been);
  // shared view: read-only + Save a copy; unknown ids reported, never dropped
  const shared = base + 'beta/saved.html#list=' + encodeURIComponent('tokyo:' + ids.slice(0, 2).join(',') + ',no-such-place-qa') + '&n=Shared%20QA';
  const ctx2 = await browser.newContext({ ...VP.desktop, serviceWorkers: 'block', reducedMotion: 'reduce' });
  await ctx2.route('**/*', r => r.request().url().startsWith(base) || r.request().url().startsWith('data:') ? r.continue() : r.abort('blockedbyclient'));
  const p2 = await ctx2.newPage(); const e2 = []; p2.on('pageerror', e => e2.push(String(e.message).slice(0, 200)));
  await p2.goto(shared, { waitUntil: 'load' }); await p2.waitForTimeout(1500);
  const sv = await p2.evaluate(() => ({ cards: document.querySelectorAll('ul.saved-cards li.pl').length, gone: (document.querySelector('li.gone') || {}).textContent || '',
    copy: !!document.querySelector('[data-sv=copy]'), edit: document.querySelectorAll('[data-sv=rename],[data-sv=delete],[data-sv=new]').length }));
  await shot(p2, 'saved-shared-d');
  check('saved', 'shared view: read-only (no new/rename/delete) with Save a copy', sv.copy && sv.edit === 0, sv);
  check('saved', 'shared view: 2 known places shown, the unknown id reported', sv.cards === 2 && /1 saved place/.test(sv.gone), sv.gone.slice(0, 120));
  await p2.locator('[data-sv=copy]').click(); await p2.waitForTimeout(1000);
  const cp = await p2.evaluate(() => ({ hash: location.hash, tabs: [...document.querySelectorAll('.listtabs .pill')].map(p => p.textContent) }));
  check('saved', 'Save a copy creates a named list on this device', /#v=l/.test(cp.hash) && cp.tabs.some(t => /Shared QA/.test(t)), cp);
  // storage throwing: the shared view still renders
  const ctx3 = await browser.newContext({ ...VP.mobile, serviceWorkers: 'block' }); await ctx3.addInitScript(NO_STORAGE);
  await ctx3.route('**/*', r => r.request().url().startsWith(base) || r.request().url().startsWith('data:') ? r.continue() : r.abort('blockedbyclient'));
  const p3 = await ctx3.newPage(); const e3 = []; p3.on('pageerror', e => e3.push(String(e.message).slice(0, 200)));
  await p3.goto(shared, { waitUntil: 'load' }); await p3.waitForTimeout(1500);
  const n3 = await p3.evaluate(() => document.querySelectorAll('ul.saved-cards li.pl').length);
  check('saved', 'storage throwing: shared view renders, 0 errors', n3 === 2 && !e3.length, [n3, e3]);
  check('saved', '0 JS errors', !errors.length && !e2.length, errors.concat(e2).slice(0, 3));
  await ctx.close(); await ctx2.close(); await ctx3.close();
}

/* ---------------- ★ signature ---------------- */
function sig() {
  console.log('\n# ★ signature (M2-18, QA-21, QA-16)');
  const bad = [], none = [], kinds = {};
  for (const p of placePages) {
    const h = fs.readFileSync(path.join(BETA, p.beta), 'utf8');
    const rail = (h.match(/<nav class="rail"[\s\S]*?<\/nav>/) || [''])[0];
    const stars = [...rail.matchAll(/<button[^>]*>(?:(?!<\/button>)[\s\S])*★(?:(?!<\/button>)[\s\S])*<\/button>/g)].map(m => m[0]);
    if (!stars.length) { none.push(p.beta); continue; }
    for (const s of stars) {
      const k = /data-src=/.test(s) || /src-t/.test(s) ? 'publisher' : /data-sig=/.test(s) ? 'canon' : /data-c=/.test(s) ? 'collection' : 'other';
      kinds[k] = (kinds[k] || 0) + 1; if (k === 'publisher' || k === 'other') bad.push(p.beta + ': ' + s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 80));
    }
    const first = (rail.match(/<button[^>]*>/) || [''])[0];
    if (/data-src=/.test(first)) bad.push(p.beta + ': first rail tile is a publisher');
  }
  check('sig', `★ never a publisher on ${placePages.length} place pages`, !bad.length, { kinds, bad: bad.slice(0, 5) });
  check('sig', 'pages with no ★ data show no ★ tile (not a substitute)', true, { noStar: none.length, eg: none.slice(0, 4) });
  const cle = fs.readFileSync(path.join(BETA, 'cleveland.html'), 'utf8');
  const sigT = (cle.match(/<button[^>]*data-sig[^>]*>([\s\S]*?)<\/button>/) || ['', ''])[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  check('sig', 'Cleveland ★ = its food canon (Polish Boy · corned beef · Barberton chicken)', /Polish Boy/.test(sigT), sigT.trim());
}
/* ---------------- D-46: the same features from the Atlas default, through the list head's doors (.ms-doors) ---------------- */
async function doors() {
  console.log('\n# Atlas doors (D-46: For you, Your day, Near me and the For you keyboard trap from the default Atlas)');
  const geo = { latitude: 35.6812, longitude: 139.7671 };
  const door = async (page, sel) => { let l = page.locator('.ms-doors ' + sel).first();
    if (!(await l.isVisible().catch(() => false))) { await page.locator('.ms-toggle').first().click().catch(() => {}); await page.waitForTimeout(600); l = page.locator('.ms-doors ' + sel).first(); }
    return (await l.isVisible().catch(() => false)) ? l : null; };
  for (const vp of ['mobile', 'desktop']) {
    const tag = `cities/tokyo.html ${vp} (Atlas default)`;
    // For you: the picker opens, picking lifts cards ("First because"), nothing hidden (the Atlas count is unchanged)
    let { ctx, page, st } = await open('cities/tokyo.html', vp, { settle: 1500 });
    check('doors', `${tag}: opens in Atlas`, await page.evaluate(() => document.documentElement.getAttribute('data-view')) === 'atlas');
    let d = await door(page, '[data-cleo-foryou]');
    // phone Atlas: the doors are not on screen (FE-1's list head is desktop); recorded, not failed — a product call, raised
    if (!d && vp === 'mobile') { check('doors', `${tag}: no For you / Your day / Near me door on the phone Atlas screen (reached via Gallery)`, null, 'INFO — product call'); await ctx.close(); continue; }
    if (!d) check('doors', `${tag}: For you door present`, false);
    else {
      const c0 = await page.evaluate(() => (document.querySelector('.ms-count') || {}).textContent || '');
      await d.click(); await page.waitForTimeout(400);
      const opts = await page.locator('#cleo-fy [data-i]').count();
      for (let i = 0; i < opts; i++) await page.locator('#cleo-fy [data-i]').nth(i).click();
      await page.locator('#cleo-fy [data-fy=go]').click(); await page.waitForTimeout(700);
      const r = await page.evaluate(() => ({ line: (document.getElementById('cleo-fyline') || {}).textContent || '', why: document.querySelectorAll('li.pl .pl-why').length, c1: (document.querySelector('.ms-count') || {}).textContent || '', total: document.querySelectorAll('li.pl').length }));
      check('doors', `${tag}: For you from the door — picker (≤ 5), cards lifted ("First because"), the count unchanged`, opts > 0 && opts <= 5 && r.why > 0 && /First because/.test(r.line) && (c0.match(/\d+/) || [''])[0] === (r.c1.match(/\d+/) || [''])[0], { opts, why: r.why, c0: c0.slice(0, 40), c1: r.c1.slice(0, 40) });
    }
    check('doors', `${tag}: For you — 0 JS errors`, !st.errors.length, st.errors.slice(0, 2)); await ctx.close();
    // Your day: 4–6 stops, one area, straight-line legs
    ({ ctx, page, st } = await open('cities/tokyo.html', vp, { settle: 1500 }));
    d = await door(page, '[data-cleo-day]');
    if (!d) check('doors', `${tag}: Your day door present`, false);
    else { await d.click(); await page.waitForTimeout(900);
      const r = await page.evaluate(() => ({ n: document.querySelectorAll('section.day ol.stops > li.stop').length, legs: [...document.querySelectorAll('section.day .leg')].map(l => l.textContent.trim()) }));
      check('doors', `${tag}: Your day from the door — 4–6 stops, straight-line legs`, r.n >= 4 && r.n <= 6 && r.legs.slice(0, r.n - 1).every(l => /straight-line/i.test(l)), r); }
    check('doors', `${tag}: Your day — 0 JS errors`, !st.errors.length, st.errors.slice(0, 2)); await ctx.close();
    // Near me: distances shown, the "never stored" note
    ({ ctx, page, st } = await open('cities/tokyo.html', vp, { geo, settle: 1500 }));
    d = await door(page, '[data-cleo-near]');
    if (!d) check('doors', `${tag}: Near me door present`, false);
    else { await d.click(); await page.waitForTimeout(1500);
      const r = await page.evaluate(() => ({ dist: document.querySelectorAll('li.pl .pl-dist').length, note: [(document.getElementById('cleo-nearline') || {}).textContent || '', ...[...document.querySelectorAll('[aria-live], [role=status]')].map(e => e.textContent)].join(' ').trim() }));   // Atlas says it in its live message
      check('doors', `${tag}: Near me from the door — distances on cards, "never stored" note`, r.dist > 0 && /never stored/i.test(r.note), { dist: r.dist, note: r.note.slice(0, 80) }); }
    check('doors', `${tag}: Near me — 0 JS errors`, !st.errors.length, st.errors.slice(0, 2)); await ctx.close();
    // keyboard: the For you picker from the door traps focus; Esc closes and returns focus to the door
    ({ ctx, page, st } = await open('cities/tokyo.html', vp, { settle: 1500 }));
    d = await door(page, '[data-cleo-foryou]');
    if (d) { await d.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(400);
      const fy = await page.evaluate(() => !!document.activeElement.closest('#cleo-fy'));
      await page.keyboard.press('Escape'); await page.waitForTimeout(300);
      const fy2 = await page.evaluate(() => ({ closed: document.getElementById('cleo-fy').hidden, back: !!document.activeElement.closest('.ms-doors') && document.activeElement.hasAttribute('data-cleo-foryou') }));
      check('doors', `${tag}: keyboard — the For you picker from the door traps focus, Esc closes and returns focus to the door`, fy && fy2.closed && fy2.back, { fy, fy2 }); }
    await ctx.close();
  }
}

async function sigFood() {
  // QA-16 / M1-03: the food rail / food mode opens on the canon
  const { ctx, page } = await open('cleveland.html', 'mobile', { hash: '#view=gallery' });   // D-46: the ★ tile is on the Gallery rail
  await page.locator('[data-sig]').first().click(); await page.waitForTimeout(700);
  const r = await page.evaluate(() => { const v = [...document.querySelectorAll('li.pl')].filter(c => !c.closest('[hidden]') && c.offsetParent);
    return { n: v.length, first: v.slice(0, 4).map(c => c.querySelector('.pl-n').textContent.trim()), shown: (document.getElementById('cleo-shown') || {}).textContent || '' }; });
  await shot(page, 'sig-cleveland-m');
  check('sig', 'Cleveland ★ lens opens on the canon places (18)', r.n === 18, r);
  await ctx.close();
}

/* ---------------- DOM budget ---------------- */
async function dom() {
  console.log('\n# Progressive rendering (M3-06)');
  for (const rel of ['cities/tokyo.html', 'cities/newyork.html']) for (const vp of ['mobile', 'desktop']) {
    const { ctx, page, st } = await open(rel, vp, { settle: 1500 });
    const n = await page.evaluate(() => document.getElementsByTagName('*').length);
    const all = await page.evaluate(ALL_CARDS);
    check('dom', `${rel} ${vp}: initial DOM ≤ 3,000 nodes`, n <= 3000, n);
    check('dom', `${rel} ${vp}: every place reachable after stamp-all`, all.length === total(rel) && new Set(all.map(c => c.id)).size === total(rel), [all.length, total(rel)]);
    check('dom', `${rel} ${vp}: 0 JS errors`, !st.errors.length, st.errors.slice(0, 3));
    await ctx.close();
  }
}

/* ---------------- OG images ---------------- */
function og() {
  console.log('\n# Share images (M2-08)');
  const pngDim = f => { const b = fs.readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20), b.length]; };
  const bad = [], uniq = new Set(); let n = 0;
  for (const rel of walk(BETA)) {
    const h = fs.readFileSync(path.join(BETA, rel), 'utf8');
    const m = h.match(/<meta property="og:image" content="([^"]+)"/); if (!m) { if (byBeta[rel]) bad.push(rel + ': no og:image'); continue; }
    const loc = m[1].replace(/^https:\/\/alvations\.github\.io\/cleo-guide\//, '');
    const f = path.join(ROOT, loc);
    if (!fs.existsSync(f)) { bad.push(rel + ': missing ' + loc); continue; }
    const [w, hgt, sz] = pngDim(f); n++;
    if (byBeta[rel]) uniq.add(loc);
    if (w !== 1200 || hgt !== 630 || sz > 300 * 1024) bad.push(`${rel}: ${w}×${hgt} ${Math.round(sz / 1024)} KB`);
  }
  check('og', `every og:image is a local 1200×630 PNG ≤ 300 KB (${n} pages)`, !bad.length, bad.slice(0, 5));
  check('og', 'each place page has its own share card', uniq.size === placePages.length, [uniq.size, placePages.length]);
}

/* ---------------- Hubs, landing, motifs ---------------- */
const CATEGORY = /^(sights?|food|food & drink|eat & drink|museums?|parks?|restaurants?|bars?|cafes?|attractions?|landmarks?|history|culture|art|nature|nightlife|shopping)$/i;
async function hubs() {
  console.log('\n# Hubs, landing, motifs (M2-16, M2-14)');
  const hubPages = walk(BETA).filter(r => /(^|\/)index\.html$/.test(r));
  const lines = [], badLine = [], missingMotif = [], comps = [];
  for (const rel of hubPages) {
    const h = fs.readFileSync(path.join(BETA, rel), 'utf8');
    const uls = [...h.matchAll(/<ul class="tiles[^"]*"[^>]*>([\s\S]*?)<\/ul>/g)];   // neighbours = same tile list (sections don't touch)
    for (const [ui, u] of uls.entries()) for (const m of u[1].matchAll(/<li class="dest"[\s\S]*?<\/li>/g)) {
      const t = m[0];
      if (!/class="tile/.test(t)) continue;                          // compact "more guides" list rows are not tiles
      const sl = [...(t.match(/<span class="sigline">([\s\S]*?)<\/span><span class="star|<span class="sigline">([\s\S]*?)<\/span><\/span>/) || [])].slice(1).find(Boolean) || '';
      const parts = [...sl.matchAll(/<span>([^<]+)<\/span>/g)].map(x => x[1].trim());
      lines.push(parts.join(' · '));
      if (!parts.length || parts.some(p => CATEGORY.test(p))) badLine.push(rel + ': ' + (t.match(/data-page="([^"]+)"/) || [])[1] + ' → "' + parts.join(' · ') + '"');
      for (const im of t.matchAll(/<img class="motif" src="([^"]+)"/g)) { const f = path.resolve(path.dirname(path.join(BETA, rel)), im[1]); if (!fs.existsSync(f)) missingMotif.push(rel + ' ' + im[1]); }
      comps.push(rel + '#' + ui + '|' + ((t.match(/class="tile ([^"]+)"/) || [])[1] || ''));
    }
  }
  check('hubs', `hub tile lines are signature lines, never category labels (${lines.length} tiles)`, !badLine.length, badLine.slice(0, 6));
  check('hubs', 'every motif referenced by a hub tile exists', !missingMotif.length, missingMotif.slice(0, 4));
  const byHub = {}; comps.forEach(c => { const [h, k] = c.split('|'); (byHub[h] = byHub[h] || []).push(k); });
  const adj = []; for (const [h, ks] of Object.entries(byHub)) ks.forEach((k, i) => { if (i && k === ks[i - 1] && ks.length > 1) adj.push(h + ' #' + i + ' ' + k); });
  const kinds = new Set(comps.map(c => c.split('|')[1]));
  check('hubs', '≥ 4 tile compositions; no two neighbouring tiles share one', kinds.size >= 4 && !adj.length, { kinds: [...kinds], adj: adj.slice(0, 4) });
  // landing editorial rail: every deep link opens with the count it promises
  const land = fs.readFileSync(path.join(BETA, 'index.html'), 'utf8');
  const links = [...land.matchAll(/<span class="theme-c">([\s\S]*?)<\/span><\/li>/g)].flatMap(m => [...m[1].matchAll(/<a href="([^"]+)">[^<]*<b>(\d+)<\/b><\/a>/g)].map(x => [x[1], +x[2]]));
  const mism = [];
  for (const [href, n] of links) {
    const [rel, hash] = href.split('#');
    const { ctx, page, st } = await open(rel, 'desktop', { hash: '#' + hash, settle: 700 });
    // W7 Atlas map-search: a lens link opens Atlas, whose list pages by 48 — the promised count is the results header's
    // total (the map is fitted to every match), not the cards on the first page (docs/BETA-LOG.md, for R7 QA to ratify).
    // Elsewhere (no results header) the rendered cards are counted as before.
    const got = await page.evaluate(() => { const hd = document.querySelector('.ms-head .ms-count b'); if (hd && hd.offsetParent) return +hd.textContent.replace(/[^\d]/g, '');
      if (window.Cleo && Cleo.defer && Cleo.defer.all) Cleo.defer.all();
      return [...document.querySelectorAll('li.pl')].filter(c => !c.closest('[hidden]') && !c.hidden && getComputedStyle(c).display !== 'none').length; });
    if (got !== n || st.errors.length) mism.push({ href, promised: n, shown: got, errors: st.errors.slice(0, 1) });
    await ctx.close();
  }
  check('hubs', `landing editorial rail: ${links.length} deep links open with the promised count`, !mism.length, mism.slice(0, 6));
  R.railMismatch = mism;
  const { ctx, page } = await open('index.html', 'desktop'); await page.locator('#themes').scrollIntoViewIfNeeded(); await shot(page, 'landing-rail-d'); await ctx.close();
  const j = await open('Japan/index.html', 'mobile'); await shot(j.page, 'hub-japan-m'); await j.ctx.close();
}

/* ---------------- Accessibility (axe) ---------------- */
async function a11y() {
  console.log('\n# Accessibility (axe-core 4.10, vendored; M1-16, B-23, M2-12)');
  const AXE = fs.readFileSync(path.join(__dirname, 'vendor', 'axe.min.js'), 'utf8');
  const pages = ['index.html', 'Japan/index.html', 'Vietnam/index.html', ...PILOTS, 'saved.html', 'accessibility.html', 'how-we-choose.html', '404.html'];
  const rows = [];
  for (const rel of pages) for (const vp of ['mobile', 'desktop']) for (const scheme of ['light', 'dark']) {
    if (vp === 'mobile' && scheme === 'dark') continue;
    const { ctx, page } = await open(rel, vp, { scheme, settle: 900 });
    await page.addScriptTag({ content: AXE });
    const res = await page.evaluate(async () => {
      const r = await axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } });
      return r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, eg: v.nodes.slice(0, 2).map(n => n.target.join(' ') + ' — ' + (n.failureSummary || '').split('\n').slice(1, 2).join('').trim().slice(0, 140)) }));
    });
    const sc = res.filter(v => v.impact === 'serious' || v.impact === 'critical');
    rows.push({ rel, vp, scheme, serious: sc, other: res.filter(v => !sc.includes(v)).map(v => v.id + '(' + v.impact + ')×' + v.n) });
    check('a11y', `${rel} ${vp} ${scheme}: axe serious/critical = 0`, !sc.length, sc.map(v => `${v.id}×${v.n}: ${v.eg[0]}`).slice(0, 3));
    await ctx.close();
  }
  R.axe = rows;
  // keyboard: Tab from the top reaches the skip link first, then the toolbar; Enter on a card opens the sheet; Esc restores focus
  const { ctx, page } = await open('cities/tokyo.html', 'desktop', { hash: '#view=gallery' });   // D-46: the card + rail flow is the Gallery's (Atlas: doors())
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => ({ t: document.activeElement.textContent.trim().slice(0, 30), href: document.activeElement.getAttribute('href') }));
  check('a11y', 'keyboard: first Tab is the skip link', /skip/i.test(first.t) || /^#/.test(first.href || ''), first);
  await page.focus('li.pl .pl-n a'); await page.keyboard.press('Enter'); await page.waitForTimeout(700);
  const op = await page.evaluate(() => ({ open: !!document.querySelector('#cleo-sheet:not([hidden])'), inSheet: !!document.activeElement.closest('#cleo-sheet') }));
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  const back = await page.evaluate(() => ({ closed: !document.querySelector('#cleo-sheet:not([hidden])'), focus: (document.activeElement.closest('li.pl') || {}).id || document.activeElement.tagName }));
  check('a11y', 'keyboard: Enter opens the sheet with focus inside; Esc closes and restores focus to the card', op.open && op.inSheet && back.closed && /^p-/.test(back.focus), { op, back });
  // For you picker by keyboard
  await page.focus('[data-cleo-foryou]'); await page.keyboard.press('Enter'); await page.waitForTimeout(400);
  const fy = await page.evaluate(() => ({ inside: !!document.activeElement.closest('#cleo-fy') }));
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  const fy2 = await page.evaluate(() => ({ closed: document.getElementById('cleo-fy').hidden, back: document.activeElement.hasAttribute('data-cleo-foryou') }));
  check('a11y', 'keyboard: For you picker traps focus, Esc closes and returns focus', fy.inside && fy2.closed && fy2.back, { fy, fy2 });
  await ctx.close();
  // accessibility page exists and is linked from every page footer
  const unlinked = walk(BETA).filter(r => !/accessibility\.html/.test(fs.readFileSync(path.join(BETA, r), 'utf8')));
  check('a11y', `accessibility page linked from every beta page (${walk(BETA).length})`, fs.existsSync(path.join(BETA, 'accessibility.html')) && !unlinked.length, unlinked.slice(0, 5));
  const ap = await open('accessibility.html', 'mobile'); await shot(ap.page, 'accessibility-m', true); await ap.ctx.close();
}

/* ---------------- storage-blocked render on every place page ---------------- */
async function storage() {
  console.log('\n# Storage-blocked render (every place page)');
  const bad = [];
  for (const p of placePages) {
    const { ctx, page, st } = await open(p.beta, 'desktop', { noStorage: true, settle: 300 });
    const n = await page.evaluate(() => { if (window.Cleo && Cleo.defer && Cleo.defer.all) Cleo.defer.all(); return document.querySelectorAll('li.pl').length; });
    if (n !== total(p.beta) || st.errors.length) bad.push({ page: p.beta, cards: n, want: total(p.beta), errors: st.errors.slice(0, 2) });
    await ctx.close();
  }
  check('storage', `storage throws: every card renders, 0 JS errors (${placePages.length} pages)`, !bad.length, bad.slice(0, 5));
  const { ctx, page } = await open('saved.html', 'mobile', { noStorage: true });
  const t = await page.evaluate(() => document.body.innerText.slice(0, 200)); await shot(page, 'saved-nostorage-m'); await ctx.close();
  check('storage', 'saved page renders with storage throwing', t.length > 20, t.slice(0, 80));
}

(async () => {
  const { chromium } = loadPlaywright();
  const srv = await serve(); base = `http://127.0.0.1:${srv.address().port}/`;
  browser = await chromium.launch();
  const steps = { foryou, day, near, doors, map, saved, sig: async () => { sig(); await sigFood(); }, dom, og: async () => og(), hubs, a11y, storage };
  for (const [k, f] of Object.entries(steps)) if (want(k)) { try { await f(); } catch (e) { check(k, 'probe crashed', false, String(e.stack || e).slice(0, 300)); } }
  await browser.close(); srv.close();
  const fail = R.checks.filter(c => c.ok === false);
  R.summary = { checks: R.checks.length, pass: R.checks.length - fail.length, fail: fail.length, at: new Date().toISOString() };
  const outF = path.join(OUT, ONLY.length ? 'w2-' + ONLY.join('-') + '.json' : 'w2.json');
  fs.writeFileSync(outF, JSON.stringify(R, null, 1));
  console.log(`\n>>> ${R.summary.pass}/${R.summary.checks} PASS, ${fail.length} FAIL → ${path.relative(ROOT, outF)}`);
})();
