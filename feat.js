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
if(L.getItem('sd-owner')==='1'){var o=document.createElement('div');o.className='ownx';o.innerHTML='<a href="dash.html">وضع المالك</a><a href="https://studywithremoon.goatcounter.com" target="_blank" rel="noopener">الإحصاءات</a><a href="#" id="gst">جرّب كزائر جديد</a>';document.body.appendChild(o)}
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

(function(){var P=location.pathname.split('/').pop();if(P===''||P==='index.html'){var s=document.createElement('script');s.src='welcome.js?v=3';s.defer=true;document.body.appendChild(s)}})();

// stickers
window.SD_STKLOAD=function(cb){if(window.SD_ALL)return cb(window.SD_ALL);var F=[['stickers.js?v=2','SD_STK'],['stickers2.js?v=1','SD_STK2'],['stickers3.js?v=1','SD_STK3'],['stickers4.js?v=1','SD_STK4'],['stickers5.js?v=1','SD_STK5'],['stickers6.js?v=1','SD_STK6'],['stickers7.js?v=1','SD_STK7'],['stickers8.js?v=1','SD_STK8'],['stickers9.js?v=1','SD_STK9'],['stickers10.js?v=1','SD_STK10']],n=0;function fin(){window.SD_ALL=[].concat(window.SD_STK||[],window.SD_STK2||[],window.SD_STK3||[],window.SD_STK4||[],window.SD_STK5||[],window.SD_STK6||[],window.SD_STK7||[],window.SD_STK8||[],window.SD_STK9||[],window.SD_STK10||[]);window.SD_STK=window.SD_ALL;cb(window.SD_ALL)}F.forEach(function(f){if(window[f[1]]){if(++n===F.length)fin();return}var s=document.createElement('script');s.src=f[0];s.onload=s.onerror=function(){if(++n===F.length)fin()};document.body.appendChild(s)})};

window.SD_CATS={pos:[0,1,4,5,8,21,22,27,15,28,41,34,51,53,55,57,65,66,68,72,59],neg:[13,16,17,23,26,19,3,6,29,42,32,46,54,60,62,69,56,47,58],rep:[10,12,20,7,11,30,35,46,70,56,62,54,60],bad:[2,11,12,20,7,10,30,35,48,49,61,67,71],rev:[14,24,25,19,33,31,45,63,43,50],win:[1,8,22,21,0,28,41,51,57,65,66,68,55],str:[21,22,0,8,27,5,28,57,66,72,53,65],wel:[4,53,52],sur:[9,5,4,0,1,3,6,7,8,14,15,17,24,25,26,27,18,16,29,31,33,34,36,37,38,39,40,43,28,41,44,45,50,55,58,59,63,64,65,66,68,72]};window.SD_PICK=function(a,cat){var m={};try{m=JSON.parse(localStorage.getItem('sd-stkmap')||'{}')}catch(e){}if(cat==='wel'&&new Date().getHours()>=17&&a[52])return a[52];var L=(m[cat]&&m[cat].length?m[cat]:SD_CATS[cat]||SD_CATS.neg).filter(function(i){return a[i]});window.SD_bag=window.SD_bag||{};var g=window.SD_bag[cat]=(window.SD_bag[cat]||[]).filter(function(i){return L.indexOf(i)>-1});if(!g.length){g=L.slice();for(var k=g.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),t=g[k];g[k]=g[j];g[j]=t}if(g[g.length-1]===window.SD_last&&g.length>1){g.unshift(g.pop())}window.SD_bag[cat]=g}var x=g.pop();window.SD_last=x;return a[x]};
(function(){var st=document.createElement('style');st.textContent='.stk{position:fixed;bottom:72px;inset-inline-end:10px;width:92px;height:92px;object-fit:cover;border-radius:18px;border:2px solid #fbbf24;z-index:60;pointer-events:none;animation:stkp .35s cubic-bezier(.2,1.5,.4,1) both,stko .4s 2.1s ease forwards;box-shadow:0 6px 18px rgba(0,0,0,.4)}.stki{width:84px;height:84px;object-fit:cover;border-radius:16px;border:2px solid #fbbf24;display:block;margin:10px auto 0}@keyframes stkp{from{transform:scale(.2) rotate(-12deg);opacity:0}to{transform:none;opacity:1}}@keyframes stko{to{opacity:0;transform:translateY(12px)}}@media print{.stk{display:none}}';document.head.appendChild(st);
window.SD_TOAST=function(i){if(i==='pos'){SD_ok=(window.SD_ok||0)+1;SD_wr=0;if(SD_ok%3===0)i='str'}else if(i==='neg'){SD_wr=(window.SD_wr||0)+1;SD_ok=0;if(SD_wr>=2)i='rep'}SD_STKLOAD(function(a){var m=document.createElement('img');m.className='stk';m.alt='';m.src=typeof i==='string'?SD_PICK(a,i):a[i];document.body.appendChild(m);setTimeout(function(){m.remove()},2600)})};
document.addEventListener('click',function(e){var b=e.target.closest('.op');if(!b||!b.parentNode.classList.contains('mc')||b.parentNode.closest('#pr'))return;setTimeout(function(){if(b.classList.contains('ok')){SD_TOAST('pos')}else if(b.classList.contains('no')){SD_TOAST('neg')}},60)});
})();

