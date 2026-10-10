// Round-2 evaluator capture: R1 (65e93e9 beta) vs R2 (current beta), same method as ../../tools/shots-round.js.
// Usage: node shots-r2.js <r1|r2> <port> <outdir>   (pre-installed Chromium; tiles stubbed, off-origin aborted)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const [round, port, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const LEAF = '/home/user/cleo-guide/tools/node_modules/leaflet/dist/';
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48+cPAAXxAvkqF6tIAAAAAElFTkSuQmCC', 'base64');
const B = `http://127.0.0.1:${port}/beta/`;
const SAVED = { 'tokyo/kanda-myojin': { t: 1 }, 'tokyo/senso-ji': { t: 2 }, 'tokyo/imperial-palace-east-gardens': { t: 3 }, 'cleveland/soldiers-and-sailors-monument': { t: 4 } };

const pages = [
  ['landing', 'index.html'], ['japan', 'Japan/index.html'], ['us', 'index.html#us'], ['tokyo', 'cities/tokyo.html'], ['cleveland', 'cleveland.html'],
  ['chinatown', 'Singapore/chinatown.html'], ['sheet', 'cities/tokyo.html#p=kanda-myojin'], ['map', 'cities/tokyo.html', 'map'],
  ['tray', 'cities/tokyo.html', 'tray'], ['saved', 'saved.html'], ['method', 'how-we-choose.html'], ['source', 'cleveland.html', 'source'],
  ['day', 'cities/tokyo.html#day=TAITO'], ['daycle', 'cleveland.html', 'day'], ['foryou', 'cities/tokyo.html', 'foryou'],
  ['near', 'cities/tokyo.html', 'near'], ['a11y', 'accessibility.html'], ['closed', 'cleveland.html#closed=1'],
];
const vis = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };

(async () => {
  const browser = await chromium.launch();
  const log = {};
  for (const [vp, opts] of [['m', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['d', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }]]) {
    const ctx = await browser.newContext({ ...opts, colorScheme: 'light', reducedMotion: 'reduce', geolocation: { latitude: 35.7148, longitude: 139.7967 }, permissions: ['geolocation'] });
    await ctx.addInitScript(s => { try { localStorage.setItem('cleo:v1:saved', s); } catch (e) {} }, JSON.stringify(SAVED));
    await ctx.route('**/*', r => {
      const u = r.request().url();
      if (u.startsWith(`http://127.0.0.1:${port}/`)) return r.continue();
      if (/tile\.openstreetmap|arcgisonline|cartocdn/.test(u)) return r.fulfill({ body: TILE, contentType: 'image/png' });
      return r.abort();
    });
    for (const [name, url, act] of pages) {
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', e => errs.push(String(e).slice(0, 100)));
      try {
        const resp = await page.goto(B + url, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(1200);
        let acted = null;
        if (act === 'map' && vp === 'm') { const t = await page.$('[data-cleo-map]'); if (t) { await t.click(); await page.waitForTimeout(1200); await page.evaluate(() => { const m = document.querySelector('.leaflet-marker-icon, .leaflet-interactive'); if (m) m.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await page.waitForTimeout(900); acted = 'pin'; } }
        if (act === 'tray') { const t = await page.$('[data-cleo-tray]'); if (t) { await t.click(); await page.waitForTimeout(700); acted = 'tray'; } }
        if (act === 'source') { await page.goto(B + url + '#src=news-5', { waitUntil: 'load' }).catch(() => {}); await page.waitForTimeout(900); }
        if (act === 'day') { const t = await page.$('[data-cleo-day]'); if (t) { await t.click(); await page.waitForTimeout(900); acted = 'day'; } }
        if (act === 'foryou') { const t = await page.$('[data-cleo-foryou] >> visible=true'); if (t) { await t.click(); await page.waitForTimeout(600); acted = 'foryou'; } }
        if (act === 'near') { const t = await page.$('[data-cleo-near] >> visible=true'); if (t) { await t.click(); await page.waitForTimeout(900); acted = 'near'; } }
        const m = await page.evaluate(() => {
          const vis = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
          const mp = document.querySelector('.mappane'), mr = mp && vis(mp) ? mp.getBoundingClientRect() : null;
          const poi = document.querySelector('#cleo-poi:not([hidden])');
          const small = [...document.querySelectorAll('a[href],button,input,select,[role=button]')].filter(vis).filter(e => { const r = e.getBoundingClientRect(); return (r.width < 44 || r.height < 44) && !e.closest('.leaflet-control-attribution'); }).length;
          return { dom: document.getElementsByTagName('*').length, overflowX: document.documentElement.scrollWidth - innerWidth,
            mapPct: mr ? Math.round(mr.width / innerWidth * 100) : null, poiPct: poi && vis(poi) ? Math.round(poi.getBoundingClientRect().height / innerHeight * 100) : null,
            imgs: document.querySelectorAll('img[src*="assets/img/"]').length, tapUnder44: small, title: document.title.slice(0, 60) };
        });
        await page.screenshot({ path: path.join(out, `${name}-${vp}.jpg`), type: 'jpeg', quality: 70 });
        if (['landing', 'japan', 'tokyo', 'cleveland', 'chinatown', 'day', 'saved'].includes(name)) {
          await page.evaluate(() => scrollBy(0, innerHeight * 0.9)); await page.waitForTimeout(500);
          await page.screenshot({ path: path.join(out, `${name}-${vp}-s1.jpg`), type: 'jpeg', quality: 70 });
        }
        log[`${name}-${vp}`] = { ok: true, status: resp && resp.status(), acted, errors: errs.length, firstErr: errs[0], ...m };
      } catch (e) { log[`${name}-${vp}`] = { ok: false, e: String(e).slice(0, 160) }; }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, '_log.json'), JSON.stringify(log, null, 1));
  for (const [k, v] of Object.entries(log)) console.log(k.padEnd(14), JSON.stringify(v));
})();
