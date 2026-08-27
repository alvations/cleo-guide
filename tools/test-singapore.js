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

  // NO Google / API-key surface — assert on what the VIEWER actually sees + the network, not dead
  // <script> strings. No key button, no google chips, base controls show no "API"/"KEY", the active
  // default base is a FREE no-key layer, no google tiles/script at init, no key-required base in data,
  // and the rendered methodology text never says "API key".
  const baseText = (a.d.getElementById('baseFilter') || {}).textContent || '';
  ok &= chk(f, 'base controls show no API/KEY text', !/api|key/i.test(baseText), baseText.slice(0, 50));
  ok &= chk(f, 'no keyBtn element', !a.d.getElementById('keyBtn'));
  ok &= chk(f, 'no google (g_) base chips', a.d.querySelectorAll('#baseFilter .chip[data-v^="g_"]').length === 0, a.d.querySelectorAll('#baseFilter .chip[data-v^="g_"]').length);
  ok &= chk(f, 'no key-required (free:0) base in BASES data', !/free:0/.test(html));
  ok &= chk(f, 'no google tiles requested', ![...a.d.querySelectorAll('#map img')].some(i => /googleapis|google\.com|gstatic\.com\/mapfiles|khms|mts\d/.test(i.src)));
  ok &= chk(f, 'no googleapis script injected', !a.d.querySelector('script[src*="googleapis"]'));
  ok &= chk(f, 'rendered methodology has no "API key"', !/api key/i.test((a.d.querySelector('.appendix') || {}).textContent || ''));
  const activeChip = [...a.d.querySelectorAll('#baseFilter .chip')].find(c => c.getAttribute('aria-pressed') === 'true');
  ok &= chk(f, 'active base is a free no-key layer', !!activeChip && !/^g_/.test(activeChip.dataset.v || ''), activeChip && activeChip.dataset.v);

  // Scenario 2: Leaflet blocked — content must still render
  const b = boot(html, false);
  const qb = s => b.d.querySelectorAll(s).length;
  ok &= chk(f, 'entry cards render (leaflet blocked)', qb('.entry') > 0, qb('.entry'));
  ok &= chk(f, 'no js errors (leaflet blocked)', b.errs.length === 0, b.errs.slice(0, 2));
  // no literal \uXXXX / <\/ escape leaked into the VISIBLE HTML (outside <script>)
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  ok &= chk(f, 'no literal \\uXXXX escape in visible HTML', !/\\u[0-9a-fA-F]{4}|<\\\//.test(visible), (visible.match(/\\u[0-9a-fA-F]{4}/) || [''])[0]);

  if (ok) { pagesOK++; console.log(`  PASS  ${f.padEnd(24)} P${P} F${F}  markers=${markers}`); }
}

// Hub
{
  const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  const { d, errs } = boot(html, false);
  const allCards = [...d.querySelectorAll('.pcard')];
  const links = [...d.querySelectorAll('a.pcard')].map(a => a.getAttribute('href'));
  const disabled = [...d.querySelectorAll('.pcard.disabled')];
  const missing = links.filter(h => !fs.existsSync(path.join(DIR, h)));
  // disabled (greyed) cards must NOT be links and must be non-interactive
  const disabledAreLinks = disabled.filter(c => c.tagName === 'A' || c.getAttribute('href'));
  let ok = true;
  ok &= chk('index.html', 'hub loads with no js errors', errs.length === 0, errs.slice(0, 2));
  ok &= chk('index.html', 'every place represented (link or greyed)', allCards.length === pages.length, allCards.length);
  ok &= chk('index.html', 'every hub link resolves to a file', missing.length === 0, missing);
  ok &= chk('index.html', 'greyed cards are not clickable links', disabledAreLinks.length === 0, disabledAreLinks.length);
  ok &= chk('index.html', 'greyed cards exist (others not yet live)', disabled.length > 0, disabled.length);
  ok &= chk('index.html', 'Toa Payoh is a live clickable link', links.includes('toa-payoh.html'), links);
  if (ok) console.log(`  PASS  index.html (hub)     ${links.length} live links, ${disabled.length} greyed`);
}

console.log(`\n${pagesOK}/${pages.length} place pages passed` + (failures ? `  —  >>> ${failures} FAILURES` : '  —  >>> ALL PASS'));
process.exit(failures ? 1 : 0);
