/* Cleo beta — recognition.js (FE-C, W9-1). Draws each card's recognition badges from its own attributes, which the build
 * writes from platform's data only (lib/render/recognition-ui.js: data-rec / data-rec0 kinds, data-ra / data-rv source
 * ids). One link per award or creator-video source (#src=<id>, named as the card's own "Recommended by" chip names it) and
 * "Cited by n sources" (n = the card's named publishers, platform's rec.cited) linking to the detail, where every source
 * is listed. A closed place's row is hidden on the card and labelled "Before it closed" for its detail (sheet.js FE-C
 * hook copies it). Loaded on pages that have recognised places (city.js FE-C hook); nothing here is inferred. */
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
    return closed ? '<p class="pl-rec closed" hidden><span class="lbl">' + esc(Cleo.t('rec.before', 'Before it closed:')) + '</span> ' + out.join(' ') + '</p>'
      : '<p class="pl-rec"><span class="vh">' + esc(Cleo.t('rec.label', 'Recognition')) + '</span> ' + out.join(' ') + '</p>';
  }
  function paint(cards) {
    [].forEach.call(cards, function (c) {
      if (!c.matches || !c.matches('li.pl[data-rec], li.pl[data-rec0]')) return;
      var old = c.querySelector(':scope > .pl-rec'), h = row(c); if (old) old.remove(); if (h) c.insertAdjacentHTML('beforeend', h);
    });
  }
  // Gallery row cards (li.gc) and Guidebook entries (li.ge) are drawn in the browser from the page dataset, so their badges
  // come from the same dataset (platform's rec, the source index's names), never from markup. A Gallery card is one link
  // (to the detail), so its badges are text; a Guidebook entry's badges are links. A closed place carries none here.
  var key = (d.getElementById('main') || { getAttribute: function () { return ''; } }).getAttribute('data-city') || '', PD = null;
  var pd = function () { return PD || (PD = Cleo.pageData && key ? Cleo.pageData(key).then(function (j) {
    var by = {}, nm = {}; (j.places || []).forEach(function (p) { by[p.id] = p; }); (j.sourceIndex || []).forEach(function (x) { nm[x.id] = String(x.name || x.id).split(' · ')[0]; });
    return { by: by, nm: nm }; }) : Promise.reject(new Error('no page data'))); };
  function badges(p, nm, links) {
    var rec = p && !p.closed && p.rec; if (!rec) return '';
    var out = [], one = function (cls, href, text) { out.push(links ? '<a class="rb ' + cls + '" href="' + esc(href) + '">' + esc(text) + '</a>' : '<span class="rb ' + cls + '">' + esc(text) + '</span>'); };
    (rec.award || []).forEach(function (s) { one('rb-award', '#src=' + s, Cleo.t('rec.award', 'Award · {src}', { src: nm[s] || s })); });
    (rec.video || []).forEach(function (s) { one('rb-video', '#src=' + s, Cleo.t('rec.video', 'Creator video · {src}', { src: nm[s] || s })); });
    if (rec.cited >= 3) one('rb-cited', '#p=' + encodeURIComponent(p.id), Cleo.t('rec.cited', 'Cited by {n} sources', { n: rec.cited }));
    return out.join(' ');
  }
  function paintViews() {
    var todo = [].filter.call(d.querySelectorAll('li.gc[data-id], li.ge[data-id]'), function (el) { return !el.hasAttribute('data-rec-done'); });
    if (!todo.length) return;
    pd().then(function (D) {
      todo.forEach(function (el) {
        if (el.hasAttribute('data-rec-done')) return; el.setAttribute('data-rec-done', '');
        var isGc = el.matches('li.gc'), h = badges(D.by[el.getAttribute('data-id')], D.nm, !isGc); if (!h) return;
        var row = '<' + (isGc ? 'span' : 'p') + ' class="pl-rec ' + (isGc ? 'gc-rec' : 'ge-rec') + '"><span class="vh">' + esc(Cleo.t('rec.label', 'Recognition')) + '</span> ' + h + '</' + (isGc ? 'span' : 'p') + '>';
        var at = isGc ? el.querySelector('.gc-b') : el.querySelector('.ge-m');
        if (isGc) (at || el).insertAdjacentHTML('beforeend', row); else if (at) at.insertAdjacentHTML('afterend', row); else el.insertAdjacentHTML('beforeend', row);
      });
    }, function () {});
  }
  var raf = 0, later = function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; paintViews(); }); };
  if ('MutationObserver' in window && d.getElementById('main')) new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++) { var n = ms[i].addedNodes[j];
      if (n.nodeType === 1 && (n.matches('li.gc, li.ge') || n.querySelector('li.gc, li.ge'))) { later(); return; } }
  }).observe(d.getElementById('main'), { childList: true, subtree: true });
  Cleo.recog = { paint: paint, row: row, views: paintViews };
  paintViews();
  paint(d.querySelectorAll('li.pl[data-rec], li.pl[data-rec0]'));
  d.addEventListener('cleo:stamped', function (e) { paint((e.detail && e.detail.cards) || []); });            // later chunks (core defer)
  d.addEventListener('cleo:locale', function () {   // i18n: redraw in the catalogue
    paint(d.querySelectorAll('li.pl[data-rec], li.pl[data-rec0]'));
    [].forEach.call(d.querySelectorAll('[data-rec-done]'), function (el) { el.removeAttribute('data-rec-done'); var r = el.querySelector('.gc-rec, .ge-rec'); if (r) r.remove(); }); paintViews();
  });   // i18n: redraw in the catalogue
  if (Cleo.need && Cleo.need.done) Cleo.need.done('recognition');
})();
