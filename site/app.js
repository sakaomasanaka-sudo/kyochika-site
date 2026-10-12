(function(){
  const $=id=>document.getElementById(id);
  const pad=n=>String(n).padStart(2,'0');
  const KTR=typeof KT!=='undefined'?KT:null,PRE=KTR?KTR.pre:'',LG=KTR?KTR.lang:'ja';
  const U=KTR?KTR.ui:{today:'きょう',hol:'・祝',nowOnly:'いまから間に合う',free:'無料',soon:'もうすぐ終わる',night:'夜19時以降もやっている',ig:'インスタ告知',board:'{d}・{from}から近い順',n:'{n}件',start:'{o} 開演',lastDay:'きょうが最終日',until:'{d}まで',now:'いま開催中',fromT:'{o}から',over:'きょうは終了',endsToday:'きょうまで',left:'あと{n}日',time:'時間',dist:'距離',price:'料金',fromSt:'{s}から',near:'すぐ',walk:'徒歩で約{n}分',train:'電車などで約{n}分',km:'{k}km、{t}',details:'くわしく見る',official:'公式ページ',igpost:'インスタの告知',igbd:'インスタで告知',alt:'{p}の写真',sta:'（{s}駅）',empty:'この日・この条件に合う催しは、いまの掲載分にはありません。しぼりこみを外すか、別の日をえらんでください。'};
  const U2={ja:{tomorrow:'あした',yest:'きのう',plNext:'次の日',plPrev:'前の日',walkTo:'{s}から',here:'現在地から',other:'ほかの駅からさがす',locating:'現在地を確かめています…',locFail:'現在地がわかりませんでした。駅をえらんでください。',hereName:'現在地'},en:{tomorrow:'Tomorrow',yest:'Yesterday',plNext:'Next day',plPrev:'Previous day',walkTo:'from {s}',here:'Near me',other:'Start from another station',locating:'Finding your location…',locFail:'Could not get your location. Please choose a station.',hereName:'your location'},zh:{tomorrow:'明天',yest:'昨天',plNext:'后一天',plPrev:'前一天',walkTo:'从{s}',here:'从当前位置',other:'从其他车站出发',locating:'正在获取当前位置…',locFail:'无法获取当前位置，请选择车站。',hereName:'当前位置'}}[LG]||{};
  for(const k in U2) if(!(k in U)) U[k]=U2[k];
  const POP=['渋谷','新宿','池袋','東京','銀座','上野','表参道','六本木','恵比寿','下北沢','吉祥寺','品川'];
  const f=(s,o)=>s.replace(/\{(\w+)\}/g,(m,k)=>o[k]);
  const tT=ev=>KTR?KTR.e[ev.id][0]:ev.t,tN=ev=>KTR?KTR.e[ev.id][1]:ev.note,tV=ev=>KTR?KTR.v[ev.v]:ev.v,tS=s=>s==='__here'?U.hereName:(KTR?(KTR.st[s]||(SPOTS[s]&&SPOTS[s][LG==='en'?2:3])||s):s),tP=ev=>KTR?KTR.p[ev.price]:ev.price,tG=k=>KTR?KTR.g[k]:GENRES[k].n;
  const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],DE=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],DZ=['周日','周一','周二','周三','周四','周五','周六'];
  const day=iso=>{if(LG==='ja')return md(iso);const p=iso.split('-').map(Number),w=dowOf(iso),h=HOLIDAYS[iso];return LG==='en'?`${MON[p[1]-1]} ${p[2]} (${DE[w]}${h?', holiday':''})`:`${p[1]}月${p[2]}日(${DZ[w]}${h?'·假日':''})`;};
  const dshort=d=>LG==='ja'?DOWS[dowOf(d)]+(HOLIDAYS[d]?U.hol:''):(LG==='en'?DE:DZ)[dowOf(d)];
  const TL=LG==='ja'?'〜':'–',PO=LG==='ja'?'（':' (',PC=LG==='ja'?'）':')';
  const trav=d=>d<=1.5?f(U.walk,{n:Math.max(1,Math.round(d*16))}):f(U.train,{n:Math.round((10+d*2.5)/5)*5});
  const now=new Date(),todayIso=now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate());
  // きょうから7日分をえらべるようにする。
  const DAYS=Array.from({length:7},(_,i)=>isoOf(dayNum(todayIso)+i));
  const HASIG=EV.some(ev=>ev.ig);
  const st={day:todayIso,from:'渋谷',genres:new Set(Object.keys(GENRES).filter(k=>EV.some(ev=>ev.g===k))),free:false,soon:false,night:false,nowOnly:false,ig:false};
  try{const s=JSON.parse(localStorage.getItem('kyochika')||'null');if(s&&SPOTS[s.from])st.from=s.from;}catch(e){}
  const save=()=>{try{localStorage.setItem('kyochika',JSON.stringify({from:st.from}));}catch(e){}};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isIso=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&isoOf(dayNum(v))===v;

  function render(){
    const isToday=st.day===todayIso;
    if($('plBig')){const i=dayNum(st.day)-dayNum(todayIso);$('plBig').textContent=i===0?U.today:i===1?U.tomorrow:day(st.day);$('plSub').textContent=LG==='ja'?(Number(st.day.slice(5,7))+'月'+Number(st.day.slice(8))+'日 '+DOWS[dowOf(st.day)]+'曜日'+(HOLIDAYS[st.day]?'・'+HOLIDAYS[st.day]:'')):day(st.day);
      const pv=isoOf(dayNum(st.day)-1),nx=isoOf(dayNum(st.day)+1);$('plPrev').disabled=i<=0;$('plPrev').dataset.d=pv;$('plNext').dataset.d=nx;$('plPrevT').textContent=i<=0?'':(i===1?U.today:dshort(pv)+' '+Number(pv.slice(8)));$('plNextT').textContent=i===0?U.tomorrow:dshort(nx)+' '+Number(nx.slice(8));}
    $('days').innerHTML=DAYS.map(d=>`<button class="day" type="button" data-act="day" data-d="${d}" aria-pressed="${st.day===d}"><b>${Number(d.slice(8))}</b><span class="${HOLIDAYS[d]||dowOf(d)===0?'hol':''}">${d===todayIso?U.today:dshort(d)}</span></button>`).join('');
    if(document.activeElement!==$('otherDay'))$('otherDay').value=DAYS.includes(st.day)?'':st.day;
    const chips=POP.filter(k=>SPOTS[k]); if(st.from!=='__here'&&!chips.includes(st.from)) chips.push(st.from);
    $('from').innerHTML=`<button class="chip here" type="button" data-act="here" aria-pressed="${st.from==='__here'}">${U.here}</button>`+chips.map(k=>`<button class="chip" type="button" data-act="from" data-k="${k}" aria-pressed="${st.from===k}">${esc(tS(k))}</button>`).join('');
    if(!$('fromSel')){const s=document.createElement('select');s.id='fromSel';s.className='fromsel';s.setAttribute('aria-label',U.other);$('from').after(s);s.addEventListener('change',e=>{if(SPOTS[e.target.value]){st.from=e.target.value;save();render();}});const m=document.createElement('p');m.id='fromMsg';m.className='frommsg';m.hidden=true;s.after(m);}
    const GL=LG==='en'?1:LG==='zh'?2:0; $('fromSel').innerHTML=`<option value="">${U.other}</option>`+(typeof SPOT_GROUPS!=='undefined'?SPOT_GROUPS:[['',[],'',Object.keys(SPOTS)]]).map(g=>`<optgroup label="${esc(g[GL])}">${g[3].filter(k=>SPOTS[k]).map(k=>`<option value="${k}"${st.from===k?' selected':''}>${esc(tS(k))}</option>`).join('')}</optgroup>`).join('');
    $('genres').innerHTML=Object.keys(GENRES).filter(k=>EV.some(ev=>ev.g===k)).map(k=>`<button class="chip g" style="--c:var(--${k})" type="button" data-act="genre" data-k="${k}" aria-pressed="${st.genres.has(k)}">${tG(k)}</button>`).join('');
    const fl=(k,label)=>`<button class="chip" type="button" data-act="flag" data-k="${k}" aria-pressed="${st[k]}">${label}</button>`;
    $('filters').innerHTML=(isToday?fl('nowOnly',U.nowOnly):'')+fl('free',U.free)+fl('soon',U.soon)+fl('night',U.night)+(HASIG?fl('ig',U.ig):'');
    let rows=search({day:st.day,from:st.from,genres:st.genres,free:st.free,soon:st.soon,night:st.night,nowOnly:isToday&&st.nowOnly,nowMin:isToday?now.getHours()*60+now.getMinutes():null});
    if(st.ig)rows=rows.filter(r=>r.ev.ig);
    $('board').innerHTML=`<span>${f(U.board,{d:day(st.day),from:esc(tS(st.from))})}</span><b>${f(U.n,{n:rows.length})}</b>`;
    $('list').innerHTML=rows.length?rows.map(r=>{
      const ev=r.ev,left=daysLeft(ev,st.day),oneDay=ev.s===ev.e,c=closeOn(ev,st.day),o=openOn(ev,st.day);
      const when=ev.g==='live'?`${f(U.start,{o})}${oneDay?'':PO+day(ev.s)+TL+day(ev.e)+PC}`:`${o}${TL}${c}`;
      const span=oneDay?'':(left===0?U.lastDay:f(U.until,{d:day(ev.e)}));
      const bd=[];
      if(r.state==='now')bd.push(`<span class="bd now">${U.now}</span>`);
      if(r.state==='next')bd.push(`<span class="bd next">${f(U.fromT,{o})}</span>`);
      if(r.state==='over')bd.push(`<span class="bd next">${U.over}</span>`);
      if(ev.free)bd.push(`<span class="bd free">${U.free}</span>`);
      if(ev.ig)bd.push(`<span class="bd ig">${U.igbd}</span>`);
      if(longRun(ev)&&left<=7)bd.push(`<span class="bd soon">${left===0?U.endsToday:f(U.left,{n:left})}</span>`);
      const LT={art:'A',live:'L',food:'F',market:'M',festival:'S',popup:'P'}[ev.g]||'E';const no=String(rows.indexOf(r)+1).padStart(2,'0');
      const note=tN(ev);const dist=r.dist<0.1?U.near:trav(r.dist);
      return `<li class="ev" style="--c:var(--${ev.g})"><span class="sn" aria-hidden="true"><b>${LT}</b>${no}</span><div class="hd"><p class="kd">${tG(ev.g)}</p><h2><a href="${PRE}/event/${ev.id}/">${esc(tT(ev))}</a></h2><p class="where">${esc(tV(ev))}${esc(f(U.sta,{s:tS(ev.st)}))}</p></div>${ev.ph?`<a class="th" href="${PRE}/event/${ev.id}/" tabindex="-1" aria-hidden="true"><img src="/photos/${ev.ph}.jpg" alt="" width="384" height="216" loading="lazy"></a>`:''}<div class="rest"><p class="when">${when}${span?'<span>'+span+'</span>':''}</p><p class="meta"><span class="exit">${esc(f(U.walkTo,{s:tS(st.from)}))} ${dist}<small>${r.dist<0.1?'':r.dist.toFixed(1)+'km'}</small></span><span class="price">${esc(tP(ev))}</span>${bd.join('')}</p>${note?`<p class="note">${esc(note)}</p>`:''}<a class="off" href="${esc(ev.url)}" target="_blank" rel="noopener">${ev.ig?U.igpost:U.official}</a></div></li>`;
    }).join(''):`<li class="empty">${U.empty}</li>`;
    pochi();
  }
  // ── ポチカのおすすめ（日本語のトップだけ）。えらんだ日と駅に合わせて、ジャンルが重ならないように3つ。
  const hsh=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0)/4294967296;};
  const GCM={art:'ゆっくり見たい展示だよ',live:'生で聴くと、ぜんぜん違うよ',food:'おなかがすいたら、ここ',market:'掘り出しものが、あるかも',festival:'にぎやかで、楽しいよ',popup:'期間限定。いまだけだよ'};
  const why=(r,d)=>{const ev=r.ev,left=daysLeft(ev,d),wk=dowOf(d)===0||dowOf(d)===6||HOLIDAYS[d],c=[];
    if(longRun(ev)&&left===0)c.push([5,'きょうが最終日！ 間に合ううちに']);
    else if(longRun(ev)&&left<=3)c.push([4,'あと'+left+'日で終わっちゃうよ']);
    if(ev.s===ev.e&&ev.g!=='live')c.push([3,'この日だけの催しだよ']);
    if(ev.free)c.push([3,'無料で入れるよ']);
    if(ev.ig)c.push([2,'インスタだけで告知してる、知る人ぞ知る催し']);
    if(mins(closeOn(ev,d))>=20*60&&ev.g!=='live')c.push([1.5,closeOn(ev,d)+'まで開いてるよ']);
    if(wk&&(ev.g==='food'||ev.g==='market'||ev.g==='festival'))c.push([1.5,'お休みの日にぴったり']);
    if(r.dist!=null&&r.dist<1.2)c.push([1,tS(st.from)+'から歩いて行けるよ']);
    c.sort((a,b)=>b[0]-a[0]);return {sc:c.reduce((s,x)=>s+x[0],0),say:c.length?c[0][1]:GCM[ev.g]};};
  const pool=()=>{const isT=st.day===todayIso;return search({day:st.day,from:st.from,genres:new Set(Object.keys(GENRES)),nowOnly:isT,nowMin:isT?now.getHours()*60+now.getMinutes():null}).filter(r=>r.state!=='over');};
  const mini=(r,say,cls)=>{const ev=r.ev;return `<li class="${cls}" style="--c:var(--${ev.g})"><p class="pc-kd">${tG(ev.g)}</p><a class="pc-t" href="${PRE}/event/${ev.id}/">${esc(tT(ev))}</a><p class="pc-bub">${esc(say)}</p><p class="pc-w">${esc(tV(ev))}${esc(f(U.sta,{s:tS(ev.st)}))}・${r.dist<0.1?U.near:trav(r.dist)}・${esc(tP(ev))}</p></li>`;};
  function pochi(){
    if(LG!=='ja'||!$('pochi'))return;
    const i=dayNum(st.day)-dayNum(todayIso),dn=i===0?'きょう':i===1?'あした':md(st.day);
    $('pochiH').textContent='ボクのおすすめ、'+dn+'の3つ';
    $('pochiSub').textContent=tS(st.from)+'から行きやすい順に、駅に住む案内役ポチカがえらんだよ';
    const rows=pool().map(r=>{const w=why(r,st.day);return {r,say:w.say,sc:w.sc-(r.dist||0)*0.25+hsh(st.day+ev2id(r))*1.2};}).sort((a,b)=>b.sc-a.sc);
    const pick=[],used=new Set();for(const x of rows){if(used.has(x.r.ev.g))continue;used.add(x.r.ev.g);pick.push(x);if(pick.length===3)break;}
    $('pochi').hidden=!pick.length;
    $('pochiList').innerHTML=pick.map(x=>mini(x.r,x.say,'pc-i')).join('');
    $('pickOut').innerHTML='';$('pickBtn').textContent='迷ったら、ポチカに決めてもらう';
  }
  const ev2id=r=>r.ev.id;
  let lastPick=null;
  function pickOne(){
    const rows=pool().slice(0,20);if(!rows.length){$('pickOut').innerHTML='<p class="pc-none">この日は、もう行ける催しがないみたい。ほかの日にしてみて！</p>';return;}
    let r;do{r=rows[Math.floor(Math.random()*rows.length)];}while(rows.length>1&&r.ev.id===lastPick);lastPick=r.ev.id;
    const img=$('pochiImg');img.classList.remove('hop');void img.offsetWidth;img.classList.add('hop');
    $('pickOut').innerHTML=`<p class="pc-dd">ポチカのお告げ…<b>ここに決まり！</b></p><ul class="pc-one">${mini(r,why(r,st.day).say,'pc-i big')}</ul>`;
    $('pickBtn').textContent='もう1回、えらんでもらう';
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-act]');if(!b)return;
    const a=b.dataset.act;
    if(a==='pick'){pickOne();return;}
    if(a==='day'||a==='dstep')st.day=b.dataset.d;
    else if(a==='from'){st.from=b.dataset.k;save();}
    else if(a==='here'){const msg=$('fromMsg');if(!navigator.geolocation){msg.textContent=U.locFail;msg.hidden=false;return;}msg.textContent=U.locating;msg.hidden=false;navigator.geolocation.getCurrentPosition(p=>{SPOTS.__here=[p.coords.latitude,p.coords.longitude];st.from='__here';msg.hidden=true;render();},()=>{msg.textContent=U.locFail;msg.hidden=false;},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});return;}
    else if(a==='genre'){const k=b.dataset.k;if(st.genres.has(k)){if(st.genres.size>1)st.genres.delete(k);}else st.genres.add(k);}
    else if(a==='flag')st[b.dataset.k]=!st[b.dataset.k];
    render();
  });
  $('otherDay').addEventListener('change',e=>{if(isIso(e.target.value)){st.day=e.target.value;render();}});
  if($('join')&&typeof CONFIG!=='undefined'&&/^https:\/\//.test(CONFIG.registerUrl||'')){$('joinLink').href=CONFIG.registerUrl;$('join').hidden=false;}
  render();
})();
