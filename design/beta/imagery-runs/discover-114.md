# Discovery review: run #114 (Commons cm-93…cm-148; Openverse 80 picks)

Reviewed 2026-10-17 for the orchestrator, from the contact sheets that commit 24dcb7bc9 kept:
`commons-discovered/2026-10-171259-sheet-1..5.jpg` (56 new picks) and `openverse/2026-10-171315-sheet-1..7.jpg`
(80 picks, every one still pending; there was no `openverse-review.tsv` yet). Where a tile was unclear, the JSON
entry and the place's own record were read as well. Rules: one photo per place, keeping the best. Refuse animals,
people or crowds, vehicles (D-56 cable-car exception only), signage, single exhibits, details, interiors that aren't
the attraction, views FROM the place, US sculpture and 2D art, Japanese artworks, a different place, generic scenes,
stock food, D-56 venue branding, undated historic prints (D-50), low quality, NC/ND licences, and unnamed authors
outside D-52.

Verdicts: `tools/beta/imagery/manifest/discover-review.tsv` (Commons) and `tools/beta/imagery/manifest/openverse-review.tsv` (Openverse).

| source | ok | refused | total |
|---|---|---|---|
| Commons discovery | 26 | 30 | 56 |
| Openverse | 9 | 71 | 80 |

**Commons ok:** cm-93 Otaru Canal, cm-94 Demachi Masugata, cm-96 Centre Market, cm-98 Palais de Justice,
cm-100 Over-the-Rhine, cm-101 German Village, cm-103 Broad Ripple, cm-104 Kennin-ji, cm-112 Düsseldorf Altstadt,
cm-113 Museum Kunstpalast, cm-117 Abtei Brauweiler, cm-123 Burg Landshut, cm-125 Villa Montalvo, cm-127 The Tech,
cm-130 The Wharf, cm-131 Grashaus, cm-134 St. Foillan, cm-135 Puppenbrunnen, cm-137 Jekerkwartier (Helpoort),
cm-140 Kasteel Vaalsbroek, cm-141 Gemeentegrot, cm-142 Kupferhof Rosenthal, cm-143 Quaker Square, cm-145 Quail Hollow,
cm-147 MAPS Air Museum, cm-148 Haines House.

`--apply-review` wrote 53 lines to `manifest/cands.tsv`: 23 ok and all 30 refusals. cm-100, cm-125 and cm-127 were
already vetted `high` candidates from wave 6, so their lines were skipped as duplicates.

**Openverse ok:** ov-d976967c Basilica of the Holy Blood, ov-f485f665 National Civil War Museum, ov-2bf68e34 Bay of Pigs
Museum, ov-7c5cfbc2 Malay Film Productions studio, ov-76726a94 Couven-Museum, ov-de579bf5 Burg Frankenberg,
ov-5f6c1040 Adrienne Arsht Center, ov-9b0a800f Meguro River, ov-e666b4f3 Takeshita-dōri.

## Refusals by reason

Openverse ids are shortened to their first 8 hex digits here. The TSV holds the full ids and the exact reasons.

**Commons (30)**
- Different place, or the photo belongs to another target (5): cm-105 (Kinkaku-ji, not Tō-ji), cm-106 (a downtown Miami skyline; second pick to ov-5f6c1040), cm-107 (Naha Traditional Craft Center, not Kokusai-dōri), cm-136 (the same Grashaus file as cm-131, not the Fischmarkt), cm-146 (downtown Kent, not Brady's Leap).
- Doesn't show or identify the place (7): cm-108 (a survey marker), cm-110 (a light ring on the canal), cm-114 (one stall's potatoes), cm-115 (the 2019 construction site), cm-118 (a magnolia leaf), cm-139 (a derelict wall with graffiti), cm-144 (one mausoleum).
- Exhibits inside (4): cm-97, cm-111, cm-120, cm-122.
- Interior (2): cm-99 (the nave), cm-126 (a gallery of modern paintings, US 2D art).
- Low quality or framing (4): cm-109 (a 2048×396 panorama), cm-119 (column hidden behind trees and a Ferris wheel), cm-121 (mostly sky and gravel), cm-132 (a sunset silhouette).
- People or crowd (3): cm-116, cm-128, cm-129 (a crowd; ov-e666b4f3 is the pick).
- Signage or branding (2): cm-95 (the Radio Kaikan facade), cm-124 (the Ghirardelli sign).
- A monument or sculpture is the subject (2): cm-102, cm-133.
- No named author (1): cm-138 ("Unknown author", CC BY-SA, not a D-52 row).

