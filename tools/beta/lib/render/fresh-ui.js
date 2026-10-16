'use strict';
/**
 * render/fresh-ui.js — FE-C, W9-2 "Freshness everywhere" (city half). The "Follow changes" line on each city page: one
 * plain sentence on what the page's feed is, linking to feeds/<page>.xml (lib/changes.js r.feed). Its sentence
 * (fresh.feed) waits for the ja in tools/beta/i18n-fec/pending-en.json, so the line stays off until both catalogues
 * carry it (unfinished work lands switched off). The card half is client/fresh.js.
 */
const { esc } = require('../html');
const { t, EN } = require('../i18n');

const ON = () => EN.strings['fresh.feed'] != null;
/** The line for the "How we choose" section, or '' (no feed, or the string not merged yet). `up` = '../' per depth. */
function follow(row, up) {
  if (!ON() || !row || !row.feed) return '';
  return `<p class="sm feedline" data-cleo-follow><a href="${esc(up + row.feed)}" type="application/atom+xml">${esc(t('land.month.follow'))}</a> — ${esc(t('fresh.feed'))}</p>`;
}
module.exports = { ON, follow };
