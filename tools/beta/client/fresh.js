/* Cleo beta — fresh.js (FE-C, W9-2 "Freshness everywhere", card half; QC-04 "Approximate pin"). A quiet "Status checked <d Mon>" line on each
 * place card, from the card's own data-checked (the build writes it from the record's pv.checked; nothing is inferred).
 * The date only, never "open now" or hours. Real text (find-in-page, screen readers, copy all read it) marked data-nosearch,
 * so the search skips it (Cleo.lens.text and city.js's typed search, platform f03b03cf): "oct" never matches every card.
 * Loaded lazily on every city page (city.js FE-C hook). */
(function () {
  'use strict';
  var Cleo = window.Cleo || {}, d = document;
  if (Cleo.fresh) return;
  var day = function (iso) {   // "2 Oct" (en), "10月2日" (ja): the record's date, read as UTC so it never shifts a day
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ''); if (!m) return '';
    var lang = (d.documentElement.lang || 'en').toLowerCase();
    try { return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).toLocaleDateString(lang.indexOf('en') === 0 ? 'en-GB' : lang, { day: 'numeric', month: 'short', timeZone: 'UTC' }); }
    catch (e) { return m[1] + '-' + m[2] + '-' + m[3]; }
  };
  // QC-04 (D-43): a pin whose placement is graded low (info.prov 'l…', platform's pv.pin) stays on the map but never reads as
  // pinned to the door: its card says "Approximate pin" (real text, so it is announced and findable). The label goes when the
  // pin is upgraded, by itself: it reads the page's provenance, nothing here is stored.
  var prov = function () { return ((Cleo.city && Cleo.city.info) || {}).prov || {}; };
  var low = function (c) { return String(prov()[String(c.id || '').replace(/^p-/, '')] || '').charAt(0) === 'l'; };
  function approx(c) {
    var el = c.querySelector(':scope > .pl-approx');
    if (!low(c)) { if (el) el.remove(); return; }
    if (!el) { el = d.createElement('span'); el.className = 'pl-approx'; c.appendChild(el); }
    el.textContent = Cleo.t('sheet.pin.approx', 'Approximate pin');
  }
  function paint(cards) {
    [].forEach.call(cards, function (c) {
      if (c.matches && c.matches('li.pl[id^="p-"]')) approx(c);
      if (!c.matches || !c.matches('li.pl[data-checked]')) return;
      var iso = c.getAttribute('data-checked'), s = day(iso); if (!s) return;
      var el = c.querySelector(':scope > .pl-chk');
      if (!el) { el = d.createElement('span'); el.className = 'pl-chk'; c.appendChild(el); }
      el.textContent = Cleo.t('sheet.status', 'Status checked {d}', { d: s }); el.setAttribute('data-d', iso); el.setAttribute('data-nosearch', '');
    });
  }
  // W9-2 (a): the Gallery row cards (li.gc) and the Atlas map preview (a.ms-pv) carry the same line, dated from the place's
  // own card (stamped, or its Cleo.defer.peek() stub): no page data is fetched, nothing is sent from the server.
  var STUB = null;
  function card(pid) {
    var c = d.getElementById('p-' + pid); if (c && c.matches('li.pl')) return c;
    if (!STUB) { STUB = {}; ((Cleo.defer && Cleo.defer.peek && Cleo.defer.peek()) || []).forEach(function (s) { STUB[String(s.id).replace(/^p-/, '')] = s; }); }
    return STUB[pid] || null;
  }
  function views(force) {
    STUB = null;
    [].forEach.call(d.querySelectorAll('li.gc[data-id], a.ms-pv'), function (el) {
      if (!force && el.hasAttribute('data-chk-done')) return; el.setAttribute('data-chk-done', '');
      var pv = el.matches('a.ms-pv'), pid = pv ? decodeURIComponent((/[#&]p=([^&]+)/.exec(el.getAttribute('href') || '') || [])[1] || '') : el.getAttribute('data-id');
      var c = card(pid), iso = c && c.getAttribute('data-checked'), s = day(iso), at = pv ? el.querySelector('.ms-pv-b') : el.querySelector('.gc-b');
      var old = el.querySelector('.pl-chk'); if (old) old.remove();
      if (!s) return;
      var x = d.createElement('span'); x.className = 'pl-chk ' + (pv ? 'pv-chk' : 'gc-chk');
      x.textContent = Cleo.t('sheet.status', 'Status checked {d}', { d: s }); x.setAttribute('data-d', iso); x.setAttribute('data-nosearch', '');
      (at || el).appendChild(x);   // inside the one card link: text, not a target (the card says it in its accessible name)
    });
  }
  var raf = 0, later = function () { if (!raf) raf = (window.requestAnimationFrame || setTimeout)(function () { raf = 0; views(); }); };
  if ('MutationObserver' in window) new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++) { var n = ms[i].addedNodes[j];
      if (n.nodeType === 1 && (n.matches('li.gc, a.ms-pv') || n.querySelector('li.gc, a.ms-pv'))) { later(); return; } }
  }).observe(d.body, { childList: true, subtree: true });   // body: the Atlas preview sits outside #main
  views();
  Cleo.fresh = { paint: paint, day: day, low: low, views: views };
  paint(d.querySelectorAll('li.pl[id^="p-"]'));
  d.addEventListener('cleo:stamped', function (e) { paint((e.detail && e.detail.cards) || []); });   // later chunks (core defer)
  d.addEventListener('cleo:locale', function () { paint(d.querySelectorAll('li.pl[id^="p-"]')); views(true); });
  if (Cleo.need && Cleo.need.done) Cleo.need.done('fresh');
})();
