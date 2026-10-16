#!/usr/bin/env node
/**
 * Beta QA — Wave 5 probe (design/beta/eval/W5-BRIEFS.md; ROUND-4 gaps #2–#8). QA lane.
 * Independent of metrics.js: it checks reachability of the Gallery default itself, so a metrics rule change can be
 * ratified (or not) against what a reader can actually do. Real Chromium, every off-origin request blocked.
 *   gallery   default view is Gallery (no hash, no stored preference) on every pilot, phone + desktop
 *   showall   the pager's "Show all N on one page" shows every record (visible li.pl == N)
 *   deeplink  EVERY id: #p=<id> opens that place's sheet while the Gallery is the view
 *   search    typing a place's name in the page filter shows that place (25 spread samples per pilot)
 *   nojs      JavaScript off: every record is in the canonical list and displayed
 *   first     phone 390×844: a real place card (name + "Recommended by" + opens the place) inside the first screen
 *   macron    DPR 1: "ō" draws different pixels from "o" in the display-name face at 18 and 24 px (macron visible)
 *   motif     sight cards carry a kind motif (data-m) from their collection ids (informational coverage)
 *   mast      the masthead "last checked" link has a ≥ 44 px target and is not above the first card's path
 *   insights  Tokyo Insights initial DOM ≤ 3,000; every chart link has a ≥ 44 px hit area (or the table is the phone default)
 *   weight    Tokyo default view transfer (gzip) < 2.0 MB; no unversioned duplicate art/<key>/map.svg fetch
 *   i18n      string catalogue present; hreflang; no language switcher shown
 * Usage: cd tools && node beta/qa/w5.js   Output: qa/beta-w5/w5.json (+ screenshots)
 */
