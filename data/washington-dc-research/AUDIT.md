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

## Stage 8 — Dulles→DC corridor + Eden Center food discovery (2026-08-21)
Request: expand DC food along the corridor BETWEEN DULLES AND DC, weighted to Eden Center + the inner-NoVA
immigrant-food corridor. Discovery pass → **FOOD_CORRIDOR.json (16 NEW, non-dup)**. Every place
merit-measured, ≥2 credible sources (Yelp=0), open/closed fact-checked. NO coordinates (geocode is a later
stage). Areas: FCITY 13, FAIRFAX 1, RESTON 1, TYSONS 1. Cuisines: Vietnamese 6, Chinese 3, Thai 2, +Bakery,
Ethiopian, Bolivian, Coffee, Korean, Lao, Burmese, Persian. 2 notable-closed kept flagged.
ADDED (with the acclaim measured):
- **Eden Center (FCITY):** Nha Trang (WaPo $20 Diner + Vietcetera + ArlMag), Banh Cuon Thang Long (NoVA Mag
  review + Tyler Cowen + ArlMag), Banh Cuon Saigon (ArlMag + Visit Falls Church), Huong Binh Bakery & Deli
  (Falls Church News-Press + ArlMag). Skipped existing (Song Que, Thanh Son, Truong Tien, Huong Viet, Rice
  Paper, Present, Pho 75) + already-added (Chả Ốc Gia Huy, Chả Lụa Ngọc Hưng).
