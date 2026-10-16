#!/usr/bin/env node
/**
 * Beta QC spot check (QC lane): QA-77 badges: a.rb hit areas in view never overlap each other or another target in the card (scrolls the Gallery so only laid-out cards are measured; off-screen content-visibility cards report stale rects). Writes <out> as JSON.
 * Usage (from tools/): NODE_PATH=$(npm root -g) node beta/qa/qc-badges.js <checkout root> <out>
 * Same rig as qc.js: beta/ from disk, map tiles stubbed, every other off-origin request aborted, service workers blocked.
 */
const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const ROOT=process.argv[2];const PNG1=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
(async()=>{const srv=http.createServer((q,r)=>{let f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));try{if(fs.statSync(f).isDirectory())f=path.join(f,'index.html')}catch(e){}fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);return r.end()}r.writeHead(200,{'Content-Type':{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json'}[path.extname(f)]||'application/octet-stream'});r.end(b)})}).listen(0,'127.0.0.1');await new Promise(r=>srv.on('listening',r));
const base=`http://127.0.0.1:${srv.address().port}/beta/`;const b=await chromium.launch();const res=[];
for(const pg of ['cities/sanfrancisco.html','cities/tokyo.html','cities/chicago.html','cities/osaka.html'])for(const vp of [390,1440]){
 const c=await b.newContext(vp===390?{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,serviceWorkers:'block'}:{viewport:{width:1440,height:900},serviceWorkers:'block'});await c.route('**/*',r=>{const u=r.request().url();if(u.startsWith(base.slice(0,-5)))return r.continue();if(/openstreetmap|arcgisonline/.test(u))return r.fulfill({status:200,contentType:'image/png',body:PNG1});return r.abort()});
 const p=await c.newPage();await p.goto(base+pg+'#view=gallery&all=1');await p.waitForTimeout(2500);
 const H=await p.evaluate(()=>document.documentElement.scrollHeight);let seen=new Set(),pairs=[],n=0,tgtOver=[];
 for(let y=0;y<H;y+=500){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(120);
  const r=await p.evaluate(()=>{const iv=e=>{const r=e.getBoundingClientRect();return r.height>0&&r.top>=0&&r.bottom<=innerHeight};const R=[...document.querySelectorAll('a.rb')].filter(iv);const o=[],t=[];
   R.forEach((a,i)=>{const A=a.getBoundingClientRect();R.slice(i+1).forEach(b=>{const B=b.getBoundingClientRect();if(Math.min(A.right,B.right)-Math.max(A.left,B.left)>1&&Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top)>1)o.push([a.textContent.slice(0,22),b.textContent.slice(0,22),Math.round(Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top))])});
    const card=a.closest('li')||a.parentElement;[...card.querySelectorAll('a,button')].filter(x=>!x.matches('a.rb')&&x!==a&&!x.contains(a)).forEach(x=>{const B=x.getBoundingClientRect();if(B.height>0&&Math.min(A.right,B.right)-Math.max(A.left,B.left)>1&&Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top)>1){
     // a hit-area overlap only matters where the other target is actually on top somewhere in the shared area
     const cx=(Math.max(A.left,B.left)+Math.min(A.right,B.right))/2,cy=(Math.max(A.top,B.top)+Math.min(A.bottom,B.bottom))/2;const top=document.elementFromPoint(cx,cy);t.push([a.textContent.slice(0,22),(x.tagName+' '+(x.getAttribute('aria-label')||x.textContent)).replace(/\s+/g,' ').slice(0,30),top&&(top.closest('a,button')===a?'badge-on-top':top.closest('a,button')===x?'other-on-top':'neither')])}})});
   return {ids:R.map(a=>a.closest('li')&&a.closest('li').id+'|'+a.textContent),o,t}});
  r.ids.forEach(i=>seen.add(i));pairs.push(...r.o);tgtOver.push(...r.t)}
 const row={pg,vp,badgesSeen:seen.size,badgeOverlaps:pairs.length,sample:pairs.slice(0,3),otherTargetOverlaps:tgtOver.length,otherSample:[...new Set(tgtOver.map(x=>JSON.stringify(x)))].slice(0,4)};console.log(JSON.stringify(row));res.push(row);await c.close()}
fs.writeFileSync(process.argv[3],JSON.stringify(res,null,1));await b.close();srv.close()})();
