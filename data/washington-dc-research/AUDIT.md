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

## Stage 2 — Food canon extraction (2026-08-20, food-discovery agent)
Wrote `FOOD_CANON.json` — 28 signature/unique-canon places, no coords (geocoding is a later stage).
Method: named the DC-unique canon first (half-smoke/mumbo, Ethiopian & East African, Salvadoran pupusas,
Chesapeake seafood/blue crab, jumbo slice, Eden Center Vietnamese, Annandale Korean, NoVA South Asian/
Afghan), then WebSearch'd each for merit + ≥2 credible sources, cross-checking open/closed.
- Coverage: USHAW 6, ARL 6, FCITY 5, DUPONT/CAPHILL/DTN 3 each, GTWN 1, ALEX 1. Each covered area has ≥1 t:1.
- Cuisines: Seafood/oyster/crab 7+2+2, Ethiopian 3, Vietnamese 4, Pizza 3, Half-Smoke 2, Salvadoran 2,
  Indian 2, Korean 2, + Pakistani/Afghan/Eritrean/Jumbo Slice/Italian.
- Merit anchors: Ben's (JB America's Classics), Chercher (Michelin Bib), Rasika (JB Best Chef Mid-Atlantic
  2014), Fiola Mare (Michelin-star chef Trabocchi), Timber (Bon Appetit Best New / JB semifinalist), Hank's
  (Washingtonian 100 Very Best), Rappahannock/Salt Line/Ethiopic (Washingtonian + Eater).
- No closed places found among the 28 (all verified open as of Aug 2026).
- MEASURED & DROPPED / not added (canon considered but below bar or out of scope): Dukem kept (t2) but
  portions noted slimmed; jumbo-slice rivals Duccini's/Bestolli/Jumbo Slice Pizza dropped (only Pizza Mart
  kept as the archetype — no padding of near-identical late-night slices); NoVA pupuserias Dona Azucena/
  Dona Bessy/Mana dropped (Yelp/TripAdvisor-only, no ≥2 credible editorial); Aracosia/Amoo's (Afghan/Persian
  fine dining) skipped — Tysons/McLean is outside this agent's assigned area set.

