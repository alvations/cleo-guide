/* Cleo beta — share-card.js (FE-C, W9-7). "Share as an image": a 1080×1920 portrait PNG drawn on <canvas> in the page,
 * for a place (its sheet), a day (day mode), a list (Saved) or a trip (trip.html). Lazy: core.js loads it on the first
 * [data-cleo-card] tap. Only same-origin pixels: the place's own committed photo (or its calm cover), our own pins for
 * the route (no tiles), the self-hosted faces. 0 off-origin requests. Every card carries the source line
 * ("Recommended by …"), the checked date, and on a photo card its credit (imagery's short caption, as text); a closed
 * place reads "Closed · kept for the record" with no call to visit. The image opens in a preview (its alt text says the
 * same lines), then Web Share with files where the browser has it, a download otherwise.
 * Cleo.shareCard.spec(kind, input) is pure (tests); Cleo.shareCard(button) does the whole flow. */
(function () {
  'use strict';
  var Cleo = window.Cleo || {}, d = document;
  if (!Cleo.geo || Cleo.shareCard) return;
  var W = 1080, H = 1920, P = 80;
  var COL = { paper: '#F7F4EE', ink: '#1C1A17', ink2: '#4A453E', ink3: '#6F685F', line: '#DDD6CA', wash: '#EFE9DF' };
  var FD = '"Bricolage Grotesque", "Inter", system-ui, sans-serif', FU = '"Inter", system-ui, sans-serif';
  var TIER = ['', 'Must see', 'Worth the detour', 'Deep cut'];
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var isClosed = function (p) { return !!p.closed || /\bclosed\b/i.test((p.pv || {}).status || '') || / [—–-]+ CLOSED\b/.test(p.n); };
  var label = function (p) { var n = String(p.n).replace(/\s+[—–-]+\s*CLOSED\b.*$/, ''), nat = p.nat && n.slice(-p.nat.length - 2) === '(' + p.nat + ')' ? p.nat : ''; return nat ? n.slice(0, -nat.length - 2).trim() : n; };
  var shortArea = function (n) { return String(n || '').split(/\s+[(—–]\s*|\s+\(/)[0]; };
  /** "Recommended by X + n more" from a place's source ids and the guide's source index (honest when only the guide). */
  function srcLine(p, names) {
    var s = (p.src || []).filter(function (k) { return k !== 'guide'; });
    return s.length ? 'Recommended by ' + (names[s[0]] || s[0]) + (s.length > 1 ? ' + ' + (s.length - 1) + ' more' : '') : 'Added by the guide (general knowledge)';
  }
  var latest = function (ps) { return ps.map(function (p) { return (p.pv || {}).checked || ''; }).filter(Boolean).sort().pop() || ''; };

  /* ---------------------------------------------------------------- the spec (pure)
   * input: {guide:{name, src:{id:name}, areas:{id:name}, colors:{id:'#hex'}}, places:[p…] (place: one; day/list: the stops),
   *         photo:{src, credit}|null, title?, days?:[{area, guide, places:[p…]}] (trip), url} */
  function spec(kind, I) {
    var G = I.guide || { src: {}, areas: {}, colors: {} }, out = { kind: kind, lines: [], stops: [], route: [], url: I.url || '' };
    if (kind === 'place') {
      var p = I.places[0], closed = isClosed(p), pv = p.pv || {};
      out.accent = G.colors[p.a] || '#C23A1C';
      out.eyebrow = (G.name || '') + (G.areas[p.a] ? ' · ' + shortArea(G.areas[p.a]) : '');
      out.title = label(p); out.nat = p.nat || '';
      out.photo = I.photo || null; out.initial = (out.title.replace(/^(The|La|Le|El|Il)\s+/i, '').match(/[A-Za-z0-9À-ɏ]/) || [out.title.charAt(0) || '·'])[0];
      out.status = closed ? 'Closed · kept for the record' : (TIER[p.t] || '');
      out.source = srcLine(p, G.src);
      out.checked = pv.checked ? (closed ? 'Closed when checked · ' : 'Open when last checked · ') + pv.checked : '';
      out.why = closed ? '' : (p.w || '');
      out.credit = out.photo && out.photo.credit ? out.photo.credit : '';
    } else {
      var days = I.days || [{ area: null, guide: G, places: I.places }], all = [];
      out.accent = (G.colors && I.places && I.places[0] && G.colors[I.places[0].a]) || '#C23A1C';
      out.title = I.title || '';
      out.eyebrow = kind === 'trip' ? 'Your trip · ' + days.length + (days.length === 1 ? ' day' : ' days') : kind === 'day' ? 'Your day' + (G.name ? ' · ' + G.name : '') : 'A list' + (G.name ? ' · ' + G.name : '');
      days.forEach(function (dy, di) {
        var g = dy.guide || G;
        dy.places.forEach(function (q, i) {
          all.push(q);
          out.stops.push({ day: kind === 'trip' ? di + 1 : 0, n: i + 1, name: label(q), source: srcLine(q, g.src || {}), closed: isClosed(q), dayLabel: kind === 'trip' && i === 0 ? 'Day ' + (di + 1) + (dy.area ? ' · ' + dy.area : '') : '' });
          if (q.la != null && !isClosed(q)) out.route.push({ ll: [+q.la, +q.ln], n: i + 1, day: di, col: (g.colors || {})[q.a] || out.accent });
        });
      });
      var km = 0; days.forEach(function (dy) { var pts = dy.places.filter(function (q) { return q.la != null && !isClosed(q); }); for (var i = 1; i < pts.length; i++) km += Cleo.geo.km([pts[i - 1].la, pts[i - 1].ln], [pts[i].la, pts[i].ln]); });
      out.status = all.length + (all.length === 1 ? ' place' : ' places') + (kind !== 'list' && km ? ' · ' + Cleo.geo.walk(km).dist + ' between stops, straight-line' : '');
      out.source = 'Each stop names who recommends it';
      var lc = latest(all); out.checked = lc ? 'Status checked to ' + lc : '';
      if (all.some(isClosed)) out.closedNote = 'Closed places are kept for the record, not as stops';
      out.credit = '';
    }
    out.lines = [out.eyebrow, out.title, out.status, out.source, out.checked, out.credit].filter(Boolean);
    out.alt = 'Share card: ' + out.lines.join('. ') + (out.stops.length ? '. Stops: ' + out.stops.map(function (s) { return (s.day ? 'day ' + s.day + ' ' : '') + s.n + ' ' + s.name + (s.closed ? ' (closed, kept for the record)' : '') + ' (' + s.source + ')'; }).join('; ') : '') + '.';
    return out;
  }

  /* ---------------------------------------------------------------- drawing */
  function wrap(x, text, max, lines) {
    var words = String(text).split(/\s+/), out = [], cur = '';
    words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (x.measureText(t).width > max && cur) { out.push(cur); cur = w; } else cur = t; });
    if (cur) out.push(cur);
    if (lines && out.length > lines) { out = out.slice(0, lines); var l = out[lines - 1]; while (x.measureText(l + '…').width > max && l.length) l = l.slice(0, -1); out[lines - 1] = l.replace(/\s+$/, '') + '…'; }
    return out;
  }
  function text(x, t, y, o) {
    x.font = o.font; x.fillStyle = o.color || COL.ink; var ls = wrap(x, t, o.max || W - 2 * P, o.lines), lh = o.lh;
    ls.forEach(function (l, i) { x.fillText(l, o.x || P, y + i * lh); }); return y + ls.length * lh;
  }
  function cover(x, img, dx, dy, dw, dh) {
    var r = Math.max(dw / img.naturalWidth, dh / img.naturalHeight), sw = dw / r, sh = dh / r;
    x.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, dx, dy, dw, dh);
  }
  function sketch(x, route, bx, by, bw, bh) {
    if (route.length < 2) return false;
    var la = route.map(function (r) { return r.ll[0]; }), ln = route.map(function (r) { return r.ll[1]; });
    var y0 = Math.min.apply(0, la), y1 = Math.max.apply(0, la), x0 = Math.min.apply(0, ln), x1 = Math.max.apply(0, ln), cx = Math.cos((y0 + y1) / 2 * Math.PI / 180);
    var sx = (x1 - x0) * cx || 1e-6, sy = (y1 - y0) || 1e-6, pad = 40, k = Math.min((bw - 2 * pad) / sx, (bh - 2 * pad) / sy);
    var ox = bx + (bw - sx * k) / 2, oy = by + (bh - sy * k) / 2, xy = function (r) { return [ox + (r.ll[1] - x0) * cx * k, oy + (y1 - r.ll[0]) * k]; };
    x.fillStyle = COL.wash; x.fillRect(bx, by, bw, bh);
    x.setLineDash([2, 16]); x.lineCap = 'round'; x.lineWidth = 6;
    for (var i = 1; i < route.length; i++) { if (route[i].day !== route[i - 1].day) continue; var a = xy(route[i - 1]), b = xy(route[i]); x.strokeStyle = route[i].col; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
    x.setLineDash([]);
    route.forEach(function (r) { var q = xy(r); x.beginPath(); x.arc(q[0], q[1], 24, 0, 2 * Math.PI); x.fillStyle = r.col; x.fill(); x.lineWidth = 5; x.strokeStyle = COL.paper; x.stroke();
      x.fillStyle = '#fff'; x.font = '700 24px ' + FU; x.textAlign = 'center'; x.fillText(String(r.n), q[0], q[1] + 8); x.textAlign = 'left'; });
    return true;
  }
  function draw(S, img, lean) {
    var c = d.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d'); x.textBaseline = 'alphabetic';
    x.fillStyle = COL.paper; x.fillRect(0, 0, W, H);
    var y;
    if (S.kind === 'place') {
      lean = lean || 0; var ph = lean ? 960 : 1060;
      if (img) cover(x, img, 0, 0, W, ph);
      else {                                                   // the calm cover: the area's colour and the name's first letter
        x.fillStyle = S.accent; x.fillRect(0, 0, W, ph); x.fillStyle = 'rgba(255,255,255,.9)'; x.font = '600 520px ' + FD; x.textAlign = 'center'; x.fillText(S.initial, W / 2, ph / 2 + 190); x.textAlign = 'left';
      }
      if (S.status === 'Closed · kept for the record') { x.fillStyle = 'rgba(28,26,23,.55)'; x.fillRect(0, 0, W, ph); }
      y = ph + 34;
      if (S.credit) { y = text(x, S.credit, y + 4, { font: '400 26px ' + FU, color: COL.ink3, lh: 34, lines: 2 }); }
      y += 44;
      y = text(x, S.eyebrow, y, { font: '600 32px ' + FU, color: COL.ink3, lh: 42, lines: 1 });
      y = text(x, S.title, y + 66, { font: '600 84px ' + FD, lh: 92, lines: 3 });
      if (S.status) { y += 14; x.font = '600 34px ' + FU; var tw = x.measureText(S.status).width + 44; x.fillStyle = S.status.indexOf('Closed') === 0 ? COL.ink : S.accent; x.beginPath(); x.roundRect ? x.roundRect(P, y, tw, 58, 29) : x.rect(P, y, tw, 58); x.fill(); x.fillStyle = '#fff'; x.fillText(S.status, P + 22, y + 40); y += 58; }
      if (S.why && lean < 2) y = text(x, S.why, y + 64, { font: '400 34px ' + FU, color: COL.ink2, lh: 46, lines: lean ? 2 : 3 });
      y = text(x, S.source, y + 60, { font: '600 34px ' + FU, lh: 44, lines: 2 });
      if (S.checked) y = text(x, S.checked, y + 14, { font: '400 30px ' + FU, color: COL.ink2, lh: 40, lines: 1 });
      if (y > H - 200 && lean < 2) return draw(S, img, lean + 1);   // too tall: a shorter photo, then less write-up — never a clipped source or date
    } else {
      x.fillStyle = S.accent; x.fillRect(0, 0, W, 16);
      y = text(x, S.eyebrow, 120, { font: '600 34px ' + FU, color: COL.ink3, lh: 44, lines: 1 });
      y = text(x, S.title, y + 60, { font: '600 80px ' + FD, lh: 88, lines: 2 });
      y = text(x, S.status, y + 22, { font: '400 32px ' + FU, color: COL.ink2, lh: 42, lines: 2 });
      var tr = S.kind === 'trip', sk = tr ? 300 : 420, rh = tr ? 84 : 94;   // a trip lists more stops: a shorter sketch, tighter rows
      if (sketch(x, S.route, P, y + 30, W - 2 * P, sk)) y += 30 + sk;
      y += 40;
      var room = H - 380, shown = 0;           // leaves the "+ n more", closed note and checked lines clear of the foot
      for (var i = 0; i < S.stops.length; i++) {
        var s = S.stops[i], need = (s.dayLabel ? 56 : 0) + rh; if (y + need > room) break;
        if (s.dayLabel) { y = text(x, s.dayLabel, y + 40, { font: '700 30px ' + FU, color: COL.ink3, lh: 40, lines: 1 }) - 10; }
        x.fillStyle = s.closed ? COL.ink3 : S.accent; x.beginPath(); x.arc(P + 22, y + 32, 22, 0, 2 * Math.PI); x.fill(); x.fillStyle = '#fff'; x.font = '700 22px ' + FU; x.textAlign = 'center'; x.fillText(String(s.n), P + 22, y + 40); x.textAlign = 'left';
        text(x, s.name, y + 42, { x: P + 64, max: W - 2 * P - 64, font: '600 ' + (tr ? 32 : 36) + 'px ' + FU, lh: 44, lines: 1 });
        // a closed stop says so on its own line, which is never cut: the name may be ellipsised, the flag may not
        text(x, (s.closed ? 'Closed · kept for the record · ' : '') + s.source, y + (tr ? 78 : 84), { x: P + 64, max: W - 2 * P - 64, font: '400 ' + (tr ? 26 : 28) + 'px ' + FU, color: s.closed ? COL.ink : COL.ink2, lh: 36, lines: 1 });
        y += rh; shown++;
      }
      if (shown < S.stops.length) y = text(x, '+ ' + (S.stops.length - shown) + ' more in the link', y + 34, { font: '600 30px ' + FU, color: COL.ink2, lh: 40, lines: 1 });
      if (S.closedNote) y = text(x, S.closedNote, y + 30, { font: '400 28px ' + FU, color: COL.ink2, lh: 36, lines: 1 });
      if (S.checked) text(x, S.checked, H - 214, { font: '400 30px ' + FU, color: COL.ink2, lh: 40, lines: 1 });
    }
    // the foot: the wordmark and where it lives (same on every card)
    x.fillStyle = COL.line; x.fillRect(P, H - 170, W - 2 * P, 2);
    text(x, 'Cleo · sourced city guides', H - 104, { font: '600 34px ' + FD, lh: 40, lines: 1 });
    text(x, S.url, H - 58, { font: '400 26px ' + FU, color: COL.ink3, lh: 32, lines: 1 });
    return c;
  }

  /* ---------------------------------------------------------------- inputs, from what the page already holds */
  function guideOf(j) {
    var src = {}, areas = {}; (j.sourceIndex || []).forEach(function (s) { src[s.id] = String(s.name || s.id).split(' · ')[0]; }); (j.areas || []).forEach(function (a) { areas[a.id] = a.n; });
    return { name: j.name, src: src, areas: areas, colors: j.colors || {}, by: (j.places || []).reduce(function (o, p) { o[p.id] = p; return o; }, {}) };
  }
  var guide = function (k) { return Cleo.pageData(k).then(guideOf); };
  var shortUrl = function (u) { return String(u).replace(/^https?:\/\//, '').replace(/#.*$/, ''); };
  /** The card's own committed photo (largest same-origin copy) and its short caption, as text. */
  function photoOf(card) {
    var img = card && card.querySelector('figure.pl-photo img, figure.photo img'); if (!img) return null;
    var best = img.getAttribute('src'), bw = 0;
    (img.getAttribute('srcset') || '').split(',').forEach(function (c) { var m = /^\s*(\S+)\s+(\d+)w/.exec(c); if (m && +m[2] > bw) { bw = +m[2]; best = m[1]; } });
    var u; try { u = new URL(best, location.href); } catch (e) { return null; }
    if (u.origin !== location.origin) return null;                         // only our own committed files
    var cap = card.querySelector('figure.pl-photo figcaption, figure.photo figcaption');
    return { src: u.href, credit: cap ? cap.textContent.replace(/\s+/g, ' ').trim() : '' };
  }
  function input(b) {
    var kind = b.getAttribute('data-cleo-card'), C = Cleo.city;
    if (kind === 'place' && C) {
      var id = b.getAttribute('data-id');
      return guide(C.key).then(function (G) { var p = G.by[id]; if (!p) throw new Error('unknown place');
        return { kind: kind, name: label(p), I: { guide: G, places: [p], photo: photoOf(C.byId[id]), url: shortUrl(location.href.split('#')[0] + '#p=' + id) } }; });
    }
    if (kind === 'day' && C) {
      var ids = [].map.call(d.querySelectorAll('.day .stops .go'), function (a) { return decodeURIComponent((a.getAttribute('href') || '').replace(/^#p-/, '')); });
      return guide(C.key).then(function (G) { var a = C.S.day, ps = ids.map(function (i) { return G.by[i]; }).filter(Boolean);
        return { kind: kind, name: 'A day in ' + shortArea(G.areas[a] || a), I: { guide: G, places: ps, title: 'A day in ' + shortArea(G.areas[a] || a), url: shortUrl(location.href.split('#')[0] + '#day=' + a) } }; });
    }
    if (kind === 'list') {
      var refs = Cleo.listCodec.decode(b.getAttribute('data-refs') || ''), keys = refs.map(function (r) { return r.slice(0, r.lastIndexOf('/')); }).filter(function (k, i, a) { return a.indexOf(k) === i; });
      return Promise.all(keys.map(function (k) { return guide(k).catch(function () { return null; }); })).then(function (gs) {
        var by = {}; keys.forEach(function (k, i) { by[k] = gs[i]; });
        var ps = [], G0 = gs.filter(Boolean)[0] || { src: {}, areas: {}, colors: {} }, merged = { name: keys.length === 1 && G0.name ? G0.name : '', src: {}, areas: {}, colors: {} };
        gs.forEach(function (g) { if (g) { Object.assign(merged.src, g.src); Object.assign(merged.colors, g.colors); } });
        refs.forEach(function (r) { var g = by[r.slice(0, r.lastIndexOf('/'))], p = g && g.by[r.slice(r.lastIndexOf('/') + 1)]; if (p) ps.push(p); });
        var nm = b.getAttribute('data-name') || 'A list';
        return { kind: kind, name: nm, I: { guide: merged, places: ps, title: nm, url: shortUrl(location.href.split('#')[0]) } };
      });
    }
    if (kind === 'trip') {
      var T = (d.getElementById('cleo-trip') || {})._trip; if (!T) return Promise.reject(new Error('no trip'));
      var tk = T.days.map(function (u) { return u.key; }).filter(function (k, i, a) { return a.indexOf(k) === i; });
      return Promise.all(tk.map(guide)).then(function (gs) {
        var by = {}; tk.forEach(function (k, i) { by[k] = gs[i]; });
        var days = T.days.map(function (u) { var g = by[u.key]; return { area: shortArea(g.areas[u.a] || u.a), guide: g, places: u.items.map(function (it) { return it.p; }) }; });
        return { kind: kind, name: T.name, I: { guide: by[tk[0]] || {}, places: days[0] ? days[0].places : [], days: days, title: T.name, url: shortUrl(location.href.split('&d=')[0]) } };
      });
    }
    return Promise.reject(new Error('nothing to draw'));
  }

  /* ---------------------------------------------------------------- the flow: draw → preview → share or download */
  function fonts() {
    if (!d.fonts || !d.fonts.load) return Promise.resolve();
    return Promise.all(['600 84px "Bricolage Grotesque"', '400 32px "Inter"', '600 32px "Inter"', '700 24px "Inter"'].map(function (f) { return d.fonts.load(f).catch(function () {}); }));
  }
  function loadImg(src) {
    return new Promise(function (ok) { if (!src) return ok(null); var i = new Image(); i.decoding = 'async'; i.onload = function () { ok(i); }; i.onerror = function () { ok(null); }; i.src = src; });
  }
  var slug = function (s) { return String(s).normalize ? String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 60) || 'cleo' : 'cleo'; };
  function make(b) {
    return input(b).then(function (r) {
      var S = spec(r.kind, r.I);
      return Promise.all([fonts(), loadImg(S.photo && S.photo.src)]).then(function (z) {
        if (S.photo && !z[1]) { var cr = S.credit; S.photo = null; S.credit = ''; S.lines = S.lines.filter(function (l) { return l !== cr; }); S.alt = S.alt.replace('. ' + cr, ''); }   // no photo: the calm cover, no orphan credit
        var c = draw(S, z[1]);
        return new Promise(function (ok) { c.toBlob(function (blob) { ok({ S: S, blob: blob, name: 'cleo-' + slug(r.name) + '.png', canvas: c }); }, 'image/png'); });
      });
    });
  }
  function preview(res, opener) {
    var old = d.getElementById('cleo-card-dlg'); if (old) old.remove();
    var url = URL.createObjectURL(res.blob), file = null;
    try { file = new File([res.blob], res.name, { type: 'image/png' }); } catch (e) {}
    var canFiles = !!(file && navigator.canShare && navigator.share && (function () { try { return navigator.canShare({ files: [file] }); } catch (e) { return false; } })());
    var o = d.createElement('div'); o.id = 'cleo-card-dlg'; o.className = 'card-dlg';
    o.innerHTML = '<div class="card-dlg-b" role="dialog" aria-modal="true" aria-labelledby="card-dlg-h"><h2 id="card-dlg-h">Share as an image</h2>' +
      '<img src="' + url + '" width="270" height="480" alt="' + esc(res.S.alt) + '">' +
      '<p class="sm">1080 × 1920 PNG, drawn on this device. It names the source, the date we last checked' + (res.S.credit ? ' and the photo’s credit' : '') + '.</p>' +
      '<p class="card-dlg-a">' + (canFiles ? '<button type="button" class="btn btn-primary" data-card="share">Share image</button>' : '') +
      '<a class="btn ' + (canFiles ? 'btn-ghost' : 'btn-primary') + '" data-card="dl" href="' + url + '" download="' + esc(res.name) + '">Download PNG</a>' +
      '<button type="button" class="btn btn-quiet" data-card="x">Close</button></p></div>';
    d.body.appendChild(o);
    var close = function () { o.remove(); URL.revokeObjectURL(url); d.removeEventListener('keydown', key, true); if (opener && opener.focus) opener.focus(); };
    var key = function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      else if (e.key === 'Tab') { var f = [].slice.call(o.querySelectorAll('button, a[href]')), i = f.indexOf(d.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    };
    d.addEventListener('keydown', key, true);
    o.addEventListener('click', function (e) {
      var t = e.target.closest('[data-card]'); if (e.target === o) return close(); if (!t) return;
      var k = t.getAttribute('data-card');
      if (k === 'x') close();
      else if (k === 'share') navigator.share({ files: [file], title: res.S.title, text: res.S.lines.join(' · ') }).catch(function () {});
    });
    (o.querySelector('[data-card="share"]') || o.querySelector('[data-card="dl"]')).focus();
    return o;
  }
  if (!d.getElementById('cleo-card-css')) {
    var css = d.createElement('style'); css.id = 'cleo-card-css';
    css.textContent = '.card-dlg{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;background:rgba(20,18,16,.55);padding:16px}' +
      '.card-dlg-b{background:var(--surface,#fff);color:var(--ink,#1c1a17);border-radius:var(--r-l,16px);padding:20px;display:grid;gap:12px;justify-items:center;max-width:min(420px,100%);max-height:100%;overflow:auto;box-shadow:var(--e-4,0 10px 40px rgba(0,0,0,.3))}' +
      '.card-dlg-b h2{margin:0;font:600 var(--fs-lead,20px)/1.2 var(--font-ui,inherit);justify-self:start}.card-dlg-b img{width:min(270px,62vw);height:auto;border-radius:var(--r-m,10px);border:1px solid var(--line,#ddd)}' +
      '.card-dlg-b p{margin:0}.card-dlg-a{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}';
    d.head.appendChild(css);
  }

  var api = Cleo.shareCard = function (b) {
    if (b.getAttribute('aria-busy') === 'true') return Promise.resolve(null);
    b.setAttribute('aria-busy', 'true');
    return make(b).then(function (res) { b.removeAttribute('aria-busy'); api.last = res; preview(res, b); return res; },
      function () { b.removeAttribute('aria-busy'); if (Cleo.emit) Cleo.emit('cleo:toast', 'The image couldn’t be made here. The link still works.'); return null; });
  };
  api.spec = spec; api.draw = draw; api.W = W; api.H = H;
  if (Cleo.need && Cleo.need.done) Cleo.need.done('share-card');
})();
