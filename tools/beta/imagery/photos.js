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
 *
 * Wikimedia Commons (W7): rows from tools/beta/imagery/fetch-commons.js carry `provider: "wikimedia-commons"` (the
 * source must then be a commons.wikimedia.org File: page) and may carry `variants: [{file, width, height}]` — smaller
 * sizes of the SAME credited image for srcset. A variant is covered by its row's credit; it must exist, be a bare
 * image name and appear in no other row. The figure then carries srcset + sizes; hero slots render eagerly
 * (heroHtml), cards lazily.
 */
const fs = require('fs');
const path = require('path');

const PHOTO_DIR = 'assets/img/photos';                       // relative to beta/
const CREDITS = 'assets/img/CREDITS.json';
const EXT = /\.(jpe?g|png|webp)$/i;
const REQUIRED = ['file', 'sourceUrl', 'author', 'licence', 'licenceUrl', 'depicts'];   // + record or slot
/** Free licences only (CC0, public domain, CC BY, CC BY-SA, any version). NC / ND are refused. */
const LICENCE_OK = /^(CC0(?: 1\.0)?|Public domain|PD(?:-[\w.-]+)?|CC BY(?:-SA)? \d\.\d(?: [A-Z]{2,3})?|Copyrighted free use|No known copyright restrictions|Unsplash License)$/i;
const UNSPLASH_LICENCE_URL = 'https://unsplash.com/license';
const FLICKR_NKCR_URL = 'https://www.flickr.com/commons/usage/';   // Flickr's "No known copyright restrictions" (The Commons) statement
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
  licence: 'short licence name: CC0 1.0 | Public domain | CC BY 4.0 | CC BY-SA 4.0 (… any version; NC/ND refused) | Copyrighted free use | Unsplash License',
  licenceUrl: 'https URL of the licence deed',
  modified: 'optional: what you changed ("cropped", "resized") — BY-SA adaptations stay BY-SA',
  width: 'optional: pixel width (read from the file when omitted)',
  height: 'optional: pixel height (read from the file when omitted)',
  variants: 'optional: [{ file, width, height }] — smaller sizes of the same image for srcset (same credit; e.g. the 480 px copy of a 960 px file)',
  provider: 'optional: "wikimedia-commons" | "flickr" | "unsplash" — who hosts the source page (Commons rows must link a commons.wikimedia.org File: page; Flickr rows a flickr.com/photos/<user>/<id> page and the author\'s profile as authorUrl)',
  authorUrl: 'optional (required for Flickr): https URL of the author\'s profile — the credit links the author',
  color: 'optional: the photo\'s dominant colour "#rrggbb" (recompress.js) — a fade-in placeholder behind the image; exposed as photo.color',
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

/** beta-root-relative srcset string ("assets/img/photos/x-480.jpg 480w, …"), or '' with no variants. */
const srcsetStr = set => set.length > 1 ? set.map(x => `${x.src} ${x.w}w`).join(', ') : '';
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
  if (c.variants != null) {
    if (!Array.isArray(c.variants)) p.push('variants must be an array of {file, width, height}');
    else c.variants.forEach((v, i) => {
      if (!v || typeof v !== 'object' || !v.file || !EXT.test(v.file) || /[\\/]/.test(v.file)) p.push(`variants[${i}] must have a bare .jpg/.png/.webp file name`);
      else if (v.file === c.file) p.push(`variants[${i}] repeats the main file`);
      if (v && (v.width != null || v.height != null) && !(+v.width > 0 && +v.height > 0)) p.push(`variants[${i}] width/height must be positive numbers`);
    });
  }
  if (c.provider === 'wikimedia-commons' && c.sourceUrl && !/^https:\/\/commons\.wikimedia\.org\/wiki\/File:[^\s]+$/.test(c.sourceUrl)) p.push('a Wikimedia Commons row needs its commons.wikimedia.org/wiki/File: page as sourceUrl');
  if (c.provider === 'flickr') {   // R8: Flickr Creative Commons via Openverse / the Flickr API (fetch-flickr.js)
    if (c.sourceUrl && !/^https:\/\/(?:www\.)?flickr\.com\/photos\/[^\s/]+\/\d+\/?$/.test(c.sourceUrl)) p.push('a Flickr row needs its flickr.com/photos/<user>/<id> page as sourceUrl');
    if (!c.authorUrl || !/^https:\/\/(?:www\.)?flickr\.com\/(?:photos|people)\/[^\s/]+\/?$/.test(c.authorUrl)) p.push('a Flickr row needs the author\'s flickr.com/photos/<user> profile as authorUrl');
    if (isUnsplash(c)) p.push('a Flickr row cannot carry the Unsplash License');
  }
  if (/^No known copyright restrictions$/i.test(String(c.licence || '').trim()) && (c.provider !== 'flickr' || c.licenceUrl !== FLICKR_NKCR_URL)) p.push(`"No known copyright restrictions" is a Flickr Commons statement: provider flickr and licenceUrl ${FLICKR_NKCR_URL}`);
  if (isUnsplash(c)) {
    if (c.licenceUrl !== UNSPLASH_LICENCE_URL) p.push(`Unsplash License needs licenceUrl ${UNSPLASH_LICENCE_URL}`);
    if (c.sourceUrl && !/^https:\/\/unsplash\.com\/photos\/[^\s/]+/.test(c.sourceUrl)) p.push('Unsplash License needs an unsplash.com/photos/… sourceUrl');
  }
  return p;
}

