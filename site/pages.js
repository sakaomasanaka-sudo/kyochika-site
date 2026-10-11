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
})();
