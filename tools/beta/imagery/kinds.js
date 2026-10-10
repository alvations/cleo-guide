'use strict';
/**
 * imagery/kinds.js — ORIGINAL cover motifs, one per place KIND (the card's data-gl glyph key), for the Gallery covers
 * (designer + imagery lane, ROUND-3 gap #3). Output: beta/assets/img/motifs/kinds/<gl>.svg
 *
 * What a kind motif is: a 96 × 72 line drawing of a GENERIC subject — "a shrine gate", "a noodle bowl", "a museum
 * portico" — never a particular venue, so it can never be read as a picture of the place on the card. The files are
 * single-colour (black strokes, a few translucent fills) because CSS uses them as masks: the cover paints them in the
 * area colour mixed by tier (design/beta/css/views.css § V10), so one file serves every city, skin and theme.
 * build-css.py writes one `[data-gl=<gl>]` rule per file it finds here.
 */
const S = (d, extra = '') => `<path d="${d}"/>${extra}`;
const F = (d, o = .22) => `<path d="${d}" fill="#000" fill-opacity="${o}" stroke="none"/>`;
const C = (cx, cy, r, o) => `<circle cx="${cx}" cy="${cy}" r="${r}"${o != null ? ` fill="#000" fill-opacity="${o}"` : ''}/>`;
const STEAM = (xs, y = 20) => xs.map(x => `M${x} ${y}c-4-4 4-7 0-11`).join('');

