// Atlas FE-2 (PANEL-R4 #6a, #5a): selecting a place on the desktop map shows on its card — photo and no-photo (quote)
// cards alike: the card's computed outline differs from an unselected card's and a pixel diff of the card (with its ring
// margin) is non-zero; the ring is one, outside the card (≥ 2 px clear of its text). 1440, 4 pages, light and dark.
//   NODE_PATH=$(npm root -g) node tools/beta/fe2/selected.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..'), BASE = 'https://cleo.local/', PNG = fs.readFileSync(path.join(ROOT, 'tools/node_modules/leaflet/dist/images/layers.png'));
const PAGES = ['cities/tokyo.html', 'cleveland.html', 'cities/newyork.html', 'Singapore/chinatown.html'];
(async () => { const b = await chromium.launch(); let bad = 0;
  const say = (ok, msg, x) => { if (!ok) bad++; console.log(`${ok ? 'PASS' : 'FAIL'}  selected ${msg}  ${JSON.stringify(x)}`); };
  for (const pg of PAGES) for (const scheme of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme, reducedMotion: 'reduce' });
    await ctx.route('**/*', r => { const u = new URL(r.request().url()); if (/arcgis|openstreetmap/.test(u.host)) return r.fulfill({ body: PNG, headers: { 'content-type': 'image/png' } }); if (u.origin + '/' !== BASE) return r.abort(); const p = path.join(ROOT, decodeURIComponent(u.pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' }); return r.fulfill({ body: fs.readFileSync(p) }); });
    const page = await ctx.newPage(); await page.goto(BASE + 'beta/' + pg + '#view=atlas'); await page.waitForTimeout(3000);
    for (const kind of ['photo', 'quote']) {
      // a card of that kind whose place is a labelled pin on the map (the reader selects it there)
      const id = await page.evaluate(k => { const ok = c => !!c.querySelector('figure.pl-photo img') === (k === 'photo');
        const pins = [...document.querySelectorAll('.leaflet-marker-icon.pp:not(.sel)')].map(e => e.getAttribute('data-id'));
        const c = pins.map(i => document.getElementById('p-' + i)).find(c => c && !c.hidden && c.offsetHeight && ok(c)); return c ? c.id : null; }, kind);
      if (!id) { console.log(`SKIP  selected ${pg} 1440 ${scheme} ${kind}: no ${kind} card with a pin on this screen`); continue; }
      await page.evaluate(i => document.getElementById(i).scrollIntoView({ block: 'center' }), id); await page.waitForTimeout(300);
      const box = async () => { const q = await (await page.$('#' + id)).boundingBox(); return { x: q.x - 8, y: q.y - 8, width: q.width + 16, height: Math.min(q.height + 16, 600) }; };
      const st = () => page.evaluate(i => { const c = document.getElementById(i), s = getComputedStyle(c); return { o: s.outlineStyle + ' ' + s.outlineColor + ' ' + s.outlineWidth, off: parseFloat(s.outlineOffset) || 0, sel: c.classList.contains('is-sel') }; }, id);
      const s0 = await st(), p0 = await page.screenshot({ clip: await box() });
      const pin = await page.$(`.leaflet-marker-icon.pp[data-id="${id.slice(2)}"] > *`); if (pin) await pin.click(); await page.waitForTimeout(500);
      await page.evaluate(() => document.activeElement && document.activeElement.blur()); await page.mouse.move(2, 450);
      await page.evaluate(i => document.getElementById(i).scrollIntoView({ block: 'center' }), id); await page.waitForTimeout(300);
      const s1 = await st(), p1 = await page.screenshot({ clip: await box() });
      say(s1.sel && s1.o !== s0.o && !/transparent|rgba\([^)]*, 0\)/.test(s1.o.split(' solid ')[0] || s1.o) && s1.off >= 2 && !p0.equals(p1), `${pg} 1440 ${scheme} ${kind} card: selecting its pin shows on the card (outline changes, one ring ≥ 2 px outside, pixels differ)`, { id, before: s0.o, after: s1.o, offset: s1.off, pixelsDiffer: !p0.equals(p1) });
      await page.evaluate(() => { const C = Cleo.city; if (C.closePoi) C.closePoi(); }); await page.mouse.click(700, 600); await page.waitForTimeout(300);
    }
    await ctx.close(); }
  await b.close(); console.log(bad ? `>>> FAIL — ${bad} selected-card case(s)` : '>>> PASS — the selected card shows'); process.exit(bad ? 1 : 0); })();
