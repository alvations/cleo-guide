#!/usr/bin/env node
'use strict';
/**
 * design/beta/atlas/tools/views-regress.js — non-scoring regression check of the non-Atlas views on an Atlas head.
 *
 *   NODE_PATH=$(npm root -g) node design/beta/atlas/tools/views-regress.js --root <checkout> --out design/beta/atlas/panel/R<n>/views [--base <older checkout>]
 *
 * For Tokyo and Cleveland, desktop and phone: Gallery, Guidebook, Insights, a place detail (#p=) opened from the
 * Gallery view, and saved.html. It records page errors, the number of place cards in the DOM vs the page's place
 * count, horizontal overflow and node count, and takes one screenshot each. With --base it runs the same on an older
 * head and writes a side-by-side diff of the numbers. Same-origin only; tiles are stubbed flat.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { chromium } = require('playwright');

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ROOT = path.resolve(arg('--root', '.')), BASE_ROOT = arg('--base', '') && path.resolve(arg('--base'));
const OUT = path.resolve(arg('--out', 'views'));
const ORIGIN = 'https://cleo.local/';
const VP = { d: { viewport: { width: 1440, height: 900 } }, m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } };
const PAGES = [['tokyo', 'beta/cities/tokyo.html'], ['cleveland', 'beta/cleveland.html']];
const VIEWS = ['gallery', 'guidebook', 'insights'];
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const tile = (() => { const W = 256, raw = Buffer.alloc((W * 3 + 1) * W); for (let r = 0; r < W; r++) { raw[r * (W * 3 + 1)] = 0; for (let c = 0; c < W; c++) raw.fill(230, r * (W * 3 + 1) + 1 + c * 3, r * (W * 3 + 1) + 4 + c * 3); }
  const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
  const crc = b => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const ch = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(W, 0); ih.writeUInt32BE(W, 4); ih[8] = 8; ih[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ch('IHDR', ih), ch('IDAT', zlib.deflateSync(raw)), ch('IEND', Buffer.alloc(0))]); })();
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run(root, shots) {
  const browser = await chromium.launch(), R = {};
  for (const [key, url] of PAGES) for (const vk of ['d', 'm']) {
    const targets = VIEWS.map(v => [v, url + '#view=' + v]).concat([['detail', url + '#view=gallery&p=' + ((/<li class="pl[^"]*" id="p-([a-z0-9-]+)"/.exec(fs.readFileSync(path.join(root, url), 'utf8')) || [])[1])], ['saved', 'beta/saved.html']]);
    for (const [v, u] of targets) {
      if (v === 'saved' && key !== 'tokyo') continue;
      const ctx = await browser.newContext(Object.assign({ reducedMotion: 'reduce' }, VP[vk]));
      await ctx.route('**/*', r => { const x = new URL(r.request().url()); if (/openstreetmap|arcgisonline/.test(x.host)) return r.fulfill({ body: tile, headers: { 'content-type': 'image/png' } });
        if (x.origin + '/' !== ORIGIN) return r.abort(); const p = path.join(root, decodeURIComponent(x.pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
        return r.fulfill({ body: fs.readFileSync(p), headers: { 'content-type': T[path.extname(p)] || 'application/octet-stream' } }); });
      const page = await ctx.newPage(), errors = []; page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
      await page.goto(ORIGIN + u, { waitUntil: 'load' }); await sleep(1600);
      const s = await page.evaluate(() => { const C = window.Cleo && Cleo.city, vis = e => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
        return { view: document.documentElement.getAttribute('data-view') || '', total: C && C.info ? C.info.total : null,
          cardsInDom: document.querySelectorAll('li.pl').length + (window.Cleo && Cleo.defer && Cleo.defer.peek ? Cleo.defer.peek().length : 0),
          cardsVisible: [...document.querySelectorAll('li.pl, .gc, .ge, article')].filter(vis).length,
          detailOpen: !!document.querySelector('#cleo-sheet:not([hidden])'), overflowX: document.documentElement.scrollWidth - innerWidth,
          nodes: document.getElementsByTagName('*').length, h1: ((document.querySelector('h1, .d1') || {}).textContent || '').trim().slice(0, 60) }; });
      s.errors = errors; R[`${key}-${vk}-${v}`] = s;
      if (shots) await page.screenshot({ path: path.join(OUT, `${key}-${vk === 'd' ? 1440 : 390}-${v}.jpg`), type: 'jpeg', quality: 70 });
      await ctx.close();
    }
  }
  await browser.close(); return R;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const now = await run(ROOT, true), base = BASE_ROOT ? await run(BASE_ROOT, false) : null;
  const L = ['# Other views: non-scoring regression check', '', `Head: \`${path.basename(ROOT)}\`${base ? ` · compared with \`${path.basename(BASE_ROOT)}\`` : ''}. Tiles are stubbed flat. Columns show this head${base ? ' (and the base head in brackets where it differs)' : ''}.`, '', '| page · viewport · view | page errors | places listed / total | visible cards | detail open | overflow-x px | nodes |', '|---|---|---|---|---|---|---|'];
  let flags = 0;
  for (const k in now) { const a = now[k], b = base && base[k], d = (x, y) => (b && y !== undefined && JSON.stringify(x) !== JSON.stringify(y) ? `${x} (${y})` : `${x}`);
    const bad = a.errors.length || (a.total && a.cardsInDom < a.total) || a.overflowX > 0 || (k.endsWith('detail') && !a.detailOpen); if (bad) flags++;
    L.push(`| ${k}${bad ? ' ⚠' : ''} | ${d(a.errors.length, b && b.errors.length)} | ${d(a.cardsInDom, b && b.cardsInDom)} / ${a.total} | ${d(a.cardsVisible, b && b.cardsVisible)} | ${k.endsWith('detail') ? d(a.detailOpen, b && b.detailOpen) : '–'} | ${d(a.overflowX, b && b.overflowX)} | ${d(a.nodes, b && b.nodes)} |`); }
  L.push('', flags ? `**${flags} state(s) flagged ⚠** (page error, a place missing, horizontal overflow, or the detail not opening).` : '**No regressions flagged**: 0 page errors, every place listed, no horizontal overflow, and the detail opens in every state.');
  const errs = Object.entries(now).filter(([, v]) => v.errors.length).map(([k, v]) => `- ${k}: ${v.errors.join(' | ')}`); if (errs.length) L.push('', 'Errors:', ...errs);
  fs.writeFileSync(path.join(OUT, 'views.json'), JSON.stringify({ now, base }, null, 1) + '\n');
  fs.writeFileSync(path.join(OUT, 'VIEWS.md'), L.join('\n') + '\n');
  console.log(L.slice(-3).join('\n'));
})();
