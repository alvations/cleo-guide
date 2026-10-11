#!/usr/bin/env node
'use strict';
/**
 * location-verify.js — PROPOSE coordinate / address / open-closed corrections for one city from open, key-free
 * sources, as a REPORT for a person to review. The design and policy study is docs/LOCATION-VERIFY-ACTIONS.md.
 *
 * It runs where the sources are reachable: a GitHub-hosted runner (.github/workflows/location-verify.yml). In the
 * authoring sandbox those hosts are blocked by the org egress policy; the script then writes an OFFLINE PLAN report
 * (what it would query) and exits 0. Never through a proxy, mirror or other workaround.
 *
 *   node tools/location-verify.js --city wheeling-wv                       # report → docs/geoverify/wheeling-wv.{json,md}
 *   node tools/location-verify.js --city wheeling-wv --scope unverified,low --limit 20
 *   node tools/location-verify.js --city wheeling-wv --fixtures f.json     # replay recorded responses (tests)
 *   node tools/location-verify.js --backlog                                # per-city backlog table (no network)
 *   node tools/location-verify.js --accept docs/geoverify/wheeling-wv.json # LOCAL ONLY: apply reviewer-accepted rows
 *
 * THE RUNNER ONLY PROPOSES. Report mode never writes data/geocodes.json; --accept refuses to run on CI.
 *   Rule 4a  every proposal carries sourceUrl, retrieved date, matched name + address, distance from the current pin,
 *            a confidence grade and the source licence. Nothing is filled from memory or estimated: no source, no row.
 *   Rule 4b  coordinates come from place objects (Wikidata P625, Wikipedia primary {{coord}}, an OSM object, the
 *            official site's schema.org geo), never a map viewport. Grades high/med/low as in docs/SOURCES.md.
 *   Rule 4c  closures are only ever proposed as `status-needs-check` with evidence (Wikidata P576/P3999, OSM lifecycle
 *            prefixes disused:/was:/abandoned:/closed:/demolished:, a closure notice on the official site). An HTTP
 *            error or 404 on the official site is NEVER closure evidence.
 *
 * Options
 *   --city <key>          city key in data/geocodes.json (required for report mode)
 *   --scope <list>        which rows to check: unverified, low, med, high, status, all (default unverified,low,status)
 *   --limit <n>           at most n rows this run (default all in scope)
 *   --sources <list>      wikidata, wikipedia, nominatim, overpass, official (default all five)
 *   --nominatim-max <n>   Nominatim requests this run (default 300; policy: ≤ 1/s, cached, single thread)
 *   --max-requests <n>    total network requests this run (default 3000); stops cleanly, a rerun resumes from cache
 *   --out <dir>           report directory (default docs/geoverify)
 *   --cache <dir>         response cache (default ~/.cache/cleo-location-verify; LV_CACHE_DIR overrides)
 *   --cache-ttl-days <n>  reuse cached responses younger than this (default 30)
 *   --fixtures <file>     replay responses from a JSON fixture file instead of the network (no network at all)
 *   --offline             force the offline plan report
 *   --today <YYYY-MM-DD>  date stamp (tests)
 *
 * Exit codes: 0 report written (or offline plan); 1 bad option/input; 4 a source failed hard (report still written).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const GEOCODES = path.join(ROOT, 'data', 'geocodes.json');
const VERSION = '0.1.0';
const UA_TOKEN = 'CleoGuideLocationVerify';
const UA = `${UA_TOKEN}/${VERSION} (https://github.com/alvations/cleo-guide; location-verify proposals, reviewed by a person) node`;

const ENDPOINT = {
  wikidata: 'https://www.wikidata.org/w/api.php',
  wikipedia: 'https://en.wikipedia.org/w/api.php',
  nominatim: 'https://nominatim.openstreetmap.org/search',
  overpass: 'https://overpass-api.de/api/interpreter',
};
const LICENCE = {
  wikidata: 'CC0-1.0 (Wikidata structured data)',
  wikipedia: 'Wikipedia {{coord}} via GeoData API (article text CC BY-SA 4.0; credit the article)',
  osm: 'ODbL-1.0 — © OpenStreetMap contributors',
  official: "the place's own website (fact read from its schema.org markup / page; robots.txt honoured)",
};
// Per-host minimum spacing between requests (ms). Every source is queried single-threaded.
const SPACING = { 'nominatim.openstreetmap.org': 1100, 'overpass-api.de': 5000, 'www.wikidata.org': 300, 'en.wikipedia.org': 300, default: 2000 };

// ───────────────────────────────────────────────────────── pure helpers (unit-tested) ──

function stripDiacritics(s) { return String(s).normalize('NFKD').replace(/[̀-ͯ]/g, ''); }

/** Name normalisation for matching: drop the CLOSED marker, parentheticals, "the", punctuation; & → and. */
function normName(s) {
  return stripDiacritics(String(s || ''))
    .replace(/\s+[—–-]\s*CLOSED\b.*$/i, '')
    .replace(/\([^)]*\)/g, ' ')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9぀-ヿ一-鿿]+/g, ' ')
    .replace(/\b(the|a|an)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function bigrams(s) { const t = s.replace(/ /g, ''); const out = []; for (let i = 0; i < t.length - 1; i++) out.push(t.slice(i, i + 2)); return out; }

/** Name similarity in [0,1]: max of token-set overlap (containment-aware) and bigram Dice. */
function nameSim(a, b) {
  const x = normName(a), y = normName(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  const tx = new Set(x.split(' ')), ty = new Set(y.split(' '));
  let inter = 0; tx.forEach(t => { if (ty.has(t)) inter++; });
  const jacc = inter / (tx.size + ty.size - inter);
  const contain = inter / Math.min(tx.size, ty.size); // "Coleman's Fish Market" vs "Coleman's"
  const tokenScore = Math.max(jacc, 0.9 * contain * (Math.min(tx.size, ty.size) >= 1 ? 1 : 0));
  const bx = bigrams(x), by = bigrams(y);
  const pool = new Map(); by.forEach(g => pool.set(g, (pool.get(g) || 0) + 1));
  let hits = 0; bx.forEach(g => { const n = pool.get(g); if (n) { hits++; pool.set(g, n - 1); } });
  const dice = bx.length + by.length ? (2 * hits) / (bx.length + by.length) : 0;
  return Math.round(Math.max(tokenScore, dice) * 1000) / 1000;
}

function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371008.8, r = d => (d * Math.PI) / 180;
  const dLat = r(lat2 - lat1), dLng = r(lng2 - lng1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

const STREET_ABBR = { street: 'st', avenue: 'ave', road: 'rd', drive: 'dr', boulevard: 'blvd', lane: 'ln', place: 'pl', court: 'ct', highway: 'hwy', north: 'n', south: 's', east: 'e', west: 'w', parkway: 'pkwy', square: 'sq', terrace: 'ter' };
/** Parse the parts of a free-text address that matter for matching. */
function parseAddress(s) {
  const t = stripDiacritics(String(s || '')).replace(/\([^)]*\)/g, ' ');
  const first = t.split(',')[0] || '';
  const hn = (first.match(/^\s*(\d+[a-z]?)\b/i) || [])[1] || null;
  const street = first.replace(/^\s*\d+[a-z]?\s+/i, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/)
    .filter(Boolean).map(w => STREET_ABBR[w] || w).join(' ') || null;
  const pc = (t.match(/\b(\d{5})(?:-\d{4})?\b(?!.*\b\d{5}\b)/) || t.match(/\b(\d{3}-\d{4}|\d{4}|\d{6})\b(?!.*\d)/) || [])[1] || null;
  return { houseNumber: hn ? hn.toLowerCase() : null, street, postcode: pc };
}

/** Compare a registry address with a candidate's address parts. */
function addrAgreement(regAddr, cand) {
  const a = parseAddress(regAddr);
  const b = { houseNumber: cand.houseNumber ? String(cand.houseNumber).toLowerCase() : null,
    street: cand.street ? parseAddress('1 ' + cand.street).street : null, postcode: cand.postcode || null };
  const out = { houseNumber: null, street: null, postcode: null };
  if (a.houseNumber && b.houseNumber) out.houseNumber = a.houseNumber === b.houseNumber;
  if (a.street && b.street) { const sa = new Set(a.street.split(' ')); const sb = b.street.split(' ');
    const core = sb.filter(w => !/^(st|ave|rd|dr|blvd|ln|pl|ct|hwy|n|s|e|w|pkwy|sq|ter)$/.test(w));
    out.street = core.length ? core.every(w => sa.has(w)) : null; }
  if (a.postcode && b.postcode) out.postcode = String(a.postcode).slice(0, 5) === String(b.postcode).slice(0, 5);
  return out;
}

const EXTENDED = /\b(park|parks|trail|trails|district|woods|forest|island|bridge|viaduct|river|lake|beach|garden|gardens|reserve|preserve|fairgrounds|campus|zoo|market district|state park|national park|square|alley|neighbou?rhood|village|valley|canal|harbou?r|port|wilds)\b/i;
/** Parks, trails, districts and bridges are pinned to an entrance / most-visited point, so a centroid differs. */
function isExtended(name) { return EXTENDED.test(normName(name)); }

const GRADE_RANK = { none: 0, low: 1, med: 2, high: 3 };

/**
 * Grade one candidate coordinate. kind: wikidata | wikipedia | official | osm-poi | osm-address | osm-other.
 * Returns { grade, why[] }. high = a published place coordinate (Wikidata/Wikipedia/official schema.org) or an OSM
 * place object whose name AND house number/street agree; med = an OSM place object by name only, or the exact
 * address point; low = everything else (reported, never proposed).
 */
function gradeCandidate(c, place) {
  const why = [];
  const sim = nameSim(place.name, c.name || '');
  const ag = addrAgreement(place.address, c);
  c.nameSim = sim; c.addr = ag;
  let grade = 'low';
  if (c.kind === 'wikidata' || c.kind === 'wikipedia' || c.kind === 'official') {
    if (sim >= 0.8 || c.kind === 'official' || c.linked) { grade = 'high'; why.push(`${c.kind} published coordinate`); }
    else why.push(`${c.kind} name similarity ${sim} < 0.8`);
  } else if (c.kind === 'osm-poi') {
    if (sim >= 0.85 && (ag.houseNumber === true || (ag.houseNumber === null && ag.street === true))) { grade = 'high'; why.push('OSM place object, name + address agree'); }
    else if (sim >= 0.85) { grade = 'med'; why.push('OSM place object, name agrees, address not corroborated'); }
    else why.push(`OSM object name similarity ${sim} < 0.85`);
  } else if (c.kind === 'osm-address' && /^(highway|route|boundary|landuse|place=(?!house|address))/.test(c.osmClass || '')) {
    why.push(`street/area-level OSM object (${c.osmClass}), not an address point`);
  } else if (c.kind === 'osm-address') {
    if (ag.houseNumber === true && ag.street !== false) { grade = 'med'; why.push('exact address point (the building, not a named place)'); }
    else why.push('address point without a house-number match');
  } else why.push(`not a place object (${c.osmClass || c.kind})`);
  if (ag.houseNumber === false && grade !== 'low' && !(c.kind === 'wikidata' || c.kind === 'wikipedia')) { grade = 'low'; why.push('house number disagrees'); }
  if (ag.postcode === false && grade !== 'low') { grade = grade === 'high' ? 'med' : 'low'; why.push('postcode disagrees'); }
  return { grade, why };
}

/**
 * Decide what to propose for one row from its graded candidates (each with lat,lng,grade). Pure.
 * Returns { outcome, proposal|null, notes[] }.
 *   pin       registry has no coordinate; best candidate ≥ med
 *   confirm   ≤ 30 m from the current pin (refresh source / date; upgrade confidence if the grade is higher)
 *   move      30–250 m away, grade ≥ the current confidence (the classic viewport-vs-place-pin error)
 *   conflict  > 250 m (extended features: > 1500 m) away — a person must look; never applied blindly
 *   ambiguous two ≥ med candidates with matching names more than 150 m apart — nothing proposed
 *   no-match  nothing ≥ med
 */
function decide(place, graded) {
  const notes = [];
  const good = graded.filter(c => GRADE_RANK[c.grade] >= 2);
  if (!good.length) return { outcome: 'no-match', proposal: null, notes };
  const pref = { official: 5, wikidata: 4, wikipedia: 3, 'osm-poi': 2, 'osm-address': 1 };
  good.sort((a, b) => GRADE_RANK[b.grade] - GRADE_RANK[a.grade] || (pref[b.kind] || 0) - (pref[a.kind] || 0) || b.nameSim - a.nameSim);
  const best = good[0];
  const ext = isExtended(place.name);
  const spread = ext ? 1500 : 150;
  const rivals = good.filter(c => c !== best && c.nameSim >= 0.85 && haversineM(c.lat, c.lng, best.lat, best.lng) > spread);
  if (rivals.length && !(GRADE_RANK[best.grade] > GRADE_RANK[rivals[0].grade])) {
    notes.push(`candidates disagree by ${haversineM(rivals[0].lat, rivals[0].lng, best.lat, best.lng)} m`);
    return { outcome: 'ambiguous', proposal: null, notes };
  }
  // Independent agreement: a med candidate corroborated within 40 m by another source becomes high.
  let grade = best.grade;
  const agree = good.filter(c => c !== best && c.source !== best.source && haversineM(c.lat, c.lng, best.lat, best.lng) <= 40);
  if (grade === 'med' && agree.length) { grade = 'high'; notes.push(`corroborated within 40 m by ${agree.map(c => c.kind).join(', ')}`); }
  const proposal = { kind: best.kind, lat: round5(best.lat), lng: round5(best.lng), address: best.address || null,
    matchedName: best.name || null, sourceUrl: best.sourceUrl, retrieved: best.retrieved, licence: best.licence,
    grade, gradeWhy: best.why, nameSim: best.nameSim, addressAgreement: best.addr, distanceM: null,
    osmObject: best.osm ? osmEvidence(best) : null,
    corroboratedBy: agree.map(c => ({ kind: c.kind, sourceUrl: c.sourceUrl, distanceM: haversineM(c.lat, c.lng, best.lat, best.lng) })) };
  const cur = place.current;
  if (cur.lat == null || cur.lng == null) return { outcome: 'pin', proposal, notes };
  const d = haversineM(cur.lat, cur.lng, best.lat, best.lng);
  proposal.distanceM = d;
  const curRank = GRADE_RANK[(cur.confidence || '').toLowerCase()] || 0;
  if (d <= 30) return { outcome: 'confirm', proposal, notes: notes.concat(GRADE_RANK[grade] > curRank ? [`upgrade confidence ${cur.confidence} → ${grade}`] : []) };
  if (ext) {
    if (d > 1500) return { outcome: 'conflict', proposal, notes: notes.concat(['extended feature: centroid vs entrance pin, but > 1.5 km apart']) };
    return { outcome: 'confirm', proposal, notes: notes.concat([`extended feature: ${d} m between centroid and the pinned entrance/point is expected; no move proposed`]) };
  }
  if (d > 250) return { outcome: 'conflict', proposal, notes };
  if (GRADE_RANK[grade] >= curRank) return { outcome: 'move', proposal, notes };
  return { outcome: 'confirm', proposal: null, notes: notes.concat([`a ${grade} candidate ${d} m away does not outrank the current ${cur.confidence} pin`]) };
}

/** What the reviewer needs to see about a matched OSM object: id, class=type, addresstype, address and a few tags. */
function osmEvidence(c) {
  const t = c.tags || {};
  const keep = Object.keys(t).filter(k => /^(building|addr:|highway|shop|amenity|tourism|website|opening_hours|check_date)/.test(k)).slice(0, 8);
  return { id: c.osm, class: c.osmClass || null, addresstype: c.addresstype || null, name: c.name || '',
    address: c.address || null, houseNumber: c.houseNumber || null, tags: Object.fromEntries(keep.map(k => [k, t[k]])) };
}

/**
 * Two rows of one city that resolve to the SAME OSM object cannot both be right (two places on one street, or one
 * building mistaken for two places): both proposals drop to low with a note. Mutates and returns the rows.
 */
function demoteSharedObjects(rows) {
  const by = new Map();
  for (const r of rows) if (r.proposal && r.proposal.osmObject && r.proposal.osmObject.id) {
    const k = r.proposal.osmObject.id; if (!by.has(k)) by.set(k, []); by.get(k).push(r);
  }
  for (const [id, rs] of by) if (rs.length > 1) for (const r of rs) {
    r.proposal.grade = 'low';
    r.outcome = 'shared-object';
    (r.notes = r.notes || []).push(`shared object: OSM ${id} also matched ${rs.filter(x => x !== r).map(x => x.name).join(', ')}; graded low`);
  }
  return rows;
}

const LIFECYCLE = /^(disused|was|abandoned|closed|demolished|removed|razed|destroyed):/;
/** Closure evidence carried by OSM tags (lifecycle prefixes, shop=vacant). Returns [{type, detail}]. */
function osmClosureEvidence(tags) {
  const ev = [];
  for (const [k, v] of Object.entries(tags || {})) {
    if (LIFECYCLE.test(k) && !/^(was|old):?name/.test(k)) ev.push({ type: 'osm-lifecycle', detail: `${k}=${v}` });
    if (k === 'shop' && v === 'vacant') ev.push({ type: 'osm-vacant', detail: 'shop=vacant' });
    if (k === 'opening_hours' && /^\s*closed\s*$/i.test(v)) ev.push({ type: 'osm-hours-closed', detail: 'opening_hours=closed' });
  }
  return ev;
}

const CLOSURE_TEXT = /(permanently closed|closed permanently|(?:have|has|'ve) (?:now )?closed (?:our|its|their) doors|we (?:have|'ve) closed for good|closed for good|is now (?:permanently )?closed|ceased (?:trading|operations)|final day of (?:service|business))/i;
/** Closure notice in a page's visible text (scripts/styles removed). Returns the matched phrase in context or null. */
function siteClosureNotice(html) {
  const text = String(html || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  const m = text.match(CLOSURE_TEXT);
  if (!m) return null;
  const i = m.index;
  return text.slice(Math.max(0, i - 60), Math.min(text.length, i + m[0].length + 60)).trim();
}

/** schema.org geo / address from JSON-LD blocks. Returns [{lat,lng,address,name,openingHours}]. */
function parseJsonLd(html) {
  const out = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  const walk = o => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach(walk); return; }
    const geo = o.geo && (Array.isArray(o.geo) ? o.geo[0] : o.geo);
    const ad = o.address && (Array.isArray(o.address) ? o.address[0] : o.address);
    if (geo || (ad && typeof ad === 'object')) {
      const lat = geo ? parseFloat(geo.latitude) : NaN, lng = geo ? parseFloat(geo.longitude) : NaN;
      const address = ad && typeof ad === 'object'
        ? [ad.streetAddress, ad.addressLocality, [ad.addressRegion, ad.postalCode].filter(Boolean).join(' ')].filter(Boolean).join(', ')
        : (typeof ad === 'string' ? ad : null);
      out.push({ lat: isFinite(lat) ? lat : null, lng: isFinite(lng) ? lng : null, address, name: o.name || null,
        postcode: ad && ad.postalCode ? String(ad.postalCode) : null, openingHours: o.openingHours || o.openingHoursSpecification || null });
    }
    Object.values(o).forEach(v => { if (v && typeof v === 'object') walk(v); });
  };
  while ((m = re.exec(html))) { try { walk(JSON.parse(m[1].trim())); } catch (_) { /* malformed block: skip */ } }
  return out;
}

/** RFC 9309 robots.txt check for our token (falls back to *). Longest match wins; Allow wins a tie. */
function robotsAllows(robotsTxt, urlPath, token = UA_TOKEN) {
  const groups = []; let cur = null, lastWasAgent = false;
  for (const raw of String(robotsTxt || '').split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim(); if (!line) continue;
    const i = line.indexOf(':'); if (i < 0) continue;
    const k = line.slice(0, i).trim().toLowerCase(), v = line.slice(i + 1).trim();
    if (k === 'user-agent') { if (!lastWasAgent) { cur = { agents: [], rules: [] }; groups.push(cur); } cur.agents.push(v.toLowerCase()); lastWasAgent = true; }
    else { lastWasAgent = false; if (cur && (k === 'allow' || k === 'disallow')) cur.rules.push({ allow: k === 'allow', p: v }); }
  }
  const mine = groups.filter(g => g.agents.some(a => a !== '*' && token.toLowerCase().startsWith(a)));
  const rules = (mine.length ? mine : groups.filter(g => g.agents.includes('*'))).flatMap(g => g.rules);
  let best = null;
  for (const r of rules) {
    if (!r.p) continue; // "Disallow:" (empty) allows everything
    const rx = new RegExp('^' + r.p.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$'));
    if (rx.test(urlPath) && (!best || r.p.length > best.p.length || (r.p.length === best.p.length && r.allow))) best = r;
  }
  return !best || best.allow;
}

/** Wikidata claim helpers. */
function claimValues(entity, pid) {
  const cl = ((entity && entity.claims) || {})[pid] || [];
  const pref = cl.filter(c => c.rank === 'preferred');
  return (pref.length ? pref : cl.filter(c => c.rank !== 'deprecated')).map(c => c.mainsnak)
    .filter(s => s && s.snaktype === 'value' && s.datavalue).map(s => s.datavalue.value);
}
function wikidataFacts(entity) {
  const coord = claimValues(entity, 'P625')[0];
  const t = v => (v && v.time ? v.time.replace(/^\+/, '').slice(0, 10).replace(/-00/g, '') : null);
  return {
    qid: entity.id,
    label: (entity.labels && (entity.labels.en || Object.values(entity.labels)[0]) || {}).value || null,
    lat: coord ? coord.latitude : null, lng: coord ? coord.longitude : null,
    website: claimValues(entity, 'P856')[0] || null,
    street: (claimValues(entity, 'P6375')[0] || {}).text || null,
    postcode: claimValues(entity, 'P281')[0] || null,
    dissolved: t(claimValues(entity, 'P576')[0]),
    closed: t(claimValues(entity, 'P3999')[0]),
    stateOfUse: claimValues(entity, 'P5817').map(v => v.id),
    enwiki: entity.sitelinks && entity.sitelinks.enwiki ? entity.sitelinks.enwiki.title : null,
  };
}

/** Where the city is: median of its high-confidence pins + a radius that covers them (regions are wide). */
function cityAnchor(entries) {
  const pts = Object.values(entries).filter(e => e && e.lat != null && e.lng != null && String(e.confidence).toLowerCase() === 'high');
  const use = pts.length ? pts : Object.values(entries).filter(e => e && e.lat != null && e.lng != null);
  if (!use.length) return null;
  const med = a => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  const lat = med(use.map(e => e.lat)), lng = med(use.map(e => e.lng));
  const d = use.map(e => haversineM(lat, lng, e.lat, e.lng)).sort((x, y) => x - y);
  const p95 = d[Math.min(d.length - 1, Math.floor(d.length * 0.95))] || 0;
  return { lat, lng, radiusM: Math.min(150000, Math.max(25000, Math.round(p95 * 1.5))) };
}

function isUnverified(e) { return !e || e.lat == null || e.lng == null || String(e.source || '').toUpperCase() === 'UNVERIFIED'; }
function statusUnchecked(e) { return !e || !['open', 'closed'].includes(e.status) || !String(e.statusSource || '').trim(); }

/** Why a row is in scope (empty = out of scope). */
function scopeReasons(e, scope) {
  const r = [], all = scope.includes('all');
  const conf = String((e && e.confidence) || '').toLowerCase();
  if ((all || scope.includes('unverified')) && isUnverified(e)) r.push('unverified');
  if (!isUnverified(e)) {
    if ((all || scope.includes('low')) && conf === 'low') r.push('low');
    if ((all || scope.includes('med')) && conf === 'med') r.push('med');
    if ((all || scope.includes('high')) && conf === 'high') r.push('high');
  }
  if ((all || scope.includes('status')) && statusUnchecked(e)) r.push('status');
  return r;
}

/** Backlog per city, straight from data/geocodes.json. */
function backlog(cities, today) {
  const rows = [];
  for (const [key, entries] of Object.entries(cities).sort()) {
    const v = Object.values(entries);
    const conf = c => v.filter(e => !isUnverified(e) && String(e.confidence).toLowerCase() === c).length;
    const stale = v.filter(e => e.statusChecked && daysBetween(e.statusChecked, today) > 180).length;
    rows.push({ city: key, entries: v.length, unverified: v.filter(isUnverified).length, low: conf('low'), med: conf('med'), high: conf('high'),
      statusUnchecked: v.filter(statusUnchecked).length, closed: v.filter(e => e.status === 'closed').length, statusStale180: stale });
  }
  return rows;
}
function daysBetween(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 86400000); }
function round5(x) { return Math.round(x * 1e5) / 1e5; }

// ───────────────────────────────────────────────────────── HTTP: cache, pacing, fixtures ──

class Http {
  constructor(o) {
    this.fixtures = o.fixtures || null; this.cacheDir = o.cacheDir; this.ttl = (o.ttlDays || 30) * 86400000;
    this.max = o.maxRequests || 3000; this.nomMax = o.nominatimMax == null ? 300 : o.nominatimMax;
    this.count = 0; this.nomCount = 0; this.cacheHits = 0; this.last = {}; this.today = o.today;
    this.failures = []; this.backoffUntil = {};
    if (this.cacheDir && !this.fixtures) fs.mkdirSync(this.cacheDir, { recursive: true });
  }
  key(method, url, body) { return crypto.createHash('sha1').update(`${method} ${url}\n${body || ''}`).digest('hex'); }
  async request(url, { method = 'GET', body = null, accept = 'application/json', host } = {}) {
    const h = host || new URL(url).host;
    if (this.fixtures) {
      const f = matchFixture(this.fixtures, method, url, body);
      this.count++; if (h === 'nominatim.openstreetmap.org') this.nomCount++;
      if (!f) return { status: 599, body: '', retrieved: this.today, error: 'not in fixtures' };
      return { status: f.status || 200, body: typeof f.body === 'string' ? f.body : JSON.stringify(f.body), retrieved: f.retrieved || this.today };
    }
    const k = this.key(method, url, body), file = this.cacheDir && path.join(this.cacheDir, k + '.json');
    if (file && fs.existsSync(file)) {
      try { const c = JSON.parse(fs.readFileSync(file, 'utf8')); if (Date.now() - Date.parse(c.retrieved) < this.ttl) { this.cacheHits++; return c; } } catch (_) { /* refetch */ }
    }
    if (this.count >= this.max) return { status: 0, body: '', error: 'request budget exhausted', budget: true };
    if (h === 'nominatim.openstreetmap.org' && this.nomCount >= this.nomMax) return { status: 0, body: '', error: 'nominatim budget exhausted', budget: true };
    if (this.backoffUntil[h] && Date.now() < this.backoffUntil[h]) return { status: 0, body: '', error: `${h} backing off after 429/503` };
    const gap = SPACING[h] || SPACING.default, wait = (this.last[h] || 0) + gap - Date.now();
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    this.count++; if (h === 'nominatim.openstreetmap.org') this.nomCount++;
    this.last[h] = Date.now();
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 30000);
    try {
      const r = await fetch(url, { method, body, signal: ctl.signal, redirect: 'follow',
        headers: Object.assign({ 'User-Agent': UA, 'Api-User-Agent': UA, Accept: accept }, body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}) });
      let text = await r.text(); if (text.length > 2000000) text = text.slice(0, 2000000);
      const res = { url, status: r.status, body: text, retrieved: new Date().toISOString().slice(0, 10) };
      if (r.status === 429 || r.status === 503 || r.status === 504) {
        this.backoffUntil[h] = Date.now() + (h === 'overpass-api.de' ? 60000 : 30000); this.failures.push(`${h} HTTP ${r.status}`);
        return res; // not cached
      }
      if (file && (r.ok || r.status === 404)) fs.writeFileSync(file, JSON.stringify(res));
      return res;
    } catch (e) {
      this.failures.push(`${h} ${e.name === 'AbortError' ? 'timeout' : (e.cause && e.cause.code) || e.message}`);
      return { status: 0, body: '', error: (e.cause && e.cause.code) || e.message };
    } finally { clearTimeout(t); }
  }
  async json(url, o) { const r = await this.request(url, o); let j = null; if (r.status >= 200 && r.status < 300) { try { j = JSON.parse(r.body); } catch (_) { /* not json */ } } return { ...r, json: j }; }
}

