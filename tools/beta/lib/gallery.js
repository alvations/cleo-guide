'use strict';
/**
 * Gallery rows + lead card, chosen at build time (ROUND-5 gap #2, default-view weight). Emitted as
 * data/gallery/<page>.json, so the Gallery's first screen reads ~20 KB instead of the whole page JSON
 * (data/places/<page>.json, which stays the open dataset and loads only when a view needs it).
 * SPEC §3.1 order: ★ signature, Must see, the food canon (when it is one lens), the 3 largest other
 * collections / cuisines, Recently closed. View order inside a row: area order, then rank (open first, tier, named
 * sources, live order). Row: [title, subtitle, lens key, value, ★, n, records ≤ 12].
 */
const SLIM = ['id', 'n', 'nat', 'a', 'closed', 't', 'src', 'w', 'kind', 'la', 'ln'];
const slim = r => Object.fromEntries(SLIM.filter(k => r[k] != null && r[k] !== '' && r[k] !== false).map(k => [k, r[k]]));
const pl = n => n + (n === 1 ? ' place' : ' places');

function rowsOf(j, name) {
  const ar = (j.areas || []).map(a => a.id), named = r => (r.src || []).filter(x => x !== 'guide').length, G = j.guide || {};
  const ord = (j.places || []).map((r, i) => [r, i]).sort(([x, i], [y, k]) => { const ax = ar.indexOf(x.a), ay = ar.indexOf(y.a);
    return (ax < 0 ? 1e3 : ax) - (ay < 0 ? 1e3 : ay) || (x.closed ? 1 : 0) - (y.closed ? 1 : 0) || x.t - y.t || named(y) - named(x) || i - k; }).map(p => p[0]);
  const inC = id => ord.filter(r => (r.g || []).indexOf(id) >= 0), inCz = id => ord.filter(r => (r.cz || []).indexOf(id) >= 0), out = [], used = {};
  const add = (t, sub, k, v, list, star) => { if (!list.length || used[k + '=' + v]) return; used[k + '=' + v] = 1; out.push([t, sub, k, v, star, list.length, list.slice(0, 12).map(slim)]); };
  const star = (j.collections || []).filter(c => /^★/.test(c.n) && inC(c.id).length)[0], sg = G.signature;
  let sig = [];
  if (star) { sig = inC(star.id); add(star.n.replace(/^★\s*/, ''), pl(sig.length) + ' · the signature of ' + name, 'c', star.id, sig, 1); }
  else if (sg && sg.n) { const c = sg.kind === 'collection' && sg.c && (j.collections || []).filter(x => x.id === sg.c[0])[0];
    sig = c ? inC(c.id) : ord.filter(r => (sg.ids || []).indexOf(r.id) >= 0); add(c ? c.n : sg.title, pl(sig.length) + ' · the signature of ' + name, c ? 'c' : 'sig', c ? c.id : '1', sig, 1); }
  add('Must see', pl(ord.filter(r => r.t === 1 && !r.closed).length) + ' · the top tier, graded within each area', 't', '1', ord.filter(r => r.t === 1 && !r.closed), 0);
  if (G.canon && G.canon.cz && G.canon.cz.length === 1) add(G.canon.title || 'The canon', pl(inCz(G.canon.cz[0]).length) + ' · what ' + name + ' is known for', 'cz', G.canon.cz[0], inCz(G.canon.cz[0]), 0);
  (j.collections || []).map(c => ['c', c, inC(c.id)]).concat((j.cuisines || []).map(c => ['cz', c, inCz(c.id)]))
    .filter(x => x[2].length > 1 && x[1].id !== 'ICON' && !used[x[0] + '=' + x[1].id]).sort((x, y) => y[2].length - x[2].length).slice(0, 3)
    .forEach(([k, c, l]) => add(c.n.replace(/^★\s*/, ''), pl(l.length) + ' · ' + (k === 'cz' ? 'eat & drink' : 'a collection'), k, c.id, l, 0));
  const cl = (G.closed || []).map(x => ord.filter(r => r.id === x.id)[0]).filter(Boolean);
  add('Recently closed', pl(cl.length) + ' · kept for the record, newest check first', 'closed', '1', cl, 0);
  const lead = sig.filter(r => r.t === 1 && !r.closed)[0] || ord.filter(r => r.t === 1 && !r.closed)[0] || ord.filter(r => !r.closed)[0];
  return { rows: out, lead: lead ? slim(lead) : null };
}

module.exports = { rowsOf };
