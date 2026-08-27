# HCMC — Definitive Saigon Street-Food Canon (dedupe discovery wave)

Namespaced output (kept SEPARATE from `*_HCMC_CENTRAL` / `*_HCMC_OUTER`):
`FOOD_HCMC_CANON.json` · `SOURCES_HCMC_CANON.json` · `CREATORS_HCMC_CANON.json`

## IMPORTANT — wave cut short by shared WebSearch budget
The session-wide WebSearch budget hit **200/200 and locked out** partway through this wave (the
lẩu/nhậu, cà phê vợt, súp cua, cơm gà and bánh canh cua batch returned "budget used" instead of
results). So this file ships **10 fully source-verified NEW places**, not the 30–40 target. Nothing
was fabricated to fill the gap — per the guide's rules, the gap is stated, and a ready-to-run backlog
of researched-but-unverified candidates is listed below for a follow-up wave once the budget resets
(raise `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`).

## Delivered — 10 new places (all deduped against `_hcmc_existing.txt` + the two existing HCMC food files)

| # | Place | Dish | District | Tier | Sources |
|---|-------|------|----------|------|---------|
| 1 | Pho Dau | phở bò Nam Định (Northern, no herbs) | D3 | 1 | Saigoneer + The Dot |
| 2 | Pho Tau Bay | phở bò (Northern, since 1954, giant bowl) | D10 | 1 | Saigoneer + Vietnam.vn |
| 3 | Pho Cao Van | phở bò (charcoal broth, since 1947) | D1 | 2 | The Dot + Tatler Asia |
| 4 | Che Thai Y Phuong | chè Thái (durian sweet soup) | D10 | 1 | Saigoneer + Vietnam Coracle |
| 5 | Hu Tieu Ty Lum | hủ tiếu Nam Vang (Khmer royal cook) | D5 | 1 | Saigoneer + Ngoi Sao/VnExpress |
| 6 | Hu Tieu Lien Hua | hủ tiếu Nam Vang (premium) | D3 | 1 | Thanh Niên + Ngoi Sao/VnExpress |
| 7 | Ca Phe Do Phu | bạc xỉu (secret-bunker "Commando Café") | D1 | 1 | VietnamNet + Vietnam.vn (+ Saigon Scene) |
| 8 | Bun Bo Hue Dong Ba | bún bò Huế | D1 | 1 | Culture Trip + Vietnam.com |
| 9 | Banh Khot Co Ba Vung Tau | bánh khọt & bánh xèo | D3 | 2 | Vietnam Coracle + Eating Saigon* |
| 10 | Bot Chien Dat Thanh | bột chiên (40+ yrs) | D3 | 2 | Eating Saigon* + BAB Local* |

*Places 9 & 10 lean on supporting-tier food blogs. Both are genuinely famous long-running Saigon
institutions, but before publish their sourcing should be upgraded with one top-tier co-source
(Saigoneer/Vietcetera/VnExpress/Michelin) — flagged in `SOURCES_HCMC_CANON.json`.

Dish coverage added: **phở ×3, hủ tiếu Nam Vang ×2, chè ×1, cà phê/bạc xỉu ×1, bún bò Huế ×1,
bánh khọt ×1, bột chiên ×1.**

## Notable finds
- **Ca Phe Do Phu** — not just a bạc xỉu café: a preserved Viet Cong special-forces safehouse with a
  weapons bunker and hidden "secret mailbox" under the floor. Strong sight/food crossover; VietnamNet
  and Vietnam.vn both cover it.