/**
 * Fixtures: either an object keyed "METHOD URL[ body]", or an array of matchers
 * { method?, host, path?, params?: {k: v}, bodyIncludes?, status?, body, retrieved? } — the first whose every given
 * field matches wins (params compared as strings against the URL query, or the form body for POST).
 */
function matchFixture(fx, method, url, body) {
  if (!Array.isArray(fx)) return fx[`${method} ${url}${body ? ' ' + body : ''}`] || null;
  const u = new URL(url);
  const q = new URLSearchParams(method === 'POST' && body ? body : u.search);
  return fx.find(f => (!f.method || f.method === method) && (!f.host || f.host === u.host) && (!f.path || f.path === u.pathname)
    && (!f.params || Object.entries(f.params).every(([k, v]) => q.get(k) === String(v)))
    && (!f.bodyIncludes || String(q.get('data') || body || '').includes(f.bodyIncludes))) || null;
}

const qs = o => Object.entries(o).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');

// ───────────────────────────────────────────────────────── source adapters ──

async function fromWikidata(http, place, anchor) {
  const cands = [], evidence = [];
  const qidInSource = (String(place.current.source || '').match(/\bQ\d{2,}\b/) || [])[0];
  let ids = qidInSource ? [qidInSource] : [];
  const linked = !!qidInSource;
  if (!ids.length) {
    const s = await http.json(`${ENDPOINT.wikidata}?${qs({ action: 'wbsearchentities', search: place.name.replace(/\s+[—–-]\s*CLOSED.*$/i, '').replace(/\([^)]*\)/g, '').trim(), language: 'en', uselang: 'en', type: 'item', limit: 5, format: 'json', maxlag: 5 })}`);
    ids = ((s.json && s.json.search) || []).map(x => x.id);
  }
  if (!ids.length) return { cands, evidence, website: null, enwiki: null };
  const g = await http.json(`${ENDPOINT.wikidata}?${qs({ action: 'wbgetentities', ids: ids.join('|'), props: 'claims|labels|sitelinks', languages: 'en', sitefilter: 'enwiki', format: 'json', maxlag: 5 })}`);
  let website = null, enwiki = null;
  for (const id of ids) {
    const ent = g.json && g.json.entities && g.json.entities[id]; if (!ent || ent.missing !== undefined) continue;
    const f = wikidataFacts(ent);
    if (f.lat == null) continue;
    if (anchor && haversineM(anchor.lat, anchor.lng, f.lat, f.lng) > anchor.radiusM) continue; // same name, elsewhere
    if (!linked && nameSim(place.name, f.label || '') < 0.8) continue;
    const url = `https://www.wikidata.org/wiki/${f.qid}`;
    cands.push({ kind: 'wikidata', source: 'wikidata', name: f.label, lat: f.lat, lng: f.lng, street: f.street, postcode: f.postcode,
      address: f.street, sourceUrl: url, retrieved: g.retrieved, licence: LICENCE.wikidata, linked });
    if (f.dissolved) evidence.push({ type: 'wikidata-P576', detail: `dissolved/abolished/demolished ${f.dissolved}`, sourceUrl: url, retrieved: g.retrieved });
    if (f.closed) evidence.push({ type: 'wikidata-P3999', detail: `date of official closure ${f.closed}`, sourceUrl: url, retrieved: g.retrieved });
    if (f.stateOfUse.length) evidence.push({ type: 'wikidata-P5817', detail: `state of use ${f.stateOfUse.join(', ')} (a person reads the value)`, sourceUrl: url, retrieved: g.retrieved, informational: true });
    website = website || f.website; enwiki = enwiki || f.enwiki;
  }
  return { cands, evidence, website, enwiki };
}

