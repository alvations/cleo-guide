// R7 evaluator: desktop Atlas pin click → is the lit card rendered and in view in the list? Usage: node probe-pin2card.js (R7 on 8811)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const TILE = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48+cPAAXxAvkqF6tIAAAAAElFTkSuQmCC', 'base64');
(async()=>{const b=await chromium.launch();
for (const mode of ['center']) for (const u of ['cities/tokyo.html','cleveland.html']) {
const ctx=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
await ctx.route('**/*', r => { const x=r.request().url(); if (x.startsWith('http://127.0.0.1')) return r.continue(); if (/tile\.openstreetmap|arcgisonline/.test(x)) return r.fulfill({body:TILE,contentType:'image/png'}); return r.abort(); });
const p=await ctx.newPage();await p.goto('http://127.0.0.1:8811/beta/'+u+'#view=atlas',{waitUntil:'load'});await p.waitForTimeout(2000);
const pins=await p.evaluate(()=>[...document.querySelectorAll('.leaflet-marker-icon.pp')].map(e=>e.firstElementChild.getBoundingClientRect()).filter(r=>r.width&&r.left>60&&r.top>200&&r.bottom<innerHeight-100&&r.right<innerWidth*0.55).slice(0,4).map(r=>[r.left,r.top,r.width,r.height]));
const out=[];
for (const q of pins){const [x,y]= mode==='center'?[q[0]+q[2]/2,q[1]+q[3]/2]:[q[0]+q[2]-2,q[1]+2]; await p.mouse.click(x,y); await p.waitForTimeout(900);
out.push(await p.evaluate(()=>{const c=document.querySelector('li.pl.is-sel'),lp=document.querySelector('.listpane'),L=lp.getBoundingClientRect(),q=c&&c.getBoundingClientRect();const idx=[...document.querySelectorAll(".listpane li.pl")].filter(l=>l.getBoundingClientRect().height>0).indexOf(c); return "disp="+(c&&getComputedStyle(c).display)+",hid="+(c&&c.hidden)+",visIdx="+idx+",shown="+[...document.querySelectorAll(".listpane li.pl")].filter(l=>l.getBoundingClientRect().height>0).length+" "+(c?c.id.slice(2,22):'none')+':'+(q?(q.top>=L.top-2&&q.bottom<=L.bottom+2):'-')+':'+(q&&Math.round(q.top))+'/'+Math.round(L.top)+'-'+Math.round(L.bottom)+' sy'+Math.round(scrollY)+' lps'+Math.round(lp.scrollTop)}));
await p.keyboard.press('Escape'); await p.waitForTimeout(300);}
console.log(mode,u,out.join(' | '));await ctx.close();}
await b.close();})();
