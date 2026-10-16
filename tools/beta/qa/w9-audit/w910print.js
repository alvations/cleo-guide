'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process'); const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '../../../..'), BASE = 'https://cleo.local/', OUT = process.env.OUT || require('os').tmpdir();
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const PAGES = process.argv.slice(2).length ? process.argv.slice(2) : ['cities/tokyo.html', 'cleveland.html', 'Vietnam/ho-chi-minh-city.html', 'Singapore/chinatown.html', 'cities/brussels.html'];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
  for (const pg of PAGES) {
    const J = JSON.parse(fs.readFileSync(path.join(ROOT, 'beta/data/places', pg.replace(/^cities\//, '').replace(/\.html$/, '').replace(/\//g, '--').toLowerCase() + '.json')));
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' }); const off = [];
    await ctx.route('**/*', r => { const u = r.request().url();
      if (!u.startsWith(BASE)) { off.push(u); return r.abort('blockedbyclient'); }
      const p = path.join(ROOT, decodeURIComponent(new URL(u).pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' });
      return r.fulfill({ status: 200, contentType: T[path.extname(p)] || 'application/octet-stream', body: fs.readFileSync(p) }); });
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto(BASE + 'beta/' + pg + '#view=guidebook', { waitUntil: 'load' }); await page.waitForTimeout(2500);
    const cov = await page.evaluate(() => { const c = document.querySelector('.gcover'); const e = c && c.querySelector('.edition');
      return c ? { h1: c.querySelector('h1').textContent, nat: (c.querySelector('.native') || {}).textContent || null, ed: e && e.getAttribute('data-edition'), line: e && e.textContent, photo: !!c.querySelector('img'), since: !!document.querySelector('.gb-since'), sinceN: document.querySelectorAll('.gb-since li').length } : null; });
    await page.evaluate(() => { if (window.Cleo && Cleo.defer) Cleo.defer.all(); window.dispatchEvent(new Event('beforeprint')); }); await page.waitForTimeout(2500);
    await page.emulateMedia({ media: 'print' }); await page.waitForTimeout(500);
    // print-mode DOM checks
    const dom = await page.evaluate(() => {
      const host = document.querySelector('[data-cleo-book]') || document.body, W = document.documentElement.clientWidth;
      const vis = el => { const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && el.getClientRects().length; };
      let clipped = [], beyond = [];
      for (const el of host.querySelectorAll('*')) { if (!vis(el)) continue; const s = getComputedStyle(el), r = el.getBoundingClientRect();
        if (/hidden|clip/.test(s.overflowX + s.overflowY) && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) && el.textContent.trim() && !el.classList.contains('vh')) clipped.push(el.tagName + '.' + el.className + ' ' + el.scrollWidth + '>' + el.clientWidth + '|' + el.scrollHeight + '>' + el.clientHeight);
        if (r.width && r.right > W + 1 && el.textContent.trim()) beyond.push(el.tagName + '.' + el.className + ' ' + Math.round(r.right)); }
      const geImgs = [...document.querySelectorAll('li.ge img')].map(i => i.closest('li.ge').getAttribute('data-id'));
      const chImgs = [...document.querySelectorAll('.ch-photo img')].length;
      const cov = document.querySelector('.gcover'); const cs = cov && getComputedStyle(cov);
      return { clipped: clipped.slice(0, 5), nClipped: clipped.length, beyond: beyond.slice(0, 5), nBeyond: beyond.length, geImgs, chImgs, coverBreak: cs && cs.breakAfter, ges: document.querySelectorAll('li.ge').length,
        urls: [...document.querySelectorAll('.gb-appendix a[href^="http"]')].map(a => a.getAttribute('href')), method: [...document.querySelectorAll('.gb-appendix .method p')].map(p => p.textContent) };
    });
    const pdf = path.join(OUT, pg.replace(/\W+/g, '_') + '.pdf'); await page.pdf({ path: pdf, format: 'A4', printBackground: true });
    const pages = +/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [pdf]).toString())[1];
    const p1 = execFileSync('pdftotext', ['-f', '1', '-l', '1', '-layout', pdf, '-']).toString(), p2 = execFileSync('pdftotext', ['-f', '2', '-l', '2', pdf, '-']).toString();
    const all = execFileSync('pdftotext', [pdf, '-']).toString().replace(/\s+/g, '');
    const want = new Set(); for (const p of J.places) for (const s of p.s || []) if (/^https?:/.test(s[1] || '')) want.add(s[1]); for (const s of J.sourceIndex || []) for (const e of s.entries || []) if (/^https?:/.test(e.url || '')) want.add(e.url);
    const missDom = [...want].filter(u => !dom.urls.includes(u)), missPdf = [...want].filter(u => !all.includes(u.replace(/\s+/g, '')));
    const notesOk = (J.notes || []).every((n, i) => dom.method[i] === n.body);
    const st = J.stats, foodClosed = new Set(J.places.filter(p => p.kind !== 'sight' || p.closed).map(p => p.id));
    console.log(`== ${pg} (${J.country})`);
    console.log(`  cover: ${JSON.stringify(cov)}`);
    console.log(`  JSON: total ${st.total} closed ${st.closed} lastChecked ${st.lastChecked} newest change ${(J.changes || []).map(c => c.d).sort().pop()}`);
    console.log(`  print: ${pages} PDF pages; cover break-after=${dom.coverBreak}; page1 has cover ${p1.includes(J.name)} & no "Since" ${!/Since the last edition/.test(p1)}; page2 starts Since ${/^\s*Since the last edition/.test(p2)}; li.ge ${dom.ges}/${st.total}`);
    console.log(`  source URLs: ${want.size} in JSON; missing in print DOM ${missDom.length}; missing in PDF text ${missPdf.length} ${missPdf.slice(0, 3).join(' ')}; method notes verbatim ${notesOk} (${(J.notes || []).length})`);
    console.log(`  clipped (overflow hidden w/ overflow) ${dom.nClipped} ${JSON.stringify(dom.clipped)}; beyond page width ${dom.nBeyond} ${JSON.stringify(dom.beyond)}`);
    console.log(`  photos: entry imgs ${dom.geImgs.length} (on food/closed ${dom.geImgs.filter(i => foodClosed.has(i)).length}); chapter photos ${dom.chImgs}; cover photo ${cov && cov.photo}; off-origin ${off.length}; errors ${errs.length}`);
    await ctx.close();
  }
  await b.close();
})();
