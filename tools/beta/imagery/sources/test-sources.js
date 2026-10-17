#!/usr/bin/env node
'use strict';
/**
 * test-sources.js — image-sources lane (D-50), part of `npm test`. Offline: no host is contacted.
 *
 *  1. candidates.tsv is well-formed (add-candidates --check rules) and every candidate targets an open, non-food,
 *     non-Vietnam place on its beta page.
 *  2. The shared rules (lib.itemProblems): licence, author, identity (the API text names the place), stock = landmarks
 *     only, historic = dated + still looks the same, museum objects only on that museum's page, not-a-photo words.
 *  3. Each adapter's mapping of a recorded API response: LoC rights, Smithsonian CC0, Europeana rights URIs, Met PD,
 *     Pexels/Pixabay fields.
 *  4. A credit row built by the engine passes the credit gate's own field check (photos.creditProblems) for every
 *     licence the gate already takes.
 *  5. End to end with a mocked fetch in a sandbox dir (only when sharp is installed): --stage writes a preview and a
 *     stage row and touches no credit; --credit credits only a reviewed `ok` row, writing 500 + 960 JPEGs.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

let fails = 0;
const ok = (c, m) => { if (c) console.log('  ok  ' + m); else { fails++; console.error('  FAIL ' + m); } };

const lib = require('./lib');
const loc = require('./loc'), met = require('./met'), si = require('./smithsonian'), eu = require('./europeana');
const pexels = require('./pexels'), pixabay = require('./pixabay');
const photos = require('../photos');

// ---------------------------------------------------------------- 1. the manifest
console.log('image sources: candidates.tsv');
let check = '';
try { check = execFileSync(process.execPath, [path.join(__dirname, 'add-candidates.js'), '--check'], { encoding: 'utf8' }); ok(true, `add-candidates --check: ${check.trim().split('\n').pop()}`); }
catch (e) { ok(false, `add-candidates --check failed:\n${e.stdout}`); }
const cands = lib.readCandidates();
ok(cands.length > 0, `${cands.length} rows read`);
const bad = cands.filter(r => !r.refused).map(r => [r, lib.targetCheck(r.target)]).filter(([, t]) => t.why && !/closed/.test(t.why));
ok(!bad.length, `every candidate targets an open, non-food, non-Vietnam place on its page${bad.length ? ': ' + bad.map(([r, t]) => `${r.target} (${t.why})`).join('; ') : ''}`);
ok(cands.every(r => !['pexels', 'pixabay'].includes(r.source) || r.era === 'modern' || r.refused), 'stock rows are modern photos');
ok(cands.every(r => r.review === '' || r.review === 'ok' || r.review.length > 3), 'review is empty, ok, or a reason');

// ---------------------------------------------------------------- 2. shared rules
console.log('image sources: shared rules');
const T = lib.targetCheck('landmark:washingtondc#thomas-jefferson-memorial');
ok(!T.why && T.rec.kind === 'sight', 'target check finds the Jefferson Memorial');
ok(/food/.test(lib.targetCheck('landmark:washingtondc#bens-chili-bowl').why || ''), 'a food place is refused (stock and historic never on food)');
ok(/not on beta page/.test(lib.targetCheck('landmark:washingtondc#no-such-place').why || ''), 'an unknown id is refused');
ok(/bad target/.test(lib.targetCheck('washingtondc#x').why || ''), 'a malformed target is refused');
const good = { title: 'Jefferson Memorial, Washington, D.C.', author: 'Highsmith, Carol M., 1946-', date: '2010', licence: 'Public domain',
  licenceUrl: 'https://www.loc.gov/item/2010630676/', sourceUrl: 'https://www.loc.gov/item/2010630676/', text: 'Memorials Washington (D.C.)', width: 4000 };
const row = { era: 'modern', stillLooks: '', names: '', confidence: 'high' };
const A = { id: 'loc' };
ok(lib.itemProblems(good, row, T, A) === '', 'a complete, named, public-domain item passes');
ok(/author/.test(lib.itemProblems({ ...good, author: '' }, row, T, A)), 'no author → refused (never invented)');
ok(/licence/.test(lib.itemProblems({ ...good, licence: 'CC BY-NC 4.0' }, row, T, A)), 'NC licence → refused');
ok(/does not name/.test(lib.itemProblems({ ...good, title: 'Washington, D.C. monument at dusk', text: '' }, row, T, A)), 'API text not naming the place → refused');
ok(lib.itemProblems({ ...good, title: 'Monument at dusk', text: '' }, { ...row, names: 'Monument at dusk' }, T, A) === '', 'a row alias that the API text carries is accepted');
ok(/date/.test(lib.itemProblems({ ...good, date: '' }, { ...row, era: 'historic', stillLooks: 'yes' }, T, A)), 'historic without a date → refused');
ok(/stillLooks/.test(lib.itemProblems(good, { ...row, era: 'historic', stillLooks: 'partly (walls gone)' }, T, A)), 'historic not still looking the same → refused');
ok(lib.itemProblems(good, { ...row, era: 'historic', stillLooks: 'yes (unchanged since 1943)' }, T, A) === '', 'historic, dated, still looks the same → passes');
ok(/not a place photo/.test(lib.itemProblems({ ...good, text: 'press photo, editorial use only' }, row, T, A)), 'press photo → refused');
ok(/too small/.test(lib.itemProblems({ ...good, width: 500 }, row, T, A)), 'under 640 px → refused');
ok(/landmarks/.test(lib.itemProblems({ ...good, licence: 'Pexels License', licenceUrl: lib.LICENCES['Pexels License'] }, row, { ...T, rec: { ...T.rec, kind: 'venue' } }, { id: 'pexels' })), 'stock on a non-sight → refused');
ok(/museum's page/.test(lib.itemProblems({ ...good, title: 'Vase', text: '' }, row, T, met.adapter)), 'a Met object on another page → refused');
ok(lib.nameWords('Aachener Dom (Pfalzkapelle)').includes('aachener') && !lib.nameWords('The National Park').length, 'name words skip generic words and brackets');

// ---------------------------------------------------------------- 3. adapters
console.log('image sources: adapters');
ok(loc.rightsOf({ rights_advisory: ['No known restrictions on publication.'] }, ['Highsmith, Carol M., 1946-']).licence === 'Public domain', 'LoC Highsmith → Public domain');
ok(loc.rightsOf({ rights_advisory: 'No known restrictions on images made by the U.S. Government; images copied from other sources may be restricted.' }, []).licence === 'Public domain', 'LoC HABS (U.S. Government) → Public domain');
ok(loc.rightsOf({ rights_advisory: 'No known restrictions on publication.' }, ['Detroit Publishing Co.']).licence === 'No known restrictions', 'LoC other NKR → the pre-1930 LoC licence string');
const nkr = { ...good, author: 'Detroit Publishing Co.', licence: 'No known restrictions' };
ok(lib.itemProblems({ ...nkr, date: 'c. 1905' }, { ...row, era: 'historic', stillLooks: 'yes' }, T, A) === '', 'LoC NKR on a historic row dated c. 1905 → passes');
ok(/1929/.test(lib.itemProblems({ ...nkr, date: '1934' }, { ...row, era: 'historic', stillLooks: 'yes' }, T, A)), 'LoC NKR dated 1934 → refused');
ok(/1929/.test(lib.itemProblems({ ...nkr, date: '1905' }, row, T, A)), 'LoC NKR on a modern row → refused');
ok(/rights/.test(loc.rightsOf({ rights_advisory: 'Rights status not evaluated.' }, []).refused || ''), 'LoC not evaluated → refused');
ok(/no rights/.test(loc.rightsOf({}, []).refused || ''), 'LoC without a rights advisory → refused');
const urls = ['https://tile.loc.gov/a_150px.jpg#h=100&w=150', 'https://tile.loc.gov/a.gif#h=200&w=300', 'https://tile.loc.gov/av.jpg#h=640&w=1024', 'https://tile.loc.gov/ar.jpg#h=3000&w=4500'];
ok(loc.pickImage(urls, 960).url === 'https://tile.loc.gov/av.jpg' && loc.pickImage(urls, 5000).w === 4500, 'LoC picks the smallest image at least as wide as asked, else the largest');
ok(loc.idOf({ itemUrl: 'https://www.loc.gov/pictures/item/2011630123/' }) === '2011630123', 'LoC id from a /pictures/item/ URL');
const siRec = { descriptiveNonRepeating: { title: { content: 'View of Jefferson Memorial' }, record_link: 'http://n2t.net/ark:/65665/x', data_source: 'NMAH', metadata_usage: { access: 'CC0' },
  online_media: { media: [{ type: 'Images', content: 'https://ids.si.edu/ids/deliveryService?id=NMAH-1', usage: { access: 'CC0' } }] } }, freetext: { name: [{ label: 'Photographer', content: 'Jane Doe' }], date: [{ content: '1950s' }] } };
const s1 = si.fromRecord(siRec, 'nmah_1839135');
ok(!s1.refused && s1.author === 'Jane Doe' && s1.licence === 'CC0 1.0' && /&max=960$/.test(s1.imageUrl(960)) && /^https:/.test(s1.sourceUrl), 'Smithsonian CC0 record → CC0 item, ids.si.edu sized URL, https source');
ok(/not CC0/.test(si.fromRecord({ ...siRec, descriptiveNonRepeating: { ...siRec.descriptiveNonRepeating, metadata_usage: { access: 'Usage conditions apply' } } }, 'x').refused), 'Smithsonian "Usage conditions apply" → refused');
ok(!si.fromRecord({ ...siRec, freetext: {} }, 'x').author, 'Smithsonian without a named maker → no author (so refused)');
ok(lib.licenceFromUri('http://creativecommons.org/publicdomain/mark/1.0/').licence === 'Public domain', 'Europeana PDM → Public domain');
ok(lib.licenceFromUri('http://creativecommons.org/licenses/by-sa/4.0/').licence === 'CC BY-SA 4.0', 'Europeana BY-SA 4.0');
ok(!lib.licenceFromUri('http://creativecommons.org/licenses/by-nc/4.0/') && !lib.licenceFromUri('http://rightsstatements.org/vocab/InC/1.0/') && !lib.licenceFromUri('http://rightsstatements.org/vocab/NoC-NC/1.0/'), 'Europeana NC / InC / NoC-NC → refused');
ok(String(eu.recordOf({ itemUrl: 'https://www.rijksmuseum.nl/en/collection/RP-F-F06191', itemId: 'RP-F-F06191' })) === '90402,RP_F_F06191', 'a Rijksmuseum object maps to Europeana 90402');
ok(String(eu.recordOf({ itemUrl: 'https://www.europeana.eu/en/item/463/item_T7M' })) === '463,item_T7M', 'a Europeana item URL is parsed');
const euObj = { about: '/90402/RP_F_F06191', aggregations: [{ edmRights: { def: ['http://creativecommons.org/publicdomain/mark/1.0/'] }, edmIsShownBy: 'https://lh3.example/x.jpg', edmDataProvider: { def: ['Rijksmuseum'] } }],
  proxies: [{ dcTitle: { en: ['Porta Nigra in Trier'] }, dcCreator: { def: ['anonymous'] } }, { dcCreator: { def: ['Johann Kühnen'] }, dcDate: { def: ['c. 1880'] } }] };
const e1 = eu.fromObject(euObj);
ok(!e1.refused && e1.author === 'Johann Kühnen' && e1.licence === 'Public domain' && e1.sourceUrl === 'https://www.europeana.eu/item/90402/RP_F_F06191' && e1.institution === 'Rijksmuseum via Europeana', 'Europeana record → PDM item, a named creator (not "anonymous"), provider credited');
const anonEu = eu.fromObject({ ...euObj, proxies: [{ dcTitle: { en: ['Porta Nigra in Trier'] }, dcCreator: { def: ['anoniem'] } }] });
ok(!anonEu.author && anonEu.anonymous, 'Europeana anonymous creator → no author, flagged anonymous');
const anonIt = { ...good, author: '', anonymous: true, institution: 'Rijksmuseum via Europeana' };
ok(lib.itemProblems({ ...anonIt }, { ...row, era: 'historic', stillLooks: 'yes' }, T, A) === '', 'D-52: anonymous as catalogued, PD, historic → passes');
const anonDone = { ...anonIt }; lib.itemProblems(anonDone, { ...row, era: 'historic', stillLooks: 'yes' }, T, A);
ok(anonDone.author === 'Anonymous (as catalogued by Rijksmuseum via Europeana)', 'D-52: the credit reads "Anonymous (as catalogued by <institution>)"');
ok(/anonymous/.test(lib.itemProblems({ ...anonIt }, row, T, A)), 'D-52: anonymous on a modern row → refused');
ok(/anonymous/.test(lib.itemProblems({ ...anonIt, licence: 'CC BY 4.0', licenceUrl: 'https://creativecommons.org/licenses/by/4.0/' }, { ...row, era: 'historic', stillLooks: 'yes' }, T, A)), 'D-52: anonymous on a CC BY row → refused');
ok(/never invented/.test(lib.itemProblems({ ...good, author: '' }, { ...row, era: 'historic', stillLooks: 'yes' }, T, A)), 'D-52: an author the institution leaves blank (not catalogued anonymous) → refused');
const m1 = { isPublicDomain: false, primaryImage: 'https://images.metmuseum.org/x.jpg', title: 'x' };
ok(met.idOf({ itemUrl: 'https://www.metmuseum.org/art/collection/search/264242' }) === '264242', 'Met id from its URL');
ok(pexels.idOf({ itemUrl: 'https://www.pexels.com/photo/shuri-castle-in-naha-12345678/' }) === '12345678' && pexels.slugWords('https://www.pexels.com/photo/shuri-castle-in-naha-12345678/') === 'shuri castle in naha', 'Pexels id and slug words from the URL');
const px = pexels.fromPhoto({ id: 1, url: 'https://www.pexels.com/photo/shuri-castle-1/', photographer: 'A B', alt: 'Shuri Castle', width: 4000, src: { original: 'https://images.pexels.com/1.jpeg' } });
ok(px.licence === 'Pexels License' && /w=960/.test(px.imageUrl(960)), 'Pexels photo → Pexels License, sized URL');
ok(/illustration/.test(pixabay.fromHit({ type: 'illustration', pageURL: 'https://pixabay.com/photos/x-1/' }).refused), 'Pixabay illustration → refused');
ok(pixabay.idOf({ itemUrl: 'https://pixabay.com/photos/kinkaku-ji-temple-kyoto-1234567/' }) === '1234567', 'Pixabay id from its URL');
void m1;

// ---------------------------------------------------------------- 4. the credit row meets the gate
console.log('image sources: credit rows vs the gate');
const main = { file: 'washingtondc--thomas-jefferson-memorial-960.jpg', w: 960, h: 640 }, small = { file: 'washingtondc--thomas-jefferson-memorial-500.jpg', w: 500, h: 333 };
for (const [name, it] of [['LoC public domain', good], ['Smithsonian CC0', { ...good, licence: 'CC0 1.0', licenceUrl: lib.LICENCES['CC0 1.0'] }], ['Europeana CC BY-SA', { ...good, licence: 'CC BY-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' }]]) {
  const c = lib.creditRow(loc.adapter, it, { ...row, itemId: '2010630676', era: 'historic', identityEvidence: 'title names it' }, T, main, small, '2026-10-17');
  const p = photos.creditProblems(c);
  ok(!p.length && c.era === 'historic' && c.date && c.institution && c.variants.length === 1, `${name}: the row passes photos.creditProblems and carries era, date, institution, one variant${p.length ? ' — ' + p.join('; ') : ''}`);
}
const stockRow = lib.creditRow(pexels.adapter, px, { ...row, itemId: '1' }, T, main, null, '2026-10-17');
{ // the stock licence lands in the gate via the imagery lane (D-52(3)); until then the gate refuses it by licence
  const pp = photos.creditProblems(stockRow), gateHasStock = photos.LICENCE_OK.test('Pexels License');
  ok(gateHasStock ? !pp.length : pp.some(x => /licence/.test(x)), `a Pexels row: ${gateHasStock ? 'passes the gate field check' : 'refused by licence until the gate change lands'}${gateHasStock && pp.length ? ' — ' + pp.join('; ') : ''}`);
}

// ---------------------------------------------------------------- 5. end to end, mocked network
let finished = false;   // an e2e that never settles must not exit 0 silently
process.on('exit', () => { if (!finished) { console.error('  FAIL end to end never finished (event loop emptied)'); process.exitCode = 1; } });
(async () => {
  const sharp = lib.loadSharp();
  if (!sharp) { console.log('image sources: end to end — SKIP (sharp not installed; cd tools && npm install --no-save sharp)'); return; }
  console.log('image sources: end to end (mocked fetch, sandbox dir)');
  const box = fs.mkdtempSync(path.join(os.tmpdir(), 'cleo-sources-'));
  fs.writeFileSync(path.join(box, 'CREDITS.json'), JSON.stringify({ credits: [] }));
  const head = lib.COLUMNS.join('\t');
  const mk = (id, review) => lib.COLUMNS.map(c => ({ target: 'landmark:washingtondc#thomas-jefferson-memorial', source: 'met', itemId: id, itemUrl: `https://www.metmuseum.org/art/collection/search/${id}`,
    era: 'historic', stillLooks: 'yes', confidence: 'high', identityEvidence: 'title names the memorial', review }[c] || '')).join('\t');
  fs.writeFileSync(path.join(box, 'candidates.tsv'), [head, mk('111', ''), mk('222', 'ok'), mk('333', 'wrong building'), mk('444', '')].join('\n') + '\n');
  const jpeg = await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#7799bb' } }).jpeg().toBuffer();
  const realFetch = global.fetch, calls = [];
  let dropped = 0;
  global.fetch = async url => {
    calls.push(String(url));
    if (/objects\/111/.test(url) && !dropped++) throw new TypeError('terminated');   // run #1: a dropped connection is retried, not fatal
    // run #105 lesson: 444's image sends headers and then never finishes its body — a per-file timeout, never a hung run
    if (/images\.metmuseum\.org\/444/.test(url)) return new Response(new ReadableStream({ start(c) { c.enqueue(new Uint8Array(10)); } }), { status: 200, headers: { 'content-type': 'image/jpeg' } });
    if (/images\.metmuseum/.test(url)) return new Response(jpeg, { status: 200, headers: { 'content-type': 'image/jpeg' } });
    const id = (/objects\/(\d+)/.exec(url) || [])[1];
    return new Response(JSON.stringify({ objectID: +id, isPublicDomain: true, primaryImage: `https://images.metmuseum.org/${id}.jpg`, title: 'Jefferson Memorial, Washington', artistDisplayName: 'Theodor Horydczak', objectDate: '1943', objectURL: `https://www.metmuseum.org/art/collection/search/${id}` }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const env = process.env.CLEO_SOURCES_SANDBOX, argv = process.argv;
  process.env.CLEO_SOURCES_SANDBOX = box;
  for (const k of Object.keys(require.cache)) if (k.startsWith(__dirname)) delete require.cache[k];
  const L = require('./lib'), M = require('./met');
  const keep = setInterval(() => {}, 200);   // a mocked stall holds no socket; keep the loop alive as a real one would
  const log = console.log; console.log = () => {};
  try {
    process.argv = ['node', 'met.js', '--stage', '--delay', '1', '--image-timeout', '800'];
    const c1 = await L.main(M.adapter);
    const st = JSON.parse(fs.readFileSync(path.join(box, 'stage/met/stage.json'), 'utf8'));
    const cr1 = JSON.parse(fs.readFileSync(path.join(box, 'CREDITS.json'), 'utf8')).credits;
    process.argv = ['node', 'met.js', '--credit', '--delay', '0'];
    const c2 = await L.main(M.adapter);
    const cr2 = JSON.parse(fs.readFileSync(path.join(box, 'CREDITS.json'), 'utf8')).credits;
    console.log = log;
    ok(!st.rows.some(r => r.itemId === '444'), 'a stalled image body (444) is skipped unrecorded within the cap, and the run finishes');
    ok(c1 === 0 && st.rows.length === 1 && st.rows[0].itemId === '111' && fs.existsSync(path.join(box, 'stage/met', st.rows[0].preview)), '--stage stages only the un-reviewed row (111), with a preview file');
    ok(cr1.length === 0, '--stage credits nothing');
    ok(c2 === 0 && cr2.length === 1 && cr2[0].sourceId === '222' && cr2[0].provider === 'the-met' && cr2[0].era === 'historic' && cr2[0].date === '1943', '--credit credits only the reviewed ok row (222), never the refused one (333)');
    ok(cr2[0].review === 'ok', 'the credited row carries review "ok" (photos.js renders only reviewed rows)');
    const f960 = path.join(box, 'photos', cr2[0].file), f500 = path.join(box, 'photos', cr2[0].variants[0].file);
    ok(fs.existsSync(f960) && fs.existsSync(f500) && cr2[0].width === 960 && cr2[0].variants[0].width === 500 && !photos.creditProblems(cr2[0]).length, '--credit writes 960 + 500 JPEGs and a gate-clean row');
    ok(!calls.some(u => /objects\/333/.test(u)), 'a refused review is never even read from the API');
    ok(dropped >= 2 && calls.filter(u => /objects\/111/.test(u)).length === 2, 'a dropped connection ("terminated") is retried once and the item still staged');
  } catch (e) { console.log = log; ok(false, `end to end threw: ${e.stack}`); }
  finally {
    clearInterval(keep); global.fetch = realFetch; process.argv = argv;
    if (env == null) delete process.env.CLEO_SOURCES_SANDBOX; else process.env.CLEO_SOURCES_SANDBOX = env;
    fs.rmSync(box, { recursive: true, force: true });
  }
})().then(() => {
  finished = true;
  console.log(fails ? `\nimage sources: ${fails} FAIL` : '\nimage sources: all ok');
  process.exitCode = fails ? 1 : 0;
});
