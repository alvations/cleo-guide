'use strict';
/**
 * tools/beta/lib/casing.js — the v2 casing rule (design/beta/DESIGN-SYSTEM.md §v2.6), the shared display-time helper.
 * A port of the designer's executable spec design/beta/casing/sentence_case.py; test-casing.js holds the two in step
 * (every label in beta/data/places/*.json must case identically in both).
 *
 *   sentence('Iconic & Must-See') → 'Iconic & must-see'      sentence('UNESCO World Heritage') → 'UNESCO World Heritage'
 *
 * Keep the label's first letter; keep allowlisted phrases and words (design/beta/casing/allowlist.json — proper nouns go
 * there, never in code); keep ALL-CAPS words (BBQ, TV, U-pick's "U") and words with an internal capital (MiMo,
 * YouTube); lowercase every other word's first letter. Hyphenated words are cased per segment. Data is never edited, and
 * source names are never passed through this (publishers' own casing).
 */
const fs = require('fs');
const path = require('path');

const A = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../design/beta/casing/allowlist.json'), 'utf8'));
const PHR = A.phrases.slice().sort((x, y) => y.length - x.length), WORDS = new Set(A.words);
// Python's TOK: [A-Za-zÀ-ɏḀ-ỿ][\wÀ-ɏḀ-ỿ'’]*  (\w in Python 3 str patterns is Unicode-aware: letters, digits, underscore)
const TOK = /[A-Za-zÀ-ɏḀ-ỿ][\p{L}\p{N}_À-ɏḀ-ỿ'’]*/gu;
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PHR_RE = PHR.map(p => new RegExp('(?<![\\p{L}\\p{N}_])' + esc(p) + '(?![\\p{L}\\p{N}_])', 'gu'));
const isUpper = w => /\p{Lu}/u.test(w) && w === w.toUpperCase();           // Python str.isupper(): has a cased char, none lower
const keep = (w, own) => WORDS.has(w) || own.has(w) || isUpper(w) || /\p{Lu}/u.test(w.slice(1));
const EMPTY = new Set();

// `extra`: the page's own place names (city, native name, areas), kept like allowlisted words ("Only in Cleveland")
function sentence(s, extra) {
  if (!s) return s;
  const own = extra || EMPTY;
  const guard = [];
  const ownRe = (own.phrases || []).map(p => new RegExp('(?<![\\p{L}\\p{N}_])' + esc(p) + '(?![\\p{L}\\p{N}_])', 'gu'));
  PHR_RE.concat(ownRe).forEach(re => { s = s.replace(re, m => { guard.push(m); return '\x00' + (guard.length - 1) + '\x00'; }); });
  let first = !s.replace(/^[★ ]+/, '').startsWith('\x00');                 // a label opening with a kept phrase has had its first word
  const out = s.replace(TOK, w => { if (first) { first = false; return w; } return keep(w, own) ? w : w[0].toLowerCase() + w.slice(1); });
  return out.replace(/\x00(\d+)\x00/g, (m, i) => guard[+i]);
}

// QC-30: generic geography words (allowlist.json "generic"). In a page's own place names they are part of a name ("Lincoln Park", "Ohio Valley",
// "Omoide Yokochō"), so they keep their capital only inside that whole name, never on their own ("Theme-park rides",
// "Lakefront, river & water", "Izakaya, yakitori & yokochō").
const GENERIC = new Set(A.generic || []);   // allowlist.json "generic" (designer's list, lower case)
// the page's own proper nouns, from its city name, native name and area names: each whole name, and each run of
// capitalised words in it, is kept as a phrase ("South Dade", "Ohio City"), and each of its words that is not a generic geography word is kept alone too
// ("Havana", "SoDo"). Returned as a Set of words carrying .phrases.
const ownWords = (...names) => {
  const words = new Set(), phrases = new Set();
  for (const n of names.filter(Boolean)) {
    // the whole name as written, and without its parenthetical ("A day in District 1", "A day in The Loop & Downtown")
    [String(n), String(n).replace(/\s*\(.*$/, '').trim()].forEach(x => { if (/\S\s+\S/.test(x)) phrases.add(x); });
    // a run: capitalised tokens joined only by spaces (any other separator, or a lower-case word, ends it)
    for (const m of String(n).matchAll(/(?:[\p{Lu}][\p{L}\p{N}'’.-]*)(?: [\p{Lu}][\p{L}\p{N}'’.-]*)*/gu)) {
      const run = m[0].replace(/[.]+$/, ''), toks = run.match(TOK) || [];
      if (toks.length > 1) phrases.add(run);
      toks.forEach(w => { if (!GENERIC.has(w.toLowerCase())) words.add(w); });
    }
  }
  words.phrases = [...phrases].sort((x, y) => y.length - x.length);
  return words;
};

module.exports = { sentence, ownWords };
