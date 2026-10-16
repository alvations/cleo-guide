// R6 evaluator: night-edition captures (context colorScheme dark), R5 vs R6. Usage: node shots-night.js <port> <outdir>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const [port, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48+cPAAXxAvkqF6tIAAAAAElFTkSuQmCC', 'base64');
const pages = [['landing-night', 'index.html'], ['tokyo-gallery-night', 'cities/tokyo.html#view=gallery'], ['tokyo-atlas-night', 'cities/tokyo.html#view=atlas'], ['tokyo-insights-night', 'cities/tokyo.html#view=insights'], ['sheet-night', 'cities/tokyo.html#view=gallery&p=kanda-myojin']];
(async () => { const b = await chromium.launch(); const log = {};
  for (const [vp, o] of [['m', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['d', { viewport: { width: 1440, height: 900 } }]]) {
    const ctx = await b.newContext({ ...o, colorScheme: 'dark', reducedMotion: 'reduce' });
    await ctx.route('**/*', r => { const u = r.request().url(); if (u.startsWith('http://127.0.0.1')) return r.continue(); if (/tile\.openstreetmap|arcgisonline/.test(u)) return r.fulfill({ body: TILE, contentType: 'image/png' }); return r.abort(); });
    for (const [n, u] of pages) { const p = await ctx.newPage(); await p.goto(`http://127.0.0.1:${port}/beta/${u}`, { waitUntil: 'load' }); await p.waitForTimeout(1500);
      log[`${n}-${vp}`] = await p.evaluate(() => ({ theme: document.documentElement.dataset.theme || '', bg: getComputedStyle(document.body).backgroundColor }));
      await p.screenshot({ path: path.join(out, `${n}-${vp}.jpg`), type: 'jpeg', quality: 70 }); await p.close(); }
    await ctx.close(); }
  await b.close(); console.log(JSON.stringify(log)); })();
