#!/usr/bin/env node
'use strict';
/**
 * tools/beta/test-casing.js — the casing rule (owner, W8; design/beta/DESIGN-SYSTEM.md §v2.6), wired into `npm test`.
 *
 *  1. lib/casing.js sentence() cases every collection and cuisine label in beta/data/places/*.json exactly as the
 *     designer's executable spec (design/beta/casing/sentence_case.py) does.
 *  2. No shipped stylesheet uppercases or capitalises text, and no ::first-letter rule styles a letter (resets only).
 *  3. Every city page's UI labels — category bar, filter pills, Gallery row titles, the client's label table — are
 *     sentence case: sentence(label) leaves each unchanged. Source names keep their publishers' casing and are skipped.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { sentence, ownWords } = require('./lib/casing');

const ROOT = path.resolve(__dirname, '..', '..'), BETA = path.join(ROOT, 'beta');
let failures = 0;
const chk = (name, ok, got) => { console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${got !== undefined ? ' = ' + JSON.stringify(got) : ''}`); if (!ok) failures++; };
const un = s => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

console.log('# casing: the JS helper matches the designer\'s spec');
{
  const py = JSON.parse(execFileSync('python3', ['-c',
    'import sys, json; sys.path.insert(0, sys.argv[1]); from sentence_case import sentence_case, labels; print(json.dumps({n: sentence_case(n) for n in labels()}))',
    path.join(ROOT, 'design/beta/casing')], { encoding: 'utf8' }));
  const diff = Object.keys(py).filter(n => sentence(n) !== py[n]).map(n => [n, sentence(n), py[n]]);
  chk(`sentence() == sentence_case.py on all ${Object.keys(py).length} data labels`, Object.keys(py).length > 100 && !diff.length, diff.slice(0, 4));
  const ex = [['Iconic & Must-See', 'Iconic & must-see'], ['Free to Visit', 'Free to visit'], ['UNESCO World Heritage', 'UNESCO World Heritage'], ['Italian-American Classics', 'Italian-American classics']];
  chk('the brief\'s examples', ex.every(([a, b]) => sentence(a) === b), ex.map(([a]) => sentence(a)));
  chk('the page\'s own place names keep their capitals', sentence('Only in Cleveland', ownWords('Cleveland')) === 'Only in Cleveland');
}

console.log('# casing: no uppercase / capitalize transforms, no styled first letters, in any shipped stylesheet');
{
  const css = fs.readdirSync(path.join(BETA, 'assets')).filter(f => f.endsWith('.css')).map(f => [f, fs.readFileSync(path.join(BETA, 'assets', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')]);
  const tt = css.flatMap(([f, s]) => (s.match(/text-transform\s*:\s*(uppercase|capitalize)/g) || []).map(m => f + ': ' + m));
  chk(`no text-transform: uppercase | capitalize (${css.length} stylesheets)`, !tt.length, tt.slice(0, 4));
  const RESET = /^(float:\s*none|font:\s*inherit|color:\s*inherit|margin:\s*0|padding:\s*0|initial-letter:\s*normal|line-height:\s*inherit|font-size:\s*inherit|font-weight:\s*inherit)$/;
  const fl = css.flatMap(([f, s]) => [...s.matchAll(/::?first-letter[^{]*\{([^}]*)\}/g)].filter(m => m[1].split(';').map(x => x.trim()).filter(Boolean).some(d => !RESET.test(d))).map(m => f + ': ' + m[0].slice(0, 80)));
  chk('every ::first-letter rule only resets (no drop caps)', !fl.length, fl.slice(0, 3));
}

console.log('# casing: UI labels on every city page are sentence case');
{
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (e.name === 'data' || e.name === 'assets' ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
  const bad = []; let pages = 0, labels = 0;
  for (const f of walk(BETA)) {
    const h = fs.readFileSync(f, 'utf8'); if (!/data-cleo-page="city"/.test(h)) continue; pages++;
    const file = (/"file":"([^"]+)"/.exec(h) || [])[1], j = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', file + '.json'), 'utf8'));
    const own = ownWords(j.name, j.nat, ...(j.areas || []).map(a => a.n)), rel = path.relative(BETA, f);
    const see = (where, t) => { t = un(t).trim(); if (!t) return; labels++; if (sentence(t, own) !== t) bad.push([rel, where, t, sentence(t, own)]); };
    // category bar: every tile but the source tiles (publisher names); filter pills; Gallery rows; the client's label table
    for (const m of h.matchAll(/<button type="button" class="rail-i(?![^"]*src-t)[^"]*"[^>]*>([\s\S]*?)<\/button>/g)) {
      const t = /<span class="t">([^<]*)<\/span>/.exec(m[1]), k = /<span class="k">([^<]*)<\/span>/.exec(m[1]);
      if (t) see('category bar', t[1]); if (k) see('category bar', k[1].replace(/^★\s*/, ''));
    }
    for (const m of h.matchAll(/<button[^>]*class="pill"[^>]*data-(?:c|cz)="[^"]*"[^>]*>([^<]*)/g)) see('filter pill', m[1].replace(/\s*\d+$/, ''));
    const g = path.join(BETA, 'data/gallery', file + '.json');
    if (fs.existsSync(g)) JSON.parse(fs.readFileSync(g, 'utf8')).rows.forEach(r => see('Gallery row', r[0]));
    const blob = /<script type="application\/json" id="cleo-city">([\s\S]*?)<\/script>/.exec(h);
    if (blob) { const b = JSON.parse(blob[1]); Object.values(b.cats || {}).forEach(t => see('label table', t)); if (b.sig) see('signature', b.sig.t); }
  }
  chk(`${labels} labels on ${pages} city pages are sentence case`, pages >= 84 && labels > 1000 && !bad.length, bad.slice(0, 5));
}

console.log(failures ? `\n>>> FAIL — ${failures} casing check(s)` : '\n>>> PASS — casing: one helper matching the spec, no shouting styles, sentence-case labels on every city page');
process.exit(failures ? 1 : 0);
