"""Thin wrappers over the EXISTING deterministic pipeline tools.

guidekit never reimplements a gate — it *shells out to* the repo's own scripts so
the same checks run byte-for-byte unchanged:

    consolidate      -> python3 data/<city>-research/consolidate.py
    sourcecheck      -> python3 tools/sourcecheck.py <dataset.json> [--list]
    geocode_status   -> python3 tools/geocode-status.py [--print]
    build            -> python3 tools/build-<city>.py
    gate(...)        -> node   tools/research.js --<gate> <city-key>

Each returns a :class:`ProcResult` (returncode + captured output + a ``passed``
convenience based on the tool's exit code). Nothing here imports or edits the
tools; they are executed as-is. The repo root is auto-detected by walking up
from this file (it lives in ``<root>/guidekit/``) and validated by the presence
of ``tools/research.js``.
"""
from __future__ import annotations

import os
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional

# Known dataset-built cities: research.js key -> (build script stem, dataset file,
# research dir). Mirrors DATASET_FOR / DATASETS in the existing tools.
CITY_MAP = {
    "new-york-ny":       ("build-newyork",      "newyork.dataset.json",      "newyork-research"),
    "silicon-valley-ca": ("build-siliconvalley", "siliconvalley.dataset.json", "silicon-valley-research"),
    "san-francisco-ca":  ("build-sanfrancisco", "sanfrancisco.dataset.json", "san-francisco-research"),
    "cincinnati-oh":     ("build-cincinnati",   "cincinnati.dataset.json",   "cincinnati-research"),
    "dayton-oh":         ("build-dayton",       "dayton.dataset.json",       "dayton-research"),
    "columbus-oh":       ("build-columbus",     "columbus.dataset.json",     "columbus-research"),
}

VALID_GATES = ("sourcecheck", "geocheck", "statuscheck", "buildcheck", "validate")


@dataclass
class ProcResult:
    cmd: List[str]
    returncode: int
    stdout: str
    stderr: str

    @property
    def passed(self) -> bool:
        return self.returncode == 0

    def __str__(self) -> str:
        head = " ".join(self.cmd)
        tail = (self.stdout or self.stderr).strip()
        return f"$ {head}\n[exit {self.returncode}]\n{tail}"


def repo_root(start: Optional[str] = None) -> Path:
    """Locate the repo root (the dir containing ``tools/research.js``)."""
    here = Path(start or __file__).resolve()
    for d in [here, *here.parents]:
        if (d / "tools" / "research.js").is_file():
            return d
    # fall back to the package's parent
    return Path(__file__).resolve().parent.parent


class Pipeline:
    """Bound to a repo root; runs the deterministic tools in place."""

    def __init__(self, root: Optional[str] = None, *, python: Optional[str] = None,
                 node: Optional[str] = None, timeout: int = 600) -> None:
        self.root = Path(root) if root else repo_root()
        self.python = python or _which("python3", "python")
        self.node = node or _which("node")
        self.timeout = timeout

    # -- low level ---------------------------------------------------------
    def _run(self, cmd: List[str], cwd: Optional[Path] = None) -> ProcResult:
        proc = subprocess.run(
            cmd, cwd=str(cwd or self.root), capture_output=True, text=True,
            timeout=self.timeout,
        )
        return ProcResult(cmd=cmd, returncode=proc.returncode,
                          stdout=proc.stdout, stderr=proc.stderr)

    # -- stage wrappers ----------------------------------------------------
    def consolidate(self, city_key: Optional[str] = None,
                    research_dir: Optional[str] = None) -> ProcResult:
        """Run a city's ``consolidate.py`` (research files -> normalized dataset)."""
        rd = self._research_dir(city_key, research_dir)
        script = rd / "consolidate.py"
        if not script.is_file():
            raise FileNotFoundError(f"no consolidate.py in {rd}")
        return self._run([self.python, str(script)], cwd=rd)

    def sourcecheck(self, dataset_path: str, list_flag: bool = False) -> ProcResult:
        """Run ``tools/sourcecheck.py`` — the multiple-sources-of-truth gate."""
        cmd = [self.python, str(self.root / "tools" / "sourcecheck.py"),
               str(self._abs(dataset_path))]
        if list_flag:
            cmd.append("--list")
        return self._run(cmd)

    def geocode_status(self, print_only: bool = False) -> ProcResult:
        """Run ``tools/geocode-status.py`` (rewrites docs/GEOCODE-BACKLOG.md)."""
        cmd = [self.python, str(self.root / "tools" / "geocode-status.py")]
        if print_only:
            cmd.append("--print")
        return self._run(cmd)

    def build(self, city_key: str) -> ProcResult:
        """Run ``tools/build-<city>.py`` for a dataset-built city."""
        stem = CITY_MAP.get(city_key, (None,))[0]
        if not stem:
            raise ValueError(f"no build script mapped for city key {city_key!r}; "
                             f"known: {', '.join(CITY_MAP)}")
        script = self.root / "tools" / f"{stem}.py"
        if not script.is_file():
            raise FileNotFoundError(f"missing build script {script}")
        return self._run([self.python, str(script)])

    def gate(self, gate: str, city_key: str) -> ProcResult:
        """Run one ``tools/research.js --<gate> <city-key>`` gate."""
        if gate not in VALID_GATES:
            raise ValueError(f"gate must be one of {VALID_GATES}, got {gate!r}")
        if not self.node:
            raise RuntimeError("node not found on PATH; research.js gates need Node")
        return self._run([self.node, str(self.root / "tools" / "research.js"),
                          f"--{gate}", city_key])

    # convenience: run the pre-build gate stack for a dataset-built city
    def gate_stack(self, city_key: str) -> List[ProcResult]:
        """sourcecheck (JS) → geocheck → statuscheck → buildcheck, in order."""
        return [self.gate(g, city_key)
                for g in ("sourcecheck", "geocheck", "statuscheck", "buildcheck")]

    # -- helpers -----------------------------------------------------------
    def dataset_path(self, city_key: str) -> Path:
        ds = CITY_MAP.get(city_key, (None, None))[1]
        if not ds:
            raise ValueError(f"no dataset mapped for {city_key!r}")
        return self.root / "data" / ds

    def _research_dir(self, city_key: Optional[str], research_dir: Optional[str]) -> Path:
        if research_dir:
            return self._abs(research_dir)
        if city_key and city_key in CITY_MAP:
            return self.root / "data" / CITY_MAP[city_key][2]
        raise ValueError("pass city_key (a known key) or an explicit research_dir")

    def _abs(self, p: str) -> Path:
        pp = Path(p)
        return pp if pp.is_absolute() else (self.root / pp)


def _which(*names: str) -> str:
    for n in names:
        found = shutil.which(n)
        if found:
            return found
    return names[0]  # optimistic default; _run will surface a clear error
