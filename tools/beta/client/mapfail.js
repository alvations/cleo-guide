/* mapfail.js (platform): tiles failed — drop the dead map, show the build-time schematic + the VOICE.md copy. Lazy:
 * core.js's Cleo.mapFallback shim loads it (Cleo.need('mapfail')) the first time a map fails (eager-JS budget). */
(function () {
  'use strict';
  var Cleo = window.Cleo; if (!Cleo) return;
  var emit = Cleo.emit;
  Cleo.mapFallback = function (el, map) {
    try { if (map && map.remove) map.remove(); } catch (e) {}
    var art = el.getAttribute('data-art'), alt = el.getAttribute('data-art-alt') || '';
    el.innerHTML = (art ? '<figure class="map-art map-fallback"><img alt="" decoding="async" style="max-width:100%;height:auto"><figcaption></figcaption></figure>'
      : '<div class="map-fallback"><p></p></div>');
    var img = el.querySelector('img'), kept = el._cleoArt;
    // reuse the page's own schematic <img> (stashed below before the map cleared it): no second fetch of map.svg
    if (img && kept && kept.getAttribute('src') === art) { kept.alt = alt; kept.style.cssText = img.style.cssText; img.parentNode.replaceChild(kept, img); img = null; }
    if (img) { img.src = art; img.alt = alt; }
    var cap = el.querySelector('figcaption, p');
    var off = el.getAttribute('data-l-offline');   // W9-8: "Map unavailable · all N places listed" (catalogue string, rendered by the build)
    cap.innerHTML = (off ? '<strong class="map-off">' + off.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }) + '</strong><br>' : '') +
      '<strong>The map couldn\u2019t load.</strong> The list still has every place, address and source. ' +
      'We\u2019re showing map art from our own pins until tiles return. <button type="button" class="map-retry">Try again</button>';
    cap.querySelector('button').addEventListener('click', function () { location.reload(); });
    el.setAttribute('data-tiles', 'failed');
    emit('cleo:tiles-failed', {});
  };
  if (Cleo.need && Cleo.need.done) Cleo.need.done('mapfail');
})();
