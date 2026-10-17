// Atlas FE-2 (SPEC-v3 §3.7, R8 gap 3): map motion. Each moment the reader starts lasts ≤ 300 ms, and none plays under
// reduced motion (document.getAnimations() stays empty). Desktop 1440: card hover, pin → preview (grows from the pin),
// Escape (120 ms fade), a dot hover (7 → 11 px in ≤ 8 redraws). Phone 390: a pin tap lifts the carousel in.
//   NODE_PATH=$(npm root -g) node tools/beta/fe2/motion.js [cities/tokyo.html]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..'), BASE = 'https://cleo.local/', PNG = fs.readFileSync(path.join(ROOT, 'tools/node_modules/leaflet/dist/images/layers.png'));
const rel = process.argv[2] || 'cities/tokyo.html';
// every animation seen (CSS transitions included) from now until stop(): what it moved and how long it lasts
const SAMPLE = () => { const seen = new Set(), out = []; let on = true;
  const tick = () => { document.getAnimations().forEach(a => { if (seen.has(a)) return; seen.add(a); const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : {}, el = a.effect && a.effect.target;
      out.push({ what: el ? el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] + (el.id ? '#' + el.id : '') : '?', prop: a.transitionProperty || (a.animationName ? 'anim ' + a.animationName : 'waapi'), ms: Math.round((+t.duration || 0) + (+t.delay || 0)) }); });
    if (on) requestAnimationFrame(tick); };
  document.getAnimations().forEach(a => seen.add(a));   // already running before the reader acted (load-time reveal backstops)
  tick(); window.__mo = { stop: () => { on = false; tick(); return out; } }; };
