const fs=require('fs');const files=process.argv.slice(2);let T={p:0,f:0,closed:0,pages:0},rows=[];
for(const fn of files){const h=fs.readFileSync(fn,'utf8');
 const get=(name)=>{const i=h.indexOf('const '+name+' =');if(i<0)return null;let j=h.indexOf('[',i);let d=0,k=j,inS=null,esc=false;for(;k<h.length;k++){const c=h[k];if(inS){if(esc)esc=false;else if(c=='\\')esc=true;else if(c==inS)inS=null;continue}if(c=='"'||c=="'"||c=='`'){inS=c;continue}if(c=='[')d++;else if(c==']'){d--;if(!d)break}}try{return eval(h.slice(j,k+1))}catch(e){return null}};
 const P=get('P'),F=get('F');if(!P)continue;const all=P.concat(F||[]);const cl=all.filter(x=>/CLOSED/.test(x.n||x.name||'')).length;
 T.p+=P.length;T.f+=(F||[]).length;T.closed+=cl;T.pages++;rows.push([fn,P.length,(F||[]).length,cl]);}
rows.forEach(r=>console.log(r.join('\t')));console.log(JSON.stringify(T));
