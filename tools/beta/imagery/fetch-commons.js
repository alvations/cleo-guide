#!/usr/bin/env node
'use strict';
/**
 * imagery/fetch-commons.js — turn the Wikimedia Commons CANDIDATE manifest into credited local photos (lane: imagery).
 *
 * Commons needs no key. It runs where commons.wikimedia.org, en.wikipedia.org and upload.wikimedia.org are reachable:
 * a GitHub-hosted runner (the orchestrator wires it into the beta imagery workflow). In the authoring sandbox those
 * hosts are blocked by the network policy: the script then prints its plan and exits 0. Never through a proxy, mirror
 * or other workaround.
 *
 *   node tools/beta/imagery/fetch-commons.js                    # fetch (heroes, then pilot sights, then the rest)
 *   node tools/beta/imagery/fetch-commons.js --dry-run          # plan only
 *   node tools/beta/imagery/fetch-commons.js --budget 120 --wiki-lead
 *
 * Options
 *   --dry-run            print the plan only (also what happens when the hosts are unreachable)
 *   --budget <n>         max API requests this run (default 150; images are counted separately, ≤ 2 per photo)
 *   --key <target>       only this target (repeatable), e.g. --key landmark:tokyo#senso-ji
 *   --type <t>           only hero | landmark (repeatable)
 *   --pilot              only pilot targets (Tokyo, Cleveland, New York, Chinatown SG, Wheeling + live country hubs)
 *   --min high|med       lowest candidate confidence to consider (default high)
 *   --allow-flag <f>     accept candidates carrying this flag (repeatable): people-visible, public-art-check,
 *                        venue-check, panorama, outdated, author-check. Only after a person has LOOKED at the photo.
 *   --wiki-lead          for a landmark with no usable candidate, try the lead image of its cited Wikipedia article
 *                        (same licence and depicts checks)
 *   --widths a,b         stored widths for card photos (srcset; default 480,960; the largest is the credited file)
 *   --hero-widths a,b    stored widths for hero photos (default 640,1280: a phone at 3× and a desktop hero)
 *   --delay <ms>         pause between requests (default 400; API etiquette)
 *
 * Per target it takes the first candidate that passes, in manifest order:
 *   1. GET commons.wikimedia.org/w/api.php?action=query&prop=imageinfo|categories&iiprop=url|size|mime|sha1|
 *      extmetadata&iiurlwidth=<largest> — the API, not the search snippet, is the truth.
 *   2. Licence (extmetadata LicenseShortName) must be CC0, public domain, CC BY or CC BY-SA; NC, ND, GFDL-only and
 *      anything else is refused. Author (Artist, HTML stripped) must be present. Bitmap only (JPEG/PNG/WebP), at least
 *      640 px wide, not a panorama wider than 3:1.
 *   3. Depicts re-check: the file title, its description or one of its visible categories must contain one of the
 *      target's `names` (compared without spaces, punctuation or diacritics). Otherwise refused.
 *   4. Download the server-side thumbnails (one per width, never wider than the original) from upload.wikimedia.org
 *      and store them as beta/assets/img/photos/<base>-<w>.<ext>.
 *   5. Write/replace its CREDITS.json row: the largest width is `file`, the others are `variants` (same credit), plus
 *      title, depicts, author, sourceUrl (the Commons file page), licence, licenceUrl, provider, commonsTitle, sha1,
 *      modified ("resized"), fetched, confidence.
 * Then: cd tools && npm run beta && npm test — the credit gate (photos.js) renders it with its caption, or names the
 * exact problem.
 *
 * Exit codes: 0 = done, nothing to do, or the hosts are unreachable (plan printed); 1 = bad option/input;
 * 4 = an API or image request failed mid-run (finished photos are kept: CREDITS.json is written after each one).
 *
 * Never fetched: food places, venues and other `skip` targets, closed places, Vietnamese places or a Vietnam hero
 * (no freedom of panorama), a record that is not on its beta page.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const MANIFEST = path.join(BETA, 'assets/img/commons-candidates.json');
const CREDITS = path.join(BETA, 'assets/img/CREDITS.json');
const PHOTO_DIR = path.join(BETA, 'assets/img/photos');
const PLACES = path.join(BETA, 'data/places');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'CleoGuideBeta/1.0 (https://github.com/alvations/cleo-guide; beta imagery lane, credited self-hosted thumbnails) node';
const RANK = { high: 3, med: 2 };
const PILOT_PAGES = ['tokyo', 'cleveland', 'newyork', 'singapore/chinatown', 'wheeling'];

function args(argv) {
  const o = { dry: false, keys: [], types: [], min: 'high', allow: [], widths: [480, 960], heroWidths: [640, 1280], budget: 150, wikiLead: false, pilot: false, delay: 400 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i];
    if (a === '--dry-run') o.dry = true;
    else if (a === '--budget') o.budget = +v();
    else if (a === '--key') o.keys.push(v());
    else if (a === '--type') o.types.push(v());
    else if (a === '--min') o.min = v();
    else if (a === '--allow-flag') o.allow.push(v());
    else if (a === '--wiki-lead') o.wikiLead = true;
    else if (a === '--pilot') o.pilot = true;
    else if (a === '--widths') o.widths = String(v()).split(',').map(Number).sort((x, y) => x - y);
    else if (a === '--hero-widths') o.heroWidths = String(v()).split(',').map(Number).sort((x, y) => x - y);
    else if (a === '--delay') o.delay = +v();
    else if (a === '-h' || a === '--help') { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(0); }
    else die(`unknown option ${a} (see --help)`);
  }
  if (!RANK[o.min]) die('--min must be high or med (low candidates are never recorded or fetched)');
  for (const ws of [o.widths, o.heroWidths]) if (!ws.length || ws.some(w => !(w >= 320 && w <= 1600))) die('--widths / --hero-widths must be 320–1600 each');
  if (!(o.budget >= 1 && o.budget <= 5000)) die('--budget must be 1–5000');
  if (!(o.delay >= 0 && o.delay <= 10000)) die('--delay must be 0–10000');
  return o;
}
function die(msg, code = 1) { console.error(`fetch-commons: ${msg}`); process.exit(code); }

/** Compare-key: lower case, diacritics and everything but letters/digits/CJK removed ("Sensō-ji" → "sensoji"). */
const fold = s => String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9぀-ヿ㐀-鿿]+/g, '');
/** True when one of the target's names (≥ 4 folded chars, or ≥ 2 CJK) occurs in the haystack. */
function namesPlace(names, ...hay) {
  const h = hay.map(fold).join('|');
  return (names || []).some(n => { const f = fold(n); return (f.length >= 4 || (/[぀-鿿]/.test(f) && f.length >= 2)) && h.includes(f); });
}

