const { chromium } = require('playwright');const fs=require('fs');const http=require('http');const path=require('path');
const ROOT=path.join(__dirname,'site');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.ico':'image/x-icon','.xml':'application/xml','.txt':'text/plain'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404,{'content-type':MIME['.html']});return r.end(fs.readFileSync(path.join(ROOT,'404.html')));}
  r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});r.end(fs.readFileSync(f));}).listen(8765);
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
  const ctx=await b.newContext({viewport:{width:375,height:800},colorScheme:'light',deviceScaleFactor:2});
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
  const sm=fs.readFileSync(path.join(ROOT,'sitemap.xml'),'utf8');const urls=[...sm.matchAll(/<loc>https:\/\/kyochika\.jp([^<]*)<\/loc>/g)].map(m=>m[1]);
  const problems=[];const titles={},descs={};const seenLinks=new Set();const bad404=[];
  for(const u of [...urls,'/404.html','/nonexistent/']){
    const pg=await ctx.newPage();const errs=[];
    pg.on('pageerror',e=>errs.push('JS '+e.message));
    pg.on('response',r=>{if(r.status()>=400&&r.url().includes('localhost')&&!(u==='/nonexistent/'&&r.url().endsWith('/nonexistent/')))errs.push(r.status()+' '+r.url());});
    await pg.goto('http://localhost:8765'+u,{waitUntil:'load'});await pg.waitForTimeout(150);
    const info=await pg.evaluate(()=>({title:document.title,desc:(document.querySelector('meta[name=description]')||{}).content,canon:(document.querySelector('link[rel=canonical]')||{}).href,h1:[...document.querySelectorAll('h1')].map(h=>h.textContent.trim()),
      ld:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>{try{return JSON.parse(s.textContent)['@type']}catch(e){return 'BROKEN'}}),
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,links:[...document.querySelectorAll('a[href^="/"]')].map(a=>a.getAttribute('href')),
      imgs:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src).filter(s=>!/lazy/.test(s)).length, lazyBroken:[...document.images].filter(i=>i.loading!=='lazy'&&!i.naturalWidth).map(i=>i.src)}));
    if(urls.includes(u)){
      if(info.canon!=='https://kyochika.jp'+u)problems.push(u+' canonical '+info.canon);
      if(titles[info.title])problems.push('dup title '+u+' = '+titles[info.title]);titles[info.title]=u;
      if(descs[info.desc])problems.push('dup desc '+u+' = '+descs[info.desc]);descs[info.desc]=u;
      if(info.h1.length!==1)problems.push(u+' h1 count '+info.h1.length);
      if(info.ld.includes('BROKEN')||!info.ld.length)problems.push(u+' ld '+info.ld);
    }
    if(info.overflow>0)problems.push(u+' overflow '+info.overflow);
    if(info.lazyBroken.length)problems.push(u+' broken img '+info.lazyBroken);
    if(errs.length)problems.push(u+' '+errs.join(' | '));
    info.links.forEach(l=>seenLinks.add(l));
    if(process.argv[2]&&['/','/event/ikegami-honmonji-oeshiki-2026/','/festival/','/area/ueno/'].includes(u))await pg.screenshot({path:'seo_'+(u.replace(/\W+/g,'_')||'top')+'.png',fullPage:true});
    if(u==='/')console.log('TOP',JSON.stringify({t:info.title,h1:info.h1,ld:info.ld,first:await pg.evaluate(()=>document.querySelector('#list h2 a')&&document.querySelector('#list h2 a').getAttribute('href')),n:await pg.evaluate(()=>document.querySelectorAll('#list .ev').length)}));
    if(u==='/event/nact-louvre-renaissance/')console.log('EV',JSON.stringify({t:info.title,d:info.desc,ld:info.ld}));
    await pg.close();
  }
  for(const l of seenLinks){const f=path.join(ROOT,l.endsWith('/')?l+'index.html':l);if(!fs.existsSync(f))bad404.push(l);}
  console.log('pages',urls.length,'internal links',seenLinks.size,'dead',bad404);
  console.log('title lengths max',Math.max(...Object.keys(titles).map(t=>t.length)),'desc lengths', Math.min(...Object.keys(descs).map(t=>t.length)),Math.max(...Object.keys(descs).map(t=>t.length)));
  console.log(problems.length?problems.join('\n'):'NO PROBLEMS');
  await b.close();srv.close();
})();
