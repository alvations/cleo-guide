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
 * W7 (image-first): every city is a borderless card — rounded media slot, then name, counts, "Known for" and
 * "Recommended by". The media is the imagery lane's credited photo when one exists (hero:<key> slot, else the city's
 * best-sourced open must-see), otherwise the design system's calm no-photo cover (design/beta/css/v2.css V2.7): a
 * quiet ground, one small icon and the name set in type (plus the native-script name where the live page prints one).
 * The city's line motif stays referenced in the cover (the imagery gate) but v2 does not draw it. Cover tone classes
 * c-0…c-3 rotate so no two neighbouring covers are marked alike.
 * No night ground, particle art, skins or purple tiles. Motifs and photos below the fold load lazily.
 * Styles: lib/render/fe-b.css (tokens only), published as assets/fe-b.css.
 */
const fs = require('fs');
const path = require('path');
const { esc } = require('../html');
const { head, siteBar, footer, styles, BETA_BASE } = require('./common');
const { site, icon } = require('./shell');
const imagery = require('../../imagery');                          // imagery lane: credited photos (optional helpers)
const { captionHtml } = require('../../imagery/photos');
const { fmt, sumStats } = require('../stats');
const { recommender } = require('../model');                        // R8 gap #2d: public source names
const { t, tn } = require('../i18n');                // W5 gap #7: every hub/tile string comes from the catalogue
const { sentence, ownWords } = require('../casing');  // W8 owner rule: sentence case for data labels
const { CANON, fold } = require('../guide');         // dish synonyms (dedup of the hub "Known for" line)

const BETA = path.resolve(__dirname, '..', '..', '..', '..', 'beta');
/** Counted phrase from the catalogue: plural('hub.places', 3) → "3 places"; the `.one` variant for 1. Escaped. */
const plural = (key, n) => esc(n === 1 ? tn(key, 1) : t(key, { n: fmt(n) }));

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
  // W8 (owner): collection labels are sentence case at display time (lib/casing.js); the page's own place names keep capitals
  const SC = x => sentence(x, ownWords(row.name, row.nat, ...(d.AREAS || []).map(a => a.n)));
  const star = gs && gs.kind === 'collection' && gs.n ? { id: (gs.c || [])[0], name: gs.label || SC(gs.title), n: gs.n } : gs ? null : (d.CATS || []).filter(c => /★/.test(c.n)).map(c => ({ id: c.id, name: SC(c.n.replace(/★\s*/, '')), n: recs.filter(x => (x.g || []).includes(c.id)).length }))
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
    closed: recs.filter(x => x.closed).length, musts: recs.filter(x => !x.closed && x.t === 1).length,
    recby: recommenders(row) };
}

/** Named publishers behind a page, most places first (the guide's own additions are not a source). Computed by lib/sources.js. */
function recommenders(row) {
  // R8 gap #2d: public names only — no research parentheticals, and a place's own site is never "Recommended by"
  const list = ((row.sources && row.sources.list) || []).filter(s => s.id !== 'guide' && s.name).map(s => recommender(s.name)).filter(Boolean);
  return { names: list.slice(0, 2), n: list.length };
}

