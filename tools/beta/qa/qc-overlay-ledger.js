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
const G = JSON.parse(fs.readFileSync(path.join(ROOT, 'design', 'beta', 'eval', 'qc', 'overlay', LABEL, 'groups.json'), 'utf8'));
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
  controlCollision: 'Fixed or floating controls overlap each other', controlOverPin: 'A fixed or floating control sits over a pin',
  labelOverControl: 'A map label sits under or over a control', error: 'The probe could not load or measure the page' };
const pageSet = l => { const s = new Set(); l.forEach(g => g.pages.forEach(p => s.add(p))); return s; };
const by = {}; G.forEach(g => { const k = g.kind + '|' + (g.view === 'page' ? 'page' : g.view); (by[k] = by[k] || []).push(g); });
let L = fs.readFileSync(LEDGER, 'utf8').split('\n');
const keyRow = k => L.findIndex(l => l.includes('<!--k:' + k + '-->'));
let next = Math.max(0, ...L.map(l => (/^\| OV-(\d+)/.exec(l) || [0, 0])[1]).map(Number)) + 1;
const measured = l => l.slice().sort((a, b) => ORDER.indexOf(a.vp) - ORDER.indexOf(b.vp))
  .map(g => `${VK[g.vp]} ${String(g.worst).replace(/\|/g, '\\|').slice(0, 60)} (budget ${g.budget}; ${g.runs}/${g.of} runs; worst ${g.worstPage.replace(/\.html$/, '')} · ${g.worstTheme}${g.shot ? '; `' + g.shot.replace(/^design\/beta\/eval\/qc\/overlay\//, '') + '`' : ''})`).join('<br>');
const added = [], updated = [], counts = {};
for (const [k, l] of Object.entries(by)) {
  const [kind, view] = k.split('|'); const owner = l[0].owner; const pages = pageSet(l); const themes = [...new Set(l.flatMap(g => g.themes))].join(' + ');
  const vps = l.map(g => VK[g.vp]).sort((a, b) => ORDER.map(v => VK[v]).indexOf(a) - ORDER.map(v => VK[v]).indexOf(b)).join(' ');
  const where = `${view === 'page' ? 'hubs, landing, trip, saved, method, accessibility' : view} · ${vps} · ${themes} · ${pages.size} page${pages.size === 1 ? '' : 's'}`;
  const m = `**${LABEL}:** ${measured(l)}`;
  counts[owner] = (counts[owner] || 0) + 1;
  const i = keyRow(k);
  if (i >= 0) { const c = L[i].split(' | '); c[3] = c[3] + '<br>' + m; L[i] = c.join(' | '); updated.push(k); }
  else { const id = 'OV-' + String(next++).padStart(2, '0');
    const last = L.reduce((x, l, j) => (/^\| OV-\d+/.test(l) ? j : x), -1);   // keep the table whole: insert after its last row
    L.splice(last + 1, 0, `| ${id} <!--k:${k}--> | ${where} | ${WHAT[kind] || kind} | ${m} | ${owner} | open |`); added.push(id + ' ' + k); }
}
// rows from earlier audits that this audit no longer reproduces
const gone = []; L.forEach((l, i) => { const m = /<!--k:([^>]+)-->/.exec(l); if (m && !by[m[1]] && !l.includes('not reproduced on ' + LABEL)) { const c = l.split(' | '); c[3] = c[3] + `<br>**${LABEL}:** not reproduced`; L[i] = c.join(' | '); gone.push(m[1]); } });
console.log(JSON.stringify({ label: LABEL, added: added.length, updated: updated.length, notReproduced: gone.length, rowsByOwner: counts }, null, 1));
if (argv.includes('--write')) fs.writeFileSync(LEDGER, L.join('\n').replace(/\n*$/, '\n'));
