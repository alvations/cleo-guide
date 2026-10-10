'use strict';
/**
 * imagery/draw.js — a tiny vector vocabulary for the beta's ORIGINAL motif art (lane: imagery).
 *
 * Every function returns SVG path data (`d`) in a 480×200 frame. Subjects are GENERIC — waves, ridgelines, a
 * truss bridge, a row of shophouses, a pagoda — never a drawing of a specific venue. Shapes that vary between
 * cities (skylines, ridgelines, circuits) come from a seeded PRNG, so a build is deterministic and two cities
 * never get the same line.
 */
const W = 480, H = 200;
const r1 = n => Math.round(n * 10) / 10;
const P = (...xy) => xy.map(r1).join(' ');

/** Deterministic PRNG (mulberry32) seeded from a string. */
function rng(seed) {
  let h = 0x811c9dc5;
  for (const c of String(seed)) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return () => { h = (h + 0x6D2B79F5) >>> 0; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ---------------------------------------------------------------- ground patterns
/** Repeating tiles ({w, h, d}) — emitted once as an SVG <pattern>, so a full-bleed ground costs a few hundred bytes. */
const tile = {
  /** Overlapping concentric arcs — the classic wave-scale pattern. */
  seigaiha(r = 16) {
    const arcs = (cx, cy) => [1, .7, .4].map(k => `M${P(cx - r * k, cy)}A${P(r * k, r * k)} 0 0 1 ${P(cx + r * k, cy)}`).join('');
    return { w: 2 * r, h: r, d: arcs(r, r) + arcs(0, r / 2) + arcs(2 * r, r / 2) };
  },
  waves(gap = 14, amp = 4, per = 48) { return { w: per, h: gap * 2, d: `M0 ${gap / 2}q${P(per / 4, -amp, per / 2, 0)}t${P(per / 2, 0)}M${-per / 2} ${gap * 1.5}q${P(per / 4, -amp, per / 2, 0)}t${P(per / 2, 0)}t${P(per / 2, 0)}` }; },
  grid(step = 24) { return { w: step, h: step, d: `M0 0V${step}M0 0H${step}` }; },
  diag(step = 14) { return { w: step, h: step, d: `M0 ${step}L${step} 0M${-step / 2} ${step / 2}L${step / 2} ${-step / 2}M${step / 2} ${step * 1.5}L${step * 1.5} ${step / 2}` }; },
  cross(step = 14) { return { w: step, h: step, d: `M0 ${step}L${step} 0M0 0L${step} ${step}` }; },
  dots(step = 16) { return { w: step, h: step, d: `M${step / 4} ${step / 4}h0M${step * .75} ${step * .75}h0` }; },
  hexes(s = 14) { const h = s * Math.sqrt(3) / 2; return { w: 2 * h, h: 3 * s, d: `M${P(h, 0)}V${r1(s / 2)}L0 ${r1(s)}V${r1(2 * s)}L${P(h, 2.5 * s)}V${r1(3 * s)}M${P(h, s / 2)}L${P(2 * h, s)}M${P(h, 2.5 * s)}L${P(2 * h, 2 * s)}` }; },
  /** Four-petal tiles (the encaustic-tile rhythm of shophouse floors and glazed wall tiles — generic). */
  petals(s = 26) { const q = s / 2; return { w: s, h: s, d: `M0 ${q}A${P(q, q)} 0 0 1 ${q} 0A${P(q, q)} 0 0 1 ${s} ${q}A${P(q, q)} 0 0 1 ${q} ${s}A${P(q, q)} 0 0 1 0 ${q}ZM${q} ${q}h0` }; },
  chevron(step = 16, amp = 6) { return { w: 20, h: step, d: `M0 ${step / 2 - amp / 2}L10 ${step / 2 + amp / 2}L20 ${step / 2 - amp / 2}` }; },
  brick(w = 28, h = 12) { return { w, h: 2 * h, d: `M0 0H${w}M0 ${h}H${w}M0 0V${h}M${w / 2} ${h}V${2 * h}` }; },
};

const pat = {
  /** Stacked contour lines, like terraces or a topo map. */
  contours(seed, n = 11) {
    const R = rng(seed + 'c'); let d = '';
    const ph = [R() * 6, R() * 6, R() * 6];
    for (let i = 0; i < n; i++) {
      const y0 = 10 + i * (H / n);
      d += `M-10 ${r1(y0)}`;
      for (let x = 0; x <= W + 10; x += 20) d += `L${r1(x)} ${r1(y0 + 6 * Math.sin(x / 70 + ph[0] + i * .3) + 4 * Math.sin(x / 31 + ph[1]) + 3 * Math.sin(x / 13 + ph[2] + i))}`;
    }
    return d;
  },
  snow(step = 34, seed = 's') {
    const R = rng(seed); let d = '';
    for (let y = 14, i = 0; y < H; y += step * .8, i++) for (let x = (i % 2 ? step / 2 : 6) + R() * 6; x < W; x += step) {
      const s = 3 + R() * 2.5;
      for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; d += `M${P(x - Math.cos(a) * s, y - Math.sin(a) * s)}L${P(x + Math.cos(a) * s, y + Math.sin(a) * s)}`; }
    }
    return d;
  },
  circuit(seed, n = 26) {
    const R = rng(seed + 'k'); let d = '';
    for (let i = 0; i < n; i++) {
      let x = Math.round(R() * 24) * 20, y = Math.round(R() * 10) * 20;
      d += `M${x} ${y}`;
      for (let k = 0; k < 4; k++) { if (R() < .5) x += (R() < .5 ? -1 : 1) * 20 * (1 + Math.floor(R() * 3)); else y += (R() < .5 ? -1 : 1) * 20 * (1 + Math.floor(R() * 2)); d += `L${x} ${y}`; }
      d += `m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0`;
    }
    return d;
  },
};

// ---------------------------------------------------------------- horizon / line art
const art = {
  /** A generic skyline: seeded towers between x0 and x1 standing on `base`. */
  skyline(seed, { x0 = 0, x1 = W, base = 160, min = 20, max = 90, spire = .25, gap = 0, wmin = 10, wmax = 30 } = {}) {
    const R = rng(seed + 'sky'); let d = `M${x0} ${base}`, x = x0;
    while (x < x1) {
      const w = wmin + R() * (wmax - wmin), h = min + Math.pow(R(), 1.6) * (max - min), top = base - h;
      d += `V${r1(top)}`;
      if (R() < spire && w > 12) { const m = x + w / 2; d += `H${r1(m - 3)}L${r1(m)} ${r1(top - 10 - R() * 18)}L${r1(m + 3)} ${r1(top)}`; }
      else if (R() < .2) d += `L${r1(x + w / 2)} ${r1(top - w / 3)}`;
      d += `H${r1(Math.min(x + w, x1))}V${base}`;
      x += w; if (gap) { x += R() * gap; d += `H${r1(Math.min(x, x1))}`; }
    }
    return d + `H${x1}`;
  },
  /** Seeded mountain ridgeline. */
  ridge(seed, { base = 170, amp = 60, x0 = -10, x1 = W + 10, step = 16, snow = false } = {}) {
    const R = rng(seed + 'ridge'); let d = `M${x0} ${base}`, y = base - amp * .3, caps = '';
    for (let x = x0; x <= x1; x += step * (.6 + R() * .8)) {
      y = Math.max(base - amp, Math.min(base - 4, y + (R() - .5) * amp * .7));
      d += `L${r1(x)} ${r1(y)}`;
      if (snow && y < base - amp * .78) caps += `M${P(x - 8, y + 7)}L${P(x, y + 2)}L${P(x + 8, y + 7)}`;
    }
    return d + caps;
  },
  /** A lone symmetric volcano cone (generic, any volcanic island/peak). */
  cone(cx, base, w, h) { return `M${P(cx - w, base)}C${P(cx - w * .55, base - h * .35, cx - w * .2, base - h * .95, cx - w * .1, base - h)}H${r1(cx + w * .1)}C${P(cx + w * .2, base - h * .95, cx + w * .55, base - h * .35, cx + w, base)}M${P(cx - w * .26, base - h * .72)}l${P(w * .12, w * .06)}l${P(w * .12, -w * .07)}l${P(w * .12, w * .06)}`; },
  water(base = 172, { x0 = 0, x1 = W, n = 3, gap = 8, dash = 0 } = {}) {
    let d = '';
    for (let i = 0; i < n; i++) { const y = base + i * gap, inset = i * 18; d += `M${x0 + inset} ${y}`; for (let x = x0 + inset; x < x1 - inset; x += 24) d += `q6 -3 12 0t12 0`; }
    return d;
  },
  /** A big lake swell: long, slow rollers. */
  swell(base = 150, n = 5) {
    let d = '';
    for (let i = 0; i < n; i++) { const y = base + i * 11, a = 9 - i; d += `M-20 ${y}`; for (let x = -20; x < W + 40; x += 120) d += `c30 ${-a} 60 ${-a} 60 0s30 ${a} 60 0`; }
    return d;
  },
  bridgeTruss(x0, x1, deck, h) {
    let d = `M${x0} ${deck}H${x1}M${x0} ${deck - h}H${x1}`;
    const n = Math.max(4, Math.round((x1 - x0) / h)), s = (x1 - x0) / n;
    for (let i = 0; i <= n; i++) d += `M${P(x0 + i * s, deck)}V${r1(deck - h)}` + (i < n ? `M${P(x0 + i * s, deck)}L${P(x0 + (i + 1) * s, deck - h)}` : '');
    return d + `M${x0 + 6} ${deck}v18M${x1 - 6} ${deck}v18`;
  },
  bridgeArch(x0, x1, deck, h, hangers = 9) {
    const m = (x0 + x1) / 2;
    let d = `M${x0 - 20} ${deck}H${x1 + 20}M${x0} ${deck}Q${P(m, deck - 2 * h, x1, deck)}`;
    for (let i = 1; i < hangers; i++) { const t = i / hangers, x = x0 + (x1 - x0) * t, y = deck - 2 * h * t * (1 - t); d += `M${P(x, deck)}V${r1(y)}`; }
    return d;
  },
  bridgeSusp(x0, x1, deck, h) {
    const t1 = x0 + (x1 - x0) * .22, t2 = x1 - (x1 - x0) * .22, m = (t1 + t2) / 2;
    let d = `M${x0} ${deck}H${x1}M${t1} ${deck + 14}V${deck - h}M${t1 + 7} ${deck + 14}V${deck - h}M${t2} ${deck + 14}V${deck - h}M${t2 + 7} ${deck + 14}V${deck - h}`;
    d += `M${x0} ${deck - 4}Q${P((x0 + t1) / 2, deck - h * .25, t1, deck - h)}Q${P(m, deck + h * .6, t2 + 7, deck - h)}Q${P((t2 + x1) / 2, deck - h * .25, x1, deck - 4)}`;
    for (let x = t1 + 14; x < t2 - 4; x += 12) { const tt = (x - t1) / (t2 + 7 - t1), y = (1 - tt) * (1 - tt) * (deck - h) + 2 * tt * (1 - tt) * (deck + h * .6) + tt * tt * (deck - h); d += `M${r1(x)} ${deck}V${r1(y)}`; }
    return d;
  },
  /** Cable-stayed span: one pylon, fanned stays. */
  bridgeStay(x0, x1, deck, h) {
    const px = x0 + (x1 - x0) * .4; let d = `M${x0} ${deck}H${x1}M${px} ${deck + 12}V${deck - h}`;
    for (let i = 1; i <= 6; i++) d += `M${px} ${r1(deck - h + i * 5)}L${r1(px - i * (px - x0) / 6.5)} ${deck}M${px} ${r1(deck - h + i * 5)}L${r1(px + i * (x1 - px) / 6.5)} ${deck}`;
    return d;
  },
  pagoda(cx, base, s = 1, tiers = 5) {
    let d = `M${P(cx, base - (tiers * 16 + 26) * s)}V${r1(base - tiers * 16 * s)}`, y = base;
    for (let i = 0; i < tiers; i++) {
      const w = (26 - i * 2.8) * s, h = 16 * s;
      d += `M${P(cx - w * .62, y)}V${r1(y - h * .55)}H${r1(cx + w * .62)}V${r1(y)}M${P(cx - w, y - h * .55)}Q${P(cx - w * .5, y - h * .8, cx, y - h)}Q${P(cx + w * .5, y - h * .8, cx + w, y - h * .55)}`;
      y -= h;
    }
    for (let i = 1; i <= 4; i++) d += `M${P(cx - 3 * s, base - (tiers * 16 + 4 + i * 4) * s)}h${r1(6 * s)}`;
    return d + `M${P(cx - 34 * s, base)}H${r1(cx + 34 * s)}`;
  },
  torii(cx, base, s = 1) {
    return `M${P(cx - 22 * s, base)}L${P(cx - 19 * s, base - 50 * s)}M${P(cx + 22 * s, base)}L${P(cx + 19 * s, base - 50 * s)}M${P(cx - 32 * s, base - 54 * s)}Q${P(cx, base - 50 * s, cx + 32 * s, base - 58 * s)}M${P(cx - 34 * s, base - 59 * s)}Q${P(cx, base - 53 * s, cx + 34 * s, base - 63 * s)}M${P(cx - 26 * s, base - 42 * s)}H${r1(cx + 26 * s)}M${P(cx, base - 42 * s)}V${r1(base - 52 * s)}`;
  },
  /** A string of round paper lanterns hanging from a catenary. */
  lanterns(x0, x1, y, n = 7, s = 1) {
    let d = `M${x0} ${y}Q${P((x0 + x1) / 2, y + 22, x1, y)}`;
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1), x = x0 + (x1 - x0) * t, yy = y + 44 * t * (1 - t) * .5 + 6;
      d += `M${P(x, yy - 6)}v4M${P(x - 6 * s, yy + 4 * s)}a${P(6 * s, 7 * s)} 0 1 0 ${r1(12 * s)} 0a${P(6 * s, 7 * s)} 0 1 0 ${r1(-12 * s)} 0M${P(x - 4 * s, yy - 2 * s)}h${r1(8 * s)}M${P(x - 4 * s, yy + 10 * s)}h${r1(8 * s)}`;
    }
    return d;
  },
  /** Generic two-storey shophouse terrace: five-foot-way arches, shuttered windows, pitched roofs. */
  shophouses(seed, x0, x1, base, h = 60) {
    const R = rng(seed + 'shop'); let d = `M${x0} ${base}H${x1}`, x = x0;
    while (x < x1 - 20) {
      const w = 34 + R() * 10, hh = h * (.85 + R() * .3), top = base - hh;
      d += `M${r1(x)} ${base}V${r1(top)}L${r1(x + w / 2)} ${r1(top - 10)}L${r1(x + w)} ${r1(top)}V${base}`;
      d += `M${r1(x + 6)} ${base}V${r1(base - hh * .3)}A${P(w / 2 - 6, w / 2 - 6)} 0 0 1 ${r1(x + w - 6)} ${r1(base - hh * .3)}V${base}`;
      d += `M${r1(x + 8)} ${r1(top + hh * .18)}h${r1(w / 2 - 12)}v${r1(hh * .22)}h${r1(-(w / 2 - 12))}zM${r1(x + w / 2 + 4)} ${r1(top + hh * .18)}h${r1(w / 2 - 12)}v${r1(hh * .22)}h${r1(-(w / 2 - 12))}z`;
      x += w;
    }
    return d;
  },
  /** Slab housing blocks with a window grid (generic public-housing estate). */
  blocks(seed, x0, x1, base, max = 110) {
    const R = rng(seed + 'blk'); let d = '', x = x0;
    while (x < x1 - 20) {
      const w = 26 + R() * 18, h = max * (.55 + R() * .45), top = base - h;
      d += `M${r1(x)} ${base}V${r1(top)}H${r1(x + w)}V${base}`;
      for (let y = top + 8; y < base - 6; y += 9) d += `M${r1(x + 5)} ${r1(y)}H${r1(x + w - 5)}`;
      x += w + 6 + R() * 10;
    }
    return d + `M${x0 - 10} ${base}H${x1 + 10}`;
  },
  palm(x, base, s = 1, lean = 6) {
    const tx = x + lean * s, ty = base - 62 * s;
    let d = `M${P(x, base)}Q${P(x + lean * .2 * s, base - 30 * s, tx, ty)}`;
    for (const [dx, dy] of [[-26, 6], [-20, -8], [-6, -14], [10, -12], [24, -2], [22, 10], [-14, 14]]) d += `M${P(tx, ty)}q${P(dx * .5 * s, dy * s - 8 * s, dx * s, dy * s + 10 * s)}`;
    return d;
  },
  /** A generic domed capitol-type building (colonnade + drum + dome + lantern). */
  dome(cx, base, s = 1) {
    let d = `M${P(cx - 70 * s, base)}H${r1(cx + 70 * s)}M${P(cx - 64 * s, base)}V${r1(base - 26 * s)}H${r1(cx + 64 * s)}V${r1(base)}`;
    for (let i = -56; i <= 56; i += 10) d += `M${P(cx + i * s, base)}V${r1(base - 22 * s)}`;
    d += `M${P(cx - 26 * s, base - 26 * s)}V${r1(base - 42 * s)}H${r1(cx + 26 * s)}V${r1(base - 26 * s)}`;
    for (let i = -20; i <= 20; i += 6.6) d += `M${P(cx + i * s, base - 28 * s)}V${r1(base - 40 * s)}`;
    return d + `M${P(cx - 24 * s, base - 42 * s)}Q${P(cx - 22 * s, base - 76 * s, cx, base - 78 * s)}Q${P(cx + 22 * s, base - 76 * s, cx + 24 * s, base - 42 * s)}M${P(cx, base - 78 * s)}v${r1(-12 * s)}`;
  },
  /** Classical portico: pediment + columns (generic civic / museum front). */
  portico(cx, base, s = 1, cols = 8) {
    const w = 15 * cols * s;
    let d = `M${P(cx - w / 2 - 8 * s, base)}H${r1(cx + w / 2 + 8 * s)}M${P(cx - w / 2 - 4 * s, base - 46 * s)}H${r1(cx + w / 2 + 4 * s)}L${P(cx, base - 66 * s)}Z`;
    for (let i = 0; i < cols; i++) { const x = cx - w / 2 + (i + .5) * w / cols; d += `M${P(x, base - 3 * s)}V${r1(base - 44 * s)}`; }
    return d;
  },
  /** Gothic spires and a rose window: generic old-European church/belfry silhouettes. */
  spires(seed, x0, x1, base, max = 110) {
    const R = rng(seed + 'sp'); let d = `M${x0} ${base}H${x1}`, x = x0;
    while (x < x1 - 16) {
      const w = 14 + R() * 26, h = max * (.3 + R() * .7), top = base - h, kind = R();
      d += `M${r1(x)} ${base}V${r1(top)}`;
      if (kind < .45) d += `L${r1(x + w / 2)} ${r1(top - h * .45)}L${r1(x + w)} ${r1(top)}`;            // spire
      else if (kind < .7) d += `H${r1(x + w * .2)}V${r1(top - 6)}H${r1(x + w * .4)}V${r1(top)}H${r1(x + w * .6)}V${r1(top - 6)}H${r1(x + w * .8)}V${r1(top)}H${r1(x + w)}`;   // crenellated belfry
      else d += `Q${P(x + w / 2, top - w * .9, x + w, top)}`;                                         // onion / bulb
      d += `V${base}M${r1(x + w / 2 - 3)} ${r1(top + 10)}v8h6v-8z`;
      x += w + R() * 14;
    }
    return d;
  },
  /** Stepped-gable canal houses (the generic Low Countries terrace). */
  gables(seed, x0, x1, base, h = 70) {
    const R = rng(seed + 'gab'); let d = `M${x0} ${base}H${x1}`, x = x0;
    while (x < x1 - 16) {
      const w = 22 + R() * 12, hh = h * (.7 + R() * .45), top = base - hh, steps = 3 + Math.floor(R() * 2), st = w / (2 * steps + 1);
      d += `M${r1(x)} ${base}V${r1(top)}`;
      for (let i = 0; i < steps; i++) d += `h${r1(st)}v${r1(-8)}`;
      d += `h${r1(st)}`;
      for (let i = 0; i < steps; i++) d += `v8h${r1(st)}`;
      d += `V${base}`;
      for (let y = top + 10; y < base - 14; y += 16) d += `M${r1(x + w * .25)} ${r1(y)}h${r1(w * .18)}M${r1(x + w * .58)} ${r1(y)}h${r1(w * .18)}`;
      x += w;
    }
    return d;
  },
  /** Half-timbered gabled houses (generic Rhineland / old-town frame). */
  timber(seed, x0, x1, base, h = 64) {
    const R = rng(seed + 'tim'); let d = `M${x0} ${base}H${x1}`, x = x0;
    while (x < x1 - 16) {
      const w = 30 + R() * 14, hh = h * (.75 + R() * .35), eave = base - hh * .55, top = base - hh;
      d += `M${r1(x)} ${base}V${r1(eave)}L${r1(x + w / 2)} ${r1(top)}L${r1(x + w)} ${r1(eave)}V${base}M${r1(x)} ${r1(eave)}H${r1(x + w)}M${r1(x)} ${r1((base + eave) / 2)}H${r1(x + w)}`;
      d += `M${r1(x)} ${r1(eave)}L${r1(x + w / 2)} ${r1((base + eave) / 2)}L${r1(x + w)} ${r1(eave)}M${r1(x + w / 2)} ${r1(eave)}V${base}`;
      x += w + 2;
    }
    return d;
  },
  lighthouse(x, base, s = 1) {
    return `M${P(x - 9 * s, base)}L${P(x - 5 * s, base - 62 * s)}H${r1(x + 5 * s)}L${P(x + 9 * s, base)}M${P(x - 8 * s, base - 62 * s)}h${r1(16 * s)}M${P(x - 5 * s, base - 62 * s)}v${r1(-10 * s)}h${r1(10 * s)}v${r1(10 * s)}M${P(x - 6 * s, base - 72 * s)}l${P(6 * s, -6 * s)}l${P(6 * s, 6 * s)}M${P(x + 8 * s, base - 67 * s)}l${P(40 * s, -10 * s)}M${P(x + 8 * s, base - 67 * s)}l${P(40 * s, 6 * s)}M${P(x - 7 * s, base - 30 * s)}h${r1(14 * s)}`;
  },
  stacks(seed, x0, x1, base, max = 90) {
    const R = rng(seed + 'stk'); let d = `M${x0} ${base}H${x1}`, x = x0;
    while (x < x1 - 10) {
      const w = 6 + R() * 6, h = max * (.4 + R() * .6);
      d += `M${r1(x)} ${base}L${r1(x + 1)} ${r1(base - h)}H${r1(x + w - 1)}L${r1(x + w)} ${base}`;
      if (R() < .6) d += `M${r1(x + w / 2)} ${r1(base - h - 4)}q8 -8 2 -16t6 -18`;
      x += w + 10 + R() * 26;
      if (R() < .4) { const bw = 30 + R() * 30; d += `M${r1(x)} ${base}V${r1(base - 22)}l10 -8v8l10 -8v8l10 -8V${base}`; x += bw; }
    }
    return d;
  },
  wheel(cx, cy, r) {
    let d = `M${P(cx - r, cy)}a${P(r, r)} 0 1 0 ${r1(2 * r)} 0a${P(r, r)} 0 1 0 ${r1(-2 * r)} 0M${P(cx - r * .3, cy + r + 18)}L${P(cx, cy)}L${P(cx + r * .3, cy + r + 18)}`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; d += `M${P(cx, cy)}L${P(cx + Math.cos(a) * r, cy + Math.sin(a) * r)}M${P(cx + Math.cos(a) * r - 2, cy + Math.sin(a) * r + 2)}h4v4h-4z`; }
    return d;
  },
  coaster(x0, x1, base) {
    const m = (x0 + x1) / 2;
    let d = `M${x0} ${base - 10}C${P(x0 + 30, base - 100, x0 + 60, base - 100, x0 + 80, base - 30)}C${P(x0 + 90, base, m - 30, base - 10, m - 10, base - 40)}a26 26 0 1 1 20 30C${P(m + 40, base, x1 - 40, base - 70, x1, base - 20)}`;
    for (let x = x0 + 10; x < x1; x += 18) d += `M${x} ${base}v-12`;
    return d;
  },
  sun(cx, cy, r) { return `M${P(cx - r, cy)}a${P(r, r)} 0 1 0 ${r1(2 * r)} 0a${P(r, r)} 0 1 0 ${r1(-2 * r)} 0`; },
  crescent(cx, cy, r) { return `M${P(cx + r * .2, cy - r)}a${P(r, r)} 0 1 0 0 ${r1(2 * r)}a${P(r * .78, r * .78)} 0 1 1 0 ${r1(-2 * r)}`; },
  /** Fog bands: long horizontal strokes of varied length. */
  fog(seed, y0 = 60, n = 6) {
    const R = rng(seed + 'fog'); let d = '';
    for (let i = 0; i < n; i++) { const y = y0 + i * 9, x = R() * 160 - 40; d += `M${r1(x)} ${y}h${r1(140 + R() * 200)}`; }
    return d;
  },
  /** Rolling hills with field furrows. */
  hills(seed, base = 175, n = 3) {
    const R = rng(seed + 'hil'); let d = '';
    for (let i = 0; i < n; i++) {
      const y = base - 18 - i * 16, ph = R() * 200;
      d += `M-10 ${base}`;
      for (let x = -10; x <= W + 10; x += 30) d += `L${x} ${r1(y + 10 * Math.sin((x + ph) / 60) + 6 * Math.sin((x + ph) / 23))}`;
    }
    return d;
  },
  /** Orchard / vineyard rows in perspective. */
  rows(cx = W / 2, base = H, hz = 130, n = 14) {
    let d = `M0 ${hz}H${W}`;
    for (let i = -n; i <= n; i++) d += `M${r1(cx + i * 4)} ${hz}L${r1(cx + i * 46)} ${base}`;
    return d;
  },
  /** A conical-hat silhouette row (generic, the woven leaf hat seen across the region's markets). */
  hats(x0, x1, base, n = 4) {
    let d = ''; const s = (x1 - x0) / n;
    for (let i = 0; i < n; i++) { const cx = x0 + s * (i + .5); d += `M${P(cx - 20, base)}L${P(cx, base - 18)}L${P(cx + 20, base)}Q${P(cx, base + 4, cx - 20, base)}M${P(cx - 10, base - 9)}h20`; }
    return d;
  },
  boat(cx, base, s = 1) {
    return `M${P(cx - 36 * s, base - 8 * s)}Q${P(cx, base + 6 * s, cx + 36 * s, base - 8 * s)}M${P(cx - 36 * s, base - 8 * s)}l${P(6 * s, 8 * s)}M${P(cx - 16 * s, base - 4 * s)}V${r1(base - 16 * s)}Q${P(cx, base - 26 * s, cx + 16 * s, base - 16 * s)}V${r1(base - 3 * s)}M${P(cx + 22 * s, base - 10 * s)}l${P(18 * s, -40 * s)}`;
  },
  /** Rice terraces: nested curved steps down a hill. */
  terraces(seed, base = 190) {
    const R = rng(seed + 'ter'); let d = '';
    for (let i = 0; i < 9; i++) { const y = 60 + i * 15, ph = R() * 40; d += `M-10 ${y}C${P(80 + ph, y - 18, 180 - ph, y + 16, 260, y)}S${P(420 + ph, y - 14, W + 10, y + 4)}`; }
    return d;
  },
  /** Generic leaf sprig (outdoors / garden collections). */
  leaf(cx, cy, s = 1, a = 0) {
    const c = Math.cos(a), si = Math.sin(a), T = (x, y) => P(cx + (x * c - y * si) * s, cy + (x * si + y * c) * s);
    return `M${T(0, 0)}Q${T(14, -14)} ${T(36, 0)}Q${T(14, 14)} ${T(0, 0)}M${T(0, 0)}L${T(30, 0)}M${T(10, 0)}l${P(4 * s * c - (-4) * s * si, 4 * s * si + (-4) * s * c)}M${T(20, 0)}l${P(4 * s * c - (-4) * s * si, 4 * s * si + (-4) * s * c)}`;
  },
  /** Maple-ish five-point leaf. */
  maple(cx, cy, s = 1) {
    const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = (i % 2 ? 6 : 15) * s; pts.push(P(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr)); }
    return `M${pts.join('L')}ZM${P(cx, cy)}v${r1(14 * s)}`;
  },
  /** Hibiscus-like five-petal flower (generic tropical bloom). */
  flower(cx, cy, s = 1) {
    let d = '';
    for (let i = 0; i < 5; i++) { const a = i * 2 * Math.PI / 5 - Math.PI / 2, x = cx + Math.cos(a) * 11 * s, y = cy + Math.sin(a) * 11 * s; d += `M${P(cx, cy)}Q${P(x + Math.cos(a + 1.2) * 9 * s, y + Math.sin(a + 1.2) * 9 * s, x, y)}Q${P(x + Math.cos(a - 1.2) * 9 * s, y + Math.sin(a - 1.2) * 9 * s, cx, cy)}`; }
    return d + `M${P(cx, cy)}l${P(8 * s, -12 * s)}`;
  },
  /** Onion domes + minaret (generic, the region's mosque roofline). */
  domes(x0, base, s = 1) {
    return `M${P(x0, base)}h${r1(90 * s)}M${P(x0 + 10 * s, base)}v${r1(-26 * s)}h${r1(50 * s)}v${r1(26 * s)}M${P(x0 + 14 * s, base - 26 * s)}Q${P(x0 + 14 * s, base - 54 * s, x0 + 35 * s, base - 62 * s)}Q${P(x0 + 56 * s, base - 54 * s, x0 + 56 * s, base - 26 * s)}M${P(x0 + 35 * s, base - 62 * s)}v${r1(-8 * s)}M${P(x0 + 72 * s, base)}v${r1(-74 * s)}h${r1(8 * s)}v${r1(74 * s)}M${P(x0 + 70 * s, base - 74 * s)}l${P(6 * s, -10 * s)}l${P(6 * s, 10 * s)}M${P(x0 + 70 * s, base - 50 * s)}h${r1(12 * s)}`;
  },
  /** Stepped temple tower (generic gopuram silhouette). */
  gopuram(cx, base, s = 1) {
    let d = '', y = base, w = 40 * s;
    for (let i = 0; i < 6; i++) { d += `M${P(cx - w, y)}V${r1(y - 12 * s)}H${r1(cx + w)}V${r1(y)}`; for (let x = cx - w + 6 * s; x < cx + w; x += 9 * s) d += `M${P(x, y - 3 * s)}v${r1(-6 * s)}`; y -= 12 * s; w -= 5.5 * s; }
    return d + `M${P(cx - w - 4 * s, y)}Q${P(cx, y - 18 * s, cx + w + 4 * s, y)}M${P(cx, y - 9 * s)}v${r1(-8 * s)}M${P(cx - 50 * s, base)}H${r1(cx + 50 * s)}`;
  },
  /** A generic rainforest canopy (trunks + rounded crowns). */
  canopy(seed, base = 170) {
    const R = rng(seed + 'can'); let d = '';
    for (let x = -10; x < W + 20; x += 26 + R() * 20) { const h = 60 + R() * 70, r = 18 + R() * 14; d += `M${r1(x)} ${base}V${r1(base - h)}M${r1(x - r)} ${r1(base - h + 6)}Q${P(x - r * .5, base - h - r * .9, x, base - h - r * .4)}Q${P(x + r * .5, base - h - r * .9, x + r, base - h + 6)}`; }
    return d + `M-10 ${base}H${W + 10}`;
  },
  /** A rail/streetcar line on a viaduct (generic). */
  viaduct(x0, x1, deck, h = 30) {
    let d = `M${x0} ${deck}H${x1}M${x0} ${deck - 4}H${x1}`;
    for (let x = x0 + 10; x < x1; x += 34) d += `M${x} ${deck}v${h}M${x + 24} ${deck}v${h}M${x} ${deck + 10}Q${x + 12} ${deck - 2} ${x + 24} ${deck + 10}`;
    return d;
  },
  /** Seeded street grid fragment seen from above + a river cut. */
  plan(seed) {
    const R = rng(seed + 'pl'); let d = '';
    for (let x = 10; x < W; x += 18 + R() * 14) d += `M${r1(x)} 0V${H}`;
    for (let y = 8; y < H; y += 14 + R() * 12) d += `M0 ${r1(y)}H${W}`;
    return d;
  },
  river(seed, w = 22) {
    const R = rng(seed + 'rv'), a = R() * 40, b = R() * 40;
    const c = (o) => `M-10 ${r1(40 + a + o)}C${P(120, 10 + b + o, 220, 190 - a + o, 330, 120 + o)}S${P(440, 60 + o, W + 10, 90 + b + o)}`;
    return c(0) + c(w);
  },
  starburst(cx, cy, r, n = 8) {
    let d = '';
    for (let i = 0; i < n; i++) { const a = i * Math.PI / n * 2; d += `M${P(cx + Math.cos(a) * r * .35, cy + Math.sin(a) * r * .35)}L${P(cx + Math.cos(a) * r, cy + Math.sin(a) * r)}`; }
    return d;
  },
  /** Speech balloon + motion lines (pop culture / comics, generic). */
  balloon(cx, cy, s = 1) {
    return `M${P(cx - 40 * s, cy)}a${P(40 * s, 26 * s)} 0 1 1 ${r1(30 * s)} ${r1(24 * s)}l${P(-18 * s, 16 * s)}l${P(4 * s, -18 * s)}a${P(40 * s, 26 * s)} 0 0 1 ${r1(-16 * s)} ${r1(-22 * s)}M${P(cx - 20 * s, cy - 4 * s)}h${r1(40 * s)}M${P(cx - 14 * s, cy + 6 * s)}h${r1(28 * s)}`;
  },
  /** Bowl with chopsticks and steam (food, generic). */
  bowl(cx, base, s = 1) {
    return `M${P(cx - 40 * s, base - 30 * s)}H${r1(cx + 40 * s)}A${P(40 * s, 30 * s)} 0 0 1 ${P(cx - 40 * s, base - 30 * s)}ZM${P(cx - 14 * s, base)}h${r1(28 * s)}M${P(cx + 10 * s, base - 34 * s)}L${P(cx + 46 * s, base - 76 * s)}M${P(cx + 18 * s, base - 34 * s)}L${P(cx + 54 * s, base - 72 * s)}M${P(cx - 20 * s, base - 40 * s)}q${P(-8 * s, -10 * s, 0, -20 * s)}t${P(0, -20 * s)}M${P(cx - 4 * s, base - 40 * s)}q${P(-8 * s, -10 * s, 0, -20 * s)}t${P(0, -20 * s)}`;
  },
  /** Picture frame + easel (art). */
  frame(cx, base, s = 1) {
    return `M${P(cx - 34 * s, base - 100 * s)}h${r1(68 * s)}v${r1(52 * s)}h${r1(-68 * s)}zM${P(cx - 28 * s, base - 94 * s)}h${r1(56 * s)}v${r1(40 * s)}h${r1(-56 * s)}zM${P(cx - 22 * s, base - 60 * s)}l${P(14 * s, -18 * s)}l${P(10 * s, 10 * s)}l${P(8 * s, -8 * s)}l${P(12 * s, 16 * s)}M${P(cx - 20 * s, base)}L${P(cx - 4 * s, base - 48 * s)}M${P(cx + 20 * s, base)}L${P(cx + 4 * s, base - 48 * s)}M${P(cx, base - 48 * s)}V${r1(base - 8 * s)}`;
  },
  /** Awning stripes over a stall (markets). */
  awning(x0, x1, y, n = 8) {
    let d = `M${x0} ${y}H${x1}`; const s = (x1 - x0) / n;
    for (let i = 0; i < n; i++) d += `M${r1(x0 + i * s)} ${y}v18a${r1(s / 2)} ${r1(s / 3)} 0 0 0 ${r1(s)} 0V${y}`;
    return d + `M${x0 + 4} ${y + 18}v60M${x1 - 4} ${y + 18}v60M${x0 - 10} ${y + 78}H${x1 + 10}`;
  },
  /** Steam curls (onsen). */
  steam(x0, x1, base) { let d = ''; for (let x = x0; x < x1; x += 24) d += `M${x} ${base}q-10 -14 0 -28t0 -28`; return d; },
  ticket(cx, cy, s = 1) {
    return `M${P(cx - 40 * s, cy - 20 * s)}h${r1(80 * s)}v${r1(14 * s)}a${P(6 * s, 6 * s)} 0 0 0 0 ${r1(12 * s)}v${r1(14 * s)}h${r1(-80 * s)}v${r1(-14 * s)}a${P(6 * s, 6 * s)} 0 0 0 0 ${r1(-12 * s)}zM${P(cx + 16 * s, cy - 20 * s)}v${r1(40 * s)}`;
  },
  compass(cx, cy, r) { return art.sun(cx, cy, r) + `M${P(cx, cy - r * .8)}L${P(cx + r * .2, cy)}L${P(cx, cy + r * .8)}L${P(cx - r * .2, cy)}Z` + art.starburst(cx, cy, r * 1.25, 16).replace(/M/g, 'M'); },
};

module.exports = { W, H, rng, tile, pat, art, r1, P };
