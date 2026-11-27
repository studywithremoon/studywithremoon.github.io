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
var qs=[].slice.call(document.querySelectorAll('.qa'));
var all=[].slice.call(document.querySelectorAll('.qa'));
all.forEach(function(q,i){q.dataset.qi=i});
var pins=g('sd-pins',{});
qs.forEach(function(q){
  var b=document.createElement('button');b.type='button';b.className='pinb';b.setAttribute('aria-label','تثبيت السؤال');
  b.textContent=pins[key(q)]?'★':'☆';
  b.onclick=function(e){e.stopPropagation();var p=g('sd-pins',{});var k=key(q);if(p[k]){delete p[k];b.textContent='☆'}else{p[k]=((q.querySelector('.q')||q).textContent||'').slice(0,90);b.textContent='★'}s('sd-pins',p)};
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

(function(){var P=location.pathname.split('/').pop();if(P===''||P==='index.html'){var s=document.createElement('script');s.src='welcome.js?v=7';s.defer=true;document.body.appendChild(s)}})();

// stickers
window.SD_STKLOAD=function(cb){if(window.SD_ALL)return cb(window.SD_ALL);var F=[['stickers.js?v=2','SD_STK'],['stickers2.js?v=1','SD_STK2'],['stickers3.js?v=1','SD_STK3'],['stickers4.js?v=1','SD_STK4'],['stickers5.js?v=1','SD_STK5'],['stickers6.js?v=1','SD_STK6'],['stickers7.js?v=1','SD_STK7'],['stickers8.js?v=1','SD_STK8'],['stickers9.js?v=1','SD_STK9'],['stickers10.js?v=1','SD_STK10']],n=0;function fin(){window.SD_ALL=[].concat(window.SD_STK||[],window.SD_STK2||[],window.SD_STK3||[],window.SD_STK4||[],window.SD_STK5||[],window.SD_STK6||[],window.SD_STK7||[],window.SD_STK8||[],window.SD_STK9||[],window.SD_STK10||[]);window.SD_STK=window.SD_ALL;cb(window.SD_ALL)}F.forEach(function(f){if(window[f[1]]){if(++n===F.length)fin();return}var s=document.createElement('script');s.src=f[0];s.onload=s.onerror=function(){if(++n===F.length)fin()};document.body.appendChild(s)})};
// warm stickers in idle so the first one shows instantly
;(function(){function warm(){if(window.SD_ALL)return;window.SD_STKLOAD(function(){})}if('requestIdleCallback' in window)requestIdleCallback(warm,{timeout:5000});else window.addEventListener('load',function(){setTimeout(warm,2000)})})();


window.SD_CATS={pos:[0,1,4,5,8,21,22,27,15,28,41,34,51,53,55,57,65,66,68,72,59],neg:[13,16,17,23,26,19,3,6,29,42,32,46,54,60,62,69,56,47,58],rep:[10,12,20,7,11,30,35,46,70,56,62,54,60],bad:[2,11,12,20,7,10,30,35,48,49,61,67,71],rev:[14,24,25,19,33,31,45,63,43,50],win:[1,8,22,21,0,28,41,51,57,65,66,68,55],str:[21,22,0,8,27,5,28,57,66,72,53,65],wel:[4,53,52],sur:[9,5,4,0,1,3,6,7,8,14,15,17,24,25,26,27,18,16,29,31,33,34,36,37,38,39,40,43,28,41,44,45,50,55,58,59,63,64,65,66,68,72]};window.SD_PICK=function(a,cat){var m={};try{m=JSON.parse(localStorage.getItem('sd-stkmap')||'{}')}catch(e){}var L=(m[cat]&&m[cat].length?m[cat]:SD_CATS[cat]||SD_CATS.neg).filter(function(i){return a[i]});window.SD_bag=window.SD_bag||{};var g=window.SD_bag[cat]=(window.SD_bag[cat]||[]).filter(function(i){return L.indexOf(i)>-1});if(!g.length){g=L.slice();for(var k=g.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1)),t=g[k];g[k]=g[j];g[j]=t}if(g[g.length-1]===window.SD_last&&g.length>1){g.unshift(g.pop())}window.SD_bag[cat]=g}var x=g.pop();window.SD_last=x;return a[x]};
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
var m=document.createElement('meta');m.name='copyright';m.content='All rights reserved. Not for copying or redistribution. sig:sw-7f3a9c1e-4b2d';document.head.appendChild(m);
var r=document.createElement('meta');r.name='robots';r.content='noai, noimageai';document.head.appendChild(r);
document.documentElement.setAttribute('data-own','studywithremoon\u200b\u200c\u200d');
if(L.getItem('sd-owner')==='1'&&!sessionStorage.getItem('sd-vv'))return;
if(/^(contact|dash)/.test(P))return;
var s=document.createElement('style');s.textContent='main{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}input,textarea,select{-webkit-user-select:text;user-select:text}img{-webkit-user-drag:none}';document.head.appendChild(s);
document.addEventListener('copy',function(e){var t=e.target;if(t&&/^(INPUT|TEXTAREA)$/.test(t.tagName))return;try{e.clipboardData.setData('text/plain','© studywithremoon.github.io');e.preventDefault()}catch(x){}});
document.addEventListener('contextmenu',function(e){var t=e.target;if(t&&/^(INPUT|TEXTAREA)$/.test(t.tagName))return;e.preventDefault()});
document.addEventListener('dragstart',function(e){e.preventDefault()});
try{console.log('%cAll rights reserved','font:700 18px sans-serif;color:#5eead4','\nAll rights reserved. This site and its content may not be copied or cloned.')}catch(x){}
}catch(e){}})();

