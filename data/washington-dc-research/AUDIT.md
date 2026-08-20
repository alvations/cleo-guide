# Washington DC — audit ledger (append-only, one section per stage)

Region = DC + Arlington + the NoVA corridor between Dulles and DC + Old Town Alexandria. Dataset-built off
the Cleveland engine, mirroring the SF/Dayton pipeline. Read `_AGENT_BRIEF.md` + `RESUME.md` first.

## Stage 0 — Scaffold (2026-08-18)
`consolidate.py` (11 areas MALL/DTN/GTWN/DUPONT/USHAW/CAPHILL/ARL/ALEX/TYSONS/RESTON/FCITY; DC cuisine
taxonomy incl. SEAFOOD/ETHIOPIAN/LATIN(Salvadoran)/SASIAN/VIET/KOREAN + half-smoke under BURG + jumbo slice
under PIZZA; sight cats incl. MON monuments + GOV government landmarks). `tools/build-washingtondc.py`
(clone of build-dayton — derives map centre/labels from pins; per-city prose rewritten). `sources.json`
washington-dc seeded (20 sources: Michelin + James Beard + Washingtonian + WaPo/Sietsema + Eater DC + DCist
+ NoVA Mag + ARLnow + Tysons Reporter/FFXnow + WTOP + NPS + Smithsonian + Destination DC/Visit Alexandria/
FXVA CVBs + USA Today + Atlas Obscura + official + Wikipedia). Empty `geocodes.json` entry; `geo/_merge_geo.py`.
Registered in `research.js` PAGE_FOR/DATASET_FOR + `geocode-status.py` DATASETS. `_AGENT_BRIEF.md`/`RESUME.md`.

## Stage 1 — Sources: seeded (see above). Michelin/James Beard/NPS/Smithsonian give strong lone-authority coverage.
## Stage 2 — Extraction: PENDING (discovery agents: food canon, Michelin/JB fine, sights + NoVA corridor).
## Stage 3-6 PENDING. Gates: --sourcecheck/--geocheck/--statuscheck/--buildcheck + render-verify.

## Stage 2 — Sights extraction (2026-08-20, sights-discovery agent) → SIGHTS.json (61 sights)
Method: canonical monumental core + free Smithsonians/federal landmarks (lone NPS/SMITHSONIAN/OFFICIAL
authority is sufficient per rule 1); lesser/edge sights carry ≥2 credible (CVB WASHINGTONORG/VISITALEX/FXVA
+ OFFICIAL/NPS/WIKIPEDIA/ATLASOBSCURA). No Yelp/TripAdvisor toward the two. NO coordinates (geocode stage).
Every one of the 11 areas has ≥1 tier-1: MALL 16(11 t1), DTN 7(3), GTWN 5(2), DUPONT 4(1), USHAW 3(1),
CAPHILL 8(4), ARL 5(2), ALEX 5(2), TYSONS 3(2), RESTON 2(1), FCITY 3(1).
Status/access fact-checks (WebSearch): Washington Monument grounds open, interior elevator/top access
intermittent — flagged in prose, not closed. National Air & Space Museum (Mall) full reopening July 1 2026
for its 50th anniversary — now open. Smithsonian Castle OMITTED (closed for multi-year renovation ~2028, not
presented as a live suggestion). Addresses verified: Udvar-Hazy 14390 Air and Space Museum Pkwy Chantilly
20151; Spy Museum 700 L'Enfant Plaza SW; Eden Center 6751 Wilson Blvd Falls Church 22044; Wolf Trap/Filene
1551 Trap Rd Vienna; Great Falls 9200 Old Dominion Dr McLean; Meadowlark 9750 Meadowlark Gardens Ct Vienna;
Arlington Natl Cemetery 1 Memorial Ave 22211; Air Force Memorial 1 Air Force Memorial Dr 22204; Reston Town
Center 11900 Market St; Mount Vernon 3200 Mount Vernon Memorial Hwy 22121; Torpedo Factory 105 N Union St;
Kennedy Center 2700 F St NW. Merit: all clear institutional authority or CVB+official corroboration; no
padding (MALL count is all genuine must-see monuments/Smithsonians, not near-duplicates). No closed places.
Corridor cap: Udvar-Hazy assigned RESTON per scope; Great Falls/Wolf Trap/Meadowlark assigned TYSONS
(McLean/Vienna); Mount Vernon assigned ALEX (edge day trip).
