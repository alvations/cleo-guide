#!/usr/bin/env node
/**
 * QA guard (orchestrator 2026-10-17, after bbaf111a8): every view state a reader can reach renders STYLED components.
 * bbaf111a8 trimmed "never-used" CSS with a cold sweep that never opened a day plan, so Your day rendered unstyled and
 * npm test stayed green (the parity shots never opened #day=). A static "the class is still named in the CSS" test does
 * not catch that (the class survives in other selectors), so this drives each state in real Chromium and checks:
 *   (1) the state renders (≥ min new visible elements carrying a class);
 *   (2) every such element is matched by at least one author rule whose selector names one of the element's own classes
 *       (a rule like `.lens p` matching a `p.caveat` does not count: that is the "unstyled component" case);
 *   (3) key computed styles are not browser defaults (the stop number is a filled badge, the day summary is not inline,
 *       a saved heart is filled).
 * States (Tokyo; phone 390 and desktop 1440): Your day (the door / rail tile), For you (picker, then a pick), Near me
 * (mocked geolocation), a #p= place sheet, the sheet's share image, Show all (after a lens), a saved place (heart), and the
 * trip page with 2+ saved places.
 * Playwright-optional: without Playwright this prints SKIP and exits 0 (npm test runs it where Chromium exists).
 * Usage: node tools/beta/qa/test-reachable-styles.js [--only day,foryou,near,sheet,share,showall,saved,trip] [--vps phone,desktop]
 */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { try { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); } catch (e2) {} }
