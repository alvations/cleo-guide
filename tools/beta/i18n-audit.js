#!/usr/bin/env node
'use strict';
/**
 * tools/beta/i18n-audit.js — i18n D-41: a real-browser audit of every page type and view under ?lang=ja, with a PSEUDO
 * catalogue (every string full-width ⟦…⟧) served as ja.json. Any visible ASCII word left is either data (place, area,
 * source and guide names are filtered out by name) or hard-coded English. Prints the leftovers per page and viewport.
 *
 *   node tools/beta/i18n-audit.js [page[#hash] ...]        (default: every page type and the city views)
 */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const i18n = require(ROOT + '/tools/beta/lib/i18n');
const ja = JSON.parse(fs.readFileSync(ROOT + '/beta/assets/i18n/ja.json', 'utf8')), en = JSON.parse(fs.readFileSync(ROOT + '/beta/assets/i18n/en.json', 'utf8'));
const P = Object.assign({}, ja, { strings: Object.fromEntries(Object.entries(en.strings).map(([k, v]) => [k, i18n.pseudoText(v)])) });
const M = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
// data: every place / area / source / guide name in the built place data, so they don't count as English
const names = new Set();
for (const f of fs.readdirSync(ROOT + '/beta/data/places')) { try { const j = JSON.parse(fs.readFileSync(ROOT + '/beta/data/places/' + f, 'utf8'));
  (j.places || []).forEach(p => { if (p.n) { names.add(p.n); names.add(p.n.replace(/\s+[—–-]+\s*CLOSED\b.*$/, '')); } (p.a ? [p.a] : []).forEach(a => names.add(a)); });
  (j.areas || []).forEach(a => names.add(String(a.n))); (j.sourceIndex || []).forEach(x => names.add(String(x.name))); } catch (e) {} }
const pages = (process.argv[2] ? process.argv.slice(2) : ['index.html', 'Japan/index.html', 'changes/tokyo.html', 'how-we-choose.html', 'accessibility.html', '404.html', 'saved.html', 'trip.html',
  'cities/tokyo.html#view=gallery', 'cities/tokyo.html#view=atlas', 'cities/tokyo.html#p=imperial-palace-east-gardens', 'cities/tokyo.html#view=guidebook', 'cities/tokyo.html#view=insights', 'cities/tokyo.html#view=gallery&day=1']);
(async () => {
  const srv = http.createServer((q, r) => { let u = decodeURIComponent(q.url.split('?')[0]); if (u.endsWith('/assets/i18n/ja.json')) { r.writeHead(200, { 'Content-Type': 'application/json' }); return r.end(JSON.stringify(P)); }
    const f = path.join(ROOT, u); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': M[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const b = await chromium.launch();
  for (const pg of pages) for (const vp of [390, 1440]) {
    const cx = await b.newContext({ viewport: { width: vp, height: 900 }, serviceWorkers: 'block' }), p = await cx.newPage(), errs = [];
    await p.route(/arcgisonline|openstreetmap/, r => r.abort()); p.on('pageerror', e => errs.push(String(e).slice(0, 100)));
    // a seeded saved list so saved.html / trip.html have content
    await p.addInitScript(() => { try { localStorage.setItem('cleo:v1:saved', JSON.stringify({ 'tokyo/imperial-palace-east-gardens': 1, 'tokyo/meiji-jingu': 1 })); } catch (e) {} });
    const [file, hash] = pg.split('#');
    await p.goto(`http://127.0.0.1:${srv.address().port}/beta/${file}?lang=ja${hash ? '#' + hash : ''}`); await p.waitForTimeout(2600);
    const left = await p.evaluate(nm => {
      const N = new Set(nm), out = new Set(), vis = el => { const r = el.getBoundingClientRect(); return !!(el.offsetParent || el.getClientRects().length) && r.width > 0 && getComputedStyle(el).visibility !== 'hidden'; };
      const skip = el => el.closest('script,style,svg,noscript,[translate="no"],.pl-n,.pl-w,.pl-k,.pl-ad,.credit,figcaption,.gc-n,.gc-w,.ge h4,.ge-w,.urls,.leaflet-control-attribution,h1,.dek');
      const bad = t => /[A-Za-z]{3,}/.test(t) && !N.has(t) && !/^[\w.-]+\.(com|org|net|jp|io)\b/.test(t);
      const tw = document.createTreeWalker(document.body, 4);
      for (let n; (n = tw.nextNode());) { const pe = n.parentElement, t = n.nodeValue.trim(); if (!t || !pe || skip(pe) || !vis(pe)) continue; if (bad(t)) out.add(t.slice(0, 80)); }
      document.querySelectorAll('[aria-label],[placeholder],[title]').forEach(e => { if (skip(e) || !vis(e)) return; ['aria-label', 'placeholder', 'title'].forEach(a => { const v = e.getAttribute(a); if (v && bad(v)) out.add('@' + a + ': ' + v.slice(0, 70)); }); });
      return [...out];
    }, [...names]);
    console.log(`\n## ${pg} @${vp} errors=${errs.length}${errs.length ? ' ' + errs[0] : ''} left=${left.length}`); left.slice(0, 40).forEach(x => console.log('   ' + x));
    await cx.close();
  }
  await b.close(); srv.close();
})();
