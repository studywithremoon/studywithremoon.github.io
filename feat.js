(function(){
var L=localStorage,P=location.pathname.split('/').pop()||'index.html';
function g(k,d){try{var v=JSON.parse(L.getItem(k));return v==null?d:v}catch(e){return d}}
function s(k,v){try{L.setItem(k,JSON.stringify(v))}catch(e){}}
function day(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
// owner mode via link ?owner=1 (device-only flag)
try{var u=new URLSearchParams(location.search);if(u.get('owner')==='1'){L.setItem('sd-owner','1');L.setItem('skipgc','t')}if(u.get('owner')==='0'){L.removeItem('sd-owner');L.removeItem('skipgc')}}catch(e){}
// font size
var fs=g('sd-fs',100);document.documentElement.style.fontSize=fs+'%';
// study time (active seconds per day)
var tm=g('sd-time',{});
setInterval(function(){if(document.hidden)return;tm[day()]=(tm[day()]||0)+10;s('sd-time',tm)},10000);
function mark(){var a=g('sd-active',{});a[day()]=1;s('sd-active',a)}
// questions
function key(q){return P+'#'+q.dataset.qi}
var qs=[].slice.call(document.querySelectorAll('.qa.mc,.qa:has(.sh)'));
var all=[].slice.call(document.querySelectorAll('.qa'));
all.forEach(function(q,i){q.dataset.qi=i});
var pins=g('sd-pins',{});
qs.forEach(function(q){
  var b=document.createElement('button');b.type='button';b.className='pinb';b.setAttribute('aria-label','تثبيت السؤال');
  b.textContent=pins[key(q)]?'★':'☆';
  b.onclick=function(e){e.stopPropagation();var p=g('sd-pins',{});var k=key(q);if(p[k]){delete p[k];b.textContent='☆'}else{p[k]=(q.querySelector('.q').textContent||'').slice(0,90);b.textContent='★'}s('sd-pins',p)};
  q.appendChild(b)});
document.addEventListener('click',function(e){
  var b=e.target.closest('.op');
  if(b){var q=b.parentNode;if(!q.classList.contains('mc'))return;setTimeout(function(){
    var ok=b.classList.contains('ok');var st=g('sd-stats',{a:0,c:0,p:{}});st.a++;if(ok)st.c++;var pp=st.p[P]||{a:0,c:0};pp.a++;if(ok)pp.c++;st.p[P]=pp;s('sd-stats',st);mark();
    var w=g('sd-wrong',{});var k=key(q);if(!ok){w[k]=(q.querySelector('.q').textContent||'').slice(0,90)}else if(w[k]){delete w[k]}s('sd-wrong',w);
    s('sd-last',{p:P,i:+q.dataset.qi,t:document.title})},0)}
  var h=e.target.closest('.sh');if(h){mark()}
});
// open specific question ?q=N
try{var qn=new URLSearchParams(location.search).get('q');if(qn!=null){var el=all[+qn];if(el){setTimeout(function(){el.scrollIntoView({block:'center'});el.style.outline='3px solid #fbbf24'},400)}}}catch(e){}
// remember scroll for continue
window.addEventListener('scroll',function(){if(P==='index.html'||P==='dash.html')return;var l=g('sd-last',null);var best=0,bd=1e9,y=innerHeight/2;all.forEach(function(q,i){var r=q.getBoundingClientRect();var d=Math.abs(r.top-y);if(d<bd){bd=d;best=i}});if(all.length){s('sd-last',{p:P,i:best,t:document.title})}},{passive:true});
// floating controls
var f=document.createElement('div');f.className='fabs';
f.innerHTML='<a href="dash.html" aria-label="لوحتي">لوحتي</a><button type="button" id="fa1" aria-label="تكبير الخط">A+</button><button type="button" id="fa2" aria-label="تصغير الخط">A-</button><button type="button" id="fp" aria-label="طباعة">طباعة</button>';
document.body.appendChild(f);
document.getElementById('fa1').onclick=function(){fs=Math.min(150,fs+10);document.documentElement.style.fontSize=fs+'%';s('sd-fs',fs)};
document.getElementById('fa2').onclick=function(){fs=Math.max(80,fs-10);document.documentElement.style.fontSize=fs+'%';s('sd-fs',fs)};
document.getElementById('fp').onclick=function(){window.print()};
// owner badge
if(L.getItem('sd-owner')==='1'){var o=document.createElement('div');o.className='ownx';o.innerHTML='<a href="dash.html">وضع المالك</a><a href="https://studywithremoon.goatcounter.com" target="_blank" rel="noopener">الإحصاءات</a>';document.body.appendChild(o)}
// owner panel settings: banner/section hide
var cfg=g('sd-owncfg',null);
if(cfg&&cfg.banner&&P==='index.html'){var bn=document.createElement('div');bn.className='bnr';bn.textContent=cfg.banner;var m=document.querySelector('main');if(m)m.insertBefore(bn,m.firstChild)}
if(cfg&&cfg.accent){document.documentElement.style.setProperty('--owna',cfg.accent)}
})();

// PWA + extras
(function(){try{
var h=document.head;function lk(r,hr,x){var l=document.createElement('link');l.rel=r;l.href=hr;if(x)l.type=x;h.appendChild(l)}
if(!document.querySelector('link[rel=manifest]'))lk('manifest','manifest.webmanifest');
lk('apple-touch-icon','icon.svg');
if(!document.querySelector('meta[name=theme-color]')){var m=document.createElement('meta');m.name='theme-color';m.content='#0a0f1f';h.appendChild(m)}
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){});
}catch(e){}
// install button
var dp;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;var f=document.querySelector('.fabs');if(f&&!document.getElementById('fa-inst')){var b=document.createElement('button');b.type='button';b.id='fa-inst';b.textContent='تثبيت';b.onclick=function(){dp.prompt();b.remove()};f.appendChild(b)}});
// cheat sheet print
var f2=document.querySelector('.fabs');if(f2&&/^(pfb|pf|corp|crisis|law|ops)\d/.test(location.pathname.split('/').pop())){var cb=document.createElement('button');cb.type='button';cb.textContent='ورقة مراجعة';cb.onclick=function(){document.body.classList.add('cheat');window.print();setTimeout(function(){document.body.classList.remove('cheat')},500)};f2.appendChild(cb)}
// essay self-check
document.addEventListener('click',function(e){var h=e.target.closest('.sh');if(!h)return;var q=h.parentNode;if(q.querySelector('.sc'))return;var P=location.pathname.split('/').pop()||'index.html';var all=[].slice.call(document.querySelectorAll('.qa'));var key=P+'#'+all.indexOf(q);
setTimeout(function(){var d=document.createElement('div');d.className='sc';d.innerHTML='<span>قيّم نفسك:</span>';[['جاوبتها صح',1],['محتاج أراجعها',0]].forEach(function(x){var b=document.createElement('button');b.type='button';b.textContent=x[0];b.onclick=function(){var sf=JSON.parse(localStorage.getItem('sd-self')||'{}');sf[key]=x[1];localStorage.setItem('sd-self',JSON.stringify(sf));var w=JSON.parse(localStorage.getItem('sd-wrong')||'{}');if(x[1])delete w[key];else w[key]=(q.querySelector('.q').textContent||'').slice(0,90);localStorage.setItem('sd-wrong',JSON.stringify(w));d.innerHTML='<span>'+(x[1]?'تمام، كمّل':'اتسجلت للمراجعة')+'</span>'};d.appendChild(b)});q.appendChild(d)},0)});
})();

