'use strict';
/**
 * render/hub.js — country hubs (beta/<Country>/index.html) and the city tile both the hub and the landing use
 * (lane FE-B, M1-17). Every number on a tile is computed from the live page's records; the signature line is the
 * city's ★ collection (with its count) or, failing that, its three largest cuisines — never a typed blurb.
 * Tile art is a star-field of the city's own open, pinned places (map art, IMAGERY.md B) — no photos.
 */
const { esc } = require('../html');
const { head, siteBar, footer, styles } = require('./common');
const { site, icon } = require('./shell');
const { fmt, sumStats } = require('../stats');

// ---------------------------------------------------------------- per-city facts (all derived from data)
const SKINS = ['vermilion', 'lake', 'moss', 'neon', 'lagoon', 'glacier', 'saffron', 'plum'];
const NAMED = { tokyo: 'tokyo', cleveland: 'cleveland', kyoto: 'kyoto', osaka: 'osaka', okinawa: 'okinawa', hokkaido: 'hokkaido' };
const ASSIGNED = { newyork: 'saffron', chicago: 'plum' };           // DESIGN-SYSTEM.md §3.3
/** Skin attribute for a page: [data-city] for the six named skins, a .skin-* class otherwise (rotating). */
function skin(row, i) {
  if (NAMED[row.key]) return { attr: ` data-city="${NAMED[row.key]}"`, cls: '' };
  if (ASSIGNED[row.key]) return { attr: '', cls: ' skin-' + ASSIGNED[row.key] };
  if (row.country === 'singapore' || row.country === 'vietnam') return { attr: '', cls: ' skin-lagoon' };   // regional skin
  return { attr: '', cls: ' skin-' + SKINS[i % SKINS.length] };
}

/** Native-script name, only where the live page prints one: "Field guide · Tokyo (東京), sourced" → 東京. */
function nativeName(meta) {
  const m = /\(([^)]*[^\x00-ɏ -⁯][^)]*)\)/.exec(meta.eyebrow || '');
  return m ? m[1].trim() : '';
}

function facts(row) {
  const recs = row.recs || [];
  const d = row.data;
  const n = recs.length;
  const star = (d.CATS || []).filter(c => /★/.test(c.n)).map(c => ({ name: c.n.replace(/★\s*/, ''), n: recs.filter(x => (x.g || []).includes(c.id)).length }))
    .filter(c => c.n > 0)[0] || null;
  const cz = {};
  recs.forEach(x => (x.cz || []).forEach(z => { cz[z] = (cz[z] || 0) + 1; }));
  const czName = Object.fromEntries((d.CUISINES || []).map(c => [c.id, c.n]));
  const canon = Object.entries(cz).filter(([k]) => czName[k]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 3).map(([k]) => czName[k]);
  const st = row.stats || null;                                       // platform stats (lib/stats.js) when present
  const checked = st ? st.lastChecked || '' : recs.map(x => x.pv && x.pv.checked).filter(Boolean).sort().pop() || '';
  const areas = (d.AREAS || []).filter(a => recs.some(x => x.a === a.id)).length;
  return { n: st ? st.total : n, P: st ? st.sights : row.counts.P, F: st ? st.food : row.counts.F, star, canon, checked, areas,
    native: row.nat || nativeName(d.meta), name: row.name || d.meta.h1Main || row.key,
    closed: recs.filter(x => x.closed).length };
}

