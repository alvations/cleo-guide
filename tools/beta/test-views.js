#!/usr/bin/env node
'use strict';
/**
 * tools/beta/test-views.js — the Round-3 view-model gate (platform), wired into `npm test`.
 * design/beta/views/PLAN.md P-01, P-02, P-03, P-04, P-06; RFC §13.
 *
 *  1. RANK + TRIAD (every place page): ranks are a permutation of 1…n per area; rank 1 is open when the area has an
 *     open place; `order` is the view order; every li.pl carries data-rank / data-k3 equal to the JSON.
 *  2. INSIGHTS (every place page): every chart's segments sum to its stated denominator; citations == Σ src.length;
 *     no pop-culture data → pop: null (never 0).
 *  3. LENS / ORDER / COUNT LINE / ROUTE (jsdom, Tokyo): Cleo.lens every key alone and combined; t= excludes closed;
 *     q is accent-folded; "Show all" restores N; Cleo.order == the build's order; unknown route values are dropped
 *     with replaceState and no error; #list= / #day= untouched.
 *  4. ONE PREDICATE: no client file but core.js (and city.js, pending its switch to Cleo.lens) re-implements the lens.
 *  5. REACHABILITY PER VIEW (P-04): every pilot, in every view, reaches every <page>/<id> by scroll after stamping,
 *     by #p=, by q= (its own name) and in the print DOM (beforeprint). Views FE lanes haven't registered yet still
 *     run on the shared city page (the canonical list), so this gate is live from day one and tightens as views land.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..', '..');
const BETA = path.join(ROOT, 'beta');
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
let failures = 0;
const chk = (name, got, want) => {
  const ok = typeof want === 'function' ? want(got) : got === want;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name} = ${JSON.stringify(got).slice(0, 300)}`);
  if (!ok) failures++;
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const manifest = JSON.parse(rd('beta/data/manifest.json'));
const generated = new Set(manifest.generated);
const cityRows = manifest.pages.filter(p => p.kind === 'city' && generated.has(p.beta));
const pd = key => JSON.parse(rd(`beta/data/places/${key.replace(/\//g, '--')}.json`));

// ── 1 + 2. data, every place page ─────────────────────────────────────────────
console.log('\n== VIEW MODEL: rank, kind triad, view order (every place page) ==');
const bad = { perm: [], first: [], k3: [], order: [], attrs: [], ins: [], pop: [], cites: [] };
for (const row of cityRows) {
  const j = pd(row.key), P = j.places, N = P.length, I = j.insights, popIds = new Set((j.guide.popCulture || { c: [] }).c);
  const byA = {}; P.forEach(p => (byA[p.a] = byA[p.a] || []).push(p));
  for (const [a, lst] of Object.entries(byA)) {
    const rs = lst.map(p => p.rank).sort((x, y) => x - y);
    if (rs.some((r, i) => r !== i + 1) || lst.some(p => p.of !== lst.length)) bad.perm.push(`${row.key}#${a}`);
    const r1 = lst.find(p => p.rank === 1);
    if (r1 && r1.closed && lst.some(p => !p.closed)) bad.first.push(`${row.key}#${a}`);
  }
  if (P.some(p => p.k3 !== (p.kind === 'food' ? 'food' : p.g.some(g => popIds.has(g)) ? 'pop' : 'sight'))) bad.k3.push(row.key);
  const aOrd = j.areas.map(a => a.id); P.forEach(p => { if (!aOrd.includes(p.a)) aOrd.push(p.a); });
  const by = Object.fromEntries(P.map(p => [p.id, p]));
  const want = P.slice().sort((x, y) => aOrd.indexOf(x.a) - aOrd.indexOf(y.a) || x.rank - y.rank).map(p => p.id);
  if (j.order.join() !== want.join()) bad.order.push(row.key);
  const html = rd('beta/' + row.beta), tags = html.match(/<li class="pl[ "][^>]*>/g) || [];
  const tagBad = tags.filter(t => { const id = /\bid="p-([^"]+)"/.exec(t)[1], p = by[id]; return !p || !t.includes(` data-rank="${p.rank}"`) || (p.k3 === 'pop') !== t.includes(' data-k3="pop"'); });
  if (tags.length !== N || tagBad.length) bad.attrs.push(`${row.key} (${tags.length}/${N}, ${tagBad.length} wrong)`);
  // insights: every series sums to its denominator
  const sum = (rows, f) => rows.reduce((s, r) => s + f(r), 0), e = [];
  const tri = r => r.sight + r.food + (r.pop || 0);
  if (I.N !== N || I.mix.of !== N || I.mix.rows[0].n !== N || I.mix.rows.some(r => tri(r) !== r.n) || sum(I.mix.rows.slice(1), r => r.n) !== N) e.push('mix');
  const cites = P.reduce((s, p) => s + p.src.length, 0);
  if (I.tiles.citations !== cites || I.sources.of !== cites) bad.cites.push(row.key);
  if (I.sources.rows.some(r => sum(I.sources.top.concat('_other'), s => r[s]) !== r.n) || sum(I.sources.rows, r => r.n) !== cites) e.push('sources');
  if (I.perArea.of !== N || sum(I.perArea.rows, r => r.n) !== N) e.push('perArea');
  if (I.spread.rows.some(r => !(r.km >= 0) || r.n < 2) || I.spread.of !== P.filter(p => !p.closed && p.la != null && p.pv && ['high', 'med'].includes(p.pv.pin)).length) e.push('spread');
  const nClosed = P.filter(p => p.closed).length;
  if (I.closed.of !== nClosed || sum(I.closed.rows, r => r.n) !== nClosed || I.closed.monthsOf !== N || sum(I.closed.months, r => r.n) !== N || I.tiles.closed !== nClosed) e.push('closed');
  if (I.tiers.of !== N - nClosed || I.tiers.rows.some(r => r[1] + r[2] + r[3] !== r.n) || sum(I.tiers.rows, r => r.n) !== N - nClosed) e.push('tiers');
  if (I.canon && (I.canon.of !== j.guide.canon.n || I.canon.rows.some(r => !(r.n > 0)) || I.canon.named > I.canon.of)) e.push('canon');
  if (I.tiles.places !== N || I.tiles.sights + I.tiles.food !== N || I.tiles.sights !== j.stats.sights) e.push('tiles');
  if ([I.mix, I.sources, I.perArea, I.spread, I.closed, I.tiers].concat(I.canon ? [I.canon] : []).some(s => !s.note)) e.push('note');
  if (e.length) bad.ins.push(`${row.key}: ${e.join(',')}`);
  if (!j.guide.popCulture && (I.tiles.pop !== null || I.mix.rows.some(r => r.pop !== null) || I.mix.series.includes('pop'))) bad.pop.push(row.key);
  if (j.guide.popCulture && I.tiles.pop !== P.filter(p => p.k3 === 'pop').length) bad.pop.push(row.key + ' n');
}
chk(`place pages checked`, cityRows.length, n => n >= 80);
chk('every area\'s ranks are a permutation of 1…n', bad.perm, a => a.length === 0);
chk('rank 1 is never closed when its area has an open place', bad.first, a => a.length === 0);
chk('k3 = sight | food | pop (pop = a sight in a popCulture collection)', bad.k3, a => a.length === 0);
chk('JSON `order` == area order, then rank', bad.order, a => a.length === 0);
chk('every li.pl carries data-rank (+ data-k3=pop) == the JSON', bad.attrs, a => a.length === 0);
console.log('\n== INSIGHTS: every chart sums to its stated denominator ==');
chk('mix / sources / perArea / spread / closed / tiers / canon / tiles agree', bad.ins, a => a.length === 0);
chk('citations total == Σ src.length', bad.cites, a => a.length === 0);
chk('no pop-culture data → pop: null (absent, not 0)', bad.pop, a => a.length === 0);
chk('pages without pop-culture data still carry insights', cityRows.filter(r => !pd(r.key).guide.popCulture).length, n => n > 0);

// ── 4. one predicate ───────────────────────────────────────────────────────────
console.log('\n== ONE LENS PREDICATE (P-02) ==');
{
  const CLIENT = path.join(__dirname, 'client'), own = [];
  // reading the lens attributes to FILTER (data-g / data-cz / data-src membership, data-t equality) belongs to Cleo.lens
  const RE = /getAttribute\(\s*['"]data-(?:g|cz|src)['"]\s*\)[^;\n]*(?:indexOf|includes|split)|has\(\s*\w+\s*,\s*['"]data-(?:g|cz|src)['"]/;
  // pre-W3 files read these attributes for display (sheet chips) or interest scoring (For you), not as a lens;
  // every W3 view file (views, gallery, guidebook, insights, …) must call Cleo.lens instead
  const PRE_W3 = ['core.js', 'city.js', 'sheet.js', 'foryou.js', 'day.js', 'saved.js', 'search.js', 'landing.js', 'states.js'];
  for (const f of fs.readdirSync(CLIENT).filter(f => f.endsWith('.js') && !PRE_W3.includes(f)))
    if (RE.test(fs.readFileSync(path.join(CLIENT, f), 'utf8'))) own.push(f);
  chk('client files with a second lens predicate (use Cleo.lens.match)', own, a => a.length === 0);
}

// ── jsdom harness (same rules as test-beta.js: no network, scripts inlined) ──────
function boot(page, { hash = '', storage = 'ok', io = false } = {}) {
  const html = rd('beta/' + page).replace(/<script src="((?:\.\.\/)*assets\/js\/[a-z-]+\.js)\?v=[^"]*" defer><\/script>/g,
    (m, src) => '<script>' + fs.readFileSync(path.join(BETA, path.dirname(page), src), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>');
  const errs = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://x.test/beta/' + page + hash,
    beforeParse(w) {
      const proto = w.SVGSVGElement && w.SVGSVGElement.prototype;
      if (proto && !proto.createSVGRect) proto.createSVGRect = () => ({ x: 0, y: 0, width: 0, height: 0 });
      w.Element.prototype.scrollIntoView = function () {};
      w.scrollTo = () => {};
      if (storage === 'throws') Object.defineProperty(w, 'localStorage', { get() { throw new Error('SecurityError: storage disabled'); } });
      if (io) w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
      w.addEventListener('error', e => errs.push('ERR ' + (e.message || e.error)));
    },
  });
  dom.window.console.error = (...a) => errs.push('console.error: ' + a.join(' '));
  return { w: dom.window, d: dom.window.document, errs };
}

(async () => {
  // ── 3. Cleo.lens / Cleo.order / count line / route ───────────────────────────
  console.log('\n== Cleo.lens / Cleo.order / count line (jsdom, Tokyo) ==');
  {
    const page = 'cities/tokyo.html', j = pd('tokyo'), P = j.places, N = P.length;
    const { w, d, errs } = boot(page, { storage: 'throws' });
    await sleep(300);
    w.Cleo.defer.all();
    const C = w.Cleo, cards = [...d.querySelectorAll('li.pl')];
    const n = o => cards.filter(c => C.lens.match(c, o)).length;
    const fold = s => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const want = o => P.filter(p => (!o.mode || (o.mode === 'food') === (p.kind === 'food')) && (!o.a || p.a === o.a) && (!o.t || (!p.closed && p.t === +o.t))
      && (!o.c || p.g.includes(o.c)) && (!o.cz || p.cz.includes(o.cz)) && (!o.src || p.src.includes(o.src)) && (!o.closed || p.closed)).length;
    const a0 = j.areas[0].id, c0 = j.collections[0].id, cz0 = j.cuisines[0].id, s0 = j.sourceIndex[0].id;
    const cases = [{}, { mode: 'sights' }, { mode: 'food' }, { a: a0 }, { t: '1' }, { t: '3' }, { c: c0 }, { cz: cz0 }, { src: s0 }, { closed: '1' },
      { mode: 'sights', a: a0, t: '1' }, { a: a0, src: s0 }, { mode: 'food', cz: cz0, t: '2' }, { closed: '1', a: a0 }, { closed: '1', t: '1' }];
    chk('every lens key alone and combined == the JSON', cases.map(o => n(o) === want(o)).every(Boolean), true);
    chk('t= excludes closed places', cards.filter(c => c.hasAttribute('data-closed') && ['1', '2', '3'].some(t => C.lens.match(c, { t }))).length, 0);
    const accent = P.find(p => /[À-ɏ]/.test(p.n.normalize('NFC')) && !p.closed);
    const bare = fold(accent.n).replace(/\s*\(.*$/, '');
    chk(`q is accent-folded ("${bare}" finds "${accent.n}")`, cards.filter(c => C.lens.match(c, { q: bare })).some(c => c.id === 'p-' + accent.id), true);
    chk('q: every word must match', n({ q: 'zzqx-no-such-place' }), 0);
    C.lens.apply(cards, { mode: 'food', t: '1' });
    chk('apply sets hidden (never removes a node)', [d.querySelectorAll('li.pl').length, cards.filter(c => !c.hidden).length], v => v[0] === N && v[1] === want({ mode: 'food', t: '1' }));
    chk('"Show all" (no lens) restores exactly N', C.lens.apply(cards, {}), N);
    chk('lens.pick keeps lens keys only', JSON.stringify(C.lens.pick({ view: 'atlas', p: 'x', pg: '2', a: a0, q: 'k' })), JSON.stringify({ a: a0, q: 'k' }));
    const stubs = [{ id: P[0].id, stub: true, _a: { 'data-k': 's', 'data-a': P[0].a, 'data-t': String(P[0].t) }, getAttribute(k) { return this._a[k] === undefined ? null : this._a[k]; }, hasAttribute(k) { return k in this._a; } }];
    chk('works on Cleo.defer.peek() stubs', C.lens.match(stubs[0], { a: P[0].a, mode: P[0].kind === 'food' ? 'food' : 'sights' }), true);
    chk('Cleo.k3(card) == the JSON k3 on every card', cards.every(c => C.k3(c) === P.find(p => p.id === c.id.slice(2)).k3), true);
    chk('Cleo.order == the build\'s view order', C.order(cards).map(c => c.id.slice(2)).join(), j.order.join());
    chk('count line, no lens', C.countLine(N, N), `All ${N} places`);
    chk('count line, lens on', C.countLine(71, N), `71 of all ${N} places`);
    chk('count line, long form from stats', C.countLine(N, N, j.stats), s => s.startsWith(`All ${N} places · ${j.stats.sights} sights · ${j.stats.food} eat & drink · ${j.stats.areas} areas`) && (!j.stats.closed || s.includes(`${j.stats.closed} closed, kept for the record`)));
    chk('0 JS errors', errs, e => e.length === 0);
  }

  console.log('\n== ROUTE KEY REGISTRY (P-06) ==');
  {
    const page = 'cities/tokyo.html', j = pd('tokyo'), id = j.places[0].id, a0 = j.areas[0].id;
    let b = boot(page, { hash: '#view=bogus' }); await sleep(250);
    chk('#view=bogus → dropped (default), URL rewritten, no error', [b.w.location.hash, b.w.Cleo.route.parse().view || null, b.w.Cleo.view.current(), b.errs.length], v => v[0] === '' && v[1] === null && v[2] === 'gallery' && v[3] === 0);
    b = boot(page, { hash: `#view=atlas&p=${id}` }); await sleep(250);
    chk('#view=atlas&p=x keeps both (the sheet opens over Atlas)', JSON.stringify(b.w.Cleo.route.parse()), JSON.stringify({ view: 'atlas', p: id }));
    chk('… and the hash is not rewritten', b.w.location.hash, `#view=atlas&p=${id}`);
    b = boot(page, { hash: `#a=${a0}&a2=x&t=9&closed=yes&pg=0&all=1&mode=nope&q=caf%C3%A9` }); await sleep(250);
    chk('invalid a/t/closed/pg/mode dropped; valid + unknown keys kept', JSON.stringify(b.w.Cleo.route.parse()), JSON.stringify({ a: a0, a2: 'x', all: '1', q: 'café' }));
    chk('… URL rewritten in place', b.w.location.hash, `#a=${a0}&a2=x&all=1&q=caf%C3%A9`);
    b = boot(page, { hash: '#a=NOT-AN-AREA&pg=3' }); await sleep(200);
    chk('a= must be one of this page\'s areas', JSON.stringify(b.w.Cleo.route.parse()), JSON.stringify({ pg: '3' }));
    b = boot(page, { hash: '#day=' + a0 + ':' + id }); await sleep(200);
    chk('#day= untouched', b.w.location.hash, '#day=' + a0 + ':' + id);
    b = boot('saved.html', { hash: '#list=tokyo:' + id + ',x;kyoto:y' }); await sleep(200);
    chk('#list= untouched (codec round-trip)', JSON.stringify([b.w.location.hash, b.w.Cleo.listCodec.encode(b.w.Cleo.listCodec.decode(b.w.Cleo.route.parse().list))]), JSON.stringify(['#list=tokyo:' + id + ',x;kyoto:y', 'tokyo:' + id + ',x;kyoto:y']));
    b = boot(page, { storage: 'throws' }); await sleep(150);
    chk('Cleo.view.current() with storage throwing → default, no error', [b.w.Cleo.view.current(), b.errs.length], v => v[0] === 'gallery' && v[1] === 0);
  }

  // ── 5. P-04 reachability per view ─────────────────────────────────────────────
  console.log('\n== REACHABILITY PER VIEW (P-04): every place, every pilot, every view ==');
  const PILOTS = ['cities/tokyo.html', 'cleveland.html', 'cities/newyork.html', 'Singapore/chinatown.html', 'cities/wheeling.html', 'cities/okinawa.html'];
  const VIEWS = ['gallery', 'atlas', 'guidebook', 'insights'];
  for (const page of PILOTS) {
    const row = cityRows.find(r => r.beta === page);
    if (!row) { chk(`${page}: pilot is a generated place page`, false, true); continue; }
    const j = pd(row.key), ids = j.places.map(p => p.id), N = ids.length, res = [];
    for (const view of VIEWS) {
      const miss = { scroll: 0, p: 0, q: 0, print: 0 }; let errs = 0;
      // one boot per (pilot, view), IntersectionObserver present (cards deferred) and storage throwing.
      // #p=: the first, the last, every 61st and up to 3 closed places land on a visible card in this view
      const sample = [...new Set([ids[0], ids[N - 1]].concat(ids.filter((_, i) => i % 61 === 30), j.places.filter(p => p.closed).map(p => p.id).slice(0, 3)))];
      const b = boot(page, { hash: `#view=${view}&p=${sample[0]}`, io: true, storage: 'throws' }); await sleep(150);
      for (const id of sample) {
        if (id !== sample[0]) { b.w.location.hash = `#view=${view}&p=${id}`; await sleep(25); }
        const el = b.d.getElementById('p-' + id); if (!el || el.hidden) miss.p++;
      }
      // scroll: every card stamped and present (a long scroll stamps chunk by chunk; the end state is all stamped)
      b.w.Cleo.defer.all();
      const cards = [...b.d.querySelectorAll('li.pl')], byId = Object.fromEntries(cards.map(c => [c.id.slice(2), c]));
      miss.scroll = ids.filter(id => !byId[id]).length;
      // q=: each place's own name finds it with the shared predicate
      miss.q = j.places.filter(p => { const c = byId[p.id]; return !c || !b.w.Cleo.lens.match(c, { q: p.n.replace(/\s*[—–-]+\s*CLOSED.*$/i, '').replace(/\s*\(.*$/, '') }); }).length;
      // print: beforeprint stamps everything; every place is in the print DOM even with a lens on (print styles are FE-B's)
      b.w.Cleo.lens.apply(cards, { mode: 'food' }); b.w.dispatchEvent(new b.w.Event('beforeprint'));
      const inDom = new Set([...b.d.querySelectorAll('li.pl')].map(c => c.id.slice(2)));
      miss.print = ids.filter(id => !inDom.has(id)).length;
      errs += b.errs.length; b.w.close();
      res.push([view, miss, errs]);
      chk(`${page} · ${view}: ${N} places by scroll, #p= (${sample.length} sampled), q=, print; 0 errors`, [miss, errs], v => !v[0].scroll && !v[0].p && !v[0].q && !v[0].print && !v[1]);
    }
  }

  console.log(failures ? `\n>>> FAIL — ${failures} view-model check(s) failed` : '\n>>> PASS — view model: rank, triad, insights, lens, order, routes, reachability per view');
  process.exit(failures ? 1 : 0);
})();
