'use strict';
/**
 * render/city.js — the beta CITY page. Lane FE-A owns this template and tools/beta/client/{city,sheet,tray}.js.
 *
 * Every place is server-rendered as a card, in area order, so the page is complete with no JS and no network.
 * The collection rail, toolbar, filter tray, detail sheet, source views and map are progressive enhancement over
 * this list; the client reads the cards plus one compact JSON blob and never needs a second copy of the content.
 *
 * Markup: RFC §5.5 contract + the designer's hooks (design/beta/specs/M1-visual.md): .pl-cover (stamped by the
 * client from data-gl), .tier/.tg glyph ladder, .pl-num, .rail-i(.sig), .split[data-view]. Numbers come from
 * row.stats (lib/stats.js), sources from row.sources (lib/sources.js), map art from row.art (lib/art.js).
 * Nothing here is invented: every word is the record's, the live page's, or VOICE.md's.
 */
const { esc, prose, jsonInline } = require('../html');
const { TIER } = require('../model');
const { t: tr, tn } = require('../i18n');   // platform W9-8: the offline-pack strings come from the catalogue; i18n D-41: every interface string
/** Every catalogue string the W9-8 offline pack and the offline map line use (test-i18n renders it in `pseudo`). */
function offlineStrings(city, n) {
  const L = k => tr('pack.' + k, { city, size: '{size}', date: '{date}' });
  return { title: L('title'), note: L('note'), keep: L('keep'), size: L('size'), saved: L('saved'), saving: L('saving'),
    failed: L('failed'), removed: L('removed'), remove: L('remove'), mapOffline: tr('map.offline', { n }) };
}
const { head, siteBar, footer, BETA_BASE } = require('./common');
const { rowsOf: galleryRows } = require('../gallery');
const { sentence, ownWords } = require('../casing');
const COUNTRIES = (() => { try { return JSON.parse(require('fs').readFileSync(require('path').resolve(__dirname, '../../../../data/countries.json'), 'utf8')).countries; } catch (e) { return []; } })();

