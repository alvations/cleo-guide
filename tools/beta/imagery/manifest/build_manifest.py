"""Build beta/assets/img/commons-candidates.json (the fetch manifest) from the place data + the vetted candidates.

  python3 tools/beta/imagery/manifest/build_manifest.py      # from the repo root

Inputs: beta/data/places|gallery/*.json, and cands.tsv beside this file (key, file, depicts, confidence, reason,
flags, refused — one vetted Commons candidate or visual-review refusal per line). The dicts below hold the stated
skips (venues, brand stores, gaps), hero names/articles and pilots. Lane: imagery. Edit THIS copy (not a scratch copy);
re-run after every review, then cd tools && npm run beta.
"""
import json, glob, re, urllib.parse, collections, sys, os
S = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
VENUE = {'BAR','SPEAK','BREW','SHOP','Shopping','Mall','Hawker','CRAFT','GLASS','MKT','MARKET','Market','HOTEL','Hotel','CAFE','Cafe','Restaurant','FOOD','Food','Winery','WINE','Brewery','Distillery','Club','NIGHT','Theater','THEATER','THEATRE','Venue','VENUE','MUSIC','Arena','STADIUM','ENT','SHOW','SPORT'}
PILOTS = ['tokyo','cleveland','newyork','singapore/chinatown','wheeling']
# pilot tier-1 records deliberately given no photo, with the reason (never searched)
SKIP = {
 'cleveland#quintanas-speakeasy': 'venue (a bar) — never a photo',
 'cleveland#west-side-market': 'venue (a market hall of traders) — never a photo',
 'cleveland#free-stamp': 'modern public art (1991): the US has no freedom of panorama for sculpture',
 'cleveland#chess-collection-cleveland-public-library-main-library': 'a collection inside a building — a photo would show the building, not what is recommended',
 'cleveland#percy-skuy-collection-dittrick-medical-history-center': 'a collection inside a building — not photographable as the place',
 'cleveland#lucy-at-the-cleveland-museum-of-natural-history': 'an exhibit inside a museum — not photographable as the place',
 'cleveland#buckland-museum-of-witchcraft-and-magick': 'a small private venue — never a photo',
 'cleveland#the-sanctuary-museum-museum-of-divine-statues': 'a small private venue — never a photo',
 'cleveland#78th-street-studios': 'venue (galleries and studios) — never a photo',
 'cleveland#severance-music-center': 'venue (concert hall) — never a photo',
 'cleveland#beck-center-for-the-arts': 'venue (theatre) — never a photo',
 'cleveland#cain-park': 'venue (amphitheatre park) — never a photo',
 'cleveland#ge-chandelier-playhouse-square': 'modern public art (2014) in a theatre district: no US freedom of panorama for artworks',
 'cleveland#the-thinker': 'a sculpture, not a place — not searched this wave',
 'cleveland#haserot-angel-lake-view-cemetery': 'a sculpture — not searched this wave (Lake View Cemetery carries the photo)',
 'cleveland#solstice-steps-lakewood-park': 'no Commons file names the Solstice Steps (gap stated, not filled)',
 'cleveland#holden-arboretum-and-stebbins-gulch': 'only plant close-ups on Commons — none shows the arboretum (gap stated)',
 'newyork#luna-park-in-coney-island': 'venue (amusement park) — never a photo',
 'newyork#coney-island-cyclone': 'venue (an amusement ride) — never a photo',
 'newyork#yankee-stadium': 'venue (stadium) — never a photo',
 'newyork#radio-city-music-hall': 'venue (music hall) — never a photo',
 'newyork#apollo-theater': 'venue (theatre) — never a photo',
 'newyork#st-george-theatre': 'venue (theatre) — never a photo',
 'newyork#unisphere': 'modern public art (1964): the US has no freedom of panorama for sculpture',
 'newyork#bronx-zoo': 'no Commons file of the zoo itself turned up (gap stated)',
 'newyork#queens-museum': 'only 1939 archive scans on Commons — not the museum today (gap stated)',
 'newyork#staten-island-boat-graveyard': 'not searched this wave',
 'tokyo#ryogoku-kokugikan': 'venue (sumo arena) — never a photo',
 'tokyo#kabuki-za': 'venue (theatre) — never a photo',
 'tokyo#teamlab-planets-tokyo': 'venue whose content is copyrighted digital art — never a photo',
 'tokyo#azabudai-hills-and-teamlab-borderless': 'venue (mall + copyrighted digital art) — never a photo',
 'tokyo#ghibli-museum-mitaka': 'venue built around copyrighted characters — never a photo',
 'tokyo#warner-bros-studio-tour-tokyo-the-making-of-harry-potter': 'venue (branded attraction) — never a photo',
 'tokyo#shibuya-sky-shibuya-scramble-square': 'venue (paid observation deck) — never a photo',
 'tokyo#sunshine-city-ikebukuro': 'venue (shopping complex) — never a photo',
 'tokyo#toshima-city-tokiwaso-manga-museum': 'manga museum: copyrighted artwork on show — never a photo',
 'tokyo#suginami-animation-museum': 'animation museum: copyrighted artwork on show — never a photo',
 'tokyo#yayoi-kusama-museum': 'modern artwork on the façade (Japan has no freedom of panorama for art) — never a photo',
 'tokyo#sompo-museum-of-art': 'museum inside an office tower — not searched this wave',
 'wheeling#lemoyne-house': 'only a historical-marker photo on Commons — not the house (gap stated)',
 'wheeling#salt-fork-state-park': 'no Commons file of the park landscape turned up (gap stated)',
 'wheeling#the-wilds': 'no Commons photo of The Wilds turned up (gap stated)',
}
# W8 coverage: brand stores (the brand's signage is the subject) and copyrighted character art are never photographed
BRAND_STORE = re.compile(r"Mandarake|Pok[eé]mon Center|Nintendo KYOTO|Animate |Jump Shop|Kiddy Land|Gashapon|Capcom Store|PARCO Character|Kotobukiya|Character Street|Super Potato|Anime Center|Characters World", re.I)
VENUE_NAME = re.compile(r"\b(Theat(?:re|er)|Opera House|Playhouse|Ballpark|Arena|Stadium|Concert Hall)\b", re.I)
SKIP.update({
 'chicago#12th-street-beach': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'cincinnati#alms-park': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'columbus#ama-motorcycle-hall-of-fame-museum': 'no file found (only a sign photo) (wave 6 search) — calm cover (stated, W8)',
 'dayton#americas-packard-museum': 'only details/interiors (cars inside) (wave 6 search) — calm cover (stated, W8)',
 'hokkaido#akan-international-crane-center-grus': 'no file found (only crane/animal photos) (wave 6 search) — calm cover (stated, W8)',
 'osaka#abe-no-seimei-shrine': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'philadelphia#academy-of-music': 'venue (wave 6 search) — calm cover (stated, W8)',
 'singapore/balestier#balestier-art-deco-shophouses': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'singapore/bangkok#chatuchak-weekend-market': 'venue (wave 6 search) — calm cover (stated, W8)',
 'singapore/holland-village#holland-drive-market-and-food-centre': 'venue (wave 6 search) — calm cover (stated, W8)',
 'singapore/newton-novena#cairnhill-conservation-area': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'singapore/punggol#matilda-house': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'singapore/toa-payoh#block-53-the-vip-block': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'singapore/upper-serangoon#chee-tong-temple': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'statecollege#american-philatelic-center-match-factory': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'wheeling#belmont-county-victorian-mansion-museum': "no file found (possible lead: 'Mansion 001.JPG' in Category:Barnesville, Ohio - unverified) (wave 6 search) — calm cover (stated, W8)",
 'youngstown#arms-family-museum': "no file found (Category 'W. Arms House' exists, 13 files, titles not surfaced) (wave 6 search) — calm cover (stated, W8)",
 'akron#akron-fossils-and-science-center': "only details/interiors (exhibit shots; 'AFSC Creek.jpg' unseen) (wave 6 search) — calm cover (stated, W8)",
 'cincinnati#american-legacy-tours-queen-city-underground': 'no file found (tour; subject is the crypts/tunnels) (wave 6 search) — calm cover (stated, W8)',
 'columbus#anti-saloon-league-museum': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'dayton#benjamin-and-marian-schuster-performing-arts-center': 'venue (wave 6 search) — calm cover (stated, W8)',
 'indianapolis#bottleworks-district-and-the-garage-food-hall': 'venue (wave 6 search) — calm cover (stated, W8)',
 'orlando#alexander-springs': 'no file found (Category:Alexander Springs exists, ~10 files, titles not surfaced) (wave 6 search) — calm cover (stated, W8)',
 'osaka#aizen-do-shoman-in': "no file found (exact titles not confirmed; Category:Shōman-in holds 'Aizendo Shoman-in (Osaka Tennoji-ku) Temple hdsr S5 ...' series - read the category to get exact names) (wave 6 search) — calm cover (stated, W8)",
 'pittsburgh#aspinwall-riverfront-park': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'singapore/ang-mo-kio#ang-mo-kio-heritage-trail': 'no file found (trail, no single subject) (wave 6 search) — calm cover (stated, W8)',
 'singapore/balestier#balestier-market': 'venue (wave 6 search) — calm cover (stated, W8)',
 'singapore/bishan#kwong-wai-siew-peck-san-theng': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'singapore/marina-bay#esplanade-theatres-on-the-bay': 'venue (wave 6 search) — calm cover (stated, W8)',
 'singapore/newton-novena#tan-tock-seng-hospital-heritage-museum': "no file found (only general hospital photos, e.g. 'Tan Tock Seng Hospital 3, Aug 06.JPG' - not the museum) (wave 6 search) — calm cover (stated, W8)",
 'singapore/potong-pasir-macpherson#istana-bidadari-former-royal-palace-site': 'no file found (site only, palace gone) (wave 6 search) — calm cover (stated, W8)',
 'singapore/toa-payoh#church-of-the-risen-christ': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'singapore/upper-serangoon#hougang-heritage-trail': 'no file found (trail, no single subject; not searched) (wave 6 search) — calm cover (stated, W8)',
 'wheeling#capitol-theatre': 'venue (wave 6 search) — calm cover (stated, W8)',
 'youngstown#canfield-fairgrounds': 'only details/interiors (Big Lock feature with people/padlocks only) (wave 6 search) — calm cover (stated, W8)',
 'akron#boston-mills-brandywine-ski-resorts': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'columbus#blendon-woods-metro-park': 'no file found (only scanned report pages) (wave 6 search) — calm cover (stated, W8)',
 'erie#baldwin-reynolds-house-museum': 'no file found (Category:Baldwin-Reynolds House has 4 files, titles not surfaced) (wave 6 search) — calm cover (stated, W8)',
 'ghent#de-vooruit-viernulvier': 'venue (wave 6 search) — calm cover (stated, W8)',
 'harrisburg#carlisle-indian-school-cemetery': 'no file found (wave 6 search) — calm cover (stated, W8)',
 'orlando#american-space-museum-and-space-walk-of-fame': 'modern artwork, no FoP (only file found is the Apollo Monument of the Space Walk of Fame; 18 other files in category not surfaced) (wave 6 search) — calm cover (stated, W8)',
 'newyork#african-burial-ground-national-monument': 'modern memorial sculpture, no US FoP (wave 6 search) — calm cover (stated, W8)',
 'washingtondc#air-force-memorial': 'modern memorial sculpture (the spires), no US FoP (wave 6 search) — calm cover (stated, W8)',
})
SKIP.update({
 'akron#massillon-museum-massmu': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'akron#sojourner-truth-legacy-plaza': 'modern artwork, no US FoP (wave 5 search) — calm cover (stated, W8)',
 'cincinnati#21c-museum-hotel-cincinnati': 'venue (wave 5 search) — calm cover (stated, W8)',
 'columbus#billy-ireland-cartoon-library-and-museum': 'only details/interiors (wave 5 search) — calm cover (stated, W8)',
 'dayton#sugarcreek-metropark': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'dayton#possum-creek-metropark': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'dayton#national-afro-american-museum-and-cultural-center': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'dayton#hartman-rock-garden': 'modern artwork, no US FoP (wave 5 search) — calm cover (stated, W8)',
 'erie#mcconnells-mill-state-park': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'erie#pymatuning-spillway-where-the-ducks-walk-on-the-fish': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'erie#goodell-gardens-and-homestead': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'erie#schaefers-auto-art': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'harrisburg#national-civil-war-museum': 'only details/interiors (wave 5 search) — calm cover (stated, W8)',
 'harrisburg#the-hershey-story': 'only details/interiors (wave 5 search) — calm cover (stated, W8)',
 'harrisburg#u-s-army-heritage-and-education-center': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'harrisburg#appalachian-trail-museum': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'harrisburg#hersheys-chocolate-world': 'venue (wave 5 search) — calm cover (stated, W8)',
 'harrisburg#carlisle-fairgrounds-carlisle-events-car-shows': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'indianapolis#indianapolis-zoo': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'indianapolis#landmark-for-peace-memorial': 'modern artwork, no US FoP (wave 5 search) — calm cover (stated, W8)',
 'madison#national-mustard-museum': 'only details/interiors (wave 5 search) — calm cover (stated, W8)',
 'madison#international-crane-foundation': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'pittsburgh#pump-house-and-battle-of-homestead-site': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'statecollege#the-arboretum-at-penn-state-h-o-smith-botanic-gardens': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'washingtondc#national-museum-of-the-united-states-army': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'youngstown#youngstown-historical-center-of-industry-and-labor': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'youngstown#fellows-riverside-gardens': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'youngstown#national-packard-museum': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'siliconvalley#apple-park-visitor-center': 'venue (a brand store and café) (wave 5 search) — calm cover (stated, W8)',
 'statecollege#palmer-museum-of-art': 'only photos of the old Curtin Road building; the museum moved to a new building in 2024 (wave 5 search) — calm cover (stated, W8)',
 'harrisburg#little-round-top': 'only views from the hill, not of it (wave 5 search) — calm cover (stated, W8)',
})
SKIP.update({
 'antwerp#zoo-planckendael': 'no file found (only animal photos) (wave 5 search) — calm cover (stated, W8)',
 'antwerp#de-ruien': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'hokkaido#asahiyama-zoo': 'no file found (only animal photos) (wave 5 search) — calm cover (stated, W8)',
 'osaka#super-nintendo-world-universal-studios-japan': 'modern artwork (wave 5 search) — calm cover (stated, W8)',
 'osaka#expo-70-commemorative-park-and-tower-of-the-sun': 'modern artwork (wave 5 search) — calm cover (stated, W8)',
 'singapore/ang-mo-kio#kebun-baru-birdsinging-club': 'venue (wave 5 search) — calm cover (stated, W8)',
 'singapore/balestier#goh-chor-tua-pek-kong-temple-and-wayang-stage': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'singapore/balestier#former-malay-film-productions-studio-shaw-studio': 'no file found (only a 1948 historical photo) (wave 5 search) — calm cover (stated, W8)',
 'singapore/newton-novena#goodwood-park-hotel-tower-wing': 'venue (wave 5 search) — calm cover (stated, W8)',
 'singapore/potong-pasir-macpherson#potong-pasir-sloping-roof-hdb-blk-101-142': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'singapore/potong-pasir-macpherson#bidadari-park-and-alkaff-lake': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'singapore/toa-payoh#united-temple-united-five-temples-of-toa-payoh': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'bruges#de-haan-concessie-belle-epoquewijk': 'only files naming a nearby building or an address, not the quarter (wave 5 search) — calm cover (stated, W8)',
 'bruges#james-ensorhuis': 'only files naming a nearby building or an address, not the house (wave 5 search) — calm cover (stated, W8)',
 'brussels#theatre-royal-de-toone': 'venue (a puppet theatre and bar); only a nearby-building file (wave 5 search) — calm cover (stated, W8)',
 'osaka#universal-studios-japan': 'theme park entrance dominated by character and globe art; Japan has no freedom of panorama for art (wave 5 search) — calm cover (stated, W8)',
})
SKIP.update({
 'chicago#cloud-gate-the-bean': 'modern artwork, no US FoP (wave 5 search) — calm cover (stated, W8)',
 'chicago#kingston-mines': 'venue (wave 5 search) — calm cover (stated, W8)',
 'chicago#buddy-guys-legends': 'venue (wave 5 search) — calm cover (stated, W8)',
 'chicago#the-second-city': 'venue (wave 5 search) — calm cover (stated, W8)',
 'chicago#national-a-philip-randolph-pullman-porter-museum': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'chicago#ravinia-festival': 'venue (wave 5 search) — calm cover (stated, W8)',
 'chicago#marquette-park-and-mlk-living-memorial': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'chicago#crown-fountain': 'modern artwork, no US FoP (wave 5 search) — calm cover (stated, W8)',
 'chicago#peggy-notebaert-nature-museum': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'chicago#empty-bottle': 'venue (wave 5 search) — calm cover (stated, W8)',
 'chicago#the-hideout': 'venue (wave 5 search) — calm cover (stated, W8)',
 'chicago#metro': 'venue (wave 5 search) — calm cover (stated, W8)',
 'miami#holocaust-memorial-miami-beach': 'modern artwork, no US FoP (wave 5 search) — calm cover (stated, W8)',
 'miami#wynwood-walls': 'modern artwork, no US FoP (wave 5 search) — calm cover (stated, W8)',
 'miami#biltmore-hotel': 'venue (wave 5 search) — calm cover (stated, W8)',
 'miami#rubell-museum': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'miami#gold-coast-railroad-museum': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'miami#cauley-square-historic-village': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'miami#bay-of-pigs-museum-brigade-2506': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'orlando#gatorland': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'orlando#kilimanjaro-safaris': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'orlando#disneys-grand-floridian-resort-and-spa': 'venue (wave 5 search) — calm cover (stated, W8)',
 'orlando#disneys-wilderness-lodge': 'venue (wave 5 search) — calm cover (stated, W8)',
 'philadelphia#philadelphias-magic-gardens': 'modern artwork, no US FoP (wave 5 search) — calm cover (stated, W8)',
 'philadelphia#glencairn-museum': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'philadelphia#love-park-jfk-plaza': 'modern artwork, no US FoP (wave 5 search) — calm cover (stated, W8)',
 'philadelphia#walt-whitmans-tomb-harleigh-cemetery': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'sanfrancisco#sfo-louis-a-turpen-aviation-museum-and-library': 'only details/interiors (wave 5 search) — calm cover (stated, W8)',
 'sanfrancisco#curiodyssey-at-coyote-point': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'sanfrancisco#musee-mecanique': 'only details/interiors (wave 5 search) — calm cover (stated, W8)',
 'sanfrancisco#fairmont-san-francisco': 'venue (wave 5 search) — calm cover (stated, W8)',
 'sanfrancisco#city-lights-bookstore': 'venue (wave 5 search) — calm cover (stated, W8)',
 'sanfrancisco#clarion-alley': 'modern artwork, no US FoP (wave 5 search) — calm cover (stated, W8)',
})
SKIP.update({
 'aachen#boekhandel-dominicanen': 'venue (bookshop) (wave 5 search) — calm cover (stated, W8)',
 'kyoto#hozugawa-river-cruise-hozu-gorge': 'no file found (only boat-as-subject or dusk shots) (wave 5 search) — calm cover (stated, W8)',
 'rhineland#museum-insel-hombroich': 'the only Commons photo found shows an Erwin Heerich pavilion, a modern artwork (wave 5 search) — calm cover (stated, W8)',
})
SKIP.update({
 'orlando#tree-of-life-disney': 'its distinctive content is the carved animal relief: sculpture, which the US gives no freedom of panorama — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
})
SKIP.update({
 'orlando#frozen-ever-after': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
 'orlando#remys-ratatouille-adventure': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
 'orlando#star-wars-rise-of-the-resistance': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
 'orlando#avatar-flight-of-passage': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
 'orlando#harry-potter-and-the-escape-from-gringotts': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
 'orlando#revenge-of-the-mummy': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
 'orlando#harry-potter-and-the-battle-at-the-ministry': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
 'orlando#mario-kart-bowsers-challenge-epic-universe': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
 'orlando#mine-cart-madness': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
 'orlando#monsters-unchained-the-frankenstein-experiment': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
 'orlando#mickey-and-minnies-runaway-railway': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
 'orlando#men-in-black-alien-attack': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
 'orlando#the-simpsons-ride': 'indoor themed ride: the attraction is its themed sets, characters and sculpture (copyrighted design; the US has no freedom of panorama for art), and its show building does not show the ride — calm cover (stated, R8, orchestrator ruling 2026-10-16)',
})
SKIP.update({
 'okinawa#17end-shimoji-island': "no file found (only 'Shimojishima Runway17.jpg', subject unconfirmed) (wave 5 search) — calm cover (stated, W8)",
 'okinawa#uegusuku-castle-ruins-kume-island': 'no file found (wave 5 search) — calm cover (stated, W8)',
 'saarland#saarlandmuseum-moderne-galerie': 'only details/interiors (results were sculptures/artworks; no confirmed building exterior) (wave 5 search) — calm cover (stated, W8)',
 'saarland#romische-villa-nennig': 'only details/interiors (mosaic photos/archival excavation images; no villa or shelter exterior found) (wave 5 search) — calm cover (stated, W8)',
 'okinawa#kakazu-ridge-kakazu-takadai-park': 'only a crowd photo on Commons (wave 5 search) — calm cover (stated, W8)',
})
SKIP.update({
 'bruges#basiliek-van-het-heilig-bloed': 'both vetted Commons files refused (run #60 close-up, run #64 a painted triptych) — calm cover (stated, W8)',
 'bruges#zwin-natuurpark': 'both vetted Commons files refused (a plain beach; a housing estate) — calm cover (stated, W8)',
})
SKIP.update({
 'dayton#eastwood-metropark': 'no Commons file of the park found (wave 4 search) — calm cover (stated, W8)',
 'dayton#englewood-metropark': 'no Commons file of the park found (wave 4 search) — calm cover (stated, W8)',
})
SKIP.update({
 'tokyo#nihonbashi-bridge': 'no Commons file shows the whole bridge (the expressway runs overhead); the kirin close-up and the view from the bridge were refused — calm cover (stated, W8)',
 'wheeling#meadowcroft-rockshelter-and-historic-village': 'R7 QA-63: the only other Commons photo is under 640 px; every file is a rock close-up — calm cover (stated)',
 'wheeling#pennsylvania-trolley-museum': 'R7 QA-63: every Commons photo shows a trolley (equipment) rather than the place — calm cover (stated)',
 'hokkaido#former-aoyama-villa-otaru-kihinkan': 'candidate wave 1: no Commons file of the Former Aoyama Villa / Otaru Kihinkan turned up (searched English and Japanese) — calm cover (stated)',
 'kyoto#nintendo-museum': 'candidate wave 1: a brand venue; its exterior photos carry the brand, the branding is the subject — calm cover (stated)',
 'osaka#den-den-town-nipponbashi': 'candidate wave 1: a shop street whose every photo is dominated by signage (the lead image was refused for it) — calm cover (stated)',
 'siliconvalley#elizabeth-f-gamble-garden': 'candidate wave 1: Commons holds only flower close-ups of Gamble Garden — calm cover (stated)',
 'singapore/mandai#singapore-zoo': 'candidate wave 1: Commons holds animal close-ups and the (refused) entrance sign, no view of the zoo itself — calm cover (stated)',
 'singapore/punggol#coney-island-park-pulau-serangoon': 'candidate wave 1: no Commons file of Coney Island Park, Singapore turned up — calm cover (stated)',
 'pittsburgh#andrew-carnegie-free-library-and-music-hall': 'candidate wave 2: the only Commons photo of the Andrew Carnegie Free Library (Carnegie, PA) is 600 px wide, under the 640 px floor — calm cover (stated)',
 'pittsburgh#pennsylvania-trolley-museum': 'R7 QA-63: every Commons photo shows a trolley (equipment) rather than the place — calm cover (stated)',
 'washingtondc#martin-luther-king-jr-memorial': 'modern sculpture (2011): the US has no freedom of panorama for sculpture — calm cover (stated)',
 'washingtondc#vietnam-veterans-memorial': 'modern memorial artwork (1982): the US has no freedom of panorama for sculpture — calm cover (stated)',
 'washingtondc#u-s-marine-corps-war-memorial-iwo-jima': 'sculpture (1954): the US has no freedom of panorama for sculpture — calm cover (stated)',
 'washingtondc#national-world-war-ii-memorial': 'modern memorial with copyrighted sculpture (2004): the US has no freedom of panorama for sculpture — calm cover (stated)',
 'washingtondc#african-american-civil-war-memorial-and-museum': 'the memorial is a modern sculpture (1997): the US has no freedom of panorama for sculpture — calm cover (stated)',
 'youngstown#dave-grohl-alley': 'candidate wave 3: an alley of modern murals — copyrighted artwork is the subject — calm cover (stated)',
 'youngstown#past-times-arcade': 'candidate wave 3: an arcade (a venue) — never a photo — calm cover (stated)',
 'bruges#garnaalvissers-te-paard-oostduinkerke': 'candidate wave 3: a living tradition — the horseback shrimp fishers themselves are the subject (people rule) — calm cover (stated)',
 'pittsburgh#mattress-factory': 'run #58/60: the only large Commons photo was refused (an aerial); every other Commons photo of the Mattress Factory is 400 px wide, under the 640 px floor — calm cover (stated)',
 'chicago#site-of-the-great-chicago-fire-pillar-of-fire': 'R7-g1: the only Commons lead image is a DeKoven Street view of parked cars; no file shows the site or the Pillar of Fire sculpture — calm cover (stated)',
 'chicago#360-chicago-875-north-michigan-avenue': 'venue (paid observation deck, like Shibuya Sky) — never a photo',
 'kyoto#marufukuro-former-nintendo-headquarters': 'no Commons file shows the 1930 Marufukuro building (only the later research centre and a name plate) — gap stated',
 'okinawa#nishihara-kira-kira-beach': 'only a rainy-evening file of an unconfirmed "Kirakira" beach on Commons — gap stated',
 'okinawa#okitsura-pilgrimage-gushikawa-uruma': 'an anime pilgrimage route, not one photographable place — gap stated',
})
# extra names a file title/description/category may use for the place (matched without spaces/diacritics)
NAMES = {
 'bruges#belfort-van-brugge': ['Belfort van Brugge', 'Belfort', 'Belfry of Bruges', 'Belfry of Brugge'],
 'bruges#stadhuis-van-brugge': ['Stadhuis van Brugge', 'Stadhuis', 'City Hall of Brugge', 'Bruges City Hall'],
 'bruges#begijnhof-ten-wijngaerde': ['Begijnhof Ten Wijngaerde', 'Begijnhof', 'Beguinage of Brugge'],
 'bruges#de-burg': ['De Burg', 'Burg square', 'Burg (Brugge)'],
 'bruges#basiliek-van-het-heilig-bloed': ['Basiliek van het Heilig Bloed', 'Heilig Bloed', 'Basilica of the Holy Blood'],
 'bruges#onze-lieve-vrouwekerk-michelangelos-madonna': ['Onze-Lieve-Vrouwekerk', 'Church of Our Lady'],
 'bruges#zwin-natuurpark': ['Zwin Natuurpark', 'Zwin'],
 'bruges#damme-historisch-stadje-and-boekendorp': ['Damme'],
 'youngstown#national-mckinley-birthplace-memorial-and-museum': ['National McKinley Birthplace Memorial', 'McKinley Memorial', 'McKinley Birthplace'],
 'pittsburgh#grandview-avenue-overlook-mount-washington': ['Grandview Avenue', 'Mount Washington', 'Mt. Washington'],
 'washingtondc#smithsonian-american-art-museum-and-national-portrait-galler': ['Smithsonian American Art Museum', 'National Portrait Gallery', 'Old Patent Office', 'Patent Office Building'],
 'okinawa#cape-chinen-park': ['Chinen'],
 'okinawa#azama-sun-sun-beach': ['Azama'],
 'okinawa#nirai-kanai-bridge-overlook': ['Nirai Kanai'],
 'singapore/marina-bay#marina-bay-sands-skypark-observation-deck': ['Skypark','Sky Park'],
 'siliconvalley#elizabeth-f-gamble-garden': ['Gamble Garden'],
 'hokkaido#jozankei-onsen': ['Jozankei'],
 'hokkaido#sapporo-beer-museum': ['Sapporo Beer Museum'],
 'singapore/bukit-timah#singapore-botanic-gardens': ['Singapore Botanic Gardens'],
 'singapore/marine-parade#east-coast-park': ['East Coast Park'],
 'newyork#bethesda-terrace-and-fountain': ['Bethesda Terrace','Bethesda Fountain'],
 'newyork#cathedral-of-st-john-the-divine': ['Saint John the Divine','St. John the Divine'],
 'newyork#whitney-museum-of-american-art': ['Whitney Museum'],
 'tokyo#kiyosumi-garden': ['Kiyosumi Teien','Kiyosumi'],
 'tokyo#rikugien-gardens': ['Rikugien','Rikugi-en'],
 'tokyo#hama-rikyu-gardens': ['Hama-rikyu','Hamarikyu'],
 'cleveland#lake-view-cemetery-whole-grounds': ['Lake View Cemetery','Lakeview Cemetery','Garfield Memorial','Garfield Monument'],
 'cleveland#franklin-castle': ['Tiedemann'],
 'cleveland#brandywine-falls': ['Brandywine'],
 'cleveland#the-arcade-old-arcade': ['Cleveland Arcade'],
 'cleveland#terminal-tower-observation-deck': ['Terminal Tower'],
 'cleveland#hope-memorial-bridge-and-the-guardians-of-traffic': ['Hope Memorial Bridge','Guardians of Traffic','Lorain-Carnegie'],
 'cleveland#rocky-river-reservation-and-fort-hill-stairs': ['Rocky River Reservation','Fort Hill'],
 'cleveland#huntington-reservation-and-beach': ['Huntington Beach','Huntington Reservation'],
 'cleveland#virginia-kendall-ledges-overlook': ['Virginia Kendall','Kendall Ledges'],
 'cleveland#steamship-william-g-mather': ['William G. Mather','WilliamGMather'],
 'newyork#9-11-memorial-and-museum': ['September 11 Memorial','9/11 Memorial','911 Memorial'],
 'newyork#central-park': ['Central Park'],
 'newyork#staten-island-ferry-st-george-terminal': ['St. George Terminal','Saint George Terminal','Staten Island Ferry'],
 'newyork#rockaway-beach-and-boardwalk': ['Rockaway'],
 'newyork#fort-wadsworth-and-battery-weed': ['Fort Wadsworth','Battery Weed'],
 'newyork#snug-harbor-cultural-center-and-botanical-garden': ['Snug Harbor'],
 'newyork#new-york-chinese-scholars-garden': ["Chinese Scholar's Garden",'Chinese Scholar Garden','ChineseScholarGarden'],
 'newyork#van-cortlandt-park': ['Van Cortlandt'],
 'newyork#pelham-bay-park': ['Pelham Bay','Orchard Beach'],
 'newyork#dia-beacon': ['Dia:Beacon','Dia Beacon','Diabeacon'],
 'newyork#museum-of-modern-art-moma': ['Museum of Modern Art','MoMA'],
 'newyork#rockefeller-center': ['Rockefeller'],
 'newyork#neue-galerie-new-york': ['Neue Galerie','William Starr Miller'],
 'newyork#the-metropolitan-museum-of-art': ['Metropolitan Museum','The Met','MET'],
 'newyork#american-museum-of-natural-history': ['American Museum of Natural History','AMNH'],
 'newyork#new-york-state-pavilion': ['New York State Pavilion',"World's Fair"],
 'tokyo#kokyo-gaien-and-nijubashi': ['Nijubashi','Niju Bashi','Seimon Ishibashi','Kokyo Gaien','Imperial Palace'],
 'tokyo#great-buddha-of-kamakura-kotoku-in': ['Kotoku-in','Daibutsu','Great Buddha'],
 'tokyo#chureito-pagoda-arakurayama-sengen-park': ['Chureito','Churei-to','Arakurayama'],
 'tokyo#toki-no-kane-kawagoe-time-bell': ['Toki no Kane','TokiNoKane'],
 'tokyo#meiji-jingu-gaien-and-icho-namiki-ginkgo-avenue': ['Jingu Gaien','Meiji jingu outer garden','Icho Namiki'],
 'tokyo#hase-dera-kamakura': ['Hasedera','Hase-dera','Hase-kannon'],
 'tokyo#ukiyo-e-ota-memorial-museum-of-art': ['Ota Memorial Museum','Ota-Memorial-Museum'],
 'tokyo#national-museum-of-western-art': ['Western Art',"art occidental"],
 'tokyo#yoyogi-national-gymnasium': ['Yoyogi National'],
 'tokyo#imperial-palace-east-gardens': ['East Garden','East Gardens'],
 'tokyo#state-guest-house-akasaka-palace': ['Akasaka Palace'],
 'tokyo#mount-takao': ['Takao'],
 'tokyo#kaminarimon': ['Kaminari'],
 'tokyo#suga-shrine-stairs-yotsuya': ['Suga Shrine','Suga Jinja'],
 'tokyo#shibuya-scramble-crossing': ['Shibuya Crossing','Shibuya scramble'],
 'singapore/chinatown#sri-mariamman-temple': ['Sri Mariamman'],
 'singapore/chinatown#buddha-tooth-relic-temple-and-museum': ['Buddha Tooth Relic'],
 'wheeling#great-stone-viaduct': ['Bellaire viaduct','B&O Railroad Viaduct','Benwood'],
 'wheeling#pennsylvania-trolley-museum': ['Trolley Museum'],
}
HERO = {  # key: (label, names, pilot)
 'tokyo': ('Tokyo — city hero (skyline)', ['Tokyo','Tokio','Minato']),
 'cleveland': ('Cleveland — city hero (skyline)', ['Cleveland']),
 'newyork': ('New York — city hero (skyline)', ['Manhattan','New York']),
 'singapore/chinatown': ('Chinatown, Singapore — town hero', ['Chinatown','Pagoda Street']),
 'wheeling': ('Wheeling — city hero (Suspension Bridge)', ['Wheeling']),
 'japan': ('Japan — country hub hero (landscape)', ['Fuji','Japan']),
 'us': ('United States — country hub hero', ['Manhattan','Capitol','Golden Gate']),
 'singapore': ('Singapore — country hub hero (Marina Bay)', ['Singapore','Marina Bay']),
 'belgium': ('Belgium — country hub hero', ['Grand Place','Grand-Place','Brussels','Bruxelles','Rozenhoedkaai','Bruges','Brugge','Dijver','Graslei','Gent','Ghent','Gravensteen','Antwerpen','Antwerp','Liebfrauenkathedrale']),
 'germany': ('Germany — country hub hero', ['Saarschleife','Saar','Aachen','Bonn','Rheinufer','Rhine','Altes Rathaus']),
 'kyoto': ('Kyoto — city hero (Yasaka Pagoda)', ['Yasaka','Hokan','Kyoto','Kiyomizu']),
 'osaka': ('Osaka — city hero (Osaka Castle)', ['Osaka Castle']),
 'hokkaido': ('Hokkaido (Sapporo, Otaru) — city hero', ['Sapporo','Odori','Otaru']),
 'okinawa': ('Okinawa — city hero (Kerama islands)', ['Zamami','Furuzamami','Okinawa','Shuri']),
 'chicago': ('Chicago — city hero (skyline)', ['Chicago']),
 'pittsburgh': ('Pittsburgh — city hero (skyline)', ['Pittsburgh']),
 'philadelphia': ('Philadelphia — city hero (skyline)', ['Philadelphia']),
 'washingtondc': ('Washington, DC — city hero (Capitol)', ['United States Capitol']),
 'sanfrancisco': ('San Francisco — city hero', ['San Francisco']),
 'siliconvalley': ('Silicon Valley — region hero (San Jose)', ['San Jose','Silicon Valley','Stanford']),
 'cincinnati': ('Cincinnati — city hero (skyline)', ['Cincinnati']),
 'columbus': ('Columbus — city hero (skyline)', ['Columbus']),
 'indianapolis': ('Indianapolis — city hero (canal and skyline)', ['Monument Circle','Indianapolis','Indy Central Canal']),
 'miami': ('Miami — city hero (skyline)', ['Miami']),
 'orlando': ('Orlando — city hero (Lake Eola)', ['Lake Eola','Orlando']),
 'akron': ('Akron — city hero (skyline)', ['Akron']),
 'dayton': ('Dayton — city hero (RiverScape)', ['Dayton','RiverScape']),
 'erie': ('Erie — city hero (Presque Isle)', ['Erie','Presque Isle']),
 'harrisburg': ('Harrisburg — city hero', ['Harrisburg']),
 'madison': ('Madison — city hero (State Capitol)', ['Madison','Wisconsin State Capitol']),
 'statecollege': ('State College — town hero (Old Main)', ['Old Main','Penn State','Penn state']),
 'youngstown': ('Youngstown — city hero (Mill Creek Park)', ['Youngstown','Lanterman','Mill Creek Park']),
 'bruges': ('Bruges — city hero (Rozenhoedkaai)', ['Rozenhoedkaai','Bruges','Brugge']),
 'ghent': ('Ghent — city hero (Graslei)', ['Graslei','Korenlei','Gent','Ghent']),
 'brussels': ('Brussels — city hero (Grand-Place)', ['Grand Place','Grand-Place']),
 'antwerp': ('Antwerp — city hero (Grote Markt)', ['Grote Markt','Antwerp','Antwerpen']),
 'liege': ('Liège — city hero', ['Liège','Liege','Bueren']),
 'aachen': ('Aachen — city hero (Markt and cathedral)', ['Aachen']),
 'rhineland': ('Rhineland (Bonn) — city hero', ['Bonn']),
 'saarland': ('Saarland — region hero (Saar loop)', ['Saarschleife','Saar']),
}

