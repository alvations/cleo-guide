# Indianapolis — AUDIT ledger (append-only)

Key `indianapolis-in`. Contract: docs/PIPELINE.md. Run protocol: docs/RUN-2026-10-02.md.
Research channel: WebSearch only (WebFetch blocked by org egress policy) — `researchedVia: WebSearch`.

## 2026-10-02 · Stage 0 — Scope & taxonomy
- **Region:** Indianapolis/Marion County + Speedway + north suburbs (Carmel, Fishers, Zionsville,
  Noblesville, Westfield) + south side (Greenwood, Beech Grove, Southport). Out of region: Huntington
  (Nick's Kitchen, tenderloin birthplace), Winchester (Wick's Pies) — noted for context, not pinned.
- **Areas (9):** DTN, MASS, FSQ, MID, BRIP, WEST, EAST, NORTH, SOUTH. MID added beyond the brief's list
  because Newfields, the Children's Museum, Crown Hill and Butler sit in neither Downtown nor Broad Ripple;
  the Kurt Vonnegut Museum (543 Indiana Ave) is DTN.
- **Cuisines:** HOOS (Hoosier classics: tenderloin, fried chicken, biscuits & apple butter) · STEAK (St. Elmo
  & fine dining) · US · DELI (Shapiro's) · SOUL · ITAL · BURMA (Burmese & Chin) · ASIAN · MEX · MED · PIE
  (sugar cream pie, bakeries) · BREW · COF · VIRAL.
- **Collections:** ICON, RACE (Speedway & racing — Indy's defining collection), MUS, PARK, ARCH, ENT, SHOP,
  FAM, ODD, FREE.

## 2026-10-02 · W1 Stage 1 (source discovery) — TRUNCATED by the shared WebSearch session budget
- Ran 5 WebSearch calls (tenderloin ×2, Indianapolis Monthly Best Restaurants 2025, James Beard 2026
  semifinalists, IM installments). The 6th returned **"this session has used its web search budget (200 of
  200 WebSearch calls)"** — the cap is shared by the ~16 concurrent agents in this session and is not a
  transient rate limit (the tool instructs not to retry; raising it requires `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`).
- Per the never-fabricate rule, **no places were written from memory**; no coordinates, no addresses.
- Credible sources discovered (logged with URLs in `_PENDING_LEADS.md`): Indianapolis Monthly (tenderloin
  guide; Best Restaurants 2025 + 2026), James Beard Foundation (2026 semifinalists: Macizo, Vida/Jared May,
  Tom Main/Tinker Street & Freeland's), Axios Indianapolis (tenderloin trail — add `AXIOS` outlet next wave).
- Rejected: cozymeal (booking-platform listicle), internxt/montecitofire/unearththevoyage (content farms);
  lifeinindy.com held as lead-only until vetted.
- Channel mix this wave: editorial 4 (IM ×3, Axios) · institutional 1 (JB) · creators 0 · travel sites 0 ·
  local-rec 0 (lead only). Places extracted to records: 0 (all held as leads, see `_PENDING_LEADS.md`).

## 2026-10-03 · W1 (full wave, own session) — discovery → fact-check → geocode → build
Channel: WebSearch only (`researchedVia: WebSearch`), ~158 calls this session. Every record is written by
`_w1_records.py` (re-runnable; one `add()` per place carrying its sources, address and geo/status provenance)
→ `FOOD_W1.json`, `SIGHTS_W1.json`, `geo/_geoout_w1.json`; new outlets in `SOURCES_W1.json`.

**Stage 1 — sources.** Editorial of record: Indianapolis Monthly (Best Restaurants 2024/2025/2026 installments,
tenderloin guide, 25 Essential Eats, reviews), IBJ, WISH/WRTV/WTHR/FOX59, Mirror Indy, NUVO archive, Indy Today,
Axios Indianapolis. Institutional: James Beard (St. Elmo America's Classics 2012 — Indy's only JB win; semifinalists
2022-2026: Vida/Melvin & Jared May, Tom Main [Tinker Street, Freeland's], Macizo, Bluebeard/Merriss, 9th Street
Bistro/Mohammad, Beholder & Milktooth/Brooks, Oakleys, Love Handle, Martha Hoover). National: Roadfood, Atlas
Obscura, Food Network/DDD, Tasting Table, PUNCH, Infatuation. Sights: Wikipedia (infobox coords), NPS NRHP
itineraries, Encyclopedia of Indianapolis, SAH Archipedia, TCLF, Indiana Historical Bureau, Visit Indy/Visit
Hamilton County/Visit Indiana, Downtown Indy. Registered 35 new outlet keys (SOURCES_W1.json).
**Rejected:** cozymeal (booking-platform listicle), hoodline (Yelp-derived), tablejourney/enprimeurclub/wanderlog
(aggregators), zabihah/autoreserve (directories), lifeinindy (unvetted lifestyle site), Yelp-based "best pie" claim
used only as context, never as a source.

**Stage 2-3 — extract + fact-check (merit + status).** 103 places kept (63 sights, 40 food). Merit basis per food
record: JB honour and/or IM Best Restaurants list and/or national-guide rave (Roadfood/DDD/Atlas Obscura) with a
2nd independent outlet. Status sources recorded per place (IM 2026 list = Sept 2026 open check; IBJ/WTHR/WISH news).
- **CLOSED, kept flagged:** Edwards Drive-In (tenderloin, Man v. Food) — last day 8 Jan 2022 (WTHR/IBJ/WISH).
- **CLOSED, dropped (no pin + not canon-defining):** Acapulco Joe's (closed 2019, Indy Encyclopedia).
- **Status changes logged:** Milktooth → briefly Arlene's (2026), now "arlene's by Milktooth" (IBJ); Kountry Kitchen
  rebuilt on its original site after the 2020 fire; Love Handle moved to 877 Mass Ave; Bluebeard chef Merriss →
  Alan Sternberg; Lafayette Square Mall closed 2022 (pin kept as the International Marketplace district hub).
- **MEASURED & HELD (not added):** Wisanggeni Pawon (IM 2026 says Irvington; directories say 2450 E 71st — address
  unresolved); Kimu (Greenwood Burmese; NUVO/Culinary Crossroads/NYT mention but no 2025-26 open check); Borage,
  Serliana, Corridor, Julieta, Fernando's, Magdalena, Good Omen, Open Kitchen, The Flatiron (IM only so far — need a
  2nd outlet); Bazbeaux (one outlet); Al-Rayan (only directories + Visit Indiana mention); Bub's Burgers (no street
  address found); Cafe Patachou (original 49th & Penn site status unclear after IM "big change" note); Metazoa,
  Fountain Square Brewing, Upland FSQ (Axios brewery guide only).
- **Gaps stated, not filled:** persimmon pudding — no Indy restaurant found serving it with a credible source this
  wave; Midtown (MID) has no food yet (searches returned no credible MID-specific list); SOUTH Burmese/Chin beyond
  Chin Brothers lacks current status checks.

**Stage 4 — geocode.** Wikipedia infobox coordinates (or HMdb/latlong.net/aggregator points, graded med/low and
noted) for 59 places: high 36 · med 20 · low 3 (Fort Harrison SP minute-precision, Broad Ripple Village centroid,
Museum of Miniature Houses aggregator). Rathskeller pinned on the Athenaeum building (it occupies it). **44 places
UNVERIFIED** — WebSearch returns no place-pin coordinates for most restaurants (Mapcarta/latlong.net domain-restricted
retries also failed); they are in the dataset and held off the map by the gate until `tools/geocode-helper.html`.
Several addresses first drafted from recall were replaced with the address text actually stated by a source
(e.g. Monument Circle, War Memorial, Speedway) before build — no address or coordinate comes from memory.

**Stage 5 — build + gates.** `rebuild-city.py indianapolis-in --build`: sourcecheck PASS (103/103) · geocheck PASS ·
statuscheck CONSISTENT · buildcheck PASS; `npm run validate && npm test` green. Page live on the US hub card.
Density (`tools/density.py`): every area still NEED — DTN 27/38, MASS 16/24, NORTH 14/30, BRIP 11/20, WEST 11/20,
MID 7/22, EAST 7/16, FSQ 6/20, SOUTH 4/20.
