// R6 evaluator: axe-core 4.10.2 (vendored at tools/beta/qa/vendor) on the pinned trees.
// Usage: node probe-axe.js <port> <axe.min.js> <out.json>   Pages × {390 touch, 1440} × {light, night}; serious/critical only.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const [port, axePath, out] = process.argv.slice(2);
const AXE = fs.readFileSync(axePath, 'utf8');
const B = `http://127.0.0.1:${port}/beta/`;
const pages = ['index.html', 'Japan/index.html', 'saved.html', 'changes/tokyo.html',
  ...['gallery', 'atlas', 'guidebook', 'insights'].flatMap(v => [`cities/tokyo.html#view=${v}`, `cleveland.html#view=${v}`]),
  'Singapore/chinatown.html#view=atlas', 'cities/tokyo.html#view=gallery&p=kanda-myojin', 'Vietnam/ho-chi-minh-city.html#view=gallery&p=viet-nam-quoc-tu'];
(async () => {
  const b = await chromium.launch(); const res = [];
  for (const [vp, o] of [['m', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['d', { viewport: { width: 1440, height: 900 } }]])
    for (const scheme of ['light', 'dark']) {
      const ctx = await b.newContext({ ...o, colorScheme: scheme, reducedMotion: 'reduce' });
      await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
      for (const u of pages) {
        const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 80)));
        try {
          await p.goto(B + u, { waitUntil: 'load', timeout: 30000 }); await p.waitForTimeout(1200);
          const theme = await p.evaluate(() => document.documentElement.dataset.theme || '');
          if (scheme === 'dark' && !/night|dark/.test(theme)) { const t = await p.$('[data-cleo-theme] >> visible=true'); if (t) { await t.click(); await p.waitForTimeout(500); } }
          await p.addScriptTag({ content: AXE });
          const v = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes.slice(0, 2).map(n => n.target.join(' ').slice(0, 80)) })));
          res.push({ u, vp, scheme, theme: await p.evaluate(() => document.documentElement.dataset.theme || ''), errs: errs.length, serious: v.filter(x => /serious|critical/.test(x.impact)), minor: v.filter(x => !/serious|critical/.test(x.impact)).map(x => x.id + '×' + x.n) });
        } catch (e) { res.push({ u, vp, scheme, fail: String(e).slice(0, 120) }); }
        await p.close();
      }
      await ctx.close();
    }
  await b.close();
  fs.writeFileSync(out, JSON.stringify(res, null, 1));
  const ser = res.filter(r => r.serious && r.serious.length);
  console.log(`runs ${res.length}, failed ${res.filter(r => r.fail).length}, runs with serious/critical ${ser.length}, total serious/critical nodes ${ser.reduce((a, r) => a + r.serious.reduce((s, x) => s + x.n, 0), 0)}`);
  for (const r of ser) console.log(r.vp, r.scheme, r.u, JSON.stringify(r.serious));
  const mi = {}; for (const r of res) for (const m of r.minor || []) { const k = m.split('×')[0]; mi[k] = (mi[k] || 0) + 1; } console.log('moderate/minor rule ids (runs):', JSON.stringify(mi));
})();
