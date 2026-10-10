'use strict';
/**
 * views.js — the view-agnostic model for the Round-3 view styles (Gallery, Atlas, Guidebook, Insights).
 * design/beta/views/SPEC.md §2, PLAN.md P-01 / P-03; RFC §13.
 *
 * One model, so the four views cannot drift apart:
 *   - rank(recs, areas)  → stamps `rank` (1…n within the area) and `of` (n) on every record, and returns the view
 *     order. Order within an area: open first; then tier ascending; then the number of named sources, descending;
 *     then live order. Closed places come last. View order = area order (data), then rank.
 *   - kind3(rec, popIds) → 'sight' | 'food' | 'pop' (pop = a SIGHT in a guide.popCulture.c collection; a place counts once).
 *   - insights(row, recs) → every number the Insights view draws, with its denominator and what it does not count.
 *
 * Everything is computed from the page's own records at build time; nothing is estimated or invented. A city with
 * no pop-culture data gets `pop: null` (the view says "absent"), never 0.
 */
const { km } = require('./guide');

const pinned = r => r.la != null && r.ln != null && !!r.pv && (r.pv.pin === 'high' || r.pv.pin === 'med');

/** Area ids in data order, then any area a record names that the page's AREAS list lacks (first seen). */
function areaOrder(areas, recs) {
  const ids = (areas || []).map(a => a.id);
  for (const r of recs) if (!ids.includes(r.a)) ids.push(r.a);
  return ids;
}

function rank(recs, areas) {
  const order = areaOrder(areas, recs), by = new Map(order.map(a => [a, []]));
  recs.forEach((r, i) => by.get(r.a).push([r, i]));
  const out = [];
  for (const a of order) {
    const lst = by.get(a);
    lst.sort(([x, i], [y, j]) => (!!x.closed - !!y.closed) || (x.t - y.t) || ((y.src || []).length - (x.src || []).length) || (i - j));
    lst.forEach(([r], k) => { r.rank = k + 1; r.of = lst.length; out.push(r); });
  }
  if (out.length !== recs.length) throw new Error(`rank: ${out.length} ordered != ${recs.length} records`);
  return out;
}

const kind3 = (r, popIds) => r.kind === 'food' ? 'food' : (popIds && r.g.some(g => popIds.has(g)) ? 'pop' : 'sight');

/** Stamp rank/of/k3 on every record (P-01). Returns the view order. */
function stamp(row, recs) {
  const pc = row.guide && row.guide.popCulture, popIds = pc ? new Set(pc.c) : null;
  recs.forEach(r => { r.k3 = kind3(r, popIds); });
  return rank(recs, row.data.AREAS);
}

const median = a => a.slice().sort((x, y) => x - y)[a.length >> 1];     // upper median, as the mockup generator
const count = (xs, f) => { const o = {}; xs.forEach(x => { const k = f(x); o[k] = (o[k] || 0) + 1; }); return o; };

/**
 * P-03 — the Insights block. Every series carries `of` (its denominator) and `note` (what it does not count).
 * Rows are in area order; `a: ''` is the whole-city row. Requires rank() first (it reads the view order).
 */