async function fromWikipedia(http, place, anchor, enwikiTitle) {
  const m = String(place.current.source || '').match(/en\.wikipedia\.org\/wiki\/([^\s#,;]+)/);
  let raw = m ? m[1] : null;
  while (raw && raw.endsWith(')') && (raw.match(/\(/g) || []).length < (raw.match(/\)/g) || []).length) raw = raw.slice(0, -1); // "(…/Foo)" wrapper
  let title = enwikiTitle || null;
  if (!title && raw) { try { title = decodeURIComponent(raw).replace(/_/g, ' '); } catch (_) { title = raw.replace(/_/g, ' '); } }
  if (!title) return { cands: [] };
  const r = await http.json(`${ENDPOINT.wikipedia}?${qs({ action: 'query', prop: 'coordinates', titles: title, redirects: 1, format: 'json', formatversion: 2, maxlag: 5 })}`);
  const page = r.json && r.json.query && (r.json.query.pages || [])[0];
  const c = page && page.coordinates && page.coordinates.find(x => x.primary !== false);
  if (!c) return { cands: [] };
  if (anchor && haversineM(anchor.lat, anchor.lng, c.lat, c.lon) > anchor.radiusM) return { cands: [] };
  const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`;
  return { cands: [{ kind: 'wikipedia', source: 'wikipedia', name: page.title.replace(/\s*\([^)]*\)$/, ''), lat: c.lat, lng: c.lon,
    sourceUrl: url, retrieved: r.retrieved, licence: LICENCE.wikipedia, linked: !!(enwikiTitle || raw) }] };
}

const OSM_PLACE_CLASSES = /^(amenity|shop|tourism|leisure|historic|craft|office|building|man_made|club|healthcare|natural|waterway|bridge|railway|aeroway)$/;
async function fromNominatim(http, place, anchor) {
  const cands = []; const urls = [];
  const bare = place.name.replace(/\s+[—–-]\s*CLOSED.*$/i, '').replace(/\([^)]*\)/g, '').trim();
  const queries = [`${bare}, ${place.address || ''}`.replace(/,\s*$/, '')];
  if (place.address && parseAddress(place.address).houseNumber) queries.push(place.address.replace(/\([^)]*\)/g, '').trim());
  for (const q of queries) {
    const params = { q, format: 'jsonv2', addressdetails: 1, extratags: 1, namedetails: 1, limit: 5 };
    if (anchor) { const dLat = anchor.radiusM / 111000, dLng = dLat / Math.cos(anchor.lat * Math.PI / 180);
      Object.assign(params, { viewbox: [anchor.lng - dLng, anchor.lat + dLat, anchor.lng + dLng, anchor.lat - dLat].map(round5).join(','), bounded: 1 }); }
    const r = await http.json(`${ENDPOINT.nominatim}?${qs(params)}`);
    urls.push(r.error || r.status);
    for (const x of (Array.isArray(r.json) ? r.json : [])) {
      const lat = parseFloat(x.lat), lng = parseFloat(x.lon); if (!isFinite(lat)) continue;
      if (anchor && haversineM(anchor.lat, anchor.lng, lat, lng) > anchor.radiusM) continue;
      const a = x.address || {}; const nm = (x.namedetails && x.namedetails.name) || x.name || '';
      const cls = x.category || x.class;
      // An address point must itself BE a building or a house/address node. Nominatim also answers an address query with
      // the street (class=highway) and echoes the asked house number into address{}, so a house number alone proves
      // nothing: such a hit is street-level, osm-other, graded low.
      const isAddr = !nm && cls !== 'highway' && (cls === 'building' || x.addresstype === 'building' || (cls === 'place' && (x.type === 'house' || x.type === 'address')));
      const kind = nm && OSM_PLACE_CLASSES.test(cls) ? 'osm-poi' : (isAddr ? 'osm-address' : 'osm-other');
      cands.push({ kind, source: 'nominatim', name: nm, lat, lng, houseNumber: a.house_number || null, street: a.road || null, postcode: a.postcode || null,
        address: [[a.house_number, a.road].filter(Boolean).join(' '), a.city || a.town || a.village || a.hamlet, [a.state, a.postcode].filter(Boolean).join(' ')].filter(Boolean).join(', '),
        osmClass: `${cls}=${x.type}`, osm: x.osm_type && x.osm_id ? `${x.osm_type}/${x.osm_id}` : null, addresstype: x.addresstype || null,
        sourceUrl: x.osm_type && x.osm_id ? `https://www.openstreetmap.org/${x.osm_type}/${x.osm_id}` : 'https://nominatim.openstreetmap.org/',
        retrieved: r.retrieved, licence: LICENCE.osm, tags: x.extratags || {} });
    }
    if (cands.some(c => c.kind === 'osm-poi' && nameSim(place.name, c.name) >= 0.85)) break; // no need for the address query
  }
  return { cands, statusCodes: urls };
}

