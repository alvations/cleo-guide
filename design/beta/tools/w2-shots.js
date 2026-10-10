// Designer W2 capture: beta pages at 390×844 (DPR2) and 1440×900, light, reduced motion, off-origin blocked
// (Leaflet served from tools/node_modules, tiles stubbed). Usage: node w2-shots.js <port> <outdir> [name ...]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const [port, out, ...only] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const LEAF = path.resolve(__dirname, '../../../tools/node_modules/leaflet/dist/');
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48+cPAAXxAvkqF6tIAAAAAElFTkSuQmCC', 'base64');
const B = `http://127.0.0.1:${port}/beta/`;
const SAVED = { 'tokyo/kanda-myojin': { t: 1 }, 'tokyo/senso-ji': { t: 2 }, 'tokyo/imperial-palace-east-gardens': { t: 3 }, 'cleveland/soldiers-and-sailors-monument': { t: 4 } };
const PAGES = [
  ['landing', 'index.html', null, 1], ['japan', 'Japan/index.html', null, 1], ['us', 'index.html#us', null, 0],
  ['tokyo', 'cities/tokyo.html', null, 1], ['cleveland', 'cleveland.html', null, 1], ['chinatown', 'Singapore/chinatown.html', null, 1],
  ['sheet', 'cities/tokyo.html#p=kanda-myojin'], ['sheet-cle', 'cleveland.html#p=soldiers-and-sailors-monument'],
  ['map', 'cities/tokyo.html', 'map'], ['tray', 'cities/tokyo.html', 'tray'], ['saved', 'saved.html', null, 1],
  ['method', 'how-we-choose.html'], ['tokyo-dark', 'cities/tokyo.html', 'dark'],
];
(async () => {
  const browser = await chromium.launch(); const log = {};
  for (const [vp, opts] of [['m', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['d', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }]]) {
    for (const [name, url, act, scroll] of PAGES) {
      if (only.length && !only.includes(name)) continue;
      const ctx = await browser.newContext({ ...opts, colorScheme: act === 'dark' ? 'dark' : 'light', reducedMotion: 'reduce' });
      await ctx.addInitScript(s => { try { localStorage.setItem('cleo:v1:saved', s); } catch (e) {} }, JSON.stringify(SAVED));
      await ctx.route('**/*', r => {
        const u = r.request().url();
        if (u.startsWith(`http://127.0.0.1:${port}/`)) return r.continue();
        const m = /leaflet(?:\.min)?\.(js|css)/.exec(u);
        if (m && /leaflet\/1\./.test(u)) return r.fulfill({ path: path.join(LEAF, 'leaflet.' + m[1]), contentType: m[1] === 'js' ? 'application/javascript' : 'text/css' });
        if (/tile\.openstreetmap|arcgisonline/.test(u)) return r.fulfill({ body: TILE, contentType: 'image/png' });
        return r.abort();
      });
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', e => errs.push(String(e).slice(0, 120)));
      try {
        await page.goto(B + url, { waitUntil: 'load', timeout: 30000 }); await page.waitForTimeout(1200);
        if (act === 'map' && vp === 'm') { const t = await page.$('[data-cleo-map=""]'); if (t) { await t.click(); await page.waitForTimeout(1200); const mk = await page.$('.leaflet-marker-icon, .leaflet-interactive'); if (mk) { await mk.click({ force: true }).catch(() => {}); await page.waitForTimeout(900); } } }
        if (act === 'tray') { const t = await page.$('[data-cleo-tray=""]'); if (t) { await t.click(); await page.waitForTimeout(700); } }
        await page.screenshot({ path: path.join(out, `${name}-${vp}.jpg`), type: 'jpeg', quality: 70 });
        if (scroll) { await page.evaluate(() => scrollBy(0, innerHeight * 0.9)); await page.waitForTimeout(500); await page.screenshot({ path: path.join(out, `${name}-${vp}-s1.jpg`), type: 'jpeg', quality: 70 }); }
        const upper = await page.evaluate(() => { let t = 0, u = 0; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const el = n.parentElement; if (!el || !el.offsetParent && getComputedStyle(el).position !== 'fixed') continue; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue; const s = n.textContent.replace(/[^A-Za-z]/g, ''); if (!s) continue; t += s.length; u += cs.textTransform === 'uppercase' ? s.length : s.replace(/[^A-Z]/g, '').length * 0 + (s.match(/[A-Z]{2,}/g) || []).join('').length; } return t ? +(100 * u / t).toFixed(1) : 0; });
        log[`${name}-${vp}`] = { errors: errs.length, firstErr: errs[0], upperPct: upper };
      } catch (e) { log[`${name}-${vp}`] = { fail: String(e).slice(0, 160) }; }
      await ctx.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, '_log.json'), JSON.stringify(log, null, 1)); console.log(JSON.stringify(log));
})();
