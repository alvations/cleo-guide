'use strict';
const fs = require('fs'), path = require('path'); const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '../../../..'), BASE = 'https://cleo.local/', D = ROOT + '/beta/data/';
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const H = JSON.parse(fs.readFileSync(D + 'source-hosts.json')).hosts;
// independent expectation from page JSON
const pages = {}; for (const f of fs.readdirSync(D + 'places')) { const p = JSON.parse(fs.readFileSync(D + 'places/' + f)); pages[p.beta] = p; }
const hostOf = u => { try { return new URL(u).hostname.toLowerCase().replace(/^www\./, ''); } catch (e) { return null; } };
const byHost = {}; const urls = [];
for (const [pg, p] of Object.entries(pages)) for (const pl of p.places) for (const s of (pl.s || [])) { const u = s[1]; const h = u && hostOf(u); if (!h) continue;
  (byHost[h] = byHost[h] || {}); (byHost[h][pg] = byHost[h][pg] || new Set()).add(pl.id); urls.push([u, h, pg, pl.id, s[0]]); }
// seeded sample of 20 URLs with distinct hosts
let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const sample = [], seen = new Set(); while (sample.length < 20) { const x = urls[Math.floor(rnd() * urls.length)]; if (seen.has(x[1])) continue; seen.add(x[1]); sample.push(x); }
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const off = [], req = [];
  await ctx.route('**/*', r => { const u = r.request().url(); req.push(u);
    if (!u.startsWith(BASE)) { off.push(u); return r.abort('blockedbyclient'); }
    const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
    return r.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) }); });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(BASE + 'beta/index.html', { waitUntil: 'load' }); await page.waitForTimeout(500);
  let pass = 0, srcPass = 0, exactLift = 0;
  for (const [u, h, pg, id, sk] of sample) {
    await page.fill('#cleo-q', u); await page.waitForTimeout(450);
    const r = await page.evaluate(() => { const hd = document.querySelector('#results [data-cleo-source]'); return { head: hd ? hd.textContent.replace(/\s+/g, ' ').trim() : null, state: (document.querySelector('#results [data-cleo-state]') || {}).textContent || null,
      rows: [...document.querySelectorAll('#results a[href*="#src="]')].map(a => [a.getAttribute('href'), a.textContent]), html: document.getElementById('results').innerHTML }; });
    const idxRows = H[h] || [], idxN = idxRows.reduce((t, x) => t + x[4], 0);
    const exp = byHost[h] || {}, expN = Object.values(exp).reduce((t, s) => t + s.size, 0), expG = Object.keys(exp).length;
    const m = r.head && /^(\d+) places? recommended by (\S+) in (\d+) guides?/.exec(r.head);
    const ok = m && +m[1] === idxN && +m[3] === idxRows.length;
    const okInd = m && +m[1] === expN && +m[3] === expG;
    if (ok) pass++;
    const lifted = r.html.includes(id) ? 1 : 0; exactLift += lifted;
    // follow the row for the sampled page, check the guide's source view count
    const row = idxRows.find(x => x[0] === pg); let sv = null;
    if (row) { const p2 = await ctx.newPage(); await p2.goto(BASE + 'beta/' + row[0] + '#src=' + encodeURIComponent(row[2]), { waitUntil: 'load' }); await p2.waitForTimeout(900);
      sv = await p2.evaluate(() => { const l = document.querySelector('[data-cleo-lens], .lens'); const h2 = l && l.querySelector('h2'); return { h: h2 ? h2.textContent : null, vis: [...document.querySelectorAll('li.pl')].filter(c => !c.hidden).length }; });
      const si = (pages[pg].sourceIndex || []).find(s => s.id === row[2]); sv.siN = si ? si.ids.length : null;
      const mm = sv.h && /\((\d+)\)\s*$/.exec(sv.h); sv.ok = !!mm && +mm[1] === row[4] && sv.siN === row[4]; if (sv.ok) srcPass++; await p2.close(); }
    console.log(`${ok ? 'PASS' : 'FAIL'} ${h} | ui "${r.head || r.state}" | index ${idxN}/${idxRows.length}g | from page JSON by host ${expN}/${expG}g ${okInd ? '=' : '!='} | exactURL place lifted ${!!lifted} | guide view ${sv ? JSON.stringify(sv) : 'n/a'}`);
  }
  // unknown URL
  const before = req.length; await page.fill('#cleo-q', 'https://zzqxv-unknown.example/some/path?utm=1'); await page.waitForTimeout(600);
  const unk = await page.evaluate(() => document.getElementById('results').innerText);
  const after = req.slice(before);
  console.log(`\nSUMMARY: header count = index ${pass}/20; guide source view count ok ${srcPass}/20; exact-URL place lifted ${exactLift}/20`);
  console.log('UNKNOWN text:', JSON.stringify(unk), '\n requests during unknown paste:', after.length, after);
  console.log('off-origin requests total:', off.length, off.slice(0, 5), 'errors', errs.length);
  console.log('any request to a sampled host:', req.filter(u => sample.some(s => u.includes(s[1]))).length);
  await b.close();
})();