// ---------------------------------------------------------------- photos (imagery lane, credit-gated)
/** The credited photo for a hub hero or a city card, or null. Vietnam is never photographed (no freedom of panorama). */
function photoOf(key, reg, row, avoid = null) {
  if (row && row.country === 'vietnam') return null;
  if (/^vietnam(\/|$)/.test(String(key))) return null;
  const ok = p => p && !(avoid && p.credit && p.credit.sourceUrl === avoid) ? p : null;   // never repeat the page's hero
  try { if (typeof imagery.heroFor === 'function') { const h = ok(imagery.heroFor(reg || row, key)); if (h) return h; } } catch (e) { /* helper not shipped yet */ }
  const slots = reg && reg.imagery && reg.imagery.slots;
  if (slots && ok(slots['hero:' + key])) return slots['hero:' + key];
  if (!row) return null;
  const ph = (row.imagery && row.imagery.photos) || {};
  const best = (row.recs || []).filter(x => !x.closed && x.kind === 'sight' && x.t === 1 && ok(ph[x.id])).sort(rank)[0];
  return best ? ph[best.id] : null;
}
/** A photo as a media-slot <img>: sized, srcset when the imagery lane wrote widths, lazy unless above the fold. */
function photoImg(ph, up, { sizes, eager = false } = {}) {
  const set = ph.srcset ? ` srcset="${esc(String(ph.srcset).split(',').map(x => up + x.trim()).join(', '))}" sizes="${esc(sizes)}"` : '';
  return `<img class="ph" src="${esc(up + ph.src)}"${set} width="${ph.w}" height="${ph.h}" alt="${esc(ph.credit.depicts)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}
/** The photo's visible TASL credit: one sentence under the card, its links inline (WCAG 2.5.8 inline exception). */
const credit = ph => ph ? `<p class="credit">${captionHtml(ph.credit)}</p>` : '';

// ---------------------------------------------------------------- city card
/** Sizes for the card media: 1/2/3/4 columns (hubs) or 2/3/4 (landing). */
const SIZES = { hub: '(min-width:1280px) 300px, (min-width:1024px) 31vw, (min-width:640px) 46vw, 112px',
  dense: '(min-width:1280px) 300px, (min-width:1024px) 23vw, (min-width:768px) 31vw, (min-width:640px) 42vw, 112px' };
// Budget note (W7): on a 390 px phone the dense grid's card is ~170 px; 42vw keeps a 3× screen on the 500w copy
// (≈ 491 px), where 46vw tipped it to 960w and put the landing over 2 MB. Cards are never eager: on a phone the first
// row sits below the search hero, so only a hub hero photo is fetched eagerly.

/**
 * One city card. Markup contract kept for test-beta.js / guards: li.dest[data-page] > a[href] first, and ".dest-c"
 * starting with the computed place count. The cover tone rotates (c-0…c-3) so neighbouring covers never match.
 */
function cityTile(row, i, { up = '', views = false, reg = null, dense = false, avoid = null } = {}) {
  const f = facts(row);
  const ph = photoOf(row.key, reg, row, avoid);
  const mf = motif(row.key, 'ink');
  const sig = f.sig.length ? `<span class="sigline"><b class="k">${esc(t('card.known'))}</b>${f.sig.map(x => `<span>${esc(x.name)}</span>`).join('')}</span>` : '';
  const star = f.star ? `<span class="star sticker">${icon('star4', 'ico sm')}${esc(f.star.name)} · ${fmt(f.star.n)}</span>` : '';
  const canon = !sig && f.canon.length ? `<span class="canon">${f.canon.map(c => `<span>${esc(c)}</span>`).join('')}</span>` : '';
  // "Recommended by": the most-citing source by name, then "+ n more" — one form on every screen, never clipped
  const rb = f.recby.n ? `<span class="recby"><span>${esc(t('card.recby'))} <b>${esc(f.recby.names[0])}</b>${f.recby.n > 1 ? ` ${esc(t('card.recby.more', { n: fmt(f.recby.n - 1) }))}` : ''}</span></span>` : '';
  return `<li class="dest" data-page="${esc(row.key)}" data-gen="${row.gen}"${fyAttr(row)}><a href="${up}${esc(row.beta)}" class="tile card c-${i % 4}${ph ? '' : ' np'}">
<span class="card-media">${ph ? photoImg(ph, up, { sizes: dense ? SIZES.dense : SIZES.hub })   /* a credited photo fills the slot: no cover markup under it */
  : `<span class="cover" aria-hidden="true">${mf ? `<img class="motif" src="${up}${mf}" alt="" loading="lazy" decoding="async">` : ''}${icon('pin', 'gl ico')}<span class="cover-n">${esc(f.name)}</span>${f.native ? `<span class="native">${esc(f.native)}</span>` : ''}</span>`}${star}</span>
<span class="card-body txt"><h3 class="card-t">${esc(f.name)}</h3>
<span class="counts"><span class="dest-c">${plural('hub.places', f.n)}<span class="hide-m"> · ${esc(t('hub.sights', { n: fmt(f.P) }))} · ${esc(t('hub.food', { n: fmt(f.F) }))}</span></span></span>
${sig}${canon}${rb}</span></a>${credit(ph)}${views && row.gen === 'new' ? viewLinks(row, up) : ''}</li>`;
}

/** W3 B-04: open the city in a named view. Real anchors (#view= is a route the city page's switcher reads). */
const VIEW_LINKS = ['guidebook', 'insights'];
function viewLinks(row, up = '') {
  return `<p class="dest-views">${VIEW_LINKS.map(v => `<a href="${up}${esc(row.beta)}#view=${v}" data-view-link="${v}">${esc(t('hub.view.' + v))}<span class="vh"> — ${esc(facts(row).name)}</span></a>`).join('')}</p>`;
}

/** Compact row for pages a country lists beyond its headline cities (thin towns): name + count, no art. */
// W9-3: open places per interest id ("history:12 food:40"), read by client/interests.js for the "For you" rail
const fyAttr = row => row.fy && row.fy.length ? ` data-fy="${row.fy.map(([id, n]) => id + ':' + n).join(' ')}"` : '';

/** W9-3 "For you": an empty, hidden rail the client fills from the stored interests (reorders guides, never hides one). */
function forYou() {
  const { INTERESTS } = require('./city');
  const labels = Object.fromEntries(INTERESTS.map(([id]) => [id, t('fy.i.' + id)]));
  return `<section class="section foryou-s" id="foryou" data-cleo-fy hidden aria-labelledby="fy-h" data-labels="${esc(JSON.stringify(labels))}" data-because="${esc(t('fy.because'))}">
<div class="rail-head"><h2 class="d2" id="fy-h">${esc(t('fy.h'))}</h2><button type="button" class="more btn-quiet" data-cleo-fy-clear>${esc(t('fy.clear'))}</button></div>
<p class="sm muted fy-note">${esc(t('fy.note'))}</p>
<ol class="morelist fy-list"></ol></section>`;
}

function moreRow(row, up = '') {
  const f = facts(row);
  const sig = f.sig.slice(0, 2).map(x => esc(x.name)).join(' · ');
  return `<li class="dest" data-page="${esc(row.key)}" data-gen="${row.gen}"${fyAttr(row)}><a href="${up}${esc(row.beta)}"><span class="dest-n">${esc(f.name)}</span><span class="dest-c">${plural('hub.places', f.n)}</span>${sig ? `<span class="dest-s">${sig}</span>` : ''}</a></li>`;
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
 * editorial voice, on the catalogue as theme.<key>.t / .l (W5 gap #7); every count, city and link is computed. A theme
 * with < 5 open places is not shown.
 */
const THEMES = [
  { key: 'anime', by: 'g', id: 'ANIME', label: /anime/i, glyph: 'star4' },
  { key: 'hawker', by: 'cz', id: 'HAWKER', label: /hawker/i, glyph: 'seal' },
  { key: 'temples', by: 'g', id: 'TEMPLE', label: /temple|shrine/i, glyph: 'compass' },
  { key: 'ramen', by: 'cz', id: 'RAMEN', label: /ramen/i, glyph: 'seal' },
  { key: 'fine', by: 'cz', id: 'FINE', label: /michelin|fine/i, glyph: 'star4' },
  { key: 'unesco', by: 'g', id: 'UNESCO', label: /unesco/i, glyph: 'pin' },
  { key: 'onsen', by: 'g', id: 'ONSEN', label: /onsen|sent/i, glyph: 'compass' },
  { key: 'beer', by: 'cz', id: 'BEER', label: /beer|brauhaus|k[öo]lsch/i, glyph: 'seal' },
  { key: 'flw', by: 'g', id: 'FLW', label: /frank lloyd wright/i, glyph: 'pin' },
  { key: 'free', by: 'g', id: 'FREE', label: /free/i, glyph: 'pin' },
];

/** Computed theme rows: [{ ...theme, n, cities:[{row, n, href}], countries:Set }], largest city first. */
function themes(reg, { country = null, min = 5 } = {}) {
  const live = new Set(reg.countries.filter(c => c.live).map(c => c.key));
  const rows = reg.rows.filter(r => r.kind === 'city' && live.has(r.country) && (!country || r.country === country));
  return THEMES.map(th => Object.assign({ title: t(`theme.${th.key}.t`), line: t(`theme.${th.key}.l`) }, th)).map(t => {
    const cities = [];
    for (const r of rows) {
      const list = t.by === 'g' ? r.data.CATS || [] : r.data.CUISINES || [];
      const def = list.find(c => c.id === t.id);
      if (!def || !t.label.test(def.n)) continue;
      const n = (r.recs || []).filter(x => (x[t.by] || []).includes(t.id)).length;   // what the lens opens: closed places included, flagged (QA-28)
      if (n) cities.push({ row: r, n, href: `${r.beta}#${t.by === 'g' ? 'c' : 'cz'}=${encodeURIComponent(t.id)}` });
    }
    cities.sort((a, b) => b.n - a.n || (a.row.name < b.row.name ? -1 : 1));
    const n = cities.reduce((s, c) => s + c.n, 0);
    return Object.assign({}, t, { n, cities, countries: [...new Set(cities.map(c => c.row.country))] });
  }).filter(t => t.n >= min);
}

