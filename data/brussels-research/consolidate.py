#!/usr/bin/env python3
# Brussels dataset city — thin wrapper over tools/belgium_consolidate.build().
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tools"))
from belgium_consolidate import build
D = os.path.dirname(os.path.abspath(__file__))
AREAS = [
 {"id":"BRU","n":"Brussels centre & communes (Grand-Place · Sablon · Marolles · Ixelles · Saint-Gilles · EU quarter)"},
 {"id":"BRUR","n":"Around Brussels (Uccle · Schaerbeek · Anderlecht · Tervuren · Waterloo)"},
]
AC = {"BRU":"#8E44AD","BRUR":"#E8973A"}
build(D, AREAS, AC)
