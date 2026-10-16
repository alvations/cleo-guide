const fs=require('fs'),path=require('path');const {chromium}=require('playwright');const ROOT=path.join(__dirname,'../../../..'),BASE='https://cleo.local/';
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2'};
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for (const q of ['https://zzqxv-unknown.example/some/path?utm=1','https://www.gotokyo.org/en/spot/15/index.html?x=1']) {
const ctx=await b.newContext({serviceWorkers:'block'});const req=[];
await ctx.route('**/*',r=>{const u=r.request().url();req.push(u);if(!u.startsWith(BASE))return r.abort();const p=path.join(ROOT,decodeURIComponent(new URL(u).pathname));if(!fs.existsSync(p)||fs.statSync(p).isDirectory())return r.fulfill({status:404,body:''});return r.fulfill({status:200,contentType:T[path.extname(p)]||'application/octet-stream',body:fs.readFileSync(p)});});
const pg=await ctx.newPage();await pg.goto(BASE+'beta/index.html',{waitUntil:'load'});await pg.waitForTimeout(800);const n0=req.length;
await pg.fill('#cleo-q',q);await pg.waitForTimeout(800);
const after=req.slice(n0);const txt=await pg.evaluate(()=>document.getElementById('results').innerText);
console.log(q,'\n requests after paste:',after.length,after.map(u=>u.replace(BASE,'')),'\n off-origin:',req.filter(u=>!u.startsWith(BASE)).length,'\n text:',JSON.stringify(txt.slice(0,160)),'\n suggest CTA:',/suggest/i.test(txt));
await ctx.close();}
await b.close();})();
