function renderAll(){renderDash();updSel()}

/* ── NAV ── */

// goPage yuqorida e'lon qilingan

/* ── AVATAR HTML ── */
function avH(src,sz,rx){
  var s=sz||34,r=rx||8;
  if(src)return'<img src="'+src+'" style="width:'+s+'px;height:'+s+'px;border-radius:'+r+'px;object-fit:cover;flex-shrink:0">';
  return'<div style="width:'+s+'px;height:'+s+'px;border-radius:'+r+'px;background:var(--sf3);display:flex;align-items:center;justify-content:center;color:var(--tx3);flex-shrink:0"><svg width="'+(s*0.45)+'" height="'+(s*0.45)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>';
}
function sc(cls,lbl,val,hint){return'<div class="sc '+cls+'"><div class="sc-lbl">'+lbl+'</div><div class="sc-val">'+val+'</div><div class="sc-hint">'+hint+'</div></div>'}

/* ── DASHBOARD ── */
function renderDash() {
  var n = now();
  var _sel = dashDate || n.date;
  var _disp = (function(){var p=_sel.split("-");return p[2]+"."+p[1]+"."+p[0];})();
  var _ts = new Date(_sel+"T12:00:00").getTime();
  var st=$i("dash-sana-txt"); if(st) st.textContent=_disp;
  var di=$i("dash-date-inp"); if(di){di.value=_sel;di.max=n.date;}
  var allT=Object.values(T),allX=Object.values(X),allB=Object.values(B);
  var bM={};allT.forEach(function(t){if(t.xonaId)bM[t.xonaId]=(bM[t.xonaId]||0)+1});
  var bosh=allX.filter(function(x){return(bM[x.id]||0)<(x.yotoqSoni||1)}).length;
  var kT=Object.values(K).filter(function(k){return k.sana===_sel;}).length;
  var yDay=Y[_sel]||{},borS=Object.values(yDay).filter(function(y){return y.holat==="bor"}).length;
  $i("dash-stats").innerHTML=
    sc("sc-b","Jami talaba",allT.length,allB.length+" bino")+
    sc("sc-g","Bo'sh xonalar",bosh,allX.length+" xonadan")+
    sc("sc-r","Kechikdi",kT,_disp)+
    sc("sc-a","Bor (bugun)",borS,"yo'qlama bo'yicha");
  if($i("dash-kunlik-sana"))$i("dash-kunlik-sana").textContent=_disp;
  var dYD=Y[_sel]||{},tIds=allT.map(function(t){return t.id;});
  var dBor=tIds.filter(function(id){return(dYD[id]||{}).holat==="bor";}).length;
  var dYoq=tIds.filter(function(id){return(dYD[id]||{}).holat==="yoq";}).length;
  var dBlmg=tIds.filter(function(id){return!(dYD[id]||{}).holat;}).length;
  var dPct=allT.length?Math.round((dBor+dYoq)/allT.length*100):0;
  if($i("dash-kunlik"))$i("dash-kunlik").innerHTML=
    '<div style="margin-bottom:12px"><div style="height:8px;background:var(--sf3);border-radius:20px;overflow:hidden">'+
    '<div style="height:100%;border-radius:20px;width:'+dPct+'%;background:linear-gradient(90deg,var(--a),var(--grn))"></div></div>'+
    '<div style="font-size:10px;color:var(--tx2);margin-top:4px">'+dPct+'% qayd etildi</div></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">'+
    '<div style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:10px;padding:10px;text-align:center">'+
    '<div style="font-size:9px;font-weight:700;color:var(--grn);margin-bottom:4px">BOR</div>'+
    '<div style="font-size:22px;font-weight:800;color:var(--grn)">'+dBor+'</div></div>'+
    '<div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:10px;padding:10px;text-align:center">'+
    '<div style="font-size:9px;font-weight:700;color:var(--red);margin-bottom:4px">YOQ</div>'+
    '<div style="font-size:22px;font-weight:800;color:var(--red)">'+dYoq+'</div></div>'+
    '<div style="background:var(--sf2);border:1px solid var(--bd);border-radius:10px;padding:10px;text-align:center">'+
    '<div style="font-size:9px;font-weight:700;color:var(--tx2);margin-bottom:4px">KUTILMOQDA</div>'+
    '<div style="font-size:22px;font-weight:800;color:var(--tx2)">'+dBlmg+'</div></div></div>';
  if($i("dash-oylik-oy"))$i("dash-oylik-oy").textContent=_sel.slice(0,7);
  var fB=(role==="tarbiyachi"||(role==="tekshiruvchi"&&myBinoId&&myBinoId!=="__all__"))&&myBinoId&&myBinoId!=="__all__";
  var oK=Object.values(K).filter(function(k){
    if(!k.sana||k.sana.slice(0,7)!==_sel.slice(0,7))return false;
    if(fB){var x=X[k.xonaId];return x&&x.binoId===myBinoId;}return true;});
  var l7=[]; for(var di2=6;di2>=0;di2--){
    var dd=new Date(_ts-di2*86400000);
    var px=function(x){return String(x).padStart(2,"0");};
    var ds=dd.getFullYear()+"-"+px(dd.getMonth()+1)+"-"+px(dd.getDate());
    l7.push({date:ds,disp:px(dd.getDate())+"."+px(dd.getMonth()+1),
      cnt:oK.filter(function(k){return k.sana===ds;}).length});}
  var mxC=Math.max.apply(null,l7.map(function(x){return x.cnt;}))||1;
  var tKC={};oK.forEach(function(k){tKC[k.talabaId]=(tKC[k.talabaId]||0)+1;});
  var topK=Object.entries(tKC).sort(function(a,b){return b[1]-a[1];}).slice(0,3);
  if($i("dash-oylik"))$i("dash-oylik").innerHTML=
    '<div style="margin-bottom:10px"><div style="font-size:11px;color:var(--tx2);margin-bottom:8px">'+
    'Oxirgi 7 kun &bull; Jami: <b>'+oK.length+'</b></div>'+
    '<div style="display:flex;align-items:flex-end;gap:4px;height:60px">'+
    l7.map(function(d){var h=Math.round(d.cnt/mxC*50)||2,isT=d.date===_sel;
      return'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">'+
        '<div style="font-size:9px;color:var(--tx2)">'+d.cnt+'</div>'+
        '<div style="width:100%;height:'+h+'px;background:'+(isT?"var(--a)":"rgba(79,127,255,.3)")+
        ';border-radius:3px 3px 0 0;min-height:2px"></div>'+
        '<div style="font-size:8px;color:'+(isT?"var(--a)":"var(--tx3)")+
        ';font-weight:'+(isT?"700":"400")+'">'+d.disp+'</div></div>';
    }).join("")+'</div></div>'+
    (topK.length?'<div style="border-top:1px solid var(--bd);padding-top:8px">'+
      topK.map(function(e){var t=T[e[0]];if(!t)return"";
        return'<div style="display:flex;align-items:center;gap:8px;padding:4px 0">'+
          avH(t.rasm,26,5)+'<div style="flex:1;font-size:12px">'+esc(t.familiya||"")+" "+esc(t.ism||"")+'</div>'+
          '<span class="bdg bdg-r">'+e[1]+'</span></div>';}).join("")+'</div>':
      '<div style="text-align:center;font-size:12px;color:var(--tx3);padding:6px">Kechikish yoq</div>');
  var rec=_sel===n.date?
    Object.values(K).sort(function(a,b){return(b.timestamp||0)-(a.timestamp||0);}).slice(0,5):
    Object.values(K).filter(function(k){return k.sana===_sel;}).slice(0,5);
  $i("dash-bino").innerHTML=allB.length?allB.map(function(b){
    var bX=allX.filter(function(x){return x.binoId===b.id});
    var jami=bX.reduce(function(s,x){return s+(x.yotoqSoni||0)},0);
    var band=allT.filter(function(t){return bX.some(function(x){return x.id===t.xonaId})}).length;
    var pct=jami?Math.round(band/jami*100):0;
    return'<div style="padding:10px;background:var(--sf2);border-radius:8px;margin-bottom:8px"><div style="display:flex;justify-content:space-between;margin-bottom:5px"><span style="font-size:12px;font-weight:600">'+esc(b.nom)+'</span><span style="font-size:11px;color:var(--tx2)">'+band+'/'+jami+'</span></div><div class="prog"><div class="prog-f" style="width:'+pct+'%;background:var(--a)"></div></div></div>';
  }).join(""):'<div style="color:var(--tx2);font-size:12px;text-align:center;padding:20px">Bino qo\'shilmagan</div>';
  var rec=Object.values(K).sort(function(a,b){return(b.timestamp||0)-(a.timestamp||0)}).slice(0,5);
  $i("dash-kech").innerHTML=rec.length?rec.map(function(k){
    return'<div style="display:flex;align-items:center;gap:9px;padding:8px 10px;background:var(--sf2);border-radius:8px;margin-bottom:6px">'+avH(k.photo,30,6)+'<div><div style="font-size:12px;font-weight:600">'+esc(k.familiya||"")+" "+esc(k.ism||"")+'</div><div style="font-size:10px;color:var(--tx2)">'+esc(k.xonaRaqam||"")+" — "+esc(k.vaqt||"")+'</div></div></div>';
  }).join(""):'<div style="color:var(--tx2);font-size:12px;text-align:center;padding:20px">Kechikish yo\'q</div>';
}

