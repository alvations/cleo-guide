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
const SCRATCH = fs.mkdtempSync(path.join(require('os').tmpdir(), 'cleo-cc-'));   // the cc-NN pieces live here, never in beta/assets
const CC = b => /^cc-\d\d-/.test(b);
const at = p => path.join(CC(p) ? SCRATCH : ASSETS, p);
process.on('exit', () => fs.rmSync(SCRATCH, { recursive: true, force: true }));
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => process.exit(130));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const QUICK = process.argv.includes('--quick');
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/eval/css-coverage.json'));
function loadPlaywright() { for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { return require(t); } catch (e) { /* next */ } } throw new Error('playwright not found'); }
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.webmanifest': 'application/manifest+json' };
const serve = () => new Promise(res => { const s = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0].split('#')[0]));
  if (CC(path.basename(f))) f = path.join(SCRATCH, path.basename(f));
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
}); s.listen(0, '127.0.0.1', () => res(s)); });

const parts = execFileSync('python3', [path.join(ROOT, 'design/beta/tools/build-css.py'), '--parts', SCRATCH]).toString().trim().split(/\s+/);
const BYTEXT = new Map(parts.concat(['fe-a.css', 'fe-b.css']).map(p => [fs.readFileSync(at(p), 'utf8'), p]));
const IMPORT = parts.map(p => `@import url("${p}");`).join('\n');
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['assets', 'data', 'feeds'].includes(e.name) ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.html') ? [path.relative(BETA, path.join(d, e.name))] : []);
const ALL = walk(BETA).sort();
const isCity = u => /^(cities\/|Singapore\/(?!index|singapore-old)|Vietnam\/(?!index)|cleveland\.html)/.test(u);
const CITY_DEEP = QUICK ? ['cities/tokyo.html'] : ['cities/tokyo.html', 'cleveland.html', 'Singapore/chinatown.html', 'Singapore/punggol.html', 'Vietnam/hanoi.html', 'cities/newyork.html', 'cities/kyoto.html', 'cities/wheeling.html'];
const VIEWS = ['atlas', 'gallery', 'guidebook', 'insights'];
// full page sweep at these; the deep state sweep at all of them
const WIDE = QUICK ? [[390, 844], [1440, 900]] : [[390, 844], [1440, 900]];
const DEEP_VP = QUICK ? [[390, 844], [1440, 900]] : [[195, 422], [360, 740], [390, 844], [620, 900], [700, 1000], [768, 1024], [844, 390], [960, 800], [1024, 768], [1150, 850], [1240, 860], [1440, 900]];

const TRACK = parts.concat(['fe-a.css', 'fe-b.css']);   // the lanes' sheets too, so FE-A and FE-B can cut with the same evidence
const used = {}; TRACK.forEach(p => { used[p] = []; });
const sizes = Object.fromEntries(TRACK.map(p => [p, fs.statSync(at(p)).size]));

