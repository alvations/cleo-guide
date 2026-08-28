# HCMC MICHELIN discovery wave — note

**Scope.** Add MICHELIN Guide Ho Chi Minh City venues (2023–2026 editions) not already in the
guide. Deduped against `_hcmc_existing.txt` (183 names). Output: **27 NEW places** —
`FOOD_HCMC_MICHELIN.json`. All clear the sources bar on the lone MICHELIN authority; a 2nd
credible source (VnExpress / SGGP / Vietcetera / Thanh Nien / Epicure / Tatler / SGTT / etc.)
is attached where one was easily found. No coordinates recorded (geocode pass is downstream).

## Counts
- **By tier:** 4 One-Star · 4 Bib Gourmand · 19 Selected.
- **By district:** District 1 = 11 · Thu Duc City (Thao Dien/An Khanh) = 9 · District 3 = 3 ·
  Phu Nhuan = 2 · Binh Thanh = 1 · District 5 = 1.

## One MICHELIN Star (all NEW; Anan already in guide)
- **Akuna** — 9F Le Méridien, D1. Chef Sam Aisbett, modern Australian + Vietnamese produce.
- **Long Trieu (The Royal Pavilion)** — 4F The Reverie Saigon, D1. Cantonese fine dining.
- **CieL** — Thao Dien, Thu Duc City. 2025 debut; French–Vietnamese tasting.
- **Coco Dining** — 143 Nam Ky Khoi Nghia, D3. Promoted to 1★ in 2025; modern Vietnamese.

## Selected (notable adds)
Vietnam House (Luke Nguyen, Dong Khoi), Hoa Tuc (opium-refinery courtyard), Quince Saigon
(wood-fired Mediterranean), The Albion by Kirk Westaway (British, Hôtel des Arts), Hoi An Sense,
ST25 by KOTO (Sofitel), Madame Lam, Nephele (Sommelier Award), NÔM, Sóno, Chị Mơ, Tales by
Chapter (zero-waste plant-based), Hum Garden + Du Yên (vegetarian), Okra FoodBar, Apero (Italian),
Propaganda Bistro, Quán Ăn Ngự Bình (Hue home cooking), Bà Cô Lốc Cốc (snails/seafood).

## Bib Gourmand (NEW)
- **Banh Canh Cua Ba Ba** — 84/6 Nguyen Bieu, D5. Crab thick-noodle soup.
- **Bún Riêu Yến** — 1346 Truong Sa, Phu Nhuan. 2026 Bib; crab-tomato bún riêu.
- **Mặn Mòi** — Thao Dien, Thu Duc City. 2024 Bib (the "Man Mpi"/"Mặn Mòi" new-8 entry).
- **Sol Kitchen & Bar** — 112 Ly Tu Trong, D1. 2024 Bib; pan-Latin-American.

## Dropped as already-listed (Michelin places already in the guide)
Anan Saigon (1★), and Bib/Selected already present: Pho Phuong, Pho Minh, Pho Hoa Pasteur,
Pho Le, Pho Hoang, Pho Huong Binh, Com Tam Ba Ghien, Banh Xeo 46A, Bo Kho Ganh, Bep Me In,
Bun Bo Hue 14B, Banh Cuon Tay Ho 127, Béo Ơi, Cuc Gach Quan, Dim Tu Tac, Xoi Ga Number One,
Tiem Com Tho Chuyen Ky, Vi Que Kitchen, Nha Tu, Ốc Oanh, Hu Tieu Hong Phat, Bun Bo Hue Co Nhu.

## Notes / caveats
- **Not HCMC:** Phở Khôi Hói (Hanoi Bib) — excluded.
- **Nhau Nhau** (cocktail bar) left out — it is Anan's sister bar and Anan is already listed.
- Ward names reflect Michelin's printed addresses; several fall in the 2025 ward
  reorganization (e.g. "Saigon Ward" ≈ Ben Nghe). Kept a stable ward + district token so each
  address carries "District N / Thu Duc City / Phu Nhuan District" + "Ho Chi Minh City, Vietnam".
- **Downstream still required:** geocode + `!3d!4d` place-pin verify, and OPEN/CLOSED recheck in
  `data/geocodes.json` before build. All entries default `closed:false`; none found permanently
  closed at research time (Aug 2026).
- Michelin restaurant-page slugs were reconstructed from the guide's URL pattern; a couple
  (Akuna, CieL, Coco Dining) were inferred and should be spot-confirmed at build time. The tier
  designation (Star/Bib/Selected) itself is source-confirmed.
