// Round-1 evaluator capture: R0 (ca70e53 beta) vs R1 (current beta). Usage: node shots.js <r0|r1> <port> <outdir>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const [round, port, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const LEAF = '/home/user/cleo-guide/tools/node_modules/leaflet/dist/';
// neutral 256px tile so maps show their pins (tile hosts are blocked here; same stub for both rounds)
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48+cPAAXxAvkqF6tIAAAAAElFTkSuQmCC', 'base64');
const B = `http://127.0.0.1:${port}/beta/`;
const SAVED = { 'tokyo/kanda-myojin': { t: 1 }, 'tokyo/senso-ji': { t: 2 }, 'tokyo/imperial-palace-east-gardens': { t: 3 }, 'cleveland/soldiers-and-sailors-monument': { t: 4 } };

const pages = round === 'r1' ? [
  ['landing', 'index.html'], ['japan', 'Japan/index.html'], ['tokyo', 'cities/tokyo.html'], ['cleveland', 'cleveland.html'],
  ['chinatown', 'Singapore/chinatown.html'], ['sheet', 'cities/tokyo.html#p=kanda-myojin'], ['map', 'cities/tokyo.html', 'map'],
  ['tray', 'cities/tokyo.html', 'tray'], ['saved', 'saved.html'], ['method', 'how-we-choose.html'], ['source', 'cleveland.html', 'source'],
] : [
  ['landing', 'index.html'], ['tokyo', 'cities/tokyo.html'], ['cleveland', 'cleveland.html'], ['chinatown', 'Singapore/chinatown.html'],
  ['sheet', 'cities/tokyo.html', 'popup'], ['map', 'cities/tokyo.html', 'map'],
];

(async () => {
  const browser = await chromium.launch();
  const log = {};
  for (const [vp, opts] of [['m', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['d', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }]]) {
    const ctx = await browser.newContext({ ...opts, colorScheme: 'light', reducedMotion: 'reduce' });
    await ctx.addInitScript(s => { try { localStorage.setItem('cleo:v1:saved', s); } catch (e) {} }, JSON.stringify(SAVED));
    await ctx.route('**/*', r => {
      const u = r.request().url();
      if (u.startsWith(`http://127.0.0.1:${port}/`)) return r.continue();
      const m = /leaflet\/1\.9\.4\/(leaflet(?:\.min)?\.(js|css))/.exec(u);
      if (m) return r.fulfill({ path: LEAF + m[1].replace('.min', ''), contentType: m[2] === 'js' ? 'application/javascript' : 'text/css' });
      if (/tile\.openstreetmap|arcgisonline|cartocdn/.test(u)) return r.fulfill({ body: TILE, contentType: 'image/png' });
      return r.abort();
    });
    for (const [name, url, act] of pages) {
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', e => errs.push(String(e).slice(0, 100)));
      try {
        await page.goto(B + url, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(1200);
        if (act === 'map') {
          const t = await page.$('[data-cleo-map=""]');
          if (t && vp === 'm') { await t.click(); await page.waitForTimeout(1200); const mk = await page.$('.leaflet-marker-icon, .leaflet-interactive'); if (mk) { await mk.click({ force: true }).catch(() => {}); await page.waitForTimeout(900); } }
          else if (round === 'r0') { /* R0: map sits on top of the page */ }
        }
        if (act === 'tray') { const t = await page.$('[data-cleo-tray=""]'); if (t) { await t.click(); await page.waitForTimeout(700); } }
        if (act === 'source') { await page.goto(B + url + '#src=news-5', { waitUntil: 'load' }).catch(() => {}); await page.waitForTimeout(900); }
        if (act === 'popup') { const mk = await page.$('.leaflet-marker-icon, path.leaflet-interactive'); if (mk) { await mk.click({ force: true }).catch(() => {}); await page.waitForTimeout(800); } }
        await page.screenshot({ path: path.join(out, `${name}-${vp}.jpg`), type: 'jpeg', quality: 70 });
        if (['landing', 'japan', 'tokyo', 'cleveland', 'chinatown', 'method'].includes(name)) {
          await page.evaluate(() => scrollBy(0, innerHeight * 0.9)); await page.waitForTimeout(500);
          await page.screenshot({ path: path.join(out, `${name}-${vp}-s1.jpg`), type: 'jpeg', quality: 70 });
        }
        log[`${name}-${vp}`] = { ok: true, errors: errs.length, firstErr: errs[0] };
      } catch (e) { log[`${name}-${vp}`] = { ok: false, e: String(e).slice(0, 160) }; }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, '_log.json'), JSON.stringify(log, null, 1));
  console.log(JSON.stringify(log));
})();
