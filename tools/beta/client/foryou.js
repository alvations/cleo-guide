/* Cleo beta — foryou.js (FE-A, M2-05 · M3-02). "For you": an interest picker keyed on collection / cuisine IDS only
 * (the build's mapping table, never a dish or name keyword). It REORDERS within each area and never hides: every place
 * stays in the list and on the map, and each lifted card says "First because …". "Near me": the location is asked
 * only on tap, used in memory for distances + nearest-first, and never stored or sent. */
(function () {
  'use strict';
  var Cleo = window.Cleo || {}, C = Cleo.city, d = document, host = d.getElementById('cleo-fy');
  if (!C || !host) return;
  var FY = C.info.fy || [], esc = C.esc, icon = C.icon, store = Cleo.store || { get: function (k, x) { return x; }, set: function () {} };
  var valid = function (v) { return (Array.isArray(v) ? v : []).filter(function (x) { return FY.some(function (f) { return f[0] === x; }); }); };
  var on = valid(store.get('interests', [])), pick = [], opener = null;
  var has = function (c, a, v) { return (' ' + (c.getAttribute(a) || '') + ' ').indexOf(' ' + v + ' ') >= 0; };
  var hit = function (c, ids) {
    return ids.some(function (x) { var i = x.indexOf(':'), k = x.slice(0, i), v = x.slice(i + 1);
      return k === 'k' ? c.getAttribute('data-k') === v : has(c, k === 'c' ? 'data-g' : 'data-cz', v); });
  };
  var why = function (c) { return c.hasAttribute('data-closed') ? [] : FY.filter(function (f) { return on.indexOf(f[0]) >= 0 && hit(c, f[3]); }); };
  var GL = { history: 'castle', food: 'bowl', pop: 'tv', outdoors: 'mountain', art: 'columns' };   // picker glyphs (city sprite)
  var names = function (l) { return l.map(function (f) { return f[1]; }).join(' · '); };

  function set(list) {
    on = valid(list); store.set('interests', on);
    C.rank = on.length ? function (c) { return -why(c).length; } : null;
    C.why = on.length ? function (c) { var w = why(c); return !w.length || C.S.day ? '' : 'First because: ' + names(w); } : null;
    var t = d.querySelector('[data-cleo-foryou]');
    if (t) { t.setAttribute('aria-pressed', String(!!on.length));
      t.querySelector('.d').textContent = on.length ? names(FY.filter(function (f) { return on.indexOf(f[0]) >= 0; })) + ' first' : 'Tell it what you love'; }
    C.apply();
  }
  // DES 15.10 .because: one line above the list while it is on (one control: Change); and the Near me note
  var line = function (id, cls) { var el = d.getElementById(id); if (!el) { d.getElementById('cleo-shown').insertAdjacentHTML('beforebegin', '<p class="' + cls + '" id="' + id + '" hidden></p>'); el = d.getElementById(id); } return el; };
  C.after.push(function () {
    var el = line('cleo-fyline', 'because'), ch = FY.filter(function (f) { return on.indexOf(f[0]) >= 0; });
    el.hidden = !on.length || !!C.S.day;
    if (!el.hidden) {
      var n = C.cards.filter(function (c) { return why(c).length; }).length;
      el.innerHTML = '<span><b>First because you picked ' + esc(ch.map(function (f) { return f[1]; }).join(' and ')) + ':</b> ' + n + ' places from those collections move up in their area. <span class="n">All ' + C.info.total + ' are still here.</span></span>' +
        '<button type="button" data-cleo-foryou>Change</button>';
    }
    var nn = line('cleo-nearline', 'shown device-note');
    nn.hidden = !(C.dist && C.S.sort === 'near');
    if (!nn.hidden) nn.innerHTML = '<b>Nearest first.</b> Using your location for this visit only — never stored or sent. <button type="button" class="btn btn-quiet" data-cleo-near>Turn off</button>';
  });

  function paint() {
    [].forEach.call(host.querySelectorAll('[data-i]'), function (b) { b.setAttribute('aria-pressed', String(pick.indexOf(b.getAttribute('data-i')) >= 0)); });
  }
  function close() { if (host.hidden) return; host.hidden = true; host.innerHTML = ''; d.body.style.overflow = ''; if (opener && opener.focus) opener.focus(); }
  C.fy = {
    open: function (from) {
      if (Cleo.sheet) Cleo.sheet.close(); if (Cleo.tray) Cleo.tray.close(true);
      opener = from; pick = on.slice();
      var sub = function (f) {
        if (f[3][0] === 'k:f') return 'Every place to eat and drink' + (C.info.sig ? ', the city’s own canon first' : '');
        return f[3].map(function (x) { return (C.info.cats || {})[x.slice(x.indexOf(':') + 1)]; }).filter(Boolean).slice(0, 3).join(', ');
      };
      host.innerHTML = '<div class="tray fy" role="dialog" aria-modal="true" aria-labelledby="fy-h"><header><h2 id="fy-h">Your guide · ' + esc(C.info.name) + '</h2>' +
        '<button type="button" class="btn btn-icon" data-fy="x" aria-label="Close">' + icon('close') + '</button></header><div class="scroll">' +
        '<p class="d3">Who’s showing you around?</p><p class="intro">Tell your guide what you’re into. It puts those places first in every area — all ' + C.info.total +
        ' places stay in the list and on the map.</p><fieldset><legend>I’m into…</legend>' +
        '<ul class="interests">' + FY.map(function (f) { return '<li><button type="button" class="interest" data-i="' + esc(f[0]) + '" aria-pressed="false"><span class="glyph">' + icon(GL[f[0]] || 'spark') + '</span>' +
          '<span><b>' + esc(f[1]) + '</b><span class="d">' + f[2] + ' of ' + C.info.total + ' ' + esc(C.info.name) + ' places' + (sub(f) ? ' · ' + esc(sub(f)) : '') + '</span></span><span class="tick" aria-hidden="true"></span></button></li>'; }).join('') + '</ul>' +
        '</fieldset><p class="sm">Remembered on this device only. No account, nothing sent anywhere.</p></div>' +
        '<footer><button type="button" class="btn btn-quiet" data-fy="reset">Reset</button><button type="button" class="btn btn-primary" data-fy="go">Show me ' + esc(C.info.name) + ' my way</button></footer></div>';
      host.hidden = false; d.body.style.overflow = 'hidden'; paint();
      var f = host.querySelector('[data-i]'); (f || host.querySelector('[data-fy="x"]')).focus();
    }
  };
  C.trap(host, close);
  host.addEventListener('click', function (e) {
    var t = e.target, b = t.closest && t.closest('[data-fy],[data-i]');
    if (t === host) { close(); return; } if (!b) return;
    var i = b.getAttribute('data-i'), a = b.getAttribute('data-fy');
    if (i) { var k = pick.indexOf(i); if (k >= 0) pick.splice(k, 1); else pick.push(i); paint(); }
    else if (a === 'reset') { pick = []; paint(); }
    else if (a === 'x') close();
    else if (a === 'go') { close(); set(pick); var l = d.getElementById('cleo-fyline') || d.getElementById('cleo-shown'); if (l && on.length) l.scrollIntoView({ block: 'center' }); }
  });

  /* ---- Near me (M3-02) ---- */
  var R = Math.PI / 180, km = function (a, b, c, e) { var h = Math.pow(Math.sin((c - a) * R / 2), 2) + Math.cos(a * R) * Math.cos(c * R) * Math.pow(Math.sin((e - b) * R / 2), 2); return 12742 * Math.asin(Math.sqrt(h)); };
  var toast = function (m) { if (Cleo.emit) Cleo.emit('cleo:toast', m); };
  var tile = function (p) { var t = d.querySelector('[data-cleo-near]'); if (t) { t.setAttribute('aria-pressed', String(p)); t.removeAttribute('aria-busy'); } };
  C.near = function (b) {
    if (C.dist && b && b.hasAttribute('data-cleo-near')) { C.dist = null; tile(false); var r0 = Cleo.route.parse(); if (r0.sort === 'near') delete r0.sort; C.go(r0); C.apply(); return; }
    if (!navigator.geolocation) { toast('This browser can’t share a location. Every place is still listed.'); return; }
    var t = d.querySelector('[data-cleo-near]'); if (t) t.setAttribute('aria-busy', 'true');
    if (Cleo.defer) Cleo.defer.all();                                // every place needs its distance (M3-06 progressive render)
    navigator.geolocation.getCurrentPosition(function (pos) {
      var la = pos.coords.latitude, ln = pos.coords.longitude, dist = {}, min = 1e9;
      C.cards.forEach(function (c) { var ll = (c.getAttribute('data-ll') || '').split(','); if (ll.length === 2) { var v = km(la, ln, +ll[0], +ll[1]); dist[C.pid(c)] = v; if (v < min) min = v; } });
      C.dist = dist; tile(true);                                     // held in memory for this page view only
      var r = Cleo.route.parse(); r.sort = 'near'; C.go(r); C.apply();
      if (min > 50) toast('You’re about ' + Math.round(min) + ' km from the nearest place in ' + C.info.name + '. Distances are shown anyway.');
    }, function (err) {
      tile(false);
      toast(err && err.code === 1 ? 'Location is off for this site, so nothing changed. Every place is still listed.' : 'We couldn’t get your location. Every place is still listed.');
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  };

  if (on.length) set(on);
})();