## Stage 2 — Extraction: FINE/MODERN dining (FOOD_FINE.json, 2026-08-20)
Agent = acclaimed/fine + modern bench across the region, institutional-authority first. 31 places, all ≥2
credible (or lone Michelin/JB). Distribution: DTN 7, USHAW 7, DUPONT 2, GTWN 3, CAPHILL 4, ARL 2, ALEX 2,
TYSONS 2, RESTON 1, FCITY 1. Tally: 17 carry a Michelin STAR source, 1 Bib Gourmand (L'Ardente), 5 name a
James Beard win/nom. Every one of the assigned suburbs (ARL/ALEX/TYSONS/RESTON) got ≥1 surviving t1.
Method: verified against the **2025 MICHELIN Guide Washington, D.C.** (announced 18 Nov 2025 — no new stars,
only subtraction was Reverie which CLOSED), Wikipedia's DC Michelin list, Washingtonian 100 Very Best 2025,
and the 2024/2025 James Beard winners; suburbs cross-checked on NoVA Mag / Arlington Mag / Visit Alexandria /
FXVA / RAMW. NO coordinates (geocoding is a separate stage).

Notable acclaim captured: minibar & Jont (2-star), Bresca/Dabney/Oyster Oyster/Causa/Albi/Rania/Fiola/Cranes/
Kinship/Tail Up Goat/Xiquet/Imperfecto/Rooster & Owl/Pineapple and Pearls/Rose's Luxury (1-star); JB Best
Chef Mid-Atlantic — Rob Rubba/Oyster Oyster (2023) & Carlos Delgado/Causa (2025); JB Outstanding Chef —
Michael Rafidi/Albi (2024); JB Best New Restaurant — Maydan (2018); Kwame Onwuachi/Dogon (JB winner,
Washingtonian #2, Esquire/CNT Best New 2024-25).

OPEN/CLOSED fact-checked (2025/2026 open) for every entry. **Reverie — dropped (permanently CLOSED 2025,
its star subtracted).** All 31 written here are verified open.

MEASURED & DROPPED (mention ≠ merit / area-fit / anti-padding):
- Sushi Nakazawa DC (1-star) — dropped: NYC import, sushi omakase better left to the ASIAN/omakase canon lane;
  avoids padding the DTN tasting cluster (already 7).
- Metier (1-star, Ziebold, below Kinship) — dropped: near-identical sibling to Kinship already included;
  anti-padding. Kinship kept as the standout.
- Little Pearl (1-star, Silverman) — dropped: third Aaron Silverman Barracks Row venue; kept Rose's Luxury +
  Pineapple and Pearls, dropped this to avoid one-operator over-representation in CAPHILL.
- Gravitas (1-star, Ivy City) & Masseria (1-star, Union Market NE) — dropped: sit in NE pockets with no clean
  area id in this region's 11-area map (Ivy City / Union Market are outside MALL/DTN/…); flagged for the
  orchestrator if an NE bucket is added.
- Acqua Bistecca by Michael Mina — MEASURED as a Tysons candidate, DROPPED: it is actually at City Ridge
  (20 Ridge Square NW, DC Tenleytown), NOT Tysons, and Tenleytown falls outside the assigned areas. Replaced
  the intended Tysons #2 with Clarity (Vienna, RAMMY winner).
- El Cielo (1-star, Colombian tasting), Rania note: Rania is 427 11th St NW (Penn Quarter/DTN), NOT the Falls
  Church vegetarian spot of a similar name — corrected during address verification.
- Suburban chains measured & dropped for padding/merit: Fleming's, Morton's, Ruth's Chris, Fogo, Davio's,
  Cooper's Hawk (Reston/Tysons) — national steakhouse chains, no institutional/vote merit; Red's Table
  (Reston) and Maple Ave Restaurant (Vienna) measured as solid but kept the region to 1 strong Reston (PassionFish)
  and 2 Tysons (JOON + Clarity) to avoid stacking.

## Stage 3-6 — Fine dining + geocode + build + gates (2026-08-20)
Food extraction: FOOD_CANON.json (26 after de-dup) + FOOD_FINE.json (31). Fine bench = 17 Michelin stars
(minibar/Jônt 2-star), 1 Bib (L'Ardente), 5 James Beard; suburbs anchored on Washingtonian/RAMMY (JOON,
Clarity, Vermilion, 2941). Merit-measured; dropped near-duplicates (Métier, Little Pearl, Sushi Nakazawa)
and chains. **Gate fix:** added SMITHSONIAN to ELITE_SOLO across sourcecheck.py/research.js/geocode-status.py/
build-washingtondc.py/guidekit (the Smithsonian operating a national museum is institutional ground truth,
like NPS) — the 7 free Smithsonians now clear GATE 1. Consolidated **118 candidates**; sourcecheck PASS
(7 lone-institutional). Geocode (2 agents): sights 61/61 (56 high · 5 med · 0 unverified, all open); food
31/57 pinned (24 high · 7 med), 26 UNVERIFIED (restaurant place-pins unreadable via WebSearch → helper).
**Closed found + flagged:** 3 Michelin rooms shuttered late-2025/early-2026 — Cranes, Kinship, Tail Up Goat
(status:closed; null coords → gate-dropped). Address reconciliations: Rappahannock→1150 Maine Ave SW;
Imperfecto→1124 23rd St NW; Cielo→1137 N Highland St (Clarendon). Merged 118 → geocodes.json. **Build: page
92 pins** (61 sights + 31 food). Gates: **sourcecheck PASS · geocheck PASS · statuscheck CONSISTENT ·
buildcheck PASS** (map centre 38.89,-77.04 inside DC pins). validate/test green. index.html card relinked live;
CITIES.md row + scope note added; 26 UNVERIFIED → GEOCODE-BACKLOG.md for the helper.

## Creator / viral & social-source pass — Northern Virginia (2026-08-20)

Ran the creator+viral pass for the NoVA corridor (ARL/ALEX/TYSONS/RESTON/FCITY/FAIRFAX).
Artifacts: CREATORS.json (creators+attach+rejected), VIRAL_NOVA.json (4 new places, no coords).

**Creators vetted & registered (4):**
- HYPEFOODIES — Diana Nguyen & CK Keat, Springfield VA. IG ~120K / TikTok ~99K. NoVA-suburb mom-and-pop beat; Washingtonian/WJLA/NBC features + own festival (WTOP). Findable: Truong Tien reel (TikTok 7281293878265646378).
- KEITHLEE — ~17M TikTok. National, but documented Aug-2024 DMV tour with named NoVA stops (Okonomi Fairfax, Flavor Hive Annandale); WaPo/WJLA/Axios coverage. Corroborating creator, not institutional.
- ADORKANDHERFORK — Sandie S., IG ~52K, DMV food creator since 2018 with NoVA beat (Toimoi, Ballston Grill Kabob, Incheon).
- CHILIPEPPERCOOKS — Shihan Chowdhury, TikTok ~1.8M / IG ~179K. Thai-chili recipe creator + Flavor Hive co-founder (noted: owner, not independent reviewer).

**Creators rejected (4):** @dcspot (promotional listicle acct, scale/beat unverifiable), Milan/Bethesda beef-Wellington creator (~700K but MD + recipe creator, not NoVA reviewer), Eniclerico mukbang (scale unsurfaced, no NoVA beat), DMV Besties (collective, no single verifiable following).

**Viral places added (4)** — each ≥2 credible (creator + editorial), fact-checked OPEN, no coords, not already in dataset F:
- Truong Tien — FCITY (Eden Center) t1. WaPo (Tim Carman) review + HYPEFOODIES. Hue royal Vietnamese.
- Flavor Hive — FCITY (Annandale) t2. NoVA Mag First Bite + WTOP + CHILIPEPPERCOOKS (founder). Viral halal chip-bag bowls; opened 7/2025, expanding.
- Okonomi Asian Grill — FAIRFAX (Fairfax) t1. WaPo + KEITHLEE. 'Asian Chipotle' build-your-own bowls; Keith Lee Effect (~100→~1000 orders/day).
- Toimoi Bakery — FAIRFAX (Chantilly) t2. NoVA Mag (Mosaic opening) + ADORKANDHERFORK; Arlington Magazine 'Eat This Now'. Viral Asian cube croissants.

**Measured & dropped:**
- Sister's Thai (Tysons/Capital One Center) — coverage is opening announcements (NoVA Mag, Tysons Reporter) for an aesthetic-driven 5-location mini-chain; no creator virality/merit rave documented. Padding risk in TYSONS. DROP.
- Maggiano's, North Italia, Luna Food Hall (Tysons) — chains / new-opening buzz, no merit or creator virality. DROP.

**Notes:** No coordinates written (geocoding is a separate stage). Shared files (sources.json/geocodes.json) untouched — orchestrator merges CREATORS.json via tools/merge-creators.py. Source keys used are all in consolidate.py's SRC_LABEL (WAPO, NOVAMAG, WTOP) plus the four new creator keys. WebSearch budget: ~11 searches used.

---

## Stage: NoVA suburbs food deepening (ARL / TYSONS / RESTON / FCITY / FAIRFAX) — FOOD_NOVA.json

**Method.** WebSearch-only (WebFetch blocked). Started from each area's editorial of record (Northern
Virginia Magazine 50 Best + Best-of-NoVA, Washingtonian 100 Very Best / Cheap Eats, Washington Post /
Tom Sietsema, ARLnow/Arlington Magazine, WTOP, Visit Fairfax/FXVA, RAMMY finalists) plus Tyler Cowen's
Ethnic Dining Guide for the immigrant-food bench. Measured every candidate (award/vote, major-press or
verifiable rave, or high rating w/ real volume) before adding; fact-checked OPEN/CLOSED; NO coordinates.
Cross-checked all names against dataset F — zero duplicates. ~18 searches used.

**Added: 30 places** — ARL 6, TYSONS 6, RESTON 3, FCITY 10, FAIRFAX 5; every area ≥1 tier-1 (14 t1 / 16 t2).
Each carries ≥2 credible sources (Yelp/TA/Google used only to measure, never cited).
- ARL: El Pollo Rico (t1, Peruvian chicken), Texas Jack's BBQ (t1), Ruthie's All-Day (t1, JB-nom/RAMMY),
  The Liberty Tavern (t1, Washingtonian 8yr), Maison Cheryl (t2, French), Rus Uz (t2, Uzbek).
- TYSONS: Nostos (t1, Greek, NoVA #2), Aracosia McLean (t1, Afghan, Washn 100VB), Maple Ave (t2),
  Amoo's (t2, Persian), Wren (t2, Japanese izakaya, WaPo 25-best-new), Kazan (t2, Turkish institution).
- RESTON: Founding Farmers Reston Station (t1, RAMMY/T+L), Pisco y Nazca (t2, Peruvian), Zeffirelli (t2, Italian).
- FCITY: Ellie Bird (t1, 2024 RAMMY New Rest), Thompson Italian (t1, Washn 100VB), Taco Bamba flagship (t1),
  Kogiya (t1, Annandale KBBQ), Peking Gourmet Inn (t1, Peking duck), A&J (t2, Taiwanese), Song Que (t2,
  Eden banh mi), To Sok Jip (t2, Korean stews), Hong Kong Palace (t2, Sichuan), Thanh Son Tofu (t2, Eden).
- FAIRFAX: Elephant Jumps (t1, Thai, Washn #19), Honest Grill (t1, Centreville KBBQ, Washn 100VB),
  Artie's (t2, GAR American), Sisters Thai Mosaic (t2, viral Thai), The Wine House (t2, wine bar).

**Measured & dropped:**
- Mokomandy (Sterling) — NoVA Mag #1 2019, but PERMANENTLY CLOSED 2020 (pandemic). Too long-closed for a live guide.
- La Caraqueña (Falls Church) — Venezuelan, Washingtonian/DDD acclaim, but CLOSED 2017.
- Water & Wall (Arlington) — Tim Ma New American, WaPo/Washingtonian praise, but CLOSED 2017.
- Four Sisters (Merrifield) — famous Vietnamese, but the sit-down Merrifield location shows CLOSED (now Four Sisters Grill); status ambiguous, dropped to avoid presenting a closed room.
- Bombay Bistro (Fairfax) — Fairfax location CLOSED (Rockville still open); dropped.
- Bazin's on Church (Vienna) — 18-yr New American, SOLD and closed under old owners, revamping; status uncertain.
- Sabores Tapas Bar (Arlington) — NoVA Mag + Yelp Top-100 US, but Yelp counts 0 and couldn't confirm a 2nd credible recommender in budget. HELD (re-add if a 2nd editorial source surfaces).
- Kabob Bazaar (Arlington) — Persian since 1993, but merit thin (longevity only, no award/major-press); Persian already covered by Amoo's. DROP (padding).
- Anatolian Bistro (Herndon) — 4.7 Turkish but low review volume, no major press; Turkish covered by Kazan. DROP.

**Notes:** No coordinates (geocoding is a separate stage). Shared files untouched. NoVA Sisters Thai here is
the established Mosaic District location (NoVA Mag review + Arlington Magazine feature) — distinct from the
Tysons/Capital One opening a prior agent dropped as padding. Two non-palette source keys used pending
registry wiring: TYLERCOWEN (Tyler Cowen's Ethnic Dining Guide) and VIETCETERA (Vietnamese editorial);
GAYOT/ROADFOOD/STAYARLINGTON/VIRGINIALIVING/WASHINGTONORG also referenced as corroboration.

## Stage 7 — NoVA corridor expansion (2026-08-20)
Request: deepen Fairfax/Reston/Arlington/Falls Church/Tysons/McLean + everything between Dulles and DC,
from popular travel blogs / viral creators / credible food & travel guides; merit-rank, fact-check,
location-verify. Added **new FAIRFAX area** (Fairfax City, Merrifield/Mosaic, Chantilly). Expanded the
source palette to **39** (added Arlington Mag, Infatuation, Washington City Paper, PoPville, Axios DC,
WUSA9, NBC4, Virginia Tourism, Thrillist, Time Out, Tyler Cowen's guide, Vietcetera, Roadfood, Virginia
Living, Arlington CVB, Gayot). Three discovery agents (all merit-measured, ≥2 credible, fact-checked open):
- **FOOD_NOVA.json (30)** across ARL/TYSONS/RESTON/FCITY/FAIRFAX — El Pollo Rico, Aracosia, Nostos, Taco
  Bamba, Peking Gourmet, Kogiya, Elephant Jumps, Founding Farmers, Ellie Bird, Thompson Italian, etc.
  Closed dropped (Mokomandy, Water & Wall, La Caraqueña...); padding dropped (Kabob Bazaar, Anatolian).
- **Creator/viral pass** → CREATORS.json (4 vetted: Hypefoodies, Keith Lee, Adorkandherfork, Chilipepper-
  cooks; 4 rejected) + VIRAL_NOVA.json (Truong Tien, Flavor Hive, Okonomi, Toimoi). `merge-creators.py`
  fixed for multi-part keys + registered the 4 creators into sources.json.
- **SIGHTS_NOVA.json (15)** — National Museum of the US Army, Workhouse Arts, Reston Town Center/Lake Anne,
  Turner Farm observatory (DarkSky 2026), Signature Theatre (Tony), Dark Star Park, DEA Museum. Mosaic
  District promoted from FCITY t2 → FAIRFAX t1 (dedup).
Consolidated **118 → 167 candidates** (76 sights + 91 food), all 12 areas, sourcecheck PASS. Geocode (2
agents): sights 15/15 (11 high, 3 med, 1 unverified=Dark Star); food 10/34 pinned (4 high, 6 med), 24
UNVERIFIED (Eden Center stalls + NoVA restaurants → helper). Relocation caught: To Sok Jip → 7123 Columbia
Pike. Merged 49 → geocodes.json. **Rebuild: page 92 → 116 pins** (75 sights + 41 food). Gates:
**sourcecheck PASS · geocheck PASS · statuscheck CONSISTENT · buildcheck PASS** (map centre still on DC,
12 areas). validate/test green. index card 116; CITIES.md + backlog updated. 51 UNVERIFIED → helper.
