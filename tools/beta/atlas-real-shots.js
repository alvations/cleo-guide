#!/usr/bin/env node
'use strict';
/**
 * tools/beta/atlas-real-shots.js — the Atlas review panel's evidence pack with the REAL basemap (design/beta/atlas/PANEL.md §6).
 *
 *   node tools/beta/atlas-real-shots.js --out design/beta/atlas/real/R0 [--only tokyo]
 *
 * Runs on a GitHub runner (.github/workflows/beta-atlas-real-shots.yml), which can reach the no-key tile hosts the beta
 * uses. Same-origin files are served from the checkout; requests to tile.openstreetmap.org and server.arcgisonline.com
 * pass through to the network; everything else off-origin is aborted (the page must need no CDN). In the authoring
 * sandbox the tile hosts are unreachable, so local runs show grey tiles — expected.
 *
 * Per page (Tokyo, Cleveland, Chinatown, New York) × viewport (1440×900, 390×844) × theme (light, dark), ONE browser
 * context walks the states (tiles are reused, so the tile count stays modest):
 *   1 default view · 2 zoomed in two levels on the densest area · 3 a pin selected (desktop preview / phone carousel card)
 *   4 the list after a pan (desktop: live; phone: "Search this area") · 5 phone list mode · 6 a #p= detail · 7 back to the map
 * plus one tiles-blocked shot per page and viewport (light). Writes index.html, a contact sheet, next to the shots.
 */
const fs = require('fs');
const path = require('path');

const pw = (() => {   // the workflow installs playwright into tools/node_modules; fall back to a global install
  for (const t of [path.join(__dirname, '..', 'node_modules', 'playwright'), 'playwright']) { try { return require(t); } catch (e) { /* next */ } }
  throw new Error('playwright not found (npm install --no-save playwright in tools/)');
})();

const ROOT = path.resolve(__dirname, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/atlas/real/manual'));
const ONLY = arg('--only', '');
const BASE = 'https://cleo.local/';
const TILE_HOSTS = /^(tile\.openstreetmap\.org|[abc]\.tile\.openstreetmap\.org|server\.arcgisonline\.com|services\.arcgisonline\.com)$/;
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
const VPS = [['1440', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }], ['390', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]];
const PAGES = [['tokyo', 'beta/cities/tokyo.html'], ['cleveland', 'beta/cleveland.html'], ['chinatown', 'beta/Singapore/chinatown.html'], ['newyork', 'beta/cities/newyork.html']].filter(p => !ONLY || p[0] === ONLY);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const vis = (page, sel) => page.locator(sel).first().isVisible().catch(() => false);

