'use strict';
/**
 * location-verify-scope.js — which registry rows matter for a city, read from the repo's own mappings (never a second
 * copy of them):
 *   page      names rendered on the built page(s): tools/research.js PAGE_FOR (Singapore/Vietnam: every page in those
 *             folders, since one key spans many per-place pages)
 *   dataset   names in the city's dataset (data/<city>.dataset.json, mapping from tools/geocode-status.py DATASETS):
 *             a dataset row the build leaves out for want of a verified pin is IN scope — accepting it adds a place
 *   research  names anywhere in data/<slug>-research/**.json (candidates dropped by the merit bar or editorial review)
 * Used by location-verify.js (default scope = page ∪ dataset) and its --orphans classification.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

function readMap(file, re) {
  const out = {};
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  let m; while ((m = re.exec(src))) out[m[1]] = m[2];
  return out;
}
let _page, _ds, _slug;
function pageFiles(city) {
  if (!_page) {
    _page = {};
    const src = fs.readFileSync(path.join(ROOT, 'tools', 'research.js'), 'utf8');
    const re = /'([a-z0-9-]+)':\s*path\.join\(__dirname,\s*'\.\.',\s*((?:'[^']+',?\s*)+)\)/g; let m;
    while ((m = re.exec(src))) { const parts = m[2].match(/'([^']+)'/g).map(x => x.slice(1, -1)); if (/\.html$/.test(parts[parts.length - 1])) _page[m[1]] = path.join(ROOT, ...parts); }
  }
  if (city === 'singapore') return ['Singapore', 'Vietnam'].flatMap(d => { const dir = path.join(ROOT, d); return fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => path.join(dir, f)) : []; });
  return _page[city] ? [_page[city]] : [];
}
function namesFromPage(file) {
  const h = fs.readFileSync(file, 'utf8'), out = new Set();
  for (const marker of ['const P = [', 'const F = [']) {
    const s = h.indexOf(marker); if (s < 0) continue;
    const e = h.indexOf('\n];', s); const block = h.slice(s, e < 0 ? undefined : e);
    const re = /\bn:"((?:[^"\\]|\\.)*)"/g; let m;
    while ((m = re.exec(block))) { try { out.add(JSON.parse('"' + m[1] + '"')); } catch (_) { out.add(m[1].replace(/\\"/g, '"')); } }
  }
  return out;
}
function pageNames(city) { const s = new Set(); for (const f of pageFiles(city)) if (fs.existsSync(f)) namesFromPage(f).forEach(n => s.add(n)); return s; }
function datasetFile(city) {
  if (!_ds) _ds = readMap('tools/geocode-status.py', /"([a-z0-9-]+)":\s*"(data\/[^"]+\.dataset\.json)"/g);
  return _ds[city] ? path.join(ROOT, _ds[city]) : null;
}
function datasetNames(city) {
  const f = datasetFile(city); const s = new Set();
  if (!f || !fs.existsSync(f)) return s;
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const r of (d.P || []).concat(d.F || [])) if (r && r.n) s.add(r.n);
  return s;
}
function researchDir(city) {
  if (!_slug) _slug = readMap('tools/rebuild-city.py', /"([a-z0-9-]+)":\s*\("([^"]+)",/g);
  const cands = [_slug[city], city, city.replace(/-[a-z]{2}$/, '')].filter(Boolean).map(x => path.join(ROOT, 'data', `${x}-research`));
  return cands.find(d => fs.existsSync(d)) || null;
}
function researchNames(city) {
  const dir = researchDir(city); const s = new Set(); if (!dir) return s;
  const walk = d => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); const st = fs.statSync(p);
    if (st.isDirectory()) walk(p); else if (f.endsWith('.json') && st.size < 50e6) {
      const t = fs.readFileSync(p, 'utf8'); const re = /"n"\s*:\s*"((?:[^"\\]|\\.)*)"/g; let m;
      while ((m = re.exec(t))) { try { s.add(JSON.parse('"' + m[1] + '"')); } catch (_) { /* skip */ } } } } };
  walk(dir);
  return s;
}

module.exports = { pageFiles, pageNames, datasetFile, datasetNames, researchDir, researchNames, namesFromPage };
