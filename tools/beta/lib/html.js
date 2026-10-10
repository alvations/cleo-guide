'use strict';
/** html.js — escaping + a tiny allow-list sanitiser for the few inline tags live prose carries. */
const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Live `w`/`k` fields occasionally carry <br>, <strong>, <em>, <a href>. Keep those, escape everything else.
const OK = /^<(\/?)(br|b|strong|i|em)\s*\/?>$/i;
const A_OPEN = /^<a\s+[^>]*href="(https?:\/\/[^"]+)"[^>]*>$/i;
function prose(s) {
  if (!s) return '';
  return String(s).split(/(<[^>]*>)/g).map(part => {
    if (!part.startsWith('<')) return esc(part).replace(/&amp;(#?\w+);/g, '&$1;'); // keep existing entities
    if (OK.test(part)) return part.toLowerCase().replace('<br/>', '<br>');
    const a = A_OPEN.exec(part);
    if (a) return '<a href="' + esc(a[1]) + '" rel="noopener" target="_blank">';
    if (/^<\/a>$/i.test(part)) return '</a>';
    return '';
  }).join('').replace(/<a [^>]*>(?![\s\S]*?<\/a>)/g, '');
}

/** JSON for embedding inside <script type="application/json|ld+json"> — closes no tags early. */
const jsonInline = o => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
  .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

module.exports = { esc, prose, jsonInline };
