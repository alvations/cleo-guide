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
  // foryou.js / day.js / gallery.js / atlas.js load on first use (C.need / views.js); jsdom fetches nothing, so the harness inlines them like a browser would
  if (/data-cleo-page="city"/.test(html)) html = html.replace('</body>', () => ['foryou', 'day', 'gallery', 'atlas'].map(n => '<script>' + fs.readFileSync(path.join(BETA, 'assets/js', n + '.js'), 'utf8') + '</script>').join('') + '</body>');
  const errs = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://x.test/beta/' + page + hash,
    beforeParse(w) {
      w.Element.prototype.scrollIntoView = function () {}; w.scrollTo = () => {};
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
    if (w.Cleo.defer) w.Cleo.defer.all();                          // progressive render (M3-06): compare the full record set
    const before = ids(d).sort(), o0 = order(d).join();
    d.querySelector('[data-cleo-foryou]').click(); await sleep(10);
    [...d.querySelectorAll('#cleo-fy .interest')].slice(-2).forEach(b => b.click());
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
    const { d, w, errs } = boot('cities/tokyo.html', { geo: [35.7148, 139.7967], hash: '#view=gallery' });   // D-46: the list's DOM order is the Gallery's
    await sleep(100);
    const n0 = ids(d).length;
    d.querySelector('[data-cleo-near]').click(); await sleep(40);
    const km = [...d.querySelectorAll('li.pl .pl-dist')];
    chk('distance on every pinned card', km.length === d.querySelectorAll('li.pl[data-ll]').length, km.length);
    const first = d.querySelector('section.area li.pl');
    chk('nearest place comes first', /^\d+ m away$/.test(first.querySelector('.pl-dist').textContent), first.querySelector('.pl-dist').textContent);
    chk('record set unchanged', ids(d).length === n0);
    let stored = ''; try { for (let i = 0; i < w.localStorage.length; i++) stored += w.localStorage.getItem(w.localStorage.key(i)); } catch (e) {}
    chk('position never stored', !/35\.71|139\.79/.test(stored));
    chk('no js errors', errs.length === 0, errs.slice(0, 2));
  }

  console.log('\n== MAP PIN PREVIEW: Esc closes it ==');
  {
    // W7 Atlas map-search: a pin opens a preview card on the (desktop) map — the phone pin sheet is retired for the carousel
    const { d, w, errs } = boot('cities/tokyo.html', { hash: '#view=atlas' });
    await sleep(100);
    const c = d.querySelector('li.pl'), poi = d.getElementById('cleo-poi');
    w.Cleo.city.openPoi(c); await sleep(10);
    chk('pin preview opens with the name, a line and the sources, linking to the place in Atlas', !poi.hidden && !!poi.querySelector('.ms-pv-n') && !!poi.querySelector('.ms-pv-s') && /^#(?:view=atlas&)?p=/.test(poi.querySelector('a.ms-pv').getAttribute('href')) && !/view=gallery/.test(poi.querySelector('a.ms-pv').getAttribute('href')));   // D-46: Atlas is the default, so its links may omit view=
    poi.querySelector('a.ms-pv').dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await sleep(10);
    chk('Esc closes the preview', poi.hidden);
    chk('no js errors', errs.length === 0, errs.slice(0, 2));
  }

  console.log('\n== SAVED: shared link read-only, Save a copy, unknown ids reported ==');
  {
    const { d, w, errs } = boot('saved.html', { hash: '#list=tokyo:senso-ji,kanda-myojin,no-such-place&n=Weekend' });
    await sleep(300);
    chk('two known places render as cards', d.querySelectorAll('.saved-cards li.pl').length === 2, d.querySelectorAll('.saved-cards li.pl').length);
    chk('unknown id reported, not dropped', /no-such-place/.test((d.querySelector('.saved-cards .gone') || {}).textContent || ''));
    chk('read-only: no save buttons, a Save a copy button', !d.querySelector('[data-sv="save"]') && !!d.querySelector('[data-sv="copy"]'));
    d.querySelector('[data-sv="copy"]').click(); await sleep(300);
    const lists = w.Cleo.store.get('lists', []);
    chk('Save a copy makes a named list on this device', lists.length === 1 && lists[0].n === 'Weekend' && lists[0].r.length === 3, lists.map(l => [l.n, l.r.length]));
    chk('…and the copy is now the view, with its tab', /Weekend/.test(d.querySelector('.sv-tabs').textContent));
    chk('no js errors', errs.length === 0, errs.slice(0, 2));
  }

  console.log('\n== W3 VIEWS: switcher, precedence, Gallery pager, Atlas, sheet n of N (A-01…A-05) ==');
  {
    const page = 'cities/tokyo.html', N = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places/tokyo.json'), 'utf8')).places.length;
    let { d, w, errs } = boot(page); await sleep(150);
    const view = () => d.documentElement.getAttribute('data-view');
    // D-46 (owner): Atlas is the default view; the switcher reads Atlas, Gallery, Guidebook, Insights (SPEC-v3 §1.7)
    chk('default view is Atlas (D-46), switcher revealed in the order Atlas, Gallery, …', view() === 'atlas' && !d.querySelector('[data-cleo-views]').hidden &&
      [...d.querySelectorAll('[data-cleo-views] button[data-view]')].map(b => b.getAttribute('data-view')).slice(0, 2).join() === 'atlas,gallery', [view(), [...d.querySelectorAll('[data-cleo-views] button[data-view]')].map(b => b.getAttribute('data-view')).join()]);
    chk('the Atlas default preloads no Gallery hero', !d.querySelector('link[rel=preload][as=image]'), d.querySelectorAll('link[rel=preload][as=image]').length);
    ({ d, w, errs } = boot(page, { hash: '#view=gallery' })); await sleep(150);
    if (w.Cleo.defer) w.Cleo.defer.all(); await sleep(30);
    const cards = [...d.querySelectorAll('li.pl')];
    chk('Gallery grid holds every place', cards.length === N, [cards.length, N]);
    chk('page 1 shows 48, the rest are paged (never hidden by a lens)', cards.filter(c => !c.classList.contains('pg-off')).length === 48 && cards.every(c => !c.hidden));
    const pager = d.querySelector('.pager');
    chk('pager: page numbers + "all N" line + show-all', !!pager && !pager.hidden && pager.querySelectorAll('.pg-n button[data-pg]').length >= 3 &&
      new RegExp('all ' + N + ' places').test(pager.textContent) && new RegExp('Show all ' + N + ' on one page').test(pager.textContent), pager && pager.textContent.slice(0, 120));
    w.Cleo.root = '../'; w.Cleo.city.apply(); await sleep(80);   // inlined scripts have no src → set the site root, re-paint (rows load from the page JSON)
    chk('rows are drawn client-side from the page JSON (none in the server HTML) and every row card shows Recommended by', !/class="g-row"/.test(fs.readFileSync(path.join(BETA, page), 'utf8')) && d.querySelectorAll('#cleo-rows-host .g-row').length > 0 &&
      [...d.querySelectorAll('#cleo-rows-host .gc')].every(g => /Recommended by/.test(g.textContent)), d.querySelectorAll('#cleo-rows-host .g-row').length);
    w.location.hash = '#view=gallery&all=1'; await sleep(30);
    chk('#all=1 puts every place on one page', d.querySelectorAll('li.pl.pg-off').length === 0);
    w.location.hash = '#view=gallery&pg=9'; await sleep(30);
    const last = d.querySelector('li.pl:not(.pg-off)');
    chk('#pg=9 shows a later page', !!last && cards.indexOf(last) === 8 * 48, last && cards.indexOf(last));
    const deep = cards[cards.length - 3], nm = w.Cleo.city.name(deep);
    const fi = d.getElementById('cleo-filter'); fi.value = nm; fi.dispatchEvent(new w.Event('input'));
    for (let t = 0; t < 30 && (deep.hidden || deep.classList.contains('pg-off')); t++) await sleep(100);   // the search routes via q= (debounce + hashchange): wait for it, ≤ 3 s
    chk('search spans every page (a last-page record found by name, on page 1 of the matches)', !deep.hidden && !deep.classList.contains('pg-off'), nm);
    fi.value = ''; fi.dispatchEvent(new w.Event('input'));
    for (let t = 0; t < 30 && /(^#|&)q=/.test(w.location.hash); t++) await sleep(100);   // the cleared search leaves the route
    d.querySelector('[data-cleo-views] button[data-view="atlas"]').click(); await sleep(30);
    chk('switch → Atlas: html[data-view], the hash leaves Gallery, every card unpaged', view() === 'atlas' && !/view=gallery/.test(w.location.hash) && d.querySelectorAll('li.pl.pg-off').length === 0, w.location.hash);   // D-46: Atlas is the default, so no view= key is needed
    chk('…remembered', w.Cleo.store.get('view') === 'atlas');
    d.querySelector('button[data-mode="sights"]').click(); await sleep(30);
    chk('a lens keeps the view (Atlas stays; a lens implies Atlas, so no view= key)', view() === 'atlas' && !/view=/.test(w.location.hash) && /mode=sights/.test(w.location.hash), w.location.hash);
    chk('live region announces the view', /Atlas view, \d/.test(d.getElementById('cleo-view-live').textContent));
    chk('no js errors', errs.length === 0, errs.slice(0, 2));

    ({ d, w, errs } = boot(page, { mobile: true, hash: '#view=gallery' })); await sleep(100);
    d.querySelector('.map-toggle[data-cleo-map]').click(); await sleep(40);
    chk('outside Atlas the map button switches to Atlas (the map lives there)', view() === 'atlas' && !/view=gallery/.test(w.location.hash) && errs.length === 0, [view(), w.location.hash, errs.slice(0, 1)]);
    // G1 (QA-29): in the paged Gallery every deep link and anchor lands on a shown card
    ({ d, w, errs } = boot(page, { hash: '#view=gallery' })); await sleep(120);
    const all9 = [...d.querySelectorAll('li.pl')], far = all9[all9.length - 2], shown = c => !c.hidden && !c.classList.contains('pg-off') && !c.closest('.pg-empty');
    w.location.hash = '#view=gallery&p=' + far.id.slice(2); await sleep(60);
    chk('Gallery #p= to a last-page place moves the pager there (card shown)', shown(far) && /pg=\d+/.test(w.location.hash), w.location.hash);
    const mid = all9[200]; w.location.hash = '#' + mid.id; await sleep(60);
    chk('Gallery #p-<id> anchor lands on a shown card', shown(mid), mid.id);
    const lastA = [...d.querySelectorAll('section.area')].pop(); w.location.hash = '#' + lastA.id; await sleep(60);
    chk('Gallery #area-<A> anchor shows that area', !lastA.classList.contains('pg-empty') && !!lastA.querySelector('li.pl:not(.pg-off):not([hidden])'), lastA.id);
    chk('no js errors', errs.length === 0, errs.slice(0, 2));
    // D-46 prep: legacy pager links (no view=) open Gallery, the only view with pages, whatever the default
    for (const hh of ['#pg=2', '#all=1']) { ({ d, w, errs } = boot(page, { hash: hh })); await sleep(120);
      chk(`legacy ${hh} (no view=) opens Gallery`, view() === 'gallery' && errs.length === 0, [view(), w.location.hash]); }
    ({ d, w, errs } = boot(page, { hash: '#view=gallery' })); await sleep(100);
    chk('a #view=gallery deep link opens Gallery over the Atlas default (D-46)', view() === 'gallery', view());
    // FE-B finding: the route is the search's source of truth — typing writes q=, a link without q= clears it, Back restores it
    ({ d, w, errs } = boot(page)); await sleep(120);
    { const fq = d.getElementById('cleo-filter'), shownN = () => [...d.querySelectorAll('li.pl')].filter(c => !c.hidden).length;
      if (w.Cleo.defer) w.Cleo.defer.all(); await sleep(20); const all0 = shownN();
      fq.value = 'temple'; fq.dispatchEvent(new w.Event('input')); await sleep(250);
      const n1 = shownN(), h1 = w.location.hash;
      chk('typing a search writes q= into the URL and filters', /(^#|&)q=temple/.test(h1) && n1 < all0, [h1, n1, all0]);
      w.location.hash = '#view=gallery'; await sleep(80);
      chk('a link without q= clears the search (box and filter)', fq.value === '' && !w.Cleo.city.S.q && !/q=/.test(w.location.hash) && [...d.querySelectorAll('li.pl')].every(c => !c.hidden), [fq.value, w.Cleo.city.S.q]);
      w.history.back(); await sleep(120);
      chk('Back restores the search', fq.value === 'temple' && w.Cleo.city.S.q === 'temple' && /q=temple/.test(w.location.hash), [fq.value, w.location.hash]);
      chk('no js errors (search route)', errs.length === 0, errs.slice(0, 2)); }
    ({ d, w, errs } = boot(page, { hash: '#view=bogus' })); await sleep(100);
    chk('#view=bogus → the default (Atlas, D-46), the bad key dropped, no error', view() === 'atlas' && !/view=/.test(w.location.hash) && errs.length === 0, [view(), w.location.hash]);
    // W5: a lens link with no view= (hub / landing rails) opens Atlas, the unpaged list, so the promised count shows
    ({ d, w, errs } = boot(page, { hash: '#c=ANIME' })); await sleep(120);
    chk('#c=… with no view= opens Atlas (a lens implies the unpaged list)', view() === 'atlas' && d.querySelectorAll('li.pl.pg-off').length === 0 && errs.length === 0, [view(), w.location.hash]);
    ({ d, w, errs } = boot(page, { seed: { view: 'gallery' } })); await sleep(120);
    chk('a stored Gallery choice wins over the Atlas default (D-46), written into the hash', view() === 'gallery' && /view=gallery/.test(w.location.hash), w.location.hash);
    d.querySelector('button[data-mode="sights"]').click(); await sleep(30);
    chk('in Gallery a lens tap keeps Gallery (view=gallery written, since a lens alone implies Atlas)', view() === 'gallery' && /view=gallery/.test(w.location.hash) && /mode=sights/.test(w.location.hash), w.location.hash);
    w.Cleo.route.go({ p: 'kanda-myojin' }); await sleep(60);
    chk('…and a deep link from there stays in Gallery (view=gallery kept)', view() === 'gallery' && /view=gallery/.test(w.location.hash) && /p=kanda-myojin/.test(w.location.hash), w.location.hash);
    ({ d, w, errs } = boot(page)); await sleep(120);
    d.querySelector('button[data-mode="sights"]').click(); await sleep(30);
    chk('in the default Atlas a lens tap keeps Atlas with no view= key', view() === 'atlas' && !/view=/.test(w.location.hash) && /mode=sights/.test(w.location.hash), w.location.hash);
    ({ d, w, errs } = boot(page, { hash: '#view=atlas&p=kanda-myojin' })); await sleep(150);
    const sh = d.getElementById('cleo-sheet');
    chk('#view=atlas&p=x opens the sheet over Atlas', view() === 'atlas' && !sh.hidden && /Kanda/.test(sh.textContent));
    ({ d, w, errs } = boot(page, { seed: { view: 'atlas' } })); await sleep(100);
    chk('stored preference → Atlas (the default: no view= needed)', view() === 'atlas' && !/view=gallery/.test(w.location.hash), w.location.hash);
    ({ d, w, errs } = boot(page, { seed: { view: 'atlas' }, hash: '#view=gallery' })); await sleep(100);
    chk('an explicit view= beats the stored preference (shared links)', view() === 'gallery');
    ({ d, w, errs } = boot(page, { storage: 'throws' })); await sleep(100);
    chk('storage blocked: the default (Atlas) still applies', view() === 'atlas', view());
    d.querySelector('[data-cleo-views] button[data-view="gallery"]').click(); await sleep(30);
    chk('storage blocked: switching still works, no error', view() === 'gallery' && errs.length === 0, errs.slice(0, 2));

    ({ d, w, errs } = boot(page, { hash: '#view=gallery&c=ANIME' })); await sleep(150);
    const set = [...d.querySelectorAll('li.pl:not([hidden])')];
    w.location.hash = '#view=gallery&c=ANIME&p=' + set[1].id.slice(2); await sleep(60);
    const pos = d.querySelector('#cleo-sheet [data-sh-pos]');
    chk('sheet: "2 of n in this view" counts the lensed set', !!pos && pos.textContent.startsWith('2 of ' + set.length + ' '), [pos && pos.textContent, set.length]);
    chk('sheet: "No. r of n in {area}"', /No\. \d+ of \d+ in /.test((d.querySelector('#cleo-sheet .sh-rank') || {}).textContent || ''));
    d.querySelector('#cleo-sheet [data-sh="go"][aria-label^="Next"]').click(); await sleep(60);
    chk('next walks the view order', /p=/.test(w.location.hash) && w.location.hash.indexOf(set[2].id.slice(2)) > 0 && d.querySelector('#cleo-sheet [data-sh-pos]').textContent.startsWith('3 of '), w.location.hash);
    chk('Gallery sheet = experience page (Plan your visit, one primary link, Close by)', !!d.querySelector('#cleo-sheet .sheet.exp .plan') && d.querySelectorAll('#cleo-sheet .primary-link').length <= 1 && !!d.querySelector('#cleo-sheet .closeby'));
    const st = d.querySelector('#cleo-sheet').textContent.replace(/We don’t track opening hours or prices/g, '');
    chk('no price / booking / rating / availability on the sheet', !/(\$|¥|€|£)\s?\d|\bbook(ing| now)\b|\breserv|\bavailab|\brating|\bstars?\b|\bprice/i.test(st));
    const hrefs = [...d.querySelectorAll('#cleo-sheet a[href]')].map(a => a.getAttribute('href')).filter(h => !h.startsWith('#'));
    chk('every outbound sheet link is absolute https', hrefs.every(h => /^https:\/\//.test(h)), hrefs.filter(h => !/^https:/.test(h)).slice(0, 3));
    chk('share link writes view= explicitly', /#view=gallery&/.test(d.querySelector('#cleo-sheet [data-sh="share"]').getAttribute('data-url')));
    chk('no js errors', errs.length === 0, errs.slice(0, 2));
  }

  console.log('\n== W4: one name field with diacritics, Gallery glyph, one sheet on the phone map, motion hooks (ROUND-3 #2, #5) ==');
  {
    const page = 'cities/tokyo.html', html = fs.readFileSync(path.join(BETA, page), 'utf8');
    const ds = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/tokyo.dataset.json'), 'utf8'));
    const live = new Set(); (function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.n === 'string') live.add(o.n); Object.values(o).forEach(walk); } })(ds);
    const pj = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places/tokyo.json'), 'utf8')).places;
    const lost = pj.filter(r => !live.has(r.n) && !live.has(r.n.replace(/\s*[—–-]+\s*CLOSED\b.*$/, ''))), macron = pj.filter(r => /[\u0100-\u024f]/.test(r.n)).length;
    chk('every place name is the dataset name verbatim, diacritics kept (one name field)', macron > 20 && lost.length === 0, { macron, lost: lost.slice(0, 3).map(r => r.n) });
    // a photo credit quotes the source's file title verbatim (TASL, e.g. "Sakura at Kanda Myojin Shrine" on Commons) —
    // that is the source's text, not our name field, so captions are left out of the "never unaccented" scan (imagery W7)
    const ours = html.replace(/<figcaption>[\s\S]*?<\/figcaption>|<small class="credit">[\s\S]*?<\/small>|<p class="hero-credit"[\s\S]*?<\/p>/g, '');
    chk('Kanda Myōjin: card, lead CTA and JSON-LD all carry the macron', /Kanda Myōjin <span class="nat"/.test(html) && /Start with Kanda Myōjin/.test(html) && /"name":"Kanda Myōjin/.test(html) && !/Kanda Myojin/.test(ours));
    chk('hero dek keeps Jōnan · Jōsai · Jōhoku', /Jōnan[\u00a0 ]· Jōsai[\u00a0 ]· Jōhoku/.test(html));   // FE-C R8 #2c: the space before "·" is non-breaking
    const gb = (html.match(/<button type="button" data-view="gallery"[^>]*>.*?<\/button>/) || [''])[0];
    chk('Gallery switcher glyph is the grid, not the Saved heart', /#i-grid/.test(gb) && !/#i-heart/.test(gb) && /<symbol id="i-grid"/.test(html), gb.slice(0, 120));

    // W7 Atlas map-search (Amendment 2): the R6 pin sheet over the phone map is retired; a pin selects its carousel card
    let { d, w, errs } = boot(page, { hash: '#view=atlas&map=1', mobile: true }); await sleep(150);
    const c0 = d.querySelector('li.pl[data-ll]');
    w.Cleo.city.select(c0, 'pin'); await sleep(10);
    chk('phone map: a pin selects its card in the carousel (no sheet covers the map)', c0.classList.contains('is-sel') && d.getElementById('cleo-poi').hidden && !d.documentElement.classList.contains('ms-list'));
    w.Cleo.city.select(d.querySelectorAll('li.pl[data-ll]')[3], 'swipe'); await sleep(10);
    chk('phone map: one selected card at a time', d.querySelectorAll('li.pl.is-sel').length === 1 && !c0.classList.contains('is-sel'));

    ({ d, w, errs } = boot(page, { hash: '#view=atlas' })); await sleep(150);
    const sv = d.querySelector('li.pl button.pl-save'); sv.click(); await sleep(10);
    chk('motion: a save that turns on gets .pop for one beat', sv.classList.contains('pop'));
    d.querySelector('[data-cleo-views] button[data-view="gallery"]').click(); await sleep(10);
    chk('motion: a view switch adds html.view-in', d.documentElement.classList.contains('view-in'));
    let rm = boot(page, { hash: '#view=atlas' }); rm.w.matchMedia = q => ({ matches: /reduce|min-width/.test(q), addListener() {}, removeListener() {} }); await sleep(150);
    const sv2 = rm.d.querySelector('li.pl button.pl-save'); sv2.click(); await sleep(10);
    rm.d.querySelector('[data-cleo-views] button[data-view="gallery"]').click(); await sleep(10);
    chk('motion: reduced motion adds no class at all', !sv2.classList.contains('pop') && !rm.d.documentElement.classList.contains('view-in'));
    chk('no js errors', errs.length === 0 && rm.errs.length === 0, errs.concat(rm.errs).slice(0, 2));
  }

  console.log('\n== W7: Atlas map-search (owner 2026-10-11, Amendment 2) ==');
  {
    const page = 'cities/tokyo.html';
    let { d, w, errs } = boot(page, { hash: '#view=atlas', mobile: true }); await sleep(150);
    const html = d.documentElement, split = d.querySelector('.split'), lp = d.querySelector('.listpane'), bar = d.querySelector('.ms-bar'), tog = d.querySelector('.ms-toggle');
    chk('phone Atlas opens map-first: html.atlas-m, the map view, no list over it', html.classList.contains('atlas-m') && split.getAttribute('data-view') === 'map' && !html.classList.contains('ms-list'), html.className);
    chk('…with no map= in the URL (map-first is the Atlas default, not a route)', !/map=/.test(w.location.hash), w.location.hash);
    // the view switcher sits in FE-A's search bar (.cbar) when the page has one, else at the end of the chip row
    const vw = d.querySelector('[data-cleo-views]');
    // SPEC-v3 §2.4 (rev 4): the bar's one best-places control is Top picks (.ms-top); Must see moved to Filters → Tier
    chk('…one chip row on top holds the toolbar and Top picks / Saved / Sort; the switcher stays in reach (search bar or chip row)', !!bar && !!bar.querySelector('[data-cleo-toolbar]') && !!bar.querySelector('.ms-top') && !bar.querySelector('.ms-must') && !!bar.querySelector('.ms-mine') && !!bar.querySelector('.ms-sort select') && !!vw && !!(vw.closest('.cbar') || vw.closest('.ms-bar')));
    const N = w.Cleo.city.info.total;
    chk('without the map library the results line counts every place', new RegExp('All ' + N.toLocaleString('en-US') + ' places').test(d.querySelector('.ms-count').textContent), d.querySelector('.ms-count').textContent);
    const n0 = w.history.length; tog.click(); await sleep(20);
    chk('"List" opens the full-screen list (one history entry)', html.classList.contains('ms-list') && w.history.length === n0 + 1 && /Map/.test(tog.textContent), [html.className, w.history.length - n0]);
    w.history.back(); await sleep(60);
    chk('Back closes the list and stays on the map', !html.classList.contains('ms-list') && html.classList.contains('atlas-m'));
    tog.click(); await sleep(20);
    d.querySelector('.area-end [data-cleo-map]').click(); await sleep(30);
    chk('"See these n on the map" names its area (map=<A>) and returns to the map', /map=[A-Z]/.test(w.location.hash) && !html.classList.contains('ms-list'), w.location.hash);
    // SPEC-v3 §2.4: the bar's best-places control is Top picks (top=1); Must see (t=1) is a Filters → Tier lens
    d.querySelector('.ms-top').click(); await sleep(30);
    chk('the Top picks chip is the top=1 route and shows pressed', /top=1/.test(w.location.hash) && d.querySelector('.ms-top').getAttribute('aria-pressed') === 'true', w.location.hash);
    chk('no js errors (phone)', errs.length === 0, errs.slice(0, 2));
    ({ d, w, errs } = boot(page, { hash: '#view=atlas&map=1', mobile: true })); await sleep(150);
    chk('#view=atlas&map=1 still opens the map', d.documentElement.classList.contains('atlas-m') && !d.documentElement.classList.contains('ms-list'));
    ({ d, w, errs } = boot(page, { hash: '#view=atlas' })); await sleep(150);
    const bar2 = d.querySelector('.ms-bar'), head = d.querySelector('.ms-head');
    chk('desktop Atlas: the toolbar moves into the filter bar above the split; area chips into the results head', d.documentElement.classList.contains('atlas-d') && !!bar2.querySelector(':scope > [data-cleo-toolbar]') && !!head.querySelector('.area-chips') && bar2.nextElementSibling === d.querySelector('.split'));
    chk('…"Search as I move the map" waits for the map (hidden without it)', head.querySelector('.ms-live').hidden === true);
    d.querySelector('[data-cleo-views] button[data-view="gallery"]').click(); await sleep(30);
    chk('…and everything goes back where it was outside Atlas', !bar2.querySelector('[data-cleo-toolbar]') && !head.querySelector('.area-chips') && !d.documentElement.classList.contains('atlas-d'));
    chk('no js errors (desktop)', errs.length === 0, errs.slice(0, 2));
  }

  console.log('# W8: "Start with" names the lead card (R6 gap #8), every place page');
  {
    const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (e.name === 'data' || e.name === 'assets' ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
    const pages = walk(BETA).map(f => [f, fs.readFileSync(f, 'utf8')]).filter(([, h]) => /data-cleo-page="city"/.test(h)), bad = [];
    for (const [f, h] of pages) {
      const file = (/"file":"([^"]+)"/.exec(h) || [])[1], g = file && path.join(BETA, 'data/gallery', file + '.json');
      const lead = g && fs.existsSync(g) ? JSON.parse(fs.readFileSync(g, 'utf8')).lead : null, a = /class="g-start"><a href="#p-([^"]+)">Start with ([^<]*)<\/a>/.exec(h);
      const dn = s => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
      if (!lead || !a || a[1] !== lead.id || !lead.n.startsWith(dn(a[2]))) bad.push([path.relative(BETA, f), a && a[1], lead && lead.id]);
    }
    chk(`"Start with" links and names the lead card's place on all ${pages.length} place pages`, pages.length >= 84 && !bad.length, bad.length ? bad.slice(0, 4) : pages.length);
  }

  console.log('# W8: "No. k of n in {area}" — n is the area\'s full count and k ≤ n (R7 gap 2f), every place on every page');
  {
    const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (e.name === 'data' || e.name === 'assets' ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
    const bad = []; let places = 0, pages = 0;
    for (const f of walk(BETA)) {
      const h = fs.readFileSync(f, 'utf8'); if (!/data-cleo-page="city"/.test(h)) continue; pages++;
      const file = (/"file":"([^"]+)"/.exec(h) || [])[1], j = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', file + '.json'), 'utf8'));
      // the sheet ranks a place over Cleo.defer.order(): every card in view order, live or still in a deferred chunk
      const ord = (h.match(/<li class="pl[ "][^>]*>/g) || []).map(t => [(/\bid="p-([^"]*)"/.exec(t) || [])[1], ((/\bdata-a="([^"]*)"/.exec(t) || [])[1] || '').replace(/&amp;/g, '&'), +((/\bdata-rank="(\d+)"/.exec(t) || [])[1] || 0)]);
      const rankOf = Object.fromEntries(ord.map(x => [x[0], x[2]]));
      const full = {}; j.places.forEach(p => { full[p.a] = (full[p.a] || 0) + 1; });
      for (const p of j.places) {
        places++; const inA = ord.filter(x => x[1] === p.a).map(x => x[0]);
        if (!(rankOf[p.id] === p.rank && p.rank >= 1 && p.rank <= full[p.a] && inA.length === full[p.a])) bad.push([path.relative(BETA, f), p.id, rankOf[p.id], p.rank, inA.length, full[p.a]]);
      }
    }
    chk(`"No. k of n": k = the data's rank (data-rank) ≤ n = the area's full count on all ${places} places (${pages} pages)`, places >= 8000 && !bad.length, bad.length ? bad.slice(0, 4) : places);
    const areaN = (file, a) => JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', file + '.json'), 'utf8')).places.filter(p => p.a === a).length;
    for (const [page, file, id] of [['cities/tokyo.html', 'tokyo', 'kanda-myojin'], ['cities/tokyo.html', 'tokyo', 'isegen'], ['cities/tokyo.html', 'tokyo', 'asukayama-park'], ['cleveland.html', 'cleveland', 'terminal-tower-observation-deck'], ['cleveland.html', 'cleveland', 'heinens-downtown']]) {   // QA-50: fresh #p= deep links
      const { d } = boot(page, { hash: '#view=gallery&p=' + id }); await sleep(150);
      const t = (d.querySelector('#cleo-sheet .sh-rank') || {}).textContent || '', m = /^No\. (\d+) of (\d+) in /.exec(t)
      const a = (/"a":"([^"]+)"/.exec(JSON.stringify(JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', file + '.json'), 'utf8')).places.find(p => p.id === id))) || [])[1];
      const rk = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', file + '.json'), 'utf8')).places.find(p => p.id === id).rank;
      chk(`sheet ${file}#p=${id} (fresh deep link): "${t}" = the data's rank ${rk} of the area's full ${areaN(file, a)}`, !!m && +m[1] === rk && +m[2] === areaN(file, a), [t, rk, areaN(file, a)]);
      if (id === 'heinens-downtown') {
        const pri = d.querySelector('#cleo-sheet .actions .btn-primary');
        chk('closed sheet: a "Closed" banner, and Directions is never the primary action', !!d.querySelector('#cleo-sheet .closed-banner') && !(pri && /Directions/.test(pri.textContent)), pri && pri.textContent);
      }
      chk(`sheet ${file}#p=${id}: "Recommended by" names a source under the name`, /^Recommended by \S|^Added by the guide/.test((d.querySelector('#cleo-sheet .sh-by') || {}).textContent || ''));
    }
  }

  console.log('# food covers (designer sign-off c): the word a food card names is a dish or cuisine, never a source or award');
  {
    const { AWARD } = require('./lib/dish');
    const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (e.name === 'data' || e.name === 'assets' ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
    const bad = []; let n = 0;
    for (const f of walk(BETA)) { const h = fs.readFileSync(f, 'utf8'); if (!/data-cleo-page="city"/.test(h)) continue;
      for (const m of h.matchAll(/class="in-d"><span class="sep"> · <\/span>([^<]*)/g)) { n++; if (AWARD.test(m[1])) bad.push([path.relative(BETA, f), m[1]]); } }
    for (const g of fs.readdirSync(path.join(BETA, 'data/gallery'))) for (const r of JSON.parse(fs.readFileSync(path.join(BETA, 'data/gallery', g), 'utf8')).rows) for (const x of r[6]) if (x.d) { n++; if (AWARD.test(x.d)) bad.push([g, x.id, x.d]); }
    chk(`${n} food card dish words: none is an award or source ("Michelin" falls through to the cuisine, else no word)`, n > 500 && !bad.length, bad.slice(0, 4));
    const tk = fs.readFileSync(path.join(BETA, 'cities/tokyo.html'), 'utf8'), seg = id => tk.slice(tk.indexOf('id="p-' + id + '"'), tk.indexOf('id="p-' + id + '"') + 1500);
    chk('a source named like a cuisine never blocks it (Rokurinsha → "Ramen", not hidden by "Ramen Adventures")', /class="in-d"><span class="sep"> · <\/span>Ramen</.test(seg('rokurinsha-tokyo-ramen-street')));
    chk('no cuisine but an award → no dish word at all (Sézanne), never the area', !/class="in-d"/.test(seg('sezanne').split('</li>')[0]));
  }

  console.log(failures ? `\n>>> FAIL — ${failures} FE-A check(s) failed` : '\n>>> PASS — FE-A: for-you reorders only, days honest, near-me in memory, pin sheet Esc, shared lists, views (switcher, pager, Atlas, sheet n of N)');
  process.exit(failures ? 1 : 0);
})();
