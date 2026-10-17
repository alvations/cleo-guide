'use strict';
/**
 * imagery/motifs.js — ORIGINAL SVG motif art, one per city page, per country and per collection subject
 * (lane: imagery; ROUND-1 gap #1). Output: beta/assets/img/motifs/{<pageKey with / → -->,<countryKey>,collections/<kind|themeKey>}.svg
 * (the naming FE-B's render/hub.js looks up)
 *
 * What a motif is: a faint repeating ground (a <pattern>) + a line-art horizon + one accent stroke in the city's
 * skin colour. Subjects are GENERIC — "lake swell + a truss bridge", "wave scales + a skyline", "a shophouse
 * terrace" — never a drawing of a particular venue, so no motif can be mistaken for a photo of a place.
 *
 * Two tones per file family:
 *   <name>.svg      drawn for the NIGHT ground (tile art, mastheads) — cream lines; quieter under prefers-color-scheme: dark.
 *   <name>.ink.svg  drawn for the PAPER ground (rail covers, light cards) — ink lines; flips to cream under dark mode.
 * The accent comes from the designer's skin tokens (beta/assets/tokens.css), parsed at build time, so a skin
 * change re-colours the art with no edit here.
 */
const fs = require('fs');
const path = require('path');
const { W, H, tile: T, pat, art: A, rng } = require('./draw');

