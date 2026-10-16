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
 *   --scope <s>          what this run may fetch (default priority): heroes = city/hub heroes only; priority = heroes +
 *                        each guide's lead card and first rail row; pilots = + the pilot pages' tier-1 sights;
 *                        all = every target (the full tier-1 set — a repo-size decision, W8)
 *   --pilot              only pilot targets (Tokyo, Cleveland, New York, Chinatown SG, Wheeling + live country hubs)
 *   --min high|med       lowest candidate confidence to consider (default high)
 *   --allow-flag <f>     accept candidates carrying this flag (repeatable): people-visible, public-art-check,
 *                        venue-check, panorama, outdated, author-check. Only after a person has LOOKED at the photo.
 *   --wiki-lead          for a landmark with no usable candidate, try the lead image of its cited Wikipedia article
 *                        (same licence and depicts checks); a manifest target with `wikiLead: true` does so without the flag
 *                        (W8: the lead cards, first rail rows and remaining tier-1 sights that cite an article)
 *   --widths a,b         card photo widths (srcset; default 480,960 → snapped to 500,960; the largest is the credited file)
 *   --hero-widths a,b    hero photo widths (default 960,1280)
 *   --delay <ms>         pause between requests (default 400; API etiquette)
 *   --no-rescan          skip the start-of-run re-scan of credited photos (see 2b; it reports, never deletes)
 *
 * Per target it takes the first candidate that passes, in manifest order:
 *   1. GET commons.wikimedia.org/w/api.php?action=query&prop=imageinfo|categories&iiprop=url|size|mime|sha1|
 *      extmetadata&iiurlwidth=<largest> — the API, not the search snippet, is the truth.
 *   2. Licence (extmetadata LicenseShortName) must be CC0, public domain, CC BY or CC BY-SA; NC, ND, GFDL-only and
 *      anything else is refused. Author (Artist, HTML stripped) must be present. Bitmap only (JPEG/PNG/WebP), at least
 *      640 px wide, not a panorama wider than 3:1.
 *   2b. Refused: a candidate a person marked `refused` after looking at it; one whose title/description suggests that
 *      signage, lettering, a logo or advertising is the subject; one whose title/description/categories suggest
 *      equipment, people or a close-up (hands, a drone controller, a portrait) — each unless the target itself is named
 *      so (Sign Hill, a portrait gallery); a hero whose title/description says winter, snow, overcast or fog.
 *      Every run first RE-SCANS the already-credited photos with these rules against their current Commons text and
 *      prints `RESCAN` lines (report only; ≈ 1 API request per 50 photos) — except an author string saved before
 *      authorOf() existed, which it re-derives from the API and rewrites.
 *   2c. Author: the `Artist` HTML minus templates, userboxes, flag notices and "(talk)" asides (authorOf); refused when
 *      it is still not a clean name (> 60 characters, notice text, said twice). A hero refuses "Unknown author".
 *   3. Depicts re-check: the file title, its description or one of its visible categories must contain one of the
 *      target's `names` (compared without spaces, punctuation or diacritics). Otherwise refused.
 *   4. Download the server-side thumbnails: each asked width is snapped to Commons' standard thumbnail steps (250, 330,
 *      500, 960, 1280, 1920 — other widths answer HTTP 400), its URL comes from the API for that width, never wider than
 *      the original. Stored as beta/assets/img/photos/<base>-<w>.<ext>. A failed thumbnail refuses that candidate; a
 *      429/5xx from the image host stops the run cleanly (the next run resumes).
 *   5. Write/replace its CREDITS.json row: the largest width is `file`, the others are `variants` (same credit), plus
 *      title, depicts, author, sourceUrl (the Commons file page), licence, licenceUrl, provider, commonsTitle, sha1,
 *      modified ("resized"), fetched, confidence.
 * Then: cd tools && npm run beta && npm test — the credit gate (photos.js) renders it with its caption, or names the
 * exact problem.
 *
 * Exit codes: 0 = done, nothing to do, or the hosts are unreachable (plan printed); 1 = bad option/input;
 * 4 = the API failed, or more than 25 % of image downloads failed (a single bad thumbnail only skips that candidate;
 * finished photos are kept: CREDITS.json is written after each one). Thumbnails come from thumb.wikimedia.org or
 * upload.wikimedia.org, whichever URL the API returns; nothing checks the host, and the credit links the File: page.
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
  const o = { scope: 'priority', dry: false, keys: [], types: [], min: 'high', allow: [], widths: [480, 960], heroWidths: [960, 1280], budget: 150, wikiLead: false, pilot: false, delay: 400 };
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
    else if (a === '--no-rescan') o.noRescan = true;
    else if (a === '--no-backfill') o.noBackfill = true;
    else if (a === '--scope') o.scope = v();
    else if (a === '-h' || a === '--help') { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(0); }
    else die(`unknown option ${a} (see --help)`);
  }
  if (!SCOPES.includes(o.scope)) die(`--scope must be one of ${SCOPES.join(' | ')}`);
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
  if (/^Copyrighted free use$/i.test(s)) return { licence: 'Copyrighted free use', licenceUrl: 'https://commons.wikimedia.org/wiki/Template:Copyrighted_free_use' };   // any use, no conditions (W8, approved)
  if (/^(Public domain|PD\b|PD-)/i.test(s)) return { licence: 'Public domain', licenceUrl: 'https://creativecommons.org/publicdomain/mark/1.0/' };
  if ((m = /^CC[ -](BY(?:-SA)?)[ -](\d\.\d)(?:[ -]([a-z]{2,3}))?$/i.exec(s))) {
    const kind = m[1].toUpperCase(), ver = m[2], port = m[3] ? ' ' + m[3].toUpperCase() : '';
    const deed = /^https:\/\/creativecommons\.org\/licenses\//.test(url || '') ? url.replace(/^http:/, 'https:') : `https://creativecommons.org/licenses/${kind.toLowerCase()}/${ver}/`;
    return { licence: `CC ${kind} ${ver}${port}`, licenceUrl: deed };
  }
  return { why: `licence ${s} is not CC0 / PD / CC BY / CC BY-SA` };
}
const strip = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim();

