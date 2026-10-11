// R6 evaluator: bytes transferred by resource (uncompressed body sizes), phone 390×844, off-origin aborted.
// Same method as ../../r5/tools/probe-transfer.js, over R5 (8802), R5 follow-up (8803) and R6 (8801), default view and Atlas.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const ports = { 8802: 'R5 f2bf7610', 8803: 'R5fu 63932912', 8801: 'R6 2f227631' };
const urls = ['cities/tokyo.html', 'cities/tokyo.html#view=atlas', 'cities/newyork.html', 'cleveland.html#view=atlas'];
(async () => { const b = await chromium.launch();
  for (const [vpn, vp] of [['phone', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }], ['desktop', { viewport: { width: 1440, height: 900 } }]])
  for (const u of urls) for (const port of Object.keys(ports)) {
    const ctx = await b.newContext(vp);
    await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
    const p = await ctx.newPage(); const sz = {};
    p.on('response', async r => { try { const bb = await r.body(); const k = r.url().replace(/.*\/beta\//, '').replace(/\?.*/, ''); sz[k] = (sz[k] || 0) + bb.length; } catch (e) {} });
    await p.goto(`http://127.0.0.1:${port}/beta/${u}`, { waitUntil: 'load' }); await p.waitForTimeout(3000);
    const tot = Object.values(sz).reduce((a, c) => a + c, 0);
    const fonts = Object.entries(sz).filter(([k]) => /woff2/.test(k)).reduce((a, [, v]) => a + v, 0);
    console.log(vpn.padEnd(8), ports[port].padEnd(14), u.padEnd(30), String(Math.round(tot / 1024)).padStart(5) + ' KB', 'fonts ' + Math.round(fonts / 1024) + ' KB |', Object.entries(sz).sort((a, c) => c[1] - a[1]).slice(0, 4).map(([k, v]) => k + ':' + Math.round(v / 1024)).join(' | '));
    await ctx.close(); }
  await b.close(); })();
