#!/usr/bin/env node
'use strict';
// location-verify.test.js — unit + replay tests for tools/location-verify.js. No network: every response comes from
// tools/location-verify-fixtures/testville.json (synthetic, fictional places) or is built inline.
//   node tools/location-verify.test.js
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const LV = require('./location-verify.js');

let n = 0; const fails = [];
async function t(name, fn) { try { await fn(); n++; } catch (e) { fails.push(`${name}: ${e.message}`); } }

(async () => {
  // ── pure helpers ──
  await t('normName drops CLOSED marker, parentheticals, the, punctuation', () => {
    assert.strictEqual(LV.normName("The Wheeling Brewing Co. — CLOSED"), 'wheeling brewing co');
    assert.strictEqual(LV.normName('Café Toscano (Akron)'), 'cafe toscano');
    assert.strictEqual(LV.normName('Mosser & Sons'), 'mosser and sons');
  });
  await t('nameSim', () => {
    assert.strictEqual(LV.nameSim('DiCarlo’s Pizza', "DiCarlo's Pizza"), 1);
    assert.ok(LV.nameSim("Coleman's Fish Market", "Coleman's Fish Market") === 1);
    assert.ok(LV.nameSim('Later Alligator', 'Later Alligator Restaurant') >= 0.85, 'containment');
    assert.ok(LV.nameSim('Greco\'s', 'Denny\'s') < 0.6, 'different names stay apart');
    assert.ok(LV.nameSim('Sarris Candies', 'Sarris Candies & Ice Cream Parlor') >= 0.85);
  });
  await t('haversine', () => {
    assert.strictEqual(LV.haversineM(0, 0, 0, 0), 0);
    const d = LV.haversineM(40.0702, -80.7273, 40.0712, -80.7273); assert.ok(d > 105 && d < 117, String(d));
  });
  await t('parseAddress + addrAgreement', () => {
    const a = LV.parseAddress('2226 Market St (Centre Market), Wheeling, WV 26003');
    assert.deepStrictEqual(a, { houseNumber: '2226', street: 'market st', postcode: '26003' });
    const ag = LV.addrAgreement('2226 Market St, Wheeling, WV 26003', { houseNumber: '2226', street: 'Market Street', postcode: '26003' });
    assert.deepStrictEqual(ag, { houseNumber: true, street: true, postcode: true });
    assert.strictEqual(LV.addrAgreement('12 Main St, X, OH 44101', { houseNumber: '14', street: 'Main Street' }).houseNumber, false);
  });
  await t('isExtended', () => {
    assert.ok(LV.isExtended('Salt Fork State Park')); assert.ok(LV.isExtended('Wheeling Heritage Trail'));
    assert.ok(!LV.isExtended("DiCarlo's Pizza"));
  });
  await t('gradeCandidate', () => {
    const place = { name: 'Fictional Fish Market', address: '12 Harbor St, Testville, ZZ 99901', current: {} };
    assert.strictEqual(LV.gradeCandidate({ kind: 'osm-poi', name: 'Fictional Fish Market', houseNumber: '12', street: 'Harbor Street', postcode: '99901' }, place).grade, 'high');
    assert.strictEqual(LV.gradeCandidate({ kind: 'osm-poi', name: 'Fictional Fish Market' }, place).grade, 'med');
    assert.strictEqual(LV.gradeCandidate({ kind: 'osm-poi', name: 'Fictional Fish Market', houseNumber: '14', street: 'Harbor Street' }, place).grade, 'low', 'house number disagrees');
    assert.strictEqual(LV.gradeCandidate({ kind: 'osm-poi', name: 'Fictional Fish Market', houseNumber: '12', street: 'Harbor Street', postcode: '11111' }, place).grade, 'med', 'postcode disagrees → one level down');
    assert.strictEqual(LV.gradeCandidate({ kind: 'osm-address', name: '', houseNumber: '12', street: 'Harbor Street' }, place).grade, 'med');
    assert.strictEqual(LV.gradeCandidate({ kind: 'osm-other', name: 'Harbor Street', osmClass: 'highway=residential' }, place).grade, 'low', 'a street is never a place pin');
    assert.strictEqual(LV.gradeCandidate({ kind: 'wikidata', name: 'Totally Different' }, place).grade, 'low');
  });
  await t('decide thresholds', () => {
    const c = (lat, lng, grade, kind = 'osm-poi', extra = {}) => Object.assign({ lat, lng, grade, kind, source: kind, nameSim: 1, why: [], sourceUrl: 'u', retrieved: 'd' }, extra);
    const cur = (lat, lng, confidence) => ({ name: 'X Diner', current: { lat, lng, confidence } });
    assert.strictEqual(LV.decide(cur(null, null), [c(1, 1, 'med')]).outcome, 'pin');
    assert.strictEqual(LV.decide(cur(1, 1, 'low'), [c(1.0001, 1, 'high')]).outcome, 'confirm');      // ~11 m
    assert.strictEqual(LV.decide(cur(1, 1, 'low'), [c(1.0018, 1, 'high')]).outcome, 'move');         // ~200 m: the viewport error
    assert.strictEqual(LV.decide(cur(1, 1, 'high'), [c(1.0018, 1, 'med')]).outcome, 'confirm', 'a med candidate never moves a high pin');
    assert.strictEqual(LV.decide(cur(1, 1, 'high'), [c(1.01, 1, 'high')]).outcome, 'conflict');      // ~1.1 km
    assert.strictEqual(LV.decide(cur(1, 1, 'low'), [c(1, 1, 'low')]).outcome, 'no-match', 'low candidates are never proposed');
    assert.strictEqual(LV.decide(cur(null, null), [c(1, 1, 'med'), c(1.02, 1, 'med')]).outcome, 'ambiguous');
    const park = { name: 'Big State Park', current: { lat: 1, lng: 1, confidence: 'med' } };
    assert.strictEqual(LV.decide(park, [c(1.005, 1, 'high', 'wikidata')]).outcome, 'confirm', 'extended feature: centroid ≠ entrance');
    const agree = LV.decide(cur(null, null), [c(1, 1, 'med', 'osm-poi'), c(1.0002, 1, 'med', 'osm-address', { source: 'official' })]);
    assert.strictEqual(agree.proposal.grade, 'high', 'independent agreement within 40 m upgrades med → high');
  });
  await t('osmClosureEvidence', () => {
    assert.deepStrictEqual(LV.osmClosureEvidence({ 'disused:shop': 'shoes', name: 'X' }).map(e => e.detail), ['disused:shop=shoes']);
    assert.strictEqual(LV.osmClosureEvidence({ 'was:name': 'Old X', shop: 'shoes' }).length, 0, 'a former name alone is not closure');
    assert.strictEqual(LV.osmClosureEvidence({ shop: 'vacant' }).length, 1);
    assert.strictEqual(LV.osmClosureEvidence({ 'was:amenity': 'place_of_worship', leisure: 'sports_centre', name: 'Rink' }).length, 0, 'repurposed building, not closed');
    assert.strictEqual(LV.osmClosureEvidence({ 'disused:amenity': 'restaurant', building: 'yes' }).length, 1, 'no active main tag → evidence');
  });
  await t('siteClosureNotice', () => {
    assert.ok(LV.siteClosureNotice('<p>After 40 years we have closed our doors.</p>'));
    assert.ok(LV.siteClosureNotice('<div>This location is now permanently closed</div>'));
    assert.strictEqual(LV.siteClosureNotice('<p>Closed on Mondays. Closed for the holidays Dec 25.</p>'), null);
    assert.strictEqual(LV.siteClosureNotice('<script>var s="permanently closed"</script><p>Open daily</p>'), null, 'script text ignored');
  });
  await t('parseJsonLd', () => {
    const h = '<script type="application/ld+json">{"@graph":[{"@type":"Restaurant","name":"A","geo":{"latitude":"1.5","longitude":"-2.5"},"address":{"streetAddress":"1 Main St","addressLocality":"X","addressRegion":"OH","postalCode":"44101"}}]}</script><script type="application/ld+json">{broken</script>';
    const r = LV.parseJsonLd(h);
    assert.strictEqual(r.length, 1); assert.strictEqual(r[0].lat, 1.5); assert.strictEqual(r[0].address, '1 Main St, X, OH 44101');
  });
  await t('robotsAllows (RFC 9309)', () => {
    assert.ok(LV.robotsAllows('', '/'));
    assert.ok(!LV.robotsAllows('User-agent: *\nDisallow: /', '/'));
    assert.ok(LV.robotsAllows('User-agent: *\nDisallow: /private', '/menu'));
    assert.ok(LV.robotsAllows('User-agent: *\nDisallow: /\nAllow: /contact', '/contact'), 'longest match');
    assert.ok(!LV.robotsAllows('User-agent: CleoGuideLocationVerify\nDisallow: /\n\nUser-agent: *\nAllow: /', '/'), 'our group wins');
    assert.ok(LV.robotsAllows('User-agent: Googlebot\nDisallow: /\n', '/'), 'other bots’ rules do not bind us');
    assert.ok(LV.robotsAllows('User-agent: *\nDisallow:\n', '/x'), 'empty Disallow allows');
    assert.ok(!LV.robotsAllows('User-agent: *\nDisallow: /*.php$\n', '/index.php'));
  });
  await t('scopeReasons', () => {
    assert.deepStrictEqual(LV.scopeReasons({ lat: null, lng: null, source: 'UNVERIFIED', status: 'open', statusSource: 'x' }, ['unverified', 'low', 'status']), ['unverified']);
    assert.deepStrictEqual(LV.scopeReasons({ lat: 1, lng: 1, source: 's', confidence: 'low', status: 'unknown', statusSource: '' }, ['unverified', 'low', 'status']), ['low', 'status']);
    assert.deepStrictEqual(LV.scopeReasons({ lat: 1, lng: 1, source: 's', confidence: 'high', status: 'open', statusSource: 'x' }, ['unverified', 'low', 'status']), []);
  });
  await t('backlog on the real registry agrees with an independent count', () => {
    const cities = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'geocodes.json'), 'utf8')).cities;
    const rows = LV.backlog(cities, '2026-10-11');
    let unv = 0, low = 0, all = 0;
    for (const c of Object.values(cities)) for (const e of Object.values(c)) {
      all++; const u = e.lat == null || e.lng == null || String(e.source).toUpperCase() === 'UNVERIFIED';
      if (u) unv++; else if (String(e.confidence).toLowerCase() === 'low') low++;
    }
    assert.strictEqual(rows.reduce((a, r) => a + r.entries, 0), all);
    assert.strictEqual(rows.reduce((a, r) => a + r.unverified, 0), unv);
    assert.strictEqual(rows.reduce((a, r) => a + r.low, 0), low);
  });

  await t('shardCities: every city in exactly one shard, balanced by rows', () => {
    const cities = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'geocodes.json'), 'utf8')).cities;
    const shards = [1, 2, 3].map(i => LV.shardCities(cities, i, 3));
    const all = shards.flat().sort(); assert.deepStrictEqual(all, Object.keys(cities).sort());
    const rows = shards.map(k => k.reduce((a, c) => a + Object.keys(cities[c]).length, 0));
    assert.ok(Math.max(...rows) - Math.min(...rows) < 1300, rows.join(','));
  });
  // ── replay a whole city through the fixtures ──
  const fx = JSON.parse(fs.readFileSync(path.join(__dirname, 'location-verify-fixtures', 'testville.json'), 'utf8'));
  const regCopy = JSON.parse(JSON.stringify(fx.registry));
  const rep = await LV.run({ city: 'testville-zz', registry: fx.registry, scope: ['all'], sources: ['wikidata', 'wikipedia', 'nominatim', 'overpass', 'official'],
    fixtures: fx.responses, mode: 'fixtures', today: '2026-10-11' });
  const row = name => rep.rows.find(r => r.name === name);
  await t('replay: report never mutates the registry', () => assert.deepStrictEqual(fx.registry, regCopy));
  await t('replay: UNVERIFIED + OSM place object with matching name and address → high pin', () => {
    const r = row('Fictional Fish Market');
    assert.strictEqual(r.outcome, 'pin'); assert.strictEqual(r.proposal.grade, 'high');
    assert.strictEqual(r.proposal.sourceUrl, 'https://www.openstreetmap.org/node/1001');
    assert.strictEqual(r.proposal.retrieved, '2026-10-11'); assert.ok(/ODbL/.test(r.proposal.licence));
    assert.strictEqual(r.proposal.matchedName, 'Fictional Fish Market');
    assert.ok(!r.statusProposal, '"Closed on Mondays" is not a closure');
  });
  await t('replay: Wikidata QID in source → move ~124 m, and P576 + site notice → status needs-check (never "closed")', () => {
    const r = row('Example Museum');
    assert.strictEqual(r.outcome, 'move'); assert.ok(r.proposal.distanceM > 100 && r.proposal.distanceM < 150, String(r.proposal.distanceM));
    assert.strictEqual(r.statusOutcome, 'status-needs-check');
    assert.ok(/needs-check/.test(r.statusProposal.suggest));
    const types = r.statusProposal.evidence.map(e => e.type).sort();
    assert.deepStrictEqual(types, ['official-site-notice', 'wikidata-P576']);
  });
  await t('replay: extended feature (park) — Wikipedia centroid 556 m off the entrance pin → confirm, no move', () => {
    const r = row('Sample Park'); assert.strictEqual(r.outcome, 'confirm'); assert.ok(r.notes.some(x => /extended feature/.test(x)));
  });
  await t('replay: two same-name candidates 2 km apart → ambiguous, nothing proposed', () => {
    const r = row('Ambiguous Cafe'); assert.strictEqual(r.outcome, 'ambiguous'); assert.strictEqual(r.proposal, null);
  });
  await t('replay: a 404 official site is NOT closure evidence', () => {
    const r = row('Broken Site Bakery'); assert.strictEqual(r.outcome, 'no-match'); assert.ok(!r.statusProposal);
    assert.ok(r.notes.some(x => /NOT closure evidence/.test(x)));
  });
  await t('replay: OSM disused:shop near the pin → status needs-check', () => {
    const r = row('Lifecycle Shoe Shop'); assert.strictEqual(r.statusOutcome, 'status-needs-check');
    assert.ok(r.statusProposal.evidence.some(e => e.detail === 'disused:shop=shoes' && e.sourceUrl === 'https://www.openstreetmap.org/node/7001'));
  });
  await t('replay: same name 4,400 km away is discarded (wrong town)', () => {
    const r = row('Far Away Diner'); assert.strictEqual(r.outcome, 'no-match'); assert.strictEqual(r.candidates.length, 0);
  });
  await t('replay: robots.txt disallow for our agent → site skipped', () => {
    const r = row('Robots Blocked Tavern'); assert.ok(r.notes.some(x => /robots\.txt disallows/.test(x)));
  });
  await t('replay: official schema.org geo 8 m from a low pin → confirm + upgrade note', () => {
    const r = row('Schema Grill'); assert.strictEqual(r.outcome, 'confirm'); assert.strictEqual(r.proposal.grade, 'high');
    assert.ok(r.notes.some(x => /upgrade confidence low → high/.test(x)));
  });
  await t('replay: closed place kept; no closure proposal for an already-closed row', () => {
    const r = row('Old Mill — CLOSED'); assert.ok(r); assert.ok(!r.statusProposal);
  });
  await t('replay: a street (highway way) echoing the asked house number is street-level → low, never proposed', () => {
    for (const n of ['Street Echo Museum', 'Street Echo Village']) {
      const r = row(n); assert.strictEqual(r.outcome, 'no-match', n); assert.strictEqual(r.proposal, null, n);
      const c = r.candidates.find(x => x.osm === 'way/4004'); assert.ok(c, n); assert.strictEqual(c.kind, 'osm-other'); assert.strictEqual(c.grade, 'low');
    }
  });
  await t('replay: two rows resolving to the same OSM object both drop to low (shared object), evidence shows the object', () => {
    for (const n of ['Twin Shop One', 'Twin Shop Two']) {
      const r = row(n); assert.strictEqual(r.outcome, 'shared-object', n); assert.strictEqual(r.proposal.grade, 'low');
      assert.ok(r.notes.some(x => /shared object: OSM way\/5005/.test(x)), n);
      assert.strictEqual(r.proposal.osmObject.id, 'way/5005'); assert.strictEqual(r.proposal.osmObject.class, 'building=yes');
      assert.strictEqual(r.proposal.osmObject.tags.building, 'yes');
    }
    const md = LV.toMarkdown(rep); assert.ok(/OSM way\/5005 building=yes · addresstype=building · \(no name\)/.test(md), 'object shown in the evidence column');
  });
  await t('replay: place=house on a WAY is an address-interpolation line → street-level, low', () => {
    const r = row('Interpolated Diner'); assert.strictEqual(r.outcome, 'no-match'); assert.strictEqual(r.proposal, null);
    const c = r.candidates.find(x => x.osm === 'way/6006'); assert.strictEqual(c.kind, 'osm-other'); assert.strictEqual(c.grade, 'low');
  });
  await t('gradeCandidate: an osm-address whose object is a highway is low (defence in depth)', () => {
    const place = { name: 'X Museum', address: '627 Long Ave, Testville', current: {} };
    assert.strictEqual(LV.gradeCandidate({ kind: 'osm-address', name: '', houseNumber: '627', street: 'Long Avenue', osmClass: 'highway=primary' }, place).grade, 'low');
  });
  await t('demoteSharedObjects leaves distinct objects alone', () => {
    const rows = [{ name: 'a', outcome: 'pin', proposal: { grade: 'high', osmObject: { id: 'node/1' } } }, { name: 'b', outcome: 'pin', proposal: { grade: 'high', osmObject: { id: 'node/2' } } }];
    LV.demoteSharedObjects(rows); assert.deepStrictEqual(rows.map(r => r.proposal.grade), ['high', 'high']);
  });
  await t('replay: every proposal carries source, date, licence, grade', () => {
    for (const r of rep.rows) if (r.proposal) for (const k of ['sourceUrl', 'retrieved', 'licence', 'grade', 'lat', 'lng']) assert.ok(r.proposal[k] != null, `${r.name}.${k}`);
    assert.ok(/OpenStreetMap contributors/.test(rep.meta.attribution));
    for (const r of rep.rows) assert.deepStrictEqual(r.review, { decision: null, by: null, why: null, date: null });
  });
  await t('review assist mirrors the accept bar', () => {
    assert.strictEqual(row('Fictional Fish Market').assist.verdict, 'pass', 'OSM POI + exact address');
    assert.strictEqual(row('Schema Grill').assist.verdict, 'pass', 'official JSON-LD');
    assert.strictEqual(row('Example Museum').assist.verdict, 'hold', 'Wikidata coordinate only');
    assert.strictEqual(row('Twin Shop One').assist.verdict, 'reject', 'shared object');
    assert.strictEqual(row('Ambiguous Cafe').assist.verdict, 'reject');
    const med = LV.reviewAssist({ outcome: 'pin', proposal: { grade: 'med', kind: 'osm-poi' } }); assert.strictEqual(med.verdict, 'hold');
    const poiNoAddr = LV.reviewAssist({ outcome: 'pin', proposal: { grade: 'high', kind: 'osm-poi', nameSim: 1, addressAgreement: { houseNumber: null, street: true } } });
    assert.strictEqual(poiNoAddr.verdict, 'hold');
    assert.ok(/assist/.test(LV.toMarkdown(rep)));
  });
  await t('census second source for med rows: within 50 m → review, far → hold (never a pin)', async () => {
    const r3 = await LV.run({ city: 'testville-zz', registry: fx.registry, scope: ['unverified'], sources: ['nominatim', 'census'], fixtures: fx.responses, mode: 'fixtures', today: '2026-10-11' });
    const near = r3.rows.find(r => r.name === 'Census Near Deli'), far = r3.rows.find(r => r.name === 'Census Far Deli');
    assert.strictEqual(near.proposal.grade, 'med'); assert.strictEqual(near.proposal.kind, 'osm-address', 'census never becomes the proposal');
    assert.ok(near.secondSource.matched && near.secondSource.distanceM <= 50, JSON.stringify(near.secondSource));
    assert.strictEqual(near.assist.verdict, 'review');
    assert.ok(far.secondSource.distanceM > 50); assert.strictEqual(far.assist.verdict, 'hold');
    assert.ok(/2nd source: \[Census\]/.test(LV.toMarkdown(r3)));
  });
  await t('Wikidata closure dates count only for the place itself (not a same-name item 1.5 km away)', () => {
    const r = row('Old Light Tower'); assert.strictEqual(r.outcome, 'conflict');
    assert.ok(!r.statusProposal, 'P576 of a different, far item is not closure evidence');
    assert.ok(row('Example Museum').statusProposal.evidence.some(e => e.type === 'wikidata-P576'), 'a linked QID still counts');
  });
  await t('review assist holds official JSON-LD that names something else (the venue)', () => {
    const v = LV.reviewAssist({ outcome: 'pin', proposal: { grade: 'high', kind: 'official', nameSim: 0.2, matchedName: 'Disney Springs' } });
    assert.strictEqual(v.verdict, 'hold');
  });
  await t('optional-source failures never fail the run; core-source failures do', async () => {
    const mk = (failHost) => ({ count: 0, max: 1e9, cacheHits: 0, nomCount: 0, failures: [], byHost: {},
      async request(url) { const h = new URL(url).host; this.count++; const b = this.byHost[h] = this.byHost[h] || { requests: 0, failed: 0 }; b.requests++;
        if (h === failHost) { b.failed++; this.failures.push(h + ' timeout'); return { status: 0, body: '', error: 'timeout' }; }
        return { status: 599, body: '' }; },
      async json(url, o) { const r = await this.request(url, o); return { ...r, json: null }; } });
    const base = { city: 'testville-zz', registry: fx.registry, scope: ['all'], sources: ['wikidata', 'official'], mode: 'fixtures', today: '2026-10-11' };
    const a = await LV.run({ ...base, http: mk('museum.example') }); assert.strictEqual(a.meta.hardFailure, false, 'official site down is not fatal');
    const b = await LV.run({ ...base, http: mk('www.wikidata.org') }); assert.strictEqual(b.meta.hardFailure, true, 'Wikidata down is fatal');
  });
  await t('name-only Nominatim fallback finds a POI behind a descriptive address; graded med (hold)', () => {
    const r = row('Park Pavilion Grill'); assert.strictEqual(r.outcome, 'pin'); assert.strictEqual(r.proposal.kind, 'osm-poi');
    assert.strictEqual(r.proposal.grade, 'med'); assert.strictEqual(r.assist.verdict, 'hold');
  });
  await t('circuit breaker: a dead official host is skipped after 2 failures; core hosts are never skipped', async () => {
    const http = new LV.Http({ cacheDir: null, maxRequests: 100 });
    const realFetch = global.fetch; let calls = 0;
    global.fetch = async () => { calls++; const e = new Error('x'); e.cause = { code: 'ETIMEDOUT' }; throw e; };
    try {
      for (let i = 0; i < 5; i++) await http.request('https://dead.example/x' + i);
      assert.strictEqual(calls, 2, 'only two real attempts');
      const r = await http.request('https://dead.example/y'); assert.ok(/skipped after repeated failures/.test(r.error));
    } finally { global.fetch = realFetch; }
  });
  await t('assist rules from the Orlando review: coarse Wikidata, part-vs-whole, systems, entrance conflict, no-change', () => {
    const base = { outcome: 'pin', current: { confidence: 'UNVERIFIED' } };
    const wd = (extra) => LV.reviewAssist({ ...base, name: 'ÔMO by Jônt', proposal: { grade: 'high', kind: 'wikidata', nameSim: 1, corroboratedBy: [{}], addressAgreement: {}, ...extra } });
    assert.strictEqual(wd({ coordDecimals: 3 }).verdict, 'hold', '3 decimals is coarse even with a second source');
    assert.strictEqual(wd({ coordDecimals: 6 }).verdict, 'pass');
    assert.strictEqual(LV.coordDecimals(28.595, -81.511), 3); assert.strictEqual(LV.coordDecimals(28.5, -81.5, 0.0001), 4);
    const part = LV.reviewAssist({ ...base, name: "Disney's Coronado Springs Resort (Gran Destino Tower)", proposal: { grade: 'high', kind: 'wikidata', nameSim: 1, coordDecimals: 5, corroboratedBy: [{}], matchedName: "Disney's Coronado Springs Resort", addressAgreement: {} } });
    assert.strictEqual(part.verdict, 'hold');
    const sys = LV.reviewAssist({ ...base, name: 'Disney Skyliner', proposal: { grade: 'high', kind: 'wikidata', nameSim: 1, coordDecimals: 5, corroboratedBy: [{}], addressAgreement: {} } });
    assert.strictEqual(sys.verdict, 'hold');
    const ent = LV.reviewAssist({ outcome: 'conflict', name: 'Big State Park', current: { confidence: 'med' }, proposal: { grade: 'high', kind: 'osm-poi', entrance: true, distanceM: 1870, matchedName: 'Big State Park (Main Entrance)' } });
    assert.strictEqual(ent.verdict, 'review');
    const nc = LV.reviewAssist({ outcome: 'confirm', name: 'X', current: { confidence: 'high' }, proposal: { grade: 'high', kind: 'osm-poi', distanceM: 5 } });
    assert.strictEqual(nc.verdict, 'no-change');
    assert.strictEqual(LV.namesAPart('Hard Rock Hotel (Universal Orlando)', 'Hard Rock Hotel'), false, 'a location qualifier is not a part');
  });
  await t('extended features prefer an entrance object over a centroid', () => {
    const c = (lat, kind, name, extra = {}) => Object.assign({ lat, lng: 1, grade: 'high', kind, source: kind, nameSim: 1, why: [], sourceUrl: kind, retrieved: 'd', name }, extra);
    const d = LV.decide({ name: 'Big State Park', current: { lat: null, lng: null } }, [c(1, 'wikidata', 'Big State Park'), c(1.003, 'osm-poi', 'Big State Park (Main Entrance)')]);
    assert.ok(d.proposal.entrance && d.proposal.kind === 'osm-poi');
  });
  await t('markdown report renders every row', () => {
    const md = LV.toMarkdown(rep); for (const r of rep.rows) assert.ok(md.includes(r.name.replace(/\|/g, '\\|')), r.name);
  });

  await t('offline plan: nothing fetched, nothing proposed, estimate given', async () => {
    const p = await LV.run({ city: 'testville-zz', registry: fx.registry, scope: ['unverified'], sources: ['wikidata', 'wikipedia', 'nominatim', 'overpass', 'official'], mode: 'offline-plan', today: '2026-10-11' });
    assert.ok(p.rows.length > 0 && p.rows.every(r => r.outcome === 'planned' && !r.proposal));
    assert.ok(p.meta.estimate.requests > 0);
  });

  // ── phase 2: government geodata adapters ──
  const P2 = require('./location-verify-phase2.js');
  await t('UTM 32: lat 50 on the central meridian → E 500000, N ≈ 5,538,631 m; round trip < 1 cm', () => {
    const u = P2.toUtm(50, 9); assert.ok(Math.abs(u.e - 500000) < 0.01); assert.ok(Math.abs(u.n - 5538630.7) < 1.5, String(u.n));
    for (const [la, lo] of [[50.94129, 6.95817], [49.2354, 6.9969], [51.2277, 6.7735]]) {
      const b = P2.fromUtm(...Object.values(P2.toUtm(la, lo)));
      assert.ok(Math.abs(b.lat - la) < 1e-7 && Math.abs(b.lng - lo) < 1e-7, `${la},${lo} → ${b.lat},${b.lng}`);
    }
  });
  await t('German address parsing and street normalisation', () => {
    assert.deepStrictEqual(P2.parseAddressDE('Hohe Straße 12a, 50667 Köln, Germany'), { street: 'hohestr', houseNumber: '12a', postcode: '50667', town: 'koln' });
    assert.strictEqual(P2.normStreetDE('Hohe Str.'), P2.normStreetDE('Hohe Strasse'));
    assert.deepStrictEqual(P2.parseAddressDE('St. Johanner Markt 1, 66111 Saarbrücken'), { street: 'stjohannermarkt', houseNumber: '1', postcode: '66111', town: 'saarbrucken' });
    assert.strictEqual(P2.parseAddressDE('Nauwieser Straße, 66111 Saarbrücken').houseNumber, null);
  });
  await t('house-coordinate file: UTM columns convert; wrong file fails loud', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lv-hk-'));
    const u = P2.toUtm(50.94129, 6.95817);
    fs.writeFileSync(path.join(dir, 'hk.txt'), `NBA;STN;HNR;ADZ;PLZ;ONM;OST;NORD\nX;Domkloster;4;;50667;Köln;${u.e.toFixed(2)};${u.n.toFixed(2)}\n`);
    const set = P2.loadHouseCoords(path.join(dir, 'hk.txt'), { licence: 'dl-de/zero-2-0 (synthetic test)' });
    const h = set.index.get('50667|domkloster|4'); assert.ok(h && Math.abs(h.lat - 50.94129) < 1e-6 && Math.abs(h.lng - 6.95817) < 1e-6);
    fs.writeFileSync(path.join(dir, 'bad.csv'), 'a,b,c\n1,2,3\n');
    assert.throws(() => P2.loadHouseCoords(path.join(dir, 'bad.csv')), /need coordinate, street, house number and postcode/);
    // building references without postal data (the open NRW Gebäudereferenzen): town + street + number
    fs.writeFileSync(path.join(dir, 'gebref.csv'), `gemeinde;strasse;hausnummer;zusatz;ostwert;nordwert\nKöln;Domkloster;4;;${u.e.toFixed(2)};${u.n.toFixed(2)}\n`);
    const g = P2.loadHouseCoords(path.join(dir, 'gebref.csv'), { label: 'gebref', licence: 'dl-de/zero-2-0' });
    const hit = P2.houseCandidate([g], { address: 'Domkloster 4, 50667 Köln, Germany' }, '2026-10-11');
    assert.ok(hit && Math.abs(hit.lat - 50.94129) < 1e-6 && hit.kind === 'gov-address');
  });
  await t('ABR guard flags a pin far from its town, stays silent when near', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lv-abr-'));
    fs.writeFileSync(path.join(dir, 'abr.csv'), '市区町村名_英字,大字・町名_英字,代表点_緯度,代表点_経度\nTestshi,Probe-cho,0.5000,-30.5000\n');
    const abr = P2.loadAbr(path.join(dir, 'abr.csv'));
    const far = { address: '1-2 Probe-cho, Testshi, Okinawa, Japan', current: { lat: 0.56, lng: -30.5 } };
    const near = { address: '1-2 Probe-cho, Testshi, Okinawa, Japan', current: { lat: 0.501, lng: -30.5 } };
    assert.ok(/ABR guard: the pin is 6\.7 km/.test(P2.abrGuard(abr, far, LV.haversineM)));
    assert.strictEqual(P2.abrGuard(abr, near, LV.haversineM), null);
  });
  await t('OneMap: no secrets → skipped with a note, credentials never echoed', async () => {
    const r = await P2.onemapToken({}); assert.strictEqual(r.token, null); assert.ok(/secrets are not set/.test(r.note));
    const r2 = await P2.onemapToken({ ONEMAP_EMAIL: 'x@example.invalid', ONEMAP_PASSWORD: 'hunter2' }, async () => ({ ok: false, status: 401 }));
    assert.strictEqual(r2.token, null); assert.ok(!/hunter2|example\.invalid/.test(r2.note));
  });
  await t('replay with phase-2 sources: gov-address → med pin; OneMap building → high pin with SODL attribution', async () => {
    const set = P2.loadHouseCoords(path.join(__dirname, 'location-verify-fixtures', 'house-coords-latlng.csv'), { label: 'synthetic house file', licence: 'dl-de/zero-2-0 (synthetic test)' });
    const r2 = await LV.run({ city: 'testville-zz', registry: fx.registry, scope: ['unverified'], sources: ['nominatim'], fixtures: fx.responses, mode: 'fixtures',
      today: '2026-10-11', houseSets: [set], onemapToken: 'test-token' });
    const haus = r2.rows.find(r => r.name === 'Haus Probe Cafe');
    assert.strictEqual(haus.outcome, 'pin'); assert.strictEqual(haus.proposal.kind, 'gov-address'); assert.strictEqual(haus.proposal.grade, 'med');
    assert.strictEqual(haus.proposal.lat, 0.5071); assert.strictEqual(haus.assist.verdict, 'hold');
    const sg = r2.rows.find(r => r.name === 'Marina Test Tower');
    assert.strictEqual(sg.outcome, 'pin'); assert.strictEqual(sg.proposal.kind, 'onemap'); assert.strictEqual(sg.proposal.grade, 'high');
    assert.strictEqual(sg.assist.verdict, 'pass'); assert.ok(/Singapore Open Data Licence/.test(r2.meta.attributionOneMap));
    assert.ok(!JSON.stringify(r2).includes('test-token'), 'the token never reaches the report');
    assert.ok(/House coordinates: synthetic house file/.test(LV.toMarkdown(r2)));
  });

  // ── --accept: local, reviewed, never a downgrade, counts asserted, audit trail ──
  await t('accept applies only reviewed rows and writes the ledger', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lv-'));
    const geo = path.join(dir, 'geocodes.json'); fs.writeFileSync(geo, JSON.stringify(fx.registry));
    const r2 = JSON.parse(JSON.stringify(rep));
    const set = (name, review) => { r2.rows.find(r => r.name === name).review = review; };
    set('Fictional Fish Market', { decision: 'accept', by: 'reviewer-a', why: 'OSM node matches name + address', date: '2026-10-11' });
    set('Schema Grill', { decision: 'accept', by: 'reviewer-a', why: 'official schema.org geo' });
    set('Example Museum', { decision: 'accept-closed', by: 'reviewer-a', why: 'museum site says closed', statusSource: 'museum.example home page notice (read 2026-10-11)' });
    set('Sample Park', { decision: 'accept', why: 'no reviewer named' });
    set('Ambiguous Cafe', { decision: 'accept', by: 'reviewer-a', why: 'try' });
    set('Twin Shop One', { decision: 'accept', by: 'reviewer-a', why: 'try a low one' });
    const rp = path.join(dir, 'rep.json'); fs.writeFileSync(rp, JSON.stringify(r2));
    const led = path.join(dir, 'ACCEPTED.md');
    const out = LV.accept(rp, { geocodes: geo, ledger: led, waveDir: dir, today: '2026-10-11', allowCi: true });
    assert.strictEqual(out.applied.length, 2);
    assert.strictEqual(out.closures.length, 1);
    assert.strictEqual(out.refused.length, 3, out.refused.join('; '));
    assert.ok(out.refused.some(x => /Twin Shop One: a low \/ shared-object proposal/.test(x)));
    const g = JSON.parse(fs.readFileSync(geo, 'utf8')).cities['testville-zz'];
    assert.strictEqual(g['Fictional Fish Market'].lat, 0.5031); assert.strictEqual(g['Fictional Fish Market'].confidence, 'high');
    assert.ok(/accepted by reviewer-a/.test(g['Fictional Fish Market'].source));
    assert.strictEqual(g['Fictional Fish Market'].statusSource, fx.registry.cities['testville-zz']['Fictional Fish Market'].statusSource, 'status untouched by a coordinate accept');
    assert.strictEqual(g['Example Museum'].status, 'open', 'closures go through geo-merge, not here');
    assert.strictEqual(Object.keys(g).length, Object.keys(fx.registry.cities['testville-zz']).length);
    const wave = JSON.parse(fs.readFileSync(out.wave, 'utf8'));
    assert.strictEqual(wave[0].status, 'closed'); assert.ok(/reviewed by reviewer-a/.test(wave[0].statusSource));
    assert.ok(/Fictional Fish Market/.test(fs.readFileSync(led, 'utf8')));
  });
  await t('accept refuses to downgrade and refuses on CI', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lv-'));
    const geo = path.join(dir, 'geocodes.json'); fs.writeFileSync(geo, JSON.stringify(fx.registry));
    const r2 = { meta: { city: 'testville-zz' }, rows: [{ name: 'Anchor Hall A', outcome: 'move', proposal: { lat: 0.5001, lng: -30.5, grade: 'med', sourceUrl: 'u', retrieved: 'd', kind: 'osm-poi' },
      review: { decision: 'accept', by: 'r', why: 'w' } }] };
    const rp = path.join(dir, 'rep.json'); fs.writeFileSync(rp, JSON.stringify(r2));
    const out = LV.accept(rp, { geocodes: geo, ledger: path.join(dir, 'L.md'), today: '2026-10-11', allowCi: true });
    assert.strictEqual(out.applied.length, 0); assert.ok(/downgrade/.test(out.refused[0]));
    const prev = process.env.GITHUB_ACTIONS; process.env.GITHUB_ACTIONS = 'true';
    try { assert.throws(() => LV.accept(rp, { geocodes: geo }), /refuses to run on CI/); } finally { if (prev === undefined) delete process.env.GITHUB_ACTIONS; else process.env.GITHUB_ACTIONS = prev; }
  });

  if (fails.length) { console.error(`location-verify tests: ${fails.length} FAILED (${n} passed)`); fails.forEach(f => console.error('  ✗ ' + f)); process.exit(1); }
  console.log(`location-verify tests: all ${n} passed`);
})();
