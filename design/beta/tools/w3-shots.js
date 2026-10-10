#!/usr/bin/env node
// W3 designer shots: serve the repo from disk, abort every off-origin request (no-CDN view), shoot at 390×844 (m, DPR2,
// touch) and 1440×900 (d). Usage: NODE_PATH=$(npm root -g) node design/beta/tools/w3-shots.js [--dark] [--full]
//   [--clip=<css selector>] <id>=<repo path[#hash]> ...   → design/beta/eval/w3/designer/<id>-<m|d>.jpg
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(ROOT, 'design/beta/eval/w3/designer');
const BASE = 'https://cleo.local/', a = process.argv.slice(2);
const dark = a.includes('--dark'), full = a.includes('--full');
const clip = (a.find(x => x.startsWith('--clip=')) || '').slice(7);
const mount = (a.find(x => x.startsWith('--mount=')) || '').slice(8);   // preview a view module before the switcher lands
const print = a.includes('--print');
const only = (a.find(x => x.startsWith('--vp=')) || '--vp=m,d').slice(5).split(',');
const sets = a.filter(x => !x.startsWith('--')).map(x => x.split('='));
const VP = { m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, d: { viewport: { width: 1440, height: 900 } } };
const CT = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
(async () => {
  const b = await chromium.launch();
  for (const [id, url] of sets) for (const k of only) {
    const ctx = await b.newContext({ ...VP[k], colorScheme: dark ? 'dark' : 'light' }), p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.route('**/*', r => { const u = r.request().url(); if (!u.startsWith(BASE)) return r.abort();
      const f = path.join(ROOT, decodeURIComponent(new URL(u).pathname));
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({ status: 404, body: '' });
      const ct = CT[path.extname(f)] || 'application/octet-stream';
      r.fulfill({ body: fs.readFileSync(f), headers: { 'content-type': ct + (/^text|json/.test(ct) ? '; charset=utf-8' : '') } }); });
    await p.goto(BASE + url, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(900);
    if (mount) { const er = await p.evaluate(async v => { document.documentElement.setAttribute('data-view', v);
        const m = document.querySelector('main'), host = document.createElement('section'); host.className = 'vw view-' + v;
        const sp = m.querySelector('.split'); m.insertBefore(host, sp); if (sp) sp.hidden = true;
        const up = (document.querySelector('script[src*="assets/js/"]').getAttribute('src').match(/^((?:\.\.\/)*)/) || ['', ''])[1];
        await new Promise((ok, no) => { const s = document.createElement('script'); s.src = up + 'assets/js/' + v + '.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
        const q = (window.CleoViewQueue || []).find(x => x[0] === v), def = q ? q[1] : (window.Cleo && Cleo.views && Cleo.views.get && Cleo.views.get(v));
        if (!def) return 'no module ' + v; try { await def.mount(host, {}); } catch (e) { return String(e); } return ''; }, mount);
      if (er) errs.push(er); await p.waitForTimeout(600); }
    if (print) { await p.emulateMedia({ media: 'print' }); console.log(JSON.stringify(await p.evaluate(() => {
      const vis = s => [...document.querySelectorAll(s)].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden').length;
      return { topbar: vis('.topbar'), masthead: vis('main > .masthead'), canonicalCards: vis('.split li.pl'), entries: vis('li.ge'), appendix: vis('.gb-appendix') }; }))); }
    const file = path.join(OUT, `${id}${dark ? '-night' : ''}-${k}.jpg`), el = clip && await p.$(clip);
    if (el) { await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: file, type: 'jpeg', quality: 72 }); }
    else await p.screenshot({ path: file, type: 'jpeg', quality: 72, fullPage: full });
    console.log(path.relative(ROOT, file), errs.length ? 'JS errors: ' + errs.join(' | ') : '0 JS errors');
    await ctx.close();
  }
  await b.close();
})();
