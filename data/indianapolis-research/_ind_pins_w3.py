# W3 pin stage (2026-10-03): Waze live-map place records (place.w.* / ChIJ…) returned by WebSearch
# (allowed_domains waze.com / usarestaurants.info / foursquare.com, "<name> <address> latitude longitude").
# Each pin = the coordinate WebSearch reported for the Waze place whose name+street address match the record.
# high = Waze place record name+address match; med = listing page / building point. Writes geo/_geoout_w3pins.json,
# copying address/status from the existing geoout entry (geo-merge never lets UNVERIFIED clobber these).
import json, glob, os
D=os.path.dirname(os.path.abspath(__file__))
WZ="https://www.waze.com/live-map/directions/"
PINS={
 "Harry & Izzy's":(39.764530791,-86.15985228,WZ+"harry-and-izzys-south-illinois-street-153-indianapolis?to=place.w.179437966.1794641800.1971549","high"),
 "Shapiro's Delicatessen":(39.756198883,-86.159591674,WZ+"shapiros-delicatessen-s-meridian-st-808-indianapolis?to=place.w.179437966.1794641800.919597","high"),
 "Workingman's Friend":(39.769523958,-86.19708371,WZ+"working-mans-friend-n-belmont-ave-234-indianapolis?to=place.w.179437966.1794379657.1551483","high"),
 "Hollyhock Hill":(39.904964447,-86.14691925,WZ+"hollyhock-hill-n-college-ave-8110-indianapolis?to=place.w.179503503.1794707350.2659714","high"),
 "Red Key Tavern":(39.846767425,-86.146095275,WZ+"red-key-tavern-n-college-ave-5170-indianapolis?to=place.w.179503502.1794707345.2639029","high"),
 "Historic Steer-In":(39.7818043,-86.0823997,"usarestaurants.info listing "+"https://usarestaurants.info/explore/united-states/indiana/marion-county/warren-township/indianapolis/880492-steer-in.htm","med"),
 "Iaria's Italian Restaurant":(39.761939311,-86.14570926,WZ+"iarias-italian-restaurant-south-college-avenue-317-indianapolis?to=place.w.179503502.1794707336.1981107","high"),
 "Tinker Street":(39.788608551,-86.150413513,WZ+"tinker-street-e-16th-st-402-indianapolis?to=place.w.179437966.1794707339.2934178","high"),
 "Vida":(39.7708984,-86.147056,"usarestaurants.info/foursquare listing https://usarestaurants.info/explore/united-states/indiana/marion-county/center-township/indianapolis/vida-317-420-2323.htm","med"),
 "Bluebeard":(39.7575636,-86.1457879,"usarestaurants.info listing https://usarestaurants.info/explore/united-states/indiana/marion-county/center-township/indianapolis/623292-bluebeard.htm","med"),
 "Beholder":(39.7816033,-86.1268671,"usarestaurants.info listing https://usarestaurants.info/explore/united-states/indiana/marion-county/center-township/indianapolis/973068-beholder.htm","med"),
 "His Place Eatery":(39.811375585,-86.046910867,WZ+"his-place-eatery-e-30th-st-6916-indianapolis?to=place.w.179569038.1795362701.4880404","high"),
 "Plump's Last Shot":(39.873144925,-86.142655047,WZ+"plumps-last-shot-cornell-ave-6416-indianapolis?to=place.w.179503503.1794772883.3306159","high"),
 "Che Chori":(39.7881543,-86.2116976,"usarestaurants.info listing https://usarestaurants.info/explore/united-states/indiana/marion-county/wayne-township/indianapolis/che-chori-317-737-2012.htm","med"),
 "Pots & Pans Pie Co.":(39.8433409,-86.1454564,WZ+"us/in/indianapolis/pots-and-pans-pie-co.?to=place.ChIJj50F7TtTa4gRgPFzSJWoMwo","high"),
 "Oakleys Bistro":(39.9140216,-86.1852097,"usarestaurants.info listing https://usarestaurants.info/explore/united-states/indiana/marion-county/washington-township/indianapolis/980620-oakleys-bistro.htm","med"),
 "King Dough":(39.7739265,-86.1374303,WZ+"united-states/indiana/indianapolis/king-dough?to=place.ChIJTabQw9ZRa4gReasygKK4ps8","high"),
 "Saigon Restaurant (Pho Saigon)":(39.824382781,-86.239685058,WZ+"saigon-vietnamese-restaurant-w-38th-st-4760-indianapolis?to=place.w.179437966.1794117518.1329675","high"),
 "Four Day Ray Brewing":(39.95818,-86.013701,"usarestaurants.info listing https://usarestaurants.info/explore/united-states/indiana/hamilton-county/delaware-township/fishers/207355-four-day-ray-brewing.htm","med"),
 "The Jazz Kitchen":(39.8508413,-86.1455825,WZ+"us/in/indianapolis/the-jazz-kitchen?to=place.ChIJFZvWC8ZTa4gRVPAjkaseMos","high"),
 "Kountry Kitchen Soul Food Place":(39.7919657,-86.1445299,WZ+"kountry-kitchen-soul-food-place-n-college-ave-1831-indianapolis?to=place.w.179503502.1794772875.6689751","high"),
 "Guggman Haus Brewing Co.":(39.790534698,-86.182464022,WZ+"guggman-haus-brewing-co.-gent-ave-1701-indianapolis?to=place.w.179437966.1794510731.7171910","high"),
 "Metazoa Brewing Co.":(39.764208764,-86.145938776,WZ+"metazoa-brewing-company-s-college-ave-140-indianapolis?to=place.w.179503502.1794707336.3119058","high"),
 "Strange Bird":(39.7680272,-86.0708582,WZ+"us/in/indianapolis/strange-bird?to=place.ChIJJx9xonFPa4gREQbY3SveYjE","high"),
 "Prime 47":(39.765858333,-86.156057594,WZ+"prime-47-s-pennsylvania-st-indianapolis?to=place.w.179437966.1794641801.2258443","high"),
 "Iozzo's Garden of Italy":(39.754245758,-86.159324645,WZ+"iozzos-garden-of-italy-s-meridian-st-946-indianapolis?to=place.w.179437966.1794641799.2358425","high"),
 "Spoke & Steele":(39.7650904,-86.1597897,"usarestaurants.info listing https://usarestaurants.info/explore/united-states/indiana/marion-county/center-township/indianapolis/spoke-steele-317-737-1616.htm","med"),
 "Taxman CityWay":(39.762911102,-86.154800057,WZ+"taxman-cityway-s-delaware-st-310-indianapolis?to=place.w.179437966.1794707336.6992432","high"),
 "The Hulman":(39.7666747,-86.1547474,WZ+"us/in/indianapolis/hotel-indy,-indianapolis,-a-tribute-portfolio-hotel?to=place.ChIJ_2-1kbtQa4gRr_GEnIxzVmI","med","restaurant is inside Hotel Indy; pin = hotel place record"),
 "Cannon Ball Rooftop Lounge":(39.7666747,-86.1547474,WZ+"us/in/indianapolis/hotel-indy,-indianapolis,-a-tribute-portfolio-hotel?to=place.ChIJ_2-1kbtQa4gRr_GEnIxzVmI","med","rooftop bar on Hotel Indy's 6th floor; pin = hotel place record"),
 "The Eagle's Nest":(39.76630887,-86.161425018,WZ+"hyatt-regency-indianapolis-south-capital-avenue-1?to=place.w.179437966.1794641801.473656","med","revolving restaurant atop the Hyatt Regency; pin = hotel place record"),
 "Bazbeaux Pizza":(39.771449095,-86.153600307,WZ+"bazbeaux-pizza-massachusetts-ave-329-indianapolis?to=place.w.179437966.1794707337.1683967","high"),
 "Bru Burger Bar":(39.773268581,-86.15211439,WZ+"bru-burger-bar-massachusetts-ave-410-indianapolis?to=place.w.179437966.1794707337.875261","high"),
 "Bakersfield Mass Ave":(39.7719812,-86.1535945,WZ+"us/in/indianapolis/bakersfield-mass-ave?to=place.ChIJ37cxAMxRa4gRbTPVUh29Rzo","high"),
 "St. Joseph Brewery & Public House":(39.774952,-86.1456397,"usarestaurants.info listing https://usarestaurants.info/explore/united-states/indiana/marion-county/center-township/indianapolis/st-joseph-brewery-317-602-5670.htm","med"),
 "Tea's Me Cafe":(39.8269882,-86.1588668,WZ+"us/in/indianapolis/teas-me-community-cafe?to=place.ChIJD7amoN5Ra4gRRUEbYPqq95s","high"),
 "Napoli Villa":(39.721790107,-86.090785819,WZ+"napoli-villa-main-st-758-beech-grove?to=place.w.179503501.1795100548.4070392","high"),
 "The Suds":(39.611289999,-86.11085,WZ+"the-suds-market-plaza-350-greenwood?to=place.w.179503500.1794969465.4788156","high"),
 "Revery":(39.613571166,-86.109481811,WZ+"revery-w-main-st-299-greenwood?to=place.w.179503500.1794969465.3326101","high"),
 "Brozinni Pizzeria":(39.638958448,-86.083979279,WZ+"brozinni-pizzeria-s-emerson-ave-8810-indianapolis?to=place.w.179503500.1795166076.1424261","high"),
 "Burmese Restaurant":(39.6640179,-86.127262,WZ+"us/in/indianapolis/burmese-restaurant?to=place.ChIJ845DiIRca4gRJydhUdCPhmc","high"),
 "Anthony's Chophouse":(39.9782292,-86.12996,"usarestaurants.info listing https://usarestaurants.info/explore/united-states/indiana/hamilton-county/clay-township/carmel/120058-anthony-s-chophouse.htm","med"),
 "Cheeky Bastards":(39.9348684,-85.9512715,"usarestaurants.info listing https://usarestaurants.info/explore/united-states/indiana/hamilton-county/fall-creek-township/indianapolis/cheeky-bastards-restaurant-bar-317-410-8633.htm","med"),
 "The Med":(39.7709474,-86.0715593,"usarestaurants.info listing https://usarestaurants.info/explore/united-states/indiana/marion-county/warren-township/indianapolis/the-med-317-550-2512.htm","med"),
 "Rock-Cola 50s Cafe":(39.759208679,-86.068817138,WZ+"rock-cola-cafe-s-brookville-rd-5730-indianapolis?to=place.w.179503502.1795231624.2512551","high"),
 "Dawson's on Main":(39.786137679,-86.241246936,WZ+"dawsons-on-main-main-st-1464-speedway?to=place.w.179437966.1794117515.1650788","high"),
 "Siam Square":(39.75437102,-86.141864537,WZ+"siam-square-virginia-ave-936-indianapolis?to=place.w.179503502.1794772871.904224","high"),
 "La Margarita":(39.7595986,-86.1479183,WZ+"rook-virginia-ave-501-indianapolis?to=place.w.179503502.1794707336.5027016","med","shared building 501 Virginia Ave (Slate apartments); pin = Waze place of a co-located storefront at the same address"),
 "Monti Aperitivo & Cucina":(39.7519004,-86.1399961,WZ+"united-states/indiana/indianapolis/pioneer?to=place.ChIJm9x0unhaa4gR_Tyj9RmcxTw","med","same storefront (1110 Shelby St); Waze place still carries the previous tenant's name (Pioneer)"),
 "Al-Rayan Restaurant & Bakery":(39.823066,-86.2426834,WZ+"al-rayan-w-38th-st-4873-indianapolis?to=place.w.179437966.1794117518.2341561","med","Waze/listing give 4873 W 38th St vs record 4857 — same strip; near-miss street number"),
 "King Wok":(39.8301078,-86.2418096,"Waze place records at 4150 Lafayette Rd (shared plaza) "+WZ+"us/in/indianapolis/karachi-kabab?to=place.ChIJnxTerXRXa4gRNRw0VYlb2jo","med","plaza address 4150 Lafayette Rd; pin = co-located Waze place"),
}
if __name__=="__main__":
    prev={}
    for f in sorted(glob.glob(os.path.join(D,"geo","_geoout_*.json"))):
        if f.endswith("_w3pins.json"): continue
        for g in json.load(open(f,encoding="utf-8")): prev[g["n"]]=g
    out=[]
    for n,(lat,lng,src,conf,*note) in PINS.items():
        p=prev[n]  # KeyError = name mismatch, fail loudly
        d={"n":n,"address":p["address"],"lat":lat,"lng":lng,"geoSource":"Waze live-map place record "+src,"confidence":conf,
           "status":p.get("status","open"),"statusSource":p.get("statusSource","")}
        if note: d["note"]=note[0]
        out.append(d)
    json.dump(out,open(os.path.join(D,"geo","_geoout_w3pins.json"),"w",encoding="utf-8"),indent=1,ensure_ascii=False)
    print("pins",len(out))
