var MMAP={dash:"mob-dash",talabalar:"mob-talabalar",yoqlama:"mob-yoqlama",kechikish:"mob-kechikish",binolar:"mob-more",xonalar:"mob-more",users:"mob-more",sozl:"mob-more"};

// goPage - sahifalar orasida o'tish (oldin e'lon qilinadi)
// goPage keyinroq to'liq e'lon qilinadi
window.goPage = function(nm){ if(window._goPageReady) window._goPageFull(nm); };
window._goPageFull = null;
window._goPageReady = false;

// Yordamchi: foydalanuvchi barcha binolarni ko'ra oladimi?
function seeAll(){
  if(role==="admin") return true;
  if(!myBinoId||myBinoId==="__all__") return true;
  return false;
}
// Biriktirilgan bino ID (agar bitta bo'lsa)
function myBino(){
  if(seeAll()) return null;
  return myBinoId;
}


/* ── STATE ── */
var me=null,role=null,myBinoId=null;
var dark=localStorage.getItem("ttjT")==="lt"?false:true;
var talPhoto=null,userPhoto=null;
var editTalabaId=null,editUserId=null;
var viewTalabaId=null,viewXonaId=null;
var selNazTalaba=null,confirmCb=null;
var yoqSababInfo=null,yoqSelSabab=null;
var xonaFlt=null;
var SESS_DUR=8*60*60*1000;

/* ── HELPERS ── */
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function toast(msg,err){
  var t=document.getElementById("toast");
  t.textContent=msg;
  t.style.borderColor=err?"var(--red)":"var(--grn)";
  t.classList.add("show");
  clearTimeout(t._t);
  t._t=setTimeout(function(){t.classList.remove("show")},3200);
}
function $i(id){return document.getElementById(id)}
function openMod(id){$i(id).classList.add("open")}
function closeMod(id){$i(id).classList.remove("open")}
function confirmDel(msg,cb,sub){
  $i("conf-msg").textContent=msg;
  $i("conf-sub").textContent=sub||"";
  confirmCb=cb;openMod("m-conf");
}

/* ── TIME (UTC+5) ── */
function now(){
  var n=new Date(),tz=new Date(n.getTime()+n.getTimezoneOffset()*60000+5*3600000);
  var p=function(x){return String(x).padStart(2,"0")};
  return{
    date:tz.getFullYear()+"-"+p(tz.getMonth()+1)+"-"+p(tz.getDate()),
    time:p(tz.getHours())+":"+p(tz.getMinutes()),
    disp:p(tz.getDate())+"."+p(tz.getMonth()+1)+"."+tz.getFullYear(),
    month:tz.getFullYear()+"-"+p(tz.getMonth()+1),
    hour:tz.getHours(),ts:tz.getTime()
  };
}
function yesterday(){
  var n=now(),d=new Date(n.ts-86400000);
  var p=function(x){return String(x).padStart(2,"0")};
  return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate());
}

/* ── THEME ── */
var I_SUN='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
var I_MOON='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
var I_EYE='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
var I_EYEO='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

function setTheme(d){
  dark=d;document.body.className=d?"dk":"lt";
  var ico=d?I_SUN:I_MOON;
  $i("th-app").innerHTML=ico;$i("th-lg").innerHTML=ico;
  localStorage.setItem("ttjT",d?"dk":"lt");
}
function pwEye(btnId,inpId){
  var b=$i(btnId);if(!b)return;b.innerHTML=I_EYE;
  b.addEventListener("click",function(){
    var inp=$i(inpId);
    if(inp.type==="password"){inp.type="text";b.innerHTML=I_EYEO;}
    else{inp.type="password";b.innerHTML=I_EYE;}
  });
}

/* ── ROLE CONFIG ── */
var RLBL={admin:"Admin",tarbiyachi:"Tarbiyachi",nazoratchi:"Nazoratchi",tekshiruvchi:"Tekshiruvchi"};
var RAVBG={
  admin:"linear-gradient(135deg,#4F7FFF,#3563E9)",
  tarbiyachi:"linear-gradient(135deg,#10B981,#059669)",
  nazoratchi:"linear-gradient(135deg,#F59E0B,#D97706)",
  tekshiruvchi:"linear-gradient(135deg,#8B5CF6,#7C3AED)"
};
var RCLR={admin:"rb-admin",tarbiyachi:"rb-tarbiyachi",nazoratchi:"rb-nazoratchi",tekshiruvchi:"rb-tekshiruvchi"};

/* ── AUTH ── */
function login(){
  var em=$i("lg-em").value.trim(),pw=$i("lg-pw").value;
  var err=$i("lg-err");
  if(!em||!pw){err.textContent="Email va parolni kiriting";err.style.display="block";return}
  var usrs=ld("users")||{};
  Object.keys(U).forEach(function(k){if(!usrs[k])usrs[k]=U[k]});
  var found=null,pwh=hp(pw);
  Object.values(usrs).forEach(function(u){
    if(u.email!==em)return;
    if(u.pw&&u.pw===pwh){found=u;return}
    if(u.parol&&u.parol===pw){u.pw=hp(pw);delete u.parol;usrs[u.id]=u;sv("users",usrs);found=u;}
  });
  if(found){
    U=usrs;me=found;role=found.role||"tekshiruvchi";myBinoId=found.binoId||null;
    sv("session",{uid:found.id,exp:Date.now()+SESS_DUR});
    err.style.display="none";
    $i("LG").style.display="none";$i("APP").style.display="block";
    setupUI();renderAll();_fbSync();
    var _lp=ld("lastPg");
    if(_lp&&_lp!=="dash")window.goPage(_lp);
  }else{err.textContent="Email yoki parol noto'g'ri";err.style.display="block"}
}

