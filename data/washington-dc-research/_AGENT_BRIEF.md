# Washington DC — standing research brief (every DC agent follows this)

**Region.** Washington DC proper **+ Arlington + the Northern Virginia corridor between Dulles (IAD)
and DC** — Rosslyn/Clarendon/Ballston, National Landing, Falls Church & Annandale (Eden Center), Tysons,
McLean, Vienna, Reston, Herndon — **plus Old Town Alexandria** as the near southern edge. The spine is the
Silver Line / Dulles Toll Road axis from the monuments out to the airport. Don't wander past Dulles
(Ashburn/Leesburg) or deep into Maryland (Bethesda/Silver Spring are out of scope; Mount Vernon is an OK
Alexandria-edge day trip).

**Areas** (`a` ids, see consolidate.py): MALL · DTN · GTWN · DUPONT · USHAW · CAPHILL · ARL · ALEX ·
TYSONS · RESTON · FCITY. Every area needs **≥1 tier-1 must-see** that survives sourcing+geocoding, or the
build assert fails.

## The bar (same as every city, and stricter now)
1. **≥2 credible sources of truth** per place, OR one lone institutional authority (Michelin distinction,
   James Beard, NPS, Smithsonian). **Yelp/TripAdvisor/OpenTable/Google are open-verification only — they
   count as ZERO** toward the two; use them only to fact-check/measure, never as the recommender.
2. **A mention is not merit — MEASURE before adding** (docs/SOURCES.md "Merit bar"). Add a place only if it
   clears one of: institutional authority · a real award/vote (Washingtonian 100 Very Best, RAMMY, "Best
   of") · a verifiable famous-creator/major-press rave · **or** a genuinely high rating with real volume
   cross-checked on ≥2 platforms (rough floor Google ≥4.4 with ≥150 reviews; scale to the venue). Then rank
   within region and keep the standouts — **no padding** (don't stack four mid-tier pho/ramen/steakhouses).
   Record the measurement + keep/drop reason in AUDIT.md.
3. **Fact-check OPEN/CLOSED** against the place's own site/socials, Google/Apple "Permanently closed", or a
   news story. Closed places stay only if genuinely notable, flagged `closed:true` (name gets "— CLOSED").
4. **Never invent coordinates.** Geocoding is a separate stage; research files carry NO lat/lng.

## Ranked source palette (data/sources.json → washington-dc)
- **Institutional / authority (rank 1):** MICHELIN (DC has a full guide — stars + Bib Gourmand),
  JAMESBEARD, NPS (Mall & memorials), SMITHSONIAN (the free museums).
- **Local editorial of record (rank 1–2):** WASHINGTONIAN (100 Very Best), WAPO (Tom Sietsema), EATERDC,
  DCIST/WAMU.
- **NoVA / suburbs (rank 2–3):** NOVAMAG, ARLMAG (Arlington Magazine — "Best of Arlington"), ARLNOW
  (Arlington), TYSONSREPORTER + FFXNOW (Tysons/Fairfax), WTOP; CVBs WASHINGTONORG (Destination DC),
  VISITALEX (Alexandria), FXVA (Fairfax), VIRGINIATOURISM (Virginia.org, attractions).
- **Food guides & city media (rank 2–3):** INFATUATION (DC), WCP (Washington City Paper "Best of DC"),
  POPVILLE (openings/closings), AXIOS (Axios DC), WUSA9 / NBCWASHINGTON (local TV), and — as
  corroborating popularity only, never a lone recommender — THRILLIST, TIMEOUT, USATODAY 10Best.
- **Corroboration:** USATODAY 10Best, ATLASOBSCURA (oddities), OFFICIAL, WIKIPEDIA (published coords).
- **Creators/influencers** — welcome only when verifiably popular/authoritative (real following, findable
  content, a DC beat); vet + register in `creators`, attach as a corroborating source. A lone creator
  corroborates but is NOT an institutional authority.

**Finding MORE sources — run the planner, don't improvise.** Before a discovery wave, run
`python3 tools/find-sources.py "Washington, DC" [--cuisine "<X>"] [--seed "<Place>"] [--creators] --key washington-dc`.
It emits the credible source TYPES + the canonical WebSearch query set (critic of record, city-mag cuisine
best-of, diaspora/community media, the "Where the Ambassador of <country> eats" series, awards, verified-creator
vetting, seed-place reverse-source) and lists what's already registered so you expand the gaps. See
docs/SOURCES.md "Food, ethnic & seed-place source discovery".

## Food — start with what the region is FAMOUS for (the opening move)
Name the DC-unique canon first, then find the merit-worthy places that serve it:
- **The half-smoke** (Ben's Chili Bowl and its lineage) · **mumbo sauce** (carryout classic).
- **Ethiopian & East African** — DC has one of the largest diasporas; the U Street/Shaw "Little Ethiopia".
- **Salvadoran & Latin** — the region's signature immigrant food: **pupusas** (PG/NoVA pupuserias).
- **Chesapeake seafood** — blue crab, crab cakes, oysters, raw bars.
- **Jumbo slice** (Adams Morgan) · **Vietnamese at Eden Center** (Falls Church) · **Korean in Annandale**.
- **South Asian & Afghan** across NoVA (Indian/Pakistani/Afghan) · the deep **Michelin/James Beard** bench.

## Sights — the monumental core + free Smithsonians + the corridor
National Mall monuments & memorials (NPS), the free Smithsonian museums, the Capitol/White House/Library of
Congress/National Archives (GOV), Georgetown & the C&O Canal, Tidal Basin, Arlington National Cemetery &
the Marine Corps (Iwo Jima) Memorial, Old Town Alexandria (Torpedo Factory, King St), Great Falls, Theodore
Roosevelt Island, Wolf Trap/Kennedy Center (ENT), and out the corridor to the **Udvar-Hazy Center** (Air &
Space annex by Dulles) and Reston Town Center.

## Artifacts each agent leaves (the replication contract)
- Food/sights research JSONs in this dir (arrays for food, `{sights:[…], sources:[…]}` for sights),
  schema mirrors the Dayton files: `{t,a,cz,dish,n,address,w,closed,sources:[[KEY,url],…]}`.
- Append what you did to `AUDIT.md` (stage, method, measurement, keep/drop). Update `RESUME.md`.
- **Do not touch shared files** (geocodes.json, sources.json, research.js) — the orchestrator wires those.
