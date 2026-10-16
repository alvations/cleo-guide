// Atlas FE-2: CPU profile of the desktop view switch Gallery → Atlas (4× CPU) — self time by script file and function.
//   NODE_PATH=$(npm root -g) node tools/beta/fe2/profile-switch.js [cities/tokyo.html]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..'), BASE = 'https://cleo.local/', PNG = fs.readFileSync(path.join(ROOT, 'tools/node_modules/leaflet/dist/images/layers.png'));
const rel = process.argv[2] || 'cities/tokyo.html';
(async () => { const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.route('**/*', r => { const u = new URL(r.request().url()); if (/arcgis|openstreetmap/.test(u.host)) return r.fulfill({ body: PNG, headers: { 'content-type': 'image/png' } }); if (u.origin + '/' !== BASE) return r.abort(); const p = path.join(ROOT, decodeURIComponent(u.pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) return r.fulfill({ status: 404, body: '' }); return r.fulfill({ body: fs.readFileSync(p) }); });
  const page = await ctx.newPage(); await page.goto(BASE + 'beta/' + rel + '#view=gallery'); await page.waitForTimeout(2500);
  const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 }); await cdp.send('Profiler.start');
  await page.click('[data-cleo-views] button[data-view="atlas"]'); await page.waitForTimeout(4000);
  const { profile } = await cdp.send('Profiler.stop'); const dt = {}; const t = profile.timeDeltas; const byId = {}; profile.nodes.forEach(n => { byId[n.id] = n; });
  profile.samples.forEach((id, i) => { const n = byId[id], f = n.callFrame, file = (f.url || '(native)').replace(/^.*\//, '').replace(/\?.*$/, ''), k = file + ' · ' + (f.functionName || '(anon)') + (f.lineNumber >= 0 ? ':' + (f.lineNumber + 1) + ':' + (f.columnNumber + 1) : ''); dt[k] = (dt[k] || 0) + (t[i] || 0); });
  const byFile = {}; Object.keys(dt).forEach(k => { const f = k.split(' · ')[0]; byFile[f] = (byFile[f] || 0) + dt[k]; });
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => Math.round(v / 1000) + ' ms  ' + k);
  console.log('by file:\n  ' + top(byFile, 8).join('\n  ') + '\ntop functions (self):\n  ' + top(dt, 14).join('\n  ')); await b.close(); })();
