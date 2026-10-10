'use strict';
/**
 * sources.js — attribution as navigation (M1-10). Platform-owned.
 *
 * The live engine keeps one registry entry per ARTICLE (S / FS: `{k: publisher, t: title, u: url, l: label}`),
 * so Cleveland has 20 sight entries but "Atlas Obscura" is spread over several of them. A visitor follows a
 * PUBLISHER ("everything Atlas Obscura recommends here"), so this module groups a page's entries by publisher
 * `k` into one source per page, with a stable id, and gives every record the ids of the sources that cite it
 * (`rec.src`). Nothing is invented: names, titles and URLs are the live registry's own; counts are computed.
 *
 *   id        slug of the publisher key ("news-5", "atlas-obscura"); ADD/FADD → "guide"
 *   name      display name: the shortest live label `l` for that publisher on this page, else the key in
 *             sentence case (acronyms kept); ADD/FADD → "Added by the guide (general knowledge)"
 *   n         records citing it (each record counted once) — the source view's "(n)"
 *   sights / food, ids[] (place ids, page order), entries[] ({key, title, url, refs}), domains[]
 *   numbered  for numbered lists (Cleveland's News 5 "#1…#100"): the number of distinct "#n" entries cited —
 *             the validator's invariant (News 5 = 100, There She Goes = 23), shown beside n
 *   authority 'Michelin' | 'James Beard' | 'National Park Service' | null — a TEXT mark, never a logo
 */
const { slugify } = require('./model');

const GUIDE = 'guide';
const GUIDE_NAME = 'Added by the guide (general knowledge)';
const ACRONYMS = new Set(['UNESCO', 'JNTO', 'NHK', 'USA', 'NYC', 'SF', 'DC', 'TV', 'BBC', 'PBS', 'KQED', 'WHYY', 'WAMU', 'WFYI', 'WTOP', 'KRON', 'KTVU', 'METI', 'ERIH', 'LVR', 'JTB', 'AAA', 'UCLA']);

function sentenceCase(k) {
  return String(k).split(/(\s+|\/)/).map(w => {
    if (!/[A-Z]/.test(w) || /[a-z]/.test(w)) return w;                 // separators, or already mixed case
    const letters = w.replace(/[^A-Z]/g, '');
    if (letters.length <= 2 || /\d/.test(w) || !/[AEIOUY]/.test(letters) || ACRONYMS.has(letters)) return w;
    return w.charAt(0) + w.slice(1).toLowerCase();
  }).join('');
}

function authorityOf(k) {
  const s = String(k).toUpperCase();
  if (/MICHELIN/.test(s)) return 'Michelin';
  if (/JAMES\s*BEARD|^JBF$/.test(s)) return 'James Beard';
  if (/NATIONAL PARK|^NPS\b/.test(s)) return 'National Park Service';
  return null;
}

const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return null; } };

/**
 * Group the page's registry entries by publisher and stamp `rec.src` on every record (mutates recs).
 * Returns { list: [source…] in descending n, then name; byId: {id: source} }.
 */
function pageSources(row, recs) {
  const page = row.data;
  const groups = new Map();
  const groupOf = (reg, key) => {
    if (key === 'ADD' || key === 'FADD') return { id: GUIDE, k: 'ADDED', e: null };
    const e = (reg || {})[key];
    const k = e && e.k ? e.k : key;
    return { id: k === 'ADDED' ? GUIDE : slugify(k) || 'src-' + slugify(key), k, e };
  };
  for (const r of recs) {
    const reg = r.kind === 'food' ? page.FS : page.S;
    const ids = [];
    for (const [key, ref] of r.s) {
      const g = groupOf(reg, key);
      if (!groups.has(g.id)) groups.set(g.id, { id: g.id, k: g.k, labels: new Set(), ids: [], sights: 0, food: 0, entries: new Map(), nums: new Set() });
      const G = groups.get(g.id);
      if (g.e && g.e.l) G.labels.add(g.e.l);
      const ek = (r.kind === 'food' ? 'f:' : 's:') + key;
      if (!G.entries.has(ek)) G.entries.set(ek, { key, title: g.e ? g.e.t || '' : '', url: g.e ? g.e.u || '' : '', refs: 0 });
      G.entries.get(ek).refs++;
      if (/^#\d+$/.test(String(ref || ''))) G.nums.add(ek + ref);
      if (!ids.includes(g.id)) {
        ids.push(g.id); G.ids.push(r.id); G[r.kind === 'food' ? 'food' : 'sights']++;
      }
    }
    r.src = ids;
  }
  const list = [...groups.values()].map(G => {
    const labels = [...G.labels].filter(l => l.length <= 48).sort((a, b) => a.length - b.length || (a < b ? -1 : 1));
    const name = G.id === GUIDE ? GUIDE_NAME : labels[0] || sentenceCase(G.k);
    const entries = [...G.entries.values()];
    const domains = [...new Set(entries.map(e => host(e.url)).filter(Boolean))].sort();
    return {
      id: G.id, name, k: G.k, n: G.ids.length, sights: G.sights, food: G.food,
      numbered: G.nums.size || null, authority: G.id === GUIDE ? null : authorityOf(G.k),
      domains, entries, ids: G.ids,
    };
  }).sort((a, b) => b.n - a.n || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  return { list, byId: Object.fromEntries(list.map(s => [s.id, s])) };
}

/** Site-wide source index: one row per publisher name across every place page (for a future source hub). */
function siteSources(rows) {
  const by = new Map();
  for (const r of rows) for (const s of r.sources.list) {
    const id = s.id;
    if (!by.has(id)) by.set(id, { id, name: s.name, authority: s.authority, n: 0, pages: [] });
    const G = by.get(id);
    G.n += s.n; G.pages.push([r.key, s.n]);
    if (s.name.length < G.name.length && id !== GUIDE) G.name = s.name;
  }
  return [...by.values()].sort((a, b) => b.n - a.n || (a.id < b.id ? -1 : 1));
}

module.exports = { pageSources, siteSources, sentenceCase, authorityOf, GUIDE, GUIDE_NAME };
