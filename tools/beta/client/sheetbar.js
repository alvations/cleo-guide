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
    var last = sh.scrollTop, away = false;
    var set = function (on) { if (on !== away) { away = on; sh.classList.toggle('acts-away', on); } };
    sh.addEventListener('scroll', function () {
      var st = sh.scrollTop, end = st + sh.clientHeight >= sh.scrollHeight - 4;
      if (end || st <= 0) { set(false); last = st; return; }
      if (st - last >= STEP) { set(true); last = st; } else if (last - st >= STEP) { set(false); last = st; }
    }, { passive: true });
    sh.addEventListener('focusin', function (e) { if (e.target.closest && e.target.closest('.actions')) set(false); });
  }
  Cleo.sheetbar = function () { wire(d.querySelector('#cleo-sheet .sheet.detail')); };
  Cleo.sheetbar();
  if (Cleo.need && Cleo.need.done) Cleo.need.done('sheetbar');
})();
