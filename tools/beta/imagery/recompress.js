#!/usr/bin/env node
'use strict';
/**
 * imagery/recompress.js — make the credited Commons photos lighter, in place (lane: imagery).
 *
 * Commons thumbnails come out at about 60–100 KB at 500 w and 70–340 KB at 960 w. That is heavy for an image-first grid.
 * This re-encodes every credited Wikimedia Commons JPEG (the row's file and its srcset variants) as a progressive
 * mozjpeg with its metadata stripped, at the highest quality ≤ 72 that meets the size target:
 *   card  500 w ≤ 45 KB · card 960 w ≤ 110 KB · hero 960 w ≤ 120 KB (R7: every 960 w JPEG ≤ 120 KB).
 * Never below quality 40: a photo that still misses its target keeps the q40 copy and is listed. A row recompressed
 * before the targets tightened is re-encoded when a file is over its target. Each row also gets `color`, its dominant
 * colour (#rrggbb), for a fade-in placeholder. Pixel size is kept
 * (the credit row's width/height and the srcset stay true), and a copy is written only when it is smaller.
 * Each touched row's `modified` gains "; recompressed (JPEG, quality ≤ 72)" (CC BY / BY-SA ask that changes be
 * indicated; the short card credit already says "(resized)", the full credit names both). The credit is otherwise
 * unchanged. A row already marked recompressed is skipped, so it is safe to run after every fetch.
 *
 *   node tools/beta/imagery/recompress.js            # re-encode
 *   node tools/beta/imagery/recompress.js --dry-run  # report sizes only
 *
 * Needs `sharp` (on the runner: `npm install --no-save sharp` in tools/). Without it: prints a note, exits 0.
 * Then: cd tools && npm run beta && npm test.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const CREDITS = path.join(ROOT, 'beta/assets/img/CREDITS.json');
const PHOTO_DIR = path.join(ROOT, 'beta/assets/img/photos');
const KB = 1024;
const QUALITIES = [72, 66, 60, 55, 50, 45, 40];
const MARK = 'recompressed (JPEG, quality ≤ 72)';

/** Size target (bytes) for one file of a row: a hero's 960 w ≤ 120 KB (R7 gap 7: every 960 w JPEG ≤ 120 KB); a card's
 *  ≥ 800 w copy ≤ 110 KB; any smaller copy ≤ 45 KB. */
