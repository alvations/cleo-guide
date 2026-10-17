#!/usr/bin/env node
/**
 * Beta QC S-17 → overlay ledger (docs/BETA-OVERLAY-LEDGER.md, which QC keeps). Reads an audit's groups.json
 * (qc-overlay.js) and writes one ledger row per instance kind × view: where it happens (viewports, themes, pages), what was
 * measured per viewport against the OV-00 budget (failing runs / runs, worst value, worst page, screenshot), the owner lane
 * and the status. A later audit (another SHA) updates the same rows instead of adding new ones: each row carries its key in
 * an HTML comment, and the audit's measurement is appended as "<label>: …". A row whose key no longer fails on a later
 * audit is reported as "not reproduced on <label>" (it closes only when QC verifies the fix on a pinned SHA).
 * Usage (from tools/): node beta/qa/qc-overlay-ledger.js --label <audit label> [--write]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const argv = process.argv.slice(2), opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const ROOT = path.resolve(__dirname, '..', '..', '..');
const LABEL = opt('--label'), LEDGER = path.join(ROOT, 'docs', 'BETA-OVERLAY-LEDGER.md');
const SKIP = (opt('--skip', '') || '').split(',').filter(Boolean);   // kinds left out of this audit's rows (re-measured elsewhere)
const G = JSON.parse(fs.readFileSync(path.join(ROOT, 'design', 'beta', 'eval', 'qc', 'overlay', LABEL, 'groups.json'), 'utf8')).filter(g => !SKIP.includes(g.kind));
const VK = { '390x844': 'P1', '390x664': 'P2', '844x390': 'L', '768x1024': 'T1', '1024x768': 'T2', '1440x900': 'D' };
const ORDER = ['390x844', '390x664', '844x390', '768x1024', '1024x768', '1440x900'];
const WHAT = {
  chromeRest: 'Fixed or sticky chrome at rest takes more of the screen than its budget',
  chromePan: 'Chrome does not step aside during a map pan (switch and chip rows, peek)',
  chromeScroll: 'Second sticky rows do not hide after a 600 px scroll',
  clearRest: 'Clear map at rest is under budget', clearPan: 'Clear map during a pan is under budget',
  labelCount: 'More map labels than the cap', labelCov: 'Map labels cover more of the map than the cap',
  labelWidth: 'A map label is wider than the cap', labelGap: 'Map labels closer than 4 px',
  searchHereOnLoad: '"Search this area" shows on the first screen', attribution: 'The map credit stays a wide pill after the first pan',
  mapControl: 'A floating control named "Map" (reads as a view next to "Atlas")', nearMeTwice: '"Near me" offered more than once on one screen',
  toast: 'A toast or status pill is still up 4 s after load', duplicates: 'The same action offered twice on one screen',
  controlCollision: 'Fixed or floating controls overlap each other', controlCovered: 'A shown control is covered by another layer and cannot be tapped', controlOverPin: 'A fixed or floating control sits over a pin',
  labelOverControl: 'A map label sits under or over a control', defaultNotAtlas: 'A cold load with no hash does not open Atlas (D-46)', firstScreenChrome: 'The cold first screen (Atlas, D-46) carries more chrome than OV-00 at rest', firstScreenClear: 'The cold first screen (Atlas, D-46) shows less clear map than OV-00 at rest', translucentChrome: 'The top bar is see-through (alpha < 1 or a backdrop blur), so content ghosts under it', error: 'The probe could not load or measure the page' };
const pageSet = l => { const s = new Set(); l.forEach(g => g.pages.forEach(p => s.add(p))); return s; };
const by = {}; G.forEach(g => { const k = g.kind + ':' + (g.view === 'page' ? 'page' : g.view); (by[k] = by[k] || []).push(g); });
// Severity (ledger rule, QC 2026-10-17): High = a collision, or > 2× the budget (clear map: the covered share > 2× the allowed
// share); Low = over by ≤ 10 %; Med = the rest (over budget, or an OV-00 rule broken). A row takes its worst viewport.
const RANK = { Low: 1, Med: 2, High: 3 };
const sev = g => { if (/^(controlCollision|controlOverPin|labelOverControl|controlCovered)$/.test(g.kind)) return 'High';
  if (!/^[≤≥]/.test(g.budget || '')) return 'Med';   // a rule ("collapses to ⓘ … after 5 s"), not a number
  const b = parseFloat((/[\d.]+/.exec(g.budget || '') || [])[0]), w = parseFloat(g.worst); if (isNaN(b) || isNaN(w)) return 'Med';
  const r = /≥/.test(g.budget) ? (100 - w) / Math.max(1, 100 - b) : w / Math.max(1, b); return r > 2 ? 'High' : r <= 1.1 ? 'Low' : 'Med'; };
const rowSev = l => l.map(sev).reduce((a, x) => (RANK[x] > RANK[a] ? x : a), 'Low');
const clean = t => String(t).replace(/\|/g, '/');   // QA's B-25 splits rows on every pipe
let L = fs.readFileSync(LEDGER, 'utf8').split('\n');
const keyRow = k => L.findIndex(l => l.includes('<!--k:' + k + '-->'));
const H = L.find(l => /^\| Id \|/.test(l)).split(' | '), SI = H.findIndex(h => /Severity/.test(h)), MI = H.findIndex(h => /Measured/.test(h));
let next = Math.max(99, ...L.map(l => (/^\| OV-(\d+)/.exec(l) || [0, 0])[1]).map(Number).filter(x => x >= 100)) + 1;   // S-17 rows: OV-100 and up
const measured = l => l.slice().sort((a, b) => ORDER.indexOf(a.vp) - ORDER.indexOf(b.vp))
  .map(g => `${VK[g.vp]} ${clean(g.worst).slice(0, 60)} (budget ${g.budget}; ${g.runs}/${g.of} runs; worst ${g.worstPage.replace(/\.html$/, '')} · ${g.worstTheme}${g.shot ? '; `' + g.shot.replace(/^design\/beta\/eval\/qc\/overlay\//, '') + '`' : ''})`).join('<br>');
const added = [], updated = [], counts = {};
for (const [k, l] of Object.entries(by)) {
  const [kind, view] = k.split(':'); const owner = l[0].owner; const pages = pageSet(l); const themes = [...new Set(l.flatMap(g => g.themes))].join(' + ');
  const vps = l.map(g => VK[g.vp]).sort((a, b) => ORDER.map(v => VK[v]).indexOf(a) - ORDER.map(v => VK[v]).indexOf(b)).join(' ');
  const where = `${view === 'page' ? 'hubs, landing, trip, saved, method, accessibility' : view} · ${vps} · ${themes} · ${pages.size} page${pages.size === 1 ? '' : 's'}`;
  const m = `**${LABEL}:** ${measured(l)}`;
  const sv = rowSev(l); counts[owner] = counts[owner] || { High: 0, Med: 0, Low: 0 }; counts[owner][sv]++;
  const i = keyRow(k);
  if (i >= 0) { const c = L[i].split(' | '); c[MI] = c[MI] + '<br>' + m; c[SI] = rowSev(l); L[i] = c.join(' | '); updated.push(k); }   // the latest audit sets the severity
  else { const id = 'OV-' + (next++);
    const last = L.reduce((x, l, j) => (/^\| OV-\d+/.test(l) ? j : x), -1);   // keep the table whole: insert after its last row
    L.splice(last + 1, 0, `| ${id} | ${where} | ${WHAT[kind] || kind} <!--k:${k}--> | ${m} | ${owner} | ${rowSev(l)} | open |`); added.push(id + ' ' + k); }
}
// rows from earlier audits that this audit no longer reproduces
const SCOPE = (opt('--views', '') || '').split(',').filter(Boolean);   // an audit of some views only judges rows of those views
const gone = []; L.forEach((l, i) => { const m = /<!--k:([^>]+)-->/.exec(l); if (m && (!SCOPE.length || SCOPE.includes(m[1].split(':')[1])) && !by[m[1]] && !l.includes('not reproduced on ' + LABEL)) { const c = l.split(' | '); c[MI] = c[MI] + `<br>**${LABEL}:** not reproduced`; L[i] = c.join(' | '); gone.push(m[1]); } });
console.log(JSON.stringify({ label: LABEL, added: added.length, updated: updated.length, notReproduced: gone.length, rowsByOwner: counts }, null, 1));
if (argv.includes('--write')) fs.writeFileSync(LEDGER, L.join('\n').replace(/\n*$/, '\n'));
