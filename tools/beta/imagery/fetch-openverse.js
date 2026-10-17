#!/usr/bin/env node
'use strict';
/**
 * imagery/fetch-openverse.js — discovery + credit from Openverse (800M+ CC / public-domain images across Flickr,
 * Wikimedia, museums and archives) for every eligible place still without a photo (lane: imagery; R8, owner directive
 * 2026-10-17: "expand the images so we don't have so many blanks"). Generalises fetch-flickr.js to all sources.
 *
 * Two phases, so NOTHING is credited before a person has looked at it:
 *   discover (default): per target, search Openverse, apply the licence / identity / subject / laundering checks, keep
 *     up to --picks results, write beta/assets/img/openverse-candidates.json and contact sheets (numbered thumbnails)
 *     to design/beta/imagery-runs/openverse/. The orchestrator reviews the sheets and sends verdicts.
 *   --credit: for every pick marked "ok" in tools/beta/imagery/manifest/openverse-review.tsv (pick id <TAB> ok|refuse
 *     <TAB> reason), download the image, resize it on the runner (sharp) to the slot's widths and write the CREDITS row
 *     with full TASL from the result. A "refuse" verdict is remembered, so the pick is never offered again.
 *
 * Runs on GitHub Actions (api.openverse.org and the image hosts are not reachable from the authoring sandbox; never
 * routed around — a blocked host stops the run, exit 3). Locally: --dry-run prints the plan without any network.
 *
 *   node tools/beta/imagery/fetch-openverse.js --dry-run              # plan: targets by class, expected calls
 *   node tools/beta/imagery/fetch-openverse.js --budget 100           # discover (anonymous)
 *   node tools/beta/imagery/fetch-openverse.js --credit               # credit the reviewed "ok" picks
 *   OPENVERSE_CLIENT_ID=… OPENVERSE_CLIENT_SECRET=… node …            # a registered app: higher limits (Actions secrets;
 *                                                                       read from the environment only, never written)
 *
 * Options
 *   --dry-run            plan only, no network
 *   --credit             credit reviewed picks instead of discovering
 *   --budget <n>         max API calls (default 100; anonymous use is throttled — Openverse documented ~1 request/s
 *                        for anonymous users and 20 results per page; a 429 stops the run cleanly, the next one resumes)
 *   --delay <ms>         pause between API calls (default 1500)
 *   --picks <n>          picks kept per target for review (default 1: the best, so sheets stay small)
 *   --sheets             rebuild contact sheets for every pick still pending review (no search)
 *   --class <c>          only hero | priority | tier1 | other | food (repeatable); default every class, in that order
 *   --key <target>       only this target (repeatable)
 *   --source <s>         only this Openverse source (repeatable), e.g. flickr, wikimedia, smithsonian_*
 *   --include-pending    also search places that still have live Commons candidates (default: skip them)
 *
 * Exit codes: 0 done / nothing to do; 1 bad input; 3 host blocked (the plan is printed first); 4 API/image failure.
 *
 * Targets: every open, non-Vietnam place with no credited photo whose manifest target is not a RULE gap (venue, brand
 * store, copyrighted art, themed ride, closed, Vietnam — see fetch-flickr flickrGap) — heroes, then lead/first-row
 * cards, tier-1 sights, other sights, then food places (D-49: only a photo identified as THAT place — its exterior,
 * interior or a dish photographed there, named in the title/tags/description; never generic stock).
 *
 * Checks per result (each refusal is printed with its reason; see fetch-flickr.js for the shared rules):
 *   licence CC0 / PDM / CC BY / CC BY-SA, any version (NC/ND never requested, refused if seen); a JPEG ≥ the slot's
 *   widest size; the title names the place, confirmed by a second name word, the town or a tag (the matched field is
 *   recorded); the fetch-commons subject classifiers; laundering text and "photo by <someone else>"; historic items
 *   (a year before 1950 in the title or tags) carry era/date/institution for the dated caption (D-50), never on a hero or food; dedup
 *   against existing credits, refused Commons files and earlier refused picks (same landing URL or same file title).
 */
