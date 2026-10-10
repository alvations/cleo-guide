'use strict';
/**
 * render/hub.js — country hubs (beta/<Country>/index.html), the SEA archive, and the city tile + editorial rail the
 * hub and the landing share (lane FE-B, M1-17; Wave 2 ROUND-1 gaps #1/#3).
 *
 * Everything a tile or hero says is computed from the live page's records:
 *  - counts (lib/stats.js);
 *  - the signature line = the city's most-recommended open must-sees (two sights, one place to eat), by number of
 *    distinct named publishers — real landmarks and dishes-on-a-plate, never a category label. When platform exposes
 *    a build-time `row.signature` (ROUND-1 gap #10: the city's food canon), that wins;
 *  - the ★ collection line (Japan: anime) with its count;
 *  - editorial themes (THEMES): cross-city collections keyed on collection / cuisine IDS only (Wenwen rule), the
 *    label check only guards against an id meaning something else on another page.
 * Art = map art from the city's own open, pinned places (IMAGERY.md B), in one of four compositions so no two
 * neighbouring tiles look alike; an original motif from the imagery lane (beta/assets/img/motifs/<key>.svg) is layered
 * in as an <img class="motif"> (never a url() in --motif: browsers disagree on its base URL) when the file exists and silently skipped when it doesn't. No photos.
 */
const fs = require('fs');
const path = require('path');
const { esc } = require('../html');
const { head, siteBar, footer, styles, BETA_BASE } = require('./common');
const { site, icon } = require('./shell');
const { fmt, sumStats } = require('../stats');

const BETA = path.resolve(__dirname, '..', '..', '..', '..', 'beta');
const plural = (n, one, many = one + 's') => `${fmt(n)} ${n === 1 ? one : many}`;

// ---------------------------------------------------------------- skins
const SKINS = ['vermilion', 'lake', 'moss', 'neon', 'lagoon', 'glacier', 'saffron', 'plum'];
const NAMED = { tokyo: 'tokyo', cleveland: 'cleveland', kyoto: 'kyoto', osaka: 'osaka', okinawa: 'okinawa', hokkaido: 'hokkaido' };
const ASSIGNED = { newyork: 'saffron', chicago: 'plum' };           // DESIGN-SYSTEM.md §3.3
/** Skin attribute for a page: [data-city] for the six named skins, a .skin-* class otherwise (rotating). */
function skin(row, i) {
  if (NAMED[row.key]) return { attr: ` data-city="${NAMED[row.key]}"`, cls: '' };
  if (ASSIGNED[row.key]) return { attr: '', cls: ' skin-' + ASSIGNED[row.key] };
  if (row.country === 'singapore' || row.country === 'vietnam') return { attr: '', cls: ' skin-' + ['lagoon', 'glacier', 'moss', 'plum'][i % 4] };
  return { attr: '', cls: ' skin-' + SKINS[i % SKINS.length] };
}

/** Native-script name, only where the live page prints one: "Field guide · Tokyo (東京), sourced" → 東京. */
function nativeName(meta) {
  const m = /\(([^)]*[^\x00-ɏ -⁯][^)]*)\)/.exec(meta.eyebrow || '');
  return m ? m[1].trim() : '';
}

// ---------------------------------------------------------------- imagery hooks (imagery lane's files; optional)
const motifFile = (key, tone) => `assets/img/motifs/${String(key).replace(/\//g, '--')}${tone === 'ink' ? '.ink' : ''}.svg`;
/** beta-relative path of the imagery lane's motif for a page/country key, or null (graceful fallback).
 *  tone 'ink' = the paper-ground drawing (light compositions); default = the night-ground drawing. */
function motif(key, tone) {
  const rel = motifFile(key, tone);
  return fs.existsSync(path.join(BETA, rel)) ? rel : null;
}

