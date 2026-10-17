#!/usr/bin/env node
'use strict';
/**
 * One search entry point per page (DESIGN-SYSTEM §v2.12 3a, QC round 4 Med; FE-C). Every page that is not a place page —
 * landing, hubs, trip, saved, the method pages and "What changed" (one shell: QC's three samples) — at 768, 1024 and 1440 px: QC's own S-17
 * measure (qc-overlay.js MEASURE: a field and its own submit are one control) finds at most one search on screen, at the
 * top and again scrolled to the end (where the footer shows on a short page).
 *   cd tools && node beta/qa/one-search.js      (in npm test; Playwright local or global, else SKIP)
 */
const fs = require('fs'), path = require('path');
let pw = null; try { pw = require('playwright'); } catch (e) { try { pw = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright')); } catch (e2) {} }
if (!pw) { console.log('  SKIP  one search per page (no playwright here)'); process.exit(0); }
const { MEASURE } = require('./qc-overlay');
const ROOT = path.resolve(__dirname, '..', '..', '..'), BETA = path.join(ROOT, 'beta'), BASE = 'https://cleo.local/';
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const place = new Set(fs.readdirSync(path.join(BETA, 'data/places')).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8')).beta));
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (e.name === 'assets' || e.name === 'data' ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
const pages = walk(BETA).filter(f => f.endsWith('.html')).map(f => path.relative(BETA, f).split(path.sep).join('/')).filter(p => !place.has(p))
  .filter(p => !/^changes\//.test(p) || /^changes\/(tokyo|cleveland|singapore--punggol)\.html$/.test(p)).sort();   // What changed: one shell, QC's three samples
(async () => {
  const b = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  const bad = []; let n = 0;
  for (const w of [768, 1024, 1440]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w === 768 ? 1024 : w === 1024 ? 768 : 900 }, serviceWorkers: 'block' });
    await ctx.route('**/*', r => { const u = r.request().url(); if (!u.startsWith(BASE)) return r.abort('blockedbyclient');
      if (/\.(jpe?g|webp|png)(\?|$)/.test(u)) return r.fulfill({ status: 404, body: '' });
      const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
      return r.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) }); });
    const page = await ctx.newPage();
    for (const rel of pages) {
      await page.goto(BASE + 'beta/' + rel, { waitUntil: 'load' }); await page.waitForTimeout(200); n++;
      for (const at of ['top', 'end']) {
        if (at === 'end') { await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await page.waitForTimeout(150); }
        const m = await page.evaluate(MEASURE).catch(e => ({ duplicates: ['error ' + e.message.slice(0, 60)] }));
        const s = (m.duplicates || []).filter(x => /^search ×|^error/.test(x));
        if (s.length) bad.push([rel, w, at, s[0]]);
      }
    }
    await ctx.close();
  }
  await b.close();
  const ok = bad.length === 0;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${pages.length} non-place pages × 768 / 1024 / 1440 (${n} loads), top and end: one search entry point on screen${ok ? '' : ' = ' + JSON.stringify([...new Set(bad.map(x => x[0]))]) + ' ' + JSON.stringify(bad[0])}`);
  process.exit(ok ? 0 : 1);
})();
