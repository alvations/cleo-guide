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
  const year = (process.env.RESEARCH_YEAR || '').trim() || 'the current year';
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

function list() {
  const reg = loadRegistry();
  const cities = reg.cities || {};
  console.log('\nCities in the registry:');
  Object.entries(cities).forEach(([k, v]) =>
    console.log(`  ${k.padEnd(22)} ${v.name}  —  ${(v.sources || []).length} sources, ${(v.creators || []).length} creators`));
  console.log(`\nReusable source types: ${(reg.sourceTypes || []).length}. See docs/SOURCES.md.\n`);
}

// ── entry ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
if (argv[0] === '--validate') validate(argv[1]);
else if (argv[0] === '--list') list();
else if (argv[0] && argv[0] !== '--help' && argv[0] !== '-h') plan(argv[0], argv[1]);
else {
  console.log('Usage:');
  console.log('  node research.js "<City>" "<ST>"        print the research plan for a city');
  console.log('  node research.js --validate <city-key>  audit a city\'s sources in data/sources.json');
  console.log('  node research.js --list                 list cities already in the registry');
}
