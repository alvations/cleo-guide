/* Cleo beta — base.js (FE-C, W9-5). "Set as my base": any open, pinned place of a guide becomes your base (a hotel, a
 * station, a friend's flat that happens to be listed). The state is core.js's Cleo.base (#…&base=<id> for this visit,
 * Cleo.store 'mybase' on the device, try/catch). This file loads only when a base is set or a place sheet opens. It adds
 * the distances: every card in every view — Gallery (li.gc), the list and Atlas (li.pl, the map preview .ms-pv),
 * Guidebook (li.ge) and Saved — carries one line "650 m from <base> · 8 min walk" from Cleo.geo.walk (straight-line,
 * 80 m a minute), and each view states that assumption once. It never hides or drops a place. Sort gains "Nearest to
 * my base" (city.js hook); clearing the base restores the guide's order exactly. A closed or unpinned place can't be a
 * base; a stale one (closed since) is cleared with the reason shown.
 * API for the Atlas ring (FE-2): Cleo.base.ll(key) → [lat,lng]|null · Cleo.base.from(ll, key) → {km, m, min, dist, text}
 * · Cleo.base.ready(cb) · events 'cleo:base' {key, id|null} (core) and 'cleo:base-ready' {key}. */
(function () {
  'use strict';
  var Cleo = window.Cleo || {}, B = Cleo.base, d = document;
  if (!B || !Cleo.geo || !Cleo.geo.walk || B.ll) return;
  var C = Cleo.city || null, data = {}, ready = {}, waiters = [], busy = false;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var toast = function (m) { if (Cleo.emit) Cleo.emit('cleo:toast', m); };
  var short = function (p) { var n = String(p.n).replace(/\s+[—–-]+\s*CLOSED\b.*$/, ''), nat = p.nat && n.slice(-p.nat.length - 2) === '(' + p.nat + ')' ? p.nat : ''; return nat ? n.slice(0, -nat.length - 2).trim() : n; };
  var isClosed = function (p) { return !!p.closed || /\bclosed\b/i.test((p.pv || {}).status || '') || / [—–-]+ CLOSED\b/.test(p.n); };
  /** Can this place be a base? '' when yes, otherwise the reason. */
  if (!Cleo.t) Cleo.t = function (k, e, v) { return v ? e.replace(/\{([a-z]+)\}/g, function (m, n) { return n in v ? v[n] : m; }) : e; };   // i18n D-41
  var refuse = function (p) { return !p ? Cleo.t('base.why.gone', 'it is no longer listed in the guide') : isClosed(p) ? Cleo.t('base.why.closed', 'it is closed') : p.la == null ? Cleo.t('base.why.nopin', 'it has no verified pin') : ''; };

  function load(k) {
    if (data[k] !== undefined) return Promise.resolve(data[k]);
    return Cleo.pageData(k).then(function (j) { var by = {}; (j.places || []).forEach(function (p) { by[p.id] = p; }); data[k] = { by: by, name: j.name || k }; return data[k]; },
      function () { data[k] = null; return null; });
  }
  var cur = function (k) { var b = B.get(k), D = b && data[b.key], p = D && D.by[b.id]; return p && !refuse(p) ? { key: b.key, id: b.id, p: p } : null; };

  /* ---- API ---- */
  B.ll = function (k) { var b = cur(k); return b ? [+b.p.la, +b.p.ln] : null; };
  B.name = function (k) { var b = cur(k); return b ? short(b.p) : ''; };
  B.from = function (ll, k) {
    var o = B.ll(k); if (!o || !ll) return null;
    var km = Cleo.geo.km(o, ll), w = Cleo.geo.walk(km);
    return { km: km, m: w.m, min: w.min, dist: w.dist, text: w.dist + ' ' + Cleo.t('base.from', 'from') + ' ' + B.name(k) + ' · ' + (w.min < 1 ? Cleo.t('geo.walk.under', 'under 1 min walk') : Cleo.t('geo.walk.min', '{n} min walk', { n: w.min })) };   // not a {template}: one would match prose on other pages (runtime swap)
  };
  /** The line a card carries for place p of guide k (exported for tests): '' when there is nothing to say. */
  B.line = function (p, k) {
    var b = cur(k); if (!b || !p || p.la == null) return '';
    if (p.id === b.id) return Cleo.t('base.yours', 'Your base');
    var f = B.from([+p.la, +p.ln], k); return f ? (isClosed(p) ? Cleo.t('base.wasat', 'Where it was: {line}', { line: f.text }) : f.text) : '';
  };
  B.load = load;
  B.ready = function (cb) { var k = B.page() || ''; if (ready[k]) cb(); else waiters.push(cb); };

  /* ---- set / clear ---- */
  function hash(id) {                                   // keep the URL in step: &base=<id> (replaceState, no history entry)
    if (!history.replaceState || !B.page()) return;
    var r = Cleo.route.raw(); if (id) r.base = id; else delete r.base;
    var h = Cleo.route.href(r); history.replaceState(history.state, '', h === '#' ? location.pathname + location.search : h);
  }
  B.choose = function (k, id) {
    var D = data[k], p = D && D.by[id], why = refuse(p);
    if (why) { toast(Cleo.t('base.refuse', 'That place can’t be your base: {why}.', { why: why })); return false; }
    B.set(k, id); if (k === B.page()) hash(id);
    toast(Cleo.t('base.set.toast', 'Your base is {base}. Every card now shows how far it is.', { base: short(p) }));
    return true;
  };
  B.clear = function (k) {
    k = k || B.page(); var was = B.name(k); B.set(k, null); if (k === B.page()) hash(null);
    if (C && C.S && C.S.sort === 'base') { var r = Cleo.route.parse(); delete r.sort; delete r.base; C.go(r, true); }
    if (was) toast(Cleo.t('base.cleared', 'Base cleared. The guide’s own order is back.'));
  };

  /* ---- the cards ---- */
  var ID = /^[A-Za-z0-9_.~-]{1,80}$/;
  function idOf(el) {                                   // the place id a card is about, in this guide
    if (el.matches('li.pl') && /^p-/.test(el.id)) return el.id.slice(2);
    if (el.matches('a.ms-pv')) { var m = /[#&]p=([^&]+)/.exec(el.getAttribute('href') || ''); return m ? decodeURIComponent(m[1]) : ''; }
    return el.getAttribute('data-id') || '';
  }
  function put(el, text, cls, where) {
    var x = el.querySelector(':scope [data-cleo-bl]');
    if (!text) { if (x) x.remove(); return; }
    if (x && x.textContent === text) return;
    if (!x) { x = d.createElement(cls === 'ms-pv-base' ? 'span' : 'p'); x.className = cls; x.setAttribute('data-cleo-bl', ''); var at = where && el.querySelector(where); if (at) at.parentNode.insertBefore(x, at.nextSibling); else el.appendChild(x); }
    x.textContent = text;
  }
  function decorate() {
    if (busy) return; busy = true;
    try {
      var k = B.page();
      if (k) {
        var D = data[k];
        if (D) {
          [].forEach.call(d.querySelectorAll('li.pl[id^="p-"], li.gc[data-id], li.ge[data-id], a.ms-pv'), function (el) {
            var p = D.by[idOf(el)], t = B.line(p, k);
            if (el.matches('a.ms-pv')) put(el.querySelector('.ms-pv-b') || el, t, 'ms-pv-base');
            else if (el.matches('li.gc')) put(el.querySelector('.gc-b') || el, t, 'gc-base');
            else if (el.matches('li.ge')) put(el, t, 'ge-base', '.ge-m');
            else put(el, t, 'pl-base', '.pl-s');
          });
        }
        note();
      }
      var sv = d.getElementById('cleo-saved');                 // Saved: cards of every guide that has a base
      if (sv) [].forEach.call(sv.querySelectorAll('li.pl[id^="sv-"]'), function (el) {
        var all = B.all(), hit = null;
        Object.keys(all).forEach(function (g) { var pre = 'sv-' + g.replace(/\//g, '--') + '-'; if (el.id.indexOf(pre) === 0 && data[g] && (!hit || pre.length > hit[1].length)) hit = [g, pre]; });
        put(el, hit ? B.line(data[hit[0]].by[el.id.slice(hit[1].length)], hit[0]) : '', 'pl-base', '.pl-s');
      });
      if (sv) savedNote(sv);
    } finally { busy = false; }
  }
  // the assumption, once per view, with the actions: sort nearest to it, clear it
  function note() {
    var k = B.page(), b = cur(k), main = d.getElementById('main'), el = d.getElementById('cleo-basenote');
    var pill = d.querySelector('#cleo-tray [data-f="sort"][data-v="base"]'); if (pill) pill.hidden = !b;
    if (!b) { if (el) el.remove(); return; }
    if (!el) { el = d.createElement('div'); el.id = 'cleo-basenote'; el.className = 'base-note'; el.setAttribute('role', 'status'); }
    // once per view, where that view reads it: Atlas's list head; else above the Gallery lead, the view host or the list
    var vis = function (x) { return x && x.getClientRects().length; }, head = d.querySelector('.ms-head');
    if (d.documentElement.getAttribute('data-view') === 'atlas' && vis(head)) { if (el.parentNode !== head) head.appendChild(el); }
    else { var at = [d.getElementById('cleo-lead'), d.getElementById('cleo-view'), d.querySelector('main .split')].filter(vis)[0] || (main && main.querySelector('section.area'));
      if (at && at.previousSibling !== el) at.parentNode.insertBefore(el, at); else if (!at && main && !el.parentNode) main.appendChild(el); }
    var on = C && C.S && C.S.sort === 'base';
    var h = '<p><span class="eyebrow">' + esc(Cleo.t('base.yours', 'Your base')) + '</span> <b>' + esc(short(b.p)) + '</b>. ' + esc(Cleo.t('geo.assume', 'Walk times are straight-line, about 80 m a minute — an estimate, not a route')) + '.</p><p class="base-acts">' +
      (C ? '<button type="button" class="btn btn-ghost" data-cleo-base="sort" aria-pressed="' + on + '">' + esc(on ? Cleo.t('base.sort.on', 'Nearest to my base ✓') : Cleo.t('city.sort.base', 'Nearest to my base')) + '</button>' : '') +
      '<button type="button" class="btn btn-quiet" data-cleo-base="clear">' + esc(Cleo.t('base.clear', 'Clear my base')) + '</button></p>';
    if (el._h !== h) { el.innerHTML = h; el._h = h; }
  }
  function savedNote(sv) {
    var all = B.all(), ks = Object.keys(all).filter(function (g) { return cur(g); }), el = d.getElementById('cleo-basenote');
    if (!ks.length) { if (el) el.remove(); return; }
    var h = '<p><span class="eyebrow">' + esc(Cleo.t('base.yours', 'Your base')) + '</span> ' + ks.map(function (g) { return '<b>' + esc(B.name(g)) + '</b> ' + esc(Cleo.t('base.in', 'in {guide}', { guide: data[g].name })); }).join(', ') +
      '. ' + esc(ks.length === 1 ? Cleo.t('base.saved.one', 'Cards in that guide show how far they are.') : Cleo.t('base.saved', 'Cards in those guides show how far they are.')) + ' ' + esc(Cleo.t('geo.assume', 'Walk times are straight-line, about 80 m a minute — an estimate, not a route')) + '.</p><p class="base-acts">' +
      ks.map(function (g) { return '<button type="button" class="btn btn-quiet" data-cleo-base="clear" data-k="' + esc(g) + '">' + esc(Cleo.t('base.clear.in', 'Clear my {guide} base', { guide: data[g].name })) + '</button>'; }).join('') + '</p>';
    if (!el) { el = d.createElement('div'); el.id = 'cleo-basenote'; el.className = 'base-note'; el.setAttribute('role', 'status'); }
    var top = sv.querySelector('.sv-top'); if (top && el.parentNode !== top) top.appendChild(el);
    if (el._h !== h) { el.innerHTML = h; el._h = h; }
  }

  /* ---- the place sheet (city.js FE-C hook → C.baseSheet): "Set as my base", or "Your base ✓ · Clear" ---- */
  if (C) {
    // opt (QC-15): {focus: true} keeps focus in the sheet on the fact's new control (Escape still closes it); {say: text} announces it
    C.baseSheet = function (c, opt) {
      var k = B.page(), host = d.getElementById('cleo-sheet'), id = C.pid(c);
      load(k).then(function (D) {
        var sh = host && host.querySelector('.sheet'); if (!sh || !D || C.pid(c) !== id) return;
        var p = D.by[id], why = refuse(p), b = cur(k), mineB = b && b.id === id, old = sh.querySelector('[data-cleo-base-fact]');
        if (old) old.remove();
        if (why && !mineB) return;                            // a closed or unpinned place is never offered as a base
        var f = b && !mineB ? B.from([+p.la, +p.ln], k) : null;
        var html = '<div class="fact" data-cleo-base-fact data-id="' + esc(id) + '"><svg class="ico" aria-hidden="true"><use href="#i-pin"/></svg><div><p class="vh" role="status" data-cleo-base-live></p>' +
          (f ? '<p class="sm">' + esc(f.text) + ' <span class="muted">' + esc(Cleo.t('base.sl', '(straight-line)')) + '</span></p>' : '') +
          (mineB ? '<p><b>' + esc(Cleo.t('base.yours', 'Your base')) + '</b> <button type="button" class="btn btn-quiet" data-cleo-base="clear">' + esc(Cleo.t('base.clear', 'Clear my base')) + '</button></p>'
            : '<button type="button" class="btn btn-ghost" data-cleo-base="set" data-id="' + esc(id) + '">' + esc(b ? Cleo.t('base.instead', 'Make this my base instead') : Cleo.t('base.make', 'Set as my base')) + '</button>') + '</div></div>';
        var at = sh.querySelector('.fact:last-of-type'), facts = at ? at.parentNode : sh.querySelector('.actions');
        if (at) at.insertAdjacentHTML('afterend', html); else if (facts) facts.insertAdjacentHTML('beforebegin', html);
        var fx = sh.querySelector('[data-cleo-base-fact]');
        if (fx && opt && opt.focus) { var bt = fx.querySelector('button'); if (bt) bt.focus({ preventScroll: true }); }
        if (fx && opt && opt.say) setTimeout(function () { var lv = fx.querySelector('[data-cleo-base-live]'); if (lv) lv.textContent = opt.say; }, 60);   // after insertion, so it is read
      });
    };
    /** Sort key for "Nearest to my base" (city.js hook): km from the base, unpinned last. */
    C.baseKm = function (c) { var o = B.ll(), ll = Cleo.geo.ll(c); return o && ll ? Cleo.geo.km(o, ll) : 1e9; };
  }

  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-cleo-base]'); if (!b) return;
    var k = b.getAttribute('data-k') || B.page(), act = b.getAttribute('data-cleo-base');
    if (act === 'set') { var id = b.getAttribute('data-id'); if (B.choose(k, id) && C && C.byId[id]) C.baseSheet(C.byId[id], { focus: true, say: Cleo.t('base.set.toast', 'Your base is {base}. Every card now shows how far it is.', { base: B.name(k) }) }); }
    else if (act === 'clear') { var inSheet = !!b.closest('#cleo-sheet'); B.clear(k); if (C && C.baseSheet) { var sh = d.querySelector('#cleo-sheet [data-cleo-base-fact]'), sid = sh && sh.getAttribute('data-id'); if (sid && C.byId[sid]) { C.baseSheet(C.byId[sid], inSheet ? { focus: true, say: Cleo.t('base.cleared', 'Base cleared. The guide’s own order is back.') } : null); } } }
    else if (act === 'sort' && C) { var r2 = Cleo.route.parse(); if (C.S.sort === 'base') delete r2.sort; else r2.sort = 'base'; C.go(r2); }
    else return;
    schedule(); if (C && C.apply) C.apply();
  });
  d.addEventListener('cleo:base', function () { schedule(); });
  d.addEventListener('cleo:view', function () { schedule(); });
  var css = d.createElement('style');
  css.textContent = '.pl .pl-base{order:99;grid-column:1/-1}.pl-base,.gc-base,.ge-base,.ms-pv-base{white-space:normal;overflow-wrap:anywhere;min-width:0;max-width:100%}.pl-base,.gc-base,.ge-base{margin:4px 0 0;font:500 var(--fs-sm)/1.35 var(--font-ui);color:var(--ink-2)}.ms-pv-base{display:block;margin-top:2px;font-size:var(--fs-sm);color:var(--ink-2)}' +
    // OV-12 (OV-00): the note is in-flow and compact: one sentence (the card lines already show the distance), tight leading
    '.base-note{display:flex;flex-wrap:wrap;gap:2px 12px;align-items:center;margin:6px 0;padding:6px 10px;border:1px solid var(--line);border-radius:var(--r-m);background:var(--surface);font-size:var(--fs-sm);line-height:var(--lh-xs,1.35);color:var(--ink-2)}' +
    '.base-note p{margin:0}.base-note b{color:var(--ink)}.base-acts{display:flex;flex-wrap:wrap;gap:var(--s-2)}.base-acts .btn{min-height:var(--tap)}.base-acts .btn[aria-pressed=true]{background:var(--ink);color:var(--paper);border-color:var(--ink)}.ms-head .base-note{margin:6px 0 0}';
  d.head.appendChild(css);

  // decorate whatever any view renders, whenever it renders it (pages, chunks, the Atlas preview), without hooks into it
  var raf = 0, schedule = function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; decorate(); }); };
  if ('MutationObserver' in window) new MutationObserver(function (ms) {
    if (busy) return;
    for (var i = 0; i < ms.length; i++) { var t = ms[i].target; if (!(t.closest && t.closest('[data-cleo-bl],[data-cleo-base-fact],#cleo-basenote'))) { schedule(); return; } }
  }).observe(d.body, { childList: true, subtree: true });

  // load every guide that has a base (this page's first), check each base is still a base, then paint
  var keys = Object.keys(B.all()), k0 = B.page(); if (k0 && keys.indexOf(k0) < 0) keys.unshift(k0);
  Promise.all(keys.map(load)).then(function () {
    keys.forEach(function (k) {
      var b = B.get(k); if (!b || !data[k]) return;
      var why = refuse(data[k].by[b.id]);
      if (why) { B.set(k, null); if (k === k0) { hash(null); toast(Cleo.t('base.cleared.why', 'Your base was cleared: {why}.', { why: why })); } }
    });
    ready[k0 || ''] = true; waiters.splice(0).forEach(function (f) { try { f(); } catch (e) {} });
    if (Cleo.emit) Cleo.emit('cleo:base-ready', { key: k0 });
    decorate(); if (C && C.apply && C.S && C.S.sort === 'base') C.apply();
  });
  if (Cleo.need && Cleo.need.done) Cleo.need.done('base');
})();
