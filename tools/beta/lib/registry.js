'use strict';
/**
 * registry.js — the inventory of every LIVE page and its BETA source + generator.
 *
 * One row per live page (~90). `gen` says who writes the beta copy today:
 *   'new'    — the new beta generator (tools/beta/build.js) owns beta/<path>; beta-restyle.py skips it.
 *   'mirror' — still the legacy re-skin (tools/beta-restyle.py) until its lane migrates it.
 *   'none'   — not mirrored in beta (yet).
 * Migrating a page = adding its path to tools/beta/pages.json (plus a renderer for its kind). Nothing else.
 *
 * Read-only over the live tree: index.html, cleveland.html, cities/, Singapore/, Vietnam/, the country hubs
 * and data/countries.json. Never writes there.
 */
const fs = require('fs');
const path = require('path');
const { extractPage } = require('./extract');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const rd = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = rel => fs.existsSync(path.join(ROOT, rel));

// Pages the new generator owns, from tools/beta/pages.json (FE lanes grow it wave by wave).
const NEW_PAGES = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'pages.json'), 'utf8')).new);

/** Stable key for a page: 'tokyo', 'cleveland', 'singapore/toa-payoh', 'vietnam/hanoi'. */
function pageKey(rel) {
  const s = rel.replace(/\.html$/, '').toLowerCase();
  return s.startsWith('cities/') ? s.slice(7) : s;
}
const fileKey = key => key.replace(/\//g, '--');

function liveRelPaths() {
  const out = ['index.html', 'cleveland.html'];
  for (const d of ['Japan', 'Germany', 'Belgium']) if (exists(d + '/index.html')) out.push(d + '/index.html');
  for (const d of ['cities', 'Singapore', 'Vietnam']) {
    if (!exists(d)) continue;
    for (const f of fs.readdirSync(path.join(ROOT, d)).sort()) if (f.endsWith('.html')) out.push(d + '/' + f);
  }
  return out;
}

/** geocodes.json city key for a page, for provenance joins (status date, pin source). */
function geoKeyFor(rel, geoKeys) {
  if (/^(Singapore|Vietnam)\//.test(rel)) return geoKeys.includes('singapore') ? 'singapore' : null;
  const stem = pageKey(rel).replace(/\//g, '');
  const norm = k => k.replace(/-/g, '');
  const strip = k => k.replace(/-[a-z]{2}$/, '').replace(/-/g, '');
  return geoKeys.find(k => norm(k) === stem) || geoKeys.find(k => strip(k) === stem) || null;
}

/** Country membership, read from the live hubs + data/countries.json (the live site's own nav). */
function countryIndex() {
  const C = JSON.parse(rd('data/countries.json')).countries;
  const byPage = {};
  const hrefs = (html, cls) => [...html.matchAll(new RegExp('<a class="' + cls + '"[^>]*href="([^"]+)"', 'g'))].map(m => m[1]);
  for (const c of C) {
    let pages = [];
    if (c.kind === 'us') pages = hrefs(rd('index.html'), 'cardmain');
    else if (c.kind === 'dataset-cities') pages = c.pages || [];
    else if (c.kind === 'engine' && c.live && c.hub && exists(c.hub)) {
      const dir = path.posix.dirname(c.hub);
      pages = [...rd(c.hub).matchAll(/href="([^"#]+\.html)"/g)].map(m => path.posix.normalize(dir + '/' + m[1]))
        .filter(p => p.startsWith(dir + '/') && p !== c.hub && exists(p));
    }
    pages = [...new Set(pages.map(p => path.posix.normalize(p)))].filter(p => exists(p));
    c.cityPages = pages;
    for (const p of pages) if (!byPage[p]) byPage[p] = c.key;
  }
  return { countries: C, byPage };
}

/** Build the full registry: one row per live page, with extracted data for place pages. */
function buildRegistry({ withData = true } = {}) {
  const geo = JSON.parse(rd('data/geocodes.json')).cities;
  const geoKeys = Object.keys(geo);
  const { countries, byPage } = countryIndex();
  const betaHas = rel => exists('beta/' + rel);
  const rows = liveRelPaths().map(rel => {
    const html = rd(rel);
    const data = withData ? extractPage(html) : null;
    const isHub = !/const\s+P\s*=\s*\[/.test(html);
    const kind = rel === 'index.html' ? 'landing'
      : rel === 'Singapore/singapore-old.html' ? 'archive-hub'
      : isHub ? 'country-hub' : 'city';
    const gen = NEW_PAGES.has(rel) ? 'new' : betaHas(rel) ? 'mirror' : 'none';
    return {
      live: rel, beta: rel, key: pageKey(rel), fileKey: fileKey(pageKey(rel)), kind, gen,
      country: byPage[rel] || (kind === 'country-hub' ? (countries.find(c => c.hub === rel) || {}).key || null : null)
        // SEA pages not linked from a live hub (reachable from the archive) — file them by the region their H1 names.
        || (data && data.meta.h1 ? (countries.find(c => c.region && data.meta.h1.includes(c.region)) || {}).key || null : null),
      geoKey: kind === 'city' ? geoKeyFor(rel, geoKeys) : null,
      data, counts: data ? { P: data.P.length, F: data.F.length } : null,
    };
  });
  return { rows, countries, geo };
}

module.exports = { buildRegistry, NEW_PAGES, pageKey, fileKey, ROOT };
