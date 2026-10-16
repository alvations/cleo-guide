/* Cleo beta — saved.js (FE-A, M2-03 · M2-04). "Your lists": every place saved on this device, as covered cards
 * grouped by city, on a map. Named lists (create / rename / delete), Been-there stamps, export (KML · GeoJSON · JSON
 * backup + import) and "open in maps" links. A list travels as a link (#list=<ids>&n=<name>, Cleo.listCodec): the
 * recipient sees it read-only with "Save a copy". Ids the site no longer knows are reported, never dropped silently.
 * No account, no network calls beyond this site's own datasets. */
(function () {
  'use strict';
  var Cleo = window.Cleo || {}, d = document, box = d.getElementById('cleo-saved');
  if (!box || !Cleo.saved || !Cleo.store) return;
  var st = Cleo.store, NT = ' rel="noopener" target="_blank"';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ico = function (n) { return '<svg class="ico" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  var pg = function (r) { return r.slice(0, r.lastIndexOf('/')); }, idOf = function (r) { return r.slice(r.lastIndexOf('/') + 1); };
  var lists = function () { var l = st.get('lists', []); return Array.isArray(l) ? l.filter(function (x) { return x && x.id && Array.isArray(x.r); }) : []; };
  var setLists = function (l) { st.set('lists', l); };
  var been = function () { var b = st.get('been', {}); return b && typeof b === 'object' ? b : {}; };
  var toast = function (m) { var el = d.createElement('p'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = m; d.body.appendChild(el); setTimeout(function () { el.remove(); }, 2600); };
  d.addEventListener('cleo:toast', function (e) { toast(e.detail === 'Link copied' ? 'Link copied — it opens this exact list.' : String(e.detail)); });
  var data = {}, map = null, L0 = 0, view = [];

  function state() {
    var r = Cleo.route.parse(), s = Cleo.saved.all(), b = been(), ls = lists();
    if (r.list) return { shared: true, name: r.n || 'A shared list', refs: Cleo.listCodec.decode(r.list) };
    var v = r.v || 'all', l = ls.filter(function (x) { return x.id === v; })[0];
    if (v === 'been') return { v: v, name: 'Been there', refs: Object.keys(b) };
    if (l) return { v: v, list: l, name: l.n, refs: l.r.slice() };
    return { v: 'all', name: 'All saved', refs: Object.keys(s).sort(function (x, y) { return (s[y].t || 0) - (s[x].t || 0); }) };
  }
  function load(keys) {
    return Promise.all(keys.map(function (k) {
      if (data[k]) return data[k];
      return Cleo.pageData(k).then(function (j) {
        var by = {}, src = {}; (j.places || []).forEach(function (p) { by[p.id] = p; }); (j.sourceIndex || []).forEach(function (x) { src[x.id] = String(x.name || x.id).split(' · ')[0]; });
        var ar = {}; (j.areas || []).forEach(function (a) { ar[a.id] = String(a.n).split(/\s+[(—–]\s*|\s+\(/)[0]; });
        data[k] = { name: j.name || k, href: j.beta, by: by, src: src, ar: ar, col: j.colors || {} }; return data[k];
      }, function () { data[k] = null; return null; });
    }));
  }
  var ll = function (p) { return p && p.la != null ? p.la + ',' + p.ln : ''; };

  // the normal place card (.pl, DES contract) — cover plate, eyebrow, name, write-up, Recommended by, Save; + list actions
  function card(ref, i, S) {
    var k = pg(ref), id = idOf(ref), D = data[k], p = D && D.by[id];
    if (!p) return '';
    var closed = /\bclosed\b/i.test((p.pv || {}).status || '') || / [—–-]+ CLOSED\b/.test(p.n);
    var nat = p.nat && p.n.slice(-p.nat.length - 2) === '(' + p.nat + ')' ? p.nat : '', base = nat ? p.n.slice(0, -nat.length - 2).trim() : p.n;
    var g = Array.from(nat || ''), area = D.ar[p.a] || '', col = /^#/.test(D.col[p.a] || '') ? D.col[p.a] : 'var(--city)';
    var srcs = (p.src || []).filter(function (x) { return x !== 'guide'; }).map(function (x) { return D.src[x] || x; });
    var href = D.href + '#p=' + encodeURIComponent(id), saved = Cleo.saved.has(ref), b = !!been()[ref], pos = ll(p);
    var inL = lists().map(function (l) { return '<label><input type="checkbox" data-sl="' + esc(l.id) + '" data-ref="' + esc(ref) + '"' + (l.r.indexOf(ref) >= 0 ? ' checked' : '') + '>' + esc(l.n) + '</label>'; }).join('');
    var eye = closed ? 'Closed since it was saved — kept for the record' + ((p.pv || {}).checked ? ', checked ' + esc(p.pv.checked) : '')
      : '<span class="tier t' + p.t + '">' + ['', 'Must see', 'Worth the detour', 'Deep cut'][p.t] + '</span> <span class="in">· ' + esc(area) + ' · ' + esc(D.name) + '</span>';
    return '<li class="pl' + (closed ? ' pl--closed' : '') + '" id="sv-' + esc(k.replace(/\//g, '--') + '-' + id) + '" data-t="' + p.t + '"' + (closed ? ' data-closed' : '') + ' style="--area:' + esc(col) + '">' +
      '<div class="pl-cover" aria-hidden="true">' + (g.length && g.length <= 7 ? '<span class="pl-vert' + (g.length > 4 ? ' long' : '') + '">' + esc(g.join('')) + '</span>'
        : '<span class="pl-ini">' + esc((base.replace(/^(The|La|Le|El|Il)\s+/i, '').match(/[A-Za-z0-9À-ɏ]/) || ['·'])[0]) + '</span>') + '</div>' +
      '<p class="pl-e"><span class="pl-num" aria-label="Number ' + (i + 1) + ' on the map">' + (i + 1) + '</span> ' + eye + '</p>' +
      '<h3 class="pl-n"><a href="' + esc(href) + '">' + esc(base) + (nat ? ' <span class="nat">(' + esc(nat) + ')</span>' : '') + '</a></h3>' +
      (p.w ? '<p class="pl-w">' + esc(p.w) + '</p>' : '') +
      '<p class="pl-s"><span class="lbl">Recommended by</span> <span>' + (srcs.length ? esc(srcs.slice(0, 3).join(', ')) + (srcs.length > 3 ? ' +' + (srcs.length - 3) : '') : 'Added by the guide (general knowledge)') + '</span></p>' +
      (S.shared ? '' : '<p class="pl-x"><button type="button" class="pl-save" data-sv="save" data-ref="' + esc(ref) + '" aria-pressed="' + saved + '" aria-label="' + (saved ? 'Saved: ' : 'Save ') + esc(base) + '">' + (saved ? 'Saved' : 'Save') + '</button></p>') +
      '<div class="sv-x">' + (S.shared ? '' :
        '<details><summary class="btn btn-ghost">' + ico('list') + 'Lists</summary><div class="pop">' + (inL || '<span class="sm">No named lists yet — make one with “New list”.</span>') + '</div></details>' +
        '<button type="button" class="btn btn-ghost" data-sv="been" data-ref="' + esc(ref) + '" aria-pressed="' + b + '">' + ico('stamp') + (b ? 'Been there ✓' : 'Been there') + '</button>') +
      (pos ? '<details><summary class="btn btn-ghost">' + ico('directions') + 'Open in maps</summary><div class="pop">' +
        '<a class="btn btn-quiet" href="https://maps.apple.com/?daddr=' + pos + '"' + NT + '>Apple Maps</a><a class="btn btn-quiet" href="https://www.google.com/maps/search/?api=1&amp;query=' + pos + '"' + NT + '>Google Maps</a>' +
        '<a class="btn btn-quiet" href="https://www.openstreetmap.org/?mlat=' + p.la + '&amp;mlon=' + p.ln + '#map=17/' + p.la + '/' + p.ln + '"' + NT + '>OpenStreetMap</a></div></details>' : '') + '</div>' +
      (b ? '<span class="stamp">Been<br>there</span>' : '') + '</li>';
  }

  function paint() {
    var S = state(), ls = lists(), s = Cleo.saved.all(), b = been();
    var keys = S.refs.map(pg).filter(function (k, i, a) { return k && a.indexOf(k) === i; });
    var tabs = S.shared ? '' : '<nav class="sv-tabs listtabs" aria-label="Your lists">' +
      [['all', 'All saved', Object.keys(s).length], ['been', 'Been there', Object.keys(b).length]].concat(ls.map(function (l) { return [l.id, l.n, l.r.length]; }))
        .map(function (t) { return '<button type="button" class="pill" data-sv="tab" data-v="' + esc(t[0]) + '" aria-pressed="' + (S.v === t[0]) + '">' + esc(t[1]) + '<span class="n">' + t[2] + '</span></button>'; }).join('') +
      '<button type="button" class="pill new" data-sv="new">' + ico('plus') + 'New list</button></nav>';
    var acts = (S.list ? '<div class="listmenu"><button type="button" class="btn btn-ghost" data-sv="rename">' + ico('edit') + 'Rename</button><button type="button" class="btn btn-quiet danger" data-sv="delete">Delete list</button></div>' : '') +
      '<div class="sv-acts exportbar"><span class="lbl">Take it with you</span>' + (S.shared ? ''
      : '<button type="button" class="btn btn-primary" data-sv="share"' + (S.refs.length ? '' : ' disabled') + '>' + ico('share') + 'Share link</button>') +
      // FE-C W9-7 hook: a portrait share image of this list (share-card.js, loaded on tap by core)
      (S.refs.length ? '<button type="button" class="btn btn-ghost" data-cleo-card="list" data-refs="' + esc(Cleo.listCodec.encode(S.refs)) + '" data-name="' + esc(S.name) + '">' + ico('share') + 'Share as an image</button>' : '') +
      (S.refs.length ? '<details class="exp"><summary class="btn btn-ghost">' + ico('download') + 'Export</summary><div class="pop"><button type="button" class="btn btn-quiet" data-sv="kml">KML (Google Earth, My Maps)</button>' +
        '<button type="button" class="btn btn-quiet" data-sv="geojson">GeoJSON</button>' + (S.shared ? '' : '<button type="button" class="btn btn-quiet" data-sv="json">Backup of all lists (JSON)</button>') + '</div></details>' : '') +
      // FE-C W9-4 hook: "Make a trip" from this list (trip.html builds it; nothing here is written)
      (S.refs.length ? '<a class="btn btn-ghost" data-cleo-trip href="trip.html#' + (S.shared ? 'list=' + Cleo.listCodec.encode(S.refs) + '&amp;n=' + encodeURIComponent(S.name) : 'from=' + encodeURIComponent(S.v)) + '">Make a trip</a>' : '') +
      (S.shared ? '' : '<button type="button" class="btn btn-ghost" data-sv="pick">Import backup</button><input type="file" accept="application/json,.json" data-sv="import" hidden>') +
      '</div>';
    var head = S.shared ? '<div class="sv-banner banner shared"><span class="eyebrow">Shared with you</span><h2>' + esc(S.name) + '</h2><p>A shared list of ' + S.refs.length + ' places — read only. It came as a link; nothing was stored on a server.</p>' +
      '<p><button type="button" class="btn" data-sv="copy">' + ico('copy') + 'Save a copy</button></p></div>' : '<div class="listhead"><span class="eyebrow">' + (S.list ? 'Your list' : 'Saved') + '</span><h2 class="d2">' + esc(S.name) + '</h2><p class="device-note">' + S.refs.length + (S.refs.length === 1 ? ' place' : ' places') + ' · saved on this device only — no account needed.</p></div>';
    box.innerHTML = '<div class="sv-top">' + head + tabs + acts + '<div id="sv-form"></div></div><div class="sv-split"><div class="sv-map" id="sv-map" role="img" aria-label="Map of the places in this list"><p class="note">The map appears when it can load. Every place is listed either way.</p></div><div id="sv-body"><p>Loading ' + S.refs.length + ' places…</p></div></div>';
    if (!S.refs.length) {
      d.getElementById('sv-body').innerHTML = '<div class="sv-empty"><h2>' + (S.v === 'been' ? 'No “been there” stamps yet' : S.list ? 'This list is empty' : 'Nothing saved yet') + '</h2><p>' +
        (S.list ? 'Add places from any card here with “Lists”, or save places in a guide first.' : 'Tap Save on any place in a guide and it appears here, on this device. Mark places you’ve visited with “Been there” in their sheet.') +
        '</p><a class="btn btn-primary" href="index.html">Browse the guides</a></div>';
      view = []; drawMap(); return;
    }
    load(keys).then(function () {
      var gone = S.refs.filter(function (r) { var D = data[pg(r)]; return !D || !D.by[idOf(r)]; }), n = 0;
      view = S.refs.filter(function (r) { return gone.indexOf(r) < 0; });
      var html = keys.map(function (k) {
        var D = data[k], rs = view.filter(function (r) { return pg(r) === k; }); if (!D || !rs.length) return '';
        return '<section class="sv-city"><h2><a href="' + esc(D.href) + '">' + esc(D.name) + '</a><span class="sm">' + rs.length + (rs.length === 1 ? ' place' : ' places') + '</span></h2><ul class="saved-cards">' +
          rs.map(function (r) { return card(r, n++, S); }).join('') + '</ul></section>';
      }).join('');
      // order the map numbers the same way the cards are numbered (grouped by city)
      view = [].concat.apply([], keys.map(function (k) { return view.filter(function (r) { return pg(r) === k; }); }));
      if (gone.length) html += '<ul class="saved-cards"><li class="gone">' + gone.length + (gone.length === 1 ? ' saved place is' : ' saved places are') + ' no longer listed in a guide (' + esc(gone.map(idOf).join(', ')) + '). ' +
        (S.shared ? 'The link may be older than the guide.' : '<button type="button" class="btn btn-quiet" data-sv="forget">Remove from this list</button>') + '</li></ul>';
      d.getElementById('sv-body').innerHTML = html; drawMap();
    }, function () { d.getElementById('sv-body').innerHTML = '<p>' + S.refs.length + ' saved places. The guides’ data couldn’t load to show them; try again when online.</p>'; });
  }

  function drawMap() {
    var el = d.getElementById('sv-map'); if (!el) return;
    var go = function () {
      var L = window.L; if (!L || !L.map) return;
      if (map) { try { map.remove(); } catch (e) {} map = null; }
      var pts = view.map(function (r) { var p = data[pg(r)] && data[pg(r)].by[idOf(r)]; return p && p.la != null ? [r, [p.la, p.ln]] : null; });
      if (!pts.some(Boolean)) return;
      el.innerHTML = ''; map = L.map(el, { scrollWheelZoom: false });
      var t = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
      if (Cleo.watchTiles) Cleo.watchTiles(t, function () { if (Cleo.mapFallback) Cleo.mapFallback(el, map); map = null; });
      var b = [];
      pts.forEach(function (x, i) { if (!x) return; b.push(x[1]);
        L.circleMarker(x[1], { radius: 8, weight: 2, color: '#fff', fillColor: '#1c1a17', fillOpacity: 1 }).bindTooltip(String(i + 1), { permanent: true, direction: 'center', className: 'pin-n', opacity: 1 })
          .on('click', function () { var c = d.getElementById('sv-' + pg(x[0]).replace(/\//g, '--') + '-' + idOf(x[0])); if (c) { c.scrollIntoView({ block: 'center', behavior: 'smooth' }); var a = c.querySelector('.sv-n a'); if (a) a.focus({ preventScroll: true }); } }).addTo(map); });
      map.fitBounds(L.latLngBounds(b), { padding: [36, 36], maxZoom: 15 });
    };
    if (window.L) { go(); return; }
    if (L0++) return;
    var base = (Cleo.root || '') + 'assets/vendor/leaflet/', l = d.createElement('link'), s = d.createElement('script');
    l.rel = 'stylesheet'; l.href = base + 'leaflet.css'; d.head.appendChild(l);
    s.src = base + 'leaflet.js'; s.async = true; s.onload = function () { drawMap(); }; d.head.appendChild(s);
  }

  function file(name, type, text) {
    var a = d.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name; d.body.appendChild(a); a.click(); a.remove();
  }
  function feats() {
    return view.map(function (r) { var D = data[pg(r)], p = D && D.by[idOf(r)]; return p && p.la != null ? { r: r, p: p, D: D } : null; }).filter(Boolean);
  }
  function form(label, val, ok) {
    var f = d.getElementById('sv-form');
    f.innerHTML = '<form class="sv-form"><label for="sv-in">' + esc(label) + '</label><input id="sv-in" maxlength="60" required value="' + esc(val) + '"><button class="btn btn-primary">Save</button><button type="button" class="btn btn-quiet" data-sv="cancel">Cancel</button></form>';
    var i = f.querySelector('input'); i.focus(); i.select();
    f.querySelector('form').onsubmit = function (e) { e.preventDefault(); var v = i.value.trim(); if (v) ok(v); };
  }
  var uid = function () { return 'l' + Date.now().toString(36); };

  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-sv]'); if (!b || b.tagName === 'INPUT') return;
    var k = b.getAttribute('data-sv'), S = state(), ref = b.getAttribute('data-ref'), ls = lists(), name = S.name;
    if (k === 'tab') location.hash = '#v=' + encodeURIComponent(b.getAttribute('data-v'));
    else if (k === 'save') { Cleo.saved.toggle(ref); }
    else if (k === 'been') { var bb = been(); if (bb[ref]) delete bb[ref]; else bb[ref] = 1; st.set('been', bb); paint(); }
    else if (k === 'share') Cleo.share(name + ' — Cleo', location.href.split('#')[0] + '#list=' + Cleo.listCodec.encode(S.refs) + '&n=' + encodeURIComponent(S.v === 'all' ? 'My Cleo list' : name));
    else if (k === 'copy') { var nl = { id: uid(), n: name, r: S.refs.slice() }; setLists(ls.concat([nl])); Cleo.saved.add(S.refs); location.hash = '#v=' + nl.id; toast('Saved a copy: “' + name + '”, ' + S.refs.length + ' places.'); }
    else if (k === 'new') form('Name your new list', '', function (v) { var nl = { id: uid(), n: v, r: [] }; setLists(lists().concat([nl])); location.hash = '#v=' + nl.id; });
    else if (k === 'rename') form('Rename this list', name, function (v) { setLists(lists().map(function (l) { if (l.id === S.v) l.n = v; return l; })); paint(); });
    else if (k === 'delete') { if (window.confirm('Delete the list “' + name + '”? The places stay saved.')) { setLists(ls.filter(function (l) { return l.id !== S.v; })); location.hash = '#v=all'; } }
    else if (k === 'pick') d.querySelector('input[data-sv="import"]').click();
    else if (k === 'cancel') d.getElementById('sv-form').innerHTML = '';
    else if (k === 'forget') {
      var keep = view.slice();
      if (S.list) setLists(ls.map(function (l) { if (l.id === S.v) l.r = keep; return l; }));
      else if (S.v === 'been') { var b2 = been(), nb = {}; keep.forEach(function (r) { if (b2[r]) nb[r] = 1; }); st.set('been', nb); }
      else { var s = Cleo.saved.all(); S.refs.forEach(function (r) { if (keep.indexOf(r) < 0) delete s[r]; }); st.set('saved', s); Cleo.emit('cleo:saved', {}); }
      paint();
    }
    else if (k === 'kml') {
      var x = function (s) { return String(s).replace(/[<&>]/g, function (c) { return { '<': '&lt;', '&': '&amp;', '>': '&gt;' }[c]; }); };
      file('cleo-list.kml', 'application/vnd.google-earth.kml+xml', '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>' + x(name) + '</name>' +
        feats().map(function (f) { return '<Placemark><name>' + x(f.p.n) + '</name><description>' + x([f.D.name, f.p.ad || ''].join(' — ')) + '</description><Point><coordinates>' + f.p.ln + ',' + f.p.la + '</coordinates></Point></Placemark>'; }).join('') + '</Document></kml>');
    }
    else if (k === 'geojson') file('cleo-list.geojson', 'application/geo+json', JSON.stringify({ type: 'FeatureCollection', name: name, features: feats().map(function (f) {
      return { type: 'Feature', geometry: { type: 'Point', coordinates: [f.p.ln, f.p.la] }, properties: { name: f.p.n, guide: f.D.name, address: f.p.ad || '', ref: f.r, url: location.href.split('saved.html')[0] + f.D.href + '#p=' + f.p.id } };
    }) }, null, 1));
    else if (k === 'json') file('cleo-lists-backup.json', 'application/json', JSON.stringify({ cleo: 'lists', v: 1, saved: Cleo.saved.all(), been: been(), lists: lists() }, null, 1));
  });
  d.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches && t.matches('[data-sl]')) {
      var id = t.getAttribute('data-sl'), ref = t.getAttribute('data-ref');
      setLists(lists().map(function (l) { if (l.id === id) { var i = l.r.indexOf(ref); if (t.checked && i < 0) l.r.push(ref); if (!t.checked && i >= 0) l.r.splice(i, 1); } return l; }));
      var keep = t.closest('details'); paint(); if (keep) toast(t.checked ? 'Added to the list.' : 'Removed from the list.');
    } else if (t.matches && t.matches('[data-sv="import"]') && t.files && t.files[0]) {
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var j = JSON.parse(rd.result); if (!j || j.cleo !== 'lists') throw new Error('not a Cleo backup');
          var s = Cleo.saved.all(); Object.keys(j.saved || {}).forEach(function (r) { if (!s[r]) s[r] = j.saved[r]; }); st.set('saved', s);
          var bb = been(); Object.keys(j.been || {}).forEach(function (r) { bb[r] = 1; }); st.set('been', bb);
          var ls = lists(), have = ls.map(function (l) { return l.id; }); (Array.isArray(j.lists) ? j.lists : []).forEach(function (l) { if (l && l.id && Array.isArray(l.r) && have.indexOf(l.id) < 0) ls.push({ id: String(l.id), n: String(l.n || 'Imported list'), r: l.r.map(String) }); });
          setLists(ls); Cleo.emit('cleo:saved', {}); toast('Backup restored on this device.');
        } catch (err) { toast('That file isn’t a Cleo backup, so nothing changed.'); }
      };
      rd.readAsText(t.files[0]);
    }
  });
  window.addEventListener('hashchange', paint);
  d.addEventListener('cleo:saved', function () { if (!d.querySelector('.sv-x details[open]')) paint(); });
  paint();
})();
