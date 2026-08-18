#!/usr/bin/env node
/**
 * research.js — the reusable source-research pipeline for the field guide.
 *
 * The guide's whole premise is that every place is traceable to a credible source.
 * This script standardises *finding and vetting* those sources for any city, so the
 * same flow used for Cleveland and Youngstown repeats cleanly for the next town.
 *
 * It does not (and cannot) call the web itself — searching is done with the
 * operator's web-search tool, because this environment blocks direct page fetches.
 * What this script does is deterministic and reusable:
 *
 *   1. plan   — emit the canonical search queries + candidate source URLs for a city
 *   2. record — you run those searches, rank what you find, fact-check the winners,
 *               and write them into data/sources.json (see docs/SOURCES.md)
 *   3. validate — check a city's recorded sources cover the required source types
 *
 * Usage:
 *   node research.js "Youngstown" "OH"               # A: research plan for a new city
 *   node research.js --refresh youngstown-oh         # B: re-verification plan for a published city
 *   node research.js --seed "Past Times Arcade" youngstown-oh  # C: source a named place & find more
 *   node research.js --validate youngstown-oh        # audit coverage in data/sources.json
 *   node research.js --media youngstown-oh           # list a city's local news outlets & TV
 *   node research.js --list                          # list cities already in the registry
 *
 * The pipeline order is deliberate and must not be reordered:
 *   search → rank → FACT-CHECK the ranked winners → only then build the page.
 */
const fs = require('fs');
const path = require('path');

const REG_PATH = path.join(__dirname, '..', 'data', 'sources.json');
const MEDIA_PATH = path.join(__dirname, '..', 'data', 'local-media.json');

function loadRegistry() {
  try { return JSON.parse(fs.readFileSync(REG_PATH, 'utf8')); }
  catch (e) { console.error('Could not read data/sources.json:', e.message); process.exit(1); }
}

function loadMedia() {
  try { return JSON.parse(fs.readFileSync(MEDIA_PATH, 'utf8')); }
  catch (e) { return { cities: {} }; }
}

const GEO_PATH = path.join(__dirname, '..', 'data', 'geocodes.json');
const PAGE_FOR = {
  'cleveland-oh': path.join(__dirname, '..', 'cleveland.html'),
  'pittsburgh-pa': path.join(__dirname, '..', 'cities', 'pittsburgh.html'),
  'youngstown-oh': path.join(__dirname, '..', 'cities', 'youngstown.html'),
  'new-york-ny': path.join(__dirname, '..', 'cities', 'newyork.html'),
  'silicon-valley-ca': path.join(__dirname, '..', 'cities', 'siliconvalley.html'),
  'san-francisco-ca': path.join(__dirname, '..', 'cities', 'sanfrancisco.html'),
  'cincinnati-oh': path.join(__dirname, '..', 'cities', 'cincinnati.html'),
  'dayton-oh': path.join(__dirname, '..', 'cities', 'dayton.html'),
  'columbus-oh': path.join(__dirname, '..', 'cities', 'columbus.html'),
};
// Cities built from a normalized dataset (source arrays live here pre-build) — used by --sourcecheck.
const DATASET_FOR = {
  'new-york-ny': path.join(__dirname, '..', 'data', 'newyork.dataset.json'),
  'silicon-valley-ca': path.join(__dirname, '..', 'data', 'siliconvalley.dataset.json'),
  'san-francisco-ca': path.join(__dirname, '..', 'data', 'sanfrancisco.dataset.json'),
  'cincinnati-oh': path.join(__dirname, '..', 'data', 'cincinnati.dataset.json'),
  'dayton-oh': path.join(__dirname, '..', 'data', 'dayton.dataset.json'),
  'columbus-oh': path.join(__dirname, '..', 'data', 'columbus.dataset.json'),
};

function loadGeocodes() {
  try { return JSON.parse(fs.readFileSync(GEO_PATH, 'utf8')); }
  catch (e) { return { cities: {} }; }
}

