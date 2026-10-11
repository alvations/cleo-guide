// One-up evidence harness: serve the repo root on 8833, then
// cd tools && NODE_PATH=$(npm root -g):$(pwd)/node_modules node ../design/beta/eval/one-up/tools/probe-views.js <outdir>
const { chromium } = require('playwright');
const OUT = process.argv[2];
const B = 'http://127.0.0.1:8833/beta/';
const shots = [
  ['landing', 'index.html'], ['japan', 'Japan/index.html'],
  ['tokyo', 'cities/tokyo.html'], ['tokyo-guidebook', 'cities/tokyo.html#view=guidebook'],
  ['tokyo-insights', 'cities/tokyo.html#view=insights'], ['tokyo-sheet', 'cities/tokyo.html#p=kanda-myojin'],
  ['tokyo-day', 'cities/tokyo.html#day=TAITO'], ['saved', 'saved.html'], ['changes', 'changes/tokyo.html'],
  ['cleveland', 'cleveland.html'], ['method', 'how-we-choose.html'],
];
(async () => {
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(()=>chromium.launch());
  const report = {};
  for (const [vp, opt] of [['m', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }], ['d', { viewport: { width: 1440, height: 900 } }]]) {
    const ctx = await br.newContext({ ...opt, reducedMotion: 'reduce' });
    await ctx.route('**/*', r => { const u = r.request().url(); return u.startsWith('http://127.0.0.1') ? r.continue() : r.abort(); });
    for (const [n, u] of shots) {
      const p = await ctx.newPage(); const errs = [];
      p.on('pageerror', e => errs.push(String(e)));
      await p.goto(B + u, { waitUntil: 'load' }); await p.waitForTimeout(900);
      await p.screenshot({ path: `${OUT}/${n}-${vp}.jpg`, type: 'jpeg', quality: 55 });
      const info = await p.evaluate(() => ({
        title: document.title,
        buttons: [...document.querySelectorAll('button,[role=button],a.btn')].map(b => (b.getAttribute('aria-label') || b.textContent || '').trim().replace(/\s+/g,' ').slice(0,40)).filter(Boolean).slice(0, 60),
        h: [...document.querySelectorAll('h1,h2,h3')].slice(0,15).map(h => h.textContent.trim().replace(/\s+/g,' ').slice(0,60)),
      }));
      report[`${n}-${vp}`] = { ...info, errs };
      await p.close();
    }
    await ctx.close();
  }
  require('fs').writeFileSync(`${OUT}/probe.json`, JSON.stringify(report, null, 1));
  await br.close();
})();
