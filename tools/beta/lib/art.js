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

/* ---- Wave 2: hero-scale art (ROUND-1 gaps #1/#6). Same rule: only the guide's own verified pins, no geography. ---- */

/** Push each hull vertex `d` px away from the centroid, so the outline breathes around its outermost pins. */
function inflate(pts, d) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map(([x, y]) => { const dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy) || 1; return [r1(x + dx / l * d), r1(y + dy / l * d)]; });
}
/** Closed Catmull-Rom spline through the points, as cubic Béziers (a soft silhouette, not a polygon). */
function smoothPath(pts) {
  if (pts.length < 3) return '';
  const n = pts.length, P = i => pts[(i + n) % n];
  let d = `M${P(0).join(' ')}`;
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = [r1(p1[0] + (p2[0] - p0[0]) / 6), r1(p1[1] + (p2[1] - p0[1]) / 6)], c2 = [r1(p2[0] - (p3[0] - p1[0]) / 6), r1(p2[1] - (p3[1] - p1[1]) / 6)];
    d += `C${c1.join(' ')} ${c2.join(' ')} ${p2.join(' ')}`;
  }
  return d + 'Z';
}
function blob(xys, d) {
  if (xys.length >= 3) { const h = hull(xys); if (h.length >= 3) return smoothPath(inflate(h, d)); }
  // 1–2 pins (or collinear): a soft capsule around them
  const cx = xys.reduce((s, p) => s + p[0], 0) / xys.length, cy = xys.reduce((s, p) => s + p[1], 0) / xys.length;
  const rx = r1(Math.max(d, ...xys.map(p => Math.abs(p[0] - cx) + d))), ry = r1(Math.max(d, ...xys.map(p => Math.abs(p[1] - cy) + d)));
  return `M${r1(cx - rx)} ${r1(cy)}a${rx} ${ry} 0 1 0 ${r1(2 * rx)} 0a${rx} ${ry} 0 1 0 ${r1(-2 * rx)} 0Z`;
}

/**
 * City hero (1200×600 by default): every area as a soft silhouette of its own verified pins, filled in the area's
 * colour, pins on top (tier-1 open pins larger and ringed; closed hollow). Frame = the 4th–96th percentile box
 * like cityMap (outliers counted, not drawn). Returns {svg, proj, drawn, beyond, labels:{AREA:[x,y,n]}} — label
 * anchors (area centroid + pin count) so a page can set area names in HTML over the art, in its own fonts.
 */
function cityHero(name, recs, colors, areaNames = {}, { w = 1200, h = 600, pad = 40 } = {}) {
  const pts = recs.filter(isVerifiedPin);
  if (!pts.length) return null;
  const la = pts.map(p => p.la), ln = pts.map(p => p.ln);
  let box = [quant(la, 0.04), quant(ln, 0.04), quant(la, 0.96), quant(ln, 0.96)];
  const dLa = (box[2] - box[0]) * 0.1, dLn = (box[3] - box[1]) * 0.1;
  box = [box[0] - dLa, box[1] - dLn, box[2] + dLa, box[3] + dLn];
  const P = projection([{ la: box[0], ln: box[1] }, { la: box[2], ln: box[3] }], w, h, pad);
  const inFrame = ([x, y]) => x >= 2 && y >= 2 && x <= w - 2 && y <= h - 2;
  const by = {}; let beyond = 0;
  for (const p of pts) { const q = xy(P, p.la, p.ln); if (!inFrame(q)) { beyond++; continue; } (by[p.a] = by[p.a] || []).push([p, q]); }
  const shapes = [], dots = [], labels = {};
  for (const [a, list] of Object.entries(by)) {
    const c = colors[a] || MUTED, xys = list.map(x => x[1]);
    shapes.push(`<path d="${blob(xys, 16)}" fill="${c}" fill-opacity=".13" stroke="${c}" stroke-opacity=".5" stroke-width="1.4" stroke-linejoin="round"/>`);
    labels[a] = [r1(xys.reduce((s, q) => s + q[0], 0) / xys.length), r1(xys.reduce((s, q) => s + q[1], 0) / xys.length), list.length, areaNames[a] || a];
    for (const [p, [x, y]] of list) {
      if (p.closed) dots.push(`<circle cx="${x}" cy="${y}" r="3" fill="none" stroke="${MUTED}" stroke-width="1.2"/>`);
      else if (p.t === 1) dots.push(`<circle cx="${x}" cy="${y}" r="7.5" fill="none" stroke="${c}" stroke-opacity=".55" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="4.6" fill="${c}"/>`);
      else dots.push(`<circle cx="${x}" cy="${y}" r="3.2" fill="${c}" fill-opacity=".85"/>`);
    }
  }
  const drawn = pts.length - beyond;
  const desc = `${drawn} verified pins in ${Object.keys(by).length} areas, each area drawn as the outline of its own pins` +
    (beyond ? `; ${beyond} outlying pins are beyond this frame` : '') + '. From the guide’s own coordinates; not a street map.';
  return { svg: svg(w, h, `${name} — areas drawn from verified pins`, desc, `<g>${shapes.join('')}</g><g>${dots.join('')}</g>`), proj: P, drawn, beyond, labels };
}

