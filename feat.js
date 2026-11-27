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
