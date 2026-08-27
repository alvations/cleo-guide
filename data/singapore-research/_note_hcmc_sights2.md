# HCMC Sights — Discovery Wave 2 (deepen SIGHTS & THINGS TO DO)

Output: `SIGHTS_HCMC2.json` — dict `{"sights":[13], "sources":[9]}`. All records `closed:false`
(none permanently closed as of 2025/2026). Additive to `SIGHTS_HCMC.json` (35 sights); deduped
against the 109-name `_hcmc_existing.txt` — **zero collisions**.

## IMPORTANT — session WebSearch budget hit mid-wave (200/200, shared cap)
Research was cut off before every candidate could be fully corroborated. I shipped **only** places
backed by a credible source I actually saw in results, and I did **not** fabricate any URL. Six sights
carry ≥2 credible sources; seven rest on a single credible/institutional authority (Wikipedia for a
national relic / VnExpress national feature / Saigoneer heritage profile / Vietnam Airlines destination
guide) — all legitimate under the "one lone institutional authority" clause, but they should get a 2nd
source added in a budgeted top-up pass before publish. **Single-source entries are flagged below.**
The wave target (20–30) was not reached because of the search cap; a follow-up pass with budget can add
the ~9 researched-but-held candidates listed under DROPPED/HELD.

## Counts by category
- Market / food street: 2 (Ho Thi Ky, Tan Dinh Market)
- Park & nature / riverfront: 3 (Tao Dan, Binh Quoi Village, Saigon River Park)
- Temple / church / mosque: 5 (Mariamman Hindu, Huyen Sy Church, Buu Long Pagoda, Saigon Central
  Mosque, Quan Am/On Lang Pagoda)
- Museum: 1 (FITO Traditional Medicine)
- Zoo & botanical gardens: 1 (Saigon Zoo / Thao Cam Vien)
- Tomb-temple / national relic: 1 (Le Van Duyet, Lang Ong Ba Chieu)

## Counts by tier (within district)
- Tier 1: 4 — Mariamman (D1), Ho Thi Ky (D10), Buu Long (Thu Duc), Le Van Duyet (Binh Thanh)
- Tier 2: 8 — Tao Dan, Huyen Sy, Tan Dinh, Saigon Zoo (D1); FITO (D10); Quan Am (D5); Saigon River
  Park (Thu Duc); Binh Quoi (Binh Thanh)
- Tier 3: 1 — Saigon Central Mosque (D1)

Each in-wave district has a tier-1 EXCEPT District 5 (only Quan Am/On Lang at t2). D5's tier-1 already
lives in the main file (Thien Hau Temple, t1); On Lang is honestly a notch below Thien Hau/Nghia An, so
it stays t2 rather than inflating the tier.

## Sources used (namespaced, HCMC-separate)
WIKIPEDIA, SAIGONEER, VIETNAMNET, VIETNAMNEWS, VNEXPRESS, VIETNAMAIRLINES (national flag-carrier
destination guide), HISTORICVIETNAM (Tim Doling heritage research), SAIGONTOURIST (state tourism
enterprise, official), OFFICIAL (binhquoi.vn). Yelp/TripAdvisor/Google/Vinpearl/VinWonders/SEO blogs
were treated as ZERO toward the bar.

### Source strength per sight
| Sight | Sources | Bar |
|---|---|---|
| Mariamman Hindu Temple | Wikipedia + Vietnam Airlines | ≥2 credible ✓ |
| Ho Thi Ky Flower & Food Market | Saigoneer + Vietnam Airlines | ≥2 credible ✓ |
| Tao Dan Park | Saigoneer + VietnamNet | ≥2 credible ✓ |
| Huyen Sy Church | Saigoneer + VietnamNews + Historic Vietnam | ≥2 credible ✓ |
| Buu Long Pagoda | Saigoneer + VietnamNet (NatGeo top-10) | ≥2 credible ✓ |
| Binh Quoi Tourist Village | Saigontourist (official) + binhquoi.vn (official) | 2 official ✓ |
| Saigon Central Mosque | VnExpress Intl (dedicated feature) | single — FLAG, add 2nd |
| Tan Dinh Market | Saigoneer heritage profile | single — FLAG, add 2nd |
| Le Van Duyet Tomb | Wikipedia (national relic) | single — FLAG, add 2nd |
| Saigon Zoo & Botanical Gardens | Wikipedia (1865 institution) | single — FLAG, add 2nd |
| Quan Am / On Lang Pagoda | Wikipedia | single — FLAG, add 2nd |
| Saigon River Park (Thu Thiem) | Wikipedia | single — FLAG, add 2nd |
| FITO Museum | Vietnam Airlines guide | single — FLAG, add 2nd |

## MEASURED & DROPPED / HELD
- **The Factory Contemporary Arts Centre** — DROP. Vacated its Thao Dien space and is "relocating"
  (165 Nguyen Van Huong) with no working contact and no confirmed reopening (per e-flux/reviews);
  status too uncertain to present as a live sight. Revisit if it reopens.
- **Ao Dai Museum (Si Hoang, District 9)** — HELD/DROP. Real and open, but no credible source found
  (only SEO/blog listings + Holidify/IDC). Fails the merit bar as sourced. Needs Saigoneer/Vietcetera/
  VnExpress corroboration.
- **Golden Dragon Water Puppet Theatre (D1)** — HELD. Legit "thing to do," but coverage seen was only
  Vinpearl/VinWonders/TripAdvisor/Klook — none credible. (Note: water-puppet shows are already covered
  in the main file via the Museum of Vietnamese History.) Needs a credible source.
- **Ba Chieu Market (Binh Thanh)** — HELD. Only local blogs found; no credible source captured before
  budget ran out. Pairs naturally with Le Van Duyet if a Saigoneer/VnExpress piece is found.
- **Dam Sen Cultural/Water Park (D11 → Binh Thoi Ward)** — HELD. Open and operating, but only
  blog/Vingroup coverage captured. Needs a credible/official source.
- **Suoi Tien Theme Park (Thu Duc)** — HELD. Open; only blog/OTA coverage captured. Needs credible.
- **Salon Saigon (D3) / Craig Thomas Gallery (D1)** — NOT RESEARCHED (budget exhausted before their
  searches ran). Good gallery candidates for a follow-up wave (look for Vietcetera/Saigoneer).
- Other suggested-but-unreached: 23/9 (September 23) Park, Van Thanh Park, Cho Quan Church, Xom Chieu
  & Dan Sinh-area markets, rooftop observation bars, Dai Nam / Long Hai / floating-market day trips.

## Notes / judgement calls
- **Buu Long Pagoda is placed in Thu Duc CITY (HCMC), not Dong Nai.** Sources conflate two things: the
  Thai-style *pagoda* (81 Nguyen Xien, Thu Duc, HCMC — the NatGeo top-10 site) vs. the separate *Buu
  Long tourist area / "miniature Ha Long"* in Bien Hoa, Dong Nai. This record is the pagoda.
- **Tao Dan's bird cafe** was disrupted/relocated by Metro Line 1 works (Saigoneer) — writeup says so
  rather than overselling it.
- **Saigon Notre-Dame / bird-cafe / market hours** left as approximate ("~") per the existing file's
  convention; verify exact hours + coordinates at geocode/status stage.
- All addresses carry a District/Ward/Thu Duc token + "Ho Chi Minh City, Vietnam"; no coordinates
  (per schema). Coordinates + OPEN/CLOSED re-verification still owed at the geocode/status gate.
