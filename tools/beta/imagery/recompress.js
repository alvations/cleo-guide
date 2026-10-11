#!/usr/bin/env node
'use strict';
/**
 * imagery/recompress.js — make the credited Commons photos lighter, in place (lane: imagery).
 *
 * Commons thumbnails come out at about 60–100 KB at 500 w and 70–340 KB at 960 w. That is heavy for an image-first grid.
 * This re-encodes every credited Wikimedia Commons JPEG (the row's file and its srcset variants) as a progressive
 * mozjpeg with its metadata stripped, at the highest quality ≤ 72 that meets the size target:
 *   card  500 w ≤ 45 KB · card 960 w ≤ 110 KB · hero 960 w ≤ 160 KB (a hero's smaller copies use the card targets).
 * Never below quality 50: a photo that still misses its target keeps the q50 copy and is listed. Pixel size is kept
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
const QUALITIES = [72, 66, 60, 55, 50];
const MARK = 'recompressed (JPEG, quality ≤ 72)';

/** Size target (bytes) for one file of a row: the largest copy of a hero ≤ 160 KB; any ≥ 800 w card copy ≤ 110 KB; else ≤ 45 KB. */
function targetOf(row, width, isMain) {
  if (row.slot && isMain) return 160 * KB;
  return width >= 800 ? 110 * KB : 45 * KB;
}
/** The files of a credit row with their widths: the main file last. */
const filesOf = row => [...(row.variants || []).map(v => ({ file: v.file, w: v.width, h: v.height, main: false })), { file: row.file, w: row.width, h: row.height, main: true }];
const eligible = row => row.provider === 'wikimedia-commons' && /\.jpe?g$/i.test(row.file) && !String(row.modified || '').includes('recompressed');

function loadSharp() {
  for (const base of [path.join(ROOT, 'tools'), process.cwd()]) {
    try { return require(require.resolve('sharp', { paths: [base] })); } catch (e) { /* next */ }
  }
  try { return require('sharp'); } catch (e) { return null; }
}

async function encode(sharp, buf, target) {
  let best = null;
  for (const q of QUALITIES) {
    const out = await sharp(buf).jpeg({ quality: q, progressive: true, mozjpeg: true }).toBuffer();   // metadata stripped by default
    best = { out, q };
    if (out.length <= target) break;
  }
  return best;
}

async function main() {
  const dry = process.argv.includes('--dry-run');
  const j = JSON.parse(fs.readFileSync(CREDITS, 'utf8'));
  const rows = j.credits.filter(eligible);
  console.log(`recompress: ${rows.length} credited Commons JPEG row(s) not yet recompressed`);
  if (!rows.length) return;
  const sharp = loadSharp();
  if (!sharp) { console.log('recompress: sharp is not installed (cd tools && npm install --no-save sharp) — nothing changed (exit 0).'); return; }
  let before = 0, after = 0, files = 0;
  const missed = [];
  for (const row of rows) {
    let touched = false;
    for (const f of filesOf(row)) {
      const p = path.join(PHOTO_DIR, f.file);
      if (!fs.existsSync(p)) { console.log(`  skip  ${f.file}: no such file`); continue; }
      const buf = fs.readFileSync(p), target = targetOf(row, f.w, f.main);
      const meta = await sharp(buf).metadata();
      if (meta.format !== 'jpeg') { console.log(`  skip  ${f.file}: not a JPEG (${meta.format})`); continue; }
      if ((meta.orientation || 1) !== 1) { console.log(`  skip  ${f.file}: EXIF orientation ${meta.orientation} (stripping it would turn the photo)`); continue; }
      const { out, q } = await encode(sharp, buf, target);
      const m2 = await sharp(out).metadata();
      if (m2.width !== meta.width || m2.height !== meta.height) throw new Error(`${f.file}: size changed ${meta.width}×${meta.height} → ${m2.width}×${m2.height}`);
      before += buf.length;
      if (out.length >= buf.length) { after += buf.length; console.log(`  keep  ${f.file} ${Math.round(buf.length / KB)} KB (re-encode not smaller)`); continue; }
      after += out.length; files++; touched = true;
      if (out.length > target) missed.push(`${f.file} ${Math.round(out.length / KB)} KB > ${Math.round(target / KB)} KB at q${q}`);
      console.log(`  ${dry ? 'would' : 'wrote'} ${f.file} ${Math.round(buf.length / KB)} → ${Math.round(out.length / KB)} KB (q${q}, target ${Math.round(target / KB)} KB)`);
      if (!dry) fs.writeFileSync(p, out);
    }
    if (touched && !dry) row.modified = row.modified ? `${row.modified}; ${MARK}` : MARK;
  }
  if (!dry) fs.writeFileSync(CREDITS, JSON.stringify(j, null, 1) + '\n');
  console.log(`\n${dry ? 'Would re-encode' : 'Re-encoded'} ${files} file(s): ${Math.round(before / KB)} KB → ${Math.round(after / KB)} KB.`);
  if (missed.length) { console.log(`Over target at quality 50 (kept, smaller than before) — ${missed.length}:`); missed.forEach(m => console.log(`  over  ${m}`)); }
  if (!dry && files) console.log('Now: cd tools && npm run beta && npm test');
}

if (require.main === module) main().catch(e => { console.error(`recompress: ${e.stack || e}`); process.exit(4); });
module.exports = { targetOf, filesOf, eligible, MARK, QUALITIES };
