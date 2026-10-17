#!/usr/bin/env node
/* css-cascade.js — which declarations MATCH but never WIN (R8 gap #6, the CSS diet).
 *
 * css-dead finds rules that match nothing (≈ 0.1 KB). The weight is elsewhere: declarations that do match but are always
 * overridden by a later or more specific one (superseded R6/R7 layers). This walks real pages × viewports × themes × views
 * × states, asks Chromium (CDP CSS.getMatchedStylesForNode) for every element's matched rules in cascade order, replays
 * the cascade per longhand, and counts for each declaration how often it matched and how often it won.
 *
 * cleo.css is served as its source pieces (build-css.py --parts), so every range maps to a line in a source file.
 *   node design/beta/tools/css-cascade.js [--quick] [--out design/beta/eval/css-cascade.json]
 * Output: { decl: { "<sheet>|<line>:<col>": { m, w, t } } } — m = matched, w = won, t = the declaration text.
 * A declaration with m > 0 and w = 0 is a removal candidate; css-trim.py applies the protections and edits the sources. */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../../..'), BETA = path.join(ROOT, 'beta'), ASSETS = path.join(BETA, 'assets');
const SCRATCH = fs.mkdtempSync(path.join(require('os').tmpdir(), 'cleo-cc-'));   // the cc-NN pieces live here, never in beta/assets
const CC = b => /^cc-\d\d-/.test(b);
const at = p => path.join(CC(p) ? SCRATCH : ASSETS, p);
process.on('exit', () => fs.rmSync(SCRATCH, { recursive: true, force: true }));
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => process.exit(130));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const QUICK = process.argv.includes('--quick');
const OUT = path.resolve(ROOT, arg('--out', 'design/beta/eval/css-cascade.json'));
function loadPlaywright() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { return require(t); } catch (e) { /* next */ } }
  throw new Error('playwright not found');
}
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.webmanifest': 'application/manifest+json' };
const serve = () => new Promise(res => { const s = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0].split('#')[0]));
  if (CC(path.basename(f))) f = path.join(SCRATCH, path.basename(f));
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { /* 404 */ }
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
}); s.listen(0, '127.0.0.1', () => res(s)); });

