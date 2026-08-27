# HCMC (Saigon) — Deep Sights Pass (things to see, NOT food)

Output: `SIGHTS_HCMC.json` — **35 NEW sights**, all `a:"VN"`, no coordinates (geocoding is a
separate stage). De-duplicated against the built dataset's `P` (War Remnants Museum, Ben Thanh
Market, Cu Chi Tunnels already in — none re-added; 0 dupes).

## Counts by tier
- **T1 (must-see): 9** · **T2: 21** · **T3: 5**
- Every region carries >=1 T1 (build asserts satisfied): D1 has 5 T1s, Cholon T1 = Thien Hau,
  Binh Thanh T1 = Landmark 81, day-trips T1 = Cao Dai Holy See + Mekong Delta.

## Counts by area / neighbourhood
- **District 1 core:** Reunification Palace (T1), Notre-Dame Basilica (T1), Central Post Office (T1),
  Jade Emperor Pagoda (T1), Nguyen Hue Walking St + People's Committee (T1), Opera House (T2),
  Bitexco/Saigon Skydeck (T2), HCMC Museum/Gia Long Palace (T2), Museum of Vietnamese History (T2),
  Fine Arts Museum (T2), Cafe Apartment (T2), Book Street (T2), Bui Vien (T2), Ton Duc Thang Museum
  (T3), Dan Sinh War-Surplus Market (T3). — 15
- **District 3:** Turtle Lake (T2), Vinh Nghiem Pagoda (T2), Xa Loi Pagoda (T2), Tan Dinh Pink Church
  (T2), Southern Women's Museum (T3). — 5
- **District 4:** Ho Chi Minh Museum / Dragon House Wharf, Nha Rong (T2). — 1
- **Binh Thanh:** Landmark 81 & SkyView (T1). — 1
- **Cholon (District 5/6):** Thien Hau Temple (T1), Binh Tay Market — D6 (T2), Cha Tam Church (T2),
  Nghia An Hoi Quan / Ong Temple (T2), Ong Bon / Nhi Phu Temple (T3), Ha Chuong Hoi Quan (T3). — 6
- **Tan Binh:** Giac Lam Pagoda (T2). — 1
- **Day trips:** Cao Dai Holy See – Tay Ninh (T1), Mekong Delta My Tho/Ben Tre (T1), Ba Den Mountain
  – Tay Ninh (T2), Can Gio Mangrove Biosphere/Monkey Island (T2), Cai Rang Floating Market – Can Tho
  (T2), Vung Tau/Christ the King (T2). — 6

## Sources used (all credible per brief; Yelp/TripAdvisor/Google = 0, never cited)
Wikipedia (notability/coords), **Saigoneer** (Notre-Dame, Cafe Apartment, Nguyen Hue, Book St, Bui
Vien, Turtle Lake, Tan Dinh — dedicated heritage features), **Vietcetera** (Post Office, museums,
Cholon), **Vietnam Coracle** (Cafe Apartment, Can Gio), **Lonely Planet** (HCMC Museum, Xa Loi, Ha
Chuong, Giac Lam, day trips, Ba Den), **CNN Travel** (Landmark 81), Atlas Obscura (Nghia An),
**Spectral Codex** (independent Cholon temple/guildhall research — Thien Hau, Cha Tam, Nghia An),
Travelfish (independent SEA guide — Jade Emperor, Vinh Nghiem, Binh Tay), VietnamPlus / VietnamNet /
VOV World (state media — Notre-Dame restoration, Dragon House), TheSmartLocal, Culture Trip,
There She Goes Again (blogger already cited in this project), Lune Production (official Opera House A O
Show operator), Vietnam National Tourism (vietnam.travel — Mekong, Vung Tau), and official sites
(Reunification Palace, Bitexco, Southern Women's Museum, Ton Duc Thang Museum, Can Gio/NBCA).
Every place has >=2 credible sources, or Wikipedia + an official/institutional site (Reunification
Palace = national monument + official; Can Gio = UNESCO MAB reserve + official NBCA; museums are
official municipal institutions).

## ACCESS / OPEN-CLOSED / RENOVATION notes (fact-checked 2026)
- **Saigon Notre-Dame Basilica — UNDER RESTORATION.** Closed for works since 2017; completion pushed
  to ~**2027** (was 2020, then 2023; COVID + imported-material delays). As of **March 2026** exterior
  scaffolding is coming off but conservation continues — flagged in the record as exterior-view only,
  interior not open to visitors. Kept (marquee landmark), status noted, not presented as fully open.
- **People's Committee Building** (Hotel de Ville): a working government HQ — **not open to the
  public**; recorded as viewed-from-outside within the Nguyen Hue Walking Street entry.
- **Bitexco Saigon Skydeck** open daily ~09:30-21:30 (~240,000d); **Landmark 81 SkyView** floors
  79-81 — both operating 2026.
- Museums (HCMC Museum, History Museum, Fine Arts, Southern Women's, Ton Duc Thang) — all open,
  **closed Mondays**, most with a midday break; History Museum runs water-puppet shows.
- Temples/churches (Jade Emperor, Thien Hau, Giac Lam, Vinh Nghiem, Xa Loi, Nghia An, Ong Bon, Ha
  Chuong, Cha Tam, Tan Dinh) — all active places of worship, free, open daily.
- **Cai Rang Floating Market** — deep in the Delta (~3.5 hrs each way from HCMC); trading winds down
  by ~08:30, so noted as a long early-start day trip / better overnight.
- No permanently-closed sights were added, so none needed a `— CLOSED` flag.

## MEASURED & DROPPED (mention is not merit; sourcing bar not met)
- **Ao Dai Museum (Si Hoang, District 9)** — real and interesting (est. 2014, ~500 ao dai in a 20,000
  m2 garden) but **only aggregator/tour-blog coverage found** (LocalVietnam, Holidify, IDC, VinWonders
  — none in the credible palette); no Wikipedia article; also ~22 km out in District 9. Failed the
  >=2-credible bar → dropped. Note: a small satellite gallery exists at 77 Nguyen Hue, D1.
- **Saigon Central Mosque (Jamia Al-Musulman, 66 Dong Du, D1)** — genuine 1935 heritage mosque, but
  the only *credible* source found was Wikipedia (everything else was OTA/aggregator); a mosque is not
  an "institutional authority" under the lone-source rule, so 1 credible source = under bar → dropped.
- **Tao Dan Park (D1)** — pleasant 10 ha central park with a bird cafe and Hung Kings shrine, but
  coverage was tour-blog/aggregator only; no credible recommender met the bar → dropped.
- **Van Thanh Park (Binh Thanh)** — a local recreation park; low merit, no credible editorial → not
  pursued.
- **Cu Chi Tunnels** — already in the dataset; skipped per brief.

## Notes for the geocoding stage
- All addresses include street/ward/district + "Ho Chi Minh City, Vietnam" (day trips give the
  province + distance-from-HCMC). Watch the districts: **Binh Tay Market is District 6** (not 5),
  **Dragon House / Ho Chi Minh Museum is District 4**, Cholon temples span **D5/D6**. Day-trip sights
  (Cao Dai, Ba Den = Tay Ninh; Cai Rang = Can Tho; Vung Tau = Ba Ria-Vung Tau) sit **outside** the
  HCMC bounding box — flag for the validator's box check.
