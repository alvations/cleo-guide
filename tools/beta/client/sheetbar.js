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
  Cleo.sheetbar = function () { wire(d.querySelector('#cleo-sheet .sheet.detail')); };
  Cleo.sheetbar();
  if (Cleo.need && Cleo.need.done) Cleo.need.done('sheetbar');
})();
