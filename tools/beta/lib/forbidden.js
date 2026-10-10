'use strict';
/**
 * forbidden.js — the key-required map-surface lists, READ from tools/engine_guard.py (the single source of
 * truth per CLAUDE.md rule 4-ai) rather than re-typed, so the beta build gate can never drift from it.
 */
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'engine_guard.py'), 'utf8');
const list = name => {
  const m = new RegExp('^' + name + '\\s*=\\s*\\[([\\s\\S]*?)\\]', 'm').exec(src);
  if (!m) throw new Error('engine_guard.py: cannot read ' + name);
  return [...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]);
};
const FORBIDDEN = list('FORBIDDEN'), TILE_FORBIDDEN = list('TILE_FORBIDDEN');
const forbidden = html => {
  const s = html.split('https://fonts.googleapis.com').join('');
  return FORBIDDEN.concat(TILE_FORBIDDEN).filter(t => s.includes(t));
};
module.exports = { forbidden, FORBIDDEN, TILE_FORBIDDEN };
