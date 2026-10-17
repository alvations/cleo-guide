#!/usr/bin/env node
'use strict';
/**
 * tools/beta/build.js — the beta generator. Emits beta pages FROM DATA (the records each live page renders),
 * with a record-count gate that refuses to write on any mismatch. See design/beta/RFC-architecture.md.
 *
 *   node tools/beta/build.js            # build every page the new generator owns + data indexes + PWA shell
 *   node tools/beta/build.js --check    # build in memory, diff against beta/ on disk, exit 1 if stale
 *   node tools/beta/build.js --list     # print the live→beta page map (who generates what)
 *   (npm run beta from tools/)
 *
 * Reads only: the live pages, data/countries.json, data/geocodes.json. Writes only under beta/.
 * Pages still on the legacy re-skin are left alone (tools/beta-restyle.py skips what this owns, via
 * beta/data/manifest.json). Output is deterministic (no timestamps), so --check is a reproducibility test.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { buildRegistry, ROOT } = require('./lib/registry');
const { rowsOf: galleryRows } = require('./lib/gallery');
const { normalise, nativeOf, publicName } = require('./lib/model');
const stats = require('./lib/stats');
const { pageSources, siteSources } = require('./lib/sources');
const art = require('./lib/art');
const { sentence, ownWords } = require('./lib/casing');               // W8 owner rule: sentence case for data labels
const imagery = require('./imagery');                              // imagery lane: motifs, photo manifest, credit gate
const quoted = require('./lib/quoted');                            // D-39: price/rating prose is labelled, not stripped
const { guide } = require('./lib/guide');
const { chunk } = require('./lib/chunk');
const views = require('./lib/views');
const changes = require('./lib/changes');                          // W3: "what changed" feeds from dated provenance (gap #9)                              // W3: rank, kind triad, insights (view-agnostic)
const { assertCityPage, assertHubPage, assertPage } = require('./lib/guards');
const { swSource } = require('./lib/sw');
const { BETA_BASE } = require('./lib/render/common');
const city = require('./lib/render/city');
const landing = require('./lib/render/landing');
const saved = require('./lib/render/saved');
const tripPage = require('./lib/render/trip');                  // FE-C W9-4: beta/trip.html
const shell = require('./lib/render/shell');                       // FE-B: site context for header/footer
const hub = require('./lib/render/hub');                           // FE-B: country hubs + SEA archive
const method = require('./lib/render/method');                     // FE-B: how-we-choose.html, 404.html
const changesPage = require('./lib/render/changes');
const recognition = require('./lib/recognition');                 // W9-1 / W9-9 (platform): design/beta/RECOGNITION.md               // W4 gap #9: human-readable "What changed" per page

const BETA = path.join(ROOT, 'beta');
const args = new Set(process.argv.slice(2));
const sha = b => crypto.createHash('sha1').update(b).digest('hex').slice(0, 10);
const out = new Map();                 // beta-relative path -> Buffer|string (nothing hits disk until all gates pass)
const emit = (rel, body) => out.set(rel, body);
const errors = [];

// ---------------------------------------------------------------- registry + model
const reg = buildRegistry();
const cityRows = reg.rows.filter(r => r.kind === 'city');
for (const r of cityRows) {
  r._geo = reg.geo;
  r.recs = normalise(r);
  if (r.recs.length !== r.counts.P + r.counts.F) errors.push(`${r.live}: model ${r.recs.length} != live ${r.counts.P + r.counts.F}`);
  r.sources = pageSources(r, r.recs);             // stamps rec.src (publisher ids) — M1-10
  r.sources.list.forEach(s => { if (s && s.name) s.name = publicName(s.name); });   // FE-B R8 gap #2d: display names (registry stays verbatim)
  r.recog = recognition.pageRecognition(r, r.recs, r.sources.list, ROOT);   // W9-1/W9-9: badges + local favourites from source keys only
  r.stats = stats.pageStats(r, r.recs);           // every number the page prints — M1-20
  // D-39 (QA-65): a record whose own prose quotes a price or rating carries `pq` (the research date) on the record
  // itself, so the card (data-pq → the place detail) and the page JSON (Guidebook) label it from one value
  for (const x of r.recs) if (quoted.quotes(x)) x.pq = quoted.researched(x) || r.stats.lastChecked || 'undated';
  r.guide = guide(r, r.recs);                     // ★ signature, canon-first food order, day plans, recently closed (W2)
  r.order = views.stamp(r, r.recs);               // W3 P-01: rank/of/k3 on every record; the view order (area, then rank)
  r.insights = views.insights(r, r.recs);         // W3 P-03: every number the Insights view draws
  r.fy = city.interests(r.recs.filter(x => !x.closed), r.data).map(([id, , n]) => [id, n]);   // W9-3: open places per interest id
  const m = r.data.meta;
  r.name = m.h1Main || r.key;
  r.nat = nativeOf(m.eyebrow) || nativeOf(m.h1) || null;
  r.searchPlaceholder = stats.searchPlaceholder(r.name);
  // Live prose carries hand-typed counts that drift (Cleveland: "143 sights and 40" vs 148 + 46). Rewrite
  // the engine's count phrase from the computed numbers before any renderer sees it.
  for (const f of ['standfirst', 'description']) if (m[f]) m[f] = stats.fixProseCounts(m[f], r.stats);
  // W8 (owner): the ★ signature's display label in sentence case (lib/casing.js), for the landing, hubs and Guidebook;
  // `title` stays the data's own (grouping key); the page's own place names keep their capitals
  const sg = r.guide && r.guide.signature;
  if (sg && sg.title) sg.label = sentence(sg.title, ownWords(r.name, r.nat, m.h1Native, ...(r.data.AREAS || []).map(a => a.n)));
}
// Hub/landing aggregates: renderers read these, never re-count.
for (const c of reg.countries) { c.stats = stats.countryStats(reg, c); c.pages = stats.countryPages(reg, c); }
reg.stats = stats.siteStats(reg);

// Guard self-test (used by test-beta.js): simulate content loss on one generated page — the gate must refuse.
if (process.env.CLEO_BETA_SELFTEST_DROP) {
  const victim = cityRows.find(r => r.gen === 'new');
  if (victim) victim.recs = victim.recs.slice(1);
}

if (args.has('--list')) {
  for (const r of reg.rows) console.log(r.gen.padEnd(7), r.kind.padEnd(12), (r.country || '-').padEnd(10), r.live, r.counts ? `${r.counts.P}+${r.counts.F}` : '');
  process.exit(0);
}

// ---------------------------------------------------------------- static assets (client JS, vendor, icon)
const CLIENT = path.join(__dirname, 'client');
const assetsV = {};
// Platform W7 (R6 gap #5): client JS ships minified — the eager-JS budget is ≤ 40.0 KB gzip with no rounding.
// terser is pinned (tools/package.json) so the output, and so `--check`, is deterministic. No source maps ship.
// Top-level names are kept (the files share globals as classic scripts); quotes keep their original style.
let terser = null;
try { terser = require('terser'); } catch (e) { errors.push('tools/node_modules/terser missing — run `cd tools && npm install` (beta JS minify step)'); }
const minify = (f, src) => {
  if (!terser) return src;
  const r = terser.minify_sync({ [f]: src }, { ecma: 2017, compress: { passes: 2 }, mangle: true, sourceMap: false,
    format: { comments: false, quote_style: 3, ascii_only: false } });
  return r.code;
};
// Atlas FE-2: client/atlas-nav.js (the map's interaction state) ships inside assets/js/atlas.js — one request, and it
// always runs right after atlas.js. Each file keeps its own source so the two Atlas lanes never edit the same lines.
// Platform (eager-JS budget, 2026-10-17): shared helpers only lazy modules and page scripts use go IN FRONT of each user
// (one source in client/, guarded so the first copy defines it) instead of in the eager core.js
const LEADS = { 'base.js': ['geo.js'], 'trip.js': ['geo.js', 'codec.js'], 'share-card.js': ['geo.js', 'codec.js'], 'saved.js': ['codec.js'], 'atlas.js': ['geo.js'] };
const RIDES = { 'atlas.js': ['atlas-nav.js'] }, RIDERS = new Set([].concat(...Object.values(RIDES), ...Object.values(LEADS)));
const clientSrc = f => (LEADS[f] || []).concat([f], RIDES[f] || []).map(x => fs.readFileSync(path.join(CLIENT, x), 'utf8')).join('\n');
// core.js goes last: its Cleo.need() carries the build's version of the lazy platform modules (__V_<name>__ → hash), so a
// page without a version map (landing, hubs) still asks for the exact URL the worker precached
for (const f of fs.readdirSync(CLIENT).filter(f => f.endsWith('.js') && !RIDERS.has(f)).sort((x, y) => (x === 'core.js') - (y === 'core.js') || (x < y ? -1 : x > y ? 1 : 0))) {
  let code; const src = f === 'core.js' ? clientSrc(f).replace(/__V_([a-z-]+)__/g, (m, n) => { if (!assetsV[n]) errors.push(`core.js asks for lazy module ${n} (no client/${n}.js)`); return assetsV[n] || ''; }) : clientSrc(f);
  try { code = minify(f, src); }
  catch (e) { errors.push(`minify ${f}: ${e.message}`); code = src; }
  const body = Buffer.from(`/* generated (minified) from tools/beta/client/${f} — do not edit here */\n` + code + '\n');
  emit('assets/js/' + f, body); assetsV[f.replace(/\.js$/, '')] = sha(body);
}
const cssPath = path.join(BETA, 'assets', 'cleo.css');            // owned by the designer lane; we only version it
if (!fs.existsSync(cssPath)) errors.push('beta/assets/cleo.css missing (designer-owned stylesheet)');
else assetsV.css = sha(fs.readFileSync(cssPath));
// FE-A page CSS (W2): city + saved mechanics cleo.css doesn't define yet, cached once instead of inlined per page.
// Source owned by FE-A (tools/beta/lib/render/fe-a.css); DES upstreams rules into cleo.css over time.
// Atlas lane (W7 Amendment 2): Atlas map-search CSS (tools/beta/lib/render/atlas.css) rides in the same file — one request.
// Atlas FE-2: lib/render/atlas-nav.css (the map's interaction state) rides after it.
const feaCss = Buffer.concat(['fe-a.css', 'atlas.css', 'atlas-nav.css', 'fe-c.css' /* FE-C W9-1 badges */].map((f, i) => Buffer.concat([Buffer.from(i ? '\n' : ''), fs.readFileSync(path.join(__dirname, 'lib', 'render', f))])));
// Platform (R8 gap #6, CSS weight): the lane stylesheets built here ship minified — comments dropped, whitespace runs
// collapsed, none kept around { } ; — while quoted strings and url(…) pass through untouched. Conservative on purpose:
// the space before ':' or '>' can be a descendant combinator, so it stays. Sources stay readable for their owners.
const cssMin = buf => {
  const s = buf.toString('utf8'); let o = '', i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '"' || c === "'") { let j = i + 1; while (j < s.length && s[j] !== c) j += s[j] === '\\' ? 2 : 1; o += s.slice(i, j + 1); i = j + 1; continue; }
    if (s.startsWith('url(', i)) { const j = s.indexOf(')', i); o += s.slice(i, j + 1); i = j + 1; continue; }
    if (s.startsWith('/*', i)) { const j = s.indexOf('*/', i + 2); i = j < 0 ? s.length : j + 2; if (!/\s$/.test(o)) o += ' '; continue; }
    if (/\s/.test(c)) { while (i < s.length && /\s/.test(s[i])) i++; if (!/[\s{};]$/.test(o) && !/^[{};]/.test(s.slice(i))) o += ' '; continue; }
    if (c === '{' || c === '}' || c === ';') o = o.replace(/ $/, '');
    o += c; i++;
  }
  return Buffer.from(o.trim() + '\n');
};
emit('assets/fe-a.css', cssMin(feaCss)); const feaV = sha(cssMin(feaCss));
// FE-B page CSS (W7): landing, hubs and static pages — tokens only; source owned by FE-B (lib/render/fe-b.css).
const febCss = cssMin(fs.readFileSync(require('./lib/render/shell').FEB_CSS_SRC)); emit('assets/fe-b.css', febCss);
const tokPath = path.join(BETA, 'assets', 'tokens.css');          // optional design tokens (designer, M0-01)
if (fs.existsSync(tokPath)) assetsV.tokens = sha(fs.readFileSync(tokPath));
emit('assets/icon.svg', fs.readFileSync(path.join(__dirname, 'static', 'icon.svg')));

// Leaflet, vendored from the pinned npm package (tools/package.json) so the map never needs a CDN.
const LEAF = path.join(ROOT, 'tools', 'node_modules', 'leaflet');
if (fs.existsSync(LEAF)) {
  const v = JSON.parse(fs.readFileSync(path.join(LEAF, 'package.json'), 'utf8')).version;
  if (v !== '1.9.4') errors.push(`leaflet ${v} installed; beta vendors 1.9.4 — bump deliberately`);
  for (const f of ['leaflet.js', 'leaflet.css']) emit('assets/vendor/leaflet/' + f, fs.readFileSync(path.join(LEAF, 'dist', f)));
  for (const f of fs.readdirSync(path.join(LEAF, 'dist', 'images'))) emit('assets/vendor/leaflet/images/' + f, fs.readFileSync(path.join(LEAF, 'dist', 'images', f)));
  emit('assets/vendor/leaflet/LICENSE', fs.readFileSync(path.join(LEAF, 'LICENSE')));
} else if (!fs.existsSync(path.join(BETA, 'assets', 'vendor', 'leaflet', 'leaflet.js'))) {
  errors.push('tools/node_modules/leaflet missing — run `cd tools && npm install` (vendored Leaflet source)');
}

// ---------------------------------------------------------------- map art (verified pins only) — M1-13 / M1-06
for (const r of cityRows) {
  const page = r.data, colors = Object.assign({}, page.AC || {});
  for (const a of page.AREAS || []) if (a.c && !colors[a.id]) colors[a.id] = a.c;
  r.colors = colors;
  r.art = { map: null, areas: {} };
  const dir = `assets/art/${r.fileKey}/`;
  const cm = art.cityMap(r.name, r.recs, colors);
  // W5 gap #5: the same URL the masthead CSS rule loads (cleo.css `url("art/<key>/map.svg")`), so the page fetches the
  // schematic once, not twice. Cache freshness: the service worker's cache name changes per build and drops old caches.
  if (cm) { emit(dir + 'map.svg', cm.svg); r.art.map = { src: `${dir}map.svg`, v: sha(cm.svg), w: cm.proj.w, h: cm.proj.h, proj: cm.proj, drawn: cm.drawn, beyond: cm.beyond }; }
  for (const a of page.AREAS || []) {
    const aa = art.areaArt(a.n, colors[a.id], r.recs.filter(x => x.a === a.id));
    if (!aa) continue;
    const f = `${dir}${a.id.replace(/[^A-Za-z0-9_-]/g, '_')}.svg`;
    emit(f, aa.svg); r.art.areas[a.id] = { src: `${f}?v=${sha(aa.svg)}`, w: aa.proj.w, h: aa.proj.h, proj: aa.proj, drawn: aa.drawn };
    // W2 hero scale (gaps #1/#6): soft silhouette at 960×540, and the day plan's numbered straight-line route on it
    const recsA = r.recs.filter(x => x.a === a.id), base = f.replace(/\.svg$/, '');
    const ah = art.areaHero(a.n, colors[a.id], recsA);
    if (ah) { emit(base + '.hero.svg', ah.svg); r.art.areas[a.id].hero = { src: `${base}.hero.svg?v=${sha(ah.svg)}`, w: ah.proj.w, h: ah.proj.h, proj: ah.proj }; }
    const plan = r.guide && r.guide.days.plans[a.id];
    const ad = plan && art.areaHero(a.n, colors[a.id], recsA, plan);
    if (ad && ad.stops) { emit(base + '.day.svg', ad.svg); r.art.areas[a.id].day = { src: `${base}.day.svg?v=${sha(ad.svg)}`, w: ad.proj.w, h: ad.proj.h, proj: ad.proj, stops: ad.stops }; }
    else if (plan) errors.push(`${r.live}: day plan ${a.id} has a stop with no verified pin to draw`);
  }
  const hero = art.cityHero(r.name, r.recs, colors, Object.fromEntries((page.AREAS || []).map(a => [a.id, a.n])));
  if (hero) { emit(dir + 'hero.svg', hero.svg); r.art.hero = { src: `${dir}hero.svg?v=${sha(hero.svg)}`, w: hero.proj.w, h: hero.proj.h, proj: hero.proj, drawn: hero.drawn, beyond: hero.beyond, labels: hero.labels }; }
  if (r.stats.verifiedPins && !r.art.map) errors.push(`${r.live}: ${r.stats.verifiedPins} verified pins but no map art`);
}

// ---------------------------------------------------------------- imagery (lane: imagery) — original motifs + credit-gated photos
imagery.build({ reg, cityRows, emit, errors, sha, betaDir: BETA });

// ---------------------------------------------------------------- UI string catalogues (M3-03, ROUND-3 gap #8)
const i18n = require('./lib/i18n');
for (const [rel, body] of i18n.files()) emit(rel, body);

// ---------------------------------------------------------------- what changed (ROUND-2 gap #9, M3-07): Atom feeds
const changeRows = changes.build(cityRows, emit);
emit('data/changes.json', JSON.stringify({ _generated: 'tools/beta/build.js — do not edit', v: 1,
  _doc: 'Per place page: its Atom feed, the newest dated event, closures and status checks on record, and `month` = what happened in the newest month on record (`month` at the top: YYYY-MM from the data, not the clock). Events come only from dates in data/geocodes.json (status checks, closures with their source, pin verifications).',
  month: changeRows.month, pages: changeRows }));
reg.changes = changeRows;                          // W9-2: the landing's "<month> in Cleo" module reads these rows

// ---------------------------------------------------------------- data indexes
const pageHref = r => r.beta;                     // beta-root-relative
const searchPages = [], searchItems = [];
/** W8 FE-B: { areaId: {id, src, w, h, alt, set: [[src, w]…], cap} } — the Guidebook chapter's lead photo, credit-gated. */
function chapterPhotos(r) {
  if (r.country === 'vietnam') return {};
  const byId = Object.fromEntries(r.recs.map(x => [x.id, x])), out = {};
  for (const id of r.order.map(x => x.id)) {
    const x = byId[id]; if (!x || out[x.a] || x.closed || x.kind !== 'sight') continue;
    const ph = imagery.photoFor(r, x); if (!ph) continue;
    out[x.a] = { id: x.id, src: ph.src, w: ph.w, h: ph.h, alt: ph.credit.depicts, set: (ph.widths || []).map(w => [w.src, w.w]),
      cap: require('./imagery/photos').captionHtml(ph.credit) };
  }
  return out;
}
/** W9-10 FE-B: the Guidebook edition cover's photo = the guide's own credited hero (same shape as a chapter photo). */
function coverPhoto(r) {
  if (r.country === 'vietnam') return null;
  const ph = imagery.heroFor(r); if (!ph || !ph.credit) return null;
  return { src: ph.src, w: ph.w, h: ph.h, alt: ph.credit.depicts, set: (ph.widths || []).map(w => [w.src, w.w]),
    cap: require('./imagery/photos').captionHtml(ph.credit) };
}
for (const r of cityRows) {
  const page = r.data, areaN = Object.fromEntries((page.AREAS || []).map(a => [a.id, city.shortArea(a.n)]));
  const pi = searchPages.length;
  searchPages.push([r.key, page.meta.h1Main || r.key, pageHref(r), r.country || '', r.gen === 'new' ? 1 : 0]);
  for (const x of r.recs) searchItems.push([pi, x.id, x.n, x.kind === 'food' ? 'f' : 's', x.t, x.closed ? 1 : 0, areaN[x.a] || '']);
  // Perf audit PERF-04: the place detail's per-article links, sliced out of the dataset below (same data, ~7× smaller):
  // g = source key → publisher group id (sourceIndex), p = place id → [[source key, url], …] (http(s) urls only).
  {
    const g = {}; for (const s of r.sources.list || []) for (const e of s.entries || []) g[e.key] = s.id;
    const p = {}; for (const x of r.recs) { const s = (x.s || []).filter(y => y && /^https?:\/\//.test(y[1] || '')); if (s.length) p[x.id] = s; }
    emit(`data/links/${r.fileKey}.json`, JSON.stringify({ _generated: 'tools/beta/build.js — do not edit; slice of data/places/' + r.fileKey + '.json', v: 1, g, p }));
  }
  // Per-page open dataset: every record, its sources registry, areas/collections/cuisines, provenance.
  emit(`data/places/${r.fileKey}.json`, JSON.stringify({
    _generated: 'tools/beta/build.js from ' + r.live + ' — do not edit', v: 1, key: r.key, live: r.live, beta: r.beta, country: r.country, name: page.meta.h1Main,
    nat: r.nat, counts: { sights: r.counts.P, food: r.counts.F, total: r.counts.P + r.counts.F }, stats: r.stats,
    areas: page.AREAS || [], colors: r.colors, collections: page.CATS || [], cuisines: page.CUISINES || [],
    sources: { sights: page.S || {}, food: page.FS || {} },
    // Attribution as navigation (M1-10): one row per publisher, with the ids of every place it recommends.
    sourceIndex: r.sources.list, art: r.art, notes: page.notes,
    // W2 (platform → FE-A/FE-B): ★ signature (food canon / pop culture, never a publisher), canon-first cuisine order,
    // hub tile line, "Your day" per area, "Recently closed". Schema: design/beta/RFC-architecture.md §12.
    guide: r.guide,
    // W3 (platform → FE-A/FE-B): view order = area order then `rank` (also on every place); the Insights numbers. RFC §13.
    order: r.order.map(x => x.id), insights: r.insights,
    changes: r.changes, feed: r.feed,                // "what changed": dated events newest first + the page's Atom feed
    // W4 gap #6 (weight): the pin-source sentence (pv.src) moves to the provenance sidecar below; no client reads it
    prov: `data/prov/${r.fileKey}.json`,
    // D-39 (proposed, FE-B W8): `pq` = research date on records whose prose quotes a price or a rating (lib/quoted.js);
    // views show "Prices, ratings and times are quoted from the source at the time of research (<pq>)". Prose itself untouched.
    // W8 FE-B: Guidebook chapters lead with a credited photo where one exists — per area, the first open SIGHT in view
    // order with a credited photo (imagery gate: never closed, never Vietnam; never a food place). Caption = TASL, linked.
    chapterPhotos: chapterPhotos(r),
    // W9-10: the edition cover's credited hero photo (or null) and this guide's full "What changed" page
    coverPhoto: coverPhoto(r), changesPage: `changes/${r.fileKey}.html`,
    // W9-1 / W9-9 (platform): per-page recognition summary; per place `rec` {award, video, cited} and `lf` ride on places[]
    recognition: r.recog,
    places: r.recs.map(x => (x.pv && x.pv.src ? Object.assign({}, x, { pv: Object.assign({}, x.pv, { src: undefined }) }) : x))
      .map(x => quoted.quotes(x) ? Object.assign({}, x, { pq: quoted.researched(x) || r.stats.lastChecked || 'undated' }) : x),
  }));
  // ROUND-5 gap #2: the Gallery's rows + lead card, chosen here so its first screen never waits on the page JSON
  emit(`data/gallery/${r.fileKey}.json`, JSON.stringify(Object.assign({ _generated: 'tools/beta/build.js (lib/gallery.js) — do not edit', v: 1, key: r.key },
    galleryRows({ areas: page.AREAS || [], collections: page.CATS || [], cuisines: page.CUISINES || [], guide: r.guide, places: r.recs, photos: (r.imagery && r.imagery.photos) || {} }, r.name || page.meta.h1Main || r.key))));
  emit(`data/prov/${r.fileKey}.json`, JSON.stringify({ _generated: 'tools/beta/build.js from data/geocodes.json — do not edit', v: 1, key: r.key,
    _doc: 'Pin provenance per place id: the published coordinate each pin was read from (data/geocodes.json `source`). Split from the page JSON to keep views light; the page JSON keeps pv.pin / pv.checked / pv.status / pv.verified.',
    pins: Object.fromEntries(r.recs.filter(x => x.pv && x.pv.src).map(x => [x.id, x.pv.src])) }));
}
const totalLive = cityRows.reduce((s, r) => s + r.counts.P + r.counts.F, 0);
if (searchItems.length !== totalLive) errors.push(`search index ${searchItems.length} != live total ${totalLive}`);
// W9-6 (FE-B "paste a link"): a pasted URL is normalised (host + path; no query, no hash) and matched — never fetched.
// data/source-hosts.json: host → the publishers cited there, per guide (from each guide's source domains AND every URL its
// records cite, so e.g. gotokyo.org maps to GO Tokyo even with no domain listed). data/source-urls/<0..31>.json, sharded
// by a hash of the host (the client computes the same): normalised URL → the places citing exactly that page.
{
  const normURL = u => { try { const x = new URL(u); const h = x.hostname.toLowerCase().replace(/^www\./, '');
    return { h, key: h + x.pathname.replace(/\/index\.html?$/i, '/').replace(/\/+$/, '') }; } catch (e) { return null; } };
  const bucket = h => { let v = 5381; for (let i = 0; i < h.length; i++) v = ((v * 33) ^ h.charCodeAt(i)) >>> 0; return v % 32; };
  const hosts = {}, urls = Array.from({ length: 32 }, () => ({}));
  for (const r of cityRows) {
    const list = (r.sources && r.sources.list) || [], byId = Object.fromEntries(list.map(s => [s.id, s])), g = {}, per = {};
    for (const s of list) for (const e of s.entries || []) g[e.key] = s.id;
    const addH = (h, sid) => { if (h && sid && sid !== 'guide' && byId[sid]) (per[h] = per[h] || new Set()).add(sid); };
    for (const s of list) for (const dom of s.domains || []) addH(String(dom).toLowerCase().replace(/^www\./, ''), s.id);
    for (const x of r.recs) for (const [k, u] of x.s || []) {
      const sid = g[k], nu = /^https?:\/\//.test(u || '') && normURL(u); if (!nu || !sid || sid === 'guide' || !byId[sid]) continue;
      addH(nu.h, sid);
      const b = urls[bucket(nu.h)], rows = (b[nu.key] = b[nu.key] || []);
      if (!rows.some(y => y[0] === r.beta && y[2] === x.id)) rows.push([r.beta, r.name, x.id, x.n, sid, publicName(byId[sid].name)]);
    }
    for (const [h, set] of Object.entries(per)) for (const sid of set) { const s = byId[sid]; (hosts[h] = hosts[h] || []).push([r.beta, r.name, s.id, publicName(s.name), s.n]); /* R8 #2d: public names */ }
  }
  for (const h of Object.keys(hosts)) hosts[h].sort((x, y) => y[4] - x[4] || (x[0] < y[0] ? -1 : 1));
  emit('data/source-hosts.json', JSON.stringify({ _generated: 'tools/beta/build.js — do not edit', v: 2,
    _doc: 'W9-6 paste a link: host (lowercase, no www.) → [[beta page, guide name, that page\'s source id, its name there, places it recommends there]…], most places first. From the guides\' source domains and every URL their records cite. Exact pages: data/source-urls/<bucket>.json (djb2-xor of the host, mod 32).',
    hosts: Object.fromEntries(Object.keys(hosts).sort().map(h => [h, hosts[h]])) }));
  urls.forEach((b, i) => emit(`data/source-urls/${i}.json`, JSON.stringify({ _generated: 'tools/beta/build.js — do not edit', v: 1,
    _doc: 'W9-6: normalised URL (host without www. + path, no query/hash/trailing slash/index.html) → [[beta page, guide name, place id, place name, source id, source name]…] for the places citing exactly that page.',
    urls: Object.fromEntries(Object.keys(b).sort().map(k => [k, b[k]])) })));
}
emit('data/sources.json', JSON.stringify({ _generated: 'tools/beta/build.js — do not edit', v: 1,
  _doc: 'Every publisher cited on any beta place page: id, display name, text authority mark, total records citing it, and [pageKey, n] per page. Per-page detail (entries, place ids) is in data/places/<page>.json sourceIndex.',
  sources: siteSources(cityRows) }));
// W9-9 acc1 (platform): the stated gap — every publisher the recognition rules could not type (never guessed), by page
{ const rows = cityRows.filter(r => r.recog && r.recog.untyped.length).map(r => ({ page: r.key, untyped: r.recog.untyped }));
  const typed = cityRows.reduce((a, r) => a + (r.recog ? r.recog.typed.sources : 0), 0), of = cityRows.reduce((a, r) => a + (r.recog ? r.recog.typed.of : 0), 0);
  emit('data/recognition-untyped.json', JSON.stringify({ _generated: 'tools/beta/build.js (lib/recognition.js) — do not edit', v: 1,
    _doc: 'Publishers left UNTYPED by the recognition rules (design/beta/RECOGNITION.md): no registry entry agrees on their key, host or domain, and no host rule applies. Typing them needs a registry entry (data/sources.json, owner), not a guess. They count against the local-favourites lens only by not qualifying.',
    typed, of, pages: rows }, null, 1)); }
// Site-wide "guide" index (FE-B hubs + landing rail): one row per place page, computed from the records.
emit('data/guide.json', JSON.stringify({ _generated: 'tools/beta/build.js — do not edit', v: 1,
  _doc: 'Per place page: ★ signature (kind, title, line, n), hub tile line, food canon and pop-culture counts, day-plan and closed counts. Detail is in data/places/<page>.json guide.',
  pages: cityRows.map(r => { const g = r.guide; return { key: r.key, name: r.name, href: r.beta, country: r.country || '',
    signature: g.signature && { kind: g.signature.kind, title: g.signature.title, line: g.signature.line, n: g.signature.n, c: g.signature.c, cz: g.signature.cz },
    tileLine: g.tileLine && g.tileLine.text, canon: g.canon && { title: g.canon.title, cz: g.canon.cz, n: g.canon.n, dishes: g.canon.dishes },
    popCulture: g.popCulture, days: Object.keys(g.days.plans).length, closed: g.closed.length }; }) }));
emit('data/search.json', JSON.stringify({ _generated: 'tools/beta/build.js — do not edit', v: 1, fields: { pages: ['key', 'name', 'href', 'country', 'deepLinks'], items: ['page', 'id', 'name', 'kind', 'tier', 'closed', 'area'] }, pages: searchPages, items: searchItems }));

// ---------------------------------------------------------------- pages
const ctx = { assetsV, betaBase: BETA_BASE, feaCss: `assets/fe-a.css?v=${feaV}` };
const LAZY_OK = /cleo:stamped/.test(fs.readFileSync(path.join(CLIENT, 'city.js'), 'utf8'));
// Platform W7 (R6 gap #5): 32 → 24 live = one phone Gallery page, so a deep link elsewhere doesn't carry 8 hidden cards
const CHUNK = { initial: 24, size: 40 };            // first 24 cards live; later ones in 40-card <noscript> chunks
shell.setSite(reg, assetsV);
const totals = Object.fromEntries(cityRows.map(r => [r.key, r.stats.total]));
for (const r of reg.rows.filter(r => r.gen === 'new')) {
  let html;
  if (r.kind === 'landing') {
    html = landing.render(reg, ctx);
    const expect = reg.countries.filter(c => c.live).flatMap(c => c.pages.all.map(x => x.key));
    errors.push(...assertHubPage(r.beta, html, [...new Set(expect)], totals));
  }
  else if (r.kind === 'city') {
    const live = fs.readFileSync(path.join(ROOT, r.live), 'utf8');
    const m = /setView\(\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]\s*,\s*(\d+)\s*\)/.exec(live);
    const pts = r.recs.filter(x => x.la != null);
    const med = a => a.slice().sort((x, y) => x - y)[a.length >> 1];
    const center = m ? [+m[1], +m[2], +m[3]] : pts.length ? [med(pts.map(p => p.la)), med(pts.map(p => p.ln)), 11] : [0, 0, 2];
    const og = fs.existsSync(path.join(BETA, 'assets', 'og', r.fileKey + '.png')) ? `${BETA_BASE}/assets/og/${r.fileKey}.png` : null;
    html = city.render(r, r.recs, Object.assign({ center, ogImage: og }, ctx));
    html = html.replace('</head>', `<link rel="alternate" type="application/atom+xml" title="${r.name.replace(/[&<>"]/g, '')} — what changed" href="${'../'.repeat(r.beta.split('/').length - 1)}${r.feed}">\n</head>`);
    // W4 gap #9: the masthead's "last checked" date opens this page's human-readable "What changed" page
    const chg = '../'.repeat(r.beta.split('/').length - 1) + changesPage.rel(r);
    html = html.replace(/last checked (<time class="nw">[^<]*<\/time>)/, (m, t) => `<a href="${chg}" data-cleo-changes>last checked ${t}</a>`);
    if (!html.includes('data-cleo-changes') && r.stats.lastChecked) errors.push(`${r.beta}: masthead "last checked" line not linked to its What changed page`);
    html = views.markCards(html, r.recs);          // W3 P-01: data-rank / data-k3 on every li.pl (throws on a miss)
    // Progressive rendering (M3-06): only when the page client adopts stamped cards (the `cleo:stamped` hook) —
    // otherwise a rewrite of city.js could silently strand deferred cards, so we ship every card live instead.
    if (LAZY_OK) { const c = chunk(html, CHUNK); html = c.html; r.chunk = { live: c.live, deferred: c.deferred, chunks: c.chunks }; }
    errors.push(...assertCityPage(r, html, r.recs).map(e => r.beta + ': ' + e));
  } else if (r.kind === 'country-hub' || r.kind === 'archive-hub') {
    const h = (r.kind === 'archive-hub' ? hub.renderArchive : hub.renderCountry)(r, reg, ctx);
    html = h.html;
    errors.push(...assertHubPage(r.beta, html, h.expect, totals));
  } else { errors.push(`${r.live}: no beta renderer for kind '${r.kind}' yet`); continue; }
  errors.push(...assertPage(r.beta, html));
  emit(r.beta, html);
}
const savedHtml = saved.render(ctx); errors.push(...assertPage('saved.html', savedHtml)); emit('saved.html', savedHtml);
const tripHtml = tripPage.render(ctx); errors.push(...assertPage('trip.html', tripHtml)); emit('trip.html', tripHtml);
const extraPages = method.pages(reg, ctx);                         // FE-B: { 'how-we-choose.html': html, '404.html': html }
for (const r of cityRows) extraPages[changesPage.rel(r)] = changesPage.page(r, ctx);   // W4 gap #9
for (const [rel, html] of Object.entries(extraPages)) { errors.push(...assertPage(rel, html)); emit(rel, html); }