// ---------------------------------------------------------------- recipes (city page key → composition)
// Each returns { t: [tileName, ...args], g?: seeded ground d, l: line art d, a?: accent stroke d, f?: accent fill d, why }.
// `why` is the plain-language subject list, written into the SVG <desc> and the motif index.
const RECIPES = {
  tokyo: () => ({ t: ['seigaiha', 16], l: A.skyline('tokyo', { x0: 150, x1: 480, base: 168, min: 26, max: 104, spire: .3 }) + A.water(176, { x0: 120 }), a: A.torii(80, 170, 1.15), f: A.sun(390, 46, 18), why: 'wave-scale ground, a generic high-rise skyline, a shrine gate, a rising sun' }),
  kyoto: () => ({ t: ['hexes', 12], l: A.ridge('kyoto', { base: 176, amp: 60, step: 22 }) + A.ridge('kyoto2', { base: 182, amp: 30, step: 30 }), a: A.pagoda(330, 182, 1.25), f: A.maple(110, 64, 1.3) + A.maple(146, 92, .8), why: 'tortoise-shell ground, layered hills, a five-storey pagoda, maple leaves' }),
  osaka: () => ({ t: ['dots', 12], l: A.skyline('osaka', { x0: 0, x1: 300, base: 170, min: 18, max: 80 }) + A.water(178) + A.lanterns(40, 300, 40, 8), a: A.wheel(390, 96, 54), why: 'neon-dot ground, a canal-side skyline, a lantern string, a Ferris wheel' }),
  okinawa: () => ({ t: ['waves', 12, 3, 40], l: A.water(160, { n: 4, gap: 9 }) + A.palm(70, 156, 1.1, 10) + A.palm(104, 158, .8, -6), a: A.flower(330, 70, 2.2) + A.flower(400, 112, 1.3), f: A.sun(250, 120, 22), why: 'reef-wave ground, the sea, palms, a hibiscus bloom, a low sun' }),
  hokkaido: () => ({ t: ['cross', 18], g: pat.snow(40, 'hokkaido'), l: A.ridge('hokkaido', { base: 174, amp: 92, step: 26, snow: true }), a: A.cone(330, 176, 110, 104), why: 'snow-crystal ground, a snow-capped ridge, a lone volcanic cone' }),

  cleveland: () => ({ t: ['waves', 10, 2, 60], l: A.swell(148, 5) + A.skyline('cleveland', { x0: 250, x1: 470, base: 128, min: 14, max: 70, spire: .2 }), a: A.bridgeTruss(30, 230, 120, 22), why: 'lake-swell ground and rollers, a truss bridge line, a lakefront skyline' }),
  pittsburgh: () => ({ t: ['diag', 16], l: A.river('pittsburgh', 18) + A.hills('pittsburgh', 196, 2), a: A.bridgeArch(70, 210, 120, 34, 11) + A.bridgeArch(290, 420, 132, 28, 9), why: 'hillside ground, two converging rivers, two steel arch bridges' }),
  newyork: () => ({ t: ['grid', 20], l: A.skyline('newyork', { x0: 0, x1: 480, base: 176, min: 30, max: 150, spire: .35, wmin: 8, wmax: 22 }) + A.water(184), a: A.bridgeSusp(0, 200, 160, 70), why: 'street-grid ground, a dense generic skyline, a suspension bridge' }),
  chicago: () => ({ t: ['grid', 28], l: A.skyline('chicago', { x0: 140, x1: 480, base: 150, min: 30, max: 128, spire: .2, wmin: 12, wmax: 30 }) + A.swell(160, 4), a: 'M0 132H140M0 140H140' + A.water(130, { x0: 0, x1: 140, n: 1 }), why: 'grid ground, a tall lakefront skyline, a river walk, lake rollers' }),
  sanfrancisco: () => ({ t: ['waves', 16, 3, 70], g: A.fog('sf', 48, 7), l: A.hills('sanfrancisco', 192, 3) + A.water(180), a: A.bridgeSusp(140, 470, 150, 82), why: 'fog bands over the bay, rolling hills, a suspension bridge' }),
  siliconvalley: () => ({ t: ['dots', 14], g: pat.circuit('siliconvalley', 22), l: A.rows(240, 200, 140, 12) + A.hills('sv', 140, 2), a: A.sun(380, 70, 26), why: 'circuit-trace ground, orchard rows in perspective, foothills, a valley sun' }),
  philadelphia: () => ({ t: ['brick', 26, 11], l: A.portico(130, 170, 1.05, 8) + A.river('philadelphia', 10), a: A.bridgeSusp(250, 480, 160, 56), why: 'brick-bond ground, a classical portico, a river, a suspension bridge' }),
  washingtondc: () => ({ t: ['diag', 18], l: A.dome(150, 168, 1.25) + 'M300 168L318 40L336 168' + A.water(176), a: 'M318 40v-8', f: A.sun(420, 52, 14), why: 'avenue-diagonal ground, a generic domed capitol, an obelisk, a reflecting pool' }),
  miami: () => ({ t: ['chevron', 14, 6], l: A.water(166, { n: 4, gap: 8 }) + A.palm(60, 160, 1.2, 14) + A.palm(100, 162, .9, -8) + A.blocks('miami', 200, 470, 150, 90), a: A.sun(360, 150, 46).replace(/a46 46 0 1 0 -92 0/, ''), why: 'deco-chevron ground, palms, beachfront towers, a setting sun on the sea' }),
  orlando: () => ({ t: ['dots', 18], l: A.coaster(20, 300, 172) + A.palm(400, 172, .9, 8), a: A.starburst(390, 60, 34, 12) + A.starburst(320, 40, 16, 8), why: 'confetti-dot ground, a roller-coaster loop, a palm, fireworks' }),
  cincinnati: () => ({ t: ['waves', 14, 3, 56], l: A.hills('cincinnati', 140, 2) + A.skyline('cincinnati', { x0: 180, x1: 470, base: 140, min: 14, max: 64 }) + A.water(150), a: A.bridgeSusp(0, 240, 150, 50), why: 'river-wave ground, hills, a river skyline, a suspension bridge' }),
  columbus: () => ({ t: ['grid', 22], l: A.skyline('columbus', { x0: 160, x1: 460, base: 160, min: 20, max: 90 }) + A.water(168), a: A.bridgeArch(20, 160, 160, 18, 8), why: 'grid ground, a riverfront skyline, a low arch bridge' }),
  dayton: () => ({ t: ['diag', 16], g: A.fog('dayton', 40, 4), l: A.hills('dayton', 190, 2), a: 'M120 90l70 -10l16 6l60 4l-60 6l-16 6zM170 82l18 -26h10l-6 26M172 98l20 22h10l-8 -20M236 88l10 -14h6l-4 14', why: 'flight-path ground, cloud bands, farmland, a generic early biplane' }),
  akron: () => ({ t: ['petals', 24], l: A.hills('akron', 190, 2) + A.stacks('akron', 40, 260, 170, 70), a: 'M330 60a40 26 0 1 0 80 0a40 26 0 1 0 -80 0M332 60h76M340 86l12 18h36l12 -18', why: 'tyre-tread ground, factory stacks, hills, a generic airship' }),
  youngstown: () => ({ t: ['brick', 24, 10], l: A.stacks('youngstown', 0, 480, 176, 110), a: A.water(184, { n: 2 }), why: 'brick ground, steel-mill stacks and sheds, the river' }),
  wheeling: () => ({ t: ['diag', 14], l: A.hills('wheeling', 150, 3) + A.water(170), a: A.bridgeSusp(40, 440, 160, 60), why: 'hill-hatch ground, Appalachian hills, a river, a long suspension bridge' }),
  erie: () => ({ t: ['waves', 12, 3, 44], l: A.swell(150, 4), a: A.lighthouse(360, 150, 1.4), f: A.sun(110, 70, 16), why: 'lake-wave ground, rollers, a lighthouse, a low sun' }),
  harrisburg: () => ({ t: ['diag', 20], l: A.dome(320, 160, 1.15) + A.water(170) + A.hills('harrisburg', 150, 1), a: A.viaduct(0, 200, 150, 22), why: 'diagonal ground, a domed capitol, a river, a stone-arch rail viaduct' }),
  statecollege: () => ({ t: ['grid', 26], l: A.ridge('statecollege', { base: 160, amp: 40, step: 34 }) + A.hills('statecollege', 196, 2), a: A.portico(320, 192, .9, 6), why: 'campus-grid ground, a long ridge, farmland, a classical college portico' }),
  indianapolis: () => ({ t: ['chevron', 16, 6], l: A.skyline('indianapolis', { x0: 200, x1: 470, base: 160, min: 20, max: 80 }), a: 'M20 150c60 -40 140 -40 200 0s-140 40 -200 0zM40 150c50 -28 110 -28 160 0', why: 'checkered-flag ground, a downtown skyline, an oval race track' }),
  madison: () => ({ t: ['waves', 14, 3, 52], l: A.water(166, { n: 3 }) + A.dome(240, 120, 1.05) + A.skyline('madison', { x0: 300, x1: 400, base: 120, min: 10, max: 30 }), a: 'M0 140c80 -20 140 -20 180 -20M300 120c80 0 140 0 180 20', why: 'lake-wave ground, two lakes, a domed capitol on the isthmus' }),
  rhineland: () => ({ t: ['waves', 12, 2, 60], l: A.ridge('rhineland', { base: 150, amp: 60, step: 22 }) + A.water(172, { n: 3 }), a: A.spires('rhine', 300, 380, 150, 70) + A.boat(110, 172, 1), why: 'river-wave ground, vineyard slopes, a castle silhouette, a river boat' }),
  saarland: () => ({ t: ['brick', 22, 10], l: A.stacks('saarland', 260, 470, 170, 90) + A.hills('saarland', 190, 2), a: A.river('saarland', 14), why: 'brick ground, an ironworks skyline, a looping river, wooded hills' }),
  aachen: () => ({ t: ['hexes', 13], l: A.timber('aachen', 0, 260, 176, 70) + A.steam(300, 460, 176), a: A.spires('aachen', 280, 470, 140, 100), why: 'hex ground, half-timbered houses, thermal-spring steam, an old-town spire' }),
  antwerp: () => ({ t: ['diag', 14], l: A.spires('antwerp', 20, 200, 172, 150) + A.water(180) + 'M250 172V60H330M250 60l30 -20h80l-30 20M330 60v20M300 60V40M380 172V90h50M380 90l20 -14h50l-20 14M430 90v18', a: A.boat(330, 180, .9), why: 'cut-facet ground, a tall gothic spire, harbour cranes on the river, a barge' }),
  bruges: () => ({ t: ['brick', 20, 9], l: A.gables('bruges', 0, 480, 160, 70) + A.water(174, { n: 3 }), a: A.boat(240, 182, .9), why: 'brick ground, a stepped-gable terrace, a canal, a canal boat' }),
  brussels: () => ({ t: ['petals', 22], l: A.gables('brussels', 0, 200, 170, 80) + A.gables('brussels2', 300, 480, 170, 84), a: A.spires('brussels', 205, 295, 170, 140), why: 'flower-tile ground, ornate gabled guild houses around a square, a town-hall spire' }),
  ghent: () => ({ t: ['diag', 18], l: A.water(166, { n: 4 }) + A.bridgeArch(300, 440, 150, 14, 0), a: A.spires('ghent3', 40, 280, 150, 130), why: 'diagonal ground, three towers in a row above the river, a stone bridge' }),
  liege: () => ({ t: ['chevron', 14, 5], l: A.hills('liege', 120, 3) + A.timber('liege', 0, 220, 176, 60) + A.water(184), a: 'M260 176l40 -40l40 40M270 160h60M280 146h40', why: 'stair-step ground, steep hillside houses, the river, a long stairway' }),
};

