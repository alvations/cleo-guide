'use strict';
/**
 * extract.js — read the place records a LIVE page actually renders.
 *
 * Every live place page (cleveland.html, cities/*.html, Singapore/*.html, Vietnam/*.html) is built from the
 * Cleveland engine and declares its data as plain JS literals in its last inline <script>:
 *   const S = {...}; const AREAS = [...]; const P = [...]; const FS = {...};
 *   const CUISINES = [...]; const CATS = [...]; const F = [...]; const AC = {...};
 * These literals are the post-gate truth: the live builders drop places that fail GATE 1 (sources) or
 * GATE 2 (verified pin) and inject coordinates from data/geocodes.json, so the dataset files can hold MORE
 * places than the page shows (and Cleveland / legacy cities have no dataset at all). The beta generator
 * therefore reads the built live page, never re-runs the gates, so beta == live by construction.
 *
 * We bracket-match each `const NAME =` literal (string/comment aware) and evaluate it alone in an empty
 * vm context — no page code runs, no DOM, no network. Read-only: this never writes to the live tree.
 */
const vm = require('vm');

const NAMES = ['S', 'FS', 'AREAS', 'AC', 'CUISINES', 'CATS', 'P', 'F'];

function literalAt(src, i) {
  // src[i] is '[' or '{'. Return the index just past the matching close bracket.
  let depth = 0, str = null, esc = false, comment = null;
  for (; i < src.length; i++) {
    const c = src[i], d = src[i + 1];
    if (comment === '//') { if (c === '\n') comment = null; continue; }
    if (comment === '/*') { if (c === '*' && d === '/') { comment = null; i++; } continue; }
    if (str) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { str = c; continue; }
    if (c === '/' && d === '/') { comment = '//'; i++; continue; }
    if (c === '/' && d === '*') { comment = '/*'; i++; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') { depth--; if (depth === 0) return i + 1; }
  }
  throw new Error('unterminated literal');
}

function readLiteral(src, name) {
  const re = new RegExp('(?:^|[\\s;])const\\s+' + name + '\\s*=\\s*([\\[{])', 'm');
  const m = re.exec(src);
  if (!m) return undefined;
  const start = m.index + m[0].length - 1;
  const end = literalAt(src, start);
  return vm.runInNewContext('(' + src.slice(start, end) + ')', Object.create(null), { timeout: 5000 });
}

/** Return {S, FS, AREAS, AC, CUISINES, CATS, P, F, meta} for a live engine page's HTML. */
function extractPage(html) {
  // Only inline scripts: the CDN <script src> has no body.
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  const data = scripts.find(s => /const\s+P\s*=\s*\[/.test(s));
  if (!data) return null;
  const out = {};
  for (const n of NAMES) out[n] = readLiteral(data, n);
  out.P = out.P || []; out.F = out.F || [];
  out.meta = pageMeta(html);
  out.notes = pageNotes(html);
  return out;
}

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', mdash: '\u2014', ndash: '\u2013',
  rsquo: '\u2019', lsquo: '\u2018', rdquo: '\u201d', ldquo: '\u201c', middot: '\u00b7', hellip: '\u2026', rarr: '\u2192',
  larr: '\u2190', times: '\u00d7', eacute: '\u00e9', egrave: '\u00e8', uuml: '\u00fc', ouml: '\u00f6', auml: '\u00e4' };
const decode = s => s == null ? s : s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
    : ENT[e] !== undefined ? ENT[e] : m);
const strip = s => s == null ? s : decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

/** Chrome-level facts the live page states in prose (title, description, H1, standfirst). Read-only. */
function pageMeta(html) {
  const g = re => { const m = re.exec(html); return m ? m[1] : null; };
  return {
    title: strip(g(/<title>([\s\S]*?)<\/title>/i)),
    description: decode(g(/<meta\s+name="description"\s+content="([^"]*)"/i)),
    h1: strip(g(/<h1[^>]*>([\s\S]*?)<\/h1>/i)),
    h1Main: strip(g(/<h1[^>]*>([\s\S]*?)(?:<span class="thin">|<\/h1>)/i)),
    h1Thin: strip(g(/<h1[^>]*>[\s\S]*?<span class="thin">([\s\S]*?)<\/span>/i)),
    eyebrow: strip(g(/class="eyebrow"[^>]*>([\s\S]*?)<\/[a-z]+>/i)),
    standfirst: strip(g(/class="standfirst"[^>]*>([\s\S]*?)<\/p>/i)),
  };
}

/**
 * The live page's method notes ("FOOD RULES", "HOW SOURCED", "REGIONS", "GAPS"…), which the engine renders
 * from string literals in its source-list script. Stated gaps must stay stated in beta, so we carry them
 * verbatim. The engine's own "BASE MAPS" row is skipped: beta states its own tile policy.
 */
function pageNotes(html) {
  const out = [];
  const re = /<span class="k">([^<']+)<\/span><div class="t">((?:[^'<\\]|\\.)*)'\s*\+\s*'<span>((?:[^'\\]|\\.)*?)<\/span><\/div><\/div>'/g;
  // The match is the body of a single-quoted JS string (no bare quote inside), so evaluating it as one is safe.
  const unjs = s => vm.runInNewContext("'" + s + "'", Object.create(null));
  for (const m of html.matchAll(re)) {
    if (/BASE MAPS/i.test(m[1])) continue;
    out.push({ k: strip(unjs(m[1])), title: strip(unjs(m[2])), body: strip(unjs(m[3])) });
  }
  return out;
}

module.exports = { extractPage, readLiteral, pageMeta, pageNotes, strip, decode };
