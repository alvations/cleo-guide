#!/usr/bin/env node
'use strict';
/**
 * run-tests.js — `npm test`, run as a parallel pool (platform perf audit, PERF-01).
 *
 * The SAME suites as before, every one of them, unchanged: only the scheduling changed. They are independent and
 * read-only against the repo (test-beta's builds are `build.js --check`, in memory; test-imagery writes only to its own
 * mkdtemp dir), so they can run side by side. Longest first, `--jobs` at a time (default: CPU count, max 4). Each
 * suite's output is buffered and printed in the original order, then a timing table. Exit 1 if ANY suite fails
 * (the old `a && b && …` chain stopped at the first failure; this one reports every failure). The serial chain stays
 * available as `npm run test:serial`.
 *
 *   node run-tests.js            # all suites in parallel
 *   node run-tests.js --jobs 1   # one at a time (same as test:serial, but runs every suite)
 */
const { spawn } = require('child_process');
const os = require('os');

// The suites ARE package.json "test:serial" (one source of truth: a suite added there runs here too). The seconds are a
// scheduling hint only (longest first); an unknown suite counts as 30 s.
const HINT = { 'beta/qa/one-search.js': 60, 'beta/qa/test-count-lines.js': 12, 'beta/test-css-min.js': 3, 'beta/qa/test-no-input-sniffing.js': 1, 'beta/qa/test-reachable-styles.js': 78, 'beta/test-fe-a.js': 118, 'beta/test-views.js': 116, 'beta/qa/test-honesty.js': 53, 'beta/test-beta.js': 35,
  'beta/test-hubs.js': 34, 'beta/qa/test-contract.js': 14, 'beta/imagery/test-imagery.js': 10, 'test-singapore.js': 8, 'test.js': 4 };
const SUITES = require('./package.json').scripts['test:serial'].split('&&').map(c => c.trim().split(/\s+/))
  .map(([cmd, ...args]) => [cmd, args, HINT[args[0]] != null ? HINT[args[0]] : 30]);

const argv = process.argv.slice(2);
const ji = argv.indexOf('--jobs');
const JOBS = Math.max(1, ji >= 0 ? +argv[ji + 1] : Math.min(4, os.cpus().length));

function run([cmd, args]) {
  return new Promise(resolve => {
    const t0 = Date.now(), out = [];
    const p = spawn(cmd, args, { cwd: __dirname, env: process.env });
    p.stdout.on('data', d => out.push(d)); p.stderr.on('data', d => out.push(d));
    p.on('close', code => resolve({ code, secs: (Date.now() - t0) / 1000, out: Buffer.concat(out).toString() }));
    p.on('error', e => resolve({ code: 1, secs: (Date.now() - t0) / 1000, out: String(e) }));
  });
}

(async () => {
  const t0 = Date.now(), res = new Array(SUITES.length);
  const queue = SUITES.map((s, i) => i).sort((a, b) => SUITES[b][2] - SUITES[a][2]);
  await Promise.all(Array.from({ length: JOBS }, async () => {
    while (queue.length) { const i = queue.shift(); res[i] = await run(SUITES[i]); }
  }));
  SUITES.forEach(([cmd, args], i) => { process.stdout.write(`\n######## ${cmd} ${args.join(' ')}\n`); process.stdout.write(res[i].out); });
  console.log('\n== npm test: suite timings (jobs ' + JOBS + ') ==');
  SUITES.forEach(([cmd, args], i) => console.log(`  ${res[i].code === 0 ? 'PASS' : 'FAIL'}  ${(cmd + ' ' + args.join(' ')).padEnd(36)} ${res[i].secs.toFixed(1).padStart(6)} s`));
  const failed = res.filter(r => r.code !== 0).length;
  console.log(`  wall ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  // exitCode, not process.exit(): on a pipe (CI) stdout writes are async, and exit() cut the buffered suite output and this
  // summary mid-line, so a red run showed no failing suite (imagery, fetch run #70)
  if (failed) { console.log(`>>> FAIL — ${failed} test suite(s) failed`); process.exitCode = 1; return; }
  console.log('>>> ALL SUITES PASS');
})();
