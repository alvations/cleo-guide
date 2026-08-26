# SEA-cities discovery pass — note (FOOD_SEA / SIGHTS_SEA)

Discovery for the six non-Singapore areas: **MY, TH, VN, ID, PH, IC**. WebSearch only.
Flow: discover credible/local sources → expand → fact-check open/closed (2025/2026) → rank within each area.
NO coordinates (geocode stage owns those). Addresses include city + country.

## Counts by area + tier

| Area | Sights (T1/T2) | Food (T1/T2) |
|---|---|---|
| MY | 6 (T1:4, T2:2) | 6 (T1:4, T2:2) |
| TH | 6 (T1:4, T2:2) | 6 (T1:3, T2:3) |
| VN | 6 (T1:5, T2:1) | 5 (T1:4, T2:1) |
| ID | 6 (T1:3, T2:3) | 4 (T1:1, T2:3) |
| PH | 4 (T1:2, T2:2) | 4 (T1:1, T2:3) |
| IC | 7 (T1:6, T2:1) | 4 (T1:2, T2:2) |
| **Total** | **35** | **29** |

Every area has ≥1 tier-1 must-see (build assert satisfied). Grand total 64 records.

## Sources — SEPARATE per city/country (per coordinator instruction)

Namespaced, non-colliding source keys; each place ≥2 credible **or** one lone institutional (MICHELIN/UNESCO).
Yelp/TripAdvisor/OpenTable/Google = 0 toward the bar (used only to fact-check open/closed & measure).

- `SOURCES_KL / _PENANG / _MALACCA / _BANGKOK / _CHIANGMAI / _HCMC / _HANOI / _JAKARTA / _BALI / _MANILA / _IC.json`
- `CREATORS_KL / _PENANG / _MALACCA / _BANGKOK / _CHIANGMAI / _HCMC / _JAKARTA / _MANILA / _IC.json`

### Key → name → url (master; also embedded in SIGHTS_SEA.json "sources")
Institutional / cross: `UNESCO`, `MICHELIN`, `MICHELIN_BIB`, `MICHELIN_STAR`, `WIKIPEDIA`, `LONELYPLANET`,
`CNNTRAVEL`, `BBCTRAVEL`, `AFAR`, `FODORS`, `ASIA50BEST`, `OFFICIAL`.
MY: `EATDRINKKL`(eatdrinkkl.com), `KLFOODIE`(klfoodie.com, ~2M IG), `TIMEOUTKL`, `PENANGFOODIE`,
`VISITPENANG`, `THESTAR`, `MALAYMAIL`, `SETHLUI`, `EATBOOK`, `TOURISMMY`, `SILVERKRIS`, `MARKWIENS`.
TH: `TATNEWS`, `TIMEOUTBKK`, `BKMAG`, `EATINGTHAIFOOD`(Mark Wiens), `CHANGPUAK`.
VN: `VIETNAMCORACLE`(Tom Divers), `VIETCETERA`, `VNEXPRESS`, `DANIELFOOD`.
ID: `INDONESIATRAVEL`(Wonderful Indonesia), `TIMEOUTJKT`, `ANAKJAJAN`, `NEXCARLOS`(5.2M YT).
PH: `SPOTPH`, `RAPPLER`, `FEATR`(Erwan Heussaff, 4.6M IG / James Beard), `OURAWESOMEPLANET`(Anton Diaz),
`AUTHENTICFOODQUEST`, `GUIDETOPH`.
IC: `WANDERLUSH`(Emily Lush).

