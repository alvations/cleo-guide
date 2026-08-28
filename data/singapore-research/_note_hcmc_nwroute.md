# HCMC — NW ROUTE CORRIDOR (Saigon → Tây Ninh) discovery note

Corridor: **Củ Chi town → Trảng Bàng → Gò Dầu/Hậu Nghĩa → Tây Ninh city / Núi Bà Đen / Dầu Tiếng.**
15 NEW places (8 food/drink + 7 sights). Namespaced files kept SEPARATE from all other HCMC slices.
Every address carries a route-town keyword (Củ Chi / Trảng Bàng / Tây Ninh / Núi Bà Đen) so the map bins it to the NW corridor.

## Dedupe
Cross-checked against `_hcmc_existing.txt` (297 names). The corridor items already in the guide — **Cu Chi Tunnels, Ben Duoc Memorial Temple, Cao Dai Holy See (Tay Ninh), Ba Den Mountain (Nui Ba Den)** — were NOT re-added. New entries are deliberately *distinct* from those (e.g. the Sun World cable-car complex and the Tây Bổ Đà Sơn Buddha statue are separate from the generic "Ba Den Mountain" summit already listed).

## Counts by town / type / tier
| Town | Food | Sights |
|---|---|---|
| Củ Chi | Bò Tơ Xuân Đào (t1), Khoai Mì Củ Chi (t3) | Cu Chi Wildlife Rescue Station — CLOSED (t3), Trung An Fruit Orchard (t3) |
| Trảng Bàng | Bánh Canh Út Huệ (t1), Bánh Canh Năm Dung (t2), Bánh Tráng Phơi Sương (t1) | — |
| Tây Ninh city / Hòa Thành | Cơm Chay Long Hoa (t2), Bánh Tráng Muối Tôm (t2) | Long Hoa Market (t2) |
| Núi Bà Đen | Ốc Núi Bà Đen (t3) | Sun World Ba Đen Cable Car (t1), Tây Bổ Đà Sơn Buddha (t1), Ma Thiên Lãnh Valley (t2) |
| Dầu Tiếng | — | Dầu Tiếng Lake (t2) |

Tiers: **t1** = 5 (Xuân Đào, Út Huệ, bánh tráng phơi sương, cable car, Buddha statue); **t2** = 6; **t3** = 4.
All `closed:false` EXCEPT **Cu Chi Wildlife Rescue Station** (flagged `— CLOSED`, closed to visitors indefinitely per Wikipedia/Lonely Planet; kept per the "closed places stay, flagged" rule).

## Notable / viral finds
- **Bò Tơ Xuân Đào** — the definitive bò tơ Củ Chi (young free-range beef), a 30-yr Highway 22 institution; carried by a **Việt Nam News** restaurant review ("a southern classic worth the journey").
- **Bánh canh Trảng Bàng (Út Huệ & Năm Dung)** — the town's signature dish on Nguyễn Văn Rốp; Năm Dung dates to the 1950s. Two landmark houses kept (not padding — they are *the* two names).
- **Bánh tráng phơi sương Trảng Bàng** — dew-soaked rice paper; craft named **national intangible cultural heritage (2016)**; Saigoneer mini-doc + VietnamPlus.
- **Tây Ninh muối tôm / bánh tráng trộn** — the viral chili-shrimp-salt snack and #1 edible souvenir; explicitly requested.
- **Sun World Ba Đen cable car** — **Guinness: largest cable-car station in the world** (10,959 sqm).
- **Tây Bổ Đà Sơn Buddha** — **Guinness: Asia's tallest bronze mountain-peak Lady-Buddha** (72 m, 170+ t bronze).
- **Dầu Tiếng Lake** — **largest artificial lake in Vietnam & SE Asia** (270 sqkm).

## Dropped / not added (with reason)
- **Hoàng Ty (bánh canh Trảng Bàng)** — famous brand but its restaurants are in **Saigon District 1**, not the corridor; a corridor address keyword can't honestly be given, so it belongs in a central-district slice, not here.
- **Nem bưởi Tây Ninh** — real specialty but only listicle/brand sourcing surfaced; dropped to avoid padding under the merit bar.
- **Gò Dầu / Hậu Nghĩa** — searched for a distinct notable stop; found none with credible sourcing (highway-junction towns). Honest gap, not filled.
- Additional bò tơ houses (Hồng Đào etc.) and further bánh canh shops — dropped as near-identical mid-tier padding; kept only the standouts per region.

## Sourcing caveats for the gate
- Strongly gated (≥2 credible national/institutional, or lone authority): Bò Tơ Xuân Đào, Bánh tráng phơi sương, Khoai Mì Củ Chi, Sun World cable car, Tây Bổ Đà Sơn Buddha, Ma Thiên Lãnh, Dầu Tiếng Lake, Cu Chi Wildlife Rescue Station, Trung An Orchard, Long Hoa Market, Cơm Chay Long Hoa.
- **Thinner sourcing (brand-travel/listicle only; Yelp/TripAdvisor/Google/Foody excluded as always) — verify in a local-language pass before publishing:** the two named bánh canh houses (Út Huệ, Năm Dung — dish is heritage-famous, specific shops are listicle-cited), Bánh Tráng Muối Tôm, and Ốc Núi Bà Đen. The dishes are unquestionably city-signature; only the specific-vendor citation is weak.
- **Coordinates:** none provided (per brief). All entries need geocoding + place-pin verification and OPEN/CLOSED re-check (2025/2026) in the normal pipeline before build.
- No creators attributed (see CREATORS file) — could not verify VN vloggers/followers from a US WebSearch region; did not fabricate.
