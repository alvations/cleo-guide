'use strict';
/**
 * guide.js — build-time "your guide" data for the FE lanes (platform). Computed from the page's own records;
 * nothing is invented, nothing is fetched. Every output is a pure function of the records + the editorial
 * table below, so `npm run beta:check` stays byte-reproducible.
 *
 *   signature(row, recs)  ★ = the city's UNIQUE food canon (or its pop-culture collection) — never a publisher
 *                         (ROUND-1 gap #10, CLAUDE.md editorial rule "food discovery centres on what is unique").
 *   foodOrder(row, recs)  the page's cuisine ids, canon first, then by count; ids only (Wenwen rule).
 *   dayPlans(row, recs)   "Your day" per area (M2-06, D-14): 4–6 open, verified-pin stops, straight-line legs.
 *   closedIndex(recs)     "Recently closed" collection data (M2-10): every closed record, newest check first.
 *   tileLine(...)         a hub-tile line from data: canon dishes found in the records + the top landmark.
 *
 * CANON keys on CUISINE / COLLECTION IDS only. `dishes` are display words, and a dish is printed only when a
 * record inside the canon set actually names it (in its name, write-up or note) — so the copy can never claim a
 * dish the guide doesn't list. The dish match chooses WORDS TO PRINT; it never tags or files a place.
 */
const { isVerifiedPin } = require('./stats');

/* Editorial table: the city-unique canon per page key (or per country for town pages). `cz` = cuisine ids,
 * `c` = collection ids (pop culture). Ids missing from a page, or with 0 records, are dropped at build time. */
