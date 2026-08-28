#!/usr/bin/env python3
# strip-google-basemap.py — remove ALL Google base-map machinery from an engine-derived guide page.
#
# WHY: the Cleveland engine (cleveland.html) ships an optional Google base-layer system — key-required
# g_* layers, an "ADD GOOGLE API KEY" button, setGoogle()/promptKey()/GoogleMutant loader, and a
# mountMap comment. Every page cloned from the engine inherits it, and it surfaces "API key required"
# to viewers (e.g. when a Google layer is engaged, or on the dead code paths). The guides only ever use
# FREE, no-key tiles (CARTO / OpenStreetMap / Esri), so this strips the Google surface entirely.
#
# It is CONTENT-PRESERVING (CLAUDE.md rule 2): it asserts the number of place records (la:/,n:") is
# unchanged, that the free base layers + core map functions survive, and that ZERO Google tokens remain
# — refusing to write on any mismatch. Idempotent: re-running on a clean page is a no-op that still
# verifies 0 tokens.
#
#   python3 tools/strip-google-basemap.py cleveland.html cities/*.html      # strip listed files
#   python3 tools/strip-google-basemap.py --check cleveland.html cities/*.html   # verify only, exit 1 if any Google token
import re, sys, os, glob

# fonts.googleapis.com stylesheet links are allowed; everything else Google-maps is not.
FORBIDDEN = ["API key", "maps.googleapis.com", "GoogleMutant", "googleMutant",
             "promptKey", "setGoogle", "g_road", "ADD GOOGLE", "GKEY", "cle_gkey"]

def strip_google(h):
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

def forbidden_hits(h):
    nofonts = h.replace("https://fonts.googleapis.com", "")
    return [t for t in FORBIDDEN if t in nofonts]

def process(path, check_only):
    h = open(path, encoding="utf-8").read()
    if check_only:
        hits = forbidden_hits(h)
        if hits:
            print(f"  FAIL  {path}: Google surface present {hits}")
        return not hits
    n_la, n_nm = h.count("la:"), h.count(',n:"')          # per-record tokens (content preservation)
    h2 = strip_google(h)
    assert h2.count("la:") == n_la and h2.count(',n:"') == n_nm, \
        f"record count changed in {path} (la:{n_la}->{h2.count('la:')} n:{n_nm}->{h2.count(chr(34))}) — refusing to write"
    for anc in ("const BASES", "mountMap", "markBaseChips", "P.forEach"):
        assert anc in h2, f"structural anchor {anc!r} lost in {path} — refusing to write"
    hits = forbidden_hits(h2)
    assert not hits, f"Google surface survived in {path}: {hits} — a strip pattern no longer matches the engine; fix strip-google-basemap.py"
    if h2 != h:
        open(path, "w", encoding="utf-8").write(h2)
        print(f"  stripped  {path}")
        return True
    print(f"  clean     {path}")
    return True

def main():
    args = sys.argv[1:]
    check_only = "--check" in args
    files = []
    for a in args:
        if a == "--check": continue
        files += glob.glob(a)
    if not files:
        print("usage: python3 tools/strip-google-basemap.py [--check] <file.html> ..."); sys.exit(2)
    ok = True
    for f in sorted(set(files)):
        r = process(f, check_only)
        ok = ok and r
    if check_only:
        print(">>> " + ("PASS — no Google base-map surface in any listed map." if ok
                        else "FAIL — Google 'API key' surface present; run without --check to strip."))
    sys.exit(0 if ok else 1)

if __name__ == "__main__":
    main()
