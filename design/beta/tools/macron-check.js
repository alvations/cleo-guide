// Macron visibility at DPR 1 (ROUND-4 gap #4). For each display line that carries a macron, screenshot it as rendered,
// then with every macron vowel folded (ō→o …) in place, and count the pixels that differ strongly (summed RGB delta > 150 — a faint anti-aliased smear does not count). < 4 = FAIL.
//   NODE_PATH=$(npm root -g) node design/beta/tools/macron-check.js        (exit 1 if any line shows 0 macron pixels)
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..', '..', 'beta');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
const CASES = [   // [label, page, selector, viewport]
  ['hero dek (desktop)', 'cities/tokyo.html', '.masthead .dek', 'd'], ['hero dek (phone)', 'cities/tokyo.html', '.masthead .dek', 'm'],
  ['card name Kanda Myōjin', 'cities/tokyo.html', '#p-kanda-myojin .pl-n', 'd'], ['card name Kanda Myōjin (phone)', 'cities/tokyo.html', '#p-kanda-myojin .pl-n', 'm'],
  ['area title Jōnan', 'cities/tokyo.html', '#ah-JONAN .area-n', 'd'], ['area title Jōtō', 'cities/tokyo.html', '#ah-JOTO .area-n', 'd'],
  ['Gallery cover name', 'cities/tokyo.html#view=gallery', '.gc-n', 'd'], ['Gallery cover name (phone)', 'cities/tokyo.html#view=gallery', '.gc-n', 'm'],
];
const VP = { m: { width: 390, height: 844 }, d: { width: 1440, height: 900 } };
const FOLD = { 'ā': 'a', 'ē': 'e', 'ī': 'i', 'ō': 'o', 'ū': 'u', 'Ā': 'A', 'Ē': 'E', 'Ī': 'I', 'Ō': 'O', 'Ū': 'U' };
(async () => {
  const srv = await new Promise(res => { const s = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0, () => res(s)); });
  const base = `http://127.0.0.1:${srv.address().port}/`;
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  let bad = 0;
  for (const [label, url, sel, vp] of CASES) {
    const pg = await b.newPage({ viewport: VP[vp], deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await pg.goto(base + url); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(1200);
    const loc = pg.locator(sel + ':visible').filter({ hasText: /[āēīōūĀĒĪŌŪ]/ }).first();
    const el = await loc.count() ? await loc.elementHandle() : null;
    if (!el) { console.log(`?    ${label}: no macron line under ${sel}`); await pg.close(); continue; }
    await el.scrollIntoViewIfNeeded();
    const text = (await el.evaluate(n => n.textContent.trim())).split('\n')[0].slice(0, 60);
    const shot = () => el.screenshot({ animations: 'disabled', timeout: 8000 });
    const a = await shot();
    await el.evaluate((n, F) => { const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); let t; while ((t = w.nextNode())) t.data = t.data.replace(/[āēīōūĀĒĪŌŪ]/g, c => F[c]); }, FOLD);
    const c = await shot();
    const diff = await pg.evaluate(async ([x, y]) => { const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
      const [i1, i2] = await Promise.all([load(x), load(y)]); const w = Math.min(i1.width, i2.width), h = Math.min(i1.height, i2.height);
      const px = i => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d'); g.drawImage(i, 0, 0); return g.getImageData(0, 0, w, h).data; };
      const p1 = px(i1), p2 = px(i2); let n = 0; for (let k = 0; k < p1.length; k += 4) if (Math.abs(p1[k] - p2[k]) + Math.abs(p1[k + 1] - p2[k + 1]) + Math.abs(p1[k + 2] - p2[k + 2]) > 150) n++; return n; },
      [a.toString('base64'), c.toString('base64')]);
    const ok = diff >= 4; if (!ok) bad++;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${label} [${vp}] "${text}" — ${diff} macron px at DPR 1`);
    await pg.close();
  }
  await b.close(); srv.close(); process.exit(bad ? 1 : 0);
})();
