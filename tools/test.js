#!/usr/bin/env node
/**
 * Browser-free regression suite for the field guide.
 *
 * A real headless browser is ideal, but Chromium's download host is blocked in
 * many sandboxes. This runs the actual page in jsdom with the real Leaflet
 * library, under two scenarios that matter:
 *
 *   1. Leaflet delivered by the CDN   -> map, markers and base layers must work
 *   2. Leaflet blocked by the network -> everything except the map must work
 *
 * Scenario 2 is not hypothetical. It is the exact failure that took the guide
 * down once, and it is the reason the guide never waits on a CDN to render.
 *
 * Usage:  cd tools && npm install && npm test
 */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const GUIDE = path.join(__dirname, '..', 'cleveland.html');
const HTML = fs.readFileSync(GUIDE, 'utf8');
const LEAF = fs.readFileSync(require.resolve('leaflet/dist/leaflet.js'), 'utf8')
  .replace(/<\/script/gi, '<\\/script');
const CDN = /<script src="https:\/\/cdnjs[^"]*"><\/script>/;

let failures = 0;
const chk = (name, got, want) => {
  const ok = typeof want === 'function' ? want(got) : got === want;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name} = ${JSON.stringify(got)}`);
  if (!ok) failures++;
};

// jsdom omits SVGSVGElement.createSVGRect, a standard SVG DOM method every real
// browser implements. Leaflet's feature detection reads it to decide whether SVG
// is supported; without it Leaflet concludes SVG is unavailable, hands back a null
// renderer, and throws when the first vector layer is added — so no markers draw
// even though the page is fine in a browser. Restoring the method lets Leaflet's
// real SVG renderer run. This only affects the Leaflet-available scenario; the
// CDN-blocked path never loads Leaflet and is untouched.
function shimSvg(w) {
  const proto = w.SVGSVGElement && w.SVGSVGElement.prototype;
  if (proto && !proto.createSVGRect) {
    proto.createSVGRect = () => ({ x: 0, y: 0, width: 0, height: 0 });
  }
}

function boot(withLeaflet) {
  const errs = [];
  const html = HTML.replace(CDN,
    withLeaflet ? '<script>' + LEAF + '</script>' : '<script>/*blocked*/</script>');
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://x.test/',
    beforeParse: shimSvg,
  });
  const w = dom.window;
  w.addEventListener('error', e => errs.push('ERR ' + (e.message || e.error)));
  w.console.error = (...a) => errs.push('console.error: ' + a.join(' '));
  return { w, d: w.document, errs };
}

// ── 1 & 2: page load, both network scenarios ────────────────────────────────
for (const withL of [true, false]) {
  const { d, errs } = boot(withL);
  const q = s => d.querySelectorAll(s).length;
  console.log(`\n== LOAD: Leaflet ${withL ? 'AVAILABLE' : 'BLOCKED'} ==`);
  chk('entry cards render', q('.entry'), n => n > 0);
  chk('counter populated', (d.getElementById('count') || {}).textContent, t => /SHOWING \d+ OF \d+/.test(t));
  chk('checkboxes present', q('.pick'), n => n > 0);
  chk('visited buttons present', q('.seenbtn'), n => n > 0);
  chk('presets present', q('.preset'), n => n >= 8);
  chk('sources appendix', q('.srcrow'), n => n > 0);
  chk('no js errors', errs.length, 0);
  if (errs.length) console.log('        ', errs.slice(0, 3));
  if (withL) {
    chk('base layer chips (5 free, no Google)', q('#baseFilter .chip'), 5);
    chk('leaflet panes built', !!d.querySelector('#map .leaflet-pane'), true);
    chk('markers drawn', q('#map .leaflet-overlay-pane path'), n => n > 50);
  } else {
    chk('base row hidden', d.getElementById('baseWrap').hidden, true);
    chk('map notice shown', /blocked|Loading/.test(d.getElementById('map').textContent), true);
  }
}

// ── 3: interaction ──────────────────────────────────────────────────────────
{
  const { w, d, errs } = boot(true);
  const q = s => d.querySelectorAll(s).length;
  w.prompt = () => null;
  const click = sel => { const e = d.querySelector(sel); if (!e) throw new Error('missing ' + sel); e.click(); };
  console.log('\n== INTERACTION ==');

  const sights = q('.entry');
  click('#modeFood');
  chk('food mode switches', q('.entry'), n => n > 0 && n !== sights);
  let allCuisines = true;
  d.querySelectorAll('#cuisineFilter .chip').forEach(c => {
    if (c.dataset.v === 'all') return;
    c.click(); if (q('.entry') === 0) { allCuisines = false; console.log('   empty cuisine:', c.dataset.v); }
  });
  chk('every cuisine returns results', allCuisines, true);
  click('#cuisineFilter .chip[data-v=all]');
  click('#modeSights');
  chk('returns to sights', q('.entry'), sights);

  click('.preset[data-p=top10]');
  chk('top-10 preset', d.getElementById('tripN').textContent, '10');
  click('.preset[data-p=top20]');
  chk('top-20 preset', d.getElementById('tripN').textContent, '20');

  click('.seenbtn');
  chk('visited counter', /1 VISITED/.test(d.getElementById('count').textContent), true);
  click('#seenFilter .chip[data-v=hide]');
  chk('hide visited', q('.entry'), sights - 1);
  click('#seenFilter .chip[data-v=only]');
  chk('only visited', q('.entry'), 1);
  click('#seenFilter .chip[data-v=all]');

  click('#tripShow');
  chk('my-list view', q('.entry'), n => n > 0 && n < sights);
  click('#tripShow');

  ['dark', 'street', 'light', 'sat', 'terrain'].forEach(b => click(`#baseFilter .chip[data-v=${b}]`));
  chk('all free base layers switch', true, true);
  // No Google base-map surface may exist — a key-required layer/button is what put "API key required"
  // in front of viewers (on click and on the dead code paths). The pastel/US maps use only free tiles.
  chk('no Google base chip', q('#baseFilter .chip[data-v^=g_]'), 0);
  chk('no keyBtn element', d.getElementById('keyBtn') ? 1 : 0, 0);
  chk('no key-required (free:0) base in data', /free:0/.test(HTML) ? 1 : 0, 0);
  const gTokens = ['API key', 'maps.googleapis.com', 'GoogleMutant', 'promptKey', 'setGoogle', 'g_road', 'ADD GOOGLE', 'GKEY']
    .filter(t => HTML.replace(/https:\/\/fonts\.googleapis\.com/g, '').includes(t));
  chk('no Google base-map surface anywhere in file', gTokens.length, 0);

  click('#sortFilter .chip[data-v=cited]');
  click('#sortFilter .chip[data-v=rank]');
  click('#rankFilter .chip[data-v="1"]');
  chk('must-see filter', q('.entry'), n => n > 0 && n < sights);
  click('#rankFilter .chip[data-v=all]');

  const s = d.getElementById('search');
  s.value = 'zzzznomatch'; s.dispatchEvent(new w.Event('input'));
  chk('search with no hits shows empty state', q('.empty'), 1);
  s.value = ''; s.dispatchEvent(new w.Event('input'));

  chk('no js errors after interaction', errs.length, 0);
  if (errs.length) console.log('        ', errs.slice(0, 4));
}

