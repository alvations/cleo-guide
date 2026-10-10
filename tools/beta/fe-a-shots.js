#!/usr/bin/env node
'use strict';
/**
 * tools/beta/fe-a-shots.js — FE-A lane screenshots + measurements for the city and saved pages (W2) at 390×844
 * (DPR 2, touch) and 1440×900, against the generated beta/ on disk.
 *
 *   NODE_PATH=$(npm root -g) node tools/beta/fe-a-shots.js [--out design/beta/eval/w2/fe-a] [--tag w2] [--only id,id]
 *
 * Same-origin files are served from disk; map tiles are answered with a flat paper-coloured tile so Leaflet
 * mounts (no tile host is contacted); anything else off-origin is aborted, proving the page needs no CDN.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/eval/w2/fe-a'));
const TAG = arg('--tag', 'w2');
const ONLY = (arg('--only', '') || '').split(',').filter(Boolean);
const BASE = 'https://cleo.local/';
const M = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const D = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
// 1×1 PNG (#ECE6DA) stretched by Leaflet to 256 px: stands in for OSM/Esri tiles without contacting them.
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN482YJAAT0Aqt4WyN2AAAAAElFTkSuQmCC', 'base64');

const SAVED = ['tokyo/senso-ji', 'tokyo/kanda-myojin', 'tokyo/ghibli-museum-mitaka', 'cleveland/west-side-market', 'tokyo/nakano-broadway'];
// W3 (views): --w3 shoots the Gallery / Atlas / sheet sets instead (default view = Gallery)
const W3 = [
  { id: 'gallery', url: 'beta/cities/tokyo.html' },
  { id: 'gallery-rows', url: 'beta/cities/tokyo.html', scroll: 1, wait: 500 },
  { id: 'gallery-grid', url: 'beta/cities/tokyo.html#pg=3', wait: 400 },
  { id: 'gallery-cle', url: 'beta/cleveland.html' },
  { id: 'gallery-lens', url: 'beta/cities/tokyo.html#c=ANIME', wait: 400 },
  { id: 'atlas', url: 'beta/cities/tokyo.html#view=atlas', wait: 900 },
  { id: 'atlas-cle', url: 'beta/cleveland.html#view=atlas&a=DT', wait: 900 },
  { id: 'atlas-full', url: 'beta/cities/tokyo.html#view=atlas', click: '[data-detent-cycle]', mobileOnly: 1, wait: 600 },
  { id: 'exp', url: 'beta/cities/tokyo.html#p=kanda-myojin', wait: 700 },
  { id: 'sheet-atlas', url: 'beta/cities/tokyo.html#view=atlas&p=kanda-myojin', wait: 900 },
  { id: 'guidebook', url: 'beta/cities/tokyo.html#view=guidebook', wait: 1200 },
];
const SETS = process.argv.includes('--w3') ? W3 : [
  { id: 'tokyo', url: 'beta/cities/tokyo.html' },
  { id: 'tokyo-s1', url: 'beta/cities/tokyo.html', scroll: 1 },
  { id: 'cleveland', url: 'beta/cleveland.html' },
  { id: 'cleveland-food', url: 'beta/cleveland.html#mode=food' },
  { id: 'pittsburgh', url: 'beta/cities/pittsburgh.html' },
  { id: 'sheet', url: 'beta/cities/tokyo.html#p=kanda-myojin', wait: 600 },
  { id: 'sheet-cle', url: 'beta/cleveland.html', clickFirst: 'li.pl .pl-n a', wait: 600 },
  { id: 'foryou', url: 'beta/cities/tokyo.html', click: '[data-cleo-foryou]', wait: 300 },
  { id: 'foryou-on', url: 'beta/cities/tokyo.html', store: { interests: ['pop', 'art'] }, wait: 300 },
  { id: 'day', url: 'beta/cities/tokyo.html#day=TAITO', wait: 700 },
  { id: 'day-cle', url: 'beta/cleveland.html', clickFirst: '[data-cleo-day]', wait: 700 },
  { id: 'map', url: 'beta/cities/tokyo.html#map=1', wait: 900, mobileOnly: 1 },
  { id: 'map-pin', url: 'beta/cities/tokyo.html#map=1', wait: 900, pin: 1, mobileOnly: 1 },
  { id: 'near', url: 'beta/cities/tokyo.html', near: [35.7148, 139.7967], wait: 600 },
  { id: 'saved', url: 'beta/saved.html', saved: SAVED, wait: 900 },
  { id: 'saved-shared', url: 'beta/saved.html#list=tokyo:senso-ji,kanda-myojin;cleveland:west-side-market', wait: 900 },
];

async function measure(page) {
  return page.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const small = [];
    for (const el of document.querySelectorAll('a[href], button, input, select, summary, [role=button]')) {
      if (!vis(el) || el.classList.contains('skip') || (el.tagName === 'A' && el.closest('p') && !el.classList.contains('btn'))) continue;
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight * 3) continue;
      if (r.width < 43.5 || r.height < 43.5) small.push(`${el.tagName.toLowerCase()}.${el.className && el.className.baseVal === undefined ? el.className : ''} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    const first = document.querySelector('li.pl:not([hidden])');
    const ft = first ? first.getBoundingClientRect().top + scrollY : null;
    const ctl = [...document.querySelectorAll('a[href], button, input, select')].filter(vis).filter(el => { const r = el.getBoundingClientRect(); return r.top + scrollY < ft && r.left < innerWidth && r.right > 0 && !el.closest('[data-cleo-shell="topbar"], .sitebar, .skip'); }).length;
    const mp = document.querySelector('.mappane'), mr = mp && vis(mp) ? mp.getBoundingClientRect() : null;
    const poi = document.querySelector('#cleo-poi:not([hidden])');
    let up = 0, all = 0; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { const n = w.currentNode, t = n.textContent.trim(); if (!t || !n.parentElement || !vis(n.parentElement)) continue; all++; const tt = getComputedStyle(n.parentElement).textTransform; if (tt === 'uppercase' || (t.length > 3 && t === t.toUpperCase() && /[A-Z]{3}/.test(t))) up++; }
    return {
      overflowX: document.documentElement.scrollWidth - innerWidth, firstCardTop: ft, controlsAboveFirstCard: ctl,
      mapWidthPct: mr ? Math.round(mr.width / innerWidth * 100) : null, poiPct: poi ? Math.round(poi.getBoundingClientRect().height / innerHeight * 100) : null,
      tapUnder44: small.length, tapUnder44List: small.slice(0, 8), uppercasePct: all ? +(up / all * 100).toFixed(1) : 0,
      dom: document.getElementsByTagName('*').length,
    };
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const metrics = {};
  for (const [vk, vp] of [['m', M], ['d', D]]) {
    for (const s of SETS) {
      if (ONLY.length && !ONLY.includes(s.id)) continue;
      if (s.mobileOnly && vk === 'd') continue;
      const ctx = await browser.newContext(Object.assign({ reducedMotion: 'reduce' }, vp, s.near ? { geolocation: { latitude: s.near[0], longitude: s.near[1] }, permissions: ['geolocation'] } : {}));
      let off = 0;
      await ctx.route('**/*', route => {
        const u = new URL(route.request().url());
        if (/tile\.openstreetmap\.org|arcgisonline\.com/.test(u.host)) return route.fulfill({ body: TILE, headers: { 'content-type': 'image/png' } });
        if (u.origin + '/' !== BASE) { off++; return route.abort(); }
        const p = path.join(ROOT, decodeURIComponent(u.pathname));
        if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return route.fulfill({ status: 404, body: 'not found' });
        return route.fulfill({ body: fs.readFileSync(p), headers: { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' } });
      });
      const seed = Object.assign({}, s.store || {}, s.saved ? { saved: Object.fromEntries(s.saved.map((r, i) => [r, { t: 1760000000000 + i }])), been: { 'tokyo/senso-ji': 1 } } : {});
      await ctx.addInitScript(o => { try { for (const k in o) localStorage.setItem('cleo:v1:' + k, JSON.stringify(o[k])); } catch (e) {} }, seed);
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(BASE + s.url, { waitUntil: 'load' });
      await page.waitForTimeout(400);
      if (s.clickFirst) await page.click(s.clickFirst + ' >> nth=0');
      if (s.click) await page.click(s.click + ' >> visible=true >> nth=0');
      if (s.near) { await page.click('[data-cleo-near] >> visible=true >> nth=0').catch(() => {}); }
      if (s.pin) await page.evaluate(() => { const m = document.querySelector('.leaflet-interactive'); if (m) m.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
      if (s.scroll) await page.evaluate(n => window.scrollTo(0, innerHeight * n), s.scroll);
      await page.waitForTimeout(s.wait || 200);
      const m = await measure(page);
      m.jsErrors = errors; m.offOriginAborted = off;
      metrics[`${s.id}-${vk}`] = m;
      await page.screenshot({ path: path.join(OUT, `${TAG}-${s.id}-${vk}.jpg`), type: 'jpeg', quality: 70 });
      await ctx.close();
    }
  }
  await browser.close();
  const mf = path.join(OUT, `${TAG}-metrics.json`);
  let prev = {}; try { prev = JSON.parse(fs.readFileSync(mf, 'utf8')); } catch (e) {}
  fs.writeFileSync(mf, JSON.stringify(Object.assign(prev, metrics), null, 1));
  for (const [k, m] of Object.entries(metrics)) console.log(k.padEnd(20), `1st=${m.firstCardTop} ctl=${m.controlsAboveFirstCard} map=${m.mapWidthPct}% poi=${m.poiPct}% tap<44=${m.tapUnder44} up=${m.uppercasePct}% ovX=${m.overflowX} dom=${m.dom} err=${m.jsErrors.length}${m.jsErrors.length ? ' ' + m.jsErrors[0].slice(0, 120) : ''}`);
})();
