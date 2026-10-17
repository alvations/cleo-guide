#!/usr/bin/env node
// "Too many blanks" audit (FE-B surfaces): media slots without a photo in the first screen and among the first 24 slots,
// at 390 and 1440, light. A slot is a card's media box or a cover (.card-media, .cover, .gcover, chapter photos, Insights
// covers); it is "photo" when it holds a loaded <img> (naturalWidth > 0) or a CSS url() background, "art" when it holds a
// motif / glyph image or SVG art, else "blank". A blank whose only text is one bare word is listed (word). Needs:
// python3 -m http.server 8765 -d <repo>. Run from tools/: node beta/feb-blanks.js [out.json]
'use strict';
const { chromium } = require('playwright'), fs = require('fs');
const PAGES = ['index.html', 'Japan/index.html', 'Singapore/index.html', 'Vietnam/index.html', 'changes/tokyo.html',
  'cities/tokyo.html#view=guidebook', 'cleveland.html#view=guidebook', 'Singapore/punggol.html#view=guidebook',
  'cities/tokyo.html#view=insights', 'cleveland.html#view=insights', 'Singapore/punggol.html#view=insights'];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }), out = [];
  for (const pg of PAGES) for (const [w, h] of [[390, 844], [1440, 900]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'block' });
    await c.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
    const p = await c.newPage(); await p.goto('http://127.0.0.1:8765/beta/' + pg); await p.waitForTimeout(1800);
    // load every lazy image in the first 24 slots (scroll through once, then back)
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight && y < 9000; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); await new Promise(r => setTimeout(r, 500)); });
    const r = await p.evaluate(() => {
      const H = innerHeight, sel = '.card-media, .cover, .gcover, .ch-photo, .ch-cover, figure.cover, .ix-cover';
      const slots = [...document.querySelectorAll(sel)].filter(e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 20 && r.height > 20 && cs.display !== 'none' && cs.visibility !== 'hidden' && !e.parentElement.closest(sel); });
      const kind = e => { const im = [...e.querySelectorAll('img')]; if (im.some(i => i.naturalWidth > 0 && !/motif|glyph|g-art|ico/.test(i.className + ' ' + i.src))) return 'photo';
        if ([e, ...e.querySelectorAll('*')].some(x => /url\(/.test(getComputedStyle(x).backgroundImage) && !/motif|glyph/.test(getComputedStyle(x).backgroundImage))) return 'photo';
        if (im.some(i => i.naturalWidth > 0) || e.querySelector('svg, .g-art, .motif')) return 'art'; return 'blank'; };
      const rows = slots.map(e => { const r = e.getBoundingClientRect(), k = kind(e), txt = (e.textContent || '').trim();
        return { k, top: Math.round(r.top + scrollY), first: r.top < H && r.bottom > 0, w: Math.round(r.width), h: Math.round(r.height), word: k !== 'photo' && txt && !/\s/.test(txt) ? txt : '', cls: e.className.toString().slice(0, 30) }; });
      const f24 = rows.slice(0, 24), fs = rows.filter(x => x.first), n = (l, k) => l.filter(x => x.k === k).length;
      return { slots: rows.length, first: { n: fs.length, photo: n(fs, 'photo'), art: n(fs, 'art'), blank: n(fs, 'blank') }, first24: { n: f24.length, photo: n(f24, 'photo'), art: n(f24, 'art'), blank: n(f24, 'blank') },
        words: [...new Set(rows.slice(0, 24).filter(x => x.word).map(x => x.word))].slice(0, 8), bigBlank: f24.filter(x => x.k === 'blank' && x.w >= innerWidth * 0.8).length, sample: f24.filter(x => x.k !== 'photo').slice(0, 3).map(x => x.cls + ' ' + x.w + 'x' + x.h) };
    });
    out.push({ pg, vp: `${w}x${h}`, ...r });
    console.log(`${pg.padEnd(38)} ${w}  slots ${String(r.slots).padStart(3)}  first screen ${r.first.photo}p/${r.first.art}a/${r.first.blank}b  first24 ${r.first24.photo}p/${r.first24.art}a/${r.first24.blank}b  full-bleed blank ${r.bigBlank}${r.words.length ? '  words: ' + r.words.join(', ') : ''}${r.sample.length ? '  e.g. ' + r.sample.join(' | ') : ''}`);
    await c.close();
  }
  await b.close(); if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
})();
