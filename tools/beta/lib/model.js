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
    if (g) {
      rec.pv = {};
      if (g.statusChecked) rec.pv.checked = g.statusChecked;
      if (g.status) rec.pv.status = g.status;
      if (g.confidence) rec.pv.pin = g.confidence;
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
  return s.l && s.l.length <= 48 ? s.l : s.k || s.t || key;
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

module.exports = { sourceHref, normalise, slugify, baseName, sourceLabel, TIER, CLOSED_RE, nativeOf };
