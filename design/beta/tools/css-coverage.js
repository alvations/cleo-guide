#!/usr/bin/env node
/* css-coverage.js — which rules of the designer CSS are never USED by any rendered page, view or state (R8 gap #6).
 *
 * css-dead.py is token-based: a class that appears anywhere in any JS or test counts as live, so retired R6/R7 components
 * whose class names still sit in a script survive it. This asks Chromium instead (CDP CSS rule-usage tracking): every
 * beta page at phone and desktop widths, every city view, and the states a reader can reach (place detail, filters,
 * search, saved and trip with items, map tiles blocked, map library blocked, dark). cleo.css is served as its source
 * pieces (build-css.py --parts), so every unused range maps to an offset in a source file.
 *   node design/beta/tools/css-coverage.js [--quick] [--out design/beta/eval/css-coverage.json]
 * Output: { used: { "<piece>": [[start, end], …] }, sizes: { "<piece>": bytes } }. css-trim.py --coverage applies it. */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../../..'), BETA = path.join(ROOT, 'beta'), ASSETS = path.join(BETA, 'assets');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const QUICK = process.argv.includes('--quick');
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/eval/css-coverage.json'));
function loadPlaywright() { for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { return require(t); } catch (e) { /* next */ } } throw new Error('playwright not found'); }
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.webmanifest': 'application/manifest+json' };
const serve = () => new Promise(res => { const s = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0].split('#')[0]));
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
}); s.listen(0, '127.0.0.1', () => res(s)); });

const parts = execFileSync('python3', [path.join(ROOT, 'design/beta/tools/build-css.py'), '--parts', ASSETS]).toString().trim().split(/\s+/);
const IMPORT = parts.map(p => `@import url("${p}");`).join('\n');
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['assets', 'data', 'feeds'].includes(e.name) ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.html') ? [path.relative(BETA, path.join(d, e.name))] : []);
const ALL = walk(BETA).sort();
const isCity = u => /^(cities\/|Singapore\/(?!index|singapore-old)|Vietnam\/(?!index)|cleveland\.html)/.test(u);
const CITY_DEEP = QUICK ? ['cities/tokyo.html'] : ['cities/tokyo.html', 'cleveland.html', 'Singapore/chinatown.html', 'Singapore/punggol.html', 'Vietnam/hanoi.html', 'cities/newyork.html', 'cities/kyoto.html', 'cities/wheeling.html'];
const VIEWS = ['atlas', 'gallery', 'guidebook', 'insights'];
// full page sweep at these; the deep state sweep at all of them
const WIDE = QUICK ? [[390, 844], [1440, 900]] : [[390, 844], [1440, 900]];
const DEEP_VP = QUICK ? [[390, 844], [1440, 900]] : [[195, 422], [360, 740], [390, 844], [620, 900], [700, 1000], [768, 1024], [844, 390], [960, 800], [1024, 768], [1150, 850], [1240, 860], [1440, 900]];

const used = {}; parts.forEach(p => { used[p] = []; });
const sizes = Object.fromEntries(parts.map(p => [p, fs.statSync(path.join(ASSETS, p)).size]));

