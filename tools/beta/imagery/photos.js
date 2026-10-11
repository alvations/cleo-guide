'use strict';
/**
 * imagery/photos.js — the credit gate for real photographs (lane: imagery).
 *
 * A photo appears on a beta card or hero ONLY when BOTH exist:
 *   1. a local file under beta/assets/img/photos/ (never hotlinked), and
 *   2. a COMPLETE TASL row for it in beta/assets/img/CREDITS.json (title/depicts, author, source, licence + URL),
 * and the record it depicts is on the page, open (a closed place never gets a "go here today" photo) and not in
 * Vietnam (no freedom of panorama). Anything else renders the motif / typographic plate instead.
 *
 * The build REFUSES (errors) on: a photo file with no credit row, a credit row whose file is missing, an incomplete
 * or non-free licence, a credit whose record is not on its page, or a credit on a closed / Vietnam record.
 * test-imagery.js runs the same checks so `npm test` fails on any uncredited photo.
 *
 * Unsplash (2026-10-11): the Unsplash License is accepted when the licence URL is https://unsplash.com/license and
 * the source is an unsplash.com photo page; the caption then reads "Photo by <name> on Unsplash". A row may carry
 * `slot: {type: hero|cover, key}` instead of `record` for a hub hero or a generic collection cover — same TASL and
 * file checks, exposed as `bySlot`, never attached to a card. Rows come from tools/beta/imagery/fetch-unsplash.js.
 */
const fs = require('fs');
const path = require('path');

const PHOTO_DIR = 'assets/img/photos';                       // relative to beta/
const CREDITS = 'assets/img/CREDITS.json';
const EXT = /\.(jpe?g|png|webp)$/i;
const REQUIRED = ['file', 'sourceUrl', 'author', 'licence', 'licenceUrl', 'depicts'];   // + record or slot
/** Free licences only (CC0, public domain, CC BY, CC BY-SA, any version). NC / ND are refused. */
const LICENCE_OK = /^(CC0(?: 1\.0)?|Public domain|PD(?:-[\w.-]+)?|CC BY(?:-SA)? \d\.\d(?: [A-Z]{2,3})?|Unsplash License)$/i;
const UNSPLASH_LICENCE_URL = 'https://unsplash.com/license';
const SLOT_TYPES = ['hero', 'cover'];
const LICENCE_BAD = /\b(NC|ND)\b|non-?commercial|no-?deriv/i;

const SCHEMA = {
  file: 'file name inside beta/assets/img/photos/ (e.g. "tokyo--senso-ji-960.webp")',
  record: '{ page: beta page key (e.g. "tokyo"), id: stable place id (e.g. "senso-ji") } — the place the photo depicts',
  slot: 'instead of record, for a hub hero or a generic collection cover: { type: "hero" | "cover", key: page/country or collection key }',
  title: 'optional: the work\'s title as on its source page (defaults to depicts)',
  depicts: 'what the photo shows, in words ("Sensō-ji main hall from the Hōzōmon gate")',
  author: 'the creator exactly as the source credits them',
  sourceUrl: 'https URL of the file\'s own page (e.g. its Wikimedia Commons file page)',
  licence: 'short licence name: CC0 1.0 | Public domain | CC BY 4.0 | CC BY-SA 4.0 (… any version; NC/ND refused) | Unsplash License',
  licenceUrl: 'https URL of the licence deed',
  modified: 'optional: what you changed ("cropped", "resized") — BY-SA adaptations stay BY-SA',
  width: 'optional: pixel width (read from the file when omitted)',
  height: 'optional: pixel height (read from the file when omitted)',
};

