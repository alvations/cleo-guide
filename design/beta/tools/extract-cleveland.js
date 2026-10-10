// Read-only: evaluates the data literals (S, AREAS, P, FS, CUISINES, F, AC) of cleveland.html in a sandbox
// and prints them as JSON, so the design mockups can use Cleveland's REAL records. Writes nothing.
//   node design/beta/tools/extract-cleveland.js > out.json
const fs = require('fs'), vm = require('vm'), path = require('path');
const h = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'cleveland.html'), 'utf8');
const grab = (name, open, close) => {
  const i = h.indexOf(`const ${name} = ${open}`);
  if (i < 0) throw new Error('missing ' + name);
  let depth = 0, j = h.indexOf(open, i), inS = null;
  for (; j < h.length; j++) {
    const c = h[j];
    if (inS) { if (c === '\\') { j++; continue; } if (c === inS) inS = null; continue; }
    if (c === '"' || c === "'" || c === '`') { inS = c; continue; }
    if (c === '/' && h[j + 1] === '*') { j = h.indexOf('*/', j) + 1; continue; }
    if (c === open) depth++;
    else if (c === close && --depth === 0) break;
  }
  return h.slice(h.indexOf(open, i), j + 1);
};
const ctx = {}, raw = {};
for (const [n, o, c] of [['S', '{', '}'], ['AREAS', '[', ']'], ['P', '[', ']'], ['FS', '{', '}'], ['CUISINES', '[', ']'], ['F', '[', ']'], ['AC', '{', '}']])
  ctx[n] = vm.runInNewContext('(' + (raw[n] = grab(n, o, c)) + ')');
// count assert: every record literal in the source block must survive the parse (CLAUDE.md rule 2)
for (const n of ['P', 'F']) {
  const want = (raw[n].match(/^\{t:\d/gm) || []).length;
  if (ctx[n].length !== want) throw new Error(`${n}: parsed ${ctx[n].length} records, source has ${want}`);
}
process.stdout.write(JSON.stringify(ctx));
