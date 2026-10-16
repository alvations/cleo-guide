# Lane checkpoints

Every lane keeps one file here, `docs/resume/<lane>.md`, so that work survives a stop (a usage limit, a lost
container, a new session) with little loss. The orchestrator's checkpoint is [`../BETA-RESUME.md`](../BETA-RESUME.md).

## The protocol (every lane)

1. **Push small and often.** A green, verified push at least every 20–30 min of work, and before any command that
   runs longer than about 10 min. Never hold unpushed commits for more than 30 min.
2. **Keep each push green.** Run validate, npm test and beta:check before pushing. Unfinished features land switched
   off (a flag, an unused module, a test marked pending with a reason) so the gates stay green. Never push a red head
   to save work.
3. **Verify every push.** `git ls-remote origin refs/heads/claude/peaceful-goodall-i0hsrt` must equal
   `git rev-parse HEAD`. Use merge only: no rebase, no force.
4. **Update your checkpoint file in the same push.** Keep it short and current, and overwrite rather than append:
   - **Task:** what you are doing, and its issue ids;
   - **Done:** the SHAs pushed for it so far;
   - **Next:** the exact next steps, specific enough that a fresh session could continue;
   - **In flight:** anything not yet pushed and why (should be nothing), long runs started, waiting-on;
   - **Notes:** decisions, file ownership agreements, gotchas.
5. **On a usage-limit warning,** push a checkpoint at once.
6. **On resume,** pull, read your file and `docs/BETA-RESUME.md`, run the gates, then continue from **Next**.
7. **Nothing you need lives only in a scratchpad.** Any script you rely on to continue goes under `tools/`, committed:
   push/sync scripts, generators, candidate lists, probes, review helpers. Scratchpads and containers can vanish during
   a stop. Imagery found its manifest generator scratchpad-only and committed it (`tools/beta/imagery/manifest/`).
8. **When origin moves faster than your full gate** (it takes a push every 1–2 min, and the full gate about 10):
   1. run the full gate on your own commit;
   2. merge origin;
   3. if the merge conflicts only in generated `beta/` files, regenerate with `npm run beta`;
   4. run the fast gate (validate + beta:check), then push and verify;
   5. run the full gate again on the pushed head at once, and fix forward immediately if it's red.

   A source-file conflict is resolved by hand, never by a script. Atlas FE-2 used this pattern for 537cfb8c.
