'use strict';
/**
 * i18n.js — UI string catalogue plumbing (M3-03, ROUND-3 gap #8). Platform + FE-B.
 *
 *   t('shell.skip')                     → "Skip to content"
 *   t('foot.about', {places, guides})   → "{places} places across …" with values filled (values are data: never translated)
 *   tn('chg.closures', n)               → the `.one` variant when n === 1
 *
 * Catalogues live in tools/beta/i18n/<locale>.json and are published to beta/assets/i18n/. The build renders in one
 * locale at a time (setLocale). `pseudo` is a test locale: every catalogue string is wrapped in ⟦ ⟧ and its Latin
 * letters swapped for full-width forms, so any English left on a pseudo page is a hard-coded string (test-i18n.js).
 * A locale reaches visitors only when its catalogue says "reviewed": true — reviewed() lists those; the switcher
 * stays out of the page until there are two.
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'i18n');
const load = l => JSON.parse(fs.readFileSync(path.join(DIR, l + '.json'), 'utf8'));
const EN = load('en');
let LOCALE = 'en', CAT = EN;

const pseudoText = s => '⟦' + s.replace(/\{[a-z]+\}|[A-Za-z]/g, c => c.length > 1 ? c : String.fromCharCode(c.charCodeAt(0) + 0xFEE0)) + '⟧';

function setLocale(l) {
  LOCALE = l;
  if (l === 'en') CAT = EN;
  else if (l === 'pseudo') CAT = Object.assign({}, EN, { locale: 'en-XA', strings: Object.fromEntries(Object.entries(EN.strings).map(([k, v]) => [k, pseudoText(v)])) });
  else CAT = Object.assign({}, EN, load(l), { strings: Object.assign({}, EN.strings, load(l).strings) });
  return CAT;
}
const locale = () => CAT.locale;
const used = new Set();
function t(key, vars) {
  const s = CAT.strings[key];
  if (s == null) throw new Error(`i18n: no catalogue string "${key}" (add it to tools/beta/i18n/en.json)`);
  used.add(key);
  return vars ? s.replace(/\{([a-z]+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;
}
const tn = (key, n, vars) => (n === 1 && CAT.strings[key + '.one'] != null ? t(key + '.one', vars) : t(key, Object.assign({ n }, vars)));

/** Locales a visitor may pick: every catalogue in tools/beta/i18n/ whose "reviewed" is true. */
function reviewed() {
  return fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort().map(f => load(f.slice(0, -5))).filter(c => c.reviewed === true)
    .map(c => ({ locale: c.locale, name: c.name }));
}
/** i18n D-41: locales the switcher offers — human-reviewed ("reviewed": true → tier 'human') AND AI-reviewed (a translator
 *  agent plus an independent AI reviewer recorded in "review": {by: "ai", …} → tier 'ai'). An 'ai' locale is labelled on
 *  every page while active (client/locale.js); "reviewed": true stays reserved for a human sign-off. en first. */
function offered() {
  return fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort().map(f => load(f.slice(0, -5)))
    .map(c => c.reviewed === true ? { locale: c.locale, name: c.name, tier: 'human' }
      : c.review && c.review.by === 'ai' && c.review.reviewer ? { locale: c.locale, name: c.name, tier: 'ai' } : null)
    .filter(Boolean).sort((a, b) => (a.locale === 'en' ? -1 : b.locale === 'en' ? 1 : a.locale < b.locale ? -1 : 1));
}
/** Published catalogues: beta/assets/i18n/<locale>.json for every catalogue file (reviewed or not). */
function files() {
  return fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort().map(f => [`assets/i18n/${f}`, fs.readFileSync(path.join(DIR, f))]);
}

module.exports = { t, tn, setLocale, locale, reviewed, offered, files, pseudoText, used, EN };