// ---------------------------------------------------------------- signature: the places a city is known for
/** "Imperial Palace East Gardens (皇居東御苑)" → "Imperial Palace East Gardens"; "Chess Collection — Cleveland …" → "Chess Collection". */
function shortName(n) {
  let s = String(n).replace(/\s*\([^)]*\)\s*/g, ' ').split(/\s+[—–]\s+/)[0].trim();
  if (s.length > 30 && s.includes(',')) s = s.split(',')[0].trim();
  if (s.length > 30 && / & /.test(s)) s = s.split(' & ')[0].trim();
  return s;
}
const rank = (a, b) => (b.src || []).length - (a.src || []).length || (b.s || []).length - (a.s || []).length;
/** Up to three of the city's most-recommended open must-sees: 2 sights + 1 place to eat (record order breaks ties). */
function signature(row) {
  // Platform's build-time tile line (lib/guide.js, gap #10): the city's food canon + its landmark, e.g.
  // "Polish Boy · corned beef · Haserot Angel". Topped up from the records below when it is shorter than three.
  const head = row.guide && row.guide.tileLine ? row.guide.tileLine.parts.map(t => ({ name: shortName(t), from: 'canon' })) : [];
  const recs = (row.recs || []).filter(x => !x.closed);
  const best = kind => {
    for (const t of [1, 2]) { const a = recs.filter(x => x.kind === kind && x.t === t); if (a.length) return a.slice().sort(rank); }
    return [];
  };
  const S = best('sight'), F = best('food');
  const out = S.slice(0, F.length ? 2 : 3).concat(F.slice(0, 1));
  for (const x of S.slice(2).concat(F.slice(1))) { if (out.length >= 3) break; if (!out.includes(x)) out.push(x); }
  const seen = new Set();
  return head.concat(out.map(x => ({ name: shortName(x.n), id: x.id, kind: x.kind })))
    .filter(x => x.name && !seen.has(x.name.toLowerCase()) && seen.add(x.name.toLowerCase())).slice(0, 3);
}

function facts(row) {
  const recs = row.recs || [];
  const d = row.data;
  const gs = row.guide && row.guide.signature;
  const star = gs && gs.kind === 'collection' && gs.n ? { id: (gs.c || [])[0], name: gs.title, n: gs.n } : gs ? null : (d.CATS || []).filter(c => /★/.test(c.n)).map(c => ({ id: c.id, name: c.n.replace(/★\s*/, ''), n: recs.filter(x => (x.g || []).includes(c.id)).length }))
    .filter(c => c.n > 0)[0] || null;
  const cz = {};
  recs.forEach(x => (x.cz || []).forEach(z => { cz[z] = (cz[z] || 0) + 1; }));
  const czName = Object.fromEntries((d.CUISINES || []).map(c => [c.id, c.n]));
  const canon = Object.entries(cz).filter(([k]) => czName[k]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 3).map(([k]) => czName[k]);
  const st = row.stats || null;                                       // platform stats (lib/stats.js) when present
  const checked = st ? st.lastChecked || '' : recs.map(x => x.pv && x.pv.checked).filter(Boolean).sort().pop() || '';
  const areas = (d.AREAS || []).filter(a => recs.some(x => x.a === a.id)).length;
  return { n: st ? st.total : recs.length, P: st ? st.sights : row.counts.P, F: st ? st.food : row.counts.F, star, canon, checked, areas,
    sig: signature(row), native: row.nat || nativeName(d.meta), name: row.name || d.meta.h1Main || row.key,
    closed: recs.filter(x => x.closed).length };
}

// ---------------------------------------------------------------- map art from verified pins
const q = (a, p) => a[Math.min(a.length - 1, Math.max(0, Math.floor(p * (a.length - 1))))];
/**
 * Dots for a set of records, coloured per area where `colors` is given. Trims day-trip outliers (trim) so the place
 * itself fills the frame — art, not a map: the full set is on the page. Returns '' with fewer than 2 pins.
 */
