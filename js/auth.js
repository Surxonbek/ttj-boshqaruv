// Auto-login
  var lg = document.getElementById("LG");
  var ap = document.getElementById("APP");
  if (lg) lg.style.display = "flex";
  if (ap) ap.style.display = "none";

  function doLogin() {
    var sess = ld("session");
    if (!sess || !sess.uid || !sess.exp || Date.now() > sess.exp) {
      sv("session", null);
      if (lg) lg.style.display = "flex";
      if (ap) ap.style.display = "none";
      return;
    }
    var usrs = ld("users") || {};
    Object.keys(U).forEach(function(k) { if (!usrs[k]) usrs[k] = U[k]; });
    var u = usrs[sess.uid];
    if (!u) {
      sv("session", null);
      if (lg) lg.style.display = "flex";
      if (ap) ap.style.display = "none";
      return;
    }
    U = usrs; me = u; role = u.role || "tekshiruvchi"; myBinoId = u.binoId || null;
    sv("session", {uid: u.id, exp: Date.now() + SESS_DUR});
    if (lg) lg.style.display = "none";
    if (ap) ap.style.display = "block";
    setupUI(); renderAll(); _fbSync();
    // Oxirgi sahifaga qaytish (ruxsat bo'lsa)
    var lp=ld("lastPg");
    if(lp && lp!=="dash") window.goPage(lp);
  }

  _fbInit();
  _fbLoad(doLogin);

