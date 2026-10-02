# Miami · Fort Lauderdale · Everglades — AUDIT ledger (append-only)

Follows docs/PIPELINE.md (stages 0→6) and docs/RUN-2026-10-02.md §5a. One dated section per stage per wave.

## 2026-10-02 · Stage 0 — Scope & taxonomy
- **Region:** Broward (Fort Lauderdale, Hollywood, Dania Beach, Pompano, Davie) → Miami-Dade (the city, Miami
  Beach, Coral Gables/Coconut Grove/Key Biscayne, Hialeah/Doral, South Dade) → the Glades edge: Everglades
  National Park (Ernest Coe/Royal Palm/Flamingo, Shark Valley, Gulf Coast/Everglades City), Biscayne National
  Park, Big Cypress National Preserve + the Tamiami Trail (Miccosukee, airboats).
- **Areas (9, NYC-style by district):** FTL · NMIA · WYN · DTB · LHAV · MBCH · CGCG · SDADE · GLADE — targets in
  RESUME.md sum to 500 (NYC density, per brief). Why: they map to how visitors and locals actually divide the
  metro (Broward vs Dade; the Beach vs the mainland; the Cuban west side; the Haitian/arts north side; the farm
  belt; the parks) and keep tiers graded within comparable ground.
- **Cuisine taxonomy:** canon-first — CUBAN, BAKE (pastelitos/key lime pie), SEAF (stone crab), HAIT, CARIB,
  PERU, VENCO (arepas), LATAM (Nicaraguan/Argentine/Brazilian/Mexican), GLADF (conch/gator/frog legs), FARM
  (Redland tropical fruit), MKT, US, BURG, EU, MED, ASIAN, COF, BAR, VIRAL. Tags name the kitchen's own
  tradition (frita → CUBAN; a Cuban bakery → CUBAN+BAKE).
- **Collections:** ICON, BEACH, DECO (Art Deco/MiMo), ART (murals/galleries), MUS, HIST, PARK, WILD
  (Everglades/wildlife), BOAT (airboats/islands), ENT, FAM, ODD, FREE.
- **Food canon (named before searching):** Cuban sandwich & medianoche, croquetas, pastelitos + ventanita
  cafecito/colada, the frita, stone crab, Haitian griot, Peruvian ceviche, arepas, key lime pie, conch fritters,
  Nicaraguan fritanga, Redland tropical fruit (Robert Is Here milkshakes), gator & frog legs at the Glades edge.

## 2026-10-02 · Stage 1 — Discover sources (wave F1) — BLOCKED
- Seed outlet palette written to `SOURCES_SEED.json` (29 outlets with `credible` rationale; registered into
  data/sources.json on the first `rebuild-city.py` run).
- WebSearch: 1 call succeeded (geocode-method probe, Versailles place pin via google.com `!3d!4d`); every
  subsequent call refused — session budget 200/200 exhausted (shared across the ~16 concurrent agents).
  No places were extracted; nothing fabricated. Discovery resumes when the search budget is raised/reset.

## 2026-10-02 (session 2) · Stages 1–3 — Wave F1/S1 discovery + fact-check
- Search log: `_miami_searchlog.md` (every call). Budget assumed 200/session, shared with any subagent.
- **Food (FOOD_F1.json, 42):** Michelin 2026 — 1×2★ (Robuchon) + 13×1★ Miami + Chef's Counter at MAASS (FTL);
  18 Bib Gourmands (2025 list of 14 + 2026 new Barra Callao/Cotoa/Double Luck; To Be Determined held — location
  unknown). Canon: Versailles (MICHELIN+NT+TimeOut), Havana Harry's (NT+MICHELIN_EDITORIAL), El Mago de las Fritas
  (Eater 38+NT), Joe's Stone Crab (Eater+NT+Infatuation via TripExpert), Chez Le Bebe & Chef Creole (NT+Infatuation),
  Cvi.che 105 (Infatuation+TimeOut+NT Best Ceviche 2024); JBF 2026 semifinalists Recoveco, Amara at Paraiso, Bar Bucce.
