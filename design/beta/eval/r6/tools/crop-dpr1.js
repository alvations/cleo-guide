// R6 evaluator: DPR 1 crops of macron lines (card name 21 px, Insights dek 16 px), R5 (8802) vs R6 (8801). Usage: node crop-dpr1.js <outdir>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const path = require('path'); const out = process.argv[2];
const T = [['kanda-card', 'cities/tokyo.html', /^Kanda Myōjin$/], ['jonan-dek', 'cities/tokyo.html#view=insights', /Jōnan/]];
(async () => { const b = await chromium.launch();
  for (const [port, lab] of [[8802, 'r5'], [8801, 'r6']]) { const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
    for (const [n, u, re] of T) { const p = await ctx.newPage(); await p.goto(`http://127.0.0.1:${port}/beta/${u}`, { waitUntil: 'load' }); await p.waitForTimeout(1500); await p.evaluate(() => document.fonts.ready);
      const r = await p.evaluate(src => { const re = new RegExp(src.s, src.f); const e = [...document.querySelectorAll('h1,h2,h3,h4,p,span,a,div')].find(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.top >= 0 && b.bottom < innerHeight && [...e.childNodes].some(n => n.nodeType === 3 && re.test(n.textContent.trim())); }); if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.max(0, b.left - 6), y: Math.max(0, b.top - 6), width: Math.min(b.width + 12, 700), height: b.height + 12, fs: getComputedStyle(e).fontSize, ff: getComputedStyle(e).fontFamily.split(',')[0] }; }, { s: re.source, f: re.flags });
      if (r) { await p.screenshot({ path: path.join(out, `dpr1-${n}-${lab}.png`), clip: { x: r.x, y: r.y, width: r.width, height: r.height } }); console.log(lab, n, r.fs, r.ff); } else console.log(lab, n, 'not found');
      await p.close(); }
    await ctx.close(); }
  await b.close(); })();
