/* Cleo beta — srcview.js (lane FE-B, W9-6 paste a link; D-53). Cleo.renderSource(el, idx, host, exact, url): the places a
 * pasted link's source names. Lazy: search.js's stub loads it on the first pasted link (the eager budget).
 * D-53 (trust): only a real recommender "recommends". A rating platform or a place's own site is flagged by build.js
 * (data/source-hosts.json row[5] / source-urls row[6] = 1) and reads "Places that cite <host>": counted, never a recommender. */
(function () {
  'use strict';
  var Cleo = window.Cleo = window.Cleo || {};
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var tt = function (k, e, v) { return Cleo.t ? Cleo.t(k, e, v) : v ? e.replace(/\{([a-z]+)\}/g, function (m, n) { return n in v ? v[n] : m; }) : e; };
  // i18n D-41: what was drawn is drawn again in the loaded catalogue (cleo:locale)
  var drawn = [];
  document.addEventListener('cleo:locale', function () { drawn.slice().forEach(function (d) { if (d.el.isConnected) d.fn(); }); });
  var SUGGEST = 'https://github.com/alvations/cleo-guide/issues/new?labels=source-suggestion';
  Cleo.renderSource = function (el, idx, host, exact, url) {
    drawn = drawn.filter(function (d) { return d.el !== el && d.el.isConnected; });
    drawn.push({ el: el, fn: function () { Cleo.renderSource(el, idx, host, exact, url); } });
    var h = host, rows = null;
    while (h && !(rows = (idx.hosts || {})[h])) h = h.indexOf('.') > 0 && h.split('.').length > 2 ? h.slice(h.indexOf('.') + 1) : null;   // sub.example.com → example.com
    var plural = function (n, w) { return w === 'guide' ? (n === 1 ? tt('srch.guide.n1', '1 guide') : tt('srch.guides', '{n} guides', { n: n.toLocaleString('en-US') }))
      : n === 1 ? tt('srch.place.n1', '1 place') : tt('srch.places.n', '{n} places', { n: n.toLocaleString('en-US') }); };
    var note = '<p class="sm muted">' + tt('srch.src.note', 'Cleo only read the link’s address; nothing was opened or fetched from it.') + '</p>';
    if (!rows && !(exact && exact.length)) {
      var href = SUGGEST + '&title=' + encodeURIComponent('Source suggestion: ' + host) + '&body=' + encodeURIComponent('**Source:** ' + (url || host) + '\n\n**Why it is worth reading:**\n\n---\nFiled from the beta search (paste a link).');
      el.innerHTML = '<div class="state" data-cleo-state="no-source"><h3>' + tt('srch.src.none.h', 'No guide cites {host} yet.', { host: esc(host) }) + '</h3>' +
        '<p>' + tt('srch.src.none.p', 'Paste a link from a source the guides name — a newspaper, a guidebook, a creator — to see the places it recommends. If this one is worth reading, suggest it: the link opens a pre-filled issue on the project’s GitHub.') + '</p>' +
        '<p><a class="btn btn-quiet" data-cleo-suggest href="' + esc(href) + '" target="_blank" rel="noopener">' + tt('srch.src.suggest', 'Suggest this source') + '</a></p>' + note + '</div>';
      return 0;
    }
    var out = '', total = 0;
    // a specific page: the places citing exactly that URL come first — recommended by it, or (platform / own site) citing it
    var page = function (list, head) {
      return list.length ? '<section class="grp" data-cleo-source-url><h2 class="d3">' + head + ' <span class="sm muted">' + plural(list.length, 'place') + '</span></h2><ol>' +
        list.map(function (r) { return '<li><a href="' + esc((Cleo.root || '') + r[0] + '#p=' + encodeURIComponent(r[2])) + '"><span>' + esc(r[3]) + '</span><span class="meta">' + esc(r[1]) + ' · ' + esc(r[5]) + '</span></a></li>'; }).join('') + '</ol></section>' : '';
    };
    if (exact && exact.length) {
      out += page(exact.filter(function (r) { return !r[6]; }), tt('srch.src.page', 'Recommended on this page')) +
        page(exact.filter(function (r) { return r[6]; }), tt('srch.src.page.cites', 'Places that cite this page'));
    }
    // the source's view (VOICE.md rule 5): "Everything <source> recommends, in N guides" — one per publisher on that site
    if (rows) {
      var by = {}, order = [];
      rows.forEach(function (r) { if (!by[r[3]]) { by[r[3]] = []; order.push(r[3]); } by[r[3]].push(r); });
      order.forEach(function (name) {
        var g = by[name], n = g.reduce(function (t, r) { return t + r[4]; }, 0); total += n;
        out += '<section class="grp"><h2 class="d3" data-cleo-source="' + esc(h) + '">' + (g[0][5]
          ? tt('srch.src.cites', 'Places that cite {host}, in {guides}', { host: esc(h), guides: plural(g.length, 'guide') })
          : tt('srch.src.all', 'Everything {source} recommends, in {guides}', { source: esc(name), guides: plural(g.length, 'guide') })) +
          ' <span class="sm muted">' + plural(n, 'place') + '</span></h2><ol>' + g.map(function (r) {
            return '<li><a href="' + esc((Cleo.root || '') + r[0] + '#src=' + encodeURIComponent(r[2])) + '"><span>' + esc(r[1]) + '</span><span class="meta">' + plural(r[4], 'place') + '</span></a></li>';
          }).join('') + '</ol></section>';
      });
    }
    el.innerHTML = out + note;
    return total || (exact ? exact.length : 0);
  };
  if (Cleo.need && Cleo.need.done) Cleo.need.done('srcview');
})();
