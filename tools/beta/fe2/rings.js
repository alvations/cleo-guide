// Atlas FE-2 (PANEL-R3 #9/#14): one focus ring per card in Atlas — Tab to 3 cards (phone carousel, desktop list; light
// and dark) and count the rings drawn: the card (li.pl), its name link and the link's ::before/::after.
//   NODE_PATH=$(npm root -g) node tools/beta/fe2/rings.js [cities/tokyo.html]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..'), BASE = 'https://cleo.local/', PNG = fs.readFileSync(path.join(ROOT, 'tools/node_modules/leaflet/dist/images/layers.png'));
const rel = process.argv[2] || 'cities/tokyo.html';
(async () => { const b = await chromium.launch(); let bad = 0;
  for (const [vn, vp] of [['390', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }], ['1440', { viewport: { width: 1440, height: 900 } }]]) for (const scheme of ['light', 'dark']) {
    const ctx = await b.newContext(Object.assign({ reducedMotion: 'reduce', colorScheme: scheme }, vp));
    await ctx.route('**/*', r => { const u = new URL(r.request().url()); if (/arcgis|openstreetmap/.test(u.host)) return r.fulfill({ body: PNG, headers: { 'content-type': 'image/png' } }); if (u.origin + '/' !== BASE) return r.abort(); const p = path.join(ROOT, decodeURIComponent(u.pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' }); return r.fulfill({ body: fs.readFileSync(p) }); });
    const page = await ctx.newPage(); await page.goto(BASE + 'beta/' + rel + '#view=atlas'); await page.waitForTimeout(2500);
    if (vn === '390') { await page.evaluate(() => { const c = document.querySelector('.leaflet-marker-icon.pp'); if (c) c.click(); }); await page.waitForTimeout(800); }   // the phone carousel shows after a selection
    // start just before the first card's link, then Tab: each stop inside a card is measured
    await page.evaluate(() => { const a = [...document.querySelectorAll('.listpane li.pl:not([hidden]):not(.ms-out) .pl-n a')].find(x => x.getClientRects().length); if (a) { a.closest('li.pl').scrollIntoView({ block: 'nearest', inline: 'nearest' }); a.focus(); } });
    const stops = [];
    for (let i = 0; i < 40 && stops.filter(s => s.name).length < 3; i++) {
      const s = await page.evaluate(() => { const a = document.activeElement, li = a && a.closest && a.closest('li.pl'); if (!li) return { out: (a && a.tagName) || null };
        const ring = (el, pse) => { const st = getComputedStyle(el, pse); return (st.outlineStyle !== 'none' && parseFloat(st.outlineWidth) > 0 && !/rgba\([^)]*,\s*0\)|transparent/.test(st.outlineColor) ? 'outline ' + st.outlineWidth + ' @' + st.outlineOffset : '') || (pse && st.boxShadow && st.boxShadow !== 'none' && /0px 0px 0px/.test(st.boxShadow) ? 'shadow' : ''); };
        const r = { li: ring(li), a: ring(a), before: ring(a, '::before'), after: ring(a, '::after') }, drawn = Object.keys(r).filter(k => r[k]);
        // a ring the container clips: the card ring offset outward inside an overflow container (carousel / scrolling list)
        const lp = li.closest('.listpane'), off = parseFloat(getComputedStyle(li).outlineOffset) || 0, ow = parseFloat(getComputedStyle(li).outlineWidth) || 0;
        // an outward ring is clipped only if it really leaves the scroll pane's visible box at the sides (vertical scroll is the reader's)
        const lr = lp && lp.getBoundingClientRect(), cr = li.getBoundingClientRect(), clip = !!lp && off > 0 && (cr.left - off - ow < lr.left || cr.right + off + ow > lr.left + lp.clientWidth);
        return { id: li.id, name: a.closest('.pl-n') ? 1 : 0, tag: a.tagName.toLowerCase() + (a.className ? '.' + String(a.className).split(' ')[0] : ''), drawn, r, clippedOut: !!r.li && clip }; });
      stops.push(s); await page.keyboard.press('Tab'); await page.waitForTimeout(80);
    }
    const inCard = stops.filter(s => s.id), wrong = inCard.filter(s => s.drawn.length !== 1 || s.clippedOut);
    const ok = inCard.filter(s => s.name).length >= 3 && wrong.length === 0; if (!ok) bad++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  rings ${rel} ${vn} ${scheme}: exactly one unclipped ring at every stop inside a card  ${JSON.stringify({ stops: inCard.length, wrong: wrong.slice(0, 3) })}`);
    await ctx.close(); }
  await b.close(); console.log(bad ? `>>> FAIL — ${bad} ring case(s)` : '>>> PASS — rings'); process.exit(bad ? 1 : 0); })();