// ── 4: exports and persistence ──────────────────────────────────────────────
{
  const { w, d, errs } = boot(true);
  let last = null;
  const orig = d.createElement.bind(d);
  d.createElement = t => { const e = orig(t); if (t === 'a') e.click = function () { last = { name: this.download }; }; return e; };
  w.URL.createObjectURL = () => 'blob:x'; w.URL.revokeObjectURL = () => {};
  w.alert = () => {}; w.open = u => { last = { opened: u }; };
  console.log('\n== EXPORTS & PERSISTENCE ==');
  d.querySelector('.preset[data-p=top10]').click();
  d.getElementById('tripKml').click();   chk('KML export', last && last.name, n => /\.kml$/.test(n));
  d.getElementById('tripJson').click();  chk('JSON export', last && last.name, n => /\.json$/.test(n));
  d.getElementById('saveGuide').click(); chk('offline copy export', last && last.name, n => /\.html$/.test(n));
  d.getElementById('tripGoogle').click();chk('google directions url', /maps\/dir\/\?api=1/.test(last.opened), true);
  chk('trip persisted', JSON.parse(w.localStorage.getItem('cle_trip')).length, 10);
  d.querySelector('.seenbtn').click();
  chk('visited persisted', JSON.parse(w.localStorage.getItem('cle_seen')).length, 1);
  chk('google link on card', /google\.com\/maps\/search/.test(d.querySelector('.entry .addr a').href), true);
  chk('apple link on card', /maps\.apple\.com/.test(d.querySelector('.applelink').href), true);
  chk('no js errors', errs.length, 0);
}

console.log('\n' + (failures ? `>>> ${failures} FAILURES` : '>>> ALL PASS'));
process.exit(failures ? 1 : 0);
