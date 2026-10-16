const fs = require('fs'), path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const BETA = path.join(__dirname, '../../../../beta');
const sleep = ms => new Promise(r => setTimeout(r, ms));
function boot(page, { storage = 'ok', seed = null } = {}) {
  let html = fs.readFileSync(path.join(BETA, page), 'utf8').replace(/<script src="((?:\.\.\/)*assets\/js\/[a-z-]+\.js)\?v=[^"]*" defer><\/script>/g,
    (m, src) => '<script>' + fs.readFileSync(path.join(BETA, path.dirname(page), src), 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>');
  if (/data-cleo-page="city"/.test(html)) html = html.replace('</body>', () => ['foryou', 'day', 'gallery', 'atlas'].map(n => '<script>' + fs.readFileSync(path.join(BETA, 'assets/js', n + '.js'), 'utf8') + '</script>').join('') + '</body>');
  const errs = [], vc = new VirtualConsole(); vc.on('jsdomError', e => { if (!/Not implemented|Could not parse CSS/.test(e.message)) errs.push('jsdom: ' + e.message.slice(0, 120)); });
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://x.test/beta/' + page, virtualConsole: vc,
    beforeParse(w) {
      w.Element.prototype.scrollIntoView = function () {}; w.scrollTo = () => {};
      w.matchMedia = q => ({ matches: /min-width/.test(q), addListener() {}, removeListener() {} });
      if (storage === 'throws') Object.defineProperty(w, 'localStorage', { get() { throw new Error('SecurityError'); } });
      else if (seed) for (const k in seed) w.localStorage.setItem('cleo:v1:' + k, JSON.stringify(seed[k]));
      w.fetch = u => { const p = path.join(BETA, new URL(u, w.location.href).pathname.replace(/^\/beta\//, ''));
        return fs.existsSync(p) ? Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(fs.readFileSync(p, 'utf8'))) }) : Promise.resolve({ ok: false, status: 404 }); };
      w.addEventListener('error', e => errs.push('ERR ' + (e.message || e.error)));
    } });
  return { w: dom.window, d: dom.window.document, errs, dom };
}
const snap = (w, d) => { if (w.Cleo && w.Cleo.defer) w.Cleo.defer.all();
  return { order: [...d.querySelectorAll('li.pl')].map(li => li.id), shown: [...d.querySelectorAll('li.pl:not([hidden])')].map(li => li.id).sort().join(),
    rails: [...d.querySelectorAll('.rail-i')].map(b => (b.getAttribute('data-c') || b.getAttribute('data-cz') || b.getAttribute('data-g') || '') + '|' + (b.querySelector('.t') || b).textContent.trim()).join('~') }; };
(async () => {

  const files = fs.readdirSync(path.join(BETA, 'data/places')).filter(f => f.endsWith('.json'));
  const tot = { pages: 0, setDiff: 0, orderSame: 0, lifted: 0, liftNoId: 0, liftClosed: 0, whyBad: 0, throwsDiff: 0, throwsErr: 0, clearDiff: 0, errs: 0, railReordered: 0, noFy: 0 };
  const bad = [];
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(BETA, 'data/places', f), 'utf8')); const page = data.beta;
    const a = boot(page); await sleep(150); const s0 = snap(a.w, a.d);
    const info = JSON.parse(a.d.getElementById('cleo-city').textContent); const FY = info.fy || [];
    if (!FY.length) { tot.noFy++; bad.push(page + ': no fy'); a.w.close(); continue; }
    a.w.close();
    const on = FY.map(x => x[0]);
    const b = boot(page, { seed: { interests: on } }); await sleep(200); const s1 = snap(b.w, b.d);
    tot.pages++;
    if (s1.shown !== s0.shown) { tot.setDiff++; bad.push(page + ': set differs'); }
    if (s1.order.join() === s0.order.join()) tot.orderSame++;
    if (s1.rails !== s0.rails) tot.railReordered++;
    const lifted = [...b.d.querySelectorAll('li.pl')].filter(li => li.querySelector('.pl-why'));
    tot.lifted += lifted.length;
    for (const li of lifted) {
      if (li.hasAttribute('data-closed')) tot.liftClosed++;
      if (!/^First because: /.test(li.querySelector('.pl-why').textContent)) tot.whyBad++;
      const has = (attr, v) => (' ' + (li.getAttribute(attr) || '') + ' ').includes(' ' + v + ' ');
      const ok = FY.some(fy => fy[3].some(x => { const [k, v] = [x.slice(0, x.indexOf(':')), x.slice(x.indexOf(':') + 1)];
        return k === 'k' ? li.getAttribute('data-k') === v : has(k === 'c' ? 'data-g' : 'data-cz', v); }));
      if (!ok) { tot.liftNoId++; bad.push(page + ': lift without id ' + li.id); }
    }
    // clear via the picker: open → Reset → Go
    b.d.querySelector('[data-cleo-foryou]').click(); await sleep(10);
    const rs = b.d.querySelector('[data-fy="reset"]'); rs && rs.click(); b.d.querySelector('[data-fy="go"]').click(); await sleep(30);
    const s2 = snap(b.w, b.d);
    if (s2.order.join() !== s0.order.join() || b.d.querySelectorAll('.pl-why').length) { tot.clearDiff++; bad.push(page + ': clear != default'); }
    tot.errs += b.errs.length + a.errs.length; if (b.errs.length) bad.push(page + ': ' + b.errs[0]);
    b.w.close();
    const c = boot(page, { storage: 'throws' }); await sleep(150); const s3 = snap(c.w, c.d);
    if (s3.order.join() !== s0.order.join() || s3.shown !== s0.shown) { tot.throwsDiff++; bad.push(page + ': throws differs'); }
    if (c.errs.length) { tot.throwsErr++; bad.push(page + ' throws: ' + c.errs[0]); }
    c.w.close();
  }
  console.log(JSON.stringify(tot)); console.log(bad.slice(0, 30).join('\n'));
})();