/**
 * The photographer's name from the Commons `Artist` HTML. Templates, userboxes and notices (tables, divs, lists, flag
 * icons with their alt text) are dropped; "(talk)", "(contribs)" and "(User:x)" asides go; a doubled name
 * ("Unknown author Unknown author") is said once. When what is left is still long or template-like, the text of the
 * first link (the user or creator page) is the name. (W7: a "Kakidai" credit carried a flag notice.)
 */
function authorOf(html) {
  const h = String(html || '').replace(/<(table|div|ul|ol|style|sup|small)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<img\b[^>]*>/gi, ' ');
  const links = [...h.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map(m => cleanAuthor(strip(m[1]))).filter(Boolean);
  const s = cleanAuthor(strip(h));
  return authorProblems(s).length && links.length && !authorProblems(links[0]).length ? links[0] : s;
}
function cleanAuthor(s) {
  s = String(s || '').replace(FILE_PREFIX, '').replace(DERIVATIVE, '')
    .replace(/\s+-\s+User:.*$/i, '')                                          // "J. Miers - User: (WT-shared) x at y" → "J. Miers"
    .replace(/\((?:[^()]*\b(?:wikipedia|wikivoyage|WT-shared)\b[^()]*)\)/gi, ' ')    // "(English Wikipedia)", "(a.k.a x at en.wikipedia)"
    .replace(/\s+at\s+(?:[a-z-]+\.)?(?:[A-Z][a-z]+\s+)?(?:wikipedia|wikivoyage)\b.*$/i, '')   // "Riction at English Wikipedia", "x at en.wikipedia"
    .replace(/^User:\s*/i, '').replace(/\(\s*(talk|contribs?|User:[^)]*|(?:https?:\/\/|www\.)[^)\s]*)\s*\)/gi, ' ').replace(/^(?:photo(?:graph)?|picture|image)\s+(?:by|:)\s+/i, '')
    .replace(/\s+/g, ' ').trim().replace(/(?:\s+\.|[\s,;:·-])+$/, '');   // a lone trailing " ." goes; an initial's "O.J." stays
  const m = /^(.+?) \1$/.exec(s);
  return m ? m[1] : s;
}
/** "Original.jpg : " before a name (the file a derivative was made from) and a trailing "derivative work: X" note. */
const FILE_PREFIX = /^[^:]*\.(?:jpe?g|png|tiff?|gif|svg|webp)\s*:\s*/i;
const DERIVATIVE = /[\s;,.]*\(?\s*derivative work:?\s*([^)]*)\)?\s*$/i;
/** The derivative note an Artist string carries ("derivative work by O.J."), for the row's `modified`; '' when none. */
function derivativeNote(html) {
  const m = DERIVATIVE.exec(strip(String(html || '').replace(/<(table|div|ul|ol|style|sup|small)\b[\s\S]*?<\/\1>/gi, ' ')));
  const by = m && cleanAuthor(m[1]);
  return by ? `derivative work by ${by}` : '';
}
/**
 * The author when the Artist field is empty: an "Own work" upload (Credit field) is by its uploader, whom the API
 * names (imageinfo user). Nothing else is guessed (W8: Tiong Bahru / Queenstown own-work files had no Artist).
 */
function authorOrUploader(artistHtml, creditHtml, uploader) {
  const a = authorOf(artistHtml);
  if (a) return a;
  return /\bown work\b/i.test(strip(creditHtml)) && uploader ? cleanAuthor(uploader) : '';
}
/** Why an author string is not a clean credit name ([] when it is). */
const authorProblems = a => [!a && 'empty', a && a.length > 60 && 'longer than 60 characters',
  /flag of|userbox|legal disclaimer|\(\s*talk\s*\)|uploader was|this image shows/i.test(a || '') && 'template or notice text',
  /^(.+?) \1$/.test(a || '') && 'name said twice', /\bUser:|wikipedia|wikivoyage|WT-shared/i.test(a || '') && 'a wiki user-page or project aside (R7 QA-56)', /derivative/i.test(a || '') && 'a derivative note (belongs in modified)',
  /\.(?:jpe?g|png|tiff?|gif|svg|webp)\b/i.test(a || '') && 'a file name'].filter(Boolean);

/** Corporate signage, logos, lettering or advertising as the subject (owner review, W7): such a file is refused —
 * unless the sign IS the place (the target's own names say so, e.g. Sign Hill, the Glico Running Man sign). */
