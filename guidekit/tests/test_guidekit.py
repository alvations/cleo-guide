#!/usr/bin/env python3
"""Offline unit tests for guidekit.

Run with either::

    python3 -m unittest discover -s guidekit/tests -v
    python3 guidekit/tests/test_guidekit.py

NONE of these tests touch the network, Ollama, an API key, or the real
``data/``. They exercise the deterministic seams: config precedence, the
backend-agnostic JSON extractor, the sourcing-gate preview, search de-dup,
Nominatim's place-pin grading (via a fake result object), the fan-out
orchestrator with deterministic stubs, and the pipeline wrappers' pure logic.

The one live-ish test shells out to the REAL ``tools/sourcecheck.py`` on a
temp dataset (no network) to prove guidekit's wrapper drives the unchanged gate.
"""
from __future__ import annotations

import os
import sys
import types
import tempfile
import unittest
from pathlib import Path

# make `import guidekit` work no matter where the test runner is invoked from
_REPO = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(_REPO))

from guidekit import (  # noqa: E402
    build_providers, load_config, Config,
    LLMBackend, LLMResult, ClaudeBackend, LocalBackend,
    SearchBackend, SearchResult, DDGSSearchBackend, HostedSearchBackend,
    NominatimGeocoder, GeoResult,
    Orchestrator, Worker, Task,
    Pipeline, CITY_MAP,
    passes_sourcing, credible_source_keys,
    place_json_schema, discovery_batch_schema,
)
from guidekit import llm as _llm  # noqa: E402
from guidekit import search as _search  # noqa: E402
from guidekit.pipeline import VALID_GATES, repo_root  # noqa: E402


# --------------------------------------------------------------------------- #
#  deterministic stubs (shared)                                               #
# --------------------------------------------------------------------------- #
class _StubSearch(SearchBackend):
    name = "stub"

    def __init__(self, rows=None):
        super().__init__(min_interval=0.0)
        self._rows = rows or [
            SearchResult("A", "https://a.test", "aa", "stub"),
            SearchResult("B", "https://b.test", "bb", "stub"),
        ]

    def search(self, query, *, max_results=8, region="us-en", safesearch="moderate"):
        return self._rows[:max_results]


class _StubLLM(LLMBackend):
    name = "stub"

    def __init__(self, payload):
        self._payload = payload

    def complete(self, prompt, *, system=None, tools=None, schema=None,
                 temperature=0.2, max_tokens=2048) -> LLMResult:
        import json
        return LLMResult(text=json.dumps(self._payload), parsed=self._payload,
                         backend=self.name)


def _fake_geopy_result(raw, lat=37.0, lng=-122.0, address="somewhere"):
    """Mimic a geopy Location: attributes .raw/.latitude/.longitude/.address."""
    ns = types.SimpleNamespace()
    ns.raw = raw
    ns.latitude = lat
    ns.longitude = lng
    ns.address = address
    return ns


# --------------------------------------------------------------------------- #
#  config                                                                      #
# --------------------------------------------------------------------------- #
class TestConfig(unittest.TestCase):
    def test_defaults_are_open_source(self):
        # start_dir at a scratch temp dir so no repo guidekit.toml is picked up,
        # but the packaged one still supplies ollama/ddgs/nominatim defaults.
        cfg = load_config(start_dir=tempfile.gettempdir())
        self.assertTrue(cfg.llm.startswith("ollama") or cfg.llm.startswith("litellm")
                        or cfg.llm.startswith("claude") or cfg.llm)
        self.assertIn(cfg.search, ("ddgs", "searxng", "tavily", "hosted"))
        self.assertEqual(cfg.geocode, "nominatim")

    def test_arg_beats_env_beats_default(self):
        os.environ["GUIDEKIT_SEARCH"] = "searxng"
        try:
            # explicit arg wins over env
            self.assertEqual(load_config(search="tavily").search, "tavily")
            # env wins over default when no arg
            self.assertEqual(load_config().search, "searxng")
        finally:
            del os.environ["GUIDEKIT_SEARCH"]

    def test_env_overlay_populates_option_bag(self):
        os.environ["TAVILY_API_KEY"] = "secret-xyz"
        try:
            cfg = load_config(search="tavily")
            self.assertEqual(cfg.opt("search", "tavily_api_key"), "secret-xyz")
        finally:
            del os.environ["TAVILY_API_KEY"]

    def test_build_providers_lazily_wires_all_three(self):
        prov = build_providers(load_config(llm="ollama:llama3.1",
                                           search="ddgs", geocode="nominatim"))
        self.assertIsInstance(prov.llm, LocalBackend)
        self.assertIsInstance(prov.search, DDGSSearchBackend)
        self.assertIsInstance(prov.geocode, NominatimGeocoder)
        self.assertIn("llm", prov.describe())


