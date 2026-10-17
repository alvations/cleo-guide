#!/usr/bin/env node
'use strict';
/**
 * imagery/fetch-flickr.js — fill the STATED GAPS (places with no usable Commons photo) from Flickr Creative Commons
 * (lane: imagery; R8 gap #1, owner directive 2026-10-17). Modelled on fetch-commons.js and fetch-unsplash.js.
 *
 * Runs where the owner allows the hosts: the GitHub Actions workflow (beta-fetch-unsplash.yml, a step after Commons).
 * api.openverse.org, api.flickr.com and live.staticflickr.com are NOT reachable from the authoring sandbox — there,
 * prepare and --dry-run only. Never through a proxy, mirror or other workaround: a blocked host stops the run (exit 3).
 *
 *   node tools/beta/imagery/fetch-flickr.js --dry-run          # the plan: targets, expected API calls (no network)
 *   node tools/beta/imagery/fetch-flickr.js                    # fetch via Openverse (no key needed)
 *   FLICKR_API_KEY=… node tools/beta/imagery/fetch-flickr.js   # fetch via the Flickr API (flickr.photos.search)
 *
 * The key is read from the environment only (an Actions secret) and is never printed or written anywhere.
 *
 * Exit codes (as fetch-unsplash): 0 = done or nothing to do; 1 = bad option/input; 3 = a host is blocked/unreachable
 * (the plan is printed first); 4 = an API or image request failed. Each run makes at most --budget API calls and stops
 * cleanly; targets that already have a credit row are skipped, so the next run resumes where this one stopped.
 *
 * Options
 *   --dry-run          print the plan only (no network)
 *   --budget <n>       max API calls this run (default 60; Openverse's anonymous limit is low — keep it modest)
 *   --key <target>     only this target (repeatable), e.g. --key landmark:singapore/balestier#goh-chor-tua-pek-kong-temple
 *   --type <t>         only hero | landmark (repeatable)
 *   --per-target <n>   search results inspected per target (default 20)
 *   --min-uploads <n>  refuse an uploader with fewer public photos than this (default 25; licence-laundering guard)
 *   --radius <km>      Flickr API only: a geotagged photo must lie within this distance of the place (default 1.5)
 *   --delay <ms>       pause between API calls (default 1500)
 *
 * Targets: manifest (commons-candidates.json) targets whose `skip` says no usable Commons photo exists (flickrGap) —
 * never venues, food, closed places, Vietnam, copyrighted art or brand stores — in order: heroes, then a guide's lead
 * and first-row cards, then tier-1 sights, then the rest.
 *
 * Per target, the first search result that passes every check is kept (each refusal is printed with its reason):
 *   1. licence: CC0, Public Domain Mark, "No known copyright restrictions" (Flickr Commons), CC BY or CC BY-SA, any
 *      version. NC / ND / all-rights-reserved are refused (the credit gate in photos.js refuses them again).
 *   2. it names the place: a distinctive word of the place's name in the photo TITLE, and either a second name word,
 *      the guide's town in the title or tags, or (Flickr API) a geotag within --radius km of the place's pin.
 *   3. subject: not signage, a close-up, a vehicle, an artwork or print, a map/poster/logo, a performance, a view FROM
 *      the place (the fetch-commons classifiers), not a JPEG-less file, ≥ the widest size the slot needs.
 *   4. licence laundering: no screenshot / press / promo / stock / "courtesy" / © text; no "photo by <someone else>";
 *      the uploader has ≥ --min-uploads public photos.
 *   5. stored like Commons: resized on the runner (sharp) to the slot's widths (hero 960+1280, lead/first-row
 *      500+720+960, other cards 500+720), JPEG; a CREDITS row with full TASL — title, author + profile link, the Flickr
 *      photo page, licence + deed link, "resized" — provider "flickr", review "pending" (the contact-sheet review
 *      refuses by the same rules as Commons). Then: recompress.js, npm run beta, test-imagery, w7-photos.
 */
