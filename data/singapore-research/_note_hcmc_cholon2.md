# Chợ Lớn / Cholon (D5/D6) food deepening — wave 2 note

Namespaced files (kept SEPARATE from other HCMC slices):
`FOOD_HCMC_CHOLON2.json`, `SOURCES_HCMC_CHOLON2.json`, `CREATORS_HCMC_CHOLON2.json`.

All 11 records are NEW (cross-checked against `_hcmc_existing.txt`, 109 names) and against the 4
Cholon entries already in `FOOD_HCMC_OUTER.json` (Huê Ký Mì Gia, Hủ Tiếu Sa Tế **Quảng** Ký,
Dim Tu Tac, Chè Hà Ký). No overlaps: e.g. **Hải** Ký ≠ Huê Ký; **Tô** Ký satay ≠ **Quảng** Ký satay;
Chè **Châu Giang** ≠ Chè Hà Ký.

## Counts

- **Total NEW places: 11.**
- By tier (graded WITHIN Cholon):
  - **Tier 1 (6):** Hải Ký Mì Gia (D5), Hủ Tiếu Sa Tế Tô Ký (D6), Dimsum Tiến Phát (D5),
    Sủi Cảo Hà Tôn Quyền/Thiên Thiên (D11-Cholon), Cà Phê Ba Lù (D5), Chè Châu Giang (D5).
  - **Tier 2 (4):** Sủi Cảo Đại Nương (D5), Phá Lấu Tám Ký (D5), Chè Tường Phong (D5),
    Khổ Qua Cà Ớt / Hakka (D5).
  - **Tier 3 (1):** Va Thanh — Taiwanese (D5).
- By district: **D5 = 9, D6 = 1 (Tô Ký), D11-Cholon = 1 (Hà Tôn Quyền).**
  Every Cholon district carried has ≥1 tier-1 (D5: several; D6: Tô Ký; D11-Cholon: Hà Tôn Quyền).
- By category: noodles/mì-hủ tiếu 2 (Hải Ký, Tô Ký) · dumplings/sủi cảo 2 (Hà Tôn Quyền, Đại Nương) ·
  dim sum 1 (Tiến Phát) · phá lấu/offal 1 (Tám Ký) · Hakka soup 1 (Khổ Qua Cà Ớt) ·
  chè/Chinese dessert 2 (Châu Giang, Tường Phong) · cà phê vợt 1 (Ba Lù) · Taiwanese 1 (Va Thanh).

## Sources used (all in SOURCES_HCMC_CHOLON2.json)

Saigoneer, TheSmartLocal, VnExpress, Tuoi Tre, Thanh Niên, Viet Nam News, Kenh14, Vietnam Coracle,
The Dot Magazine, Vietnam.vn, Vietnam.travel (national tourism), Vntravellive, Where In Vietnam.
Every record carries ≥2 credible sources. Yelp/TripAdvisor/Google/Foody used ONLY to measure
popularity — never counted toward the bar (and not cited).

Softest attributions to re-confirm on the verify pass: **Chè Tường Phong** (vntravellive + Tuoi Tre
Chinese-dessert features — confirm both name Tường Phong specifically) and **Khổ Qua Cà Ớt**
(Saigoneer Hẻm Gems is the primary; Where In Vietnam is the corroborating source).

## Open/closed

All defaulted `closed:false`; each was cross-checked against 2024-2026 coverage (Saigoneer/VnExpress
2024+ pieces, Vietnam Coracle current dim-sum guide, Vietnam.travel current). No permanent closures
found for the 11. Statuses still need the formal `--statuscheck` gate pass before publishing.

## Addresses

Street-level where a credible source gave it; a few use street-only or district-only (Va Thanh: exact
street not surfaced) — flagged for the geocode/place-pin verify pass. Every address contains
"District 5" / "District 6" / "District 11, Cholon" and ends "Ho Chi Minh City, Vietnam" so the build
bins them into the Chợ Lớn district. NO coordinates recorded (per instructions).

## MEASURED & DROPPED / HELD (mention ≠ merit, or couldn't clear ≥2 credible)

Search budget hit the hard cap (200/200 WebSearch calls) mid-verification, so several iconic canon
places are HELD rather than added — each is measured and looks strong, but I could not confirm a
second CREDIBLE outlet (SEO listicles / Foody / TripAdvisor / operator blogs don't count). Re-run a
short second wave to promote these:

- **Cơm Gà Đông Nguyên** (801 Nguyễn Trãi, D5) — iconic 1945 Cantonese soy/roast chicken rice.
  Only official site + TripAdvisor/Foody/SEO blogs surfaced; NO credible editorial found. HELD — this
  is the biggest gap (roast/soy chicken-rice canon). Priority re-search.
- **Vịt Quay Phát Thành** (157-159 Bùi Hữu Nghĩa, D5) — 50-yr roast-duck row. Prose claims Tuổi Trẻ/
  Thanh Niên/VnExpress coverage "for 20 years" but no citable URL surfaced (only Foody/YouTube/blogs).
  HELD — leaves the **roast-duck/vịt quay canon unfilled** (stated as a gap, not filled).
- **Ái Huê** (412-418 Trần Hưng Đạo, D5) — Teochew/Cantonese roast meats. Only KIM Travel + Vespaagogo
  (operator blogs). HELD.
- **Cả Cần** (110 Hùng Vương, D5) — 50-yr bánh bao + hủ tiếu Mỹ Tho. Only SEO/blogs. HELD.
- **Hưng Ký — Gà Ác Tiềm Thuốc Bắc** (156A Nguyễn Trãi, D5) — herbal black-chicken soup. A real
  VnExpress "gà ác tiềm thuốc bắc gốc Quảng Đông ba đời" article exists, but I could not confirm it
  maps to THIS shop/address. HELD — leaves the **thuốc-bắc herbal-soup canon unfilled** honestly
  rather than mis-attribute.
- **Minh Ký** (356 Trần Phú, D5) — mì hoành thánh / sủi cảo, called "best in Saigon" by TheSmartLocal.
  Only 1 credible + own site. HELD (needs a 2nd credible).
- **Tân Nguyên Thái Dimsum** (102D An Dương Vương, D5) — Vietnam Coracle's favourite dumpling house;
  only 1 credible surfaced. HELD.
- **An Duyên** (historic D5 shophouse) — full Saigoneer Hẻm Gems feature but only that one credible.
  HELD.
- **Kowloon Bingsutt** (74 Bùi Hữu Nghĩa, D5) — trendy HK-style dim sum; Where In Vietnam feature +
  a 2020 VnExpress HK-joints piece that predates it (unconfirmed inclusion). HELD.
- **Suan La Fen (D6)** — Saigoneer D6 hot-and-sour noodle feature; single credible. HELD (would add a
  second D6 tier candidate).
- **Học Lạc Dimsum / Baoz Dimsum** — DROPPED: only Wanderlog/Vinpearl/SEO; no credible recommender.

## Why 11 vs the 25-35 target

The strict ≥2-credible gate plus the 200/200 WebSearch cap is the limiter — not a shortage of Cholon
canon. ~11 additional strong candidates are already scoped above and only need one confirming
credible source each. A follow-up wave with fresh search budget, aimed squarely at the HELD list
(Đông Nguyên, roast-duck row, Cả Cần, herbal chicken, Minh Ký, Tân Nguyên Thái, An Duyên, Kowloon,
Suan La Fen), should comfortably reach the target.