// Names of every place (sights + food) on a built city page — the P and F arrays
// only (not the AREAS / CUISINES arrays, which also use an `n:` key).
function pagePlaceNames(pageFile) {
  const html = fs.readFileSync(pageFile, 'utf8');
  const names = [];
  const re = /\bn:"((?:[^"\\]|\\.)*)"/g;
  const decode = (raw) => { try { return JSON.parse('"' + raw + '"'); } catch (e) { return raw.replace(/\\"/g, '"'); } };
  for (const marker of ['const P = [', 'const F = [']) {
    const s = html.indexOf(marker);
    if (s < 0) continue;
    const e = html.indexOf('\n];', s);
    const block = html.slice(s, e < 0 ? undefined : e);
    let m; while ((m = re.exec(block))) names.push(decode(m[1]));
  }
  return names;
}

// --geocheck: enforce that every place on the page has a verified geocode entry
// (address + lat/lng + source) in data/geocodes.json. This is a HARD gate — no
// place ships without a fact-checked, sourced coordinate. See docs/SOURCES.md.
function geocheck(key) {
  const line = '─'.repeat(72);
  const page = PAGE_FOR[key];
  if (!key || !page) {
    console.log('\nUsage: node research.js --geocheck <city-key>   (e.g. pittsburgh-pa)');
    console.log('Known city pages: ' + Object.keys(PAGE_FOR).join(', ') + '\n');
    return;
  }
  if (!fs.existsSync(page)) { console.log('No page built at ' + page); return; }
  const geo = (loadGeocodes().cities || {})[key] || {};
  const names = pagePlaceNames(page);
  console.log(`\nGEOCODE AUDIT — ${key}`);
  console.log(line);
  const missing = [], unsourced = [], ok = [];
  for (const n of names) {
    const e = geo[n];
    if (!e) { missing.push(n); continue; }
    if (e.lat == null || e.lng == null || !e.source) { unsourced.push(n); continue; }
    ok.push(n);
  }
  console.log(`places on page: ${names.length}`);
  console.log(`  verified (address + lat/lng + source): ${ok.length}`);
  console.log(`  MISSING from data/geocodes.json:        ${missing.length}`);
  missing.forEach(n => console.log('     ✗ ' + n));
  console.log(`  incomplete (no lat/lng or no source):   ${unsourced.length}`);
  unsourced.forEach(n => console.log('     ! ' + n));
  const orphan = Object.keys(geo).filter(n => !names.includes(n));
  if (orphan.length) console.log(`  (registry has ${orphan.length} entries not on the page — old/renamed)`);
  // Placement confidence — coverage can PASS while pins still need the re-verify pass.
  const byConf = { high: [], med: [], low: [], none: [] };
  ok.forEach(n => { const c = (geo[n].confidence || 'none').toLowerCase(); (byConf[c] || byConf.none).push(n); });
  console.log(`  placement confidence: high ${byConf.high.length} · med ${byConf.med.length} · low ${byConf.low.length}`
    + (byConf.none.length ? ` · ungraded ${byConf.none.length}` : ''));
  const toReverify = byConf.low.concat(byConf.none);
  if (toReverify.length) {
    console.log(`  ↻ re-verify placement (block-level / ungraded — upgrade to an exact !3d!4d place pin):`);
    toReverify.forEach(n => console.log('     ↻ ' + n));
  }
  const pass = missing.length === 0 && unsourced.length === 0;
  console.log('\n' + line);
  console.log(pass
    ? '>>> PASS — every place has a fact-checked address + coordinate + source.'
    : '>>> FAIL — verify the flagged places against an official site / Google/Apple/OSM map / Wikipedia,');
  if (!pass) console.log('    then record address+lat/lng+source in data/geocodes.json. Never pin from memory.');
  else if (toReverify.length) console.log(`    NOTE: ${toReverify.length} pin(s) still block-level/ungraded — run the re-verify & fix pass before publishing (docs/SOURCES.md).`);
  console.log('');
  if (!pass) process.exitCode = 1;
}

// --statuscheck: enforce that every place's OPEN/CLOSED status is verified, sourced, and
// consistent between the registry and the page. A place that has permanently closed must be
// surfaced as such (name flagged "— CLOSED"); a place flagged closed on the page must carry a
// sourced 'closed' status in the registry. Mirrors --geocheck for operating status.
const CLOSED_MARK = /(CLOSED|closed|no longer|defunct|permanently closed)/;
function statuscheck(key) {
  const line = '─'.repeat(72);
  const page = PAGE_FOR[key];
  if (!key || !page) {
    console.log('\nUsage: node research.js --statuscheck <city-key>   (e.g. pittsburgh-pa)');
    console.log('Known city pages: ' + Object.keys(PAGE_FOR).join(', ') + '\n');
    return;
  }
  if (!fs.existsSync(page)) { console.log('No page built at ' + page); return; }
  const geo = (loadGeocodes().cities || {})[key] || {};
  const names = pagePlaceNames(page);
  console.log(`\nOPEN/CLOSED AUDIT — ${key}`);
  console.log(line);
  const missing = [], unverified = [], closedFlagged = [], closedNotFlagged = [], flaggedNotClosed = [], open = [];
  for (const n of names) {
    const e = geo[n];
    const nameSaysClosed = CLOSED_MARK.test(n);
    if (!e || !e.status) { missing.push(n); continue; }
    const isClosed = e.status === 'closed';
    // consistency: closed status <-> name flag must agree
    if (isClosed && !nameSaysClosed) closedNotFlagged.push(n);
    if (!isClosed && nameSaysClosed) flaggedNotClosed.push(n);
    if (isClosed) { closedFlagged.push(n); continue; }
    if (!e.statusChecked || !e.statusSource) { unverified.push(n); continue; }
    open.push(n);
  }
  console.log(`places on page: ${names.length}`);
  console.log(`  open (status verified + source + date):  ${open.length}`);
  console.log(`  closed (flagged + sourced):              ${closedFlagged.length}`);
  closedFlagged.forEach(n => console.log('     ⊘ ' + n));
  console.log(`  status UNVERIFIED (no source/date yet):  ${unverified.length}`);
  if (missing.length) { console.log(`  MISSING status in registry:              ${missing.length}`); missing.forEach(n => console.log('     ✗ ' + n)); }
  if (closedNotFlagged.length) { console.log(`  ✗ CLOSED but NOT surfaced on the page (name lacks a closed marker):`); closedNotFlagged.forEach(n => console.log('     ! ' + n)); }
  if (flaggedNotClosed.length) { console.log(`  ✗ name says closed but registry status is not 'closed':`); flaggedNotClosed.forEach(n => console.log('     ! ' + n)); }
  const consistent = missing.length === 0 && closedNotFlagged.length === 0 && flaggedNotClosed.length === 0;
  console.log('\n' + line);
  console.log(consistent
    ? '>>> CONSISTENT — every closed place is surfaced and sourced; no open/closed mismatches.'
    : '>>> FAIL — resolve the mismatches above (a permanently-closed place must be flagged on the page,');
  if (!consistent) console.log("    and every registry 'closed' must carry a statusSource). See docs/SOURCES.md.");
  else if (unverified.length) console.log(`    NOTE: ${unverified.length} place(s) have no closure check yet — run the closure-check pass before publishing (docs/SOURCES.md).`);
  console.log('');
  if (!consistent) process.exitCode = 1;
}

// Print a city's recorded local news outlets & TV channels (data/local-media.json).
function media(key) {
  const m = loadMedia();
  const c = m.cities && m.cities[key];
  console.log('\nLOCAL MEDIA — ' + (c ? c.name : key));
  console.log('─'.repeat(72));
  if (!c) {
    console.log('Not recorded yet. Add this city to data/local-media.json (tv, newspaper, altWeekly,');
    console.log('magazine, business, nonprofit, public, cvb, familyOrActivity) so it can be tapped.');
    console.log('Known: ' + Object.keys(m.cities || {}).join(', ') + '\n');
    return;
  }
  const groups = ['tv', 'newspaper', 'altWeekly', 'magazine', 'business', 'nonprofit', 'public', 'cvb', 'familyOrActivity'];
  groups.forEach(g => {
    if (!c[g] || !c[g].length) return;
    console.log('  ' + g + ':');
    c[g].forEach(o => console.log('    · ' + o.name + (o.url ? '  ' + o.url : '') + (o.note ? '   — ' + o.note : '')));
  });
  console.log('\nTap these for "best things to do / hidden gems / fall fun" lists; they change — keep updated.\n');
}

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cityKey = (city, st) => slug(city) + '-' + (st || '').toLowerCase();

// Source types every city page should cover before it is built.
const REQUIRED = ['atlas_obscura', 'historical_society', 'state_tourism'];
const RECOMMENDED = ['tv_numbered_list', 'metroparks', 'nonprofit_local_news', 'local_cvb', 'travel_blog'];
const CREATOR_TYPES = ['famous_creator', 'local_creator'];

function plan(city, st) {
  const reg = loadRegistry();
  const year = (process.env.RESEARCH_YEAR || '').trim() || String(new Date().getFullYear());
  const citySlug = slug(city);
  const stLower = (st || '').toLowerCase();

  const line = '─'.repeat(72);
  console.log(`\nRESEARCH PLAN — ${city}${st ? ', ' + st.toUpperCase() : ''}`);
  console.log(`registry key: ${cityKey(city, st)}`);
  console.log(line);
  console.log('PIPELINE: search → rank sources → FACT-CHECK winners → build page.');
  console.log('Record the ranked, fact-checked winners in data/sources.json before building.\n');

  console.log('A. SOURCE-DISCOVERY SEARCHES (run each with your web-search tool)');
  const discovery = [
    `${city} ${st} local TV station best things to do list`,
    `100 hidden gems of ${city} ${st}`,
    `Atlas Obscura ${city} ${st} things to do`,
    `${city} ${st} alt weekly`,
    `${city} magazine best of`,
    `${city} ${st} business journal`,
    `${city} ${st} nonprofit local news`,
    `${city} historical society museums`,
    `${city} metroparks trails`,
    `visit ${city} ${st} official tourism`,
    `best things to do in ${city} ${st} travel blog ${year}`,
    `${city} ${st} best flea market OR maker market OR public market OR Amish market popular`
  ];
  discovery.forEach((q, i) => console.log(`  ${String(i + 1).padStart(2)}. ${q}`));

  // A1b — the discovery playbook: authoritative rankings, official sites, university
  // guides, and suburban/county coverage. Codified from the Pittsburgh expansion so the
  // marquee institutions get anchored to real rankings and the suburbs aren't missed.
  // Full write-up: docs/SOURCES.md → "Finding more sources — the discovery playbook".
  console.log('\nA1b. AUTHORITATIVE + UNIVERSITY + SUBURBAN SEARCHES (anchor marquee places; reach the suburbs)');
  const playbook = [
    `"${city}" top attractions tripadvisor things to do`,
    `best things to do in ${city} US News Travel`,
    `PlanetWare top-rated tourist attractions in ${city}`,
    `Fodor's OR Frommer's OR "Lonely Planet" ${city} things to do`,
    `Britannica ${city} ${st} cultural life  ·  Wikipedia List of museums in ${city}`,
    `<parent museum org> official site ${city}  ·  <institution> official site .org ${city}   (cite marquee places here)`,
    `<university> things to do in ${city} students explore the city`,
    `site:.edu things to do in ${city} student guide off campus`,
    `visit <county> county ${st}  ·  <county> tourism hidden gems   (+ the suburban weekly / county daily)`,
    `${city} ${st} industrial heritage tours OR land trust OR history & landmarks foundation`,
    `<proper noun> address  ·  <proper noun> coordinates latitude longitude   (confirm + geocode)`
  ];
  playbook.forEach((q, i) => console.log(`  ${String(i + 1).padStart(2)}. ${q}`));

  const key = cityKey(city, st);
  const rec = (loadMedia().cities || {})[key];
  console.log('\nA2. LOCAL MEDIA to search (city → outlets; see data/local-media.json)');
  if (rec) {
    ['tv', 'newspaper', 'altWeekly', 'magazine', 'business', 'nonprofit', 'public', 'cvb', 'familyOrActivity'].forEach(g => {
      (rec[g] || []).forEach(o => console.log('  · ' + o.name + (o.url ? '  ' + o.url : '')));
    });
    console.log('  (run `node research.js --media ' + key + '` for the full list with notes)');
  } else {
    console.log('  None recorded yet — add ' + key + ' to data/local-media.json so it can be tapped/refreshed.');
    console.log('  Find them: search "' + city + ' ' + st + ' TV stations", the metro daily, the alt-weekly, the CVB.');
  }

  console.log('\nB. CREATOR / COVERAGE SEARCHES (famous + local video)');
  const creators = [
    `famous travel YouTuber visited ${city} ${st}`,
    `${city} ${st} walking tour youtube`,
    `${city} ${st} vlog youtube`,
    `Peter Santenello ${city}`,            // a known rust-belt/Americana channel; swap per region
    `${city} ${st} documentary youtube`
  ];
  creators.forEach((q, i) => console.log(`  ${String(i + 1).padStart(2)}. ${q}`));

  console.log('\nC. CANDIDATE SOURCE URLS (open the index, do not just search entries)');
  const cand = [
    ['Atlas Obscura (state index)', `https://www.atlasobscura.com/things-to-do/${citySlug}-${stLower}  ·  fallback: /things-to-do/<state>`],
    ['Roadside America (state)', `https://www.roadsideamerica.com/location/${stLower}/all`],
    ['Official state tourism', `search "<state> tourism official" (e.g. ohio.org)`],
    ['Local CVB / visitors bureau', `search "visit ${city}" / "explore <county>"`],
    ['Wikipedia (for cross-checking dates/addresses)', `https://en.wikipedia.org/wiki/${city.replace(/ /g, '_')},_${(st || '').toUpperCase()}`]
  ];
  cand.forEach(([k, v]) => console.log(`  • ${k}\n      ${v}`));

  console.log('\nD. RANKING RUBRIC (rank each source 1–3 before fact-checking)');
  console.log('  1 = primary: reported, bylined, specific, local → transcribe fully.');
  console.log('  2 = corroboration: solid round-up or official page → cross-check the spine.');
  console.log('  3 = lead only: aggregator/SEO/thin → mine for names, never cite as the source.');
  console.log('  Reject: no byline, no photos, no specifics.');
  console.log('  Creators: rank by whether they covered THIS city vs. only the region — label honestly.');
  console.log('  Markets: a standard category (cuisine MKT). Add only genuinely visit-worthy markets of');
  console.log('           any kind (flea/maker/public/antique/Amish/farmers) — see the strict rules in');
  console.log('           docs/SOURCES.md. Reject temporary/pop-up/generic ones.');

  console.log('\nE. FACT-CHECK (do this AFTER ranking, BEFORE building the page)');
  console.log('  For every place that will appear: confirm it exists, is open, and the address/hours');
  console.log('  from the ranked source above (search the place name + city). Flag closed places, keep them.');
  console.log('  Only mark a source "verified": true in the registry once you checked a claim from it.');

  console.log('\nF. RECORD → data/sources.json under cities["' + cityKey(city, st) + '"], then run:');
  console.log(`  node tools/research.js --validate ${cityKey(city, st)}\n`);

  // Skeleton to paste into data/sources.json
  const skeleton = {
    name: `${city}, ${(st || '').toUpperCase()}`,
    atlasObscuraIndex: '',
    researchedOn: '',
    researchedVia: 'WebSearch',
    sources: [{ key: '', name: '', type: 'atlas_obscura', url: '', rank: 1, verified: false, covers: [] }],
    creators: [{ key: '', name: '', type: 'famous_creator', youtube: '', work: '', scope: 'city|region', verified: false }]
  };
  console.log('SKELETON (paste under cities, fill in, delete this line):');
  console.log(JSON.stringify({ [cityKey(city, st)]: skeleton }, null, 2));
  console.log('');
  if (reg.cities && reg.cities[cityKey(city, st)]) {
    console.log(`NOTE: "${cityKey(city, st)}" already exists in the registry — run --validate to audit it.\n`);
  }
}

function validate(key) {
  const reg = loadRegistry();
  const city = reg.cities && reg.cities[key];
  if (!city) {
    console.error(`No city "${key}" in data/sources.json. Known: ${Object.keys(reg.cities || {}).join(', ') || '(none)'}`);
    process.exit(1);
  }
  const sources = city.sources || [];
  const creators = city.creators || [];
  const types = new Set(sources.map(s => s.type));
  const line = '─'.repeat(72);
  console.log(`\nVALIDATE — ${city.name} (${key})`);
  console.log(line);

  let fail = 0, warn = 0;
  const has = t => types.has(t);

  console.log('Required source types:');
  REQUIRED.forEach(t => {
    const ok = has(t);
    if (!ok) fail++;
    console.log(`  ${ok ? 'PASS' : 'MISS'}  ${t}`);
  });
  console.log('Recommended source types:');
  RECOMMENDED.forEach(t => {
    const ok = has(t);
    if (!ok) warn++;
    console.log(`  ${ok ? 'PASS' : 'warn'}  ${t}`);
  });

  const creatorCount = creators.length + sources.filter(s => CREATOR_TYPES.includes(s.type)).length;
  console.log(`Creator/coverage entries: ${creatorCount} ${creatorCount >= 1 ? 'PASS' : 'MISS'}`);
  if (creatorCount < 1) fail++;

  const rank1 = sources.filter(s => s.rank === 1).length;
  console.log(`Rank-1 (primary) sources: ${rank1} ${rank1 >= 1 ? 'PASS' : 'MISS'}`);
  if (rank1 < 1) fail++;

  const verified = sources.filter(s => s.verified).length + creators.filter(c => c.verified).length;
  const total = sources.length + creators.length;
  console.log(`Fact-checked (verified:true): ${verified}/${total} ${verified >= 1 ? 'PASS' : 'warn — nothing fact-checked yet'}`);
  if (verified < 1) warn++;

  // Flag creators that cover only the region, not the city — must be labelled.
  creators.filter(c => c.scope === 'region').forEach(c =>
    console.log(`  note: creator "${c.name}" is region-scope — label it honestly on the page.`));

  console.log(line);
  if (fail) { console.log(`>>> ${fail} REQUIRED gap(s), ${warn} warning(s). Not ready to build.`); process.exit(1); }
  console.log(`>>> READY${warn ? ` (${warn} warning(s))` : ''}. Sources cover the required types.`);
}

function daysSince(dateStr) {
  if (!dateStr) return null;
  var then = new Date(dateStr + 'T00:00:00Z').getTime();
  if (isNaN(then)) return null;
  return Math.floor((Date.now() - then) / 86400000);
}

// MODE B — refresh a previously-published city (catch closures + new places).
function refresh(key) {
  const reg = loadRegistry();
  const city = reg.cities && reg.cities[key];
  if (!city) {
    console.error(`No city "${key}" in data/sources.json. Known: ${Object.keys(reg.cities || {}).join(', ') || '(none)'}`);
    process.exit(1);
  }
  const parts = String(city.name).split(',');
  const cityName = parts[0].trim();
  const st = (parts[1] || '').trim();
  const year = (process.env.RESEARCH_YEAR || '').trim() || String(new Date().getFullYear());
  const d = daysSince(city.lastUpdated);
  const line = '─'.repeat(72);

  console.log(`\nREFRESH PLAN — ${city.name} (${key})`);
  console.log(`last updated: ${city.lastUpdated || 'never'}${d != null ? ` (${d} days ago)` : ''}`);
  console.log(line);
  console.log('MODE B: re-verify what is published, catch closures, add what is new.');
  console.log('Order: re-verify → search closures → search new places → update page + bump lastUpdated.\n');

  console.log('A. RE-VERIFY the anchors already recorded (search each, confirm still open + hours)');
  const anchors = [];
  (city.sources || []).forEach(s => (s.covers || []).forEach(c => anchors.push(c)));
  if (anchors.length) anchors.slice(0, 30).forEach((a, i) => console.log(`  ${String(i + 1).padStart(2)}. ${a.split('(')[0].trim()} ${cityName} hours ${year}`));
  else console.log('  (no "covers" anchors recorded — walk the page entries and search each by name)');

  console.log('\nB. CLOSURE SWEEP (things that may have shut since last update)');
  [
    `"${cityName}" ${st} restaurant permanently closed ${year}`,
    `"${cityName}" ${st} museum OR attraction closed ${year}`,
    `${cityName} ${st} landmark closed OR demolished`
  ].forEach((q, i) => console.log(`  ${i + 1}. ${q}`));

  console.log('\nC. WHAT IS NEW (things that opened since last update)');
  [
    `new things to do in ${cityName} ${st} opened ${year}`,
    `new ${cityName} ${st} restaurants ${year}`,
    `${cityName} ${st} new museum OR park OR attraction ${year}`
  ].forEach((q, i) => console.log(`  ${i + 1}. ${q}`));

  console.log('\nD. APPLY (same fact-check bar as a build — coordinates AND status)');
  console.log('  • Confirm each change across ≥2 independent results (see docs/SOURCES.md).');
  console.log('  • Closed places STAY, flagged "— CLOSED" — never silently drop them.');
  console.log('  • For every place confirmed still open OR newly closed, update its registry entry:');
  console.log('      status / statusSource / statusChecked = today  (data/geocodes.json).');
  console.log('  • RE-VERIFY the coordinate of any place that moved/relocated, and of every new place —');
  console.log('    from the Google place pin (!3d!4d / daddr@), never the /@ viewport. Record source+date.');
  console.log('  • Add new, fact-checked places; mark their sources verified:true.');
  console.log('  • Append a refreshLog entry and set "lastUpdated" to today in data/sources.json.');
  console.log('  • Update the visible "Last verified <date>" stamp on the page.');
  console.log('\nE. GATE before publishing (all three must pass — same as a new city):');
  console.log(`  • node tools/research.js --validate    ${key}   (sources)`);
  console.log(`  • node tools/research.js --geocheck    ${key}   (every pin sourced; re-verify low/moved)`);
  console.log(`  • node tools/research.js --statuscheck ${key}   (every open/closed status sourced & current)\n`);

  (city.refreshLog || []).slice(-1).forEach(r =>
    console.log(`Most recent refresh (${r.date}):\n  - ` + (r.findings || []).join('\n  - ') + '\n'));
}

function list() {
  const reg = loadRegistry();
  const cities = reg.cities || {};
  console.log('\nCities in the registry (Mode B refresh keeps these current):');
  Object.entries(cities).forEach(([k, v]) => {
    const d = daysSince(v.lastUpdated);
    const age = v.lastUpdated ? `updated ${v.lastUpdated}${d != null ? ` (${d}d)` : ''}` : 'never updated';
    console.log(`  ${k.padEnd(22)} ${String(v.name).padEnd(20)} ${(v.sources || []).length} src · ${(v.creators || []).length} creators · ${age}`);
  });
  console.log(`\nReusable source types: ${(reg.sourceTypes || []).length}. National creators: ${(reg.nationalCreators || []).length}. See docs/SOURCES.md.\n`);
}

// Mode C — SEED-PLACE EXPANSION. The user names one or a few places to add to an
// existing city; we don't just drop them in — we look up CREDIBLE sources that refer
// to each, mine those sources for MORE visit-worthy places, fact-check, and re-rank.
// Same discipline as a build: sources first, then places, then verification.
function seed(place, key) {
  const line = '─'.repeat(72);
  if (!place || !key) {
    console.log('\nUsage: node research.js --seed "<Place name>" <city-key>');
    console.log('  e.g. node research.js --seed "Past Times Arcade" youngstown-oh');
    console.log('  Add several at once by repeating: --seed "A" --seed "B" <city-key> (run one at a time is fine too).\n');
    return;
  }
  const reg = loadRegistry();
  const c = (reg.cities || {})[key];
  const cityName = c ? c.name : key;
  const media = (loadMedia().cities || {})[key];
  console.log(`\nSEED-PLACE EXPANSION — add "${place}" to ${cityName}`);
  console.log(`registry key: ${key}`);
  console.log(line);
  console.log('PRINCIPLE: never add a bare name. Source it, mine the source for more, fact-check, re-rank.');
  console.log('BAR: only notable, visit-worthy, highly-reviewed or viral places. Publicly accessible.\n');

  console.log('1. CONFIRM & SOURCE THE SEED (find credible sources that refer to it)');
  [
    `${place} ${cityName}`,
    `${place} ${cityName} review OR hours OR address`,
    `${place} ${(c && c.name) || key} WFMJ OR WKBN OR local news`,
    `"${place}" things to do ${cityName}`,
    `${place} tripadvisor OR yelp ${cityName}`
  ].forEach((q, i) => console.log(`   ${i + 1}. ${q}`));
  console.log('   → Capture each credible source (URL + what it says). Confirm the place exists, is open,');
  console.log('     and note the address/coords. If it fails the bar, say so and stop — do not add it.');

  console.log('\n2. MINE THOSE SOURCES FOR MORE PLACES (reuse the same outlets)');
  console.log('   A source that ran a piece on the seed almost always ranks other places. Read its list;');
  console.log('   pull anything genuinely visit-worthy we are missing. Also sweep the local media:');
  if (media) {
    const groups = Object.keys(media).filter(g => Array.isArray(media[g]));
    console.log('   local outlets: run `node research.js --media ' + key + '` — ' + groups.join(', '));
  } else {
    console.log('   (no local-media entry yet — add ' + key + ' to data/local-media.json)');
  }
  console.log('   Plus the authoritative playbook: Tripadvisor / U.S. News / PlanetWare / a CVB "must-see".');

  console.log('\n3. FACT-CHECK each candidate (exists, open, address/hours right; flag closures, keep them).');
  console.log('4. RE-RANK within its region (tiers are graded inside a region; keep ≥1 tier-1 per region).');
  console.log('5. GEOCODE + STATUS each added place into data/geocodes.json (same hard bar as a build):');
  console.log('   • coordinate from the Google place pin (!3d!4d / daddr@), never the /@ viewport;');
  console.log('   • {status, statusSource, statusChecked} — verify open/closed, never from memory;');
  console.log('   • a permanently-closed seed is kept and flagged "— CLOSED", not silently dropped.');
  console.log('6. RECORD every reusable source in data/sources.json under cities["' + key + '"] (rank + verified),');
  console.log('   then rebuild the page and GATE before publishing:');
  console.log('     node research.js --validate ' + key + '   ·   --geocheck ' + key + '   ·   --statuscheck ' + key + '\n');
  console.log('Full write-up: docs/SOURCES.md → "Mode C — seed-place expansion".\n');
}

// ── entry ────────────────────────────────────────────────────────────────────
// --sourcecheck: enforce MULTIPLE SOURCES OF TRUTH. Every place needs >=2 CREDIBLE sources;
// Yelp/TripAdvisor/OpenTable are open-verification only and count as ZERO. Reads the city's
// normalized dataset (source arrays live there pre-build). HARD gate — the build drops any
// under-sourced place. Mirror of tools/sourcecheck.py.
function sourcecheck(key) {
  const line = '─'.repeat(72);
  const ds = DATASET_FOR[key];
  if (!key || !ds) {
    console.log('\nUsage: node research.js --sourcecheck <city-key>   (dataset-built cities: ' + Object.keys(DATASET_FOR).join(', ') + ')\n');
    return;
  }
  if (!fs.existsSync(ds)) { console.log('No dataset at ' + ds); return; }
  const OPEN_ONLY = new Set(['YELP', 'TRIPADVISOR', 'OPENTABLE', 'GOOGLE', 'GOOGLEMAPS']);
  // A lone institutional authority (Michelin / James Beard) is sufficient on its own; a lone
  // editorial source still needs a 2nd. Keep in sync with tools/sourcecheck.py + build-*.py.
  const ELITE_SOLO = new Set(['MICHELIN', 'MICHELIN_BIB', 'MICHELIN_STAR', 'MICHELIN_GREEN', 'JAMESBEARD', 'NPS']);
  const data = JSON.parse(fs.readFileSync(ds, 'utf8'));
  const recs = (data.P || []).concat(data.F || []);
  const credSet = r => new Set((r.s || []).map(t => t[0]).filter(k => !OPEN_ONLY.has(k)));
  const yelpOnly = [], single = [];
  let ok = 0, eliteSolo = 0;
  for (const r of recs) {
    const c = credSet(r);
    if (c.size >= 2) ok++;
    else if (c.size === 1 && [...c].some(k => ELITE_SOLO.has(k))) eliteSolo++;
    else if (c.size === 1) single.push(r.n);
    else yelpOnly.push(r.n);
  }
  ok += eliteSolo;
  console.log(`\nSOURCING AUDIT — ${key}  (multiple sources of truth)`);
  console.log(line);
  console.log(`places:                        ${recs.length}`);
  console.log(`  PASS (>=2 credible, or lone Michelin/JB): ${ok}  (${eliteSolo} on a lone authority)`);
  console.log(`  1 editorial source:          ${single.length}`);
  console.log(`  0 credible / Yelp-only:      ${yelpOnly.length}`);
  const pass = yelpOnly.length === 0 && single.length === 0;
  console.log('\n' + line);
  console.log(pass
    ? '>>> PASS — every place has >=2 credible sources of truth.'
    : `>>> FAIL — ${yelpOnly.length} Yelp-only + ${single.length} single-source place(s) need corroboration (the build drops them).`);
  console.log('');
  if (!pass) process.exitCode = 1;
}

// --buildcheck: catch a page built for the WRONG city. The map centre and every on-map label must
// fall within the bounding box of the city's OWN geocoded pins. This makes the "cloned another city's
// build and forgot to swap the coordinates" bug impossible to ship (build-<city>.py now DERIVES the
// centre/labels from the pins; this gate guards against any regression or hand-edit). See PIPELINE.md.
function buildcheck(key) {
  const line = '─'.repeat(72);
  const page = PAGE_FOR[key];
  if (!key || !page) {
    console.log('\nUsage: node research.js --buildcheck <city-key>   (' + Object.keys(PAGE_FOR).join(', ') + ')\n');
    return;
  }
  if (!fs.existsSync(page)) { console.log('No page built at ' + page); return; }
  const geo = (loadGeocodes().cities || {})[key] || {};
  const pts = Object.values(geo).filter(e => e && e.lat != null && e.lng != null).map(e => [e.lat, e.lng]);
  if (pts.length < 3) { console.log('Not enough geocoded pins to check ' + key); return; }
  const lats = pts.map(p => p[0]), lngs = pts.map(p => p[1]);
  const box = { minLat: Math.min(...lats), maxLat: Math.max(...lats), minLng: Math.min(...lngs), maxLng: Math.max(...lngs) };
  const MARGIN = 0.08; // ~9km grace outside the pin cloud
  const inBox = (la, lo) => la >= box.minLat - MARGIN && la <= box.maxLat + MARGIN &&
                            lo >= box.minLng - MARGIN && lo <= box.maxLng + MARGIN;
  const html = fs.readFileSync(page, 'utf8');
  console.log(`\nBUILD CHECK — ${key}  (map centre & labels vs the city's own pins)`);
  console.log(line);
  console.log(`pin bounds: lat ${box.minLat.toFixed(3)}..${box.maxLat.toFixed(3)} · lng ${box.minLng.toFixed(3)}..${box.maxLng.toFixed(3)}`);
  const fails = [];
  const cm = html.match(/setView\(\[\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]\s*,\s*(\d+)\s*\)/);
  if (!cm) fails.push('no setView() map centre found on the page');
  else {
    const [la, lo] = [parseFloat(cm[1]), parseFloat(cm[2])];
    const ok = inBox(la, lo);
    console.log(`map centre: ${la},${lo} (zoom ${cm[3]})  ${ok ? '✓ inside pin bounds' : '✗ OUTSIDE — wrong city?'}`);
    if (!ok) fails.push(`map centre ${la},${lo} is outside the pin bounds — likely a stale/cloned coordinate`);
  }
  const lm = html.match(/const LABELS=\[(.*?)\];/s);
  let labels = [];
  if (lm) for (const t of lm[1].matchAll(/\[\s*"((?:[^"\\]|\\.)*)"\s*,\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]/g))
    labels.push([t[1], parseFloat(t[2]), parseFloat(t[3])]);
  const strayLabels = labels.filter(l => !inBox(l[1], l[2]));
  console.log(`on-map labels: ${labels.length} · outside pin bounds: ${strayLabels.length}`);
  strayLabels.forEach(l => { console.log(`     ✗ "${l[0]}" at ${l[1]},${l[2]} — not this city`); fails.push(`label "${l[0]}" is outside the pin bounds`); });
  console.log('\n' + line);
  console.log(fails.length ? `>>> FAIL — ${fails.length} issue(s): the page's map geography does not match ${key}'s pins.`
                           : '>>> PASS — map centre and all labels sit within the city\'s own pins.');
  if (fails.length) { console.log('    build-<city>.py DERIVES centre+labels from the pins — rebuild; never hardcode another city\'s coords.'); process.exitCode = 1; }
  console.log('');
}

const argv = process.argv.slice(2);
if (argv[0] === '--buildcheck') buildcheck(argv[1]);
else if (argv[0] === '--validate') validate(argv[1]);
else if (argv[0] === '--refresh') refresh(argv[1]);
else if (argv[0] === '--media') media(argv[1]);
else if (argv[0] === '--seed') seed(argv[1], argv[2]);
else if (argv[0] === '--geocheck') geocheck(argv[1]);
else if (argv[0] === '--statuscheck') statuscheck(argv[1]);
else if (argv[0] === '--sourcecheck') sourcecheck(argv[1]);
else if (argv[0] === '--list') list();
else if (argv[0] && argv[0] !== '--help' && argv[0] !== '-h') plan(argv[0], argv[1]);
else {
  console.log('Three modes:');
  console.log('  A · CREATE a new city');
  console.log('    node research.js "<City>" "<ST>"          print the research plan for a new city');
  console.log('  B · REFRESH a published city (catch closures / new places)');
  console.log('    node research.js --refresh <city-key>     print the re-verification plan');
  console.log('  C · SEED-PLACE expansion (you name a place; source it, mine for more, fact-check)');
  console.log('    node research.js --seed "<Place>" <city-key>   print the seed-expansion plan');
  console.log('  Shared');
  console.log('    node research.js --validate <city-key>    audit a city\'s sources before publishing');
  console.log('    node research.js --geocheck <city-key>    audit that every place has a verified geocode');
  console.log('    node research.js --statuscheck <city-key> audit that every place\'s open/closed status is verified');
  console.log('    node research.js --sourcecheck <city-key> audit that every place has >=2 credible sources (Yelp counts as 0)');
  console.log('    node research.js --media <city-key>       list a city\'s local news outlets & TV channels');
  console.log('    node research.js --list                   list cities + when each was last updated');
}
