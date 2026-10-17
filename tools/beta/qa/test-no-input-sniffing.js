#!/usr/bin/env node
/**
 * QA guard (D-48, R8 gap #6): the page must behave the same for a reader and for a probe. No client code may branch
 * resource loading (or anything a gate measures) on whether the input is human or scripted. PERF-19 (f0296778b) held the
 * sheet's 960w photo only when no tap or key had happened in the last second; that lowered the measured session weight
 * without changing a real session, and D-48 rejected it.
 *
 * Fails on, in tools/beta/client/*.js:
 *   1. navigator.webdriver: automation detection, anywhere;
 *   2. navigator.userActivation: gesture-state detection, anywhere;
 *   3. gesture-recency gating of a resource load: one statement that reads a gesture timestamp (gest, userAt, lastTap,
 *      lastKey, lastInput, lastGesture, recentGesture, userActive) AND loads or holds a resource (src, srcset, fetch(,
 *      new Image, prefetch, preload, 960w, 500w, held).
 * Allowed: Event.isTrusted used to tell the reader's own gestures from the page's programmatic scrolls and moves (UI
 * behaviour such as atlas-nav.js's restore logic), as long as it gates no resource load (rule 3 still applies).
 * Usage: node tools/beta/qa/test-no-input-sniffing.js   (exit 1 on any hit)
 */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..', 'client');
const GESTURE = /\b(gest|userAt|lastTap|lastKey|lastInput|lastGesture|recentGesture|userActive)\b/;
const LOAD = /\b(src|srcset)\b|fetch\(|new Image\b|prefetch|preload|\b(960|500)w?\b|\bheld\b/;
const hits = [];
for (const f of fs.readdirSync(DIR).filter(n => n.endsWith('.js'))) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  // statements, roughly: split on ; and newlines so a one-line ternary chain stays together
  src.split('\n').forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, '');
    if (/navigator\.webdriver/.test(code)) hits.push(`${f}:${i + 1}: navigator.webdriver (automation detection)`);
    if (/navigator\.userActivation/.test(code)) hits.push(`${f}:${i + 1}: navigator.userActivation (gesture-state branching)`);
    for (const st of code.split(';')) if (GESTURE.test(st) && LOAD.test(st)) hits.push(`${f}:${i + 1}: a gesture timestamp gates a resource load: ${st.trim().slice(0, 120)}`);
  });
}
for (const h of hits) console.log('  FAIL  ' + h);
console.log(hits.length ? `>>> FAIL — ${hits.length} input-sniffing hit(s) (D-48)` : '>>> PASS — no client code branches on human vs scripted input (D-48)');
process.exit(hits.length ? 1 : 0);
