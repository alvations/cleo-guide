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
 *  5. W7 Commons: size variants under one credit (srcset), Commons File: source pinned, hero slots (eager, scrim,
 *     credit line in the flow), commons-candidates.json well-formed, and fetch-commons.js's licence / depicts / plan
 *     checks — all offline.
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
ok(/<figcaption>Photo: A\. Photographer · <a [^>]*href="https:\/\/creativecommons\.org[^"]*"[^>]*>CC BY-SA 4\.0<\/a> · <a [^>]*title="“Main hall”"[^>]*>Wikimedia Commons<\/a><\/figcaption>/.test(fig), 'figcaption shows title (source link title), author, licence link and source (TASL)');
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
// Unsplash (fetch-unsplash.js rows): licence + URL pinned, "Photo by … on Unsplash" caption, slot rows for heroes/covers
const uns = Object.assign({}, good, { licence: 'Unsplash License', licenceUrl: 'https://unsplash.com/license', sourceUrl: 'https://unsplash.com/photos/abcDEF12345?utm_source=cleo_guide&utm_medium=referral', author: 'A. Photographer', authorUrl: 'https://unsplash.com/@aphoto?utm_source=cleo_guide&utm_medium=referral', provider: 'unsplash' });
ok(photos.creditProblems(uns).length === 0, 'licence accepted: Unsplash License (with its licence URL and an unsplash.com photo page)');
ok(photos.creditProblems(Object.assign({}, uns, { licenceUrl: 'https://example.org/license' })).some(p => /unsplash\.com\/license/.test(p)), 'Unsplash License with another licence URL → refused');
ok(photos.creditProblems(Object.assign({}, uns, { sourceUrl: 'https://images.unsplash.com/photo-1?w=960' })).some(p => /unsplash\.com\/photos/.test(p)), 'Unsplash License whose source is not a photo page (e.g. a hotlink) → refused');
ok(photos.creditProblems(Object.assign({}, uns, { licence: 'Unsplash+ License' })).length > 0, 'Unsplash+ (paid licence) → refused');
r = fixture([uns], ['a.png']);
const uph = r.byPage.tokyo && r.byPage.tokyo[open.id];
ok(r.errors.length === 0 && uph && /<figcaption>Photo by <a href="https:\/\/unsplash\.com\/@aphoto[^"]*"[^>]*>A\. Photographer<\/a> on <a href="https:\/\/unsplash\.com\/photos\/abcDEF12345[^"]*"[^>]*>Unsplash<\/a> · <a [^>]*rel="license[^"]*"[^>]*>Unsplash License<\/a><\/figcaption>/.test(photos.figureHtml(uph)), 'Unsplash photo → "Photo by <name> on Unsplash" caption with licence link');
const slotRow = Object.assign({}, uns, { record: undefined, slot: { type: 'hero', key: 'tokyo' } }); delete slotRow.record;
r = fixture([slotRow], ['a.png']);
ok(r.errors.length === 0 && r.bySlot['hero:tokyo'] && !Object.keys(r.byPage).length, 'slot row (hub hero) → bySlot, never attached to a card');
ok(fixture([Object.assign({}, slotRow, { slot: { type: 'hero', key: 'vietnam' } })], ['a.png']).errors.some(e => /freedom of panorama/.test(e)), 'Vietnam hub hero slot → refused');
ok(fixture([Object.assign({}, slotRow, { slot: { type: 'banner', key: 'x' } })], ['a.png']).errors.some(e => /slot must be/.test(e)), 'unknown slot type → refused');
ok(fixture([Object.assign({}, slotRow, { record: { page: 'tokyo', id: open.id } })], ['a.png']).errors.some(e => /not both/.test(e)), 'record and slot together → refused');

