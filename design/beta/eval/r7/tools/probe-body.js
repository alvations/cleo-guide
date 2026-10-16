// R7 evaluator: running-text font sizes (words in p/li/dd/figcaption with > 50 chars of own text), per page and viewport. Usage: node probe-body.js (R7 on 8811)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async()=>{const b=await chromium.launch();
for (const [vp,o] of [['m',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}],['d',{viewport:{width:1440,height:900}}]]){
const ctx=await b.newContext(o);await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
for (const u of ['index.html','Japan/index.html','cities/tokyo.html#view=gallery&p=kanda-myojin','cities/tokyo.html#view=guidebook','cities/tokyo.html#view=gallery']){
const p=await ctx.newPage();await p.goto('http://127.0.0.1:8811/beta/'+u,{waitUntil:'load'});await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&s.visibility!=='hidden'&&s.display!=='none'&&r.top<innerHeight*3};
// running text: p elements and li with > 60 chars own text
const els=[...document.querySelectorAll('p, li, dd, figcaption, .why, .pl-w')].filter(vis).filter(e=>e.textContent.trim().length>50&&!e.querySelector('p,li'));
const H={};let words=0,small=0;for(const e of els){const fs=parseFloat(getComputedStyle(e).fontSize);const w=e.textContent.trim().split(/\s+/).length;words+=w;if(fs<16)small+=w;const k=Math.round(fs*10)/10;H[k]=(H[k]||0)+w;}
const ex=els.filter(e=>parseFloat(getComputedStyle(e).fontSize)<16).slice(0,4).map(e=>e.className.toString().slice(0,20)+':'+getComputedStyle(e).fontSize+':'+e.textContent.trim().slice(0,30));
return {words,shareUnder16:+(small/words).toFixed(2),hist:H,ex};});
console.log(vp,u.padEnd(46),JSON.stringify(r));await p.close();}
await ctx.close();}
await b.close();})();