const CANON = {
  // United States — the dish canon CLAUDE.md names, mapped to each page's own cuisine ids
  cleveland: { title: 'Only in Cleveland', cz: ['US'], dishes: ['Polish Boy', 'corned beef', 'Barberton chicken|Barberton|Serbian-fried chicken', 'Lake Erie perch|yellow perch|perch', 'pierogi'] },
  pittsburgh: { title: 'Pittsburgh classics', cz: ['AM', 'POL'], dishes: ['pierogi|pierogies', 'fish sandwich', 'Primanti sandwich|Primanti', 'chipped ham', 'haluski', 'hotcakes'] },
  newyork: { title: 'New York classics', cz: ['PZ', 'JD'], c: ['POP'], dishes: ['slice|pizza', 'bagel|bagels', 'pastrami', 'knish|knishes', 'cheesecake'] },
  chicago: { title: 'Chicago classics', cz: ['PZ', 'BEEF', 'DOG'], c: ['POP'], dishes: ['deep-dish|deep dish', 'Italian beef', 'tavern-style|tavern style', 'Maxwell Street Polish', 'hot dog|hot dogs'] },
  philadelphia: { title: 'Philadelphia classics', cz: ['CHS', 'HOAG'], c: ['SPORT'], dishes: ['cheesesteak|cheesesteaks', 'roast pork', 'hoagie|hoagies', 'broccoli rabe'] },
  cincinnati: { title: 'Cincinnati classics', cz: ['CHILI', 'GERMAN'], dishes: ['chili', 'goetta', 'three-way|3-way', 'coney|coneys'] },
  akron: { title: 'Akron classics', cz: ['CHIX'], dishes: ['Barberton chicken|Barberton|Serbian-fried chicken', 'hot rice'] },
  madison: { title: 'Wisconsin classics', cz: ['CURD', 'FISH', 'SUPPR'], dishes: ['cheese curds|curds', 'fish fry', 'supper club', 'old fashioned|old-fashioned'] },
  miami: { title: 'Miami classics', cz: ['CUBAN'], dishes: ['Cuban sandwich|Cubano', 'croqueta|croquetas', 'ventanita', 'cafecito|colada', 'pastelito|pastelitos'] },
  indianapolis: { title: 'Hoosier classics', cz: ['HOOS', 'PIE'], dishes: ['tenderloin', 'sugar cream pie', 'fried chicken'] },
  harrisburg: { title: 'Pennsylvania Dutch classics', cz: ['PADUTCH', 'BAKE', 'PRETZ'], dishes: ['shoofly', 'whoopie pie|whoopie pies', 'pretzel|pretzels', 'chicken pot pie', 'smorgasbord'] },
  erie: { title: 'Erie classics', cz: ['GREEK', 'DESSERT', 'FISH'], dishes: ['Greek sauce|Greek dog|Greek dogs', 'sponge candy', 'perch', 'walleye'] },
  youngstown: { title: 'Youngstown classics', cz: ['PZ'], dishes: ['Brier Hill', 'pizza'] },
  columbus: { title: 'Columbus classics', cz: ['PIZZA'], dishes: ['Columbus-style|tavern-style', 'pizza'] },
  dayton: { title: 'Dayton classics', cz: ['PIZZA'], dishes: ['Dayton-style|square-cut', 'pizza'] },
  statecollege: { title: 'State College classics', cz: ['STICKY', 'CREAM'], dishes: ['grilled sticky|grilled stickies|stickies', 'ice cream'] },
  washingtondc: { title: 'Washington classics', cz: ['BURG', 'SEAFOOD', 'ETHIOPIAN'], dishes: ['half-smoke|half-smokes', 'crab|crabs', 'injera'] },
  orlando: { title: 'Florida flavours', cz: ['FLA'], dishes: ['gator|alligator', 'key lime', 'citrus|orange'] },
  sanfrancisco: { title: 'San Francisco classics', cz: ['BAKE', 'MX', 'CANT'], dishes: ['sourdough', 'Mission burrito|burrito', 'dim sum', 'cioppino'] },
  wheeling: { title: 'Wheeling classics', cz: ['WVAPP'], dishes: ['pepperoni roll|pepperoni rolls'] },
  // Japan — pop culture (★ ANIME) stays the signature; the food canon orders the food rail
  tokyo: { title: 'Edomae classics', cz: ['SUSHI', 'NOODLE', 'TEMPURA'], dishes: ['Edomae sushi|edomae|Edo-mae|sushi', 'soba', 'tempura', 'monja|monjayaki', 'unagi'] },
  kyoto: { title: 'Kyoto classics', cz: ['KAISEKI', 'TOFU', 'SWEET'], dishes: ['kaiseki', 'yudofu|yuba|tofu', 'matcha', 'wagashi', 'shōjin|shojin'] },
  osaka: { title: 'Osaka classics', cz: ['KONAMON'], dishes: ['takoyaki', 'okonomiyaki', 'kushikatsu'] },
  hokkaido: { title: 'Hokkaido classics', cz: ['HOKKAIDO'], dishes: ['jingisukan|Genghis Khan', 'uni|sea urchin', 'kaisen-don|kaisendon', 'crab', 'soup curry'] },
  okinawa: { title: 'Okinawan classics', cz: ['OKINAWA'], dishes: ['Okinawa soba|soki soba', 'goya|gōyā|champuru|chanpuru', 'awamori', 'taco rice', 'rafute|rafutē'] },
  // Germany / Belgium
  aachen: { title: 'Aachen classics', cz: ['SWEET', 'GER'], dishes: ['Printen', 'Reibekuchen', 'Sauerbraten'] },
  rhineland: { title: 'Rhineland classics', cz: ['BEER', 'GER'], dishes: ['Kölsch', 'Altbier', 'Brauhaus', 'Himmel un Ääd'] },
  saarland: { title: 'Saarland classics', cz: ['GER', 'WINE'], dishes: ['Dibbelabbes', 'Lyoner', 'Schwenker', 'Riesling'] },
  liege: { title: 'Liège classics', cz: ['SWEET', 'BEL'], dishes: ['gaufre|waffle|waffles', 'boulets|boulet', 'sirop de Liège|sirop'] },
  '*belgium': { title: 'Belgian classics', cz: ['BEL', 'BEER', 'SWEET'], dishes: ['waffle|waffles|gaufre', 'frites|fries', 'chocolate|praline|pralines', 'moules|mussels', 'stoofvlees|carbonnade', 'trappist|lambic|gueuze'] },
  // Singapore towns share the hawker canon; Vietnam its own
  '*singapore': { title: 'The hawker canon', cz: ['CHICKENRICE', 'LAKSA', 'NOODLE', 'BKT', 'SEAFOOD', 'KOPI', 'HAWKER'], dishes: ['chicken rice', 'laksa', 'char kway teow', 'Hokkien mee', 'bak chor mee', 'bak kut teh', 'chilli crab', 'kaya toast|kaya'] },
  '*malaysia': { title: 'The hawker canon', cz: ['CHICKENRICE', 'LAKSA', 'NOODLE', 'BKT', 'HAWKER'], dishes: ['chicken rice', 'laksa', 'char kway teow', 'bak kut teh'] },
  '*vietnam': { title: 'Vietnamese classics', cz: ['VIET'], dishes: ['phở|pho', 'bánh mì|banh mi', 'cơm tấm|com tam', 'bún|bun', 'cà phê|ca phe|coffee'] },
};
const canonFor = row => CANON[row.key] || CANON['*' + row.country] || null;

