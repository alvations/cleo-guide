/* Cleo beta — landing.js (lane FE-B). Site-wide search over beta/data/search.json (lazy, all matches). */
(function () {
  'use strict';
  var Cleo = window.Cleo || {};
  var out = document.getElementById('results'), dest = document.getElementById('destinations');
  var input = document.getElementById('cleo-q');
  if (!out || !input || !Cleo.searchIndex) return;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function show(q) {
    if (!q) { out.hidden = true; out.innerHTML = ''; if (dest) dest.hidden = false; return; }
    Cleo.searchIndex().then(function (data) {
      var hits = Cleo.search(data, q);
      out.hidden = false; if (dest) dest.hidden = true;
      out.innerHTML = '<h2>' + hits.length + ' ' + (hits.length === 1 ? 'place' : 'places') + ' for “' + esc(q) + '”</h2>' +
        '<ol class="hits">' + hits.map(function (h) {
          var it = h.it, pg = h.pg, href = pg[2] + (pg[4] ? '#p=' + encodeURIComponent(it[1]) : '');
          return '<li><a href="' + esc(href) + '">' + esc(it[2]) + '</a> <span class="hit-m">' + esc(pg[1]) + (it[6] ? ' · ' + esc(it[6]) : '') + (it[5] ? ' · closed' : '') + '</span></li>';
        }).join('') + '</ol>';
    }, function () {
      out.hidden = false; out.innerHTML = '<p>Search needs the site index, which could not load. Every guide is listed below.</p>';
      if (dest) dest.hidden = false;
    });
  }
  var q0 = ''; try { q0 = new URLSearchParams(location.search).get('q') || ''; } catch (e) {}
  if (q0) { input.value = q0; show(q0); }
  var t; input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { show(input.value.trim()); }, 150); });
  var form = input.form; if (form) form.addEventListener('submit', function (e) { e.preventDefault(); show(input.value.trim()); });
})();