/** Where a theme is: "across Japan", "in Singapore", "across 4 countries". */
function whereLine(th, reg) {
  const names = th.countries.map(k => (reg.countries.find(c => c.key === k) || {}).name || k);
  if (names.length === 1) return th.cities.length > 1 ? t('hub.where.across', { name: names[0] }) : t('hub.where.in', { city: th.cities[0].row.name });
  return t('hub.where.countries', { n: names.length });
}

/** A collection's paper-ground motif (imagery lane: assets/img/motifs/collections/<key>.ink.svg), or null. */
function collMotif(key) {
  const rel = `assets/img/motifs/collections/${key}.ink.svg`;
  return fs.existsSync(path.join(BETA, rel)) ? rel : null;
}

/** The editorial rail (landing + hubs). Tiles are figures with real links; chips link straight to each city's view. */
function themeRail(reg, { up = '', country = null, heading = t('hub.themes.h'), id = 'themes', sub = '' } = {}) {
  const ts = themes(reg, { country });
  if (!ts.length) return '';
  const tile = (th, i) => {
    const top = th.cities.slice(0, 4), rest = th.cities.length - top.length;
    const mf = collMotif(th.key);
    return `<li class="theme t-${i % 4}">
<a class="theme-main" href="${up}${esc(th.cities[0].href)}"><span class="cover" aria-hidden="true">${mf ? `<img class="motif" src="${up}${mf}" alt="" loading="lazy" decoding="async">` : ''}</span><span class="theme-n">${fmt(th.n)}</span><span class="theme-t">${esc(th.title)}</span><span class="theme-w">${esc(th.line)} · ${esc(whereLine(th, reg))}</span></a>
<span class="theme-c">${top.map(c => `<a href="${up}${esc(c.href)}">${esc(c.row.name)} <b>${fmt(c.n)}</b></a>`).join('')}${rest > 0 ? `<span class="more-n">${esc(tn('hub.themes.more', rest))}</span>` : ''}</span></li>`;
  };
  return `<section class="themes section" id="${esc(id)}" aria-labelledby="${esc(id)}-h">
<div class="rail-head"><h2 class="d2" id="${esc(id)}-h">${esc(heading)}<span class="n">${esc(t('hub.themes.n', { n: ts.length }))}</span></h2></div>
${sub ? `<p class="blurb">${esc(sub)}</p>` : ''}
<ul class="theme-rail" aria-label="${esc(heading)}">
${ts.map(tile).join('\n')}
</ul></section>`;
}

