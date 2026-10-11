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
  await t('markdown report renders every row', () => {
    const md = LV.toMarkdown(rep); for (const r of rep.rows) assert.ok(md.includes(r.name.replace(/\|/g, '\\|')), r.name);
  });

  await t('offline plan: nothing fetched, nothing proposed, estimate given', async () => {
    const p = await LV.run({ city: 'testville-zz', registry: fx.registry, scope: ['unverified'], sources: ['wikidata', 'wikipedia', 'nominatim', 'overpass', 'official'], mode: 'offline-plan', today: '2026-10-11' });
    assert.ok(p.rows.length > 0 && p.rows.every(r => r.outcome === 'planned' && !r.proposal));
    assert.ok(p.meta.estimate.requests > 0);
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
