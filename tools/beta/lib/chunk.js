'use strict';
/**
 * chunk.js — progressive rendering for big city pages (M3-06, ROUND-1 gap #9). Platform-owned.
 *
 * The first `initial` cards (document order) stay live HTML. Every later card is still IN THE PAGE, wrapped in
 * `<noscript data-cleo-defer>` chunks inside its own `ol.pls`:
 *   - with JS on, the HTML parser treats <noscript> content as raw text, so those cards cost ~1 node per chunk
 *     until `Cleo.defer` (core.js) stamps them — as their area nears the viewport, or ALL of them before any
 *     lens, search, deep link, tray, source view, find-in-page or print;
 *   - with JS off, <noscript> renders normally, so every card shows exactly as before (display:contents keeps
 *     the list layout).
 * Nothing is dropped: the build's count gate reads the same `li.pl` start tags either way, and `chunk()` refuses
 * to return HTML whose card multiset differs from its input.
 */
const CARD = /<li class="pl[ "][\s\S]*?<\/li>/g;
const OL = /(<ol class="pls"[^>]*>)([\s\S]*?)(<\/ol>)/g;
const ids = h => (h.match(/<li class="pl[ "][^>]*\bid="p-[^"]*"/g) || []).map(s => /id="(p-[^"]*)"/.exec(s)[1]).sort().join('\n');

/** Returns {html, live, deferred, chunks}. Pages with ≤ `initial` cards come back unchanged. */
function chunk(html, { initial = 60, size = 40 } = {}) {
  const total = (html.match(/<li class="pl[ "]/g) || []).length;
  if (total <= initial) return { html, live: total, deferred: 0, chunks: 0 };
  let seen = 0, deferred = 0, chunks = 0;
  const out = html.replace(OL, (m, open, body, close) => {
    const cards = body.match(CARD) || [];
    if (body.replace(CARD, '').trim()) return m;            // unexpected markup inside the list: leave it live
    const keep = Math.max(0, Math.min(cards.length, initial - seen));
    seen += cards.length;
    if (keep === cards.length) return m;
    const later = cards.slice(keep), parts = [];
    for (let i = 0; i < later.length; i += size) {
      const grp = later.slice(i, i + size);
      parts.push(`<noscript data-cleo-defer data-n="${grp.length}" style="display:contents">\n${grp.join('\n')}\n</noscript>`);
      chunks++; deferred += grp.length;
    }
    return open + '\n' + cards.slice(0, keep).concat(parts).join('\n') + '\n' + close;
  });
  if (ids(out) !== ids(html)) throw new Error('chunk(): card set changed — refusing (records lost or duplicated)');
  return { html: out, live: total - deferred, deferred, chunks };
}

module.exports = { chunk };