function targetOf(row, width, isMain) {
  if (width < 800) return 45 * KB;
  return row.slot && isMain ? 120 * KB : 110 * KB;
}
/** The files of a credit row with their widths: the main file last. */
const filesOf = row => [...(row.variants || []).map(v => ({ file: v.file, w: v.width, h: v.height, main: false })), { file: row.file, w: row.width, h: row.height, main: true }];
/** The size class of a file: its 960-step copy is judged by its name, so a copy scaled below 800 px keeps its 110/120 KB target. */
const classWidth = f => Math.max(f.w || 0, +((/-(\d+)\.[a-z]+$/i.exec(f.file) || [])[1] || 0));
const marked = row => String(row.modified || '').includes('recompressed');
const eligible = row => row.provider === 'wikimedia-commons' && /\.jpe?g$/i.test(row.file) && !marked(row);
/** A row to (re)visit: not yet recompressed, over a size target (targets tightened, R7), or without its dominant colour. */
const needsWork = (row, sizeOf) => row.provider === 'wikimedia-commons' && /\.jpe?g$/i.test(row.file) &&
  (!marked(row) || !/^#[0-9a-f]{6}$/.test(row.color || '') || filesOf(row).some(f => { const s = sizeOf(f.file); return s != null && s > targetOf(row, classWidth(f), f.main); }));
/** The photo's dominant colour as #rrggbb (sharp stats), for a fade-in placeholder behind the image (R7 gap 3). */
async function dominantOf(sharp, buf) {
  const { dominant: d } = await sharp(buf).stats();
  return '#' + [d.r, d.g, d.b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function loadSharp() {
  for (const base of [path.join(ROOT, 'tools'), process.cwd()]) {
    try { return require(require.resolve('sharp', { paths: [base] })); } catch (e) { /* next */ }
  }
  try { return require('sharp'); } catch (e) { return null; }
}

async function encode(sharp, buf, target, meta) {
  let best = null;
  for (const q of QUALITIES) {
    const out = await sharp(buf).jpeg({ quality: q, progressive: true, mozjpeg: true }).toBuffer();   // metadata stripped by default
    best = { out, q, w: meta.width, h: meta.height };
    if (out.length <= target) return best;
  }
  // Still over at the lowest quality: a tall (portrait) or very detailed photo carries too many pixels for its slot.
  // Step the pixel size down (0.85× a step) at q60 until it fits; the row's width/height are updated so srcset stays true.
  for (const s of [0.85, 0.72, 0.61, 0.52]) {
    const w = Math.round(meta.width * s);
    const out = await sharp(buf).resize({ width: w }).jpeg({ quality: 60, progressive: true, mozjpeg: true }).toBuffer();
    const m = await sharp(out).metadata();
    best = { out, q: 60, w: m.width, h: m.height, scaled: true };
    if (out.length <= target) break;
  }
  return best;
}

async function main() {
  const dry = process.argv.includes('--dry-run');
  const j = JSON.parse(fs.readFileSync(CREDITS, 'utf8'));
  const sizeOf = f => { try { return fs.statSync(path.join(PHOTO_DIR, f)).size; } catch (e) { return null; } };
  const rows = j.credits.filter(r => needsWork(r, sizeOf));
  console.log(`recompress: ${rows.length} credited Commons JPEG row(s) to re-encode or colour (new, over target, or no dominant colour)`);
  if (!rows.length) return;
  const sharp = loadSharp();
  if (!sharp) { console.log('recompress: sharp is not installed (cd tools && npm install --no-save sharp) — nothing changed (exit 0).'); return; }
  let before = 0, after = 0, files = 0, colours = 0;
  const missed = [];
  for (const row of rows) {
    let touched = false;
    for (const f of filesOf(row)) {
      const p = path.join(PHOTO_DIR, f.file);
      if (!fs.existsSync(p)) { console.log(`  skip  ${f.file}: no such file`); continue; }
      const buf = fs.readFileSync(p), target = targetOf(row, classWidth(f), f.main);
      if (f.main && !/^#[0-9a-f]{6}$/.test(row.color || '')) { row.color = await dominantOf(sharp, buf); colours++; }
      if (marked(row) && buf.length <= target) continue;          // already recompressed and within its target
      const meta = await sharp(buf).metadata();
      if (meta.format !== 'jpeg') { console.log(`  skip  ${f.file}: not a JPEG (${meta.format})`); continue; }
      if ((meta.orientation || 1) !== 1) { console.log(`  skip  ${f.file}: EXIF orientation ${meta.orientation} (stripping it would turn the photo)`); continue; }
      const { out, q, w: nw, h: nh, scaled } = await encode(sharp, buf, target, meta);
      const m2 = await sharp(out).metadata();
      if (m2.width !== nw || m2.height !== nh || (!scaled && (nw !== meta.width || nh !== meta.height))) throw new Error(`${f.file}: size changed ${meta.width}×${meta.height} → ${m2.width}×${m2.height}`);
      before += buf.length;
      if (out.length >= buf.length) { after += buf.length; console.log(`  keep  ${f.file} ${Math.round(buf.length / KB)} KB (re-encode not smaller)`); continue; }
      after += out.length; files++; touched = true;
      if (out.length > target) missed.push(`${f.file} ${Math.round(out.length / KB)} KB > ${Math.round(target / KB)} KB at q${q}`);
      console.log(`  ${dry ? 'would' : 'wrote'} ${f.file} ${Math.round(buf.length / KB)} → ${Math.round(out.length / KB)} KB (q${q}${scaled ? `, scaled to ${nw}×${nh}` : ''}, target ${Math.round(target / KB)} KB)`);
      if (!dry) {
        fs.writeFileSync(p, out);
        if (scaled) {   // keep the credit row's pixel sizes true (srcset descriptors come from them)
          if (f.main) { row.width = nw; row.height = nh; }
          else { const v = row.variants.find(x => x.file === f.file); v.width = nw; v.height = nh; }
        }
      }
    }
    if (touched && !dry && !marked(row)) row.modified = row.modified ? `${row.modified}; ${MARK}` : MARK;
  }
  if (!dry) fs.writeFileSync(CREDITS, JSON.stringify(j, null, 1) + '\n');
  console.log(`\n${dry ? 'Would re-encode' : 'Re-encoded'} ${files} file(s): ${Math.round(before / KB)} KB → ${Math.round(after / KB)} KB. Dominant colour added to ${colours} row(s).`);
  if (missed.length) { console.log(`Over target at quality ${QUALITIES[QUALITIES.length - 1]} (kept, smaller than before) — ${missed.length}:`); missed.forEach(m => console.log(`  over  ${m}`)); }
  if (!dry && files) console.log('Now: cd tools && npm run beta && npm test');
}

if (require.main === module) main().catch(e => { console.error(`recompress: ${e.stack || e}`); process.exit(4); });
module.exports = { targetOf, filesOf, eligible, needsWork, dominantOf, MARK, QUALITIES };
