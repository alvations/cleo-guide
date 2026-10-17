'use strict';
/**
 * imagery/sources/lib.js — the shared engine behind every image-source fetcher in this directory (lane: image sources,
 * D-50). One adapter per source (loc.js, met.js, smithsonian.js, europeana.js, nypl.js, pexels.js, pixabay.js) says how
 * to read ONE item from that source's API; this file does everything else, the same way for all of them:
 *
 *   node tools/beta/imagery/sources/<source>.js                # plan only when the key or the hosts are missing (exit 0)
 *   node tools/beta/imagery/sources/<source>.js --stage        # API-check + preview copies + contact sheet (NOT credited)
 *   node tools/beta/imagery/sources/<source>.js --credit       # credit the rows a person marked `ok` after review
 *   node tools/beta/imagery/sources/<source>.js --dry-run      # plan only, even with a key and hosts
 *   --include-covered: also stage targets that already have a live vetted Commons candidate (skipped by default)
 *
 * Two stages, because nothing is credited before a person has looked at it (D-49, D-50):
 *   1. --stage (the default when the hosts answer): for each un-reviewed candidate row of this source in
 *      candidates.tsv, read the item from the source's API (the API, not the search snippet, is the truth), apply the
 *      checks below, and store a 320 px preview under design/beta/imagery-sources/stage/<source>/ plus a row in
 *      stage.json. contact.js then draws the contact sheet the orchestrator reviews. Nothing goes into beta/.
 *   2. --credit: only rows whose `review` column is `ok` (a person looked at the preview). Re-reads the item, applies
 *      the same checks, stores 500 + 960 px JPEGs in beta/assets/img/photos/ and writes the TASL row to
 *      beta/assets/img/CREDITS.json (then recompress.js, npm run beta and the gates, as for Commons).
 *
 * Checks (both stages; a failed check refuses the candidate with its reason, never a guess):
 *   - the target is a place on its beta page, open, not food, not in Vietnam, and has no credited photo yet;
 *   - historic rows (era=historic) carry a date and stillLooks=yes; museum objects (the Met) only on that museum's page;
 *   - licence: the adapter maps the item's rights to one of LICENCES below or refuses (NC, ND, in copyright, not
 *     evaluated, restrictions apply, unknown);
 *   - author, title and source page are present (never invented); date too for a historic row;
 *   - identity: the item's own API text (title, description, subjects, place, tags) names the place — a word of the
 *     place's name or of the row's `names` aliases; otherwise refused;
 *   - not a press photo, screenshot, watermark, AI image, illustration or vector; at least 640 px wide.
 *
 * Exit codes: 0 = done, nothing to do, no key, or hosts unreachable outside CI (plan printed); 1 = bad option or input;
 * 3 = a host is blocked by policy (DNS failure, proxy 403) in CI — a timeout or 429 at the start is a throttle: warning, exit 0; 4 = nothing could be read (every API read or > 25 % of downloads failed and
 * nothing was kept). A dropped connection is retried once, then the item is skipped unrecorded (retried next run); three in
 * a row stop the run cleanly. Partial work always exits 0 so the workflow commits it.
 * --budget caps API requests per run (images are counted apart); a run stops cleanly at the cap, and the next run
 * resumes (staged and credited targets are skipped).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
// CLEO_SOURCES_SANDBOX=<dir> (tests only): candidates, credits, photos and stage live in <dir>; places stay the real ones
const BOX = process.env.CLEO_SOURCES_SANDBOX || '';
const CANDIDATES = BOX ? path.join(BOX, 'candidates.tsv') : path.join(__dirname, 'candidates.tsv');
const CREDITS = BOX ? path.join(BOX, 'CREDITS.json') : path.join(BETA, 'assets/img/CREDITS.json');
const PHOTO_DIR = BOX ? path.join(BOX, 'photos') : path.join(BETA, 'assets/img/photos');
const PLACES = path.join(BETA, 'data/places');
const STAGE_DIR = BOX ? path.join(BOX, 'stage') : path.join(ROOT, 'design/beta/imagery-sources/stage');
const COLUMNS = ['target', 'source', 'itemId', 'itemUrl', 'title', 'creator', 'date', 'licence', 'licenceEvidence', 'depicts',
  'identityEvidence', 'era', 'stillLooks', 'confidence', 'refused', 'names', 'review'];
const RANK = { high: 3, med: 2 };
const UA = 'CleoGuideBeta/1.0 (https://github.com/alvations/cleo-guide; beta image-sources lane, credited self-hosted copies) node';

/** Licence names the credit gate (photos.js LICENCE_OK) knows, and their deeds. Stock licences: landmarks and heroes only. */
const LICENCES = {
  'CC0 1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
  'Public domain': null,                              // the adapter gives the institution's own rights statement URL
  'No known restrictions': null,   // LoC wording, gate-accepted only on a historic LoC row dated ≤ 1929
  'Pexels License': 'https://www.pexels.com/license/',
  'Pixabay Content License': 'https://pixabay.com/service/license-summary/',
};
const STOCK = ['pexels', 'pixabay'];
/** How institutions catalogue an unknown maker (D-52). */
const ANON = /^(anoni?em|anonymous|anonyme?|unknown|onbekend|unbekannt|inconnu|unidentified)\b/i;
/** Creative Commons / rightsstatements.org URI → gate licence name (Europeana, NYPL). Anything else is refused. */
function licenceFromUri(uri) {
  const u = String(uri || '').trim().replace(/^http:/, 'https:').replace(/\/?$/, '/');
  let m;
  if (/^https:\/\/creativecommons\.org\/publicdomain\/zero\/1\.0\//.test(u)) return { licence: 'CC0 1.0', licenceUrl: LICENCES['CC0 1.0'] };
  if (/^https:\/\/creativecommons\.org\/publicdomain\/mark\/1\.0\//.test(u)) return { licence: 'Public domain', licenceUrl: 'https://creativecommons.org/publicdomain/mark/1.0/' };
  if ((m = /^https:\/\/creativecommons\.org\/licenses\/(by|by-sa)\/(\d\.\d)\/(?:([a-z]{2})\/)?$/.exec(u))) return { licence: `CC ${m[1].toUpperCase()} ${m[2]}${m[3] ? ' ' + m[3].toUpperCase() : ''}`, licenceUrl: u };
  if (/^https:\/\/rightsstatements\.org\/vocab\/NoC-US\/1\.0\//.test(u)) return { licence: 'Public domain', licenceUrl: 'https://rightsstatements.org/vocab/NoC-US/1.0/' };
  return null;
}

// ---------------------------------------------------------------- options
function args(argv, adapter) {
  const o = { mode: null, dry: false, keys: [], min: 'med', budget: adapter.defaultBudget || 120, delay: adapter.delay || 350, allow: [], covered: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i], v = () => { const x = argv[++i]; if (x == null) die(`${a} needs a value`); return x; };
    if (a === '--dry-run') o.dry = true;
    else if (a === '--stage') o.mode = 'stage';
    else if (a === '--credit') o.mode = 'credit';
    else if (a === '--budget') o.budget = +v();
    else if (a === '--key') o.keys.push(v());
    else if (a === '--min') o.min = v();
    else if (a === '--delay') o.delay = +v();
    else if (a === '--allow-flag') o.allow.push(v());
    else if (a === '--include-covered') o.covered = true;
    else if (a === '-h' || a === '--help') { console.log(fs.readFileSync(path.join(__dirname, 'lib.js'), 'utf8').split('*/')[0]); process.exit(0); }
    else die(`unknown option ${a} (see --help)`);
  }
  if (!RANK[o.min]) die('--min must be high or med');
  if (!(o.budget >= 1 && o.budget <= 5000)) die('--budget must be 1–5000');
  if (!(o.delay >= 0 && o.delay <= 10000)) die('--delay must be 0–10000 ms');
  o.mode = o.mode || 'stage';
  return o;
}
let TAG = 'sources';
function die(msg, code = 1) { console.error(`${TAG}: ${msg}`); process.exit(code); }

// ---------------------------------------------------------------- candidates
/** Parse candidates.tsv → rows (objects keyed by COLUMNS). Lines starting with # are comments. */
function readCandidates(file = CANDIDATES) {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#'));
  if (!lines.length) return [];
  const head = lines[0].split('\t');
  for (const c of ['target', 'source', 'itemId', 'itemUrl']) if (!head.includes(c)) throw new Error(`candidates.tsv: missing column ${c}`);
  return lines.slice(1).map((l, i) => {
    const f = l.split('\t'), r = { line: i + 2 };
    head.forEach((h, k) => { r[h] = (f[k] || '').trim(); });
    for (const c of COLUMNS) if (r[c] == null) r[c] = '';
    return r;
  });
}

// ---------------------------------------------------------------- places
const pageCache = new Map();
function pageData(page) {
  if (!pageCache.has(page)) {
    const f = path.join(PLACES, `${page.replace(/\//g, '--')}.json`);
    pageCache.set(page, fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
  }
  return pageCache.get(page);
}
/** The beta record a candidate's target names, or {why} it may not get a photo from these sources. */
function targetCheck(target) {
  const m = /^landmark:([a-z0-9/-]+)#([a-z0-9-]+)$/.exec(target || '');
  if (!m) return { why: `bad target "${target}" (want landmark:<page>#<id>)` };
  const [, page, id] = m, d = pageData(page);
  if (!d) return { why: `no beta page ${page}` };
  const rec = (d.places || []).find(p => p.id === id);
  if (!rec) return { why: `${id} is not on beta page ${page}` };
  if (rec.kind === 'food') return { why: 'food place — stock and historic photos never go on a food card (D-50)' };
  if (/CLOSED/.test(rec.n || '')) return { why: 'closed place — never a photo' };
  if (d.country === 'vietnam' || page.startsWith('vietnam/')) return { why: 'Vietnam has no freedom of panorama' };
  return { page, id, rec, country: d.country };
}

/** Words that must appear in the item's API text: the place name's distinctive words plus the row's aliases. */
const STOP = /^(the|and|park|museum|gardens?|temple|shrine|hall|building|street|tower|bridge|church|castle|station|square|memorial|national|state|city|island|center|centre|whole|grounds|deck|observation|historic|historical|site|house|district|art|arts|from|with|walk|trail|beach|lake|river|view|old|new|saint|sankt|st)$/;
const fold = s => String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').toLowerCase();
function nameWords(name, aliases = []) {
  const words = new Set();
  for (const w of fold(String(name).replace(/\([^)]*\)/g, ' ')).split(/[^a-z0-9]+/)) if (w.length >= 4 && !STOP.test(w)) words.add(w);
  for (const a of aliases) { const f = fold(a).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim(); if (f.length >= 4) words.add(f); }
  for (const c of String(name).match(/[぀-鿿]{2,}/g) || []) words.add(c);
  return [...words];
}
/** Does the API text name the place? Returns the matching word, or null. Aliases match as whole phrases. */
function namesPlace(text, words) {
  const t = ' ' + fold(text).replace(/[^a-z0-9぀-鿿]+/g, ' ') + ' ';
  return words.find(w => t.includes(` ${w} `) || (w.length >= 6 && !w.includes(' ') && t.includes(w))) || null;
}
/** Text that marks an item as press, screenshot, watermarked, generated or not a photograph. */
const NOT_A_PLACE_PHOTO = /\b(watermark(ed)?|screen ?shot|press (photo|release|image)|editorial use only|all rights reserved|ai[- ]generated|generative ai|midjourney|stable diffusion|illustration|vector|clip ?art|rendering|3d render)\b/i;

// ---------------------------------------------------------------- HTTP
async function get(url, opts = {}) {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), opts.timeout || 25000);
  try { return await fetch(url, { headers: { 'User-Agent': UA, ...(opts.headers || {}) }, signal: ctl.signal, redirect: 'follow' }); }
  finally { clearTimeout(timer); }
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const inCI = () => process.env.CI === 'true' || !!process.env.GITHUB_ACTIONS;

/** The item hosts must answer from here. Outside CI a block prints the plan and exits 0; in CI it is exit 3. */
async function preflight(adapter, key) {
  const fail = detail => {
    const msg = `${adapter.hosts.join(', ')} not reachable from here (${detail}). The network policy blocks it; downloads happen in GitHub Actions. Never route around the block.`;
    if (inCI()) die(msg, 3);
    console.log(`\n${msg}\nNothing fetched (exit 0).`); process.exit(0);
  };
  // a timeout or 429 is a THROTTLE (e.g. LoC's 1-hour block after a burst), not a policy block: warn and exit 0 so the
  // workflow's other sources and its commit step still run (stage run #2 lesson); DNS failures and proxy 403s stay exit 3
  const throttled = detail => { console.log(`${inCI() ? '::warning::' : ''}${adapter.hosts[0]} is throttling or slow (${detail}); nothing fetched this run — try again later (exit 0).`); process.exit(0); };
  let r;
  try { r = await get(adapter.preflightUrl(key), { headers: adapter.headers ? adapter.headers(key) : {}, timeout: 30000 }); }
  catch (e) {
    const why = e.cause ? e.cause.code || e.cause.message : e.message;
    if (e.name === 'AbortError' || /abort|timeout|ETIMEDOUT|ECONNRESET|terminated/i.test(why)) throttled(why);
    fail(why);
  }
  if (r.status === 429) throttled('HTTP 429');
  if (r.status === 401 || (r.status === 403 && adapter.keyEnv && /key|token|auth/i.test(await r.text().catch(() => '')))) die(`${adapter.keyEnv} was rejected by the API (HTTP ${r.status}). Check the Actions secret.`, 4);
  if (r.status === 403 || r.status === 407) fail(`HTTP ${r.status} — a policy proxy`);
  if (r.status >= 500) die(`${adapter.hosts[0]} answered HTTP ${r.status}; not continuing.`, 4);
}

// ---------------------------------------------------------------- images
function loadSharp() {
  for (const base of [path.join(ROOT, 'tools'), ROOT, ...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean)]) {
    try { return require(require.resolve('sharp', { paths: [base] })); } catch (e) { /* next */ }
  }
  return null;
}
/** Resize a downloaded image to `w` px wide (never upscaled) as a progressive JPEG; returns {buf, w, h}. */
async function toJpeg(sharp, buf, w, quality = 78) {
  const out = await sharp(buf).rotate().flatten({ background: '#ffffff' }).resize({ width: w, withoutEnlargement: true })
    .jpeg({ quality, progressive: true, mozjpeg: true }).toBuffer();
  const m = await sharp(out).metadata();
  return { buf: out, w: m.width, h: m.height };
}
const fileBase = (page, id) => `${page.replace(/\//g, '--')}--${id}`;

