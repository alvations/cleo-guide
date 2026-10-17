// Atlas FE-2 (designer's R4 check, landscape §2.0.7): with a selection, the docked side column starts with the selected
// place, which carries --ring-select, and stays in sync — a second pin tap brings its card first; scrolling the column one
// card on selects the card now at the top (its pin lit). 844×390, Tokyo and Chinatown (Singapore).
//   NODE_PATH=$(npm root -g) node tools/beta/fe2/side-sync.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..'), BASE = 'https://cleo.local/', PNG = fs.readFileSync(path.join(ROOT, 'tools/node_modules/leaflet/dist/images/layers.png'));
const PAGES = process.argv.slice(2).length ? process.argv.slice(2) : ['cities/tokyo.html', 'Singapore/chinatown.html'];
const STATE = () => { const lp = document.querySelector('.listpane'), lr = lp.getBoundingClientRect(), H = document.documentElement;
  const cards = [...lp.querySelectorAll('li.pl')].filter(c => !c.hidden && c.offsetHeight);
  const first = cards.find(c => { const r = c.getBoundingClientRect(); return r.top >= lr.top - 1 && r.bottom <= lr.bottom + 1; });
  const sel = lp.querySelector('li.pl.is-sel'), pin = document.querySelector('.leaflet-marker-icon.pp.sel');
  const ring = sel ? getComputedStyle(sel).boxShadow : '';
  return { car: H.classList.contains('ms-car'), column: lr.height > innerHeight / 2 && lr.left > innerWidth / 2, first: first ? Cleo.city.pid(first) : null, sel: sel ? Cleo.city.pid(sel) : null,
    pin: pin ? pin.getAttribute('data-id') : null, ring: /0px 0px 0px 2px/.test(ring), step: first ? first.offsetHeight : 0 }; };
(async () => { const b = await chromium.launch(); let bad = 0;
  const say = (ok, msg, x) => { if (!ok) bad++; console.log(`${ok ? 'PASS' : 'FAIL'}  side sync ${msg}  ${JSON.stringify(x)}`); };
  for (const pg of PAGES) {
    const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await ctx.route('**/*', r => { const u = new URL(r.request().url()); if (/arcgis|openstreetmap/.test(u.host)) return r.fulfill({ body: PNG, headers: { 'content-type': 'image/png' } }); if (u.origin + '/' !== BASE) return r.abort(); const p = path.join(ROOT, decodeURIComponent(u.pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' }); return r.fulfill({ body: fs.readFileSync(p) }); });
    const page = await ctx.newPage(), errors = []; page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
    await page.goto(BASE + 'beta/' + pg + '#view=atlas'); await page.waitForTimeout(3000);
    // tap the pill of a labelled pin that is not the first card's place (the designer's case: the column opened elsewhere)
    const tap = async skip => { const pt = await page.evaluate(sk => { const e = [...document.querySelectorAll('.leaflet-marker-icon.pp:not(.sel)')].find(x => x.getAttribute('data-id') !== sk && x.firstElementChild.getBoundingClientRect().width); if (!e) return null; const r = e.firstElementChild.getBoundingClientRect(); return { id: e.getAttribute('data-id'), x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, skip);
      if (pt) { await page.touchscreen.tap(pt.x, pt.y); await page.waitForTimeout(1200); } return pt; };
    const t1 = await tap(null), s1 = await page.evaluate(STATE);
    say(!!t1 && s1.car && s1.column && s1.sel === t1.id && s1.first === t1.id && s1.ring && s1.pin === t1.id, `${pg} 844: a pin tap opens the column on its place — first card, ring, pin lit`, { tapped: t1 && t1.id, ...s1 });
    const t2 = await tap(t1 && t1.id), s2 = await page.evaluate(STATE);
    say(!!t2 && s2.sel === t2.id && s2.first === t2.id && s2.ring && s2.pin === t2.id, `${pg} 844: a second pin tap brings its card first`, { tapped: t2 && t2.id, ...s2 });
    // next: the reader scrolls the column one card on; the card now at the top is the selection, its pin lit
    await page.evaluate(st => { const lp = document.querySelector('.listpane'); lp.scrollBy({ top: st + 12, behavior: 'auto' }); }, s2.step); await page.waitForTimeout(1200);
    const s3 = await page.evaluate(STATE);
    say(!!s3.first && s3.first !== s2.first && s3.sel === s3.first && s3.pin === s3.first && s3.ring, `${pg} 844: scrolling the column one card on selects the card at the top (next)`, s3);
    await page.evaluate(st => { const lp = document.querySelector('.listpane'); lp.scrollBy({ top: -(st + 12), behavior: 'auto' }); }, s2.step); await page.waitForTimeout(1200);
    const s4 = await page.evaluate(STATE);
    say(s4.first === s2.first && s4.sel === s4.first && s4.pin === s4.first, `${pg} 844: scrolling back selects the previous card again (previous)`, s4);
    if (errors.length) say(false, `${pg}: 0 page errors`, errors.slice(0, 2));
    await ctx.close(); }
  await b.close(); console.log(bad ? `>>> FAIL — ${bad} side-sync case(s)` : '>>> PASS — side column in sync'); process.exit(bad ? 1 : 0); })();