**Openverse (71)**
- Doesn't show or identify the place, or a name match only (13): e2082135, 55aee847, 975c8e73, 1b8279ea (recycling dumpsters), 9d9c6b61, 6ab7578e (an airport booth), cbc1212b, 3e8c87bb, f5e3cdfb ("Mosaico"), 891d46ca, 45fea7d5 (police cameras), 47e6625f, a3412283 (a theme-park Christmas lamppost).
- Signage or branding (10): 3301c96a, e3c46a69, 54f4c88f, c4971d4e, 30533eb6 (Radio Kaikan), c3e4b537 (Glico), 7e1857f2, 07bebbbf, 392f226d, 6862d6d6.
- Exhibits inside or interior (9): 4801b14e, 9d560c9e, 6f31b87d, 765e40d7, c56a5272, fba863be, 6d32cdce, e5bd3f76, 2b7654b1.
- Art (8): US sculpture fce1b7b8 (a mural), d4f8e0ea, 583118f0, 2fc3b719; installation 238397c2; graffiti 4fa831c0, c6d0933b; a statue is the subject 27c40588.
- Low quality, a detail or a generic landscape (8): 74b70813, ff8b919a (sunsets), 0a79996f (treetops), fe67716c (daffodils), 9781a2ff, 7f8e9acb (dark night shots), 2e7cdafe (a tight crop of the archway), d19f3272 (the gate small at the end of the street).
- Animals (7): 837b341f, 4666e8cd, 5fcc3ac5, 962b79d6, e9eadfcf, 9b174f5a, e6e0f269.
- People (7): 3b101528, 5a9ead16, 9a03fedf, 85105c3e, 2ab3a3cd, a1d56622, c031fc08.
- A better pick for this place (7): 31229cf5 → d976967c; c57d7c38 → 76726a94; 790165ee → cm-93; e7ae7e2c → cm-96; 8b98c1dc → cm-98; cdd04a40 → cm-100; 6d43442e → cm-101.
- Vehicles (2): 63c390f7, 27e88d11 (trolleys).

## Calls to check

1. **Our Lady of Sorrows** (cm-99 and ov-2b7654b1): refused as interiors, in line with wave 6's stated gap ("only details/interiors"). However, the record sells the gold-leafed barrel vault (WTTW "sacred spaces"), so the nave may count as the interior attraction. If you take that view, approve cm-99 (landscape, the whole nave) and keep the Openverse pick refused as the second pick.
2. **The Wharf** (cm-130, ok): a high-rise view down onto the marina and a rooftop pool, taken from one of the Wharf's own buildings. It could be read as a view FROM the place. The target already has two `high` Commons candidates, so this pick is a fallback.
3. **Takeshita-dōri** (ov-e666b4f3, ok): the street's entrance arch is a name sign with decorative balloon art (Japan has no freedom of panorama for artworks), and there are passers-by in the foreground.
4. **Demachi Masugata Shōtengai** (cm-94, ok): the arcade entrance with its name board. I treated the arcade as a street, not a D-56 mall.
5. **Düsseldorf Altstadt** (cm-112, ok): the Jan-Wellem equestrian statue (1711, public domain) is centred in front of the Rathaus on the Marktplatz.
6. **Puppenbrunnen** (cm-135, ok): the fountain itself is the place. It is a 1975 artwork by Bonifatius Stirnberg, so this approval relies on German freedom of panorama (§59 UrhG).
7. **Quail Hollow** (cm-145) and the **National Civil War Museum** (ov-f485f665), both ok: the building is clear, but sky and ground (snow, lawn) take more than half the frame.
8. **The place is the sign or the art.** Akihabara Radio Kaikan (cm-95, ov-30533eb6), the Glico Running Man (cm-110, ov-c3e4b537) and the Werregarenstraat graffiti alley (ov-4fa831c0, ov-c6d0933b) are all refused, and any photo of these places would hit the same rule. Consider stating them as rule gaps.
9. **Trolley and railroad museums**: ov-63c390f7 and ov-27e88d11 (Pennsylvania Trolley Museum) and ov-765e40d7 (Gold Coast Railroad Museum) are refused under the vehicle rule. A car on the museum's own line is close to the D-56 cable-car case, if you want to extend that exception.
10. **Borderline framing refusals**: cm-121 (Mémorial de Verdun: a 3:2 centre crop might be acceptable), ov-d19f3272 (Marschiertor in snow), ov-2e7cdafe (Ponttor archway at dusk), ov-9781a2ff (Nihonbashi lamp pillar at night), ov-e3c46a69 (Coney Island trail behind a signpost), cm-144 (Glendale: a single mausoleum).
11. **Gëlle Fra** (cm-119): refused for framing. Note that the statue (Claus Cito, d. 1965) is still in copyright, so any future photo needs a check on Luxembourg's freedom of panorama.

