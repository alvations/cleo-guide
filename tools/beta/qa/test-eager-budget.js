#!/usr/bin/env node
'use strict';
/**
 * test-eager-budget.js (platform) — the eager-JS budget alone, in < 1 s: the client JS any one generated page loads, gzip,
 * unrounded, ≤ 40.0 KB (the same computation as test-beta's budget row). tools/beta/sync-push.sh runs it AFTER merging
 * origin, so two lanes' green commits that together go over the cap cannot be pushed (the merge race of 8846b138).
 * Also prints the headroom. Usage: node tools/beta/qa/test-eager-budget.js [capKB=40.0]
 */
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const BETA = path.resolve(__dirname, '..', '..', '..', 'beta'), CAP = +(process.argv[2] || 40.0);
const gz = p => zlib.gzipSync(fs.readFileSync(path.join(BETA, p))).length;
const generated = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'manifest.json'), 'utf8')).generated;
let max = ['', 0];
for (const p of generated) {
  const f = path.join(BETA, p); if (!fs.existsSync(f)) continue;
  const files = [...new Set([...fs.readFileSync(f, 'utf8').matchAll(/src="(?:\.\.\/)*(assets\/js\/[a-z-]+\.js)\?/g)].map(m => m[1]))];
  const z = files.reduce((t, x) => t + gz(x), 0); if (z > max[1]) max = [p, z];
}
const kb = +(max[1] / 1024).toFixed(2), ok = kb <= CAP;
console.log(`  ${ok ? 'PASS' : 'FAIL'}  eager JS, heaviest page ${max[0]}: ${kb} KB gzip of ${CAP} (headroom ${(CAP - kb).toFixed(2)} KB)`);
process.exit(ok ? 0 : 1);
