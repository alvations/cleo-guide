# Madison & Dane County (WI) — AUDIT ledger (append-only)

Pipeline contract: docs/PIPELINE.md. Run protocol: docs/RUN-2026-10-02.md. One dated section per stage per wave.

## 2026-10-02 · Stage 0 — Scope & taxonomy
- **Region:** Madison (the Isthmus between Lakes Mendota & Monona) + Dane County + the classic day trips
  (Spring Green/Taliesin, New Glarus, House on the Rock, Devil's Lake/Baraboo).
- **Areas (7):** `CAP` Isthmus & Capitol Square · `UW` campus & State St · `EAST` Willy St/Atwood/Monona/north
  side · `WEST` Monroe St/Arboretum/Hilldale/Odana · `MVF` Middleton/Verona/Fitchburg · `DANE` county towns ·
  `TRIP` day trips. Why: Madison's neighbourhood identity is isthmus-centred (downtown vs campus vs east vs west);
  Dane County towns are distinct heritage towns (Norwegian Stoughton/Mount Horeb); day trips are the region's
  marquee sights (Taliesin, New Glarus, Devil's Lake) and would otherwise pull the map far out of town — kept in
  their own area so tiers are graded within region.
- **Cuisines:** Wisconsin canon first — CURD (cheese curds), FISH (Friday fish fry), SUPPR (supper clubs + brandy
  old fashioneds), TAV (taverns/brats/burgers), CREAM (Babcock/custard), BAKE (bakeries/kringle), SEA (Hmong/Lao/
  SE Asian), BREW (beer/wine/spirits), FINE (farm-to-table), plus US/PIZZA/MEX/MED/EURO/ASIAN/BREAK/MKT/FARM/VIRAL.
- **Collections:** ICON, FLW (Frank Lloyd Wright — Madison is a Wright city), CAMPUS, MUS, LAKES, OUTDOOR, HIST,
  ARTS, FAM, ODD, FREE.
- **Target:** Pittsburgh-peer ~210 (per-area targets in RESUME.md).

## 2026-10-02 · W1 food canon — Stage 1 (sources) + Stage 2 (places) — TRUNCATED by WebSearch session cap
- **Searches run:** ~22 (curds, fish fry, supper clubs/old fashioned, JB winners/semifinalists 2023–2026, JB "Ask a
  Chef: Tory Miller", Hmong/Lao, + geocode probes). Then WebSearch returned **"200 of 200 calls used"** — the session
  budget is shared by all ~16 concurrent agents and was exhausted. Per protocol: nothing fabricated; leads logged in
  `_PENDING_LEADS.md` with their URLs and what each still needs.
- **Sources accepted (SOURCES_W1.json, 14):** WSJ, CAPTIMES, ISTHMUS, MADMAG, CITYCAST, UPNORTHNEWS (reader-vote,
  corroborating only), WKOW, JAMESBEARD, VISITMADISON, TRAVELWI, INFATUATION, WPR, EXPERIENCEWI, WIKIPEDIA.
  **Rejected:** northshorefamilyadventures.com fish-fry roundup (family blog, unverified popularity — used only as a
  lead), tablejourney.com / atmosfy / joinpearl / overlookmaps (aggregators), fightcancer.org tag page (spam).
  **Note:** JB "Ask a Chef" = one credible chef recommendation, not lone institutional authority.
- **Places kept (FOOD_CANON.json, 3):** Toby's Supper Club (EAST t1 — 2025 reader vote best restaurant/fish fry/old
  fashioned + Cap Times + Isthmus + Travel WI), The Old Fashioned (CAP t1 — 2025 best curds vote + City Cast/Isthmus
  Falkenstein fish-fry pick + Infatuation), Tornado Club Steak House (CAP t2 — JB Ask-a-Chef + 2025 old-fashioned vote).
- **Held (not added):** 19 food leads + 1 sight — see `_PENDING_LEADS.md` (JB honorees lacking a sourced dish/address/
  2026 status; single-source chef picks). **Fairchild** (JB 2023 winner) held only for a sourced dish + street number.
- **Channel mix (W1):** editorial 3/3 places · institutional (JB) 1 · reader vote 3 · creators 0 (creator queries not
  reached) · local-rec 1 (City Cast).
- **Geocode:** The Old Fashioned → latlong.net POI 43.07629,-89.38356 (med; re-verify). Probe showed Google results
  return only place_id links (no !3d!4d) for restaurants; latlong.net/Wikipedia snippets do return decimals.
- **Status:** Toby's, The Old Fashioned, Tornado Club — open per 2025 reader-vote results (statusSource recorded on geocode).
