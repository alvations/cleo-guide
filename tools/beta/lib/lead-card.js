'use strict';
/**
 * lead-card.js (platform, PERF-18 · Tokyo phone LCP): the Gallery's "Start with" lead card, rendered at BUILD time into the
 * phone lead slot, so the first screen's largest image paints with the HTML instead of after every deferred script, the
 * gallery module and its data fetch (≈ 3.1 s → ≈ 0.6 s at 4× CPU). client/gallery.js adopts this card (and still moves it
 * into the masthead on desktop); it draws its own only when none is here.
 *
 * This is a faithful port of client/gallery.js `gcard(r, 1, true)` with the English catalogue strings; test-beta compares
 * the two outputs for the lead of every place page, so the templates cannot drift. Inputs are the same data the client
 * reads: the lead record from lib/gallery.js rowsOf() (photos included), the page blob (areas, src, lang) and the
 * place's own card start tag (data-gl, data-m).
 *
 * i18n (OPEN, with the i18n lane): the card's strings are swapSkip keys and locale.js treats .g-lead-card as client-drawn,
 * so a ja load would show this card in English until gallery.js redraws it. It therefore lives outside lib/render/ and is
 * switched OFF (ENABLED) until that is settled; switching it on must also pass test-i18n's runtime pseudo-locale check.
 */
const { esc } = require('./html');
const { t: tr } = require('./i18n');

const CJK = /[぀-ヿ㐀-鿿가-힯豈-﫿]/;
const unq = v => v == null ? null : String(v).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/** the card start tag's attribute, as the client's att(id, k) reads it from the DOM (null when absent) */
function attOf(cardsHtml, id, k) {
  const m = new RegExp('<li class="pl[ "][^>]*\\bid="p-' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*>').exec(cardsHtml);
  if (!m) return null; const a = new RegExp('\\s' + k + '="([^"]*)"').exec(m[0]); return a ? unq(a[1]) : null;
}

/** the photo, as gallery.js phImg(p, eager) — the lead is in the first screen, so eager and high priority */
function phImg(p, root) {
  if (!p) return '';
  return '<img class="gc-img" src="' + esc(root + p[0]) + '"' + (p[5] && p[5].length > 1 ? ' srcset="' + p[5].map(x => esc(root + x[0]) + ' ' + x[1] + 'w').join(', ') + '" sizes="(min-resolution: 2.5dppx) and (max-width: 1023px) ' + (p[5].some(x => x[1] >= 600 && x[1] < 800) ? '240px' : '166px') + ', (min-width: 1024px) 300px, 80vw"' : '') +
    ' width="' + p[1] + '" height="' + p[2] + '" alt="" fetchpriority="high" decoding="async">';
}

/** The lead card's <li> (gcard(r, 1, true)). info = {areas, src, lang} as in the #cleo-city blob; root = '../' etc. */
function leadLi(r, info, cardsHtml, root) {
  const TIER = ['', tr('tier.1'), tr('tier.2'), tr('tier.3')];
  const att = k => attOf(cardsHtml, r.id, k);
  const nat = r.nat && r.n.slice(-r.nat.length - 2) === '(' + r.nat + ')' ? r.nat : '', g = Array.from(nat);
  const nm = nat ? r.n.slice(0, -nat.length - 2).trim() : r.n.replace(/\s*[—–-]+\s*CLOSED\b.*$/i, ''), col = ((info.areas || {})[r.a] || {}).c;
  const plate = g.length && g.length <= 4 && CJK.test(nat) ? '<span class="plate v"' + (info.lang ? ' lang="' + info.lang + '"' : '') + '>' + esc(nat) + '</span>'
    : '<span class="plate i" data-i="' + esc((nm.replace(/^(The|La|Le|El|Il|Der|Die|Das)\s+/i, '').match(/[A-Za-z0-9À-ɏ]/) || ['·'])[0]) + '"></span>';
  const ids = (r.src || []).filter(x => x !== 'guide'), chips = ids.slice(0, 1).map(x => '<button type="button" class="src" data-src="' + esc(x) + '">' + esc(((info.src || {})[x] || [x])[0]) + '</button>').join(', ');
  const aName = ((info.areas || {})[r.a] || {}).n || r.a, i = 1, ph = r.ph;
  return '<li class="gc' + (r.closed ? ' gc--closed' : '') + (ph ? '' : ' gc--np') + '" data-id="' + esc(r.id) + '"><a class="gc-a" href="#p-' + esc(r.id) + '"><span class="cover' + (r.closed ? ' closed' : '') + (r.kind === 'food' ? ' food' : '') + (ph ? ' has-ph' : '') + '" data-gl="' + esc(att('data-gl') || 'compass') + '" data-m="' + esc(att('data-m') || att('data-gl') || 'compass') + '" data-t="' + (r.t || 3) + '" data-comp="' + (i % 5) + '"' + (col || (ph && ph[6]) ? ' style="' + (col ? '--ac:' + col + ';' : '') + (ph && ph[6] ? '--ph:' + esc(ph[6]) : '') + '"' : '') + ' aria-hidden="true">' + plate + '<span class="gl"><svg class="ico"><use href="#i-' + esc(att('data-gl') || 'compass') + '"/></svg></span>' + (r.kind === 'food' && !ph && r.d ? '<span class="dish' + (r.d.length > 28 || /\S{17}/.test(r.d) ? ' l' : '') + '">' + esc(r.d) + '</span>' : '') + phImg(ph, root) + '</span>' + (ph ? '<span class="gc-cred">' + esc(ph[4]) + '</span>' : '') +
    '<span class="gc-b"><span class="pl-e">' + (r.closed ? tr('gal.closed') : (r.t === 1 ? '<span class="badge t1">' + TIER[1] + '</span> ' : TIER[r.t] ? '<span class="vh">' + TIER[r.t] + ' · </span>' : '') + esc(aName) + ' · ' + (r.kind === 'food' ? esc(tr('city.mode.food')) : tr('gal.see'))) + '</span>' +
    '<span class="gc-n">' + esc(nm) + '</span>' + (r.w ? '<span class="gc-w">' + esc(String(r.w).replace(/<[^>]+>/g, '')) + '</span>' : '') + '</span></a>' +
    '<p class="pl-s"><span class="lbl">' + tr('card.recby') + '</span> ' + (chips || '<span class="added">' + tr('city.card.added') + '</span>') + (ids.length > 1 ? ' <span class="more">' + tr('gal.more', { n: ids.length - 1 }) + '</span>' : '') + '</p>' +
    '<button type="button" class="heart gc-save" data-ref="' + esc(r.id) + '" aria-pressed="false" data-nm="' + esc(nm) + '" aria-label="' + esc(tr('gal.save', { name: nm })) + '"><svg class="ico" aria-hidden="true"><use href="#i-heart"/></svg></button></li>';
}

/** the <ol> gallery.js would create around it */
function leadCardHtml(r, info, cardsHtml, root) {
  if (!r) return '';
  return '<ol class="g-lead-card vw view-gallery" aria-label="' + esc(tr('city.lead.k')) + '">' + leadLi(r, info, cardsHtml, root) + '</ol>';
}

/** OFF until the i18n lane settles how a server-rendered card meets a ja load (locale.js treats .g-lead-card as client-drawn;
 *  its strings are swapSkip keys). test-beta keeps comparing leadLi() with gcard() either way, so the templates cannot drift. */
const ENABLED = false;

module.exports = { leadCardHtml, leadLi, ENABLED };
