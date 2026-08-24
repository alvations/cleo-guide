# Columbus food-expansion pass 2 — immigrant/ethnic + creator/viral (columbus2)

Agent: food-discovery + creator/viral pass, weighted toward non-American/immigrant food.
Files written (only these 3, per concurrency rule): `FOOD_COLUMBUS_EXPAND2.json`,
`CREATORS_COLUMBUS2.json`, `_note_columbus2.md`. Did NOT touch AUDIT.md, sources.json,
geocodes.json, research.js, or the dataset. NO coordinates recorded (per instructions).

## 14 NEW places added (all non-duplicate vs the dataset F array; ≥2 credible each; open-verified 2025/26)

By area + cuisine (t = tier within area):

- **OSU** (University District/Clintonville/Bethel-Kenny corridor)
  - Jiu Thai Asian Cafe — Chinese (Shaanxi/Xi'an, biang biang noodles) — t1 — CU + Infatuation
  - Chuan Jiang Hao Zi — Chinese (Sichuan + dim sum) — t1 — Columbus Monthly Best New 2024 + CU
  - Meshikou — Japanese (ramen) — t1 — Columbus Monthly + alt.eats/CFA (+BWNICK; national "best ramen in Ohio")
  - 6-1-Pho — Vietnamese (2-day pho, vegan pho) — t2 — CU + Dispatch
  - NE Chinese Restaurant — Chinese (Dongbei/Manchurian) — t2 — CU + Columbus Monthly (+BWNICK)
- **EAST** (Bexley/OTE/Whitehall + the Northland/NE immigrant corridor: Morse Rd, Cleveland Ave, Tamarack)
  - Addis Restaurant — Ethiopian — t1 — CU + Columbus Monthly (+alt.eats)
  - Afra Grill — Somali — t1 — Columbus Monthly + CU (+BWNICK)
  - Drelyse African Restaurant — Ghanaian/West African — t1 — Ohio Magazine + Axios Columbus (+alt.eats)
  - Huong Vietnamese Restaurant — Vietnamese — t2 — CU + alt.eats/CFA
  - Los Potosinos — Mexican (pollo al carbon; King-Lincoln storefront) — t2 — Experience Columbus + BWNICK
  - Fork in Nigeria — Nigerian (TikTok-viral fufu) — t2 — NBC4 + Detroit News
- **WEST** (Grandview/Fifth-by-NW)
  - Bonifacio — Filipino (kamayan) — t1 — Columbus Monthly (10 Best 2022) + Infatuation (+BWNICK)
- **SN** (Short North)
  - ROOH Columbus — Indian (progressive) — t1 — CU + Infatuation (+Columbus Monthly Best New)
- **BURB** (Polaris)
  - Haru Omakase — Japanese (sushi omakase) — t1 — Infatuation + Columbus Monthly Best 2025

Cuisine spread (all immigrant/non-American): Chinese ×3 (three distinct regions: Shaanxi, Sichuan,
Dongbei), Japanese ×2 (ramen, omakase), Vietnamese ×2, Filipino, Ethiopian, Somali, Ghanaian,
Nigerian, Mexican, Indian. DTN and GV received no new records (already covered in dataset; the
strongest new immigrant finds clustered OSU/EAST — Columbus' actual immigrant-food geography).

Area-tier note: no existing tier-1 removed (additive only), so every area keeps its ≥1 tier-1.
Northland north-side spots (Morse Rd / Cleveland Ave / Tamarack Cir) are filed under **EAST** as the
nearest defined area — matches the dataset's existing convention (Lalibela already EAST); Bethel/
Kenny/Ackerman near campus filed under **OSU** (matches existing Min-Ga/Namaste/Akai Hana).

## Creators vetted vs rejected
- **Reused (already registered + verified):** BWNICK (Breakfast With Nick, IG ~32K + blog since 2007)
  and CFA (Columbus Food Adventures / alt.eats.columbus, IG ~62K, USA Today 10Best food tour) —
  attached to 6 places as corroborating creator sources (see CREATORS_COLUMBUS2.json attach list).
  A creator counts as ONE credible source, never institutional authority; every place still carries a
  second independent credible source.
- **No brand-new creator cleared the verifiable-following bar** this pass.
- **Rejected (4):** The Columbus Foodletter substack (author/following unverifiable), CMH Gourmand
  (real track record but reach unverified — supporting color only), The 614orty-Niner blog (small/
  dated), Columbus Navigator (anonymous SEO listicles). Fork in Nigeria's virality is the "viral" case
  here — carried by the documented TikTok fufu challenge (Detroit News) + NBC4, not a single named
  influencer.

## MEASURED & DROPPED / HELD (a mention is not merit)
- **Seoul Food On The Go** (Korean, Grandview) — Restaurant Guru 3.8/94; only ratings/Yelp, no ≥2
  credible. DROP. (Korean already covered by Min-Ga in dataset — Axios reviewed Min-Ga 2025, a dup.)
- **Aab India** (Indian, Grandview) — mixed reviews (reviewers "questioning how it won awards"), only
  OpenTable/Yelp + a high-school paper; no ≥2 credible editorial. DROP (ROOH covers modern Indian).
- **Taj on Fifth** (Indian) — HAS 2 credible (Axios Columbus + CU) but HELD to avoid modern-Indian
  padding with ROOH. Available if a 2nd Indian is wanted (different area).
- **Thai** — GAP left stated, not filled: Basil/Bangkok/Erawan/Bamboo surfaced only on ratings sites,
  no ≥2 credible editorial found; several Basil locations are CLOSED. (Note: "Jiu Thai" is Chinese,
  not Thai, despite the name.)
- **Kamil's Uyghur Cuisine** (Dayou Market food court, 875 Bethel Rd) — unique cuisine (laghman,
  halal Xinjiang), CU + 614NOW cover it, BUT Yelp lists it CLOSED (May 2026) while its own site is
  live — status ambiguous, so EXCLUDED pending an open confirmation. Worth a re-check; strong add if open.
- **Dim Sum Asian Bistro** (Grandview Yard, Cantonese) — only 1 solid credible (CU); the old dim-sum
  standout **Sunflower** (Dublin) CLOSED Dec 2024. Dim-sum GAP noted.
- **Lavash Cafe** (Lebanese, Clintonville) — CU review only (1 credible); Middle Eastern already
  covered by Mazah + Cafe Istanbul in dataset. HELD.
- **El Arepazo** (Venezuelan/Colombian) — legendary, but original Pearl Alley location CLOSED and the
  open Brewery District/Gahanna spots surfaced only blog/neighborhood-org sources; couldn't confirm ≥2
  institutional/creator credible. HELD.
- **Banadir** (old Cleveland Ave) CLOSED; **Hamdi Grill** ratings-only — both DROP (Somali covered by
  Afra Grill + Hoyo's).

## CLOSED found (verified during the pass)
Blue Nile (Ethiopian, 2361 N High) · Sunflower Chinese (Dublin, closed Dec 2024) · Himalayan Grille
(Nepali, Gahanna) · Basil Thai (Front St) · Banadir Cuisine (Cleveland Ave) · El Arepazo Pearl Alley
original (47 N Pearl) · Sapphire Indian (Kenny Centre) · Kihachi (Dublin, closed 2018) · Kamil's
Uyghur (Yelp-listed closed — ambiguous). None of these are in the dataset, so nothing to flag `— CLOSED`.

## NEW source outlets to register in data/sources.json (used this pass; I did NOT edit sources.json)
- **INFATUATION** — The Infatuation (national digital food desk; already used as a key in
  FOOD_EXPAND.json/dataset — confirm it's registered). Digital food desk, corroboration-grade.
- **AXIOSCOLUMBUS** — Axios Columbus (local news desk; bylined restaurant reviews). Credible local.
- **OHIOMAGAZINE** — Ohio Magazine (regional glossy; food-drink features). Credible regional.
- **DETROITNEWS** — The Detroit News (used only to document Fork in Nigeria's national TikTok virality).

## Budget
~26 WebSearch queries used; well within the shared window. Not capped. All 14 records fully sourced
with ≥2 credible and open-status checked; no coordinates recorded (downstream geocode pass owns that).
