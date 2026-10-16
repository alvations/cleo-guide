/* Cleo beta — locale.js (i18n lane, D-41). Applies a second interface locale in the browser.
 * Pages are built in English. When the visitor picked another OFFERED locale (the switcher, or ?lang=), this fetches
 * assets/i18n/en.json + <locale>.json and swaps every catalogue string it finds: whole text nodes, whole element runs
 * (a template whose placeholder holds an element, e.g. "Where to {em}?"), the label attributes and the title. Values
 * filled into a template are data and pass through untouched. An AI-reviewed locale carries a visible note on every
 * page. The pre-paint snippet in <head> (render/common.js) injects this file only when a non-en locale is chosen (en
 * pages load no locale JS) and holds the paint until it is done, so nothing shifts.
 * Storage goes through Cleo.store (try/catch) or a local try/catch; a failed fetch falls back to English. */
(function () {
  'use strict';
  var d = document.documentElement;
  var KEY = 'cleo:v1:locale';
  var me = document.currentScript && document.currentScript.src || '';
  var root = me ? me.replace(/assets\/js\/locale\.js.*$/, '') : '';
  function reveal() { d.classList.remove('cleo-l10n-wait'); }
  function getStored() {
    if (window.Cleo && window.Cleo.store) return window.Cleo.store.get('locale', null);
    try { return JSON.parse(window.localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function setStored(l) {
    if (window.Cleo && window.Cleo.store) return window.Cleo.store.set('locale', l);
    try { window.localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {}
  }

  var want = 'en';
  // Injected from <head> by the pre-paint snippet, so this can run before the body is parsed.
  function init() {
    var buttons = [].slice.call(document.querySelectorAll('[data-cleo-locale]'));
    var offered = buttons.map(function (b) { return b.getAttribute('data-cleo-locale'); });
    var m = /[?&]lang=([a-z-]+)/.exec(location.search);
    want = m ? m[1] : getStored();
    if (offered.indexOf(want) < 0) want = 'en';
    if (m && offered.indexOf(m[1]) >= 0) setStored(m[1]);

    buttons.forEach(function (b) {
      var l = b.getAttribute('data-cleo-locale');
      b.setAttribute('aria-pressed', String(l === want));
      b.addEventListener('click', function () {
        if (l === want) return;
        setStored(l);
        var u = location.href.replace(/([?&])lang=[a-z-]+&?/, '$1').replace(/[?&](#|$)/, '$1');
        if (u === location.href) location.reload(); else location.href = u;
      });
    });
    if (want === 'en') { if (d.lang !== 'en' && offered.length) d.lang = 'en'; reveal(); return; }
    d.lang = want;

    function get(l) {
      return fetch(root + 'assets/i18n/' + l + '.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
    }
    Promise.all([get('en'), get(want)]).then(function (cats) {
      window.CleoL10n = cats[1].strings;                   // Cleo.t (head snippet) answers from it from now on
      apply(cats[0], cats[1], want);
      // modules redraw what they drew before the catalogue arrived — while the page is still held, so nothing shifts
      try { document.dispatchEvent(new CustomEvent('cleo:locale', { detail: { locale: want } })); } catch (e) {}
      // their follow-up work (route re-apply, pager, rows) lands in the next frames: reveal once it has (the head's 1.5 s
      // failsafe still bounds the wait)
      var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
      raf(function () { raf(function () { setTimeout(reveal, 30); }); });
    }).catch(function () { d.lang = 'en'; reveal(); });
    window.CleoLocale = { build: build, apply: apply, locale: want };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  /* ---- the swap ---- */
  var NUM = { n: 1, places: 1, guides: 1, countries: 1, checked: 1, closed: 1, pins: 1 };
  var MK = '', MK2 = '';                     // private-use markers standing for child elements
  function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, function (c) { return '\\' + c; }); }   // no '$&' (test harnesses inline scripts with String.replace)

  function build(en, to) {
    var exact = {}, tpl = [];
    var skip = en.swapSkip || [];                          // browser-only keys: their modules ask Cleo.t directly
    Object.keys(en.strings).forEach(function (k) {
      if (skip.some(function (x) { return k === x || k.indexOf(x) === 0; })) return;
      var a = en.strings[k], b = to.strings[k];
      if (b == null || a === b || k === 'land.month.names') return;
      if (!/\{[a-z]+\}/.test(a)) { exact[a.trim()] = b; return; }
      var names = [];
      var src = a.trim().split(/(\{[a-z]+\})/).map(function (p) {
        var v = /^\{([a-z]+)\}$/.exec(p);
        if (!v) return reEsc(p);
        names.push(v[1]);
        return NUM[v[1]] ? '(\\d[\\d,.]*)' : '([\\s\\S]+?)';
      }).join('');
      var lit = a.split(/\{[a-z]+\}/).map(function (x) { return x.trim(); }).sort(function (x, y) { return y.length - x.length; })[0];
      tpl.push({ k: k, lit: lit, re: new RegExp('^' + src + '$'), pre: /:$/.test(a) ? new RegExp('^' + src + '(\\s[\\s\\S]*)$') : null, names: names, to: b, len: a.replace(/\{[a-z]+\}/g, '').length,
        num: names.filter(function (n) { return NUM[n]; }).length });
    });
    // most literal text first; on a tie the numeric template wins ("21 guides" is {n} guides, not {country} guides)
    tpl.sort(function (x, y) { return y.len - x.len || y.num - x.num; });
    var enM = (en.strings['land.month.names'] || '').split(','), toM = (to.strings['land.month.names'] || '').split(',');
    function month(v) {                                   // "October 2026" → "2026年10月" (ja); other locales keep the order
      var mm = /^([A-Za-z]+) (\d{4})$/.exec(v), i = mm ? enM.indexOf(mm[1]) : -1;
      if (i < 0 || !toM[i]) return v;
      return to.locale === 'ja' ? mm[2] + '年' + toM[i] : toM[i] + ' ' + mm[2];
    }
    function fill(t, mt, tail) {
      var vars = {};
      t.names.forEach(function (n, i) { vars[n] = mt[i + 1]; });
      if ((t.k === 'land.month.h' || t.k === 'land.month.lede') && vars.month) vars.month = month(vars.month);   // FE-B W9-2: the month now opens the lede
      return t.to.replace(/\{([a-z]+)\}/g, function (x, n) { return n in vars ? vars[n] : x; }) + (tail || '');
    }
    // a placeholder holds plain text or exactly one element, never an element plus text ("{source}" ≠ "<b>X</b> + 1 more")
    var ONE = new RegExp('^' + MK + '\\d+' + MK2 + '$');
    function clean(m) { for (var j = 1; j < m.length; j++) if (m[j] && m[j].indexOf(MK) >= 0 && !ONE.test(m[j])) return false; return true; }
    function whole(core) {
      if (Object.prototype.hasOwnProperty.call(exact, core)) return exact[core];
      for (var i = 0; i < tpl.length; i++) {               // longest template first; a "…:" label may lead a data run
        if (tpl[i].lit && core.indexOf(tpl[i].lit) < 0) continue;   // cheap prefilter: a city page has ~10k text runs
        var mt = tpl[i].re.exec(core); if (mt && clean(mt)) return fill(tpl[i], mt);
        var mp = tpl[i].pre && tpl[i].pre.exec(core); if (mp && clean(mp.slice(0, -1))) return fill(tpl[i], mp.slice(0, -1), mp[mp.length - 1]);
      }
      // "203 pins verified." — a catalogue phrase closed by a full stop the template doesn't carry
      if (/[^.]\.$/.test(core)) { var r = whole(core.slice(0, -1)); if (r != null) return r + (to.locale === 'ja' ? '。' : '.'); }
      return null;
    }
    function one(s) {
      var core = s.trim();
      if (!core || !/[A-Za-z]/.test(core)) return null;
      var r = whole(core);
      return r == null ? null : s.slice(0, s.indexOf(core)) + r + s.slice(s.indexOf(core) + core.length);
    }
    // Whole string first; failing that, the string is cut finer and finer — " · " segments and parentheses, then
    // sentences, then the element markers — and each piece is tried on its own. Pieces that are data pass through.
    var CUT = [function (x) { return x.split(/(\s*·\s*|\s*[()]\s*)/); },
      function (x) { return x.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)\s*|[.!?]+/g) || [x]; },
      function (x) { return x.split(new RegExp('(' + MK + '\\d+' + MK2 + ')')); }];
    function cut(x, lv, st) {
      var r = one(x);
      if (r != null) { st.hit = true; return r; }
      if (lv >= CUT.length) return x;
      var ps = CUT[lv](x);
      if (ps.length < 2) return cut(x, lv + 1, st);
      var sub = { hit: false }, out = ps.map(function (p) { return p ? cut(p, lv + 1, sub) : p; }).join('');
      if (sub.hit) { st.hit = true; return out; }
      return cut(x, lv + 1, st);                             // this cut found nothing: try the next cut on the whole run
    }
    return function tr(s) {
      var st = { hit: false }, out = cut(s, 0, st);
      return st.hit ? out : null;
    };
  }

  var SKIP = { SCRIPT: 1, STYLE: 1, TEMPLATE: 1, NOSCRIPT: 1, TIME: 1, svg: 1, SVG: 1 };
  // DATA: a record's own words (name, write-up, note, address, source names, credits, the city's standfirst). Their own
  // text never goes through the swap; a label element inside them (e.g. .pl-k .lbl) still does.
  // CLIENT: what city.js, sheet.js, views.js, gallery.js, day.js and foryou.js draw in the browser. Those modules ask Cleo.t
  // and redraw on cleo:locale, so the page-wide swap leaves them alone (it would only guess at their composed phrases).
  var CLIENT = '#cleo-sheet, #cleo-fy, #cleo-rows-host, .g-lead-card, #cleo-view, #cleo-lens, #cleo-shown, [data-cleo-applied], .area-chips, #cleo-poi, .toast, .pager, #cleo-fyline, #cleo-nearline, .pl-why, .pl-dist, .stamp, .pl-dish, .pl-x, .nopin, .day-chip';
  var DATA = '.rail-i[data-c] .t, .rail-i[data-cz] .t, .rail-i[data-src] .t, .rail-i[data-sig] .t, .rail-i[data-gap] .t, .rail-i[data-c] .d, .rail-i[data-sig] .d, .pill[data-f="c"], .pill[data-f="cz"], .pill[data-f="src"], .pill[data-f="a"], .pl-n, .pl-w, .pl-k, .pl-ad, .pl-s, button.src, figure.photo, figcaption, .credit, .about, .method .note, h1, .dek, .g-lead, .area-sub, .area-n, [translate="no"]';
  function translateEl(el, tr) {
    var kids = [].slice.call(el.childNodes);
    if (!kids.some(function (n) { return n.nodeType === 3 && /[A-Za-z]/.test(n.nodeValue); })) return;
    if (!kids.some(function (n) { return n.nodeType === 1; })) {      // plain text run: swap the text nodes in place
      kids.forEach(function (n) { if (n.nodeType === 3) { var r = tr(n.nodeValue); if (r != null) n.nodeValue = r; } });
      return;
    }
    var els = [], shape = kids.map(function (n) {
      if (n.nodeType === 3) return n.nodeValue;
      if (n.nodeType === 1) { els.push(n); return MK + (els.length - 1) + MK2; }
      return '';
    }).join('');
    var r = tr(shape); if (r == null) return;
    var used = 0, frag = document.createDocumentFragment();
    r.split(new RegExp('(' + MK + '\\d+' + MK2 + ')')).forEach(function (p) {
      var x = new RegExp('^' + MK + '(\\d+)' + MK2 + '$').exec(p);
      if (x) { frag.appendChild(els[+x[1]]); used++; } else if (p) frag.appendChild(document.createTextNode(p));
    });
    if (used !== els.length) return;                       // never drop an element; leave the run in English instead
    while (el.firstChild) el.removeChild(el.firstChild);
    el.appendChild(frag);
  }

  function apply(en, to, l) {
    var tr = build(en, to);
    // i18n D-41 (PERF-18): a server-rendered phrase that names its key re-says itself, inside the paint hold —
    // <span data-l10n="gal.see" data-l10n-v='{"n":3}'>English</span>. Plain text only: values fill in as text, never HTML.
    [].slice.call(document.querySelectorAll('[data-l10n]')).forEach(function (el) {
      try { var s = to.strings[el.getAttribute('data-l10n')]; if (s == null) return;
        var v = JSON.parse(el.getAttribute('data-l10n-v') || '{}');
        el.textContent = s.replace(/\{([a-z]+)\}/g, function (m, n) { return n in v ? String(v[n]) : m; }); } catch (e) {}
    });
    var page = d.getAttribute('data-cleo-page');
    // Landing, hubs, What changed and city pages are catalogue-built end to end (data excepted); elsewhere only the shell.
    var scopes = /^(landing|hub|changes|city|method|notfound)$/.test(page) ? [document.body]
      : [].slice.call(document.querySelectorAll('[data-cleo-shell=topbar], .tabbar, .footer, .skip'));
    scopes.forEach(function (sc) {
      [sc].concat([].slice.call(sc.querySelectorAll('*'))).forEach(function (el) {
        if (SKIP[el.nodeName] || el.closest('svg,script,style,[data-cleo-l10n-skip]')) return;
        // a browser-drawn container keeps its own label swapped (aria-label on the host), never its drawn contents
        var host = page === 'city' && el.matches(CLIENT);
        if (page === 'city' && el.parentElement && el.parentElement.closest(CLIENT)) return;
        ['aria-label', 'title', 'placeholder', 'alt'].forEach(function (a) {
          if (!el.hasAttribute(a)) return;
          var r = tr(el.getAttribute(a)); if (r != null) el.setAttribute(a, r);
        });
        if (!host && (page !== 'city' || !el.matches(DATA))) translateEl(el, tr);
      });
    });
    var tt = tr(document.title); if (tt != null) document.title = tt;
    if (to.review && to.review.by === 'ai' && to.reviewed !== true && to.note) note(to, l);
  }

  // D-41: an AI-reviewed locale is labelled on every page while it is active.
  function note(to, l) {
    var p = document.createElement('p');
    p.className = 'l10n-note'; p.setAttribute('role', 'note'); p.setAttribute('lang', l); p.setAttribute('data-cleo-l10n-note', to.review.by);
    var a = document.createElement('a');
    a.href = 'https://github.com/alvations/cleo-guide/issues/new?labels=translation&title=' + encodeURIComponent('Japanese interface: ') +
      '&body=' + encodeURIComponent(location.href.split('#')[0] + '\n\n');
    a.rel = 'noopener'; a.textContent = to.note.report;
    var en = document.createElement('span'); en.lang = 'en'; en.textContent = to.note.en;
    p.appendChild(document.createTextNode(to.note.text + ' '));
    p.appendChild(en); p.appendChild(a);
    var bar = document.querySelector('[data-cleo-shell=topbar]');
    var anchor = document.querySelector('[data-cleo-banners]') || bar;
    // Over the landing's night hero the bar floats (position: absolute): put the note after the hero instead.
    if (bar && bar.classList.contains('on-night')) { var main = document.querySelector('main'); anchor = main && main.firstElementChild || anchor; }
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(p, anchor.nextSibling); else document.body.insertBefore(p, document.body.firstChild);
  }
})();
