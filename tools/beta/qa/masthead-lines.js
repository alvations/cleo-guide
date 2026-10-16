#!/usr/bin/env node
'use strict';
/**
 * R8 gap #2c (ROUND-8): at 390 px no line of the city masthead's stat line (.facts), dek or lead line (.dek, .g-lead, the Atlas intro's .at-dek) starts with "·", and
 * "last checked <date>" never breaks inside. Real Chromium, every place page (84), line boxes read from the rendered text.
 *   cd tools && node beta/qa/masthead-lines.js [--w 390]     (in npm test; Playwright local or global, else SKIP)
 */
const fs = require('fs'), path = require('path');
let pw = null; try { pw = require('playwright'); } catch (e) { try { pw = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright')); } catch (e2) {} }
if (!pw) { console.log('  SKIP  masthead lines (no playwright here)'); process.exit(0); }
const { chromium } = pw;
const ROOT = path.resolve(__dirname, '..', '..', '..'), BETA = path.join(ROOT, 'beta'), BASE = 'https://cleo.local/';
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const W = +((process.argv.indexOf('--w') > 0 && process.argv[process.argv.indexOf('--w') + 1]) || 390);
const pages = fs.readdirSync(path.join(BETA, 'data/places')).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8')).beta);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: W, height: 844 }, isMobile: W < 500, hasTouch: W < 500, serviceWorkers: 'block' });
  await ctx.route('**/*', r => { const u = r.request().url(); if (!u.startsWith(BASE)) return r.abort('blockedbyclient');
    if (/\.(jpe?g|webp|png)(\?|$)/.test(u)) return r.fulfill({ status: 404, body: '' });
    const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
    return r.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) }); });
  const page = await ctx.newPage(), bad = []; let n = 0;
  for (const rel of pages) {
    await page.goto(BASE + 'beta/' + rel, { waitUntil: 'load' }); await page.waitForTimeout(150); n++;
    const r = await page.evaluate(() => {
      const lines = el => {   // the rendered lines of el's visible text: [{text}], by line-box top
        const out = [], tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
        while ((n = tw.nextNode())) { const pe = n.parentElement; if (!pe || !pe.getClientRects().length || getComputedStyle(pe).display === 'none') continue;
          for (let i = 0; i < n.data.length; i++) { const rg = document.createRange(); rg.setStart(n, i); rg.setEnd(n, i + 1); const q = rg.getClientRects()[0]; if (!q || !q.width) continue;
            const top = Math.round(q.top); let L = out.find(x => Math.abs(x.top - top) < 4); if (!L) { L = { top, text: '' }; out.push(L); } L.text += n.data[i]; } }
        return out.sort((a, b) => a.top - b.top).map(x => x.text.replace(/\s+/g, ' ').trim()).filter(Boolean);
      };
      const res = {};
      for (const [k, sel] of [['facts', '.masthead .facts'], ['dek', '.masthead .dek'], ['lead', '.masthead .g-lead'], ['at-dek', '.at-intro .at-dek']]) { const el = document.querySelector(sel); if (el && el.getClientRects().length) res[k] = lines(el); }
      return res;
    });
    for (const k of Object.keys(r)) {
      const L = r[k];
      L.forEach((t, i) => { if (i > 0 && /^[·•]/.test(t)) bad.push([rel, k, 'line starts with "·"', t.slice(0, 40)]); });
      if (k === 'facts') L.forEach((t, i) => { if (i + 1 < L.length && /last\s*$|last checked\s*$/i.test(t) && /^(checked|\d{4}-)/i.test(L[i + 1])) bad.push([rel, k, '"last checked <date>" breaks', t.slice(-20) + ' / ' + L[i + 1].slice(0, 20)]); });
    }
  }
  console.log(`${n} pages at ${W} px: ${bad.length} masthead line faults`);
  bad.slice(0, 30).forEach(x => console.log('  ' + x.join(' | ')));
  console.log(bad.length ? '>>> FAIL — masthead lines' : '>>> PASS — masthead lines');
  await b.close(); process.exit(bad.length ? 1 : 0);
})();
