/* ══ FIREBASE ══ */
var _db = null;

function _fbInit() {
  try {
    if (typeof firebase === "undefined") return;
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDw8_F9X4ZXPqFMVWJykE_A1PU78Qq20aM",
        authDomain: "ttj-boshqaruv.firebaseapp.com",
        projectId: "ttj-boshqaruv",
        storageBucket: "ttj-boshqaruv.firebasestorage.app",
        messagingSenderId: "291962903364",
        appId: "1:291962903364:web:8776b32b5ae15b9fee5511"
      });
    }
    _db = firebase.firestore();
    console.log("Firebase ulandi!");
  } catch(e) {
    console.warn("Firebase ulanmadi:", e.message);
    _db = null;
  }
}

function _fbSave(k, v) {
  if (!_db) return;
  _db.collection("ttj").doc(k).set({d: JSON.stringify(v), t: Date.now()})
    .catch(function(e) { console.warn("FB save:", e.message); });
}

function _fbLoad(cb) {
  if (!_db) { cb(); return; }
  _db.collection("ttj").get()
    .then(function(snap) {
      snap.forEach(function(doc) {
        try {
          var k = doc.id, p = JSON.parse(doc.data().d || "null");
          if (!p) return;
          if (k==="binolar") B=p;
          else if (k==="xonalar") X=p;
          else if (k==="talabalar") T=p;
          else if (k==="kechikishlar") K=p;
          else if (k==="yoqlama") Y=p;
          else if (k==="users") U=p;
          try { localStorage.setItem("ttj3_"+k, JSON.stringify(p)); } catch(e) {}
        } catch(e) {}
      });
      cb();
    })
    .catch(function() { cb(); });
}

function _fbSync() {
  if (!_db) return;
  ["binolar","xonalar","talabalar","kechikishlar","yoqlama","users"].forEach(function(k) {
    _db.collection("ttj").doc(k).onSnapshot(function(doc) {
      if (!doc.exists || !me) return;
      try {
        var p = JSON.parse(doc.data().d || "null");
        if (!p) return;
        if (k==="binolar") B=p;
        else if (k==="xonalar") X=p;
        else if (k==="talabalar") T=p;
        else if (k==="kechikishlar") K=p;
        else if (k==="yoqlama") Y=p;
        else if (k==="users") U=p;
        try { localStorage.setItem("ttj3_"+k, JSON.stringify(p)); } catch(e) {}
        if (k !== "users") renderAll();
      } catch(e) {}
    }, function() {});
  });
}

/* ══ DASHBOARD STATE ══ */
var dashDate = null;



/* ── STORAGE ── */
var P="ttj3_";
function ld(k){try{return JSON.parse(localStorage.getItem(P+k)||"null")}catch(e){return null}}
function sv(k,v){try{localStorage.setItem(P+k,JSON.stringify(v))}catch(e){toast("Xotira to'ldi!",1)}}
