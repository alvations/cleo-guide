/* gallery.js (FE-A, W3 A-03): the Gallery view's extras over the canonical card list — category rows drawn from
 * the page JSON one row at a time as they near the viewport (no server nodes), the hero lead card
 * (desktop), "See all n" lenses, hearts on row cards, and the data-drawn covers on the grid's current page (the
 * area's own pin art with this place ringed). The grid itself is the li.pl list, paged by views.js. */
(() => {
  'use strict';
  const Cleo = window.Cleo || {}, C = Cleo.city, d = document, html = d.documentElement;
  if (!C || C.gallery) return;
  C.gallery = 1;
  const $ = (s, el) => (el || d).querySelector(s), qa = (s, el) => [].slice.call((el || d).querySelectorAll(s));
  const at = (el, a) => el.getAttribute(a), on = (el, ev, f) => el && el.addEventListener(ev, f);
  const info = C.info, rowsHost = $('#cleo-rows-host'), grid = $('#cleo-grid'), isG = () => at(html, 'data-view') === 'gallery';
  let io = null, started = 0;

  // rows: chosen and drawn from the page JSON (same origin, cached by the
  // service worker), one row at a time as the last drawn row nears the viewport. No JSON (file://, offline first
  // visit): no rows — the All N grid below still holds every place.
  // i18n D-41: interface strings from the catalogue (Cleo.t, head snippet); the English here equals en.json (test-i18n)
  const tt = (k, e, v) => Cleo.t ? Cleo.t(k, e, v) : v ? e.replace(/\{([a-z]+)\}/g, (m, n) => (n in v ? v[n] : m)) : e;
  const TIER = () => ['', tt('tier.1', 'Must see'), tt('tier.2', 'Worth the detour'), tt('tier.3', 'Deep cut')];
  const places = n => n === 1 ? tt('hub.places.one', '1 place') : tt('hub.places', '{n} places', { n: n.toLocaleString('en-US') });
  // the row subtitles arrive composed in English from the build (data/gallery/<page>.json): re-say them from the catalogue
  const SUBS = [['gal.sub.sig', '{places} · the signature of {city}'], ['gal.sub.top', '{places} · the top tier, graded within each area'],
    ['gal.sub.canon', '{places} · what {city} is known for'], ['gal.sub.food', '{places} · eat & drink'], ['gal.sub.col', '{places} · a collection'],
    ['gal.sub.closed', '{places} · kept for the record, newest check first']].map(([k, e]) => [k, e, new RegExp('^' + e.replace(/[.*+?^${}()|[\]\\]/g, c => '\\' + c).replace('\\{places\\}', '([\\d,]+) places?').replace('\\{city\\}', '(.+)') + "$")]);   // double-quoted on purpose: test harnesses inline this file with String.replace (dollar-quote patterns are special there)
  const subT = s => { for (const [k, e, re] of SUBS) { const m = re.exec(s); if (m) return tt(k, e, { places: places(+m[1].replace(/,/g, '')), city: m[2] }); } return s; };
  const rowT = x => x[2] === 't' ? tt('tier.1', 'Must see') : x[2] === 'closed' ? tt('city.door.closed.t', 'Recently closed') : x[0];
  const esc = C.esc, attrs = {};
  const att = (id, k) => { if (!attrs[id]) { const c = C.byId[id] || (Cleo.defer && Cleo.defer.peek().filter(x => x.id === 'p-' + id)[0]); attrs[id] = c || { getAttribute: () => null }; } return attrs[id].getAttribute(k); };
  // W7: covers are calm (neutral ground, kind icon, typographic initial or native name). The area pin art moved off the
  // cards to the place detail's locator, so a grid page no longer fetches one art file per area.
  // W7: a credited photo (lib/gallery.js ph) laid over the calm cover, the same slot as the grid card's figure.pl-photo
  const root = Cleo.root || '../';
  // D-40 (a): a card with a 600–799 w copy asks for 240 px on 3× phones, as platform's cardSizes() does for the lists
  const phImg = (p, eager) => p ? '<img class="gc-img" src="' + esc(root + p[0]) + '"' + (p[5] && p[5].length > 1 ? ' srcset="' + p[5].map(x => esc(root + x[0]) + ' ' + x[1] + 'w').join(', ') + '" sizes="(min-resolution: 2.5dppx) and (max-width: 1023px) ' + (p[5].some(x => x[1] >= 600 && x[1] < 800) ? '240px' : '166px') + ', (min-width: 1024px) 300px, 80vw"' : '') +
    ' width="' + p[1] + '" height="' + p[2] + '" alt=""' + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">' : '';   // PERF-18: the lead is first-screen
  // the TASL credit, as text under the media (the card is one link; the linked credit is in the place detail)
  const phCred = p => p ? '<span class="gc-cred">' + esc(p[4]) + '</span>' : '';
  const CJK = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\uf900-\ufaff]/;
  const gcard = (r, i, eager) => {
    const nat = r.nat && r.n.slice(-r.nat.length - 2) === '(' + r.nat + ')' ? r.nat : '', g = Array.from(nat);
    const nm = nat ? r.n.slice(0, -nat.length - 2).trim() : r.n.replace(/\s*[—–-]+\s*CLOSED\b.*$/i, ''), col = ((info.areas || {})[r.a] || {}).c;
    const plate = g.length && g.length <= 4 && CJK.test(nat) ? '<span class="plate v"' + (info.lang ? ' lang="' + info.lang + '"' : '') + '>' + esc(nat) + '</span>'
      : '<span class="plate i" data-i="' + esc((nm.replace(/^(The|La|Le|El|Il|Der|Die|Das)\s+/i, '').match(/[A-Za-z0-9À-ɏ]/) || ['·'])[0]) + '"></span>';
    const ids = r.recby || (r.src || []).filter(x => x !== 'guide'), chips = ids.slice(0, 1).map(x => '<button type="button" class="src" data-src="' + esc(x) + '">' + esc(((info.src || {})[x] || [x])[0]) + '</button>').join(', ');
    return '<li class="gc' + (r.closed ? ' gc--closed' : '') + (r.ph ? '' : ' gc--np') + '" data-id="' + esc(r.id) + '"><a class="gc-a" href="#p-' + esc(r.id) + '"><span class="cover' + (r.closed ? ' closed' : '') + (r.kind === 'food' ? ' food' : '') + (r.ph ? ' has-ph' : '') + '" data-gl="' + esc(att(r.id, 'data-gl') || 'compass') + '" data-m="' + esc(att(r.id, 'data-m') || att(r.id, 'data-gl') || 'compass') + '" data-t="' + (r.t || 3) + '" data-comp="' + ((i || 0) % 5) + '"' + (col || (r.ph && r.ph[6]) ? ' style="' + (col ? '--ac:' + col + ';' : '') + (r.ph && r.ph[6] ? '--ph:' + esc(r.ph[6]) : '') + '"' : '') + ' aria-hidden="true">' + plate + '<span class="gl"><svg class="ico"><use href="#i-' + esc(att(r.id, 'data-gl') || 'compass') + '"/></svg></span>' + (r.kind === 'food' && !r.ph && r.d ? '<span class="dish' + (r.d.length > 28 || /\S{17}/.test(r.d) ? ' l' : '') + '">' + esc(r.d) + '</span>' : '') + phImg(r.ph, eager) + '</span>' + phCred(r.ph) +
      '<span class="gc-b"><span class="pl-e">' + (r.closed ? tt('gal.closed', 'Closed · kept for the record') : (r.t === 1 && ids.length ? '<span class="badge t1">' + TIER()[1] + '</span> ' : TIER()[r.t] ? '<span class="vh">' + TIER()[r.t] + ' · </span>' : '') + esc(C.label('a', r.a)) + ' · ' + (r.kind === 'food' ? esc(tt('city.mode.food', 'Eat & drink')) : tt('gal.see', 'See'))) + '</span>' +
      '<span class="gc-n">' + esc(nm) + '</span>' + (r.w ? '<span class="gc-w">' + esc(String(r.w).replace(/<[^>]+>/g, '')) + '</span>' : '') + '</span></a>' +
      (ids.length ? '<p class="pl-s"><span class="lbl">' + tt('card.recby', 'Recommended by') + '</span> ' + chips : '<p class="pl-s pl-norec"><span class="norec">' + tt('card.norec', 'No independent source yet') + '</span>' + ((r.src || []).includes('guide') ? ' · <span class="added">' + tt('city.card.added', 'Added by the guide (general knowledge)') + '</span>' : '')) /* FE-B D-53 / QA-87: recommenders only; general knowledge never after the label */ + (ids.length > 1 ? ' <span class="more">' + tt('gal.more', '+{n} more', { n: ids.length - 1 }) + '</span>' : '') + '</p>' +
      '<button type="button" class="heart gc-save" data-ref="' + esc(r.id) + '" aria-pressed="false" data-nm="' + esc(nm) + '" aria-label="' + esc(tt('gal.save', 'Save {name}', { name: nm })) + '"><svg class="ico" aria-hidden="true"><use href="#i-heart"/></svg></button></li>';
  };
  C.gcard = gcard;   // PERF-18: test-beta compares it with the build's lead card (lib/render/lead-card.js)
  // the rows + lead card come chosen from the build (lib/gallery.js → data/gallery/<page>.json, ~20 KB): the first
  // screen never fetches the whole page JSON (ROUND-5 gap #2). [title, subtitle, lens key, value, ★, n, records ≤ 12]
  let lead = null, allRows = [];
  const pending = [];
  const rowHtml = (x, i) => '<section class="row g-row" aria-labelledby="gr-' + i + '"><header class="row-h"><div><h2 class="d2" id="gr-' + i + '">' + (x[4] ? '<span aria-hidden="true">★</span> ' : '') + esc(rowT(x)) + '</h2>' +
    '<p class="sub">' + esc(subT(x[1])) + '</p></div><button type="button" class="btn btn-ghost" data-g-see="' + esc(x[2]) + '" data-v="' + esc(x[3]) + '">' + tt('gal.seeall', 'See all {n}', { n: x[5] }) + '</button></header>' +
    '<ol class="rail g-rail">' + x[6].map((r, k) => gcard(r, k)).join('') + '</ol></section>';
  let nRow = 0;
  // platform (M3-06, marked block): the next row is drawn when the END of the drawn rows nears the viewport (a 0-height
  // marker inside the rows host, so it hides with it), not when the last row's top does. A below-fold second row no longer
  // counts against the initial DOM (Tokyo desktop 3,082 → < 2,900 nodes); every row still arrives as the reader scrolls.
  let end = null;
  const stampRow = () => { const x = pending.shift(); if (!x) return null; const h = rowHtml(x, nRow++), m = end && end.parentNode === rowsHost;
    if (m) end.insertAdjacentHTML('beforebegin', h); else rowsHost.insertAdjacentHTML('beforeend', h); hearts(rowsHost); return m ? end.previousElementSibling : rowsHost.lastElementChild; };
  const watch = el => { if (!el || !pending.length) return; if (!io) { while (pending.length) stampRow(); return; }
    if (!end || end.parentNode !== rowsHost) { end = d.createElement('div'); end.className = 'g-rows-end'; end.setAttribute('aria-hidden', 'true'); rowsHost.appendChild(end); }
    io.unobserve(end); io.observe(end); };
  // /platform
  function start() {
    if (started || !rowsHost || !Cleo.pageData) return; started = 1;
    const f = String(info.file || C.key).replace(/\//g, '--');
    (window.fetch ? fetch(Cleo.root + 'data/gallery/' + f + '.json').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }) : Promise.reject(new Error('no fetch'))).then(o => {
      pending.push.apply(pending, o.rows); lead = o.lead && o.lead.ph ? o.lead : null; allRows = o.rows;   // D-49 §v2.7b: a lead CARD only when rank 1 has a photo
      if ('IntersectionObserver' in window) io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target);
        // W7: not behind an open place sheet (a #p= deep link keeps the page light, ≤ 3,000 nodes); the next row waits for its close
        if (Cleo.sheet && Cleo.sheet.isOpen()) { const t = e.target, w = () => { if (Cleo.sheet.isOpen()) setTimeout(w, 600); else io.observe(t); }; setTimeout(w, 600); return; }
        watch(stampRow()); }), { rootMargin: '200px 0px' });
      watch(stampRow());
      // the lead card: floats in the hero on desktop; on phones and tablets it is the first card under the hero, so a
      // real place card (cover, name, Recommended by, heart) sits inside the first screen (ROUND-4 #2, B-01)
      const mh = $('.masthead'), slot = $('#cleo-lead');
      // PERF-18 (platform, marked): the build already rendered this card into the phone slot (lib/render/lead-card.js) so it
      // paints with the HTML; adopt it — place it (masthead on desktop), hearts, g-lead-on — and draw one only when absent
      let ol = $('.g-lead-card');
      if (lead && mh) {
        if (!ol) { ol = d.createElement('ol'); ol.className = 'g-lead-card vw view-gallery'; ol.setAttribute('aria-label', tt('city.lead.k', 'Start with')); ol.innerHTML = gcard(lead, 1, true); }
        const mq = window.matchMedia && matchMedia('(min-width: 1024px)');
        const place = () => { const host = !slot || (mq && mq.matches) ? mh : slot; if (ol.parentNode !== host) host.appendChild(ol); };
        place(); if (mq) { if (mq.addEventListener) mq.addEventListener('change', place); else if (mq.addListener) mq.addListener(place); }
        html.classList.add('g-lead-on'); hearts(ol);
      }
    }).catch(() => { started = 0; });
  }

  // hearts on row / lead cards: the same Cleo.saved.toggle(ref) as every card (SPEC §2.5)
  const hearts = root => { const s = Cleo.saved ? Cleo.saved.all() : {};
    qa('button.gc-save', root).forEach(b => { const o = !!s[C.key + '/' + at(b, 'data-ref')]; b.setAttribute('aria-pressed', String(o)); b.setAttribute('aria-label', o ? tt('gal.saved', 'Saved: {name}', { name: at(b, 'data-nm') }) : tt('gal.save', 'Save {name}', { name: at(b, 'data-nm') })); }); };
  on(d, 'cleo:saved', () => hearts(d));
  // i18n D-41: rows and the lead card drawn before the ja catalogue arrived are redrawn in it
  on(d, 'cleo:locale', () => {
    if (!rowsHost || !allRows.length) return;
    const n = nRow; rowsHost.innerHTML = ''; nRow = 0; pending.length = 0; pending.push.apply(pending, allRows);
    for (let i = 0; i < n; i++) stampRow();
    const lc = $('.g-lead-card'); if (lc && lead) { lc.setAttribute('aria-label', tt('city.lead.k', 'Start with')); lc.innerHTML = gcard(lead, 1, true); hearts(lc); }
    if (io) { io.disconnect(); watch(rowsHost.lastElementChild); }
  });
  on(d, 'click', e => {
    const t = e.target; let b;
    if ((b = t.closest('button.gc-save')) && Cleo.saved) { Cleo.saved.toggle(C.key + '/' + at(b, 'data-ref')); }
    else if ((b = t.closest('[data-g-see]'))) { const o = {}; o[at(b, 'data-g-see')] = at(b, 'data-v'); C.go(o); if (grid) grid.scrollIntoView({ block: 'start' }); }
    else if ((b = t.closest('[data-g-browse]'))) { e.preventDefault(); if (grid) grid.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  });

  // data-comp: the composition hook, by position among the cards on screen, so no two neighbours share one (5 > 4 columns)
  const cover = (c, i) => { const p = $('.pl-cover', c); if (p) p.setAttribute('data-comp', String(i % 5)); };
  const paint = () => {
    if (!isG()) return; start();
    qa('li.pl:not([hidden]):not(.pg-off)').forEach(cover);
    html.classList.toggle('lens-on', C.cards.some(c => c.hidden));   // a lens is on: the grid answers it, the rows step aside
  };
  on(d, 'cleo:paged', paint); on(d, 'cleo:view', paint); C.after.push(paint);
  paint();
})();