window.changeDashDate = function(val) {
  dashDate = val || null;
  var pill = $i("dash-sana"), n2 = now();
  if (pill) {
    if (dashDate && dashDate !== n2.date) {
      pill.style.background = "rgba(245,158,11,.15)";
      pill.style.color = "#F59E0B";
    } else {
      pill.style.background = "";
      pill.style.color = "";
    }
  }
  renderDash();
};

window.openTalabaById = function(id) { if (T[id]) openTalaba(id); };

window.exportCSV = function() {
  var type   = ($i("exp-type")   || {}).value || "talabalar";
  var period = ($i("exp-period") || {}).value || "today";
  var binoId = ($i("exp-bino")   || {}).value || "";
  var n = now(), df, dt = n.date;
  if (period === "today") df = n.date;
  else if (period === "week") {
    var wd = new Date(n.ts - 6*86400000);
    var pp = function(x){return String(x).padStart(2,"0");};
    df = wd.getFullYear()+"-"+pp(wd.getMonth()+1)+"-"+pp(wd.getDate());
  }
  else if (period === "month") df = n.month + "-01";
  else {
    df = (($i("exp-date-from")||{}).value) || n.date;
    dt = (($i("exp-date-to")  ||{}).value) || n.date;
  }
  var rows = [];
  if (type === "talabalar") {
    rows.push(["#","Familiya","Ism","Otasining ismi","Talaba ID","Guruh","Kurs","Xona","Bino","Telefon"]);
    Object.values(T)
      .filter(function(t){if(!binoId)return true;var x=X[t.xonaId];return x&&x.binoId===binoId;})
      .sort(function(a,b){return(a.familiya||"").localeCompare(b.familiya||"");})
      .forEach(function(t,i){
        var x=X[t.xonaId],b=x?B[x.binoId]:null;
        rows.push([i+1,t.familiya||"",t.ism||"",t.otasi||"",t.talabaId||"",
          t.guruh||"",t.kurs||"",x?x.raqam+"-xona":"",b?b.nom:"",t.telefon||""]);
      });
  } else if (type === "kechikish") {
    rows.push(["#","Familiya","Ism","Xona","Bino","Sana","Vaqt","Izoh"]);
    Object.values(K)
      .filter(function(k){
        if(k.sana<df||k.sana>dt)return false;
        if(binoId){var x=X[k.xonaId];return x&&x.binoId===binoId;}
        return true;
      })
      .sort(function(a,b){return(a.sana+a.vaqt).localeCompare(b.sana+b.vaqt);})
      .forEach(function(k,i){
        rows.push([i+1,k.familiya||"",k.ism||"",k.xonaRaqam||"",k.binoNom||"",k.sana||"",k.vaqt||"",k.izoh||""]);
      });
  } else {
    rows.push(["#","Familiya","Ism","Guruh","Xona","Bino","Sana","Holat"]);
    var r2=[];
    Object.entries(Y).forEach(function(e){
      var sana=e[0],day=e[1];
      if(sana<df||sana>dt)return;
      Object.entries(day).forEach(function(e2){
        var t=T[e2[0]],yi=e2[1];if(!t)return;
        var x=X[t.xonaId],b=x?B[x.binoId]:null;
        if(binoId&&(!x||x.binoId!==binoId))return;
        r2.push([t.familiya||"",t.ism||"",t.guruh||"",
          x?x.raqam+"-xona":"",b?b.nom:"",sana,
          yi.holat==="bor"?"Bor":yi.holat==="yoq"?"Yoq":"Belgilanmagan"]);
      });
    });
    r2.sort(function(a,b){return a[5].localeCompare(b[5]);})
      .forEach(function(r,i){rows.push([i+1].concat(r));});
  }
  if (rows.length < 2) { toast("Malumot topilmadi", 1); return; }
  var Q = String.fromCharCode;
  var csv = rows.map(function(row){
    return row.map(function(cell){
      var s = String(cell==null?"":cell).split(Q(34)).join(Q(34)+Q(34));
      if(s.indexOf(",")>-1||s.indexOf(Q(10))>-1) s=Q(34)+s+Q(34);
      return s;
    }).join(",");
  }).join(Q(10));
  var blob = new Blob([Q(0xFEFF)+csv],{type:"text/csv;charset=utf-8"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href=url; a.download="TTJ_"+type+"_"+period+"_"+df+".csv";
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
  toast("CSV yuklab olindi!");
};

window.resetAll = function() {
  if(!confirm("Barcha ma'lumotlar o'chadi!"))return;
  ["binolar","xonalar","talabalar","kechikishlar","yoqlama","users","session"].forEach(function(k){localStorage.removeItem(P+k)});
  location.reload();
};

function logout(){
  sv("session",null);me=null;role=null;
  $i("LG").style.display="flex";$i("APP").style.display="none";
  $i("lg-em").value="";$i("lg-pw").value="";
}
