'use strict';
/**
 * location-verify-phase2.js — government-geodata adapters for tools/location-verify.js (docs/LOCATION-VERIFY-ACTIONS.md
 * § 2.2). Every adapter PROPOSES only, like the rest of the tool.
 *
 *   House-coordinate files (Germany: Geobasis NRW, LVermGeo RLP, LVGL Saarland). Official address POINTS from a file
 *     downloaded once (no per-request API, so no rate limit). Header-driven parsing, any of ; , or tab as delimiter;
 *     UTM zone 32 (EPSG:25832) eastings/northings are converted to WGS84. A match is an exact
 *     postcode + street + house number hit. It is an address point, not a named place: kind 'gov-address', graded med;
 *     agreement with a named candidate within 40 m lifts that candidate to high.
 *   Address Base Registry (Japan, Digital Agency). Town-block representative points: a WRONG-TOWN GUARD only. It never
 *     proposes a pin; it notes when the current pin is far from its town's representative point.
 *   OneMap (Singapore Land Authority). Search by the 6-digit postal code (one building per postcode in Singapore).
 *     Needs ONEMAP_EMAIL / ONEMAP_PASSWORD (Actions secrets). Without them it is skipped with a logged note.
 *     Credentials are only read from the environment; they are never logged, cached or written to a report.
 *
 * Download URLs for the files are deliberately NOT hard-coded: read each dataset page and its licence first
 * (§ 2.2 marks what is unconfirmed), then pass the local file with --house-file / --abr-file.
 */
const fs = require('fs');
const path = require('path');

// ───────────────────────────────────────── UTM zone 32N (ETRS89/GRS80 ≈ WGS84 at map scale) ──
const A = 6378137, F = 1 / 298.257222101, K0 = 0.9996, E2 = F * (2 - F), EP2 = E2 / (1 - E2);
function meridianArc(phi) {
  const e4 = E2 * E2, e6 = e4 * E2;
  return A * ((1 - E2 / 4 - 3 * e4 / 64 - 5 * e6 / 256) * phi - (3 * E2 / 8 + 3 * e4 / 32 + 45 * e6 / 1024) * Math.sin(2 * phi)
    + (15 * e4 / 256 + 45 * e6 / 1024) * Math.sin(4 * phi) - (35 * e6 / 3072) * Math.sin(6 * phi));
}
/** WGS84 → UTM (northern hemisphere), for tests and sanity checks. */
function toUtm(lat, lng, zone = 32) {
  const phi = lat * Math.PI / 180, lam0 = ((zone - 1) * 6 - 180 + 3) * Math.PI / 180, lam = lng * Math.PI / 180;
  const N = A / Math.sqrt(1 - E2 * Math.sin(phi) ** 2), T = Math.tan(phi) ** 2, C = EP2 * Math.cos(phi) ** 2, Aa = Math.cos(phi) * (lam - lam0);
  const M = meridianArc(phi);
  const e = K0 * N * (Aa + (1 - T + C) * Aa ** 3 / 6 + (5 - 18 * T + T * T + 72 * C - 58 * EP2) * Aa ** 5 / 120) + 500000;
  const n = K0 * (M + N * Math.tan(phi) * (Aa * Aa / 2 + (5 - T + 9 * C + 4 * C * C) * Aa ** 4 / 24 + (61 - 58 * T + T * T + 600 * C - 330 * EP2) * Aa ** 6 / 720));
  return { e, n };
}
/** UTM (northern hemisphere) → WGS84. */
function fromUtm(e, n, zone = 32) {
  const e1 = (1 - Math.sqrt(1 - E2)) / (1 + Math.sqrt(1 - E2));
  const M = n / K0, mu = M / (A * (1 - E2 / 4 - 3 * E2 * E2 / 64 - 5 * E2 ** 3 / 256));
  const phi1 = mu + (3 * e1 / 2 - 27 * e1 ** 3 / 32) * Math.sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * e1 ** 4 / 32) * Math.sin(4 * mu)
    + (151 * e1 ** 3 / 96) * Math.sin(6 * mu) + (1097 * e1 ** 4 / 512) * Math.sin(8 * mu);
  const N1 = A / Math.sqrt(1 - E2 * Math.sin(phi1) ** 2), T1 = Math.tan(phi1) ** 2, C1 = EP2 * Math.cos(phi1) ** 2;
  const R1 = A * (1 - E2) / Math.pow(1 - E2 * Math.sin(phi1) ** 2, 1.5), D = (e - 500000) / (N1 * K0);
  const lat = phi1 - (N1 * Math.tan(phi1) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * EP2) * D ** 4 / 24
    + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * EP2 - 3 * C1 * C1) * D ** 6 / 720);
  const lng = ((zone - 1) * 6 - 180 + 3) * Math.PI / 180 + (D - (1 + 2 * T1 + C1) * D ** 3 / 6
    + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * EP2 + 24 * T1 * T1) * D ** 5 / 120) / Math.cos(phi1);
  return { lat: lat * 180 / Math.PI, lng: lng * 180 / Math.PI };
}

