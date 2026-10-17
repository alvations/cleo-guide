/* codec.js (platform): Cleo.listCodec, moved out of core.js (eager-JS budget, 2026-10-17). Every user is a lazy module or a
 * page script (saved.js, trip.js, share-card.js), so tools/beta/build.js puts this ONE source in front of each of those files
 * (LEADS); the first copy to run defines it, later copies return. Not shipped on its own. */
(function () {
  'use strict';
  var Cleo = window.Cleo = window.Cleo || {};
  /* ---- list codec: the share-link grammar for saved lists and day plans (platform contract) ----
   * refs are "<pageKey>/<placeId>"; on the wire they group by page:  tokyo:kanda-myojin,isegen;kyoto:x
   * Place ids are [a-z0-9-] and page keys [a-z0-9/-], so ':' ',' ';' never collide. */
  if (Cleo.listCodec) return;
  Cleo.listCodec = {
    encode: function (refs) {
      var by = {}, order = [];
      refs.forEach(function (r) { var i = r.lastIndexOf('/'); var k = r.slice(0, i); if (!by[k]) { by[k] = []; order.push(k); } by[k].push(r.slice(i + 1)); });
      return order.map(function (k) { return k + ':' + by[k].join(','); }).join(';');
    },
    decode: function (s) {
      var out = [];
      String(s || '').split(';').forEach(function (grp) {
        var i = grp.indexOf(':'); if (i < 1) { if (grp.indexOf('/') > 0) out.push(grp); return; }
        var k = grp.slice(0, i); grp.slice(i + 1).split(',').forEach(function (id) { if (id) out.push(k + '/' + id); });
      });
      return out;
    }
  };
})();