/* ── BINOLAR ── */
function renderBinolar(){
  var arr=Object.values(B);
  if(!seeAll()&&myBino()) arr=arr.filter(function(b){return b.id===myBino();});
  $i("bino-empty").style.display=arr.length?"none":"block";
  $i("bino-list").innerHTML=arr.map(function(b){
    var bX=Object.values(X).filter(function(x){return x.binoId===b.id});
    var jami=bX.reduce(function(s,x){return s+(x.yotoqSoni||0)},0);
    var band=Object.values(T).filter(function(t){return bX.some(function(x){return x.id===t.xonaId})}).length;
    var pct=jami?Math.round(band/jami*100):0;
    var isAdmin=window._isA;
    return'<div class="bino-card" data-id="'+b.id+'">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">'+
      '<div style="width:42px;height:42px;background:var(--sf2);border-radius:var(--r);display:flex;align-items:center;justify-content:center;color:var(--a)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg></div>'+
      (isAdmin?'<button class="btn btn-d btn-xs del-bino-btn" data-id="'+b.id+'" onclick="event.stopPropagation()">O\'chirish</button>':'')+
      '</div>'+
      '<div style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:14px;font-weight:700;margin-bottom:5px">'+esc(b.nom)+'</div>'+
      '<div style="font-size:11px;color:var(--tx2)">'+b.qavatlar+' qavat &bull; '+bX.length+' xona &bull; '+band+'/'+jami+' talaba</div>'+
      '<div class="prog"><div class="prog-f" style="width:'+pct+'%;background:var(--a)"></div></div>'+
    '</div>';
  }).join("");
  $i("bino-list").querySelectorAll(".bino-card").forEach(function(c){
    c.addEventListener("click",function(){$i("xf-bino").value=c.dataset.id;xonaFlt=null;goPage("xonalar")});
  });
  $i("bino-list").querySelectorAll(".del-bino-btn").forEach(function(btn){
    btn.addEventListener("click",function(e){
      e.stopPropagation();
      var id=btn.dataset.id,b2=B[id];
      var xCnt=Object.values(X).filter(function(x){return x.binoId===id}).length;
      confirmDel("Binoni o'chirasizmi?",function(){
        // Cascade delete
        var xIds=Object.values(X).filter(function(x){return x.binoId===id}).map(function(x){return x.id});
        xIds.forEach(function(xid){
          Object.values(T).forEach(function(t){if(t.xonaId===xid)t.xonaId=""});
          delete X[xid];
        });
        delete B[id];
        sv("binolar",B);sv("xonalar",X);sv("talabalar",T);
        renderBinolar();updSel();toast("Bino o'chirildi");
      },b2?esc(b2.nom)+": "+xCnt+" xona":"");
    });
  });
}

/* ── XONALAR ── */
window.filterXona=function(st){
  xonaFlt=(xonaFlt===st)?null:st;renderXonalar();
};
function renderXonalar(){
  var bF=$i("xf-bino").value,qF=$i("xf-qavat").value;
  var arr=Object.values(X).filter(function(x){return(!bF||x.binoId===bF)&&(!qF||String(x.qavat)===qF)})
    .sort(function(a,b){return parseInt(a.raqam)-parseInt(b.raqam)||String(a.raqam).localeCompare(String(b.raqam))});
  if(role==="tarbiyachi"&&myBinoId&&myBinoId!=="__all__")arr=arr.filter(function(x){return x.binoId===myBinoId});
  var bM={};Object.values(T).forEach(function(t){if(t.xonaId)bM[t.xonaId]=(bM[t.xonaId]||0)+1});
  var bo=0,tu=0,qi=0;
  arr.forEach(function(x){var c=bM[x.id]||0;if(c===0)bo++;else if(c>=(x.yotoqSoni||1))tu++;else qi++;});
  $i("xs-j").textContent=arr.length;$i("xs-b").textContent=bo;$i("xs-t").textContent=tu;$i("xs-q").textContent=qi;
  ["jami","bosh","tuliq","qisman"].forEach(function(s){
    var el=$i("xs-"+s);if(el){if(xonaFlt===s)el.classList.add("af");else el.classList.remove("af");}
  });
  var fi=$i("xona-fi"),fl={bosh:"Bo'sh xonalar",tuliq:"To'liq xonalar",qisman:"Qisman band"};
  if(xonaFlt&&xonaFlt!=="jami"){
    fi.style.display="flex";
    fi.innerHTML='<span>Ko\'rsatilmoqda: <b>'+fl[xonaFlt]+'</b></span><button onclick="window.filterXona(\''+xonaFlt+'\')" style="background:none;border:none;cursor:pointer;color:var(--a);font-size:11px;margin-left:auto">Bekor ✕</button>';
  }else{fi.style.display="none"}
  var flt=xonaFlt&&xonaFlt!=="jami"?arr.filter(function(x){
    var c=bM[x.id]||0;
    if(xonaFlt==="bosh")return c===0;
    if(xonaFlt==="tuliq")return c>=(x.yotoqSoni||1);
    if(xonaFlt==="qisman")return c>0&&c<(x.yotoqSoni||1);
    return true;
  }):arr;
  var l=$i("xona-list");
  if(!flt.length){l.innerHTML='<div style="color:var(--tx2);font-size:13px;padding:40px;text-align:center">Xona topilmadi</div>';return}
  l.innerHTML=flt.map(function(x){
    var band=bM[x.id]||0,full=band>=(x.yotoqSoni||1),empty=band===0;
    var pct=x.yotoqSoni?Math.round(band/x.yotoqSoni*100):0;
    var fc=full?"var(--red)":empty?"var(--grn)":"var(--a)";
    var bn=B[x.binoId];
    return'<div class="xona-card '+(full?"x-full":empty?"x-empty":"")+'" data-id="'+x.id+'">'+
      '<div style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:20px;font-weight:800;margin-bottom:3px">'+esc(x.raqam)+'</div>'+
      '<div style="font-size:11px;color:var(--tx2)">'+(bn?esc(bn.nom)+" &bull; ":"")+x.qavat+'-qavat</div>'+
      '<div style="font-size:11px;color:var(--tx2);margin-top:2px">'+band+'/'+x.yotoqSoni+' yotoq</div>'+
      '<div class="prog"><div class="prog-f" style="width:'+pct+'%;background:'+fc+'"></div></div>'+
    '</div>';
  }).join("");
  l.querySelectorAll(".xona-card").forEach(function(c){c.addEventListener("click",function(){openXona(c.dataset.id)})});
}

