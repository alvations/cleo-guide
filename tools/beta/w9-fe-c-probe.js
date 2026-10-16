#!/usr/bin/env node
'use strict';
/**
 * tools/beta/w9-fe-c-probe.js — FE-C W9 probe (real Chromium, offline: same-origin files from disk, tiles stubbed,
 * every other off-origin request aborted and counted). Exit 1 on any FAIL. Shots → design/beta/eval/w9/fe-c/.
 *
 *   cd tools && NODE_PATH=$(npm root -g) node beta/w9-fe-c-probe.js      (npm run beta:probe:fe-c)
 *
 *  trip-keys   at 390 and 1440, light and dark: from=all → choose 3 days → make the trip, by keyboard alone
 *  trip-link   the #trip= link reopens in a fresh context (no storage) with identical days and order
 *  trip-print  the booklet PDF has one page per day plus the cover and the left-out page
 *  trip-map    "Open day 1 on the map" opens the guide in day mode with exactly the trip's stops, in order
 *  offorigin   0 off-origin requests (tiles stubbed only on the guide page)
 *  base-keys   (W9-5) at 390 and 1440, light and dark: a place sheet → "Set as my base" by keyboard; then Gallery, Atlas and
 *              Guidebook each show the assumption once and the line on every visible card; Saved too
 *  base-lazy   a first load with no base never requests base.js; with a base it is requested once
 *  rec-pv      (W9-1) the Atlas map preview of a recognised place carries its badges (text: the preview is one link)
 *  rec-tap     (QA-77) badge links are ≥ 44 px tap targets (B-20) on 4 pilots × Gallery/Atlas at 390; the pill still paints 32 px
 *  empty       (QC-05, S-05-style) #q=zzqxjv on 5 pilots × Gallery/Atlas × 390/1440: one visible state naming the search
 *              (Gallery: empty.js; Atlas: FE-1's list head), "Clear search" (works) and "Show all N", no "All N" chip pressed
 *  card        (W9-7) place (photo), closed place, day, list (Saved) and trip: a 1080×1920 PNG; its preview's alt text names
 *              the source line, the checked date and (photo cards) the credit; 0 off-origin requests from the tap to the
 *              preview; works with the map library blocked; Web Share gets an image/png file where supported, else a download
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..'), BASE = 'https://cleo.local/', SHOTS = path.join(ROOT, 'design/beta/eval/w9/fe-c');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48OHDfwAJigPgXSGvvwAAAABJRU5ErkJggg==', 'base64');
let fails = 0;
const ok = (c, msg, v) => { if (!c) fails++; console.log(`  ${c ? 'PASS' : 'FAIL'}  ${msg}${v !== undefined ? ' = ' + JSON.stringify(v) : ''}`); };
const SAVED = {};
['senso-ji', 'tokyo-national-museum', 'ueno-park', 'kappabashi-dogu-gai', 'yanaka-cemetery', 'asakusa-shrine', 'national-museum-of-western-art', 'shibuya-scramble-crossing',
  'yoyogi-park', 'meiji-jingu', 'hachiko-statue', 'unicorn-gundam-statue-divercity-tokyo-plaza', 'shinjuku-golden-gai', 'isegen', 'kanda-myojin'].forEach((id, i) => { SAVED['tokyo/' + id] = { t: i }; });

async function open(b, url, o = {}) {   // o.noLeaflet: the map library is blocked
  const ctx = await b.newContext({ viewport: { width: o.w || 390, height: o.h || 844 }, isMobile: (o.w || 390) < 500, hasTouch: (o.w || 390) < 500, serviceWorkers: 'block', colorScheme: o.dark ? 'dark' : 'light' });
  const off = [];
  await ctx.route('**/*', r => { const u = r.request().url();
    if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u) && o.tiles) return r.fulfill({ status: 200, contentType: 'image/png', body: TILE });
    if (!u.startsWith(BASE)) { off.push(u); return r.abort('blockedbyclient'); }
    if (o.noLeaflet && /assets\/vendor\/leaflet\//.test(u)) return r.abort('blockedbyclient');
    const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname));
    if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
    return r.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) }); });
  if (o.saved) await ctx.addInitScript(s => { try { localStorage.setItem('cleo:v1:saved', s); } catch (e) {} }, JSON.stringify(o.saved));
  if (o.share) await ctx.addInitScript(() => { navigator.canShare = () => true; navigator.share = d => { window.__shared = { n: d.files && d.files.length, type: d.files && d.files[0].type, size: d.files && d.files[0].size, text: d.text }; return Promise.resolve(); }; });
  if (o.dark) await ctx.addInitScript(() => { try { localStorage.setItem('cleo:v1:theme', '"dark"'); } catch (e) {} });
  const page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(BASE + 'beta/' + url, { waitUntil: 'load' }); await page.waitForTimeout(o.settle || 700);
  return { ctx, page, errs, off };
}
const DAYS = () => [...document.querySelectorAll('.tday')].map(s => [...s.querySelectorAll('.tstop .go')].map(a => a.getAttribute('href').split('#p=')[1]));
/** Tab until the focused element matches `test` (max n presses). */
async function tabTo(page, test, n = 80) {
  for (let i = 0; i < n; i++) { await page.keyboard.press('Tab'); if (await page.evaluate(test)) return true; }
  return false;
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  let b; try { b = await chromium.launch(); } catch (e) { b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  let link = null, ref = null;
  console.log('# trip-keys (keyboard only) and shots');
  for (const w of [390, 1440]) for (const dark of [false, true]) {
    const tag = `${w}-${dark ? 'dark' : 'light'}`, s = await open(b, 'trip.html', { w, dark, saved: SAVED, h: w < 500 ? 844 : 900 });
    await s.page.screenshot({ path: path.join(SHOTS, `trip-home-${tag}.png`) });
    let k = await tabTo(s.page, () => document.activeElement && document.activeElement.getAttribute('href') === '#from=all');
    await s.page.keyboard.press('Enter'); await s.page.waitForTimeout(500);
    k = k && await tabTo(s.page, () => document.activeElement && document.activeElement.name === 'days');
    // radios: arrow keys move the choice; land on 3 days
    for (let i = 0; i < 7 && await s.page.evaluate(() => document.activeElement.value !== '3'); i++) await s.page.keyboard.press('ArrowRight');
    await s.page.screenshot({ path: path.join(SHOTS, `trip-build-${tag}.png`) });
    k = k && await tabTo(s.page, () => document.activeElement && document.activeElement.type === 'submit');
    await s.page.keyboard.press('Enter'); await s.page.waitForTimeout(600);
    const days = await s.page.evaluate(DAYS), url = s.page.url(), focus = await s.page.evaluate(() => document.activeElement.id);
    ok(k && days.length === 3 && /#trip=/.test(url) && focus === 'tp-h', `${tag}: built a 3-day trip by keyboard alone, focus on its title`, [days.length, focus]);
    const over = await s.page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    ok(over <= 0, `${tag}: no sideways scroll`, over);
    await s.page.screenshot({ path: path.join(SHOTS, `trip-${tag}.png`), fullPage: true });
    ok(!s.errs.length && !s.off.length, `${tag}: 0 page errors, 0 off-origin requests`, [s.errs.slice(0, 2), s.off.slice(0, 2)]);
    if (!link) { link = url.split('/beta/')[1]; ref = days; }
    await s.ctx.close();
  }

  console.log('# trip-link (fresh context, no storage)');
  { const s = await open(b, link, { w: 1440 }); const days = await s.page.evaluate(DAYS);
    ok(JSON.stringify(days) === JSON.stringify(ref), 'the link reopens identical days and order', days);
    const lo = await s.page.evaluate(() => [...document.querySelectorAll('.tp-left li')].map(li => li.textContent));
    ok(lo.some(t => /Closed[\s\S]*Closed — kept for the record/.test(t)) && !lo.some(t => /— CLOSED/.test(t)) && lo.every(t => /Closed —|Didn’t fit|No verified pin/.test(t)), 'every left-out place is named with its reason (a Closed chip, not the raw marker)', lo.length);

    console.log('# trip-print');
    await s.page.emulateMedia({ media: 'print' });
    const vis = await s.page.evaluate(() => [...document.querySelectorAll('.sharebar, .tday-acts, [data-cleo-shell]')].filter(e => e.getClientRects().length).length);
    ok(vis === 0, 'print hides the actions and the site bar', vis);
    const pdf = await s.page.pdf({ format: 'A5', printBackground: true }), pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    ok(pages === ref.length + 2, `the booklet has one page per day + cover + left out (${ref.length + 2})`, pages);
    fs.writeFileSync(path.join(SHOTS, 'trip-booklet.pdf'), pdf);
    await s.ctx.close(); }

  console.log('# trip-map (a day opens in day mode on its guide)');
  { const s = await open(b, link, { w: 1440 }); const href = await s.page.getAttribute('[data-tp-day="1"]', 'href'); await s.ctx.close();
    const m = await open(b, href.split('/beta/')[1], { w: 1440, tiles: true, settle: 1800 });
    const st = await m.page.evaluate(() => [...document.querySelectorAll('.day .stops .go')].map(a => a.getAttribute('href').replace('#p-', '')));
    ok(JSON.stringify(st) === JSON.stringify(ref[0]), 'day mode shows exactly day 1\'s stops in order', st);
    await m.page.screenshot({ path: path.join(SHOTS, 'trip-day1-on-map-1440-light.png') });
    ok(!m.errs.length, 'guide page: 0 page errors', m.errs.slice(0, 2)); await m.ctx.close(); }

  console.log('# base-lazy');
  { const s = await open(b, 'cities/tokyo.html', { w: 1440, tiles: true, settle: 1500 }), req = [];
    const n = await s.page.evaluate(() => performance.getEntriesByType('resource').filter(r => /assets\/js\/base\.js/.test(r.name)).length);
    ok(n === 0, 'Tokyo first load with no base: base.js not requested', n); await s.ctx.close(); }

  console.log('# base-keys (keyboard) and shots');
  for (const w of [390, 1440]) for (const dark of [false, true]) {
    const tag = `${w}-${dark ? 'dark' : 'light'}`, s = await open(b, 'cities/tokyo.html#p=senso-ji', { w, dark, tiles: true, settle: 1600 });
    const k = await tabTo(s.page, () => document.activeElement && document.activeElement.getAttribute('data-cleo-base') === 'set', 60);
    await s.page.keyboard.press('Enter'); await s.page.waitForTimeout(400);
    const set = await s.page.evaluate(() => Cleo.base.get() && Cleo.base.get().id);
    ok(k && set === 'senso-ji', `${tag}: "Set as my base" reached and pressed by keyboard`, [k, set]);
    await s.page.screenshot({ path: path.join(SHOTS, `base-sheet-${tag}.png`) });
    const fin = await s.page.evaluate(() => { const a = document.activeElement; return !!(a && a.closest('#cleo-sheet')) && a.getAttribute('data-cleo-base'); });
    ok(fin === 'clear', `${tag}: QC-15 focus stays in the sheet, on "Clear my base"`, fin);
    await s.page.keyboard.press('Escape'); await s.page.waitForTimeout(500);
    ok(await s.page.evaluate(() => document.getElementById('cleo-sheet').hidden), `${tag}: QC-15 Escape closes the sheet after the action`);
    for (const v of ['gallery', 'atlas', 'guidebook']) {
      await s.page.evaluate(v => { location.hash = '#view=' + v + '&base=senso-ji'; }, v); await s.page.waitForTimeout(1600);
      // desktop Atlas holds its list until .ms-ready (atlas.js, ≤ 3 s): read it once it is shown, as a reader would
      if (v === 'atlas') await s.page.waitForFunction(() => document.documentElement.classList.contains('ms-ready'), null, { timeout: 4000 }).catch(() => {});
      // phone Atlas opens map-first (the "n places here · Show list" peek): open the list, as a reader would
      if (v === 'atlas' && w < 500) { const t = await s.page.$('.ms-toggle[aria-pressed="false"]'); if (t) { await t.click(); await s.page.waitForTimeout(700); } }
      await s.page.evaluate(v => { const sel = { gallery: 'li.gc[data-id]', atlas: 'li.pl[id^="p-"]', guidebook: 'li.ge[data-id]' }[v];
        const c = [...document.querySelectorAll(sel)].find(e => e.getClientRects().length); if (c) c.scrollIntoView({ block: 'center' }); }, v); await s.page.waitForTimeout(600);
      const r = await s.page.evaluate(() => {
        const vis = e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
        const cards = [...document.querySelectorAll('li.pl[id^="p-"], li.gc[data-id], li.ge[data-id]')].filter(vis).filter(c => { const r = c.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; });
        const notes = [...document.querySelectorAll('#cleo-basenote')].filter(vis).length;
        return { cards: cards.length, lined: cards.filter(c => { const l = c.querySelector('[data-cleo-bl]'); return l && vis(l) && / from Sensō-ji · |^Your base$/.test(l.textContent); }).length, notes,
          over: document.documentElement.scrollWidth - innerWidth };
      });
      ok(r.cards > 0 && r.lined === r.cards && r.notes === 1 && r.over <= 0, `${tag} ${v}: the assumption once, the line on every card in view, no sideways scroll`, r);
      await s.page.screenshot({ path: path.join(SHOTS, `base-${v}-${tag}.png`) });
    }
    const req = await s.page.evaluate(() => performance.getEntriesByType('resource').filter(r => /assets\/js\/base\.js/.test(r.name)).length);
    ok(req === 1, `${tag}: base.js requested once`, req);
    ok(!s.errs.length && !s.off.length, `${tag}: 0 page errors, 0 off-origin requests`, [s.errs.slice(0, 2), s.off.slice(0, 2)]);
    const cs = await s.ctx.storageState(); await s.ctx.close();
    const sv = await open(b, 'saved.html', { w, dark, saved: SAVED, settle: 1500 });
    await sv.page.evaluate(() => { try { localStorage.setItem('cleo:v1:mybase', '{"tokyo":"senso-ji"}'); } catch (e) {} }); await sv.page.reload({ waitUntil: 'load' }); await sv.page.waitForTimeout(1500);
    const sr = await sv.page.evaluate(() => ({ lines: document.querySelectorAll('#cleo-saved li.pl [data-cleo-bl]').length, notes: document.querySelectorAll('#cleo-basenote').length }));
    ok(sr.lines >= 10 && sr.notes === 1, `${tag} Saved: the line on Tokyo cards, the assumption once`, sr);
    await sv.page.screenshot({ path: path.join(SHOTS, `base-saved-${tag}.png`) }); await sv.ctx.close();
  }

  console.log('# rec-pv (W9-1 badges in the Atlas preview)');
  { const s = await open(b, 'cities/tokyo.html#view=atlas', { w: 1440, tiles: true, settle: 2500 });
    const r = await s.page.evaluate(async () => { const c = document.querySelector('li.pl[data-ra]'); if (!c || !Cleo.city.openPoi) return null; Cleo.city.openPoi(c);
      await new Promise(x => setTimeout(x, 500)); const a = document.querySelector('a.ms-pv'), g = a && a.querySelector('.gc-rec');
      return { id: c.id, n: (c.getAttribute('data-ra') || '').split(' ').length + ((c.getAttribute('data-rec') || '').includes('cited') ? 1 : 0), got: g ? g.querySelectorAll('.rb').length : 0, links: g ? g.querySelectorAll('a').length : -1, text: g && g.textContent, chk: (a && a.querySelector('.pv-chk') || { getAttribute: () => null }).getAttribute('data-d'), want: c.getAttribute('data-checked') }; });
    ok(r && r.got === r.n && r.links === 0, 'the Atlas preview of a recognised place shows its badges, as text', r); ok(r && r.chk && r.chk === r.want, 'W9-2: the Atlas preview carries "Status checked <d Mon>" from the place\'s data-checked', r && [r.chk, r.want]); ok(!s.errs.length, 'rec-pv: 0 page errors', s.errs.slice(0, 2)); await s.ctx.close(); }

  console.log('# empty (QC-05: a search with no match states it, and offers a way out; Gallery: empty.js, Atlas: the list head, FE-1)');
  for (const rel of ['cities/tokyo.html', 'cleveland.html', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html']) for (const w of [390, 1440]) for (const v of ['gallery', 'atlas']) {
    const tag = `${rel.split('/').pop().replace('.html', '')} ${v} ${w}`, s = await open(b, rel + '#view=' + v + '&q=zzqxjv', { w, tiles: true, settle: 1500 });
    if (v === 'atlas' && w < 500) { const t = s.page.locator('.ms-toggle').filter({ visible: true }).first(); if (await t.count()) { await t.click().catch(() => {}); await s.page.waitForTimeout(700); } }
    const st = await s.page.evaluate(v => { const vis = e => { if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
      const host = v === 'atlas' ? [...document.querySelectorAll('.ms-head')].find(vis) : [...document.querySelectorAll('[data-cleo-empty]')].find(vis);
      const clear = host && [...host.querySelectorAll(v === 'atlas' ? '[data-ms-clear="q"]' : '[data-unset="q"]')].find(vis), all = host && [...host.querySelectorAll(v === 'atlas' ? '[data-ms-clear="all"]' : '[data-cleo-all]')].find(vis);
      return { msg: host ? host.textContent.replace(/\s+/g, ' ').trim().slice(0, 140) : null, clear: !!clear, all: !!all, both: [...document.querySelectorAll('[data-cleo-empty]')].filter(vis).length + (v === 'atlas' ? 0 : [...document.querySelectorAll('.ms-head [data-ms-clear]')].filter(vis).length),
        cards: [...document.querySelectorAll('li.pl, li.gc, li.ge')].filter(vis).length, pressedAll: [...document.querySelectorAll('button[data-mode][aria-pressed="true"]')].filter(vis).map(b => b.textContent.trim()), over: document.documentElement.scrollWidth - innerWidth }; }, v);
    ok(!!st.msg && /No places match “zzqxjv”/.test(st.msg) && st.clear && st.all && st.cards === 0 && !st.pressedAll.length && st.over <= 0 && (v === 'gallery' || st.both === 0),
      `${tag}: one empty state names the search, offers Clear search + Show all, no card, no chip pressed`, st);
    if (rel === 'cities/tokyo.html') await s.page.screenshot({ path: path.join(SHOTS, `empty-${v}-${w}.png`) });
    const btn = s.page.locator(v === 'atlas' ? '.ms-head [data-ms-clear="q"]' : '[data-cleo-empty] [data-unset="q"]').filter({ visible: true }).first(); await btn.click(); await s.page.waitForTimeout(600);
    const after = await s.page.evaluate(() => ({ q: /[#&]q=/.test(location.hash), input: (document.getElementById('cleo-filter') || {}).value || '' }));
    ok(!after.q && !after.input, `${tag}: "Clear search" clears the search`, after);
    await s.ctx.close();
  }

  console.log('# card (share images)');
  const CARDS = path.join(SHOTS, 'cards'); fs.mkdirSync(CARDS, { recursive: true });
  const CASES = [
    { k: 'place', url: 'cities/tokyo.html#p=senso-ji', btn: '[data-cleo-card="place"]', photo: true },
    { k: 'closed', url: 'cities/tokyo.html#p=unicorn-gundam-statue-divercity-tokyo-plaza', btn: '[data-cleo-card="place"]', closed: true },
    { k: 'day', url: 'cities/tokyo.html#day=TAITO', btn: '[data-cleo-card="day"]' },
    { k: 'list', url: 'saved.html', btn: '[data-cleo-card="list"]', saved: SAVED },
    { k: 'trip', url: link, btn: '[data-cleo-card="trip"]' },
    { k: 'place-noleaflet', url: 'cities/tokyo.html#p=kanda-myojin', btn: '[data-cleo-card="place"]', noLeaflet: true },
  ];
  for (const c of CASES) {
    const s = await open(b, c.url, { w: 1440, tiles: true, saved: c.saved, noLeaflet: c.noLeaflet, settle: 1800 });
    const off0 = s.off.length, reqs = [];
    s.page.on('request', r => reqs.push(r.url()));
    await s.page.click(c.btn);
    await s.page.waitForSelector('#cleo-card-dlg img', { timeout: 10000 }).catch(() => {});
    const r = await s.page.evaluate(() => { const L = Cleo.shareCard && Cleo.shareCard.last, img = document.querySelector('#cleo-card-dlg img');
      return L ? { w: L.canvas.width, h: L.canvas.height, type: L.blob.type, size: L.blob.size, alt: img && img.alt, credit: L.S.credit, png: L.canvas.toDataURL('image/png'), focus: document.activeElement && document.activeElement.getAttribute('data-card') } : null; });
    if (!r) { ok(false, `${c.k}: a card was made`); await s.ctx.close(); continue; }
    fs.writeFileSync(path.join(CARDS, c.k + '.png'), Buffer.from(r.png.split(',')[1], 'base64'));
    ok(r.w === 1080 && r.h === 1920 && r.type === 'image/png' && r.size > 20000, `${c.k}: 1080×1920 PNG`, [r.w, r.h, r.size]);
    const alt = r.alt || '';
    ok(/Recommended by |Added by the guide/.test(alt) && /(checked · |checked to )\d{4}-\d\d-\d\d/.test(alt), `${c.k}: the card names its source and the checked date (alt text)`, alt.slice(0, 120));
    if (c.photo) ok(/^Photo: .+ · .+/.test(r.credit) && alt.includes(r.credit), `${c.k}: the photo's credit is on the card`, r.credit);
    if (c.closed) ok(/Closed · kept for the record/.test(alt) && !/Directions|Visit|Go there/i.test(alt), `${c.k}: "Closed · kept for the record", no call to visit`);
    const offNow = s.off.slice(off0), cross = reqs.filter(u => !u.startsWith(BASE));
    ok(!cross.length && !offNow.length, `${c.k}: 0 off-origin requests from the tap to the preview`, cross.slice(0, 2));
    ok(r.focus === 'share' || r.focus === 'dl', `${c.k}: the preview takes focus on its first action`, r.focus);
    await s.page.keyboard.press('Escape'); await s.page.waitForTimeout(150);
    ok(!(await s.page.$('#cleo-card-dlg')), `${c.k}: Esc closes the preview`);
    ok(!s.errs.length, `${c.k}: 0 page errors`, s.errs.slice(0, 2)); await s.ctx.close();
  }
  { const s = await open(b, 'cities/tokyo.html#p=senso-ji', { w: 390, share: true, tiles: true, settle: 1600 });
    await s.page.click('[data-cleo-card="place"]'); await s.page.waitForSelector('[data-card="share"]', { timeout: 10000 }).catch(() => {});
    await s.page.click('[data-card="share"]').catch(() => {}); await s.page.waitForTimeout(300);
    const sh = await s.page.evaluate(() => window.__shared || null);
    ok(sh && sh.n === 1 && sh.type === 'image/png' && sh.size > 20000 && /Recommended by/.test(sh.text), 'Web Share with files: one image/png, the source line in its text', sh); await s.ctx.close(); }
  { const s = await open(b, 'cities/tokyo.html#p=senso-ji', { w: 1440, tiles: true, settle: 1600 });
    await s.page.evaluate(() => { navigator.canShare = undefined; });
    await s.page.click('[data-cleo-card="place"]'); await s.page.waitForSelector('[data-card="dl"]', { timeout: 10000 }).catch(() => {});
    const [dl] = await Promise.all([s.page.waitForEvent('download', { timeout: 5000 }).catch(() => null), s.page.click('[data-card="dl"]').catch(() => {})]);
    ok(!!dl && /^cleo-.+\.png$/.test(dl.suggestedFilename()), 'without Web Share: a PNG download', dl && dl.suggestedFilename()); await s.ctx.close(); }
  for (const w of [390, 1440]) for (const dark of [false, true]) {
    const tag = `${w}-${dark ? 'dark' : 'light'}`, s = await open(b, 'cities/tokyo.html#p=senso-ji', { w, dark, tiles: true, settle: 1600 });
    await s.page.click('[data-cleo-card="place"]'); await s.page.waitForSelector('#cleo-card-dlg img', { timeout: 10000 }).catch(() => {}); await s.page.waitForTimeout(300);
    const over = await s.page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    ok(over <= 0, `${tag}: the preview fits, no sideways scroll`, over);
    await s.page.screenshot({ path: path.join(SHOTS, `card-preview-${tag}.png`) }); await s.ctx.close();
  }

  await b.close();
  console.log(fails ? `\n>>> FAIL — ${fails}` : '\n>>> PASS — FE-C W9 probe');
  process.exit(fails ? 1 : 0);
})();
