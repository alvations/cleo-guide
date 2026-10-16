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
 *  CARD   (W9-7) every place of every guide: the share-card spec carries the source line and the checked date, a closed
 *         place reads "Closed · kept for the record" with no write-up, a photo's credit rides with it; day / list / trip name
 *         every stop's source; each share action offers "Share as an image", which loads share-card.js lazily.
 *  BASE   (W9-5) 84 guides × 5 bases: every card line = haversine from the base, rounded by Cleo.geo.walk; the assumption
 *         once per view; a closed place can't be a base; Nearest to my base sorts by it and clearing restores the order
 *         exactly; storage throwing, &base= still works; the sheet offers it only for open, pinned places; Saved shows it.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..', '..');
const BETA = path.join(ROOT, 'beta');
let failures = 0;
const chk = (name, ok, got) => { console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${got !== undefined ? ' = ' + JSON.stringify(got) : ''}`); if (!ok) failures++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

function boot(page, { hash = '', storage = 'ok', seed = null, mods = [] } = {}) {
  let html = fs.readFileSync(path.join(BETA, page), 'utf8').replace(/<script src="((?:\.\.\/)*assets\/js\/[a-z-]+\.js)\?v=[^"]*" defer><\/script>/g,
    (m, src) => '<script>' + fs.readFileSync(path.join(BETA, path.dirname(page), src), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>');
  // inlined scripts have no src, so core can't find the site root from its own URL: give it the one a browser would derive
  html = html.replace('</head>', () => '<script>window.Cleo.root = location.href.split(\'/beta/\')[0] + \'/beta/\';</script></head>');
  // lazy modules (Cleo.need) load on first use; jsdom fetches no scripts, so the harness inlines them like a browser would
  if (mods.length) html = html.replace('</body>', () => mods.map(n => '<script>' + fs.readFileSync(path.join(BETA, 'assets/js', n + '.js'), 'utf8') + '</script>').join('') + '</body>');
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
  chk('the closed place is left out with its reason, a Closed chip, never the raw "— CLOSED" marker', !!left && /Unicorn Gundam[\s\S]*Closed — kept for the record, never planned \(checked/.test(left.textContent) &&
    !!left.querySelector('.tp-closed') && left.querySelector('.tp-closed').textContent === 'Closed' && !/— CLOSED/.test(left.textContent));
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

  console.log('\n== CARD (W9-7): share-card specs and the share actions ==');
  {
    const g = boot('trip.html', { mods: ['share-card'] }); await sleep(50);
    const SC = g.w.Cleo.shareCard, bad = [];
    let n = 0, nClosed = 0;
    for (const f of files) {
      const j = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8'));
      const G = { name: j.name, src: Object.fromEntries((j.sourceIndex || []).map(s => [s.id, String(s.name || s.id).split(' · ')[0]])), areas: Object.fromEntries(j.areas.map(a => [a.id, a.n])), colors: j.colors || {} };
      for (const p of j.places) { n++;
        const closed = !!p.closed || / [—–-]+ CLOSED\b/.test(p.n) || /\bclosed\b/i.test((p.pv || {}).status || '');
        const S = SC.spec('place', { guide: G, places: [p], photo: n % 3 ? null : { src: '/x.jpg', credit: 'Photo: A · CC BY 4.0 · Wikimedia Commons (resized)' }, url: 'x' });
        const why = [];
        if (!S.lines.some(l => /^(Recommended by .+|Added by the guide \(general knowledge\))$/.test(l))) why.push('no source line');
        if ((p.pv || {}).checked && !S.lines.some(l => l.endsWith('· ' + p.pv.checked))) why.push('no checked date');
        if (closed) { nClosed++; if (S.status !== 'Closed · kept for the record' || S.why) why.push('closed not stated, or a write-up'); }
        if (!closed && S.status === 'Closed · kept for the record') why.push('open place marked closed');
        if (S.photo && S.lines.indexOf(S.credit) < 0) why.push('photo without its credit');
        if (S.alt.indexOf(S.source) < 0) why.push('alt text misses the source');
        if (why.length && bad.length < 4) bad.push([j.key, p.id, why]);
      }
      const ps = j.places.slice(0, 8), D = SC.spec('day', { guide: G, places: ps, title: 'A day', url: 'x' });
      if (D.stops.length !== ps.length || D.stops.some(s => !/^(Recommended by |Added by the guide)/.test(s.source)) || ((ps.some(p => (p.pv || {}).checked)) && !/^Status checked to \d{4}-\d\d-\d\d$/.test(D.checked))) bad.push([j.key, 'day spec']);
    }
    chk(`${n} places (${nClosed} closed): every card names its source and checked date; closed ones say so, with no write-up; a photo carries its credit`, bad.length === 0, bad);
    const T = SC.spec('trip', { guide: {}, places: [], title: 'T', days: [{ area: 'A', guide: { src: { s1: 'One' }, colors: {} }, places: [{ id: 'a', n: 'A', src: ['s1'], la: 1, ln: 1, pv: { checked: '2026-10-01' } }, { id: 'b', n: 'B', src: ['guide'], la: 1.001, ln: 1 }] }], url: 'x' });
    const LC = SC.spec('list', { guide: { src: {}, colors: {} }, places: [{ id: 'z', n: 'Z — CLOSED', closed: true, src: ['guide'], la: 1, ln: 1 }], title: 'L', url: 'x' });
    chk('a closed stop is flagged on the card and in its alt text, and kept out of the route', LC.stops[0].closed && /Z \(closed, kept for the record\)/.test(LC.alt) && LC.route.length === 0 && LC.closedNote);
    chk('trip spec: day labels, every stop sourced, walking estimate labelled straight-line', T.stops[0].dayLabel === 'Day 1 · A' && T.stops[1].source === 'Added by the guide (general knowledge)' && /straight-line$/.test(T.status), T.status);

    // the share actions: each offers "Share as an image"; a tap asks core for share-card.js at this page's version
    const c1 = boot('cities/tokyo.html', { hash: '#p=senso-ji' }); await sleep(400);
    const pb = c1.d.querySelector('#cleo-sheet [data-cleo-card="place"]');
    chk('place sheet: "Share as an image"', !!pb && pb.getAttribute('data-id') === 'senso-ji' && pb.textContent === 'Share as an image');
    pb.click(); await sleep(20);
    const v = JSON.parse(c1.d.getElementById('cleo-city').textContent).js['share-card'], sc = [...c1.d.querySelectorAll('script[src*="share-card.js"]')];
    chk('a tap loads share-card.js once, at the page’s version (lazy, never on first load)', sc.length === 1 && v && sc[0].getAttribute('src').endsWith('assets/js/share-card.js?v=' + v) && !/share-card\.js/.test(fs.readFileSync(path.join(BETA, 'cities/tokyo.html'), 'utf8').replace(/"share-card":"[0-9a-f]+"/, '')), sc.map(x => x.getAttribute('src')));
    const c2 = boot('cities/tokyo.html', { hash: '#day=TAITO', mods: ['day'] }); await sleep(400);
    chk('day mode: "Share as an image" beside "Share this day"', !!c2.d.querySelector('.day .sharebar [data-cleo-card="day"]'));
    const c3 = boot('saved.html', { seed: { saved } }); await sleep(300);
    const lb = c3.d.querySelector('[data-cleo-card="list"]');
    chk('Saved: "Share as an image" carries the list', !!lb && g.w.Cleo.listCodec.decode(lb.getAttribute('data-refs')).length === ids.length && lb.getAttribute('data-name') === 'All saved');
    const c4 = boot('trip.html', { hash: url }); await sleep(200);
    chk('trip: "Share as an image" in the trip’s share bar', !!c4.d.querySelector('.sharebar [data-cleo-card="trip"]'));
    chk('no js errors (share actions)', [c1, c2, c3, c4].every(x => !x.errs.length), [].concat(c1.errs, c2.errs, c3.errs, c4.errs).slice(0, 2));
  }

  console.log('\n== BASE (W9-5): every card, every guide, 5 bases each ==');
  {
    const R = Math.PI / 180, hav = (a, b) => { const h = Math.sin((b[0] - a[0]) * R / 2) ** 2 + Math.cos(a[0] * R) * Math.cos(b[0] * R) * Math.sin((b[1] - a[1]) * R / 2) ** 2; return 2 * 6371.0088 * Math.asin(Math.min(1, Math.sqrt(h))); };
    const want = (o, p, name, closed) => { const m = hav(o, [p.la, p.ln]) * 1000, r = Math.round(m / 10) * 10, min = Math.round(m / 80);
      return (closed ? 'Where it was: ' : '') + (r < 1000 ? r + ' m' : (m / 1000).toFixed(1) + ' km') + ' from ' + name + ' · ' + (min < 1 ? 'under 1 min walk' : min + ' min walk'); };
    const g = boot('cities/tokyo.html', { hash: '#base=senso-ji', storage: 'throws', mods: ['base'] }); await sleep(250);
    const B = g.w.Cleo.base, bad = [], short = p => String(p.n).replace(/\s+[—–-]+\s*CLOSED\b.*$/, '').replace(p.nat ? ' (' + p.nat + ')' : '\u0000', '').trim();
    let n = 0, guides = 0;
    for (const f of files) {
      const j = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8')), k = j.key;
      const ok = j.places.filter(p => p.la != null && !p.closed && !/ [—–-]+ CLOSED\b/.test(p.n) && !/\bclosed\b/i.test((p.pv || {}).status || ''));
      if (!ok.length) continue; guides++;
      await B.load(k);
      for (let i = 0; i < 5; i++) {
        const b = ok[Math.floor(i * (ok.length - 1) / 4)]; B.set(k, b.id);
        for (const p of j.places) { if (p.la == null) continue; n++;
          const closed = !!p.closed || / [—–-]+ CLOSED\b/.test(p.n) || /\bclosed\b/i.test((p.pv || {}).status || '');
          const got = B.line(p, k), exp = p.id === b.id ? 'Your base' : want([b.la, b.ln], p, short(b), closed);
          if (got !== exp && bad.length < 4) bad.push([k, b.id, p.id, got, exp]); }
      }
      B.set(k, null);
    }
    chk(`${guides} guides × 5 bases: all ${n} card lines equal the haversine distance, rounded (metres to 10, km to 0.1, min = round(m ÷ 80))`, bad.length === 0, bad);

    // the page itself: &base= with storage throwing
    const g2 = boot('cities/tokyo.html', { hash: '#base=senso-ji', storage: 'throws', mods: ['base'] }); await sleep(300);
    const W = g2.w, D = g2.d; W.Cleo.defer.all(); await sleep(80);
    const tj = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places/tokyo.json'), 'utf8')), by = {}; tj.places.forEach(p => { by[p.id] = p; });
    const cards = [...D.querySelectorAll('li.pl[id^="p-"]')], pinned = cards.filter(c => by[c.id.slice(2)].la != null);
    const lines = pinned.map(c => (c.querySelector('[data-cleo-bl]') || {}).textContent);
    chk('storage throwing: &base= still works, every pinned card carries its line', pinned.length > 400 && lines.every(Boolean), [pinned.length, lines.filter(Boolean).length]);
    chk('the base card says "Your base"', (D.querySelector('#p-senso-ji [data-cleo-bl]') || {}).textContent === 'Your base');
    chk('the assumption is stated once in the view', D.querySelectorAll('#cleo-basenote').length === 1 && (D.getElementById('cleo-basenote').textContent.match(/80 m a minute/g) || []).length === 1);
    const closedCard = cards.find(c => c.hasAttribute('data-closed') && by[c.id.slice(2)].la != null);
    chk('a closed place reads "Where it was: …", no call to visit', !closedCard || /^Where it was: /.test(closedCard.querySelector('[data-cleo-bl]').textContent), closedCard && closedCard.id);
    const order = () => [...D.querySelectorAll('ol.pls')].map(ol => [...ol.querySelectorAll(':scope > li.pl')].map(c => c.id).join()).join('|');
    const o0 = order();
    D.querySelector('[data-cleo-base="sort"]').click(); await sleep(80);
    const km = c => W.Cleo.city.baseKm(c), sorted = [...D.querySelectorAll('ol.pls')].every(ol => { const l = [...ol.querySelectorAll(':scope > li.pl')].map(km); return l.every((v, i) => !i || l[i - 1] <= v); });
    chk('"Nearest to my base" sorts every area by distance from the base', sorted && order() !== o0);
    chk('the sort pill shows while a base is set', D.querySelector('#cleo-tray [data-f="sort"][data-v="base"]').hidden === false);
    D.querySelector('[data-cleo-base="clear"]').click(); await sleep(120);
    chk('clearing the base restores the guide’s order exactly', order() === o0);
    chk('clearing removes every line, the note and the sort', !D.querySelector('[data-cleo-bl]') && !D.getElementById('cleo-basenote') && !W.Cleo.base.get() && !/base=/.test(W.location.hash));
    chk('no js errors (base page)', g2.errs.length === 0, g2.errs.slice(0, 2));

    // closed or unpinned: never a base
    const cl = tj.places.find(p => p.closed);
    const g3 = boot('cities/tokyo.html', { hash: '#base=' + cl.id, mods: ['base'] }); await sleep(600);
    chk('a closed place in &base= is refused and cleared with the reason', !g3.w.Cleo.base.get() && !g3.d.querySelector('[data-cleo-bl]') && [...g3.d.querySelectorAll('.toast')].some(t => /^Your base was cleared: it is closed\.$/.test(t.textContent)), cl.id);
    chk('choose() refuses a closed place', g3.w.Cleo.base.choose('tokyo', cl.id) === false && !g3.w.Cleo.base.get());

    // the sheet: offered for an open, pinned place; never for a closed one
    const g4 = boot('cities/tokyo.html', { hash: '#p=kanda-myojin', mods: ['base'] }); await sleep(400);
    const setB = g4.d.querySelector('#cleo-sheet [data-cleo-base="set"]');
    chk('the sheet of an open, pinned place offers "Set as my base"', !!setB && setB.textContent === 'Set as my base');
    setB.click(); await sleep(150);
    chk('setting it stores it on the device, puts &base= in the URL and marks the sheet', JSON.parse(g4.w.localStorage.getItem('cleo:v1:mybase')).tokyo === 'kanda-myojin' && /base=kanda-myojin/.test(g4.w.location.hash) && /Your base/.test(g4.d.querySelector('[data-cleo-base-fact]').textContent));
    g4.w.location.hash = '#p=' + cl.id; await sleep(400);
    chk('the sheet of a closed place never offers it', !!g4.d.querySelector('#cleo-sheet .sheet') && !g4.d.querySelector('#cleo-sheet [data-cleo-base="set"]'));
    chk('no js errors (sheet)', g4.errs.length === 0, g4.errs.slice(0, 2));

    // Saved: cards of the guide that has a base carry the line
    const g5 = boot('saved.html', { seed: { saved: { 'tokyo/ueno-park': { t: 1 }, 'tokyo/kanda-myojin': { t: 2 }, 'cleveland/west-side-market': { t: 3 } }, mybase: { tokyo: 'senso-ji' } }, mods: ['base'] }); await sleep(400);
    const sl = [...g5.d.querySelectorAll('#cleo-saved li.pl')].map(c => (c.querySelector('[data-cleo-bl]') || {}).textContent || '');
    chk('Saved: Tokyo cards show the distance from the Tokyo base; other guides show none', sl.filter(t => / from Sensō-ji · /.test(t)).length === 2 && sl.filter(t => !t).length === 1, sl);
    chk('Saved: the assumption once', g5.d.querySelectorAll('#cleo-basenote').length === 1);
    chk('no js errors (saved)', g5.errs.length === 0, g5.errs.slice(0, 2));

    // first load without a base: base.js is not requested
    const h = fs.readFileSync(path.join(BETA, 'cities/tokyo.html'), 'utf8');
    chk('no page loads base.js eagerly (it is lazy, on a base or a sheet)', !/assets\/js\/base\.js/.test(h) && /"base":"[0-9a-f]+"/.test(h));
  }

  console.log('\n== PRINT: one day a page ==');
  const css = require('./lib/render/trip').CSS;
  chk('booklet: each day breaks to a new page, actions hidden', /@media print\{[^]*\.tday\{break-before:page;break-inside:avoid/.test(css) && /@media print\{[^]*\.sharebar/.test(css));

  console.log(failures ? `\n>>> FAIL — ${failures} check(s) failed` : '\n>>> PASS — FE-C gate: trips (W9-4), base (W9-5), share cards (W9-7)');
  process.exit(failures ? 1 : 0);
})();
