/* Cleo beta — sheet.js (FE-A): place detail sheet (M1-12) from the card + page blob. Bottom sheet on mobile,
 * side panel on desktop (map stays visible); Close/Esc/Back close it; focus trapped, then restored. */
(function () {
  'use strict';
  var Cleo = window.Cleo || {}, C = Cleo.city, d = document, host = d.getElementById('cleo-sheet');
  if (!C || !host) return;
  var NT = ' rel="noopener" target="_blank"', esc = C.esc, icon = C.icon, info = C.info, card = null, byNav = false, navs = 0;
  window.addEventListener('hashchange', function () { navs++; });
  var q = function (s, el) { return (el || d).querySelector(s); };
  var dom = function (u) { return (/^https?:\/\/(?:www\.)?([^/?#]+)/i.exec(u || '') || [])[1] || ''; };
  var fact = function (i, b, m) { return '<div class="fact">' + icon(i) + '<div><b>' + b + '</b>' + (m || '') + '</div></div>'; };
  // QA-59d: an icon never wraps onto a line of its own — it rides with the last word
  var glue = function (t, i) { var w = String(t).split(' '), last = w.pop(); return (w.length ? esc(w.join(' ')) + ' ' : '') + '<span class="nw">' + esc(last) + ' ' + icon(i) + '</span>'; };
  var ref = function () { return C.key + '/' + C.pid(card); };

  function build(c) {
    var id = C.pid(c), name = q('.pl-n', c).textContent, a = c.getAttribute('data-a'), ll = c.getAttribute('data-ll');
    var pz = String((info.prov || {})[id] || ''), pb = pz.indexOf('|'), pv = pz ? [{ h: 'high', m: 'med', l: 'low', u: 'unverified' }[pz.charAt(0)] || '', (info.pd || [])[parseInt(pz.slice(1), 10)] || '', pb > 0 ? pz.slice(pb + 1) : ''] : [], closed = c.hasAttribute('data-closed'), chk = c.getAttribute('data-checked') || '';
    var k = q('.pl-k', c), ad = q('.pl-ad', c), w = q('.pl-w', c), tier = q('.pl-e .tier', c), url = Cleo.views ? Cleo.views.shareUrl(id) : location.href.split('#')[0] + '#p=' + encodeURIComponent(id);
    var lenses = (c.getAttribute('data-g') || '').split(' ').filter(Boolean).map(function (x) { return ['c', x]; })
      .concat((c.getAttribute('data-cz') || '').split(' ').filter(Boolean).map(function (x) { return ['cz', x]; }));
    var note = !k ? '' : k.classList.contains('note') ? '<div class="note"><span class="eyebrow">Your guide’s note</span><p>' + k.innerHTML.replace(/<span class="lbl">[^<]*<\/span>/, '') + '</p></div>'
      : '<div class="lookfor"><b class="sm">Look for:</b> ' + k.textContent.replace(/^Look for\s*/, '').split(/\s*[,;·]\s*/).filter(Boolean).map(function (x) { return '<span class="tag">' + esc(x) + '</span>'; }).join('') + '</div>';
    var src = [].map.call(c.querySelectorAll('.pl-s button.src'), function (b) {
      var g = b.getAttribute('data-src'), s = (info.src || {})[g] || [b.textContent, 0, 0, '', ''];
      return '<li' + (s[3] ? ' class="auth"' : '') + ' data-g="' + esc(g) + '"><span class="mono" aria-hidden="true">' + esc(s[0].charAt(0)) + '</span><div><span class="nm">' + esc(s[0]) + '</span>' +
        '<span class="ttl">' + esc([s[3] && s[3] + ' (authority)', dom(s[4])].filter(Boolean).join(' · ')) + '</span></div><div class="acts">' +
        '<button class="go" data-src="' + esc(g) + '">All ' + s[1] + ' ' + esc(info.name) + ' picks citing ' + glue(s[0], 'chev-r') + '</button>' +
        (s[4] ? '<a class="out" href="' + esc(s[4]) + '"' + NT + '>' + glue('Read', 'external') + '<span class="vh"> ' + esc(s[0]) + '</span></a>' : '') + '</div></li>';
    }).join('') + (q('.pl-s .added', c) ? '<li><span class="mono" aria-hidden="true">·</span><div><span class="nm">Added by the guide</span><span class="ttl">General knowledge — not from a cited source</span></div></li>' : '');
    // W8 (D12/D13 "sources always visible"): who recommends it, right under the name; the full list follows Why it's here
    var by = [].map.call(c.querySelectorAll('.pl-s button.src'), function (b) { return ((info.src || {})[b.getAttribute('data-src')] || [b.textContent])[0]; }),
      byline = by.length ? '<p class="sh-by">Recommended by <b>' + esc(by[0]) + '</b>' + (by.length > 1 ? ' and ' + (by.length - 1) + ' more' : '') + '</p>'
        : q('.pl-s .added', c) ? '<p class="sh-by">Added by the guide (general knowledge)</p>' : '';
    // closures are loud: a banner above the name with the check date and source, and Directions is never the primary action
    var shut = closed ? '<div class="closed-banner" role="note"><b>Closed</b><span>Kept for the record, not as a suggestion' + (chk ? ' · checked ' + esc(chk) : '') + (pv[2] ? ' · per ' + esc(pv[2]) : '') + '</span></div>' : '';
    var dir = ll ? '<div class="links"><a class="btn btn-ghost" href="https://maps.apple.com/?daddr=' + ll + '"' + NT + '>Apple Maps</a>' +
      '<a class="btn btn-ghost" href="https://www.openstreetmap.org/?mlat=' + ll.replace(',', '&amp;mlon=') + '#map=17/' + ll.replace(',', '/') + '"' + NT + '>OpenStreetMap</a>' +
      '<a class="btn btn-ghost" href="https://www.google.com/maps/dir/?api=1&amp;destination=' + ll + '"' + NT + '>Google Maps</a></div>' : '';
    var saved = Cleo.saved && Cleo.saved.has(C.key + '/' + id), been = !!C.been.all()[C.key + '/' + id];
    // header row keeps Close OFF the plate (ROUND-1 #4); the plate = area locator (verified pins) + native/initial + glyph
    // DES 15.10 (g) sheet locator: the area's own pins (cards' data-ll, projected with the area art's frame) + this place lit
    var art = (info.art || {})[a], loc = '';
    if (art && ll && Cleo.art) {
      var pr = { pad: art[3], box: art.slice(4, 8), kx: art[8], ky: art[9] }, dot = function (v, me) { var p = v.split(','), xy = Cleo.art.xy(pr, +p[0], +p[1]);
        return xy[0] >= 0 && xy[1] >= 0 && xy[0] <= art[1] && xy[1] <= art[2] ? '<circle' + (me ? ' class="me" r="' + (art[1] / 22).toFixed(1) + '"' : ' r="' + (art[1] / 70).toFixed(1) + '"') + ' cx="' + xy[0].toFixed(1) + '" cy="' + xy[1].toFixed(1) + '"/>' : ''; };
      loc = '<div class="locator"><svg viewBox="0 0 ' + art[1] + ' ' + art[2] + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Where it is in ' + esc(C.label('a', a)) + '">' +
        [].slice.call(d.querySelectorAll('li.pl[data-a="' + a + '"][data-ll]')).concat(Cleo.defer ? Cleo.defer.peek().filter(function (x) { return x.getAttribute('data-a') === a && x.getAttribute('data-ll'); }) : [])
          .map(function (x) { return x === c ? '' : dot(x.getAttribute('data-ll')); }).join('') + dot(ll, 1) + '</svg></div>';
    }
    var inDay = C.day && C.day.has(id), planned = info.days && Object.keys(info.days).length;
    // W3 A-05: "n of N in this view" + previous / next over the lensed set in view order (the visible list's DOM order:
    // area order, then rank), and "No. r of n in {area}". Previous / next wrap at the ends.
    var set = [].slice.call(d.querySelectorAll('li.pl')).filter(function (x) { return !x.hidden; }), i = set.indexOf(c);
    if (i < 0) { set = [c]; i = 0; }
    // W7: with no lens on, "n of N" counts the whole view order, stamped or not (Cleo.defer.order, platform W7), so a far
    // #p= reads "k of 488", not "k of the cards stamped so far"; an unstamped neighbour is reached through its #p= route
    var ord = Cleo.defer && Cleo.defer.order && set.length === d.querySelectorAll('li.pl').length ? Cleo.defer.order() : null, oi = ord ? ord.map(function (x) { return x.id; }).indexOf(c.id) : -1;
    if (ord && ord.length > set.length && oi >= 0) {
      var stub = function (x) { return x.el || { id: x.id, stub: 1 }; };
      set = ord.map(stub); i = oi;
    }
    var nm = function (x) { return x.stub ? '' : C.name(x); };
    var pv1 = set[(i - 1 + set.length) % set.length], nx1 = set[(i + 1) % set.length], vw = d.documentElement.getAttribute('data-view') || 'atlas', vname = vw.charAt(0).toUpperCase() + vw.slice(1);   // set before paint, so right even before views.js runs
    var navRow = '<div class="sh-nav"><button class="btn btn-quiet" data-sh="all">' + icon('chev-l') + '<span>All ' + info.total + ' places</span></button><span class="sm" data-sh-pos>' + (i + 1) + ' of ' + set.length + '<span class="long"> in this ' + esc(vname) + ' view</span></span>' +
      (set.length > 1 ? '<span class="pn"><button class="btn btn-icon btn-ghost" data-sh="go" data-to="' + esc(C.pid(pv1)) + '" aria-label="' + (nm(pv1) ? 'Previous: ' + esc(nm(pv1)) : 'Previous place') + '">' + icon('chev-l') + '</button>' +
        '<button class="btn btn-icon btn-ghost" data-sh="go" data-to="' + esc(C.pid(nx1)) + '" aria-label="' + (nm(nx1) ? 'Next: ' + esc(nm(nx1)) : 'Next place') + '">' + icon('chev-r') + '</button></span>' : '') + '</div>';
    // W8 (R7 gap 2f): "No. k of n in {area}" = this place's rank in its area over the whole view order (stamped or not), so
    // n is the area's full count and k ≤ n always (the pin number is a separate thing and stays on the badges line)
    var inA = (Cleo.defer && Cleo.defer.order ? Cleo.defer.order() : [].map.call(d.querySelectorAll('li.pl'), function (x) { return { id: x.id, a: x.getAttribute('data-a') }; }))
      .filter(function (x) { return x.a === a; }).map(function (x) { return x.id; }), k = +c.getAttribute('data-rank') || inA.indexOf(c.id) + 1;   // QA-50: k is the data's rank in its area (data-rank), never the card's DOM or stamp position
    var rank = k > 0 ? '<p class="sm sh-rank">No. ' + k + ' of ' + inA.length + ' in ' + esc(C.label('a', a)) + '</p>' : '';
    // Close by: the 4 nearest open places with a pin, straight-line (never a walking time we don't hold)
    var near = '';
    if (ll) {
      var p0 = ll.split(','), rad = Math.PI / 180, km = function (q) { var x = q.split(','), dl = (x[0] - p0[0]) * rad, dn = (x[1] - p0[1]) * rad;
        var h = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(p0[0] * rad) * Math.cos(x[0] * rad) * Math.sin(dn / 2) * Math.sin(dn / 2); return 12742 * Math.asin(Math.sqrt(h)); };
      near = [].slice.call(d.querySelectorAll('li.pl[data-ll]:not([data-closed])')).filter(function (x) { return x !== c; })
        .map(function (x) { return [km(x.getAttribute('data-ll')), x]; }).sort(function (x, y) { return x[0] - y[0]; }).slice(0, 4)
        .map(function (z) { return '<li><a href="#p-' + esc(C.pid(z[1])) + '">' + esc(C.name(z[1])) + '</a> <span class="sm">' + (z[0] < 1 ? Math.round(z[0] * 100) * 10 + ' m' : z[0].toFixed(1) + ' km') + ' straight-line</span></li>'; }).join('');
      if (near) near = '<div class="closeby"><h3 class="section-t">Close by</h3><ul>' + near + '</ul></div>';
    }
    // one honest primary deep link: the official site only when a source IS the official site; else the first source's own page
    var gs = [].map.call(c.querySelectorAll('.pl-s button.src'), function (b) { return b.getAttribute('data-src'); }), og = gs.filter(function (g) { return /official/.test(g); })[0];
    var pg = og || gs.filter(function (g) { return ((info.src || {})[g] || [])[4]; })[0], ps = pg && (info.src || {})[pg];
    var primary = pg ? '<a class="btn btn-primary primary-link" data-g="' + esc(pg) + '"' + (ps && ps[4] ? ' href="' + esc(ps[4]) + '"' : ' hidden') + NT + '>' + (og ? 'Visit the official site' : 'Read what ' + esc(ps[0]) + ' says') + ' ' + icon('external') + '</a>' : '';
    var exp = vw === 'gallery';    // A-04: in Gallery the sheet is the experience page
    return '<div class="sheet detail' + (exp ? ' exp' : '') + '" role="dialog" aria-modal="true" aria-labelledby="sh-t"><span class="grab" aria-hidden="true"></span>' +
      '<button class="btn btn-icon close" data-sh="x" aria-label="Close">' + icon('close') + '</button>' + navRow +
      '<div class="hero-plate' + (q('.pl-photo', c) ? ' has-photo' : '') + (closed ? ' is-closed' : '') + '" style="--area:' + esc(((info.areas || {})[a] || {}).c || 'var(--city)') + '">' + (q('.pl-photo', c) ? fullCap(q('.pl-photo', c)) : '') + loc + '<div class="plate-art" aria-hidden="true">' + q('.pl-cover', c).innerHTML + '</div></div>' +
      '<div class="content">' + shut + '<div class="badges">' + (closed ? '' : tier ? tier.outerHTML.replace('class="tier', 'class="tier lg') : '') +
      '<span class="sm">in ' + esc(C.label('a', a)) + ' · pin ' + c.getAttribute('data-n') + '</span></div><h2 class="d2" id="sh-t">' + (q('.pl-vert', c) && q('.pl-n .nat', c) ? esc(C.name(c)) + ' <span class="vh">' + esc(q('.pl-n .nat', c).textContent) + '</span>' : q('.pl-n a', c).innerHTML) + '</h2>' +
      byline + rank + (w ? (exp ? '<h3 class="section-t">Why it’s here</h3>' : '') + '<p class="why">' + w.innerHTML + '</p>' : '') + note +
      '<div><h3 class="section-t">Recommended by</h3><ul class="srclist">' + src + '</ul></div>' +
      (lenses.length ? '<div><h3 class="section-t">Part of</h3><div class="pills">' + lenses.map(function (x) { return '<button class="pill" data-sh="lens" data-f="' + x[0] + '" data-v="' + esc(x[1]) + '">' + esc(C.label(x[0], x[1])) + '</button>'; }).join('') + '</div></div>' : '') + near + '<div class="plan"><h3 class="section-t">Plan your visit</h3>' + (primary ? '<p>' + primary + '</p>' : '') +
      (ad || dir ? fact('pin', ad ? esc(ad.textContent) : 'Directions', dir) : '') +
      (pv[0] ? fact('check', 'Pinned to the door: ' + esc(pv[0]) + ' confidence', '<span class="muted" data-pin>' + (pv[1] ? 'verified ' + esc(pv[1]) : '') + '</span>') : '') +
      (chk ? fact('stamp', 'Status checked ' + esc(chk), '<span class="muted">' + (closed ? 'Closed' : 'Open when last checked') + '</span>') : '') +
      fact('info', 'Hours and prices aren’t in our data', '<span class="muted">Check before you go.</span>') +
      '<div class="fact">' + icon('stamp') + '<div><button class="btn btn-ghost" data-sh="been" aria-pressed="' + been + '">' + (been ? 'Been there ✓' : 'Mark as been there') + '</button></div></div>' +
      (planned && !closed && ll ? '<div class="fact">' + icon('route') + '<div><button class="btn btn-ghost" data-sh="day" aria-pressed="' + !!inDay + '">' + (inDay ? 'In your day ✓' : 'Add to your day in ' + esc(C.label('a', a))) + '</button></div></div>' : '') +
      '<p class="sm"><a href="https://github.com/alvations/cleo-guide/issues/new?title=' + encodeURIComponent('Correction: ' + name + ' (' + info.name + ')') + '"' + NT + '>Suggest a correction</a></p></div></div>' +
      '<div class="actions"><button class="btn btn-ghost" data-sh="save" aria-pressed="' + !!saved + '">' + icon('heart') + '<span>' + (saved ? 'Saved' : 'Save') + '</span></button>' +
      (ll ? '<a class="btn ' + (closed ? 'btn-ghost' : 'btn-primary') + '" href="https://www.openstreetmap.org/directions?route=%3B' + encodeURIComponent(ll) + '"' + NT + '>' + icon('directions') + '<span>' + (closed ? 'Where it was' : 'Directions') + '</span></a>' : '<span></span>') +
      '<button class="btn btn-ghost" data-sh="share" data-url="' + esc(url) + '">' + icon('share') + '<span>Share</span></button></div></div>';
  }
  // Per-article links from the page dataset (same origin, cached by the service worker); until it arrives: the publisher.
  function deep(c) {
    // perf audit PERF-04: the links slice (data/links/<page>.json, ~7× smaller than the page dataset) when present
    var id = C.pid(c), fromPage = function (j) { var kg = {}, rec = (j.places || []).filter(function (p) { return p.id === id; })[0], p = {};
      (j.sourceIndex || []).forEach(function (s) { (s.entries || []).forEach(function (e) { kg[e.key] = s.id; }); });
      p[id] = rec ? rec.s : []; return { g: kg, p: p }; };
    var got = Cleo.links ? Cleo.links(info.key).catch(function () { return Cleo.pageData(info.key).then(fromPage); })
      : Cleo.pageData ? Cleo.pageData(info.key).then(fromPage) : null;
    if (got) got.then(function (j) {
      if (card !== c) return;
      var kg = j.g || {};
      (j.p && j.p[id] || []).forEach(function (x) {
        var li = kg[x[0]] && host.querySelector('.srclist li[data-g="' + kg[x[0]] + '"]'), u = /^https?:\/\/\S+$/.test(x[1] || '') ? x[1] : '';
        if (!li || !u) return;
        var a = q('a.out', li); if (!a) { q('.acts', li).insertAdjacentHTML('beforeend', '<a class="out"' + NT + '>' + glue('Read', 'external') + '</a>'); a = q('a.out', li); }
        a.href = u; q('.ttl', li).textContent = dom(u);
        var pr = host.querySelector('.primary-link[data-g="' + kg[x[0]] + '"]'); if (pr) { pr.href = u; pr.hidden = false; }
      });
    }).catch(function () {});
  }
  C.trap(host, function () { api.close(); });
  host.addEventListener('click', function (e) {
    var t = e.target, b = t.closest && t.closest('[data-sh],button.go'), v;
    if (t === host) { api.close(); return; } if (!b) return;
    var k = b.getAttribute('data-sh');
    if (k === 'x') api.close();
    else if (k === 'all') { api.close(true); C.go({}); }
    else if (k === 'go') { var r = Cleo.route.parse(); r.p = b.getAttribute('data-to'); C.go(r, true); }
    else if (k === 'save') { v = Cleo.saved && Cleo.saved.toggle(ref()); b.setAttribute('aria-pressed', String(!!v)); b.lastChild.textContent = v ? 'Saved' : 'Save'; }
    else if (k === 'been') { v = C.been.toggle(ref()); b.setAttribute('aria-pressed', String(v)); b.textContent = v ? 'Been there ✓' : 'Mark as been there'; }
    else if (k === 'day') { var cc = card; C.need('day', function () { var on = C.day.toggle(C.pid(cc)); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'In your day ✓' : 'Add to your day'; }); }
    else if (k === 'share') { if (Cleo.share) Cleo.share(q('#sh-t', host).textContent + ' — ' + info.name, b.getAttribute('data-url')); }
    else if (k === 'lens') { var o = {}; o[b.getAttribute('data-f')] = b.getAttribute('data-v'); api.close(true); C.go(o); }
    else { api.close(true); C.go({ src: b.getAttribute('data-src') }); }
  });
  d.addEventListener('cleo:toast', function (e) {   // core.js Cleo.share → clipboard; VOICE.md copy
    var el = d.createElement('p'); el.className = 'toast'; el.setAttribute('role', 'status');
    el.textContent = e.detail === 'Link copied' ? 'Link copied — it opens this exact view.' : String(e.detail);
    d.body.appendChild(el); setTimeout(function () { el.remove(); }, 2600);
  });
  // the media of the card a reader just tapped (its photo, else its calm cover), for the grow-into-sheet transition
  // the place detail shows the photo's full TASL credit (title, author, licence, source); the card carries the short form
  // (TASL: the short card credit names author, licence and source and keeps the file title on its source link; the detail
  // spells the title out in front)
  // W8 (QA-51; FE-A + platform): the sheet's media slot is up to ~1,024 px, so the card's `sizes` (≈ 25vw, or the 3×
  // density cap) would fetch the 500 w file and stretch it. The copy asks for the slot's width and never displays wider
  // than its largest file (no upscaling).
  var fullCap = function (f) { var x = f.cloneNode(true), cap = q('figcaption', x), t = cap && q('a[title]', cap), im = q('img', x);
    if (im) im.removeAttribute('data-sizes0');
    if (t && !q('.cap-t', cap)) cap.insertAdjacentHTML('afterbegin', '<span class="cap-t">' + esc(t.getAttribute('title')) + '</span> · ');
    if (im) { var mw = Math.max.apply(0, (im.getAttribute('srcset') || '').split(',').map(function (z) { return parseInt((/\s(\d+)w\s*$/.exec(z) || [])[1], 10) || 0; }).concat([+im.getAttribute('width') || 0]));
      im.setAttribute('sizes', '(min-width: 1024px) min(1024px, 88vw), 100vw'); im.setAttribute('loading', 'eager');
      if (mw) { im.style.maxWidth = mw + 'px'; x.style.setProperty('--ph-max', mw + 'px'); } }
    return x.outerHTML; };
  var grow = null;
  d.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('li.pl .pl-n a, li.pl > .pl-cover, li.pl > .pl-photo, li.gc .gc-a'); if (!t) return;
    var li = t.closest('li.pl, li.gc'), m = li && (q('.pl-photo img', li) || q('.pl-cover', li) || q('.cover', li));
    if (m && m.getBoundingClientRect().height > 0) grow = [m, Date.now()];
  }, true);
  var api = Cleo.sheet = {
    isOpen: function () { return !host.hidden; },
    open: function (c) {
      if (Cleo.tray) Cleo.tray.close(true);
      // W8 (R7 2d): a side panel only beside the Atlas map; elsewhere a centred dialog over a scrim
      var show = function () {
        card = c; byNav = navs > 0; host.innerHTML = build(c); host.hidden = false; host.classList.toggle('side', C.desk() && d.documentElement.getAttribute('data-view') === 'atlas'); if (!g && C.beat) C.beat(host, 'sh-in', 450);   // ROUND-3 #5: the sheet rises (DES CSS; off under reduced motion)
        if (!host.classList.contains('side')) d.body.style.overflow = 'hidden';
        q('[data-sh="x"]', host).focus({ preventScroll: true }); deep(c); if (C.onSheet) C.onSheet(c);
      };
      // W7 gap #1, the signature moment (design/beta/style/v2/MOTION.md): the tapped card media grows into the sheet's media.
      // Only on a real tap of that card (≤ 1 s ago), only where view transitions exist and motion is allowed; otherwise as before.
      var g = grow && Date.now() - grow[1] < 1000 && grow[0].isConnected && d.startViewTransition && C.moves && C.moves() ? grow[0] : null; grow = null;
      if (!g) { show(); return; }
      g.style.viewTransitionName = 'cleo-grow';
      try {
        var t = d.startViewTransition(function () { g.style.viewTransitionName = ''; show(); var h = q('.hero-plate', host); if (h) h.style.viewTransitionName = 'cleo-grow'; });
        t.finished.then(function () { var h = q('.hero-plate', host); if (h) h.style.viewTransitionName = ''; }, function () {});
      } catch (e) { g.style.viewTransitionName = ''; if (host.hidden || card !== c) show(); }
    },
    close: function (fromRoute) {
      if (host.hidden) return;
      host.hidden = true; host.innerHTML = ''; d.body.style.overflow = '';
      var back = card; card = null; if (back) { var l = q('.pl-n a', back); if (l && l.focus) l.focus({ preventScroll: true }); }
      if (fromRoute) return;
      var r = Cleo.route.parse(); if (!r.p && !/^#p-/.test(location.hash)) return;
      if (byNav && history.length > 1) history.back(); else { delete r.p; C.go(r, true); }
    }
  };
  if (Cleo.route.parse().p || /^#p-/.test(location.hash)) C.onRoute();
})();
