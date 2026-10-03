#!/usr/bin/env node
/**
 * Site-wide browser QA — every HTML page, mobile + desktop, in real Chromium.
 *
 * Serves the repo root over a tiny in-process static server (so relative links
 * behave as on GitHub Pages) and loads each page in two network scenarios:
 *
 *   offline — every off-origin request is aborted (the sandbox egress case, and
 *             CLAUDE.md rule 4): the page must still render its content.
 *   leaflet — Leaflet's CDN URLs are fulfilled from tools/node_modules/leaflet and
 *             tile requests get a 1×1 PNG: the map must mount, markers draw, and the
 *             base-layer switcher must change tile hosts (never a key-required one).
 *
 * Per page/viewport it records: JS errors (pageerror + console.error, with
 * blocked-network noise split out), horizontal overflow, small text, small tap
 * targets, "API key required" text, engine interactions (filter chips, search,
 * Sights/Food mode), internal links + #anchors, and performance (bytes, DOM
 * nodes, FCP, largest inline script, images, render-blocking head resources).
 *
 * Usage:  cd tools && npm run qa                      # all pages
 *         node qa-site.js --only Singapore/ --shots    # subset, with screenshots
 * Flags:  --only <substr>  --no-leaflet  --shots (sample)  --all-shots  --out <dir>
 *         --concurrency N
 * Output: qa/results.json, qa/summary.json, qa/screenshots/*.jpg
 * Exit:   1 if any page FAILs.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

function loadPlaywright() {
  const tries = ['playwright', '/opt/node22/lib/node_modules/playwright',
    '/opt/node-tools/node_modules/playwright'];
  for (const t of tries) { try { return require(t); } catch (e) { /* next */ } }
  throw new Error('playwright not found — install it or use the preinstalled global copy');
}

const ROOT = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const flag = n => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const ONLY_ = opt('--only', '');
const OUT = path.resolve(ROOT, opt('--out', ONLY_ ? 'qa/partial' : 'qa'));  // subsets never clobber the full run
const ONLY = opt('--only', '');
const CONC = +opt('--concurrency', 4);
const SHOTS = flag('--shots') || flag('--all-shots');
const ALL_SHOTS = flag('--all-shots');
const LEAFLET = !flag('--no-leaflet');

const VIEWPORTS = {
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
};
// Representative sample screenshotted with --shots (failing pages are always shot).
const SAMPLE = ['index.html', 'cleveland.html', 'cities/youngstown.html', 'cities/newyork.html',
  'Singapore/index.html', 'Singapore/tiong-bahru.html', 'Vietnam/index.html', 'Japan/index.html',
  'Belgium/index.html', 'Germany/index.html', 'beta/index.html', 'versions/v1-shortlist/guide.html'];

// ---------- discovery ----------
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'qa'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(path.relative(ROOT, p).split(path.sep).join('/'));
  }
  return acc;
}
// tools/*.html are dev helpers/templates, not site pages.
const PAGES = walk(ROOT).filter(p => !p.startsWith('tools/')).filter(p => p.includes(ONLY)).sort();

// ---------- static server ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.md': 'text/plain; charset=utf-8', '.kml': 'application/xml' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
      let f = path.join(ROOT, u);
      if (!f.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
      try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 below */ }
      fs.readFile(f, (err, buf) => {
        if (err) { rsp.writeHead(404); return rsp.end('404'); }
        rsp.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream',
          'Content-Length': buf.length });
        rsp.end(buf);
      });
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

