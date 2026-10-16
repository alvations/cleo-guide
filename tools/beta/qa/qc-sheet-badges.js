#!/usr/bin/env node
/**
 * Beta QC spot check (QC lane): QA-77 badges in the place sheet: each a.rb is 44 px tall and its hit area overlaps no other target once scrolled into view. Writes sheet shots into <out>/.
 * Usage (from tools/): NODE_PATH=$(npm root -g) node beta/qa/qc-sheet-badges.js <checkout root> <out>
 * Same rig as qc.js: beta/ from disk, map tiles stubbed, every other off-origin request aborted, service workers blocked.
 */
const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const ROOT=process.argv[2];
(async()=>{const srv=http.createServer((q,r)=>{let f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));try{if(fs.statSync(f).isDirectory())f=path.join(f,'index.html')}catch(e){}fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);return r.end()}r.writeHead(200,{'Content-Type':{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json'}[path.extname(f)]||'application/octet-stream'});r.end(b)})}).listen(0,'127.0.0.1');await new Promise(r=>srv.on('listening',r));
const base=`http://127.0.0.1:${srv.address().port}/beta/`;const b=await chromium.launch();
for(const vp of [390,1440]){const c=await b.newContext(vp===390?{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,serviceWorkers:'block'}:{viewport:{width:1440,height:900},serviceWorkers:'block'});await c.route('**/*',r=>r.request().url().startsWith(base.slice(0,-5))?r.continue():r.abort());
 const p=await c.newPage();await p.goto(base+'cities/tokyo.html#view=gallery&all=1');await p.waitForTimeout(2500);
 const ids=await p.evaluate(()=>[...document.querySelectorAll('li.pl')].filter(l=>l.querySelectorAll('a.rb').length>=2).slice(0,3).map(l=>l.id));
 for(const id of ids){await p.evaluate(id=>{const a=document.querySelector('#'+id+' a[href^="#p"]');a.click()},id);await p.waitForTimeout(1200);await p.evaluate(()=>{const d=[...document.querySelectorAll('[role=dialog]')].find(x=>x.getBoundingClientRect().height>0);const a=d&&d.querySelector('a.rb');if(a)a.scrollIntoView({block:'center',behavior:'instant'})});await p.waitForTimeout(400);
  const r=await p.evaluate(()=>{const d=[...document.querySelectorAll('[role=dialog]')].find(x=>x.getBoundingClientRect().height>0);if(!d)return {dialog:false};const a=[...d.querySelectorAll('a.rb')].filter(x=>x.getBoundingClientRect().height>0);let o=0;const T=[...d.querySelectorAll('a,button')].filter(x=>x.getBoundingClientRect().height>0);
   a.forEach(x=>{const A=x.getBoundingClientRect();T.forEach(y=>{if(y===x||y.contains(x)||x.contains(y))return;const B=y.getBoundingClientRect();if(Math.min(A.right,B.right)-Math.max(A.left,B.left)>1&&Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top)>1)o++})});
   return {dialog:true,n:a.length,h:a.map(x=>Math.round(x.getBoundingClientRect().height)),overlapsWithAnyTarget:o}});
  console.log(vp,id,JSON.stringify(r));await p.screenshot({path:`${process.argv[3]}/sheet-${id}-${vp}.jpg`,type:'jpeg',quality:55});await p.keyboard.press('Escape');await p.waitForTimeout(500)}
 await c.close()}
await b.close();srv.close()})();