if (!chromium) { console.log('>>> SKIP — Playwright not available (reachable-state styles need a real browser)'); process.exit(0); }
const ROOT = path.resolve(__dirname, '..', '..', '..');
const argv = process.argv.slice(2), opt = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const ONLY = opt('--only') ? opt('--only').split(',') : null, want = k => !ONLY || ONLY.includes(k);
const VPS = (opt('--vps') || 'phone,desktop').split(',');
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png' };
const VP = { phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, desktop: { viewport: { width: 1440, height: 900 } } };
// Classes with no own visual rule BY DESIGN (each had none before the R8 #6 cut either, bbaf111a8^). Keep it short, give a reason.
const HOOK_ONLY = new Set([
  'ms-chk',    // phone Atlas count line: an inline "checked <date>" run that inherits the line's type
  'ms-a',      // the area name inside a card's eyebrow: its only rule is a display toggle in phone Atlas map mode
  'in-a',      // the same area name in the Gallery eyebrow: only hidden in context (the area heading already names it)
  'ms-near',   // Near me's section wrapper: display:contents in map mode; its cards carry the styling
  // no own rule on the pre-cut tree either (42bf98635); styled through their container or a rule that does not name them
  'closeby', 'sh-body', 'long',   // place sheet: the nearby block's wrapper, the body wrapper, the long-name flag
  'tp-root', 'tp-from',           // trip.html: the page root and the "from your saved places" section wrappers
  'pg',                           // Gallery pager buttons: 44 × 44 pills from the .g-pager rules (measured), none names .pg
]);
// Open register rows: reported as KNOWN (not a failure) until fixed, so npm test stays a usable gate. Remove an entry
// when its row is verified; a KNOWN class that is styled again prints a notice to do so.
const KNOWN = { 'pl-why': 'QA-85 (bbaf111a8 cut the For you "why" chip rule; 69128c498 did not restore it)' };
let pass = 0, fail = 0; const seenKnown = new Set();
const check = (name, ok, info) => { ok ? pass++ : fail++; console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${info === undefined ? '' : ' = ' + JSON.stringify(info)}`); };

const srv = http.createServer((q, r) => { let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) {}
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
let O, B;

// in-page: start recording added nodes
const ARM = () => { window.__added = new Set(); new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) { window.__added.add(n); n.querySelectorAll('*').forEach(x => window.__added.add(x)); } })))
  .observe(document, { childList: true, subtree: true }); };   // document: an init script runs before <html> exists
// in-page: classify the added, visible, classed elements (inside `scope` if given)
const AUDIT = ([scope, hook]) => {
  const rules = []; const walk = list => { for (const r of list) { if (r.selectorText) { for (const s of r.selectorText.split(/,(?![^(]*\))/)) { const t = s.trim(); try { document.querySelector(t); rules.push({ s: t, cls: (t.match(/\.(-?[A-Za-z_][\w-]*)/g) || []).map(x => x.slice(1)) }); } catch (e) {} } }
    else if (r.cssRules) { const c = r.conditionText || (r.media && r.media.mediaText); if (r.constructor.name === 'CSSMediaRule' && !matchMedia(c).matches) continue; if (r.constructor.name === 'CSSSupportsRule' && !CSS.supports(c)) continue; walk(r.cssRules); } } };
  for (const s of document.styleSheets) { try { walk(s.cssRules); } catch (e) {} }
  const H = new Set(hook), root = scope ? document.querySelector(scope) : null;
  const els = [...window.__added].filter(e => e.isConnected && e.getAttribute('class') && e.getAttribute('class').trim() && e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden' && (!root || root.contains(e)) && !e.closest('svg'));
  const un = [];
  for (const e of els) { const C = e.getAttribute('class').trim().split(/\s+/); if (C.every(c => H.has(c))) continue;
    if (!rules.some(r => r.cls.some(c => C.includes(c)) && (() => { try { return e.matches(r.s); } catch (x) { return false; } })())) un.push(e.tagName.toLowerCase() + '.' + C.join('.')); }
  const by = {}; un.forEach(k => { by[k] = (by[k] || 0) + 1; });
  return { n: els.length, unstyled: by };
};

async function open(rel, vp, { geo, init } = {}) {
  const ctx = await B.newContext({ ...VP[vp], reducedMotion: 'reduce', ...(geo ? { geolocation: geo, permissions: ['geolocation'] } : {}) });
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(String(e)));
  if (init) await page.addInitScript(init);
  await page.route('**/*', r => { const u = r.request().url(); if (u.startsWith(O)) return r.continue(); return r.request().resourceType() === 'image' ? r.fulfill({ status: 200, contentType: 'image/png', body: PNG }) : r.abort(); });
  await page.goto(O + '/beta/' + rel); await page.waitForTimeout(1500);
  return { ctx, page, errors };
}
const vis = async (page, sel) => { const l = page.locator(sel); const n = await l.count(); for (let i = 0; i < n; i++) if (await l.nth(i).isVisible().catch(() => false)) return l.nth(i); return null; };
// a door / rail tile: phone Atlas keeps its doors in list mode
async function door(page, sel) { let d = await vis(page, sel); if (!d) { const t = await vis(page, '.ms-toggle'); if (t) { await t.click(); await page.waitForTimeout(600); } d = await vis(page, sel); } return d; }
async function audit(page, tag, { scope = null, min = 3, errors, extra } = {}) {
  await page.waitForTimeout(900);
  const r = await page.evaluate(AUDIT, [scope, [...HOOK_ONLY]]);
  check(`${tag}: renders (${r.n} new classed elements ≥ ${min})`, r.n >= min, r.n);
  const known = {}, un = {}; for (const [k, n] of Object.entries(r.unstyled)) { const c = k.split('.').slice(1).find(x => KNOWN[x]); (c ? known : un)[k] = n; if (c) seenKnown.add(c); }
  check(`${tag}: every rendered component has its own CSS rule`, !Object.keys(un).length, un);
  for (const k of Object.keys(known)) console.log(`  KNOWN ${tag}: ${k} unstyled — ${KNOWN[k.split('.').slice(1).find(x => KNOWN[x])]}`);
  if (extra) { const x = await page.evaluate(extra.fn); check(`${tag}: ${extra.name}`, extra.ok(x), x); }
  if (errors) check(`${tag}: 0 JS errors`, !errors.length, errors.slice(0, 2));
}
const TRANSPARENT = c => !c || c === 'transparent' || /rgba\(\d+, \d+, \d+, 0\)/.test(c);

async function run(vp) {
  const T = `cities/tokyo.html ${vp}`;
  if (want('day')) { const { ctx, page, errors } = await open('cities/tokyo.html', vp); await page.evaluate(ARM);
    const d = await door(page, '[data-cleo-day]'); if (!d) check(`${T} Your day: a door or tile to open it`, false); else { await d.click(); await page.waitForTimeout(1500);
      await audit(page, `${T} Your day`, { min: 8, errors, extra: { name: 'the stop number is a filled badge and the day summary is not inline (not browser defaults)',
        fn: () => { const n = document.querySelector('.stop .n'), s = document.querySelector('.daysum'), st = document.querySelector('.stop');
          return { stops: document.querySelectorAll('.stop').length, nBg: n && getComputedStyle(n).backgroundColor, sumDisp: s && getComputedStyle(s).display, stopDisp: st && getComputedStyle(st).display }; },
        ok: x => x.stops >= 4 && !TRANSPARENT(x.nBg) && x.sumDisp && x.sumDisp !== 'inline' && x.stopDisp && x.stopDisp !== 'inline' && x.stopDisp !== 'list-item' } }); }
    await ctx.close(); }
  if (want('foryou')) { const { ctx, page, errors } = await open('cities/tokyo.html', vp); await page.evaluate(ARM);
    const d = await door(page, '[data-cleo-foryou]'); if (!d) check(`${T} For you: a door or tile to open it`, false); else { await d.click(); await page.waitForTimeout(800);
      await audit(page, `${T} For you picker`, { min: 4 });
      const o = await vis(page, '#cleo-fy [data-i]'); if (o) { await page.evaluate(ARM); await o.click(); await page.waitForTimeout(300); const go = await vis(page, '#cleo-fy [data-a="go"], #cleo-fy .btn-primary'); if (go) await go.click(); await page.waitForTimeout(1200);
        await audit(page, `${T} For you picked`, { min: 1, errors }); } }
    await ctx.close(); }
  if (want('near')) { const { ctx, page, errors } = await open('cities/tokyo.html', vp, { geo: { latitude: 35.6812, longitude: 139.7671 } }); await page.evaluate(ARM);
    const d = await door(page, '[data-cleo-near]'); if (!d) check(`${T} Near me: a door or tile to open it`, false); else { await d.click(); await page.waitForTimeout(2000); await audit(page, `${T} Near me`, { min: 2, errors }); }
    await ctx.close(); }
  if (want('sheet') || want('share')) { const { ctx, page, errors } = await open('cities/tokyo.html', vp); await page.evaluate(ARM);
    await page.evaluate(() => { const c = document.querySelector('li.pl[id^="p-"]'); location.hash = '#p=' + c.id.slice(2); }); await page.waitForTimeout(1800);
    if (want('sheet')) await audit(page, `${T} place sheet (#p=)`, { scope: '#cleo-sheet', min: 8, errors });
    if (want('share')) { const b = await vis(page, '#cleo-sheet [data-cleo-card]'); if (!b) check(`${T} share image: a share button in the sheet`, false); else { await page.evaluate(ARM); await b.click(); await page.waitForTimeout(2000);
      await audit(page, `${T} share image dialog`, { scope: '#cleo-card-dlg', min: 2, errors }); } }
    await ctx.close(); }
  if (want('showall')) { const { ctx, page, errors } = await open('cities/tokyo.html#view=gallery&t=1', vp); await page.evaluate(ARM);
    const a = await vis(page, '[data-cleo-all]'); if (!a) check(`${T} Show all: the button under a lens`, false); else { await a.click(); await page.waitForTimeout(1500); await audit(page, `${T} Show all`, { min: 1, errors }); }
    await ctx.close(); }
  if (want('saved') || want('trip')) { const { ctx, page, errors } = await open('cities/tokyo.html#view=gallery', vp);
    // a reader hovers a card to reach its heart (desktop shows it on hover/focus): press the first three through the DOM
    const saved = await page.evaluate(async () => { const seen = new Set(), H = [...document.querySelectorAll('li.pl .pl-save.heart[aria-pressed="false"], li.gc .gc-save.heart[aria-pressed="false"]')].filter(h => { const k = h.closest('li').id; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 3); for (const h of H) { h.click(); await new Promise(r => setTimeout(r, 250)); } return H.length; });
    if (want('saved')) { const x = await page.evaluate(() => { const h = document.querySelector('.heart[aria-pressed="true"]'), p = h && h.querySelector('svg path, svg use, svg'), cs = p && getComputedStyle(p);
        return { saved: document.querySelectorAll('.heart[aria-pressed="true"]').length, fill: cs && cs.fill, color: h && getComputedStyle(h).color }; });
      check(`${T} saved heart is filled (aria-pressed=true, fill not none)`, x.saved >= 1 && x.fill && x.fill !== 'none' && !TRANSPARENT(x.fill), x);
      check(`${T} saved: 0 JS errors`, !errors.length, errors.slice(0, 2)); }
    if (want('trip')) { await page.addInitScript(ARM); await page.goto(O + '/beta/trip.html'); await page.waitForTimeout(1500);   // ARM from the first byte: the trip page renders on load
      // make a trip from the saved places when the page offers it; otherwise audit what it rendered
      const mk = await vis(page, '[data-tp-new], [data-tp-make], #tp-form button, .tp-pick button, button.btn-primary'); if (mk) { await mk.click().catch(() => {}); await page.waitForTimeout(1500); }
      const r = await page.evaluate(() => ({ n: Object.keys(JSON.parse(localStorage.getItem('cleo:v1:saved') || '{}')).length }));
      check(`trip.html ${vp}: 2+ saved places seeded`, r.n >= 2, r.n);
      await audit(page, `trip.html ${vp} (2+ saved places)`, { min: 4, errors }); }
    await ctx.close(); }
}

srv.listen(0, async () => {
  O = 'http://127.0.0.1:' + srv.address().port; B = await chromium.launch();
  try { for (const vp of VPS) { console.log(`\n# ${vp}`); await run(vp); } } catch (e) { fail++; console.log('  FAIL  probe error: ' + (e && e.stack || e)); }
  await B.close(); srv.close();
  if (!ONLY) for (const c of Object.keys(KNOWN)) if (!seenKnown.has(c)) console.log(`  NOTE  KNOWN .${c} is styled now — verify ${KNOWN[c].split(' ')[0]} and remove it from KNOWN`);
  console.log(`\n>>> ${fail ? 'FAIL' : 'PASS'} — reachable states styled: ${pass}/${pass + fail}`); process.exit(fail || !pass ? 1 : 0);
});
