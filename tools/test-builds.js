#!/usr/bin/env node
'use strict';
/**
 * test-builds.js — every page build script runs clean (CLAUDE.md rule 2). Part of `npm test`.
 * Each tools/build-*.py must exit 0, and the page it writes must equal the committed one. Its guards ("Cleveland leaked
 * into data", the geocode gate, tier-1 per area…) now run BEFORE the write, so a failing guard never leaves a written
 * page behind a non-zero exit (Erie, 2026-10-16). The builds run in a scratch copy of the working tree (the tracked
 * files minus beta/, design/, docs/, qa/, versions/ and images), so the parallel test pool never reads a half-written page.
 */
const { execFileSync, execSync } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const T = fs.mkdtempSync(path.join(os.tmpdir(), 'cleo-builds-'));
let fails = 0; const chk = (name, ok, v) => { console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok || v === undefined ? '' : ' = ' + JSON.stringify(v)}`); if (!ok) fails++; };
console.log('== page build scripts: exit 0, guards before the write, output == committed page ==');
try {
  const files = execSync('git ls-files', { cwd: ROOT, maxBuffer: 64 << 20 }).toString().split('\n')
    .filter(f => f && !/^(beta|design|docs|qa|versions)\//.test(f) && !/\.(jpe?g|png|webp|gif)$/i.test(f) && fs.existsSync(path.join(ROOT, f)));
  for (const f of files) { fs.mkdirSync(path.dirname(path.join(T, f)), { recursive: true }); fs.copyFileSync(path.join(ROOT, f), path.join(T, f)); }
  const builds = fs.readdirSync(path.join(T, 'tools')).filter(f => /^build-.*\.py$/.test(f)).sort();
  const bad = [];
  for (const b of builds) {
    try { execFileSync('python3', [path.join(T, 'tools', b)], { cwd: path.join(T, 'tools'), stdio: 'pipe', timeout: 120000 }); }
    catch (e) { bad.push(`${b}: exit ${e.status} — ${String(e.stderr || '').trim().split('\n').pop().slice(0, 140)}`); }
  }
  chk(`all ${builds.length} tools/build-*.py exit 0`, !bad.length, bad);
  const drift = files.filter(f => /\.html$/.test(f) && !fs.readFileSync(path.join(T, f)).equals(fs.readFileSync(path.join(ROOT, f))));
  chk('every page they write equals the committed page (no stale or hand-edited output)', !drift.length, drift.slice(0, 10));
  // static: no top-level check on `new` follows the write in any build script (the ordering this test exists for)
  const late = [];
  for (const b of builds.concat(['belgium_build.py'])) {
    const L = fs.readFileSync(path.join(ROOT, 'tools', b), 'utf8').split('\n'), w = L.findIndex(l => /open\(OUT, *"w"[^)]*\)\.write\(new\)/.test(l));
    if (w < 0) continue; const ind = L[w].match(/^\s*/)[0];
    if (L.slice(w + 1).some(l => l.startsWith(ind + 'assert '))) late.push(b);
  }
  chk('no build script asserts on `new` after writing it', !late.length, late);
} catch (e) { chk('setup', false, String(e).slice(0, 200)); }
finally { fs.rmSync(T, { recursive: true, force: true }); }
console.log(fails ? `\n>>> FAIL — page builds: ${fails} check(s)` : '\n>>> PASS — page builds: every script exits 0, checks before the write, output == committed');
process.exit(fails ? 1 : 0);
