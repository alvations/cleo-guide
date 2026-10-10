// R5 evaluator probe (ports: 8796 = R4 mirror, 8795 = R5).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:8795/beta/cities/tokyo.html', { waitUntil: 'load' }); await p.waitForTimeout(1200);
  const st = () => p.evaluate(() => { const m = document.querySelector('.mappane'); const r = m && m.getBoundingClientRect(); return { hash: location.hash, map: r ? [Math.round(r.width), Math.round(r.height)] : null, sy: Math.round(scrollY) }; });
  const ctxt = await p.$eval('[data-cleo-map] >> visible=true', e => (e.closest('section,div')||{}).className + ' | ' + e.outerHTML.slice(0,160)).catch(e=>String(e));
  console.log('gallery map btn:', ctxt);
  await (await p.$('[data-cleo-map] >> visible=true')).click(); await p.waitForTimeout(1500); console.log('tap1', JSON.stringify(await st()));
  const v = await p.$('[data-cleo-map] >> visible=true'); if (v) { await v.click(); await p.waitForTimeout(1500); console.log('tap2', JSON.stringify(await st())); }
  await p.goto('http://127.0.0.1:8795/beta/cities/tokyo.html#view=atlas', { waitUntil: 'load' }); await p.waitForTimeout(1200);
  await (await p.$('[data-cleo-map] >> visible=true')).click(); await p.waitForTimeout(1500); console.log('atlas tap', JSON.stringify(await st()));
  await b.close();
})();