// Singapore towns and SEA previews: one vocabulary, a distinct composition per page.
const SG = {
  chinatown: () => ({ t: ['petals', 22], l: A.shophouses('chinatown', 0, 480, 176, 64), a: A.lanterns(10, 470, 30, 9), why: 'encaustic-tile ground, a shophouse terrace, a lantern string' }),
  'little-india': () => ({ t: ['dots', 12], l: A.shophouses('littleindia', 0, 280, 176, 56), a: A.gopuram(380, 176, 1.1), why: 'kolam-dot ground, shophouses, a stepped temple tower' }),
  'kampong-glam': () => ({ t: ['hexes', 12], l: A.shophouses('kg', 0, 260, 176, 56), a: A.domes(320, 176, 1.3), why: 'geometric ground, shophouses, a domed roofline and minaret' }),
  'marina-bay': () => ({ t: ['waves', 12, 3, 48], l: A.skyline('marina', { x0: 60, x1: 470, base: 160, min: 30, max: 120, wmin: 10, wmax: 24 }) + A.water(170, { n: 3 }), a: A.wheel(60, 100, 42), why: 'bay-wave ground, a waterfront skyline, an observation wheel' }),
  'civic-district': () => ({ t: ['grid', 20], l: A.portico(140, 170, 1, 8) + A.skyline('civic', { x0: 260, x1: 470, base: 170, min: 40, max: 120 }), a: A.water(180, { n: 2 }), why: 'grid ground, a colonial portico, towers behind, the river' }),
  'katong-joo-chiat': () => ({ t: ['petals', 20], l: A.shophouses('katong', 0, 480, 172, 70), a: 'M0 186H480' + A.flower(420, 40, 1.4), why: 'tile ground, a pastel shophouse terrace, a bloom' }),
  'tiong-bahru': () => ({ t: ['chevron', 14, 5], l: A.blocks('tb', 20, 300, 170, 70), a: A.bowl(390, 172, .9), why: 'deco ground, low curved-corner flats, a market bowl' }),
  'holland-village': () => ({ t: ['dots', 16], l: A.shophouses('hv', 0, 300, 176, 52), a: A.awning(320, 460, 90, 6), why: 'dot ground, a row of low shops, a café awning' }),
  'dempsey-hill': () => ({ t: ['hexes', 14], l: A.canopy('dempsey', 176), a: 'M120 176v-40h120v40M110 136l70 -26l70 26', why: 'leaf ground, rainforest canopy, a colonial barrack roof' }),
  'southern-ridges': () => ({ t: ['diag', 16], l: A.canopy('sr', 186), a: 'M0 110c80 -30 160 30 240 0s160 -30 240 0', why: 'leaf ground, forest canopy, a wavy walkway above the trees' }),
  mandai: () => ({ t: ['hexes', 16], l: A.canopy('mandai', 184), a: A.leaf(380, 60, 2.2, -.5) + A.leaf(410, 90, 1.6, .4), why: 'leaf ground, rainforest canopy, broad leaves' }),
  changi: () => ({ t: ['waves', 12, 3, 44], l: A.water(160, { n: 4 }), a: 'M120 80l140 -20l20 8l-140 24zM230 64l-20 -20h14l40 18M200 86l-14 16h12l30 -18', why: 'wave ground, the sea, a passing aircraft' }),
  punggol: () => ({ t: ['waves', 14, 2, 56], l: A.blocks('punggol', 160, 470, 150, 100) + A.water(166, { n: 3 }), a: A.bridgeArch(10, 160, 150, 16, 7), why: 'waterway ground, new housing blocks, a footbridge over the waterway' }),
  'ang-mo-kio': () => ({ t: ['grid', 18], l: A.blocks('amk', 0, 480, 176, 110), a: A.awning(170, 310, 120, 6), why: 'grid ground, public-housing slabs, a neighbourhood hawker awning' }),
  bishan: () => ({ t: ['dots', 14], l: A.blocks('bishan', 220, 470, 150, 100) + A.water(172, { x0: 0, x1: 220 }), a: A.leaf(80, 110, 1.6, -.3) + A.leaf(120, 130, 1.2, .5), why: 'dot ground, housing blocks, a park river with leaves' }),
  'toa-payoh': () => ({ t: ['petals', 18], l: A.blocks('tp', 0, 480, 176, 100), a: 'M40 176c0 -30 40 -50 60 -30s30 -40 70 -20', why: 'tile ground, housing slabs, a playground-dragon curve' }),
  'upper-serangoon': () => ({ t: ['dots', 12], l: A.blocks('us', 0, 260, 176, 90) + A.shophouses('us', 260, 480, 176, 50), a: A.bowl(390, 110, .7), why: 'dot ground, blocks and shophouses, a steaming bowl' }),
  'potong-pasir-macpherson': () => ({ t: ['chevron', 14, 5], l: A.blocks('ppm', 0, 480, 176, 80), a: A.awning(40, 200, 110, 6), why: 'chevron ground, estate blocks, a hawker-centre awning' }),
  'newton-novena': () => ({ t: ['grid', 22], l: A.skyline('nn', { x0: 200, x1: 480, base: 172, min: 30, max: 100 }) + A.awning(20, 180, 100, 6), a: A.bowl(100, 90, .5), why: 'grid ground, towers, a hawker awning, a bowl' }),
  balestier: () => ({ t: ['petals', 20], l: A.shophouses('balestier', 0, 480, 176, 60), a: A.bowl(240, 70, .6), why: 'tile ground, a shophouse terrace, a bowl' }),
  'jalan-besar': () => ({ t: ['brick', 22, 10], l: A.shophouses('jb', 0, 480, 176, 66), a: 'M0 104H480', why: 'brick ground, a long shophouse street' }),
  geylang: () => ({ t: ['dots', 10], l: A.shophouses('geylang', 0, 480, 176, 58), a: A.lanterns(10, 470, 24, 6, 1.2), why: 'dot ground, shophouse lanes, lantern strings' }),
  queenstown: () => ({ t: ['grid', 16], l: A.blocks('queenstown', 0, 480, 176, 80), a: 'M200 176v-60h60v60', why: 'grid ground, early estate blocks, a neighbourhood cinema box' }),
  jurong: () => ({ t: ['hexes', 14], l: A.stacks('jurong', 260, 470, 176, 80), a: A.leaf(80, 100, 2, -.4) + A.flower(160, 90, 1.4), why: 'hex ground, an industrial edge, a garden of leaves and blooms' }),
  'marine-parade': () => ({ t: ['waves', 12, 3, 40], l: A.blocks('mp', 0, 300, 150, 90) + A.water(166, { n: 3 }), a: A.palm(400, 166, 1, 8), why: 'wave ground, seafront blocks, a palm on the shore' }),
  'old-airport-road': () => ({ t: ['dots', 14], l: A.blocks('oar', 0, 200, 176, 70) + A.awning(240, 460, 96, 8), a: 'M60 60l90 -12l14 6l-90 14z', why: 'dot ground, blocks, a big hawker awning, an old runway plane' }),
  'upper-thomson': () => ({ t: ['hexes', 14], l: A.canopy('ut', 176) + A.water(184, { n: 1 }), a: A.bowl(400, 120, .6), why: 'leaf ground, reservoir forest, a bowl' }),
  'bukit-timah': () => ({ t: ['diag', 16], l: A.ridge('bt', { base: 176, amp: 70, step: 20 }), a: A.leaf(380, 70, 2, .2), why: 'diagonal ground, a forested hill, a leaf' }),
  bedok: () => ({ t: ['waves', 14, 2, 50], l: A.blocks('bedok', 0, 480, 160, 80) + A.water(174), a: A.bowl(400, 80, .55), why: 'wave ground, housing blocks by the sea, a bowl' }),
};
const SEA = {
  bagan: () => ({ t: ['dots', 16], l: A.hills('bagan', 190, 2) + A.pagoda(120, 176, .7, 3) + A.pagoda(260, 180, .9, 3), a: 'M340 70a30 34 0 1 0 60 0a30 34 0 1 0 -60 0M352 104h36', why: 'dot ground, plains of stupas, a hot-air balloon' }),
  bali: () => ({ t: ['waves', 12, 3, 44], l: A.terraces('bali'), a: A.cone(380, 120, 70, 70), why: 'wave ground, rice terraces, a volcano' }),
  bangkok: () => ({ t: ['chevron', 14, 6], l: A.water(170, { n: 3 }) + A.skyline('bkk', { x0: 260, x1: 480, base: 160, min: 20, max: 100 }), a: A.boat(120, 172, 1.2) + A.pagoda(200, 160, .7, 4), why: 'chevron ground, a river, a long-tail boat, a temple spire, towers' }),
  cebu: () => ({ t: ['waves', 12, 3, 40], l: A.water(160, { n: 4 }) + A.palm(80, 156, 1, 10), a: A.boat(300, 160, 1.2), why: 'wave ground, a palm shore, an outrigger boat' }),
  'chiang-mai': () => ({ t: ['dots', 14], l: A.ridge('cm', { base: 176, amp: 60 }), a: A.lanterns(20, 460, 30, 6, 1.3) + A.pagoda(240, 176, .8, 4), why: 'dot ground, mountains, floating lanterns, a temple spire' }),
  hanoi: () => ({ t: ['petals', 20], l: A.shophouses('hanoi', 0, 300, 176, 80) + A.water(184), a: A.hats(320, 470, 170, 3), why: 'tile ground, narrow tube houses, a lake, woven hats' }),
  'hoi-an': () => ({ t: ['petals', 18], l: A.shophouses('hoian', 0, 480, 164, 56) + A.water(176), a: A.lanterns(10, 470, 30, 9, 1.1), why: 'tile ground, an old-town terrace on the river, a lantern string' }),
  ipoh: () => ({ t: ['diag', 16], l: A.ridge('ipoh', { base: 176, amp: 90, step: 14 }) + A.shophouses('ipoh', 260, 480, 176, 44), a: 'M60 70c10 -10 30 -10 40 0', why: 'diagonal ground, limestone hills, old shophouses' }),
  jakarta: () => ({ t: ['grid', 20], l: A.skyline('jakarta', { x0: 0, x1: 480, base: 170, min: 20, max: 110 }), a: A.water(178), why: 'grid ground, a dense skyline, the harbour' }),
  'kuala-lumpur': () => ({ t: ['hexes', 12], l: A.skyline('kl', { x0: 0, x1: 480, base: 176, min: 20, max: 120, spire: .4 }), a: A.domes(40, 176, 1), why: 'geometric ground, a spired skyline, a domed roofline' }),
  'luang-prabang': () => ({ t: ['dots', 14], l: A.ridge('lp', { base: 160, amp: 50 }) + A.water(172, { n: 3 }), a: A.boat(300, 172, 1.2) + A.pagoda(120, 160, .6, 3), why: 'dot ground, river and hills, a slow boat, a temple roof' }),
  malacca: () => ({ t: ['petals', 20], l: A.shophouses('malacca', 0, 480, 166, 60) + A.water(178), a: A.boat(380, 184, .8), why: 'tile ground, a riverside shophouse terrace, a river boat' }),
  manila: () => ({ t: ['grid', 20], l: A.skyline('manila', { x0: 160, x1: 480, base: 160, min: 20, max: 100 }) + A.water(170, { n: 3 }), a: A.sun(80, 120, 30), why: 'grid ground, a bayside skyline, a bay sunset' }),
  penang: () => ({ t: ['petals', 22], l: A.shophouses('penang', 0, 300, 176, 62) + A.ridge('penang', { x0: 300, base: 140, amp: 40 }), a: A.bowl(400, 176, .7), why: 'tile ground, heritage shophouses, a hill, a hawker bowl' }),
  'phnom-penh': () => ({ t: ['chevron', 14, 5], l: A.water(166, { n: 4 }), a: A.pagoda(240, 160, .8, 3) + A.boat(100, 170, .9), why: 'chevron ground, a river confluence, a temple roof, a boat' }),
  'siem-reap': () => ({ t: ['dots', 16], l: A.canopy('sr2', 180) + A.water(186, { n: 1 }), a: A.gopuram(240, 176, 1.3), why: 'dot ground, jungle canopy, a stepped temple tower, a moat' }),
  yangon: () => ({ t: ['dots', 12], l: A.hills('yangon', 190, 2) + A.water(184, { n: 1 }), a: A.pagoda(260, 180, 1.4, 6), why: 'dot ground, low hills, a tall stupa spire' }),
  yogyakarta: () => ({ t: ['dots', 14], l: A.terraces('yogya'), a: A.cone(360, 130, 70, 74) + A.gopuram(120, 176, .9), why: 'dot ground, terraces, a volcano, a stepped temple' }),
};
const VN = {
  'ho-chi-minh-city': () => ({ t: ['petals', 18], l: A.skyline('hcmc', { x0: 180, x1: 480, base: 160, min: 20, max: 110, spire: .3 }) + A.water(170, { n: 3 }), a: A.hats(10, 170, 160, 3) + A.boat(120, 182, .8), why: 'tile ground, a riverside skyline, woven hats, a river boat' }),
  hanoi: () => ({ t: ['dots', 14], l: A.shophouses('vnhanoi', 160, 480, 176, 84) + A.water(184), a: A.lanterns(0, 150, 30, 4, 1.2) + A.hats(10, 150, 170, 2), why: 'dot ground, narrow tube houses, lanterns, woven hats' }),
  'hoi-an': () => ({ t: ['chevron', 14, 5], l: A.shophouses('vnhoian', 0, 480, 160, 52) + A.water(172, { n: 3 }), a: A.lanterns(20, 460, 26, 7, 1.2) + A.boat(380, 184, .7), why: 'chevron ground, the old-town riverfront, lanterns, a boat' }),
};

