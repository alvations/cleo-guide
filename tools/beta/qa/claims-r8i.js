#!/usr/bin/env node
/**
 * QA verify (interim re-sign, 2026-10-17): the claims sent for the interim pin, each measured in real Chromium on the
 * built beta/ of the checkout this file sits in. Tiles are stubbed with a valid 1 × 1 PNG; no third-party request.
 *   lead   FE-A adeabcd63  D-46 desktop lead card: one li.pl-lead spanning the grid at 3:2 on a cold desktop Atlas load
 *                          (Tokyo: Edo-Tokyo Museum); none when map priority #1 has no photo (Chicago); back to a normal
 *                          card under a lens, sort, Your day or Near me (html.cleo-lensed); load CLS 0
 *   np     FE-A d6bb8367a  §v2.7b no-photo cards: row A ≤ 599 (64 px tile, why line ≤ 2 lines), quote card B ≥ 600,
 *                          the lead only with a photo (static, every page), no bare-URL why line (State College)
 *   fec    FE-C f21d3bd97  the Insights segment uses the chart glyph (Filters keeps sliders); phone Atlas list mode has
 *                          the floating Map pill and no 72 px band (the list pane runs to the bottom edge)
 *   qa82   FE-A 975e2bfe4  844 × 390: segments 44 × 44 and topmost at their centre; a segment's name shows on keyboard
 *                          focus and on hover; the landscape Atlas "last checked" link is hidden and never takes focus;
 *                          the Gallery rail scrolls away and "Keep Tokyo offline" hit-tests clean (light and dark)
 * (FE-B db9f8a746, the moved-page prune and --check STALE, is a shell step: see the evidence README.)
 * Usage: node tools/beta/qa/claims-r8i.js [--only lead,np,fec,qa82]   (exit 1 on any FAIL)
 */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..'), BETA = path.join(ROOT, 'beta');
