"""Local fan-out orchestration — the sub-agent pattern without Claude's Agent tool.

The repo's discovery scales by *waves* of sub-agents, each given a narrow slice
(a cuisine, a sub-region) and the standing brief, each returning sourced places.
This module reproduces that locally:

    Worker      = an LLMBackend + a SearchBackend + a task prompt + a JSON schema
    Orchestrator.run(tasks, ...) fans the workers out with a concurrency cap and
                 collects their structured results, capturing per-task errors.

No dependency on any proprietary agent runtime. If you prefer a batteries-
included framework, the same Worker shape maps onto LangChain's
``AgentExecutor`` or CrewAI ``Agent``/``Task`` — noted in CAPABILITY-MAP.md —
but this keeps guidekit self-contained and offline-capable.

A worker's loop is deliberately simple and deterministic:
    1. run the task's search queries (Stage 1/2: find sources, read what they name)
    2. hand the LLM the brief + the retrieved snippets + the output schema
    3. get structured JSON back, (optionally) validate + self-filter by sourcing
"""
from __future__ import annotations

import concurrent.futures as _cf
import traceback
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional

from .schemas import passes_sourcing


@dataclass
class Task:
    """One unit of discovery work handed to a worker."""

    key: str                                   # identifier, e.g. "food:vietnamese"
    prompt: str                                # the specific instruction
    queries: List[str] = field(default_factory=list)   # searches to seed context
    schema: Optional[Dict[str, Any]] = None    # structured-output schema
    system: Optional[str] = None               # standing brief / system prompt
    max_results: int = 6                       # search results per query
    extra: Dict[str, Any] = field(default_factory=dict)


@dataclass
class WorkerResult:
    key: str
    ok: bool
    parsed: Any = None                         # the structured payload (e.g. {"places":[...]})
    text: str = ""
    search_hits: int = 0
    error: Optional[str] = None
    places: List[Dict[str, Any]] = field(default_factory=list)


class Worker:
    """A single fan-out worker: LLM + search + a task."""

    def __init__(self, llm, search, *, self_filter_sourcing: bool = True,
                 temperature: float = 0.2, max_tokens: int = 4096) -> None:
        self.llm = llm
        self.search = search
        self.self_filter_sourcing = self_filter_sourcing
        self.temperature = temperature
        self.max_tokens = max_tokens

    def run(self, task: Task) -> WorkerResult:
        try:
            # 1. gather context via search (Stage 1/2)
            hits = self.search.search_many(task.queries, max_results=task.max_results) \
                if task.queries else []
            context = "\n".join(h.as_line() for h in hits)

            # 2. build the prompt with retrieved context
            prompt = task.prompt
            if context:
                prompt = (
                    f"{task.prompt}\n\n"
                    f"--- SEARCH RESULTS (use these; cite the outlet as the source key) ---\n"
                    f"{context}\n--- END SEARCH RESULTS ---"
                )

            # 3. structured completion
            res = self.llm.complete(
                prompt, system=task.system, schema=task.schema,
                temperature=self.temperature, max_tokens=self.max_tokens,
            )
            parsed = res.parsed
            places = _extract_places(parsed)
            if self.self_filter_sourcing and places:
                places = [p for p in places if passes_sourcing(p.get("sources", []))]
            return WorkerResult(key=task.key, ok=True, parsed=parsed, text=res.text,
                                search_hits=len(hits), places=places)
        except Exception as exc:  # capture per-task; one worker failing != wave failing
            return WorkerResult(key=task.key, ok=False,
                                error=f"{exc.__class__.__name__}: {exc}\n{traceback.format_exc()}")


def _extract_places(parsed: Any) -> List[Dict[str, Any]]:
    if isinstance(parsed, dict) and isinstance(parsed.get("places"), list):
        return parsed["places"]
    if isinstance(parsed, list):
        return parsed
    return []


class Orchestrator:
    """Fan a set of tasks across workers with a concurrency cap.

    ``concurrency`` is the max number of workers in flight — mirrors the repo's
    "run re-verify agents sequentially / one wave at a time" caution: keep it
    low (1–4) when the search backend shares a public budget.
    """

    def __init__(self, llm, search, *, concurrency: int = 3,
                 worker_factory: Optional[Callable[[], Worker]] = None,
                 self_filter_sourcing: bool = True) -> None:
        self.llm = llm
        self.search = search
        self.concurrency = max(1, int(concurrency))
        self.self_filter_sourcing = self_filter_sourcing
        self._worker_factory = worker_factory

    def _make_worker(self) -> Worker:
        if self._worker_factory:
            return self._worker_factory()
        return Worker(self.llm, self.search,
                      self_filter_sourcing=self.self_filter_sourcing)

    def run(self, tasks: List[Task],
            on_result: Optional[Callable[[WorkerResult], None]] = None) -> List[WorkerResult]:
        """Execute ``tasks`` and return one :class:`WorkerResult` per task.

        Uses a thread pool (the work is I/O-bound: network search + a model
        server call). If ``concurrency == 1`` it runs strictly sequentially,
        which is the safe mode for a shared search budget.
        """
        results: List[WorkerResult] = []
        if self.concurrency == 1:
            for t in tasks:
                r = self._make_worker().run(t)
                if on_result:
                    on_result(r)
                results.append(r)
            return results

        with _cf.ThreadPoolExecutor(max_workers=self.concurrency) as pool:
            futs = {pool.submit(self._make_worker().run, t): t for t in tasks}
            for fut in _cf.as_completed(futs):
                r = fut.result()
                if on_result:
                    on_result(r)
                results.append(r)
        # keep input order stable for reproducibility
        order = {t.key: i for i, t in enumerate(tasks)}
        results.sort(key=lambda r: order.get(r.key, 1e9))
        return results

    @staticmethod
    def merge_places(results: List[WorkerResult]) -> List[Dict[str, Any]]:
        """Flatten + de-duplicate places (by name) across a wave's workers."""
        seen, merged = set(), []
        for r in results:
            for p in r.places:
                n = p.get("n")
                if n and n not in seen:
                    seen.add(n)
                    merged.append(p)
        return merged