// ---------------------------------------------------------------- tile art: the city's own pins as stars
const q = (a, p) => a[Math.min(a.length - 1, Math.max(0, Math.floor(p * (a.length - 1))))];
function starfield(recs, W = 320, H = 120, cap = 44) {
  const pts = recs.filter(x => x.la != null && x.ln != null && !x.closed);
  if (pts.length < 2) return '';
  const las = pts.map(p => p.la).sort((a, b) => a - b), lns = pts.map(p => p.ln).sort((a, b) => a - b);
  // Trim day-trip outliers so the city itself fills the frame (art, not a map: the full set is on the city page).
  const box = [q(las, .06), q(las, .94), q(lns, .06), q(lns, .94)];
  const k = Math.cos(((box[0] + box[1]) / 2) * Math.PI / 180);
  const w = Math.max((box[3] - box[2]) * k, 1e-4), h = Math.max(box[1] - box[0], 1e-4);
  const s = Math.min((W - 40) / w, (H - 24) / h);
  const ox = (W - w * s) / 2, oy = (H - h * s) / 2;
  const inside = pts.filter(p => p.la >= box[0] && p.la <= box[1] && p.ln >= box[2] && p.ln <= box[3]);
  const pick = inside.slice().sort((a, b) => a.t - b.t).slice(0, cap);
  const seen = new Set();
  const dot = p => {
    const x = Math.round(ox + (p.ln - box[2]) * k * s), y = Math.round(oy + (box[1] - p.la) * s);
    const key = x + ',' + y; if (seen.has(key)) return ''; seen.add(key);
    return `M${x} ${y}h0`;
  };
  const t1 = pick.filter(p => p.t === 1).map(dot).join(''), rest = pick.filter(p => p.t !== 1).map(dot).join('');
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">` +
    (rest ? `<path class="dots" stroke-width="2.2" stroke-opacity=".7" d="${rest}"/>` : '') +
    (t1 ? `<path class="dots t1" stroke-width="3.6" d="${t1}"/>` : '') + '</svg>';
}

/**
 * One city tile. Markup contract kept for test-beta.js: li.dest[data-page] > a[href] first, and
 * ".dest-c" starting with the computed place count.
 * @param art  include the star-field (the landing keeps its weight budget by drawing it on headline cities only)
 */
function cityTile(row, i, { up = '', art = true, lg = false } = {}) {
  const f = facts(row), sk = skin(row, i);
  const sig = f.star
    ? `<span class="star">${icon('star4', 'ico sm')}${esc(f.star.name)} · ${f.star.n}</span>`
    : f.canon.length ? `<span class="canon">${f.canon.map(c => `<span>${esc(c)}</span>`).join('')}</span>` : '';
  return `<li class="dest" data-page="${esc(row.key)}" data-gen="${row.gen}"><a href="${up}${esc(row.beta)}" class="tile${lg ? ' lg' : ''}${sk.cls}"${sk.attr}>
<span class="art">${art ? starfield(row.recs || []) : ''}${f.native ? `<span class="native">${esc(f.native)}</span>` : ''}<span class="bar"></span></span>
<span class="txt"><h3>${esc(f.name)}</h3>
<span class="counts"><span class="dest-c">${fmt(f.n)} places<span class="hide-m"> · ${fmt(f.P)} sights · ${fmt(f.F)} to eat &amp; drink</span></span></span>
${sig}</span></a></li>`;
}

/** Compact row for pages a country lists beyond its headline cities (thin towns): name + count, no art. */
function moreRow(row, up = '') {
  const f = facts(row);
  return `<li class="dest" data-page="${esc(row.key)}" data-gen="${row.gen}"><a href="${up}${esc(row.beta)}"><span class="dest-n">${esc(f.name)}</span><span class="dest-c">${fmt(f.n)} places</span></a></li>`;
}

/** Split a country's place pages into the hub's headline cities and the rest, in the live hub's order. */
function countryPages(c, reg) {
  if (c.pages && c.pages.all) return { main: c.pages.linked, more: c.pages.more, all: c.pages.all };
  const byLive = Object.fromEntries(reg.rows.map(r => [r.live, r]));
  const cities = reg.rows.filter(r => r.kind === 'city');
  const main = c.cityPages.map(p => byLive[p]).filter(r => r && r.kind === 'city');
  const more = cities.filter(r => r.country === c.key && !main.includes(r));
  return { main, more, all: main.concat(more) };
}

// ---------------------------------------------------------------- country hub page
/** A live country's hub. Returns { html, expect } — guards.assertHubPage checks every expected page is carded once. */
function renderCountry(row, reg, ctx) {
  const c = reg.countries.find(x => x.hub === row.live) || reg.countries.find(x => x.key === row.country);
  if (!c) throw new Error(`${row.live}: no data/countries.json entry has this hub`);
  const { main, more, all } = countryPages(c, reg);
  return { html: render(row, reg, ctx, { c, main, more, all }), expect: all.map(r => r.key) };
}

