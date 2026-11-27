(function(){
var V={"pf3|تعريف الضريبة": "1-tax-definition.mp4", "corp1|تعريف الشركة": "17-A1_corp_company.mp4", "corp1|تعريف شركة التضامن": "18-A2_corp_tadamon.mp4", "law1|أولًا: تعريف القانون التجاري": "9-A3_law_commercial.mp4", "law2|أولًا: المقصود بالعمل التجاري": "10-A4_law_commercial_act.mp4", "law3|تعريف التاجر في قانون التجارة (المادة 10)": "11-A5_law_merchant.mp4", "pfb1|تعريف الموازنة العامة للدولة": "19-A6_pf_budget.mp4", "pfb1|تعريفات المالية العامة": "12-A7_pf_definitions.mp4", "pfb2|تعريف النفقات العامة": "13-A8_pf_expenditure.mp4", "pfb3|مفهوم الضريبة": "14-A9_pf_tax_concept.mp4", "pfb3|الشبه والاختلاف بين الضريبة والرسم": "15-A10_pf_tax_fee_royalty.mp4"};
var pg=location.pathname.split("/").pop().replace(".html","")||"index";
function open(src){var o=document.createElement("div");o.style.cssText="position:fixed;inset:0;z-index:9999;background:rgba(5,12,26,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px;gap:10px";
var v=document.createElement("video");v.src=src;v.controls=true;v.autoplay=true;v.playsInline=true;v.style.cssText="max-width:100%;max-height:84vh;border-radius:14px;background:#08162b;border:1px solid #0f766e";
var c=document.createElement("button");c.type="button";c.textContent="إغلاق";c.style.cssText="min-height:44px;padding:0 26px;border-radius:999px;border:1px solid #5eead4;background:transparent;color:#5eead4;font:600 15px system-ui;cursor:pointer";
function x(){v.pause();o.remove()}c.onclick=x;o.onclick=function(e){if(e.target===o)x()};o.appendChild(v);o.appendChild(c);document.body.appendChild(o)}
function run(){document.querySelectorAll(".qa").forEach(function(q){var t=q.querySelector(".q");if(!t||q.querySelector(".vb"))return;var k=pg+"|"+t.textContent.trim();if(!V[k])return;
var b=document.createElement("button");b.type="button";b.className="vb";b.textContent="▶ شرح بالفيديو";b.style.cssText="margin:10px 0 0;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid #0f766e;background:rgba(15,118,110,.18);color:#5eead4;font:600 15px system-ui,'Noto Kufi Arabic',Tahoma,sans-serif;cursor:pointer";
b.onclick=function(e){e.stopPropagation();open(V[k])};q.appendChild(b)})}
run();document.addEventListener("click",function(){setTimeout(run,50)});
})();