(async () => {
  const srv = await serve(), base = `http://127.0.0.1:${srv.address().port}/beta/`;
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });
  let loads = 0;
  async function sweep([w, h], theme, urls, opts = {}) {
    const ctx = await browser.newContext({ serviceWorkers: 'block', viewport: { width: w, height: h }, colorScheme: theme, hasTouch: w < 900, isMobile: w < 900, reducedMotion: 'no-preference' });
    // each piece as its own top-level <link> in place of cleo.css: @import children come back after a navigation under the
    // parent's id (ambiguous offsets), top-level sheets don't
    await ctx.route(r => /\.html$|\/$/.test(new URL(r).pathname), async (route, req) => {
      if (req.resourceType() !== 'document') return route.continue();
      let f = path.join(ROOT, decodeURIComponent(new URL(req.url()).pathname)); try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { return route.continue(); }
      const html = fs.readFileSync(f, 'utf8').replace(/<link rel="stylesheet" href="([^"]*?)cleo\.css[^"]*">/, (m, pre) => parts.map(p => `<link rel="stylesheet" href="${pre}${p}">`).join(''));
      route.fulfill({ status: 200, contentType: 'text/html', body: html }); });
    await ctx.route(/tile\.openstreetmap|arcgisonline|unpkg|cdnjs|jsdelivr/, r => r.abort());
    // .area is content-visibility:auto, so off-screen areas skip style and their rules read as unused (Platform's
    // 844×390 .pl-k / .cover misses). Render every area; this sheet is not tracked, so it adds no coverage of its own.
    await ctx.addInitScript(() => document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = '*{content-visibility:visible!important}'; document.head.appendChild(s); }));
    if (opts.noLeaflet) await ctx.route(/vendor\/leaflet\/leaflet\.js/, r => r.abort());
    if (opts.saved) await ctx.addInitScript(() => { try { if (!localStorage.getItem('cleo:v1:saved')) localStorage.setItem('cleo:v1:saved', JSON.stringify({ 'tokyo/kanda-myojin': { t: 1 }, 'tokyo/imperial-palace-east-gardens': { t: 2 }, 'tokyo/yasukuni-shrine': { t: 3 }, 'washingtondc/lincoln-memorial': { t: 4 }, 'washingtondc/washington-monument': { t: 5 } })); } catch (e) { /* storage blocked */ } });
    if (opts.seed) await ctx.addInitScript(opts.seed);
    const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page);
    const sheets = {};
    cdp.on('CSS.styleSheetAdded', e => { const b = path.basename((e.header.sourceURL || '').split('?')[0]); sheets[e.header.styleSheetId] = TRACK.includes(b) ? b : null; });
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable'); await cdp.send('CSS.startRuleUsageTracking');
    // Chromium reuses cached @import sheets after a navigation under NEW ids without a styleSheetAdded event, so an
    // unknown id is resolved once by its text (each piece's text is unique)
    const resolve = async sid => { if (sid in sheets) return sheets[sid]; let t = ''; try { t = (await cdp.send('CSS.getStyleSheetText', { styleSheetId: sid })).text; } catch (e) { /* gone */ } sheets[sid] = BYTEXT.get(t) || null; return sheets[sid]; };
    const take = async () => { const { coverage } = await cdp.send('CSS.takeCoverageDelta'); for (const c of coverage) { if (!c.used) continue; const n = await resolve(c.styleSheetId); if (n) used[n].push([c.startOffset, c.endOffset]); } };
    for (const u of urls) {
      const [url, act] = Array.isArray(u) ? u : [u];
      await page.goto(base + url, { waitUntil: 'load' }).catch(() => {}); await page.waitForTimeout(600);
      if (act) { await act(page).catch(() => {}); await page.waitForTimeout(400); }
      // scroll through once so sticky/compact states and lazy sections render
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 900) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); }).catch(() => {});
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
  // reachable states a cold load never shows (orchestrator, 2026-10-17): a day plan (#day=<area key from the page's info.days>),
  // Near me with a mocked position, the share sheet, Show all, Guidebook anchors, Insights tabs
  const dayKey = async page => { const k = await page.evaluate(() => { const m = document.documentElement.innerHTML.match(/"days":\{"([^"]+)"/); return m && m[1]; }); if (k) await page.evaluate(x => { location.hash = 'view=gallery&day=' + encodeURIComponent(x); }, k); await page.waitForTimeout(500); await page.evaluate(() => { const d = document.querySelector('section.day'); if (d) d.scrollIntoView(); }); };
  const nearMe = async page => { await page.context().grantPermissions(['geolocation']); await page.context().setGeolocation({ latitude: 35.6812, longitude: 139.7671 }); await page.locator('button:has-text("Near me")').first().click({ timeout: 1500 }); };
  const share = async page => { await detail(page); await page.waitForTimeout(400); await page.locator('button:has-text("Share")').first().click({ timeout: 1500 }); };
  const showAll = async page => { await page.locator('a:has-text("Show all"), button:has-text("Show all")').first().click({ timeout: 1500 }); };
  const tabs = async page => { for (const t of await page.$$('[role=tab]')) { await t.click().catch(() => {}); await page.waitForTimeout(150); } };
  const deepUrls = [];
  for (const u of CITY_DEEP) {
    for (const v of VIEWS) deepUrls.push(`${u}#view=${v}`);
    deepUrls.push([`${u}#view=gallery`, detail], [`${u}#view=atlas`, atlasPin], [`${u}#view=atlas`, clickText('Filters')], [`${u}#view=gallery`, clickText('Filters')],
      [`${u}#view=atlas`, search], [`${u}#view=gallery`, searchNone], [`${u}#view=atlas`, pan], [`${u}#view=atlas`, clickText('Top picks')], [`${u}#view=gallery&t=1`], [`${u}#view=atlas&c=TEMPLE`],
      [`${u}#view=gallery`, dayKey], [`${u}#view=atlas`, nearMe], [`${u}#view=gallery`, share], [`${u}#view=atlas`, showAll], [`${u}#view=insights`, tabs], [`${u}#view=guidebook`, async page => { const a = await page.$('a[href^="#"]:not([href="#"])'); if (a) await a.click().catch(() => {}); }]);
  }
  const seedSaved = `try{const k=Object.keys(localStorage);}catch(e){}`;   // saved/trip state is seeded by visiting a detail and pressing Save below
  const saveOne = async page => { await detail(page); await page.waitForTimeout(400); await page.locator('button[aria-label*="Save"], button:has-text("Save")').first().click({ timeout: 1500 }); };
  for (const vp of WIDE) {
    await sweep(vp, 'light', ALL.map(u => isCity(u) ? `${u}#view=gallery` : u), { tag: 'all pages' });
    await sweep(vp, 'light', ALL.filter(isCity).map(u => `${u}#view=atlas`), { tag: 'all cities atlas' });
  }
  for (const vp of DEEP_VP) { await sweep(vp, 'light', deepUrls, { tag: 'deep' }); await sweep(vp, 'light', deepUrls, { tag: 'deep, saved places', saved: true }); }   // the empty and the saved reader both
  for (const vp of [[390, 844], [1440, 900]]) {
    await sweep(vp, 'dark', deepUrls.slice(0, 14).concat(['index.html', 'Japan/index.html', 'trip.html', 'saved.html']), { tag: 'dark' });
    await sweep(vp, 'light', [['cities/tokyo.html#view=gallery', saveOne], 'saved.html', 'trip.html', ['cities/tokyo.html#view=gallery', saveOne], 'trip.html'], { tag: 'saved/trip', seed: seedSaved });
    await sweep(vp, 'light', CITY_DEEP.map(u => `${u}#view=atlas`), { tag: 'no leaflet', noLeaflet: true });
  }
  await browser.close(); srv.close();
  fs.rmSync(SCRATCH, { recursive: true, force: true });
  // merge ranges
  for (const p of TRACK) { const r = used[p].sort((a, b) => a[0] - b[0]); const m = []; for (const x of r) { if (m.length && x[0] <= m[m.length - 1][1]) m[m.length - 1][1] = Math.max(m[m.length - 1][1], x[1]); else m.push(x.slice()); } used[p] = m; }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ when: new Date().toISOString(), loads, used, sizes }));
  for (const p of TRACK) { const u = used[p].reduce((s, [a, b]) => s + b - a, 0); console.log(`${p}: ${(sizes[p] / 1024).toFixed(1)} KB, rules used cover ${(u / 1024).toFixed(1)} KB`); }
  console.log(`css-coverage: ${loads} loads → ${path.relative(ROOT, OUT)}`);
})();
