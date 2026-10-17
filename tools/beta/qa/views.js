#!/usr/bin/env node
/**
 * Beta QA — Wave 3 view harness (design/beta/views/PLAN.md §5; RFC §9.1 row "tools/beta/qa/views.js"). QA lane.
 *
 * Real Chromium (preinstalled; never `playwright install`), every off-origin request blocked, 390×844 and 1440×900.
 *   Q-01  per-view metrics: run `node beta/metrics.js --view <v>` (metrics.js carries the view= runs); not repeated here.
 *   Q-02  nocdn     each pilot × view with Leaflet, tiles and fonts blocked AND localStorage/sessionStorage throwing:
 *                   the view is applied (html[data-view]), every place id of the page JSON is in the DOM, 0 JS errors,
 *                   and the switcher still switches (and reflects aria-pressed) with no storage.
 *   Q-03  links     deep-link matrix: #view= × #p= × lens (a=, t=, q=) × pg= / all= (Gallery): the URL reproduces the
 *                   view, the sheet and the lens count (= Cleo.lens over the record set); a receiver whose stored
 *                   preference differs still gets the sender's view; a switch is one history entry (Back / Forward).
 *   Q-04  honesty   the views' visible text after mounting (sheet open), on top of the offline gate in npm test
 *                   (beta/qa/test-honesty.js): no price / rating / booking / hours wording outside the stated-gap line.
 * A view that no lane has registered yet reports PENDING (not FAIL), so the harness runs from day one and tightens as
 * views land. Usage: cd tools && node beta/qa/views.js [--only nocdn,links,default,honesty] [--pilots tokyo,cleveland]
 * Output: qa/beta-w3/views.json (+ screenshots in qa/beta-w3/).
 */
