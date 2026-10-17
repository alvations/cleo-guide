/* Cleo beta — compact.js (lane FE-B, OV-00 / DESIGN-SYSTEM §v2.12 rule 1): guest bars step aside while the reader scrolls. */
(function () {
  'use strict';
  var Cleo = window.Cleo = window.Cleo || {};
  // OV-00 (DESIGN-SYSTEM §v2.12 rule 1, FE-B): a guest bar gets `cls` after a ≥ 24 px scroll down and loses it on a ≥ 24 px
  // scroll up, near the top, or when focus enters it (it stays in the tab order). The CSS moves it by transform only.
  // Returns an unbind function. Shell pages only (loaded with the tab bar, shell.js footer): city pages use FE-A's one
  // scroll state, html.ov-c (Cleo.chrome), so there is a single state machine there and no bytes here.
  Cleo.compact = function (el, cls) {
    if (!el) return function () {};
    var p = window.scrollY, a = p, dir = 0;
    var f = function () {
      var n = window.scrollY, nd = n > p ? 1 : n < p ? -1 : dir; if (nd !== dir) { dir = nd; a = p; } p = n;
      if (n < 8 || (dir < 0 && a - n >= 24)) el.classList.remove(cls); else if (dir > 0 && n - a >= 24) el.classList.add(cls);
    }, u = function () { el.classList.remove(cls); };
    window.addEventListener('scroll', f, { passive: true }); el.addEventListener('focusin', u);
    return function () { window.removeEventListener('scroll', f); el.removeEventListener('focusin', u); el.classList.remove(cls); };
  };
  Cleo.compact(document.querySelector('.tabbar'), 'is-away');
  if (Cleo.need && Cleo.need.done) Cleo.need.done('compact');
})();
