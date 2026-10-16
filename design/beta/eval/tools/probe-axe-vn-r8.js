// R8 evaluator: axe color-contrast detail on the Vietnamese sheet (port 8811). Run from the R8 tree root.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});
await ctx.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1')?r.continue():r.abort());
const p=await ctx.newPage();await p.goto('http://127.0.0.1:8811/beta/Vietnam/ho-chi-minh-city.html#view=gallery&p=viet-nam-quoc-tu');await p.waitForTimeout(3000);
await p.addScriptTag({content:fs.readFileSync('tools/beta/qa/vendor/axe.min.js','utf8')});
const r=await p.evaluate(async()=>{const x=await axe.run(document,{runOnly:['color-contrast']});return x.violations.flatMap(v=>v.nodes.map(n=>({t:n.target.join(' '),html:n.html.slice(0,200),msg:n.any.map(a=>a.message).join('|')})))});
console.log(JSON.stringify(r,null,1));await b.close();})();