const fs = require('fs');
const path = require('path');
const fc = require('./fetch-commons');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const MANIFEST = path.join(BETA, 'assets/img/commons-candidates.json');
const CREDITS = path.join(BETA, 'assets/img/CREDITS.json');
const PHOTO_DIR = path.join(BETA, 'assets/img/photos');
const PLACES = path.join(BETA, 'data/places');
const OPENVERSE = 'https://api.openverse.org/v1';
const FLICKR = 'https://api.flickr.com/services/rest/';
const UA = 'CleoGuideBeta/1.0 (https://github.com/alvations/cleo-guide; beta imagery lane, credited self-hosted copies) node';
const NKCR_URL = 'https://www.flickr.com/commons/usage/';

function args(argv) {
  const o = { dry: false, keys: [], types: [], budget: 60, perTarget: 20, minUploads: 25, radius: 1.5, delay: 1500 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i];
    if (a === '--dry-run') o.dry = true;
    else if (a === '--budget') o.budget = +v();
    else if (a === '--key') o.keys.push(v());
    else if (a === '--type') o.types.push(v());
    else if (a === '--per-target') o.perTarget = +v();
    else if (a === '--min-uploads') o.minUploads = +v();
    else if (a === '--radius') o.radius = +v();
    else if (a === '--delay') o.delay = +v();
    else if (a === '-h' || a === '--help') { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(0); }
    else die(`unknown option ${a} (see --help)`);
  }
  if (!(o.budget >= 1 && o.budget <= 2000)) die('--budget must be 1–2000');
  if (!(o.perTarget >= 1 && o.perTarget <= 100)) die('--per-target must be 1–100');
  if (!(o.minUploads >= 0)) die('--min-uploads must be ≥ 0');
  if (!(o.radius > 0 && o.radius <= 50)) die('--radius must be 0–50 km');
  if (!(o.delay >= 0 && o.delay <= 10000)) die('--delay must be 0–10000');
  return o;
}
function die(msg, code = 1) { console.error(`fetch-flickr: ${msg}`); process.exit(code); }

// ---------------------------------------------------------------- which stated gaps Flickr may fill
/** A `skip` reason that only says "no usable Commons photo" — the gaps an honest Flickr photo can fill. Rule gaps
 *  (venue, food, closed, Vietnam, copyrighted art, brand store, signage, themed ride, crowd) are never Flickr targets. */
const GAP_OK = /no (?:commons )?(?:file|photo|honest|usable|view)|nothing usable|only (?:details|interiors|animal|bird|night|vehicles|a 19\d\d photo|photos of the old|files naming)|under 640|every (?:commons )?photo|not found|turned up|no lead image|both vetted|refused/i;
const GAP_NEVER = /venue|food|artwork|sculpture|freedom of panorama|\bFoP\b|brand|signage|closed|vietnam|character|graffiti|mural|copyright|themed|\bride\b|crowd|casino|store\b/i;
const flickrGap = reason => !!reason && GAP_OK.test(reason) && !GAP_NEVER.test(reason);

/** Priority: heroes, lead/first-row cards (manifest `priority`), tier-1 sights, the rest. */
function rank(t, tier) { return t.type === 'hero' ? 0 : t.priority ? 1 : tier === 1 ? 2 : 3; }