// the pieces of cleo.css, in cascade order, written next to it (relative url()s resolve the same)
const parts = execFileSync('python3', [path.join(ROOT, 'design/beta/tools/build-css.py'), '--parts', SCRATCH]).toString().trim().split(/\s+/);
const IDS = [...new Set([...fs.readdirSync(ASSETS).filter(f => f.endsWith('.css'))].map(f => fs.readFileSync(path.join(ASSETS, f), 'utf8')).join('').match(/#[A-Za-z][\w-]*/g) || [])].map(x => x.slice(1));
const BYTEXT = new Map(parts.concat(['fe-a.css', 'fe-b.css']).map(p => [fs.readFileSync(at(p), 'utf8'), p]));   // cached @import sheets come back under new ids with no event: resolve by text
const IMPORT = parts.map(p => `@import url("${p}");`).join('\n');

const VIEWPORTS = QUICK ? [[390, 844], [1440, 900]] : [[195, 422], [360, 740], [390, 844], [390, 664], [420, 860], [560, 900], [620, 900], [700, 1000], [768, 1024], [844, 390], [960, 800], [1024, 768], [1060, 800], [1150, 850], [1240, 860], [1366, 860], [1440, 900]];
const DARK_AT = new Set(['390x844', '1440x900', '768x1024']);
const CITY = QUICK ? ['cities/tokyo.html'] : ['cities/tokyo.html', 'cleveland.html', 'Singapore/chinatown.html', 'Singapore/punggol.html', 'Vietnam/hanoi.html', 'cities/newyork.html'];
const OTHER = QUICK ? ['index.html'] : ['index.html', 'Japan/index.html', 'Singapore/index.html', 'trip.html', 'saved.html', 'how-we-choose.html', 'accessibility.html', 'changes/tokyo.html', '404.html'];
const VIEWS = ['atlas', 'gallery', 'guidebook', 'insights'];

const decl = {};   // key -> {m, w, t}
let sheets = {};   // styleSheetId -> basename
const keyOf = (sid, r) => `${sheets[sid]}|${r.startLine}:${r.startColumn}`;

async function snapshot(page, cdp) {
  // one representative element per (ancestor chain, classes, attributes, position) signature: cards repeat hundreds of times
  const n = await page.evaluate(IDL => { const IDS = new Set(IDL);
    const VAL = /^(aria-(checked|current|disabled|pressed|selected|expanded|hidden)|data-(cleo-page|cleo-shell|comp|detent|dy|k|only|overlay-on|rail|sh|t|theme|view|views-on)|type|role)$/;
    const sig = el => { let s = el.tagName + (el.id && IDS.has(el.id) ? '#' + el.id : '') + '.' + [...el.classList].sort().join('.');
      for (const a of el.attributes) if (/^(data-|aria-|role$|type$|hidden$|open$|disabled$|lang$|dir$|href$|style$)/.test(a.name)) s += `[${a.name}${VAL.test(a.name) ? '=' + a.value : a.name === 'href' && a.value[0] === '#' ? '#' : ''}]`;
      const p = el.parentElement; if (p) { const k = [...p.children]; const i = k.indexOf(el); s += `@${i === 0 ? 'f' : ''}${i === k.length - 1 ? 'l' : ''}${i % 2}`; } return s; };
    const memo = new Map(), seen = new Set(); let c = 0;
    const chain = el => { if (!el) return ''; if (memo.has(el)) return memo.get(el); const v = chain(el.parentElement) + '>' + sig(el); memo.set(el, v); return v; };
    document.querySelectorAll('[data-ccx]').forEach(e => e.removeAttribute('data-ccx'));
    for (const el of document.querySelectorAll('*')) { const k = chain(el); if (seen.has(k)) continue; seen.add(k); el.setAttribute('data-ccx', ''); c++; }
    return c;
  }, IDS);
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '[data-ccx]' });
  const results = [];
  for (let i = 0; i < nodeIds.length; i += 64) results.push(...await Promise.all(nodeIds.slice(i, i + 64).map(nodeId => cdp.send('CSS.getMatchedStylesForNode', { nodeId }).catch(() => null))));
  const unk = new Set();
  for (const r of results) if (r) for (const m of (r.matchedCSSRules || []).concat(...(r.pseudoElements || []).map(p => p.matches || []))) if (m.rule.styleSheetId && !(m.rule.styleSheetId in sheets)) unk.add(m.rule.styleSheetId);
  for (const sid of unk) { let t = ''; try { t = (await cdp.send('CSS.getStyleSheetText', { styleSheetId: sid })).text; } catch (e) { /* gone */ } sheets[sid] = BYTEXT.get(t) || null; }
  for (const r of results) { if (!r) continue;
    const tally = (matches, inline) => {
      const win = {};   // longhand -> {key, imp}
      for (const m of matches || []) {
        const rule = m.rule; if (rule.origin !== 'regular') continue;   // the UA sheet never beats an author declaration
        const ours = !!sheets[rule.styleSheetId];
        for (const p of rule.style.cssProperties) {
          if (!p.range || p.disabled || p.parsedOk === false) continue;
          let k = null;
          if (ours) { k = keyOf(rule.styleSheetId, p.range); const d = decl[k] || (decl[k] = { m: 0, w: 0, t: `${p.name}: ${p.value}`, s: rule.selectorList.text.slice(0, 160) }); d.m++; }
          const names = p.longhandProperties && p.longhandProperties.length ? p.longhandProperties.map(l => l.name) : [p.name];
          for (const nm of names) { if (!p.important && win[nm] && win[nm].imp) continue; win[nm] = { key: k, imp: !!p.important }; }
        }
      }
      if (inline) for (const p of inline.cssProperties || []) { if (!p.range) continue; const names = p.longhandProperties && p.longhandProperties.length ? p.longhandProperties.map(l => l.name) : [p.name]; for (const nm of names) if (!(win[nm] && win[nm].imp)) win[nm] = { key: null, imp: !!p.important }; }
      const won = new Set(Object.values(win).map(v => v.key).filter(Boolean)); won.forEach(k => decl[k].w++);
    };
    tally(r.matchedCSSRules, r.inlineStyle);
    for (const pe of r.pseudoElements || []) tally(pe.matches);
  }
  return n;
}

(async () => {
  const srv = await serve(), base = `http://127.0.0.1:${srv.address().port}/beta/`;
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });
  let snaps = 0;
  for (const [w, h] of VIEWPORTS) for (const theme of DARK_AT.has(`${w}x${h}`) ? ['light', 'dark'] : ['light']) {
    const ctx = await browser.newContext({ serviceWorkers: 'block', viewport: { width: w, height: h }, colorScheme: theme, hasTouch: w < 900, isMobile: w < 900 });
    // each piece as its own top-level <link> in place of cleo.css: @import children come back after a navigation under the
    // parent's id (ambiguous offsets), top-level sheets don't
    await ctx.route(r => /\.html$|\/$/.test(new URL(r).pathname), async (route, req) => {
      if (req.resourceType() !== 'document') return route.continue();
      let f = path.join(ROOT, decodeURIComponent(new URL(req.url()).pathname)); try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch (e) { return route.continue(); }
      const html = fs.readFileSync(f, 'utf8').replace(/<link rel="stylesheet" href="([^"]*?)cleo\.css[^"]*">/, (m, pre) => parts.map(p => `<link rel="stylesheet" href="${pre}${p}">`).join(''));
      route.fulfill({ status: 200, contentType: 'text/html', body: html }); });
    await ctx.route(/tile\.openstreetmap|arcgisonline/, r => r.abort());
    const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page);
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    cdp.on('CSS.styleSheetAdded', e => { const u = e.header.sourceURL || ''; const b = path.basename(u.split('?')[0]); sheets[e.header.styleSheetId] = (/^cc-\d\d-/.test(b) || b === 'fe-a.css' || b === 'fe-b.css') ? b : null; });
    const shot = async (url, act) => {
      await page.goto(base + url, { waitUntil: 'load' }).catch(() => {}); await page.waitForTimeout(700);
      if (act) { await act().catch(() => {}); await page.waitForTimeout(450); }
      const n = await snapshot(page, cdp); snaps++; process.stdout.write(`${w}x${h} ${theme} ${url}${act ? ' +' + act.name : ''}: ${n}\n`);
    };
    for (const u of CITY) {
      for (const v of VIEWS) await shot(`${u}#view=${v}`);
      const detail = async function detail() { const id = await page.evaluate(() => { const a = document.querySelector('a[href^="#p-"]'); return a && a.getAttribute('href').slice(3); }); if (id) { await page.evaluate(i => { location.hash = 'view=gallery&p=' + i; }, id); } };
      await shot(`${u}#view=gallery`, detail);
      const filters = async function filters() { const b = page.locator('button:has-text("Filters")').first(); await b.click({ timeout: 1500 }); };
      await shot(`${u}#view=atlas`, filters);
      const search = async function search() { const b = page.locator('[aria-label^="Search"], input[type=search]').first(); await b.click({ timeout: 1500 }); await page.keyboard.type('ra'); };
      await shot(`${u}#view=atlas`, search);
    }
    for (const u of OTHER) await shot(u);
    await ctx.close();
  }
  await browser.close(); srv.close();
  fs.rmSync(SCRATCH, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ when: new Date().toISOString(), snaps, viewports: VIEWPORTS, pages: CITY.concat(OTHER), decl }, null, 0));
  const lose = Object.values(decl).filter(d => d.m && !d.w);
  console.log(`\ncss-cascade: ${snaps} snapshots, ${Object.keys(decl).length} matched declarations, ${lose.length} never win → ${path.relative(ROOT, OUT)}`);
})();
