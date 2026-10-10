#!/usr/bin/env node
// Screenshots of the view-style mockups at 390×844 (DPR 2, touch) and 1440×900, light, reduced motion.
//   python3 -m http.server 8791 --bind 127.0.0.1   (from the repo root)
//   NODE_PATH=$(npm root -g) node design/beta/views/tools/views-shots.js
// Every off-origin request is aborted, which also proves the mockups render with no CDN.
const path = require('path');
const { chromium } = require('playwright');
const OUT = path.join(__dirname, '..', 'screenshots');
const BASE = 'http://127.0.0.1:8791/design/beta/views/mockups/';
const VP = {
  m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  d: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
};
const scrollTo = (sel, off = 0) => async (p) => p.evaluate(([s, o]) => { const el = document.querySelector(s); if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY - o); }, [sel, off]);
const SCENES = [];
for (const c of ['tokyo', 'cleveland']) {
  SCENES.push(
    { id: `${c}-gallery`, url: `${c}-gallery.html#view=gallery` },
    { id: `${c}-gallery-rows`, url: `${c}-gallery.html#view=gallery`, act: scrollTo('.row', 120) },
    { id: `${c}-gallery-all`, url: `${c}-gallery.html#view=gallery&pg=2`, act: scrollTo('[data-pager]', 520) },
    { id: `${c}-gallery-place`, url: `${c}-gallery-place.html` },
    { id: `${c}-gallery-place-s1`, url: `${c}-gallery-place.html`, act: scrollTo('.dgrid', 80) },
    { id: `${c}-atlas`, url: `${c}-atlas.html#view=atlas` },
    { id: `${c}-atlas-full`, url: `${c}-atlas.html#view=atlas`, only: 'm', act: async (p) => { await p.click('[data-grab]'); } },
    { id: `${c}-guidebook`, url: `${c}-guidebook.html#view=guidebook` },
    { id: `${c}-guidebook-chapter`, url: `${c}-guidebook.html#view=guidebook`, act: scrollTo('.ch', 110) },
    { id: `${c}-insights`, url: `${c}-insights.html#view=insights` },
    { id: `${c}-insights-s1`, url: `${c}-insights.html#view=insights`, act: scrollTo('#src-t', 130) },
    { id: `${c}-insights-s2`, url: `${c}-insights.html#view=insights`, act: scrollTo('#cls-t', 130) },
  );
}
SCENES.push({ id: 'tokyo-gallery-lens', url: 'tokyo-gallery.html#view=gallery&a=CHUO&k=f' });
SCENES.push({ id: 'tokyo-guidebook-print', url: 'tokyo-guidebook.html', only: 'd', print: true });
(async () => {
  const b = await chromium.launch();
  const only = process.argv.slice(2);
  for (const vp of ['m', 'd']) for (const s of SCENES) {
    if (s.only && s.only !== vp) continue;
    if (only.length && !only.some((o) => s.id.startsWith(o))) continue;
    const ctx = await b.newContext({ ...VP[vp], colorScheme: 'light', reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.route('**/*', (r) => (new URL(r.request().url()).hostname === '127.0.0.1' ? r.continue() : r.abort()));
    if (s.print) await p.emulateMedia({ media: 'print' });
    await p.goto(BASE + s.url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    if (s.act) { await s.act(p); await p.waitForTimeout(500); }
    await p.screenshot({ path: path.join(OUT, `${s.id}-${vp}.jpg`), type: 'jpeg', quality: 62 });
    console.log('shot', s.id, vp);
    await ctx.close();
  }
  await b.close();
})();
