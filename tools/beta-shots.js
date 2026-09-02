#!/usr/bin/env node
// Design-review screenshot harness. Renders beta pages to PNG at desktop + mobile widths, plus a
// scrolled section for map pages, into a given out dir. Not part of the build; a review aid.
//   PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers NODE_PATH=tools/node_modules node tools/beta-shots.js <outdir>
const path = require('path'); const { chromium } = require('playwright-core');
const EXE = process.env.PW_CHROMIUM_EXECUTABLE || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const ROOT = path.resolve(__dirname, '..');
const OUT = process.argv[2] || '/tmp/shots';
const fs = require('fs'); fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  { id: 'hub',       rel: 'beta/index.html',                 scroll: 700 },
  { id: 'country',   rel: 'beta/Germany/index.html',         scroll: 0 },
  { id: 'city',      rel: 'beta/cleveland.html',             scroll: 2150 },
  { id: 'pastel',    rel: 'beta/Singapore/toa-payoh.html',   scroll: 2150 },
  { id: 'vietnam',   rel: 'beta/Vietnam/index.html',         scroll: 0 },
];
const VIEWS = [ { w: 1440, h: 900, tag: 'd' }, { w: 390, h: 780, tag: 'm' } ];

(async () => {
  const b = await chromium.launch({ executablePath: EXE });
  for (const pg of PAGES) {
    for (const v of VIEWS) {
      const page = await b.newPage({ viewport: { width: v.w, height: v.h } });
      const errs = []; page.on('pageerror', e => errs.push(String(e)));
      // Fully offline: abort every external request (map libs AND network fonts are flaky in this
      // sandbox) so the page's graceful fallback shows fast; inject the SAME fonts from local files.
      await page.route('**/*', route =>
        route.request().url().startsWith('file:') ? route.continue() : route.abort());
      await page.goto('file://' + path.join(ROOT, pg.rel), { waitUntil: 'domcontentloaded' }).catch(()=>{});
      const FONTCSS = process.env.BETA_FONT_CSS;
      if (FONTCSS) { try { await page.addStyleTag({ path: FONTCSS }); } catch(e){} }
      try { await Promise.race([ page.evaluate(() => document.fonts.ready), page.waitForTimeout(2500) ]); } catch(e){}
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUT, `${pg.id}-${v.tag}-top.png`) });
      if (pg.scroll && v.tag === 'd') {
        await page.evaluate(y => window.scrollTo(0, y), pg.scroll);
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(OUT, `${pg.id}-${v.tag}-scroll.png`) });
      }
      if (errs.length) console.log(pg.rel, v.tag, 'ERRORS', errs.slice(0,1));
      await page.close();
    }
  }
  await b.close();
  console.log('shots ->', OUT);
})().catch(e => { console.error(e); process.exit(1); });
