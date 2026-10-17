#!/usr/bin/env node
'use strict';
/**
 * imagery/discover-commons.js — Actions-side discovery of Commons files for every eligible place still without a photo
 * (lane: imagery; R8 "expand the images", orchestrator 2026-10-17 (2)). It scales the hand-made WebSearch waves:
 *
 *   a. Commons geosearch (list=geosearch, namespace 6) within --radius m (default 40) of the place's VERIFIED pin,
 *      keeping only files whose title, description or categories NAME the place;
 *   b. for a record with a Wikipedia link: its Wikidata item's image (P18) and Commons category (P373, its files).
 *
 * Nothing is fetched or credited here. Picks (with licence, author and the field that names the place already checked
 * through the Commons API) go to beta/assets/img/commons-discovered.json plus numbered contact sheets under
 * design/beta/imagery-runs/commons-discovered/. After review, verdicts go to tools/beta/imagery/manifest/discover-review.tsv
 * (`cm-<n> <TAB> ok|refuse <TAB> reason`), and `--apply-review` (no network) appends the ok picks to the vetted
 * candidates (manifest/cands.tsv) and the refused ones as refusals — so the normal fetch-commons run stores them with
 * its full TASL, size and weight handling.
 *
 *   node tools/beta/imagery/discover-commons.js --dry-run         # plan only (no network)
 *   node tools/beta/imagery/discover-commons.js --budget 300      # discover (GitHub Actions: Commons, Wikipedia, Wikidata)
 *   node tools/beta/imagery/discover-commons.js --apply-review    # write reviewed picks into manifest/cands.tsv (offline)
 *
 * Options: --budget <n> API requests (default 300) · --radius <m> (default 40) · --picks <n> per place (default 1: the best, so sheets stay small) ·
 *   --class hero|priority|tier1|other|food (repeatable; default all, in that order) · --key <target> · --delay <ms> (300)
 * Exit codes: 0 · 1 bad input · 3 host blocked (never routed around) · 4 API failure.
 */
const fs = require('fs');
const path = require('path');
const fc = require('./fetch-commons');
const fo = require('./fetch-openverse');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const OUT = path.join(ROOT, 'beta/assets/img/commons-discovered.json');
const REVIEW = path.join(__dirname, 'manifest', 'discover-review.tsv');
const CANDS = path.join(__dirname, 'manifest', 'cands.tsv');
const SHEETS = path.join(ROOT, 'design/beta/imagery-runs/commons-discovered');
const COMMONS = 'https://commons.wikimedia.org/w/api.php';
const WIKIDATA = 'https://www.wikidata.org/w/api.php';
const UA = 'CleoGuideBeta/1.0 (https://github.com/alvations/cleo-guide; beta imagery lane, discovery of credited Commons files) node';

