#!/usr/bin/env python3
# engine_guard.py — the SINGLE source of truth for "no Google base-map surface on any map".
#
# The Cleveland engine (cleveland.html) once shipped an optional Google base-layer system (key-required
# g_* layers, an "ADD GOOGLE API KEY" button, setGoogle()/promptKey()/GoogleMutant loader). Every page
# cloned from the engine inherited it and surfaced "API key required" to viewers. The guides use only
# free CARTO/OSM/Esri tiles, so this is removed everywhere and kept out by wiring assert_no_google() /
# strip_google() into EVERY build script, the test suite (check-google.py), and a git pre-commit hook.
#
# Import this instead of re-implementing the token list or the strip in each place:
#   import engine_guard
#   new = engine_guard.strip_google(new)      # self-heal: remove any Google surface a clone inherited
#   engine_guard.assert_no_google(new, OUT)   # then refuse to write if any survives
import re

# fonts.googleapis.com stylesheet links are allowed; the Maps tile API + its key UI are not.
FORBIDDEN = ["API key", "maps.googleapis.com", "GoogleMutant", "googleMutant",
             "promptKey", "setGoogle", "g_road", "ADD GOOGLE", "GKEY", "cle_gkey"]

def forbidden_hits(html):
    nofonts = html.replace("https://fonts.googleapis.com", "")
    return [t for t in FORBIDDEN if t in nofonts]

def assert_no_google(html, label="page"):
    hits = forbidden_hits(html)
    assert not hits, (f"Google base-map surface present in {label}: {hits} — this puts 'API key required' "
                      f"in front of viewers. Strip it (tools/strip-google-basemap.py) / fix the engine.")

def strip_google(h):
    """Remove all Google base-map machinery from an engine-derived page. Idempotent (no-op if already clean)."""
    # 1) the three key-required Google base entries at the tail of const BASES
    h = re.sub(r",\n\s*\{id:'g_road',.*?gtype:'terrain'\}", "", h, flags=re.S)
    # 2) the "ADD GOOGLE API KEY" chip appended to the base filter
    h = re.sub(r"'\)\.join\(''\)\s*\n?\s*\+\s*'<button class=\"chip warnchip\" id=\"keyBtn\">ADD GOOGLE API KEY</button>';",
               "').join('');", h)
    # 3) the gchip class marker on the chip builder (no non-free bases remain)
    h = h.replace("(b.free?'':' gchip')", "''")
    # 4) the mountMap base-layers comment (mentions the API key)
    h = re.sub(r"/\* ── Base layers.*?links handle Apple instead\. \*/",
               "/* Base layers — free, no-key tiles only (CARTO / OpenStreetMap / Esri). */", h, flags=re.S)
    # 5) the GKEY localStorage read (only the Google code used it)
    h = re.sub(r"let GKEY='';\s*try\{GKEY=localStorage\.getItem\('[a-z]+_gkey'\)\|\|'';\}catch\(e\)\{\}\n?", "", h)
    # 6) the setBase() branch that hands non-free bases to Google
    h = re.sub(r"\n\s*if\(!b\.free\)\{ return setGoogle\(b,manual\); \}", "", h)
    # 7) the whole Google loader: setGoogle() + promptKey()
    h = re.sub(r"/\* Google, via the official Maps JavaScript API \+ GoogleMutant \*/\n.*?function promptKey\(\)\{.*?\n\}\n",
               "", h, flags=re.S)
    # 8) the keyBtn click branch in the base-filter handler
    h = re.sub(r"\n\s*if\(b\.id==='keyBtn'\)\{promptKey\(\);return;\}", "", h)
    # 9) simplify markBaseChips to the aria-pressed loop (drop g_/keyBtn/GKEY logic)
    h = re.sub(r"function markBaseChips\(\)\{.*?\n\}\n",
               "function markBaseChips(){\n"
               "  document.querySelectorAll('#baseFilter .chip').forEach(c=>{\n"
               "    c.setAttribute('aria-pressed', c.dataset.v===curBase);\n"
               "  });\n}\n", h, flags=re.S, count=1)
    # 10) the appendix "BASE MAPS / why not Google" methodology prose
    h = re.sub(r"\+ '<div class=\"srcrow\"><span class=\"k\">BASE MAPS</span>.*?All are licensed for this use\.</span></div></div>'",
               "+ '<div class=\"srcrow\"><span class=\"k\">BASE MAPS</span><div class=\"t\">Free, no-key tiles'"
               "  + '<span>Only free base layers that need no key &mdash; OpenStreetMap, CARTO and Esri. "
               "Every place also carries its own Google Maps and Apple Maps links for directions.</span></div></div>'",
               h, flags=re.S)
    return h
