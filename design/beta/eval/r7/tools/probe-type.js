// R7 evaluator (from r6/tools/probe-type.js; Bricolage counted as display): runtime typography & style census. Usage: node probe-type.js <port> <label> <out.json>
// For each page × viewport: distinct rendered font-size / letter-spacing / border-radius / box-shadow on visible elements,
// numeric figure style on counts/pins/stats, and the platform fonts Chromium actually used (CDP) for script samples.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const [port, label, out] = process.argv.slice(2);
const B = `http://127.0.0.1:${port}/beta/`;
const pages = [['landing', 'index.html'], ['hub', 'Japan/index.html'], ...['gallery', 'atlas', 'guidebook', 'insights'].map(v => [`tokyo-${v}`, `cities/tokyo.html#view=${v}`]),
  ['sheet', 'cities/tokyo.html#view=gallery&p=kanda-myojin'], ['sheet-vn', 'Vietnam/ho-chi-minh-city.html#view=gallery&p=viet-nam-quoc-tu'], ['hcmc-gallery', 'Vietnam/ho-chi-minh-city.html#view=gallery'], ['ny-gallery', 'cities/newyork.html#view=gallery'], ['wheeling', 'cities/wheeling.html']];
(async () => {
  const b = await chromium.launch(); const res = {};
  for (const [vp, o] of [['m', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }], ['d', { viewport: { width: 1440, height: 900 } }]]) {
    const ctx = await b.newContext({ ...o, reducedMotion: 'reduce' });
    await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
    for (const [name, u] of pages) {
      const p = await ctx.newPage();
      await p.goto(B + u, { waitUntil: 'load' }); await p.waitForTimeout(1500);
      await p.evaluate(() => document.fonts.ready);
      const census = await p.evaluate(() => {
        const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && r.bottom > 0 && r.top < innerHeight * 3; };
        const els = [...document.querySelectorAll('body *')].filter(vis);
        const txt = els.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
        const C = (arr, f) => { const m = {}; for (const e of arr) { const v = f(getComputedStyle(e)); if (v != null) m[v] = (m[v] || 0) + 1; } return m; };
        const sizes = C(txt, s => s.fontSize), ls = C(txt, s => s.letterSpacing), fam = C(txt, s => s.fontFamily.split(',')[0].replace(/"/g, ''));
        const rad = C(els, s => s.borderTopLeftRadius !== '0px' ? s.borderTopLeftRadius : null), sh = C(els, s => s.boxShadow !== 'none' ? s.boxShadow.replace(/rgba?\([^)]*\)/g, 'c') : null);
        const wt = C(txt, s => s.fontWeight);
        // figures: elements whose own text is mostly digits
        const nums = txt.filter(e => /^[\s\d.,·#%★()+\-–/]+$/.test([...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim()) && /\d/.test(e.textContent));
        const tab = nums.filter(e => /tabular/.test(getComputedStyle(e).fontVariantNumeric)).length;
        return { textEls: txt.length, distinctSizes: Object.keys(sizes).length, sizes, distinctLS: Object.keys(ls).length, families: fam, weights: wt, distinctRadii: Object.keys(rad).length, radii: rad, distinctShadows: Object.keys(sh).length, numericEls: nums.length, numericTabular: tab, numericSamples: nums.slice(0, 6).map(e => e.className + ':' + e.textContent.trim().slice(0, 10) + ':' + getComputedStyle(e).fontVariantNumeric) };
      });
      // CDP platform fonts for samples
      const cdp = await ctx.newCDPSession(p); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
      const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
      const samples = {};
      const marks = await p.evaluate(() => {
        const out = []; const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const want = { macron: /[ŌōŪūĀā]/, viet: /[ơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹđ]/i, cjk: /[぀-ヿ一-鿿]/ };
        const got = {}; let n;
        while ((n = tw.nextNode())) { const e = n.parentElement; if (!e) continue; const r = e.getBoundingClientRect(); if (!r.width || r.top > innerHeight * 4) continue;
          for (const [k, re] of Object.entries(want)) { const disp = /Playfair|Bodoni|Bricolage/.test(getComputedStyle(e).fontFamily.split(',')[0]) ? 'disp' : 'ui'; const key = k + '-' + disp; if (!got[key] && re.test(n.textContent)) { got[key] = 1; e.setAttribute('data-probe', key); out.push([key, n.textContent.trim().slice(0, 40), getComputedStyle(e).fontSize]); } } }
        return out; });
      for (const [key, t, fsz] of marks) {
        const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: `[data-probe="${key}"]` });
        if (!nodeId) continue;
        const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
        samples[key] = { text: t, size: fsz, fonts: fonts.map(f => f.familyName + '×' + f.glyphCount) };
      }
      res[`${name}-${vp}`] = { ...census, scripts: samples };
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(out, JSON.stringify({ label, res }, null, 1));
  for (const [k, v] of Object.entries(res)) console.log(k.padEnd(18), 'sizes', v.distinctSizes, 'ls', v.distinctLS, 'radii', v.distinctRadii, 'shadows', v.distinctShadows, 'tab', v.numericTabular + '/' + v.numericEls, JSON.stringify(v.scripts));
})();
