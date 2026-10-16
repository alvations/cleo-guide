#!/usr/bin/env node
/**
 * Beta QC: melon-seek pattern audit, experience journeys and the UI sweep (docs/BETA-QC.md § Checklist). QC lane.
 *
 * Real Chromium (preinstalled; never `playwright install`). beta/ is served from disk; OSM / Esri tiles are stubbed
 * with a 1×1 PNG; every other off-origin request is aborted; service workers are blocked so every load is cold.
 * Ground truth comes from beta/data/places/<page>.json, never from the page under test.
 *
 *   A  patterns  P-01…P-28  pilot city pages × 390 / 1440, light
 *   B  journeys  J-01…J-11  pilots + landing + Japan hub × 390 / 1440 × light / dark (success, steps, friction)
 *   C  sweep     S-01…S-15  every page of beta/data/manifest.json × 390 / 768 / 1024 / 1440 light + 390 / 1440 dark
 *
 * Usage (from tools/):  NODE_PATH=$(npm root -g) node beta/qa/qc.js [--label <sha>] [--only patterns,journeys,sweep]
 *                       [--pages tokyo,cleveland] [--vps 390,1440] [--themes light,dark] [--jobs 4] [--list]
 * Output: design/beta/eval/qc/<label>/qc.json + summary.md + shots/*.jpg
 * The harness only measures. It never edits product files and exits 0 whatever it finds (the pass is the record).
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const has = n => argv.includes(n);
let sha = 'working';
try { sha = execFileSync('git', ['rev-parse', '--short=8', 'HEAD'], { cwd: ROOT }).toString().trim(); } catch (e) { /* not a repo */ }
const LABEL = opt('--label', sha);
const OUT = path.join(ROOT, 'design', 'beta', 'eval', 'qc', LABEL);
const SHOTS = path.join(OUT, 'shots');
const ONLY = opt('--only', 'patterns,journeys,sweep').split(',').filter(Boolean);
const PAGE_FILTER = opt('--pages', '').split(',').filter(Boolean);
const THEMES = opt('--themes', 'light,dark').split(',').filter(Boolean);
const JOBS = +opt('--jobs', '4');

// ---------------------------------------------------------------- the checklist (ids match docs/BETA-QC.md)
const CHECKS = {
  'P-01': 'Segmented view switcher', 'P-02': 'Switcher switches', 'P-03': 'Switch focus and announce',
  'P-04': 'Defaults omitted from the hash', 'P-05': 'Enums validated (garbage degrades safely)', 'P-06': 'Garbage p= is harmless',
  'P-07': 'Round trip: view', 'P-08': 'Round trip: lens', 'P-09': 'Round trip: place', 'P-10': 'Round trip: map view',
  'P-11': 'Round trip: page', 'P-12': 'Share writes view= and the place', 'P-13': 'One record set (every view reaches N)',
  'P-14': 'Counts agree across views', 'P-15': 'One summary line per view', 'P-16': 'Numbered or clustered pins',
  'P-17': 'No-place badge', 'P-18': 'Charts as filters', 'P-19': 'Chart table', 'P-20': 'Every chart accounts for all records',
  'P-21': 'Drawer n of N', 'P-22': 'Drawer prev / next', 'P-23': 'Pages, numbers, all N, show-all', 'P-24': 'No silent caps',
  'P-25': 'No value-led ranking', 'P-26': 'No invented data', 'P-27': 'Lens yields to a deep link', 'P-28': 'Show all N clears every lens',
  'J-01': 'Discover → shortlist → plan a day → share → reopen', 'J-01h': 'Discover from a hub', 'J-02': 'Best food near X',
  'J-03': 'Is it still open? (closure honesty)', 'J-04': 'Who recommends this and why?', 'J-05': 'Switch views without losing context',
  'J-06': 'Back and Forward', 'J-07': 'Keyboard only', 'J-08': '200 % zoom', 'J-09': 'Reduced motion', 'J-10': 'Map library blocked',
  'J-11': 'Storage blocked',
  'S-01': 'Token discipline (static census)', 'S-02': 'Token discipline (runtime inline styles)', 'S-03': 'Spacing rhythm',
  'S-04': 'Alignment', 'S-05': 'Component states', 'S-06': 'Truncation and clipping', 'S-07': 'Widows and orphans',
  'S-08': 'Sentence case', 'S-09': 'Credits visible', 'S-10': '44 px targets', 'S-11': 'AA contrast', 'S-12': 'No layout shift on load',
  'S-13': 'No horizontal overflow', 'S-14': 'No errors', 'S-15': 'Focus visible',
};
if (has('--list')) { Object.entries(CHECKS).forEach(([k, v]) => console.log(k.padEnd(6), v)); console.log(Object.keys(CHECKS).length + ' checks'); process.exit(0); }

// ---------------------------------------------------------------- pages and ground truth
const MANIFEST = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'manifest.json'), 'utf8')).pages;
const JSON_BY_BETA = {};
for (const f of fs.readdirSync(path.join(BETA, 'data', 'places'))) {
  if (!f.endsWith('.json')) continue;
  try { const d = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'places', f), 'utf8')); if (d.beta) JSON_BY_BETA[d.beta] = d; } catch (e) { /* skip */ }
}
const PILOTS = ['cities/tokyo.html', 'cleveland.html', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html'];
const HUBS = ['index.html', 'Japan/index.html'];
const pick = list => PAGE_FILTER.length ? list.filter(p => PAGE_FILTER.some(k => p.includes(k))) : list;
const truth = rel => {
  const d = JSON_BY_BETA[rel]; if (!d) return null;
  const P = d.places, closed = p => (p.pv && p.pv.status) === 'closed';
  const areaName = {}; (d.areas || []).forEach(a => { areaName[a.id] = a.n; });
  return {
    d, N: P.length, P, closed: P.filter(closed), areaName, areas: (d.areas || []).map(a => a.id),
    unpinned: P.filter(p => p.la == null || p.ln == null || (p.pv && p.pv.pin === 'low')),
    count(l) { // the lens predicate of SPEC §2.2, computed from the build's JSON (q= is measured in-page)
      return P.filter(p => (!l.mode || (l.mode === 'food' ? p.kind === 'food' : p.kind !== 'food')) && (!l.a || p.a === l.a)
        && (!l.t || (!closed(p) && String(p.t) === String(l.t))) && (!l.closed || closed(p)) && (!l.c || (p.g || []).includes(l.c))
        && (!l.cz || (p.cz || []).includes(l.cz)) && (!l.src || (p.src || []).includes(l.src))).length;
    },
    isClosed: closed,
  };
};

// ---------------------------------------------------------------- rig
function loadPlaywright() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) {
    try { return require(t); } catch (e) { /* next */ }
  }
  throw new Error('playwright not found: run with NODE_PATH=$(npm root -g)');
}
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain' };
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
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const TILE_HOST = /(^|\.)tile\.openstreetmap\.org$|(^|\.)arcgisonline\.com$/;
const BLOCKED_NET = /net::ERR_|Failed to load resource|ERR_BLOCKED|ERR_FAILED/;
const VP = {
  390: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  768: { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  1024: { viewport: { width: 1024, height: 768 }, deviceScaleFactor: 1 },
  1440: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  zoom200: { viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 },   // 1440×900 at 200 % zoom
};
const NO_STORAGE = () => {
  for (const k of ['localStorage', 'sessionStorage']) {
    try { Object.defineProperty(window, k, { configurable: true, get() { throw new DOMException('blocked', 'SecurityError'); } }); } catch (e) { /* ignore */ }
  }
};
const PREF = v => { try { localStorage.setItem('cleo:v1:view', JSON.stringify(v)); } catch (e) { /* ignore */ } };
const SHARE_STUB = () => {
  window.__shared = [];
  const cap = d => { window.__shared.push(typeof d === 'string' ? d : (d && d.url) || ''); return Promise.resolve(); };
  try { Object.defineProperty(navigator, 'share', { configurable: true, value: cap }); } catch (e) { /* ignore */ }
  try { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: cap } }); } catch (e) { /* ignore */ }
  window.prompt = (m, v) => { cap(v); return null; };
};
const CLS = () => {
  window.__cls = 0; window.__shifts = [];
  try {
    new PerformanceObserver(l => l.getEntries().forEach(e => {
      if (e.hadRecentInput) return; window.__cls += e.value;
      if (e.value > 0.005) window.__shifts.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime),
        n: (e.sources || []).slice(0, 3).map(s => s.node ? (s.node.id ? '#' + s.node.id : (s.node.className && s.node.className.baseVal === undefined ? '.' + String(s.node.className).split(' ')[0] : s.node.nodeName)) : '?') });
    })).observe({ type: 'layout-shift', buffered: true });
  } catch (e) { /* ignore */ }
};