function openXona(id){
  var x=X[id];if(!x)return;viewXonaId=id;
  var bn=B[x.binoId],tals=Object.values(T).filter(function(t){return t.xonaId===id});
  $i("xm-ttl").textContent=x.raqam+"-xona — "+(bn?bn.nom:"");
  var cell=function(l,v){return'<div style="background:var(--sf2);border-radius:7px;padding:9px;text-align:center"><div style="font-size:9px;color:var(--tx2);margin-bottom:2px">'+l+'</div><div style="font-size:14px;font-weight:600">'+v+'</div></div>'};
  $i("xm-body").innerHTML=
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:16px">'+
    cell("QAVAT",x.qavat)+cell("YOTOQ",x.yotoqSoni)+
    cell("BAND",'<span style="color:'+(tals.length>=(x.yotoqSoni||1)?"var(--red)":"var(--grn)")+'">'+tals.length+'</span>')+
    '</div><div style="font-size:11px;font-weight:700;color:var(--tx2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Xonadagi talabalar</div>'+
    (tals.length?tals.map(function(t){
      return'<div style="display:flex;align-items:center;gap:10px;padding:9px;background:var(--sf2);border-radius:8px;margin-bottom:7px">'+
        avH(t.rasm,36,7)+'<div><div style="font-size:13px;font-weight:600">'+esc(t.familiya||"")+" "+esc(t.ism||"")+'</div>'+
        '<div style="font-size:11px;color:var(--tx2)">'+esc(t.guruh||"")+" &bull; ID: "+esc(t.talabaId||"")+'</div></div></div>';
    }).join(""):'<div style="color:var(--tx2);font-size:12px;text-align:center;padding:16px">Bo\'sh xona</div>');
  $i("xona-del-btn").style.display=window._isA?"inline-flex":"none";
  openMod("m-xona");
}

/* ── TALABALAR ── */
function renderTalabalar(){
  var q=($i("tf-srch").value||"").toLowerCase();
  var bF=$i("tf-bino").value,xF=$i("tf-xona").value;
  var arr=Object.values(T);
  // Tekshiruvchi/nazoratchi bitta binoga biriktirilgan bo'lsa
  if(!seeAll()&&myBino()){
    var myXIds=Object.values(X).filter(function(x){return x.binoId===myBino();}).map(function(x){return x.id;});
    arr=arr.filter(function(t){return myXIds.indexOf(t.xonaId)>-1;});
    if(!bF) bF=myBino();
  }
  if(role==="tarbiyachi"&&myBinoId&&myBinoId!=="__all__"){
    var myX=Object.values(X).filter(function(x){return x.binoId===myBinoId}).map(function(x){return x.id});
    arr=arr.filter(function(t){return myX.indexOf(t.xonaId)!==-1});
  }
  if(q)arr=arr.filter(function(t){return[t.ism||"",t.familiya||"",t.guruh||"",t.talabaId||"",t.otasi||""].join(" ").toLowerCase().indexOf(q)!==-1});
  if(xF)arr=arr.filter(function(t){return t.xonaId===xF});
  else if(bF){var bX2=Object.values(X).filter(function(x){return x.binoId===bF}).map(function(x){return x.id});arr=arr.filter(function(t){return bX2.indexOf(t.xonaId)!==-1});}
  arr.sort(function(a,b){return(a.familiya||"").localeCompare(b.familiya||"")});
  $i("tal-cnt").textContent="Talabalar ("+arr.length+" ta)";
  $i("tal-emp").style.display=arr.length?"none":"block";
  $i("tal-tbl").innerHTML=arr.map(function(t){
    var xona=X[t.xonaId],bn=xona?B[xona.binoId]:null;
    return'<tr>'+
      '<td>'+avH(t.rasm,34,8)+'</td>'+
      '<td><div style="font-weight:600">'+esc(t.familiya||"")+" "+esc(t.ism||"")+'</div><div style="font-size:10px;color:var(--tx2)">'+esc(t.otasi||"")+'</div></td>'+
      '<td><span class="bdg bdg-a">'+esc(t.talabaId||"—")+'</span></td>'+
      '<td>'+esc(t.guruh||"")+'</td>'+
      '<td>'+(xona?'<span class="bdg bdg-g">'+(bn?esc(bn.nom)+", ":"")+esc(xona.raqam)+"-xona</span>":"<span style='color:var(--red)'>Xona yo'q</span>")+'</td>'+
      '<td>'+esc(t.kurs||"—")+'</td>'+
      '<td><button class="btn btn-sec btn-xs" data-id="'+t.id+'">Ko\'rish</button></td>'+
    '</tr>';
  }).join("");
  $i("tal-tbl").querySelectorAll("button[data-id]").forEach(function(btn){btn.addEventListener("click",function(){openTalaba(btn.dataset.id)})});
}

function openTalaba(id){
  var t=T[id];if(!t)return;viewTalabaId=id;
  var xona=X[t.xonaId],bn=xona?B[xona.binoId]:null,n=now();
  var moK=Object.values(K).filter(function(k){return k.talabaId===id&&k.sana&&k.sana.indexOf(n.month)===0}).length;
  var jmK=Object.values(K).filter(function(k){return k.talabaId===id}).length;
  var cell=function(l,v){return'<div style="background:var(--sf2);border-radius:7px;padding:9px"><div style="font-size:9px;color:var(--tx2);margin-bottom:2px">'+l+'</div><div style="font-size:12px;font-weight:600">'+v+'</div></div>'};
  $i("td-body").innerHTML=
    '<div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:16px">'+
    avH(t.rasm,80,10)+
    '<div><div style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:16px;font-weight:700">'+esc(t.familiya||"")+" "+esc(t.ism||"")+'</div>'+
    '<div style="color:var(--tx2);font-size:12px;margin:3px 0">'+esc(t.otasi||"")+'</div>'+
    '<span class="bdg bdg-a">ID: '+esc(t.talabaId||"—")+'</span></div></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">'+
    cell("GURUH",esc(t.guruh||"—"))+cell("FAKULTET",esc((t.fakultet||"—").split(" ")[0]))+
    cell("XONA",xona?(bn?esc(bn.nom)+", ":"")+esc(xona.raqam)+"-xona":"<span style='color:var(--red)'>Biriktirilmagan</span>")+
    cell("TELEFON",esc(t.telefon||"—"))+'</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+
    '<div style="background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.18);border-radius:8px;padding:10px;text-align:center"><div style="font-size:10px;color:var(--tx2);margin-bottom:3px">BU OY</div><div style="font-size:22px;font-weight:800;color:var(--red)">'+moK+'</div><div style="font-size:10px;color:var(--tx2)">kechikish</div></div>'+
    '<div style="background:rgba(79,127,255,.07);border:1px solid rgba(79,127,255,.18);border-radius:8px;padding:10px;text-align:center"><div style="font-size:10px;color:var(--tx2);margin-bottom:3px">JAMI</div><div style="font-size:22px;font-weight:800;color:var(--a)">'+jmK+'</div><div style="font-size:10px;color:var(--tx2)">kechikish</div></div></div>';
  $i("tal-del-btn").style.display=window._isA?"inline-flex":"none";
  $i("tal-edit-btn").style.display=(window._isA||window._isTarb)?"inline-flex":"none";
  openMod("m-tal-det");
}

/* ── YO'QLAMA ── */
function initYoqSana(){
  var n=now(),el=$i("yoq-sana");if(!el)return;
  el.max=n.date;el.min=yesterday();
  if(!el.value||el.value>n.date||el.value<yesterday())el.value=n.date;
}
function getYoqSana(){return $i("yoq-sana").value||now().date}

