#!/usr/bin/env node
/**
 * QA acceptance probe (2026-10-17): PERF-08 rows (a)/(b) restated for `Cleo.defer.lensPage` (the Gallery pager builds only
 * the lens's current page, the other pages stay stubs), and the perf08-regress QC-26 row read as the lens count.
 * The flag is switched on at runtime before the lens is applied, so this runs before platform flips the default.
 *
 * Ground truth F = the lens's places as `#view=gallery&<lens>&all=1` shows them with lensPage off (one page, every card).
 * With lensPage on, per page × lens × viewport:
 *   1. the counts line ("Showing N of …") reads |F|;
 *   2. paging page 1 … n shows every id of F exactly once, each a real card (li.pl, visible) on its page; nothing outside F;
 *   3. search (#cleo-filter) finds a match that sits on the last page;
 *   4. `#p=<id>` of a last-page match opens its sheet;
 *   5. print (beforeprint) builds every match of F as a card;
 *   6. "Keep offline" (Cleo.offline.urls) carries the page's places JSON, which holds every match.
 * QC-26 (Atlas, FE-1 shed() paging): a cold `#view=atlas&a=<area>&p=<first>` reads "1 of N" with N == the area's lens
 * count, and paging the Atlas list reaches all N places, each once.
 * Usage (from tools/): node beta/qa/lenspage-accept.js   (exit 1 on any FAIL)
 */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