- **Hu Tieu Ty Lum** — the rare Saigon hủ tiếu Nam Vang cooked by an actual ex-cook for the Cambodian
  royal family (Saigoneer's street-food history piece).
- **Pho Tau Bay** — the "tô xe lửa" (train-car bowl) is the viral signature; official site
  photaubay1954.com, 70+ years.
- The **ngoisao.vnexpress.net "8 thương hiệu hủ tiếu Nam Vang trứ danh Sài Gòn"** and
  **thanhnien.vn** pieces are gold for the hủ tiếu canon — reuse them next wave for Kim Tháp / Nam Lợi.

## Address / verification flags (for the geocode + location-verify pass, per CLAUDE.md 4a/4b)
- **Hu Tieu Ty Lum** — sources conflict on location: Saigoneer says **Thành Thái St (D10)**, the
  VnExpress/Ngoi Sao aggregate says **Huỳnh Mẫn Đạt St (District 5)**. Placed at D5 pending
  confirmation; there may be two branches. Confirm exact street/number + district before geocoding.
- Several addresses lack a street number (Ty Lum, Lien Hua) or carry a best-effort ward — confirm all
  street numbers/wards during location-verify. No coordinates were assigned in this discovery wave.
- All 10 confirmed **OPEN** (2025/2026) from the source snippets; none marked CLOSED.

## Dropped / not added (measure-before-adding + merit bar)
- **Pho Quynh** (323 Phạm Ngũ Lão, D1; bò kho phở, 24h) — only one clearly-credible source (The Dot)
  found before budget ran out; needs a 2nd credible to clear the bar. Re-check next wave.
- **Banh Mi Nguyen Sinh / Nguyên Sinh 1942** (141 Trần Đình Xu, D1; oldest Vietnamese-run bánh mì,
  French charcuterie) — historically significant but only Vietnamese-Wikipedia + UGC found; no 2nd
  credible editorial yet. Strong re-check candidate.
- **Banh Mi Ba Huynh / Madam Win** (68 Hàm Nghi, D1) — famous giant loaf, but only TripAdvisor + SEO
  listicles surfaced; Mark Wiens' "3 banh mi" piece covers Huỳnh Hoa/Hòa Mã/Bảy Hồ, not Bà Huynh. No
  credible recommender yet — dropped.
- **Hu Tieu Kim Tháp** (Bà Hạt, D10) — credible (Thanh Niên + Ngoi Sao) BUT dropped to avoid stacking
  a 3rd near-identical hủ tiếu Nam Vang (Ty Lum + Lien Hua already cover the standouts, plus existing
  Hong Phat + Quang Ky). Merit-bar de-stack.
- **Che Thai Nguyet Hy** (280 Nguyễn Tri Phương, D10) — same chè street as Y Phương; kept only the
  standout (Y Phương) per de-stack rule.

## Backlog — researched leads NOT yet source-verified (budget lockout). Verify ≥2 credible each next wave:
- **Cà phê muối "Chú Long"** — the mobile stall in the VnExpress salt-coffee story; salt coffee is THE
  recent viral Saigon trend (origin: Cà Phê Muối, Huế, 2010; viral in Saigon 2024). Needs a fixed,
  addressable, named Saigon spot before adding.
- **Cà phê vợt Ba Lù** (Cholon, sock-filter coffee) — Saigoneer likely covers; verify.
- **Súp cua** near Hồ Con Rùa; **cơm gà Đông Nguyên** (Cholon Hainanese chicken rice, possible
  Michelin); **lẩu cá kèo Bà Huyện** (D3 cá kèo hotpot); **lẩu dê 6 Tảo** (D5 goat hotpot) — the
  nhậu/lẩu institutions the wave never reached.
- **Phá lấu D4** (Saigoneer has a phá-lấu culture piece — needs a specific named stall, e.g. on Tôn
  Đản/Đoàn Văn Bơ).
- **Vĩnh Khánh (D4) snail houses** beyond existing Ốc Oanh/Ốc Đào — Rusty Compass + Will Fly for Food
  cover the strip; find a 2nd named ốc house.
- **Bún mắm 444** (375 Lê Quang Định, Bình Thạnh) — only SEO found; needs credible.
- **Bánh tráng trộn Nguyễn Thượng Hiền (D3)** — viral snack STREET (ZNews tag); pick one named stall
  (e.g. Chú Viên) with credible coverage, or record as a street phenomenon.
- **Cơm tấm** additional (Nguyễn Văn Cừ D5, Kiều Giang, Cali) — all SEO-only so far; needs credible.
- **Bún bò Huế Chú Há** (300 Võ Văn Tần, D3, glass-bowl) / **Bún Bò Gánh** (110 Lý Chính Thắng, D3) —
  VietnamAirlines guide found; needs a 2nd credible.
- **Nem nướng Nha Trang**, **gỏi cuốn / bì cuốn**, **egg coffee** (note: cà phê trứng is Hanoi, not a
  Saigon signature — likely skip), **bánh canh cua** alt to existing 87 Trần Khắc Chân.
