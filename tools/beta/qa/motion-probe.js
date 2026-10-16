#!/usr/bin/env node
/* QA (R7 gap 3): every CSS transition/animation on Tokyo (390 and 1440), with and without reduced motion, then a
 * click on Guidebook. Prints the ones over 300 ms and the kinds seen. Serves the repo root this file lives in.
 *   node tools/beta/qa/motion-probe.js */
'use strict';
const http=require('http'),fs=require('fs'),path=require('path');let chromium;for(const t of ['playwright','/opt/node22/lib/node_modules/playwright']){try{({chromium}=require(t));break}catch(e){/* next */}}
const ROOT=path.resolve(__dirname,'..','..','..');const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const srv=http.createServer((q,r)=>{let f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));try{if(fs.statSync(f).isDirectory())f=path.join(f,'index.html')}catch(e){}fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);return r.end()}r.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream'});r.end(b)})});
srv.listen(0,'127.0.0.1',async()=>{const o='http://127.0.0.1:'+srv.address().port;const b=await chromium.launch();
for(const rm of ['no-preference','reduce'])for(const vp of [{width:390,height:844},{width:1440,height:900}]){const ctx=await b.newContext({viewport:vp,reducedMotion:rm});const p=await ctx.newPage();await p.route('**/*',r=>r.request().url().startsWith(o)?r.continue():r.abort());
await p.goto(o+'/beta/cities/tokyo.html');await p.waitForTimeout(1500);
const res=await p.evaluate(async()=>{const dur=s=>s.split(',').map(x=>parseFloat(x)*(x.includes('ms')?1:1000));const max=[];
for(const e of document.querySelectorAll('*')){const c=getComputedStyle(e),c2=getComputedStyle(e,'::before'),c3=getComputedStyle(e,'::after');for(const cc of [c,c2,c3]){const t=Math.max(...dur(cc.transitionDuration))+Math.max(...dur(cc.transitionDelay));const a=cc.animationName!=='none'?Math.max(...dur(cc.animationDuration)):0;if(t>0||a>0)max.push([e.className.toString().slice(0,18),t,a])}}
const tabs=[...document.querySelectorAll('[role=tab],.vtabs a,.vtabs button')];const g=tabs.find(x=>/Guidebook/.test(x.textContent));if(g)g.click();await new Promise(r=>setTimeout(r,100));
const anims=document.getAnimations().map(a=>[a.effect&&a.effect.target&&a.effect.target.className.toString().slice(0,18),a.effect.getComputedTiming().duration]);
const k={};for(const m of max){const key=m[0]+'|'+m[1]+'|'+m[2];k[key]=(k[key]||0)+1}return {ph:document.documentElement.classList.contains('ph-fade'),over300:max.filter(m=>m[1]>300||m[2]>300),kinds:Object.keys(k).slice(0,12),anims}});
console.log(rm,vp.width,JSON.stringify(res));await ctx.close()}
await b.close();srv.close()});