/** One Overpass query for a batch of rows that have a point: named objects within 80 m, including lifecycle tags. */
async function fromOverpassBatch(http, rows) {
  const pts = rows.filter(r => r.point);
  if (!pts.length) return {};
  const parts = pts.map(r => `nwr(around:80,${r.point.lat},${r.point.lng})[~"^(name|old_name|was:name|disused:name)$"~"."];`).join('\n');
  const q = `[out:json][timeout:60];\n(\n${parts}\n);\nout tags center 400;`;
  const res = await http.json(ENDPOINT.overpass, { method: 'POST', body: qs({ data: q }), host: 'overpass-api.de' });
  const els = (res.json && res.json.elements) || [];
  const out = {};
  for (const r of pts) {
    const near = [];
    for (const el of els) {
      const lat = el.lat != null ? el.lat : el.center && el.center.lat, lng = el.lon != null ? el.lon : el.center && el.center.lon;
      if (lat == null) continue;
      const d = haversineM(r.point.lat, r.point.lng, lat, lng); if (d > 80) continue;
      const t = el.tags || {};
      const sim = Math.max(...['name', 'old_name', 'was:name', 'disused:name'].map(k => (t[k] ? nameSim(r.place.name, t[k]) : 0)));
      if (sim < 0.85) continue;
      near.push({ el, lat, lng, d, sim, tags: t, url: `https://www.openstreetmap.org/${el.type}/${el.id}` });
    }
    out[r.place.name] = { near, retrieved: res.retrieved, error: res.json ? null : (res.error || `HTTP ${res.status}`) };
  }
  return out;
}

