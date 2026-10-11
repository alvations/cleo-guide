'use strict';
/**
 * quoted.js — D-39 (proposed, W8 FE-B): record prose that quotes a price or a rating is LABELLED, not stripped.
 *
 * The live guide's write-ups (`w`) and "Look for" lines (`k`) sometimes quote a price ("$2 pork buns") or a rating
 * ("4.7 stars"). The data stays untouched (live pipeline); the beta shows a quiet note on exactly those records:
 * "Prices and ratings are quoted from the source at the time of research (<date>)". Build stamps `pq` (that date) on
 * each such record in data/places/<page>.json; the Guidebook (and the place detail) render the note from `pq` alone.
 *
 * PRICE_RATING is the price / rating half of the QA honesty grep (qa/test-honesty.js HONESTY): currency + amount,
 * amount + currency word, price/priced/cheap, rating(s)/rated N, N(.n)/5 and N(.n) stars, star-score. Booking and hours
 * wording are NOT labelled here (the note would not describe them).
 */
const PRICE_RATING = /(?:[$€£¥₫₩]\s?\d|\b\d+\s?(?:usd|eur|sgd|jpy|vnd|dollars?|yen)\b|(?<![A-Z][a-z]+ )\bprices?\b|\bpriced\b|\bcheap\b|\bratings?\b|\brated \d|\b\d(?:\.\d)?\s?(?:\/\s?5|stars?)\b|\bstar[- ]score\b)/i;

/** True when the record's own prose (write-up or "Look for") quotes a price or a rating. */
const quotes = rec => PRICE_RATING.test(String(rec.w || '')) || PRICE_RATING.test(String(rec.k || ''));

/** The research date the note names: the record's pin verification date, else its status-check date, else null. */
const researched = rec => (rec.pv && (rec.pv.verified || rec.pv.checked)) || null;

module.exports = { PRICE_RATING, quotes, researched };
