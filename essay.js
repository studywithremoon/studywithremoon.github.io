(function(){
// أسئلة مقالية: يكتب إجابته، يتقيّم تلقائيا (مطابقة نقاط أساسية، تقدير تقريبي)، ثم يظهر النموذج
var css = document.createElement('style');
css.textContent =
'.es-box{margin:8px 0 4px}' +
'.es-ta{width:100%;min-height:88px;box-sizing:border-box;resize:vertical;background:#0f2a4a;color:#e6f0ff;border:1px solid rgba(125,170,255,.25);border-radius:10px;padding:10px 12px;font:inherit;direction:rtl;line-height:1.7}' +
'.es-ta:focus{outline:none;border-color:#fbbf24}' +
'.es-row{display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap}' +
'.es-btn{background:#fbbf24;color:#1a1305;border:0;border-radius:10px;padding:9px 18px;font:inherit;font-weight:700;cursor:pointer}' +
'.es-btn:active{transform:scale(.97)}' +
'.es-score{margin-top:10px;border:1px solid rgba(251,191,36,.4);border-radius:10px;padding:10px 12px;background:rgba(251,191,36,.07)}' +
'.es-num{font-size:20px;font-weight:800;color:#fbbf24}' +
'.es-note{font-size:12px;opacity:.75;margin-top:6px;line-height:1.6}' +
'.es-miss{margin:8px 0 0;padding:0 18px 0 0;font-size:13px;line-height:1.8;opacity:.9}' +
'.es-model-lbl{font-weight:700;color:#34d399;margin:12px 0 4px}';
document.head.appendChild(css);

function norm(t){
  return (t||'')
    .replace(/[ً-ْـ]/g,'')
    .replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
    .replace(/ؤ/g,'و').replace(/ئ/g,'ي')
    .replace(/[،؛؟.!:,()\[\]{}"'«»\-–—/\\|·…]/g,' ')
    .replace(/[^؀-ۿa-z0-9\s]/gi,' ')
    .replace(/\s+/g,' ').trim();
}
function stem(w){
  w = w.replace(/^[وف]/,'').replace(/^[بكل]/,'').replace(/^ال/,'');
  return w.length ? w : 'x';
}
function match(a, b){
  if(a === b) return true;
  var n = Math.min(a.length, b.length), i = 0;
  while(i < n && a[i] === b[i]) i++;
  return i >= 3;
}
function words(t){
  var ws = norm(t).split(' '), out = {}, i, w;
  for(i=0;i<ws.length;i++){
    w = stem(ws[i]);
    if(w.length >= 3 && !STOP[w]) out[w] = 1;
  }
  return out;
}
var STOP = {};
('من في علي الي عن ان ما لا هو هي هذا هذه ذلك تلك التي الذي كان كان يكون تكون او ثم قد كل بعد قبل عند مع بين اي اذا لم لن كما حيث غير بعض لقد الي وهو وهي به بها له لها منه منها فيه فيها عليه عليها اليه اليها عنده عندها حتي مثل خلال دون عندما بينما لان لكي حسب ضد نحو لدي ايضا فقط جدا بل لكن لو كلما اذ يا الا ولا فلا بما عما مما فيما كانه كما ذات نفس امرا امام وراء تحت فوق مثل اصبح صار يعد يتم كون كونه امر شي شيء شيئا احد احدي بعض معظم كثير قليل عده عدة كلاهما جميع كلا كلتا ليس ليست حيثما كيفما متي اين كيف لماذا ماذا ايها اياه اياها وقد فقد ولا بلا تعد تعتبر يعتبر اعتبر تعتبر اعتبرت يعد يمكن ممكن امكانيه امكانية وجود يوجد توجد موجود موجوده موجودة خاص خاصه خاصة عام عامه عامة')
.split(' ').forEach(function(w){ STOP[norm(w).replace(/^ال/,'')] = 1; });

function splitPoints(html){
  var t = html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ');
  var lines = t.split('\n'), pts = [], i, seg;
  for(i=0;i<lines.length;i++){
    seg = lines[i].replace(/\s+/g,' ').trim();
    if(!seg) continue;
    // split numbered points 1) 2) or 1. inside a single line
    var parts = seg.split(/(?:(?<=^)|(?<=\s))\d{1,2}[)）.]\s*/);
    var lead = parts.length > 1 ? '' : null;
    parts.forEach(function(p){
      p = p.trim();
      if(p.length >= 12) pts.push(p);
    });
  }
  // fallback: split on sentence ends if too few points
  if(pts.length < 2){
    pts = [];
    t.replace(/\s+/g,' ').split(/(?<=[.!؟?؛])\s+/).forEach(function(p){
      p = p.trim();
      if(p.length >= 12) pts.push(p);
    });
  }
  return pts.slice(0, 14);
}

function keyset(point){
  var w = words(point), ks = Object.keys(w);
  ks.sort(function(a,b){ return b.length - a.length; });
  return ks.slice(0, 8);
}

function grade(userTxt, modelHtml){
  var pts = splitPoints(modelHtml);
  if(!pts.length) pts = ['x'];
  var uw = words(userTxt);
  var uwc = norm(userTxt).split(' ').filter(function(w){return w.length>1;}).length;
  var covered = 0, missing = [];
  pts.forEach(function(p){
    var ks = keyset(p), hit = 0;
    if(!ks.length){ covered++; return; }
    ks.forEach(function(k){ for(var u in uw){ if(match(k, u)){ hit++; break; } } });
    var need = Math.max(2, Math.ceil(ks.length * 0.5));
    if(need > ks.length) need = ks.length;
    if(hit >= need) covered++;
    else missing.push(p.length > 60 ? p.slice(0, 60) + '…' : p);
  });
  var pct = covered / pts.length;
  var score = Math.round(pct * 10);
  if(uwc < 5) score = Math.min(score, 2);
  else if(uwc < 8) score = Math.min(score, 4);
  return {score: score, covered: covered, total: pts.length, missing: missing};
}

function enhance(qa){
  var sh = qa.querySelector(':scope > button.sh');
  var a = qa.querySelector(':scope > div.a[hidden], :scope > div.a');
  if(!sh || !a) return;
  sh.style.display = 'none';
  var box = document.createElement('div');
  box.className = 'es-box';
  var ta = document.createElement('textarea');
  ta.className = 'es-ta';
  ta.setAttribute('placeholder', 'اكتب إجابتك بأسلوبك الأول...');
  var row = document.createElement('div');
  row.className = 'es-row';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'es-btn';
  btn.textContent = 'قيّم إجابتي';
  var res = document.createElement('div');
  row.appendChild(btn);
  box.appendChild(ta);
  box.appendChild(row);
  box.appendChild(res);
  qa.insertBefore(box, a);

  btn.addEventListener('click', function(){
    var v = ta.value.trim();
    if(v.length < 3){
      res.innerHTML = '<div class="es-note" style="color:#f87171">اكتب إجابتك الأول، وبعدين اضغط التقييم.</div>';
      return;
    }
    var g = grade(v, a.innerHTML);
    var h = '<div class="es-score"><span class="es-num">تقدير تقريبي: ' + g.score + '/10</span>' +
      '<div class="es-note">غطّيت ' + g.covered + ' من ' + g.total + ' نقطة أساسية.</div>';
    if(g.missing.length){
      h += '<div class="es-note" style="margin-top:8px">نقاط ناقصة في إجابتك:</div><ul class="es-miss">';
      g.missing.forEach(function(m){ h += '<li>' + m.replace(/</g,'&lt;') + '</li>'; });
      h += '</ul>';
    }
    h += '<div class="es-note">التقييم آلي بمطابقة الكلمات المفتاحية، وهو تقدير تقريبي مش تصحيح نهائي. قارن إجابتك بالإجابة النموذجية بنفسك.</div></div>';
    h += '<div class="es-model-lbl">الإجابة النموذجية:</div>';
    res.innerHTML = h;
    a.hidden = false;
  });
}

function boot(){
  var qas = document.querySelectorAll('div.qa');
  var n = 0;
  qas.forEach(function(qa){
    if(qa.querySelector(':scope > button.sh') && !qa.querySelector(':scope > .op')){
      enhance(qa); n++;
    }
  });
  if(n) console.log('essay.js: enhanced ' + n + ' essay questions');
}
window.ES_DEBUG={norm:norm,words:words,keyset:keyset,splitPoints:splitPoints,grade:grade,STOP:STOP};
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
