import json, subprocess
def dms(s):
    p=[float(x) for x in s.split()]; return round(p[0]+p[1]/60+p[2]/3600,6)
U="https://whc.unesco.org/en/list/688/maps"; N="https://whc.unesco.org/en/list/870/maps"
W="https://en.wikipedia.org/wiki/Historic_Monuments_of_Ancient_Kyoto_(Kyoto,_Uji_and_Otsu_Cities)"
rows=[ # n, area, address, lat dms, lng dms, conf, w, g, t, url
("Kamigamo Shrine (Kamo-wake-ikazuchi Jinja)","KITA","Kamigamo, Kita-ku, Kyoto, Japan","35 3 37.9","135 45 11.6","high",
 "One of Kyoto's oldest Shinto shrines, older than the city itself, with its two sand cones (tatesuna) before the Hosodono hall; UNESCO-listed component 688-001.",["UNESCO","TEMPLE","NATURE"],1,U),
("Shimogamo Shrine (Kamo-mioya Jinja)","SAKYO","Shimogamo, Sakyō-ku, Kyoto, Japan","35 2 19.54","135 46 24.75","high",
 "Ancient shrine at the meeting of the Kamo and Takano rivers, reached through the Tadasu-no-Mori primeval forest; UNESCO-listed component 688-002.",["UNESCO","TEMPLE","NATURE","FREE"],1,U),
("Tō-ji (Kyō-ō-gokoku-ji)","FSHMI","Kujō-chō, Minami-ku, Kyoto, Japan","34 58 50.58","135 44 52.1","high",
 "Founded in 796 as the guardian temple at the old capital's south gate; its five-storey pagoda is Japan's tallest wooden pagoda, and a flea market fills the grounds on the 21st of each month. UNESCO 688-003.",["ICON","UNESCO","TEMPLE","MKT"],1,U),
("Enryaku-ji (Mount Hiei)","KYFU","Sakamoto-honmachi, Ōtsu, Shiga, Japan","35 4 14.46","135 50 29.02","med",
 "Head temple of Tendai Buddhism, founded on Mount Hiei in 788 and spread across the forested summit above Lake Biwa; UNESCO 688-005 (coordinate is the property centre of a 498 ha precinct).",["UNESCO","TEMPLE","NATURE","VIEW"],1,U),
("Daigo-ji","FSHMI","Daigo, Fushimi-ku, Kyoto, Japan","34 57 3.04","135 49 10.41","high",
 "Vast Shingon temple complex whose five-storey pagoda (951) is the oldest building in Kyoto; Toyotomi Hideyoshi's famous cherry-blossom party was held here. UNESCO 688-006.",["UNESCO","TEMPLE","GARDEN","NATURE"],1,U),
("Ninna-ji","RKSAI","Omuro, Ukyō-ku, Kyoto, Japan","35 1 52.44","135 42 50.87","high",
 "Former imperial temple (founded 888) known for its late-blooming Omuro dwarf cherry trees and five-storey pagoda; UNESCO 688-007.",["UNESCO","TEMPLE","GARDEN"],2,U),
("Byōdō-in","UJI","Uji-renge, Uji, Kyoto, Japan","34 53 22.02","135 48 27.6","high",
 "The 11th-century Phoenix Hall pictured on the 10-yen coin, reflected in its Pure Land garden pond; UNESCO 688-008.",["ICON","UNESCO","TEMPLE","GARDEN"],1,U),
("Ujigami Shrine","UJI","Uji-yamada, Uji, Kyoto, Japan","34 53 31.19","135 48 42.32","high",
 "Small shrine across the Uji River from Byōdō-in whose main hall is regarded as Japan's oldest surviving shrine building; UNESCO 688-009.",["UNESCO","TEMPLE","FREE"],2,U),
("Kōzan-ji","RKHKU","Umegahata-Toganoo-chō, Ukyō-ku, Kyoto, Japan","35 3 37.46","135 40 43.85","high",
 "Mountain temple in Toganoo above Takao, keeper of the Chōjū-giga animal scrolls often called Japan's first manga; UNESCO 688-010.",["UNESCO","TEMPLE","NATURE"],1,U),
("Saihō-ji (Koke-dera, Moss Temple)","RKSAI","Matsuo-jingatani-chō, Nishikyō-ku, Kyoto, Japan","34 59 32.28","135 41 1.63","high",
 "The 'Moss Temple' — a garden carpeted with over a hundred kinds of moss; visits are by advance reservation only. UNESCO 688-011.",["UNESCO","TEMPLE","GARDEN"],1,U),
("Tenryū-ji","RKSAI","Saga-Tenryūji, Ukyō-ku, Kyoto, Japan","35 1 0.06","135 40 28.97","high",
 "Head temple of the Rinzai Tenryū-ji school, founded 1339, with Musō Soseki's Sōgen pond garden borrowing the Arashiyama hills; UNESCO 688-012.",["ICON","UNESCO","TEMPLE","GARDEN"],1,U),
("Kinkaku-ji (Rokuon-ji)","KITA","Kinkakuji-chō, Kita-ku, Kyoto, Japan","35 2 22.24","135 43 46.2","high",
 "The Golden Pavilion — a gold-leafed Zen reliquary hall over a mirror pond, rebuilt in 1955 after arson; UNESCO 688-013.",["ICON","UNESCO","TEMPLE","GARDEN"],1,U),
("Ginkaku-ji (Jishō-ji)","SAKYO","Ginkakuji-chō, Sakyō-ku, Kyoto, Japan","35 1 38.07","135 47 54.78","high",
 "The Silver Pavilion, Ashikaga Yoshimasa's retirement villa turned Zen temple, with its raked-sand garden and moss paths at the head of the Philosopher's Path; UNESCO 688-014.",["ICON","UNESCO","TEMPLE","GARDEN"],1,U),
("Ryōan-ji","RKSAI","Ryōanji Goryōnoshita-chō, Ukyō-ku, Kyoto, Japan","35 2 4.69","135 43 7.64","high",
 "Home of Japan's most famous dry rock garden — fifteen stones on raked gravel; UNESCO 688-015.",["ICON","UNESCO","TEMPLE","GARDEN"],1,U),
("Nishi Hongan-ji","CTR","Hommonzen-chō, Shimogyō-ku, Kyoto, Japan","34 59 28.17","135 45 4.06","high",
 "Head temple of the Jōdo Shinshū Hongwanji-ha, a short walk from Kyoto Station, with vast Founder's and Amida halls and Momoyama-era gates; UNESCO 688-016.",["UNESCO","TEMPLE","FREE"],1,U),
("Nijō Castle","CTR","Nijōjō-chō, Nakagyō-ku, Kyoto, Japan","35 0 50.88","135 44 54.72","high",
 "The Tokugawa shoguns' Kyoto residence (1603), whose Ninomaru Palace 'nightingale floors' chirp underfoot; UNESCO 688-017.",["ICON","UNESCO","CASTLE","GARDEN"],1,U),
("Tōdai-ji","UJI","Zōshi-chō, Nara, Japan","34 41 20","135 50 22.99","high",
 "Nara's great temple, whose Daibutsuden houses the 15-metre bronze Great Buddha; UNESCO 'Historic Monuments of Ancient Nara' 870-001.",["ICON","UNESCO","TEMPLE"],1,N),
("Kōfuku-ji","UJI","Noboriōji-chō, Nara, Japan","34 40 59","135 49 59.99","high",
 "Fujiwara clan temple whose five-storey pagoda rises over Nara Park, with a National Treasure Hall of Buddhist sculpture including the Ashura statue; UNESCO 870-002.",["UNESCO","TEMPLE","MUS"],1,N),
("Kasuga Taisha","UJI","Kasugano-chō, Nara, Japan","34 40 53","135 50 53.99","high",
 "Vermilion shrine of the Fujiwara famed for its thousands of stone and bronze lanterns, set against the protected Kasugayama Primeval Forest; UNESCO 870-003.",["ICON","UNESCO","TEMPLE","NATURE"],1,N),
("Gangō-ji","UJI","Chūin-chō, Nara, Japan","34 40 40","135 49 51.99","high",
 "Successor to Asuka-dera, Japan's first full-scale Buddhist temple; some roof tiles date to the 6th century. In the Naramachi old town. UNESCO 870-004.",["UNESCO","TEMPLE"],2,N),
("Yakushi-ji","UJI","Nishinokyō-chō, Nara, Japan","34 40 5.99","135 47 3","high",
 "Seventh-century imperial temple in western Nara whose East Pagoda is one of Japan's oldest; UNESCO 870-005.",["UNESCO","TEMPLE"],2,N),
("Tōshōdai-ji","UJI","Gojō-chō, Nara, Japan","34 40 32","135 47 4.99","high",
 "Founded in 759 by the Chinese monk Ganjin (Jianzhen); its Golden Hall is the finest surviving Nara-period main hall. UNESCO 870-006.",["UNESCO","TEMPLE"],2,N),
("Heijō Palace Site","UJI","Saki-chō, Nara, Japan","34 41 30.99","135 47 48.99","med",
 "The excavated site of the 8th-century imperial palace of Heijō-kyō, with the reconstructed Daigokuden and Suzakumon gate; UNESCO 870-007 (coordinate = centre of a 129 ha site).",["UNESCO","CASTLE","FREE","NATURE"],2,N),
]
sights=[]; geo=[]
for n,a,ad,la,lo,c,w,g,t,u in rows:
    sights.append({"t":t,"a":a,"n":n,"address":ad,"w":w,"g":g,"sources":[["UNESCO",u],["WIKIPEDIA",W]] if u==U else [["UNESCO",u]]})
    geo.append({"n":n,"address":ad,"lat":dms(la),"lng":dms(lo),"confidence":c,
       "geoSource":f"UNESCO World Heritage Centre maps page (component coordinate {la}N {lo}E) {u}",
       "status":"open","statusSource":"UNESCO World Heritage listing (active property); "+u})
json.dump({"sources":[{"key":"UNESCO","name":"UNESCO World Heritage Centre","url":"https://whc.unesco.org/"}],"sights":sights},
          open("SIGHTS_KYOTO_UNESCO.json","w"),ensure_ascii=False,indent=1)
json.dump(geo,open("geo/_geoout_kyoto_unesco.json","w"),ensure_ascii=False,indent=1)
for x in geo: print(x["n"],x["lat"],x["lng"])
