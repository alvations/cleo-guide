// Atlas FE-2 (QC-26): a cold Atlas deep link with a lens, #view=atlas&a=<area>&p=<id>, must apply the lens on load:
// the detail reads "k of <lens n>" and the list holds the lens's places only.
//   NODE_PATH=$(npm root -g) node tools/beta/fe2/qc26.js [cities/tokyo.html …]   (serves the checkout it sits in)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..'), BASE = 'https://cleo.local/';
const PNG = fs.readFileSync(path.join(ROOT, 'tools/node_modules/leaflet/dist/images/layers.png'));
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['cities/tokyo.html', 'cleveland.html', 'cities/newyork.html'];
(async () => { const b = await chromium.launch(); let bad = 0;
  for (const rel of pages) for (const [vn, vp] of [['390', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }], ['1440', { viewport: { width: 1440, height: 900 } }]]) {
    // the second area of the page, and its first pinned place (so the lens is not the whole city)
    const html = fs.readFileSync(path.join(ROOT, 'beta', rel), 'utf8'), areas = [...new Set([...html.matchAll(/<li class="pl[^"]*" id="p-([a-z0-9-]+)"[^>]*data-a="([^"]+)"/g)].map(m => m[2]))];
    const a = process.env.AREA_IDX === '0' ? areas[0] : areas[1] || areas[0], id = ([...html.matchAll(/<li class="pl[^"]*" id="p-([a-z0-9-]+)"[^>]*data-a="([^"]+)"/g)].find(m => m[2] === a) || [])[1];
    const ctx = await b.newContext(Object.assign({ reducedMotion: 'reduce' }, vp));
    await ctx.route('**/*', r => { const u = new URL(r.request().url()); if (/arcgis|openstreetmap/.test(u.host)) return r.fulfill({ body: PNG, headers: { 'content-type': 'image/png' } }); if (u.origin + '/' !== BASE) return r.abort(); const p = path.join(ROOT, decodeURIComponent(u.pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' }); return r.fulfill({ body: fs.readFileSync(p) }); });
    const page = await ctx.newPage(); await page.goto(BASE + 'beta/' + rel + '#view=atlas&a=' + a + '&p=' + id); await page.waitForTimeout(2500);
    const r = await page.evaluate(a => { const pos = (document.querySelector('#cleo-sheet [data-sh-pos]') || {}).textContent || '', all = [...document.querySelectorAll('li.pl')].concat(Cleo.defer && Cleo.defer.peek ? Cleo.defer.peek() : []);
      const lensN = all.filter(c => c.getAttribute('data-a') === a).length, shown = [...document.querySelectorAll('li.pl')].filter(c => !c.hidden), wrong = shown.filter(c => c.getAttribute('data-a') !== a).length;
      return { a, pos: pos.replace(/\s+/g, ' ').trim(), lensN, shownNotHidden: shown.length, outsideLens: wrong, routeA: Cleo.route.parse().a || null, S_a: Cleo.city.S.a }; }, a);
    const n = +((/of ([\d,]+)/.exec(r.pos) || [0, '0'])[1].replace(/,/g, ''));
    const ok = r.S_a === a && r.outsideLens === 0 && n === r.lensN;
    if (!ok) bad++; console.log(`${ok ? 'PASS' : 'FAIL'}  QC-26 ${rel} ${vn}: cold #view=atlas&a=${a}&p=${id} applies the lens (detail "k of ${r.lensN}", no card outside it)  ${JSON.stringify(r)}`);
    await ctx.close(); }
  await b.close(); console.log(bad ? `>>> FAIL — ${bad} QC-26 case(s)` : '>>> PASS — QC-26'); process.exit(bad ? 1 : 0); })();
