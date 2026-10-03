import os,sys; os.environ["ORL_PIN_OUT"]="_geoout_w6pin.json"
from _orl_pin import pin
RG="restaurantguru place pin {},{} — {} (street address matched)"
def rg(n,lat,lng,url,note="",addr=None,conf="med"): pin(n,lat,lng,conf,RG.format(lat,lng,url),note,addr)
WZ="Waze live-map place record {},{} — {} (name + street address matched)"
def wz(n,lat,lng,url,note="",addr=None,conf="high"): pin(n,lat,lng,conf,WZ.format(lat,lng,url),note,addr)
LS="Listing place pin {},{} — {} (street address matched)"
def ls(n,lat,lng,url,note="",addr=None,conf="med"): pin(n,lat,lng,conf,LS.format(lat,lng,url),note,addr)