async function context(browser, vp, o) {
  const ctx = await browser.newContext(Object.assign({ colorScheme: o.dark ? 'dark' : 'light', reducedMotion: 'reduce', serviceWorkers: 'block' }, vp));
  ctx.stats = { tiles: 0, tileFail: 0, aborted: 0 };
  await ctx.route('**/*', route => {
    const u = new URL(route.request().url());
    if (TILE_HOSTS.test(u.host)) { if (o.blockTiles) return route.abort(); ctx.stats.tiles++; return route.continue(); }
    if (u.origin + '/' !== BASE) { ctx.stats.aborted++; return route.abort(); }
    const p = path.join(ROOT, decodeURIComponent(u.pathname));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return route.fulfill({ status: 404, body: 'not found' });
    return route.fulfill({ body: fs.readFileSync(p), headers: { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' } });
  });
  ctx.on('requestfailed', r => { if (TILE_HOSTS.test(new URL(r.url()).host)) ctx.stats.tileFail++; });
  return ctx;
}
// tiles settle: every tile image in the map has finished (or failed), then a short pause; capped so a slow host can't hang
const settle = async (page, ms = 700) => {
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.waitForFunction(() => [...document.querySelectorAll('#cleo-map img.leaflet-tile')].every(t => t.complete), null, { timeout: 8000 }).catch(() => {});
  await sleep(ms);
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await pw.chromium.launch();
  const shots = [], log = [];
  const shot = async (page, name, caption, meta) => { const f = name + '.jpg'; await page.screenshot({ path: path.join(OUT, f), type: 'jpeg', quality: 72 }); shots.push({ f, caption, meta }); };
  for (const [key, url] of PAGES) {
    for (const [vk, vp] of VPS) {
      const phone = vk === '390';
      for (const dark of [false, true]) {
        const th = dark ? 'dark' : 'light', id = `${key}-${vk}-${th}`;
        const ctx = await context(browser, vp, { dark }), page = await ctx.newPage(), errors = [];
        page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
        try {
          await page.goto(BASE + url + '#view=atlas', { waitUntil: 'load' });
          await page.waitForFunction(() => document.querySelector('.leaflet-marker-icon') || document.documentElement.classList.contains('ms-nomap'), null, { timeout: 10000 }).catch(() => {});
          await settle(page, 1200);
          await shot(page, `${id}-1-default`, `${key} ${vk} ${th} · default view`);
          // 2: zoom two levels in on the densest area (the pinned place with the most neighbours within ~1 km)
          const z = await page.evaluate(() => {
            const m = Cleo.city.map(); if (!m) return null;
            const ll = Object.values(Cleo.city.markers).map(k => k.getLatLng()); let best = ll[0], bn = -1;
            ll.forEach(a => { const n = ll.filter(b => Math.abs(a.lat - b.lat) < 0.009 && Math.abs(a.lng - b.lng) < 0.011).length; if (n > bn) { bn = n; best = a; } });
            m.setView(best, m.getZoom() + 2, { animate: false }); return { z: m.getZoom(), n: bn };
          });
          await settle(page);
          await shot(page, `${id}-2-zoomed`, `${key} ${vk} ${th} · zoomed in on the densest area`, z);
          // 3: select a pin near the middle of the uncovered map (desktop: preview card; phone: its carousel card)
          const pin = await page.evaluate(ph => {
            const els = [...document.querySelectorAll('.leaflet-marker-icon.pp')].map(e => [e, (e.firstElementChild || e).getBoundingClientRect()])
              .filter(([e, r]) => r.width && r.left > 40 && r.right < innerWidth - 80 && r.top > (ph ? 200 : 260) && r.bottom < innerHeight - (ph ? 260 : 120));
            if (!els.length) return null; const cx = innerWidth * (ph ? 0.5 : 0.3), cy = innerHeight * 0.5;
            els.sort((a, b) => Math.hypot(a[1].left - cx, a[1].top - cy) - Math.hypot(b[1].left - cx, b[1].top - cy));
            const r = els[0][1]; return { x: r.left + r.width / 2, y: r.top + r.height / 2, label: els[0][0].textContent };
          }, phone);
          if (pin) { if (phone) await page.touchscreen.tap(pin.x, pin.y); else await page.mouse.click(pin.x, pin.y); await settle(page, 600); }
          await shot(page, `${id}-3-pin`, `${key} ${vk} ${th} · pin selected (${phone ? 'carousel card' : 'preview card'})`, pin);
          // 4: the list after a pan
          await page.evaluate(() => { const p = document.getElementById('cleo-poi'); if (p && !p.hidden && Cleo.city.closePoi) Cleo.city.closePoi(); });
          await page.evaluate(ph => { const m = Cleo.city.map && Cleo.city.map(); if (!m) return; if (ph) m.fire('dragstart'); const s = m.getSize(); m.panBy([s.x * 0.35, s.y * 0.2], { animate: false }); if (ph) m.fire('dragend'); }, phone);
          await settle(page, 500);
          if (phone && await vis(page, '.ms-here')) { await page.click('.ms-here', { timeout: 3000 }).catch(() => {}); await settle(page, 500); }
          await shot(page, `${id}-4-pan`, `${key} ${vk} ${th} · the list after a pan${phone ? ' (Search this area)' : ''}`, await page.evaluate(() => (document.querySelector('.ms-count') || {}).textContent || ''));
          // 5: phone list mode
          if (phone && await vis(page, '.ms-toggle')) { await page.click('.ms-toggle', { timeout: 3000 }); await settle(page, 500); await shot(page, `${id}-5-list`, `${key} ${vk} ${th} · list mode`); await page.click('.ms-toggle', { timeout: 3000 }).catch(() => {}); await settle(page, 400); }
          else if (phone) await shot(page, `${id}-5-list`, `${key} ${vk} ${th} · list (the map is unavailable, so the list is the screen)`);
          // 6–7: a #p= detail and back to the map
          const pid = await page.evaluate(() => { const c = [...document.querySelectorAll('li.pl[data-ll]')].find(x => x.offsetParent); return c ? c.id.slice(2) : null; });
          if (pid) {
            await page.evaluate(p => { location.hash = '#view=atlas&p=' + p; }, pid); await settle(page, 900);
            await shot(page, `${id}-6-detail`, `${key} ${vk} ${th} · #p= detail`, pid);
            await page.goBack().catch(() => {}); await settle(page, 700);
            await shot(page, `${id}-7-back`, `${key} ${vk} ${th} · back to the map after the detail`);
          }
        } catch (e) { errors.push('probe: ' + String(e).slice(0, 160)); }
        log.push({ id, tiles: ctx.stats.tiles, tileFail: ctx.stats.tileFail, offOriginAborted: ctx.stats.aborted, pageErrors: errors });
        await ctx.close();
      }
      // one tiles-blocked shot per page and viewport (light): the list must hold every place
      const ctx = await context(browser, vp, { blockTiles: true }), page = await ctx.newPage(), errors = [];
      page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
      await page.goto(BASE + url + '#view=atlas', { waitUntil: 'load' }); await sleep(3000);
      await shot(page, `${key}-${vk}-light-8-tiles-blocked`, `${key} ${vk} light · tiles blocked`);
      log.push({ id: `${key}-${vk}-tiles-blocked`, pageErrors: errors });
      await ctx.close();
    }
  }
  await browser.close();
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const tiles = log.reduce((t, x) => t + (x.tiles || 0), 0), fails = log.reduce((t, x) => t + (x.tileFail || 0), 0), errs = log.filter(x => x.pageErrors && x.pageErrors.length);
  const groups = {}; shots.forEach(s => { const g = s.f.split('-').slice(0, 3).join(' '); (groups[g] = groups[g] || []).push(s); });
  fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Atlas real-tile shots</title>
<style>:root{color-scheme:light dark}body{margin:0;padding:16px;font:15px/1.45 system-ui,sans-serif;background:#F9F7F3;color:#1C1917}@media (prefers-color-scheme:dark){body{background:#131110;color:#F2EEEA}}
h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:28px 0 8px}p{margin:0 0 8px}.g{display:flex;flex-wrap:wrap;gap:12px}figure{margin:0;width:min(100%,360px)}figure img{display:block;width:100%;height:auto;border:1px solid #CCC5BC;border-radius:8px}figcaption{font-size:13px;margin-top:4px}</style></head><body>
<h1>Atlas with the real basemap — ${esc(path.basename(OUT))}</h1>
<p>${shots.length} shots · ${tiles} tile requests passed through (${fails} failed) · ${errs.length ? errs.length + ' context(s) with page errors' : '0 page errors'} · generated ${new Date().toISOString()}</p>
${Object.entries(groups).map(([g, l]) => `<h2>${esc(g)}</h2><div class="g">${l.map(s => `<figure><a href="${esc(s.f)}"><img src="${esc(s.f)}" alt="${esc(s.caption)}" loading="lazy"></a><figcaption>${esc(s.caption)}</figcaption></figure>`).join('')}</div>`).join('\n')}
</body></html>
`);
  fs.writeFileSync(path.join(OUT, 'log.json'), JSON.stringify({ shots: shots.map(s => ({ file: s.f, caption: s.caption, meta: s.meta })), contexts: log }, null, 1) + '\n');
  console.log(`>>> ${shots.length} shots → ${path.relative(ROOT, OUT)} (tiles passed ${tiles}, failed ${fails}; page errors in ${errs.length} context(s))`);
})();
