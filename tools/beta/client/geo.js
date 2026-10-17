/* geo.js (platform): Cleo.geo, moved out of core.js (eager-JS budget, 2026-10-17). Every user is a lazy module or a
 * page script (base.js, trip.js, share-card.js, atlas.js with atlas-nav.js), so tools/beta/build.js puts this ONE source in front of each of those files
 * (LEADS); the first copy to run defines it, later copies return. Not shipped on its own. */
(function () {
  'use strict';
  var Cleo = window.Cleo = window.Cleo || {};
  /* ---- distances (day-plan legs, opt-in Near me). Always straight-line (VOICE.md rule 9). The position a
   * caller passes in is never stored or sent anywhere by this file. ---- */
  if (Cleo.geo) return;
  Cleo.geo = {
    km: function (a, b) {                              // a, b: {la, ln} or [lat, lng]
      var A = a.length ? { la: a[0], ln: a[1] } : a, B = b.length ? { la: b[0], ln: b[1] } : b, t = Math.PI / 180;
      var h = Math.pow(Math.sin((B.la - A.la) * t / 2), 2) + Math.cos(A.la * t) * Math.cos(B.la * t) * Math.pow(Math.sin((B.ln - A.ln) * t / 2), 2);
      return 2 * 6371.0088 * Math.asin(Math.min(1, Math.sqrt(h)));
    },
    fmt: function (km) { return km < 0.1 ? 'next door (under 0.1 km straight-line)' : (km < 10 ? km.toFixed(1) : Math.round(km)) + ' km straight-line'; },
    /** THE walking estimate (SPEC-v3 §3.4 / §10; W9-4 trips, W9-5 base) — one function, no second copy: straight-line
     *  metres ÷ 80 m a minute. Metres round to 10 under 1 km, one decimal of a km above. Callers state ASSUME once per view. */
    MPM: 80, ASSUME: 'Walk times are straight-line, about 80 m a minute — an estimate, not a route',
    walk: function (km) {
      var T = function (k, e, v) { return Cleo.t ? Cleo.t(k, e, v) : v ? e.replace(/\{([a-z]+)\}/g, function (m, n) { return n in v ? v[n] : m; }) : e; };
      var m = km * 1000, r = Math.round(m / 10) * 10, min = Math.round(m / 80);
      var dist = r < 1000 ? r + ' m' : (m / 1000).toFixed(1) + ' km';
      return { m: m, min: min, dist: dist, text: dist + ' · ' + (min < 1 ? T('geo.walk.under', 'under 1 min walk') : T('geo.walk.min', '{n} min walk', { n: min })) };   // i18n D-41: Cleo.t (head snippet)
    },
    ll: function (el) { var v = (el && el.getAttribute('data-ll') || '').split(','); return v.length === 2 ? [+v[0], +v[1]] : null; }
  };
})();