// ───────────────────────────────────────── delimited files ──
function splitLine(line, d) {
  const out = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === d) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out.map(s => s.trim());
}
function readTable(text) {
  const lines = String(text).replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return { header: [], rows: [] };
  const first = lines[0];
  const d = [';', '\t', ','].sort((a, b) => first.split(b).length - first.split(a).length)[0];
  const header = splitLine(first, d).map(h => h.replace(/^"|"$/g, ''));
  return { header, rows: lines.slice(1).map(l => splitLine(l, d)) };
}
const low = s => stripDia(String(s || '')).toLowerCase().replace(/[^a-z0-9぀-ヿ一-鿿]+/g, '');
function stripDia(s) { return String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss'); }
function col(header, aliases) {
  const h = header.map(low);
  for (const a of aliases) { const i = h.indexOf(low(a)); if (i >= 0) return i; }
  return -1;
}
const num = s => parseFloat(String(s || '').replace(',', '.'));

// ───────────────────────────────────────── German house coordinates ──
/** "Hohe Straße 12a" / "St. Johanner Markt 1" → normalised street + house number (German order: street, then number). */
function normStreetDE(s) {
  return stripDia(String(s || '')).toLowerCase().replace(/strasse\b|str\.?(?=\s|$)/g, 'str').replace(/[^a-z0-9]+/g, '');
}
function parseAddressDE(addr) {
  const parts = String(addr || '').split(',').map(x => x.trim());
  const m = (parts[0] || '').match(/^(.*?)\s+(\d+\s*[a-zA-Z]?)(?:\s*[-–\/]\s*\d+\s*[a-zA-Z]?)?$/);
  const pc = (String(addr || '').match(/\b(\d{5})\b/) || [])[1] || null;
  if (!m) return { street: normStreetDE(parts[0]) || null, houseNumber: null, postcode: pc };
  return { street: normStreetDE(m[1]), houseNumber: m[2].replace(/\s+/g, '').toLowerCase(), postcode: pc };
}

const H = {
  east: ['ost', 'east', 'rw', 'rechtswert', 'ostwert', 'x', 'e', 'utm_e', 'easting'],
  north: ['nord', 'north', 'hw', 'hochwert', 'nordwert', 'y', 'n', 'utm_n', 'northing'],
  lat: ['lat', 'latitude', 'breite'], lng: ['lon', 'lng', 'longitude', 'laenge', 'länge'],
  street: ['stn', 'str', 'strasse', 'straße', 'strassenname', 'street', 'thoroughfare'],
  hnr: ['hnr', 'hausnummer', 'housenumber', 'hausnr'], adz: ['adz', 'zusatz', 'hausnummerzusatz', 'adresszusatz'],
  plz: ['plz', 'postleitzahl', 'postcode', 'zip'], place: ['onm', 'ort', 'ortsname', 'gemeinde', 'gemeindename', 'city'],
};
/**
 * Load a house-coordinate file into an index: "postcode|street|number" → {lat,lng,address}. Returns
 * { index, count, skipped, columns, label, licence }. Throws if the columns it needs are not found (fail loud: a wrong
 * file must never silently produce zero matches that look like "no coverage").
 */
function loadHouseCoords(file, o = {}) {
  const { header, rows } = readTable(fs.readFileSync(file, 'utf8'));
  const c = Object.fromEntries(Object.entries(H).map(([k, v]) => [k, col(header, v)]));
  const haveUtm = c.east >= 0 && c.north >= 0, haveLL = c.lat >= 0 && c.lng >= 0;
  if (!(haveUtm || haveLL) || c.street < 0 || c.hnr < 0 || c.plz < 0)
    throw new Error(`${path.basename(file)}: need coordinate, street, house number and postcode columns; header was: ${header.join(' | ')}`);
  const index = new Map(); let count = 0, skipped = 0;
  for (const r of rows) {
    let lat, lng;
    if (haveLL) { lat = num(r[c.lat]); lng = num(r[c.lng]); }
    else { const e = num(r[c.east]), n = num(r[c.north]); if (!(e > 100000 && e < 1000000 && n > 5000000 && n < 6200000)) { skipped++; continue; } ({ lat, lng } = fromUtm(e, n, o.zone || 32)); }
    if (!(isFinite(lat) && isFinite(lng))) { skipped++; continue; }
    const hnr = (String(r[c.hnr] || '') + (c.adz >= 0 ? String(r[c.adz] || '') : '')).replace(/\s+/g, '').toLowerCase();
    const key = `${String(r[c.plz]).slice(0, 5)}|${normStreetDE(r[c.street])}|${hnr}`;
    if (!index.has(key)) index.set(key, { lat, lng, address: `${r[c.street]} ${hnr}, ${r[c.plz]}${c.place >= 0 ? ' ' + r[c.place] : ''}` });
    count++;
  }
  return { index, count, skipped, columns: c, label: o.label || path.basename(file), licence: o.licence || 'see docs/LOCATION-VERIFY-ACTIONS.md § 2.2', sourceUrl: o.sourceUrl || null };
}
/** Look a registry address up in loaded house-coordinate sets. Returns a candidate or null. */
function houseCandidate(sets, place, retrieved) {
  const a = parseAddressDE(place.address);
  if (!a.street || !a.houseNumber || !a.postcode) return null;
  for (const s of sets) {
    const hit = s.index.get(`${a.postcode}|${a.street}|${a.houseNumber}`);
    if (hit) return { kind: 'gov-address', source: s.label, name: '', lat: hit.lat, lng: hit.lng, address: hit.address,
      houseNumber: a.houseNumber, street: null, postcode: a.postcode, sourceUrl: s.sourceUrl || s.label, retrieved, licence: s.licence, exactGovAddress: true };
  }
  return null;
}

// ───────────────────────────────────────── Japan Address Base Registry (guard) ──
const ABR = {
  lat: ['代表点_緯度', 'rep_lat', 'lat', '緯度'], lng: ['代表点_経度', 'rep_lon', 'rep_lng', 'lon', 'lng', '経度'],
  town: ['大字・町名_英字', 'oaza_cho_roma', 'oaza_town_name_roma', '大字・町名', 'oaza_cho'], city: ['市区町村名_英字', 'city_name_roma', '市区町村名', 'city'],
};
/** Load ABR town representative points: "city|town" (normalised romaji or kanji) → {lat,lng}. */
function loadAbr(file) {
  const { header, rows } = readTable(fs.readFileSync(file, 'utf8'));
  const c = Object.fromEntries(Object.entries(ABR).map(([k, v]) => [k, col(header, v)]));
  if (c.lat < 0 || c.lng < 0 || c.town < 0 || c.city < 0) throw new Error(`${path.basename(file)}: need representative lat/lng, town and city columns; header was: ${header.join(' | ')}`);
  const index = new Map();
  for (const r of rows) {
    const lat = num(r[c.lat]), lng = num(r[c.lng]); if (!isFinite(lat) || !isFinite(lng)) continue;
    index.set(`${abrKey(r[c.city])}|${abrKey(r[c.town])}`, { lat, lng });
  }
  return { index, count: index.size };
}
const abrKey = s => low(String(s || '').replace(/-(shi|cho|machi|son|mura|ku)\b/gi, '').replace(/\s+(shi|city)$/i, ''));
/** Guard note when a pin sits far from its town's representative point (romanised "…, Town, City, Okinawa"). */
function abrGuard(abr, place, haversineM, km = 3) {
  if (!abr || place.current.lat == null) return null;
  const parts = String(place.address || '').split(',').map(x => x.trim()).filter(Boolean);
  for (let i = 0; i + 1 < parts.length; i++) {
    const town = parts[i].replace(/^[\d\-]+\s+/, ''), city = parts[i + 1];
    const hit = abr.index.get(`${abrKey(city)}|${abrKey(town)}`);
    if (hit) {
      const d = haversineM(place.current.lat, place.current.lng, hit.lat, hit.lng);
      return d > km * 1000 ? `ABR guard: the pin is ${(d / 1000).toFixed(1)} km from the representative point of ${town}, ${city}. Possible wrong town; check by hand.` : null;
    }
  }
  return null;
}

// ───────────────────────────────────────── OneMap (Singapore) ──
const ONEMAP = 'https://www.onemap.gov.sg';
const ONEMAP_LICENCE = 'Contains information from OneMap (Singapore Land Authority), made available under the terms of the Singapore Open Data Licence version 1.0 — https://www.onemap.gov.sg/legal/opendatalicence.html';
/** Token from the environment credentials, or null with the reason (never includes the credentials). */
async function onemapToken(env = process.env, fetchFn = fetch) {
  if (!env.ONEMAP_EMAIL || !env.ONEMAP_PASSWORD) return { token: null, note: 'OneMap skipped: ONEMAP_EMAIL / ONEMAP_PASSWORD secrets are not set' };
  try {
    const r = await fetchFn(`${ONEMAP}/api/auth/post/getToken`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: env.ONEMAP_EMAIL, password: env.ONEMAP_PASSWORD }) });
    if (!r.ok) return { token: null, note: `OneMap skipped: token request answered HTTP ${r.status}` };
    const j = await r.json();
    return j && j.access_token ? { token: j.access_token, note: null } : { token: null, note: 'OneMap skipped: no access_token in the reply' };
  } catch (e) { return { token: null, note: `OneMap skipped: ${(e.cause && e.cause.code) || e.message}` }; }
}
const sgPostcode = addr => (/singapore/i.test(addr || '') && (String(addr).match(/\b(\d{6})\b/) || [])[1]) || null;
/** Search OneMap by postal code through the shared Http client (cached, paced). Returns candidates. */
async function fromOneMap(http, place, token, nameSim) {
  const pc = sgPostcode(place.address);
  if (!pc || !token) return [];
  const url = `${ONEMAP}/api/common/elastic/search?searchVal=${pc}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
  const r = await http.json(url, { headers: { Authorization: token }, cacheKeyUrl: url });
  const res = (r.json && r.json.results) || [];
  return res.filter(x => String(x.POSTAL) === pc).map(x => {
    const lat = parseFloat(x.LATITUDE), lng = parseFloat(x.LONGITUDE);
    const bname = x.BUILDING && x.BUILDING !== 'NIL' ? x.BUILDING : '';
    return { kind: 'onemap', source: 'onemap', name: bname, lat, lng, address: x.ADDRESS, postcode: pc,
      houseNumber: x.BLK_NO ? String(x.BLK_NO).toLowerCase() : null, street: x.ROAD_NAME || null,
      buildingMatch: bname ? nameSim(place.name, bname) : 0, sourceUrl: url.replace(/&pageNum=1$/, ''), retrieved: r.retrieved, licence: ONEMAP_LICENCE };
  }).filter(c => isFinite(c.lat) && isFinite(c.lng));
}

module.exports = { toUtm, fromUtm, readTable, normStreetDE, parseAddressDE, loadHouseCoords, houseCandidate, loadAbr, abrGuard, abrKey,
  onemapToken, fromOneMap, sgPostcode, ONEMAP_LICENCE };
