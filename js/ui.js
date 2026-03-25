/* ── SETUP UI ── */
function setupUI(){
  var isA=role==="admin",isTarb=role==="tarbiyachi",isNaz=role==="nazoratchi",isTeksh=role==="tekshiruvchi";
  // Expose read-only
  Object.defineProperties(window,{
    _isA:{get:function(){return isA},configurable:true},
    _isTarb:{get:function(){return isTarb},configurable:true},
    _isNaz:{get:function(){return isNaz},configurable:true},
    _isTeksh:{get:function(){return isTeksh},configurable:true}
  });

  var fullNm=((me.ism||"")+" "+(me.familiya||"")).trim()||me.email;
  var av=$i("pav");
  if(me.rasm){av.innerHTML='<img src="'+me.rasm+'" alt="profil">';av.style.background="transparent";}
  else{av.textContent=(fullNm[0]||"U").toUpperCase();av.style.cssText="background:"+RAVBG[role]+";width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0";}
  $i("pnm").textContent=fullNm;$i("prl").textContent=RLBL[role]||role;
  var rb=$i("rbdg");rb.textContent=RLBL[role]||role;rb.className="rbdg "+(RCLR[role]||"rb-tekshiruvchi");

  // Nav ko'rinishi - sidebar va mob-nav bir xil
  // Har bir sahifa uchun ruxsat
  var navMap = {
    "dash":      true,
    "talabalar": isA||isTarb||isTeksh,
    "yoqlama":   isA||isTarb||isTeksh,
    "kechikish": isA||isNaz||isTarb,
    "binolar":   isA||isTeksh,
    "xonalar":   isA||isTarb||isTeksh,
    "users":     isA||isTeksh,
    "sozl":      isA||isTarb||isTeksh
  };

  // Sidebar
  $i("sb-adm").style.display=(isA||isTeksh)?"block":"none";
  Object.keys(navMap).forEach(function(nm){
    var el=$i("nav-"+nm);
    if(el) el.style.display=navMap[nm]?"flex":"none";
  });

  // Mob-nav - sidebar ile ayni
  // Mob nav da asosiy 4 ta: dash, talabalar, yoqlama, kechikish
  // Ko'proq (more) - binolar, xonalar, users, sozl bor bo'lsa ko'rsatiladi
  var mobItems = ["dash","talabalar","yoqlama","kechikish"];
  var moreItems = ["binolar","xonalar","users","sozl"];
  var hasMore = moreItems.some(function(nm){return navMap[nm];});

  mobItems.forEach(function(nm){
    var el=$i("mob-"+nm);
    if(el) el.style.display=navMap[nm]?"":"none";
  });
  var mobMore=$i("mob-more");
  if(mobMore) mobMore.style.display=hasMore?"":"none";

  // Page buttons
  $i("add-bino-btn").style.display=(isA||(isTeksh&&seeAll()))?"inline-flex":"none";
  // Foydalanuvchi qo'shish - admin va barcha-binoli nazoratchi
  var addUserBtn=$i("add-user-btn");
  if(addUserBtn) addUserBtn.style.display=(isA||(isNaz&&(!myBinoId||myBinoId==="__all__")))?"inline-flex":"none";
  $i("add-xona-btn").style.display=(isA||isTarb)?"inline-flex":"none";
  $i("add-tal-btn").style.display=(isA||isTarb)?"inline-flex":"none";
  $i("sozl-bino-tw").style.display=(isA||isTeksh)?"block":"none";
  // Tekshiruvchi - tarbiyachi profilini o'zgartirish tugmasi
  var tarbProfilBtn=$i("tarb-profil-btn");
  if(tarbProfilBtn) tarbProfilBtn.style.display=isTeksh?"block":"none";
  $i("sozl-xona-tw").style.display=(isA||isTarb)?"block":"none";

  // Xavfli zona - faqat admin
  var xavfliEl=document.getElementById("xavfli-zona");
  if(xavfliEl)xavfliEl.style.display=isA?"block":"none";



  // Nazoratchi uchun CSV faqat kechikish
  if(isNaz){
    var expType=$i("exp-type");
    if(expType){
      expType.value="kechikish";
      Array.from(expType.options).forEach(function(opt){
        if(opt.classList.contains("exp-not-naz")) opt.style.display="none";
      });
    }
  } else {
    var expType2=$i("exp-type");
    if(expType2){
      Array.from(expType2.options).forEach(function(opt){
        opt.style.display="";
      });
    }
  }

  // Agar joriy sahifa ruxsatsiz bo'lsa - dashboardga qayt
  setTimeout(function(){
    var activePg=document.querySelector(".pg.on");
    if(activePg){
      var pgId=activePg.id;
      if(pgId==="pg-users"&&!isA&&!isTeksh) window.goPage("dash");
      if(pgId==="pg-sozl"&&!isA&&!isTarb&&!isTeksh) window.goPage("dash");
      if(pgId==="pg-binolar"&&!isA&&!isTeksh) window.goPage("dash");
    }
  },0);
}