// ---------- in-page probes ----------
const PROBE = () => {
  const vw = window.innerWidth;
  const de = document.documentElement;
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const desc = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
    (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  // overflow culprits
  const over = [];
  if (de.scrollWidth > vw + 1) {
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 && r.width > 0 && vis(el)) {
        let p = el.parentElement, clipped = false;
        while (p && p !== document.body) { const o = getComputedStyle(p).overflowX;
          if (o === 'hidden' || o === 'auto' || o === 'scroll' || o === 'clip') { clipped = true; break; } p = p.parentElement; }
        if (!clipped) over.push(desc(el) + ' right=' + Math.round(r.right));
        if (over.length >= 6) break;
      }
    }
  }
  // small text: elements owning a non-empty text node
  const small = [], smallBody = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set(); let n;
  while ((n = tw.nextNode())) {
    const t = n.textContent.trim(); const el = n.parentElement;
    if (!t || !el || seen.has(el)) continue; seen.add(el);
    if (el.closest('script,style,noscript,.leaflet-container,svg')) continue;
    if (!vis(el)) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 12) {
      const full = el.textContent.trim();
      const rec = desc(el) + ' ' + fs + 'px "' + full.slice(0, 40) + '"';
      if (full.length > 60 && fs < 12) smallBody.push(rec); else if (fs < 11) small.push(rec);
    }
  }
  // tap targets (primary controls only; inline links in prose are exempt)
  const taps = [];
  for (const el of document.querySelectorAll('button, .chip, .modebtn, input:not([type=hidden]), select, [role=button], nav a, a.country, a.cardmain, .tripbtn')) {
    if (!vis(el) || el.closest('.leaflet-container')) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 40 || r.width < 40) taps.push(desc(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
  }
  const scripts = [...document.scripts];
  const inline = scripts.filter(s => !s.src).map(s => s.textContent.length);
  const hasMap = !!document.getElementById('map') || !!document.querySelector('.leaflet-container');
  const fcp = (performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime;
  const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'));
  const ids = [...document.querySelectorAll('[id],[name]')].map(e => e.id || e.getAttribute('name'));
  const txt = document.body ? document.body.innerText : '';
  return {
    title: document.title, vw, scrollWidth: de.scrollWidth, overflow: de.scrollWidth > vw + 1, over,
    viewportMeta: !!document.querySelector('meta[name=viewport]'),
    textLen: txt.length, apiKey: /API key required|ADD GOOGLE API KEY/i.test(txt),
    small: small.slice(0, 8), smallN: small.length, smallBody: smallBody.slice(0, 8), smallBodyN: smallBody.length,
    taps: taps.slice(0, 8), tapsN: taps.length,
    domNodes: document.getElementsByTagName('*').length, inlineScripts: inline.length,
    largestInline: Math.max(0, ...inline), hasMap, fcp, links, ids,
    imgs: [...document.images].map(i => i.currentSrc || i.src).filter(Boolean),
    engine: !!document.getElementById('list') && !!document.getElementById('modeFood'),
  };
};

// Engine pages: chips/search/mode must actually change the visible list.
async function engineChecks(page) {
  const count = () => page.evaluate(() => [...document.querySelectorAll('#list .entry')]
    .filter(e => e.offsetParent !== null).length);
  const r = { entries0: await count() };
  // filter chips — any group whose non-"all" chip changes the list counts
  for (const g of ['rankFilter', 'catFilter', 'dayFilter', 'srcFilter']) {
    const chip = page.locator(`#${g} button.chip[aria-pressed="false"]`).first();
    if (!(await chip.count()) || !(await chip.isVisible().catch(() => false))) continue;
    await chip.click({ timeout: 3000 }).catch(() => {});
    const n = await count();
    const all = page.locator(`#${g} button.chip[data-v="all"]`);
    if (await all.count()) await all.click({ timeout: 3000 }).catch(() => {});
    if (n !== r.entries0) { r.filter = { group: g, before: r.entries0, after: n }; break; }
  }
  if (!r.filter) r.filter = { changed: false };
  // search
  const s = page.locator('#search');
  if (await s.count() && await s.isVisible().catch(() => false)) {
    const word = await page.evaluate(() => { const e = document.querySelector('#list .entry h3') || document.querySelector('#list .entry');
      const t = e ? ((e.firstChild && e.firstChild.nodeType === 3) ? e.firstChild.textContent : e.textContent) : '';
      return (t.trim().match(/[A-Za-z]{4,}/) || [''])[0]; });
    await s.fill('zzqxvnomatch'); await page.waitForTimeout(250);
    const none = await count();
    await s.fill(word); await page.waitForTimeout(250);
    const some = await count();
    await s.fill(''); await page.waitForTimeout(250);
    r.search = { none, word, some, ok: none === 0 && some > 0 && some < r.entries0 + 999 };
  }
  // Sights ↔ Food
  const food = page.locator('#modeFood');
  if (await food.isVisible().catch(() => false)) {
    await food.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(200);
    const nf = await count();
    const cz = await page.locator('#cuisineFilter button.chip[aria-pressed="false"]').first();
    let czChanged = null;
    if (await cz.count() && await cz.isVisible().catch(() => false)) {
      await cz.click({ timeout: 3000 }).catch(() => {}); czChanged = (await count()) !== nf;
      const all = page.locator('#cuisineFilter button.chip[data-v="all"]');
      if (await all.count()) await all.click({ timeout: 3000 }).catch(() => {});
    }
    r.food = { entries: nf, cuisineChanged: czChanged };
    await page.locator('#modeSights').click({ timeout: 3000 }).catch(() => {});
  }
  return r;
}

async function mapChecks(page, tileHosts) {
  await page.waitForSelector('.leaflet-container', { timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(600);
  const m = await page.evaluate(() => ({
    mounted: !!document.querySelector('.leaflet-container'),
    markers: document.querySelectorAll('.leaflet-marker-icon, .leaflet-overlay-pane path.leaflet-interactive').length,
    tiles: document.querySelectorAll('img.leaflet-tile').length,
  }));
  m.bases = [];
  const chips = page.locator('#baseFilter button.chip');
  const nb = await chips.count();
  for (let i = 0; i < nb; i++) {
    tileHosts.length = 0;
    const c = chips.nth(i);
    if (!(await c.isVisible().catch(() => false))) continue;
    await c.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(400);
    m.bases.push({ base: await c.getAttribute('data-v'), hosts: [...new Set(tileHosts)] });
  }
  return m;
}

const BLOCKED_NET = /net::ERR_|Failed to load resource|ERR_BLOCKED|ERR_FAILED|ERR_NAME_NOT_RESOLVED|ERR_INTERNET/;
const KEY_TILE_HOSTS = /cartocdn|googleapis\.com\/maps|mt\d?\.google|khms|mapbox|thunderforest|stadiamaps/;
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const LEAF_DIR = path.dirname(require.resolve('leaflet/dist/leaflet.js'));

async function runPage(browser, base, rel, vpName, mode) {
  const ctx = await browser.newContext({ ...VIEWPORTS[vpName], serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = [], netNoise = [], tileHosts = [], local404 = [];
  let bytes = 0, imgBytes = 0, offOrigin = 0;
  const origin = new URL(base).origin;
  await ctx.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith(origin) || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    offOrigin++;
    if (mode === 'leaflet') {
      const lm = u.match(/leaflet(?:\/|@)[\d.]+\/(?:dist\/)?(leaflet(?:\.min)?\.(js|css))/) || u.match(/\/(leaflet(?:\.min)?\.(js|css))(\?|$)/);
      if (lm) {
        const file = path.join(LEAF_DIR, lm[2] === 'js' ? 'leaflet.js' : 'leaflet.css');
        return route.fulfill({ status: 200, contentType: lm[2] === 'js' ? 'text/javascript' : 'text/css', body: fs.readFileSync(file) });
      }
      if (route.request().resourceType() === 'image' && /tile|arcgisonline|\/\d+\/\d+\/\d+/.test(u)) {
        tileHosts.push(new URL(u).host);
        return route.fulfill({ status: 200, contentType: 'image/png', body: PNG1 });
      }
    }
    return route.abort('blockedbyclient');
  });
  page.on('pageerror', e => errors.push('pageerror: ' + (e.message || String(e)).slice(0, 300)));
  page.on('console', m => { if (m.type() !== 'error') return; const t = m.text();
    (BLOCKED_NET.test(t) ? netNoise : errors).push(t.slice(0, 300)); });
  page.on('response', async r => {
    if (!r.url().startsWith(origin)) return;
    if (r.status() >= 400) local404.push(r.url().slice(origin.length));
    const len = +(r.headers()['content-length'] || 0); bytes += len;
    if (r.request().resourceType() === 'image') imgBytes += len;
  });
  const t0 = Date.now();
  let loadErr = null;
  try { await page.goto(base + rel, { waitUntil: 'load', timeout: 30000 }); }
  catch (e) { loadErr = String(e.message || e).slice(0, 200); }
  const loadMs = Date.now() - t0;
  await page.waitForTimeout(300);
  const res = { page: rel, viewport: vpName, mode, loadMs, loadErr };
  try {
    Object.assign(res, await page.evaluate(PROBE));
    if (mode === 'offline' && res.engine) res.interact = await engineChecks(page);
    if (mode === 'leaflet') res.map = await mapChecks(page, tileHosts);
    res.postErrors = errors.length;
  } catch (e) { res.probeErr = String(e.message || e).slice(0, 200); }
  Object.assign(res, { errors, netNoise: netNoise.length, local404, bytes, imgBytes, offOrigin,
    headBlocking: staticHeadBlocking(rel) });
  res.__page = page; res.__ctx = ctx;
  return res;
}

function grade(r) {
  const fails = [], warns = [];
  if (r.loadErr) fails.push('load: ' + r.loadErr);
  if (r.probeErr) fails.push('probe: ' + r.probeErr);
  if (r.errors.length) fails.push('js errors: ' + r.errors.length);
  if (r.local404.length) fails.push('local 404: ' + r.local404.join(', '));
  if (r.apiKey) fails.push('"API key required" text present');
  if (!r.viewportMeta) fails.push('no viewport meta');
  if (r.textLen !== undefined && r.textLen < 200) fails.push('content did not render (text ' + r.textLen + ')');
  if (r.viewport === 'mobile' && r.overflow) fails.push('horizontal overflow ' + r.scrollWidth + '>' + r.vw);
  if (r.smallBodyN) warns.push('body copy <12px ×' + r.smallBodyN);
  if (r.smallN) warns.push('labels <11px ×' + r.smallN);
  if (r.viewport === 'mobile' && r.tapsN) warns.push('tap targets <40px ×' + r.tapsN);
  if (r.interact) {
    if (r.interact.entries0 === 0) fails.push('engine list empty');
    if (r.interact.filter && r.interact.filter.changed === false) warns.push('no filter chip changed the list');
    if (r.interact.search && !r.interact.search.ok) fails.push('search broken ' + JSON.stringify(r.interact.search));
    if (r.interact.food && r.interact.food.entries === 0) warns.push('food mode empty');
  }
  if (r.map) {
    if (r.hasMap && !r.map.mounted) fails.push('map did not mount with Leaflet available');
    if (r.hasMap && r.map.mounted && !r.map.markers) warns.push('map mounted with 0 markers');
    for (const b of r.map.bases) if (b.hosts.some(h => KEY_TILE_HOSTS.test(h))) fails.push('key-required tile host on base ' + b.base);
  }
  return { status: fails.length ? 'FAIL' : warns.length ? 'WARN' : 'PASS', fails, warns };
}

// Render-blocking resources as authored: <head> stylesheets and sync <script src>.
function staticHeadBlocking(rel) {
  const h = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const head = (h.match(/<head[\s\S]*?<\/head>/i) || [''])[0];
  const out = [];
  for (const m of head.matchAll(/<link\b[^>]*rel=["']?stylesheet[^>]*>/gi)) {
    if (/media=["']?print/.test(m[0])) continue;
    const u = (m[0].match(/href=["']([^"']+)/) || [])[1]; if (u) out.push('css ' + u);
  }
  for (const m of head.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi))
    if (!/\b(async|defer)\b|type=["']?module/.test(m[0])) out.push('js ' + m[1]);
  return out;
}

// ---------- link + anchor check (static, against rendered hrefs) ----------
const idCache = {};
function idsOf(file) {
  if (!(file in idCache)) {
    try { const h = fs.readFileSync(file, 'utf8');
      idCache[file] = new Set([...h.matchAll(/\s(?:id|name)="([^"'+]+)"/g)].map(m => m[1])); }
    catch (e) { idCache[file] = null; }
  }
  return idCache[file];
}
function checkLinks(rel, links, ownIds) {
  const bad = [];
  for (const href of new Set(links)) {
    if (!href || /^(https?:|mailto:|tel:|javascript:|data:|blob:)/i.test(href) || href.includes('${')) continue;
    const [p, hash] = href.split('#');
    const target = p ? path.resolve(path.dirname(path.join(ROOT, rel)), decodeURIComponent(p.split('?')[0])) : path.join(ROOT, rel);
    let file = target;
    try { if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html'); } catch (e) { bad.push(href + ' (missing)'); continue; }
    if (!fs.existsSync(file)) { bad.push(href + ' (missing)'); continue; }
    if (hash && file.endsWith('.html')) {
      const ids = p ? idsOf(file) : new Set(ownIds);
      if (ids && !ids.has(decodeURIComponent(hash))) bad.push(href + ' (no #' + hash + ')');
    }
  }
  return bad;
}

// ---------- main ----------
(async () => {
  const { chromium } = loadPlaywright();
  fs.mkdirSync(path.join(OUT, 'screenshots'), { recursive: true });
  const srv = await serve();
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  let browser;
  try { browser = await chromium.launch(); }
  catch (e) { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const jobs = [];
  for (const p of PAGES) {
    jobs.push([p, 'mobile', 'offline'], [p, 'desktop', 'offline']);
    if (LEAFLET) jobs.push([p, 'desktop', 'leaflet']);
  }
  const results = [];
  let i = 0, done = 0;
  async function worker() {
    while (i < jobs.length) {
      const [p, vp, mode] = jobs[i++];
      const r = await runPage(browser, base, p, vp, mode);
      r.grade = grade(r);
      if (mode === 'offline') r.badLinks = checkLinks(p, r.links || [], r.ids || []);
      if (r.badLinks && r.badLinks.length) { r.grade.fails.push('broken links: ' + r.badLinks.join(', ')); r.grade.status = 'FAIL'; }
      const shoot = mode === 'offline' && SHOTS && (ALL_SHOTS || SAMPLE.includes(p) || r.grade.status === 'FAIL');
      if (shoot) {
        const f = p.replace(/\//g, '__').replace(/\.html$/, '') + '.' + vp + '.jpg';
        await r.__page.screenshot({ path: path.join(OUT, 'screenshots', f), type: 'jpeg', quality: 60, scale: 'css' }).catch(() => {});
        r.screenshot = 'qa/screenshots/' + f;
      }
      await r.__ctx.close(); delete r.__page; delete r.__ctx;
      delete r.links; delete r.ids;
      results.push(r);
      if (++done % 25 === 0) process.stderr.write(`  ${done}/${jobs.length}\n`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  await browser.close(); srv.close();
  results.sort((a, b) => (a.page + a.viewport + a.mode).localeCompare(b.page + b.viewport + b.mode));

  // summary
  const byPage = {};
  for (const r of results) {
    const s = byPage[r.page] = byPage[r.page] || { page: r.page };
    s[r.viewport + (r.mode === 'leaflet' ? '+map' : '')] = r.grade.status;
    if (r.mode === 'offline' && r.viewport === 'desktop') Object.assign(s, { bytes: r.bytes, domNodes: r.domNodes, fcp: r.fcp && Math.round(r.fcp), largestInline: r.largestInline, imgBytes: r.imgBytes });
    if (r.mode === 'leaflet') s.markers = r.map && r.map.markers;
  }
  const rows = Object.values(byPage);
  const med = k => { const v = rows.map(r => r[k]).filter(x => x != null).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
  const summary = {
    generated: new Date().toISOString(), pages: rows.length, loads: results.length,
    counts: results.reduce((a, r) => (a[r.grade.status] = (a[r.grade.status] || 0) + 1, a), {}),
    median: { bytes: med('bytes'), domNodes: med('domNodes'), fcp: med('fcp'), largestInline: med('largestInline') },
    heaviest: [...rows].sort((a, b) => b.bytes - a.bytes).slice(0, 10),
    failing: results.filter(r => r.grade.status === 'FAIL').map(r => ({ page: r.page, viewport: r.viewport, mode: r.mode, fails: r.grade.fails, errors: r.errors, screenshot: r.screenshot })),
    matrix: rows,
  };
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 1));
  console.log(`QA: ${rows.length} pages, ${results.length} loads →`, summary.counts);
  console.log('median', summary.median);
  for (const f of summary.failing) console.log('  FAIL', f.page, f.viewport, f.mode, '—', f.fails.join(' | '));
  process.exit(summary.failing.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
