#!/usr/bin/env node
// Renders tools/og-cover.template.html to a 1200x630 PNG with the pre-installed Chromium
// (playwright-core). Output: beta/assets/og-cover.png. This is the branded social-share cover
// referenced by every beta page's og:image / twitter:image.
//   PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node tools/render-og.js
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE = 'file://' + path.join(ROOT, 'tools', 'og-cover.template.html');
const OUT = path.join(ROOT, 'beta', 'assets', 'og-cover.png');

(async () => {
  const exe = process.env.PW_CHROMIUM_EXECUTABLE || undefined;
  const browser = await chromium.launch({ executablePath: exe });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(TEMPLATE, { waitUntil: 'load' });
  // Give web fonts a chance to arrive; fall back gracefully if the network is slow.
  try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
  await page.waitForTimeout(1200);
  await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();
  console.log('wrote', OUT);
})().catch(e => { console.error(e); process.exit(1); });
