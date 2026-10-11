#!/usr/bin/env node
/**
 * Beta QA — Wave 7 photo + credit honesty audit (static; QA lane). Independent of test-imagery.js.
 * For every row in beta/assets/img/CREDITS.json and every <img> of a photo in the built beta pages:
 *   · licence is free (CC0 / PD / CC BY / CC BY-SA, any version), never NC/ND; licenceUrl is the matching CC deed
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
const FREE = /^(CC0 1\.0|Public domain|CC BY(-SA)? \d\.\d)$/;
const VENUE = /\b(BAR|SHOP|SHOPPING|MARKET|MALL|HAWKER|THEATRE|THEATER|ARENA|ENTERTAINMENT|NIGHTLIFE|STADIUM|MUSIC|VENUE|CLUB)\b/;
const bad = { lic: [], src: [], author: [], food: [], venue: [], closed: [], vn: [], missing: [] };
const seenT = {}, seenS = {}, dupes = [];
for (const c of CR) {
  const id = c.file;
  if (!FREE.test(c.licence || '') || /NC|ND/.test(c.licence)) bad.lic.push(id + ' ' + c.licence);
  else if (/^CC BY/.test(c.licence)) { const [, kind, ver] = /^CC (BY(?:-SA)?) (\d\.\d)/.exec(c.licence); if (c.licenceUrl !== `https://creativecommons.org/licenses/${kind.toLowerCase()}/${ver}` && c.licenceUrl !== `https://creativecommons.org/licenses/${kind.toLowerCase()}/${ver}/`) bad.lic.push(id + ' url ' + c.licenceUrl); }
  else if (!/^https:\/\/creativecommons\.org\/(publicdomain|licenses)\//.test(c.licenceUrl || '') && !/wikipedia|wikimedia/.test(c.licenceUrl || '')) bad.lic.push(id + ' url ' + c.licenceUrl);
  const want = 'https://commons.wikimedia.org/wiki/' + (c.commonsTitle || '').replace(/ /g, '_');
  if (!c.commonsTitle || decodeURIComponent(c.sourceUrl) !== decodeURIComponent(want)) bad.src.push(id + ' ' + c.sourceUrl);
  const a = String(c.author || '');
  if (!a || a.length > 60 || /[<>\n\r]|User:|wikivoyage|wikipedia\)|\bCC\b|licen[cs]e|\d{4}-\d\d|https?:/i.test(a)) bad.author.push(id + ' "' + a.slice(0, 80) + '"');
  for (const f of [c.file, ...(c.variants || []).map(v => v.file)]) if (!fs.existsSync(path.join(PH, f))) bad.missing.push(f);
  const k = c.commonsTitle; if (seenT[k]) dupes.push(k + ' ← ' + seenT[k] + ' & ' + id); seenT[k] = id;
  if (c.sha1) { if (seenS[c.sha1]) dupes.push('sha1 ' + c.sha1 + ' ← ' + seenS[c.sha1] + ' & ' + id); seenS[c.sha1] = id; }
  let rec = null, pg = null;
  if (c.record) { pg = places[c.record.page] || places[c.record.page.replace(/\//g, '--')]; rec = pg && pg.places.find(p => p.id === c.record.id);
    if (!rec) bad.missing.push('record ' + c.record.page + '#' + c.record.id);
    else { if (rec.kind === 'food') bad.food.push(id); if (/CLOSED/i.test(rec.n) || (rec.pv && /closed/.test(String(rec.pv)))) bad.closed.push(id);
      if (VENUE.test(String(rec.g))) bad.venue.push(id + ' ' + rec.g); if (pg.country === 'vietnam') bad.vn.push(id); } }
  else if (c.slot && /^vietnam/.test(c.slot.key)) bad.vn.push(id);
  R.rows.push({ file: c.file, slot: c.slot ? c.slot.type + ':' + c.slot.key : null, record: c.record ? c.record.page + '#' + c.record.id : null, name: rec ? rec.n : null, kind: rec ? rec.kind : null, g: rec ? rec.g : null, depicts: c.depicts, title: c.title, author: c.author, licence: c.licence, confidence: c.confidence });
}
check(`every licence free (CC0/PD/CC BY/CC BY-SA) with its deed URL — ${CR.length} rows`, !bad.lic.length, bad.lic);
check('every source is the Commons File: page of its title', !bad.src.length, bad.src.slice(0, 8));
check('every author is a clean name (no markup/URL/licence/date, ≤ 60 chars)', !bad.author.length, bad.author);
check('every file and variant exists', !bad.missing.length, bad.missing);
check('no Commons file (title or sha1) in two rows', !dupes.length, dupes);
check('no photo on a food place', !bad.food.length, bad.food);
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
    if (!okc) nocap.push(rel + ' ' + m[1]); }
  for (const fg of figs) { const m2 = /photos\/([^"' ,]+?\.(?:jpg|webp|png))/.exec(fg); if (m2 && byFile[m2[1]] && /hero/.test(fg.slice(0, 200))) heroF = heroF || byFile[m2[1]].file; }
  if (heroF) { const n = (h.match(new RegExp(heroF.replace(/-960\.jpg$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length; const asCard = figs.filter(fg => !/hero/.test(fg.slice(0, 200)) && fg.includes(heroF.replace(/-960\.jpg$/, ''))).length; if (asCard) reuse.push(rel + ' ' + heroF); }
}
check(`every photo URL in ${pages.length} built pages has a credit row`, !uncred.length, uncred.slice(0, 6));
check('every server-rendered photo <img> is followed by its own credit (author + licence deed link + File: page link)', !nocap.length, nocap.slice(0, 6));
check('no Vietnam page carries a photo of a Vietnamese place (other countries\' cards allowed)', !vnp.length, vnp);
check('no hub/city hero photo is reused as a card on the same page (server-rendered)', !reuse.length, reuse);
const unused = CR.filter(c => !use[c.file] && !(c.variants || []).some(v => use[v.file]));
check('credit rows whose photo no built page references (client-drawn rows may still use them)', null, unused.map(c => c.file));
// contact sheet
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const cell = r => `<figure><img src="../../../../../beta/assets/img/photos/${esc(r.file)}" loading="lazy"><figcaption><b>${esc(r.slot || r.record)}</b><br>${esc(r.name || '')}<br><i>${esc(r.depicts)}</i><br>${esc(r.author)} · ${esc(r.licence)} · ${esc(r.confidence)}</figcaption></figure>`;
fs.writeFileSync(path.join(OUT, 'contact.html'), `<!doctype html><meta charset=utf-8><title>W7 QA photo contact sheet</title><style>body{font:12px system-ui;margin:8px}div{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}img{width:100%;aspect-ratio:4/3;object-fit:cover}figure{margin:0}</style><h2>Heroes</h2><div>${R.rows.filter(r => r.slot).map(cell).join('')}</div><h2>Cards</h2><div>${R.rows.filter(r => r.record).map(cell).join('')}</div>`);
fs.writeFileSync(path.join(OUT, 'photos.json'), JSON.stringify(R, null, 1));
console.log(`\n>>> ${R.checks.filter(c => c.ok).length}/${R.checks.filter(c => c.ok !== null).length} PASS, ${fails} FAIL`);
process.exit(fails ? 1 : 0);