const fs = require('fs');
const path = require('path');
const fc = require('./fetch-commons');
const ff = require('./fetch-flickr');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const MANIFEST = path.join(BETA, 'assets/img/commons-candidates.json');
const OUT = path.join(BETA, 'assets/img/openverse-candidates.json');
const REVIEW = path.join(__dirname, 'manifest', 'openverse-review.tsv');
const SHEETS = path.join(ROOT, 'design/beta/imagery-runs/openverse');
const CREDITS = path.join(BETA, 'assets/img/CREDITS.json');
const PHOTO_DIR = path.join(BETA, 'assets/img/photos');
const PLACES = path.join(BETA, 'data/places');
const API = 'https://api.openverse.org/v1';
const UA = 'CleoGuideBeta/1.0 (https://github.com/alvations/cleo-guide; beta imagery lane, credited self-hosted copies) node';
const CLASSES = ['hero', 'priority', 'tier1', 'other', 'food'];

function args(argv) {
  const o = { dry: false, credit: false, budget: 100, delay: 1500, picks: 1, classes: [], keys: [], sources: [], pending: false, sheetsOnly: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i];
    if (a === '--dry-run') o.dry = true;
    else if (a === '--credit') o.credit = true;
    else if (a === '--budget') o.budget = +v();
    else if (a === '--delay') o.delay = +v();
    else if (a === '--picks') o.picks = +v();
    else if (a === '--class') o.classes.push(v());
    else if (a === '--key') o.keys.push(v());
    else if (a === '--source') o.sources.push(v());
    else if (a === '--include-pending') o.pending = true;
    else if (a === '--sheets') o.sheetsOnly = true;
    else if (a === '-h' || a === '--help') { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(0); }
    else die(`unknown option ${a} (see --help)`);
  }
  if (!(o.budget >= 1 && o.budget <= 5000)) die('--budget must be 1–5000');
  if (!(o.delay >= 0 && o.delay <= 10000)) die('--delay must be 0–10000');
  if (!(o.picks >= 1 && o.picks <= 5)) die('--picks must be 1–5');
  if (o.classes.some(c => !CLASSES.includes(c))) die(`--class must be one of ${CLASSES.join(' | ')}`);
  return o;
}
function die(msg, code = 1) { console.error(`fetch-openverse: ${msg}`); process.exit(code); }
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };

// ---------------------------------------------------------------- targets
const HISTORIC = /\b(1[0-8]\d\d|19[0-4]\d)\b/;
/** A rule gap: the place never gets a photo whatever the source (venue, art, Vietnam, ride …). A "no usable Commons
 *  photo" gap is NOT a rule gap — that is exactly what Openverse may fill. */
const ruleGap = skip => !!skip && !ff.flickrGap(skip);

