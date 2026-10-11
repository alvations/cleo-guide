// Round-7 evaluator capture: R6 (2f227631 beta) vs R7 (badcc20d beta). Same settings as r6/tools/shots-r6.js
// (390×844 @2× touch and 1440×900, light, reduced motion, off-origin aborted, tiles answered with a flat stub, the same
// 4 saved refs). Flows: R6's set (half/full tray replaced by the Atlas list toggle), plus every pilot (Cleveland, Tokyo,
// New York, Chinatown, Wheeling) in all four views, Atlas pin / preview / list, and a dark-context set.
// Usage: node shots-r7.js <label> <port> <outdir>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const [round, port, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48+cPAAXxAvkqF6tIAAAAAElFTkSuQmCC', 'base64');
const B = `http://127.0.0.1:${port}/beta/`;
const SAVED = { 'tokyo/kanda-myojin': { t: 1 }, 'tokyo/senso-ji': { t: 2 }, 'tokyo/imperial-palace-east-gardens': { t: 3 }, 'cleveland/soldiers-and-sailors-monument': { t: 4 } };
const PIL = [['tokyo', 'cities/tokyo.html'], ['cle', 'cleveland.html'], ['ny', 'cities/newyork.html'], ['chinatown', 'Singapore/chinatown.html'], ['wheeling', 'cities/wheeling.html']];
const pages = [
  ['landing', 'index.html'], ['japan', 'Japan/index.html'], ['us', 'index.html#us'], ['tokyo', 'cities/tokyo.html'], ['cleveland', 'cleveland.html'],
  ['newyork', 'cities/newyork.html'], ['chinatown', 'Singapore/chinatown.html'], ['wheeling', 'cities/wheeling.html'],
  ['sheet', 'cities/tokyo.html#p=kanda-myojin'], ['map', 'cities/tokyo.html', 'map'],
  ['saved', 'saved.html'], ['method', 'how-we-choose.html'], ['source', 'cleveland.html', 'source'],
  ['day', 'cities/tokyo.html#day=TAITO'], ['daycle', 'cleveland.html', 'day'],
  ['a11y', 'accessibility.html'], ['closed', 'cleveland.html#closed=1'],
  ...['gallery', 'atlas', 'guidebook', 'insights'].flatMap(v => PIL.map(([k, u]) => [`${k}-${v}`, `${u}#view=${v}`])),
  ['switch', 'cities/tokyo.html', 'switch'], ['galsheet', 'cities/tokyo.html#view=gallery&p=kanda-myojin'],
  ['changes', 'changes/tokyo.html'], ['changes-cle', 'changes/cleveland.html'], ['tokyo-gallery-p2', 'cities/tokyo.html#view=gallery', 'gscroll'],
  ['atlas-pin', 'cities/tokyo.html#view=atlas', 'apin'], ['atlas-list', 'cities/tokyo.html#view=atlas', 'alist'],
  ['atlas-place', 'cities/tokyo.html#view=atlas&p=kanda-myojin'], ['atlas-must', 'cities/tokyo.html#view=atlas', 'must'],
  ['cle-atlas-pin', 'cleveland.html#view=atlas', 'apin'],
  ['sheet-vn', 'Vietnam/ho-chi-minh-city.html#view=gallery&p=viet-nam-quoc-tu'], ['sheet-cle', 'cleveland.html#view=gallery&p=soldiers-and-sailors-monument'],
  ['sheet-closed', 'cleveland.html', 'closedsheet'],
];
const DARK = [['landing-night', 'index.html'], ['japan-night', 'Japan/index.html'], ['tokyo-gallery-night', 'cities/tokyo.html#view=gallery'], ['tokyo-atlas-night', 'cities/tokyo.html#view=atlas'],
  ['tokyo-insights-night', 'cities/tokyo.html#view=insights'], ['sheet-night', 'cities/tokyo.html#view=gallery&p=kanda-myojin'], ['ny-gallery-night', 'cities/newyork.html#view=gallery']];
const VPS = [['m', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['d', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }]];
const S1 = ['landing', 'japan', 'tokyo', 'cleveland', 'newyork', 'chinatown', 'wheeling', 'day', 'saved', 'tokyo-gallery', 'tokyo-guidebook', 'tokyo-insights', 'sheet'];

async function measure(page) {
  return page.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const small = [...document.querySelectorAll('a[href],button,input,select,[role=button]')].filter(vis).filter(e => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && (r.width < 44 || r.height < 44) && !e.closest('.leaflet-control-attribution'); }).length;
    const l = [...document.querySelectorAll('.leaflet-container')].find(vis); const lr = l && l.getBoundingClientRect();
    return { dom: document.getElementsByTagName('*').length, overflowX: document.documentElement.scrollWidth - innerWidth,
      imgsLoaded: [...document.images].filter(i => i.complete && i.naturalWidth > 1 && /photos\//.test(i.currentSrc || i.src)).length,
      photosInView: [...document.images].filter(i => /photos\//.test(i.currentSrc || i.src) && vis(i) && i.getBoundingClientRect().top < innerHeight && i.getBoundingClientRect().bottom > 0).length,
      view: (document.querySelector('[data-view][aria-pressed=true],[data-view][aria-selected=true],[data-view][aria-current]') || {}).dataset?.view || null,
      hash: location.hash.slice(0, 60), tapUnder44InView: small, title: document.title.slice(0, 60),
      mapBox: lr ? [Math.round(lr.left), Math.round(lr.top), Math.round(lr.width), Math.round(lr.height)] : null,
      pins: document.querySelectorAll('.leaflet-marker-icon').length, theme: document.documentElement.dataset.theme || null };
  });
}