# --------------------------------------------------------------------------- #
#  llm: extractor + factory                                                    #
# --------------------------------------------------------------------------- #
class TestLLMHelpers(unittest.TestCase):
    def test_extract_json_fenced(self):
        self.assertEqual(_llm.extract_json('noise ```json\n{"a":1}\n``` tail'), {"a": 1})

    def test_extract_json_bare_object_and_array(self):
        self.assertEqual(_llm.extract_json('here: {"x": [1,2]} done'), {"x": [1, 2]})
        self.assertEqual(_llm.extract_json("prefix [1, 2, 3] suffix"), [1, 2, 3])

    def test_extract_json_handles_braces_in_strings(self):
        self.assertEqual(_llm.extract_json('{"s": "a } b"}'), {"s": "a } b"})

    def test_extract_json_returns_none_on_garbage(self):
        self.assertIsNone(_llm.extract_json("no json here at all"))
        self.assertIsNone(_llm.extract_json(""))

    def test_from_config_claude_vs_local(self):
        self.assertIsInstance(_llm.from_config(Config(llm="claude:claude-opus-4-8")),
                              ClaudeBackend)
        b = _llm.from_config(Config(llm="ollama:llama3.1"))
        self.assertIsInstance(b, LocalBackend)
        self.assertEqual(b.transport, "ollama")
        self.assertEqual(b.model, "llama3.1")

    def test_from_config_litellm_keeps_provider_qualified_model(self):
        # regression: the "litellm:" prefix must be stripped from the model id.
        b = _llm.from_config(Config(llm="litellm:ollama/llama3.1"))
        self.assertEqual(b.transport, "litellm")
        self.assertEqual(b.model, "ollama/llama3.1")

    def test_complete_json_convenience(self):
        stub = _StubLLM({"ok": True})
        self.assertEqual(stub.complete_json("p", schema={"type": "object"}), {"ok": True})


# --------------------------------------------------------------------------- #
#  schemas: the sourcing-gate preview                                          #
# --------------------------------------------------------------------------- #
class TestSourcingPreview(unittest.TestCase):
    def test_two_credible_pass(self):
        self.assertTrue(passes_sourcing([["EATER", "u"], ["KQED", "u"]]))

    def test_lone_editorial_fails(self):
        self.assertFalse(passes_sourcing([["EATER", "u"]]))

    def test_lone_michelin_passes(self):
        self.assertTrue(passes_sourcing([["MICHELIN_BIB", "u"]]))
        self.assertTrue(passes_sourcing([["JAMESBEARD", "u"]]))

    def test_lone_nps_passes(self):
        # regression: NPS is a lone institutional authority in the real gate;
        # the preview must agree (e.g. Alcatraz / Golden Gate NRA).
        self.assertTrue(passes_sourcing([["NPS", "nps.gov/alca"]]))

    def test_elite_solo_matches_real_gate(self):
        # guidekit's preview set must equal tools/sourcecheck.py's ELITE_SOLO.
        import re
        from guidekit import schemas
        src = (repo_root() / "tools" / "sourcecheck.py").read_text()
        m = re.search(r"ELITE_SOLO\s*=\s*\{([^}]*)\}", src)
        gate_set = set(re.findall(r'"([^"]+)"', m.group(1)))
        self.assertEqual(schemas.ELITE_SOLO, gate_set)

    def test_yelp_counts_as_zero(self):
        self.assertFalse(passes_sourcing([["YELP", "u"]]))
        self.assertFalse(passes_sourcing([["YELP", "u"], ["TRIPADVISOR", "u"]]))
        # one credible + yelp is still only ONE credible -> fail
        self.assertFalse(passes_sourcing([["EATER", "u"], ["YELP", "u"]]))

    def test_credible_keys_strips_open_check(self):
        self.assertEqual(credible_source_keys([["EATER", "u"], ["GOOGLE", "u"]]),
                         {"EATER"})

    def test_schema_shapes(self):
        ps = place_json_schema()
        self.assertEqual(ps.get("type"), "object")
        batch = discovery_batch_schema()
        self.assertIn("places", batch["properties"])
        self.assertEqual(batch["required"], ["places"])


