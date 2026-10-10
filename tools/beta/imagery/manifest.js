'use strict';
/**
 * imagery/manifest.js — the PHOTO PATH's shopping list (lane: imagery).
 *
 * Reads data/geocodes.json READ-ONLY (through the beta model join) and lists every beta record whose sourced
 * coordinate entry cites a Wikipedia article, into beta/assets/img/manifest.json. The owner (or a later round with
 * network access to Wikimedia) uses it to find each article's lead image (Wikidata P18), check its licence, and drop
 * the file + a CREDITS.json row into beta/assets/img/photos/. Nothing here downloads anything.
 *
 * `cite` grades how precisely the entry names the article:
 *   url     — a full xx.wikipedia.org/wiki/<title> link        (title exact)
 *   named   — "ja.wikipedia 大石神社 infobox", "Wikipedia 'Plymouth Congregational Church (Miami)'" (title as written)
 *   generic — "WIKIPEDIA published coords" — the article is the place's own, title not written (null)
 * `eligible` is false where a hero photo must not be used: closed places (never "go here today"), Vietnam (no
 * freedom of panorama), and food places (photos only for landmarks/sights unless the venue itself is licensed).
 */

const WIKI_URL = /(?:https?:\/\/)?([a-z]{2,3}(?:-[a-z]+)?)\.(?:m\.)?wikipedia\.org\/wiki\/([^\s'"<>,;]+)/i;
const QID = /\b(?:wikidata[:\s]*)?(Q[1-9]\d{1,9})\b/;
const NEG = /\b(?:no|not an?|not the|rather than)\b[^.;]{0,40}wikipedia|wikipedia (?:point|coordinate)s? (?:is|was|are) (?:the|~|off|wrong)/i;
const AUDIT = /sample-audited|machine-geocoded/i;

function balanceParens(t) {
  let s = t.replace(/[.\]]+$/, '');
  while (s.endsWith(')') && (s.match(/\(/g) || []).length < (s.match(/\)/g) || []).length) s = s.slice(0, -1);
  return s;
}
function decode(t) { try { return decodeURIComponent(t); } catch (e) { return t; } }

/** Parse one geocodes `source` string → {lang, title, url, cite, qid} or null when it does not cite a Wikipedia article. */
function parseSource(src) {
  const s = String(src || '');
  if (!/wikipedia/i.test(s) || AUDIT.test(s) || NEG.test(s)) return null;
  const qm = QID.exec(s), qid = qm && /wikidata|Q\d+\s*\//i.test(s) ? qm[1] : (qm && /wikidata/i.test(s) ? qm[1] : null);
  const m = WIKI_URL.exec(s);
  if (m) {
    const raw = balanceParens(m[2]);
    const title = decode(raw).replace(/_/g, ' ');
    return { lang: m[1].toLowerCase(), title, url: `https://${m[1].toLowerCase()}.wikipedia.org/wiki/${raw}`, cite: 'url', qid };
  }
  const lm = /\b([a-z]{2})\.wikipedia\b/i.exec(s) || /wikipedia\s*\(([a-z]{2})\)/i.exec(s);
  const lang = lm ? lm[1].toLowerCase() : 'en';
  let title = null, mm;
  if ((mm = /wikipedia[^'"‘“]{0,12}['‘“"]([^'’”"]{2,90})['’”"]/i.exec(s))) title = mm[1];
  else if ((mm = /wikipedia\s*\(([^)]{3,90})\)\s*(?:coords?|coordinates|infobox)/i.exec(s)) && !/^[a-z]{2}$/i.test(mm[1])) title = mm[1];
  else if ((mm = /wikipedia infobox \(([^)]{3,90})\)/i.exec(s))) title = mm[1].replace(/_/g, ' ');
  else if ((mm = /\b[a-z]{2}\.wikipedia\s+([^\s(（,;]+(?:\s[^\s(（,;]+){0,5}?)\s+(?:infobox|published|coordinates|coords|article|\()/i.exec(s))) title = mm[1];
  else if ((mm = /wikipedia:?\s+([A-Z0-9][^,;:()]{2,80}?)\s+(?:infobox|article|coordinates|coords|published|\/)/.exec(s))) title = mm[1];
  if (title) {
    title = title.replace(/\s+(article|coordinates|coords)$/i, '').replace(/^[\/\s]+/, '').trim();
    if ((title.match(/\(/g) || []).length > (title.match(/\)/g) || []).length) title += ')';
    if (/^(wikidata|Q\d+)/i.test(title)) title = null;
  }
  if (title && /^(published|infobox|coords?|coordinates|article|via|dms|rounded|and|or|the)\b/i.test(title)) title = null;
  return { lang, title: title ? title.trim() : null, url: null, cite: title ? 'named' : 'generic', qid };
}

/** Does the cited article look like THIS place ('same') or a containing/neighbouring one ('related')? A hint for the owner, not a verdict. */
function titleMatch(title, name) {
  const toks = t => new Set(String(t).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/[^a-z0-9\u3040-\u9fff]+/).filter(w => w.length > 2 && !/^(the|and|of|de|la|le|der|die|das|park|museum)$/.test(w)));
  const a = toks(title), b = toks(name);
  const cjk = s => (String(s).match(/[\u3040-\u9fff]{2,}/g) || []);
  if ([...a].some(w => b.has(w)) || cjk(title).some(w => String(name).includes(w))) return 'same';
  return 'related';
}

/**
 * Build the manifest from beta rows (each with .recs from model.normalise, .geoKey, .country) and the geocodes registry.
 * Returns the JSON-ready object. Deterministic: rows in registry order, records in page order.
 */
function buildManifest(cityRows, geo) {
  const items = [];
  const count = { url: 0, named: 0, generic: 0 }, elig = { yes: 0, closed: 0, fop: 0, food: 0 };
  for (const r of cityRows) {
    const g = (r.geoKey && geo[r.geoKey]) || {};
    for (const x of r.recs) {
      const base = x.n.replace(/\s*[—–-]+\s*CLOSED\b.*$/i, '').trim();
      const e = g[x.n] || g[base];
      if (!e) continue;
      const p = parseSource(e.source);
      if (!p) continue;
      count[p.cite]++;
      p.match = p.title ? titleMatch(p.title, x.n) : 'unknown';
      const why = x.closed ? 'closed' : r.country === 'vietnam' ? 'fop' : x.kind === 'food' ? 'food' : null;
      elig[why || 'yes']++;
      items.push(Object.assign({ page: r.key, id: x.id, name: x.n, kind: x.kind, status: x.closed ? 'closed' : (e.status || 'unknown'),
        country: r.country || null }, p, { eligible: !why }, why ? { ineligible: { closed: 'closed place — never a hero photo', fop: 'Vietnam has no freedom of panorama', food: 'food place — photos only for sights unless the venue itself is licensed' }[why] } : {}));
    }
  }
  return {
    _generated: 'tools/beta/imagery/manifest.js from data/geocodes.json (read-only) — do not edit', v: 1,
    _doc: 'Every beta record whose verified-coordinate source cites a Wikipedia article. For the owner: look up each article\'s lead image (Wikidata P18), confirm the licence (CC0 / PD / CC BY / CC BY-SA only) and that it depicts THIS place, save a standard-width copy into beta/assets/img/photos/ and add a CREDITS.json row. See design/beta/IMAGERY.md "Dropping in photos". Fetching is not done here: Wikimedia hosts are blocked by this environment\'s network policy.',
    fields: { page: 'beta page key', id: 'stable place id', cite: 'url | named | generic', match: 'same = article title shares words with the place name; related = the article may be a containing place (a hawker centre for a stall, a park for a viewpoint) — the photo must still depict THIS place', eligible: 'false = never shown as a hero (see ineligible)' },
    summary: { records: items.length, byCite: count, eligible: elig.yes, ineligible: { closed: elig.closed, vietnamFoP: elig.fop, food: elig.food } },
    items,
  };
}

module.exports = { parseSource, buildManifest, titleMatch };
