/* Cleo beta — empty.js (FE-C, QC-05). The stated empty state when a search or filters match no place: it says so (naming
 * the search text), offers "Clear search" (the search only, other filters stay) and "Show all N", in the lens slot above
 * the list (Gallery, the Atlas list) and on the map (Atlas, phone and desktop). While nothing is shown, no "All N" mode
 * chip stays pressed: it would claim a set the page isn't showing. Loaded on the first empty result (city.js FE-C hook). */
(function () {
  'use strict';
  var Cleo = window.Cleo || {}, d = document;
  if (Cleo.empty) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var last = null;
  /** n = places shown, q = the search text ('' when none), tot = the guide's places. Idempotent; n > 0 removes the state. */
  function draw(n, q, tot) {
    last = [n, q, tot];
    [].forEach.call(d.querySelectorAll('[data-cleo-empty]'), function (e) { e.remove(); });
    d.documentElement.classList.toggle('cleo-none', !n);
    if (n) return;
    var head = q ? Cleo.t('city.empty.q', 'No places match “{q}”.', { q: q }) : Cleo.t('city.empty.f', 'No places match these filters.');
    var acts = (q ? '<button type="button" class="btn btn-ghost" data-unset="q">' + esc(Cleo.t('city.empty.search', 'Clear search')) + '</button>' : '') +
      '<button type="button" class="btn btn-primary" data-cleo-all>' + esc(Cleo.t('city.showall', 'Show all {n}', { n: tot })) + '</button>';
    var body = (q ? '<p>' + esc(Cleo.t('city.empty.qnote', 'Try another spelling, or search for a dish or an area.')) + '</p>' : '') + '<div class="row">' + acts + '</div>';
    var lens = d.getElementById('cleo-lens');
    if (lens) { lens.insertAdjacentHTML('afterbegin', '<div class="empty-st" data-cleo-empty><h2>' + esc(head) + '</h2>' + body + '</div>'); lens.hidden = false; }
    var mp = d.querySelector('.mappane');
    if (mp) mp.insertAdjacentHTML('beforeend', '<div class="map-empty" data-cleo-empty role="status"><p class="h">' + esc(head) + '</p>' + body + '</div>');
    [].forEach.call(d.querySelectorAll('button[data-mode][aria-pressed="true"]'), function (b) { b.setAttribute('aria-pressed', 'false'); });
  }
  Cleo.empty = { draw: draw };
  d.addEventListener('cleo:locale', function () { if (last) draw(last[0], last[1], last[2]); });
  if (Cleo.need && Cleo.need.done) Cleo.need.done('empty');
})();
