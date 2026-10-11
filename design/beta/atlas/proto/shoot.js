// Shoot the SPEC-v3 prototypes: NODE_PATH=$(npm root -g) node design/beta/atlas/proto/shoot.js
const fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const D = __dirname, OUT = path.join(D, 'shots'); fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await chromium.launch();
  for (const f of fs.readdirSync(D).filter(f => f.endsWith('.html')).sort()) {
    const m = f.includes('-m-'), p = await b.newPage(m ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5 } : { viewport: { width: 1440, height: 900 } });
    await p.goto('file://' + path.join(D, f)); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, f.replace('.html', '.jpg')), type: 'jpeg', quality: 78 }); await p.close(); }
  await b.close(); })();