/** Free-licence check on a Commons extmetadata LicenseShortName. Returns {licence, licenceUrl} or {why}. */
function licenceOf(short, url) {
  const s = String(short || '').replace(/\s+/g, ' ').trim();
  if (!s) return { why: 'no licence in the file metadata' };
  if (/\b(NC|ND)\b|non-?commercial|no-?deriv/i.test(s)) return { why: `licence ${s} (NC/ND) is not free` };
  let m;
  if (/^(CC0|CC-?Zero)\b/i.test(s)) return { licence: 'CC0 1.0', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' };
  if (/^(Public domain|PD\b|PD-)/i.test(s)) return { licence: 'Public domain', licenceUrl: 'https://creativecommons.org/publicdomain/mark/1.0/' };
  if ((m = /^CC[ -](BY(?:-SA)?)[ -](\d\.\d)(?:[ -]([a-z]{2,3}))?$/i.exec(s))) {
    const kind = m[1].toUpperCase(), ver = m[2], port = m[3] ? ' ' + m[3].toUpperCase() : '';
    const deed = /^https:\/\/creativecommons\.org\/licenses\//.test(url || '') ? url.replace(/^http:/, 'https:') : `https://creativecommons.org/licenses/${kind.toLowerCase()}/${ver}/`;
    return { licence: `CC ${kind} ${ver}${port}`, licenceUrl: deed };
  }
  return { why: `licence ${s} is not CC0 / PD / CC BY / CC BY-SA` };
}
const strip = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim();

/** File base for a target: landmark → <page with / → -->--<id>; hero → hero--<key>. */
function fileBase(t) {
  if (t.type === 'landmark') { const [page, id] = t.depicts.split('#'); return `${page.replace(/\//g, '--')}--${id}`; }
  return `hero--${t.depicts.replace(/^hub:/, '').replace(/\//g, '--')}`;
}

/** The beta record a landmark depicts, or a reason it may not get a photo. */
function recordCheck(t) {
  if (t.skip) return { why: t.skip };
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
  if (t.skip) return { why: t.skip };
  const key = t.depicts.replace(/^hub:/, '');
  if (key === 'vietnam' || key.startsWith('vietnam/')) return { why: 'Vietnam has no freedom of panorama — no Vietnam hero photo' };
  return { slot: { type: 'hero', key } };
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url, opts = {}) {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), opts.timeout || 30000);
  try { return await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA, Accept: opts.accept || 'application/json' }, signal: ctl.signal, redirect: 'follow' }); }
  finally { clearTimeout(timer); }
}
const qs = o => Object.entries(o).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');

