/**
 * Beta contract checks for the site QA harness (tools/qa-site.js) — QA lane, M0-04 / M1-21.
 *
 * qa-site.js runs generic checks on every page; for pages built by the new beta engine
 * (<html data-cleo-page>) it also runs these, keyed on the RFC §5.5 markup contract:
 *   - record count on the page == the live counterpart (beta/data/manifest.json)   → FAIL (rule 1)
 *   - every card carries a non-empty "Recommended by"                              → FAIL (rule 2)
 *   - every closed card is flagged "closed" and shows no tier glyph                 → FAIL (rule 4c, D-10)
 *   - ids unique, every card has a stable id                                       → FAIL
 *   - tap targets < 44 px (beta bar is 44, not the legacy 40)                       → WARN
 *   - stated gaps (.method .note) present when the live page states them           → WARN
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
let MAN = null;
function manifest() {
  if (!MAN) { try { MAN = JSON.parse(fs.readFileSync(path.join(ROOT, 'beta', 'data', 'manifest.json'), 'utf8')); } catch (e) { MAN = { pages: [] }; } }
  return MAN;
}
function expectedFor(rel) {
  if (!rel.startsWith('beta/')) return null;
  const m = manifest().pages.find(p => 'beta/' + p.beta === rel);
  if (!m || !m.counts) return null;
  const c = m.counts, s = c.sights != null ? c.sights : c.P, f = c.food != null ? c.food : c.F;
  return { total: c.total != null ? c.total : s + f, sights: s, food: f, gen: m.gen };
}

/* eslint-disable no-undef */
const PROBE = () => {
  const kind = document.documentElement.getAttribute('data-cleo-page');
  if (!kind) return null;
  const cards = [...document.querySelectorAll('li.pl')];
  const ids = cards.map(c => c.id);
  const closed = cards.filter(c => c.hasAttribute('data-closed') || c.classList.contains('pl--closed'));
  const TIER = /\b(Must see|Worth the detour|Deep cut)\b/;
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 1 && r.height > 1 && r.right > 0 && r.bottom + scrollY > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && !el.closest('[hidden]'); };
  const small = [];
  for (const el of document.querySelectorAll('a[href], button, input:not([type=hidden]), select, [role=button]')) {
    if (!vis(el) || el.closest('.leaflet-container, .vh')) continue;
    if (el.tagName === 'A' && el.parentElement && /^(P|LI|SPAN|DD|SMALL)$/.test(el.parentElement.tagName) && el.parentElement.textContent.trim().length > el.textContent.trim().length + 15) continue;
    const r = el.getBoundingClientRect(); if (r.width < 44 || r.height < 44) small.push(el.tagName.toLowerCase() + '.' + (el.className || '') + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
  }
  return {
    kind, cards: cards.length, sights: cards.filter(c => c.getAttribute('data-k') === 's').length,
    food: cards.filter(c => c.getAttribute('data-k') === 'f').length,
    noId: cards.filter(c => !/^p-.+/.test(c.id)).length, dupIds: ids.length - new Set(ids).size,
    noAttr: cards.filter(c => { const s = c.querySelector('.pl-s'); return !s || !s.textContent.trim(); }).map(c => c.id).slice(0, 5),
    closed: closed.length,
    closedUnflagged: closed.filter(c => !/closed/i.test(c.textContent)).map(c => c.id).slice(0, 5),
    closedTier: closed.filter(c => c.querySelector('.tier, .pl-tier, [data-tier]') || TIER.test((c.querySelector('.pl-e') || {}).textContent || '')).map(c => c.id).slice(0, 5),
    notes: document.querySelectorAll('.method .note, .note').length,
    small44: small.length, small44List: small.slice(0, 6),
  };
};
/* eslint-enable no-undef */

function grade(rel, b, viewport, fails, warns) {
  if (!b) return;
  const exp = expectedFor(rel);
  if (b.kind === 'city' && exp) {
    if (b.cards !== exp.total) fails.push(`beta records ${b.cards} != live ${exp.total}`);
    if (b.sights !== exp.sights || b.food !== exp.food) fails.push(`beta split ${b.sights}/${b.food} != live ${exp.sights}/${exp.food}`);
  }
  if (b.noId) fails.push('cards without a stable id: ' + b.noId);
  if (b.dupIds) fails.push('duplicate place ids: ' + b.dupIds);
  if (b.noAttr.length) fails.push('cards without "Recommended by": ' + b.noAttr.join(', '));
  if (b.closedUnflagged.length) fails.push('closed places not flagged: ' + b.closedUnflagged.join(', '));
  if (b.closedTier.length) fails.push('closed places showing a tier: ' + b.closedTier.join(', '));
  if (b.kind === 'city' && !b.notes) warns.push('no method/stated-gap notes on page');
  if (viewport === 'mobile' && b.small44) warns.push('beta tap targets <44px ×' + b.small44);
}

module.exports = { PROBE, grade, expectedFor };
