// R5 evaluator probe (ports: 8796 = R4 mirror, 8795 = R5).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => { const b = await chromium.launch();
 for (const [port,u] of [[8796,'cities/newyork.html'],[8795,'cities/newyork.html'],[8795,'cities/tokyo.html'],[8796,'cities/tokyo.html']]) {
  const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
  await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
  const p = await ctx.newPage(); const sz = {};
  p.on('response', async r => { try { const bb = await r.body(); const k = r.url().replace(/.*\/beta\//,'').replace(/\?.*/,''); sz[k]=(sz[k]||0)+bb.length; } catch(e){} });
  await p.goto(`http://127.0.0.1:${port}/beta/${u}`, {waitUntil:'load'}); await p.waitForTimeout(2500);
  const tot = Object.values(sz).reduce((a,c)=>a+c,0);
  console.log(port,u,Math.round(tot/1024)+'KB', Object.entries(sz).sort((a,c)=>c[1]-a[1]).slice(0,5).map(([k,v])=>k+':'+Math.round(v/1024)).join(' | '));
  await ctx.close(); }
 await b.close(); })();
