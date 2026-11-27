(function(){
'use strict';
var SITE='https://studywithremoon.github.io/term2/';
var EXTRA={};
var main=document.querySelector('main');if(!main)return;
var html=document.documentElement,T0=document.title;
function mk(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!==undefined)e.textContent=h;return e}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function ico(p){return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'}
var I={search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',wa:'<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.2-5.2A8.5 8.5 0 1 1 21 11.5z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-.9-.4-1.9-1.4-2.3-2.3l.8-1-1-2z"/>'};
var pageFile=(location.pathname.split('/').pop()||'index.html');

/* theme */
var meta=document.querySelector('meta[name=theme-color]');if(!meta){meta=mk('meta');meta.name='theme-color';document.head.appendChild(meta)}
var tbtn=mk('button','tbb');tbtn.type='button';
function applyTheme(t,save){if(t==='light')html.setAttribute('data-theme','light');else html.removeAttribute('data-theme');
meta.content=t==='light'?'#f4f9ff':'#0a1a30';
tbtn.innerHTML=ico(t==='light'?I.moon:I.sun);var l=t==='light'?'التبديل إلى الوضع الداكن':'التبديل إلى الوضع الفاتح';tbtn.setAttribute('aria-label',l);tbtn.title=l;
if(save)ls('fr2-theme',t)}
tbtn.onclick=function(){applyTheme(html.getAttribute('data-theme')==='light'?'dark':'light',true)};

/* toolbar */
var wrap=mk('div','tbw'),tb=mk('div','tb');
var sb=mk('div','sb');var sico=mk('span');sico.innerHTML=ico(I.search);sico.firstChild.setAttribute('style','position:absolute;inset-inline-start:12px;pointer-events:none;opacity:.7');
var inp=mk('input');inp.type='search';inp.placeholder='ابحث في المواد';inp.setAttribute('aria-label','ابحث في كل المواد');inp.autocomplete='off';inp.enterKeyHint='search';
sb.append(sico.firstChild,inp);
var tmb=mk('button','tbb');tmb.type='button';tmb.innerHTML=ico(I.timer);tmb.setAttribute('aria-label','مؤقت المذاكرة 25 دقيقة');tmb.title='مؤقت المذاكرة';tmb.setAttribute('aria-expanded','false');


tb.append(sb,tmb,tbtn);
var sr=mk('div','sr');sr.hidden=true;sr.id='sr';inp.setAttribute('aria-controls','sr');
tb.appendChild(sr);wrap.appendChild(tb);main.insertBefore(wrap,main.firstChild);
applyTheme(ls('fr2-theme')==='light'?'light':'dark',false);

/* search */
var IDX=null,loading=null;
function norm(s){return s.replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').toLowerCase()}
var FK=-1,RK='fr2-recent';var KN={0:'مادة',1:'ملخص',2:'شرح',3:'سؤال',4:'بطاقة'},KB={0:3,1:2,2:1,3:0,4:.5};
function load(){if(IDX)return Promise.resolve(IDX);if(loading)return loading;
loading=fetch('search-index.json').then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){d.e.forEach(function(r){r.nt=norm(r.t);r.nb=norm(r.b);r.nc=norm(d.c[r.c].n)});IDX=d;return d}).catch(function(){loading=null;return null});return loading}
function hl(el,text,toks){var n=norm(text),rg=[];toks.forEach(function(k){var i=0;while((i=n.indexOf(k,i))>-1){rg.push([i,i+k.length]);i+=k.length}});rg.sort(function(a,b){return a[0]-b[0]});
var m=[];rg.forEach(function(r){var l=m[m.length-1];if(l&&r[0]<=l[1])l[1]=Math.max(l[1],r[1]);else m.push([r[0],r[1]])});
var p=0;m.forEach(function(r){if(r[0]>p)el.appendChild(document.createTextNode(text.slice(p,r[0])));var k=mk('mark','',text.slice(r[0],r[1]));el.appendChild(k);p=r[1]});if(p<text.length)el.appendChild(document.createTextNode(text.slice(p)))}
function snip(r,toks){var b=r.b;if(!b)return '';var best=-1;toks.forEach(function(k){var i=r.nb.indexOf(k);if(i>-1&&(best<0||i<best))best=i});var s=best>40?best-40:0;var t=b.slice(s,s+120);return (s>0?'… ':'')+t+(s+120<b.length?' …':'')}
function render(q){var toks=norm(q).trim().split(/\s+/).filter(Boolean);sr.textContent='';if(!toks.length){sr.hidden=true;return}
if(!IDX){sr.hidden=false;sr.appendChild(mk('p','sr-n','تعذر تحميل البحث. جرب تاني.'));return}
var joined=toks.join(' '),res=[];IDX.e.forEach(function(r){var s=0;var ok=toks.every(function(k){var a=r.nt.indexOf(k)>-1,b=r.nb.indexOf(k)>-1,c=r.nc.indexOf(k)>-1;if(!a&&!b&&!c)return false;s+=(a?4:0)+(b?1:0)+(c?1:0);return true});
if(ok){if(r.nt.indexOf(joined)>-1)s+=6;s+=KB[r.k];res.push([s,r])}});
res.sort(function(a,b){return b[0]-a[0]});sr.hidden=false;
var cnt={};res.forEach(function(x){cnt[x[1].k]=(cnt[x[1].k]||0)+1});if(FK>=0)res=res.filter(function(x){return x[1].k===FK});
var ch=mk('div','sr-f');[[-1,'الكل'],[1,'ملخص'],[2,'شرح'],[3,'أسئلة'],[4,'بطاقات']].forEach(function(f){var b=mk('button','sr-chip'+(FK===f[0]?' on':''),f[1]);b.type='button';b.onclick=function(e){e.stopPropagation();FK=f[0];render(q)};ch.appendChild(b)});sr.appendChild(ch);
if(!res.length){sr.appendChild(mk('p','sr-n','مفيش نتائج لـ "'+q.trim()+'". جرب كلمة تانية.'));return}
sr.appendChild(mk('p','sr-n',res.length+' نتيجة'));
res.slice(0,40).forEach(function(x){var r=x[1],c=IDX.c[r.c];var a=mk('a','sri');a.style.setProperty('--a',c.a);
a.href=c.f+(r.k?'#p'+r.k+'-'+r.i:'');
var top=mk('span','sri-top');top.appendChild(mk('span','sri-c',c.n));top.appendChild(mk('span','sri-k',KN[r.k]));a.appendChild(top);
var st=mk('strong');hl(st,r.t,toks);a.appendChild(st);var sn=snip(r,toks);if(sn){var b=mk('span','sri-b');hl(b,sn,toks);a.appendChild(b)}
a.addEventListener('click',function(e){saveRecent(inp.value);var h=a.getAttribute('href').split('#');if(h[0]===pageFile){e.preventDefault();closeSr();if(h[1])go('#'+h[1])}});
sr.appendChild(a)})}
function closeSr(){sr.hidden=true}
function saveRecent(v){v=v.trim();if(!v)return;try{var l=JSON.parse(ls(RK))||[];l=[v].concat(l.filter(function(x){return x!==v})).slice(0,5);ls(RK,JSON.stringify(l))}catch(e){}}
function showRecent(){if(inp.value.trim())return;var l=[];try{l=JSON.parse(ls(RK))||[]}catch(e){}if(!l.length)return;sr.textContent='';sr.hidden=false;sr.appendChild(mk('p','sr-n','عمليات بحث سابقة'));var w=mk('div','sr-f');l.forEach(function(x){var b=mk('button','sr-chip',x);b.type='button';b.onclick=function(e){e.stopPropagation();inp.value=x;inp.focus();load().then(function(){render(x)})};w.appendChild(b)});sr.appendChild(w)}
var tmr0;inp.addEventListener('input',function(){var v=inp.value;if(!v.trim()){render('');return}clearTimeout(tmr0);tmr0=setTimeout(function(){load().then(function(){if(inp.value===v)render(v)})},60)});
inp.addEventListener('focus',function(){load();showRecent()});
inp.addEventListener('keydown',function(e){if(e.key==='Escape'){if(inp.value){inp.value='';render('')}else closeSr()}else if(e.key==='ArrowDown'){var f=sr.querySelector('.sri');if(f){e.preventDefault();f.focus()}}else if(e.key==='Enter'){var g=sr.querySelector('.sri');if(g){e.preventDefault();g.click()}}});
sr.addEventListener('keydown',function(e){var l=[].slice.call(sr.querySelectorAll('.sri')),i=l.indexOf(document.activeElement);if(e.key==='ArrowDown'&&i<l.length-1){e.preventDefault();l[i+1].focus()}else if(e.key==='ArrowUp'){e.preventDefault();(i>0?l[i-1]:inp).focus()}else if(e.key==='Escape'){closeSr();inp.focus()}});
document.addEventListener('click',function(e){if(!wrap.contains(e.target))closeSr()});

/* tabs + flashcards */
var tabs=document.querySelector('.tabs'),deckCtl=null;
function show(n){for(var y=1;y<=5;y++){var b=document.getElementById('t'+y),p=document.getElementById('p'+y);if(!b||!p)continue;b.classList.toggle('on',y===n);b.setAttribute('aria-selected',String(y===n));p.classList.toggle('on',y===n)}}
if(tabs&&typeof S!=='undefined'){
var deckAll=S.concepts.map(function(c){return{t:c[0],d:c[1]}}).concat((EXTRA[S.id]||[]).map(function(c){return{t:c[0],d:c[1]}}));
var tb4=mk('button','tab','بطاقات');tb4.type='button';tb4.id='t4';tb4.setAttribute('role','tab');tb4.setAttribute('aria-selected','false');tabs.appendChild(tb4);
var p4=mk('section','pane');p4.id='p4';var p3=document.getElementById('p3');p3.parentNode.insertBefore(p4,p3.nextSibling);
for(var y=1;y<=4;y++)(function(n){document.getElementById('t'+n).addEventListener('click',function(){show(n)})})(y);
var KK='fr2-cards';function kget(){try{return JSON.parse(ls(KK))||{}}catch(e){return{}}}
var order=deckAll.map(function(_,i){return i}),pos=0,only=false,flipped=false;
function known(){return (kget()[S.id])||{}}
function setKnown(i,v){var a=kget();a[S.id]=a[S.id]||{};if(v)a[S.id][i]=1;else delete a[S.id][i];ls(KK,JSON.stringify(a))}
function deck(){var k=known();return only?order.filter(function(i){return !k[i]}):order}
function draw(){p4.textContent='';var d=deck(),k=known(),nk=Object.keys(k).length;
p4.appendChild(mk('span','lab','بطاقات المصطلحات'));p4.appendChild(mk('p','note','اضغط على البطاقة لتشوف التعريف. صنّف كل بطاقة: عرفتها أو محتاج مراجعة.'));
var meta=mk('div','fc-meta');var c1=mk('span','',d.length?(Math.min(pos,d.length-1)+1)+' / '+d.length:'0 / 0');var c2=mk('span','','عرفت '+nk+' من '+deckAll.length);c2.setAttribute('aria-live','polite');meta.append(c1,c2);p4.appendChild(meta);
if(!d.length){var dn=mk('div','fc-done');dn.appendChild(mk('p','','عرفت كل البطاقات. ممتاز!'));var rb=mk('button','fbtn','ابدأ من جديد');rb.type='button';rb.onclick=function(){var a=kget();delete a[S.id];ls(KK,JSON.stringify(a));only=false;pos=0;flipped=false;draw()};dn.appendChild(rb);p4.appendChild(dn);return}
if(pos>=d.length)pos=d.length-1;var it=deckAll[d[pos]];
var cd=mk('button','fcard'+(flipped?' flip':''));cd.type='button';cd.setAttribute('aria-label','بطاقة: '+it.t+'. اضغط لقلب البطاقة');
var inner=mk('span','fi'),f=mk('span','ff'),b=mk('span','fb');f.appendChild(mk('small','','المصطلح'));f.appendChild(mk('strong','',it.t));f.appendChild(mk('small','','اضغط لعرض التعريف'));
b.appendChild(mk('small','',it.t));b.appendChild(mk('span','d',it.d));b.appendChild(mk('small','','اضغط للرجوع'));
f.setAttribute('aria-hidden',String(flipped));b.setAttribute('aria-hidden',String(!flipped));inner.append(f,b);cd.appendChild(inner);
cd.onclick=function(){flipped=!flipped;cd.classList.toggle('flip',flipped);f.setAttribute('aria-hidden',String(flipped));b.setAttribute('aria-hidden',String(!flipped))};p4.appendChild(cd);
var act=mk('div','fc-act');function btn(c,t,fn){var x=mk('button','fbtn '+c,t);x.type='button';x.onclick=fn;return x}
function mv(dx){pos=(pos+dx+d.length)%d.length;flipped=false;draw();focusCard()}
act.append(btn('','→ السابق',function(){mv(-1)}),btn('','التالي ←',function(){mv(1)}));p4.appendChild(act);
var act2=mk('div','fc-act');
act2.append(btn('ok','عرفتها ✓',function(){var i=d[pos];setKnown(i,true);flipped=false;if(only){draw();focusCard()}else mv(1)}),btn('no','محتاج مراجعة',function(){var i=d[pos];setKnown(i,false);flipped=false;if(only){mv(1)}else mv(1)}));p4.appendChild(act2);
var row=mk('div','fc-row');
row.append(btn('sm','اخلط البطاقات',function(){for(var i=order.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=order[i];order[i]=order[j];order[j]=t}pos=0;flipped=false;draw()}),
btn('sm'+(only?' on':''),only?'عرض كل البطاقات':'اللي لسه ما عرفتهاش فقط',function(){only=!only;pos=0;flipped=false;draw()}),
btn('sm','مسح تقدمي',function(){var a=kget();delete a[S.id];ls(KK,JSON.stringify(a));pos=0;flipped=false;draw()}));p4.appendChild(row)}
function focusCard(){var c=p4.querySelector('.fcard');if(c&&p4.contains(document.activeElement)||0){}}
deckCtl={open:function(i){only=false;order=deckAll.map(function(_,k){return k});pos=i;flipped=false;draw()}};
draw();
/* challenge */
var tb5=mk('button','tab','تحدّي');tb5.type='button';tb5.id='t5';tb5.setAttribute('role','tab');tb5.setAttribute('aria-selected','false');tabs.appendChild(tb5);
var p5=mk('section','pane');p5.id='p5';p4.parentNode.insertBefore(p5,p4.nextSibling);tb5.addEventListener('click',function(){show(5);cStart()});
var MK='fr2-marks',SK='fr2-streak';
function jget(k,d){try{var v=JSON.parse(ls(k));return v==null?d:v}catch(e){return d}}
function marks(){var m=jget(MK,{});return m[S.id]||[]}
function setMarks(l){var m=jget(MK,{});m[S.id]=l.slice(-40);ls(MK,JSON.stringify(m))}
function isMarked(it){return marks().some(function(x){return x.k===it.k})}
function toggleMark(it,on){var l=marks().filter(function(x){return x.k!==it.k});if(on)l.push(it);setMarks(l)}
function streak(){return jget(SK,{cur:0,best:0})}
function bump(ok){var s=streak();if(ok){s.cur++;if(s.cur>s.best)s.best=s.cur}else s.cur=0;ls(SK,JSON.stringify(s))}
function sh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function pick(n,ex){var r=[];sh(deckAll.map(function(_,i){return i})).forEach(function(i){if(r.length<n&&ex.indexOf(i)<0)r.push(i)});return r}
function mkMcq(q,i){var o=q.options.map(function(t,j){return{t:t,r:j===q.answer}});o=sh(o);return{t:'mcq',k:'m'+i,p:q.q,o:o.map(function(x){return x.t}),a:o.findIndex(function(x){return x.r}),w:q.why}}
function mkTf(q,i){var j=Math.floor(Math.random()*q.options.length),ok=j===q.answer;return{t:'tf',k:'t'+i+'_'+j,p:q.q,s:q.options[j],a:ok,w:(ok?'':'الصح: '+q.options[q.answer]+'. ')+q.why}}
function mkDef(i){var o=[i].concat(pick(3,[i]));o=sh(o);return{t:'def',k:'d'+i,p:deckAll[i].d,o:o.map(function(x){return deckAll[x].t}),a:o.indexOf(i),w:'المصطلح: '+deckAll[i].t}}
function mkFill(i){return{t:'fill',k:'f'+i,p:deckAll[i].d,ans:deckAll[i].t}}
function mkMatch(){var ix=pick(4,[]);return{t:'match',k:'x'+ix.slice().sort().join('_'),terms:ix.map(function(i){return deckAll[i].t}),defs:sh(ix.map(function(i){return deckAll[i].d})),ans:ix.map(function(i){return deckAll[i].d})}}
function build(n){var out=[],Q=S.quiz.map(function(q,i){return i}),qs=sh(Q),kinds=['mcq','tf','def','fill','match','mcq','tf','def','mcq','match'];
var w=0;kinds.slice(0,n).forEach(function(k){var i=qs[w++%qs.length];if(k==='mcq')out.push(mkMcq(S.quiz[i],i));else if(k==='tf')out.push(mkTf(S.quiz[i],i));else if(k==='def'&&deckAll.length>=4)out.push(mkDef(pick(1,[])[0]));else if(k==='fill'&&deckAll.length)out.push(mkFill(pick(1,[])[0]));else if(k==='match'&&deckAll.length>=4)out.push(mkMatch());else out.push(mkMcq(S.quiz[i],i))});return sh(out)}
function cStart(){if(cRun)return;p5.textContent='';var s=streak(),m=marks();
p5.appendChild(mk('span','lab','تحدّي سريع'));p5.appendChild(mk('p','note','10 أسئلة متنوعة: اختيار، صح أو خطأ، تعريف، اكتب المصطلح، وتوصيل. مش بيأثر على نتيجتك في الأسئلة العادية.'));
var st=mk('div','ch-st');st.appendChild(mk('span','','سلسلة حالية: '+s.cur));st.appendChild(mk('span','','أفضل سلسلة: '+s.best));st.appendChild(mk('span','','محفوظ: '+m.length));p5.appendChild(st);
var a=mk('div','fc-act'),b1=mk('button','fbtn ok','ابدأ التحدّي');b1.type='button';b1.onclick=function(){cGo(build(10),false)};a.appendChild(b1);
if(m.length){var b2=mk('button','fbtn','راجع المحفوظ ('+m.length+')');b2.type='button';b2.onclick=function(){cGo(sh(m),true)};a.appendChild(b2)}p5.appendChild(a)}
var cRun=false;
function cGo(items,rev){cRun=true;var i=0,score=0,wrong=[];
function end(){cRun=false;p5.textContent='';p5.appendChild(mk('span','lab',rev?'خلصت المراجعة':'نتيجة التحدّي'));var big=mk('div','ch-big',score+' / '+items.length);big.setAttribute('role','status');p5.appendChild(big);
p5.appendChild(mk('p','note',score===items.length?'ممتاز! كل إجاباتك صح.':score>=items.length*0.7?'كويس جدا. راجع المحفوظ وكمّل.':'محتاج مراجعة. الأسئلة اللي غلطت فيها اتحفظت لك.'));
var s=streak();p5.appendChild(mk('p','note','أفضل سلسلة صحيحة: '+s.best));var a=mk('div','fc-act'),b=mk('button','fbtn ok','تحدّي جديد');b.type='button';b.onclick=function(){cGo(build(10),false)};var c=mk('button','fbtn','رجوع');c.type='button';c.onclick=cStart;a.append(b,c);p5.appendChild(a)}
function next(){if(i>=items.length)return end();var it=items[i];p5.textContent='';var h=mk('div','fc-meta');h.appendChild(mk('span','','سؤال '+(i+1)+' من '+items.length));h.appendChild(mk('span','','سلسلة: '+streak().cur));p5.appendChild(h);
var pr=mk('div','ch-bar'),pi=mk('i');pi.style.width=(i/items.length*100)+'%';pr.appendChild(pi);p5.appendChild(pr);
var box=mk('div','q');p5.appendChild(box);var fb=mk('p','why');fb.hidden=true;fb.setAttribute('aria-live','polite');var star=mk('button','star',isMarked(it)?'★ محفوظ':'☆ احفظ للمراجعة');star.type='button';star.onclick=function(){var on=!isMarked(it);toggleMark(it,on);star.textContent=on?'★ محفوظ':'☆ احفظ للمراجعة'};
var nx=mk('button','fbtn ok',i+1<items.length?'التالي ←':'شوف النتيجة');nx.type='button';nx.hidden=true;nx.onclick=function(){i++;next()};
function fin(ok,msg){if(ok)score++;else{wrong.push(it);if(!isMarked(it))toggleMark(it,true);star.textContent='★ محفوظ'}if(!rev)bump(ok);fb.textContent=(ok?'صح. ':'غلط. ')+msg;fb.hidden=false;nx.hidden=false;nx.focus()}
var lab={mcq:'اختر الإجابة',tf:'صح أم خطأ؟',def:'أي مصطلح تعريفه كده؟',fill:'اكتب المصطلح',match:'وصّل كل مصطلح بتعريفه'};box.appendChild(mk('small','ch-t',lab[it.t]));
if(it.t==='mcq'||it.t==='def'){box.appendChild(mk('p','qt',it.p));it.o.forEach(function(o,j){var b=mk('button','opt',o);b.type='button';b.onclick=function(){[].forEach.call(box.querySelectorAll('.opt'),function(x,k){x.disabled=true;x.classList.add('dis');if(k===it.a)x.classList.add('right');else if(k===j)x.classList.add('wrong')});fin(j===it.a,it.w||'')};box.appendChild(b)})}
else if(it.t==='tf'){box.appendChild(mk('p','qt',it.p));box.appendChild(mk('p','ch-s','الإجابة المقترحة: '+it.s));[['صح',true],['خطأ',false]].forEach(function(x){var b=mk('button','opt',x[0]);b.type='button';b.onclick=function(){[].forEach.call(box.querySelectorAll('.opt'),function(y){y.disabled=true;y.classList.add('dis')});b.classList.add(x[1]===it.a?'right':'wrong');fin(x[1]===it.a,it.w)};box.appendChild(b)})}
else if(it.t==='fill'){box.appendChild(mk('p','qt',it.p));var inp2=mk('input','ch-in');inp2.type='text';inp2.setAttribute('aria-label','اكتب المصطلح');inp2.autocomplete='off';box.appendChild(inp2);var r=mk('div','fc-act'),ck=mk('button','fbtn ok','تأكد'),sk=mk('button','fbtn','مش عارف');ck.type=sk.type='button';r.append(ck,sk);box.appendChild(r);
function done(ok){inp2.disabled=ck.disabled=sk.disabled=true;fin(ok,'المصطلح: '+it.ans)}
ck.onclick=function(){var u=norm(inp2.value).replace(/\s+/g,''),t=norm(it.ans).replace(/\s+/g,'');if(!u)return;done(u===t||(u.length>=4&&(t.indexOf(u)>-1||u.indexOf(t)>-1)))};sk.onclick=function(){done(false)};inp2.onkeydown=function(e){if(e.key==='Enter')ck.click()}}
else{var sel=-1,pairs={};var tl=mk('div','mt-l'),dl=mk('div','mt-l');box.append(tl,dl);var cf=mk('button','fbtn ok','تأكيد');cf.type='button';cf.disabled=true;box.appendChild(cf);
function paint5(){tl.textContent='';dl.textContent='';it.terms.forEach(function(t,k){var b=mk('button','opt'+(sel===k?' sel':''),'');b.type='button';var n=pairs[k]!==undefined?mk('b','mn',String(k+1)):null;if(n)b.appendChild(n);b.appendChild(document.createTextNode(t));b.onclick=function(){sel=k;paint5()};tl.appendChild(b)});
it.defs.forEach(function(d,k){var by=-1;Object.keys(pairs).forEach(function(t){if(pairs[t]===k)by=+t});var b=mk('button','opt',d);b.type='button';if(by>-1){var n=mk('b','mn',String(by+1));b.insertBefore(n,b.firstChild)}b.onclick=function(){if(sel<0)return;Object.keys(pairs).forEach(function(t){if(pairs[t]===k)delete pairs[t]});pairs[sel]=k;sel=-1;paint5()};dl.appendChild(b)});cf.disabled=Object.keys(pairs).length<it.terms.length}
paint5();cf.onclick=function(){var ok=0;it.terms.forEach(function(t,k){if(it.defs[pairs[k]]===it.ans[k])ok++});[].forEach.call(box.querySelectorAll('button'),function(b){b.disabled=true});var all=ok===it.terms.length;fin(all,all?'':'صح '+ok+' من '+it.terms.length+'. '+it.terms.map(function(t,k){return t+': '+it.ans[k]}).join(' | '))}}
box.appendChild(fb);var r2=mk('div','fc-act');r2.append(nx,star);p5.appendChild(r2)}
next()}

}

/* open a result from the hash */
function go(h){var m=/^#p([1-4])-(\d+)$/.exec(h||'');if(!m||!tabs)return;var n=+m[1],i=+m[2];if(n===4&&deckCtl)deckCtl.open(i);show(n);
var sel={1:'#p1 .c',2:'#p2 .ex',3:'#p3 .q',4:'#p4 .fcard'}[n];var el=document.querySelectorAll(sel)[n===4?0:i];if(!el)return;
setTimeout(function(){el.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'});el.classList.remove('hl');void el.offsetWidth;el.classList.add('hl')},50)}
window.addEventListener('hashchange',function(){go(location.hash)});
if(location.hash)go(location.hash);

/* timer */
var TK='fr2-timer',DUR=25*60*1000;
function tget(){try{var o=JSON.parse(ls(TK));if(o&&o.s)return o}catch(e){}return{s:'idle'}}
function tset(o){ls(TK,JSON.stringify(o))}
function left(o){return o.s==='run'?Math.max(0,o.end-Date.now()):o.s==='pause'?o.left:DUR}
function fmt(ms){var s=Math.ceil(ms/1000),m=Math.floor(s/60);s=s%60;return(m<10?'0':'')+m+':'+(s<10?'0':'')+s}
var pn=mk('div','tmr');pn.hidden=true;pn.id='tmr';tmb.setAttribute('aria-controls','tmr');
var th=mk('p','tmr-h','جلسة مذاكرة 25 دقيقة'),tt=mk('div','tmr-t','25:00');tt.setAttribute('role','timer');
var bw=mk('div','tmr-bar'),bi=mk('i');bw.appendChild(bi);bw.setAttribute('aria-hidden','true');
var ta=mk('div','tmr-a'),bgo=mk('button','go','ابدأ'),brs=mk('button','','إعادة');bgo.type=brs.type='button';ta.append(bgo,brs);
var tm=mk('p','tmr-m');tm.setAttribute('role','status');tm.setAttribute('aria-live','polite');
pn.append(th,tt,bw,ta,tm);wrap.appendChild(pn);
var pill=mk('button','pill-t');pill.type='button';pill.hidden=true;pill.setAttribute('aria-label','المؤقت. اضغط لفتحه');document.body.appendChild(pill);
function beep(){try{var C=window.AudioContext||window.webkitAudioContext;if(!C)return;var c=new C();[0,.35].forEach(function(d){var o=c.createOscillator(),g=c.createGain();o.frequency.value=880;g.gain.value=.15;o.connect(g);g.connect(c.destination);o.start(c.currentTime+d);o.stop(c.currentTime+d+.25)});setTimeout(function(){c.close()},1500)}catch(e){}try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}}
function paint(){var o=tget(),l=left(o);
if(o.s==='run'&&l<=0){var late=Date.now()-o.end;tset({s:'idle'});o={s:'idle'};l=DUR;tm.textContent='انتهت الجلسة. خد استراحة 5 دقائق.';if(late<4000)beep();pn.hidden=false;tmb.classList.add('on');tmb.setAttribute('aria-expanded','true')}
tt.textContent=fmt(l);bi.style.width=(o.s==='idle'?0:(1-l/DUR)*100)+'%';
bgo.textContent=o.s==='run'?'إيقاف مؤقت':o.s==='pause'?'كمّل':'ابدأ';
if(o.s==='run'){document.title='⏱ '+fmt(l)+' | '+T0}else document.title=T0;
pill.hidden=!(o.s!=='idle'&&pn.hidden);pill.textContent=(o.s==='run'?'⏱ ':'⏸ ')+fmt(l)}
bgo.onclick=function(){var o=tget();tm.textContent='';if(o.s==='run')tset({s:'pause',left:left(o)});else tset({s:'run',end:Date.now()+left(o)});paint()};
brs.onclick=function(){tset({s:'idle'});tm.textContent='';paint()};
tmb.onclick=function(){pn.hidden=!pn.hidden;tmb.classList.toggle('on',!pn.hidden);tmb.setAttribute('aria-expanded',String(!pn.hidden));paint()};
pill.onclick=function(){pn.hidden=false;tmb.classList.add('on');tmb.setAttribute('aria-expanded','true');paint();window.scrollTo(0,0)};
paint();setInterval(paint,250);
})();
