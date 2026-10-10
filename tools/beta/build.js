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
const { normalise, nativeOf } = require('./lib/model');
const stats = require('./lib/stats');
const { pageSources, siteSources } = require('./lib/sources');
const art = require('./lib/art');
const { assertCityPage, assertHubPage, assertPage } = require('./lib/guards');
const { swSource } = require('./lib/sw');
const { BETA_BASE } = require('./lib/render/common');
const city = require('./lib/render/city');
const landing = require('./lib/render/landing');
const saved = require('./lib/render/saved');
const shell = require('./lib/render/shell');                       // FE-B: site context for header/footer
const hub = require('./lib/render/hub');                           // FE-B: country hubs + SEA archive
const method = require('./lib/render/method');                     // FE-B: how-we-choose.html, 404.html

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
  r.stats = stats.pageStats(r, r.recs);           // every number the page prints — M1-20
  const m = r.data.meta;
  r.name = m.h1Main || r.key;
  r.nat = nativeOf(m.eyebrow) || nativeOf(m.h1) || null;
  r.searchPlaceholder = stats.searchPlaceholder(r.name);
  // Live prose carries hand-typed counts that drift (Cleveland: "143 sights and 40" vs 148 + 46). Rewrite
  // the engine's count phrase from the computed numbers before any renderer sees it.
  for (const f of ['standfirst', 'description']) if (m[f]) m[f] = stats.fixProseCounts(m[f], r.stats);
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
for (const f of fs.readdirSync(CLIENT).filter(f => f.endsWith('.js')).sort()) {
  const body = Buffer.concat([Buffer.from(`/* generated copy of tools/beta/client/${f} — do not edit here */\n`), fs.readFileSync(path.join(CLIENT, f))]);
  emit('assets/js/' + f, body); assetsV[f.replace(/\.js$/, '')] = sha(body);
}
const cssPath = path.join(BETA, 'assets', 'cleo.css');            // owned by the designer lane; we only version it
if (!fs.existsSync(cssPath)) errors.push('beta/assets/cleo.css missing (designer-owned stylesheet)');
else assetsV.css = sha(fs.readFileSync(cssPath));
const tokPath = path.join(BETA, 'assets', 'tokens.css');          // optional design tokens (designer, M0-01)
if (fs.existsSync(tokPath)) assetsV.tokens = sha(fs.readFileSync(tokPath));
const conPath = path.join(BETA, 'assets', 'constellation.css');  // Constellation components (designer, UX-20)
if (fs.existsSync(conPath)) assetsV.constellation = sha(fs.readFileSync(conPath));
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
  if (cm) { emit(dir + 'map.svg', cm.svg); r.art.map = { src: `${dir}map.svg?v=${sha(cm.svg)}`, w: cm.proj.w, h: cm.proj.h, proj: cm.proj, drawn: cm.drawn, beyond: cm.beyond }; }
  for (const a of page.AREAS || []) {
    const aa = art.areaArt(a.n, colors[a.id], r.recs.filter(x => x.a === a.id));
    if (!aa) continue;
    const f = `${dir}${a.id.replace(/[^A-Za-z0-9_-]/g, '_')}.svg`;
    emit(f, aa.svg); r.art.areas[a.id] = { src: `${f}?v=${sha(aa.svg)}`, w: aa.proj.w, h: aa.proj.h, proj: aa.proj, drawn: aa.drawn };
  }
  if (r.stats.verifiedPins && !r.art.map) errors.push(`${r.live}: ${r.stats.verifiedPins} verified pins but no map art`);
}