const shortArea = n => String(n || '').split(/\s+[(—–]\s*|\s+\(/)[0].trim();
function areaSplit(name) {                     // 'Jōnan — Shinagawa · Meguro (Nakameguro …)' → ['Jōnan', 'Shinagawa · Meguro · Nakameguro …']
  let n = String(name || ''), hoods = [];
  let m = /^(.*?)\s*\((.*)\)\s*$/.exec(n); if (m) { n = m[1].trim(); hoods = [m[2].trim()]; }
  m = /^(.*?)\s+[—–]\s+(.*)$/.exec(n); if (m) { n = m[1].trim(); hoods = [m[2].trim()].concat(hoods); }
  return [n.trim(), hoods.join(' · ')];
}
const plural = (n, w) => tn(w === 'place' ? 'hub.places' : 'city.areas', n, { n: n.toLocaleString('en-US') });   // i18n D-41

/* ---- generic glyphs (original line set from design/beta/tools/svgkit.py); a glyph names a subject, never a venue ---- */
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.2"/><rect x="13" y="4" width="7" height="7" rx="1.2"/><rect x="4" y="13" width="7" height="7" rx="1.2"/><rect x="13" y="13" width="7" height="7" rx="1.2"/>',
  map: '<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  directions: '<path d="M12 2.8l9.2 9.2-9.2 9.2L2.8 12z"/><path d="M9 14.5v-2.5a1.5 1.5 0 0 1 1.5-1.5h4.5M13 8.5l2 2-2 2"/>',
  share: '<path d="M12 3v12M7.5 7.5L12 3l4.5 4.5"/><path d="M5 12.5V20h14v-7.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  'chev-r': '<path d="M9.5 6l6 6-6 6"/>', 'chev-l': '<path d="M14.5 6l-6 6 6 6"/>',
  star4: '<path d="M12 2.5l2.1 7.4 7.4 2.1-7.4 2.1-2.1 7.4-2.1-7.4L2.5 12l7.4-2.1z"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.4a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.6" r="2.4"/>',
  external: '<path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 14v5.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5H10"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
  stamp: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2l2.3 2.3 4.7-4.8"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  torii: '<path d="M3 5.2c4.5 1.3 13.5 1.3 18 0M5 9.5h14M7 6v15M17 6v15M12 9.5V6.6"/>',
  castle: '<path d="M4.5 21V10.5h3V8h2v2.5h5V8h2v2.5h3V21z"/><path d="M10 21v-3.5a2 2 0 0 1 4 0V21M12 3.5V8M12 3.5l3 1.3-3 1.2"/>',
  leaf: '<path d="M5 19.5C5 11 10 5 19.5 4.5 19.5 14 14 19 5.5 19.5"/><path d="M5 19.5l8.5-8.5"/>',
  columns: '<path d="M3 9l9-5 9 5M5.5 9.5v8M9.8 9.5v8M14.2 9.5v8M18.5 9.5v8M3 20.5h18"/>',
  mountain: '<path d="M2.5 20l6.5-11.5 4 6.5 2.5-3.5 6 8.5z"/><path d="M7.4 11.3l1.6 1.2 1.7-1"/>',
  steam: '<path d="M3.5 14.5c0 3.2 3.8 5.5 8.5 5.5s8.5-2.3 8.5-5.5z"/><path d="M8.5 11c-1.2-1.6 1.2-2.6 0-4.4M12 11c-1.2-1.6 1.2-2.6 0-4.4M15.5 11c-1.2-1.6 1.2-2.6 0-4.4"/>',
  wave: '<path d="M2.5 8.5c2.4 0 2.4-2 4.75-2S9.6 8.5 12 8.5s2.4-2 4.75-2 2.35 2 4.75 2M2.5 13.5c2.4 0 2.4-2 4.75-2s2.35 2 4.75 2 2.4-2 4.75-2 2.35 2 4.75 2M2.5 18.5c2.4 0 2.4-2 4.75-2s2.35 2 4.75 2 2.4-2 4.75-2 2.35 2 4.75 2"/>',   // design/beta/tools/build-css.py NEW
  flag: '<path d="M5 21V3.5M5 4h12l-2.5 4L17 12H5"/>',
  awning: '<path d="M3 9l2-5h14l2 5"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8.5h14V12M10 20.5v-5h4v5"/>',
  moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/><path d="M17 4l.5 1.3 1.3.5-1.3.5L17 7.6l-.5-1.3-1.3-.5 1.3-.5z"/>',
  bubble: '<path d="M4 4.5h16v11.5H10.5L5.5 20v-4H4z"/><path d="M12 6.8l1.1 2.4 2.6.3-1.9 1.7.5 2.5-2.3-1.3-2.3 1.3.5-2.5-1.9-1.7 2.6-.3z"/>',
  tower: '<path d="M12 2v3M8.5 21L12 5l3.5 16M9.3 15h5.4M7 21h10M10.2 10h3.6"/>',
  ticket: '<path d="M3.5 7h17v3a2 2 0 0 0 0 4v3h-17v-3a2 2 0 0 0 0-4z"/><path d="M14.5 7.5v1.5M14.5 11.2v1.6M14.5 15v1.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>',
  bowl: '<path d="M3 11.5h18a9 9 0 0 1-18 0z"/><path d="M9 20.5h6M13.5 3l6.5 7M9.5 3.5l6.5 7"/>',
  sushi: '<ellipse cx="12" cy="15" rx="8.5" ry="4"/><path d="M3.5 15v-2.2c0-2.3 3.8-4.3 8.5-4.3s8.5 2 8.5 4.3V15"/><path d="M7.5 10.5c2.5 1.4 6.5 1.4 9 0"/>',
  noodles: '<path d="M3 12h18a9 9 0 0 1-18 0z"/><path d="M7.5 12c0-4 1.8-6.5 1.8-9M11.5 12c0-4 1.8-6.5 1.8-9M15.5 12c0-4 1.8-6.5 1.8-9"/>',
  lantern: '<path d="M12 2v2.2M9.2 4.2h5.6M9.2 19.8h5.6M12 19.8V22"/><path d="M8.3 6.2h7.4a3.8 3.8 0 0 1 0 11.6H8.3a3.8 3.8 0 0 1 0-11.6z"/><path d="M5 10.2h14M5 13.8h14"/>',
  cup: '<path d="M4 8.5h13v4.5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8.5 3c-1 1.4 1 2 0 3.5M12.5 3c-1 1.4 1 2 0 3.5"/>',
  dango: '<path d="M4.5 21.5L19.5 2.5"/><circle cx="8.6" cy="16.3" r="2.6"/><circle cx="12" cy="12" r="2.6"/><circle cx="15.4" cy="7.7" r="2.6"/>',
  flame: '<path d="M12 21.5c4.1 0 7-2.8 7-6.6 0-4-3-6.2-4-10.4-2 2-3 4.2-3 6.2-1-1-1.9-1.6-2-3.2-2.1 2-5 4.2-5 7.4 0 3.8 2.9 6.6 7 6.6z"/>',
  cloche: '<path d="M3 18.5h18M4.5 18.5a7.5 7.5 0 0 1 15 0M12 8.5v-2M10 6.5h4"/>',
  forkknife: '<path d="M7 3v7.5M5 3v5a2 2 0 0 0 4 0V3M7 10.5V21M17 21V3c-2 1.4-3 4-3 8h3"/>',
  fish: '<path d="M3 12c3-4 6.8-6 10.8-6 3 0 5.2 2 7.2 6-2 4-4.2 6-7.2 6C9.8 18 6 16 3 12z"/><path d="M3 12L1.8 8.8M3 12l-1.2 3.2"/><circle cx="16.3" cy="11" r=".9"/>',
  bottle: '<path d="M10 2.5h4v3l1.5 2.5v13.5h-7V8L10 5.5z"/><path d="M8.5 12.5h7"/>',
  cake: '<path d="M4 21h16v-7H4z"/><path d="M4 16.5c2 1.4 4 1.4 5.3 0 1.4 1.4 4 1.4 5.4 0 1.3 1.4 3.3 1.4 5.3 0"/><path d="M12 14V9.5M12 6.5v.4"/>',
  tv: '<rect x="3" y="6.5" width="18" height="13" rx="2"/><path d="M8 3l4 3.5L16 3"/>',
  dumpling: '<path d="M3 15.5C3 11 7 7.5 12 7.5s9 3.5 9 8z"/><path d="M7 10c.5 1 1 1.6 1 2.6M12 7.5v3.6M17 10c-.5 1-1 1.6-1 2.6"/>',
  sandwich: '<path d="M3 11.5a9 5.5 0 0 1 18 0z"/><path d="M2.5 14.5h19M4 17.5h16a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"/>',
  route: '<circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.2 18h7.3a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7h7.3"/>',
  locate: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  spark: '<path d="M11 3.5l1.9 5.6 5.6 1.9-5.6 1.9L11 18.5l-1.9-5.6L3.5 11l5.6-1.9z"/><path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
  up: '<path d="M12 19V5M6.5 10.5L12 5l5.5 5.5"/>', down: '<path d="M12 5v14M6.5 13.5L12 19l5.5-5.5"/>',
  archive: '<path d="M3.5 4.5h17v4h-17zM5 8.5v11h14v-11M9.5 12.5h5"/>',
};
// collection / cuisine id → generic glyph (by the collection's subject, never a picture of a venue). Name keywords
// pick a glyph for ids the designer's table doesn't list; this chooses an ICON only — it never tags a place.
const GLYPH = {
  TEMPLE: 'torii', CASTLE: 'castle', GARDEN: 'leaf', PARK: 'leaf', MUS: 'columns', NATURE: 'mountain', ONSEN: 'steam', MKT: 'awning',
  NIGHT: 'moon', ANIME: 'bubble', POP: 'bubble', VIEW: 'tower', ROOF: 'tower', FREE: 'ticket', ICON: 'star4', UNESCO: 'globe',
  SUSHI: 'sushi', RAMEN: 'bowl', NOODLE: 'noodles', KAISEKI: 'cloche', IZAKAYA: 'lantern', WAGYU: 'flame', SWEET: 'dango',
  CAFE: 'cup', SAKE: 'bottle', FINE: 'cloche', INT: 'globe', VN: 'bowl', SG: 'noodles', SEA: 'noodles', CN: 'dumpling',
  US: 'sandwich', LAT: 'flame', DES: 'cake', TV: 'tv', ARCH: 'columns', HIST: 'castle', HERITAGE: 'castle', PZ: 'flame',
  JD: 'sandwich', CANT: 'dumpling', SPEAK: 'bottle', BREW: 'bottle', ICE: 'cake', DESSERT: 'cake', KOPI: 'cup', LAKSA: 'bowl',
  CHICKENRICE: 'bowl', SEAFOOD: 'fish', SEAF: 'fish', FISH: 'fish', BBQ: 'flame', WATER: 'fish', ODD: 'star4', ARTS: 'ticket', FAM: 'ticket',
};
const BY_NAME = [[/sushi/i, 'sushi'], [/ramen|noodle|pho|laksa|soba|udon/i, 'noodles'], [/dumpling|dim sum|chinese/i, 'dumpling'],
  [/coffee|caf[eé]|tea|kopi/i, 'cup'], [/bar|beer|brew|sake|wine|cocktail|whisky/i, 'bottle'], [/dessert|sweet|bak|cake|ice cream/i, 'cake'],
  [/fish|seafood|crab/i, 'fish'], [/bbq|grill|steak|wagyu|yakiniku|pizza/i, 'flame'], [/museum|galler/i, 'columns'], [/park|garden|nature|outdoor/i, 'leaf'],
  [/temple|shrine|mosque|church/i, 'torii'], [/market|shop|hawker/i, 'awning'], [/view|skyline|tower/i, 'tower'], [/night/i, 'moon'],
  [/history|heritage|castle|palace/i, 'castle'], [/free/i, 'ticket'], [/screen|tv|film|pop/i, 'tv']];
const glyphFor = (id, n, food) => GLYPH[id] || (BY_NAME.find(([re]) => re.test(n || '')) || [])[1] || (food ? 'forkknife' : 'compass');
const { motifSvg, motifOf, photoFor, figureHtml, heroFor, heroHtml: heroPhotoHtml, heroPreload } = require('../../imagery');   // imagery lane hooks
const ico = n => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"/></svg>`;
// R7 gap 3: the photo's dominant colour (imagery recompress.js, photo.color) rides on its figure as --ph, the placeholder
// the photo fades in from (city.js marks the figure .in when its image has loaded)
const tinted = (html, ph) => ph && /^#[0-9a-f]{6}$/i.test(ph.color || '') ? html.replace(/^<figure class="/, `<figure style="--ph:${ph.color}" class="`) : html;
const tier = (t, cls = '') => TIER[t] ? `<a class="tier t${t}${cls}" href="#how-we-choose"><i class="tg t${t}" aria-hidden="true"></i><span>${tr('tier.' + t)}</span></a>` : '';   // i18n D-41

/* ---- stated gaps: verbatim from the page's own method notes (never a keyword tag on a place) ---- */
const GAP_RE = /\b(there is no|genuinely thin|(is|are) thin|thin for that reason|rather than pad|rather than (be )?fill|isn.t there|could not find)\b/i;
function statedGaps(page) {
  const out = [], cz = page.CUISINES || [];
  for (const n of page.notes || []) {
    if (n.k === 'GAPS') { out.push({ title: n.title, text: n.body, cz: [] }); continue; }
    if (n.k !== 'FOOD RULES') continue;
    for (const s of String(n.body).split(/(?<=[.!?])\s+(?=[A-Z“"])/)) if (GAP_RE.test(s)) {
      const hit = cz.filter(c => s.includes(c.n) || s.includes(c.n.split(/[\s&,/(]/)[0] + ' ')).map(c => c.id);
      out.push({ title: n.title, text: s.trim(), cz: hit });
    }
  }
  return out;
}

/* ---- ordering within an area: open before closed, tier, then number of NAMED sources (stated in the UI) ---- */
const named = r => (r.src || []).filter(s => s !== 'guide').length;
const orderArea = list => list.map((r, i) => [r, i]).sort(([x, i], [y, j]) =>
  (x.closed ? 1 : 0) - (y.closed ? 1 : 0) || x.t - y.t || named(y) - named(x) || i - j).map(p => p[0]);

// the map pin's glyph for a sight with no collection glyph (SPEC-v3 §1.2): the type noun in the place's OWN NAME, from a
// fixed table — a pictogram, never a category or cuisine tag; worship is the torii on Japan pages, the lantern elsewhere
const NOUN = [[/\b(museum|gallery|library|hall|institute)\b/i, 'columns'], [/\b(church|cathedral|chapel|synagogue|basilica|temple|shrine|mosque)\b/i, 'worship'],
  [/\b(park|gardens?|reservation|preserve|arboretum|conservatory|trail)\b/i, 'leaf'], [/\b(beach|lake|river|falls|pier|harbou?r)\b/i, 'wave'],
  [/\b(tower|lighthouse|observatory|bridge)\b/i, 'tower'], [/\b(theat(?:re|er)|playhouse|stadium|arena)\b/i, 'ticket'],
  [/\b(market|shop|bookstore)\b/i, 'awning'], [/\b(cemetery|memorial|monument)\b/i, 'flag']];
const mapGlyphOf = (r, gl, japan) => { if (r.kind === 'food' || gl !== 'compass') return ''; const hit = NOUN.find(([re]) => re.test(r.n));
  return !hit ? '' : hit[1] === 'worship' ? (japan ? 'torii' : 'lantern') : hit[1]; };
const glyphOf = (r, page) => { const czN = r.cz.map(id => ((page.CUISINES || []).find(c => c.id === id) || {}).n).filter(Boolean);
  return r.kind === 'food' ? glyphFor(r.cz[0], czN[0], true) : glyphFor(r.g.find(g => g !== 'ICON' && g !== 'FREE') || r.g[0], '', false); };

/* ---- the card (M1-11): cover → eyebrow (tier · area · dish · pin no.) → name → write-up → note → address → Recommended by → save ---- */
function card(r, num, ctx) {
  const { page, srcById, areaName } = ctx;
  const aName = areaName(r.a);
  const czN = r.cz.map(id => ((page.CUISINES || []).find(c => c.id === id) || {}).n).filter(Boolean);
  const dish = r.kind === 'food' && czN[0] ? (ctx.SC || String)(czN[0].split(/ & |, | \(/)[0]) : '';
  const gl = glyphOf(r, page), mg = mapGlyphOf(r, gl, ctx.japan);
  const pv = r.pv || {}, prov = ctx.prov[r.id] || {};
  const where = [aName, dish].filter(Boolean).map(esc).join(' · ');
  const eyebrow = r.closed
    ? (prov.ss ? `${tr('city.card.closed')} · ${esc(tr(pv.checked ? 'city.card.perc' : 'city.card.per', { src: prov.ss, d: pv.checked }))}` : esc(tr(pv.checked ? 'city.card.closed.c' : 'city.card.closed', { d: pv.checked })))   // i18n D-41
    : `${tier(r.t)} <span class="in"><span class="in-a">${esc(tr('city.card.within', { area: aName }))}</span>${dish ? `<span class="in-d"><span class="sep"> · </span>${esc(dish)}</span>` : ''}</span>`;   // in-a: hidden where the list is grouped by area (W7 card)
  // Recommended by: every publisher is a chip that opens its source view (M1-10); CSS shows three, then "+N".
  const ids = (r.src || []).filter(s => s !== 'guide');
  // literal ', ' stays for screen readers / copy; DES's cleo.css 15.3 glues a drawn comma to each name (QA-18)
  const chips = ids.map(id => { const s = srcById[id] || { name: id }; return `<button type="button" class="src${s.authority ? ' auth' : ''}" data-src="${esc(id)}">${esc(s.name.split(' · ')[0])}</button>`; });
  let rec = chips.slice(0, 3).join(', ');
  if (chips.length > 3) rec += ` <span class="more">+${chips.length - 3}</span><span class="rest">, ${chips.slice(3).join(', ')}</span>`;
  if ((r.src || []).includes('guide')) rec += (rec ? ', ' : '') + `<span class="added">${tr('city.card.added')}</span>`;   // i18n D-41
  // native script is printed ONCE (ROUND-1 #4): a trailing native aside is wrapped as .nat; the client sets it on the
  // plate (≤ 7 glyphs) and DES's cleo.css then hides the title copy visually (kept for screen readers + search).
  const nat = r.nat && r.n.endsWith(`(${r.nat})`) ? r.nat : '';
  const nm = nat ? `${esc(r.n.slice(0, -nat.length - 2).trimEnd())} <span class="nat"${ctx.lang ? ` lang="${ctx.lang}"` : ''}>(${esc(nat)})</span>` : esc(r.n);
  const kText = String(r.k || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  // some live pages store a collection id in k ("HIST", "MUS"): that's a category the sheet lists under "Part of",
  // not advice, so it never prints as "Look for: HIST" (249 records, W2)
  if (kText && (page.CATS || []).concat(page.CUISINES || []).some(c => c.id === kText)) r = Object.assign({}, r, { k: '' });
  const isNote = kText.split(' ').length >= 8 && /[.!?…](\s|$)/.test(kText);     // VOICE.md rule 4 (D-16)
  const attrs = [`data-k="${r.kind === 'food' ? 'f' : 's'}"`, `data-t="${r.t}"`, `data-a="${esc(r.a)}"`, `data-n="${num}"`, `data-gl="${gl}"`, mg && `data-mg="${mg}"`, `data-m="${motifOf(r, gl)}"`,   // data-m: cover motif by kind id (imagery, ROUND-4 #6)
   
    r.g.length && `data-g="${esc(r.g.join(' '))}"`, r.cz.length && `data-cz="${esc(r.cz.join(' '))}"`,
    r.src && r.src.length && `data-src="${esc(r.src.join(' '))}"`,
    r.la != null && `data-ll="${r.la},${r.ln}"`, pv.checked && `data-checked="${esc(pv.checked)}"`, r.closed && 'data-closed', r.warn && 'data-warn', r.np && 'data-np', r.pq && `data-pq="${esc(r.pq)}"`].filter(Boolean).join(' ');   // data-pq: FE-B D-39 (QA-65)
  // W7 media slot (contract in docs/BETA-LOG.md): the calm cover (.pl-cover), a credited photo laid over it when the imagery
  // lane has one (figure.photo.pl-photo: lazy, sized, alt = what it depicts, credit in the figcaption), and the heart (.pl-x)
  return `<li class="pl${r.closed ? ' pl--closed' : ''}" id="p-${esc(r.id)}" ${attrs}><div class="pl-cover" aria-hidden="true"></div>${(ph => ph ? tinted(figureHtml(ph, ctx.up || '', 'photo pl-photo'), ph) : '')(ctx.photo && ctx.photo(r))}<p class="pl-x" hidden></p>
<p class="pl-e">${r.closed ? `${eyebrow} <span class="pl-num" aria-label="${tr('city.card.pin', { n: num })}">${num}</span>` : `<span class="pl-num" aria-label="${tr('city.card.pin', { n: num })}">${num}</span> ${eyebrow}`}</p>
<h3 class="pl-n"><a href="#p-${esc(r.id)}">${nm}</a></h3>
${r.w ? `<p class="pl-w">${prose(r.w)}</p>` : ''}${r.k ? `<p class="pl-k${isNote ? ' note' : ''}"><span class="lbl">${tr(isNote ? 'city.card.note' : 'city.card.look')}</span> ${prose(r.k)}</p>` : ''}${r.ad ? `<p class="pl-ad">${esc(r.ad)}</p>` : ''}
<p class="pl-s"${ids.length > 1 ? ` data-more="${ids.length - 1}"` : ''}><span class="lbl">${tr('card.recby')}</span> ${rec}</p></li>`;   // i18n D-41: the card's labels
}

/* ---- "For you" (M2-05): interests → collection / cuisine IDS only (Wenwen rule: never a dish or name keyword).
 * Effect is a reorder within each area; the record set never changes (test-fe-a.js). 'k:f' = every food record. ---- */
const INTERESTS = [
  ['history', 'History & landmarks', ['ICON', 'UNESCO', 'HIST', 'ARCH', 'CASTLE', 'TEMPLE', 'MON', 'GOV', 'HERITAGE', 'CIVIL', 'AVIATION', 'MARITIME', 'RAIL', 'FLW', 'DECO', 'CAMPUS'], []],
  ['food', 'Food & drink', [], [], 1],
  ['pop', 'Pop culture', ['ANIME', 'POP', 'ODD', 'ENT', 'ARTS', 'SPORT', 'SHOW', 'RACE', 'RIDE'], ['TV', 'VIRAL']],
  ['outdoors', 'Outdoors', ['PARK', 'GARDEN', 'NATURE', 'OUTDOOR', 'VIEW', 'ROOF', 'WATER', 'RIVER', 'BEACH', 'LAKES', 'WILD', 'BOAT', 'SPRNG', 'CANAL', 'ONSEN', 'SPA'], []],
  ['art', 'Art & museums', ['MUS', 'ART', 'MURAL', 'CRAFT', 'GLASS'], []],
];
function interests(recs, page) {
  const has = new Set((page.CATS || []).map(c => 'c:' + c.id).concat((page.CUISINES || []).map(c => 'cz:' + c.id)));
  return INTERESTS.map(([id, label, cs, czs, food]) => {
    const ids = (food ? ['k:f'] : []).concat(cs.map(x => 'c:' + x), czs.map(x => 'cz:' + x)).filter(x => x === 'k:f' || has.has(x));
    const n = recs.filter(r => ids.some(x => x === 'k:f' ? r.kind === 'food' : x[1] === ':' ? r.g.includes(x.slice(2)) : r.cz.includes(x.slice(3)))).length;
    return n ? [id, label, n, ids] : null;
  }).filter(Boolean);
}

/* ---- JSON-LD: open places only (D-21) ---- */
function jsonLd(row, recs, title) {
  const url = BETA_BASE + '/' + row.beta;
  const open = recs.filter(r => !r.closed);
  return {
    '@context': 'https://schema.org', '@type': 'ItemList', name: title, url, numberOfItems: open.length,
    itemListElement: open.map((r, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: Object.assign({ '@type': r.kind === 'food' ? 'Restaurant' : 'TouristAttraction', name: r.n, url: url + '#p=' + r.id },
        r.ad ? { address: r.ad } : {},
        r.la != null ? { geo: { '@type': 'GeoCoordinates', latitude: r.la, longitude: r.ln } } : {}),
    })),
  };
}

/* ---- page-level glue (FE-A): city-page mechanics cleo.css doesn't define yet — to be upstreamed by DES ---- */
// page-level glue (FE-A) lives in ./fe-a.css → beta/assets/fe-a.css (shared, cached; DES upstreams into cleo.css)

/* ---- render ---- */
function render(row, recs, ctx) {
  const page = row.data, m = page.meta, st = row.stats || {};
  const name = row.name || m.h1Main || row.key;
  const depth = row.beta.split('/').length - 1, up = '../'.repeat(depth);
  const areasAll = page.AREAS || [];
  const colors = row.colors || {};
  const areas = areasAll.filter(a => recs.some(r => r.a === a.id));
  const areaName = id => { const a = areasAll.find(x => x.id === id); return a ? areaSplit(a.n)[0] : tr('city.elsewhere'); };   // i18n D-41
  const srcList = (row.sources && row.sources.list) || [];
  const srcById = Object.fromEntries(srcList.map(s => [s.id, s]));
  const nS = st.sights != null ? st.sights : recs.filter(r => r.kind === 'sight').length, nF = recs.length - nS;

  // provenance the sheet prints (M1-12), read-only from data/geocodes.json via the registry join model.js uses
  const geo = (row._geo && row.geoKey && row._geo[row.geoKey]) || {};
  const prov = {};
  for (const r of recs) {
    const g = geo[r.n] || geo[r.n.replace(/\s*[—–-]+\s*CLOSED\b.*$/i, '').trim()];
    if (g) prov[r.id] = { pc: g.confidence || '', pv: g.verified || '', ss: r.closed ? g.statusSource || '' : '' };
  }

  /* -- day plans per area (platform's index when it ships one: row.dayPlans {AREA: [ids]}) -- */
  const G = row.guide || {}, gd = G.days || {}, days = {};                    // platform lib/guide.js (RFC §12, R-20…R-23)
  for (const a of areas) { const pl = (gd.plans || {})[a.id]; if (pl && pl.ids && pl.ids.length) days[a.id] = pl.ids; }

  /* -- collections: ★ signature first, Must see, the page's collections, two sources, the dish rail, stated gaps -- */
  // W8 (owner): UI labels are sentence case at display time (lib/casing.js, DESIGN-SYSTEM §v2.6); data is never edited
  const own = ownWords(name, m.h1Native, row.nat, ...areasAll.map(a => a.n)), SC = x => sentence(x, own);
  const cats = (page.CATS || []).map(c => Object.assign({}, c, { n: SC(c.n) })), cuis = (page.CUISINES || []).map(c => Object.assign({}, c, { n: SC(c.n) }));
  const cnt = f => recs.filter(f).length;
  const tiles = [];
  const star = cats.filter(c => /^★/.test(c.n) && cnt(r => r.g.includes(c.id)));
  const namedSrc = srcList.filter(s => s.id !== 'guide');
  star.forEach(c => tiles.push({ cls: 'sig', key: 'c', id: c.id, t: c.n.replace(/^★\s*/, ''), n: cnt(r => r.g.includes(c.id)), g: glyphFor(c.id, c.n), badge: 1 }));
  // no ★ collection in the data: the guide's own signature is the publisher it was built on (most-cited source)
  const sig = !star.length && G.signature && G.signature.n ? Object.assign({}, G.signature, { title: SC(G.signature.title) }) : null;   // no ★ collection: the city's canon / pop culture
  if (sig && sig.kind === 'collection' && sig.c && cats.some(c => c.id === sig.c[0])) {
    const c = cats.find(x => x.id === sig.c[0]); tiles.push({ cls: 'sig', key: 'c', id: c.id, t: c.n, n: cnt(r => r.g.includes(c.id)), g: glyphFor(c.id, c.n), badge: 1, d: sig.line });
  } else if (sig) tiles.push({ cls: 'sig', key: 'sig', id: '1', t: sig.title, n: sig.ids.length, g: sig.kind === 'food' ? glyphFor((sig.cz || [])[0], sig.title, true) : 'star4', badge: 1, d: sig.line });
  const nT1 = cnt(r => r.t === 1 && !r.closed);
  if (nT1) tiles.push({ cls: '', key: 't', id: '1', t: tr('tier.1'), n: nT1, tg: 1 });   // i18n D-41
  cats.filter(c => !/^★/.test(c.n) && !tiles.some(t => t.key === 'c' && t.id === c.id)).forEach(c => { const n = cnt(r => r.g.includes(c.id)); if (n) tiles.push({ cls: '', key: 'c', id: c.id, t: c.n, n, g: glyphFor(c.id, c.n), only: recs.every(r => !r.g.includes(c.id) || r.kind === 'sight') ? 's' : '' }); });
  namedSrc.slice(0, 2).forEach(s => tiles.push({ cls: 'src-t', key: 'src', id: s.id, t: s.name, n: s.n, k: tr('city.src.k'), g: 'stamp' }));   // i18n D-41
  const fo = G.foodOrder || [], fRank = c => { const i = fo.indexOf(c.id); return i < 0 ? 1e3 : i; };
  cuis.slice().sort((x, y) => fRank(x) - fRank(y)).forEach(c => { const n = cnt(r => r.cz.includes(c.id)); if (n) tiles.push({ cls: '', key: 'cz', id: c.id, t: c.n, n, g: glyphFor(c.id, c.n, true), only: 'f' }); });
  const missing = cats.concat(cuis).filter(c => cnt(r => r.g.includes(c.id) || r.cz.includes(c.id)) && !tiles.some(t => t.id === c.id && t.key !== 'src'));
  if (missing.length) throw new Error(`${row.beta}: collection rail would drop ${missing.map(c => c.id)}`);   // M1-02: no silent drop
  // home modules (M2-11, M2-05, M2-06, M3-02, M2-10) — only from fields that exist; they sit right after ★ in the rail
  const firstDay = areas.find(a => days[a.id]);
  const mods = [`<button type="button" class="rail-i door fy" data-cleo-foryou aria-haspopup="dialog"><svg class="ico" aria-hidden="true"><use href="#i-spark"/></svg><span class="k">${tr('city.door.guide.k')}</span><span class="t">${tr('city.door.guide.t')}</span><span class="d">${tr('city.door.guide.d')}</span></button>`];   // i18n D-41: the rail's doors
  if (firstDay) mods.push(`<button type="button" class="rail-i door" data-cleo-day=""><svg class="ico" aria-hidden="true"><use href="#i-route"/></svg><span class="k">${tr('city.door.day.k')}</span><span class="t">${esc(tr('city.door.day.t', { area: areaSplit(firstDay.n)[0] }))}</span><span class="d">${tr(Object.keys(days).length === 1 ? 'city.door.day.d.one' : 'city.door.day.d', { n: days[firstDay.id].length, a: Object.keys(days).length })}</span></button>`);
  const iFree = tiles.findIndex(t => t.key === 'c' && t.id === 'FREE');
  const free = iFree >= 0 ? tiles.splice(iFree, 1)[0] : null;
  if (free) free.cls = 'door';
  mods.push(`<button type="button" class="rail-i door mine" data-cleo-mine aria-pressed="false" hidden><svg class="ico" aria-hidden="true"><use href="#i-heart"/></svg><span class="k">${tr('shell.saved')}</span><span class="t">${tr('city.door.mine.t')}</span><span class="n" data-cleo-mine-n>0</span></button>`);
  if (recs.some(r => r.la != null)) mods.push(`<button type="button" class="rail-i door" data-cleo-near aria-pressed="false"><svg class="ico" aria-hidden="true"><use href="#i-locate"/></svg><span class="k">${tr('city.door.near.k')}</span><span class="t">${tr('city.door.near.t')}</span><span class="d">${tr('city.door.near.d')}</span></button>`);
  const nClosed = cnt(r => r.closed);
  const closedTile = nClosed ? `<button type="button" class="rail-i gap" data-closed="1" aria-pressed="false"><svg class="ico" aria-hidden="true"><use href="#i-archive"/></svg><span class="k">${tr('city.door.closed.k')}</span><span class="t">${tr('city.door.closed.t')}</span><span class="n${nClosed === 1 ? ' one' : ''}">${nClosed}</span></button>` : '';
  const gaps = statedGaps(page).map(g => Object.assign({}, g, { title: SC(g.title) }));
  const tileHtml = t => `<button type="button" class="rail-i${t.cls ? ' ' + t.cls : ''}" data-${t.key}="${esc(t.id)}"${t.only ? ` data-only="${t.only}"` : ''} aria-pressed="false">` +
    (t.tg ? '<i class="tg t1 g" aria-hidden="true"></i>' : t.g ? `<svg class="g ico" aria-hidden="true"><use href="#i-${t.g}"/></svg>` : '') +
    (t.badge ? `<span class="k">${tr('city.sig.k')}</span>` : t.k ? `<span class="k">${esc(t.k)}</span>` : '') +
    `<span class="t">${esc(t.t.split(' · ')[0])}</span>${t.d ? `<span class="d">${esc(t.d)}</span>` : ''}<span class="n${t.n === 1 ? ' one' : ''}">${t.n}</span></button>`;
  const gapHtml = gaps.map((g, i) => `<button type="button" class="rail-i gap" data-gap="${i}" data-only="f" aria-pressed="false"><svg class="g ico" aria-hidden="true"><use href="#i-info"/></svg><span class="k">${tr('city.gap.k')}</span><span class="t">${esc(g.cz.length ? (cuis.find(c => c.id === g.cz[0]) || {}).n : g.title)}</span></button>`);

  /* -- area chapters -- */
  const lang = { japan: 'ja', singapore: 'zh' }[row.country] || '';
  const cardCtx = { japan: row.country === 'japan', page, srcById, areaName, prov, lang, up, SC, photo: rec => photoFor(row, rec) };   // photo: imagery lane (credit-gated, null today)
  let placed = 0;
  const chapter = (a, list, i, total) => {
    const [head1, hoods] = a ? areaSplit(a.n) : [tr('city.elsewhere'), ''];   // i18n D-41: chapter strings
    const id = a ? a.id : 'other', col = a && colors[a.id] && /^#/.test(colors[a.id]) ? colors[a.id] : null;
    const art = a && row.art && row.art.areas && row.art.areas[a.id];
    placed += list.length;
    return `<section class="area" id="area-${esc(id)}" data-area="${a ? esc(a.id) : ''}" aria-labelledby="ah-${esc(id)}"${col ? ` style="--area:${col}"` : ''}>
${art ? `<img class="shape" src="${esc(up + art.src)}" width="${art.w}" height="${art.h}" alt="" decoding="async" loading="lazy">` : ''}<h2 id="ah-${esc(id)}"><span class="area-n">${esc(head1)}</span> <span class="area-c">${tr('city.area.c', { places: plural(list.length, 'place'), i: i + 1, n: total })}</span></h2>
${hoods ? `<p class="area-sub">${esc(hoods)}</p>` : ''}
<ol class="pls">
${orderArea(list).map((r, j) => card(r, j + 1, cardCtx)).join('\n')}
</ol>
<p class="area-end">${a && days[a.id] ? `<button type="button" class="btn btn-ghost" data-cleo-day="${esc(a.id)}">${ico('route')}<span>${tr('city.area.day', { n: days[a.id].length })}</span></button>` : ''}<button type="button" class="btn btn-ghost" data-cleo-map="${a ? esc(a.id) : ''}">${ico('map')}<span>${tr('city.area.map', { n: list.length })}</span></button></p>
</section>`;
  };
  const orphan = recs.filter(r => !areas.some(a => a.id === r.a));
  const total = areas.length + (orphan.length ? 1 : 0);
  const sections = areas.map((a, i) => chapter(a, recs.filter(r => r.a === a.id), i, total));
  if (orphan.length) sections.push(chapter(null, orphan, areas.length, total));
  if (placed !== recs.length) throw new Error(`${row.beta}: rendered ${placed} of ${recs.length} places`);
  const cardsHtml = sections.join('\n');

  /* -- Gallery hero (W3 A-03): "Start with {lead}" = the lead card's place (the first open must-see of the signature, else the first must-see).
   *    The category rows are chosen and drawn client-side from the page JSON (gallery.js): 0 bytes, 0 initial nodes. -- */
  const byArea = new Map(), ordered = [];
  areas.forEach(a => byArea.set(a.id, orderArea(recs.filter(r => r.a === a.id))));
  byArea.forEach(l => ordered.push(...l)); ordered.push(...orderArea(orphan));
  // W8 (R6 gap #8): the lead is ONE pick, lib/gallery.js rowsOf().lead — the record the lead card draws — so "Start with"
  // can never name a different place from the card under it (two near-identical pickers had drifted on 17 of 21 pages)
  const leadId = (galleryRows({ areas: areasAll, collections: page.CATS || [], cuisines: page.CUISINES || [], guide: row.guide, places: recs }, name).lead || {}).id;
  const leadR = recs.find(r => r.id === leadId) || ordered.find(r => !r.closed) || ordered[0];
  // W7 (owner: full UI/UX overhaul): a quiet hero — the city name, one line and the count line, with the imagery lane's
  // credited city photo when there is one. The night-sky art and the action pair are retired; the grid, the category bar
  // and the floating "Show map" pill carry the browsing
  const heroLine = (G.tileLine && G.tileLine.text) || m.h1Thin || '';
  const heroPhoto = heroFor(row);   // imagery W7: a credited city hero photo, or none
  // desktop shows the lead as one quiet text link (the phone shows it as the first card, under the hero)
  const leadName = leadR ? (leadR.nat && leadR.n.endsWith(`(${leadR.nat})`) ? leadR.n.slice(0, -leadR.nat.length - 2).trimEnd() : leadR.n) : '';
  // the photo is an in-flow media slot (imagery: eager, sized, TASL credit in its figcaption), never a full-bleed backdrop
  // W9-8 (platform): "Keep <city> offline" — core.js fills it from data/packs/<page>.json; hidden without a service worker
  const OS = offlineStrings(row.name || m.h1Main || row.key, recs.length), pkL = k => OS[k];
  const packHtml = `<section class="pack" data-cleo-pack data-key="${esc(row.fileKey || String(row.key).replace(/\//g, '--'))}" aria-labelledby="pack-h" hidden>` +
    `<h2 class="d3" id="pack-h">${esc(pkL('title'))}</h2><p class="sm" data-pack-note>${esc(pkL('note'))}</p>` +
    `<p class="pack-row"><button type="button" class="btn btn-primary" data-pack="keep">${esc(pkL('keep'))}</button> <span class="sm" data-pack-size data-l="${esc(pkL('size'))}"></span></p>` +
    `<p class="pack-done sm" data-pack-done data-l="${esc(pkL('saved'))}" hidden></p>` +
    `<p class="pack-msg sm" data-pack-msg role="status" aria-live="polite" data-l-saving="${esc(pkL('saving'))}" data-l-failed="${esc(pkL('failed'))}" data-l-removed="${esc(pkL('removed'))}"></p>` +
    `<p><button type="button" class="btn btn-ghost" data-pack="remove" hidden>${esc(pkL('remove'))}</button></p></section>`;
  const heroHtml = `<div class="g-hero-x">${heroLine ? `<p class="g-lead">${esc(heroLine)}</p>` : ''}${leadR ? `<p class="g-start"><a href="#p-${esc(leadR.id)}">${esc(tr('city.lead', { name: leadName }))}</a></p>` : ''}${heroPhoto ? tinted(heroPhotoHtml(heroPhoto, up, 'photo hero-media', { preloaded: true }), heroPhoto) : ''}</div>`;
  // default view: Gallery (SPEC §2.4), flipped in W5 once G1 and the phone first screen passed (ROUND-4 #2). A link with
  // #day= or a lens and no view= still opens Atlas, the unpaged list (views.js implied(), mirrored in the head script)
  const DV = 'gallery';
  const VIEWS = ['gallery', 'atlas'].concat(['guidebook', 'insights'].filter(v => ctx.assetsV[v]));
  const VLBL = { gallery: [tr('city.view.gallery'), 'grid'], atlas: [tr('city.view.atlas'), 'map'], guidebook: [tr('city.view.guidebook'), 'list'], insights: [tr('city.view.insights'), 'sliders'] };   // i18n D-41: views, tray, masthead
  // FE-B QC-09 (DESIGN-SYSTEM §v2.11): a labelled group of four pressed-state toggles, never a <nav> (axe: no group role on
  // nav); four segments at every width, one tap per switch; data-label = the visible tooltip when only the glyph shows
  const switcher = `<div class="views" data-cleo-views role="group" aria-label="${tr('city.view.label')}" hidden>${VIEWS.map(v => `<button type="button" data-view="${v}" aria-pressed="${v === DV}" data-label="${VLBL[v][0]}">${ico(VLBL[v][1])}<span class="l">${VLBL[v][0]}</span></button>`).join('')}</div>`;
  const areaChips = areas.length > 1 ? `<div class="area-chips" role="group" aria-label="${tr('city.areas.label')}" data-cleo-toolbar hidden></div>` : '';   // views.js draws the chips (page weight)
  // the view is set before first paint (SPEC §2.4): hash, then the stored preference (try/catch), then Gallery
  const viewHead = `<script>(function(){var v=${JSON.stringify(VIEWS)},h=location.hash,m=/(?:^#|&)view=([a-z]+)/.exec(h),s=null;if(!m&&(!h||h.indexOf('=')>0)){if(/(?:^#|&)(?:day|mode|a|t|c|cz|src|closed|q|sig|gap)=/.test(h))s='atlas';else try{s=JSON.parse(localStorage.getItem('cleo:v1:view'))}catch(e){}}` +
    `var x=m&&v.indexOf(m[1])>=0?m[1]:!m&&v.indexOf(s)>=0?s:'${DV}';document.documentElement.setAttribute('data-view',x);if(x==='atlas')document.documentElement.classList.add(!window.matchMedia||matchMedia('(min-width:1024px)').matches?'atlas-d':'atlas-m')})()</script>`;

  /* -- sprite: only the glyphs this page uses -- */
  const used = new Set(['search', 'grid', 'map', 'list', 'sliders', 'close', 'directions', 'share', 'check', 'chev-r', 'chev-l', 'pin', 'external', 'info', 'stamp', 'heart', 'star4', 'route', 'locate', 'spark', 'up', 'down', 'archive', 'castle', 'bowl', 'tv', 'mountain', 'columns']);
  tiles.forEach(t => t.g && used.add(t.g));
  for (const mm of cardsHtml.matchAll(/data-[gm][lg]="([a-z0-9-]+)"/g)) used.add(mm[1]);
  const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${[...used].filter(k => ICONS[k]).sort().map(k => `<symbol id="i-${k}" viewBox="0 0 24 24">${ICONS[k]}</symbol>`).join('')}</svg>`;

  const mapArt = row.art && row.art.map ? Object.assign({ alt: tr('city.mapart.alt', { n: row.art.map.drawn, city: name }) }, row.art.map) : null;
  const provDates = [...new Set(Object.values(prov).map(p => p.pv).filter(Boolean))].sort();
  const blob = {
    v: 2, key: row.key, name, center: ctx.center, total: recs.length, file: row.fileKey, lang,
    areas: Object.fromEntries(areasAll.map(a => [a.id, { n: areaSplit(a.n)[0], c: colors[a.id] && /^#/.test(colors[a.id]) ? colors[a.id] : null }])),
    // M1-10 publisher index (lib/sources.js): [name, n, numbered entries | 0, authority | '', publisher URL, list title]
    src: Object.fromEntries(srcList.map(s => { const e = (s.entries || []).find(x => /^https?:/.test(x.url)) || {}; return [s.id, [s.name.split(' · ')[0], s.n, s.numbered || 0, s.authority || '', e.url || '', srcList.length && s.numbered && e.title && e.title !== e.title.toUpperCase() ? e.title : '']]; })),
    cats: Object.fromEntries(cats.concat(cuis).map(c => [c.id, c.n.replace(/^★\s*/, '')])),
    // pin provenance, compact (W2, page weight): id → "<h|m|l><index into pd>[|status source]"; sheet.js expands it
    pd: provDates, prov: Object.fromEntries(Object.entries(prov).map(([id, p]) => [id, (p.pc || '-').charAt(0).toLowerCase() + (p.pv ? provDates.indexOf(p.pv) : '') + (p.ss ? '|' + p.ss : '')])),
    gaps: gaps.map(g => [g.title, g.text, g.cz]),
    fy: interests(recs, page),                                  // [id, label, n, ['c:ID' | 'cz:ID' | 'k:f']]
    days,                                                       // {AREA: [place ids in walking order]} — platform guide.days.plans
    js: { foryou: ctx.assetsV.foryou, day: ctx.assetsV.day, atlas: ctx.assetsV.atlas, gallery: ctx.assetsV.gallery, guidebook: ctx.assetsV.guidebook, insights: ctx.assetsV.insights, base: ctx.assetsV.base, 'share-card': ctx.assetsV['share-card'] /* FE-C W9-5 / W9-7 hook */ },  // loaded on first use (C.need / views.js), precached by the SW
    views: VIEWS, dv: DV,                                               // W3: the views this page offers (FE-B's modules join when their files exist)
    dl: gd.label || '', dsk: gd.skipped || {},                  // D-14 label; per-area reason when no day is planned
    sig: sig && sig.kind !== 'collection' ? { t: sig.title, line: sig.line || '', why: sig.why || '', ids: sig.ids, dishes: (sig.dishes || []).map(x => [x.t, x.n]) } : null,
    co: (G.closed || []).map(x => x.id),                        // Recently closed: newest status check first (R-23)
    // area locator art (lib/art.js): [src, w, h, pad, minLat, minLng, maxLat, maxLng, kx, ky] → the sheet's inset
    art: Object.fromEntries(Object.entries((row.art && row.art.areas) || {}).map(([a, x]) => [a, [up + x.src, x.w, x.h, x.proj.pad].concat(x.proj.box, [+x.proj.kx.toFixed(4), +x.proj.ky.toFixed(4)])])),
  };

  /* -- filter tray (M1-07), server-rendered so it costs no client JS; city.js only opens it and applies it -- */
  const pill = (k, v, t, n) => `<button type="button" class="pill" data-f="${k}" data-v="${esc(v)}" aria-pressed="false">${esc(t)}${n != null ? ` <span class="n">${n}</span>` : ''}</button>`;
  const fs = (id, legend, body) => body ? `<fieldset data-fs="${id}"><legend>${legend}</legend><div class="opts">${body}</div></fieldset>` : '';
  const trayHtml = `<div class="overlay" id="cleo-tray" hidden><div class="tray" role="dialog" aria-modal="true" aria-labelledby="tray-h"><header><h2 id="tray-h">${tr('city.tray.h')}</h2>` +
    `<button type="button" class="btn btn-icon" data-tr="x" aria-label="${tr('city.tray.close')}">${ico('close')}</button></header><div class="scroll">` +
    (areas.length > 1 ? fs('area', tr('city.tray.area'), areas.map(a => pill('a', a.id, areaSplit(a.n)[0], cnt(r => r.a === a.id))).join('')) : '') +
    fs('tier', `${tr('city.tray.tier')} <span class="sm">${tr('city.tray.tier.note')}</span>`, [1, 2, 3].map(t => pill('t', String(t), tr('tier.' + t), cnt(r => r.t === t && !r.closed))).join('')) +
    fs('src', tr('card.recby'), srcList.map(x => pill('src', x.id, x.name, x.n)).join('')) +
    fs('c', tr('city.tray.c'), cats.filter(c => cnt(r => r.g.includes(c.id))).map(c => pill('c', c.id, c.n.replace(/^★\s*/, ''), cnt(r => r.g.includes(c.id)))).join('')) +
    fs('cz', tr('city.tray.cz'), cuis.filter(c => cnt(r => r.cz.includes(c.id))).map(c => pill('cz', c.id, c.n, cnt(r => r.cz.includes(c.id)))).join('')) +
    fs('sort', tr('city.tray.sort'), pill('sort', '', tr('city.sort.guide')) + pill('sort', 'src', tr('city.sort.src')) + pill('sort', 'az', 'A–Z') + pill('sort', 'near', tr('city.sort.near')) + pill('sort', 'base', tr('city.sort.base')).replace('<button', '<button hidden') /* FE-C W9-5 hook: base.js shows it */) +
    fs('been', tr('city.been'), pill('been', '', tr('city.been.all')) + pill('been', 'hide', tr('city.been.hide')) + pill('been', 'only', tr('city.been.only'))) +
    fs('base', tr('city.base'), pill('base', 'street', tr('city.base.street')) + pill('base', 'light', tr('city.base.light')) + pill('base', 'satellite', tr('city.base.satellite'))) +
    `</div><footer><button type="button" class="btn btn-quiet" data-tr="clear">${tr('city.tray.clear')}</button><button type="button" class="btn btn-primary" data-tr="go">${tr('city.tray.go', { n: recs.length })}</button></footer></div></div>`;

  const title = `${name} — ${recs.length} sourced places · Cleo`;
  const desc = `${name}: ${nS} sights and ${nF} places to eat and drink, every one traceable to the source that recommended it, pinned and status-checked.`;
  const headHtml = head({ page: 'city', title, description: desc, rel: row.beta, depth, ogImage: ctx.ogImage, jsonld: jsonLd(row, recs, title), assetsV: ctx.assetsV, from: row.live })
    .replace('</head>', `<link rel="stylesheet" href="${up}${ctx.feaCss}">\n${viewHead}${heroPhoto ? '\n' + heroPreload(heroPhoto, up) : '' /* platform W7: hero preloaded unless the page opens in Atlas */}\n</head>`);
  const country = COUNTRIES.find(c => c.key === row.country) || {};
  // ROUND-4 #3: phones keep one short line (count · areas · last checked · closed); the method sentence and its "How we
  // choose" link sit in .long (≥ 900 px), so the What-changed link is the only masthead link before the first card
  const facts = `<b>${plural(recs.length, 'place')}</b> · ${plural(st.areas || areas.length, 'area')}<span class="long">${tr('city.facts.long')}</span>${st.lastChecked ? ` · ${tr('city.facts.checked')} <time class="nw">${esc(st.lastChecked)}</time>` : ''}${st.closed ? ` · ${tr('city.facts.closed', { n: st.closed })}<span class="long">${tr('city.facts.kept')}</span>` : ''}<span class="long">${tr('city.facts.order')} <a href="#how-we-choose">${tr('page.method')}</a></span>`;   // i18n D-41
  const seg = `<div class="modes" role="group" aria-label="${tr('city.mode.label')}"><button type="button" data-mode="all" aria-pressed="true">${tr('city.mode.all')} <span class="n">${recs.length}</span></button>` +
    (nS && nF ? `<button type="button" data-mode="sights" aria-pressed="false">${tr('city.mode.sights')} <span class="n">${nS}</span></button><button type="button" data-mode="food" aria-pressed="false">${esc(tr('city.mode.food'))} <span class="n">${nF}</span></button>` : '') + '</div>';

  return `${headHtml}
<body>
${sprite}
${siteBar({ depth, current: 'city', rel: row.beta })}
<main id="main" data-city="${esc(row.key)}">
<div class="cbar"><div class="cbar-in"><div class="spill" role="search" data-cleo-search hidden>${ico('search')}<label class="vh" for="cleo-filter">${esc(tr('city.search', { city: name }))}</label><input id="cleo-filter" type="search" placeholder="${esc(tr('city.search', { city: name }))}" autocomplete="off" enterkeyhint="search"><span class="hint" aria-hidden="true">${tr('city.search.hint')}</span></div>
${switcher}</div></div>
<button type="button" class="mappill" data-cleo-map="" data-cleo-mappill hidden>${ico('map')}<span>${tr('city.mappill')}</span></button>
<p class="vh" id="cleo-view-live" aria-live="polite"></p>
<header class="masthead">${motifSvg(row.imagery && row.imagery.motif, up, { fit: 'xMaxYMax meet', style: 'position:absolute;inset:0;width:100%;height:100%;z-index:-3;opacity:.42;-webkit-mask-image:linear-gradient(90deg,transparent 35%,#000 75%);mask-image:linear-gradient(90deg,transparent 35%,#000 75%)' })}
  <p class="eyebrow">${esc(country.name || m.eyebrow || '')}</p>
  <div class="title"><h1>${esc(name)}${row.nat ? ` <span class="native">${esc(row.nat)}</span>` : ''}</h1>${m.h1Thin && m.h1Thin !== heroLine ? `<p class="dek">${esc(m.h1Thin)}</p>` : ''}</div>
  <p class="facts">${facts}</p>
${heroHtml}
</header>
<nav class="rail" id="cleo-rail" aria-label="${tr('city.rail.label')}" data-cleo-rail data-view="all" hidden>
${tiles.filter(t => t.cls === 'sig').map(tileHtml).join('\n')}
${mods.join('\n')}${free ? '\n' + tileHtml(free) : ''}
${tiles.filter(t => t.cls !== 'sig').map(tileHtml).join('\n')}
${gapHtml.join('\n')}${closedTile ? '\n' + closedTile : ''}
<button type="button" class="rail-i rail-all" data-cleo-all aria-pressed="false"><svg class="g ico" aria-hidden="true"><use href="#i-grid"/></svg><span class="t">${tr('city.been.all')}</span><span class="n">${recs.length}</span></button>
</nav>
<div class="railbar" data-cleo-rail hidden><button type="button" class="btn btn-icon btn-ghost" data-rail="-1" aria-label="${tr('city.rail.prev')}">${ico('chev-l')}</button><button type="button" class="btn btn-icon btn-ghost" data-rail="1" aria-label="${tr('city.rail.next')}">${ico('chev-r')}</button></div>
<!-- QA-48 / QA-60 (B-04): the category bar sits above the phone lead card, so it is on the first screen on every page, not only where the hero is short -->
<div class="g-lead-slot vw view-gallery" id="cleo-lead"><p class="g-lead-k">${tr('city.lead.k')}</p></div>
<div class="g-rows vw view-gallery" id="cleo-rows-host"></div>
<div class="toolbar" data-cleo-toolbar hidden>
${seg}
<button type="button" class="btn btn-ghost area-btn" data-cleo-tray="area" aria-haspopup="dialog">${ico('pin')}<span class="lbl">${tr('city.tray.area')}</span></button>
<button type="button" class="btn btn-ghost" data-cleo-tray="" aria-haspopup="dialog" aria-label="${tr('city.tray.h')}">${ico('sliders')}<span class="lbl">${tr('city.tray.h')}</span><span class="tb-n" data-cleo-nf></span></button>
<button type="button" class="btn btn-primary map-toggle" data-cleo-map="" aria-label="${tr('city.map.show')}">${ico('map')}</button>
<div class="applied" data-cleo-applied></div>
${areaChips}
</div>
<div class="view-host" id="cleo-view" hidden></div>
<div class="split">
<div class="listpane" id="cleo-grid"><script>(function(h,g){if(h.classList.contains('atlas-d'))g.classList.add('w7-cards')})(document.documentElement,document.currentScript.parentNode)</script>
<div class="lens" id="cleo-lens" aria-live="polite" hidden></div>
<p class="shown" id="cleo-shown" aria-live="polite"></p>
${cardsHtml}
<section class="howto" id="how-we-choose" aria-labelledby="hwc-h"><h2 class="d2" id="hwc-h">${tr('page.method')}</h2>
<p>${tr('city.how.p')}</p>
<dl>${[1, 2, 3].map(n => `<dt><i class="tg t${n}" aria-hidden="true"></i> ${tr('tier.' + n)}</dt><dd>${tr('city.how.t' + n)}</dd>`).join('')}</dl>
<p class="sm">${tr('city.how.order')}</p>
</section>
</div>
<aside class="mappane" aria-label="${tr('city.map.label')}">
<button type="button" class="btn btn-primary mapclose" data-cleo-map="" aria-label="${tr('city.map.back')}">${ico('list')}<span>${tr('city.map.list')}</span></button>
<div id="cleo-map" class="map" data-l-offline="${esc(OS.mapOffline)}"${mapArt ? ` data-art="${esc(up + mapArt.src)}" data-art-alt="${esc(mapArt.alt)}"` : ''}>${mapArt
    ? `<figure class="map-art map-fallback"><img src="${esc(up + mapArt.src)}" width="${mapArt.w}" height="${mapArt.h}" alt="${esc(mapArt.alt)}" decoding="async" style="max-width:100%;height:auto"><figcaption>${tr('city.map.fallback')}</figcaption></figure>`
    : `<p class="map-fallback">${tr('city.map.fallback')}</p>`}</div>
<div class="poi-sheet" id="cleo-poi" role="dialog" aria-label="${tr('city.poi.label')}" hidden></div>
</aside>
</div>
${m.standfirst ? `<section class="about" aria-label="${tr('city.about.label')}"><p>${esc(m.standfirst.replace(/\s*Switch modes below[\s\S]*$/, ''))}</p></section>` : ''}
${packHtml}
<div class="overlay" id="cleo-sheet" hidden></div>
<div class="overlay" id="cleo-fy" hidden></div>
${trayHtml}
</main>
${footer({ depth, liveRel: row.live, notes: page.notes })}
<script type="application/json" id="cleo-city">${jsonInline(blob)}</script>
<script src="${up}assets/js/city.js?v=${ctx.assetsV.city}" defer></script>
<script src="${up}assets/js/sheet.js?v=${ctx.assetsV.sheet}" defer></script>
<script src="${up}assets/js/views.js?v=${ctx.assetsV.views}" defer></script>
</body>
</html>
`;
}

module.exports = { render, jsonLd, shortArea, offlineStrings, interests, INTERESTS };   // interests: also FE-B's W9-3 "For you" rail