let chromium; for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright']) { try { ({ chromium } = require(t)); break; } catch (e) { /* next */ } }
const ROOT = path.resolve(__dirname, '..', '..', '..');
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const PNG1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const VP = { phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, desktop: { viewport: { width: 1440, height: 900 } } };
const CASES = [['cities/tokyo.html', 't=1'], ['cities/tokyo.html', 'mode=food'], ['cleveland.html', 't=1']];
const ATLAS = [['cities/tokyo.html', 'CYD', 'imperial-palace-east-gardens'], ['cleveland.html', 'DT', 'soldiers-and-sailors-monument']];
let fails = 0; const R = [];
const check = (name, ok, ev) => { R.push({ name, ok, ev }); if (!ok) fails++; console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}` + (ev !== undefined ? ' = ' + JSON.stringify(ev).slice(0, 300) : '')); };
const VIS = () => [...document.querySelectorAll('li.pl')].filter(c => !c.hidden && !c.closest('[hidden]') && !c.classList.contains('ms-out') && !c.classList.contains('pg-off') && getComputedStyle(c).display !== 'none' && c.getBoundingClientRect().height > 0).map(c => c.id.slice(2));

const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
srv.listen(0, '127.0.0.1', async () => {
  const origin = 'http://127.0.0.1:' + srv.address().port, b = await chromium.launch();
  const page = async (vp, url, lensPage) => {
    const ctx = await b.newContext({ ...VP[vp], reducedMotion: 'reduce', serviceWorkers: 'block' }), p = await ctx.newPage(); const errs = [];
    await p.route('**/*', r => { const u = r.request().url(); if (u.startsWith(origin)) return r.continue(); if (r.request().resourceType() === 'image') return r.fulfill({ status: 200, contentType: 'image/png', body: PNG1 }); return r.abort(); });
    p.on('pageerror', e => errs.push(String(e.message || e).slice(0, 120)));
    const [rel, hash] = url.split('#');
    await p.goto(origin + '/beta/' + rel + (lensPage ? '#view=gallery' : '#' + hash), { waitUntil: 'load' }); await p.waitForTimeout(1500);
    if (lensPage) { await p.evaluate(h => { Cleo.defer.lensPage = true; location.hash = '#' + h; }, hash); await p.waitForTimeout(1500); }
    return { ctx, p, errs };
  };
  for (const vp of ['desktop', 'phone']) for (const [rel, lens] of CASES) {
    const tag = `${rel} ${vp} ${lens}`;
    // ground truth: lensPage off, every match on one page
    let s = await page(vp, `${rel}#view=gallery&${lens}&all=1`, false);
    const F = await s.p.evaluate(VIS); await s.ctx.close();
    // lensPage on
    s = await page(vp, `${rel}#view=gallery&${lens}`, true);
    const st = await s.p.evaluate(() => ({ on: !!Cleo.defer.lensPage, line: (document.querySelector('.pg-line, #cleo-shown') || {}).textContent || '', built: document.querySelectorAll('li.pl').length }));
    const n = +((/Showing ([\d,]+)/.exec(st.line) || [])[1] || '0').replace(/,/g, '');
    // (0) guard (platform, 2026-10-17): the flag must actually change what is built. When PERF-22 parked the code, setting
    // the flag was a no-op and every row passed against stamp-everything. With F spanning more than one page, some matches
    // must still be stubs (not in the DOM) at load
    const builtF = await s.p.evaluate(F => F.filter(id => document.getElementById('p-' + id)).length, F);
    const pagesAtLoad = await s.p.evaluate(() => { const b = [...document.querySelectorAll('.g-pager [aria-label^="Page "]')].pop(); return b ? +/of (\d+)/.exec(b.getAttribute('aria-label'))[1] : 1; });
    check(`${tag}: (0) lensPage is really on — matches built at load < F when F spans pages`, pagesAtLoad < 2 || builtF < F.length, { builtF, F: F.length, pages: pagesAtLoad });
    check(`${tag}: (1) the counts line reads F (${F.length})`, st.on && n === F.length, { line: st.line.slice(0, 60), F: F.length, builtAtLoad: st.built });
    const seen = [], pages = await s.p.evaluate(() => { const b = [...document.querySelectorAll('.g-pager [aria-label^="Page "]')].pop(); return b ? +/of (\d+)/.exec(b.getAttribute('aria-label'))[1] : 1; });
    let notCard = 0;
    for (let k = 1; k <= pages; k++) {
      if (k > 1) { await s.p.evaluate(k => { const b = document.querySelector(`.g-pager [data-pg="${k}"][aria-label^="Page "]`) || document.querySelector('.g-pager [aria-label="Next page"]'); b && b.click(); }, k); await s.p.waitForTimeout(600); }
      const ids = await s.p.evaluate(VIS); seen.push(...ids);
      notCard += await s.p.evaluate(ids => ids.filter(id => { const c = document.getElementById('p-' + id); return !c || !c.querySelector('.pl-n, .gc-n, a'); }).length, ids);
    }
    const uniq = new Set(seen), Fs = new Set(F), missing = F.filter(i => !uniq.has(i)), extra = [...uniq].filter(i => !Fs.has(i));
    check(`${tag}: (2) paging ${pages} pages shows every match once, each a real card`, !missing.length && !extra.length && seen.length === uniq.size && !notCard, { seen: seen.length, uniq: uniq.size, F: F.length, missing: missing.slice(0, 3), extra: extra.slice(0, 3), notCard });
    const last = seen[seen.length - 1]; await s.ctx.close();
    // (3) search finds a last-page match
    s = await page(vp, `${rel}#view=gallery&${lens}`, true);
    // the match's name from the page's places JSON (a last-page match is still a stub on a fresh load, so not in the DOM yet)
    const key = rel.includes('/') && !rel.startsWith('cities/') ? rel.split('/')[0].toLowerCase() + '--' + path.basename(rel, '.html') : path.basename(rel, '.html');
    const rec = JSON.parse(fs.readFileSync(path.join(ROOT, 'beta', 'data', 'places', key + '.json'), 'utf8')).places.find(x => x.id === last);
    const name = rec ? String(rec.n).replace(/\s*\(.*$/, '').trim() : null;
    let found = false;
    // the page's own filter (#cleo-filter). On a phone it is not on screen in the Gallery (the header's "Search" goes to the
    // site search), so the probe drives the same input directly — the search path is what is under test, not its control
    const box = s.p.locator('#cleo-filter').first();
    if (name && await box.count()) { await s.p.evaluate(v => { const i = document.getElementById('cleo-filter'); i.focus(); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); }, name); await s.p.waitForTimeout(1000); found = await s.p.evaluate(id => (() => { const c = document.getElementById('p-' + id); return !!c && !c.hidden && !c.closest('[hidden]') && c.getBoundingClientRect().height > 0; })(), last); }
    check(`${tag}: (3) search finds a last-page match ("${name}")`, found, { id: last });
    await s.ctx.close();
    // (4) #p= of a last-page match
    s = await page(vp, `${rel}#view=gallery&${lens}&p=${last}`, true);
    const sh = await s.p.evaluate(() => { const t = document.getElementById('sh-t'); const d = t && t.closest('[role=dialog]'); return d && !d.hidden ? t.textContent.trim() : null; });
    check(`${tag}: (4) #p=<last-page match> opens its sheet`, !!sh, { id: last, sheet: sh });
    await s.ctx.close();
    // (5) print builds every match; (6) Keep offline carries the places JSON
    s = await page(vp, `${rel}#view=gallery&${lens}`, true);
    const pr = await s.p.evaluate(async F => { window.dispatchEvent(new Event('beforeprint')); await new Promise(r => setTimeout(r, 600)); return F.filter(id => !document.getElementById('p-' + id)).length; }, F);
    check(`${tag}: (5) print builds every match as a card`, pr === 0, { notBuilt: pr });
    const off = await s.p.evaluate(() => { try { return (Cleo.offline && Cleo.offline.urls ? Cleo.offline.urls() : []).filter(u => /data\/places\//.test(u)); } catch (e) { return 'err ' + e.message; } });
    check(`${tag}: (6) "Keep offline" includes the places JSON (every match)`, Array.isArray(off) && off.length > 0, off);
    check(`${tag}: 0 JS errors`, !s.errs.length, s.errs.slice(0, 2));
    await s.ctx.close();
  }
  // QC-26: Atlas lens count and reach (FE-1 shed() paging)
  for (const vp of ['phone', 'desktop']) for (const [rel, a, pid] of ATLAS) {
    const s = await page(vp, `${rel}#view=atlas&a=${a}&p=${pid}`, false);
    const r = await s.p.evaluate(async () => { await new Promise(r => setTimeout(r, 1000)); const d = [...document.querySelectorAll('[role=dialog]')].find(x => x.offsetParent); const m = d && d.innerText.match(/(\d+) of (\d+)/); return { of: m ? +m[2] : null, shown: [...document.querySelectorAll('li.pl')].filter(c => !c.hidden && !c.classList.contains('ms-out') && c.getBoundingClientRect().height > 0).length }; });
    await s.p.keyboard.press('Escape'); await s.p.waitForTimeout(400);
    const reach = await s.p.evaluate(async () => { const seen = new Set(); const vis = () => [...document.querySelectorAll('li.pl')].filter(c => !c.hidden && !c.classList.contains('ms-out') && !c.closest('[hidden]') && getComputedStyle(c).display !== 'none').map(c => c.id);
      const all = document.querySelector('.ms-more [data-ms="all"]'); if (all) { all.click(); await new Promise(r => setTimeout(r, 400)); }
      vis().forEach(i => seen.add(i)); for (let i = 0; i < 40; i++) { const b = document.querySelector('.ms-pager:not([hidden]) button:not([disabled])'); if (!b) break; b.click(); await new Promise(r => setTimeout(r, 200)); vis().forEach(x => seen.add(x)); }
      return seen.size; });
    check(`QC-26 ${rel} ${vp} a=${a}: the sheet reads "1 of N" and paging the Atlas list reaches all N`, r.of && reach === r.of, { of: r.of, shownFirst: r.shown, reached: reach });
    await s.ctx.close();
  }
  await b.close(); srv.close();
  console.log(fails ? `>>> FAIL — ${fails}` : '>>> PASS — lensPage restatement and QC-26 lens count hold'); process.exit(fails ? 1 : 0);
});
