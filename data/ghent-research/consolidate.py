#!/usr/bin/env python3
# Ghent dataset city — thin wrapper over tools/belgium_consolidate.build().
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tools"))
from belgium_consolidate import build
D = os.path.dirname(os.path.abspath(__file__))
AREAS = [
 {"id":"GEN","n":"Ghent (Gravensteen · St Bavo’s & the Altarpiece · Graslei · Patershol · SMAK)"},
 {"id":"GENR","n":"Around Ghent (Sint-Martens-Latem · the Leie · Deinze · student belt)"},
]
AC = {"GEN":"#16A085","GENR":"#C0504D"}
build(D, AREAS, AC)
