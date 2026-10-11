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
 *  count     the sheet's "n of N" counts the whole view order (a far #p= reads "k of 488" on Tokyo, never "k of 25")
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
  for (const [url, w] of [['cities/tokyo.html', 390], ['cities/tokyo.html', 1440], ['cities/tokyo.html#all=1', 1440], ['cleveland.html', 390], ['cities/tokyo.html#p=kanda-myojin', 390], ['cities/tokyo.html#p=kanda-myojin', 1440]]) {
    const s = await open(b, url, { w });
    await s.page.evaluate(async () => { for (let y = 0; y < 6000; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
    const n = await s.page.evaluate(() => document.querySelectorAll('figcaption, .gc-cred').length), bad = await s.page.evaluate(CLIP);
    ok(n > 0 && !bad.length, `${url} @${w}: ${n} credits, none ellipsised, clamped or cut`, bad.slice(0, 3)); await s.ctx.close();
  }
  console.log('# nodes (phone #p= deep link)');
  for (const url of ['cities/tokyo.html#p=kanda-myojin', 'cities/tokyo.html#p=isegen', 'cities/newyork.html#p=katzs-delicatessen']) {
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
  { const s = await open(b, 'cities/tokyo.html#p=isegen'); const t = await s.page.evaluate(() => (document.querySelector('#cleo-sheet [data-sh-pos]') || {}).textContent || '');
    ok(/^\d+ of 488\b/.test(t), 'Tokyo far #p=: the count is the whole view (… of 488)', t); await s.ctx.close(); }
  console.log('# motion (card → sheet grow)');
  for (const rm of ['no-preference', 'reduce']) for (const w of [390, 1440]) {
    const s = await open(b, 'cities/tokyo.html', { w, rm });
    await s.page.evaluate(() => { window.__vt = 0; const o = document.startViewTransition; if (o) document.startViewTransition = function (f) { window.__vt++; return o.call(document, f); }; });
    await s.page.locator('.g-rows li.gc .gc-a').first().click(); await s.page.waitForTimeout(80);
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
