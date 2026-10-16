# Location-verify report — singapore

_Generated 2026-10-16 by `tools/location-verify.js 0.1.0` · mode **live** · scope unverified, low, status · 712 of 712 rows in scope._

> PROPOSALS ONLY. Nothing here is in data/geocodes.json until a person reviews a row (review.decision) and runs --accept locally, then the gates (research.js --geocheck/--statuscheck, npm run validate, npm test).

City anchor (median of high-confidence pins): 1.36709, 103.86838 · candidates farther than 150 km are discarded as same-name-elsewhere.

Requests: 344 network · 914 cache hits · 300 Nominatim · failures: www.majesticsaigon.com.vn CERT_HAS_EXPIRED; overpass-api.de HTTP 504; overpass-api.de HTTP 502; overpass-api.de HTTP 502

Failed requests by host: www.majesticsaigon.com.vn 1/1 · overpass-api.de 3/9}

OSM lifecycle (closure) evidence missing for 30 row(s): both Overpass instances failed for their batch. Coordinates are unaffected.

## Summary

| outcome | rows |
|---|---|
| status-needs-check | 1 |
| pin | 40 |
| no-match | 100 |
| ambiguous | 8 |
| shared-object | 2 |
| conflict | 6 |
| skipped | 527 |
| confirm | 27 |
| move | 2 |

Review assist (advice against the accept bar): hold 46 · reject 637 · pass 4 · review 1 · no-change 24

## Rows

