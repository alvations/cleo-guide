#!/usr/bin/env node
'use strict';
/**
 * tools/beta/w8-fe-a-probe.js — FE-A W8 probe: the "Your day" flow, end to end, by keyboard (real Chromium, offline:
 * same-origin files from disk, tiles stubbed, every other off-origin request aborted). Exit 1 on any FAIL.
 *
 *   cd tools && npm run beta:probe:fe-a:w8
 *
 * At 390 and 1440: save places → "Your list" → "Plan a day from these" (Enter) → the day opens with its summary
 * (stops, km) in view → Edit stops → move a stop (Enter) → remove a stop (Enter) → Share (Enter; the link is captured) →
 * Print (Enter; window.print is called, print media hides the controls and keeps the stops) → the shared link opens in a
 * fresh browser (no storage) with the same stops in the same order, the summary on the map in Atlas and in the list.
 * Every control in the flow is reached with Tab from the day's heading, not only focused by script.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..'), BASE = 'https://cleo.local/';
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48OHDfwAJigPgXSGvvwAAAABJRU5ErkJggg==', 'base64');
const SAVE = ['senso-ji', 'ueno-park', 'kappabashi-dogu-gai', 'ameya-yokocho', 'kanda-myojin'];   // 4 in Taitō-ku, 1 elsewhere
let fails = 0;
const ok = (c, msg, v) => { if (!c) fails++; console.log(`  ${c ? 'PASS' : 'FAIL'}  ${msg}${v !== undefined ? ' = ' + JSON.stringify(v) : ''}`); };

async function ctxFor(b, w, scheme) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 }, isMobile: w < 500, hasTouch: w < 500, serviceWorkers: 'block', colorScheme: scheme || 'light' });
  await ctx.route('**/*', r => { const u = r.request().url();
    if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u)) return r.fulfill({ status: 200, contentType: 'image/png', body: TILE });
    if (!u.startsWith(BASE)) return r.abort('blockedbyclient');
    const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname));
    if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
    return r.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) }); });
  await ctx.addInitScript(() => { window.__shared = []; window.__printed = 0; window.print = () => { window.__printed++; };
    Object.defineProperty(navigator, 'share', { configurable: true, value: o => { window.__shared.push(o.url); return Promise.resolve(); } }); });
  return ctx;
}
// Tab from the focused element until `sel` has focus (≤ max presses); true when reached by keyboard alone
async function tabTo(page, sel, max = 40) {
  for (let i = 0; i < max; i++) { if (await page.evaluate(s => !!document.activeElement && document.activeElement.matches(s), sel)) return true; await page.keyboard.press('Tab'); }
  return page.evaluate(s => !!document.activeElement && document.activeElement.matches(s), sel);
}
const stopsOf = page => page.evaluate(() => [...document.querySelectorAll('#cleo-lens .stop .go')].map(a => a.getAttribute('href').replace(/^#p-/, '')));
const inView = (page, sel, why) => page.evaluate(([s, why]) => { const e = document.querySelector(s); if (!e || !e.getClientRects().length) return false; const r = e.getBoundingClientRect();
  if (r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) return false;
  const h = document.elementFromPoint(r.left + Math.min(r.width / 2, 24), r.top + r.height / 2); return why ? [r.top, r.bottom, r.left, h && (h.className || h.tagName)] : !!h && (e === h || e.contains(h)); }, [sel, why]);

(async () => {
  let b; try { b = await chromium.launch(); } catch (e) { b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  for (const w of [390, 1440]) {
    console.log(`# Your day @${w}: build from saved → reorder / remove → share → print → reopen`);
    const ctx = await ctxFor(b, w), page = await ctx.newPage(), errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto(BASE + 'beta/cities/tokyo.html', { waitUntil: 'load' }); await page.waitForTimeout(900);
    await page.evaluate(ids => Cleo.saved.add(ids.map(x => 'tokyo/' + x)), SAVE);   // the same store the hearts write
    await page.evaluate(() => { location.hash = '#mine=1'; }); await page.waitForTimeout(700);
    await page.focus('#cleo-lens h2').catch(() => {}); await page.evaluate(() => { const h = document.querySelector('#cleo-lens h2'); if (h) { h.tabIndex = -1; h.focus(); } });
    ok(await tabTo(page, '[data-cleo-dayfrom]'), `@${w} "Your list" offers "Plan a day from these", reached by Tab`);
    await page.keyboard.press('Enter'); await page.waitForTimeout(900);
    let st = await stopsOf(page);
    ok(/day=TAITO/.test(await page.evaluate(() => location.hash)) && st.length === 4 && SAVE.slice(0, 4).every(x => st.includes(x)), `@${w} Enter builds a day from the 4 saved places in Taitō-ku (the 5th is elsewhere)`, st);
    ok(await page.evaluate(() => document.activeElement && document.activeElement.id === 'day-h'), `@${w} focus moves to the day's heading`);
    ok(await inView(page, '#day-h') && await inView(page, '#cleo-lens .daysum'), `@${w} the heading and the summary (stops, km) are in view, clear of the sticky bars`);
    const sum = await page.evaluate(() => document.querySelector('#cleo-lens .daysum').innerText.replace(/\s+/g, ' ').trim());
    ok(/^4 stops [\d.]+ k?m/.test(sum), `@${w} the summary reads stops and distance`, sum);
    for (const s of ['[data-dy="share"]', '[data-dy="print"]', '[data-dy="kml"]', '[data-dy="edit"]']) {
      await page.evaluate(() => document.getElementById('day-h').focus());
      ok(await tabTo(page, '#cleo-lens ' + s), `@${w} ${s} is reached by Tab from the heading`);
    }
    await page.keyboard.press('Enter'); await page.waitForTimeout(300);           // Edit stops
    const before = await stopsOf(page);
    await page.evaluate(() => document.getElementById('day-h').focus());
    ok(await tabTo(page, '#cleo-lens [data-dy="down"][data-i="0"]', 60), `@${w} "Move later" on stop 1 is reached by Tab (editing)`);
    await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    st = await stopsOf(page);
    ok(st[0] === before[1] && st[1] === before[0], `@${w} Enter moves stop 1 later`, st);
    ok(await page.evaluate(() => !!document.activeElement.closest('#cleo-lens .stop')), `@${w} focus stays on the moved stop's controls`);
    await page.evaluate(() => document.getElementById('day-h').focus());
    ok(await tabTo(page, '#cleo-lens [data-dy="rm"][data-i="3"]', 60), `@${w} "Remove" on stop 4 is reached by Tab`);
    await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    st = await stopsOf(page);
    ok(st.length === 3 && !st.includes(before[3]), `@${w} Enter removes stop 4 (3 left)`, st);
    await page.evaluate(() => document.getElementById('day-h').focus());
    await tabTo(page, '#cleo-lens [data-dy="share"]'); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    const url = (await page.evaluate(() => window.__shared))[0] || '';
    ok(/#day=TAITO&s=/.test(url) && url.split('&s=')[1] === st.join(','), `@${w} Share hands over a link carrying the edited stops, in order`, url.replace(/^.*#/, '#'));
    await page.evaluate(() => document.getElementById('day-h').focus());
    await tabTo(page, '#cleo-lens [data-dy="print"]'); await page.keyboard.press('Enter'); await page.waitForTimeout(200);
    ok(await page.evaluate(() => window.__printed) === 1, `@${w} Print (Enter) opens the print dialog`);
    await page.emulateMedia({ media: 'print' });
    const pr = await page.evaluate(() => { const v = s => [...document.querySelectorAll(s)].some(e => e.getClientRects().length && getComputedStyle(e).display !== 'none');
      return { stops: v('#cleo-lens .stop'), sum: v('#cleo-lens .daysum'), bar: v('#cleo-lens .sharebar'), pill: v('.mappill:not([hidden])') }; });
    ok(pr.stops && pr.sum && !pr.bar && !pr.pill, `@${w} print keeps the summary and stops, drops the buttons and the map pill`, pr);
    await page.emulateMedia({ media: 'screen' });
    ok(!errs.length, `@${w} 0 page errors while building`, errs.slice(0, 2)); await ctx.close();

    // the link reopens the day in a fresh browser: no storage, nothing saved
    const ctx2 = await ctxFor(b, w), p2 = await ctx2.newPage(), e2 = []; p2.on('pageerror', e => e2.push(e.message));
    await p2.goto(url.replace(/^https?:\/\/[^/]+\//, BASE), { waitUntil: 'load' }); await p2.waitForTimeout(1600);
    const view = await p2.evaluate(() => document.documentElement.getAttribute('data-view'));
    ok(JSON.stringify(await stopsOf(p2)) === JSON.stringify(st), `@${w} the shared link reopens the same day, same order (view: ${view})`, await stopsOf(p2));
    const chip = await p2.evaluate(() => { const c = document.querySelector('.day-chip'); return c ? c.textContent.replace(/\s+/g, ' ').trim() : ''; });
    ok(/3 stops · [\d.]+ k?m/.test(chip) && await inView(p2, '.day-chip'), `@${w} the day's summary sits on the map, in view and uncovered`, chip);
    ok(await p2.evaluate(() => !localStorage.getItem('cleo:v1:days')), `@${w} opening a shared day stores nothing`);
    ok(!e2.length, `@${w} 0 page errors on reopen`, e2.slice(0, 2)); await ctx2.close();
  }
  console.log('# place detail (QA-51, QA-59b/d, R7 2d, closures)');
  for (const w of [390, 1440]) {
    const ctx = await ctxFor(b, w);
    for (const [u, id] of [['cities/tokyo.html', 'kanda-myojin'], ['cities/tokyo.html', 'asukayama-park'], ['cleveland.html', 'terminal-tower-observation-deck'], ['cleveland.html', 'west-side-market'], ['cleveland.html', 'heinens-downtown'], ['cities/newyork.html', 'katzs-delicatessen']]) {
      const page = await ctx.newPage(); await page.goto(BASE + 'beta/' + u + '#p=' + id, { waitUntil: 'load' }); await page.waitForTimeout(1500);
      const r = await page.evaluate(() => { const h = document.getElementById('cleo-sheet'), sh = h.querySelector('.sheet'), im = h.querySelector('.hero-plate img');
        const fw = im ? +((/-(\d+)\.(?:jpe?g|webp)$/.exec(im.currentSrc) || [])[1] || 0) : 0;
        const over = [...h.querySelectorAll('.content *')].filter(e => e.getClientRects().length && e.getBoundingClientRect().right > sh.getBoundingClientRect().right + 1).map(e => e.className || e.tagName).slice(0, 3);
        const lone = [...h.querySelectorAll('.srclist .acts > *')].filter(e => { const rs = [...e.getClientRects()]; return rs.length > 1 && rs[rs.length - 1].width < 30; }).length;
        const pri = h.querySelector('.actions .btn-primary'), hr = h.getBoundingClientRect(), sr = sh.getBoundingClientRect();
        return { img: im ? [fw, Math.round(im.getBoundingClientRect().width)] : null, over, lone, closed: !!h.querySelector('.closed-banner'), pri: pri ? pri.textContent.trim() : '',
          scrim: getComputedStyle(h).backgroundColor, full: Math.round(hr.left) === 0 && Math.round(hr.width) === innerWidth, centred: Math.abs((sr.left + sr.right) / 2 - innerWidth / 2) < 2 }; });
      { const file = u.replace(/^cities\//, '').replace(/\.html$/, ''), j = JSON.parse(fs.readFileSync(path.join(ROOT, 'beta/data/places', file + '.json'), 'utf8'));
        const rec = j.places.find(p => p.id === id), n = j.places.filter(p => p.a === rec.a).length, t = await page.evaluate(() => (document.querySelector('#cleo-sheet .sh-rank') || {}).textContent || '');
        ok(t.startsWith(`No. ${rec.rank} of ${n} `), `@${w} ${id} (fresh #p=): the rank line is the data's ${rec.rank} of ${n} (QA-50)`, t); }
      if (r.img) ok(r.img[1] <= r.img[0], `@${w} ${id}: the detail photo is never upscaled (file ${r.img[0]} w shown at ${r.img[1]} px)`);
      ok(!r.over.length, `@${w} ${id}: nothing in the detail runs past the sheet's edge`, r.over);
      ok(!r.lone, `@${w} ${id}: no source-link icon wraps onto a line of its own`);
      if (r.closed) ok(!/Directions/.test(r.pri), `@${w} ${id}: a closed place never offers Directions as its primary action`, r.pri);
      if (w === 1440) ok(r.full && r.centred && !/rgba\(0, 0, 0, 0\)|transparent/.test(r.scrim), `@${w} ${id}: the desktop sheet is centred over a full-viewport scrim`, r);
      await page.close();
    }
    await ctx.close();
  }
  console.log('# polish (R7 gap 2a/b/c/e): credits fit their boxes, bars opaque, placeholder whole, no upscaled photo');
  for (const w of [390, 1440]) for (const scheme of ['light', 'dark']) {
    const ctx = await ctxFor(b, w, scheme);
    for (const u of ['cleveland.html', 'cities/tokyo.html', 'cities/tokyo.html#all=1', 'cities/tokyo.html#view=atlas', 'cities/tokyo.html#day=TAITO', 'Singapore/chinatown.html']) {
      const page = await ctx.newPage(); await page.goto(BASE + 'beta/' + u, { waitUntil: 'load' }); await page.waitForTimeout(1300);
      await page.evaluate(async () => { for (let y = 0; y < 3000; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } scrollTo(0, 400); });
      await page.waitForTimeout(400);
      const r = await page.evaluate(() => { const vis = e => e.getClientRects().length && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden';
        const creds = [...document.querySelectorAll('figcaption, .gc-cred, .hero-credit, .credit, [class*="cred"]')].filter(vis);
        const over = creds.filter(e => e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1).map(e => e.textContent.trim().slice(0, 40));
        const alpha = c => { const m = /\/\s*([\d.]+)\s*\)$|rgba\([^)]*,\s*([\d.]+)\)$/.exec(c); return m ? +(m[1] || m[2]) : 1; };
        const bars = [...document.querySelectorAll('.topbar, .cbar, .tabbar')].filter(vis).map(e => [e.className.split(' ')[0], alpha(getComputedStyle(e).backgroundColor)]).filter(x => x[1] < 1);
        const i = document.getElementById('cleo-filter'); let ph = null;
        if (i && vis(i) && i.clientWidth) { const c = getComputedStyle(i), cv = document.createElement('canvas').getContext('2d'); cv.font = c.fontWeight + ' ' + c.fontSize + ' ' + c.fontFamily;
          ph = cv.measureText(i.placeholder).width <= i.clientWidth - parseFloat(c.paddingLeft) - parseFloat(c.paddingRight) + 0.5 ? null : i.placeholder; }
        const up = [...document.querySelectorAll('main img[srcset], #cleo-sheet img[srcset]')].filter(e => vis(e) && e.complete && e.currentSrc).map(e => {
          const fw = +((/-(\d+)\.(?:jpe?g|webp|png)$/.exec(e.currentSrc) || [])[1] || 0); return [e.currentSrc.split('/').pop(), fw, Math.round(e.getBoundingClientRect().width)]; })
          .filter(x => x[1] && x[2] > x[1] + 1);
        return { n: creds.length, over, bars, ph, up }; });
      // R7 2(g): the dek and the masthead stat line never end on a single word or token (scrolled to the top)
      const widows = await page.evaluate(() => { scrollTo(0, 0); const out = [];
        for (const el of document.querySelectorAll('main > .masthead :is(.g-lead, .dek, .facts)')) {
          if (!el.getClientRects().length || getComputedStyle(el).display === 'none') continue;
          const words = [], tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          for (let n; (n = tw.nextNode());) for (const m of n.textContent.matchAll(/\S+/g)) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const b = r.getClientRects()[0]; if (b) words.push([Math.round(b.top), m[0]]); }
          const lines = [...new Set(words.map(x => x[0]))]; if (lines.length < 2) continue;
          const last = words.filter(x => x[0] === lines[lines.length - 1]).map(x => x[1]).filter(t => !/^[·•|—-]$/.test(t));
          if (last.length < 2) out.push(el.className + ': "' + last.join(' ') + '"');
        } return out; });
      const tag = `@${w} ${scheme} ${u}`;
      ok(!r.over.length, `${tag}: ${r.n} credits, none overflow their box`, r.over.slice(0, 3));
      ok(!r.bars.length, `${tag}: top bar / city bar / tab bar fully opaque`, r.bars);
      ok(!r.ph, `${tag}: the search placeholder fits unclipped`, r.ph);
      ok(!r.up.length, `${tag}: no photo shown wider than its file`, r.up.slice(0, 3));
      if (!/view=atlas|day=/.test(u)) ok(!widows.length, `${tag}: no single-word last line in the dek or the stat line`, widows);
      await page.close();
    }
    await ctx.close();
  }
  console.log('# delight (R7 gap 3): photos fade in from their dominant colour; view switch slides and cross-fades');
  for (const rm of ['no-preference', 'reduce']) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', reducedMotion: rm });
    await ctx.route('**/*', r => { const u = r.request().url();
      if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u)) return r.fulfill({ status: 200, contentType: 'image/png', body: TILE });
      if (!u.startsWith(BASE)) return r.abort('blockedbyclient');
      const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname));
      if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
      return r.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) }); });
    const page = await ctx.newPage(); await page.goto(BASE + 'beta/cities/tokyo.html', { waitUntil: 'load' }); await page.waitForTimeout(1500);
    const ph = await page.evaluate(() => { const f = document.querySelector('main figure.photo[style*="--ph"]'); if (!f) return null; const b = getComputedStyle(f, '::before');
      return { ph: f.style.getPropertyValue('--ph'), bg: b.backgroundColor, dur: parseFloat(b.transitionDuration) * 1000, inn: f.classList.contains('in'), op: b.opacity, fade: document.documentElement.classList.contains('ph-fade') }; });
    const hex = c => '#' + (c.match(/\d+/g) || []).slice(0, 3).map(x => (+x).toString(16).padStart(2, '0')).join('');
    if (rm === 'no-preference') {
      ok(ph && ph.fade && hex(ph.bg) === ph.ph.toLowerCase() && ph.dur > 0 && ph.dur <= 300, 'a photo\'s placeholder is its dominant colour, fading ≤ 300 ms', ph);
      ok(ph && ph.inn && +ph.op === 0, 'once the image has loaded the placeholder is gone', ph && [ph.inn, ph.op]);
    } else ok(ph && ph.dur === 0, 'reduced motion: the placeholder clears with no transition', ph && ph.dur);
    const ind = () => page.evaluate(() => { const i = document.querySelector('nav.views .v-ind'), b = document.querySelector('nav.views button[aria-pressed="true"]');
      return i && b ? { left: Math.round(i.getBoundingClientRect().left), on: Math.round(b.getBoundingClientRect().left), w: Math.round(i.getBoundingClientRect().width), bw: Math.round(b.getBoundingClientRect().width), dur: parseFloat(getComputedStyle(i).transitionDuration) * 1000 } : null; });
    const i0 = await ind();
    await page.evaluate(() => { window.__an = []; const t0 = performance.now(); const tick = () => { document.getAnimations().forEach(a => { const e = a.effect && a.effect.target; if (e && e.parentElement && e.parentElement.id === 'main') window.__an.push(Math.round(a.effect.getComputedTiming().duration)); }); if (performance.now() - t0 < 350) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    await page.click('nav.views button[data-view="guidebook"]'); await page.waitForTimeout(500);
    const i1 = await ind(), an = await page.evaluate(() => window.__an);
    ok(i0 && i1 && i1.left !== i0.left && Math.abs(i1.left - i1.on) <= 1 && Math.abs(i1.w - i1.bw) <= 1, `${rm}: the switcher's selection moves onto the new view`, [i0, i1]);
    if (rm === 'no-preference') ok(i1.dur > 0 && i1.dur <= 300 && an.length > 0 && Math.max(...an) <= 300, 'the selection slides and the content cross-fades, each ≤ 300 ms', [i1.dur, [...new Set(an)]]);
    else ok(i1.dur === 0 && an.length === 0, 'reduced motion: no slide, no cross-fade', [i1.dur, an.length]);
    await ctx.close();
  }
  { const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false, serviceWorkers: 'block' });
    await ctx.route('**/*', r => { const u = r.request().url(); if (!u.startsWith(BASE)) return r.abort('blockedbyclient');
      const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
      return r.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) }); });
    const page = await ctx.newPage(); await page.goto(BASE + 'beta/cities/tokyo.html', { waitUntil: 'load' }); await page.waitForTimeout(600);
    const c = await page.evaluate(() => { const f = document.querySelector('main figure.photo[style*="--ph"]'); return f ? getComputedStyle(f, '::before').content : 'no photo'; });
    ok(c === 'none' || c === 'normal', 'without JS no placeholder ever covers a photo', c); await ctx.close(); }
  console.log('# QC-07: Esc returns focus to the control that opened the sheet');
  for (const w of [390, 1440]) {
    const ctx = await ctxFor(b, w), page = await ctx.newPage(); await page.goto(BASE + 'beta/cities/tokyo.html', { waitUntil: 'load' }); await page.waitForTimeout(1500);
    for (const sel of ['.g-rows li.gc .gc-a', '#cleo-lead li.gc .gc-a', 'li.pl:not(.pg-off) .pl-n a']) {
      const tag = await page.evaluate(s => { const e = [...document.querySelectorAll(s)].find(x => x.getClientRects().length); if (!e) return null; e.scrollIntoView({ block: 'center' }); e.setAttribute('data-qc07', '1'); e.focus(); return e.getAttribute('href'); }, sel);
      if (!tag) { console.log(`  (skip @${w} ${sel}: none visible)`); continue; }
      await page.keyboard.press('Enter'); await page.waitForTimeout(700);
      const open = await page.evaluate(() => !document.getElementById('cleo-sheet').hidden);
      await page.keyboard.press('Escape'); await page.waitForTimeout(500);
      const back = await page.evaluate(() => { const a = document.activeElement; return { same: !!a && a.getAttribute('data-qc07') === '1', got: a ? (a.className || a.tagName) + ' ' + (a.getAttribute('href') || '') : null }; });
      await page.evaluate(() => document.querySelectorAll('[data-qc07]').forEach(e => e.removeAttribute('data-qc07')));
      ok(open && back.same, `@${w} ${sel} ${tag}: Enter opens the sheet, Esc returns focus to that same control`, back.got);
    }
    await ctx.close();
  }
  await b.close();
  console.log(fails ? `\n>>> FAIL — ${fails} FE-A W8 check(s)` : '\n>>> PASS — FE-A W8: a day from saved places, edited, shared, printed and reopened, by keyboard');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