- **Key hygiene:** Michelin best-of guides (best Cuban restaurants) → `MICHELIN_EDITORIAL` (one ordinary source);
  JBF semifinalist listings → `JAMESBEARD`.
- **Held single-source:** see `_PENDING_LEADS.md` (Sarussi — Man v. Food mention only reported second-hand, so not
  counted; Enriqueta's, Latin Cafe 2000, La Carreta Hialeah, Casavana, La Esquina del Lechon, Islas Canarias, Dos
  Croquetas, Cafe La Trova, Samán Arepas, El Arepazo 2, Las Arepas de Maria, Arepa Point, Piman Bouk, Naomi's Garden).
- **Sights (SIGHTS_S1.json, 21):** NPS (Anhinga Trail, Shark Valley, Pa-hay-okee, Flamingo) + NatGeo/Frommer's;
  Lonely Planet (Miami must-sees, South Beach, Fort Lauderdale) + Culture Trip FTL + Time Out + Wikipedia articles.
- **Channel mix so far:** institutional (Michelin/JBF/NPS) 39 · editorial of record (NT/Eater/Infatuation) 8 ·
  travel sites (LP/TimeOut/NatGeo/Frommer's/Culture Trip) 21 · creators 0 (Little Haiti creator query found none).
- Area assignment of Recoveco / Bar Bucce provisional (WYN) — confirm at geocode.

## 2026-10-02 (session 2) · Stages 3–6 — waves 2–7, geocode, build, go-live
- **Discovery total:** 166 places (food 72 · sights 94 incl. closed). Channels: institutional (Michelin stars/Bib/
  recommended 2022–26, JBF 2026 semifinalists, NPS) 31 lone-authority + many corroborating; editorial of record (New
  Times, Infatuation, Eater, Time Out, Caplin News); travel sites (Lonely Planet, Frommer's, Fodor's, NatGeo, Atlas
  Obscura, Roadside America); tourism boards (GMCVB, Visit Lauderdale, Paradise Coast, Visit Florida); creators
  (Mark Wiens → Versailles; Burger Beast registered; Earth Trekkers, Florida Rambler as corroboration).
- **MEASURED & DROPPED / held:** see `_PENDING_LEADS.md` — single-source leads never added (Hialeah & Kendall
  Infatuation picks, Doral GMCVB picks, arepa spots, key lime pie, burgers, South Beach Infatuation list, Sun
  Sentinel critic picks, Rustic Inn). Aventura/Sunny Isles search returned only OpenTable/SEO → nothing kept.
  Sarussi Subs removed (Man v. Food mention only second-hand).
- **Geocode (3 background waves, 101 searches):** w1 30/63 · w2 27/66 · w3 14/49 pinned (Wikipedia published coords
  dominate; med = park-wide or third-party points). 95 UNVERIFIED held by the gate — restaurant place pins never
  surfaced via WebSearch summaries. Rejected: estimated coords for Le Jardinier/Cote, Phuc Yea downtown point,
  Big Cypress Oasis north-of-trail point, Greynolds = Arch Creek point, Stiltsville "approximate", Dante Fascell bay point.
- **Closures:** Miami Seaquarium — CLOSED (12 Oct 2025; Local10/WLRN), Fiola Miami — CLOSED (22 Jun 2025; NT/Time Out),
  Lion & the Rambler — CLOSED (NT listing). Havana Harry's 2025 shutdown, reopening unconfirmed → unknown.
- **Area fix:** Recoveco → SDADE (6000 SW 74th St, South Miami).
- **Build:** `rebuild-city.py miami-fl --build` → 71 on page (59 sights + 12 food); sourcecheck 166 PASS; geocheck PASS
  (2 block-level pins flagged for re-verify: South Pointe Park, Hometown Barbecue); statuscheck CONSISTENT (0 unchecked
  on page); buildcheck PASS; validate + test green. Card relinked live; CITIES.md row added.
