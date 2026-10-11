'use strict';
/**
 * minify.js — a conservative minify step for the beta's client JS (W7 FE-A; eager JS budget ≤ 40 KB gzip).
 *
 * It removes comments, leading indentation, trailing spaces, runs of spaces and blank lines, and leaves everything
 * else byte for byte: strings, template literals (with nested ${…}), regex literals and every line break between
 * statements, so automatic semicolon insertion sees the same program. No identifier is renamed. The result is
 * syntax-checked with vm.Script, and build.js refuses to write a file that fails it.
 */
const vm = require('vm');

const KW_BEFORE_REGEX = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await']);

function minify(src) {
  let out = '', i = 0, lastSig = '', lastWord = '';
  const n = src.length, stack = [];          // brace stack: 'b' (code brace) or 't' (a template ${ … })
  const sig = c => { lastSig = c; if (!/[\w$]/.test(c)) lastWord = ''; };
  const regexOk = () => !lastSig || /[(,=:[!&|?{};+\-*%<>~^]/.test(lastSig) || KW_BEFORE_REGEX.has(lastWord);
  const trimEnd = () => { let k = out.length; while (k && (out[k - 1] === ' ' || out[k - 1] === '\t')) k--; out = out.slice(0, k); };
  const newline = () => { trimEnd(); if (out && out[out.length - 1] !== '\n') out += '\n'; };
  function template(open) {                   // after the opening backtick (or a ${…} close); copies through the end
    if (open) out += '`';
    while (i < n) {
      const c = src[i];
      if (c === '\\') { out += c + src[i + 1]; i += 2; continue; }
      if (c === '`') { out += c; i++; sig('`'); return; }
      if (c === '$' && src[i + 1] === '{') { out += '${'; i += 2; stack.push('t'); lastSig = '{'; lastWord = ''; return 'code'; }
      out += c; i++;
    }
  }
  while (i < n) {
    const c = src[i], c2 = src[i + 1];
    if (c === '/' && c2 === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && c2 === '*') {
      const e = src.indexOf('*/', i + 2), body = src.slice(i, e < 0 ? n : e + 2); i = e < 0 ? n : e + 2;
      if (body.includes('\n')) newline(); else if (out && !/[\s]$/.test(out)) out += ' ';
      continue;
    }
    if (c === '\n' || c === '\r') { newline(); i++; while (i < n && (src[i] === ' ' || src[i] === '\t')) i++; continue; }
    if (c === ' ' || c === '\t') { if (out && !/[ \t\n]$/.test(out)) out += ' '; i++; continue; }
    if (c === '"' || c === "'") {
      let k = i + 1; while (k < n && src[k] !== c) { if (src[k] === '\\') k++; else if (src[k] === '\n') throw new Error('unterminated string at ' + i); k++; }
      out += src.slice(i, k + 1); i = k + 1; sig(c); continue;
    }
    if (c === '`') { i++; template(1); continue; }
    if (c === '}' && stack.length && stack[stack.length - 1] === 't') { stack.pop(); i++; out += '}'; template(0); continue; }
    if (c === '{') { stack.push('b'); out += c; i++; sig(c); continue; }
    if (c === '}') { stack.pop(); out += c; i++; sig(c); continue; }
    if (c === '/' && regexOk()) {
      let k = i + 1, cls = false;
      while (k < n) { const x = src[k]; if (x === '\\') { k += 2; continue; } if (x === '\n') throw new Error('unterminated regex at ' + i);
        if (cls) { if (x === ']') cls = false; } else if (x === '[') cls = true; else if (x === '/') break; k++; }
      k++; while (k < n && /[a-z]/i.test(src[k])) k++;
      out += src.slice(i, k); i = k; sig('/'); lastSig = 'r'; continue;
    }
    if (/[\w$]/.test(c)) { let k = i; while (k < n && /[\w$]/.test(src[k])) k++; const w = src.slice(i, k); out += w; i = k; lastSig = w[w.length - 1]; lastWord = w; continue; }
    out += c; i++; sig(c);
  }
  trimEnd();
  return out.replace(/^\n+/, '') + '\n';
}

/** minify, then prove the output still parses; throws with the file name otherwise */
function minifyChecked(src, name) {
  const m = minify(src);
  try { new vm.Script(m, { filename: name }); } catch (e) { throw new Error(`minify broke ${name}: ${e.message}`); }
  return m;
}

module.exports = { minify, minifyChecked };
