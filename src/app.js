(function(){
  const $=id=>document.getElementById(id);
  const pad=n=>String(n).padStart(2,'0');
  const KTR=typeof KT!=='undefined'?KT:null,PRE=KTR?KTR.pre:'',LG=KTR?KTR.lang:'ja';
  const U=KTR?KTR.ui:{today:'きょう',hol:'・祝',nowOnly:'いまから間に合う',free:'無料',soon:'もうすぐ終わる',night:'夜19時以降もやっている',ig:'インスタだけの告知',board:'{d}・{from}から近い順',n:'{n}件',start:'{o} 開演',lastDay:'きょうが最終日',until:'{d}まで',now:'いま開催中',fromT:'{o}から',over:'きょうは終了',endsToday:'きょうまで',left:'あと{n}日',time:'時間',dist:'距離',price:'料金',fromSt:'{s}から',near:'すぐ',walk:'徒歩で約{n}分',train:'電車などで約{n}分',km:'{k}km、{t}',details:'くわしく見る',official:'公式ページ',igpost:'インスタの告知',igbd:'インスタで告知',alt:'{p}の写真',sta:'（{s}駅）',empty:'この日・この条件に合う催しは、いまの掲載分にはありません。しぼりこみを外すか、別の日をえらんでください。'};
  const U2={ja:{tomorrow:'あした',yest:'きのう',plNext:'次の日',plPrev:'前の日',walkTo:'{s}から',here:'現在地から',other:'ほかの駅からさがす',locating:'現在地を確かめています…',locFail:'現在地がわかりませんでした。駅をえらんでください。',hereName:'現在地',kA:'0〜2歳と',kB:'3〜6歳と',kC:'小学生と',kid:'子ども',c_dog:'🐕 愛犬と',c_bf:'車椅子OK',c_stroller:'ベビーカーOK'},en:{tomorrow:'Tomorrow',yest:'Yesterday',plNext:'Next day',plPrev:'Previous day',walkTo:'from {s}',here:'Near me',other:'Start from another station',locating:'Finding your location…',locFail:'Could not get your location. Please choose a station.',hereName:'your location',kA:'Ages 0–2',kB:'Ages 3–6',kC:'Ages 6–12',kid:'Kids',c_dog:'🐕 Dog-friendly',c_bf:'Wheelchair OK',c_stroller:'Stroller OK'},zh:{tomorrow:'明天',yest:'昨天',plNext:'后一天',plPrev:'前一天',walkTo:'从{s}',here:'从当前位置',other:'从其他车站出发',locating:'正在获取当前位置…',locFail:'无法获取当前位置，请选择车站。',hereName:'当前位置',kA:'0–2岁',kB:'3–6岁',kC:'6–12岁',kid:'儿童',c_dog:'🐕 可带狗',c_bf:'轮椅可通行',c_stroller:'婴儿车可进'},es:{tomorrow:'Mañana',yest:'Ayer',plNext:'Día siguiente',plPrev:'Día anterior',walkTo:'desde {s}',here:'Cerca de mí',other:'Salir desde otra estación',locating:'Buscando tu ubicación…',locFail:'No se pudo obtener tu ubicación. Elige una estación.',hereName:'tu ubicación',kA:'0–2 años',kB:'3–6 años',kC:'6–12 años',kid:'Niños',c_dog:'🐕 Con perro',c_bf:'Silla de ruedas',c_stroller:'Con carrito'},th:{tomorrow:'พรุ่งนี้',yest:'เมื่อวาน',plNext:'วันถัดไป',plPrev:'วันก่อนหน้า',walkTo:'จาก {s}',here:'ใกล้ฉัน',other:'ออกจากสถานีอื่น',locating:'กำลังหาตำแหน่งของคุณ…',locFail:'หาตำแหน่งไม่ได้ กรุณาเลือกสถานี',hereName:'ตำแหน่งของคุณ',kA:'0–2 ขวบ',kB:'3–6 ขวบ',kC:'6–12 ขวบ',kid:'เด็ก',c_dog:'🐕 พาน้องหมาได้',c_bf:'วีลแชร์เข้าได้',c_stroller:'รถเข็นเด็กเข้าได้'},id:{tomorrow:'Besok',yest:'Kemarin',plNext:'Hari berikutnya',plPrev:'Hari sebelumnya',walkTo:'dari {s}',here:'Dekat saya',other:'Berangkat dari stasiun lain',locating:'Mencari lokasimu…',locFail:'Lokasi tidak ditemukan. Silakan pilih stasiun.',hereName:'lokasimu',kA:'0–2 tahun',kB:'3–6 tahun',kC:'6–12 tahun',kid:'Anak',c_dog:'🐕 Boleh bawa anjing',c_bf:'Ramah kursi roda',c_stroller:'Boleh stroller'}}[LG]||{};
  for(const k in U2) if(!(k in U)) U[k]=U2[k];
  const POP=['渋谷','新宿','池袋','東京','銀座','上野','表参道','六本木','恵比寿','下北沢','吉祥寺','品川'];
  const f=(s,o)=>s.replace(/\{(\w+)\}/g,(m,k)=>o[k]);
  const tT=ev=>KTR?KTR.e[ev.id][0]:ev.t,tN=ev=>KTR?KTR.e[ev.id][1]:ev.note,tV=ev=>KTR?KTR.v[ev.v]:ev.v,tS=s=>s==='__here'?U.hereName:(KTR?(KTR.st[s]||(SPOTS[s]&&SPOTS[s][LG==='zh'?3:2])||s):s),tP=ev=>KTR?KTR.p[ev.price]:ev.price,tG=k=>KTR?KTR.g[k]:GENRES[k].n;
  const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],DE=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],DZ=['周日','周一','周二','周三','周四','周五','周六'],LOC={es:'es-ES',th:'th-TH',id:'id-ID'}[LG],DX={es:['dom','lun','mar','mié','jue','vie','sáb'],th:['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'],id:['Min','Sen','Sel','Rab','Kam','Jum','Sab']}[LG],HX={es:', festivo',th:' วันหยุด',id:', libur'}[LG];
  const day=iso=>{if(LG==='ja')return md(iso);const p=iso.split('-').map(Number),w=dowOf(iso),h=HOLIDAYS[iso];if(LOC){let m;try{m=new Intl.DateTimeFormat(LOC,{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(Date.UTC(p[0],p[1]-1,p[2])));}catch(e){m=`${p[2]}/${p[1]}`;}return `${m} (${DX[w]}${h?HX:''})`;}return LG==='en'?`${MON[p[1]-1]} ${p[2]} (${DE[w]}${h?', holiday':''})`:`${p[1]}月${p[2]}日(${DZ[w]}${h?'·假日':''})`;};
  const dshort=d=>LG==='ja'?DOWS[dowOf(d)]+(HOLIDAYS[d]?U.hol:''):(DX||(LG==='zh'?DZ:DE))[dowOf(d)];
  const TL=LG==='ja'?'〜':'–',PO=LG==='ja'?'（':' (',PC=LG==='ja'?'）':')';
  const trav=d=>d<=1.5?f(U.walk,{n:Math.max(1,Math.round(d*16))}):f(U.train,{n:Math.round((10+d*2.5)/5)*5});
  const now=new Date(),todayIso=now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate());
  // きょうから7日分をえらべるようにする。
  const DAYS=Array.from({length:7},(_,i)=>isoOf(dayNum(todayIso)+i));
  const HASIG=EV.some(ev=>ev.ig),HASKID=EV.some(ev=>ev.kid),HASC=k=>EV.some(ev=>ev[k]&&ev.e>=todayIso);const KR={kA:[0,2],kB:[3,6],kC:[6,12]};
  const kidTxt=k=>LG==='ja'?(k[1]>=99?`親子で・${k[0]}歳から`:`${k[0]}歳〜${k[1]===12?'小学生':k[1]===15?'中学生':k[1]+'歳'}`):LG==='es'?(k[1]>=99?`En familia, desde ${k[0]} años`:`Niños de ${k[0]} a ${k[1]}`):LG==='th'?(k[1]>=99?`ครอบครัว ${k[0]} ขวบขึ้นไป`:`เด็ก ${k[0]}–${k[1]} ขวบ`):LG==='id'?(k[1]>=99?`Keluarga, usia ${k[0]}+`:`Anak ${k[0]}–${k[1]} th`):LG==='en'?(k[1]>=99?`Family, ages ${k[0]}+`:`Kids ${k[0]}–${k[1]}`):(k[1]>=99?`亲子·${k[0]}岁起`:`${k[0]}–${k[1]}岁`);
  const st={day:todayIso,from:'渋谷',genres:new Set(Object.keys(GENRES).filter(k=>EV.some(ev=>ev.g===k))),free:false,soon:false,night:false,nowOnly:false,ig:false,anime:false,kA:false,kB:false,kC:false,dog:false,bf:false,stroller:false,area:''};
  try{const s=JSON.parse(localStorage.getItem('kyochika')||'null');if(s&&SPOTS[s.from])st.from=s.from;}catch(e){}
  const save=()=>{try{localStorage.setItem('kyochika',JSON.stringify({from:st.from}));}catch(e){}};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isIso=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&isoOf(dayNum(v))===v;
  // ほかのページの検索欄から来たとき（/?d=日付&s=駅）。10/16〜
  try{const q=new URLSearchParams(location.search),qd=q.get('d'),qs=q.get('s');if(qd&&isIso(qd)&&DAYS.includes(qd))st.day=qd;if(qs&&SPOTS[qs]){st.from=qs;save();}const qc=q.get('c');if(qc==='kid'){st.kA=st.kB=st.kC=true;}else if(['free','dog','bf','stroller','night'].includes(qc)){st[qc]=true;}if(qd||qs||qc){window.__kq=qc||'';}}catch(e){}

  function render(){
    const isToday=st.day===todayIso;
    if($('plBig')){const i=dayNum(st.day)-dayNum(todayIso);$('plBig').textContent=i===0?U.today:i===1?U.tomorrow:day(st.day);$('plSub').textContent=LG==='ja'?(Number(st.day.slice(5,7))+'月'+Number(st.day.slice(8))+'日 '+DOWS[dowOf(st.day)]+'曜日'+(HOLIDAYS[st.day]?'・'+HOLIDAYS[st.day]:'')):day(st.day);
      const pv=isoOf(dayNum(st.day)-1),nx=isoOf(dayNum(st.day)+1);$('plPrev').disabled=i<=0;$('plPrev').dataset.d=pv;$('plNext').dataset.d=nx;$('plPrevT').textContent=i<=0?'':(i===1?U.today:dshort(pv)+' '+Number(pv.slice(8)));$('plNextT').textContent=i===0?U.tomorrow:dshort(nx)+' '+Number(nx.slice(8));
      if($('plHira')){const big=$('plBig');big.textContent=i===0?'今日':i===1?'明日':Number(st.day.slice(5,7))+'/'+Number(st.day.slice(8));big.classList.toggle('dt',i>1);$('plHira').textContent=i===0?'きょう':i===1?'あした':DOWS[dowOf(st.day)]+'曜日';$('plRoma').textContent=i===0?'Kyo':i===1?'Ashita':'';$('plNo').textContent=Number(st.day.slice(8));$('plPrevR').textContent=i===1?'Kyo':'';$('plNextR').textContent=i===0?'Ashita':'';}}
    $('days').innerHTML=DAYS.map(d=>`<button class="day" type="button" data-act="day" data-d="${d}" aria-pressed="${st.day===d}"><b>${Number(d.slice(8))}</b><span class="${HOLIDAYS[d]||dowOf(d)===0?'hol':''}">${d===todayIso?U.today:dshort(d)}</span></button>`).join('');
    if(document.activeElement!==$('otherDay'))$('otherDay').value=DAYS.includes(st.day)?'':st.day;
    const chips=POP.filter(k=>SPOTS[k]); if(st.from!=='__here'&&!chips.includes(st.from)) chips.push(st.from);
    $('from').innerHTML=`<button class="chip here" type="button" data-act="here" aria-pressed="${st.from==='__here'}">${U.here}</button>`+chips.map(k=>`<button class="chip" type="button" data-act="from" data-k="${k}" aria-pressed="${st.from===k}">${esc(tS(k))}</button>`).join('');
    if(!$('fromSel')){const s=document.createElement('select');s.id='fromSel';s.className='fromsel';s.setAttribute('aria-label',U.other);$('from').after(s);s.addEventListener('change',e=>{if(SPOTS[e.target.value]){st.from=e.target.value;save();render();}});const m=document.createElement('p');m.id='fromMsg';m.className='frommsg';m.hidden=true;s.after(m);}
    const GL=LG==='ja'?0:LG==='zh'?2:1; $('fromSel').innerHTML=`<option value="">${U.other}</option>`+(typeof SPOT_GROUPS!=='undefined'?SPOT_GROUPS:[['',[],'',Object.keys(SPOTS)]]).map(g=>`<optgroup label="${esc(g[GL])}">${g[3].filter(k=>SPOTS[k]).map(k=>`<option value="${k}"${st.from===k?' selected':''}>${esc(tS(k))}</option>`).join('')}</optgroup>`).join('');
    $('genres').innerHTML=Object.keys(GENRES).filter(k=>EV.some(ev=>ev.g===k)).map(k=>`<button class="chip g" style="--c:var(--${k})" type="button" data-act="genre" data-k="${k}" aria-pressed="${st.genres.has(k)}">${tG(k)}</button>`).join('')+`<button class="chip" style="--c:#009944" type="button" data-act="flag" data-k="free" aria-pressed="${st.free}">${LG==='ja'?'無料':U.free}</button>`+(EV.some(ev=>(ev.k||[]).includes('anime'))?`<button class="chip" style="--c:#e4007f" type="button" data-act="flag" data-k="anime" aria-pressed="${st.anime}">${LG==='ja'?'アニメ・漫画':LG==='zh'?'动漫':'Anime & manga'}</button>`:'')+(EV.some(ev=>ev.dog)?`<button class="chip" style="--c:#a0662d" type="button" data-act="flag" data-k="dog" aria-pressed="${st.dog}">${LG==='ja'?'ワンちゃんイベント':U.c_dog}</button>`:'');
    const fl=(k,label)=>`<button class="chip" type="button" data-act="flag" data-k="${k}" aria-pressed="${st[k]}">${label}</button>`;
    $('filters').innerHTML=(isToday?fl('nowOnly',U.nowOnly):'')+fl('free',U.free)+fl('soon',U.soon)+fl('night',U.night)+(HASIG?fl('ig',U.ig):'')+(HASKID?fl('kA',U.kA)+fl('kB',U.kB)+fl('kC',U.kC):'')+['dog','bf','stroller'].filter(HASC).map(k=>fl(k,U['c_'+k])).join('');
    let rows=search({day:st.day,from:st.from,genres:st.genres,free:st.free,soon:st.soon,night:st.night,nowOnly:isToday&&st.nowOnly,nowMin:isToday?now.getHours()*60+now.getMinutes():null});
    if(st.ig)rows=rows.filter(r=>r.ev.ig);
    for(const k of ['dog','bf','stroller'])if(st[k])rows=rows.filter(r=>r.ev[k]);
    if(st.anime)rows=rows.filter(r=>(r.ev.k||[]).includes('anime'));
    if(st.area&&typeof AREAS_UI!=='undefined'&&AREAS_UI[st.area])rows=rows.filter(r=>AREAS_UI[st.area].includes(r.ev.st));
    document.querySelectorAll('[data-act="area"]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.k===st.area)));document.querySelectorAll('[data-act="igline"]').forEach(x=>x.setAttribute('aria-pressed',String(st.ig)));
    const ks=['kA','kB','kC'].filter(k=>st[k]);if(ks.length)rows=rows.filter(r=>r.ev.kid&&ks.some(k=>r.ev.kid[0]<=KR[k][1]&&r.ev.kid[1]>=KR[k][0]));
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
      if(ev.kid)bd.push(`<span class="bd kid">${LG==='ja'?U.kid+' ':''}${kidTxt(ev.kid)}</span>`);
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
  // トップの「子どもと」の年齢ボタンの押された状態を、しぼりこみの状態にあわせる
  const KN={ja:'{a}は子どもと行ける催しがないので、いちばん近い{b}にしました',en:'Nothing for kids on {a}, so we moved to the nearest day: {b}',zh:'{a}没有适合带孩子的活动，已改为最近的{b}',es:'No hay nada para niños el {a}; pasamos al día más cercano: {b}',th:'{a} ไม่มีงานสำหรับเด็ก จึงเปลี่ยนเป็นวันที่ใกล้ที่สุด: {b}',id:'Tidak ada acara anak pada {a}, jadi kami pindah ke hari terdekat: {b}'};
  function kidHit(d){const ks=['kA','kB','kC'].filter(k=>st[k]);return search({day:d,from:st.from,genres:st.genres,free:st.free,soon:st.soon,night:st.night,nowOnly:false,nowMin:null}).some(r=>(!st.ig||r.ev.ig)&&r.ev.kid&&ks.some(k=>r.ev.kid[0]<=KR[k][1]&&r.ev.kid[1]>=KR[k][0]));}
  function kidSync(){const all=st.kA&&st.kB&&st.kC;document.querySelectorAll('[data-act="kidage"]').forEach(x=>{const k=x.dataset.k;x.setAttribute('aria-pressed',String(k==='all'?all:(!all&&!!st[k])));});}
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-act]');if(!b)return;
    const a=b.dataset.act;
    if(a==='pick'){pickOne();return;}
    if(a==='igline'){st.ig=!st.ig;b.setAttribute('aria-pressed',String(st.ig));render();kidSync();if(st.ig){const bd=$('board');if(bd)bd.scrollIntoView({behavior:'smooth',block:'start'});}return;}
    if(a==='area'){const k=b.dataset.k;st.area=st.area===k?'':k;if(st.area&&typeof AREAS_UI!=='undefined'){const s0=(AREAS_UI[k]||[]).find(x=>SPOTS[x]);if(s0)st.from=s0;}render();if(st.area){const bd=$('board');if(bd)bd.scrollIntoView({behavior:'smooth',block:'start'});}return;}
    if(a==='kidopen'){const p=$('kidAges');if(p){p.hidden=!p.hidden;b.setAttribute('aria-expanded',String(!p.hidden));}return;}
    if(a==='kidage'){const k=b.dataset.k,on=k==='all'?!(st.kA&&st.kB&&st.kC):!(st[k]&&!['kA','kB','kC'].some(x=>x!==k&&st[x]));['kA','kB','kC'].forEach(x=>st[x]=on&&(k==='all'||x===k));
      // えらんだ日にあう催しがなければ、いちばん近い日に動かして、そのことを書く
      let note='';if(on&&!kidHit(st.day)){for(let i=1;i<=60;i++){const d=isoOf(dayNum(st.day)+i);if(kidHit(d)){note=f(KN[LG]||KN.ja,{a:day(st.day),b:day(d)});st.day=d;break;}}}
      const kn=$('kidNote');if(kn){kn.textContent=note;kn.hidden=!note;}
      render();kidSync();if(on){const bd=$('board');if(bd)bd.scrollIntoView({behavior:'smooth',block:'start'});}return;}
    if(a==='day'||a==='dstep')st.day=b.dataset.d;
    else if(a==='from'){st.from=b.dataset.k;save();}
    else if(a==='here'){const msg=$('fromMsg');if(!navigator.geolocation){msg.textContent=U.locFail;msg.hidden=false;return;}msg.textContent=U.locating;msg.hidden=false;navigator.geolocation.getCurrentPosition(p=>{SPOTS.__here=[p.coords.latitude,p.coords.longitude];st.from='__here';msg.hidden=true;render();},()=>{msg.textContent=U.locFail;msg.hidden=false;},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});return;}
    else if(a==='genre'){const k=b.dataset.k,ALL=Object.keys(GENRES).filter(x=>EV.some(ev=>ev.g===x));if(st.genres.size>=ALL.length)st.genres=new Set([k]);else if(st.genres.has(k)){st.genres.delete(k);if(!st.genres.size)st.genres=new Set(ALL);}else st.genres.add(k);}
    else if(a==='flag')st[b.dataset.k]=!st[b.dataset.k];
    render();kidSync();
  });
  $('otherDay').addEventListener('change',e=>{if(isIso(e.target.value)){st.day=e.target.value;render();}});
  if($('join')&&typeof CONFIG!=='undefined'&&/^https:\/\//.test(CONFIG.registerUrl||'')){$('joinLink').href=CONFIG.registerUrl;$('join').hidden=false;}
  render();
  if(typeof window.__kq==='string'){try{kidSync();if(window.__kq){const fd=document.querySelector('details.fold');if(fd)fd.open=true;}setTimeout(()=>{const bd=$('board');if(bd)bd.scrollIntoView({block:'start'});},200);}catch(e){}}
})();

// 雨の予報の日は、トップに「雨でも行ける」への案内を出す（Open-Meteo の予報。キーは不要。取れなければ何も出さない）
(function(){
  var h=document.querySelector('h1');if(!h||location.pathname!=='/')return;
  try{fetch('https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.76&daily=precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=2').then(function(r){return r.json()}).then(function(j){
    var p=(j.daily&&j.daily.precipitation_probability_max)||[];var t=p[0],m=p[1],day=null,pr=0;
    if(t>=60){day='今日';pr=t;}else if(m>=60&&new Date().getHours()>=15){day='明日';pr=m;}
    if(!day)return;
    var a=document.createElement('a');a.className='rainbar';a.href='/rainy/';
    a.textContent='☔ '+day+'の東京は雨の予報（降水確率'+pr+'%）。雨でも行けるイベントを見る →';
    a.addEventListener('click',function(){if(window.gtag)gtag('event','rain_banner_click',{day:day});});
    var ul=document.querySelector('ul.intro');(ul||h).insertAdjacentElement('afterend',a);
  }).catch(function(){});}catch(e){}
})();