### Vetted local creators (each = ONE corroborating source, never an authority)
- **Mark Wiens** — 11.7M YouTube, Bangkok-based; Bangkok/Chiang Mai + Jonker St Malacca rice-ball content.
- **Nex Carlos** — 5.2M YouTube, Jakarta/Jabodetabek food vlogger.
- **Erwan Heussaff / FEATR** — 4.6M IG, 2023 James Beard Media Award; Manila/Cebu food docs.
- **KL Foodie** — ~2M IG (Good Foodie Media); + **Penang Foodie** (same group).
- **Vietnam Coracle (Tom Divers)** — top independent VN travel resource, resident since 2005, 400+ guides.
- **Emily Lush / Wander-Lush** — Nat Geo Traveller & Conde Nast Traveller contributor; Cambodia/Laos resident-expert.
- **AnakJajan**, **Seth Lui**, **Daniel Food Diary** — established regional food blogs.

## Fact-check: OPEN/CLOSED (2025/2026)
All 64 records verified **OPEN**. No permanently-closed places included, so no `closed:true` flags.
Notes carried where operations changed:
- **Air Itam Laksa (Penang)** — suspended in the pandemic, **reopened; now weekends only**. Open.
- **Lou Wong (Ipoh)** — **relocating in 2026** to a larger nearby premises; still trading. Open.
- **Raan Jay Fai (Bangkok)** — retirement rumours **denied** (2024–25); scaled to **Wed–Sat**. Michelin star retained. Open.
- **Cuisine Wat Damnak (Siem Reap)** — still operating (OAD Leading Restaurants of Asia, ~#268 in 2025). Open.

## MEASURED & DROPPED (merit bar; no padding)
- **Nancy's Kitchen (Malacca, Peranakan)** — MEASURED (Vulcan Post + blogs) → DROPPED; Chung Wah chicken-rice-ball
  had stronger sourcing (Mark Wiens + MICHELIN editorial) and is the more city-signature dish.
- **Kim Lian Kee Hokkien Mee (KL)** — MEASURED → DROPPED; credible sourcing thin beyond local listicles.
  Village Park nasi lemak chosen to represent Greater KL.
- **Lorong Selamat CKT (Penang)** — MEASURED (famous red-hat stall) → held; kept ONE Penang CKT (Penang Road Famous,
  Michelin-listed) to avoid stacking two near-identical mid dishes.
- **Bangkok "boat noodles" (Victory Monument strip)** — MEASURED → DROPPED as a place; no single stall cleared
  ≥2 credible. Signature noodle slots filled by Michelin-listed items instead.
- **Restoran Sederhana (Jakarta Padang chain)** — MEASURED → DROPPED (large chain); Pagi Sore chosen for heritage +
  Asia's 50 Best "Essence of Asia".
- **Ayer's / CnT / other Cebu lechon** — MEASURED → DROPPED as padding; Zubuchon + Rico's suffice for Cebu.
- **Naughty Nuri's ribs (Bali)** — DROPPED; not a signature Balinese dish (Ibu Oka babi guling represents Bali).

## Cuisine-tag caveat
The dataset's cuisine taxonomy (`consolidate.py` CMAP) is Singapore/Malaysia-centric. Filipino/Burmese/Khmer/Lao
have no dedicated id and fall back to `HAWKER`; each such card still names a **specific dish** and tags the
**kitchen's own tradition** in `cz`. Worth adding PH/MM/KH/LA cuisine ids to the taxonomy at build time.

## Signature-first coverage confirmed
MY: char koay teow, asam laksa, nasi kandar, nasi lemak, Ipoh bean-sprout chicken, Malacca chicken-rice balls.
TH: crab omelette (Jay Fai), pad thai (Thip Samai), mango sticky rice (Kor Panich), kuay jub, khao soi ×2 (Chiang Mai).
VN: pho (Bat Dan), bun cha (Obama/Huong Lien), banh mi ×2 (Huynh Hoa, Phuong/Hoi An), com tam.
ID: babi guling (Bali/Ibu Oka), sate, gudeg (Yogyakarta), rendang/nasi padang.
PH: Cebu lechon ×2 (Zubuchon, Rico's), chicken BBQ (Aristocrat), sisig (Manam).
IC: mohinga (Yangon), Khmer degustation/amok (Siem Reap & Phnom Penh), Lao laap platter (Luang Prabang).