const COUNTRIES = {
  us: () => ({ t: ['grid', 24], l: A.skyline('us-a', { x0: 0, x1: 170, base: 170, min: 20, max: 90 }) + A.bridgeTruss(170, 320, 150, 20) + A.ridge('us', { x0: 320, base: 170, amp: 50 }), a: A.sun(400, 60, 20), why: 'street-grid ground, a skyline, a truss bridge, mountains' }),
  japan: () => ({ t: ['seigaiha', 18], l: A.ridge('jp', { base: 176, amp: 40, step: 24 }) + A.water(184), a: A.cone(250, 176, 120, 110) + A.torii(420, 176, .9), f: A.sun(80, 60, 22), why: 'wave-scale ground, a volcanic cone, a shrine gate, a rising sun' }),
  singapore: () => ({ t: ['petals', 22], l: A.shophouses('sg-c', 0, 240, 176, 60) + A.skyline('sg-c', { x0: 240, x1: 480, base: 176, min: 40, max: 130 }), a: A.flower(420, 40, 1.6), why: 'tile ground, shophouses meeting towers, an orchid-like bloom' }),
  vietnam: () => ({ t: ['dots', 14], l: A.terraces('vn-c'), a: A.hats(40, 260, 176, 3) + A.boat(380, 176, 1.1), why: 'dot ground, terraces, woven hats, a river boat' }),
  germany: () => ({ t: ['hexes', 14], l: A.timber('de-c', 0, 260, 176, 70) + A.ridge('de-c', { x0: 260, base: 176, amp: 60 }), a: A.spires('de-c', 300, 440, 150, 90), why: 'hex ground, half-timbered houses, wooded hills, castle towers' }),
  belgium: () => ({ t: ['brick', 22, 10], l: A.gables('be-c', 0, 480, 166, 74) + A.water(176), a: A.spires('be-c', 200, 280, 166, 140), why: 'brick ground, a stepped-gable terrace, a belfry, a canal' }),
  malaysia: () => ({ t: ['hexes', 12], l: A.canopy('my-c', 176), a: A.domes(300, 176, 1.2), why: 'geometric ground, rainforest, a domed roofline' }),
  thailand: () => ({ t: ['chevron', 14, 6], l: A.water(170, { n: 3 }), a: A.pagoda(240, 166, 1, 4) + A.boat(100, 172, 1), why: 'chevron ground, a river, a temple spire, a boat' }),
  indonesia: () => ({ t: ['waves', 12, 3, 44], l: A.terraces('id-c'), a: A.cone(360, 120, 80, 80), why: 'wave ground, rice terraces, a volcano' }),
  philippines: () => ({ t: ['waves', 12, 3, 40], l: A.water(164, { n: 4 }) + A.palm(100, 160, 1.1, 10), a: A.boat(330, 164, 1.2), why: 'wave ground, a palm shore, an outrigger boat' }),
  indochina: () => ({ t: ['dots', 14], l: A.ridge('ic-c', { base: 166, amp: 50 }) + A.water(178, { n: 2 }), a: A.pagoda(240, 166, .9, 4), why: 'dot ground, river and hills, a temple roof' }),
};