// ---------------------------------------------------------------- country hub page
/** A live country's hub. Returns { html, expect } — guards.assertHubPage checks every expected page is carded once. */
function renderCountry(row, reg, ctx) {
  const c = reg.countries.find(x => x.hub === row.live) || reg.countries.find(x => x.key === row.country);
  if (!c) throw new Error(`${row.live}: no data/countries.json entry has this hub`);
  let { main, more, all } = countryPages(c, reg);
  // QA-22 (B-05 ≥ 2 city cards above the fold): a hub with one headline city promotes its next guides to tiles
  if (main.length < 2 && more.length) { const k = Math.min(all.length, 4) - main.length; main = main.concat(more.slice(0, k)); more = more.slice(k); }
  return { html: render(row, reg, ctx, { c, main, more, all }), expect: all.map(r => r.key) };
}

/** The Southeast Asia archive: every SEA place page, grouped by data/countries.json region, live or not. */
function renderArchive(row, reg, ctx) {
  const sea = reg.rows.filter(r => r.kind === 'city' && /^(Singapore|Vietnam)\//.test(r.live));
  const groups = reg.countries.filter(c => c.kind === 'engine').sort((a, b) => a.order - b.order)
    .map(c => ({ c, pages: sea.filter(r => r.country === c.key) })).filter(g => g.pages.length);
  const rest = sea.filter(r => !groups.some(g => g.pages.includes(r)));
  if (rest.length) groups.push({ c: { key: 'other', name: t('hub.archive.other') }, pages: rest });
  const all = groups.flatMap(g => g.pages);
  const c = { key: 'sea', name: t('hub.archive.name'), blurb: t('hub.archive.blurb') };
  return { html: render(row, reg, ctx, { c, main: [], more: [], all, groups }), expect: all.map(r => r.key) };
}

/** The country's most-recommended open must-sees across all its guides (the hero's "why go" line). */
/**
 * Dedup only: two names for one dish (gaufre ≡ waffle) count once on a hub's "Known for" line. The equivalence comes
 * from the guides' own canon table (lib/guide.js CANON, where synonyms are written "gaufre|waffle|waffles"), so no
 * hand-kept list: the class of a name is the sorted set of the synonyms it appears with.
 */
const DISH_CLASS = (() => {
  const m = new Map();
  for (const c of Object.values(CANON)) for (const d of c.dishes || []) {
    const alts = d.split('|').map(fold), k = alts.slice().sort().join('|');
    for (const x of alts) if (!m.has(x)) m.set(x, k);
  }
  return m;
})();
const dishClass = name => DISH_CLASS.get(fold(name)) || fold(name);

function countrySignature(all) {
  // Built from the guides' own signatures (lib/guide.js tile lines: canon dishes, then the top landmark), guides in
  // place-count order, one item per guide, no two of the same dish class: first the guides' dishes, then their
  // landmarks; only if that still gives fewer than three does a guide without a tile line lend its most-cited open
  // tier-1 sight (signature()).
  const out = [], seen = new Set(), used = new Set();
  const bySize = all.slice().sort((a, b) => (b.counts.P + b.counts.F) - (a.counts.P + a.counts.F) || (a.name < b.name ? -1 : 1));
  const take = (r, names, kind) => {
    const n = names.find(x => x && !seen.has(dishClass(x)));
    if (!n) return;
    seen.add(dishClass(n)); used.add(r.name); out.push({ name: n, kind, city: r.name });
  };
  const tl = r => r.guide && r.guide.tileLine;
  const dishes = r => tl(r).parts.slice(0, tl(r).landmark ? -1 : undefined).map(shortName);
  const landmark = r => tl(r).landmark ? [shortName(tl(r).parts[tl(r).parts.length - 1])] : [];
  for (const pick of [dishes, landmark]) for (const r of bySize) {
    if (out.length >= 3) break;
    if (!used.has(r.name) && tl(r)) take(r, pick(r), pick === dishes ? 'food' : 'sight');
  }
  for (const r of bySize) {
    if (out.length >= 3) break;
    if (!used.has(r.name) && !tl(r)) take(r, signature(r).map(x => x.name), 'sight');
  }
  return out;
}

/** og:image for a hub: platform's per-page card when it exists (assets/og/<key>.png), else the shared cover. */
function ogFor(key) {
  for (const f of [`assets/og/${key}.png`, `assets/og/country-${key}.png`]) if (fs.existsSync(path.join(BETA, f))) return `${BETA_BASE}/${f}`;
  return null;
}

/** Country cards (landing "Countries", hub "Elsewhere in Cleo"): calm cover with the country's line motif, name, counts. */
function countryCards(list, up = '', reg = null) {
  return `<ul class="ccards">${list.map((o, i) => {
    const mf = motif(o.key, 'ink'), ph = photoOf(o.key, reg, null);
    return `<li><a class="ccard c-${i % 4}" href="${up}${esc(o.href)}"><span class="card-media"><span class="cover" aria-hidden="true">${mf ? `<img class="motif" src="${up}${mf}" alt="" loading="lazy" decoding="async">` : ''}${icon('compass', 'gl ico')}<span class="cover-n">${esc(o.name)}</span></span>${ph ? photoImg(ph, up, { sizes: SIZES.dense }) : ''}</span><span class="card-body"><span class="card-t">${esc(o.name)}</span><span class="counts">${plural('hub.guides', o.guides)} · ${plural('hub.places', o.places)}</span></span></a>${credit(ph)}</li>`;
  }).join('')}</ul>`;
}

function render(row, reg, ctx, { c, main, more, all, groups }) {
  const depth = row.beta.split('/').length - 1, up = '../'.repeat(depth);
  const S = sumStats(all);                                           // computed (lib/stats.js), never re-typed
  const n = S.total, P = S.sights, F = S.food, checked = S.lastChecked;
  const others = site().countries.filter(x => x.key !== c.key);
  const title = t('hub.title', { country: c.name, n: all.length });
  const sig = groups ? [] : countrySignature(all);
  const desc = t('hub.desc', { places: n.toLocaleString('en-US'), n: all.length, country: c.name, known: sig.length ? t('hub.desc.known', { names: sig.map(s => s.name).join(', ') }) : '' });
  const pins = all.reduce((s, r) => s + (r.recs || []).filter(x => x.la != null && !x.closed && (!x.pv || x.pv.pin !== 'low')).length, 0);
  const rail = groups ? '' : themeRail(reg, { up, country: c.key, heading: t('hub.themes.country', { country: c.name }), id: 'themes' });
  const shareUrl = BETA_BASE + '/' + row.beta.replace(/index\.html$/, '');
  // QA-59: a country's live blurb (data/countries.json, live copy) is not shown on its hub — "Known for" and the stat
  // line say it plainly; only the archive's own catalogue dek (hub.archive.blurb) is.
  // Share + method: in the hero on wide screens; on phones after the city grid, so the first screen is photo, name and cards (B-05)
  const acts2 = `<div class="acts2"><button type="button" class="btn btn-quiet" data-cleo-share data-title="${esc(title)}" data-url="${esc(shareUrl)}" hidden>${icon('share', 'ico sm')}${esc(t('hub.share', { country: c.name }))}</button><a class="btn btn-quiet" href="${up}how-we-choose.html">${icon('seal', 'ico sm')}${esc(t('shell.nav.method'))}</a><span class="share-note" data-cleo-share-note aria-live="polite"></span></div>`;
  // Hero media: the imagery lane's credited hero photo, else the calm cover — the country's line drawing (paper ground;
  // the night-ground drawing under a dark scheme) and the one expressive moment: the place count in the display face.
  const ph = groups ? null : photoOf(c.key, reg, null);
  const ink = motif(c.key, 'ink'), night = motif(c.key);
  const heroSrc = ph && ph.credit ? ph.credit.sourceUrl : null;           // cards below never repeat the hero photo
  const media = ph
    ? (typeof imagery.heroHtml === 'function' ? imagery.heroHtml(ph, up, 'photo hero-media') : `<figure class="photo hero-media">${photoImg(ph, up, { eager: true })}<figcaption>${captionHtml(ph.credit)}</figcaption></figure>`)
    : `<div class="hero-media cover c-1" aria-hidden="true">${ink ? `<picture>${night ? `<source media="(prefers-color-scheme: dark)" srcset="${up}${night}">` : ''}<img class="motif" src="${up}${ink}" alt="" decoding="async"></picture>` : ''}<span class="big">${fmt(n)}</span><span class="big-l">${esc(t('hub.hero.places'))}</span></div>`;
  return `${head({ page: 'hub', title, description: desc, rel: row.beta, depth, assetsV: ctx.assetsV, css: styles(depth), ogImage: ogFor(c.key), from: `data/countries.json + every ${c.name} place page` })}
<body class="has-tabbar">
${siteBar({ depth, current: 'hub', rel: row.beta })}
<main id="main" class="feb">
<section class="chero" data-cleo-masthead aria-labelledby="cn"><div class="inner">
<div class="copy">
  <p class="kicker">${icon('pin', 'ico sm')}${esc(t(groups ? 'hub.kicker.archive' : 'hub.kicker'))} · ${plural('hub.pins', pins)}</p>
  <h1 class="title d1" id="cn">${esc(c.name)}</h1>
  ${sig.length ? `<p class="why"><span class="k">${esc(t('hub.known'))}</span> <span class="l">${sig.map(s => `<span>${esc(s.name)}</span>`).join('')}</span></p>` : ''}
  <p class="facts"><b>${plural('hub.guides', all.length)} · ${plural('hub.places', n)}</b><span class="hide-m"> · ${esc(t('hub.sights', { n: fmt(P) }))} · ${esc(t('hub.food', { n: fmt(F) }))}${checked ? ` · ${esc(t('hub.checked', { d: checked }))}` : ''}</span>.</p>
  <div class="acts"><a class="btn btn-primary" href="#destinations">${esc(t('hub.cta', { n: all.length }))}</a></div>
  ${acts2}
  ${groups && c.blurb ? `<p class="facts blurb-c">${esc(c.blurb)}</p>` : ''}
</div>
${groups ? '' : media}
</div></section>
${groups ? '' : `<div class="wrap">${forYou()}</div>`}
<div class="wrap section" id="destinations">
${groups ? groups.map(g => `<section class="csec" id="${esc(g.c.key)}" aria-labelledby="g-${esc(g.c.key)}"><div class="rail-head"><h2 class="d2" id="g-${esc(g.c.key)}">${esc(g.c.name)}<span class="n">${plural('hub.guides', g.pages.length)}${g.c.live === false ? ` · ${esc(t('hub.preview'))}` : ''}</span></h2></div>
<ul class="morelist">\n${g.pages.map(r => moreRow(r, up)).join('\n')}\n</ul></section>`).join('\n') : `<div class="rail-head"><h2 class="d2" id="grid-h">${esc(t('hub.grid.h', { country: c.name }))}<span class="n">${plural('hub.guides', all.length)}</span></h2></div>
  <ul class="tiles hub2 cards" aria-labelledby="grid-h">
${main.map((r, i) => cityTile(r, i, { up, views: true, reg, avoid: heroSrc })).join('\n')}
  </ul>`}
${more.length ? `<h2 class="d3 more-h">${esc(t('hub.more', { country: c.name }))}</h2>\n<ul class="morelist">\n${more.map(r => moreRow(r, up)).join('\n')}\n</ul>` : ''}
${groups ? '' : `<div class="acts2-m">${acts2.replace(' data-cleo-share-note', '')}</div>`}
</div>
${rail ? `<div class="wrap">${rail}</div>` : ''}
<section class="wrap section" aria-labelledby="else-h"><div class="rail-head"><h2 class="d2" id="else-h">${esc(t('hub.else'))}</h2></div>
${countryCards(others, up, reg)}</section>
</main>
${footer({ depth, tabbar: true, current: 'hub' })}
${groups ? '' : `<script src="${up}assets/js/interests.js?v=${ctx.assetsV.interests}" defer></script>`}
</body>
</html>
`;
}

module.exports = { ogFor, renderCountry, renderArchive, cityTile, moreRow, forYou, facts, countryPages, nativeName, countryCards,
  signature, shortName, themes, themeRail, THEMES, motif, photoOf };
