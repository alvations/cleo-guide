'use strict';
/**
 * recognition.js — W9-1 (recognition layer, data half) and W9-9 (local favourites, data half). Platform-owned.
 * Data shape for FE-A (cards, detail, tray filter) and FE-B (Insights chart): design/beta/RECOGNITION.md.
 *
 * EVERYTHING here is derived from SOURCE KEYS ONLY — never from a place's name, dish or prose:
 *   1. Each page publisher (lib/sources.js group: its key `k`, its entries' registry keys, its domains / entry URLs) is
 *      typed by the FIRST of these that answers, and `typedFrom` says which (W9-9 acc1, platform 2026-10-16):
 *        city            — the page's own registry city has an entry with the publisher key or one of its entry keys;
 *        registry        — registry-wide on those keys, when every matching entry agrees on the raw type, or on the
 *                          GROUP (the raw type of the first entry is kept; `reg` names it);
 *        registry-host   — a registry entry whose URL host is one of the publisher's hosts (same agreement rule);
 *        registry-domain — the same on the registrable domain (en.wikipedia.org ~ wikipedia.org);
 *        guide-key       — every entry key is the guide's own "OFFICIAL…" key ("Official site of the place") → official;
 *        host-pattern    — one of HOST_RULES below matches a host (encyclopaedia, government, tourism board, UNESCO).
 *      Otherwise it is UNTYPED: never guessed, and listed with its key and hosts in data/recognition-untyped.json.
 *   2. The raw type maps to one GROUP by the ordered rule list GROUP_RULES below (first match wins; a test proves
 *      every distinct type string in the registry maps). Groups: official · press · local (local press or writer) ·
 *      creator (vetted creator) · institution (institution or award) · encyclopaedia · other.
 *   3. Badges per place (W9-1): award — cites a source whose registry type is an institutional award (AWARD_TYPE) or
 *      whose publisher key is Michelin / James Beard (lib/sources.js authority mark); video — cites a vetted creator
 *      whose registry entry is a video channel (a youtube field, or a YouTube/TikTok/Vimeo url); cited — n distinct
 *      publishers when n ≥ 3 (the guide's own "Added by the guide" never counts). Each badge lists its source ids,
 *      so the UI links it to `#src=<id>`.
 *   4. Local favourites (W9-9): an OPEN place whose sources are ALL typed and ALL local press/writers or vetted
 *      creators (none official, none untyped). A page with fewer than LF_MIN such places gets a stated gap instead.
 */
const fs = require('fs');
const path = require('path');

const GROUPS = ['official', 'press', 'local', 'creator', 'institution', 'encyclopaedia', 'other'];
// Ordered: the first rule whose pattern matches the registry's raw `type` string wins. Patterns read the TYPE only.
const GROUP_RULES = [
  ['institution', /award|michelin|james_beard|accreditation/i],
  ['encyclopaedia', /encyclop|^(general )?reference|reference-portal|editorial\/reference|heritage-reference|architecture reference/i],
  ['creator', /creator|travel_blog|^blog$|food-blog|regional-blog|guidebook author|travel writer|^critic$|food critic/i],
  ['official', /official|municipal|tourism|tourist board|^cvb$|local_cvb|^dmo$|^gov$|state agency|state-agency|state government|county government|park district|official_parks|metroparks|port authority|parish|business official|restaurant|brewery|bakery|patisserie|venue primary source|university \(official\)|university_page|wine cooperative|manufacturer\/visitor|city-portal|county_tourism|state_tourism|state-travel|travel-authority/i],
  ['local', /local|alt[-_ ]?weekly|alt_media|city[-_ ]?mag|city magazine|city-media|city_media|community-media|nonprofit[-_ ]local[-_ ]news|nonprofit[- ]newsroom|nonprofit_local|regional (news|newspaper|daily|city|lifestyle|online|arts|culture|media)|regional-(news|press|magazine)|regional_business_news|county daily|tv_numbered_list|tv[-_ ]news|^tv$|local-tv|state-news|state magazine|student newspaper|independent city guide/i],
  ['press', /trade[-_ ]?(media|publication|press)|industry press|industry association\/press|professional press|wine-trade-press/i],
  ['institution', /institution|museum|heritage|historical|history|unesco|foundation|nonprofit|association|academic|archive|professional body|trade|preservation|conservation|naturalist|registry|research|state cultural|cross-border|chefs|merchants|industry|pastry authority|wine authority|wine-authority|regional-product|state_history|national_archive|national museum/i],
  ['press', /editorial|magazine|media|press|news|newspaper|daily|paper|national|international|travel|guide|food|lifestyle|digital|listicle|broadcaster|public[-_ ]?(media|radio|tv)|radio|podcast|wire|weekly|curated|oddit|atlas_obscura|roadside|outdoors|beer|wine|specialty|architecture|cultural media|arts-editorial|hospitality|restaurant-guide|gastronomic|screen_location|theme-park|bar\/beer|journalism/i],
];
// Host patterns (W9-9 acc1): explicit, each a property of the HOST, never of a name. [group, label, pattern]
const HOST_RULES = [
  ['encyclopaedia', 'encyclopaedia host', /(^|\.)(wikipedia\.org|britannica\.com)$/],
  ['official', 'government host', /(^|\.)(gov|gouv|govt)(\.[a-z]{2})?$|\.gov\.[a-z]{2}$/],
  ['official', 'tourism-board host', /touris(m|me|mus|mo)|turismo/],
  ['institution', 'UNESCO host', /(^|\.)unesco\.(org|de|fr)$/],
];
const GUIDE_OWN = new Set(['REQ']);   // the guide's own non-publisher entry keys, never typed by host
const AWARD_TYPE = /award|michelin|james_beard/i;
const VIDEO_URL = /youtube\.com|youtu\.be|tiktok\.com|vimeo\.com/i;
const LF_GROUPS = new Set(['local', 'creator']);
const LF_MIN = 5;
const LF_RULE = 'Open places recommended only by local press, local writers or vetted creators — none by an official or tourism source, and every source typed in our registry.';

