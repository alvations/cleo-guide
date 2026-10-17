#!/usr/bin/env node
/* test-css-min.js (platform, R8 gap #6): the build's CSS minify (build.js cssMin) changes bytes, never rules. Chromium
 * parses each lane stylesheet's source and its shipped minified copy; every rule must serialize identically, in order. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const load = () => { for (const p of [process.env.NODE_PATH, '/opt/node22/lib/node_modules', path.join(ROOT, 'tools/node_modules')]) { try { return require(require.resolve('playwright', { paths: [p].filter(Boolean) })); } catch (e) { /* next */ } } return null; };
const R = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const PAIRS = [[['fe-a.css', 'atlas.css', 'atlas-nav.css', 'fe-c.css'].map(f => R('tools/beta/lib/render/' + f)).join('\n'), R('beta/assets/fe-a.css'), 'fe-a.css'],
  [R('tools/beta/lib/render/fe-b.css'), R('beta/assets/fe-b.css'), 'fe-b.css']];
(async () => {
  const pw = load(); if (!pw) { console.log('  SKIP  test-css-min: playwright not found'); return; }
  let b; try { b = await pw.chromium.launch(); } catch (e) { b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const p = await b.newPage(); let fail = 0;
  for (const [src, min, name] of PAIRS) {
    const rules = css => p.evaluate(t => { const s = new CSSStyleSheet(); s.replaceSync(t); const out = []; const walk = l => { for (const r of l) { out.push(r.cssText); } }; walk(s.cssRules); return out; }, css);
    const a = await rules(src), z = await rules(min);
    const same = a.length === z.length && a.every((x, i) => x === z[i]);
    const at = same ? -1 : a.findIndex((x, i) => x !== z[i]);
    if (!same) fail++;
    console.log(`  ${same ? 'PASS' : 'FAIL'}  ${name}: ${a.length} rules identical after minify (${(Buffer.byteLength(min) / 1024).toFixed(1)} KB shipped)${same ? '' : ' — first difference #' + at + ': ' + String(a[at]).slice(0, 120) + ' ≠ ' + String(z[at]).slice(0, 120)}`);
  }
  await b.close();
  if (fail) { console.log('>>> FAIL — the CSS minify changed a rule'); process.exit(1); }
  console.log('>>> PASS — the CSS minify keeps every rule');
})();
