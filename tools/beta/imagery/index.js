'use strict';
/**
 * imagery/index.js — the imagery lane's single entry point for the beta generator (ROUND-1 gap #1).
 *
 *   imagery.build(ctx)    called once by tools/beta/build.js: emits the motif SVGs + their index, the photo-path
 *                         manifest, gates every photo against CREDITS.json, and attaches `imagery` to rows.
 *   imagery.motifSvg()    the motif as a decorative inline <svg><image> layer for a tile / masthead / cover.
 *   imagery.photoFor()    the gated photo for a record, or null (then the renderer keeps the motif / plate).
 *   imagery.figureHtml()  <figure class="photo"> with the visible TASL credit (srcset when the credit has size variants).
 *   imagery.heroFor()     the credited hero photo of a city row / country, or null (W7, Commons or Unsplash slots).
 *   imagery.heroHtml()    that hero as a full-bleed, eager <figure class="photo hero-photo"> (+ heroCreditHtml(): its credit line).
 *
 * Model fields (documented for FE lanes; all paths are beta-root-relative and carry a ?v= content hash):
 *   row.imagery     = { motif: {night, ink, why}, photos: {placeId: {src, w, h, srcset, credit}}, hero }   (city rows)
 *   country.imagery = { motif: {night, ink, why}, hero }
 *   reg.imagery     = { collections: {kind: {night, ink, why}}, collectionKind(id, name) → kind, photoCount, slots }
 * Static outputs: beta/assets/img/motifs/*.svg, beta/assets/img/motifs/index.json, beta/assets/img/manifest.json.
 * Owner-edited inputs (never generated): beta/assets/img/CREDITS.json, beta/assets/img/photos/*.
 */
const fs = require('fs');
const path = require('path');
const { buildMotifs, collectionKind } = require('./motifs');
const { buildManifest } = require('./manifest');
const photos = require('./photos');
const { buildKinds } = require('./kinds');

function build({ reg, cityRows, emit, errors, sha, betaDir }) {
  const tokPath = path.join(betaDir, 'assets', 'tokens.css');
  const tokensCss = fs.existsSync(tokPath) ? fs.readFileSync(tokPath, 'utf8') : '';
  const { files, index } = buildMotifs({ cityRows, countries: reg.countries, tokensCss });
  const ver = {};
  for (const [rel, body] of Object.entries(files)) { emit(rel, body); ver[rel] = `${rel}?v=${sha(body)}`; }
  const v = m => ({ night: ver[m.night], ink: ver[m.ink], why: m.why });
  for (const r of cityRows) r.imagery = { motif: v(index.pages[r.key]), photos: {} };
  for (const c of reg.countries) if (index.countries[c.key]) c.imagery = { motif: v(index.countries[c.key]) };
  const collections = Object.fromEntries(Object.entries(index.collections).map(([k, m]) => [k, v(m)]));
  const themes = Object.fromEntries(Object.entries(index.themes || {}).map(([k, m]) => [k, Object.assign(v(m), { subject: m.subject })]));

  emit('assets/img/motifs/index.json', JSON.stringify({ _generated: 'tools/beta/imagery/motifs.js — do not edit', v: 1,
    _doc: 'Original SVG motifs (imagery lane). night = drawn for the night ground (tiles, mastheads); ink = for the paper ground, flips under prefers-color-scheme: dark. Generic subjects only — never a depiction of a venue. Render with imagery.motifSvg() (an inline <svg><image href> layer). Do not put these URLs in a CSS custom property: browsers disagree on its base URL.',
    pages: Object.fromEntries(cityRows.map(r => [r.key, r.imagery.motif])),
    countries: Object.fromEntries(reg.countries.filter(c => c.imagery).map(c => [c.key, c.imagery.motif])),
    collections, themes, collectionIds: require('./motifs').COLLECTION_ID }, null, 1));

  // per-kind Gallery cover motifs (ROUND-3 gap #3): mask art, painted by views.css § V10 via build-css.py rules
  for (const [rel, body] of Object.entries(buildKinds())) emit(rel, body);

  emit('assets/img/manifest.json', JSON.stringify(buildManifest(cityRows, reg.geo), null, 1));

  const pages = Object.fromEntries(cityRows.map(r => [r.key, { country: r.country, recs: r.recs }]));
  const ph = photos.loadPhotos(betaDir, pages);
  errors.push(...ph.errors.map(e => 'imagery: ' + e));
  let photoCount = 0;
  for (const r of cityRows) { r.imagery.photos = ph.byPage[r.key] || {}; r.imagery.hero = ph.bySlot[`hero:${r.key}`] || null; photoCount += Object.keys(r.imagery.photos).length; }
  for (const c of reg.countries) if (c.imagery) c.imagery.hero = ph.bySlot[`hero:${c.key}`] || null;   // country hub hero (W7)
  reg.imagery = { collections, collectionKind, photoCount, slots: ph.bySlot, heroCount: Object.keys(ph.bySlot).filter(k => k.startsWith('hero:')).length };
  return reg.imagery;
}

