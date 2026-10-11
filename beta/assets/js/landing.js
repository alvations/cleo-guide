/* generated copy of tools/beta/client/landing.js (minified) — do not edit here */
(function () {
'use strict';
var Cleo = window.Cleo || {};
var out = document.getElementById('results');
var input = document.getElementById('cleo-q');
if (!out || !input || !Cleo.searchIndex || !Cleo.renderHits) return;
function clear() { input.value = ''; show(''); input.focus(); }
function show(q) {
if (!q) { out.hidden = true; out.innerHTML = ''; return; }
Cleo.searchIndex().then(function (data) {
if (input.value.trim() !== q) return;
out.hidden = false;
Cleo.renderHits(out, data, q, clear);
}, function () { out.hidden = false; Cleo.indexFailed(out); });
}
var q0 = ''; try { q0 = new URLSearchParams(location.search).get('q') || ''; } catch (e) {}
if (q0) { input.value = q0; show(q0.trim()); }
var t; input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { show(input.value.trim()); }, 150); });
if (Cleo.kbNav) Cleo.kbNav(input, out);
var form = input.form;
if (form) form.addEventListener('submit', function (e) {
e.preventDefault(); show(input.value.trim());
if (out.scrollIntoView) out.scrollIntoView({ block: 'start' });
});
})();

