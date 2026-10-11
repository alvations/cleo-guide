#!/usr/bin/env node
'use strict';
// W7 designer helper: print the rendered DOM outline (tag.class, depth-limited) of a beta page after its JS runs.
//   NODE_PATH=$(npm root -g) node design/beta/style/v2/tools/dom.js <beta url path> [selector] [depth] [m|d]
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const [u, sel = 'body', depth = '6', sz = 'd'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext(sz === 'm' ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } });
  await ctx.route('**/*', r => { const x = new URL(r.request().url()); if (x.host !== 'cleo.local') return r.abort();
    let p = path.join(ROOT, decodeURIComponent(x.pathname)); if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
    if (!fs.existsSync(p)) return r.fulfill({ status: 404, body: '' });
    const t = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' }[path.extname(p)];
    return r.fulfill({ status: 200, contentType: t || 'application/octet-stream', body: fs.readFileSync(p) }); });
  const pg = await ctx.newPage(); await pg.goto('https://cleo.local/' + u); await pg.waitForTimeout(1000);
  const out = await pg.evaluate(([sel, depth]) => { const lines = []; const seen = new Map();
    const walk = (el, d, pre) => { if (d > depth) return; const kids = [...el.children].filter(k => !['SCRIPT', 'STYLE', 'svg', 'path', 'symbol', 'use', 'circle', 'rect', 'line', 'g', 'polyline'].includes(k.tagName));
      const sig = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '');
      const key = pre + '>' + sig; const n = (seen.get(key) || 0) + 1; seen.set(key, n); if (n > 2) return;
      const t = [...el.childNodes].filter(c => c.nodeType === 3).map(c => c.textContent.trim()).join(' ').slice(0, 40);
      lines.push('  '.repeat(d) + sig + (t ? '  "' + t + '"' : '') + (n === 2 ? '  …' : '')); if (n === 2) return; kids.forEach(k => walk(k, d + 1, key)); };
    document.querySelectorAll(sel).forEach(e => walk(e, 0, '')); return lines.join('\n'); }, [sel, +depth]);
  console.log(out); await b.close(); })();
