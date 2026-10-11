#!/usr/bin/env node
'use strict';
/**
 * tools/beta/test-fe-c.js — FE-C W9 gate (jsdom, network gone), wired into `npm test`.
 *
 *  WALK   Cleo.geo.walk is the one walking helper: min = round(metres ÷ 80), metres to 10 under 1 km.
 *  PLAN   for every guide (84 datasets), all its places planned into 7 days: 0 closed or unpinned stops, one area a
 *         day, ≤ 6 stops a day, and every place is either in a day or left out with a reason (none dropped).
 *  LINK   encode → decode is lossless (days, order, left-out).
 *  PAGE   saved places → "Make the trip" → the #trip= link reopens in a FRESH context (storage throwing) with the
 *         identical days and order; every stop shows its first source; the walking assumption is printed once;
 *         a closed place is left out with its reason; an unknown id is reported, never dropped silently.
 *  PRINT  the booklet puts each day on its own page.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..', '..');
const BETA = path.join(ROOT, 'beta');
let failures = 0;
const chk = (name, ok, got) => { console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${got !== undefined ? ' = ' + JSON.stringify(got) : ''}`); if (!ok) failures++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

function boot(page, { hash = '', storage = 'ok', seed = null } = {}) {
  const html = fs.readFileSync(path.join(BETA, page), 'utf8').replace(/<script src="((?:\.\.\/)*assets\/js\/[a-z-]+\.js)\?v=[^"]*" defer><\/script>/g,
    (m, src) => '<script>' + fs.readFileSync(path.join(BETA, path.dirname(page), src), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>');
  const errs = [], net = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://x.test/beta/' + page + hash,
    beforeParse(w) {
      w.Element.prototype.scrollIntoView = function () {}; w.scrollTo = () => {};
      w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
      if (storage === 'throws') Object.defineProperty(w, 'localStorage', { get() { throw new Error('SecurityError'); } });
      else if (seed) for (const k in seed) w.localStorage.setItem('cleo:v1:' + k, JSON.stringify(seed[k]));
      w.fetch = u => { const url = new URL(u, w.location.href); net.push(url.href);
        const p = path.join(BETA, url.pathname.replace(/^\/beta\//, ''));
        return url.origin === 'https://x.test' && fs.existsSync(p) ? Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(fs.readFileSync(p, 'utf8'))) }) : Promise.resolve({ ok: false, status: 404 }); };
      w.addEventListener('error', e => errs.push('ERR ' + (e.message || e.error)));
    },
  });
  dom.window.console.error = (...a) => errs.push('console.error: ' + a.join(' '));
  return { w: dom.window, d: dom.window.document, errs, net };
}
const days = d => [...d.querySelectorAll('.tday')].map(s => [...s.querySelectorAll('.tstop .go')].map(a => a.getAttribute('href').split('#p=')[1]));

(async () => {
  console.log('\n== WALK: one helper, straight-line ÷ 80 m a minute ==');
  const { w } = boot('trip.html');
  const G = w.Cleo.geo;
  chk('650 m reads "650 m · 8 min walk"', G.walk(0.65).text === '650 m · 8 min walk', G.walk(0.65).text);
  chk('1.43 km reads "1.4 km · 18 min walk"', G.walk(1.43).text === '1.4 km · 18 min walk', G.walk(1.43).text);
  chk('30 m reads "under 1 min walk"', /under 1 min walk$/.test(G.walk(0.03).text), G.walk(0.03).text);
  let bad = 0; for (let i = 0; i < 500; i++) { const k = i * 0.0137; if (G.walk(k).min !== Math.round(k * 1000 / 80)) bad++; }
  chk('min = round(metres ÷ 80) on 500 distances', bad === 0, bad);
  chk('the assumption names straight-line and 80 m a minute', /straight-line, about 80 m a minute/.test(G.ASSUME), G.ASSUME);

  console.log('\n== PLAN: every guide, 7 days ==');
  const files = fs.readdirSync(path.join(BETA, 'data/places')).filter(f => f.endsWith('.json'));
  const T = w.Cleo.trip, probs = [];
  let nDays = 0, nStops = 0, nLeft = 0, closedSeen = 0;
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8'));
    const items = j.places.map(p => ({ ref: j.key + '/' + p.id, key: j.key, id: p.id, a: p.a, ll: p.la != null ? [p.la, p.ln] : null,
      closed: !!p.closed || / [—–-]+ CLOSED\b/.test(p.n), t: p.t, rank: p.rank }));
    closedSeen += items.filter(x => x.closed).length;
    const t = T.plan(items, 7), inDays = t.days.flatMap(u => u.items);
    if (t.days.length > 7) probs.push(f + ': > 7 days');
    t.days.forEach(u => { if (u.items.length > 6) probs.push(f + ': day of ' + u.items.length);
      if (new Set(u.items.map(x => x.a)).size !== 1) probs.push(f + ': mixed areas'); });
    if (inDays.some(x => x.closed || !x.ll)) probs.push(f + ': closed or unpinned stop');
    if (inDays.length + t.left.length !== items.length) probs.push(f + `: ${items.length - inDays.length - t.left.length} dropped`);
    if (t.left.some(l => !l.why)) probs.push(f + ': left out with no reason');
    if (t.left.some(l => l.x.closed && l.why !== 'closed')) probs.push(f + ': closed place given another reason');
    const back = T.decode(T.encode(t));
    if (JSON.stringify(back.days) !== JSON.stringify(t.days.map(u => u.items.map(x => x.ref))) || back.left.join() !== t.left.map(l => l.x.ref).join()) probs.push(f + ': link not lossless');
    nDays += t.days.length; nStops += inDays.length; nLeft += t.left.length;
  }
  chk(`${files.length} guides: ≤ 7 days, one area a day, ≤ 6 stops, 0 closed/unpinned stops, 0 dropped, link lossless`, probs.length === 0, probs.slice(0, 4));
  chk(`closed places exist in the data and all were refused (${closedSeen})`, closedSeen > 0);
  console.log(`  INFO  ${nDays} days, ${nStops} stops, ${nLeft} left out with a reason`);

  console.log('\n== PAGE: build → share → reopen in a fresh context ==');
  const ids = ['senso-ji', 'tokyo-national-museum', 'ueno-park', 'kappabashi-dogu-gai', 'yanaka-cemetery', 'asakusa-shrine', 'national-museum-of-western-art',
    'shibuya-scramble-crossing', 'yoyogi-park', 'meiji-jingu', 'hachiko-statue', 'unicorn-gundam-statue-divercity-tokyo-plaza', 'shinjuku-golden-gai', 'no-such-place'];
  const saved = {}; ids.forEach((id, i) => { saved['tokyo/' + id] = { t: i }; });
  const a = boot('trip.html', { hash: '#from=all', seed: { saved } });
  await sleep(150);
  const form = a.d.getElementById('tp-form');
  chk('builder offers 1–7 days', !!form && form.querySelectorAll('input[name=days]').length === 7);
  form.querySelector('input[value="3"]').checked = true;
  form.dispatchEvent(new a.w.Event('submit', { cancelable: true })); await sleep(50);
  a.w.dispatchEvent(new a.w.HashChangeEvent('hashchange')); await sleep(150);
  const url = a.w.location.hash, D1 = days(a.d);
  chk('the trip has 3 days and a #trip= link', D1.length === 3 && /^#trip=/.test(url), [D1.length, url.slice(0, 60)]);
  chk('the trip is remembered on this device', (JSON.parse(a.w.localStorage.getItem('cleo:v1:trips')) || []).length === 1);
  const stops = [...a.d.querySelectorAll('.tstop')];
  chk('every stop shows its first source', stops.length > 0 && stops.every(s => /^(Recommended by .+|Added by the guide \(general knowledge\))$/.test(s.querySelector('.tstop-src').textContent)), stops.length);
  chk('every leg shows a walking estimate', [...a.d.querySelectorAll('.tday')].every(s => s.querySelectorAll('.leg').length === s.querySelectorAll('.tstop').length - 1) &&
    [...a.d.querySelectorAll('.leg')].every(l => /^\d[\d.]* k?m · (\d+ min|under 1 min) walk to stop \d/.test(l.textContent)));
  chk('the walking assumption is printed once', a.d.querySelectorAll('[data-tp-assume]').length === 1 && (a.d.getElementById('cleo-trip').textContent.match(/80 m a minute/g) || []).length === 1);
  const left = a.d.querySelector('.tp-left');
  chk('the closed place is left out with its reason', !!left && /Unicorn Gundam[\s\S]*CLOSED[\s\S]*Closed — kept for the record, never planned \(checked/.test(left.textContent));
  chk('places that did not fit are named with the reason', /Didn’t fit in 3 days/.test(left ? left.textContent : ''));
  chk('the unknown id is reported, not dropped', /no-such-place/.test((a.d.querySelector('.tp-gone') || {}).textContent || ''));
  chk('no closed place in any day', [...a.d.querySelectorAll('.tday')].every(s => !/CLOSED/.test(s.textContent)));
  const dl = a.d.querySelector('[data-tp-day="1"]').getAttribute('href');
  chk('a day opens its guide in day mode (#day=<area>&s=<ids>&trip=…&d=1)', /cities\/tokyo\.html#day=[A-Z]+&s=[a-z0-9,-]+&trip=.+&d=1$/.test(dl) && dl.includes('&s=' + D1[0].join(',') + '&'), dl.slice(0, 90));
  chk('only same-origin JSON was requested', a.net.every(u => u.startsWith('https://x.test/beta/data/places/')), a.net);
  chk('no js errors (build)', a.errs.length === 0, a.errs.slice(0, 2));

  const b = boot('trip.html', { hash: url, storage: 'throws' }); await sleep(150);
  chk('reopened with storage throwing: identical days and order', JSON.stringify(days(b.d)) === JSON.stringify(D1), days(b.d));
  chk('reopened: the same left-out list and unknown report', (b.d.querySelector('.tp-left') || {}).textContent === left.textContent && !!b.d.querySelector('.tp-gone'));
  chk('no js errors (reopen)', b.errs.length === 0, b.errs.slice(0, 2));
  const c = boot('trip.html', { hash: url + '&d=2' }); await sleep(150);
  chk('&d=2 focuses day 2', c.d.activeElement && c.d.activeElement.id === 'tday-h-2', c.d.activeElement && c.d.activeElement.id);

  const e = boot('trip.html', { storage: 'throws' }); await sleep(50);
  chk('nothing saved: the empty state, no errors', /Nothing saved yet/.test(e.d.getElementById('cleo-trip').textContent) && e.errs.length === 0, e.errs);

  console.log('\n== SAVED → TRIP: the "Make a trip" hook (saved.js, FE-C W9-4 hook) ==');
  const lst = [{ id: 'lweek', n: 'Weekend', r: ['tokyo/senso-ji', 'tokyo/asakusa-shrine', 'tokyo/kappabashi-dogu-gai', 'tokyo/ueno-park'] }];
  for (const [label, hash, seed] of [['a named list', '#v=lweek', { saved, lists: lst }], ['a shared list link', '#list=tokyo:senso-ji,asakusa-shrine,ueno-park&n=Shared', null]]) {
    const sv = boot('saved.html', { hash, seed }); await sleep(200);
    const ln = sv.d.querySelector('[data-cleo-trip]'), href = ln && ln.getAttribute('href');
    chk(`${label}: Saved offers "Make a trip"`, !!ln && /^trip\.html#(from=lweek|list=tokyo)/.test(href), href);
    if (!ln) continue;
    const tp = boot('trip.html', { hash: href.slice('trip.html'.length), seed }); await sleep(150);
    const f = tp.d.getElementById('tp-form');
    if (f) { f.dispatchEvent(new tp.w.Event('submit', { cancelable: true })); await sleep(50); tp.w.dispatchEvent(new tp.w.HashChangeEvent('hashchange')); await sleep(150); }
    const got = days(tp.d).flat().sort(), want = (label === 'a named list' ? lst[0].r : ['tokyo/senso-ji', 'tokyo/asakusa-shrine', 'tokyo/ueno-park']).map(r => r.split('/')[1]).sort();
    chk(`${label}: the link opens a trip of exactly that list`, JSON.stringify(got) === JSON.stringify(want), got);
    chk(`${label}: no js errors`, !sv.errs.length && !tp.errs.length, sv.errs.concat(tp.errs).slice(0, 2));
  }

  console.log('\n== PRINT: one day a page ==');
  const css = require('./lib/render/trip').CSS;
  chk('booklet: each day breaks to a new page, actions hidden', /@media print\{[^]*\.tday\{break-before:page;break-inside:avoid/.test(css) && /@media print\{[^]*\.sharebar/.test(css));

  console.log(failures ? `\n>>> FAIL — ${failures} check(s) failed` : '\n>>> PASS — FE-C trips gate');
  process.exit(failures ? 1 : 0);
})();
