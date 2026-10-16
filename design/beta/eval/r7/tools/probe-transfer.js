// R7 evaluator: bytes by resource (uncompressed body sizes), off-origin aborted, first load (no scroll, load + 3 s).
// From r6/tools/probe-transfer.js; R6 (8812) vs R7 (8811); phone is 390×844 @3× (photos pick srcset by DPR), desktop 1440×900.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const ports = { 8812: 'R6 2f227631', 8811: 'R7 badcc20d' };
const urls = ['index.html', 'Japan/index.html', 'cities/tokyo.html', 'cities/tokyo.html#view=atlas', 'cities/newyork.html', 'cleveland.html#view=atlas', 'cities/tokyo.html#p=kanda-myojin'];
(async () => { const b = await chromium.launch();
  for (const [vpn, vp] of [['phone@3', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }], ['desktop', { viewport: { width: 1440, height: 900 } }]])
  for (const u of urls) for (const port of Object.keys(ports)) {
    const ctx = await b.newContext(vp);
    await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
    const p = await ctx.newPage(); const sz = {};
    p.on('response', async r => { try { const bb = await r.body(); const k = r.url().replace(/.*\/beta\//, '').replace(/\?.*/, ''); sz[k] = (sz[k] || 0) + bb.length; } catch (e) {} });
    await p.goto(`http://127.0.0.1:${port}/beta/${u}`, { waitUntil: 'load' }); await p.waitForTimeout(3000);
    const dom = await p.evaluate(() => document.getElementsByTagName('*').length);
    const tot = Object.values(sz).reduce((a, c) => a + c, 0);
    const sum = re => Math.round(Object.entries(sz).filter(([k]) => re.test(k)).reduce((a, [, v]) => a + v, 0) / 1024);
    console.log(vpn.padEnd(8), ports[port].padEnd(12), u.padEnd(34), String(Math.round(tot / 1024)).padStart(5) + ' KB', `fonts ${sum(/woff2/)} · photos ${sum(/photos\//)} · js ${sum(/\.js$/)} · json ${sum(/\.json$/)} KB · dom ${dom} |`, Object.entries(sz).sort((a, c) => c[1] - a[1]).slice(0, 3).map(([k, v]) => k.slice(-40) + ':' + Math.round(v / 1024)).join(' | '));
    await ctx.close(); }
  await b.close(); })();