const fold = s => String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/<[^>]+>/g, ' ').toLowerCase();
const esc = s => s.replace(/[.*+?^${}()[\]\\]/g, '\\$&');
const hay = r => fold([r.n, r.w, r.k].join(' '));

/** Canon dishes actually named by records in `set`, in the table's (editorial) order. [{t, n, ids}] — `ids` are
 *  the canon places whose own text names the dish (synonyms after '|' count: "waffle|gaufre"). */
const dishRe = d => new RegExp('(^|[^a-z])(' + d.split('|').map(a => esc(fold(a))).join('|') + ')([^a-z]|$)');
function dishesIn(dishes, set) {
  return (dishes || []).map(d => {
    const re = dishRe(d), ids = set.filter(r => re.test(hay(r))).map(r => r.id);
    return { t: d.split('|')[0], n: ids.length, ids };
  }).filter(x => x.n > 0);                                      // editorial (table) order: the canon's own priority
}

const nsrc = r => (r.src || r.s || []).length;
const rank = (a, b) => (a.t || 9) - (b.t || 9) || nsrc(b) - nsrc(a);
const open = r => !r.closed;

/** The food canon present on this page: {title, cz, n, ids, dishes} or null. */
function canon(row, recs) {
  const C = canonFor(row); if (!C) return null;
  const known = new Set((row.data.CUISINES || []).map(c => c.id));
  const cz = (C.cz || []).filter(id => known.has(id) && recs.some(r => r.cz.includes(id)));
  if (!cz.length) return null;
  const set = recs.filter(r => r.cz.some(id => cz.includes(id)));
  return { title: C.title, cz, n: set.length, open: set.filter(open).length, ids: set.map(r => r.id), dishes: dishesIn(C.dishes, set) };
}

/** Pop-culture collections present on this page (★ collections first, then the canon's `c`, then POP/ANIME). */
function popCulture(row, recs) {
  const cats = row.data.CATS || [], C = canonFor(row) || {};
  const want = cats.filter(c => /^★/.test(c.n)).map(c => c.id).concat(C.c || [], ['ANIME', 'POP']);
  const ids = [...new Set(want)].filter(id => cats.some(c => c.id === id) && recs.some(r => r.g.includes(id)));
  if (!ids.length) return null;
  const set = recs.filter(r => r.g.some(id => ids.includes(id)));
  const label = id => (cats.find(c => c.id === id) || {}).n.replace(/^★\s*/, '');
  return { c: ids, labels: ids.map(label), n: set.length };
}

/**
 * ★ signature. Order of preference:
 *   1. a ★ collection in the page data (Japan: Anime, Manga & Pop Culture) — pop culture is the city's own;
 *   2. the city-unique food canon (Cleveland: Polish Boy, corned beef…; Pittsburgh: pierogi, fish sandwich…);
 *   3. a pop-culture collection (POP);
 *   4. none — the FE falls back to Must see. Never a publisher.
 * Returns {kind:'collection'|'food', title, line, c?, cz?, n, ids, dishes?} or null.
 */
