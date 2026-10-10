'use strict';
/**
 * art.js — build-time SVG map art drawn from VERIFIED pins only (M1-13, and the no-network map of M1-06).
 * Platform-owned. Deterministic: coordinates are rounded, iteration order is the page's, no timestamps.
 *
 * Nothing here is geography we don't own: no coastlines, roads or OSM geometry are drawn — only the page's
 * own verified coordinates (data/geocodes.json confidence high|med, via the model's `pv.pin`), so no map
 * credit is needed beside the art. A record with a low/unverified pin is simply not drawn (it is still
 * listed — art is decoration, never the only way to reach a place).
 *
 * Emits, per place page (beta/assets/art/<fileKey>/):
 *   map.svg          the city schematic: every verified pin, coloured by area; closed pins hollow and grey.
 *                    The frame is the 4th–96th percentile box of the pins (padded), so a day-trip ring doesn't
 *                    shrink the city to a dot; pins beyond it are drawn as edge ticks and counted in <desc>.
 *   <AREA>.svg       an area silhouette: the area's verified pins as a dot field inside their convex hull.
 * And returns a projection per drawing so the client can place a locator dot (Cleo.art.xy in core.js):
 *   { w, h, pad, box:[minLat, minLng, maxLat, maxLng], kx, ky }  —  x = pad + (ln - minLng)·kx,
 *                                                                   y = pad + (maxLat - la)·ky
 */
const { isVerifiedPin } = require('./stats');
const { esc } = require('./html');

const r1 = n => Math.round(n * 10) / 10;
const MUTED = '#9A968E';

/** Equirectangular projection, longitude scaled by cos(mid-latitude), fitted into w×h minus padding. */
function projection(pts, w, h, pad, minSpan = 0.004) {
  let minLa = Math.min(...pts.map(p => p.la)), maxLa = Math.max(...pts.map(p => p.la));
  let minLn = Math.min(...pts.map(p => p.ln)), maxLn = Math.max(...pts.map(p => p.ln));
  const cos = Math.cos(((minLa + maxLa) / 2) * Math.PI / 180) || 1;
  if (maxLa - minLa < minSpan) { const c = (minLa + maxLa) / 2; minLa = c - minSpan / 2; maxLa = c + minSpan / 2; }
  if ((maxLn - minLn) * cos < minSpan) { const c = (minLn + maxLn) / 2; minLn = c - minSpan / cos / 2; maxLn = c + minSpan / cos / 2; }
  const k = Math.min((w - 2 * pad) / ((maxLn - minLn) * cos), (h - 2 * pad) / (maxLa - minLa));
  // centre the drawing inside the frame
  const kx = k * cos, ky = k;
  const offX = (w - 2 * pad - (maxLn - minLn) * kx) / 2, offY = (h - 2 * pad - (maxLa - minLa) * ky) / 2;
  const P = { w, h, pad, box: [+minLa.toFixed(6), +(minLn - offX / kx).toFixed(6), +(maxLa + offY / ky).toFixed(6), +maxLn.toFixed(6)], kx: +kx.toFixed(4), ky: +ky.toFixed(4) };
  return P;
}
const xy = (P, la, ln) => [r1(P.pad + (ln - P.box[1]) * P.kx), r1(P.pad + (P.box[2] - la) * P.ky)];

function hull(points) {                                   // Andrew's monotone chain; points: [[x,y]…]
  const p = [...new Map(points.map(q => [q.join(), q])).values()].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.slice().reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

const quant = (a, q) => { const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.max(0, Math.round(q * (s.length - 1))))]; };

function svg(w, h, title, desc, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t d">` +
    `<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>${body}</svg>\n`;
}

/** City schematic of every verified pin. Returns {svg, proj, drawn, beyond} or null when nothing is verified. */
function cityMap(name, recs, colors, { w = 640, h = 480, pad = 18, edges = true, scale = 1 } = {}) {
  const pts = recs.filter(isVerifiedPin);
  if (!pts.length) return null;
  // Frame: inner 92% of pins, padded 12%, so outliers (day trips) don't collapse the city.
  const la = pts.map(p => p.la), ln = pts.map(p => p.ln);
  let box = [quant(la, 0.04), quant(ln, 0.04), quant(la, 0.96), quant(ln, 0.96)];
  const dLa = (box[2] - box[0]) * 0.12, dLn = (box[3] - box[1]) * 0.12;
  box = [box[0] - dLa, box[1] - dLn, box[2] + dLa, box[3] + dLn];
  const P = projection([{ la: box[0], ln: box[1] }, { la: box[2], ln: box[3] }], w, h, pad);
  let beyond = 0;
  const dots = pts.map(p => {
    let [x, y] = xy(P, p.la, p.ln);
    const out = x < pad / 2 || y < pad / 2 || x > w - pad / 2 || y > h - pad / 2;
    if (out) { beyond++; if (!edges) return ''; x = Math.min(w - 4, Math.max(4, x)); y = Math.min(h - 4, Math.max(4, y)); }
    const c = p.closed ? MUTED : colors[p.a] || MUTED;
    const rad = r1((out ? 2.5 : p.t === 1 && !p.closed ? 4 : 2.8) * scale);
    return p.closed || out
      ? `<circle cx="${x}" cy="${y}" r="${rad}" fill="none" stroke="${c}" stroke-width="1.2"/>`
      : `<circle cx="${x}" cy="${y}" r="${rad}" fill="${c}" fill-opacity=".85"/>`;
  });
  const desc = `${pts.length} verified pins of ${recs.length} places, coloured by area` +
    (beyond ? `; ${beyond} lie beyond this frame (day trips and outskirts)${edges ? ' and are drawn at its edge' : ' and are not drawn here'}` : '') +
    '. Drawn from the guide’s own coordinates; not a street map.';
  return { svg: svg(w, h, `${name} — schematic of verified pins`, desc, `<g>${dots.join('')}</g>`), proj: P, drawn: pts.length, beyond };
}

/** Area silhouette: the area's verified pins as a dot field inside their hull. */
function areaArt(areaName, color, recs, { w = 320, h = 200, pad = 14 } = {}) {
  const pts = recs.filter(isVerifiedPin);
  if (!pts.length) return null;
  const P = projection(pts, w, h, pad);
  const xys = pts.map(p => xy(P, p.la, p.ln));
  const hl = hull(xys);
  const c = color || MUTED;
  const shape = hl.length >= 3 ? `<path d="M${hl.map(q => q.join(' ')).join('L')}Z" fill="${c}" fill-opacity=".12" stroke="${c}" stroke-opacity=".45" stroke-width="1" stroke-linejoin="round"/>` : '';
  const dots = pts.map((p, i) => `<circle cx="${xys[i][0]}" cy="${xys[i][1]}" r="${p.t === 1 && !p.closed ? 3.4 : 2.4}" fill="${p.closed ? MUTED : c}"${p.closed ? ' fill-opacity=".6"' : ''}/>`);
  return { svg: svg(w, h, `${areaName} — ${pts.length} verified pins`, `The area’s verified pins inside their outline. Drawn from the guide’s own coordinates; not a street map.`, shape + dots.join('')), proj: P, drawn: pts.length };
}

module.exports = { cityMap, areaArt, projection, xy, hull };
