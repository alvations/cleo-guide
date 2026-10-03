#!/usr/bin/env python3
# japan_build.py — shared builder for the five Japan dataset maps (Tokyo · Kyoto · Osaka · Okinawa · Hokkaido).
# Each tools/build-<city>.py is a thin wrapper that fills a CFG dict and calls build(CFG). The engine clone, the
# gates (GATE 1 ≥2-credible / lone Michelin·UNESCO·Agency-for-Cultural-Affairs; GATE 2 verified pin), the
# derived map centre/labels and the engine_guard scrub are exactly tools/belgium_build.py's — only the hub
# back-link differs. Tabelog/Retty are rating platforms: they MEASURE, never count toward the two.
import belgium_build as _B

sr_appendix = _B.sr_appendix

def build(CFG):
    CFG.setdefault("HUB", "../Japan/index.html")
    _B.build(CFG)