/** The Southeast Asia archive: every SEA place page, grouped by data/countries.json region, live or not. */
function renderArchive(row, reg, ctx) {
  const sea = reg.rows.filter(r => r.kind === 'city' && /^(Singapore|Vietnam)\//.test(r.live));
  const groups = reg.countries.filter(c => c.kind === 'engine').sort((a, b) => a.order - b.order)
    .map(c => ({ c, pages: sea.filter(r => r.country === c.key) })).filter(g => g.pages.length);
  const rest = sea.filter(r => !groups.some(g => g.pages.includes(r)));
  if (rest.length) groups.push({ c: { key: 'other', name: 'Elsewhere in the region' }, pages: rest });
  const all = groups.flatMap(g => g.pages);
  const c = { key: 'sea', name: 'Southeast Asia', blurb: 'The archived regional index: every Singapore town and every regional preview, including countries not yet live.' };
  return { html: render(row, reg, ctx, { c, main: [], more: [], all, groups }), expect: all.map(r => r.key) };
}

function render(row, reg, ctx, { c, main, more, all, groups }) {
  const depth = row.beta.split('/').length - 1, up = '../'.repeat(depth);
  const S = sumStats(all);                                           // computed (lib/stats.js), never re-typed
  const n = S.total, P = S.sights, F = S.food, checked = S.lastChecked;
  const others = site().countries.filter(x => x.key !== c.key);
  const title = `${c.name} — ${all.length} sourced guides · Cleo`;
  const desc = `${n.toLocaleString('en-US')} places across ${all.length} ${c.name} guides — each recommended by named sources, pinned and status-checked.`;
  return `${head({ page: 'hub', title, description: desc, rel: row.beta, depth, assetsV: ctx.assetsV, css: styles(depth), from: `data/countries.json + every ${c.name} place page` })}
<body class="has-tabbar">
${siteBar({ depth, current: 'hub', rel: row.beta })}
<main id="main" class="feb">
<section class="masthead" aria-labelledby="cn"><div class="inner">
  <h1 class="title d1" id="cn">${esc(c.name)}</h1>
  <p class="facts"><b>${all.length} ${all.length === 1 ? 'guide' : 'guides'} · ${fmt(n)} places</b> · ${fmt(P)} sights · ${fmt(F)} to eat &amp; drink${checked ? ` · status last checked ${esc(checked)}` : ''}. <a href="${up}how-we-choose.html">How we choose</a></p>
  ${c.blurb ? `<p class="facts">${esc(c.blurb)}</p>` : ''}
</div><span class="accentbar"></span></section>
<div class="wrap section" id="destinations">
${groups ? groups.map(g => `<section class="csec" id="${esc(g.c.key)}" aria-labelledby="g-${esc(g.c.key)}"><div class="rail-head"><h2 class="d2" id="g-${esc(g.c.key)}">${esc(g.c.name)}<span class="n">${g.pages.length} ${g.pages.length === 1 ? 'guide' : 'guides'}${g.c.live === false ? ' · preview' : ''}</span></h2></div>
<ul class="morelist">\n${g.pages.map(r => moreRow(r, up)).join('\n')}\n</ul></section>`).join('\n') : `  <ul class="tiles hub2" aria-label="${esc(c.name)} guides">
${main.map((r, i) => cityTile(r, i, { up })).join('\n')}
  </ul>`}
${more.length ? `<h2 class="d3" style="margin-top:28px">More in ${esc(c.name)}</h2>\n<ul class="morelist">\n${more.map(r => moreRow(r, up)).join('\n')}\n</ul>` : ''}
</div>
<section class="wrap section" aria-labelledby="else-h"><h2 class="d2" id="else-h">Elsewhere in Cleo</h2>
<div class="countries" style="margin-top:12px">${others.map(o => `<a class="pill" href="${up}${esc(o.href)}">${esc(o.name)} <span class="n">${o.places.toLocaleString('en-US')}</span></a>`).join('')}</div></section>
</main>
${footer({ depth, tabbar: true, current: 'hub' })}
</body>
</html>
`;
}

module.exports = { renderCountry, renderArchive, cityTile, moreRow, facts, skin, starfield, countryPages, nativeName };
