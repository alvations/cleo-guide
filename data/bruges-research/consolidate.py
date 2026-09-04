#!/usr/bin/env python3
# Bruges dataset city — thin wrapper over tools/belgium_consolidate.build().
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tools"))
from belgium_consolidate import build
D = os.path.dirname(os.path.abspath(__file__))
AREAS = [
 {"id":"BRG","n":"Bruges (Markt & Belfry · Burg · Holy Blood · Groeninge · Béguinage · canals)"},
 {"id":"BRGR","n":"Around Bruges (Damme · the coast — Ostend · Knokke · Zeebrugge)"},
]
AC = {"BRG":"#C0504D","BRGR":"#6A8D3F"}
build(D, AREAS, AC)
