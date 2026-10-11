#!/usr/bin/env node
'use strict';
/**
 * imagery/fetch-unsplash.js — turn the Unsplash CANDIDATE manifest into credited local photos (lane: imagery).
 *
 * Run ONLY where the owner has allowed api.unsplash.com and images.unsplash.com under the environment's network
 * policy. It never routes around a block: no proxies, mirrors, CI fetchers or alternate hosts. If either host is
 * unreachable it stops with a clear message and writes nothing.
 *
 *   node tools/beta/imagery/fetch-unsplash.js                                  # dry run: the plan, no network, no key
 *   UNSPLASH_ACCESS_KEY=… node tools/beta/imagery/fetch-unsplash.js --go       # fetch, store, credit
 *
 * Options
 *   --go                 actually call the API and write files (default is a dry run that prints the plan)
 *   --key <target>       only this target (repeatable), e.g. --key landmark:tokyo#senso-ji
 *   --type <t>           only hero | landmark | cover (repeatable)
 *   --min high|med       lowest candidate confidence to consider (default high)
 *   --allow-flag <f>     accept candidates carrying this flag (repeatable): people-visible, public-art-check,
 *                        venue-check, artwork-check, possibly-plus. Only after you have LOOKED at the photo.
 *   --width <px>         stored width (default 960)
 *
 * Per target it takes the first candidate that passes, in manifest order:
 *   1. GET https://api.unsplash.com/photos/:id — the API, not the search snippet, is the truth: the id must match,
 *      the photo must not be Unsplash+ / premium, and for a landmark the API's own text (description, alt
 *      description, location, tags) must name the place (a word of the target label), else it is refused.
 *   2. GET the photo's links.download_location — Unsplash API guidelines require this "download" event whenever
 *      a photo is used.
 *   3. GET urls.raw with imgix params (w=<width>, fm=webp, q=75) from images.unsplash.com — resized server-side,
 *      so no local image library is needed — and store it as beta/assets/img/photos/<name>-<width>.webp.
 *   4. Write/replace its row in beta/assets/img/CREDITS.json: "Photo by <name> on Unsplash", photographer and photo
 *      links (with utm_source/utm_medium as the guidelines ask), licence "Unsplash License".
 * Then: cd tools && npm run beta && npm test — the credit gate (photos.js) renders the photo with its caption, or
 * names the exact problem.
 *
 * Never fetched: food places and venues (the manifest has none), closed places, Vietnamese places (no freedom of
 * panorama), Unsplash+ photos, a target whose record is not on its beta page.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const MANIFEST = path.join(BETA, 'assets/img/unsplash-candidates.json');
const CREDITS = path.join(BETA, 'assets/img/CREDITS.json');
const PHOTO_DIR = path.join(BETA, 'assets/img/photos');
const PLACES = path.join(BETA, 'data/places');
const API = 'https://api.unsplash.com';
const IMG_HOST = 'https://images.unsplash.com';
const UTM = 'utm_source=cleo_guide&utm_medium=referral';
const LICENCE = { licence: 'Unsplash License', licenceUrl: 'https://unsplash.com/license' };
const RANK = { high: 3, med: 2, low: 1 };

function args(argv) {
  const o = { go: false, keys: [], types: [], min: 'high', allow: [], width: 960 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i];
    if (a === '--go') o.go = true;
    else if (a === '--key') o.keys.push(v());
    else if (a === '--type') o.types.push(v());
    else if (a === '--min') o.min = v();
    else if (a === '--allow-flag') o.allow.push(v());
    else if (a === '--width') o.width = +v();
    else if (a === '-h' || a === '--help') { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(0); }
    else die(`unknown option ${a} (see --help)`);
  }
  if (!RANK[o.min] || o.min === 'low') die('--min must be high or med (low candidates are never fetched)');
  if (!(o.width >= 320 && o.width <= 1600)) die('--width must be 320–1600');
  return o;
}
function die(msg, code = 1) { console.error(`fetch-unsplash: ${msg}`); process.exit(code); }

/** File name for a target: landmark → <page with / → -->--<id>, hero/cover → hero--<key> / cover--<key>. */
function fileBase(t) {
  if (t.type === 'landmark') { const [page, id] = t.depicts.split('#'); return `${page.replace(/\//g, '--')}--${id}`; }
  return `${t.type}--${t.depicts.replace(/^(hub|collection):/, '').replace(/\//g, '--')}`;
}

