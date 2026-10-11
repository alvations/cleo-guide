#!/usr/bin/env node
'use strict';
/**
 * test-recognition.js — W9-1 (recognition badges) and W9-9 (local favourites), the data half. Part of `npm test`.
 * Reads the built per-page datasets (beta/data/places/*.json) and the registry (data/sources.json):
 *   1. every distinct registry `type` string maps to a group (no unmapped type);
 *   2. every typed source is traceable: its `reg` names a registry entry whose type is exactly the stored type;
 *   3. over all places: every badge is backed by source ids on that record (award ids are award sources, video ids are
 *      video sources, cited = distinct non-guide publishers ≥ 3), and 0 records carry a badge without one;
 *   4. per page: the award count equals the number of places citing an award source in the page's source index;
 *   5. local favourites: every `lf` place is open and ALL its sources are typed local/creator; a page with fewer than
 *      LF_MIN qualifying places states a gap; the rule is printed;
 *   6. nothing is derived from a name or dish: recognition.js reads no place name / prose field.
 */
const fs = require('fs');
const path = require('path');
const R = require('./lib/recognition');
const ROOT = path.resolve(__dirname, '..', '..');
const DIR = path.join(ROOT, 'beta', 'data', 'places');
let fails = 0;
const chk = (name, bad) => { const ok = !bad.length; if (!ok) fails++; console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : ' = ' + JSON.stringify(bad.slice(0, 5))}`); };

const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'sources.json'), 'utf8'));
const types = [...new Set(Object.values(reg.cities).flatMap(c => (c.sources || []).map(s => s.type)).filter(Boolean))];
console.log('== recognition (W9-1) + local favourites (W9-9): data ==');
chk(`all ${types.length} registry type strings map to a group`, types.filter(t => !R.GROUPS.includes(R.groupOf(t))));

const regEntry = {}; for (const [c, cv] of Object.entries(reg.cities)) for (const s of cv.sources || []) regEntry[s.key + ' (' + c + ')'] = s;
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json'));
let places = 0, badges = 0; const untraced = [], unbacked = [], citedBad = [], awardCount = [], lfBad = [], gapBad = [], missing = [];
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  if (!d.recognition) { missing.push(f); continue; }
  const src = Object.fromEntries((d.sourceIndex || []).map(s => [s.id, s]));
  for (const s of d.sourceIndex || []) {
    if (!s.group || s.typedFrom === 'key') continue;
    const e = regEntry[s.reg];
    if (!e || e.type !== s.type || R.groupOf(e.type) !== s.group) untraced.push(f + ':' + s.id);
  }
  let awardPlaces = 0;
  for (const p of d.places) {
    places++;
    const ids = (p.src || []).filter(id => id !== 'guide'), rec = p.rec || {};
    for (const k of Object.keys(rec)) badges++;
    if (rec.award && !rec.award.every(id => ids.includes(id) && src[id] && src[id].award)) unbacked.push(f + '/' + p.id + ' award');
    if (rec.video && !rec.video.every(id => ids.includes(id) && src[id] && src[id].video)) unbacked.push(f + '/' + p.id + ' video');
    const wantAward = ids.some(id => src[id] && src[id].award), wantVideo = ids.some(id => src[id] && src[id].video);
    if (!!rec.award !== wantAward || !!rec.video !== wantVideo) unbacked.push(f + '/' + p.id + ' mismatch');
    if ((ids.length >= 3 ? ids.length : undefined) !== rec.cited) citedBad.push(f + '/' + p.id);
    if (wantAward) awardPlaces++;
    if (p.lf) { const all = (p.src || []).map(id => src[id]);
      if (p.closed || !all.length || !all.every(s => s && s.group && R.LF_GROUPS.has(s.group))) lfBad.push(f + '/' + p.id); }
  }
  if (d.recognition.counts.award !== awardPlaces) awardCount.push(`${f}: ${d.recognition.counts.award} != ${awardPlaces}`);
  const lf = d.recognition.localFavourites, n = d.places.filter(p => p.lf).length;
  if (lf.n !== n || lf.rule !== R.LF_RULE || (n < R.LF_MIN) !== !!lf.gap) gapBad.push(`${f}: n ${lf.n}/${n}, gap ${!!lf.gap}`);
}
chk(`every place dataset carries a recognition block (${files.length} pages)`, missing);
chk('every typed source is traceable to its data/sources.json entry (same type, same group)', untraced);
chk(`every badge is backed by a source id on its record, and every backed badge is present (${places} places, ${badges} badges)`, unbacked);
chk('cited = distinct publishers (guide excluded) when ≥ 3, else absent', citedBad);
chk('award count per page == places citing an award source in the page source index', awardCount);
chk('every local-favourites place is open and ALL its sources are typed local press/writer or vetted creator', lfBad);
chk(`local favourites: count, printed rule, and a stated gap below ${R.LF_MIN} places`, gapBad);
const srcTxt = fs.readFileSync(path.join(__dirname, 'lib', 'recognition.js'), 'utf8');
chk('recognition.js reads no place name, write-up, keywords, collections, cuisines or address (source keys only)', [...srcTxt.matchAll(/\br\.(n|w|k|g|cz|ad|nat)\b/g)].map(m => m[0]));
console.log(fails ? `\n>>> FAIL — recognition: ${fails} check(s)` : `\n>>> PASS — recognition: ${badges} badges on ${places} places, every one backed by a source key; local favourites rule held`);
process.exit(fails ? 1 : 0);
