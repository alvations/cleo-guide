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
  const names = [...html.matchAll(/<h3 class="pl-n"><a [^>]*>([\s\S]*?)<\/a><\/h3>/g)].map(m => decode(m[1].replace(/<[^>]+>/g, ''))).sort();   // FE-A W2: the title may wrap its native aside in spans
  const want = row.data.P.concat(row.data.F).map(r => r.n).sort();
  if (names.length !== want.length || names.some((n, i) => n !== want[i])) {
    const miss = want.filter(n => !names.includes(n)).slice(0, 3), extra = names.filter(n => !want.includes(n)).slice(0, 3);
    errs.push(`place names differ from live (missing ${JSON.stringify(miss)}, extra ${JSON.stringify(extra)})`);
  }
  const badHref = [...html.matchAll(/<p class="pl-s">[\s\S]*?<\/p>/g)].flatMap(m => [...m[0].matchAll(/href="([^"]*)"/g)].map(h => h[1])).filter(h => !/^https?:\/\//.test(h));
  if (badHref.length) errs.push(`"Recommended by" links that are not http(s): ${badHref.slice(0, 3).join(', ')}`);
  // FE-B D-53 (trust, CLAUDE.md): "Recommended by" never names a rating platform or the place's own site. Every chip after
  // the label must be a source whose role is 'rec' (lib/model.js sourceRole) — an unknown id fails too.
  const { sourceRole } = require('./model');
  const roleOf = {}; ((row.sources && row.sources.list) || []).forEach(s => { roleOf[s.id] = sourceRole(s);   /* recomputed, never the stamped role */ });
  const notRec = [...html.matchAll(/<p class="pl-s"[^>]*><span class="lbl">[^<]*<\/span>([\s\S]*?)<\/p>/g)]
    .flatMap(m => [...m[1].matchAll(/data-src="([^"]+)"/g)].map(x => x[1]))
    .concat([...html.matchAll(/<fieldset data-fs="src">([\s\S]*?)<\/fieldset>/g)].flatMap(m => [...m[1].matchAll(/data-v="([^"]+)"/g)].map(x => x[1])))   // the filter panel's "Recommended by" too
    .filter(id => roleOf[id] !== 'rec');
  const offName = [...html.matchAll(/<p class="pl-s"[^>]*><span class="lbl">[^<]*<\/span>([\s\S]*?)<\/p>/g)].filter(m => /\(official\b|\b(?:yelp|tripadvisor)\b/i.test(m[1].replace(/<[^>]+>/g, '')));
  if (offName.length) errs.push(`"Recommended by" text reads "(official…)" or a platform: ${offName.length} card(s)`);
  // QA-87 rule 3: no chip names the place's own site by name/domain (lib/model.js isSelf), recomputed per card
  { const { isSelf } = require('./model'), byId = {}; ((row.sources && row.sources.list) || []).forEach(s => { byId[s.id] = s; });
    const { decode } = require('./extract'), self = [];
    for (const seg of html.split(/<li class="pl[ "]/).slice(1)) {
      const nm = /<h3 class="pl-n"><a [^>]*>([\s\S]*?)<\/a><\/h3>/.exec(seg), ln = /<p class="pl-s"[^>]*><span class="lbl">[^<]*<\/span>([\s\S]*?)<\/p>/.exec(seg);
      if (nm && ln) for (const x of ln[1].matchAll(/data-src="([^"]+)"/g)) if (isSelf(byId[x[1]], decode(nm[1].replace(/<[^>]+>/g, '')))) self.push(x[1]);
    }
    if (self.length) errs.push(`"Recommended by" names the place's own site: ${[...new Set(self)].slice(0, 4).join(', ')}`); }
  // QA-87: general knowledge ("Added by the guide", ADD / FADD) is never after the label either
  const gk = [...html.matchAll(/<p class="pl-s"[^>]*><span class="lbl">[^<]*<\/span>([\s\S]*?)<\/p>/g)].filter(m => /class="added"|data-src="guide"/.test(m[1]));
  if (gk.length) errs.push(`"Recommended by" is followed by general knowledge ("Added by the guide"): ${gk.length} card(s)`);
  if (notRec.length) errs.push(`"Recommended by" names a non-recommender (rating platform, own site or unknown): ${[...new Set(notRec)].slice(0, 4).join(', ')}`);
  const ld = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);
  const open = recs.filter(r => !r.closed).length;
  if (!ld) errs.push('no JSON-LD');
  else { const n = JSON.parse(ld[1]).itemListElement.length; if (n !== open) errs.push(`JSON-LD lists ${n}, expected ${open} open places`); }
  return errs;
}

/** Hub/landing gate (M1-20, M1-22): every expected place page is carded exactly once, with its computed count. */
function assertHubPage(rel, html, expect, totals) {
  const errs = [];
  const cards = [...html.matchAll(/<li class="dest" data-page="([^"]+)"[\s\S]*?<span class="dest-c">([\d,]+) places?\b/g)].map(m => [m[1], +m[2].replace(/,/g, '')]);
  const keys = cards.map(c => c[0]);
  const missing = expect.filter(k => !keys.includes(k)), dup = keys.filter((k, i) => keys.indexOf(k) !== i);
  if (missing.length) errs.push(`hub is missing ${missing.length} page(s): ${missing.slice(0, 5).join(', ')}`);
  if (dup.length) errs.push(`hub cards a page twice: ${dup.slice(0, 5).join(', ')}`);
  const wrong = cards.filter(([k, n]) => totals[k] !== n);
  if (wrong.length) errs.push(`hub counts differ from the page: ${wrong.slice(0, 5).map(([k, n]) => `${k} ${n}≠${totals[k]}`).join(', ')}`);
  return errs.map(e => rel + ': ' + e);
}

function assertPage(rel, html) {
  const errs = [];
  if (/document\.write/.test(html)) errs.push('document.write present');
  const hits = forbidden(html); if (hits.length) errs.push('key-required map surface: ' + hits.join(', '));
  if (/<script[^>]+src="https?:/i.test(html)) errs.push('third-party <script src> — content must not depend on a CDN');
  if (/<link[^>]+rel="stylesheet"[^>]+href="https?:/i.test(html)) errs.push('third-party stylesheet in <head> (render-blocking)');
  return errs.map(e => rel + ': ' + e);
}

module.exports = { assertCityPage, assertHubPage, assertPage, countAttr };
