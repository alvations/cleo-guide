# AUDIT — Liège (Lîdje) + the Meuse valley — append-only ledger

**City key:** `liege` (dataset city under the 🇧🇪 Belgium hub) · **Areas:** `LIE` Liège city · `LIER` around Liège.

## 2026-10-02 — Stage 0: scope & taxonomy
- Two areas mirror the other Belgian maps (city + surroundings). `LIE` = the city's quarters (Carré, Outremeuse,
  Batte, Montagne de Bueren, Guillemins, Palais des Princes-Évêques, Grand Curtius, La Boverie, Cathédrale &
  St-Barthélemy, Coteaux de la Citadelle). `LIER` = Spa & Francorchamps, Huy, the Meuse valley (Seraing/
  Val-Saint-Lambert, Chaudfontaine), the Herve plateau, Val-Dieu abbey, Blegny-Mine (UNESCO), the Ardennes edge.
- Cuisine taxonomy = the shared Belgian one (`tools/belgium_consolidate.py`) — Walloon/liégeois dishes map to
  `Belgian`/`Walloon` labels (BEL / FR), beer to `Beer` (BEER), waffles/sirop/sweets to SWEET. No taxonomy change needed.
- Target density ~145 (Antwerp 137, Brussels 139, Bruges 123): LIE ~85, LIER ~60.

## 2026-10-02 — Wave 1 (partial) — discovery + one geocode — HALTED: WebSearch session budget exhausted
**Searches run: 11** (FR-first). After the 11th the tool returned *"this session has used its web search budget
(200 of 200 WebSearch calls)"* — the cap is per session and shared by all ~17 concurrent agents, so it does not
reset by backing off (retried once; same result). Per the hard rule (never fabricate), discovery stopped here.

**Sources discovered (Stage 1):** VISITLIEGE (official Maison du Tourisme — PDF city guide + venue pages),
ROUTARD (FR guide of record), LONELYPLANET FR, WBT (Wallonie Belgique Tourisme UK site), ULIEGE (University of Liège
campus guide — curated regional-cuisine selection; institutional/student-life source per the Belgium brief), SNCB
(national railway "Discover Belgium" editorial), BRUSSELSTIMES (Hidden Belgium), RTBF, PARISMATCHBE, LALIBRE,
Wikipedia. **Rejected (0 toward the bar):** rankeat.fr (rating aggregator), mapstr (user lists), wanderlog,
generationvoyage/lemagvoyage (SEO travel blogs — corroboration only), mediacite.be (a shopping mall's page).

**Records written (≥2 credible each):** sights — Grand Curtius (WIKIPEDIA+VISITLIEGE+official), Palais des
Princes-Évêques (LP+ROUTARD+VISITLIEGE), Collégiale Saint-Barthélemy (ROUTARD+WBT); food — Café Lequet
(ULIEGE+SNCB; boulets sauce lapin), Une Gaufrette Saperlipopette (BRUSSELSTIMES+RTBF; gaufre de Liège).
**Channel mix this wave:** editorial/tourism 5 · creators 0 (creator pass not reached) · notable travel sites
(LP/Routard) 2 · local recommendation (ULiège) 1.
**Held:** see `_PENDING_LEADS.md` (≈20 leads: single-source, or no confirmed street address).
**Geocode:** Grand Curtius 50.64742, 5.58394 — high (Wikipedia protected-heritage list, published DMS). Others not
geocoded. **Build:** not run — 1 pin is not a map; card stays "being built".