const NOT_OFFICIAL = /(wikipedia|wikidata|google|apple\.com|openstreetmap|yelp|tripadvisor|facebook|instagram|mapquest|roadsideamerica|atlasobscura|untappd|opentable|mapcarta)/i;
async function fromOfficial(http, place, website) {
  const cands = [], evidence = [], notes = [];
  let url = website;
  if (!url) { const m = String(place.current.source || '').match(/https?:\/\/[^\s)]+/); if (m && !NOT_OFFICIAL.test(m[0])) url = m[0]; }
  if (!url) return { cands, evidence, notes };
  let u; try { u = new URL(url); } catch (_) { return { cands, evidence, notes }; }
  if (!/^https?:$/.test(u.protocol)) return { cands, evidence, notes };
  const robots = await http.request(`${u.origin}/robots.txt`, { accept: 'text/plain' });
  const robotsTxt = robots.status >= 200 && robots.status < 300 ? robots.body : (robots.status >= 400 && robots.status < 500 ? '' : null);
  if (robotsTxt === null) { notes.push(`robots.txt unreachable (${robots.error || 'HTTP ' + robots.status}); official site skipped (RFC 9309: assume disallow on server error)`); return { cands, evidence, notes }; }
  if (!robotsAllows(robotsTxt, u.pathname + u.search)) { notes.push(`robots.txt disallows ${u.pathname} for ${UA_TOKEN}; skipped`); return { cands, evidence, notes }; }
  const page = await http.request(u.href, { accept: 'text/html' });
  if (!(page.status >= 200 && page.status < 300)) {
    notes.push(`official site ${u.href} answered ${page.error || 'HTTP ' + page.status} — NOT closure evidence (sites move, break and block bots)`);
    return { cands, evidence, notes };
  }
  for (const j of parseJsonLd(page.body)) {
    if (j.lat != null && j.lng != null) {
      cands.push({ kind: 'official', source: 'official', name: j.name || place.name, lat: j.lat, lng: j.lng, address: j.address, postcode: j.postcode,
        ...(j.address ? (({ houseNumber, street }) => ({ houseNumber, street }))(parseAddress(j.address)) : {}),
        sourceUrl: u.href, retrieved: page.retrieved, licence: LICENCE.official });
    } else if (j.address) notes.push(`official site schema.org address: ${j.address} (no geo)`);
  }
  const notice = siteClosureNotice(page.body);
  if (notice) evidence.push({ type: 'official-site-notice', detail: `“…${notice}…”`, sourceUrl: u.href, retrieved: page.retrieved });
  return { cands, evidence, notes };
}

// ───────────────────────────────────────────────────────── the run ──

