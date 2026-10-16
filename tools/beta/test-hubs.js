#!/usr/bin/env node
'use strict';
/**
 * tools/beta/test-hubs.js — FE-B gate (landing, country hubs, shell, method page, states), wired into `npm test`.
 *
 *  1. REACH (M1-17): every place page of a live country is linked from the landing AND from its country hub;
 *     every tile's count == its live page's count; every hub lists only live-country pages.
 *  2. SHELL (M1-18): the same top bar component on every generated page (structure snapshot), ≤ 1 per page,
 *     skip link → #main, landmarks header/nav/main/footer, breadcrumb names the page's country.
 *  3. METHOD (M1-09): how-we-choose.html carries the computed totals and every rule section; linked from footer.
 *  4. STATES (M1-19, jsdom): 0 results, index failed, offline, storage blocked, unknown page — copy per VOICE.md.
 *  5. VOICE lint on FE-B pages (no urgency words).
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..', '..');
const BETA = path.join(ROOT, 'beta');
const rd = p => fs.readFileSync(path.join(BETA, p), 'utf8');
let failures = 0;
const chk = (name, got, want) => {
  const ok = typeof want === 'function' ? want(got) : got === want;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name} = ${JSON.stringify(got).slice(0, 300)}`);
  if (!ok) failures++;
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const manifest = JSON.parse(rd('data/manifest.json'));
const countries = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'countries.json'), 'utf8')).countries;
const liveC = new Set(countries.filter(c => c.live).map(c => c.key));
const cityPages = manifest.pages.filter(p => p.kind === 'city');
const count = p => p.counts.P + p.counts.F;
const doc = html => new JSDOM(html).window.document;
const hrefsFrom = (rel, d) => new Set([...d.querySelectorAll('a[href]')].map(a => path.posix.normalize(path.posix.join(path.posix.dirname(rel), a.getAttribute('href').split('#')[0].split('?')[0]))));

// ── 1. reach ───────────────────────────────────────────────────────────────
console.log('\n== REACH: every live city from the landing and its hub; counts computed ==');
{
  const land = doc(rd('index.html'));
  const L = hrefsFrom('index.html', land);
  chk('live-country place pages not linked from the landing', cityPages.filter(p => liveC.has(p.country) && !L.has(p.beta)).map(p => p.beta), a => a.length === 0);
  const hubs = manifest.pages.filter(p => p.kind === 'country-hub' && p.gen === 'new');
  chk('country hubs generated', hubs.map(h => h.beta), a => a.length >= 5 && a.includes('Japan/index.html'));
  const missing = [], wrong = [], foreign = [];
  for (const h of hubs) {
    const d = doc(rd(h.beta)), H = hrefsFrom(h.beta, d);
    for (const p of cityPages.filter(p => p.country === h.country)) if (!H.has(p.beta)) missing.push(`${h.beta} → ${p.beta}`);
    for (const li of d.querySelectorAll('li.dest')) {
      const p = cityPages.find(x => x.key === li.dataset.page);
      if (!p) { foreign.push(li.dataset.page); continue; }
      if (p.country !== h.country) foreign.push(`${h.beta}: ${p.key}`);
      const n = +((li.querySelector('.dest-c') || {}).textContent || '').replace(/[^\d].*$/s, '');
      if (n !== count(p)) wrong.push(`${h.beta}: ${p.key} ${n} != ${count(p)}`);
    }
    if (!L.has(h.beta)) missing.push(`index.html → ${h.beta}`);
  }
  chk('hub → city links missing', missing, a => a.length === 0);
  chk('hub tiles whose count != live page', wrong, a => a.length === 0);
  chk('hub tiles from another country', foreign, a => a.length === 0);
  const tiles = [...land.querySelectorAll('li.dest')];
  chk('landing tiles with a signature or canon line where data has one', tiles.filter(li => li.querySelector('.tile') && !li.querySelector('.star, .canon, .sigline')).length, n => n <= tiles.length * 0.2);
  chk('landing pills == live countries, countries.json order', [...land.querySelectorAll('.countries a')].map(a => a.getAttribute('href').slice(1)).join(), countries.filter(c => c.live).sort((a, b) => a.order - b.order).map(c => c.key).join());
}

// ── 2. shell ───────────────────────────────────────────────────────────────
console.log('\n== SHELL: one top bar component on every generated page ==');
{
  const shape = el => el.tagName.toLowerCase() + '.' + [...el.classList].filter(c => c !== 'on-night').sort().join('.') +
    (el.children.length ? '[' + [...el.children].filter(c => !c.matches('nav.crumbs')).map(shape).join(',') + ']' : '');
  const shapes = {}, problems = [];
  for (const rel of manifest.generated) {
    const d = doc(rd(rel));
    const bars = d.querySelectorAll('[data-cleo-shell="topbar"]');
    if (bars.length !== 1) { problems.push(`${rel}: ${bars.length} top bars`); continue; }
    (shapes[shape(bars[0])] = shapes[shape(bars[0])] || []).push(rel);
    if (!d.querySelector('a.skip[href="#main"]') || !d.getElementById('main')) problems.push(`${rel}: skip link`);
    for (const s of ['header', 'nav', 'main', 'footer']) if (!d.querySelector(s)) problems.push(`${rel}: no <${s}>`);
    if (!bars[0].querySelector('a[href$="saved.html"]')) problems.push(`${rel}: no "Your list" entry`);
    const brand = bars[0].querySelector('a.brand'); if (!brand || !/index\.html$/.test(brand.getAttribute('href'))) problems.push(`${rel}: wordmark not → landing`);
    const p = manifest.pages.find(x => x.beta === rel);
    if (p && p.kind === 'city' && liveC.has(p.country)) {
      const c = countries.find(x => x.key === p.country);
      const crumbs = bars[0].querySelector('nav.crumbs');
      if (!crumbs || !crumbs.textContent.includes(c.name)) problems.push(`${rel}: breadcrumb lacks ${c.name}`);
    }
  }
  chk('top bar shapes across generated pages', Object.keys(shapes).length, 1);
  chk('shell problems', problems, a => a.length === 0);
}

// ── 3. method page ─────────────────────────────────────────────────────────
console.log('\n== METHOD: computed, complete, linked ==');
{
  const h = rd('how-we-choose.html');
  const total = cityPages.reduce((s, p) => s + count(p), 0);
  chk('method page shows the computed place total', h.includes(total.toLocaleString('en-US')), true);
  chk('method sections present', ['merit', 'sources', 'tiers', 'pins', 'closures', 'gaps', 'added'].filter(id => !h.includes(`id="${id}"`)), a => a.length === 0);
  chk('method copy: ≥2 sources, lone Michelin/JBF, Yelp/TripAdvisor never recommender', [/at least two credible sources/, /Michelin or James Beard/, /Yelp and TripAdvisor never count as the recommender/, /Closed places stay, flagged/, /Added by the guide \(general knowledge\)/].filter(r => !r.test(h)).map(String), a => a.length === 0);
  chk('generated pages whose footer does not link the method page', manifest.generated.filter(r => !/<footer[\s\S]*how-we-choose\.html/.test(rd(r))), a => a.length === 0);
}


// ── 6. Wave 2: wanderlust (signature lines, compositions, editorial themes), accessibility, share ──────────
console.log('\n== W2: signature lines from data, distinct tiles, themes computed, accessibility page ==');
{
  const names = {};                                                  // page key -> Set of record names (data)
  for (const p of cityPages) {
    const j = JSON.parse(rd(`data/places/${p.key.replace(/\//g, '--')}.json`));
    names[p.key] = j;
  }
  const guideIdx = Object.fromEntries(JSON.parse(rd('data/guide.json')).pages.map(p => [p.key, p]));
  const land = doc(rd('index.html'));
  const tiles = [...land.querySelectorAll('li.dest')].filter(li => li.querySelector('.tile'));
  // every item on a signature line names a real, open record of that page (prefix of its name)
  const bad = [];
  for (const li of tiles) {
    const j = names[li.dataset.page]; if (!j) continue;
    for (const s of li.querySelectorAll('.sigline > span')) {
      const t = s.textContent.trim();
      const g = guideIdx[li.dataset.page], canonParts = g && g.tileLine ? g.tileLine.split(' · ') : [];
      if (!j.places.some(x => !x.closed && x.n.startsWith(t)) && !canonParts.some(c => c.startsWith(t))) bad.push(`${li.dataset.page}: ${t}`);
    }
  }
  chk('signature items that are neither the platform canon line nor an open record of the page', bad, a => a.length === 0);
  chk('tiles with a signature line', tiles.filter(li => li.querySelector('.sigline')).length, n => n >= tiles.length * 0.8);
  chk('tiles carrying a bare category label line instead', tiles.filter(li => li.querySelector('.canon') && li.querySelector('.sigline')).length, 0);
  // no two neighbouring tiles share composition AND skin
  const sig = a => [...a.classList].filter(c => /^(c-|skin-)/.test(c)).sort().join(' ') + (a.getAttribute('data-city') || '');
  const same = [];
  for (const ul of land.querySelectorAll('ul.tiles')) { const a = [...ul.querySelectorAll('a.tile')]; a.forEach((x, i) => { if (i && sig(x) === sig(a[i - 1])) same.push(x.getAttribute('href')); }); }
  chk('neighbouring tiles that look alike (same composition + skin)', same, a => a.length === 0);
  // editorial themes: every count recomputed from the per-page datasets by id
  const themes = [...land.querySelectorAll('#themes li.theme')];
  chk('landing editorial themes', themes.length, n => n >= 4);
  const wrongT = [];
  for (const t of themes) {
    for (const a of t.querySelectorAll('.theme-c a')) {
      const m = /^(.*\.html)#(c|cz)=([^&]+)$/.exec(a.getAttribute('href'));
      const p = m && manifest.pages.find(x => x.beta === m[1]);
      if (!p) { wrongT.push('bad href ' + a.getAttribute('href')); continue; }
      const field = m[2] === 'c' ? 'g' : 'cz', id = decodeURIComponent(m[3]);
      const n = names[p.key].places.filter(x => (x[field] || []).includes(id)).length;   // what the lens opens, closed included (QA-28)
      const shown = +a.querySelector('b').textContent.replace(/,/g, '');
      if (n !== shown) wrongT.push(`${p.key} ${id} ${shown}≠${n}`);
    }
  }
  chk('theme chips whose count differs from the data (ids, not keywords)', wrongT, a => a.length === 0);
  chk('Japan hub: country hero + why-go line + share', (() => { const d = doc(rd('Japan/index.html')); return !!d.querySelector('.chero .why') && !!d.querySelector('[data-cleo-share]') && !!d.querySelector('.chero svg'); })(), true);
  const a11y = rd('accessibility.html');
  chk('accessibility.html: WCAG 2.2 AA, known gaps, GitHub issue contact', /WCAG 2\.2 level AA/.test(a11y) && /id="gaps"/.test(a11y) && /github\.com\/alvations\/cleo-guide\/issues\/new/.test(a11y), true);
  chk('generated pages whose footer does not link accessibility.html', manifest.generated.filter(r => !/<footer[\s\S]*accessibility\.html/.test(rd(r))), a => a.length === 0);
}

// ── 7. W7: hub "Known for" from the guides' signatures; a hub hero photo never repeated on a card ─────────
console.log('\n== W7: hub "Known for" from child guides\' signatures; hero photo not reused by a card ==');
{
  const guideIdx = Object.fromEntries(JSON.parse(rd('data/guide.json')).pages.map(p => [p.key, p]));
  const hubs = manifest.pages.filter(p => p.kind === 'country-hub' && p.gen === 'new');
  const badKnown = [], dupHero = [], sameDish = [];
  // one dish, several names (the guides' canon table writes synonyms as "gaufre|waffle|waffles"): a class per synonym set
  const { CANON } = require('./lib/guide');
  const fold = x => String(x).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const cls = new Map();
  for (const c of Object.values(CANON)) for (const dd of c.dishes || []) { const alts = dd.split('|').map(fold); for (const x of alts) if (!cls.has(x)) cls.set(x, alts.slice().sort().join('|')); }
  const dishClassOf = n => cls.get(fold(n)) || fold(n);
  let nKnown = 0;
  for (const h of hubs) {
    const d = doc(rd(h.beta));
    const kids = cityPages.filter(p => p.country === h.country);
    // allowed: each child guide's signature (tile line) and its open tier-1 record names
    const allowed = kids.flatMap(p => {
      const g = guideIdx[p.key], j = JSON.parse(rd(`data/places/${p.key.replace(/\//g, '--')}.json`));
      return (g && g.tileLine ? g.tileLine.split(' · ') : []).concat(j.places.filter(x => !x.closed && x.t === 1).map(x => x.n));
    });
    const classes = [];
    for (const s of d.querySelectorAll('.chero .why .l > span')) {
      nKnown++;
      classes.push(dishClassOf(s.textContent.trim()));
      const t = s.textContent.trim();
      if (!allowed.some(a => a.startsWith(t))) badKnown.push(`${h.beta}: ${t}`);
    }
    if (new Set(classes).size !== classes.length) sameDish.push(`${h.beta}: ${classes.join(' / ')}`);
    const heroSrc = [...d.querySelectorAll('.chero .hero-media figcaption a')].map(a => a.getAttribute('href')).find(u => !/creativecommons|\/licen[cs]e|publicdomain/i.test(u || ''));
    if (heroSrc) for (const a of d.querySelectorAll('li.dest .credit a')) if (a.getAttribute('href') === heroSrc) dupHero.push(`${h.beta}: ${heroSrc}`);
  }
  chk(`hub "Known for" items (${nKnown}) that are neither a child guide's signature nor an open tier-1 place`, badKnown, a => a.length === 0 && nKnown >= hubs.length);
  chk('hub hero photo reused by a card on the same hub', dupHero, a => a.length === 0);
  chk('hub "Known for" lines naming one dish twice (synonyms from the canon table)', sameDish, a => a.length === 0);
}

// ── 8. W9-2: the landing's "<month> in Cleo" module — every number a sum of data/changes.json; links resolve ──────
console.log('\n== W9-2: "<month> in Cleo" from data/changes.json; What changed links + the feed resolve ==');
{
  const C = JSON.parse(rd('data/changes.json')), d = doc(rd('index.html'));
  const sec = d.getElementById('month'), act = C.pages.filter(p => p.month && (p.month.checked || p.month.closed));
  const sum = k => act.reduce((t, p) => t + p.month[k], 0), n = x => x.toLocaleString('en-US');
  chk('module present, for the newest month on record', !!sec && sec.querySelector('.month-lede').dataset.month === C.month, true);
  const lede = sec ? sec.querySelector('.month-lede').textContent : '';
  chk('lede numbers == changes.json sums (re-checked, closed, retiring, pins, guides)', [n(sum('checked')), n(sum('closed')), n(sum('retiring')) + ' of them retiring', n(sum('pins')), String(act.length)].every(x => lede.includes(x)), true);
  // retiring is recomputed here from the closure notes themselves (lib/changes.js RETIRING), never typed. QC-25: the
  // notes never ship, so they are read from data/geocodes.json (closed entries, by base name) for each closure this month
  const { RETIRING } = require('./lib/changes'), { baseName } = require('./lib/model');
  const GEO = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'geocodes.json'), 'utf8')).cities, notes = {};
  Object.values(GEO).forEach(c => Object.entries(c || {}).forEach(([nm, e]) => { if (e && e.status === 'closed' && e.statusSource) (notes[baseName(nm)] = notes[baseName(nm)] || []).push(e.statusSource); }));
  const rt = C.pages.reduce((t, p) => t + JSON.parse(rd('data/places/' + p.changesPage.replace(/^changes\//, '').replace(/\.html$/, '.json'))).changes.filter(e => e.kind === 'closed' && e.d.slice(0, 7) === C.month && (notes[e.name] || []).some(n => RETIRING.test(n))).length, 0);
  // QC-25: no closure note text in any shipped JSON — only its URL (src)
  chk('no closure note text ships in data/places/*.json (QC-25)', C.pages.filter(p => JSON.parse(rd('data/places/' + p.changesPage.replace(/^changes\//, '').replace(/\.html$/, '.json'))).changes.some(e => 'note' in e || (e.src && !/^https?:\/\//.test(e.src)))).map(p => p.key), a => a.length === 0);
  chk(`retiring (${rt}) == closures this month whose sourced note announces a retirement or a last day`, sum('retiring') === rt, true);
  const mName = JSON.parse(rd('assets/i18n/en.json')).strings['land.month.names'].split(',')[+C.month.slice(5, 7) - 1] + ' ' + C.month.slice(0, 4);
  chk(`heading reads "This month in Cleo"; the lede names the month (${mName})`, !!sec && sec.querySelector('#month-h').textContent === 'This month in Cleo' && lede.startsWith('In ' + mName + ':'), true);
  const rows = sec ? [...sec.querySelectorAll('.month-list a')] : [];
  const bad = rows.filter(a => { const p = C.pages.find(x => x.changesPage === a.getAttribute('href'));
    return !p || !fs.existsSync(path.join(BETA, a.getAttribute('href'))) || +a.dataset.checked !== p.month.checked || +a.dataset.closed !== p.month.closed; }).map(a => a.getAttribute('href'));
  chk(`rows (${rows.length}) == guides with activity, each linking to its What changed page with its own numbers`, bad.length === 0 && rows.length === act.length, true);
  const feed = sec && sec.querySelector('a[href="feeds/all.xml"]');
  chk('"Follow changes" links the site feed, which exists', !!feed && /<feed xmlns="http:\/\/www.w3.org\/2005\/Atom">/.test(rd('feeds/all.xml')), true);
}

// ── 9. R7-g2b: the tab bar is fully opaque — content never shows through it ──────────────────────────────────
{
  const css = rd('assets/cleo.css');
  const top = [...css.matchAll(/:root \.tabbar\s*\{([^}]*)\}/g)].map(m => m[1]).filter(b => /background\s*:/.test(b)).pop() || '';
  chk('tab bar background is opaque (the winning :root .tabbar rule)', (/background\s*:\s*([^;]+)/.exec(top) || [])[1], v => !!v && !/color-mix|transparent|rgba|hsla|\/\s*[\d.]+%?\s*\)/.test(v));
}

// ── 5. voice lint ──────────────────────────────────────────────────────────
console.log('\n== VOICE: urgency lint on FE-B pages ==');
{
  const LINT = /trending|popular now|only \d+ left|hurry|selling fast|book now|don't miss out|limited time|best-selling/i;
  const mine = ['index.html', 'how-we-choose.html', 'accessibility.html', '404.html'].concat(manifest.pages.filter(p => p.kind === 'country-hub' && p.gen === 'new').map(p => p.beta));
  chk('FE-B pages with an urgency word', mine.filter(r => LINT.test(doc(rd(r)).body.textContent)), a => a.length === 0);
}

// ── 4. states, in jsdom ────────────────────────────────────────────────────
async function load(rel, { url, storageThrows = false, fetchFails = false, seed = null } = {}) {
  const html = rd(rel).replace(/<script src="([^"]+)"( defer)?><\/script>/g, (m, src) => {
    const p = path.join(BETA, path.posix.dirname(rel), src.split('?')[0]);
    return fs.existsSync(p) ? `<script>${fs.readFileSync(p, 'utf8').replace(/<\/script/g, '<\\/script')}</script>` : '';
  });
  const errors = [], fetched = [];
  const dom = new JSDOM(html, { url: url || 'https://cleo.local/beta/' + rel, runScripts: 'dangerously', pretendToBeVisual: true,
    beforeParse(w) {
      w.addEventListener('error', e => errors.push(String(e.message)));
      if (storageThrows) Object.defineProperty(w, 'localStorage', { get() { throw new Error('blocked'); } });
      else if (seed) for (const k in seed) w.localStorage.setItem(k, JSON.stringify(seed[k]));
      w.fetch = u => { fetched.push(String(u)); return fetchFails ? Promise.reject(new Error('offline'))
        : Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(rd((/(?:^|\/)(data\/[\w./-]+\.json)$/.exec(String(u)) || [])[1] || 'data/search.json'))) }); };   // the site's own data files
      w.Element.prototype.scrollIntoView = function () {};
    } });
  await sleep(60);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  await sleep(250);
  return { w: dom.window, d: dom.window.document, errors, fetched };
}

(async () => {
  console.log('\n== STATES (jsdom): copy per VOICE.md ==');
  const total = cityPages.reduce((s, p) => s + count(p), 0).toLocaleString('en-US');
  {
    const { d, errors } = await load('index.html', { url: 'https://cleo.local/beta/index.html?q=zzqxv' });
    const st = d.querySelector('[data-cleo-state="no-results"]');
    chk('0 results: state shown', !!st, true);
    chk('0 results: copy', st && /No places match “zzqxv”\./.test(st.textContent) && st.textContent.includes(`all ${total} places`), true);
    chk('0 results: destinations still listed', d.querySelectorAll('li.dest').length, n => n > 50);
    st && st.querySelector('[data-cleo-clear]').click(); await sleep(20);
    chk('0 results: "Clear search" clears', d.getElementById('results').hidden, true);
    chk('landing JS errors', errors, a => a.length === 0);
  }
  {
    const { d: dk } = await load('index.html', { url: 'https://cleo.local/beta/index.html?q=kyoto' });
    chk('search: guide names match too ("kyoto" → the Kyoto guide)', [...dk.querySelectorAll('#results .grp.guides a')].some(a => /kyoto\.html$/.test(a.getAttribute('href'))), true);
  }
  {
    const { d } = await load('index.html', { url: 'https://cleo.local/beta/index.html?q=senso-ji' });
    const a = [...d.querySelectorAll('#results li a')];
    chk('search: accent-folded "senso-ji" finds Sensō-ji with a #p= deep link', a.some(x => /Sensō-ji/.test(x.textContent) && /tokyo\.html#p=senso-ji/.test(x.getAttribute('href'))), true);
  }
  {
    const { d } = await load('index.html', { url: 'https://cleo.local/beta/index.html?q=a', });
    const shown = d.querySelectorAll('#results .grp:not(.guides) li').length, head = d.querySelector('#results h2').textContent;
    chk('search: every match reachable (folded groups expand to all)', (() => { d.querySelectorAll('[data-cleo-more]').forEach(b => b.click()); return d.querySelectorAll('#results .grp:not(.guides) li:not([hidden])').length === shown && head.startsWith(String(shown)); })(), true);
  }
  // W9-3: interests picked on a city page follow you — a "For you" rail on the landing and hubs that only reorders
  {
    const { d } = await load('index.html');
    chk('for you: no interests → no rail', d.getElementById('foryou').hidden, true);
  }
  for (const [rel, on] of [['index.html', ['history']], ['index.html', ['food', 'art']], ['Japan/index.html', ['pop']]]) {
    const { w, d, errors } = await load(rel, { seed: { 'cleo:v1:interests': on } });
    const sec = d.getElementById('foryou'), rows = [...sec.querySelectorAll('.fy-list a')];
    const cards = [...d.querySelectorAll('li.dest[data-page]')].filter(li => !sec.contains(li));
    const want = new Map();                                   // expected: open places per guide for these ids, from data-fy
    for (const li of cards) { const k = li.querySelector('a').getAttribute('href'); if (want.has(k)) continue;
      const fy = Object.fromEntries((li.getAttribute('data-fy') || '').split(' ').filter(Boolean).map(x => x.split(':')).map(([a, b]) => [a, +b]));
      want.set(k, on.reduce((s, id) => s + (fy[id] || 0), 0)); }
    const got = rows.map(a => [a.getAttribute('href'), +a.getAttribute('data-fy-rank')]);
    chk(`for you (${rel} · ${on}): rail shown`, !sec.hidden && rows.length > 0, true);
    chk(`for you (${rel} · ${on}): every guide with a match, most first, counts == data-fy`, JSON.stringify(got),
      JSON.stringify([...want].filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1])));   // stable: page order on ties
    chk(`for you (${rel} · ${on}): each row says "First because …" with each interest's own open-place count (no summed total)`,
      rows.filter(a => { const li = cards.find(c => c.querySelector('a').getAttribute('href') === a.getAttribute('href'));
        const fy = Object.fromEntries(li.getAttribute('data-fy').split(' ').map(x => x.split(':')));
        return a.querySelector('.dest-s').textContent !== 'First because: ' + on.filter(id => +fy[id] > 0).map(id => JSON.parse(sec.getAttribute('data-labels'))[id] + ' ' + (+fy[id]).toLocaleString('en-US')).join(' · ') || a.querySelector('.dest-c'); }), a => a.length === 0);
    chk(`for you (${rel} · ${on}): reorders only — every guide card still listed`, cards.length, cards.filter(li => !li.closest('[hidden]')).length);
    if (rel === 'index.html' && on.length === 1) {
      sec.querySelector('[data-cleo-fy-clear]').click(); await sleep(10);
      chk('for you: Clear hides the rail and forgets the interests', sec.hidden && w.localStorage.getItem('cleo:v1:interests') === '[]', true);
    }
    chk(`for you (${rel}): no JS errors`, errors, a => a.length === 0);
  }
  {
    const { d, errors } = await load('Japan/index.html', { storageThrows: true });
    chk('for you: storage blocked → no rail, no errors', d.getElementById('foryou').hidden && errors.length === 0, true);
  }
  // W9-6: paste a link — a source URL opens that source's places; the pasted address is only read, never fetched
  {
    const { d, errors, fetched } = await load('index.html', { url: 'https://cleo.local/beta/index.html?q=' + encodeURIComponent('https://www.timeout.com/chicago/restaurants/x') });
    const box = d.querySelector('#results [data-cleo-source]'), links = [...d.querySelectorAll('#results a[href*="#src="]')];
    chk('paste a link: a source URL lists the guides that cite it', !!box && links.length >= 1 && links.some(a => /chicago\.html#src=time-out-chicago$/.test(a.getAttribute('href'))), true);
    chk('paste a link: every #src= link resolves to a built guide', links.filter(a => !fs.existsSync(path.join(BETA, a.getAttribute('href').split('#')[0]))), a => a.length === 0);
    chk('paste a link: nothing fetched from the pasted host', fetched.filter(u => /timeout\.com/.test(u) || /^https?:/.test(u) && !u.startsWith('https://cleo.local/')), a => a.length === 0);
    chk('paste a link: no JS errors', errors, a => a.length === 0);
  }
  {
    const { d, fetched } = await load('index.html', { url: 'https://cleo.local/beta/index.html?q=' + encodeURIComponent('https://zzqxv-unknown.example/a') });
    const st = d.querySelector('#results [data-cleo-state="no-source"]'), sug = st && st.querySelector('a[data-cleo-suggest]');
    chk('paste a link: an unknown host says so plainly (VOICE) and offers "Suggest this source" via the project issue flow', !!st && /^No guide cites zzqxv-unknown\.example yet\./.test(st.querySelector('h3').textContent)
      && !!sug && sug.textContent === 'Suggest this source' && sug.getAttribute('href').startsWith('https://github.com/alvations/cleo-guide/issues/new?labels=source-suggestion'), true);
    chk('paste a link: an unknown URL makes 0 calls beyond the site\'s own JSON', fetched.filter(u => !/^(?:https:\/\/cleo\.local\/beta\/)?data\/[\w./-]+\.json$/.test(u)), a => a.length === 0);
  }
  // W9-6 acc1: a site match opens "Everything <source> recommends, in N guides"; a specific page also lifts the places citing
  // exactly that URL. gotokyo.org has no listed domain — it is learnt from the URLs the Tokyo records cite.
  {
    const u = 'https://www.gotokyo.org/en/story/guide/a-noble-look-at-tokyos-imperial-palace-a-guide-to-the-royal-residence/index.html?utm=x#top';
    const { d, errors } = await load('index.html', { url: 'https://cleo.local/beta/index.html?q=' + encodeURIComponent(u) });
    const hs = [...d.querySelectorAll('#results h2[data-cleo-source]')].map(h => h.textContent);
    const ex = [...d.querySelectorAll('#results [data-cleo-source-url] a')].map(a => a.getAttribute('href'));
    chk('paste a link: gotokyo.org (no listed domain) → "Everything GO Tokyo recommends, in 1 guide"; the page lifts its place', [hs.some(t => /^Everything GO Tokyo recommends, in 1 guide/.test(t)), ex.includes('cities/tokyo.html#p=imperial-palace-east-gardens'), errors.length], a => JSON.stringify(a) === '[true,true,0]');
  }
  {
    // 20 cited URLs sampled across all guides: each opens its source's view with that guide (#src=<id>) and the page's places
    const all = []; for (const f of fs.readdirSync(path.join(BETA, 'data/places'))) { const j = JSON.parse(rd('data/places/' + f)), g = {};
      (j.sourceIndex || []).forEach(s => (s.entries || []).forEach(e => { g[e.key] = s.id; }));
      j.places.forEach(pl => (pl.s || []).forEach(([k, url]) => { if (/^https?:\/\//.test(url || '') && g[k] && g[k] !== 'guide') all.push([j.beta, g[k], pl.id, url]); })); }
    const pick = Array.from({ length: 20 }, (_, i) => all[Math.floor((i + 0.5) * all.length / 20)]);
    const { w, d } = await load('index.html');
    const host = d.createElement('div'); d.body.appendChild(host); const bad = [];
    for (const [beta, sid, id, url] of pick) {
      await w.Cleo.query(host, url); await sleep(5);
      const src = [...host.querySelectorAll('h2[data-cleo-source] + ol a, [data-cleo-source] ~ ol a')].map(a => a.getAttribute('href'));
      const ex = [...host.querySelectorAll('[data-cleo-source-url] a')].map(a => a.getAttribute('href'));
      const okSrc = [...host.querySelectorAll('a')].some(a => a.getAttribute('href') === beta + '#src=' + encodeURIComponent(sid));
      if (!okSrc || !ex.includes(beta + '#p=' + encodeURIComponent(id))) bad.push(`${url} → src ${okSrc}, place ${ex.includes(beta + '#p=' + encodeURIComponent(id))}`);
    }
    chk(`paste a link: 20 sampled source URLs open the right source view (guide + #src) and lift the citing place`, bad, a => a.length === 0);
  }
  {
    const { d } = await load('index.html', { url: 'https://cleo.local/beta/index.html?q=ramen', fetchFails: true });
    chk('index failed: state shown, guides still listed', !!d.querySelector('[data-cleo-state="index-failed"]') && d.querySelectorAll('li.dest').length > 50, true);
  }
  {
    const { w, d } = await load('Japan/index.html');
    w.dispatchEvent(new w.Event('offline')); await sleep(10);
    const b = d.querySelector('[data-cleo-banner="offline"]');
    chk('offline: banner copy', b && b.textContent.includes('You’re offline — the guide still works.'), true);
    w.dispatchEvent(new w.Event('online')); await sleep(10);
    chk('offline: banner clears when back online', !d.querySelector('[data-cleo-banner="offline"]'), true);
  }
  {
    const { d, errors } = await load('saved.html', { storageThrows: true });
    const b = d.querySelector('[data-cleo-banner="storage"]');
    chk('storage blocked: banner copy on Your list', b && b.textContent.includes('Storage is blocked here, so saves last until you close the tab.'), true);
    chk('storage blocked: no JS errors', errors, a => a.length === 0);
  }
  {
    const { d } = await load('how-we-choose.html');
    d.querySelector('[data-cleo-search-open]').click(); await sleep(10);
    const inp = d.getElementById('cleo-pq');
    chk('header search: panel opens on a non-landing page', !!inp && !inp.closest('[hidden]'), true);
    inp.value = 'temple'; inp.dispatchEvent(new d.defaultView.Event('input')); await sleep(250);
    chk('header search: results grouped by guide', d.querySelectorAll('.searchpanel .grp').length, n => n >= 1);
    inp.dispatchEvent(new d.defaultView.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })); await sleep(5);
    const first = d.querySelector('.searchpanel .results a');
    chk('header search: ArrowDown moves into the results', d.activeElement === first, true);
    first.dispatchEvent(new d.defaultView.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })); await sleep(5);
    chk('header search: ArrowDown again moves to the next result', d.activeElement !== first && !!d.activeElement.closest('.searchpanel .results'), true);
    d.activeElement.dispatchEvent(new d.defaultView.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await sleep(5);
    chk('header search: Esc in results returns to the input', d.activeElement === inp, true);
    inp.dispatchEvent(new d.defaultView.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await sleep(10);
    chk('header search: Esc closes', d.querySelector('.searchpanel').hidden, true);
  }
  {
    const d = doc(rd('404.html'));
    const st = d.querySelector('[data-cleo-state="unknown-page"]');
    chk('unknown page: copy + way on', st && /We couldn't find that page\./.test(st.textContent) && !!st.querySelector('a[href="index.html#destinations"]'), true);
  }
  // W3 views (Guidebook + Insights + hub view links): its own file, run here so it is part of `npm test`
  const vb = require('child_process').spawnSync(process.execPath, [path.join(__dirname, 'test-views-b.js')], { stdio: 'inherit' });
  if (vb.status !== 0) failures++;
  console.log(failures ? `\n>>> FAIL — ${failures} FE-B check(s) failed` : '\n>>> PASS — FE-B: every city reachable, one shell, method computed, states worded');
  process.exit(failures ? 1 : 0);
})();