/** Commons must answer with real API JSON from here; anything else (DNS failure, reset, a policy proxy) = offline. */
async function reachable() {
  try {
    const r = await get(`${API}?${qs({ action: 'query', meta: 'siteinfo', format: 'json', formatversion: 2 })}`, { timeout: 10000 });
    if (!r.ok) return `HTTP ${r.status}`;
    const j = await r.json().catch(() => null);
    return j && j.query && j.query.general ? null : 'not the Commons API';
  } catch (e) { return e.cause ? e.cause.code || e.cause.message : e.message; }
}

function loadCredits() {
  const j = JSON.parse(fs.readFileSync(CREDITS, 'utf8'));
  if (!Array.isArray(j.credits)) die('CREDITS.json has no "credits" array');
  return j;
}

/** Plan: per target, either a skip reason or the candidate list to try. Pure (no network). */
function plan(man, credits, o) {
  const haveRecord = new Set(credits.credits.filter(c => c.record).map(c => `${c.record.page}#${c.record.id}`));
  const haveSlot = new Set(credits.credits.filter(c => c.slot).map(c => `${c.slot.type}:${c.slot.key}`));
  const out = [];
  for (const t of man.targets) {
    if (o.keys.length && !o.keys.includes(t.key)) continue;
    if (o.types.length && !o.types.includes(t.type)) continue;
    if (o.pilot && !t.pilot) continue;
    const where = t.type === 'landmark' ? recordCheck(t) : slotCheck(t);
    if (where.why) { out.push({ t, skip: where.why }); continue; }
    if (where.page ? haveRecord.has(`${where.page}#${where.id}`) : haveSlot.has(`hero:${where.slot.key}`)) { out.push({ t, skip: 'already has a credited photo' }); continue; }
    const cands = (t.candidates || []).filter(c => RANK[c.confidence] >= RANK[o.min] && (c.flags || []).every(f => o.allow.includes(f)));
    const lead = o.wikiLead && t.type === 'landmark' && t.article;
    if (!cands.length && !lead) { out.push({ t, skip: (t.candidates || []).length ? `no ${o.min}+ candidate without an unaccepted flag` : (t.article ? 'no candidate (pass --wiki-lead to try the article lead image)' : 'no candidate') }); continue; }
    out.push({ t, where, cands, lead });
  }
  return out;
}

