# W6 status evidence (2026-10-03 closure sweep) — applied to geo/_geoout_w6a.json + _geoout_w6pin.json
import json
ST={
 "Bulla Gastrobar":"Open — 2026 menu/events (resident.com 2026-07-09 https://resident.com/amp/story/food-and-drink/2026/07/09/bulla-gastrobars-new-summer-menu-leans-into-spains-coast)",
 "Primo by Melissa Kelly":"Open — Forbes Travel Guide JW Marriott Grande Lakes listing (Primo led by Melissa Kelly) https://forbestravelguide.com/hotels/orlando-florida/jw-marriott-orlando-grande-lakes",
 "Cedar's Restaurant":"Open — diner reviews Jul/Aug 2026 (OpenTable listing), RG listing active",
 "Chatham's Place":"Open — Tue-Sat dinner per Scott Joseph listing https://scottjosephorlando.com/magical-dining-month-chathams-place/; Waze place active",
 "Cress Restaurant":"Open — 2025 DiRoNA + Wine Spectator, lunch/dinner Tue-Sat https://dirona.com/cress-restaurant",
 "Burton's Bar":"Open — restaurantguru active listing 'Burton's Thornton Park' https://restaurantguru.com/Burtons-Thornton-Park-Orlando",
 "Wall Street Plaza":"Open — venues being revamped by owner Bosko Lazic, plaza operating (WFTV https://www.wftv.com/news/local/wall-street-plaza-revival-bosko-lazic-has-plan/PAF2W72TPBHTDNHOH5FYPDSPDI)",
}
for p in ("geo/_geoout_w6a.json","geo/_geoout_w6pin.json"):
    L=json.load(open(p))
    for r in L:
        if r["n"] in ST: r["statusSource"]=ST[r["n"]]
    json.dump(L,open(p,"w"),indent=1,ensure_ascii=False)
