#!/usr/bin/env node
'use strict';
/**
 * imagery/sources/review.js — copy contact-sheet verdicts into candidates.tsv (lane: image sources).
 *
 *   node tools/beta/imagery/sources/review.js design/beta/imagery-sources/stage/review.tsv
 *
 * review.tsv rows: n, target, source, itemId, verdict. A verdict of `ok` lets `<source>.js --credit` fetch and credit the
 * row; anything else is the refusal reason and the row is never fetched. Empty verdicts are left alone. Only the
 * `review` column changes; a verdict for a row not in candidates.tsv is reported.
 */
const fs = require('fs');
const lib = require('./lib');

const file = process.argv[2];
if (!file || !fs.existsSync(file)) { console.error('usage: review.js <review.tsv>'); process.exit(1); }
const verdicts = new Map();
for (const l of fs.readFileSync(file, 'utf8').split('\n').slice(1)) {
  const [, target, source, itemId, verdict] = l.split('\t');
  if (target && verdict && verdict.trim()) verdicts.set(`${target}|${source}|${itemId}`, verdict.trim().replace(/\s+/g, ' '));
}
const text = fs.readFileSync(lib.CANDIDATES, 'utf8').split('\n');
const head = text.find(l => l.startsWith('target\t')).split('\t'), col = head.indexOf('review');
let n = 0;
const used = new Set();
const out = text.map(l => {
  if (!l || l.startsWith('#') || l.startsWith('target\t')) return l;
  const f = l.split('\t'), k = `${f[head.indexOf('target')]}|${f[head.indexOf('source')]}|${f[head.indexOf('itemId')]}`;
  if (!verdicts.has(k)) return l;
  used.add(k); while (f.length < head.length) f.push('');
  f[col] = verdicts.get(k); n++;
  return f.join('\t');
});
fs.writeFileSync(lib.CANDIDATES, out.join('\n'));
console.log(`review: ${n} verdict(s) applied (${[...verdicts.values()].filter(v => v === 'ok').length} ok)`);
for (const k of verdicts.keys()) if (!used.has(k)) console.log(`  not in candidates.tsv: ${k}`);