function renderYoqlama(){
  var sana=getYoqSana();
  $i("yoq-sub").textContent=sana;
  var n=now();
  // Faqat bugun yoki kecha
  if(sana!==n.date&&sana!==yesterday()){
    $i("yoq-content").innerHTML='<div style="color:var(--tx2);font-size:13px;text-align:center;padding:40px">Faqat bugun yoki kecha uchun yo\'qlama qilish mumkin</div>';
    $i("yoq-stats").innerHTML="";return;
  }
  var bF=$i("yf-bino").value,qF=$i("yf-qavat").value;
  if(role==="tarbiyachi"&&(!myBinoId||myBinoId==="__all__")){
    $i("yoq-content").innerHTML='<div style="text-align:center;padding:40px;color:var(--tx2)">Sizga hali bino biriktirilmagan.<br><small>Admin bilan bog\'laning.</small></div>';
    $i("yoq-stats").innerHTML="";return;
  }
  if(!bF){$i("yoq-content").innerHTML='<div style="color:var(--tx2);font-size:13px;text-align:center;padding:40px">Bino tanlang</div>';$i("yoq-stats").innerHTML="";return}
  var yDay=Y[sana]||{};
  var xArr=Object.values(X).filter(function(x){return x.binoId===bF&&(!qF||String(x.qavat)===qF)})
    .sort(function(a,b){return parseInt(a.raqam)-parseInt(b.raqam)});
  var xIds=xArr.map(function(x){return x.id});
  var allTals=Object.values(T).filter(function(t){return xIds.indexOf(t.xonaId)!==-1});
  if(!allTals.length){$i("yoq-content").innerHTML='<div style="color:var(--tx2);font-size:13px;text-align:center;padding:40px">Talaba topilmadi</div>';$i("yoq-stats").innerHTML="";return}
  var borS=allTals.filter(function(t){return(yDay[t.id]||{}).holat==="bor"}).length;
  var yoqS=allTals.filter(function(t){return(yDay[t.id]||{}).holat==="yoq"}).length;
  var blmg=allTals.filter(function(t){return!(yDay[t.id]||{}).holat}).length;
  $i("yoq-stats").innerHTML=sc("sc-g","Bor",borS,"")+sc("sc-r","Yo'q",yoqS,"")+sc("sc-b","Belgilanmagan",blmg,"");
  var canMark=role==="tarbiyachi"||role==="admin";
  var sbl={kasallik:"Kasallik",safar:"Safar/Uy",sababsiz:"Sababsiz"};
  $i("yoq-content").innerHTML=xArr.map(function(x){
    var tals=Object.values(T).filter(function(t){return t.xonaId===x.id});if(!tals.length)return"";
    var rows=tals.map(function(t){
      var yd2=yDay[t.id]||{},h=yd2.holat||"",sb=yd2.sabab||"";
      var badge=h==="bor"?'<span class="bdg bdg-g">Bor</span>':
        h==="yoq"?'<div style="text-align:right"><span class="bdg bdg-r">Yo\'q</span><div style="font-size:10px;color:var(--red);margin-top:2px">'+(sbl[sb]||sb)+'</div>'+(yd2.izoh?'<div style="font-size:10px;color:var(--tx2)">'+esc(yd2.izoh)+'</div>':'')+'</div>':
        
        '<span style="font-size:11px;color:var(--tx3)">Kutilmoqda</span>';
      var btns=canMark?'<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px">'+
        '<button class="btn btn-s btn-xs" style="'+(h==="bor"?"":"opacity:.55")+'" onclick="markYoq(\''+t.id+'\',\'bor\',\''+sana+'\')">Bor</button>'+
        '<button class="btn btn-d btn-xs" style="'+(h==="yoq"?"":"opacity:.55")+'" onclick="openYoqSabab(\''+t.id+'\',\''+sana+'\')">Yo\'q</button>'+
        ''+
        '</div>':"";
      var rowBg=h==="yoq"?"background:rgba(239,68,68,.05);border-color:rgba(239,68,68,.2)":h==="bor"?"background:rgba(16,185,129,.04);border-color:rgba(16,185,129,.15)":"background:var(--sf2)";
      return'<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:var(--r);margin-bottom:6px;border:1px solid var(--bd);'+rowBg+'">'+
        avH(t.rasm,42,8)+'<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600">'+esc(t.familiya||"")+" "+esc(t.ism||"")+'</div>'+
        '<div style="font-size:11px;color:var(--tx2)">'+esc(t.otasi||"")+" &bull; "+esc(t.guruh||"")+'</div>'+btns+'</div>'+
        '<div style="flex-shrink:0">'+badge+'</div></div>';
    }).join("");
    return'<div class="tcard" style="margin-bottom:12px"><div class="tcard-hdr"><span class="tcard-ttl">'+esc(x.raqam)+'-xona &bull; '+x.qavat+'-qavat</span><span style="font-size:11px;color:var(--tx2)">'+Object.values(T).filter(function(t){return t.xonaId===x.id}).length+'/'+x.yotoqSoni+' talaba</span></div><div style="padding:12px">'+rows+'</div></div>';
  }).join("");
}

window.markYoq=function(tId,holat,sana){
  if(!Y[sana])Y[sana]={};
  var cur=(Y[sana][tId]||{}).holat||"";
  // Yo'q -> faqat admin o'zgartira oladi
  if(cur==="yoq"&&role!=="admin"){
    toast("Yo’q belgilangan, o’zgartirib bo’lmaydi!",1);return;
  }
  if(holat===""){
    // Bekor qilish
    delete Y[sana][tId];
  } else {
    Y[sana][tId]={holat:holat,timestamp:new Date().toISOString()};
  }
  sv("yoqlama",Y);renderYoqlama();
};
window.openYoqSabab=function(tId,sana){
  yoqSababInfo={tId:tId,sana:sana};yoqSelSabab=null;
  $i("yoq-sabab-izoh").value="";
  document.querySelectorAll("#sabab-grid button").forEach(function(b){b.classList.remove("sel","sel-d")});
  var t=T[tId],xona=X[t&&t.xonaId];
  $i("yoq-sabab-info").innerHTML=t?avH(t.rasm,44,9)+'<div><div style="font-size:14px;font-weight:600">'+esc(t.familiya||"")+" "+esc(t.ism||"")+'</div><div style="font-size:11px;color:var(--tx2)">'+esc(t.otasi||"")+(xona?" &bull; "+esc(xona.raqam)+"-xona":"")+'</div></div>':"";
  openMod("m-yoq-sabab");
};

/* ── KECHIKISH ── */
function renderKechikish(){
  var n=now(),h=n.hour;
  var isNaz=window._isNaz,isTarb=window._isTarb,isA=window._isA;
  var canMark=isA||isNaz||isTarb;
  var timeOk=(isA||isTarb)||(isNaz&&(h>=22||h<7)); // nazoratchi 22:00-07:00
  var infoEl=$i("kech-time-info");
  if(isNaz&&!(h>=22||h<7)){
    infoEl.textContent="Kechikish belgilash vaqti: 22:00 - 07:00. Hozir: "+n.time;
    infoEl.style.background="rgba(239,68,68,.07)";infoEl.style.borderColor="rgba(239,68,68,.2)";
  }else{
    infoEl.textContent="Kechikish belgilash vaqti. Hozir: "+n.time+" (UTC+5)";
    infoEl.style.background="rgba(79,127,255,.06)";infoEl.style.borderColor="rgba(79,127,255,.18)";
  }
  $i("kech-qidiruv-panel").style.display=canMark&&timeOk?"block":"none";
  // Bugungi kechikishlar
  var today=Object.values(K).filter(function(k){return k.sana===n.date}).sort(function(a,b){return(b.timestamp||0)-(a.timestamp||0)});
  $i("kech-count").textContent=today.length+" ta";
  $i("kech-list").innerHTML=today.length?today.map(function(k){
    return'<div style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--bd)">'+
      avH(k.photo,40,8)+'<div style="flex:1"><div style="font-size:13px;font-weight:600">'+esc(k.familiya||"")+" "+esc(k.ism||"")+'</div>'+
      '<div style="font-size:11px;color:var(--tx2)">'+esc(k.xonaRaqam||"")+(k.binoNom?" &bull; "+esc(k.binoNom):"")+' &bull; '+esc(k.vaqt||"")+(k.izoh?' &bull; <i>'+esc(k.izoh)+'</i>':'')+'</div></div>'+
      '<span class="bdg bdg-r">Kechdi</span></div>';
  }).join(""):'<div style="color:var(--tx2);font-size:13px;text-align:center;padding:40px">Bugun kechikish yo\'q</div>';
}

function searchKechikish(){
  var q=($i("kf-srch").value||"").toLowerCase();
  var sl=$i("ksr-list");
  if(!q){sl.innerHTML="";return}
  var arr=Object.values(T).filter(function(t){
    if(!seeAll()&&myBino()){var xona=X[t.xonaId];if(!xona||xona.binoId!==myBino())return false;}
    return[t.ism||"",t.familiya||"",t.talabaId||"",t.otasi||"",X[t.xonaId]?X[t.xonaId].raqam:""].join(" ").toLowerCase().indexOf(q)!==-1;
  }).slice(0,10);
  sl.innerHTML=arr.length?arr.map(function(t){
    var x=X[t.xonaId],bn=x?B[x.binoId]:null;
    return'<div class="ksr-it" data-id="'+t.id+'">'+avH(t.rasm,36,7)+
      '<div><div style="font-size:13px;font-weight:600">'+esc(t.familiya||"")+" "+esc(t.ism||"")+'</div>'+
      '<div style="font-size:11px;color:var(--tx2)">'+esc(t.otasi||"")+(x?" &bull; "+esc(x.raqam)+"-xona":"")+(bn?" ("+esc(bn.nom)+")":"")+" &bull; ID: "+esc(t.talabaId||"")+'</div></div></div>';
  }).join(""):'<div style="padding:14px;color:var(--tx2);font-size:13px;text-align:center">Topilmadi</div>';
  sl.querySelectorAll(".ksr-it").forEach(function(item){
    item.addEventListener("click",function(){selectKechTalaba(item.dataset.id)});
  });
}