/** Every eligible place without a photo, classed and ordered. Pure (reads files, no network) — exported for tests. */
function targets(o = { classes: [], keys: [], pending: false }) {
  const man = readJson(MANIFEST, { targets: [] }), credits = readJson(CREDITS, { credits: [] }).credits;
  const byDepicts = new Map(man.targets.map(t => [t.depicts, t]));
  // the manifest's own rules for places it has no target for (tier-2+): venues and brand stores never get a photo
  const R = man.rules || {}, vTags = new Set(R.venueTags || []), vName = R.venueName ? new RegExp(R.venueName, 'i') : null, brand = R.brandStore ? new RegExp(R.brandStore, 'i') : null;
  const ruleOf = p => p.kind !== 'food' && (vTags.has((p.g || [])[0]) || /^\s*(?:[a-z]+ )?store\b/i.test(String(p.k || '')) || (vName && vName.test(p.n)) || (brand && brand.test(p.n)) || /^Pok[eé] Lid/.test(p.n));   // primary venue only
  const haveRec = new Set(credits.filter(c => c.record).map(c => `${c.record.page}#${c.record.id}`));
  const haveSlot = new Set(credits.filter(c => c.slot).map(c => c.slot.key));
  const out = [];
  for (const t of man.targets.filter(t => t.type === 'hero')) {
    const key = t.depicts.replace(/^hub:/, '');
    if (haveSlot.has(key) || ruleGap(t.skip) || /^vietnam(\/|$)/.test(key)) continue;
    if (!t.skip && !o.pending && (t.candidates || []).some(c => !c.refused)) continue;
    out.push({ key: t.key, cls: 'hero', label: t.label, names: t.names || [], page: key, slot: { type: 'hero', key }, widths: [960, 1280] });
  }
  for (const f of fs.readdirSync(PLACES).filter(f => f.endsWith('.json')).sort()) {
    const d = readJson(path.join(PLACES, f), null); if (!d || d.country === 'vietnam') continue;
    for (const p of d.places || []) {
      const id = `${d.key}#${p.id}`; if (haveRec.has(id) || /CLOSED/.test(p.n)) continue;
      const t = byDepicts.get(id);
      if (t ? ruleGap(t.skip) : ruleOf(p)) continue;
      if (t && !t.skip && !o.pending && (t.candidates || []).some(c => !c.refused)) continue;   // Commons is still trying
      const food = p.kind === 'food';
      const cls = food ? 'food' : t && t.priority ? 'priority' : p.t === 1 ? 'tier1' : 'other';
      out.push({ key: `landmark:${id}`, cls, label: p.n, names: (t && t.names) || [], nat: p.nat, page: d.key, id: p.id, record: { page: d.key, id: p.id },
        la: p.la, ln: p.ln, town: ff.townWords(d.key, d.name || d.title), widths: cls === 'priority' ? [500, 720, 960] : [500, 720], food,
        article: ((p.s || []).find(x => /^https:\/\/[a-z-]+\.wikipedia\.org\/wiki\//.test(String(x[1] || ''))) || [])[1] });
    }
  }
  // food (D-49) last: only a photo that identifies THAT place (the gate requires the identifying field)
  const want = o.classes.length ? o.classes : CLASSES;
  const pick = out.filter(x => want.includes(x.cls) && (!o.keys.length || o.keys.includes(x.key)));
  return pick.sort((a, b) => CLASSES.indexOf(a.cls) - CLASSES.indexOf(b.cls));
}

// ---------------------------------------------------------------- one result → a pick or a refusal
/** A normalised Openverse result plus its source / provider. */
function norm(r) { return Object.assign(ff.fromOpenverse(r), { source: r.source || '', provider: r.provider || '', thumb: r.thumbnail || '' }); }
/** Source page and author profile rules per source: Flickr and Commons pages are normalised; any other source keeps
 *  its https landing page (a museum's object page). */
function pages(ph) {
  if (ph.source === 'flickr') { const pg = ff.photoPageOf(ph.pageUrl), pr = ff.profileOf(ph.creatorUrl) || (pg ? pg.replace(/\d+\/$/, '') : null); return pg && pr ? { sourceUrl: pg, authorUrl: pr, provider: 'flickr' } : { why: 'no Flickr photo page or author profile' }; }
  if (ph.source === 'wikimedia') return /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(ph.pageUrl) ? { sourceUrl: ph.pageUrl, provider: 'wikimedia-commons', commonsTitle: decodeURIComponent(ph.pageUrl.split('/wiki/')[1]).replace(/_/g, ' ') } : { why: 'no Commons File: page' };
  return /^https:\/\//.test(ph.pageUrl) ? { sourceUrl: ph.pageUrl, ...(/^https:\/\//.test(ph.creatorUrl) ? { authorUrl: ph.creatorUrl } : {}), provider: 'openverse' } : { why: 'no https landing page' };
}
/** The holding institution's display name for a historic Openverse item ("smithsonian_american_art_museum" → "Smithsonian American Art Museum"). */
const institutionOf = ph => String(ph.provider || ph.source || 'Openverse').replace(/[_-]+/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase()).replace(/^Flickr$/, 'Flickr').replace(/^Wikimedia$/, 'Wikimedia Commons');
/** {pick} or {why}. `seen`: landing URLs and Commons titles already credited / refused. */
function judge(ph, t, seen) {
  const lic = ff.licenceOf(ph.code, ph.ver === 'N/A' ? '1.0' : ph.ver);
  if (lic.why) return { why: lic.why };
  if (ph.mature) return { why: 'marked mature' };
  const pg = pages(ph); if (pg.why) return { why: pg.why };
  if (seen.has(pg.sourceUrl) || (pg.commonsTitle && seen.has(pg.commonsTitle))) return { why: 'already credited or refused (same landing page / file)' };
  if (!String(ph.creator || '').trim()) return { why: 'no author name' };
  if (fc.authorProblems(ph.creator).length) return { why: `author "${ph.creator}" is not a clean name` };
  if (ph.filetype && ph.filetype !== 'jpg') return { why: `not a JPEG (${ph.filetype})` };
  if (ph.width && ph.width < Math.max(...t.widths)) return { why: `only ${ph.width} px wide (needs ${Math.max(...t.widths)})` };
  // D-50 (now in the gate): a historic item (a year before 1950) carries its year and holding institution in the caption;
  // never for a hero (it can't stand in for today's city) or a food place
  const yr = (HISTORIC.exec(`${ph.title} ${(ph.tags || []).join(' ')}`) || [])[1];
  if (yr && (t.cls === 'hero' || t.cls === 'food')) return { why: `historic item (${yr}) — never for a ${t.cls === 'hero' ? 'hero' : 'food place'} (D-50)` };
  const hist = yr ? { era: 'historic', date: yr, institution: institutionOf(ph) } : {};
  const m = ff.matches(ph, Object.assign({ radius: 1.5 }, t, { town: t.town || ff.townWords(t.page) }));
  if (m.why) return { why: m.why };
  const rf = ff.refusal(ph, t); if (rf) return { why: rf.why };
  const field = m.ok.geo != null ? 'geo' : 'title' + ((t.town || []).some(w => ff.nameWords(ph.title).concat([String(ph.title).toLowerCase()]).join(' ').includes(w)) ? '+town' : (ph.tags || []).length ? '+tags' : '');
  return { pick: { id: `ov-${ph.id}`, openverseId: ph.id, source: ph.source, provider: ph.provider, title: ph.title, creator: ph.creator.trim(), ...pg, ...lic,
    imageUrl: ph.imageUrl, thumb: ph.thumb, width: ph.width, height: ph.height, matched: `${field}: ${m.ok.inTitle.join(', ')}`, ...hist, review: 'pending' } };
}

// ---------------------------------------------------------------- network
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url, opts = {}) {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), opts.timeout || 20000);
  try { return await fetch(url, { method: opts.method || 'GET', body: opts.body, headers: Object.assign({ 'User-Agent': UA, Accept: opts.accept || 'application/json' }, opts.headers || {}), signal: ctl.signal, redirect: 'follow' }); }
  finally { clearTimeout(timer); }
}
const qs = o => Object.entries(o).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
const blocked = (host, detail) => die(`${host} is not reachable from here (${detail}).\n  This environment's network policy blocks it — run this step on GitHub Actions. Do NOT route around the block.`, 3);

function client(o) {
  let calls = 0, token = null;
  const call = async (pathQ, opts = {}) => {
    if (calls >= o.budget) throw Object.assign(new Error('budget'), { stop: 'API budget reached — run again to resume' });
    calls++; if (calls > 1) await sleep(o.delay);
    // R8 run #96: a timeout / reset / 5xx on the runner is retried with backoff (2 s, 4 s, 8 s, longer timeout each time);
    // if it still fails the run STOPS CLEANLY with a warning (exit 0, the rest of the workflow commits). Only a policy
    // proxy (403/407 without API headers) is a hard block (exit 3).
    let r, last = '';
    for (let a = 0; a < 4; a++) {
      if (a) await sleep(2000 * 2 ** (a - 1));
      try { r = await get(`${API}${pathQ}`, Object.assign({ timeout: 30000 + 15000 * a }, opts, { headers: Object.assign(token ? { Authorization: `Bearer ${token}` } : {}, opts.headers || {}) })); }
      catch (e) { r = null; last = e.cause ? e.cause.code || e.cause.message : e.message; continue; }
      if (r.status >= 500) { last = `HTTP ${r.status}`; r = null; continue; }
      break;
    }
    if (!r) throw Object.assign(new Error('unreachable'), { stop: `api.openverse.org did not answer after 4 tries (${last}) — warning only; the next run resumes` });
    if ((r.status === 403 || r.status === 407) && !/ratelimit/i.test([...r.headers.keys()].join(' '))) blocked('api.openverse.org', `HTTP ${r.status} without API headers — a policy proxy`);
    if (r.status === 429) throw Object.assign(new Error('429'), { stop: 'Openverse rate-limited this run (HTTP 429) — run again later to resume' });
    if (!r.ok) throw Object.assign(new Error('http'), { stop: `api.openverse.org ${pathQ.split('?')[0]} → HTTP ${r.status} — warning only; the next run resumes` });
    return r.json();
  };
  return {
    get calls() { return calls; },
    async auth() {   // a registered app (Actions secrets); the values are read here and never printed or written
      const id = process.env.OPENVERSE_CLIENT_ID, secret = process.env.OPENVERSE_CLIENT_SECRET;
      if (!id || !secret) return false;
      const j = await call('/auth_tokens/token/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: qs({ grant_type: 'client_credentials', client_id: id, client_secret: secret }) });
      token = j.access_token || null; return !!token;
    },
    search: (q, sources) => call(`/images/?${qs({ q, license: 'cc0,pdm,by,by-sa', mature: 'false', page_size: 20, source: sources.join(',') })}`),
  };
}

// ---------------------------------------------------------------- contact sheets
async function sheets(picks, sharp, stamp) {
  if (!sharp || !picks.length) return [];
  fs.mkdirSync(SHEETS, { recursive: true });
  const W = 300, H = 225, C = 4, R = 3, files = [];
  // R8 (orchestrator): run #105 spent 20+ minutes here — each tile could retry two hosts three times at 45 s. Previews are
  // fetched six at a time, 20 s per try, two tries per host, and the whole step stops after SHEET_MS; a tile not fetched by
  // then says "no preview" (the reviewer opens the source page for those). A slow host can no longer hold the job.
  const SHEET_MS = 150000, t0 = Date.now(), thumbs = new Map();
  const fetchThumb = async p => {
    for (const u of [p.thumb, p.imageUrl].filter(Boolean)) {
      for (let a = 0; a < 2; a++) {
        const left = SHEET_MS - (Date.now() - t0);
        if (left < 2000) return null;
        if (a) await sleep(1500);
        // get()'s timer ends when the headers arrive, so the body read gets its own cap (a stalled body otherwise waits forever)
        const ms = Math.min(20000, left), cap = new Promise((_, no) => setTimeout(() => no(new Error('body timeout')), ms).unref());
        cap.catch(() => {}); // the cap loses the race on every good tile; it must not become an unhandled rejection
        try { const r = await get(u, { accept: 'image/*', timeout: ms }); if (r.ok) return await sharp(Buffer.from(await Promise.race([r.arrayBuffer(), cap]))).resize(W, H, { fit: 'contain', background: '#ffffff' }).toBuffer(); } catch (e) { /* next try */ }
      }
    }
    return null;
  };
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(6, picks.length) }, async () => {
    while (next < picks.length) { const p = picks[next++]; thumbs.set(p, await fetchThumb(p)); }
  }));
  for (let s = 0; s * C * R < picks.length; s++) {
    const page = picks.slice(s * C * R, (s + 1) * C * R), comp = [];
    for (const [i, p] of page.entries()) {
      const x = (i % C) * W, y = Math.floor(i / C) * (H + 34);
      const img = thumbs.get(p) || null;
      comp.push(img ? { input: img, left: x, top: y + 34 } : { input: Buffer.from(`<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#eee"/><text x="${W / 2}" y="${H / 2}" font-size="20" text-anchor="middle" fill="#900">no preview</text></svg>`), left: x, top: y + 34 });
      const esc = t => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      comp.push({ input: Buffer.from(`<svg width="${W}" height="34"><rect width="${W}" height="34" fill="#111"/><text x="4" y="14" font-size="12" fill="#fff">${esc(p.id)} ${esc(p.source)}</text><text x="4" y="29" font-size="11" fill="#ddd">${esc(p.key.replace(/^landmark:/, '').slice(0, 44))}</text></svg>`), left: x, top: y });
    }
    const file = path.join(SHEETS, `${stamp}-sheet-${s + 1}.jpg`);
    await sharp({ create: { width: C * W, height: R * (H + 34), channels: 3, background: '#ffffff' } }).composite(comp).jpeg({ quality: 70 }).toFile(file);
    files.push(path.relative(ROOT, file));
  }
  return files;
}

