/* Cleo beta — fresh.js (FE-C, W9-2 "Freshness everywhere", card half; QC-04 "Approximate pin"). A quiet "Status checked <d Mon>" line on each
 * place card, from the card's own data-checked (the build writes it from the record's pv.checked; nothing is inferred).
 * The date only, never "open now" or hours. The text rides in a CSS attr() so it stays out of the card's text: a search
 * for "oct" must not match every card (Cleo.lens.text reads textContent). Loaded on every city page (city.js FE-C hook). */
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
      el.setAttribute('data-t', Cleo.t('sheet.status', 'Status checked {d}', { d: s })); el.setAttribute('data-d', iso);
      el.setAttribute('role', 'note'); el.setAttribute('aria-label', el.getAttribute('data-t'));
    });
  }
  Cleo.fresh = { paint: paint, day: day, low: low };
  paint(d.querySelectorAll('li.pl[id^="p-"]'));
  d.addEventListener('cleo:stamped', function (e) { paint((e.detail && e.detail.cards) || []); });   // later chunks (core defer)
  d.addEventListener('cleo:locale', function () { paint(d.querySelectorAll('li.pl[id^="p-"]')); });
  if (Cleo.need && Cleo.need.done) Cleo.need.done('fresh');
})();