/**
 * Load and gate every photo. `pages` maps page key → { country, recs } (the beta model).
 * Returns { byPage: {pageKey: {placeId: photo}}, bySlot: {"hero:key" | "cover:key": photo}, credits, errors }
 * where photo = {file, src, w, h, widths: [{src, w, h}], srcset: "src 480w, src 960w" | '', credit} (paths beta-relative).
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
  /** srcset entries for a row's variants (+ the main size), smallest first; null + an error when one is unusable. */
  const sizesOf = (c, where, main) => {
    const set = [];
    for (const v of c.variants || []) {
      if (!files.includes(v.file)) { errors.push(`${where}: variant ${v.file} — no such file in beta/${PHOTO_DIR}/`); return null; }
      const sz = (v.width && v.height) ? { w: +v.width, h: +v.height } : imageSize(fs.readFileSync(path.join(dir, v.file)));
      if (!sz || !sz.w || !sz.h) { errors.push(`${where}: cannot read the size of variant ${v.file} — add width and height`); return null; }
      set.push({ src: `${PHOTO_DIR}/${v.file}`, w: sz.w, h: sz.h });
    }
    if (!set.length) return [];
    set.push({ src: `${PHOTO_DIR}/${c.file}`, w: main.w, h: main.h });
    return set.sort((a, b) => a.w - b.w);
  };
  credits.forEach((c, i) => {
    const where = `${CREDITS} credits[${i}]${c && c.file ? ` (${c.file})` : ''}`;
    const p = creditProblems(c || {});
    if (c && c.file && byFile.has(c.file)) p.push('duplicate credit for this file');
    for (const v of (c && Array.isArray(c.variants) ? c.variants : [])) if (v && v.file && byFile.has(v.file)) p.push(`variant ${v.file} is already credited by another row`);
    if (p.length) { errors.push(`${where}: ${p.join('; ')}`); return; }
    byFile.set(c.file, c);
    for (const v of c.variants || []) byFile.set(v.file, c);
    if (!files.includes(c.file)) { errors.push(`${where}: no such file in beta/${PHOTO_DIR}/`); return; }
    if (c.slot) {
      if (vietnamSlot(c.slot)) { errors.push(`${where}: Vietnam has no freedom of panorama — no Vietnam hub hero photo`); return; }
      const sk = `${c.slot.type}:${c.slot.key}`, buf = fs.readFileSync(path.join(dir, c.file));
      const size = (c.width && c.height) ? { w: +c.width, h: +c.height } : imageSize(buf);
      if (!size || !size.w || !size.h) { errors.push(`${where}: cannot read the image size — add width and height`); return; }
      if (bySlot[sk]) { errors.push(`${where}: ${sk} already has a photo`); return; }
      const set = sizesOf(c, where, size); if (!set) return;
      bySlot[sk] = { file: c.file, src: `${PHOTO_DIR}/${c.file}`, w: size.w, h: size.h, widths: set, srcset: srcsetStr(set), color: /^#[0-9a-f]{6}$/i.test(c.color || '') ? c.color : null, credit: c };
      return;
    }
    const pg = pages[c.record.page];
    const rec = pg && pg.recs.find(x => x.id === c.record.id);
    if (!rec) { errors.push(`${where}: record ${c.record.page}#${c.record.id} is not on that beta page`); return; }
    if (rec.closed) { errors.push(`${where}: ${c.record.id} is closed — a closed place never gets a photo implying "go here today"`); return; }
    if (pg.country === 'vietnam') { errors.push(`${where}: Vietnam has no freedom of panorama — no photos of Vietnamese places`); return; }
    // D-49 (2026-10-17): a food place may carry a photo of THAT place (exterior, interior or a dish photographed there),
    // identified by the file's title, description, category or geotag — never generic stock
    if (rec.kind === 'food') {
      if (isUnsplash(c) || !['wikimedia-commons', 'flickr', 'openverse'].includes(c.provider)) { errors.push(`${where}: D-49 — a food place's photo must come from a source page that identifies the place (Commons, Flickr, Openverse), never stock`); return; }
      if (!String(c.identifies || c.matched || '').trim()) { errors.push(`${where}: D-49 — a food place's photo must record how it identifies ${c.record.id} (identifies: the title/description/category/geotag that names it)`); return; }
    }
    const buf = fs.readFileSync(path.join(dir, c.file));
    const size = (c.width && c.height) ? { w: +c.width, h: +c.height } : imageSize(buf);
    if (!size || !size.w || !size.h) { errors.push(`${where}: cannot read the image size — add width and height`); return; }
    const page = (byPage[c.record.page] = byPage[c.record.page] || {});
    if (page[c.record.id]) { errors.push(`${where}: ${c.record.id} already has a photo`); return; }
    const set = sizesOf(c, where, size); if (!set) return;
    page[c.record.id] = { file: c.file, src: `${PHOTO_DIR}/${c.file}`, w: size.w, h: size.h, widths: set, srcset: srcsetStr(set), color: /^#[0-9a-f]{6}$/i.test(c.color || '') ? c.color : null, credit: c };
  });
  for (const f of files) {
    if (!EXT.test(f)) errors.push(`beta/${PHOTO_DIR}/${f}: not an image this pipeline accepts (.jpg/.png/.webp)`);
    else if (!byFile.has(f) && !credits.some(c => c && c.file === f)) errors.push(`beta/${PHOTO_DIR}/${f}: photo has no credit row in ${CREDITS} — uncredited photos are refused`);
  }
  return { byPage, bySlot, credits, errors };
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/**
 * Visible TASL caption (title, author, source, licence) — the credit is shown wherever the photo is.
 * Default: the short card line `Photo: <author> · <licence> · <source> (resized)`; the file title rides as the
 * source link's title attribute and accessible name (CC 2.x/3.0 ask for the title when supplied), the licence
 * and source stay links; the source link is the Commons File: page, which carries the full TASL record. opts.full: the whole sentence
 * (“Title” by Author, licence, via source — what was changed) for a place detail view.
 */
function captionHtml(c, opts = {}) {
  if (isUnsplash(c)) {   // the credit line the Unsplash guidelines ask for, plus the licence link
    const who = c.authorUrl && httpsUrl(c.authorUrl) ? `<a href="${esc(c.authorUrl)}" rel="noopener" target="_blank">${esc(c.author)}</a>` : esc(c.author);
    return `Photo by ${who} on <a href="${esc(c.sourceUrl)}" rel="noopener" target="_blank">Unsplash</a> · <a href="${esc(c.licenceUrl)}" rel="license noopener" target="_blank">${esc(c.licence)}</a>${c.modified ? ` — ${esc(c.modified)}` : ''}`;
  }
  const title = c.title || c.depicts;
  const lic = `<a href="${esc(c.licenceUrl)}" rel="license noopener" target="_blank">${esc(c.licence)}</a>`;
  if (opts.full) return `“${esc(title)}” by ${c.provider === 'flickr' && c.authorUrl && httpsUrl(c.authorUrl) ? `<a href="${esc(c.authorUrl)}" rel="noopener" target="_blank">${esc(c.author)}</a>` : esc(c.author)}, ${lic}, via <a href="${esc(c.sourceUrl)}" rel="noopener" target="_blank">${esc(hostOf(c.sourceUrl))}</a>${c.modified ? ` — ${esc(c.modified)}` : ''}`;
  // CC BY / BY-SA ask only that changes be indicated: "(resized)" for the pipeline's size copies, else the note as written
  // a derivative's second creator stays named in the short line too ("derivative work by O.J.")
  const deriv = (/derivative work by ([^;]+)/i.exec(c.modified || '') || [])[1];
  const changed = !c.modified ? '' : /^resized\b/i.test(c.modified) ? ` (resized${deriv ? `; derivative work by ${esc(deriv.trim())}` : ''})` : ` (${esc(c.modified)})`;
  const who = c.provider === 'flickr' && c.authorUrl && httpsUrl(c.authorUrl) ? `<a href="${esc(c.authorUrl)}" rel="noopener" target="_blank">${esc(c.author)}</a>` : esc(c.author);   // Flickr: the author links their profile
  return `Photo: ${who} · ${lic} · <a href="${esc(c.sourceUrl)}" aria-label="“${esc(title)}” on ${esc(hostOf(c.sourceUrl))}" rel="noopener" target="_blank">${esc(hostOf(c.sourceUrl))}</a>${changed}`;
}
function hostOf(u) { const m = /^https:\/\/(?:www\.)?([^/]+)/i.exec(u); return m ? m[1].replace(/^commons\.wikimedia\.org$/, 'Wikimedia Commons').replace(/^flickr\.com$/, 'Flickr') : 'source'; }

/** Default `sizes` for a card photo: one inset column on phones, two on tablets, a quarter of the page on desktop grids.
 *  Pass opts.sizes to figureHtml for anything smaller (thumbnails, carousels). */
// A ≥ 2.5 dppx phone takes the 500 w copy for a card (≈ 1.5 image px per CSS px; platform W8, R7 gap 7: Tokyo phone
// first load 930 → 609 KB); 2× phones, tablets, desktop and heroes are unchanged.
const CARD_SIZES = '(min-resolution: 2.5dppx) and (max-width: 1023px) 166px, (max-width: 639px) 92vw, (max-width: 1023px) 45vw, 25vw';
// D-40 (QA-ratified condition, platform): a card whose largest copy is 720w (500w + 720w, non-first-screen cards) asks for
// 240px on a 3× phone, so it resolves to the 720w copy — a true 2× cap. Cards with a 960w copy (lead, first row) keep the
// 166px clause (the 500w copy), which holds the Tokyo phone first load ≤ 700 KB.
const CARD_SIZES_720 = CARD_SIZES.replace('(max-width: 1023px) 166px,', '(max-width: 1023px) 240px,');
// D-40a (imagery, approved 2026-10-16): any card with a ~720w copy (600–799 w: the weight cap scales some to 640–799) caps
// 3× phones at 240px so they take it, even when a 960 also exists (lead/first-row cards: 500 + 720 + 960). 1×/2× and desktop
// resolve as before; the detail slot passes its own opts.sizes (→ 960).
const cardSizes = photo => ((photo.widths || []).some(x => x.w >= 600 && x.w < 800) ? CARD_SIZES_720 : CARD_SIZES);
/** srcset + sizes attributes when the photo has size variants (else ''). */
function srcsetAttr(photo, up, sizes) {
  const set = photo.widths || [];
  return set.length > 1 ? ` srcset="${set.map(s => `${esc(up + s.src)} ${s.w}w`).join(', ')}" sizes="${esc(sizes)}"` : '';
}
/**
 * The <figure> a renderer drops in for a gated photo. `up` = path back to beta/ root. Cards: lazy, below the fold.
 * opts.sizes overrides the srcset sizes; opts.eager (heroes) loads it at once with fetchpriority=high.
 */
function figureHtml(photo, up = '', cls = 'photo', opts = {}) {
  // opts.preloaded (platform W7): lazy, so a hidden hero (Atlas) is never fetched; heroPreload() fetches it early otherwise
  const c = photo.credit, load = opts.preloaded ? ' loading="lazy" fetchpriority="high"' : opts.eager ? ' fetchpriority="high"' : ' loading="lazy"';
  return `<figure class="${cls}"><img src="${esc(up + photo.src)}"${srcsetAttr(photo, up, opts.sizes || cardSizes(photo))} width="${photo.w}" height="${photo.h}" alt="${esc(c.depicts)}"${load} decoding="async"><figcaption>${captionHtml(c)}</figcaption></figure>`;
}
/**
 * A hero photo (city masthead, country hub): a full-bleed cover behind the headline, eager (it is above the fold).
 * Self-contained inline styles so it needs no stylesheet change and sits on any ground. A scrim in the hero's ground
 * colour (--hero-scrim, default --night) keeps the headline and facts at AA over any photo: dense behind the text column
 * on the left, lighter on the right where the photo shows. The credit is NOT laid over the photo (it collided with the
 * facts and buttons): heroCreditHtml() is a visible line in the text flow, under the actions. Rendered ONLY when a
 * credited hero slot exists — otherwise the page is byte-identical.
 */
const HERO_SIZES = '(min-width: 1024px) 50vw, 100vw';
function heroHtml(photo, up = '', cls = 'photo hero-photo', opts = {}) {
  // an in-flow media slot (e.g. FE-B's hub 'photo hero-media'): eager, sized, with its TASL figcaption
  if (cls !== 'photo hero-photo') return figureHtml(photo, up, cls, Object.assign({ eager: true, sizes: HERO_SIZES }, opts));
  const g = 'var(--hero-scrim,var(--night,#14161c))';
  const scrim = `<span class="hero-scrim" aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(90deg,color-mix(in srgb,${g} 90%,transparent) 0,color-mix(in srgb,${g} 78%,transparent) 45%,color-mix(in srgb,${g} 38%,transparent) 100%)"></span>`;
  const c = photo.credit;
  return `<figure class="${cls}" style="position:absolute;inset:0;margin:0;z-index:-2;border-radius:0">` +
    `<img style="width:100%;height:100%;object-fit:cover;display:block" src="${esc(up + photo.src)}"${srcsetAttr(photo, up, '100vw')} width="${photo.w}" height="${photo.h}" alt="${esc(c.depicts)}" fetchpriority="high" decoding="async">${scrim}</figure>`;
}
/**
 * Platform W7: an inline <head> script (emit it after the view boot script) that preloads a hero rendered with { preloaded: true } (lazy), at high priority,
 * unless the page opens in `skipView` (the hash view=, else the stored preference), where the hero is hidden and must
 * not be fetched. Same srcset/sizes as the <img>, so the browser reuses the preloaded response. No document.write.
 */
function heroPreload(photo, up = '', sizes = HERO_SIZES, skipView = 'atlas') {
  const set = (photo.widths || []).map(s => `${up + s.src} ${s.w}w`).join(', ');
  const j = x => JSON.stringify(x).replace(/</g, '\\u003c');
  // the page's view boot script (city.js viewHead) has already set html[data-view]; fall back to hash, then storage
  return `<script>(function(){var v=document.documentElement.getAttribute('data-view')||(/[#&]view=([a-z]+)/.exec(location.hash)||[])[1];if(!v){try{v=JSON.parse(localStorage.getItem('cleo:v1:view'))}catch(e){}}` +
    `if(v===${j(skipView)})return;var l=document.createElement('link');l.rel='preload';l.setAttribute('as','image');l.href=${j(up + photo.src)};` +
    (set ? `l.setAttribute('imagesrcset',${j(set)});l.setAttribute('imagesizes',${j(sizes)});` : '') +
    `l.setAttribute('fetchpriority','high');document.head.appendChild(l)})()</script>`;
}
/** The hero photo's visible TASL credit, one small line in the text flow (inherits the hero's text colour). */
function heroCreditHtml(photo) {
  const cap = captionHtml(photo.credit);
  return `<p class="hero-credit" style="margin:12px 0 0;font-size:12px;line-height:1.45;opacity:.8;max-width:70ch">${/^Photo/.test(cap) ? '' : 'Photo: '}${cap.replace(/<a /g, '<a style="color:inherit" ')}</p>`;
}

module.exports = { loadPhotos, creditProblems, figureHtml, heroHtml, heroPreload, HERO_SIZES, heroCreditHtml, captionHtml, imageSize, SCHEMA, PHOTO_DIR, CREDITS, LICENCE_OK, CARD_SIZES, CARD_SIZES_720, cardSizes };
