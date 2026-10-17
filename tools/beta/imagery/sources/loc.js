#!/usr/bin/env node
'use strict';
/**
 * imagery/sources/loc.js — Library of Congress photos (no key). Engine, CLI and checks: lib.js (--help).
 *
 * API: https://www.loc.gov/item/<id>/?fo=json (no key; 20 requests a minute, a 1-hour block beyond that:
 * https://www.loc.gov/apis/json-and-yaml/working-within-limits/ — so --delay defaults to 3.2 s). Images from tile.loc.gov.
 * Rights, from the item's own rights advisory (never assumed):
 *   - Carol M. Highsmith Archive ("Ms. Highsmith has stipulated that her photographs are in the public domain") → Public domain;
 *   - HABS / HAER / HALS survey photos and other U.S. Government work ("No known restrictions on images made by the
 *     U.S. Government") → Public domain;
 *   - any other "No known restrictions on publication" → "No known restrictions" (accepted only once the gate takes it);
 *   - "not evaluated", "restricted", "permission", "rights status" and anything else → refused.
 * Historic rows are dated from the item (`date` / `created_published`); the caption names "Library of Congress".
 */
const lib = require('./lib');

const idOf = row => String(row.itemId || (/loc\.gov\/(?:pictures\/)?item\/([^/?#]+)/.exec(row.itemUrl) || [])[1] || '').trim();
const arr = v => (Array.isArray(v) ? v : v == null ? [] : [v]).flat().filter(x => x != null && x !== '').map(String);

/** Map the item's rights text to a licence, or refuse. Exported for the tests. */
function rightsOf(item, creators) {
  const text = [...arr(item.rights_advisory), ...arr(item.rights), ...arr(item.rights_information)].join(' ').replace(/\s+/g, ' ').trim();
  if (!text) return { refused: 'no rights advisory in the API record' };
  if (/not (been )?evaluated|rights status|restricted|permission (is )?required|in copyright|copyright (is )?held|may be restricted/i.test(text) && !/no known restrictions/i.test(text)) return { refused: `rights: "${text.slice(0, 120)}"` };
  if (/highsmith/i.test(creators.join(' ')) && /public domain|no known restrictions/i.test(text)) return { licence: 'Public domain', text };
  if (/u\.?s\.? government|public domain/i.test(text)) return { licence: 'Public domain', text };
  if (/^no known restrictions/i.test(text)) return { licence: 'No known restrictions', text };
  return { refused: `rights not recognised: "${text.slice(0, 120)}"` };
}
/** Pick an image URL from the item's image_url list ("…jpg#h=…&w=…"): the smallest at least `w` wide, else the largest. */
function pickImage(urls, w) {
  const xs = arr(urls).map(u => { const m = /#h=(\d+)&w=(\d+)/.exec(u); return { url: u.replace(/#.*$/, ''), w: m ? +m[2] : 0 }; })
    .filter(x => /^https:\/\//.test(x.url) && /\.(jpe?g|png|gif)$/i.test(x.url)).sort((a, b) => a.w - b.w);
  if (!xs.length) return null;
  return (xs.find(x => x.w >= w) || xs[xs.length - 1]);
}

const adapter = {
  id: 'loc', provider: 'library-of-congress', institution: 'Library of Congress', keyEnv: null,
  hosts: ['www.loc.gov', 'tile.loc.gov'], delay: 3200, defaultBudget: 60,
  preflightUrl: () => 'https://www.loc.gov/item/2011630123/?fo=json&at=item.title',
  async item(row, ctx) {
    const id = idOf(row);
    if (!id) return { refused: 'no LoC item id' };
    const r = await ctx.call(`https://www.loc.gov/item/${encodeURIComponent(id)}/?fo=json`);
    if (r.status === 429) return { rateLimited: true };
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const ct = r.headers.get('content-type') || '';
    if (!/json/.test(ct)) return { rateLimited: true };   // LoC answers an HTML CAPTCHA page when it throttles
    const j = await r.json(), item = j.item || {};
    const creators = [...arr(item.contributor_names), ...arr(item.creator), ...arr(item.contributors)];
    const rights = rightsOf(item, creators);
    const img = pickImage(j.image_url || item.image_url, 960);
    const it = {
      title: arr(item.title)[0] || '', author: creators[0] || '', date: arr(item.date)[0] || arr(item.created_published)[0] || '',
      sourceUrl: `https://www.loc.gov/item/${id}/`, institution: 'Library of Congress',
      text: [...arr(item.subject_headings), ...arr(item.subjects), ...arr(item.location), ...arr(item.notes), ...arr(item.summary), ...arr(item.description)].join(' '),
      width: img ? img.w : 0, refused: rights.refused || (img ? '' : 'no image in the API record'),
      licence: rights.licence, licenceUrl: `https://www.loc.gov/item/${id}/`,   // the item page carries the rights advisory
    };
    it.imageUrl = w => (pickImage(j.image_url || item.image_url, w) || img).url;
    return it;
  },
};

if (require.main === module) lib.cli(adapter);
module.exports = { adapter, rightsOf, pickImage, idOf };
