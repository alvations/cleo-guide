// Lead check (round 3): focuses the first Tokyo pins at 1440 and records the pill rect, focus ring and :focus-visible.
// Usage: NODE_PATH=$(npm root -g) node pin-focus-check.js <checkout> <outdir> <stub-tile.png>
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(process.argv[2], 'beta'), OUT = process.argv[3];
const TILE = fs.readFileSync(process.argv[4]);
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route('**/*', r => { const u = new URL(r.request().url());
    if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u.host)) return r.fulfill({ body: TILE, headers: { 'content-type': 'image/png' } });
    if (u.origin !== 'https://cleo.local') return r.abort();
    let p = path.join(ROOT, decodeURIComponent(u.pathname)); if (p.endsWith('/')) p += 'index.html';
    if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
    const ct = p.endsWith('.html') ? 'text/html' : p.endsWith('.js') ? 'text/javascript' : p.endsWith('.css') ? 'text/css' : p.endsWith('.json') ? 'application/json' : p.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream';
    r.fulfill({ body: fs.readFileSync(p), headers: { 'content-type': ct } }); });
  const pg = await ctx.newPage();
  await pg.goto('https://cleo.local/cities/tokyo.html#view=atlas', { waitUntil: 'load' }); await pg.waitForTimeout(2500);
  const res = [];
  for (let i = 0; i < 3; i++) {
    const info = await pg.evaluate(i => { const a = document.querySelectorAll('a.leaflet-marker-icon')[i]; a.focus();
      const r = a.getBoundingClientRect(), c = a.firstElementChild ? a.firstElementChild.getBoundingClientRect() : null;
      const cs = getComputedStyle(a), cc = a.firstElementChild ? getComputedStyle(a.firstElementChild) : null;
      return { label: a.getAttribute('aria-label'), focused: document.activeElement === a, anchor: [r.left, r.top, r.width, r.height].map(Math.round),
        child: c && [c.left, c.top, c.width, c.height].map(Math.round), childOnScreen: c && c.bottom > 0 && c.top < innerHeight && c.right > 0 && c.left < innerWidth,
        outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, childOutline: cc && (cc.outlineStyle + ' ' + cc.outlineWidth), childShadow: cc && cc.boxShadow,
        focusVisible: a.matches(':focus-visible') }; }, i);
    res.push(info);
  }
  // keyboard focus a pin via Tab from the map so :focus-visible applies, then screenshot
  await pg.evaluate(() => document.querySelector('#cleo-map, .leaflet-container').focus());
  await pg.keyboard.press('Tab'); await pg.waitForTimeout(300);
  const kb = await pg.evaluate(() => { const a = document.activeElement, c = a.firstElementChild && a.firstElementChild.getBoundingClientRect();
    const cs = a.firstElementChild && getComputedStyle(a.firstElementChild); return { cls: a.className, label: a.getAttribute('aria-label'), fv: a.matches(':focus-visible'), child: c && [c.left, c.top, c.width, c.height].map(Math.round), childShadow: cs && cs.boxShadow, childOutline: cs && cs.outlineStyle + ' ' + cs.outlineWidth, aOutline: getComputedStyle(a).outlineStyle + ' ' + getComputedStyle(a).outlineWidth }; });
  await pg.screenshot({ path: path.join(OUT, 'tokyo-1440-pin-keyboard-focus.jpg'), type: 'jpeg', quality: 80 });
  if (kb.child) await pg.screenshot({ path: path.join(OUT, 'tokyo-1440-pin-keyboard-focus-crop.jpg'), type: 'jpeg', quality: 90, clip: { x: Math.max(0, kb.child[0] - 40), y: Math.max(0, kb.child[1] - 30), width: kb.child[2] + 80, height: kb.child[3] + 60 } });
  console.log(JSON.stringify({ programmatic: res, keyboard: kb }, null, 1)); await b.close();
})();
