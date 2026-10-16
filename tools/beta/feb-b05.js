// FE-B probe (B-05 / R7 gap 5): at 390×844, count city links ≥ 80 px tall wholly above the fold on the landing and hubs
// (≥ 2 required). Needs a static server: python3 -m http.server 8765 -d <repo root>. Run from tools/: node beta/feb-b05.js
const { chromium } = require('playwright');
const pages = ['index.html', 'Japan/index.html', 'Belgium/index.html', 'Singapore/index.html', 'Germany/index.html', 'Vietnam/index.html', 'Singapore/singapore-old.html'];
(async () => { const b = await chromium.launch();
 for (const scheme of ['light']) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: scheme });
  await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
  for (const u of pages) { const p = await ctx.newPage(); await p.goto('http://127.0.0.1:8765/beta/' + u, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
   const r = await p.evaluate(() => { const vh = innerHeight, vw = innerWidth;
     const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
     const L = [...document.querySelectorAll('a[href]')].filter(a => vis(a) && /(^|\/)(cities\/[^/]+|[A-Z][a-z]+\/[^/]+|cleveland)\.html/.test(a.getAttribute('href') || '') && a.getBoundingClientRect().height >= 80);
     const above = L.filter(a => { const r = a.getBoundingClientRect(); return r.top + scrollY < vh && r.bottom + scrollY <= vh + 1 && r.left < vw && r.right > 0; });
     const first = L[0] && L[0].getBoundingClientRect();
     return { above: above.length, firstTop: first ? Math.round(first.top) : null, firstH: first ? Math.round(first.height) : null }; });
   console.log(u.padEnd(30), JSON.stringify(r)); await p.close(); }
  await ctx.close(); }
 await b.close(); })();