// Collection subjects (rail covers, collection views). Keyed by SUBJECT, not by any place.
const COLLECTIONS = {
  food: () => ({ t: ['petals', 22], l: A.awning(40, 220, 60, 6), a: A.bowl(350, 170, 1.3), why: 'tile ground, a market awning, a bowl with chopsticks and steam' }),
  landmarks: () => ({ t: ['grid', 22], l: A.portico(140, 176, 1, 7) + A.spires('lm', 260, 470, 176, 120), a: A.starburst(420, 40, 18, 8), why: 'grid ground, a portico, towers and spires, a star' }),
  popculture: () => ({ t: ['dots', 10], l: A.skyline('pop', { x0: 240, x1: 480, base: 176, min: 20, max: 90 }), a: A.balloon(150, 90, 1.4) + 'M40 40l30 10M30 70l34 4M44 110l28 -6', why: 'halftone-dot ground, a speech balloon with motion lines, a skyline' }),
  outdoors: () => ({ t: ['diag', 16], l: A.ridge('out', { base: 170, amp: 80, step: 22, snow: true }) + A.hills('out', 196, 2), a: A.leaf(90, 60, 2.2, -.4) + A.leaf(130, 90, 1.4, .5), why: 'diagonal ground, peaks and hills, leaves' }),
  art: () => ({ t: ['cross', 20], l: A.portico(360, 176, .9, 6), a: A.frame(140, 176, 1.3), why: 'cross-hatch ground, a picture on an easel, a gallery portico' }),
  temples: () => ({ t: ['seigaiha', 16], l: A.ridge('tmp', { base: 176, amp: 30 }), a: A.torii(140, 176, 1.3) + A.pagoda(340, 176, 1, 4), why: 'wave-scale ground, a shrine gate, a pagoda' }),
  history: () => ({ t: ['brick', 24, 10], l: A.spires('hist', 0, 480, 176, 110), a: A.starburst(420, 36, 14, 8), why: 'brick ground, towers, belfries and spires' }),
  views: () => ({ t: ['grid', 24], l: A.skyline('views', { x0: 0, x1: 480, base: 176, min: 30, max: 140, spire: .35 }), a: A.sun(400, 50, 18), why: 'grid ground, a skyline, a sun' }),
  markets: () => ({ t: ['petals', 20], l: A.awning(30, 230, 70, 7) + A.awning(260, 450, 80, 6), a: A.lanterns(20, 460, 26, 6), why: 'tile ground, two market awnings, a lantern string' }),
  night: () => ({ t: ['dots', 18], l: A.skyline('night', { x0: 0, x1: 480, base: 176, min: 20, max: 110 }), a: A.crescent(380, 50, 22) + A.lanterns(20, 300, 40, 6), why: 'star-dot ground, a skyline, a crescent moon, lanterns' }),
  water: () => ({ t: ['waves', 12, 3, 44], l: A.swell(140, 5), a: A.boat(260, 140, 1.4) + A.lighthouse(420, 140, 1), why: 'wave ground, rollers, a boat, a lighthouse' }),
  free: () => ({ t: ['dots', 16], l: A.hills('free', 196, 2), a: A.ticket(240, 90, 1.6) + A.starburst(240, 90, 80, 16), why: 'dot ground, a ticket with rays, hills' }),
  family: () => ({ t: ['chevron', 14, 6], l: A.coaster(20, 300, 176), a: A.wheel(390, 96, 54), why: 'chevron ground, a roller coaster, a Ferris wheel' }),
  oddities: () => ({ t: ['cross', 16], l: A.hills('odd', 196, 1), a: A.compass(240, 96, 46), why: 'cross ground, a compass rose' }),
  onsen: () => ({ t: ['seigaiha', 14], l: A.ridge('onsen', { base: 150, amp: 40 }) + A.water(170, { n: 3 }), a: A.steam(140, 360, 160), why: 'wave-scale ground, mountains, a pool, rising steam' }),
  sport: () => ({ t: ['grid', 26], l: 'M60 150c60 -50 300 -50 360 0s-300 50 -360 0zM100 150c50 -34 230 -34 280 0s-230 34 -280 0', a: A.starburst(240, 50, 24, 10), why: 'grid ground, an oval stadium, a burst of lights' }),
  craft: () => ({ t: ['hexes', 14], l: A.hills('craft', 196, 2), a: 'M200 176c-20 0 -30 -40 -10 -70c10 -14 6 -30 6 -40h28c0 10 -4 26 6 40c20 30 10 70 -10 70zM300 176h40l-6 -60h-28z', why: 'hex ground, a vase and a glass, hills' }),
  campus: () => ({ t: ['grid', 20], l: A.portico(240, 176, 1, 8) + A.hills('campus', 196, 1), a: A.leaf(80, 80, 2, -.3), why: 'grid ground, a college portico, a leaf' }),
};
/** Collection id (from the live page's CATS) → cover subject. Ids first; a name pattern only picks an IMAGE, it never tags a place. */
const COLLECTION_ID = {
  FREE: 'free', MUS: 'art', ART: 'art', MURAL: 'art', ARTS: 'art', ICON: 'landmarks', ODD: 'oddities', FAM: 'family', PARK: 'outdoors',
  NATURE: 'outdoors', OUTDOOR: 'outdoors', GARDEN: 'outdoors', LAKES: 'outdoors', ARCH: 'landmarks', HERITAGE: 'history', HIST: 'history',
  CASTLE: 'history', UNESCO: 'landmarks', TEMPLE: 'temples', MKT: 'markets', SHOP: 'markets', VIEW: 'views', ROOF: 'views', NIGHT: 'night',
  SPEAK: 'night', ENT: 'night', ANIME: 'popculture', POP: 'popculture', ONSEN: 'onsen', SPA: 'onsen', CANAL: 'water', RIVER: 'water',
  WATER: 'water', MARITIME: 'water', SPORT: 'sport', RACE: 'sport', CRAFT: 'craft', GLASS: 'craft', CAMPUS: 'campus', TECH: 'campus', FLW: 'landmarks',
};
const COLLECTION_NAME = [[/anime|manga|pop culture|screen|film/i, 'popculture'], [/museum|galler|art/i, 'art'], [/park|garden|nature|trail|hike|outdoor|beach/i, 'outdoors'],
  [/temple|shrine|mosque|church/i, 'temples'], [/market|hawker|shop/i, 'markets'], [/view|skyline|observation/i, 'views'], [/night|bar|music|theat/i, 'night'],
  [/water|river|lake|canal|bay|harbou?r/i, 'water'], [/histor|heritage|castle|palace/i, 'history'], [/free/i, 'free'], [/family|kids/i, 'family'], [/sport|stadium/i, 'sport']];