/** Pixel size of a PNG / JPEG / WebP from its header; null if unknown (then the credit must carry width/height). */
function imageSize(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504E47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf.length > 4 && buf[0] === 0xFF && buf[1] === 0xD8) {
    for (let i = 2; i + 9 < buf.length;) {
      if (buf[i] !== 0xFF) { i++; continue; }
      const m = buf[i + 1], len = buf.readUInt16BE(i + 2);
      if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  if (buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const k = buf.toString('ascii', 12, 16);
    if (k === 'VP8X') return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
    if (k === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3FFF, h: buf.readUInt16LE(28) & 0x3FFF };
    if (k === 'VP8L') { const b = buf.readUInt32LE(21); return { w: (b & 0x3FFF) + 1, h: ((b >> 14) & 0x3FFF) + 1 }; }
  }
  return null;
}

const httpsUrl = u => /^https:\/\/[^\s]+$/i.test(String(u || ''));
const isUnsplash = c => /^Unsplash License$/i.test(String(c.licence || '').trim());
/** A hub hero for Vietnam would show Vietnamese places (no freedom of panorama): refused like a Vietnamese record. */
const vietnamSlot = s => s.type === 'hero' && /^vietnam(\/|$)/.test(String(s.key));

/** Problems with one credit row (empty array = complete). Pure — no disk access. */
function creditProblems(c) {
  const p = [];
  for (const k of REQUIRED) if (c[k] == null || (typeof c[k] === 'string' && !c[k].trim())) p.push(`missing ${k}`);
  if (!c.record && !c.slot) p.push('missing record');
  if (c.record && c.slot) p.push('a credit has a record or a slot, not both');
  if (c.record && (typeof c.record !== 'object' || !c.record.page || !c.record.id)) p.push('record must be {page, id}');
  if (c.slot && (typeof c.slot !== 'object' || !SLOT_TYPES.includes(c.slot.type) || !c.slot.key)) p.push('slot must be {type: hero|cover, key}');
  if (c.file && (!EXT.test(c.file) || /[\\/]/.test(c.file))) p.push('file must be a bare .jpg/.png/.webp name inside photos/');
  if (c.sourceUrl && !httpsUrl(c.sourceUrl)) p.push('sourceUrl must be https');
  if (c.licenceUrl && !httpsUrl(c.licenceUrl)) p.push('licenceUrl must be https');
  if (c.licence && (LICENCE_BAD.test(c.licence) || !LICENCE_OK.test(String(c.licence).trim()))) p.push(`licence "${c.licence}" is not CC0 / PD / CC BY / CC BY-SA / Unsplash License`);
  if (isUnsplash(c)) {
    if (c.licenceUrl !== UNSPLASH_LICENCE_URL) p.push(`Unsplash License needs licenceUrl ${UNSPLASH_LICENCE_URL}`);
    if (c.sourceUrl && !/^https:\/\/unsplash\.com\/photos\/[^\s/]+/.test(c.sourceUrl)) p.push('Unsplash License needs an unsplash.com/photos/… sourceUrl');
  }
  return p;
}

/**
 * Load and gate every photo. `pages` maps page key → { country, recs } (the beta model).
 * Returns { byPage: {pageKey: {placeId: photo}}, bySlot: {"hero:key" | "cover:key": photo}, credits, errors }
 * where photo = {file, src, w, h, credit}.
 */
function loadPhotos(betaDir, pages) {
  const errors = [], byPage = {}, bySlot = {};
  const dir = path.join(betaDir, PHOTO_DIR), credPath = path.join(betaDir, CREDITS);
  let credits = [];
  if (fs.existsSync(credPath)) {
    try { const j = JSON.parse(fs.readFileSync(credPath, 'utf8')); credits = Array.isArray(j.credits) ? j.credits : (errors.push(`${CREDITS}: "credits" must be an array`), []); }
    catch (e) { errors.push(`${CREDITS}: not valid JSON (${e.message})`); }
  }
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => !f.startsWith('.') && f !== 'README.md') : [];
  const byFile = new Map();
  credits.forEach((c, i) => {
    const where = `${CREDITS} credits[${i}]${c && c.file ? ` (${c.file})` : ''}`;
    const p = creditProblems(c || {});
    if (c && c.file && byFile.has(c.file)) p.push('duplicate credit for this file');
    if (p.length) { errors.push(`${where}: ${p.join('; ')}`); return; }
    byFile.set(c.file, c);
    if (!files.includes(c.file)) { errors.push(`${where}: no such file in beta/${PHOTO_DIR}/`); return; }
    if (c.slot) {
      if (vietnamSlot(c.slot)) { errors.push(`${where}: Vietnam has no freedom of panorama — no Vietnam hub hero photo`); return; }
      const sk = `${c.slot.type}:${c.slot.key}`, buf = fs.readFileSync(path.join(dir, c.file));
      const size = (c.width && c.height) ? { w: +c.width, h: +c.height } : imageSize(buf);
      if (!size || !size.w || !size.h) { errors.push(`${where}: cannot read the image size — add width and height`); return; }
      if (bySlot[sk]) { errors.push(`${where}: ${sk} already has a photo`); return; }
      bySlot[sk] = { file: c.file, src: `${PHOTO_DIR}/${c.file}`, w: size.w, h: size.h, credit: c };
      return;
    }
    const pg = pages[c.record.page];
    const rec = pg && pg.recs.find(x => x.id === c.record.id);
    if (!rec) { errors.push(`${where}: record ${c.record.page}#${c.record.id} is not on that beta page`); return; }
    if (rec.closed) { errors.push(`${where}: ${c.record.id} is closed — a closed place never gets a photo implying "go here today"`); return; }
    if (pg.country === 'vietnam') { errors.push(`${where}: Vietnam has no freedom of panorama — no photos of Vietnamese places`); return; }
    const buf = fs.readFileSync(path.join(dir, c.file));
    const size = (c.width && c.height) ? { w: +c.width, h: +c.height } : imageSize(buf);
    if (!size || !size.w || !size.h) { errors.push(`${where}: cannot read the image size — add width and height`); return; }
    const page = (byPage[c.record.page] = byPage[c.record.page] || {});
    if (page[c.record.id]) { errors.push(`${where}: ${c.record.id} already has a photo`); return; }
    page[c.record.id] = { file: c.file, src: `${PHOTO_DIR}/${c.file}`, w: size.w, h: size.h, credit: c };
  });
  for (const f of files) {
    if (!EXT.test(f)) errors.push(`beta/${PHOTO_DIR}/${f}: not an image this pipeline accepts (.jpg/.png/.webp)`);
    else if (!byFile.has(f) && !credits.some(c => c && c.file === f)) errors.push(`beta/${PHOTO_DIR}/${f}: photo has no credit row in ${CREDITS} — uncredited photos are refused`);
  }
  return { byPage, bySlot, credits, errors };
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Visible TASL caption (title, author, source, licence) — the credit is shown wherever the photo is. */
function captionHtml(c) {
  if (isUnsplash(c)) {   // the credit line the Unsplash guidelines ask for, plus the licence link
    const who = c.authorUrl && httpsUrl(c.authorUrl) ? `<a href="${esc(c.authorUrl)}" rel="noopener" target="_blank">${esc(c.author)}</a>` : esc(c.author);
    return `Photo by ${who} on <a href="${esc(c.sourceUrl)}" rel="noopener" target="_blank">Unsplash</a> · <a href="${esc(c.licenceUrl)}" rel="license noopener" target="_blank">${esc(c.licence)}</a>${c.modified ? ` — ${esc(c.modified)}` : ''}`;
  }
  const title = c.title || c.depicts;
  return `“${esc(title)}” by ${esc(c.author)}, <a href="${esc(c.licenceUrl)}" rel="license noopener" target="_blank">${esc(c.licence)}</a>, via <a href="${esc(c.sourceUrl)}" rel="noopener" target="_blank">${esc(hostOf(c.sourceUrl))}</a>${c.modified ? ` — ${esc(c.modified)}` : ''}`;
}
function hostOf(u) { const m = /^https:\/\/(?:www\.)?([^/]+)/i.exec(u); return m ? m[1].replace(/^commons\.wikimedia\.org$/, 'Wikimedia Commons') : 'source'; }

/** The <figure> a renderer drops in for a gated photo. `up` = path back to beta/ root. */
function figureHtml(photo, up = '', cls = 'photo') {
  const c = photo.credit;
  return `<figure class="${cls}"><img src="${esc(up + photo.src)}" width="${photo.w}" height="${photo.h}" alt="${esc(c.depicts)}" loading="lazy" decoding="async"><figcaption>${captionHtml(c)}</figcaption></figure>`;
}

module.exports = { loadPhotos, creditProblems, figureHtml, captionHtml, imageSize, SCHEMA, PHOTO_DIR, CREDITS, LICENCE_OK };
