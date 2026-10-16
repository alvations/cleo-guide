// FE-B probe (QC-10, mirrors tools/beta/qa/qc.js P-03): click each view in turn and read focus at 700 ms and later; a cold
// load must leave focus alone. Needs: python3 -m http.server 8765 -d <repo>. Run from tools/: node beta/feb-p03.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const [page, w] of [['cities/tokyo.html', 390], ['cities/tokyo.html', 1440], ['cleveland.html', 390], ['Singapore/chinatown.html', 1440]]) {
    const p = await b.newPage({ viewport: { width: w, height: 844 } });
    await p.goto('http://127.0.0.1:8765/beta/' + page); await p.waitForTimeout(800);
    const cold = await p.evaluate(() => document.activeElement.tagName);
    const out = [];
    for (const v of ['atlas', 'guidebook', 'insights', 'gallery']) {
      await p.locator(`[data-cleo-views] button[data-view="${v}"]`).first().click(); await p.waitForTimeout(700);
      const f1 = await p.evaluate(() => { const a = document.activeElement; return a.tagName + (a.matches('[tabindex="-1"]') ? '' : '!'); });
      await p.waitForTimeout(1500);
      const f2 = await p.evaluate(() => { const a = document.activeElement; return a.tagName + (a.isConnected ? '' : '?') + ':' + (a.textContent || '').trim().slice(0, 20); });
      out.push(`${v} 700ms=${f1} later=${f2}`);
    }
    console.log(page, w, 'cold=' + cold, out.join(' | ')); await p.close();
  }
  await b.close();
})();
