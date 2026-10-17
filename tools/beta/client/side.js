/* Cleo beta — side.js (FE-C, SPEC-v3 §2.0.7 "Landscape": the selection side card). On a phone held sideways (height
 * < 500) a selected place is ONE 320 px card on the right, full height under the bar, never a bottom row of cards: the map
 * keeps the other 524 px (≥ 50 %) and fits the selection there. The card is the preview, built from the place's own card
 * (nothing fetched, nothing inferred): photo with its credit or the §v2.7b compact tile, area · kind, the name (→ the
 * detail), why, Recommended by, the status date, and Save / Directions / Share. Previous / next step through the in-bounds
 * ranking (the list's own order). Esc or Close puts focus back on the pin or the list card. Atlas (FE-1) calls
 * Cleo.side.open(card, how) from its landscape select(); this file is loaded on that first selection (lazy). */
(function () {
  'use strict';
  var Cleo = window.Cleo || {}, C = Cleo.city, d = document, H = d.documentElement;
  if (!C || Cleo.side) return;
  var NT = ' rel="noopener" target="_blank"', esc = C.esc, icon = C.icon, info = C.info || {};
  var q = function (s, el) { return (el || d).querySelector(s); };
  var tt = function (k, e, v) { return Cleo.t ? Cleo.t(k, e, v) : v ? e.replace(/\{([a-z]+)\}/g, function (m, n) { return n in v ? v[n] : m; }) : e; };
  var txt = function (el) { return el ? el.textContent.replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim() : ''; };
  var land = function () { return C.land ? C.land() : !C.desk() && innerHeight < 500 && innerWidth > innerHeight; };
  var box = null, cur = null, from = null;

  // the in-bounds ranking: the list's own places, in its own order (atlas.js orders by style.order), never an off-map one
  function ranked() {
    var lp = q('.listpane'); if (!lp) return cur ? [cur] : [];
    var shows = function (c) { return Cleo.lens && Cleo.lens.shows ? Cleo.lens.shows(c) : !c.hidden; };
    var all = [].slice.call(lp.querySelectorAll('li.pl[id^="p-"]')).filter(function (c) { return !c.hidden && !c.classList.contains('ms-out') && shows(c); });
    return all.map(function (c, i) { return [+(c.style.order || 0), i, c]; }).sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; }).map(function (x) { return x[2]; });
  }
  function glyph(c) { var g = c.getAttribute('data-mg') || c.getAttribute('data-gl') || ''; return g && d.getElementById('i-' + g) ? g : c.getAttribute('data-k') === 'f' ? (d.getElementById('i-forkknife') ? 'forkknife' : 'bowl') : 'pin'; }

  function build(c, list) {
    var id = C.pid(c), i = list.indexOf(c), n = list.length, prev = i > 0 ? list[i - 1] : null, next = i >= 0 && i < n - 1 ? list[i + 1] : null;
    var r = Cleo.route.parse(); delete r.pg; delete r.all; r.p = id;
    var nm = C.name ? C.name(c) || txt(q('.pl-n', c)) : txt(q('.pl-n', c)), closed = c.hasAttribute('data-closed'), ll = c.getAttribute('data-ll');
    var img = q('figure.pl-photo img', c), cap = img && q('figcaption', img.closest('figure'));
    var media = img ? '<figure class="sd-ph"><img src="' + esc(img.currentSrc || img.src) + '" alt="' + esc(img.getAttribute('alt') || '') + '" decoding="async">' + (cap ? '<figcaption>' + cap.innerHTML + '</figcaption>' : '') + '</figure>'
      : '<span class="sd-tile' + (c.getAttribute('data-k') === 'f' ? ' food' : '') + '" aria-hidden="true">' + icon(glyph(c)) + '</span>';
    var kind = txt(q('.ms-k', c)) || txt(q('.pl-e .in', c));
    var by = [].map.call(c.querySelectorAll('.pl-s button.src'), function (b) { return ((info.src || {})[b.getAttribute('data-src')] || [b.textContent])[0]; });   // as the detail names them (sheet.js)
    var byl = by.length > 1 ? tt('sheet.by.more', 'Recommended by {source} and {n} more', { source: '<b>' + esc(by[0]) + '</b>', n: by.length - 1 })
      : by.length ? tt('sheet.by', 'Recommended by {source}', { source: '<b>' + esc(by[0]) + '</b>' }) : esc(tt('city.card.added', 'Added by the guide (general knowledge)'));
    var w = q('.pl-w', c), chk = q(':scope > .pl-chk', c), apx = q(':scope > .pl-approx', c);
    var saved = !!(Cleo.saved && Cleo.saved.has(C.key + '/' + id)), url = Cleo.views ? Cleo.views.shareUrl(id) : location.href.split('#')[0] + '#p=' + encodeURIComponent(id);
    var arrow = function (k, o, ico) { return '<button type="button" class="btn btn-icon" data-sd="' + k + '"' + (o ? ' aria-label="' + esc(tt('sheet.' + k + '.named', k === 'prev' ? 'Previous: {name}' : 'Next: {name}', { name: C.name ? C.name(o) || txt(q('.pl-n', o)) : txt(q('.pl-n', o)) })) + '"' : ' disabled aria-label="' + esc(k === 'prev' ? tt('sheet.prev', 'Previous place') : tt('sheet.next', 'Next place')) + '"') + '>' + icon(ico) + '</button>'; };
    return '<div class="sd-top">' + (i >= 0 ? '<span class="sd-pos">' + esc(tt('sheet.pos', '{i} of {n}', { i: (i + 1).toLocaleString(), n: n.toLocaleString() })) + '</span>' : '<span></span>') +
      arrow('prev', prev, 'chev-l') + arrow('next', next, 'chev-r') +
      '<button type="button" class="btn btn-icon" data-sd="x" aria-label="' + esc(tt('sheet.close', 'Close')) + '">' + icon('close') + '</button></div>' +
      '<div class="sd-body' + (img ? '' : ' np') + '">' + media + '<div class="sd-tx">' +
      (closed ? '<p class="sd-cl">' + esc(tt('city.card.closed', 'Closed — kept for the record')) + '</p>' : '') +
      (kind ? '<p class="sd-k">' + esc(kind) + '</p>' : '') +
      '<h2 class="sd-n" id="sd-n"><a href="' + esc(Cleo.route.href(r)) + '">' + esc(nm) + '</a></h2>' +
      (w ? '<p class="sd-w">' + esc(txt(w)) + '</p>' : '') + '<p class="sd-by">' + byl + '</p>' +
      (chk ? '<p class="pl-chk sd-chk" data-nosearch>' + esc(chk.textContent) + '</p>' : '') + (apx ? '<p class="pl-approx">' + esc(apx.textContent) + '</p>' : '') + '</div></div>' +
      '<div class="sd-acts"><button type="button" class="btn btn-ghost" data-sd="save" aria-pressed="' + saved + '">' + icon('heart') + '<span>' + esc(saved ? tt('sheet.saved', 'Saved') : tt('sheet.save', 'Save')) + '</span></button>' +
      (ll ? '<a class="btn ' + (closed ? 'btn-ghost' : 'btn-primary') + '" href="https://www.openstreetmap.org/directions?route=%3B' + encodeURIComponent(ll) + '"' + NT + '>' + icon('directions') + '<span>' + esc(closed ? tt('sheet.wasat', 'Where it was') : tt('sheet.directions', 'Directions')) + '</span></a>' : '') +
      '<button type="button" class="btn btn-ghost" data-sd="share" data-url="' + esc(url) + '">' + icon('share') + '<span>' + esc(tt('sheet.share', 'Share')) + '</span></button></div>';
  }

  // the map fits the selection in the part the card leaves (the 524 px at 844), by the minimum needed
  function fit(c) {
    var map = C.map && C.map(), k = map && C.markers && C.markers[C.pid(c)]; if (!k || !box) return;
    var mr = map.getContainer().getBoundingClientRect(), br = box.getBoundingClientRect(), o = C.overMap ? C.overMap() : { paddingTopLeft: [16, 16], paddingBottomRight: [16, 16] };
    o.paddingBottomRight = [Math.max(o.paddingBottomRight[0], Math.round(mr.right - br.left) + 72), o.paddingBottomRight[1]];   // + the control stack beside the card
    try { map.panInside(k.getLatLng(), Object.assign(o, { animate: !(C.still && C.still()), duration: 0.3 })); } catch (e) {}
  }
  function host() {
    if (box && box.isConnected) return box;
    box = d.createElement('aside'); box.id = 'cleo-side'; box.className = 'side-card'; box.tabIndex = -1; box.setAttribute('aria-labelledby', 'sd-n'); box.hidden = true;
    (q('.mappane') || d.body).appendChild(box);
    box.addEventListener('click', click);
    box.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); } });
    return box;
  }
  function open(c, how) {
    if (!c || !land()) { if (box && !box.hidden) close(false); return false; }
    var was = box && !box.hidden; host(); cur = c;
    if (!was) from = d.activeElement && d.activeElement !== d.body ? d.activeElement : null;
    box.innerHTML = build(c, ranked()); box.hidden = false;
    H.classList.add('side-on'); H.style.setProperty('--side-w', '320px');
    if (C.feature) C.feature();
    fit(c);
    if (!was && how !== 'route' && from && (from.closest('.leaflet-marker-icon, .leaflet-interactive, li.pl') || how === 'key')) box.focus({ preventScroll: true });
    d.dispatchEvent(new CustomEvent('cleo:side', { detail: { open: true, id: C.pid(c) } }));
    return true;
  }
  function close(back) {
    if (!box || box.hidden) return;
    var c = cur; box.hidden = true; box.innerHTML = ''; cur = null;
    H.classList.remove('side-on'); H.style.removeProperty('--side-w');
    if (C.unselect) C.unselect(); else if (c) { c.classList.remove('is-sel', 'is-focus'); if (C.feature) C.feature(); }
    if (back && c) {   // focus back where the selection came from: the pin, else the list card's link, else the map
      var f0 = from, put = function () {
        var k = C.markers && C.markers[C.pid(c)], el = k && k.getElement && k.getElement(), lk = q('.pl-n a', c), mc = C.map && C.map() && C.map().getContainer();
        var to = [f0, el, lk && lk.offsetParent ? lk : null, mc].filter(function (x) { return x && x.isConnected && x !== d.body; })[0];
        if (to) { if ((to === el || to === mc) && !to.hasAttribute('tabindex')) to.setAttribute('tabindex', '0'); to.focus({ preventScroll: true }); }
      };
      put();   // the pins redraw after the selection clears (atlas.js feature(), 120 ms): if the pin was replaced, focus its new one
      setTimeout(function () { if (!d.activeElement || d.activeElement === d.body) put(); }, 260);
    }
    from = null;
    d.dispatchEvent(new CustomEvent('cleo:side', { detail: { open: false } }));
  }
  function step(k) {
    var list = ranked(), i = list.indexOf(cur), o = list[i + k]; if (!o) return;
    if (C.select) C.select(o, 'side');
    open(o, 'side');
    var b = q('[data-sd="' + (k < 0 ? 'prev' : 'next') + '"]', box); if (b && !b.disabled) b.focus({ preventScroll: true }); else box.focus({ preventScroll: true });
  }
  function click(e) {
    var b = e.target.closest('[data-sd], .sd-n a'); if (!b) return;
    if (b.matches('.sd-n a')) { from = null; close(false); return; }   // the detail opens (its own route); the sheet restores focus
    var k = b.getAttribute('data-sd'), v;
    if (k === 'x') close(true);
    else if (k === 'prev') step(-1);
    else if (k === 'next') step(1);
    else if (k === 'save') { v = Cleo.saved && Cleo.saved.toggle(C.key + '/' + C.pid(cur)); b.setAttribute('aria-pressed', String(!!v)); b.lastChild.textContent = v ? tt('sheet.saved', 'Saved') : tt('sheet.save', 'Save'); }
    else if (k === 'share' && Cleo.share) Cleo.share(txt(q('.sd-n', box)) + ' — ' + info.name, b.getAttribute('data-url'));
  }
  // turned upright, or the window grew past landscape: the card goes (the portrait carousel takes over); a new language redraws
  var rs = 0; window.addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(function () { if (box && !box.hidden && !land()) close(false); }, 150); });
  d.addEventListener('cleo:locale', function () { if (box && !box.hidden && cur) box.innerHTML = build(cur, ranked()); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box && !box.hidden && !(Cleo.sheet && Cleo.sheet.isOpen()) && !e.defaultPrevented) close(true); });
  Cleo.side = { open: open, close: close, step: step, isOpen: function () { return !!(box && !box.hidden); }, current: function () { return cur; } };
  if (Cleo.need && Cleo.need.done) Cleo.need.done('side');
})();