(async () => {
  const browser = await chromium.launch();
  const log = {};
  const runs = [...VPS.map(([vp, o]) => [vp, o, 'light', pages]), ...VPS.map(([vp, o]) => [vp, o, 'dark', DARK])];
  for (const [vp, opts, scheme, list] of runs) {
    const ctx = await browser.newContext({ ...opts, colorScheme: scheme, reducedMotion: 'reduce', geolocation: { latitude: 35.7148, longitude: 139.7967 }, permissions: ['geolocation'] });
    await ctx.addInitScript(s => { try { localStorage.setItem('cleo:v1:saved', s); } catch (e) {} }, JSON.stringify(SAVED));
    await ctx.route('**/*', r => {
      const u = r.request().url();
      if (u.startsWith(`http://127.0.0.1:${port}/`)) return r.continue();
      if (/tile\.openstreetmap|arcgisonline|cartocdn/.test(u)) return r.fulfill({ body: TILE, contentType: 'image/png' });
      return r.abort();
    });
    for (const [name, url, act] of list) {
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', e => errs.push(String(e).slice(0, 120)));
      try {
        const resp = await page.goto(B + url, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(1500);
        let acted = null;
        if (act === 'map' && vp === 'm') { const t = await page.$('[data-cleo-mappill] >> visible=true') || await page.$('[data-cleo-map] >> visible=true'); if (t) { await t.click(); await page.waitForTimeout(1500); acted = 'maptoggle'; } else acted = 'map:none'; }
        if (act === 'gscroll') { await page.evaluate(() => { const c = [...document.querySelectorAll('li.pl, .cover')].filter(e => e.getBoundingClientRect().height > 0)[6]; if (c) c.scrollIntoView({ block: 'start' }); }); await page.waitForTimeout(800); acted = 'gscroll'; }
        if (act === 'source') { await page.goto(B + url + '#src=news-5', { waitUntil: 'load' }).catch(() => {}); await page.waitForTimeout(1000); }
        if (act === 'day') { const t = await page.$('[data-cleo-day] >> visible=true'); if (t) { await t.click(); await page.waitForTimeout(1000); acted = 'day:' + (await page.evaluate(() => location.hash)); } else acted = 'day:none'; }
        if (act === 'switch') { const more = vp === 'm' ? await page.$('[data-cleo-views] [aria-pressed=true] >> visible=true') : null;
          if (more) { await more.click(); await page.waitForTimeout(400); }
          const g = await page.$('[data-view="atlas"] >> visible=true'); if (g) { await g.click(); await page.waitForTimeout(1500); acted = 'switch:' + (await page.evaluate(() => location.hash)); } else acted = 'switch:none'; }
        if (act === 'alist') { const t = await page.$('.ms-toggle >> visible=true'); if (t) { await t.click(); await page.waitForTimeout(1000); acted = 'list'; } else { const ok = await page.evaluate(() => { const c = window.Cleo && Cleo.city; if (c && c.detent) { c.detent('full'); return 'detent'; } return null; }); await page.waitForTimeout(900); acted = 'alist:' + ok; } }
        if (act === 'must') { const t = await page.$('.m-must >> visible=true') || await page.$('.ms-bar [data-cleo-must] >> visible=true') || await page.$('button:has-text("Must see") >> visible=true'); if (t) { await t.click(); await page.waitForTimeout(1200); acted = 'must:' + (await page.evaluate(() => location.hash)); } else acted = 'must:none'; }
        if (act === 'apin') { const r = await page.evaluate(() => { const H = innerHeight; const ms = [...document.querySelectorAll('.leaflet-marker-icon:not(.pin-cl)')].filter(m => { const b = m.getBoundingClientRect(); return b.width > 0 && b.top > 140 && b.bottom < H * 0.6 && b.left > 10 && b.right < innerWidth - 10; }); if (!ms.length) return null; const b = ms[0].getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2, ms.length]; }); if (r) { await page.mouse.click(r[0], r[1]); await page.waitForTimeout(1200); acted = 'apin:' + r[2]; } else acted = 'apin:none'; }
        if (act === 'closedsheet') { const slug = await page.evaluate(() => { const li = [...document.querySelectorAll('li.pl')].find(l => /closed/i.test(l.className + ' ' + (l.dataset.st || '') + ' ' + l.textContent)); return li && (li.id || li.dataset.id || li.dataset.slug); }); if (slug) { await page.goto(B + url + '#p=' + String(slug).replace(/^p-/, ''), { waitUntil: 'load' }); await page.waitForTimeout(1200); } acted = 'closed:' + slug; }
        const m = await measure(page);
        await page.screenshot({ path: path.join(out, `${name}-${vp}.jpg`), type: 'jpeg', quality: 70 });
        if (scheme === 'light' && S1.includes(name)) {
          await page.evaluate(() => { const s = document.querySelector('#cleo-sheet:not([hidden]) .sh-body, #cleo-sheet:not([hidden])'); if (s && s.scrollHeight > s.clientHeight) s.scrollBy(0, innerHeight * 0.8); else scrollBy(0, innerHeight * 0.9); }); await page.waitForTimeout(700);
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
  for (const [k, v] of Object.entries(log)) console.log(k.padEnd(22), JSON.stringify(v).slice(0, 300));
})();