// sticker ownership marker + no drag/save
(function(){try{var s=document.createElement('style');s.textContent='.stk{pointer-events:none;-webkit-user-drag:none;-webkit-touch-callout:none;user-select:none}';document.head.appendChild(s);
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.tagName==='IMG'){n.draggable=false;n.setAttribute('data-sig','sw-7f3a9c1e');n.setAttribute('alt','')}})})}).observe(document.body||document.documentElement,{childList:true,subtree:true})}catch(e){}})();

// owner-only layer (hidden for visitors)
(function(){try{var L=localStorage;if(L.getItem('sd-owner')!=='1')return;var vv=!!sessionStorage.getItem('sd-vv');
var st=document.createElement('style');st.textContent='.ob{margin-inline-start:8px;font-size:11px;font-weight:800;color:#1a1a1a;background:#fbbf24;border:0;border-radius:99px;padding:2px 9px;font-family:inherit;cursor:pointer}.ovp{position:fixed;z-index:99999;inset-inline:12px;bottom:12px;max-width:420px;margin-inline:auto;background:#0b1730;border:1px solid #fbbf24;border-radius:16px;padding:12px 14px;box-shadow:0 10px 40px rgba(0,0,0,.6);direction:rtl;color:#f0f9ff;font-size:14px}.ovp h4{margin:0 0 8px;color:#fde68a;font-size:15px}.ovp a,.ovp button{display:inline-block;margin:3px 3px 3px 0;padding:6px 12px;border-radius:10px;border:1px solid rgba(251,191,36,.6);background:transparent;color:#fde68a;font:700 13px inherit;font-family:inherit;text-decoration:none}.ovp .x{float:left;border:0;padding:0 6px}.vvb{position:fixed;z-index:99999;bottom:10px;inset-inline-start:10px;font-size:11px;font-weight:800;color:#1a1a1a;background:#fbbf24;border:0;border-radius:99px;padding:5px 12px;font-family:inherit;opacity:.85}';document.head.appendChild(st);
function go(){
if(vv){if(!document.querySelector('.vvb')){var r=document.createElement('button');r.className='vvb';r.textContent='عودة للمالك';r.onclick=function(){sessionStorage.removeItem('sd-vv');location.reload()};document.body.appendChild(r)}return}
var s=document.querySelector('.ownstrip');if(!s||s.querySelector('.ob'))return;var b=document.createElement('button');b.className='ob';b.type='button';b.textContent='المالك';b.onclick=panel;s.appendChild(b)}
function panel(){var o=document.querySelector('.ovp');if(o){o.remove();return}var p=document.createElement('div');p.className='ovp';
var base=location.pathname.indexOf('/term2/')>-1?'':'';
p.innerHTML='<button class="x" type="button">إغلاق ✕</button><h4>وضع المالك</h4><div id="ov-st" style="margin:0 0 8px;font-size:13px;color:#bfdbfe">جارٍ تحميل الزيارات…</div><div><a href="https://studywithremoon.goatcounter.com" target="_blank" rel="noopener">إحصاءات الزيارات</a><a href="index.html">الرئيسية</a><a href="dash.html">لوحتي</a><a href="practice.html">تدريب</a><a href="words.html">رتّب الإجابة</a><a href="contact.html">تواصل</a><button type="button" id="ov-vv">عرض كزائر</button><button type="button" id="ov-off">خروج من وضع المالك</button></div>';
document.body.appendChild(p);p.querySelector('.x').onclick=function(){p.remove()};(function(){var G='https://studywithremoon.goatcounter.com/counter/',el=p.querySelector('#ov-st');function g(u){return fetch(G+u+'.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()})}
var pg=encodeURIComponent(location.pathname);Promise.all([g('TOTAL'),g(pg).catch(function(){return null})]).then(function(r){var t=r[0],q=r[1],h='إجمالي المشاهدات: <b>'+t.count+'</b> · زوّار: <b>'+t.count_unique+'</b>';if(q)h+='<br>الصفحة دي: <b>'+q.count+'</b> مشاهدة · <b>'+q.count_unique+'</b> زائر';el.innerHTML=h}).catch(function(){el.textContent='تعذّر تحميل الزيارات'})})();
p.querySelector('#ov-vv').onclick=function(){sessionStorage.setItem('sd-vv','1');location.reload()};
p.querySelector('#ov-off').onclick=function(){L.removeItem('sd-owner');L.removeItem('skipgc');location.reload()}}
go();document.addEventListener('DOMContentLoaded',go);setTimeout(go,700)}catch(e){}})();

// sticker safety: some stickers are excluded everywhere
(function(){try{var BAN=[22,52,70],o=window.SD_PICK;if(!o)return;window.SD_PICK=function(a,c){for(var k=0;k<30;k++){var r=o(a,c);if(BAN.indexOf(a.indexOf(r))<0)return r}for(var i=0;i<a.length;i++)if(BAN.indexOf(i)<0)return a[i]};
if(window.SD_CATS)Object.keys(SD_CATS).forEach(function(k){SD_CATS[k]=SD_CATS[k].filter(function(i){return BAN.indexOf(i)<0})})}catch(e){}})();

// home: exam countdown + per-subject progress bars
(function(){try{var P=location.pathname.split('/').pop()||'index.html';if(P!=='index.html')return;var L=localStorage;
function go(){var h=document.querySelector('.hero:not(.s)');if(!h||h.querySelector('.exc'))return;
var ed=L.getItem('sd-exam');if(ed){var d=Math.ceil((new Date(ed+'T00:00:00')-new Date())/864e5);if(d>=0){var c=document.createElement('p');c.className='exc';c.style.cssText='margin:8px 0 0;font-size:14px;color:#fde68a;font-weight:700';c.textContent=d===0?'الامتحان النهارده، بالتوفيق!':'باقي '+d+' يوم على الامتحان';var st=h.querySelector('.stats');if(st)st.parentNode.insertBefore(c,st);else h.appendChild(c)}}
var pr={};try{pr=JSON.parse(L.getItem('fr2-progress')||'{}')}catch(e){}
fetch('mcq.json').then(function(r){return r.json()}).then(function(m){var T={},D={},ALL=0,DN=0;m.forEach(function(q){ALL++;var s=q.p.replace(/\d.*$/,'').replace(/^pfb$/,'pf');T[s]=(T[s]||0)+1;var a=pr[q.p];if(a&&a[q.i]&&a[q.i].ok){D[s]=(D[s]||0)+1;DN++}});var sn=document.getElementById('sn');if(sn&&ALL)sn.textContent=DN+'/'+ALL;
document.querySelectorAll('a.cc[href$=".html"]').forEach(function(a){var s=a.getAttribute('href').replace('.html','');if(!T[s]||a.querySelector('.spb'))return;var n=D[s]||0,b=document.createElement('div');b.className='spb';b.setAttribute('aria-label','التقدم');b.style.cssText='height:5px;border-radius:99px;background:rgba(255,255,255,.12);margin-top:10px;overflow:hidden';var i=document.createElement('i');i.style.cssText='display:block;height:100%;border-radius:99px;background:var(--a,#5eead4);width:'+Math.round(n/T[s]*100)+'%';b.appendChild(i);var g=a.querySelector('.go');a.insertBefore(b,g||null);if(g)g.textContent=g.textContent+' · '+n+'/'+T[s]})}).catch(function(){})}
go();document.addEventListener('DOMContentLoaded',go)}catch(e){}})();

// premium polish (additive CSS only)
(function(){try{var s=document.createElement('style');s.id='pol';s.textContent='html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}body{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-webkit-tap-highlight-color:transparent}.wrap>main{padding-bottom:96px}::selection{background:rgba(94,234,212,.35);color:#fff}:focus-visible{outline:2px solid #5eead4;outline-offset:2px;border-radius:8px}.ownx a,.ownx button,.ownx span{font-size:11px!important;opacity:.92;box-shadow:0 2px 8px rgba(0,0,0,.35)}.nav a,.cc,.tbtn,.bt,.lb,button{transition:transform .15s ease,box-shadow .2s ease,border-color .2s ease,background-color .2s ease}.cc:active,.nav a:active{transform:scale(.985)}img{max-width:100%;height:auto}table{max-width:100%}pre,code{white-space:pre-wrap;word-break:break-word}.qa,.in,.dt>div{overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{animation-duration:.01ms!important;transition-duration:.01ms!important}}';document.head.appendChild(s)}catch(e){}})();

// tips (only points his material stresses)
(function(){try{var P=location.pathname.split('/').pop()||'index.html';var T={"law1.html": [["ركّز", "الفرق بين العرف التجاري والعادة التجارية فرق مهم جدًا. متخلطش بينهم في الإجابة 😉"]], "law2.html": [["ركّز", "وجود الربح لوحده مش كفاية تقول إن العمل تجاري. بصّ على طبيعة العمل وشروطه القانونية."], ["نصيحة", "أهمية التفرقة بين الأعمال التجارية والأعمال المدنية جزء مهم جدًا، والسؤال ممكن ييجي بصيغة «اذكر أهمية التفرقة». حضّرها كويس."]], "pf1.html": [["ركّز", "الباب الثاني شراء سلع وخدمات لتسيير الشغل اليومي (أدوات مكتبية وصيانة معتادة)، والباب السادس إنفاق استثماري على أصول زي بناء مدرسة جديدة. الفرق بينهم مهم جدًا."], ["خلي بالك", "فوائد القرض في الباب الثالث من الاستخدامات، وسداد أصل القرض في الباب الثامن."], ["مهم", "صافي الحيازة للأصول المالية مش هو نفسه العجز أو الفائض."]], "pfb1.html": [["ركّز", "الباب الثاني شراء سلع وخدمات لتسيير الشغل اليومي، والباب السادس إنفاق استثماري على أصول. الفرق بينهم مهم جدًا."], ["خلي بالك", "فوائد القرض في الباب الثالث من الاستخدامات، وسداد أصل القرض في الباب الثامن."]], "corp4.html": [["نصيحة", "قبل ما تطلب من الشريك يدفع حصته في الزيادة، لازم يسدد حسابه الجاري المدين الأول. القيد: من النقدية إلى جاري الشريك (المدين)."]]};var s=document.createElement('style');s.textContent='.tipb{margin:12px 0;padding:11px 14px;border-radius:14px;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.45);border-inline-start:5px solid #fbbf24;line-height:1.9;font-size:15px}.tipb b{display:inline-block;margin-inline-end:8px;padding:1px 9px;border-radius:99px;background:#fbbf24;color:#1a1a1a;font-size:12px;font-weight:800}.tipw{margin:8px 0 0;padding:6px 10px;border-radius:10px;background:rgba(251,191,36,.12);border:1px dashed rgba(251,191,36,.5);font-size:13.5px}';document.head.appendChild(s);var h=document.querySelector('.hero');if(T[P]&&h){var f=document.createDocumentFragment();T[P].forEach(function(x){var d=document.createElement('div');d.className='tipb';var b=document.createElement('b');b.textContent=x[0];d.appendChild(b);d.appendChild(document.createTextNode(x[1]));f.appendChild(d)});h.after(f)}var n=document.querySelector('nav.nav');if(n&&!n.querySelector('[href="tips.html"]')){var a=document.createElement('a');a.href='tips.html';a.textContent='نصايح';a.style.setProperty('--a','#fbbf24');n.appendChild(a)}new MutationObserver(function(ms){ms.forEach(function(m){var e=m.target;if(e.classList&&e.classList.contains('wrong')){var q=e.closest('.qa');if(q&&!q.querySelector('.tipw')){var w=document.createElement('div');w.className='tipw';w.textContent='نصيحة: غلطة وعدّت 😉 اقرا الإجابة وكمّل.';q.appendChild(w)}}})}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']})}catch(e){}})();

// read-aloud (extra 3): listen button on every question card
(function(){if(!('speechSynthesis' in window))return;var cur=null;
var qa2=[].slice.call(document.querySelectorAll('.qa'));
qa2.forEach(function(q){var qt=q.querySelector('.q');if(!qt)return;
q.style.position=q.style.position||'relative';
var b=document.createElement('button');b.type='button';b.className='snb';b.setAttribute('aria-label','استمع');b.textContent='استمع';
b.style.cssText='position:absolute;top:44px;inset-inline-end:10px;background:none;border:1px solid rgba(94,234,212,.5);border-radius:10px;color:#5eead4;font:700 12px inherit;font-family:inherit;padding:5px 10px;min-height:30px;cursor:pointer;z-index:2';
b.onclick=function(e){e.stopPropagation();
 if(cur===b){speechSynthesis.cancel();cur=null;b.textContent='استمع';return}
 if(cur)cur.textContent='استمع';speechSynthesis.cancel();
 var cl=q.cloneNode(true);cl.querySelectorAll('.pinb,.snb,.op,.sh,.wab,video,audio,iframe').forEach(function(x){x.remove()});
 cl.querySelectorAll('[hidden]').forEach(function(x){x.remove()});
 var txt=(cl.textContent||'').replace(/\s+/g,' ').trim();if(!txt)return;
 var u=new SpeechSynthesisUtterance(txt.slice(0,1500));u.lang='ar-EG';u.rate=.95;
 u.onend=u.onerror=function(){b.textContent='استمع';if(cur===b)cur=null};
 speechSynthesis.speak(u);cur=b;b.textContent='إيقاف'};
q.appendChild(b)})})();

// quiet premium motion for answers, cards, results and stickers
;(function(){if(document.getElementById('sd-anim'))return;var st=document.createElement('style');st.id='sd-anim';st.textContent=[
".oo,.op{transition:transform .18s ease,background-color .2s ease,border-color .2s ease,color .2s ease,box-shadow .25s ease}",
".oo:active,.op:active{transform:scale(.97)}",
".oo.ok,.op.ok{animation:sdOk .45s cubic-bezier(.2,.9,.3,1.15)}",
".oo.no,.op.no{animation:sdNo .4s ease}",
"@keyframes sdOk{0%{transform:scale(1)}35%{transform:scale(1.04);box-shadow:0 0 0 6px rgba(22,163,74,.16)}100%{transform:scale(1)}}",
"@keyframes sdNo{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}50%{transform:translateX(4px)}75%{transform:translateX(-2px)}}",
"#box .pq,#pr-box .pq,#box .cd,#pr-box .cd,#box .res,#pr-box .res,#out .qa{animation:sdIn .3s cubic-bezier(.2,.7,.3,1)}",
"@keyframes sdIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
".cf{animation:sdFlip .35s cubic-bezier(.2,.7,.3,1)}",
"@keyframes sdFlip{from{opacity:.15;transform:perspective(600px) rotateX(55deg)}to{opacity:1;transform:perspective(600px) rotateX(0)}}",
".stki{animation:sdPop .45s cubic-bezier(.2,.9,.3,1.2)}",
"@keyframes sdPop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}",
".nx,.go2,.bt{transition:transform .18s ease,box-shadow .25s ease,background-color .2s ease,color .2s ease}",
".nx:active,.go2:active,.bt:active{transform:scale(.97)}",
"@media (prefers-reduced-motion:reduce){.oo,.op,.cf,.pq,.cd,.res,.qa,.stki,.nx,.go2,.bt{animation:none!important;transition:none!important}}"
].join('\n');document.head.appendChild(st)})();
// lesson notes
(function(){try{
var P2=location.pathname.split('/').pop()||'index.html';
if(P2==='dash.html'||P2==='index.html')return;
var qs2=document.querySelectorAll('.qa');
if(!qs2.length)return;
var nk='sd-note-lesson-'+P2;
var nb=document.createElement('div');nb.className='qa';nb.style.marginTop='1.2rem';
var nl=document.createElement('div');nl.className='q';nl.textContent='ملاحظاتي على الدرس';
var nt=document.createElement('textarea');
nt.setAttribute('aria-label',nl.textContent);
nt.placeholder='اكتب ملاحظاتك هنا... بتتحفظ على جهازك تلقائي';
nt.style.cssText='width:100%;min-height:90px;margin-top:.6rem;padding:.6rem;border:1px solid rgba(255,255,255,.25);border-radius:10px;background:rgba(255,255,255,.04);color:inherit;font:inherit;resize:vertical';
try{nt.value=localStorage.getItem(nk)||''}catch(_){}
nt.addEventListener('input',function(){try{localStorage.setItem(nk,nt.value)}catch(_){}});
nb.appendChild(nl);nb.appendChild(nt);
var last=qs2[qs2.length-1];if(last.parentNode)last.parentNode.insertBefore(nb,last.nextSibling);
}catch(_){}})();