(async () => { const b = await chromium.launch(); let bad = 0;
  const say = (ok, msg, x) => { if (!ok) bad++; console.log(`${ok ? 'PASS' : 'FAIL'}  motion ${msg}  ${JSON.stringify(x)}`); };
  for (const rm of ['no-preference', 'reduce']) for (const [vn, vp] of [['1440', { viewport: { width: 1440, height: 900 } }], ['390', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
    const ctx = await b.newContext(Object.assign({ reducedMotion: rm }, vp)), calm = rm === 'reduce', tag = `${rel} ${vn} ${calm ? 'reduced' : 'motion'}`;
    await ctx.route('**/*', r => { const u = new URL(r.request().url()); if (/arcgis|openstreetmap/.test(u.host)) return r.fulfill({ body: PNG, headers: { 'content-type': 'image/png' } }); if (u.origin + '/' !== BASE) return r.abort(); const p = path.join(ROOT, decodeURIComponent(u.pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' }); return r.fulfill({ body: fs.readFileSync(p) }); });
    const page = await ctx.newPage(); await page.goto(BASE + 'beta/' + rel + '#view=atlas'); await page.waitForTimeout(3000);
    const moment = async (name, act, want) => { await page.evaluate(SAMPLE); await act(); await page.waitForTimeout(450); const an = await page.evaluate(() => window.__mo.stop());
      const long = an.filter(a => a.ms > 300);
      if (calm) say(an.length === 0, `${tag}: ${name} — no animation under reduced motion`, { n: an.length, an: an.slice(0, 4) });
      else say(!long.length && (!want || an.some(want)), `${tag}: ${name} — every animation ≤ 300 ms` + (want ? ', the moment plays' : ''), { n: an.length, long, an: (want ? an.filter(want).concat(an.filter(a => !want(a))) : an).slice(0, 4) });
      return an; };
    const pinBox = () => page.evaluate(() => { const mr = document.querySelector('#cleo-map').getBoundingClientRect(), poi = document.querySelector('#cleo-poi'), pr = poi && !poi.hidden ? poi.getBoundingClientRect() : null;
      const e = [...document.querySelectorAll('.leaflet-marker-icon.pp:not(.sel)')].find(x => { const r = x.getBoundingClientRect(); return r.left > mr.left + 160 && r.right < mr.right - 160 && r.top > mr.top + 300 && r.top < mr.bottom - 120 && (!pr || r.left > pr.right + 40 || r.right < pr.left - 40); });
      if (!e) return null; const s = e.firstElementChild.getBoundingClientRect(), r = e.getBoundingClientRect(); return { id: e.getAttribute('data-id'), x: s.left + s.width / 2, y: s.top + s.height / 2, px: r.left, py: r.top }; });
    if (vn === '1440') {
      // 1. card hover → its pin turns hot (one short transition)
      await moment('card hover', async () => { const r = await page.evaluate(() => { const c = [...document.querySelectorAll('.listpane li.pl:not([hidden]):not(.ms-out)')].find(x => { const r = x.getBoundingClientRect(); return r.height && r.top > 150 && r.bottom < innerHeight; }); if (!c) return null; const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 40 }; });
        if (r) await page.mouse.move(r.x, r.y, { steps: 2 }); });
      await page.mouse.move(5, 450);
      // 2. pin → preview, grown from the pin's point
      const pb = await pinBox(); if (!pb) { say(false, `${tag}: a pin to click`, {}); await ctx.close(); continue; }
      const an = await moment('pin → preview', () => page.mouse.click(pb.x, pb.y), calm ? null : a => /#cleo-poi$/.test(a.what) && a.ms >= 150);
      const og = await page.evaluate(() => { const p = document.querySelector('#cleo-poi'), r = p.getBoundingClientRect(), o = getComputedStyle(p).transformOrigin.split(' ').map(parseFloat); return { shown: !p.hidden, ox: r.left + o[0], oy: r.top + o[1] }; });
      if (!calm) say(og.shown && Math.abs(og.ox - pb.px) <= 2 && Math.abs(og.oy - pb.py) <= 2, `${tag}: the preview grows from the pin's point`, { origin: [Math.round(og.ox), Math.round(og.oy)], pin: [Math.round(pb.px), Math.round(pb.py)] });
      else say(og.shown, `${tag}: the preview opens`, og);
      // 3. Escape → a 120 ms fade, no scale; nothing left behind
      await moment('preview close', () => page.keyboard.press('Escape'), calm ? null : a => /ms-ghost/.test(a.what) && a.ms <= 150);
      const left = await page.evaluate(() => ({ ghosts: document.querySelectorAll('.ms-ghost').length, hidden: document.querySelector('#cleo-poi').hidden }));
      say(left.ghosts === 0 && left.hidden, `${tag}: the preview closed, no copy left`, left);
      // 4. a dot hovered from its card: 7 → 11 px in 120 ms, ≤ 8 redraws; back on leave
      const dot = await page.evaluate(async () => { const C = Cleo.city, m = C.map(), b = m.getBounds().pad(-0.2);
        const id = Object.keys(C.markers).find(i => { const k = C.markers[i]; return k.setRadius && k._map && !C.pinOf(i) && k.options.opacity > 0 && b.contains(k.getLatLng()); }); if (!id) return null;
        const k = C.markers[id], r0 = k.getRadius(), rs = []; const o = k.setRadius; k.setRadius = function (r) { rs.push(r); return o.apply(this, arguments); };
        C.hotId(id, true); await new Promise(r => setTimeout(r, 300)); const up = k.getRadius(), nUp = rs.length; C.hotId(id, false); await new Promise(r => setTimeout(r, 300));
        k.setRadius = o; return { id, r0, up, nUp, down: k.getRadius(), n: rs.length }; });
      if (!dot) say(false, `${tag}: a dot to hover`, {});
      else say(dot.up === dot.r0 + 2 && dot.down === dot.r0 && dot.nUp <= 8 && dot.n - dot.nUp <= 8 && (!calm || dot.nUp === 1), `${tag}: a hovered dot grows 7 → 11 px and back` + (calm ? ' at once' : ' in ≤ 8 redraws'), dot);
    } else {
      // phone: the first pin tap lifts the carousel in
      const pb = await pinBox(); if (!pb) { say(false, `${tag}: a pin to tap`, {}); await ctx.close(); continue; }
      await moment('pin → carousel', () => page.touchscreen.tap(pb.x, pb.y), calm ? null : a => /^li\.pl/.test(a.what) && a.prop === 'waapi' && a.ms <= 300);
      const car = await page.evaluate(() => document.documentElement.classList.contains('ms-car')); say(car, `${tag}: the carousel shows`, { car });
    }
    await ctx.close(); }
  await b.close(); console.log(bad ? `>>> FAIL — ${bad} motion case(s)` : '>>> PASS — map motion'); process.exit(bad ? 1 : 0); })();
