'use strict';
/**
 * tools/beta/lib/dish.js — the word a food card's cover and kind line name (designer sign-off, food covers (c)).
 * It is the dish or cuisine: the leading phrase of the first of the place's cuisine labels that is not an award, a guide
 * or a source ("Michelin & fine dining" never yields "Michelin"; Japan's RyuGin falls through to "Kaiseki"). If no
 * cuisine qualifies, '' — the cover is glyph-only (designer: the area is never a cover word; it lives in the kind line).
 *   dishOf(['Michelin & fine dining', 'Ramen & Tsukemen']) → 'Ramen & Tsukemen'; dishOf(['Chinese, Thai, Japanese & More']) → ''
 */
const AWARD = /\b(michelin|bib\s+gourmand|james\s+beard|awards?|winners?|best\s+of|tabelog|guides?|starred|stars?|top\s*\d+|\d+\s+best|opentable|time\s+out|eater|infatuation)\b/i;
// R8 (orchestrator): the word is NEVER a fragment of a compound label — DC's "Chinese, Thai, Japanese & More" put
// "Chinese" on a Japanese ramen bar. A compound label is named in full when it fits a cover (≤ 20 characters, e.g.
// "Ramen & Tsukemen"), else no word; a single-tradition label keeps its name (a trailing "(…)" aside dropped).
const COMPOUND = /, | & | \/ | and /;
const MAX_FULL = 20;
const lead = n => { const s = String(n || '').replace(/^★\s*/, '').split(' (')[0].trim(); return COMPOUND.test(s) ? (s.length <= MAX_FULL && !s.includes(' / ') ? s : '') : s; };
function dishOf(labels, sourceNames) {
  const src = (sourceNames || []).map(s => String(s).toLowerCase()).filter(Boolean);
  for (const n of labels || []) {
    const d = lead(n); if (!d) continue;
    if (AWARD.test(d) || src.includes(d.toLowerCase())) continue;   // a source is excluded only by its exact name ("Ramen Adventures" never blocks "Ramen")
    return d;
  }
  return '';
}
module.exports = { dishOf, AWARD, COMPOUND, MAX_FULL };
