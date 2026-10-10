/* View-style mockups: the shared view model in miniature (hash lens, paging with all-N + show-all, last-view memory,
   Atlas tray detents). Content is the HTML: with this script off, every card is visible. */
(function () {
  'use strict';
  var d = document, html = d.documentElement;
  var store = {                                    // stands in for Cleo.store (try/catch, in-memory fallback)
    mem: {},
    get: function (k) { try { var v = localStorage.getItem('cleo:v1:' + k); if (v !== null) return JSON.parse(v); } catch (e) {} return this.mem[k]; },
    set: function (k, v) { this.mem[k] = v; try { localStorage.setItem('cleo:v1:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  function parse() {
    var o = {}; location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
      var i = kv.indexOf('='); if (i > 0) try { o[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1)); } catch (e) {}
    }); return o;
  }
  function href(o) {
    var p = []; Object.keys(o).forEach(function (k) { if (o[k] !== '' && o[k] != null) p.push(encodeURIComponent(k) + '=' + encodeURIComponent(o[k])); });
    return p.length ? '#' + p.join('&') : '#';
  }
  var view = html.getAttribute('data-view');
  if (view) store.set('view', view);               // remember the last view (a preference, not state)

  /* ---- lens: the same predicates every view applies (a=, k=, t=, c=, cz=, src=, closed=, q=) ---- */
  function match(el, r) {
    var g = ' ' + (el.getAttribute('data-g') || '') + ' ', cz = ' ' + (el.getAttribute('data-cz') || '') + ' ', s = ' ' + (el.getAttribute('data-src') || '') + ' ';
    if (r.a && el.getAttribute('data-a') !== r.a) return false;
    if (r.k && el.getAttribute('data-k') !== r.k) return false;
    if (r.t && (el.getAttribute('data-t') !== r.t || el.hasAttribute('data-closed'))) return false;
    if (r.c && g.indexOf(' ' + r.c + ' ') < 0) return false;
    if (r.cz && cz.indexOf(' ' + r.cz + ' ') < 0) return false;
    if (r.src && s.indexOf(' ' + r.src + ' ') < 0) return false;
    if (r.closed && !el.hasAttribute('data-closed')) return false;
    if (r.q && (el.getAttribute('data-n') || '').indexOf(r.q.toLowerCase()) < 0) return false;
    return true;
  }
  var LENS = ['a', 'k', 't', 'c', 'cz', 'src', 'closed', 'q'];

  /* ---- Gallery grid: pages + "all N" + show all ---- */
  var grid = d.querySelector('[data-paged]'), pager = d.querySelector('[data-pager]');
  function render() {
    var r = parse(), items = grid ? [].slice.call(grid.children) : [];
    var hits = items.filter(function (el) { return match(el, r); });
    var N = +(grid && grid.getAttribute('data-total')) || items.length;
    var size = matchMedia('(max-width: 640px)').matches ? 24 : 48;
    var pages = Math.max(1, Math.ceil(hits.length / size));
    var pg = Math.min(Math.max(1, +r.pg || 1), pages), all = r.all === '1';
    items.forEach(function (el) { el.hidden = true; });
    hits.forEach(function (el, i) { el.hidden = !all && (i < (pg - 1) * size || i >= pg * size); });
    var lensOn = LENS.some(function (k) { return r[k]; });
    var bar = d.querySelector('.lensbar');
    if (lensOn) {
      if (!bar) { bar = d.createElement('p'); bar.className = 'lensbar'; grid.parentNode.insertBefore(bar, grid); }
      bar.innerHTML = '<b>' + hits.length + ' of all ' + N + ' places</b> match this lens. ';
      var b = d.createElement('button'); b.type = 'button'; b.className = 'btn ghost'; b.textContent = 'Show all ' + N + ' places';
      b.onclick = function () { var o = parse(); LENS.forEach(function (k) { delete o[k]; }); delete o.pg; location.hash = href(o); };
      bar.appendChild(b);
      if (location.hash.indexOf('a=') > 0 || r.src || r.c || r.cz || r.closed || r.t || r.k) { var all_ = d.getElementById('all'); if (all_ && !render.done) all_.scrollIntoView(); }
    } else if (bar) bar.remove();
    render.done = true;
    if (!pager) return;
    var from = all ? 1 : (pg - 1) * size + 1, to = all ? hits.length : Math.min(pg * size, hits.length);
    var h = '';
    if (!all && pages > 1) {
      h += '<button class="pg" type="button" data-pg="' + (pg - 1) + '"' + (pg === 1 ? ' disabled' : '') + ' aria-label="Previous page">‹</button>';
      for (var i = 1; i <= pages; i++) {
        if (i === 1 || i === pages || Math.abs(i - pg) <= 1) h += '<button class="pg" type="button" data-pg="' + i + '"' + (i === pg ? ' aria-current="page"' : '') + '>' + i + '</button>';
        else if (Math.abs(i - pg) === 2) h += '<span aria-hidden="true">…</span>';
      }
      h += '<button class="pg" type="button" data-pg="' + (pg + 1) + '"' + (pg === pages ? ' disabled' : '') + ' aria-label="Next page">›</button>';
    }
    h += '<p class="tot">Showing ' + (hits.length ? from : 0) + '–' + to + ' of ' + hits.length + (hits.length !== N ? ' (all ' + N + ' places in the guide)' : ' — all ' + N + ' places') + '</p>';
    if (pages > 1) h += '<button class="btn ghost" type="button" data-all>' + (all ? 'Show pages of ' + size : 'Show all ' + hits.length + ' on one page') + '</button>';
    pager.innerHTML = h;
  }
  if (pager) pager.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return; var o = parse();
    if (b.hasAttribute('data-all')) { if (o.all) delete o.all; else { o.all = '1'; delete o.pg; } }
    else { o.pg = b.getAttribute('data-pg'); }
    location.hash = href(o); d.getElementById('all').scrollIntoView();
  });
  d.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-lens]'); if (!b) return;
    var o = { view: view }, q = b.getAttribute('data-lens');
    if (q) q.split('&').forEach(function (kv) { var i = kv.indexOf('='); o[kv.slice(0, i)] = kv.slice(i + 1); });
    [].forEach.call(d.querySelectorAll('.chips [data-lens]'), function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
    if (grid) { location.hash = href(o); render.done = false; }
    else filterList(o);
  });
  var input = d.querySelector('[data-q]');
  if (input) input.addEventListener('input', function () { var o = parse(); o.q = input.value; delete o.pg; if (grid) history.replaceState(null, '', href(o)), render(); else filterList(o); });
  /* Atlas and Guidebook: lenses set hidden on rows, never remove them */
  function filterList(o) {
    var rows = d.querySelectorAll('.ar, .ge'), n = 0;
    [].forEach.call(rows, function (el) { var ok = match(el, o); el.hidden = !ok; if (ok) n++; });
    var c = d.querySelector('[data-cleo-count] b'); if (c) c.textContent = n === rows.length ? 'All ' + n + ' places' : n + ' of all ' + rows.length + ' places';
  }
  if (grid) { addEventListener('hashchange', render); render(); }
  else if (LENS.some(function (k) { return parse()[k]; })) filterList(parse());

  /* ---- Atlas tray detents: peek → half → full ---- */
  var grab = d.querySelector('[data-grab]');
  if (grab) grab.addEventListener('click', function () {
    var t = grab.parentNode, s = t.getAttribute('data-detent');
    t.setAttribute('data-detent', s === 'peek' ? 'half' : s === 'half' ? 'full' : 'peek');
  });
})();
