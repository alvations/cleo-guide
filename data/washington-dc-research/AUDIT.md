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
