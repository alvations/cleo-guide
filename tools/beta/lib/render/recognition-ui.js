'use strict';
/**
 * render/recognition-ui.js (FE-C, W9-1): the recognition badges on a place card and in its detail, from platform's data
 * only (lib/recognition.js → rec.rec = {award: [srcIds], video: [srcIds], cited: n}). Nothing is derived here: a badge
 * exists exactly when the data says so, and each one links to its source (#src=<id>), or, for "Cited by n sources", to
 * the place's detail, where every source is listed. A closed place carries none on its card (never a live
 * recommendation); its detail shows them under "Before it closed" (client/sheet.js FE-C hook reads the hidden copy).
 * The card gains data-rec="award video cited" (open places only) for the "Recognised" lens (client/city.js FE-C hook).
 * ON gates the whole layer, so it can land switched off.
 */
const { esc } = require('../html');
const { t: tr } = require('../i18n');

const ON = true;
const KINDS = ['award', 'video', 'cited'];

/** The kinds a record has, in a fixed order ([] when none, or when switched off). */
const kinds = r => (ON && r.rec ? KINDS.filter(k => r.rec[k] && (k === 'cited' ? r.rec.cited >= 3 : r.rec[k].length)) : []);

/** data-rec="…" for the card's attribute list (open places only), or ''. */
function attr(r) { const k = kinds(r); return k.length && !r.closed ? `data-rec="${k.join(' ')}"` : ''; }

/** The badge row: one link per award / video source, one "Cited by n sources" link. '' when there are none. */
function html(r, srcById) {
  const k = kinds(r); if (!k.length) return '';
  const name = id => String((srcById[id] || { name: id }).name || id).split(' · ')[0];
  const out = [];
  for (const id of (r.rec.award || [])) out.push(`<a class="rb rb-award" href="#src=${esc(id)}">${esc(tr('rec.award', { src: name(id) }))}</a>`);
  for (const id of (r.rec.video || [])) out.push(`<a class="rb rb-video" href="#src=${esc(id)}">${esc(tr('rec.video', { src: name(id) }))}</a>`);
  if (r.rec.cited >= 3) out.push(`<a class="rb rb-cited" href="#p=${encodeURIComponent(r.id)}">${esc(tr('rec.cited', { n: r.rec.cited }))}</a>`);
  // a closed place: kept for the detail only (hidden on the card), labelled as history
  return r.closed ? `<p class="pl-rec closed" hidden><span class="lbl">${esc(tr('rec.before'))}</span> ${out.join(' ')}</p>`
    : `<p class="pl-rec"><span class="vh">${esc(tr('rec.label'))}</span> ${out.join(' ')}</p>`;
}

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
