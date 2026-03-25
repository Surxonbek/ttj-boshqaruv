var epEl=$i("exp-period");
if(epEl){epEl.addEventListener("change",function(){
  var isC=this.value==="custom";
  if($i("exp-df-w"))$i("exp-df-w").style.display=isC?"block":"none";
  if($i("exp-dt-w"))$i("exp-dt-w").style.display=isC?"block":"none";
  if(isC){var n3=now();if($i("exp-date-from"))$i("exp-date-from").value=n3.month+"-01";
    if($i("exp-date-to"))$i("exp-date-to").value=n3.date;}
});}

// PWA
  try{var mf={name:"TTJ Boshqaruv",short_name:"TTJ",start_url:"./",display:"standalone",
    background_color:"#070C18",theme_color:"#0D1B2A"};
    var bl=new Blob([JSON.stringify(mf)],{type:"application/json"});
    var lk=document.getElementById("pwa-manifest");if(lk)lk.href=URL.createObjectURL(bl);}catch(e){}
  if("serviceWorker" in navigator){try{
    var sw="self.addEventListener('install',function(e){self.skipWaiting();});";
    navigator.serviceWorker.register(URL.createObjectURL(new Blob([sw],{type:"text/javascript"}))).catch(function(){});}catch(e){}}
  var dp=null;
  window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();dp=e;
    var b=document.getElementById("install-btn");if(b)b.style.display="flex";});
  window.installPWA=function(){if(dp){dp.prompt();dp.userChoice.then(function(){dp=null;});}
    else{alert("Brauzer menyusidan 'Bosh ekranga qo’shish' ni tanlang");}};


setInterval(function(){if(me)sv("session",{uid:me.id,exp:Date.now()+SESS_DUR});},5*60*1000);
