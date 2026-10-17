#!/usr/bin/env node
/**
 * Beta QA — Wave 7 photo + credit honesty audit (static; QA lane). Independent of test-imagery.js.
 * For every row in beta/assets/img/CREDITS.json and every <img> of a photo in the built beta pages:
 *   · licence is free (CC0 / PD / CC BY / CC BY-SA, any version; or "Copyrighted free use", approved W8, linked to its
 *     Commons template), never NC/ND; Flickr rows (provider "flickr"): the flickr.com photo page, the author's profile
 *     link in the caption, CC0 / PDM / CC BY / CC BY-SA with the deed, NKCR only from a Flickr Commons institution;
 *   · no row whose review is not "ok" is rendered in any built page or data JSON; licenceUrl is the matching CC deed
 *   · sourceUrl is the commons.wikimedia.org File: page of commonsTitle; author is a clean name (no markup, no
 *     newline, no "User:", ≤ 60 chars, no licence text, no date)
 *   · the record is on its page, open, a sight (never food), not a venue (bar/shop/market/mall/hawker/theatre/arena/
 *     entertainment/nightlife tags), never Vietnam; a hero slot is never Vietnam
 *   · no Commons file (title or sha1) used by two rows; every file + variant exists
 *   · every photo <img> in the built pages sits in a figure whose caption credits the same row (author + licence
 *     link to licenceUrl + source link to the File: page), and no Vietnam page carries a photo
 *   · no hub hero photo file appears again as a card on the same page
 * Writes design/beta/eval/w7/qa/photos.json and contact.html (every hero + every card photo with its credit, for a
 * person to judge whether the photo truly shows the place).
 * Usage: cd tools && node beta/qa/w7-photos.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..'), BETA = path.join(ROOT, 'beta');
const OUT = path.join(ROOT, 'design', 'beta', 'eval', 'w7', 'qa'); fs.mkdirSync(OUT, { recursive: true });
const CR = JSON.parse(fs.readFileSync(path.join(BETA, 'assets/img/CREDITS.json'), 'utf8')).credits;
const PH = path.join(BETA, 'assets/img/photos');
const places = {}; for (const f of fs.readdirSync(path.join(BETA, 'data/places'))) { const d = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8')); places[d.key] = d; places[f.replace(/\.json$/, '')] = d; }
const R = { checks: [], rows: [] }; let fails = 0;
const check = (name, ok, ev) => { R.checks.push({ name, ok: ok === null ? null : !!ok, ev }); if (ok === false) fails++; console.log(`  ${ok === null ? 'INFO' : ok ? 'PASS' : 'FAIL'}  ${name}` + (ev !== undefined ? ' = ' + JSON.stringify(ev).slice(0, 400) : '')); };
const FREE = /^(CC0 1\.0|Public domain|CC BY(-SA)? \d\.\d( [A-Z]{2})?|Copyrighted free use)$/;   // "Copyrighted free use": approved W8 (IMAGERY.md), any use, no conditions   // a ported licence keeps its jurisdiction (e.g. "CC BY 3.0 US")
const VENUE = /\b(BAR|SHOP|SHOPPING|MARKET|MALL|HAWKER|THEATRE|THEATER|ARENA|ENTERTAINMENT|NIGHTLIFE|STADIUM|MUSIC|VENUE|CLUB)\b/;
const bad = { lic: [], src: [], author: [], food: [], venue: [], closed: [], vn: [], missing: [], flickr: [] };
// Flickr rows (imagery fetch-flickr.js, b4f78ca54; orchestrator 2026-10-17): the photo page, the author's profile link, a free
// licence with its deed; "No known copyright restrictions" only from a Flickr Commons institution account
const FLICKR_LIC = /^(CC0 1\.0|Public domain|CC BY(-SA)? \d\.\d)$/, NKCR = 'No known copyright restrictions', NKCR_URL = 'https://www.flickr.com/commons/usage/';
const isFlickr = c => c.provider === 'flickr';
// D-49 (imagery 92c822248): a food place may carry a photo of THAT place, from Commons, Flickr or Openverse only, with the
// source's identifying evidence recorded in `identifies`; never stock (Unsplash, Pexels, Pixabay), never a Wikipedia lead image
const FOOD_OK = ['wikimedia-commons', 'flickr', 'openverse'], STOCK = /unsplash|pexels|pixabay/i;
// Openverse (fetch-openverse.js, 65d2db931): provider "openverse" (museums, archives), or "wikimedia-commons" via openverse
const isOV = c => c.provider === 'openverse';
// D-50 / D-52 institutions (imagery sources/lib.js creditRow): library-of-congress, the-met, smithsonian, europeana
const INST = ['library-of-congress', 'the-met', 'smithsonian', 'europeana'], isInst = c => INST.includes(c.provider);
const isCommons = c => !c.provider || c.provider === 'wikimedia-commons';
const deedOk = c => { if (/^CC BY/.test(c.licence)) { const [, kind, ver] = /^CC (BY(?:-SA)?) (\d\.\d)/.exec(c.licence); return new RegExp('^https://creativecommons\\.org/licenses/' + kind.toLowerCase() + '/' + ver.replace('.', '\\.') + '/?$').test(c.licenceUrl || ''); }
  if (c.licence === 'CC0 1.0') return /^https:\/\/creativecommons\.org\/publicdomain\/zero\/1\.0\/?$/.test(c.licenceUrl || '');
  if (c.licence === 'Public domain') return /^https:\/\/creativecommons\.org\/publicdomain\/mark\/1\.0\/?$/.test(c.licenceUrl || '') || (c.provider === 'library-of-congress' && /^https:\/\/www\.loc\.gov\/(item|pictures\/item|resource)\//.test(c.licenceUrl || ''));
  return false; };
bad.ov = []; bad.inst = [];
const seenT = {}, seenS = {}, dupes = [];
for (const c of CR) {
  const id = c.file;
  if (isFlickr(c)) {
    const pm = /^https:\/\/www\.flickr\.com\/photos\/([^/?#\s]+)\/(\d+)\/$/.exec(c.sourceUrl || '');
    if (!pm) bad.flickr.push(id + ' photo page ' + c.sourceUrl); else if (c.flickrId && String(c.flickrId) !== pm[2]) bad.flickr.push(id + ' flickrId ' + c.flickrId + ' ≠ ' + pm[2]);
    if (!/^https:\/\/www\.flickr\.com\/(photos|people)\/[^/?#\s]+\/$/.test(c.authorUrl || '')) bad.flickr.push(id + ' profile ' + c.authorUrl);
    if (c.licence === NKCR) { if (c.licenceUrl !== NKCR_URL || !(c.flickrCommons || c.institution)) bad.flickr.push(id + ' NKCR without a Flickr Commons institution (flickrCommons/institution) or with url ' + c.licenceUrl); }
    else if (!FLICKR_LIC.test(c.licence || '')) bad.flickr.push(id + ' licence ' + c.licence);
    else if (/^CC BY/.test(c.licence)) { const [, kind, ver] = /^CC (BY(?:-SA)?) (\d\.\d)/.exec(c.licence); if (!new RegExp('^https://creativecommons\\.org/licenses/' + kind.toLowerCase() + '/' + ver.replace('.', '\\.') + '/?$').test(c.licenceUrl || '')) bad.flickr.push(id + ' deed ' + c.licenceUrl); }
    else if (!/^https:\/\/creativecommons\.org\/publicdomain\/(zero|mark)\/1\.0\/?$/.test(c.licenceUrl || '')) bad.flickr.push(id + ' deed ' + c.licenceUrl);
  } else if (isOV(c)) {
    if (!/^https:\/\//.test(c.sourceUrl || '')) bad.ov.push(id + ' landing page ' + c.sourceUrl);
    if (!String(c.openverseSource || '').trim() || !String(c.openverseProvider || '').trim()) bad.ov.push(id + ' openverseSource/openverseProvider missing');
    if (!/^https:\/\//.test(c.authorUrl || '')) bad.ov.push(id + ' author profile ' + c.authorUrl);
    if (!FLICKR_LIC.test(c.licence || '') || !deedOk(c)) bad.ov.push(id + ' licence/deed ' + c.licence + ' ' + c.licenceUrl);
  } else if (isInst(c)) {
    if (!/^https:\/\//.test(c.sourceUrl || '')) bad.inst.push(id + ' item page ' + c.sourceUrl);
    if (!String(c.sourceId || '').trim() || !String(c.institution || '').trim()) bad.inst.push(id + ' sourceId/institution missing');
    if (!String(c.evidence || '').trim()) bad.inst.push(id + ' no evidence (the item naming the place)');
    if (c.era === 'historic' && !String(c.date || '').trim()) bad.inst.push(id + ' historic without a date');
    const yr = +((/(\d{4})/.exec(String(c.date || '')) || [])[1] || 9999);
    if (c.licence === 'No known restrictions') { if (c.provider !== 'library-of-congress' || yr > 1929) bad.inst.push(id + ' "No known restrictions" outside LoC ≤ 1929'); }
    else if (!FLICKR_LIC.test(c.licence || '') || !deedOk(c)) bad.inst.push(id + ' licence/deed ' + c.licence + ' ' + c.licenceUrl);
    if (/^Anonymous\b/.test(c.author || '') && (!/^Anonymous \(as catalogued by .+\)$/.test(c.author) || !['Public domain', 'CC0 1.0'].includes(c.licence) || c.era !== 'historic')) bad.inst.push(id + ' anonymous author outside D-52 (PD/CC0, historic, "Anonymous (as catalogued by <institution>)")');
  } else if (/^unsplash$/i.test(c.provider || '')) {   // Unsplash (IMAGERY.md 2026-10-11): sights only — food is barred by D-49 below
    if (c.licence !== 'Unsplash License' || !/^https:\/\/unsplash\.com\/license\/?$/.test(c.licenceUrl || '')) bad.lic.push(id + ' Unsplash licence/url ' + c.licence + ' ' + c.licenceUrl);
    if (!/^https:\/\/unsplash\.com\/photos\//.test(c.sourceUrl || '') || !/^https:\/\/unsplash\.com\/@/.test(c.authorUrl || '')) bad.lic.push(id + ' Unsplash photo page / profile ' + c.sourceUrl + ' ' + c.authorUrl);
  } else if (STOCK.test(c.provider || '')) { bad.lic.push(id + ' provider ' + c.provider + ' (stock; not mapped)');
  } else if (!FREE.test(c.licence || '') || /NC|ND/.test(c.licence)) bad.lic.push(id + ' ' + c.licence);
  else if (/^CC BY/.test(c.licence)) { const [, kind, ver, jur] = /^CC (BY(?:-SA)?) (\d\.\d)(?: ([A-Z]{2}))?/.exec(c.licence), deed = `https://creativecommons.org/licenses/${kind.toLowerCase()}/${ver}` + (jur ? '/' + jur.toLowerCase() : ''); if (!new RegExp('^' + deed.replace(/[.]/g, '\\.') + '(/|/deed\\.[a-z]+)?$').test(c.licenceUrl)) bad.lic.push(id + ' url ' + c.licenceUrl); }
  else if (c.licence === 'Copyrighted free use') { if (c.licenceUrl !== 'https://commons.wikimedia.org/wiki/Template:Copyrighted_free_use') bad.lic.push(id + ' url ' + c.licenceUrl); }
  else if (!/^https:\/\/creativecommons\.org\/(publicdomain|licenses)\//.test(c.licenceUrl || '') && !/wikipedia|wikimedia/.test(c.licenceUrl || '')) bad.lic.push(id + ' url ' + c.licenceUrl);
  const want = 'https://commons.wikimedia.org/wiki/' + (c.commonsTitle || '').replace(/ /g, '_');
  if (isCommons(c) && (!c.commonsTitle || decodeURIComponent(c.sourceUrl) !== decodeURIComponent(want))) bad.src.push(id + ' ' + c.sourceUrl);
  const a = String(c.author || '');
  if (!a || a.length > 60 || /[<>\n\r]|User:|wikivoyage|wikipedia\)|\bCC\b|licen[cs]e|\d{4}-\d\d|https?:/i.test(a)) bad.author.push(id + ' "' + a.slice(0, 80) + '"');
  for (const f of [c.file, ...(c.variants || []).map(v => v.file)]) if (!fs.existsSync(path.join(PH, f))) bad.missing.push(f);
  const k = isFlickr(c) ? 'flickr:' + (c.flickrId || (/\/photos\/[^/?#\s]+\/(\d+)\/$/.exec(c.sourceUrl || '') || [])[1] || c.sourceUrl) :   // fetch-openverse writes no flickrId: the photo id is sourceUrl's last segment
  isCommons(c) ? c.commonsTitle : (c.provider + ':' + (c.sourceId || c.openverseId || c.sourceUrl)); if (seenT[k]) dupes.push(k + ' ← ' + seenT[k] + ' & ' + id); seenT[k] = id;
  if (c.sha1) { if (seenS[c.sha1]) dupes.push('sha1 ' + c.sha1 + ' ← ' + seenS[c.sha1] + ' & ' + id); seenS[c.sha1] = id; }
  let rec = null, pg = null;
  if (c.record) { pg = places[c.record.page] || places[c.record.page.replace(/\//g, '--')]; rec = pg && pg.places.find(p => p.id === c.record.id);
    if (!rec) bad.missing.push('record ' + c.record.page + '#' + c.record.id);
    else { if (rec.kind === 'food' && !(String(c.identifies || '').trim() && FOOD_OK.includes(c.provider) && !STOCK.test(c.provider || '') && !/wikipedia/i.test(c.via || ''))) bad.food.push(id + ' (provider ' + c.provider + ', identifies ' + (c.identifies ? 'set' : 'missing') + ')'); if (/CLOSED/i.test(rec.n) || (rec.pv && /closed/.test(String(rec.pv)))) bad.closed.push(id);
      if (VENUE.test(String(rec.g))) bad.venue.push(id + ' ' + rec.g); if (pg.country === 'vietnam') bad.vn.push(id); } }
  else if (c.slot && /^vietnam/.test(c.slot.key)) bad.vn.push(id);
  R.rows.push({ file: c.file, slot: c.slot ? c.slot.type + ':' + c.slot.key : null, record: c.record ? c.record.page + '#' + c.record.id : null, name: rec ? rec.n : null, kind: rec ? rec.kind : null, g: rec ? rec.g : null, depicts: c.depicts, title: c.title, author: c.author, licence: c.licence, confidence: c.confidence });
}
check(`every licence free (CC0/PD/CC BY/CC BY-SA) with its deed URL — ${CR.length} rows`, !bad.lic.length, bad.lic);
check('every source is the Commons File: page of its title (Commons rows)', !bad.src.length, bad.src.slice(0, 8));
check(`Flickr rows (${CR.filter(isFlickr).length}): flickr.com/photos/<user>/<id>/ page, author profile link, a free licence with its deed (NKCR only from a Flickr Commons institution)`, !bad.flickr.length, bad.flickr.slice(0, 8));
check('every author is a clean name (no markup/URL/licence/date, ≤ 60 chars)', !bad.author.length, bad.author);
check('every file and variant exists', !bad.missing.length, bad.missing);
check('no photo in two rows (Commons title, Flickr photo id, provider source id, or sha1)', !dupes.length, dupes);
check(`food places (D-49): a photo only with \`identifies\` and a Commons/Flickr/Openverse source, never stock (${CR.filter(c => { const pg = c.record && (places[c.record.page] || places[c.record.page.replace(/\\//g, '--')]); const r = pg && pg.places.find(p => p.id === c.record.id); return r && r.kind === 'food'; }).length} food rows)`, !bad.food.length, bad.food);
check(`Openverse rows (${CR.filter(isOV).length}): https landing page, openverseSource + openverseProvider, author profile, free licence + deed`, !bad.ov.length, bad.ov.slice(0, 8));
check(`institution rows (${CR.filter(isInst).length}; LoC, the Met, Smithsonian, Europeana): item page, sourceId, institution, evidence, a date when historic, licence + deed (LoC item page for Public domain; "No known restrictions" only LoC ≤ 1929), Anonymous only per D-52`, !bad.inst.length, bad.inst.slice(0, 8));
check('no photo on a venue (bar/shop/market/mall/hawker/theatre/arena/entertainment/nightlife/stadium/music tags)', !bad.venue.length, bad.venue);
check('no photo on a closed place', !bad.closed.length, bad.closed);
check('no Vietnam photo (record or hero slot)', !bad.vn.length, bad.vn);
check('rows: heroes / cards', null, { heroes: CR.filter(c => c.slot).length, cards: CR.filter(c => c.record).length });

// built pages: every photo img credited in its own figure; no Vietnam page with a photo; hero file not reused as a card
const byFile = {}; for (const c of CR) { byFile[c.file] = c; for (const v of c.variants || []) byFile[v.file] = c; }
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['assets', 'data'].includes(e.name) ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
const pages = walk(BETA); const uncred = [], vnp = [], reuse = [], nocap = [], use = {};
for (const f of pages) {
  const h = fs.readFileSync(f, 'utf8'), rel = path.relative(BETA, f);
  const figs = h.match(/<figure[^>]*class="[^"]*photo[^"]*"[^>]*>[\s\S]*?<\/figure>/g) || [];
  const imgs = (h.match(/assets\/img\/photos\/[^"' ,)]+?\.(?:jpg|webp|png)/g) || []).map(s => s.split('/').pop());
  if (/^Vietnam\//.test(rel)) for (const fi of imgs) { const c = byFile[fi]; if (c && ((c.slot && /^vietnam/.test(c.slot.key)) || (c.record && /^vietnam/i.test(c.record.page)))) vnp.push(rel + ' ' + fi); }
  for (const fi of imgs) { if (!byFile[fi]) uncred.push(rel + ' ' + fi); else (use[byFile[fi].file] = use[byFile[fi].file] || new Set()).add(rel); }
  let heroF = null;
  // every photo <img>: its credit (author + licence deed link + File: page link) follows it before the next photo
  const re = /<img\b[^>]*?src="[^"]*assets\/img\/photos\/([^"]+?\.(?:jpg|webp|png))"[^>]*>/g; let m;
  while ((m = re.exec(h))) { const c = byFile[m[1]]; if (!c) continue;
    const nx = h.indexOf('assets/img/photos/', m.index + m[0].length), win = h.slice(m.index, Math.min(nx < 0 ? h.length : nx, m.index + 4000));
    const okc = win.includes(c.author.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')) && win.includes('href="' + c.licenceUrl + '"') && (win.includes('href="' + c.sourceUrl + '"') || win.includes('href="' + c.sourceUrl.replace(/&/g, '&amp;') + '"'));
    const okp = !(isFlickr(c) || /^unsplash$/i.test(c.provider || '') || (isOV(c) && c.authorUrl)) || win.includes('href="' + c.authorUrl + '"') || win.includes('href="' + String(c.authorUrl).replace(/&/g, '&amp;') + '"');   // Flickr / Openverse: the author's profile link is in the caption
    if (!okc || !okp) nocap.push(rel + ' ' + m[1] + (okc ? ' (no author profile link)' : '')); }
  for (const fg of figs) { const m2 = /photos\/([^"' ,]+?\.(?:jpg|webp|png))/.exec(fg); if (m2 && byFile[m2[1]] && /hero/.test(fg.slice(0, 200))) heroF = heroF || byFile[m2[1]].file; }
  if (heroF) { const n = (h.match(new RegExp(heroF.replace(/-960\.jpg$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length; const asCard = figs.filter(fg => !/hero/.test(fg.slice(0, 200)) && fg.includes(heroF.replace(/-960\.jpg$/, ''))).length; if (asCard) reuse.push(rel + ' ' + heroF); }
}
check(`every photo URL in ${pages.length} built pages has a credit row`, !uncred.length, uncred.slice(0, 6));
check('every server-rendered photo <img> is followed by its own credit (author + licence deed link + File: page link)', !nocap.length, nocap.slice(0, 6));
check('no Vietnam page carries a photo of a Vietnamese place (other countries\' cards allowed)', !vnp.length, vnp);
check('no hub/city hero photo is reused as a card on the same page (server-rendered)', !reuse.length, reuse);
// a row whose review is not "ok" (imagery: Flickr rows start "pending") is never rendered: no built page or data JSON names its files
const unrev = CR.filter(c => c.review != null && !/^ok\b/.test(String(c.review))), unrevF = new Set(unrev.flatMap(c => [c.file, ...(c.variants || []).map(v => v.file)]));
const shown = [];
if (unrevF.size) { const walkJ = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walkJ(path.join(d, e.name)) : /\.(json|html)$/.test(e.name) && e.name !== 'CREDITS.json' ? [path.join(d, e.name)] : []);
  for (const f of walkJ(BETA)) { const t = fs.readFileSync(f, 'utf8'); for (const fi of unrevF) if (t.includes(fi)) shown.push(path.relative(BETA, f) + ' ' + fi); } }
check(`no row whose review is not "ok…" is rendered (${unrev.length} such rows)`, !shown.length, shown.slice(0, 8));
const unused = CR.filter(c => !use[c.file] && !(c.variants || []).some(v => use[v.file]));
check('credit rows whose photo no built page references (client-drawn rows may still use them)', null, unused.map(c => c.file));
// contact sheet
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const cell = r => `<figure><img src="../../../../../beta/assets/img/photos/${esc(r.file)}" loading="lazy"><figcaption><b>${esc(r.slot || r.record)}</b><br>${esc(r.name || '')}<br><i>${esc(r.depicts)}</i><br>${esc(r.author)} · ${esc(r.licence)} · ${esc(r.confidence)}</figcaption></figure>`;
fs.writeFileSync(path.join(OUT, 'contact.html'), `<!doctype html><meta charset=utf-8><title>W7 QA photo contact sheet</title><style>body{font:12px system-ui;margin:8px}div{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}img{width:100%;aspect-ratio:4/3;object-fit:cover}figure{margin:0}</style><h2>Heroes</h2><div>${R.rows.filter(r => r.slot).map(cell).join('')}</div><h2>Cards</h2><div>${R.rows.filter(r => r.record).map(cell).join('')}</div>`);
fs.writeFileSync(path.join(OUT, 'photos.json'), JSON.stringify(R, null, 1));
console.log(`\n>>> ${R.checks.filter(c => c.ok).length}/${R.checks.filter(c => c.ok !== null).length} PASS, ${fails} FAIL`);
process.exit(fails ? 1 : 0);