// ---------------------------------------------------------------- the checks on one API item
/**
 * Apply the shared rules to the adapter's normalised item. `it` = {title, author, date, licence, licenceUrl, sourceUrl,
 * text, width, kind, imageUrl(w), institution, onView, refused}. Returns a reason string, or '' when it passes.
 */
function itemProblems(it, row, t, adapter) {
  if (it.refused) return it.refused;
  if (!it.title) return 'no title in the API record';
  // D-52: an institution that itself catalogues the creator as anonymous/unknown → "Anonymous (as catalogued by …)",
  // only for a public-domain / CC0 historic row; any other unknown author is refused
  if (!it.author && it.anonymous && row.era === 'historic' && /^(Public domain|CC0 1\.0)$/.test(it.licence || '')) it.author = `Anonymous (as catalogued by ${it.institution || adapter.institution})`;
  if (!it.author) return it.anonymous ? 'anonymous creator: only allowed on a public-domain/CC0 historic row (D-52)' : 'no author/creator in the API record (never invented)';
  if (!it.sourceUrl || !/^https:\/\/\S+$/.test(it.sourceUrl)) return 'no https source page in the API record';
  if (!it.licence || !(it.licence in LICENCES || /^CC BY(-SA)? \d\.\d( [A-Z]{2,3})?$/.test(it.licence))) return `licence "${it.licence || 'unknown'}" is not accepted`;
  if (!it.licenceUrl || !/^https:\/\/\S+$/.test(it.licenceUrl)) return 'no https licence/rights URL';
  if (STOCK.includes(adapter.id) && t.rec.kind !== 'sight') return 'stock licence: landmarks and heroes only';
  if (/^No known restrictions$/.test(it.licence || '') && !(row.era === 'historic' && +((/\b(1[5-9]\d\d)\b/.exec(it.date || '') || [])[1] || 9999) <= 1929)) return '"No known restrictions" is accepted only for a historic LoC item dated 1929 or earlier';
  if (row.era === 'historic') {
    if (!it.date) return 'historic photo without a date in the API record';
    if (!/^yes\b/i.test(row.stillLooks)) return 'historic photo: stillLooks is not "yes" (the place must still look like this)';
  }
  if (NOT_A_PLACE_PHOTO.test(`${it.title} ${it.text}`)) return `not a place photo (${(NOT_A_PLACE_PHOTO.exec(`${it.title} ${it.text}`) || [])[0]})`;
  if (it.width && it.width < 640) return `too small (${it.width} px wide; 640 minimum)`;
  const words = nameWords(t.rec.n, row.names ? row.names.split(';').map(s => s.trim()).filter(Boolean) : []);
  const hit = namesPlace(`${it.title} ${it.text}`, words);
  if (adapter.museumObject && !hit) {   // a museum object: only on that museum's own page, and only when it is on show
    if (!adapter.museumObject.test(t.rec.n)) return 'a museum object only goes on that museum\'s page';
    if (!it.onView) return 'museum object not on view';
    return '';
  }
  if (!hit) return `the API text does not name ${t.rec.n} (looked for: ${words.join(', ') || 'no usable words'})`;
  return '';
}

