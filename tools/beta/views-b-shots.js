#!/usr/bin/env node
'use strict';
/**
 * tools/beta/views-b-shots.js — FE-B W3 screenshots + browser measurements for the Guidebook and Insights views.
 *
 *   node tools/beta/views-b-shots.js [--out design/beta/eval/w3/fe-b]
 *
 * Serves beta/ from disk (route.fulfill); every off-origin request is aborted, so each shot also proves no CDN.
 * Until FE-A's switcher (A-01) mounts views itself, the harness does what the registry will do: it sets
 * html[data-view], gives each module a host before .split, and calls mount() from window.CleoViewQueue / Cleo.views.
 * Measures: entries / index == N, smallest rendered chart text at 390 px, print preview (all N entries + every
 * source URL present, chrome hidden), 0 JS errors. Writes <city>-<view>[-sN]-<m|d>.jpg and views-b-metrics.json.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/eval/w3/fe-b'));
const BASE = 'https://cleo.local/';
const M = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const D = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const CITIES = [['tokyo', 'beta/cities/tokyo.html'], ['cleveland', 'beta/cleveland.html']];

async function page(ctx, errs) {
  const p = await ctx.newPage();
  await p.route('**/*', r => {
    const u = new URL(r.request().url());
    if (u.origin + '/' !== BASE) return r.abort();
    const f = path.join(ROOT, decodeURIComponent(u.pathname));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({ status: 404, body: '' });
    r.fulfill({ status: 200, body: fs.readFileSync(f), contentType: TYPES[path.extname(f)] || 'application/octet-stream' });
  });
  p.on('pageerror', e => errs.push(String(e)));
  return p;
}
async function mountView(p, view) {
  return p.evaluate(async v => {
    const d = document;
    d.documentElement.setAttribute('data-view', v);
    await new Promise(res => { const s = d.createElement('script'); s.src = Cleo.root + 'assets/js/' + v + '.js'; s.onload = res; d.head.appendChild(s); });
    const def = (Cleo.views && Cleo.views.get && Cleo.views.get(v)) || (window.CleoViewQueue || []).filter(x => x[0] === v).map(x => x[1])[0];
    const host = d.createElement('section'); host.id = 'cleo-view-' + v;
    const split = d.querySelector('.split'); split.parentNode.insertBefore(host, split);   // the canonical list stays (FE-A decides what a view hides)
    [...d.querySelectorAll('.masthead,.about,[data-cleo-rail],.railbar')].forEach(e => { e.hidden = true; });
    await def.mount(host, {});
    return { entries: host.querySelectorAll('li.ge').length, index: host.querySelectorAll('li.ixi').length, N: JSON.parse(d.getElementById('cleo-city').textContent).total };
  }, view);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  let metrics = {}; try { metrics = JSON.parse(fs.readFileSync(path.join(OUT, 'views-b-metrics.json'), 'utf8')); } catch (e) {}   // --landing-only keeps the rest
  for (const [key, url] of (process.argv.includes('--landing-only') ? [] : CITIES)) {
    for (const [vp, opt] of [['m', M], ['d', D]]) {
      for (const view of ['guidebook', 'insights']) {
        const errs = [], ctx = await browser.newContext(opt), p = await page(ctx, errs);
        await p.goto(BASE + url, { waitUntil: 'load' });
        const r = await mountView(p, view);
        await p.waitForTimeout(300);
        const tag = `${key}-${view}`;
        await p.screenshot({ path: path.join(OUT, `${tag}-${vp}.jpg`), type: 'jpeg', quality: 70 });
        // a second screen: the first chapter's entries / the chart grid
        const y = await p.evaluate(v => { const el = document.querySelector(v === 'guidebook' ? '.view-guidebook .gs' : '.view-insights .igrid'); return el ? el.getBoundingClientRect().top + scrollY - 80 : 0; }, view);
        await p.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y); await p.waitForTimeout(600);
        await p.screenshot({ path: path.join(OUT, `${tag}-s1-${vp}.jpg`), type: 'jpeg', quality: 70 });
        const m = Object.assign({}, r);
        if (view === 'insights') {
          m.minChartPx = await p.evaluate(() => {
            let min = 99;
            document.querySelectorAll('.view-insights svg.chart').forEach(svg => {
              if (!svg.getBoundingClientRect().width) return;
              const k = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
              svg.querySelectorAll('text').forEach(t => { min = Math.min(min, parseFloat(getComputedStyle(t).fontSize) * k); });
            });
            return Math.round(min * 10) / 10;
          });
          // keyboard: bar links are focusable with a visible ring
          m.barLinks = await p.evaluate(() => document.querySelectorAll('.view-insights svg.chart a[href]').length);
          await p.evaluate(() => scrollTo(0, document.querySelector('.view-insights .icard:nth-child(5)').getBoundingClientRect().top + scrollY - 60));
          await p.waitForTimeout(100);
          await p.screenshot({ path: path.join(OUT, `${tag}-s2-${vp}.jpg`), type: 'jpeg', quality: 70 });
        }
        if (view === 'guidebook' && vp === 'd') {
          await p.emulateMedia({ media: 'print' });
          m.print = await p.evaluate(() => {
            const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
            const book = document.querySelector('.view-guidebook');
            const urls = new Set([...book.querySelectorAll('#gb-sources a[href]')].filter(vis).map(a => a.href));
            return { entries: [...book.querySelectorAll('li.ge')].filter(vis).length, sourceUrls: urls.size,
              tocHidden: !vis(book.querySelector('.toc')), saveHidden: [...book.querySelectorAll('.ge-save')].every(b => !vis(b)) };
          });
          m.print.citedUrls = await p.evaluate(() => Cleo.pageData(document.getElementById('main').getAttribute('data-city')).then(d => new Set(d.places.flatMap(x => (x.s || []).map(s => s[1]).filter(u => /^https?:/.test(u || '')))).size));
          await p.evaluate(() => scrollTo(0, 0));
          await p.screenshot({ path: path.join(OUT, `${tag}-print-${vp}.jpg`), type: 'jpeg', quality: 70 });
          await p.evaluate(() => document.getElementById('gb-sources').scrollIntoView());
          await p.screenshot({ path: path.join(OUT, `${tag}-print-sources-${vp}.jpg`), type: 'jpeg', quality: 70 });
        }
        m.errors = errs;
        metrics[`${tag}-${vp}`] = m;
        console.log(tag, vp, JSON.stringify(m));
        await ctx.close();
      }
    }
  }
  // hub entry points (B-04)
  for (const [vp, opt] of [['m', M], ['d', D]]) {
    const errs = [], ctx = await browser.newContext(opt), p = await page(ctx, errs);
    await p.goto(BASE + 'beta/Japan/index.html', { waitUntil: 'load' });
    const y = await p.evaluate(() => { const el = document.querySelector('.dest-views'); return el ? el.getBoundingClientRect().top + scrollY - 420 : 0; });
    await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(150);
    await p.screenshot({ path: path.join(OUT, `hub-japan-viewlinks-${vp}.jpg`), type: 'jpeg', quality: 70 });
    metrics[`hub-japan-${vp}`] = { links: await p.evaluate(() => document.querySelectorAll('a[data-view-link]').length),
      minTarget: await p.evaluate(() => Math.min(...[...document.querySelectorAll('a[data-view-link]')].map(a => a.getBoundingClientRect().height))), errors: errs };
    await ctx.close();
  }
  // landing editorial rail (ROUND-2 gap #4)
  for (const [vp, opt] of [['m', M], ['d', D]]) {
    const errs = [], ctx = await browser.newContext(opt), p = await page(ctx, errs);
    await p.goto(BASE + 'beta/index.html', { waitUntil: 'load' }); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, `landing-editorial-${vp}.jpg`), type: 'jpeg', quality: 70 });
    const y = await p.evaluate(() => { const el = document.querySelector('nav.rail.editorial'); return el ? el.getBoundingClientRect().top + scrollY - 140 : 0; });
    await p.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, `landing-editorial-s1-${vp}.jpg`), type: 'jpeg', quality: 70 });
    metrics[`landing-editorial-${vp}`] = { tiles: await p.evaluate(() => document.querySelectorAll('nav.rail.editorial .rail-i').length),
      railTop: await p.evaluate(() => Math.round(document.querySelector('nav.rail.editorial').getBoundingClientRect().top + scrollY)),
      minTarget: await p.evaluate(() => Math.min(...[...document.querySelectorAll('nav.rail.editorial .rail-i')].map(a => a.getBoundingClientRect().height))), errors: errs };
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'views-b-metrics.json'), JSON.stringify(metrics, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