// guest mode: clean slate, progress backed up and restored on exit
(function(){try{var L=localStorage,K=['sd-owner','sd-bak','sd-gm'];
function ks(){var a=[];for(var i=0;i<L.length;i++){var k=L.key(i);if(k.indexOf('sd-')===0&&K.indexOf(k)<0)a.push(k)}return a}
function enter(){var b={};ks().forEach(function(k){b[k]=L.getItem(k)});L.setItem('sd-bak',JSON.stringify(b));ks().forEach(function(k){L.removeItem(k)});L.setItem('sd-gm','1');location.href='index.html'}
function leave(){var b={};try{b=JSON.parse(L.getItem('sd-bak'))||{}}catch(e){}ks().forEach(function(k){L.removeItem(k)});Object.keys(b).forEach(function(k){L.setItem(k,b[k])});L.removeItem('sd-bak');L.removeItem('sd-gm');location.href='index.html'}
var q=new URLSearchParams(location.search);
if(q.get('guest')==='1'&&L.getItem('sd-gm')!=='1'){enter();return}
if(q.get('guest')==='0'&&L.getItem('sd-gm')==='1'){leave();return}
var gs=document.getElementById('gst');if(gs)gs.onclick=function(e){e.preventDefault();if(L.getItem('sd-gm')==='1'){leave()}else enter()};
if(L.getItem('sd-gm')==='1'){var st=document.createElement('style');st.textContent='.gbn{position:fixed;top:54px;inset-inline:0;margin:auto;width:max-content;max-width:92vw;z-index:70;background:#fbbf24;color:#1a1a1a;border-radius:999px;padding:4px 14px;font:700 12px/1.6 inherit;font-family:inherit;border:0}@media print{.gbn{display:none}}';document.head.appendChild(st);var b=document.createElement('button');b.type='button';b.className='gbn';b.textContent='وضع زائر جديد (التقدم لن يُحفظ) · اضغط للخروج';b.onclick=leave;document.body.appendChild(b)}
}catch(e){}})();

// occasional surprise sticker while scrolling (rate limited, never on practice/game pages)
(function(){try{var P=location.pathname.split('/').pop()||'index.html';if(/^(practice|run)/.test(P)||matchMedia('(prefers-reduced-motion:reduce)').matches)return;var lastY=scrollY,acc=0,lastT=Date.now()-20000;addEventListener('scroll',function(){acc+=Math.abs(scrollY-lastY);lastY=scrollY;if(acc>900&&Date.now()-lastT>50000&&!document.querySelector('.wl,.stk')&&Math.random()<.35){acc=0;lastT=Date.now();SD_TOAST('sur')}else if(acc>900)acc=0},{passive:true})}catch(e){}})();

(function(){function c(){var s=document.querySelector('.ownstrip span');if(s&&!s.dataset.cr){s.dataset.cr=1;s.setAttribute('dir','rtl');s.innerHTML='إعداد <i class="tw">✨</i> <bdi dir="ltr">Remoon Esam</bdi> <i class="tw">✨</i>';if(!document.getElementById('twk')){var st=document.createElement('style');st.id='twk';st.textContent='.tw{font-style:normal;display:inline-block;animation:twk 2.4s ease-in-out infinite;filter:saturate(1.1)}@keyframes twk{0%,100%{opacity:.55;transform:scale(.92)}50%{opacity:1;transform:scale(1.12)}}@media(prefers-reduced-motion:reduce){.tw{animation:none}}';document.head.appendChild(st)}}}c();document.addEventListener('DOMContentLoaded',c);setTimeout(c,600)})();