function insights(row, recs) {
  const st = row.stats, g = row.guide || {}, pc = g.popCulture, hasPop = !!pc;
  const order = areaOrder(row.data.AREAS, recs).filter(a => recs.some(r => r.a === a));
  const inArea = a => recs.filter(r => r.a === a);
  const N = recs.length, k3 = count(recs, r => r.k3);
  const cites = recs.reduce((s, r) => s + (r.src || []).length, 0);
  const open = recs.filter(r => !r.closed), closed = recs.filter(r => r.closed);
  const triad = rs => { const c = count(rs, r => r.k3); return { sight: c.sight || 0, food: c.food || 0, pop: hasPop ? c.pop || 0 : null }; };

  // top-5 publishers by citations; ties keep first-seen order in the records (deterministic)
  const cc = new Map(); recs.forEach(r => (r.src || []).forEach(s => cc.set(s, (cc.get(s) || 0) + 1)));
  const top = [...cc.entries()].sort((x, y) => y[1] - x[1]).slice(0, 5).map(x => x[0]);
  const srcRow = rs => { const o = Object.fromEntries(top.map(s => [s, 0])); o._other = 0; rs.forEach(r => (r.src || []).forEach(s => { o[top.includes(s) ? s : '_other']++; })); return o; };

  const spread = [];
  for (const a of order) {
    const pin = inArea(a).filter(r => pinned(r) && !r.closed);
    if (pin.length < 2) continue;
    const c = { la: median(pin.map(r => r.la)), ln: median(pin.map(r => r.ln)) };
    spread.push({ a, km: Math.round(median(pin.map(r => km(c, r))) * 10) / 10, n: pin.length });
  }
  const spreadN = recs.filter(r => pinned(r) && !r.closed).length;

  const months = count(recs, r => (r.pv && r.pv.checked || '').slice(0, 7) || 'unchecked');
  const canon = g.canon && g.canon.dishes && g.canon.dishes.length ? {
    title: g.canon.title, cz: g.canon.cz, of: g.canon.n, open: g.canon.open,
    named: new Set(g.canon.dishes.flatMap(d => d.ids)).size,
    rows: g.canon.dishes.map(d => ({ t: d.t, n: d.n })),
    note: 'Bars count canon places whose own write-up names the dish; a place naming two dishes counts in both bars. Canon places that name no dish are not counted.',
  } : null;

  return {
    v: 1, N,
    tiles: {
      places: N, areas: order.length, sights: (k3.sight || 0) + (k3.pop || 0), food: k3.food || 0,
      pop: hasPop ? k3.pop || 0 : null, sources: st.sources, citations: cites, closed: closed.length, lastChecked: st.lastChecked || null,
    },
    // 1 · kind triad per area — 100 % stacked; every row sums to its n
    mix: { series: hasPop ? ['sight', 'food', 'pop'] : ['sight', 'food'], of: N,
      rows: [Object.assign({ a: '', n: N }, triad(recs))].concat(order.map(a => Object.assign({ a, n: inArea(a).length }, triad(inArea(a))))),
      note: hasPop ? 'Pop culture = sights in the city’s pop-culture collections; a place counts in one segment only.'
        : 'This city has no pop-culture collection in its data, so the third segment is absent rather than zero-filled.' },
    // 2 · citations per area: the 5 most-cited sources + other; a place named by 3 sources counts 3 times
    sources: { top, of: cites, nSources: cc.size,
      rows: order.map(a => { const rs = inArea(a); return Object.assign({ a, n: rs.reduce((s, r) => s + (r.src || []).length, 0) }, srcRow(rs)); }),
      note: 'Citations, not places: a place named by three sources counts three times. "Added by the guide" marks general-knowledge additions and is never relabelled as sourced.' },
    // 3 · places per area
    perArea: { of: N, rows: order.map(a => ({ a, n: inArea(a).length })), note: 'Every place counted once, in its own area.' },
    // 3b · median straight-line km from each area's middle pin (open, verified pins; areas with ≥ 2 such pins)
    spread: { of: spreadN, rows: spread,
      note: `Computed from ${spreadN} of ${N} places: open, with a verified pin. Straight-line, not walking routes. Areas with fewer than 2 such pins are not drawn.` },
    // 4 · closures per area + status checks by month
    closed: { of: closed.length, rows: order.map(a => ({ a, n: inArea(a).filter(r => r.closed).length })).filter(x => x.n),
      months: Object.entries(months).sort((x, y) => x[0] < y[0] ? -1 : 1).map(([m, n]) => ({ m, n })), monthsOf: N,
      note: 'Closed places stay in every view, flagged, and never carry a tier. "unchecked" = no status check on record yet.' },
    // 5 · the signature canon (null → "stated, not filled")
    canon,
    // 6 · tier ladder per area: open places only
    tiers: { of: open.length,
      rows: order.map(a => { const rs = inArea(a).filter(r => !r.closed); return { a, n: rs.length, 1: rs.filter(r => r.t === 1).length, 2: rs.filter(r => r.t === 2).length, 3: rs.filter(r => r.t === 3).length }; }),
      note: `${closed.length} closed places carry no tier and are counted in the closures chart instead.` },
  };
}

module.exports = { rank, kind3, stamp, insights, areaOrder, pinned };

/** Add data-rank (and data-k3="pop" where the triad differs from data-k) to every rendered `li.pl` start tag. Every record must be marked exactly once. */
function markCards(html, recs) {
  const by = new Map(recs.map(r => [r.id, r])); let n = 0;
  const out = html.replace(/<li class="pl[ "][^>]*?\bid="p-([^"]+)"/g, (m, id) => {
    const r = by.get(id.replace(/&amp;/g, '&')); if (!r) return m;
    n++; return `${m} data-rank="${r.rank}"${r.k3 === 'pop' ? ' data-k3="pop"' : ''}`;   // sight/food follow data-k (page weight)
  });
  if (n !== recs.length) throw new Error(`markCards: marked ${n} cards, ${recs.length} records`);
  return out;
}
module.exports.markCards = markCards;
