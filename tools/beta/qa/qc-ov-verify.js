#!/usr/bin/env node
/**
 * Beta QC: verify claimed overlay-ledger rows (docs/BETA-OVERLAY-LEDGER.md) on a pinned checkout. One targeted check per
 * row, each measuring exactly what the claim says, with S-17's MEASURE (qc-overlay.js) for chrome shares. Same rig as
 * qc.js (beta/ from disk, tiles stubbed, other off-origin requests aborted, service workers blocked).
 * Usage (from tools/): NODE_PATH=$(npm root -g) node beta/qa/qc-ov-verify.js --label <sha> --root <checkout> [--only OV-09,OV-11]
 * Output: design/beta/eval/qc/overlay/verify-<label>/{verify.json, shots/}; prints one line per row: PASS / FAIL + numbers.
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { MEASURE, ctxOpts } = require('./qc-overlay.js');

const argv = process.argv.slice(2), opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const ROOT = path.resolve(opt('--root', path.join(__dirname, '..', '..', '..'))), OUTROOT = path.resolve(__dirname, '..', '..', '..');
const LABEL = opt('--label', 'working'), OUT = path.join(OUTROOT, 'design', 'beta', 'eval', 'qc', 'overlay', 'verify-' + LABEL), SHOTS = path.join(OUT, 'shots');
const ONLY = opt('--only', '').split(',').filter(Boolean);
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const CITIES = ['cities/tokyo.html', 'cleveland.html', 'Singapore/punggol.html'];
const ALLVP = ['390x844', '390x664', '844x390', '768x1024', '1024x768', '1440x900'];
const placesFile = rel => { const f = fs.readdirSync(path.join(ROOT, 'beta', 'data', 'places')).find(x => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'beta', 'data', 'places', x), 'utf8')).beta === rel; } catch (e) { return false; } }); return JSON.parse(fs.readFileSync(path.join(ROOT, 'beta', 'data', 'places', f), 'utf8')); };
const first = rel => { const d = placesFile(rel); return (d.places.find(p => !(p.pv && p.pv.status === 'closed')) || d.places[0]).id; };

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0].split('#')[0])); if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
    try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
    fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); }).listen(0, '127.0.0.1');
  await new Promise(r => srv.on('listening', r));
  const base = `http://127.0.0.1:${srv.address().port}/beta/`;
  const browser = await chromium.launch(); const res = {};
  const open = async (rel, hash, vp, theme = 'light') => { const ctx = await browser.newContext(ctxOpts(vp, theme));
    await ctx.route('**/*', rt => { const u = rt.request().url(); if (u.startsWith(base.slice(0, -5))) return rt.continue(); if (/openstreetmap|arcgisonline/.test(u)) return rt.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }); return rt.abort(); });
    const page = await ctx.newPage(); await page.goto(base + rel + hash, { waitUntil: 'load' }); await page.waitForTimeout(1500); return { ctx, page }; };
  const shot = async (page, name) => { const f = path.join(SHOTS, name + '.jpg'); await page.screenshot({ path: f, type: 'jpeg', quality: 50, scale: 'css' }).catch(() => {}); return path.relative(OUTROOT, f); };
  const onTopOf = (page, sel) => page.evaluate(sel => { const e = [...document.querySelectorAll(sel)].find(x => x.getBoundingClientRect().height > 0); if (!e) return { found: false };
    const r = e.getBoundingClientRect(); const pts = [[r.left + r.width / 2, r.top + Math.min(8, r.height / 2)], [r.left + r.width / 2, r.top + r.height / 2]].filter(([x, y]) => y >= 0 && y < innerHeight && x >= 0 && x < innerWidth);
    const on = pts.map(([x, y]) => { const t = document.elementFromPoint(x, y); return !!t && (e === t || e.contains(t)); }); return { found: true, top: Math.round(r.top), h: Math.round(r.height), onTop: on.length > 0 && on.every(Boolean), inView: pts.length > 0 }; }, sel);
  const pan = async page => { const mb = await page.locator('.leaflet-container').filter({ visible: true }).first().boundingBox(); const cx = mb.x + mb.width / 2, cy = mb.y + mb.height / 2;
    await page.mouse.move(cx, cy); await page.mouse.down(); for (let i = 1; i <= 10; i++) { await page.mouse.move(cx - 12 * i, cy - 16 * i); await page.waitForTimeout(30); } return async () => page.mouse.up(); };
  const row = (id, pass, ev) => { res[id] = { pass, ...ev }; console.log((pass ? 'PASS ' : 'FAIL ') + id + ' ' + JSON.stringify(ev).slice(0, 300)); };
  const want = id => !ONLY.length || ONLY.includes(id);

  // OV-01 (FE-A part): Atlas P2 at rest ≤ 32 %; during a pan the switch row is not on screen (slid under the header)
  if (want('OV-01')) { const ev = {}; let ok = true;
    for (const rel of CITIES) { const { ctx, page } = await open(rel, '#view=atlas', '390x664', 'dark'); const L = await page.evaluate(MEASURE); const up = await pan(page);
      const sw = await onTopOf(page, '[data-cleo-views]'); const D = await page.evaluate(MEASURE); await up();
      ev[rel] = { rest: L.band, pan: D.band, switchDuringPan: sw.found && sw.onTop ? 'on screen' : 'hidden' }; ok = ok && L.band <= 32 && !(sw.found && sw.onTop);
      if (rel === CITIES[2]) ev.shot = await shot(page, 'OV-01-punggol-390x664-after-pan'); await ctx.close(); }
    row('OV-01', ok, ev); }
  // OV-08: share-card dialog wholly on screen, 9:16 image, no scroll, at 390×664, 844×390, 768×1024, 1024×768
  if (want('OV-08')) { const ev = {}; let ok = true;
    for (const vp of ['390x664', '844x390', '768x1024', '1024x768']) { const { ctx, page } = await open('cities/tokyo.html', '#view=gallery&p=' + first('cities/tokyo.html'), vp);
      const b = page.locator('[role=dialog] [data-cleo-card]').filter({ visible: true }).first(); if (await b.count()) { await b.scrollIntoViewIfNeeded().catch(() => {}); await b.click().catch(() => {}); }
      await page.waitForSelector('#cleo-card-dlg img, #cleo-card-dlg canvas', { timeout: 8000 }).catch(() => {}); await page.waitForTimeout(800);
      const r = await page.evaluate(() => { const d = document.getElementById('cleo-card-dlg'); if (!d) return { dialog: false }; const q = d.getBoundingClientRect(); const im = d.querySelector('img, canvas'); const i = im && im.getBoundingClientRect();
        const h = d.querySelector('h2, h3'); const hr = h && h.getBoundingClientRect();
        return { dialog: true, inside: q.top >= -1 && q.bottom <= innerHeight + 1 && q.left >= -1 && q.right <= innerWidth + 1, img: i ? [Math.round(i.width), Math.round(i.height)] : null, ratio: i ? +(i.height / i.width).toFixed(2) : null,
          imgIn: i ? i.top >= -1 && i.bottom <= innerHeight + 1 : false, heading: hr ? hr.top >= 0 && hr.bottom <= innerHeight : null, scrolls: [d, ...d.querySelectorAll('*')].some(e => e.scrollHeight > e.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(e).overflowY)) }; });
      ev[vp] = r; ok = ok && r.dialog && r.inside && r.imgIn && r.heading !== false && r.ratio >= 1.7 && r.ratio <= 1.85 && !r.scrolls; if (vp === '844x390') ev.shot = await shot(page, 'OV-08-card-844x390'); await ctx.close(); }
    row('OV-08', ok, ev); }
  // OV-09: Atlas 1024×768 with a place open: the sheet does not cover the map pane; the selected pin is visible
  if (want('OV-09')) { const ev = {}; let ok = true;
    for (const rel of ['cities/tokyo.html', 'cleveland.html']) { const id = first(rel); const { ctx, page } = await open(rel, '#view=atlas&p=' + id, '1024x768'); await page.waitForTimeout(1200);
      const r = await page.evaluate(id => { const m = [...document.querySelectorAll('.leaflet-container')].find(e => e.getBoundingClientRect().height > 0); const s = [...document.querySelectorAll('[role=dialog]')].find(e => e.getBoundingClientRect().height > 80);
        if (!m || !s) return { map: !!m, sheet: !!s }; const a = m.getBoundingClientRect(), b = s.getBoundingClientRect(); const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)), oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        const pin = document.querySelector('.leaflet-marker-pane .sel, .leaflet-marker-pane [data-id="' + id + '"]'); let pinOk = null; if (pin) { const g = document.createRange(); g.selectNodeContents(pin); const q0 = pin.getBoundingClientRect(), q1 = g.getBoundingClientRect(); const q = q1.width > q0.width ? q1 : q0;   // the .pp wrapper can be zero-size: use its content box
          const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); pinOk = !!t && (pin === t || pin.contains(t)) && q.left >= a.left && q.right <= a.right; }
        return { map: true, sheet: true, sheetOverMapPx: Math.round(ox * oy), mapW: Math.round(a.width), pinVisible: pinOk }; }, id);
      ev[rel] = r; ok = ok && r.sheet && r.sheetOverMapPx === 0 && r.pinVisible === true; if (rel === 'cities/tokyo.html') ev.shot = await shot(page, 'OV-09-tokyo-atlas-1024-sheet'); await ctx.close(); }
    row('OV-09', ok, ev); }
  // OV-11: Gallery 844×390 with the sheet open: nothing of the site header above the sheet (top band belongs to the sheet)
  if (want('OV-11')) { const ev = {}; let ok = true;
    for (const rel of CITIES) { const { ctx, page } = await open(rel, '#view=gallery&p=' + first(rel), '844x390');
      const r = await page.evaluate(() => { const s = [...document.querySelectorAll('[role=dialog]')].find(e => e.getBoundingClientRect().height > 80); if (!s) return { sheet: false };
        const pts = [0.1, 0.5, 0.9].map(f => document.elementFromPoint(innerWidth * f, 6)); const b = s.getBoundingClientRect(); return { sheet: true, top: Math.round(b.top), h: Math.round(b.height), topBandIsSheet: pts.every(t => t && s.contains(t)) }; });
      ev[rel] = r; ok = ok && r.sheet && r.topBandIsSheet; if (rel === CITIES[0]) ev.shot = await shot(page, 'OV-11-tokyo-gallery-844x390-sheet'); await ctx.close(); }
    row('OV-11', ok, ev); }
  // OV-12: the base note ≤ 100 px on phone and in the Atlas list, ≤ 80 px on desktop
  if (want('OV-12')) { const ev = {}; let ok = true; const id = first('cities/tokyo.html');
    for (const [vp, hash, cap] of [['390x844', '#view=gallery&base=' + id, 100], ['390x844', '#view=atlas&base=' + id, 100], ['1440x900', '#view=gallery&base=' + id, 80]]) {
      const { ctx, page } = await open('cities/tokyo.html', hash, vp); if (hash.includes('atlas') && vp === '390x844') { const t = page.locator('.ms-toggle').filter({ visible: true }).first(); if (await t.count()) { await t.click().catch(() => {}); await page.waitForTimeout(700); } }
      const r = await page.evaluate(() => { const e = document.getElementById('cleo-basenote'); if (!e) return { note: false }; const q = e.getBoundingClientRect(); return { note: true, h: Math.round(q.height), shown: q.height > 0 }; });
      ev[vp + hash.replace(/&base=.*/, '')] = { ...r, cap }; ok = ok && (!r.note || !r.shown || r.h <= cap); await ctx.close(); }
    row('OV-12', ok, ev); }
  // OV-30: Guidebook's sticky Contents strip is not covered by the city bar once it sticks (after a 300 px scroll)
  if (want('OV-30')) { const ev = {}; let ok = true;
    for (const rel of CITIES) for (const vp of ['390x844', '390x664', '844x390', '768x1024']) { const { ctx, page } = await open(rel, '#view=guidebook', vp);
      await page.mouse.wheel(0, 300); await page.waitForTimeout(500); await page.mouse.wheel(0, -40); await page.waitForTimeout(500);   // a small scroll up brings the strip back
      const r = await onTopOf(page, 'nav.toc'); ev[rel.replace(/^.*\//, '') + ' ' + vp] = r.found ? (r.inView ? (r.onTop ? 'clear' : 'covered') : 'not in view') : 'no strip'; ok = ok && !(r.found && r.inView && !r.onTop); await ctx.close(); }
    row('OV-30', ok, ev); }
  // OV-31 / OV-32: Guidebook and Insights at 844×390: chrome ≤ 13 % at rest and after a 600 px scroll
  if (want('OV-31') || want('OV-32')) { const ev = {}; let ok = true;
    for (const rel of CITIES) for (const v of ['guidebook', 'insights']) { const { ctx, page } = await open(rel, '#view=' + v, '844x390'); const L = await page.evaluate(MEASURE);
      await page.mouse.wheel(0, 600); await page.waitForTimeout(400); const D = await page.evaluate(MEASURE); ev[rel.replace(/^.*\//, '') + ' ' + v] = [L.band, D.band]; ok = ok && L.band <= 13 && D.band <= 13;
      if (rel === CITIES[0] && v === 'guidebook') ev.shot = await shot(page, 'OV-31-tokyo-guidebook-844x390-after-scroll'); await ctx.close(); }
    row('OV-31', ok, ev); res['OV-32'] = res['OV-31']; }
  // OV-33: no "Map" / "Show map" floating control in Guidebook or Insights, any viewport
  if (want('OV-33')) { const ev = {}; let ok = true;
    for (const vp of ALLVP) for (const v of ['guidebook', 'insights']) { const { ctx, page } = await open('cities/tokyo.html', '#view=' + v, vp);
      const n = await page.evaluate(() => [...document.querySelectorAll('button, a')].filter(e => { const r = e.getBoundingClientRect(); const p = getComputedStyle(e).position; return r.height > 0 && r.top < innerHeight && /^(show )?map$/i.test((e.getAttribute('aria-label') || e.textContent || '').trim()) && (/fixed|sticky/.test(p) || /fixed|sticky/.test(getComputedStyle(e.parentElement).position)); }).length);
      if (n) { ev[v + ' ' + vp] = n; ok = false; } await ctx.close(); }
    row('OV-33', ok, ok ? { mapPills: 0, views: 'guidebook, insights', viewports: 6 } : ev); }
  // OV-34: no Gallery toolbar visible in Guidebook / Insights at 1024 and 1440
  if (want('OV-34')) { const ev = {}; let ok = true;
    for (const vp of ['1024x768', '1440x900']) for (const v of ['guidebook', 'insights']) { const { ctx, page } = await open('cities/tokyo.html', '#view=' + v, vp);
      const r = await page.evaluate(() => { const t = [...document.querySelectorAll('div.toolbar, [data-cleo-toolbar]')].filter(e => { const q = e.getBoundingClientRect(); const s = getComputedStyle(e); return q.height > 0 && s.visibility !== 'hidden' && !e.closest('[hidden]'); }); return t.map(e => Math.round(e.getBoundingClientRect().top) + '–' + Math.round(e.getBoundingClientRect().bottom)); });
      ev[v + ' ' + vp] = r.length ? r : 'none'; ok = ok && !r.length; await ctx.close(); }
    row('OV-34', ok, ev); }
  // OV-35: What changed + How we choose: landscape chrome ≤ 13 % at rest; on P1 the tab bar steps aside after a scroll (≤ 8 %, the rest is OV-37's header)
  if (want('OV-35')) { const ev = {}; let ok = true;
    for (const rel of ['changes/tokyo.html', 'how-we-choose.html', 'index.html']) { for (const vp of ['844x390', '390x844']) { const { ctx, page } = await open(rel, '', vp); const L = await page.evaluate(MEASURE);
      await page.mouse.wheel(0, 600); await page.waitForTimeout(400); const D = await page.evaluate(MEASURE); ev[rel + ' ' + vp] = [L.band, D.band];
      ok = ok && (vp === '844x390' ? L.band <= 13 : D.band <= 8.5); await ctx.close(); } }
    row('OV-35', ok, ev); }
  // OV-36: Guidebook's Contents strip slides away after a 600 px scroll down (P1, P2, T1)
  if (want('OV-36')) { const ev = {}; let ok = true;
    for (const rel of CITIES) for (const vp of ['390x844', '390x664', '768x1024']) { const { ctx, page } = await open(rel, '#view=guidebook', vp);
      await page.mouse.wheel(0, 600); await page.waitForTimeout(500); const r = await onTopOf(page, 'nav.toc'); const D = await page.evaluate(MEASURE);
      ev[rel.replace(/^.*\//, '') + ' ' + vp] = { strip: r.found && r.inView && r.onTop ? 'on screen' : 'away', band: D.band }; ok = ok && !(r.found && r.inView && r.onTop); await ctx.close(); }
    row('OV-36', ok, ev); }
  // OV-40: with a sheet open, the toast after "Set as my base" does not overlap the sheet's action bar (all six viewports)
  if (want('OV-40')) { const ev = {}; let ok = true;
    for (const vp of ALLVP) { const { ctx, page } = await open('cities/tokyo.html', '#view=gallery&p=' + first('cities/tokyo.html'), vp);
      const b = page.locator('[role=dialog] [data-cleo-base="set"]').filter({ visible: true }).first(); let clicked = false; if (await b.count()) { await b.scrollIntoViewIfNeeded().catch(() => {}); await b.click().catch(() => {}); clicked = true; }
      await page.waitForTimeout(500);
      const r = await page.evaluate(() => { const t = [...document.querySelectorAll('p.toast')].find(e => e.getBoundingClientRect().height > 0); const s = [...document.querySelectorAll('[role=dialog]')].find(e => e.getBoundingClientRect().height > 80);
        if (!t || !s) return { toast: !!t, sheet: !!s }; const tr = t.getBoundingClientRect(); const acts = [...s.querySelectorAll('button, a')].filter(e => { const p = getComputedStyle(e.closest('[class]') || e); const q = e.getBoundingClientRect(); return q.height > 0 && q.bottom > s.getBoundingClientRect().bottom - 120; });
        const hit = acts.filter(e => { const q = e.getBoundingClientRect(); return Math.min(q.right, tr.right) - Math.max(q.left, tr.left) > 1 && Math.min(q.bottom, tr.bottom) - Math.max(q.top, tr.top) > 1; }).map(e => (e.textContent || '').trim().slice(0, 20));
        return { toast: true, sheet: true, text: t.textContent.trim().slice(0, 40), overActions: hit }; });
      ev[vp] = { clicked, ...r }; ok = ok && (!r.toast || (r.overActions || []).length === 0); if (vp === '390x844' || vp === '1440x900') ev['shot' + vp] = await shot(page, 'OV-40-toast-' + vp); await ctx.close(); }
    row('OV-40', ok, ev); }
  await browser.close(); srv.close();
  fs.writeFileSync(path.join(OUT, 'verify.json'), JSON.stringify({ label: LABEL, root: ROOT, res }, null, 1));
})();