function starfield(recs, { W = 320, H = 120, cap = 44, trim = 0.06, colors = null, pad = 20, stroke = 2.2 } = {}) {
  const pts = recs.filter(x => x.la != null && x.ln != null && !x.closed && (!x.pv || x.pv.pin !== 'low'));
  if (pts.length < 2) return '';
  const las = pts.map(p => p.la).sort((a, b) => a - b), lns = pts.map(p => p.ln).sort((a, b) => a - b);
  const box = [q(las, trim), q(las, 1 - trim), q(lns, trim), q(lns, 1 - trim)];
  const k = Math.cos(((box[0] + box[1]) / 2) * Math.PI / 180);
  const w = Math.max((box[3] - box[2]) * k, 1e-4), h = Math.max(box[1] - box[0], 1e-4);
  const s = Math.min((W - 2 * pad) / w, (H - 2 * pad * 0.6) / h);
  const ox = (W - w * s) / 2, oy = (H - h * s) / 2;
  const inside = pts.filter(p => p.la >= box[0] && p.la <= box[1] && p.ln >= box[2] && p.ln <= box[3]);
  const pick = inside.slice().sort((a, b) => a.t - b.t).slice(0, cap);
  const seen = new Set(), groups = {};
  for (const p of pick) {
    const x = Math.round(ox + (p.ln - box[2]) * k * s), y = Math.round(oy + (box[1] - p.la) * s);
    const key = x + ',' + y; if (seen.has(key)) continue; seen.add(key);
    const g = (p.t === 1 ? 't1' : 'r') + '|' + (colors && colors[p.a] ? colors[p.a] : '');
    (groups[g] = groups[g] || []).push(`M${x} ${y}h0`);
  }
  const paths = Object.keys(groups).sort().map(g => {
    const [t, c] = g.split('|');
    return `<path class="dots${t === 't1' ? ' t1' : ''}"${c ? ` style="--dot:${esc(c)}"` : ''} stroke-width="${t === 't1' ? +(stroke * 1.6).toFixed(1) : stroke}"${t === 't1' ? '' : ' stroke-opacity=".75"'} d="${groups[g].join('')}"/>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${paths}</svg>`;
}

// ---------------------------------------------------------------- city tile
/** Four compositions, rotated through a list so no two neighbouring tiles share one (gap #3, "no two navy tiles alike"). */
const COMPS = ['night', 'wash', 'city', 'paper'];

/**
 * One city tile. Markup contract kept for test-beta.js / guards: li.dest[data-page] > a[href] first, and ".dest-c"
 * starting with the computed place count.
 */
function cityTile(row, i, { up = '', art = true, lg = false, cap = 44, views = false } = {}) {
  const f = facts(row), sk = skin(row, i), comp = COMPS[i % COMPS.length];
  const mf = motif(row.key);   // night drawing: cleo.css (designer W2) paints every tile composition on a dark ground; use motif(key, 'ink') on a light one
  const sig = f.sig.length ? `<span class="sigline">${f.sig.map(x => `<span>${esc(x.name)}</span>`).join('')}</span>` : '';
  const star = f.star ? `<span class="star">${icon('star4', 'ico sm')}${esc(f.star.name)} · ${fmt(f.star.n)}</span>` : '';
  const canon = !sig && f.canon.length ? `<span class="canon">${f.canon.map(c => `<span>${esc(c)}</span>`).join('')}</span>` : '';
  const ini = esc((f.name.match(/[A-Za-zÀ-ɏ]/) || ['·'])[0]);
  return `<li class="dest" data-page="${esc(row.key)}" data-gen="${row.gen}"><a href="${up}${esc(row.beta)}" class="tile c-${comp}${lg ? ' lg' : ''}${sk.cls}"${sk.attr}>
<span class="art">${mf ? `<img class="motif" src="${up}${mf}" alt="">` : ''}${art ? starfield(row.recs || [], { cap, colors: comp === 'night' ? null : row.colors }) : ''}${f.native ? `<span class="native">${esc(f.native)}</span>` : `<span class="ini" aria-hidden="true">${ini}</span>`}<span class="bar"></span></span>
<span class="txt"><h3>${esc(f.name)}</h3>
<span class="counts"><span class="dest-c">${plural(f.n, 'place')}<span class="hide-m"> · ${fmt(f.P)} sights · ${fmt(f.F)} to eat &amp; drink</span></span></span>
${sig}${star}${canon}</span></a>${views && row.gen === 'new' ? viewLinks(row, up) : ''}</li>`;
}

/** W3 B-04: open the city in a named view. Real anchors (#view= is a route the city page's switcher reads). */
const VIEW_LINKS = [['guidebook', 'Read as a guidebook'], ['insights', 'See it in numbers']];
function viewLinks(row, up = '') {
  return `<p class="dest-views">${VIEW_LINKS.map(([v, t]) => `<a href="${up}${esc(row.beta)}#view=${v}" data-view-link="${v}">${t}<span class="vh"> — ${esc(facts(row).name)}</span></a>`).join('')}</p>`;
}

/** Compact row for pages a country lists beyond its headline cities (thin towns): name + count, no art. */
function moreRow(row, up = '') {
  const f = facts(row);
  return `<li class="dest" data-page="${esc(row.key)}" data-gen="${row.gen}"><a href="${up}${esc(row.beta)}"><span class="dest-n">${esc(f.name)}</span><span class="dest-c">${plural(f.n, 'place')}</span></a></li>`;
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

// ---------------------------------------------------------------- editorial themes (cross-city collections)
/**
 * Cross-city collections. `by` = 'g' (collection ids) or 'cz' (cuisine ids); `label` guards the id's meaning on each
 * page (a page whose collection with that id is named otherwise is not counted). Titles and lines are the guide's
 * editorial voice; every count, city and link is computed. A theme with < 5 open places is not shown.
 */
const THEMES = [
  { key: 'anime', by: 'g', id: 'ANIME', label: /anime/i, title: 'Anime pilgrimage', line: 'Real streets and shrines from the manga and screen canon', glyph: 'star4' },
  { key: 'hawker', by: 'cz', id: 'HAWKER', label: /hawker/i, title: 'The hawker canon', line: 'Stalls the city argues about, town by town', glyph: 'seal' },
  { key: 'temples', by: 'g', id: 'TEMPLE', label: /temple|shrine/i, title: 'Temples & shrines', line: 'From Kyoto’s great halls to neighbourhood shrines', glyph: 'compass' },
  { key: 'ramen', by: 'cz', id: 'RAMEN', label: /ramen/i, title: 'Ramen counters', line: 'Bowls named by the people who queue for them', glyph: 'seal' },
  { key: 'fine', by: 'cz', id: 'FINE', label: /michelin|fine/i, title: 'Michelin & fine dining', line: 'Starred and bib-gourmand tables, each with its source', glyph: 'star4' },
  { key: 'unesco', by: 'g', id: 'UNESCO', label: /unesco/i, title: 'World Heritage', line: 'UNESCO-listed sites, pinned to the door', glyph: 'pin' },
  { key: 'onsen', by: 'g', id: 'ONSEN', label: /onsen|sent/i, title: 'Onsen & sentō', line: 'Hot springs and neighbourhood bathhouses', glyph: 'compass' },
  { key: 'beer', by: 'cz', id: 'BEER', label: /beer|brauhaus|k[öo]lsch/i, title: 'Beer halls & brewers', line: 'Trappist taps, Kölsch and the brown cafés that pour them', glyph: 'seal' },
  { key: 'flw', by: 'g', id: 'FLW', label: /frank lloyd wright/i, title: 'Frank Lloyd Wright', line: 'Prairie School houses and the buildings that made him', glyph: 'pin' },
  { key: 'free', by: 'g', id: 'FREE', label: /free/i, title: 'Free to visit', line: 'Museums, parks and landmarks that cost nothing', glyph: 'pin' },
];

/** Computed theme rows: [{ ...theme, n, cities:[{row, n, href}], countries:Set }], largest city first. */
function themes(reg, { country = null, min = 5 } = {}) {
  const live = new Set(reg.countries.filter(c => c.live).map(c => c.key));
  const rows = reg.rows.filter(r => r.kind === 'city' && live.has(r.country) && (!country || r.country === country));
  return THEMES.map(t => {
    const cities = [];
    for (const r of rows) {
      const list = t.by === 'g' ? r.data.CATS || [] : r.data.CUISINES || [];
      const def = list.find(c => c.id === t.id);
      if (!def || !t.label.test(def.n)) continue;
      const n = (r.recs || []).filter(x => !x.closed && (x[t.by] || []).includes(t.id)).length;
      if (n) cities.push({ row: r, n, href: `${r.beta}#${t.by === 'g' ? 'c' : 'cz'}=${encodeURIComponent(t.id)}` });
    }
    cities.sort((a, b) => b.n - a.n || (a.row.name < b.row.name ? -1 : 1));
    const n = cities.reduce((s, c) => s + c.n, 0);
    return Object.assign({}, t, { n, cities, countries: [...new Set(cities.map(c => c.row.country))] });
  }).filter(t => t.n >= min);
}

/** Where a theme is: "across Japan", "in Singapore", "across 4 countries". */
function whereLine(t, reg) {
  const names = t.countries.map(k => (reg.countries.find(c => c.key === k) || {}).name || k);
  if (names.length === 1) return t.cities.length > 1 ? `across ${names[0]}` : `in ${t.cities[0].row.name}`;
  return `across ${names.length} countries`;
}

/** The editorial rail (landing + hubs). Tiles are figures with real links; chips link straight to each city's view. */
function themeRail(reg, { up = '', country = null, heading = 'Collections across the guides', id = 'themes', sub = '' } = {}) {
  const ts = themes(reg, { country });
  if (!ts.length) return '';
  const tile = (t, i) => {
    const top = t.cities.slice(0, 4), rest = t.cities.length - top.length;
    const mf = motif('collections/' + t.key);
    return `<li class="theme t-${i % 4}">
<a class="theme-main" href="${up}${esc(t.cities[0].href)}">${mf ? `<img class="motif" src="${up}${mf}" alt="">` : ''}<span class="theme-n">${fmt(t.n)}</span><span class="theme-t">${esc(t.title)}</span><span class="theme-w">${esc(t.line)} · ${esc(whereLine(t, reg))}</span></a>
<span class="theme-c">${top.map(c => `<a href="${up}${esc(c.href)}">${esc(c.row.name)} <b>${fmt(c.n)}</b></a>`).join('')}${rest > 0 ? `<span class="more-n">+${rest} more ${rest === 1 ? 'guide' : 'guides'}</span>` : ''}</span></li>`;
  };
  return `<section class="themes section" id="${esc(id)}" aria-labelledby="${esc(id)}-h">
<div class="rail-head"><h2 class="d2" id="${esc(id)}-h">${esc(heading)}<span class="n">${ts.length} collections · counts from the guides</span></h2></div>
${sub ? `<p class="blurb">${esc(sub)}</p>` : ''}
<ul class="theme-rail" aria-label="${esc(heading)}">
${ts.map(tile).join('\n')}
</ul></section>`;
}

// ---------------------------------------------------------------- inline glue CSS (designer to upstream into cleo.css)
/** FE-B Wave 2 rules for tile compositions, the country hero and the editorial rail. Tokens only; AA in both themes. */
const FEB_CSS = `
.tile .art .dots{stroke:var(--dot,var(--on-night))}
.tile.c-night .art .dots{stroke:var(--on-night)}.tile.c-night .art .dots.t1{stroke:var(--gilt-soft)}
.tile.c-wash .art{background:var(--motif,none),linear-gradient(160deg,var(--city-wash),var(--surface));color:var(--ink)}
.tile.c-wash .art .native,.tile.c-wash .art .ini{color:var(--city-ink)}
.tile.c-wash .art .dots,.tile.c-paper .art .dots{stroke:var(--dot,var(--city-ink))}.tile.c-wash .art .dots.t1,.tile.c-paper .art .dots.t1{stroke:var(--ink)}
.tile.c-city .art{background:var(--motif,none),radial-gradient(120% 140% at 0 100%,color-mix(in srgb,var(--night) 35%,transparent),transparent 60%),var(--city);color:var(--city-on)}
.tile.c-city .art .dots{stroke:var(--city-on);stroke-opacity:.9}.tile.c-city .art .dots.t1{stroke:var(--city-on)}
.tile.c-city .art .native,.tile.c-city .art .ini{color:var(--city-on)}.tile.c-city .art .bar{background:var(--night)}
.tile.c-paper .art{background:var(--motif,none),repeating-radial-gradient(circle at 70% 120%,transparent 0 13px,color-mix(in srgb,var(--city) 16%,transparent) 13px 14px),var(--sand);color:var(--ink)}
.tile.c-paper .art .native,.tile.c-paper .art .ini{color:var(--ink)}
.tile .art .ini{position:absolute;right:14px;bottom:6px;font:italic 500 84px/1 var(--font-display);opacity:.9;color:var(--on-night)}
.tile .art .native{color:var(--on-night)}
.tiles.hub2 .tile .art .ini{font-size:52px;bottom:4px}
.tile .sigline{font-size:13.5px;line-height:1.35;color:var(--ink-2);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.tile .sigline span+span::before{content:" · ";color:var(--ink-3)}
.tile .star{font-size:12.5px}
.tile:hover .art svg,.tile:focus-visible .art svg{transform:scale(1.04)}.tile .art svg{transition:transform .5s var(--ease,ease)}
@media (prefers-reduced-motion:reduce){.tile .art svg{transition:none}.tile:hover .art svg{transform:none}}
.chero{position:relative;background:var(--night);color:var(--on-night);overflow:hidden;isolation:isolate}
.chero .sky{position:absolute;inset:0;z-index:-1;background:var(--motif,none)}
.chero .sky svg{position:absolute;inset:0;width:100%;height:100%}
.chero .sky .dots{stroke:var(--on-night);stroke-linecap:round;fill:none;stroke-opacity:.9}.chero .sky .dots.t1{stroke:var(--gilt-soft)}
.chero::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,var(--night) 0,color-mix(in srgb,var(--night) 70%,transparent) 55%,transparent)}
.chero .inner{max-width:var(--maxw);margin:0 auto;padding:28px var(--gutter) 26px}
.chero .kicker{color:var(--on-night-2);font-size:15px;margin:0 0 6px}
.chero h1{margin:0;color:var(--on-night)}
.chero .why{font:italic 500 21px/1.3 var(--font-display);color:var(--on-night);margin:10px 0 0;max-width:40ch}
.chero .why .l span+span::before{content:" · ";font-style:normal;color:var(--on-night-2)}
.chero .facts{color:var(--on-night-2);font-size:15px;margin:12px 0 0;max-width:60ch}
.chero .facts b{color:var(--on-night);font-weight:650}.chero .facts a{color:var(--on-night)}
.chero .acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.chero .btn{min-height:var(--tap)}
.chero .btn-ghost{color:var(--on-night);border-color:color-mix(in srgb,var(--on-night) 45%,transparent);background:transparent}
.chero .accentbar{position:absolute;left:0;right:0;bottom:0;height:4px;background:var(--city,var(--gilt-soft))}
@media(max-width:639px){.chero .blurb-c{display:none}.chero .sky{opacity:.45}.chero .why{font-size:19px}.chero .inner{padding:20px var(--gutter) 22px}.chero h1{font-size:44px}}
@media(min-width:900px){.chero .inner{padding:44px var(--gutter) 40px}.chero .why{font-size:26px}}
.share-note{font-size:14px;color:var(--on-night-2);align-self:center}
.themes .theme-rail{list-style:none;margin:12px 0 0;padding:2px 2px 10px;display:grid;grid-auto-flow:column;grid-auto-columns:min(74%,290px);gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;overscroll-behavior-x:contain}
@media(min-width:1100px){.themes .theme-rail{grid-auto-columns:calc((100% - 36px)/4)}}
.themes .rail-head .n{display:block;margin-top:4px;font:450 14px/1.3 var(--font-ui);color:var(--ink-3);letter-spacing:0}
@media(min-width:900px){.themes .rail-head .n{display:inline;margin-left:12px}}
.theme-main{min-height:170px}
.theme{scroll-snap-align:start;display:grid;grid-template-rows:1fr auto;border-radius:var(--r-l);overflow:hidden;background:var(--surface);border:1px solid var(--line)}
.theme-main{display:grid;gap:4px;align-content:end;min-height:150px;padding:16px;text-decoration:none;color:var(--on-night);background:var(--motif,none),var(--night)}
.theme.t-1 .theme-main{background:var(--motif,none),linear-gradient(150deg,var(--night-2),var(--night))}
.theme.t-2 .theme-main{background:var(--motif,none),repeating-linear-gradient(135deg,transparent 0 10px,color-mix(in srgb,var(--on-night) 6%,transparent) 10px 11px),var(--night)}
.theme.t-3 .theme-main{background:var(--motif,none),radial-gradient(120% 120% at 100% 0,var(--night-2),var(--night) 70%)}
.theme-n{font:500 44px/1 var(--font-display);color:var(--gilt-soft)}
.theme-t{font:500 23px/1.15 var(--font-display);color:var(--on-night)}
.theme-w{font-size:13.5px;line-height:1.35;color:var(--on-night-2)}
.theme-c{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px 12px}
.theme-c a{display:inline-flex;align-items:center;gap:5px;min-height:var(--tap);padding:0 12px;border:1px solid var(--line-strong);border-radius:var(--r-pill);font-size:13.5px;text-decoration:none;color:var(--ink)}
.theme-c a b{font-weight:650;color:var(--ink-2)}
.theme-c .more-n{font-size:13px;color:var(--ink-3);align-self:center;padding:0 4px}
.theme-main:hover .theme-t{text-decoration:underline;text-underline-offset:4px}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .tile.c-night .art .dots.t1,:root:not([data-theme=light]) .chero .sky .dots.t1{stroke:var(--gilt)}:root:not([data-theme=light]) .theme-n{color:var(--gilt)}:root:not([data-theme=light]) .tile.c-wash .art .dots,:root:not([data-theme=light]) .tile.c-paper .art .dots{stroke:var(--city-ink)}:root:not([data-theme=light]) .tile.c-wash .art .dots.t1,:root:not([data-theme=light]) .tile.c-paper .art .dots.t1{stroke:var(--ink)}}
:root[data-theme=dark] .tile.c-night .art .dots.t1,:root[data-theme=dark] .chero .sky .dots.t1{stroke:var(--gilt)}:root[data-theme=dark] .theme-n{color:var(--gilt)}:root[data-theme=dark] .tile.c-wash .art .dots,:root[data-theme=dark] .tile.c-paper .art .dots{stroke:var(--city-ink)}:root[data-theme=dark] .tile.c-wash .art .dots.t1,:root[data-theme=dark] .tile.c-paper .art .dots.t1{stroke:var(--ink)}
.results .grp.guides ol{display:flex;flex-wrap:wrap;gap:6px;list-style:none;padding:0}
.results a.is-kb,.results a:focus-visible{outline:2px solid var(--focus);outline-offset:2px}
.results mark{background:var(--gilt-soft);color:var(--ink);border-radius:2px}

.motif{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 100%;z-index:-1;pointer-events:none}
.theme-main{position:relative;isolation:isolate}.chero .sky .motif{object-fit:contain;object-position:100% 100%;z-index:0}
/* ROUND-2 gap #4 (FE-B half): landing editorial rail — compact ★ tiles that scroll sideways; designer's .rail-i.sig skin */
.editorial-s .rail-head h2 .n{margin-left:12px;font:500 15px/1.3 var(--font-ui);color:var(--ink-3)}
html .rail.editorial{display:flex;flex-wrap:nowrap;gap:12px;overflow-x:auto;scroll-snap-type:x proximity;padding:4px 2px 14px;margin:0;grid-template-rows:none;height:auto}
html .rail.editorial .rail-i{flex:0 0 min(80vw,300px);align-content:start;height:auto;min-height:0;aspect-ratio:auto;scroll-snap-align:start;text-decoration:none;color:var(--city-on,var(--on-night));display:grid;grid-template-columns:22px 1fr auto;gap:2px 10px;align-items:start;padding:14px 16px;border-radius:16px;font-size:inherit}
html .rail.editorial .rail-i .g{grid-row:1/span 3;margin:2px 0 0}
html .rail.editorial .rail-i .k{grid-column:2;font:600 12px/1.3 var(--font-ui);letter-spacing:.02em;opacity:.9}
html .rail.editorial .rail-i .t{grid-column:2;font:500 21px/1.15 var(--font-display)}
html .rail.editorial .rail-i .d{grid-column:2;font:13px/1.4 var(--font-ui);opacity:.9}
html .rail.editorial .rail-i .n{grid-column:3;grid-row:1/span 2;font:500 26px/1 var(--font-display);color:inherit}
/* W3 B-04: "Read as a guidebook" / "See it in numbers" under each hub tile (44 px targets) */
li.dest>.dest-views{display:flex;flex-wrap:wrap;gap:0 16px;margin:4px 2px 0;font-size:14px}
li.dest>.dest-views a{display:inline-flex;align-items:center;min-height:44px;color:var(--ink-2,inherit);text-underline-offset:3px}
`;

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

/** The country's most-recommended open must-sees across all its guides (the hero's "why go" line). */
function countrySignature(all) {
  const recs = all.flatMap(r => (r.recs || []).filter(x => !x.closed && x.t === 1).map(x => Object.assign({ _city: r.name }, x)));
  const S = recs.filter(x => x.kind === 'sight').sort(rank), F = recs.filter(x => x.kind === 'food').sort(rank);
  const out = [], seen = new Set();
  const cities = new Set();
  for (const x of S.concat(F)) {
    const n = shortName(x.n);
    if (out.length >= 3 || seen.has(n) || cities.has(x._city) || out.filter(o => o.kind === x.kind).length >= (x.kind === 'sight' ? 2 : 1)) continue;
    seen.add(n); cities.add(x._city); out.push({ name: n, kind: x.kind, city: x._city });
  }
  return out;
}

/** og:image for a hub: platform's per-page card when it exists (assets/og/<key>.png), else the shared cover. */
function ogFor(key) {
  for (const f of [`assets/og/${key}.png`, `assets/og/country-${key}.png`]) if (fs.existsSync(path.join(BETA, f))) return `${BETA_BASE}/${f}`;
  return null;
}

function render(row, reg, ctx, { c, main, more, all, groups }) {
  const depth = row.beta.split('/').length - 1, up = '../'.repeat(depth);
  const S = sumStats(all);                                           // computed (lib/stats.js), never re-typed
  const n = S.total, P = S.sights, F = S.food, checked = S.lastChecked;
  const others = site().countries.filter(x => x.key !== c.key);
  const title = `${c.name} — ${all.length} sourced guides · Cleo`;
  const sig = groups ? [] : countrySignature(all);
  const desc = `${n.toLocaleString('en-US')} places across ${all.length} ${c.name} guides${sig.length ? ` — ${sig.map(s => s.name).join(', ')} and more` : ''}. Each recommended by named sources, pinned and status-checked.`;
  const sky = starfield(all.flatMap(r => r.recs || []), { W: 900, H: 360, cap: 900, trim: 0.01, pad: 30, stroke: 3 })
    .replace('preserveAspectRatio="xMidYMid slice"', 'preserveAspectRatio="xMaxYMid meet"');
  const mf = motif(c.key);
  const rail = groups ? '' : themeRail(reg, { up, country: c.key, heading: `Collections in ${c.name}`, id: 'themes' });
  const shareUrl = BETA_BASE + '/' + row.beta.replace(/index\.html$/, '');
  return `${head({ page: 'hub', title, description: desc, rel: row.beta, depth, assetsV: ctx.assetsV, css: styles(depth), ogImage: ogFor(c.key), from: `data/countries.json + every ${c.name} place page` }).replace('</head>', `<style>${FEB_CSS}</style>\n</head>`)}
<body class="has-tabbar">
${siteBar({ depth, current: 'hub', rel: row.beta })}
<main id="main" class="feb">
<section class="chero masthead" aria-labelledby="cn"><div class="sky" aria-hidden="true">${mf ? `<img class="motif" src="${up}${mf}" alt="">` : ''}${sky}</div><div class="inner">
  <p class="kicker">${groups ? 'Archive' : 'Country guide'} · drawn from ${plural(all.reduce((s, r) => s + (r.recs || []).filter(x => x.la != null && !x.closed && (!x.pv || x.pv.pin !== 'low')).length, 0), 'verified pin')}</p>
  <h1 class="title d1" id="cn">${esc(c.name)}</h1>
  ${sig.length ? `<p class="why"><span class="vh">Known for: </span><span class="l">${sig.map(s => `<span>${esc(s.name)}</span>`).join('')}</span></p>` : ''}
  <p class="facts"><b>${plural(all.length, 'guide')} · ${plural(n, 'place')}</b> · ${fmt(P)} sights · ${fmt(F)} to eat &amp; drink${checked ? ` · status last checked ${esc(checked)}` : ''}.</p>
  ${c.blurb ? `<p class="facts blurb-c">${esc(c.blurb)}</p>` : ''}
  <div class="acts"><button type="button" class="btn btn-ghost" data-cleo-share data-title="${esc(title)}" data-url="${esc(shareUrl)}" hidden>${icon('share', 'ico sm')}Share ${esc(c.name)}</button><a class="btn btn-ghost" href="${up}how-we-choose.html">How we choose</a><span class="share-note" data-cleo-share-note aria-live="polite"></span></div>
</div><span class="accentbar"></span></section>
<div class="wrap section" id="destinations">
${groups ? groups.map(g => `<section class="csec" id="${esc(g.c.key)}" aria-labelledby="g-${esc(g.c.key)}"><div class="rail-head"><h2 class="d2" id="g-${esc(g.c.key)}">${esc(g.c.name)}<span class="n">${plural(g.pages.length, 'guide')}${g.c.live === false ? ' · preview' : ''}</span></h2></div>
<ul class="morelist">\n${g.pages.map(r => moreRow(r, up)).join('\n')}\n</ul></section>`).join('\n') : `  <ul class="tiles hub2" aria-label="${esc(c.name)} guides">
${main.map((r, i) => cityTile(r, i, { up, views: true })).join('\n')}
  </ul>`}
${more.length ? `<h2 class="d3" style="margin-top:28px">More in ${esc(c.name)}</h2>\n<ul class="morelist">\n${more.map(r => moreRow(r, up)).join('\n')}\n</ul>` : ''}
</div>
${rail ? `<div class="wrap">${rail}</div>` : ''}
<section class="wrap section" aria-labelledby="else-h"><h2 class="d2" id="else-h">Elsewhere in Cleo</h2>
<div class="countries" style="margin-top:12px">${others.map(o => `<a class="pill" href="${up}${esc(o.href)}">${esc(o.name)} <span class="n">${o.places.toLocaleString('en-US')}</span></a>`).join('')}</div></section>
</main>
${footer({ depth, tabbar: true, current: 'hub' })}
</body>
</html>
`;
}

module.exports = { ogFor, renderCountry, renderArchive, cityTile, moreRow, facts, skin, starfield, countryPages, nativeName,
  signature, shortName, themes, themeRail, THEMES, FEB_CSS, motif };
