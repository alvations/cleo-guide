# HCMC SOUTH belt — District 7 / Phú Mỹ Hưng, Nhà Bè, deeper District 4 — discovery wave

Namespaced `*_HCMC_D7.json`. HCMC sources kept SEPARATE from the Singapore registry.
No existing file touched. All places deduped against `_hcmc_existing.txt` (264 names) and against the
already-built HCMC waves. Every place fact-checked OPEN for 2024/2025; all `closed:false`.

## Counts
- **NEW places added: 4** — 3 food + 1 sight/experience.
- **District 4**: Ốc Thảo (food, t2), Ốc Vũ (food, t3), Vĩnh Khánh Food Street (sight, t1).
- **District 7 / Phú Mỹ Hưng**: Perilla (Korean, food, t2).
- **Nhà Bè**: 0 — see gap note below.
- Food tiers: t2=2, t3=1. Sight tiers: t1=1.

## The honest headline: the south belt is thin on ≥2-credible-source venues, and the earlier waves already took the cream
This wave was run at the guide's strict gate (≥2 credible sources, OR one lone institutional authority;
Yelp/TripAdvisor/Google/Foody = 0). Two structural facts capped the yield:

1. **Prior HCMC waves already captured the credibly-sourced south canon**, all confirmed present in
   `_hcmc_existing.txt` and therefore NOT re-added:
   - D7: **Phu My Hung Korea Town**, **Crescent Mall & Starlight Bridge (Cau Anh Sao)**,
     **Every Half Coffee Roasters** (Hưng Gia II, PMH), **Mi Lanh Yoo Chun** (the PMH naengmyeon spot),
     **Tía Tô** (the D7 Saigoneer Hẻm Gems Korean comfort-food gem).
   - D4: **Ốc Oanh**, **Ốc Đào**, **Com Tam Bai Rac** (77 Lê Văn Linh),
     **Ho Chi Minh Museum – Dragon House Wharf (Nha Rong)**, **Banh Canh Cua 87 Tran Khac Chan** / **Ba Ba**.
2. **Korea Town's Korean restaurants are covered almost entirely by non-qualifying sources** — Korean-language
   expat blogs (hochiminhgourmet, vietnamtraveler.wixsite) and SEO listicles (mytour, vietpowertravel,
   almondtravel). The credible English outlets (Saigoneer, Vietcetera, TheSmartLocal) treat D7 Korean food
   mostly at neighbourhood level, naming very few individual places. Only **Perilla** cleared 2 credible
   (Saigoneer + TheSmartLocal).

## Notable finds (added)
- **Vĩnh Khánh Food Street (t1)** — the strongest addition: D4's after-dark snail/seafood strip, an official
  Saigon food street (2018), named by VnExpress among the world's coolest snail streets. 5 credible sources
  (Saigoneer + Rusty Compass + Vietnam Coracle + VnExpress + Will Fly for Food). Ốc Oanh (already in the guide)
  is its MICHELIN-Selected anchor.
- **Ốc Thảo (383 Vĩnh Khánh) & Ốc Vũ (37 Vĩnh Khánh)** — the two snail houses on that strip that clear the bar,
  each named by BOTH Rusty Compass and Will Fly for Food.
- **Perilla (D7 Korea Town)** — home-style Korean, famous for its banchan spread and perilla-seed shiraegi soup;
  Saigoneer + TheSmartLocal.

## Below-the-bar / dropped (a future wave with search budget should chase second sources for these)
Strong single-Saigoneer-Hẻm-Gems D7/D4 gems (1 credible each — NOT added, matching the built data where the
only single-source entries are institutional/Michelin):
- **Bò Né "Cô Thủy" / Bò Né Thanh Tuyền, D4** — 25-yr sizzling-steak breakfast (Saigoneer). Name ambiguity too.
- **Mì Gia 79, D4** (mì gà, by Vĩnh Khánh–Hoàng Diệu) — Saigoneer.
- **Miến lươn từ Nghệ An, 507 Nguyễn Thị Thập, D7** — turmeric eel glass-noodle (Saigoneer).
- **"Piquant Thai Noodles in D7"** — Saigoneer.
Snail/D4 street food with only 1 credible or SEO-only sourcing: **Quán Bé Ốc** (58/53 Vĩnh Khánh — Vietnam
Coracle only), **Ốc Nho** (Xóm Chiếu), D4 **phá lấu** cluster (Cô Oanh / Dì Nủi / Cô Thảo on Tôn Đản & Xóm
Chiếu), **Bánh canh cua Ba Lúa 206** — all SEO/aggregator only.
D7 international / Korean chains (not city-unique and/or ratings-only): **El Gaucho PMH**, **San Fu Lou (Crescent
Mall)**, **L'Usine PMH** (brand already in guide), **Fujiro** & **Jimmy's Pizza** (Urban Sesame only), Korean-BBQ
franchises **Galbi Brothers / Daks / Don Chicken / Yoogane / Samwon / Gangnam BBQ / Saigon House** (SEO or
single Korean-blog sourcing). **Củ & Rễ** (D7 plant-based) held back: Saigoneer directory-listing + Urban Sesame
only, and open/closed status could not be re-verified before the session's WebSearch budget ran out.

## Nhà Bè — stated gap, not filled
Nhà Bè has **no credible-sourced visitor attraction**. The Wikipedia entry is the administrative district only;
the recurring "attraction" (Kenton Node) is a stalled riverfront real-estate project, not a place to visit, and
local pagodas (Pháp Võ etc.) lack a full Wikipedia article or 2 credible sources. Per the guide's "gaps are
stated, not filled" rule, nothing was invented for Nhà Bè.

## Sights considered and deliberately skipped
- **Hồ Bán Nguyệt / Crescent Lake Park (D7)** — cleared 2 credible (Vietcetera + Saigoneer) but is the same
  lakefront the existing **Crescent Mall & Starlight Bridge (Cau Anh Sao)** entry already covers; skipped to
  avoid stacking near-identical POIs (anti-padding rule).
- **SC VivoCity (D7)** — corporate/developer sourcing only; and a second D7 mega-mall after Crescent Mall would
  be padding. Skipped.

## Map binning
Every address carries its district token — "District 7 / Phú Mỹ Hưng" or "District 4" — and ends
"Ho Chi Minh City, Vietnam". No coordinates (geocode + placement verification happen at build time via
`data/geocodes.json`).