function signature(row, recs, cn = canon(row, recs), pc = popCulture(row, recs)) {
  const cats = row.data.CATS || [];
  const star = cats.filter(c => /^★/.test(c.n) && recs.some(r => r.g.includes(c.id)));
  if (star.length) {
    const set = recs.filter(r => r.g.some(id => star.some(c => c.id === id)));
    return { kind: 'collection', title: star.map(c => c.n.replace(/^★\s*/, '')).join(' · '), c: star.map(c => c.id), n: set.length,
      ids: set.map(r => r.id), line: cn && cn.dishes.length ? cn.dishes.slice(0, 3).map(d => d.t).join(' · ') : null, why: 'pop culture (★ collection in the page data)' };
  }
  if (cn) return { kind: 'food', title: cn.title, cz: cn.cz, n: cn.n, ids: cn.ids, dishes: cn.dishes,
    line: cn.dishes.length ? cn.dishes.slice(0, 3).map(d => d.t).join(' · ') : null, why: 'the city-unique food canon' };
  if (pc) {
    const set = recs.filter(r => r.g.some(id => pc.c.includes(id)));
    return { kind: 'collection', title: pc.labels.join(' · '), c: pc.c, n: set.length, ids: set.map(r => r.id), line: null, why: 'pop culture' };
  }
  return null;
}

/** Cuisine ids in rail order: canon first (table order), then by count desc, then page order; 0-count ids last. */
function foodOrder(row, recs, cn = canon(row, recs)) {
  const ids = (row.data.CUISINES || []).map(c => c.id), n = id => recs.filter(r => r.cz.includes(id)).length;
  const first = cn ? cn.cz : [];
  const rest = ids.filter(id => !first.includes(id)).map((id, i) => ({ id, n: n(id), i })).sort((a, b) => (b.n > 0) - (a.n > 0) || b.n - a.n || a.i - b.i).map(x => x.id);
  return first.concat(rest);
}

/** Hub-tile line from data: up to 2 canon dishes + the top open tier-1 landmark (Iconic collection first, then most
 *  sources, then the guide's own order) — e.g. "Polish Boy · corned beef · <landmark>". */
function tileLine(row, recs, cn = canon(row, recs)) {
  const parts = cn ? cn.dishes.slice(0, 2).map(d => d.t) : [];
  const icon = r => r.g.includes('ICON') ? 0 : 1;
  const top = recs.map((r, i) => ({ r, i })).filter(x => x.r.kind === 'sight' && open(x.r) && x.r.t === 1)
    .sort((a, b) => icon(a.r) - icon(b.r) || nsrc(b.r) - nsrc(a.r) || a.i - b.i).map(x => x.r)[0];
  if (top) parts.push(top.n.replace(/\s*\([^)]*\)\s*$/, '').replace(/\s*[—–-]+\s*CLOSED\b.*$/i, ''));
  return parts.length ? { text: parts.join(' · '), parts, landmark: top ? top.id : null } : null;
}

