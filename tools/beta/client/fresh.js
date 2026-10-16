/* Cleo beta — fresh.js (FE-C, W9-2 "Freshness everywhere", card half). A quiet "Status checked <d Mon>" line on each
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
  function paint(cards) {
    [].forEach.call(cards, function (c) {
      if (!c.matches || !c.matches('li.pl[data-checked]')) return;
      var iso = c.getAttribute('data-checked'), s = day(iso); if (!s) return;
      var el = c.querySelector(':scope > .pl-chk');
      if (!el) { el = d.createElement('span'); el.className = 'pl-chk'; c.appendChild(el); }
      el.setAttribute('data-t', Cleo.t('sheet.status', 'Status checked {d}', { d: s })); el.setAttribute('data-d', iso);
      el.setAttribute('role', 'note'); el.setAttribute('aria-label', el.getAttribute('data-t'));
    });
  }
  Cleo.fresh = { paint: paint, day: day };
  paint(d.querySelectorAll('li.pl[data-checked]'));
  d.addEventListener('cleo:stamped', function (e) { paint((e.detail && e.detail.cards) || []); });   // later chunks (core defer)
  d.addEventListener('cleo:locale', function () { paint(d.querySelectorAll('li.pl[data-checked]')); });
  if (Cleo.need && Cleo.need.done) Cleo.need.done('fresh');
})();