async function checkRow(http, place, anchor, sources) {
  const cands = [], evidence = [], notes = [];
  let website = null, enwiki = null;
  if (sources.has('wikidata')) { const w = await fromWikidata(http, place, anchor); cands.push(...w.cands); evidence.push(...w.evidence); website = w.website; enwiki = w.enwiki; }
  if (sources.has('wikipedia')) { const w = await fromWikipedia(http, place, anchor, enwiki); cands.push(...w.cands); }
  const haveStrong = cands.some(c => gradeCandidate(c, place).grade === 'high');
  if (sources.has('nominatim') && !haveStrong) { const n = await fromNominatim(http, place, anchor); cands.push(...n.cands); }
  for (const c of cands.filter(c => c.source === 'nominatim')) {
    for (const ev of osmClosureEvidence(c.tags)) if (nameSim(place.name, c.name) >= 0.85) evidence.push({ ...ev, sourceUrl: c.sourceUrl, retrieved: c.retrieved });
    if (!website && c.tags && (c.tags.website || c.tags['contact:website']) && nameSim(place.name, c.name) >= 0.85) website = c.tags.website || c.tags['contact:website'];
  }
  if (sources.has('official')) { const o = await fromOfficial(http, place, website); cands.push(...o.cands); evidence.push(...o.evidence); notes.push(...o.notes); }
  const graded = cands.map(c => Object.assign(c, gradeCandidate(c, place)));
  return { graded, evidence, notes };
}

function statusProposal(place, evidence) {
  const closing = evidence.filter(e => !e.informational);
  if (place.current.status !== 'closed' && closing.length)
    return { outcome: 'status-needs-check', proposal: { suggest: 'needs-check (possible closure)', evidence: closing } };
  return null;
}

async function run(opts) {
  const today = opts.today || new Date().toISOString().slice(0, 10);
  const reg = opts.registry || JSON.parse(fs.readFileSync(opts.geocodes || GEOCODES, 'utf8'));
  const entries = (reg.cities || {})[opts.city];
  if (!entries) throw Object.assign(new Error(`unknown city key "${opts.city}" (keys: ${Object.keys(reg.cities || {}).join(', ')})`), { code: 1 });
  const anchor = cityAnchor(entries);
  let rows = Object.entries(entries).map(([name, e]) => ({ name, e, why: scopeReasons(e, opts.scope) })).filter(r => r.why.length);
  const inScope = rows.length;
  if (opts.limit) rows = rows.slice(0, opts.limit);
  const sources = new Set(opts.sources);
  const meta = { tool: `tools/location-verify.js ${VERSION}`, city: opts.city, generated: today, scope: opts.scope, sources: [...sources],
    rowsInScope: inScope, rowsChecked: rows.length, anchor, mode: opts.mode, userAgent: UA,
    rule: 'PROPOSALS ONLY. Nothing here is in data/geocodes.json until a person reviews a row (review.decision) and runs --accept locally, then the gates (research.js --geocheck/--statuscheck, npm run validate, npm test).' };
  const report = { meta, summary: {}, rows: [] };

  if (opts.mode === 'offline-plan') {
    for (const r of rows) report.rows.push({ name: r.name, current: pickCurrent(r.e), scope: r.why, outcome: 'planned',
      plan: planFor(r, sources), review: emptyReview() });
    meta.note = 'The sources are not reachable from here (org egress policy). This is the PLAN only: nothing was fetched and nothing is proposed. Run the workflow on a GitHub-hosted runner for real proposals.';
    meta.estimate = estimate(rows.length, sources);
    report.summary = { planned: rows.length };
    return report;
  }

  const http = opts.http || new Http({ fixtures: opts.fixtures, cacheDir: opts.cache, ttlDays: opts.ttlDays, maxRequests: opts.maxRequests, nominatimMax: opts.nominatimMax, today });
  const checked = [];
  for (const r of rows) {
    const place = { name: r.name, address: r.e.address, current: pickCurrent(r.e) };
    if (http.count >= http.max) { checked.push({ r, place, skipped: 'request budget exhausted (rerun resumes from cache)' }); continue; }
    const res = await checkRow(http, place, anchor, sources);
    checked.push({ r, place, res });
  }
  // Overpass: lifecycle tags near each row's point (current pin, or the proposed one), batched 20 per query.
  const ov = {};
  if (sources.has('overpass')) {
    const pts = checked.filter(c => c.res).map(c => {
      const d = decide(c.place, c.res.graded); c.decision = d;
      const p = c.place.current.lat != null ? { lat: c.place.current.lat, lng: c.place.current.lng } : (d.proposal ? { lat: d.proposal.lat, lng: d.proposal.lng } : null);
      return { place: c.place, point: p };
    }).filter(x => x.point);
    for (let i = 0; i < pts.length; i += 20) Object.assign(ov, await fromOverpassBatch(http, pts.slice(i, i + 20)));
  }
  const count = {};
  for (const c of checked) {
    const row = { name: c.place.name, current: c.place.current, scope: c.r.why };
    if (c.skipped) { row.outcome = 'skipped'; row.notes = [c.skipped]; }
    else {
      const d = c.decision || decide(c.place, c.res.graded);
      const ev = c.res.evidence.slice();
      const o = ov[c.place.name];
      if (o) {
        for (const n of o.near) for (const e of osmClosureEvidence(n.tags)) ev.push({ ...e, sourceUrl: n.url, retrieved: o.retrieved, distanceM: n.d });
        if (o.error) c.res.notes.push(`overpass: ${o.error}`);
      }
      const seen = new Set(); const evidence = ev.filter(e => { const k = e.type + e.detail + e.sourceUrl; if (seen.has(k)) return false; seen.add(k); return true; });
      row.outcome = d.outcome; row.proposal = d.proposal; row.notes = d.notes.concat(c.res.notes);
      const sp = statusProposal(c.place, evidence);
      if (sp) { row.statusOutcome = sp.outcome; row.statusProposal = sp.proposal; count[sp.outcome] = (count[sp.outcome] || 0) + 1; }
      row.evidence = evidence;
      row.candidates = c.res.graded.slice(0, 6).map(g => ({ kind: g.kind, name: g.name, lat: round5(g.lat), lng: round5(g.lng), grade: g.grade, nameSim: g.nameSim,
        sourceUrl: g.sourceUrl, retrieved: g.retrieved, osmClass: g.osmClass, osm: g.osm || undefined, addresstype: g.addresstype || undefined, distanceFromCurrentM: c.place.current.lat != null ? haversineM(c.place.current.lat, c.place.current.lng, g.lat, g.lng) : null }));
    }
    row.review = emptyReview();
    report.rows.push(row);
  }
  demoteSharedObjects(report.rows);
  for (const row of report.rows) count[row.outcome] = (count[row.outcome] || 0) + 1;
  report.summary = count;
  meta.requests = { network: http.count, cacheHits: http.cacheHits, nominatim: http.nomCount, failures: http.failures.slice(0, 50) };
  if (report.rows.some(r => (r.candidates || []).some(c => /^osm/.test(c.kind)) || (r.evidence || []).some(e => /^osm/.test(e.type))))
    meta.attribution = 'Contains information from OpenStreetMap, © OpenStreetMap contributors, available under the Open Database Licence (ODbL) — https://www.openstreetmap.org/copyright';
  meta.hardFailure = http.failures.length > 0 && http.count > 0 && http.failures.length / http.count > 0.25;
  return report;
}

