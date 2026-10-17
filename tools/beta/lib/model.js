'use strict';
/**
 * model.js — normalise a live page's records into the beta place model.
 *
 * The live engine ids places by array index ('s12', 'f3'), which shifts whenever a city is rebuilt, so it
 * cannot carry a share link or a saved list. Beta gives every place a STABLE id: a slug of its name with
 * the closed marker removed (a place that closes keeps its id, its links and its saves), de-duplicated
 * within the page by area and then by counter. Non-Latin names fall back to a short hash of the name.
 *
 * Nothing is invented here: every field is copied from the live record, renamed for readability. Joins
 * against data/geocodes.json only ADD provenance (status, status-check date, pin confidence; the full
 * sources stay in data/geocodes.json) when the registry
 * entry matches the place's name; a miss leaves the field absent, it never guesses.
 */

const NATIVE = /\(([^()]*[^\x00-\x7F\u00C0-\u024F\u1E00-\u1EFF\u2000-\u206F][^()]*)\)/;
/** Native-script aside of a name: "Sensō-ji (浅草寺)" → "浅草寺". Latin, incl. Vietnamese, is not "native script" here. */
const nativeOf = s => { const m = NATIVE.exec(String(s || '')); return m ? m[1].trim() : null; };

const CLOSED_RE = /\s*[—–-]+\s*CLOSED\b.*$/i;
// a source entry that is not a physical place (Cleveland's "@neorsd — not a place, but on the list"): listed, never pinned
const NOT_PLACE_RE = /\bnot a place\b/i;
const baseName = n => n.replace(CLOSED_RE, '').trim();

function fnv(s) { let h = 0x811c9dc5; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); }

function slugify(name) {
  const s = baseName(name)
    .replace(/\([^)]*[^\x00-\x7FÀ-ɏ][^)]*\)/g, '')          // drop "(東京駅)"-style native-script asides
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ').replace(/['’]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 60).replace(/-+$/, '');
  return s || 'p-' + fnv(baseName(name));
}

const ACRONYMS = new Set(['UNESCO', 'JNTO', 'NHK', 'USA', 'NYC', 'SF', 'DC', 'TV', 'BBC', 'PBS', 'KQED', 'WHYY', 'WAMU', 'WFYI', 'WTOP', 'KRON', 'KTVU', 'METI', 'ERIH', 'LVR', 'JTB', 'AAA', 'UCLA']);

/** Upper-case publisher keys ("GO TOKYO", "TIME OUT") → sentence case; acronyms, short and vowel-less words kept (UNESCO, NHK, NPR). */
function sentenceCase(k) {
  return String(k).split(/(\s+|\/)/).map(w => {
    if (!/[A-Z]/.test(w) || /[a-z]/.test(w)) return w;                 // separators, or already mixed case
    const letters = w.replace(/[^A-Z]/g, '');
    if (letters.length <= 2 || /\d/.test(w) || !/[AEIOUY]/.test(letters) || ACRONYMS.has(letters)) return w;
    return w.charAt(0) + w.slice(1).toLowerCase();
  }).join('');
}

const TIER = { 1: 'Must see', 2: 'Worth the detour', 3: 'Deep cut' };

