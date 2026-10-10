/* generated copy of tools/beta/client/search.js — do not edit here */
/* Cleo beta — search.js (lane FE-B). Site-wide search UI over beta/data/search.json (M2-09 scaffold, live in M1).
 * - Cleo.renderHits(el, data, q): results grouped by guide, every match reachable (groups fold at 8 with
 *   "Show all N"), the VOICE.md empty state when nothing matches.
 * - The top bar's search button opens a search panel on any page (on the landing it focuses the hero search).
 * The index loads lazily, on first use — never on first paint. Without JS the button is a plain link to the
 * landing's search form, which also works as a GET form (?q=). */
(function () {
  'use strict';
  var Cleo = window.Cleo = window.Cleo || {};
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var FOLD = 8;

  function total(data) { return data.items.length.toLocaleString('en-US'); }

  /** Render all matches for q into el, grouped by guide in best-match order. Returns the hit count. */
  Cleo.renderHits = function (el, data, q, onClear) {
    var hits = Cleo.search(data, q), groups = [], by = {};
    hits.forEach(function (h) { var k = h.it[0]; if (!by[k]) { by[k] = { pg: h.pg, hits: [] }; groups.push(by[k]); } by[k].hits.push(h); });
    var gq = Cleo.fold ? Cleo.fold(q).split(/\s+/).filter(Boolean) : [];
    var guides = gq.length ? data.pages.filter(function (pg) { var h = Cleo.fold(pg[1] + ' ' + pg[3]); return gq.every(function (t) { return h.indexOf(t) >= 0; }); }) : [];
    var gHtml = guides.length ? '<section class="grp guides"><h3>' + (guides.length === 1 ? 'Guide' : guides.length + ' guides') + '</h3><ol>' +
      guides.slice(0, 12).map(function (pg) { return '<li><a class="pill" href="' + esc((Cleo.root || '') + pg[2]) + '">' + esc(pg[1]) + '</a></li>'; }).join('') + '</ol></section>' : '';
    if (!hits.length && guides.length) {
      el.innerHTML = '<h2 class="d3">' + guides.length + ' ' + (guides.length === 1 ? 'guide' : 'guides') + ' for “' + esc(q) + '”</h2>' + gHtml;
    } else if (!hits.length) {
      el.innerHTML = '<div class="state" data-cleo-state="no-results"><h3>No places match “' + esc(q) + '”.</h3>' +
        '<p>Search looks at place names, areas and guide names across all ' + total(data) + ' places. Try a city, a neighbourhood or a dish.</p>' +
        '<button type="button" class="btn btn-ghost" data-cleo-clear>Clear search · see all ' + total(data) + ' places</button></div>';
    } else {
      el.innerHTML = '<h2 class="d3">' + hits.length + ' ' + (hits.length === 1 ? 'place' : 'places') + ' for “' + esc(q) + '”' +
        ' <span class="sm muted">in ' + groups.length + ' ' + (groups.length === 1 ? 'guide' : 'guides') + '</span></h2>' +
        gHtml +
        groups.map(function (g, gi) {
          return '<section class="grp"><h3>' + esc(g.pg[1]) + ' <span class="sm muted">' + g.hits.length + '</span></h3><ol>' +
            g.hits.map(function (h, i) {
              var it = h.it, href = (Cleo.root || '') + g.pg[2] + (g.pg[4] ? '#p=' + encodeURIComponent(it[1]) : '');
              return '<li' + (i >= FOLD ? ' hidden' : '') + '><a href="' + esc(href) + '"><span>' + esc(it[2]) + '</span><span class="meta">' +
                (it[3] === 'f' ? 'Eat &amp; drink' : 'Sight') + (it[6] ? ' · ' + esc(it[6]) : '') + (it[5] ? ' · Closed, kept for the record' : '') + '</span></a></li>';
            }).join('') + '</ol>' +
            (g.hits.length > FOLD ? '<button type="button" class="btn btn-quiet" data-cleo-more="' + gi + '">Show all ' + g.hits.length + ' in ' + esc(g.pg[1]) + '</button>' : '') +
            '</section>';
        }).join('');
    }
    var more = el.querySelectorAll('[data-cleo-more]');
    Array.prototype.forEach.call(more, function (b) {
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(b.parentNode.querySelectorAll('li[hidden]'), function (li) { li.hidden = false; });
        b.parentNode.removeChild(b);
      });
    });
    var clr = el.querySelector('[data-cleo-clear]');
    if (clr && onClear) clr.addEventListener('click', onClear);
    return hits.length;
  };

  Cleo.indexFailed = function (el) {
    el.innerHTML = '<div class="state" data-cleo-state="index-failed"><h3>Search couldn’t load.</h3>' +
      '<p>It needs the site index, which isn’t reachable right now. Every guide is still listed and every page works.</p></div>';
  };

  /** Arrow keys move through result links; ArrowDown from the input enters the list, Escape/ArrowUp at the top returns. */
  Cleo.kbNav = function (input, out) {
    var links = function () { return Array.prototype.filter.call(out.querySelectorAll('a[href], button'), function (a) { return !a.closest('[hidden]'); }); };
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { var l = links(); if (l.length) { e.preventDefault(); l[0].focus(); } }
    });
    out.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Escape') return;
      var l = links(), i = l.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      if (e.key === 'Escape' || (e.key === 'ArrowUp' && i === 0)) { if (e.key === 'Escape') e.stopPropagation(); input.focus(); return; }
      var n = l[e.key === 'ArrowDown' ? Math.min(l.length - 1, i + 1) : i - 1];
      if (n) n.focus();
    });
  };

  /* ---- share (hubs, landing): Web Share where available, else copy the link with a visible "Link copied" ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-cleo-share]'), function (b) { b.hidden = false; });
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-cleo-share]') : null;
    if (!b) return;
    var url = b.getAttribute('data-url') || location.href, title = b.getAttribute('data-title') || document.title;
    var note = b.parentNode && b.parentNode.querySelector('[data-cleo-share-note]');
    var say = function (t) { if (note) note.textContent = t; };
    if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { say('Link copied'); }, function () { say(url); });
    else say(url);
  });

  /* ---- the top bar's search panel ---- */
  var panel = null, lastFocus = null;
  function close() {
    if (!panel) return;
    panel.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function open(trigger) {
    lastFocus = trigger;
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'searchpanel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Search every place');
      panel.innerHTML = '<div class="wrap"><form class="search compact" role="search" data-cleo-panel-form>' +
        '<label class="vh" for="cleo-pq">Search every place</label>' +
        '<input id="cleo-pq" type="search" placeholder="A city, a dish, a shrine…" autocomplete="off" enterkeyhint="search">' +
        '<button type="button" class="btn btn-icon btn-quiet" data-cleo-panel-close aria-label="Close search"><svg class="ico" width="20" height="20" aria-hidden="true"><use href="#i-close"/></svg></button>' +
        '</form><div class="results" aria-live="polite"></div></div>';
      var bar = document.querySelector('[data-cleo-shell="topbar"]');
      (bar && bar.parentNode ? bar.parentNode : document.body).insertBefore(panel, bar ? bar.nextSibling : null);
      var input = panel.querySelector('input'), out = panel.querySelector('.results'), t;
      var run = function () {
        var q = input.value.trim();
        if (!q) { out.innerHTML = ''; return; }
        Cleo.searchIndex().then(function (data) { if (input.value.trim() === q) Cleo.renderHits(out, data, q, function () { input.value = ''; out.innerHTML = ''; input.focus(); }); },
          function () { Cleo.indexFailed(out); });
      };
      input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(run, 120); });
      Cleo.kbNav(input, out);
      panel.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); run(); });
      panel.querySelector('[data-cleo-panel-close]').addEventListener('click', close);
      panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); close(); } });
    }
    panel.hidden = false;
    panel.querySelector('input').focus();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-cleo-search-open]') : null;
    if (!a) return;
    var hero = document.getElementById('cleo-q');
    e.preventDefault();
    if (hero) { hero.focus(); if (hero.scrollIntoView) hero.scrollIntoView({ block: 'center' }); return; }
    if (panel && !panel.hidden) close(); else open(a);
  });
  document.addEventListener('keydown', function (e) {
    // "/" opens search from anywhere that isn't a text field (desktop convenience).
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    var hero = document.getElementById('cleo-q');
    e.preventDefault();
    if (hero) hero.focus(); else open(document.activeElement);
  });
})();
