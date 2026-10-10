/* Cleo beta — saved.js (lane FE-A). "Your list": places saved on this device, resolved through the search
 * index. Share as a link (#list=, grammar in Cleo.listCodec) — no account, no server. A shared link offers
 * "Save all"; ids the index no longer knows are shown as such, never dropped silently. */
(function () {
  'use strict';
  var Cleo = window.Cleo || {};
  var box = document.getElementById('saved');
  if (!box || !Cleo.saved) return;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function refs() {
    var r = Cleo.route.parse();
    if (r.list) return { shared: true, list: Cleo.listCodec.decode(r.list) };
    return { shared: false, list: Object.keys(Cleo.saved.all()) };
  }
  function paint() {
    var st = refs();
    if (!st.list.length) { box.innerHTML = '<p>Nothing saved yet. Tap “Save” on any place and it appears here, on this device.</p>'; return; }
    Cleo.searchIndex().then(function (data) {
      var pageIdx = {}; data.pages.forEach(function (p, i) { pageIdx[p[0]] = i; });
      var by = {}; data.items.forEach(function (it) { by[data.pages[it[0]][0] + '/' + it[1]] = it; });
      var groups = {};
      st.list.forEach(function (ref) { var k = ref.slice(0, ref.lastIndexOf('/')); (groups[k] = groups[k] || []).push(ref); });
      var share = location.href.split('#')[0] + '#list=' + Cleo.listCodec.encode(st.list);
      box.innerHTML = (st.shared ? '<p class="shared">A shared list of ' + st.list.length + ' places. <button type="button" data-save-all>Save all to this device</button></p>'
        : '<p><button type="button" data-share>Share this list</button></p>') +
        Object.keys(groups).map(function (k) {
          var pg = data.pages[pageIdx[k]];
          return '<section><h2>' + esc(pg ? pg[1] : k) + '</h2><ol>' + groups[k].map(function (ref) {
            var it = by[ref], id = ref.slice(ref.lastIndexOf('/') + 1);
            if (!it || !pg) return '<li>' + esc(id) + ' <span class="hit-m">no longer listed</span></li>';
            return '<li><a href="' + esc(pg[2] + (pg[4] ? '#p=' + encodeURIComponent(id) : '')) + '">' + esc(it[2]) + '</a>' + (it[5] ? ' <span class="hit-m">closed</span>' : '') + '</li>';
          }).join('') + '</ol></section>';
        }).join('');
      var sb = box.querySelector('[data-share]'); if (sb) sb.onclick = function () { Cleo.share('My Cleo list', share); };
      var sa = box.querySelector('[data-save-all]'); if (sa) sa.onclick = function () { Cleo.saved.add(st.list); location.hash = ''; };
    }, function () { box.innerHTML = '<p>' + st.list.length + ' saved places. The site index could not load to show them; try again when online.</p>'; });
  }
  window.addEventListener('hashchange', paint);
  document.addEventListener('cleo:saved', paint);
  paint();
})();
