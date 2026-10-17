#!/usr/bin/env node
'use strict';
/**
 * tools/beta/w7-fe-a-probe.js — FE-A W7 regression probe (real Chromium, offline: same-origin files from disk, tiles
 * stubbed, every other off-origin request aborted). Exit 1 on any FAIL.
 *
 *   cd tools && NODE_PATH=$(npm root -g) node beta/w7-fe-a-probe.js      (npm run beta:probe:fe-a)
 *
 *  credits   no photo credit (cards, rows, hero, place detail) is ellipsised, line-clamped or cut: author + licence show
 *  nodes     a phone #p= deep link stays ≤ 3,000 DOM nodes for 3 s after load; rows resume once the sheet closes
 *  count     one visible number in the detail ("No. k of n in {area}"; no "k of N", no "pin N" — SPEC-v3 §3.6); the hidden
 *            assistive-tech position still counts the whole view order (a far #p= reads "k of 488" on Tokyo, never "k of 25")
 *  face      the card eyebrow hides its area only under a header for that area; Recommended by never ends on a dangling comma
 *  motion    a card tap grows into the sheet through one view transition; under reduced motion: none, 0 animations
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..'), BASE = 'https://cleo.local/';
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48OHDfwAJigPgXSGvvwAAAABJRU5ErkJggg==', 'base64');
let fails = 0;
const ok = (c, msg, v) => { if (!c) fails++; console.log(`  ${c ? 'PASS' : 'FAIL'}  ${msg}${v !== undefined ? ' = ' + JSON.stringify(v) : ''}`); };

async function open(b, url, o = {}) {
  const ctx = await b.newContext(Object.assign({ viewport: { width: o.w || 390, height: 844 }, isMobile: (o.w || 390) < 500, hasTouch: (o.w || 390) < 500, serviceWorkers: 'block', reducedMotion: o.rm || 'no-preference' }));
  await ctx.route('**/*', r => { const u = r.request().url();
    if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u)) return r.fulfill({ status: 200, contentType: 'image/png', body: TILE });
    if (!u.startsWith(BASE)) return r.abort('blockedbyclient');
    const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname));
    if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
    return r.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) }); });
  const page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(BASE + 'beta/' + url, { waitUntil: 'load' }); await page.waitForTimeout(o.settle || 1200);
  return { ctx, page, errs };
}
const CLIP = () => [...document.querySelectorAll('figcaption, .gc-cred, .hero-credit, .credit')].filter(e => e.getClientRects().length && getComputedStyle(e).display !== 'none')
  .map(e => { const c = getComputedStyle(e); return { t: e.textContent.trim().slice(0, 50), ell: c.textOverflow === 'ellipsis' && c.overflow !== 'visible', clamp: c.webkitLineClamp !== 'none' && c.webkitLineClamp !== '' && c.webkitLineClamp !== 'unset', cut: e.scrollHeight > e.clientHeight + 2 || (c.overflowX !== 'visible' && e.scrollWidth > e.clientWidth + 2) }; })
  .filter(x => x.ell || x.clamp || x.cut);

