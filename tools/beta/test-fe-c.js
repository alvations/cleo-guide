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
 *  REC    (W9-1) on all 84 built pages, every card's badges equal platform's rec data exactly (none inferred): award
 *         links to its own award source, "Cited by n sources" carries n, a closed place has no data-rec and only a hidden
 *         copy for its detail. The Recognised lens shows exactly the recognised open places; "Show all" restores every place.
 *  LF     (W9-9) the Local favourites lens exists exactly where platform's data allows it (n ≥ 5, no gap); every place in it
 *         is open and every one of its sources is typed local press / writer or vetted creator (the printed rule); elsewhere
 *         the tray states the gap and there is no door.
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
  { const lk = left && [...left.querySelectorAll('li.closed a[rel="noopener"]')][0], uj = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places/tokyo.json'), 'utf8')).places.find(p => /unicorn/.test(p.id)).pv.ss;
    chk('the closed place\'s status source is a link (pv.ss), named by its host, never a bare URL', !!lk && lk.getAttribute('href') === uj && lk.textContent === 'tokyoweekender.com' && /Source: tokyoweekender\.com/.test(left.textContent) && !/Source: https?:/.test(left.textContent), lk && [lk.getAttribute('href'), lk.textContent]); }
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
  // i18n D-41: the ja catalogue arriving after the first draw redraws the trip in it, and focus stays on the same control
  { const sb = b.d.querySelector('[data-tp="kml"]'); sb.focus();
    b.w.CleoL10n = { 'trip.kml': 'KML⟦x⟧', 'day.kml': 'KML⟦x⟧', 'trip.share': '共有⟦x⟧' };
    b.d.dispatchEvent(new b.w.CustomEvent('cleo:locale', { detail: { locale: 'ja' } })); await sleep(150);
    const ae = b.d.activeElement;
    chk('cleo:locale: the trip redraws in the new catalogue and focus stays on the same control', /⟦x⟧/.test(b.d.querySelector('[data-tp="share"]').textContent) && !!ae && ae.getAttribute('data-tp') === 'kml', ae && ae.outerHTML.slice(0, 60));
    b.w.CleoL10n = null; }
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
    // the card palette is the LIGHT tokens, copied exactly (designer review): no drift from beta/assets/tokens.css
    { const tok = fs.readFileSync(path.join(BETA, 'assets/tokens.css'), 'utf8'), root = tok.slice(tok.indexOf(':root'), tok.indexOf('}', tok.indexOf(':root')));
      const v = n => ((new RegExp('--' + n + '\\s*:\\s*(#[0-9A-Fa-f]{6})').exec(root) || [])[1] || '').toUpperCase();
      const src = fs.readFileSync(path.join(__dirname, 'client/share-card.js'), 'utf8'), COL = {};
      (/var COL = \{([^}]*)\}/.exec(src) || ['', ''])[1].replace(/(\w+): '(#[0-9A-Fa-f]{6})'/g, (m, k, c) => { COL[k] = c.toUpperCase(); });
      const map = { paper: 'paper', surface: 'surface', sand: 'sand', ink: 'ink', ink2: 'ink-2', ink3: 'ink-3', line: 'line', accent: 'accent', sunWash: 'sun-wash', onSunWash: 'on-sun-wash', closed: 'closed', coverSight: 'sand' };
      const drift = Object.keys(map).filter(k => COL[k] !== v(map[k])).map(k => k + ' ' + COL[k] + ' ≠ --' + map[k] + ' ' + v(map[k]));
      const mix = (a, b, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.substr(i, 2), 16) * t + parseInt(b.substr(i, 2), 16) * (1 - t)).toString(16).padStart(2, '0')).join('').toUpperCase();
      if (COL.coverFood !== mix(v('sun'), v('sand'), 0.07)) drift.push('coverFood ' + COL.coverFood + ' ≠ mix ' + mix(v('sun'), v('sand'), 0.07));
      chk('share-card palette = the light tokens (tokens.css :root), no off-palette fallback', drift.length === 0 && !/#C23A1C/i.test(src) && !/initial/.test(src.replace(/no initials/, '')), drift); }
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

  console.log('\n== REC (W9-1): recognition badges from platform data only ==');
  {
    const bad = []; let nb = 0, np = 0, nClosedRec = 0;
    for (const f of files) {
      const j = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8')), html = fs.readFileSync(path.join(BETA, j.beta), 'utf8');
      const award = new Set((j.sourceIndex || []).filter(x => x.award).map(x => x.id));
      for (const p of j.places) { np++;
        const m = new RegExp('<li class="pl[^"]*" id="p-' + p.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*>([\\s\\S]*?)</li>').exec(html.replace(/<\/?noscript[^>]*>/g, ''));
        if (!m) { bad.push([j.key, p.id, 'card not found']); continue; }
        const tag = m[0].slice(0, m[0].indexOf('>')), rec = p.rec || {}, closed = !!p.closed;
        const want = ['award', 'video', 'cited'].filter(k => k === 'cited' ? rec.cited >= 3 : (rec[k] || []).length);
        const A = n => (new RegExp(' ' + n + '="([^"]*)"').exec(tag) || [])[1] || '';
        if (A('data-rec') !== (closed ? '' : want.join(' ')) || A('data-rec0') !== (closed ? want.join(' ') : '')) bad.push([j.key, p.id, 'kinds', A('data-rec'), A('data-rec0'), want]);
        if (A('data-ra') !== (rec.award || []).join(' ') || A('data-rv') !== (rec.video || []).join(' ')) bad.push([j.key, p.id, 'source ids']);
        if ((rec.award || []).some(id => !award.has(id))) bad.push([j.key, p.id, 'award id is not an award source']);
        if (rec.cited >= 3 && A('data-src').split(' ').filter(x => x && x !== 'guide').length !== rec.cited) bad.push([j.key, p.id, 'cited n ≠ the card\'s named sources']);
        if (/class="pl-rec/.test(m[1])) bad.push([j.key, p.id, 'badge markup sent from the server (page weight)']);
        if (want.length) { nb++; if (closed) nClosedRec++; }
      }
    }
    chk(`${files.length} pages, ${np} places: ${nb} badge rows (${nClosedRec} closed, hidden) carry exactly platform's rec data as attributes; none without data`, bad.length === 0, bad.slice(0, 4));

    const tj = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places/tokyo.json'), 'utf8'));
    { const g = boot('cities/tokyo.html', { mods: ['recognition'] }); await sleep(200); g.w.Cleo.defer.all(); await sleep(50);
      const by = {}; tj.places.forEach(p => { by[p.id] = p; }); const probs = []; let rows = 0;
      g.d.querySelectorAll('li.pl[id^="p-"]').forEach(c => { const p = by[c.id.slice(2)], rec = p.rec || {}, r = c.querySelector(':scope > .pl-rec');
        const n = (rec.award || []).length + (rec.video || []).length;   // R8 #2e: a card leaves "Cited by" to its "+N more"
        if (r && r.querySelector('.rb-cited')) probs.push(p.id + ' card shows Cited by and +N more');
        if (!n) { if (r) probs.push(p.id + ' extra'); return; } rows++;
        if (!r || r.querySelectorAll('a.rb').length !== n) { probs.push(p.id + ' count'); return; }
        if (!!p.closed !== r.classList.contains('closed')) probs.push(p.id + ' closed must be hidden (and only closed)');
        (rec.award || []).forEach(id => { const a = r.querySelector('a.rb-award[href="#src=' + id + '"]'); const nm = c.querySelector('.pl-s button.src[data-src="' + id + '"]');
          if (!a || a.textContent !== 'Award · ' + (nm ? nm.textContent.trim() : id)) probs.push(p.id + ' award ' + id); });
        });
      chk(`Tokyo: recognition.js draws ${rows} card badge rows, each equal to the data (award named by the card's own chip; closed hidden; never "Cited by" beside "+N more")`, rows > 100 && probs.length === 0, probs.slice(0, 4));
      chk('no js errors (recognition.js)', !g.errs.length, g.errs.slice(0, 2)); }
    // the Gallery row cards (li.gc) and the Guidebook entries (li.ge): badges from the page dataset, the same rec data
    for (const [view, sel, links] of [['gallery', 'li.gc[data-id]', false], ['guidebook', 'li.ge[data-id]', true]]) {
      const g = boot('cities/tokyo.html', { hash: '#view=' + view, mods: ['recognition', 'gallery', 'guidebook'] }); await sleep(900);
      if (g.w.Cleo.recog) g.w.Cleo.recog.views(); await sleep(300);
      const by = {}; tj.places.forEach(p => { by[p.id] = p; }); const els = [...g.d.querySelectorAll(sel)], probs = []; let withB = 0;
      els.forEach(el => { const p = by[el.getAttribute('data-id')], rec = (p && !p.closed && p.rec) || null, r = el.querySelector('.gc-rec, .ge-rec');
        const n = rec ? (rec.award || []).length + (rec.video || []).length + (links && rec.cited >= 3 ? 1 : 0) : 0;   // R8 #2e: a Gallery card has "+N more"
        if (!n) { if (r) probs.push(p.id + ' badge without data'); return; } withB++;
        if (!r || r.querySelectorAll('.rb').length !== n) probs.push(p.id + ' count');
        else if (links !== !!r.querySelector('a.rb') || (!links && el.querySelector('a .gc-rec a'))) probs.push(p.id + ' link shape'); });
      chk(`${view}: ${els.length} cards, ${withB} with badges, each equal to the data (${links ? 'links' : 'text inside the card link'})`, els.length > 0 && (withB > 0 || !links) && probs.length === 0, probs.slice(0, 4));   // Gallery: its first rows may carry no award / video
      chk(`${view}: no js errors`, !g.errs.length, g.errs.slice(0, 2));
    }
    const wantA = tj.places.filter(p => !p.closed && (p.rec || {}).award).map(p => 'p-' + p.id).sort();
    const r1 = boot('cities/tokyo.html', { hash: '#rec=award' }); await sleep(300); r1.w.Cleo.defer.all(); await sleep(50);
    const vis = d => [...d.querySelectorAll('li.pl')].filter(c => !c.hidden).map(c => c.id).sort();
    chk('#rec=award shows exactly the open places with an award', JSON.stringify(vis(r1.d)) === JSON.stringify(wantA), [vis(r1.d).length, wantA.length]);
    chk('the lens names the filter and offers "Show all"', /Has an award \(\d+\)/.test(r1.d.getElementById('cleo-lens').textContent) && !!r1.d.querySelector('#cleo-lens [data-cleo-all]'));
    r1.d.querySelector('#cleo-lens [data-cleo-all]').click(); await sleep(100);
    chk('"Show all" restores every place', vis(r1.d).length === tj.places.length, vis(r1.d).length);
    chk('the tray offers the recognition filter; the rail has the Recognised door', r1.d.querySelectorAll('#cleo-tray [data-f="rec"]').length >= 1 && !!r1.d.querySelector('.rail-i[data-rec="any"]'));
    const aw = tj.places.find(p => !p.closed && (p.rec || {}).award);
    const r2 = boot('cities/tokyo.html', { hash: '#p=' + aw.id, mods: ['recognition'] }); await sleep(400);
    const fact = [...r2.d.querySelectorAll('#cleo-sheet .fact')].find(x => x.querySelector('.pl-rec'));
    { const ci = tj.places.find(p => !p.closed && (p.rec || {}).cited >= 3 && (p.rec.award || []).length), r3 = boot('cities/tokyo.html', { hash: '#p=' + ci.id, mods: ['recognition'] }); await sleep(400);
      const f3 = [...r3.d.querySelectorAll('#cleo-sheet .fact')].find(x => x.querySelector('.pl-rec')), card = r3.d.getElementById('p-' + ci.id);
      chk('R8 #2e: the card shows its award without "Cited by" (its "+N more" says it); the detail keeps "Cited by N sources"', !!f3 && (f3.querySelector('a.rb-cited') || {}).textContent === 'Cited by ' + ci.rec.cited + ' sources' && !!f3.querySelector('a.rb-award') && !!card.querySelector('.pl-rec .rb-award') && !card.querySelector('.rb-cited') && card.querySelector('.pl-s').hasAttribute('data-more'), ci.id); }
    chk('the detail shows the place\'s badges, each a link', !!fact && fact.querySelectorAll('a.rb').length >= 1 && /^#src=/.test(fact.querySelector('a.rb').getAttribute('href')));
    chk('no js errors (recognition)', !r1.errs.length && !r2.errs.length, r1.errs.concat(r2.errs).slice(0, 2));
    // QC-23: a closed place's "Before it closed" row shows in its detail, also when the sheet opens before recognition.js
    // has loaded (a deep link: the module arrives after, through the city.js onSheet hook)
    { const g = boot('Singapore/toa-payoh.html', { hash: '#p=kim-keat-hokkien-mee' }); await sleep(400);
      const before = !!g.d.querySelector('#cleo-sheet .fact .pl-rec');
      g.w.eval(fs.readFileSync(path.join(BETA, 'assets/js/recognition.js'), 'utf8')); await sleep(80);
      const f = g.d.querySelector('#cleo-sheet .fact .pl-rec'), c = g.d.getElementById('p-kim-keat-hokkien-mee'), cr = c && c.querySelector(':scope > .pl-rec');
      chk('QC-23: a closed place\'s detail shows "Before it closed" with its badges, after a late module load (deep link)', !before && !!f && f.classList.contains('closed') && !f.hasAttribute('hidden') &&
        /^Before it closed:/.test(f.textContent.trim()) && f.querySelectorAll('a.rb').length >= 1, f && f.outerHTML.slice(0, 120));
      chk('QC-23: the card carries no visible copy (cited-only: none; else hidden by CSS, class closed, not a hidden attribute)', (!cr || (cr.classList.contains('closed') && !cr.hasAttribute('hidden'))) &&
        /\.pl>\.pl-rec\.closed\{display:none\}/.test(fs.readFileSync(path.join(__dirname, 'lib/render/fe-c.css'), 'utf8')));
      g.w.Cleo.recog.sheet(c, ''); chk('QC-23: the row goes in once', g.d.querySelectorAll('#cleo-sheet .fact .pl-rec').length === 1);
      chk('no js errors (QC-23)', !g.errs.length, g.errs.slice(0, 2)); }
    // QC-24: the applied-filter chip names the lens, never its raw value ("any", "1")
    { const g = boot('cities/tokyo.html', { hash: '#rec=any', mods: ['recognition'] }); await sleep(300);
      const x = g.d.querySelector('.chip-x[data-unset="rec"]');
      chk('QC-24: #rec=any chip reads "Recognised", aria "Remove Recognised"', !!x && x.textContent.trim() === 'Recognised' && x.getAttribute('aria-label') === 'Remove Recognised', x && [x.textContent, x.getAttribute('aria-label')]);
      const g2 = boot('cities/tokyo.html', { hash: '#rec=award', mods: ['recognition'] }); await sleep(300);
      const x2 = g2.d.querySelector('.chip-x[data-unset="rec"]');
      chk('QC-24: #rec=award chip reads "Has an award"', !!x2 && x2.textContent.trim() === 'Has an award', x2 && x2.textContent); }
  }

  console.log('\n== FRESH (W9-2, card + city half): "Status checked <d Mon>" from pv.checked; "Follow changes" ==');
  {
    const bad = [], fb = [], FON = require('./lib/render/fresh-ui').ON(); let np = 0, nd = 0, nf = 0;
    for (const f of files) {
      const j = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8')), html = fs.readFileSync(path.join(BETA, j.beta), 'utf8').replace(/<\/?noscript[^>]*>/g, '');
      for (const p of j.places) { np++;
        const m = new RegExp('<li class="pl[^"]*" id="p-' + p.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*>').exec(html);
        const got = m && ((/ data-checked="([^"]*)"/.exec(m[0]) || [])[1] || ''), want = (p.pv && p.pv.checked) || '';
        if (!m) bad.push([j.key, p.id, 'card not found']); else if (got !== want) bad.push([j.key, p.id, got, want]); else if (want) nd++;
      }
      const fl = /<p class="sm feedline" data-cleo-follow><a href="([^"]+)"/.exec(html), feed = 'feeds/' + String(j.key).replace(/\//g, '--') + '.xml';
      if (FON) { if (!fl) fb.push([j.key, 'no Follow changes line']); else if (path.posix.normalize(path.posix.join(path.posix.dirname(j.beta), fl[1])) !== feed || !fs.existsSync(path.join(BETA, feed))) fb.push([j.key, fl[1]]); else nf++; }
      else if (fl) fb.push([j.key, 'the line is on before its string is merged']);
    }
    chk(`${files.length} pages, ${np} cards: every card's data-checked equals its record's pv.checked (${nd} dated)`, bad.length === 0, bad.slice(0, 4));
    chk(FON ? `"Follow changes" on all ${files.length} pages, each resolving to its feeds/<page>.xml (${nf})` : '"Follow changes" stays off until fresh.feed is merged (en + ja)', fb.length === 0, fb.slice(0, 4));

    const g = boot('cities/tokyo.html', { mods: ['fresh'] }); await sleep(200); g.w.Cleo.defer.all(); await sleep(50);
    const fmt = iso => { const [y, mo, dd] = iso.split('-').map(Number); return new Date(Date.UTC(y, mo - 1, dd)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }); };
    const probs = []; let n = 0;
    g.d.querySelectorAll('li.pl[id^="p-"]').forEach(c => { const iso = c.getAttribute('data-checked'), e = c.querySelector(':scope > .pl-chk');
      if (!iso) { if (e) probs.push([c.id, 'line without a date']); return; }
      n++; if (!e) return probs.push([c.id, 'no line']);
      if (e.getAttribute('data-d') !== iso || e.textContent !== 'Status checked ' + fmt(iso)) probs.push([c.id, e.textContent, iso]);
      if (!e.hasAttribute('data-nosearch') || /Status checked/.test(g.w.Cleo.lens.text(c))) probs.push([c.id, 'the line feeds the search']);
      if (/open now|hours|open until|closes at/i.test(e.textContent)) probs.push([c.id, 'implies open now or hours']); });
    chk(`Tokyo: ${n} dated cards each show "Status checked <d Mon>" as real text equal to data-checked, skipped by the search`, probs.length === 0 && n > 400, probs.slice(0, 4));
    { const q = boot('cleveland.html', { hash: '#q=aug', mods: ['fresh'] }); await sleep(400); q.w.Cleo.defer.all(); await sleep(80);
      const shown = [...q.d.querySelectorAll('li.pl[id^="p-"]')].filter(c => !c.hidden), byOwn = shown.filter(c => { const k = c.cloneNode(true); k.querySelectorAll('[data-nosearch]').forEach(x => x.remove()); return /aug/i.test(k.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g, '')); });
      const aug = [...q.d.querySelectorAll('li.pl .pl-chk')].filter(e => / Aug$/.test(e.textContent)).length;
      chk(`Cleveland #q=aug (its cards were checked in August: ${aug} lines read "… Aug"): ${shown.length} cards shown, each by its own text, none by the checked line`, shown.length === byOwn.length && aug > 100, [shown.length, byOwn.length]); }
    { const q = boot('cleveland.html', { hash: '#q=' + encodeURIComponent('8月') }); await sleep(300);
      chk('Cleveland #q=8月 (the ja form of its checked month) matches no card', ![...q.d.querySelectorAll('li.pl[id^="p-"]')].some(c => !c.hidden)); }
    chk('fresh.js is lazy (no page loads it eagerly)', !/<script[^>]+fresh\.js/.test(fs.readFileSync(path.join(BETA, 'cities/tokyo.html'), 'utf8')));
    chk('no js errors (fresh)', g.errs.length === 0, g.errs.slice(0, 2));
    // W9-2 (a): the Gallery row cards carry the same line, dated from the place's own card (no page data fetched)
    const gg = boot('cleveland.html', { hash: '#view=gallery', mods: ['gallery', 'fresh'] }); await sleep(900);
    const gcs = [...gg.d.querySelectorAll('li.gc[data-id]')], gp = [];
    gcs.forEach(r => { const id = r.getAttribute('data-id'), c = gg.d.getElementById('p-' + id) || (gg.w.Cleo.defer.peek().find(s => s.id === 'p-' + id)), iso = c && c.getAttribute('data-checked'), e = r.querySelector('.pl-chk');
      if (!iso) { if (e) gp.push([id, 'line without a date']); return; }
      if (!e || e.getAttribute('data-d') !== iso || e.textContent !== 'Status checked ' + fmt(iso) || !e.hasAttribute('data-nosearch')) gp.push([id, e && e.textContent, iso]); });
    chk(`Cleveland Gallery: all ${gcs.length} row cards carry "Status checked <d Mon>" equal to the place's data-checked`, gcs.length > 0 && gp.length === 0, gp.slice(0, 4));
    chk('the row-card line fetches no page data', !gg.net.some(u => /data\/places\//.test(u)), gg.net.filter(u => /data\/places\//.test(u)));
    chk('no js errors (fresh, gallery)', !gg.errs.length, gg.errs.slice(0, 2));
  }

  console.log('\n== LF (W9-9): local favourites, the rule holds for every place ==');
  {
    const bad = []; let on = 0, gaps = 0, nlf = 0;
    for (const f of files) {
      const j = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8')), html = fs.readFileSync(path.join(BETA, j.beta), 'utf8').replace(/<\/?noscript[^>]*>/g, '');
      const L = (j.recognition || {}).localFavourites || {}, grp = {}; (j.sourceIndex || []).forEach(x => { grp[x.id] = x.group; });
      const door = /class="rail-i door" data-lf="1"/.test(html), tags = html.match(/<li class="pl[^>]*>/g) || [];
      const lfIds = tags.filter(t => / data-lf="1"/.test(t)).map(t => /id="p-([^"]+)"/.exec(t)[1]);
      if (!L.gap && L.n > 0) { on++;
        if (!door) bad.push([j.key, 'no door']);
        if (lfIds.length !== L.n) bad.push([j.key, 'count', lfIds.length, L.n]);
        const by = {}; j.places.forEach(p => { by[p.id] = p; });
        lfIds.forEach(id => { const p = by[id], src = p.src || [];
          if (p.closed || !src.length || !src.every(s => grp[s] === 'local' || grp[s] === 'creator')) bad.push([j.key, id, 'breaks the rule', src.map(s => grp[s])]); });
        nlf += lfIds.length;
      } else { gaps++;
        if (door || lfIds.length) bad.push([j.key, 'a lens where platform states a gap']);
        if (!/<p class="lf-gap">/.test(html)) bad.push([j.key, 'gap not stated']); }
    }
    chk(`${on} guides show the lens (${nlf} places, each meeting the printed rule); ${gaps} state the gap with no door`, bad.length === 0 && on > 0, bad.slice(0, 4));
    const cj = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places/cleveland.json'), 'utf8')), want = cj.places.filter(p => p.lf).map(p => 'p-' + p.id).sort();
    const g = boot('cleveland.html', { hash: '#lf=1' }); await sleep(300); g.w.Cleo.defer.all(); await sleep(50);
    const vis = [...g.d.querySelectorAll('li.pl')].filter(c => !c.hidden).map(c => c.id).sort();
    chk('Cleveland #lf=1 shows exactly its local favourites', JSON.stringify(vis) === JSON.stringify(want), [vis.length, want.length]);
    chk('the lens prints the rule and offers "Show all"', (g.d.querySelector('#cleo-lens .lf-rule') || {}).textContent === cj.recognition.localFavourites.rule && !!g.d.querySelector('#cleo-lens [data-cleo-all]'));
    g.d.querySelector('#cleo-lens [data-cleo-all]').click(); await sleep(80);
    chk('"Show all" restores every place', [...g.d.querySelectorAll('li.pl')].filter(c => !c.hidden).length === cj.places.length);
    { const g3 = boot('cleveland.html', { hash: '#lf=1' }); await sleep(300); const x = g3.d.querySelector('.chip-x[data-unset="lf"]');
      chk('QC-24: #lf=1 chip reads "Local favourites"', !!x && x.textContent.trim() === 'Local favourites' && x.getAttribute('aria-label') === 'Remove Local favourites', x && x.textContent); }
    chk('no js errors (local favourites)', !g.errs.length, g.errs.slice(0, 2));
  }

  console.log('\n== EMPTY (QC-05): a search with no match states it and offers a way out ==');
  {
    const g = boot('cities/tokyo.html', { hash: '#q=zzqxjv', mods: ['empty'] }); await sleep(300);
    const box = g.d.querySelector('#cleo-lens [data-cleo-empty]'), lens = g.d.getElementById('cleo-lens');
    chk('the lens states it, naming the search', !!box && !lens.hidden && box.querySelector('h2').textContent === 'No places match “zzqxjv”.', box && box.textContent);
    chk('it offers "Clear search" and "Show all 488"', !!box && (box.querySelector('[data-unset="q"]') || {}).textContent === 'Clear search' && (box.querySelector('[data-cleo-all]') || {}).textContent === 'Show all 488');
    chk('no "All N" mode chip stays pressed while nothing is shown', !g.d.querySelector('button[data-mode][aria-pressed="true"]'));
    chk('no card is shown', ![...g.d.querySelectorAll('li.pl')].some(c => !c.hidden));
    box.querySelector('[data-unset="q"]').click(); await sleep(150);
    chk('"Clear search" clears the search and the state, and every place is back', !/[#&]q=/.test(g.w.location.hash) && !g.d.querySelector('[data-cleo-empty]') && g.d.querySelectorAll('li.pl:not([hidden])').length > 0 && !!g.d.querySelector('button[data-mode][aria-pressed="true"]'));
    const g2 = boot('cities/tokyo.html', { hash: '#q=senso', mods: ['empty'] }); await sleep(300);
    chk('a search that matches draws no empty state', !g2.d.querySelector('[data-cleo-empty]'));
    const g3 = boot('cities/tokyo.html', { hash: '#q=zzqxjv' }); await sleep(300);
    chk('empty.js is lazy: requested only on an empty result', !/<script[^>]+empty\.js/.test(fs.readFileSync(path.join(BETA, 'cities/tokyo.html'), 'utf8')) && !!g3.d.querySelector('script[src*="assets/js/empty.js"]'));
    chk('no js errors (empty)', !g.errs.length && !g2.errs.length, g.errs.concat(g2.errs).slice(0, 2));
  }

  console.log('\n== APPROX (QC-04, D-43): a low-graded pin stays on the map, labelled "Approximate pin" ==');
  {
    const bad = []; let nlow = 0;
    for (const f of files) {
      const j = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8')), html = fs.readFileSync(path.join(BETA, j.beta), 'utf8');
      const info = JSON.parse(/<script type="application\/json" id="cleo-city">([\s\S]*?)<\/script>/.exec(html)[1]), pr = info.prov || {};
      for (const p of j.places) { const lo = (p.pv || {}).pin === 'low', pl = String(pr[p.id] || '').charAt(0) === 'l'; if (lo) nlow++; if (lo !== pl) bad.push([j.key, p.id, (p.pv || {}).pin, pr[p.id]]); }
    }
    chk(`${files.length} pages: the page's provenance marks exactly the ${nlow} places whose pv.pin is low`, bad.length === 0 && nlow > 0, bad.slice(0, 4));
    const oj = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places/okinawa.json'), 'utf8')), lowIds = new Set(oj.places.filter(p => (p.pv || {}).pin === 'low').map(p => 'p-' + p.id));
    const g = boot('cities/okinawa.html', { mods: ['fresh'] }); await sleep(250); g.w.Cleo.defer.all(); await sleep(80);
    const probs = []; let lab = 0;
    g.d.querySelectorAll('li.pl[id^="p-"]').forEach(c => { const e = c.querySelector(':scope > .pl-approx');
      if (lowIds.has(c.id)) { if (!e || e.textContent !== 'Approximate pin') probs.push([c.id, 'no label']); else lab++; } else if (e) probs.push([c.id, 'label on a pin that is not low']); });
    chk(`Okinawa: every low-pin card (${lab} of ${lowIds.size}) says "Approximate pin" and no other card does`, probs.length === 0 && lab === lowIds.size, probs.slice(0, 4));
    const s = boot('cleveland.html', { hash: '#p=rocky-river-reservation-and-fort-hill-stairs' }); await sleep(400);
    const sh = (s.d.getElementById('cleo-sheet') || {}).textContent || '';
    chk('Cleveland detail of the low pin: "Approximate map pin: … not yet verified to the door", never "Pinned to the door"', /Approximate map pin: the coordinate we hold is not yet verified to the door/.test(sh) && !/Pinned to the door/.test(sh));
    const s2 = boot('cleveland.html', { hash: '#p=beck-center-for-the-arts' }); await sleep(400);
    chk('a high pin\'s detail still reads "Pinned to the door"', /Pinned to the door/.test((s2.d.getElementById('cleo-sheet') || {}).textContent || ''));
    const a = boot('cleveland.html', { hash: '#view=atlas' }); await sleep(500);
    chk('Cleveland Atlas badge counts it: "1 approximate pin"', ((a.d.querySelector('.mappane .nopin') || {}).textContent || '') === '1 approximate pin', (a.d.querySelector('.mappane .nopin') || {}).textContent);
    const a2 = boot('cities/okinawa.html', { hash: '#view=atlas' }); await sleep(500);
    chk(`Okinawa Atlas badge: "${lowIds.size} approximate pins"`, ((a2.d.querySelector('.mappane .nopin') || {}).textContent || '') === lowIds.size + ' approximate pins', (a2.d.querySelector('.mappane .nopin') || {}).textContent);
    chk('no js errors (approx)', !g.errs.length && !s.errs.length && !a.errs.length, g.errs.concat(s.errs, a.errs).slice(0, 2));
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
    // QC-15: the action keeps focus in the sheet (on the new control), announces itself, and Escape still closes the sheet
    const ae = g4.d.activeElement, live = g4.d.querySelector('#cleo-sheet [data-cleo-base-live]');
    chk('QC-15: after "Set as my base", focus is on "Clear my base" inside the sheet, and the change is announced', !!ae && !!ae.closest('#cleo-sheet') && ae.getAttribute('data-cleo-base') === 'clear' && !!live && /^Your base is /.test(live.textContent), [ae && ae.tagName, ae && ae.getAttribute('data-cleo-base'), live && live.textContent]);
    ae.click(); await sleep(150);
    const ae2 = g4.d.activeElement;
    chk('QC-15: after "Clear my base" in the sheet, focus stays in the sheet (on "Set as my base")', !!ae2 && !!ae2.closest('#cleo-sheet') && ae2.getAttribute('data-cleo-base') === 'set', ae2 && ae2.outerHTML.slice(0, 80));
    ae2.click(); await sleep(150);
    g4.d.activeElement.dispatchEvent(new g4.w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await sleep(150);
    chk('QC-15: Escape still closes the sheet after the action', g4.d.getElementById('cleo-sheet').hidden === true);
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

  console.log(failures ? `\n>>> FAIL — ${failures} check(s) failed` : '\n>>> PASS — FE-C gate: trips (W9-4), base (W9-5), share cards (W9-7), recognition (W9-1)');
  process.exit(failures ? 1 : 0);
})();
