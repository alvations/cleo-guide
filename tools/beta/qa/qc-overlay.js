#!/usr/bin/env node
/**
 * Beta QC S-17: overlay and chrome probe (QC lane, owner directive 2026-10-16; docs/BETA-OVERLAY-LEDGER.md "How it's measured").
 * Same rig as qc.js: beta/ from disk, OSM / Esri tiles stubbed, every other off-origin request aborted, service workers blocked.
 *
 * Every page × view × viewport × theme. A run loads the page, measures, moves (map pan on map views; scroll elsewhere; the
 * sheet's own scroller on the place detail), measures DURING the move, waits, and measures at IDLE. Each measurement samples
 * the viewport on an 8 px grid and classifies the topmost element at each point:
 *   chrome  — under a fixed or sticky ancestor (or, on a page that does not scroll, anything that is not the map or a card);
 *   overlay — anything drawn over the map that is not the map itself, a pin or a label (Leaflet controls, chips, pills, tray);
 *   map / pin / label — the map pane: tiles and dots, pin icons, label pills (Leaflet markers with text);
 *   sheet-chrome / sheet — inside an open dialog: its sticky bars, and the rest;
 *   content — everything else.
 * Metrics (ledger §1–6): chrome share (area, and the top + bottom bands as % of the viewport height) at load / during /
 * idle; clear map % (map + pin points of the map pane); label coverage % of the map pane, widest label % of the map width,
 * label↔label and label↔control overlaps; control collisions (fixed / overlay controls over each other or over a pin);
 * "Search this area" on the first screen; toasts still up at idle; duplicate controls on one screen; compaction during a
 * move. Graded against the designer's OV-00 budgets (bb2af873); the distributions are kept for trend.
 *
 * Usage (from tools/): NODE_PATH=$(npm root -g) node beta/qa/qc-overlay.js --label <sha> [--root <checkout>]
 *   [--pages punggol,tokyo] [--vps 390x844,390x664,844x390,768x1024,1024x768,1440x900] [--themes light,dark]
 *   [--views atlas,gallery,guidebook,insights,sheet] [--jobs 4] [--shots 120]
 * Output: design/beta/eval/qc/overlay/<label>/{s17.json, summary.md, shots/}
 * qc.js requires MEASURE from here for S-17 in every sweep.
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml' };
const VPS = { '390x844': { w: 390, h: 844, m: 1 }, '390x664': { w: 390, h: 664, m: 1 }, '844x390': { w: 844, h: 390, m: 1 },
  '768x1024': { w: 768, h: 1024, m: 1 }, '1024x768': { w: 1024, h: 768, m: 1 }, '1440x900': { w: 1440, h: 900, m: 0 } };
const ctxOpts = (vp, theme) => { const v = VPS[vp]; return { viewport: { width: v.w, height: v.h }, isMobile: !!v.m, hasTouch: !!v.m,
  deviceScaleFactor: v.m ? 2 : 1, colorScheme: theme, serviceWorkers: 'block' }; };

// In-page measurement (string-built so qc.js can reuse it). Returns the metrics for the current screen.
const MEASURE = new Function(`
  const W = innerWidth, H = innerHeight, STEP = W >= 1000 ? 16 : W >= 700 ? 12 : 8;   // ~5k points per sample at any size
  const cs = e => getComputedStyle(e);
  const shown = e => { if (!e || !e.isConnected) return false; const s = cs(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
    const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W && !e.closest('[hidden]'); };
  const mapC = [...document.querySelectorAll('.leaflet-container')].find(shown) || null;
  const mr = mapC ? mapC.getBoundingClientRect() : null;
  const dlg = [...document.querySelectorAll('[role=dialog]')].find(e => shown(e) && e.getBoundingClientRect().height > 80) || null;
  const scrolls = document.documentElement.scrollHeight > H + 2;
  const cache = new Map();
  // on a page that does not scroll (Atlas), a pane that scrolls on its own (the desktop list column) is content, not chrome (FE-1, 10:41Z)
  const scrollers = [...document.querySelectorAll('*')].filter(e => /auto|scroll/.test(getComputedStyle(e).overflowY) && e.clientHeight >= H * 0.25 && e.scrollHeight > e.clientHeight + 24 && e !== document.documentElement && e !== document.body);   // a pane, not a strip that overflows by a few px
  const inScroller = e => scrollers.some(s => s.contains(e));
  const frameW = e => (dlg && dlg.contains(e) ? dlg.getBoundingClientRect().width : W);
  const fixedAnc = e => { const stop = dlg && dlg.contains(e) ? dlg : document.body;   // inside a sheet, its own bars only (not the backdrop container)
    for (let a = e; a && a !== stop && a !== document.body && a !== document.documentElement; a = a.parentElement) { const p = cs(a).position;
    if (p === 'fixed' && a !== dlg) return a; if (p === 'sticky' && a.getBoundingClientRect().width >= 0.6 * frameW(a)) return a; } return null; };   // a sticky side column is content, a sticky bar is chrome
  const CONTENT = 'li.pl, .gc, .ge, .ixi, article, .icard, .listpane li, .ms-car li';
  const isLabel = e => { const p = e.closest('.leaflet-marker-pane .pp, .leaflet-tooltip, .leaflet-popup'); return !!(p && (p.textContent || '').trim().length > 1); };
  const classify = e => {
    if (!e) return 'none'; if (cache.has(e)) return cache.get(e); let k;
    if (dlg && dlg.contains(e)) { const f = fixedAnc(e); k = f && f !== dlg && dlg.contains(f) ? 'sheet-chrome' : 'sheet'; }
    else if (dlg) k = 'backdrop';
    else if (mapC && mapC.contains(e)) {
      if (isLabel(e)) k = 'label';
      else if (e.closest('.leaflet-marker-pane')) k = 'pin';
      else if (e.closest('.leaflet-control-container, .leaflet-control, .leaflet-top, .leaflet-bottom')) k = 'overlay';
      else if (e === mapC || e.closest('.leaflet-map-pane')) k = 'map';
      else k = 'overlay';
    } else { const f = fixedAnc(e); k = f ? 'chrome' : (!scrolls && !e.closest(CONTENT) && !inScroller(e) ? 'chrome' : 'content'); }
    cache.set(e, k); return k; };
  const n = {}, rows = [], inMap = { all: 0, map: 0, pin: 0, label: 0, overlay: 0, other: 0 }; const dr = dlg ? dlg.getBoundingClientRect() : null;
  const VY = 4;   // rows every 4 px, so a band's edge is exact to 4 px (columns stay STEP apart)
  for (let y = VY / 2; y < H; y += VY) { const row = { chrome: 0, all: 0 };
    for (let x = STEP / 2; x < W; x += STEP) {
      let k = classify(document.elementFromPoint(x, y));
      if (mr && x >= mr.left && x < mr.right && y >= mr.top && y < mr.bottom && !(k === 'sheet' || k === 'sheet-chrome')) {
        inMap.all++; if (k === 'map' || k === 'pin' || k === 'label' || k === 'overlay') inMap[k]++; else { inMap.other++; k = 'overlay'; } }
      n[k] = (n[k] || 0) + 1; if (k === 'backdrop') continue; row.all++; if (k === 'chrome' || k === 'overlay' || k === 'sheet-chrome') row.chrome++; }
    if (!dr || (y >= dr.top && y < dr.bottom)) rows.push(row); }
  const tot = rows.reduce((s, r) => s + r.all, 0) || 1, RH = H / VY;   // bands stay a % of the viewport height
  let top = 0; while (top < rows.length && rows[top].chrome / rows[top].all >= 0.5) top++;
  let bot = 0; while (bot < rows.length - top && rows[rows.length - 1 - bot].chrome / rows[rows.length - 1 - bot].all >= 0.5) bot++;
  const pct = x => Math.round(x * 1000) / 10;
  const out = { W, H, scrolls, map: !!mapC, sheet: !!dlg,
    chromeArea: pct(((n.chrome || 0) + (n.overlay || 0) + (n['sheet-chrome'] || 0)) / tot), bandTop: pct(top / RH), bandBottom: pct(bot / RH) };
  out.band = Math.round((out.bandTop + out.bandBottom) * 10) / 10;
  if (mapC) { const a = inMap.all || 1; out.mapPane = pct(inMap.all / tot); out.clearMap = pct((inMap.map + inMap.pin) / a); out.labelCov = pct(inMap.label / a); out.overMap = pct((inMap.overlay + inMap.other) / a);
    // OV-00 clear map excludes labels (they have their own caps): phones and T1 as % of the viewport, T2 and D as % of the map pane
    out.clearVP = pct((inMap.map + inMap.pin + inMap.label) / tot); out.clearPane = pct((inMap.map + inMap.pin + inMap.label) / a); }
  // labels: widest, overlaps with each other and with controls
  const ctrlSel = 'button, a[href], input, select, [role=button], summary';
  // orchestrator ruling (03:08Z): a control is shown only if its centre is inside the viewport AND inside the visible rect of
  // every overflow auto/scroll/hidden/clip ancestor (a link scrolled out of its own scroll area is not "covered" by a bar)
  const inClips = e => { const r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; if (x < 0 || y < 0 || x >= W || y >= H) return false;
    for (let a = e.parentElement; a && a !== document.documentElement; a = a.parentElement) { const c = cs(a); if (/auto|scroll|hidden|clip/.test(c.overflowX + ' ' + c.overflowY)) { const q = a.getBoundingClientRect(); if (x < q.left || x >= q.right || y < q.top || y >= q.bottom) return false; } } return true; };
  const controls = [...document.querySelectorAll(ctrlSel)].filter(e => shown(e) && inClips(e) && !e.closest('.leaflet-marker-pane') && !e.closest(CONTENT) && (fixedAnc(e) || (mapC && !mapC.contains(e) && mr && (() => { const r = e.getBoundingClientRect(); return r.left < mr.right && r.right > mr.left && r.top < mr.bottom && r.bottom > mr.top; })()) || (mapC && mapC.contains(e)) || (dlg && dlg.contains(e) && fixedAnc(e))));
  const onTop = e => { const r = e.getBoundingClientRect(); const x = Math.min(Math.max(r.left + r.width / 2, 0), W - 1), y = Math.min(Math.max(r.top + r.height / 2, 0), H - 1); const t = document.elementFromPoint(x, y); return !!t && (t === e || e.contains(t) || t.contains(e)); };
  const name = e => (e.getAttribute('aria-label') || e.textContent || e.value || e.getAttribute('title') || '').replace(/\\s+/g, ' ').trim().toLowerCase().slice(0, 40);
  // a chrome or map control that is shown but covered at its centre by another layer cannot be used (QA-80: the landscape
  // view switch under the header). Behind an open sheet is expected, so those are not counted.
  const under = e => { const r = e.getBoundingClientRect(); return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); };   // a list behind the map (phone map mode) is not a covered control
  out.covered = controls.filter(e => !onTop(e) && !(dlg && !dlg.contains(e)) && !(mapC && !mapC.contains(e) && mapC.contains(under(e))) && (() => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= H && r.left >= 0 && r.right <= W; })())
    .map(e => { const r = e.getBoundingClientRect(); const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return name(e) + ' under ' + (t ? (t.closest('button,a,input') ? name(t.closest('button,a,input')) || t.tagName : (t.className && typeof t.className === 'string' ? t.tagName.toLowerCase() + '.' + t.className.split(' ')[0] : t.tagName.toLowerCase())) : '?'); }).slice(0, 6);
  for (let i = controls.length - 1; i >= 0; i--) if (!onTop(controls[i])) controls.splice(i, 1);
  const R = e => e.getBoundingClientRect(), hit = (a, b, m = 1) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > m && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > m;
  if (mapC) {
    const tb = e => { const g = document.createRange(); g.selectNodeContents(e); const r = g.getBoundingClientRect(); const s = e.getBoundingClientRect(); return r.width > s.width ? r : s; };
    const labs = [...document.querySelectorAll('.leaflet-marker-pane .pp, .leaflet-tooltip')].filter(e => (e.textContent || '').trim().length > 1 && cs(e).visibility !== 'hidden' && cs(e).display !== 'none' && (() => { const r = tb(e); return r.width > 0 && r.bottom > mr.top && r.top < mr.bottom && r.right > mr.left && r.left < mr.right; })());
    const pins = [...document.querySelectorAll('.leaflet-marker-pane > *')].filter(shown);
    out.labels = labs.length; out.pins = pins.length;
    out.widestLabel = labs.length ? pct(Math.max(...labs.map(e => tb(e).width)) / mr.width) : 0;
    out.widestLabelText = labs.length ? labs.reduce((a, b) => (tb(b).width > tb(a).width ? b : a)).textContent.trim().slice(0, 50) : '';
    let ll = 0; labs.forEach((a, i) => labs.slice(i + 1).forEach(b => { if (hit(tb(a), tb(b))) ll++; })); out.labelOverlaps = ll;
    out.labelMaxPx = labs.length ? Math.round(Math.max(...labs.map(e => tb(e).width))) : 0;
    const near = (a, b) => !(a.right + 4 <= b.left || b.right + 4 <= a.left || a.bottom + 4 <= b.top || b.bottom + 4 <= a.top);
    let lg = 0; labs.forEach((a, i) => labs.slice(i + 1).forEach(b => { if (near(tb(a), tb(b))) lg++; })); out.labelGap = lg;
    const at = [...mapC.querySelectorAll('.leaflet-control-attribution')].find(shown); out.attrW = at ? Math.round(R(at).width) : 0;
    if (at) { const q = R(at); out.attrH = Math.round(q.height); out.attrIn = q.left >= mr.left - 1 && q.right <= mr.right + 1 && q.top >= mr.top - 1 && q.bottom <= mr.bottom + 1;
      out.attrHit = controls.filter(c => !at.contains(c) && !c.contains(at) && hit(q, R(c), 1)).map(name).concat(labs.filter(l => hit(q, tb(l), 1)).map(l => 'label ' + l.textContent.trim().slice(0, 20))).slice(0, 4); }
    let lc = 0; labs.forEach(a => controls.forEach(c => { if (!c.contains(a) && !a.contains(c) && hit(tb(a), R(c))) lc++; })); out.labelControl = lc;
    let cp = []; controls.forEach(c => pins.forEach(p => { if (!c.contains(p) && !p.contains(c) && hit(R(c), R(p), 2) && document.elementFromPoint((Math.max(R(c).left, R(p).left) + Math.min(R(c).right, R(p).right)) / 2, (Math.max(R(c).top, R(p).top) + Math.min(R(c).bottom, R(p).bottom)) / 2) !== p) cp.push(name(c) + ' / ' + ((p.textContent || '').trim().slice(0, 20) || 'pin')); }));
    out.controlPin = cp.length; out.controlPinSample = [...new Set(cp)].slice(0, 4);
  }
  // per line box: an inline link that wraps has a bounding box over two lines, which is not a collision
  const boxes = e => { const l = [...e.getClientRects()].filter(q => q.width > 1 && q.height > 1); return l.length ? l : [R(e)]; };
  let cc = []; controls.forEach((a, i) => controls.slice(i + 1).forEach(b => { if (!a.contains(b) && !b.contains(a) && boxes(a).some(x => boxes(b).some(y => hit(x, y, 2)))) cc.push(name(a) + ' / ' + name(b)); }));
  out.controlCollisions = cc.length; out.controlCollisionSample = [...new Set(cc)].slice(0, 4);
  const here = [...document.querySelectorAll('.ms-here, button, a')].find(e => shown(e) && /search this area/i.test(e.textContent || ''));
  out.searchHere = !!here;
  out.toasts = [...document.querySelectorAll('[role=status], [role=alert], [class*=toast], [aria-live]')].filter(e => shown(e) && (e.textContent || '').trim() && /fixed|absolute|sticky/.test(cs(e).position) && R(e).height < H * 0.5)
    .map(e => (e.textContent || '').trim().slice(0, 50));
  // duplicates: the same action twice on one screen, among the controls on top in the chrome and over the map (content
  // links such as a card's "How we choose" are not chrome); two search fields count even when their scopes differ
  const by = {}; controls.forEach(e => { const k = name(e); if (k && k.length > 1 && !/^\\d+$/.test(k)) (by[k] = by[k] || []).push(e); });
  out.duplicates = Object.entries(by).filter(([, l]) => l.length > 1).map(([k, l]) => k + ' ×' + l.length).slice(0, 6);
  // an entry point is a field or a control that opens search; a results list's "Search all guides" row ([data-cleo-all-slot])
  // and its "clear search" are part of the results (orchestrator ruling, 10:40Z)
  const searches = [...document.querySelectorAll('button, a[href], input, [role=button]')].filter(e => shown(e) && onTop(e) && !e.closest(CONTENT) && !e.closest('[data-cleo-all-slot]') && !/\bclear\b/i.test(name(e)) &&
    (/search/i.test(name(e)) || e.type === 'search' || /search/i.test(e.getAttribute('placeholder') || '')));
  // orchestrator ruling (02:15Z): a field and its own submit button inside one form (or one role=search) are ONE search
  // control; separate entry points on one screen (header search + hero search) count separately
  const entry = [...new Map(searches.map(e => [e.closest('form, [role=search]') || e, e])).values()];
  if (entry.length > 1) out.duplicates.push('search ×' + entry.length + ' (' + entry.map(e => (name(e) || e.getAttribute('placeholder') || '').slice(0, 24)).join(' + ') + ')');
  // the top bar's paint (designer b2f587a8: chrome is opaque, no backdrop blur): alpha of the topmost fixed/sticky bar at the top edge
  { const t = fixedAnc(document.elementFromPoint(W / 2, 4) || document.body); if (t) { const c = cs(t); const m = /rgba?\(([^)]+)\)/.exec(c.backgroundColor); const p = m ? m[1].split(/[ ,\/]+/).filter(Boolean) : [];
    out.topAlpha = p.length > 3 ? +(+p[3]).toFixed(2) : p.length ? 1 : 0; out.topBlur = /blur/.test(c.backdropFilter || c.webkitBackdropFilter || ''); } }
  out.mapControl = controls.filter(e => name(e) === 'map').length; out.nearMe = controls.filter(e => /near me/.test(name(e))).length;
  out.view = document.documentElement.getAttribute('data-view') || null;
  return out;`);

if (require.main === module) main();
module.exports = { MEASURE, VPS, ctxOpts };

async function main() {
  const { chromium } = require('playwright');
  const argv = process.argv.slice(2), opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
  const ROOT = path.resolve(opt('--root', path.join(__dirname, '..', '..', '..'))), BETA = path.join(ROOT, 'beta');
  const OUTROOT = path.resolve(__dirname, '..', '..', '..');   // results always land in this checkout
  const LABEL = opt('--label', 'working'), OUT = path.join(OUTROOT, 'design', 'beta', 'eval', 'qc', 'overlay', LABEL), SHOTS = path.join(OUT, 'shots');
  const vps = opt('--vps', Object.keys(VPS).join(',')).split(','), themes = opt('--themes', 'light,dark').split(','), JOBS = +opt('--jobs', '4');
  const views = opt('--views', 'atlas,gallery,guidebook,insights,sheet').split(','), filt = opt('--pages', '').split(',').filter(Boolean), NSHOTS = +opt('--shots', '120');
  const man = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'manifest.json'), 'utf8')).pages;
  const places = {}; for (const f of fs.readdirSync(path.join(BETA, 'data', 'places'))) { if (!f.endsWith('.json')) continue;
    try { const d = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'places', f), 'utf8')); if (d.beta) places[d.beta] = d; } catch (e) { /* skip */ } }
  let pages = man.map(m => m.beta).concat(['trip.html', 'saved.html', 'how-we-choose.html', 'accessibility.html', 'changes/tokyo.html', 'changes/cleveland.html', 'changes/singapore--punggol.html'])   // What changed: one shell, three samples.filter(p => fs.existsSync(path.join(BETA, p)));
  if (filt.length) pages = pages.filter(p => filt.some(k => p.includes(k)));
  const jobs = [];
  for (const p of pages) { const d = places[p]; const city = !!(d && d.places && d.places.length);
    const top = city ? (d.places.find(x => !(x.pv && x.pv.status === 'closed')) || d.places[0]).id : null;
    for (const vp of vps) for (const theme of themes) {
      if (!city) { jobs.push({ page: p, view: 'page', hash: '', vp, theme }); continue; }
      for (const v of views) jobs.push({ page: p, view: v, hash: v === 'sheet' ? '#view=gallery&p=' + encodeURIComponent(top) : '#view=' + v, vp, theme });
      if (views.includes('atlas') && !argv.includes('--no-default')) jobs.push({ page: p, view: 'default', hash: '', vp, theme }); } }   // D-46: the cold first screen (no hash) must be Atlas, within OV-00 at rest
  fs.mkdirSync(SHOTS, { recursive: true });
  const srv = http.createServer((req, rsp) => { let f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0].split('#')[0]));
    if (!f.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
    try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
    fs.readFile(f, (err, buf) => { if (err) { rsp.writeHead(404); return rsp.end(); } rsp.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); rsp.end(buf); }); }).listen(0, '127.0.0.1');
  await new Promise(r => srv.on('listening', r));
  const base = `http://127.0.0.1:${srv.address().port}/`;
  const browser = await chromium.launch();
  const results = []; let done = 0;
  const run = async (j, shot) => {
    const ctx = await browser.newContext(ctxOpts(j.vp, j.theme));
    await ctx.route('**/*', route => { const u = route.request().url(); if (u.startsWith(base)) return route.continue();
      if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u)) return route.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }); return route.abort(); });
    const page = await ctx.newPage(); const r = { ...j };
    try {
      await page.goto(base + 'beta/' + j.page + j.hash, { waitUntil: 'load', timeout: 45000 }); await page.waitForTimeout(1400);
      if (shot) { await page.screenshot({ path: path.join(SHOTS, shot + '.jpg'), type: 'jpeg', quality: 50, scale: 'css' }).catch(() => {}); return r; }
      r.load = await page.evaluate(MEASURE);
      // the move: pan the map (drag from the middle of the map pane), else scroll the sheet's scroller, else the page
      const { W, H } = r.load;
      const mb = r.load.map ? await page.locator('.leaflet-container').filter({ visible: true }).first().boundingBox().catch(() => null) : null;
      if (mb && !r.load.sheet) {   // OV-00: sample 300 ms into a 200 px pan (pointer still down), then 1.5 s after release
        const cx = mb.x + mb.width / 2, cy = mb.y + mb.height / 2, dx = -Math.min(160, mb.width / 3), dy = -Math.min(120, mb.height / 3), k = 200 / Math.hypot(dx, dy);
        await page.mouse.move(cx, cy); await page.mouse.down();
        for (let i = 1; i <= 10; i++) { await page.mouse.move(cx + dx * k * i / 10, cy + dy * k * i / 10); await page.waitForTimeout(30); }
        r.during = await page.evaluate(MEASURE); await page.mouse.up(); r.move = 'pan';
      } else if (r.load.sheet) {
        r.move = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].find(e => e.getBoundingClientRect().height > 80);
          const s = d && [d, ...d.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.clientHeight - a.clientHeight)[0];
          if (!s) return 'none'; s.scrollTop += 600; return 'sheet-scroll'; });
        await page.waitForTimeout(300); r.during = await page.evaluate(MEASURE);
      } else if (r.load.scrolls) { await page.mouse.wheel(0, 600); await page.waitForTimeout(300); r.during = await page.evaluate(MEASURE); r.move = 'scroll'; }   // OV-00: after a 600 px scroll
      else r.move = 'none';
      await page.waitForTimeout(1500); r.idle = await page.evaluate(MEASURE);
      if (r.idle.toasts && r.idle.toasts.length) { await page.waitForTimeout(1500); r.toastLate = (await page.evaluate(MEASURE)).toasts; }   // still up ≥ 4 s after load
    } catch (e) { r.error = e.message.slice(0, 160); }
    await ctx.close(); return r;
  };
  // the release-gating views first (orchestrator 11:15Z): the cold first screen and Atlas, then the sheet, the landing and
  // other pages, Guidebook; a graded partial (summary.partial.md, groups.partial.json) every 500 runs
  const PRI = { default: 0, atlas: 1, sheet: 2, page: 3, guidebook: 4, gallery: 5, insights: 6 }; jobs.sort((a, b) => PRI[a.view] - PRI[b.view]);
  const queue = jobs.slice();
  await Promise.all(Array.from({ length: JOBS }, async () => { while (queue.length) { const j = queue.shift(); const r = await run(j); results.push(r);
    if (++done % 50 === 0) console.log(`  ${done}/${jobs.length}`); if (done % 500 === 0) { try { writeOut(grade(), false); } catch (e) { console.log('partial: ' + e.message); } } } }));
  const gl = grade();
  let s = 0; for (const x of gl) { if (s >= NSHOTS) break; const w = x.worst.r; const name = [x.worst.kind, w.view, w.vp, w.theme, w.page.replace(/[^a-z0-9]+/gi, '-')].join('_');
    await run({ ...w }, name); x.shot = path.relative(OUTROOT, path.join(SHOTS, name + '.jpg')); s++; }
  await browser.close(); srv.close();
  writeOut(gl, true);
  function grade() {
    // OV-00 budgets (designer, bb2af873: SPEC-v3 §2.0 for Atlas, DESIGN-SYSTEM §v2.12 for every other view)
    const VK = { '390x844': 'P1', '390x664': 'P2', '844x390': 'L', '768x1024': 'T1', '1024x768': 'T2', '1440x900': 'D' };
    const ATLAS = { P1: [25, 8, 72, 90, 8, 8], P2: [32, 10, 64, 87, 7, 8], L: [13, 13, 80, 80, 10, 8], T1: [18, 8, 78, 90, 12, 7], T2: [15, 15, 90, 90, 16, 6], D: [12, 12, 92, 92, 16, 6] };   // chrome rest/pan, clear rest/pan, label count, label cover
    const OTHER = { P1: [13, 7], P2: [16, 8], L: [13, 13], T1: [11, 6], T2: [8, 8], D: [8, 8] };                                                                 // chrome rest / after a 600 px scroll
    const PHONE = { P1: 1, P2: 1, L: 1, T1: 1 };
    const city = r => r.view !== 'page';
    const owner = (kind, r) => {
      if (r.view === 'default') return kind === 'defaultNotAtlas' ? 'FE-A (D-46 default)' : 'FE-A (header, switch) + Atlas FE-1 (chip row, peek)';
      if (r.view === 'atlas') return /^chrome/.test(kind) ? 'FE-A (header, switch) + Atlas FE-1 (chip row, peek)' : /^label/.test(kind) ? 'Atlas FE-1 + FE-2' : kind === 'duplicates' ? 'FE-B (search.js) + FE-A (city search) + designer' : 'Atlas FE-1';
      if (kind === 'duplicates') return 'FE-B (search.js) + FE-A (city search) + designer';
      if (r.view === 'sheet') return 'FE-C (sheet)';
      if (r.view === 'gallery') return 'FE-A';
      if (r.view === 'guidebook' || r.view === 'insights') return 'FE-B';
      return 'FE-B (hubs, landing, trip, saved, method)'; };
    const flags = [], push = (kind, value, budget, r) => flags.push({ kind, value, budget, r, owner: owner(kind, r) });
    results.forEach(r => { if (!r.load) { if (r.error) push('error', r.error, '—', r); return; } const v = VK[r.vp], L = r.load, D = r.during, map = r.view === 'atlas' && L.map;
      if (r.view === 'default') { const [cr, , kr] = ATLAS[v]; const clear = v === 'T2' || v === 'D' ? L.clearPane : L.clearVP;
        if (L.view !== 'atlas') push('defaultNotAtlas', 'opens ' + L.view, 'Atlas (D-46)', r);
        else { if (L.band > cr) push('firstScreenChrome', L.band, '≤ ' + cr + ' %', r); if (clear < kr) push('firstScreenClear', clear, '≥ ' + kr + ' %', r); }
        if (r.toastLate && r.toastLate.length) push('toast', r.toastLate.join(' / '), 'leaves within 4 s', r); return; }
      if (map) { const [cr, cp, kr, kp, lc, lv] = ATLAS[v]; const clear = x => (v === 'T2' || v === 'D' ? x.clearPane : x.clearVP);
        if (L.band > cr) push('chromeRest', L.band, '≤ ' + cr + ' %', r);
        if (D && D.band > cp) push('chromePan', D.band, '≤ ' + cp + ' % at 300 ms into a pan', r);
        if (clear(L) < kr) push('clearRest', clear(L), '≥ ' + kr + ' %', r);
        if (D && clear(D) < kp) push('clearPan', clear(D), '≥ ' + kp + ' % during a pan', r);
        if (L.labels > lc) push('labelCount', L.labels, '≤ ' + lc, r);
        if (L.labelCov > lv) push('labelCov', L.labelCov, '≤ ' + lv + ' % of the map', r);
        if (PHONE[v] ? L.widestLabel > 40 : L.labelMaxPx > 220) push('labelWidth', PHONE[v] ? L.widestLabel + ' % (' + L.widestLabelText + ')' : L.labelMaxPx + ' px (' + L.widestLabelText + ')', PHONE[v] ? '≤ 40 % of the map width' : '≤ 220 px', r);
        if (L.labelGap) push('labelGap', L.labelGap + ' pairs < 4 px', '≥ 4 px apart', r);
        if (L.searchHere) push('searchHereOnLoad', 'shown at load', 'absent at load', r);
        // designer ruling 10:41Z: at T2 / D the full credit stays, but it is one line (≤ 20 px), inside the map pane, over nothing
        if (!PHONE[v] && L.attrW && (L.attrH > 20 || L.attrIn === false || (L.attrHit || []).length)) push('attributionDesk', `${L.attrH} px tall; ${L.attrIn ? 'inside' : 'outside'} the map pane; over: ${(L.attrHit || []).join(', ') || 'nothing'}`, 'one line ≤ 20 px, inside the map pane, over no control or label', r);
        if (PHONE[v] && r.idle && r.idle.attrW > 60) push('attribution',   // SPEC-v3 §2.0.3 (b7df8c3f): the desktop credit stays full, T2 / D exempt
          r.idle.attrW + ' px wide 1.5 s after a pan', 'collapses to ⓘ on the first pan or after 5 s', r);
        if (PHONE[v] && L.mapControl) push('mapControl', 'a control named "Map"', 'none on phone', r);
        if (PHONE[v] && L.nearMe > 1) push('nearMeTwice', L.nearMe, 'once per screen', r); }
      else if (city(r) || r.view === 'page') { const [cr, ca] = OTHER[v];
        if (L.band > cr) push('chromeRest', L.band, '≤ ' + cr + ' %', r);
        if (D && r.move !== 'none' && D.band > ca) push('chromeScroll', D.band, '≤ ' + ca + ' % after a 600 px scroll', r); }
      if (L.topAlpha != null && (L.topAlpha < 1 || L.topBlur)) push('translucentChrome', 'top bar alpha ' + L.topAlpha + (L.topBlur ? ' + backdrop blur' : ''), 'opaque, no blur (b2f587a8)', r);
      if (r.toastLate && r.toastLate.length) push('toast', r.toastLate.join(' | '), 'leaves within 4 s', r);
      if (L.duplicates && L.duplicates.length) push('duplicates', L.duplicates.join('; '), 'one control per action', r);
      if (L.covered && L.covered.length) push('controlCovered', L.covered.join('; '), 'none: every shown control is reachable', r);
      if (L.controlCollisions) push('controlCollision', L.controlCollisionSample.join('; '), 'none', r);
      if (L.controlPin) push('controlOverPin', L.controlPin + ': ' + (L.controlPinSample || []).join('; '), 'none', r);
      if (L.labelControl) push('labelOverControl', L.labelControl, 'none', r);
      if (r.error) push('error', r.error, '—', r); });
    const groups = {}; flags.forEach(f => { const g = [f.kind, f.r.view === 'page' ? 'page' : f.r.view, f.r.vp].join('|'); (groups[g] = groups[g] || []).push(f); });
    const gl = Object.entries(groups).map(([g, l]) => ({ g, l, worst: l.slice().sort((a, b) => (typeof b.value === 'number' ? b.value : parseFloat(b.value) || 0) * (/clear/.test(b.kind) ? -1 : 1) - (typeof a.value === 'number' ? a.value : parseFloat(a.value) || 0) * (/clear/.test(a.kind) ? -1 : 1))[0] }));
    return gl;
  }
  function writeOut(gl, final) {
    const sfx = final ? '' : '.partial';
    if (final) fs.writeFileSync(path.join(OUT, 's17.json'), JSON.stringify({ label: LABEL, root: ROOT, n: results.length, results }, null, 0));
    const pctl = (k, get) => { const v = results.map(get).filter(x => x != null).sort((a, b) => a - b); if (!v.length) return '—'; const q = p => v[Math.min(v.length - 1, Math.floor(v.length * p))]; return `${q(0.5)} / ${q(0.9)} / ${v[v.length - 1]}`; };
    const md = [`# S-17 overlay and chrome · ${LABEL}`, '', `${results.length} runs (${new Set(results.map(r => r.page)).size} pages; viewports ${vps.join(', ')}; themes ${themes.join(', ')}; views ${views.join(', ')}). Errors: ${results.filter(r => r.error).length}.`, '',
      '## Distributions (median / p90 / max)', '', '| Metric | All | Atlas | Sheet |', '|---|---|---|---|'];
    for (const [k, lab] of [['band', 'chrome bands % of height (load)'], ['chromeArea', 'chrome area % (load)'], ['clearVP', 'clear map % of viewport (labels excluded)'], ['clearPane', 'clear map % of pane'], ['labels', 'label count'], ['labelCov', 'label coverage % of map'], ['widestLabel', 'widest label % of map width']])
      md.push(`| ${lab} | ${pctl(k, r => r.load && r.load[k])} | ${pctl(k, r => r.view === 'atlas' && r.load ? r.load[k] : null)} | ${pctl(k, r => r.view === 'sheet' && r.load ? r.load[k] : null)} |`);
    md.push('', '## Instance groups (kind · view · viewport): runs, worst, screenshot', '', '| Kind | View | Viewport | Failing runs / of (pages) | Budget | Worst | Page · theme | Owner | Shot |', '|---|---|---|---|---|---|---|---|---|');
    gl.sort((a, b) => b.l.length - a.l.length).forEach(x => { const w = x.worst.r; const of = results.filter(r => r.view === w.view && r.vp === w.vp).length; md.push(`| ${x.worst.kind} | ${w.view} | ${w.vp} | ${x.l.length} / ${of} (${new Set(x.l.map(f => f.r.page)).size}) | ${x.worst.budget} | ${String(x.worst.value).replace(/\|/g, '\\|').slice(0, 90)} | ${w.page} · ${w.theme} | ${x.worst.owner} | ${x.shot ? '`' + x.shot + '`' : '—'} |`); });
    fs.writeFileSync(path.join(OUT, 'summary' + sfx + '.md'), md.join('\n') + '\n');
    fs.writeFileSync(path.join(OUT, 'groups' + sfx + '.json'), JSON.stringify(gl.map(x => ({ kind: x.worst.kind, view: x.worst.r.view, vp: x.worst.r.vp, runs: x.l.length, pages: [...new Set(x.l.map(f => f.r.page))], themes: [...new Set(x.l.map(f => f.r.theme))], worst: x.worst.value, budget: x.worst.budget, owner: x.worst.owner, of: results.filter(r => r.view === x.worst.r.view && r.vp === x.worst.r.vp).length, worstPage: x.worst.r.page, worstTheme: x.worst.r.theme, shot: x.shot || null })), null, 1));
    console.log('wrote', path.relative(OUTROOT, OUT), results.length, 'runs,', gl.reduce((n, x) => n + x.l.length, 0), 'flags,', gl.length, 'groups', final ? '' : '(partial)');
  }
}
