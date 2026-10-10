#!/usr/bin/env node
'use strict';
/**
 * tools/beta/test-fe-a.js — FE-A Wave 2 behaviour gate (jsdom, network gone), wired into `npm test`.
 *
 *  1. FOR YOU (M2-05): interests map to collection / cuisine IDS only (never keywords); turning them on REORDERS and
 *     never hides — same record set before and after; lifted cards say "First because …"; storage throwing is fine.
 *  2. YOUR DAY (M2-06): every planned stop is open and has a verified pin (high/med); 4–6 stops; the #day lens shows
 *     exactly the stops, in order; a stop can be removed and the place stays on the page.
 *  3. NEAR ME (M3-02): distances on cards + nearest first; nothing stored; record set unchanged.
 *  4. MAP PIN SHEET: Esc closes it (QA-confirmed W1 bug).
 *  5. SAVED (M2-03/04): a shared link renders read-only with "Save a copy"; unknown ids are reported, not dropped.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..', '..');
const BETA = path.join(ROOT, 'beta');
let failures = 0;
const chk = (name, ok, got) => { console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${got !== undefined ? ' = ' + JSON.stringify(got) : ''}`); if (!ok) failures++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

function boot(page, { hash = '', storage = 'ok', mobile = false, geo = null, seed = null } = {}) {
  let html = fs.readFileSync(path.join(BETA, page), 'utf8').replace(/<script src="((?:\.\.\/)*assets\/js\/[a-z-]+\.js)\?v=[^"]*" defer><\/script>/g,
    (m, src) => '<script>' + fs.readFileSync(path.join(BETA, path.dirname(page), src), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>');
  const errs = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://x.test/beta/' + page + hash,
    beforeParse(w) {
      w.Element.prototype.scrollIntoView = function () {};
      w.matchMedia = q => ({ matches: /min-width/.test(q) ? !mobile : false, addListener() {}, removeListener() {} });
      if (storage === 'throws') Object.defineProperty(w, 'localStorage', { get() { throw new Error('SecurityError'); } });
      else if (seed) for (const k in seed) w.localStorage.setItem('cleo:v1:' + k, JSON.stringify(seed[k]));
      if (geo) Object.defineProperty(w.navigator, 'geolocation', { value: { getCurrentPosition: ok => ok({ coords: { latitude: geo[0], longitude: geo[1] } }) } });
      w.fetch = u => { const p = path.join(BETA, new URL(u, w.location.href).pathname.replace(/^\/beta\//, ''));
        return fs.existsSync(p) ? Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(fs.readFileSync(p, 'utf8'))) }) : Promise.resolve({ ok: false, status: 404 }); };
      w.addEventListener('error', e => errs.push('ERR ' + (e.message || e.error)));
    },
  });
  dom.window.console.error = (...a) => errs.push('console.error: ' + a.join(' '));
  return { w: dom.window, d: dom.window.document, errs };
}
const ids = d => [...d.querySelectorAll('li.pl:not([hidden])')].map(li => li.id);
const order = d => [...d.querySelectorAll('li.pl')].map(li => li.id);

(async () => {
  const PAGES = ['cities/tokyo.html', 'cleveland.html', 'cities/pittsburgh.html', 'Singapore/chinatown.html'];
  console.log('\n== FOR YOU: ids only, reorders, never hides ==');
  for (const page of PAGES) {
    const data = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', page.replace(/^cities\//, '').replace(/\.html$/, '').replace(/^Singapore\//, 'singapore--') + '.json'), 'utf8'));
    const { d, w, errs } = boot(page, { storage: 'throws' });
    await sleep(200);
    const info = JSON.parse(d.getElementById('cleo-city').textContent);
    const known = new Set(['k:f'].concat(data.collections.map(c => 'c:' + c.id), data.cuisines.map(c => 'cz:' + c.id)));
    chk(`${page}: every interest maps to collection/cuisine ids that exist (no keywords)`, (info.fy || []).length > 0 && info.fy.every(f => f[3].length && f[3].every(x => known.has(x))), (info.fy || []).map(f => f[0]));
    const before = ids(d).sort(), o0 = order(d).join();
    d.querySelector('[data-cleo-foryou]').click(); await sleep(10);
    [...d.querySelectorAll('#cleo-fy .pill')].slice(-2).forEach(b => b.click());
    d.querySelector('[data-fy="go"]').click(); await sleep(30);
    const after = ids(d).sort();
    chk(`${page}: same ${before.length} places before and after`, before.join() === after.join(), [before.length, after.length]);
    const lifted = [...d.querySelectorAll('li.pl .pl-why')];
    chk(`${page}: lifted cards say "First because …"`, lifted.length > 0 && lifted.every(x => /^First because: /.test(x.textContent)), lifted.length);
    chk(`${page}: order changed (reorder, not filter)`, order(d).join() !== o0 || lifted.length === 0);
    chk(`${page}: no js errors`, errs.length === 0, errs.slice(0, 2));
  }

  console.log('\n== ★ SIGNATURE = city canon / pop culture, never a publisher; food rail canon-first ==');
  for (const page of ['cleveland.html', 'cities/pittsburgh.html', 'cities/newyork.html']) {
    const { d, w, errs } = boot(page);
    await sleep(100);
    const sig = d.querySelector('.rail-i.sig'), info = JSON.parse(d.getElementById('cleo-city').textContent);
    chk(`${page}: ★ tile is the canon (data-sig), not a publisher (data-src)`, !!sig && sig.hasAttribute('data-sig') && !sig.hasAttribute('data-src'), sig && sig.querySelector('.t').textContent);
    sig.click(); await sleep(30);
    chk(`${page}: ★ lens shows exactly its ${info.sig.ids.length} records`, ids(d).sort().join() === info.sig.ids.map(x => 'p-' + x).sort().join(), ids(d).length);
    const data = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', page.replace(/^cities\//, '').replace(/\.html$/, '') + '.json'), 'utf8'));
    const firstCz = (d.querySelector('.rail-i[data-cz]') || {}).getAttribute && d.querySelector('.rail-i[data-cz]').getAttribute('data-cz');
    chk(`${page}: food rail starts with the canon (${data.guide.foodOrder[0]})`, firstCz === data.guide.foodOrder.filter(id => data.places.some(p => (p.cz || []).includes(id)))[0], firstCz);
    chk(`${page}: no js errors`, errs.length === 0, errs.slice(0, 2));
  }
  {
    const { d, w } = boot('cleveland.html'); await sleep(100);
    const info = JSON.parse(d.getElementById('cleo-city').textContent);
    w.location.hash = '#closed=1'; await sleep(30);
    const shown = ids(d);
    chk('Recently closed lens: every closed record, flagged, newest check first within each area', shown.length === d.querySelectorAll('li.pl[data-closed]').length &&
      [...d.querySelectorAll('ol.pls')].every(ol => { const o = [...ol.querySelectorAll('li.pl:not([hidden])')].map(li => info.co.indexOf(li.id.slice(2))); return o.every((x, i) => !i || x >= o[i - 1]); }), shown.length);
  }

  console.log('\n== YOUR DAY: open + verified pins only, 4–6 stops ==');
  let planned = 0, badStops = [];
  for (const f of fs.readdirSync(path.join(BETA, 'data/places'))) {
    const data = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8'));
    const html = fs.readFileSync(path.join(BETA, data.beta), 'utf8');
    const info = JSON.parse(/id="cleo-city">([\s\S]*?)<\/script>/.exec(html)[1]);
    const by = Object.fromEntries(data.places.map(p => [p.id, p]));
    for (const [a, list] of Object.entries(info.days || {})) {
      planned++;
      if (list.length < 4 || list.length > 6) badStops.push(`${f} ${a}: ${list.length} stops`);
      for (const id of list) { const p = by[id]; if (!p || p.closed || /closed/i.test((p.pv || {}).status || '') || p.la == null || !/^(high|med)/.test((p.pv || {}).pin || '') || p.a !== a) badStops.push(`${f} ${a}: ${id}`); }
    }
  }
  chk(`${planned} planned days: every stop open, verified pin, in its area; 4–6 stops`, planned > 0 && badStops.length === 0, badStops.slice(0, 5));
  {
    const { d, w, errs } = boot('cities/tokyo.html');
    await sleep(100);
    const info = JSON.parse(d.getElementById('cleo-city').textContent), a = Object.keys(info.days)[0], stops = info.days[a];
    w.location.hash = '#day=' + a; await sleep(30);
    chk('day lens shows exactly its stops, in order', ids(d).join() === stops.map(x => 'p-' + x).join(), ids(d).length);
    chk('day lens labels legs "straight-line" and the total', /straight-line total/.test(d.getElementById('cleo-lens').textContent) && d.querySelectorAll('#cleo-lens .leg').length === stops.length - 1);
    d.querySelector('#cleo-lens [data-dy="rm"][data-i="0"]').click(); await sleep(30);
    chk('removing a stop keeps the place on the page', ids(d).length === stops.length - 1 && !!d.getElementById('p-' + stops[0]));
    w.location.hash = ''; await sleep(30);
    chk('leaving the day shows every place again', ids(d).length === d.querySelectorAll('li.pl').length);
    chk('no js errors', errs.length === 0, errs.slice(0, 2));
  }

  console.log('\n== NEAR ME: opt-in, in memory, nearest first ==');
  {
    const { d, w, errs } = boot('cities/tokyo.html', { geo: [35.7148, 139.7967] });
    await sleep(100);
    const n0 = ids(d).length;
    d.querySelector('[data-cleo-near]').click(); await sleep(40);
    const km = [...d.querySelectorAll('li.pl .pl-km')];
    chk('distance on every pinned card', km.length === d.querySelectorAll('li.pl[data-ll]').length, km.length);
    const first = d.querySelector('section.area li.pl');
    chk('nearest place comes first', /^· \d+ m away$/.test(first.querySelector('.pl-km').textContent), first.querySelector('.pl-km').textContent);
    chk('record set unchanged', ids(d).length === n0);
    let stored = ''; try { for (let i = 0; i < w.localStorage.length; i++) stored += w.localStorage.getItem(w.localStorage.key(i)); } catch (e) {}
    chk('position never stored', !/35\.71|139\.79/.test(stored));
    chk('no js errors', errs.length === 0, errs.slice(0, 2));
  }

  console.log('\n== MAP PIN SHEET: Esc closes it ==');
  {
    const { d, w, errs } = boot('cities/tokyo.html', { mobile: true });
    await sleep(100);
    const c = d.querySelector('li.pl'), poi = d.getElementById('cleo-poi');
    w.Cleo.city.openPoi(c); await sleep(10);
    chk('pin sheet opens with a peek summary', !poi.hidden && !!poi.querySelector('.peek-c'));
    poi.querySelector('[data-poi="x"]').dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await sleep(10);
    chk('Esc closes the pin sheet', poi.hidden);
    chk('no js errors', errs.length === 0, errs.slice(0, 2));
  }

  console.log('\n== SAVED: shared link read-only, Save a copy, unknown ids reported ==');
  {
    const { d, w, errs } = boot('saved.html', { hash: '#list=tokyo:senso-ji,kanda-myojin,no-such-place&n=Weekend' });
    await sleep(300);
    chk('two known places render as cards', d.querySelectorAll('.sv-c').length === 2, d.querySelectorAll('.sv-c').length);
    chk('unknown id reported, not dropped', /no-such-place/.test((d.querySelector('.sv-gone') || {}).textContent || ''));
    chk('read-only: no save buttons, a Save a copy button', !d.querySelector('[data-sv="save"]') && !!d.querySelector('[data-sv="copy"]'));
    d.querySelector('[data-sv="copy"]').click(); await sleep(300);
    const lists = w.Cleo.store.get('lists', []);
    chk('Save a copy makes a named list on this device', lists.length === 1 && lists[0].n === 'Weekend' && lists[0].r.length === 3, lists.map(l => [l.n, l.r.length]));
    chk('…and the copy is now the view, with its tab', /Weekend/.test(d.querySelector('.sv-tabs').textContent));
    chk('no js errors', errs.length === 0, errs.slice(0, 2));
  }

  console.log(failures ? `\n>>> FAIL — ${failures} FE-A check(s) failed` : '\n>>> PASS — FE-A: for-you reorders only, days honest, near-me in memory, pin sheet Esc, shared lists');
  process.exit(failures ? 1 : 0);
})();
