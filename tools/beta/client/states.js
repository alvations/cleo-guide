/* Cleo beta — states.js (lane FE-B, M1-19). Site-wide notices, copy verbatim from design/beta/VOICE.md:
 *  - offline: shown when the browser reports no network (and hidden again when it returns);
 *  - storage blocked: shown on "Your list" and the first time a save happens while storage throws.
 * Notices render into the top bar's [data-cleo-banners] slot; nothing here is needed to read a page. */
(function () {
  'use strict';
  var Cleo = window.Cleo = window.Cleo || {};
  /* night toggle (DES hook b): html[data-theme] = light|dark, remembered via Cleo.store (try/catch inside) */
  var root = document.documentElement, tgs = document.querySelectorAll('[data-cleo-theme]');
  var saved = Cleo.store ? Cleo.store.get('theme', null) : null;
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  function isDark() { var t = root.getAttribute('data-theme'); return t ? t === 'dark' : !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); }
  function paint() { Array.prototype.forEach.call(tgs, function (b) { b.setAttribute('aria-pressed', String(isDark())); }); }
  Array.prototype.forEach.call(tgs, function (tg) {      // one in the top bar (≥ 900 px), one in the footer (all widths)
    tg.hidden = false;
    tg.addEventListener('click', function () {
      var t = isDark() ? 'light' : 'dark'; root.setAttribute('data-theme', t);
      if (Cleo.store) Cleo.store.set('theme', t); paint();
    });
  });
  paint();
  var slot = document.querySelector('[data-cleo-banners]');
  if (!slot) return;
  var COPY = {
    offline: 'You’re offline — the guide still works. Your list and every place’s details are on this device; map tiles return when you reconnect.',
    storage: 'Storage is blocked here, so saves last until you close the tab.'
  };
  var ICON = { offline: 'offline', storage: 'info' };

  function show(kind) {
    if (slot.querySelector('[data-cleo-banner="' + kind + '"]')) return;
    var b = document.createElement('div');
    b.className = 'banner ' + (kind === 'offline' ? 'offline' : 'warn');
    b.setAttribute('data-cleo-banner', kind);
    b.setAttribute('role', 'status');
    b.innerHTML = '<svg class="ico" width="20" height="20" aria-hidden="true"><use href="#i-' + ICON[kind] + '"/></svg><span>' + COPY[kind] + '</span>' +
      '<button type="button" class="btn btn-quiet btn-icon" aria-label="Dismiss"><svg class="ico" width="20" height="20" aria-hidden="true"><use href="#i-close"/></svg></button>';
    b.querySelector('button').addEventListener('click', function () { b.parentNode && b.parentNode.removeChild(b); });
    slot.appendChild(b);
  }
  function hide(kind) { var b = slot.querySelector('[data-cleo-banner="' + kind + '"]'); if (b) b.parentNode.removeChild(b); }
  Cleo.notice = { show: show, hide: hide };

  /** True when localStorage can't be written here (sandboxed frames, private modes, blocked cookies). */
  function storageBlocked() {
    try { var k = 'cleo:v1:probe'; window.localStorage.setItem(k, '1'); window.localStorage.removeItem(k); return false; } catch (e) { return true; }
  }
  Cleo.storageBlocked = storageBlocked;

  if (navigator.onLine === false) show('offline');
  window.addEventListener('offline', function () { show('offline'); });
  window.addEventListener('online', function () { hide('offline'); });

  var page = document.documentElement.getAttribute('data-cleo-page');
  if (page === 'saved' && storageBlocked()) show('storage');
  document.addEventListener('cleo:saved', function () { if (storageBlocked()) show('storage'); });
})();