/**
 * The Gallery cover motif for a record (ROUND-4 gap #6): keyed on the place's KIND — its collection ids (sights) or
 * cuisine ids (food), in the record's own order — never on the card glyph, a name or description keywords (Wenwen
 * rule). Theme ids (pop culture, free, iconic, family…) say why a place is listed, not what it is, so the first
 * kind id wins and a theme only decides when the record has no kind id. 'worship' is resolved per country in CSS
 * (a shrine gate in Japan, a generic spire elsewhere — the gate is Shinto-specific). Returns a file key in
 * beta/assets/img/motifs/kinds/ (or 'worship'), or '' to let the renderer fall back to the glyph.
 */
const MOTIF_KIND = {
  TEMPLE: 'worship', SHRINE: 'worship', Temple: 'worship', Church: 'worship', Mosque: 'worship',
  MUS: 'columns', MUSEUM: 'columns', ARCH: 'columns', Architecture: 'columns', GOV: 'columns', CIVIL: 'columns', CAMPUS: 'columns',
  School: 'columns', DECO: 'columns', FLW: 'columns', MON: 'columns', Monument: 'columns', National: 'columns',
  CASTLE: 'castle', HIST: 'castle', HISTORY: 'castle', HERITAGE: 'castle', Heritage: 'castle', Landmark: 'castle',
  PARK: 'leaf', Park: 'leaf', GARDEN: 'leaf', OUTDOOR: 'leaf', OUT: 'leaf', WILD: 'leaf', Recreation: 'leaf', Trail: 'leaf', Walk: 'leaf',
  NATURE: 'mountain', Nature: 'mountain', WINTER: 'mountain',
  WATER: 'waves', RIVER: 'waves', CANAL: 'waves', LAKES: 'waves', Lake: 'waves', BEACH: 'waves', BOAT: 'waves', MARITIME: 'waves', Wetland: 'waves',
  ONSEN: 'steam', SPA: 'steam', SPRNG: 'steam', SPRING: 'steam',
  MKT: 'awning', MARKET: 'awning', Market: 'awning', SHOP: 'awning', Shopping: 'awning', Mall: 'awning', Hawker: 'awning', CRAFT: 'awning', GLASS: 'awning',
  VIEW: 'tower', ROOF: 'tower', RIDE: 'wheel',
  SPEAK: 'bottle', BAR: 'bottle', BREW: 'bottle',
};
const MOTIF_THEME = {
  ANIME: 'bubble', POP: 'bubble', TV: 'tv', VIRAL: 'tv', NIGHT: 'moon', UNESCO: 'globe', SPACE: 'globe',
  FREE: 'ticket', ENT: 'ticket', ARTS: 'ticket', ART: 'ticket', FAM: 'ticket', FAMILY: 'ticket', SHOW: 'ticket', SPORT: 'ticket', Sports: 'ticket', RACE: 'ticket',
};
function motifOf(rec, glyph = '') {
  if (!rec) return glyph;
  if (rec.kind === 'food') return glyph;                 // food glyphs already key on the first cuisine id
  const g = rec.g || [];
  for (const id of g) if (MOTIF_KIND[id]) return MOTIF_KIND[id];
  for (const id of g) if (MOTIF_THEME[id]) return MOTIF_THEME[id];
  return glyph;
}

const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
/**
 * The motif as a decorative layer: an inline <svg> wrapping <image href> (the href resolves against the PAGE in every
 * browser — a url() inside a CSS custom property does not: Chromium resolves it against the stylesheet).
 * Inside `.tile .art` the designer's `.tile .art svg` rule positions it; elsewhere pass `style` (e.g. mastheads).
 * @param m     a motif record ({night, ink}) from row.imagery / country.imagery / reg.imagery.collections
 * @param up    path back to the beta/ root from the page
 * @param fit   SVG preserveAspectRatio: 'xMidYMax slice' fills the box (tiles); 'xMaxYMax meet' keeps it whole
 */
function motifSvg(m, up = '', { tone = 'night', fit = 'xMidYMax slice', style = '', cls = 'motif' } = {}) {
  if (!m || !m[tone]) return '';
  return `<svg class="${cls}" viewBox="0 0 480 200" preserveAspectRatio="${fit}" aria-hidden="true" focusable="false"${style ? ` style="${attr(style)}"` : ''}><image href="${attr(up + m[tone])}" width="480" height="200" preserveAspectRatio="${fit}"/></svg>`;
}

/**
 * The credited hero photo for a city row (row.imagery.hero), a country (country.imagery.hero) or any key via
 * heroFor(reg, key) (reg.imagery.slots), or null — then the
 * renderer keeps its motif / calm cover and the page is unchanged. Vietnam never has one (refused at build).
 */
function heroFor(obj, key) {
  const im = obj && obj.imagery; if (!im) return null;
  if (key != null && im.slots) return im.slots[`hero:${key}`] || null;   // heroFor(reg, key): FE-B hubs/landing
  return im.hero || null;                                                 // heroFor(row) / heroFor(country)
}

/** The credited local photo for a record, or null. Closed places never get one (also refused at build). */
function photoFor(row, rec) {
  if (!row || !row.imagery || !rec || rec.closed) return null;
  return row.imagery.photos[rec.id] || null;
}

module.exports = { build, motifSvg, motifOf, MOTIF_KIND, MOTIF_THEME, photoFor, heroFor, figureHtml: photos.figureHtml, heroHtml: photos.heroHtml, heroPreload: photos.heroPreload, heroCreditHtml: photos.heroCreditHtml, collectionKind };
