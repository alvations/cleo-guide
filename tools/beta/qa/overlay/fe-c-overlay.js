#!/usr/bin/env node
'use strict';
/**
 * FE-C overlay audit (owner directive 2026-10-16, docs/BETA-OVERLAY-LEDGER.md): every fixed / sticky / floating layer on the
 * surfaces FE-C owns or hooks — trip.html (builder + a trip), saved.html, the share-card preview, toasts, the base note,
 * the place sheet (its base fact) — at the ledger's viewports × light/dark. Measures, per state: the top/bottom chrome share
 * (% of the viewport height), layers that collide, toasts still on screen 4 s after they appear, and whether the share
 * preview fits. Prints JSON lines; no pass/fail until OV-00 sets the budgets.
 *   cd tools && NODE_PATH=$(npm root -g) node beta/qa/overlay/fe-c-overlay.js [--out file.json]
 */
const fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..'), BASE = 'https://cleo.local/';
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48OHDfwAJigPgXSGvvwAAAABJRU5ErkJggg==', 'base64');
const VPS = [[390, 844], [390, 664], [844, 390], [768, 1024], [1024, 768], [1440, 900]];
const SAVED = {}; ['senso-ji', 'tokyo-national-museum', 'ueno-park', 'kappabashi-dogu-gai', 'yanaka-cemetery', 'asakusa-shrine', 'national-museum-of-western-art', 'shibuya-scramble-crossing', 'yoyogi-park', 'meiji-jingu', 'hachiko-statue', 'shinjuku-golden-gai', 'isegen', 'kanda-myojin'].forEach((id, i) => { SAVED['tokyo/' + id] = { t: i }; });
const OUT = (process.argv.indexOf('--out') > 0 && process.argv[process.argv.indexOf('--out') + 1]) || null;

const LAYERS = () => {   // every visible fixed/sticky layer, its rect, and the share of the viewport it takes at the top / bottom
  const vh = innerHeight, vw = innerWidth, L = [];
  for (const e of document.querySelectorAll('body *')) {
    const s = getComputedStyle(e); if (s.position !== 'fixed' && s.position !== 'sticky') continue;
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) continue;
    const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw) continue;
    if (e.parentElement && e.parentElement.closest && [...L].some(x => x.el.contains(e))) continue;   // count the outermost layer only
    L.push({ el: e, pos: s.position, id: (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '') || e.tagName,
      top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), h: Math.round(r.height), w: Math.round(r.width) });
  }
  const topBand = L.filter(x => x.top <= 1 && x.h < vh * 0.9).reduce((m, x) => Math.max(m, x.bottom), 0);
  const botBand = L.filter(x => x.bottom >= vh - 1 && x.h < vh * 0.9).reduce((m, x) => Math.max(m, vh - x.top), 0);
  const coll = []; for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i], b = L[j];
    const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (ox > 2 && oy > 2 && !a.el.contains(b.el) && !b.el.contains(a.el)) coll.push(a.id + ' × ' + b.id + ' ' + ox + 'x' + oy); }
  return { vh, topPct: Math.round(topBand / vh * 100), botPct: Math.round(botBand / vh * 100), chromePct: Math.round((topBand + botBand) / vh * 100),
    layers: L.map(({ el, ...x }) => x), collisions: coll };
};