function selectKechTalaba(id){
  var t=T[id];if(!t)return;selNazTalaba=id;
  $i("ksr-list").innerHTML="";$i("kf-srch").value="";
  var x=X[t.xonaId],bn=x?B[x.binoId]:null;
  $i("ksr-sel").style.display="block";
  $i("ksr-sel").innerHTML='<div class="ksr-sel-box" style="display:flex;align-items:center;gap:12px">'+avH(t.rasm,48,9)+
    '<div><div style="font-size:14px;font-weight:600">'+esc(t.familiya||"")+" "+esc(t.ism||"")+'</div>'+
    '<div style="font-size:12px;color:var(--tx2)">'+esc(t.otasi||"")+'</div>'+
    '<div style="font-size:11px;color:var(--tx2);margin-top:2px">ID: '+esc(t.talabaId||"")+(x?" &bull; "+esc(x.raqam)+"-xona":"")+(bn?" ("+esc(bn.nom)+")":"")+'</div></div></div>';
  $i("kech-sabab-panel").style.display="block";
  $i("kech-izoh").value="";
}

/* ── USERS ── */
// Foydalanuvchini tahrirlash huquqi
function canEditUser(u){
  if(!u) return false;
  if(role==="admin") return true;
  if(role!=="nazoratchi") return false; // faqat nazoratchi tahrirlaydi
  if(seeAll()) return true; // barcha binoli nazoratchi
  return u.binoId===myBino(); // bitta binoli - faqat o'z binosi
}
function canDelUser(u){
  if(!u) return false;
  if(role==="admin") return true;
  // Nazoratchi o'chira olmaydi
  return false;
}

function renderUsers(){
  var arr=Object.values(U).filter(function(u){
    if(u.role==="admin") return false;
    if(role==="admin") return true;
    // Nazoratchi - faqat barcha-binoli (seeAll) ko'ra oladi
    if(u.role==="nazoratchi") return seeAll();
    // Boshqalar - barcha binoli bo'lsa hammani, aks holda faqat o'z binosi
    if(seeAll()) return true;
    return u.binoId===myBino()||u.binoId==="__all__";
  });
  var g=$i("users-grid");
  if(!arr.length){g.innerHTML='<div style="color:var(--tx2);font-size:13px;padding:20px;text-align:center">Foydalanuvchi yo\'q</div>';return}
  g.innerHTML=arr.map(function(u){
    var rb=RCLR[u.role]||"rb-tekshiruvchi",lbl=RLBL[u.role]||u.role;
    var bn=u.binoId?B[u.binoId]:null;
    var nm=((u.ism||"")+" "+(u.familiya||"")).trim()||u.email;
    return'<div class="user-card">'+
      '<div style="width:44px;height:44px;border-radius:50%;'+(u.rasm?'overflow:hidden':'background:'+RAVBG[u.role||"tekshiruvchi"])+';display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;flex-shrink:0">'+
        (u.rasm?'<img src="'+u.rasm+'" style="width:100%;height:100%;object-fit:cover">':esc((u.ism||u.email||"U")[0]).toUpperCase())+
      '</div>'+
      '<div style="flex:1;min-width:0">'+
        '<div style="font-size:13px;font-weight:600">'+esc(nm)+'</div>'+
        '<div style="font-size:11px;color:var(--tx2)">'+esc(u.email)+'</div>'+
        (bn?'<div style="font-size:11px;color:var(--tx2)">'+esc(bn.nom)+'</div>':'')+
      '</div>'+
      '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">'+
        '<span class="rbdg '+rb+'">'+lbl+'</span>'+
        '<div style="display:flex;gap:5px">'+
          (canEditUser(u)?'<button class="btn btn-sec btn-xs eu-btn" data-id="'+u.id+'">Tahrir</button>':'')+(canDelUser(u)?'<button class="btn btn-d btn-xs du-btn" data-id="'+u.id+'">O\'chirish</button>':'')+
        '</div>'+
      '</div>'+
    '</div>';
  }).join("");
  g.querySelectorAll(".eu-btn").forEach(function(b){b.addEventListener("click",function(){
    var u=U[b.dataset.id];
    if(canEditUser(u))editUser(b.dataset.id);
    else toast("Bu foydalanuvchini tahrirlash huquqingiz yo'q",1);
  })});
  g.querySelectorAll(".du-btn").forEach(function(b){b.addEventListener("click",function(){
    var u=U[b.dataset.id];
    if(canDelUser(u))delUser(b.dataset.id);
    else toast("O'chirish huquqingiz yo'q",1);
  })});
}

function editUser(id){
  var u=U[id];if(!u)return;editUserId=id;
  $i("u-ism").value=u.ism||"";$i("u-fam").value=u.familiya||"";$i("u-ota").value=u.otasi||"";
  $i("u-em").value=u.email||"";$i("u-pw").value="";$i("u-rol").value=u.role||"";$i("u-bino").value=u.binoId||"";
  userPhoto=u.rasm||null;
  if(u.rasm){$i("u-ph-img").src=u.rasm;$i("u-ph-img").style.display="block";$i("u-php").style.display="none";}
  $i("u-edit-note").style.display="block";
  $i("user-m-ttl").textContent="Foydalanuvchini tahrirlash";
  updSel();openMod("m-user");
}

function delUser(id){
  var u=U[id];if(!u)return;
  confirmDel("Foydalanuvchini o'chirasizmi?",function(){delete U[id];sv("users",U);renderUsers();toast("O'chirildi")},esc(u.familiya||"")+" "+esc(u.ism||""));
}

/* ── SAVE FUNCTIONS ── */
function saveTalaba(){
  var ism=$i("t-ism").value.trim(),fam=$i("t-fam").value.trim();
  var ota=$i("t-ota").value.trim(),tid=$i("t-id").value.trim();
  var fak=$i("t-fak").value,grp=$i("t-grp").value.trim(),xonaId=$i("t-xona").value;
  if(!ism||!fam||!ota||!tid||!fak||!grp||!xonaId){toast("Barcha * maydonlarni to'ldiring!",1);return}
  if(!talPhoto){$i("t-pha").classList.add("err");toast("Rasm majburiy!",1);return}
  if(role==="tarbiyachi"&&myBinoId&&myBinoId!=="__all__"){var x3=X[xonaId];if(x3&&x3.binoId!==myBinoId){toast("Faqat o'z binoingizga!",1);return}}
  // Talaba ID takrorlanmasin
  var dup=Object.values(T).find(function(t){return t.talabaId===tid&&t.id!==(editTalabaId||"")});
  if(dup){toast("Bu ID allaqachon mavjud!",1);return}
  var data={ism:ism,familiya:fam,otasi:ota,talabaId:tid,fakultet:fak,guruh:grp,xonaId:xonaId,
    telefon:$i("t-tel").value.trim(),yil:$i("t-yil").value.trim(),kurs:$i("t-kurs").value,rasm:talPhoto,ts:Date.now()};
  if(editTalabaId){Object.assign(T[editTalabaId],data)}
  else{var id2=uid();data.id=id2;T[id2]=data}
  sv("talabalar",T);closeMod("m-talaba");toast(fam+" "+ism+" saqlandi");resetTalabaForm();renderTalabalar();
}

function resetTalabaForm(){
  ["t-ism","t-fam","t-ota","t-id","t-grp","t-tel","t-yil"].forEach(function(id){$i(id).value=""});
  ["t-fak","t-xona","t-kurs"].forEach(function(id){$i(id).value=""});
  talPhoto=null;editTalabaId=null;
  $i("t-ph-img").style.display="none";$i("t-php").style.display="block";$i("t-pha").classList.remove("err");
  $i("tal-m-ttl").textContent="Talaba qo'shish";
}

