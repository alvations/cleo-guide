#!/usr/bin/env node
'use strict';
/**
 * imagery/sources/pexels.js — Pexels (Pexels License), LANDMARKS AND HEROES ONLY (D-50). Key: PEXELS_API_KEY (Actions
 * secret, never in the repo; 200 requests an hour, 20,000 a month). Engine, CLI and checks: lib.js (--help).
 *
 * API: GET https://api.pexels.com/v1/photos/<id> with header `Authorization: <key>`. Identity comes from the photo's own
 * alt text and page slug, which must name the landmark. Credited with full TASL ("Photo by <name> on Pexels", licence
 * https://www.pexels.com/license/) although attribution is optional. Images from images.pexels.com, stored resized.
 */
const lib = require('./lib');

const idOf = row => String(row.itemId || (/pexels\.com\/photo\/(?:[^/]*-)?(\d+)\/?/.exec(row.itemUrl) || [])[1] || '').trim();
const slugWords = u => ((/\/photo\/([^/?#]+?)-?\d*\/?$/.exec(u || '') || [])[1] || '').replace(/-/g, ' ');

function fromPhoto(p) {
  return {
    title: p.alt || slugWords(p.url) || '', author: (p.photographer || '').trim(), authorUrl: p.photographer_url || undefined,
    sourceUrl: p.url || '', licence: 'Pexels License', licenceUrl: lib.LICENCES['Pexels License'], institution: 'Pexels',
    text: `${p.alt || ''} ${slugWords(p.url)}`, width: p.width || 0, refused: '',
    imageUrl: w => `${p.src && p.src.original}?auto=compress&cs=tinysrgb&w=${w}`,
  };
}

const adapter = {
  id: 'pexels', provider: 'pexels', institution: 'Pexels', keyEnv: 'PEXELS_API_KEY',
  hosts: ['api.pexels.com', 'images.pexels.com'], delay: 400, defaultBudget: 150,
  headers: key => ({ Authorization: key }),
  preflightUrl: () => 'https://api.pexels.com/v1/curated?per_page=1',
  async item(row, ctx) {
    const id = idOf(row);
    if (!/^\d+$/.test(id)) return { refused: 'no Pexels photo id' };
    const r = await ctx.call(`https://api.pexels.com/v1/photos/${id}`);
    if (r.status === 404) return null;
    if (r.status === 429) return { rateLimited: true };
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const p = await r.json();
    if (String(p.id) !== id) return { refused: `API id mismatch (${p.id})` };
    return fromPhoto(p);
  },
};

if (require.main === module) lib.cli(adapter);
module.exports = { adapter, fromPhoto, idOf, slugWords };
