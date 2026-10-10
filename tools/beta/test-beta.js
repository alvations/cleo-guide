#!/usr/bin/env node
'use strict';
/**
 * tools/beta/test-beta.js — the beta gate, wired into `npm test`.
 *
 *  1. COUNTS: every beta page carries exactly its live page's places (new-engine pages: rendered cards;
 *     legacy mirror pages: their P/F arrays), and the per-page JSON + search index agree with live.
 *  2. REPRODUCIBLE: a fresh in-memory build equals beta/ on disk (`build.js --check`), so a live rebuild
 *     that changes a city without regenerating beta fails here, not in production.
 *  3. GUARDS: no key-required map surface (engine_guard lists), no document.write, no third-party script,
 *     no literal escapes in visible text — on EVERY beta page, mirrors included.
 *  4. NO-CDN RENDER (jsdom): the Tokyo page renders every place with the network gone and the map absent,
 *     with localStorage throwing; filters are lenses; deep links land; with Leaflet present, markers draw.
 *  5. BUDGETS: page weight, client JS, search index.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execFileSync } = require('child_process');
const { JSDOM } = require('jsdom');
const { extractPage } = require('./lib/extract');
const { forbidden } = require('./lib/forbidden');

const ROOT = path.resolve(__dirname, '..', '..');
const BETA = path.join(ROOT, 'beta');
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
let failures = 0;
const chk = (name, got, want) => {
  const ok = typeof want === 'function' ? want(got) : got === want;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name} = ${JSON.stringify(got)}`);
  if (!ok) failures++;
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

const manifest = JSON.parse(rd('beta/data/manifest.json'));
const generated = new Set(manifest.generated);

// ── 1. counts, every page ───────────────────────────────────────────────────
console.log('\n== COUNTS: beta == live, every place page ==');
let bad = [], pages = 0, places = 0;
const searchIdx = JSON.parse(rd('beta/data/search.json'));
for (const row of manifest.pages.filter(p => p.kind === 'city')) {
  const live = extractPage(rd(row.live)); const want = { P: live.P.length, F: live.F.length };
  pages++; places += want.P + want.F;
  if (row.gen === 'none') { bad.push(`${row.live}: no beta page`); continue; }
  const html = rd('beta/' + row.beta);
  let got;
  if (generated.has(row.beta)) {
    got = { P: (html.match(/<li class="pl[ "][^>]*data-k="s"/g) || []).length, F: (html.match(/<li class="pl[ "][^>]*data-k="f"/g) || []).length };
  } else { const b = extractPage(html); got = { P: b.P.length, F: b.F.length }; }
  if (got.P !== want.P || got.F !== want.F) bad.push(`${row.beta}: beta ${got.P}+${got.F} != live ${want.P}+${want.F}`);
  const j = JSON.parse(rd(`beta/data/places/${row.key.replace(/\//g, '--')}.json`));
  if (j.places.length !== want.P + want.F) bad.push(`data/places/${row.key}: ${j.places.length} != live ${want.P + want.F}`);
}
chk('place pages checked', pages, n => n >= 80);
chk('pages whose beta count != live', bad, b => b.length === 0);
chk('search index items == live total', searchIdx.items.length, places);

// ── 2. reproducible from data ───────────────────────────────────────────────
console.log('\n== REPRODUCIBLE: fresh build == beta/ on disk ==');
let rep = 'PASS';
try { execFileSync(process.execPath, [path.join(__dirname, 'build.js'), '--check'], { stdio: 'pipe' }); }
catch (e) { rep = String(e.stderr || e.stdout).trim().split('\n').slice(-4).join(' | '); }
chk('build.js --check', rep, 'PASS');
let refused = '';
try { execFileSync(process.execPath, [path.join(__dirname, 'build.js'), '--check'], { stdio: 'pipe', env: Object.assign({}, process.env, { CLEO_BETA_SELFTEST_DROP: '1' }) }); }
catch (e) { refused = String(e.stderr); }
chk('count gate refuses a page that lost a place', /refused to write[\s\S]*records, live page has/.test(refused), true);

// ── 3. guards on every beta page ────────────────────────────────────────────
console.log('\n== GUARDS: every beta page (new engine + mirrors) ==');
const walk = (d, acc = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p, acc); else acc.push(p); } return acc; };
const htmls = walk(BETA).filter(p => p.endsWith('.html'));
const LEAK = /\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}|<\\\//;
const g = { forbidden: [], docwrite: [], cdnScript: [], leak: [] };
for (const p of htmls) {
  const h = fs.readFileSync(p, 'utf8'), rel = path.relative(BETA, p);
  if (forbidden(h).length) g.forbidden.push(rel + ' ' + forbidden(h));
  if (/document\.write\s*\(/.test(h)) g.docwrite.push(rel);
  if (generated.has(rel.split(path.sep).join('/'))) {
    if (/<script[^>]+src="https?:/i.test(h)) g.cdnScript.push(rel);
    const vis = h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
    if (LEAK.test(vis)) g.leak.push(rel);
  }
}
for (const p of walk(path.join(BETA, 'assets', 'js'))) { const h = fs.readFileSync(p, 'utf8'); if (forbidden(h).length) g.forbidden.push(path.relative(BETA, p)); if (/document\.write\s*\(/.test(h)) g.docwrite.push(path.relative(BETA, p)); }
chk('beta pages scanned', htmls.length, n => n >= 85);
chk('key-required map surface (engine_guard lists)', g.forbidden, a => a.length === 0);
chk('document.write', g.docwrite, a => a.length === 0);
chk('third-party <script src> on new-engine pages', g.cdnScript, a => a.length === 0);
chk('literal escapes in visible text (new-engine pages)', g.leak, a => a.length === 0);

// ── 3b. hubs: page set == live, counts computed, never typed (M1-20, M1-22) ─────────
console.log('\n== ROLLOUT + HUBS: beta page set == live, every hub count == its page ==');
{
  chk('live pages not on the new engine', manifest.pages.filter(p => p.gen !== 'new').map(p => p.live), a => a.length === 0);
  chk('live pages with no beta file', manifest.pages.filter(p => !fs.existsSync(path.join(BETA, p.beta))).map(p => p.live), a => a.length === 0);
  // + beta-only pages the generator declares (saved.html; FE-B how-we-choose.html, 404.html) — nothing undeclared.
  const liveHtml = manifest.pages.map(p => p.beta).concat(manifest.generated.filter(g => !manifest.pages.some(p => p.beta === g))).sort();
  chk('beta HTML set == live page set (+ generator-declared beta-only pages)', htmls.map(p => path.relative(BETA, p).split(path.sep).join('/')).sort().join(), liveHtml.join());
  const byKey = Object.fromEntries(manifest.pages.filter(p => p.counts).map(p => [p.key, p.counts.P + p.counts.F]));
  const cardsOf = h => [...h.matchAll(/<li class="dest" data-page="([^"]+)"[\s\S]*?<span class="dest-c">([\d,]+) places?\b/g)].map(m => [m[1], +m[2].replace(/,/g, '')]);
  const liveC = JSON.parse(rd('data/countries.json')).countries.filter(c => c.live);
  const hubs = [['index.html', manifest.pages.filter(p => p.kind === 'city' && liveC.some(c => c.key === p.country)).map(p => p.key)]]
    .concat(liveC.filter(c => c.hub && c.hub !== 'index.html').map(c => [c.hub, manifest.pages.filter(p => p.kind === 'city' && p.country === c.key).map(p => p.key)]))
    .concat([['Singapore/singapore-old.html', manifest.pages.filter(p => p.kind === 'city' && /^(Singapore|Vietnam)\//.test(p.live)).map(p => p.key)]]);
  for (const [hub, want] of hubs) {
    const h = rd('beta/' + hub), cards = cardsOf(h), dir = path.posix.dirname(hub);
    chk(`${hub}: place pages of this hub not carded`, want.filter(k => !cards.some(([c]) => c === k)), a => a.length === 0);
    chk(`${hub}: cards whose count != the page`, cards.filter(([k, n]) => byKey[k] !== n), a => a.length === 0);
    chk(`${hub}: cards linking to a missing beta page`, [...h.matchAll(/<li class="dest"[^>]*>\s*<a href="([^"]+)"/g)].map(m => m[1]).filter(p => !fs.existsSync(path.join(BETA, dir, p))), a => a.length === 0);
  }
}

// ── 3c. numbers are computed (M1-20), sources navigable (M1-10), art from verified pins (M1-13) ──
console.log('\n== DATA: computed counts, source index, map art (every place page) ==');
{
  const { PROSE_COUNT } = require('./lib/stats');
  const VER = new Set(['high', 'med']);
  const bad = { stats: [], prose: [], src: [], art: [], checked: [] };
  for (const row of manifest.pages.filter(p => p.kind === 'city')) {
    const j = JSON.parse(rd(`beta/data/places/${row.key.replace(/\//g, '--')}.json`));
    const P = j.places, st = j.stats;
    const sights = P.filter(p => p.kind === 'sight').length;
    if (st.total !== P.length || st.sights !== sights || st.food !== P.length - sights || st.closed !== P.filter(p => p.closed).length)
      bad.stats.push(row.key);
    const maxChecked = P.map(p => p.pv && p.pv.checked).filter(Boolean).sort().pop() || null;
    if (st.lastChecked !== maxChecked) bad.checked.push(`${row.key}: ${st.lastChecked} != ${maxChecked}`);
    // Every record is attributed; every source's n is exactly the records citing it.
    if (P.some(p => !p.src || !p.src.length)) bad.src.push(row.key + ': record with no source');
    for (const s of j.sourceIndex) {
      const n = P.filter(p => p.src.includes(s.id)).length;
      if (n !== s.n || s.ids.length !== n) bad.src.push(`${row.key}/${s.id}: n ${s.n} != ${n}`);
    }
    // Art draws exactly the verified pins: one circle per verified record, nothing else.
    const ver = P.filter(p => p.la != null && p.pv && VER.has(p.pv.pin));
    if (ver.length) {
      const f = path.join(BETA, j.art.map.src.split('?')[0]);
      const circles = fs.existsSync(f) ? (fs.readFileSync(f, 'utf8').match(/<circle /g) || []).length : -1;
      if (circles !== ver.length) bad.art.push(`${row.key}: map.svg ${circles} pins != ${ver.length} verified`);
      for (const [a, x] of Object.entries(j.art.areas)) {
        const want = ver.filter(p => p.a === a).length, fa = path.join(BETA, x.src.split('?')[0]);
        const got = fs.existsSync(fa) ? (fs.readFileSync(fa, 'utf8').match(/<circle /g) || []).length : -1;
        if (got !== want) bad.art.push(`${row.key}/${a}: ${got} != ${want}`);
      }
    }
    // Any count phrase a generated page prints matches the computed stats (live prose drifts).
    if (generated.has(row.beta)) {
      const html = rd('beta/' + row.beta);
      const tally = {};
      for (const m of html.matchAll(/<li class="pl[ "][^>]*\sdata-src="([^"]+)"/g)) for (const id of m[1].split(' ')) tally[id] = (tally[id] || 0) + 1;
      for (const x of j.sourceIndex) if (tally[x.id] !== x.n) bad.src.push(`${row.beta}: cards citing ${x.id} ${tally[x.id]} != ${x.n}`);
      const vis = html.replace(/<script[\s\S]*?<\/script>/g, '');
      for (const m of vis.matchAll(PROSE_COUNT)) {
        const [a, b] = m[0].match(/\d[\d,]*/g).map(x => +x.replace(/,/g, ''));
        if (a !== st.sights || b !== st.food) bad.prose.push(`${row.beta}: "${m[0]}" != ${st.sights}/${st.food}`);
      }
    }
  }
  chk('page stats == records', bad.stats, a => a.length === 0);
  chk('last checked == max(statusChecked)', bad.checked, a => a.length === 0);
  chk('count phrases on generated pages == computed', bad.prose, a => a.length === 0);
  chk('source index: n == records citing; every record sourced', bad.src, a => a.length === 0);
  // M1-10 / B-19: source names in sentence case — no shouting publisher keys on cards (acronyms excepted).
  {
    const { sentenceCase } = require('./lib/model');
    const shout = new Set();
    for (const p of manifest.pages.filter(p => p.kind === 'city')) for (const m of rd('beta/' + p.beta).matchAll(/<p class="pl-s">([\s\S]*?)<\/p>/g))
      for (const t of m[1].replace(/<span class="lbl">[^<]*<\/span>/, '').replace(/<[^>]+>/g, '').split(', ')) if (t.trim() && sentenceCase(t.trim()) !== t.trim()) shout.add(t.trim());
    chk('upper-case source names on cards', [...shout].slice(0, 5), a => a.length === 0);
  }
  chk('map art draws exactly the verified pins', bad.art, a => a.length === 0);
  const cle = JSON.parse(rd('beta/data/places/cleveland.json')).sourceIndex;
  const num = id => (cle.find(s => s.id === id) || {}).numbered;
  chk('Cleveland source view: News 5 numbered entries (validator invariant)', num('news-5'), 100);
  chk('Cleveland source view: There She Goes numbered entries (validator invariant)', num('there-she-goes'), 23);
  const site = JSON.parse(rd('beta/data/sources.json')).sources;
  chk('site source index covers every page citation', site.reduce((s, x) => s + x.n, 0),
    manifest.pages.filter(p => p.kind === 'city').reduce((s, row) => s + JSON.parse(rd(`beta/data/places/${row.key.replace(/\//g, '--')}.json`)).sourceIndex.reduce((t, x) => t + x.n, 0), 0));
}