function pickCurrent(e) {
  return { address: e.address || null, lat: e.lat == null ? null : e.lat, lng: e.lng == null ? null : e.lng, source: e.source || null,
    confidence: e.confidence || null, verified: e.verified || null, status: e.status || null, statusSource: e.statusSource || null, statusChecked: e.statusChecked || null };
}
function emptyReview() { return { decision: null, by: null, why: null, date: null }; }
function planFor(r, sources) {
  const p = [];
  if (sources.has('wikidata')) p.push(/\bQ\d{2,}\b/.test(r.e.source || '') ? 'wikidata: wbgetentities (QID in source)' : 'wikidata: wbsearchentities + wbgetentities (P625, P856, P6375, P576, P3999, P5817)');
  if (sources.has('wikipedia')) p.push('wikipedia: GeoData prop=coordinates for the linked article (if any)');
  if (sources.has('nominatim')) p.push('nominatim: name+address search, then address search (only if no high candidate yet)');
  if (sources.has('official')) p.push('official site: robots.txt, then home page schema.org geo/address + closure notice');
  if (sources.has('overpass')) p.push('overpass: named objects within 80 m incl. lifecycle tags (batched 20/query)');
  return p;
}
/** Request + time estimate: per row ≈ 2 Wikidata + 0–1 Wikipedia + 0–2 Nominatim (1.1 s each) + 0–2 official + 1/20 Overpass. */
function estimate(n, sources) {
  const perRow = { wikidata: 2, wikipedia: 0.5, nominatim: 1.5, official: 1.2, overpass: 0.05 };
  const secPer = { wikidata: 0.5, wikipedia: 0.5, nominatim: 1.15, official: 2.5, overpass: 5 / 1 };
  let req = 0, sec = 0;
  for (const s of sources) { req += perRow[s] * n; sec += perRow[s] * n * secPer[s]; }
  return { requests: Math.round(req), nominatimRequests: sources.has('nominatim') ? Math.round(1.5 * n) : 0, minutes: Math.ceil(sec / 60) };
}

function toMarkdown(rep) {
  const m = rep.meta, L = [];
  L.push(`# Location-verify report — ${m.city}`, '');
  L.push(`_Generated ${m.generated} by \`${m.tool}\` · mode **${m.mode}** · scope ${m.scope.join(', ')} · ${m.rowsChecked} of ${m.rowsInScope} rows in scope._`, '');
  L.push(`> ${m.rule}`, '');
  if (m.note) L.push(`> **${m.note}**`, '');
  if (m.estimate) L.push(`Estimate for a live run of these rows: ~${m.estimate.requests} requests (${m.estimate.nominatimRequests} to Nominatim), ~${m.estimate.minutes} min.`, '');
  if (m.anchor) L.push(`City anchor (median of high-confidence pins): ${round5(m.anchor.lat)}, ${round5(m.anchor.lng)} · candidates farther than ${(m.anchor.radiusM / 1000).toFixed(0)} km are discarded as same-name-elsewhere.`, '');
  if (m.requests) L.push(`Requests: ${m.requests.network} network · ${m.requests.cacheHits} cache hits · ${m.requests.nominatim} Nominatim${m.requests.failures.length ? ` · failures: ${m.requests.failures.slice(0, 5).join('; ')}` : ''}`, '');
  L.push('## Summary', '', '| outcome | rows |', '|---|---|');
  for (const [k, v] of Object.entries(rep.summary)) L.push(`| ${k} | ${v} |`);
  L.push('');
  L.push('## Rows', '');
  L.push('| place | now | scope | outcome | proposal | evidence |', '|---|---|---|---|---|---|');
  const esc = s => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
  for (const r of rep.rows) {
    const now = r.current.lat == null ? 'UNVERIFIED' : `${r.current.lat}, ${r.current.lng} (${r.current.confidence})`;
    const p = r.proposal ? `${r.proposal.lat}, ${r.proposal.lng} **${r.proposal.grade}** · ${r.proposal.distanceM == null ? 'new pin' : r.proposal.distanceM + ' m'} · “${esc(r.proposal.matchedName)}” · [${r.proposal.kind}](${r.proposal.sourceUrl}) ${r.proposal.retrieved}`
      : (r.plan ? esc(r.plan.join('; ')) : '—');
    const o = r.proposal && r.proposal.osmObject;
    const osm = o ? `OSM ${o.id} ${o.class || ''}${o.addresstype ? ' · addresstype=' + o.addresstype : ''}${o.name ? ' · name “' + esc(o.name) + '”' : ' · (no name)'}${o.address ? ' · ' + esc(o.address) : ''}${Object.keys(o.tags).length ? ' · ' + esc(Object.entries(o.tags).map(([k, v]) => k + '=' + v).join(', ')) : ''}` : '';
    const ev = [osm, (r.statusProposal ? `**${r.statusProposal.suggest}**: ` : '') + (r.evidence || []).map(e => `${esc(e.detail)} ([src](${e.sourceUrl}))`).join('; '), (r.notes || []).map(esc).join('; ')].filter(Boolean).join(' — ');
    L.push(`| ${esc(r.name)} | ${now} | ${r.scope.join(', ')} | ${r.outcome}${r.statusOutcome ? ' + ' + r.statusOutcome : ''} | ${p} | ${ev} |`);
  }
  L.push('');
  if (m.attribution) L.push(`_${m.attribution}_`, '');
  L.push('Review: set `review.decision` in the JSON to `accept` (coordinate) or `accept-closed` (closure confirmed — also set `review.statusSource`), with `review.by` and `review.why`; then run `node tools/location-verify.js --accept <this json>` locally and the gates.');
  return L.join('\n') + '\n';
}

// ───────────────────────────────────────────────────────── --accept (local, reviewed) ──

/**
 * Apply reviewer-accepted rows. Coordinates are merged into data/geocodes.json here (status fields untouched, never a
 * downgrade, record counts asserted). Accepted closures are emitted as a geo-merge wave file so tools/geo-merge.py
 * applies the "— CLOSED" marker convention in its one place. Every applied row is appended to docs/geoverify/ACCEPTED.md.
 */
function accept(reportPath, o = {}) {
  if (!o.allowCi && (process.env.GITHUB_ACTIONS || process.env.CI)) throw Object.assign(new Error('--accept is a reviewed, local step; it refuses to run on CI'), { code: 1 });
  const rep = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const geoPath = o.geocodes || GEOCODES;
  const g = JSON.parse(fs.readFileSync(geoPath, 'utf8'));
  const city = g.cities[rep.meta.city];
  if (!city) throw Object.assign(new Error(`city ${rep.meta.city} not in registry`), { code: 1 });
  const n0 = Object.keys(city).length, total0 = Object.values(g.cities).reduce((a, c) => a + Object.keys(c).length, 0);
  const today = o.today || new Date().toISOString().slice(0, 10);
  const applied = [], closures = [], refused = [];
  for (const r of rep.rows) {
    const rv = r.review || {};
    if (!rv.decision) continue;
    if (!rv.by || !rv.why) { refused.push(`${r.name}: review needs by + why`); continue; }
    const e = city[r.name];
    if (!e) { refused.push(`${r.name}: no longer in the registry (renamed?)`); continue; }
    if (rv.decision === 'accept') {
      const p = r.proposal;
      if (!p || p.lat == null || !p.sourceUrl) { refused.push(`${r.name}: no coordinate proposal to accept`); continue; }
      if (p.grade === 'low' || r.outcome === 'shared-object') { refused.push(`${r.name}: a low / shared-object proposal is not a verified pin`); continue; }
      if (r.outcome === 'conflict' && !rv.overrideConflict) { refused.push(`${r.name}: conflict rows need review.overrideConflict=true`); continue; }
      if (!isUnverified(e) && GRADE_RANK[p.grade] < (GRADE_RANK[String(e.confidence).toLowerCase()] || 0)) { refused.push(`${r.name}: ${p.grade} would downgrade a ${e.confidence} pin`); continue; }
      const before = { lat: e.lat, lng: e.lng, confidence: e.confidence, source: e.source };
      e.lat = p.lat; e.lng = p.lng; e.confidence = p.grade; e.verified = today;
      e.source = `${p.sourceUrl} (${p.kind}, retrieved ${p.retrieved}; location-verify proposal accepted by ${rv.by}: ${rv.why})`;
      if (rv.address) e.address = rv.address;
      applied.push({ name: r.name, before, after: { lat: p.lat, lng: p.lng, confidence: p.grade }, by: rv.by, why: rv.why, src: p.sourceUrl });
    } else if (rv.decision === 'accept-closed') {
      if (!rv.statusSource) { refused.push(`${r.name}: accept-closed needs review.statusSource (the evidence a person checked)`); continue; }
      closures.push({ n: r.name, address: e.address, lat: e.lat, lng: e.lng, confidence: isUnverified(e) ? 'unverified' : e.confidence, geoSource: e.source,
        status: 'closed', statusSource: `${rv.statusSource} (location-verify evidence reviewed by ${rv.by}: ${rv.why})`, note: e.note });
    } else if (rv.decision !== 'reject') refused.push(`${r.name}: unknown decision ${rv.decision}`);
  }
  const n1 = Object.keys(city).length, total1 = Object.values(g.cities).reduce((a, c) => a + Object.keys(c).length, 0);
  if (n1 !== n0 || total1 !== total0) throw new Error(`record count changed (${n0}→${n1}, total ${total0}→${total1}); refusing to write`);
  if (applied.length && !o.dryRun) fs.writeFileSync(geoPath, JSON.stringify(g, null, 1) + '\n');
  let wave = null;
  if (closures.length && !o.dryRun) {
    const key = rep.meta.city, full = path.join(ROOT, 'data', `${key}-research`);
    const dir = o.waveDir || path.join(fs.existsSync(full) ? full : path.join(ROOT, 'data', `${key.replace(/-[a-z]{2}$/, '')}-research`), 'geo');
    fs.mkdirSync(dir, { recursive: true });
    wave = path.join(dir, `_geoout_lv_${today}.json`);
    fs.writeFileSync(wave, JSON.stringify(closures, null, 1) + '\n');
  }
  if ((applied.length || closures.length) && !o.dryRun) {
    const led = o.ledger || path.join(ROOT, 'docs', 'geoverify', 'ACCEPTED.md');
    if (!fs.existsSync(led)) fs.writeFileSync(led, '# Location-verify — accepted proposals (audit trail)\n\nAppended by `tools/location-verify.js --accept`. One line per applied row.\n\n| date | city | place | change | source | by | why |\n|---|---|---|---|---|---|---|\n');
    const lines = applied.map(a => `| ${today} | ${rep.meta.city} | ${a.name} | ${a.before.lat == null ? 'UNVERIFIED' : `${a.before.lat},${a.before.lng} (${a.before.confidence})`} → ${a.after.lat},${a.after.lng} (${a.after.confidence}) | ${a.src} | ${a.by} | ${a.why.replace(/\|/g, '/')} |`)
      .concat(closures.map(c => `| ${today} | ${rep.meta.city} | ${c.n} | status → closed (via geo-merge wave) | ${c.statusSource.replace(/\|/g, '/')} | — | — |`));
    fs.appendFileSync(led, lines.join('\n') + '\n');
  }
  return { applied, closures, refused, wave };
}

