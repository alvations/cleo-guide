#!/usr/bin/env node
// Study screenshots of the melon-seek reference snapshot (design/reference/melon-seek) at 390×844 and 1440×900.
//   (cd design/reference/melon-seek/public && python3 -m http.server 8790 --bind 127.0.0.1) &
//   NODE_PATH=$(npm root -g) node design/beta/views/tools/study-shots.js
// Runs the snapshot's own offline mock data layer (?mock=1, honoured on localhost only; the UI labels it "Mock data").
// Leaflet is served from tools/node_modules/leaflet (the snapshot omits its vendor/ copy); map tiles get a flat stub,
// every other off-origin request is aborted. Records the URL hash of each scene into study/hashes.json.
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../../../..');
const OUT = path.join(__dirname, '..', 'study');
const BASE = 'http://127.0.0.1:8790/?mock=1';
const LEAF = path.join(ROOT, 'tools/node_modules/leaflet/dist');
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/58BAAMBAQD1x0ZjAAAAAElFTkSuQmCC', 'base64');
const VP = {
  m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  d: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
};
const wait = (p, ms = 900) => p.waitForTimeout(ms);
const SCENES = [
  { id: 'chart', hash: '' },
  { id: 'chart-ranges', hash: '#c=anthropic&v=ranges' },
  { id: 'map', hash: '#c=anthropic&m=map', settle: 2500 },
  { id: 'insights', hash: '#c=anthropic&m=insights', settle: 2500 },
  { id: 'filtered', hash: '#c=anthropic&d=Engineering&r=remote' },
  { id: 'filters-open', hash: '#c=anthropic', act: async (p, vp) => {
      if (vp === 'm') await p.click('#filtersToggle');
      else await p.click('#quickChips button:nth-child(2)');
    } },
  { id: 'detail', hash: '#c=anthropic', act: async (p, vp) => {
      if (vp === 'm') { await p.click('#sheetHandle'); await wait(p); }
      await p.click('#resultsList article.card >> nth=0');
    } },
  { id: 'insights-panel', hash: '#c=anthropic&m=insights', settle: 2500, act: async (p) => {
      await p.evaluate(() => document.querySelector('#insightsPanel').scrollIntoView({ block: 'start' }));
    } },
  { id: 'paging', hash: '#c=anthropic', act: async (p, vp) => {
      if (vp === 'm') { await p.click('#sheetHandle'); await wait(p); }
      await p.evaluate(() => { const l = document.querySelector('.list-more'); if (l) l.scrollIntoView({ block: 'center' }); });
    } },
  { id: 'results-sheet', hash: '#c=anthropic', only: 'm', act: async (p) => { await p.click('#sheetHandle'); } },
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const hashes = {};
  for (const vp of ['m', 'd']) {
    for (const s of SCENES) {
      if (s.only && s.only !== vp) continue;
      const ctx = await b.newContext({ ...VP[vp], colorScheme: 'light', reducedMotion: 'reduce' });
      const p = await ctx.newPage();
      await p.route('**/*', (r) => {
        const u = new URL(r.request().url());
        if (u.pathname.startsWith('/vendor/leaflet/')) return r.fulfill({ path: path.join(LEAF, u.pathname.replace('/vendor/leaflet/', '')) });
        if (u.hostname === '127.0.0.1') return r.continue();
        if (/tile|arcgis|basemap/.test(u.hostname)) return r.fulfill({ body: TILE, contentType: 'image/png' });
        return r.abort();
      });
      await p.goto(BASE + s.hash, { waitUntil: 'networkidle' });
      await wait(p, s.settle || 1500);
      if (s.act) { try { await s.act(p, vp); } catch (e) { console.log('act failed', s.id, vp, e.message.split('\n')[0]); } await wait(p, 1200); }
      hashes[s.id] = hashes[s.id] || {}; hashes[s.id][vp] = await p.evaluate(() => location.hash);
      await p.screenshot({ path: path.join(OUT, `${s.id}-${vp}.jpg`), type: 'jpeg', quality: 62 });
      console.log('shot', s.id, vp, hashes[s.id][vp]);
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'hashes.json'), JSON.stringify(hashes, null, 1) + '\n');
  await b.close();
})();
