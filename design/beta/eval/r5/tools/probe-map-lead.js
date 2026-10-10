// R5 evaluator probe (ports: 8796 = R4 mirror, 8795 = R5).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch();
  for (const port of [8796, 8795]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
    const p = await ctx.newPage(); const errs=[]; p.on('pageerror', e => errs.push(String(e)));
    await p.goto(`http://127.0.0.1:${port}/beta/cities/tokyo.html`, { waitUntil: 'load' }); await p.waitForTimeout(1200);
    const toggles = await p.$$eval('[data-cleo-map]', a => a.map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, txt: (e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,30), vis: r.width>0&&r.height>0, y: Math.round(r.top) }; }));
    const visMap = await p.$('[data-cleo-map] >> visible=true');
    let after = null;
    if (visMap) { await visMap.click(); await p.waitForTimeout(1500);
      after = await p.evaluate(() => { const m = document.querySelector('.mappane, .leaflet-container'); const r = m && m.getBoundingClientRect(); return { hash: location.hash, map: r ? [Math.round(r.width), Math.round(r.height), Math.round(r.top)] : null, markers: document.querySelectorAll('.leaflet-marker-icon,.leaflet-interactive').length }; }); }
    // lead card vs Start button on Cleveland desktop
    await p.setViewportSize({ width: 1440, height: 900 });
    await p.goto(`http://127.0.0.1:${port}/beta/cleveland.html`, { waitUntil: 'load' }); await p.waitForTimeout(1000);
    const lead = await p.evaluate(() => ({ btn: [...document.querySelectorAll('a,button')].map(e => e.textContent.trim()).filter(t => /^Start with/.test(t)), card: [...document.querySelectorAll('#cleo-lead, .lead, [class*=lead]')].map(e => e.textContent.trim().slice(0, 80)).slice(0,3) }));
    console.log(port, JSON.stringify({ toggles, after, lead, errs }));
    await ctx.close();
  }
  await b.close();
})();