// ---------------------------------------------------------------- matching
const fold = s => String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
const GENERIC = /^(the|and|park|museum|gardens?|temple|shrine|hall|building|street|tower|bridge|church|castle|station|square|memorial|national|state|city|island|center|centre|whole|grounds|deck|observation|historic|district|house|lake|river|beach|falls|hill|hills|mount|road|area|village|town|old|new|place|site|former|former|centre)$/;
/** Distinctive words of a place name (Latin ≥ 4 letters, or a CJK run ≥ 2). */
function nameWords(label) {
  const base = String(label || '').replace(/\([^)]*\)/g, ' ').replace(/[—–]\s*(?:CLOSED|guide hero)\b.*$/i, '');
  const latin = fold(base).split(/[^a-z0-9]+/).filter(w => w.length >= 4 && !GENERIC.test(w));
  const cjk = String(label || '').match(/[぀-鿿]{2,}/g) || [];
  return [...new Set([...latin, ...cjk])];
}
/** Town words of a guide key ("singapore/balestier" → ["balestier"], "sanfrancisco" → ["sanfrancisco", "san francisco"]). */
function townWords(page, guideName) {
  const k = page.split('/').pop().replace(/-/g, ' ');
  return [...new Set([k, k.replace(/ /g, ''), ...nameWords(guideName || '')].filter(w => w && w.length >= 4))].map(fold);
}
const haversine = (a, b, c, d) => { const r = x => x * Math.PI / 180, R = 6371, dl = r(c - a), dn = r(d - b); const h = Math.sin(dl / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };

/** Does this result clearly name the place? {ok} or {why}. */
function matches(ph, t) {
  const title = fold(ph.title), tags = fold((ph.tags || []).join(' '));
  const words = nameWords(t.label).concat((t.names || []).flatMap(nameWords));
  const inTitle = [...new Set(words.filter(w => title.includes(fold(w))))];
  if (!inTitle.length) return { why: `the title "${String(ph.title || '').slice(0, 60)}" does not name ${t.label}` };
  const town = t.town || [];
  const second = inTitle.length >= 2 || town.some(w => title.includes(w) || tags.includes(w));
  const geo = ph.lat != null && t.la != null ? haversine(ph.lat, ph.lon, t.la, t.ln) : null;
  if (geo != null && geo > t.radius) return { why: `geotagged ${geo.toFixed(1)} km from the place (> ${t.radius} km)` };
  if (!second && !(geo != null && geo <= t.radius)) return { why: `only "${inTitle[0]}" matches — no second name word, town or geotag to confirm it is ${t.label}` };
  return { ok: { inTitle, geo } };
}

const LAUNDER = /\b(screen ?shots?|screen ?caps?|press (?:photo|release|kit|image)|promo(?:tional)?|publicity|courtesy|official (?:photo|image)|stock (?:photo|image)|getty|shutterstock|alamy|istock|ap photo|reuters|wallpaper|all rights reserved)\b|©|\(c\)/i;
const BY_OTHER = /\b(?:[Pp]hoto(?:graph)?|[Pp]icture|[Ii]mage)\s*(?:by|:|[Cc]redit:?)\s*([A-Z][\w.'-]+(?:\s+[A-Z][\w.'-]+){0,2})/;
/** Subject and laundering refusals on the photo's own text. {why} or null. */
function refusal(ph, t) {
  const text = `${ph.title || ''} ${(ph.tags || []).join(' ')} ${ph.description || ''}`;
  const subj = [[fc.SIGNAGE, 'signage is the subject'], [fc.CLOSEUP, 'a close-up or detail'], [fc.VEHICLES, 'a vehicle or construction is the subject'],
    [fc.ARTWORK, 'an artwork, print or drawing, not the place today'], [fc.NOT_A_PHOTO, 'a map, poster, logo or diagram — not a photo of the place']];
  for (const [re, why] of subj) if (fc.subjectRefused(re, t, `${ph.title || ''} ${(ph.tags || []).join(' ')}`)) return { why };
  if (fc.performerRefused(t, text)) return { why: 'a performance or performer is the subject' };
  if (fc.viewFrom(ph.title, [t.label, ...(t.names || [])])) return { why: 'a view FROM the place, not of it' };
  if (LAUNDER.test(text)) return { why: `licence-laundering risk: "${(LAUNDER.exec(text) || [''])[0]}" in the photo's text` };
  const by = BY_OTHER.exec(`${ph.title || ''} ${ph.description || ''}`);
  if (by && !fold(ph.creator).includes(fold(by[1]).split(' ')[0])) return { why: `credits someone else ("${by[0].slice(0, 40)}") — mixed-author upload` };
  return null;
}

