/* generated copy of tools/beta/client/city.js — do not edit here */
/* city.js (FE-A): lenses, rail, tray, deep links, saves, covers and the map (split view on desktop, full-screen
 * map + pin sheet on mobile) over the server-rendered list. Lenses hide, never remove. OSM + Esri tiles only. */
(() => {
  'use strict';
  const Cleo = window.Cleo || {}, d = document, main = d.getElementById('main'); if (!main) return;
  const $ = (s, el) => (el || d).querySelector(s), $$ = (s, el) => [].slice.call((el || d).querySelectorAll(s));
  const at = (el, a) => el.getAttribute(a), on = (el, ev, f) => el && el.addEventListener(ev, f);
  const key = at(main, 'data-city'), cards = $$('li.pl'), sections = $$('section.area'), byId = {}, text = {};
  const pid = c => c.id.slice(2);
  let info = {}; try { info = JSON.parse(d.getElementById('cleo-city').textContent); } catch (e) {}
  const fold = Cleo.fold || (s => String(s || '').toLowerCase());
  cards.forEach(c => { byId[pid(c)] = c; text[pid(c)] = fold(c.textContent); });
  const has = (c, a, v) => (' ' + (at(c, a) || '') + ' ').indexOf(' ' + v + ' ') >= 0;
  const desk = () => !window.matchMedia || matchMedia('(min-width: 1024px)').matches;
  const LENS = ['sig', 'c', 'cz', 't', 'src', 'a', 'been', 'gap', 'closed', 'mine', 'day'], RAIL = ['sig', 'c', 'cz', 't', 'src', 'gap', 'closed'], S = { mode: 'all', q: '', sort: '' };
  const store = Cleo.store || { get: (k, x) => x, set: () => {} };
  const been = { all: () => { const b = store.get('been', {}); return b && typeof b === 'object' ? b : {}; },
    toggle(r) { const b = been.all(); if (b[r]) delete b[r]; else b[r] = 1; store.set('been', b); paint(); return !!b[r]; } };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const icon = n => '<svg class="ico" aria-hidden="true"><use href="#i-' + n + '"/></svg>';
  const pl = n => n + (n === 1 ? ' place' : ' places'), ar = n => n + (n === 1 ? ' area' : ' areas');
  const trap = (host, close) => on(host, 'keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const f = $$('a[href],button', host).filter(x => x.offsetParent !== null), l = f[f.length - 1];
    if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); l.focus(); } else if (!e.shiftKey && d.activeElement === l) { e.preventDefault(); f[0].focus(); }
  });
  // hooks for foryou.js / day.js: rank(card) → sort key (lower first) and why(card) → 'First because' text; lens[k](n) → html;
  // after[] run once per apply (map overlays); dist {id: km} while Near me is on (never stored)
  const nameOf = c => { const a = $('.pl-n a', c); if (!a) return ''; const x = a.cloneNode(true); if (c.querySelector('.pl-vert')) $$('.nat', x).forEach(v => v.remove()); return x.textContent.trim(); };
  const C = Cleo.city = { name: nameOf, byId, info, key, pid, been, desk, esc, icon, trap, cards, S, lens: {}, after: [], rank: null, why: null, dist: null };
  $$('[data-cleo-rail],[data-cleo-toolbar]').forEach(el => { el.hidden = false; });
  // For you / Near me (foryou.js) and Your day (day.js) load on first use — a tap, a stored interest or a #day= route
  const need = C.need = (n, cb) => {
    if (n === 'foryou' ? C.fy : C.day) { if (cb) cb(); return; }
    const q = need.q[n] = need.q[n] || []; q.push(cb); if (q.length > 1) return;
    const s = d.createElement('script'); s.src = (Cleo.root || '../') + 'assets/js/' + n + '.js?v=' + ((info.js || {})[n] || ''); s.async = true;
    s.onload = () => q.splice(0).forEach(f => f && f()); d.head.appendChild(s);
  };
  need.q = {};
  const rail = $('#cleo-rail'), shown = $('#cleo-shown'), lens = $('#cleo-lens'), applied = $('[data-cleo-applied]'), fi = $('#cleo-filter'), split = $('.split');
  const shown0 = shown ? shown.innerHTML : '';
  const go = C.go = (r, rep) => Cleo.route.go(r, rep);
  const cur = () => { const r = {}; if (S.mode !== 'all') r.mode = S.mode; LENS.concat('sort').forEach(k => { if (S[k]) r[k] = S[k]; }); return r; };
  const label = C.label = (k, v) => k === 'sig' ? (info.sig || {}).t || 'Signature' : k === 't' ? ['', 'Must see', 'Worth the detour', 'Deep cut'][v] : k === 'src' ? ((info.src || {})[v] || [v])[0] : k === 'closed' ? 'Recently closed' : k === 'mine' ? 'Your list'
    : k === 'a' ? ((info.areas || {})[v] || {}).n || v : k === 'been' ? (v === 'hide' ? 'Hide been there' : 'Only been there') : k === 'q' ? '“' + v + '”' : (info.cats || {})[v] || v;

  on(d, 'click', e => {
    const t = e.target; let b;
    if ((b = t.closest('button[data-mode]'))) { const r = cur(); r.mode = at(b, 'data-mode') === 'all' ? '' : at(b, 'data-mode'); go(r); }
    else if ((b = t.closest('[data-cleo-all]'))) { S.q = ''; if (fi) fi.value = ''; go({}); }
    else if ((b = t.closest('[data-cleo-mine]'))) go(S.mine ? {} : { mine: '1' });
    else if ((b = t.closest('[data-cleo-foryou]'))) need('foryou', () => C.fy.open(b));
    else if ((b = t.closest('[data-cleo-near]'))) need('foryou', () => C.near(b));
    else if ((b = t.closest('[data-cleo-day]'))) need('day', () => C.day.open(at(b, 'data-cleo-day')));
    else if ((b = t.closest('.rail-i'))) { const k = RAIL.filter(x => b.hasAttribute('data-' + x))[0], o = {}; if (k && S[k] !== at(b, 'data-' + k)) o[k] = at(b, 'data-' + k); go(o); }
    else if ((b = t.closest('.pl-s button.src'))) { e.preventDefault(); go({ src: at(b, 'data-src') }); }
    else if ((b = t.closest('[data-rail]'))) rail.scrollBy({ left: +at(b, 'data-rail') * rail.clientWidth * 0.8, behavior: 'smooth' });
    else if ((b = t.closest('[data-unset]'))) { const u = cur(), x = at(b, 'data-unset'); delete u[x]; if (x === 'q') { S.q = fi.value = ''; apply(); } go(u); }
    else if ((b = t.closest('[data-cleo-map]'))) { const m = Cleo.route.parse(); if (m.map) history.back(); else { m.map = at(b, 'data-cleo-map') || '1'; go(m); } }
    else if ((b = t.closest('[data-cleo-tray]'))) T.open(at(b, 'data-cleo-tray'), b);
    else if ((b = t.closest('button.pl-save')) && Cleo.saved) Cleo.saved.toggle(key + '/' + pid(b.closest('li.pl')));
  });
  let tq; on(fi, 'input', () => { clearTimeout(tq); tq = setTimeout(() => { S.q = fi.value; apply(); }, 120); });

  const visible = c => {
    const k = at(c, 'data-k');
    if ((S.mode === 'sights' && k !== 's') || (S.mode === 'food' && k !== 'f')) return false;
    if ((S.c && !has(c, 'data-g', S.c)) || (S.cz && !has(c, 'data-cz', S.cz)) || (S.src && !has(c, 'data-src', S.src))) return false;
    if ((S.t && (at(c, 'data-t') !== S.t || c.hasAttribute('data-closed'))) || (S.a && at(c, 'data-a') !== S.a)) return false;
    if (S.been) { const b = !!been.all()[key + '/' + pid(c)]; if (S.been === 'hide' ? b : !b) return false; }
    if (S.sig && !(info.sig && info.sig.ids.indexOf(pid(c)) >= 0)) return false;
    if ((S.closed && !c.hasAttribute('data-closed')) || (S.mine && !(Cleo.saved && Cleo.saved.has(key + '/' + pid(c)))) || (S.day && C.inDay && !C.inDay(pid(c)))) return false;
    return !S.q || fold(S.q).split(/\s+/).every(w => !w || text[pid(c)].indexOf(w) >= 0);
  };
  const count = o => { const sv = {}; let n = 0; for (const k in o) { sv[k] = S[k]; S[k] = o[k]; } cards.forEach(c => { if (visible(c)) n++; }); Object.assign(S, sv); return n; };
  const nsrc = x => (at(x, 'data-src') || '').split(' ').length, num = x => +at(x, 'data-n');
  const far = x => C.dist && C.dist[pid(x)] != null ? C.dist[pid(x)] : 1e9;
  const apply = () => {
    if (Cleo.defer && (C.rank || S.day || S.sort)) Cleo.defer.all();   // a reorder must see every card (M3-06)
    let n = 0; const areas = {}, tot = cards.length;
    $$('ol.pls').forEach(ol => {
      const base = S.sort === 'az' ? (x, y) => $('.pl-n', x).textContent.localeCompare($('.pl-n', y).textContent)
        : S.sort === 'src' ? (x, y) => nsrc(y) - nsrc(x) || num(x) - num(y) : S.sort === 'near' && C.dist ? (x, y) => far(x) - far(y) || num(x) - num(y) : (x, y) => num(x) - num(y);
      const rk = S.day && C.dayRank ? C.dayRank : S.closed && info.co ? x => { const i = info.co.indexOf(pid(x)); return i < 0 ? 999 : i; } : C.rank;
      const li = $$('li.pl', ol).sort(rk ? (x, y) => rk(x) - rk(y) || base(x, y) : base);
      if (li.some((x, i) => ol.children[i] !== x)) li.forEach(x => ol.appendChild(x));
    });
    cards.forEach(c => { const v = visible(c); c.hidden = !v; if (v) { n++; areas[at(c, 'data-a')] = 1; }
      // DES 15.10 hooks on the eyebrow: .pl-why (For you) and .pl-dist (Near me)
      const y = C.why && C.why(c), w = $('.pl-why', c);
      if (y) { if (!w) $('.pl-e', c).insertAdjacentHTML('beforeend', ' <span class="pl-why"></span>'); $('.pl-why', c).textContent = y; } else if (w) w.remove();
      const dk = $('.pl-dist', c), dv = C.dist && C.dist[pid(c)];
      if (dv != null) { if (!dk) $('.pl-e', c).insertAdjacentHTML('beforeend', ' <span class="pl-dist"></span>'); $('.pl-dist', c).textContent = (dv < 1 ? Math.round(dv * 100) * 10 + ' m' : dv.toFixed(1) + ' km') + ' away'; } else if (dk) dk.remove();
    });
    sections.forEach(s => { s.hidden = !s.querySelector('li.pl:not([hidden]),noscript[data-cleo-defer]'); });
    if (sections.length > 1) {   // Near me: the nearest area comes first; otherwise the guide's area order
      const ord = sections.slice().sort((x, y) => S.sort === 'near' && C.dist ? Math.min.apply(0, $$('li.pl', x).map(far)) - Math.min.apply(0, $$('li.pl', y).map(far)) : 0);
      if (ord.some((x, i) => x !== $$('section.area')[i])) { const how = $('#how-we-choose'); ord.forEach(x => how.parentNode.insertBefore(x, how)); }
    }
    const nA = Object.keys(areas).length, act = LENS.filter(k => S[k] && k !== 'gap' && k !== 'day'), all = '<button class="btn btn-primary" data-cleo-all>Show all ' + tot + '</button>';
    const gap = t => '<div class="gap"><span class="eyebrow">Stated gap</span>' + t + '</div>';
    if (shown) shown.innerHTML = n === tot ? shown0 : n ? 'Showing <b>' + n + '</b> of ' + tot + ' places in ' + ar(nA) + '. Ordered by tier, then by number of named sources.'
      : '<b>No places match.</b> Filters never hide places for good. <button class="btn btn-quiet" data-cleo-all>Clear filters (' + tot + ' places)</button>';
    const lk = ['day', 'sig', 'src', 'gap', 'closed', 'mine', 'c', 'cz', 't', 'a'].filter(k => S[k])[0];
    let h = '';
    if (C.lens[lk]) h = C.lens[lk](n, nA, all);
    else if (lk === 'closed') h = '<h2>Recently closed — kept for the record (' + n + ')</h2><p>Closed places stay on the guide, flagged, with the source and date of the closure check — so a pin never reads as “go here today”. Newest check first.</p><div class="row">' + all + '</div>';
    else if (lk === 'sig' && info.sig) h = '<span class="eyebrow">★ Signature · ' + esc(info.sig.why || '') + '</span><h2>' + esc(info.sig.t) + ' (' + n + ')</h2>' +
      (info.sig.dishes.length ? '<p>' + info.sig.dishes.map(x => '<b>' + esc(x[0]) + '</b> ' + x[1]).join(' · ') + '</p>' : '') + '<p>' + pl(n) + ' across ' + ar(nA) + ' — numbered to match the map.</p><div class="row">' + all + '</div>';
    else if (lk === 'mine') h = '<h2>Your list in ' + esc(info.name) + ' (' + n + ')</h2><p>Saved on this device. <a href="' + (Cleo.root || '../') + 'saved.html">All your lists</a></p><div class="row">' + all + '</div>';
    else if (lk === 'src') {
      const s = (info.src || {})[S.src] || [S.src, n, 0, '', ''];
      h = '<h2>Everything ' + esc(s[0]) + ' recommends in ' + esc(info.name) + ' (' + n + ')</h2>' + (s[5] ? '<p>' + esc(s[5]) + '</p>' : '') +
        (s[2] ? '<p>All ' + s[2] + ' of its numbered entries are here.</p>' : '') +
        '<div class="row">' + (s[4] ? '<a class="btn btn-ghost" href="' + esc(s[4]) + '" rel="noopener" target="_blank">Read the source ' + icon('external') + '</a>' : '') + all + '</div>';
    } else if (lk === 'gap') { const g = (info.gaps || [])[+S.gap] || ['', '']; h = gap('<p class="d3">' + esc(g[0]) + '</p><p>“' + esc(g[1]) + '”</p>') + '<div class="row">' + all + '</div>'; }
    else if (lk) h = '<h2>' + esc(label(lk, S[lk])) + '</h2><p>' + pl(n) + ' across ' + ar(nA) + (lk === 't' ? ', graded within each area' : '') + ' — numbered to match the map.</p>' +
      (lk === 'cz' ? (info.gaps || []).filter(x => x[2].indexOf(S.cz) >= 0).map(x => gap('<p>“' + esc(x[1]) + '”</p>')).join('') : '') + '<div class="row">' + all + '</div>';
    if (lens) { lens.innerHTML = h; lens.hidden = !h; lens.classList.toggle('is-day', lk === 'day'); }
    const chips = act.filter(k => k !== 'day').concat(S.q ? ['q'] : []);
    if (applied) applied.innerHTML = chips.map(k => { const l = esc(label(k, k === 'q' ? S.q : S[k])); return '<button class="chip-x" data-unset="' + k + '" aria-label="Remove ' + l + '">' + l + icon('close') + '</button>'; }).join('') +
      (chips.length > 1 ? '<button class="clear" data-cleo-all>Clear all</button>' : '');
    const nf = $('[data-cleo-nf]'); if (nf) nf.textContent = act.length || '';
    $$('button[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(at(b, 'data-mode') === S.mode)));
    if (rail) rail.setAttribute('data-view', S.mode);
    $$('.rail-i').forEach(a => {
      // doors keep their own state (QA-27: For you stays pressed after a reload restores stored interests)
      const p = a.hasAttribute('data-cleo-all') ? !act.length && !S.gap && !S.day && S.mode === 'all' && !S.q : a.hasAttribute('data-cleo-foryou') ? !!C.rank
        : a.hasAttribute('data-cleo-mine') ? !!S.mine : a.hasAttribute('data-cleo-near') ? S.sort === 'near' && !!C.dist : RAIL.some(k => S[k] && at(a, 'data-' + k) === S[k]);
      a.setAttribute('aria-pressed', String(p)); if (p) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    syncMarkers(); C.after.forEach(f => f());
  };
  C.apply = () => apply();

  let lastP = '';
  const onRoute = C.onRoute = () => {
    const r = Cleo.route.parse(), mm = /^#p-(.+)$/.exec(location.hash);
    if (mm && byId[decodeURIComponent(mm[1])]) r.p = decodeURIComponent(mm[1]);
    if (r.day && !C.day) need('day', () => C.apply());
    S.mode = r.mode === 'sights' || r.mode === 'food' ? r.mode : 'all';
    LENS.forEach(k => { S[k] = r[k] || ''; }); S.sort = r.sort || '';
    if (r.q !== undefined) { S.q = r.q; if (fi) fi.value = r.q; }
    const tg = r.p && byId[r.p];
    if (tg && !visible(tg)) { S.mode = 'all'; LENS.forEach(k => { S[k] = ''; }); S.q = ''; if (fi) fi.value = ''; }
    apply();
    $$('li.pl.is-target').forEach(c => { if (c !== tg) c.classList.remove('is-target'); });
    const mob = !!r.map && !desk();
    if (split) { if (mob) split.setAttribute('data-view', 'map'); else split.removeAttribute('data-view'); }
    if (mob) loadMap(() => { map.invalidateSize(); if (r.map !== '1' || (focusA && !S.day)) fitArea(r.map !== '1' ? r.map : focusA); }); else closePoi();
    if (tg) {
      tg.classList.add('is-target');
      if (r.p !== lastP || !(Cleo.sheet && Cleo.sheet.isOpen())) {
        tg.scrollIntoView({ block: 'center' });
        if (map && markers[r.p]) fly(markers[r.p].getLatLng());
        if (Cleo.sheet) Cleo.sheet.open(tg); else { const l = $('.pl-n a', tg); if (l && l.focus) l.focus({ preventScroll: true }); }
      }
    } else if (Cleo.sheet && Cleo.sheet.isOpen()) Cleo.sheet.close(true);
    lastP = r.p || '';
  };
  on(window, 'hashchange', onRoute); on(d, 'cleo:route', onRoute);

  // cover plate: the native name set vertically when the build says it fits (data-nat, ≤ 5 glyphs, sized by --n so it
  // never clips); otherwise a Didone initial. The native is printed once: the build drops it from the visible title.
  const cover = c => {
    const p = $('.pl-cover', c); if (!p || p.firstChild) return;
    const na = $('.pl-n .nat', c), g0 = Array.from(na ? na.textContent.replace(/^\s*\(|\)\s*$/g, '') : ''), g = g0.length <= 7 ? g0 : [], nm = $('.pl-n', c).textContent.replace(/\s*[—–-]+\s*CLOSED\b.*$/i, '');
    p.innerHTML = (g.length ? '<span class="pl-vert' + (g.length > 4 ? ' long' : '') + '"' + (info.lang ? ' lang="' + info.lang + '"' : '') + '>' + esc(g.join('')) + '</span>'
      : '<span class="pl-ini">' + esc((nm.replace(/^(The|La|Le|El|Il|Der|Die|Das)\s+/i, '').match(/[A-Za-z0-9À-ɏ]/) || ['·'])[0]) + '</span>') +
      '<svg class="pl-glyph"><use href="#i-' + at(c, 'data-gl') + '"/></svg>';
  };
  const paint = () => {
    const s = Cleo.saved ? Cleo.saved.all() : {}, b = been.all();
    cards.forEach(c => {
      cover(c);
      const x = $('.pl-x', c), ref = key + '/' + pid(c); if (!x) return;
      if (!x.firstChild) x.innerHTML = '<button class="pl-save" aria-pressed="false">Save</button>';
      const btn = x.firstChild, o = !!s[ref], st = $('.stamp', c); x.hidden = false;
      btn.setAttribute('aria-pressed', String(o)); btn.textContent = o ? 'Saved' : 'Save'; btn.setAttribute('aria-label', (o ? 'Saved: ' : 'Save ') + $('.pl-n', c).textContent);
      if (b[ref] && !st) c.insertAdjacentHTML('beforeend', '<span class="stamp">Been<br>there</span>'); else if (!b[ref] && st) c.removeChild(st);
    });
    const mine = $('[data-cleo-mine]'), nm = Object.keys(s).filter(r => r.slice(0, r.lastIndexOf('/')) === key).length;
    if (mine) { mine.hidden = !nm && !S.mine; $('[data-cleo-mine-n]', mine).textContent = nm; $('[data-cleo-mine-n]', mine).className = 'n' + (nm === 1 ? ' one' : ''); }
  };
  on(d, 'cleo:saved', () => { paint(); if (S.mine) apply(); });
  // Platform hook (M3-06): later cards arrive from Cleo.defer (core.js) as their area nears the viewport, or all at
  // once before any lens/route. Adopt them so every lens, count and pin sees every place; stubs' pins become cards.
  on(d, 'cleo:stamped', e => { ((e.detail || {}).cards || []).forEach(c => { if (byId[pid(c)] === c) return; cards.push(c); byId[pid(c)] = c; text[pid(c)] = fold(c.textContent); });
    $$('section.area').forEach(s => { if (sections.indexOf(s) < 0) sections.push(s); }); paint(); });

  const tray = $('#cleo-tray'), TK = ['a', 't', 'src', 'c', 'cz', 'sort', 'been'];
  let P = {}, opener = null, pushed = 0, after = null;
  const tpaint = () => {
    $$('.pill', tray).forEach(b => { const k = at(b, 'data-f'); b.setAttribute('aria-pressed', String((k === 'base' ? store.get('base', 'street') : P[k] || '') === at(b, 'data-v'))); });
    const o = { gap: '' }; TK.forEach(k => { o[k] = P[k]; }); const n = count(o);
    $('[data-tr="go"]', tray).textContent = n ? 'Show ' + pl(n) : 'No places match — clear a filter';
  };
  const thide = () => { tray.hidden = true; d.body.style.overflow = ''; };
  const T = Cleo.tray = {
    open(sec, from) {
      if (Cleo.sheet) Cleo.sheet.close();
      P = {}; TK.forEach(k => { P[k] = S[k]; }); opener = from; tray.hidden = false; d.body.style.overflow = 'hidden'; tpaint();
      try { history.pushState({ tray: 1 }, ''); pushed = 1; } catch (e) {}
      const f = sec && $('[data-fs="' + sec + '"]', tray); if (f) f.scrollIntoView({ block: 'start' });
      ($('.pill', f || tray) || $('[data-tr="x"]', tray)).focus({ preventScroll: !!f });
    },
    close(silent, then) {
      if (!tray || tray.hidden) { if (then) then(); return; }
      thide(); if (!silent && opener) opener.focus();
      if (pushed) { pushed = 0; after = then || null; history.back(); } else if (then) then();
    }
  };
  on(window, 'popstate', () => { pushed = 0; if (tray && !tray.hidden) thide(); if (after) { const f = after; after = null; f(); } });
  on(tray, 'click', e => {
    const t = e.target, b = t.closest && t.closest('[data-tr],.pill');
    if (t === tray) { T.close(); return; } if (!b) return;
    const k = at(b, 'data-f'), v = at(b, 'data-v'), a = at(b, 'data-tr');
    if (k === 'base') C.setBase(v); else if (k) P[k] = P[k] === v && k !== 'sort' && k !== 'been' ? '' : v;
    else if (a === 'clear') TK.forEach(x => { P[x] = ''; });
    else if (a === 'x') { T.close(); return; }
    else if (a === 'go') { const r = {}; if (S.mode !== 'all') r.mode = S.mode; TK.forEach(x => { if (P[x]) r[x] = P[x]; });
      T.close(true, () => { go(r); if (r.sort === 'near' && !C.dist) need('foryou', () => C.near()); }); return; }
    tpaint();
  });
  if (tray) trap(tray, () => T.close());

  let map = null, loading = 0;
  const markers = {}, bases = {}, poi = $('#cleo-poi'), waiters = [];
  const accent = ((window.getComputedStyle && getComputedStyle(main).getPropertyValue('--city')) || '').trim() || '#C23A1C';
  const style = c => { const cl = c.hasAttribute('data-closed');
    return { radius: at(c, 'data-t') === '1' && !cl ? 7 : 5, weight: 1.5, color: '#fff', fillColor: cl ? '#999' : ((info.areas || {})[at(c, 'data-a')] || {}).c || '#555', fillOpacity: cl ? 0.45 : 0.92 }; };
  const hot = (c, o) => { const k = c && markers[pid(c)]; if (!k) return; k.setStyle(o ? { radius: 10, weight: 3, color: accent } : style(c)); if (o) k.bringToFront();
    const el = k.getTooltip && k.getTooltip() && k.getTooltip().getElement(); if (el) el.classList.toggle('sel', o); };
  ['mouseover', 'focusin', 'mouseout', 'focusout'].forEach((ev, i) => on(d, ev, e => {
    const c = e.target.closest && e.target.closest('li.pl'); if (c && !(i > 1 && e.relatedTarget && c.contains(e.relatedTarget))) hot(c, i < 2); }));
  const syncMarkers = () => { if (map) { try { map.stop(); } catch (e) {} } if (map) cards.forEach(c => { const k = markers[pid(c)]; if (!k) return; if (!c.hidden) { if (!map.hasLayer(k)) k.addTo(map); } else if (map.hasLayer(k)) map.removeLayer(k); }); };
  // the map follows the reading (ROUND-1 #6): fit to the area in view, fly to the open sheet's place, numbers on the
  // focused area's pins at every zoom; a user who pans or zooms keeps control for 8 s
  const still = () => !window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches;
  let focusA = '', userAt = 0, auto = 0; const stub = {};   // unstamped cards (Cleo.defer.peek) that already have a pin
  const fly = ll => { if (!map || !map.getSize().x) return; auto = Date.now(); if (still()) map.setView(ll, Math.max(map.getZoom(), 15)); else map.flyTo(ll, Math.max(map.getZoom(), 15), { duration: 0.6 }); };
  // numbers: the focused area's at every zoom, all at ≥ 14; then declutter (DES REVIEW-W2 #6) — a label that would
  // overlap one already shown is hidden (its pin stays), focused area first, guide order within. Writes, then reads.
  const focusPins = () => { if (!map) return; const all = Object.keys(markers).map(id => byId[id] || stub[id]).filter(Boolean);
    const many = all.filter(c => !c.hidden).length, lo = map.getZoom() < 14, els = [];
    all.forEach(c => { const k = markers[pid(c)], t = k && k.getTooltip && k.getTooltip(), el = t && t.getElement && t.getElement(); if (!el) return;
      const f = !c.hidden && (many <= 40 || at(c, 'data-a') === focusA); el.classList.toggle('foc', f); el.classList.remove('clash');
      if (!c.hidden && (f || !lo)) els.push([f ? 0 : 1, el]); });
    els.sort((x, y) => x[0] - y[0]);
    const seen = [], hide = [];
    els.forEach(([, el]) => { const r = el.getBoundingClientRect(); if (!r.width) return;
      if (seen.some(q => r.left < q.right - 2 && r.right > q.left + 2 && r.top < q.bottom - 2 && r.bottom > q.top + 2)) hide.push(el); else seen.push(r); });
    hide.forEach(el => el.classList.add('clash')); };
  C.after.push(focusPins);
  const follow = a => {
    if (!a || a === focusA) return; focusA = a; focusPins();
    if (!map || !desk() || (Cleo.sheet && Cleo.sheet.isOpen()) || S.day || Date.now() - userAt < 8000) return;
    if (!map.getSize().x || !el0().offsetWidth) return;   // W3: the map is hidden outside Atlas — never fit a 0-size map (NaN LatLng)
    const ll = cards.filter(c => !c.hidden && at(c, 'data-a') === a && markers[pid(c)]).map(c => markers[pid(c)].getLatLng());
    if (!ll.length) return; auto = Date.now();
    map.flyToBounds(window.L.latLngBounds(ll), { padding: [36, 36], maxZoom: 15, duration: still() ? 0 : 0.6, animate: !still() });
  };
  if (window.IntersectionObserver) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) follow(at(e.target, 'data-area')); }), { rootMargin: '-35% 0px -55% 0px' }); sections.forEach(x => io.observe(x)); }
  C.map = () => map; C.markers = markers; C.loadMap = cb => loadMap(cb);
  const el0 = () => d.getElementById('cleo-map') || main;
  const fitArea = a => { if (map && !map.getSize().x) return; const ll = cards.filter(c => at(c, 'data-a') === a && markers[pid(c)]).map(c => markers[pid(c)].getLatLng()); if (ll.length) map.fitBounds(window.L.latLngBounds(ll), { padding: [40, 40], maxZoom: 16 }); };
  const closePoi = () => { if (poi && !poi.hidden) { poi.hidden = true; poi.innerHTML = ''; } };
  // pin → peek sheet: a compact summary (≤ 40 % of the screen, so the map stays visible); the grabber expands it to the full card
  const peekName = c => { const a = $('.pl-n a', c), x = a && a.cloneNode(true); if (!x) return ''; $$('.nat', x).forEach(v => v.remove()); return x.textContent.trim(); };   // ROUND-2 #2: no "(native)" in the peek title
  const openPoi = c => {
    const cp = c.cloneNode(true); cp.removeAttribute('id'); cp.hidden = false; cp.classList.remove('is-target'); $$('[id]', cp).forEach(x => x.removeAttribute('id'));
    poiFrom = d.activeElement;
    const w = $('.pl-w', c);
    poi.innerHTML = '<button class="grab" data-poi="grow" aria-label="Show the whole card" aria-expanded="false"></button><div class="hdr"><span class="sm">' + esc(label('a', at(c, 'data-a'))) +
      ' · pin ' + at(c, 'data-n') + '</span><button class="btn btn-icon" data-poi="x" aria-label="Close">' + icon('close') + '</button></div>' +
      '<div class="peek-c"><p class="pl-e">' + $('.pl-e', c).innerHTML + '</p><h3 class="pk-n">' + esc(peekName(c)) + '</h3>' + (w ? '<p class="pk-w">' + esc(w.textContent) + '</p>' : '') + '</div>';
    cp.classList.add('pk-full'); poi.appendChild(cp);
    poi.insertAdjacentHTML('beforeend', '<div class="row-actions"><button class="btn btn-ghost" data-poi="x">Close</button><a class="btn btn-primary" href="#p-' + pid(c) + '">Open</a></div>');
    poi.classList.remove('full'); poi.hidden = false; $('[data-poi="x"]', poi).focus();
    if (map && markers[pid(c)]) { map.panTo(markers[pid(c)].getLatLng(), { animate: false }); map.panBy([0, poi.offsetHeight / 2], { animate: false }); }
  };
  let poiFrom = null;
  on(poi, 'click', e => { const b = e.target.closest('[data-poi],a'); if (!b) return; if (at(b, 'data-poi') === 'grow') { poi.classList.toggle('full'); b.setAttribute('aria-expanded', String(poi.classList.contains('full'))); } else closePoi(); });
  on(poi, 'keydown', e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePoi(); if (poiFrom && poiFrom.focus) poiFrom.focus(); } });
  C.openPoi = c => openPoi(c);
  const pin = c => {
    if (!desk()) { openPoi(c); return; }
    $$('li.pl.is-focus').forEach(x => x.classList.remove('is-focus'));
    c.classList.add('is-focus'); c.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };
  const mountMap = Cleo.mountMap = () => {
    const L = window.L, el = d.getElementById('cleo-map'); if (map || !L || !L.map || !el) return false;
    el.innerHTML = '';
    const z = info.center || [0, 0, 2], E = 'https://server.arcgisonline.com/ArcGIS/rest/services/', ea = { attribution: 'Tiles &copy; Esri', maxZoom: 19 };
    map = L.map(el, { scrollWheelZoom: false }).setView([z[0], z[1]], z[2] || 11);
    bases.street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });
    bases.light = L.tileLayer(E + 'Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', Object.assign({ maxNativeZoom: 16 }, ea));
    bases.satellite = L.tileLayer(E + 'World_Imagery/MapServer/tile/{z}/{y}/{x}', ea);
    const b0 = bases[store.get('base', 'street')] || bases.street; b0.addTo(map);
    if (Cleo.watchTiles) Cleo.watchTiles(b0, () => { Cleo.mapFallback(el, map); map = null; });
    // every place gets its pin, stamped or not (unstamped = a start-tag stub from Cleo.defer.peek(); click stamps it)
    cards.concat(Cleo.defer ? Cleo.defer.peek() : []).forEach(c => {
      const ll = (at(c, 'data-ll') || '').split(','); if (ll.length !== 2) return;
      const k = markers[pid(c)] = L.circleMarker([+ll[0], +ll[1]], style(c)).addTo(map), id = pid(c); if (c.stub) stub[id] = c;
      k.bindTooltip(at(c, 'data-n'), { permanent: true, direction: 'center', className: 'pin-n', opacity: 1 });
      const te = k.getTooltip().getElement && k.getTooltip().getElement(), ac = ((info.areas || {})[at(c, 'data-a')] || {}).c; if (te && ac) { te.style.setProperty('--ac', ac); te.style.setProperty('--area', ac); }   // ROUND-2 #2: area-coloured labels
      k.on('click', () => { const r = byId[id] || (Cleo.defer && Cleo.defer.stampFor(id)); if (r) pin(r); });
    });
    const zl = () => { el.classList.toggle('zoom-lo', map.getZoom() < 14); focusPins(); }; map.on('zoomend', zl); zl();
    let fr = 0; map.on('moveend', () => { cancelAnimationFrame(fr); fr = requestAnimationFrame(focusPins); });   // labels settle after a fly
    map.on('dragstart', () => { userAt = Date.now(); }); map.on('zoomstart', () => { if (Date.now() - auto > 1500) userAt = Date.now(); });
    syncMarkers(); C.after.forEach(f => f()); const a0 = focusA; focusA = ''; follow(a0 || at(sections[0] || main, 'data-area')); return true;
  };
  C.setBase = k => { store.set('base', k); if (!map || !bases[k]) return; for (const x in bases) if (map.hasLayer(bases[x])) map.removeLayer(bases[x]); bases[k].addTo(map); };
  const loadMap = cb => {
    if (cb) waiters.push(cb);
    const done = () => { mountMap(); if (map) waiters.splice(0).forEach(f => f()); };
    if (window.L) { done(); return; }
    if (loading++) return;
    const b = (Cleo.root || '../') + 'assets/vendor/leaflet/', l = d.createElement('link'), s = d.createElement('script');
    l.rel = 'stylesheet'; l.href = b + 'leaflet.css'; d.head.appendChild(l);
    s.src = b + 'leaflet.js'; s.async = true; s.onload = done; d.head.appendChild(s);
  };

  paint();
  onRoute();
  if ((store.get('interests', []) || []).length) need('foryou');
  // W3: the map belongs to Atlas (views.js mounts it on switch); Gallery / Guidebook / Insights don't build ~1k pin nodes
  if (desk() && /^(atlas|)$/.test(d.documentElement.getAttribute('data-view') || '')) { if (window.requestIdleCallback) requestIdleCallback(() => loadMap(), { timeout: 1500 }); else setTimeout(loadMap, 300); }
})();
