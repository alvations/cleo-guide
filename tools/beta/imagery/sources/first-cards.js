#!/usr/bin/env node
'use strict';
/**
 * imagery/sources/first-cards.js — the first N cards of each guide's default view (Atlas, D-46) and which of them still
 * lack a photo (lane: image sources). The order re-implements Atlas's map priority (tools/beta/client/atlas.js, SPEC-v3
 * §1.3): tier ↑ (closed last), then each area's own order round-robin (index within area+tier by sources ↓, rank ↑),
 * sources ↓, rank ↑, area order. Approximate where the client uses stamped-card attributes; good enough to pick targets.
 *
 *   node tools/beta/imagery/sources/first-cards.js            # per guide: photos in the first 24, and the eligible gaps
 *   node tools/beta/imagery/sources/first-cards.js --n 54 --tsv   # gap rows (page, id, name, kind) for research
 *
 * "eligible" for these sources = not food (stock and historic photos never go on food), open, not Vietnam, not a
 * Commons `skip` target. Food gaps are counted apart: only a photo of that place (D-49, imagery's Commons/Flickr) helps.
 */
const fs = require('fs');
const path = require('path');
const BETA = path.resolve(__dirname, '..', '..', '..', '..', 'beta');
const read = f => JSON.parse(fs.readFileSync(path.join(BETA, f), 'utf8'));

function order(pl) {
  const ord = {}; (pl.areas || []).forEach((a, i) => { ord[a.id] = i; });
  const tier = p => (/CLOSED/.test(p.n) ? 4 : +p.t || 3), ns = p => (p.src || []).filter(x => x && x !== 'guide').length, num = p => +p.rank || 1e9;
  const by = {}, ix = {};
  pl.places.forEach(p => { const k = `${p.a}|${tier(p)}`; (by[k] = by[k] || []).push(p); });
  Object.values(by).forEach(xs => xs.sort((x, y) => ns(y) - ns(x) || num(x) - num(y)).forEach((p, i) => { ix[p.id] = i; }));
  return pl.places.slice().sort((x, y) => tier(x) - tier(y) || ix[x.id] - ix[y.id] || ns(y) - ns(x) || num(x) - num(y) || (ord[x.a] || 0) - (ord[y.a] || 0));
}

function firstCards(n = 24) {
  const credits = read('assets/img/CREDITS.json').credits;
  const photo = new Set(credits.filter(c => c.record).map(c => `${c.record.page}#${c.record.id}`));
  const skip = new Set(read('assets/img/commons-candidates.json').targets.filter(t => t.skip).map(t => t.depicts));
  const out = [];
  for (const f of fs.readdirSync(path.join(BETA, 'data/places')).sort()) {
    const pl = read(`data/places/${f}`);
    if (pl.country === 'vietnam' || !Array.isArray(pl.places)) continue;
    const first = order(pl).slice(0, n), k = pl.key;
    const has = p => photo.has(`${k}#${p.id}`);
    const gaps = first.filter(p => !has(p) && p.kind !== 'food' && !/CLOSED/.test(p.n) && !skip.has(`${k}#${p.id}`));
    out.push({ page: k, n: first.length, photo: first.filter(has).length, food: first.filter(p => p.kind === 'food' && !has(p)).length, gaps });
  }
  return out;
}

if (require.main === module) {
  const a = process.argv, ni = a.indexOf('--n'), n = ni > 0 ? +a[ni + 1] : 24;
  const r = firstCards(n);
  if (a.includes('--tsv')) { console.log('page\tid\tname\tkind'); r.forEach(g => g.gaps.forEach(p => console.log(`${g.page}\t${p.id}\t${p.n}\t${p.kind}`))); return; }
  console.log(`page`.padEnd(34) + `photo/first${n}  food-without  eligible gaps`);
  r.forEach(g => console.log(`${g.page.padEnd(34)}${`${g.photo}/${g.n}`.padEnd(14)}${String(g.food).padEnd(14)}${g.gaps.length}`));
  const s = f => r.reduce((x, g) => x + f(g), 0);
  console.log(`\n${r.length} guides · first-${n} photos ${s(g => g.photo)}/${s(g => g.n)} · food without photo ${s(g => g.food)} · eligible non-food gaps ${s(g => g.gaps.length)}`);
}
module.exports = { firstCards, order };
