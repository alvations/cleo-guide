#!/usr/bin/env python3
# test-japan-tags.py — the Japan collection tagger matches WHOLE words (japan_consolidate._kw_hit).
# Regression for the substring bug: "Warner" → CASTLE ("war"), "Edogawa" → CASTLE ("edo"), "village" → CASTLE ("villa"),
# "space" → ONSEN ("spa"). True positives (plurals, romanized suffixes, the synonyms added for lost true tags) must still match.
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from japan_consolidate import collections, _kw_hit, KW

def tags(n, w=""): return collections({"n": n, "w": w}, False)
fail = 0
def chk(ok, msg):
    global fail
    print(("  PASS  " if ok else "  FAIL  ") + msg); fail += 0 if ok else 1

# false positives the substring test produced (keyword level: a place with NO tag still falls back to CASTLE by design)
chk(not _kw_hit("warner bros. studio tour tokyo", KW["CASTLE"]), "Warner Bros is not a CASTLE keyword hit ('war')")
chk("CASTLE" not in tags("Gyosen Park", "edogawa green space with gardens"), "Edogawa is not CASTLE ('edo')")
chk(not _kw_hit("bohemian village of vintage shops", KW["CASTLE"]), "village is not a CASTLE keyword hit ('villa')")
chk("ONSEN" not in tags("Tokyo Opera City", "concert hall and the ntt intercommunication space"), "space is not ONSEN ('spa')")
chk("TEMPLE" not in tags("Ishigaki-jima Limestone Cave"), "'-jima' is not the '-ji' temple suffix")
chk("UNESCO" not in tags("Aragusuku Beach, Miyako"), "Aragusuku Beach is not UNESCO ('gusuku')")
# true positives that must survive the boundary rule
chk("TEMPLE" in tags("Kinkaku-ji (Rokuon-ji)"), "'-ji' suffix still tags TEMPLE")
chk("GARDEN" in tags("Kenroku-en"), "'-en' suffix still tags GARDEN")
chk("TEMPLE" in tags("Yanaka", "three old temples and a cemetery"), "plural 'temples' still tags TEMPLE")
chk("CASTLE" in tags("Ōfune Site", "unesco jōmon prehistoric sites in northern japan"), "synonym 'prehistoric' tags CASTLE")
chk("CASTLE" in tags("Hacksaw Ridge", "wwii battlefield above urasoe"), "synonym 'battlefield' tags CASTLE")
chk("TEMPLE" in tags("Konda Hachimangū"), "synonym 'hachimangū' tags TEMPLE")
chk("ONSEN" in tags("Dōgo", "a hot spring spa town"), "'spa' as a word still tags ONSEN")
chk("CASTLE" in tags("Edo-Tokyo Museum", "edo-period city history"), "'edo' as a word still tags CASTLE")
if fail: print(f">>> FAIL — {fail} tagger case(s) wrong"); sys.exit(1)
print(">>> PASS — Japan collection tagger matches whole words")
