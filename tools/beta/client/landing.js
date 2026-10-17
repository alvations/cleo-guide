/* Cleo beta — landing.js (lane FE-B). The hero search: ?q= on load and live typing, rendered by Cleo.renderHits
 * (search.js) over the lazy site index. Destinations stay listed under the results, so nothing is ever hidden. */
(function () {
  'use strict';
  var Cleo = window.Cleo || {};
  var out = document.getElementById('results');
  var input = document.getElementById('cleo-q');
  // §v2.12 3a (one search per screen): the hero field is the landing's search, so the header's search icon is hidden
  // while the field is in view and shown once it has scrolled away (it then focuses the field: search.js)
  var hb = document.querySelector('header [data-cleo-search-open]'), form = input && (input.form || input);
  if (hb && form && window.IntersectionObserver) new IntersectionObserver(function (es) { hb.hidden = es[0].isIntersecting; }).observe(form);
  else if (hb) hb.hidden = false;
  if (!out || !input || !Cleo.searchIndex || !Cleo.renderHits) return;
  function clear() { input.value = ''; show(''); input.focus(); }
  function show(q) {
    if (!q) { out.hidden = true; out.innerHTML = ''; return; }
    var host = Cleo.urlHost && Cleo.urlHost(q);      // W9-6: a pasted link opens its source's places (the URL is never fetched)
    if (host) { Promise.all([Cleo.hostIndex(), Cleo.urlIndex(host)]).then(function (x) { if (input.value.trim() !== q) return; out.hidden = false;
        Cleo.renderSource(out, x[0], host, x[1] && x[1].urls && x[1].urls[Cleo.urlKey(q)], q); },
      function () { out.hidden = false; Cleo.indexFailed(out); }); return; }
    Cleo.searchIndex().then(function (data) {
      if (input.value.trim() !== q) return;            // a newer keystroke won
      out.hidden = false;
      Cleo.renderHits(out, data, q, clear);
    }, function () { out.hidden = false; Cleo.indexFailed(out); });
  }
  var q0 = ''; try { q0 = new URLSearchParams(location.search).get('q') || ''; } catch (e) {}
  if (q0) { input.value = q0; show(q0.trim()); }
  var t; input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { show(input.value.trim()); }, 150); });
  if (Cleo.kbNav) Cleo.kbNav(input, out);
  var form = input.form;
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault(); show(input.value.trim());
    if (out.scrollIntoView) out.scrollIntoView({ block: 'start' });
  });
})();
