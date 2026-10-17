// Atlas FE-2 (OV-03 / §2.0.4, orchestrator 12:18Z): no map label sits under the peek or carousel, the chip row, the credit,
// a header bar or any map / fixed control — at load and with a selection open (the carousel grows; landscape docks it on the
// right) — 4 pages × the 6 OV-00 viewports. Painted pills (the tap area is B-07's).
//   NODE_PATH=$(npm root -g) node tools/beta/fe2/label-clear.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..'), BASE = 'https://cleo.local/', PNG = fs.readFileSync(path.join(ROOT, 'tools/node_modules/leaflet/dist/images/layers.png'));
const PAGES = ['cities/newyork.html', 'cities/tokyo.html', 'Singapore/punggol.html', 'cleveland.html'], VPS = ['390x844', '390x664', '844x390', '768x1024', '1024x768', '1440x900'];
const MEASURE = () => { const mc = document.querySelector('#cleo-map'), mr = mc.getBoundingClientRect(), cs = getComputedStyle;
  const shown = e => { const r = e.getBoundingClientRect(), s = cs(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
  const hit = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
  const labs = [...document.querySelectorAll('.leaflet-marker-pane .pp > span')].filter(shown).map(s => ({ n: s.textContent.trim().slice(0, 24), r: s.getBoundingClientRect() })).filter(l => hit(l.r, mr));
  const fixedAnc = e => { for (let a = e; a && a !== document.body; a = a.parentElement) { const p = cs(a).position; if (p === 'fixed' || p === 'sticky') return a; } return null; };
  const ctl = [...document.querySelectorAll('button, a[href], input, select, [role=button], summary')].filter(e => shown(e) && !e.closest('.leaflet-marker-pane') && !e.closest('li.pl') && (mc.contains(e) || fixedAnc(e)));
  const blocks = [['peek/carousel', '.listpane'], ['toggle', '.ms-toggle'], ['chips', '.ms-bar'], ['credit', '.leaflet-control-attribution'], ['here', '.ms-here'], ['header', 'header, .cbar, [data-cleo-views]']]
    .flatMap(([k, s]) => [...document.querySelectorAll(s)].filter(e => shown(e) && (fixedAnc(e) || mc.contains(e)) && !e.contains(mc)).map(e => ({ k, r: e.getBoundingClientRect() })));
  const out = [];
  labs.forEach(l => { ctl.forEach(c => { const q = c.getBoundingClientRect(); const t = document.elementFromPoint(Math.max(q.left, l.r.left) + 1, Math.max(q.top, l.r.top) + 1); if (hit(l.r, q)) out.push('ctl:' + l.n + ' × ' + ((c.getAttribute('aria-label') || c.textContent || c.className || '').trim().slice(0, 24))); });
    blocks.forEach(bk => { if (hit(l.r, bk.r)) out.push(bk.k + ':' + l.n); }); });
  return { labels: labs.length, hits: [...new Set(out)] }; };
(async () => { const b = await chromium.launch(); let bad = 0;
  for (const pg of PAGES) for (const v of VPS) { const [w, h] = v.split('x').map(Number);
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 1024, hasTouch: w < 1024, reducedMotion: 'reduce' });
    await ctx.route('**/*', r => { const u = new URL(r.request().url()); if (/arcgis|openstreetmap/.test(u.host)) return r.fulfill({ body: PNG }); if (u.origin + '/' !== BASE) return r.abort(); const p = path.join(ROOT, decodeURIComponent(u.pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' }); return r.fulfill({ body: fs.readFileSync(p) }); });
    const page = await ctx.newPage(); await page.goto(BASE + 'beta/' + pg + '#view=atlas'); await page.waitForTimeout(3000);
    const a = await page.evaluate(MEASURE);
    await page.evaluate(() => { const e = document.querySelector('.leaflet-marker-icon.pp'); if (e) e.click(); }); await page.waitForTimeout(1500);   // a selection: the carousel (or side card) opens
    const c = await page.evaluate(MEASURE);
    const n = a.hits.length + c.hits.length; if (n) bad++;
    console.log((n ? 'FAIL' : 'PASS') + '  labels clear ' + pg + ' ' + v + ': no label under a control, the peek / carousel, chips, credit or header (load, selection)  load ' + a.labels + ' labels ' + JSON.stringify(a.hits) + ' | car '+await page.evaluate(()=>document.documentElement.classList.contains('ms-car'))+' ' + c.labels + ' ' + JSON.stringify(c.hits));
    await ctx.close(); }
  await b.close(); console.log(bad ? `>>> FAIL — ${bad} case(s) with a label under chrome` : '>>> PASS — labels clear of chrome'); process.exit(bad ? 1 : 0); })();
