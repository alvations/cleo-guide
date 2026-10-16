#!/usr/bin/env node
// FE-B browser probes in one run (npm run beta:probe:fe-b): starts a static server for the repo on :8765 if none is up,
// then runs each probe and exits non-zero if any fails. Probes: feb-g2 (R7-g2 g + h), feb-switcher (QC-09 / QC-06 / QC-10),
// feb-p03 (QC-10 focus), feb-ind (QC-18 thumb), feb-tabular (R7-g6 figures), feb-b05 (B-05 cards above the phone fold), feb-cls (QC-33 view
// deep-link load CLS; runs its own server).
'use strict';
const { spawn, spawnSync } = require('child_process'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '../..');
const up = () => new Promise(r => http.get('http://127.0.0.1:8765/beta/index.html', res => { res.resume(); r(res.statusCode === 200); }).on('error', () => r(false)));
(async () => {
  let srv = null;
  if (!(await up())) { srv = spawn('python3', ['-m', 'http.server', '8765', '-d', ROOT], { stdio: 'ignore' }); for (let i = 0; i < 40 && !(await up()); i++) await new Promise(r => setTimeout(r, 250)); }
  let bad = 0;
  for (const p of ['feb-g2.js', 'feb-switcher.js', 'feb-p03.js', 'feb-ind.js', 'feb-tabular.js', 'feb-b05.js', 'feb-cls.js']) {
    console.log(`\n== ${p}`); const r = spawnSync(process.execPath, [path.join(__dirname, p)], { stdio: 'inherit' }); if (r.status) bad++;
  }
  if (srv) srv.kill();
  console.log(bad ? `\n>>> FAIL — ${bad} FE-B probe(s)` : '\n>>> PASS — FE-B browser probes'); process.exit(bad ? 1 : 0);
})();
