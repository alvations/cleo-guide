#!/usr/bin/env node
/**
 * Beta contract test (QA lane) — fast, static, part of `npm test`.
 * For every page the NEW beta engine generated (beta/data/manifest.json, gen "new"), parse the HTML with jsdom
 * (no scripts, no network) and assert the hard rules that must hold before any JS runs:
 *   - city pages: one li.pl per live record (count + sight/food split), unique stable ids   (rule 1)
 *   - every card has a non-empty "Recommended by" (.pl-s)                                    (rule 2, G6)
 *   - every closed card says "closed" and shows no tier label/glyph                          (rule 4c, D-10, B-12)
 *   - no third-party script/style/font host referenced (content never depends on a CDN)      (rule 4, G4)
 *   - every localStorage use sits in a try block in the shipped client JS                    (rule 5, G8)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { expectedFor } = require('./contract.js');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const man = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'manifest.json'), 'utf8'));
const TIER = /\b(Must see|Worth the detour|Deep cut)\b/;
let fails = 0, checked = 0;
const ok = (c, msg) => { if (!c) { fails++; console.log('  FAIL ', msg); } };

for (const rel of man.generated || []) {
  const f = path.join(BETA, rel);
  if (!fs.existsSync(f)) { ok(false, rel + ' listed as generated but missing'); continue; }
  const html = fs.readFileSync(f, 'utf8');
  const doc = new JSDOM(html).window.document;
  checked++;
  // no off-origin render dependency (links to sources in <a href> are fine; resources are not)
  for (const el of doc.querySelectorAll('script[src], link[rel~=stylesheet][href], link[rel=preload][href], img[src]')) {
    const u = el.getAttribute('src') || el.getAttribute('href');
    ok(!/^(https?:)?\/\//i.test(u), `${rel}: off-origin resource ${u}`);
  }
  const exp = expectedFor('beta/' + rel);
  const cards = [...doc.querySelectorAll('li.pl')];
  if (doc.documentElement.getAttribute('data-cleo-page') !== 'city') continue;
  if (exp) {
    ok(cards.length === exp.total, `${rel}: ${cards.length} cards != live ${exp.total}`);
    const s = cards.filter(c => c.getAttribute('data-k') === 's').length;
    ok(s === exp.sights && cards.length - s === exp.food, `${rel}: split ${s}/${cards.length - s} != live ${exp.sights}/${exp.food}`);
  } else ok(false, `${rel}: no manifest counts`);
  const ids = cards.map(c => c.id);
  ok(ids.every(i => /^p-[a-z0-9-]+$/.test(i)), `${rel}: card without a stable id`);
  ok(new Set(ids).size === ids.length, `${rel}: duplicate place ids`);
  const noAttr = cards.filter(c => !(c.querySelector('.pl-s') && c.querySelector('.pl-s').textContent.trim()));
  ok(!noAttr.length, `${rel}: ${noAttr.length} cards without "Recommended by" (${noAttr.slice(0, 3).map(c => c.id)})`);
  const closed = cards.filter(c => c.hasAttribute('data-closed') || c.classList.contains('pl--closed'));
  for (const c of closed) {
    ok(/closed/i.test(c.textContent), `${rel}: closed ${c.id} not flagged`);
    const tierEl = c.querySelector('.tier, .pl-tier, [data-tier]');
    const eyebrow = (c.querySelector('.pl-e') || { textContent: '' }).textContent;
    ok(!tierEl && !TIER.test(eyebrow), `${rel}: closed ${c.id} shows a tier`);
  }
  console.log(`  PASS  ${rel}: ${cards.length} cards, ${closed.length} closed, attribution 100%`);
}

// localStorage only inside try blocks in shipped client JS
const jsDir = path.join(BETA, 'assets', 'js');
for (const f of fs.existsSync(jsDir) ? fs.readdirSync(jsDir).filter(x => x.endsWith('.js')) : []) {
  const src = fs.readFileSync(path.join(jsDir, f), 'utf8');
  const lines = src.split('\n');
  lines.forEach((ln, i) => {
    if (!/localStorage\s*[.[]/.test(ln)) return;
    const before = lines.slice(Math.max(0, i - 6), i + 1).join('\n');
    ok(/\btry\s*\{/.test(before), `beta/assets/js/${f}:${i + 1}: localStorage outside try/catch`);
  });
}

console.log(fails ? `\n>>> FAIL — beta contract: ${fails} problem(s) over ${checked} generated page(s)` : `\n>>> PASS — beta contract holds on ${checked} generated page(s)`);
process.exit(fails ? 1 : 0);
