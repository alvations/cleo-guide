'use strict';
/**
 * render/recognition-ui.js (FE-C, W9-1): the recognition badges on a place card and in its detail, from platform's data
 * only (lib/recognition.js → rec.rec = {award: [srcIds], video: [srcIds], cited: n}). Nothing is derived here: a badge
 * exists exactly when the data says so, and each one links to its source (#src=<id>), or, for "Cited by n sources", to
 * the place's detail, where every source is listed. A closed place carries none on its card (never a live
 * recommendation); its detail shows them under "Before it closed" (client/sheet.js FE-C hook reads the hidden copy).
 * The card carries compact attributes only (attr()); client/recognition.js draws the row. data-rec feeds the lens.
 * ON gates the whole layer, so it can land switched off.
 */
const { esc } = require('../html');
const { t: tr } = require('../i18n');

const ON = true;
const KINDS = ['award', 'video', 'cited'];

/** The kinds a record has, in a fixed order ([] when none, or when switched off). */
const kinds = r => (ON && r.rec ? KINDS.filter(k => r.rec[k] && (k === 'cited' ? r.rec.cited >= 3 : r.rec[k].length)) : []);

/** The card's recognition, as compact attributes (the page-weight budget: no badge markup is sent). client/recognition.js
 *  draws the badge row from them: data-rec = the kinds (open places; the "Recognised" lens filters on it), data-rec0 = the
 *  same for a closed place (its detail only), data-ra / data-rv = the award / creator-video source ids. "Cited by n" is
 *  the card's own data-src count (platform's rec.cited is exactly that, n ≥ 3). '' when there is nothing. */
function attr(r) {
  const k = kinds(r); if (!k.length) return '';
  return [`data-rec${r.closed ? '0' : ''}="${k.join(' ')}"`, (r.rec.award || []).length && `data-ra="${esc(r.rec.award.join(' '))}"`,
    (r.rec.video || []).length && `data-rv="${esc(r.rec.video.join(' '))}"`].filter(Boolean).join(' ');
}
/** Server-side badge markup: none (drawn in the browser, see attr()). Kept as a no-op so the card hook stays one line. */
function html() { return ''; }

/** The tray fieldset and the rail tile (render/city.js FE-C hooks); '' when the page has no badges. */
function trayPills(recs, pill) {
  if (!ON || !recs.some(r => kinds(r).length && !r.closed)) return '';
  const has = k => recs.some(r => !r.closed && kinds(r).includes(k));
  return [has('award') && pill('rec', 'award', tr('rec.f.award')), has('video') && pill('rec', 'video', tr('rec.f.video')), has('cited') && pill('rec', 'cited', tr('rec.f.cited'))].filter(Boolean).join('');
}
function railTile(recs) {
  if (!ON || !recs.some(r => kinds(r).length && !r.closed)) return '';
  return `<button type="button" class="rail-i door" data-rec="any" aria-pressed="false"><svg class="ico" aria-hidden="true"><use href="#i-seal"/></svg><span class="k">${esc(tr('rec.tile.k'))}</span><span class="t">${esc(tr('rec.tile.t'))}</span><span class="d">${esc(tr('rec.tile.d'))}</span></button>`;
}

/** en strings this module renders (merged into tools/beta/i18n/en.json with their ja; see tools/beta/i18n-fec/). */
const EN = {
  'rec.label': 'Recognition',
  'rec.award': 'Award · {src}',
  'rec.video': 'Creator video · {src}',
  'rec.cited': 'Cited by {n} sources',
  'rec.before': 'Before it closed:',
  'rec.f.award': 'Has an award',
  'rec.f.video': 'Has a creator video',
  'rec.f.cited': 'Cited by 3 or more sources',
  'rec.tile.k': 'Recognised',
  'rec.tile.t': 'Awards and much-cited places',
  'rec.tile.d': 'From the sources we hold',
};

module.exports = { ON, kinds, attr, html, trayPills, railTile, EN };
