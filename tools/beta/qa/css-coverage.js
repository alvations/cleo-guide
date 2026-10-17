#!/usr/bin/env node
/* css-coverage.js (platform, R8 gap #6) — which CSS rules any page actually uses. Chromium CSS coverage, unioned per
 * stylesheet over every page type × view × 390 / 1440, light and dark, with the main interactions exercised (open a place,
 * the filter tray, the map, the Layers popover when present, Show all). A rule that never applies anywhere here is a
 * CANDIDATE for removal, not proof: states this run never reaches (print, errors, offline, a locale) can still need it, so
 * each cut is the stylesheet owner's call (designer: cleo.css, constellation.css; FE-A: fe-a.css; FE-B: fe-b.css).
 * Usage: node beta/qa/css-coverage.js [--out <json>]. Prints per-file used / unused bytes and the largest unused blocks. */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), OUT = (i => i > 0 ? process.argv[i + 1] : null)(process.argv.indexOf('--out'));
const load = () => { for (const p of [process.env.NODE_PATH, '/opt/node22/lib/node_modules', path.join(ROOT, 'tools/node_modules')]) { try { return require(require.resolve('playwright', { paths: [p].filter(Boolean) })); } catch (e) { /* next */ } } return require('playwright'); };
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png' };
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const PAGES = ['index.html', 'Japan/index.html', 'Singapore/index.html', 'saved.html', 'trip.html', 'cleveland.html', 'cities/newyork.html', 'Singapore/chinatown.html',
  ...['gallery', 'atlas', 'guidebook', 'insights'].map(v => 'cities/tokyo.html#view=' + v)];
(async () => {
  const { chromium } = load();
  const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) {} fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const origin = `http://127.0.0.1:${srv.address().port}`;
  let b; try { b = await chromium.launch(); } catch (e) { b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const files = {};   // url → { text, used: Uint8Array }
  const act = async (p, sel, wait = 400) => { try { const l = p.locator(sel).first(); if (await l.count() && await l.isVisible()) { await l.click({ timeout: 2000 }); await p.waitForTimeout(wait); return true; } } catch (e) { /* not on this page */ } return false; };
  // --all: also every generated page once (1440, light, no interactions), so a rule keyed to one city or page (a masthead,
  // a hub tile) counts as used where that page uses it
  const ALL = process.argv.includes('--all') ? JSON.parse(fs.readFileSync(path.join(ROOT, 'beta/data/manifest.json'), 'utf8')).generated.filter(x => /\.html$/.test(x)) : [];
  const RUNS = [];
  for (const u of PAGES) for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) for (const scheme of ['light', 'dark']) RUNS.push([u, vp, scheme, true]);
  for (const u of ALL) RUNS.push([u, { width: 1440, height: 900 }, 'light', false]);
  for (const [u, vp, scheme, deep] of RUNS) {
    const ctx = await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block', reducedMotion: 'reduce' });
    await ctx.route('**/*', r => r.request().url().startsWith(origin) ? r.continue() : r.request().resourceType() === 'image' ? r.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }) : r.abort());
    const p = await ctx.newPage(); await p.coverage.startCSSCoverage({ resetOnNavigation: false });
    await p.goto(origin + '/beta/' + u, { waitUntil: 'load' }).catch(() => {}); await p.waitForTimeout(1200);
    if (deep) await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 800) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } scrollTo(0, 0); }).catch(() => {});
    if (deep && /cities\/|cleveland|Singapore\/chinatown/.test(u)) {
      if (await act(p, 'li.pl .pl-n a, li.gc .gc-a', 700)) { await p.keyboard.press('Escape'); await p.waitForTimeout(300); }
      if (await act(p, '[data-cleo-tray]')) { await p.keyboard.press('Escape'); await p.waitForTimeout(300); }
      await act(p, '.rail-i', 500); await p.evaluate(() => { location.hash = ''; }).catch(() => {}); await p.waitForTimeout(400);
      await act(p, '.g-pager [data-pg="all"]', 600);
      if (vp.width < 600 && await act(p, '[data-cleo-map]', 900)) await act(p, '[data-cleo-map]', 400);
      await act(p, '.m-layers-btn, [data-layers]', 400);
    }
    for (const e of await p.coverage.stopCSSCoverage()) {
      if (!e.url.startsWith(origin) || !e.text) continue; const k = e.url.split('?')[0].slice(origin.length);
      const f = files[k] = files[k] || { text: e.text, used: new Uint8Array(e.text.length) };
      if (f.text.length !== e.text.length) continue;
      for (const r of e.ranges) f.used.fill(1, r.start, r.end);
    }
    await ctx.close();
  }
  await b.close(); srv.close();
  const out = [];
  console.log('== CSS coverage: unioned over ' + PAGES.length + ' page/views × 390, 1440 × light, dark, interactions' + (ALL.length ? ' + all ' + ALL.length + ' pages at 1440' : '') + ' (candidates, owners decide) ==');
  for (const [k, f] of Object.entries(files).filter(([k]) => /\.css$/.test(k)).sort((x, y) => y[1].text.length - x[1].text.length)) {
    const n = f.text.length, used = f.used.reduce((a, x) => a + x, 0);
    // unused blocks: maximal unused runs, labelled by the selector text they start with
    const blocks = []; let i = 0;
    while (i < n) { if (f.used[i]) { i++; continue; } let j = i; while (j < n && !f.used[j]) j++; const t = f.text.slice(i, j).trim(); if (t.length > 40) blocks.push({ bytes: j - i, at: i, start: t.slice(0, 90).replace(/\s+/g, ' ') }); i = j; }
    blocks.sort((x, y) => y.bytes - x.bytes);
    out.push({ file: k, bytes: n, used, unused: n - used, top: blocks.slice(0, 25) });
    console.log(`  ${k.padEnd(34)} ${(n / 1024).toFixed(1).padStart(6)} KB · used ${(used / 1024).toFixed(1).padStart(6)} KB · never applied ${((n - used) / 1024).toFixed(1).padStart(6)} KB (${Math.round(100 * (n - used) / n)} %)`);
    blocks.slice(0, 6).forEach(x => console.log(`        ${String(x.bytes).padStart(6)} B  ${x.start}`));
  }
  const tot = out.reduce((a, x) => a + x.bytes, 0), un = out.reduce((a, x) => a + x.unused, 0);
  console.log(`  total ${(tot / 1024).toFixed(1)} KB · never applied here ${(un / 1024).toFixed(1)} KB`);
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
})();
