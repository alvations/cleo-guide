#!/usr/bin/env node
/**
 * Beta QA — W3 Q-04 honesty gate (design/beta/views/PLAN.md §5), wired into `npm test`. QA lane.
 *
 * Scans what a reader can see in every view, built offline (no browser):
 *   - every generated beta page's HTML (cards, chrome, method box, hubs: the Gallery/Atlas surface), and
 *   - the Guidebook and Insights views rendered from every page's JSON with the FE-B view modules.
 * Two checks, 0 hits allowed:
 *   1. no price / currency / rating / star-score / booking / reserve / availability / opening-hours wording — the one
 *      allowed line is "We don't track opening hours or prices" (it states the gap; D-42).
 *   2. no third-party travel / review / booking brand (owner rule 6). The denylist is kept as truncated SHA-256 hashes
 *      of lower-cased 1–3-word n-grams so the gate itself never names a brand. A name that is a source in our data
 *      (any page's sourceIndex name or domain) is a data-rendered attribution label and is exempt, as are place names.
 * Usage: cd tools && node beta/qa/test-honesty.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { JSDOM } = require('jsdom');
const G = require('../client/guidebook.js');
const I = require('../client/insights.js');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BETA = path.join(ROOT, 'beta');
const MAN = JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'manifest.json'), 'utf8'));
const placeFiles = fs.readdirSync(path.join(BETA, 'data', 'places')).filter(f => f.endsWith('.json')).sort();
const pages = placeFiles.map(f => JSON.parse(fs.readFileSync(path.join(BETA, 'data', 'places', f), 'utf8')));

const DENY = new Set(['bd11be25fd5f', 'd88a7a030737', 'f11ab6391c26', '41fbc48413d7', 'cc7e5884cef3', '6cbad731ff6c',
  '8c8c3f83820a', '140e1b7b47a7', '5f2ec312e33a', '3b90581b6a4c', '9e212851f7ec', 'ab3c4b84e5c3', 'bf4e1570f8a4',
  'ab7d0a36ecbe', 'a09032eb324a', '7960ba1755d9', '31df4cda6242', '9d25d4b031c6', 'a127bd859219', '04cc66d0f354',
  '8bd52b3b6b91', '9e2bce7d425e', '819c922ac29f', '3c61ca666eac', '5b0d01434bbc', '3c3eec8b57fd', 'a7be0759448f',
  '9782521a1db6', '7d27960c8c46', '8b6cce77198c', '5df185fab38e', '4f042dd1359b', '2491f1224db8', '86d2ddbd08e3',
  '3303d1688b86', '9930371f6b92']);
const hash = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 12);
const words = t => t.toLowerCase().replace(/[’]/g, "'").split(/\s+/).map(w => w.replace(/^[^a-z0-9+&]+|[^a-z0-9+&]+$/g, '')).filter(Boolean);
const grams = t => { const w = words(t), out = []; for (let i = 0; i < w.length; i++) for (let n = 1; n <= 3 && i + n <= w.length; n++) out.push(w.slice(i, i + n).join(' ')); return out; };

// exempt: every source name / domain / entry title in our data, and every place name (data, not our copy)
const EXEMPT = new Set();
const fold = s => words(String(s || '')).join(' ');
for (const d of pages) {
  for (const s of d.sourceIndex || []) { grams(s.name).forEach(g => EXEMPT.add(g)); (s.domains || []).forEach(x => grams(x).forEach(g => EXEMPT.add(g)));
    (s.entries || []).forEach(e => grams(e.title).forEach(g => EXEMPT.add(g))); }
  for (const p of d.places) grams(p.n).forEach(g => EXEMPT.add(g));
}
const NAMES = [...new Set(pages.flatMap(d => d.places.map(p => String(p.n))))].filter(n => n.length > 3).sort((a, b) => b.length - a.length);
// data is not view copy: every string in the page JSON (record prose, notes, source titles) is stripped before the gate
// runs, so the gate sees only what the views themselves write. Record prose is scanned separately and reported (INFO).
const DATA = new Set();
const collect = v => { if (typeof v === 'string') { v.split(/\n+/).forEach(x => { x = x.trim(); if (x.length > 3) DATA.add(x); }); }
  else if (v && typeof v === 'object') Object.values(v).forEach(collect); };
pages.forEach(d => { collect(d.places); collect(d.notes); collect(d.sourceIndex); collect(d.sources); collect(d.areas); collect(d.guide); });
const PROSE = [...DATA].sort((a, b) => b.length - a.length);

const HONESTY = /(?:[$€£¥₫₩]\s?\d|\b\d+\s?(?:usd|eur|sgd|jpy|vnd|dollars?|yen)\b|(?<![A-Z][a-z]+ )\bprices?\b|\bpriced\b|\bcheap\b|\bratings?\b|\brated \d|\b\d(?:\.\d)?\s?(?:\/\s?5|stars?)\b|\bstar[- ]score\b|\bbook now\b|\bbooking\b|\breserve (?:a|your|ahead|online|now)\b|\breservations?\b|\bavailability\b|\bopen(?:ing)? hours\b|\bopen now\b|\bopens? at\b|\bcloses? at\b)/i;
// stated-gap lines (they say what we do NOT show) are the allowed exceptions, and so is a closed card's status line:
// its text after "kept for the record ·" is the closure source (rule 4c), a data-rendered source label
// D-39 / D-42 (FE-B): the dated-quote label on records whose own prose quotes a price, rating or time is a stated
// limit of the data, like the gap lines above — exact sentence only.
const ALLOWED = /Closed — kept for the record · .*|We don['’]t track opening hours or prices|No ratings, prices or (?:opening )?hours are shown|We don['’]t add ratings, prices or opening hours of our own|review-aggregator star ratings never count as the recommender|Prices, ratings and times are quoted from the source at the time of research \((?:\d{4}-\d{2}-\d{2}|undated)\)\./gi;

let failures = 0;
const hits = { honesty: [], brand: [], prose: [] };
// scan text node by node: a node whose text is a data string (exactly, or with punctuation around it) is data, not view
// copy; place names and stated-gap lines are cut out of what is left
const trimP = t => t.replace(/^[\s"“(·—–,:;.]+|[\s"”)·—–,:;.]+$/g, '');
const isData = t => { for (let i = 0; i < 3; i++) { if (DATA.has(t) || DATA.has(trimP(t))) return true;   // "Look for: Order: <data>"
  const u = t.replace(/^[A-Z][A-Za-z ]{0,18}:\s*/, ''); if (u === t) return false; t = u; } return false; };
