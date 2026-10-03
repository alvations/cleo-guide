# Madison W3a shared-doc edits (run under the shared lock)
p="index.html"; h=open(p,encoding="utf-8").read()
a=h.index("<!-- CARD:madison-wi -->"); b=h.index("<!-- /CARD:madison-wi -->")
h=h[:a]+h[a:b].replace("49 places mapped (64 researched)","53 places mapped (72 researched)")+h[b:]; open(p,"w",encoding="utf-8").write(h)
p="docs/CITIES.md"; c=open(p,encoding="utf-8").read()
c=c.replace("| `data/madison-research/` | 49 | live (first wave) · 7 areas (CAP/UW/EAST/WEST/MVF/DANE/TRIP), target ~210; 64 researched (33 food + 31 sights), 49 pinned (32 high · 17 med), 15 UNVERIFIED","| `data/madison-research/` | 53 | live (first wave) · 7 areas (CAP/UW/EAST/WEST/MVF/DANE/TRIP), target ~210; 72 researched (38 food + 34 sights), 53 pinned (35 high · 18 med), 19 UNVERIFIED")
open(p,"w",encoding="utf-8").write(c)
p="docs/AGENT-PROMPTS.md"; s=open(p,encoding="utf-8").read()
s=s.replace("| 2026-10-03 | Madison | W2a+W2b (one session, ~117 searches incl. ~45 geocode) |","| 2026-10-03 | Madison | W2a–W3a (one session, ~150 searches incl. ~60 geocode) |").replace("| +50 places (3→53; 30 food/23 sights) · 41 pinned & on page (25 high/16 med); card live |","| +69 places (3→72; 38 food/34 sights) · 53 pinned & on page (35 high/18 med); card live |").replace("12 UNVERIFIED for helper | FOOD_W2{a,b,c,d}, SIGHTS_W2{,b}, SOURCES_W2, geo/_geoout_w2{a,b,c,d,_unverified}.json |","19 UNVERIFIED restaurant pins for helper; creators: State Trunk Tour accepted, Portnoy none | FOOD_W2{a-e}+W3a, SIGHTS_W2{,b,c}+W3a, SOURCES_W2, CREATORS_W3, geo/_geoout_w2{a-e,_unverified}+w3a |")
open(p,"w",encoding="utf-8").write(s)
p="docs/RESEARCH-LOG.md"; s=open(p,encoding="utf-8").read().rstrip("\n")
s+="""

### 2026-10-03 — Madison W2/W3 (geocoding channel yields)
- Wikipedia/NRHP infobox coordinates: ~90% hit when the query is "<name> Wikipedia coordinates" — the reliable
  pin channel for sights, state parks, NHLs and NRHP-listed restaurants (Quivey's Grove = John Mann House).
- latlong.net POI records for restaurants: ~50% hit, and only with `"<name>" <street address> GPS coordinates
  latitude` (or `latlong.net poi "<name>" <city> restaurant map`). `allowed_domains:["latlong.net"]` returns
  nothing useful — don't. After two misses, queue the place UNVERIFIED for tools/geocode-helper.html.
- Never type a street address from memory while writing a geocode record — use the sourced locality (rule 4a);
  caught and fixed four times this run before merge.
"""
open(p,"w",encoding="utf-8").write(s+"\n")
print("docs ok")