/** Licence → {licence, licenceUrl} or {why}. Openverse codes (by, by-sa, cc0, pdm) or Flickr API ids. */
const FLICKR_LIC = { 4: ['by', '2.0'], 5: ['by-sa', '2.0'], 7: ['nkcr'], 9: ['cc0', '1.0'], 10: ['pdm', '1.0'], 11: ['by', '4.0'], 12: ['by-sa', '4.0'] };
function licenceOf(code, ver) {
  const c = String(code || '').toLowerCase(), v = String(ver || '').trim();
  if (c === 'cc0') return { licence: 'CC0 1.0', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' };
  if (c === 'pdm') return { licence: 'Public domain', licenceUrl: 'https://creativecommons.org/publicdomain/mark/1.0/' };
  // "No known copyright restrictions" is not requested: the gate takes it only from a Flickr Commons institution
  // (flickrCommons: true), which this fetcher cannot verify (orchestrator, R8)
  if ((c === 'by' || c === 'by-sa') && /^\d\.\d$/.test(v)) return { licence: `CC ${c.toUpperCase()} ${v}`, licenceUrl: `https://creativecommons.org/licenses/${c}/${v}/` };
  return { why: `licence ${c || '?'} ${v} is not CC0 / PDM / no known restrictions / CC BY / CC BY-SA` };
}

// ---------------------------------------------------------------- network
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url, opts = {}) {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), opts.timeout || 20000);
  try { return await fetch(url, { headers: { 'User-Agent': UA, Accept: opts.accept || 'application/json' }, signal: ctl.signal, redirect: 'follow' }); }
  finally { clearTimeout(timer); }
}
const qs = o => Object.entries(o).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');