function scan(where, texts) {
  for (const raw of texts) {
    const t0 = raw.replace(/\s+/g, ' ').trim(); if (!t0 || isData(t0)) continue;
    let t = t0.replace(ALLOWED, ' ');
    for (const n of NAMES) if (t.length >= n.length && t.includes(n)) t = t.split(n).join(' ');
    const m = t.match(HONESTY);
    if (m) hits.honesty.push(where + ': "' + t.slice(Math.max(0, m.index - 50), m.index + 40) + '"');
    for (const g of grams(t)) if (!EXEMPT.has(g) && DENY.has(hash(g))) hits.brand.push(where + ': brand n-gram #' + hash(g));
  }
}
const textNodes = (root, out) => { const w = root.ownerDocument.createTreeWalker(root, 4); let n; while ((n = w.nextNode())) out.push(n.nodeValue); return out; };
const visibleText = doc => {
  doc.querySelectorAll('script, style, noscript, svg title').forEach(n => n.remove());
  const out = doc.body ? textNodes(doc.body, []) : [];
  doc.querySelectorAll('template').forEach(t => { t.content.querySelectorAll('script, style').forEach(n => n.remove()); textNodes(t.content, out); });
  doc.querySelectorAll('[aria-label], [title], [alt]').forEach(n => ['aria-label', 'title', 'alt'].forEach(a => n.getAttribute(a) && out.push(n.getAttribute(a))));
  return out;
};

console.log('QA W3 Q-04 — honesty greps on every view');
// how-we-choose.html is the method page: it exists to say we show no ratings or prices, so it is not a view surface
const html = (MAN.generated || []).filter(rel => rel !== 'how-we-choose.html' && fs.existsSync(path.join(BETA, rel)));
for (const rel of html) {
  const doc = new JSDOM(fs.readFileSync(path.join(BETA, rel), 'utf8')).window.document;
  scan(rel, visibleText(doc));
}
for (const d of pages) {
  for (const p of d.places) { const w = String(p.w || ''); const m = w.match(HONESTY);
    const b = grams(w).filter(g => !EXEMPT.has(g) && DENY.has(hash(g)));
    if (m || b.length) hits.prose.push(d.beta + ' ' + p.id + (m ? ' "' + m[0] + '"' : '') + (b.length ? ' brand #' + hash(b[0]) : '')); }
  for (const [view, mod] of [['guidebook', G], ['insights', I]]) {
    const doc = new JSDOM('<body>' + mod.render(d).html + '</body>').window.document;
    scan(d.beta + '#view=' + view, visibleText(doc));
  }
}
const report = (name, list) => {
  const ok = !list.length; if (!ok) failures++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}: ${list.length} hits` + (ok ? '' : '\n    ' + [...new Set(list)].slice(0, 15).join('\n    ')));
};
console.log(`  scanned ${html.length} pages + ${pages.length} × guidebook/insights renders`);
report('no price / rating / booking / hours wording (outside the stated-gap line)', hits.honesty);
report('no third-party brand outside data-rendered source labels', hits.brand);
// INFO (not gated): record prose carried over from the live guide that a view shows verbatim. Filed to the PM in BETA-QA.
console.log(`  INFO  record prose with price/rating/booking wording or a brand: ${hits.prose.length} places` +
  (hits.prose.length ? '\n    ' + hits.prose.slice(0, 8).join('\n    ') + (hits.prose.length > 8 ? '\n    …' : '') : ''));
if (failures) { console.log(`\n${failures} FAIL`); process.exit(1); }
console.log('\nhonesty: all PASS');