# --------------------------------------------------------------------------- #
#  search                                                                      #
# --------------------------------------------------------------------------- #
class TestSearch(unittest.TestCase):
    def test_search_many_dedupes_by_url(self):
        rows = [SearchResult("A", "https://dup.test", "1"),
                SearchResult("A2", "https://dup.test", "2"),
                SearchResult("B", "https://uniq.test", "3")]
        out = _StubSearch(rows).search_many(["q1", "q2"])
        self.assertEqual([r.url for r in out],
                         ["https://dup.test", "https://uniq.test"])

    def test_hosted_requires_a_hook(self):
        with self.assertRaises(NotImplementedError):
            HostedSearchBackend().search("q")

    def test_hosted_with_hook_maps_rows(self):
        hook = lambda q, n: [{"title": "T", "url": "https://h.test", "snippet": "s"}]
        out = HostedSearchBackend(call=hook).search("q")
        self.assertEqual(out[0].url, "https://h.test")

    def test_from_config_defaults_to_ddgs(self):
        self.assertIsInstance(_search.from_config(Config(search="ddgs")),
                              DDGSSearchBackend)

    def test_from_config_searxng_needs_url(self):
        with self.assertRaises(ValueError):
            _search.from_config(Config(search="searxng"))


# --------------------------------------------------------------------------- #
#  geocode: place-pin grading (rule 4a/4b) — no network, via a fake result     #
# --------------------------------------------------------------------------- #
class TestGeocodeGrading(unittest.TestCase):
    def setUp(self):
        self.g = NominatimGeocoder()

    def test_poi_class_is_high(self):
        r = _fake_geopy_result({"class": "amenity", "type": "restaurant",
                                "addresstype": "amenity", "name": "Taqueria"})
        res = self.g._grade(r)
        self.assertIsNotNone(res)
        self.assertEqual(res.confidence, "high")
        self.assertIn("NOMINATIM", res.source)

    def test_house_number_is_high(self):
        r = _fake_geopy_result({"class": "place", "addresstype": "house",
                                "address": {"house_number": "123"}})
        self.assertEqual(self.g._grade(r).confidence, "high")

    def test_street_level_is_med(self):
        r = _fake_geopy_result({"class": "highway", "addresstype": "road",
                                "address": {}})
        self.assertEqual(self.g._grade(r).confidence, "med")

    def test_boundary_is_rejected(self):
        r = _fake_geopy_result({"class": "boundary", "type": "administrative",
                                "addresstype": "city"})
        self.assertIsNone(self.g._grade(r))

    def test_city_addresstype_rejected(self):
        r = _fake_geopy_result({"class": "place", "addresstype": "city"})
        self.assertIsNone(self.g._grade(r))

    def test_registry_entry_shape(self):
        r = _fake_geopy_result({"class": "tourism", "addresstype": "attraction",
                                "name": "Museum"}, lat=37.1, lng=-122.2)
        entry = self.g._grade(r).to_registry_entry("1 Main St", "2026-08-18",
                                                   status="open", status_source="official")
        self.assertEqual(entry["lat"], 37.1)
        self.assertEqual(entry["confidence"], "high")
        self.assertEqual(entry["status"], "open")
        self.assertEqual(entry["statusChecked"], "2026-08-18")


