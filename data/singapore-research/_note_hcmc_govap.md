# HCMC (Saigon) — NORTH-WEST outer districts (Gò Vấp / District 12 / Tân Phú / Hóc Môn)

Discovery wave for the empty north-west of the map. Output is namespaced and SEPARATE from every
other HCMC file. Deduped against the 264-name `_hcmc_existing.txt` — all picks below are NEW.

## OUTCOME — honest, under target

Target was 20–30. **Delivered: 9 gate-passing NEW records** — 4 sights, 3 drinks, 2 food.

| District | Records |
|---|---|
| **Gò Vấp** | 7 (Phù Châu Temple; Phen's Coffee; Landing Coffee; Mê Coffee; Baby African; Ông Há hủ tiếu mì; ...) |
| **Hóc Môn** | 2 (Ngã Ba Giồng Memorial; 18 Thôn Vườn Trầu / Bà Điểm) |
| **Tân Phú** | 1 (AEON Mall Tân Phú Celadon) |
| **District 12** | 0 |

This under-delivers on the numeric target, and the reason is the same one documented in
`_note_hcmc_north.md`, only sharper this far out: **these residential/suburban districts are genuinely
thin in ≥2-credible editorial.** Almost every food query (bún bò Huế, ốc & seafood, phá lấu, bánh
canh cua, cơm tấm, lẩu/nhậu, chè) returned ONLY SEO/aggregator/ratings sites — Foody, Mytour, Mia.vn,
Toplist, Tripi, Vntrip, Vuanem, Bazantravel, Ghiền Sài Gòn, Bách Hóa Xanh, Vincom, PasGo, Xanh SM,
VinWonders, Vinpearl — none of which count toward the gate. I did **not** pad with those.
"Popularity you can't verify isn't popularity," and "Gaps are stated, not filled."

What these districts DO yield credibly: **institutional/heritage sights** (Wikipedia + national/state
press) and **viral café phenomena** that real newspapers actually covered (VnExpress + Dân Trí on the
runway-view cafés; Kenh14 on the teddy-bear café). Those are what shipped.

## RECORDS SHIPPED

### Sights (`SIGHTS_HCMC_GOVAP.json`)
| # | Name | District | Tier | Gate |
|---|------|----------|------|------|
| 1 | **Phù Châu Temple (Miếu Nổi)** | Gò Vấp | T1 | Saigoneer feature + VnExpress feature + vi.Wikipedia — ✓✓✓ |
| 2 | **Ngã Ba Giồng Martyrs Memorial** | Hóc Môn | T1 | vi.Wikipedia full article + CAND national daily — national monument ✓✓ |
| 3 | **18 Thôn Vườn Trầu (Bà Điểm)** | Hóc Môn | T2 | vi.Wikipedia full article + Báo Văn Hóa — ✓✓ |
| 4 | **AEON Mall Tân Phú Celadon** | Tân Phú | T2 | Vietnam Investment Review + AEON corporate — first AEON mall in Vietnam ✓ |

### Drinks (in `FOOD_HCMC_GOVAP.json`)
| # | Name | District | Tier | Gate |
|---|------|----------|------|------|
| 5 | **Phen's Coffee** (plane-spotting) | Gò Vấp | T1 | VnExpress dedicated + Dân Trí — ✓✓ |
| 6 | **Landing Coffee** (plane-spotting) | Gò Vấp | T2 | VnExpress + Dân Trí (named alongside Phen's) — ✓✓ |
| 7 | **Mê Coffee (700 Teddy Bears)** | Gò Vấp | T2 | Kenh14 dedicated + Viory video wire — viral ✓ |

### Food (in `FOOD_HCMC_GOVAP.json`)
| # | Name | District | Tier | Gate |
|---|------|----------|------|------|
| 8 | **Baby African** (only Nigerian in city) | Gò Vấp | T2 | Saigoneer ×2 Hẻm Gems + vietnam.vn — ✓✓ |
| 9 | **Ông Há Hủ Tiếu Mì Gốc Hoa** (Phan Huy Ích, ~38 yrs) | Gò Vấp | T2 | VnExpress dedicated profile + VnExpress hủ tiếu round-up — see caveat |

**Notable / viral finds:** the Gò Vấp **runway-view café cluster** (Phen's + Landing, jets landing at
Tân Sơn Nhất overhead — a real VnExpress/Dân Trí story) and the viral **700-teddy-bear Mê Coffee**;
plus the **Phù Châu floating temple**, a genuine Gò Vấp landmark with 100+ ceramic-mosaic dragons on a
river islet reached only by ferry.

## Honesty caveats (do not paper over)
- **#9 Ông Há noodle shop** rests on TWO VnExpress pieces but ONE outlet. It clears the destination bar
  as a decades-old, individually-profiled institution (same standing as the single-anchor destinations
  shipped in the NORTH pass), but a second *distinct* outlet is still wanted. VnExpress does not print
  the exact street number; address binned to Phan Huy Ích, Ward 12, Gò Vấp per the article.
- **#6 Landing** sits next door to #5 Phen's with the same two sources. Kept because VnExpress/Dân Trí
  name both as the article's two distinct subjects (one coffee-led, one milk-tea-led); if pruning for
  anti-padding, drop Landing and keep Phen's.
- **#7 Mê Coffee** is a check-in/photo phenomenon, not a specialty-coffee pick — the `w` says so.
- All OPEN/CLOSED checks: every shipped place read as OPEN in 2025–2026 coverage; `closed:false`.
- **No coordinates** recorded (per brief). Every address contains its district token + "Ho Chi Minh
  City, Vietnam" so the map bins correctly.

## Michelin
Checked. **No** Star / Bib Gourmand / Selected restaurant is listed in Gò Vấp, District 12, Tân Phú or
Hóc Môn — the HCMC selection clusters in D1/D3/D5/D10/Bình Thạnh/Phú Nhuận. Nothing shipped on a
Michelin lone-authority basis from these four districts.

## LEADS for a follow-up local-language pass (NOT shipped — aggregator-only so far)
These recur across aggregators and are plausibly real, but need ≥2 credible sources (Vietnamese
TikTok/YouTube with named handles + follower scale, or VnExpress/Tuổi Trẻ/Thanh Niên/Saigoneer):
- **Gò Vấp food/nhậu streets:** Quang Trung & Phan Văn Trị (weekend eating strips) — ship as a
  *destination* if a credible guide can be found, the way NORTH shipped Văn Thánh / Phan Văn Hân.
- **Gò Vấp:** Ốc Hương Vị (est. 1998, Central-VN snails); Phá Lấu Bò Cây Trâm (575 Lê Quang Định);
  O Lê Bún Bò Huế (Lê Đức Thọ) — Vietnam Coracle mentions it but only in passing.
- **District 12:** Bánh Canh Ghẹ / Bà Tám Chợ Cầu (Tô Ký, ~30 yrs); Bún Riêu Giò Ốc Lê Văn Khương;
  Quán Cô Thanh (nem/tré trộn, An Phú Đông); Chợ An Sương market.
- **Tân Phú:** Công viên Celadon City (16.4 ha park — developer-sourced only); Lẩu Cua Đất Mũi
  (Nguyễn Sơn); the Đầm Sen belt is actually District 11 (and Đầm Sen is already in the guide).
- **Hóc Môn:** bò tơ (young beef) — the famous Bò Tơ Xuân Đào is in **Củ Chi**, not Hóc Môn, and
  aggregator-sourced; Hóc Môn's own bò-tơ/nhậu spots need credible sourcing.
- **Cafés (Gò Vấp):** Ngày Xưa Ấy (nostalgia café near the airport); Du Miên / Family Garden garden
  cafés — aggregator/blog-sourced only.