function args(argv) {
  const o = { dry: false, apply: false, budget: 300, radius: 40, picks: 1, classes: [], keys: [], delay: 300, pending: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i];
    if (a === '--dry-run') o.dry = true;
    else if (a === '--apply-review') o.apply = true;
    else if (a === '--budget') o.budget = +v();
    else if (a === '--radius') o.radius = +v();
    else if (a === '--picks') o.picks = +v();
    else if (a === '--class') o.classes.push(v());
    else if (a === '--key') o.keys.push(v());
    else if (a === '--delay') o.delay = +v();
    else if (a === '-h' || a === '--help') { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(0); }
    else die(`unknown option ${a} (see --help)`);
  }
  if (!(o.budget >= 1 && o.budget <= 5000) || !(o.radius >= 10 && o.radius <= 200) || !(o.picks >= 1 && o.picks <= 5)) die('--budget 1–5000, --radius 10–200 m, --picks 1–5');
  return o;
}
function die(msg, code = 1) { console.error(`discover-commons: ${msg}`); process.exit(code); }
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const strip = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/** Which field names the place: 'title' | 'description' | 'category' | null. Pure — exported for the tests. */
function namingField(names, title, desc, cats) {
  if (fc.namesPlace(names, String(title || '').replace(/^File:/, ''))) return 'title';
  if (fc.namesPlace(names, desc || '')) return 'description';
  if (fc.namesPlace(names, (cats || []).join(' | '))) return 'category';
  return null;
}
/** A Commons file record (API page) → {pick} or {why}. Pure. */
function judgeFile(pg, t, how) {
  const ii = (pg.imageinfo || [])[0]; if (!ii) return { why: 'no image info' };
  const em = ii.extmetadata || {}, val = k => em[k] && em[k].value;
  if (!/^image\/jpeg$/i.test(ii.mime || '')) return { why: `not a JPEG (${ii.mime})` };
  if (ii.width < Math.max(...t.widths)) return { why: `only ${ii.width} px wide (needs ${Math.max(...t.widths)})` };
  const lic = fc.licenceOf(val('LicenseShortName'), val('LicenseUrl')); if (lic.why) return { why: lic.why };
  const author = fc.authorOrUploader(val('Artist'), val('Credit'), ii.user);
  if (!author || fc.authorProblems(author).length) return { why: `author not a clean name (${author || 'none'})` };
  const desc = strip(val('ImageDescription')), obj = strip(val('ObjectName')), cats = (pg.categories || []).map(c => c.title.replace(/^Category:/, ''));
  const names = [t.label.replace(/\s*\([^)]*\)\s*$/, '').replace(/\s*[—–]\s*guide hero$/i, ''), ...(t.names || []), ...(t.nat ? [t.nat] : [])];
  const field = how === 'P18' ? 'wikidata P18' : namingField(names, pg.title, `${obj} ${desc}`, cats);
  if (!field) return { why: 'neither title, description nor categories name the place' };
  const text = `${pg.title} ${obj}`;
  for (const [re, why] of [[fc.SIGNAGE, 'signage'], [fc.CLOSEUP, 'close-up/detail'], [fc.VEHICLES, 'vehicle/construction'], [fc.ARTWORK, 'artwork or print'], [fc.NOT_A_PHOTO, 'map/poster/logo']])
    if (fc.subjectRefused(re, t, text)) return { why: `${why} is the subject` };
  if (fc.viewFrom(pg.title, names)) return { why: 'a view FROM the place' };
  if (t.cls === 'food' && field === 'category' && !/restaurant|caf[eé]|bakery|bar\b|food|ramen|noodle|diner|hawker|eatery|deli/i.test(cats.join(' ') + ' ' + text)) return { why: 'food: only a category names it, and nothing marks it as the eatery (D-49)' };
  return { pick: { file: pg.title, how, field, licence: lic.licence, author, width: ii.width, height: ii.height, thumb: ii.thumburl || ii.url, depicts: obj || t.label.replace(/\s*\([^)]*\)\s*$/, '') } };
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
/** One total-time cap over headers AND body (net.js, R8). */
const get = (url, total = 20000) => require('./net').fetchCapped(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } }, total);
const qs = o => Object.entries(o).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');

