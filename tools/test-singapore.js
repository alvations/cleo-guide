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

const ROOT = path.join(__dirname, '..');
// Live engine countries → their folders (data-driven, from data/countries.json). Each folder holds its
// place pages + its own hub (index.html). Today: Singapore/ (Singapore towns + not-yet-live SEA pages)
// and Vietnam/ (HCMC + VN cities). singapore-old.html is the archived all-SEA hub, tested as a hub too.
const COUNTRIES = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'countries.json'), 'utf8')).countries;
const LIVE_FOLDERS = [...new Set(COUNTRIES.filter(c => c.kind === 'engine' && c.live).map(c => c.folder))];
const HUB_FILES = new Set(['index.html', 'singapore-old.html']);   // hubs, not place pages
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

// every place page across every live country folder (exclude the hub files)
const pages = [];
for (const folder of LIVE_FOLDERS) {
  const dir = path.join(ROOT, folder);
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html') && !HUB_FILES.has(f)).sort())
    pages.push({ folder, file: f, rel: `${folder}/${f}` });
}
console.log(`Testing ${pages.length} place pages across [${LIVE_FOLDERS.join(', ')}] + hubs ...\n`);

for (const pg of pages) {
  const f = pg.rel;
  const html = fs.readFileSync(path.join(ROOT, pg.folder, pg.file), 'utf8');
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
  // SOURCE-LEVEL guard: no Google base-map machinery may survive anywhere in the file (not just the
  // rendered DOM). The DOM-only checks above missed dormant setGoogle()/promptKey()/mountMap-comment
  // code that still carried "API key" and could resurface — this is what let "API key required" ship.
  // (fonts.googleapis.com stylesheet links are the only allowed google reference.)
  const noFonts = html.replace(/https:\/\/fonts\.googleapis\.com/g, '');
  const gTokens = ['API key', 'maps.googleapis.com', 'GoogleMutant', 'googleMutant', 'promptKey', 'setGoogle', 'g_road', 'ADD GOOGLE'].filter(t => noFonts.includes(t));
  ok &= chk(f, 'no Google base-map surface anywhere in file', gTokens.length === 0, gTokens);

  if (ok) { pagesOK++; console.log(`  PASS  ${f.padEnd(24)} P${P} F${F}  markers=${markers}`); }
}

// Per-country hubs — one per live engine folder, listing ONLY that country's places.
const EXPECT_LIVE = { 'Singapore': 'toa-payoh.html', 'Vietnam': 'ho-chi-minh-city.html' };
for (const folder of LIVE_FOLDERS) {
  const hub = path.join(ROOT, folder, 'index.html');
  const html = fs.readFileSync(hub, 'utf8');
  const { d, errs } = boot(html, false);
  const links = [...d.querySelectorAll('a.pcard')].map(a => a.getAttribute('href'));
  const disabled = [...d.querySelectorAll('.pcard.disabled')];
  const missing = links.filter(h => !fs.existsSync(path.join(ROOT, folder, h)));
  const disabledAreLinks = disabled.filter(c => c.tagName === 'A' || c.getAttribute('href'));
  const id = `${folder}/index.html`;
  let ok = true;
  ok &= chk(id, 'hub loads with no js errors', errs.length === 0, errs.slice(0, 2));
  ok &= chk(id, 'has at least one live place link', links.length > 0, links.length);
  ok &= chk(id, 'every hub link resolves to a file', missing.length === 0, missing);
  ok &= chk(id, 'greyed cards are not clickable links', disabledAreLinks.length === 0, disabledAreLinks.length);
  if (EXPECT_LIVE[folder]) ok &= chk(id, `${EXPECT_LIVE[folder]} is a live link`, links.includes(EXPECT_LIVE[folder]), links);
  if (ok) console.log(`  PASS  ${id.padEnd(24)} ${links.length} live links, ${disabled.length} greyed`);
}

// Root country hub — links to each live country's hub, and those hubs exist.
{
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const hubs = COUNTRIES.filter(c => c.kind === 'engine' && c.live).map(c => c.hub);
  const missing = hubs.filter(h => !fs.existsSync(path.join(ROOT, h)) || !html.includes(h));
  const ok = chk('index.html (country hub)', 'links to every live country hub, and each exists', missing.length === 0, missing);
  if (ok) console.log(`  PASS  index.html (country hub)  links ${hubs.join(', ')}`);
}

console.log(`\n${pagesOK}/${pages.length} place pages passed` + (failures ? `  —  >>> ${failures} FAILURES` : '  —  >>> ALL PASS'));
process.exit(failures ? 1 : 0);