// ───────────────────────────────────────────────────────── CLI ──

function parseArgs(argv) {
  const o = { scope: ['unverified', 'low', 'status'], sources: ['wikidata', 'wikipedia', 'nominatim', 'overpass', 'official'], out: path.join(ROOT, 'docs', 'geoverify'),
    cache: process.env.LV_CACHE_DIR || path.join(os.homedir(), '.cache', 'cleo-location-verify'), ttlDays: 30, maxRequests: 3000, nominatimMax: 300 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], v = () => { const x = argv[++i]; if (x == null) throw Object.assign(new Error(`${a} needs a value`), { code: 1 }); return x; };
    if (a === '--city') o.city = v();
    else if (a === '--scope') o.scope = v().split(',').map(s => s.trim()).filter(Boolean);
    else if (a === '--sources') o.sources = v().split(',').map(s => s.trim()).filter(Boolean);
    else if (a === '--limit') o.limit = parseInt(v(), 10);
    else if (a === '--nominatim-max') o.nominatimMax = parseInt(v(), 10);
    else if (a === '--max-requests') o.maxRequests = parseInt(v(), 10);
    else if (a === '--out') o.out = path.resolve(v());
    else if (a === '--cache') o.cache = path.resolve(v());
    else if (a === '--cache-ttl-days') o.ttlDays = parseInt(v(), 10);
    else if (a === '--fixtures') o.fixturesPath = path.resolve(v());
    else if (a === '--geocodes') o.geocodes = path.resolve(v());
    else if (a === '--offline') o.offline = true;
    else if (a === '--today') o.today = v();
    else if (a === '--backlog') o.backlog = true;
    else if (a === '--accept') o.accept = path.resolve(v());
    else if (a === '--dry-run') o.dryRun = true; // report mode is always a dry run; with --accept: show, write nothing
    else throw Object.assign(new Error(`unknown option ${a}`), { code: 1 });
  }
  const okScope = ['unverified', 'low', 'med', 'high', 'status', 'all'], okSrc = ['wikidata', 'wikipedia', 'nominatim', 'overpass', 'official'];
  for (const s of o.scope) if (!okScope.includes(s)) throw Object.assign(new Error(`unknown scope ${s}`), { code: 1 });
  for (const s of o.sources) if (!okSrc.includes(s)) throw Object.assign(new Error(`unknown source ${s}`), { code: 1 });
  return o;
}

async function reachable() {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
  try {
    const r = await fetch(`${ENDPOINT.wikidata}?action=query&meta=siteinfo&format=json`, { headers: { 'User-Agent': UA }, signal: ctl.signal });
    if (!r.ok) return `HTTP ${r.status}`;
    const j = await r.json().catch(() => null);
    return j && j.query ? null : 'not the Wikidata API';
  } catch (e) { return (e.cause && e.cause.code) || e.message; } finally { clearTimeout(t); }
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (o.backlog) {
    const today = o.today || new Date().toISOString().slice(0, 10);
    const rows = backlog(JSON.parse(fs.readFileSync(o.geocodes || GEOCODES, 'utf8')).cities, today);
    const t = k => rows.reduce((a, r) => a + r[k], 0);
    console.log('| city | entries | unverified | low | med | status unchecked | closed |\n|---|---|---|---|---|---|---|');
    rows.forEach(r => console.log(`| ${r.city} | ${r.entries} | ${r.unverified} | ${r.low} | ${r.med} | ${r.statusUnchecked} | ${r.closed} |`));
    console.log(`| **total** | **${t('entries')}** | **${t('unverified')}** | **${t('low')}** | **${t('med')}** | **${t('statusUnchecked')}** | **${t('closed')}** |`);
    return 0;
  }
  if (o.accept) {
    const r = accept(o.accept, { dryRun: o.dryRun, geocodes: o.geocodes, today: o.today });
    console.log(`applied ${r.applied.length} coordinate(s); ${r.closures.length} closure(s)${r.wave ? ' → ' + path.relative(ROOT, r.wave) : ''}; refused ${r.refused.length}`);
    r.refused.forEach(x => console.log('  refused: ' + x));
    if (r.closures.length) console.log(`  next: python3 tools/geo-merge.py ${JSON.parse(fs.readFileSync(o.accept, 'utf8')).meta.city} --only "_geoout_lv_*.json"`);
    console.log('  then: node tools/research.js --geocheck <city> && node tools/research.js --statuscheck <city> && (cd tools && npm run validate && npm test)');
    return 0;
  }
  if (!o.city) throw Object.assign(new Error('--city <key> is required (or --backlog / --accept)'), { code: 1 });
  let mode = 'live', fixtures = null;
  if (o.fixturesPath) {
    const fx = JSON.parse(fs.readFileSync(o.fixturesPath, 'utf8')); mode = 'fixtures';
    fixtures = fx.responses || fx;
    if (fx.registry && !o.geocodes) o.registry = fx.registry; // a self-contained fixture file carries its own registry
  }
  else if (o.offline) mode = 'offline-plan';
  else { const off = await reachable(); if (off) { console.log(`Wikidata is not reachable from here (${off}). Writing the offline PLAN report (exit 0).\n  Real proposals come from the GitHub-hosted runner. Do NOT route around a block.`); mode = 'offline-plan'; } }
  const rep = await run({ ...o, fixtures, mode });
  fs.mkdirSync(o.out, { recursive: true });
  const base = path.join(o.out, o.city);
  fs.writeFileSync(base + '.json', JSON.stringify(rep, null, 1) + '\n');
  fs.writeFileSync(base + '.md', toMarkdown(rep));
  console.log(`wrote ${path.relative(ROOT, base)}.json/.md — ${JSON.stringify(rep.summary)}`);
  return rep.meta.hardFailure ? 4 : 0;
}

if (require.main === module) {
  main().then(c => { process.exitCode = c; }).catch(e => { console.error('location-verify: ' + e.message); process.exitCode = e.code || 4; });
}

module.exports = { normName, nameSim, haversineM, parseAddress, addrAgreement, isExtended, gradeCandidate, decide, osmClosureEvidence,
  siteClosureNotice, parseJsonLd, robotsAllows, demoteSharedObjects, osmEvidence, wikidataFacts, cityAnchor, scopeReasons, backlog, run, accept, toMarkdown, Http, estimate, UA, ENDPOINT };
