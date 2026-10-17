#!/usr/bin/env node
/**
 * Beta QA — B-25: overlay and chrome budget gate (owner directive 2026-10-16; docs/BETA-OVERLAY-LEDGER.md). QA lane.
 * Measures, in real Chromium, every layer that stays put while the content under it moves, as the ledger defines it:
 *   pages  the five pilots + Singapore/punggol.html (the owner's screenshot)
 *   views  Atlas, Gallery, Guidebook, place sheet (#p=<first place>)
 *   vps    390×844 phone (P1), 390×664 with browser chrome (P2), 844×390 landscape (L), 768×1024 tablet (T1),
 *          1024×768 tablet landscape (T2), 1440×900 desktop (D) — the OV-00 classes
 *   themes light, dark       states  at load, then after a map pan (Atlas) or a scroll (other views)
 * Per cell:
 *   chrome %     rows of the viewport whose hit (median of 3 columns) is a fixed/sticky layer, split top / bottom
 *   clear map %  (map views) grid points over the map pane whose hit is the map itself or a pin label (not a control,
 *                not chrome), as a % of the visible pane
 *   labels       union of label pills over the visible pane (%); the widest label as a % of the pane width;
 *                label↔label and label↔control overlaps
 *   collisions   visible fixed controls (and map controls) overlapping each other
 *   "Search this area" visible at load (first screen)
 * Verdict (B-25): a pin FAILS when (a) any OPEN ledger row is High or Med severity, or (b) once OV-00 sets budgets, any
 * cell is over budget. Until OV-00 lands (and the ledger carries a severity), B-25 is WARN (GATES.OVERLAY in
 * default-view.js; env QA_GATE_OVERLAY=fail). Measurements are always written.
 * Usage (from tools/): node beta/qa/overlay.js [--pages tokyo,punggol] [--vps phone,desktop] [--quick]
 *   --quick = light theme only, load + one move. Output: design/beta/eval/w7/qa/overlay/{overlay.json,overlay.md,*.jpg}
 */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
