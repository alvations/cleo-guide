// W7 FE-A gap #1 probe: tap a card → the sheet opens through one view transition (motion allowed) and with 0 animations under
// prefers-reduced-motion. Usage: NODE_PATH=$(npm root -g) node tools/beta/w7-grow-probe.js
const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..','..'),BASE='https://cleo.local/';
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.woff2':'font/woff2'};
(async()=>{const b=await chromium.launch();for(const rm of ['no-preference','reduce'])for(const W of [390,1440]){const ctx=await b.newContext({viewport:{width:W,height:844},isMobile:W<500,hasTouch:W<500,reducedMotion:rm});
await ctx.route('**/*',async r=>{const u=r.request().url();if(!u.startsWith(BASE))return r.abort();const p=path.join(ROOT,decodeURIComponent(new URL(u).pathname));if(!fs.existsSync(p)||fs.statSync(p).isDirectory())return r.fulfill({status:404,body:''});return r.fulfill({status:200,contentType:T[path.extname(p)]||'application/octet-stream',body:fs.readFileSync(p)});});
const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));await pg.goto(BASE+'beta/cities/tokyo.html',{waitUntil:'load'});await pg.waitForTimeout(1200);
await pg.evaluate(()=>{window.__vt=0;const o=document.startViewTransition;if(o)document.startViewTransition=function(f){window.__vt++;return o.call(document,f)}});
await pg.locator('.g-rows li.gc .gc-a').first().click();await pg.waitForTimeout(700);
const r=await pg.evaluate(()=>({open:!document.getElementById('cleo-sheet').hidden,t:(document.getElementById('sh-t')||{}).textContent,vt:window.__vt,anim:document.getAnimations().length}));
console.log(W,rm,JSON.stringify(r),errs.slice(0,2));await ctx.close();}await b.close();})();