let browser, base;
async function open(rel, vp, o = {}) {
  const ctx = await browser.newContext({ ...VP[vp], serviceWorkers: 'block', colorScheme: o.theme || 'light',
    reducedMotion: o.motion || 'no-preference' });
  await ctx.addInitScript(SHARE_STUB);
  await ctx.addInitScript(CLS);
  if (o.noStorage) await ctx.addInitScript(NO_STORAGE);
  if (o.pref) await ctx.addInitScript(PREF, o.pref);
  const page = await ctx.newPage();
  const st = { errors: [] };
  const origin = new URL(base).origin;
  await ctx.route('**/*', async route => {
    const u = route.request().url(), t = route.request().resourceType();
    if (o.route) { const r = await o.route(route, u); if (r) return; }
    if (o.hard && (/leaflet/i.test(u) || t === 'font')) return route.abort('blockedbyclient');
    if (u.startsWith(origin) || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    let host = ''; try { host = new URL(u).hostname; } catch (e) { /* ignore */ }
    if (!o.hard && TILE_HOST.test(host)) return route.fulfill({ status: 200, contentType: 'image/png', body: PNG1 });
    return route.abort('blockedbyclient');
  });
  page.on('pageerror', e => st.errors.push('pageerror: ' + String(e.message || e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error' && !BLOCKED_NET.test(m.text())) st.errors.push(m.text().slice(0, 200)); });
  page.on('dialog', d => d.accept().catch(() => {}));
  try {
    await page.goto(base + 'beta/' + rel + (o.hash || ''), { waitUntil: 'load', timeout: 45000 });
  } catch (e) { st.errors.push('goto: ' + e.message.slice(0, 160)); }
  await page.waitForTimeout(o.settle || 700);
  return { ctx, page, st };
}
const slug = s => String(s).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
async function shot(page, name) {
  fs.mkdirSync(SHOTS, { recursive: true });
  const f = path.join(SHOTS, slug(name) + '.jpg');
  await page.screenshot({ path: f, type: 'jpeg', quality: 55, scale: 'css' }).catch(() => {});
  return path.relative(ROOT, f);
}
const pageKey = rel => rel.replace(/\.html$/, '').replace(/^cities\//, '').replace(/\/index$/, '-hub').replace(/\//g, '-');

// ---------------------------------------------------------------- results
const R = { label: LABEL, sha, started: new Date().toISOString(), rig: 'chromium; tiles stubbed 1×1; off-origin aborted; SW blocked', checks: [], journeys: [], census: {} };
function check(id, ctx, status, evidence) {
  R.checks.push({ id, title: CHECKS[id], group: id[0], ...ctx, status, evidence });
  if (status !== 'PASS' || has('--verbose')) {
    console.log(`  ${status.padEnd(7)} ${id.padEnd(6)} ${ctx.page || ''} ${ctx.vp || ''} ${ctx.theme || ''} ` + (evidence !== undefined ? JSON.stringify(evidence).slice(0, 240) : ''));
  }
}
const ok = (b, warn) => b ? 'PASS' : (warn ? 'WARN' : 'FAIL');

// ---------------------------------------------------------------- in-page probes (run via page.evaluate)
const P_VIS = `const vis = e => { if (!e || !e.getClientRects().length) return false; if (e.closest('[hidden],[aria-hidden=true]')) return false;
  const s = getComputedStyle(e); if (s.visibility === 'hidden' || +s.opacity === 0) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };`;
const STATE = new Function(`${P_VIS}
  const btns = [...document.querySelectorAll('[data-cleo-views] button[data-view]')];
  const nav = document.querySelector('nav[data-cleo-views], [data-cleo-views]');
  const sheet = [...document.querySelectorAll('[role=dialog]')].find(d => vis(d) && d.querySelector('[data-sh-pos]'));
  const pos = sheet && sheet.querySelector('[data-sh-pos]');
  return { view: document.documentElement.getAttribute('data-view'), hash: location.hash, href: location.href,
    route: window.Cleo && Cleo.route ? Cleo.route.parse() : null,
    nav: nav ? { vis: vis(nav), role: nav.getAttribute('role') || (nav.querySelector('[role=group]') ? 'group' : null), label: nav.getAttribute('aria-label'),
      labels: btns.filter(vis).map(b => b.textContent.trim()), pressed: btns.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.getAttribute('data-view')),
      h: btns.filter(vis).map(b => Math.round(b.getBoundingClientRect().height)) } : null,
    sheet: sheet ? { title: ((sheet.querySelector('h1,h2,#sh-t') || {}).textContent || '').trim().slice(0, 90), pos: pos ? pos.textContent.replace(/\\s+/g, ' ').trim() : null,
      text: sheet.innerText.slice(0, 4000) } : null,
    saved: window.Cleo && Cleo.saved ? Cleo.saved.count() : null, scrollY: Math.round(scrollY), histLen: history.length };`);
const EXPAND = new Function(`if (window.Cleo && Cleo.defer && Cleo.defer.all) Cleo.defer.all(); return true;`);
// every record id this view lets you reach right now, after stamping deferred content
const REACH = new Function('view', `${P_VIS}
  if (window.Cleo && Cleo.defer && Cleo.defer.all) Cleo.defer.all();
  const ids = new Set(); const host = view === 'guidebook' ? '.ge[data-id]' : view === 'insights' ? '.ixi[data-id]' : 'li.pl[id]';
  document.querySelectorAll(host).forEach(e => { if (vis(e) || (view !== 'gallery' && view !== 'atlas' && !e.closest('[hidden]'))) ids.add(e.getAttribute('data-id') || e.id.replace(/^p-/, '')); });
  return [...ids];`);
// computed summary / count lines in the visible page (footer, sheet and tray excluded)
const COUNTS = new Function(`${P_VIS}
  const RX = [[/\\bShowing\\s+[\\d,]+\\s*[–-]\\s*[\\d,]+\\s+of\\s+([\\d,]+)/i, 'range'], [/\\b([\\d,]+) of (?:all )?([\\d,]+) places?\\b/i, 'nOfN'],
    [/^\\s*All ([\\d,]+) places?\\b/i, 'all'], [/\\bShowing all ([\\d,]+) places?\\b/i, 'all'], [/\\b([\\d,]+) places? in this (?:map )?area\\b/i, 'mapArea'], [/\\b([\\d,]+) of ([\\d,]+) in this\\b/i, 'pos']];
  const out = []; const seen = new Set();
  document.querySelectorAll('main *, header *, [data-cleo-views] ~ *').forEach(e => { if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|svg)$/i.test(e.tagName)) return;
    if (!vis(e) || e.closest('footer,[role=dialog],li.pl,.gc,.ge,.ixi,svg')) return;
    const t = (e.innerText || '').replace(/\\s+/g, ' ').trim(); if (!t || t.length > 220) return;
    for (const [rx, kind] of RX) { const m = rx.exec(t); if (!m) continue;
      if ([...e.children].some(c => vis(c) && rx.test((c.innerText || '').replace(/\\s+/g, ' ')))) continue;   // deepest match only
      const k = kind + '|' + t; if (seen.has(k)) continue; seen.add(k);
      const n = +String(m[1]).replace(/,/g, ''), tot = m[2] ? +String(m[2]).replace(/,/g, '') : null;
      out.push({ kind, n, total: kind === 'all' ? n : tot, text: t.slice(0, 140), cls: String(e.className || e.tagName).slice(0, 40) }); break; }
  });
  return out;`);
// the product's own lens applied to every record (after stamping): what the page believes the lens holds
const LENSCOUNT = () => { if (!window.Cleo || !Cleo.lens) return null; if (Cleo.defer && Cleo.defer.all) Cleo.defer.all();
  const l = Cleo.lens.pick(Cleo.route.parse()); return [...document.querySelectorAll('li.pl')].filter(e => Cleo.lens.match(e, l)).length; };
const SCAN_TEXT = new Function(`${P_VIS}
  const main = document.querySelector('main') || document.body; return main.innerText;`);

// ---------------------------------------------------------------- A. patterns
const VIEWS = ['gallery', 'atlas', 'guidebook', 'insights'];
const LABELS = ['Gallery', 'Atlas', 'Guidebook', 'Insights'];
// Returns the taps it took (0 = not reachable). On phones the switcher is collapsed: tap the current view to open it.
async function switchTo(page, v) {
  const b = page.locator(`[data-cleo-views] button[data-view="${v}"]`).first();
  if (!(await b.count())) return 0;
  let taps = 0;
  if (!(await b.isVisible().catch(() => false))) {
    const cur = page.locator('[data-cleo-views] button[aria-pressed=true]').first();
    if (await cur.isVisible().catch(() => false)) { await cur.click({ timeout: 3000 }).catch(() => {}); taps++; await page.waitForTimeout(300); }
    if (!(await b.isVisible().catch(() => false))) return 0;
  }
  if ((await b.getAttribute('aria-pressed')) === 'true') return taps || 1;
  await b.click({ timeout: 4000 }).catch(() => {}); taps++; await page.waitForTimeout(700); return taps;
}
async function patterns(rel, vp) {
  const T = truth(rel); const C = { page: rel, vp, theme: 'light' };
  console.log(`\n[patterns] ${rel} @${vp}  N=${T.N}`);
  const otherPref = 'insights';
  // P-01 … P-04 on a cold load
  let { ctx, page, st } = await open(rel, vp);
  let s = await page.evaluate(STATE);
  check('P-01', C, ok(s.nav && s.nav.vis && /group/.test(s.nav.role || '') && JSON.stringify(s.nav.labels) === JSON.stringify(LABELS) && s.nav.pressed.length === 1 && s.nav.h.every(h => h >= 44)), s.nav);
  check('P-04', { ...C, sub: 'cold' }, ok(!s.hash || s.hash === '#'), { hash: s.hash });
  const sw = []; let focusOk = 0, announce = 0;
  for (const v of ['atlas', 'guidebook', 'insights', 'gallery']) {
    const did = await switchTo(page, v); const t = await page.evaluate(STATE); if (did > 1) sw.taps = (sw.taps || 0) + 1;
    const focus = await page.evaluate(() => { const a = document.activeElement; const live = [...document.querySelectorAll('[aria-live]')].map(l => l.textContent.trim()).filter(Boolean).join(' | ');
      return { tag: a && a.tagName, heading: !!(a && (/^H[1-3]$/.test(a.tagName) || a.matches('[tabindex="-1"]'))), live: live.slice(0, 200) }; });
    if (focus.heading) focusOk++; if (new RegExp(v, 'i').test(focus.live) && /\d/.test(focus.live)) announce++;
    sw.push({ v, did, view: t.view, pressed: t.nav && t.nav.pressed[0], hash: t.hash, focus: focus.tag, live: focus.live.slice(0, 80) });
  }
  check('P-02', C, ok(sw.every(x => x.did && x.view === x.v && x.pressed === x.v)), { switches: sw, collapsedNeedsExtraTap: sw.taps || 0 });
  check('P-03', C, focusOk === 4 && announce === 4 ? 'PASS' : focusOk + announce >= 4 ? 'WARN' : 'FAIL', { focusOnHeading: focusOk + '/4', announced: announce + '/4', sw: sw.map(x => x.focus + ':' + x.live) });
  check('P-04', { ...C, sub: 'back to gallery' }, ok(!/view=/.test(sw[3].hash)), { hash: sw[3].hash });
  // P-23 / P-24 Gallery pager
  const pager = await page.evaluate(new Function(`${P_VIS} const p = [...document.querySelectorAll('.g-pager, [class*=pager]')].find(vis); if (!p) return null;
    const nums = [...p.querySelectorAll('a,button')].map(b => ({ t: b.textContent.trim(), dis: b.disabled || b.getAttribute('aria-disabled') === 'true', cur: b.getAttribute('aria-current') }));
    return { text: p.innerText.replace(/\\s+/g, ' ').trim().slice(0, 240), nums };`));
  const pagerOk = pager && /‹|prev/i.test(pager.text + JSON.stringify(pager.nums)) && pager.nums.some(n => /^\d+$/.test(n.t)) && new RegExp('all ' + T.N.toLocaleString('en-US') + ' places', 'i').test(pager.text) && /show all/i.test(pager.text);
  const one = T.N <= (vp === 390 ? 24 : 48);
  check('P-23', C, one ? (!pager || new RegExp('all ' + T.N.toLocaleString('en-US') + ' places', 'i').test(pager.text) ? 'N/A' : 'FAIL') : ok(pagerOk), { onePage: one, ...(pager || {}) });
  if (pager) {
    const btn = page.locator('.g-pager button, .g-pager a').filter({ hasText: /show all/i }).first();
    if (await btn.count()) { await btn.click().catch(() => {}); await page.waitForTimeout(800); }
    const ids = await page.evaluate(REACH, 'gallery'); const h = await page.evaluate(() => location.hash);
    check('P-23', { ...C, sub: 'show-all' }, ok(ids.length === T.N), { shown: ids.length, N: T.N, hash: h });
  }
  // P-13 one record set + P-15/P-14 summary lines with no lens
  const reach = {}; const lines = {};
  for (const v of VIEWS) {
    await page.evaluate(h => { location.hash = h; }, v === 'gallery' ? 'view=gallery&all=1' : 'view=' + v); await page.waitForTimeout(900);
    if (v === 'atlas') { const b = page.locator('.ms-pager button, .ms-more button').filter({ hasText: /show all|all \d/i }).first(); if (await b.count()) { await b.click().catch(() => {}); await page.waitForTimeout(700); } }
    const ids = await page.evaluate(REACH, v); const extra = ids.filter(i => !T.P.some(p => p.id === i));
    reach[v] = { n: ids.length, extra: extra.slice(0, 5) };
    lines[v] = await page.evaluate(COUNTS);
  }
  check('P-13', C, ok(VIEWS.every(v => reach[v].n === T.N && !reach[v].extra.length)), { N: T.N, reach });
  for (const v of VIEWS) {
    const L = lines[v].filter(x => x.kind !== 'pos'); const right = L.filter(x => x.n === T.N && (x.total == null || x.total === T.N));
    check('P-15', { ...C, view: v }, right.length >= 1 ? (L.length - right.length ? 'WARN' : 'PASS') : 'FAIL', { N: T.N, lines: L });
  }
  // P-14 counts agree for the same lens across views (ground truth from JSON)
  const firstArea = T.areas.find(a => T.count({ a }) > 0); const lensSet = [{}, { a: firstArea }, { mode: 'food' }, { t: '1' }];
  for (const L of lensSet) {
    const want = T.count(L); const per = {};
    for (const v of VIEWS) {
      const h = Object.entries({ ...L, view: v }).filter(([, x]) => x).map(([k, x]) => k + '=' + x).join('&');
      await page.evaluate(x => { location.hash = x; }, h); await page.waitForTimeout(800);
      const cl = (await page.evaluate(COUNTS)).filter(x => x.kind !== 'pos');
      per[v] = cl.map(x => x.n + (x.total != null ? '/' + x.total : '') + ' ' + x.kind);
      per[v].ok = cl.length > 0 && cl.some(x => x.n === want);
      per[v].bad = cl.filter(x => x.n !== want && x.kind !== 'mapArea').map(x => x.text);
      per[v].map = cl.filter(x => x.kind === 'mapArea').map(x => x.text);
    }
    const allOk = VIEWS.every(v => per[v].ok && !per[v].bad.length);
    check('P-14', { ...C, lens: JSON.stringify(L) }, allOk ? (VIEWS.some(v => per[v].map.length) ? 'WARN' : 'PASS') : 'FAIL',
      { want, per: Object.fromEntries(VIEWS.map(v => [v, { stated: per[v].slice(0, 4), bad: per[v].bad.slice(0, 3), mapArea: per[v].map.slice(0, 1) }])) });
  }
  // P-05 garbage enums, P-06 garbage p=
  await ctx.close();
  ({ ctx, page, st } = await open(rel, vp, { hash: '#view=zzz&t=9&a=NOPE&pg=0&mode=x&closed=2&all=yes&src=%3Cscript%3E' }));
  s = await page.evaluate(STATE);
  check('P-05', C, ok(!st.errors.length && s.view === 'gallery' && !/zzz|t=9|NOPE|pg=0|mode=x|closed=2|all=yes|script/i.test(s.hash) && s.histLen <= 2),
    { view: s.view, hash: s.hash, histLen: s.histLen, errors: st.errors.slice(0, 3) });
  await ctx.close();
  ({ ctx, page, st } = await open(rel, vp, { hash: '#p=no-such-place-zz' }));
  s = await page.evaluate(STATE); const r6 = (await page.evaluate(REACH, s.view)).length;
  check('P-06', C, ok(!st.errors.length && !s.sheet && (r6 === T.N || s.view !== 'gallery' || r6 > 0)), { sheet: s.sheet && s.sheet.title, errors: st.errors.slice(0, 3), hash: s.hash });
  await ctx.close();
  // P-07 … P-11 round trips in a fresh context whose stored view preference differs
  const top = T.P.find(p => !T.isClosed(p)) || T.P[0];
  const trips = [];
  for (const v of VIEWS) trips.push({ id: 'P-07', hash: v === 'gallery' ? '' : '#view=' + v, pref: v === 'gallery' ? otherPref : 'gallery', expect: { view: v } });
  const lensKeys = { a: firstArea, t: '1', mode: 'food', c: (T.d.collections || [])[0] && T.d.collections[0].id, cz: (T.d.cuisines || [])[0] && T.d.cuisines[0].id,
    src: (top.src || [])[0], closed: T.closed.length ? '1' : null, q: (top.n || '').split(/[\s(]/)[0] };
  for (const [k, x] of Object.entries(lensKeys)) if (x) trips.push({ id: 'P-08', hash: '#view=atlas&' + k + '=' + encodeURIComponent(x), pref: 'gallery', expect: { view: 'atlas', lens: { [k]: x } } });
  for (const v of VIEWS) trips.push({ id: 'P-09', hash: '#view=' + v + '&p=' + top.id, pref: v === 'gallery' ? otherPref : 'gallery', expect: { view: v, p: top.id } });
  const pages = Math.ceil(T.N / (vp === 390 ? 24 : 48));
  if (pages > 1) trips.push({ id: 'P-11', hash: '#pg=' + pages, pref: null, expect: { view: 'gallery', range: true } });
  trips.push({ id: 'P-11', hash: '#all=1', pref: null, expect: { view: 'gallery', shown: T.N } });
  for (const tr of trips) {
    const o = await open(rel, vp, { hash: tr.hash, pref: tr.pref, settle: 1000 });
    const t = await o.page.evaluate(STATE); const ev = { hash: tr.hash, got: { view: t.view, hash: t.hash, sheet: t.sheet && t.sheet.title } };
    let good = t.view === tr.expect.view && !o.st.errors.length;
    if (tr.expect.lens) {
      const [k, x] = Object.entries(tr.expect.lens)[0];
      const want = k === 'q' ? null : T.count({ [k]: x });
      const cl = (await o.page.evaluate(COUNTS)).filter(c => c.kind !== 'pos'); ev.want = want; ev.stated = cl.map(c => c.text).slice(0, 3);
      ev.pageLens = await o.page.evaluate(LENSCOUNT); ev.statedMatches = want == null || cl.some(c => c.n === want);
      good = good && t.route && t.route[k] === String(x) && (want == null || ev.pageLens === want);
      if (good && !ev.statedMatches) { check(tr.id, { ...C, sub: tr.hash }, 'WARN', { ...ev, note: 'link round-trips; no visible count line states ' + want }); await o.ctx.close(); continue; }
    }
    if (tr.expect.p) good = good && !!t.sheet && t.sheet.title.toLowerCase().includes((top.n || '').split(' (')[0].toLowerCase().slice(0, 12));
    if (tr.expect.range) { const cl = await o.page.evaluate(COUNTS); ev.stated = cl.map(c => c.text).slice(0, 2); good = good && cl.some(c => c.kind === 'range'); }
    if (tr.expect.shown) { const n = (await o.page.evaluate(REACH, 'gallery')).length; ev.shown = n; good = good && n === tr.expect.shown; }
    if (o.st.errors.length) ev.errors = o.st.errors.slice(0, 2);
    if (tr.id === 'P-07' && !tr.hash && !good) { ev.note = 'the address-bar URL of the default view omits view=, so the receiver\'s stored view wins; Share writes view= (P-12)'; check(tr.id, { ...C, sub: '(gallery, no hash)' }, 'WARN', ev); }
    else check(tr.id, { ...C, sub: tr.hash }, ok(good), ev);
    await o.ctx.close();
  }
  ({ ctx, page, st } = await open(rel, vp, { hash: '#view=atlas', settle: 1500 }));
  // P-16 numbered / clustered pins, P-17 no-place badge (Atlas)
  await page.waitForSelector('.leaflet-marker-icon', { timeout: 6000 }).catch(() => {});
  const pins = await page.evaluate(() => { const m = [...document.querySelectorAll('.leaflet-marker-pane > *')].filter(e => getComputedStyle(e).display !== 'none');   // zero-size icons draw their label as overflow
    const txt = m.map(e => e.textContent.trim()); return { markers: m.length, labelled: txt.filter(Boolean).length, numbered: txt.filter(t => /^\d+$/.test(t)).length,
      canvasDots: !!document.querySelector('.leaflet-overlay-pane canvas, .leaflet-overlay-pane path'), sample: txt.slice(0, 6) }; });
  check('P-16', C, pins.markers === 0 ? 'FAIL' : pins.labelled / pins.markers >= 0.9 ? 'PASS' : 'WARN', pins);
  const badge = await page.evaluate(new Function(`${P_VIS} const e = [...document.querySelectorAll('main *')].filter(x => vis(x) && x.children.length < 3 && /without a (verified )?pin/i.test(x.textContent)); return e.map(x => x.textContent.replace(/\\s+/g, ' ').trim().slice(0, 100)).slice(0, 3);`));
  const bn = badge.map(b => +((/(\d[\d,]*)\s+without/.exec(b) || [])[1] || 'NaN'));
  check('P-17', C, !T.unpinned.length ? (badge.length ? 'WARN' : 'N/A') : ok(bn.includes(T.unpinned.length)), { unpinned: T.unpinned.length, badge });
  // P-10 map view round trip
    await page.evaluate(() => { try { const m = window.Cleo && (Cleo.map || (Cleo.atlas && Cleo.atlas.map)); if (m && m.setView) m.setView(m.getCenter(), Math.min(m.getZoom() + 2, 17)); } catch (e) { /* ignore */ } });
  const mapBox = await page.locator('#cleo-map, .leaflet-container').first().boundingBox().catch(() => null);
  if (mapBox) { await page.mouse.move(mapBox.x + mapBox.width / 2, mapBox.y + mapBox.height / 2); await page.mouse.wheel(0, -400); await page.waitForTimeout(500);
    await page.mouse.down(); await page.mouse.move(mapBox.x + mapBox.width / 2 + 80, mapBox.y + mapBox.height / 2 + 40, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(900); }
  const h10 = await page.evaluate(() => location.hash);
  const m10 = /(?:^|[#&])((?:map|at)=[^&]+)/.exec(h10);   // the map view key is at= since Atlas FE-2 round 3
  if (!m10) check('P-10', C, 'FAIL', { note: 'panning and zooming the Atlas map wrote no map= / at= to the hash', hash: h10 });
  else {
    const o = await open(rel, vp, { hash: h10, settle: 1500 }); const back = await o.page.evaluate(() => location.hash);
    check('P-10', C, ok(back.includes(m10[1])), { sent: h10, fresh: back }); await o.ctx.close();
  }
  await shot(page, `p-atlas-${pageKey(rel)}-${vp}`);
  await ctx.close();
  // P-18 … P-20 Insights
  ({ ctx, page, st } = await open(rel, vp, { hash: '#view=insights', settle: 1500 }));
  await page.evaluate(() => document.querySelectorAll('.icard details').forEach(d => { d.open = true; })); await page.waitForTimeout(500);
  const ins = await page.evaluate(new Function(`${P_VIS}
    const charts = [...document.querySelectorAll('.icard')].filter(c => vis(c) && c.querySelector('svg'));
    return charts.map(c => { const t = (c.querySelector('h2,h3,.d3,.d2') || {}).textContent || '';
      const links = [...c.querySelectorAll('svg a[href]')].map(a => ({ href: a.getAttribute('href'), label: a.getAttribute('aria-label') || '' }));
      const marks = c.querySelectorAll('svg rect.bar, svg rect:not(.hit):not([style*=transparent]), svg path.seg').length;
      const unlinked = [...c.querySelectorAll('svg rect.bar, svg .seg')].filter(r => !r.closest('a')).length;
      const fn = [...c.querySelectorAll('.fn')].map(f => f.textContent.trim()).join(' '); const table = /show as a table/i.test(c.textContent) && !!c.querySelector('table');
      const rows = [...c.querySelectorAll('table tbody tr')].map(tr => [...tr.children].map(x => x.textContent.trim()));
      return { title: t.trim().slice(0, 60), links, marks, unlinked, fn: fn.trim().slice(0, 600), table, rows: rows.slice(0, 40) }; });`));
  if (!ins.length) { check('P-18', C, 'FAIL', 'no chart rendered in Insights'); }
  for (const c of ins) {
    const sample = c.links.filter((l, i) => i % Math.max(1, Math.ceil(c.links.length / 6)) === 0).slice(0, 6); const res = [];
    for (const l of sample) {
      const u = new URL(l.href, page.url()); const o = await open(rel, vp, { hash: u.hash, settle: 900 });
      const t = await o.page.evaluate(STATE); const lens = t.route || {};
      const want = lens.q ? null : T.count(lens); const val = +((/(\d[\d,]*)\s*$/.exec(l.label.replace(/\s*places?$/, '')) || [])[1] || 'NaN').toString().replace(/,/g, '');
      const cl = (await o.page.evaluate(COUNTS)).filter(x => x.kind !== 'pos'); const pageLens = await o.page.evaluate(LENSCOUNT);
      const citations = /citation/i.test(c.title + ' ' + c.fn) && /· all /.test(l.label);
      res.push({ href: u.hash, label: l.label.slice(0, 60), barValue: val, lensCount: want, pageLens, stated: cl.map(x => x.n), view: t.view,
        ok: Object.keys(lens).some(k => k !== 'view') && (isNaN(val) || val === want || citations) && pageLens === want, statedOk: cl.some(x => x.n === want) });
      await o.ctx.close();
    }
    const plainStated = /plain bars|not lists of places|no filter (that opens|selects)|without opening places/i.test(c.fn);   // unlinked bars are allowed when the footnote says why
    check('P-18', { ...C, chart: c.title, plainStated }, (!c.links.length || c.unlinked) && !plainStated ? 'FAIL' : !c.links.length ? 'PASS' : res.every(x => x.ok) ? (res.every(x => x.statedOk) ? 'PASS' : 'WARN') : 'FAIL', { links: c.links.length, unlinked: c.unlinked, sample: res });
    check('P-19', { ...C, chart: c.title }, ok(c.table), { table: c.table, rows: c.rows.length });
    const m = /from ([\d,]+) of ([\d,]+) places/i.exec(c.fn);
    check('P-20', { ...C, chart: c.title }, !c.fn ? 'FAIL' : m ? ok(+m[2].replace(/,/g, '') === T.N) : 'PASS', { fn: c.fn });
  }
  await ctx.close();
  // P-21 / P-22 drawer n of N, prev / next; P-27 lens yields; P-12 share
  for (const [v, L] of [['gallery', {}], ['atlas', { a: firstArea }], ['guidebook', {}], ['insights', { mode: 'food' }]]) {
    const want = T.count(L); const inLens = T.P.filter(p => T.count({ ...L }) && (!L.a || p.a === L.a) && (!L.mode || (L.mode === 'food') === (p.kind === 'food')));
    const first = inLens[0] || top;
    const hash = '#' + Object.entries({ view: v === 'gallery' ? '' : v, ...L, p: first.id }).filter(([, x]) => x).map(([k, x]) => k + '=' + x).join('&');
    const o = await open(rel, vp, { hash, settle: 1000 }); const t = await o.page.evaluate(STATE);
    const m = t.sheet && /(\d+)\s+of\s+(\d+)/.exec(t.sheet.pos || '');
    check('P-21', { ...C, view: v, lens: JSON.stringify(L) }, ok(m && +m[2] === want), { pos: t.sheet && t.sheet.pos, want });
    const nx = o.page.locator('[role=dialog] [data-sh=go]').last();
    let p22 = { next: false };
    if (await nx.count()) { const before = t.route && t.route.p; await nx.click().catch(() => {}); await o.page.waitForTimeout(600); const t2 = await o.page.evaluate(STATE);
      const m2 = t2.sheet && /(\d+)\s+of/.exec(t2.sheet.pos || ''); p22 = { before, after: t2.route && t2.route.p, pos: t2.sheet && t2.sheet.pos, next: !!(m && m2 && +m2[1] === +m[1] + 1 && t2.route.p !== before) }; }
    check('P-22', { ...C, view: v }, ok(p22.next), p22);
    if (v === 'gallery') {
      const sh = o.page.locator('[role=dialog] [data-sh=share]').filter({ visible: true }).first(); const openP = (await o.page.evaluate(STATE)).route.p;
      if (await sh.count()) { await sh.click().catch(() => {}); await o.page.waitForTimeout(400); const got = await o.page.evaluate(() => window.__shared.slice(-1)[0] || '');
        check('P-12', C, ok(/[#&]view=gallery/.test(got) && got.includes('p=' + openP)), { shared: got, open: openP }); }
      else check('P-12', C, 'FAIL', 'no Share in the sheet');
    }
    await o.ctx.close();
  }
  { // P-27 a deep link to a place the lens hides; P-28 "Show all" clears every lens
    const hidden = T.P.find(p => p.a !== firstArea && !T.isClosed(p)) || T.P.find(p => p.kind === 'food');   // one-area pages: hide it with mode=sights
    const hideBy = hidden.a !== firstArea ? `a=${firstArea}` : 'mode=sights';
    const o = await open(rel, vp, { hash: `#view=atlas&${hideBy}&p=${hidden.id}`, settle: 1000 }); const t = await o.page.evaluate(STATE);
    check('P-27', C, ok(!!t.sheet && t.sheet.title.toLowerCase().includes(hidden.n.split(' (')[0].toLowerCase().slice(0, 10))), { place: hidden.id, sheet: t.sheet && t.sheet.title });
    await o.ctx.close();
    const o2 = await open(rel, vp, { hash: `#a=${firstArea}&mode=food&t=1`, settle: 1000 });
    const clr = o2.page.locator('[data-cleo-all], button:has-text("Show all"), a:has-text("Show all")').filter({ visible: true }).first();
    let ev = { control: false };
    if (await clr.count()) { ev.control = (await clr.textContent()).trim().slice(0, 40); await clr.click().catch(() => {}); await o2.page.waitForTimeout(700); const t2 = await o2.page.evaluate(STATE);
      ev.route = t2.route; ev.lines = (await o2.page.evaluate(COUNTS)).map(x => x.text).slice(0, 2); }
    check('P-28', C, ok(ev.route && !['a', 'mode', 't'].some(k => ev.route[k])), ev); await o2.ctx.close();
  }
  // P-24 no silent caps: every container that states "n places" shows n items or a visible control to reach the rest
  for (const v of VIEWS) {
    const o24 = await open(rel, vp, { hash: '#view=' + v, settle: 1200 });
    const caps = await o24.page.evaluate(new Function(`${P_VIS} if (window.Cleo && Cleo.defer && Cleo.defer.all) Cleo.defer.all();
      let measured = 0; const ITEM = 'li.pl, .gc, .ge, .ixi, .rail-i'; const MORE = /see all|show all|show [\\d,]+ more|all [\\d,]+ places|next|›/i; const out = [];
      document.querySelectorAll('main section, main .g-row, main .ch, main .ms-head, main .rail, main [class*=row]').forEach(c => {
        if (!vis(c) || c.closest('[role=dialog]')) return;
        const head = [...c.querySelectorAll('h2,h3,.row-h,.sub,.count,.ms-count,p')].slice(0, 4).map(h => h.textContent).join(' ');
        const m = /\\b([\\d,]+) places?\\b/.exec(head); if (!m) return;
        const n = +m[1].replace(/,/g, ''); const items = c.querySelectorAll(ITEM).length; if (!items) return; measured++;
        const ctl = [...c.querySelectorAll('button, a')].some(b => vis(b) && MORE.test(b.textContent)) || [...(c.parentElement ? c.parentElement.querySelectorAll(':scope > .pager, :scope > .ms-pager, :scope > [class*=pager]') : [])].some(vis);
        if (items < n && !ctl) out.push({ stated: n, rendered: items, head: head.replace(/\\s+/g, ' ').trim().slice(0, 80), cls: String(c.className).slice(0, 40) });
      });
      return { out, measured };`));
    check('P-24', { ...C, view: v }, caps.measured ? ok(!caps.out.length) : 'N/A', { measured: caps.measured, silentCaps: caps.out.slice(0, 6) });
    await o24.ctx.close();
  }
  // P-25 value-led ranking, P-26 invented data (all four views, visible text + sort options)
  const o = await open(rel, vp, { hash: '#p=' + top.id, settle: 900 });
  const texts = {};
  for (const v of VIEWS) { await switchTo(o.page, v); await o.page.evaluate(EXPAND); texts[v] = await o.page.evaluate(() => document.body.innerText); }
  const sorts = await o.page.evaluate(() => [...document.querySelectorAll('select option, [role=option]')].map(x => x.textContent.trim()).filter(Boolean).slice(0, 20));
  const VALUE = /\b(highest[- ]rated|top[- ]rated|best[- ]rated|most popular|rating[s]?:|score:\s*\d|sort(ed)? by (rating|popularity|score)|\d\.\d\s*\/\s*5\b|★\s*\d\.\d|\d\.\d\s*★|\d+\s+reviews\b)/i;
  const INVENT = /(\$\s?\d|€\s?\d|£\s?\d|¥\s?\d|\bopen now\b|\bcloses at\b|\bbook (now|a table|tickets)\b|\breserve (now|a table)\b|\bavailability\b|\blorem ipsum\b|\bdemo data\b|\bsample (place|data)\b|\bplaceholder\b|\bhours: \d)/i;
  const hits = (re) => Object.fromEntries(VIEWS.map(v => [v, (texts[v].split('\n').filter(l => re.test(l) && !/aren.t in our data|check before you go/i.test(l)).slice(0, 4))]));
  const vh = hits(VALUE), ih = hits(INVENT);
  check('P-25', C, ok(VIEWS.every(v => !vh[v].length) && !sorts.some(s => VALUE.test(s) || /rating|popular/i.test(s))), { hits: vh, sortOptions: sorts });
  const photos = await o.page.evaluate(new Function(`${P_VIS} return [...document.querySelectorAll('main img')].filter(i => vis(i) && !/\\.svg(\\?|$)/.test(i.currentSrc || i.src) && i.naturalWidth > 64)
    .map(i => { const f = i.closest('figure, .gc, .cover, .photo, [class*=img], li, article') || i.parentElement; return { src: (i.currentSrc || i.src).split('/').slice(-1)[0], credit: /photo|©|cc |public domain|wikimedia|courtesy/i.test(f ? f.textContent + (i.getAttribute('title') || '') + (i.alt || '') : '') };  /* textContent: content-visibility:auto cards report no innerText off-screen */ }).slice(0, 80);`));
  check('P-26', C, ok(VIEWS.every(v => !ih[v].length) && photos.every(p => p.credit)), { hits: ih, photos: photos.length, uncredited: photos.filter(p => !p.credit).slice(0, 5) });
  P_TEXT_CACHE[rel] = texts.gallery;
  await o.ctx.close();
  await ctx.close().catch(() => {});
}
const P_TEXT_CACHE = {};

// ---------------------------------------------------------------- B. journeys
function J(id, ctx, success, steps, friction, evidence, shotPath) {
  const status = success === 'yes' ? 'PASS' : success === 'partial' ? 'WARN' : success === 'n/a' ? 'N/A' : 'FAIL';
  R.journeys.push({ id, title: CHECKS[id], ...ctx, success, steps, friction, shot: shotPath });
  check(id, ctx, status, { success, steps, friction, ...evidence });
}
async function click(page, sel, steps, friction, why) {
  const l = typeof sel === 'string' ? page.locator(sel).filter({ visible: true }).first() : sel;
  if (!(await l.count())) { friction.push('not found: ' + why); return false; }
  await l.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
  try { await l.click({ timeout: 3000 }); } catch (e) { const why2 = (e.message.split('\n').find(x => /intercepts|not visible|outside of the viewport|not stable|detached/.test(x)) || e.message.split('\n')[0]).trim().slice(0, 140); friction.push('could not click ' + why + ': ' + why2); return false; }
  steps.n++; await page.waitForTimeout(600); return true;
}
async function journeysCity(rel, vp, theme) {
  const T = truth(rel); const C = { page: rel, vp, theme }; const tag = `${pageKey(rel)}-${vp}-${theme}`;
  const top = T.P.find(p => !T.isClosed(p));
  console.log(`\n[journeys] ${rel} @${vp} ${theme}`);
  // J-01 discover → shortlist → plan a day → share → reopen
  {
    const steps = { n: 0 }, fr = []; const { ctx, page, st } = await open(rel, vp, { theme });
    const refs = await page.evaluate(() => { const seen = []; [...document.querySelectorAll('main button.heart, main button[aria-label^="Save"]')].filter(e => e.offsetParent).forEach(e => { const r = e.getAttribute('data-ref') || e.getAttribute('aria-label'); if (!seen.includes(r)) seen.push(r); }); return seen.slice(0, 2); });
    for (const r of refs) {
      await click(page, page.locator(`main button.heart[data-ref="${r}"], main button[aria-label="${r}"]`).filter({ visible: true }).first(), steps, fr, 'save ' + r);
      const opened = await page.evaluate(() => !![...document.querySelectorAll('[role=dialog]')].find(d => d.offsetParent && d.querySelector('[data-sh-pos]')));
      if (opened) { fr.push('saving ' + r + ' also opened the sheet'); await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
    }
    const saved = (await page.evaluate(STATE)).saved;
    if (saved !== 2) fr.push('saved count is ' + saved + ' after two saves');
    const card = page.locator('main .gc a[href^="#p"], main li.pl a[href^="#p"], main li.pl button.pl-n').filter({ visible: true }).first();
    await click(page, card, steps, fr, 'a place card');
    let t = await page.evaluate(STATE); if (!t.sheet) fr.push('no sheet after opening a card');
    await click(page, '[role=dialog] [data-sh=day]', steps, fr, 'Add to day');
    const afterDay = await page.evaluate(() => ({ hash: location.hash, dlg: [...document.querySelectorAll('[role=dialog]')].filter(d => d.offsetParent).map(d => d.innerText.slice(0, 80)) }));
    const dayConfirm = page.locator('[role=dialog] button').filter({ hasText: /^(add|add to (this|today|day \d)|day \d|today)/i }).filter({ visible: true }).first();
    if (await dayConfirm.count() && !/day=/.test(afterDay.hash)) await click(page, dayConfirm, steps, fr, 'confirm the day');
    const dayState = await page.evaluate(() => ({ hash: location.hash, store: (() => { try { return Object.keys(localStorage).filter(k => /day/i.test(k)); } catch (e) { return []; } })() }));
    if (!/day=/.test(dayState.hash) && !dayState.store.length) fr.push('no visible day plan state after Add to day');
    if (!(await page.locator('[role=dialog] [data-sh=share]').filter({ visible: true }).count())) {
      const op = page.locator('main li.pl a[href^="#p"], main .gc a[href^="#p"], main .gc').filter({ visible: true }).first(); await click(page, op, steps, fr, 'reopen the card to share'); }
    await click(page, '[role=dialog] [data-sh=share]', steps, fr, 'Share');
    const url = await page.evaluate(() => window.__shared.slice(-1)[0] || '');
    t = await page.evaluate(STATE);
    const s1 = await shot(page, `j01-${tag}`);
    let reopen = null;
    if (url) { const o = await open(rel, vp, { theme, hash: url.slice(url.indexOf('#')), pref: 'insights' }); const t2 = await o.page.evaluate(STATE);
      reopen = { view: t2.view, sheet: t2.sheet && t2.sheet.title, same: !!(t2.sheet && t.sheet && t2.sheet.title === t.sheet.title) }; await o.ctx.close(); }
    else fr.push('Share produced no URL');
    await page.goto(base + 'beta/saved.html', { waitUntil: 'load' }); await page.waitForTimeout(900);
    const savedList = await page.evaluate(() => document.querySelectorAll('main li.pl, main [data-ref], main .saved-i, main article').length);
    if (savedList < 2) fr.push('saved page lists ' + savedList + ' items');
    const success = saved === 2 && url && reopen && reopen.same && savedList >= 2 ? (fr.length ? 'partial' : 'yes') : 'no';
    J('J-01', C, success, steps.n, fr, { shared: url, reopen, savedList, errors: st.errors.slice(0, 3) }, s1);
    await ctx.close();
  }
  // J-02 best food near X: food in one area, rank order, open the first
  {
    const steps = { n: 0 }, fr = []; const { ctx, page } = await open(rel, vp, { theme });
    const foodArea = (T.P.find(p => p.kind === 'food' && !T.isClosed(p)) || {}).a; const aName = (T.areaName[foodArea] || '').split(' (')[0];
    await click(page, page.locator('[data-mode=food], button:has-text("Eat & drink")').filter({ visible: true }).first(), steps, fr, 'Eat & drink lens');
    let areaBtn = page.locator(`[data-cleo-area="${foodArea}"], button[data-a="${foodArea}"], [data-a="${foodArea}"]:is(button,a,label)`).filter({ visible: true }).first();
    if (!(await areaBtn.count())) {
      fr.push('no area control on the page: opened Filters');
      await click(page, '[data-cleo-tray]', steps, fr, 'Filters');
      areaBtn = page.locator('[role=dialog] label, [role=dialog] button').filter({ hasText: aName.slice(0, 12) }).filter({ visible: true }).first();
    }
    await click(page, areaBtn, steps, fr, 'area ' + aName);
    const apply = page.locator('[role=dialog] button').filter({ hasText: /^show \d/i }).filter({ visible: true }).first();
    if (await apply.count()) await click(page, apply, steps, fr, 'Show n places');
    const t = await page.evaluate(STATE); const want = T.count({ mode: 'food', a: foodArea });
    const shown = await page.evaluate(new Function(`${P_VIS} return [...document.querySelectorAll('li.pl, .gc[data-id], .ge[data-id]')].filter(vis).slice(0, 12).map(e => ({ k: e.getAttribute('data-k') || e.getAttribute('data-k3'), a: e.getAttribute('data-a'), r: +e.getAttribute('data-rank') }));`));
    const lensOk = t.route && t.route.mode === 'food' && t.route.a === foodArea;
    const ordered = shown.every((x, i) => i === 0 || !x.r || !shown[i - 1].r || x.r >= shown[i - 1].r);
    if (!ordered) fr.push('visible food cards are not in rank order');
    const firstOnScreen = await page.evaluate(new Function(`${P_VIS} const c = [...document.querySelectorAll('main .gc, main li.pl')].find(e => vis(e) && e.getBoundingClientRect().bottom > 0); return c ? (c.getAttribute('data-id') || c.id) : null;`));
    const match = T.P.filter(p => p.kind === 'food' && p.a === foodArea).map(p => p.id);
    if (firstOnScreen && !match.includes(String(firstOnScreen).replace(/^p-/, ''))) fr.push('the first card on screen (' + firstOnScreen + ') is outside the lens');
    const target = page.locator(match.slice(0, 40).map(id => `main #p-${id} a[href^="#p"], main .gc[data-id="${id}"] a[href^="#p"]`).join(', ')).filter({ visible: true }).first();
    await click(page, target, steps, fr, 'first food place in ' + foodArea);
    const t2 = await page.evaluate(STATE);
    const s = await shot(page, `j02-${tag}`);
    const inLens = t2.sheet && T.P.some(p => p.kind === 'food' && p.a === foodArea && t2.sheet.title.includes(p.n.split(' (')[0]));
    if (t2.sheet && !inLens) fr.push('the opened place is not food in ' + foodArea);
    J('J-02', C, lensOk && t2.sheet && inLens ? (steps.n <= 4 && ordered && fr.length <= 1 ? 'yes' : 'partial') : 'no', steps.n, fr, { area: foodArea, want, route: t.route, sheet: t2.sheet && t2.sheet.title }, s);
    await ctx.close();
  }
  // J-03 is it still open? closure honesty in every view
  if (!T.closed.length) J('J-03', C, 'n/a', 0, ['no closed place on this page'], { closed: 0 });
  else {
    const cp = T.closed[0]; const fr = []; const per = {};
    for (const v of VIEWS) {
      const o = await open(rel, vp, { theme, hash: (v === 'gallery' ? '#all=1' : '#view=' + v), settle: 900 });
      if (v === 'atlas') { const b = o.page.locator('.ms-pager button, .ms-more button').filter({ hasText: /show all|all \d/i }).first(); if (await b.count()) await b.click().catch(() => {}); }
      per[v] = await o.page.evaluate(new Function('id', `${P_VIS} if (window.Cleo && Cleo.defer) Cleo.defer.all();
        const all = [...document.querySelectorAll('#p-' + CSS.escape(id) + ', [data-id="' + id + '"], #gb-' + CSS.escape(id))]; const el = all.find(vis) || all[0];
        if (!el) return { found: false }; const t = (el.textContent || '').replace(/\\s+/g, ' ');   // textContent: content-visibility:auto cards report no innerText off-screen
        return { found: true, visible: vis(el), closed: /closed/i.test(t), tier: /must see|\\btier\\b|★★/i.test(t) || !!el.querySelector('.tg.t1,.badge.t1,.tier.t1') };`), cp.id);
      if (!per[v].found) fr.push(v + ': closed place not reachable'); else if (!per[v].closed) fr.push(v + ': not flagged closed'); else if (per[v].tier) fr.push(v + ': closed place shows a tier');
      await o.ctx.close();
    }
    const o = await open(rel, vp, { theme, hash: '#p=' + cp.id }); const t = await o.page.evaluate(STATE);
    const sheetOk = t.sheet && /closed/i.test(t.sheet.text) && /\d{4}-\d{2}-\d{2}|checked|20\d\d/i.test(t.sheet.text);
    if (!sheetOk) fr.push('sheet does not state closed + check date');
    const s = await shot(o.page, `j03-${tag}`); await o.ctx.close();
    const o2 = await open(rel, vp, { theme, hash: '#p=' + top.id }); const t2 = await o2.page.evaluate(STATE); await o2.ctx.close();
    if (!(t2.sheet && /checked|verified|20\d\d/i.test(t2.sheet.text))) fr.push('open place sheet has no check date');
    J('J-03', C, !fr.length ? 'yes' : VIEWS.every(v => per[v].found && per[v].closed) ? 'partial' : 'no', 1, fr, { place: cp.id, per }, s);
  }
  // J-04 who recommends this and why?
  {
    const steps = { n: 0 }, fr = []; const { ctx, page } = await open(rel, vp, { theme, hash: '#p=' + top.id }); steps.n = 1;
    const t = await page.evaluate(STATE);
    const rb = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].find(x => x.querySelector('[data-sh-pos]') && x.offsetParent !== null) || document;
      const h = [...d.querySelectorAll('h2,h3,h4,dt,.eyebrow,strong,p')].find(x => /recommended by/i.test(x.textContent));
      const sec = h ? (h.closest('section,div,dl') || h.parentElement) : null;
      return { heading: !!h, links: sec ? [...sec.querySelectorAll('a[href^="http"]')].length : 0, lens: sec ? [...sec.querySelectorAll('button, a[href^="#"], [data-sh=lens]')].length : 0 }; });
    const wOk = t.sheet && top.w && t.sheet.text.replace(/\s+/g, ' ').includes(top.w.replace(/\s+/g, ' ').slice(0, 50));
    if (!rb.heading) fr.push('no "Recommended by" in the sheet'); if (!rb.links) fr.push('no linked source'); if (!wOk) fr.push('the write-up w is not shown verbatim');
    const srcBtn = page.locator('[role=dialog] button[data-src], [role=dialog] [data-sh=lens][data-f=src]').filter({ visible: true }).first();
    const promised = +(((await srcBtn.textContent().catch(() => '')) || '').match(/All (\d+)/) || [0, NaN])[1];
    await click(page, srcBtn, steps, fr, 'a source lens');
    const t2 = await page.evaluate(STATE); const src = t2.route && t2.route.src;
    const cl = (await page.evaluate(COUNTS)).filter(x => x.kind !== 'pos'); const want = src ? T.count({ src }) : null;
    if (!src) fr.push('source control did not open the source lens'); else if (!cl.some(x => x.n === want)) fr.push('source lens count not stated as ' + want);
    const s = await shot(page, `j04-${tag}`);
    if (src && promised && promised !== want) fr.push('the source button promises ' + promised + ', the lens holds ' + want);
    J('J-04', C, rb.heading && rb.links && wOk && src ? (fr.length ? 'partial' : 'yes') : 'no', steps.n, fr, { rb, src, want, promised, stated: cl.map(x => x.text).slice(0, 2) }, s);
    await ctx.close();
  }
  // J-05 switch views without losing context
  {
    const fr = []; const area = T.areas.find(a => T.count({ a }) > 3) || T.areas[0]; const inA = T.P.find(p => p.a === area && !T.isClosed(p));
    const { ctx, page } = await open(rel, vp, { theme, hash: `#a=${area}&p=${inA.id}` }); const per = {};
    for (const v of ['atlas', 'guidebook', 'insights', 'gallery']) {
      let taps = await switchTo(page, v);
      if (!taps) { // the open sheet may cover the switcher: that is friction, not failure
        fr.push(v + ': switcher not reachable with the sheet open'); await page.keyboard.press('Escape'); await page.waitForTimeout(400); taps = await switchTo(page, v); }
      if (taps > 1) fr.push(v + ': ' + taps + ' taps (collapsed switcher)'); const t = await page.evaluate(STATE); const cl = (await page.evaluate(COUNTS)).filter(x => x.kind !== 'pos');
      per[v] = { a: t.route && t.route.a, p: t.route && t.route.p, sheet: !!t.sheet, stated: cl.map(x => x.n) };
      if (per[v].a !== area) fr.push(v + ': lost the area lens'); if (!cl.some(x => x.n === T.count({ a: area }))) fr.push(v + ': count ≠ ' + T.count({ a: area }));
    }
    // close returns to the same scroll position
    await page.evaluate(() => { location.hash = ''; }); await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' })); await page.waitForTimeout(400); const y0 = await page.evaluate(() => Math.round(scrollY));
    const c = page.locator('main li.pl a[href^="#p"], main .gc a[href^="#p"], main .gc').filter({ visible: true });
    let y1 = null; const n = await c.count();
    for (let i = 0; i < n; i++) { const bb = await c.nth(i).boundingBox(); if (bb && bb.y > 60 && bb.y < VP[vp].viewport.height - 100) { await c.nth(i).click().catch(() => {}); break; } }
    await page.waitForTimeout(700); await page.locator('[role=dialog] [data-sh=x]').filter({ visible: true }).first().click().catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(700); y1 = await page.evaluate(() => Math.round(scrollY));
    if (Math.abs(y1 - y0) > 8) fr.push(`close returned to scrollY ${y1}, was ${y0}`);
    J('J-05', C, Object.values(per).every(x => x.a === area) ? (fr.length ? 'partial' : 'yes') : 'no', 4, fr, { area, per, scroll: [y0, y1] });
    await ctx.close();
  }
  // J-06 Back and Forward
  {
    const fr = []; const { ctx, page } = await open(rel, vp, { theme }); const seq = [];
    await switchTo(page, 'atlas'); seq.push(await page.evaluate(STATE));
    const chip = page.locator('[data-mode=sights]').filter({ visible: true }).first();
    if (await chip.count()) await chip.click().catch(() => {}); else await page.evaluate(() => { location.hash = location.hash + '&mode=sights'; });
    await page.waitForTimeout(600); seq.push(await page.evaluate(STATE));
    await page.locator('main li.pl a[href^="#p"], main li.pl button.pl-n, main li.pl').filter({ visible: true }).first().click().catch(() => {}); await page.waitForTimeout(700);
    seq.push(await page.evaluate(STATE));
    const back = [];
    for (let i = 0; i < 3; i++) { await page.goBack({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(600); back.push(await page.evaluate(STATE).catch(() => ({ view: 'LEFT PAGE' }))); }
    const fwd = [];
    for (let i = 0; i < 3; i++) { await page.goForward({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(600); fwd.push(await page.evaluate(STATE).catch(() => ({ view: 'LEFT PAGE' }))); }
    const sum = x => ({ view: x.view, mode: x.route && x.route.mode, sheet: !!x.sheet });
    const ex = [sum(seq[1]), sum(seq[0]), { view: 'gallery', mode: undefined, sheet: false }];
    back.forEach((b, i) => { const s = sum(b); if (s.view !== ex[i].view || s.mode !== ex[i].mode || s.sheet !== ex[i].sheet) fr.push(`Back ${i + 1}: got ${JSON.stringify(s)}, want ${JSON.stringify(ex[i])}`); });
    const exf = [sum(seq[0]), sum(seq[1]), sum(seq[2])];
    fwd.forEach((b, i) => { const s = sum(b); if (s.view !== exf[i].view || s.mode !== exf[i].mode || s.sheet !== exf[i].sheet) fr.push(`Forward ${i + 1}: got ${JSON.stringify(s)}, want ${JSON.stringify(exf[i])}`); });
    if (!seq[2].sheet) fr.push('no sheet opened from a card (step 3)');
    J('J-06', C, !fr.length ? 'yes' : back.every(b => b.view !== 'LEFT PAGE') ? 'partial' : 'no', 3, fr, { seq: seq.map(sum), back: back.map(sum), fwd: fwd.map(sum) });
    await ctx.close();
  }
  await commonJourneys(rel, vp, theme, T, top);
}
async function keyboard(page, maxTabs = 60) {
  const stops = [];
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab');
    const st = await page.evaluate(() => { const a = document.activeElement; const prev = window.__qcPrev; window.__qcPrev = null;
      const sig1 = e => { const s = getComputedStyle(e); return [s.outlineStyle + s.outlineWidth + s.outlineColor, s.boxShadow, s.borderColor, s.backgroundColor, s.color, s.textDecorationLine].join('|'); };
      const sig = e => sig1(e) + '//' + (e.parentElement ? sig1(e.parentElement) : '') + '//' + (e.parentElement && e.parentElement.parentElement ? sig1(e.parentElement.parentElement) : '');
      let prevChanged = null; if (prev && prev.el !== a && prev.el.isConnected) prevChanged = sig(prev.el) !== prev.sig;   // the previous stop, now blurred: did its look change?
      if (!a || a === document.body) return { tag: 'BODY', prevChanged };
      const s = getComputedStyle(a); const r = a.getBoundingClientRect();
      const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== 'none');
      window.__qcPrev = { el: a, sig: sig(a) };
      return { tag: a.tagName, t: (a.getAttribute('aria-label') || a.textContent || a.value || '').replace(/\s+/g, ' ').trim().slice(0, 40), view: a.getAttribute('data-view'), ring, onscreen: r.bottom > 0 && r.top < innerHeight && r.width > 0,
        inDialog: !!a.closest('[role=dialog]'), skip: /skip/i.test(a.textContent || ''), prevChanged }; });
    if (stops.length && st.prevChanged && !stops[stops.length - 1].ring) stops[stops.length - 1].ring = 'style-change';
    if (st.tag !== 'BODY' && !st.onscreen) { await page.waitForTimeout(700); st.onscreen = await page.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0; }); }   // smooth scrolling may still be running
    stops.push(st);
  }
  return stops;
}
async function commonJourneys(rel, vp, theme, T, top) {
  const C = { page: rel, vp, theme }; const city = !!T; const tag = `${pageKey(rel)}-${vp}-${theme}`;
  // J-07 keyboard only
  {
    const fr = []; const { ctx, page } = await open(rel, vp, { theme });
    const stops = await keyboard(page, 40);
    if (!stops[0] || !stops[0].skip) fr.push('first Tab stop is not a skip link: ' + JSON.stringify(stops[0]));
    const noRing = stops.filter(s => s.tag !== 'BODY' && !s.ring); if (noRing.length) fr.push(noRing.length + ' of ' + stops.length + ' stops show no focus ring: ' + noRing.slice(0, 3).map(s => s.tag + ' ' + s.t).join(' | '));
    const off = stops.filter(s => s.tag !== 'BODY' && !s.onscreen); if (off.length > 2) fr.push(off.length + ' focused elements were off-screen (not scrolled into view)');
    let ev = { firstStops: stops.slice(0, 6).map(s => s.tag + ':' + s.t) };
    let success = 'yes';
    if (city) {
      const toSwitch = stops.findIndex(s => s.view); ev.tabsToSwitcher = toSwitch + 1;
      if (toSwitch < 0) { fr.push('switcher not reached in 40 Tabs'); success = 'no'; } else if (toSwitch + 1 > 12) fr.push('switcher needs ' + (toSwitch + 1) + ' Tabs');
      // operate the switcher by keyboard
      if (!(await page.locator('[data-cleo-views] button[data-view="atlas"]').isVisible().catch(() => false))) {
        await page.focus('[data-cleo-views] button[aria-pressed=true]').catch(() => {}); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
        if (!(await page.locator('[data-cleo-views] button[data-view="atlas"]').isVisible().catch(() => false))) fr.push('Enter on the collapsed switcher did not open it'); else ev.collapsedSwitcherKeys = 2;
      }
      await page.focus('[data-cleo-views] button[data-view="atlas"]').catch(() => {}); await page.keyboard.press('Enter'); await page.waitForTimeout(600);
      if ((await page.evaluate(STATE)).view !== 'atlas') { fr.push('Enter on the Atlas segment did not switch'); success = 'no'; }
      if (!(await page.locator('[data-cleo-views] button[data-view="gallery"]').isVisible().catch(() => false))) { await page.focus('[data-cleo-views] button[aria-pressed=true]').catch(() => {}); await page.keyboard.press('Space'); await page.waitForTimeout(300); }
      await page.focus('[data-cleo-views] button[data-view="gallery"]').catch(() => {}); await page.keyboard.press('Space'); await page.waitForTimeout(600);
      if ((await page.evaluate(STATE)).view !== 'gallery') fr.push('Space on the Gallery segment did not switch');
      // open a card by keyboard, focus trap, Esc returns focus
      const opener = await page.evaluate(() => { const c = [...document.querySelectorAll('main .gc a[href^="#p"], main li.pl a[href^="#p"], main li.pl button.pl-n')].find(e => e.offsetParent); if (!c) return null; c.setAttribute('data-qc-opener', ''); c.focus(); return (c.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40); });
      await page.keyboard.press('Enter'); await page.waitForTimeout(800);
      const st1 = await page.evaluate(STATE); if (!st1.sheet) { fr.push('Enter on a card opened no sheet'); success = 'no'; }
      else {
        const trap = await keyboard(page, 25); const out = trap.filter(s => !s.inDialog); if (out.length) fr.push(out.length + ' of 25 Tabs left the open sheet');
        await page.keyboard.press('Escape'); await page.waitForTimeout(600);
        const back = await page.evaluate(() => { const a = document.activeElement, o = document.querySelector('[data-qc-opener]'); const card = o && o.closest('li.pl, .gc, article');
          return { sheet: !![...document.querySelectorAll('[role=dialog]')].find(d => d.offsetParent && d.querySelector('[data-sh-pos]')), focus: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40), same: a === o, sameCard: !!(card && card.contains(a)) }; });
        if (back.sheet) fr.push('Esc did not close the sheet'); else if (opener && !back.same) fr.push('focus after Esc went to "' + back.focus + '"' + (back.sameCard ? ' (same card, not the opener)' : ', outside the opener\'s card'));
        ev.opener = opener; ev.after = back;
      }
      // pager by keyboard
      const pg = await page.evaluate(() => { const b = [...document.querySelectorAll('.g-pager a, .g-pager button')].find(x => /^2$/.test(x.textContent.trim())); if (!b) return null; b.focus(); return true; });
      if (pg) { await page.keyboard.press('Enter'); await page.waitForTimeout(600); if (!/pg=2/.test((await page.evaluate(STATE)).hash)) fr.push('Enter on pager "2" did not page'); }
    } else {
      const firstLink = stops.findIndex(s => s.tag === 'A' && s.t && !s.skip); ev.firstLinkAt = firstLink + 1;
    }
    J('J-07', C, success === 'no' ? 'no' : fr.length ? 'partial' : 'yes', stops.length, fr, ev);
    await ctx.close();
  }
  // J-08 200 % zoom
  {
    const fr = []; const { ctx, page, st } = await open(rel, 'zoom200', { theme, hash: city ? '#p=' + top.id : '' });
    const ov = await page.evaluate(() => ({ sw: document.scrollingElement.scrollWidth, w: innerWidth }));
    if (ov.sw > ov.w + 1) fr.push(`horizontal scroll: ${ov.sw} > ${ov.w}`);
    if (city) {
      const t = await page.evaluate(STATE); const x = page.locator('[role=dialog] [data-sh=x]').filter({ visible: true }).first();
      const xb = await x.boundingBox().catch(() => null); if (!t.sheet) fr.push('sheet did not open at 200 %'); else if (!xb || xb.y < 0 || xb.x + xb.width > 721) fr.push('sheet Close is off-screen at 200 %');
      await page.keyboard.press('Escape'); await page.waitForTimeout(400);
      for (const v of ['atlas', 'gallery']) if (!(await switchTo(page, v))) fr.push('switcher segment ' + v + ' not reachable at 200 %');
    }
    const s = await shot(page, `j08-${tag}`);
    J('J-08', { ...C, vp: '1440@200%' }, ov.sw > ov.w + 1 ? 'no' : fr.length ? 'partial' : 'yes', 0, fr, { overflow: ov, errors: st.errors.slice(0, 2) }, s);
    await ctx.close();
  }
  // J-09 reduced motion
  {
    const fr = []; const { ctx, page } = await open(rel, vp, { theme, motion: 'reduce', hash: city ? '#p=' + top.id : '' });
    if (city) { await page.locator('[data-cleo-tray]').filter({ visible: true }).first().click().catch(() => {}); await page.waitForTimeout(300); }
    const mv = await page.evaluate(() => { const ms = v => Math.max(...String(v).split(',').map(x => parseFloat(x) * (/ms/.test(x) ? 1 : 1000) || 0));
      const bad = []; document.querySelectorAll('body *').forEach(e => { const s = getComputedStyle(e); const d = Math.max(ms(s.transitionDuration), s.animationName !== 'none' ? ms(s.animationDuration) : 0);
        if (d > 10 && e.getClientRects().length) bad.push((e.id ? '#' + e.id : e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0]) + ' ' + d + 'ms'); });
      return { bad: [...new Set(bad)].slice(0, 12), count: bad.length, smooth: getComputedStyle(document.documentElement).scrollBehavior }; });
    if (mv.count) fr.push(mv.count + ' elements still animate > 10 ms'); if (mv.smooth === 'smooth') fr.push('scroll-behavior is smooth under reduced motion');
    J('J-09', C, !fr.length ? 'yes' : mv.count > 10 ? 'no' : 'partial', 0, fr, mv);
    await ctx.close();
  }
  // J-10 map library blocked
  {
    const fr = []; const { ctx, page, st } = await open(rel, vp, { theme, hard: true, hash: city ? '#view=atlas' : '', settle: 1500 });
    if (st.errors.length) fr.push(st.errors.length + ' errors: ' + st.errors[0]);
    let ev = { errors: st.errors.slice(0, 3) };
    if (city) {
      const ids = await page.evaluate(REACH, 'atlas'); const all = await page.evaluate(() => { if (window.Cleo && Cleo.defer) Cleo.defer.all(); return document.querySelectorAll('li.pl').length; });
      const msg = await page.evaluate(() => /map (couldn.t load|unavailable|is unavailable)|every place is listed/i.test(document.body.innerText));
      if (all !== T.N) fr.push(`${all} of ${T.N} records in the DOM`); if (!msg) fr.push('no "map unavailable" message in Atlas');
      await page.evaluate(id => { location.hash = 'view=atlas&p=' + id; }, top.id); await page.waitForTimeout(700);
      if (!(await page.evaluate(STATE)).sheet) fr.push('sheet did not open with the map blocked');
      ev = { ...ev, listed: all, atlasVisible: ids.length, msg };
    }
    const s = await shot(page, `j10-${tag}`);
    J('J-10', C, st.errors.length || (city && ev.listed !== T.N) ? 'no' : fr.length ? 'partial' : 'yes', 0, fr, ev, s);
    await ctx.close();
  }
  // J-11 storage blocked
  {
    const fr = []; const { ctx, page, st } = await open(rel, vp, { theme, noStorage: true });
    let ev = {};
    if (city) {
      const h = page.locator('main button.heart, main button[aria-label^="Save"]').filter({ visible: true }).first();
      if (await h.count()) { await h.click().catch(() => {}); await page.waitForTimeout(400); ev.saved = (await page.evaluate(STATE)).saved; if (ev.saved !== 1) fr.push('save did not work in memory'); } else fr.push('no save control visible');
      await switchTo(page, 'atlas'); if ((await page.evaluate(STATE)).view !== 'atlas') fr.push('view switch failed with storage blocked');
    }
    ev.notice = await page.evaluate(() => (document.body.innerText.match(/[^.\n]*(won.t be (saved|kept)|can.t (save|remember)|private (mode|browsing)|storage)[^.\n]*/i) || [''])[0].trim().slice(0, 120));
    if (city && !ev.notice) fr.push('no notice that saved items will not persist');
    if (st.errors.length) fr.push(st.errors.length + ' errors: ' + st.errors[0]);
    J('J-11', C, st.errors.length ? 'no' : fr.length ? 'partial' : 'yes', city ? 2 : 0, fr, { ...ev, errors: st.errors.slice(0, 3) });
    await ctx.close();
  }
}
async function journeysHub(rel, vp, theme) {
  const C = { page: rel, vp, theme }; const tag = `${pageKey(rel)}-${vp}-${theme}`;
  console.log(`\n[journeys] ${rel} @${vp} ${theme}`);
  { // J-01h discover from a hub: reach Tokyo and one of its places
    const steps = { n: 0 }, fr = []; const { ctx, page, st } = await open(rel, vp, { theme });
    if (rel === 'index.html') {
      const q = page.locator('#cleo-q').filter({ visible: true }).first();
      if (await q.count()) { await q.fill('Tokyo'); steps.n++; await page.waitForTimeout(900);
        const hit = page.locator('a[href*="tokyo"]').filter({ visible: true }).first(); await click(page, hit, steps, fr, 'Tokyo result'); }
      else { fr.push('no visible search box: used a city link'); await click(page, page.locator('a[href*="tokyo"]').filter({ visible: true }).first(), steps, fr, 'Tokyo link'); }
    } else await click(page, page.locator('a[href*="tokyo"]').filter({ visible: true }).first(), steps, fr, 'Tokyo card');
    await page.waitForLoadState('load').catch(() => {}); await page.waitForTimeout(900);
    const onCity = /tokyo/.test(page.url());
    let t = onCity ? await page.evaluate(STATE) : {};
    const anchor = /#p-([\w.~-]+)/.exec(page.url());
    if (onCity && anchor && !t.sheet) {
      const inView = await page.evaluate(id => { const e = document.getElementById('p-' + id); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.top < innerHeight && r.bottom > 0; }, anchor[1]);
      fr.push('the hub links to a place with #p-' + anchor[1] + ': the sheet does not open' + (inView ? ' (the card is in view)' : ' and the card is not in view'));
    }
    if (onCity && !t.sheet) { await click(page, page.locator('main .gc a[href^="#p"], main li.pl a[href^="#p"]').filter({ visible: true }).first(), steps, fr, 'a Tokyo place'); t = await page.evaluate(STATE); }
    const s = await shot(page, `j01h-${tag}`);
    J('J-01h', C, onCity && t.sheet ? (steps.n <= 4 && !fr.length ? 'yes' : 'partial') : 'no', steps.n, fr, { url: page.url().replace(base, '/'), sheet: t.sheet && t.sheet.title, errors: st.errors.slice(0, 2) }, s);
    // J-06 for a hub: Back returns to the hub at the same scroll
    const fr6 = []; await page.goto(base + 'beta/' + rel); await page.waitForTimeout(600); await page.evaluate(() => scrollTo({ top: 900, behavior: 'instant' })); await page.waitForTimeout(300);
    const y0 = await page.evaluate(() => Math.round(scrollY)); const l = page.locator('main a[href*=".html"]').filter({ visible: true });
    let clicked = false; for (let i = 0; i < Math.min(await l.count(), 40); i++) { const bb = await l.nth(i).boundingBox(); if (bb && bb.y > 80 && bb.y < VP[vp].viewport.height - 80) { await l.nth(i).click().catch(() => {}); clicked = true; break; } }
    await page.waitForTimeout(900); const away = page.url(); await page.goBack().catch(() => {}); await page.waitForTimeout(900);
    const y1 = await page.evaluate(() => Math.round(scrollY)).catch(() => -1);
    if (!clicked) fr6.push('no link in view to follow'); if (!page.url().endsWith(rel) && !page.url().endsWith(rel.replace('index.html', ''))) fr6.push('Back did not return to the hub');
    if (Math.abs(y1 - y0) > 40) fr6.push(`Back restored scrollY ${y1}, was ${y0}`);
    await page.goForward().catch(() => {}); await page.waitForTimeout(700); if (page.url() !== away) fr6.push('Forward did not return to ' + away.replace(base, '/'));
    J('J-06', C, !fr6.length ? 'yes' : 'partial', 2, fr6, { y0, y1 });
    await ctx.close();
  }
  for (const id of ['J-02', 'J-03', 'J-04', 'J-05']) J(id, C, 'n/a', 0, ['city-page journey'], {});
  await commonJourneys(rel, vp, theme, null, null);
}

// ---------------------------------------------------------------- C. sweep
const ALLOW = JSON.parse(fs.readFileSync(path.join(ROOT, 'design', 'beta', 'casing', 'allowlist.json'), 'utf8'));
// Proper nouns the QC lane exempts on top of the casing allowlist: the product name, languages, and every collection,
// cuisine, area and source name in any guide (a hub or the landing page quotes them). Reported separately if used.
const QC_EXEMPT = ['Cleo', 'English', 'Japanese', 'French', 'German', 'Dutch', 'Vietnamese', 'Chinese', 'Malay', 'Thai', 'Korean', 'Tamil', 'Indonesian', 'Khmer', 'Burmese', 'Lao', 'Filipino'];
const GLOBAL_EXEMPT = (() => { const x = new Set(QC_EXEMPT); Object.values(JSON_BY_BETA).forEach(d => {
  (d.collections || []).forEach(c => x.add(c.n.replace(/^★\s*/, ''))); (d.cuisines || []).forEach(c => x.add(c.n)); (d.areas || []).forEach(a => { x.add(a.n); x.add(a.n.split(' (')[0]); });
  if (d.name) x.add(d.name); Object.values(d.sources || {}).forEach(g => Object.values(g).forEach(s => { [s.t, s.l, s.k].forEach(v => v && x.add(v)); })); }); return [...x]; })();
const SWEEP = new Function('cfg', `${P_VIS}
  const W = innerWidth, out = {};
  // S-13 overflow
  const sw = document.scrollingElement.scrollWidth; out.overflow = { sw, w: W, offenders: [] };
  if (sw > W + 1) document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.right > W + 1 && r.width && vis(e) && out.overflow.offenders.length < 6 && getComputedStyle(e).position !== 'fixed' && !e.closest('[class*=rail],[class*=scroller],.g-rail,.rail,[style*=overflow]'))
    out.overflow.offenders.push((e.id ? '#' + e.id : e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0]) + ' →' + Math.round(r.right)); });
  // S-10 targets: hit-tested 44×44 around the centre; prose links exempt
  const ctrls = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=tab], summary, [tabindex="0"]')].filter(vis);
  const small = [];
  for (const e of ctrls) { const r = e.getBoundingClientRect(); if (r.width >= 44 && r.height >= 44) continue;
    if (r.bottom < 0 || r.top > innerHeight * 6) continue;
    if (e.tagName === 'A' && e.parentElement && /^(P|LI|SPAN|EM|DD|FIGCAPTION|SMALL|TD)$/.test(e.parentElement.tagName) && (e.parentElement.textContent.length - e.textContent.length) >= 15) continue;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2; let hit = 0, tot = 0;
    if (cy > 0 && cy < innerHeight) { for (const [dx, dy] of [[-21, 0], [21, 0], [0, -21], [0, 21]]) { tot++; const h = document.elementFromPoint(cx + dx, cy + dy); if (h && (h === e || e.contains(h))) hit++; } }
    else { continue; }
    if (hit < 4) small.push({ el: (e.getAttribute('aria-label') || e.textContent || e.tagName).replace(/\\s+/g, ' ').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height), hit: hit + '/' + tot, cls: String(e.className).split(' ')[0] }); }
  out.targets = { checked: ctrls.length, small: small.length, sample: small.slice(0, 8) };
  // S-11 contrast (and S-09 credit contrast)
  const lum = c => { const m = /rgba?\\(([^)]+)\\)/.exec(c); if (!m) return null; const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return p; };
  const L = p => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2]); };
  // background = the ancestor chain. Known limit: a positioned sibling under the text (a sliding pressed-state indicator,
  // pointer-events:none) is not seen, so every S-11 FAIL is checked on a screenshot before it is filed.
  const bgOf = e => bgAnc(e);
  const bgAnc = e => { let layers = []; for (let n = e; n && n.nodeType === 1; n = n.parentElement) { const s = getComputedStyle(n);
      if (s.backgroundImage && s.backgroundImage !== 'none' && !/gradient/.test(s.backgroundImage)) return null; if (/gradient/.test(s.backgroundImage)) return null;
      if (n.tagName === 'IMG' || n.tagName === 'PICTURE') return null;
      const c = lum(s.backgroundColor); if (c && (c[3] === undefined || c[3] > 0)) { layers.push(c); if (c[3] === undefined || c[3] >= 1) break; } }
    let base = [255, 255, 255]; if (!layers.length || (layers[layers.length - 1][3] !== undefined && layers[layers.length - 1][3] < 1)) base = matchMedia('(prefers-color-scheme: dark)').matches ? [0, 0, 0] : [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) { const a = layers[i][3] === undefined ? 1 : layers[i][3]; base = base.map((v, k) => v * (1 - a) + layers[i][k] * a); } return base; };
  const ratio = (fg, bg) => { const a = fg[3] === undefined ? 1 : fg[3]; const f = fg.slice(0, 3).map((v, k) => v * a + bg[k] * (1 - a)); const l1 = L(f), l2 = L(bg); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const fails = [], seenC = new Set(); let tested = 0, unknown = 0; const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode()) && tested < 2500;) { const t = n.textContent.trim(); if (t.length < 2) continue; const e = n.parentElement; if (!e || !vis(e) || e.closest('svg,noscript,script,style')) continue;
    const r = e.getBoundingClientRect(); if (r.width <= 2 || r.height <= 2) continue;   // visually hidden text if (r.top > innerHeight * 8) continue; tested++;
    const s = getComputedStyle(e); const fg = lum(s.color); const bg = bgOf(e); if (!fg || !bg) { unknown++; continue; }
    const px = parseFloat(s.fontSize), bold = +s.fontWeight >= 700; const large = px >= 24 || (bold && px >= 18.66);
    const cr = ratio(fg, bg); const need = large ? 3 : 4.5;
    if (cr < need - 0.005) { const k = s.color + '|' + String(e.className).split(' ')[0]; if (!seenC.has(k)) { seenC.add(k); fails.push({ t: t.slice(0, 30), cr: +cr.toFixed(2), need, px, cls: (e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0]).slice(0, 36), fg: s.color }); } } }
  out.contrast = { tested, unknown, fails: fails.length, sample: fails.slice(0, 10) };
  // S-06 truncation / clipping
  const clip = [], trunc = [];
  document.querySelectorAll('body *').forEach(e => { if (!e.firstChild || !vis(e) || e.closest('svg')) return; const bx = e.getBoundingClientRect(); if (bx.width <= 2 || bx.height <= 2) return; const s = getComputedStyle(e);
    const hidden = /hidden|clip/.test(s.overflowX + s.overflowY); if (!hidden) return; const ownText = [...e.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
    if (!ownText && e.children.length) return;
    if (e.matches('button, a, [role=button]') && e.querySelector('svg') && bx.width <= 52) return;   // icon control with a hidden text label
    if (Math.abs(parseFloat(s.textIndent)) >= bx.width * 0.9 || /^(100|200)%$/.test(s.textIndent)) return;   // text-indent image replacement: the label is hidden on purpose
    const over = e.scrollWidth > e.clientWidth + 2 || e.scrollHeight > e.clientHeight + 4; if (!over) return;
    const d = { el: (e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0]).slice(0, 36), t: e.textContent.trim().slice(0, 40) };
    if (s.textOverflow === 'ellipsis' || +s.webkitLineClamp > 0 || s.webkitLineClamp !== 'none' && s.webkitLineClamp) trunc.push(d); else if (e.textContent.trim().length > 1 && !/sr-only|vh|visually/.test(e.className)) clip.push(d); });
  out.clip = { clipped: clip.length, truncated: trunc.length, clipSample: clip.slice(0, 6), truncSample: trunc.slice(0, 6) };
  // S-07 widows (single short last word alone on its line)
  const wid = [];
  document.querySelectorAll('h1,h2,h3,.lead,.gc-n,.pl-n,.d1,.d2,.d3').forEach(e => { if (!vis(e) || wid.length > 20) return; const tn = [...e.childNodes].filter(c => c.nodeType === 3 && c.textContent.trim()); const last = tn[tn.length - 1]; if (!last) return;
    const txt = last.textContent.replace(/\\s+$/, ''); const i = txt.search(/\\S+$/); const j = txt.slice(0, i).search(/\\S+\\s*$/); if (i <= 0 || j < 0) return;
    const rg = document.createRange(); rg.setStart(last, i); rg.setEnd(last, txt.length); const a = rg.getClientRects()[0]; rg.setStart(last, j); rg.setEnd(last, j + 1); const b = rg.getClientRects()[0];
    if (a && b && a.top > b.top + 2 && txt.slice(i).length <= 7 && e.getClientRects()[0].height > a.height * 1.6) wid.push(e.textContent.trim().slice(-40)); });
  out.widows = { n: wid.length, sample: wid.slice(0, 6) };
  // S-09 credits: every visible photo has its own visible, unclipped credit
  const imgs = [...document.querySelectorAll('main img, header img')].filter(i => vis(i) && !/\\.svg(\\?|$)/.test(i.currentSrc || i.src) && i.naturalWidth > 64 && i.getBoundingClientRect().width > 40);
  const credBad = [];
  imgs.forEach(i => { const box = i.closest('figure, .gc, .cover, .photo, .pl-cover, [class*=hero], article, li, section') || i.parentElement;
    const c = box && [...box.querySelectorAll('.gc-cred, figcaption, [class*=cred]')].find(x => /photo|cc |public domain|wikimedia|©/i.test(x.textContent));
    if (!c) { credBad.push({ img: (i.currentSrc || i.src).split('/').pop().slice(0, 40), why: 'no credit' }); return; }
    const r = c.getBoundingClientRect(), cs = getComputedStyle(c);
    if (!vis(c) || r.height < 8) credBad.push({ img: (i.currentSrc || i.src).split('/').pop().slice(0, 40), why: 'credit not visible' });
    else if (c.scrollWidth > c.clientWidth + 2 && /hidden|clip/.test(cs.overflow + cs.overflowX)) credBad.push({ img: (i.currentSrc || i.src).split('/').pop().slice(0, 40), why: 'credit clipped' + (cs.textOverflow === 'ellipsis' ? ' (ellipsis)' : ''), t: c.textContent.trim().slice(0, 50) }); });
  out.credits = { photos: imgs.length, bad: credBad.length, sample: credBad.slice(0, 5) };
  // S-02 runtime inline styles
  const RAW = /(^|;)\\s*(color|background(-color)?|border(-color)?|font-size|border-radius|box-shadow|letter-spacing)\\s*:\\s*(?!var\\()[^;]*(#[0-9a-f]{3,8}|rgb|hsl|\\d+px|\\d+(\\.\\d+)?r?em)/i;
  const inl = [...document.querySelectorAll('[style]')].filter(e => RAW.test(e.getAttribute('style')) && !e.closest('svg,.leaflet-container'));
  out.inline = { n: inl.length, sample: inl.slice(0, 5).map(e => e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0] + ' {' + e.getAttribute('style').slice(0, 60) + '}') };
  // S-03 spacing rhythm (4 px scale) and S-04 alignment
  let tot = 0, off = 0; const offv = {};
  [...document.querySelectorAll('main *')].filter(vis).slice(0, 1500).forEach(e => { const s = getComputedStyle(e);
    for (const p of ['marginTop', 'marginBottom', 'paddingTop', 'paddingLeft', 'rowGap', 'columnGap']) { const v = parseFloat(s[p]); if (!v || isNaN(v) || v <= 2) continue; tot++; if (Math.abs(v - Math.round(v / 4) * 4) > 0.6) { off++; offv[Math.round(v * 10) / 10] = (offv[Math.round(v * 10) / 10] || 0) + 1; } } });
  out.rhythm = { measured: tot, offScale: off, share: tot ? +(off / tot).toFixed(3) : 0, top: Object.entries(offv).sort((a, b) => b[1] - a[1]).slice(0, 6) };
  const main = document.querySelector('main'); const edges = {};
  if (main) [...main.querySelectorAll(':scope > *, :scope > * > *')].filter(vis).forEach(e => { const r = e.getBoundingClientRect(); if (r.width < W * 0.5 || r.top > innerHeight * 4) return; const x = Math.round(r.left); edges[x] = (edges[x] || 0) + 1; });
  out.align = { edges: Object.keys(edges).length, list: Object.entries(edges).sort((a, b) => b[1] - a[1]).slice(0, 6) };
  // S-08 sentence case of interface labels
  const ex = (cfg.exempt || []).filter(x => x && x.length > 2).sort((a, b) => b.length - a.length);
  const phr = cfg.phrases.slice().sort((a, b) => b.length - a.length); const words = new Set(cfg.words);
  const keep = w => words.has(w) || (w === w.toUpperCase() && /[A-Z]/.test(w)) || /[A-Z]/.test(w.slice(1));
  const sc = s => { const g = []; const put = m => { g.push(m); return '\\u0000' + (g.length - 1) + '\\u0000'; };
    for (const p of phr.concat(ex)) { const esc = p.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'); s = s.replace(new RegExp('(?<![\\\\w])' + esc + '(?![\\\\w])', 'g'), put); }
    let first = !s.replace(/^[★\\s]+/, '').startsWith('\\u0000');
    s = s.replace(/[A-Za-zÀ-ɏḀ-ỿ][\\wÀ-ɏḀ-ỿ'’]*/g, w => { if (first) { first = false; return w; } return keep(w) ? w : w[0].toLowerCase() + w.slice(1); });
    return s.replace(/\\u0000(\\d+)\\u0000/g, (m, i) => g[+i]); };
  const cas = []; const segs = new Set();
  document.querySelectorAll('h1,h2,h3,h4,button,[role=tab],label,summary,th,legend,.chip,nav a,.eyebrow,.kicker').forEach(e => { if (!vis(e) || e.closest('li.pl .pl-n,.gc-n,.ge h3,[class*=src],.recby,footer .fine')) return;
    const by = new Map(); const tw2 = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw2.nextNode());) { const pe = n.parentElement; if (!pe || !vis(pe) || pe.getBoundingClientRect().width <= 2 || getComputedStyle(pe).textTransform === 'uppercase') continue; by.set(pe, (by.get(pe) || '') + n.textContent); }
    by.forEach(v => { const t = v.replace(/\\s+/g, ' ').trim(); if (t && t.length <= 70 && t.split(' ').length >= 2) segs.add(t); }); });
  segs.forEach(t => { const fixed = sc(t); if (fixed !== t) cas.push({ t: t.slice(0, 60), want: fixed.slice(0, 60) }); });
  out.casing = { n: cas.length, sample: cas.slice(0, 10) };
  out.cls = { cls: +(window.__cls || 0).toFixed(4), shifts: (window.__shifts || []).slice(0, 5) };
  return out;`);
async function sweepPage(rel, vp, theme) {
  const C = { page: rel, vp, theme }; const T = truth(rel);
  const exempt = [];
  if (T) { T.P.forEach(p => { exempt.push(p.n, (p.n || '').split(' (')[0], p.nat); }); (T.d.areas || []).forEach(a => exempt.push(a.n, a.n.split(' (')[0]));
    (T.d.collections || []).forEach(c => exempt.push(c.n.replace(/^★\s*/, ''))); (T.d.cuisines || []).forEach(c => exempt.push(c.n));
    Object.values(T.d.sources || {}).forEach(g => Object.values(g).forEach(s => exempt.push(s.t, s.l, s.k))); exempt.push(T.d.name); }
  MANIFEST.forEach(m => { const d = JSON_BY_BETA[m.beta]; if (d && d.name) exempt.push(d.name); });
  exempt.push('United States', 'Southeast Asia', 'Singapore', 'Vietnam', 'Japan', 'Germany', 'Belgium', 'Ohio', 'Pennsylvania', 'West Virginia', 'New York', 'Silicon Valley', 'San Francisco', 'Washington, DC');
  const { ctx, page, st } = await open(rel, vp, { theme, settle: 2600 });
  const r = await page.evaluate(SWEEP, { exempt: [...new Set(exempt.concat(GLOBAL_EXEMPT).filter(Boolean))], phrases: ALLOW.phrases, words: ALLOW.words }).catch(e => ({ error: e.message.slice(0, 200) }));
  if (r.error) { check('S-14', C, 'FAIL', { probe: r.error }); await ctx.close(); return; }
  const wide = vp === 1440 || vp === 390;
  let shotPath = null; const failing = [];
  const S = (id, status, ev) => { check(id, C, status, ev); if (status === 'FAIL') failing.push(id); };
  S('S-13', ok(r.overflow.sw <= r.overflow.w + 1), r.overflow);
  S('S-10', r.targets.small === 0 ? 'PASS' : 'FAIL', r.targets);
  S('S-11', r.contrast.fails === 0 ? 'PASS' : 'FAIL', r.contrast);
  S('S-06', r.clip.clipped ? 'FAIL' : r.clip.truncated ? 'WARN' : 'PASS', r.clip);
  S('S-07', r.widows.n ? 'WARN' : 'PASS', r.widows);
  S('S-09', r.credits.photos === 0 ? 'N/A' : ok(!r.credits.bad), r.credits);
  S('S-02', r.inline.n ? 'WARN' : 'PASS', r.inline);
  S('S-03', r.rhythm.share <= 0.05 ? 'PASS' : 'WARN', r.rhythm);
  S('S-04', r.align.edges <= 3 ? 'PASS' : 'WARN', r.align);
  if (theme === 'light') S('S-08', r.casing.n ? 'FAIL' : 'PASS', r.casing);
  S('S-12', r.cls.cls <= 0.05 ? 'PASS' : r.cls.cls <= 0.1 ? 'WARN' : 'FAIL', r.cls);
  S('S-14', ok(!st.errors.length), { errors: st.errors.slice(0, 4) });
  if (wide && theme === 'light') {
    const stops = await keyboard(page, 30); const bad = stops.filter(s => s.tag !== 'BODY' && !s.ring);
    S('S-15', bad.length ? 'FAIL' : 'PASS', { stops: stops.length, noRing: bad.slice(0, 5).map(s => s.tag + ' ' + s.t) });
  }
  if (failing.length) shotPath = await shot(page, `s-${pageKey(rel)}-${vp}-${theme}`);
  if (shotPath) R.checks.filter(c => c.page === rel && c.vp === vp && c.theme === theme && c.status === 'FAIL').forEach(c => { c.shot = shotPath; });
  await ctx.close();
}
async function componentStates(rel, vp) {
  const C = { page: rel, vp, theme: 'light' }; const fr = [];
  const { ctx, page } = await open(rel, vp, {});
  const btn = page.locator('[data-cleo-views] button[aria-pressed=false]').filter({ visible: true }).first();
  const style = l => l.evaluate(e => { const s = getComputedStyle(e); return [s.backgroundColor, s.color, s.borderColor, s.boxShadow, s.outlineStyle, s.textDecorationLine].join('|'); });
  const ev = {};
  if (await btn.count()) {
    const s0 = await style(btn); await btn.hover(); await page.waitForTimeout(250); ev.hover = (await style(btn)) !== s0;
    await page.mouse.move(0, 0); await page.evaluate(() => document.activeElement && document.activeElement.blur());
    await btn.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); ev.focus = (await style(btn)) !== s0;
    const pressed = page.locator('[data-cleo-views] button[aria-pressed=true]').first(); ev.pressed = (await style(pressed)) !== s0;
  } else fr.push('no switcher to probe');
  const prev = page.locator('.g-pager button[disabled], .g-pager [aria-disabled=true]').first();
  ev.disabled = (await prev.count()) ? await prev.evaluate(e => { const s = getComputedStyle(e); return { cursor: s.cursor, opacity: s.opacity, focusable: e.tabIndex >= 0 && !e.disabled }; }) : null;
  ['hover', 'focus', 'pressed'].forEach(k => { if (ev[k] === false) fr.push(k + ' style identical to rest'); });
  if (ev.disabled && ev.disabled.focusable) fr.push('disabled pager control is focusable');
  await ctx.close();
  // empty
  const o1 = await open(rel, vp, { hash: '#q=zzqxjv' }); ev.empty = await o1.page.evaluate(new Function(`${P_VIS} const t = document.body.innerText; const m = /no (places|matches|results)[^\\n]{0,80}|nothing (matches|found)[^\\n]{0,80}/i.exec(t);
    const host = [...document.querySelectorAll('.view-host, .g-rows, .pager, .ms-head, main')].find(vis);
    return { said: host ? host.innerText.replace(/\\s+/g, ' ').slice(0, 160) : '', msg: m ? m[0].slice(0, 100) : null, action: [...document.querySelectorAll('button,a')].filter(vis).some(b => /show all|clear|reset/i.test(b.textContent)) };`));
  if (!ev.empty.msg) fr.push('no empty-state message for q= with no match'); if (!ev.empty.action) fr.push('empty state offers no clear / show-all');
  await o1.ctx.close();
  // loading: delay the page JSON 2.5 s and look at Insights at 600 ms
  const o2 = await open(rel, vp, { hash: '#view=insights', settle: 600, route: async (route, u) => { if (/\/data\/places\//.test(u)) { await new Promise(r => setTimeout(r, 2500)); await route.continue().catch(() => {}); return true; } return false; } });
  ev.loading = await o2.page.evaluate(() => ({ busy: !!document.querySelector('[aria-busy=true]'), text: (/loading|counting|drawing|one moment/i.exec(document.body.innerText) || [null])[0] }));
  if (!ev.loading.busy && !ev.loading.text) fr.push('no loading state while Insights data is in flight');
  await o2.ctx.close();
  // error: abort the page JSON
  const o3 = await open(rel, vp, { hash: '#view=insights', settle: 1500, route: async (route, u) => { if (/\/data\/places\//.test(u)) { await route.abort('failed'); return true; } return false; } });
  ev.error = await o3.page.evaluate(() => (/(couldn.t|could not|failed to|unable to) (load|draw|reach)[^\n]{0,80}/i.exec(document.body.innerText) || [null])[0]);
  if (!ev.error) fr.push('no error message when the page data fails');
  const s = await shot(o3.page, `s05-error-${pageKey(rel)}-${vp}`);
  await o3.ctx.close();
  check('S-05', C, fr.length ? (fr.length > 2 ? 'FAIL' : 'WARN') : 'PASS', { ...ev, friction: fr, shot: s });
}
function staticCensus() {
  const py = path.join(ROOT, 'design', 'beta', 'eval', 'r7', 'tools', 'probe-css.py');
  try {
    const out = JSON.parse(execFileSync('python3', [py, ROOT, LABEL], { encoding: 'utf8' }));
    R.census = out; const raw = Object.fromEntries(['font-size', 'border-radius', 'letter-spacing', 'box-shadow'].map(k => [k, out[k] ? out[k].raw : null]));
    // raw colours outside tokens.css
    let css = ''; for (const f of fs.readdirSync(path.join(BETA, 'assets'))) if (f.endsWith('.css') && f !== 'tokens.css') css += fs.readFileSync(path.join(BETA, 'assets', f), 'utf8');
    css = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/--[\w-]+\s*:[^;}]+/g, '');
    const colours = (css.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi) || []).filter(c => !/^rgba?\(0,\s*0,\s*0,\s*0\)$/.test(c));
    raw.colour = colours.length; R.census.rawColours = [...new Set(colours)].slice(0, 20);
    check('S-01', { page: 'beta/assets/*.css' }, Object.values(raw).every(v => !v) ? 'PASS' : 'FAIL', raw);
  } catch (e) { check('S-01', { page: 'beta/assets/*.css' }, 'FAIL', { probe: e.message.slice(0, 160) }); }
}

// ---------------------------------------------------------------- run
async function pool(items, n, fn) { let i = 0; await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const it = items[i++]; try { await fn(it); } catch (e) { console.log('  ERROR ' + JSON.stringify(it) + ' ' + e.message.split('\n')[0]); check('S-14', { page: it.rel || it[0], vp: it.vp, theme: it.theme }, 'FAIL', { harness: e.message.split('\n')[0].slice(0, 200) }); } } })); }
function summarize() {
  const by = {}; R.checks.forEach(c => { by[c.id] = by[c.id] || { PASS: 0, FAIL: 0, WARN: 0, PENDING: 0, 'N/A': 0 }; by[c.id][c.status]++; });
  R.byCheck = by; R.finished = new Date().toISOString();
  const lines = [`# QC run ${LABEL}`, '', `SHA ${sha} · ${R.started} → ${R.finished} · ${R.rig}`, '', '| Id | Check | PASS | WARN | FAIL | N/A |', '|---|---|---|---|---|---|'];
  Object.keys(CHECKS).forEach(k => { const b = by[k]; if (b) lines.push(`| ${k} | ${CHECKS[k]} | ${b.PASS} | ${b.WARN} | ${b.FAIL} | ${b['N/A']} |`); });
  lines.push('', '## Journeys', '', '| Id | Page | Viewport | Theme | Success | Steps | Friction |', '|---|---|---|---|---|---|---|');
  R.journeys.forEach(j => lines.push(`| ${j.id} | ${j.page} | ${j.vp} | ${j.theme} | ${j.success} | ${j.steps} | ${(j.friction || []).join('; ').replace(/\|/g, '/').slice(0, 300)} |`));
  lines.push('', '## Failures (first 400)', '');
  R.checks.filter(c => c.status === 'FAIL').slice(0, 400).forEach(c => lines.push(`- **${c.id}** ${c.page || ''} ${c.vp || ''} ${c.theme || ''} ${c.view || c.chart || c.sub || c.lens || ''}: \`${JSON.stringify(c.evidence).slice(0, 300).replace(/`/g, "'")}\``));
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'qc.json'), JSON.stringify(R, null, 1));
  fs.writeFileSync(path.join(OUT, 'summary.md'), lines.join('\n') + '\n');
  console.log('\nwrote ' + path.relative(ROOT, OUT) + '/{qc.json,summary.md}');
  const tot = { PASS: 0, FAIL: 0, WARN: 0, 'N/A': 0, PENDING: 0 }; R.checks.forEach(c => tot[c.status]++); console.log(JSON.stringify(tot));
}
(async () => {
  const { chromium } = loadPlaywright();
  const srv = await serve(); base = `http://127.0.0.1:${srv.address().port}/`;
  browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') && fs.statSync('/opt/pw-browsers/chromium').isFile() ? '/opt/pw-browsers/chromium' : undefined });
  fs.mkdirSync(OUT, { recursive: true });
  const vps = opt('--vps', '').split(',').filter(Boolean).map(Number);
  try {
    if (ONLY.includes('patterns')) for (const rel of pick(PILOTS)) for (const vp of (vps.length ? vps : [390, 1440]).filter(v => v === 390 || v === 1440)) {
      try { await patterns(rel, vp); } catch (e) { console.log('  ERROR patterns ' + rel + ' ' + e.stack.split('\n').slice(0, 2).join(' ')); check('P-13', { page: rel, vp }, 'FAIL', { harness: e.message.slice(0, 200) }); }
    }
    if (ONLY.includes('journeys')) {
      const jobs = [];
      for (const rel of pick(PILOTS.concat(HUBS))) for (const vp of (vps.length ? vps : [390, 1440]).filter(v => v === 390 || v === 1440)) for (const theme of THEMES) jobs.push({ rel, vp, theme });
      await pool(jobs, Math.max(1, Math.min(JOBS, 3)), async j => { if (HUBS.includes(j.rel)) await journeysHub(j.rel, j.vp, j.theme); else await journeysCity(j.rel, j.vp, j.theme); });
    }
    if (ONLY.includes('sweep')) {
      staticCensus();
      const all = pick(MANIFEST.map(m => m.beta)); const jobs = [];
      for (const rel of all) {
        for (const vp of (vps.length ? vps : [390, 768, 1024, 1440])) jobs.push({ rel, vp, theme: 'light' });
        if (THEMES.includes('dark')) for (const vp of (vps.length ? vps : [390, 1440]).filter(v => v === 390 || v === 1440)) jobs.push({ rel, vp, theme: 'dark' });
      }
      console.log(`\n[sweep] ${all.length} pages, ${jobs.length} loads`);
      await pool(jobs, JOBS, j => sweepPage(j.rel, j.vp, j.theme));
      for (const rel of pick(PILOTS)) for (const vp of [390, 1440]) await componentStates(rel, vp).catch(e => check('S-05', { page: rel, vp }, 'FAIL', { harness: e.message.slice(0, 160) }));
    }
  } finally { summarize(); await browser.close(); srv.close(); }
})();
