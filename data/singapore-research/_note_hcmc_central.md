# HCMC — Central & Signature Street Food (Districts 1 & 3 + core canon)

Agent slice: central Saigon (D1 & D3, Ben Thanh, Pham Ngu Lao/Bui Vien) + the core Vietnamese
street-food canon. **40 NEW food places** in `FOOD_HCMC_CENTRAL.json`. Sources kept separate:
`SOURCES_HCMC_CENTRAL.json` + `CREATORS_HCMC_CENTRAL.json`. WebSearch-only; NO coordinates.

## Dedupe
Read existing dataset `a:"VN"` records first. Only two prior HCMC food records exist
(**Banh Mi Huynh Hoa**, **Com Tam Ba Ghien**) — both deliberately EXCLUDED. Hanoi (Pho Gia Truyen,
Bun Cha Huong Lien) and Hoi An (Banh Mi Phuong) are other cities. Zero overlap; zero internal dupes.

## Counts by district & tier (40 total; tiers graded WITHIN HCMC)
- **District 1:** 27 — Pho Phuong, Pho Minh, Banh Mi Bay Ho, Banh Mi 37 Nguyen Trai, Banh Xeo 46A,
  Anan Saigon (star), Bep Me In, Banh Cuon Tay Ho 127, Bun Thit Nuong Chi Tuyen, Banh Canh Cua 87,
  Oc Dao, The Cafe Apartment, The Workshop, Xoi Ga Number One, Cuc Gach Quan, Tiem Com Tho Chuyen Ky,
  Beo Oi, Dim Tu Tac, Bun Rieu Ganh, Bo La Lot Co Lieng, Mountain Retreat, Maison Marou, The Lunch Lady,
  Stir, Drinking & Healing, Quan Bui, Vi Que Kitchen.
- **District 3:** 8 — Pho Hoa Pasteur, Pho Huong Binh, Banh Mi Hoa Ma, Cheo Leo Cafe, Che Hien Khanh,
  Nha Tu, Com Nieu Sai Gon, Hu Tieu Hong Phat (Ban Co).
- **District 4:** 2 — Bun Bo Hue 14B, Com Tam Bai Rac.
- **District 5:** 1 — Pho Le. **District 10:** 2 — Pho Hoang, Bo Kho Ganh.
  (D5/D10 spots kept only for lone-authority Michelin canon — pho, bo kho.)
- **Tiers:** t1 = 10, t2 = 22, t3 = 8. (≥1 tier-1 satisfied.)

## Sourcing (LOCAL / AUTHENTIC / CREDIBLE / VIRAL)
- **Lone-authority MICHELIN (HCMC guide since 2023):** 15 places carry a MICHELIN Star (Anan) or Bib
  Gourmand (Pho Phuong, Pho Minh, Pho Hoa, Pho Hoang, Hu Tieu Hong Phat, Bun Bo Hue 14B, Banh Xeo 46A,
  Bep Me In, Banh Cuon Tay Ho 127, Xoi Ga Number One, Cuc Gach Quan, Tiem Com Tho Chuyen Ky, Nha Tu,
  Beo Oi, Dim Tu Tac, Bo Kho Ganh, Vi Que Kitchen) — Bib/Star = single credible authority.
- **Local outlets (≥2 credible bar):** Saigoneer, Vietcetera, VnExpress, Tuoi Tre, VietnamNet,
  vietnam.vn, The Dot Magazine, The Word Vietnam, Oi Vietnam, Rusty Compass, Lonely Planet,
  Vietnam Airlines & SilverKris (airline editorial), Daniel Food Diary, The City Lane, Gastronomy Blog.
- **Institutional bar award:** Asia's 50 Best Bars (Stir, Drinking & Healing).
- **Major-press / famous-creator merit:** Anthony Bourdain (No Reservations) for Com Nieu Sai Gon (flying
  rice), The Lunch Lady, Banh Xeo 46A.
- **Vetted creators (each = ONE corroborating source, never authority), with follower scale:**
  - **Mark Wiens / Migrationology** — ~11M YouTube; findable long-form videos/posts on Banh Mi 37,
    Bun Thit Nuong Chi Tuyen, Banh Canh Cua 87, Bun Rieu Ganh, Bo La Lot Co Lieng, The Lunch Lady.
  - **Daniel Food Diary** — established SEA food blog; named pieces on Hoa Ma, Banh Xeo 46A, Dim Tu Tac.
  - **Will Fly for Food** — long-running travel-food blog; 25-stall Saigon guide (Banh Mi 37).