function normalise(row) {
  const d = row.data;
  const geo = row.geoKey && row._geo ? row._geo[row.geoKey] || {} : {};
  const used = new Set();
  const recs = [];
  const take = (r, kind) => {
    let id = slugify(r.n);
    if (used.has(id)) id = id + '-' + String(r.a || '').toLowerCase();
    let k = 2; const root = id; while (used.has(id)) id = root + '-' + k++;
    used.add(id);
    const g = geo[r.n] || geo[baseName(r.n)] || null;
    const closed = !!r.closed || CLOSED_RE.test(r.n) || (g && g.status === 'closed');
    const rec = {
      id, kind, t: r.t, a: r.a, n: r.n, ad: r.ad || '',
      la: typeof r.la === 'number' ? r.la : null, ln: typeof r.ln === 'number' ? r.ln : null,
      w: r.w || '', k: r.k || '', g: r.g || [], cz: r.cz || [], s: r.s || [],
    };
    const nat = nativeOf(r.n);                                     // "Sensō-ji (浅草寺)" → cover's native line
    if (nat) rec.nat = nat;
    if (closed) rec.closed = true;
    if (r.warn) rec.warn = r.warn;
    if (NOT_PLACE_RE.test(r.n)) rec.np = true;
    if (g) {
      rec.pv = {};
      if (g.statusChecked) rec.pv.checked = g.statusChecked;
      if (g.status) rec.pv.status = g.status;
      if (g.confidence) rec.pv.pin = g.confidence;
      if (g.source) rec.pv.src = pinSource(g.source);              // pin source + date; FE-B QC-32: research notes stay in data/geocodes.json
      if (g.verified) rec.pv.verified = g.verified;
      // FE-B QC-25: statusSource is internal research text (some notes name review sites) — only its first URL ships
      // (pv.ss); the note stays build-side, non-enumerable, for the W9-2 retiring count (never serialised)
      if (closed && g.statusSource) {
        const u = statusUrl(g.statusSource); if (u) rec.pv.ss = u;
        Object.defineProperty(rec.pv, 'note', { value: String(g.statusSource), enumerable: false });
      }
    }
    recs.push(rec);
  };
  d.P.forEach(r => take(r, 'sight'));
  d.F.forEach(r => take(r, 'food'));
  return recs;
}

/** Display name of a source key in a page's registry; ADD/FADD are honest about being general knowledge. */
function sourceLabel(reg, key) {
  if (key === 'ADD' || key === 'FADD') return 'Added by the guide (general knowledge)';
  const s = reg && reg[key];
  if (!s) return key;
  // Verbatim from the live registry. Some titles are uppercase keys ("GO TOKYO", "UNESCO"); case-folding them
  // would mangle acronyms, so presentation is the stylesheet's job, not the generator's.
  // `l` is the entry's short label ("Atlas Obscura"); `t` is often an ARTICLE title, so it is not the name.
  return sentenceCase(s.l && s.l.length <= 48 ? s.l : s.k || s.t || key);
}

/**
 * Where a card's source name should link. Live refs (`s: [[key, ref]]`) are not always URLs: numbered list
 * entries ("#16"), bare domains ("nycgovparks.org/parks/…"), wiki slugs, or a prose note ("Best Latin
 * Restaurant 2025"). An http(s) ref links as is; a scheme-less domain path gets https://; anything else
 * links to the registry entry's own URL. Returns {href|null, note|null} — the note is the non-URL ref,
 * kept for a tooltip so no text is lost. Never a relative or in-page href.
 */
function sourceHref(reg, key, ref) {
  const r = String(ref || '').trim();
  const e = (reg || {})[key] || {};
  const regUrl = /^https?:\/\//i.test(e.u || '') ? e.u : null;
  if (/^https?:\/\/\S+$/i.test(r)) return { href: r, note: null };
  if (/^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:\/\S*)?$/i.test(r)) return { href: 'https://' + r, note: null };
  return { href: regUrl, note: r || null };
}

