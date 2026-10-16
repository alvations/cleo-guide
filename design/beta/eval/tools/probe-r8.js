// R8 evaluator: residual probe for the R7 gaps (polish, Atlas, locale). Measures only; edits nothing.
// Tiles are answered with a flat stub tile, every other off-origin request is aborted.
// Usage: node probe-r8.js <port> <out.json>     (run alone, never alongside npm test or a timing probe)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const [port, out] = process.argv.slice(2);
const B = `http://127.0.0.1:${port}/beta/`;
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48+cPAAXxAvkqF6tIAAAAAElFTkSuQmCC', 'base64');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const route = ctx => ctx.route('**/*', r => { const u = r.request().url(); if (u.startsWith('http://127.0.0.1')) return r.continue(); if (/tile\.openstreetmap|arcgisonline/.test(u)) return r.fulfill({ body: TILE, contentType: 'image/png' }); return r.abort(); });
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const DESK = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };

// polish checks on one loaded page
const polish = () => {
  const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const alpha = e => { if (!e) return null; const c = getComputedStyle(e).backgroundColor; const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return c; const p = m[1].split(/[ ,/]+/).filter(Boolean); return p.length > 3 ? +p[3] : 1; };
  const top = document.querySelector('header.topbar'), tab = document.querySelector('.tabbar');
  const creds = [...document.querySelectorAll('figcaption, .credit, .gc-cred, [class*=cred]')].filter(vis);
  const over = creds.filter(e => e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1).map(e => e.textContent.trim().slice(0, 40));
  const credH = creds.map(e => e.getBoundingClientRect().height).sort((a, b) => a - b);
  const credFs = [...new Set(creds.map(e => getComputedStyle(e).fontSize))];
  // search placeholder fit
  const inp = [...document.querySelectorAll('input[type=search], input[placeholder]')].filter(vis)[0];
  let ph = null;
  if (inp) { const cv = document.createElement('canvas').getContext('2d'); const s = getComputedStyle(inp); cv.font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    const avail = inp.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight); ph = { text: inp.placeholder, need: Math.round(cv.measureText(inp.placeholder).width), avail: Math.round(avail) }; }
  // photo upscale: rendered device px vs natural width
  const imgs = [...document.images].filter(i => /photos\//.test(i.currentSrc || i.src) && vis(i) && i.complete && i.naturalWidth > 1);
  const up = imgs.map(i => ({ f: (i.currentSrc || i.src).split('/').pop(), css: Math.round(i.getBoundingClientRect().width), nat: i.naturalWidth, ratio: +(i.getBoundingClientRect().width * devicePixelRatio / i.naturalWidth).toFixed(2) }));
  // header links that wrap or truncate
  const hdr = top ? [...top.querySelectorAll('a, button, span, p')].filter(vis).filter(e => e.children.length === 0 && e.textContent.trim()) : [];
  const wrapped = hdr.filter(e => { const lh = parseFloat(getComputedStyle(e).lineHeight) || parseFloat(getComputedStyle(e).fontSize) * 1.3; return e.getBoundingClientRect().height > lh * 1.6; }).map(e => e.textContent.trim());
  const trunc = hdr.filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent.trim());
  return { topAlpha: alpha(top), tabAlpha: alpha(tab), credits: creds.length, creditOverflow: over, creditHeights: credH.length ? [credH[0], credH[credH.length >> 1], credH[credH.length - 1]].map(Math.round) : null, creditFont: credFs,
    placeholder: ph, photos: up.length, upscaled: up.filter(u => u.ratio > 1.2), phFade: document.documentElement.classList.contains('ph-fade'),
    headerWrapped: wrapped, headerTruncated: trunc, scrollY: Math.round(scrollY), docH: document.documentElement.scrollHeight };
};

(async () => {
  const b = await chromium.launch(); const res = {};
  const open = async (opts, url, wait = 2500) => { const ctx = await b.newContext({ ...opts, reducedMotion: 'reduce' }); await route(ctx); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e))); await p.goto(B + url, { waitUntil: 'load' }); await sleep(wait); return { ctx, p, errs }; };

  // 1. polish on the main pages
  for (const [k, url] of [['landing', 'index.html'], ['japan', 'Japan/index.html'], ['tokyo', 'cities/tokyo.html'], ['cleveland', 'cleveland.html'], ['newyork', 'cities/newyork.html'], ['chinatown', 'Singapore/chinatown.html'], ['wheeling', 'cities/wheeling.html'], ['tokyo-atlas', 'cities/tokyo.html#view=atlas']]) {
    for (const [vp, o] of [['m', PHONE], ['d', DESK]]) {
      const { ctx, p, errs } = await open(o, url);
      if (vp === 'm' && !/atlas/.test(k)) { await p.mouse.wheel(0, 1600); await sleep(700); }
      res[`${k}-${vp}`] = { ...(await p.evaluate(polish)), errors: errs.length };
      await ctx.close();
    }
  }

  // 2. sheet: scrim, centring, close vs switcher, photo upscale
  for (const [vp, o] of [['m', PHONE], ['d', DESK]]) {
    const { ctx, p } = await open(o, 'cities/tokyo.html#view=gallery&p=kanda-myojin', 3000);
    res[`sheet-${vp}`] = await p.evaluate(() => {
      const d = [...document.querySelectorAll('[role=dialog], dialog, .sheet')].find(e => e.getBoundingClientRect().width > 0);
      if (!d) return { dialog: false };
      const r = d.getBoundingClientRect();
      // what paints at a point outside the dialog (left edge, mid height): a scrim or the page?
      const x = Math.max(4, r.left - 20), y = innerHeight / 2; const at = document.elementFromPoint(x, y);
      const bg = at ? getComputedStyle(at).backgroundColor : null;
      const bd = getComputedStyle(d, '::backdrop').backgroundColor;
      const close = [...d.querySelectorAll('button')].find(e => /close|✕|×/i.test(e.getAttribute('aria-label') || e.textContent));
      const sw = document.querySelector('.views[data-cleo-views]'); let overlap = null;
      if (close && sw) { const a = close.getBoundingClientRect(), s = sw.getBoundingClientRect(); overlap = !(a.right < s.left || a.left > s.right || a.bottom < s.top || a.top > s.bottom) && getComputedStyle(sw).visibility !== 'hidden'; }
      const img = d.querySelector('img'); const ir = img && img.getBoundingClientRect();
      const nOf = (d.textContent.match(/No\.\s*\d+ of \d+ in [^\n]{0,30}/) || [null])[0];
      return { dialog: true, left: Math.round(r.left), right: Math.round(innerWidth - r.right), width: Math.round(r.width), outsideEl: at ? at.tagName + '.' + at.className.toString().slice(0, 30) : null, outsideBg: bg, backdrop: bd,
        closeOverlapsSwitcher: overlap, img: img ? { css: Math.round(ir.width), nat: img.naturalWidth, ratio: +(ir.width * devicePixelRatio / img.naturalWidth).toFixed(2) } : null, nOf };
    });
    await ctx.close();
  }

  // 3. Atlas phone: pins, hit boxes, last checked on the first screen
  for (const [k, url] of [['tokyo', 'cities/tokyo.html#view=atlas'], ['cleveland', 'cleveland.html#view=atlas'], ['chinatown', 'Singapore/chinatown.html#view=atlas']]) {
    const { ctx, p } = await open(PHONE, url, 3500);
    res[`atlas-m-${k}`] = await p.evaluate(() => {
      const inV = r => r.width > 0 && r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
      const icons = [...document.querySelectorAll('.leaflet-marker-icon')].map(e => [e, e.getBoundingClientRect()]).filter(([, r]) => inV(r));
      const kinds = {}; icons.forEach(([e, r]) => { const c = (e.className.baseVal || e.className).split(/\s+/).filter(x => x && x !== 'leaflet-marker-icon' && !/leaflet-/.test(x)).slice(0, 2).join('.'); (kinds[c] = kinds[c] || []).push(Math.round(Math.min(r.width, r.height))); });
      const sum = Object.fromEntries(Object.entries(kinds).map(([c, a]) => { a.sort((x, y) => x - y); return [c, { n: a.length, minSide: a[0], median: a[a.length >> 1], max: a[a.length - 1] }]; }));
      const lc = [...document.querySelectorAll('body *')].filter(e => e.children.length === 0 && /last checked|status checked/i.test(e.textContent)).filter(e => inV(e.getBoundingClientRect()) && getComputedStyle(e).visibility !== 'hidden').map(e => e.textContent.trim().slice(0, 40));
      const mp = document.querySelector('.leaflet-container'); const mr = mp && mp.getBoundingClientRect();
      return { markers: icons.length, byClass: sum, lastCheckedOnScreen: lc, mapBox: mr ? [Math.round(mr.top), Math.round(mr.width), Math.round(mr.height)] : null, mapShare: mr ? +(mr.width * mr.height / (innerWidth * innerHeight)).toFixed(2) : null };
    });
    await ctx.close();
  }

  // 4. Atlas desktop: map share, deep link scroll, rail reachability, header wrap
  for (const [k, url] of [['tokyo', 'cities/tokyo.html#view=atlas'], ['deeplink', 'cities/tokyo.html#view=atlas&p=kanda-myojin'], ['cleveland', 'cleveland.html#view=atlas']]) {
    const { ctx, p } = await open(DESK, url, 3500);
    res[`atlas-d-${k}`] = await p.evaluate(() => {
      const mp = document.querySelector('.leaflet-container'); const mr = mp && mp.getBoundingClientRect();
      const find = re => [...document.querySelectorAll('a,button,[role=button]')].filter(e => re.test(e.textContent.trim())).map(e => { const r = e.getBoundingClientRect(); return { t: e.textContent.trim().slice(0, 30), inView: r.width > 0 && r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight && getComputedStyle(e).visibility !== 'hidden' }; });
      return { mapW: mr ? Math.round(mr.width) : null, mapShareW: mr ? +(mr.width / innerWidth).toFixed(2) : null, mapH: mr ? Math.round(mr.height) : null, scrollY: Math.round(scrollY),
        bandBelowMap: mr ? Math.round(innerHeight - mr.bottom) : null, forYou: find(/^For you/), yourDay: find(/^(Your day|A day in)/), nearMe: find(/^Near me|Locate|Nearest first/) };
    });
    await ctx.close();
  }

  // 5. Locale: does the 日本語 switch work, and is the AI-review note visible?
  {
    const { ctx, p } = await open(DESK, 'cities/tokyo.html', 2500);
    const btn = await p.$('text=日本語');
    let after = null;
    if (btn) { await btn.click(); await sleep(2500);
      after = await p.evaluate(() => ({ lang: document.documentElement.lang, views: [...document.querySelectorAll('.views[data-cleo-views] button')].map(b => b.textContent.trim()).slice(0, 4),
        note: ([...document.querySelectorAll('body *')].find(e => e.children.length < 3 && /machine-translated|機械翻訳|AI/.test(e.textContent) && e.getBoundingClientRect().height > 0) || {}).textContent?.trim().slice(0, 160) || null,
        jaChars: (document.body.innerText.match(/[぀-ヿ]/g) || []).length })); }
    res.locale = { switcher: !!btn, after };
    await ctx.close();
  }
  fs.writeFileSync(out, JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res, null, 1));
  await b.close();
})();
