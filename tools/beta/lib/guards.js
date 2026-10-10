'use strict';
/**
 * guards.js — the write gate. Every generated page is checked IN MEMORY before anything touches disk;
 * one failure aborts the whole build (no partial beta/). Mirrors CLAUDE.md rule 2 ("assert on record counts
 * inside any script that edits a page") for beta: a beta page must carry exactly its live page's places.
 */
const { forbidden } = require('./forbidden');

function countAttr(html, attr) { return (html.match(new RegExp('\\s' + attr + '="', 'g')) || []).length; }

function assertCityPage(row, html, recs) {
  const live = row.counts.P + row.counts.F;
  const errs = [];
  if (recs.length !== live) errs.push(`model has ${recs.length} records, live page has ${live}`);
  const cards = (html.match(/<li class="pl[ "][^>]*\sid="p-/g) || []).length;
  if (cards !== live) errs.push(`rendered ${cards} cards, live page has ${live}`);
  const ids = new Set([...html.matchAll(/<li class="pl[ "][^>]*\sid="p-([^"]+)"/g)].map(m => m[1]));
  if (ids.size !== cards) errs.push(`duplicate place ids (${cards - ids.size})`);
  const k = { s: countAttr(html.replace(/data-k="f"/g, ''), 'data-k'), f: (html.match(/data-k="f"/g) || []).length };
  if (k.s !== row.counts.P || k.f !== row.counts.F) errs.push(`sights/food ${k.s}/${k.f} != live ${row.counts.P}/${row.counts.F}`);
  // Same places, not just the same number: the multiset of names must equal the live page's.
  const { decode } = require('./extract');
  const names = [...html.matchAll(/<h3 class="pl-n"><a [^>]*>([\s\S]*?)<\/a><\/h3>/g)].map(m => decode(m[1])).sort();
  const want = row.data.P.concat(row.data.F).map(r => r.n).sort();
  if (names.length !== want.length || names.some((n, i) => n !== want[i])) {
    const miss = want.filter(n => !names.includes(n)).slice(0, 3), extra = names.filter(n => !want.includes(n)).slice(0, 3);
    errs.push(`place names differ from live (missing ${JSON.stringify(miss)}, extra ${JSON.stringify(extra)})`);
  }
  const ld = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);
  const open = recs.filter(r => !r.closed).length;
  if (!ld) errs.push('no JSON-LD');
  else { const n = JSON.parse(ld[1]).itemListElement.length; if (n !== open) errs.push(`JSON-LD lists ${n}, expected ${open} open places`); }
  return errs;
}

function assertPage(rel, html) {
  const errs = [];
  if (/document\.write/.test(html)) errs.push('document.write present');
  const hits = forbidden(html); if (hits.length) errs.push('key-required map surface: ' + hits.join(', '));
  if (/<script[^>]+src="https?:/i.test(html)) errs.push('third-party <script src> — content must not depend on a CDN');
  if (/<link[^>]+rel="stylesheet"[^>]+href="https?:/i.test(html)) errs.push('third-party stylesheet in <head> (render-blocking)');
  return errs.map(e => rel + ': ' + e);
}

module.exports = { assertCityPage, assertPage, countAttr };