// ownership + light copy deterrent (owner device exempt)
(function(){try{var L=localStorage;var P=(location.pathname.split('/').pop()||'index.html');
var m=document.createElement('meta');m.name='copyright';m.content='© Remoon Esam. All rights reserved. Not for copying or redistribution.';document.head.appendChild(m);
var r=document.createElement('meta');r.name='robots';r.content='noai, noimageai';document.head.appendChild(r);
document.documentElement.setAttribute('data-own','studywithremoon\u200b\u200c\u200d');
if(L.getItem('sd-owner')==='1'&&!sessionStorage.getItem('sd-vv'))return;
if(/^(contact|dash)/.test(P))return;
var s=document.createElement('style');s.textContent='main{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}input,textarea,select{-webkit-user-select:text;user-select:text}img{-webkit-user-drag:none}';document.head.appendChild(s);
document.addEventListener('copy',function(e){var t=e.target;if(t&&/^(INPUT|TEXTAREA)$/.test(t.tagName))return;try{e.clipboardData.setData('text/plain','© Remoon Esam · studywithremoon.github.io');e.preventDefault()}catch(x){}});
document.addEventListener('contextmenu',function(e){var t=e.target;if(t&&/^(INPUT|TEXTAREA)$/.test(t.tagName))return;e.preventDefault()});
document.addEventListener('dragstart',function(e){e.preventDefault()});
try{console.log('%cStudy With Remoon','font:700 18px sans-serif;color:#5eead4','\n© Remoon Esam. All rights reserved. This site and its content may not be copied or cloned.')}catch(x){}
}catch(e){}})();

// sticker ownership marker + no drag/save
(function(){try{var s=document.createElement('style');s.textContent='.stk{pointer-events:none;-webkit-user-drag:none;-webkit-touch-callout:none;user-select:none}';document.head.appendChild(s);
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.tagName==='IMG'){n.draggable=false;n.setAttribute('data-by','Remoon Esam');n.setAttribute('alt','')}})})}).observe(document.body||document.documentElement,{childList:true,subtree:true})}catch(e){}})();

// owner-only layer (hidden for visitors)
(function(){try{var L=localStorage;if(L.getItem('sd-owner')!=='1')return;var vv=!!sessionStorage.getItem('sd-vv');
var st=document.createElement('style');st.textContent='.ob{margin-inline-start:8px;font-size:11px;font-weight:800;color:#1a1a1a;background:#fbbf24;border:0;border-radius:99px;padding:2px 9px;font-family:inherit;cursor:pointer}.ovp{position:fixed;z-index:99999;inset-inline:12px;bottom:12px;max-width:420px;margin-inline:auto;background:#0b1730;border:1px solid #fbbf24;border-radius:16px;padding:12px 14px;box-shadow:0 10px 40px rgba(0,0,0,.6);direction:rtl;color:#f0f9ff;font-size:14px}.ovp h4{margin:0 0 8px;color:#fde68a;font-size:15px}.ovp a,.ovp button{display:inline-block;margin:3px 3px 3px 0;padding:6px 12px;border-radius:10px;border:1px solid rgba(251,191,36,.6);background:transparent;color:#fde68a;font:700 13px inherit;font-family:inherit;text-decoration:none}.ovp .x{float:left;border:0;padding:0 6px}.vvb{position:fixed;z-index:99999;bottom:10px;inset-inline-start:10px;font-size:11px;font-weight:800;color:#1a1a1a;background:#fbbf24;border:0;border-radius:99px;padding:5px 12px;font-family:inherit;opacity:.85}';document.head.appendChild(st);
function go(){
if(vv){if(!document.querySelector('.vvb')){var r=document.createElement('button');r.className='vvb';r.textContent='عودة للمالك';r.onclick=function(){sessionStorage.removeItem('sd-vv');location.reload()};document.body.appendChild(r)}return}
var s=document.querySelector('.ownstrip');if(!s||s.querySelector('.ob'))return;var b=document.createElement('button');b.className='ob';b.type='button';b.textContent='المالك';b.onclick=panel;s.appendChild(b)}
function panel(){var o=document.querySelector('.ovp');if(o){o.remove();return}var p=document.createElement('div');p.className='ovp';
var base=location.pathname.indexOf('/term2/')>-1?'':'';
p.innerHTML='<button class="x" type="button">إغلاق ✕</button><h4>وضع المالك</h4><div><a href="https://studywithremoon.goatcounter.com" target="_blank" rel="noopener">إحصاءات الزيارات</a><a href="index.html">الرئيسية</a><a href="dash.html">لوحتي</a><a href="practice.html">تدريب</a><a href="words.html">رتّب الإجابة</a><a href="contact.html">تواصل</a><button type="button" id="ov-vv">عرض كزائر</button><button type="button" id="ov-off">خروج من وضع المالك</button></div>';
document.body.appendChild(p);p.querySelector('.x').onclick=function(){p.remove()};
p.querySelector('#ov-vv').onclick=function(){sessionStorage.setItem('sd-vv','1');location.reload()};
p.querySelector('#ov-off').onclick=function(){L.removeItem('sd-owner');L.removeItem('skipgc');location.reload()}}
go();document.addEventListener('DOMContentLoaded',go);setTimeout(go,700)}catch(e){}})();