/**
 * Area silhouette at hero scale (960×540): the area's soft outline + every verified pin; with `plan` (a day plan
 * from lib/guide.js: {ids, legs}) also the route — straight dashed legs between numbered stops, because the legs
 * ARE straight-line distances (never implies a walking route). Returns {svg, proj, drawn, stops?:[[x,y]]}.
 */
function areaHero(areaName, color, recs, plan = null, { w = 960, h = 540, pad = 48 } = {}) {
  const pts = recs.filter(isVerifiedPin);
  if (!pts.length) return null;
  // a day frames ITS stops (padded 40%, at least ~600 m), with the rest of the area as context; a silhouette frames the area
  let fr = pts;
  if (plan) {
    const st = pts.filter(p => plan.ids.includes(p.id));
    if (st.length) {
      const la = st.map(p => p.la), ln = st.map(p => p.ln), cLa = (Math.min(...la) + Math.max(...la)) / 2, cLn = (Math.min(...ln) + Math.max(...ln)) / 2;
      const sLa = Math.max(0.0055, (Math.max(...la) - Math.min(...la)) * 1.4) / 2, sLn = Math.max(0.0055 / Math.cos(cLa * Math.PI / 180), (Math.max(...ln) - Math.min(...ln)) * 1.4) / 2;
      fr = [{ la: cLa - sLa, ln: cLn - sLn }, { la: cLa + sLa, ln: cLn + sLn }];
    }
  }
  const P = projection(fr, w, h, pad);
  const xys = pts.map(p => xy(P, p.la, p.ln)), c = color || MUTED;
  const shape = `<path d="${blob(xys, 22)}" fill="${c}" fill-opacity=".12" stroke="${c}" stroke-opacity=".5" stroke-width="1.6" stroke-linejoin="round"/>`;
  const onRoute = new Set(plan ? plan.ids : []);
  const dots = pts.map((p, i) => {
    const [x, y] = xys[i], dim = plan && !onRoute.has(p.id) ? ' fill-opacity=".35"' : '';
    if (x < -8 || y < -8 || x > w + 8 || y > h + 8) return '';
    if (p.closed) return `<circle cx="${x}" cy="${y}" r="3.4" fill="none" stroke="${MUTED}" stroke-width="1.3"/>`;
    return p.t === 1 ? `<circle cx="${x}" cy="${y}" r="5.4" fill="${c}"${dim}/>` : `<circle cx="${x}" cy="${y}" r="3.8" fill="${c}"${dim || ' fill-opacity=".8"'}/>`;
  });
  let route = '', stops = null;
  if (plan) {
    const by = Object.fromEntries(pts.map((p, i) => [p.id, xys[i]]));
    stops = plan.ids.map(id => by[id]).filter(Boolean);
    if (stops.length === plan.ids.length) {
      // numbered badges sit on their stop; a badge that would overlap an earlier one moves out along a short leader
      const badges = [];
      stops.forEach(([x, y]) => {
        let bx = x, by = y, k = 0;
        while (badges.some(([u, v]) => Math.hypot(u - bx, v - by) < 28) && k < 12) { const a = -Math.PI / 4 + k * Math.PI / 3; bx = r1(x + Math.cos(a) * 34); by = r1(y + Math.sin(a) * 34); k++; }
        badges.push([bx, by]);
      });
      route = `<path d="M${stops.map(q => q.join(' ')).join('L')}" fill="none" stroke="${c}" stroke-width="2.4" stroke-dasharray="7 6" stroke-linecap="round"/>` +
        stops.map(([x, y], i) => { const [bx, by] = badges[i];
          return (bx !== x || by !== y ? `<path d="M${x} ${y}L${bx} ${by}" stroke="${c}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="3.5" fill="${c}"/>` : '') +
            `<circle cx="${bx}" cy="${by}" r="13" fill="#fff" stroke="${c}" stroke-width="2.4"/><text x="${bx}" y="${r1(by + 4.6)}" text-anchor="middle" font-family="Figtree, system-ui, sans-serif" font-size="13" font-weight="700" fill="${c}">${i + 1}</text>`; }).join('');
    } else stops = null;
  }
  const title = plan ? `${areaName} — a day of ${plan.ids.length} stops, ${plan.km} km straight-line` : `${areaName} — ${pts.length} verified pins`;
  const desc = (plan ? 'Numbered stops joined by straight lines: distances are straight-line, not walking routes. ' : '') +
    'The area’s verified pins inside their outline. Drawn from the guide’s own coordinates; not a street map.';
  return { svg: svg(w, h, title, desc, shape + dots.join('') + route), proj: P, drawn: pts.length, stops };
}

module.exports = { cityMap, areaArt, cityHero, areaHero, projection, xy, hull, smoothPath };