function saveUser(){
  var ism=$i("u-ism").value.trim(),fam=$i("u-fam").value.trim();
  var em=$i("u-em").value.trim(),pw=$i("u-pw").value;
  var rol=$i("u-rol").value,bino=$i("u-bino").value;
  if(!ism||!fam||!em||!rol){toast("Majburiy maydonlar!",1);return}
  if(!editUserId&&!pw){toast("Yangi foydalanuvchi uchun parol kiriting!",1);return}
  if(pw&&pw.length<4){toast("Parol kamida 4 belgili!",1);return}
  var dup=Object.values(U).find(function(u){return u.email===em&&u.id!==editUserId});
  if(dup){toast("Bu email allaqachon mavjud!",1);return}
  var data={ism:ism,familiya:fam,otasi:$i("u-ota").value.trim(),email:em,role:rol,binoId:bino||"",rasm:userPhoto||null};
  if(editUserId){Object.assign(U[editUserId],data);if(pw)U[editUserId].pw=hp(pw);}
  else{var id3=uid();data.id=id3;data.pw=hp(pw);U[id3]=data;}
  sv("users",U);closeMod("m-user");toast("Saqlandi");resetUserForm();renderUsers();
}

function resetUserForm(){
  ["u-ism","u-fam","u-ota","u-em","u-pw"].forEach(function(id){$i(id).value=""});
  $i("u-rol").value="";$i("u-bino").value="";
  userPhoto=null;editUserId=null;
  $i("u-ph-img").style.display="none";$i("u-php").style.display="block";
  $i("u-edit-note").style.display="none";
  $i("user-m-ttl").textContent="Foydalanuvchi qo'shish";
}

function saveBino(){
  var nom=$i("b-nom").value.trim(),qavat=parseInt($i("b-qavat").value);
  if(!nom||!qavat){toast("Majburiy maydonlar!",1);return}
  var id4=uid();B[id4]={id:id4,nom:nom,qavatlar:qavat};
  sv("binolar",B);$i("b-nom").value="";$i("b-qavat").value="";
  renderBinolar();updSel();toast("Bino qo'shildi");
}

function saveXona(){
  var binoId=$i("xb-bino").value,qavat=$i("xb-qavat").value;
  var raqam=$i("xb-raqam").value.trim(),yotoq=parseInt($i("xb-yotoq").value);
  if(!binoId||!qavat||!raqam||!yotoq){toast("Majburiy maydonlar!",1);return}
  if(window._isTarb&&myBinoId&&myBinoId!=="__all__"&&binoId!==myBinoId){toast("Faqat o'z binoingizga!",1);return}
  // Xona raqami takrorlanmasin
  var dup2=Object.values(X).find(function(x){return x.binoId===binoId&&x.raqam===raqam&&x.qavat===parseInt(qavat)});
  if(dup2){toast("Bu xona allaqachon mavjud!",1);return}
  var id5=uid();X[id5]={id:id5,binoId:binoId,qavat:parseInt(qavat),raqam:raqam,yotoqSoni:yotoq};
  sv("xonalar",X);$i("xb-raqam").value="";$i("xb-yotoq").value="";
  renderXonalar();updSel();toast("Xona qo'shildi");
}

/* ── SELECTS ── */
function updSel(){
  var bArr=Object.values(B),xArr=Object.values(X);
  ["xf-bino","tf-bino"].forEach(function(sid){
    var s=$i(sid);if(!s)return;var c=s.value;
    s.innerHTML='<option value="">Barcha binolar</option>'+bArr.map(function(b){return'<option value="'+b.id+'"'+(b.id===c?" selected":"")+">"+esc(b.nom)+"</option>"}).join("");
  });
  var ubS=$i("u-bino");if(ubS){var cuB=ubS.value;ubS.innerHTML='<option value="">--- Bino tanlang ---</option><option value="__all__"'+(cuB==="__all__"?" selected":"")+'>Barcha binolar</option>'+bArr.map(function(b){return'<option value="'+b.id+'"'+(b.id===cuB?" selected":"")+">"+esc(b.nom)+"</option>"}).join("");}
  var xbS=$i("xb-bino");
  if(xbS){
    var cxb=xbS.value;
    var xbArr=(role==="tarbiyachi"&&myBinoId&&myBinoId!=="__all__")?bArr.filter(function(b){return b.id===myBinoId}):bArr;
    xbS.innerHTML='<option value="">Tanlang</option>'+xbArr.map(function(b){return'<option value="'+b.id+'"'+(b.id===cxb?" selected":"")+">"+esc(b.nom)+"</option>"}).join("");
    if(role==="tarbiyachi"&&myBinoId&&myBinoId!=="__all__"&&!cxb){xbS.value=myBinoId;var bn5=bArr.find(function(b){return b.id===myBinoId});var xqS=$i("xb-qavat");if(xqS&&bn5){xqS.innerHTML='<option value="">Tanlang</option>'+Array.from({length:bn5.qavatlar},function(_,i){return'<option value="'+(i+1)+'">'+(i+1)+'-qavat</option>'}).join("");}}
  }
  var bF=$i("xf-bino").value,bn6=bArr.find(function(b){return b.id===bF});
  $i("xf-qavat").innerHTML='<option value="">Barcha qavatlar</option>'+(bn6?Array.from({length:bn6.qavatlar},function(_,i){return'<option value="'+(i+1)+'">'+(i+1)+'-qavat</option>'}).join(""):"");
  var yBS=$i("yf-bino"),curY=yBS.value;
  var yBArr=(role==="tarbiyachi"&&myBinoId&&myBinoId!=="__all__")?bArr.filter(function(b){return b.id===myBinoId}):bArr;
  yBS.innerHTML='<option value="">Bino tanlang</option>'+yBArr.map(function(b){return'<option value="'+b.id+'"'+(b.id===curY?" selected":"")+">"+esc(b.nom)+"</option>"}).join("");
  var yBF=$i("yf-bino").value,yQS=$i("yf-qavat");
  if(yBF){var qavList=[];Object.values(X).filter(function(x){return x.binoId===yBF}).forEach(function(x){if(qavList.indexOf(x.qavat)===-1)qavList.push(x.qavat)});qavList.sort(function(a,b){return a-b});yQS.innerHTML='<option value="">Barcha qavatlar</option>'+qavList.map(function(q){return'<option value="'+q+'">'+q+'-qavat</option>'}).join("");}
  else{yQS.innerHTML='<option value="">Barcha qavatlar</option>'}
  var txS=$i("t-xona");
  if(txS){var cur=txS.value;var avX=xArr.filter(function(x){if(role==="tarbiyachi"&&myBinoId&&myBinoId!=="__all__"&&x.binoId!==myBinoId)return false;var band=Object.values(T).filter(function(t){return t.xonaId===x.id}).length;return band<(x.yotoqSoni||1)||(editTalabaId&&T[editTalabaId]&&T[editTalabaId].xonaId===x.id)});txS.innerHTML='<option value="">Tanlang</option>'+avX.map(function(x){var bn2=B[x.binoId];return'<option value="'+x.id+'"'+(x.id===cur?" selected":"")+">"+(bn2?esc(bn2.nom)+", ":"")+esc(x.raqam)+"-xona ("+x.qavat+"-qavat, "+(x.yotoqSoni-Object.values(T).filter(function(t){return t.xonaId===x.id}).length)+" joy)</option>"}).join("");}
  var tfxS=$i("tf-xona"),tfbF=$i("tf-bino").value;
  if(tfxS){tfxS.innerHTML='<option value="">Barcha xonalar</option>'+xArr.filter(function(x){return!tfbF||x.binoId===tfbF}).map(function(x){return'<option value="'+x.id+'">'+esc(x.raqam)+'-xona</option>'}).join("");}
  var eBS=$i("exp-bino");
  if(eBS){var eC=eBS.value;
    var eA=((role==="tarbiyachi"||(role==="tekshiruvchi"&&myBinoId&&myBinoId!=="__all__"))&&myBinoId)?bArr.filter(function(b){return b.id===myBinoId;}):bArr;
    eBS.innerHTML='<option value="">Barchasi</option>'+eA.map(function(b){return'<option value="'+b.id+'"'+(b.id===eC?" selected":"")+'>'+esc(b.nom)+'</option>';}).join("");}
}

