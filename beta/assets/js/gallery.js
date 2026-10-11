/* generated copy of tools/beta/client/gallery.js (minified) — do not edit here */
(() => {
'use strict';
const Cleo = window.Cleo || {}, C = Cleo.city, d = document, html = d.documentElement;
if (!C || C.gallery) return;
C.gallery = 1;
const $ = (s, el) => (el || d).querySelector(s), qa = (s, el) => [].slice.call((el || d).querySelectorAll(s));
const at = (el, a) => el.getAttribute(a), on = (el, ev, f) => el && el.addEventListener(ev, f);
const info = C.info, rowsHost = $('#cleo-rows-host'), grid = $('#cleo-grid'), isG = () => at(html, 'data-view') === 'gallery';
let io = null, started = 0;
const esc = C.esc, TIER = ['', 'Must see', 'Worth the detour', 'Deep cut'], attrs = {};
const att = (id, k) => { if (!attrs[id]) { const c = C.byId[id] || (Cleo.defer && Cleo.defer.peek().filter(x => x.id === 'p-' + id)[0]); attrs[id] = c || { getAttribute: () => null }; } return attrs[id].getAttribute(k); };
const root = Cleo.root || '../';
const phHtml = p => p ? '<figure class="photo gc-photo"><img src="' + esc(root + p[0]) + '"' + (p[5] && p[5].length > 1 ? ' srcset="' + p[5].map(x => esc(root + x[0]) + ' ' + x[1] + 'w').join(', ') + '" sizes="(min-width: 1024px) 300px, 80vw"' : '') +
' width="' + p[1] + '" height="' + p[2] + '" alt="' + esc(p[3]) + '" loading="lazy" decoding="async"><figcaption>' + p[4] + '</figcaption></figure>' : '';
const CJK = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\uf900-\ufaff]/;
const gcard = (r, i) => {
const nat = r.nat && r.n.slice(-r.nat.length - 2) === '(' + r.nat + ')' ? r.nat : '', g = Array.from(nat);
const nm = nat ? r.n.slice(0, -nat.length - 2).trim() : r.n.replace(/\s*[—–-]+\s*CLOSED\b.*$/i, ''), col = ((info.areas || {})[r.a] || {}).c;
const plate = g.length && g.length <= 4 && CJK.test(nat) ? '<span class="plate v"' + (info.lang ? ' lang="' + info.lang + '"' : '') + '>' + esc(nat) + '</span>'
: '<span class="plate i" data-i="' + esc((nm.replace(/^(The|La|Le|El|Il|Der|Die|Das)\s+/i, '').match(/[A-Za-z0-9À-ɏ]/) || ['·'])[0]) + '"></span>';
const ids = (r.src || []).filter(x => x !== 'guide'), chips = ids.slice(0, 2).map(x => '<button type="button" class="src" data-src="' + esc(x) + '">' + esc(((info.src || {})[x] || [x])[0]) + '</button>').join(', ');
return '<li class="gc' + (r.closed ? ' gc--closed' : '') + '" data-id="' + esc(r.id) + '"><a class="gc-a" href="#p-' + esc(r.id) + '"><span class="cover' + (r.closed ? ' closed' : '') + '" data-gl="' + esc(att(r.id, 'data-gl') || 'compass') + '" data-m="' + esc(att(r.id, 'data-m') || att(r.id, 'data-gl') || 'compass') + '" data-t="' + (r.t || 3) + '" data-comp="' + ((i || 0) % 5) + '"' + (col ? ' style="--ac:' + col + '"' : '') + ' aria-hidden="true">' + plate + '<span class="gl"><svg class="ico"><use href="#i-' + esc(att(r.id, 'data-gl') || 'compass') + '"/></svg></span></span>' +
'<span class="gc-b"><span class="pl-e">' + (r.closed ? 'Closed · kept for the record' : (r.t === 1 ? '<span class="badge t1">Must see</span> ' : TIER[r.t] ? '<span class="vh">' + TIER[r.t] + ' · </span>' : '') + esc(C.label('a', r.a)) + ' · ' + (r.kind === 'food' ? 'Eat &amp; drink' : 'See')) + '</span>' +
'<span class="gc-n">' + esc(nm) + '</span>' + (r.w ? '<span class="gc-w">' + esc(String(r.w).replace(/<[^>]+>/g, '')) + '</span>' : '') + '</span></a>' + phHtml(r.ph) +
'<p class="pl-s"><span class="lbl">Recommended by</span> ' + (chips || '<span class="added">Added by the guide (general knowledge)</span>') + (ids.length > 2 ? ' <span class="more">+' + (ids.length - 2) + '</span>' : '') + '</p>' +
'<button type="button" class="heart gc-save" data-ref="' + esc(r.id) + '" aria-pressed="false" aria-label="Save ' + esc(nm) + '"><svg class="ico" aria-hidden="true"><use href="#i-heart"/></svg></button></li>';
};
let lead = null;
const pending = [];
const rowHtml = (x, i) => '<section class="row g-row" aria-labelledby="gr-' + i + '"><header class="row-h"><div><h2 class="d2" id="gr-' + i + '">' + (x[4] ? '<span aria-hidden="true">★</span> ' : '') + esc(x[0]) + '</h2>' +
'<p class="sub">' + esc(x[1]) + '</p></div><button type="button" class="btn btn-ghost" data-g-see="' + esc(x[2]) + '" data-v="' + esc(x[3]) + '">See all ' + x[5] + '</button></header>' +
'<ol class="rail g-rail">' + x[6].map((r, k) => gcard(r, k)).join('') + '</ol></section>';
let nRow = 0;
const stampRow = () => { const x = pending.shift(); if (!x) return null; rowsHost.insertAdjacentHTML('beforeend', rowHtml(x, nRow++)); hearts(rowsHost); return rowsHost.lastElementChild; };
const watch = el => { if (!el || !pending.length) return; if (!io) { while (pending.length) stampRow(); return; } io.observe(el); };
function start() {
if (started || !rowsHost || !Cleo.pageData) return; started = 1;
const f = String(info.file || C.key).replace(/\//g, '--');
(window.fetch ? fetch(Cleo.root + 'data/gallery/' + f + '.json').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }) : Promise.reject(new Error('no fetch'))).then(o => {
pending.push.apply(pending, o.rows); lead = o.lead;
if ('IntersectionObserver' in window) io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); watch(stampRow()); }), { rootMargin: '200px 0px' });
watch(stampRow());
const mh = $('.masthead'), slot = $('#cleo-lead');
if (lead && mh && !$('.g-lead-card')) {
const ol = d.createElement('ol'); ol.className = 'g-lead-card vw view-gallery'; ol.setAttribute('aria-label', 'Start with'); ol.innerHTML = gcard(lead, 1);
const mq = window.matchMedia && matchMedia('(min-width: 1024px)');
const place = () => { const host = !slot || (mq && mq.matches) ? mh : slot; if (ol.parentNode !== host) host.appendChild(ol); };
place(); if (mq) { if (mq.addEventListener) mq.addEventListener('change', place); else if (mq.addListener) mq.addListener(place); }
html.classList.add('g-lead-on'); hearts(ol);
}
}).catch(() => { started = 0; });
}
const hearts = root => { const s = Cleo.saved ? Cleo.saved.all() : {};
qa('button.gc-save', root).forEach(b => { const o = !!s[C.key + '/' + at(b, 'data-ref')]; b.setAttribute('aria-pressed', String(o)); b.setAttribute('aria-label', (o ? 'Saved: ' : 'Save ') + b.getAttribute('aria-label').replace(/^(Saved: |Save )/, '')); }); };
on(d, 'cleo:saved', () => hearts(d));
on(d, 'click', e => {
const t = e.target; let b;
if ((b = t.closest('button.gc-save')) && Cleo.saved) { Cleo.saved.toggle(C.key + '/' + at(b, 'data-ref')); }
else if ((b = t.closest('[data-g-see]'))) { const o = {}; o[at(b, 'data-g-see')] = at(b, 'data-v'); C.go(o); if (grid) grid.scrollIntoView({ block: 'start' }); }
else if ((b = t.closest('[data-g-browse]'))) { e.preventDefault(); if (grid) grid.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
});
const cover = (c, i) => { const p = $('.pl-cover', c); if (p) p.setAttribute('data-comp', String(i % 5)); };
const paint = () => {
if (!isG()) return; start();
qa('li.pl:not([hidden]):not(.pg-off)').forEach(cover);
html.classList.toggle('lens-on', C.cards.some(c => c.hidden));
};
on(d, 'cleo:paged', paint); on(d, 'cleo:view', paint); C.after.push(paint);
paint();
})();

