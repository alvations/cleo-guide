'use strict';
/**
 * tools/beta/lib/dish.js — the word a food card's cover and kind line name (designer sign-off, food covers (c)).
 * It is the dish or cuisine: the leading phrase of the first of the place's cuisine labels that is not an award, a guide
 * or a source ("Michelin & fine dining" never yields "Michelin"; Japan's RyuGin falls through to "Kaiseki"). If no
 * cuisine qualifies, '' — the cover is glyph-only (designer: the area is never a cover word; it lives in the kind line).
 *   dishOf(['Michelin & fine dining', 'Kaiseki, kyō-ryōri & ryōtei']) → 'Kaiseki'
 */
const AWARD = /\b(michelin|bib\s+gourmand|james\s+beard|awards?|winners?|best\s+of|tabelog|guides?|starred|stars?|top\s*\d+|\d+\s+best|opentable|time\s+out|eater|infatuation)\b/i;
const lead = n => String(n || '').replace(/^★\s*/, '').split(/ & |, | \(|\s+\/\s+/)[0].trim();
function dishOf(labels, sourceNames) {
  const src = (sourceNames || []).map(s => String(s).toLowerCase()).filter(Boolean);
  for (const n of labels || []) {
    const d = lead(n); if (!d) continue;
    if (AWARD.test(d) || src.includes(d.toLowerCase())) continue;   // a source is excluded only by its exact name ("Ramen Adventures" never blocks "Ramen")
    return d;
  }
  return '';
}
module.exports = { dishOf, AWARD };
