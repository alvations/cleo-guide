'use strict';
/**
 * The city page's default view, as the QA harnesses expect it (one place, so a decision changes one line).
 * D-46 (owner, 2026-10-16): Atlas is the default view; the switcher order is Atlas, Gallery, Guidebook, Insights.
 * A pin from before D-46 landed is tested with QA_DEFAULT_VIEW=gallery (W5 default, ratified on f2bf7610).
 * Checks that test the Gallery itself pin `#view=gallery` explicitly and do not read this.
 */
const DEFAULT_VIEW = process.env.QA_DEFAULT_VIEW || 'atlas';
const SWITCH_ORDER = DEFAULT_VIEW === 'atlas' ? ['atlas', 'gallery', 'guidebook', 'insights'] : ['gallery', 'atlas', 'guidebook', 'insights'];
// SPEC-v3 §1.7 first-screen art (QA-ratified 2026-10-16): 'warn' until the parts land, then 'fail'
//   PEEK_PHOTO: ≥ 1 place photo on the 390 first screen (FE-1's peek thumbnails)
//   DESKTOP_INTRO: the city name, its dek and the lead place's photo above the fold of the list column (FE-A)
const GATES = { PEEK_PHOTO: process.env.QA_GATE_PEEK_PHOTO || 'warn', DESKTOP_INTRO: process.env.QA_GATE_DESKTOP_INTRO || 'warn' };
module.exports = { DEFAULT_VIEW, SWITCH_ORDER, GATES };