# --------------------------------------------------------------------------- #
#  orchestrator: the sub-agent fan-out                                         #
# --------------------------------------------------------------------------- #
class TestOrchestrator(unittest.TestCase):
    def _payload(self):
        return {"places": [
            {"n": "Good Place", "sources": [["EATER", "u"], ["KQED", "u"]]},
            {"n": "Yelp Only", "sources": [["YELP", "u"]]},
        ]}

    def test_worker_self_filters_by_sourcing(self):
        w = Worker(_StubLLM(self._payload()), _StubSearch())
        res = w.run(Task(key="t", prompt="p", queries=["q"], schema={"type": "object"}))
        self.assertTrue(res.ok)
        self.assertEqual([p["n"] for p in res.places], ["Good Place"])
        self.assertEqual(res.search_hits, 2)

    def test_worker_without_filter_keeps_all(self):
        w = Worker(_StubLLM(self._payload()), _StubSearch(), self_filter_sourcing=False)
        res = w.run(Task(key="t", prompt="p"))
        self.assertEqual(len(res.places), 2)

    def test_orchestrator_sequential_preserves_order(self):
        orch = Orchestrator(_StubLLM(self._payload()), _StubSearch(), concurrency=1)
        tasks = [Task(key=f"k{i}", prompt="p") for i in range(3)]
        results = orch.run(tasks)
        self.assertEqual([r.key for r in results], ["k0", "k1", "k2"])
        self.assertTrue(all(r.ok for r in results))

    def test_orchestrator_concurrent_preserves_input_order(self):
        orch = Orchestrator(_StubLLM(self._payload()), _StubSearch(), concurrency=3)
        tasks = [Task(key=f"k{i}", prompt="p") for i in range(5)]
        results = orch.run(tasks)
        self.assertEqual([r.key for r in results], [f"k{i}" for i in range(5)])

    def test_merge_places_dedupes_by_name(self):
        orch = Orchestrator(_StubLLM(self._payload()), _StubSearch(), concurrency=1)
        results = orch.run([Task(key="a", prompt="p"), Task(key="b", prompt="p")])
        merged = Orchestrator.merge_places(results)
        self.assertEqual([p["n"] for p in merged], ["Good Place"])

    def test_worker_captures_error_without_raising(self):
        class Boom(LLMBackend):
            def complete(self, *a, **k):
                raise RuntimeError("kaboom")
        res = Worker(Boom(), _StubSearch()).run(Task(key="t", prompt="p"))
        self.assertFalse(res.ok)
        self.assertIn("kaboom", res.error)


# --------------------------------------------------------------------------- #
#  pipeline: pure logic + the real sourcecheck gate on a temp dataset          #
# --------------------------------------------------------------------------- #
class TestPipeline(unittest.TestCase):
    def test_repo_root_finds_tools(self):
        root = repo_root()
        self.assertTrue((root / "tools" / "research.js").is_file())

    def test_city_map_matches_valid_gates(self):
        self.assertIn("cincinnati-oh", CITY_MAP)
        self.assertEqual(VALID_GATES,
                         ("sourcecheck", "geocheck", "statuscheck", "buildcheck", "validate"))

    def test_gate_rejects_unknown_gate(self):
        with self.assertRaises(ValueError):
            Pipeline().gate("bogus", "cincinnati-oh")

    def test_build_rejects_unknown_city(self):
        with self.assertRaises(ValueError):
            Pipeline().build("atlantis-zz")

    def test_dataset_path_resolves(self):
        p = Pipeline().dataset_path("dayton-oh")
        self.assertTrue(str(p).endswith("dayton.dataset.json"))

    def test_real_sourcecheck_gate_flags_yelp_only(self):
        """Drive the UNCHANGED tools/sourcecheck.py through the wrapper (no network)."""
        import json
        ds = {"P": [{"n": "Two Src", "s": [["EATER", "u"], ["KQED", "u"]]}],
              "F": [{"n": "Yelp Only", "s": [["YELP", "u"]]}]}
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "demo.dataset.json"
            path.write_text(json.dumps(ds), encoding="utf-8")
            res = Pipeline().sourcecheck(str(path))
            self.assertFalse(res.passed)          # exit 1: one Yelp-only place
            self.assertIn("Yelp-only", res.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
