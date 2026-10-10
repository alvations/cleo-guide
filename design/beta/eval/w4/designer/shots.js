#!/usr/bin/env node
'use strict';
/* Designer W4 screenshots: serves the generated beta/ from disk (tiles stubbed, all other off-origin aborted) and
 * shoots each view at 390×844 (DPR 2, touch) and 1440×900.
 *   node design/beta/eval/w4/designer/shots.js [--tag after] [--only id,id] [--reduce] */
const fs = require('fs'), path = require('path');
const { chromium } = require(require.resolve('playwright', { paths: [path.resolve(__dirname, '../../../../../tools')] }));
const ROOT = path.resolve(__dirname, '../../../../..'), OUT = __dirname;
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const TAG = arg('--tag', 'after'), ONLY = (arg('--only', '') || '').split(',').filter(Boolean), REDUCE = process.argv.includes('--reduce');
const BASE = 'https://cleo.local/';
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.xml': 'application/xml' };
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN482YJAAT0Aqt4WyN2AAAAAElFTkSuQmCC', 'base64');
const SHOTS = [
  { id: 'tokyo-gallery', url: 'beta/cities/tokyo.html#view=gallery' },
  { id: 'tokyo-gallery-rows', url: 'beta/cities/tokyo.html#view=gallery', scrollTo: '.g-row', wait: 900 },
  { id: 'tokyo-gallery-grid', url: 'beta/cities/tokyo.html#view=gallery&pg=2', scrollTo: '#cleo-grid', wait: 600 },
  { id: 'cle-gallery-grid', url: 'beta/cleveland.html#view=gallery', scrollTo: '#cleo-grid', wait: 600 },
  { id: 'tokyo-guidebook', url: 'beta/cities/tokyo.html#view=guidebook', wait: 700 },
  { id: 'tokyo-insights', url: 'beta/cities/tokyo.html#view=insights', wait: 700 },
  { id: 'tokyo-insights-closed', url: 'beta/cities/tokyo.html#view=insights', scrollTo: '[data-cleo-insights] .tiles, [data-cleo-insights]', wait: 700 },
];
(async () => {
  const b = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? undefined : undefined });
  for (const [vp, o] of [['m', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['d', { viewport: { width: 1440, height: 900 } }]]) {
    const ctx = await b.newContext(Object.assign({ reducedMotion: REDUCE ? 'reduce' : 'no-preference' }, o));
    await ctx.route('**/*', r => { const u = new URL(r.request().url());
      if (u.host === 'cleo.local') { const p = path.join(ROOT, decodeURIComponent(u.pathname)); if (fs.existsSync(p) && fs.statSync(p).isFile()) return r.fulfill({ body: fs.readFileSync(p), contentType: TYPES[path.extname(p)] || 'application/octet-stream' }); return r.fulfill({ status: 404, body: '' }); }
      if (/tile|arcgis/.test(u.host)) return r.fulfill({ body: TILE, contentType: 'image/png' });
      return r.abort(); });
    for (const s of SHOTS) {
      if (ONLY.length && !ONLY.includes(s.id)) continue;
      const pg = await ctx.newPage(), errs = [];
      pg.on('pageerror', e => errs.push(e.message));
      await pg.goto(BASE + s.url, { waitUntil: 'load' }); await pg.waitForTimeout(s.wait || 500);
      if (s.scrollTo) { await pg.evaluate(q => { const e = document.querySelector(q); if (e) e.scrollIntoView({ block: 'start' }); }, s.scrollTo); await pg.waitForTimeout(700); }
      const f = path.join(OUT, `${s.id}-${vp}-${TAG}.png`);
      await pg.screenshot({ path: f }); console.log(f.replace(ROOT + '/', ''), errs.length ? 'ERR ' + errs.join(' | ') : '');
      await pg.close();
    }
    await ctx.close();
  }
  await b.close();
})();
