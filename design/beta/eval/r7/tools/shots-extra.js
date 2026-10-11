// R7 evaluator: flows the generic harness cannot reach. Atlas pin → carousel (phone) and pin → preview → detail (desktop),
// zooming through cluster bubbles first; a closed place's sheet; and the signature motion: a card tap captured mid-way
// WITHOUT reduced motion, plus the count of running animations with and without reduced motion.
// Usage: node shots-extra.js <port> <outdir>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'), path = require('path');
const [port, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const B = `http://127.0.0.1:${port}/beta/`;
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48+cPAAXxAvkqF6tIAAAAAElFTkSuQmCC', 'base64');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const M = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, D = { viewport: { width: 1440, height: 900 } };
const ctxOf = async (b, o, rm) => { const c = await b.newContext({ ...o, reducedMotion: rm }); await c.route('**/*', r => { const u = r.request().url(); if (u.startsWith('http://127.0.0.1')) return r.continue(); if (/tile\.openstreetmap|arcgisonline/.test(u)) return r.fulfill({ body: TILE, contentType: 'image/png' }); return r.abort(); }); return c; };
const zoomIn = (p, phone) => p.evaluate(phone => { const ok = e => { const r = (e.firstElementChild || e).getBoundingClientRect(); return r.width && r.left > 30 && r.right < innerWidth * (phone ? 0.8 : 0.55) && r.top > 220 && r.bottom < innerHeight - (phone ? 260 : 100); };
  if ([...document.querySelectorAll('.leaflet-marker-icon.pp, .leaflet-marker-icon:not(.pin-cl)')].filter(ok).length >= 3) return 0; const c = [...document.querySelectorAll('.leaflet-marker-icon.pin-cl')].find(ok); if (c) c.dispatchEvent(new MouseEvent('click', { bubbles: true })); return c ? 1 : 0; }, phone);
const pinAt = (p, phone) => p.evaluate(phone => { const q = [...document.querySelectorAll('.leaflet-marker-icon.pp, .leaflet-marker-icon:not(.pin-cl)')].map(e => (e.firstElementChild || e).getBoundingClientRect()).filter(r => r.width && r.left > 30 && r.right < innerWidth * (phone ? 0.8 : 0.55) && r.top > 220 && r.bottom < innerHeight - (phone ? 260 : 100)); const r = q[Math.floor(q.length / 2)]; return r ? [r.left + r.width / 2, r.top + r.height / 2] : null; }, phone);
(async () => {
  const b = await chromium.launch(); const log = {};
  const ONLY_MOTION = process.argv.includes('--motion');
  // Atlas pin flows
  if (!ONLY_MOTION)
  for (const [vp, o] of [['m', M], ['d', D]]) for (const [k, u] of [['tokyo', 'cities/tokyo.html'], ['cle', 'cleveland.html']]) {
    const c = await ctxOf(b, o, 'reduce'); const p = await c.newPage(); await p.goto(B + u + '#view=atlas', { waitUntil: 'load' }); await sleep(2000);
    for (let i = 0; i < 4; i++) { if (!(await zoomIn(p, vp === 'm'))) break; await sleep(900); }
    const xy = await pinAt(p, vp === 'm'); let r = 'nopin';
    if (xy) { if (vp === 'm') await p.touchscreen.tap(xy[0], xy[1]); else await p.mouse.click(xy[0], xy[1]); await sleep(1100); r = 'pin'; }
    await p.screenshot({ path: path.join(out, `${k}-atlas-pin-${vp}.jpg`), type: 'jpeg', quality: 70 });
    if (vp === 'd' && xy) { const pv = await p.$('#cleo-poi:not([hidden]) a, #cleo-poi:not([hidden]) button.ms-pv-open, #cleo-poi:not([hidden]) .ms-pv-n'); if (pv) { await pv.click(); await sleep(1200); await p.screenshot({ path: path.join(out, `${k}-atlas-detail-${vp}.jpg`), type: 'jpeg', quality: 70 }); r += '+detail:' + (await p.evaluate(() => location.hash)); } }
    log[`${k}-atlas-pin-${vp}`] = r; await c.close();
  }
  // a closed place's sheet
  if (!ONLY_MOTION) for (const [vp, o] of [['m', M], ['d', D]]) { const c = await ctxOf(b, o, 'reduce'); const p = await c.newPage(); await p.goto(B + 'cleveland.html#view=gallery&p=lolly-the-trolley', { waitUntil: 'load' }); await sleep(1500);
    await p.screenshot({ path: path.join(out, `sheet-closed-${vp}.jpg`), type: 'jpeg', quality: 70 }); log[`sheet-closed-${vp}`] = await p.evaluate(() => (document.querySelector('#cleo-sheet:not([hidden])') || {}).innerText?.slice(0, 160)); await c.close(); }
  // motion
  for (const [vp, o] of [['m', M], ['d', D]]) for (const rm of ['no-preference', 'reduce']) {
    const c = await ctxOf(b, o, rm); const p = await c.newPage(); await p.goto(B + 'cities/tokyo.html#view=gallery', { waitUntil: 'load' }); await sleep(1500); await p.evaluate(() => scrollBy(0, innerHeight * 0.6)); await sleep(600);
    const t = await p.evaluate(() => { const a = [...document.querySelectorAll('li.pl > .pl-photo, li.pl > .pl-cover, li.gc .gc-a')].find(e => { const r = e.getBoundingClientRect(); return r.width > 100 && r.top > 60 && r.top < innerHeight - 200; }); if (!a) return null; const r = a.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
    if (!t) { log[`motion-${vp}-${rm}`] = 'no card'; await c.close(); continue; }
    await p.evaluate(() => { window.__vt = 0; const o = document.startViewTransition; if (o) document.startViewTransition = function (...a) { window.__vt++; return o.apply(document, a); }; });
    if (vp === 'm') await p.touchscreen.tap(t[0], t[1]); else await p.mouse.click(t[0], t[1]);
    await sleep(120); const anim = await p.evaluate(() => document.getAnimations().length);
    if (rm === 'no-preference') await p.screenshot({ path: path.join(out, `motion-mid-${vp}.jpg`), type: 'jpeg', quality: 70 });
    await sleep(700); log[`motion-${vp}-${rm}`] = { animsAt120ms: anim, viewTransitions: await p.evaluate(() => window.__vt), sheet: await p.evaluate(() => !!document.querySelector('#cleo-sheet:not([hidden])')), hash: await p.evaluate(() => location.hash) };
    await c.close();
  }
  await b.close(); fs.writeFileSync(path.join(out, ONLY_MOTION ? '_motion-log.json' : '_extra-log.json'), JSON.stringify(log, null, 1)); console.log(JSON.stringify(log, null, 1));
})();