| place | now | scope | outcome | assist | proposal | evidence |
|---|---|---|---|---|---|---|
| Hawker Chan (Liao Fan Hong Kong Soya Sauce Chicken Rice & Noodle) | UNVERIFIED | unverified | pin | **hold**: wikidata coordinate only (Wikipedia mirrors Wikidata): needs the address or an OSM / official / Census source | 1.28299, 103.84293 **high** · new pin · “Hawker Chan” · [wikidata](https://www.wikidata.org/wiki/Q111180930) 2026-10-16 | overpass: HTTP 500 |
| Toa Payoh Heritage Trail | 1.3323, 103.8457 (low) | low | no-match | **reject**: no proposal | — | overpass: HTTP 500 |
| Kor Panich (K. Panich) | UNVERIFIED | unverified | pin | **hold**: wikidata coordinate only (Wikipedia mirrors Wikidata): needs the address or an OSM / official / Census source | 13.7521, 100.4984 **high** · new pin · “Kor Panich” · [wikidata](https://www.wikidata.org/wiki/Q115802214) 2026-10-16 | overpass: HTTP 500 |
| Khao Soi Mae Sai | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Founder Bak Kut Teh (Balestier) | UNVERIFIED | unverified | pin | **pass**: OSM POI, name 1, house number + street match | 1.32435, 103.85109 **high** · new pin · “Founder Bak Kut Teh” · [osm-poi](https://www.openstreetmap.org/node/4491834991) 2026-10-16 | OSM node/4491834991 amenity=restaurant · addresstype=amenity · name “Founder Bak Kut Teh” · 347 Balestier Road, Singapore, 329777 · check_date=2022-10-27 — overpass: HTTP 500 |
| He Zhong Carrot Cake | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Banh Mi Phuong | 15.87843, 108.332071 (low) | low | ambiguous | **reject**: no proposal | — | candidates disagree by 95578 m; overpass: HTTP 500 |
| Warung Babi Guling Ibu Oka | UNVERIFIED | unverified | pin | **hold**: med: needs a second independent source within 50 m | -8.50576, 115.26435 **med** · new pin · “Warung Babi Guling Ibu Oka” · [osm-poi](https://www.openstreetmap.org/way/705065779) 2026-10-16 | OSM way/705065779 amenity=restaurant · addresstype=amenity · name “Warung Babi Guling Ibu Oka” · 2 Jalan Tegal Sari, Ubud, Bali 80571 · building=yes, opening_hours=Mo-Su 11:00-18:00 — overpass: HTTP 500 |
| Sate Khas Senayan | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Gudeg Yu Djum | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Restoran Pagi Sore | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Zubuchon | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Rico's Lechon | 10.32514, 123.91924 (low) | low | no-match | **reject**: no proposal | — | overpass: HTTP 500 |
| The Aristocrat Restaurant | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Manam Comfort Filipino | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Rangoon Tea House | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Cuisine Wat Damnak | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Romdeng — CLOSED | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Tamarind | UNVERIFIED | unverified | ambiguous | **reject**: no proposal | — | candidates disagree by 11427 m |
| Eng Seng Restaurant (Joo Chiat) — CLOSED | UNVERIFIED | unverified | shared-object | **reject**: low / shared OSM object | 1.31437, 103.90595 **low** · new pin · “Eng Seng Restaurant” · [osm-poi](https://www.openstreetmap.org/way/285163475) 2026-10-16 | OSM way/285163475 amenity=restaurant · addresstype=amenity · name “Eng Seng Restaurant” · Joo Chiat Place, Singapore, 423991 · building=yes, building:levels=1 — overpass: HTTP 500; shared object: OSM way/285163475 also matched Eng Seng Restaurant — CLOSED (Joo Chiat); graded low |
| Eng Seng Restaurant — CLOSED (Joo Chiat) | UNVERIFIED | unverified | shared-object | **reject**: low / shared OSM object | 1.31437, 103.90595 **low** · new pin · “Eng Seng Restaurant” · [osm-poi](https://www.openstreetmap.org/way/285163475) 2026-10-16 | OSM way/285163475 amenity=restaurant · addresstype=amenity · name “Eng Seng Restaurant” · Joo Chiat Place, Singapore, 423991 · building=yes, building:levels=1 — overpass: HTTP 500; shared object: OSM way/285163475 also matched Eng Seng Restaurant (Joo Chiat) — CLOSED; graded low |
| Rahmath Cheese Prata | 1.3344, 103.852 (low) | low | no-match | **reject**: no proposal | — | overpass: HTTP 500 |
| Hungry Wok | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Bun Bo Hue 14B | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Banh Xeo 46A | UNVERIFIED | unverified, status | pin | **hold**: OSM POI without an exact address match (house number true, street false) | 10.7896, 106.6913 **high** · new pin · “Bánh Xèo 46A” · [osm-poi](https://www.openstreetmap.org/node/3506699501) 2026-10-16 | OSM node/3506699501 amenity=restaurant · addresstype=amenity · name “Bánh Xèo 46A” · 46A Ðinh Công Tráng, Thành phố Hồ Chí Minh, 71008 — overpass: HTTP 500 |
| Bun Thit Nuong Chi Tuyen | UNVERIFIED | unverified, status | pin | **hold**: OSM POI without an exact address match (house number null, street true) | 10.76195, 106.69356 **high** · new pin · “Bún Thịt Nướng - Chị Tuyền” · [osm-poi](https://www.openstreetmap.org/node/6141692745) 2026-10-16 | OSM node/6141692745 amenity=restaurant · addresstype=amenity · name “Bún Thịt Nướng - Chị Tuyền” · Cô Giang, Thành phố Hồ Chí Minh, 71011 — overpass: HTTP 500 |
| Che Hien Khanh | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Bo Kho Ganh | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 10.76179, 106.673 **med** · new pin · “Bò kho gánh” · [osm-poi](https://www.openstreetmap.org/node/13396683121) 2026-10-16 | OSM node/13396683121 amenity=restaurant · addresstype=amenity · name “Bò kho gánh” · Sư Vạn Hạnh, Thành phố Hồ Chí Minh, 72522 — overpass: HTTP 500 |
| Com Tam Bai Rac | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Bun Rieu Ganh | UNVERIFIED | unverified, status | pin | **hold**: OSM POI without an exact address match (house number null, street true) | 10.77391, 106.69893 **high** · new pin · “Bún riêu ganh” · [osm-poi](https://www.openstreetmap.org/node/11491076669) 2026-10-16 | OSM node/11491076669 amenity=cafe · addresstype=amenity · name “Bún riêu ganh” · Lê Thánh Tôn, Thành phố Hồ Chí Minh, 71009 — overpass: HTTP 500 |
| Bo La Lot Co Lieng | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Huê Ký Mì Gia | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Hủ Tiếu Sa Tế Quảng Ký | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Ốc Đào | UNVERIFIED | unverified, status | ambiguous | **reject**: no proposal | — | candidates disagree by 88101 m |
| Bún Bò Huế Ngự Bình | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| TRE Dining | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| The Vintage Emporium | UNVERIFIED | unverified, status | ambiguous | **reject**: no proposal | — | candidates disagree by 4047 m |
| Every Half Coffee Roasters | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Là Việt Coffee | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Layla - Eatery & Bar | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| The Enigma Mansion | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Hudson Rooms | UNVERIFIED | unverified | no-match | **reject**: no proposal | — |  |
| Chè Kỳ Đồng | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Book Street (Duong Sach Nguyen Van Binh) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Ong Bon Pagoda (Nhi Phu Temple) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Ho Thi Ky Flower & Food Market | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Huyen Sy Church | UNVERIFIED | unverified, status | pin | **hold**: wikidata coordinate only (Wikipedia mirrors Wikidata): needs the address or an OSM / official / Census source | 10.75467, 106.41503 **high** · new pin · “Huyện Sỹ Church (St. Philip the Apostle)” · [wikidata](https://www.wikidata.org/wiki/Q10800886) 2026-10-16 | overpass: HTTP 500 |
| Tan Dinh Market | 10.79222, 106.69056 (med) | status | conflict | **hold**: conflict: 265 m from the current pin — look at both | 10.7899, 106.69 **high** · 265 m · “Tan Dinh Market” · [wikidata](https://www.wikidata.org/wiki/Q31994680) 2026-10-16 | overpass: HTTP 500 |
| Saigon River Park (Thu Thiem Riverfront) | 10.772908, 106.709389 (high) | status | no-match | **reject**: no proposal | — | overpass: HTTP 500 |
| FITO Museum (Traditional Vietnamese Medicine) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Hu Tieu Ty Lum | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Hủ Tiếu Sa Tế Tô Ký | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Dimsum Tiến Phát | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Cà Phê Ba Lù | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Phá Lấu Tám Ký (Tiều) | UNVERIFIED | unverified, status | pin | **pass**: OSM POI, name 1, house number + street match | 10.75287, 106.65769 **high** · new pin · “Tâm Ký Phá lấu” · [osm-poi](https://www.openstreetmap.org/node/13668396348) 2026-10-16 | OSM node/13668396348 amenity=restaurant · addresstype=amenity · name “Tâm Ký Phá lấu” · 823 Nguyễn Trãi, Thành phố Hồ Chí Minh, 72723 — overpass: HTTP 500 |
| Chè Tường Phong | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Khổ Qua Cà Ớt | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 10.7551, 106.67454 **med** · new pin · “Khổ qua cà ớt” · [osm-poi](https://www.openstreetmap.org/way/1529700704) 2026-10-16 | OSM way/1529700704 amenity=restaurant · addresstype=amenity · name “Khổ qua cà ớt” · 120 Đường Bùi Hữu Nghĩa, Thành phố Hồ Chí Minh, 72721 · building=yes — overpass: HTTP 500 |
| Va Thanh | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 10.75461, 106.67696 **med** · new pin · “Va Thành” · [osm-poi](https://www.openstreetmap.org/way/1525476289) 2026-10-16 | OSM way/1525476289 amenity=restaurant · addresstype=amenity · name “Va Thành” · 40 Huỳnh Mẫn Đạt, Thành phố Hồ Chí Minh, 72721 · building=yes — overpass: HTTP 500 |
| Bún Num Bò Chóc Tư Xê | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| An's Saigon | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 10.80611, 106.73226 **med** · new pin · “An's Saigon” · [osm-poi](https://www.openstreetmap.org/node/12958243459) 2026-10-16 | OSM node/12958243459 amenity=restaurant · addresstype=amenity · name “An's Saigon” · Tống Hữu Định, Thành phố Hồ Chí Minh, 71108 · website=https://www.anssaigon.com/, check_date=2025-06-24, opening_hours=11:00-14:30,17:30+ |
| Mi Lanh Yoo Chun | UNVERIFIED | unverified, status | pin | **hold**: OSM POI without an exact address match (house number null, street true) | 10.72827, 106.71013 **high** · new pin · “Mì lạnh Yoo Chun” · [osm-poi](https://www.openstreetmap.org/node/11348772196) 2026-10-16 | OSM node/11348772196 amenity=restaurant · addresstype=amenity · name “Mì lạnh Yoo Chun” · Nguyễn Văn Linh, Thành phố Hồ Chí Minh, 72912 |
| Lửa Wine Bar | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| XLIII Coffee (Thảo Điền) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| NOMU | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Mad House | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Mekong Merchant | UNVERIFIED | unverified, status | pin | **hold**: OSM POI without an exact address match (house number null, street true) | 10.80339, 106.73754 **high** · new pin · “Nhà Hàng Mekong Merchant Saigon” · [osm-poi](https://www.openstreetmap.org/node/9585983487) 2026-10-16 | OSM node/9585983487 craft=caterer · addresstype=craft · name “Nhà Hàng Mekong Merchant Saigon” · 23 Thảo Điền, Thành phố Hồ Chí Minh, 71108 · amenity=restaurant, website=https://mekongmerchant.com/, opening_hours=07:00-23:00 |
| Tía Tô | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| XÀO | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 10.8178, 106.6952 **med** · new pin · “Tiệm Bún Xào Chay Sa Đéc” · [osm-poi](https://www.openstreetmap.org/node/6649311085) 2026-10-16 | OSM node/6649311085 amenity=restaurant · addresstype=amenity · name “Tiệm Bún Xào Chay Sa Đéc” · 330 Đường Phan Văn Trị, Thành phố Hồ Chí Minh, 71400 |
| BAKES (Thảo Điền) | UNVERIFIED | unverified, status | pin | **hold**: OSM POI without an exact address match (house number null, street true) | 10.80385, 106.73767 **high** · new pin · “BAKES” · [osm-poi](https://www.openstreetmap.org/node/12958243465) 2026-10-16 | OSM node/12958243465 shop=bakery · addresstype=shop · name “BAKES” · 16 Thảo Điền, Thành phố Hồ Chí Minh, 71108 · website=https://bakes-saigon.com/en, opening_hours=07:30-22:00 open "level 0"; 07:30-17:30 open "level 1" |
| Gà Nướng Anh Tư (Chicken Corner) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Văn Thánh Market Street Food | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Phan Văn Hân Food Street | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Buu Long Tourist Area | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Cu Lao Pho & That Phu Ancient Temple (Ong Pagoda) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Chua Ba Thien Hau (Binh Duong) | UNVERIFIED | unverified, status | ambiguous | **reject**: no proposal | — | candidates disagree by 24522 m |
| Lai Thieu Fruit Orchards | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Vam Sat Ecotourism Area (Can Gio) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Ho May Park (Nui Lon) | UNVERIFIED | unverified, status | pin | **hold**: extended feature (street, district, park, island…): pin the entrance / most-visited point by hand | 10.35947, 107.06765 **med** · new pin · “Hồ Mây Park” · [osm-poi](https://www.openstreetmap.org/node/7403730668) 2026-10-16 | OSM node/7403730668 tourism=theme_park · addresstype=tourism · name “Hồ Mây Park” · Vi Ba, Thành phố Hồ Chí Minh, 78860 |
| Ninh Kieu Wharf | 10.027254, 105.769806 (high) | status | no-match | **reject**: no proposal | — |  |
| Banh Khot Goc Vu Sua | UNVERIFIED | unverified, status | pin | **pass**: OSM POI, name 0.9, house number + street match | 10.34011, 107.07885 **high** · new pin · “Gốc Vú Sữa” · [osm-poi](https://www.openstreetmap.org/way/259528282) 2026-10-16 | OSM way/259528282 amenity=restaurant · addresstype=amenity · name “Gốc Vú Sữa” · 14 Nguyễn Trường Tộ, Thành phố Hồ Chí Minh, 78207 · building=yes |
| Phu My Hung Korea Town | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Xom Luoi Seafood Market | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Banh Cong Dai Tam | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Vĩnh Khánh Food Street (Snail Street) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Chùa An Phú (Chùa Miểng Sành) | 10.745, 106.67583 (med) | status | conflict | **hold**: conflict: 814 m from the current pin — look at both | 10.74741, 106.6688 **med** · 814 m · “Chùa An Phú” · [osm-poi](https://www.openstreetmap.org/way/420287563) 2026-10-16 | OSM way/420287563 amenity=place_of_worship · addresstype=amenity · name “Chùa An Phú” · Hẻm 6 Đường Phạm Hùng, Thành phố Hồ Chí Minh, 73009 |
| Đình Bình Đông | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 10.72793, 106.64147 **med** · new pin · “Đình Bình Đông” · [osm-poi](https://www.openstreetmap.org/way/33103437) 2026-10-16 | OSM way/33103437 amenity=place_of_worship · addresstype=amenity · name “Đình Bình Đông” · Cầu Bình Đông, Thành phố Hồ Chí Minh, 72400 · building=yes |
| Bến Bình Đông & the Tết Flower Market | 10.72833, 106.63806 (med) | status | no-match | **reject**: no proposal | — |  |
| Chợ đầu mối Bình Điền | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 10.70277, 106.61032 **med** · new pin · “Chợ đầu mối Bình Điền” · [osm-poi](https://www.openstreetmap.org/way/489086379) 2026-10-16 | OSM way/489086379 amenity=marketplace · addresstype=amenity · name “Chợ đầu mối Bình Điền” · Đường D, Thành phố Hồ Chí Minh, 71959 · website=https://www.binhdienmarket.com.vn/ |
| Chùa Huệ Nghiêm | UNVERIFIED | unverified, status | ambiguous | **reject**: no proposal | — | candidates disagree by 14371 m |
| Chợ Xóm Củi | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 10.74595, 106.66077 **med** · new pin · “Chợ Xóm Củi” · [osm-poi](https://www.openstreetmap.org/way/366664396) 2026-10-16 | OSM way/366664396 amenity=marketplace · addresstype=amenity · name “Chợ Xóm Củi” · Hẻm 45 Phong Phú, Thành phố Hồ Chí Minh, 73009 · building=yes |
| Phù Châu Temple (Miếu Nổi) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Ngã Ba Giồng Martyrs Memorial | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Hủ Tiếu Bò Viên 153 Vĩnh Viễn | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Cà Phê Vợt Hẻm 330 Phan Đình Phùng | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Phan Xích Long Food Street | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Thiệu Ký Mì Gia | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Xôi Bát | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Phở Chào | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Chè Cô Có | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Perilla | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Ốc Thảo | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Ốc Vũ | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 10.76144, 106.70267 **med** · new pin · “Quán Ốc Vũ” · [osm-poi](https://www.openstreetmap.org/node/9584833474) 2026-10-16 | OSM node/9584833474 amenity=restaurant · addresstype=amenity · name “Quán Ốc Vũ” · Hẻm 237/42 Hoàng Diệu, Thành phố Hồ Chí Minh, 72822 |
| Hủ Tiếu Hồ Đỗ Khiêm (Đinh Hòa) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Bún Chua Cay Macao (Suan La Fen) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Chè Phục Linh | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Bánh Hẹ Lê Quang Sung (Khu Người Hoa) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Phen's Coffee | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Landing Coffee | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Mê Coffee (700 Teddy Bears) | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 10.82473, 106.69052 **med** · new pin · “Me Coffee” · [osm-poi](https://www.openstreetmap.org/way/1464116094) 2026-10-16 | OSM way/1464116094 amenity=cafe · addresstype=amenity · name “Me Coffee” · Hẻm 527 Phan Văn Trị, Thành phố Hồ Chí Minh, 71424 · building=yes |
| Baby African | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Hủ Tiếu Mì Gốc Hoa Ông Há (Phan Huy Ích) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Ma Thiên Lãnh Valley & Núi Đá Lake | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Long Hoa Market | 11.28639, 106.12944 (med) | status | no-match | **reject**: no proposal | — |  |
| Cu Chi Wildlife Rescue Station — CLOSED | UNVERIFIED | unverified, status | pin | **review**: closed place: a pin keeps its story on the map — the reviewer decides whether it gets one | 11.09272, 106.51371 **high** · new pin · “Cu Chi Wildlife Rescue Station” · [osm-poi](https://www.openstreetmap.org/node/4171823889) 2026-10-16 | OSM node/4171823889 tourism=attraction · addresstype=tourism · name “Cu Chi Wildlife Rescue Station” · Tỉnh lộ 15, Thành phố Hồ Chí Minh |
| Trung An Fruit Orchard | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Bạch Dinh (White Palace / Villa Blanche) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Front Beach (Bãi Trước) | 10.35083, 107.07 (med) | status | no-match | **reject**: no proposal | — |  |
| Thích Ca Phật Đài | UNVERIFIED | unverified, status | pin | **hold**: OSM POI without an exact address match (house number null, street true) | 10.37463, 107.07054 **high** · new pin · “Thích ca Phật Đài” · [osm-poi](https://www.openstreetmap.org/node/1276258153) 2026-10-16 | OSM node/1276258153 amenity=place_of_worship · addresstype=amenity · name “Thích ca Phật Đài” · Trần Phú, Thành phố Hồ Chí Minh, 76666 · tourism=attraction |
| Dinh Cô | UNVERIFIED | unverified, status | ambiguous | **reject**: no proposal | — | candidates disagree by 8862 m |
| Bình Châu Hot Springs (Suối khoáng nóng Bình Châu) | 10.56056, 107.5425 (med) | status | conflict | **hold**: conflict: 4889 m from the current pin — look at both | 10.6018, 107.558 **high** · 4889 m · “Binh Chau Hot Springs Resort” · [wikidata](https://www.wikidata.org/wiki/Q117325949) 2026-10-16 |  |
| Hồ Cốc Beach | UNVERIFIED | unverified, status | pin | **hold**: extended feature (street, district, park, island…): pin the entrance / most-visited point by hand | 10.50017, 107.4714 **med** · new pin · “Hương Phong Hồ Cốc Beach Resort” · [osm-poi](https://www.openstreetmap.org/node/12921201826) 2026-10-16 | OSM node/12921201826 tourism=hotel · addresstype=tourism · name “Hương Phong Hồ Cốc Beach Resort” · Đường ven biển Vũng Tàu - Bình Thuận, Thành phố Hồ Chí Minh · website=huongphonghococbeachresort.com |
| Hồ Tràm Beach | 10.48333, 107.43333 (med) | status | conflict | **hold**: conflict: 3977 m from the current pin — look at both | 10.47011, 107.39953 **high** · 3977 m · “Ho Tram Beach Resort And Spa” · [wikidata](https://www.wikidata.org/wiki/Q117325650) 2026-10-16 | extended feature: centroid vs entrance pin, but > 1.5 km apart |
| Khu Du Lịch Sinh Thái Bò Cạp Vàng | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Làng Nổi Tân Lập (Tân Lập Floating Village) | UNVERIFIED | unverified, status | ambiguous | **reject**: no proposal | — | candidates disagree by 383 m |
| Cồn Phụng & the Đạo Dừa Relic (Phoenix Islet) | 10.3332, 106.3551 (med) | status | no-match | **reject**: no proposal | — |  |
| Nhà Cổ Huỳnh Thủy Lê (Huỳnh Thủy Lê Ancient House) | UNVERIFIED | unverified, status | pin | **hold**: OSM POI without an exact address match (house number null, street true) | 10.29392, 105.7683 **high** · new pin · “Nhà cổ Huỳnh Thủy Lê” · [osm-poi](https://www.openstreetmap.org/node/5227610721) 2026-10-16 | OSM node/5227610721 tourism=attraction · addresstype=tourism · name “Nhà cổ Huỳnh Thủy Lê” · Nguyễn Huệ, Sa Đéc, Tỉnh Đồng Tháp 81800 |
| Làng Nghề Bột Sa Đéc (Sa Đéc Rice-Flour Village) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Làng Gạch Gốm Mang Thít (Mang Thít Brick & Pottery Kilns) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Nhà Cổ Bình Thủy (Bình Thủy Ancient House) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Chùa Ông Cần Thơ (Quảng Triệu Hội Quán) | UNVERIFIED | unverified, status | pin | **pass**: OSM POI, name 0.9, house number + street match | 10.03416, 105.78853 **high** · new pin · “Chùa Ông” · [osm-poi](https://www.openstreetmap.org/node/1924771927) 2026-10-16 | OSM node/1924771927 amenity=place_of_worship · addresstype=amenity · name “Chùa Ông” · 32 Hai Bà Trưng, Thành phố Cần Thơ, 94111 |
| Cồn Sơn (Con Son Island Community Tourism) | UNVERIFIED | unverified, status | pin | **hold**: wikidata coordinate only (Wikipedia mirrors Wikidata): needs the address or an OSM / official / Census source | 10.08472, 105.74972 **high** · new pin · “Cồn Sơn” · [wikidata](https://www.wikidata.org/wiki/Q31909511) 2026-10-16 |  |
| Bò Tơ Xuân Đào | UNVERIFIED | unverified, status | pin | **hold**: med: needs a second independent source within 50 m | 10.9666, 106.49312 **med** · new pin · “nhà hàng bò tơ xuân đào” · [osm-poi](https://www.openstreetmap.org/node/4464322495) 2026-10-16 | OSM node/4464322495 amenity=restaurant · addresstype=amenity · name “nhà hàng bò tơ xuân đào” · Nguyễn Văn Ơn, Thành phố Hồ Chí Minh, 75500 · opening_hours=Mo-Su 08:00-22:00 |
| Bánh Canh Trảng Bàng Út Huệ | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Bánh Canh Trảng Bàng Năm Dung | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Bánh Tráng Phơi Sương Trảng Bàng | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Cơm Chay Long Hoa (Tây Ninh Vegetarian) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Bánh Tráng Muối Tôm Tây Ninh | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Khoai Mì Củ Chi | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Ốc Núi Bà Đen | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Bánh Bông Lan Trứng Muối Gốc Cột Điện | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Lẩu Cá Đuối Hoàng Minh | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Gành Hào | UNVERIFIED | unverified, status | pin | **hold**: OSM POI without an exact address match (house number null, street true) | 10.36014, 107.06033 **high** · new pin · “Gành Hào” · [osm-poi](https://www.openstreetmap.org/node/5600351765) 2026-10-16 | OSM node/5600351765 amenity=restaurant · addresstype=amenity · name “Gành Hào” · Trần Phú, Thành phố Hồ Chí Minh, 78860 |
| Bánh Canh Long Hương | UNVERIFIED | unverified, status | pin | **hold**: OSM POI without an exact address match (house number null, street true) | 10.49992, 107.15832 **high** · new pin · “Bánh canh Long Hương” · [osm-poi](https://www.openstreetmap.org/way/254752636) 2026-10-16 | OSM way/254752636 amenity=restaurant · addresstype=amenity · name “Bánh canh Long Hương” · Cách Mạng Tháng Tám, Thành phố Hồ Chí Minh, 78116 · building=yes |
| Bánh Hỏi An Nhứt | UNVERIFIED | unverified, status | pin | **hold**: OSM POI without an exact address match (house number null, street true) | 10.48648, 107.24664 **high** · new pin · “Bánh hỏi An Nhứt” · [osm-poi](https://www.openstreetmap.org/way/740715576) 2026-10-16 | OSM way/740715576 amenity=restaurant · addresstype=amenity · name “Bánh hỏi An Nhứt” · Quốc lộ 55, Thành phố Hồ Chí Minh · building=yes |
| Sữa Bò Long Thành (Lothamilk) | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Hủ Tiếu 44 | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Hủ Tiếu Cá Thảo | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Hủ Tiếu Bà Sẩm | UNVERIFIED | unverified, status | no-match | **reject**: no proposal | — |  |
| Kẹo Dừa Bến Tre (Thanh Long) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bánh Cống Cô Út | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nem Nướng Thanh Vân | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bánh Tét Lá Cẩm Nhà Họ Huỳnh | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Galerie Quynh | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Salon Saigon | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Craig Thomas Gallery | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| San Art | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| MoT+++ | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| The Factory Contemporary Arts Centre | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ao Dai Museum (Bao Tang Ao Dai) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Phap Hoa Pagoda | 10.7825, 106.67917 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Phung Son Pagoda (Chua Go) | 10.75528, 106.64833 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Giac Vien Pagoda | UNVERIFIED | unverified, status | pin | **hold**: wikidata coordinate only (Wikipedia mirrors Wikidata): needs the address or an OSM / official / Census source | 10.76302, 106.63924 **high** · new pin · “Giác Viên Pagoda” · [wikidata](https://www.wikidata.org/wiki/Q10748412) 2026-10-16 |  |
| Cho Quan Church | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| September 23 Park (Cong Vien 23 Thang 9) | 10.7694, 106.6938 (high) | status | confirm | **no-change**: confirms the current high pin (0 m); nothing to review | 10.7694, 106.6938 **high** · 0 m · “September 23 Park” · [wikidata](https://www.wikidata.org/wiki/Q10752046) 2026-10-16 |  |
| Le Van Tam Park | 10.78861, 106.69372 (high) | status | confirm | **no-change**: confirms the current high pin (1 m); nothing to review | 10.78861, 106.69372 **high** · 1 m · “Le Van Tam Park” · [wikidata](https://www.wikidata.org/wiki/Q10752054) 2026-10-16 |  |
| Bach Dang Wharf & Saigon Waterbus | 10.777385, 106.707055 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ba Chieu Market | UNVERIFIED | unverified, status | pin | **hold**: wikidata coordinate only (Wikipedia mirrors Wikidata): needs the address or an OSM / official / Census source | 10.80139, 106.69889 **high** · new pin · “Ba Chieu Market” · [wikidata](https://www.wikidata.org/wiki/Q11839857) 2026-10-16 |  |
| A O Show | 10.7767, 106.70322 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Golden Dragon Water Puppet Theatre | 10.7762, 106.6923 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Le Cong Kieu Antique Street | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| An Dong Market | UNVERIFIED | unverified, status | pin | **hold**: wikidata coordinate only (Wikipedia mirrors Wikidata): needs the address or an OSM / official / Census source | 10.7581, 106.67218 **high** · new pin · “An Dong Market” · [wikidata](https://www.wikidata.org/wiki/Q32032749) 2026-10-16 |  |
| Ton That Dam Old Market (Cho Cu) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hai Thuong Lan Ong Traditional Medicine Street | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| 14 Ton That Dam Apartment | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Little Japan (Le Thanh Ton) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sri Thendayuthapani Temple (Chua Ong) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Jeanne d'Arc Church (Nga Sau) | UNVERIFIED | unverified, status | pin | **hold**: wikidata coordinate only (Wikipedia mirrors Wikidata): needs the address or an OSM / official / Census source | 10.75694, 106.66719 **high** · new pin · “Jeanne d'Arc Church” · [wikidata](https://www.wikidata.org/wiki/Q10800896) 2026-10-16 |  |
| Hotel Continental Saigon | 10.7769, 106.7025 (high) | status | confirm | **no-change**: confirms the current high pin (5 m); nothing to review | 10.77694, 106.7025 **high** · 5 m · “Hotel Continental Saigon” · [wikidata](https://www.wikidata.org/wiki/Q5911405) 2026-10-16 |  |
| Hotel Majestic Saigon | 10.7731, 106.7061 (high) | status | confirm | **no-change**: confirms the current high pin (5 m); nothing to review | 10.77306, 106.70611 **high** · 5 m · “Hotel Majestic” · [wikidata](https://www.wikidata.org/wiki/Q3063149) 2026-10-16 | robots.txt unreachable (CERT_HAS_EXPIRED); official site skipped (RFC 9309: assume disallow on server error) |
| Rex Hotel Rooftop Garden Bar | 10.77583, 106.7015 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Saigon Centre & Takashimaya | 10.77306, 106.70083 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Dam Sen Cultural Park | 10.765556, 106.638111 (high) | status | confirm | **no-change**: confirms the current high pin (62 m); nothing to review | 10.76611, 106.63806 **high** · 62 m · “Dam Sen Cultural Park” · [wikidata](https://www.wikidata.org/wiki/Q2056423) 2026-10-16 | extended feature: 62 m between centroid and the pinned entrance/point is expected; no move proposed |
| Sax n Art Jazz Club | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nhau Nhau | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Firkin Bar | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Rabbit Hole | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Telephone Bar | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| The Alley Cocktail Bar & Kitchen | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| The Gin House | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| 2 Lam Son | 10.776461, 106.703032 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| PK Maltroom | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| NOB Natural Wine Bar | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| MAD Wine Bar & Eatery | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chill Skybar | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Social Club Rooftop Bar | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Saigon Saigon Bar | 10.776062, 106.703631 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Pasteur Street Brewing (Original Taproom) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Heart of Darkness Craft Brewery | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| East West Brewing Co. | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| BiaCraft Artisan Ales | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Winking Seal Beer Co. | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Rooster Beers | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Te Te TapHouse | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Lacaph | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| The Hummingbird Cafe & Roastery | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| BEL by Building Coffee | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Cháo Lòng Bà Út | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bánh Mì Cụ Lý | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kem Vi Bổn | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bánh Canh Cua 194 Võ Văn Tần | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bún Thang 50 | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Cháo Lòng Đặng Thanh Mai | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bánh Mì Tăng | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bánh Cuốn Hải Nam | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Cơm Tấm Thuận Kiều | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bún Bò Dồi Chiên Cô Minh | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Súp Cua Cô Bông | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bún Riêu Cua Ốc Thanh Hải | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Gỏi Khô Bò Công Viên Lê Văn Tám | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bánh Mì Bảy Quang | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hủ Tiếu Cá Nam Lợi | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Xôi Gà Bà Chiểu | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bún Mọc Thanh Mai | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Cháo Lòng Cô Ba | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Mì Vịt Tiềm Quảng Huê Viên | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Cơm Tấm Cô Phượng | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Akuna | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Long Trieu (The Royal Pavilion) | 10.773911, 106.704769 (med) | status | confirm | **hold**: the record names a part (“The Royal Pavilion”) but the match is the whole (“Saigon Times Square”) | 10.77391, 106.70477 **high** · 0 m · “Saigon Times Square” · [wikidata](https://www.wikidata.org/wiki/Q6352680) 2026-10-16 | upgrade confidence med → high |
| CieL | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Coco Dining | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Vietnam House | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hoa Tuc | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Quince Saigon | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| The Albion by Kirk Westaway | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hoi An Sense | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| ST25 by KOTO | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Madame Lam | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nephele | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| NÔM | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sóno | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chị Mơ | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Tales by Chapter | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hum Garden | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Du Yên | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Okra FoodBar | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Apero | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Propaganda Bistro | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Quán Ăn Ngự Bình | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bà Cô Lốc Cốc | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Banh Canh Cua Ba Ba | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bún Riêu Yến | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Mặn Mòi | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sol Kitchen & Bar | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Đảo Thạnh An (Thanh An Island) | 10.47, 106.975 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chùa Hoằng Pháp (Hoang Phap Temple) | 10.9003, 106.5818 (high) | status | confirm | **no-change**: confirms the current high pin (0 m); nothing to review | 10.9003, 106.5818 **high** · 0 m · “Hoằng Pháp Temple” · [wikidata](https://www.wikidata.org/wiki/Q4356187) 2026-10-16 |  |
| Chùa núi Châu Thới (Chau Thoi Mountain Temple) | 10.914927, 106.804527 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chùa Hội Khánh (Hoi Khanh Temple) | 10.98103, 106.65964 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Phố lồng đèn Lương Nhữ Học (Lantern Street) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Cầu Ba Son (Thu Thiem 2 Bridge) | 10.77955, 106.71017 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Cầu Mống (Mong Bridge) | 10.768, 106.7037 (high) | status | confirm | **no-change**: confirms the current high pin (0 m); nothing to review | 10.768, 106.7037 **high** · 0 m · “Mong Bridge” · [wikidata](https://www.wikidata.org/wiki/Q16481264) 2026-10-16 |  |
| Chùa Nam Thiên Nhất Trụ (One Pillar Pagoda of the South) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Vườn quốc gia Cát Tiên (Cat Tien National Park) | 11.5, 107.333 (high) | status | conflict | **hold**: conflict: 26085 m from the current pin — look at both | 11.34722, 107.15139 **high** · 26085 m · “Cát Tiên National Park” · [wikidata](https://www.wikidata.org/wiki/Q1421202) 2026-10-16 |  |
| Đền thờ Trần Hưng Đạo (Tran Hung Dao Temple) | 10.79106, 106.69441 (high) | status | confirm | **no-change**: confirms the current high pin (1 m); nothing to review | 10.79107, 106.69441 **high** · 1 m · “Tran Hung Dao Temple” · [wikidata](https://www.wikidata.org/wiki/Q10841726) 2026-10-16 |  |
| Chùa Vạn Đức (Van Duc Temple) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Tu viện Khánh An (Khanh An Monastery) | 10.855, 106.69389 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nhà thờ Hạnh Thông Tây (Hanh Thong Tay Church) | 10.82028, 106.68333 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Công viên Lê Thị Riêng (Le Thi Rieng Park) | 10.7851, 106.6644 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bảo tàng Chiến dịch Hồ Chí Minh (Ho Chi Minh Campaign Museum) | 10.780915, 106.699078 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Công viên Gia Định (Gia Dinh Park) | 10.80167, 106.6775 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bảo tàng Biệt động Sài Gòn - Gia Định (Saigon Special Forces Museum) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hầm vũ khí bí mật Biệt động Sài Gòn (Secret Weapons Bunker) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bảo tàng Lực lượng vũ trang miền Đông Nam Bộ (Southeast Armed Forces Museum) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Làng sơn mài Tương Bình Hiệp (Tuong Binh Hiep Lacquer Village) | 11.00778, 106.63028 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Làng bưởi Tân Triều (Tan Trieu Pomelo Village) | 10.97028, 106.84417 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chợ Kim Biên (Kim Bien Market) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Tuyến Metro số 1 Bến Thành - Suối Tiên (Metro Line 1) | 10.7708, 106.6978 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Cột cờ Thủ Ngữ (Thu Ngu Flagpole) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chợ Bà Hoa (Ba Hoa Market) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chung cư 26 Lý Tự Trọng (Ly Tu Trong Apartment) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Núi Chứa Chan & Chùa Gia Lào (Chua Chan Mountain) | 10.9417, 107.3792 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chợ Thiếc (Thiec Market) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nhà thờ Đa Minh - Ba Chuông (Ba Chuong Church) | 10.79333, 106.67333 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chùa Bà Hải Nam - Hội quán Quỳnh Phủ (Quynh Phu Assembly Hall) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Đình Minh Hương Gia Thạnh (Minh Huong Gia Thanh Communal House) | 10.755, 106.6603 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Đền thờ Vua Hùng (Hung Kings Temple, Thao Cam Vien) | 10.7872, 106.7057 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Lăng Ông Thủy Tướng Cần Giờ (Whale Lord Shrine) | 10.42, 106.94444 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nhà cổ Vương Hồng Sển - Vân Đường phủ (Vuong Hong Sen Ancient House) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Cà Phê Vợt Chú Thanh | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Trên Tầng Thượng | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Anh Coffee Roastery | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sài Gòn Givral | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Japanit Matcha & Coffee House | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Rogue Saigon | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| CLAY - Cocktails & Cuisine | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Shri Lifestyle Dining | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kem Bạch Đằng | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kem Bố Già | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chè Mâm Khánh Vy (Chè Năm Trăm) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chè Đèn Dầu | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Trà Sữa Hoa Hướng Dương | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bánh Pía Triều Châu Triệu Minh Hiệp | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nước Sâm Bà Bình | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Trà Sâm Vạn Tế Đường | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Pho 29 Doan Van Bo | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Banh Mi Nhu Lan | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Pha Lau Di Phuong | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sup Cua Nha Tho Duc Ba | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chao Tieu Cho Ban Co | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Banh Canh Cua Ngo Duc Ke | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Com Tam Ba Rom | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sup Cua Co Lan | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Mi Vit Tiem Thiem Huy | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Xoi Tam Cau | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Banh Cuon La Chuoi Hai Tan | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chao Vit Thanh Da Goc Nha La | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bun Mam Phan Boi Chau | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Che Chanh Nguyen Phi Khanh | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Com Ga Dong Nguyen | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bun Thit Nuong Ba Them | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bun Bo Lau Bo Giao Toan | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Com Tam Kieu Giang | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hu Tieu Mi Suon 105 Lo Sieu | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Oc To | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hot Vit Lon Co Van | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chao Trang Hang Xanh | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Mi Quang Sam | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Banh Flan Thanh Thuy | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Quan Hue Thuan An | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Pha Lau Co Oanh | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Pha Lau Di Nui | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bun Bo O Tam (Viet Kieu) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Banh Mi Ba Tau (bo la lot) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ca Ri De Bay Hong | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ca Ri Ga Cho Xa Tay | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bun Bo Ut Hung | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Banh Beo Co Anh Cho Ben Thanh | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chao Long 144 Phan Dang Luu | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bun Rieu Oc Nguyen Canh Chan | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Tòa án Nhân dân TP.HCM (Palais de Justice) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Trụ sở Ngân hàng Nhà nước - Chi nhánh TP.HCM (Banque de l'Indochine) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Trụ sở Cục Hải quan TP.HCM (Hôtel des Douanes) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Dinh Thượng Thơ (Office of the Interior) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Khách sạn Grand Sài Gòn (Hotel Grand Saigon) | 10.773861, 106.705639 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Trường THPT chuyên Lê Hồng Phong (Lycée Petrus Ký) | 10.763889, 106.681667 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Trường THPT Nguyễn Thị Minh Khai (Trường Áo Tím / Gia Long) | 10.778889, 106.686944 (high) | status | confirm | **no-change**: confirms the current high pin (0 m); nothing to review | 10.77889, 106.68694 **high** · 0 m · “Nguyen Thi Minh Khai High School” · [wikidata](https://www.wikidata.org/wiki/Q7022973) 2026-10-16 |  |
| Trường THPT Marie Curie | 10.7824, 106.6908 (high) | status | confirm | **no-change**: confirms the current high pin (0 m); nothing to review | 10.7824, 106.6908 **high** · 0 m · “Marie Curie High School” · [wikidata](https://www.wikidata.org/wiki/Q656313) 2026-10-16 | robots.txt disallows / for CleoGuideLocationVerify; skipped |
| Cầu Phú Mỹ (Phu My Bridge) | 10.7449917, 106.7444556 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hầm Thủ Thiêm / Đường hầm sông Sài Gòn (Saigon River Tunnel) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kênh Nhiêu Lộc - Thị Nghè (Nhieu Loc Canal) | 10.795531, 106.689111 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bảo tàng Nghệ thuật Quang San (Quang San Art Museum) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bảo tàng Địa chất TP.HCM (Geological Museum) | 10.78484, 106.70759 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bảo tàng Không quân phía Nam (Southern Air Force Museum) | 10.805, 106.66111 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Đình Thông Tây Hội (Thong Tay Hoi Communal House) | 10.83778, 106.65639 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Đình Phú Nhuận (Phu Nhuan Communal House) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chùa Ấn Quang (Tổ đình Ấn Quang) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chùa Vạn Phật (Van Phat Temple, 10,000 Buddhas) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chùa Chantarangsay (Candaransi, Khmer Temple) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chùa Pothiwong (Khmer Temple) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chùa Nghệ Sĩ (Artists' Temple & Cemetery) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nhà thờ & Tu viện Dòng Mến Thánh Giá Thủ Thiêm | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Địa đạo Phú Thọ Hòa (Phu Tho Hoa Tunnels) | 10.78528, 106.62861 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Khu lưu niệm cụ Phan Châu Trinh (Phan Chau Trinh Memorial) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Khu di tích Láng Le - Bàu Cò | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bát Bửu Phật Đài (Chùa Phật Cô Đơn / Chùa Thanh Tâm) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Văn miếu Trấn Biên (Tran Bien Temple of Literature) | 10.9648, 106.8015 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Thác Giang Điền (Giang Dien Waterfall) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Núi Dinh (Dinh Mountain) | 10.53887, 107.12953 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Đình thần Thắng Tam (Thang Tam Shrine complex) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Khu di tích Căn cứ Trung ương Cục miền Nam | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nhà tù Côn Đảo & Nghĩa trang Hàng Dương | 8.6889, 106.6148 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Phở Bò Phú Gia | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bếp Người Hội An | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Quán Thúy 94 Cũ (Miến Cua 94) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bánh mì Như Lan | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Miên Saigon | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| ORYZ Saigon | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Little Bear | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Mía Dining | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| LUNE (Lüne) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kong Meng San Phor Kark See Monastery | 1.3614, 103.836 (high) | status | confirm | **no-change**: confirms the current high pin (4 m); nothing to review | 1.36144, 103.836 **high** · 4 m · “Kong Meng San Phor Kark See Monastery” · [wikidata](https://www.wikidata.org/wiki/Q2890360) 2026-10-16 |  |
| HSBC TreeTop Walk | 1.3608847, 103.8091766 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| MacRitchie Reservoir Park | 1.34361, 103.83111 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bishan Public Library | 1.3498333, 103.848877 (high) | status | confirm | **no-change**: confirms the current high pin (14 m); nothing to review | 1.34984, 103.849 **high** · 14 m · “Bishan Public Library” · [wikidata](https://www.wikidata.org/wiki/Q4917325) 2026-10-16 |  |
| Kwong Wai Siew Peck San Theng | 1.345723, 103.84337 (med) | status | move | **hold**: wikidata coordinate only (Wikipedia mirrors Wikidata): needs the address or an OSM / official / Census source | 1.3459, 103.8428 **high** · 66 m · “Kwong Wai Siew Peck San Theng” · [wikidata](https://www.wikidata.org/wiki/Q6450554) 2026-10-16 |  |
| Central Catchment Nature Reserve | 1.367, 103.8 (med) | status | confirm | **hold**: wikidata coordinate has 2 decimals (≈ 1 km coarse) — needs a precise source | 1.36667, 103.8 **high** · 37 m · “Central Catchment Nature Reserve” · [wikidata](https://www.wikidata.org/wiki/Q5060520) 2026-10-16 | extended feature: 37 m between centroid and the pinned entrance/point is expected; no move proposed |
| Junction 8 | 1.3506444, 103.848775 (high) | status | confirm | **no-change**: confirms the current high pin (0 m); nothing to review | 1.35064, 103.84878 **high** · 0 m · “Junction 8” · [wikidata](https://www.wikidata.org/wiki/Q6311694) 2026-10-16 | overpass: HTTP 500 |
| Bishan ActiveSG Stadium & Sports Centre | 1.3545444, 103.851475 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Old Upper Thomson Road (former Grand Prix circuit) | 1.3832, 103.8191056 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Tse Tho Aum Temple | 1.361957582, 103.838193892 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ming Kee Chicken Rice | 1.34923139, 103.849896613 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Rong Cheng (Sin Ming Road) Bak Kut Teh | 1.3572844, 103.8393967 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Mei Zhen Hakka Delicacies | 1.3518942, 103.8373039 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sin Kian Heng | 1.3572844, 103.8393967 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Shi Xiang Ge | 1.35028, 103.84972 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yang Ming Seafood | 1.3445507, 103.8556173 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Leong Hainanese Chicken Rice | 1.3518942, 103.8373039 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Lai Heng Fried Kuay Teow | 1.3518942, 103.8373039 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| 284 Kway Chap | 1.35886666, 103.844150538 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ding Ji Mushroom Minced Meat Noodle | 1.35886666, 103.844150538 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chocolat N' Spice | 1.3518942, 103.8373039 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Wak Limah | 1.3518942, 103.8373039 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Quan Ann Prawn Mee | 1.3518942, 103.8373039 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Marsiling Teochew Fish Soup | 1.3518942, 103.8373039 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Heng Heng Bao Bing | 1.3518942, 103.8373039 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kam's Roast (Junction 8) | 1.3506444, 103.848775 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Jai Thai | 1.3501667, 103.8431015 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Uncle Penyet (Bishan) | 1.34923139, 103.849896613 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chindamani Indian Restaurant | 1.35886666, 103.844150538 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Dong Nan Wanton Noodle | 1.3518942, 103.8373039 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Jiak Mee | 1.35011694, 103.84976318 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sen Yen Charcoal Traditional Toast | 1.3553878, 103.836408 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hup Seng Duck Rice | 1.3572844, 103.8393967 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Two Chefs Eating Place (Sin Ming) | 1.362123, 103.834984 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Mata Thai Restaurant | 1.34864375, 103.849314445 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Taste of Thailand | 1.35811, 103.83393 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Mr Egg Fried Rice | 1.34507321, 103.855542321 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kings Cart Coffee (Bishan Library) | 1.3498333, 103.848877 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Thus Coffee | 1.3726757, 103.8295321 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Grin Affair | 1.3489143, 103.848662285 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Canopy Garden Dining — CLOSED | 1.3625, 103.8475 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Denzy Gelato (Bishan) — CLOSED | 1.3492165, 103.8491735 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yue Lai Xiang Delights | 1.3572844, 103.8393967 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Potong Pasir Sloping-Roof HDB (Blk 101-142) | 1.3328, 103.8672 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bidadari Park & Alkaff Lake | 1.339833, 103.873333 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Alkaff Upper Serangoon Mosque | 1.3330372, 103.8704843 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| St Andrew's Village | 1.330635, 103.865946 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Lorong Koo Chye Sheng Hong Temple | 1.32627, 103.89192 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sri Manmatha Karuneshvarar Temple | 1.3089333, 103.8659361 (high) | status | confirm | **no-change**: confirms the current high pin (7 m); nothing to review | 1.30893, 103.866 **high** · 7 m · “Sri Manmatha Karuneshvarar Temple” · [wikidata](https://www.wikidata.org/wiki/Q7586158) 2026-10-16 | overpass: HTTP 500 |
| Sennett Estate | 1.3317451, 103.874219 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bidadari Cemetery Heritage & Memorial Garden | 1.335425, 103.8720028 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| The Woodleigh Mall & Woodleigh Village | 1.3379161, 103.8723492 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kallang River & Bidadari Park Connector | 1.33, 103.87 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| MacPherson Estate & MacPherson Road Heritage | 1.33, 103.886 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Potong Pasir Town & Block 142 Landmark | 1.3332041, 103.8669926 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Istana Bidadari (former royal palace site) | 1.3355, 103.872 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sri Siva Durga Temple | 1.331778, 103.8668528 (high) | status | confirm | **no-change**: confirms the current high pin (16 m); nothing to review | 1.33178, 103.867 **high** · 16 m · “Sri Siva Durga Temple” · [wikidata](https://www.wikidata.org/wiki/Q7586273) 2026-10-16 | overpass: HTTP 500 |
| Alkaff Gardens (former Japanese-style lake garden) | 1.334167, 103.873972 (high) | status | confirm + status-needs-check | **no-change**: confirms the current high pin (0 m); nothing to review | 1.33417, 103.87397 **high** · 0 m · “Alkaff Gardens” · [wikidata](https://www.wikidata.org/wiki/Q60761293) 2026-10-16 | **needs-check (possible closure)**: dissolved/abolished/demolished 1964 ([src](https://www.wikidata.org/wiki/Q60761293)) — overpass: HTTP 500 |
| The Fishball Story | 1.328593, 103.885378 (high) | status | confirm | **no-change**: confirms the current high pin (0 m); nothing to review | 1.32859, 103.88538 **high** · 0 m · “The Fishball Story” · [wikidata](https://www.wikidata.org/wiki/Q111941839) 2026-10-16 | overpass: HTTP 500 |
| Old Fisherman (老渔翁) | 1.32658, 103.88505 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Tian Seng Fried Prawn Mee | 1.32658, 103.88505 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Victor Veggie (Victor's Vegetarian Food) | 1.32658, 103.88505 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Dancing Char Kway Teow | 1.32658, 103.88505 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Julaiha Muslim Restaurant | 1.3324, 103.8847 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nan Xing Claypot Rice | 1.32658, 103.88505 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Briyani by Hamidah Bi | 1.32658, 103.88505 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ghim Guan Fried Oyster | 1.32658, 103.88505 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| River South (Hoe Nam) Prawn Noodle | 1.328867, 103.869785 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Macpherson Minced Meat Noodle | 1.3290324, 103.8696278 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Taste of Home (家乡味) | 1.33627, 103.88651 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kizuna | 1.3355, 103.864 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Rise Bakehouse (Potong Pasir) | 1.3315158, 103.8683822 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Style Palate | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ming Chung White Lor Mee | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Eng Kee Chicken Wings | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Origanics | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ji Hui Lai Nasi Kerabu | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Fat Fat Food (發發福) | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Pura Vida Cocina | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hongkong Egglet Ice Cream | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Olla Specialty Coffee | 1.3379161, 103.8723492 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Surrey Hills Grocer (The Woodleigh Mall) | 1.3379161, 103.8723492 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| No.10 Noodle House | 1.3278701, 103.887077 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yong Lai Fa Ji Shu Shi | 1.32658, 103.88505 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Omar's Halal Thai Beef Noodles | 1.32658, 103.88505 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Soon Lee Lor Mee | 1.32658, 103.88505 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hup Hup Mee Siam・Laksa・Lor Mee | 1.3278701, 103.887077 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Three Treasures Roast Duck | 1.32658, 103.88505 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Folk Yard | 1.3315158, 103.8683822 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yuan Wei Seafood | 1.3318564, 103.8853736 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yi Jia South Village Seafood Restaurant | 1.332477, 103.8848194 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Liu Kou Shui | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kallang Wantan Mee | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| M+ Fried Rice Paradise | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Whampoa Nan Xiang Chicken Rice | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Liu Da Xia | 1.3397064, 103.8724607 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Fullybooked | 1.3290324, 103.8696278 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sweet Cheeks Gelato | 1.3290324, 103.8696278 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ling's Patisseries | 1.3354498, 103.8635182 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| No Monkey Business | 1.3290324, 103.8696278 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| EVERY | 1.3315158, 103.8683822 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Beans.Factory | 1.3379161, 103.8723492 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bishan-Ang Mo Kio Park | 1.367, 103.833 (med) | status | confirm | **hold**: wikidata coordinate has 2 decimals (≈ 1 km coarse) — needs a precise source | 1.36667, 103.83333 **high** · 52 m · “Bishan-Ang Mo Kio Park” · [wikidata](https://www.wikidata.org/wiki/Q866299) 2026-10-16 | extended feature: 52 m between centroid and the pinned entrance/point is expected; no move proposed; overpass: HTTP 500 |
| Kebun Baru Birdsinging Club | 1.374026, 103.840563 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ang Mo Kio Town Garden West | 1.3743688, 103.8434332 (high) | status | confirm | **no-change**: confirms the current high pin (0 m); nothing to review | 1.37437, 103.84343 **high** · 0 m · “Ang Mo Kio Town Garden West” · [wikidata](https://www.wikidata.org/wiki/Q4761854) 2026-10-16 | overpass: HTTP 500 |
| Ang Mo Kio Town Garden East | 1.3695, 103.85 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Windsor Nature Park | 1.35889, 103.82823 (high) | status | confirm | **no-change**: confirms the current high pin (655 m); nothing to review | 1.3575, 103.8225 **high** · 655 m · “Windsor Nature Park” · [wikidata](https://www.wikidata.org/wiki/Q98597001) 2026-10-16 | extended feature: 655 m between centroid and the pinned entrance/point is expected; no move proposed; overpass: HTTP 500 |
| MacRitchie TreeTop Walk | 1.3610473, 103.8113955 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Lower Peirce Reservoir Park | 1.3712, 103.8244 (high) | status | confirm | **no-change**: confirms the current high pin (0 m); nothing to review | 1.3712, 103.8244 **high** · 0 m · “Lower Peirce Reservoir Park” · [wikidata](https://www.wikidata.org/wiki/Q28404017) 2026-10-16 | overpass: HTTP 500 |
| Thomson Nature Park | 1.386471, 103.821074 (high) | status | confirm | **no-change**: confirms the current high pin (0 m); nothing to review | 1.38647, 103.82107 **high** · 0 m · “Thomson Nature Park” · [wikidata](https://www.wikidata.org/wiki/Q65117977) 2026-10-16 | overpass: HTTP 500 |
| Ang Mo Kio Heritage Trail | 1.3696, 103.8485 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Church of Christ the King | 1.3619, 103.85241 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Block 259, the 'Clover Block' | 1.368643099, 103.831544286 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chu Sheng Temple | 1.381016408, 103.841523032 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Masjid Al-Muttaqin | 1.370394, 103.8459948 (high) | status | confirm | **no-change**: confirms the current high pin (11 m); nothing to review | 1.37049, 103.846 **high** · 11 m · “Masjid Al-Muttaqin” · [wikidata](https://www.wikidata.org/wiki/Q6783332) 2026-10-16 |  |
| Ang Mo Kio Dragon Playground | 1.369821, 103.85525 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ang Mo Kio Joint Temple | 1.36633, 103.83885 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Liuxun Sanhemiao | 1.385907, 103.8482596 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Swee Kow Kuan | 1.38094, 103.84148 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Old Upper Thomson Road (Thomson Road Grand Prix Circuit) | 1.3832, 103.8191056 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Teachers' Housing Estate | 1.37977, 103.82919 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sembawang Hills Estate | 1.37272677232, 103.828167109 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ang Mo Kio Fried Kway Teow | 1.372185, 103.846562 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yunos N Family | 1.372185, 103.846562 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Malaysian Hup Kee Fishball Noodle | 1.374852, 103.838921 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ho Bee Roasted Food | 1.380991, 103.840627 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Mellben Seafood | 1.368627, 103.83703 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sin Ming Roti Prata | 1.355318, 103.83668 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Thasevi Food (Famous Jalan Kayu Prata) | 1.396143, 103.872862 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Rahim Muslim Food | 1.3681603, 103.8565177 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ho Ji Fried Hokkien Mee | 1.3741076, 103.8388639 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Song Heng Fishball Minced Meat Noodle | 1.380991, 103.840627 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Imperial Fish Soup | 1.380991, 103.840627 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ah Jie Hokkien Mee | 1.372384868, 103.847890146 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kam Jia Zhuang Seafood | 1.36844644010937, 103.844516260527 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kian Seng Seafood Restaurant | 1.359672, 103.856341 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| No Horse Run Cafe | 1.36844644010937, 103.844516260527 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Eng Kee Bak Kut Teh | 1.3640365, 103.8480712 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ann Hoo Teochew Porridge | 1.37277209302753, 103.854457955288 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Top 73+1 Fishball Legacy | 1.37387, 103.85453 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Centre Satay Bee Hoon | 1.372185, 103.846562 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Huang Fu Duck Rice | 1.36718, 103.84002 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Jing Ji Fishball Noodle | 1.3723618, 103.8290076 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Seng Bee Hainanese Chicken Rice | 1.372185, 103.846562 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sumo Fried Hokkien Prawn Mee | 1.380991, 103.840627 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ang Mo Kio Loh Mee Laksa | 1.3681603, 103.8565177 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Cai Ji Fried Fish Soup | 1.3681603, 103.8565177 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sin Kee Chicken Rice | 1.3681603, 103.8565177 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yong Xin | 1.3681603, 103.8565177 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hock Kee Wanton Noodle | 1.36718, 103.84002 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Foo Hing Handmade Fishball & Meatball Noodle | 1.36718, 103.84002 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kuai San Dian Xin | 1.371367, 103.857001 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Fresh Fish Seafood Soup | 1.3723618, 103.8290076 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Plum Village | 1.371784, 103.829188 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Xi Xiang Feng Yong Tau Foo | 1.372185, 103.846562 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Han Jiang Fish Soup | 1.36265410749321, 103.855288297631 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Twenty Grammes | 1.37234358233883, 103.855455428073 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Casuarina Curry | 1.377191, 103.82806 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Song Kee Fishball Noodle | 1.37277209302753, 103.854457955288 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Soi 19 Thai Wanton Mee | 1.376763, 103.840874 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Grub — CLOSED | 1.36524685, 103.836371986196 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Crunch & Cups | 1.36891617080101, 103.834499516963 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Rasa Sayang Western Food | 1.36733858334, 103.848576335 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| 3 Sisters Prawn Noodle | 1.3741076, 103.8388639 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Mun Fu Chicken Rice | 1.37277209302753, 103.854457955288 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Seletar Sheng Mian & Mian Fen Guo | 1.36718, 103.84002 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Belinda's Pancake | 1.3640365, 103.8480712 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sin Hoe Huat Cafe | 1.3723618, 103.8290076 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hong Heng Beef Noodle Soup & Laksa | 1.36718, 103.84002 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| F.I.C | 1.37257962452704, 103.836220813247 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ang Mo Kio 453 Wanton Mee | 1.3741076, 103.8388639 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nagara Thai | 1.37234358233883, 103.855455428073 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Brew & Co | 1.37147783065, 103.845868751 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hup Hup Minced Meat Noodle | 1.372185, 103.846562 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Eng Ho Fried Hokkien Prawn Mee | 1.36265410749321, 103.855288297631 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Zhen Ming Pork Ribs Prawn Noodle | 1.3741076, 103.8388639 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Shu Heng Bi Tai Mak | 1.36718, 103.84002 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Thohirah Restaurant | 1.398131, 103.87317 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Lai Heng Char Kway Teow | 1.3723618, 103.8290076 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ayah Dimsum | 1.36891617080101, 103.834499516963 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Dongsheng Cafe | 1.3735485392, 103.838176471 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Wonders | 1.37083202800001, 103.843546990613 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Rosnah's Family Kitchen | 1.380991, 103.840627 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Foy Yin Vegetarian Food | 1.380991, 103.840627 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Seng Huat Duck Rice | 1.3723618, 103.8290076 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Makan Food Stall | 1.3723618, 103.8290076 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Xiang Kee Yu Yuan Mian Tang | 1.37277209302753, 103.854457955288 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Vincent Western Food | 1.372185, 103.846562 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ki-mochi | 1.36776095130953, 103.855357145908 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Church of the Nativity of the Blessed Virgin Mary | 1.3735528, 103.8982626 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hougang Tou Mu Kung (Kew Ong Yah Temple) | 1.3551, 103.8788 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chomp Chomp Food Centre | 1.3642326, 103.8665271 (high) | status | confirm | **no-change**: confirms the current high pin (17 m); nothing to review | 1.36417, 103.86639 **high** · 17 m · “Chomp Chomp Food Centre” · [wikidata](https://www.wikidata.org/wiki/Q107803674) 2026-10-16 |  |
| Serangoon Garden Estate & Circus | 1.3636, 103.8654 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hougang Heritage Trail | 1.3597, 103.8853 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Punggol Park | 1.3771523, 103.897315 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Serangoon Park Connector | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| myVillage @ Serangoon Gardens | 1.3651735, 103.8651878 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Montfort Schools (formerly Holy Innocents' English School) | 1.374084, 103.888829 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Lim Tua Tow Market (heritage site) | 1.3603, 103.8855 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Serangoon Stadium & Sport Centre | 1.356202, 103.874947 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nex | 1.369639, 103.8485 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Masjid Haji Yusoff | 1.355654, 103.8796793 (high) | status | move | **hold**: wikidata coordinate only (Wikipedia mirrors Wikidata): needs the address or an OSM / official / Census source | 1.35572, 103.88 **high** · 36 m · “Masjid Haji Yusoff” · [wikidata](https://www.wikidata.org/wiki/Q6783346) 2026-10-16 |  |
| Chee Tong Temple | 1.358858, 103.892298 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Church of St Vincent de Paul | 1.3823703, 103.8766168 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Heartland Mall @ Kovan | 1.3595417, 103.8851611 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sungei Serangoon Park Connector (North-Eastern Riverine Loop) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kampong Lorong Buangkok | 1.38333, 103.87806 (high) | status | confirm | **no-change**: confirms the current high pin (7 m); nothing to review | 1.38333, 103.878 **high** · 7 m · “Kampong Lorong Buangkok” · [wikidata](https://www.wikidata.org/wiki/Q3192528) 2026-10-16 |  |
| Lorong Halus Wetland (Serangoon Reservoir) | 1.37889, 103.9275 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Holy Innocents' High School | 1.3670876, 103.8938822 (high) | status | conflict | **hold**: conflict: 578 m from the current pin — look at both | 1.37194, 103.89574 **high** · 578 m · “Holy Innocents' High School” · [wikipedia](https://en.wikipedia.org/wiki/Holy_Innocents'_High_School) 2026-10-16 |  |
| Zi Yun Kai Ji Gong | 1.3586, 103.8922 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kangkar (Kang Kar) heritage site | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ah Hock Fried Hokkien Mee | 1.3642326, 103.8665271 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chomp Chomp Satay | 1.3642326, 103.8665271 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chomp Chomp Fried Oyster | 1.3642326, 103.8665271 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Good Luck BBQ Chicken Wings | 1.3642326, 103.8665271 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hai Wei Yuan BBQ | 1.3642326, 103.8665271 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ang Sar Lee Satay Bee Hoon | 1.3642326, 103.8665271 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chia Keng Fried Hokkien Mee | 1.3642326, 103.8665271 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Aliff Nasi Lemak | 1.3634, 103.8667 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ah Seng Braised Duck Rice | 1.3634, 103.8667 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Garden Street Kway Chap | 1.3634, 103.8667 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Poh Poh Roasted Chicken Rice | 1.3634, 103.8667 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Serangoon Garden Bakery & Confectionery | 1.3634, 103.8667 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hock Kee Fried Oyster | 1.3634, 103.8667 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Lao Song Fa (Botanical Garden Famous Fishball Noodle) | 1.3634, 103.8667 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bee Heng Prawn Noodle | 1.3634, 103.8667 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Fong Kee Delicacies | 1.3634, 103.8667 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Pancake King | 1.3634, 103.8667 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Fatt Soon Kueh | 1.359092, 103.886095 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hougang Hainanese Curry Rice | 1.359092, 103.886095 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Bedok North 85 Fried Oyster | 1.359092, 103.886095 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yi Shi Jia Wanton Mee | 1.359092, 103.886095 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| 51 Ming Fa Wanton Egg Noodle | 1.359092, 103.886095 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yam Mee Teochew Fishball Noodles | 1.359092, 103.886095 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Pow Sing Restaurant | 1.3633984, 103.8657647 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| R.K. Eating House | 1.364365, 103.86594 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Srisun Express | 1.36338, 103.86576 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Apollo Coffee Bar | 1.36408, 103.86556 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Tian Wai Tian Fish Head Steamboat | 1.358163, 103.8844 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ponggol Nasi Lemak | 1.3619451, 103.886654 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yaowarat Thai Kway Chap | 1.36158, 103.88635 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Naked Ice Cream | 1.3616938, 103.8864375 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Al-Falah | 1.3727416, 103.8859111 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| BakeOpedia (The Bread Rack) | 1.3546545, 103.8768877 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Amber Ember — CLOSED | 1.353525, 103.87797 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Seng Kee Mushroom Minced Meat Noodle | 1.3634, 103.8667 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Swee Heng Wanton Noodle | 1.3642326, 103.8665271 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Wang Da Shen Chicken Wing & Satay | 1.3642326, 103.8665271 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Fa Ji Minced Meat Fishball Noodle | 1.359092, 103.886095 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hajjah Mariam Muslim Food | 1.359092, 103.886095 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Tom's Palette (Kovan) | 1.359509, 103.888103 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Lola's Cafe | 1.361447, 103.88582 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Two Cranes | 1.359623, 103.887717 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Dessert Bowl | 1.3642497, 103.8650289 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| East Bistro | 1.3651735, 103.8651878 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ng Kuan Chilli Pan Mee | 1.36148, 103.88628 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nakhon Kitchen | 1.359509, 103.888103 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Curry & Curry | 1.358163, 103.8844 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sin Heng Kee Porridge | 1.3749705, 103.8857976 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Fragrant Garden | 1.3539108, 103.8786533 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Nasi Lemak Ayam Taliwang | 1.375161, 103.882957 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ming Fa Duck Rice | 1.3540401, 103.8899682 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Original Simon Road Hokkien Mee | 1.359092, 103.886095 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Anshun Seafood Soup | 1.349057, 103.88806 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hougang Oyster Omelette & Fried Kway Teow | 1.3779847, 103.8940543 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Davis Prawn Court | 1.359092, 103.886095 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yong's Teochew Kueh | 1.36278, 103.88806 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Denzy Gelato | 1.3739584, 103.8868985 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Quan Ji Cooked Food | 1.3540401, 103.8899682 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yi Liu Xiang Nasi Lemak | 1.3540401, 103.8899682 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Apollo Grilled Western Food | 1.3540401, 103.8899682 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Tachinomiya | 1.359623, 103.887717 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Lorong Ah Soo Lor Mee (Fu Yuan Mei Shi) | 1.3540401, 103.8899682 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| 682 Min Jiang Kueh | 1.3736183, 103.8857489 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Sweedy Patisserie | 1.362982, 103.8951462 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Jade's Chicken | 1.375161, 103.882957 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Breakfast Club | 1.3613679, 103.8861498 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hajime Tonkatsu & Ramen | 1.3651735, 103.8651878 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yi Ji Fried Hokkien Prawn Mee | 1.3619451, 103.886654 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| 5 Star Corner Western Food | 1.3706833, 103.8943566 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Yi Dian Xin Hong Kong Dim Sum | 1.3620189, 103.886725 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| 88 Pocha | 1.3616938, 103.8864375 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Goldhill Family Restaurant | 1.3627, 103.894 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Mei Xi Hakka Yong Tau Foo | 1.375161, 103.882957 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| The Larder Cafe | 1.364113, 103.865557 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Picky Snout | 1.362864, 103.8882858 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Waa Cow! Yakiniku | 1.3651735, 103.8651878 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Fatto Catto | 1.36158, 103.88565 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kovan Scrambled Egg Rice | 1.3689482, 103.8987181 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Dong Jin Yuan Dian Xin | 1.3540401, 103.8899682 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Roasted Pork Belly Nasi Lemak | 1.3540401, 103.8899682 (high) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Happy Oven | 1.3726, 103.88575 (med) | status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chợ Nổi Cái Bè (Cái Bè Floating Market) | UNVERIFIED | unverified, status | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Holland Village Market & Food Centre | UNVERIFIED | unverified | pin | **hold**: extended feature (street, district, park, island…): pin the entrance / most-visited point by hand | 1.31102, 103.79476 **high** · new pin · “Holland Village Market & Food Centre” · [wikidata](https://www.wikidata.org/wiki/Q107803937) 2026-10-16 |  |
| Punggol Coast Hawker Centre | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Singapore Fried Hokkien Mee (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| 99 South Buona Vista Braised Duck | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hock Hai (Hong Lim) Curry Chicken Noodle (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Whampoa Traditional Fried Oyster (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Pin Wei Hong Kong Style Chee Cheong Fun (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| The Punggol Settlement | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ming Fa Fishball Noodles | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| 363 Katong Laksa (Holland Village) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Holland V Fried Bee Hoon | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Singapore Polo Club | UNVERIFIED | unverified | pin | **hold**: wikidata coordinate only (Wikipedia mirrors Wikidata): needs the address or an OSM / official / Census source | 1.3324, 103.83726 **high** · new pin · “Singapore Polo Club” · [wikidata](https://www.wikidata.org/wiki/Q7523082) 2026-10-16 |  |
| No. 1 Moulmein Rise (WOHA) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chip Bee Gardens (Jalan Merah Saga) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Buona Terra | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| INDOCAFE The White House | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Iru Den | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hakka Leipopo (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Kedai Salima (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Huay Kwang Thai Wanton Mee (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Ah Fong Noodle (Holland Village) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Balestier Plaza | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Wicked Good (Balestier) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| House of Tau Sar Piah — CLOSED | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Cafe de Hong Kong (Balestier) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Lotus Vegetarian Restaurant (Balestier) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| AMI Patisserie | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chef Chan's Private Dine | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Chui Huay Lim Teochew Cuisine | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Punggol Promenade (Nature Walk & Riverside Walk) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Punggol Heritage Trail (Old Punggol Road) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Jade's Chicken (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| 75 Ah Balling Peanut Soup (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| One Soy (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| You Fu Ban Mian & Pao Fan (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| What The Puff! (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hee Hee Hee Steamed Fish & Seafood (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| SJ Sickander Ammal Muslim Food (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Hong Kong Cha Kee (Goldhill) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |
| Xiang Chi Mian (Punggol Coast) | UNVERIFIED | unverified | skipped | **reject**: no proposal | — | Nominatim budget for this run reached (rerun resumes from cache) |

_Contains information from OpenStreetMap, © OpenStreetMap contributors, available under the Open Database Licence (ODbL) — https://www.openstreetmap.org/copyright_

_OneMap skipped: ONEMAP_EMAIL / ONEMAP_PASSWORD secrets are not set._

Review: set `review.decision` in the JSON to `accept` (coordinate) or `accept-closed` (closure confirmed — also set `review.statusSource`), with `review.by` and `review.why`; then run `node tools/location-verify.js --accept <this json>` locally and the gates.
