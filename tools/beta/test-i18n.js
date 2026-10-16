#!/usr/bin/env node
'use strict';
/**
 * test-i18n.js — M3-03 / ROUND-3 gap #8 gate (platform + FE-B, W4).
 *  1. PSEUDO-LOCALE: the shell (top bar, breadcrumbs, tab bar, footer) and the "What changed" page rendered in the
 *     `pseudo` locale carry 0 English words — every interface string came from tools/beta/i18n/en.json. Data (city and
 *     place names, status sources) is allowed through untouched, by name.
 *  2. Catalogue hygiene: every string the pseudo render used exists; the en catalogue is "reviewed".
 *  3. hreflang + <html lang>: head() follows the active locale; every built page on disk carries x-default.
 *  4. Locale switcher stays out of the page until a SECOND reviewed locale exists.
 *  5. (W5, ROUND-4 gap #7) the landing, a country hub and the archive hub in `pseudo`: 0 English words outside data.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const i18n = require('./lib/i18n');
const shell = require('./lib/render/shell');
const common = require('./lib/render/common');
const changes = require('./lib/render/changes');
const landing = require('./lib/render/landing');
const hub = require('./lib/render/hub');

let failures = 0;
const chk = (name, got, want) => {
  const ok = typeof want === 'function' ? want(got) : JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failures++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok ? '' : ' — got ' + JSON.stringify(got).slice(0, 400)}`);
};

// A fixture site: one country, one city, one dated event of each kind. The names are DATA (allowed through).
const DATA = ['Testville Gazette', 'Testville gazette', 'Old Mill Diner', 'Testland', 'Testville'];   // longest first; 'Testville gazette' = the ★ collection title as displayed (sentence case, lib/casing.js)
const reg = { rows: [{ kind: 'city', beta: 'cities/testville.html', key: 'testville', country: 'tl', counts: { P: 2, F: 1 }, data: { meta: { h1Main: 'Testville' } } },
  { kind: 'country-hub', beta: 'Testland/index.html', live: 'Testland/index.html', gen: 'new', key: 'tl', country: 'tl', data: { meta: { h1Main: 'Testland' } } }],
  countries: [{ key: 'tl', name: 'Testland', live: true, order: 1, hub: 'Testland/index.html' }] };
const row = { key: 'testville', fileKey: 'testville', beta: 'cities/testville.html', live: 'cities/testville.html', name: 'Testville', feed: 'feeds/testville.xml',
  changes: [{ d: '2026-10-03', kind: 'closed', n: 1, id: 'p1', name: 'Old Mill Diner', note: 'Testville Gazette' },
    { d: '2026-10-03', kind: 'closed', n: 1, id: 'p2', name: 'Old Mill Diner', note: null },
    { d: '2026-10-03', kind: 'checked', n: 3, closed: 1 }, { d: '2026-09-01', kind: 'pins', n: 1 }, { d: '2026-09-02', kind: 'pins', n: 4 }, { d: '2026-08-01', kind: 'checked', n: 1, closed: 0 }] };
const ctx = { assetsV: { core: 'x', css: 'x' } };

function englishLeft(html) {
  const doc = new JSDOM(html).window.document, out = [];
  // <time> holds a date the runtime formats for the locale (Intl), not catalogue copy
  // i18n D-41: the switcher's language names are endonyms (each in its own language, lang="…"), not catalogue copy
  doc.querySelectorAll('script, style, svg, link, meta, title, time, [data-cleo-locale]').forEach(n => n.remove());
  const walk = doc.createTreeWalker(doc.body || doc.documentElement, 4);
  const texts = [];
  for (let n; (n = walk.nextNode());) texts.push(n.nodeValue);
  doc.querySelectorAll('[aria-label], [title], [placeholder], [alt]').forEach(el => ['aria-label', 'title', 'placeholder', 'alt'].forEach(a => el.hasAttribute(a) && texts.push(el.getAttribute(a))));
  for (let s of texts) {
    // data is stripped case-insensitively: display-time sentence casing (lib/casing.js) may render a data label
    // such as a signature title as "Testville gazette"; it is still data, not catalogue copy
    for (const d of DATA) s = s.replace(new RegExp(d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ' ');
    const m = s.match(/[A-Za-z]{2,}/g); if (m) out.push(...m);
  }
  return out;
}

console.log('== PSEUDO-LOCALE: 0 hard-coded English in the shell and the What changed page ==');
i18n.setLocale('pseudo'); shell.setSite(reg, {});
const bar = shell.siteBar({ depth: 1, current: 'other', rel: 'cities/testville.html' });
const foot = shell.footer({ depth: 1, liveRel: 'cities/testville.html', tabbar: true, current: 'other', notes: [{ title: 'Testville Gazette', body: 'Old Mill Diner' }] });
chk('top bar + breadcrumbs: no English left', englishLeft(`<body>${bar}</body>`), []);
chk('footer + tab bar: no English left', englishLeft(`<body>${foot}</body>`), []);
chk('trail names for fixed pages come from the catalogue', shell.trail('saved.html').map(x => x.name).every(n => /^⟦/.test(n)), true);
const pg = changes.page(row, ctx);
chk('What changed page: no English left (body, title, aria)', englishLeft(pg), []);
chk('What changed page with no events: no English left', englishLeft(changes.page(Object.assign({}, row, { changes: [] }), ctx)), []);
chk('pseudo page declares lang="en-XA"', /<html lang="en-XA"/.test(pg), true);
chk('pseudo strings are wrapped (catalogue really applied)', (pg.match(/⟦/g) || []).length >= 15, true);

// W5 gap #7: landing + hubs. A fixture country with two guides, 6 anime-collection places (so the collections rail
// shows), a ★ signature (so the landing's signature rail shows), and an archive with a live and a preview region.
const rec = (id, i, kind) => ({ id, n: 'Old Mill Diner', kind, t: 1, a: 'A', la: 1 + i / 100, ln: 2 + i / 100, src: ['s1', 's2'], g: ['ANIME'], pv: { pin: 'high', checked: '2026-10-03' } });
const cityRow = (key, live, country, n, name = 'Testville') => ({ kind: 'city', key, fileKey: key.replace(/\//g, '--'), beta: live, live, gen: 'new', country, name, counts: { P: n - 1, F: 1 },
  recs: Array.from({ length: n }, (_, i) => rec(key + i, i, i ? 'sight' : 'food')), colors: { A: '#336699' },
  stats: { total: n, sights: n - 1, food: 1, open: n, closed: 0, pins: n, verifiedPins: n, statusChecked: n, lastChecked: '2026-10-03' },
  guide: { signature: { kind: 'collection', c: ['ANIME'], title: 'Testville Gazette', n: 3 } },
  // W7: named sources, so the cards' "Recommended by … + n more" line is rendered (and checked) in pseudo
  sources: { list: ['s1', 's2', 's3'].map(id => ({ id, name: 'Testville Gazette', n: 2 })).concat({ id: 'guide', name: 'Testville', n: 1 }) },
  data: { meta: { h1Main: 'Testville' }, AREAS: [{ id: 'A', n: 'Testville' }], CATS: [{ id: 'ANIME', n: 'Anime' }], CUISINES: [] } });
const reg2 = { rows: [cityRow('testville', 'cities/testville.html', 'tl', 6), cityRow('testburg', 'cities/testburg.html', 'tl', 3, 'Testburg'),
  cityRow('sg-a', 'Singapore/a.html', 'sg', 2), cityRow('vn-a', 'Vietnam/a.html', 'vn', 2),
  { kind: 'country-hub', beta: 'Testland/index.html', live: 'Testland/index.html', gen: 'new', key: 'tl', country: 'tl', data: { meta: { h1Main: 'Testland' } } },
  { kind: 'archive-hub', beta: 'Singapore/singapore-old.html', live: 'Singapore/singapore-old.html', gen: 'new', key: 'sea', country: 'sg', data: { meta: { h1Main: 'Testland' } } }],
  countries: [{ key: 'tl', name: 'Testland', live: true, order: 1, hub: 'Testland/index.html', cityPages: ['cities/testville.html'], blurb: 'Testville Gazette' },
    { key: 'sg', name: 'Testland', live: false, order: 2, kind: 'engine', cityPages: [] }] };
reg2.rows[3].country = 'zz';
// W9-2: the landing's "<month> in Cleo" module (data/changes.json rows)
reg2.changes = Object.assign([{ key: 'testville', name: 'Testville', changesPage: 'changes/testville.html', month: { checked: 3, closed: 1, pins: 2 } }], { month: '2026-10' });                                   // a page outside every region → "elsewhere in the region"
shell.setSite(reg2, {});
const lctx = { assetsV: { core: 'x', css: 'x', landing: 'x' }, betaBase: 'https://example.test/beta' };
const DATA2 = DATA.concat(['Anime', 'Testburg']);
const left = html => { const out = englishLeft(html); return out.filter(w => !DATA2.some(d => d.split(/\s+/).includes(w))); };
const lp = landing.render(reg2, lctx);
chk('landing: no English left (body, aria, placeholder)', left(lp), []);
const lp1 = landing.render(Object.assign({}, reg2, { rows: reg2.rows.map(r => r.key === 'testburg' ? Object.assign({}, r, { guide: null }) : r) }), lctx);
chk('landing with a one-guide signature: no English left', left(lp1), []);
chk('landing: collections rail and signature rail rendered (strings exercised)', [/class="themes/.test(lp), /class="rail editorial"/.test(lp)], [true, true]);
const hp = hub.renderCountry(reg2.rows[4], reg2, lctx).html;
chk('country hub: no English left', left(hp), []);
const ap = hub.renderArchive(reg2.rows[5], reg2, lctx).html;
chk('archive hub: no English left', left(ap), []);
chk('hub strings are wrapped (catalogue really applied)', (hp.match(/⟦/g) || []).length >= 15, true);
// the collections rail's other phrasings: one city ("in …"), six cities ("+2 more guides"), two countries
const railReg = (rows, countries) => ({ rows, countries: countries.map((k, i) => ({ key: k, name: 'Testland', live: true, order: i, cityPages: [] })) });
const rails = [railReg([cityRow('t1', 'cities/t1.html', 'tl', 6)], ['tl']),
  railReg(Array.from({ length: 6 }, (_, i) => cityRow('t' + i, `cities/t${i}.html`, 'tl', 2)), ['tl']),
  railReg([cityRow('t1', 'cities/t1.html', 'tl', 3), cityRow('t2', 'cities/t2.html', 'xl', 3)], ['tl', 'xl'])].map(r => hub.themeRail(r));
chk('collections rail, every phrasing: no English left', rails.map(left), [[], [], []]);

console.log('\n== CATALOGUE ==');
const en = i18n.EN;
chk('en catalogue is reviewed', en.reviewed, true);
// W9-8 (platform): the offline-pack control and the offline map line on the city page, rendered in `pseudo`
{
  i18n.setLocale('pseudo');
  const os = require('./lib/render/city').offlineStrings('Tōkyō', 488);
  const en = /\b(Keep|offline|Saved|Remove|places|Map|unavailable|storage|device|Couldn)\b/;
  chk('offline pack + offline map strings render from the catalogue (pseudo: 0 English words; data passes)', Object.entries(os).filter(([k, v]) => en.test(v)).map(([k]) => k), []);
  i18n.setLocale('en');
}
chk('every string used by the pseudo render exists in en', [...i18n.used].filter(k => !(k in en.strings)), []);
const unused = Object.keys(en.strings).filter(k => !i18n.used.has(k) && !k.endsWith('.one') && k !== 'shell.locale.label');
chk('no dead catalogue strings', unused, []);
chk('placeholders survive the pseudo transform', i18n.pseudoText('{n} places'), '⟦{n} ｐｌａｃｅｓ⟧');
chk('a missing key throws (no silent English fallback)', (() => { try { i18n.t('nope.missing'); return false; } catch (e) { return true; } })(), true);

console.log('\n== hreflang + lang ==');
i18n.setLocale('en');
const h = common.head({ page: 'x', title: 'x', description: 'x', rel: 'cities/testville.html', depth: 1, assetsV: ctx.assetsV });
chk('<html lang="en">', /<html lang="en"/.test(h), true);
chk('hreflang en + x-default', [/hreflang="en"/.test(h), /hreflang="x-default"/.test(h)], [true, true]);
const BETA = path.join(__dirname, '..', '..', 'beta'), man = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'manifest.json'), 'utf8'));
const missing = man.generated.filter(p => !/hreflang="x-default"/.test(fs.readFileSync(path.join(BETA, p), 'utf8')));
chk(`every generated page (${man.generated.length}) carries hreflang x-default`, missing.slice(0, 10), []);
chk('catalogue published at beta/assets/i18n/en.json', fs.existsSync(path.join(BETA, 'assets', 'i18n', 'en.json')), true);

// ---------------------------------------------------------------- i18n D-41: the AI-reviewed Japanese tier
console.log('\n== D-41: OFFERED LOCALES (human + AI tier) ==');
const ja = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n', 'ja.json'), 'utf8'));
chk('offered locales = en (human) + ja (ai)', i18n.offered().map(l => `${l.locale}:${l.tier}`), ['en:human', 'ja:ai']);
chk('human-reviewed locales = [en] (reviewed: true stays a human sign-off)', i18n.reviewed().map(l => l.locale), ['en']);
chk('ja is labelled honestly: reviewed false, review.by ai, translator + reviewer + date', [ja.reviewed, ja.review && ja.review.by, !!(ja.review && ja.review.translator && ja.review.reviewer && ja.review.date)], [false, 'ai', true]);
const ph = v => (v.match(/\{[a-z]+\}/g) || []).sort().join(',');
chk('every en key exists in ja', Object.keys(en.strings).filter(k => !(k in ja.strings)), []);
chk('no ja key without an en source', Object.keys(ja.strings).filter(k => !(k in en.strings)), []);
chk('every ja string keeps the en placeholders', Object.keys(en.strings).filter(k => ph(en.strings[k]) !== ph(ja.strings[k] || '')), []);
const byEn = {};
Object.keys(en.strings).forEach(k => (byEn[en.strings[k]] = byEn[en.strings[k]] || new Set()).add(ja.strings[k]));
chk('identical en strings → identical ja (the runtime swap matches by text)', Object.keys(byEn).filter(e => byEn[e].size > 1), []);
chk('land.month.names: 12 names', ja.strings['land.month.names'].split(',').length, 12);
chk('ja carries the AI-tier note (ja + en sentence + report label)', [!!ja.note.text, /machine-translated and checked by a second AI review\. Place write-ups stay in English\./.test(ja.note.en), /Report a wrong phrase/.test(ja.note.report)], [true, true, true]);
chk('catalogue published at beta/assets/i18n/ja.json', fs.existsSync(path.join(BETA, 'assets', 'i18n', 'ja.json')), true);

console.log('\n== D-41: SWITCHER + hreflang on every page ==');
i18n.setLocale('en');
const sw = shell.localeSwitch();
chk('switcher renders en + ja buttons with lang attributes', [/data-cleo-locale="en"[^>]*lang="en"/.test(sw), /data-cleo-locale="ja"[^>]*lang="ja"/.test(sw), /aria-label="Language"/.test(sw)], [true, true, true]);
chk('switcher buttons are real <button>s (keyboard reachable)', (sw.match(/<button type="button"/g) || []).length, 2);
const h2 = common.head({ page: 'x', title: 'x', description: 'x', rel: 'cities/testville.html', depth: 1, assetsV: ctx.assetsV });
chk('head: hreflang ja → ?lang=ja, en + x-default → the page', [/hreflang="ja" href="[^"]*testville\.html\?lang=ja"/.test(h2), /hreflang="en" href="[^"]*testville\.html"/.test(h2), /hreflang="x-default"/.test(h2)], [true, true, true]);
chk('head: ≥ 44 px switcher targets + Japanese system-font fallback + phrase line breaking (no CDN)', [/\.locales \.btn\{min-height:44px;min-width:44px/.test(h2), /html:lang\(ja\)\{--font-ui:[^}]*"Yu Gothic"/.test(h2), /word-break:auto-phrase/.test(h2), !/https?:\/\/[^"]*fonts/.test(h2)], [true, true, true, true]);
chk('head: pre-paint snippet touches storage only inside try/catch (read + the en-page switcher write)', (h2.match(/localStorage/g) || []).length === 2 && (h2.match(/try\{[^{}]*localStorage\.(getItem|setItem)\([^{}]*\}catch\(\w+\)\{\}/g) || []).length === 2, true);
const pages = man.generated.map(p => [p, fs.readFileSync(path.join(BETA, p), 'utf8')]);
chk(`every generated page (${pages.length}) carries hreflang ja + en + x-default`, pages.filter(([, x]) => !(/hreflang="ja"/.test(x) && /hreflang="en"/.test(x) && /hreflang="x-default"/.test(x))).map(([p]) => p).slice(0, 10), []);
chk('every generated page ships the switcher and the snippet that injects locale.js', pages.filter(([, x]) => !(/data-cleo-locale="ja"/.test(x) && /s\.src="[^"]*assets\/js\/locale\.js/.test(x))).map(([p]) => p).slice(0, 10), []);
chk('no page loads locale.js eagerly (en pays no locale JS; platform eager-JS budget)', pages.filter(([, x]) => /<script[^>]+src="[^"]*locale\.js/.test(x)).map(([p]) => p).slice(0, 10), []);
const swSrc = fs.readFileSync(path.join(BETA, 'sw.js'), 'utf8');
chk('service worker precaches the catalogues (a chosen locale works offline)', [/assets\/i18n\/en\.json/.test(swSrc), /assets\/i18n\/ja\.json/.test(swSrc)], [true, true]);

console.log('\n== D-41: RUNTIME (client/locale.js) ==');
const LOCALE_JS = fs.readFileSync(path.join(__dirname, 'client', 'locale.js'), 'utf8');
/** Run locale.js over a built page in jsdom. cats: { en, <l> } catalogues the stub fetch serves. */
async function runtime(html, url, cats, stored) {
  const dom = new JSDOM(html, { url, runScripts: 'outside-only' });
  const w = dom.window;
  if (stored) w.localStorage.setItem('cleo:v1:locale', JSON.stringify(stored));
  w.fetch = u => { const l = u.split('/').pop().replace(/\.json$/, ''); return cats[l] ? Promise.resolve({ ok: true, json: () => Promise.resolve(cats[l]) }) : Promise.reject(new Error('404')); };
  w.eval(LOCALE_JS.replace("document.currentScript && document.currentScript.src || ''", JSON.stringify(url.replace(/[^/]*$/, '') + 'assets/js/locale.js')));
  await new Promise(r => setTimeout(r, 30));
  return w.document;
}
const PSEUDO = { locale: 'ja', name: 'ps', strings: Object.fromEntries(Object.entries(en.strings).map(([k, v]) => [k, i18n.pseudoText(v)])) };
(async () => {
  const CATS = { en: i18n.EN, ja };
  // the What changed page and the landing, built in English, swapped at runtime with the PSEUDO catalogue: the runtime
  // must reach every catalogue string the build-time pseudo render reaches (0 English left outside data)
  shell.setSite(reg, {});
  const chgEn = changes.page(row, ctx);
  const dP = await runtime(chgEn, 'https://example.test/beta/changes/testville.html?lang=ja', { en: i18n.EN, ja: PSEUDO });
  chk('runtime pseudo swap, What changed page: no English left', englishLeft(dP.documentElement.outerHTML), []);
  shell.setSite(reg2, {});
  const lpEn = landing.render(reg2, lctx);
  const dL = await runtime(lpEn, 'https://example.test/beta/index.html?lang=ja', { en: i18n.EN, ja: PSEUDO });
  chk('runtime pseudo swap, landing: no English left', left(dL.documentElement.outerHTML), []);
  const hpEn = hub.renderCountry(reg2.rows[4], reg2, lctx).html;
  const dH = await runtime(hpEn, 'https://example.test/beta/Testland/index.html?lang=ja', { en: i18n.EN, ja: PSEUDO });
  chk('runtime pseudo swap, country hub: no English left', left(dH.documentElement.outerHTML), []);

  // the real Japanese catalogue on real built pages
  for (const rel of ['index.html', 'Japan/index.html', 'cities/tokyo.html']) {
    if (!fs.existsSync(path.join(BETA, rel))) continue;
    const html = fs.readFileSync(path.join(BETA, rel), 'utf8');
    const dj = await runtime(html, `https://example.test/beta/${rel}`, CATS, 'ja');
    const note = dj.querySelector('.l10n-note');
    chk(`${rel} in ja: <html lang="ja">, AI note shown (ja + en sentence + report link), ja button pressed`,
      [dj.documentElement.lang, !!note, note && note.getAttribute('lang'), !!(note && note.querySelector('span[lang="en"]') && /Place write-ups stay in English/.test(note.textContent)), !!(note && note.querySelector('a[href^="https://github.com/alvations/cleo-guide/issues/new"]')), dj.querySelector('[data-cleo-locale="ja"]').getAttribute('aria-pressed')],
      ['ja', true, 'ja', true, true, 'true']);
    chk(`${rel} in ja: the shell is Japanese (skip link, nav label, footer heading)`, [dj.querySelector('.skip').textContent, dj.querySelector('.footer .fh') && dj.querySelector('.footer .fh').textContent], [ja.strings['shell.skip'], ja.strings['foot.destinations']]);
    chk(`${rel} in ja: counts take the numeric template ("21 guides" → 21件のガイド, never "{country} guides")`, (dj.body.textContent.match(/\d+のガイド/g) || []).slice(0, 3), []);
    const de = await runtime(html, `https://example.test/beta/${rel}`, CATS, 'en');
    chk(`${rel} in en: no AI note, <html lang="en">, en button pressed`, [!!de.querySelector('.l10n-note'), de.documentElement.lang, de.querySelector('[data-cleo-locale="en"]').getAttribute('aria-pressed')], [false, 'en', 'true']);
    const dq = await runtime(html, `https://example.test/beta/${rel}?lang=ja`, CATS);
    chk(`${rel}?lang=ja: applies ja and remembers it`, [dq.documentElement.lang, dq.defaultView.localStorage.getItem('cleo:v1:locale')], ['ja', '"ja"']);
    const df = await runtime(html, `https://example.test/beta/${rel}`, { en: i18n.EN }, 'ja');
    chk(`${rel}: catalogue fetch fails → falls back to English, no note`, [df.documentElement.lang, !!df.querySelector('.l10n-note')], ['en', false]);
  }
  // storage that throws (sandboxes): the runtime still runs and stays in English
  const dT = new JSDOM(fs.readFileSync(path.join(BETA, 'index.html'), 'utf8'), { url: 'https://example.test/beta/index.html', runScripts: 'outside-only' }).window;
  Object.defineProperty(dT, 'localStorage', { get() { throw new Error('denied'); } });
  dT.fetch = () => Promise.reject(new Error('x'));
  let threw = false; try { dT.eval(LOCALE_JS); } catch (e) { threw = true; }
  chk('locale.js survives a throwing localStorage', [threw, dT.document.documentElement.lang], [false, 'en']);

  console.log(failures ? `\n>>> FAIL — ${failures} i18n check(s) failed` : '\n>>> PASS — i18n: pseudo-locale 0 hard-coded strings, hreflang, switcher offers en + ja (AI tier, labelled)');
  process.exit(failures ? 1 : 0);
})();