async function open(b, url, { w, h, dark, saved }) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500 || (w < 900 && h < 500), hasTouch: w < 1024, serviceWorkers: 'block', colorScheme: dark ? 'dark' : 'light' });
  await ctx.route('**/*', r => { const u = r.request().url();
    if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u)) return r.fulfill({ status: 200, contentType: 'image/png', body: TILE });
    if (!u.startsWith(BASE)) return r.abort('blockedbyclient');
    const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname));
    if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
    return r.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) }); });
  if (saved) await ctx.addInitScript(s => { try { localStorage.setItem('cleo:v1:saved', s); } catch (e) {} }, JSON.stringify(saved));
  if (dark) await ctx.addInitScript(() => { try { localStorage.setItem('cleo:v1:theme', '"dark"'); } catch (e) {} });
  const page = await ctx.newPage(); await page.goto(BASE + 'beta/' + url, { waitUntil: 'load' }); await page.waitForTimeout(1500);
  return { ctx, page };
}
const scrollMid = p => p.evaluate(async () => { scrollTo(0, Math.max(0, (document.documentElement.scrollHeight - innerHeight) / 2)); await new Promise(r => setTimeout(r, 400)); });

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' }), rows = [];
  const rec = (surface, vp, theme, state, m, extra) => { const r = Object.assign({ surface, vp, theme, state, topPct: m.topPct, botPct: m.botPct, chromePct: m.chromePct, collisions: m.collisions, layers: m.layers.map(x => `${x.id} ${x.pos} ${x.top}-${x.bottom}`) }, extra || {}); rows.push(r); console.log(JSON.stringify(r)); };
  // a trip link, built once
  let link; { const s = await open(b, 'trip.html#from=all', { w: 1440, h: 900, saved: SAVED }); await s.page.click('button[type=submit]').catch(() => {}); await s.page.waitForTimeout(700); link = s.page.url().split('/beta/')[1]; await s.ctx.close(); }
  for (const [w, h] of VPS) for (const dark of [false, true]) {
    const vp = w + 'x' + h, theme = dark ? 'dark' : 'light';
    // trip.html builder
    { const s = await open(b, 'trip.html#from=all', { w, h, dark, saved: SAVED }); rec('trip.html builder', vp, theme, 'load', await s.page.evaluate(LAYERS)); await s.ctx.close(); }
    // trip.html with a trip: load, scrolled, a toast (copy link) 4 s later, the share-card preview
    { const s = await open(b, link, { w, h, dark });
      rec('trip.html trip', vp, theme, 'load', await s.page.evaluate(LAYERS)); await scrollMid(s.page); rec('trip.html trip', vp, theme, 'scrolled', await s.page.evaluate(LAYERS));
      await s.page.evaluate(() => Cleo.emit && Cleo.emit('cleo:toast', 'Link copied')); await s.page.waitForTimeout(300);
      const t0 = await s.page.evaluate(() => [...document.querySelectorAll('.toast')].length); await s.page.waitForTimeout(4000);
      rec('trip.html toast', vp, theme, 'after 4 s', await s.page.evaluate(LAYERS), { toastShown: t0, toastStill: await s.page.evaluate(() => [...document.querySelectorAll('.toast')].filter(e => e.getBoundingClientRect().height > 0).length) });
      const card = s.page.locator('[data-cleo-card="trip"]').filter({ visible: true }).first();
      if (await card.count()) { await card.click(); await s.page.waitForSelector('#cleo-card-dlg img', { timeout: 10000 }).catch(() => {}); await s.page.waitForTimeout(400);
        const dlg = await s.page.evaluate(() => { const d = document.getElementById('cleo-card-dlg'); if (!d) return null; const r = d.getBoundingClientRect(), im = d.querySelector('img'), ir = im && im.getBoundingClientRect();
          const btns = [...d.querySelectorAll('button')].map(x => { const q = x.getBoundingClientRect(); return { t: x.textContent.trim().slice(0, 20), inView: q.top >= 0 && q.bottom <= innerHeight }; });
          return { dlgPct: Math.round(r.height / innerHeight * 100), fits: r.top >= 0 && r.bottom <= innerHeight + 1, inner: d.scrollHeight > d.clientHeight + 2, imgH: ir && Math.round(ir.height), imgVisible: ir && ir.top >= 0 && ir.bottom <= innerHeight, buttons: btns }; });
        rec('share-card preview (trip)', vp, theme, 'open', await s.page.evaluate(LAYERS), { dialog: dlg }); }
      await s.ctx.close(); }
    // saved.html
    { const s = await open(b, 'saved.html', { w, h, dark, saved: SAVED }); rec('saved.html', vp, theme, 'load', await s.page.evaluate(LAYERS)); await scrollMid(s.page); rec('saved.html', vp, theme, 'scrolled', await s.page.evaluate(LAYERS)); await s.ctx.close(); }
    // the base: the note + the set toast + the place sheet (FE-A's sheet; FE-C's base fact) in Gallery and Atlas
    for (const v of ['gallery', 'atlas']) {
      const s = await open(b, 'cities/tokyo.html#view=' + v + '&p=senso-ji', { w, h, dark });
      const sh = await s.page.evaluate(() => { const e = document.querySelector('#cleo-sheet .sheet'); if (!e) return null; const r = e.getBoundingClientRect();
        const pin = window.Cleo.city && Cleo.city.pinOf && Cleo.city.pinOf('senso-ji'), pr = pin && pin.getBoundingClientRect && pin.getBoundingClientRect();
        return { sheetPct: Math.round(Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) * 100 / innerHeight | 0, sheetTop: Math.round(r.top), pinCovered: pr ? (pr.bottom > r.top && pr.top < r.bottom && pr.right > r.left && pr.left < r.right) : null }; });
      const set = s.page.locator('[data-cleo-base="set"]').filter({ visible: true }).first(); let toast = null;
      if (await set.count()) { await set.click(); await s.page.waitForTimeout(300); const t0 = await s.page.evaluate(() => document.querySelectorAll('.toast').length); await s.page.waitForTimeout(4000);
        toast = { shown: t0, still: await s.page.evaluate(() => [...document.querySelectorAll('.toast')].filter(e => e.getBoundingClientRect().height > 0).length) }; }
      rec('tokyo place sheet (' + v + ')', vp, theme, 'open + set base', await s.page.evaluate(LAYERS), { sheet: sh, baseToast: toast });
      await s.page.keyboard.press('Escape'); await s.page.waitForTimeout(500);
      rec('tokyo base note (' + v + ')', vp, theme, 'sheet closed', await s.page.evaluate(LAYERS), { note: await s.page.evaluate(() => { const n = document.getElementById('cleo-basenote'); if (!n) return null; const s = getComputedStyle(n), r = n.getBoundingClientRect(); return { pos: s.position, h: Math.round(r.height), visible: r.height > 0 }; }) });
      await s.ctx.close();
    }
  }
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(rows, null, 1));
  await b.close();
})();
