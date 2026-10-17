#!/usr/bin/env node
'use strict';
/**
 * test-dom-budget.js — the M3-06 initial-DOM budget in `npm test` (≈ 10 s, real Chromium): QA's own `w2.js --only dom`
 * (Tokyo + New York, phone + desktop: initial DOM ≤ 3,000 nodes, every place reachable after stamp-all, 0 JS errors).
 * It crept to 3,082 on Tokyo desktop (W9-1 badges + W9-2 status lines + a below-fold second Gallery row built at load)
 * before anything noticed. Leaves the tree as it was: removes the w2-dom.json it writes unless it was already tracked.
 */
const { spawnSync, execSync } = require('child_process'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..'), OUT = path.join(ROOT, 'qa', 'beta-w2', 'w2-dom.json');
let tracked = false; try { execSync('git ls-files --error-unmatch qa/beta-w2/w2-dom.json', { cwd: ROOT, stdio: 'ignore' }); tracked = true; } catch (e) {}
const r = spawnSync(process.execPath, [path.join(__dirname, 'w2.js'), '--only', 'dom'], { cwd: path.join(ROOT, 'tools'), encoding: 'utf8', timeout: 300000 });
const out = (r.stdout || '') + (r.stderr || '');
if (tracked) { try { execSync('git checkout -q -- qa/beta-w2/w2-dom.json', { cwd: ROOT }); } catch (e) {} } else { try { fs.unlinkSync(OUT); } catch (e) {} }
if (/SKIP|Playwright not (available|found)/i.test(out) && !/\[dom\]/.test(out)) { console.log('>>> SKIP — DOM budget: Playwright not available'); process.exit(0); }
out.split('\n').filter(l => /\[dom\]|>>>/.test(l)).forEach(l => console.log(l));
const m = /(\d+)\/(\d+) PASS, (\d+) FAIL/.exec(out), ok = r.status === 0 && m && m[3] === '0' && +m[2] >= 12;
console.log(ok ? '\n>>> PASS — initial DOM budget (M3-06): Tokyo + New York, phone + desktop ≤ 3,000 nodes' : '\n>>> FAIL — initial DOM budget (M3-06)');
process.exit(ok ? 0 : 1);
