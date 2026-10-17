#!/usr/bin/env node
'use strict';
/**
 * imagery/coverage.js — photo coverage of what a visitor sees first, per city guide (W8; lane: imagery).
 *
 *   node tools/beta/imagery/coverage.js           # table
 *   node tools/beta/imagery/coverage.js --json    # machine-readable
 *
 * Per non-Vietnam guide: the hero (credited slot or motif), the gallery's lead card, its first rail row and the tier-1
 * open sights, plus (R8) the share of photos in the first 24 cards of the default view. "eligible" leaves out what never gets a
 * photo: closed places, Vietnam, and manifest targets marked `skip` (venues, brand stores, copyrighted art, stated gaps).
 * Food places are eligible since D-49 (a photo of THAT place only). A photo counts when a credit row names the record.
 */
const fs = require('fs');
const path = require('path');

const BETA = path.resolve(__dirname, '..', '..', '..', 'beta');
const read = f => JSON.parse(fs.readFileSync(path.join(BETA, f), 'utf8'));

function coverage() {
  const credits = read('assets/img/CREDITS.json').credits;
  const photo = new Set(credits.filter(c => c.record).map(c => `${c.record.page}#${c.record.id}`));
  const hero = new Set(credits.filter(c => c.slot).map(c => c.slot.key));
  const skip = new Set(read('assets/img/commons-candidates.json').targets.filter(t => t.skip).map(t => t.depicts));
  const out = [];
  for (const f of fs.readdirSync(path.join(BETA, 'data/gallery')).sort()) {
    const g = read(`data/gallery/${f}`), k = g.key;
    const pl = read(`data/places/${k.replace(/\//g, '--')}.json`);
    if (pl.country === 'vietnam') continue;
    const ok = p => p && !/CLOSED/.test(p.n) && !skip.has(`${k}#${p.id}`);   // D-49: food is eligible
    const has = p => photo.has(`${k}#${p.id}`);
    const row = (g.rows && g.rows[0] && g.rows[0][6]) || [];
    const t1 = pl.places.filter(p => p.t === 1 && ok(p));
    // what a visitor sees first: the first 24 open cards in the page's own ranked order (the default Atlas list)
    const first = pl.places.filter(p => !/CLOSED/.test(p.n)).slice(0, 24);
    out.push({
      page: k,
      hero: hero.has(k),
      lead: !g.lead ? 'none' : !ok(g.lead) ? (g.lead.kind === 'food' ? 'food' : 'gap') : has(g.lead) ? 'photo' : 'missing',
      row: { eligible: row.filter(ok).length, photo: row.filter(p => ok(p) && has(p)).length },
      tier1: { eligible: t1.length, photo: t1.filter(has).length },
      tier1Sights: { eligible: t1.filter(p => p.kind !== 'food').length, photo: t1.filter(p => p.kind !== 'food' && has(p)).length },
      first24: { cards: first.length, photo: first.filter(has).length, eligible: first.filter(ok).length },
      all: { eligible: pl.places.filter(ok).length, photo: pl.places.filter(p => ok(p) && has(p)).length },
    });
  }
  return out;
}

if (require.main === module) {
  const c = coverage();
  if (process.argv.includes('--json')) { console.log(JSON.stringify(c, null, 1)); return; }
  const sum = (f) => c.reduce((a, r) => a + f(r), 0);
  console.log('page'.padEnd(34) + 'hero  lead     row1 (photo/eligible)  tier-1 (photo/eligible)  first 24 (photo/cards)');
  for (const r of c) console.log(`${r.page.padEnd(34)}${(r.hero ? 'yes' : 'motif').padEnd(6)}${r.lead.padEnd(9)}${`${r.row.photo}/${r.row.eligible}`.padEnd(23)}${`${r.tier1.photo}/${r.tier1.eligible}`.padEnd(25)}${r.first24.photo}/${r.first24.cards}`);
  console.log(`\n${c.length} guides · heroes ${sum(r => r.hero)} · leads with a photo ${sum(r => r.lead === 'photo')}/${sum(r => r.lead === 'photo' || r.lead === 'missing')} · first-row ${sum(r => r.row.photo)}/${sum(r => r.row.eligible)} · tier-1 sights ${sum(r => r.tier1Sights.photo)}/${sum(r => r.tier1Sights.eligible)} · tier-1 incl. food ${sum(r => r.tier1.photo)}/${sum(r => r.tier1.eligible)} · first-24 ${sum(r => r.first24.photo)}/${sum(r => r.first24.cards)} · all eligible ${sum(r => r.all.photo)}/${sum(r => r.all.eligible)}`);
}
module.exports = { coverage };
