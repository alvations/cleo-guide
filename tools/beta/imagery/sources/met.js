#!/usr/bin/env node
'use strict';
/**
 * imagery/sources/met.js — The Metropolitan Museum of Art Open Access (no key). Engine, CLI and checks: lib.js (--help).
 *
 * API: https://collectionapi.metmuseum.org/public/collection/v1/objects/<objectID> (no key). Only objects with
 * isPublicDomain true and a primaryImage (Open Access, CC0: https://www.metmuseum.org/policies/image-resources).
 * Two uses only (D-50): a photograph whose own title names the place (e.g. an 1889 albumen print of Mount Vernon,
 * dated, for a sight), or an object on view at the Met on the Met's own page (museumObject).
 */
const lib = require('./lib');

const idOf = row => String(row.itemId || (/collection\/search\/(\d+)/.exec(row.itemUrl) || [])[1] || '').trim();

const adapter = {
  id: 'met', provider: 'the-met', institution: 'The Metropolitan Museum of Art', keyEnv: null,
  hosts: ['collectionapi.metmuseum.org', 'images.metmuseum.org'], delay: 250, defaultBudget: 200,
  museumObject: /metropolitan museum|met cloisters|\bthe met\b/i,
  preflightUrl: () => 'https://collectionapi.metmuseum.org/public/collection/v1/objects/45734',
  async item(row, ctx) {
    const id = idOf(row);
    if (!/^\d+$/.test(id)) return { refused: 'no Met object id' };
    const r = await ctx.call(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
    if (r.status === 404) return null;
    if (r.status === 429 || r.status === 403) return { rateLimited: true };
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const o = await r.json();
    const refused = !o.isPublicDomain ? 'not public domain (isPublicDomain false)' : !o.primaryImage ? 'no image (primaryImage empty)' : '';
    return {
      title: o.title || '', author: lib.ANON.test(o.artistDisplayName || '') ? '' : (o.artistDisplayName || '').trim(), date: o.objectDate || '',
      anonymous: lib.ANON.test((o.artistDisplayName || '').trim()),
      sourceUrl: (o.objectURL || `https://www.metmuseum.org/art/collection/search/${id}`).replace(/^http:/, 'https:'),
      licence: 'CC0 1.0', licenceUrl: lib.LICENCES['CC0 1.0'], institution: 'The Metropolitan Museum of Art',
      text: [o.objectName, o.medium, o.city, o.state, o.country, o.region, o.subregion, o.locale, o.creditLine, ...(o.tags || []).map(t => t.term)].filter(Boolean).join(' '),
      onView: !!o.GalleryNumber, refused,
      imageUrl: () => o.primaryImage,   // full size; resized on the runner
    };
  },
};

if (require.main === module) lib.cli(adapter);
module.exports = { adapter, idOf };
