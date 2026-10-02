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
