# W6 subagent rules (Okinawa) — addendum. Read `_okinawa_w4_agentrules.md` FIRST (binds), then `_okinawa_w5_agentrules.md` (binds), then this.

Date 2026-10-03. W6 additions:
- **Productive patterns from W5 (use these first):**
  - Restaurant pins: WebSearch mode **extended**, ONE place per query: `<日本語名> <full JA street address> 緯度 経度`
    (hit 20/23 in W5G1) → listing coordinate = `low` (accept only if consistent with the sourced street address; name
    the aggregator in geoSource). Kerama/island spots: `<日本語名> navitime 緯度 経度` → `med` venue page.
  - Sights: `<日本語名> wikipedia 座標` (extended) → `high`.
- **Discovery:** Japanese list searches mostly return aggregators (never recommenders). Pair outlets deliberately:
  Rurubu ↔ Mapple ↔ Okinawa Traveler ↔ OTV Okitive ↔ Okinawa Times / Ryukyu Shimpo polls ↔ Stripes ↔ OCVB (okinawastory.jp)
  ↔ japan-guide / Lonely Planet / GLTJP / visitokinawajapan. One list search → 4–8 names; one confirm search → 2–4 kept.
  Read held leads in `_okinawa_W5D*_notes.md` and `_okinawa_W4D*_notes.md` first — pairing a held lead is the cheapest win.
- **FOOD & DRINK ≥55 % of what you add** (RUN §2b) unless your task says sights. Okinawan canon: Okinawa soba / Yaeyama
  soba / Miyako soba / sōki soba, taco rice, chanpurū (gōyā/fu/sōmen), agu pork, rafute, jūshī, inamuruchi, tebichi,
  sata andagi, chinsuko, zenzai (Okinawa shaved-ice), Blue Seal, A&W, awamori distilleries & awamori bars, Orion,
  shokudō, steak houses (post-war), sakaba/senbero, Okinawan coffee/bakeries, ishigaki beef, mozuku, umibudō.
- **Creators:** ≥2 searches per discovery agent; record kept AND rejected in `CREATORS_OKINAWA_<TAG>.json`.
- **Don't duplicate:** right before appending check `data/okinawa.dataset.json` (P/F `n`) AND every
  `FOOD_/SIGHTS_OKINAWA_W6*.json` sibling (siblings run concurrently). Same place under a different romanisation = dup.
- Status (4c) on every record you write (food records: put status in your geo record; closed places: `"closed": true`
  and name ends `— CLOSED`).
- Pin each new place in the same pass when a valid point surfaces (geo file `<TAG>`), else write an UNVERIFIED geo record.
