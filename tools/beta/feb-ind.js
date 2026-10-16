// FE-B probe (QC-18): the switcher's sliding indicator (.v-ind) must sit on the pressed segment — after load (en and
// ?lang=ja, with fonts held back 1.2 s), after a view switch and after a runtime locale change. Reports the largest |left| / |width| gap in px.
// Needs: python3 -m http.server 8765 -d <repo>. Run from tools/: node beta/feb-ind.js [page]
const { chromium } = require('playwright');
const page0 = process.argv[2] || 'cities/tokyo.html';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const gap = p => p.evaluate(() => { const n = document.querySelector('[data-cleo-views]'), i = n && n.querySelector('.v-ind'), s = n && n.querySelector('button[aria-pressed="true"]');
    if (!i || !s || getComputedStyle(i).display === 'none') return null;
    const a = i.getBoundingClientRect(), c = s.getBoundingClientRect(); return Math.round(Math.max(Math.abs(a.left - c.left), Math.abs(a.width - c.width))); });
  let bad = 0;
  for (const w of [1440, 768]) for (const q of ['', '?lang=ja']) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    // fonts arrive late (as on a real network): the indicator must re-measure once they reflow the labels
    await p.route(/\.(woff2?|ttf|otf)(\?|$)/, r => setTimeout(() => r.continue().catch(() => {}), 1200));
    await p.goto('http://127.0.0.1:8765/beta/' + page0 + q + '#view=gallery'); await p.waitForTimeout(2500);
    const r = { load: await gap(p) };
    // QC-18's own steps: a fresh load straight into each view (the Atlas parks the switcher in the header on desktop)
    for (const v of ['insights', 'guidebook', 'atlas']) {
      const p2 = await b.newPage({ viewport: { width: w, height: 900 } });
      await p2.goto('http://127.0.0.1:8765/beta/' + page0 + q + '#view=' + v); await p2.waitForTimeout(2500); r['fresh-' + v] = await gap(p2); await p2.close();
    }
    await p.locator('[data-cleo-views] button[data-view="insights"]').first().click(); await p.waitForTimeout(900); r.switch = await gap(p);
    const loc = p.locator(q ? '[data-cleo-locale="en"], a[hreflang="en"]' : '[data-cleo-locale="ja"], a[hreflang="ja"]').first();
    if (await loc.count() && await loc.isVisible().catch(() => false)) { await loc.click(); await p.waitForTimeout(1500); r.locale = await gap(p); }
    const vals = Object.values(r).filter(x => x !== null), ok = vals.every(x => x <= 2);
    if (!ok) bad++;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${w}px ${q || 'en'}  ${JSON.stringify(r)}${w < 1024 && !vals.length ? ' (no indicator below 1024: CSS)' : ''}`); await p.close();
  }
  await b.close(); console.log(bad ? `>>> FAIL — ${bad}` : '>>> PASS — the indicator sits on the pressed segment (<= 2 px)'); process.exit(bad ? 1 : 0);
})();
