"""Geocode backends — resolve a place to its exact *place pin*, open source.

    GeocodeBackend (ABC)
      .geocode(name, address) -> GeoResult | None    # {lat, lng, source, confidence}

CLAUDE.md rule 4a/4b is the hard constraint this module honours: a coordinate
must be the **place pin**, never a map *viewport* or a city/administrative
centroid, and each pin is graded ``high`` / ``med`` / ``low``. Nominatim (the
OpenStreetMap geocoder) returns, per result, an OSM ``class``/``type``,
``importance`` and ``addresstype`` — enough to (a) reject non-place matches and
(b) grade the ones we keep.

Confidence mapping (documented so it matches the repo's grading)
----------------------------------------------------------------
* **high** — the result is an actual mapped feature: a POI/way/relation with a
  name (``class`` in {amenity, tourism, shop, leisure, historic, building,
  office, ...}) OR an exact house-number address (``addresstype == 'building'``
  / a ``house_number`` present). This is the equivalent of reading Google's
  ``!3d!4d`` place pin.
* **med** — a street/road-level match (``addresstype`` in {road, street}) with
  no house number: the right block, not the exact door. Corresponds to a "low"
  pin in the repo that still wants a re-verify but is on the right street.
* **low** — anything coarser (locality/suburb) that still names the place; kept
  only as a lead, flagged for the re-verify pass.
* **rejected (returns None)** — city/state/country/administrative-boundary hits
  (``addresstype`` in {city, state, country, municipality, ...} or ``class ==
  'boundary'``): these are viewports/centroids, exactly what rule 4b forbids.
  The result is dropped so the build's geocode gate never ships it.

The returned ``source`` string is written verbatim into ``data/geocodes.json``'s
``source`` field, so pins stay auditable (rule 4a).

Alternatives (documented, same interface): **Photon** (Komoot's OSM geocoder,
better fuzzy search) and **Pelias** (Mapzen's, self-hostable at scale). Both are
open source; wire either behind this ABC the same way.
"""
from __future__ import annotations

import time
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Optional


@dataclass
class GeoResult:
    lat: float
    lng: float
    source: str
    confidence: str            # 'high' | 'med' | 'low'
    matched_address: str = ""
    raw: Any = None

    def to_registry_entry(self, address: str, date: str, status: str = "open",
                          status_source: str = "") -> dict:
        """Shape one ``data/geocodes.json`` city entry value for this pin.

        (Writing it into the registry is a deliberate, human/gated step — this
        just produces the dict in the exact schema the build injector reads.)
        """
        return {
            "address": address,
            "lat": round(self.lat, 5),
            "lng": round(self.lng, 5),
            "source": self.source,
            "confidence": self.confidence,
            "verified": date,
            "status": status,
            "statusSource": status_source,
            "statusChecked": date if status_source else "",
        }


class GeocodeBackend(ABC):
    name = "geocode"

    def preflight(self) -> None:
        """Import the backend's dependency (no network). Raises if unavailable."""
        return None

    @abstractmethod
    def geocode(self, name: str, address: str) -> Optional[GeoResult]:
        """Return a graded place pin, or ``None`` if only a viewport/centroid
        (or nothing) could be found — never fabricate a coordinate."""
        raise NotImplementedError


# OSM classes that denote a real, mappable feature (a place pin, not an area).
_POI_CLASSES = {
    "amenity", "tourism", "shop", "leisure", "historic", "building", "office",
    "craft", "man_made", "natural", "railway", "aeroway", "club",
}
# addresstypes / classes that are viewports / administrative centroids -> reject.
_REJECT_ADDRESSTYPES = {
    "city", "town", "village", "hamlet", "state", "region", "country",
    "county", "municipality", "administrative", "postcode", "suburb_boundary",
}