'use strict';
const { DEFAULT_VIEW } = require('./default-view');   // D-46
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const OUT = path.join(ROOT, 'qa', 'beta-w5');
fs.mkdirSync(OUT, { recursive: true });
const PILOTS = ['cleveland.html', 'cities/tokyo.html', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html'];
const VP = {
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  dpr1: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 },
};
function loadPlaywright() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) {
    try { return require(t); } catch (e) { /* next */ }
  }
  throw new Error('playwright not found');
}
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
let browser, base;
async function open(rel, vp, o = {}) {
  const ctx = await browser.newContext({ ...VP[vp], serviceWorkers: 'block', reducedMotion: 'reduce', javaScriptEnabled: o.js !== false });
  const page = await ctx.newPage();
  const st = { errors: [], gz: 0, raw: 0, urls: [] };
  const origin = new URL(base).origin;
  await ctx.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith(origin) || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    return route.abort('blockedbyclient');
  });
  page.on('pageerror', e => st.errors.push('pageerror: ' + String(e.message || e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error' && !BLOCKED_NET.test(m.text())) st.errors.push(m.text().slice(0, 200)); });
  if (o.weigh) page.on('response', async r => { try { if (!r.url().startsWith(origin)) return; st.urls.push(r.url().slice(origin.length)); const b = await r.body(); st.raw += b.length;
    st.gz += /\.(png|jpg|woff2)$/.test(r.url().split('?')[0]) ? b.length : zlib.gzipSync(b).length; } catch (e) { /* aborted */ } });
  await page.goto(base + 'beta/' + rel + (o.hash || ''), { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(o.settle || 900);
  return { ctx, page, st };
}
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 60 }).catch(() => {});
const R = { head: null, checks: [] };
function check(group, name, ok, evidence) {
  R.checks.push({ group, name, ok: !!ok, evidence });
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  [${group}] ${name}` + (evidence !== undefined ? ' = ' + JSON.stringify(evidence).slice(0, 300) : ''));
}
const placesDir = path.join(BETA, 'data', 'places');
const DATA = {};
for (const f of fs.readdirSync(placesDir)) { const d = JSON.parse(fs.readFileSync(path.join(placesDir, f), 'utf8')); DATA[d.beta] = d; }
const clean = n => String(n).replace(/\s*[—–-]+\s*CLOSED\b.*$/i, '').replace(/\s*\([^)]*\)\s*$/, '').trim();

(async () => {
  const { chromium } = loadPlaywright();
  try { browser = await chromium.launch(); } catch (e) { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const srv = await serve(); base = 'http://127.0.0.1:' + srv.address().port + '/';
  try { R.head = require('child_process').execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim(); } catch (e) { /* no git */ }

  for (const rel of PILOTS) {
    const d = DATA[rel], N = d.places.length, ids = d.places.map(p => p.id);
    console.log(`\n# ${rel} (${N} places)`);
    for (const vp of ['mobile', 'desktop']) {
      // the default view (D-46: Atlas; QA_DEFAULT_VIEW for older pins), then the Gallery itself, pinned by #view=gallery
      { const dv = await open(rel, vp, { settle: 1200 }); const v0 = await dv.page.evaluate(() => document.documentElement.getAttribute('data-view'));
        check('gallery', `${rel} ${vp}: default view is ${DEFAULT_VIEW} (D-46)`, v0 === DEFAULT_VIEW, v0); await dv.ctx.close(); }
      const { ctx, page, st } = await open(rel, vp, { hash: '#view=gallery', settle: 1200 });
      const v = await page.evaluate(() => document.documentElement.getAttribute('data-view'));
      check('gallery', `${rel} ${vp}: #view=gallery opens the Gallery`, v === 'gallery', v);
      if (vp === 'mobile') {
        const first = await page.evaluate(() => {
          const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.height > 60 && r.bottom > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[hidden]'); };
          const cand = [...document.querySelectorAll('li.gc[data-id], li.pl[id], .g-lead[data-id], [data-cleo-lead]')].filter(vis)
            .map(el => { const r = el.getBoundingClientRect(); const a = el.querySelector('a[href*="#p"], a[href*="p="], button[data-p]') || (el.matches('a') ? el : null);
              return { id: el.getAttribute('data-id') || el.id, top: Math.round(r.top + scrollY), name: ((el.querySelector('.gc-n, h3, h2, .pl-n') || {}).textContent || '').trim().slice(0, 40),
                recby: /Recommended by/i.test(el.textContent), opens: !!a }; })
            .sort((a, b) => a.top - b.top);
          return { firstScreen: cand.filter(c => c.top < innerHeight), first: cand[0] || null, vh: innerHeight };
        });
        const ok = first.firstScreen.some(c => c.name && c.opens && c.recby);
        check('first', `${rel} phone: a real place card inside the first screen (name + Recommended by + opens)`, ok, { first: first.first, inScreen: first.firstScreen.length });
        await shot(page, 'first-' + rel.replace(/\//g, '_').replace('.html', ''));
      }
      const sa = page.locator('.g-pager [data-pg="all"]').first();
      let shown = null;
      if (await sa.count() && await sa.isVisible()) { await sa.click(); await page.waitForTimeout(900);
        shown = await page.evaluate(() => { if (window.Cleo && Cleo.defer && Cleo.defer.all) Cleo.defer.all();
          return [...document.querySelectorAll('li.pl')].filter(c => { const cs = getComputedStyle(c); return !c.hidden && !c.closest('[hidden]') && !c.classList.contains('pg-off') && cs.display !== 'none'; }).length; }); }
      else shown = await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); }
        if (window.Cleo && Cleo.defer && Cleo.defer.all) Cleo.defer.all(); return [...document.querySelectorAll('li.pl')].filter(c => !c.hidden && !c.closest('[hidden]') && !c.classList.contains('pg-off')).length; });
      check('showall', `${rel} ${vp}: "Show all" shows every record`, shown === N, { shown, N, pager: await sa.count() });
      check('gallery', `${rel} ${vp}: 0 JS errors`, !st.errors.length, st.errors.slice(0, 3));
      await ctx.close();
    }
    // deep link EVERY id, the default view kept (D-46)
    { const { ctx, page, st } = await open(rel, 'mobile', { settle: 900 });
      const miss = await page.evaluate(async ({ list, want0 }) => {
        const bad = [];
        for (const p of list) {
          location.hash = '#p=' + encodeURIComponent(p.id);
          await new Promise(r => setTimeout(r, 60));
          const t = document.getElementById('sh-t'); const dlg = t && t.closest('[role=dialog]');
          const want = p.n.split(/\s+/)[0].toLowerCase();
          if (!dlg || dlg.hidden || !t.textContent.toLowerCase().includes(want) || document.documentElement.getAttribute('data-view') !== want0) bad.push(p.id);
        }
        return bad;
      }, { list: d.places.map(p => ({ id: p.id, n: clean(p.n) })), want0: DEFAULT_VIEW });
      check('deeplink', `${rel}: #p= opens the sheet for every one of ${N} places, the default view (${DEFAULT_VIEW}) kept`, !miss.length, { missing: miss.length, e: miss.slice(0, 4), err: st.errors.slice(0, 2) });
      await ctx.close(); }
    // search: 25 spread samples via the page filter (the Gallery list, pinned)
    { const { ctx, page, st } = await open(rel, 'mobile', { hash: '#view=gallery', settle: 900 });
      const step = Math.max(1, Math.floor(N / 25)), sample = d.places.filter((p, i) => i % step === 0).slice(0, 25);
      const box = page.locator('#cleo-filter').first();
      const bad = [];
      if (!(await box.count())) bad.push('no #cleo-filter');
      else for (const p of sample) {
        await box.fill(clean(p.n)); await page.waitForTimeout(250);
        const ok = await page.evaluate(id => { const c = document.getElementById('p-' + id); return !!(c && !c.hidden && !c.closest('[hidden]')); }, p.id);
        if (!ok) bad.push(p.id);
      }
      check('search', `${rel}: filter by name shows the place (${sample.length} samples)`, !bad.length, { bad: bad.slice(0, 5), err: st.errors.slice(0, 2) });
      await ctx.close(); }
    // no-JS
    { const { ctx, page } = await open(rel, 'mobile', { js: false, settle: 300 });
      const n = await page.evaluate(() => [...document.querySelectorAll('li.pl')].filter(c => getComputedStyle(c).display !== 'none' && !c.closest('[hidden]')).length);
      const ids2 = await page.evaluate(() => [...document.querySelectorAll('li.pl')].map(c => c.id.replace(/^p-/, '')));
      const missing = ids.filter(i => !ids2.includes(i));
      check('nojs', `${rel}: JS off — every record listed and displayed`, n === N && !missing.length, { displayed: n, N, missing: missing.length });
      await ctx.close(); }
  }

  console.log('\n# macrons at DPR 1');
  for (const vp of ['dpr1']) {
    const { ctx, page } = await open('cities/tokyo.html', vp, { hash: '#view=atlas', settle: 1200 });
    const cls = await page.evaluate(() => { const h = [...document.querySelectorAll('li.pl h3, li.pl .pl-n, .gc-n')].find(e => /Myōjin/.test(e.textContent)); return h ? { font: getComputedStyle(h).fontFamily, weight: getComputedStyle(h).fontWeight } : null; });
    for (const px of [18, 24]) {
      const diff = await page.evaluate(({ px, f }) => {
        const mk = t => { const s = document.createElement('span'); s.textContent = t; s.style.cssText = `position:fixed;left:10px;top:10px;font-size:${px}px;font-family:${f.font};font-weight:${f.weight};line-height:1.6;color:#000;background:#fff;padding:4px`; document.body.appendChild(s); return s; };
        const a = mk('ō'), b = mk('o'); const ra = a.getBoundingClientRect(); b.style.left = (ra.right + 20) + 'px'; const rb = b.getBoundingClientRect();
        return { a: [ra.x, ra.y, ra.width, ra.height], b: [rb.x, rb.y, rb.width, rb.height] };
      }, { px, f: cls || { font: 'serif', weight: '400' } });
      const A = await page.screenshot({ clip: { x: diff.a[0], y: diff.a[1], width: diff.a[2], height: diff.a[3] } });
      const B = await page.screenshot({ clip: { x: diff.b[0], y: diff.b[1], width: diff.a[2], height: diff.a[3] } });
      check('macron', `DPR 1, ${px} px, display-name face (${cls && cls.font.split(',')[0]}): "ō" draws its macron`, cls && !A.equals(B), { font: cls, bytesA: A.length, bytesB: B.length });
    }
    await page.evaluate(() => { const e = [...document.querySelectorAll('li.pl')].find(x => /Myōjin/.test(x.textContent)); if (e) e.scrollIntoView({ block: 'center' }); });
    await page.waitForTimeout(300); await shot(page, 'macron-dpr1');
    await ctx.close();
  }

  console.log('\n# motif by kind, masthead link, insights, weight, i18n');
  { const counts = {}; for (const rel of PILOTS) { const h = fs.readFileSync(path.join(BETA, rel), 'utf8');
      const cards = [...h.matchAll(/<li class="pl[^"]*"[^>]*data-k="s"[^>]*>/g)].map(m => m[0]);
      const withM = cards.filter(c => /data-m="[^"]+"/.test(c)), keyed = withM.filter(c => (c.match(/data-m="([^"]*)"/) || [])[1] !== (c.match(/data-gl="([^"]*)"/) || [])[1]);
      counts[rel] = { sights: cards.length, motif: withM.length, kindKeyed: keyed.length, kinds: new Set(withM.map(c => c.match(/data-m="([^"]*)"/)[1])).size }; }
    check('motif', 'sight cards carry a motif keyed on collection ids (coverage, informational)', Object.values(counts).every(c => c.motif === c.sights), counts); }
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page } = await open('cities/tokyo.html', vp, { hash: '#view=gallery', settle: 1200 });
    const m = await page.evaluate(() => { const a = document.querySelector('[data-cleo-changes]'); if (!a) return null; const r = a.getBoundingClientRect(), cs = getComputedStyle(a);
      return { h: Math.round(r.height), w: Math.round(r.width), lh: cs.lineHeight, display: cs.display }; });
    check('mast', `${vp}: "last checked" link target ≥ 44 px tall`, m && m.h >= 44, m);
    await ctx.close();
  }
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page, st } = await open('cities/tokyo.html', vp, { hash: '#view=insights', settle: 1500 });
    const s = await page.evaluate(() => {
      const links = [...document.querySelectorAll('svg.chart a, .ins a, [data-cleo-insights] a')].filter(a => a.getBoundingClientRect().width > 0);
      const small = links.filter(a => { const r = a.getBoundingClientRect(); return r.height < 44; });
      return { dom: document.getElementsByTagName('*').length, links: links.length, under44: small.length, eg: small.slice(0, 3).map(a => (a.getAttribute('aria-label') || a.textContent).slice(0, 40) + ' ' + Math.round(a.getBoundingClientRect().height)) };
    });
    check('insights', `${vp}: Tokyo Insights initial DOM ≤ 3,000`, s.dom <= 3000, { dom: s.dom });
    check('insights', `${vp}: every chart link has a ≥ 44 px hit area`, s.links > 0 && s.under44 === 0, s);
    check('insights', `${vp}: 0 JS errors`, !st.errors.length, st.errors.slice(0, 2));
    await ctx.close();
  }
  { const { ctx, page, st } = await open('cities/tokyo.html', 'mobile', { weigh: true, settle: 2000 });
    const maps = st.urls.filter(u => /\/art\/[^/]+\/map\.svg/.test(u)), dupes = maps.filter((u, i) => maps.findIndex(x => x.split('?')[0].replace(/\.[0-9a-f]{6,}\./, '.') === u.split('?')[0].replace(/\.[0-9a-f]{6,}\./, '.')) !== i);
    check('weight', `Tokyo default view (${DEFAULT_VIEW}) transfer (gzip est.) < 2.0 MB`, st.gz < 2.0e6, { gzipMB: +(st.gz / 1e6).toFixed(2), rawMB: +(st.raw / 1e6).toFixed(2) });
    check('weight', 'no duplicate art/<key>/map.svg fetch (one map per page)', !dupes.length, { maps, dupes });
    const i = await page.evaluate(() => ({ hreflang: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map(l => l.getAttribute('hreflang')),
      sw: [...document.querySelectorAll('[data-cleo-lang], [data-cleo-locale], select[name=lang]')].filter(e => e.offsetParent).length }));
    const cat = path.join(BETA, 'assets', 'i18n', 'en.json');
    const keys = fs.existsSync(cat) ? Object.keys(JSON.parse(fs.readFileSync(cat, 'utf8'))).length : 0;
    const other = fs.existsSync(path.dirname(cat)) ? fs.readdirSync(path.dirname(cat)).filter(f => f !== 'en.json') : [];
    check('i18n', 'catalogue present (en), no unreviewed locale shipped, hreflang en + x-default, no switcher shown', keys > 0 && !other.length && i.hreflang.includes('en') && i.hreflang.includes('x-default') && !i.sw, { keys, other, ...i });
    await ctx.close(); }

  await browser.close(); srv.close();
  const fails = R.checks.filter(c => !c.ok).length;
  fs.writeFileSync(path.join(OUT, 'w5.json'), JSON.stringify(R, null, 1));
  console.log(`\n>>> ${R.checks.length - fails}/${R.checks.length} PASS, ${fails} FAIL on ${R.head} → qa/beta-w5/w5.json`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