// ---------------------------------------------------------------- credits / stage
function loadCredits() {
  const j = JSON.parse(fs.readFileSync(CREDITS, 'utf8'));
  if (!Array.isArray(j.credits)) die('CREDITS.json has no "credits" array');
  return j;
}
const stageFile = src => path.join(STAGE_DIR, src, 'stage.json');
function loadStage(src) { const f = stageFile(src); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : { source: src, rows: [] }; }
function saveStage(src, s) { fs.mkdirSync(path.dirname(stageFile(src)), { recursive: true }); fs.writeFileSync(stageFile(src), JSON.stringify(s, null, 1) + '\n'); }

/** The credit row for the gate (photos.js SCHEMA), from a checked item. */
function creditRow(adapter, it, row, t, main, small, today) {
  return {
    file: main.file, record: { page: t.page, id: t.id },
    title: it.title, depicts: row.depicts || t.rec.n, author: it.author, ...(it.authorUrl ? { authorUrl: it.authorUrl } : {}),
    sourceUrl: it.sourceUrl, licence: it.licence, licenceUrl: it.licenceUrl,
    provider: adapter.provider, sourceId: String(row.itemId), institution: it.institution || adapter.institution,
    ...(row.era === 'historic' ? { era: 'historic', date: it.date } : it.date ? { date: it.date } : {}),
    width: main.w, height: main.h, variants: small ? [{ file: small.file, width: small.w, height: small.h }] : [],
    modified: `resized to ${small ? `${small.w} and ` : ''}${main.w} px wide`,
    fetched: today, confidence: row.confidence || 'med', evidence: row.identityEvidence || '', review: /^ok\b/.test(row.review || '') ? row.review : 'pending',   // photos.js: only review ok… renders
  };
}

