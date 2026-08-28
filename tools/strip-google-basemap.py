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
import sys, os, glob
from engine_guard import strip_google, forbidden_hits, FORBIDDEN




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
