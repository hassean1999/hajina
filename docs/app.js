/* حجينه — النسخة الحقيقية */
'use strict';
const C = window.HAJINA_CONFIG;
firebase.initializeApp(C.firebase);
const auth = firebase.auth(), db = firebase.firestore();
const FV = firebase.firestore.FieldValue;
auth.languageCode = 'ar';

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ms = t => (t && t.toMillis) ? t.toMillis() : Date.now();
const toAr = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const fmtK = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 1 : 2).replace(/\.?0+$/, '') + 'K' : String(n | 0);
const today = () => new Date().toISOString().slice(0, 10);

const CITIES = ['بغداد','البصرة','الموصل','أربيل','النجف','كربلاء','السليمانية','كركوك','الناصرية','الحلة','الديوانية','العمارة','الكوت','الرمادي','بعقوبة','السماوة','دهوك','تكريت','الفلوجة','سامراء','زاخو','خارج العراق'];
const COLORS = ['#FF8A1F','#E74C3C','#3498DB','#2ECC71','#9B59B6','#F1C40F','#1ABC9C','#E91E63','#795548','#607D8B'];
const CATS = [{k:'all',n:'الكل',e:'🔥'},{k:'chat',n:'سوالف',e:'☕'},{k:'sport',n:'رياضة',e:'⚽'},{k:'music',n:'موسيقى',e:'🎵'},{k:'poetry',n:'شعر',e:'📜'},{k:'games',n:'ألعاب',e:'🎮'},{k:'religion',n:'دينية',e:'🕌'},{k:'love',n:'تعارف',e:'💞'}];
const THEMES = [{k:'',n:'برتقالي',c:'#5a2a0c'},{k:'th-blue',n:'ليلي',c:'#1d3b78'},{k:'th-green',n:'أخضر',c:'#14603e'},{k:'th-purple',n:'بنفسجي',c:'#5b2384'}];
const GIFTS = [
  {k:'rose',n:'وردة',p:10},{k:'heart',n:'قلب',p:15},{k:'cake',n:'كيكة',p:20},{k:'coffee',n:'قهوة',p:35},
  {k:'giftbox',n:'صندوق',p:40},{k:'trophy',n:'كأس',p:50},{k:'balloon',n:'بالون',p:60},{k:'bouquet',n:'باقة ورد',p:80},
  {k:'champagne',n:'شمبانيا',p:90},{k:'ring',n:'خاتم',p:100},{k:'rocket',n:'صاروخ',p:200,fx:1},{k:'car',n:'سيارة',p:250,fx:1},
  {k:'diamond',n:'ألماسة',p:400,fx:1},{k:'goldrose',n:'وردة ذهبية',p:600,fx:1},{k:'plane',n:'طيارة',p:800,fx:1},{k:'roses',art:'bouquet',n:'الورد الملكي',p:999,fx:2},{k:'crown',n:'تاج ملكي',p:1000,fx:1}
];
const GART_URI = {}; Object.keys(GART).forEach(k => { if (k !== 'shadow') GART_URI[k] = gartURI(k); });
const gArt = g => GART_URI[g.art || g.k];
const giftBy = k => GIFTS.find(g => g.k === k) || GIFTS[0];

const lvlOf = xp => Math.floor(Math.sqrt((xp || 0) / 50)) + 1;
const lvlFloor = l => 50 * (l - 1) * (l - 1);

let ME = null, meUnsub = null, booted = false;