async function discover(o) {
  const ts = fo.targets({ classes: o.classes, keys: o.keys, pending: false }).filter(t => t.cls === 'hero' || (t.la != null && t.ln != null) || t.article);
  const out = readJson(OUT, { _generated: 'tools/beta/imagery/discover-commons.js — review verdicts in tools/beta/imagery/manifest/discover-review.tsv', v: 1, n: 0, targets: {} });
  const man = readJson(path.join(ROOT, 'beta/assets/img/commons-candidates.json'), { targets: [] });
  const known = new Set(man.targets.flatMap(t => (t.candidates || []).map(c => c.file)));
  const todo = ts.filter(t => !(t.key in out.targets));
  console.log(`discover-commons: ${ts.length} eligible place(s) without a photo; ${todo.length} not yet searched — ≤ 2 requests each (geosearch + file info; +2 for a Wikipedia-linked record), budget ${o.budget}`);
  todo.slice(0, 30).forEach(t => console.log(`  try   [${t.cls}] ${t.key}`)); if (todo.length > 30) console.log(`  … ${todo.length - 30} more`);
  if (o.dry || !todo.length) { console.log(o.dry ? '\n--dry-run — no network.' : '\nNothing to do.'); return; }
  let calls = 0, stopped = '';
  const api = async (base, params) => {
    if (calls >= o.budget) throw Object.assign(new Error('b'), { stop: 'API budget reached — run again to resume' });
    calls++; if (calls > 1) await sleep(o.delay);
    let r; try { r = await get(`${base}?${qs(Object.assign({ format: 'json', formatversion: 2 }, params))}`); }
    catch (e) { if (e.timeout) throw Object.assign(new Error('t'), { stop: `${new URL(base).host} timed out — warning; the next run resumes` }); die(`${new URL(base).host} is not reachable from here (${e.cause ? e.cause.code || e.cause.message : e.message}) — run on GitHub Actions; never routed around.`, 3); }
    if (r.status === 403 || r.status === 407) die(`${new URL(base).host} blocked (HTTP ${r.status}) — run on GitHub Actions; never routed around.`, 3);
    if (r.status === 429) throw Object.assign(new Error('429'), { stop: 'rate-limited — run again later to resume' });
    if (!r.ok) die(`${new URL(base).host} → HTTP ${r.status}`, 4);
    try { return await r.json(); } catch (e) { throw Object.assign(new Error('body'), { stop: `${new URL(base).host} response body ${e.timeout ? 'stalled' : 'unreadable'} — warning; the next run resumes` }); }
  };
  const info = titles => api(COMMONS, { action: 'query', titles: titles.join('|'), prop: 'imageinfo|categories', iiprop: 'url|size|mime|user|extmetadata', iiurlwidth: 300,
    iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|Credit|ImageDescription|ObjectName', clshow: '!hidden', cllimit: 'max' });
  const picksAll = [], refused = [];
  try {
    for (const t of todo) {
      const found = [];   // [title, how]
      if (t.la != null) {
        const g = await api(COMMONS, { action: 'query', list: 'geosearch', gscoord: `${t.la}|${t.ln}`, gsradius: o.radius, gsnamespace: 6, gslimit: 20 });
        ((g.query || {}).geosearch || []).forEach(x => found.push([x.title, `geosearch ${Math.round(x.dist)} m`]));
      }
      if (t.article && /wikipedia\.org\/wiki\//.test(t.article)) {
        const host = new URL(t.article).origin, title = decodeURIComponent(t.article.split('/wiki/')[1]);
        const pp = await api(`${host}/w/api.php`, { action: 'query', titles: title, prop: 'pageprops', ppprop: 'wikibase_item', redirects: 1 });
        const qid = (((pp.query || {}).pages || [])[0] || {}).pageprops && pp.query.pages[0].pageprops.wikibase_item;
        if (qid) {
          const wd = await api(WIKIDATA, { action: 'wbgetclaims', entity: qid, property: 'P18' });
          ((wd.claims || {}).P18 || []).slice(0, 2).forEach(c => found.push([`File:${c.mainsnak.datavalue.value}`, 'P18']));
        }
      }
      const fresh = [...new Map(found.filter(([f]) => !known.has(f)).map(x => [x[0], x])).values()].slice(0, 20);
      const picks = [];
      if (fresh.length) {
        const j = await info(fresh.map(x => x[0]));
        for (const pg of (j.query || {}).pages || []) {
          const how = (fresh.find(x => x[0] === pg.title) || [])[1] || 'geosearch';
          const v = judgeFile(pg, t, how === 'P18' ? 'P18' : how);
          if (v.why) { refused.push(`${t.key} ${pg.title}: ${v.why}`); continue; }
          if (picks.length < o.picks) picks.push(Object.assign(v.pick, { id: `cm-${++out.n}`, key: t.key, cls: t.cls, review: 'pending' }));
        }
      }
      out.targets[t.key] = picks; picksAll.push(...picks);
      fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
    }
  } catch (e) { if (!e.stop) throw e; stopped = e.stop; }
  const sharp = fc.loadSharp(), sheets = [];
  if (sharp && picksAll.length) {
    fs.mkdirSync(SHEETS, { recursive: true });
    const W = 300, H = 225, C = 4, R = 3, stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '');
    for (let s = 0; s * C * R < picksAll.length; s++) {
      const comp = [];
      for (const [i, p] of picksAll.slice(s * C * R, (s + 1) * C * R).entries()) {
        const x = (i % C) * W, y = Math.floor(i / C) * (H + 34), esc = v => String(v).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
        try { const r = await get(p.thumb); if (r.ok) comp.push({ input: await sharp(Buffer.from(await r.arrayBuffer())).resize(W, H, { fit: 'contain', background: '#fff' }).toBuffer(), left: x, top: y + 34 }); } catch (e) { /* blank */ }
        comp.push({ input: Buffer.from(`<svg width="${W}" height="34"><rect width="${W}" height="34" fill="#111"/><text x="4" y="14" font-size="12" fill="#fff">${esc(p.id)} · ${esc(p.how)} · ${esc(p.field)}</text><text x="4" y="29" font-size="11" fill="#ddd">${esc(p.key.replace(/^landmark:/, '').slice(0, 44))}</text></svg>`), left: x, top: y });
      }
      const file = path.join(SHEETS, `${stamp}-sheet-${s + 1}.jpg`);
      await sharp({ create: { width: C * W, height: R * (H + 34), channels: 3, background: '#fff' } }).composite(comp).jpeg({ quality: 70 }).toFile(file);
      sheets.push(path.relative(ROOT, file));
    }
  }
  console.log(`\nPicks for review: ${picksAll.length}`); picksAll.forEach(p => console.log(`  pick  ${p.id}  ${p.key} ← ${p.file} (${p.how}; names it in ${p.field}; ${p.licence}, ${p.author})`));
  console.log(`Refused ${refused.length}:`); refused.forEach(k => console.log(`  no    ${k}`));
  console.log(`Contact sheets: ${sheets.join(', ') || '(none)'}`);
  console.log(`API requests: ${calls}/${o.budget}.${stopped ? ` ${stopped}.` : ''} Nothing credited — review, then --apply-review.`);
}

/** Offline: reviewed picks → cands.tsv lines (ok → vetted candidate; refuse → refusal). Returns the lines. */
function applyReview(write = true) {
  const out = readJson(OUT, { targets: {} }), verdicts = {};
  if (fs.existsSync(REVIEW)) for (const l of fs.readFileSync(REVIEW, 'utf8').split('\n')) { const [id, v, why] = l.split('\t'); if (id && !id.startsWith('#') && (v === 'ok' || v === 'refuse')) verdicts[id.trim()] = { v, why: (why || '').trim() }; }
  const have = new Set(fs.readFileSync(CANDS, 'utf8').split('\n').map(l => l.split('\t').slice(0, 2).join('\t')));
  const lines = [];
  for (const p of Object.values(out.targets).flat()) {
    const r = verdicts[p.id]; if (!r) continue;
    const file = p.file.replace(/^File:/, ''), k = `${p.key}\t${file}`;
    if (have.has(k)) continue;
    const why = `discover-commons ${p.how}, names it in ${p.field} (${p.id}, reviewed ${new Date().toISOString().slice(0, 10)})`;
    lines.push(r.v === 'ok' ? `${p.key}\t${file}\t${p.depicts}\tmed\t${why}\t\t` : `${p.key}\t${file}\t(discovered)\tmed\t${why}\t\trefused by contact-sheet review (${p.id}): ${r.why || 'refused'}`);
  }
  if (write && lines.length) fs.appendFileSync(CANDS, lines.join('\n') + '\n');
  console.log(`discover-commons --apply-review: ${lines.length} reviewed pick(s) written to manifest/cands.tsv${lines.length ? ' — now run python3 tools/beta/imagery/manifest/build_manifest.py' : ''}`);
  return lines;
}

if (require.main === module) { const o = args(process.argv); if (o.apply) applyReview(); else discover(o).catch(e => die(e.stack || String(e), 4)); }
module.exports = { namingField, judgeFile, applyReview };