# W8 (R7 gap 1): every remaining non-Vietnam guide gets a hero target — the town's Wikipedia article lead image, then
# an iconic sight's; the same checks apply (maps, montages, logos, signage, gloom refused). Vietnam: a stated reason.
HERO_ARTICLES = {
 'singapore/ang-mo-kio': ('Ang Mo Kio', ['Ang Mo Kio'], ['https://en.wikipedia.org/wiki/Ang_Mo_Kio']),
 'singapore/balestier': ('Balestier', ['Balestier'], ['https://en.wikipedia.org/wiki/Balestier']),
 'singapore/bedok': ('Bedok', ['Bedok'], ['https://en.wikipedia.org/wiki/Bedok']),
 'singapore/bishan': ('Bishan', ['Bishan'], ['https://en.wikipedia.org/wiki/Bishan,_Singapore', 'https://en.wikipedia.org/wiki/Bishan-Ang_Mo_Kio_Park']),
 'singapore/bukit-timah': ('Bukit Timah', ['Bukit Timah'], ['https://en.wikipedia.org/wiki/Bukit_Timah', 'https://en.wikipedia.org/wiki/Bukit_Timah_Nature_Reserve']),
 'singapore/changi': ('Changi', ['Changi'], ['https://en.wikipedia.org/wiki/Changi', 'https://en.wikipedia.org/wiki/Changi_Beach_Park']),
 'singapore/civic-district': ('Civic District', ['Civic District', 'Padang', 'Esplanade', 'Victoria Theatre'], ['https://en.wikipedia.org/wiki/Civic_District', 'https://en.wikipedia.org/wiki/Padang,_Singapore']),
 'singapore/dempsey-hill': ('Dempsey Hill', ['Dempsey'], ['https://en.wikipedia.org/wiki/Dempsey_Hill']),
 'singapore/geylang': ('Geylang', ['Geylang'], ['https://en.wikipedia.org/wiki/Geylang']),
 'singapore/holland-village': ('Holland Village', ['Holland Village'], ['https://en.wikipedia.org/wiki/Holland_Village,_Singapore']),
 'singapore/jalan-besar': ('Jalan Besar & Lavender', ['Jalan Besar', 'Lavender'], ['https://en.wikipedia.org/wiki/Jalan_Besar']),
 'singapore/jurong': ('Jurong', ['Jurong'], ['https://en.wikipedia.org/wiki/Jurong', 'https://en.wikipedia.org/wiki/Jurong_Lake_Gardens']),
 'singapore/kampong-glam': ('Kampong Glam', ['Kampong Glam', 'Kampong Gelam', 'Sultan Mosque', 'Masjid Sultan'], ['https://en.wikipedia.org/wiki/Kampong_Glam', 'https://en.wikipedia.org/wiki/Sultan_Mosque']),
 'singapore/katong-joo-chiat': ('Katong & Joo Chiat', ['Katong', 'Joo Chiat', 'Koon Seng'], ['https://en.wikipedia.org/wiki/Katong', 'https://en.wikipedia.org/wiki/Joo_Chiat']),
 'singapore/little-india': ('Little India', ['Little India'], ['https://en.wikipedia.org/wiki/Little_India,_Singapore']),
 'singapore/mandai': ('Mandai', ['Mandai', 'Upper Seletar'], ['https://en.wikipedia.org/wiki/Mandai', 'https://en.wikipedia.org/wiki/Upper_Seletar_Reservoir']),
 'singapore/marina-bay': ('Marina Bay', ['Marina Bay'], ['https://en.wikipedia.org/wiki/Marina_Bay,_Singapore']),
 'singapore/marine-parade': ('Marine Parade & East Coast', ['Marine Parade', 'East Coast'], ['https://en.wikipedia.org/wiki/Marine_Parade']),
 'singapore/newton-novena': ('Newton & Novena', ['Newton', 'Novena', 'Saint Alphonsus', 'St Alphonsus'], ['https://en.wikipedia.org/wiki/Newton,_Singapore', 'https://en.wikipedia.org/wiki/Novena,_Singapore', 'https://en.wikipedia.org/wiki/Novena_Church']),
 'singapore/old-airport-road': ('Old Airport Road', ['Kallang Airport', 'Old Airport'], ['https://en.wikipedia.org/wiki/Kallang_Airport']),
 'singapore/potong-pasir-macpherson': ('Potong Pasir & MacPherson', ['Potong Pasir', 'MacPherson'], ['https://en.wikipedia.org/wiki/Potong_Pasir', 'https://en.wikipedia.org/wiki/MacPherson,_Singapore']),
 'singapore/punggol': ('Punggol', ['Punggol'], ['https://en.wikipedia.org/wiki/Punggol', 'https://en.wikipedia.org/wiki/Punggol_Waterway_Park']),
 'singapore/queenstown': ('Queenstown & Redhill', ['Queenstown', 'Redhill'], ['https://en.wikipedia.org/wiki/Queenstown,_Singapore']),
 'singapore/southern-ridges': ('Southern Ridges', ['Southern Ridges', 'Henderson Waves', 'Mount Faber'], ['https://en.wikipedia.org/wiki/Southern_Ridges', 'https://en.wikipedia.org/wiki/Mount_Faber']),
 'singapore/tiong-bahru': ('Tiong Bahru', ['Tiong Bahru'], ['https://en.wikipedia.org/wiki/Tiong_Bahru']),
 'singapore/toa-payoh': ('Toa Payoh', ['Toa Payoh', 'Dragon Playground'], ['https://en.wikipedia.org/wiki/Toa_Payoh', 'https://en.wikipedia.org/wiki/Toa_Payoh_Town_Park']),
 'singapore/upper-serangoon': ('Upper Serangoon', ['Serangoon'], ['https://en.wikipedia.org/wiki/Serangoon']),
 'singapore/upper-thomson': ('Upper Thomson & MacRitchie', ['MacRitchie', 'Thomson'], ['https://en.wikipedia.org/wiki/MacRitchie_Reservoir']),
 'singapore/chinatown': ('Chinatown & CBD', ['Chinatown'], ['https://en.wikipedia.org/wiki/Chinatown,_Singapore']),
 'singapore/bagan': ('Bagan', ['Bagan'], ['https://en.wikipedia.org/wiki/Bagan']),
 'singapore/bali': ('Bali', ['Bali'], ['https://en.wikipedia.org/wiki/Bali', 'https://en.wikipedia.org/wiki/Tanah_Lot']),
 'singapore/bangkok': ('Bangkok', ['Bangkok', 'Chao Phraya'], ['https://en.wikipedia.org/wiki/Bangkok', 'https://en.wikipedia.org/wiki/Chao_Phraya_River']),
 'singapore/cebu': ('Cebu', ['Cebu'], ['https://en.wikipedia.org/wiki/Cebu_City']),
 'singapore/chiang-mai': ('Chiang Mai', ['Chiang Mai'], ['https://en.wikipedia.org/wiki/Chiang_Mai']),
 'singapore/ipoh': ('Ipoh', ['Ipoh'], ['https://en.wikipedia.org/wiki/Ipoh']),
 'singapore/jakarta': ('Jakarta', ['Jakarta', 'Monas', 'National Monument'], ['https://en.wikipedia.org/wiki/Jakarta', 'https://en.wikipedia.org/wiki/National_Monument_(Indonesia)']),
 'singapore/kuala-lumpur': ('Kuala Lumpur', ['Kuala Lumpur', 'Petronas', 'Merdeka Square', 'Dataran Merdeka'], ['https://en.wikipedia.org/wiki/Kuala_Lumpur', 'https://en.wikipedia.org/wiki/Petronas_Towers', 'https://en.wikipedia.org/wiki/Merdeka_Square,_Kuala_Lumpur']),
 'singapore/luang-prabang': ('Luang Prabang', ['Luang Prabang'], ['https://en.wikipedia.org/wiki/Luang_Prabang']),
 'singapore/malacca': ('Malacca', ['Malacca', 'Melaka'], ['https://en.wikipedia.org/wiki/Malacca_City', 'https://en.wikipedia.org/wiki/Malacca_River']),
 'singapore/manila': ('Manila', ['Manila'], ['https://en.wikipedia.org/wiki/Manila', 'https://en.wikipedia.org/wiki/Manila_Bay']),
 'singapore/penang': ('Penang (George Town)', ['George Town', 'Penang'], ['https://en.wikipedia.org/wiki/George_Town,_Penang']),
 'singapore/phnom-penh': ('Phnom Penh', ['Phnom Penh'], ['https://en.wikipedia.org/wiki/Phnom_Penh']),
 'singapore/siem-reap': ('Siem Reap', ['Siem Reap', 'Angkor'], ['https://en.wikipedia.org/wiki/Siem_Reap']),
 'singapore/yangon': ('Yangon', ['Yangon', 'Sule Pagoda', 'Sule'], ['https://en.wikipedia.org/wiki/Yangon']),
 'singapore/yogyakarta': ('Yogyakarta', ['Yogyakarta', 'Jogja'], ['https://en.wikipedia.org/wiki/Yogyakarta']),
 'cincinnati': ('Cincinnati', ['Cincinnati'], ['https://en.wikipedia.org/wiki/Cincinnati', 'https://en.wikipedia.org/wiki/Roebling_Suspension_Bridge']),
 'wheeling': ('Wheeling', ['Wheeling'], ['https://en.wikipedia.org/wiki/Wheeling,_West_Virginia']),
}
HERO_STATED = {
 'singapore/dempsey-hill': 'wave 1 and R8 wave 5 searches found no Commons file titled or described as Dempsey Hill/Dempsey Road (the Dempsey Road category lists 3 files, none named in any result); the Dempsey Hill article has no lead image — the guide keeps its motif hero (stated)',
}
HERO_VN = ['singapore/hanoi', 'singapore/hoi-an', 'vietnam/hanoi', 'vietnam/ho-chi-minh-city', 'vietnam/hoi-an']
PILOT_HEROES = ['tokyo','cleveland','newyork','singapore/chinatown','wheeling','japan','us','singapore','belgium','germany']

