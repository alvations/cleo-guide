#!/usr/bin/env node
'use strict';
/**
 * tools/beta/offline-check.js — B-40 / M3-01 evidence: a visited city reloads with NO network. Platform-owned.
 *
 *   node tools/beta/offline-check.js [page …]     (npm run beta:offline; default: cities/tokyo.html cleveland.html)
 *
 * For each page and each viewport (390×844, 1440×900): serve the repo on a fresh port, open the city page FIRST
 * (no landing visit — the worker installs during this visit), wait for core.js's `cleo:offline` ("cached"), then
 * KILL the server (not just emulated offline: a service worker's own fetches can bypass emulation) and reload.
 * Passes when the reload renders the page from cache with every place reachable ("All" → N cards), a deep link
 * opens, the saved page loads, and a never-visited city redirects to the cached landing with the offline banner.
 * Screenshots go to design/beta/eval/w2/platform/offline-*.jpg. Needs Playwright + Chromium; skips (exit 0) without.
 */
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'design/beta/eval/w2/platform');
const sleep = ms => new Promise(r => setTimeout(r, ms));
function loadPlaywright() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) {
    try { return require(t); } catch (e) { /* next */ }
  }
  return null;
}

(async () => {
  const PW = loadPlaywright();
  if (!PW) { console.log('>>> SKIP — Playwright not available'); return; }
  const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['cities/tokyo.html', 'cleveland.html'];
  let browser; try { browser = await PW.chromium.launch(); } catch (e) { browser = await PW.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  fs.mkdirSync(OUT, { recursive: true });
  let fails = 0, port = 8830;
  for (const pg of pages) {
    const html = fs.readFileSync(path.join(ROOT, 'beta', pg), 'utf8');
    const total = (html.match(/<li class="pl[ "]/g) || []).length;
    const first = (/<li class="pl[ "][^>]*id="p-([^"]+)"/.exec(html.split('data-cleo-defer')[1] || html) || [])[1];
    for (const [w, h, tag] of [[390, 844, 'm'], [1440, 900, 'd']]) {
      const srv = spawn('python3', ['-m', 'http.server', String(++port), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
      await sleep(900);
      const U = `http://127.0.0.1:${port}/beta/`;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'allow', reducedMotion: 'reduce' });
      const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
      await p.route(u => !u.href.startsWith(U.slice(0, -6)), r => r.abort());          // nothing off-origin, ever
      await p.goto(U + pg, { waitUntil: 'load' });
      const cached = await p.evaluate(() => new Promise(ok => { document.addEventListener('cleo:offline', e => ok(e.detail)); setTimeout(() => ok(null), 15000); }));
      srv.kill(); await sleep(400); await ctx.setOffline(true);
      await p.reload({ waitUntil: 'load' }); await sleep(700);
      const shot = path.join(OUT, `offline-${pg.replace(/\W+/g, '-').replace(/-html$/, '')}-${tag}.jpg`);
      await p.screenshot({ path: shot, type: 'jpeg', quality: 70 });
      const r = await p.evaluate(() => ({ title: document.title, banner: !!document.querySelector('.banner.offline') }));
      await p.evaluate(() => { const a = document.querySelector('[data-mode="all"]'); if (a) a.click(); }); await sleep(250);
      r.cards = await p.evaluate(() => document.querySelectorAll('li.pl').length);
      if (first) { await p.evaluate(id => { location.hash = '#p=' + id; }, first); await sleep(400); r.deep = await p.evaluate(id => !!document.querySelector('#p-' + id + '.is-target'), first); } else r.deep = true;
      await p.goto(U + 'saved.html'); r.saved = await p.evaluate(() => document.documentElement.getAttribute('data-cleo-page'));
      const other = pg.includes('kyoto') ? 'cities/osaka.html' : 'cities/kyoto.html';
      await p.goto(U + other); r.unvisited = await p.evaluate(() => location.pathname.replace(/^.*\/beta\//, '') + (document.querySelector('.banner.offline') ? ' +banner' : ''));
      const ok = cached && cached.ok > 0 && r.cards === total && r.deep && r.saved === 'saved' && /^index\.html \+banner$/.test(r.unvisited) && errs.length === 0;
      if (!ok) fails++;
      console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${pg} ${w}px — cached ${cached ? cached.ok + '/' + cached.n : 'none'} on first visit; offline reload "${r.title}": ${r.cards}/${total} places, deep link ${r.deep}, saved ${r.saved}, unvisited → ${r.unvisited}, errors ${errs.length} · ${path.relative(ROOT, shot)}`);
      await ctx.close();
    }
  }
  await browser.close();
  console.log(fails ? `>>> FAIL — ${fails} offline check(s) failed` : '>>> PASS — visited cities reload offline with every place reachable (B-40)');
  process.exit(fails ? 1 : 0);
})();