const oi = process.argv.indexOf('--only'), only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7) || (oi > 1 ? process.argv[oi + 1] || '' : '');
const want = k => !only || only.split(',').includes(k);
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png' };
let pass = 0, fail = 0;
const check = (name, ok, info) => { ok ? pass++ : fail++; console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${info === undefined ? '' : ' = ' + JSON.stringify(info)}`); };

const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) {}
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
const VP = { phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  desktop: { viewport: { width: 1440, height: 900 } }, land: { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
let O, B;
async function open(rel, vp, { hash = '', scheme = 'light', geo, settle = 1800 } = {}) {
  const ctx = await B.newContext({ ...VP[vp], colorScheme: scheme, reducedMotion: 'reduce', ...(geo ? { geolocation: geo, permissions: ['geolocation'] } : {}) });
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.addInitScript(() => { window.__cls = 0; try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (e) {} });
  await page.route('**/*', r => { const u = r.request().url(); if (u.startsWith(O)) return r.continue(); return r.request().resourceType() === 'image' ? r.fulfill({ status: 200, contentType: 'image/png', body: PNG }) : r.abort(); });
  await page.goto(O + '/beta/' + rel + hash); await page.waitForTimeout(settle);
  return { ctx, page, errors };
}

async function lead() {
  console.log('\n# FE-A adeabcd63 — D-46 desktop lead card');
  const leadState = page => page.evaluate(() => { const L = [...document.querySelectorAll('li.pl.pl-lead')], g = document.querySelector('#cleo-grid');
    // the ratio is the photo the reader sees (the img), not its figure (which also holds the credit line)
    const l = L[0], c = l && (l.querySelector(':scope>figure.pl-photo img') || l.querySelector(':scope>.pl-cover')), lr = l && l.getBoundingClientRect(), gs = g && getComputedStyle(g), cr = c && c.getBoundingClientRect();
    const gw = g ? g.clientWidth - parseFloat(gs.paddingLeft) - parseFloat(gs.paddingRight) : 0;   // the grid's content box
    return { n: L.length, id: l && l.id, np: !!(l && l.classList.contains('pl--np')), span: l ? getComputedStyle(l).gridColumnStart + '/' + getComputedStyle(l).gridColumnEnd : null,
      wFrac: lr && gw ? +(lr.width / gw).toFixed(2) : null, ratio: cr && cr.height ? +(cr.width / cr.height).toFixed(2) : null,
      lensed: document.documentElement.classList.contains('cleo-lensed'), view: document.documentElement.getAttribute('data-view'), cls: +window.__cls.toFixed(4) }; });
  // cold load: one lead, the full row, 3:2, CLS 0
  let { ctx, page, errors } = await open('cities/tokyo.html', 'desktop', { settle: 2500 });
  let s = await leadState(page);
  check('Tokyo desktop cold load opens in Atlas', s.view === 'atlas', s.view);
  check('Tokyo: exactly one li.pl-lead, Edo-Tokyo Museum, with a photo', s.n === 1 && s.id === 'p-edo-tokyo-museum' && !s.np, { n: s.n, id: s.id, np: s.np });
  check('Tokyo: the lead spans the grid (1/-1) at 3:2', s.span === '1/-1' && s.wFrac >= 0.98 && Math.abs(s.ratio - 1.5) <= 0.03, { span: s.span, wFrac: s.wFrac, ratio: s.ratio });
  check('Tokyo desktop: load CLS 0 (≤ 0.001)', s.cls <= 0.001, s.cls);
  check('Tokyo desktop: 0 JS errors', !errors.length, errors.slice(0, 2)); await ctx.close();
  // a lens, a sort, Your day, Near me: the card goes back to normal size
  for (const [tag, how] of [['lens #t=1', { hash: '#view=atlas&t=1' }], ['sort #sort=az', { hash: '#view=atlas&sort=az' }], ['Your day (door)', { door: '[data-cleo-day]' }], ['Near me (door)', { door: '[data-cleo-near]', geo: { latitude: 35.6812, longitude: 139.7671 } }]]) {
    ({ ctx, page, errors } = await open('cities/tokyo.html', 'desktop', { hash: how.hash || '', geo: how.geo, settle: 2500 }));
    if (how.door) { const d = page.locator('.ms-doors ' + how.door).first(); if (await d.isVisible().catch(() => false)) { await d.click(); await page.waitForTimeout(1500); } }
    s = await leadState(page);
    check(`Tokyo desktop ${tag}: html.cleo-lensed and the lead is a normal card`, s.lensed && (s.n === 0 || (s.wFrac !== null && s.wFrac < 0.6)), { lensed: s.lensed, n: s.n, wFrac: s.wFrac, span: s.span });
    check(`Tokyo desktop ${tag}: 0 JS errors`, !errors.length, errors.slice(0, 2)); await ctx.close();
  }
  // map priority #1 without a photo: no lead (Chicago, whose first Atlas card is photo-less)
  ({ ctx, page, errors } = await open('cities/chicago.html', 'desktop', { settle: 2500 }));
  const ch = await page.evaluate(() => { const f = [...document.querySelectorAll('#cleo-grid li.pl')].find(e => e.offsetParent); return { lead: document.querySelectorAll('li.pl-lead').length, first: f && f.id, firstNp: !!(f && f.classList.contains('pl--np')), cls: +window.__cls.toFixed(4) }; });
  check('Chicago desktop (first Atlas card photo-less): no li.pl-lead', ch.lead === 0 && ch.firstNp, ch);
  check('Chicago desktop: load CLS 0 (≤ 0.001)', ch.cls <= 0.001, ch.cls); await ctx.close();
}

async function np() {
  console.log('\n# FE-A d6bb8367a — §v2.7b no-photo cards');
  // static: every page has ≤ 1 lead and the lead always has a photo; no why line is a bare URL (State College legacy w)
  const pages = [];
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => { const p = path.join(d, e.name); if (e.isDirectory()) { if (!['assets', 'data', 'changes'].includes(e.name)) walk(p); } else if (e.name.endsWith('.html')) pages.push(p); });
  walk(BETA);
  const badLead = [], bareUrl = []; let leads = 0;
  for (const p of pages) { const h = fs.readFileSync(p, 'utf8'), L = h.match(/<li class="pl [^"]*pl-lead[^"]*"/g) || []; leads += L.length;
    if (L.length > 1 || L.some(x => /pl--np/.test(x))) badLead.push(path.relative(BETA, p) + ' ' + L.join(' '));
    for (const m of h.matchAll(/class="pl-w"[^>]*>\s*([^<]{0,80})/g)) if (/^\s*(https?:\/\/|www\.)\S+\s*$/.test(m[1])) bareUrl.push(path.relative(BETA, p) + ': ' + m[1].trim()); }
  check(`every page: ≤ 1 lead card and never a photo-less one (${leads} leads on ${pages.length} pages)`, !badLead.length && leads > 0, badLead.slice(0, 5));
  check('no why line is a bare URL (State College guard), every page', !bareUrl.length, bareUrl.slice(0, 5));
  const rowA = page => page.evaluate(() => { const L = [...document.querySelectorAll('li.pl.pl--np')].filter(e => e.offsetParent && e.querySelector(':scope>.pl-w')).slice(0, 8);
    return L.map(e => { const cs = getComputedStyle(e), w = e.querySelector(':scope>.pl-w'), wc = getComputedStyle(w), lh = parseFloat(wc.lineHeight) || 20;
      return { id: e.id, disp: cs.display, col1: cs.gridTemplateColumns.split(' ')[0], whyLines: +((w.getBoundingClientRect().height - parseFloat(wc.paddingTop) - parseFloat(wc.paddingBottom)) / lh).toFixed(1), clamp: wc.webkitLineClamp }; }); });
  const cardB = page => page.evaluate(() => { const L = [...document.querySelectorAll('li.pl.pl--np')].filter(e => e.offsetParent && e.querySelector(':scope>.pl-w')).slice(0, 8);
    return L.map(e => { const w = e.querySelector(':scope>.pl-w'), wc = getComputedStyle(w), lh = parseFloat(wc.lineHeight) || 24, q = getComputedStyle(w, '::before').content;
      return { id: e.id, pos: wc.position, quote: q, lines: +((w.getBoundingClientRect().height - parseFloat(wc.paddingTop) - parseFloat(wc.paddingBottom)) / lh).toFixed(1)   /* the quote glyph sits in the top padding */, clamp: wc.webkitLineClamp }; }); });
  for (const rel of ['cities/tokyo.html', 'cities/washingtondc.html', 'cities/statecollege.html']) {
    // A ≤ 599: the Gallery list and the phone Atlas list
    for (const [tag, hash, list] of [['phone Gallery', '#view=gallery', false], ['phone Atlas list', '', true]]) {
      const { ctx, page, errors } = await open(rel, 'phone', { hash });
      if (list) { await page.locator('.ms-toggle').first().click().catch(() => {}); await page.waitForTimeout(800); }
      const r = await rowA(page);
      check(`${rel} ${tag}: row A — grid, 64 px tile, why ≤ 2 lines (${r.length} sampled)`, r.length > 0 && r.every(x => x.disp === 'grid' && x.col1 === '64px' && x.whyLines <= 2.2), r.slice(0, 3));
      check(`${rel} ${tag}: 0 JS errors`, !errors.length, errors.slice(0, 2)); await ctx.close();
    }
    // B ≥ 600: the Gallery grid and the desktop Atlas
    for (const [tag, hash] of [['desktop Gallery', '#view=gallery'], ['desktop Atlas', '']]) {
      const { ctx, page, errors } = await open(rel, 'desktop', { hash });
      const r = await cardB(page);
      check(`${rel} ${tag}: card B — the why line is the cover quote (“), ≤ 4 lines (${r.length} sampled)`, r.length > 0 && r.every(x => x.pos === 'absolute' && /“|201C/.test(x.quote) && x.lines <= 4.2), r.slice(0, 3));
      check(`${rel} ${tag}: 0 JS errors`, !errors.length, errors.slice(0, 2)); await ctx.close();
    }
  }
}

async function fec() {
  console.log('\n# FE-C f21d3bd97 — Insights glyph; phone Atlas list Map pill, no 72 px band');
  const h = fs.readFileSync(path.join(BETA, 'cities/tokyo.html'), 'utf8');
  const seg = (h.match(/data-cleo-views[\s\S]*?<\/nav>|data-cleo-views[\s\S]{0,2500}/) || [''])[0];
  const ins = /i-chart[\s\S]{0,200}?"l">Insights/.test(seg), sl = /i-sliders/.test(h) && /<symbol[^>]+id="i-chart"/.test(h);
  check('Tokyo: the Insights segment uses the chart glyph; the chart symbol is in the sprite and Filters keeps sliders', ins && sl, { ins, sprite: sl });
  for (const scheme of ['light', 'dark']) {
    const { ctx, page, errors } = await open('cities/tokyo.html', 'phone', { scheme });
    await page.locator('.ms-toggle').first().click().catch(() => {}); await page.waitForTimeout(900);
    const r = await page.evaluate(() => { const sp = document.querySelector('main[data-city] .split'), a = sp && getComputedStyle(sp, '::after');
      const pill = [...document.querySelectorAll('.ms-toggle')].find(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden'), pr = pill && pill.getBoundingClientRect(), pcs = pill && getComputedStyle(pill);
      return { list: document.documentElement.classList.contains('ms-list'), after: a ? { content: a.content, h: a.height, bt: a.borderTopWidth, disp: a.display } : null,
        pill: pr ? { top: Math.round(pr.top), h: Math.round(pr.height), w: Math.round(pr.width), pos: pcs.position } : null, vh: innerHeight }; });
    const band = r.after && r.after.content !== 'none' && r.after.disp !== 'none' && parseFloat(r.after.h) >= 1;
    check(`Tokyo phone Atlas list (${scheme}): list mode, a floating Map pill, no 72 px ::after band`, r.list && r.pill && r.pill.pos === 'fixed' && !band, r);
    // the last card scrolls clear of the pill
    const end = await page.evaluate(async () => { const g = document.querySelector('#cleo-grid'); let sc = g;   // the list pane (#cleo-grid) is itself the scroller
      while (sc && sc !== document.body && !/(auto|scroll)/.test(getComputedStyle(sc).overflowY)) sc = sc.parentElement;
      const el = sc && sc !== document.body ? sc : document.scrollingElement; el.scrollTo({ top: el.scrollHeight, behavior: 'instant' }); await new Promise(r => setTimeout(r, 800));   // instant: the page scrolls smoothly
      const vis = [...el.querySelectorAll(':scope>*, li.pl')].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden').map(e => e.getBoundingClientRect().bottom);   // the pane's last content (cards, pager, notes)
      const tail = [...el.children].filter(e => e.getClientRects().length).slice(-2).map(e => e.tagName + '.' + String(e.className).slice(0, 24) + ' ' + Math.round(e.getBoundingClientRect().bottom));
      const pill = [...document.querySelectorAll('.ms-toggle')].find(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden');
      return { scroller: String(el.className || el.tagName).slice(0, 30), lastBottom: vis.length ? Math.round(Math.max(...vis)) : null, tail, pillTop: pill ? Math.round(pill.getBoundingClientRect().top) : null, vh: innerHeight }; });
    check(`Tokyo phone Atlas list (${scheme}): scrolled to the end, the list's last content clears the pill`, end.pillTop !== null && end.lastBottom !== null && end.lastBottom <= end.pillTop, end);
    check(`Tokyo phone Atlas list (${scheme}): 0 JS errors`, !errors.length, errors.slice(0, 2)); await ctx.close();
  }
}