'use strict';
const { DEFAULT_VIEW, SWITCH_ORDER } = require('./default-view');   // D-46
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const OUT = path.join(ROOT, 'qa', 'beta-w3');
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const ONLY = opt('--only', '').split(',').filter(Boolean);
const want = k => !ONLY.length || ONLY.includes(k);
const ALL_PILOTS = ['cleveland.html', 'cities/tokyo.html', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html'];
const PILOTS = opt('--pilots', '') ? ALL_PILOTS.filter(p => opt('--pilots').split(',').some(k => p.includes(k))) : ALL_PILOTS;
const VIEWS = ['gallery', 'atlas', 'guidebook', 'insights'];
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
const pageJson = rel => {
  const m = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'manifest.json'), 'utf8')).pages.find(p => p.beta === rel);
  const f = path.join(BETA, 'data', 'places', String(m.key || m.live || rel).replace(/\.html$/, '').replace(/^cities\//, '').replace(/\//g, '--') + '.json');
  const alt = fs.readdirSync(path.join(BETA, 'data', 'places')).map(x => path.join(BETA, 'data', 'places', x))
    .find(x => { try { return JSON.parse(fs.readFileSync(x, 'utf8')).beta === rel; } catch (e) { return false; } });
  return JSON.parse(fs.readFileSync(fs.existsSync(f) && JSON.parse(fs.readFileSync(f, 'utf8')).beta === rel ? f : alt, 'utf8'));
};

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
const BLOCKED_NET = /net::ERR_|Failed to load resource|ERR_BLOCKED|ERR_FAILED/;
const NO_STORAGE = () => {
  for (const k of ['localStorage', 'sessionStorage']) {
    try { Object.defineProperty(window, k, { configurable: true, get() { throw new DOMException('blocked', 'SecurityError'); } }); } catch (e) { /* ignore */ }
  }
};
const PREF = v => { try { localStorage.setItem('cleo:v1:view', JSON.stringify(v)); } catch (e) { /* ignore */ } };

let browser, base;
async function open(rel, vp, o = {}) {
  const ctx = await browser.newContext({ ...VP[vp], serviceWorkers: 'block', reducedMotion: 'reduce' });
  if (o.noStorage) await ctx.addInitScript(NO_STORAGE);
  if (o.pref) await ctx.addInitScript(PREF, o.pref);
  const page = await ctx.newPage();
  const st = { errors: [] };
  const origin = new URL(base).origin;
  await ctx.route('**/*', route => {
    const u = route.request().url(), t = route.request().resourceType();
    if (o.hard && (/leaflet/i.test(u) || t === 'font')) return route.abort('blockedbyclient');   // Leaflet + fonts blocked too
    if (u.startsWith(origin) || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    return route.abort('blockedbyclient');                                                        // CDN + tiles blocked
  });
  page.on('pageerror', e => st.errors.push('pageerror: ' + String(e.message || e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error' && !BLOCKED_NET.test(m.text())) st.errors.push(m.text().slice(0, 200)); });
  page.on('dialog', d => d.accept());
  await page.goto(base + 'beta/' + rel + (o.hash || ''), { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(o.settle || 600);
  return { ctx, page, st };
}
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 60 }).catch(() => {});

const R = { head: null, checks: [] };
function check(group, name, ok, evidence) {
  const s = ok === null ? 'PENDING' : ok ? 'PASS' : 'FAIL';
  R.checks.push({ group, name, status: s, evidence });
  console.log(`  ${s.padEnd(7)} [${group}] ${name}` + (evidence !== undefined ? ' = ' + JSON.stringify(evidence).slice(0, 260) : ''));
}
// in-page probes
const STATE = () => {
  if (window.Cleo && Cleo.defer && Cleo.defer.all) Cleo.defer.all();
  const ids = new Set();
  document.querySelectorAll('li.pl[id], [data-id]').forEach(e => ids.add(e.getAttribute('data-id') || e.id.replace(/^p-/, '')));
  const sheet = document.querySelector('[role=dialog][aria-modal=true]:not([hidden])');
  const btns = [...document.querySelectorAll('[data-cleo-views] button[data-view]')];
  return { view: document.documentElement.getAttribute('data-view'), ids: [...ids],
    registered: !!(window.Cleo && Cleo.views && Cleo.views.register), switcher: btns.filter(b => !b.closest('[hidden]')).map(b => b.getAttribute('data-view')),
    pressed: (btns.find(b => b.getAttribute('aria-pressed') === 'true') || {}).dataset ? btns.find(b => b.getAttribute('aria-pressed') === 'true').getAttribute('data-view') : null,
    sheet: sheet ? (sheet.querySelector('h1,h2,#sh-t') || sheet).textContent.trim().slice(0, 80) : null,
    hash: location.hash, shown: [...document.querySelectorAll('li.pl')].filter(c => !c.hidden && !c.closest('[hidden]')).length,
    text: document.body.innerText };
};
// what the lens should show, computed from the record set with THE predicate (P-02)
const LENS_N = o => { if (Cleo.defer && Cleo.defer.all) Cleo.defer.all(); return [...document.querySelectorAll('li.pl')].filter(c => Cleo.lens.match(c, o)).length; };
// phones show the switcher as a disclosure (only the current view's button, aria-expanded): open it first
async function switchTo(page, v) {
  const btn = page.locator(`[data-cleo-views] button[data-view="${v}"]`).first();
  if (!(await btn.count())) return false;
  if (!(await btn.isVisible())) { const cur = page.locator('[data-cleo-views] button[aria-pressed="true"]').first(); if (await cur.count()) { await cur.click(); await page.waitForTimeout(250); } }
  if (!(await btn.isVisible())) return false;
  await btn.click(); await page.waitForTimeout(500); return true;
}
const viewOk = (s, v) => s.view === v ? true : (s.registered || s.switcher.length ? false : null);

async function nocdn() {
  console.log('\n# Q-02 no-CDN (Leaflet, tiles, fonts blocked) + storage throwing, per view');
  for (const rel of PILOTS) {
    const d = pageJson(rel), ids = d.places.map(p => p.id);
    for (const v of VIEWS) for (const vp of ['mobile', 'desktop']) {
      const tag = `${rel} #view=${v} ${vp}`;
      const { ctx, page, st } = await open(rel, vp, { hash: '#view=' + v, hard: true, noStorage: true, settle: 900 });
      const s = await page.evaluate(STATE);
      const applied = viewOk(s, v);
      check('nocdn', tag + ': view applied', applied, s.view);
      const have = new Set(s.ids), miss = ids.filter(i => !have.has(i));
      check('nocdn', tag + ': every place in the DOM', !miss.length, { n: ids.length, missing: miss.length, e: miss.slice(0, 3) });
      check('nocdn', tag + ': 0 JS errors', !st.errors.length, st.errors.slice(0, 3));
      if (vp === 'mobile' && rel === 'cities/tokyo.html') await shot(page, `nocdn-${v}-m`);
      // the switcher works with no storage: switch to the next view, html[data-view] + aria-pressed follow
      const next = VIEWS[(VIEWS.indexOf(v) + 1) % VIEWS.length];
      if (await switchTo(page, next)) {
        const s2 = await page.evaluate(STATE);
        check('nocdn', tag + ': switcher → ' + next + ' with no storage', s2.view === next && s2.pressed === next && !st.errors.length, { view: s2.view, pressed: s2.pressed, err: st.errors.slice(0, 2) });
      } else check('nocdn', tag + ': switcher present', applied === null ? null : false, s.switcher);
      await ctx.close();
    }
  }
}

async function links() {
  console.log('\n# Q-03 deep-link matrix (#view × #p × lens × pg/all), stored preference ≠ link, Back/Forward');
  for (const rel of PILOTS.slice(0, 2)) {
    const d = pageJson(rel);
    const pid = d.places.find(p => !/closed/i.test(p.n)).id, area = d.areas[0].id, q = String(d.places[0].n).split(/\s+/)[0];
    const LENSES = [{}, { a: area }, { t: 1 }, { q }];
    if (want('links')) for (const vp of ['mobile', 'desktop']) for (const v of VIEWS) {
      for (const L of LENSES) for (const withP of [false, true]) {
        const o = Object.assign({ view: v }, L, withP ? { p: pid } : {});
        const hash = '#' + Object.keys(o).map(k => k + '=' + encodeURIComponent(o[k])).join('&');
        const pref = VIEWS[(VIEWS.indexOf(v) + 2) % 4];     // receiver prefers a different view
        const { ctx, page, st } = await open(rel, vp, { hash, pref });
        const s = await page.evaluate(STATE);
        const ok = viewOk(s, v);
        const lensN = Object.keys(L).length ? await page.evaluate(LENS_N, L) : null;
        const lensOk = lensN === null || v === 'insights' || v === 'guidebook' || s.shown === lensN;
        const sheetOk = !withP || !!s.sheet;
        check('links', `${rel} ${vp} ${hash} (pref ${pref})`, ok === null ? null : ok && lensOk && sheetOk && !st.errors.length,
          { view: s.view, sheet: withP ? s.sheet : undefined, shown: lensN === null ? undefined : s.shown, want: lensN === null ? undefined : lensN, err: st.errors.slice(0, 2) });
        await ctx.close();
      }
      if (v === 'gallery') for (const extra of ['&pg=2', '&all=1']) {
        const { ctx, page, st } = await open(rel, vp, { hash: '#view=gallery' + extra });
        const s = await page.evaluate(STATE);
        const ok = viewOk(s, 'gallery');
        check('links', `${rel} ${vp} #view=gallery${extra}`, ok === null ? null : ok && s.hash.includes(extra.slice(1)) && !st.errors.length, { view: s.view, hash: s.hash });
        await ctx.close();
      }
    }
    // a switch is one history entry: gallery → atlas → Back → Forward
    if (want('links')) for (const vp of ['mobile', 'desktop']) {
      const { ctx, page, st } = await open(rel, vp, { hash: '#view=gallery' });
      if (!(await switchTo(page, 'atlas'))) { check('links', `${rel} ${vp} Back/Forward across a switch`, null, 'no switcher yet'); await ctx.close(); continue; }
      const a = (await page.evaluate(STATE)).view;
      await page.goBack(); await page.waitForTimeout(400); const b = (await page.evaluate(STATE)).view;
      await page.goForward(); await page.waitForTimeout(400); const c = (await page.evaluate(STATE)).view;
      check('links', `${rel} ${vp} Back/Forward across a switch`, a === 'atlas' && b === 'gallery' && c === 'atlas' && !st.errors.length, { a, b, c, err: st.errors.slice(0, 2) });
      await ctx.close();
    }
    // D-46 precedence: the view= hash, then the reader's stored choice, then the default (Atlas); the switcher in D-46 order.
    // Its own group ('default'), so `--only links` stays the QA-75 link set that perf08-regress.sh gates on
    if (want('default')) for (const vp of ['mobile', 'desktop']) {
      for (const [pref, want] of [[null, DEFAULT_VIEW], ['guidebook', 'guidebook']]) {
        const { ctx, page, st } = await open(rel, vp, pref ? { pref } : {});
        const s = await page.evaluate(STATE);
        const order = await page.evaluate(() => [...document.querySelectorAll('[data-cleo-views] [data-view]')].map(b => b.getAttribute('data-view')).filter((v, i, a) => a.indexOf(v) === i));
        check('default', `${rel} ${vp}: no hash, ${pref ? 'stored ' + pref : 'nothing stored'} → ${want}${pref ? '' : '; switcher order ' + SWITCH_ORDER.join(', ')}`,
          s.view === want && (pref || order.join() === SWITCH_ORDER.join()) && !st.errors.length, { view: s.view, order, err: st.errors.slice(0, 2) });
        await ctx.close();
      }
    }
  }
}

const HONESTY = /(?:[$€£¥₫₩]\s?\d|(?<![A-Z][a-z]+ )\bprices?\b|\bratings?\b|\b\d(?:\.\d)?\s?(?:\/\s?5|stars?)\b|\bbook now\b|\bbooking\b|\breservations?\b|\bavailability\b|\bopen(?:ing)? hours\b|\bopen now\b)/i;
async function honesty() {
  console.log('\n# Q-04 honesty on the mounted views (chrome text; record prose is data, reported by test-honesty.js)');
  for (const rel of PILOTS) {
    const d = pageJson(rel);
    const data = new Set(); const add = x => { if (typeof x === 'string') x.split(/\n+/).forEach(y => y.trim().length > 3 && data.add(y.trim())); else if (x && typeof x === 'object') Object.values(x).forEach(add); };
    add(d.places); add(d.notes); add(d.sourceIndex); add(d.sources);
    const longest = [...data].filter(x => x.length > 12).sort((a, b) => b.length - a.length);
    for (const v of VIEWS) {
      const { ctx, page } = await open(rel, 'mobile', { hash: '#view=' + v + '&p=' + encodeURIComponent(d.places[0].id), settle: 900 });
      const s = await page.evaluate(STATE);
      const bad = s.text.split(/\n+/).map(l => l.trim()).filter(l => l && !data.has(l))
        .map(l => l.replace(/We don['’]t track opening hours or prices|Prices, ratings and times are quoted from the source at the time of research \([^)]*\)\.|No ratings, prices or (?:opening )?hours are shown|We don['’]t add ratings, (?:review counts, )?prices or opening hours of our own|review-aggregator star ratings never count as the recommender|Closed — kept for the record · .*/g, ''))
        // longest first (as test-honesty.js does): a short data string inside a longer one ("Closed Monday." inside a record's
        // "Look for" line) must not be cut first, or the longer record prose no longer matches and its remainder reads as chrome
        .filter(l => { let t = l; for (const x of longest) if (t.includes(x)) t = t.split(x).join(' '); return HONESTY.test(t); });
      check('honesty', `${rel} #view=${v} (sheet open)`, viewOk(s, v) === null && !bad.length ? null : !bad.length, bad.slice(0, 3));
      await ctx.close();
    }
  }
}

(async () => {
  const { chromium } = loadPlaywright();
  try { browser = await chromium.launch(); } catch (e) { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const srv = await serve(); base = 'http://127.0.0.1:' + srv.address().port + '/';
  try { R.head = require('child_process').execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim(); } catch (e) { /* no git */ }
  if (want('nocdn')) await nocdn();
  if (want('links') || want('default')) await links();   // 'default' = the D-46 precedence rows only
  if (want('honesty')) await honesty();
  await browser.close(); srv.close();
  const n = s => R.checks.filter(c => c.status === s).length;
  fs.writeFileSync(path.join(OUT, 'views' + (ONLY.length ? '-' + ONLY.join('-') : '') + '.json'), JSON.stringify(R, null, 1));
  console.log(`\n>>> ${n('PASS')} PASS, ${n('FAIL')} FAIL, ${n('PENDING')} PENDING (view not registered yet) on ${R.head}`);
  process.exit(n('FAIL') ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