// ── 4. no-CDN render of the Tokyo page in jsdom ─────────────────────────────
const TOKYO = 'cities/tokyo.html';
const live = extractPage(rd(TOKYO));
const total = live.P.length + live.F.length;
function boot({ leaflet = false, storage = 'ok', hash = '', page = TOKYO } = {}) {
  // Inline the page's own same-origin scripts (what a browser would fetch from beta/); every other
  // request is impossible in this harness, i.e. the network — and any CDN — is gone.
  let html = rd('beta/' + page).replace(/<script src="((?:\.\.\/)*assets\/js\/[a-z]+\.js)\?v=[^"]*" defer><\/script>/g,
    (m, src) => '<script>' + fs.readFileSync(path.join(BETA, path.dirname(page), src), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>');
  if (leaflet) html = html.replace('</head>', '<script>' + fs.readFileSync(path.join(BETA, 'assets/vendor/leaflet/leaflet.js'), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script></head>');
  const errs = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://x.test/beta/' + page + hash,
    beforeParse(w) {
      const proto = w.SVGSVGElement && w.SVGSVGElement.prototype;
      if (proto && !proto.createSVGRect) proto.createSVGRect = () => ({ x: 0, y: 0, width: 0, height: 0 });
      w.Element.prototype.scrollIntoView = function () {};
      if (storage === 'throws') Object.defineProperty(w, 'localStorage', { get() { throw new Error('SecurityError: storage disabled'); } });
      w.addEventListener('error', e => errs.push('ERR ' + (e.message || e.error)));
    },
  });
  dom.window.console.error = (...a) => errs.push('console.error: ' + a.join(' '));
  return { w: dom.window, d: dom.window.document, errs };
}
const shown = d => d.querySelectorAll('li.pl:not([hidden])').length;

(async () => {
  // Pilot set (BETA-DECISIONS D-27) — every page also passes the count gate; these also render in jsdom.
  console.log('\n== NO-CDN RENDER: pilot set, network gone, map absent, storage throwing ==');
  for (const page of ['cleveland.html', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html']) {
    const L = extractPage(rd(page)), n = L.P.length + L.F.length;
    const { d, errs } = boot({ storage: 'throws', page });
    await sleep(300);
    const cards = [...d.querySelectorAll('li.pl')];
    const vis = cards.filter(li => !li.hidden).length;
    const noSrc = cards.filter(li => { const x = li.querySelector('.pl-s'); return !x || !x.textContent.replace('Recommended by', '').trim(); }).length;
    const closedOk = cards.filter(li => li.hasAttribute('data-closed')).length === L.P.concat(L.F).filter(r => r.closed || /[—–-]+\s*CLOSED\b/i.test(r.n)).length;
    chk(`${page}: ${n} places rendered + visible, all sourced, closed kept, 0 errors`,
      [cards.length, vis, noSrc, closedOk, errs.length], [n, n, 0, true, 0].join() === [cards.length, vis, noSrc, closedOk, errs.length].join() ? (() => true) : (() => false));
  }

  console.log('\n== NO-CDN RENDER: Tokyo, network gone, map absent, storage throwing ==');
  {
    const { w, d, errs } = boot({ storage: 'throws' });
    await sleep(400);
    chk('every place rendered', d.querySelectorAll('li.pl').length, total);
    chk('every place visible by default', shown(d), total);
    chk('cards missing a "Recommended by" line', [...d.querySelectorAll('li.pl')].filter(li => {
      const s = li.querySelector('.pl-s'); return !s || !s.textContent.replace('Recommended by', '').trim(); }).length, 0);
    const closed = [...d.querySelectorAll('li.pl[data-closed]')];
    chk('closed places kept', closed.length, live.P.concat(live.F).filter(r => r.closed || /[—–-]+\s*CLOSED\b/i.test(r.n)).length);
    chk('closed places flagged, none tier-badged', closed.every(li => /^Closed — kept for the record/.test(li.querySelector('.pl-e').textContent)), true);
    chk('stated gaps carried (method notes)', [...d.querySelectorAll('.method .note h3')].map(e => e.textContent).includes('What is thin, and why'), true);
    chk('toolbar enhanced', d.querySelector('[data-cleo-toolbar]').hidden, false);
    chk('map fallback note kept', /listed here either way/.test(d.getElementById('cleo-map').textContent), true);
    const artImg = d.querySelector('#cleo-map .map-art img');
    chk('no-network map shows the verified-pin schematic (M1-06)', !!artImg && fs.existsSync(path.join(BETA, 'cities', artImg.getAttribute('src').split('?')[0])), true);
    const b = d.querySelector('li.pl .pl-save'); b.click();
    chk('save works with storage throwing (in-memory)', d.querySelector('[data-cleo-saved-count]').textContent, '1');
    chk('no js errors', errs, e => e.length === 0);

    console.log('\n== FILTERS ARE LENSES ==');
    w.location.hash = '#mode=food'; await sleep(30);
    chk('food mode shows exactly the food', shown(d), live.F.length);
    const c0 = (live.CATS || []).find(c => live.P.concat(live.F).some(r => (r.g || []).includes(c.id)));
    w.location.hash = '#c=' + c0.id; await sleep(30);
    chk(`collection ${c0.id} shows exactly its places`, shown(d), live.P.concat(live.F).filter(r => (r.g || []).includes(c0.id)).length);
    d.querySelector('[data-cleo-all]').click(); await sleep(30);
    chk('"All" brings every place back', shown(d), total);
    const target = d.querySelectorAll('li.pl[data-k="f"]')[5];
    w.location.hash = '#mode=sights&p=' + target.id.slice(2); await sleep(30);
    chk('deep link to a hidden place lands (filters yield)', !target.hidden && target.classList.contains('is-target'), true);
    const t2 = d.querySelectorAll('li.pl[data-k="s"]')[7];
    w.location.hash = '#mode=food'; await sleep(30);
    w.location.hash = '#p-' + t2.id.slice(2); await sleep(30);
    chk('no-JS anchor link (#p-<id>) is also a deep link', !t2.hidden && t2.classList.contains('is-target'), true);
    const rb = d.querySelector('.rail-i[data-cz]'); rb.click(); await sleep(30);
    chk('rail button applies its cuisine lens', shown(d), live.F.filter(r => (r.cz || []).includes(rb.getAttribute('data-cz'))).length);
    chk('rail tile count == result count', +rb.querySelector('.n').textContent, shown(d));
    chk('no js errors after interaction', errs, e => e.length === 0);
  }
  console.log('\n== MAP: vendored Leaflet present ==');
  {
    const { d, errs } = boot({ leaflet: true });
    await sleep(700);
    const withLL = d.querySelectorAll('li.pl[data-ll]').length;
    chk('leaflet mounted', !!d.querySelector('#cleo-map .leaflet-pane'), true);
    chk('one marker per pinned place', d.querySelectorAll('#cleo-map .leaflet-overlay-pane path').length, withLL);
    const hosts = [...new Set([...fs.readFileSync(path.join(BETA, 'assets/js/city.js'), 'utf8').matchAll(/tileLayer\('https:\/\/([^/']+)/g)].map(m => m[1]))];
    // Tiles that never load (blocked network): after 4 errors the dead map gives way to the schematic + VOICE copy.
    const W = d.defaultView, el = d.getElementById('cleo-map'), hs = {};
    W.Cleo.watchTiles({ on: (ev, fn) => { hs[ev] = fn; } }, () => W.Cleo.mapFallback(el, null));
    for (let i = 0; i < 4; i++) hs.tileerror();
    chk('tiles failed → schematic + "The map couldn’t load" line', [el.getAttribute('data-tiles'), !!el.querySelector('.map-art img'), /map couldn’t load/.test(el.textContent)].join(), 'failed,true,true');
    chk('tile hosts in client (OSM/Esri only)', hosts, h => h.length > 0 && h.every(x => x === 'tile.openstreetmap.org' || x === 'server.arcgisonline.com'));
    chk('no js errors', errs, e => e.length === 0);
  }

  // ── 5. budgets ────────────────────────────────────────────────────────────
  console.log('\n== BUDGETS ==');
  const size = p => fs.statSync(path.join(BETA, p)).size;
  const gz = p => zlib.gzipSync(fs.readFileSync(path.join(BETA, p))).length;
  const KB = n => Math.round(n / 1024);
  const over = [];
  let biggest = ['', 0, 0];
  for (const p of manifest.pages.filter(p => p.kind === 'city').map(p => p.beta)) {
    const raw = KB(size(p)), z = KB(gz(p));
    if (raw > 800 || z > 160) over.push(`${p} ${raw}/${z} KB`);
    if (raw > biggest[1]) biggest = [p, raw, z];
  }
  chk('city pages over 800 KB raw / 160 KB gzip', over, a => a.length === 0);
  console.log(`        (largest: ${biggest[0]} ${biggest[1]} KB raw, ${biggest[2]} KB gzip)`);
  chk('landing ≤ 80 KB raw', KB(size('index.html')), n => n <= 80);
  // FE-A W1 (2026-10-10): raised 40 → 64 KB raw (≈ 18 KB gzip) — 40 was set in Wave 0 before the city sheet, tray, map
  // sync and FE-B's search/states existed. PLT to ratify, or replace with a minify step / gzip budget (docs/BETA-LOG.md).
  chk('client JS total ≤ 64 KB raw', KB(fs.readdirSync(path.join(BETA, 'assets/js')).reduce((s, f) => s + size('assets/js/' + f), 0)), n => n <= 64);
  chk('search index ≤ 250 KB gzip (lazy)', KB(gz('data/search.json')), n => n <= 250);

  console.log(failures ? `\n>>> FAIL — ${failures} beta check(s) failed` : '\n>>> PASS — beta: counts == live, reproducible, guarded, renders with no CDN');
  process.exit(failures ? 1 : 0);
})();
