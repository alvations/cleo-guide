#!/usr/bin/env node
// FE-B (R7 gap 5 sweep): read design/beta/eval/w8/metrics-all/*.json (tools/beta/feb-metrics-batch.sh) and list every page
// that fails B-04 (the collection rail on the first phone screen; place pages only) or B-20 (tap targets < 44 x 44 on
// mobile, prose links exempt), with the failing nodes grouped by selector. Writes metrics-all/REPORT.md.
'use strict';
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '../../design/beta/eval/w8/metrics-all');
const rows = [];
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort()) {
  let j; try { j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (e) { continue; }
  for (const p of j.pages || []) {
    const mo = p.mobile || {}, place = /data-cleo-page="city"/.test(fs.readFileSync(path.resolve(__dirname, '../../beta', p.page), 'utf8'));
    const kinds = {}; (mo.tapSmallList || []).forEach(s => { const k = s.replace(/ "[^"]*"/, '').replace(/ \d+x\d+$/, ''); kinds[k] = (kinds[k] || 0) + 1; });
    rows.push({ page: p.page, place, b04: place ? !!mo.railOnFirstScreen : null, railTop: mo.railTop, b20: mo.tapSmall || 0, kinds, sample: (mo.tapSmallList || []).slice(0, 3) });
  }
}
const f04 = rows.filter(r => r.b04 === false), f20 = rows.filter(r => r.b20 > 0);
const byKind = {}; f20.forEach(r => Object.entries(r.kinds).forEach(([k, n]) => { (byKind[k] = byKind[k] || { n: 0, pages: [] }).n += n; byKind[k].pages.push(r.page); }));
const md = [`# B-04 / B-20 sweep (${rows.length} pages measured)`, '',
  `- **B-04** (rail on the first phone screen, place pages): ${f04.length} failing of ${rows.filter(r => r.place).length}`,
  `- **B-20** (mobile taps < 44 px): ${f20.length} pages failing`, '', '## B-20 by node', '', '| Node | Count | Pages |', '|---|---|---|',
  ...Object.entries(byKind).sort((a, b) => b[1].n - a[1].n).map(([k, v]) => `| \`${k}\` | ${v.n} | ${v.pages.length}: ${v.pages.slice(0, 6).join(', ')}${v.pages.length > 6 ? ' …' : ''} |`),
  '', '## B-04 failures', '', ...(f04.length ? f04.map(r => `- ${r.page} (rail top ${r.railTop})`) : ['none']),
  '', '## B-20 per page', '', ...f20.map(r => `- ${r.page}: ${r.b20} — ${r.sample.join('; ')}`)].join('\n');
fs.writeFileSync(path.join(DIR, 'REPORT.md'), md + '\n');
console.log(md.split('\n').slice(0, 30).join('\n'));