const SIGNAGE = /\b(logos?|signage|signboards?|signs?|billboards?|advertis\w*|letters|lettering|info(?:rmation)? boards?|map boards?|notice ?boards?|interpretive (?:panels?|signs?|boards?)|signposts?|plaques?|historical markers?|(?<!wikivoyage )banners?)\b/i;
/** Equipment, people or close-ups as the subject (owner review, W7: a "RiverScape, Dayton" file showed hands on a
 * drone controller): refused for every slot. Checked against the title, description and visible categories. */
const CLOSEUP = /\b(drone controllers?|controllers?|remote controls?|remotes?|hands|holding|selfies?|portraits?|close-?ups?|equipment|figurines?|statuettes?|lotus(?:es)?|macro)\b|\(detail\)/i;
/** Rescan hits a person looked at and kept (W7 review): the file's subject is the place; the matched word is incidental. */
const RESCAN_KEPT = {
  'File:Brooklyn Bridge, Downtown Manhattan, and Freedom Tower, golden hour (20137848066).jpg': 'kept after review (W7): moody but strong — cables, skyline and light; not dull',
};
/** A performer or a performance is the subject, not the place (W8 run #40: a singer at the Empty Bottle). */
const PERFORMER = /\b(live at|performing|performs|performance of|on stage|onstage|in concert|concert at|band|singer|comedian|stand-?up|main stage|stage)\b/i;
/** A music club, comedy club, improv or theatre record: only the building outside (W8). */
const PERFORMANCE_VENUE = /\b(music club|comedy|improv|theat(?:re|er)|jazz club|blues club|concert hall|music venue|night ?club|second city|empty bottle)\b/i;
const EXTERIOR = /\b(exterior|fa[cç]ade|front|building|entrance|marquee|outside|street view)\b/i;
const INTERIOR = /\b(interior|inside|auditorium|stage|backstage|seating)\b/i;
/** Refused when a performer is the subject, or when a performance venue's photo is not its building's exterior. */
function performerRefused(t, text) {
  if (subjectRefused(PERFORMER, t, text)) return 'a performer or a performance is the subject, not the place';
  if (PERFORMANCE_VENUE.test(`${t.label || ''}`) && (INTERIOR.test(text) || !(EXTERIOR.test(text) || namesPlace(t.names, text))))
    return 'a performance venue takes only its building exterior (no stage, interior or show)';
  return '';
}
/** A subject check applies unless the target itself is named by it (a museum of signs, a portrait gallery). */
const subjectRefused = (re, t, text) => re.test(text) && !re.test(`${t.label || ''} ${(t.names || []).join(' ')}`);

/** City and hub heroes: bright, warm-season or golden-hour establishing shots (owner review, W7). A gloomy one is refused
 * unless the target says `winterOk` (a winter destination). Night views stay allowed; night-time construction does not. */
const GLOOM = /\b(winter|snow\w*|overcast|fog\w*|blizzard|ice storm|construction)\b/i;

/** A run fails only when more than a quarter of the attempted downloads failed (a single bad file is skipped). */
const tooManyFailures = (tries, fails) => tries >= 4 && fails / tries > 0.25;

/**
 * Commons serves thumbnails only at its standard widths (a non-standard width such as 640 answers HTTP 400), so each
 * asked width is snapped to the nearest standard step, never wider than the original (then the original is used).
 */
const STD_WIDTHS = [250, 330, 500, 960, 1280, 1920];
function snapWidths(ws, orig) {
  const out = [];
  for (const w of ws) {
    const s = STD_WIDTHS.reduce((a, b) => Math.abs(b - w) < Math.abs(a - w) ? b : a);
    const v = s >= orig ? orig : s;
    if (!out.includes(v)) out.push(v);
  }
  return out.sort((a, b) => a - b);
}

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

/**
 * Widths per class (W8 repo-size decision): heroes take --hero-widths; a guide's lead card and first-row sights (what a
 * visitor sees first) take --widths plus the derived 720 (500 + 720 + 960, D-40 option a); every other card takes the
 * smallest card width plus the derived 720 (500 + 720).
 */
function widthsFor(t, o) {
  if (t.type === 'hero') return o.heroWidths;
  // a lead / first-row card also takes the 720 copy (D-40 option a): what a 3× phone loads, capped ≤ 55 KB by recompress
  return t.priority ? [...new Set([...o.widths, DERIVED_W])].sort((a, b) => a - b) : [Math.min(...o.widths), DERIVED_W];
}
/** A card's ≈ 2× copy (D-40, ratified by QA): Commons serves no 720 px thumbnail, so it is derived on the runner from
 *  the 960 one (sharp), never kept at 960. Without sharp the card stays 500 w only. */
const DERIVED_W = 720;
/** "500", "500 and 960", "500, 720 and 960". */
const widthList = ws => ws.length < 3 ? ws.join(' and ') : `${ws.slice(0, -1).join(', ')} and ${ws[ws.length - 1]}`;
function loadSharp() {
  for (const base of [path.join(ROOT, 'tools'), process.cwd()]) { try { return require(require.resolve('sharp', { paths: [base] })); } catch (e) { /* next */ } }
  try { return require('sharp'); } catch (e) { return null; }
}
/** A target's Wikipedia articles to try for a lead image, in order: `articles` (heroes: the town, then iconic sights), else `article`. */
const articlesOf = t => (t.articles && t.articles.length ? t.articles : t.article ? [t.article] : []);
/** A print, painting or drawing of the place is artwork, not the place today (R7 QA-53: a Hiroshige Nihonbashi). */
const ARTWORK = /\b(woodblock|ukiyo-?e|paintings?|painted by|prints?|engravings?|lithographs?|etchings?|postcards?|drawings?|illustrations?)\b/i;
/** Vehicles or works dominating the frame (R7 QA-53: tour buses at Tokyo Tower, a van at MoMA, a construction site) —
 *  flagged by the rescan for a person to look at; too common in descriptions to refuse on the word alone. */