/** The beta record a landmark target depicts, or a reason it may not get a photo. */
function recordCheck(t) {
  const [page, id] = t.depicts.split('#');
  const f = path.join(PLACES, `${page.replace(/\//g, '--')}.json`);
  if (!fs.existsSync(f)) return { why: `no beta page ${page}` };
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  const rec = (d.places || []).find(p => p.id === id);
  if (!rec) return { why: `${id} is not on beta page ${page}` };
  if (rec.kind === 'food') return { why: 'food place — never a photo' };
  if (/CLOSED/.test(rec.n)) return { why: 'closed place — never a photo' };
  if (d.country === 'vietnam' || page.startsWith('vietnam/')) return { why: 'Vietnam has no freedom of panorama' };
  return { page, id, rec };
}

function slotCheck(t) {
  const key = t.depicts.replace(/^(hub|collection):/, '');
  if (t.type === 'hero' && (key === 'vietnam' || key.startsWith('vietnam/'))) return { why: 'Vietnam hub hero needs an owner decision (no freedom of panorama); not fetched' };
  return { slot: { type: t.type, key } };
}

/** Words of the target label that the API text must contain for a landmark (Latin words ≥ 4 chars, or any CJK run). */
function labelWords(label) {
  const base = label.replace(/\([^)]*\)/g, ' ');
  const latin = base.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().split(/[^a-z0-9]+/)
    .filter(w => w.length >= 4 && !/^(the|and|park|museum|gardens?|temple|shrine|hall|building|street|tower|bridge|church|castle|station|square|memorial|national|state|city|island|center|centre|whole|grounds|deck|observation)$/.test(w));
  const cjk = label.match(/[぀-鿿]{2,}/g) || [];
  return [...latin, ...cjk];
}
function apiText(p) {
  return [p.description, p.alt_description, p.location && p.location.name, p.location && p.location.city,
    ...(p.tags || []).map(x => x.title), ...(p.tags_preview || []).map(x => x.title)]
    .filter(Boolean).join(' ').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

async function get(url, key, opts = {}) {
  const headers = { 'Accept-Version': 'v1', ...(key ? { Authorization: `Client-ID ${key}` } : {}) };
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), opts.timeout || 20000);
  try { return await fetch(url, { headers, signal: ctl.signal, redirect: 'follow' }); }
  finally { clearTimeout(timer); }
}

/** Both hosts must answer from this environment; a policy block (403 from a proxy, DNS failure, reset) stops the run. */
async function preflight(key) {
  const blocked = (host, detail) => die(`${host} is not reachable from here (${detail}).\n` +
    '  This environment\'s network policy blocks it. Ask the owner to allow api.unsplash.com and images.unsplash.com,\n' +
    '  then re-run. Do NOT route around the block (no proxies, mirrors, CI fetchers or other hosts).', 3);
  let r;
  try { r = await get(`${API}/photos?per_page=1`, key, { timeout: 10000 }); }
  catch (e) { blocked('api.unsplash.com', e.cause ? e.cause.code || e.cause.message : e.message); }
  if (r.status === 401) die('UNSPLASH_ACCESS_KEY was rejected by the API (401). Check the key (Access Key, not Secret).', 2);
  if (r.status === 403 && !/x-ratelimit/i.test([...r.headers.keys()].join(' '))) blocked('api.unsplash.com', 'HTTP 403 without API headers — a policy proxy');
  if (!r.ok) die(`api.unsplash.com answered HTTP ${r.status}; not continuing.`, 3);
  try { const i = await get(`${IMG_HOST}/`, null, { timeout: 10000 }); if (i.status === 403 || i.status === 407) blocked('images.unsplash.com', `HTTP ${i.status} — a policy proxy`); }
  catch (e) { blocked('images.unsplash.com', e.cause ? e.cause.code || e.cause.message : e.message); }
}

function loadCredits() {
  const j = JSON.parse(fs.readFileSync(CREDITS, 'utf8'));
  if (!Array.isArray(j.credits)) die('CREDITS.json has no "credits" array');
  return j;
}
const withUtm = u => `${u}${u.includes('?') ? '&' : '?'}${UTM}`;