/* ── CAMERA ── */
function makeCam(vidId,camboxId,oId,fId,cId,xId,onPhoto){
  var stream=null,facing="environment";
  function start(f){
    facing=f;if(stream)stream.getTracks().forEach(function(t){t.stop()});
    if(!navigator.mediaDevices){toast("Kamera uchun HTTPS kerak",1);return}
    navigator.mediaDevices.getUserMedia({video:{facingMode:f}}).then(function(s){
      stream=s;var v=$i(vidId);v.srcObject=s;$i(camboxId).style.display="block";v.play();
      $i(oId).style.display="none";[$i(fId),$i(cId),$i(xId)].forEach(function(el){if(el)el.style.display="inline-flex"});
    }).catch(function(){toast("Kamera ruxsati yo'q",1)});
  }
  function stop(){
    if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}
    var v=$i(vidId);if(v)v.srcObject=null;
    $i(camboxId).style.display="none";$i(oId).style.display="inline-flex";
    [$i(fId),$i(cId),$i(xId)].forEach(function(el){if(el)el.style.display="none"});
  }
  $i(oId).addEventListener("click",function(){start(facing)});
  $i(fId).addEventListener("click",function(){start(facing==="user"?"environment":"user")});
  $i(cId).addEventListener("click",function(){
    var v=$i(vidId),MAX=300,w=v.videoWidth,h=v.videoHeight;
    if(w>h){if(w>MAX){h=Math.round(h*MAX/w);w=MAX}}else{if(h>MAX){w=Math.round(w*MAX/h);h=MAX}}
    var c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(v,0,0,w,h);
    stop();onPhoto(c.toDataURL("image/jpeg",.65));
  });
  $i(xId).addEventListener("click",stop);
}
function compress(src,cb){
  var img=new Image();img.onload=function(){
    var MAX=280,w=img.width,h=img.height;
    if(w>h){if(w>MAX){h=Math.round(h*MAX/w);w=MAX}}else{if(h>MAX){w=Math.round(w*MAX/h);h=MAX}}
    var c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);cb(c.toDataURL("image/jpeg",.6));
  };img.src=src;
}

makeCam("tvid","t-cambox","tcam-o","tcam-f","tcam-c","tcam-x",function(src){
  talPhoto=src;$i("t-ph-img").src=src;$i("t-ph-img").style.display="block";$i("t-php").style.display="none";$i("t-pha").classList.remove("err");
});
makeCam("ucvid","u-cambox","ucam-o","ucam-f","ucam-c","ucam-x",function(src){
  userPhoto=src;$i("u-ph-img").src=src;$i("u-ph-img").style.display="block";$i("u-php").style.display="none";
});
["t-phf","u-phf"].forEach(function(fid){
  var isT=fid==="t-phf";
  $i(fid).addEventListener("change",function(e){
    var f=e.target.files[0];if(!f)return;
    var r=new FileReader();r.onload=function(ev){compress(ev.target.result,function(src){
      if(isT){talPhoto=src;$i("t-ph-img").src=src;$i("t-ph-img").style.display="block";$i("t-php").style.display="none";$i("t-pha").classList.remove("err")}
      else{userPhoto=src;$i("u-ph-img").src=src;$i("u-ph-img").style.display="block";$i("u-php").style.display="none"}
    })};r.readAsDataURL(f);
  });
});

/* ── PROFIL ── */
$i("prof-chip").addEventListener("click",function(){
  var fullNm=((me.ism||"")+" "+(me.familiya||"")).trim()||me.email;
  var ph=$i("pm-av");
  if(me.rasm){ph.innerHTML='<img src="'+me.rasm+'" style="width:100%;height:100%;object-fit:cover">';ph.style.background="transparent";}
  else{ph.textContent=(fullNm[0]||"U").toUpperCase();ph.style.background=RAVBG[role||"tekshiruvchi"];}
  $i("pm-nm").textContent=fullNm;
  $i("pm-rl").textContent=RLBL[role]||role;
  $i("pm-em").textContent=me.email||"";
  $i("pm-tel").value=me.telefon||"";
  $i("my-pw").value="";
  openMod("m-profil");
});

// Profil rasmini o'zgartirish
window.triggerProfilRasm=function(){$i("pm-rasm-inp").click();};
window.profilRasmChange=function(inp){
  if(!inp.files||!inp.files[0])return;
  var reader=new FileReader();
  reader.onload=function(e){
    compress(e.target.result,function(src){
      var ph=$i("pm-av");
      ph.innerHTML='<img src="'+src+'" style="width:100%;height:100%;object-fit:cover">';
      ph.style.background="transparent";
      ph.dataset.newrasm=src;
    });
  };
  reader.readAsDataURL(inp.files[0]);
};

// Profilni saqlash
window.saveMyProfil=function(){
  var pw=$i("my-pw").value.trim();
  var tel=$i("pm-tel").value.trim();
  var ph=$i("pm-av");
  var newRasm=ph.dataset.newrasm||null;

  // Telefon saqlash
  if(tel) U[me.id].telefon=tel;
  // Rasm saqlash
  if(newRasm){U[me.id].rasm=newRasm;me.rasm=newRasm;ph.dataset.newrasm="";}
  // Parol (admin emas bo'lsa parolni o'zgartirolmaydi - faqat admin va o'zi)
  if(pw){
    if(pw.length<4){toast("Kamida 4 belgili parol!",1);return;}
    U[me.id].pw=hp(pw);delete U[me.id].parol;me.pw=U[me.id].pw;
  }
  me.telefon=U[me.id].telefon||"";
  sv("users",U);
  // Header avatar yangilash
  var av=$i("pav");
  if(me.rasm){av.innerHTML='<img src="'+me.rasm+'" alt="profil">';av.style.background="transparent";}
  $i("my-pw").value="";
  toast("Profil yangilandi!");
  closeMod("m-profil");
};

// Tekshiruvchi - biriktirilgan tarbiyachi profilini ochish
window.openTarbProfil=function(){
  if(role!=="tekshiruvchi")return;
  // Biriktirilgan tarbiyachini topamiz
  var tarb=Object.values(U).find(function(u){return u.role==="tarbiyachi"&&u.binoId===myBinoId;});
  if(!tarb){toast("Biriktirilgan tarbiyachi topilmadi",1);return;}
  var fullNm=((tarb.ism||"")+" "+(tarb.familiya||"")).trim()||tarb.email;
  var tp=$i("tp-av");
  if(tarb.rasm){tp.innerHTML='<img src="'+tarb.rasm+'" style="width:100%;height:100%;object-fit:cover">';tp.style.background="transparent";}
  else{tp.textContent=(fullNm[0]||"T").toUpperCase();tp.style.background=RAVBG.tarbiyachi||"#10b981";}
  $i("tp-nm").textContent=fullNm;
  $i("tp-rl").textContent="Tarbiyachi";
  $i("tp-em").textContent=tarb.email||"";
  $i("tp-tel").value=tarb.telefon||"";
  $i("tp-uid").value=tarb.id;
  openMod("m-tarb-profil");
};

window.saveTarbProfil=function(){
  var uid=$i("tp-uid").value;
  var tel=$i("tp-tel").value.trim();
  if(!uid||!U[uid]){toast("Foydalanuvchi topilmadi",1);return;}
  if(tel) U[uid].telefon=tel;
  sv("users",U);
  toast("Tarbiyachi ma'lumotlari yangilandi!");
  closeMod("m-tarb-profil");
};

/* ── EVENTS ── */
setTheme(dark);
pwEye("lg-eye","lg-pw");pwEye("my-eye","my-pw");pwEye("u-eye","u-pw");
$i("th-app").addEventListener("click",function(){setTheme(!dark)});
$i("th-lg").addEventListener("click",function(){setTheme(!dark)});
$i("lg-btn").addEventListener("click",login);
$i("lg-em").addEventListener("keydown",function(e){if(e.key==="Enter")$i("lg-pw").focus()});
$i("lg-pw").addEventListener("keydown",function(e){if(e.key==="Enter")login()});
$i("out-btn").addEventListener("click",logout);
["dash","binolar","xonalar","talabalar","yoqlama","kechikish","users","sozl"].forEach(function(nm){
  var el=$i("nav-"+nm);if(el)el.addEventListener("click",function(){goPage(nm)});
});
[["mob-dash","dash"],["mob-talabalar","talabalar"],["mob-yoqlama","yoqlama"],["mob-kechikish","kechikish"],["mob-more","binolar"]].forEach(function(b){
  var el=$i(b[0]);if(el)el.addEventListener("click",function(){goPage(b[1])});
});
$i("add-bino-btn").addEventListener("click",function(){goPage("sozl")});
$i("add-xona-btn").addEventListener("click",function(){goPage("sozl")});
$i("add-tal-btn").addEventListener("click",function(){resetTalabaForm();updSel();openMod("m-talaba")});
$i("add-user-btn").addEventListener("click",function(){
  // Nazoratchi binoga biriktirilgan bo'lsa qo'sha olmaydi
  if(role==="nazoratchi"&&myBinoId&&myBinoId!=="__all__"){
    toast("Foydalanuvchi qo'shish huquqingiz yo'q",1);return;
  }resetUserForm();updSel();openMod("m-user")});