// QC-25: the first http(s) URL in a geocodes statusSource note, or '' (same rule as render/city.js statusUrl)
const statusUrl = n => ((/https?:\/\/[^\s;,'"()<>]+/.exec(String(n || '')) || [])[0] || '').replace(/[.]+$/, '');

// QC-32 (FE-B): a geocodes `source` that carries research notes (the worklist, "verify before publish", UNVERIFIED, NOTE:,
// ADDRESS CORRECTED) ships only its published-coordinate source: the first URL, else the clause naming the publisher /
// method. Sources without such notes ship unchanged. The full note stays in data/geocodes.json (build-side).
const RESEARCH = /worklist|verify before publish|\bUNVERIFIED\b|\bNOTE\b|ADDRESS CORRECTED|may be a relocation/i;
const pinSource = src => {
  const s = String(src || ''); if (!RESEARCH.test(s)) return s;
  const url = (/https?:\/\/[^\s;,'"()<>]+/.exec(s) || [])[0];
  if (url) return url.replace(/[.]+$/, '');
  const t = s.replace(/\s*\([^()]*\)/g, m => (RESEARCH.test(m) ? '' : m));
  const parts = t.split(/\s+[—–]\s+|;\s+|\.\s+(?=[A-Z])/).map(x => x.trim().replace(/[.,;:]+$/, ''))
    .map(x => (x.split('(').length > x.split(')').length ? x.slice(0, x.lastIndexOf('(')).trim() : x)).filter(x => x && !RESEARCH.test(x));   // no half-open paren
  return parts.find(x => /coord|lat\/lng|geocod|OneMap|official site|directory|Michelin/i.test(x)) || parts[0] || 'Coordinate source on file';
};

// R8 gap #2d (FE-B): a source's public name. Research parentheticals are internal ("Wikipedia (published facts/coords)",
// "(notability + published coordinates)") and are dropped; author / publisher credits ("(Mark Wiens)") stay. A place's own
// site ("Official site", "Official company/institution site") is evidence, not a recommender: `recommender` gives null.
const INTERNAL_PAREN = /\s*\((?=[^)]*(?:coord|facts|notability|verif|research))[^)]*\)/gi;
const OWN_SITE = /^official\s+(?:site|website|company|institution)\b/i;
const publicName = n => { const v = String(n || '').replace(INTERNAL_PAREN, '').trim(); return OWN_SITE.test(v) && !/^official site$/i.test(v) ? 'Official site' : v; };   // designer: fall back to "Official site"
// FE-B D-53: a recommender's chip name — a board's "(official CVB)" / "(official tourism)" tail is dropped after "Recommended by"
const recName = n => String(n || '').replace(/\s*\(official\b[^)]*\)/ig, '').trim() || String(n || '');
const recommender = n => (OWN_SITE.test(publicName(n)) ? null : recName(publicName(n)) || null);   // landing / hub "Recommended by": never a place's own site

// FE-B D-53 (trust, CLAUDE.md "Yelp/TripAdvisor are never the recommender"): who may be named after "Recommended by".
// One helper for every surface. A source's role:
//   'platform' — a rating platform that measures, never recommends (Yelp, Tripadvisor, Google Maps / reviews, Apple Maps);
//   'own'      — the place's own site in any form (official-site, *-official, "Official …", "<Name> (official)" unless that
//                name is a tourism / city / regional board, which IS an independent recommender);
//   'guide'    — ADD / FADD general knowledge (stays labelled as such, never a source);
//   'rec'      — everything else.
const PLATFORM = /\byelp\b|\btrip ?advisor\b|\bgoogle(?: maps| reviews| business)?\b(?! arts)|\bapple maps\b/i;
const BOARD = /tourism|touris|toeris|\bcvb\b|convention|visit|bureau|\bcity\b|\bstad\b|\bville\b|gemeente|municipal|county|regional|\bboard\b|state (?:tourism|government|parks?)|government/i;
const sourceRole = s => {
  const id = String((s && s.id) || ''), n = String((s && s.name) || '');
  if (id === 'guide') return 'guide';
  if (PLATFORM.test(id.replace(/-/g, ' ')) || PLATFORM.test(n)) return 'platform';
  if (id === 'official-site' || /-official$/.test(id) || OWN_SITE.test(n) || /^official\b/i.test(n) || (/\(official\b[^)]*\)/i.test(n) && !BOARD.test(n))) return 'own';
  return 'rec';
};
/** The ids a record may name after "Recommended by", authorities first (Michelin, James Beard, NPS), then the live order. */
const recommendersOf = (src, byId) => (src || []).filter(id => byId[id] && sourceRole(byId[id]) === 'rec')
  .map((id, i) => [id, byId[id].authority ? 0 : 1, i]).sort((x, y) => x[1] - y[1] || x[2] - y[2]).map(x => x[0]);

module.exports = { sourceRole, recommendersOf, recName, publicName, recommender, statusUrl, pinSource, RESEARCH, sentenceCase, sourceHref, normalise, slugify, baseName, sourceLabel, TIER, CLOSED_RE, nativeOf };
