#!/usr/bin/env node
'use strict';
/**
 * imagery/sources/smithsonian.js — Smithsonian Open Access (CC0). Key: SMITHSONIAN_API_KEY (an api.data.gov key; Actions
 * secret, never in the repo; 1,000 requests an hour). Engine, CLI and checks: lib.js (--help).
 *
 * API: https://api.si.edu/openaccess/api/v1.0/content/edanmdm:<record id>?api_key=… (search fallback:
 * /search?q=record_ID:"<id>"). Only a record whose metadata_usage.access AND the chosen media's usage.access are "CC0"
 * — "Usage Conditions Apply" (most siris_sic_* Archives photo files) is refused even when its rights text says
 * "No restrictions". Images from ids.si.edu (…deliveryService?id=…&max=<w>).
 * Traps (research, 2026-10-17): "Air and Space Building" before 1976 is the South Yard hangar, not the Mall museum;
 * "United States National Museum" before 1910 is the Arts and Industries Building.
 */
const lib = require('./lib');

const idOf = row => String(row.itemId || (/(?:collections|object\/[^:]*:|detail\/edanmdm:)([a-z]+_[a-z]*_?\d+)/.exec(row.itemUrl) || [])[1] || '').trim();
const vals = xs => (Array.isArray(xs) ? xs : []).map(x => (x && typeof x === 'object' ? x.content : x)).filter(Boolean).map(String);

/** Normalise one EDAN record (the `content` object) → lib item fields. Exported for the tests. */
function fromRecord(c, id) {
  const d = c.descriptiveNonRepeating || {}, f = c.freetext || {}, ix = c.indexedStructured || {};
  const media = ((d.online_media || {}).media || []).filter(m => m && m.type !== 'Audio' && (m.usage || {}).access === 'CC0' && m.content);
  const usage = (d.metadata_usage || {}).access;
  const names = (f.name || []).filter(n => /photograph|artist|maker|creator|author|publisher/i.test(n.label || '')).map(n => n.content).filter(Boolean);
  const refused = usage !== 'CC0' ? `not CC0 (metadata_usage.access: ${usage || 'none'})` : !media.length ? 'no CC0 image in online_media' : '';
  const link = String(d.record_link || '').replace(/^http:/, 'https:');
  return {
    title: (d.title && d.title.content) || '', author: names[0] || '', date: vals(f.date)[0] || vals(ix.date)[0] || '',
    sourceUrl: /^https:\/\//.test(link) ? link : `https://www.si.edu/object/${id}`,
    licence: 'CC0 1.0', licenceUrl: lib.LICENCES['CC0 1.0'], institution: `Smithsonian${d.data_source ? ` (${d.data_source})` : ''}`,
    text: [...vals(f.notes), ...vals(f.place), ...vals(ix.place), ...vals(f.topic), ...vals(f.setName), ...vals(f.objectType), ...vals(ix.geoLocation && [].concat(ix.geoLocation).map(g => JSON.stringify(g)))].join(' '),
    refused, imageUrl: w => `${media[0].content}${media[0].content.includes('?') ? '&' : '?'}max=${w}`,
  };
}

const adapter = {
  id: 'smithsonian', provider: 'smithsonian', institution: 'Smithsonian Institution', keyEnv: 'SMITHSONIAN_API_KEY',
  hosts: ['api.si.edu', 'ids.si.edu'], delay: 400, defaultBudget: 150, callsPerItem: 2,
  preflightUrl: key => `https://api.si.edu/openaccess/api/v1.0/stats?api_key=${encodeURIComponent(key)}`,
  async item(row, ctx) {
    const id = idOf(row);
    if (!id) return { refused: 'no Smithsonian record id' };
    const k = encodeURIComponent(ctx.key);
    let r = await ctx.call(`https://api.si.edu/openaccess/api/v1.0/content/edanmdm:${encodeURIComponent(id)}?api_key=${k}`);
    if (r.status === 429) return { rateLimited: true };
    let content = null;
    if (r.ok) content = ((await r.json()).response || {}).content || null;
    if (!content) {
      r = await ctx.call(`https://api.si.edu/openaccess/api/v1.0/search?q=${encodeURIComponent(`record_ID:"${id}"`)}&rows=1&api_key=${k}`);
      if (r.status === 429) return { rateLimited: true };
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const row0 = (((await r.json()).response || {}).rows || [])[0];
      content = row0 && row0.content;
    }
    return content ? fromRecord(content, id) : null;
  },
};

if (require.main === module) lib.cli(adapter);
module.exports = { adapter, fromRecord, idOf };