const VEHICLES = /\b(bus(?:es)?|tour bus|coach(?:es)?|delivery vans?|trucks?|lorr(?:y|ies)|construction site|under construction|construction work|scaffold\w*|cranes?|bulldozers?|excavators?|trolleys?|trams?|streetcars?|locomotives?|railcars?)\b/i;   // not bare "van" (Dutch names) or "construction" (history text)
/**
 * "<X> from <place>" / "View from <place>": the file shows the view FROM the place, not the place (W8: "Chuo-dori from
 * Nihonbashi" for Nihonbashi Bridge). Refused unless the part before "from" (or the depicts text) names the place too.
 */
function viewFrom(title, names, depicts = '') {
  const t = String(title || '').replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, '');
  const m = /^(.*?)\b(?:seen |viewed |as seen |looking )?from\b(.+)$/i.exec(t);
  if (!m) return false;
  const named = s => namesPlace(names, s);
  return named(m[2]) && !named(m[1]) && !named(depicts);
}
/** Maps, heraldry, flags, emblems, diagrams, posters, montages and logos are not a photo of the place (W8: town-article
 *  lead images; R7: the NMUSAF emblem got through as "museum"). Checked on the title, object name and vetted depicts. */
const NOT_A_PHOTO = /\b(maps?|locator|location map|coats? of arms|flags?|seals?|emblems?|crests?|insignias?|badges?|logos?|logotypes?|diagrams?|posters?|montages?|collages?)\b/i;
/** A PNG (or other non-JPEG) bitmap is suspect — most are emblems, maps or diagrams: accept it only with a vetted
 *  candidate's depicts that says it is a photograph of the place (R7-g7). */
const suspectFormat = (mime, depicts) => !/^image\/jpeg$/i.test(mime || '') && !String(depicts || '').trim() && 'a PNG/non-JPEG lead image with no vetted depicts — likely an emblem, map or diagram, not a photo';
/** A refusal about the photo itself (signage, gloom, close-up, wrong subject) holds for every target; one about the
 *  slot (a duplicate of another hero or card, repeating a lead card's subject) holds only for the target it names. */