/* ---- day plans (M2-06, D-14) ---- */
const R = 6371.0088;
function km(a, b) {
  const t = Math.PI / 180, dLa = (b.la - a.la) * t, dLn = (b.ln - a.ln) * t;
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(a.la * t) * Math.cos(b.la * t) * Math.sin(dLn / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
const k1 = x => Math.round(x * 10) / 10;
const DAY = { maxStops: 6, minStops: 4, maxSights: 5, maxLeg: 3, maxTotal: 12 };
const DAY_LABEL = 'Suggested by the guide from sourced picks — check hours before you go. Distances are straight-line, not walking routes.';

/**
 * One plan per area: open places with a verified pin only (closed and unpinned are never stops).
 * Seed = the area's best open sight (tier, then most sources). Extend greedily by the nearest unvisited
 * candidate (tier ≤ 2 first) within `maxLeg` km straight-line, up to `maxSights`, stopping before the
 * running total passes `maxTotal`. Then one food stop (best tier, fewest extra km) is inserted where it
 * adds the least distance, never as the first stop. An area with < 4 stops gets no plan and a stated reason.
 */
function planArea(pool) {
  const sights = pool.filter(r => r.kind === 'sight').sort(rank), food = pool.filter(r => r.kind === 'food').sort(rank);
  const base = sights.length >= 3 ? sights : pool.slice().sort(rank);
  const tierOk = base.filter(r => (r.t || 9) <= 2).length >= DAY.minStops - 1 ? base.filter(r => (r.t || 9) <= 2) : base;
  if (!tierOk.length) return { reason: 'no open place with a verified pin' };
  const route = [tierOk[0]], left = new Set(tierOk.slice(1));
  let total = 0;
  const cap = sights.length >= 3 ? DAY.maxSights : DAY.maxStops;
  while (route.length < cap && left.size) {
    const cur = route[route.length - 1];
    let best = null, bd = Infinity;
    for (const r of left) { const d = km(cur, r); if (d < bd - 1e-9) { bd = d; best = r; } }
    if (!best || bd > DAY.maxLeg || total + bd > DAY.maxTotal) break;
    route.push(best); left.delete(best); total += bd;
  }
  if (sights.length >= 3 && route.length >= 2 && route.length < DAY.maxStops) {
    let pick = null, pos = 0, add = Infinity;
    for (const f of food.filter(r => (r.t || 9) <= 2).concat(food.filter(r => (r.t || 9) > 2))) {
      for (let i = 1; i <= route.length; i++) {
        const a = route[i - 1], b = route[i];
        const extra = km(a, f) + (b ? km(f, b) - km(a, b) : 0);
        if (km(a, f) <= DAY.maxLeg && (!b || km(f, b) <= DAY.maxLeg) && extra < add - 1e-9) { add = extra; pick = f; pos = i; }
      }
      if (pick && (pick.t || 9) <= 2) break;                  // best-tier food that fits wins; lower tiers only as fallback
    }
    if (pick && total + add <= DAY.maxTotal) { route.splice(pos, 0, pick); total += add; }
  }
  if (route.length < DAY.minStops) return { reason: route.length === 1 ? 'only one open, verified place close enough' : `only ${route.length} open, verified places within ${DAY.maxLeg} km of each other` };
  const legs = route.slice(1).map((r, i) => k1(km(route[i], r)));
  return { ids: route.map(r => r.id), legs, km: k1(legs.reduce((s, x) => s + x, 0)), sights: route.filter(r => r.kind === 'sight').length, food: route.filter(r => r.kind === 'food').length };
}

function dayPlans(row, recs) {
  const plans = {}, skipped = {};
  for (const a of row.data.AREAS || []) {
    const pool = recs.filter(r => r.a === a.id && open(r) && isVerifiedPin(r));
    const p = pool.length >= DAY.minStops ? planArea(pool) : { reason: pool.length ? `only ${pool.length} open place${pool.length === 1 ? '' : 's'} with a verified pin` : 'no open place with a verified pin' };
    if (p.ids) plans[a.id] = p; else skipped[a.id] = p.reason;
  }
  return { label: DAY_LABEL, rules: DAY, plans, skipped };
}

/** "Recently closed" (M2-10): every closed record, most recent status check first, then page order. */
function closedIndex(recs) {
  return recs.map((r, i) => ({ r, i })).filter(x => x.r.closed)
    .sort((a, b) => String((b.r.pv || {}).checked || '').localeCompare(String((a.r.pv || {}).checked || '')) || a.i - b.i)
    .map(({ r }) => ({ id: r.id, checked: (r.pv || {}).checked || null }));
}

/** Everything above, for one place page. Stored on the row (renderers) and in data/places/<page>.json. */
function guide(row, recs) {
  const cn = canon(row, recs), pc = popCulture(row, recs);
  return { signature: signature(row, recs, cn, pc), canon: cn, popCulture: pc, foodOrder: foodOrder(row, recs, cn),
    tileLine: tileLine(row, recs, cn), days: dayPlans(row, recs), closed: closedIndex(recs) };
}

module.exports = { dishRe, canonFor, fold, guide, signature, canon, popCulture, foodOrder, tileLine, dayPlans, closedIndex, km, CANON, DAY, DAY_LABEL };
