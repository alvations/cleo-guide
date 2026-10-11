/* Cleo beta — interests.js (FE-B, W9-3). "Your interests follow you": the interests picked on any city page
 * (FE-A's For you, Cleo.store 'interests' — ids only, never a dish or name keyword) fill a "For you" rail on the
 * landing and the country hubs. The rail lists the guides with the most OPEN places for those interests first, each
 * with "First because …"; it only reorders — every guide stays listed below, and nothing is hidden. Counts come from
 * the build (li.dest[data-fy] = "history:12 food:40"); storage is try/catch inside Cleo.store. */
(function () {
  'use strict';
  var d = document, Cleo = window.Cleo || {};
  var sec = d.querySelector('[data-cleo-fy]');
  if (!sec) return;
  var store = Cleo.store || { get: function (k, x) { return x; }, set: function () {} };
  var labels = {}; try { labels = JSON.parse(sec.getAttribute('data-labels') || '{}'); } catch (e) {}
  var ids = Object.keys(labels), list = sec.querySelector('.fy-list');
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); };
  var fill = function (k, v) { return (sec.getAttribute(k) || '').replace(/\{(\w+)\}/g, function (m, x) { return v[x] != null ? v[x] : m; }); };
  var interests = function () { var v = store.get('interests', []); return (Array.isArray(v) ? v : []).filter(function (x) { return ids.indexOf(x) >= 0; }); };

  function guides() {                                   // one row per guide, in page order (a guide can appear twice)
    var seen = {}, out = [];
    Array.prototype.forEach.call(d.querySelectorAll('li.dest[data-page]'), function (li) {
      var k = li.getAttribute('data-page'), a = li.querySelector('a[href]');
      if (seen[k] || !a || sec.contains(li)) return; seen[k] = 1;
      var fy = {}; (li.getAttribute('data-fy') || '').split(' ').forEach(function (p) { var i = p.indexOf(':'); if (i > 0) fy[p.slice(0, i)] = +p.slice(i + 1); });
      var n = li.querySelector('.card-t, .dest-n');
      out.push({ href: a.getAttribute('href'), name: (n ? n.textContent : a.textContent).trim(), fy: fy, i: out.length });
    });
    return out;
  }

  function render() {
    var on = interests();
    var rows = on.length ? guides().map(function (g) {
      var hit = on.filter(function (id) { return g.fy[id] > 0; });
      g.n = hit.reduce(function (s, id) { return s + g.fy[id]; }, 0); g.hit = hit; return g;
    }).filter(function (g) { return g.n > 0; }).sort(function (a, b) { return b.n - a.n || a.i - b.i; }) : [];
    sec.hidden = !rows.length;
    list.innerHTML = rows.map(function (g) {
      // per-interest counts, each exact (a place in two interests would be double-counted by a sum, so none is shown)
      var names = g.hit.map(function (id) { return labels[id] + ' ' + g.fy[id].toLocaleString('en-US'); }).join(' · ');
      return '<li><a href="' + esc(g.href) + '" data-fy-rank="' + g.n + '"><span class="dest-n">' + esc(g.name) + '</span><span class="dest-s">' +
        esc(fill('data-because', { names: names })) + '</span></a></li>';
    }).join('');
  }

  var clear = sec.querySelector('[data-cleo-fy-clear]');
  if (clear) clear.addEventListener('click', function () {
    store.set('interests', []); render();
    var next = d.querySelector('#destinations a[href]'); if (next) next.focus();
  });
  window.addEventListener('storage', function (e) { if (!e.key || /interests/.test(e.key)) render(); });   // picked in another tab
  render();
})();
