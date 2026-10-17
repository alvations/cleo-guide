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
  // i18n D-41: interface strings from the catalogue (Cleo.t, head snippet); the English here equals en.json (test-i18n).
  // Values are escaped before they are filled in, so the English output is unchanged.
  var tt = function (k, e, v) { return Cleo.t ? Cleo.t(k, e, v) : v ? e.replace(/\{([a-z]+)\}/g, function (m, n) { return n in v ? v[n] : m; }) : e; };
  // i18n D-41: what was drawn is drawn again in the loaded catalogue (cleo:locale), e.g. the landing's ?q= results
  var drawn = [];
  var redraw = function (el, fn) { drawn = drawn.filter(function (d) { return d.el !== el && d.el.isConnected; }); drawn.push({ el: el, fn: fn }); };
  document.addEventListener('cleo:locale', function () { drawn.slice().forEach(function (d) { if (d.el.isConnected) d.fn(); }); });

  function total(data) { return data.items.length.toLocaleString('en-US'); }

  /** Render all matches for q into el, grouped by guide in best-match order. Returns the hit count. */
  Cleo.renderHits = function (el, data, q, onClear) {
    redraw(el, function () { Cleo.renderHits(el, data, q, onClear); });
    var hits = Cleo.search(data, q), groups = [], by = {};
    hits.forEach(function (h) { var k = h.it[0]; if (!by[k]) { by[k] = { pg: h.pg, hits: [] }; groups.push(by[k]); } by[k].hits.push(h); });
    var gq = Cleo.fold ? Cleo.fold(q).split(/\s+/).filter(Boolean) : [];
    var guides = gq.length ? data.pages.filter(function (pg) { var h = Cleo.fold(pg[1] + ' ' + pg[3]); return gq.every(function (t) { return h.indexOf(t) >= 0; }); }) : [];
    var gHtml = guides.length ? '<section class="grp guides"><h3>' + (guides.length === 1 ? tt('srch.guide.one', 'Guide') : tt('srch.guides', '{n} guides', { n: guides.length })) + '</h3><ol>' +
      guides.slice(0, 12).map(function (pg) { return '<li><a class="pill" href="' + esc((Cleo.root || '') + pg[2]) + '">' + esc(pg[1]) + '</a></li>'; }).join('') + '</ol></section>' : '';
    if (!hits.length && guides.length) {
      el.innerHTML = '<h2 class="d3">' + (guides.length === 1 ? tt('srch.guides.for.one', '1 guide for “{q}”', { q: esc(q) }) : tt('srch.guides.for', '{n} guides for “{q}”', { n: guides.length, q: esc(q) })) + '</h2>' + gHtml;
    } else if (!hits.length) {
      el.innerHTML = '<div class="state" data-cleo-state="no-results"><h3>' + tt('city.empty.q', 'No places match “{q}”.', { q: esc(q) }) + '</h3>' +
        '<p>' + tt('srch.none.p', 'Search looks at place names, areas and guide names across all {n} places. Try a city, a neighbourhood or a dish.', { n: total(data) }) + '</p>' +
        '<button type="button" class="btn btn-ghost" data-cleo-clear>' + tt('srch.clear', 'Clear search · see all {n} places', { n: total(data) }) + '</button></div>';
    } else {
      el.innerHTML = '<h2 class="d3">' + (hits.length === 1 ? tt('srch.hits.one', '1 place for “{q}”', { q: esc(q) }) : tt('srch.hits', '{n} places for “{q}”', { n: hits.length, q: esc(q) })) +
        ' <span class="sm muted">' + (groups.length === 1 ? tt('srch.in.one', 'in 1 guide') : tt('srch.in', 'in {n} guides', { n: groups.length })) + '</span></h2>' +
        gHtml +
        groups.map(function (g, gi) {
          return '<section class="grp"><h3>' + esc(g.pg[1]) + ' <span class="sm muted">' + g.hits.length + '</span></h3><ol>' +
            g.hits.map(function (h, i) {
              var it = h.it, href = (Cleo.root || '') + g.pg[2] + (g.pg[4] ? '#p=' + encodeURIComponent(it[1]) : '');
              return '<li' + (i >= FOLD ? ' hidden' : '') + '><a href="' + esc(href) + '"><span>' + esc(it[2]) + '</span><span class="meta">' +
                esc(it[3] === 'f' ? tt('city.mode.food', 'Eat & drink') : tt('srch.sight', 'Sight')) + (it[6] ? ' · ' + esc(it[6]) : '') + (it[5] ? ' · ' + tt('srch.closed', 'Closed, kept for the record') : '') + '</span></a></li>';
            }).join('') + '</ol>' +
            (g.hits.length > FOLD ? '<button type="button" class="btn btn-quiet" data-cleo-more="' + gi + '">' + tt('srch.more', 'Show all {n} in {guide}', { n: g.hits.length, guide: esc(g.pg[1]) }) + '</button>' : '') +
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
    redraw(el, function () { Cleo.indexFailed(el); });
    el.innerHTML = '<div class="state" data-cleo-state="index-failed"><h3>' + tt('srch.fail.h', 'Search couldn’t load.') + '</h3>' +
      '<p>' + tt('srch.fail.p', 'It needs the site index, which isn’t reachable right now. Every guide is still listed and every page works.') + '</p></div>';
  };

  /* ---- W9-6 paste a link: a source URL opens the places that source recommends. The URL is only PARSED (its host),
   * never fetched; the lookup is the guides' own index (data/source-hosts.json, loaded lazily on the first pasted link). */
  /** The host of q when q is a link or a bare domain ("https://www.timeout.com/tokyo", "timeout.com"), else null. */
  // W9-6 paste a link: a URL is normalised (host without www. + path; no query, no hash, no trailing slash / index.html),
  // exactly as tools/beta/build.js keys data/source-hosts.json and data/source-urls/<bucket>.json. Only the address is read.
  var urlParts = function (q) {
    var s = String(q || '').trim();
    if (/\s/.test(s) || !/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?([/?#]\S*)?$/i.test(s)) return null;
    try { var x = new URL(/^https?:\/\//i.test(s) ? s : 'https://' + s), h = x.hostname.toLowerCase().replace(/^www\./, '');
      return { host: h, key: h + x.pathname.replace(/\/index\.html?$/i, '/').replace(/\/+$/, '') }; } catch (e) { return null; }
  };
  Cleo.urlHost = function (q) { var u = urlParts(q); return u ? u.host : null; };
  Cleo.urlKey = function (q) { var u = urlParts(q); return u ? u.key : null; };
  var bucket = function (h) { var v = 5381; for (var i = 0; i < h.length; i++) v = ((v * 33) ^ h.charCodeAt(i)) >>> 0; return v % 32; };
  var getJson = function (rel) { return window.fetch ? fetch((Cleo.root || '') + rel).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }) : Promise.reject(new Error('no fetch')); };
  var hidx = null, uidx = {};
  Cleo.hostIndex = function () {
    if (hidx) return hidx;
    hidx = getJson('data/source-hosts.json'); hidx.catch(function () { hidx = null; });
    return hidx;
  };
  // the exact-page shard for a host: loaded only when a link from that host is pasted; offline it is simply absent
  Cleo.urlIndex = function (host) {
    var b = bucket(host); if (uidx[b]) return uidx[b];
    uidx[b] = getJson('data/source-urls/' + b + '.json').catch(function () { delete uidx[b]; return null; });
    return uidx[b];
  };
  var SUGGEST = 'https://github.com/alvations/cleo-guide/issues/new?labels=source-suggestion';
  Cleo.renderSource = function (el, idx, host, exact, url) {
    redraw(el, function () { Cleo.renderSource(el, idx, host, exact, url); });
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
    // a specific page: the places citing exactly that URL come first
    if (exact && exact.length) {
      out += '<section class="grp" data-cleo-source-url><h2 class="d3">' + tt('srch.src.page', 'Recommended on this page') + ' <span class="sm muted">' + plural(exact.length, 'place') + '</span></h2><ol>' +
        exact.map(function (r) { return '<li><a href="' + esc((Cleo.root || '') + r[0] + '#p=' + encodeURIComponent(r[2])) + '"><span>' + esc(r[3]) + '</span><span class="meta">' + esc(r[1]) + ' · ' + esc(r[5]) + '</span></a></li>'; }).join('') + '</ol></section>';
    }
    // the source's view (VOICE.md rule 5): "Everything <source> recommends, in N guides" — one per publisher on that site
    if (rows) {
      var by = {}, order = [];
      rows.forEach(function (r) { if (!by[r[3]]) { by[r[3]] = []; order.push(r[3]); } by[r[3]].push(r); });
      order.forEach(function (name) {
        var g = by[name], n = g.reduce(function (t, r) { return t + r[4]; }, 0); total += n;
        out += '<section class="grp"><h2 class="d3" data-cleo-source="' + esc(h) + '">' + tt('srch.src.all', 'Everything {source} recommends, in {guides}', { source: esc(name), guides: plural(g.length, 'guide') }) +
          ' <span class="sm muted">' + plural(n, 'place') + '</span></h2><ol>' + g.map(function (r) {
            return '<li><a href="' + esc((Cleo.root || '') + r[0] + '#src=' + encodeURIComponent(r[2])) + '"><span>' + esc(r[1]) + '</span><span class="meta">' + plural(r[4], 'place') + '</span></a></li>';
          }).join('') + '</ol></section>';
      });
    }
    el.innerHTML = out + note;
    return total || exact.length;
  };
  /** One entry point for a query: a pasted link → its source's places; anything else → the place search. */
  Cleo.query = function (el, q, onClear) {
    var host = Cleo.urlHost(q);
    if (host) { var key = Cleo.urlKey(q); return Promise.all([Cleo.hostIndex(), Cleo.urlIndex(host)]).then(function (x) { return Cleo.renderSource(el, x[0], host, x[1] && x[1].urls && x[1].urls[key], q); }); }
    return Cleo.searchIndex().then(function (data) { return Cleo.renderHits(el, data, q, onClear); });
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
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { say(tt('srch.copied', 'Link copied')); }, function () { say(url); });
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
      panel.setAttribute('aria-label', tt('shell.search', 'Search all guides'));
      panel.innerHTML = '<div class="wrap"><form class="search compact" role="search" data-cleo-panel-form>' +
        '<label class="vh" for="cleo-pq">' + tt('shell.search', 'Search all guides') + '</label>' +
        '<input id="cleo-pq" type="search" placeholder="' + esc(tt('land.search.ph', 'A city, a dish, a shrine…')) + '" autocomplete="off" enterkeyhint="search">' +
        '<button type="button" class="btn btn-icon btn-quiet" data-cleo-panel-close aria-label="' + esc(tt('srch.close', 'Close search')) + '"><svg class="ico" width="20" height="20" aria-hidden="true"><use href="#i-close"/></svg></button>' +
        '</form><div class="results" aria-live="polite"></div></div>';
      var bar = document.querySelector('[data-cleo-shell="topbar"]');
      (bar && bar.parentNode ? bar.parentNode : document.body).insertBefore(panel, bar ? bar.nextSibling : null);
      var input = panel.querySelector('input'), out = panel.querySelector('.results'), t;
      var run = function () {
        var q = input.value.trim();
        if (!q) { out.innerHTML = ''; return; }
        if (Cleo.urlHost(q)) { Cleo.hostIndex().then(function (idx) { if (input.value.trim() === q) Cleo.renderSource(out, idx, Cleo.urlHost(q)); }, function () { Cleo.indexFailed(out); }); return; }
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

  // §v2.12 3a (one search per screen): the page's own field is the search when it has one — the landing's hero, a city's
  // field (FE-A #cleo-filter) — else the site-wide panel
  // (under html.ov-c the city bar comes back by FE-A's .cbar:focus-within, so focusing the field is enough)
  var field = function () { return document.getElementById('cleo-q') || document.getElementById('cleo-filter'); };
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-cleo-search-open]') : null;
    if (!a) return;
    var hero = field();
    e.preventDefault();
    if (hero) { hero.focus(); if (hero.scrollIntoView) hero.scrollIntoView({ block: 'center' }); return; }
    if (panel && !panel.hidden) close(); else open(a);
  });
  document.addEventListener('keydown', function (e) {
    // "/" opens search from anywhere that isn't a text field (desktop convenience).
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    var hero = field();
    e.preventDefault();
    if (hero) hero.focus(); else open(document.activeElement);
  });
  // …and its last row is "Search all guides for “q”" — allguides.js, loaded on the city field's first focus (not eager)
  var cf = document.getElementById('cleo-filter');   // Cleo.need: core.js, on every page
  if (cf) cf.addEventListener('focus', function () { Cleo.need('allguides'); }, { once: true });
})();