async function main() {
  const o = args(process.argv);
  if (!fs.existsSync(MANIFEST)) die(`no manifest at ${path.relative(ROOT, MANIFEST)}`);
  const man = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const credits = loadCredits();
  const todo0 = plan(man, credits, o);
  const todo = todo0.filter(p => !p.skip);
  const skips = todo0.length - todo.length;
  console.log(`fetch-commons: ${todo0.length} target(s): ${todo.length} to try, ${skips} skipped`);
  for (const p of todo) console.log(`  try   ${p.t.key} → ${p.cands.map(c => `${c.file} (${c.confidence})`).join(' | ')}${p.lead ? `${p.cands.length ? ' | ' : ''}lead image of ${p.t.article}` : ''}`);
  const why = {}; todo0.filter(p => p.skip).forEach(p => { const k = p.skip.replace(/ \(.*$/, '').replace(/ — .*$/, ''); why[k] = (why[k] || 0) + 1; });
  for (const [k, n] of Object.entries(why).sort((a, b) => b[1] - a[1])) console.log(`  skip  ${n} × ${k}`);
  if (o.dry) { console.log('\n--dry-run — nothing fetched.'); return; }
  if (!todo.length) { console.log('\nNothing to do.'); return; }
  const off = await reachable();
  if (off) {
    console.log(`\ncommons.wikimedia.org is not reachable from here (${off}). Nothing fetched (exit 0).\n` +
      '  This runs on a GitHub-hosted runner, where the Wikimedia hosts are reachable. Do NOT route around a block.');
    return;
  }

  let calls = 1;
  const api = async params => { if (calls >= o.budget) throw Object.assign(new Error('budget'), { budget: true }); calls++; await sleep(o.delay);
    const r = await get(`${API}?${qs(Object.assign({ format: 'json', formatversion: 2, maxlag: 5 }, params))}`);
    if (!r.ok) die(`Commons API → HTTP ${r.status}; stopping.`, 4);
    return r.json(); };
  fs.mkdirSync(PHOTO_DIR, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const widthsOf = t => t.type === 'hero' ? o.heroWidths : o.widths, maxOf = t => { const w = widthsOf(t); return w[w.length - 1]; };
  const kept = [], refused = [];
  let imgBytes = 0, stopped = false;

  /** Re-read one File: from the API and apply every check. Returns {ok:info} or {why}. */
  async function inspect(t, title) {
    const j = await api({ action: 'query', titles: title, prop: 'imageinfo|categories', iiprop: 'url|size|mime|sha1|extmetadata', iiurlwidth: maxOf(t), iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|ImageDescription|ObjectName|Restrictions|AttributionRequired', clshow: '!hidden', cllimit: 50 });
    const pg = j.query && j.query.pages && j.query.pages[0];
    if (!pg || pg.missing || !pg.imageinfo || !pg.imageinfo[0]) return { why: 'no such file on Commons (renamed or deleted)' };
    const ii = pg.imageinfo[0], em = ii.extmetadata || {}, val = k => em[k] && em[k].value;
    if (!/^image\/(jpeg|png|webp)$/.test(ii.mime)) return { why: `not a bitmap photo (${ii.mime})` };
    if (ii.width < 640) return { why: `too small (${ii.width} px wide)` };
    if (ii.width > 3 * ii.height) return { why: `a panorama (${ii.width}×${ii.height}) — does not crop to a card or hero` };
    const lic = licenceOf(val('LicenseShortName'), val('LicenseUrl'));
    if (lic.why) return { why: lic.why };
    const author = strip(val('Artist'));
    if (!author) return { why: 'no author in the file metadata' };
    if (/personality|trademark/i.test(val('Restrictions') || '') && !o.allow.includes('people-visible')) return { why: `restrictions: ${strip(val('Restrictions'))}` };
    const cats = (pg.categories || []).map(c => c.title.replace(/^Category:/, ''));
    const desc = strip(val('ImageDescription')), obj = strip(val('ObjectName'));
    if (!namesPlace(t.names, pg.title, obj, desc, cats.join('|'))) return { why: `title, description and categories do not name ${t.label}` };
    return { ok: { title: pg.title, ii, lic, author, desc, obj, cats } };
  }

  /** The lead image of the cited Wikipedia article (pageimages), as a File: title, or null. */
  async function leadOf(article) {
    const m = /^https:\/\/([a-z-]+)\.wikipedia\.org\/wiki\/(.+)$/.exec(article || ''); if (!m) return null;
    calls++; await sleep(o.delay);
    if (calls > o.budget) throw Object.assign(new Error('budget'), { budget: true });
    const r = await get(`https://${m[1]}.wikipedia.org/w/api.php?${qs({ action: 'query', titles: decodeURIComponent(m[2]).replace(/_/g, ' '), prop: 'pageimages', piprop: 'name', redirects: 1, format: 'json', formatversion: 2 })}`);
    if (!r.ok) return null;
    const j = await r.json().catch(() => null), p = j && j.query && j.query.pages && j.query.pages[0];
    return p && p.pageimage ? `File:${p.pageimage.replace(/_/g, ' ')}` : null;
  }

  async function store(p, c, info) {
    const { ii } = info, ext = ii.mime === 'image/png' ? 'png' : ii.mime === 'image/webp' ? 'webp' : 'jpg', base = fileBase(p.t);
    const want = widthsOf(p.t), maxW = maxOf(p.t);
    const ws = want.filter(w => w < ii.width).concat(ii.width < maxW ? [ii.width] : []).filter((w, i, a) => a.indexOf(w) === i);
    const thumb = ii.thumburl || ii.url, out = [];
    for (const w of ws) {
      const url = w === ii.width ? ii.url : thumb.replace(/\/(\d+)px-([^/]+)$/, `/${w}px-$2`);
      const img = await get(url, { accept: 'image/*', timeout: 60000 });
      const type = img.headers.get('content-type') || '';
      if (!img.ok || !/^image\//.test(type)) die(`image ${url} → HTTP ${img.status} ${type}; stopping.`, 4);
      const buf = Buffer.from(await img.arrayBuffer());
      const h = Math.round(ii.height * w / ii.width), file = `${base}-${w}.${ext}`;
      fs.writeFileSync(path.join(PHOTO_DIR, file), buf); imgBytes += buf.length;
      out.push({ file, w, h, kb: Math.round(buf.length / 1024) });
      await sleep(o.delay);
    }
    const main = out[out.length - 1], variants = out.slice(0, -1).map(v => ({ file: v.file, width: v.w, height: v.h }));
    const name = info.title.replace(/^File:/, '');
    credits.credits = credits.credits.filter(x => x.file !== main.file && !(x.variants || []).some(v => v.file === main.file));
    credits.credits.push({
      file: main.file,
      ...(p.where.page ? { record: { page: p.where.page, id: p.where.id } } : { slot: p.where.slot }),
      title: info.obj || name.replace(/\.[a-z0-9]+$/i, ''),
      depicts: c.depicts || p.t.label,
      author: info.author,
      sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(info.title.replace(/ /g, '_')).replace(/%3A/i, ':').replace(/%2C/g, ',').replace(/%28/g, '(').replace(/%29/g, ')')}`,
      licence: info.lic.licence,
      licenceUrl: info.lic.licenceUrl,
      provider: 'wikimedia-commons',
      commonsTitle: info.title,
      sha1: ii.sha1,
      width: main.w, height: main.h,
      ...(variants.length ? { variants } : {}),
      modified: `resized to ${out.map(v => v.w).join(' and ')} px wide`,
      fetched: today,
      confidence: c.confidence,
    });
    fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 1) + '\n');   // after each photo, so a stop keeps the work
    return `${p.t.key} ← ${info.title} (${info.lic.licence}, ${info.author}) → ${out.map(v => `${v.file} ${v.kb} KB`).join(', ')}`;
  }

  try {
    for (const p of todo) {
      let done = false;
      const tries = p.cands.slice();
      for (let i = 0; i <= tries.length && !done; i++) {
        let c = tries[i];
        if (!c) {                                    // candidates exhausted: the article's lead image, once
          if (!p.lead || p.leadTried) break;
          p.leadTried = true;
          const f = await leadOf(p.t.article);
          if (!f) { refused.push(`${p.t.key}: the article has no lead image`); break; }
          c = { file: f, confidence: 'lead', depicts: p.t.label.replace(/\s*\([^)]*\)\s*$/, '') };
        }
        const r = await inspect(p.t, c.file);
        if (r.why) { refused.push(`${p.t.key} ${c.file}: ${r.why}`); continue; }
        kept.push(await store(p, c, r.ok)); done = true;
      }
      if (!done && !p.cands.length && !p.lead) refused.push(`${p.t.key}: nothing to try`);
    }
  } catch (e) { if (!e.budget) throw e; stopped = true; }

  console.log(`\nKept ${kept.length}:`); kept.forEach(k => console.log(`  ok    ${k}`));
  console.log(`Refused ${refused.length}:`); refused.forEach(k => console.log(`  no    ${k}`));
  console.log(`API requests this run: ${calls}/${o.budget}; image bytes ${Math.round(imgBytes / 1024)} KB.${stopped ? ' Budget reached — run again to resume (credited targets are skipped).' : ''}`);
  if (kept.length) console.log('Now: cd tools && npm run beta && npm test');
}

if (require.main === module) main().catch(e => die(e.stack || String(e), 4));
module.exports = { fold, namesPlace, licenceOf, fileBase, recordCheck, slotCheck, plan, strip };
