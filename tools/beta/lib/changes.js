'use strict';
/**
 * changes.js — "What changed" (ROUND-2 gap #9, M3-07) from the dated provenance already in the data: every closure
 * (status check date + the source that says it closed), and every day the guide re-checked places' status or
 * verified pins. Nothing is inferred from git history (clone depth would make the build non-reproducible) and nothing
 * is invented: an event exists only where data/geocodes.json carries the date.
 *
 * Output per place page: `changes` = [{d, kind: 'closed'|'checked'|'pins', n, ids?, id?, note?}] newest first, and an
 * Atom feed `feeds/<page>.xml`; a site feed `feeds/all.xml` (closures + per-page check days, newest first).
 */
const { BETA_BASE } = require('./render/common');
const { baseName } = require('./model');

const xml = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const day = d => (/^\d{4}-\d{2}-\d{2}/.exec(String(d || '')) || [null])[0];

function pageChanges(recs) {
  const out = [], checked = {}, pins = {}, shut = new Set(recs.filter(r => r.closed).map(r => r.id));
  for (const r of recs) {
    const pv = r.pv || {}, c = day(pv.checked), v = day(pv.verified);
    if (r.closed && c) out.push({ d: c, kind: 'closed', n: 1, id: r.id, name: baseName(r.n), note: pv.ss || null });
    if (c) (checked[c] = checked[c] || []).push(r.id);
    if (v) (pins[v] = pins[v] || []).push(r.id);
  }
  for (const [d, ids] of Object.entries(checked)) out.push({ d, kind: 'checked', n: ids.length, closed: ids.filter(id => shut.has(id)).length });
  for (const [d, ids] of Object.entries(pins)) out.push({ d, kind: 'pins', n: ids.length });
  const rank = { closed: 0, checked: 1, pins: 2 };
  return out.sort((x, y) => (x.d < y.d ? 1 : x.d > y.d ? -1 : 0) || rank[x.kind] - rank[y.kind] || String(x.id || '').localeCompare(String(y.id || '')));
}

function entryOf(row, e) {
  const url = `${BETA_BASE}/${row.beta}`;
  if (e.kind === 'closed') return { id: `${row.key}/${e.d}/closed/${e.id}`, d: e.d, title: `${row.name}: ${e.name} has closed — kept for the record`,
    link: `${url}#p=${e.id}`, text: e.note ? `Status source: ${e.note}` : 'Closed per the status check; the place stays in the guide, flagged.' };
  if (e.kind === 'checked') return { id: `${row.key}/${e.d}/checked`, d: e.d, title: `${row.name}: open/closed status checked for ${e.n} place${e.n === 1 ? '' : 's'}`,
    link: url, text: `${e.n} place${e.n === 1 ? '' : 's'} re-checked against a real source on ${e.d}; ${e.closed} of them closed (kept, flagged).` };
  return { id: `${row.key}/${e.d}/pins`, d: e.d, title: `${row.name}: ${e.n} map pin${e.n === 1 ? '' : 's'} verified`, link: url,
    text: `${e.n} address${e.n === 1 ? '' : 'es'} and pin${e.n === 1 ? '' : 's'} verified against a sourced coordinate on ${e.d}.` };
}

function atom(title, self, alt, entries) {
  const upd = entries.length ? entries[0].d : '2026-01-01';
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
<title>${xml(title)}</title>
<id>tag:alvations.github.io,2026:cleo/${xml(self)}</id>
<link rel="self" href="${xml(BETA_BASE + '/' + self)}"/>
<link rel="alternate" href="${xml(alt)}"/>
<updated>${upd}T00:00:00Z</updated>
<author><name>Cleo — sourced city guides</name></author>
${entries.map(e => `<entry><id>tag:alvations.github.io,2026:cleo/${xml(e.id)}</id><title>${xml(e.title)}</title><link href="${xml(e.link)}"/><updated>${e.d}T00:00:00Z</updated><summary>${xml(e.text)}</summary></entry>`).join('\n')}
</feed>
`;
}

/** Emit feeds/<fileKey>.xml per page + feeds/all.xml; stamps row.changes. Returns the site summary rows. */
function build(cityRows, emit) {
  const site = [], summary = [];
  for (const r of cityRows) {
    r.changes = pageChanges(r.recs);
    const es = r.changes.map(e => entryOf(r, e));
    r.feed = `feeds/${r.fileKey}.xml`;
    emit(r.feed, atom(`${r.name} — what changed · Cleo`, r.feed, `${BETA_BASE}/${r.beta}`, es));
    site.push(...es.filter((e, i) => r.changes[i].kind !== 'pins'));
    summary.push({ key: r.key, name: r.name, href: r.beta, feed: r.feed, last: r.changes.length ? r.changes[0].d : null,
      closed: r.changes.filter(e => e.kind === 'closed').length, checked: r.changes.filter(e => e.kind === 'checked').reduce((s, e) => s + e.n, 0) });
  }
  // W9-2 (FE-B, landing "<month> in Cleo"): the newest month on record across every guide — from the data's own dates,
  // never the wall clock (reproducible builds) — and, per page, what happened in it. Only dated events: re-checks,
  // closures with their source, pin verifications. No "new openings": records carry no first-seen date.
  const month = summary.reduce((m, x) => (x.last && x.last.slice(0, 7) > m ? x.last.slice(0, 7) : m), '');
  for (const [i, r] of cityRows.entries()) {
    const inM = r.changes.filter(e => e.d.slice(0, 7) === month);
    summary[i].changesPage = `changes/${r.fileKey}.html`;
    summary[i].month = { checked: inM.filter(e => e.kind === 'checked').reduce((t, e) => t + e.n, 0),
      closed: inM.filter(e => e.kind === 'closed').length, pins: inM.filter(e => e.kind === 'pins').reduce((t, e) => t + e.n, 0) };
  }
  summary.month = month;
  site.sort((x, y) => (x.d < y.d ? 1 : x.d > y.d ? -1 : 0) || (x.id < y.id ? -1 : 1));
  emit('feeds/all.xml', atom('Cleo — what changed across every guide', 'feeds/all.xml', `${BETA_BASE}/index.html`, site));
  return summary;
}

module.exports = { pageChanges, build, atom };
