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
  PHR_RE.forEach(re => { s = s.replace(re, m => { guard.push(m); return '\x00' + (guard.length - 1) + '\x00'; }); });
  let first = !s.replace(/^[★ ]+/, '').startsWith('\x00');                 // a label opening with a kept phrase has had its first word
  const out = s.replace(TOK, w => { if (first) { first = false; return w; } return keep(w, own) ? w : w[0].toLowerCase() + w.slice(1); });
  return out.replace(/\x00(\d+)\x00/g, (m, i) => guard[+i]);
}

// the page's own proper nouns: every capitalised word in its city name, native name and area names
const ownWords = (...names) => new Set(names.filter(Boolean).join(' ').match(TOK) || []);

module.exports = { sentence, ownWords };
