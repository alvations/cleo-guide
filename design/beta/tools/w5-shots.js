// W5 designer captures (ROUND-4 gaps #4, #6): DPR-1 crops of macron display names + the Gallery covers, phone + desktop.
//   NODE_PATH=$(npm root -g) node design/beta/tools/w5-shots.js <outdir> [tag]
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..', '..', 'beta');
const OUT = process.argv[2] || 'design/beta/eval/w5/designer', TAG = process.argv[3] || 'after';
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json' };
const serve = () => new Promise(res => { const s = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p); if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0, () => res(s)); });
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = await serve(), base = 'http://127.0.0.1:' + srv.address().port + '/';
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const VP = { m: { width: 390, height: 844 }, d: { width: 1440, height: 900 } };
  const shot = async (name, url, vp, fn) => {
    const ctx = await b.newContext({ viewport: VP[vp], deviceScaleFactor: 1, reducedMotion: 'reduce' }); const pg = await ctx.newPage();
    const errs = []; pg.on('pageerror', e => errs.push(e.message));
    await pg.goto(base + url, { waitUntil: 'load' }); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(1500);
    if (fn) await fn(pg);
    await pg.screenshot({ path: path.join(OUT, `${name}-${vp}-${TAG}.jpg`), quality: 80 });
    if (errs.length) console.log(name, vp, 'JS errors:', errs);
    await ctx.close();
  };
  for (const vp of ['m', 'd']) {
    await shot('tokyo-hero', 'cities/tokyo.html', vp);
    await shot('tokyo-gallery', 'cities/tokyo.html#view=gallery', vp);
    await shot('tokyo-kanda', 'cities/tokyo.html#view=gallery', vp, pg => pg.evaluate(() => { const e = [...document.querySelectorAll('.gc')].find(x => /Kanda/.test(x.textContent)); e && e.scrollIntoView({ block: 'center' }); }));
    await shot('cle-gallery', 'cleveland.html#view=gallery', vp);
  }
  // DPR-1 zoomed crops of the macron names (for REVIEW-W5): element screenshots, no scaling
  const ctx = await b.newContext({ viewport: VP.d, deviceScaleFactor: 1, reducedMotion: 'reduce' }); const pg = await ctx.newPage();
  await pg.goto(base + 'cities/tokyo.html', { waitUntil: 'load' }); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(800);
  await pg.locator('.title').first().screenshot({ path: path.join(OUT, `crop-hero-d-${TAG}.png`) });
  await pg.locator('#p-kanda-myojin .pl-n').screenshot({ path: path.join(OUT, `crop-kanda-name-d-${TAG}.png`) });
  await pg.goto(base + 'cities/tokyo.html#view=gallery', { waitUntil: 'load' }); await pg.waitForTimeout(1500);
  const gc = pg.locator('.gc', { hasText: 'Kanda' }).first(); if (await gc.count()) await gc.screenshot({ path: path.join(OUT, `crop-kanda-cover-d-${TAG}.png`) });
  await ctx.close(); await b.close(); srv.close();
})();
