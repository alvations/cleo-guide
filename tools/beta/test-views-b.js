#!/usr/bin/env node
'use strict';
/**
 * tools/beta/test-views-b.js — FE-B gate for the Wave 3 views (Guidebook B-01/B-03, Insights B-02, hub links B-04).
 * Run from test-hubs.js (so it is part of `npm test`), or alone: node tools/beta/test-views-b.js
 *
 *  1. GUIDEBOOK, every place page: entries == N, each id exactly once, in view order; no empty section; closed entries
 *     carry no tier; the intro prose is template words + computed numbers + names from the data, nothing else;
 *     the sources appendix carries every source of the page and every URL a record cites.
 *  2. INSIGHTS, every place page: every chart's segments sum to its denominator; per-area numbers equal the platform's
 *     guide.areas; a city with no pop-culture data says so (null, not 0); the index lists N names; no chart library.
 *  3. HONESTY on both renders: no price, rating, booking, availability or opening-hours strings.
 *  4. jsdom on pilot city pages: both modules mount through Cleo.views (or the queue) with storage blocked, render
 *     every place, follow the city page's lens (no second predicate), and fail with a stated message, not an error.
 *  5. HUB LINKS (B-04): every "Read as a guidebook" / "in numbers" link points at a generated city page and a real view.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const G = require('./client/guidebook.js');
const I = require('./client/insights.js');

const ROOT = path.resolve(__dirname, '..', '..');
const BETA = path.join(ROOT, 'beta');
let failures = 0;
const chk = (name, ok, got) => { console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${got !== undefined ? ' = ' + JSON.stringify(got).slice(0, 240) : ''}`); if (!ok) failures++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const files = fs.readdirSync(path.join(BETA, 'data/places')).filter(f => f.endsWith('.json')).sort();
const load = f => JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8'));
const HONESTY = /(\$\s?\d|€\s?\d|¥\s?\d|£\s?\d|\bprice[sd]?\b|\brating\b|\bstars?\b(?! ?\d? ?·)|\bbook now\b|\bbooking\b|\breserve (?:a|your)\b|\breservations?\b|\bavailability\b|\bopen(?:ing)? hours\b|\bopen now\b)/i;
const textOf = h => h.replace(/<[^>]+>/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

(async () => {
  console.log('FE-B views — Guidebook + Insights (W3)');
  let bad = { n: [], once: [], order: [], empty: [], tier: [], intro: [], src: [], sums: [], plat: [], pop: [], idx: [], honest: [], quoted: [], chph: [], edition: [], since: [], cover: [], rec: [] };
  let nChPh = 0, nCover = 0, nSince = 0;
  const quoted = require('./lib/quoted');
  let nQuoted = 0;
  for (const f of files) {
    const d = load(f), N = d.places.length;
    // ---- 1 · Guidebook
    const r = G.render(d), h = r.html, M = r.model;
    const ids = [...h.matchAll(/<li class="ge" id="gb-([^"]+)"/g)].map(m => m[1]);
    if (ids.length !== N) bad.n.push(f);
    if (new Set(ids).size !== N || d.places.some(p => !ids.includes(p.id.replace(/&/g, '&amp;').replace(/"/g, '&quot;')))) bad.once.push(f);
    // view order within each section follows rank; sections in fixed order
    for (const m of h.matchAll(/<ol class="gl">([\s\S]*?)<\/ol>/g)) {
      const rk = [...m[1].matchAll(/data-rank="(\d+)"/g)].map(x => +x[1]);
      if (rk.some((x, i) => i && x < rk[i - 1])) { bad.order.push(f); break; }
    }
    if (/<section class="gs[^"]*"><h3 class="d3">[^<]*<span class="meta">0<\/span>/.test(h)) bad.empty.push(f);
    if (/<li class="ge"[^>]*data-closed>(?:(?!<\/li>)[\s\S])*class="tier /.test(h)) bad.tier.push(f);
    // intro: remove data names, then every word must be template text or a number
    const words = new Set(G.TEMPLATE.toLowerCase().replace(/[^a-z\s-]/g, ' ').split(/\s+/).filter(Boolean));
    const names = d.places.map(p => M.order.find(x => x.p.id === p.id).name)
      .concat(d.areas.map(a => G.shortArea(a.n)), (d.sourceIndex || []).map(s => String(s.name).split(/\s+[·—(]\s*/)[0].slice(0, 34)), ['Added by the guide'])
      .filter(Boolean).sort((a, b) => b.length - a.length);
    for (const m of h.matchAll(/<p class="ch-intro">([^<]*)<\/p>/g)) {
      let t = m[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
      for (const n of names) t = t.split(n).join(' ');
      const left = t.toLowerCase().replace(/[0-9]+/g, ' ').replace(/[^a-z\s-]/g, ' ').split(/\s+/).filter(w => w && !words.has(w));
      if (left.length) { bad.intro.push(f + ': ' + left.slice(0, 5).join(' ')); break; }
    }
    // sources appendix: every source, every URL a record cites
    const app = h.slice(h.indexOf('id="gb-sources"'));
    const missing = (d.sourceIndex || []).filter(s => !app.includes('<b>' + s.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') + '</b>'));
    const cited = new Set(d.places.flatMap(p => (p.s || []).map(x => x[1]).filter(u => /^https?:\/\//.test(u || ''))));
    const urls = new Set([...app.matchAll(/<a href="([^"]+)"/g)].map(m => m[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')));
    const lost = [...cited].filter(u => !urls.has(u));
    if (missing.length || lost.length) bad.src.push(`${f}: ${missing.length} sources, ${lost.length} URLs (${lost[0] || ''})`);
    // ---- 2 · Insights
    const ir = I.render(d), X = ir.numbers, s = o => Object.values(o || {}).reduce((a, b) => a + b, 0);
    const ok = s(X.kind.whole) === N && X.areas.every(a => s(X.kind.perArea[a.id]) === X.perArea[a.id] && s(X.src.perArea[a.id]) === d.places.filter(p => p.a === a.id).reduce((t, p) => t + p.src.length, 0))
      && s(X.perArea) === N && s(X.closed) === X.tiles.closed && X.areas.reduce((t, a) => t + s(X.tiers[a.id]), 0) === N - X.tiles.closed
      && s(X.months) === N && X.areas.reduce((t, a) => t + s(X.src.perArea[a.id]), 0) === X.tiles.citations
      && X.tiles.citations === d.places.reduce((t, p) => t + p.src.length, 0) && X.tiles.sights + X.tiles.food === N;
    if (!ok) bad.sums.push(f);
    if (X.from !== 'platform' || !d.insights) bad.plat.push(f + ' (not drawn from the P-03 insights block)');
    const own = I.numbers(d);   // independent recount from the records: the block and the records must agree
    if (JSON.stringify(Object.values(own.perArea)) !== JSON.stringify(X.areas.map(a => X.perArea[a.id])) || own.tiles.closed !== X.tiles.closed
      || X.areas.some(a => s(own.tiers[a.id]) !== s(X.tiers[a.id]) || own.closed[a.id] !== X.closed[a.id])) bad.plat.push(f + ' (block != records)');
    const GA = (d.guide || {}).areas || {};
    for (const a of X.areas) {
      const g = GA[a.id]; if (!g) continue;
      const k = X.kind.perArea[a.id];
      if (g.n !== X.perArea[a.id] || g.closed !== X.closed[a.id] || g.food !== (k.food || 0) || g.sights !== (k.sight || 0) + (k.pop || 0)
        || s(g.tiers) !== s(X.tiers[a.id]) + X.closed[a.id]) { bad.plat.push(f + ':' + a.id); break; }   // guide.areas tiers include closed places
    }
    const hasPop = !!((d.guide || {}).popCulture && d.guide.popCulture.c && d.guide.popCulture.c.length);
    if (hasPop ? X.tiles.pop === null : X.tiles.pop !== null || !/no pop-culture collection/.test(ir.html)) bad.pop.push(f);
    if (ir.index !== N || (ir.html.match(/<li class="ixi"/g) || []).length !== N) bad.idx.push(f);
    if (/<script|cdn|https?:\/\/(?!www\.w3\.org)/i.test(ir.html)) bad.idx.push(f + ' (external ref in insights)');
    // ---- W9-1 · Insights "Recognised places by area": open places with a rec from their own source keys, each once;
    // agrees with the platform's per-area block (its `any` counts closed ones too) and with a recount of the records
    {
      const R = d.recognition, rc = X.rec, has = p => !!(p.rec && ((p.rec.award && p.rec.award.length) || p.rec.video || p.rec.cited));
      const open = d.places.filter(p => !p.closed && has(p)), closedR = d.places.filter(p => p.closed && has(p)).length;
      if (!R) { if (!/id="in-rec"[\s\S]*?Stated, not filled/.test(ir.html)) bad.rec.push(f + ': no data, no stated gap'); }
      else if (!rc || rc.total !== open.length || rc.closed !== closedR || Object.values(rc.perArea).reduce((a, b) => a + b, 0) !== rc.total
        || Object.entries(R.byArea).some(([a, v]) => (rc.perArea[a] || 0) + d.places.filter(p => p.a === a && p.closed && has(p)).length !== v.any)
        || !ir.html.includes('id="in-rec"') || !ir.html.includes(`(${open.length} of ${d.places.filter(p => !p.closed).length} open places)`))
        bad.rec.push(`${f}: ${rc && rc.total} vs ${open.length}`);
      else if (!rc.kinds.video && !/no vetted creator video is on record/i.test(ir.html)) bad.rec.push(f + ': video gap not stated');
    }
    // ---- W8 · Guidebook chapter photos: open sights only, never Vietnam, credit under the media with a licence link
    for (const [aid, cp] of Object.entries(d.chapterPhotos || {})) {
      nChPh++;
      const rec = d.places.find(p => p.id === cp.id);
      if (!rec || rec.closed || rec.kind !== 'sight' || rec.a !== aid || d.country === 'vietnam') bad.chph.push(`${f} ${aid}: ${cp.id}`);
      const fig = (h.match(new RegExp('<article class="ch" id="gb-area-' + aid + '"[\\s\\S]*?<figure class="photo ch-photo">([\\s\\S]*?)</figure>')) || [])[1] || '';
      if (!/<figcaption>[\s\S]*rel="license/.test(fig) || !/alt="[^"]+"/.test(fig) || !/loading="lazy"/.test(fig)) bad.chph.push(`${f} ${aid}: figure/credit`);
    }
    // ---- W9-10 · the dated edition: the cover's numbers are the page JSON's; the edition month is the newest change date
    {
      const top = (d.changes || []).map(c => c.d).sort().pop() || '', ed = top.slice(0, 7);
      const line = (h.match(/<p class="edition" data-edition="([^"]+)">([\s\S]*?)<\/p>/) || []);
      const st = d.stats, closed = d.places.filter(p => p.closed).length;
      const num = k => +((line[2] || '').match(new RegExp('data-n="' + k + '">([\\d,]+)')) || [])[1];
      if (!ed || line[1] !== ed || !line[2].includes(G.longDate(ed) + ' edition')) bad.edition.push(`${f}: edition ${line[1]} != ${ed}`);
      else if (num('total') !== N || st.total !== N || num('closed') !== closed || st.closed !== closed
        || !line[2].includes(`datetime="${st.lastChecked}"`) || (d.places.map(p => (p.pv || {}).checked || '').sort().pop() || st.lastChecked) !== st.lastChecked)
        bad.edition.push(`${f}: cover ${num('total')}/${num('closed')} vs ${N}/${closed}`);
      // "Since the last edition": every dated change in the edition month, nothing else, each dated
      const sec = (h.match(/<section class="gb-since"[\s\S]*?<\/section>/) || [''])[0];
      const want = (d.changes || []).filter(c => c.d.slice(0, 7) === ed);
      const got = [...sec.matchAll(/<li data-kind="([^"]+)"><time datetime="([^"]+)">/g)].map(m => m[1] + '@' + m[2]);
      nSince += got.length;
      if (got.join() !== want.map(c => c.kind + '@' + c.d).join() || (d.changesPage && !sec.includes(`href="${d.changesPage}"`))) bad.since.push(f);
      for (const c of want.filter(c => c.kind === 'closed')) if (!sec.includes(`href="#p=${encodeURIComponent(c.id)}"`)) bad.since.push(`${f}: ${c.id}`);
      // the cover photo: credited, never Vietnam; if it depicts one of this guide's places, an open sight
      const cp = d.coverPhoto;
      if (cp) {
        nCover++;
        const rec = d.places.find(p => cp.src.includes('--' + p.id + '-'));
        if (d.country === 'vietnam' || (rec && (rec.closed || rec.kind !== 'sight'))) bad.cover.push(`${f}: ${cp.src}`);
        const fig = (h.match(/<figure class="photo gc-photo">([\s\S]*?)<\/figure>/) || [])[1] || '';
        if (!/<figcaption>[\s\S]*rel="license/.test(fig) || !/alt="[^"]+"/.test(fig)) bad.cover.push(`${f}: figure/credit`);
      } else if (/gc-photo/.test(h)) bad.cover.push(`${f}: photo without coverPhoto`);
    }
    // ---- D-39 · price/rating prose is labelled, not stripped: the note on exactly the records whose own prose quotes one
    for (const p of d.places) {
      const q = quoted.quotes(p), li = (h.match(new RegExp('<li class="ge" id="gb-' + p.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[\\s\\S]*?</li>')) || [''])[0];
      const shown = /<p class="gq sm muted">Prices and ratings are quoted from the source at the time of research \(/.test(li);
      if (q) nQuoted++;
      if (q !== !!p.pq || q !== shown) bad.quoted.push(`${f} ${p.id}: prose quotes=${q} pq=${p.pq || '-'} note=${shown}`);
    }
    // ---- 3 · honesty (write-ups and notes are the record's own words; the view's chrome must add none)
    // D-39: the dated-quote label is a stated limit of the record's own prose (exact sentence only), not view copy
    let chrome = textOf(h.replace(/<p class="ge-w">[\s\S]*?<\/p>|<p class="gk">[\s\S]*?<\/p>|<p class="gq sm muted">Prices and ratings are quoted from the source at the time of research \((?:\d{4}-\d{2}-\d{2}|undated)\)\.<\/p>|<section class="gb-appendix"[\s\S]*$/g, '') + ir.html.replace(/<li class="ixi"[\s\S]*?<\/li>/g, ''));
    for (const nm of names.concat(d.places.map(p => p.ad || ''), d.places.map(p => p.n)).filter(Boolean).sort((a, b) => b.length - a.length)) chrome = chrome.split(nm.replace(/&/g, '&')).join(' ');
    const hit = HONESTY.exec(chrome); if (hit) bad.honest.push(f + ': ' + chrome.slice(Math.max(0, hit.index - 40), hit.index + 30));
  }
  const n = files.length;
  chk(`guidebook: entries == N on all ${n} place pages`, !bad.n.length, bad.n);
  chk('guidebook: every place exactly once', !bad.once.length, bad.once);
  chk('guidebook: rank order within every section', !bad.order.length, bad.order);
  chk('guidebook: no empty section', !bad.empty.length, bad.empty);
  chk('guidebook: closed entries carry no tier', !bad.tier.length, bad.tier);
  chk('guidebook: intro = template words + numbers + data names only', !bad.intro.length, bad.intro);
  chk('guidebook: appendix lists every source and every cited URL', !bad.src.length, bad.src);
  chk('insights: every chart sums to its denominator', !bad.sums.length, bad.sums);
  chk('insights: drawn from the P-03 block; it agrees with guide.areas and a recount of the records', !bad.plat.length, bad.plat);
  chk('insights: no pop-culture data → absent (null + stated), not 0', !bad.pop.length, bad.pop);
  chk('insights: index lists N names; no script/CDN in the view', !bad.idx.length, bad.idx);
  chk('honesty: no price / rating / booking / hours strings in either view', !bad.honest.length, bad.honest);
  chk(`W8: Guidebook chapter photos (${nChPh}) are open sights with a linked credit under the media, never Vietnam`, !bad.chph.length && nChPh > 0, bad.chph.slice(0, 4));
  chk('W9-1: Insights "Recognised places by area" = open places with a source-key recognition, once each; agrees with the platform block', !bad.rec.length, bad.rec.slice(0, 4));
  chk('W9-10: edition month = newest change date; cover numbers = page JSON (places, closed, checked-to date)', !bad.edition.length, bad.edition.slice(0, 4));
  chk(`W9-10: "Since the last edition" lists exactly the edition month's dated changes (${nSince}), closures linked, full log linked`, !bad.since.length && nSince > 0, bad.since.slice(0, 4));
  chk(`W9-10: edition cover photos (${nCover}) credited, never Vietnam, never a food or closed place`, !bad.cover.length && nCover > 0, bad.cover.slice(0, 4));
  {
    const css = fs.readFileSync(path.join(BETA, 'assets', 'cleo.css'), 'utf8');
    let pr = '';                                       // every @media print block, by brace matching
    for (let i = css.indexOf('@media print'); i >= 0; i = css.indexOf('@media print', i + 1)) {
      let j = css.indexOf('{', i) + 1, depth = 1; const a = j;
      while (depth && j < css.length) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++; }
      pr += css.slice(a, j - 1) + '\n';
    }
    chk('W9-10 booklet print: the cover and "Since the last edition" each on a page of their own', /\.gcover\s*\{[^}]*break-after:\s*page/.test(pr) && /\.gb-since\s*\{[^}]*break-after:\s*page/.test(pr), true);
  }
  chk(`D-39: dated-quote note on every record whose prose quotes a price or rating, and on no other (${nQuoted} records)`, !bad.quoted.length && nQuoted > 100, bad.quoted.slice(0, 4));

  // ---- 4 · jsdom on pilot city pages, storage blocked
  const PILOTS = [['cities/tokyo.html', 'tokyo'], ['cleveland.html', 'cleveland'], ['Singapore/chinatown.html', 'singapore--chinatown']];
  for (const [page, file] of PILOTS) {
    if (!fs.existsSync(path.join(BETA, page))) { chk(`${page} exists`, false); continue; }
    const N = load(file + '.json').places.length;
    let html = fs.readFileSync(path.join(BETA, page), 'utf8').replace(/<script src="((?:\.\.\/)*assets\/js\/[a-z-]+\.js)\?v=[^"]*" defer><\/script>/g,
      (m, src) => '<script>' + fs.readFileSync(path.join(BETA, path.dirname(page), src), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>');
    html = html.replace('</body>', ['guidebook', 'insights'].map(x => '<script>' + fs.readFileSync(path.join(__dirname, 'client', x + '.js'), 'utf8') + '</script>').join('') + '</body>');
    const errs = [];
    const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://x.test/beta/' + page,
      beforeParse(w) {
        w.Element.prototype.scrollIntoView = function () {};
        w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
        Object.defineProperty(w, 'localStorage', { get() { throw new Error('SecurityError'); } });
        w.fetch = u => { const p = path.join(BETA, /data\/places\//.test(u) ? 'data/places/' + u.split('data/places/')[1] : new URL(u, w.location.href).pathname.replace(/^\/beta\//, ''));
          return fs.existsSync(p) ? Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(fs.readFileSync(p, 'utf8'))) }) : Promise.resolve({ ok: false, status: 404 }); };
        w.addEventListener('error', e => errs.push('ERR ' + (e.message || e.error)));
      } });
    const w = dom.window, d = w.document; await sleep(30);
    const reg = {}; const views = w.Cleo && w.Cleo.views && w.Cleo.views.get ? null : (w.CleoViewQueue || []);
    (views || []).forEach(([k, def]) => { reg[k] = def; });
    const gb = (views ? reg.guidebook : (w.Cleo.views.get && w.Cleo.views.get('guidebook'))) || { mount: w.CleoGuidebook.mount, unmount: w.CleoGuidebook.unmount };
    const ins = (views ? reg.insights : (w.Cleo.views.get && w.Cleo.views.get('insights'))) || { mount: w.CleoInsights.mount, unmount: w.CleoInsights.unmount };
    const host = d.createElement('div'); d.getElementById('main').appendChild(host);
    const mr = await gb.mount(host, {}).catch(e => { errs.push('mount: ' + e.stack); });
    chk(`${page}: guidebook mounts with storage blocked, ${N} entries`, host.querySelectorAll('li.ge').length === N, host.querySelectorAll('li.ge').length);
    chk(`${page}: guidebook count line reads All N`, /All \d+ places/.test((host.querySelector('[data-gb-count]') || {}).textContent || ''), (host.querySelector('[data-gb-count]') || {}).textContent);
    // lens mirror: hide one canonical card → its entry hides; no predicate of our own
    w.location.hash = '#mode=food';
    for (let i = 0; i < 60 && (!d.querySelectorAll('li.pl[hidden]').length || host.querySelectorAll('li.ge[hidden]').length !== d.querySelectorAll('li.pl[hidden]').length); i++) await sleep(50);
    const vis = [...host.querySelectorAll('li.ge:not([hidden])')].map(li => li.getAttribute('data-k3'));
    const cards = [...d.querySelectorAll('li.pl:not([hidden])')].length;
    chk(`${page}: guidebook follows the city lens (mode=food → only food entries, == visible cards)`, vis.length > 0 && vis.every(k => k === 'food') && vis.length === cards && /of all \d+ places/.test(host.querySelector('[data-gb-count]').textContent), [vis.length, cards]);
    w.location.hash = '';
    for (let i = 0; i < 40 && host.querySelectorAll('li.ge[hidden]').length; i++) await sleep(50);
    chk(`${page}: lens cleared → all entries back`, host.querySelectorAll('li.ge:not([hidden])').length === N, host.querySelectorAll('li.ge:not([hidden])').length);
    // save toggles through Cleo.saved (memory store when storage throws)
    const sv = host.querySelector('[data-cleo-ref]'); if (sv) sv.click(); await sleep(2);
    chk(`${page}: entry Save toggles Cleo.saved (storage blocked → memory)`, !!sv && sv.getAttribute('aria-pressed') === 'true', sv && sv.getAttribute('aria-pressed'));
    gb.unmount();
    await ins.mount(host, {});
    chk(`${page}: insights mounts, 8 chart cards (W9-1 adds recognition), index N`, host.querySelectorAll('.igrid > .icard').length === 8 && host.querySelectorAll('li.ixi').length === N, [host.querySelectorAll('.igrid > .icard').length, host.querySelectorAll('li.ixi').length]);
    const links = [...host.querySelectorAll('svg a')].map(a => a.getAttribute('href'));
    const KEYS = new Set(['view', 'a', 'mode', 'c', 'cz', 'src', 't', 'closed']);
    chk(`${page}: every bar is a lens link with known route keys`, links.length > 0 && links.every(hh => /^#view=(gallery|atlas)&/.test(hh) && hh.slice(1).split('&').every(kv => KEYS.has(kv.split('=')[0]))), links.find(hh => !/^#view=/.test(hh)));
    chk(`${page}: every chart has a table and a footnote or empty-state`, [...host.querySelectorAll('.igrid > .icard')].every(c => c.querySelector('details.tbl') || c.querySelector('.empty')));
    ins.unmount();
    // failure path: JSON unavailable → stated message, no throw
    w.fetch = () => Promise.resolve({ ok: false, status: 503 });
    w.Cleo.pageData = () => Promise.reject(new Error('offline'));
    await gb.mount(host, {});
    chk(`${page}: guidebook offline → stated message`, !!host.querySelector('[data-cleo-state="view-failed"]'));
    gb.unmount();
    chk(`${page}: 0 JS errors`, errs.length === 0, errs.slice(0, 3));
    w.close();
  }

  // ---- 5 · hub links (B-04)
  const hubs = ['index.html'].concat(fs.readdirSync(BETA).filter(x => fs.existsSync(path.join(BETA, x, 'index.html'))).map(x => x + '/index.html'));
  let nLinks = 0; const badL = [];
  for (const hp of hubs) {
    const h = fs.readFileSync(path.join(BETA, hp), 'utf8');
    for (const m of h.matchAll(/<a href="([^"#]+)#view=([a-z]+)" data-view-link/g)) {
      nLinks++;
      const target = path.join(BETA, path.dirname(hp), m[1]);
      if (!fs.existsSync(target) || !['guidebook', 'insights'].includes(m[2]) || !/data-cleo-page="city"/.test(fs.readFileSync(target, 'utf8'))) badL.push(hp + ' → ' + m[1]);
    }
  }
  chk(`hubs: view links resolve to generated city pages and real views (${nLinks})`, nLinks > 0 && !badL.length, badL.slice(0, 3));

  // ---- 6 · landing editorial rail (ROUND-2 gap #4): one ★ per live country, counts from the guides, links resolve
  {
    const h = fs.readFileSync(path.join(BETA, 'index.html'), 'utf8');
    const rail = (/<nav class="rail editorial"[\s\S]*?<\/nav>/.exec(h) || [''])[0];
    const tiles = [...rail.matchAll(/<a class="rail-i sig" href="([^"#]+)#(sig=1|c=[A-Z_-]+)">[\s\S]*?<span class="t">([^<]*)<\/span>[\s\S]*?<span class="n">([\d,]+)<\/span><\/a>/g)];
    const live = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/countries.json'), 'utf8')).countries.filter(c => c.live).length;
    const guide = JSON.parse(fs.readFileSync(path.join(BETA, 'data/guide.json'), 'utf8')).pages;
    const badT = tiles.filter(([, href, , t, n]) => {
      if (!fs.existsSync(path.join(BETA, href))) return true;
      const title = t.replace(/&amp;/g, '&'), seen = new Set();
      // OWNER-casing (6b48078d) sentence-cases the ★ label on the page; the guide keeps the data title, so match without case
      const tot = guide.filter(g => g.signature && g.signature.title.toLowerCase() === title.toLowerCase() && !seen.has(g.name) && seen.add(g.name)).reduce((a, g) => a + g.signature.n, 0);
      return +n.replace(/,/g, '') > tot || +n.replace(/,/g, '') <= 0;
    });
    chk(`landing: editorial rail has one ★ tile per live country (${tiles.length}/${live}), counts from the guides, links resolve`, tiles.length === live && !badT.length, badT.map(x => x[3]));
    const tails = ['index.html'].concat(hubs).filter(hp => !/<\/html>\s*$/.test(fs.readFileSync(path.join(BETA, hp), 'utf8')));
    chk('landing + hubs: nothing after </html>', !tails.length, tails);
    chk('landing: share card is the US country card', /og:image" content="[^"]*\/assets\/og\/country-us\.png"/.test(h));
  }

  console.log(failures ? `\n>>> FAIL — ${failures} FE-B view check(s) failed` : '\n>>> PASS — FE-B views: Guidebook + Insights hold every place, numbers add up, hub links resolve');
  process.exitCode = failures ? 1 : 0;
})();