const groupOf = t => { if (!t) return null; for (const [g, re] of GROUP_RULES) if (re.test(t)) return g; return 'other'; };
const norm = k => String(k || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const hostOf = u => { const m = /^[a-z]+:\/\/([^/:?#]+)/i.exec(String(u || '')); return m ? m[1].toLowerCase().replace(/^www\./, '') : ''; };
const baseOf = h => { const p = h.split('.'); return p.slice(/\.(co|com|gov|org|net|ac|edu)\.[a-z]{2}$/.test(h) ? -3 : -2).join('.'); };

let REG = null;
function registry(root) {
  if (REG) return REG;
  const d = JSON.parse(fs.readFileSync(path.join(root, 'data', 'sources.json'), 'utf8'));
  const byCity = {}, global = {}, byHost = {}, byBase = {};
  for (const [c, cv] of Object.entries(d.cities || {})) {
    byCity[c] = new Map();
    for (const s of cv.sources || []) {
      const e = { key: s.key, type: s.type || null, url: s.url || '', youtube: s.youtube || '', city: c };
      byCity[c].set(norm(s.key), e);
      (global[norm(s.key)] = global[norm(s.key)] || []).push(e);
      const h = hostOf(s.url); if (h) { (byHost[h] = byHost[h] || []).push(e); (byBase[baseOf(h)] = byBase[baseOf(h)] || []).push(e); }
    }
  }
  REG = { byCity, global, byHost, byBase, cityKeys: Object.keys(byCity), types: [...new Set(Object.values(global).flat().map(e => e.type).filter(Boolean))] };
  return REG;
}

/** The registry city (or cities) a beta page reads its types from: same key, same last segment, `<seg>-<state>`, or
 *  the Singapore registry for every page under singapore/. */
function regCities(R, row) {
  const b = String(row.key).split('/').pop();
  return R.cityKeys.filter(c => c === row.key || c === b || c.startsWith(b + '-') || (/^singapore\//.test(row.key) && c === 'singapore'));
}

/** Registry entries that agree: one raw type, or (all typed) one group. Returns the entry to cite, or null. */
const agree = all => { if (!all || !all.length || all.some(e => !e.type)) return null;
  return new Set(all.map(e => e.type)).size === 1 || new Set(all.map(e => groupOf(e.type))).size === 1 ? all[0] : null; };
/** The publisher's hosts: its domains and its entries' URL hosts. */
const hostsOf = s => [...new Set((s.domains || []).map(h => String(h).toLowerCase().replace(/^www\./, '')).concat((s.entries || []).map(e => hostOf(e.url))).filter(Boolean))];
/** Type one publisher (see 1. above): { type, group, from, award, video, regKey } */
function typeOf(R, cities, s) {
  const keys = [...new Set([s.k].concat((s.entries || []).map(e => e.key)).map(norm).filter(Boolean))];
  for (const c of cities) for (const n of keys) { const e = R.byCity[c].get(n); if (e && e.type) return withFlags(e, 'city'); }
  for (const n of keys) { const e = agree(R.global[n]); if (e) return withFlags(e, 'registry'); }
  // the guide's own request entries ("Asked for by name", key REQ) link to whatever article prompted them: they are not that
  // host's recommendation, so no host route types them (they stay untyped, listed)
  if ((s.entries || []).length && s.entries.every(e => GUIDE_OWN.has(norm(e.key)))) return { type: null, group: null, from: null, award: false, video: false, regKey: null, hosts: hostsOf(s) };
  const hs = hostsOf(s);
  for (const h of hs) { const e = agree(R.byHost[h]); if (e) return withFlags(e, 'registry-host'); }
  for (const h of hs) { const e = agree(R.byBase[baseOf(h)]); if (e) return withFlags(e, 'registry-domain'); }
  if ((s.entries || []).length && s.entries.every(e => /^OFFICIAL/.test(norm(e.key))))
    return { type: 'official site of the place', group: 'official', from: 'guide-key', award: false, video: false, regKey: null };
  for (const [g, label, re] of HOST_RULES) if (hs.some(h => re.test(h)))
    return { type: label, group: g, from: 'host-pattern', award: false, video: false, regKey: null };
  return { type: null, group: null, from: null, award: false, video: false, regKey: null, hosts: hs };
}
function withFlags(e, from) {
  const group = groupOf(e.type);
  return { type: e.type, group, from, regKey: e.key + ' (' + e.city + ')', award: AWARD_TYPE.test(e.type || ''),
    video: group === 'creator' && (!!e.youtube || VIDEO_URL.test(e.url || '')) };
}

/**
 * Stamp the recognition data on a page (mutates the sources list and the records). Call after lib/sources.js
 * pageSources(). Returns the page block for data/places/<page>.json.
 */
function pageRecognition(row, recs, srcList, root) {
  const R = registry(root), cities = regCities(R, row);
  const byId = {}, untyped = [];
  for (const s of srcList) {
    if (s.id === 'guide') { Object.assign(s, { type: null, group: null, typedFrom: null, reg: null, award: false, video: false }); byId[s.id] = s; continue; }
    const t = typeOf(R, cities, s);
    // a publisher key the platform already marks as Michelin / James Beard (lib/sources.js authority) is an award source
    const award = t.award || s.authority === 'Michelin' || s.authority === 'James Beard';
    Object.assign(s, { type: t.type, group: t.group || (award ? 'institution' : null), typedFrom: t.from || (award ? 'key' : null), reg: t.regKey, award, video: t.video });
    if (!s.group) untyped.push({ k: s.k, name: s.name, hosts: t.hosts || [], places: (s.ids || []).length });
    byId[s.id] = s;
  }
  let lf = 0; const byArea = {};
  for (const r of recs) {
    const ids = (r.src || []).filter(id => id !== 'guide');
    const award = ids.filter(id => byId[id] && byId[id].award), video = ids.filter(id => byId[id] && byId[id].video);
    const rec = {};
    if (award.length) rec.award = award;
    if (video.length) rec.video = video;
    if (ids.length >= 3) rec.cited = ids.length;
    if (Object.keys(rec).length) r.rec = rec; else delete r.rec;
    const all = (r.src || []).map(id => byId[id]);
    const isLf = !r.closed && all.length > 0 && all.every(s => s && s.group && LF_GROUPS.has(s.group));
    if (isLf) { r.lf = 1; lf++; } else delete r.lf;
    const A = byArea[r.a] = byArea[r.a] || { places: 0, award: 0, video: 0, cited: 0, any: 0 };
    A.places++; if (rec.award) A.award++; if (rec.video) A.video++; if (rec.cited) A.cited++; if (r.rec) A.any++;
  }
  const typed = srcList.filter(s => s.id !== 'guide' && s.group).length, total = srcList.filter(s => s.id !== 'guide').length;
  return {
    regCities: cities,
    typed: { sources: typed, of: total },
    untyped,   // stated gap: publishers no rule types (W9-9 acc1); aggregated by build.js into data/recognition-untyped.json
    counts: { award: recs.filter(r => r.rec && r.rec.award).length, video: recs.filter(r => r.rec && r.rec.video).length, cited: recs.filter(r => r.rec && r.rec.cited).length },
    byArea,
    localFavourites: lf >= LF_MIN ? { rule: LF_RULE, n: lf, gap: null }
      : { rule: LF_RULE, n: lf, gap: `Fewer than ${LF_MIN} places here qualify (${lf}) with ${typed} of ${total} sources typed in our registry, so the lens is not shown rather than padded.` },
  };
}

module.exports = { pageRecognition, groupOf, GROUPS, GROUP_RULES, HOST_RULES, LF_RULE, LF_MIN, LF_GROUPS, registry, norm, hostsOf, baseOf };