// ---------------------------------------------------------------- plan + run
/** Targets with at least one un-refused candidate in imagery's commons-candidates.json (BOX: none). */
let LIVE = null;
function commonsLive() {
  if (LIVE) return LIVE;
  LIVE = new Set();
  const f = path.join(BETA, 'assets/img/commons-candidates.json');
  if (BOX || !fs.existsSync(f)) return LIVE;
  for (const t of JSON.parse(fs.readFileSync(f, 'utf8')).targets || []) if (!t.skip && (t.candidates || []).some(c => !c.refused)) LIVE.add(t.depicts);
  return LIVE;
}
function plan(adapter, o) {
  const credits = loadCredits();
  const have = new Set(credits.credits.filter(c => c.record).map(c => `${c.record.page}#${c.record.id}`));
  const staged = new Set(loadStage(adapter.id).rows.map(r => `${r.target}|${r.itemId}`));
  const rows = readCandidates().filter(r => r.source === adapter.id && (!o.keys.length || o.keys.includes(r.target)));
  const out = [];
  for (const r of rows) {
    const t = targetCheck(r.target);
    const skip = t.why || (r.refused ? `refused at research: ${r.refused}` : '') ||
      (have.has(`${t.page}#${t.id}`) ? 'already has a credited photo' : '') ||
      (!RANK[r.confidence] ? `confidence "${r.confidence}" (high or med only)` : RANK[r.confidence] < RANK[o.min] ? `below --min ${o.min}` : '') ||
      (o.mode === 'credit' && r.review !== 'ok' ? (r.review ? `review: ${r.review}` : 'not reviewed yet (contact sheet first)') : '') ||
      (o.mode === 'stage' && r.review ? `already reviewed (${r.review})` : '') ||
      (o.mode === 'stage' && staged.has(`${r.target}|${r.itemId}`) ? 'already staged' : '') ||
      // orchestrator 2026-10-17: stage only real gaps — a target with a live vetted Commons candidate is imagery's (--include-covered overrides)
      (o.mode === 'stage' && !o.covered && commonsLive().has(`${t.page}#${t.id}`) ? 'has a live Commons candidate (imagery)' : '');
    out.push({ r, t, skip });
  }
  return out;
}