// Wikimedia Commons (W7, fetch-commons.js rows): srcset variants under one credit, Commons source pinned, heroes
const cmn = Object.assign({}, good, { file: 'a-960.png', provider: 'wikimedia-commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Senso-ji,_Asakusa,_Tokyo.jpg', variants: [{ file: 'a-480.png', width: 480, height: 320 }] });
r = fixture([cmn], ['a-960.png', 'a-480.png']);
const cph = r.byPage.tokyo && r.byPage.tokyo[open.id];
ok(r.errors.length === 0 && cph && cph.widths.length === 2 && cph.srcset === 'assets/img/photos/a-480.png 480w, assets/img/photos/a-960.png 960w', 'Commons row with a size variant → one photo, srcset of 2 (the variant is covered by the row\'s credit)');
const cfig = cph ? photos.figureHtml(cph, '../') : '';
ok(/ srcset="\.\.\/assets\/img\/photos\/a-480\.png 480w, \.\.\/assets\/img\/photos\/a-960\.png 960w" sizes="[^"]+"/.test(cfig) && /loading="lazy"/.test(cfig), 'card figure: sized srcset (480w, 960w) + sizes, lazy');
ok(fixture([cmn], ['a-960.png']).errors.some(e => /variant a-480\.png — no such file/.test(e)), 'variant file missing → refused');
ok(fixture([cmn, Object.assign({}, good, { file: 'b.png', variants: [{ file: 'a-480.png' }] })], ['a-960.png', 'a-480.png', 'b.png']).errors.some(e => /already credited/.test(e)), 'one variant claimed by two credit rows → refused');
ok(fixture([Object.assign({}, cmn, { variants: [{ file: '../x.png' }] })], ['a-960.png']).errors.some(e => /bare/.test(e)), 'variant path outside photos/ → refused');
ok(photos.creditProblems(Object.assign({}, cmn, { sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/X.jpg' })).some(p => /File: page/.test(p)), 'Commons row whose source is a hotlink, not the File: page → refused');
const hero = Object.assign({}, cmn, { slot: { type: 'hero', key: 'tokyo' }, depicts: 'Tokyo skyline' }); delete hero.record;
r = fixture([hero], ['a-960.png', 'a-480.png']);
const hph = r.bySlot['hero:tokyo'];
ok(r.errors.length === 0 && hph && hph.widths.length === 2, 'Commons hero slot with a variant → bySlot hero:tokyo');
const hfig = hph ? photos.heroHtml(hph, '../') : '', hcred = hph ? photos.heroCreditHtml(hph) : '';
ok(/<figure class="photo hero-photo"/.test(hfig) && /fetchpriority="high"/.test(hfig) && !/loading="lazy"/.test(hfig) && /alt="Tokyo skyline"/.test(hfig) && /sizes="100vw"/.test(hfig) && /class="hero-scrim" aria-hidden="true"/.test(hfig), 'hero figure: eager (fetchpriority high, not lazy), srcset at 100vw, alt, scrim for text contrast');
ok(/^<p class="hero-credit"[^>]*>Photo: A\. Photographer · <a [^>]*rel="license[^"]*"[^>]*>CC BY-SA 4\.0<\/a> · <a [^>]*href="https:\/\/commons[^"]*" title="“[^”]+”"[^>]*>Wikimedia Commons<\/a>/.test(hcred), 'hero credit: a visible short TASL line in the text flow (author, licence link, source link titled with the file title)');
{ // card credit: short TASL line; the full sentence only on request (place detail)
  const rc = Object.assign({}, cmn, { title: 'Senso-ji, Asakusa', modified: 'resized to 500 and 960 px wide' });
  const short = photos.captionHtml(rc), full = photos.captionHtml(rc, { full: true });
  ok(short === 'Photo: A. Photographer · <a href="' + rc.licenceUrl.replace(/&/g, '&amp;') + '" rel="license noopener" target="_blank">CC BY-SA 4.0</a> · <a href="https://commons.wikimedia.org/wiki/File:Senso-ji,_Asakusa,_Tokyo.jpg" title="“Senso-ji, Asakusa”" aria-label="“Senso-ji, Asakusa” on Wikimedia Commons" rel="noopener" target="_blank">Wikimedia Commons</a> (resized)', 'card credit: "Photo: author · licence · source (resized)" — title on the source link, licence + source linked');
  ok(/^“Senso-ji, Asakusa” by A\. Photographer, <a [^>]*rel="license[^"]*"[^>]*>CC BY-SA 4\.0<\/a>, via <a [^>]*>Wikimedia Commons<\/a> — resized to 500 and 960 px wide$/.test(full), 'captionHtml(c, {full:true}): the whole TASL sentence for a place detail');
  ok(/ sizes="\(min-resolution: 2\.5dppx\) and \(max-width: 1023px\) 166px, \(max-width: 639px\) 92vw, \(max-width: 1023px\) 45vw, 25vw"/.test(photos.figureHtml(cph, '../')) && / sizes="120px"/.test(photos.figureHtml(cph, '../', 'photo', { sizes: '120px' })), 'card sizes default: a ≥ 2.5 dppx phone takes 500 w (166px), else 92vw phones, 45vw tablets, 25vw desktop; callers can pass a smaller sizes (thumbnails)');
}
ok(imagery.heroFor({ imagery: { hero: hph } }) === hph && imagery.heroFor({ imagery: { slots: r.bySlot } }, 'tokyo') === hph && imagery.heroFor({ imagery: { slots: r.bySlot } }, 'kyoto') === null && imagery.heroFor({ imagery: {} }) === null && imagery.heroFor(null) === null, 'heroFor(row) / heroFor(reg, key): the credited hero, else null (renderer keeps the motif)');
ok(/^<figure class="photo hero-media"><img [^>]*srcset=[^>]*fetchpriority="high"[^>]*><figcaption>Photo: /.test(hph ? photos.heroHtml(hph, '../', 'photo hero-media') : ''), 'heroHtml with a media-slot class: in-flow, eager, with its TASL figcaption (FE-B hub hero)');
ok(fixture([Object.assign({}, hero, { slot: { type: 'hero', key: 'vietnam/hanoi' } })], ['a-960.png', 'a-480.png']).errors.some(e => /freedom of panorama/.test(e)), 'Vietnam city hero slot → refused');

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
// W7: a credited photo may stand in for the motif — a slot passes with its motif OR a credited photo, never neither
const refOf = t => (/(?:<img class="motif" src="|<image href=")([^'"?]+)/.exec(t) || [])[1];
const hasMotif = t => !!refOf(t) && fs.existsSync(path.join(BETA, refOf(t)));
/** a credited photo in this fragment: a photo element AND a visible TASL credit (figcaption, .credit or .hero-credit). */
const hasCreditedPhoto = t => /<(?:img class="ph"|figure class="photo)/.test(t) &&
  /<(?:figcaption|small class="credit"|p class="hero-credit")[^>]*>[\s\S]*?(?:by |Photo: )[\s\S]*?<a [^>]*rel="license/.test(t);
const artOrPhoto = t => hasMotif(t) || hasCreditedPhoto(t);
const heroOf = h => (/<section class="chero[\s\S]*?<\/section>/.exec(h) || [''])[0];
ok(tiles.length > 0 && tiles.every(artOrPhoto), `every landing city tile carries an existing motif or a credited photo (${tiles.length})`);
const tk = fs.readFileSync(path.join(BETA, 'cities', 'tokyo.html'), 'utf8');
const tkMast = (/<header class="masthead">[\s\S]*?<\/header>/.exec(tk) || [''])[0];
ok(/<header class="masthead"><svg class="motif"[^>]*><image href="\.\.\/assets\/img\/motifs\/tokyo\.svg\?v=/.test(tk) || hasCreditedPhoto(tkMast), 'Tokyo masthead carries the Tokyo motif or a credited hero photo');
const hubJ = fs.readFileSync(path.join(BETA, 'Japan', 'index.html'), 'utf8');
ok((/assets\/img\/motifs\/japan\.svg/.test(hubJ) && fs.existsSync(path.join(BETA, 'assets/img/motifs/japan.svg'))) || hasCreditedPhoto(heroOf(hubJ)), 'Japan hub hero references the country motif or carries a credited hero photo');
// the same rule on fixtures, so the photo-present case is covered offline (photos exist only on the runner)
if (hph) {
  const fxHub = `<section class="chero" aria-labelledby="cn"><div class="inner"><h1>Japan</h1></div>${photos.heroHtml(hph, '../', 'photo hero-media')}</section>`;
  const fxBare = '<section class="chero" aria-labelledby="cn"><div class="inner"><h1>Japan</h1></div><div class="hero-media cover"></div></section>';
  const fxNoCredit = fxHub.replace(/<figcaption>[\s\S]*?<\/figcaption>/, '');
  const fxMast = `<header class="masthead"><div class="g-hero-x">${photos.heroHtml(hph, '../')}<p class="g-kick">x</p>${photos.heroCreditHtml(hph)}</div></header>`;
  const fxTile = `<li class="dest"><a class="tile card"><span class="card-media"><img class="ph" src="x.jpg" alt="x"></span></a><small class="credit">${photos.captionHtml(hph.credit)}</small></li>`;
  ok(artOrPhoto(heroOf(fxHub)) && !artOrPhoto(heroOf(fxBare)) && !artOrPhoto(heroOf(fxNoCredit)), 'fixture: a hub hero passes with a credited photo, fails with neither motif nor photo, fails with an uncredited photo');
  ok(hasCreditedPhoto(fxMast) && !hasCreditedPhoto(fxMast.replace(/<p class="hero-credit"[\s\S]*?<\/p>/, '')), 'fixture: a city masthead hero photo passes only with its credit line');
  ok(artOrPhoto(fxTile) && !artOrPhoto(fxTile.replace(/<small class="credit">[\s\S]*?<\/small>/, '')), 'fixture: a landing tile passes with a credited photo, never with an uncredited one');
}
const anyPhoto = [];
for (const r of rows) { const h = fs.readFileSync(path.join(BETA, r.beta), 'utf8'); for (const f of h.match(/<figure class="photo[^"]*">[\s\S]*?<\/figure>/g) || []) if (!/<figcaption>(?:[^<]*by |Photo: )[\s\S]+<a [^>]*rel="license/.test(f)) anyPhoto.push(r.beta);
  if (/class="photo hero-photo"/.test(h) && !/<p class="hero-credit"[^>]*>Photo: [\s\S]*?rel="license/.test(h)) anyPhoto.push(r.beta + ' (hero without its credit line)'); }
ok(!anyPhoto.length, `every photo on a generated page shows its TASL credit${anyPhoto.length ? ': ' + anyPhoto.join(', ') : ''}`);

// ---------------------------------------------------------------- 4. manifest
console.log('imagery: manifest');
const m = buildManifest(rows, reg.geo);
ok(m.items.length > 1000 && m.items.every(i => /wikipedia/i.test(reg.geo[rows.find(r => r.key === i.page).geoKey][i.name].source)), `manifest: ${m.items.length} records, every one cites Wikipedia in its geocode source`);
ok(m.items.every(i => !(i.eligible && (i.status === 'closed' || i.country === 'vietnam' || i.kind === 'food'))), 'manifest never marks a closed, Vietnam or food record eligible');
ok(parseSource('https://en.wikipedia.org/wiki/Next_(restaurant) (Wikipedia/GeoHack published coordinates)').title === 'Next (restaurant)', 'parser: URL title with parentheses');
ok(parseSource('ja.wikipedia 北海道立文学館 infobox (北緯43度2分39.3秒) via WebSearch').title === '北海道立文学館', 'parser: ja.wikipedia named title');
ok(parseSource('curated field-guide build (machine-geocoded); sample-audited vs Apple Maps/Wikipedia 2026-08-09') === null, 'parser: an audit mention is not a citation');
// Unsplash candidate manifest (research only): well-formed, honest confidence, no food/venue record, real record ids
const uc = JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'unsplash-candidates.json'), 'utf8'));
const ucBad = [];
for (const t of uc.targets) {
  if (!['hero', 'landmark', 'cover'].includes(t.type)) ucBad.push(`${t.key}: type`);
  if (t.type === 'landmark') {
    const [pg, id] = t.depicts.split('#'), row = rows.find(x => x.key === pg), rec = row && row.recs.find(x => x.id === id);
    if (!rec) ucBad.push(`${t.key}: no such record`); else if (rec.kind === 'food') ucBad.push(`${t.key}: food record`);
  }
  for (const c of t.candidates) {
    if (!/^https:\/\/unsplash\.com\/photos\/(?:[a-z0-9-]*-)?[A-Za-z0-9_-]{11}$/.test(c.pageUrl) || !c.pageUrl.endsWith(c.id)) ucBad.push(`${t.key}: url/id ${c.pageUrl}`);
    if (!['high', 'med', 'low'].includes(c.confidence) || !c.reason || !c.title) ucBad.push(`${t.key}: ${c.id} confidence/reason/title`);
  }
}
ok(uc.targets.length > 0 && !ucBad.length, `unsplash-candidates.json: ${uc.targets.length} targets, every landmark a real non-food record, every candidate a photo-page id with confidence + reason${ucBad.length ? ': ' + ucBad.slice(0, 5).join('; ') : ''}`);
const fu = require('./fetch-unsplash');
ok(fu.fileBase({ type: 'landmark', depicts: 'singapore/marina-bay#merlion-park' }) === 'singapore--marina-bay--merlion-park' && fu.fileBase({ type: 'hero', depicts: 'hub:tokyo' }) === 'hero--tokyo', 'fetch-unsplash: file names follow the photos/ convention');
const vnRec = vn && vn.recs.find(x => x.kind !== 'food' && !x.closed);
if (vnRec) ok(fu.recordCheck({ depicts: `${vn.key}#${vnRec.id}` }).why === 'Vietnam has no freedom of panorama', 'fetch-unsplash: never fetches for a Vietnamese record');
// Commons candidate manifest (W7, research only) + the fetch script's pure checks — no network here
const cm = JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'commons-candidates.json'), 'utf8'));
const cmBad = [];
for (const t of cm.targets) {
  if (!['hero', 'landmark'].includes(t.type) || !Array.isArray(t.names) || !t.names.length) cmBad.push(`${t.key}: type/names`);
  if (t.type === 'landmark') {
    const [pg, id] = t.depicts.split('#'), row = rows.find(x => x.key === pg), rec = row && row.recs.find(x => x.id === id);
    if (!rec) cmBad.push(`${t.key}: no such record`);
    else if (t.candidates.length && (rec.kind === 'food' || rec.closed || row.country === 'vietnam')) cmBad.push(`${t.key}: candidates on a food/closed/Vietnam record`);
  }
  if (t.type === 'hero' && /^vietnam/.test(t.depicts.replace('hub:', '')) && t.candidates.length) cmBad.push(`${t.key}: Vietnam hero candidates`);
  if (t.skip && t.candidates.some(c => !c.refused))   // refused records stay: a refused file is refused for every target
   cmBad.push(`${t.key}: candidates on a skipped target`);
  for (const c of t.candidates) {
    if (!/^File:.+\.(jpe?g|png|webp|tiff?)$/i.test(c.file) || !/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(c.pageUrl)) cmBad.push(`${t.key}: file/pageUrl ${c.file}`);
    if (!['high', 'med'].includes(c.confidence) || !c.reason || !c.depicts || (c.refused != null && typeof c.refused !== 'string')) cmBad.push(`${t.key}: ${c.file} confidence/reason/depicts`);
  }
}
ok(cm.targets.length > 1000 && !cmBad.length, `commons-candidates.json: ${cm.targets.length} targets, ${cm.summary.candidates.total} candidates — real non-food, open, non-Vietnam records, Commons File: titles with confidence + reason${cmBad.length ? ': ' + cmBad.slice(0, 5).join('; ') : ''}`);
const fc = require('./fetch-commons');
ok(fc.licenceOf('CC BY-SA 4.0').licence === 'CC BY-SA 4.0' && fc.licenceOf('CC BY 2.0').licenceUrl === 'https://creativecommons.org/licenses/by/2.0/' && fc.licenceOf('CC0').licence === 'CC0 1.0' && fc.licenceOf('Public domain').licence === 'Public domain', 'fetch-commons: free licences normalised (CC BY-SA, CC BY, CC0, PD)');
ok(['CC BY-NC-SA 2.0', 'CC BY-ND 4.0', 'GFDL', 'All rights reserved', ''].every(l => fc.licenceOf(l).why), 'fetch-commons: NC, ND, GFDL-only, all-rights-reserved and missing licences refused');
const port = fc.licenceOf('CC BY-SA 3.0 de');
ok(port.licence === 'CC BY-SA 3.0 DE' && photos.creditProblems(Object.assign({}, cmn, port)).length === 0, 'fetch-commons: a ported licence (CC BY-SA 3.0 de) passes the credit gate');
ok(fc.namesPlace(['Sensō-ji', '浅草寺'], 'File:Senso-ji, Asakusa, Tokyo.jpg') && fc.namesPlace(['Sensō-ji'], 'File:X.jpg', '', 'Sensoji temple') && fc.namesPlace(['浅草寺'], '', '浅草寺の本堂') && !fc.namesPlace(['Ginkaku-ji'], 'File:Kinkaku-ji in autumn.jpg', 'Golden Pavilion') && !fc.namesPlace(['Arc'], 'File:Cleveland Arcade.jpg'), 'fetch-commons: depicts re-check matches names without spaces/diacritics, refuses another place and too-short names');
ok(JSON.stringify(fc.snapWidths([480, 960], 4000)) === '[500,960]' && JSON.stringify(fc.snapWidths([640, 1280], 1100)) === '[500,1100]' && JSON.stringify(fc.snapWidths([640, 960], 960)) === '[500,960]', 'fetch-commons: widths snap to Commons\' standard thumbnail steps (640 → 500; a 640 px request answered HTTP 400 in run #5), never wider than the original');
ok(!fc.tooManyFailures(10, 1) && !fc.tooManyFailures(2, 1) && fc.tooManyFailures(8, 3), 'fetch-commons: one failed thumbnail is skipped; the run fails only past 25 % failed downloads');
ok(fc.GLOOM.test('Old Main Snow PSU') && fc.GLOOM.test('Skyline on an overcast winter day') && !fc.GLOOM.test('Downtown Miami skyline at night') && !fc.GLOOM.test('Brooklyn Bridge at golden hour'), 'fetch-commons: a hero whose title or description says winter, snow, overcast or fog is refused (night views allowed)');
ok(fc.SIGNAGE.test('Shop signage in Dotonbori') && fc.SIGNAGE.test('Billboards at night') && !fc.SIGNAGE.test('Tokyo Tower at night') && !fc.SIGNAGE.test('30 Rockefeller Plaza (NBC headquarters)'), 'fetch-commons: a file whose subject is signage, a logo or advertising is refused');
ok(fc.SIGNAGE.test('Youngstown skyline with the YOUNGSTOWN letters sign') && fc.SIGNAGE.test('Hotel lettering') && fc.subjectRefused(fc.SIGNAGE, { label: 'Youngstown', names: ['Youngstown'] }, 'Big letters sign in Wean Park') && !fc.subjectRefused(fc.SIGNAGE, { label: 'Sign Hill', names: ['Sign Hill'] }, 'Sign Hill letters from the bay'), 'fetch-commons: lettering and letter signs are refused too — unless the sign is the place itself (Sign Hill)');
ok(fc.subjectRefused(fc.CLOSEUP, { label: 'Dayton', names: ['Dayton'] }, 'RiverScape MetroPark, Dayton | person holding black drone controller') && fc.CLOSEUP.test('Hands on a remote') && fc.CLOSEUP.test('Selfie at the falls') && fc.CLOSEUP.test('Close-up of a lantern') && !fc.CLOSEUP.test('Aerial view of the Great Miami River') && !fc.CLOSEUP.test('the Capitol dome on the right-hand side of State Street') && fc.CLOSEUP.test('a hand holding a tablet') && !fc.subjectRefused(fc.CLOSEUP, { label: 'National Portrait Gallery', names: ['National Portrait Gallery'] }, 'National Portrait Gallery facade'), 'fetch-commons: equipment / people / close-up subjects (drone controller, hands, selfie, close-up) refused; a portrait gallery keeps its photo');
{ // recompress.js: size targets per copy, Commons JPEGs only, once per row; the card credit still says "(resized)"
  const rc = require('./recompress');
  const card = { provider: 'wikimedia-commons', file: 'x-960.jpg', width: 960, record: {} }, hero = Object.assign({}, card, { slot: { type: 'hero', key: 'tokyo' } });
  ok(rc.targetOf(card, 500, false) === 45 * 1024 && rc.targetOf(card, 960, true) === 110 * 1024 && rc.targetOf(hero, 960, true) === 120 * 1024 && rc.targetOf(hero, 500, false) === 45 * 1024, 'recompress: targets — card 500 w ≤ 45 KB, card 960 w ≤ 110 KB, hero 960 w ≤ 120 KB');
  { // R7 gap 7 + gap 3, over the committed photos: every 960-step JPEG ≤ 120 KB; every Commons JPEG row has its dominant colour
    const rows = JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8')).credits;
    const big = rows.flatMap(r => rc.filesOf(r)).filter(f => /-960\.jpe?g$/i.test(f.file) && fs.statSync(path.join(BETA, 'assets', 'img', 'photos', f.file)).size > 120 * 1024).map(f => f.file);
    ok(!big.length, `every 960 w JPEG ≤ 120 KB${big.length ? ': ' + big.join(', ') : ''}`);
    const noColour = rows.filter(r => r.provider === 'wikimedia-commons' && /\.jpe?g$/i.test(r.file) && !/^#[0-9a-f]{6}$/.test(r.color || '')).map(r => r.file);
    ok(!noColour.length, `every credited Commons JPEG carries its dominant colour (#rrggbb, for the fade-in placeholder)${noColour.length ? ': ' + noColour.join(', ') : ''}`);
  }
  ok(rc.eligible(card) && !rc.eligible(Object.assign({}, card, { modified: 'resized to 500 and 960 px wide; ' + rc.MARK })) && !rc.eligible(Object.assign({}, card, { provider: 'unsplash' })) && !rc.eligible(Object.assign({}, card, { file: 'x.png' })), 'recompress: Commons JPEG rows only, each once (idempotent after every fetch)');
  ok(/ \(resized\)$/.test(photos.captionHtml(Object.assign({}, cmn, { modified: 'resized to 500 and 960 px wide; ' + rc.MARK }))) && photos.captionHtml(Object.assign({}, cmn, { modified: 'resized to 500 and 960 px wide; ' + rc.MARK }), { full: true }).includes('recompressed'), 'recompressed rows: short credit "(resized)", the full credit names both changes');
  ok(/ \(resized; derivative work by O\.J\.\)$/.test(photos.captionHtml(Object.assign({}, cmn, { modified: 'resized to 500 and 960 px wide; ' + rc.MARK + '; derivative work by O.J.' }))), 'a derivative row: the short credit still names the derivative\'s creator');
}
{ // author names: the photographer only — no flag notices, userboxes, "(talk)" asides or doubled names (W7: "Kakidai Rising Sun Flag…")
  const art = '<a href="//commons.wikimedia.org/wiki/User:Kakidai">Kakidai</a> <table><tr><td><img alt="Rising Sun Flag of Japan (16 rays)" src="x.png"></td><td>Legal disclaimer This image shows a symbol</td></tr></table>';
  ok(fc.authorOf(art) === 'Kakidai' && fc.authorOf('<a href="//x/User:Yasu">Yasu</a> (<a href="//x/User_talk:Yasu">talk</a>)') === 'Yasu' && fc.authorOf('Unknown author Unknown author') === 'Unknown author' && fc.authorOf('Rolf Müller ( User:Rolfmueller )') === 'Rolf Müller' && fc.authorOf('Photograph by Mike Peel ( www.mikepeel.net ).') === 'Mike Peel' && fc.authorOf('Bernard Spragg. NZ from Christchurch, New Zealand') === 'Bernard Spragg. NZ from Christchurch, New Zealand', 'fetch-commons authorOf: template/flag text, (talk) and (User:) asides dropped, a doubled name said once');
  ok(fc.authorOf('United_States_Capitol_-_west_front.jpg : Architect of the Capitol derivative work: O.J.') === 'Architect of the Capitol' && fc.derivativeNote('United_States_Capitol_-_west_front.jpg : Architect of the Capitol derivative work: <a href="//x/User:O.J.">O.J.</a>') === 'derivative work by O.J.' && fc.derivativeNote('Kakidai') === '', 'fetch-commons: a source file name before the author goes; a derivative note moves to modified ("derivative work by O.J.")');
ok(['User:LimoWreck', 'J. Miers - User: (WT-shared) Jtesla16 at wts wikivoyage', 'Petri Krohn (English Wikipedia)', 'Riction at English Wikipedia', 'Sleepydre (a.k.a Threeblur0 at en.wikipedia )'].map(fc.cleanAuthor).join('|') === 'LimoWreck|J. Miers|Petri Krohn|Riction|Sleepydre' && fc.cleanAuthor('Trougnouf (Benoit Brummer)') === 'Trougnouf (Benoit Brummer)' && fc.authorProblems('User:Piotrus').length && fc.authorProblems('Petri Krohn (English Wikipedia)').length, 'R7 QA-56: "User:" prefixes and wiki/project asides are stripped from authors; a real parenthetical name stays');
ok(fc.subjectRefused(fc.ARTWORK, { label: 'Nihonbashi Bridge', names: ['Nihonbashi'] }, 'Nihonbashi Bridge woodblock print by Hiroshige') && !fc.subjectRefused(fc.ARTWORK, { label: 'Ukiyo-e Ota Memorial Museum of Art', names: ['Ota Memorial Museum'] }, 'Ota Memorial Museum of Art, ukiyo-e museum') && fc.VEHICLES.test('Tour buses at Tokyo Tower') && fc.VEHICLES.test('construction site') && !fc.VEHICLES.test('Columbus Circle'), 'R7 QA-53: a print/painting is refused at fetch (unless the place is named so); vehicles and construction are flagged by the rescan');
ok(fc.licenceOf('Copyrighted free use').licence === 'Copyrighted free use' && photos.creditProblems(Object.assign({}, cmn, fc.licenceOf('Copyrighted free use'))).length === 0, 'Copyrighted free use (any use, no conditions) is accepted and passes the credit gate; the full credit is still shown');
ok(fc.viewFrom('File:Chuo-dori from Nihonbashi.jpg', ['Nihonbashi']) && fc.viewFrom('File:View of Kyoto skyline from Kiyomizu-dera.jpg', ['Kiyomizu']) && !fc.viewFrom('File:Erie Pa from Bicentennial Tower.JPG', ['Erie']) && !fc.viewFrom('File:Downtown Cincinnati viewed from Devou Park (cropped).jpg', ['Cincinnati']) && !fc.viewFrom('File:Nihonbashi bridge.jpg', ['Nihonbashi']) && !fc.viewFrom('File:Chuo-dori from Nihonbashi.jpg', ['Nihonbashi'], 'Nihonbashi Bridge and Chuo-dori'), 'fetch-commons: "<X> from <place>" is the view from the place — refused unless the title before "from" or the depicts text names the place');
ok(fc.authorOrUploader('', '<span>Own work</span>', 'Sengkang') === 'Sengkang' && fc.authorOrUploader('<a href="//x/User:A">Alice</a>', 'Own work', 'Bob') === 'Alice' && fc.authorOrUploader('', 'Flickr', 'Bob') === '' && fc.authorOrUploader('', 'Own work', '') === '', 'fetch-commons: an empty Artist on an "Own work" upload credits the uploader the API names; nothing else is guessed');
ok(fc.authorProblems('Architect of the Capitol; derivative work: O.J.').length && fc.authorProblems('X.jpg : Someone').length && fc.authorProblems('Kakidai Rising Sun Flag of Japan (16 rays) Legal disclaimer').length && fc.authorProblems('x'.repeat(61)).length && !fc.authorProblems('Bernard Spragg. NZ from Christchurch, New Zealand').length, 'fetch-commons authorProblems: > 60 characters or notice text is not a clean name');
  const bad = (JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8')).credits || []).filter(c => fc.authorProblems(c.author).length).map(c => `${c.file}: "${String(c.author).slice(0, 50)}"`);
  ok(!bad.length, `every credited author is a clean name (≤ 60 characters, no flag/userbox/talk text, not doubled)${bad.length ? ': ' + bad.join('; ') : ''}`);
}
{ // rescan whitelist: only files a person reviewed, each with its reason
  const titles = new Set((JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8')).credits || []).map(c => c.commonsTitle));
  ok(Object.entries(fc.RESCAN_KEPT).every(([f, why]) => /^File:/.test(f) && /kept after review/.test(why) && titles.has(f)), `rescan whitelist: ${Object.keys(fc.RESCAN_KEPT).length} reviewed file(s), each credited and with its reason`);
}
{ // one Commons file, one credit row: never the same photo as two heroes, or as a hero and a card (owner review, W7)
  const seen = new Map(), dups = [];
  for (const c of (JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8')).credits || [])) {
    const k = c.commonsTitle || c.sourceUrl, where = c.slot ? `hero:${c.slot.key}` : `${c.record.page}#${c.record.id}`;
    if (seen.has(k)) dups.push(`${k}: ${seen.get(k)} + ${where}`); else seen.set(k, where);
  }
  ok(!dups.length, `no Commons file is credited twice (heroes vs heroes, heroes vs cards)${dups.length ? ': ' + dups.join('; ') : ''}`);
}
const refusedC = cm.targets.flatMap(t => t.candidates.filter(c => c.refused).map(c => [t, c]));
ok(refusedC.every(([, c]) => c.refused.length > 10) && fc.plan(cm, { credits: [] }, { keys: [], types: [], min: 'high', allow: [], wikiLead: false, pilot: false }).filter(p => !p.skip).every(p => p.cands.every(c => !c.refused)), `fetch-commons: candidates refused after visual review carry a reason and are never fetched (${refusedC.length})`);
ok(fc.fileBase({ type: 'landmark', depicts: 'singapore/chinatown#sri-mariamman-temple' }) === 'singapore--chinatown--sri-mariamman-temple' && fc.fileBase({ type: 'hero', depicts: 'hub:singapore/chinatown' }) === 'hero--singapore--chinatown', 'fetch-commons: file names follow the photos/ convention');
const fplan = fc.plan(cm, { credits: [] }, { scope: 'all', keys: [], types: [], min: 'high', allow: [], wikiLead: false, pilot: false }).filter(p => !p.skip);
ok(fplan.length > 100 && fplan.every(p => (p.cands.length || p.lead) && p.cands.every(c => c.confidence === 'high' && !(c.flags || []).length) && !p.t.skip), `fetch-commons default plan: ${fplan.length} targets, high-confidence unflagged candidates (or a cited article's lead image), never a skipped (venue/food/closed/Vietnam) target`);
const lm = fplan.filter(p => p.t.type === 'landmark');
const rank = p => ({ lead: 0, row: 1 })[p.t.priority] ?? (p.t.pilot ? 2 : 3);
ok(fplan.findIndex(p => p.t.type === 'landmark') === fplan.filter(p => p.t.type === 'hero').length && lm.every((p, i) => !i || rank(lm[i - 1]) <= rank(p)), 'fetch-commons: heroes first, then lead cards, first rail rows, pilot tier-1 sights, then the rest (W8 order)');
{ // W8 per-class widths: heroes and first-screen cards 500 + 960; every other card 500 only (repo size)
  const o = { widths: [500, 960], heroWidths: [500, 960] };
  ok(JSON.stringify(fc.widthsFor({ type: 'hero' }, o)) === '[500,960]' && JSON.stringify(fc.widthsFor({ type: 'landmark', priority: 'lead' }, o)) === '[500,960]' && JSON.stringify(fc.widthsFor({ type: 'landmark', priority: 'row' }, o)) === '[500,960]' && JSON.stringify(fc.widthsFor({ type: 'landmark', pilot: true }, o)) === '[500]' && JSON.stringify(fc.widthsFor({ type: 'landmark' }, o)) === '[500]', 'fetch-commons widths per class: heroes, lead cards and first rows 500 + 960; every other card 500 only');
  ok(fc.NOT_A_PHOTO.test('File:Bangkok Montage 2021.jpg') && fc.NOT_A_PHOTO.test('File:Coat of arms of Ipoh.png') && fc.NOT_A_PHOTO.test('File:Singapore location map.png') && !fc.NOT_A_PHOTO.test('File:Marina Bay Sands at dusk.jpg'), 'fetch-commons: a map, coat of arms, flag, montage or logo is never a photo of the place');
  ok(JSON.stringify(fc.articlesOf({ articles: ['a', 'b'], article: 'c' })) === '["a","b"]' && JSON.stringify(fc.articlesOf({ article: 'c' })) === '["c"]' && fc.articlesOf({}).length === 0, 'fetch-commons: a hero tries its articles in order (the town, then an iconic sight)');
}
{ // R7 gap 1 (a): every non-Vietnam guide has a credited hero, a hero target with something to try, or a stated reason
  const heroes = new Set(JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8')).credits.filter(c => c.slot).map(c => c.slot.key));
  const T = new Map(cm.targets.filter(t => t.type === 'hero').map(t => [t.key.slice(5), t]));
  const bare = fs.readdirSync(path.join(BETA, 'data', 'places')).map(f => JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'places', f), 'utf8')))
    .filter(pg => !heroes.has(pg.key)).filter(pg => { const t = T.get(pg.key); return !t || !(t.skip || t.candidates.some(c => !c.refused) || (t.articles || []).length); }).map(pg => pg.key);
  ok(!bare.length, `every guide: a credited hero, a hero target to try, or a stated reason (Vietnam)${bare.length ? ': ' + bare.join(', ') : ''}`);
}
{ // --scope: what a run may fetch (W8)
  const sp = s => fc.plan(cm, { credits: [] }, { scope: s, keys: [], types: [], min: 'high', allow: [], wikiLead: false, pilot: false }).filter(p => !p.skip);
  const H = sp('heroes'), P = sp('priority'), PI = sp('pilots'), A = sp('all');
  ok(H.every(p => p.t.type === 'hero') && P.every(p => p.t.type === 'hero' || p.t.priority) && PI.every(p => p.t.type === 'hero' || p.t.priority || p.t.pilot) && H.length < P.length && P.length < PI.length && PI.length < A.length, `fetch-commons --scope: heroes ${H.length} < priority ${P.length} < pilots ${PI.length} < all ${A.length}; default priority`);
}
ok(lm.some(p => p.t.priority === 'lead') && lm.every(p => !p.t.priority || p.cands.length || p.lead) && cm.targets.filter(t => t.priority && !t.skip).every(t => t.candidates.length || t.wikiLead), 'W8 coverage: every unskipped lead card / first-row sight has a candidate or a cited article to try');
{ const skipped = new Map(cm.targets.filter(t => t.skip).map(t => [t.depicts, t.skip]));
  const bad = JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8')).credits.filter(c => c.record && skipped.has(`${c.record.page}#${c.record.id}`)).map(c => `${c.record.page}#${c.record.id}`);
  ok(!bad.length, `no credited photo for a skipped target (venue, brand store, copyrighted art, stated gap)${bad.length ? ': ' + bad.join(', ') : ''}`); }
ok(cm.targets.filter(t => /Pok[eé]mon Center|Pok[eé] Lid|Animate |Jump Shop/.test(t.label)).every(t => t.skip), 'W8: brand stores and Poké Lid character art are stated gaps, never fetched');
const onDisk = path.join(BETA, 'assets', 'img', 'manifest.json');
ok(fs.existsSync(onDisk) && JSON.parse(fs.readFileSync(onDisk, 'utf8')).items.length === m.items.length, 'beta/assets/img/manifest.json is current');

// ---------------------------------------------------------------- 6. heroPreload (platform W7): lazy hero + early preload
console.log('imagery: hero preload (no fetch when the page opens in Atlas)');
{
  const ph = { src: 'assets/img/photos/hero--x-960.jpg', w: 960, h: 540, widths: [{ src: 'assets/img/photos/hero--x-500.jpg', w: 500 }, { src: 'assets/img/photos/hero--x-960.jpg', w: 960 }], credit: { depicts: 'X' } };
  const tag = photos.heroPreload(ph, '../');
  const run = ({ hash = '', view = null, stored, throws = false }) => {
    const dom = new JSDOM(`<!doctype html><html${view ? ` data-view="${view}"` : ''}><head>${tag}</head><body></body></html>`, {
      runScripts: 'dangerously', url: 'https://x.test/beta/cities/x.html' + hash,
      beforeParse(w) {
        if (throws) Object.defineProperty(w, 'localStorage', { get() { throw new Error('SecurityError'); } });
        else if (stored !== undefined) w.localStorage.setItem('cleo:v1:view', JSON.stringify(stored));
      } });
    const l = dom.window.document.querySelector('link[rel=preload][as=image]');
    return l ? [l.getAttribute('href'), l.getAttribute('imagesrcset'), l.getAttribute('imagesizes'), l.getAttribute('fetchpriority')].join('|') : 'none';
  };
  const want = '../assets/img/photos/hero--x-960.jpg|../assets/img/photos/hero--x-500.jpg 500w, ../assets/img/photos/hero--x-960.jpg 960w|' + photos.HERO_SIZES + '|high';
  ok(run({}) === want, 'heroPreload: Gallery (no hash, no preference) preloads the hero with the img\'s srcset/sizes, fetchpriority=high');
  ok(run({ view: 'atlas' }) === 'none' && run({ hash: '#view=atlas' }) === 'none' && run({ stored: 'atlas' }) === 'none', 'heroPreload: skipView — html[data-view=atlas], #view=atlas or a stored Atlas preference fetch nothing');
  ok(run({ view: 'gallery', stored: 'atlas' }) === want && run({ hash: '#view=guidebook' }) === want, 'heroPreload: the boot script\'s data-view wins over storage; other views preload');
  ok(run({ throws: true }) === want, 'heroPreload: storage that throws (sandbox) is caught — the hero still preloads, no error');
  ok(!/document\.write/.test(tag) && /try\{/.test(tag), 'heroPreload: no document.write; localStorage inside try/catch');
  const fig = photos.heroHtml(ph, '../', 'photo hero-media', { preloaded: true });
  ok(/ loading="lazy" fetchpriority="high"/.test(fig) && /<figcaption>/.test(fig), 'heroHtml { preloaded }: lazy img (never fetched while hidden) at high priority, credit kept');
}

if (fails) { console.error(`>>> FAIL — imagery: ${fails} check(s) failed`); process.exit(1); }
console.log('>>> PASS — imagery: credit gate, motifs and manifest');
