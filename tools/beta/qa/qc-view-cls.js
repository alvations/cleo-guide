#!/usr/bin/env node
/**
 * Beta QC spot check (QC lane): QC-33 load CLS of each view opened by deep link (#view=gallery|atlas|guidebook|insights) at 390 and 1440. Writes <out>.json and <out>.jpg.
 * Usage (from tools/): NODE_PATH=$(npm root -g) node beta/qa/qc-view-cls.js <checkout root> <out>
 * Same rig as qc.js: beta/ from disk, map tiles stubbed, every other off-origin request aborted, service workers blocked.
 */
const http=require('http'),fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const ROOT=process.argv[2];const PNG1=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
(async()=>{const srv=http.createServer((q,r)=>{let f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));try{if(fs.statSync(f).isDirectory())f=path.join(f,'index.html')}catch(e){}fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);return r.end()}r.writeHead(200,{'Content-Type':{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json'}[path.extname(f)]||'application/octet-stream'});r.end(b)})}).listen(0,'127.0.0.1');await new Promise(r=>srv.on('listening',r));
const base=`http://127.0.0.1:${srv.address().port}/beta/`;const b=await chromium.launch();const out=[];
for(const pg of ['cleveland.html','cities/tokyo.html','cities/pittsburgh.html'])for(const vp of [390,1440])for(const v of ['gallery','atlas','guidebook','insights']){
 const c=await b.newContext(vp===390?{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,serviceWorkers:'block'}:{viewport:{width:1440,height:900},serviceWorkers:'block'});await c.route('**/*',r=>{const u=r.request().url();if(u.startsWith(base.slice(0,-5)))return r.continue();if(/openstreetmap|arcgisonline/.test(u))return r.fulfill({status:200,contentType:'image/png',body:PNG1});return r.abort()});
 const p=await c.newPage();await p.addInitScript(()=>{window.__ls=[];new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__ls.push({v:+e.value.toFixed(4),t:Math.round(e.startTime),n:(e.sources||[]).map(s=>s.node&&(s.node.id||s.node.className||s.node.nodeName)).slice(0,3)})})).observe({type:'layout-shift',buffered:true})});
 await p.goto(base+pg+'#view='+v);await p.waitForTimeout(2600);if(vp===1440&&v==='guidebook'&&pg==='cleveland.html')await p.screenshot({path:process.argv[3]+'.jpg',type:'jpeg',quality:50});
 const ls=await p.evaluate(()=>window.__ls);const cls=+ls.reduce((s,e)=>s+e.v,0).toFixed(4);out.push({pg,vp,v,cls,top:ls.sort((a,b)=>b.v-a.v).slice(0,2)});await c.close()}
out.forEach(o=>console.log(o.cls>0.1?'FAIL':'ok  ',o.pg,o.vp,o.v,o.cls,o.cls>0.1?JSON.stringify(o.top):''));fs.writeFileSync(process.argv[3]+'.json',JSON.stringify(out,null,1));await b.close();srv.close()})();