// ---------------------------------------------------------------- phases
async function discover(o) {
  const ts = targets(o), cand = readJson(OUT, { _generated: 'tools/beta/imagery/fetch-openverse.js — discover phase; review verdicts in tools/beta/imagery/manifest/openverse-review.tsv', v: 1, targets: {} });
  const review = readReview();
  const credits = readJson(CREDITS, { credits: [] }).credits, man = readJson(MANIFEST, { targets: [] });
  const seen = new Set([...credits.map(c => c.sourceUrl), ...credits.map(c => c.commonsTitle).filter(Boolean),
    ...man.targets.flatMap(t => (t.candidates || []).filter(c => c.refused).map(c => c.file)),
    ...Object.values(cand.targets).flat().filter(p => (review[p.id] || {}).verdict === 'refuse').map(p => p.sourceUrl)]);
  const todo = ts.filter(t => !(cand.targets[t.key] || []).length);
  const by = CLASSES.map(c => `${c} ${todo.filter(t => t.cls === c).length}`).join(', ');
  console.log(`fetch-openverse: ${ts.length} eligible place(s) without a photo; ${todo.length} not yet searched (${by})`);
  console.log(`  expected API calls: 1 search per target = ${todo.length} (budget ${o.budget}${process.env.OPENVERSE_CLIENT_ID ? ', +1 token' : ''}); thumbnails and images come from the image hosts (not counted)`);
  for (const t of todo.slice(0, 40)) console.log(`  try   [${t.cls}] ${t.key} "${t.label}"`);
  if (todo.length > 40) console.log(`  … ${todo.length - 40} more`);
  if (o.dry) { console.log('\n--dry-run — no network.'); return; }
  if (!todo.length) { console.log('\nNothing to do.'); return; }
  const api = client(o);
  let stopped = '', found = 0, none = 0;
  const refused = [], newPicks = [];
  try {
    if (await api.auth()) console.log('  registered app token in use');
    for (const t of todo) {
      const name = t.label.replace(/\([^)]*\)/g, ' ').replace(/\s*[—–]\s*(guide hero|CLOSED)\b.*$/i, '').replace(/\s+/g, ' ').trim();
      const q = `${name} ${(t.town || [])[0] || ''}`.trim();
      const j = await api.search(q, o.sources);
      const picks = [];
      for (const r of j.results || []) {
        const v = judge(norm(r), t, seen);
        if (v.why) { refused.push(`${t.key} ov-${r.id}: ${v.why}`); continue; }
        picks.push(Object.assign(v.pick, { key: t.key, cls: t.cls, ...(t.record ? { record: t.record } : { slot: t.slot }), widths: t.widths, label: t.label }));
        seen.add(v.pick.sourceUrl);
        if (picks.length >= o.picks) break;
      }
      cand.targets[t.key] = picks; picks.length ? found++ : none++; newPicks.push(...picks);
      fs.writeFileSync(OUT, JSON.stringify(cand, null, 1) + '\n');   // after each target, so a stop keeps the work
    }
  } catch (e) { if (!e.stop) throw e; stopped = e.stop; }
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '');
  // earlier picks still waiting for a verdict (e.g. run #95's blank-tile sheets) are drawn again with the new ones
  const older = Object.values(cand.targets).flat().filter(p => !review[p.id] && !newPicks.includes(p));
  const sh = await sheets(newPicks.concat(older), fc.loadSharp(), stamp);
  console.log(`\nPicks for review: ${newPicks.length} new across ${found} place(s) (+${older.length} earlier pick(s) still pending, redrawn); ${none} place(s) with nothing usable.`);
  newPicks.forEach(p => console.log(`  pick  ${p.id}  ${p.key} ← ${p.source} "${String(p.title).slice(0, 50)}" by ${p.creator} (${p.licence}; ${p.matched})`));
  console.log(`Refused ${refused.length}:`); refused.forEach(k => console.log(`  no    ${k}`));
  console.log(`Contact sheets: ${sh.length ? sh.join(', ') : '(none — sharp missing or no picks)'}`);
  console.log(`API calls this run: ${api.calls}/${o.budget}.${stopped ? ` ${stopped}.` : ''}`);
  console.log('Nothing is credited: review the sheets, write verdicts to tools/beta/imagery/manifest/openverse-review.tsv, then run --credit.');
}

