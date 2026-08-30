#!/usr/bin/env python3
# Guard: no literal \uXXXX (or a stray \n / \t / \/) escape may leak into the VISIBLE HTML of any built
# page. These render fine inside a <script> (the browser un-escapes them) but show up as raw text like
# "’" when written into page prose (standfirst, meta, placeholders). This scans every built page,
# strips <script>…</script>, and FAILs on any leaked escape. Wired into rebuild-city.py and npm test so
# it can never regress. Usage: python3 tools/check-escapes.py
import re, os, glob, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = (glob.glob(os.path.join(ROOT, "cities", "*.html"))
         + glob.glob(os.path.join(ROOT, "Singapore", "*.html"))
         + glob.glob(os.path.join(ROOT, "Vietnam", "*.html"))
         + [os.path.join(ROOT, "cleveland.html"), os.path.join(ROOT, "index.html")])
# literal backslash-escapes that should never appear in rendered text
LEAK = re.compile(r'\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}|\\[ntr]\b|<\\/')
fails = []
for p in sorted(PAGES):
    if not os.path.exists(p):
        continue
    h = open(p, encoding="utf-8").read()
    visible = re.sub(r'<script[\s\S]*?</script>', '', h)   # rendered text only
    visible = re.sub(r'<style[\s\S]*?</style>', '', visible)
    for m in LEAK.finditer(visible):
        s = max(0, m.start() - 45)
        fails.append((os.path.relpath(p, ROOT), m.group(0), visible[s:m.start() + 15].replace("\n", " ")))
if fails:
    print(">>> FAIL — literal escape(s) leaked into visible page text (use real characters in prose):")
    for path, esc, ctx in fails[:40]:
        print(f"   {path}: {esc!r}  …{ctx}…")
    print(f"\n{len(fails)} occurrence(s). Fix the build script's prose to use the real character, not a \\u escape.")
    sys.exit(1)
print(f">>> PASS — {sum(os.path.exists(p) for p in PAGES)} pages clean; no literal escapes in visible HTML.")
