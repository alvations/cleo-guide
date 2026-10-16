#!/usr/bin/env node
'use strict';
/**
 * test-css-has.js — a perf guard on the shipped beta CSS (QA-70). Part of `npm test`.
 * A `:has()` anchored on `html`, `:root`, `body` or `main` (including `:not(:has(…))` and a direct-child `:has(>…)`) is re-checked
 * by the browser on EVERY DOM change inside that element: each card stamped into <main>, each map pin. Four fe-a.css rules
 * of that kind (`main[data-city]:has(.views…)>.overlay…` from 7e746d9b, `main[data-city]:has(>.overlay…)>.cbar…`) blocked
 * the main thread and slowed "map pill → first pin" on the phone Gallery from ~1.6 s to ~2.5 s (Tokyo, 390). Key such
 * state on an attribute or class the script sets on the element instead (e.g. main[data-views-on]).
 * `:has()` on any other element (a card, a sheet, the masthead…) is fine: its re-checks stay inside that element.
 * The designer removed the last pre-existing ones from cleo.css (1cc48cc8, PERF-16); there is no allowlist.
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..', '..', 'beta', 'assets');
// the compound holding :has( is html / :root / body / main, optionally with [attr] / .class / #id / :pseudo(…) parts
const ANCHORED = /(?:(?:^|[\s>+~])(?:html|body|main)|:root)(?:\[[^\]]*\]|[.#][\w-]+|:(?!has\b|not\(:has)[\w-]+(?:\([^()]*\))?)*(?::not\()?:has\(/;
// split top-level selector lists (commas inside :is()/:has()/[…] stay)
const split = s => { const out = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(' || ch === '[') d++; else if (ch === ')' || ch === ']') d--; if (ch === ',' && !d) { out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; };
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.css')), bad = [];
for (const f of files) {
  const css = fs.readFileSync(path.join(DIR, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /([^{}@;]+)\{/g; let m;
  while ((m = re.exec(css))) for (const sel of split(m[1].replace(/\s+/g, ' ').trim())) {
    if (!/:has\(/.test(sel) || !ANCHORED.test(sel)) continue;
    bad.push(f + ': ' + sel);
  }
}
console.log('== CSS: no :has() anchored on html / :root / body / main (QA-70, PERF-16) ==');
console.log(`  ${bad.length ? 'FAIL' : 'PASS'}  ${files.length} shipped stylesheets: anchored :has() selectors${bad.length ? ' = ' + JSON.stringify(bad.slice(0, 8)) : ''}`);
const fail = bad.length;
console.log(fail ? `\n>>> FAIL — anchored :has() check` : '\n>>> PASS — no :has() anchored on html / :root / body / main');
process.exit(fail ? 1 : 0);
