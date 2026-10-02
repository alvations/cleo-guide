#!/usr/bin/env python3
# _tokyo_golive.py — refresh Tokyo's go-live surfaces from the built page's real counts. Run UNDER the shared lock.
# Edits ONLY: Japan/index.html CARD:tokyo, index.html CARD:japan, data/countries.json japan.live, docs/CITIES.md tokyo row.
import json, os, re, sys
R = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ds = json.load(open(os.path.join(R, "data/tokyo.dataset.json"), encoding="utf-8"))
geo = json.load(open(os.path.join(R, "data/geocodes.json"), encoding="utf-8"))["cities"]["tokyo"]
def ok(n):
    g = geo.get(n) if isinstance(geo, dict) else None
    return bool(g) and g.get("lat") is not None and g.get("confidence") not in (None, "unverified")
P = [r for r in ds["P"] if ok(r["n"])]; F = [r for r in ds["F"] if ok(r["n"])]
disc = len(ds["P"]) + len(ds["F"]); rend = len(P) + len(F)
areas = len({r["a"] for r in P + F})
print("rendered", rend, "sights", len(P), "food", len(F), "areas", areas, "discovered", disc)
# 1) Japan hub card
p = os.path.join(R, "Japan/index.html"); s = open(p, encoding="utf-8").read()
card = f'''<!-- CARD:tokyo -->
    <a class="city" href="../cities/tokyo.html">
      <p class="kicker">東京 · 23 special wards · Tama · Kantō day trips</p>
      <p class="nm">Tokyo</p>
      <p class="desc">Ward by ward like New York's boroughs — Chiyoda, Chūō, Minato, Shinjuku, Shibuya, Taitō, Sumida-Kōtō, then Jōnan, Jōsai, Jōhoku and Jōtō, the Tama area and the Kantō day-trip ring. Kanda soba, Edomae sushi and unagi, monjayaki, yōshoku and the Michelin bench beside century-old shinise.</p>
      <p class="stat">{rend} places · {len(P)} sights · {len(F)} food · {areas} areas · growing toward ~530</p>
      <span class="go">Open Tokyo →</span>
    </a>
    <!-- /CARD:tokyo -->'''
s = re.sub(r"<!-- CARD:tokyo -->.*?<!-- /CARD:tokyo -->", card, s, flags=re.S)
open(p, "w", encoding="utf-8").write(s)
# 2) countries.json — japan live
p = os.path.join(R, "data/countries.json"); d = json.load(open(p, encoding="utf-8"))
for c in d["countries"]:
    if c.get("key") == "japan": c["live"] = True
json.dump(d, open(p, "w", encoding="utf-8"), indent=2, ensure_ascii=False); open(p, "a").write("\n")
# 3) root card — count live Japan maps from the hub
hub = open(os.path.join(R, "Japan/index.html"), encoding="utf-8").read()
nlive = len(re.findall(r'<a class="city" href="\.\./cities/', hub))
p = os.path.join(R, "index.html"); s = open(p, encoding="utf-8").read()
card = f'''<!-- CARD:japan -->
    <a class="country" href="Japan/index.html">
      <div class="flag">🇯🇵</div>
      <p class="cn">Japan</p>
      <p class="cd">Five maps — Tokyo (ward by ward), Kyoto, Osaka, Okinawa and Hokkaido — each driven toward New
        York density through the full pipeline. {nlive} of 5 maps live.</p>
      <span class="cgo">Open Japan →</span>
    </a>
    <!-- /CARD:japan -->'''
s = re.sub(r"<!-- CARD:japan -->.*?<!-- /CARD:japan -->", card, s, flags=re.S)
open(p, "w", encoding="utf-8").write(s)
# 4) CITIES.md row
p = os.path.join(R, "docs/CITIES.md"); s = open(p, encoding="utf-8").read()
row = (f"| Tokyo (JP) | `cities/tokyo.html` (linked from the Japan hub) | `data/tokyo.dataset.json` | `data/tokyo-research/` | {rend} | "
       f"live · 13 areas: 7 big wards (CYD, CHUO, MNT, SJK, SBY, TAITO, SMKT) + JONAN/JOSAI/JHOKU/JOTO compass groups + TAMA + KANTO day trips. "
       f"**{disc} discovered, {rend} rendered** ({len(P)} sights + {len(F)} food); every place ≥2 credible or lone Michelin/UNESCO; pins from Michelin venue pages, "
       f"Wikipedia infoboxes and Wikidata P625 only. Held/UNVERIFIED in `_pending_w2.json` + geo `unverified`. Below the ~530 target — continue from `data/tokyo-research/RESUME.md`. "
       f"Rebuild: `python3 tools/rebuild-city.py tokyo --build`. |")
lines = s.split("\n"); idx = [i for i, l in enumerate(lines) if l.startswith("| Tokyo")]
if idx: lines[idx[0]] = row
else:
    j = max(i for i, l in enumerate(lines) if l.startswith("| ") and "`cities/" in l)
    lines.insert(j + 1, row)
open(p, "w", encoding="utf-8").write("\n".join(lines))
print("go-live surfaces refreshed; Japan maps live:", nlive)
