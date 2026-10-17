#!/usr/bin/env node
'use strict';
/**
 * imagery/sources/contact.js — the contact sheet for staged image-source candidates (lane: image sources, D-49/D-50).
 *
 *   node tools/beta/imagery/sources/contact.js            # every source's stage.json → contact.html + sheet-NN.jpg
 *   node tools/beta/imagery/sources/contact.js --pending  # only rows not yet reviewed in candidates.tsv (default)
 *   node tools/beta/imagery/sources/contact.js --all      # include reviewed rows
 *
 * Writes design/beta/imagery-sources/stage/contact.html (each preview beside its place, title, author, date, licence,
 * source link and identification evidence) and, when sharp is installed, sheet-01.jpg, sheet-02.jpg… — 4 × 4 numbered
 * tiles a reviewer can open as one image each, numbered as in contact.html and review.tsv. review.tsv lists
 * `n  target  source  itemId  verdict` with an empty verdict for the reviewer to fill (ok, or the refusal reason);
 * copy each verdict into the `review` column of candidates.tsv (or run `node …/review.js review.tsv`).
 */
const fs = require('fs');
const path = require('path');
const lib = require('./lib');

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function collect(all) {
  const reviewed = new Map(lib.readCandidates().map(r => [`${r.target}|${r.source}|${r.itemId}`, r.review]));
  const rows = [];
  if (!fs.existsSync(lib.STAGE_DIR)) return rows;
  for (const src of fs.readdirSync(lib.STAGE_DIR).sort()) {
    const f = path.join(lib.STAGE_DIR, src, 'stage.json');
    if (!fs.existsSync(f)) continue;
    for (const r of JSON.parse(fs.readFileSync(f, 'utf8')).rows) {
      if (!r.preview) continue;   // refused at the API check: listed in stage.json, not on the sheet
      if (!all && reviewed.get(`${r.target}|${src}|${r.itemId}`)) continue;
      rows.push({ ...r, source: src });
    }
  }
  return rows.sort((a, b) => a.target.localeCompare(b.target));
}

function html(rows) {
  const cell = (r, i) => `<figure><img src="${esc(`${r.source}/${r.preview}`)}" loading="lazy" alt=""><figcaption><b>${i + 1}. ${esc(r.place)}</b> <code>${esc(r.target)}</code><br>` +
    `“${esc(r.title)}” — ${esc(r.author)}${r.date ? ` · ${esc(r.date)}` : ''} · ${esc(r.institution)}<br>` +
    `<a href="${esc(r.licenceUrl)}">${esc(r.licence)}</a> · <a href="${esc(r.sourceUrl)}">${esc(r.source)} ${esc(r.itemId)}</a> · ${esc(r.confidence)}${r.era ? ` · ${esc(r.era)}` : ''}${r.stillLooks ? ` · still looks: ${esc(r.stillLooks)}` : ''}<br>` +
    `<i>${esc(r.evidence)}</i></figcaption></figure>`;
  return `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Image sources contact sheet</title>` +
    `<style>body{font:13px/1.4 system-ui,sans-serif;margin:16px;background:#fff;color:#111}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}` +
    `img{width:100%;aspect-ratio:4/3;object-fit:contain;background:#eee}figure{margin:0}code{font-size:11px;color:#555}@media(prefers-color-scheme:dark){body{background:#111;color:#eee}img{background:#222}code{color:#aaa}a{color:#9cf}}</style>` +
    `<h1>Image sources — ${rows.length} candidate(s) for review</h1><p>Verdict per number in review.tsv: <b>ok</b> only if the photo plainly shows the named place (and, for a historic photo, the place still looks like this). Anything else: write the reason.</p>` +
    `<main>${rows.map(cell).join('')}</main>`;
}

async function sheets(rows, sharp) {
  const T = 300, H = 225, LAB = 34, COLS = 4, PER = 16, out = [];
  for (let s = 0; s * PER < rows.length; s++) {
    const part = rows.slice(s * PER, s * PER + PER), nrow = Math.ceil(part.length / COLS);
    const comp = [];
    for (let i = 0; i < part.length; i++) {
      const r = part[i], n = s * PER + i + 1, x = (i % COLS) * T, y = Math.floor(i / COLS) * (H + LAB);
      const img = await sharp(path.join(lib.STAGE_DIR, r.source, r.preview)).resize(T - 6, H - 6, { fit: 'contain', background: '#dddddd' }).toBuffer();
      comp.push({ input: img, left: x + 3, top: y + 3 });
      const label = `${n}. ${r.place}`.slice(0, 44), sub = `${r.source} ${r.itemId}${r.date ? ' · ' + r.date : ''}`.slice(0, 50);
      comp.push({ input: Buffer.from(`<svg width="${T}" height="${LAB}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#fff"/><text x="4" y="14" font-family="sans-serif" font-size="13" font-weight="bold">${esc(label)}</text><text x="4" y="29" font-family="sans-serif" font-size="11" fill="#444">${esc(sub)}</text></svg>`), left: x, top: y + H });
    }
    const file = `sheet-${String(s + 1).padStart(2, '0')}.jpg`;
    await sharp({ create: { width: COLS * T, height: nrow * (H + LAB), channels: 3, background: '#ffffff' } }).composite(comp).jpeg({ quality: 72 }).toFile(path.join(lib.STAGE_DIR, file));
    out.push(file);
  }
  return out;
}

async function main() {
  const all = process.argv.includes('--all');
  const rows = collect(all);
  fs.mkdirSync(lib.STAGE_DIR, { recursive: true });
  for (const f of fs.readdirSync(lib.STAGE_DIR)) if (/^sheet-\d+\.jpg$/.test(f)) fs.unlinkSync(path.join(lib.STAGE_DIR, f));
  fs.writeFileSync(path.join(lib.STAGE_DIR, 'contact.html'), html(rows));
  fs.writeFileSync(path.join(lib.STAGE_DIR, 'review.tsv'), ['n\ttarget\tsource\titemId\tverdict', ...rows.map((r, i) => `${i + 1}\t${r.target}\t${r.source}\t${r.itemId}\t`)].join('\n') + '\n');
  let made = [];
  let sharp = null;
  for (const base of [path.join(__dirname, '..', '..', '..'), process.cwd()]) { try { sharp = require(require.resolve('sharp', { paths: [base] })); break; } catch (e) { /* next */ } }
  if (sharp && rows.length) made = await sheets(rows, sharp);
  console.log(`contact sheet: ${rows.length} candidate(s) → ${path.relative(process.cwd(), path.join(lib.STAGE_DIR, 'contact.html'))}${made.length ? ` + ${made.join(', ')}` : sharp ? '' : ' (sharp not installed: no sheet images)'}; verdicts go in review.tsv`);
}
if (require.main === module) main().catch(e => { console.error(e.stack || String(e)); process.exitCode = 4; });
module.exports = { collect, html };
