// W6 type & style captures. Serves the repo root (so beta/ and design/beta/style/directions/ fonts are both reachable),
// optionally appends a direction's CSS to cleo.css (same cascade position as a real edit), and shoots the W6 set:
// landing, a country hub, Tokyo in Gallery / Atlas / Guidebook / Insights, a place sheet, a Vietnamese place sheet
// (Ho Chi Minh City), at 390×844 and 1440×900, light + dark; plus a type specimen (12–16 px UI, display sizes,
// macrons, Vietnamese, CJK fallback).
//   NODE_PATH=$(npm root -g) node design/beta/style/tools/style-shots.js <outdir> [--css <file>] [--only a,b] [--no-dark]
// Every off-origin request is aborted (no CDN, no tiles): what renders is what the static files alone render.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..', '..', '..', '..');
const args = process.argv.slice(2), OUT = args[0];
const opt = k => { const i = args.indexOf(k); return i > 0 ? args[i + 1] : null; };
const EXTRA = opt('--css') ? fs.readFileSync(path.resolve(opt('--css')), 'utf8') : '';
const ONLY = opt('--only') ? opt('--only').split(',') : null;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json',
  '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json' };
const serve = () => new Promise(res => { const s = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  let body = fs.readFileSync(f); if (EXTRA && /\/beta\/assets\/cleo\.css$/.test(p)) body = Buffer.concat([body, Buffer.from('\n/* W6 direction override */\n' + EXTRA)]);
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); }).listen(0, () => res(s)); });
const SET = [
  ['landing', 'beta/index.html'],
  ['hub', 'beta/Japan/index.html'],
  ['gallery', 'beta/cities/tokyo.html#view=gallery'],
  ['atlas', 'beta/cities/tokyo.html#view=atlas'],
  ['guidebook', 'beta/cities/tokyo.html#view=guidebook'],
  ['insights', 'beta/cities/tokyo.html#view=insights'],
  ['sheet', 'beta/cities/tokyo.html#view=gallery&p=kanda-myojin'],
  ['sheet-vn', 'beta/Vietnam/ho-chi-minh-city.html#view=gallery&p=viet-nam-quoc-tu'],
];
const DARK = ['landing', 'gallery', 'sheet', 'insights'];
const VP = { m: { width: 390, height: 844 }, d: { width: 1440, height: 900 } };
const SPEC = (css) => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/beta/assets/tokens.css"><link rel="stylesheet" href="/beta/assets/cleo.css">
<style>body{background:var(--paper);color:var(--ink);margin:0;padding:24px 32px;font-family:var(--font-ui)} .d{font-family:var(--font-display);margin:.1em 0}
.row{display:grid;grid-template-columns:64px 1fr;gap:12px;align-items:baseline;border-top:1px solid var(--line);padding:6px 0} .k{font:12px/1.3 ui-monospace,monospace;color:var(--ink-3)}
.tn{font-variant-numeric:tabular-nums} ${css || ''}</style></head><body>
<div class="row"><span class="k">disp 64</span><p class="d" style="font-size:64px;line-height:1.04">Tokyo, after dark</p></div>
<div class="row"><span class="k">disp 38</span><p class="d" style="font-size:38px;line-height:1.08">Kanda Myōjin · Jōnan · Ōsaka</p></div>
<div class="row"><span class="k">disp 28</span><p class="d" style="font-size:28px;line-height:1.1">Việt Nam Quốc Tự · Bến Bình Đông · Cầu Nhị Thiên Đường</p></div>
<div class="row"><span class="k">disp 21</span><p class="d" style="font-size:21px">Chùa An Phú (Chùa Miểng Sành) — 浅草寺 Sensō-ji</p></div>
<div class="row"><span class="k">ui 16</span><p style="font-size:16px;margin:0">Recommended by Michelin and Daniel Food Diary · Open · Closed places stay, flagged.</p></div>
<div class="row"><span class="k">ui 14</span><p style="font-size:14px;margin:0">Bún chả Hương Liên · Phở Thìn Lò Đúc · Tây Bổ Đà Sơn · 東京都千代田区</p></div>
<div class="row"><span class="k">ui 13</span><p style="font-size:13px;margin:0">Must see · 3 sources · Last checked 2 Sep 2026 · Shinjuku-gyoen · Ryōgoku</p></div>
<div class="row"><span class="k">ui 12</span><p style="font-size:12px;margin:0">Il1|0Oo rn m · credits: CC BY-SA 4.0 · ūō āī · ư ơ đ ạ ả ấ ầ ẩ ẫ ậ</p></div>
<div class="row"><span class="k">nums</span><p style="font-size:15px;margin:0"><span>143 · 1,204 · 88 · 7</span> &nbsp;|&nbsp; <span class="tn">143 · 1,204 · 88 · 7 (tabular)</span></p></div>
<div class="row"><span class="k">weights</span><p style="font-size:15px;margin:0"><span style="font-weight:400">Regular 400</span> · <span style="font-weight:500">Medium 500</span> · <span style="font-weight:600">Semibold 600</span> · <span style="font-weight:700">Bold 700</span></p></div>
</body></html>`;
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = await serve(), base = 'http://127.0.0.1:' + srv.address().port + '/';
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const shot = async (name, url, vp, scheme) => {
    const ctx = await b.newContext({ viewport: VP[vp], deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: scheme });
    await ctx.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
    const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
    await pg.goto(base + url, { waitUntil: 'load' }); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(1300);
    const file = path.join(OUT, `${name}-${vp}${scheme === 'dark' ? '-dark' : ''}.jpg`);
    await pg.screenshot({ path: file, quality: 78 });
    const fams = await pg.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '') + ' ' + f.style)).catch(() => []);
    if (errs.length) console.log(name, vp, 'JS errors:', errs.slice(0, 2));
    await ctx.close(); return [...new Set(fams)];
  };
  const report = {};
  for (const [name, url] of SET) {
    if (ONLY && !ONLY.includes(name)) continue;
    for (const vp of ['m', 'd']) {
      report[`${name}-${vp}`] = await shot(name, url, vp, 'light');
      if (DARK.includes(name) && !args.includes('--no-dark')) await shot(name, url, vp, 'dark');
    }
  }
  // type specimen (DPR 1 and DPR 2)
  for (const dpr of [1, 2]) {
    const ctx = await b.newContext({ viewport: { width: 1100, height: 760 }, deviceScaleFactor: dpr });
    const pg = await ctx.newPage(); await pg.route('**/__spec', r => r.fulfill({ contentType: 'text/html; charset=utf-8', body: SPEC('') }));
    await pg.goto(base + '__spec'); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
    await pg.screenshot({ path: path.join(OUT, `specimen-dpr${dpr}.png`), fullPage: true });
    report['specimen-fonts'] = await pg.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.style + ' ' + f.unicodeRange.slice(0, 18)));
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'fonts-loaded.json'), JSON.stringify(report, null, 1));
  await b.close(); srv.close(); console.log('shots →', OUT);
})();
