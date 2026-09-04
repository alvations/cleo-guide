#!/usr/bin/env python3
# Antwerp dataset city — thin wrapper over tools/belgium_consolidate.build().
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tools"))
from belgium_consolidate import build
D = os.path.dirname(os.path.abspath(__file__))
AREAS = [
 {"id":"ANT","n":"Antwerp (Cathedral · Grote Markt · MAS · Zuid · Zurenborg · Diamond District)"},
 {"id":"ANTR","n":"Around Antwerp (Berchem · Deurne · Hoboken · Mechelen · Lier · the Port)"},
]
AC = {"ANT":"#2E6DA4","ANTR":"#C0504D"}
build(D, AREAS, AC)
