/* Cleo beta — recognition.js (FE-C, W9-1). Draws each card's recognition badges from its own attributes, which the build
 * writes from platform's data only (lib/render/recognition-ui.js: data-rec / data-rec0 kinds, data-ra / data-rv source
 * ids). One link per award or creator-video source (#src=<id>, named as the card's own "Recommended by" chip names it) and
 * "Cited by n sources" (n = the card's named publishers, platform's rec.cited) linking to the detail, where every source
 * is listed. A closed place's row is hidden on the card (CSS) and labelled "Before it closed" for its detail (sheet.js FE-C
 * hook copies it). The Gallery row cards, the Guidebook entries and the Atlas map preview get the same row from the place's
 * own card (never the page dataset: first-screen weight). Loaded on pages that have recognised places (city.js FE-C hook); nothing here is inferred. */
(function () {
  'use strict';
  var Cleo = window.Cleo || {}, d = document;
  if (Cleo.recog) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var words = function (el, a) { return (el.getAttribute(a) || '').split(' ').filter(Boolean); };
  function row(c) {
    var closed = c.hasAttribute('data-rec0'), k = words(c, closed ? 'data-rec0' : 'data-rec'); if (!k.length) return '';
    var id = c.id.replace(/^p-/, ''), out = [];
    var name = function (s) { var b = c.querySelector('.pl-s button.src[data-src="' + s + '"]'); return b ? b.textContent.trim() : s; };
    words(c, 'data-ra').forEach(function (s) { out.push('<a class="rb rb-award" href="#src=' + esc(s) + '">' + esc(Cleo.t('rec.award', 'Award · {src}', { src: name(s) })) + '</a>'); });
    words(c, 'data-rv').forEach(function (s) { out.push('<a class="rb rb-video" href="#src=' + esc(s) + '">' + esc(Cleo.t('rec.video', 'Creator video · {src}', { src: name(s) })) + '</a>'); });
    if (k.indexOf('cited') >= 0) out.push('<a class="rb rb-cited" href="#p=' + encodeURIComponent(id) + '">' + esc(Cleo.t('rec.cited', 'Cited by {n} sources', { n: words(c, 'data-src').filter(function (s) { return s !== 'guide'; }).length })) + '</a>');
    return closed ? '<p class="pl-rec closed"><span class="lbl">' + esc(Cleo.t('rec.before', 'Before it closed:')) + '</span> ' + out.join(' ') + '</p>'
      : '<p class="pl-rec"><span class="vh">' + esc(Cleo.t('rec.label', 'Recognition')) + '</span> ' + out.join(' ') + '</p>';
  }
  function paint(cards) {
    [].forEach.call(cards, function (c) {
      if (!c.matches || !c.matches('li.pl[data-rec], li.pl[data-rec0]')) return;
      var old = c.querySelector(':scope > .pl-rec'), h = row(c); if (old) old.remove(); if (h) c.insertAdjacentHTML('beforeend', h);
    });
  }
  // Gallery row cards (li.gc), Guidebook entries (li.ge) and the Atlas map preview get the same badges as the place's own
  // card, read from that card's attributes (stamped, or its Cleo.defer.peek() stub): the first screen never fetches the
  // page dataset for them (beta:qa:w8p, Tokyo phone first load). A Gallery card / preview is one link, so its badges are
  // text; a Guidebook entry's badges are links. A closed place carries none here.
  var NM = null;
  function names() {   // source id -> the name its "Recommended by" chip shows, from the page's chips (stamped or deferred)
    if (NM) return NM; NM = {};
    var re = /<button type="button" class="src[^"]*" data-src="([^"]+)">([^<]*)</g, m, put = function (s, t) { if (!NM[s] && t) NM[s] = t.replace(/&amp;/g, '&').trim(); };
    [].forEach.call(d.querySelectorAll('button.src[data-src]'), function (b) { put(b.getAttribute('data-src'), b.textContent); });
    [].forEach.call(d.querySelectorAll('noscript, template'), function (ns) { var s = ns.children && ns.children.length ? ns.innerHTML : ns.textContent; while ((m = re.exec(s))) put(m[1], m[2]); });
    return NM;
  }
  var STUB = null;
  function card(pid) {
    var c = d.getElementById('p-' + pid); if (c && c.matches('li.pl')) return c;
    if (!STUB) { STUB = {}; ((Cleo.defer && Cleo.defer.peek && Cleo.defer.peek()) || []).forEach(function (s) { STUB[String(s.id).replace(/^p-/, '')] = s; }); }
    return STUB[pid] || null;
  }
  function badges(c, links) {
    var k = c && words(c, 'data-rec'); if (!k || !k.length) return '';   // data-rec0 (closed): none here
    var nm = names(), out = [], one = function (cls, href, text) { out.push(links ? '<a class="rb ' + cls + '" href="' + esc(href) + '">' + esc(text) + '</a>' : '<span class="rb ' + cls + '">' + esc(text) + '</span>'); };
    words(c, 'data-ra').forEach(function (s) { one('rb-award', '#src=' + s, Cleo.t('rec.award', 'Award · {src}', { src: nm[s] || s })); });
    words(c, 'data-rv').forEach(function (s) { one('rb-video', '#src=' + s, Cleo.t('rec.video', 'Creator video · {src}', { src: nm[s] || s })); });
    if (k.indexOf('cited') >= 0) { var id = String(c.id || '').replace(/^p-/, '');
      one('rb-cited', '#p=' + encodeURIComponent(id), Cleo.t('rec.cited', 'Cited by {n} sources', { n: words(c, 'data-src').filter(function (s) { return s !== 'guide'; }).length })); }
    return out.join(' ');
  }
  function paintViews() {
    var todo = [].filter.call(d.querySelectorAll('li.gc[data-id], li.ge[data-id], a.ms-pv'), function (el) { return !el.hasAttribute('data-rec-done'); });
    if (!todo.length) return;
    STUB = null;   // chunks may have been stamped since: re-read
    todo.forEach(function (el) {
      el.setAttribute('data-rec-done', '');
      var pv = el.matches('a.ms-pv'), pid = pv ? decodeURIComponent((/[#&]p=([^&]+)/.exec(el.getAttribute('href') || '') || [])[1] || '') : el.getAttribute('data-id');
      var isGc = el.matches('li.gc') || pv, h = badges(card(pid), !isGc); if (!h) return;
      var row = '<' + (isGc ? 'span' : 'p') + ' class="pl-rec ' + (isGc ? 'gc-rec' : 'ge-rec') + '"><span class="vh">' + esc(Cleo.t('rec.label', 'Recognition')) + '</span> ' + h + '</' + (isGc ? 'span' : 'p') + '>';
      var at = pv ? el.querySelector('.ms-pv-b') : isGc ? el.querySelector('.gc-b') : el.querySelector('.ge-m');
      if (isGc) (at || el).insertAdjacentHTML('beforeend', row); else if (at) at.insertAdjacentHTML('afterend', row); else el.insertAdjacentHTML('beforeend', row);
    });
  }
  var raf = 0, later = function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; paintViews(); }); };
  if ('MutationObserver' in window) new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++) { var n = ms[i].addedNodes[j];
      if (n.nodeType === 1 && (n.matches('li.gc, li.ge, a.ms-pv') || n.querySelector('li.gc, li.ge, a.ms-pv'))) { later(); return; } }
  }).observe(d.body, { childList: true, subtree: true });   // body: the Atlas preview (#cleo-poi) sits outside #main
  // QC-23: the detail always carries the row, a closed place's "Before it closed" one included. sheet.js copies the card's row
  // when it is drawn; on a deep link the sheet can open before this module has painted, so city.js's onSheet hook calls this
  // and the row goes in before the share fact. A closed card's row is hidden by CSS on the card (.pl > .pl-rec.closed), not by
  // a hidden attribute, so the copy is visible in the detail.
  function sheet(c, ico) {
    var sh = d.querySelector('#cleo-sheet .sheet'); if (!sh || !c || sh.querySelector('.fact .pl-rec')) return;
    var share = sh.querySelector('[data-cleo-card="place"]'); if (share && 'p-' + share.getAttribute('data-id') !== c.id) return;   // another place's sheet
    if (!c.querySelector(':scope > .pl-rec')) paint([c]);
    var r = c.querySelector(':scope > .pl-rec'); if (!r) return;
    var html = '<div class="fact">' + (ico || '') + '<div>' + r.outerHTML + '</div></div>', at = share && share.closest('.fact');
    if (at) at.insertAdjacentHTML('beforebegin', html); else (sh.querySelector('.content') || sh).insertAdjacentHTML('beforeend', html);
  }
  Cleo.recog = { paint: paint, row: row, views: paintViews, sheet: sheet };
  paintViews();
  paint(d.querySelectorAll('li.pl[data-rec], li.pl[data-rec0]'));
  d.addEventListener('cleo:stamped', function (e) { paint((e.detail && e.detail.cards) || []); });            // later chunks (core defer)
  d.addEventListener('cleo:locale', function () {   // i18n: redraw in the catalogue
    paint(d.querySelectorAll('li.pl[data-rec], li.pl[data-rec0]'));
    [].forEach.call(d.querySelectorAll('[data-rec-done]'), function (el) { el.removeAttribute('data-rec-done'); var r = el.querySelector('.gc-rec, .ge-rec'); if (r) r.remove(); }); paintViews();
  });   // i18n: redraw in the catalogue
  if (Cleo.need && Cleo.need.done) Cleo.need.done('recognition');
})();