// [subject words (for <desc>), body]
const KINDS = {
  forkknife: ['a plate with a fork and a knife', C(48, 38, 22) + C(48, 38, 14) + F('M48 24a14 14 0 1 0 .1 0Z', .12) + S('M12 12v14M16 12v14M20 12v14M12 26q4 6 8 0M16 30v32M80 12v50M80 12c7 5 7 18 0 22')],
  columns: ['a classical portico with a pediment', S('M14 26L48 8l34 18ZM18 30h60M24 32v26M36 32v26M60 32v26M72 32v26M16 60h64M10 66h76') + C(48, 19, 3) + F('M14 26L48 8l34 18Z', .14)],
  compass: ['a compass rose', C(48, 36, 25) + C(48, 36, 18) + S('M48 6v5M48 61v5M18 36h5M73 36h5') + S('M48 15l6 21-6 21-6-21Z') + F('M48 15l6 21H42Z', .5)],
  castle: ['a walled keep with two towers', S('M8 64h80M14 64V28h18v36M64 64V28h18v36M32 64V22h32v42M14 28v-6h4v4h5v-4h4v4h5v-6M64 28v-6h4v4h5v-4h4v4h5v-6M32 22v-6h5v4h6v-4h6v4h6v-4h4v6M42 64V54a6 6 0 0 1 12 0v10M20 38h6M70 38h6') + F('M32 22h32v42H32Z', .12)],
  leaf: ['a round tree and a conifer on a low hill', C(30, 28, 15) + S('M30 62V34M30 40l-6-6M30 37l6-5M64 16L52 36h7L49 50h30L69 36h7ZM64 50v12M6 62c22-7 62-7 84 0') + F('M30 13a15 15 0 1 0 .1 0Z', .16) + F('M64 16L52 36h7L49 50h30L69 36h7Z', .26)],
  sandwich: ['a filled sandwich roll', S('M12 36c4-17 68-17 72 0ZM10 41c6 5 10-4 16 0s10-4 16 0 10-4 16 0 10-4 16 0 10-4 12 0M12 46h72M12 50h72c0 8-6 12-12 12H24c-6 0-12-4-12-12ZM30 26l2-2M46 23l2 1M62 26l2-1') + F('M12 36c4-17 68-17 72 0Z', .14)],
  bottle: ['a bottle and a foaming glass', S('M26 62V36c0-6 6-8 6-14V10h8v12c0 6 6 8 6 14v26ZM26 42h20v12H26ZM58 28h22l-3 34H61ZM58 28c2-5 6-5 8-2 2-4 8-4 10 0 2-2 4 0 4 2') + C(68, 44, 1.6) + C(72, 52, 1.2) + F('M59.5 38h19L77 62H61Z', .2)],
  cloche: ['a domed cloche on a plate', S('M18 52a30 30 0 0 1 60 0ZM10 56h76M18 61h60M74 10v8M70 14h8M28 40c2-6 6-10 12-12') + C(48, 19, 3)],
  torii: ['a shrine gate', S('M14 14c12 5 56 5 68 0M18 20c12 3 48 3 60 0M30 21v42M66 21v42M22 30h52M48 21v9M8 63h80') + F('M14 14c12 5 56 5 68 0l-4 6c-12 3-48 3-60 0Z', .3)],
  awning: ['a shopfront under a scalloped awning', S('M12 16h72v12H12ZM12 28a6 6 0 0 0 12 0a6 6 0 0 0 12 0a6 6 0 0 0 12 0a6 6 0 0 0 12 0a6 6 0 0 0 12 0a6 6 0 0 0 12 0M16 34v28h64V34M42 44h12v18H42ZM22 42h14v10H22ZM60 42h14v10H60ZM8 62h80') + F('M24 16h12v12H24ZM48 16h12v12H48ZM72 16h12v12H72Z', .3)],
  dumpling: ['a pleated dumpling with steam', S('M12 54c0-18 16-28 36-28s36 10 36 28ZM8 58h80M30 30c3 4 3 8 0 12M40 27c3 5 3 9 0 14M52 27c3 5 3 9 0 14M62 30c3 4 3 8 0 12' + STEAM([38, 50, 62], 20)) + F('M12 54c0-18 16-28 36-28s36 10 36 28Z', .12)],
  cup: ['a cup and saucer with steam', S('M24 30h40v14c0 10-8 16-20 16s-20-6-20-16ZM64 34c9 0 9 12 0 12M14 62c12 4 48 4 60 0' + STEAM([38, 50], 24)) + F('M24 30h40v6H24Z', .3)],
  flame: ['flames over a grill', S('M48 42c-11-4-11-17 0-30 2 9 11 11 9 21-1 5-4 8-9 9ZM28 42c-6-3-6-11 0-17 1 5 6 7 4 12-1 3-2 4-4 5ZM68 42c-6-3-6-11 0-17 1 5 6 7 4 12-1 3-2 4-4 5ZM12 46h72M16 52h64M26 52l-6 12M70 52l6 12') + F('M48 42c-11-4-11-17 0-30 2 9 11 11 9 21-1 5-4 8-9 9Z', .3)],
  noodles: ['a noodle bowl with chopsticks', S('M12 36h72c0 16-14 26-36 26S12 52 12 36ZM38 62h20M22 36c2-6 6-6 8 0s6 6 8 0 6-6 8 0 6 6 8 0 6-6 8 0M58 6L38 33M68 9L46 35' + STEAM([24, 32], 26)) + F('M12 36h72c0 16-14 26-36 26S12 52 12 36Z', .14)],
  globe: ['a globe on a stand', C(48, 34, 22) + S('M48 12c-12 8-12 36 0 44M48 12c12 8 12 36 0 44M26 34h44M30 22h36M30 46h36M18 34a30 30 0 0 0 52 20M48 60v5M38 66h20') + F('M30 22h36a22 22 0 0 0-36 0Z', .14)],
  mountain: ['a snow-capped ridge and a sun', S('M4 62L34 20l12 16 10-12 34 38ZM8 66h80') + F('M28 29l6-9 7 10-4-2-3 3-3-3Z', .5) + C(76, 16, 6) + F('M4 62L34 20l12 16 10-12 34 38Z', .1)],
  cake: ['a layered cake with a candle', S('M18 34h60v26H18ZM18 44h60M18 52h60M18 34c4 6 8 6 10 0 4 6 8 6 10 0 4 6 8 6 10 0 4 6 8 6 10 0 4 6 8 6 10 0 4 6 8 6 10 0M48 34V22M48 19c-3-3 0-8 0-8s3 5 0 8ZM10 62h76') + F('M18 44h60v8H18Z', .25)],
  bubble: ['a speech bubble with a star', S('M14 12h68a6 6 0 0 1 6 6v26a6 6 0 0 1-6 6H40l-12 10V50H14a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6ZM48 20l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1ZM72 60h14M78 66h10') + F('M48 20l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z', .4)],
  dango: ['three dumplings on a skewer', S('M18 66L80 6') + C(33, 51, 10, .1) + C(48, 36, 10, .22) + C(63, 21, 10, .36) + C(33, 51, 10) + C(48, 36, 10) + C(63, 21, 10)],
  bowl: ['a rice bowl with chopsticks', S('M14 38h68c0 14-12 24-34 24S14 52 14 38ZM40 62h16M22 38c4-12 48-12 52 0M8 30l78-8M10 34l76-8M34 32h2M46 30h2M58 31h2') + F('M22 38c4-12 48-12 52 0Z', .14)],
  tower: ['a lattice observation tower', S('M34 66L45 12h6l11 54M38 48h20M41 34h14M43 22h10M38 48l17-14M58 48L41 34M41 34l12-12M55 34L43 22M36 28h24M48 12V4M28 66h40')],
  sushi: ['two pieces of nigiri on a board', S('M10 44h30a6 6 0 0 1 0 12H10a6 6 0 0 1 0-12ZM8 46c4-11 32-11 36 0M18 39l3 4M26 38l3 4M34 39l3 4M54 44h30a6 6 0 0 1 0 12H54a6 6 0 0 1 0-12ZM52 46c4-11 32-11 36 0M66 38v18M72 38v18M4 62h88') + F('M8 46c4-11 32-11 36 0Z', .3)],
  fish: ['a fish over water', S('M12 34c12-16 44-16 56 0-12 16-44 16-56 0ZM68 34l16-12v24ZM34 26c3 5 3 11 0 16M44 30a4 4 0 0 1 4 4M52 30a4 4 0 0 1 4 4M8 62c8-3 12 3 20 0s12 3 20 0 12 3 20 0 12 3 20 0') + C(24, 31, 2) + F('M12 34c12-16 44-16 56 0Z', .14)],
  lantern: ['a hanging paper lantern', S('M48 2v10M38 12h20v4H38ZM30 16h36c6 6 8 12 8 18s-2 12-8 18H30c-6-6-8-12-8-18s2-12 8-18ZM23 28h50M22 36h52M25 44h46M38 52h20v4H38ZM48 56v10M44 66h8') + F('M30 16h36c6 6 8 12 8 18H22c0-6 2-12 8-18Z', .2)],
  ticket: ['a torn ticket with a star', S('M12 20h72v10a6 6 0 0 0 0 12v10H12V42a6 6 0 0 0 0-12ZM64 22v4M64 30v4M64 38v4M64 46v4M24 30h28M24 38h20M24 46h24M74 32l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5Z') + F('M64 20h20v10a6 6 0 0 0 0 12v10H64Z', .16)],
  moon: ['a crescent moon over rooftops', S('M54 8a22 22 0 1 0 18 34 18 18 0 0 1-18-34ZM78 12v6M75 15h6M84 30v4M82 32h4M4 66V54h10v-6h10v18M30 66V50h12v16M48 66V56h8v-6h10v16M72 66V52h12v14M2 66h92') + F('M54 8a22 22 0 1 0 18 34 18 18 0 0 1-18-34Z', .3)],
  steam: ['a hot-spring bath with rising steam', S('M16 46c0-6 64-6 64 0 0 10-14 16-32 16S16 56 16 46ZM34 38c-6-6 6-10 0-18s4-12 0-16M48 38c-6-6 6-10 0-18s4-12 0-16M62 38c-6-6 6-10 0-18s4-12 0-16M8 66h80') + F('M16 46c0-6 64-6 64 0 0 10-14 16-32 16S16 56 16 46Z', .2)],
  tv: ['a television with a star on screen', S('M20 18h56a6 6 0 0 1 6 6v28a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6ZM38 6l10 12 10-12M34 64h28M48 58v6M48 28l2.5 5.5 6 .7-4.5 4 1.2 6-5.2-3-5.2 3 1.2-6-4.5-4 6-.7Z') + F('M20 18h56a6 6 0 0 1 6 6v28a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6Z', .1)],
};

const svg = (gl, [why, body]) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 72" width="96" height="72" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><title>${gl} — cover motif</title><desc>Original generic line art: ${why}. Not a depiction of any venue.</desc>${body}</svg>\n`;

function buildKinds() {
  const files = {};
  for (const [gl, k] of Object.entries(KINDS)) files[`assets/img/motifs/kinds/${gl}.svg`] = svg(gl, k);
  return files;
}

module.exports = { KINDS, buildKinds };