// ---------------------------------------------------------------- data indexes
const pageHref = r => r.beta;                     // beta-root-relative
const searchPages = [], searchItems = [];
for (const r of cityRows) {
  const page = r.data, areaN = Object.fromEntries((page.AREAS || []).map(a => [a.id, city.shortArea(a.n)]));
  const pi = searchPages.length;
  searchPages.push([r.key, page.meta.h1Main || r.key, pageHref(r), r.country || '', r.gen === 'new' ? 1 : 0]);
  for (const x of r.recs) searchItems.push([pi, x.id, x.n, x.kind === 'food' ? 'f' : 's', x.t, x.closed ? 1 : 0, areaN[x.a] || '']);
  // Per-page open dataset: every record, its sources registry, areas/collections/cuisines, provenance.
  emit(`data/places/${r.fileKey}.json`, JSON.stringify({
    _generated: 'tools/beta/build.js from ' + r.live + ' — do not edit', v: 1, key: r.key, live: r.live, beta: r.beta, country: r.country, name: page.meta.h1Main,
    nat: r.nat, counts: { sights: r.counts.P, food: r.counts.F, total: r.counts.P + r.counts.F }, stats: r.stats,
    areas: page.AREAS || [], colors: r.colors, collections: page.CATS || [], cuisines: page.CUISINES || [],
    sources: { sights: page.S || {}, food: page.FS || {} },
    // Attribution as navigation (M1-10): one row per publisher, with the ids of every place it recommends.
    sourceIndex: r.sources.list, art: r.art, notes: page.notes,
    places: r.recs,
  }));
}
const totalLive = cityRows.reduce((s, r) => s + r.counts.P + r.counts.F, 0);
if (searchItems.length !== totalLive) errors.push(`search index ${searchItems.length} != live total ${totalLive}`);
emit('data/sources.json', JSON.stringify({ _generated: 'tools/beta/build.js — do not edit', v: 1,
  _doc: 'Every publisher cited on any beta place page: id, display name, text authority mark, total records citing it, and [pageKey, n] per page. Per-page detail (entries, place ids) is in data/places/<page>.json sourceIndex.',
  sources: siteSources(cityRows) }));
emit('data/search.json', JSON.stringify({ _generated: 'tools/beta/build.js — do not edit', v: 1, fields: { pages: ['key', 'name', 'href', 'country', 'deepLinks'], items: ['page', 'id', 'name', 'kind', 'tier', 'closed', 'area'] }, pages: searchPages, items: searchItems }));

// ---------------------------------------------------------------- pages
const ctx = { assetsV, betaBase: BETA_BASE };
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
const extraPages = method.pages(reg, ctx);                         // FE-B: { 'how-we-choose.html': html, '404.html': html }
for (const [rel, html] of Object.entries(extraPages)) { errors.push(...assertPage(rel, html)); emit(rel, html); }

emit('manifest.webmanifest', JSON.stringify({
  name: 'Cleo — sourced city guides', short_name: 'Cleo', start_url: './index.html', scope: './', display: 'standalone',
  background_color: '#F7F4EE', theme_color: '#F7F4EE', icons: [{ src: 'assets/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
}, null, 1));

// Manifest of ownership: what the new generator writes vs what is still the legacy mirror.
const generated = reg.rows.filter(r => r.gen === 'new').map(r => r.beta).concat(['saved.html'], Object.keys(extraPages));
emit('data/manifest.json', JSON.stringify({
  v: 1, _doc: 'Written by tools/beta/build.js. `generated` pages are owned by the new beta generator; tools/beta-restyle.py must skip them. `pages` maps every live page to its beta source.',
  generated,
  pages: reg.rows.map(r => ({ live: r.live, beta: r.beta, key: r.key, kind: r.kind, gen: r.gen, country: r.country,
    counts: r.counts ? { P: r.counts.P, F: r.counts.F } : null })),
  totals: { pages: cityRows.length, places: totalLive },
}, null, 1));

const shellFiles = ['./index.html', './saved.html', './manifest.webmanifest', './assets/icon.svg', `./assets/cleo.css?v=${assetsV.css}`]
  .concat(assetsV.tokens ? [`./assets/tokens.css?v=${assetsV.tokens}`] : [])
  .concat(assetsV.constellation ? ['./how-we-choose.html', `./assets/constellation.css?v=${assetsV.constellation}`] : [])
  .concat(Object.keys(assetsV).filter(k => k !== 'css' && k !== 'tokens' && k !== 'constellation').sort().map(k => `./assets/js/${k}.js?v=${assetsV[k]}`));
const version = sha(JSON.stringify(assetsV) + generated.join());
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
