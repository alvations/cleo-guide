# Harrisburg · York · Lancaster & Amish Country — AUDIT (append-only, one section per stage per wave)

## Stage 0 — scope & taxonomy (2026-10-02)
- Region: South-Central PA — Harrisburg/West Shore, Hershey/Derry, Carlisle/Cumberland Valley, York County,
  Lancaster city, Lancaster County Amish country, Gettysburg edge. Areas are the travel units a visitor
  actually plans by (each county seat + Hershey + the Amish heartland as its own region because it is the
  single biggest draw and would swamp Lancaster city if merged). State College/Altoona deliberately excluded
  (own map).
- Cuisine taxonomy leads with the PA Dutch canon (PA Dutch & Smorgasbords, Bakeries/Shoofly/Whoopie, Pretzels &
  Snack Factories, Chocolate/Candy/Ice Cream, Markets, Farms) then the general set.
- Collections: Iconic, Civil War & Gettysburg, Amish & Plain Country, Factory Tours & Makers, Museums, History,
  Parks, Outdoors, Railroads, Family, Oddities, Free.
- consolidate.py never synthesizes a source (an unsourced record fails GATE 1 rather than borrowing a
  "WIKIPEDIA" label as the State College template did).

## Stage 1 — sources (2026-10-02)
- Source palette registered in `SOURCES_HBG.json` → `data/sources.json` cities["harrisburg-pa"] (29 outlets, each
  with a `credible` rationale): LNP, PennLive, YDR, York Dispatch, WITF, WGAL, ABC27, FOX43, CBS21, TheBurg, Fly,
  the five CVBs (Discover Lancaster, Visit Hershey & Harrisburg, Explore York, Destination Gettysburg, Visit
  Cumberland Valley), NPS, Smithsonian, James Beard, DCNR, PHMC, Visit PA, Uncovering PA, Atlas Obscura,
  Wikipedia, USA Today 10Best, Travel + Leisure, Food Network, NYT. Creator seed from nationalCreators: Peter
  Santenello (Amish-country videos) — to vet against a findable piece in W5.

## Stage 2 — discovery wave W1 (food canon) — BLOCKED (2026-10-02)
- WebSearch budget for the session was exhausted (200/200, shared across ~16 concurrent agents) at the start of
  W1. 1 query returned results ("best shoofly pie Lancaster County") — leads only: Bird-in-Hand Bakery & Cafe,
  Dutch Haven (sources: frommers.com local-favorites page, lancasterpa.com bakeries page, aol.com article; none
  yet confirmed as a 2nd credible source). 4 further queries refused by the budget cap.
- Channel counts this wave: editorial 0 · creators 0 · travel sites 0 · local 0 — **0 places added**. Nothing
  fabricated; no records written. Per CLAUDE.md, discovery cannot proceed without WebSearch (WebFetch blocked).
