# HCMC — SE ROUTE CORRIDOR (Saigon → Vũng Tàu) pass summary

Slice: the stops **between** central Saigon and Vũng Tàu, plus the coastal extension —
**Long Thành / Nhơn Trạch (Đồng Nai) → Bà Rịa / Long Điền → Vũng Tàu → Long Hải → Hồ Tràm → Hồ Cốc / Bình Châu (Xuyên Mộc)**.
Every address carries a route-town keyword so the map bins it to the SE corridor. NO coordinates.
Sources kept SEPARATE in `*_HCMC_SEROUTE.json`. Deduped against the 296 existing HCMC names — 0 collisions.

**Output:** `FOOD_HCMC_SEROUTE.json` = **6** places (list) · `SIGHTS_HCMC_SEROUTE.json` = **11** sights (dict) = **17 NEW**.
All `a:"VN"`, all `closed:false` (every place fact-checked open for 2025/2026 — no closures found on the corridor this pass).

## Counts by town + type
- **Long Thành / Nhơn Trạch (Đồng Nai) — 2:** Sữa Bò Long Thành / Lothamilk (food, T3), Bò Cạp Vàng ecotourism (sight, T3).
- **Bà Rịa / Long Điền — 2:** Bánh Canh Long Hương 'cổng chào' (food, T1), Bánh Hỏi An Nhứt (food, T2).
- **Vũng Tàu — 8:** Bánh Bông Lan Trứng Muối Gốc Cột Điện (T1), Lẩu Cá Đuối Hoàng Minh / stingray hotpot (T1),
  Gành Hào seafood (T2) [food ×3]; Bạch Dinh/White Palace (T1), Nhà Lớn Long Sơn (T1), Hòn Bà (T2),
  Front Beach/Bãi Trước (T2), Thích Ca Phật Đài (T2) [sights ×5].
- **Long Hải — 1:** Dinh Cô temple + festival (sight, T1).
- **Hồ Tràm — 1:** Hồ Tràm Beach (sight, T2).
- **Xuyên Mộc — 3:** Bình Châu Hot Springs (T1), Hồ Cốc Beach (T2), Bình Châu–Phước Bửu Nature Reserve (T3) [sights].

Tier tally: **T1 ×7, T2 ×7, T3 ×3.**

## Notable / viral finds
- **Lẩu cá đuối (stingray hotpot)** — Vũng Tàu's true signature dish; sour-spicy tamarind + pickled-bamboo broth.
  Anchored on Hoàng Minh (Trương Công Định), the most editorial-cited house. VnExpress + VietnamNews (both national).
- **Bánh bông lan trứng muối** — the salted-egg sponge cake Vũng Tàu invented. The **originator is Gốc Cột Điện**
  (since 1986), NOT "Gốc Hồng" as the brief guessed — corrected here. Tuổi Trẻ + BRVT tourism.
- **Bánh canh Long Hương 'cổng chào'** — the mandatory pit-stop at Bà Rịa's welcome gate; two VnExpress features.
- **Nhà Lớn Long Sơn (Đền Ông Trần)** — a genuinely one-of-a-kind folk-faith wood compound; Thanh Niên + Dân Trí +
  the national tourism authority listing.
- **Dinh Cô–Long Hải Festival** — National Intangible Cultural Heritage (Nhân Dân + VOV + provincial gov).
- **Bình Châu Hot Springs** — southern Vietnam's ONLY natural hot mineral springs (up to 82°C); Vietnam Coracle +
  Xuyên Mộc district portal. Hồ Cốc / Hồ Tràm are, per Coracle, "the best beaches within easy reach of Saigon."

## Sourcing notes (honesty)
- Every place clears the bar: **≥2 credible sources** OR a **lone institutional/Wikipedia-full-article** authority.
  Wikipedia full articles carry Hòn Bà, Thích Ca Phật Đài (also a 1989 national relic) and Bình Châu–Phước Bửu.
- **Yelp / TripAdvisor / Foody / Google / Wanderlog / Mindtrip / Lemon8 = ZERO** toward the gate — used only to
  cross-check that a place exists/is busy. SEO/OTA listicles (Mytour, VinWonders, Traveloka, Xanh SM, bazantravel,
  dulichvietnam) likewise measure-only, never a recommender.
- **Thin-source flag — Sữa Bò Long Thành (Lothamilk):** included as THE canonical Long Thành roadside specialty
  (fresh milk + bánh sữa on QL51), but with a single credible outlet this pass (Chăn nuôi Việt Nam, a livestock
  trade publication) plus its recognised Đồng Nai regional-specialty status. Flagged T3 for a follow-up 2nd-source
  pass (Báo Đồng Nai / VnExpress). Kept because Long Thành otherwise has almost no editorial-grade food coverage.
- **Creators:** only one verifiable independent creator surfaced with corridor-specific findable content —
  **Vietnam Coracle** (Hồ Tràm/Hồ Cốc guide + '7 Places to Eat Bánh Khọt in Vũng Tàu'). Per the honesty rule I did
  NOT fabricate VN TikTokers/YouTubers or follower counts; a Vietnamese-language social pass is the way to add named
  vloggers with reach.

## Dropped / not added (and why)
- **Extra bánh khọt spots** (Bánh Khọt 368, Miền Đông, Bà Hai, Út Loan) — Vietnam Coracle names them, but the two
  canonical Vũng Tàu bánh khọt houses (**Cô Ba** and **Gốc Vú Sữa**) are ALREADY in the guide; adding a third would be
  padding, and the others lacked a 2nd credible naming source. Left out.
- **Niết Bàn Tịnh Xá (Lying Buddha temple)** — real landmark but only travel-content-mill sourcing found; dropped in
  favour of the stronger Thích Ca Phật Đài (Wikipedia + national relic). Candidate for a later pass with better sources.
- **Sea-view cafés on the lighthouse road** (Sơn Đăng, Lightroom, The Hill) — only SEO café listicles; none cleared
  the ≥2-credible bar. Left out rather than pad the drinks list.
- **Long Thành gà nướng cơm lam** — weak sourcing (Mytour/local blogs only); dropped.
- Existing corridor records respected — Vũng Tàu Lighthouse, Christ the King, Hồ Mây Park, Back Beach (Bãi Sau),
  Bánh Khọt Cô Ba, Bánh Khọt Gốc Vú Sữa were NOT re-added.
