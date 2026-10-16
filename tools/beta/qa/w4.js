#!/usr/bin/env node
/**
 * Beta QA — Wave 4 feature probe (design/beta/eval/W4-BRIEFS.md; ROUND-3 gaps #2–#9). QA lane.
 * Real Chromium (preinstalled; never `playwright install`), every off-origin request blocked, 390×844 and 1440×900.
 *   default   Atlas is the default view (no hash, no stored preference); Gallery-as-default stays reverted (FE-A)
 *   glyph     the Gallery switcher button doesn't use the heart glyph
 *   names     one name field with diacritics: "Kanda Myōjin" in Atlas, sheet, Guidebook and Gallery; never the folded
 *             spelling; an unaccented search (q=myojin) still finds it
 *   covers    Gallery: no two neighbouring grid covers share a composition; row covers use more than one motif
 *   motion    prefers-reduced-motion: 0 running animations/transitions after a save + a view switch; with motion on,
 *             nothing autoplays (no infinite animation after load)
 *   lazy      Guidebook: Tokyo initial DOM ≤ 3,000 nodes; contents lists every chapter; a deep link to the last place of
 *             the last chapter mounts and shows it
 *   weight    Tokyo default view transfer (gzip) < 2.0 MB
 *   changes   every place page links "last checked" to its "What changed" page; the page renders with 0 errors, axe 0
 *             serious/critical, no price/rating wording
 *   i18n      hreflang en + x-default; no language switcher shown (no reviewed locale yet)
 *   bars      Insights bar links ≥ 24 px tall
 * Usage: cd tools && node beta/qa/w4.js   Output: qa/beta-w4/w4.json (+ screenshots)
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const OUT = path.join(ROOT, 'qa', 'beta-w4');
fs.mkdirSync(OUT, { recursive: true });
const VP = {
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
};
function loadPlaywright() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) {
    try { return require(t); } catch (e) { /* next */ }
  }
  throw new Error('playwright not found');
}
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.xml': 'application/xml' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0].split('#')[0]));
      if (!f.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
      try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
      fs.readFile(f, (err, buf) => {
        if (err) { rsp.writeHead(404); return rsp.end('404'); }
        rsp.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); rsp.end(buf);
      });
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}
const BLOCKED_NET = /net::ERR_|Failed to load resource|ERR_BLOCKED|ERR_FAILED/;
let browser, base;
async function open(rel, vp, o = {}) {
  const ctx = await browser.newContext({ ...VP[vp], serviceWorkers: 'block', reducedMotion: o.motion ? 'no-preference' : 'reduce' });
  const page = await ctx.newPage();
  const st = { errors: [], bytes: 0, gz: 0, status: 0 };
  const origin = new URL(base).origin;
  await ctx.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith(origin) || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    return route.abort('blockedbyclient');
  });
  page.on('pageerror', e => st.errors.push('pageerror: ' + String(e.message || e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error' && !BLOCKED_NET.test(m.text())) st.errors.push(m.text().slice(0, 200)); });
  if (o.weigh) page.on('response', async r => { try { if (!r.url().startsWith(origin)) return; const b = await r.body(); st.bytes += b.length;
    st.gz += /\.(png|jpg|woff2)$/.test(r.url().split('?')[0]) ? b.length : zlib.gzipSync(b).length; } catch (e) { /* redirect / aborted */ } });
  const r = await page.goto(base + 'beta/' + rel + (o.hash || ''), { waitUntil: 'load', timeout: 45000 });
  st.status = r ? r.status() : 0;
  await page.waitForTimeout(o.settle || 800);
  return { ctx, page, st };
}
const shot = (page, name, full) => page.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 60, fullPage: !!full }).catch(() => {});
const R = { head: null, checks: [] };
function check(group, name, ok, evidence) {
  R.checks.push({ group, name, ok: !!ok, evidence });
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  [${group}] ${name}` + (evidence !== undefined ? ' = ' + JSON.stringify(evidence).slice(0, 280) : ''));
}
const visText = () => document.body.innerText;
const TOKYO = 'cities/tokyo.html';
const MAN = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'manifest.json'), 'utf8'));
const placePages = MAN.pages.filter(p => p.counts && p.kind === 'city' && (MAN.generated || []).includes(p.beta));
const tokyoData = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'places', fs.readdirSync(path.join(BETA, 'data', 'places'))
  .find(f => JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'places', f), 'utf8')).beta === TOKYO)), 'utf8'));

(async () => {
  const { chromium } = loadPlaywright();
  try { browser = await chromium.launch(); } catch (e) { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const srv = await serve(); base = 'http://127.0.0.1:' + srv.address().port + '/';
  try { R.head = require('child_process').execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim(); } catch (e) { /* no git */ }

  console.log('\n# default view + switcher glyph + i18n + weight');
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page, st } = await open(TOKYO, vp, { weigh: vp === 'mobile', settle: 1500 });
    const s = await page.evaluate(() => ({ view: document.documentElement.getAttribute('data-view'), def: window.Cleo && Cleo.view && Cleo.view.DEFAULT,
      glyph: (document.querySelector('[data-cleo-views] button[data-view="gallery"] use') || { getAttribute: () => null }).getAttribute('href'),
      hreflang: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map(l => l.getAttribute('hreflang')),
      langSwitch: [...document.querySelectorAll('[data-cleo-lang], [data-cleo-locale], select[name=lang]')].filter(e => e.offsetParent).length }));
    check('default', `${vp}: Atlas is the default (no hash, no stored preference)`, s.view === 'atlas' && s.def === 'atlas', s);
    check('glyph', `${vp}: Gallery switcher glyph is not the heart`, s.glyph && !/heart/.test(s.glyph), s.glyph);
    if (vp === 'mobile') {
      check('i18n', 'hreflang en + x-default; no language switcher shown', s.hreflang.includes('en') && s.hreflang.includes('x-default') && !s.langSwitch, s);
      check('weight', 'Tokyo default view transfer (gzip est.) < 2.0 MB', st.gz < 2.0e6, { gzipMB: +(st.gz / 1e6).toFixed(2), rawMB: +(st.bytes / 1e6).toFixed(2) });
    }
    check('default', `${vp}: 0 JS errors`, !st.errors.length, st.errors.slice(0, 3));
    await ctx.close();
  }

  console.log('\n# names with diacritics (one name field everywhere)');
  const kanda = tokyoData.places.find(p => /kanda-myojin/.test(p.id));
  for (const [where, hash] of [['atlas', ''], ['sheet', '#p=' + kanda.id], ['guidebook', '#view=guidebook&p=' + kanda.id], ['gallery', '#view=gallery']]) {
    const { ctx, page, st } = await open(TOKYO, 'desktop', { hash, settle: 1500 });
    const t = await page.evaluate(visText);
    check('names', `${where}: "Kanda Myōjin" shown, folded spelling never`, /Kanda Myōjin/.test(t) && !/Kanda Myojin/.test(t) && !st.errors.length, { accented: (t.match(/Kanda Myōjin/g) || []).length, folded: (t.match(/Kanda Myojin/g) || []).length, err: st.errors.slice(0, 2) });
    await ctx.close();
  }
  { const { ctx, page } = await open(TOKYO, 'mobile', { hash: '#q=myojin' });
    const n = await page.evaluate(id => { const c = document.getElementById('p-' + id); return { shown: !!(c && !c.hidden && !c.closest('[hidden]')), n: [...document.querySelectorAll('li.pl')].filter(x => !x.hidden).length }; }, kanda.id);
    check('names', 'unaccented search q=myojin finds Kanda Myōjin', n.shown, n); await ctx.close(); }
  { const t = fs.readFileSync(path.join(BETA, TOKYO), 'utf8');
    check('names', 'hero carries "Jōnan · Jōsai · Jōhoku"-style long vowels (no folded "Jonan")', !/\bJonan\b|\bJosai\b|\bJohoku\b/.test(t), { jonan: /Jōnan/.test(t) }); }

  console.log('\n# Gallery covers');
  for (const vp of ['desktop', 'mobile']) {
    const { ctx, page, st } = await open(TOKYO, vp, { hash: '#view=gallery', settle: 1800 });
    await page.evaluate(async () => { for (let y = 0; y < 6; y++) { window.scrollBy(0, innerHeight); await new Promise(r => setTimeout(r, 250)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(600);
    const s = await page.evaluate(() => {
      const comps = [...document.querySelectorAll('li.pl:not([hidden]):not(.pg-off) .pl-cover')].map(c => c.getAttribute('data-comp'));
      const adj = comps.filter((c, i) => i && c != null && c === comps[i - 1]).length;
      const rowCovers = [...document.querySelectorAll('.gc .cover')];
      const motifs = new Set(rowCovers.map(c => c.getAttribute('data-gl') + '|' + (c.querySelector('img,svg use') ? (c.querySelector('img') || {}).src || c.querySelector('use').getAttribute('href') : '')));
      return { grid: comps.length, adjSame: adj, rowCovers: rowCovers.length, motifs: motifs.size };
    });
    check('covers', `${vp}: no two neighbouring grid covers share a composition`, s.grid > 0 && s.adjSame === 0, s);
    check('covers', `${vp}: row covers use more than one motif`, s.rowCovers === 0 || s.motifs > 1, s);
    check('covers', `${vp}: 0 JS errors`, !st.errors.length, st.errors.slice(0, 3));
    await shot(page, `gallery-${vp}`);
    await ctx.close();
  }

  console.log('\n# motion');
  const RUNNING = () => document.getAnimations().filter(a => a.playState === 'running' && (a.effect && a.effect.getComputedTiming().duration > 20)).map(a => (a.animationName || a.transitionProperty || 'anim') + '@' + ((a.effect.target && a.effect.target.className && a.effect.target.className.baseVal !== undefined ? a.effect.target.className.baseVal : a.effect.target && a.effect.target.className) || ''));
  const INFINITE = () => document.getAnimations().filter(a => a.effect && a.effect.getComputedTiming().iterations === Infinity && a.playState === 'running').map(a => a.animationName || 'anim');
  for (const motion of [false, true]) {
    const { ctx, page, st } = await open(TOKYO, 'mobile', { motion, hash: '#view=gallery', settle: 2500 });
    const inf = await page.evaluate(INFINITE);
    const heart = page.locator('.heart:visible').first();
    let afterSave = [], afterSwitch = [];
    if (await heart.count()) { await heart.click(); await page.waitForTimeout(60); afterSave = await page.evaluate(RUNNING); }
    const cur = page.locator('[data-cleo-views] button[aria-pressed="true"]').first(); if (await cur.count()) { await cur.click(); await page.waitForTimeout(200); }
    const b = page.locator('[data-cleo-views] button[data-view="insights"]').first();
    if (await b.count() && await b.isVisible()) { await b.click(); await page.waitForTimeout(60); afterSwitch = await page.evaluate(RUNNING); }
    if (!motion) check('motion', 'reduced motion: nothing animates on save or view switch', !afterSave.length && !afterSwitch.length, { afterSave, afterSwitch });
    else check('motion', 'motion on: micro-interactions run (informational) and nothing autoplays', !inf.length, { autoplay: inf, afterSave: afterSave.slice(0, 4), afterSwitch: afterSwitch.slice(0, 4) });
    if (!motion) check('motion', 'reduced motion: nothing autoplays', !inf.length, inf);
    check('motion', `${motion ? 'motion' : 'reduced'}: 0 JS errors`, !st.errors.length, st.errors.slice(0, 3));
    await ctx.close();
  }

  console.log('\n# Guidebook lazy chapters');
  const lastArea = tokyoData.areas[tokyoData.areas.length - 1].id;
  const lastPlace = tokyoData.places.filter(p => p.a === lastArea).slice(-1)[0];
  for (const vp of ['mobile', 'desktop']) {
    const { ctx, page, st } = await open(TOKYO, vp, { hash: '#view=guidebook', settle: 1500 });
    const s = await page.evaluate(() => ({ dom: document.getElementsByTagName('*').length,
      toc: new Set([...document.querySelectorAll('.toc a[href]')].map(a => a.getAttribute('href'))).size, chapters: document.querySelectorAll('article.ch').length,
      entries: document.querySelectorAll('li.ge').length }));
    check('lazy', `${vp}: Tokyo Guidebook initial DOM ≤ 3,000`, s.dom <= 3000, s);
    check('lazy', `${vp}: contents lists every chapter (${tokyoData.areas.length})`, s.toc >= tokyoData.areas.length, s);
    check('lazy', `${vp}: 0 JS errors`, !st.errors.length, st.errors.slice(0, 3));
    await ctx.close();
    const d2 = await open(TOKYO, vp, { hash: '#view=guidebook&p=' + encodeURIComponent(lastPlace.id), settle: 1800 });
    const g = await d2.page.evaluate(id => { const e = document.getElementById('gb-' + id); const sh = document.querySelector('[role=dialog][aria-modal=true]:not([hidden])');
      return { mounted: !!e, sheet: sh ? sh.textContent.trim().slice(0, 50) : null }; }, lastPlace.id);
    check('lazy', `${vp}: deep link to the last place of the last chapter (${lastPlace.id})`, g.mounted || !!g.sheet, g);
    await d2.ctx.close();
  }

  console.log('\n# What changed pages');
  const changesDir = path.join(BETA, 'changes');
  const have = new Set(fs.existsSync(changesDir) ? fs.readdirSync(changesDir) : []);
  const linked = [], missing = [];
  for (const p of placePages) {
    const h = fs.readFileSync(path.join(BETA, p.beta), 'utf8');
    const m = h.match(/href="([^"]*changes\/[^"]+\.html)"[^>]*data-cleo-changes/);
    if (!m) { missing.push(p.beta + ' (no link)'); continue; }
    const target = path.normalize(path.join(path.dirname(path.join(BETA, p.beta)), m[1]));
    if (!fs.existsSync(target)) missing.push(p.beta + ' → ' + m[1]); else linked.push(target);
  }
  check('changes', `every place page (${placePages.length}) links "last checked" to an existing What changed page`, !missing.length, { linked: linked.length, missing: missing.slice(0, 5) });
  const AXE = fs.readFileSync(path.join(__dirname, 'vendor', 'axe.min.js'), 'utf8');
  const HONESTY = /(?:[$€£¥]\s?\d|\bprices?\b|\bratings?\b|\b\d(?:\.\d)?\s?stars?\b|\bbooking\b|\bopen now\b)/i;
  for (const rel of ['changes/tokyo.html', 'changes/cleveland.html', 'changes/wheeling.html']) {
    if (!fs.existsSync(path.join(BETA, rel))) { check('changes', rel + ' exists', false); continue; }
    for (const vp of ['mobile', 'desktop']) for (const scheme of vp === 'desktop' ? ['light', 'dark'] : ['light']) {
      const ctx = await browser.newContext({ ...VP[vp], serviceWorkers: 'block', colorScheme: scheme, reducedMotion: 'reduce' });
      const page = await ctx.newPage(); const errs = [];
      await ctx.route('**/*', r => r.request().url().startsWith(new URL(base).origin) ? r.continue() : r.abort());
      page.on('pageerror', e => errs.push(String(e.message).slice(0, 150)));
      const resp = await page.goto(base + 'beta/' + rel, { waitUntil: 'load' }); await page.waitForTimeout(500);
      await page.addScriptTag({ content: AXE });
      const ax = await page.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.filter(v => /serious|critical/.test(v.impact)).map(v => v.id + '×' + v.nodes.length));
      const t = await page.evaluate(visText);
      const hon = t.split('\n').map(l => l.replace(/No ratings, prices or (?:opening )?hours are shown[^.]*\.?|We don['’]t add ratings, (?:review counts, )?prices or opening hours of our own[.;]|Status source: .*/g, '')).filter(l => HONESTY.test(l)).slice(0, 2);   // stated gap + closure source (rule 4c)
      check('changes', `${rel} ${vp} ${scheme}: renders, 0 errors, axe 0 serious/critical, honest`, resp.status() === 200 && t.length > 200 && !errs.length && !ax.length && !hon.length, { len: t.length, errs, axe: ax, honesty: hon });
      if (rel === 'changes/tokyo.html' && scheme === 'light') await shot(page, `changes-tokyo-${vp}`);
      await ctx.close();
    }
  }

  console.log('\n# Insights bars');
  for (const rel of ['cleveland.html', TOKYO]) {
    const { ctx, page } = await open(rel, 'mobile', { hash: '#view=insights', settle: 1500 });
    const s = await page.evaluate(() => { const hs = [...document.querySelectorAll('svg.chart a')].map(a => Math.round(a.getBoundingClientRect().height)).filter(h => h > 0);
      return { links: hs.length, min: Math.min(...hs), under24: hs.filter(h => h < 24).length, table: !!document.querySelector('.chart-table, [data-cleo-table], details table, table') }; });
    check('bars', `${rel}: Insights bar links ≥ 24 px tall, table fallback present`, s.links > 0 && s.under24 === 0 && s.table, s);
    await ctx.close();
  }

  await browser.close(); srv.close();
  const fails = R.checks.filter(c => !c.ok).length;
  fs.writeFileSync(path.join(OUT, 'w4.json'), JSON.stringify(R, null, 1));
  console.log(`\n>>> ${R.checks.length - fails}/${R.checks.length} PASS, ${fails} FAIL on ${R.head} → qa/beta-w4/w4.json`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
