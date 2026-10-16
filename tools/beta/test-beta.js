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

// ── 1b. guide data (W2 platform): ★ signature, food order, day plans, recently closed ───────────────────
console.log('\n== GUIDE DATA: signature, canon order, day plans, recently closed ==');
{
  const { km, DAY, dishRe, canonFor, fold: gfold } = require('./lib/guide');
  const gBad = { pub: [], dish: [], order: [], day: [], closed: [], idx: [] };
  let nPlans = 0, nSig = 0;
  const gIdx = JSON.parse(rd('beta/data/guide.json'));
  for (const row of manifest.pages.filter(p => p.kind === 'city')) {
    const j = JSON.parse(rd(`beta/data/places/${row.key.replace(/\//g, '--')}.json`)), g = j.guide, by = {};
    j.places.forEach(p => { by[p.id] = p; });
    const sig = g.signature;
    if (sig) {
      nSig++;
      if (!['food', 'collection'].includes(sig.kind) || sig.src) gBad.pub.push(row.key);           // ★ is never a publisher
      const set = j.places.filter(p => (sig.cz || []).some(id => p.cz.includes(id)) || (sig.c || []).some(id => p.g.includes(id)));
      if (set.length !== sig.n || sig.ids.length !== sig.n || !sig.ids.every(id => by[id])) gBad.pub.push(row.key + ' n');
    }
    // a printed dish must be named by a record of the canon set (the match picks words, never tags places)
    if (g.canon) for (const d of g.canon.dishes) {
      const spec = ((canonFor({ key: row.key, country: row.country }) || {}).dishes || []).find(x => x.split('|')[0] === d.t), re = spec && dishRe(spec);
      if (!re || !d.ids.length || d.ids.length !== d.n || !d.ids.every(id => g.canon.ids.includes(id) && re.test(gfold([by[id].n, by[id].w, by[id].k].join(' ')))))
        gBad.dish.push(row.key + ':' + d.t);
    }
    const cz = (j.cuisines || []).map(c => c.id);
    if (g.foodOrder.length !== cz.length || [...g.foodOrder].sort().join() !== [...cz].sort().join()) gBad.order.push(row.key);
    for (const [a, p] of Object.entries(g.days.plans)) {
      nPlans++;
      const st = p.ids.map(id => by[id]);
      const legs = st.slice(1).map((x, i) => Math.round(km(st[i], x) * 10) / 10);
      if (st.length < DAY.minStops || st.length > DAY.maxStops || st.some(x => !x || x.closed || x.a !== a || x.la == null || !x.pv || !['high', 'med'].includes(x.pv.pin))
        || legs.join() !== p.legs.join() || new Set(p.ids).size !== p.ids.length || !/straight-line/.test(g.days.label)) gBad.day.push(row.key + '#' + a);
    }
    const ai = g.areas || {}, sumA = Object.values(ai).reduce((t, x) => t + x.n, 0);
    if (sumA !== j.places.filter(p => ai[p.a]).length || Object.values(ai).some(x => x.sights + x.food !== x.n || x.open + x.closed !== x.n)) gBad.idx.push(row.key + ' areas');
    const closed = j.places.filter(p => p.closed).map(p => p.id).sort();
    if (g.closed.map(c => c.id).sort().join() !== closed.join()) gBad.closed.push(row.key);
    const gi = gIdx.pages.find(x => x.key === row.key);
    if (!gi || gi.closed !== closed.length || gi.days !== Object.keys(g.days.plans).length) gBad.idx.push(row.key);
  }
  chk('★ signature is a food canon or a collection, never a publisher; n == its places', gBad.pub, a => a.length === 0);
  chk('pages with a ★ signature (food canon or pop culture)', nSig, n => n >= 60);
  chk('canon dishes printed only when a canon record names them', gBad.dish, a => a.length === 0);
  chk('food order is a permutation of the page cuisine ids', gBad.order, a => a.length === 0);
  chk(`day plans: 4–6 open, verified-pin stops in one area, straight-line legs (${nPlans} plans)`, gBad.day, a => a.length === 0 && nPlans > 100);
  chk('"Recently closed" lists every closed place', gBad.closed, a => a.length === 0);
  chk('data/guide.json agrees with the per-page guide', gBad.idx, a => a.length === 0);
  // map art at hero scale (W2): a city hero + an area silhouette per drawn area + a route drawing for every day plan
  const artBad = [];
  for (const row of manifest.pages.filter(p => p.kind === 'city')) {
    const f = row.key.replace(/\//g, '--'), j = JSON.parse(rd(`beta/data/places/${f}.json`)), A = j.art || {};
    const ex = src => src && fs.existsSync(path.join(BETA, src.split('?')[0]));
    if (A.map && !ex(A.hero && A.hero.src)) artBad.push(row.key + ' hero');
    for (const [a, x] of Object.entries(A.areas || {})) if (!ex(x.hero && x.hero.src)) artBad.push(`${row.key}#${a} silhouette`);
    for (const [a, p] of Object.entries(j.guide.days.plans)) { const d = (A.areas[a] || {}).day; if (!d || !ex(d.src) || d.stops.length !== p.ids.length) artBad.push(`${row.key}#${a} day route`); }
  }
  chk('hero map art: city hero, area silhouettes and every day plan\'s route drawn from verified pins', artBad, a => a.length === 0);
}

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
function boot({ leaflet = false, storage = 'ok', hash = '', page = TOKYO, io = false, edit = null } = {}) {
  // Inline the page's own same-origin scripts (what a browser would fetch from beta/); every other
  // request is impossible in this harness, i.e. the network — and any CDN — is gone.
  let html = rd('beta/' + page).replace(/<script src="((?:\.\.\/)*assets\/js\/[a-z]+\.js)\?v=[^"]*" defer><\/script>/g,
    (m, src) => '<script>' + fs.readFileSync(path.join(BETA, path.dirname(page), src), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>');
  if (edit) html = edit(html);
  if (leaflet) html = html.replace('</head>', '<script>' + fs.readFileSync(path.join(BETA, 'assets/vendor/leaflet/leaflet.js'), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script></head>');
  const errs = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://x.test/beta/' + page + hash,
    beforeParse(w) {
      const proto = w.SVGSVGElement && w.SVGSVGElement.prototype;
      if (proto && !proto.createSVGRect) proto.createSVGRect = () => ({ x: 0, y: 0, width: 0, height: 0 });
      w.Element.prototype.scrollIntoView = function () {};
      if (storage === 'throws') Object.defineProperty(w, 'localStorage', { get() { throw new Error('SecurityError: storage disabled'); } });
      // a do-nothing IntersectionObserver: nothing ever scrolls into view, so only lazy-render triggers can stamp
      // (it records what it watches, so scrollAll() below can stand in for scrolling the whole page)
      if (io) w.IntersectionObserver = class { constructor(cb) { this.cb = cb; this.t = new Set(); (w.__io = w.__io || []).push(this); } observe(t) { this.t.add(t); } unobserve(t) { this.t.delete(t); } disconnect() { this.t.clear(); } };
      w.addEventListener('error', e => errs.push('ERR ' + (e.message || e.error)));
    },
  });
  dom.window.console.error = (...a) => errs.push('console.error: ' + a.join(' '));
  return { w: dom.window, d: dom.window.document, errs };
}
const shown = d => d.querySelectorAll('li.pl:not([hidden])').length;
// "scroll to the end": fire every watched target of every (fake) IntersectionObserver until nothing new is watched
const scrollAll = async w => { for (let i = 0; i < 400; i++) { const hit = (w.__io || []).filter(o => o.t.size); if (!hit.length) return; hit.forEach(o => o.cb([...o.t].map(t => ({ target: t, isIntersecting: true })))); await sleep(5); } };
// PERF-08 (QA's wording, BETA-ISSUES PERF-08): a lens shows exactly its matches and every place stays reachable —
// (a) shown == F; (b) every food place is a card; (c) cards + stubs == total; (f) the visible lens count == F
const lensOutcome = (b, label) => {
  const d = b.d, F = live.F.length, dom = d.querySelectorAll('li.pl').length, stubs = b.w.Cleo.defer.peek().length;
  const cnt = d.querySelector('#cleo-shown b'), tile = d.querySelector('button[data-mode="food"] .n, .rail-i[data-mode="food"] .n');
  chk(`${label} (${dom} of ${total} cards built): (a) shown == F · (b) every food place is a card · (c) cards + stubs == total · (f) the visible lens count == F`,
    [shown(d), d.querySelectorAll('li.pl[data-k="f"]').length, dom + stubs, cnt ? +cnt.textContent : null].join(), `${F},${F},${total},${F}`);
};

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
  console.log('\n== SEARCH: [data-nosearch] text is real text but not searched (W9-2 "Status checked") ==');
  {
    // every card (live and deferred) gets FE-C's line; q=oct must match only what it matched before, a name still matches
    const tag = '<span data-nosearch>Status checked 2 Oct</span>';
    const b = boot({ edit: h => h.replace(/(<li class="pl[ "][^>]*>)/g, '$1' + tag) }); await sleep(300);
    b.w.Cleo.defer.all(); await sleep(30);
    const fold = b.w.Cleo.fold, cards = [...b.d.querySelectorAll('li.pl')];
    const own = c => { const x = c.cloneNode(true); x.querySelectorAll('[data-nosearch]').forEach(n => n.remove()); return fold(x.textContent); };
    const want = cards.filter(c => own(c).includes('oct')).length;
    chk('every card carries the [data-nosearch] line (real text in the DOM)', cards.filter(c => /Status checked 2 Oct/.test(c.textContent)).length, total);
    b.w.location.hash = '#q=oct'; await sleep(60);
    chk('q=oct matches only cards whose OWN text has "oct" (not the Status checked line)', shown(b.d) + ' of ' + total, `${want} of ${total}`);
    const c0 = cards.find(c => !own(c).includes('oct')), word = (c0.querySelector('.pl-n').textContent.trim().split(/\s+/).find(w => w.length > 3) || '').replace(/[^\p{L}\p{N}]/gu, '');
    b.w.location.hash = '#q=' + encodeURIComponent(word); await sleep(60);
    chk(`… and a card is still found by its name ("${word}")`, !c0.hidden, true);
    const el = b.d.createElement('li'); el.innerHTML = '<span class="pl-n">Kanda Myojin</span>' + tag;
    chk('Cleo.lens.match: a card with only the nosearch line does not match q=oct; it matches its name', [b.w.Cleo.lens.match(el, { q: 'oct' }), b.w.Cleo.lens.match(el, { q: 'kanda' })].join(), 'false,true');
    chk('… no js errors (nosearch)', b.errs, e => e.length === 0);
  }
  console.log('\n== PERF-18: the build\'s lead card == client/gallery.js gcard(lead, 1, true) (no template drift) ==');
  for (const page of [TOKYO, 'cleveland.html', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html']) {
    const b = boot({ page }); await sleep(250);
    // the build's renderer (lib/render/lead-card.js leadLi) on the page's own data — compared whether or not it is switched on
    const LC = require('./lib/lead-card'), info = b.w.Cleo.city.info, pageHtml = rd('beta/' + page);
    const gf = path.join(BETA, 'data/gallery', String(b.w.Cleo.city.info.file || '').replace(/\//g, '--') + '.json'), gj = fs.existsSync(gf) ? JSON.parse(fs.readFileSync(gf, 'utf8')) : {};
    if (!gj.lead) { chk(`${page}: no lead card in the data → none rendered by the build`, !b.d.querySelector('#cleo-lead .g-lead-card'), true); continue; }
    const box = b.d.createElement('ol'); box.innerHTML = LC.leadLi(gj.lead, info, pageHtml, b.w.Cleo.root || '../');
    const ssr = box.querySelector('li.gc');
    chk(`${page}: the build renders the lead card into the page only while lead-card.js ENABLED (now ${LC.ENABLED})`, !!b.d.querySelector('#cleo-lead .g-lead-card'), LC.ENABLED);
    b.w.eval(fs.readFileSync(path.join(BETA, 'assets/js/gallery.js'), 'utf8'));   // the lazy view module, as the browser would load it
    const C = b.w.Cleo.city, tmp = b.d.createElement('ol'); if (C.gcard && gj.lead) tmp.innerHTML = C.gcard(gj.lead, 1, true);
    const cli = tmp.querySelector('li.gc');
    const diff = !ssr || !cli ? 'missing: ssr ' + !!ssr + ', client ' + !!cli : ssr.outerHTML === cli.outerHTML ? 'same'
      : (() => { const x = ssr.outerHTML, y = cli.outerHTML; let i = 0; while (i < x.length && x[i] === y[i]) i++; return 'build …' + x.slice(Math.max(0, i - 40), i + 60) + ' ≠ client …' + y.slice(Math.max(0, i - 40), i + 60); })();
    chk(`${page}: the server-rendered lead card equals gallery.js gcard() for the same lead`, diff, 'same');
    chk(`${page}: the lead photo is eager and high priority (first screen)`, !ssr.querySelector('img') || (ssr.querySelector('img').getAttribute('fetchpriority') === 'high' && !ssr.querySelector('img').hasAttribute('loading')), true);
    chk(`${page}: … no js errors`, b.errs, e => e.length === 0);
  }
  console.log('\n== PROGRESSIVE RENDERING (M3-06): deferred cards stay reachable ==');
  {
    const html = rd('beta/' + TOKYO);
    const liveTags = (html.replace(/<noscript data-cleo-defer[\s\S]*?<\/noscript>/g, '').match(/<li class="pl[ "]/g) || []).length;
    chk('Tokyo ships ≤ 24 live cards, the rest in <noscript data-cleo-defer> (still in the HTML)', [liveTags, (html.match(/<li class="pl[ "]/g) || []).length].join(), `24,${total}`);
    const { w, d, errs } = boot({ io: true });
    await sleep(300);
    // platform W7: the paged Gallery stamps exactly its first page (24 on a phone; jsdom has no matchMedia → 48), no more
    chk('with JS: the cards built are exactly Gallery page 1 (jsdom: 48 per page)', d.querySelectorAll('li.pl').length, 48);
    chk('every deferred place still has a map stub (pin) via Cleo.defer.peek()', w.Cleo.defer.peek().filter(x => x.getAttribute('data-ll')).length + d.querySelectorAll('li.pl[data-ll]').length, total);
    chk('every area section stays visible while its cards are deferred', [...d.querySelectorAll('section.area')].filter(s => s.hidden).length, 0);
    const lastId = [...html.matchAll(/<li class="pl[ "][^>]*id="p-([^"]+)"/g)].pop()[1];
    chk('a pin on an unstamped place stamps its chunk (stampFor)', !!w.Cleo.defer.stampFor(lastId) && !!d.getElementById('p-' + lastId), true);
    d.querySelector('button[data-mode="food"]').click(); await sleep(30);
    // PERF-08: a lens builds only what it shows (Cleo.defer.selective); QA's (a)–(h) replace "any lens stamps every card"
    lensOutcome({ w, d }, 'a lens (food mode)');
    {   // (g) with the lens on, a #p= deep link to a place OUTSIDE it stamps and shows it (filters yield)
      const sIds = [...html.matchAll(/<li class="pl[ "][^>]*id="p-([^"]+)"[^>]*data-k="s"/g)].map(m => m[1]), out = sIds.find(id => !d.getElementById('p-' + id)) || sIds[sIds.length - 1];   // unbuilt if any (selective), else any sight
      w.location.hash = '#mode=food&p=' + out; await sleep(40);
      const oc = d.getElementById('p-' + out);
      chk('(g) lens on: a #p= link to a place outside the lens stamps it and shows it', !!oc && !oc.hidden && oc.classList.contains('is-target'), true);
    }
    {   // (g) a typed search with the lens on: focusing the search builds every card, so a place outside the lens is findable
      w.location.hash = '#mode=food'; await sleep(40);
      const sIds2 = [...html.matchAll(/<li class="pl[ "][^>]*id="p-([^"]+)"[^>]*data-k="s"/g)].map(m => m[1]), sId = sIds2.find(id => !d.getElementById('p-' + id)) || sIds2[sIds2.length - 2];
      const fi = d.getElementById('cleo-filter');
      fi.dispatchEvent(new w.FocusEvent('focusin', { bubbles: true }));
      const name = (d.getElementById('p-' + sId) || { querySelector: () => null }).querySelector('.pl-n');
      fi.value = name ? name.textContent : sId; fi.dispatchEvent(new w.Event('input', { bubbles: true })); await sleep(200);
      w.location.hash = '#'; await sleep(40);   // the lens chip removed, the typed query stays
      const sc = d.getElementById('p-' + sId);
      chk('(g) lens on: a typed search builds the place outside the lens, and it shows once the lens is cleared', [!!sc, !!sc && !sc.hidden, d.querySelectorAll('li.pl').length].join(), `true,true,${total}`);
    }
    {   // (e) clearing the lens and scrolling builds every card; (d) "Show all" builds every card at once
      const e1 = boot({ io: true, hash: '#view=atlas&mode=food' }); await sleep(300);
      lensOutcome(e1, 'a lens link on load (Atlas)');
      e1.w.location.hash = '#view=atlas'; await sleep(40); await scrollAll(e1.w);
      chk('(e) Atlas: clearing the lens, then scrolling the list: the DOM ends up == total', e1.d.querySelectorAll('li.pl').length, total);
      // the Gallery is paged (its lazy observer holds; SPEC §2.3): clearing the lens, then every page, reaches every card
      const e3 = boot({ io: true, hash: '#mode=food' }); await sleep(300);
      lensOutcome(e3, 'a lens link on load (Gallery)');
      e3.w.location.hash = '#'; await sleep(40);
      for (let k = 2; k <= Math.ceil(total / 48) + 1; k++) { e3.w.location.hash = '#pg=' + k; await sleep(20); }
      chk('(e) Gallery: clearing the lens, then paging to the end: the DOM ends up == total', e3.d.querySelectorAll('li.pl').length, total);
      const e2 = boot({ io: true, hash: '#mode=food' }); await sleep(300);
      e2.d.querySelector('[data-cleo-all]').click(); await sleep(40);
      chk('(d) "Show all" builds every card, every place shown', [e2.d.querySelectorAll('li.pl').length, shown(e2.d)].join(), `${total},${total}`);
      chk('… no js errors ((d), (e))', e1.errs.concat(e2.errs, e3.errs), e => e.length === 0);
    }
    {   // QA-75 guard (FE-A's city.js fix, 752a77fc): with selective ON (forced here at runtime, whatever the default), a lens
        // builds only its cards; anything that later builds the rest (find-in-page, print, search focus → Cleo.defer.all())
        // must not show them: the shown count stays the lens count
      const q = boot({ io: true }); await sleep(300); q.w.Cleo.defer.selective = true;
      q.w.location.hash = '#t=1'; await sleep(60);
      const T1 = live.P.concat(live.F).filter(r => r.t === 1 && !r.closed && !/[—–-]+\s*CLOSED\b/i.test(r.n)).length, before = shown(q.d), built = q.d.querySelectorAll('li.pl').length;
      q.w.Cleo.defer.all(); await sleep(60);
      chk('QA-75 guard: selective on, a tier lens, then every card built — shown stays the lens count', [before, shown(q.d), built < total, q.d.querySelectorAll('li.pl').length].join(), `${before},${before},true,${total}`);
      chk('… and it is the tier-1 count', before, T1);
      chk('… no js errors (QA-75 guard)', q.errs, e => e.length === 0);
    }
    chk('no js errors (lazy)', errs, e => e.length === 0);
    // PERF-08 primitives (core): a lens stamps only the cards it shows; every other place stays a reachable stub
    {
      const b3 = boot({ io: true }); await sleep(300);
      const C3 = b3.w.Cleo, F = live.F.length, before = b3.d.querySelectorAll('li.pl').length;
      const foodStubs = C3.defer.peek({ lens: { mode: 'food' } });
      chk('peek({lens}) returns only the stubs that lens shows', foodStubs.every(x => x.getAttribute('data-k') === 'f'), true);
      C3.defer.stampLens({ mode: 'food' });
      const dom = [...b3.d.querySelectorAll('li.pl')], foodDom = dom.filter(c => c.getAttribute('data-k') === 'f').length;
      chk('stampLens(food): every food place is now a card, nothing else new was built, every place still reachable (cards + stubs = total)',
        [foodDom, dom.length - before <= F, dom.length + C3.defer.peek().length].join(), `${F},true,${total}`);
      chk('stampLens(q=…) stamps everything (a stub cannot be judged on its text)', (C3.defer.stampLens({ q: 'shrine' }), b3.d.querySelectorAll('li.pl').length), total);
      chk('no js errors (stampLens)', b3.errs, e => e.length === 0);
    }
    // Platform W7 (R6 gap #5): a Gallery deep link no longer stamps every card — it stamps only the page that holds the
    // place (24 per page on a phone, 48 wider), placed by the true view order (QA-29). The page shown must be the right one.
    {
      const order = [...html.replace(/<noscript data-cleo-defer[^>]*>/g, '').matchAll(/<li class="pl[ "][^>]*id="p-([^"]+)"/g)].map(m => m[1]);
      const far = order[order.length - 30], g = boot({ io: true, hash: '#view=gallery&p=' + far }); await sleep(300);
      const gt = g.d.getElementById('p-' + far), n = g.d.querySelectorAll('li.pl').length;
      const onPage = [...g.d.querySelectorAll('li.pl')].filter(c => !c.hidden && !c.classList.contains('pg-off'));
      chk('Gallery deep link on load to a deferred place: lands on its page, stamping only that page (≤ 24 live + one page; jsdom has no matchMedia → 48 per page)',
        [!!gt && !gt.hidden && !gt.classList.contains('pg-off'), n <= 24 + 48 && n < order.length, onPage.length > 0 && onPage.length <= 48].join() + ' (' + n + ' cards)', s => s.startsWith('true,true,true'));
      chk('… and no js errors', g.errs, e => e.length === 0);
    }
    const b2 = boot({ io: true, hash: '#view=atlas&p=' + lastId }); await sleep(300);
    const tg = b2.d.getElementById('p-' + lastId);
    const nDom = b2.d.querySelectorAll('li.pl').length;
    chk('deep link on load to a deferred place lands, stamping only its card (R-32, gap #6; platform W7)', !!tg && !tg.hidden && tg.classList.contains('is-target') && nDom < total && nDom <= 24 + 1, true);
    const mid = [...html.matchAll(/<li class="pl[ "][^>]*id="p-([^"]+)"/g)][200][1];
    b2.w.location.hash = '#view=atlas&p=' + mid; await sleep(60);
    const tm = b2.d.getElementById('p-' + mid);
    chk('a second place link (hashchange) stamps one more chunk, not the page', !!tm && !tm.hidden && b2.d.querySelectorAll('li.pl').length < total, true);
    b2.w.location.hash = '#mode=food'; await sleep(60);
    lensOutcome(b2, '… and a lens after it');
    b2.w.location.hash = '#view=atlas'; await sleep(40); await scrollAll(b2.w);
    chk('… (e) clearing it on Atlas, then scrolling the list: the DOM ends up == total', b2.d.querySelectorAll('li.pl').length, total);
    chk('no js errors (place-only stamping)', b2.errs, e => e.length === 0);
  }
  console.log('\n== MAP: vendored Leaflet present ==');
  {
    const { d, errs } = boot({ leaflet: true, hash: '#view=atlas' });   // W3: the map belongs to Atlas (FE-A views.js); Gallery builds no pins
    await sleep(700);
    const withLL = d.querySelectorAll('li.pl[data-ll]').length;
    chk('leaflet mounted', !!d.querySelector('#cleo-map .leaflet-pane'), true);
    // W6 (FE-A, coordinated): at dense zooms nearby pins gather into a count bubble (.pin-cl); a pin is either drawn or
    // counted in exactly one bubble, so pins + bubble counts == pinned places. W7 Atlas map-search: a pin is a label-pill
    // marker (.leaflet-marker-icon.pp), no longer an SVG circle path — same invariant, the new pin's selector.
    // SPEC-v3 slice 1 (Atlas review loop): every pinned place is ONE dot on a shared canvas layer (no DOM node, no number),
    // and atlas.js lifts at most 16 of them into labelled pins — same invariant (one marker per pinned place), the new layer
    const W0 = d.defaultView, nDots = Object.keys(W0.Cleo.city.markers).length;
    chk('one marker per pinned place (a canvas dot each)', nDots, withLL);
    const icons = [...d.querySelectorAll('#cleo-map .leaflet-marker-icon')];
    chk('labelled map pins ≤ 16 + 1, and no marker is a bare number (rank or count)', [icons.length <= 17, icons.some(e => /^\s*★?\s*\d+\s*$/.test(e.textContent))].join(), 'true,false');
    const hosts = [...new Set([...fs.readFileSync(path.join(BETA, 'assets/js/city.js'), 'utf8').matchAll(/tileLayer\('https:\/\/([^/']+)/g)].map(m => m[1]))];
    // Tiles that never load (blocked network): after 4 errors the dead map gives way to the schematic + VOICE copy.
    const W = d.defaultView, el = d.getElementById('cleo-map'), hs = {};
    W.Cleo.watchTiles({ on: (ev, fn) => { hs[ev] = fn; } }, () => W.Cleo.mapFallback(el, null));
    for (let i = 0; i < 4; i++) hs.tileerror();
    chk('tiles failed → schematic + "The map couldn’t load" line', [el.getAttribute('data-tiles'), !!el.querySelector('.map-art img'), /map couldn’t load/.test(el.textContent)].join(), 'failed,true,true');
    chk('tile hosts in client (OSM/Esri only)', hosts, h => h.length > 0 && h.every(x => x === 'tile.openstreetmap.org' || x === 'server.arcgisonline.com'));
    chk('no js errors', errs, e => e.length === 0);
  }
  {   // PERF-08 (h): under a selective lens every unstamped place keeps its map pin, and the map shows exactly the lens
      // (the DOM < total part only while Cleo.defer.selective is on; it is off again after QA-75/76)
    const tags = [...rd('beta/' + TOKYO).matchAll(/<li class="pl[ "][^>]*>/g)].map(m => m[0]).filter(t => / data-ll="/.test(t) && !/ data-np[ =>]/.test(t));
    const h = boot({ leaflet: true, io: true, hash: '#view=atlas&mode=food' }); await sleep(700);
    const C = h.w.Cleo.city, onMap = C.dots ? C.dots.getLayers().length : -1;
    chk('(h) a lens on Atlas: markers == pinned (stamped or not), and the dots shown == the pinned places the lens shows',
      [Object.keys(C.markers).length, onMap, !h.w.Cleo.defer.selective || h.d.querySelectorAll('li.pl').length < total].join(), `${tags.length},${tags.filter(t => / data-k="f"/.test(t)).length},true`);
    chk('… no js errors (h)', h.errs, e => e.length === 0);
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
    // raw 820 (was 800, W3): every card now carries its view rank (data-rank, P-01); transfer (gzip) budget unchanged
    if (raw > 820 || z > 160) over.push(`${p} ${raw}/${z} KB`);
    if (raw > biggest[1]) biggest = [p, raw, z];
  }
  chk('city pages over 820 KB raw / 160 KB gzip', over, a => a.length === 0);
  console.log(`        (largest: ${biggest[0]} ${biggest[1]} KB raw, ${biggest[2]} KB gzip)`);
  // Platform W2 (RFC §7.5): W0 set 80 KB raw when the landing was 19 KB; W2 adds the cross-city rail, country heroes and
  // inline motif art. What a first visit pays is the gzip transfer: ≤ 24 KB gzip, with a ≤ 120 KB raw backstop.
  chk('landing ≤ 24 KB gzip / ≤ 120 KB raw', [KB(gz('index.html')), KB(size('index.html'))].join('/'), v => { const [g, r] = v.split('/').map(Number); return g <= 24 && r <= 120; });
  // FE-A W1 (2026-10-10): raised 40 → 64 KB raw (≈ 18 KB gzip) — 40 was set in Wave 0 before the city sheet, tray, map
  // sync and FE-B's search/states existed. PLT to ratify, or replace with a minify step / gzip budget (docs/BETA-LOG.md).
  // FE-A W2 (2026-10-10): the budget is now what ONE page loads (that is what a visitor pays), gzip ≤ 32 KB, raw shown
  // for reference. A site-wide sum grew with every page kind (saved, day, for-you) without any page getting heavier
  // to load. Ratified by platform W2 (RFC §7.5): per-page gzip is the budget.
  let jsMax = ['', 0, 0];
  for (const p of generated) {
    const fsP = path.join(BETA, p); if (!fs.existsSync(fsP)) continue;
    const files = [...new Set([...fs.readFileSync(fsP, 'utf8').matchAll(/src="(?:\.\.\/)*(assets\/js\/[a-z-]+\.js)\?/g)].map(m => m[1]))];
    const z = files.reduce((t, f) => t + gz(f), 0), raw = files.reduce((t, f) => t + size(f), 0);
    if (z > jsMax[2]) jsMax = [p, KB(raw), z];
  }
  // Platform W2: 32 → 40 KB gzip per page — core.js now carries progressive rendering (M3-06) and offline caching (B-40),
  // both of which make pages lighter/sturdier; every script is `defer`, so content never waits on it (RFC §7.5).
  // Platform W7 (R6 gap #5): no rounding — the exact gzip bytes are held to 40.0 KB (40.45 used to round down to 40).
  chk(`client JS loaded by any one page ≤ 40.0 KB gzip, unrounded (heaviest: ${jsMax[0]}, ${jsMax[1]} KB raw)`, +(jsMax[2] / 1024).toFixed(2), n => n <= 40.0);
  // per-page share cards (B-36, npm run beta:og): 1200×630 PNG ≤ 300 KB, and every page that has one points og:image at it
  const OGD = path.join(BETA, 'assets/og'), ogs = fs.existsSync(OGD) ? fs.readdirSync(OGD).filter(f => f.endsWith('.png')) : [];
  const ogBad = ogs.filter(f => { const b = fs.readFileSync(path.join(OGD, f)); return b.readUInt32BE(16) !== 1200 || b.readUInt32BE(20) !== 630 || b.length > 300 * 1024; });
  const ogUnused = manifest.pages.filter(p => p.kind === 'city' && ogs.includes(p.key.replace(/\//g, '--') + '.png'))
    .filter(p => !rd('beta/' + p.beta).includes(`/assets/og/${p.key.replace(/\//g, '--')}.png"`)).map(p => p.beta);
  chk(`share cards: ${ogs.length} PNGs are 1200×630 ≤ 300 KB, and their pages use them`, ogBad.concat(ogUnused), a => a.length === 0);
  // Platform W8 (R7 gap 7): the one shared stylesheet ships ≤ 200 KB raw (dead R6 rules removed by tools/beta/css-dead.py,
  // comments stripped by build-css.py; the sources keep theirs)
  chk('cleo.css ≤ 200 KB raw (200,000 B)', size('assets/cleo.css'), n => n <= 200000);
  // Perf audit PERF-04: the place detail reads data/links/<page>.json, a slice of the page dataset. It must say exactly
  // what the dataset says: every place's http(s) source links and every source key's publisher group, nothing else.
  {
    const bad = [];
    for (const pg of manifest.pages.filter(p => p.kind === 'city')) {
      const f = pg.key.replace(/\//g, '--'), dp = path.join(BETA, 'data/places', f + '.json'), dl = path.join(BETA, 'data/links', f + '.json');
      if (!fs.existsSync(dp)) continue;
      if (!fs.existsSync(dl)) { bad.push(f + ': no links slice'); continue; }
      const D = JSON.parse(fs.readFileSync(dp, 'utf8')), L = JSON.parse(fs.readFileSync(dl, 'utf8')), g = {};
      for (const s of D.sourceIndex || []) for (const e of s.entries || []) g[e.key] = s.id;
      if (JSON.stringify(g) !== JSON.stringify(L.g)) bad.push(f + ': groups differ');
      for (const x of D.places) { const want = (x.s || []).filter(y => y && /^https?:\/\//.test(y[1] || ''));
        if (JSON.stringify(want.length ? want : undefined) !== JSON.stringify(L.p[x.id])) { bad.push(f + '/' + x.id); break; } }
      if (Object.keys(L.p).some(id => !D.places.find(x => x.id === id))) bad.push(f + ': extra ids');
    }
    chk('data/links/<page>.json == the page dataset\'s source links and groups, every page', bad.slice(0, 5), a => a.length === 0);
  }
  chk('search index ≤ 250 KB gzip (lazy)', KB(gz('data/search.json')), n => n <= 250);

  console.log(failures ? `\n>>> FAIL — ${failures} beta check(s) failed` : '\n>>> PASS — beta: counts == live, reproducible, guarded, renders with no CDN');
  process.exit(failures ? 1 : 0);
})();
