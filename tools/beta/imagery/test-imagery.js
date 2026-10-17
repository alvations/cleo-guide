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
{ // D-49 (2026-10-17): a food place may carry a photo of THAT place — from a source page that identifies it, never stock
  const food = tokyo.recs.find(x => !x.closed && x.kind === 'food');
  const fr = o => fixture([Object.assign({}, good, { record: { page: 'tokyo', id: food.id } }, o)], ['a.png']);
  ok(fr({ provider: 'wikimedia-commons', identifies: 'title names the shop' }).errors.length === 0 && /D-49/.test(fr({ provider: 'wikimedia-commons' }).errors.join(' ')) && /D-49/.test(fr({ identifies: 'x' }).errors.join(' ')) &&
    /D-49/.test(fr({ identifies: 'x', provider: undefined, licence: 'Unsplash License', licenceUrl: 'https://unsplash.com/license', sourceUrl: 'https://unsplash.com/photos/abc' }).errors.join(' ')),
    'D-49 gate: a food photo needs an identifying source page (Commons/Flickr/Openverse) and records how it names the place; stock is refused');
}
{ // R8 (orchestrator): a pending row (found automatically, not yet approved on the contact sheet) is never rendered
  const pr = fixture([Object.assign({}, good, { review: 'pending' })], ['a.png']);
  const okr = fixture([Object.assign({}, good, { review: 'ok (run #90 sheet)' })], ['a.png']);
  ok(pr.errors.length === 0 && !(pr.byPage.tokyo && pr.byPage.tokyo[open.id]) && pr.pending.includes('a.png') && okr.byPage.tokyo && okr.byPage.tokyo[open.id],
    'a pending photo is never rendered (credited and kept, but dark until review = ok)');
  const nk = Object.assign({}, good, { provider: 'flickr', licence: 'No known copyright restrictions', licenceUrl: 'https://www.flickr.com/commons/usage/', sourceUrl: 'https://www.flickr.com/photos/inst/123/', authorUrl: 'https://www.flickr.com/photos/inst/' });
  ok(photos.creditProblems(nk).some(x => /Flickr Commons institution/.test(x)) && !photos.creditProblems(Object.assign({}, nk, { flickrCommons: true })).some(x => /Flickr Commons/.test(x)),
    '"No known copyright restrictions" only from a Flickr Commons institution (flickrCommons: true)');
}
let r = fixture([good], ['a.png']);
const ph = r.byPage.tokyo && r.byPage.tokyo[open.id];
ok(r.errors.length === 0 && ph && ph.w === 960 && ph.h === 640, 'complete credit + file → photo with size read from the header');
const fig = ph ? photos.figureHtml(ph, '../') : '';
ok(/<figure class="photo"><img src="\.\.\/assets\/img\/photos\/a\.png" width="960" height="640" alt="Main hall"/.test(fig), 'figure: local src, explicit width/height, alt = depicts');
ok(/<figcaption>Photo: A\. Photographer · <a [^>]*href="https:\/\/creativecommons\.org[^"]*"[^>]*>CC BY-SA 4\.0<\/a> · <a [^>]*aria-label="“Main hall” on Wikimedia Commons"[^>]*>Wikimedia Commons<\/a><\/figcaption>/.test(fig) && !/ title="/.test(fig), 'figcaption shows author, licence link and source; the file title names the source link (aria-label, no duplicate title attribute: orchestrator, R8 bytes) (TASL)');
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
ok(/^<p class="hero-credit"[^>]*>Photo: A\. Photographer · <a [^>]*rel="license[^"]*"[^>]*>CC BY-SA 4\.0<\/a> · <a [^>]*href="https:\/\/commons[^"]*" aria-label="“[^”]+” on Wikimedia Commons"[^>]*>Wikimedia Commons<\/a>/.test(hcred), 'hero credit: a visible short TASL line in the text flow (author, licence link, source link named with the file title)');
{ // card credit: short TASL line; the full sentence only on request (place detail)
  const rc = Object.assign({}, cmn, { title: 'Senso-ji, Asakusa', modified: 'resized to 500 and 960 px wide' });
  const short = photos.captionHtml(rc), full = photos.captionHtml(rc, { full: true });
  ok(short === 'Photo: A. Photographer · <a href="' + rc.licenceUrl.replace(/&/g, '&amp;') + '" rel="license noopener" target="_blank">CC BY-SA 4.0</a> · <a href="https://commons.wikimedia.org/wiki/File:Senso-ji,_Asakusa,_Tokyo.jpg" aria-label="“Senso-ji, Asakusa” on Wikimedia Commons" rel="noopener" target="_blank">Wikimedia Commons</a> (resized)', 'card credit: "Photo: author · licence · source (resized)" — file title names the source link, licence + source linked');
  ok(/^“Senso-ji, Asakusa” by A\. Photographer, <a [^>]*rel="license[^"]*"[^>]*>CC BY-SA 4\.0<\/a>, via <a [^>]*>Wikimedia Commons<\/a> — resized to 500 and 960 px wide$/.test(full), 'captionHtml(c, {full:true}): the whole TASL sentence for a place detail');
  ok(/ sizes="\(min-resolution: 2\.5dppx\) and \(max-width: 1023px\) 166px, \(max-width: 639px\) 92vw, \(max-width: 1023px\) 45vw, 25vw"/.test(photos.figureHtml(cph, '../')) && / sizes="120px"/.test(photos.figureHtml(cph, '../', 'photo', { sizes: '120px' })), 'card sizes default: a ≥ 2.5 dppx phone takes 500 w (166px), else 92vw phones, 45vw tablets, 25vw desktop; callers can pass a smaller sizes (thumbnails)');
  // D-40 condition: a 500w + 720w card asks for 240px on a 3× phone (resolves to the 720w copy); a 500w + 960w card keeps 166px
  ok(photos.cardSizes({ widths: [{ w: 500 }, { w: 720 }] }) === photos.CARD_SIZES_720 && /2\.5dppx\) and \(max-width: 1023px\) 240px,/.test(photos.CARD_SIZES_720)
    && photos.cardSizes({ widths: [{ w: 500 }, { w: 960 }] }) === photos.CARD_SIZES
    && photos.cardSizes({ widths: [{ w: 500 }, { w: 720 }, { w: 960 }] }) === photos.CARD_SIZES_720 && photos.cardSizes({ widths: [{ w: 500 }, { w: 640 }, { w: 960 }] }) === photos.CARD_SIZES_720,
    'card sizes by copy: a card with a ~720w copy (600–799, D-40a; with or without a 960) caps 3× phones at 240px; 500 + 960 cards keep 166px');
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
  /<(?:figcaption|small class="credit"|p class="credit"|p class="hero-credit")[^>]*>[\s\S]*?(?:by |Photo: )[\s\S]*?<a [^>]*rel="license/.test(t);
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
    else if (t.candidates.length && (rec.closed || row.country === 'vietnam')) cmBad.push(`${t.key}: candidates on a closed/Vietnam record`);   // D-49: food records may have candidates
  }
  if (t.type === 'hero' && /^vietnam/.test(t.depicts.replace('hub:', '')) && t.candidates.length) cmBad.push(`${t.key}: Vietnam hero candidates`);
  if (t.skip && t.candidates.some(c => !c.refused))   // refused records stay: a refused file is refused for every target
   cmBad.push(`${t.key}: candidates on a skipped target`);
  for (const c of t.candidates) {
    if (!/^File:.+\.(jpe?g|png|webp|tiff?)$/i.test(c.file) || !/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(c.pageUrl)) cmBad.push(`${t.key}: file/pageUrl ${c.file}`);
    if (!['high', 'med'].includes(c.confidence) || !c.reason || !c.depicts || (c.refused != null && typeof c.refused !== 'string')) cmBad.push(`${t.key}: ${c.file} confidence/reason/depicts`);
  }
}
ok(cm.targets.length > 1000 && !cmBad.length, `commons-candidates.json: ${cm.targets.length} targets, ${cm.summary.candidates.total} candidates — real open, non-Vietnam records (food allowed, D-49), Commons File: titles with confidence + reason${cmBad.length ? ': ' + cmBad.slice(0, 5).join('; ') : ''}`);
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
ok(fc.CLOSEUP.test('Dedicated Maneki-nekos (招き猫) in Gotoku-ji (豪徳寺) - panoramio') && fc.CLOSEUP.test('Maneki neko shelf'.replace(' ','-')), 'run #58: a shelf of maneki-neko figurines is a close-up, not the temple');
ok(fc.CLOSEUP.test('Maneki-neko figurines at Gotokuji') && fc.CLOSEUP.test('Withered lotus on Shinobazu Pond') && fc.CLOSEUP.test('Nihonbashi Kirin Statue (Detail)') && fc.VEHICLES.test('PA Trolley Museum car 832, a trolley') && fc.VEHICLES.test('Rio Open Trolley 1758') && !fc.VEHICLES.test('Ueno Park in spring'), 'R7 QA-63: figurines, lotus and detail shots are close-ups; trolleys, trams and locomotives are equipment (flagged by the rescan even at a trolley museum)');
ok(!fc.RESCAN_KEPT['File:Meadowcroft Rockshelter 07.jpg'], 'R7 QA-63: Meadowcroft is no longer whitelisted (refused as a rock close-up)');
{ // recompress.js: size targets per copy, Commons JPEGs only, once per row; the card credit still says "(resized)"
  const rc = require('./recompress');
  const card = { provider: 'wikimedia-commons', file: 'x-960.jpg', width: 960, record: {} }, hero = Object.assign({}, card, { slot: { type: 'hero', key: 'tokyo' } });
  ok(rc.targetOf({ provider: "wikimedia-commons", file: "x-960.jpg", width: 960, variants: [{ file: "x-500.jpg", width: 500 }, { file: "x-720.jpg", width: 720 }], record: {} }, 720, false) === rc.P720_KB * 1024 && rc.P720_KB <= 45 && rc.targetOf({ provider: 'wikimedia-commons', file: 'x-720.jpg', width: 720, variants: [{ file: 'x-500.jpg', width: 500 }], record: {} }, 720, true) === 75 * 1024, 'D-40 option a: a 720 w copy beside a 960 (lead / first row, first screen) ≤ 45 KB; a 500 + 720 card\'s 720 ≤ 75 KB');
  { // D-40 option a over the committed photos: every lead / first-row Commons card with a 960 also carries its ≤ 55 KB 720 copy
    const rows = JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8')).credits;
    const prio = new Set(JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'commons-candidates.json'), 'utf8')).targets.filter(t => t.priority && t.type !== 'hero').map(t => t.depicts));
    const missing = rows.filter(r => rc.needs720(r, prio)).map(r => r.file);
    const heavy = rows.filter(rc.hasLarge).flatMap(r => rc.filesOf(r)).filter(f => /-7\d\d\.jpe?g$/i.test(f.file) && fs.statSync(path.join(BETA, 'assets', 'img', 'photos', f.file)).size > rc.P720_KB * 1024).map(f => f.file);
    ok(Object.keys(rc.NO720).every(f => rows.some(r => r.file === f) && rows.find(r => r.file === f).variants.every(v => !/-(4|5)\d\d\.jpe?g$/i.test(v.file) || /-500\./.test(v.file))) && Object.values(rc.NO720).every(Boolean), 'D-40 option a: each NO720 exception is a credited 500 + 960 card with its reason, never a shrunken sub-600 copy');
    // Landed 2026-10-16 (run #50 + local recompress). Set D40A_PENDING to report rather than fail a missing copy, e.g.
    // while a run that adds lead / first-row cards is in flight. An over-cap copy always fails.
    const D40A_PENDING = false;
    ok(!heavy.length && (D40A_PENDING || !missing.length), `D-40 option a: every lead / first-row card has a 720 w copy ≤ ${rc.P720_KB} KB${heavy.length ? '; over: ' + heavy.join(', ') : ''}`);
    if (D40A_PENDING && missing.length) console.log(`  pending  D-40 option a: ${missing.length} lead / first-row card(s) still without their 720 w copy (land after run #48)`);
  }
  ok(rc.targetOf(card, 500, false) === 45 * 1024 && rc.targetOf(card, 960, true) === 110 * 1024 && rc.targetOf(hero, 960, true) === 120 * 1024 && rc.targetOf(hero, 500, false) === 45 * 1024, 'recompress: targets — card 500 w ≤ 45 KB, card 960 w ≤ 110 KB, hero 960 w ≤ 120 KB');
  { // R7 gap 7 + gap 3, over the committed photos: every 960-step JPEG ≤ 120 KB; every Commons JPEG row has its dominant colour
    const rows = JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8')).credits;
    // R7-g7: every format — a PNG once bypassed recompress and the caps (aachen 827 KB). Width class from the file name.
    const cap = f => { const w = +((/-(\d+)\.[a-z]+$/i.exec(f) || [])[1] || 0); return w >= 800 ? 120 : w >= 600 ? 75 : w ? 45 : 0; };
    const big = rows.flatMap(r => rc.filesOf(r)).filter(f => cap(f.file) && fs.statSync(path.join(BETA, 'assets', 'img', 'photos', f.file)).size > cap(f.file) * 1024).map(f => `${f.file} > ${cap(f.file)} KB`);
    ok(!big.length, `every photo, any format, within its weight cap (500 w ≤ 45 KB, 720 w ≤ 75 KB, 960 w ≤ 120 KB)${big.length ? ': ' + big.join(', ') : ''}`);
    const notJpg = rows.filter(r => r.provider === 'wikimedia-commons').flatMap(r => rc.filesOf(r)).filter(f => !/\.jpe?g$/i.test(f.file)).map(f => f.file);
    ok(!notJpg.length, `R7-g7: every credited Commons file is a JPEG (recompress converts the rest)${notJpg.length ? ': ' + notJpg.join(', ') : ''}`);
    const noColour = rows.filter(r => r.provider === 'wikimedia-commons' && !/^#[0-9a-f]{6}$/.test(r.color || '')).map(r => r.file);
    ok(!noColour.length, `every credited Commons photo carries its dominant colour (#rrggbb, for the fade-in placeholder)${noColour.length ? ': ' + noColour.join(', ') : ''}`);
  }
  ok(rc.eligible(card) && !rc.eligible(Object.assign({}, card, { modified: 'resized to 500 and 960 px wide; ' + rc.MARK })) && !rc.eligible(Object.assign({}, card, { provider: 'unsplash' })) && rc.eligible(Object.assign({}, card, { file: 'x-960.png', modified: rc.MARK })) && rc.jpgName('a--b-500.png') === 'a--b-500.jpg', 'recompress: Commons rows, each once (idempotent after every fetch) — a non-JPEG file is always converted, even on a marked row (R7-g7)');
  ok(/ \(resized\)$/.test(photos.captionHtml(Object.assign({}, cmn, { modified: 'resized to 500 and 960 px wide; ' + rc.MARK }))) && photos.captionHtml(Object.assign({}, cmn, { modified: 'resized to 500 and 960 px wide; ' + rc.MARK }), { full: true }).includes('recompressed'), 'recompressed rows: short credit "(resized)", the full credit names both changes');
  ok(/ \(resized; derivative work by O\.J\.\)$/.test(photos.captionHtml(Object.assign({}, cmn, { modified: 'resized to 500 and 960 px wide; ' + rc.MARK + '; derivative work by O.J.' }))), 'a derivative row: the short credit still names the derivative\'s creator');
}
{ // author names: the photographer only — no flag notices, userboxes, "(talk)" asides or doubled names (W7: "Kakidai Rising Sun Flag…")
  const art = '<a href="//commons.wikimedia.org/wiki/User:Kakidai">Kakidai</a> <table><tr><td><img alt="Rising Sun Flag of Japan (16 rays)" src="x.png"></td><td>Legal disclaimer This image shows a symbol</td></tr></table>';
  ok(fc.authorOf(art) === 'Kakidai' && fc.authorOf('<a href="//x/User:Yasu">Yasu</a> (<a href="//x/User_talk:Yasu">talk</a>)') === 'Yasu' && fc.authorOf('Unknown author Unknown author') === 'Unknown author' && fc.authorOf('Rolf Müller ( User:Rolfmueller )') === 'Rolf Müller' && fc.authorOf('Photograph by Mike Peel ( www.mikepeel.net ).') === 'Mike Peel' && fc.authorOf('Bernard Spragg. NZ from Christchurch, New Zealand') === 'Bernard Spragg. NZ from Christchurch, New Zealand', 'fetch-commons authorOf: template/flag text, (talk) and (User:) asides dropped, a doubled name said once');
  ok(fc.authorOf('United_States_Capitol_-_west_front.jpg : Architect of the Capitol derivative work: O.J.') === 'Architect of the Capitol' && fc.derivativeNote('United_States_Capitol_-_west_front.jpg : Architect of the Capitol derivative work: <a href="//x/User:O.J.">O.J.</a>') === 'derivative work by O.J.' && fc.derivativeNote('Kakidai') === '', 'fetch-commons: a source file name before the author goes; a derivative note moves to modified ("derivative work by O.J.")');
ok(['User:LimoWreck', 'J. Miers - User: (WT-shared) Jtesla16 at wts wikivoyage', 'Petri Krohn (English Wikipedia)', 'Riction at English Wikipedia', 'Sleepydre (a.k.a Threeblur0 at en.wikipedia )'].map(fc.cleanAuthor).join('|') === 'LimoWreck|J. Miers|Petri Krohn|Riction|Sleepydre' && fc.cleanAuthor('Trougnouf (Benoit Brummer)') === 'Trougnouf (Benoit Brummer)' && fc.authorProblems('User:Piotrus').length && fc.authorProblems('Petri Krohn (English Wikipedia)').length, 'R7 QA-56: "User:" prefixes and wiki/project asides are stripped from authors; a real parenthetical name stays');
ok(fc.subjectRefused(fc.ARTWORK, { label: 'Nihonbashi Bridge', names: ['Nihonbashi'] }, 'Nihonbashi Bridge woodblock print by Hiroshige') && !fc.subjectRefused(fc.ARTWORK, { label: 'Ukiyo-e Ota Memorial Museum of Art', names: ['Ota Memorial Museum'] }, 'Ota Memorial Museum of Art, ukiyo-e museum') && fc.VEHICLES.test('Tour buses at Tokyo Tower') && fc.VEHICLES.test('construction site') && !fc.VEHICLES.test('Columbus Circle') && !fc.VEHICLES.test('Basilique Nationale van Koekelberg') && !fc.VEHICLES.test('construction began in 1890') && fc.VEHICLES.test('bulldozers on the beach') && fc.SIGNAGE.test('Info Board MacRitchie Reservoir') && fc.SIGNAGE.test('historical marker') && fc.SIGNAGE.test('Info Board MacRitchie Reservoir Singapore Feb23 D72 25337') && fc.SIGNAGE.test('Map board at the trailhead') && fc.SIGNAGE.test('Interpretive panel by the pond') && fc.SIGNAGE.test('OPEN banner on the old wing') && !fc.SIGNAGE.test('Wheeling West Virginia Wikivoyage banner'), 'R7 QA-53: a print/painting is refused at fetch (unless the place is named so); vehicles and construction are flagged by the rescan');
ok(fc.licenceOf('Copyrighted free use').licence === 'Copyrighted free use' && photos.creditProblems(Object.assign({}, cmn, fc.licenceOf('Copyrighted free use'))).length === 0, 'Copyrighted free use (any use, no conditions) is accepted and passes the credit gate; the full credit is still shown');
ok(fc.viewFrom('File:Chuo-dori from Nihonbashi.jpg', ['Nihonbashi']) && fc.viewFrom('File:View of Kyoto skyline from Kiyomizu-dera.jpg', ['Kiyomizu']) && !fc.viewFrom('File:Erie Pa from Bicentennial Tower.JPG', ['Erie']) && !fc.viewFrom('File:Downtown Cincinnati viewed from Devou Park (cropped).jpg', ['Cincinnati']) && !fc.viewFrom('File:Nihonbashi bridge.jpg', ['Nihonbashi']) && !fc.viewFrom('File:Chuo-dori from Nihonbashi.jpg', ['Nihonbashi'], 'Nihonbashi Bridge and Chuo-dori'), 'fetch-commons: "<X> from <place>" is the view from the place — refused unless the title before "from" or the depicts text names the place');
ok(fc.authorOrUploader('', '<span>Own work</span>', 'Sengkang') === 'Sengkang' && fc.authorOrUploader('<a href="//x/User:A">Alice</a>', 'Own work', 'Bob') === 'Alice' && fc.authorOrUploader('', 'Flickr', 'Bob') === '' && fc.authorOrUploader('', 'Own work', '') === '', 'fetch-commons: an empty Artist on an "Own work" upload credits the uploader the API names; nothing else is guessed');
ok(fc.authorProblems('Architect of the Capitol; derivative work: O.J.').length && fc.authorProblems('X.jpg : Someone').length && fc.authorProblems('Kakidai Rising Sun Flag of Japan (16 rays) Legal disclaimer').length && fc.authorProblems('x'.repeat(61)).length && !fc.authorProblems('Bernard Spragg. NZ from Christchurch, New Zealand').length, 'fetch-commons authorProblems: > 60 characters or notice text is not a clean name');
  const bad = (JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8')).credits || []).filter(c => fc.authorProblems(c.author).length).map(c => `${c.file}: "${String(c.author).slice(0, 50)}"`);
  ok(!bad.length, `every credited author is a clean name (≤ 60 characters, no flag/userbox/talk text, not doubled)${bad.length ? ': ' + bad.join('; ') : ''}`);
}
{ // R8 (orchestrator): a cover word is NEVER a strict fragment of a compound cuisine label (Daikaya ≠ "Chinese")
  const { dishOf, COMPOUND } = require('../lib/dish');
  const bad = [];
  for (const r of rows) for (const c of (r.data.CUISINES || [])) { const w = dishOf([c.n]); if (w && w !== c.n.replace(/^★\s*/, '').split(' (')[0].trim() && COMPOUND.test(c.n)) bad.push(`${r.key} ${c.id}: "${w}" from "${c.n}"`); }
  for (const g of fs.readdirSync(path.join(BETA, 'data/gallery'))) {
    const gal = JSON.parse(fs.readFileSync(path.join(BETA, 'data/gallery', g), 'utf8')), row = rows.find(x => x.key === gal.key) || { data: {} };
    const full = new Set((row.data.CUISINES || []).map(c => c.n.replace(/^★\s*/, '').split(' (')[0].trim().toLowerCase()));
    for (const r of gal.rows || []) for (const x of r[6] || []) if (x.d && full.size && !full.has(String(x.d).toLowerCase())) bad.push(`${g} ${x.id}: "${x.d}"`);   // a word is a guide's FULL label, never a piece of one
  }
  ok(!bad.length && dishOf(['Chinese, Thai, Japanese & More']) === '' && dishOf(['Ramen & Tsukemen']) === 'Ramen & Tsukemen', `cover words: none is a strict fragment of a compound cuisine label, across all guides${bad.length ? ': ' + bad.slice(0, 5).join('; ') : ''}`);
}
{ // R8 (orchestrator): a venue is a PRIMARY kind (first g tag, or k says venue/store); a secondary venue theme tag never skips a sight
  const tg = JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'commons-candidates.json'), 'utf8')).targets;
  const by = k => tg.find(t => t.key === k) || {};
  ok(!/^venue/.test(by('landmark:chicago#alta-vista-terrace-district').skip || '') && !/^venue/.test(by('landmark:dayton#boonshoft-museum-of-discovery').skip || '') && !/^venue/.test(by('landmark:cincinnati#ault-park').skip || ''),
    'manifest: a sight whose venue tag is secondary (Alta Vista Terrace ICON…SPORT, Boonshoft MUS…SHOP, Ault Park) is not skipped');
}
{ // R8 run #77: a file refused for its own fault is never a live candidate for any other target
  const fc2 = require('./fetch-commons');
  const tg = JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'commons-candidates.json'), 'utf8')).targets;
  const glob = new Set(tg.flatMap(t => (t.candidates || []).filter(c => c.refused && fc2.refusalIsGlobal(c.refused)).map(c => c.file)));
  const live = tg.flatMap(t => (t.candidates || []).filter(c => !c.refused && glob.has(c.file)).map(c => `${t.key} ${c.file}`));
  ok(!live.length, `manifest: no target lists a file refused for its own fault as a live candidate${live.length ? ': ' + live.slice(0, 5).join('; ') : ''}`);
}
{ // R8 (2): discover-commons.js — geosearch / P18 picks must NAME the place; nothing credited before review
  const dc = require('./discover-commons');
  ok(dc.namingField(['Goh Chor Tua Pek Kong Temple'], 'File:Goh Chor Tua Pek Kong Temple 2.jpg', '', []) === 'title' && dc.namingField(['Peace Pagoda'], 'File:IMG_1234.jpg', 'The Peace Pagoda at dusk', []) === 'description' &&
    dc.namingField(['Peace Pagoda'], 'File:IMG_1.jpg', '', ['Peace Pagoda (San Francisco)']) === 'category' && dc.namingField(['Peace Pagoda'], 'File:IMG_1.jpg', 'a street', ['Streets in Japantown']) === null,
    'discover-commons: a geosearch hit counts only when its title, description or category names the place (and records which)');
  const pg = (o) => Object.assign({ title: 'File:Peace Pagoda Japantown.jpg', categories: [{ title: 'Category:Peace Pagoda (San Francisco)' }], imageinfo: [{ mime: 'image/jpeg', width: 2000, height: 1500, user: 'U', thumburl: 'https://x/t.jpg',
    extmetadata: { LicenseShortName: { value: 'CC BY-SA 4.0' }, LicenseUrl: { value: 'https://creativecommons.org/licenses/by-sa/4.0' }, Artist: { value: 'A. Person' } } }] }, o);
  const tt = { label: 'Peace Pagoda', names: [], widths: [500, 720], cls: 'other' };
  ok(dc.judgeFile(pg({}), tt, 'geosearch 12 m').pick && dc.judgeFile(pg({ title: 'File:Peace Pagoda sign.jpg' }), tt, 'geosearch 5 m').why && dc.judgeFile(pg({ title: 'File:Street.jpg', categories: [] }), tt, 'geosearch 5 m').why,
    'discover-commons: a named, free-licensed JPEG is a pick; signage or an unnamed file is refused');
}
{ // R8 owner directive: fetch-openverse.js — discovery across all Openverse sources; nothing credited before review
  const fo = require('./fetch-openverse');
  const t = { key: 'landmark:singapore/balestier#x', label: 'Goh Chor Tua Pek Kong Temple', names: [], page: 'singapore/balestier', town: ['balestier'], widths: [500, 720] };
  const r = (o) => fo.norm(Object.assign({ id: 'a1', title: 'Goh Chor Tua Pek Kong Temple, Balestier', tags: [], creator: 'Some Photographer', creator_url: 'https://www.flickr.com/photos/sp/', foreign_landing_url: 'https://www.flickr.com/photos/sp/123/',
    url: 'https://live.staticflickr.com/1/123_b.jpg', width: 1024, height: 768, license: 'by', license_version: '2.0', source: 'flickr', provider: 'flickr', filetype: 'jpg' }, o));
  const j = fo.judge(r({}), t, new Set());
  ok(j.pick && j.pick.provider === 'flickr' && j.pick.sourceUrl === 'https://www.flickr.com/photos/sp/123/' && j.pick.authorUrl === 'https://www.flickr.com/photos/sp/' && j.pick.licence === 'CC BY 2.0' && j.pick.review === 'pending' && /^title/.test(j.pick.matched),
    'fetch-openverse: a matching Flickr result becomes a review-pending pick with full TASL and the matched field');
  ok(fo.judge(r({ license: 'by-nc' }), t, new Set()).why && fo.judge(r({ width: 400 }), t, new Set()).why && fo.judge(r({ title: 'Goh Chor Tua Pek Kong Temple 1932' }), t, new Set()).why &&
    fo.judge(r({}), t, new Set(['https://www.flickr.com/photos/sp/123/'])).why && fo.judge(r({ title: 'A temple' }), t, new Set()).why,
    'fetch-openverse: NC, too small, historic (pre-1950, D-50), already credited/refused, and unnamed results are refused');
  ok(fo.pages(r({ source: 'wikimedia', foreign_landing_url: 'https://commons.wikimedia.org/wiki/File:X_y.jpg' })).commonsTitle === 'File:X y.jpg' && fo.pages(r({ source: 'smithsonian_x', foreign_landing_url: 'https://collections.si.edu/obj/1' })).provider === 'openverse' && fo.pages(r({ source: 'met', foreign_landing_url: 'http://x' })).why,
    'fetch-openverse: Commons results keep their File: page, museum results their https landing page; others are refused');
  ok(fo.ruleGap('venue (BAR) — never a photo') && !fo.ruleGap('no file found (wave 5 search)') && !fo.ruleGap(undefined), 'fetch-openverse: rule gaps stay closed; "no usable Commons photo" gaps are open to Openverse');
  const ts = fo.targets({ classes: [], keys: [], pending: false });
  ok(ts.length > 0 && ts.every((x, i) => i === 0 || fo.CLASSES.indexOf(ts[i - 1].cls) <= fo.CLASSES.indexOf(x.cls)) && ts.some(x => x.cls === 'food') && !ts.some(x => /^landmark:vietnam\//.test(x.key)),
    'fetch-openverse: targets are ordered hero → priority → tier 1 → other → food (D-49), never Vietnam');
}
{ // R8 owner directive: fetch-flickr.js fills only the stated gaps, with honest licences, matching and laundering guards
  const ff = require('./fetch-flickr');
  ok(ff.flickrGap('no file found (wave 5 search) — calm cover (stated, W8)') && ff.flickrGap('both vetted Commons files refused (a plain beach; a housing estate)') &&
    !ff.flickrGap('venue (a bar) — never a photo') && !ff.flickrGap('modern artwork, no US FoP') && !ff.flickrGap('Vietnam has no freedom of panorama') && !ff.flickrGap('indoor themed ride: …') && !ff.flickrGap(''),
    'fetch-flickr: only "no usable Commons photo" gaps are targets — never venues, art, Vietnam, themed rides');
  ok(ff.licenceOf('by', '2.0').licence === 'CC BY 2.0' && ff.licenceOf('by-sa', '4.0').licenceUrl === 'https://creativecommons.org/licenses/by-sa/4.0/' && ff.licenceOf('pdm').licence === 'Public domain' &&
    ff.licenceOf('cc0').licence === 'CC0 1.0' && ff.licenceOf('nkcr').why && ff.licenceOf('by-nc', '2.0').why && ff.licenceOf('by-nd', '4.0').why && ff.licenceOf('', '').why,
    'fetch-flickr: CC0 / PDM / CC BY / CC BY-SA kept with deed links; NC, ND, "no known restrictions" and unknown refused');
  const t = { label: 'Goh Chor Tua Pek Kong Temple', names: [], town: ['balestier'] };
  ok(ff.matches({ title: 'Goh Chor Tua Pek Kong Temple, Balestier', tags: [] }, Object.assign({ radius: 1.5 }, t)).ok && ff.matches({ title: 'Temple at dusk', tags: ['balestier'] }, Object.assign({ radius: 1.5 }, t)).why &&
    ff.matches({ title: 'Tua Pek Kong', tags: [] }, Object.assign({ radius: 1.5 }, t)).why && ff.matches({ title: 'Tua Pek Kong temple', tags: ['balestier'] }, Object.assign({ radius: 1.5 }, t)).ok && ff.matches({ title: 'Pek Kong shrine', tags: [], lat: 1.40, lon: 103.9 }, Object.assign({ radius: 1.5, la: 1.325, ln: 103.85 }, t)).why,
    'fetch-flickr: a result must name the place in its title and be confirmed by a second name word, the town or a geotag in range');
  ok(ff.refusal({ title: 'Temple — press photo', tags: [], creator: 'x' }, t) && ff.refusal({ title: 'Temple', description: 'Photo by John Smith', tags: [], creator: 'aphotog' }, t) &&
    ff.refusal({ title: 'Temple signage close-up', tags: [], creator: 'x' }, t) && !ff.refusal({ title: 'Goh Chor Tua Pek Kong Temple facade', tags: ['singapore'], creator: 'x' }, t),
    'fetch-flickr: laundering (press/©/someone else credited) and subject (signage, close-up) refusals');
  ok(ff.profileOf('https://www.flickr.com/photos/12345678@N00') === 'https://www.flickr.com/photos/12345678@N00/' && ff.photoPageOf('https://www.flickr.com/photos/abc/5123456789/in/photostream') === 'https://www.flickr.com/photos/abc/5123456789/' && !ff.photoPageOf('https://example.org/x'),
    'fetch-flickr: author profile and photo page URLs normalised; non-Flickr pages refused');
  ok(ff.nameWords('Dempsey Hill — guide hero').join(' ') === 'dempsey', 'fetch-flickr: a hero label\'s " — guide hero" suffix is never a name word');
  const base = { file: 'x--y-960.jpg', record: { page: 'tokyo', id: 'senso-ji' }, depicts: 'x', author: 'A', licence: 'CC BY 2.0', licenceUrl: 'https://creativecommons.org/licenses/by/2.0/', provider: 'flickr' };
  ok(!photos.creditProblems(Object.assign({}, base, { sourceUrl: 'https://www.flickr.com/photos/abc/123/', authorUrl: 'https://www.flickr.com/photos/abc/' })).filter(x => !/file|not found|width|height/i.test(x)).length &&
    photos.creditProblems(Object.assign({}, base, { sourceUrl: 'https://www.flickr.com/photos/abc/123/' })).some(x => /authorUrl/.test(x)) &&
    photos.creditProblems(Object.assign({}, base, { sourceUrl: 'https://example.org/1', authorUrl: 'https://www.flickr.com/photos/abc/' })).some(x => /flickr\.com\/photos/.test(x)) &&
    photos.creditProblems(Object.assign({}, base, { licence: 'CC BY-NC 2.0', sourceUrl: 'https://www.flickr.com/photos/abc/123/', authorUrl: 'https://www.flickr.com/photos/abc/' })).some(x => /licence/.test(x)) &&
    photos.creditProblems(Object.assign({}, base, { provider: 'wikimedia-commons', licence: 'No known copyright restrictions', licenceUrl: 'https://www.flickr.com/commons/usage/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:X.jpg' })).some(x => /Flickr Commons/.test(x)),
    'credit gate: a Flickr row needs its photo page and the author\'s profile; NC refused; "no known restrictions" only for Flickr');
  ok(/Photo: <a href="https:\/\/www\.flickr\.com\/photos\/abc\/"[^>]*>A<\/a> · <a [^>]*>CC BY 2\.0<\/a> · <a href="https:\/\/www\.flickr\.com\/photos\/abc\/123\/"[^>]*>Flickr<\/a>/.test(photos.captionHtml(Object.assign({}, base, { sourceUrl: 'https://www.flickr.com/photos/abc/123/', authorUrl: 'https://www.flickr.com/photos/abc/' }))),
    'credit: a Flickr caption links the author\'s profile, the licence deed and the Flickr photo page (TASL)');
}
{ // DESIGN-SYSTEM §v2.7a: designed food covers — the city ground (two data-URI url()s, < 1 KB together) and the no-repeat glyph rule
  const m = require('./motifs');
  const keys = Object.keys(m.RECIPES).concat(['singapore/chinatown', 'singapore/katong-joo-chiat', 'vietnam/hanoi']);
  const big = keys.map(k => [k, m.foodGround(m.cityRecipe({ key: k }))]).filter(([, g]) => g.light.length + g.dark.length >= 1024 || !/^url\("data:image\/svg\+xml,/.test(g.light) || /#/.test(g.light + g.dark)).map(([k]) => k);
  ok(!big.length, `§v2.7a: every city food ground is a pair of data-URI url()s under 1 KB together, # escaped${big.length ? ': ' + big.join(', ') : ''}`);
  const g = m.foodGlyphs(['bowl', 'bowl', 'bowl', 'dumpling', 'dumpling', 'noodles', 'noodles', 'forkknife', 'forkknife']);
  ok(g.every((x, i) => i === 0 || x !== g[i - 1]) && g[0] === 'bowl' && g[3] === 'dumpling' && Object.values(m.FOOD_GLYPH_LADDER).flat().every(x => /^[a-z]+$/.test(x)), `§v2.7a: adjacent food covers never repeat a glyph (${g.join(' ')})`);
  ok(!Object.values(m.FOOD_GLYPH_LADDER).flat().includes('lantern'), '§v2.7a (Designer): lantern is izakaya-only, never a fallback rung (it means "temple" on Japan sight covers)');
  ok(imagery.foodStyle({ imagery: { food: m.foodGround(m.RECIPES.newyork()) } }).startsWith('--food-ground:url("data:image/svg+xml,') && imagery.foodStyle({}) === '', '§v2.7a: foodStyle gives the --food-ground / --food-ground-dark pair for a city row, empty without one');
}
{ // R7 QA-78: an author is never a URL or HTML (a Flickr profile link credits the account it shows)
  ok(fc.accountOf('https://www.flickr.com/photos/arne_heggestad/') === 'arne_heggestad (Flickr)' && fc.authorOf('<a href="https://www.flickr.com/photos/arne_heggestad/">https://www.flickr.com/photos/arne_heggestad/</a>') === 'arne_heggestad (Flickr)' && fc.authorProblems('https://example.org/me').length && fc.authorProblems('A &lt;b&gt; B').length && !fc.authorProblems('arne_heggestad (Flickr)').length, 'R7 QA-78: a profile-link credit names the account; any other URL or HTML author is refused');
  const doc = JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8'));
  const bad = (doc.credits || []).filter(c => /^https?:\/\//i.test(String(c.author || '')) || /&lt;|</.test(String(c.author || ''))).map(c => `${c.file}: "${c.author}"`);
  ok(!bad.length, `R7 QA-78: no CREDITS author is a URL or carries HTML (the template example row is not a credit)${bad.length ? ': ' + bad.join('; ') : ''}`);
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
{ // run #52: a refusal appended to cands.tsv was dropped when the same file had an earlier vetted line — every refusal must reach the manifest
  const tsv = path.join(__dirname, 'manifest', 'cands.tsv');
  const lost = !fs.existsSync(tsv) ? [] : fs.readFileSync(tsv, 'utf8').split('\n').map(l => l.split('\t')).filter(p => p.length >= 7 && p[6].trim())
    .filter(([key, f]) => !(cm.targets.find(t => t.key === key) || { candidates: [] }).candidates.some(c => c.file === 'File:' + f && c.refused)).map(([key, f]) => `${key} ${f}`);
  ok(!lost.length, `manifest: every refusal in manifest/cands.tsv reaches commons-candidates.json, even when the file was vetted on an earlier line${lost.length ? ': ' + lost.join('; ') : ''}`);
}
ok(fc.fileBase({ type: 'landmark', depicts: 'singapore/chinatown#sri-mariamman-temple' }) === 'singapore--chinatown--sri-mariamman-temple' && fc.fileBase({ type: 'hero', depicts: 'hub:singapore/chinatown' }) === 'hero--singapore--chinatown', 'fetch-commons: file names follow the photos/ convention');
const fplan = fc.plan(cm, { credits: [] }, { scope: 'all', keys: [], types: [], min: 'high', allow: [], wikiLead: false, pilot: false }).filter(p => !p.skip);
ok(fplan.length > 100 && fplan.every(p => (p.cands.length || p.lead) && p.cands.every(c => c.confidence === 'high' && !(c.flags || []).length) && !p.t.skip), `fetch-commons default plan: ${fplan.length} targets, high-confidence unflagged candidates (or a cited article's lead image), never a skipped (venue/food/closed/Vietnam) target`);
const lm = fplan.filter(p => p.t.type === 'landmark');
const rank = p => ({ lead: 0, row: 1 })[p.t.priority] ?? (p.t.pilot ? 2 : 3);
ok(fplan.findIndex(p => p.t.type === 'landmark') === fplan.filter(p => p.t.type === 'hero').length && lm.every((p, i) => !i || rank(lm[i - 1]) <= rank(p)), 'fetch-commons: heroes first, then lead cards, first rail rows, pilot tier-1 sights, then the rest (W8 order)');
{ // W8 per-class widths: heroes and first-screen cards 500 + 960; every other card 500 only (repo size)
  const o = { widths: [500, 960], heroWidths: [500, 960] };
  ok(JSON.stringify(fc.widthsFor({ type: 'hero' }, o)) === '[500,960]' && JSON.stringify(fc.widthsFor({ type: 'landmark', priority: 'lead' }, o)) === '[500,720,960]' && JSON.stringify(fc.widthsFor({ type: 'landmark', priority: 'row' }, o)) === '[500,720,960]' && JSON.stringify(fc.widthsFor({ type: 'landmark', pilot: true }, o)) === '[500,720]' && JSON.stringify(fc.widthsFor({ type: 'landmark' }, o)) === '[500,720]' && fc.DERIVED_W === 720, 'fetch-commons widths per class: heroes 500 + 960; lead cards and first rows 500 + 720 + 960 (D-40 option a); every other card 500 + a 720 copy derived from the 960 thumbnail (D-40)');
  ok(fc.widthList([500]) === '500' && fc.widthList([500, 960]) === '500 and 960' && fc.widthList([500, 720, 960]) === '500, 720 and 960', 'fetch-commons: the credit names its widths as a list ("resized to 500, 720 and 960 px wide")');
  { const rc2 = require('./recompress'); ok(rc2.targetOf({ record: {} }, 720, true) === 75 * 1024 && rc2.targetOf({ record: {} }, 500, false) === 45 * 1024, 'recompress: a card\'s 720 w copy ≤ 75 KB (D-40)'); }
  ok(fc.NOT_A_PHOTO.test('File:Bangkok Montage 2021.jpg') && fc.NOT_A_PHOTO.test('File:Coat of arms of Ipoh.png') && fc.NOT_A_PHOTO.test('File:Singapore location map.png') && !fc.NOT_A_PHOTO.test('File:Marina Bay Sands at dusk.jpg'), 'fetch-commons: a map, coat of arms, flag, montage or logo is never a photo of the place');
  ok(['File:Emblem of the National Museum of the US Air Force.png', 'File:USAF insignia.png', 'File:Seal of Cincinnati.svg', 'File:Crest of Ghent.png', 'File:Badge of the Corps.jpg', 'File:Flag of Erie.png', 'File:Pittsburgh incline diagram.png', 'File:Festival poster 1968.jpg', 'File:Waldameer logos.png'].every(f => fc.NOT_A_PHOTO.test(f)) && !fc.NOT_A_PHOTO.test('File:Hillcrest Park lawn.jpg') && !fc.NOT_A_PHOTO.test('File:Maple Street in autumn.jpg') && fc.subjectRefused(fc.NOT_A_PHOTO, { label: 'Dayton', names: ['Dayton'] }, 'File:Emblem.png museum') && !fc.subjectRefused(fc.NOT_A_PHOTO, { label: 'Seal Rocks', names: ['Seal Rocks'] }, 'File:Seal Rocks at dusk.jpg'), 'R7-g7: logos, emblems, seals, crests, insignia, badges, flags, maps, diagrams and posters are refused (title or depicts) — unless the place is named that way (Seal Rocks)');
  ok(fc.suspectFormat('image/png', '') && fc.suspectFormat('image/webp', ' ') && !fc.suspectFormat('image/png', 'Waldameer Park midway with the Ravine Flyer') && !fc.suspectFormat('image/jpeg', ''), 'R7-g7: a PNG/WebP lead image is accepted only with a vetted photographic depicts; a JPEG lead image is not suspect for its format');
  ok(JSON.stringify(fc.articlesOf({ articles: ['a', 'b'], article: 'c' })) === '["a","b"]' && JSON.stringify(fc.articlesOf({ article: 'c' })) === '["c"]' && fc.articlesOf({}).length === 0, 'fetch-commons: a hero tries its articles in order (the town, then an iconic sight)');
}
{ // R7 gap 1 (a): every non-Vietnam guide has a credited hero, a hero target with something to try, or a stated reason
  const heroes = new Set(JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8')).credits.filter(c => c.slot).map(c => c.slot.key));
  const T = new Map(cm.targets.filter(t => t.type === 'hero').map(t => [t.key.slice(5), t]));
  const bare = fs.readdirSync(path.join(BETA, 'data', 'places')).map(f => JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'places', f), 'utf8')))
    .filter(pg => !heroes.has(pg.key)).filter(pg => { const t = T.get(pg.key); return !t || !(t.skip || t.candidates.some(c => !c.refused) || (t.articles || []).length); }).map(pg => pg.key);
  ok(!bare.length, `every guide: a credited hero, a hero target to try, or a stated reason (Vietnam)${bare.length ? ': ' + bare.join(', ') : ''}`);
}
{ // R7-g1 / R8 gap #1a: Queenstown, Dempsey Hill and Jalan Besar carry a credited hero, a vetted candidate to try, or a stated reason; Vietnam always states its reason
  const credited = new Set(JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8')).credits.filter(c => c.slot).map(c => 'hero:' + c.slot.key));
  const t = k => cm.targets.find(x => x.key === k) || {};
  ok(['hero:singapore/queenstown', 'hero:singapore/dempsey-hill', 'hero:singapore/jalan-besar'].every(k => credited.has(k) || t(k).skip || (t(k).candidates || []).some(c => !c.refused)) && t('hero:vietnam/hanoi').skip, 'R7-g1: the Singapore hero gaps have a hero, a vetted candidate or a stated reason; Vietnam states its reason');
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
{ const club = { label: 'The Empty Bottle', names: ['Empty Bottle'] }, comedy = { label: 'The Second City', names: ['Second City'] }, hall = { label: 'Thalia Hall', names: ['Thalia Hall'] }, sym = { label: 'Symphony Center', names: ['Symphony Center'] };
  ok(fc.performerRefused(club, 'File:Torquil Campbell at The Empty Bottle 1.jpg sepia portrait of the singer') && fc.performerRefused(comedy, 'File:The Second City, Main Stage.jpg') && fc.performerRefused({ label: 'Riverwalk', names: ['Riverwalk'] }, 'Band performing live at the Riverwalk') && !fc.performerRefused(hall, 'File:Thalia Hall Chicago facade.jpg') && !fc.performerRefused(sym, 'File:Symphony Center Chicago exterior.jpg') && !fc.performerRefused(comedy, 'File:The Second City building exterior, North Wells Street.jpg'), 'W8 PERFORMER: a singer, a band, a stage are refused; a music/comedy/theatre venue takes only its building exterior (Thalia Hall and Symphony Center facades pass)'); }
ok(fc.refusalIsGlobal('refused by visual review (W8): a shop street dominated by signage') && !fc.refusalIsGlobal('refused by review (W7): the same file is the Washington DC hero') && !fc.refusalIsGlobal('refused by visual review (W8): repeats the Jewel subject of the Changi lead card') && !fc.refusalIsGlobal('refused by visual review (W7): duplicates the Saarland hero'), 'refusals: a photo-fault refusal holds for every target; a duplicate/slot refusal only for its own');
{ const refused = new Set(cm.targets.flatMap(t => (t.candidates || []).filter(c => c.refused && fc.refusalIsGlobal(c.refused)).map(c => c.file)));
  const bad = JSON.parse(fs.readFileSync(path.join(BETA, 'assets', 'img', 'CREDITS.json'), 'utf8')).credits.filter(c => refused.has(c.commonsTitle)).map(c => `${c.file} (${c.commonsTitle})`);
  ok(!bad.length, `no credited photo is a file refused for its own fault (signage, gloom, wrong subject…), anywhere${bad.length ? ': ' + bad.join(', ') : ''}`); }
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
