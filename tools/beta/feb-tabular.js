// FE-B probe (R7-g6): tabular figures on numeric elements in the Guidebook facts (cover facts, edition line, chapter facts
// box, contents counts, ranks) and the Insights numbers (tiles, axis ticks, bar values, table cells). Counts every leaf
// element whose own text holds a digit, and how many render with font-variant-numeric: tabular-nums. Dates are
// exempt by design (they stay proportional: Inter's tabular hyphen spaces "2026-10-03" apart).
// Needs: python3 -m http.server 8765 -d <repo>. Run from tools/: node beta/feb-tabular.js
const { chromium } = require('playwright');
const SEL = {
  guidebook: '.gcover .gfacts, .gcover .edition, .facts-box, .toc .meta, .toc .n, .gs h3 .meta, .ge .rk',
  insights: '.ins .tiles b, .ins .tl, .ins svg text.ax, .ins svg text.vl, .ins table td, .ins .count',
};
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let worst = 100;
  for (const page of ['cities/tokyo.html', 'cleveland.html', 'Singapore/chinatown.html']) for (const v of ['guidebook', 'insights']) for (const w of [390, 1440]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto('http://127.0.0.1:8765/beta/' + page + '#view=' + v); await p.waitForTimeout(2200);
    if (v === 'insights') await p.evaluate(() => document.querySelectorAll('details.tbl').forEach(x => { x.open = true; x.dispatchEvent(new Event('toggle')); }));
    await p.waitForTimeout(300);
    const r = await p.evaluate(sel => {
      const els = [...document.querySelectorAll(sel)].flatMap(e => [e, ...e.querySelectorAll('*')]).filter(e => {
        const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.nodeValue).join('');
        return /\d/.test(own) && !/^\s*\d{4}-\d{2}-\d{2}\s*$/.test(own) && e.tagName !== 'TIME' && !e.closest('time');
      });
      const tab = els.filter(e => /tabular-nums/.test(getComputedStyle(e).fontVariantNumeric));
      return { n: els.length, tab: tab.length, off: els.filter(e => !tab.includes(e)).slice(0, 4).map(e => e.tagName.toLowerCase() + '.' + e.getAttribute('class') + ' "' + e.textContent.trim().slice(0, 24) + '"') };
    }, SEL[v]);
    const pct = r.n ? Math.round(100 * r.tab / r.n) : 100; worst = Math.min(worst, pct);
    console.log(`${pct >= 90 ? 'PASS' : 'FAIL'} ${page} ${v} ${w}: ${r.tab}/${r.n} = ${pct}%${r.off.length ? '  off: ' + r.off.join(' | ') : ''}`); await p.close();
  }
  await b.close(); console.log(worst >= 90 ? `>>> PASS — tabular figures >= 90 % (worst ${worst} %)` : `>>> FAIL — worst ${worst} %`); process.exit(worst >= 90 ? 0 : 1);
})();
