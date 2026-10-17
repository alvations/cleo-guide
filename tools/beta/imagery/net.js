'use strict';
/**
 * imagery/net.js — fetch with ONE total-time cap that covers the headers AND the body read (R8, orchestrator).
 *
 * A plain `fetch` + AbortController timer that is cleared once the headers arrive leaves `await res.arrayBuffer()`
 * uncapped: a host that sends headers and then stalls the body hangs the step forever (run #105 sat 25+ min). Here the
 * timer keeps running until the body is read (unref'd, so it never holds the process open), aborts the request when it
 * fires, and the body readers reject with `{ timeout: true }` — callers catch that per file and skip it.
 *
 *   const r = await fetchCapped(url, { headers }, 60000);
 *   if (r.ok) buf = Buffer.from(await r.arrayBuffer());   // rejects with e.timeout after 60 s in total
 */
async function fetchCapped(url, init = {}, total = 30000) {
  const ctl = new AbortController();
  let timer;
  const expired = new Promise((_, no) => {
    timer = setTimeout(() => { ctl.abort(); no(Object.assign(new Error(`timed out after ${total} ms (headers + body)`), { timeout: true })); }, total);
    if (timer.unref) timer.unref();
  });
  expired.catch(() => {});   // a response whose body is never read must not leave an unhandled rejection
  let res;
  try { res = await Promise.race([fetch(url, Object.assign({}, init, { signal: ctl.signal })), expired]); }
  catch (e) { clearTimeout(timer); throw e; }
  const read = m => () => Promise.race([res[m](), expired]).finally(() => clearTimeout(timer));
  return { ok: res.ok, status: res.status, headers: res.headers, url: res.url, arrayBuffer: read('arrayBuffer'), json: read('json'), text: read('text'), done: () => clearTimeout(timer) };
}
module.exports = { fetchCapped };