async function main(adapter) {
  TAG = `sources/${adapter.id}`;
  const o = args(process.argv, adapter);
  const key = adapter.keyEnv ? process.env[adapter.keyEnv] : null;
  const p = plan(adapter, o), todo = p.filter(x => !x.skip);
  console.log(`${TAG} (${o.mode}): ${p.length} candidate row(s): ${todo.length} to try, ${p.length - todo.length} skipped`);
  for (const x of p) console.log(x.skip ? `  skip  ${x.r.target} ${x.r.itemId} — ${x.skip}` : `  try   ${x.r.target} ← ${x.r.itemId} (${x.r.confidence})`);
  if (adapter.keyEnv && !key) { console.log(`\n${adapter.keyEnv} is not set — nothing fetched (exit 0). It is an Actions secret; never put it in the repo.`); return 0; }
  if (o.dry) { console.log('\n--dry-run — nothing fetched.'); return 0; }
  if (!todo.length) { console.log('\nNothing to do.'); return 0; }
  const sharp = loadSharp();
  if (!sharp) { console.log('\nsharp is not installed (cd tools && npm install --no-save sharp) — nothing fetched (exit 0).'); return 0; }

  let calls = 1; await preflight(adapter, key);
  const ctx = { key, call: async (url, opts = {}) => { calls++; await sleep(o.delay); return get(url, { ...opts, headers: { ...(adapter.headers ? adapter.headers(key) : {}), ...(opts.headers || {}) } }); } };
  const today = new Date().toISOString().slice(0, 10);
  const credits = o.mode === 'credit' ? loadCredits() : null, stage = o.mode === 'stage' ? loadStage(adapter.id) : null;
  const kept = [], refused = [];
  let imgTries = 0, imgFails = 0, stopped = false, netFails = 0, netRow = 0;
  const skipped = [];
  for (const x of todo) {
    if (calls + (adapter.callsPerItem || 1) > o.budget) { stopped = true; break; }
    let it;
    // a dropped connection ("terminated", reset, timeout) is retried once after a pause; a second failure skips the item
    // WITHOUT recording it (the next run retries it); 3 in a row stop the run cleanly so the work so far is kept (run #1 lesson)
    try { it = await adapter.item(x.r, ctx); }
    catch (e) {
      await sleep(o.delay >= 100 ? Math.max(o.delay * 3, 5000) : 10);
      try { it = await adapter.item(x.r, ctx); }
      catch (e2) {
        netFails++; skipped.push(`${x.r.target} ${x.r.itemId}: API read failed twice (${e2.message}) — not recorded, retried next run`);
        console.log(`  net   ${x.r.target} ${x.r.itemId}: ${e2.message}`);
        if (++netRow >= 3) { stopped = true; console.log('  3 network failures in a row — stopping; the next run resumes'); break; }
        continue;
      }
    }
    netRow = 0;
    if (it && it.rateLimited) { stopped = true; console.log('  rate limit reached — stopping; the next run resumes'); break; }
    const why = it ? itemProblems(it, x.r, x.t, adapter) : 'not found in the API';
    if (why) { refused.push(`${x.r.target} ${x.r.itemId}: ${why}`); console.log(`  no    ${x.r.target} ${x.r.itemId}: ${why}`); if (stage) stage.rows.push({ target: x.r.target, itemId: x.r.itemId, refused: why, checked: today }); continue; }
    const widths = o.mode === 'stage' ? [320] : [500, 960];
    let buf;
    imgTries++;
    try {
      if (adapter.imageDelay) await sleep(adapter.imageDelay);   // hosts that count image requests against the API limit (LoC)
      const r = await get(it.imageUrl(Math.max(...widths)), { timeout: 60000, headers: adapter.imageHeaders ? adapter.imageHeaders(key) : {} });
      if (r.status === 429 || r.status >= 500) { stopped = true; console.log(`  image host HTTP ${r.status} — stopping; the next run resumes`); break; }
      if (!r.ok || !/^image\//.test(r.headers.get('content-type') || '')) throw new Error(`HTTP ${r.status} ${r.headers.get('content-type') || ''}`);
      buf = Buffer.from(await r.arrayBuffer());
    } catch (e) { imgFails++; skipped.push(`${x.r.target} ${x.r.itemId}: image download failed (${e.message}) — retried next run`); console.log(`  net   ${x.r.target} ${x.r.itemId}: image ${e.message}`); continue; }
    const meta = await sharp(buf).metadata().catch(() => null);
    if (!meta || !meta.width) { imgFails++; refused.push(`${x.r.target} ${x.r.itemId}: not a readable image`); continue; }
    if (meta.width < (o.mode === 'stage' ? 320 : 640)) { refused.push(`${x.r.target} ${x.r.itemId}: image only ${meta.width} px wide`); continue; }
    const base = fileBase(x.t.page, x.t.id);
    if (stage) {
      const pv = await toJpeg(sharp, buf, 320, 70), file = `${base}--${String(x.r.itemId).replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 60)}.jpg`;
      fs.mkdirSync(path.join(STAGE_DIR, adapter.id), { recursive: true });
      fs.writeFileSync(path.join(STAGE_DIR, adapter.id, file), pv.buf);
      stage.rows = stage.rows.filter(s => !(s.target === x.r.target && s.itemId === x.r.itemId));
      stage.rows.push({ target: x.r.target, itemId: x.r.itemId, preview: file, place: x.t.rec.n, title: it.title, author: it.author, date: it.date || '',
        licence: it.licence, licenceUrl: it.licenceUrl, sourceUrl: it.sourceUrl, institution: it.institution || adapter.institution,
        era: x.r.era || '', stillLooks: x.r.stillLooks || '', evidence: x.r.identityEvidence || '', confidence: x.r.confidence, originalWidth: meta.width, checked: today });
      saveStage(adapter.id, stage);   // after each item, so a stop keeps the work
      kept.push(`${x.r.target} ← ${x.r.itemId} "${it.title}" (${it.licence}) → stage/${adapter.id}/${file}`); console.log(`  ok    ${kept[kept.length - 1]}`);
    } else {
      const big = await toJpeg(sharp, buf, 960), small = big.w > 500 ? await toJpeg(sharp, buf, 500) : null;
      const main = { ...big, file: `${base}-960.jpg` }, sm = small ? { ...small, file: `${base}-500.jpg` } : null;
      fs.mkdirSync(PHOTO_DIR, { recursive: true });
      fs.writeFileSync(path.join(PHOTO_DIR, main.file), big.buf);
      if (sm) fs.writeFileSync(path.join(PHOTO_DIR, sm.file), small.buf);
      credits.credits = credits.credits.filter(c => c.file !== main.file && !(c.record && c.record.page === x.t.page && c.record.id === x.t.id));
      credits.credits.push(creditRow(adapter, it, x.r, x.t, main, sm, today));
      fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 1) + '\n');
      kept.push(`${x.r.target} ← ${x.r.itemId} "${it.title}" by ${it.author} (${it.licence}) → photos/${main.file}`);
    }
  }
  console.log(`\nKept ${kept.length}:`); kept.forEach(k => console.log(`  ok    ${k}`));
  console.log(`Refused ${refused.length}:`); refused.forEach(k => console.log(`  no    ${k}`));
  if (skipped.length) { console.log(`Skipped for now (network) ${skipped.length}:`); skipped.forEach(k => console.log(`  net   ${k}`)); }
  console.log(`API calls this run: ${calls}/${o.budget}.${stopped ? ' Stopped early — run again to resume.' : ''}`);
  if (stage && kept.length) console.log('Now: node tools/beta/imagery/sources/contact.js (the contact sheet for review).');
  if (credits && kept.length) console.log('Now: node tools/beta/imagery/recompress.js && cd tools && npm run beta && npm test');
  // > 25 % failed downloads is an error only when nothing was kept: partial work must still reach the commit step (CI bash -e)
  if (imgTries >= 4 && imgFails / imgTries > 0.25) { console.error(`${TAG}: ${imgFails}/${imgTries} image downloads failed (> 25 %).`); if (!kept.length) return 4; }
  if (netFails && !kept.length && !refused.length) { console.error(`${TAG}: every API read failed (${netFails}).`); return 4; }
  return 0;
}

/** Run an adapter as a CLI: `if (require.main === module) lib.cli(adapter)`. */
function cli(adapter) { main(adapter).then(c => { process.exitCode = c || 0; }, e => die(e.stack || String(e), 4)); }

module.exports = { cli, main, args, plan, readCandidates, targetCheck, nameWords, namesPlace, itemProblems, creditRow, licenceFromUri,
  LICENCES, ANON, COLUMNS, NOT_A_PLACE_PHOTO, STAGE_DIR, CANDIDATES, fileBase, fold, inCI, loadSharp };
