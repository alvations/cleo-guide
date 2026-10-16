#!/usr/bin/env node
// QC-33 gate (FE-B): load CLS of every view opened by deep link, via QC's probe (tools/beta/qa/qc-view-cls.js: Cleveland,
// Tokyo, Pittsburgh × 390 / 1440 × gallery / atlas / guidebook / insights). Fails if any CLS >= 0.1, or if a phone (390)
// Guidebook / Insights load shifts at all. Run from tools/: node beta/feb-cls.js (its own server; no network).
'use strict';
const { spawnSync, execSync } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'feb-cls-')), 'cls');
let np = ''; try { np = execSync('npm root -g', { encoding: 'utf8' }).trim(); } catch (e) { /* local node_modules only */ }
const env = Object.assign({}, process.env, { NODE_PATH: [np, path.join(__dirname, '..', 'node_modules'), process.env.NODE_PATH].filter(Boolean).join(path.delimiter) });
const r = spawnSync(process.execPath, [path.join(__dirname, 'qa', 'qc-view-cls.js'), path.resolve(__dirname, '..', '..'), out], { stdio: 'inherit', env });
let rows = []; try { rows = JSON.parse(fs.readFileSync(out + '.json', 'utf8')); } catch (e) { console.log('>>> FAIL — the CLS probe wrote no result', r.status); process.exit(1); }
const bad = rows.filter(o => o.cls >= 0.1 || (o.vp === 390 && /guidebook|insights/.test(o.v) && o.cls > 0));
console.log(bad.length || rows.length !== 24 ? `>>> FAIL — QC-33 load CLS: ${bad.map(o => `${o.pg} ${o.vp} ${o.v} ${o.cls}`).join('; ') || rows.length + ' of 24 runs'}`
  : `>>> PASS — QC-33 load CLS < 0.1 on all 24 deep links (worst ${Math.max(...rows.map(o => o.cls))}); 390 Guidebook / Insights 0`);
process.exit(bad.length || rows.length !== 24 ? 1 : 0);
