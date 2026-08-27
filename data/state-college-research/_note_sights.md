# State College / Penn State (Happy Valley PA) — SIGHTS discovery note

Agent: sights discovery (things to see/visit, not food). WebSearch only; WebFetch blocked.
Flow: discover credible sources → expand canon → fact-check open/closed & access → rank within area.
NO coordinates (per brief). Output: `SIGHTS_STATECOLLEGE.json`.

## Counts — 26 sights across 4 areas (each area has ≥1 tier-1)

| Area | Tier 1 | Tier 2 | Tier 3 | Total |
|---|---|---|---|---|
| PSU (campus) | Old Main, Nittany Lion Shrine, Beaver Stadium & All-Sports Museum, Palmer Museum of Art, Arboretum/H.O. Smith Gardens (5) | Frost Entomological Museum (1) | Pasto Agricultural Museum (1) | 7 |
| DT (downtown) | Allen Street Gates, The State Theatre (2) | Public Art Walk / Calder Way murals (1) | — | 3 |
| BVL (Bellefonte & Boalsburg) | Bellefonte Historic District, Boalsburg Historic District, Columbus Chapel & Boal Mansion, PA Military Museum *(CLOSED)* (4) | Talleyrand Park & Big Spring, Gamble Mill, American Philatelic Center, Centre Furnace Mansion (4) | — | 8 |
| HV (Happy Valley / Centre County) | Mount Nittany, Penn's Cave & Wildlife Park, Black Moshannon State Park (3) | Rothrock State Forest, Whipple Dam SP, Greenwood Furnace SP, Millbrook Marsh, Tussey Mountain (5) | — | 8 |

Tiers graded WITHIN each area, not across the region.

## Sources used (all credible per palette; Yelp/TripAdvisor/Google = 0 toward the two)
- **Official/institutional (lone-authority-OK):** psu.edu / Penn State News, GoPSUsports (athletics), Palmer Museum, Arboretum at Penn State, Frost Entomological Museum, PA DCNR (parks/forests), PHMC (state museums), Borough of Bellefonte, Centre Region Parks & Rec, American Philatelic Society, Boal Museum, Penn's Cave, Mount Nittany Conservancy, NRHP listings (via Wikipedia).
- **Local news/CVB:** Happy Valley Adventure Bureau (Dispatch / happyvalley.com), StateCollege.com, Onward State, WTAJ, WPSU, Downtown State College Improvement District, Centre County Historical Society (centrehistory.org), Centred Outdoors.
- **Regional/travel writers:** Uncovering PA (Jim Cheney), PA Bucket List (Rusty Glessner), Visit PA, Pennsylvania Wilds, Ski PA, Forbes (arts).
- Every place carries ≥2 credible sources OR a lone institutional authority (DCNR/PHMC/official museum). Whipple Dam is the only single-source entry and rests on PA DCNR (institutional, lone-OK).

## Access / closure notes (fact-checked 2026)
- **Pennsylvania Military Museum — CLOSED, kept flagged** (`"closed": true`). Closed to public since Dec 8, 2024 for a $3.4M modernization; reopening slipped from Feb 2026 to **2027** (WTAJ/PHMC). Outdoor 28th Division Shrine grounds still accessible; galleries shut.
- **Beaver Stadium** is mid-renovation (Project Surge) through 2027 — noted in the record. The All-Sports Museum itself is open (Tue-Sat 10-4, Sun 12-4; reduced winter & home-game-week hours).
- **Penn's Cave** wildlife/farm park is seasonal: closed for winter through Mar 31, reopens Apr 1; cavern boat tour runs Feb-Dec and is not wheelchair accessible. Paid admission.
- **Palmer Museum of Art** — new Arboretum building opened June 1, 2024 (verified open). Free.
- **Frost Entomological Museum** reopened 2022 after renovation; free, M-F 10-4.
- **Pasto Agricultural Museum** — limited access (open houses, appointment tours, Ag Progress Days each August); flagged t3 with a "verify hours" caveat.
- **Boal Mansion / Columbus Chapel** — tour-only, Wed-Sun 2pm (else by appointment).
- **Centre Furnace Mansion** — guided tours on posted days; grounds open.
- **Gamble Mill** — reopened 2021 as hotel/restaurant/bar; interior seen via dining/lodging.
- State parks/forests (Black Moshannon, Rothrock, Whipple Dam, Greenwood Furnace) and the Arboretum, Millbrook Marsh, Mount Nittany, Talleyrand Park, Allen Street Gates, Public Art Walk — all free, open, verified.

## MEASURED & DROPPED (measured before adding; not padded in)
- **Penn State Berkey Creamery** — iconic and in the sights canon, but it is a food/ice-cream destination that belongs on the FOOD list (cuisine CREAM). Dropped from sights to avoid a duplicate name across P/F (validator rule). Left to the food agent.
- **The Corner Room** — downtown landmark but a restaurant → food agent territory, not a sight.
- **HUB-Robeson Center** — a working student union with rotating galleries; thin as a standalone visitor sight next to the stronger campus set. Dropped (avoid padding).
- **Pattee & Paterno Library / Bryce Jordan Center / Pegula Ice Arena / Medlar Field** — real Penn State facilities but they are working library/event/athletic venues with no general visitor-attraction draw outside events; measured, dropped as padding (PSU already carries 7 stronger records).
- **Schlow Centre Region Library** — nice civic building and the July Arts Fest "Images" juried-exhibit venue, but credible sources tie it to the *event*, not the building; too thin for the ≥2-credible sight bar. Dropped (Arts Fest context folded into the Public Art Walk record instead).
- **Central PA Festival of the Arts** — a July event, not a fixed place; referenced inside the Public Art Walk writeup rather than as its own record.
- **Woodward (Camp Woodward, Woodward PA)** — famous action-sports camp in Centre County, but it is a private members/campers-only facility with no general public visitor access/tours. Measured, dropped (not a visitable public sight).
- **Boalsburg Heritage Museum** — legitimate small local museum but overlaps the Boalsburg village + Boal Mansion records; dropped to avoid stacking near-duplicates in BVL.
- **Lincoln Caverns / Woodward Cave** — surfaced by HVAB but sit outside Centre County / the four defined areas; not added.

## Notes for downstream stages
- Addresses are text only (no coordinates written, per brief). Several will need geocoding to the **place pin** (not viewport) — especially trailheads (Mount Nittany 500 Mount Nittany Rd, Lemont) and the Arboretum/Palmer cluster.
- `k` field uses the dataset's collection ids: ICON/CAMPUS/MUS/PARK/OUTDOOR/HIST/SPORT/FAM/FREE.
- Watch the State Theatre address: 130 W College Ave is the historic State Theatre; do NOT confuse with the Penn State Downtown Theatre Center at 146 S Allen St.