/* ---------- UI helpers ---------- */
let toastT;
function toast(m) { let t = document.querySelector('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); } t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2800); }
const NAV_TABS = ['home', 'chats', 'rank', 'me'];
let curScr = 'loading';
function show(id) {
  document.querySelectorAll('.scr').forEach(s => s.hidden = s.id !== id);
  curScr = id;
  $('nav').hidden = !NAV_TABS.includes(id);
  document.querySelectorAll('#nav [data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === id));
  if (id === 'rank') loadRank();
}
document.querySelectorAll('#nav [data-t]').forEach(b => b.onclick = () => show(b.dataset.t));
function avHtml(u, size) { const s = size || 44; return '<div class="av" style="width:' + s + 'px;height:' + s + 'px;font-size:' + Math.round(s * .4) + 'px;background:' + esc(u.color || '#FF8A1F') + '">' + esc((u.name || '؟').trim().charAt(0)) + '</div>'; }
function modal(html, cls) {
  const ov = document.createElement('div'); ov.className = 'ov';
  ov.innerHTML = '<div class="sheet ' + (cls || '') + '"><div class="handle"></div>' + html + '</div>';
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  $('modals').appendChild(ov);
  ov.close = () => ov.remove();
  return ov;
}
function closeTopModal() { const m = $('modals').lastElementChild; if (m) { m.remove(); return true; } return false; }
function errMsg(e) {
  const c = (e && e.code) || '';
  const map = {
    'auth/invalid-phone-number': 'رقم الهاتف غلط', 'auth/too-many-requests': 'محاولات كثيرة، جرب بعد شوية',
    'auth/invalid-verification-code': 'الرمز غلط', 'auth/code-expired': 'الرمز انتهى، اطلب رمز جديد',
    'auth/popup-closed-by-user': 'انسدت نافذة كوكل', 'auth/quota-exceeded': 'خلص عدد الرسائل اليوم، جرب بحساب كوكل',
    'auth/network-request-failed': 'تأكد من الإنترنت', 'permission-denied': 'ما عندك صلاحية',
    'auth/operation-not-allowed': 'طريقة الدخول مو مفعلة', 'auth/captcha-check-failed': 'فشل التحقق، جرب مرة ثانية'
  };
  return map[c] || ('صار خطأ: ' + (c || (e && e.message) || ''));
}
function sfx(f, d, type, vol, delay) {
  try { const a = sfx.ac || (sfx.ac = new (window.AudioContext || window.webkitAudioContext)()); const t = a.currentTime + (delay || 0);
    const o = a.createOscillator(), g = a.createGain(); o.type = type || 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(vol || .08, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d); } catch (e) {}
}
function chime(big) { (big ? [523, 659, 784, 1047, 1319] : [784, 1175]).forEach((f, i) => sfx(f, big ? .35 : .18, 'triangle', .09, i * .09)); }

/* ---------- AUTH ---------- */
$('btnGoogle').onclick = () => {
  if (window.HajinaNative && window.HajinaNative.googleSignIn) { $('btnGoogle').disabled = true; window.HajinaNative.googleSignIn(); setTimeout(() => $('btnGoogle').disabled = false, 8000); return; }
  auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e => toast(errMsg(e)));
};
window.onNativeGoogleToken = tok => { auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(tok)).catch(e => { $('btnGoogle').disabled = false; toast(errMsg(e)); }); };
window.onNativeGoogleError = m => { $('btnGoogle').disabled = false; if (m) toast('ما تم الدخول: ' + m); };

let recaptcha = null, confirmRes = null;
$('btnSendCode').onclick = async () => {
  let n = $('phNum').value.replace(/\D/g, ''); if (n.startsWith('0')) n = n.slice(1);
  if (n.length < 9) return toast('اكتب رقمك صح');
  const full = $('phCC').value.trim().replace(/\s/g, '') + n;
  const b = $('btnSendCode'); b.disabled = true; b.textContent = 'جاري الإرسال...';
  try {
    if (!recaptcha) { $('recap').innerHTML = ''; const box = document.createElement('div'); $('recap').appendChild(box); recaptcha = new firebase.auth.RecaptchaVerifier(box, { size: 'invisible' }); }
    confirmRes = await auth.signInWithPhoneNumber(full, recaptcha);
    $('loginMain').hidden = true; $('loginCode').hidden = false; $('codeSentTo').textContent = 'دزينا رمز على ' + full; $('phCode').focus();
  } catch (e) { toast(errMsg(e)); try { recaptcha.clear(); } catch (_) {} recaptcha = null; $('recap').innerHTML = ''; }
  b.disabled = false; b.textContent = 'إرسال رمز التحقق';
};
$('btnVerify').onclick = async () => {
  const c = $('phCode').value.replace(/\D/g, ''); if (c.length < 6 || !confirmRes) return toast('اكتب الرمز من 6 أرقام');
  $('btnVerify').disabled = true;
  try { await confirmRes.confirm(c); } catch (e) { toast(errMsg(e)); }
  $('btnVerify').disabled = false;
};
$('btnBackPhone').onclick = () => { $('loginMain').hidden = false; $('loginCode').hidden = true; };

auth.onAuthStateChanged(u => {
  if (meUnsub) { meUnsub(); meUnsub = null; }
  if (!u) { ME = null; booted = false; stopAll(); show('login'); return; }
  const ref = db.collection('users').doc(u.uid);
  meUnsub = ref.onSnapshot(s => {
    const d = s.data();
    if (!d || !d.name) { if (curScr !== 'setup') openSetup(u); return; }
    const prevLvl = ME && ME.name ? lvlOf(ME.xp) : null;
    ME = Object.assign({ uid: u.uid }, d);
    renderMe();
    if (prevLvl && lvlOf(ME.xp) > prevLvl) { const nl = lvlOf(ME.xp); setTimeout(() => levelUpFx(nl), 3600); }
    if (!booted) { booted = true; show('home'); startHome(); startChats(); }
  }, e => toast(errMsg(e)));
});

/* ---------- SETUP / EDIT ---------- */
let setupColor = COLORS[0];
function fillCities(sel, val) { sel.innerHTML = CITIES.map(c => '<option' + (c === val ? ' selected' : '') + '>' + c + '</option>').join(''); }
function openSetup(u) {
  show('setup'); fillCities($('setupCity'), 'بغداد');
  $('setupName').value = (u.displayName || '').slice(0, 20);
  const upd = () => { $('setupAv').style.background = setupColor; $('setupAv').textContent = ($('setupName').value.trim() || '؟').charAt(0); };
  $('setupColors').innerHTML = COLORS.map(c => '<i style="background:' + c + '" data-c="' + c + '"></i>').join('');
  $('setupColors').onclick = e => { const c = e.target.dataset.c; if (!c) return; setupColor = c; [...$('setupColors').children].forEach(i => i.classList.toggle('on', i.dataset.c === c)); upd(); };
  $('setupColors').firstElementChild.classList.add('on');
  $('setupName').oninput = upd; upd();
  $('btnSetup').onclick = async () => {
    const name = $('setupName').value.trim(); if (name.length < 2) return toast('اكتب اسمك');
    $('btnSetup').disabled = true;
    try {
      await db.collection('users').doc(u.uid).set({
        name, city: $('setupCity').value, color: setupColor, hid: String(Math.floor(10000000 + Math.random() * 89999999)),
        diamonds: C.welcomeDiamonds, xp: 0, charm: 0, followers: 0, following: 0, lastCheckin: '',
        createdAt: FV.serverTimestamp()
      }, { merge: true });
      toast('🎉 هدية ترحيب ' + C.welcomeDiamonds + ' ماسة');
    } catch (e) { toast(errMsg(e)); }
    $('btnSetup').disabled = false;
  };
}
function openEdit() {
  let col = ME.color;
  const m = modal('<h3>تعديل الملف</h3><label class="l">الاسم</label><input id="edN" maxlength="20" value="' + esc(ME.name) + '"><label class="l">المدينة</label><select id="edC"></select><label class="l">اللون</label><div class="colors" id="edCol">' + COLORS.map(c => '<i style="background:' + c + '" data-c="' + c + '" class="' + (c === col ? 'on' : '') + '"></i>').join('') + '</div><button class="btn btn-p" id="edS">حفظ</button>');
  fillCities(m.querySelector('#edC'), ME.city);
  m.querySelector('#edCol').onclick = e => { if (!e.target.dataset.c) return; col = e.target.dataset.c; [...e.currentTarget.children].forEach(i => i.classList.toggle('on', i.dataset.c === col)); };
  m.querySelector('#edS').onclick = async () => {
    const n = m.querySelector('#edN').value.trim(); if (n.length < 2) return toast('الاسم قصير');
    await db.collection('users').doc(ME.uid).update({ name: n, city: m.querySelector('#edC').value, color: col }).catch(e => toast(errMsg(e)));
    m.close(); toast('انحفظ ✅');
  };
}
function renderMe() {
  const l = lvlOf(ME.xp), lo = lvlFloor(l), hi = lvlFloor(l + 1);
  $('meAv').textContent = ME.name.charAt(0); $('meAv').style.background = ME.color;
  $('meName').textContent = ME.name; $('meId').textContent = 'ID: ' + (ME.hid || '');
  $('meTags').innerHTML = '<span class="tag lv">⭐ مستوى ' + toAr(l) + '</span><span class="tag">📍 ' + esc(ME.city || '') + '</span>';
  $('meFollowers').textContent = fmtK(ME.followers || 0); $('meFollowing').textContent = fmtK(ME.following || 0); $('meCharm').textContent = fmtK(ME.charm || 0);
  $('meLvl').textContent = 'المستوى ' + toAr(l); $('meXpT').textContent = toAr((ME.xp || 0) - lo) + ' / ' + toAr(hi - lo);
  $('meXp').style.width = Math.min(100, ((ME.xp || 0) - lo) / (hi - lo) * 100) + '%';
  $('meDia').textContent = '◆ ' + fmtK(ME.diamonds || 0);
  $('homeDia').lastElementChild.textContent = fmtK(ME.diamonds || 0);
}
async function doCheckin() {
  if (ME.lastCheckin === today()) return toast('أخذت هدية اليوم، تعال باچر 🌙');
  await db.collection('users').doc(ME.uid).update({ diamonds: FV.increment(C.dailyDiamonds), lastCheckin: today() }).catch(e => toast(errMsg(e)));
  chime(); toast('🎁 +' + C.dailyDiamonds + ' ماسة');
}
function openRecharge() {
  modal('<h3>◆ الماسات</h3><div style="text-align:center;font-size:30px;font-weight:900;color:var(--cyan)">◆ ' + fmtK(ME.diamonds || 0) + '</div><p style="text-align:center;color:var(--fg2);font-size:13.5px;line-height:1.8">الماسات تستعملها لإرسال الهدايا بالرومات.<br>تاخذ <b>' + C.dailyDiamonds + '</b> ماسة ببلاش كل يوم من الهدية اليومية.<br>الشحن بزين كاش وآسياسيل والماستر كارد راح ينضاف قريباً.</p><button class="btn btn-p" onclick="doCheckin();closeTopModal()">🎁 خذ هدية اليوم</button>');
}
async function logout() { await leaveRoom(true); auth.signOut(); }

/* ---------- HOME ---------- */
let roomsUnsub = null, roomsData = [], homeCat = 'all', homeTimer = null;
$('homeCats').innerHTML = CATS.map(c => '<button data-k="' + c.k + '" class="' + (c.k === 'all' ? 'on' : '') + '">' + c.e + ' ' + c.n + '</button>').join('');
$('homeCats').onclick = e => { const k = e.target.closest('button') && e.target.closest('button').dataset.k; if (!k) return; homeCat = k; [...$('homeCats').children].forEach(b => b.classList.toggle('on', b.dataset.k === k)); renderRooms(); };
function startHome() {
  roomsUnsub = db.collection('rooms').orderBy('lastActive', 'desc').limit(80).onSnapshot(s => { roomsData = s.docs.map(d => Object.assign({ id: d.id }, d.data())); renderRooms(); }, e => toast(errMsg(e)));
  homeTimer = setInterval(renderRooms, 30000);
}
function renderRooms() {
  const now = Date.now();
  const list = roomsData.filter(r => !r.closed && ms(r.lastActive) > now - 3 * 60000 && (homeCat === 'all' || r.cat === homeCat)).sort((a, b) => (b.online || 0) - (a.online || 0));
  $('roomsEmpty').hidden = list.length > 0;
  $('roomsCount').textContent = list.length ? toAr(list.length) + ' روم' : '';
  $('roomsGrid').innerHTML = list.map(r => {
    const cat = CATS.find(c => c.k === r.cat) || CATS[1], th = THEMES.find(t => t.k === (r.theme || '')) || THEMES[0];
    return '<div class="rc" onclick="enterRoom(\'' + r.id + '\')"><div class="rc-top" style="background:radial-gradient(circle at 50% 30%,' + th.c + ',#140A04)">' + cat.e + '<span class="rc-live">مباشر</span><span class="rc-cnt">👤 ' + toAr(Math.max(1, r.online || 0)) + '</span>' + (r.locked ? '<span class="rc-lock">🔒</span>' : '') + '</div><div class="rc-b"><div class="rc-t">' + esc(r.title) + '</div><div class="rc-h">' + esc(r.ownerName) + ' · ' + esc(r.city || '') + '</div></div></div>';
  }).join('');
}
async function openCreate() {
  if (!ME) return;
  let mine = null;
  try { const q = await db.collection('rooms').where('ownerUid', '==', ME.uid).limit(1).get(); if (!q.empty) mine = Object.assign({ id: q.docs[0].id }, q.docs[0].data()); } catch (e) {}
  let cat = mine ? mine.cat : 'chat', theme = mine ? (mine.theme || '') : '';
  const m = modal('<h3>' + (mine ? 'روم مالتك' : 'افتح روم جديد') + '</h3><label class="l">اسم الروم</label><input id="crT" maxlength="30" placeholder="مثلاً: سهرة بغدادية" value="' + esc(mine ? mine.title : '') + '"><label class="l">النوع</label><div class="opts" id="crCat">' + CATS.slice(1).map(c => '<button data-k="' + c.k + '" class="' + (c.k === cat ? 'on' : '') + '">' + c.e + ' ' + c.n + '</button>').join('') + '</div><label class="l">الخلفية</label><div class="opts" id="crTh">' + THEMES.map(t => '<button data-k="' + t.k + '" class="' + (t.k === theme ? 'on' : '') + '"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:' + t.c + ';vertical-align:middle"></span> ' + t.n + '</button>').join('') + '</div><label class="l">رمز سري (اختياري، للروم الخاص)</label><input id="crP" maxlength="12" placeholder="خليه فارغ للروم العام" value="' + esc(mine ? (mine.password || '') : '') + '"><button class="btn btn-p" id="crGo">' + (mine ? 'افتح الروم' : 'افتح الروم') + ' 🎙️</button>');
  const pick = (id, set) => { m.querySelector(id).onclick = e => { const b = e.target.closest('button'); if (!b) return; set(b.dataset.k); [...e.currentTarget.children].forEach(x => x.classList.toggle('on', x === b)); }; };
  pick('#crCat', k => cat = k); pick('#crTh', k => theme = k);
  m.querySelector('#crGo').onclick = async () => {
    const title = m.querySelector('#crT').value.trim(); if (title.length < 2) return toast('اكتب اسم للروم');
    const pw = m.querySelector('#crP').value.trim();
    const data = { title, cat, theme, password: pw, locked: !!pw, ownerUid: ME.uid, ownerName: ME.name, ownerColor: ME.color, city: ME.city || '', closed: false, lastActive: FV.serverTimestamp(), online: 1 };
    try {
      let id;
      if (mine) { id = mine.id; await db.collection('rooms').doc(id).update(data); }
      else { const ref = db.collection('rooms').doc(); id = ref.id; data.seats = Array(10).fill(null); data.hearts = {}; data.createdAt = FV.serverTimestamp(); await ref.set(data); }
      m.close(); enterRoom(id, true);
    } catch (e) { toast(errMsg(e)); }
  };
}

/* ---------- ROOM ---------- */
let R = {};
const roomRef = () => db.collection('rooms').doc(R.id);
const isOwner = () => R.data && ME && R.data.ownerUid === ME.uid;
const agoraOK = () => window.AgoraRTC && C.agoraAppId && C.agoraAppId !== 'AGORA_APP_ID';

async function enterRoom(id, skipPw) {
  if (R.id === id) { show('room'); return; }
  if (R.id) await leaveRoom(true);
  let snap; try { snap = await db.collection('rooms').doc(id).get(); } catch (e) { return toast(errMsg(e)); }
  if (!snap.exists) return toast('الروم انسد');
  const d = snap.data();
  if (d.password && d.ownerUid !== ME.uid && !skipPw) {
    const m = modal('<h3>🔒 روم خاص</h3><input id="pwI" placeholder="اكتب الرمز السري" style="text-align:center"><button class="btn btn-p" id="pwG">دخول</button>');
    m.querySelector('#pwG').onclick = () => { if (m.querySelector('#pwI').value.trim() === d.password) { m.close(); enterRoom(id, true); } else toast('الرمز غلط'); };
    return;
  }
  R = { id, data: d, unsubs: [], members: {}, mySeat: -1, muted: false, spkOff: false, joinTs: Date.now(), speaking: new Set(), seen: new Set() };
  $('room').className = 'scr ' + (d.theme || ''); show('room'); $('rmChat').innerHTML = ''; renderRoom();
  const me = { uid: ME.uid, name: ME.name, color: ME.color };
  roomRef().collection('members').doc(ME.uid).set(Object.assign({ ts: FV.serverTimestamp() }, me)).catch(() => {});
  roomRef().update({ lastActive: FV.serverTimestamp() }).catch(() => {});
  R.unsubs.push(roomRef().onSnapshot(s => {
    if (!s.exists || (s.data().closed && !isOwner())) { toast('صاحب الروم سدّه'); leaveRoom(); return; }
    R.data = s.data(); $('room').className = 'scr ' + (R.data.theme || ''); renderRoom(); syncMySeat();
  }));
  R.unsubs.push(roomRef().collection('members').onSnapshot(s => { R.members = {}; s.docs.forEach(d => R.members[d.id] = d.data()); renderCount(); }));
  R.unsubs.push(roomRef().collection('messages').orderBy('ts', 'desc').limit(40).onSnapshot(s => {
    const adds = s.docChanges().filter(c => c.type === 'added').map(c => Object.assign({ id: c.doc.id }, c.doc.data())).reverse();
    adds.forEach(onRoomMsg);
  }));
  roomRef().collection('messages').add({ type: 'join', uid: ME.uid, name: ME.name, color: ME.color, ts: FV.serverTimestamp() }).catch(() => {});
  R.hb = setInterval(roomHeartbeat, 25000); setTimeout(roomHeartbeat, 4000);
  await joinVoice(id);
  if (isOwner() && R.data.seats && !R.data.seats[0]) takeSeat(0);
}
function freshMembers() { const now = Date.now(); return Object.values(R.members).filter(m => !m.ts || ms(m.ts) > now - 90000); }
function renderCount() { $('rmCnt').lastElementChild.textContent = toAr(Math.max(1, freshMembers().length)); }
async function roomHeartbeat() {
  if (!R.id) return;
  const ref = roomRef();
  ref.collection('members').doc(ME.uid).update({ ts: FV.serverTimestamp() }).catch(() => {});
  const fresh = freshMembers(), freshIds = new Set(fresh.map(m => m.uid));
  freshIds.add(ME.uid);
  ref.update({ lastActive: FV.serverTimestamp(), online: freshIds.size }).catch(() => {});
  // تنظيف الكراسي من الناس اللي طلعوا
  const seats = (R.data && R.data.seats) || [];
  if (seats.some(s => s && !freshIds.has(s.uid))) {
    db.runTransaction(async tx => { const s = await tx.get(ref); const st = (s.data().seats || []).map(x => x && !freshIds.has(x.uid) ? null : x); tx.update(ref, { seats: st }); }).catch(() => {});
  }
  // حذف الأعضاء القدماء
  const now = Date.now();
  Object.values(R.members).forEach(m => { if (m.ts && ms(m.ts) < now - 10 * 60000) ref.collection('members').doc(m.uid).delete().catch(() => {}); });
}
function renderRoom() {
  const d = R.data; if (!d) return;
  $('rmTitle').textContent = d.title; $('rmSub').textContent = 'ID ' + R.id.slice(0, 6) + ' · ' + (d.ownerName || '');
  $('rmHostAv').outerHTML = '<div class="av" id="rmHostAv" style="width:38px;height:38px;font-size:15px;background:' + esc(d.ownerColor || '#FF8A1F') + '">' + esc((d.ownerName || '؟').charAt(0)) + '</div>';
  const seats = d.seats || Array(10).fill(null), hearts = d.hearts || {};
  $('seats').innerHTML = seats.map((s, i) => {
    if (!s) return '<div class="seat" data-i="' + i + '"><div class="seat-ring">' + (i === 0 ? '👑' : '🎙️') + '</div><div class="seat-n" style="color:var(--fg3)">' + (i === 0 ? 'المضيف' : toAr(i)) + '</div></div>';
    const host = s.uid === d.ownerUid;
    return '<div class="seat full' + (host ? ' host' : '') + (R.speaking.has(s.uid) ? ' speak' : '') + '" data-i="' + i + '" data-uid="' + esc(s.uid) + '">' + (host ? '<span class="seat-crown">👑</span>' : '') + '<div class="seat-ring">' + avHtml(s, 52) + '<span class="seat-mic">' + (s.muted ? '🔇' : '🎙️') + '</span></div><div class="seat-n">' + esc(s.name) + '</div><div class="seat-h">💗 ' + fmtK(hearts[s.uid] || 0) + '</div></div>';
  }).join('');
}
$('seats').onclick = e => { const el = e.target.closest('.seat'); if (!el) return; const i = +el.dataset.i, s = (R.data.seats || [])[i]; if (s) userCard(s.uid); else takeSeat(i); };
function syncMySeat() {
  const i = (R.data.seats || []).findIndex(s => s && s.uid === ME.uid);
  if (i === -1 && R.mySeat !== -1) { R.mySeat = -1; stopPublish(); toast('نزلت من المايك'); }
  else if (i !== -1 && R.mySeat === -1) { R.mySeat = i; startPublish(); }
  else R.mySeat = i;
  $('rbMic').hidden = R.mySeat === -1;
}
async function takeSeat(i) {
  if (i === 0 && !isOwner()) return toast('هذا كرسي صاحب الروم');
  if (!agoraOK()) toast('الصوت بعده مو مفعّل بالإعدادات');
  const ref = roomRef();
  try {
    await db.runTransaction(async tx => {
      const s = await tx.get(ref); const st = (s.data().seats || Array(10).fill(null)).slice();
      if (st[i]) throw new Error('taken');
      for (let k = 0; k < st.length; k++) if (st[k] && st[k].uid === ME.uid) st[k] = null;
      st[i] = { uid: ME.uid, name: ME.name, color: ME.color, muted: false };
      tx.update(ref, { seats: st });
    });
  } catch (e) { toast(e.message === 'taken' ? 'الكرسي مأخوذ' : errMsg(e)); }
}
async function leaveSeat(uid) {
  const ref = roomRef(); uid = uid || ME.uid;
  await db.runTransaction(async tx => { const s = await tx.get(ref); const st = (s.data().seats || []).map(x => x && x.uid === uid ? null : x); tx.update(ref, { seats: st }); }).catch(e => toast(errMsg(e)));
}
async function setMuteFlag(m) {
  const ref = roomRef();
  await db.runTransaction(async tx => { const s = await tx.get(ref); const st = (s.data().seats || []).map(x => x && x.uid === ME.uid ? Object.assign({}, x, { muted: m }) : x); tx.update(ref, { seats: st }); }).catch(() => {});
}


/* ---- Agora AccessToken2 (007) ---- */
function bb() { const a = []; const o = {
  u16(v) { a.push(v & 255, (v >> 8) & 255); return o; },
  u32(v) { a.push(v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255); return o; },
  bytes(b) { o.u16(b.length); for (const x of b) a.push(x); return o; },
  str(s) { return o.bytes(new TextEncoder().encode(s)); },
  raw(b) { for (const x of b) a.push(x); return o; },
  pack() { return new Uint8Array(a); } }; return o; }
async function hmac(key, msg) { const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return new Uint8Array(await crypto.subtle.sign('HMAC', k, msg)); }
async function deflate(u8) { const cs = new CompressionStream('deflate'); const w = cs.writable.getWriter(); w.write(u8); w.close(); return new Uint8Array(await new Response(cs.readable).arrayBuffer()); }
async function agoraToken(appId, cert, channel, account, expire, _ts, _salt) {
  const ts = _ts || Math.floor(Date.now() / 1000), salt = _salt || (1 + Math.floor(Math.random() * 99999998));
  const privs = [[1, expire], [2, expire], [3, expire], [4, expire]];
  const svc = bb().u16(1).u16(privs.length); privs.forEach(([k, v]) => svc.u16(k).u32(v)); svc.str(channel).str(account);
  const info = bb().str(appId).u32(ts).u32(expire).u32(salt).u16(1).raw(svc.pack()).pack();
  let signing = await hmac(bb().u32(ts).pack(), new TextEncoder().encode(cert));
  signing = await hmac(bb().u32(salt).pack(), signing);
  const sig = await hmac(signing, info);
  const content = bb().bytes(sig).raw(info).pack();
  const z = await deflate(content);
  let bin = ''; z.forEach(x => bin += String.fromCharCode(x));
  return '007' + btoa(bin);
}

/* ---- voice (Agora) ---- */
async function joinVoice(channel) {
  if (!agoraOK()) return;
  try {
    AgoraRTC.setLogLevel && AgoraRTC.setLogLevel(3);
    const c = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
    R.client = c;
    await c.setClientRole('audience');
    c.on('user-published', async (user, type) => { if (type !== 'audio') return; await c.subscribe(user, 'audio'); user.audioTrack.play(); user.audioTrack.setVolume(R.spkOff ? 0 : 100); });
    c.enableAudioVolumeIndicator();
    c.on('volume-indicator', vols => {
      const sp = new Set(vols.filter(v => v.level > 6).map(v => String(v.uid)));
      if (R.localTrack && !R.muted && R.localTrack.getVolumeLevel() > 0.06) sp.add(ME.uid);
      R.speaking = sp; document.querySelectorAll('#seats .seat[data-uid]').forEach(el => el.classList.toggle('speak', sp.has(el.dataset.uid)));
    });
    const tok = C.agoraCert ? await agoraToken(C.agoraAppId, C.agoraCert, channel, ME.uid, 24 * 3600) : null;
    await c.join(C.agoraAppId, channel, tok, ME.uid);
    if (R.mySeat !== -1) startPublish();
  } catch (e) { console.error(e); toast('ما كدر يتصل بالصوت'); }
}
async function startPublish() {
  if (!R.client || R.localTrack || R.publishing) return;
  R.publishing = true;
  try {
    if (window.HajinaNative && window.HajinaNative.ensureMic) window.HajinaNative.ensureMic();
    await R.client.setClientRole('host');
    R.localTrack = await AgoraRTC.createMicrophoneAudioTrack({ AEC: true, ANS: true, AGC: true, encoderConfig: 'speech_standard' });
    await R.client.publish(R.localTrack);
    R.muted = false; updMicBtn(); chime();
  } catch (e) { console.error(e); toast('اسمح للتطبيق يستخدم المايك'); leaveSeat(); }
  R.publishing = false;
}
async function stopPublish() {
  try { if (R.localTrack) { await R.client.unpublish(R.localTrack).catch(() => {}); R.localTrack.close(); } R.localTrack = null; if (R.client) await R.client.setClientRole('audience'); } catch (e) {}
}
async function toggleMic() {
  if (R.mySeat === -1) return;
  const m = modal('<h3>🎙️ المايك</h3><button class="btn btn-s" id="mM">' + (R.muted ? '🎙️ شغّل المايك' : '🔇 اكتم المايك') + '</button><button class="btn btn-s" id="mL" style="color:var(--danger)">⬇️ انزل من المايك</button>');
  m.querySelector('#mM').onclick = async () => { m.close(); R.muted = !R.muted; if (R.localTrack) await R.localTrack.setMuted(R.muted); setMuteFlag(R.muted); updMicBtn(); };
  m.querySelector('#mL').onclick = () => { m.close(); leaveSeat(); };
}
function updMicBtn() { const b = $('rbMic'); b.textContent = R.muted ? '🔇' : '🎙️'; b.className = 'rb ' + (R.muted ? 'mic-off' : 'mic-on'); }
function toggleSpeaker() {
  R.spkOff = !R.spkOff; $('rbSpk').textContent = R.spkOff ? '🔈' : '🔊';
  if (R.client) R.client.remoteUsers.forEach(u => u.audioTrack && u.audioTrack.setVolume(R.spkOff ? 0 : 100));
  toast(R.spkOff ? 'كتمت الصوت' : 'رجع الصوت');
}

async function leaveRoom(silent) {
  if (!R.id) { if (!silent) show('home'); return; }
  const r = R; R = {};
  clearInterval(r.hb); r.unsubs.forEach(u => u());
  try { if (r.localTrack) { r.localTrack.close(); } if (r.client) await r.client.leave(); } catch (e) {}
  const ref = db.collection('rooms').doc(r.id);
  if (r.mySeat !== -1) db.runTransaction(async tx => { const s = await tx.get(ref); const st = (s.data().seats || []).map(x => x && x.uid === ME.uid ? null : x); tx.update(ref, { seats: st }); }).catch(() => {});
  ref.collection('members').doc(ME.uid).delete().catch(() => {});
  const left = Object.values(r.members).filter(m => m.uid !== ME.uid && ms(m.ts) > Date.now() - 90000).length;
  ref.update({ online: Math.max(0, left) }).catch(() => {});
  $('rbMic').hidden = true; $('sayRow').hidden = true; $('rmBar').hidden = false;
  if (!silent) show('home');
}
window.addEventListener('pagehide', () => { if (R.id) leaveRoom(true); });

/* ---- room chat ---- */
function openSay() { $('rmBar').hidden = true; $('sayRow').hidden = false; $('sayInput').focus(); }
$('sayRow').onsubmit = e => {
  e.preventDefault(); const t = $('sayInput').value.trim(); $('sayInput').value = '';
  $('sayRow').hidden = true; $('rmBar').hidden = false;
  if (!t || !R.id) return;
  roomRef().collection('messages').add({ type: 'msg', uid: ME.uid, name: ME.name, color: ME.color, text: t.slice(0, 200), ts: FV.serverTimestamp() }).catch(e => toast(errMsg(e)));
};
$('sayInput').onblur = () => setTimeout(() => { if (!$('sayInput').value) { $('sayRow').hidden = true; $('rmBar').hidden = false; } }, 150);
function onRoomMsg(m) {
  if (R.seen.has(m.id)) return; R.seen.add(m.id);
  const box = $('rmChat'), el = document.createElement('div');
  const nm = '<b onclick="userCard(\'' + esc(m.uid) + '\')">' + esc(m.name) + '</b>';
  if (m.type === 'join') { el.className = 'cm sys'; el.innerHTML = '👋 ' + esc(m.name) + ' دخل الروم'; }
  else if (m.type === 'gift') {
    const g = giftBy(m.gift), to = (m.to || []).map(t => t.name).join('، ');
    el.className = 'cm gift'; el.innerHTML = '<div class="gc-line">' + nm + ' <span class="v">ارسال</span> ' + esc(to) + '</div><div class="gc-box"><img src="' + gArt(g) + '" alt=""><span>' + (m.qty || 1) + 'x</span></div>';
    const fresh = !m.ts || ms(m.ts) > R.joinTs - 3000;
    if (fresh) playGift(g, m);
  } else if (m.type === 'sys') { el.className = 'cm sys'; el.textContent = m.text; }
  else { el.className = 'cm'; el.innerHTML = nm + ': ' + esc(m.text); }
  box.appendChild(el);
  while (box.children.length > 80) box.firstChild.remove();
  box.scrollTop = box.scrollHeight;
}

/* ---- gifts ---- */
function openGifts(preUid) {
  const seated = (R.data.seats || []).filter(s => s && s.uid !== ME.uid);
  if (!seated.length) return toast('ماكو أحد عالمايك حتى تهديه');
  const sel = new Set([preUid && seated.some(s => s.uid === preUid) ? preUid : (seated.find(s => s.uid === R.data.ownerUid) || seated[0]).uid]);
  let gi = 0;
  const m = modal('<div class="gs-to"><span>إلى</span><div class="gs-avs" id="gAv"></div><button class="gs-all" id="gAll"><i>✓</i>الكل</button></div><div class="gifts" id="gGrid">' + GIFTS.map((g, i) => '<div class="gi' + (i === 0 ? ' on' : '') + '" data-i="' + i + '">' + (g.fx ? '<span class="fx">🎬</span>' : '') + '<img src="' + gArt(g) + '" alt=""><span class="n">' + g.n + '</span><span class="p">◆ ' + g.p + '</span></div>').join('') + '</div><div class="gs-bar"><div class="gs-bal"><span class="d">◆ ' + fmtK(ME.diamonds || 0) + '</span></div><div class="gs-send"><select id="gQ"><option>1</option><option>5</option><option>10</option><option>66</option><option>99</option></select><button id="gS">إرسال</button></div></div>');
  const drawAv = () => { m.querySelector('#gAv').innerHTML = seated.map(s => '<div class="av' + (sel.has(s.uid) ? ' on' : '') + '" data-u="' + esc(s.uid) + '" style="background:' + esc(s.color) + '">' + esc(s.name.charAt(0)) + '</div>').join(''); m.querySelector('#gAll').classList.toggle('on', sel.size === seated.length); };
  drawAv();
  m.querySelector('#gAv').onclick = e => { const u = e.target.dataset.u; if (!u) return; if (sel.has(u)) { if (sel.size > 1) sel.delete(u); } else sel.add(u); drawAv(); };
  m.querySelector('#gAll').onclick = () => { if (sel.size === seated.length) { const f = [...sel][0]; sel.clear(); sel.add(f); } else seated.forEach(s => sel.add(s.uid)); drawAv(); };
  m.querySelector('#gGrid').onclick = e => { const el = e.target.closest('.gi'); if (!el) return; gi = +el.dataset.i; m.querySelectorAll('.gi').forEach(x => x.classList.toggle('on', x === el)); };
  m.querySelector('#gS').onclick = async () => {
    const g = GIFTS[gi], qty = +m.querySelector('#gQ').value, targets = seated.filter(s => sel.has(s.uid));
    m.close(); sendGift(g, qty, targets);
  };
}
async function sendGift(g, qty, targets) {
  const each = g.p * qty, total = each * targets.length, myRef = db.collection('users').doc(ME.uid), ref = roomRef();
  try {
    await db.runTransaction(async tx => {
      const s = await tx.get(myRef); const d = (s.data() || {}).diamonds || 0;
      if (d < total) throw new Error('nodia');
      tx.update(myRef, { diamonds: d - total, xp: FV.increment(total) });
      const hu = { lastActive: FV.serverTimestamp() };
      targets.forEach(t => { tx.update(db.collection('users').doc(t.uid), { charm: FV.increment(each) }); hu['hearts.' + t.uid] = FV.increment(each); });
      tx.update(ref, hu);
    });
    await ref.collection('messages').add({ type: 'gift', uid: ME.uid, name: ME.name, color: ME.color, gift: g.k, qty, val: each, to: targets.map(t => ({ uid: t.uid, name: t.name })), ts: FV.serverTimestamp() });
  } catch (e) {
    if (e.message === 'nodia') { toast('ماساتك ما تكفي (' + total + ' ◆)'); openRecharge(); } else toast(errMsg(e));
  }
}
function playGift(g, m) {
  (m.to || []).forEach((t, i) => setTimeout(() => flyGift(g, t.uid, m.qty || 1, m.val || g.p), i * 120));
  const lbl = '<b>' + esc(m.name) + '</b> أرسل <b>' + g.n + '</b> لـ <b>' + esc((m.to || []).length > 1 ? 'الجميع' : ((m.to || [])[0] || {}).name) + '</b>';
  if (g.fx === 2) rosesFx(lbl); else if (g.fx) bigFx(g, lbl); else chime();
}
function flyGift(g, uid, qty, val) {
  const seat = document.querySelector('#seats .seat[data-uid="' + uid + '"]'); if (!seat) return;
  const b = seat.querySelector('.seat-ring').getBoundingClientRect(), x0 = innerWidth / 2 - 28, y0 = innerHeight - 140, x1 = b.left + b.width / 2 - 28, y1 = b.top + b.height / 2 - 28;
  const el = document.createElement('div'); el.className = 'fly'; el.innerHTML = '<img src="' + gArt(g) + '" alt="">' + (qty > 1 ? '<span>x' + qty + '</span>' : ''); document.body.appendChild(el);
  const done = () => { el.remove(); seat.classList.remove('got'); void seat.offsetWidth; seat.classList.add('got'); const p = document.createElement('div'); p.className = 'seat-plus'; p.textContent = '+' + val; seat.appendChild(p); setTimeout(() => p.remove(), 1200); };
  if (!el.animate) return done();
  el.animate([{ transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(.4)', opacity: 0 }, { transform: 'translate(' + x0 + 'px,' + (y0 - 50) + 'px) scale(1.3)', opacity: 1, offset: .25 }, { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.8)', opacity: 1 }], { duration: 1000, easing: 'cubic-bezier(.45,0,.3,1)' }).onfinish = done;
}
function bigFx(g, lbl) {
  chime(true);
  const w = document.createElement('div'); w.className = 'gfx';
  let h = ''; const cols = ['#FFD24A', '#FF8A1F', '#fff', '#2FE6D9', '#FF5A6E'];
  for (let i = 0; i < 40; i++) h += '<i class="conf" style="left:' + (Math.random() * 100).toFixed(1) + '%;background:' + cols[i % 5] + ';animation-duration:' + (1.6 + Math.random() * 1.4).toFixed(2) + 's;animation-delay:' + (Math.random() * .6).toFixed(2) + 's"></i>';
  w.innerHTML = h + '<img src="' + gArt(g) + '" alt=""><div class="lbl">' + lbl + '</div>';
  document.body.appendChild(w); setTimeout(() => w.remove(), 3400);
}
function rosesFx(lbl) {
  chime(true);
  const w = document.createElement('div'); w.className = 'gfx'; w.style.animationDuration = '4.5s';
  let h = '<div class="rf-frame"></div>'; const spots = [];
  for (let i = 0; i < 7; i++) spots.push([i / 6 * 100, 2], [i / 6 * 100, 98]);
  for (let i = 1; i < 10; i++) spots.push([3, i / 10 * 100], [97, i / 10 * 100]);
  spots.forEach(([x, y], k) => { h += '<span class="rf-rose" style="left:' + x + '%;top:' + y + '%;font-size:' + (30 + Math.random() * 18 | 0) + 'px;animation-delay:' + (k * .025).toFixed(3) + 's">' + (Math.random() < .2 ? '🌺' : '🌹') + '</span>'; });
  w.innerHTML = h + '<img src="' + GART_URI.bouquet + '" alt=""><div class="lbl">' + lbl + ' 🌹</div>';
  document.body.appendChild(w); setTimeout(() => w.remove(), 4500);
}
function levelUpFx(l) {
  const w = document.createElement('div'); w.className = 'lvup'; w.innerHTML = '<div class="hx">' + l + '</div><div class="t">ارتقيت للمستوى ' + toAr(l) + ' 🎉</div>';
  document.body.appendChild(w); setTimeout(() => w.remove(), 2800); chime(true);
}

/* ---- room menu / members ---- */
function openMembers() {
  const list = freshMembers();
  const m = modal('<h3>الموجودين (' + toAr(list.length) + ')</h3>' + list.map(u => '<div class="ci" data-u="' + esc(u.uid) + '">' + avHtml(u, 42) + '<div class="ci-m"><div class="ci-n">' + esc(u.name) + (u.uid === R.data.ownerUid ? ' 👑' : '') + '</div></div></div>').join(''));
  m.onclick = e => { const el = e.target.closest('[data-u]'); if (el) { m.close(); userCard(el.dataset.u); } };
}
function openRoomMenu() {
  if (isOwner()) {
    const m = modal('<h3>إدارة الروم</h3><button class="btn btn-s" id="rmE">✏️ تعديل الروم</button><button class="btn btn-s" id="rmC" style="color:var(--danger)">⛔ سد الروم</button>');
    m.querySelector('#rmE').onclick = () => { m.close(); openCreate(); };
    m.querySelector('#rmC').onclick = async () => { m.close(); await roomRef().update({ closed: true, seats: Array(10).fill(null), online: 0 }).catch(() => {}); leaveRoom(); };
  } else {
    const m = modal('<h3>' + esc(R.data.title) + '</h3><button class="btn btn-s" id="rmR">🚩 إبلاغ عن الروم</button>');
    m.querySelector('#rmR').onclick = () => { db.collection('reports').add({ room: R.id, by: ME.uid, ts: FV.serverTimestamp() }); m.close(); toast('وصل البلاغ للإدارة، شكراً'); };
  }
}

/* ---------- USER CARD / FOLLOW ---------- */
async function userCard(uid) {
  let u; try { const s = await db.collection('users').doc(uid).get(); u = Object.assign({ uid }, s.data() || { name: '؟' }); } catch (e) { return toast(errMsg(e)); }
  const self = uid === ME.uid;
  let following = false;
  if (!self) { try { following = (await db.collection('users').doc(ME.uid).collection('following').doc(uid).get()).exists; } catch (e) {} }
  const seated = R.id && (R.data.seats || []).some(s => s && s.uid === uid);
  const m = modal('<div class="uc">' + avHtml(u, 84) + '<div class="pf-name">' + esc(u.name) + '</div><div class="pf-id">ID: ' + esc(u.hid || '') + '</div><div class="tags"><span class="tag lv">⭐ ' + toAr(lvlOf(u.xp)) + '</span><span class="tag">📍 ' + esc(u.city || '') + '</span><span class="tag">💗 ' + fmtK(u.charm || 0) + '</span><span class="tag">👥 ' + fmtK(u.followers || 0) + '</span></div></div>' +
    (self ? (R.mySeat !== -1 && seated ? '<button class="btn btn-s" id="ucDown">⬇️ انزل من المايك</button>' : '') :
      '<div class="row2"><button class="btn ' + (following ? 'btn-s' : 'btn-p') + '" id="ucF">' + (following ? '✓ تتابعه' : '+ متابعة') + '</button><button class="btn btn-s" id="ucM">💬 رسالة</button></div>' +
      (seated ? '<button class="btn btn-s" id="ucG">🎁 أهديه</button>' : '') +
      (seated && isOwner() ? '<button class="btn btn-s" id="ucK" style="color:var(--danger)">⬇️ نزّله من المايك</button>' : '')));
  const on = (id, f) => { const b = m.querySelector(id); if (b) b.onclick = f; };
  on('#ucDown', () => { m.close(); leaveSeat(); });
  on('#ucF', async () => { m.close(); await toggleFollow(u, following); });
  on('#ucM', () => { m.close(); openDM(u); });
  on('#ucG', () => { m.close(); openGifts(uid); });
  on('#ucK', () => { m.close(); leaveSeat(uid); });
}
async function toggleFollow(u, was) {
  const a = db.collection('users').doc(ME.uid), b = db.collection('users').doc(u.uid), f = a.collection('following').doc(u.uid);
  const batch = db.batch();
  if (was) { batch.delete(f); batch.update(a, { following: FV.increment(-1) }); batch.update(b, { followers: FV.increment(-1) }); }
  else { batch.set(f, { name: u.name, color: u.color, ts: FV.serverTimestamp() }); batch.update(a, { following: FV.increment(1) }); batch.update(b, { followers: FV.increment(1) }); }
  await batch.commit().then(() => toast(was ? 'ألغيت المتابعة' : 'صرت تتابع ' + u.name)).catch(e => toast(errMsg(e)));
}

/* ---------- DMs ---------- */
let chatsUnsub = null, dmUnsub = null, DM = null;
const chatId = (a, b) => [a, b].sort().join('_');
function startChats() {
  chatsUnsub = db.collection('chats').where('members', 'array-contains', ME.uid).onSnapshot(s => {
    const list = s.docs.map(d => Object.assign({ id: d.id }, d.data())).sort((a, b) => ms(b.lastTs) - ms(a.lastTs));
    let unread = 0;
    $('chatsList').innerHTML = list.length ? list.map(c => {
      const other = c.members.find(x => x !== ME.uid) || ME.uid, info = (c.info || {})[other] || { name: '؟' }, un = (c.unread || {})[ME.uid] || 0; unread += un;
      const t = new Date(ms(c.lastTs));
      return '<div class="ci" data-u="' + esc(other) + '">' + avHtml(info, 50) + '<div class="ci-m"><div class="ci-n">' + esc(info.name) + '</div><div class="ci-l">' + esc(c.last || '') + '</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px"><span class="ci-t">' + t.getHours() + ':' + String(t.getMinutes()).padStart(2, '0') + '</span>' + (un ? '<span class="badge" style="position:static">' + un + '</span>' : '') + '</div></div>';
    }).join('') : '<div class="empty"><div class="e">💬</div><b>ماكو رسائل بعد</b><span>ادخل روم، اضغط على أي شخص، ودزله رسالة</span></div>';
    $('dmBadge').hidden = !unread; $('dmBadge').textContent = unread;
  }, e => console.warn(e));
}
$('chatsList').onclick = async e => { const el = e.target.closest('[data-u]'); if (!el) return; const s = await db.collection('users').doc(el.dataset.u).get(); openDM(Object.assign({ uid: el.dataset.u }, s.data())); };
function openDM(u) {
  DM = { u, id: chatId(ME.uid, u.uid), from: curScr };
  $('dmName').textContent = u.name; $('dmAv').outerHTML = avHtml(u, 38).replace('class="av"', 'class="av" id="dmAv"');
  $('dmMsgs').innerHTML = ''; show('dm');
  const cref = db.collection('chats').doc(DM.id);
  cref.update({ ['unread.' + ME.uid]: 0 }).catch(() => {});
  dmUnsub = cref.collection('messages').orderBy('ts', 'desc').limit(100).onSnapshot(s => {
    $('dmMsgs').innerHTML = s.docs.slice().reverse().map(d => { const m = d.data(); return '<div class="bub ' + (m.uid === ME.uid ? 'me' : 'them') + '">' + esc(m.text) + '</div>'; }).join('');
    $('dmMsgs').scrollTop = 1e9;
    if (s.docChanges().some(c => c.type === 'added' && c.doc.data().uid !== ME.uid)) cref.update({ ['unread.' + ME.uid]: 0 }).catch(() => {});
  });
}
function closeDM() { if (dmUnsub) dmUnsub(); dmUnsub = null; const back = DM && DM.from; DM = null; show(back === 'room' && R.id ? 'room' : 'chats'); }
$('dmForm').onsubmit = e => {
  e.preventDefault(); const t = $('dmInput').value.trim(); if (!t || !DM) return; $('dmInput').value = '';
  const cref = db.collection('chats').doc(DM.id), o = DM.u;
  const batch = db.batch();
  batch.set(cref.collection('messages').doc(), { uid: ME.uid, text: t.slice(0, 500), ts: FV.serverTimestamp() });
  batch.set(cref, { members: [ME.uid, o.uid], info: { [ME.uid]: { name: ME.name, color: ME.color }, [o.uid]: { name: o.name, color: o.color } }, last: t.slice(0, 80), lastTs: FV.serverTimestamp(), unread: { [o.uid]: FV.increment(1) } }, { merge: true });
  batch.commit().catch(e => toast(errMsg(e)));
};

/* ---------- RANK ---------- */
let rankBy = 'xp';
document.querySelectorAll('#rank [data-r]').forEach(b => b.onclick = () => { rankBy = b.dataset.r; document.querySelectorAll('#rank [data-r]').forEach(x => x.classList.toggle('on', x === b)); loadRank(); });
async function loadRank() {
  $('rankList').innerHTML = '<div class="empty">...</div>';
  try {
    const s = await db.collection('users').orderBy(rankBy, 'desc').limit(30).get();
    const list = s.docs.map(d => Object.assign({ uid: d.id }, d.data())).filter(u => (u[rankBy] || 0) > 0);
    $('rankList').innerHTML = list.length ? list.map((u, i) => '<div class="ci" data-u="' + esc(u.uid) + '"><b style="width:26px;text-align:center;font-size:' + (i < 3 ? 22 : 15) + 'px">' + (['🥇', '🥈', '🥉'][i] || toAr(i + 1)) + '</b>' + avHtml(u, 46) + '<div class="ci-m"><div class="ci-n">' + esc(u.name) + '</div><div class="ci-l">⭐ ' + toAr(lvlOf(u.xp)) + ' · ' + esc(u.city || '') + '</div></div><b style="color:var(--or2)">' + (rankBy === 'xp' ? '◆ ' : '💗 ') + fmtK(u[rankBy]) + '</b></div>').join('') : '<div class="empty"><div class="e">🏆</div><b>الترتيب بعده فارغ</b><span>أول واحد يدز هدية يصير بالقمة</span></div>';
  } catch (e) { $('rankList').innerHTML = '<div class="empty">' + esc(errMsg(e)) + '</div>'; }
}
$('rankList').onclick = e => { const el = e.target.closest('[data-u]'); if (el) userCard(el.dataset.u); };

/* ---------- misc ---------- */
function stopAll() { [roomsUnsub, chatsUnsub, dmUnsub].forEach(u => u && u()); roomsUnsub = chatsUnsub = dmUnsub = null; clearInterval(homeTimer); }
// زر الرجوع بالأندرويد
window.hajinaBack = function () {
  if (closeTopModal()) return 'x';
  if (!$('sayRow').hidden) { $('sayRow').hidden = true; $('rmBar').hidden = false; return 'x'; }
  if (curScr === 'dm') { closeDM(); return 'x'; }
  if (curScr === 'room') { leaveRoom(); return 'x'; }
  if (curScr === 'chats' || curScr === 'rank' || curScr === 'me') { show('home'); return 'x'; }
  return 'exit';
};
