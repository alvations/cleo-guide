'use strict';
/**
 * quoted.js — D-39 (W8 FE-B) + D-42 (QC-19 / QC-20): record prose that quotes a price, a rating, a popularity claim or
 * opening times is LABELLED, not stripped.
 *
 * The live guide's write-ups (`w`) and "Look for" lines (`k`) sometimes quote a price ("$2 pork buns") or a rating
 * ("4.7 stars"). The data stays untouched (live pipeline); the beta shows a quiet note on exactly those records:
 * "Prices, ratings and times are quoted from the source at the time of research (<date>)". Build stamps `pq` (that date) on
 * each such record in data/places/<page>.json; the Guidebook (and the place detail) render the note from `pq` alone.
 *
 * PRICE_RATING is the price / rating half of the QA honesty grep (qa/test-honesty.js HONESTY): currency + amount,
 * amount + currency word, price/priced/cheap, rating(s)/rated N, N(.n)/5 and N(.n) stars, star-score. Booking wording is
 * NOT labelled here (the note would not describe it).
 * D-42 adds POPULARITY (QC-19: review counts "3,300 reviews", a score "at 4.6", "most popular") and HOURS (QC-20: clock
 * times "6am" / "7am–2:30pm" / "11:00–14:00", "open daily", "opens / closes at", "open until", "24/7", "24 hours").
 * Erring wide is safe here: a label on a record that did not need it states a true limit; a missing one is the bug.
 */
const PRICE_RATING = /(?:[$€£¥₫₩]\s?\d|\b\d+\s?(?:usd|eur|sgd|jpy|vnd|dollars?|yen)\b|(?<![A-Z][a-z]+ )\bprices?\b|\bpriced\b|\bcheap\b|\bratings?\b|\brated \d|\b\d(?:\.\d)?\s?(?:\/\s?5|stars?)\b|\bstar[- ]score\b)/i;

const POPULARITY = /(?:\b\d[\d,.]*\s?k?\+?\s?(?:reviews?|ratings?|votes?)\b|\b(?:at|scores?|scored|averages?|averaging)\s\d\.\d\b|\bmost[- ]popular\b|\bbest[- ]?sell(?:er|ing)\b)/i;
const HOURS = /(?:\b\d{1,2}(?::\d{2})?\s?(?:am|pm|a\.m\.|p\.m\.)(?![a-z])|\b\d{1,2}[:.]\d{2}\s?[-–—]\s?\d{1,2}[:.]\d{2}\b|\bopen (?:daily|every day|late|until|till|from)\b|\bopens? (?:at|from|daily)\b|\bcloses? (?:at|early|by|on)\b|\bopen(?:ing)? hours\b|\b24\/7\b|\b24 hours\b)/i;
/** D-42: any of the three groups. */
const QUOTE = new RegExp([PRICE_RATING, POPULARITY, HOURS].map(r => r.source).join('|'), 'i');

/** True when the record's own prose (write-up or "Look for") quotes a price, a rating, popularity or opening times. */
const quotes = rec => QUOTE.test(String(rec.w || '')) || QUOTE.test(String(rec.k || ''));

/** The research date the note names: the record's pin verification date, else its status-check date, else null. */
const researched = rec => (rec.pv && (rec.pv.verified || rec.pv.checked)) || null;

module.exports = { PRICE_RATING, POPULARITY, HOURS, QUOTE, quotes, researched };