- **Rejected sources (SEO farms / unverifiable UGC):** Lemon8 & Trip.moments roundups; airial.travel /
  novacircle / wanderlog "Best of TikTok/IG" auto-pages; mytour.vn / saigonvibes / housingsgn listicles.
- **Yelp / TripAdvisor / Google / OpenTable = 0 toward the ≥2 bar** (used only to measure/fact-check).

## Canon coverage
pho (Phuong, Minh, Hoa, Le, Hoang, Huong Binh=pho ga) · banh mi (Bay Ho, Hoa Ma, 37 Nguyen Trai) ·
com tam (Bai Rac — Ba Ghien already in set) · bun bo Hue (14B) · bun thit nuong (Chi Tuyen) ·
hu tieu Nam Vang (Hong Phat) · banh xeo (46A) · banh khot [DROPPED, see below] · bo la lot (Co Lieng) ·
banh cuon (Tay Ho 127) · oc/snails (Oc Dao) · banh canh cua (87 Tran Khac Chan) · bun rieu (Beo Oi,
Bun Rieu Ganh) · com tho/clay-pot (Tiem Com Tho Chuyen Ky) · xoi ga / com ga (Xoi Ga Number One) ·
bo kho (Bo Kho Ganh) · com nieu/flying rice (Com Nieu Sai Gon) · rotating noodle soups (The Lunch Lady) ·
che (Hien Khanh) · coffee institutions (Cheo Leo=ca phe vot, The Workshop=specialty, Cafe Apartment) ·
bean-to-bar (Maison Marou) · modern/home Vietnamese (Anan star, Cuc Gach Quan, Nha Tu, Bep Me In,
Vi Que vegan, Mountain Retreat, Quan Bui) · dim sum (Dim Tu Tac) · notable cocktail bars (Stir,
Drinking & Healing).

## MEASURED & DROPPED (mention is not merit)
- **Secret Garden (158 Pasteur, D1)** — very popular rooftop, but only blog/hotel-page/TripAdvisor
  sourcing; no Michelin or major-outlet editorial → fails ≥2 credible.
- **Propaganda Bistro (D1)** — popular modern-Viet, but sourcing = Tripadvisor/aggregators; no credible rave.
- **Nam Giao (Hue food, alley off Le Thanh Ton, D1)** — genuinely good 20-yr Hue spot, but credible
  coverage (Saigoneer/Coracle/Word) not confirmed; only Culture Trip + TripAdvisor found → dropped for rigor.
- **Banh Khot Co Ba Vung Tau (D3)** — well-known banh khot, but only blog/UGC sourcing; no Michelin/major outlet.
- **Okkio Caffe (D1)** — viral specialty-coffee chain, but ≥2 credible not confirmed here; coffee canon already
  covered by Cheo Leo + The Workshop + Cafe Apartment (avoid padding).
- **Egg coffee (ca phe trung) dedicated spot (3T / Tonkin, D1)** — egg-coffee canon is really Hanoi; HCMC spots
  had only listicle sourcing → dropped.
- **Bun Rieu Yen (Michelin Bib)** — Bib-listed but no resolvable address found; bun rieu already covered
  (Beo Oi + Bun Rieu Ganh) → held out.
- **Vietnam House (Luke Nguyen, 93-97 Dong Khoi, D1)** — Michelin-Selected + celebrity chef, but only ONE
  verifiable credible source (Michelin listing) found → held out pending a confirmed 2nd credible.
- **Pho Hoang / Bo Kho Ganh** — D10, kept ONLY because each is a lone-authority Michelin Bib for a signature
  canon dish (pho, bo kho); flagged as outside the strict central lane.

## Closures (2025/2026 fact-check)
All 40 verified OPEN as of the 2025/2026 searches → `closed:false` on every record. No permanently-closed
notable central spots surfaced in this slice (none added as flagged-closed).

## Notes for downstream stages
- Cuisine tags: mostly `["Vietnamese"]`; `["Chinese"]` for the Cantonese kitchens (Dim Tu Tac, Tiem Com Tho
  Chuyen Ky — tagged by kitchen tradition, not by a shared dish); `["Cafe"]` (Cheo Leo, The Workshop, Cafe
  Apartment, Maison Marou); `["Cocktail Bar"]` (Stir, Drinking & Healing). All `a:"VN"`.
- A few addresses are ward/district-level where an exact street number wasn't verifiable via WebSearch
  (Hu Tieu Hong Phat Ban Co; Xoi Ga Number One by Ben Thanh) — flagged for the geocode + place-pin stage,
  which independently verifies coordinates and placement.