(function(){var f=document.querySelector('.fabs');if(!f)return;var t=document.createElement('button');t.type='button';t.className='fabt';t.textContent='☰';t.setAttribute('aria-label','القائمة');t.onclick=function(){f.classList.toggle('open');t.textContent=f.classList.contains('open')?'✕':'☰'};f.insertBefore(t,f.firstChild)})();

(function(){var P=location.pathname.split('/').pop();if(P===''||P==='index.html'){var s=document.createElement('script');s.src='welcome.js?v=1';s.defer=true;document.body.appendChild(s)}})();

// stickers
window.SD_STKLOAD=function(cb){if(window.SD_STK)return cb(window.SD_STK);var s=document.createElement('script');s.src='stickers.js?v=1';s.onload=function(){cb(window.SD_STK)};document.body.appendChild(s)};
(function(){var st=document.createElement('style');st.textContent='.stk{position:fixed;bottom:72px;inset-inline-end:10px;width:92px;height:92px;object-fit:cover;border-radius:18px;border:2px solid #fbbf24;z-index:60;pointer-events:none;animation:stkp .35s cubic-bezier(.2,1.5,.4,1) both,stko .4s 2.1s ease forwards;box-shadow:0 6px 18px rgba(0,0,0,.4)}.stki{width:84px;height:84px;object-fit:cover;border-radius:16px;border:2px solid #fbbf24;display:block;margin:10px auto 0}@keyframes stkp{from{transform:scale(.2) rotate(-12deg);opacity:0}to{transform:none;opacity:1}}@keyframes stko{to{opacity:0;transform:translateY(12px)}}@media print{.stk{display:none}}';document.head.appendChild(st);
window.SD_TOAST=function(i){SD_STKLOAD(function(a){var m=document.createElement('img');m.className='stk';m.alt='';m.src=a[i];document.body.appendChild(m);setTimeout(function(){m.remove()},2600)})};
document.addEventListener('click',function(e){var b=e.target.closest('.op');if(!b||!b.parentNode.classList.contains('mc')||b.parentNode.closest('#pr'))return;setTimeout(function(){if(b.classList.contains('ok')){SD_TOAST(0)}},60)});
})();
