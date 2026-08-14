# Silicon Valley — budget-capped leads to finish when WebSearch refreshes

The session's shared WebSearch budget hit 200/200 during the first research wave.
These are vetted (name + full address + open status confirmed) but still need an
approved-source citation and/or geocoding. Add them in the next wave.

## East-Asian candidates (address + open verified; need Eater/Chronicle/Michelin key)
- Tai Er Sichuan Cuisine — 2855 Stevens Creek Blvd, Santa Clara 95050 — suan cai yu (sauerkraut fish). area SC.
- Dynasty Chinese Seafood — 1001 Story Rd, San Jose 95122 — dim sum carts. area SJ.
- SGD Tofu House — 3450 El Camino Real #105, Santa Clara 95051 — soondubu jjigae. area SC.
- Gochi Japanese Fusion Tapas — 19980 Homestead Rd, Cupertino 95014 — izakaya. area CU.
- Minato — 617 N 6th St, San Jose Japantown 95112 — teriyaki spareribs, since 1957 (KQED/Bourdain). area SJ.
- Din Tai Fung — 2855 Stevens Creek Blvd #1259, Santa Clara 95050 — XLB. TAIWANESE label. area SC.

## Vietnamese gaps (stated, not filled)
- No Michelin SJ Vietnamese exists (confirmed). Still to source: a Vietnamese coffee/che spot,
  a bun rieu specialist, a cha ca specialist; and any approved-source non-SJ (PA/MV/SUN/CU/SC) Vietnamese.

## Still-running-at-cap agents (may return partial): Taiwanese/boba, Indian/South-Indian, viral-food.

## GEOCODING: the whole SV set needs place-pin coordinates; WebSearch capped, so the browser
geocode-helper is the unblock. All SV places are queued into tools/geocode-helper.html.

## Creator-sourcing wave (USER DIRECTIVE) — run when WebSearch budget resets
Don't rely on Yelp — augment it. Discover trustworthy, POPULAR, HONEST creators who actually
visited & reviewed these places (travel bloggers, YouTubers, TikTokers, IG), then fact-check and
LOCATION-VERIFY every place they name. Never invent a creator — each must be confirmed real +
popular via search, with a findable piece of content showing them AT the place/region.

Vetting bar (docs/SOURCES.md §creators): real sizable following · real track record · a findable
video/post at the actual place (watch region-vs-place) · not pay-for-play. Register each in
data/sources.json cities["silicon-valley-ca"].creators (type famous_creator|local_creator, with
youtube/tiktok/instagram/blog + scope + verified:true), reuse across the region.

Discovery targets:
- San Jose / Little Saigon Vietnamese-food creators; Bay Area boba & Taiwanese reviewers;
  South-Indian / "masala corridor" dosa reviewers; general South Bay food+travel YouTubers/TikTokers
  with real followings who cover the Valley specifically (not generic SF-only accounts).
- Then attach a vetted creator source (layered on top of, not replacing, open-verification) to:
  * the 5 Yelp-only Vietnamese: Com Tam Thien Huong, Bun Bo Hue An Nam, Banh Xeo Ngon, Anh Hong, Nem Nuong Nha Trang
  * the boba/Taiwanese + South-Indian canon listed above (Boba Guys, Tpumps, 85C, Meet Fresh; Saravanaa Bhavan, Sri Ananda Bhavan, Anjappar, Madras Cafe, Naan-N-Masala…)
- Location-verify (exact place pin) every creator-sourced place before it maps.

## Fact-check pass: swap section-guide URLs for exact per-place review URLs
Some FOOD_VIRAL entries cite the correct outlet's city/section guide rather than a per-place
article — swap in exact review URLs when budget allows: Original Joe's, La Victoria Taqueria,
Bill's Cafe, Nick the Greek, Steins Beer Garden, Voyager Craft Coffee, Dutch Goose. Also note:
thrillist.com, mercurynews.com, sfchronicle.com, sfgate.com are blocked to WebSearch here, so
Mercury citations used edition.pagesuite.com article URLs — reconfirm when those domains are reachable.
Dropped for lack of an approved URL (open + real, revisit): Gilroy garlic (Garlic City Cafe),
Chromatic Coffee.