cands = collections.defaultdict(list)
for line in open(f'{S}/cands.tsv', encoding='utf-8'):
    line = line.rstrip('\n')
    if not line: continue
    key, f, dep, conf, why, flags, refused = (line.split('\t') + [''] * 7)[:7]
    c = {'file': 'File:' + f, 'pageUrl': 'https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(f.replace(' ', '_'), safe="(),'!&-_.~*;:@"), 'depicts': dep, 'confidence': conf, 'reason': why}
    if flags.strip(): c['flags'] = flags.strip().split(',')
    if refused.strip(): c['refused'] = refused.strip()
    prev = next((x for x in cands[key] if x['file'] == c['file']), None)
    if prev:   # one entry per file; a later refusal (a visual review) wins over an earlier vetting, and is never undone
        if c.get('refused') and not prev.get('refused'): prev['refused'] = c['refused']
        continue
    cands[key].append(c)

# R8 run #77: a file refused for its own fault (not a slot reason) is refused for every target that lists it, so a later
# wave can never re-introduce it. Mirrors refusalIsGlobal in fetch-commons.js.
_LOCAL = re.compile(r'duplicat|same file|repeats|already|place card|is the [\w ]*hero|the [\w ]+ hero is', re.I)
_glob = {}
for _k, _cs in cands.items():
    for _c in _cs:
        if _c.get('refused') and not _LOCAL.search(_c['refused']): _glob.setdefault(_c['file'], f"{_c['refused']} (on {_k})")
for _k, _cs in cands.items():
    for _c in _cs:
        if not _c.get('refused') and _c['file'] in _glob: _c['refused'] = 'refused for another target: ' + _glob[_c['file']]

# W8: what a visitor sees first on each guide — the gallery's lead card, then its first rail row
PRIO = {}
for fn in sorted(glob.glob('beta/data/gallery/*.json')):
    g = json.load(open(fn))
    for p in (g['rows'][0][6] if g.get('rows') else []): PRIO.setdefault(f"{g['key']}#{p['id']}", 'row')
    if g.get('lead'): PRIO[f"{g['key']}#{g['lead']['id']}"] = 'lead'
recs = {}
pageCountry = {}
for fn in sorted(glob.glob('beta/data/places/*.json')):
    d = json.load(open(fn))
    pageCountry[d['key']] = d['country']
    for p in d['places']:
        recs[f"{d['key']}#{p['id']}"] = (d, p)

def wiki_of(p):
    for s in p.get('s') or []:
        if len(s) > 1 and re.match(r'^https://[a-z-]+\.wikipedia\.org/wiki/', str(s[1])): return s[1]
    return None
def names_of(key, p, art):
    n = re.sub(r'\s*\([^)]*\)', '', p['n']).strip()
    out = [n]
    for part in re.split(r'\s+[—–]\s+|\s+&\s+|,\s+', n): out.append(part)
    out = [re.sub(r'^(The)\s+', '', x) for x in out]
    out += [re.sub(r'(\w{4,})s$', r'\1', x) for x in out if re.search(r'\w{4,}s$', x)]   # "Gardens" -> "Garden"
    out += [re.sub(r'\bSt\.?\s', 'Saint ', x) for x in out if re.search(r'\bSt\.?\s', x)]   # "St. John" -> "Saint John"
    GENERIC = {'museum','beach','garden','gardens','tower','park','marina','spa','wheel','library','memorial','cathedral','fountain','bridge','castle','temple','shrine','market','rock','sight','metro','toren','center','centre','hall','house','station','square','island','lake','river','falls'}
    def distinctive(x):   # an auto-derived part must be able to name only this place
        w = x.replace('-', ' ').split()
        return x.lower() not in GENERIC and not x.startswith('-') and (len(w) >= 2 or len(x) >= 8) and not all(t.lower() in GENERIC for t in w)
    out = [out[0]] + [x for x in out[1:] if distinctive(x)]
    if p.get('nat'): out.append(p['nat'])
    if art: out.append(urllib.parse.unquote(art.split('/wiki/')[1]).replace('_', ' ').split('#')[0])
    out += NAMES.get(key, [])
    seen = []
    for x in out:
        x = x.strip()
        if x and x not in seen: seen.append(x)
    return seen

targets = []
for k in PILOT_HEROES + [k for k in HERO if k not in PILOT_HEROES]:
    lab, nm = HERO[k]
    t = {'key': f'hero:{k}', 'type': 'hero', 'depicts': f'hub:{k}', 'label': lab, 'names': nm, 'pilot': k in PILOT_HEROES or k in PILOTS,
         'searchedVia': 'WebSearch allowed_domains=[commons.wikimedia.org]', 'searched': '2026-10-11', 'candidates': cands.pop(f'hero:{k}', [])}
    if k in HERO_ARTICLES:
        t['articles'] = HERO_ARTICLES[k][2]; t['wikiLead'] = True
        for n in HERO_ARTICLES[k][1]:
            if n not in t['names']: t['names'].append(n)
    if not t['candidates'] and not t.get('articles'): t['note'] = 'no candidate this wave (gap stated)'
    targets.append(t)
for k, (lab, nm, arts) in HERO_ARTICLES.items():
    if k in HERO: continue
    targets.append({'key': f'hero:{k}', 'type': 'hero', 'depicts': f'hub:{k}', 'label': f'{lab} — guide hero', 'names': nm, 'pilot': k in PILOTS,
      'searchedVia': 'Wikipedia article lead image (resolved and checked on the runner) + WebSearch allowed_domains=[commons.wikimedia.org]', 'searched': '2026-10-11', 'articles': arts, 'wikiLead': True, 'candidates': cands.pop(f'hero:{k}', [])})
    if k in HERO_STATED: targets[-1]['skip'] = HERO_STATED[k]
for k in HERO_VN:
    targets.append({'key': f'hero:{k}', 'type': 'hero', 'depicts': f'hub:{k}', 'label': f'{k} — guide hero', 'names': [k.split('/')[-1].replace('-', ' ').title()], 'pilot': False,
      'skip': 'Vietnam has no freedom of panorama — the guide keeps its motif hero (stated)', 'candidates': []})

landmarks = []
for key, (d, p) in recs.items():
    # tier-1 and first-row places always; any other place once a candidate wave vetted titles for it (R8 gap #1c)
    # D-49: a food place becomes a target only once a wave vetted titles that identify THAT place (never generic stock)
    if d['country'] == 'vietnam' or (p['kind'] == 'food' and f'landmark:{key}' not in cands) or (p.get('t') != 1 and key not in PRIO and f'landmark:{key}' not in cands) or 'CLOSED' in p['n']: continue
    g = set(p.get('g') or [])
    art = wiki_of(p)
    pilot = d['key'] in PILOTS
    t = {'key': f'landmark:{key}', 'type': 'landmark', 'depicts': key, 'label': p['n'], 'names': names_of(key, p, art), 'pilot': pilot}
    if art: t['article'] = art
    if g & VENUE and p['kind'] != 'food':   # D-49: a food place is its own subject; venue tags rule out SIGHTS only
        t['skip'] = f"venue ({', '.join(sorted(g & VENUE))}) — never a photo"
    elif key in SKIP:
        t['skip'] = SKIP[key]
    elif VENUE_NAME.search(p['n']):
        t['skip'] = f"venue ({VENUE_NAME.search(p['n']).group(1).lower()}) — never a photo (named so; W8 guard for records without a venue tag)"
    elif BRAND_STORE.search(p['n']):
        t['skip'] = 'brand store — its signage and branding are the subject; never a photo (W8 gap stated)'
    elif re.match(r'Pok[eé] Lid', p['n']):
        t['skip'] = 'Poké Lid manhole cover: copyrighted character artwork, and Japan has no freedom of panorama for art (W8 gap stated)'
    if key in PRIO: t['priority'] = PRIO[key]
    if art and 'skip' not in t and p['kind'] != 'food': t['wikiLead'] = True   # D-49: food only from vetted, identifying titles
    c = cands.pop(f'landmark:{key}', [])
    if c:
        t.update({'searchedVia': 'WebSearch allowed_domains=[commons.wikimedia.org]', 'searched': '2026-10-11'})
    t['candidates'] = c
    if c and 'skip' in t: print('WARN candidates on skipped', key)
    landmarks.append(t)
landmarks.sort(key=lambda t: ({'lead': 0, 'row': 1}.get(t.get('priority'), 2), not t['pilot'], PILOTS.index(t['depicts'].split('#')[0]) if t['pilot'] else 0, t['depicts']))
targets += landmarks
assert not cands, f'unmatched candidate keys: {list(cands)}'

RANK = {'high': 3, 'med': 2, 'low': 1}
cc = collections.Counter(c['confidence'] for t in targets for c in t['candidates'])
summ = {
 'targets': len(targets),
 'byType': dict(collections.Counter(t['type'] for t in targets)),
 'heroes': {'targets': sum(t['type'] == 'hero' for t in targets), 'withHigh': sum(t['type'] == 'hero' and any(c['confidence'] == 'high' for c in t['candidates']) for t in targets)},
 'pilotLandmarks': {'targets': sum(t['type'] == 'landmark' and t['pilot'] for t in targets), 'skipped': sum(t['type'] == 'landmark' and t['pilot'] and 'skip' in t for t in targets), 'withHigh': sum(t['type'] == 'landmark' and t['pilot'] and any(c['confidence'] == 'high' for c in t['candidates']) for t in targets)},
 'otherLandmarks': {'targets': sum(t['type'] == 'landmark' and not t['pilot'] for t in targets), 'skipped': sum(t['type'] == 'landmark' and not t['pilot'] and 'skip' in t for t in targets), 'withArticle': sum(t['type'] == 'landmark' and not t['pilot'] and 'skip' not in t and 'article' in t for t in targets)},
 'candidates': {'total': sum(cc.values()), **{k: cc.get(k, 0) for k in ('high', 'med', 'low')}},
 'targetsWithHigh': sum(any(c['confidence'] == 'high' for c in t['candidates']) for t in targets),
 'gaps': [t['key'] + ' — ' + (t.get('skip') or t.get('note')) for t in targets if t['pilot'] and not t['candidates'] and ('gap' in (t.get('skip') or t.get('note') or ''))],
}
man = {
 '_doc': "Wikimedia Commons CANDIDATE manifest (research only — nothing here is downloaded or shown). Built by the imagery lane from WebSearch results restricted to commons.wikimedia.org, because this sandbox's network policy blocks the Wikimedia hosts. Every File: title is copied from a search result (or a Commons category listing a result showed); nothing is guessed. confidence 'high' = the file title (or its description, as the result showed it) names that exact place; 'med' = a description or category points to it but the title is generic or the photo may not show the place today; 'low' is never recorded. A candidate is a lead, not a verdict: tools/beta/imagery/fetch-commons.js re-reads every file from the Commons API on a GitHub runner (licence, author, description, categories, size) and refuses anything that is not a free licence or whose title/description/categories do not name the place. Targets without candidates that cite a Wikipedia article may be resolved from that article's lead image with --wiki-lead (same checks). Never: food places, venues, closed places, Vietnam. How-to: design/beta/IMAGERY.md § Commons.",
 'v': 1, 'searched': '2026-10-11',
 'licencePolicy': 'CC0, public domain, CC BY, CC BY-SA (any version, any port). NC and ND refused. GFDL-only refused. Credit (TASL) shown wherever the photo appears.',
 'fields': {
  'key': 'hero:<page|country> | landmark:<page>#<record id>',
  'type': 'hero = city/town/country hub scene (a slot, not a record); landmark = one tier-1 sight record',
  'names': 'phrases a file title, description or category must contain (compared without spaces, punctuation or diacritics) for the fetch to keep it',
  'priority': "W8: 'lead' = the guide's lead card, 'row' = its first rail row (what a visitor sees first) — fetched right after the heroes",
  'articles': "W8 heroes: Wikipedia articles whose lead images are tried in order (the town, then an iconic sight)",
  'wikiLead': "W8: when no candidate passes, try the lead image of the record's cited Wikipedia article (same licence, depicts, subject and author checks) without --wiki-lead",
  'pilot': 'true for the pilot pages (Tokyo, Cleveland, New York, Chinatown SG, Wheeling) and the five live country hubs — fetched first',
  'article': "the record's cited Wikipedia article (for --wiki-lead)",
  'skip': 'why this target never gets a photo (venue, modern public art, interior exhibit) or a stated gap',
  'candidates[].file': 'the Commons file title exactly as returned (File:…)',
  'candidates[].pageUrl': 'its Commons file page',
  'candidates[].depicts': 'what the result says the photo shows',
  'candidates[].confidence': 'high | med',
  'candidates[].reason': 'why that confidence',
  'candidates[].refused': 'set after a person looked at the fetched photo: why it is never used again (the fetch skips it)',
  'candidates[].flags': 'people-visible, public-art-check (no freedom of panorama for modern public art in the US/JP), venue-check, panorama (360° file), outdated (the place has changed), author-check — the fetch skips a flagged candidate unless --allow-flag names it',
 },
 'summary': summ,
 'rules': {'_doc': 'the photo rules other fetchers apply to places with no target here (fetch-openverse.js)', 'venueTags': sorted(VENUE), 'venueName': VENUE_NAME.pattern, 'brandStore': BRAND_STORE.pattern},
 'targets': targets,
}
json.dump(man, open('beta/assets/img/commons-candidates.json', 'w'), ensure_ascii=False, indent=1)
open('beta/assets/img/commons-candidates.json', 'a').write('\n')
print(json.dumps(summ, indent=1, ensure_ascii=False))