emit('manifest.webmanifest', JSON.stringify({
  name: 'Cleo — sourced city guides', short_name: 'Cleo', start_url: './index.html', scope: './', display: 'standalone',
  background_color: '#F7F4EE', theme_color: '#F7F4EE', icons: [{ src: 'assets/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
}, null, 1));

// Manifest of ownership: what the new generator writes vs what is still the legacy mirror.
const generated = reg.rows.filter(r => r.gen === 'new').map(r => r.beta).concat(['saved.html', 'trip.html'], Object.keys(extraPages));
emit('data/manifest.json', JSON.stringify({
  v: 1, _doc: 'Written by tools/beta/build.js. `generated` pages are owned by the new beta generator; tools/beta-restyle.py must skip them. `pages` maps every live page to its beta source.',
  generated,
  pages: reg.rows.map(r => ({ live: r.live, beta: r.beta, key: r.key, kind: r.kind, gen: r.gen, country: r.country,
    counts: r.counts ? { P: r.counts.P, F: r.counts.F } : null })),
  totals: { pages: cityRows.length, places: totalLive },
}, null, 1));

// ---------------------------------------------------------------- W9-8 offline city packs (platform)
// data/packs/<page>.json lists EVERY file "Keep <city> offline" stores, with its exact byte size, as the URL the page
// actually requests (?v= hashes included): the page; its dataset, links slice and Gallery rows; the shared CSS, all JS
// (lazy views too), fonts and icon; Leaflet (so Atlas runs and falls back to the schematic offline, never caching tiles);
// its map art; and every photo it shows at the SMALLEST width (500w). The client shows the size before the tap; the
// service worker stores the files in a cache that a deploy never wipes (PERF-13). Tiles are never listed.
const sizeOf = rel => { const b = out.get(rel); if (b != null) return (Buffer.isBuffer(b) ? b : Buffer.from(b)).length;
  const p = path.join(BETA, rel); return fs.existsSync(p) ? fs.statSync(p).size : -1; };
const smallest = rel => { const m = /^(.*)-960\.(jpe?g|png)$/.exec(rel); return m && sizeOf(m[1] + '-500.' + m[2]) >= 0 ? m[1] + '-500.' + m[2] : rel; };
for (const r of cityRows) {
  const html = out.get(r.beta); if (html == null) continue;
  const H = String(html), dir = path.posix.dirname(r.beta), refs = new Set([r.beta]);
  const add = u => { if (!u || /^(https?:|data:|#|mailto:|javascript:)/.test(u)) return; u = u.replace(/&amp;/g, '&').split('#')[0];
    const [p0, q] = u.split('?'); const rel = path.posix.normalize(path.posix.join(dir, p0));
    if (rel.startsWith('..') || !/^(assets|data)\//.test(rel) || /^assets\/og\//.test(rel)) return;
    refs.add(smallest(rel) + (q && smallest(rel) === rel ? '?' + q : '')); };
  for (const m of H.matchAll(/\b(?:src|href|data-art)="([^"]+)"/g)) add(m[1]);
  for (const m of H.matchAll(/\bsrcset="([^"]+)"/g)) for (const c of m[1].split(',')) add(c.trim().split(/\s+/)[0]);
  const f = r.fileKey;
  for (const d of [`data/places/${f}.json`, `data/links/${f}.json`, `data/gallery/${f}.json`]) if (sizeOf(d) >= 0) refs.add(d);
  try { const g = JSON.stringify(JSON.parse(String(out.get(`data/gallery/${f}.json`) || '{}')));
    for (const m of g.matchAll(/"(assets\/img\/[^"]+\.(?:jpe?g|png))"/g)) refs.add(smallest(m[1])); } catch (e) { /* no rows */ }
  for (const k of Object.keys(assetsV).filter(k => k !== 'css' && k !== 'tokens')) refs.add(`assets/js/${k}.js?v=${assetsV[k]}`);
  for (const x of ['assets/vendor/leaflet/leaflet.js', 'assets/vendor/leaflet/leaflet.css', 'assets/icon.svg', 'manifest.webmanifest']) refs.add(x);
  if (fs.existsSync(path.join(BETA, 'assets', 'fonts'))) for (const x of fs.readdirSync(path.join(BETA, 'assets', 'fonts')).filter(x => x.endsWith('.woff2')).sort()) refs.add('assets/fonts/' + x);
  const files = [...refs].map(u => [u, sizeOf(u.split('?')[0])]).filter(([u, n]) => n >= 0).sort((a, b) => a[0] < b[0] ? -1 : 1);
  const missing = [...refs].filter(u => sizeOf(u.split('?')[0]) < 0);
  if (missing.length) errors.push(`offline pack ${f}: ${missing.length} referenced file(s) missing: ${missing.slice(0, 3).join(', ')}`);
  emit(`data/packs/${f}.json`, JSON.stringify({ _generated: 'tools/beta/build.js — do not edit (W9-8 offline city pack)', v: 1,
    key: r.key, page: r.beta, name: r.name, bytes: files.reduce((t, x) => t + x[1], 0), files }));
}

// Self-hosted fonts (designer, beta/assets/fonts) are precached so offline type matches online type.
const FONTS = path.join(BETA, 'assets', 'fonts');
const fontFiles = fs.existsSync(FONTS) ? fs.readdirSync(FONTS).filter(f => f.endsWith('.woff2')).sort().map(f => './assets/fonts/' + f) : [];
const shellFiles = ['./index.html', './saved.html', './trip.html', './manifest.webmanifest', './assets/icon.svg', `./assets/cleo.css?v=${assetsV.css}`, `./${ctx.feaCss}`, `./assets/fe-b.css?v=${require('./lib/render/shell').febV()}`]
  .concat(fontFiles)
  .concat(assetsV.tokens ? [`./assets/tokens.css?v=${assetsV.tokens}`] : [])
  .concat(['./how-we-choose.html'])                                 // FE-B method page, offline too
  .concat(Object.keys(assetsV).filter(k => k !== 'css' && k !== 'tokens').sort().map(k => `./assets/js/${k}.js?v=${assetsV[k]}`))
  .concat(i18n.files().map(([rel]) => './' + rel));                 // i18n D-41: catalogues, so a chosen locale works offline
const version = sha(JSON.stringify(assetsV) + i18n.files().map(([, b]) => sha(b)).join() /* i18n D-41 */ + feaV + generated.join() + fontFiles.join() + cityRows.map(r => r.art && r.art.map ? r.art.map.v : '').join());
emit('sw.js', swSource(version, shellFiles));

// ---------------------------------------------------------------- gate, then write (or check)
if (errors.length) {
  console.error('>>> FAIL — beta build refused to write:\n  ' + errors.join('\n  '));
  process.exit(1);
}
let stale = 0, wrote = 0;
for (const [rel, body] of out) {
  const p = path.join(BETA, rel), buf = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const same = fs.existsSync(p) && fs.readFileSync(p).equals(buf);
  if (args.has('--check')) { if (!same) { stale++; console.error('  STALE ' + rel); } continue; }
  if (!same) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, buf); wrote++; }
}
const summary = `${generated.length} pages, ${cityRows.length} place pages indexed, ${totalLive} places (beta == live)`;
if (args.has('--check')) {
  if (stale) { console.error(`>>> FAIL — ${stale} beta file(s) differ from a fresh build; run \`npm run beta\`.`); process.exit(1); }
  console.log(`>>> PASS — beta/ is reproducible from data: ${summary}.`);
} else console.log(`>>> PASS — wrote ${wrote} file(s) (${out.size} checked): ${summary}.`);