const refusalIsGlobal = reason => !/duplicat|same file|repeats|already|place card|is the [\w ]*hero|the [\w ]+ hero is/i.test(reason || '');
/** What a run may fetch (W8): a stray run can never pull the whole tier-1 set. */
const SCOPES = ['heroes', 'priority', 'pilots', 'all'];
function inScope(t, scope) {
  if (t.type === 'hero' || scope === 'all') return true;
  if (scope === 'heroes') return false;
  return !!t.priority || (scope === 'pilots' && !!t.pilot);
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
    if (!inScope(t, o.scope || 'all')) continue;
    const where = t.type === 'landmark' ? recordCheck(t) : slotCheck(t);
    if (where.why) { out.push({ t, skip: where.why }); continue; }
    if (where.page ? haveRecord.has(`${where.page}#${where.id}`) : haveSlot.has(`hero:${where.slot.key}`)) { out.push({ t, skip: 'already has a credited photo' }); continue; }
    const cands = (t.candidates || []).filter(c => !c.refused && RANK[c.confidence] >= RANK[o.min] && (c.flags || []).every(f => o.allow.includes(f)));
    const lead = (o.wikiLead || t.wikiLead) && articlesOf(t).length > 0;   // W8: the manifest opts a target in (heroes too)
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
  console.log(`fetch-commons: scope ${o.scope} — ${todo0.length} target(s): ${todo.length} to try, ${skips} skipped`);
  for (const p of todo) console.log(`  try   ${p.t.key} → ${p.cands.map(c => `${c.file} (${c.confidence})`).join(' | ')}${p.lead ? `${p.cands.length ? ' | ' : ''}lead image of ${articlesOf(p.t).join(' / ')}` : ''}`);
  const why = {}; todo0.filter(p => p.skip).forEach(p => { const k = p.skip.replace(/ \(.*$/, '').replace(/ — .*$/, ''); why[k] = (why[k] || 0) + 1; });
  for (const [k, n] of Object.entries(why).sort((a, b) => b[1] - a[1])) console.log(`  skip  ${n} × ${k}`);
  // a landmark caught only by a venue word in its name is listed, so a person can spot a wrongly skipped building
  for (const p of todo0.filter(p => p.skip && /named so/.test(p.skip))) console.log(`  skip  venue by name: ${p.t.key} (${p.t.label}) — review if this is a landmark, not a venue`);
  if (o.dry) { console.log('\n--dry-run — nothing fetched.'); return; }
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
  const widthsOf = t => widthsFor(t, o), maxOf = t => { const w = widthsOf(t); return w[w.length - 1]; };
  const kept = [], refused = [];
  let imgBytes = 0, stopped = false, imgTries = 0, imgFails = 0;

  /** Re-read one File: from the API and apply every check. Returns {ok:info} or {why}. */
  async function inspect(t, title, depicts = '') {
    const j = await api({ action: 'query', titles: title, prop: 'imageinfo|categories', iiprop: 'url|size|mime|sha1|user|extmetadata', iiurlwidth: snapWidths(widthsOf(t), 1e9).pop(), iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|Credit|ImageDescription|ObjectName|Restrictions|AttributionRequired', clshow: '!hidden', cllimit: 50 });
    const pg = j.query && j.query.pages && j.query.pages[0];
    if (!pg || pg.missing || !pg.imageinfo || !pg.imageinfo[0]) return { why: 'no such file on Commons (renamed or deleted)' };
    const dup = credits.credits.find(c => c.commonsTitle === pg.title);   // one Commons file, one credit row
    if (dup) return { why: `already credited to ${dup.slot ? `hero:${dup.slot.key}` : `${dup.record.page}#${dup.record.id}`} (one file, one row)` };
    const ii = pg.imageinfo[0], em = ii.extmetadata || {}, val = k => em[k] && em[k].value;
    if (!/^image\/(jpeg|png|webp)$/.test(ii.mime)) return { why: `not a bitmap photo (${ii.mime})` };
    if (ii.width < 640) return { why: `too small (${ii.width} px wide)` };
    if (ii.width > 3 * ii.height) return { why: `a panorama (${ii.width}×${ii.height}) — does not crop to a card or hero` };
    const lic = licenceOf(val('LicenseShortName'), val('LicenseUrl'));
    if (lic.why) return { why: lic.why };
    const author = authorOrUploader(val('Artist'), val('Credit'), ii.user);
    const viaUploader = !authorOf(val('Artist')) && !!author;   // audited: named in the run log
    if (!author) return { why: 'no author in the file metadata' };
    if (authorProblems(author).length) return { why: `author "${author.slice(0, 80)}" is not a clean name (${authorProblems(author).join(', ')})` };
    if (t.type === 'hero' && /^unknown author$/i.test(author)) return { why: 'a hero prefers a named author (this one is "Unknown author")' };
    if (/personality|trademark/i.test(val('Restrictions') || '') && !o.allow.includes('people-visible')) return { why: `restrictions: ${strip(val('Restrictions'))}` };
    const cats = (pg.categories || []).map(c => c.title.replace(/^Category:/, ''));
    const desc = strip(val('ImageDescription')), obj = strip(val('ObjectName'));
    if (t.type === 'hero' && !t.winterOk && GLOOM.test(`${pg.title} ${obj} ${desc}`)) return { why: 'a hero wants a bright, warm-season or golden-hour view; the title or description says winter, snow, overcast or fog' };
    if (subjectRefused(ARTWORK, t, `${pg.title} ${obj} ${desc}`)) return { why: 'a print, painting or drawing — artwork, not a photo of the place today' };
    { const pr = performerRefused(t, `${pg.title} ${obj} ${desc}`); if (pr) return { why: pr }; }
    if (viewFrom(pg.title, t.names, depicts)) return { why: 'the view FROM the place ("… from <place>"), not the place itself' };
    if (subjectRefused(NOT_A_PHOTO, t, `${pg.title} ${obj} ${depicts}`)) return { why: 'a map, coat of arms, flag, emblem, insignia, badge, diagram, poster, montage or logo — not a photo of the place' };
    { const sf = suspectFormat(ii.mime, depicts); if (sf) return { why: sf }; }
    if (subjectRefused(SIGNAGE, t, `${pg.title} ${obj} ${desc}`)) return { why: 'title or description suggests signage, lettering, a logo or advertising is the subject' };
    if (subjectRefused(CLOSEUP, t, `${pg.title} ${obj} ${desc} ${cats.join(' | ')}`)) return { why: 'title, description or categories suggest equipment, people or a close-up is the subject, not the place' };
    if (!namesPlace(t.names, pg.title, obj, desc, cats.join('|'))) return { why: `title, description and categories do not name ${t.label}` };
    return { ok: { title: pg.title, ii, lic, author, viaUploader, desc, obj, cats, derived: derivativeNote(val('Artist')) } };
  }

  /**
   * Re-scan every credited Commons photo with today's subject rules (signage, equipment/close-up, hero gloom), against
   * the file's CURRENT description and categories — 50 titles per API request. Reports only: a person looks, then
   * marks the candidate `refused` in the manifest and removes the row.
   */
  async function rescan() {
    const rows = credits.credits.filter(c => c.provider === 'wikimedia-commons' && c.commonsTitle), hits = [];
    let fixed = 0, kept = 0;
    const byKey = new Map(man.targets.map(t => [t.key, t]));
    for (let i = 0; i < rows.length; i += 50) {
      const part = rows.slice(i, i + 50);
      const j = await api({ action: 'query', titles: part.map(c => c.commonsTitle).join('|'), prop: 'imageinfo|categories', iiprop: 'extmetadata', iiextmetadatafilter: 'ImageDescription|ObjectName|Artist', clshow: '!hidden', cllimit: 'max' });
      const pages = new Map(((j.query && j.query.pages) || []).map(pg => [pg.title, pg]));
      const norm = new Map(((j.query && j.query.normalized) || []).map(n => [n.from, n.to]));
      for (const c of part) {
        const pg = pages.get(norm.get(c.commonsTitle) || c.commonsTitle);
        const key = c.slot ? `hero:${c.slot.key}` : `landmark:${c.record.page}#${c.record.id}`, t = byKey.get(key) || { label: c.depicts, names: [] };
        if (!pg || pg.missing) { hits.push(`${key} ${c.commonsTitle}: no longer on Commons`); continue; }
        const em = (pg.imageinfo && pg.imageinfo[0] && pg.imageinfo[0].extmetadata) || {}, v = k => strip(em[k] && em[k].value);
        if (authorProblems(c.author).length) {   // an author saved before authorOf existed: re-derive it from the API
          const a = authorOf(em.Artist && em.Artist.value);
          if (a && !authorProblems(a).length) { hits.push(`${key} ${c.commonsTitle}: author fixed "${c.author.slice(0, 60)}" → "${a}"`); c.author = a; fixed++; }
          else hits.push(`${key} ${c.commonsTitle}: author "${c.author.slice(0, 60)}" needs a person (${authorProblems(c.author).join(', ')})`);
        }
        const cats = (pg.categories || []).map(x => x.title.replace(/^Category:/, '')).join(' | ');
        const text = `${pg.title} ${v('ObjectName')} ${v('ImageDescription')}`;
        if (RESCAN_KEPT[c.commonsTitle]) { kept++; continue; }
        if (subjectRefused(SIGNAGE, t, text)) hits.push(`${key} ${c.commonsTitle}: signage/lettering/logo (${(SIGNAGE.exec(text) || [])[0]})`);
        if (subjectRefused(CLOSEUP, t, `${text} ${cats}`)) hits.push(`${key} ${c.commonsTitle}: equipment/people/close-up (${(CLOSEUP.exec(`${text} ${cats}`) || [])[0]})`);
        { const cand = (t.candidates || []).find(x => x.file === c.commonsTitle && !x.refused);
          if (viewFrom(c.commonsTitle, t.names || [], cand ? cand.depicts : '')) hits.push(`${key} ${c.commonsTitle}: the view FROM the place, not the place`); }
        { const pr = performerRefused(t, text); if (pr) hits.push(`${key} ${c.commonsTitle}: ${pr}`); }
        if (subjectRefused(ARTWORK, t, text)) hits.push(`${key} ${c.commonsTitle}: a print/painting, not the place (${(ARTWORK.exec(text) || [])[0]})`);
        // report-only: flagged even where the place is named so (a trolley museum's trolley is still equipment)
        if (VEHICLES.test(text)) hits.push(`${key} ${c.commonsTitle}: vehicles or works may dominate (${(VEHICLES.exec(text) || [])[0]}) — look`);
        if (c.slot && !t.winterOk && GLOOM.test(text)) hits.push(`${key} ${c.commonsTitle}: gloomy hero (${(GLOOM.exec(text) || [])[0]})`);
      }
    }
    if (fixed) fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 1) + '\n');
    console.log(`\nRescan of ${rows.length} credited Commons photo(s): ${hits.length} hit(s)${fixed ? `, ${fixed} author(s) fixed from the API` : ''}${kept ? `, ${kept} kept after review` : ''}${hits.length > fixed ? ' — review subject hits, then mark refused' : ''}`);
    hits.forEach(h => console.log(`  RESCAN ${h}`));
  }

  /** The lead image of the cited Wikipedia article (pageimages), as a File: title, or null. */
  async function leadOf(article) {
    const m = /^https:\/\/([a-z-]+)\.wikipedia\.org\/wiki\/(.+)$/.exec(article || ''); if (!m) return null;
    calls++; await sleep(o.delay);
    if (calls > o.budget) throw Object.assign(new Error('budget'), { budget: true });
    const r = await get(`https://${m[1]}.wikipedia.org/w/api.php?${qs({ action: 'query', titles: decodeURIComponent(m[2]).replace(/_/g, ' '), prop: 'pageimages', piprop: 'name', redirects: 1, format: 'json', formatversion: 2 })}`).catch(() => null);
    if (!r || !r.ok) return null;   // a Wikipedia hiccup skips this one target, never the run
    const j = await r.json().catch(() => null), p = j && j.query && j.query.pages && j.query.pages[0];
    return p && p.pageimage ? `File:${p.pageimage.replace(/_/g, ' ')}` : null;
  }

  /** Remove the sizes already written for a candidate that is then refused: an uncredited file would fail the gate. */
  const drop = out => { for (const v of out.splice(0)) { try { fs.unlinkSync(path.join(PHOTO_DIR, v.file)); } catch (e) { /* already gone */ } imgBytes -= v.bytes || 0; } };
  const sharp = loadSharp(), refusedNote = [];
  /** Download the API's next standard thumbnail above w (960 for 720) and downscale it to w. {ok:{file,w,h,kb,bytes}} | {why[,stop]} */
  async function deriveWidth(title, base, ext, w) {
    if (!sharp) return { why: 'sharp is not installed' };
    const src = STD_WIDTHS.find(s => s > w);
    const j = await api({ action: 'query', titles: title, prop: 'imageinfo', iiprop: 'url|size', iiurlwidth: src });
    const t = j.query && j.query.pages && j.query.pages[0] && j.query.pages[0].imageinfo && j.query.pages[0].imageinfo[0];
    if (!t || !t.thumburl || !(t.thumbwidth > w)) return { why: `no ${src} px thumbnail to derive from` };
    imgTries++;
    const img = await get(t.thumburl, { accept: 'image/*', timeout: 60000 }).catch(e => ({ ok: false, status: 0, headers: { get: () => String(e.message) } }));
    if (img.status === 429 || img.status >= 500) { imgFails++; return { why: `image host HTTP ${img.status} — stopping; the next run resumes`, stop: true }; }
    if (!img.ok) { imgFails++; return { why: `thumbnail → HTTP ${img.status}` }; }
    const buf = await sharp(Buffer.from(await img.arrayBuffer())).resize({ width: w }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    const m = await sharp(buf).metadata(), file = `${base}-${m.width}.${ext === 'png' ? 'jpg' : ext}`;
    fs.writeFileSync(path.join(PHOTO_DIR, file), buf); imgBytes += buf.length;
    await sleep(o.delay);
    return { ok: { file, w: m.width, h: m.height, kb: Math.round(buf.length / 1024), bytes: buf.length } };
  }
  /** Card rows fetched before the 720 copy existed (500 w only): add it, budget permitting (after the run's new targets). */
  async function backfill720() {
    const byKey = new Map(man.targets.map(t => [t.key, t]));
    const rows = credits.credits.filter(c => c.provider === 'wikimedia-commons' && c.record && !c.variants && /-500\.jpe?g$/i.test(c.file) && (c.width || 0) <= 500)
      .filter(c => { const t = byKey.get(`landmark:${c.record.page}#${c.record.id}`); return t && !t.priority && !t.skip; });
    let added = 0;
    for (const c of rows) {
      const d = await deriveWidth(c.commonsTitle, c.file.replace(/-500\.jpe?g$/i, ''), 'jpg', DERIVED_W);
      if (d.why) { if (d.stop) throw Object.assign(new Error(d.why), { budget: true, why: d.why }); continue; }
      c.variants = [{ file: c.file, width: c.width, height: c.height }];
      c.file = d.ok.file; c.width = d.ok.w; c.height = d.ok.h;
      c.modified = String(c.modified || '').replace(/^resized to 500 px wide/, `resized to 500 and ${d.ok.w} px wide`).replace(/; recompressed \(JPEG, quality ≤ 72\)/, '');
      delete c.color; added++;
      fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 1) + '\n');
    }
    if (rows.length) console.log(`\nBackfill: ${added}/${rows.length} card(s) given a ${DERIVED_W} px copy${sharp ? '' : ' (sharp is not installed — none)'}.`);
  }
  async function store(p, c, info) {
    const { ii } = info, ext = ii.mime === 'image/png' ? 'png' : ii.mime === 'image/webp' ? 'webp' : 'jpg', base = fileBase(p.t);
    const asked = widthsOf(p.t), derive = asked.filter(w => !STD_WIDTHS.includes(w) && w < ii.width);
    const ws = snapWidths(asked.filter(w => !derive.includes(w)), ii.width), out = [];
    for (const w of ws) {
      // the URL comes from the API for that exact width (Commons serves only its standard thumbnail sizes, and the
      // API knows the current host and path); the original only when it is no wider than the step asked for
      let url = ii.url, tw = ii.width, th = ii.height;
      if (w < ii.width) {
        if (w === ii.thumbwidth && ii.thumburl) { url = ii.thumburl; tw = ii.thumbwidth; th = ii.thumbheight; }
        else {
          const j = await api({ action: 'query', titles: info.title, prop: 'imageinfo', iiprop: 'url|size', iiurlwidth: w });
          const t = j.query && j.query.pages && j.query.pages[0] && j.query.pages[0].imageinfo && j.query.pages[0].imageinfo[0];
          if (!t || !t.thumburl) { drop(out); return { why: `no ${w} px thumbnail from the API` }; }
          url = t.thumburl; tw = t.thumbwidth; th = t.thumbheight;
        }
      }
      imgTries++;
      const img = await get(url, { accept: 'image/*', timeout: 60000 }).catch(e => ({ ok: false, status: 0, headers: { get: () => String(e.cause ? e.cause.code || e.cause.message : e.message) } }));
      const type = img.headers.get('content-type') || '';
      if (img.status === 429 || img.status >= 500) { drop(out); imgFails++; throw Object.assign(new Error(`image host answered HTTP ${img.status}`), { budget: true, why: `image host HTTP ${img.status} — stopping; the next run resumes` }); }
      if (!img.ok || !/^image\//.test(type)) { imgFails++; drop(out); return { why: `thumbnail ${url} → HTTP ${img.status} ${type}` }; }
      const buf = Buffer.from(await img.arrayBuffer());
      const file = `${base}-${tw}.${ext}`;
      fs.writeFileSync(path.join(PHOTO_DIR, file), buf); imgBytes += buf.length;
      out.push({ file, w: tw, h: th, kb: Math.round(buf.length / 1024), bytes: buf.length });
      await sleep(o.delay);
    }
    for (const w of derive) {   // e.g. 720: downscaled from the API's 960 thumbnail, the 960 itself is not kept
      const d = await deriveWidth(info.title, base, ext, w);
      if (d.why) { if (d.stop) { drop(out); throw Object.assign(new Error(d.why), { budget: true, why: d.why }); } refusedNote.push(`${p.t.key}: no ${w} px copy (${d.why}) — kept ${out.map(v => v.w).join('+')}`); continue; }
      out.push(d.ok); out.sort((a, b) => a.w - b.w);
    }
    if (!out.length) return { why: 'no thumbnail could be stored' };
    const main = out[out.length - 1], variants = out.slice(0, -1).map(v => ({ file: v.file, width: v.w, height: v.h }));
    const name = info.title.replace(/^File:/, '');
    credits.credits = credits.credits.filter(x => x.file !== main.file && !(x.variants || []).some(v => v.file === main.file));
    credits.credits.push({
      file: main.file,
      ...(p.where.page ? { record: { page: p.where.page, id: p.where.id } } : { slot: p.where.slot }),
      title: info.obj || name.replace(/\.[a-z0-9]+$/i, ''),
      depicts: c.depicts || info.obj || name.replace(/\.[a-z0-9]+$/i, '').replace(/[_]+/g, ' '),
      author: info.author,
      sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(info.title.replace(/ /g, '_')).replace(/%3A/i, ':').replace(/%2C/g, ',').replace(/%28/g, '(').replace(/%29/g, ')')}`,
      licence: info.lic.licence,
      licenceUrl: info.lic.licenceUrl,
      provider: 'wikimedia-commons',
      commonsTitle: info.title,
      sha1: ii.sha1,
      width: main.w, height: main.h,
      ...(variants.length ? { variants } : {}),
      modified: `resized to ${widthList(out.map(v => v.w))} px wide${info.derived ? `; ${info.derived}` : ''}`,
      fetched: today,
      confidence: c.confidence,
    });
    fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 1) + '\n');   // after each photo, so a stop keeps the work
    return { ok: `${p.t.key} ← ${info.title} (${info.lic.licence}, ${info.author}${info.viaUploader ? ' — author = uploader, own work (no Artist on Commons)' : ''}) → ${out.map(v => `${v.file} ${v.kb} KB`).join(', ')}` };
  }

  /** Every file a person refused, whichever target it was refused for: the reason is about the photo, not the place. */
  const refusedAnywhere = new Set(man.targets.flatMap(t => (t.candidates || []).filter(c => c.refused && refusalIsGlobal(c.refused)).map(c => c.file)));
  try {
    if (!o.noRescan) await rescan();
    for (const p of todo) {
      let done = false;
      const tries = p.cands.slice(), arts = p.lead ? articlesOf(p.t).slice() : [];
      // a photo refused for its own fault is refused for every target (W8: Den Den → Mandarake); a slot refusal stays local
      const refusedFile = new Set([...refusedAnywhere, ...(p.t.candidates || []).filter(c => c.refused).map(c => c.file)]);
      for (let i = 0; !done; i++) {
        let c = tries[i];
        if (!c) {                                    // candidates exhausted: the articles' lead images, in order
          const art = arts.shift();
          if (!art) break;
          const f = await leadOf(art);
          if (!f) { refused.push(`${p.t.key}: ${art} has no lead image`); continue; }
          if (refusedFile.has(f)) { refused.push(`${p.t.key} ${f}: refused after review (lead image of ${art})`); continue; }
          c = { file: f, confidence: 'lead', depicts: p.t.type === 'hero' ? '' : p.t.label.replace(/\s*\([^)]*\)\s*$/, '') };
        }
        if (refusedAnywhere.has(c.file) && !(p.t.candidates || []).some(x => x.file === c.file && !x.refused)) { refused.push(`${p.t.key} ${c.file}: refused after review (for another target)`); continue; }
        const r = await inspect(p.t, c.file, c.confidence === 'lead' ? '' : c.depicts);   // a lead image has no vetted depicts
        if (r.why) { refused.push(`${p.t.key} ${c.file}: ${r.why}`); continue; }
        const st = await store(p, c, r.ok);
        if (st.why) { refused.push(`${p.t.key} ${c.file}: ${st.why}`); continue; }
        kept.push(st.ok); done = true;
      }
      if (!done && !p.cands.length && !p.lead) refused.push(`${p.t.key}: nothing to try`);
    }
    if (!o.noBackfill) await backfill720();
  } catch (e) { if (!e.budget) throw e; stopped = true; if (e.why) refused.push(e.why); }
  refused.push(...refusedNote);

  console.log(`\nKept ${kept.length}:`); kept.forEach(k => console.log(`  ok    ${k}`));
  console.log(`Refused ${refused.length}:`); refused.forEach(k => console.log(`  no    ${k}`));
  console.log(`API requests this run: ${calls}/${o.budget}; image bytes ${Math.round(imgBytes / 1024)} KB.${stopped ? ' Budget reached — run again to resume (credited targets are skipped).' : ''}`);
  console.log(`Image downloads: ${imgTries - imgFails}/${imgTries} ok.`);
  if (kept.length) console.log('Now: cd tools && npm run beta && npm test');
  if (tooManyFailures(imgTries, imgFails)) die(`${imgFails} of ${imgTries} image downloads failed (> 25 %) — something is wrong with the image host or the URLs; finished photos are kept.`, 4);
}

if (require.main === module) main().catch(e => die(e.stack || String(e), 4));
module.exports = { widthList, suspectFormat, DERIVED_W, PERFORMER, performerRefused, refusalIsGlobal, viewFrom, authorOrUploader, ARTWORK, VEHICLES, widthsFor, articlesOf, NOT_A_PHOTO, SCOPES, inScope, RESCAN_KEPT, authorOf, cleanAuthor, authorProblems, derivativeNote, SIGNAGE, CLOSEUP, subjectRefused, GLOOM, fold, namesPlace, licenceOf, snapWidths, tooManyFailures, fileBase, recordCheck, slotCheck, plan, strip };
