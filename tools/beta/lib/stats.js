'use strict';
/**
 * stats.js — every count and date a beta page prints, computed from the records (M1-20). Platform-owned.
 *
 * Renderers never count for themselves and never copy a number out of live prose: they read `row.stats`
 * (one place page), `countryStats()` (a hub) or `siteStats()` (the landing). The live pages' own prose
 * carries hand-written counts that drift (Cleveland's standfirst says "143 sights and 40 places to eat"
 * while the page holds 148 + 46), so `fixProseCounts()` rewrites those phrases from the computed numbers,
 * and test-beta.js fails if any generated page prints a "<n> sights / places / to eat" that disagrees.
 *
 * Dates: `lastChecked` = max(statusChecked) over the page's records (from data/geocodes.json via the
 * model's `pv.checked`); `null` when no record has one — never a guessed date.
 */
const VERIFIED_PIN = new Set(['high', 'med']);
/** A pin is "verified" when it has coordinates and data/geocodes.json grades it high or med confidence. */
const isVerifiedPin = r => r.la != null && r.ln != null && !!(r.pv && VERIFIED_PIN.has(r.pv.pin));

const max = a => a.filter(Boolean).sort().pop() || null;

function pageStats(row, recs) {
  const page = row.data;
  const sights = recs.filter(r => r.kind === 'sight').length;
  const areaIds = (page.AREAS || []).map(a => a.id);
  const perArea = {};
  for (const id of areaIds) perArea[id] = { n: 0, sights: 0, food: 0, open: 0, closed: 0, pins: 0, lastChecked: null };
  let orphans = 0;
  for (const r of recs) {
    const a = perArea[r.a] || (orphans++, null);
    if (!a) continue;
    a.n++; a[r.kind === 'food' ? 'food' : 'sights']++; a[r.closed ? 'closed' : 'open']++;
    if (isVerifiedPin(r)) a.pins++;
    if (r.pv && r.pv.checked && (!a.lastChecked || r.pv.checked > a.lastChecked)) a.lastChecked = r.pv.checked;
  }
  const count = (ids, field) => Object.fromEntries((ids || []).map(c => [c.id, recs.filter(r => r[field].includes(c.id)).length]));
  const srcKeys = new Set(recs.flatMap(r => r.src || []));
  return {
    total: recs.length, sights, food: recs.length - sights,
    open: recs.filter(r => !r.closed).length, closed: recs.filter(r => r.closed).length,
    areas: areaIds.filter(id => perArea[id].n > 0).length, orphans,
    sources: srcKeys.size,
    pins: recs.filter(r => r.la != null && r.ln != null).length,
    verifiedPins: recs.filter(isVerifiedPin).length,
    statusChecked: recs.filter(r => r.pv && r.pv.checked).length,
    lastChecked: max(recs.map(r => r.pv && r.pv.checked)),
    perArea,
    collections: count(page.CATS, 'g'),
    cuisines: count(page.CUISINES, 'cz'),
  };
}

/** Sum of page stats over a set of registry rows (a country hub, or the whole site). */
function sumStats(rows) {
  const s = { guides: rows.length, total: 0, sights: 0, food: 0, open: 0, closed: 0, pins: 0, verifiedPins: 0, statusChecked: 0, lastChecked: null };
  for (const r of rows) {
    for (const k of ['total', 'sights', 'food', 'open', 'closed', 'pins', 'verifiedPins', 'statusChecked']) s[k] += r.stats[k];
    if (r.stats.lastChecked && (!s.lastChecked || r.stats.lastChecked > s.lastChecked)) s.lastChecked = r.stats.lastChecked;
  }
  return s;
}

/** The place pages a country hub lists: its live hub's links first, then pages filed under it that the hub
 *  doesn't link (thin Singapore towns), so every page of a live country is reachable. Same rule as the landing. */
function countryPages(reg, c) {
  const byLive = Object.fromEntries(reg.rows.map(r => [r.live, r]));
  const linked = (c.cityPages || []).map(p => byLive[p]).filter(r => r && r.kind === 'city');
  const more = reg.rows.filter(r => r.kind === 'city' && r.country === c.key && !linked.includes(r));
  return { linked, more, all: linked.concat(more) };
}

function countryStats(reg, c) { return sumStats(countryPages(reg, c).all); }

function siteStats(reg) {
  const live = reg.countries.filter(c => c.live);
  const s = sumStats(reg.rows.filter(r => r.kind === 'city'));
  s.countries = live.length;
  return s;
}

/** The engine's count phrase. test-beta.js reuses it to check every generated page. */
const PROSE_COUNT = /\b\d[\d,]*(\s+sights?\s+and\s+)\d[\d,]*(\s+places?\s+to\s+eat)/gi;
const fmt = n => Number(n).toLocaleString('en-US');

/**
 * Rewrite hand-written counts in live prose from computed numbers. Only the engine's own phrasings are
 * touched ("263 sights and 225 places to eat", "— 4 sights and 12 places to eat"); anything else is left
 * verbatim. Returns the corrected string.
 */
function fixProseCounts(text, st) {
  if (!text) return text;
  return String(text)
    .replace(PROSE_COUNT, (m, a, b) => `${fmt(st.sights)}${a}${fmt(st.food)}${b}`);
}

/** City-specific search placeholder (M1-20: no "Cleveland" on other cities). */
function searchPlaceholder(name) { return `Search ${name}: places, dishes, sources`; }

module.exports = { pageStats, sumStats, countryPages, countryStats, siteStats, fixProseCounts, searchPlaceholder, isVerifiedPin, fmt, PROSE_COUNT };