(async () => {
  const srv = await serve(), base = `http://127.0.0.1:${srv.address().port}/beta/`;
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });
  let loads = 0;
  async function sweep([w, h], theme, urls, opts = {}) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, hasTouch: w < 900, isMobile: w < 900, reducedMotion: 'no-preference' });
    await ctx.route('**/assets/cleo.css*', r => r.fulfill({ status: 200, contentType: 'text/css', body: IMPORT }));
    await ctx.route(/tile\.openstreetmap|arcgisonline|unpkg|cdnjs|jsdelivr/, r => r.abort());
    if (opts.noLeaflet) await ctx.route(/vendor\/leaflet\/leaflet\.js/, r => r.abort());
    if (opts.seed) await ctx.addInitScript(opts.seed);
    const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page);
    const sheets = {};
    cdp.on('CSS.styleSheetAdded', e => { const b = path.basename((e.header.sourceURL || '').split('?')[0]); if (parts.includes(b)) sheets[e.header.styleSheetId] = b; });
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable'); await cdp.send('CSS.startRuleUsageTracking');
    const take = async () => { const { coverage } = await cdp.send('CSS.takeCoverageDelta'); for (const c of coverage) if (c.used && sheets[c.styleSheetId]) used[sheets[c.styleSheetId]].push([c.startOffset, c.endOffset]); };
    for (const u of urls) {
      const [url, act] = Array.isArray(u) ? u : [u];
      await page.goto(base + url, { waitUntil: 'load' }).catch(() => {}); await page.waitForTimeout(600);
      if (act) { await act(page).catch(() => {}); await page.waitForTimeout(400); }
      // scroll through once so sticky/compact states and lazy sections render
      await page.evaluate(async () => { for (let y = 0; y < Math.min(document.body.scrollHeight, 6000); y += 900) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); }).catch(() => {});
      await take(); loads++;
    }
    process.stdout.write(`${w}x${h} ${theme}${opts.tag ? ' ' + opts.tag : ''}: ${urls.length} loads\n`);
    await ctx.close();
  }
  const clickText = t => async page => { await page.locator(`button:has-text("${t}")`).first().click({ timeout: 1500 }); };
  const detail = async page => { const id = await page.evaluate(() => { const a = document.querySelector('a[href^="#p-"]'); return a && a.getAttribute('href').slice(3); }); if (id) await page.evaluate(i => { location.hash = 'view=gallery&p=' + i; }, id); };
  const atlasPin = async page => { const id = await page.evaluate(() => { const a = document.querySelector('a[href^="#p-"]'); return a && a.getAttribute('href').slice(3); }); if (id) await page.evaluate(i => { location.hash = 'view=atlas&p=' + i; }, id); };
  const search = async page => { await page.locator('[aria-label^="Search"], input[type=search]').first().click({ timeout: 1500 }); await page.keyboard.type('ra'); };
  const searchNone = async page => { await page.locator('[aria-label^="Search"], input[type=search]').first().click({ timeout: 1500 }); await page.keyboard.type('zzqxw'); };
  const pan = async page => { const m = await page.$('.leaflet-container'); if (!m) return; const b = await m.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width / 2 - 160, b.y + b.height / 2 - 80, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(300); };
  const deepUrls = [];
  for (const u of CITY_DEEP) {
    for (const v of VIEWS) deepUrls.push(`${u}#view=${v}`);
    deepUrls.push([`${u}#view=gallery`, detail], [`${u}#view=atlas`, atlasPin], [`${u}#view=atlas`, clickText('Filters')], [`${u}#view=gallery`, clickText('Filters')],
      [`${u}#view=atlas`, search], [`${u}#view=gallery`, searchNone], [`${u}#view=atlas`, pan], [`${u}#view=atlas`, clickText('Top picks')], [`${u}#view=gallery&t=1`], [`${u}#view=atlas&c=TEMPLE`]);
  }
  const seedSaved = `try{const k=Object.keys(localStorage);}catch(e){}`;   // saved/trip state is seeded by visiting a detail and pressing Save below
  const saveOne = async page => { await detail(page); await page.waitForTimeout(400); await page.locator('button[aria-label*="Save"], button:has-text("Save")').first().click({ timeout: 1500 }); };
  for (const vp of WIDE) {
    await sweep(vp, 'light', ALL.map(u => isCity(u) ? `${u}#view=gallery` : u), { tag: 'all pages' });
    await sweep(vp, 'light', ALL.filter(isCity).map(u => `${u}#view=atlas`), { tag: 'all cities atlas' });
  }
  for (const vp of DEEP_VP) await sweep(vp, 'light', deepUrls, { tag: 'deep' });
  for (const vp of [[390, 844], [1440, 900]]) {
    await sweep(vp, 'dark', deepUrls.slice(0, 14).concat(['index.html', 'Japan/index.html', 'trip.html', 'saved.html']), { tag: 'dark' });
    await sweep(vp, 'light', [['cities/tokyo.html#view=gallery', saveOne], 'saved.html', 'trip.html', ['cities/tokyo.html#view=gallery', saveOne], 'trip.html'], { tag: 'saved/trip', seed: seedSaved });
    await sweep(vp, 'light', CITY_DEEP.map(u => `${u}#view=atlas`), { tag: 'no leaflet', noLeaflet: true });
  }
  await browser.close(); srv.close();
  for (const p of parts) fs.rmSync(path.join(ASSETS, p), { force: true });
  // merge ranges
  for (const p of parts) { const r = used[p].sort((a, b) => a[0] - b[0]); const m = []; for (const x of r) { if (m.length && x[0] <= m[m.length - 1][1]) m[m.length - 1][1] = Math.max(m[m.length - 1][1], x[1]); else m.push(x.slice()); } used[p] = m; }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ when: new Date().toISOString(), loads, used, sizes }));
  for (const p of parts) { const u = used[p].reduce((s, [a, b]) => s + b - a, 0); console.log(`${p}: ${(sizes[p] / 1024).toFixed(1)} KB, rules used cover ${(u / 1024).toFixed(1)} KB`); }
  console.log(`css-coverage: ${loads} loads → ${path.relative(ROOT, OUT)}`);
})();
