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
 *   node research.js "Youngstown" "OH"          # print the research plan
 *   node research.js --validate youngstown-oh   # audit coverage in data/sources.json
 *   node research.js --list                     # list cities already in the registry
 *
 * The pipeline order is deliberate and must not be reordered:
 *   search → rank → FACT-CHECK the ranked winners → only then build the page.
 */
const fs = require('fs');
const path = require('path');

const REG_PATH = path.join(__dirname, '..', 'data', 'sources.json');

function loadRegistry() {
  try { return JSON.parse(fs.readFileSync(REG_PATH, 'utf8')); }
  catch (e) { console.error('Could not read data/sources.json:', e.message); process.exit(1); }
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
    `best things to do in ${city} ${st} travel blog ${year}`
  ];
  discovery.forEach((q, i) => console.log(`  ${String(i + 1).padStart(2)}. ${q}`));

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

  console.log('\nD. APPLY (same fact-check bar as a build)');
  console.log('  • Confirm each change across ≥2 independent results (see docs/SOURCES.md).');
  console.log('  • Closed places STAY, flagged — never silently drop them.');
  console.log('  • Add new, fact-checked places; mark their sources verified:true.');
  console.log('  • Append a refreshLog entry and set "lastUpdated" to today in data/sources.json.');
  console.log('  • Update the visible "Last verified <date>" stamp on the page.');
  console.log(`  • Re-run:  node tools/research.js --validate ${key}\n`);

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

// ── entry ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
if (argv[0] === '--validate') validate(argv[1]);
else if (argv[0] === '--refresh') refresh(argv[1]);
else if (argv[0] === '--list') list();
else if (argv[0] && argv[0] !== '--help' && argv[0] !== '-h') plan(argv[0], argv[1]);
else {
  console.log('Two modes:');
  console.log('  A · CREATE a new city');
  console.log('    node research.js "<City>" "<ST>"        print the research plan for a new city');
  console.log('  B · REFRESH a published city (catch closures / new places)');
  console.log('    node research.js --refresh <city-key>   print the re-verification plan');
  console.log('  Shared');
  console.log('    node research.js --validate <city-key>  audit a city\'s sources before publishing');
  console.log('    node research.js --list                 list cities + when each was last updated');
}