function collectionKind(id, name) {
  return COLLECTION_ID[id] || (COLLECTION_NAME.find(([re]) => re.test(name || '')) || [])[1] || 'landmarks';
}

const THEME_ALIAS = { anime: 'popculture', hawker: 'markets', ramen: 'food', fine: 'food', unesco: 'landmarks', beer: 'night', flw: 'landmarks' };

// ---------------------------------------------------------------- skin colours (designer tokens, parsed)
const DEFAULT_ACC = { light: '#3B3A8F', dark: '#9C9BEF' };
const COUNTRY_SKIN = { japan: 'vermilion', us: 'lake', singapore: 'orchid', vietnam: 'jade', germany: 'plum', belgium: 'saffron',
  malaysia: 'lagoon', thailand: 'lagoon', indonesia: 'lagoon', philippines: 'lagoon', indochina: 'lagoon' };
const COLLECTION_SKIN = { food: 'saffron', landmarks: 'glacier', popculture: 'neon', outdoors: 'moss', art: 'plum', temples: 'vermilion', history: 'saffron',
  views: 'glacier', markets: 'saffron', night: 'plum', water: 'lake', free: 'lagoon', family: 'neon', oddities: 'plum', onsen: 'lagoon', sport: 'vermilion',
  craft: 'moss', campus: 'glacier' };
