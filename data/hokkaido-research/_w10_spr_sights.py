#!/usr/bin/env python3
# W10 — SPR sights b3 (parks, zoo, art). WebSearch 2026-10-02 (session 2).
from _hk import S, emit
JA="https://ja.wikipedia.org/wiki/"; ST="https://www.sapporo.travel/en/"
def ja(p): return ("WIKIPEDIA_JA",JA+p)
def st(p): return ("SAPPOROTRAVEL",ST+p)
O="open"
S(2,"SPR","Sapporo Maruyama Zoo (札幌市円山動物園)","Miyagaoka, Chuo-ku, Sapporo, Hokkaido, Japan",
  "Opened 1951 beside the Maruyama primeval forest — polar bears seen from an underwater tunnel, a new elephant house and Hokkaido wildlife.",
  [st("spot/facility/maruyama_zoo/"),ja("%E6%9C%AD%E5%B9%8C%E5%B8%82%E5%86%86%E5%B1%B1%E5%8B%95%E7%89%A9%E5%9C%92")],43.051417,141.307417,"high","ja.wikipedia 札幌市円山動物園 infobox (北緯43度3分5.1秒 東経141度18分26.7秒) via WebSearch",
  O,"sapporo.travel official listing (current)",k="zoo polar bear",g=["NATURE"])
S(2,"SPR","Maruyama Park (円山公園)","Miyagaoka, Chuo-ku, Sapporo, Hokkaido, Japan",
  "The city's favourite hanami park at the foot of Mount Maruyama, beside Hokkaido Shrine — barbecue under the cherries in early May, red maples in autumn.",
  [st("spot/facility/maruyama_park/"),("JAPANGUIDE","https://www.japan-guide.com/e/e5316.html")],status=O,ssrc="sapporo.travel official listing (current)",k="cherry blossom park",g=["NATURE","FREE"])
S(2,"SPR","Hōheikan & Nakajima Park (豊平館・中島公園)","Nakajima-kōen, Chuo-ku, Sapporo, Hokkaido, Japan",
  "The 1880 white-and-ultramarine Western-style imperial guesthouse, an Important Cultural Property, in the downtown park with Shōbu pond, the Hassōan teahouse and Kitara concert hall.",
  [st("spot/facility/nakajima_park/"),("SAPPOROTRAVEL","https://www.sapporo.travel/find/nature-and-parks/nakajima_park/?lang=en"),ja("%E8%B1%8A%E5%B9%B3%E9%A4%A8")],43.04639,141.35250,"high","ja.wikipedia 豊平館 infobox (北緯43度02分47秒 東経141度21分09秒) via WebSearch",
  O,"sapporo.travel Nakajima Park listing (current)",k="meiji guesthouse park",g=["CASTLE","GARDEN","FREE"])
S(2,"SPR","Sapporo Art Park (札幌芸術の森)","Geijutsu-no-mori, Minami-ku, Sapporo, Hokkaido, Japan",
  "A 40-ha forest campus with a sculpture garden of 70-plus outdoor works, the art museum and craft studios — glorious in autumn colour.",
  [st("spot/feature/redleaves/"),ja("%E6%9C%AD%E5%B9%8C%E8%8A%B8%E8%A1%93%E3%81%AE%E6%A3%AE")],42.93389,141.33722,"high","ja.wikipedia 札幌芸術の森 infobox (北緯42度56分02秒 東経141度20分14秒) via WebSearch",
  O,"sapporo.travel autumn-leaves feature (current)",k="sculpture garden museum",g=["MUS","NATURE"])
S(2,"SPR","Takino Suzuran Hillside National Government Park (国営滝野すずらん丘陵公園)","Takino, Minami-ku, Sapporo, Hokkaido, Japan",
  "Hokkaido's only national government park — flower hills, the Ashiribetsu waterfall and forest trails, a snow park in winter.",
  [("SAPPOROTRAVEL","https://www.sapporo.travel/en/spot/facility/?cgnr%5B%5D=spot&cspt%5B%5D=sc05-parks"),ja("%E6%BB%9D%E9%87%8E%E3%81%99%E3%81%9A%E3%82%89%E3%82%93%E4%B8%98%E9%99%B5%E5%85%AC%E5%9C%92")],42.91361,141.38694,"med","ja.wikipedia 滝野すずらん丘陵公園 infobox (北緯42度54分49秒 東経141度23分13秒 — park) via WebSearch",
  O,"sapporo.travel parks list (current)",k="flower park waterfall",g=["NATURE","GARDEN"])
emit("W10")