async function main() {
  const o = args(process.argv);
  const key = process.env.UNSPLASH_ACCESS_KEY;
  const noKey = 'UNSPLASH_ACCESS_KEY is not set. Create an Unsplash developer app, put its Access Key in the\n' +
    '  environment (never in the repo), and run where api.unsplash.com and images.unsplash.com are allowed.';
  if (!key && o.go) die(noKey, 2);
  if (!fs.existsSync(MANIFEST)) die(`no manifest at ${path.relative(ROOT, MANIFEST)}`);
  const man = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const targets = man.targets.filter(t => (!o.keys.length || o.keys.includes(t.key)) && (!o.types.length || o.types.includes(t.type)));
  if (!targets.length) die('no target matches --key/--type');

  const plan = [];
  for (const t of targets) {
    const where = t.type === 'landmark' ? recordCheck(t) : slotCheck(t);
    if (where.why) { plan.push({ t, skip: where.why }); continue; }
    const cands = t.candidates.filter(c => RANK[c.confidence] >= RANK[o.min] && (c.flags || []).every(f => o.allow.includes(f)));
    if (!cands.length) { plan.push({ t, skip: t.candidates.length ? `no ${o.min}+ candidate without an unaccepted flag` : 'no candidate (gap stated in the manifest)' }); continue; }
    plan.push({ t, where, cands });
  }
  const todo = plan.filter(p => !p.skip);
  console.log(`fetch-unsplash: ${targets.length} target(s): ${todo.length} to try, ${plan.length - todo.length} skipped`);
  for (const p of plan) console.log(p.skip ? `  skip  ${p.t.key} — ${p.skip}` : `  try   ${p.t.key} → ${p.cands.map(c => `${c.id} (${c.confidence})`).join(', ')}`);
  if (!o.go) { console.log(`\nDry run — nothing fetched. Add --go to fetch (needs api.unsplash.com + images.unsplash.com allowed${key ? '' : ' and UNSPLASH_ACCESS_KEY set'}).`); return; }

  await preflight(key);
  fs.mkdirSync(PHOTO_DIR, { recursive: true });
  const credits = loadCredits();
  const today = new Date().toISOString().slice(0, 10);
  let done = 0;
  for (const p of todo) {
    let stored = false;
    for (const c of p.cands) {
      const r = await get(`${API}/photos/${encodeURIComponent(c.id)}`, key);
      if (r.status === 404) { console.log(`  ${p.t.key}: ${c.id} no longer exists — next`); continue; }
      if (!r.ok) die(`GET /photos/${c.id} → HTTP ${r.status}; stopping (rate limit or outage).`, 4);
      const ph = await r.json();
      if (ph.id !== c.id) { console.log(`  ${p.t.key}: ${c.id} API id mismatch (${ph.id}) — next`); continue; }
      if (ph.premium || ph.plus) { console.log(`  ${p.t.key}: ${c.id} is Unsplash+ (paid licence) — refused`); continue; }
      if (p.t.type === 'landmark') {
        const words = labelWords(p.t.label), text = apiText(ph);
        if (words.length && !words.some(w => text.includes(w.toLowerCase()))) { console.log(`  ${p.t.key}: ${c.id} — the API text does not name ${p.t.label} — refused`); continue; }
      }
      // Required by the API guidelines: register the download.
      const dl = await get(ph.links.download_location, key);
      if (!dl.ok) die(`download_location for ${c.id} → HTTP ${dl.status}; stopping.`, 4);
      const imgUrl = `${ph.urls.raw}${ph.urls.raw.includes('?') ? '&' : '?'}w=${o.width}&fm=webp&q=75&fit=max`;
      const img = await get(imgUrl, null, { timeout: 60000 });
      const type = img.headers.get('content-type') || '';
      if (!img.ok || !/image\/webp/.test(type)) die(`image for ${c.id} → HTTP ${img.status} ${type}; stopping.`, 4);
      const buf = Buffer.from(await img.arrayBuffer());
      const file = `${fileBase(p.t)}-${o.width}.webp`;
      fs.writeFileSync(path.join(PHOTO_DIR, file), buf);
      const name = ph.user && ph.user.name ? ph.user.name.trim() : ph.user.username;
      const row = {
        file,
        ...(p.where.page ? { record: { page: p.where.page, id: p.where.id } } : { slot: p.where.slot }),
        title: p.t.label,
        depicts: (ph.alt_description || ph.description || p.t.label).replace(/\s+/g, ' ').trim(),
        author: name,
        authorUrl: withUtm(ph.user.links.html),
        sourceUrl: withUtm(ph.links.html),
        ...LICENCE,
        provider: 'unsplash',
        unsplashId: ph.id,
        credit: `Photo by ${name} on Unsplash`,
        modified: `resized to ${o.width} px wide, WebP`,
        fetched: today,
        confidence: c.confidence,
      };
      credits.credits = credits.credits.filter(x => x.file !== file);
      credits.credits.push(row);
      console.log(`  ok    ${p.t.key} ← ${c.id} by ${name} → photos/${file} (${Math.round(buf.length / 1024)} KB)`);
      stored = true; done++; break;
    }
    if (!stored) console.log(`  none  ${p.t.key} — every candidate refused; the target keeps its motif`);
  }
  fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 1) + '\n');
  console.log(`\n${done} photo(s) stored and credited. Now: cd tools && npm run beta && npm test`);
}

if (require.main === module) main().catch(e => die(e.stack || String(e)));
module.exports = { fileBase, labelWords, apiText, recordCheck, slotCheck };
