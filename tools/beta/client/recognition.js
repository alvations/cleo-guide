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
  Cleo.recog = { paint: paint, row: row };
  paint(d.querySelectorAll('li.pl[data-rec], li.pl[data-rec0]'));
  d.addEventListener('cleo:stamped', function (e) { paint((e.detail && e.detail.cards) || []); });            // later chunks (core defer)
  d.addEventListener('cleo:locale', function () { paint(d.querySelectorAll('li.pl[data-rec], li.pl[data-rec0]')); });   // i18n: redraw in the catalogue
  if (Cleo.need && Cleo.need.done) Cleo.need.done('recognition');
})();
