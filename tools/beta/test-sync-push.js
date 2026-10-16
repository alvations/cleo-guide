#!/usr/bin/env node
'use strict';
/**
 * test-sync-push.js — tools/beta/sync-push.sh in a scratch repo (no network, nothing of this repo touched). Part of `npm test`.
 * The case it guards (platform, 2026-10-16): origin's commit changes a SOURCE only, ours changes another source + its
 * beta/; the merge is clean (no conflict), but beta/ is stale until rebuilt. The pushed HEAD must CONTAIN the rebuilt
 * beta/ (before the fix it was staged and never committed), and a dirty beta/ must never push.
 */
const { execSync } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
const SCRIPT = path.join(__dirname, 'sync-push.sh');
const T = fs.mkdtempSync(path.join(os.tmpdir(), 'cleo-sync-push-')), BR = 'claude/peaceful-goodall-i0hsrt';
const sh = (cmd, cwd) => execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'pipe'], env: Object.assign({}, process.env, { GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' }) }).toString().trim();
const w = (dir, f, s) => { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), s); };
let fails = 0; const chk = (name, ok, v) => { console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : ' = ' + JSON.stringify(v)}`); if (!ok) fails++; };
try {
  const O = path.join(T, 'origin.git'), A = path.join(T, 'a'), B = path.join(T, 'b');
  sh(`git init -q --bare "${O}"`);
  sh(`git init -q "${A}"`); sh(`git checkout -q -b ${BR}`, A);
  // a toy "build": beta/out.txt = src/a.txt + src/b.txt; --check compares
  w(A, 'tools/beta/build.js', "const fs=require('fs'),p=require('path'),R=p.resolve(__dirname,'..','..');const o=fs.readFileSync(p.join(R,'src/a.txt'),'utf8')+fs.readFileSync(p.join(R,'src/b.txt'),'utf8');" +
    "if(process.argv.includes('--check')){process.exit(fs.readFileSync(p.join(R,'beta/out.txt'),'utf8')===o?0:1)}fs.mkdirSync(p.join(R,'beta'),{recursive:true});fs.writeFileSync(p.join(R,'beta/out.txt'),o);");
  w(A, 'tools/package.json', JSON.stringify({ name: 't', private: true, scripts: { 'beta:check': 'node beta/build.js --check' } }));
  w(A, 'src/a.txt', 'a0\n'); w(A, 'src/b.txt', 'b0\n'); sh('node tools/beta/build.js', A);
  sh(`git add -A && git commit -q -m base && git remote add origin "${O}" && git push -q origin ${BR}`, A);
  sh(`git clone -q -b ${BR} "${O}" "${B}"`);
  // origin moves: B changes src/b.txt only (its beta/ commit is what goes stale)
  w(B, 'src/b.txt', 'b1\n'); sh('git commit -qam "b: source only" && git push -q origin ' + BR, B);
  // we change src/a.txt and rebuild our beta/
  w(A, 'src/a.txt', 'a1\n'); sh('node tools/beta/build.js && git commit -qam "a: source + beta"', A);
  let out = ''; try { out = sh(`CLEO_TRAILERS="X-Test: 1" bash "${SCRIPT}"`, A); } catch (e) { out = String(e.stdout || '') + String(e.stderr || ''); }
  chk('sync-push succeeds on a clean merge that needs a beta/ rebuild', /PUSHED-VERIFIED/.test(out), out);
  const remoteOut = sh(`git --git-dir="${O}" show ${BR}:beta/out.txt`);
  chk('the pushed HEAD contains the regenerated beta/ (a1 + b1)', remoteOut === 'a1\nb1', remoteOut);
  chk('working tree clean after the push (nothing left staged)', sh('git status --porcelain', A) === '', sh('git status --porcelain', A));
  // a dirty beta/ never pushes
  w(A, 'beta/out.txt', 'tampered\n'); let rc = 0; try { sh(`bash "${SCRIPT}"`, A); } catch (e) { rc = e.status; }
  chk('a dirty, uncommitted beta/ refuses to push (exit 6)', rc === 6, rc);
} catch (e) { chk('scratch-repo setup', false, String(e.stderr || e).slice(0, 300)); }
finally { fs.rmSync(T, { recursive: true, force: true }); }
console.log(fails ? `\n>>> FAIL — sync-push: ${fails} check(s)` : '\n>>> PASS — sync-push: a clean merge pushes its rebuilt beta/; a dirty beta/ never pushes');
process.exit(fails ? 1 : 0);
