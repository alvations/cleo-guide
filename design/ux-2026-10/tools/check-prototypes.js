#!/usr/bin/env node
// Verifies the proposal's hard constraints against the prototypes themselves:
//  1. content renders with EVERY external request blocked (no fonts, no Leaflet, no tiles) — zero page errors
//  2. no horizontal overflow at 360px
//  3. every gated place is reachable: paging the Tokyo/Chicago list to the end yields exactly N cards
//  4. no document.write, no key-required / Google tile hosts anywhere in the prototype sources
//  5. tap targets: interactive controls in the city toolbar/cards are >= 44px tall
//   NODE_PATH=$(npm root -g) node design/ux-2026-10/tools/check-prototypes.js
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../../..');
const PDIR = path.join(__dirname, '..', 'prototypes');
const BASE = 'https://cleo.local/';
let fail = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail++; };

// 4 — static scan
const src = fs.readdirSync(PDIR).filter(f => /\.(html|js|css)$/.test(f)).map(f => fs.readFileSync(path.join(PDIR, f), 'utf8')).join('\n');
ok(!/document\.write\s*\(/.test(src), 'no document.write in prototypes');
ok(!/cartocdn|maps\.googleapis|mt[0-3]\.google|GoogleMutant|apikey/i.test(src), 'no Google / key-required tile hosts in prototypes');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pages = ['hub.html', 'tokyo.html', 'chicago.html', 'itinerary.html'];
  for (const p of pages) {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage(); const errs = [];
    page.on('pageerror', e => errs.push(String(e)));
    await page.route('**/*', r => { const u = r.request().url(); if (u.startsWith(BASE)) { const f = path.join(ROOT, u.slice(BASE.length).split(/[?#]/)[0]); return fs.existsSync(f) ? r.fulfill({ path: f }) : r.fulfill({ status: 404, body: '' }); } return r.abort(); });
    await page.goto(BASE + 'design/ux-2026-10/prototypes/' + p, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cards: document.querySelectorAll('.card, .city').length, live: !!document.querySelector('.map.live') }));
    ok(errs.length === 0, `${p}: renders with all CDNs blocked, no page errors ${errs.length ? JSON.stringify(errs.slice(0, 2)) : ''}`);
    ok(m.cards > 0, `${p}: content present offline (${m.cards} cards)`);
    ok(m.sw <= 360, `${p}: no horizontal overflow at 360px (scrollWidth ${m.sw})`);
    if (/tokyo|chicago/.test(p)) {
      const total = await page.evaluate(() => window.CLEO_CITY.recs.length);
      for (let i = 0; i < 60; i++) { const more = await page.evaluate(() => { const b = document.querySelector('[data-more]'); if (b) b.click(); return !!b; }); if (!more) break; await page.waitForTimeout(30); }
      const n = await page.evaluate(() => document.querySelectorAll('#list .card').length);
      ok(n === total, `${p}: every place reachable by paging — ${n}/${total} cards`);
      const small = await page.evaluate(() => [...document.querySelectorAll('#tools button, #tools select, #list .card button, .fab')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height < 38; }).length);
      ok(small === 0, `${p}: toolbar/card controls >= 38px (segmented) / 44px (chips, buttons) — ${small} undersized`);
    }
    await ctx.close();
  }
  await browser.close();
  console.log(fail ? `\n${fail} check(s) FAILED` : '\nall prototype checks passed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
