#!/usr/bin/env node
'use strict';
/**
 * imagery/sources/europeana.js — Europeana, open re-use only. Key: EUROPEANA_API_KEY (the wskey; Actions secret, never
 * in the repo). Engine, CLI and checks: lib.js (--help).
 *
 * API: https://api.europeana.eu/record/v2/<dataset>/<record>.json?wskey=…  The item's edm:rights URI decides the licence
 * (lib.licenceFromUri): CC0, Public Domain Mark, CC BY, CC BY-SA, NoC-US. In Copyright, InC-EDU, NoC-NC, NoC-OKLR, CNE
 * and every NC / ND licence are refused. The full image is the aggregation's edm:isShownBy (provider's server).
 * A candidate may name a Rijksmuseum object page (rijksmuseum.nl/…/RP-F-F06191): its Europeana record is dataset 90402,
 * record = the object number with "-" → "_" (RP_F_F06191); the API, not the guess, must then confirm it exists.
 */
const lib = require('./lib');

/** [dataset, record] for a candidate row, or null. Exported for the tests. */
function recordOf(row) {
  let m = /europeana\.eu\/(?:[a-z]{2}\/)?item\/(\d+)\/([^/?#\s]+)/.exec(row.itemUrl || '');
  if (m) return [m[1], m[2]];
  if ((m = /^(\d+)\/([^/\s]+)$/.exec(row.itemId || ''))) return [m[1], m[2]];
  if (/rijksmuseum\.nl/.test(row.itemUrl || '') && /^[A-Z]{2}-[A-Z0-9-]+$/i.test(row.itemId || '')) return ['90402', row.itemId.replace(/-/g, '_')];
  return null;
}
const lang = v => !v ? [] : Array.isArray(v) ? v : Object.values(v).flat();
const first = v => lang(v)[0] || '';

/** Normalise a Record API `object` → lib item fields. Exported for the tests. */
function fromObject(o) {
  const agg = (o.aggregations || [])[0] || {}, proxies = o.proxies || [];
  const pick = k => proxies.flatMap(p => lang(p[k]));
  const label = v => { if (!/^https?:\/\//.test(v)) return v; const a = [...(o.agents || []), ...(o.organizations || [])].find(x => x.about === v); return a ? first(a.prefLabel) : ''; };
  const rightsUri = first(agg.edmRights) || first((o.europeanaAggregation || {}).edmRights);
  const lic = lib.licenceFromUri(rightsUri);
  const creators = pick('dcCreator').map(label).filter(Boolean);
  const author = creators.find(a => !lib.ANON.test(a)) || '';
  const id = String(o.about || '').replace(/^\//, '');
  return {
    title: pick('dcTitle')[0] || '', author, date: pick('dcDate')[0] || pick('dctermsCreated')[0] || String(o.year ? first(o.year) : ''),
    sourceUrl: `https://www.europeana.eu/item/${id}`, institution: `${label(first(agg.edmDataProvider)) || 'Europeana'} via Europeana`,
    licence: lic && lic.licence, licenceUrl: lic && lic.licenceUrl,
    anonymous: !author && creators.length > 0 && creators.every(a => lib.ANON.test(a)),
    refused: !lic ? `rights not open: ${rightsUri || 'none'}` : !agg.edmIsShownBy ? 'no full image (edm:isShownBy)' : '',
    text: [...pick('dcDescription'), ...pick('dcSubject').map(label), ...pick('dctermsSpatial').map(label), ...pick('dcCoverage').map(label), ...pick('dcType').map(label)].join(' '),
    imageUrl: () => agg.edmIsShownBy,
  };
}

const adapter = {
  id: 'europeana', provider: 'europeana', institution: 'Europeana', keyEnv: 'EUROPEANA_API_KEY',
  hosts: ['api.europeana.eu', 'the data providers\' image servers'], delay: 300, defaultBudget: 200,
  preflightUrl: key => `https://api.europeana.eu/record/v2/search.json?query=*&rows=0&wskey=${encodeURIComponent(key)}`,
  async item(row, ctx) {
    const rec = recordOf(row);
    if (!rec) return { refused: 'no Europeana record id' };
    const r = await ctx.call(`https://api.europeana.eu/record/v2/${rec[0]}/${encodeURIComponent(rec[1])}.json?wskey=${encodeURIComponent(ctx.key)}`);
    if (r.status === 404) return null;
    if (r.status === 429) return { rateLimited: true };
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const j = await r.json();
    return j.object ? fromObject(j.object) : null;
  },
};

if (require.main === module) lib.cli(adapter);
module.exports = { adapter, recordOf, fromObject };