function readReview() {
  const out = {};
  if (!fs.existsSync(REVIEW)) return out;
  for (const line of fs.readFileSync(REVIEW, 'utf8').split('\n')) {
    const [id, verdict, reason] = line.split('\t'); if (!id || id.startsWith('#')) continue;
    if (verdict === 'ok' || verdict === 'refuse') out[id.trim()] = { verdict, reason: (reason || '').trim() };
  }
  return out;
}

async function credit(o) {
  const cand = readJson(OUT, { targets: {} }), review = readReview(), credits = readJson(CREDITS, { credits: [] });
  const haveRec = new Set(credits.credits.filter(c => c.record).map(c => `${c.record.page}#${c.record.id}`));
  const haveSlot = new Set(credits.credits.filter(c => c.slot).map(c => c.slot.key));
  const ok = Object.values(cand.targets).flat().filter(p => (review[p.id] || {}).verdict === 'ok')
    .filter(p => p.record ? !haveRec.has(`${p.record.page}#${p.record.id}`) : !haveSlot.has(p.slot.key));
  console.log(`fetch-openverse --credit: ${ok.length} reviewed "ok" pick(s) to credit`);
  ok.forEach(p => console.log(`  credit ${p.id} → ${p.key}`));
  if (o.dry || !ok.length) { console.log(o.dry ? '\n--dry-run — no network.' : '\nNothing to do.'); return; }
  const sharp = fc.loadSharp(); if (!sharp) die('sharp is not installed — needed to resize the copies');
  fs.mkdirSync(PHOTO_DIR, { recursive: true });
  const today = new Date().toISOString().slice(0, 10), done = [];
  for (const p of ok) {
    let r; try { r = await get(p.imageUrl, { accept: 'image/*', timeout: 60000 }); } catch (e) { blocked(new URL(p.imageUrl).host, e.cause ? e.cause.code || e.cause.message : e.message); }
    if (r.status === 403 || r.status === 407) blocked(new URL(p.imageUrl).host, `HTTP ${r.status}`);
    if (!r.ok) { console.log(`  no    ${p.id}: image → HTTP ${r.status}`); continue; }
    const src = Buffer.from(await r.arrayBuffer());
    const base = p.record ? `${p.record.page.replace(/\//g, '--')}--${p.record.id}` : `hero--${p.slot.key.replace(/\//g, '--')}`, out = [];
    for (const w of p.widths) {
      const buf = await sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
      const md = await sharp(buf).metadata(), file = `${base}-${md.width}.jpg`;
      fs.writeFileSync(path.join(PHOTO_DIR, file), buf); out.push({ file, w: md.width, h: md.height });
    }
    const main = out[out.length - 1], variants = out.slice(0, -1).map(v => ({ file: v.file, width: v.w, height: v.h }));
    credits.credits = credits.credits.filter(c => c.file !== main.file && !(c.variants || []).some(v => v.file === main.file));
    credits.credits.push({
      file: main.file, ...(p.record ? { record: p.record } : { slot: p.slot }),
      title: String(p.title || p.label).trim(), depicts: p.label.replace(/\s*\([^)]*\)\s*$/, '').trim(), author: p.creator,
      ...(p.authorUrl ? { authorUrl: p.authorUrl } : {}), sourceUrl: p.sourceUrl, licence: p.licence, licenceUrl: p.licenceUrl,
      provider: p.provider === 'wikimedia-commons' || p.source === 'wikimedia' ? 'wikimedia-commons' : p.source === 'flickr' ? 'flickr' : 'openverse',
      ...(p.commonsTitle ? { commonsTitle: p.commonsTitle } : {}), ...(p.cls === 'food' ? { identifies: p.matched } : {}), ...(p.era ? { era: p.era, date: p.date, institution: p.institution } : {}), via: 'openverse', openverseSource: p.source, openverseProvider: p.provider, openverseId: p.openverseId,
      width: main.w, height: main.h, ...(variants.length ? { variants } : {}), modified: `resized to ${fc.widthList(out.map(v => v.w))} px wide`,
      fetched: today, confidence: 'med', review: `ok (${(review[p.id] || {}).reason || 'contact-sheet review'})`, matched: p.matched,
    });
    fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 1) + '\n');
    done.push(p.id); console.log(`  ok    ${p.id} → ${out.map(v => v.file).join(', ')}`);
  }
  console.log(`\nCredited ${done.length}. Now: node tools/beta/imagery/recompress.js, then cd tools && npm run beta && npm test.`);
}

/** Rebuild contact sheets for every pick without a verdict yet (e.g. after a run whose thumbnails failed). */
async function resheet() {
  const cand = readJson(OUT, { targets: {} }), review = readReview();
  const pend = Object.values(cand.targets).flat().filter(p => !review[p.id]);
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '');
  const sh = await sheets(pend, fc.loadSharp(), stamp);
  console.log(`fetch-openverse --sheets: ${pend.length} pending pick(s) → ${sh.join(', ') || '(none)'}`);
}
if (require.main === module) { const o = args(process.argv); (o.sheetsOnly ? resheet() : o.credit ? credit(o) : discover(o)).catch(e => die(e.stack || String(e), 4)); }
module.exports = { sheets, targets, judge, norm, pages, ruleGap, readReview, HISTORIC, CLASSES };
