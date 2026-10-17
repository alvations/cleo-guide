/* Cleo beta — allguides.js (lane FE-B, DESIGN-SYSTEM §v2.12 3a): a city's search results end with "Search all guides for
 * “q”", which runs the site-wide search. Lazy: search.js loads it on the city field's first focus (the eager budget). It
 * fills FE-A's [data-cleo-all-slot] after each apply (their cleo:city-search {q, n}; on load, from Cleo.city.none =
 * [n, q, total]). The row is a plain link to the landing's search, so it also works without JS; with no city hits, Enter
 * in the field runs it. */
(function () {
  'use strict';
  var Cleo = window.Cleo = window.Cleo || {}, d = document;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var tt = function (k, e, v) { return Cleo.t ? Cleo.t(k, e, v) : e.replace(/\{([a-z]+)\}/g, function (m, n) { return n in v ? v[n] : m; }); };
  var slot = d.querySelector('[data-cleo-all-slot]'), cf = d.getElementById('cleo-filter'), allN = -1;
  var draw = function (q, n) {
    q = String(q || '').trim(); allN = q ? +n || 0 : -1;
    if (slot) slot.innerHTML = q ? '<a class="btn btn-quiet" data-cleo-all-guides href="' + esc((Cleo.root || '') + 'index.html?q=' + encodeURIComponent(q) + '#search') + '">' +
      esc(tt('srch.allguides', 'Search all guides for “{q}”', { q: q })) + '</a>' : '';
  };
  d.addEventListener('cleo:city-search', function (e) { var x = e.detail || {}; draw(x.q, x.n); });
  if (cf) cf.addEventListener('keydown', function (e) { var l = slot && slot.querySelector('a[data-cleo-all-guides]'); if (e.key === 'Enter' && allN === 0 && l) { e.preventDefault(); location.href = l.href; } });
  var none = Cleo.city && Cleo.city.none; if (none) draw(none[1], none[0]);
  if (Cleo.need && Cleo.need.done) Cleo.need.done('allguides');
})();
