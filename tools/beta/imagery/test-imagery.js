#!/usr/bin/env node
'use strict';
/**
 * test-imagery.js — imagery lane gate (part of `npm test`).
 *
 *  1. The REAL photo store: every file in beta/assets/img/photos/ has a complete, free-licence CREDITS.json row on an
 *     open, non-Vietnam record that is on its page — any uncredited photo FAILS.
 *  2. The credit gate itself, against fixtures in a temp dir: complete → figure with visible TASL caption; missing
 *     credit / missing field / NC licence / closed place / Vietnam / unknown record → refused.
 *  3. Motifs: one per page, country and collection subject; well-formed SVG; small; distinct; self-contained (no
 *     external refs, no raster, no script); every generated hub tile and city masthead carries its motif.
 *  4. The manifest lists only Wikipedia-citing records, never marks a closed/Vietnam/food record eligible.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { JSDOM } = require('jsdom');
const { buildRegistry, ROOT } = require('../lib/registry');
const { normalise } = require('../lib/model');
const photos = require('./photos');
const { buildMotifs } = require('./motifs');
const { buildManifest, parseSource } = require('./manifest');
const imagery = require('./index');

const BETA = path.join(ROOT, 'beta');
let fails = 0;
const ok = (cond, msg) => { if (cond) console.log('  ok  ' + msg); else { fails++; console.error('  FAIL ' + msg); } };

const reg = buildRegistry();
const rows = reg.rows.filter(r => r.kind === 'city');
for (const r of rows) { r._geo = reg.geo; r.recs = normalise(r); r.name = r.data.meta.h1Main || r.key; }
const pages = Object.fromEntries(rows.map(r => [r.key, { country: r.country, recs: r.recs }]));

// ---------------------------------------------------------------- 1. the real store
console.log('imagery: photo store');
const real = photos.loadPhotos(BETA, pages);
ok(real.errors.length === 0, `every photo in beta/${photos.PHOTO_DIR}/ has a complete credit (${real.errors.length} problem(s))${real.errors.length ? '\n       ' + real.errors.join('\n       ') : ''}`);
ok(fs.existsSync(path.join(BETA, photos.CREDITS)), 'CREDITS.json exists (schema + credits array)');

// ---------------------------------------------------------------- 2. the gate, on fixtures
console.log('imagery: credit gate (fixtures)');
const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452000003c0000002800806000000', 'hex');   // header only: 960×640
const tokyo = rows.find(r => r.key === 'tokyo'), open = tokyo.recs.find(x => !x.closed && x.kind === 'sight');
const closed = rows.flatMap(r => r.recs.filter(x => x.closed).map(x => [r.key, x])).find(([k]) => pages[k].country !== 'vietnam');
const vn = rows.find(r => r.country === 'vietnam');
const good = { file: 'a.png', record: { page: 'tokyo', id: open.id }, depicts: 'Main hall', author: 'A. Photographer', sourceUrl: 'https://commons.wikimedia.org/wiki/File:A.png', licence: 'CC BY-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' };
function fixture(credits, files) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'cleo-img-'));
  fs.mkdirSync(path.join(d, photos.PHOTO_DIR), { recursive: true });
  for (const f of files) fs.writeFileSync(path.join(d, photos.PHOTO_DIR, f), PNG);
  fs.writeFileSync(path.join(d, photos.CREDITS), JSON.stringify({ credits }));
  const res = photos.loadPhotos(d, pages);
  fs.rmSync(d, { recursive: true, force: true });
  return res;
}
let r = fixture([good], ['a.png']);
const ph = r.byPage.tokyo && r.byPage.tokyo[open.id];
ok(r.errors.length === 0 && ph && ph.w === 960 && ph.h === 640, 'complete credit + file → photo with size read from the header');
const fig = ph ? photos.figureHtml(ph, '../') : '';
ok(/<figure class="photo"><img src="\.\.\/assets\/img\/photos\/a\.png" width="960" height="640" alt="Main hall"/.test(fig), 'figure: local src, explicit width/height, alt = depicts');
ok(/<figcaption>“Main hall” by A\. Photographer, <a [^>]*href="https:\/\/creativecommons\.org[^"]*"[^>]*>CC BY-SA 4\.0<\/a>, via <a [^>]*>Wikimedia Commons<\/a><\/figcaption>/.test(fig), 'figcaption shows title, author, licence link and source (TASL)');
const row = { imagery: { photos: r.byPage.tokyo } };
ok(imagery.photoFor(row, open) === ph && imagery.photoFor(row, Object.assign({}, open, { closed: true })) === null, 'photoFor: the gated photo, never for a closed record');
r = fixture([], ['a.png']);
ok(r.errors.some(e => /no credit row/.test(e)) && !Object.keys(r.byPage).length, 'uncredited photo file → refused');
r = fixture([good], []);
ok(r.errors.some(e => /no such file/.test(e)), 'credit without its file → refused');
for (const k of ['author', 'licence', 'licenceUrl', 'sourceUrl', 'depicts', 'record']) {
  const c = Object.assign({}, good); delete c[k];
  ok(fixture([c], ['a.png']).errors.some(e => e.includes('missing ' + k)), `credit missing ${k} → refused`);
}
ok(fixture([Object.assign({}, good, { licence: 'CC BY-NC-SA 4.0' })], ['a.png']).errors.some(e => /not CC0/.test(e)), 'non-commercial licence → refused');
ok(fixture([Object.assign({}, good, { sourceUrl: 'http://example.org/x' })], ['a.png']).errors.some(e => /https/.test(e)), 'non-https source → refused');
ok(fixture([Object.assign({}, good, { record: { page: 'tokyo', id: 'no-such-place' } })], ['a.png']).errors.some(e => /not on that beta page/.test(e)), 'credit for a record not on its page → refused');
if (closed) ok(fixture([Object.assign({}, good, { record: { page: closed[0], id: closed[1].id } })], ['a.png']).errors.some(e => /closed/.test(e)), 'closed place → refused (never "go here today")');
if (vn) ok(fixture([Object.assign({}, good, { record: { page: vn.key, id: vn.recs[0].id } })], ['a.png']).errors.some(e => /freedom of panorama/.test(e)), 'Vietnam record → refused (no freedom of panorama)');
for (const lic of ['CC0 1.0', 'Public domain', 'CC BY 2.0', 'CC BY-SA 3.0 DE']) ok(photos.creditProblems(Object.assign({}, good, { licence: lic })).length === 0, `licence accepted: ${lic}`);

// ---------------------------------------------------------------- 3. motifs
console.log('imagery: motifs');
const tok = fs.readFileSync(path.join(BETA, 'assets', 'tokens.css'), 'utf8');
const { files, index } = buildMotifs({ cityRows: rows, countries: reg.countries, tokensCss: tok });
ok(rows.every(r => index.pages[r.key]), `a motif for every place page (${rows.length})`);
ok(reg.countries.every(c => index.countries[c.key]), `a motif for every country (${reg.countries.length})`);
ok(['food', 'landmarks', 'popculture', 'outdoors', 'art'].every(k => index.collections[k]), 'collection covers: food, landmarks, pop culture, outdoors, art (+ more)');
const parser = new (new JSDOM('')).window.DOMParser();
const bad = [], big = [], ext = [];
for (const [rel, body] of Object.entries(files)) {
  const doc = parser.parseFromString(body, 'image/svg+xml');
  if (doc.getElementsByTagName('parsererror').length || doc.documentElement.nodeName !== 'svg') bad.push(rel);
  if (body.length > 8 * 1024) big.push(`${rel} ${body.length} B`);
  if (/<image|<script|href=|url\((?!#)|@import|\bon[a-z]+=/i.test(body)) ext.push(rel);
}
ok(!bad.length, `every motif is well-formed SVG (${Object.keys(files).length} files)${bad.length ? ': ' + bad.join(', ') : ''}`);
ok(!big.length, `every motif ≤ 8 KB${big.length ? ': ' + big.join(', ') : ''}`);
ok(!ext.length, `motifs are self-contained: no raster, external ref or script${ext.length ? ': ' + ext.join(', ') : ''}`);
const lines = Object.entries(files).filter(([k]) => /motifs\/[^/]+\.svg$/.test(k) && !k.endsWith('.ink.svg')).map(([k, b]) => [k, (/<path class="l" d="([^"]*)"/.exec(b) || [])[1]]);
const dup = lines.filter(([k, d], i) => lines.findIndex(([, e]) => e === d) !== i).map(([k]) => k);
ok(!dup.length, `no two motifs share the same line art${dup.length ? ': ' + dup.join(', ') : ''}`);
ok(Object.values(files).every(b => /<desc>Original illustration[^<]*not a depiction of any particular venue/.test(b)), 'every motif states it is original, generic art (not a venue)');
for (const [rel, body] of Object.entries(files)) {
  const p = path.join(BETA, rel);
  if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== body) { ok(false, `beta/${rel} is stale — run npm run beta`); break; }
}
// generated pages carry the art (FE-B layers an <img class="motif">; city mastheads use motifSvg's <image>)
const landing = fs.readFileSync(path.join(BETA, 'index.html'), 'utf8');
const tiles = landing.match(/<li class="dest"[^>]*><a [^>]*class="tile[\s\S]*?<\/li>/g) || [];
const refOf = t => (/(?:<img class="motif" src="|<image href=")([^'"?]+)/.exec(t) || [])[1];
ok(tiles.length > 0 && tiles.every(t => refOf(t) && fs.existsSync(path.join(BETA, refOf(t)))), `every landing city tile references an existing motif (${tiles.length})`);
const tk = fs.readFileSync(path.join(BETA, 'cities', 'tokyo.html'), 'utf8');
ok(/<header class="masthead"><svg class="motif"[^>]*><image href="\.\.\/assets\/img\/motifs\/tokyo\.svg\?v=/.test(tk), 'Tokyo masthead carries the Tokyo motif');
const hubJ = fs.readFileSync(path.join(BETA, 'Japan', 'index.html'), 'utf8');
ok(/assets\/img\/motifs\/japan\.svg/.test(hubJ) && fs.existsSync(path.join(BETA, 'assets/img/motifs/japan.svg')), 'Japan hub hero references the country motif');
const anyPhoto = [];
for (const r of rows) { const h = fs.readFileSync(path.join(BETA, r.beta), 'utf8'); for (const f of h.match(/<figure class="photo[^"]*">[\s\S]*?<\/figure>/g) || []) if (!/<figcaption>[^<]*by [\s\S]+<a [^>]*rel="license/.test(f)) anyPhoto.push(r.beta); }
ok(!anyPhoto.length, `every photo on a generated page shows its TASL credit${anyPhoto.length ? ': ' + anyPhoto.join(', ') : ''}`);

// ---------------------------------------------------------------- 4. manifest
console.log('imagery: manifest');
const m = buildManifest(rows, reg.geo);
ok(m.items.length > 1000 && m.items.every(i => /wikipedia/i.test(reg.geo[rows.find(r => r.key === i.page).geoKey][i.name].source)), `manifest: ${m.items.length} records, every one cites Wikipedia in its geocode source`);
ok(m.items.every(i => !(i.eligible && (i.status === 'closed' || i.country === 'vietnam' || i.kind === 'food'))), 'manifest never marks a closed, Vietnam or food record eligible');
ok(parseSource('https://en.wikipedia.org/wiki/Next_(restaurant) (Wikipedia/GeoHack published coordinates)').title === 'Next (restaurant)', 'parser: URL title with parentheses');
ok(parseSource('ja.wikipedia 北海道立文学館 infobox (北緯43度2分39.3秒) via WebSearch').title === '北海道立文学館', 'parser: ja.wikipedia named title');
ok(parseSource('curated field-guide build (machine-geocoded); sample-audited vs Apple Maps/Wikipedia 2026-08-09') === null, 'parser: an audit mention is not a citation');
const onDisk = path.join(BETA, 'assets', 'img', 'manifest.json');
ok(fs.existsSync(onDisk) && JSON.parse(fs.readFileSync(onDisk, 'utf8')).items.length === m.items.length, 'beta/assets/img/manifest.json is current');

if (fails) { console.error(`>>> FAIL — imagery: ${fails} check(s) failed`); process.exit(1); }
console.log('>>> PASS — imagery: credit gate, motifs and manifest');
