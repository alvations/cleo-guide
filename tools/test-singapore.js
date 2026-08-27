#!/usr/bin/env node
/**
 * Test EVERY Singapore/ place page in jsdom with the real Leaflet library.
 * For each page, two scenarios (like tools/test.js):
 *   Leaflet AVAILABLE -> map panes build, markers draw for the default mode, no JS errors
 *   Leaflet BLOCKED   -> content still renders, no JS errors
 * Plus a check that the pastel hub (Singapore/index.html) loads clean with links to every page.
 *
 * Usage:  cd tools && node test-singapore.js
 */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'Singapore');
const LEAF = fs.readFileSync(require.resolve('leaflet/dist/leaflet.js'), 'utf8').replace(/<\/script/gi, '<\\/script');
const CDN = /<script src="https:\/\/cdnjs[^"]*"><\/script>/;

let failures = 0, pagesOK = 0;
const chk = (page, name, ok, got) => {
  if (!ok) { console.log(`  FAIL  [${page}] ${name}` + (got !== undefined ? ` = ${JSON.stringify(got)}` : '')); failures++; }
  return ok;
};

function shimSvg(w) {
  const proto = w.SVGSVGElement && w.SVGSVGElement.prototype;
  if (proto && !proto.createSVGRect) proto.createSVGRect = () => ({ x: 0, y: 0, width: 0, height: 0 });
}
function boot(html, withLeaflet) {
  const errs = [];
  const src = html.replace(CDN, withLeaflet ? '<script>' + LEAF + '</script>' : '<script>/*blocked*/</script>');
  const dom = new JSDOM(src, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://x.test/', beforeParse: shimSvg });
  const w = dom.window;
  w.addEventListener('error', e => errs.push('ERR ' + (e.message || (e.error && e.error.message) || e.error)));
  w.console.error = (...a) => errs.push('console.error: ' + a.join(' '));
  return { w, d: w.document, errs };
}
// count records in the page's const P / const F arrays (default mode markers = that mode's records).
// Terminate each array at '];' (handles the empty `const P = [];` case, which '\n]' would overshoot).
function counts(html) {
  const grab = (marker) => { const i = html.indexOf(marker); if (i < 0) return 0; const j = html.indexOf('];', i); return (html.slice(i, j).match(/\bn:"/g) || []).length; };
  // food-only pages open in food mode via the init setMode('food') (newline-prefixed standalone call)
  return { P: grab('const P = ['), F: grab('const F = ['), foodDefault: /\nsetMode\('food'\)/.test(html) };
}

const pages = fs.readdirSync(DIR).filter(f => f.endsWith('.html') && f !== 'index.html').sort();
console.log(`Testing ${pages.length} place pages + hub ...\n`);

for (const f of pages) {
  const html = fs.readFileSync(path.join(DIR, f), 'utf8');
  const { P, F, foodDefault } = counts(html);
  const total = P + F;
  const defaultMarkers = foodDefault ? F : P;    // markers shown on load = default mode's records

  // Scenario 1: Leaflet available
  const a = boot(html, true);
  const q = s => a.d.querySelectorAll(s).length;
  let ok = true;
  ok &= chk(f, 'entry cards render on load', q('.entry') > 0, q('.entry'));
  ok &= chk(f, 'no js errors (leaflet on)', a.errs.length === 0, a.errs.slice(0, 2));
  ok &= chk(f, 'leaflet panes built', !!a.d.querySelector('#map .leaflet-pane'), true);
  const markers = q('#map .leaflet-overlay-pane path');
  ok &= chk(f, `markers drawn (expect ~${defaultMarkers})`, markers === defaultMarkers && markers > 0, markers);
  // switching to the other mode must also draw its markers
  if (F > 0 && P > 0) {
    a.d.getElementById(foodDefault ? 'modeSights' : 'modeFood').click();
    const m2 = q('#map .leaflet-overlay-pane path');
    ok &= chk(f, 'markers redraw after mode switch', m2 > 0, m2);
  }

  // Scenario 2: Leaflet blocked — content must still render
  const b = boot(html, false);
  const qb = s => b.d.querySelectorAll(s).length;
  ok &= chk(f, 'entry cards render (leaflet blocked)', qb('.entry') > 0, qb('.entry'));
  ok &= chk(f, 'no js errors (leaflet blocked)', b.errs.length === 0, b.errs.slice(0, 2));

  if (ok) { pagesOK++; console.log(`  PASS  ${f.padEnd(24)} P${P} F${F}  markers=${markers}`); }
}

// Hub
{
  const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  const { d, errs } = boot(html, false);
  const links = [...d.querySelectorAll('a.pcard')].map(a => a.getAttribute('href'));
  chk('index.html', 'hub loads with no js errors', errs.length === 0, errs.slice(0, 2));
  chk('index.html', 'hub links to place pages', links.length === pages.length, links.length);
  const missing = links.filter(h => !fs.existsSync(path.join(DIR, h)));
  chk('index.html', 'every hub link resolves to a file', missing.length === 0, missing);
  if (!missing.length && errs.length === 0 && links.length === pages.length) console.log(`  PASS  index.html (hub)     ${links.length} place links`);
}

console.log(`\n${pagesOK}/${pages.length} place pages passed` + (failures ? `  —  >>> ${failures} FAILURES` : '  —  >>> ALL PASS'));
process.exit(failures ? 1 : 0);
