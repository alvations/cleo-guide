/* generated copy of tools/beta/client/core.js (minified) — do not edit here */
(function () {
'use strict';
var Cleo = window.Cleo = window.Cleo || {};
var me = document.currentScript && document.currentScript.src || '';
Cleo.root = me ? me.replace(/assets\/js\/core\.js.*$/, '') : '';
var mem = {};
function rawGet(k) {
try { var v = window.localStorage.getItem(k); if (v !== null && v !== undefined) return v; } catch (e) {}
return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
}
function rawSet(k, v) {
mem[k] = v;
try { window.localStorage.setItem(k, v); } catch (e) {}
}
Cleo.store = {
get: function (k, d) { var v = rawGet('cleo:v1:' + k); if (v === null) return d; try { return JSON.parse(v); } catch (e) { return d; } },
set: function (k, v) { rawSet('cleo:v1:' + k, JSON.stringify(v)); }
};
function emit(name, detail) {
var ev; try { ev = new CustomEvent(name, { detail: detail }); } catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent(name, false, false, detail); }
document.dispatchEvent(ev);
}
Cleo.emit = emit;
Cleo.saved = {
all: function () { var s = Cleo.store.get('saved', {}); return s && typeof s === 'object' ? s : {}; },
has: function (ref) { return !!this.all()[ref]; },
toggle: function (ref) {
var s = this.all(); if (s[ref]) delete s[ref]; else s[ref] = { t: Date.now() };
Cleo.store.set('saved', s); emit('cleo:saved', { ref: ref, on: !!s[ref] }); return !!s[ref];
},
add: function (refs) { var s = this.all(); refs.forEach(function (r) { if (!s[r]) s[r] = { t: Date.now() }; }); Cleo.store.set('saved', s); emit('cleo:saved', {}); },
count: function () { return Object.keys(this.all()).length; }
};
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
var VIEWS = ['gallery', 'atlas', 'guidebook', 'insights'];
var ID = /^[A-Za-z0-9_.~-]{1,80}$/;
var areaOk = function (v) {
var el = document.getElementById('cleo-city'), info = null;
try { info = el && JSON.parse(el.textContent); } catch (e) {}
return ID.test(v) && (!info || !info.areas || Object.prototype.hasOwnProperty.call(info.areas, v));
};
Cleo.route = {
KEYS: {
p: ID, c: ID, cz: ID, src: ID, q: null, day: null, list: null, map: null,
mode: /^(sights|food)$/,
view: function (v) { return VIEWS.indexOf(v) >= 0; },
a: areaOk,
t: /^[123]$/,
closed: /^1$/,
pg: /^[1-9]\d{0,4}$/,
all: /^1$/
},
ok: function (k, v) {
var f = this.KEYS[k];
return !f ? true : typeof f === 'function' ? !!f(v) : f.test(v);
},
raw: function () {
var h = location.hash.replace(/^#/, ''), o = {};
if (!h || h.indexOf('=') < 0) return o;
h.split('&').forEach(function (kv) {
var i = kv.indexOf('='); if (i < 1) return;
try { o[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1)); } catch (e) {}
});
return o;
},
parse: function () {
var o = this.raw(), out = {}, self = this;
Object.keys(o).forEach(function (k) { if (self.ok(k, o[k])) out[k] = o[k]; });
return out;
},
clean: function () {
var o = this.raw(), bad = Object.keys(o).filter(function (k) { return !Cleo.route.ok(k, o[k]); });
if (bad.length && history.replaceState) {
var h = this.href(this.parse());
history.replaceState(history.state, '', h === '#' ? location.pathname + location.search : h);
}
return bad;
},
href: function (o) {
var parts = []; Object.keys(o).forEach(function (k) { if (o[k] !== undefined && o[k] !== null && o[k] !== '') parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(o[k])); });
return parts.length ? '#' + parts.join('&') : '#';
},
go: function (o, replace) {
var h = this.href(o);
if (replace && history.replaceState) { history.replaceState(null, '', h === '#' ? location.pathname + location.search : h); emit('cleo:route', o); }
else location.hash = h;
}
};
Cleo.route.clean();
window.addEventListener('hashchange', function () { Cleo.route.clean(); });
Cleo.view = {
VIEWS: VIEWS, DEFAULT: 'gallery',
current: function () {
var h = Cleo.route.parse().view; if (h) return h;
var s = Cleo.store.get('view', null); return VIEWS.indexOf(s) >= 0 ? s : this.DEFAULT;
}
};
var lensText = typeof WeakMap === 'function' ? new WeakMap() : null;
var hasWord = function (el, k, v) { return (' ' + (el.getAttribute(k) || '') + ' ').indexOf(' ' + v + ' ') >= 0; };
Cleo.lens = {
KEYS: ['mode', 'a', 't', 'c', 'cz', 'src', 'closed', 'q'],
text: function (el) {
var t = lensText && lensText.get(el); if (t === undefined || t === null) { t = fold(el.textContent); if (lensText) lensText.set(el, t); }
return t;
},
match: function (el, o) {
o = o || {};
var k = el.getAttribute('data-k'), closed = el.hasAttribute('data-closed');
if ((o.mode === 'sights' && k !== 's') || (o.mode === 'food' && k !== 'f')) return false;
if (o.a && el.getAttribute('data-a') !== o.a) return false;
if (o.t && (closed || el.getAttribute('data-t') !== String(o.t))) return false;
if (o.c && !hasWord(el, 'data-g', o.c)) return false;
if (o.cz && !hasWord(el, 'data-cz', o.cz)) return false;
if (o.src && !hasWord(el, 'data-src', o.src)) return false;
if (o.closed && !closed) return false;
if (o.q) { var hay = el.stub ? String(el.id || '').replace(/-/g, ' ') : Cleo.lens.text(el);
var ws = fold(o.q).split(/\s+/); for (var i = 0; i < ws.length; i++) if (ws[i] && hay.indexOf(ws[i]) < 0) return false; }
return true;
},
pick: function (o) { var out = {}; (o = o || {}); Cleo.lens.KEYS.forEach(function (k) { if (o[k]) out[k] = o[k]; }); return out; },
on: function (o) { return Object.keys(Cleo.lens.pick(o)).length > 0; },
apply: function (cards, o) { var n = 0; [].forEach.call(cards, function (c) { var v = Cleo.lens.match(c, o); c.hidden = !v; if (v) n++; }); return n; }
};
Cleo.k3 = function (el) { return el.getAttribute('data-k3') || (el.getAttribute('data-k') === 'f' ? 'food' : 'sight'); };
Cleo.order = function (cards, areas) {
var list = [].slice.call(cards);
if (!areas) { var el = document.getElementById('cleo-city'); try { areas = Object.keys(JSON.parse(el.textContent).areas || {}); } catch (e) { areas = []; } }
var ai = {}; areas.forEach(function (a, i) { ai[a] = i; });
var seen = areas.length;
list.forEach(function (c) { var a = c.getAttribute('data-a'); if (!(a in ai)) ai[a] = seen++; });
return list.map(function (c, i) { return [c, i]; }).sort(function (x, y) {
return (ai[x[0].getAttribute('data-a')] - ai[y[0].getAttribute('data-a')]) ||
((+x[0].getAttribute('data-rank') || 1e9) - (+y[0].getAttribute('data-rank') || 1e9)) || (x[1] - y[1]);
}).map(function (x) { return x[0]; });
};
Cleo.countLine = function (n, N, st) {
var pl = function (x, w, ws) { return x + ' ' + (x === 1 ? w : ws || w + 's'); };
if (n !== N) return n + ' of all ' + pl(N, 'place');
if (!st) return 'All ' + pl(N, 'place');
var parts = ['All ' + pl(N, 'place'), pl(st.sights, 'sight'), st.food + ' eat & drink'];
if (st.areas) parts.push(pl(st.areas, 'area'));
if (st.closed) parts.push(st.closed + ' closed, kept for the record');
if (st.lastChecked) parts.push('status checked to ' + st.lastChecked);
return parts.join(' · ');
};
Cleo.share = function (title, url) {
if (navigator.share) return navigator.share({ title: title, url: url }).catch(function () {});
try { if (navigator.clipboard) return navigator.clipboard.writeText(url).then(function () { emit('cleo:toast', 'Link copied'); }); } catch (e) {}
window.prompt('Copy this link', url);
};
var idx = null;
Cleo.searchIndex = function () {
if (idx) return idx;
idx = (window.fetch ? fetch(Cleo.root + 'data/search.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
: Promise.reject(new Error('no fetch')));
idx.catch(function () { idx = null; });
return idx;
};
var fold = function (s) { return String(s || '').normalize ? String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase() : String(s).toLowerCase(); };
Cleo.fold = fold;
Cleo.search = function (data, q) {
var terms = fold(q).split(/\s+/).filter(Boolean); if (!terms.length) return [];
var out = [];
data.items.forEach(function (it) {
var pg = data.pages[it[0]], name = fold(it[2]), hay = name + ' ' + fold(it[6]) + ' ' + fold(pg[1]);
for (var i = 0; i < terms.length; i++) if (hay.indexOf(terms[i]) < 0) return;
var score = (name.indexOf(terms[0]) === 0 ? 0 : name.indexOf(terms[0]) >= 0 ? 1 : 2) * 10 + it[4] + (it[5] ? 5 : 0);
out.push({ s: score, it: it, pg: pg });
});
out.sort(function (a, b) { return a.s - b.s; });
return out;
};
var pd = {};
Cleo.pageData = function (key) {
var f = String(key || '').replace(/\//g, '--');
if (!pd[f]) {
pd[f] = window.fetch ? fetch(Cleo.root + 'data/places/' + f + '.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
: Promise.reject(new Error('no fetch'));
pd[f].catch(function () { delete pd[f]; });
}
return pd[f];
};
Cleo.guide = function (key) { return Cleo.pageData(key).then(function (d) { return d.guide; }); };
Cleo.geo = {
km: function (a, b) {
var A = a.length ? { la: a[0], ln: a[1] } : a, B = b.length ? { la: b[0], ln: b[1] } : b, t = Math.PI / 180;
var h = Math.pow(Math.sin((B.la - A.la) * t / 2), 2) + Math.cos(A.la * t) * Math.cos(B.la * t) * Math.pow(Math.sin((B.ln - A.ln) * t / 2), 2);
return 2 * 6371.0088 * Math.asin(Math.min(1, Math.sqrt(h)));
},
fmt: function (km) { return km < 0.1 ? 'next door (under 0.1 km straight-line)' : (km < 10 ? km.toFixed(1) : Math.round(km)) + ' km straight-line'; },
ll: function (el) { var v = (el && el.getAttribute('data-ll') || '').split(','); return v.length === 2 ? [+v[0], +v[1]] : null; }
};
Cleo.art = {
xy: function (proj, la, ln) {
return [proj.pad + (ln - proj.box[1]) * proj.kx, proj.pad + (proj.box[2] - la) * proj.ky];
}
};
Cleo.watchTiles = function (layer, onFail, n) {
var errs = 0, ok = false, done = false; n = n || 4;
layer.on('tileload', function () { ok = true; });
layer.on('tileerror', function () { if (!ok && !done && ++errs >= n) { done = true; onFail(); } });
};
Cleo.mapFallback = function (el, map) {
try { if (map && map.remove) map.remove(); } catch (e) {}
var art = el.getAttribute('data-art'), alt = el.getAttribute('data-art-alt') || '';
el.innerHTML = (art ? '<figure class="map-art map-fallback"><img alt="" decoding="async" style="max-width:100%;height:auto"><figcaption></figcaption></figure>'
: '<div class="map-fallback"><p></p></div>');
var img = el.querySelector('img'); if (img) { img.src = art; img.alt = alt; }
var cap = el.querySelector('figcaption, p');
cap.innerHTML = '<strong>The map couldn\u2019t load.</strong> The list still has every place, address and source. ' +
'We\u2019re showing map art from our own pins until tiles return. <button type="button" class="map-retry">Try again</button>';
cap.querySelector('button').addEventListener('click', function () { location.reload(); });
el.setAttribute('data-tiles', 'failed');
emit('cleo:tiles-failed', {});
};
var D = Cleo.defer = {
pending: function () { return [].slice.call(document.querySelectorAll('noscript[data-cleo-defer]')); },
stamp: function (ns) {
if (!ns || !ns.parentNode) return [];
var t = document.createElement('template'), ol = ns.parentNode;
t.innerHTML = ns.children && ns.children.length ? ns.innerHTML : ns.textContent;
var cards = [].slice.call(t.content.querySelectorAll('li.pl'));
ol.insertBefore(t.content, ns); ol.removeChild(ns);
var gap = ol.querySelector('.cleo-defer-gap');
if (gap) { var left = 0; [].forEach.call(ol.querySelectorAll('noscript[data-cleo-defer]'), function (x) { left += +x.getAttribute('data-n') || 0; });
if (left) gap.style.height = Math.round(left * (+gap.getAttribute('data-est') || 0)) + 'px'; else ol.removeChild(gap); }
if (cards.length) emit('cleo:stamped', { cards: cards });
return cards;
},
all: function () { var out = []; D.pending().forEach(function (ns) { out = out.concat(D.stamp(ns)); }); if (io) { io.disconnect(); io = null; }
VC.slice().forEach(function (c) { c.all(); }); return out; },
stampFor: function (id) {
var el = document.getElementById('p-' + id); if (el) return el;
var hit = D.pending().filter(function (ns) { return ns.textContent.indexOf('id="p-' + id + '"') >= 0 || ns.innerHTML.indexOf('id="p-' + id + '"') >= 0; })[0];
if (hit) D.stamp(hit);
return document.getElementById('p-' + id);
},
peek: function () {
var out = [];
D.pending().forEach(function (ns) {
var src = ns.children && ns.children.length ? ns.innerHTML : ns.textContent, re = /<li class="pl[ "][^>]*>/g, m;
while ((m = re.exec(src))) {
var at = {}, a = /([a-z-]+)(?:="([^"]*)")?/g, x, tag = m[0].slice(3, -1);
while ((x = a.exec(tag))) at[x[1]] = x[2] === undefined ? '' : x[2].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
out.push({ id: at.id, stub: true, getAttribute: function (k) { return Object.prototype.hasOwnProperty.call(this._a, k) ? this._a[k] : null; },
hasAttribute: function (k) { return Object.prototype.hasOwnProperty.call(this._a, k); }, _a: at });
}
});
return out;
}
};
var VC = [];
Cleo.chunks = function (host, parts, opt) {
opt = opt || {};
var i = 0, ob = null, gap = null, step = opt.step || 1, api;
var put = function (k) {
k = Math.min(k, parts.length); if (k <= i) return;
var from = i, html = parts.slice(i, k).join(''); i = k;
if (gap && gap.parentNode === host) gap.insertAdjacentHTML('beforebegin', html); else host.insertAdjacentHTML('beforeend', html);
emit('cleo:view-stamped', { host: host, from: from, to: k });
if (i >= parts.length) stop();
};
var stop = function () {
if (ob) { ob.disconnect(); ob = null; }
if (gap && gap.parentNode) gap.parentNode.removeChild(gap); gap = null;
var x = VC.indexOf(api); if (x >= 0) VC.splice(x, 1);
};
api = {
all: function () { put(parts.length); },
reach: function (id) { if (!opt.ids) return api.all(); for (var k = i; k < parts.length; k++) if ((opt.ids[k] || []).indexOf(id) >= 0) return put(k + 1); },
left: function () { return parts.length - i; },
cancel: stop
};
VC.push(api);
put(opt.initial == null ? 1 : opt.initial);
if (i >= parts.length) return api;
if (!('IntersectionObserver' in window)) { api.all(); return api; }
gap = document.createElement('div'); gap.className = 'cleo-defer-gap'; gap.setAttribute('aria-hidden', 'true');
gap.style.cssText = 'grid-column:1/-1;margin:0;padding:0;border:0;height:' + (opt.est || 600) + 'px';
host.appendChild(gap);
ob = new IntersectionObserver(function (es) {
if (!ob || !es.some(function (e) { return e.isIntersecting; })) return;
put(i + step);
if (ob && gap) { ob.unobserve(gap); ob.observe(gap); }
}, { rootMargin: '1200px 0px' });
ob.observe(gap);
return api;
};
Cleo.chunks.pending = function () { return VC.length; };
var io = null;
var QUIET = ['p', 'view', 'map', 'pg', 'all'];
function quiet() {
var h = location.hash; if (!h || h === '#') return true;
if (/^#p-[A-Za-z0-9_.~-]+$/.test(h)) return 'p';
if (h.indexOf('=') < 0) return false;
var r = Cleo.route.parse(), ks = Object.keys(r);
if (!ks.every(function (k) { return QUIET.indexOf(k) >= 0; })) return false;
return r.p ? 'p' : true;
}
function stampPlace() {
var m = /^#p-(.+)$/.exec(location.hash), id = m ? m[1] : Cleo.route.parse().p;
VC.slice().forEach(function (c) { c.reach(id); });
if (!D.stampFor(id)) D.all();
}
function deferInit() {
var list = D.pending(); if (!list.length) return;
var h = location.hash;
if (!('IntersectionObserver' in window)) { D.all(); if (h && h !== '#') emit('cleo:route', {}); return; }
var q = quiet();
if (q === 'p') { stampPlace(); emit('cleo:route', {}); }
else if (!q) {
D.all();
emit('cleo:route', {});
return;
}
var live = document.querySelector('ol.pls'), cards = live ? live.querySelectorAll(':scope > li.pl') : [];
var est = cards.length && live.offsetHeight ? live.offsetHeight / cards.length : 0;
var watch = function (ol) {
var ns = ol.querySelector('noscript[data-cleo-defer]'); if (!ns || !io) return;
var t = ns.previousElementSibling || ol; t._cleoNext = ns; io.observe(t);
};
io = new IntersectionObserver(function (es) {
es.forEach(function (e) {
if (!e.isIntersecting || !io) return;
io.unobserve(e.target);
var ns = e.target._cleoNext, ol = ns && ns.parentNode; e.target._cleoNext = null;
if (ol) { D.stamp(ns); watch(ol); }
});
}, { rootMargin: '1200px 0px' });
D.pending().forEach(function (ns) {
var ol = ns.parentNode; if (!ol || ol.getAttribute('data-cleo-deferred')) return;
ol.setAttribute('data-cleo-deferred', '1');
if (est) {
var n = 0; [].forEach.call(ol.querySelectorAll('noscript[data-cleo-defer]'), function (x) { n += +x.getAttribute('data-n') || 0; });
var g = document.createElement('div'); g.className = 'cleo-defer-gap'; g.setAttribute('aria-hidden', 'true'); g.setAttribute('data-est', est.toFixed(1));
g.style.cssText = 'grid-column:1/-1;margin:0;padding:0;border:0;height:' + Math.round(n * est) + 'px';
ol.appendChild(g);
}
watch(ol);
});
}
var allNow = function () { if (D.pending().length || VC.length) D.all(); };
var routed = function () { if (!D.pending().length && !VC.length) return; var q = quiet(); if (q === 'p') stampPlace(); else if (!q) allNow(); };
window.addEventListener('hashchange', routed);
document.addEventListener('cleo:route', routed);
window.addEventListener('beforeprint', allNow);
var NEEDS_ALL = '[data-mode],[data-cleo-all],.rail-i,.pl-s button.src,[data-cleo-tray],[data-cleo-map],[data-unset],[data-tr],[data-cleo-day],[data-cleo-near],[data-cleo-foryou],[data-cleo-mine]';
document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest(NEEDS_ALL)) allNow(); }, true);
document.addEventListener('focusin', function (e) { if (e.target.matches && e.target.matches('#cleo-filter,main input[type=search]')) allNow(); }, true);
document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F' || e.key === 'g')) allNow(); }, true);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', deferInit); else deferInit();
function paintCount() {
var n = Cleo.saved.count();
Array.prototype.forEach.call(document.querySelectorAll('[data-cleo-saved-count]'), function (el) { el.textContent = n ? String(n) : ''; });
}
document.addEventListener('cleo:saved', paintCount);
document.addEventListener('DOMContentLoaded', paintCount);
Cleo.offline = {
urls: function () {
var o = location.origin, out = [location.href.split('#')[0]], main = document.getElementById('main'), key = main && main.getAttribute('data-city');
try { (performance.getEntriesByType('resource') || []).forEach(function (r) { if (r.name.indexOf(o) === 0) out.push(r.name); }); } catch (e) {}
if (key) out.push(Cleo.root + 'data/places/' + key.replace(/\//g, '--') + '.json');
return out.filter(function (u, i) { return out.indexOf(u) === i; });
},
save: function () {
if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller && !navigator.serviceWorker.ready) return Promise.reject(new Error('no service worker'));
return navigator.serviceWorker.ready.then(function (reg) {
return new Promise(function (ok) {
var t = setTimeout(function () { ok({ n: 0, ok: 0, timeout: true }); }, 15000);
navigator.serviceWorker.addEventListener('message', function h(e) { if (e.data && e.data.type === 'cached') { clearTimeout(t); navigator.serviceWorker.removeEventListener('message', h); emit('cleo:offline', e.data); ok(e.data); } });
reg.active.postMessage({ type: 'cache', urls: Cleo.offline.urls() });
});
});
}
};
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && Cleo.root) {
window.addEventListener('load', function () {
navigator.serviceWorker.register(Cleo.root + 'sw.js').then(function () { return Cleo.offline.save(); }).catch(function () {});
});
}
})();

