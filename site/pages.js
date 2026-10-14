// 終わった催しに印をつける（ページを作りなおす前でも、古い情報のまま見せないため）。
(function(){
  var n=new Date(),p=function(x){return String(x).padStart(2,'0')},today=n.getFullYear()+'-'+p(n.getMonth()+1)+'-'+p(n.getDate());
  document.querySelectorAll('[data-e]').forEach(function(el){
    if(el.dataset.e>=today)return;
    if(el.hasAttribute('data-detail')){var m=document.createElement('p');m.className='over';m.textContent='この催しは終わりました。';var b=el.querySelector('.body');b.insertBefore(m,b.firstChild);}
    else{el.classList.add('ended');var s=document.createElement('span');s.className='bd next';s.textContent='終了しました';var h=el.querySelector('h2');h.parentNode.insertBefore(s,h.nextSibling);s.style.alignSelf='flex-start';el.parentNode.appendChild(el);}
  });
  document.querySelectorAll('[data-until]').forEach(function(el){if(el.dataset.until<today)el.hidden=false;});
  var ib=document.getElementById('inst'),dp=null;
  if(ib){window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;ib.hidden=false;});ib.addEventListener('click',function(){if(dp){dp.prompt();dp=null;ib.hidden=true;}});}
  // 行きたいリスト（このブラウザの中だけに保存。登録はいらない）
  var K='kyochika_fav',get=function(){try{return JSON.parse(localStorage.getItem(K)||'[]')}catch(e){return []}},put=function(a){try{localStorage.setItem(K,JSON.stringify(a))}catch(e){}};
  document.querySelectorAll('[data-fav]').forEach(function(b){
    var id=b.dataset.fav,paint=function(){var on=get().indexOf(id)>=0;b.textContent=on?'★ 行きたいに保存済み':'☆ 行きたいに保存';b.setAttribute('aria-pressed',on);var l=document.getElementById('favlink');if(l)l.hidden=!get().length;};
    paint();
    b.addEventListener('click',function(){var a=get(),i=a.indexOf(id);if(i>=0)a.splice(i,1);else{a.push(id);if(window.gtag)gtag('event','fav_add',{ev_id:id});}put(a);paint();});
  });
})();
