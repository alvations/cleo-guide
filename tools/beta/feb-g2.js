// FE-B probe (R7-g2 g + h) over the landing, every country hub and all 84 city pages, at 390 and 1440:
//  (g) no single-word last line in the dek, the masthead stat line, the lead line (city), the hub "Known for" + stat line,
//      the landing sub-line (a separator alone does not count; clamped lines end with an ellipsis by design);
//  (h) the phone "Start with" card (.g-lead-card) and the desktop "Start with …" link (.g-start a) name the same place.
// Needs: python3 -m http.server 8765 -d <repo>. Run from tools/: node beta/feb-g2.js [regex]  → exit 1 on any failure.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BETA = path.resolve(__dirname, '../../beta'), RE = new RegExp(process.argv[2] || '.');
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['data', 'assets', 'changes'].includes(e.name) ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.html') ? [path.relative(BETA, path.join(d, e.name))] : []);
const pages = walk(BETA).filter(p => RE.test(p)).filter(p => { const h = fs.readFileSync(path.join(BETA, p), 'utf8'); return /data-cleo-page="city"/.test(h) || /class="chero"/.test(h) || p === 'index.html'; });
const SEL = '.masthead .dek, .masthead .facts, .masthead .g-lead, .chero .why, .chero .facts, .lhero .sub';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const widows = [], lead = []; let n = 0;
  for (const [vk, o] of [['390', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['1440', { viewport: { width: 1440, height: 900 } }]]) {
    const ctx = await b.newContext(o); await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
    for (const u of pages) {
      const p = await ctx.newPage(); await p.goto('http://127.0.0.1:8765/beta/' + u + '#view=gallery', { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400); n++;
      const r = await p.evaluate(sel => {
        const bad = [];
        for (const e of document.querySelectorAll(sel)) {
          const s = getComputedStyle(e); if (s.display === 'none' || !e.getClientRects().length || (s.webkitLineClamp && s.webkitLineClamp !== 'none')) continue;
          const rg = document.createRange(), words = [], tw = document.createTreeWalker(e, 4); let t;
          while ((t = tw.nextNode())) { if (t.parentElement.closest('[hidden]') || getComputedStyle(t.parentElement).display === 'none') continue;
            const re = /\S+/g; let m; while ((m = re.exec(t.textContent))) { rg.setStart(t, m.index); rg.setEnd(t, m.index + m[0].length); const rc = rg.getClientRects()[0]; if (rc && rc.width) words.push([Math.round(rc.top), m[0]]); } }
          if (words.length < 3) continue; const tops = [...new Set(words.map(x => x[0]))].sort((a, z) => a - z); if (tops.length < 2) continue;
          const last = words.filter(x => Math.abs(x[0] - tops[tops.length - 1]) < 3); if (last.length === 1 && !/^[·\-–—.,]$/.test(last[0][1])) bad.push(e.className + ' "…' + last[0][1] + '"');
        }
        const card = document.querySelector('.g-lead-card [data-id], .g-lead-card li[id]'), link = document.querySelector('.masthead .g-start a');
        const id = x => x && (x.getAttribute('data-id') || (x.getAttribute('href') || x.id || '').replace(/^#?p[-=]/, '').replace(/^#/, ''));
        return { bad, card: id(card), link: id(link), cardShown: !!(card && card.getClientRects().length), linkShown: !!(link && link.getClientRects().length) };
      }, SEL);
      r.bad.forEach(x => widows.push(`${vk} ${u}: ${x}`));
      if (vk === '390' && r.card) lead.push([u, 'phone', r.card]); if (vk === '1440' && r.link) lead.push([u, 'desk', r.link]);
      await p.close();
    }
    await ctx.close();
  }
  const by = {}; lead.forEach(([u, k, id]) => { (by[u] = by[u] || {})[k] = id; });
  const mism = Object.entries(by).filter(([, v]) => (v.phone || v.desk) && v.phone !== v.desk).map(([u, v]) => `${u}: phone ${v.phone} vs desktop ${v.desk}`);
  console.log(`(g) ${widows.length} single-word last lines on ${pages.length} pages × 2 widths`); widows.slice(0, 40).forEach(x => console.log('  ' + x));
  console.log(`(h) ${Object.keys(by).length} pages with a Start-with; ${mism.length} name different places`); mism.slice(0, 20).forEach(x => console.log('  ' + x));
  await b.close(); process.exit(widows.length || mism.length ? 1 : 0);
})();
