#!/usr/bin/env node
// OV audit (FE-B scope: Guidebook, Insights, What changed, method page). For each page × viewport × theme: every fixed /
// sticky layer in view at load and after a scroll (rect, % of the viewport height), the union chrome share top + bottom,
// and whether the share shrinks after scrolling. Needs: python3 -m http.server 8765 -d <repo>. Run from tools/:
//   node beta/feb-ov.js [out.json]
'use strict';
const { chromium } = require('playwright'), fs = require('fs');
const ONLY = process.env.OV_ONLY ? new RegExp(process.env.OV_ONLY) : null;
const PAGES = [['cities/tokyo.html#view=guidebook', 'guidebook'], ['cities/tokyo.html#view=insights', 'insights'],
  ['cleveland.html#view=guidebook', 'guidebook'], ['Singapore/punggol.html#view=guidebook', 'guidebook'], ['Singapore/punggol.html#view=insights', 'insights'],
  ['changes/tokyo.html', 'changes'], ['how-we-choose.html', 'method']];
const VPS = [[390, 844, 1], [390, 664, 1], [844, 390, 1], [768, 1024, 0], [1024, 768, 0], [1440, 900, 0]];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }), out = [];
  for (const [pg, view] of PAGES.filter(x => !ONLY || ONLY.test(x[0]))) for (const [w, h, mob] of VPS) for (const theme of ['light', 'dark']) {
    const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: !!mob, hasTouch: !!mob, deviceScaleFactor: mob ? 2 : 1, colorScheme: theme, serviceWorkers: 'block' });
    await c.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
    const p = await c.newPage(); await p.goto('http://127.0.0.1:8765/beta/' + pg); await p.waitForTimeout(1600);
    const meas = () => p.evaluate(() => {
      const H = innerHeight, W = innerWidth, L = [];
      document.querySelectorAll('body *').forEach(e => {
        const cs = getComputedStyle(e); if (cs.position !== 'fixed' && cs.position !== 'sticky') return;
        if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
        const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || r.bottom <= 0 || r.top >= H || r.right <= 0 || r.left >= W) return;
        // a sticky element only counts when it is actually stuck (its top at its sticky offset)
        if (cs.position === 'sticky') { const top = parseFloat(cs.top); if (isNaN(top) || Math.abs(r.top - top) > 1) return; }
        if (r.height > H * 0.9 && r.width > W * 0.9) return;   // a full-screen overlay (dialog) is not chrome
        if ([...L].some(x => x.el.contains(e))) return;
        L.push({ el: e, pos: cs.position, sel: e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.classList.length ? '.' + [...e.classList].slice(0, 2).join('.') : ''), top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), w: Math.round(r.width) });
      });
      // union of covered rows in the top half and bottom half (full-width-ish layers only count by their height)
      const rows = new Uint8Array(H); L.forEach(x => { if (x.w < W * 0.5) return; for (let y = Math.max(0, x.top); y < Math.min(H, x.bottom); y++) rows[y] = 1; });
      const share = Math.round(rows.reduce((s, v) => s + v, 0) / H * 100);
      // a sticky / fixed bar drawn under another one (overlap of two full-width layers, px)
      const wide = L.filter(x => x.w >= W * 0.5), over = [];
      wide.forEach((x, i) => wide.slice(i + 1).forEach(y => { const o = Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top); if (o > 1) over.push(`${x.sel}/${y.sel} ${o}px`); }));
      return { share, over, layers: L.map(({ el, ...x }) => x) };
    });
    const m0 = await meas();
    await p.mouse.wheel(0, 1600); await p.waitForTimeout(500); await p.mouse.wheel(0, 900); await p.waitForTimeout(700);
    const m1 = await meas();
    out.push({ pg, view, vp: `${w}x${h}`, theme, load: m0.share, scrolled: m1.share, over: m1.over, layers0: m0.layers, layers1: m1.layers });
    console.log(`${pg.padEnd(40)} ${(w + 'x' + h).padEnd(9)} ${theme.padEnd(5)} load ${String(m0.share).padStart(3)}%  scrolled ${String(m1.share).padStart(3)}%  ${m1.over.length ? 'OVERLAP ' + m1.over.join(',') + '  ' : ''}${m1.layers.map(x => `${x.sel}[${x.pos[0]} ${x.top}-${x.bottom}]`).join(' ')}`);
    await c.close();
  }
  await b.close(); if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
})();