(async () => {
  let b; try { b = await chromium.launch(); } catch (e) { b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  console.log('# credits');
  for (const [url, w] of [['cities/tokyo.html#view=gallery', 390], ['cities/tokyo.html#view=gallery', 1440], ['cities/tokyo.html#all=1', 1440], ['cleveland.html#view=gallery', 390], ['cities/tokyo.html#view=gallery&p=kanda-myojin', 390], ['cities/tokyo.html#view=gallery&p=kanda-myojin', 1440], ['cities/tokyo.html', 1440]]) {   // D-46: Gallery explicitly; the bare URL is Atlas
    const s = await open(b, url, { w });
    await s.page.evaluate(async () => { for (let y = 0; y < 6000; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
    const n = await s.page.evaluate(() => document.querySelectorAll('figcaption, .gc-cred').length), bad = await s.page.evaluate(CLIP);
    ok(n > 0 && !bad.length, `${url} @${w}: ${n} credits, none ellipsised, clamped or cut`, bad.slice(0, 3)); await s.ctx.close();
  }
  console.log('# nodes (phone #p= deep link)');
  for (const url of ['cities/tokyo.html#view=gallery&p=kanda-myojin', 'cities/tokyo.html#view=gallery&p=isegen', 'cities/newyork.html#view=gallery&p=katzs-delicatessen']) {   // D-46: a bare #p= opens Atlas; this is the Gallery's
    const s = await open(b, url, { settle: 50 }); const seen = [];
    for (let i = 0; i < 7; i++) { seen.push(await s.page.evaluate(() => document.querySelectorAll('*').length)); await s.page.waitForTimeout(500); }
    ok(Math.max(...seen) <= 3000, `${url}: ≤ 3,000 nodes for 3 s`, seen);
    const r0 = await s.page.evaluate(() => document.querySelectorAll('.g-row').length);
    await s.page.keyboard.press('Escape'); await s.page.waitForTimeout(400);
    await s.page.waitForTimeout(800); await s.page.evaluate(() => scrollTo(0, 0)); await s.page.waitForTimeout(1500);
    const r1 = await s.page.evaluate(() => document.querySelectorAll('.g-row').length);
    ok(r1 > r0 || r1 >= 4, `${url}: Gallery rows resume after the sheet closes`, [r0, r1]);
    ok(!s.errs.length, `${url}: 0 page errors`, s.errs.slice(0, 2)); await s.ctx.close();
  }
  console.log('# sheet "n of N"');
  // SPEC-v3 §3.6 (rev 4/5), PANEL-R3 #2 (designer, 2026-10-16) supersedes the R6/W7 visible "k of 488": the detail shows ONE
  // number, "No. k of n in {area}"; the view position is kept for assistive tech only (visually hidden), still the whole view
  for (const w of [390, 1440]) { const s = await open(b, 'cities/tokyo.html#view=gallery&p=isegen', { w }); const t = await s.page.evaluate(() => { const h = document.getElementById('cleo-sheet'), p = h.querySelector('[data-sh-pos]');
      return { sr: p ? p.textContent : '', srHidden: !!p && (p.getBoundingClientRect().width <= 1 || getComputedStyle(p).clip !== 'auto'), vis: h.querySelector('.sheet').innerText.replace(p ? p.innerText : '\u0000', '') }; });   // innerText keeps clipped text: drop the assistive-only span
    ok(/^\d+ of 488\b/.test(t.sr) && t.srHidden, `@${w} Tokyo far #p=: the assistive-tech position counts the whole view (… of 488) and is not shown`, t.sr);
    ok(!/\b\d+ of 488\b/.test(t.vis) && !/\bpin \d+/i.test(t.vis) && (t.vis.match(/No\. \d+ of \d+ in /g) || []).length === 1, `@${w} one visible number: no "k of N", no "pin N", exactly one "No. k of n in {area}"`, (t.vis.match(/No\. \d+ of \d+ in [^\n]*/g) || []).concat((t.vis.match(/\b(pin \d+|\d+ of 488)/gi) || [])));
    await s.ctx.close(); }
  console.log('# card face (shared W7 card: Gallery grid, Atlas .w7-cards)');
  // the eyebrow area hides only under a header for the same area; "Recommended by" never ends on a dangling separator
  const FACE = () => { const vis = e => e && e.getClientRects().length && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden';
    const cards = [...document.querySelectorAll('li.pl')].filter(vis).slice(0, 60), bad = { areaRepeat: [], areaMissing: [], dangling: [] };
    for (const c of cards) {
      const ia = c.querySelector('.pl-e .in-a'), sec = c.closest('section.area');
      if (ia && sec && vis(ia)) bad.areaRepeat.push(c.id);
      const chips = [...c.querySelectorAll('.pl-s .src')].filter(vis), last = chips[chips.length - 1];
      const after = last ? getComputedStyle(last, '::after').content : 'none';
      const clipped = last && (() => { const p = last.closest('.pl-s').getBoundingClientRect(), r = last.getBoundingClientRect(); return r.right > p.right + 1; })();
      if (last && ((after !== 'none' && after !== 'normal' && /,/.test(after)) || clipped)) bad.dangling.push(c.id);
    }
    const gcs = [...document.querySelectorAll('li.gc')].filter(vis).slice(0, 12);
    for (const g of gcs) { const t = (g.querySelector('.pl-e') || {}).textContent || ''; if (!g.classList.contains('gc--closed') && !/·/.test(t)) bad.areaMissing.push(g.getAttribute('data-id')); }
    return { cards: cards.length, rails: gcs.length, bad }; };
  for (const [url, w] of [['cities/tokyo.html#all=1', 1440], ['cities/tokyo.html#all=1', 390], ['cities/tokyo.html#view=gallery', 1440], ['cities/tokyo.html#view=atlas', 1440], ['cleveland.html#view=atlas', 1440]]) {
    const s = await open(b, url, { w, settle: 1800 });
    await s.page.evaluate(async () => { for (let y = 0; y < 3000; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } scrollTo(0, 0); });
    const r = await s.page.evaluate(FACE);
    ok(r.cards > 0 && !r.bad.areaRepeat.length, `${url} @${w}: no card repeats its area under an area header (${r.cards} cards)`, r.bad.areaRepeat.slice(0, 3));
    ok(!r.bad.dangling.length, `${url} @${w}: "Recommended by" never ends on a dangling comma or a cut chip`, r.bad.dangling.slice(0, 3));
    if (r.rails) ok(!r.bad.areaMissing.length, `${url} @${w}: rail cards (no area header) keep their area (${r.rails})`, r.bad.areaMissing.slice(0, 3));
    await s.ctx.close();
  }
  console.log('# motion (card → sheet grow)');
  for (const rm of ['no-preference', 'reduce']) for (const w of [390, 1440]) {
    const s = await open(b, 'cities/tokyo.html#view=gallery', { w, rm });
    await s.page.evaluate(() => { window.__vt = 0; const o = document.startViewTransition; if (o) document.startViewTransition = function (f) { window.__vt++; return o.call(document, f); }; });
    await s.page.locator('.g-rows li.gc .gc-a').first().click(); await s.page.waitForTimeout(400);
    const r = await s.page.evaluate(() => ({ open: !document.getElementById('cleo-sheet').hidden, vt: window.__vt, anims: document.getAnimations().length,
      dur: getComputedStyle(document.documentElement).getPropertyValue('--dur-grow').trim() }));
    if (rm === 'reduce') ok(r.open && r.vt === 0 && r.anims === 0 && /^0(ms|s)?$/.test(r.dur), `reduced motion @${w}: sheet opens, no transition, 0 animations, --dur-grow 0`, r);
    else ok(r.open && r.vt === 1 && parseFloat(r.dur) > 0, `motion @${w}: one view transition, --dur-grow > 0`, r);
    await s.ctx.close();
  }
  await b.close();
  console.log(fails ? `\n>>> FAIL — ${fails} FE-A W7 check(s)` : '\n>>> PASS — FE-A W7: credits whole, deep link light, n of N, grow motion');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
