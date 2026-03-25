/* ── HASH ── */
function hp(pw){
  var h=2166136261,s="TTJ_S24_"+pw;
  for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=(h*16777619)>>>0;}
  return h.toString(16).padStart(8,"0");
}

/* ── DATA ── */
var B=ld("binolar")||{};
var X=ld("xonalar")||{};
var T=ld("talabalar")||{};
var K=ld("kechikishlar")||{};
var Y=ld("yoqlama")||{};
var U=ld("users")||{};

// Default admin
if(!Object.values(U).some(function(u){return u.role==="admin";})){
  var aid="adm0";
  U[aid]={id:aid,email:"admin@ttj.uz",pw:hp("Admin2024!"),role:"admin",ism:"Admin",familiya:"TTJ",otasi:"",rasm:null,binoId:""};
  sv("users",U);
}
