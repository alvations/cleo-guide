// R7 evaluator: day route vs the phone carousel / desktop list in Atlas (#view=atlas&day=TAITO). Usage: node probe-day.js <port> <outdir>
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48+cPAAXxAvkqF6tIAAAAAElFTkSuQmCC', 'base64');
const port = process.argv[2] || 8811;
(async()=>{const b=await chromium.launch();
for (const [vp,o] of [['m',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}],['d',{viewport:{width:1440,height:900}}]]) {
const ctx=await b.newContext(o);
await ctx.route('**/*', r => { const u=r.request().url(); if (u.startsWith('http://127.0.0.1')) return r.continue(); if (/tile\.openstreetmap|arcgisonline/.test(u)) return r.fulfill({body:TILE,contentType:'image/png'}); return r.abort(); });
const p=await ctx.newPage();await p.goto(`http://127.0.0.1:${port}/beta/cities/tokyo.html#view=atlas&day=TAITO`,{waitUntil:'load'});await p.waitForTimeout(2500);
console.log(vp, await p.evaluate(()=>{const ps=[...document.querySelectorAll('path')].filter(e=>e.closest('.leaflet-container')).map(e=>({c:e.getAttribute('class'),s:e.getAttribute('stroke'),w:e.getAttribute('stroke-width'),d:(e.getAttribute('stroke-dasharray')||''),bb:(r=>[Math.round(r.top),Math.round(r.bottom),Math.round(r.left),Math.round(r.right)])(e.getBoundingClientRect())}));
const car=document.querySelector('.listpane'); const dayEl=[...document.querySelectorAll('[class*=day]')].filter(e=>e.getBoundingClientRect().width).map(e=>e.className.toString().slice(0,30)).slice(0,8);
return JSON.stringify({ps:ps.slice(0,5),n:ps.length,car:car&&(r=>[Math.round(r.top),Math.round(r.bottom)])(car.getBoundingClientRect()),dayEl, hash:location.hash, mk:[...document.querySelectorAll('.leaflet-marker-icon')].slice(0,3).map(m=>m.className)})}));
await p.screenshot({path:`${process.argv[3]||'/tmp'}/day-atlas-${vp}.jpg`,type:'jpeg',quality:70});
await ctx.close();}
await b.close();})();