/** Parse tokens.css skin rules → { byPage: {key: skin}, bySkin: {skin: {light, dark}} }. Missing file → defaults. */
function readSkins(tokensCss) {
  const byPage = {}, bySkin = {}, prefix = [];
  if (!tokensCss) return { byPage, bySkin, prefix };
  for (const m of tokensCss.matchAll(/^((?:\s*(?::root(?::not\(\[data-theme="light"\]\)|\[data-theme="dark"\])\s+)?(?:\[data-(?:city|page)\^?="[^"]+"\]|\.skin-[a-z]+)\s*,?)+)\s*\{\s*--city:\s*(#[0-9A-Fa-f]{6})/gm)) {
    const sel = m[1], col = m[2], dark = /data-theme/.test(sel), skin = (/\.skin-([a-z]+)/.exec(sel) || [])[1];
    if (!skin) continue;
    bySkin[skin] = bySkin[skin] || {};
    if (dark) { if (!bySkin[skin].dark) bySkin[skin].dark = col; continue; }
    bySkin[skin].light = col;
    for (const k of sel.matchAll(/\[data-(?:city|page)(\^?)="([^"]+)"\]/g)) { if (k[1]) prefix.push([k[2], skin]); else byPage[k[2]] = skin; }
  }
  return { byPage, bySkin, prefix };
}

// ---------------------------------------------------------------- SVG writer
const NIGHT_LINE = '#F5EEDF', INK_LINE = '#191613';
const xesc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function svg(spec, acc, tone, title) {
  const night = tone === 'night';
  const line = night ? NIGHT_LINE : INK_LINE;
  const tl = T[spec.t[0]](...spec.t.slice(1));
  const a = night ? acc.dark || acc.light : acc.light;
  // night ground: cream lines + the bright (dark-theme) accent; paper ground: ink + the deep accent, cream at night.
  const css = `.p{fill:none;stroke:${line};stroke-opacity:${night ? .13 : .1};stroke-width:1}.g{fill:none;stroke:${line};stroke-opacity:${night ? .16 : .12};stroke-width:1;stroke-linecap:round}` +
    `.l{fill:none;stroke:${line};stroke-opacity:${night ? .66 : .55};stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}` +
    `.a{fill:none;stroke:${a};stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.f{fill:${a};fill-opacity:.9}` +
    (night ? `@media (prefers-color-scheme:dark){.l{stroke-opacity:.56}.p{stroke-opacity:.1}}`
      : `@media (prefers-color-scheme:dark){.p,.g,.l{stroke:${NIGHT_LINE}}.a{stroke:${acc.dark || acc.light}}.f{fill:${acc.dark || acc.light}}}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMax slice">` +
    `<title>${xesc(title)}</title><desc>Original illustration for Cleo (imagery lane): ${xesc(spec.why)}. Generic subjects, not a depiction of any particular venue.</desc>` +
    `<style>${css}</style><defs><pattern id="t" width="${tl.w}" height="${tl.h}" patternUnits="userSpaceOnUse"><path class="p" d="${tl.d}"/></pattern></defs>` +
    `<rect width="${W}" height="${H}" fill="url(#t)"/>` +
    (spec.g ? `<path class="g" d="${spec.g}"/>` : '') +
    `<path class="l" d="${spec.l}"/>` + (spec.a ? `<path class="a" d="${spec.a}"/>` : '') + (spec.f ? `<path class="f" d="${spec.f}"/>` : '') + `</svg>\n`;
}

/** Fallback composition for a page with no hand recipe: deterministic, distinct per key, from a regional vocabulary. */
function fallback(key, country) {
  const R = rng(key + 'fb'), pick = a => a[Math.floor(R() * a.length)];
  const tiles = [['dots', 12 + Math.floor(R() * 8)], ['petals', 18 + Math.floor(R() * 8)], ['hexes', 12 + Math.floor(R() * 4)], ['chevron', 14, 5], ['diag', 14 + Math.floor(R() * 6)]];
  const seaLike = /^(singapore|vietnam|malaysia|thailand|indonesia|philippines|indochina)$/.test(country || '');
  const l = seaLike ? pick([A.shophouses(key, 0, 480, 176, 50 + R() * 20), A.blocks(key, 0, 480, 176, 70 + R() * 40), A.canopy(key, 178)])
    : pick([A.skyline(key, { base: 170 }), A.hills(key, 190, 3) + A.water(184), A.ridge(key, { base: 176 })]);
  const a = seaLike ? pick([A.lanterns(20, 460, 26, 6), A.bowl(380, 120, .6), A.flower(400, 50, 1.6)]) : pick([A.bridgeTruss(40, 200, 150, 18), A.sun(400, 50, 20)]);
  return { t: pick(tiles), l, a, why: 'an original composition from the regional vocabulary (seeded from the page key)' };
}

/** Recipe for a city page row: {key, country}. */
function cityRecipe(row) {
  const k = row.key;
  if (RECIPES[k]) return RECIPES[k]();
  const [pre, town] = k.split('/');
  if (pre === 'vietnam' && VN[town]) return VN[town]();
  if (pre === 'singapore' && SG[town]) return SG[town]();
  if (pre === 'singapore' && SEA[town]) return SEA[town]();
  return fallback(k, row.country);
}

function accentFor(skins, skin, key) {
  let s = skin || skins.byPage[key];
  if (!s && key) { const p = skins.prefix.find(([pre]) => key.startsWith(pre)); if (p) s = p[1]; }
  return (s && skins.bySkin[s] && skins.bySkin[s].light) ? Object.assign({}, DEFAULT_ACC, skins.bySkin[s]) : DEFAULT_ACC;
}

// ---------------------------------------------------------------- designed food covers (DESIGN-SYSTEM §v2.7a)
// Food places never get a photo, so their cover is designed: the city's own ground tile (the recipe's `t`) under a
// large kit glyph and the dish word. Imagery owns the art; FE-A places it in the existing cover box. The ground ships as
// two CSS-ready url() values (no request): --ink at 5 % on the light theme, the dark theme's --ink at 7 %.
const FOOD_INK = { light: ['#1C1917', .05], dark: ['#F2EEEA', .07] };
const uri = s => `url("data:image/svg+xml,${s.replace(/"/g, "'").replace(/[<>#%{}]/g, c => encodeURIComponent(c))}")`;
/** Ground tile → { light, dark } url() strings; each well under 1 KB. */
function foodGround(spec) {
  const tl = T[spec.t[0]](...spec.t.slice(1));
  const one = ([c, o]) => uri(`<svg xmlns="http://www.w3.org/2000/svg" width="${tl.w}" height="${tl.h}"><path fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1.2" stroke-linecap="round" d="${tl.d}"/></svg>`);
  return { light: one(FOOD_INK.light), dark: one(FOOD_INK.dark), tile: spec.t[0] };
}
/**
 * The no-repeat rule: adjacent food covers never show the same glyph twice running. Each primary glyph (what the
 * renderer's glyphFor picks from the cuisine) has a short ladder of next-best kit glyphs from the same cuisine family;
 * forkknife is the last resort.
 */
const FOOD_GLYPH_LADDER = {
  bowl: ['steam', 'noodles'], noodles: ['bowl', 'steam'], sushi: ['fish', 'bowl'], dumpling: ['steam', 'bowl'], cup: ['cake', 'steam'],
  bottle: ['cocktail', 'cup'], cocktail: ['bottle', 'cup'], cake: ['ice', 'cup'], ice: ['cake', 'cup'], fish: ['sushi', 'bowl'],
  sandwich: ['bread', 'forkknife'], bread: ['sandwich', 'cake'], flame: ['forkknife', 'bowl'], cloche: ['forkknife', 'cup'],
  dango: ['cake', 'cup'], lantern: ['bottle', 'cup'], steam: ['bowl', 'dumpling'], forkknife: ['bowl', 'cup'],
};
/** Primary glyphs of a row's food cards, in order → the glyphs to draw, with no glyph twice running. */
function foodGlyphs(primary) {
  const out = [];
  primary.forEach((g, i) => {
    const prev = out[i - 1], next = primary[i + 1];
    out.push(g !== prev ? g : ((FOOD_GLYPH_LADDER[g] || []).concat('forkknife', 'bowl', 'cup').find(x => x !== prev && x !== next) || g));
  });
  return out;
}

/**
 * Build every motif. Returns { files: {relPath: svgString}, index } — `index` is the documented model FE lanes read:
 *   index.pages[pageKey]       = { night, ink, why, food: {light, dark, tile} }   (paths relative to beta/; food = §v2.7a cover ground url()s)
 *   index.countries[countryKey] = { night, ink, why }
 *   index.collections[kind]     = { night, ink, why }, index.themes[themeKey] (aliases)  and index.collectionKind(id, name) maps a CATS entry to a kind.
 */
function buildMotifs({ cityRows, countries, tokensCss }) {
  const skins = readSkins(tokensCss);
  const files = {}, index = { pages: {}, countries: {}, collections: {} };
  const put = (bucket, key, name, spec, acc, title) => {
    const base = `assets/img/motifs/${name}`;
    files[base + '.svg'] = svg(spec, acc, 'night', title);
    files[base + '.ink.svg'] = svg(spec, acc, 'ink', title);
    bucket[key] = { night: base + '.svg', ink: base + '.ink.svg', why: spec.why };
  };
  for (const r of cityRows) {
    const spec = cityRecipe(r);
    put(index.pages, r.key, r.fileKey, spec, accentFor(skins, null, r.key), `${r.name || r.key} — motif`);
    index.pages[r.key].food = foodGround(spec);   // §v2.7a: the food cover's ground (FE-A sets it as --food-ground / --food-ground-dark)
  }
  for (const c of countries) {
    const spec = COUNTRIES[c.key] ? COUNTRIES[c.key]() : fallback('country-' + c.key, c.key);
    put(index.countries, c.key, c.key, spec, accentFor(skins, COUNTRY_SKIN[c.key]), `${c.name || c.key} — motif`);
  }
  for (const k of Object.keys(COLLECTIONS)) put(index.collections, k, 'collections/' + k, COLLECTIONS[k](), accentFor(skins, COLLECTION_SKIN[k]), `${k} collection — motif`);
  // FE-B's cross-city editorial themes (render/hub.js THEMES) look up motifs/collections/<themeKey>.svg: alias each to its subject.
  for (const [theme, kind] of Object.entries(THEME_ALIAS)) if (!index.collections[theme]) {
    const base = 'assets/img/motifs/collections/';
    files[base + theme + '.svg'] = files[base + kind + '.svg']; files[base + theme + '.ink.svg'] = files[base + kind + '.ink.svg'];
    index.themes = index.themes || {}; index.themes[theme] = Object.assign({ subject: kind }, index.collections[kind], { night: base + theme + '.svg', ink: base + theme + '.ink.svg' });
  }
  return { files, index };
}

module.exports = { foodGround, foodGlyphs, FOOD_GLYPH_LADDER, buildMotifs, collectionKind, cityRecipe, readSkins, RECIPES, COLLECTIONS, COLLECTION_ID };

if (require.main === module) {
  const { buildRegistry, ROOT } = require('../lib/registry');
  const reg = buildRegistry();
  const rows = reg.rows.filter(r => r.kind === 'city').map(r => ({ key: r.key, fileKey: r.fileKey, country: r.country, name: r.data && r.data.meta && r.data.meta.h1Main }));
  const tok = fs.readFileSync(path.join(ROOT, 'beta/assets/tokens.css'), 'utf8');
  const { files } = buildMotifs({ cityRows: rows, countries: reg.countries, tokensCss: tok });
  const out = process.argv[2];
  if (out) for (const [rel, body] of Object.entries(files)) { const p = path.join(out, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, body); }
  const sizes = Object.values(files).map(s => s.length);
  console.log(Object.keys(files).length, 'files; max', Math.max(...sizes), 'B; total', sizes.reduce((a, b) => a + b, 0), 'B');
}
