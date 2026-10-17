#!/usr/bin/env node
'use strict';
/**
 * R8 gap #5a: the place sheet's primary link ("Read what <source> says" / "Visit the official site") reads ≥ 4.5:1 in
 * light and dark, and axe's color-contrast finds 0 serious nodes in the sheet. Real Chromium over the 84 place pages: up
 * to 2 sheets with the button per page and 25 on Ho Chi Minh City (where R8 found 20), both themes.
 *   cd tools && node beta/qa/sheet-contrast.js         (npm test: Tokyo, Ho Chi Minh City, Hanoi, Cleveland; Playwright local or global, else SKIP)
 *   cd tools && node beta/qa/sheet-contrast.js --all   (npm run beta:qa:sheet-contrast: all 84 place pages, ≈ 5 min)
 */
const fs = require('fs'), path = require('path');
let pw = null; try { pw = require('playwright'); } catch (e) { try { pw = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright')); } catch (e2) {} }
if (!pw) { console.log('  SKIP  sheet contrast (no playwright here)'); process.exit(0); }
const ROOT = path.resolve(__dirname, '..', '..', '..'), BETA = path.join(ROOT, 'beta'), BASE = 'https://cleo.local/';
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const AXE = fs.readFileSync(path.join(__dirname, 'vendor', 'axe.min.js'), 'utf8');
const ONLY = process.env.ONLY || '', ALLP = process.argv.includes('--all');
const QUICK = ['cities/tokyo.html', 'Vietnam/ho-chi-minh-city.html', 'Vietnam/hanoi.html', 'cleveland.html'];   // npm test; --all = the 84 pages (≈ 5 min)
const pages = fs.readdirSync(path.join(BETA, 'data/places')).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8'))).map(j => ({ rel: j.beta, ids: j.places.map(p => p.id) })).filter(p => ONLY ? p.rel === ONLY : ALLP || QUICK.includes(p.rel));   // ONLY=<page>: one page (sanity runs)
const ALL = 'Vietnam/ho-chi-minh-city.html';
(async () => {
  const b = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' }), bad = []; let n = 0, axeRuns = 0, axeSerious = 0;
  for (const dark of [false, true]) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block', colorScheme: dark ? 'dark' : 'light' });
    await ctx.route('**/*', r => { const u = r.request().url(); if (!u.startsWith(BASE)) return r.abort('blockedbyclient');
      if (/\.(jpe?g|webp|png)(\?|$)/.test(u)) return r.fulfill({ status: 404, body: '' });
      const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
      return r.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) }); });
    if (dark) await ctx.addInitScript(() => { try { localStorage.setItem('cleo:v1:theme', '"dark"'); } catch (e) {} });
    const page = await ctx.newPage();
    for (const pg of pages) {
      await page.goto(BASE + 'beta/' + pg.rel, { waitUntil: 'load' }); await page.waitForTimeout(250);
      const want = pg.rel === ALL ? 25 : 2; let got = 0;
      for (const id of pg.ids) {
        if (got >= want) break;
        await page.evaluate(id => { location.hash = '#p=' + encodeURIComponent(id); }, id); await page.waitForTimeout(120);
        const r = await page.evaluate(() => {
          const a = document.querySelector('#cleo-sheet .primary-link'); if (!a || a.hidden || !a.getClientRects().length) return null;
          const rgb = s => (s.match(/[\d.]+/g) || []).map(Number), lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
          const bg = rgb(getComputedStyle(a).backgroundColor); let worst = 99, at = '';
          const tw = document.createTreeWalker(a, NodeFilter.SHOW_TEXT); let t;
          while ((t = tw.nextNode())) { if (!t.data.trim()) continue; const fg = rgb(getComputedStyle(t.parentElement).color), L1 = lum(fg), L2 = lum(bg), cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
            if (cr < worst) { worst = cr; at = t.data.trim().slice(0, 30) + ' ' + getComputedStyle(t.parentElement).color + ' on ' + getComputedStyle(a).backgroundColor; } }
          return { text: a.textContent.trim().slice(0, 40), cr: +worst.toFixed(2), at };
        });
        if (!r) continue; got++; n++;
        if (r.cr < 4.5) bad.push([pg.rel, id, dark ? 'dark' : 'light', r.cr, r.at]);
        if (got === 1) {   // axe on the first sheet with the button, per page and theme
          await page.waitForFunction(() => document.getAnimations().every(a => a.playState !== 'running'), null, { timeout: 3000 }).catch(() => {});   // the sheet has settled
          if (!(await page.evaluate(() => !!window.axe))) await page.addScriptTag({ content: AXE });
          const v = await page.evaluate(async () => (await axe.run('#cleo-sheet', { runOnly: { type: 'rule', values: ['color-contrast'] }, resultTypes: ['violations'] })).violations.filter(x => x.impact === 'serious' || x.impact === 'critical').reduce((s, x) => s + x.nodes.length, 0));
          axeRuns++; axeSerious += v; if (v) bad.push([pg.rel, id, dark ? 'dark' : 'light', 'axe serious color-contrast nodes: ' + v]);
        }
      }
    }
    await ctx.close();
  }
  console.log(`  ${n} sheets with the primary link (${pages.length} pages × ≤ 2, 25 on Ho Chi Minh City), light + dark; axe color-contrast on ${axeRuns} sheets: ${axeSerious} serious nodes`);
  bad.slice(0, 20).forEach(x => console.log('  FAIL  ' + x.join(' | ')));
  console.log(bad.length ? '>>> FAIL — sheet primary-link contrast' : '>>> PASS — sheet primary-link contrast ≥ 4.5:1, axe 0 serious');
  await b.close(); process.exit(bad.length ? 1 : 0);
})();
