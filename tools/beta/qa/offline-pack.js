#!/usr/bin/env node
/**
 * W9-8 offline city pack probe (platform) — `npm run beta:qa:pack`. Real Chromium with a real service worker; the
 * server is KILLED for the offline part (a worker's own fetches can bypass emulated offline). Default: Tokyo, phone
 * 390×844 and desktop 1440×900. ONE-UP §7 W9-8 acceptance:
 *   1. After "Keep Tokyo offline" and going offline, Gallery, Guidebook and the detail reload with every place present,
 *      and Atlas shows "Map unavailable · all N places listed". To prove the pack (not the visit cache) carries it, every
 *      cache EXCEPT `cleo-packs` is deleted first — what a deploy's activate does (PERF-13).
 *   2. The stated size is within 10 % of the bytes cached.
 *   3. Storage failures leave the page working: (a) a tiny storage quota → "Couldn't save for offline", every place still
 *      listed; (b) no pack manifest → the control stays hidden, no error.
 *   4. No tiles cached: every cached URL is same-origin and none is a tile.
 *   + "Remove" frees it: the record and its files are gone.
 * Exit 1 on any failure.
 */
'use strict';
const path = require('path'); const fs = require('fs'); const { spawn } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PW = (() => { for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright']) { try { return require(t); } catch (e) {} } return null; })();
let fails = 0; const chk = (ok, msg, v) => { console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${msg}${v !== undefined ? ' = ' + JSON.stringify(v) : ''}`); if (!ok) fails++; };

(async () => {
  if (!PW) { console.log('>>> SKIP — Playwright not available'); return; }
  const pg = process.argv[2] || 'cities/tokyo.html', fileKey = pg.replace(/^cities\//, '').replace(/\.html$/, '').replace(/\//g, '--');
  const html = fs.readFileSync(path.join(ROOT, 'beta', pg), 'utf8'), total = (html.match(/<li class="pl[ "]/g) || []).length;
  const first = (/<li class="pl[ "][^>]*id="p-([^"]+)"/.exec(html.split('data-cleo-defer')[1] || html) || [])[1];
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'beta/data/packs', fileKey + '.json'), 'utf8'));
  const browser = await PW.chromium.launch();
  // a free port from the OS each time (it runs inside the parallel `npm test`, so never a fixed one)
  const freePort = () => new Promise(res => { const t = require('net').createServer(); t.listen(0, '127.0.0.1', () => { const p = t.address().port; t.close(() => res(p)); }); });
  const server = async () => { const p = await freePort(); const s = spawn('python3', ['-m', 'http.server', String(p), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' }); return { s, U: `http://127.0.0.1:${p}/beta/` }; };

  for (const [w, h, tag] of [[390, 844, 'phone'], [1440, 900, 'desktop']]) {
    console.log(`== ${pg} · ${tag} ==`);
    const { s: srv, U } = await server(); await sleep(900);
    {   // OV-41 (Atlas default, D-46), its own context so the flow below starts as before. A load lands in Atlas; tiles never
        // load here (nothing off-origin), so it is the no-map Atlas: the list holds every place and its own "Keep offline"
        // control must be reachable — a real click (Playwright refuses a covered target; the cover is named), then the kept state
      const c2 = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'allow', reducedMotion: 'reduce' }), q = await c2.newPage();
      await c2.route(u => u.hostname !== '127.0.0.1', r => r.abort());
      await q.goto(U + pg, { waitUntil: 'load' }); await q.evaluate(() => navigator.serviceWorker.ready); await sleep(2500);
      const av = await q.evaluate(() => { const b = document.querySelector('[data-cleo-pack]'), k = b && b.querySelector('[data-pack="keep"]'), r = k && k.getBoundingClientRect();
        const top = r && r.height ? document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) : null;
        return { view: document.documentElement.getAttribute('data-view'), nomap: document.documentElement.classList.contains('ms-nomap'), shown: !!(b && !b.hidden && b.getBoundingClientRect().height > 0),
          coveredBy: top && !k.contains(top) ? (top.tagName.toLowerCase() + (top.className && typeof top.className === 'string' ? '.' + top.className.trim().split(/\s+/).join('.') : '')) : null }; });
      chk(av.view === 'atlas' && av.shown, 'OV-41: Atlas-default load with no map: the list\'s "Keep offline" control is shown', av);
      // OV-41 "reachable" (FE-1 963febc6): what a reader can do — scroll only a box a person can scroll (overflow auto/scroll,
      // or the document when it is not overflow:hidden; never scrollIntoView, which also moves overflow:hidden boxes) — then
      // Keep must sit inside the viewport and the hit test at its centre must land on it
      const reach = await q.evaluate(() => { const k = document.querySelector('[data-cleo-pack] [data-pack="keep"]'), vh = innerHeight;
        const userScrolls = e => { const cs = getComputedStyle(e); return /(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 1; };
        let r = k.getBoundingClientRect(), via = 'none';
        if (r.bottom > vh || r.top < 0) {
          for (let e = k.parentElement; e; e = e.parentElement) {
            const isDoc = e === document.documentElement, ok = isDoc ? !/hidden|clip/.test(getComputedStyle(document.documentElement).overflowY + getComputedStyle(document.body).overflowY) && document.documentElement.scrollHeight > vh : userScrolls(e);
            if (!ok) continue;
            if (isDoc) window.scrollBy(0, r.top - vh / 2); else e.scrollTop += r.top - (e.getBoundingClientRect().top + e.clientHeight / 2);
            via = isDoc ? 'document' : e.tagName.toLowerCase() + '.' + String(e.className).trim().split(/\s+/)[0]; r = k.getBoundingClientRect(); if (r.top >= 0 && r.bottom <= vh) break;
          }
        }
        const inView = r.top >= 0 && r.bottom <= vh && r.left >= 0 && r.right <= innerWidth, top = inView ? document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) : null;
        return { inView, via, y: Math.round(r.top), vh, hit: !!top && k.contains(top), on: top ? top.tagName.toLowerCase() + '.' + String(top.className).trim().split(/\s+/)[0] : null }; });
      chk(reach.inView && reach.hit, 'OV-41: Keep is reachable (a reader-scrollable box brings it into view; the hit test lands on it)', reach);
      let ak = null;
      // evidence for the no-op tap (orchestrator: re-layout under the pointer, or Keep re-enabling wrongly?): Keep's box over
      // time, what the click hit, layout shifts around it, and whether Keep's own click ran
      await q.evaluate(() => { const k = document.querySelector('[data-cleo-pack] [data-pack="keep"]'); window.__tap = { boxes: [], hits: [], shifts: [], keepClick: 0, states: [] };
        const box = () => { const r = k.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height), Math.round(scrollY)].join(','); };
        const pane = (() => { for (let e = k.parentElement; e && e !== document.body; e = e.parentElement) { const o = getComputedStyle(e).overflowY; if (o === 'auto' || o === 'scroll') return e; } return null; })(), sp = document.querySelector('.split');
        __tap.pane = pane ? pane.tagName + '.' + String(pane.className).slice(0, 30) : null; __tap.panes = [];
        let n = 0; const t = setInterval(() => { __tap.boxes.push(box()); __tap.states.push((k.disabled ? 'D' : '-') + (k.hidden ? 'H' : '-'));
          if (pane) { const r = pane.getBoundingClientRect(); __tap.panes.push([Math.round(performance.now()), Math.round(r.top), Math.round(r.bottom), Math.round(pane.scrollTop), sp ? sp.style.getPropertyValue('--atlas-top') : ''].join(',')); }
          if (++n > 40) clearInterval(t); }, 50);
        document.addEventListener('click', e => { __tap.hits.push((e.target.tagName || '') + '.' + String(e.target.className || '').slice(0, 30) + '@' + e.clientX + ',' + e.clientY); }, true);
        k.addEventListener('click', () => { __tap.keepClick++; }, true);
        try { new PerformanceObserver(l => { for (const x of l.getEntries()) __tap.shifts.push(Math.round(x.startTime) + ':' + x.value.toFixed(4) + ':' + (x.sources || []).map(s => s.node && s.node.className ? String(s.node.className).slice(0, 20) : '?').join('+')); }).observe({ type: 'layout-shift' }); } catch (e) {} });
      try { await q.click('[data-cleo-pack] [data-pack="keep"]', { timeout: 8000 });
        await q.waitForFunction(() => { const d = document.querySelector('[data-cleo-pack] [data-pack-done]'), m = document.querySelector('[data-cleo-pack] [data-pack-msg]'); return (d && !d.hidden) || (m && /Couldn/.test(m.textContent)); }, null, { timeout: 120000 });
        ak = await q.evaluate(k => Cleo.pack.state(k), fileKey); if (!ak) ak = { err: 'no pack record', msg: await q.evaluate(() => (document.querySelector('[data-cleo-pack] [data-pack-msg]') || {}).textContent) }; }
      catch (e) { ak = { err: String(e.message || e).split('\n')[0].slice(0, 120), coveredBy: av.coveredBy, tap: await q.evaluate(() => { const t = window.__tap || {}; const bx = [...new Set(t.boxes || [])]; return { keepClick: t.keepClick, hits: t.hits, boxes: bx.slice(0, 6), states: [...new Set(t.states || [])], shifts: (t.shifts || []).slice(0, 6), pane: t.pane, panes: [...new Set((t.panes || []).map(x => x.split(',').slice(1).join(',')))].slice(0, 8), hitAtClick: (t.hits || [])[0] }; }).catch(() => null), msg: await q.evaluate(() => { const m = document.querySelector('[data-cleo-pack] [data-pack-msg]'), k = document.querySelector('[data-cleo-pack] [data-pack="keep"]'); return [(m || {}).textContent, k && k.disabled, navigator.serviceWorker.controller ? 'controlled' : 'no controller'].join(' | '); }).catch(() => null), rec: await q.evaluate(k => Cleo.pack && Cleo.pack.state(k).then(r => r && { n: r.n, ok: r.ok }), fileKey).catch(() => 'x') }; }
      // the save itself is gated by the Gallery flow below. This tap from the Atlas list is REPORTED, not graded, until FE-1
      // parks the section in the desktop list pane: on desktop no-map Atlas the document never scrolls (overflow hidden) and
      // the list's Keep sits below the fold (1440×900: y 971), unreachable by a reader; Playwright's programmatic scroll
      // sometimes reaches it. Its evidence (Keep's box, what the click hit, the scrolling box) prints with the row
      const okA = !!ak && !ak.err && ak.ok > 0 && ak.ok === ak.n;
      console.log(`  ${okA ? 'PASS' : 'INFO'}  OV-41: a real tap keeps the city from the Atlas list = ${JSON.stringify(ak && (ak.err ? ak : { ok: ak.ok, n: ak.n }))}`);
      await q.evaluate(k => Cleo.pack.remove(k), fileKey).catch(() => {}); await c2.close();
    }
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'allow', reducedMotion: 'reduce' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await ctx.route(u => u.hostname !== '127.0.0.1', r => r.abort());   // nothing off-origin, ever (any local port is ours)
    await p.goto(U + pg + '#view=gallery', { waitUntil: 'load' });   // FE-A D-46: Atlas is the default; the pack control is tapped from the list (Gallery)
    await p.evaluate(() => navigator.serviceWorker.ready); await sleep(1500);
    const vis = await p.evaluate(() => { const b = document.querySelector('[data-cleo-pack]'); return b && !b.hidden ? b.querySelector('[data-pack-size]').textContent : null; });
    chk(!!vis, 'the control shows its size before the tap', vis);
    await p.click('[data-pack="keep"]');
    await p.waitForFunction(() => { const d = document.querySelector('[data-pack-done]'), m = document.querySelector('[data-pack-msg]'); return (d && !d.hidden) || (m && /Couldn/.test(m.textContent)); }, null, { timeout: 120000 });
    const st = await p.evaluate(k => Cleo.pack.state(k), fileKey);
    const done = await p.evaluate(() => document.querySelector('[data-pack-done]').textContent);
    chk(!!st && st.ok === st.n, `done state: "${done}" (${st && st.ok}/${st && st.n} files)`);
    chk(!!st && Math.abs(st.bytes - manifest.bytes) / manifest.bytes <= 0.10, 'stated size within 10 % of the bytes cached', st && { stated: manifest.bytes, cached: st.bytes });
    const keys = await p.evaluate(async () => { const out = []; for (const n of await caches.keys()) { const c = await caches.open(n); for (const r of await c.keys()) out.push(r.url); } return out; });
    const origin = new URL(U).origin;
    chk(keys.length > 0 && keys.every(u => u.startsWith(origin)) && !keys.some(u => /tile|arcgisonline|openstreetmap/.test(u)), `no tile and nothing off-origin among ${keys.length} cached URLs`);
    // what a deploy does: every cache but the packs goes
    await p.evaluate(async () => { for (const n of await caches.keys()) if (n !== 'cleo-packs') await caches.delete(n); });
    srv.kill(); await sleep(400); await ctx.setOffline(true);
    // 1. Gallery: every place present (show all), the detail opens
    await p.goto(U + pg + '#view=gallery&all=1', { waitUntil: 'load' }).catch(e => errs.push('goto ' + e)); await sleep(1200);
    const gal = await p.evaluate(() => { if (window.Cleo && Cleo.defer) Cleo.defer.all(); return document.querySelectorAll('li.pl').length; });
    chk(gal === total, 'offline Gallery: every place present', `${gal}/${total}`);
    if (first) { await p.evaluate(id => { location.hash = '#view=gallery&p=' + id; }, first); await sleep(900);
      const det = await p.evaluate(() => { const d = document.querySelector('[role=dialog]:not([hidden]) h2, [role=dialog]:not([hidden]) h1, .sheet:not([hidden]) h2'); return d ? d.textContent.trim().slice(0, 40) : null; });
      chk(!!det, 'offline detail opens (deep link)', det); }
    // the pack UI itself offline (pack.js is lazy since 2026-10-16: it must come from the worker's cache, and say "kept")
    await sleep(1500);
    const ui = await p.evaluate(() => { const b = document.querySelector('[data-cleo-pack]'), d = b && b.querySelector('[data-pack-done]'); return { api: !!(window.Cleo && Cleo.pack), shown: !!b && !b.hidden, done: d && !d.hidden ? d.textContent.trim() : null }; });
    chk(ui.api && ui.shown && !!ui.done, 'offline: the lazy pack module loads and the control shows the kept state', ui);
    // Guidebook (its view JS and the page dataset come from the pack)
    await p.evaluate(() => { location.hash = '#view=guidebook'; }); await sleep(2500);
    const gb = await p.evaluate(() => { if (window.Cleo && Cleo.defer) Cleo.defer.all(); const c = document.querySelector('[data-gb-count]'); return { li: document.querySelectorAll('li.ge').length, line: c ? c.textContent.trim() : null }; });
    chk(gb.li === total && new RegExp('All ' + total + ' places').test(gb.line || ''), 'offline Guidebook: every place present', gb);
    // Atlas: map unavailable, every place listed
    await p.evaluate(() => { location.hash = '#view=atlas'; });
    // wait for the map to give way (watchTiles needs 4 tile errors, plus a zoomend if mid-animation): a cold browser after a
    // rebuild could take longer than a fixed sleep (FE-A's evidence: 2 of 6 runs after a no-op CSS change). Same assertion.
    await p.waitForFunction(() => /Map unavailable/.test((document.getElementById('cleo-map') || {}).textContent || ''), null, { timeout: 15000 }).catch(() => {});
    await sleep(300);
    const at = await p.evaluate(() => { const m = document.getElementById('cleo-map'); return { text: m ? m.textContent.replace(/\s+/g, ' ').trim().slice(0, 90) : '', cards: document.querySelectorAll('li.pl').length + (window.Cleo && Cleo.defer ? Cleo.defer.peek().length : 0) }; });
    chk(new RegExp('Map unavailable · all ' + total + ' places listed').test(at.text) && at.cards === total, 'offline Atlas: "Map unavailable · all N places listed", every place listed', at);
    chk(errs.length === 0, 'no page errors offline', errs.slice(0, 3));
    // Remove frees it (back online, a fresh server)
    await ctx.setOffline(false); const { s: srv2, U: U2 } = await server(); await sleep(900);
    await p.goto(U2 + pg + '#view=gallery', { waitUntil: 'load' }); await p.evaluate(() => navigator.serviceWorker.ready); await sleep(800);   // FE-A D-46
    // (a new port is a new origin: the pack lives on the first origin, so check Remove on THIS origin after keeping it)
    await p.click('[data-pack="keep"]'); await p.waitForFunction(() => !document.querySelector('[data-pack-done]').hidden, null, { timeout: 120000 });
    await p.click('[data-pack="remove"]'); await p.waitForFunction(() => !document.querySelector('[data-pack="keep"]').hidden, null, { timeout: 30000 });
    const left = await p.evaluate(async k => ({ rec: await Cleo.pack.state(k), files: (await (await caches.open('cleo-packs')).keys()).length }), fileKey);
    chk(left.rec === null && left.files === 0, '"Remove" frees the pack (record and files)', left);
    srv2.kill(); await ctx.close();
  }

  console.log('== storage failures leave the page working ==');
  {
    const { s: srv, U } = await server(); await sleep(900);
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'allow' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await ctx.route(u => u.hostname !== '127.0.0.1', r => r.abort());
    const cdp = await ctx.newCDPSession(p);
    await p.goto(U + pg + '#view=gallery', { waitUntil: 'load' }); await p.evaluate(() => navigator.serviceWorker.ready); await sleep(1200);   // FE-A D-46
    await cdp.send('Storage.overrideQuotaForOrigin', { origin: new URL(U).origin, quotaSize: 200 * 1024 }).catch(() => {});
    await p.click('[data-pack="keep"]');
    await p.waitForFunction(() => { const d = document.querySelector('[data-pack-done]'), m = document.querySelector('[data-pack-msg]'); return (d && !d.hidden) || (m && m.textContent.length > 20 && !/Saving/.test(m.textContent)); }, null, { timeout: 120000 });
    const r = await p.evaluate(() => ({ msg: document.querySelector('[data-pack-msg]').textContent, cards: document.querySelectorAll('li.pl').length + (Cleo.defer ? Cleo.defer.peek().length : 0) }));
    chk(/Couldn/.test(r.msg) && r.cards === total && errs.length === 0, 'a 200 KB quota: "Couldn\'t save for offline", every place still listed, no error', r);
    // the pack manifest unavailable (page-side fetch fails; a worker's own fetches bypass Playwright routing, so the
    // failure is injected where the page asks for it)
    const p2 = await ctx.newPage(); p2.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await p2.addInitScript(() => { const f = window.fetch; window.fetch = (u, o) => /\/data\/packs\//.test(String(u)) ? Promise.reject(new TypeError('Failed to fetch')) : f(u, o); });
    await p2.goto(U + 'cleveland.html', { waitUntil: 'load' }); await sleep(1500);
    const h = await p2.evaluate(() => { const b = document.querySelector('[data-cleo-pack]'); return { hidden: b ? b.hidden : true, cards: document.querySelectorAll('li.pl').length + (Cleo.defer ? Cleo.defer.peek().length : 0) }; });
    chk(h.hidden && h.cards > 0 && errs.length === 0, 'no pack manifest: the control stays hidden, the page works', h);
    srv.kill(); await ctx.close();
  }
  await browser.close();
  console.log(fails ? `\n>>> FAIL — offline pack: ${fails} check(s)` : '\n>>> PASS — offline city pack (W9-8): kept, survives a deploy, reloads offline with every place; size honest; failures harmless');
  process.exit(fails ? 1 : 0);
})();
