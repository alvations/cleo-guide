#!/usr/bin/env python3
# rebuild-city.py — the deterministic POST-DISCOVERY orchestrator for a dataset-built city. Runs the fixed,
# no-WebSearch part of the flow end-to-end so no wave is processed by ad-hoc hand-scripts:
#
#   register-sources -> apply-newareas -> merge-creators -> consolidate -> copy dataset -> sourcecheck
#   [ --build: geo-merge -> build -> --geocheck/--statuscheck/--buildcheck -> geocode-status backlog ]
#
# Geocoding itself (WebSearch) stays a separate manual stage; run this with --build only AFTER the new
# places' _geoout_*.json are in geo/. Without --build it preps + sourcechecks the grown dataset.
#
#   python3 tools/rebuild-city.py <city-key>            # prep: sources+areas+creators+consolidate+sourcecheck
#   python3 tools/rebuild-city.py <city-key> --build    # + geo-merge, build page, run all gates, refresh backlog
#   python3 tools/rebuild-city.py <city-key> --build --geo-only "_geoout_new*.json"   # merge just some geoouts
import subprocess, sys, os, glob, argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# city-key -> (research-slug, built-dataset filename)
CITY = {
    "cincinnati-oh": ("cincinnati", "cincinnati.dataset.json"),
    "columbus-oh":   ("columbus",   "columbus.dataset.json"),
    "dayton-oh":     ("dayton",     "dayton.dataset.json"),
    "new-york-ny":   ("newyork",    "newyork.dataset.json"),
    "silicon-valley-ca": ("silicon-valley", "siliconvalley.dataset.json"),
    "san-francisco-ca":  ("san-francisco", "sanfrancisco.dataset.json"),
    "washington-dc": ("washington-dc", "washingtondc.dataset.json"),
    "singapore":     ("singapore",     "singapore.dataset.json"),
    "state-college-pa": ("state-college", "statecollege.dataset.json"),
    "wheeling-wv":      ("wheeling",      "wheeling.dataset.json"),
    "erie-pa":          ("erie",          "erie.dataset.json"),
    "saarland":         ("saarland",      "saarland.dataset.json"),
}
BUILD = {  # city-key -> build script (defaults to build-<datasetstem>.py)
    "washington-dc": "build-washingtondc.py",
    "singapore": "build-singapore-pages.py",   # per-place pages under Singapore/, not one combined page
}

def run(cmd, cwd=ROOT, check=True):
    print(f"\n$ {' '.join(cmd)}")
    r = subprocess.run(cmd, cwd=cwd, text=True)
    if check and r.returncode != 0:
        print(f"!! step failed (exit {r.returncode}): {' '.join(cmd)}")
        sys.exit(r.returncode)
    return r.returncode

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("key")
    ap.add_argument("--build", action="store_true", help="also geo-merge, build the page, run all gates, refresh backlog")
    ap.add_argument("--geo-only", default="_geoout_*.json", help="which geoout glob to merge on --build")
    a = ap.parse_args()
    if a.key not in CITY:
        print("unknown/ non-dataset city key:", a.key, "\nknown:", ", ".join(CITY)); sys.exit(2)
    slug, dataset = CITY[a.key]
    rdir = os.path.join(ROOT, "data", f"{slug}-research")
    py = sys.executable

    # 1) prep steps — each tolerant (they no-op cleanly when there's nothing to do)
    run([py, "tools/register-sources.py", a.key], check=False)
    run([py, "tools/apply-newareas.py", a.key], check=False)
    run([py, "tools/merge-creators.py", a.key], check=False)

    # 2) geo-merge (only meaningful before consolidate so closed-renames land in the dataset)
    if a.build:
        run([py, "tools/geo-merge.py", a.key, "--only", a.geo_only], check=False)

    # 3) consolidate -> copy dataset
    run([py, "consolidate.py"], cwd=rdir)
    produced = sorted(glob.glob(os.path.join(rdir, "*_dataset.json")))
    if not produced:
        print("consolidate produced no *_dataset.json — aborting"); sys.exit(1)
    dst = os.path.join(ROOT, "data", dataset)
    run(["cp", produced[0], dst])

    # 4) sourcecheck (dataset-level; build GATE 1 also drops <2-credible, so a dataset FAIL can still build clean)
    run([py, "tools/sourcecheck.py", dst], check=False)

    if not a.build:
        print("\nPrep done. Geocode the new places, then re-run with --build.")
        return

    # 5) build + gates
    # dataset stem is the part before the FIRST dot ("columbus.dataset.json" -> "columbus");
    # os.path.splitext only strips ".json" and would wrongly yield "columbus.dataset".
    build_script = BUILD.get(a.key, f"build-{dataset.split('.', 1)[0]}.py")
    run([py, os.path.join("tools", build_script)])
    run([py, "tools/check-escapes.py"], check=False)   # no literal \uXXXX may leak into page prose
    for gate in ("sourcecheck", "geocheck", "statuscheck", "buildcheck"):
        run(["node", "tools/research.js", f"--{gate}", a.key], check=False)
    run([py, "tools/geocode-status.py"], check=False)
    print("\nBuild + gates complete. Review the gate output above; update CITIES.md + AUDIT.md, then commit.")

if __name__ == "__main__":
    main()
