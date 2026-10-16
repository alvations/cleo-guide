// FE-B probe (QC-09 / QC-06, DESIGN-SYSTEM §v2.11): the view switcher at 390 / 768 / 1440 and 260 px (≈ 200 % zoom on a
// phone). Checks: role=group + aria-label, 4 visible segments each >= 44 x 44, exactly one aria-pressed=true, one tap per
// switch, and on phones (< 640 px; wider, the sheet is a modal dialog) with the place-detail sheet open each segment is what elementFromPoint finds at its centre and a tap closes
// the sheet, switches and moves focus to the view's h1. Needs: python3 -m http.server 8765 -d <repo>. Run from tools/: node beta/feb-switcher.js [page]
const { chromium } = require('playwright');
const page0 = process.argv[2] || 'cities/tokyo.html';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let bad = 0;
  for (const w of [390, 768, 1440, 260]) {
    const p = await b.newPage({ viewport: { width: w, height: 844 } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:8765/beta/' + page0 + '#view=gallery'); await p.waitForTimeout(800);
    const st = () => p.evaluate(() => {
      const g = document.querySelector('[data-cleo-views]'), bs = [...g.querySelectorAll('button[data-view]')];
      return { tag: g.tagName, role: g.getAttribute('role'), label: g.getAttribute('aria-label'), pressed: bs.filter(x => x.getAttribute('aria-pressed') === 'true').map(x => x.dataset.view),
        segs: bs.map(x => { const r = x.getBoundingClientRect(); const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
          return { v: x.dataset.view, w: Math.round(r.width), h: Math.round(r.height), vis: r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right <= innerWidth + 1, hit: !!hit && x.contains(hit) }; }) };
    });
    const s0 = await st();
    const small = s0.segs.filter(x => !x.vis || x.w < 44 || x.h < 44);
    // open a place sheet, then check each segment is still hit-testable, and tap Guidebook once
    await p.evaluate(() => { const a = document.querySelector('li.pl .pl-n a'); if (a) a.click(); }); await p.waitForTimeout(600);
    const open1 = await p.evaluate(() => !!(window.Cleo && Cleo.sheet && Cleo.sheet.isOpen()));
    const s1 = await st();
    const covered = s1.segs.filter(x => !x.hit).map(x => x.v);
    const gb = await p.$('[data-cleo-views] button[data-view="guidebook"]'); const bb = await gb.boundingBox();
    await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(1200);
    const after = await p.evaluate(() => ({ view: document.documentElement.getAttribute('data-view'), sheet: !!(window.Cleo && Cleo.sheet && Cleo.sheet.isOpen()), focus: document.activeElement && document.activeElement.tagName, hash: location.hash }));
    const ok = s0.tag === 'DIV' && s0.role === 'group' && s0.label === 'View' && s0.pressed.length === 1 && !small.length && open1 && (w >= 640 || (!covered.length && after.view === 'guidebook' && !after.sheet && after.focus === 'H1')) && !errs.length;
    if (!ok) bad++;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${w}px  ${JSON.stringify({ segs: s0.segs.map(x => `${x.v} ${x.w}x${x.h}`), small, sheetOpen: open1, covered, after, errs })}`);
    await p.close();
  }
  await b.close();
  console.log(bad ? `>>> FAIL — ${bad} width(s)` : '>>> PASS — switcher: 4 segments >= 44 px, group role, reachable with a sheet open, 1 tap per switch');
  process.exit(bad ? 1 : 0);
})();
