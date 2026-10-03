#!/usr/bin/env python3
# Liège dataset city — thin wrapper over tools/belgium_consolidate.build().
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tools"))
from belgium_consolidate import build
D = os.path.dirname(os.path.abspath(__file__))
AREAS = [
 {"id":"LIE","n":"Liège (Carré · Outremeuse · Batte · Montagne de Bueren · Guillemins · Palais · Curtius · Boverie)"},
 {"id":"LIER","n":"Around Liège (Spa & Francorchamps · Huy · the Meuse · Herve plateau · Val-Dieu · Blegny-Mine)"},
]
AC = {"LIE":"#C0504D","LIER":"#6A8D3F"}
build(D, AREAS, AC)
