/* Cleo beta — sheetbar.js (FE-C, OV-111 / OV-112; DESIGN-SYSTEM v2.12 OV-00 §1). On a portrait phone or tablet the place
 * sheet's action bar (Save · Directions · Share) is its one second row: it slides away while the reader scrolls the sheet
 * down (≥ 24 px) and comes back on a scroll up, at the end of the sheet, or when focus enters it. transform only (CSS,
 * fe-c.css; none under reduced motion). Landscape and desktop place the bar under the nav row instead (CSS only), so this
 * does nothing there. Loaded on the first sheet (city.js FE-C hook). */
(function () {
  'use strict';
  var Cleo = window.Cleo || {}, d = document;
  if (Cleo.sheetbar) return;
  var STEP = 24;
  function wire(sh) {
    if (!sh || sh._cleoBar) return; sh._cleoBar = true;
    // portrait: the scroll area is .sh-body (the bar sits under it, in flow); landscape / desktop: the sheet itself
    var sc = sh.querySelector(':scope > .sh-body') || sh, last = 0, away = false;
    var set = function (on) { if (on !== away) { away = on; sh.classList.toggle('acts-away', on); } };
    var onScroll = function (e) {
      var el = e.currentTarget; if (getComputedStyle(el).overflowY === 'visible') return;
      var st = el.scrollTop, end = st + el.clientHeight >= el.scrollHeight - 4;
      if (end || st <= 0) { set(false); last = st; return; }
      if (st - last >= STEP) { set(true); last = st; } else if (last - st >= STEP) { set(false); last = st; }
    };
    sh.addEventListener('scroll', onScroll, { passive: true }); if (sc !== sh) sc.addEventListener('scroll', onScroll, { passive: true });
    sh.addEventListener('focusin', function (e) { if (e.target.closest && e.target.closest('.actions')) set(false); });
  }
  // FE-C D-53 (trust): the detail still lists every source, but only real recommenders sit under "Recommended by" (the card's
  // chips, recby). A rating platform or the place's own site is listed apart as "Other sources" — a link to read, never a
  // recommender, its "(official …)" tail dropped (lib/model.js recName). Below the first screen, after the sheet's second frame
  var last = null;
  function others(c) {
    var host = d.getElementById('cleo-sheet'), C = Cleo.city || {}, info = C.info || {}, rec = {}; if (!c || !host || host.hidden || !C.esc) return;
    var old = host.querySelector('[data-cleo-others]'); if (old) old.remove();
    [].forEach.call(c.querySelectorAll('.pl-s button.src'), function (b) { rec[b.getAttribute('data-src')] = 1; });
    var ids = (c.dataset.src || '').split(' ').filter(function (g) { return g && g !== 'guide' && !rec[g]; }); if (!ids.length) return;
    var esc = C.esc, t = Cleo.t, nm = function (n) { return String(n).replace(/\s*\(official\b[^)]*\)/ig, '').trim() || String(n); };
    var li = ids.map(function (g) { var s = (info.src || {})[g] || [g, 0, 0, '', ''], n = nm(s[0]), u = /^https?:\/\//.test(s[4]) ? s[4] : '';
      return '<li data-g="' + esc(g) + '"><span class="mono" aria-hidden="true">' + esc(n.charAt(0)) + '</span><div><span class="nm">' + esc(n) + '</span><span class="ttl">' +
        esc(u.replace(/^https?:\/\/(www\.)?/, '').split(/[/?#]/)[0]) + '</span></div><div class="acts">' + (u ? '<a class="out" href="' + esc(u) + '" rel="noopener" target="_blank">' +
        esc(t('sheet.read', 'Read')) + ' ' + C.icon('external') + '<span class="vh"> ' + esc(n) + '</span></a>' : '') + '</div></li>'; }).join('');
    var html = '<div data-cleo-others><h3 class="section-t">' + esc(t('ins.other', 'Other sources')) + '</h3><ul class="srclist">' + li + '</ul></div>';
    var at = host.querySelector('.content .srclist'), ct = host.querySelector('.content');
    if (at) at.parentNode.insertAdjacentHTML('afterend', html); else if (ct) { var f = ct.querySelector(':scope > .fact, :scope > .plan'); if (f) f.insertAdjacentHTML('beforebegin', html); else ct.insertAdjacentHTML('beforeend', html); }
  }
  // Per-article links from the page dataset (sheet.js's deep(), moved here for the INP budget: it runs after the first paint
  // anyway). Perf audit PERF-04: the links slice (data/links/<page>.json, ~7× smaller than the page dataset) when present
  function deep(c) {
    var C = Cleo.city, info = C.info || {}, host = d.getElementById('cleo-sheet'), id = C.pid(c), q = function (s, el) { return (el || host).querySelector(s); };
    var dom = function (u) { return (/^https?:\/\/(?:www\.)?([^/?#]+)/i.exec(u || '') || [])[1] || ''; };
    var rd = String(Cleo.t('sheet.read', 'Read')).split(' '), lw = rd.pop(), read = (rd.length ? C.esc(rd.join(' ')) + ' ' : '') + '<span class="nw">' + C.esc(lw) + ' ' + C.icon('external') + '</span>';
    var fromPage = function (j) { var kg = {}, rec = (j.places || []).filter(function (p) { return p.id === id; })[0], p = {};
      (j.sourceIndex || []).forEach(function (s) { (s.entries || []).forEach(function (e) { kg[e.key] = s.id; }); });
      p[id] = rec ? rec.s : []; return { g: kg, p: p }; };
    var got = Cleo.links ? Cleo.links(info.key).catch(function () { return Cleo.pageData(info.key).then(fromPage); })
      : Cleo.pageData ? Cleo.pageData(info.key).then(fromPage) : null;
    if (got) got.then(function (j) {
      if (last !== c || host.hidden) return;
      var kg = j.g || {};
      (j.p && j.p[id] || []).forEach(function (x) {
        var li = kg[x[0]] && q('.srclist li[data-g="' + kg[x[0]] + '"]'), u = /^https?:\/\/\S+$/.test(x[1] || '') ? x[1] : '';
        if (!li || !u) return;
        var a = q('a.out', li); if (!a) { q('.acts', li).insertAdjacentHTML('beforeend', '<a class="out" rel="noopener" target="_blank">' + read + '</a>'); a = q('a.out', li); }
        a.href = u; q('.ttl', li).textContent = dom(u);
        var pr = q('.primary-link[data-g="' + kg[x[0]] + '"]'); if (pr) { pr.href = u; pr.hidden = false; }
      });
    }).catch(function () {});
  }
  Cleo.sheetbar = function (c) { wire(d.querySelector('#cleo-sheet .sheet.detail')); if (c) { last = c; deep(c); others(c); } };
  d.addEventListener('cleo:locale', function () { if (last) setTimeout(function () { wire(d.querySelector('#cleo-sheet .sheet.detail')); deep(last); others(last); }); });
  Cleo.sheetbar();
  if (Cleo.need && Cleo.need.done) Cleo.need.done('sheetbar');
})();
