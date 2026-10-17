#!/usr/bin/env node
'use strict';
/**
 * imagery/sources/pixabay.js — Pixabay (Pixabay Content License), LANDMARKS AND HEROES ONLY (D-50). Key: PIXABAY_API_KEY
 * (Actions secret, never in the repo). Engine, CLI and checks: lib.js (--help).
 *
 * API: GET https://pixabay.com/api/?key=…&id=<id>. Only type "photo" (no illustration, vector or AI tag). Pixabay asks
 * that images be downloaded to your own server, not hotlinked — we store resized copies. Identity: the photo's own
 * tags and page slug must name the landmark. Credited with full TASL although attribution is optional; licence
 * https://pixabay.com/service/license-summary/. Highest licence-laundering risk of all sources: contact-sheet review
 * looks for re-uploads (postcards, press, someone else's photo).
 */
const lib = require('./lib');

const idOf = row => String(row.itemId || (/pixabay\.com\/(?:[a-z]{2}\/)?photos\/(?:[^/]*-)?(\d+)\/?/.exec(row.itemUrl) || [])[1] || '').trim();
const slugWords = u => ((/\/photos\/([^/?#]+?)-?\d*\/?$/.exec(u || '') || [])[1] || '').replace(/-/g, ' ');

function fromHit(h) {
  const refused = h.type && h.type !== 'photo' ? `not a photograph (type ${h.type})` : /\bai\b|generated|render/i.test(h.tags || '') ? 'tagged as generated/rendered' : '';
  return {
    title: slugWords(h.pageURL) || h.tags || '', author: (h.user || '').trim(),
    authorUrl: h.user && h.user_id ? `https://pixabay.com/users/${encodeURIComponent(h.user)}-${h.user_id}/` : undefined,
    sourceUrl: h.pageURL || '', licence: 'Pixabay Content License', licenceUrl: lib.LICENCES['Pixabay Content License'], institution: 'Pixabay',
    text: `${h.tags || ''} ${slugWords(h.pageURL)}`, width: h.imageWidth || 0, refused,
    imageUrl: w => (w > 640 && h.largeImageURL) || h.webformatURL,
  };
}

const adapter = {
  id: 'pixabay', provider: 'pixabay', institution: 'Pixabay', keyEnv: 'PIXABAY_API_KEY',
  hosts: ['pixabay.com', 'cdn.pixabay.com'], delay: 700, defaultBudget: 90,
  preflightUrl: key => `https://pixabay.com/api/?key=${encodeURIComponent(key)}&per_page=3&q=bridge`,
  async item(row, ctx) {
    const id = idOf(row);
    if (!/^\d+$/.test(id)) return { refused: 'no Pixabay photo id' };
    const r = await ctx.call(`https://pixabay.com/api/?key=${encodeURIComponent(ctx.key)}&id=${id}`);
    if (r.status === 429) return { rateLimited: true };
    if (r.status === 400 || r.status === 404) return null;
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const h = ((await r.json()).hits || [])[0];
    if (!h) return null;
    if (String(h.id) !== id) return { refused: `API id mismatch (${h.id})` };
    return fromHit(h);
  },
};

if (require.main === module) lib.cli(adapter);
module.exports = { adapter, fromHit, idOf, slugWords };