## Notes for the imagery lane

- **Global and local refusals.** `fetch-commons.refusalIsGlobal()` treats a Commons refusal as global, which blocks that file for every target, unless the reason contains "second pick", "same file", "already", "duplicat" or "repeats". The reasons for the target-relative refusals (cm-99, cm-105, cm-106, cm-136, cm-146) are worded to stay local. Unwritten, cm-105 failed the "no credited photo is a refused file" check, because its file is Kinkaku-ji's credited photo, and cm-136 would have killed cm-131. A bare "a better pick for this place: …" reads as global.
- **Records cite the wrong Wikipedia article.** Tō-ji cites the group article "Historic Monuments of Ancient Kyoto", whose P18 is Kinkaku-ji, and Brady's Leap cites "Kent, Ohio". Any `wikiLead` fetch for these two records will try the wrong lead image.
- **`commons-candidates.json`.** test-imagery requires every refusal in `cands.tsv` to reach the manifest, so the manifest had to be rebuilt. After merging imagery's own rebuild from origin (1434c55e8, with the 4 lifted skips), `python3 tools/beta/imagery/manifest/build_manifest.py` was run once more. Only the 53 targets these rows touch changed: all 26 ok picks are live candidates and all 30 refusals are recorded.
- **Approved Commons picks are `med`.** The workflow runs `fetch-commons.js` without `--min`, so the default is `high`. These picks (and run #95's) are fetched only by a `--min med` run, or wherever a `high` candidate for the same place fails first.
- **Places with both an Openverse ok and a live vetted Commons candidate:** Holy Blood, Malay Film studio, Couven, Burg Frankenberg and Meguro River. One photo per place is enforced at credit time, so whichever credits first wins.

## Orchestrator calls on the flagged items (2026-10-17 14:00Z)

1. **Our Lady of Sorrows (cm-99): approve in principle.** A basilica whose nave is the attraction may show the nave as a space (not an exhibit or a detail). The target is still on imagery's wave-6 skip list ("only details/interiors"), so imagery lifts that skip, then flips cm-99 to ok. Until then it stays refused, so the photo gate never sees a credit on a skipped target.
2. **The Wharf (cm-130): stays ok.** An aerial view onto the marina shows the place, not a view from it.
3. **Takeshita-dōri (ov-e666b4f3): refused.** The arch's name sign and its balloon art are the subject; Japan has no FoP for art. This is consistent with imagery's earlier crowd refusals.
4. **Demachi arcade (cm-94):** ok as a street.
5. **Düsseldorf Altstadt (cm-112):** ok; the 1711 statue is public domain.
6. **Puppenbrunnen (cm-135):** ok; Germany's §59 UrhG covers permanent public works.
7. **Quail Hollow (cm-145) and Civil War Museum (ov-f485f665):** ok. The place is identifiable, and the cover crop centres it.
8. **Radio Kaikan, the Glico sign, the Werregarenstraat graffiti alley:** the place is the sign or the art itself. Imagery states them as rule gaps ("the place is signage/art; never a photo").
9. **Trolley and railroad museums:** stay refused. D-56's cable-car exception covers an NHL structure in service. For a museum the subject is the museum, so an exterior of the building is fine.
10. **The borderline framing refusals** stand.
