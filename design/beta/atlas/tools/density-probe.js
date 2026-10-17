#!/usr/bin/env node
'use strict';
/**
 * design/beta/atlas/tools/density-probe.js — evidence for the panel's supplementary criterion S1
 * (information density and statistics noise). Non-judging: it measures what a sighted reader sees.
 *
 *   NODE_PATH=$(npm root -g) node design/beta/atlas/tools/density-probe.js --root <checkout> --out <dir>
 *
 * Surfaces: landing, the Japan hub, and for Tokyo and Cleveland the Atlas, Gallery and Guidebook views and a place
 * sheet. At 1440×900 and 390×844 it records, for the FIRST SCREEN only and for visible text only (screen-reader-only
 * text clipped to ≤ 1 px is skipped):
 *  - numbers: every number token, and the count phrases ("488 places", "33 sources", "No. 4 of 44", "x of N");
 *  - digitShare: digits as a share of all visible non-space characters;
 *  - cards: card-like elements on screen, and how many carry a sentence (≥ 40 characters of prose);
 *  - method: whether a "How we choose" / method / sources link is visible on the first screen, and anywhere on the page.
 * It writes DENSITY.md, density.json and one screenshot per surface and viewport. Same-origin only; tiles stubbed flat.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ROOT = path.resolve(arg('--root', '.'), 'beta');
const OUT = path.resolve(arg('--out', 'density'));
const SH = path.join(OUT, 'shots');
fs.mkdirSync(SH, { recursive: true });
const ORIGIN = 'https://cleo.local';
const VP = { d: { viewport: { width: 1440, height: 900 } }, m: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } };
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
// a flat 256×256 PNG (neutral land colour): the basemap is not judged here
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR42mP4//8/AAX+Av4N70a4AAAAAElFTkSuQmCC', 'base64');
const SURFACES = [
  ['landing', '/index.html'],
  ['hub-japan', '/Japan/index.html'],
  ['tokyo-atlas', '/cities/tokyo.html#view=atlas'],
  ['tokyo-gallery', '/cities/tokyo.html#view=gallery'],
  ['tokyo-guidebook', '/cities/tokyo.html#view=guidebook'],
  ['tokyo-sheet', '/cities/tokyo.html#view=atlas&p=senso-ji'],
  ['cleveland-atlas', '/cleveland.html#view=atlas'],
  ['cleveland-gallery', '/cleveland.html#view=gallery'],
  ['cleveland-guidebook', '/cleveland.html#view=guidebook'],
  ['cleveland-sheet', '/cleveland.html#view=atlas&p=west-side-market'],
];

(async () => {
  const browser = await chromium.launch();
  const rows = [];
  for (const [key, url] of SURFACES) for (const vk of ['d', 'm']) {
    const ctx = await browser.newContext(VP[vk]);
    await ctx.route('**/*', r => {
      const u = new URL(r.request().url());
      if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u.host)) return r.fulfill({ body: TILE, headers: { 'content-type': 'image/png' } });
      if (u.origin !== ORIGIN) return r.abort();
      let p = path.join(ROOT, decodeURIComponent(u.pathname)); if (p.endsWith('/')) p += 'index.html';
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
      r.fulfill({ body: fs.readFileSync(p), headers: { 'content-type': T[path.extname(p)] || 'application/octet-stream' } });
    });
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
    await page.goto(ORIGIN + url, { waitUntil: 'load' }).catch(e => errors.push('goto ' + e));
    await page.waitForTimeout(2500);
    const m = await page.evaluate(() => {
      const H = innerHeight, W = innerWidth;
      const shown = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; const r = e.getBoundingClientRect(); if ((r.width <= 1 || r.height <= 1) && (cs.overflow === 'hidden' || cs.clip !== 'auto')) return false; } return true; };
      const onScreen = r => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W;
      const texts = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { const t = n.textContent.replace(/\s+/g, ' ').trim(); if (!t) continue; const el = n.parentElement; if (!el || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName)) continue;
        const rg = document.createRange(); rg.selectNodeContents(n); const rs = [...rg.getClientRects()]; if (!rs.some(onScreen) || !shown(el)) continue; texts.push(t); }
      const all = texts.join(' · ');
      const nums = all.match(/\d[\d,.]*/g) || [];
      const phrases = [...new Set((all.match(/(?:No\.\s*)?\d[\d,]*(?:\s*[–-]\s*\d[\d,]*)?\s+(?:of\s+(?:all\s+)?\d[\d,]*\s+)?(?:places?|sources?|areas?|picks?|cities|guides?|countries|sights?|restaurants?|creators?|wards?|stops?|neighbourhoods?|regions?|in\s+[A-Z][\w-]*)/g) || []).map(s => s.trim()))];
      const chars = all.replace(/\s/g, ''); const digits = (chars.match(/\d/g) || []).length;
      const cardEls = [...document.querySelectorAll('li.pl, li.gc, li.ge, .card')].filter(e => onScreen(e.getBoundingClientRect()) && shown(e) && e.getBoundingClientRect().height > 40);   // Atlas li.pl, Gallery li.gc, Guidebook li.ge
      const cards = cardEls.filter(e => !cardEls.some(o => o !== e && o.contains(e)));   // outermost only
      const prose = e => (e.innerText || '').split(/\n+/).some(l => l.trim().length >= 40 && /[a-z]{3,} [a-z]{2,}/.test(l));
      const links = [...document.querySelectorAll('a, button')];
      const isMethod = a => /how we choose|our method|methodology|how this guide|coverage|about the sources/i.test(a.textContent || a.getAttribute('aria-label') || '');
      return { numbers: nums.length, numberSample: nums.slice(0, 25), countPhrases: phrases.slice(0, 20), countPhraseN: phrases.length,
        digitShare: chars.length ? +(100 * digits / chars.length).toFixed(1) : 0, visibleChars: chars.length,
        cards: cards.length, cardsWithSentence: cards.filter(prose).length,
        methodOnFirstScreen: links.some(a => isMethod(a) && onScreen(a.getBoundingClientRect()) && shown(a)), methodOnPage: links.some(isMethod) };
    });
    const shot = `${key}-${vk === 'd' ? 1440 : 390}.jpg`;
    await page.screenshot({ path: path.join(SH, shot), type: 'jpeg', quality: 72 });
    rows.push({ surface: key, vp: vk === 'd' ? 1440 : 390, url, shot: 'shots/' + shot, ...m, errors });
    process.stdout.write(`${key} ${vk} numbers ${m.numbers} phrases ${m.countPhraseN} digits ${m.digitShare}% cards ${m.cardsWithSentence}/${m.cards}\n`);
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'density.json'), JSON.stringify({ root: path.relative(process.cwd(), ROOT), rows }, null, 1));
  const md = ['# Information density: first-screen measurements (non-judging)', '',
    'Visible text only; screen-reader-only text is skipped. "Count phrases" are number-plus-noun strings such as "488 places", "33 sources" or "No. 4 of 44 in Taitō-ku".', '',
    '| surface | vp | number tokens | count phrases | digits % of text | cards with a sentence / cards | method link on first screen / on page | page errors |', '|---|---|---|---|---|---|---|---|',
    ...rows.map(r => `| ${r.surface} | ${r.vp} | ${r.numbers} | ${r.countPhraseN} | ${r.digitShare} | ${r.cardsWithSentence} / ${r.cards} | ${r.methodOnFirstScreen ? 'yes' : 'no'} / ${r.methodOnPage ? 'yes' : 'no'} | ${r.errors.length} |`),
    '', '## Count phrases seen on each first screen', '',
    ...rows.map(r => `- **${r.surface} ${r.vp}** (\`${r.shot}\`): ${r.countPhrases.length ? r.countPhrases.map(p => '"' + p + '"').join(', ') : 'none'}`)];
  fs.writeFileSync(path.join(OUT, 'DENSITY.md'), md.join('\n') + '\n');
  console.log('done', rows.length, 'rows');
})();
