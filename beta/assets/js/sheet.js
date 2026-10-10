/* generated copy of tools/beta/client/sheet.js — do not edit here */
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
  var ref = function () { return C.key + '/' + C.pid(card); };

  function build(c) {
    var id = C.pid(c), name = q('.pl-n', c).textContent, a = c.getAttribute('data-a'), ll = c.getAttribute('data-ll');
    var pz = String((info.prov || {})[id] || ''), pb = pz.indexOf('|'), pv = pz ? [{ h: 'high', m: 'med', l: 'low', u: 'unverified' }[pz.charAt(0)] || '', (info.pd || [])[parseInt(pz.slice(1), 10)] || '', pb > 0 ? pz.slice(pb + 1) : ''] : [], closed = c.hasAttribute('data-closed'), chk = c.getAttribute('data-checked') || '';
    var k = q('.pl-k', c), ad = q('.pl-ad', c), w = q('.pl-w', c), tier = q('.pl-e .tier', c), url = location.href.split('#')[0] + '#p=' + encodeURIComponent(id);
    var lenses = (c.getAttribute('data-g') || '').split(' ').filter(Boolean).map(function (x) { return ['c', x]; })
      .concat((c.getAttribute('data-cz') || '').split(' ').filter(Boolean).map(function (x) { return ['cz', x]; }));
    var note = !k ? '' : k.classList.contains('note') ? '<div class="note"><span class="eyebrow">Your guide’s note</span><p>' + k.innerHTML.replace(/<span class="lbl">[^<]*<\/span>/, '') + '</p></div>'
      : '<div class="lookfor"><b class="sm">Look for:</b> ' + k.textContent.replace(/^Look for\s*/, '').split(/\s*[,;·]\s*/).filter(Boolean).map(function (x) { return '<span class="tag">' + esc(x) + '</span>'; }).join('') + '</div>';
    var src = [].map.call(c.querySelectorAll('.pl-s button.src'), function (b) {
      var g = b.getAttribute('data-src'), s = (info.src || {})[g] || [b.textContent, 0, 0, '', ''];
      return '<li' + (s[3] ? ' class="auth"' : '') + ' data-g="' + esc(g) + '"><span class="mono" aria-hidden="true">' + esc(s[0].charAt(0)) + '</span><div><span class="nm">' + esc(s[0]) + '</span>' +
        '<span class="ttl">' + esc([s[3] && s[3] + ' (authority)', dom(s[4])].filter(Boolean).join(' · ')) + '</span></div><div class="acts">' +
        '<button class="go" data-src="' + esc(g) + '">All ' + s[1] + ' ' + esc(info.name) + ' picks citing ' + esc(s[0]) + ' ' + icon('chev-r') + '</button>' +
        (s[4] ? '<a class="out" href="' + esc(s[4]) + '"' + NT + '>Read ' + icon('external') + '<span class="vh"> ' + esc(s[0]) + '</span></a>' : '') + '</div></li>';
    }).join('') + (q('.pl-s .added', c) ? '<li><span class="mono" aria-hidden="true">·</span><div><span class="nm">Added by the guide</span><span class="ttl">General knowledge — not from a cited source</span></div></li>' : '');
    var dir = ll ? '<div class="links"><a class="btn btn-ghost" href="https://maps.apple.com/?daddr=' + ll + '"' + NT + '>Apple Maps</a>' +
      '<a class="btn btn-ghost" href="https://www.openstreetmap.org/?mlat=' + ll.replace(',', '&amp;mlon=') + '#map=17/' + ll.replace(',', '/') + '"' + NT + '>OpenStreetMap</a>' +
      '<a class="btn btn-ghost" href="https://www.google.com/maps/dir/?api=1&amp;destination=' + ll + '"' + NT + '>Google Maps</a></div>' : '';
    var saved = Cleo.saved && Cleo.saved.has(C.key + '/' + id), been = !!C.been.all()[C.key + '/' + id];
    // header row keeps Close OFF the plate (ROUND-1 #4); the plate = area locator (verified pins) + native/initial + glyph
    var art = (info.art || {})[a], loc = '';
    if (art && ll && Cleo.art) {
      var p = ll.split(','), xy = Cleo.art.xy({ pad: art[3], box: art.slice(4, 8), kx: art[8], ky: art[9] }, +p[0], +p[1]);
      loc = '<figure class="loc" style="--ar:' + art[1] + '/' + art[2] + '"><img src="' + esc(art[0]) + '" alt="" decoding="async"><i style="left:' + (xy[0] / art[1] * 100).toFixed(1) + '%;top:' + (xy[1] / art[2] * 100).toFixed(1) + '%"></i>' +
        '<figcaption>Where in ' + esc(C.label('a', a)) + '</figcaption></figure>';
    }
    var inDay = C.day && C.day.has(id);
    return '<div class="sheet detail" role="dialog" aria-modal="true" aria-labelledby="sh-t"><span class="grab" aria-hidden="true"></span>' +
      '<button class="btn btn-icon close" data-sh="x" aria-label="Close">' + icon('close') + '</button>' +
      '<div class="hero-plate" style="--area:' + esc(((info.areas || {})[a] || {}).c || 'var(--city)') + '" aria-hidden="true">' + loc + q('.pl-cover', c).innerHTML + '</div>' +
      '<div class="content"><div class="badges">' + (closed ? '<span class="status closed">Closed · kept for the record</span>' : tier ? tier.outerHTML.replace('class="tier', 'class="tier lg') : '') +
      '<span class="sm">in ' + esc(C.label('a', a)) + ' · pin ' + c.getAttribute('data-n') + '</span></div><h2 class="d2" id="sh-t">' + (q('.pl-vert', c) && q('.pl-n .nat', c) ? esc(C.name(c)) + ' <span class="vh">' + esc(q('.pl-n .nat', c).textContent) + '</span>' : q('.pl-n a', c).innerHTML) + '</h2>' +
      (w ? '<p class="why">' + w.innerHTML + '</p>' : '') +
      (closed ? '<p class="closed-note">Closed — kept for the record' + (pv[2] ? ' · per ' + esc(pv[2]) : '') + (chk ? ', checked ' + esc(chk) : '') + '</p>' : '') + note +
      (lenses.length ? '<div><h3 class="section-t">Part of</h3><div class="pills">' + lenses.map(function (x) { return '<button class="pill" data-sh="lens" data-f="' + x[0] + '" data-v="' + esc(x[1]) + '">' + esc(C.label(x[0], x[1])) + '</button>'; }).join('') + '</div></div>' : '') +
      '<div><h3 class="section-t">Recommended by</h3><ul class="srclist">' + src + '</ul></div><div>' +
      (ad || dir ? fact('pin', ad ? esc(ad.textContent) : 'Directions', dir) : '') +
      (pv[0] ? fact('check', 'Pinned to the door: ' + esc(pv[0]) + ' confidence', '<span class="muted" data-pin>' + (pv[1] ? 'verified ' + esc(pv[1]) : '') + '</span>') : '') +
      (chk ? fact('stamp', 'Status checked ' + esc(chk), '<span class="muted">' + (closed ? 'Closed' : 'Open when last checked') + '</span>') : '') +
      fact('info', 'Hours and prices aren’t in our data', '<span class="muted">Check before you go.</span>') +
      '<div class="fact">' + icon('stamp') + '<div><button class="btn btn-ghost" data-sh="been" aria-pressed="' + been + '">' + (been ? 'Been there ✓' : 'Mark as been there') + '</button></div></div>' +
      (C.day && !closed && ll ? '<div class="fact">' + icon('route') + '<div><button class="btn btn-ghost" data-sh="day" aria-pressed="' + !!inDay + '">' + (inDay ? 'In your day ✓' : 'Add to your day in ' + esc(C.label('a', a))) + '</button></div></div>' : '') +
      '<p class="sm"><a href="https://github.com/alvations/cleo-guide/issues/new?title=' + encodeURIComponent('Correction: ' + name + ' (' + info.name + ')') + '"' + NT + '>Suggest a correction</a></p></div></div>' +
      '<div class="actions"><button class="btn btn-ghost" data-sh="save" aria-pressed="' + !!saved + '">' + icon('heart') + '<span>' + (saved ? 'Saved' : 'Save') + '</span></button>' +
      (ll ? '<a class="btn btn-primary" href="https://www.openstreetmap.org/directions?route=%3B' + encodeURIComponent(ll) + '"' + NT + '>' + icon('directions') + '<span>Directions</span></a>' : '<span></span>') +
      '<button class="btn btn-ghost" data-sh="share" data-url="' + esc(url) + '">' + icon('share') + '<span>Share</span></button></div></div>';
  }
  // Per-article links from the page dataset (same origin, cached by the service worker); until it arrives: the publisher.
  function deep(c) {
    if (Cleo.pageData) Cleo.pageData(info.key).then(function (j) {
      if (card !== c) return;
      var rec = (j.places || []).filter(function (p) { return p.id === C.pid(c); })[0], kg = {};
      (j.sourceIndex || []).forEach(function (s) { (s.entries || []).forEach(function (e) { kg[e.key] = s.id; }); });
      (rec ? rec.s : []).forEach(function (x) {
        var li = kg[x[0]] && host.querySelector('.srclist li[data-g="' + kg[x[0]] + '"]'), u = /^https?:\/\/\S+$/.test(x[1] || '') ? x[1] : '';
        if (!li || !u) return;
        var a = q('a.out', li); if (!a) { q('.acts', li).insertAdjacentHTML('beforeend', '<a class="out"' + NT + '>Read ' + icon('external') + '</a>'); a = q('a.out', li); }
        a.href = u; q('.ttl', li).textContent = dom(u);
      });
    }).catch(function () {});
  }
  C.trap(host, function () { api.close(); });
  host.addEventListener('click', function (e) {
    var t = e.target, b = t.closest && t.closest('[data-sh],button.go'), v;
    if (t === host) { api.close(); return; } if (!b) return;
    var k = b.getAttribute('data-sh');
    if (k === 'x') api.close();
    else if (k === 'save') { v = Cleo.saved && Cleo.saved.toggle(ref()); b.setAttribute('aria-pressed', String(!!v)); b.lastChild.textContent = v ? 'Saved' : 'Save'; }
    else if (k === 'been') { v = C.been.toggle(ref()); b.setAttribute('aria-pressed', String(v)); b.textContent = v ? 'Been there ✓' : 'Mark as been there'; }
    else if (k === 'day') { v = C.day.toggle(C.pid(card)); b.setAttribute('aria-pressed', String(v)); b.textContent = v ? 'In your day ✓' : 'Add to your day'; }
    else if (k === 'share') { if (Cleo.share) Cleo.share(q('#sh-t', host).textContent + ' — ' + info.name, b.getAttribute('data-url')); }
    else if (k === 'lens') { var o = {}; o[b.getAttribute('data-f')] = b.getAttribute('data-v'); api.close(true); C.go(o); }
    else { api.close(true); C.go({ src: b.getAttribute('data-src') }); }
  });
  d.addEventListener('cleo:toast', function (e) {   // core.js Cleo.share → clipboard; VOICE.md copy
    var el = d.createElement('p'); el.className = 'toast'; el.setAttribute('role', 'status');
    el.textContent = e.detail === 'Link copied' ? 'Link copied — it opens this exact view.' : String(e.detail);
    d.body.appendChild(el); setTimeout(function () { el.remove(); }, 2600);
  });
  var api = Cleo.sheet = {
    isOpen: function () { return !host.hidden; },
    open: function (c) {
      if (Cleo.tray) Cleo.tray.close(true);
      card = c; byNav = navs > 0; host.innerHTML = build(c); host.hidden = false; host.classList.toggle('side', C.desk());
      if (!C.desk()) d.body.style.overflow = 'hidden';
      q('[data-sh="x"]', host).focus({ preventScroll: true }); deep(c); if (C.onSheet) C.onSheet(c);
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
