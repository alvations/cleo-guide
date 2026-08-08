#!/usr/bin/env node
/**
 * Data integrity checks. Run this before every commit.
 *
 * These exist because a careless find-and-replace once silently deleted 150
 * records from cleveland.html and the page still parsed as valid JavaScript.
 * Syntax checks alone will not save you. Content checks will.
 *
 * Usage:  cd tools && node validate.js
 */
const fs = require('fs');
const path = require('path');
const HTML = fs.readFileSync(path.join(__dirname, '..', 'cleveland.html'), 'utf8');

let bad = 0;
const fail = m => { console.log('  FAIL  ' + m); bad++; };
const pass = m => console.log('  PASS  ' + m);

function grab(name) {
  const m = HTML.match(new RegExp('const ' + name + ' = \\[([\\s\\S]*?)\\n\\];'));
  if (!m) { fail(`array ${name} not found`); return []; }
  try { return eval('[' + m[1] + ']'); } catch (e) { fail(`array ${name} will not parse: ${e.message}`); return []; }
}
function grabObj(name) {
  const m = HTML.match(new RegExp('const ' + name + ' = \\{([\\s\\S]*?)\\n\\};'));
  if (!m) { fail(`object ${name} not found`); return {}; }
  try { return eval('({' + m[1] + '})'); } catch (e) { fail(`object ${name} will not parse: ${e.message}`); return {}; }
}

const S = grabObj('S'), FS_ = grabObj('FS');
const P = grab('P'), F = grab('F');
const AREAS = grab('AREAS'), CUISINES = grab('CUISINES');

console.log('== STRUCTURE ==');
P.length ? pass(`${P.length} sights`) : fail('no sights');
F.length ? pass(`${F.length} food places`) : fail('no food places');
AREAS.length ? pass(`${AREAS.length} areas`) : fail('no areas');
CUISINES.length ? pass(`${CUISINES.length} cuisines`) : fail('no cuisines');

console.log('\n== RECORD FIELDS ==');
const areaIds = new Set(AREAS.map(a => a.id));
const czIds = new Set(CUISINES.map(c => c.id));
const check = (list, label, srcTable, needCz) => {
  let errs = 0;
  list.forEach((p, i) => {
    const where = `${label}[${i}] ${p && p.n ? p.n : '(unnamed)'}`;
    if (!p.n) { fail(`${where}: missing name`); errs++; }
    if (!p.ad) { fail(`${where}: missing address`); errs++; }
    if (typeof p.la !== 'number' || typeof p.ln !== 'number') { fail(`${where}: bad coordinates`); errs++; }
    if (![1, 2, 3].includes(p.t)) { fail(`${where}: tier must be 1, 2 or 3`); errs++; }
    if (!areaIds.has(p.a)) { fail(`${where}: unknown area "${p.a}"`); errs++; }
    if (!Array.isArray(p.s) || !p.s.length) { fail(`${where}: no sources`); errs++; }
    else p.s.forEach(t => { if (!srcTable[t[0]]) { fail(`${where}: unknown source key "${t[0]}"`); errs++; } });
    if (needCz) {
      if (!Array.isArray(p.cz) || !p.cz.length) { fail(`${where}: no cuisine tags`); errs++; }
      else p.cz.forEach(c => { if (!czIds.has(c)) { fail(`${where}: unknown cuisine "${c}"`); errs++; } });
    }
    if (!p.w || p.w.length < 40) { fail(`${where}: description too short to be useful`); errs++; }
  });
  if (!errs) pass(`${label}: every record well formed`);
};
check(P, 'sights', S, false);
check(F, 'food', FS_, true);

console.log('\n== GEOGRAPHY ==');
// Bounding box guards against a transposed or mistyped coordinate
const BOX = { latMin: 40.9, latMax: 42.1, lngMin: -82.6, lngMax: -80.8 };
let out = P.concat(F).filter(p => p.la < BOX.latMin || p.la > BOX.latMax || p.ln < BOX.lngMin || p.ln > BOX.lngMax);
out.length ? out.forEach(p => fail(`${p.n} sits outside the expected region (${p.la}, ${p.ln})`))
           : pass('all coordinates inside the expected bounding box');

console.log('\n== DUPLICATES ==');
const names = {};
P.concat(F).forEach(p => { names[p.n] = (names[p.n] || 0) + 1; });
const dupes = Object.entries(names).filter(([, n]) => n > 1);
dupes.length ? dupes.forEach(([n, c]) => fail(`"${n}" appears ${c} times`))
             : pass('no duplicate names');

console.log('\n== SOURCE COVERAGE ==');
// Every numbered entry in a numbered source should appear exactly once.
const numbered = { N5: 100, TSG: 23 };
Object.entries(numbered).forEach(([key, total]) => {
  if (!S[key]) return;
  const found = new Set([...HTML.matchAll(new RegExp(`\\["${key}","#(\\d+)"\\]`, 'g'))].map(m => +m[1]));
  const missing = [];
  for (let i = 1; i <= total; i++) if (!found.has(i)) missing.push(i);
  missing.length ? fail(`${key}: missing #${missing.join(', #')}`)
                 : pass(`${key}: all ${total} numbered entries present`);
});

console.log('\n== RANK BALANCE ==');
AREAS.forEach(a => {
  const n = P.filter(p => p.a === a.id && p.t === 1).length;
  const tot = P.filter(p => p.a === a.id).length;
  if (!tot) return;
  n === 0 ? fail(`${a.n}: no must-see, so the must-see filter yields an empty region`)
          : pass(`${a.n}: ${n} must-see of ${tot}`);
});

console.log('\n== KNOWN HAZARDS ==');
HTML.includes('document.write') ? fail('document.write present — it broke this page once, do not reintroduce it')
                                : pass('no document.write');
/<script src="[^"]*"><\/script>/.test(HTML) ? pass('external script tags present (expected)') : null;
HTML.includes('localStorage') ? pass('localStorage used (wrap every call in try/catch)') : null;

console.log('\n' + (bad ? `>>> ${bad} PROBLEMS` : '>>> DATA OK'));
process.exit(bad ? 1 : 0);
