# HCMC — Places to Visit / Things to Do (discovery wave)

Output: `SIGHTS_HCMC_TODO.json` — 31 NEW sights (dict: `sights` + `sources`). No food. Deduped against
`_hcmc_existing.txt` (183 names): zero collisions (exact + normalized name match).

## Counts by category
- Art gallery: 6 (Galerie Quynh, Salon Saigon, Craig Thomas, San Art, MoT+++, The Factory)
- Temple: 4 (Phap Hoa, Phung Son, Giac Vien, Sri Thendayuthapani)
- Church: 2 (Cho Quan, Jeanne d'Arc / Nga Sau)
- Museum: 1 (Ao Dai Museum)
- Park: 3 (September 23, Le Van Tam, Dam Sen)
- River: 1 (Bach Dang Wharf & Saigon Waterbus)
- Market: 4 (Ba Chieu, An Dong, Ton That Dam Old Market/Cho Cu, Saigon Centre & Takashimaya)
- Walking street: 3 (Le Cong Kieu antiques, Hai Thuong Lan Ong medicine st, Little Japan/Le Thanh Ton)
- Performance: 3 (A O Show, Golden Dragon Water Puppet, Sax n Art Jazz Club)
- Architecture: 4 (14 Ton That Dam Apartment, Hotel Continental, Hotel Majestic, Rex Hotel Rooftop)

## Counts by district (each has >=1 tier-1)
- District 1: 16  | District 5: 4 | District 11: 3 | Binh Thanh: 3 | District 2 (Thu Duc): 2
- District 3: 2 | District 9 (Thu Duc): 1
D1 is heavy (it holds the historic core: colonial hotels, downtown galleries, Little Japan, the
antique/old-market streets, the two theatre/puppet venues). Spread reaches Cho Lon (D5), the pagoda
belt (D11), Binh Thanh's art + market scene, and the Thao Dien/Thu Duc art cluster.

## Notable adds
- **Heritage hotels of literary/war Saigon** — Continental (Graham Greene wrote *The Quiet American*
  in Room 214; SCMP + Historic Vietnam), Majestic (1925 riverfront; Wikipedia + official), Rex rooftop
  ('Five O'Clock Follies' wartime press briefings; Wikipedia + official). Strong-sourced.
- **Contemporary-art spine** — Galerie Quynh (Wikipedia), San Art (Lonely Planet), The Factory (e-flux),
  MoT+++, Salon Saigon, Craig Thomas: gives HCMC a real gallery layer it was missing.
- **Cho Lon depth** — Cho Quan Church (oldest parish, 1722; official HCMC gov portal), Jeanne d'Arc/Nga
  Sau Gothic church, An Dong wholesale market, Hai Thuong Lan Ong herbal-medicine street (Saigoneer).
- **Riverfront + performance** — Bach Dang Wharf/Waterbus, A O Show (Lune, at the Opera House), Golden
  Dragon water puppets, Sax n Art jazz.
- **14 Ton That Dam Apartment** — the *original* cafe-apartment block (Vietnam Coracle + Saigoneer),
  distinct from the already-listed 42 Nguyen Hue "Cafe Apartment".

## OPEN/CLOSED
All 31 default open (closed:false). No permanently-closed places added; none needed a "— CLOSED" marker.
Flagged in write-ups: **The Factory** and **San Art** — confirm current programming/location before
visiting (San Art relocates periodically; The Factory's post-2023 status is worth a quick check).
**Sax n Art** relocated from downtown D1 to Thao Dien (address reflects the current venue).

## Dropped (measured, did not clear the bar cleanly here)
- **Gia Dinh Park (Go Vap)** — genuinely large green space, but the only sources found were Vingroup-owned
  (Vinpearl/VinWonders = effectively one voice); generic park, no independent credible second source.
- **Tam Son Hoi Quan (Cholon assembly hall)** — real heritage temple, but only mid-tier guide blogs
  found (no Wikipedia/Saigoneer/Vietcetera); city already has 6 Cholon assembly halls listed. Skipped
  to hold the source bar; revisit if a credible source surfaces.

## Source-bar notes (for the audit)
- Institutional/strong pairs: Wikipedia (Galerie Quynh, Majestic, Rex, September 23 Park, Le Van Tam),
  official HCMC gov portal (Cho Quan), SCMP/Historic Vietnam (Continental), Saigoneer (Le Van Tam, Cho
  Cu, Hai Thuong Lan Ong, 14 TTD), Vietnam Coracle (14 TTD), Lonely Planet (San Art), e-flux (Factory),
  Vietnam National Tourism (Bach Dang, Cho Cu), state press VietnamNet/Nhan Dan (Phap Hoa).
- **Borderline (2 credible-but-lighter sources, flagged)**: Ao Dai Museum, Phung Son, Giac Vien,
  Sri Thendayuthapani, Jeanne d'Arc, Ba Chieu, Dam Sen, Sax n Art. All are genuinely notable (national
  relics, only-3-in-city Hindu temple, largest wholesale/fashion market, etc.); paired best available
  credible sources. Worth a second confirming source at build/geocheck time.
- A O Show cites the Lune Production official producer site as lone authority (the definitive source for
  the show itself).