- **Inner-NoVA corridor (FCITY):** Meaza (Ethiopian, Bailey's — Washingtonian Cheap Eats + WaPo + NoVA Mag),
  Luzmila's (Bolivian salteñas — Tyler Cowen + Washingtonian 2025), Mark's Duck House (Seven Corners/Willston
  Cantonese — Washingtonian + NoVA Mag), Uncle Liu's Hot Pot (Sichuan — WaPo + Tyler Cowen), Padaek (Seng
  Luangrath's Lao — Washingtonian 100 Very Best + WaPo), Duangrat's (Thai — Washingtonian Blue Ribbon +
  Tyler Cowen), 9292 Korean BBQ (Annandale — Washingtonian 2023 KBBQ + City Cast), DRiP Cà Phê (Annandale
  viral Viet coffee — Annandale Today + City Cast).
- **Dulles corridor:** Peter Chang Herndon (RESTON — Washingtonian 100VB + WTOP; James Beard finalist 2022),
  Shamshiry (TYSONS/Vienna Persian, koobideh — Washingtonian Cheap Eats 4yrs + WAMU Kojo Nnamdi).
- **Notable CLOSED, kept flagged:** Myanmar Restaurant (Burmese, Tyler Cowen "best in metro" + WaPo tea-leaf
  salad + FCNP; Yelp shows permanently closed 2026), Four Sisters (Merrifield Viet institution, WaPo +
  Washingtonian + NoVA Mag; closed May 2023).
MEASURED & DROPPED (mention ≠ merit / <2 credible / weak sourcing / padding):
- VietFoods (Google/RG ~3.9 — below floor). Saigon Bakery & Deli (banh mi — padding vs Huong Binh, no 2nd
  credible). Banh Mi Oi (Eden — genuinely viral on TikTok but only anonymous-creator sourcing, no editorial;
  hold pending verified-creator/editorial). Viet Royale (CLOSED per Yelp, not essential). El Catrin (Seven
  Corners — only ArlMag, 1 credible). Kalpasi (Herndon Chettinad — only NoVA Mag, 1 credible; high Yelp
  volume but gate needs 2 credible). Cheng's Asian House (Chantilly — Google 4.4 but no credible editorial).
  Kabobi by The Helmand (Herndon Afghan — RG 4.5/903 but no credible editorial; Helmand lineage noted).
  Laziz Kabob (Sterling Afghan — NoVA Mag mention only). Shilla Bakery (Annandale — CVB listings only).
  Crisp&Juicy / Spin Pollo / Sardi's (Peruvian chicken — Falls Church Times blog + Yelp only; El Pollo Rico
  already covers). Bombay Bistro (temporarily CLOSED). Mémoire Cà Phê (that's Portland OR — not Annandale).
  Various pupuserias (Blanca's, La Familiar — no 2-credible editorial; Salvadoran already represented).
NOTE: FAIRFAX's only corridor add (Four Sisters) is closed, but the dataset already carries open FAIRFAX
tier-1s (Elephant Jumps, etc.), so the per-area ≥1-tier-1 invariant is unaffected. Coordinates deferred to
the geocode stage; WaPo Meaza + Duangrat's Washingtonian URLs corrected after an initial mis-paste.

## Stage 8b — Eden Center + corridor build (2026-08-20)
Added FOOD_EDEN.json (2 user-requested Eden Center stalls: Chả Ốc Gia Huy, Chả Lụa Ngọc Hưng — sourced
Vietcetera + Arlington Mag + WaPo + Eden Center official) + FOOD_CORRIDOR.json (16). Registered 5 more
sources (Falls Church News-Press, Annandale Today, City Cast DC, Visit Falls Church, WAMU) → 44 total.
Consolidated **185 candidates** (76 sights + 109 food; FCITY 35), sourcecheck PASS. Geocode wave: only
Mark's Duck House (med) + Uncle Liu's (med, found CLOSED) resolved; the rest UNVERIFIED (WebSearch can't
surface NoVA/Eden place-pins). **The 2 user-named stalls were placed at the Eden Center complex coordinate
(38.87361,-77.15389, WIKIPEDIA) at LOW confidence + a note** (exact unit pins pending geocode-helper) so
they appear on the map. Closed found + flagged: **Uncle Liu's Hot Pot** (renamed "— CLOSED" in name +
registry key, shown flagged); Myanmar Restaurant + Four Sisters remain flagged-closed (UNVERIFIED, off-page).
Rebuild: **page 116 → 120 pins** (75 sights + 45 food). Gates: sourcecheck PASS · geocheck exit 0 (NOTE: 2
low stall pins) · statuscheck CONSISTENT · buildcheck PASS. validate/test green. 65 UNVERIFIED → helper.

## Stage 9 — Global / non-American food fill, DC proper + Arlington (2026-08-22)
Focus: DTN/USHAW/DUPONT/GTWN/CAPHILL/ARL (the District core + Arlington), filling thin/missing non-American
cuisines. Added **FOOD_GLOBAL_DC.json (20 places)**; proposed 4 new outlets in SOURCES_GLOBAL_DC.json
(NYTIMES, SOUTHERNFOODWAYS, RESY, ESQUIRE) — no new creators. No coordinates (geocode stage). Method: source
palette + Washingtonian "Where the Ambassador of ___ Eats" series (Singapore/Georgia/Indonesia) as leads,
then vetted each against ≥2 credible sources / a lone institutional authority (Michelin), fact-checked
OPEN/CLOSED for 2025/26. Every place cross-checked against the existing F array — zero duplicates.

By area: USHAW 7 · DTN 4 · CAPHILL 4 · DUPONT 3 · GTWN 1 · ARL 1. By cuisine: Japanese 3 (Sushi Taro,
Daikaya, Izakaya Seki) · Chinese/Sichuan 3 (Chang Chang, Panda Gourmet, Tiger Fork) · Filipino 2 (Purple
Patch, Kayu) · Thai 2 (Baan Siam, Thai Square) · Ethiopian 2 (Letena, Das) · plus Peruvian/Nikkei (China
Chilcano), Nigerian (The Continent), Georgian (Supra), Ghanaian (Appioo), Malaysian (Makan — CLOSED),
Trinidadian/Caribbean (Cane), Indian (Daru), Taiwanese-Cambodian (Maketto).

KEPT — merit measured (each ≥2 credible, or lone Michelin):
- Institutional authority (lone-sufficient): Sushi Taro (MICHELIN star), Cane (Bib 2020/24/25), Supra (Bib),
  Das Ethiopian (Bib 2021), China Chilcano (Bib 2017–20), Makan (Bib 2021, CLOSED), Chang Chang & Daru
  (MICHELIN Guide) — all still corroborated by a 2nd credible source.
- Award/major-press: Purple Patch (WaPo Sietsema Restaurant of the Year 2023), Izakaya Seki (WaPo first
  4-star, 2026), Kayu (Washingtonian 100VB 2026 + WaPo review), Baan Siam (Washingtonian 100VB + NYT 25
  Best), Letena (Washingtonian 100VB 2025 + WaPo), Tiger Fork (WaPo top-10 #7 + Washingtonian), Thai Square
  (WaPo + Tyler Cowen + ARLnow), Daikaya (Infatuation + Gayot + TimeOut), Panda Gourmet (WaPo $20 Diner +
  Tyler Cowen "best ever" + WCP), Maketto (WaPo + Infatuation), Appioo (Eater "essential Ghanaian" +
  Washingtonian West African), The Continent (Infatuation + Destination DC; Nigerian gap-filler, chef Ope
  Amosu).
Ambassador/where-X-eats pieces used as leads: Washingtonian "Where the Ambassador of Singapore Eats" (2019),
"…of Georgia" (2020) → Supra, "…of Indonesia" (2019). (The Singapore piece's home pick is Rasika, already
in F; no in-scope open Singaporean restaurant met the bar.)

CLOSED found:
- **Makan** (Malaysian, Columbia Heights) — MICHELIN Bib 2021; closed Feb 2025. Kept flagged (closed:true,
  "— CLOSED") as the notable Malaysian benchmark for a gap otherwise empty in the District.
- **Etete** (Ethiopian, Shaw) — benchmark since 2005 but Yelp shows permanently closed by mid-2026;
  DROPPED in favor of open Letena + Das (both stronger merit). 
- **Little Serow** (Northern Thai, Dupont; Johnny Monis, Bon Appétit Top 10) — permanently closed Sep 2022;
  DROPPED (open Baan Siam covers Northern Thai).
- **Thamee** (Burmese, H St) — closed Jan 2022; DROPPED (Burmese already represented flagged-closed by
  Myanmar Restaurant in FCITY; no open in-scope Burmese found).
- **Bad Saint** (Filipino, Columbia Heights) — closed; DROPPED (Purple Patch + Kayu cover Filipino, open).

MEASURED & DROPPED (mention ≠ merit / <2 credible-of-truth / padding):
- **Kabob Bazaar** (Arlington Persian) — Tyler Cowen "best Persian in DC area" + Yelp 4.x/454, but only ONE
  credible source of truth (Tyler Cowen); no 2nd editorial/institutional. Dropped; Persian stays represented
  in the corridor (Shamshiry/Joon/Amoo's, Tysons). Persian-in-District left as a stated gap.
- **Pappe** (Indian, Logan Circle) — Infatuation only (1 credible), no confirmed Michelin/award; Indian
  already covered in-District (Rasika, Bombay Club, Daru). Dropped as padding.
- **Mala Tang** (Arlington Sichuan hot pot) — "Best of Arlington" appetizer + high Yelp, but no confirmed
  WaPo/Washingtonian/Tyler Cowen credible; only 1-ish. Dropped (measure, no 2nd credible).
- **Agora / Ezme** (Dupont Turkish) — Greek-Turkish/Mediterranean, mixed reviews, no strong 2-credible for a
  purely-Turkish authentic pick; Turkish left unfilled rather than padded.
- **Q by Peter Chang** — in Bethesda MD, OUT of scope. Peter Chang Arlington — near-duplicate of existing
  Peter Chang (Herndon) + Chang Chang; skipped to avoid brand padding.
NOTE: additions only (no removals) — every area keeps its existing ≥1 tier-1. Coordinates + pin placement +
final status re-verify deferred to the shared geocode/status stage. Budget: ~32 WebSearches (WebFetch is
egress-blocked here, per project rules — all vetting done via search snippets).

---

## Global / non-American NoVA corridor food expansion — FOOD_GLOBAL_NOVA.json

**Stage:** food discovery (non-American, immigrant-food gaps) across FCITY / FAIRFAX / TYSONS / RESTON.
**Method:** WebSearch only (WebFetch blocked). ~40 searches, shared budget. Started from the DC-region
immigrant canon + the ambassador/"where X eats"/cuisine-specific credible guides named in the brief.
Verified OPEN/CLOSED (2025/26) and >=2 credible sources per place; Yelp/TripAdvisor/Google used only to
measure rating/volume and confirm open status, never as a recommender.

**Added: 17 places (all open, all >=2 credible sources), distributed:**
- FCITY (5): Bamian (Afghan; Washingtonian Cheap Eats '15 + WaPo '06 + Tyler Cowen), Lighthouse Tofu
  (Korean sundubu; WaPo review Jan-2026 + NoVA Mag), Seoul Prime (upscale Korean; Washingtonian + NoVA
  Mag + Arlington Mag), Yeshi Kitfo (Ethiopian kitfo; Tyler Cowen "best kitfo, period" + Annandale Today),
  Fairfax Inn (Filipino; Asian Fortune + FXVA).
- FAIRFAX (4): China Star (Sichuan; Tyler Cowen default pick + New Yorker "Where's Chang?"), Eerkin's
  Uyghur Cuisine (Uyghur/Central Asian, halal; Washingtonian Cheap Eats + NoVA Mag 50 Best), Wow Nepal
  (Nepali; Tyler Cowen "the real thing" + FFXnow), Southeast Impression (Malaysian/Singaporean/Thai,
  halal; WaPo review + NoVA Mag First Bite).
- TYSONS (5): Jiwa Singapura (Singaporean fine dining, Tysons Galleria; WaPo "sublime" + Washingtonian),
  Chef Tan (Hunan, Vienna; WaPo 3-star + #6 on 2026 10-Best-New list + FFXnow), Esaan Tumbar (Isaan Thai,
  McLean; Washingtonian 100 Very Best #62 + WaPo $20 Diner), Royal Nepal Bistro (Nepali, Vienna; NoVA Mag
  + Tysons Reporter), Cha Street Food (Pakistani, Tysons; Washingtonian modern-Pakistani + FFXnow).
- RESTON (3): Maharani Palace (upscale Indian, Herndon; NoVA Mag 14-Best-Asian '25 + NoVA Mag First Bite),
  Kabobi by The Helmand (Afghan fast-casual, Herndon; NoVA Mag + Baltimore Mag / Qayum Karzai Helmand
  lineage), Chaska (Pakistani, Sterling; Washingtonian modern-Pakistani + DMV-Eats viral creator).

**Ambassador / "where X eats" / cuisine-guide series used:** Washingtonian (Cheap Eats, Best Korean BBQ
'23, 100 Very Best, "4 Modern Pakistani Restaurants in NoVA" '24, upscale-Korean/Singaporean features);
WaPo (Tim Carman/Elazar Sontag reviews, $20 Diner, 10 Best New Restaurants '26); Northern Virginia
Magazine (50 Best '25, 14 Best Asian '25, First Bite reviews, Korean BBQ guides); Tyler Cowen's Ethnic
Dining Guide + Marginal Revolution; Arlington Magazine; FFXnow; Tysons Reporter; Annandale Today; Asian
Fortune; Visit Fairfax (FXVA); The New Yorker (Trillin); Baltimore Magazine.

**MEASURED & DROPPED (mention != merit / geography / closed):**
- F&F Filipino Fusion (Chantilly) — had NoVA Mag "Alice's Latest Obsession" + PBS Signature Dish, but
  Yelp shows PERMANENTLY CLOSED (Mar-2026); non-notable-enough to keep flagged -> dropped.
- Bombay Bistro (Fairfax) — Washingtonian awards but CLOSED / relocating (Yelp) -> dropped.
- Fortune Chinese Seafood (Falls Church + Reston) — NoVA Mag dim-sum rec but CLOSED (dim sum moved to
  Saigon 1975) -> dropped.
- La Caraquena (Falls Church, Venezuelan) — Washingtonian/WaPo raves + Diners-Drive-Ins-Dives, but CLOSED
  since 2017; too-long-closed to carry as a live-corridor flag (Luzmila's already holds the Latin slot).
- Da Rae Won (hand-pulled jajangmyeon) — WaPo-praised but in Beltsville MD (out of scope).
- Celebration by Rupa Vira (modern Indian) — WaPo + NoVA Mag Best-of-NoVA, strong, but ASHBURN (Loudoun,
  past Dulles) = out of the brief's geographic scope -> dropped.
- Bombay Tandoor (Tysons), Toosso / Spice Circle (Pakistani), Charcoal Kabob/Chicken, Tiki Thai (Reston),
  Peruvian/Bolivian chicken shops (Annandale/Falls Church), Baek Ban (Chantilly Korean, Washingtonian
  solo review only) — could not clear >=2 INDEPENDENT credible sources with in-scope location; held out
  rather than padded. Baek Ban is a strong single-source lead (Washingtonian Oct-2025) worth a re-check.

**Gaps stated, not filled:** No in-scope Burmese meeting the bar since Myanmar Restaurant closed (Thamee
is DC); no credibly-sourced in-scope Sri Lankan found; Taiwanese and Persian/Turkish/Peruvian-Bolivian
are already represented in the dataset (A&J; Shamshiry/JOON/Amoo'/Kazan; Luzmila's) and no new place
cleared the merit bar without padding.

**Note on sourcing rigor:** Maharani Palace rests on two Northern Virginia Magazine pieces (a "best-of"
list = a real vote, plus a review) — single outlet, flagged. Wow Nepal / China Star / Bamian / Yeshi
Kitfo lean on Tyler Cowen as a rank-1 authority; each was paired with a second INDEPENDENT outlet
(FFXnow / New Yorker / WaPo / Annandale Today) so none rests on Tyler Cowen alone.

**New sources proposed:** SOURCES_GLOBAL_NOVA.json — creator DMVEATS (dmv3ats, corroboration only) and
outlets ASIANFORTUNE, NEWYORKER, BALTMAG (DCIST already in palette). NO coordinates written (geocoding is
a separate stage). Shared files (geocodes.json, sources.json, dataset) untouched.

## Stage 9/10 — Non-American food expansion + build (2026-08-21)
Request: expand NON-AMERICAN food via credible/authentic/viral sources incl. Washingtonian's "Where the
Ambassador of ___ Eats" series (which was NOT previously used). Two discovery agents (DC-core + NoVA),
strict merit bar. Added **36 places** (FOOD_GLOBAL_DC 20 + FOOD_GLOBAL_NOVA 16 after dropping Maharani
Palace, 1-credible): Sushi Taro (Michelin), Purple Patch (WaPo RotY), Panda Gourmet (Tyler Cowen), Supra
(Georgian — from the ambassador series), Das/Letena (Ethiopian), Cane (Trinidadian, Michelin Bib), Daru
(Indian), China Chilcano (Nikkei), The Continent (Nigerian), Appioo (Ghanaian), Maketto, Baan Siam, Kayu;
China Star (Peter Chang orig), Eerkin's (Uyghur), Chef Tan (Hunan), Esaan Tumbar (Isaan), Lighthouse Tofu,
Bamian, Cha Street Food, Fairfax Inn (Filipino), etc. **Taxonomy: added AFRICAN + CARIBBEAN cuisine buckets;
mapped Georgian→MED, Nigerian/Ghanaian→AFRICAN, Trinidadian→CARIB, Uyghur/Hunan/Singaporean/Cambodian/Isaan/
Nikkei→ASIAN** (no mis-fallback to US). **Sources expanded to 51**: registered NYT, Southern Foodways,
Esquire, Resy, Asian Fortune, New Yorker, Baltimore Mag + creator DMV Eats. Merit drops (no padding): Kabob
Bazaar/Pappe/Mala Tang/Maharani Palace/Baek Ban (1-credible), out-of-scope Celebration/Da Rae Won. Closed
found + flagged: Makan, Yeshi Kitfo, Jiwa Singapura (+ prior Uncle Liu's/Myanmar/Four Sisters). Geocode: 13
high pinned, 23 UNVERIFIED (WebSearch can't surface most neighborhood place-pins; refused 2 unsourced coords
+ 1 viewport — never fabricated). Consolidated **221 candidates** (76 sights + 145 food), sourcecheck PASS.
Rebuild: **page 120 → 133 pins** (75 sights + 58 food). Gates: sourcecheck PASS · geocheck exit 0 (NOTE 2
low) · statuscheck CONSISTENT · buildcheck PASS. validate/test green. 88 UNVERIFIED → helper.