/** Normalised result: {id, title, description, tags[], creator, creatorUrl, pageUrl, imageUrl, width, height, licence code, version, lat, lon, filetype, owner}. */
function fromOpenverse(r) {
  return { id: r.id, title: r.title || '', description: '', tags: (r.tags || []).map(x => x.name), creator: r.creator || '', creatorUrl: r.creator_url || '',
    pageUrl: r.foreign_landing_url || '', imageUrl: r.url || '', width: r.width || 0, height: r.height || 0, code: r.license, ver: r.license_version,
    filetype: r.filetype || (/\.jpe?g(\?|$)/i.test(r.url || '') ? 'jpg' : ''), mature: !!r.mature, via: 'openverse' };
}
function fromFlickr(p) {
  const l = FLICKR_LIC[p.license] || [];
  const img = p.url_l ? [p.url_l, +p.width_l, +p.height_l] : p.url_c ? [p.url_c, +p.width_c, +p.height_c] : p.url_o ? [p.url_o, +p.width_o, +p.height_o] : ['', 0, 0];
  const alias = p.pathalias || p.owner;
  return { id: p.id, title: p.title || '', description: (p.description && p.description._content) || '', tags: String(p.tags || '').split(/\s+/).filter(Boolean),
    creator: p.ownername || '', creatorUrl: `https://www.flickr.com/photos/${alias}/`, pageUrl: `https://www.flickr.com/photos/${alias}/${p.id}/`,
    imageUrl: img[0], width: img[1], height: img[2], code: l[0] || `flickr-${p.license}`, ver: l[1] || '', lat: +p.latitude || null, lon: +p.longitude || null,
    filetype: /\.jpe?g(\?|$)/i.test(img[0]) ? 'jpg' : '', owner: p.owner, via: 'flickr-api' };
}
/** The Flickr profile URL from a result, or null when it isn't one (an Openverse creator_url can be missing). */
const profileOf = u => { const m = /^https?:\/\/(?:www\.)?flickr\.com\/(photos|people)\/([^\s/?#]+)\/?/.exec(u || ''); return m ? `https://www.flickr.com/${m[1]}/${m[2]}/` : null; };
const photoPageOf = u => { const m = /^https?:\/\/(?:www\.)?flickr\.com\/photos\/([^\s/?#]+)\/(\d+)\/?/.exec(u || ''); return m ? `https://www.flickr.com/photos/${m[1]}/${m[2]}/` : null; };

function loadCredits() { const j = JSON.parse(fs.readFileSync(CREDITS, 'utf8')); if (!Array.isArray(j.credits)) die('CREDITS.json has no "credits" array'); return j; }

/** Plan: eligible stated gaps not yet credited, ranked. Pure (no network) — exported for the tests. */
function plan(man, credits, o) {
  const haveRecord = new Set(credits.filter(c => c.record).map(c => `${c.record.page}#${c.record.id}`));
  const haveSlot = new Set(credits.filter(c => c.slot).map(c => `${c.slot.type}:${c.slot.key}`));
  const pages = {};
  const pageOf = page => pages[page] || (pages[page] = (() => { const f = path.join(PLACES, `${page.replace(/\//g, '--')}.json`); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; })());
  const out = [];
  for (const t of man.targets) {
    if (o.keys.length && !o.keys.includes(t.key)) continue;
    if (o.types.length && !o.types.includes(t.type)) continue;
    if (!flickrGap(t.skip)) continue;
    if (t.type !== 'hero' && t.type !== 'landmark') continue;
    const open = Object.assign({}, t, { skip: undefined });   // the gap itself is why Flickr is tried; the record/slot rules still apply
    const where = t.type === 'landmark' ? fc.recordCheck(open) : fc.slotCheck(open);
    if (where.why) { out.push({ t, skip: where.why }); continue; }
    if (where.page ? haveRecord.has(`${where.page}#${where.id}`) : haveSlot.has(`${where.slot.type}:${where.slot.key}`)) { out.push({ t, skip: 'already has a credited photo' }); continue; }
    const page = where.page || where.slot.key, d = pageOf(page) || {}, rec = where.rec || {};
    const widths = t.type === 'hero' ? [960, 1280] : t.priority ? [500, 720, 960] : [500, 720];
    out.push({ t: Object.assign({}, t, { town: townWords(page, d.name || d.title), la: rec.la, ln: rec.ln }), where, widths, r: rank(t, rec.t) });
  }
  return out.sort((a, b) => (a.skip ? 9 : a.r) - (b.skip ? 9 : b.r));
}

async function main() {
  const o = args(process.argv);
  const key = process.env.FLICKR_API_KEY || '';
  const source = key ? 'flickr-api' : 'openverse';
  if (!fs.existsSync(MANIFEST)) die(`no manifest at ${path.relative(ROOT, MANIFEST)}`);
  const man = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const credits = loadCredits();
  const p = plan(man, credits.credits, o), todo = p.filter(x => !x.skip);
  // expected API calls per target: 1 search + ≤ 2 uploader checks (one per result that passes the text checks)
  console.log(`fetch-flickr: source ${source}${key ? ' (FLICKR_API_KEY set)' : ''} — ${p.length} stated gap(s) Flickr may fill: ${todo.length} to try, ${p.length - todo.length} skipped`);
  console.log(`  expected API calls: ${todo.length} search(es) + ≤ ${2 * todo.length} uploader check(s) = ≤ ${3 * todo.length} (budget ${o.budget}); images come from the image host (not counted)`);
  for (const x of p) console.log(x.skip ? `  skip  ${x.t.key} — ${x.skip}` : `  try   ${x.t.key} [${['hero', 'lead/first row', 'tier 1', 'other'][x.r]}] "${x.t.label}" → ${x.widths.join('+')} px`);
  if (o.dry) { console.log('\n--dry-run — nothing fetched.'); return; }
  if (!todo.length) { console.log('\nNothing to do.'); return; }

  // reachability: a policy block (403 from a proxy, DNS failure, reset) stops the run; never routed around
  const host = key ? 'api.flickr.com' : 'api.openverse.org';
  const blocked = detail => die(`${host} is not reachable from here (${detail}).\n  This environment's network policy blocks it — run this step on GitHub Actions. Do NOT route around the block.`, 3);
  let calls = 0;
  const api = async params => {
    if (calls >= o.budget) throw Object.assign(new Error('budget'), { budget: true });
    calls++; if (calls > 1) await sleep(o.delay);
    const url = key ? `${FLICKR}?${qs(Object.assign({ api_key: key, format: 'json', nojsoncallback: 1 }, params))}` : `${OPENVERSE}${params.path}?${qs(params.q)}`;
    let r; try { r = await get(url); } catch (e) { blocked(e.cause ? e.cause.code || e.cause.message : e.message); }
    if ((r.status === 403 || r.status === 407) && !/x-ratelimit|openverse|flickr/i.test([...r.headers.keys()].join(' ') + (r.headers.get('server') || ''))) blocked(`HTTP ${r.status} without API headers — a policy proxy`);
    if (r.status === 429) throw Object.assign(new Error('rate limited'), { budget: true });
    if (r.status === 401) die(key ? 'FLICKR_API_KEY was rejected (401).' : `${host} answered 401 — anonymous access refused.`, 2);
    if (!r.ok) die(`${host} answered HTTP ${r.status}; stopping.`, 4);
    const j = await r.json();
    if (key && j.stat !== 'ok') die(`Flickr API error ${j.code}: ${j.message}`, 4);
    return j;
  };
  const search = async x => {
    const name = x.t.label.replace(/\([^)]*\)/g, ' ').replace(/\s*[—–]\s*guide hero\b.*$/i, '').replace(/\s+/g, ' ').trim();
    const q = (fold(name).includes(x.t.town[0] || '\u0000') ? name : `${name} ${x.t.town[0] || ''}`).trim();
    if (key) {
      const j = await api({ method: 'flickr.photos.search', text: q, license: '4,5,9,10,11,12', content_type: 1, media: 'photos', sort: 'relevance', safe_search: 1, per_page: o.perTarget,
        extras: 'license,owner_name,path_alias,tags,description,geo,url_l,url_c,url_o' });
      return ((j.photos && j.photos.photo) || []).map(fromFlickr);
    }
    const j = await api({ path: '/images/', q: { q, source: 'flickr', license: 'by,by-sa,cc0,pdm', mature: 'false', page_size: o.perTarget } });
    return (j.results || []).map(fromOpenverse);
  };
  const uploads = async ph => {
    if (key) { const j = await api({ method: 'flickr.people.getInfo', user_id: ph.owner }); return +(((j.person || {}).photos || {}).count || {})._content || 0; }
    const j = await api({ path: '/images/', q: { creator: ph.creator, source: 'flickr', page_size: 1 } });
    return +j.result_count || 0;
  };

  const sharp = fc.loadSharp();
  if (!sharp) die('sharp is not installed (npm i sharp in tools/) — needed to resize the copies', 1);
  fs.mkdirSync(PHOTO_DIR, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const kept = [], refused = [];
  let stopped = '';
  try {
    for (const x of todo) {
      const res = await search(x);
      let done = false;
      for (const ph of res) {
        const lic = licenceOf(ph.code, ph.ver);
        const page = photoPageOf(ph.pageUrl), prof = profileOf(ph.creatorUrl) || (page ? page.replace(/\d+\/$/, '') : null);
        const pre = lic.why || (ph.mature && 'marked mature') || (!page && `no flickr.com photo page (${ph.pageUrl || 'none'})`) || (!prof && 'no Flickr profile for the author') ||
          (!String(ph.creator || '').trim() && 'no author name') || (ph.filetype !== 'jpg' && `not a JPEG (${ph.filetype || '?'})`) ||
          (ph.width < Math.max(...x.widths) && `only ${ph.width} px wide (needs ${Math.max(...x.widths)})`);
        if (pre) { refused.push(`${x.t.key} ${ph.id}: ${pre}`); continue; }
        const m = matches(ph, Object.assign({}, x.t, { radius: o.radius }));
        if (m.why) { refused.push(`${x.t.key} ${ph.id}: ${m.why}`); continue; }
        const rf = refusal(ph, x.t) || (fc.authorProblems(ph.creator).length ? { why: `author "${ph.creator}" is not a clean name (${fc.authorProblems(ph.creator).join(', ')})` } : null);
        if (rf) { refused.push(`${x.t.key} ${ph.id}: ${rf.why}`); continue; }
        const n = await uploads(ph);
        if (n < o.minUploads) { refused.push(`${x.t.key} ${ph.id}: uploader has ${n} public photo(s) (< ${o.minUploads}) — licence-laundering guard`); continue; }
        const img = await get(ph.imageUrl, { accept: 'image/*', timeout: 60000 }).catch(e => ({ ok: false, status: 0, headers: { get: () => String(e.cause ? e.cause.code || e.cause.message : e.message) } }));
        if (img.status === 403 || img.status === 407) die(`image host blocked (HTTP ${img.status}) — run on GitHub Actions; do not route around it`, 3);
        if (!img.ok) { refused.push(`${x.t.key} ${ph.id}: image → HTTP ${img.status}`); continue; }
        const src = Buffer.from(await img.arrayBuffer()), base = fc.fileBase(x.t), out = [];
        for (const w of x.widths) {
          const buf = await sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
          const md = await sharp(buf).metadata(), file = `${base}-${md.width}.jpg`;
          fs.writeFileSync(path.join(PHOTO_DIR, file), buf); out.push({ file, w: md.width, h: md.height, kb: Math.round(buf.length / 1024) });
        }
        const main = out[out.length - 1], variants = out.slice(0, -1).map(v => ({ file: v.file, width: v.w, height: v.h }));
        credits.credits = credits.credits.filter(c => c.file !== main.file && !(c.variants || []).some(v => v.file === main.file));
        credits.credits.push({
          file: main.file,
          ...(x.where.page ? { record: { page: x.where.page, id: x.where.id } } : { slot: x.where.slot }),
          title: ph.title.trim() || x.t.label,
          depicts: x.t.label.replace(/\s*\([^)]*\)\s*$/, '').trim(),
          author: ph.creator.trim(),
          authorUrl: prof,
          sourceUrl: page,
          ...lic,
          provider: 'flickr',
          via: ph.via,
          flickrId: String(page.match(/\/(\d+)\/$/)[1]),
          ...(ph.via === 'openverse' ? { openverseId: ph.id } : {}),
          width: main.w, height: main.h,
          ...(variants.length ? { variants } : {}),
          modified: `resized to ${fc.widthList(out.map(v => v.w))} px wide`,
          fetched: today,
          confidence: 'med',
          review: 'pending',
          matched: `title names ${m.ok.inTitle.join(', ')}${m.ok.geo != null ? `; geotag ${m.ok.geo.toFixed(2)} km from the pin` : ''}; uploader has ${n} photos`,
        });
        fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 1) + '\n');   // after each photo, so a stop keeps the work
        kept.push(`${x.t.key} ← ${page} "${ph.title.slice(0, 50)}" by ${ph.creator} (${lic.licence}) → ${out.map(v => `${v.file} ${v.kb} KB`).join(', ')}`);
        done = true; break;
      }
      if (!done) refused.push(`${x.t.key}: no result passed (${res.length} inspected) — keeps its stated gap`);
    }
  } catch (e) {
    if (!e.budget) throw e;
    stopped = e.message === 'budget' ? 'API budget reached — run again to resume' : `${host} rate-limited this run — run again later to resume`;
  }
  console.log(`\nKept ${kept.length}:`); kept.forEach(k => console.log(`  ok    ${k}`));
  console.log(`Refused ${refused.length}:`); refused.forEach(k => console.log(`  no    ${k}`));
  console.log(`API calls this run: ${calls}/${o.budget}.${stopped ? ` ${stopped}.` : ''}`);
  if (kept.length) console.log('Every kept photo is review "pending": contact-sheet it, then node recompress.js, npm run beta, npm test.');
}

if (require.main === module) main().catch(e => die(e.stack || String(e), 4));
module.exports = { flickrGap, nameWords, townWords, matches, refusal, licenceOf, profileOf, photoPageOf, fromOpenverse, fromFlickr, plan, haversine };