$i("tal-sav").addEventListener("click",saveTalaba);
$i("user-sav").addEventListener("click",saveUser);
$i("bino-sav").addEventListener("click",saveBino);
$i("xona-sav").addEventListener("click",saveXona);
$i("xb-bino").addEventListener("change",function(){
  var bn=B[this.value],q=$i("xb-qavat");
  q.innerHTML='<option value="">Tanlang</option>'+(bn?Array.from({length:bn.qavatlar},function(_,i){return'<option value="'+(i+1)+'">'+(i+1)+'-qavat</option>'}).join(""):"");
});
$i("tf-srch").addEventListener("input",renderTalabalar);
["tf-bino","tf-xona"].forEach(function(id){$i(id).addEventListener("change",function(){updSel();renderTalabalar()})});
["xf-bino","xf-qavat"].forEach(function(id){$i(id).addEventListener("change",function(){updSel();renderXonalar()})});
["yf-bino","yf-qavat"].forEach(function(id){$i(id).addEventListener("change",function(){updSel();renderYoqlama()})});
$i("yoq-sana").addEventListener("change",renderYoqlama);
$i("kf-srch").addEventListener("input",searchKechikish);
$i("kech-bekor").addEventListener("click",function(){
  selNazTalaba=null;$i("ksr-sel").style.display="none";$i("kech-sabab-panel").style.display="none";$i("kf-srch").value="";$i("ksr-list").innerHTML="";
});
$i("kech-saqlash").addEventListener("click",function(){
  if(!selNazTalaba){toast("Talaba tanlanmagan!",1);return}
  var t=T[selNazTalaba];if(!t)return;
  var n=now(),x=X[t.xonaId],bn=x?B[x.binoId]:null;
  var id6=uid();
  K[id6]={id:id6,talabaId:selNazTalaba,ism:t.ism,familiya:t.familiya,otasi:t.otasi,talabaId2:t.talabaId,
    xonaRaqam:x?x.raqam:"",xonaId:t.xonaId,binoNom:bn?bn.nom:"",
    sana:n.date,vaqt:n.time,izoh:$i("kech-izoh").value.trim(),photo:t.rasm||null,timestamp:Date.now()};
  sv("kechikishlar",K);
  selNazTalaba=null;$i("ksr-sel").style.display="none";$i("kech-sabab-panel").style.display="none";$i("kf-srch").value="";$i("ksr-list").innerHTML="";
  renderKechikish();toast(t.familiya+" "+t.ism+" — kechikish qayd qilindi");
});
$i("xona-del-btn").addEventListener("click",function(){
  if(!viewXonaId)return;
  var cnt=Object.values(T).filter(function(t){return t.xonaId===viewXonaId}).length;
  confirmDel("Xonani o'chirasizmi?",function(){
    Object.values(T).forEach(function(t){if(t.xonaId===viewXonaId){t.xonaId="";sv("talabalar",T)}});
    delete X[viewXonaId];sv("xonalar",X);closeMod("m-xona");renderXonalar();toast("O'chirildi");
  },cnt>0?"Bu xonada "+cnt+" talaba bor!":"");
});
$i("tal-del-btn").addEventListener("click",function(){
  if(!viewTalabaId)return;var t=T[viewTalabaId];
  confirmDel("Talabani o'chirasizmi?",function(){
    delete T[viewTalabaId];
    Object.keys(Y).forEach(function(s){if(Y[s][viewTalabaId])delete Y[s][viewTalabaId]});
    Object.keys(K).forEach(function(id){if(K[id].talabaId===viewTalabaId)delete K[id]});
    sv("talabalar",T);sv("yoqlama",Y);sv("kechikishlar",K);
    closeMod("m-tal-det");renderTalabalar();toast("O'chirildi");
  },t?esc(t.familiya)+" "+esc(t.ism):"");
});
$i("tal-edit-btn").addEventListener("click",function(){
  if(!viewTalabaId)return;var t=T[viewTalabaId];if(!t)return;
  editTalabaId=viewTalabaId;updSel();
  $i("t-ism").value=t.ism||"";$i("t-fam").value=t.familiya||"";$i("t-ota").value=t.otasi||"";
  $i("t-id").value=t.talabaId||"";$i("t-fak").value=t.fakultet||"";$i("t-grp").value=t.guruh||"";
  $i("t-xona").value=t.xonaId||"";$i("t-tel").value=t.telefon||"";$i("t-yil").value=t.yil||"";$i("t-kurs").value=t.kurs||"";
  talPhoto=t.rasm||null;
  if(t.rasm){$i("t-ph-img").src=t.rasm;$i("t-ph-img").style.display="block";$i("t-php").style.display="none";}
  $i("tal-m-ttl").textContent="Talabani tahrirlash";
  closeMod("m-tal-det");openMod("m-talaba");
});
$i("yoq-sabab-sav").addEventListener("click",function(){
  if(!yoqSababInfo||!yoqSelSabab){toast("Sabab tanlang!",1);return}
  var sana=yoqSababInfo.sana,tId=yoqSababInfo.tId;
  if(!Y[sana])Y[sana]={};
  Y[sana][tId]={holat:"yoq",sabab:yoqSelSabab,izoh:$i("yoq-sabab-izoh").value.trim(),timestamp:new Date().toISOString()};
  sv("yoqlama",Y);closeMod("m-yoq-sabab");renderYoqlama();
});
document.querySelectorAll("#sabab-grid button").forEach(function(b){
  b.addEventListener("click",function(){
    yoqSelSabab=b.dataset.s;
    document.querySelectorAll("#sabab-grid button").forEach(function(x){x.classList.remove("sel","sel-d")});
    b.classList.add(b.dataset.s==="sababsiz"?"sel-d":"sel");
  });
});
$i("conf-yes").addEventListener("click",function(){if(confirmCb){confirmCb();confirmCb=null}closeMod("m-conf")});
$i("conf-no").addEventListener("click",function(){confirmCb=null;closeMod("m-conf")});
document.querySelectorAll("[data-close]").forEach(function(btn){btn.addEventListener("click",function(){closeMod(btn.getAttribute("data-close"))})});
document.querySelectorAll(".ov").forEach(function(ov){
  ov.addEventListener("click",function(e){if(e.target===ov&&ov.id!=="m-conf")closeMod(ov.id)});
});
// Oxirgi sahifani tiklash
var lp=ld("lastPg");
if($i("APP").style.display==="block"&&lp&&lp!=="dash")goPage(lp);
// Sessiyani yangilash
// goPage to'liq implementatsiyasi
window._goPageFull = function(nm) {
  var isA2=role==="admin",isTarb2=role==="tarbiyachi",isNaz2=role==="nazoratchi",isTeksh2=role==="tekshiruvchi";
  if(nm==="users"&&!isA2&&!isTeksh2) nm="dash";
  if(nm==="binolar"&&!isA2&&!isTeksh2) nm="dash";
  if(nm==="sozl"&&!isA2&&!isTarb2&&!isTeksh2) nm="dash";
  document.querySelectorAll(".pg").forEach(function(p){p.classList.remove("on")});
  document.querySelectorAll(".nav-it").forEach(function(n){n.classList.remove("on")});
  document.querySelectorAll(".mob-btn").forEach(function(b){b.classList.remove("on")});
  var pg=$i("pg-"+nm),nv=$i("nav-"+nm);
  if(pg)pg.classList.add("on");if(nv)nv.classList.add("on");
  var mb=MMAP[nm];if(mb&&$i(mb))$i(mb).classList.add("on");
  sv("lastPg",nm);
  if(nm==="dash")renderDash();
  if(nm==="binolar")renderBinolar();
  if(nm==="xonalar"){xonaFlt=null;updSel();renderXonalar();}
  if(nm==="talabalar"){updSel();renderTalabalar();}
  if(nm==="yoqlama"){initYoqSana();updSel();if(role==="tarbiyachi"&&myBinoId&&myBinoId!=="__all__"){$i("yf-bino").value=myBinoId;updSel();}renderYoqlama();}
  if(nm==="kechikish"){renderKechikish();}
  if(nm==="users"){renderUsers();}
  if(nm==="sozl"){updSel();}
};
window.goPage = window._goPageFull;
window._goPageReady = true;
