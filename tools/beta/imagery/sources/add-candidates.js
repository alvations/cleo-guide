#!/usr/bin/env node
'use strict';
/**
 * imagery/sources/add-candidates.js — merge research rows (TSV, the RULES columns) into candidates.tsv (lane: image sources).
 *
 *   node tools/beta/imagery/sources/add-candidates.js <rows.tsv>…   # append new rows, report what was refused
 *   node tools/beta/imagery/sources/add-candidates.js --check        # validate candidates.tsv only (exit 1 on a bad row)
 *
 * A row is keyed by target + source + itemId; an existing key is never overwritten (edit candidates.tsv by hand to change
 * a row, e.g. to set `review` after the contact sheet). Rows are rejected (reported, not merged) when the target is not a
 * place on its beta page, the itemUrl is not https, or a candidate (empty `refused`) lacks identity evidence or has a
 * confidence other than high / med. Refused rows ARE merged: they stop the next wave re-searching the same item.
 */
const fs = require('fs');
const lib = require('./lib');

const HEAD = lib.COLUMNS.join('\t');
const PREAMBLE = [
  '# Image-sources candidate manifest (D-50). One row per (target, source, item). Edit by hand only to set `review`:',
  '#   ok = a person looked at the contact-sheet preview and it shows the place; anything else = the refusal reason.',
  '# `refused` set at research = never fetched. Columns: see tools/beta/imagery/sources/README.md.',
];

function problems(r) {
  const p = [], t = lib.targetCheck(r.target);
  if (t.why && !/already|closed/.test(t.why)) p.push(t.why);
  if (!/^https:\/\/\S+$/.test(r.itemUrl)) p.push(`itemUrl not https: "${r.itemUrl}"`);
  if (!r.source) p.push('no source');
  if (!r.refused) {
    if (!r.identityEvidence) p.push('candidate without identityEvidence');
    if (!['high', 'med'].includes(r.confidence)) p.push(`confidence "${r.confidence}"`);
    if (!['modern', 'historic'].includes(r.era)) p.push(`era "${r.era}" (modern | historic)`);
  }
  for (const c of lib.COLUMNS) if (/[\t\n]/.test(r[c] || '')) p.push(`tab or newline in ${c}`);
  return p;
}
const key = r => `${r.target}|${r.source}|${r.itemId}`;
const line = r => lib.COLUMNS.map(c => (r[c] || '').replace(/\s+/g, ' ').trim()).join('\t');

function main() {
  const argv = process.argv.slice(2);
  const have = lib.readCandidates();
  if (argv[0] === '--check') {
    let bad = 0;
    for (const r of have) { const p = problems(r); if (p.length) { bad++; console.log(`  bad   line ${r.line} ${r.target} ${r.itemId}: ${p.join('; ')}`); } }
    const dup = have.length - new Set(have.map(key)).size;
    if (dup) { bad++; console.log(`  bad   ${dup} duplicate key(s)`); }
    console.log(`candidates.tsv: ${have.length} rows, ${have.filter(r => !r.refused).length} candidates, ${bad ? `${bad} problem(s)` : 'clean'}`);
    process.exitCode = bad ? 1 : 0; return;
  }
  const seen = new Set(have.map(key)), add = [], rejected = [], searched = [];
  const GAPS = require('path').join(__dirname, 'searched-gaps.tsv');
  const known = new Set(fs.existsSync(GAPS) ? fs.readFileSync(GAPS, 'utf8').split('\n').map(l => l.split('\t').slice(0, 2).join('|')) : []);
  for (const f of argv) for (const r of lib.readCandidates(f)) {
    // "searched, nothing found" rows (no item) go to searched-gaps.tsv so the next wave skips them
    if (!r.itemUrl && !r.itemId) { if (r.target && !known.has(`${r.target}|${r.source}`)) { known.add(`${r.target}|${r.source}`); searched.push([r.target, r.source || '?', new Date().toISOString().slice(0, 10), (r.refused || 'searched: nothing found').replace(/\s+/g, ' ')].join('\t')); } continue; }
    if (seen.has(key(r))) continue;
    const p = problems(r);
    if (p.length) { rejected.push(`${f.split('/').pop()}:${r.line} ${r.target} ${r.itemId}: ${p.join('; ')}`); continue; }
    seen.add(key(r)); add.push(r);
  }
  const rows = [...have, ...add].sort((a, b) => a.target.localeCompare(b.target) || a.source.localeCompare(b.source));
  fs.writeFileSync(lib.CANDIDATES, [...PREAMBLE, HEAD, ...rows.map(line)].join('\n') + '\n');
  if (searched.length) fs.appendFileSync(GAPS, searched.join('\n') + '\n');
  console.log(`searched-gaps.tsv: +${searched.length} target(s) searched with nothing found`);
  console.log(`added ${add.length} (${add.filter(r => !r.refused).length} candidates); candidates.tsv now ${rows.length} rows`);
  if (rejected.length) { console.log(`rejected ${rejected.length}:`); rejected.forEach(x => console.log(`  ${x}`)); }
}
main();