let chromium; for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright']) { try { ({ chromium } = require(t)); break; } catch (e) { /* next */ } }
const { GATES } = require('./default-view');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const OUT = path.join(ROOT, 'design', 'beta', 'eval', 'w7', 'qa', 'overlay');
const argv = process.argv.slice(2), opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const ALL_PAGES = ['cleveland.html', 'cities/tokyo.html', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html', 'Singapore/punggol.html'];
const PAGES = opt('--pages') ? ALL_PAGES.filter(p => opt('--pages').split(',').some(k => p.includes(k))) : ALL_PAGES;
const ALL_VPS = {
  phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  'phone-chrome': { viewport: { width: 390, height: 664 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  landscape: { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  tablet: { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  'tablet-land': { viewport: { width: 1024, height: 768 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  desktop: { viewport: { width: 1440, height: 900 } },
};
const VPS = opt('--vps') ? opt('--vps').split(',') : Object.keys(ALL_VPS);
const QUICK = argv.includes('--quick');
const THEMES = QUICK ? ['light'] : ['light', 'dark'];
const VIEWS = ['atlas', 'gallery', 'guidebook', 'sheet'];
// OV-00 budgets: null until the designer sets them in the ledger (then copy them here, one line each, and cite the SHA)
// OV-00, set by the designer at bb2af8732 (atlas/SPEC-v3 §2.0, DESIGN-SYSTEM §v2.12); the same numbers QC's S-17 grades with
// (tools/beta/qa/qc-overlay.js ATLAS / OTHER). Viewport classes: P1 390×844, P2 390×664, L 844×390, T1 768×1024, T2 1024×768, D 1440×900.
const VK = { phone: 'P1', 'phone-chrome': 'P2', landscape: 'L', tablet: 'T1', 'tablet-land': 'T2', desktop: 'D' };
const BUDGETS = {
  // Atlas: [chrome at rest %, chrome while panning %, clear map at rest %, clear map while panning %, label count, label cover %]
  ATLAS: { P1: [25, 8, 72, 90, 8, 8], P2: [32, 10, 64, 87, 7, 8], L: [13, 13, 80, 80, 10, 8], T1: [18, 8, 78, 90, 12, 7], T2: [15, 15, 90, 90, 16, 6], D: [12, 12, 92, 92, 16, 6] },
  // other views: [chrome at rest %, chrome after a 600 px scroll %]
  OTHER: { P1: [13, 7], P2: [16, 8], L: [13, 13], T1: [11, 6], T2: [8, 8], D: [8, 8] },
  PHONE: { P1: 1, P2: 1, L: 1, T1: 1 },   // clear map as % of the viewport on these; % of the map pane on T2 / D
  LABEL_W_PHONE: 40, LABEL_PX_DESKTOP: 220, LABEL_GAP: 4,
};

const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

/* eslint-disable no-undef */
const MEASURE = () => {
  const vw = innerWidth, vh = innerHeight, norm = t => (t || '').trim().replace(/\s+/g, ' ');
  const dlg = [...document.querySelectorAll('[role=dialog]')].find(d => d.offsetParent && !d.hidden);
  const map = document.querySelector('.leaflet-container');
  const posOf = el => { for (let e = el; e && e !== document.body && e !== document.documentElement; e = e.parentElement) { const p = getComputedStyle(e).position; if (p === 'fixed' || p === 'sticky') return e; } return null; };
  const isLabel = el => !!(el && el.closest && el.closest('.leaflet-marker-icon'));
  const isMapCtl = el => !!(el && el.closest && el.closest('.leaflet-control, .leaflet-control-container'));
  // chrome = a fixed/sticky layer that is not the content: the map (and its panes) is content in Atlas; the open sheet's
  // scrolling body is content in the sheet view (its own sticky header / action bar count as chrome)
  const chromeAt = (x, y) => {
    const t = document.elementFromPoint(x, y); if (!t) return false;
    if (map && map.contains(t) && !isMapCtl(t)) return false;
    if (isMapCtl(t)) return true;
    const f = posOf(t); if (!f) return false;
    if (dlg && dlg.contains(t)) return dlg.contains(f) && f !== dlg;   // in the sheet: only its own sticky bars are chrome
    if (dlg && f.contains(dlg)) return false;                          // the scrim around the sheet is not chrome
    return true;
  };
  const cols = [0.25, 0.5, 0.75].map(f => Math.round(vw * f));
  let top = 0, bottom = 0, rows = 0, mid = false;
  const rowChrome = [];
  for (let y = 1; y < vh; y += 3) { const c = cols.map(x => chromeAt(x, y)).filter(Boolean).length >= 2; rowChrome.push(c); rows++; }
  // top band = leading run of chrome rows, bottom band = trailing run; anything else counts as mid (floating)
  let i = 0; while (i < rowChrome.length && rowChrome[i]) { top++; i++; }
  let j = rowChrome.length - 1; while (j > i && rowChrome[j]) { bottom++; j--; }
  for (let k = i; k <= j; k++) if (rowChrome[k]) mid = true;
  const out = { view: document.documentElement.getAttribute('data-view'), sheet: !!dlg, vw, vh,
    chromePct: Math.round(100 * (top + bottom) / rows), topPct: Math.round(100 * top / rows), bottomPct: Math.round(100 * bottom / rows), midChrome: mid };
  // map: clear area, label coverage, widest label, overlaps
  if (map && !dlg && getComputedStyle(map).visibility !== 'hidden') {
    const r = map.getBoundingClientRect(), L = Math.max(0, r.left), R = Math.min(vw, r.right), Tp = Math.max(0, r.top), B = Math.min(vh, r.bottom);
    if (R - L > 40 && B - Tp > 40) {
      const labels = [...document.querySelectorAll('.leaflet-marker-icon.pp')].map(p => (p.firstElementChild || p).getBoundingClientRect()).filter(b => b.width > 0 && b.right > L && b.left < R && b.bottom > Tp && b.top < B);
      let n = 0, clear = 0, lab = 0;
      for (let y = Tp + 2; y < B; y += 8) for (let x = L + 2; x < R; x += 8) {
        n++; const t = document.elementFromPoint(x, y);
        if (t && map.contains(t) && !isMapCtl(t)) clear++;
        if (labels.some(b => x >= b.left && x <= b.right && y >= b.top && y <= b.bottom)) lab++;
      }
      const ov = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      let ll = 0; for (let a = 0; a < labels.length; a++) for (let b = a + 1; b < labels.length; b++) if (ov(labels[a], labels[b]) > 4) ll++;
      const ctls = [...document.querySelectorAll('button, a[href], [role=button]')].filter(c => { const b = c.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.right > 0 && b.left < vw && b.bottom > 0 && b.top < vh && (posOf(c) || isMapCtl(c)) && !isLabel(c) && getComputedStyle(c).visibility !== 'hidden'; }).map(c => c.getBoundingClientRect());
      let lc = 0; for (const a of labels) for (const c of ctls) if (ov(a, c) > 4) lc++;
      let nv = 0, cv = 0; for (let y = 2; y < vh; y += 8) for (let x = 2; x < vw; x += 8) { nv++; const t = document.elementFromPoint(x, y); if (t && map.contains(t) && !isMapCtl(t)) cv++; }
      const near = (a, b) => !(a.right + 4 <= b.left || b.right + 4 <= a.left || a.bottom + 4 <= b.top || b.bottom + 4 <= a.top);
      let lg = 0; for (let a = 0; a < labels.length; a++) for (let b = a + 1; b < labels.length; b++) if (near(labels[a], labels[b])) lg++;
      Object.assign(out, { clearVP: nv ? Math.round(100 * cv / nv) : null, labelGap: lg, labelMaxPx: labels.length ? Math.round(Math.max(...labels.map(b => b.width))) : 0 });
      Object.assign(out, { mapPaneVisPct: Math.round(100 * (B - Tp) * (R - L) / (vw * vh)), clearMapPct: n ? Math.round(100 * clear / n) : null, labelPct: n ? Math.round(100 * lab / n) : null,
        widestLabelPct: labels.length ? Math.round(100 * Math.max(...labels.map(b => b.width)) / (R - L)) : 0, labels: labels.length, labelOverlaps: ll, labelOverControl: lc });
    }
  }
  // control collisions: controls that live in a chrome layer (a fixed/sticky layer that is not the content: not the open
  // sheet itself nor its scrim) or map controls, overlapping each other. Content scrolling under a sticky bar is not a
  // collision, and nothing behind an open sheet counts.
  const layerOf = c => { const f = posOf(c); if (!f) return null; if (dlg && (f === dlg || f.contains(dlg))) return null; return f; };
  const C = [...document.querySelectorAll('button, a[href], [role=button], input:not([type=hidden])')].filter(c => { const b = c.getBoundingClientRect(); return b.width > 1 && b.height > 1 && b.right > 0 && b.left < vw && b.bottom > 0 && b.top < vh && (layerOf(c) || isMapCtl(c)) && (!dlg || dlg.contains(c)) && !isLabel(c) && getComputedStyle(c).visibility !== 'hidden' && !c.closest('[hidden]'); });
  const coll = [];
  for (let a = 0; a < C.length; a++) for (let b = a + 1; b < C.length; b++) {
    if (C[a].contains(C[b]) || C[b].contains(C[a])) continue;
    const p = C[a].getBoundingClientRect(), q = C[b].getBoundingClientRect();
    const o = Math.max(0, Math.min(p.right, q.right) - Math.max(p.left, q.left)) * Math.max(0, Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top));
    if (o > 16) { const top1 = document.elementFromPoint((Math.max(p.left, q.left) + Math.min(p.right, q.right)) / 2, (Math.max(p.top, q.top) + Math.min(p.bottom, q.bottom)) / 2);
      if (top1 && (C[a].contains(top1) || C[b].contains(top1))) coll.push(norm(C[a].getAttribute('aria-label') || C[a].textContent).slice(0, 20) + ' × ' + norm(C[b].getAttribute('aria-label') || C[b].textContent).slice(0, 20)); }
  }
  out.collisions = coll.length; out.collisionEg = coll.slice(0, 4);
  out.searchThisArea = [...document.querySelectorAll('button, a, [role=button], div, span')].some(e => e.childElementCount <= 2 && /search this area/i.test(e.textContent || '') && (b => b.width > 0 && b.bottom > 0 && b.top < vh && b.right > 0 && b.left < vw)(e.getBoundingClientRect()) && getComputedStyle(e).visibility !== 'hidden' && !e.closest('[hidden]'));
  return out;
};

function ledger() {
  const f = path.join(ROOT, 'docs', 'BETA-OVERLAY-LEDGER.md'); if (!fs.existsSync(f)) return { rows: [], severity: false };
  const lines = fs.readFileSync(f, 'utf8').split('\n'), hdr = lines.find(l => /^\|\s*Id\s*\|/.test(l)); if (!hdr) return { rows: [], severity: false };
  const H = hdr.split('|').map(s => s.trim().toLowerCase()), si = H.findIndex(h => /sever/.test(h)), st = H.findIndex(h => /status/.test(h));
  const rows = lines.filter(l => /^\|\s*OV-\d+/.test(l)).map(l => { const c = l.split('|').map(s => s.trim()); return { id: c[1], severity: si > 0 ? c[si] : null, status: st > 0 ? c[st] : '' }; });
  return { rows, severity: si > 0 };
}

const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });

srv.listen(0, '127.0.0.1', async () => {
  const origin = 'http://127.0.0.1:' + srv.address().port, b = await chromium.launch(); fs.mkdirSync(OUT, { recursive: true });
  const cells = [];
  for (const rel of PAGES) {
    if (!fs.existsSync(path.join(ROOT, 'beta', rel))) { console.log('  skip (not built):', rel); continue; }
    const pjs = [path.basename(rel, '.html'), path.dirname(rel).toLowerCase() + '--' + path.basename(rel, '.html')].map(k => path.join(ROOT, 'beta', 'data', 'places', k + '.json'));
    const pj = pjs.find(f => fs.existsSync(f)) || pjs[0];
    const first = fs.existsSync(pj) ? (JSON.parse(fs.readFileSync(pj, 'utf8')).places || [])[0] : null;
    for (const vp of VPS) for (const theme of THEMES) for (const view of VIEWS) {
      if (view === 'sheet' && !first) continue;
      const hash = view === 'sheet' ? '#view=atlas&p=' + encodeURIComponent(first.id) : '#view=' + view;
      const ctx = await b.newContext({ ...ALL_VPS[vp], colorScheme: theme, reducedMotion: 'reduce', serviceWorkers: 'block' }), p = await ctx.newPage();
      await p.route('**/*', r => { const u = r.request().url(); if (u.startsWith(origin)) return r.continue(); if (r.request().resourceType() === 'image') return r.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }); return r.abort(); });
      const errs = []; p.on('pageerror', e => errs.push(String(e.message || e).slice(0, 120)));
      const cell = { page: rel, vp, theme, view, states: {} };
      try {
        await p.goto(origin + '/beta/' + rel + hash, { waitUntil: 'load', timeout: 45000 });
        await p.waitForTimeout(2000);
        cell.states.load = await p.evaluate(MEASURE);
        if (vp === 'phone' && (view === 'atlas' || view === 'sheet')) await p.screenshot({ path: path.join(OUT, `${rel.replace(/\W+/g, '_')}-${vp}-${theme}-${view}-load.jpg`), type: 'jpeg', quality: 55 });
        // move: drag the map (Atlas) or scroll the content (others), then measure while it is held and once idle
        const vsz = ALL_VPS[vp].viewport;
        if (view === 'atlas') { const cx = vsz.width / 2, cy = vsz.height * 0.55; await p.mouse.move(cx, cy); await p.mouse.down(); for (let k = 1; k <= 8; k++) await p.mouse.move(cx - k * 12, cy - k * 10); cell.states.panning = await p.evaluate(MEASURE); await p.mouse.up(); }
        else if (view === 'sheet') { await p.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].find(x => x.offsetParent); const s = d && ([d, ...d.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(e).overflowY))); if (s) s.scrollTop += 500; }); }
        else { await p.mouse.wheel(0, 600); await p.evaluate(() => scrollBy(0, 1)); }
        await p.waitForTimeout(900);
        cell.states.moved = await p.evaluate(MEASURE);
      } catch (e) { cell.err = String(e.message || e).slice(0, 160); }
      cell.errors = errs.slice(0, 2);
      cells.push(cell); await ctx.close();
      const L = cell.states.load || {}, M = cell.states.moved || {};
      console.log(`  ${rel} ${vp} ${theme} ${view}: chrome ${L.chromePct}% (top ${L.topPct}, bottom ${L.bottomPct}${L.midChrome ? ', floating' : ''}) → moved ${M.chromePct}%` + (L.clearMapPct != null ? ` · clear map ${L.clearMapPct}% · labels ${L.labelPct}% widest ${L.widestLabelPct}%` : '') + ` · collisions ${L.collisions}${L.searchThisArea ? ' · "Search this area" on load' : ''}${cell.err ? ' · ERR ' + cell.err : ''}`);
    }
  }
  await b.close(); srv.close();
  // verdict
  const lg = ledger(), openHM = lg.rows.filter(r => !/verified|closed|won't fix/i.test(r.status) && /^(high|med)/i.test(r.severity || ''));
  const over = [];
  if (BUDGETS) for (const c of cells) {
    const v = VK[c.vp], L = c.states.load, M = c.states.moved, P = c.states.panning, at = `${c.page} ${c.vp} ${c.theme} ${c.view}`;
    if (!v || !L) continue;
    if (c.view === 'atlas' && L.clearMapPct != null) {
      const [cr, cp, kr, kp, lc, lv] = BUDGETS.ATLAS[v], clear = x => x && (BUDGETS.PHONE[v] ? x.clearVP : x.clearMapPct);
      if (L.chromePct > cr) over.push(`${at}: chrome at rest ${L.chromePct}% > ${cr}`);
      if (P && P.chromePct > cp) over.push(`${at}: chrome while panning ${P.chromePct}% > ${cp}`);
      if (clear(L) < kr) over.push(`${at}: clear map ${clear(L)}% < ${kr}`);
      if (P && clear(P) < kp) over.push(`${at}: clear map while panning ${clear(P)}% < ${kp}`);
      if (L.labels > lc) over.push(`${at}: ${L.labels} labels > ${lc}`);
      if (L.labelPct > lv) over.push(`${at}: labels cover ${L.labelPct}% > ${lv}`);
      if (BUDGETS.PHONE[v] ? L.widestLabelPct > BUDGETS.LABEL_W_PHONE : L.labelMaxPx > BUDGETS.LABEL_PX_DESKTOP) over.push(`${at}: widest label ${BUDGETS.PHONE[v] ? L.widestLabelPct + '% of the map width > 40' : L.labelMaxPx + ' px > 220'}`);
      if (L.labelGap) over.push(`${at}: ${L.labelGap} label pairs < 4 px apart`);
    } else if (c.view !== 'sheet') {
      const [cr, cs] = BUDGETS.OTHER[v];
      if (L.chromePct > cr) over.push(`${at}: chrome at rest ${L.chromePct}% > ${cr}`);
      if (M && M.chromePct > cs) over.push(`${at}: chrome after a scroll ${M.chromePct}% > ${cs}`);
    }
  }
  const sta = cells.filter(c => c.states.load && c.states.load.searchThisArea).map(c => `${c.page} ${c.vp} ${c.theme} ${c.view}`);
  const coll = cells.filter(c => c.states.load && c.states.load.collisions).map(c => `${c.page} ${c.vp} ${c.theme} ${c.view}: ${c.states.load.collisionEg.join('; ')}`);
  // not gradable until OV-00 sets budgets and the ledger carries a severity: WARN, never PASS
  const ready = !!BUDGETS && lg.severity, failing = openHM.length > 0 || over.length > 0 || sta.length > 0 || coll.length > 0;
  const verdict = !ready ? 'WARN' : !failing ? 'PASS' : GATES.OVERLAY === 'fail' ? 'FAIL' : 'WARN';
  const R = { verdict, gate: GATES.OVERLAY, budgetsSet: !!BUDGETS, ledgerHasSeverity: lg.severity, openHighMed: openHM.map(r => r.id), overBudget: over, searchThisAreaOnLoad: sta, collisions: coll, cells };
  fs.writeFileSync(path.join(OUT, 'overlay.json'), JSON.stringify(R, null, 1));
  const md = [`# B-25 overlay and chrome · ${verdict}`, '', `gate ${GATES.OVERLAY} · OV-00 budgets ${BUDGETS ? 'set' : 'not set yet'} · ledger severity column ${lg.severity ? 'present' : 'absent'}`, '',
    `- open High/Med ledger rows: ${openHM.length ? openHM.map(r => r.id).join(', ') : lg.severity ? 'none' : '(no severity column yet)'}`,
    `- over budget: ${BUDGETS ? over.length : 'n/a (OV-00 pending)'}`, `- "Search this area" on the first screen: ${sta.length}${sta.length ? ' — ' + sta.slice(0, 6).join('; ') : ''}`,
    `- control collisions at load: ${coll.length}${coll.length ? ' — ' + coll.slice(0, 6).join(' | ') : ''}`, '',
    '| page | vp | theme | view | chrome load → moved (top/bottom) | clear map | labels / widest | collisions |', '|---|---|---|---|---|---|---|---|',
    ...cells.map(c => { const L = c.states.load || {}, M = c.states.moved || {}; return `| ${c.page} | ${c.vp} | ${c.theme} | ${c.view} | ${L.chromePct}% (${L.topPct}/${L.bottomPct}${L.midChrome ? ' +float' : ''}) → ${M.chromePct}%${c.states.panning ? ' (panning ' + c.states.panning.chromePct + '%)' : ''} | ${L.clearMapPct == null ? '—' : L.clearMapPct + '%'} | ${L.labelPct == null ? '—' : L.labelPct + '% / ' + L.widestLabelPct + '%'} | ${L.collisions || 0} |`; })];
  fs.writeFileSync(path.join(OUT, 'overlay.md'), md.join('\n') + '\n');
  console.log(`\n>>> B-25 ${verdict} (gate ${GATES.OVERLAY}; OV-00 ${BUDGETS ? 'set' : 'pending'}; ledger severity ${lg.severity ? 'yes' : 'no'}) · ${cells.length} cells · open High/Med ${openHM.length} · over budget ${over.length} · "Search this area" ${sta.length} · collisions ${coll.length} → ${path.relative(ROOT, OUT)}/overlay.{json,md}`);
});