async function qa82() {
  console.log('\n# FE-A 975e2bfe4 — QA-82 at 844 × 390');
  for (const scheme of ['light', 'dark']) {
    let { ctx, page, errors } = await open('cities/tokyo.html', 'land', { hash: '#view=atlas', scheme });
    const segs = await page.evaluate(() => [...document.querySelectorAll('[data-cleo-views] button')].map(e => { const r = e.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { l: (e.querySelector('.l') || e).textContent.trim(), w: Math.round(r.width), h: Math.round(r.height), top: !!(t && e.contains(t)) }; }));
    check(`Tokyo 844×390 Atlas (${scheme}): 4 segments, each 44 × 44 and topmost at its centre`, segs.length === 4 && segs.every(s => s.w >= 44 && s.h >= 44 && s.top), segs);
    // keyboard focus: Tab until a segment is focused; its name shows under it, inside the viewport; the hidden link never takes focus
    let named = null, hiddenFocused = false;
    for (let i = 0; i < 80 && !named; i++) { await page.keyboard.press('Tab');
      const f = await page.evaluate(() => { const a = document.activeElement; if (a && a.matches('[data-cleo-changes]')) return { hidden: true };
        if (!a || !a.closest('[data-cleo-views]')) return null; const l = a.querySelector('.l'), r = l && l.getBoundingClientRect(), cs = l && getComputedStyle(l);
        return { name: l && l.textContent.trim(), w: r && Math.round(r.width), h: r && Math.round(r.height), top: r && Math.round(r.top), right: r && Math.round(r.right), clip: cs && cs.clip, vis: cs && cs.visibility }; });
      if (f && f.hidden) hiddenFocused = true; else if (f) named = f; }
    check(`Tokyo 844×390 Atlas (${scheme}): a keyboard-focused segment shows its name as a tooltip (visible, in the viewport)`, named && named.w > 8 && named.h > 8 && named.vis !== 'hidden' && named.right <= 844 && named.top >= 0 && named.top < 390, named);
    await page.mouse.move(0, 0); await page.keyboard.press('Escape').catch(() => {});
    const seg = page.locator('[data-cleo-views] button').nth(2); await seg.hover(); await page.waitForTimeout(200);
    const hov = await seg.evaluate(e => { const l = e.querySelector('.l'), r = l.getBoundingClientRect(); return { name: l.textContent.trim(), w: Math.round(r.width), h: Math.round(r.height) }; });
    check(`Tokyo 844×390 Atlas (${scheme}): a hovered segment shows its name`, hov.w > 8 && hov.h > 8, hov);
    const lc = await page.evaluate(() => { const a = document.querySelector('.masthead .facts a[data-cleo-changes]'); return a ? { vis: getComputedStyle(a).visibility } : null; });
    // walk the whole tab order once more from the top: the hidden link must never be the active element
    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    for (let i = 0; i < 120 && !hiddenFocused; i++) { await page.keyboard.press('Tab'); hiddenFocused = await page.evaluate(() => !!(document.activeElement && document.activeElement.matches('[data-cleo-changes]'))); }
    check(`Tokyo 844×390 Atlas (${scheme}): the "last checked" link is hidden and never takes focus (120 Tabs)`, lc && lc.vis === 'hidden' && !hiddenFocused, { lc, hiddenFocused });
    check(`Tokyo 844×390 Atlas (${scheme}): 0 JS errors`, !errors.length, errors.slice(0, 2)); await ctx.close();
    // Gallery: the rail scrolls away; "Keep Tokyo offline" hit-tests clean
    ({ ctx, page, errors } = await open('cities/tokyo.html', 'land', { hash: '#view=gallery', scheme }));
    const g = await page.evaluate(async () => { const rail = document.querySelector('main[data-city]>nav.rail#cleo-rail'), k = document.querySelector('[data-pack="keep"]');
      if (!k) return { keep: false }; k.scrollIntoView({ block: 'center' }); await new Promise(r => setTimeout(r, 400));
      const r = k.getBoundingClientRect(), pts = [[0.5, 0.5], [0.15, 0.5], [0.85, 0.5]].map(([x, y]) => { const t = document.elementFromPoint(r.left + r.width * x, r.top + r.height * y); return !!(t && k.contains(t)); });
      const rr = rail && rail.getBoundingClientRect();
      return { keep: true, railPos: rail && getComputedStyle(rail).position, railTop: rr && Math.round(rr.top), railBottom: rr && Math.round(rr.bottom), keepTop: Math.round(r.top), hits: pts }; });
    check(`Tokyo 844×390 Gallery (${scheme}): the rail is not sticky and "Keep Tokyo offline" hit-tests clean at 3 points`, g.keep && !/sticky|fixed/.test(g.railPos || '') && g.hits.every(Boolean), g);
    check(`Tokyo 844×390 Gallery (${scheme}): 0 JS errors`, !errors.length, errors.slice(0, 2)); await ctx.close();
  }
}

srv.listen(0, async () => {
  O = 'http://127.0.0.1:' + srv.address().port; B = await chromium.launch();
  try { for (const [k, f] of [['lead', lead], ['np', np], ['fec', fec], ['qa82', qa82]]) if (want(k)) await f(); }
  catch (e) { fail++; console.log('  FAIL  probe error: ' + (e && e.stack || e)); }
  await B.close(); srv.close();
  console.log(`\n>>> ${pass}/${pass + fail} PASS, ${fail} FAIL`); process.exit(fail || !pass ? 1 : 0);
});