class NominatimGeocoder(GeocodeBackend):
    """OpenStreetMap / Nominatim via geopy. Open source, no API key.

    Respects the OSM usage policy: a required descriptive ``user_agent`` and a
    minimum 1 request/second (``min_interval``). Point ``base_url`` at your own
    Nominatim instance to lift the public-endpoint limits for bulk work.
    """

    name = "nominatim"

    def __init__(self, user_agent: str = "guidekit-field-guide/1.0",
                 min_interval: float = 1.0, base_url: Optional[str] = None,
                 country_codes: Optional[str] = None, **_: Any) -> None:
        self.user_agent = user_agent
        self.min_interval = float(min_interval)
        self.base_url = base_url
        self.country_codes = country_codes  # e.g. "us" to bias results
        self._geolocator = None
        self._last = 0.0

    def preflight(self) -> None:
        from geopy.geocoders import Nominatim  # noqa: F401

    def _loc(self):
        if self._geolocator is None:
            from geopy.geocoders import Nominatim

            kw: dict = {"user_agent": self.user_agent, "timeout": 20}
            if self.base_url:
                # geopy wants domain + scheme separately
                from urllib.parse import urlparse

                u = urlparse(self.base_url)
                kw["domain"] = u.netloc + u.path.rstrip("/")
                kw["scheme"] = u.scheme or "https"
            self._geolocator = Nominatim(**kw)
        return self._geolocator

    def _throttle(self):
        dt = time.monotonic() - self._last
        if dt < self.min_interval:
            time.sleep(self.min_interval - dt)
        self._last = time.monotonic()

    def geocode(self, name: str, address: str) -> Optional[GeoResult]:
        loc = self._loc()
        # Query the full "Name, Address" first (best chance of the POI pin),
        # then fall back to the address alone.
        for query in (f"{name}, {address}".strip(", "), address, name):
            if not query:
                continue
            self._throttle()
            kw: dict = {"exactly_one": True, "addressdetails": True, "extratags": False}
            if self.country_codes:
                kw["country_codes"] = self.country_codes
            try:
                res = loc.geocode(query, **kw)
            except Exception:
                res = None
            if res is None:
                continue
            graded = self._grade(res)
            if graded is not None:
                return graded
        return None

    # -- confidence grading + place-pin enforcement ------------------------
    def _grade(self, res) -> Optional[GeoResult]:
        raw = getattr(res, "raw", {}) or {}
        osm_class = (raw.get("class") or raw.get("category") or "").lower()
        addresstype = (raw.get("addresstype") or raw.get("type") or "").lower()
        addr = raw.get("address", {}) or {}
        has_housenumber = bool(addr.get("house_number"))

        # REJECT administrative / viewport-style matches outright (rule 4b).
        if osm_class == "boundary" or addresstype in _REJECT_ADDRESSTYPES:
            return None

        if osm_class in _POI_CLASSES or has_housenumber or addresstype == "building":
            conf = "high"
        elif addresstype in ("road", "street", "residential", "pedestrian"):
            conf = "med"
        else:
            conf = "low"

        label = raw.get("name") or osm_class or addresstype or "OSM"
        source = (
            f"NOMINATIM/OSM {label} "
            f"(class={osm_class or '?'}, type={addresstype or '?'}, "
            f"osm={raw.get('osm_type','?')}/{raw.get('osm_id','?')})"
        )
        return GeoResult(
            lat=float(res.latitude), lng=float(res.longitude),
            source=source, confidence=conf,
            matched_address=getattr(res, "address", ""), raw=raw,
        )


def from_config(cfg) -> GeocodeBackend:
    """Build a :class:`GeocodeBackend`; defaults to Nominatim/OSM."""
    opts = dict(cfg.options.get("geocode", {}))
    kind = (cfg.geocode or "nominatim").lower()
    if kind in ("nominatim", "osm", "photon", "pelias"):
        # Photon/Pelias would get their own class; for now Nominatim is the
        # implemented open-source path and the others are documented above.
        return NominatimGeocoder(
            user_agent=opts.get("user_agent", "guidekit-field-guide/1.0"),
            min_interval=float(opts.get("min_interval", 1.0)),
            base_url=opts.get("base_url"),
            country_codes=opts.get("country_codes"),
        )
    raise ValueError(f"unknown geocode provider: {cfg.geocode!r}")
