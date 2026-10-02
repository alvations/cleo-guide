#!/usr/bin/env python3
# _phi_docs_w3.py — append the Philadelphia W3 run-log row (AGENT-PROMPTS) + technique notes (RESEARCH-LOG).
# Idempotent; run under the shared lock from the repo root.
p = "docs/AGENT-PROMPTS.md"; s = open(p).read()
row = ("| 2026-10-02 | Philadelphia | W3 food+sights discovery, 3 status passes, rebuild | neighbourhood guides x 2nd outlet "
       "in all 10 areas; JBF 2023-26 + NYT award lists; hoagie/water-ice canon; NPS Independence, Fairmount Park houses, "
       "Bucks/Brandywine/Montco/South Jersey sights; 7 restaurant Wikipedia pins | 422 sourced (+242; 170 on map: 149 sights "
       "+ 21 food) | Cheu Fishtown, Jansen, Italiano's, Pizza Brain, Lunar Inn, Martha, Syrenka, Hops dropped; Tony's Place "
       "flagged CLOSED; density.py worklist double-count fixed | FOOD_W3.json, SIGHTS_W3.json, SOURCES_W3.json, "
       "CREATORS_W3.json, geo/_geoout_w3_food/sights/foodpins.json |\n")
if "W3 food+sights discovery, 3 status passes" not in s:
    i = s.index("| 2026-10-02 | Philadelphia | W1+W2"); j = s.index("\n", i) + 1
    s = s[:j] + row + s[j:]; open(p, "w").write(s)
p = "docs/RESEARCH-LOG.md"; s = open(p).read()
note = """
### 2026-10-02 · Philadelphia W3 — technique notes
- **density.py double-count bug (fixed):** a research dir with a list-shaped worklist file (phi_worklist.json, _chi_worklist.json,
  …) was counted as food, inflating totals (Philadelphia showed 297 when 180 were real). density.py now skips *worklist* files.
- **Two-outlet neighbourhood method:** pull an Infatuation neighbourhood guide (names only), then ONE domain-restricted query
  (phillymag/inquirer/visitphilly) naming 5-7 of those places — each place the second outlet confirms goes in (~4-6 per search).
- **Award lists are the highest-yield queries:** James Beard semifinalist/finalist round-ups (Inquirer/Philly Mag/Billy Penn) and
  NYT best-in-America notes each cleared 3-8 lone-authority places per search.
- **Long multi-name queries fan out** into up to 7 hidden searches ("max_uses_exceeded" seen) — the 200-search session cap was hit
  after ~125 visible calls + 3 status agents (~91). Keep verification queries to 3-6 names.
- **Restaurant pins:** only restaurants with their own Wikipedia article pin (Meetinghouse, Mish Mish, Her Place, Dalessandro's,
  McGillin's, El Chingón, Max's); the rest stay UNVERIFIED for tools/geocode-helper.html.
- **Rejected pins:** Old City Hall's returned Wikipedia point sat ~150 m off 5th & Chestnut (it matched Todd House) — left unpinned;
  Upsala's returned point was ~4 km east of Germantown Ave.
"""
if "Philadelphia W3 — technique notes" not in s:
    open(p, "w").write(s + note)
print("docs updated")
