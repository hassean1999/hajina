/* حجينه — النسخة الحقيقية */
'use strict';
const C = window.HAJINA_CONFIG;
firebase.initializeApp(C.firebase);
const auth = firebase.auth(), db = firebase.firestore();
const FV = firebase.firestore.FieldValue;
auth.languageCode = 'ar';

const $ = id => document.getElementById(id);
const SC = '<img class="sc" src="silver.svg" alt="">';
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
  {k:'tea',n:'استكان چاي',p:5,c:'food'},
  {k:'rose',n:'وردة',p:10,c:'love'},
  {k:'banana',n:'موز',p:12,c:'food'},
  {k:'watermelon',n:'ركي',p:12,c:'food'},
  {k:'strawberry',n:'فراولة',p:14,c:'food'},
  {k:'heart',n:'قلب',p:15,c:'love'},
  {k:'grapes',n:'عنب',p:16,c:'food'},
  {k:'candy',n:'حلاوة',p:18,c:'food'},
  {k:'cherries',n:'كرز',p:18,c:'food'},
  {k:'cake',n:'كيكة',p:20,c:'food'},
  {k:'mango',n:'عنبة',p:22,c:'food'},
  {k:'star',n:'نجمة',p:25,c:'lux'},
  {k:'cookie',n:'كوكيز',p:26,c:'food'},
  {k:'pineapple',n:'أناناس',p:28,c:'food'},
  {k:'lollipop',n:'مصاصة',p:30,c:'food'},
  {k:'popcorn',n:'شامية',p:32,c:'food'},
  {k:'coffee',n:'قهوة',p:35,c:'food'},
  {k:'honey',n:'عسل',p:38,c:'food'},
  {k:'falafel',n:'فلافل',p:40,c:'food'},
  {k:'giftbox',n:'صندوق هدية',p:40,c:'lux'},
  {k:'bubbletea',n:'ببل تي',p:42,c:'food'},
  {k:'icecream',n:'موطا',p:45,c:'food'},
  {k:'sandwich',n:'لفة',p:46,c:'food'},
  {k:'donut',n:'دونات',p:48,c:'food'},
  {k:'trophy',n:'كأس',p:50,c:'lux'},
  {k:'tropical',n:'عصير',p:52,c:'food'},
  {k:'pan',n:'بيض بالطاوة',p:54,c:'food'},
  {k:'lips',n:'بوسة',p:55,c:'love'},
  {k:'fries',n:'بطاطا',p:58,c:'food'},
  {k:'balloon',n:'بالون',p:60,c:'lux'},
  {k:'pizza',n:'بيتزا',p:62,c:'food'},
  {k:'cupcake',n:'كب كيك',p:65,c:'food'},
  {k:'burger',n:'برگر',p:68,c:'food'},
  {k:'bicycle',n:'بايسكل',p:70,c:'car'},
  {k:'moon',n:'هلال',p:70,c:'lux'},
  {k:'chocolate',n:'جكليت',p:75,c:'food'},
  {k:'bouquet',n:'باقة ورد',p:80,c:'love'},
  {k:'tulip',n:'توليب',p:85,c:'love'},
  {k:'scooter',n:'سكوتر',p:85,c:'car'},
  {k:'champagne',n:'شمبانيا',p:90,c:'food'},
  {k:'rabbit',n:'أرنب',p:90,c:'animal'},
  {k:'hibiscus',n:'وردة جورية',p:95,c:'love'},
  {k:'pot',n:'طبخة',p:95,c:'food'},
  {k:'ring',n:'خاتم',p:100,c:'love'},
  {k:'loveletter',n:'رسالة حب',p:110,c:'love'},
  {k:'teddy',n:'دبدوب',p:120,c:'love'},
  {k:'butterfly',n:'فراشة',p:130,c:'love'},
  {k:'cat',n:'بزونة',p:140,c:'animal'},
  {k:'lipstick',n:'روج',p:150,c:'love'},
  {k:'dog',n:'جرو',p:150,c:'animal'},
  {k:'bdcake',n:'كيكة عيد ميلاد',p:160,c:'food'},
  {k:'owl',n:'بومة',p:170,c:'animal'},
  {k:'mic',n:'مايك',p:180,c:'lux'},
  {k:'parrot',n:'ببغاء',p:190,c:'animal'},
  {k:'partypopper',n:'احتفال',p:190,c:'lux'},
  {k:'rocket',n:'صاروخ',p:200,c:'car',fx:1},
  {k:'penguin',n:'بطريق',p:210,c:'animal'},
  {k:'dallah',n:'إبريق چاي',p:220,c:'food'},
  {k:'fox',n:'ثعلب',p:230,c:'animal'},
  {k:'monkey',n:'قرد',p:240,c:'animal'},
  {k:'car',n:'سيارة سباق',p:250,c:'car',fx:1},
  {k:'taxi',n:'تكسي',p:260,c:'car'},
  {k:'oud',n:'كيتار',p:260,c:'lux'},
  {k:'panda',n:'باندا',p:280,c:'animal'},
  {k:'koala',n:'كوالا',p:300,c:'animal'},
  {k:'tractor',n:'تراكتور',p:300,c:'car'},
  {k:'watch',n:'ساعة',p:300,c:'lux'},
  {k:'motorcycle',n:'ماطور',p:320,c:'car'},
  {k:'auto',n:'سيارة',p:350,c:'car'},
  {k:'moneybag',n:'كيس فلوس',p:350,c:'lux'},
  {k:'ambulance',n:'إسعاف',p:380,c:'car'},
  {k:'dolphin',n:'دولفين',p:400,c:'animal',fx:1},
  {k:'diamond',n:'ألماسة',p:400,c:'lux',fx:1},
  {k:'flamingo',n:'فلامنكو',p:420,c:'animal'},
  {k:'police',n:'شرطة',p:450,c:'car'},
  {k:'palm',n:'نخلة',p:450,c:'lux'},
  {k:'swan',n:'بجعة',p:480,c:'animal'},
  {k:'bus',n:'باص',p:480,c:'car'},
  {k:'lantern',n:'فانوس',p:500,c:'lux',fx:1},
  {k:'firetruck',n:'إطفاء',p:520,c:'car'},
  {k:'goldrose',n:'عباد الشمس',p:600,c:'love',fx:1},
  {k:'suv',n:'جكسارة',p:600,c:'car',fx:1},
  {k:'peacock',n:'طاووس',p:650,c:'animal',fx:1},
  {k:'train',n:'قطار',p:700,c:'car',fx:1},
  {k:'fireworks',n:'ألعاب نارية',p:700,c:'lux',fx:1},
  {k:'plane',n:'طيارة',p:800,c:'car',fx:1},
  {k:'horse',n:'حصان',p:900,c:'animal',fx:1},
  {k:'roses',n:'الورد الملكي',p:999,c:'love',fx:2,art:'bouquet'},
  {k:'crown',n:'تاج ملكي',p:1000,c:'lux',fx:1},
  {k:'camel',n:'جمل',p:1100,c:'animal',fx:1},
  {k:'unicorn',n:'يونيكورن',p:1200,c:'animal',fx:1},
  {k:'hst',n:'قطار سريع',p:1300,c:'car',fx:1},
  {k:'jet',n:'طيارة خاصة',p:1400,c:'car',fx:1},
  {k:'goldbar',n:'عملة ذهب',p:1500,c:'lux',fx:1},
  {k:'giraffe',n:'زرافة',p:1600,c:'animal',fx:1},
  {k:'sailboat',n:'مركب شراعي',p:1700,c:'car',fx:1},
  {k:'tiger',n:'نمر',p:1800,c:'animal',fx:1},
  {k:'lion',n:'أسد',p:2000,c:'animal',fx:1},
  {k:'elephant',n:'فيل',p:2200,c:'animal',fx:1},
  {k:'eagle',n:'نسر',p:2500,c:'animal',fx:1},
  {k:'shark',n:'قرش',p:2600,c:'animal',fx:1},
  {k:'whale',n:'حوت',p:2800,c:'animal',fx:1},
  {k:'yacht',n:'يخت',p:3000,c:'car',fx:1},
  {k:'helicopter',n:'هليكوبتر',p:3500,c:'car',fx:1},
  {k:'ship',n:'سفينة',p:4000,c:'car',fx:1},
  {k:'castle',n:'قصر',p:5000,c:'lux',fx:1},
  {k:'ufo',n:'صحن طائر',p:6000,c:'car',fx:1},
  {k:'dragon',n:'تنين',p:8000,c:'animal',fx:1}
];
const GCATS = [{k:'love',n:'❤️ حب'},{k:'food',n:'🍰 أكل'},{k:'animal',n:'🦁 حيوانات'},{k:'car',n:'🚗 مركبات'},{k:'lux',n:'👑 مميزة'},{k:'s',n:SC + ' فضية'}];
const GART_URI = {}; Object.keys(GART).forEach(k => { if (k !== 'shadow') GART_URI[k] = gartURI(k); });
const gArt = g => 'gifts/' + (g.art || g.k) + '.webp?v=1';
const SGIFTS = [
  {k:'s_tea',art:'tea',n:'چاي',p:5,s:1},{k:'s_rose',art:'rose',n:'وردة',p:10,s:1},{k:'s_star',art:'star',n:'نجمة',p:15,s:1},{k:'s_heart',art:'heart',n:'قلب',p:20,s:1},
  {k:'s_candy',art:'candy',n:'حلاوة',p:22,s:1},{k:'s_lollipop',art:'lollipop',n:'مصاصة',p:25,s:1},{k:'s_coffee',art:'coffee',n:'قهوة',p:30,s:1},{k:'s_donut',art:'donut',n:'دونات',p:35,s:1},
  {k:'s_lips',art:'lips',n:'بوسة',p:40,s:1},{k:'s_balloon',art:'balloon',n:'بالون',p:50,s:1},{k:'s_icecream',art:'icecream',n:'موطا',p:60,s:1},{k:'s_sparkheart',art:'sparkheart',n:'قلب لامع',p:70,s:1},
  {k:'s_cake',art:'cake',n:'كيكة',p:80,s:1},{k:'s_giftbox',art:'giftbox',n:'صندوق',p:100,s:1}
];
const giftBy = k => GIFTS.find(g => g.k === k) || SGIFTS.find(g => g.k === k) || GIFTS[0];

const lvlOf = xp => Math.floor(Math.sqrt((xp || 0) / 50)) + 1;
const lvlFloor = l => 50 * (l - 1) * (l - 1);

let ME = null, meUnsub = null, booted = false;

/* ---------- UI helpers ---------- */
let toastT;
function toast(m) { let t = document.querySelector('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); } t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2800); }
const NAV_TABS = ['home', 'moments', 'chats', 'rank', 'me'];
let curScr = 'loading';
function show(id) {
  document.querySelectorAll('.scr').forEach(s => s.hidden = s.id !== id);
  curScr = id;
  $('nav').hidden = !NAV_TABS.includes(id);
  document.querySelectorAll('#nav [data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === id));
  if (id === 'rank') loadRank();
  if (id === 'moments' && window.startMoments) startMoments();
}
document.querySelectorAll('#nav [data-t]').forEach(b => b.onclick = () => show(b.dataset.t));
const VIPT = C.vipLevels || [1000, 5000, 20000];
const vipOf = r => r >= VIPT[2] ? 3 : r >= VIPT[1] ? 2 : r >= VIPT[0] ? 1 : 0;
const AVC = {};
function meLite() { return { uid: ME.uid, name: ME.name, color: ME.color, vip: vipOf(ME.recharged || 0), pv: ME.pv || 0 }; }
function nameHtml(u, noBadge) { const v = u.vip || 0; return '<span class="' + (v ? 'vipn v' + v : '') + '">' + esc(u.name) + '</span>' + (v && !noBadge ? ' <span class="vipb v' + v + '">VIP' + v + '</span>' : ''); }
function avInner(u) { const k = u.uid + ':' + (u.pv || 0); if (u.uid && u.pv && AVC[k] === undefined) loadAv(u.uid, u.pv); return u.uid && AVC[k] ? '<img src="' + AVC[k] + '" alt="">' : esc((u.name || '؟').trim().charAt(0)); }
function avHtml(u, size) { const s = size || 44, v = u.vip || 0; const st = 'width:' + s + 'px;height:' + s + 'px;font-size:' + Math.round(s * .4) + 'px;'; const inner = avInner(u);
  if (v >= 2) return '<div class="av vframe" style="' + st + '"><i data-av="' + esc(u.uid || '') + '" style="background:' + esc(u.color || '#FF8A1F') + '">' + inner + '</i></div>';
  return '<div class="av" data-av="' + esc(u.uid || '') + '" style="' + st + 'background:' + esc(u.color || '#FF8A1F') + '">' + inner + '</div>'; }
async function loadAv(uid, pv) { const k = uid + ':' + pv; AVC[k] = ''; try { const d = await db.collection('avatars').doc(uid).get(); if (d.exists && d.data().img) { AVC[k] = d.data().img; document.querySelectorAll('[data-av="' + uid + '"]').forEach(el => el.innerHTML = '<img src="' + AVC[k] + '" alt="">'); } } catch (e) {} }
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
    'auth/operation-not-allowed': 'طريقة الدخول مو مفعلة', 'auth/email-already-in-use': 'هذا الرقم مسجّل، اضغط دخول', 'auth/invalid-credential': 'الرقم أو الرمز السري غلط', 'auth/wrong-password': 'الرمز السري غلط', 'auth/user-not-found': 'هذا الرقم مو مسجّل، اضغط حساب جديد', 'auth/weak-password': 'الرمز السري ضعيف، خليه 6 أو أكثر', 'auth/invalid-email': 'رقم الهاتف غلط', 'auth/captcha-check-failed': 'فشل التحقق، جرب مرة ثانية'
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

// الدخول برقم الهاتف + رمز سري (بدون SMS)
function phoneEmail() {
  let n = $('phNum').value.replace(/\D/g, ''); if (n.startsWith('0')) n = n.slice(1);
  const cc = $('phCC').value.replace(/\D/g, '') || '964';
  if (n.length < 9) { toast('اكتب رقمك صح'); return null; }
  if ($('phPass').value.length < 6) { toast('الرمز السري لازم 6 أحرف أو أكثر'); return null; }
  return 'p' + cc + n + '@hajina.app';
}
async function phoneAuth(isNew) {
  const em = phoneEmail(); if (!em) return;
  const btns = [$('btnLogin'), $('btnRegister')]; btns.forEach(b => b.disabled = true);
  try {
    if (isNew) await auth.createUserWithEmailAndPassword(em, $('phPass').value);
    else await auth.signInWithEmailAndPassword(em, $('phPass').value);
  } catch (e) { toast(errMsg(e)); }
  btns.forEach(b => b.disabled = false);
}
$('btnLogin').onclick = () => phoneAuth(false);
$('btnRegister').onclick = () => phoneAuth(true);

auth.onAuthStateChanged(u => {
  if (meUnsub) { meUnsub(); meUnsub = null; }
  if (!u) { ME = null; booted = false; stopAll(); show('login'); return; }
  const ref = db.collection('users').doc(u.uid);
  meUnsub = ref.onSnapshot(s => {
    const d = s.data();
    if (!d || !d.name) { if (curScr !== 'setup') openSetup(u); return; }
    if (d.banned) { stopAll(); booted = false; show('login'); $('loginMain').innerHTML = '<div class="empty"><div class="e">⛔</div><b>حسابك محظور</b><span>إذا تعتقد صار غلط، تواصل وية الإدارة</span><button class="btn btn-s" onclick="auth.signOut();location.reload()">تسجيل خروج</button></div>'; return; }
    const prevLvl = ME && ME.name ? lvlOf(ME.xp) : null;
    const prevDia = ME && ME.name ? (ME.diamonds || 0) : null;
    ME = Object.assign({ uid: u.uid }, d);
    renderMe();
    if (prevDia !== null && (ME.diamonds || 0) > prevDia) { chime(true); toast('💎 وصلتك ' + ((ME.diamonds || 0) - prevDia).toLocaleString('en') + ' ماسة!'); }
    $('meAdmin').hidden = !ME.admin;
    if (prevLvl && lvlOf(ME.xp) > prevLvl) { const nl = lvlOf(ME.xp); setTimeout(() => levelUpFx(nl), 3600); }
    if (!booted) { booted = true; show('home'); startHome(); startChats(); if (window.startNotifs) startNotifs(); if (window.welcomeTips) setTimeout(welcomeTips, 1500); }
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
        diamonds: 0, silver: C.welcomeSilver, xp: 0, charm: 0, followers: 0, following: 0, lastCheckin: '',
        createdAt: FV.serverTimestamp()
      }, { merge: true });
      toast('🎉 هدية ترحيب ' + C.welcomeSilver + ' عملة فضية');
    } catch (e) { toast(errMsg(e)); }
    $('btnSetup').disabled = false;
  };
}
function openEdit() {
  let col = ME.color;
  const m = modal('<h3>تعديل الملف</h3><label class="l">الاسم</label><input id="edN" maxlength="20" value="' + esc(ME.name) + '"><label class="l">المدينة</label><select id="edC"></select><label class="l">اللون</label><div class="colors" id="edCol">' + COLORS.map(c => '<i style="background:' + c + '" data-c="' + c + '" class="' + (c === col ? 'on' : '') + '"></i>').join('') + '</div><label class="l">نبذة عنك</label><textarea id="edB" rows="2" maxlength="80" placeholder="اكتب شي عن نفسك...">' + esc(ME.bio || '') + '</textarea><button class="btn btn-p" id="edS">حفظ</button>');
  fillCities(m.querySelector('#edC'), ME.city);
  m.querySelector('#edCol').onclick = e => { if (!e.target.dataset.c) return; col = e.target.dataset.c; [...e.currentTarget.children].forEach(i => i.classList.toggle('on', i.dataset.c === col)); };
  m.querySelector('#edS').onclick = async () => {
    const n = m.querySelector('#edN').value.trim(); if (n.length < 2) return toast('الاسم قصير');
    await db.collection('users').doc(ME.uid).update({ name: n, city: m.querySelector('#edC').value, color: col, bio: m.querySelector('#edB').value.trim().slice(0, 80) }).catch(e => toast(errMsg(e)));
    m.close(); toast('انحفظ ✅');
  };
}
function renderMe() {
  const l = lvlOf(ME.xp), lo = lvlFloor(l), hi = lvlFloor(l + 1);
  $('meAv').outerHTML = avHtml(meLite(), 96).replace('class="av', 'id="meAv" class="av pf-av');
  $('meName').innerHTML = nameHtml(meLite());
  $('meVipT').textContent = vipOf(ME.recharged || 0) ? 'VIP' + vipOf(ME.recharged || 0) : 'اشحن وصير VIP'; $('meId').textContent = 'ID: ' + (ME.hid || '');
  $('meTags').innerHTML = '<span class="tag lv">⭐ مستوى ' + toAr(l) + '</span><span class="tag">📍 ' + esc(ME.city || '') + '</span>' + (ME.family && ME.family.name ? '<span class="tag">' + esc(ME.family.emoji) + ' ' + esc(ME.family.name) + '</span>' : '') + (ME.bio ? '<div class="uc-bio" style="width:100%">' + esc(ME.bio) + '</div>' : '');
  $('meFollowers').textContent = fmtK(ME.followers || 0); $('meFollowing').textContent = fmtK(ME.following || 0); $('meCharm').textContent = fmtK(ME.charm || 0);
  $('meLvl').textContent = 'المستوى ' + toAr(l); $('meXpT').textContent = toAr((ME.xp || 0) - lo) + ' / ' + toAr(hi - lo);
  $('meXp').style.width = Math.min(100, ((ME.xp || 0) - lo) / (hi - lo) * 100) + '%';
  $('meDia').textContent = '◆ ' + fmtK(ME.diamonds || 0);
  $('homeDia').lastElementChild.textContent = fmtK(ME.diamonds || 0);
  $('homeSil').lastElementChild.textContent = fmtK(ME.silver || 0);
  $('meSil').innerHTML = SC + ' ' + fmtK(ME.silver || 0);
}
async function doCheckin() {
  if (ME.lastCheckin === today()) return toast('أخذت هدية اليوم، تعال باچر 🌙');
  try { await db.collection('users').doc(ME.uid).update({ silver: FV.increment(C.dailySilver), lastCheckin: today() }); chime(); toast('🎁 +' + C.dailySilver + ' عملة فضية'); } catch (e) { toast(errMsg(e)); }
}
function copyTxt(t, el) {
  const ok = () => toast('انتسخ ✅');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, () => toast(t));
  else toast(t);
}
function openRecharge() {
  const R2 = C.recharge || {}, pk = R2.packages || [];
  const tg = (R2.telegram || '').replace(/^@/, '').replace(/[^A-Za-z0-9_]/g, '');
  const row = (ic, label, val) => val ? '<div class="li" style="cursor:default"><span class="ic">' + ic + '</span><div style="flex:1;min-width:0"><div style="font-size:12px;color:var(--fg2)">' + label + '</div><div style="direction:ltr;text-align:right;font-size:15px">' + esc(val) + '</div></div><button class="chip" onclick="copyTxt(\'' + esc(val).replace(/'/g, '') + '\')">نسخ</button></div>' : '';
  modal('<h3>◆ شحن الماسات</h3>' +
    '<div style="text-align:center;font-size:28px;font-weight:900;color:var(--cyan)">◆ ' + fmtK(ME.diamonds || 0) + '</div>' +
    '<div class="gifts" style="grid-template-columns:repeat(2,1fr)">' + pk.map(x => '<div class="gi" style="padding:12px 6px"><span style="font-size:22px">💎</span><span class="p" style="font-size:16px">◆ ' + x.d.toLocaleString('en') + '</span><span class="n" style="font-size:13px">' + esc(x.p) + '</span></div>').join('') + '</div>' +
    '<div style="font-weight:900;margin-top:4px">طريقة الشحن</div>' +
    '<div style="font-size:13px;color:var(--fg2);line-height:1.9">١. حوّل مبلغ الباقة على وحدة من الطرق جوه<br>٢. دز صورة التحويل والـ ID مالتك على التلكرام<br>٣. توصلك الماسات خلال دقايق</div>' +
    '<div class="list" style="margin:0">' + row('🆔', 'الـ ID مالتك', ME.hid || '') + row('📱', 'رصيد ' + (R2.balanceNetwork || '') + ' على الرقم', R2.balanceNumber) + row('💳', R2.cardLabel || 'ماستر كارد', R2.cardNumber) + '</div>' +
    (tg ? '<a class="btn btn-p" style="text-decoration:none;background:#229ED9" href="https://t.me/' + tg + '" target="_blank">✈️ راسلنا على التلكرام</a><div style="text-align:center;font-size:12px;color:var(--fg2)">لا تنسى تدز الـ ID مالتك (' + esc(ME.hid || '') + ') ويا صورة التحويل</div>' : '') +
    '<button class="btn btn-s" onclick="doCheckin();closeTopModal()">🎁 هدية اليوم: ' + C.dailySilver + ' ' + SC + ' عملة فضية</button>');
}
/* ---- لوحة الإدارة ---- */
function openAdmin() {
  if (!ME.admin) return;
  const m = modal('<h3>🛠️ لوحة الإدارة — شحن ماسات</h3><label class="l">ID المستخدم</label><div class="row2"><input id="adId" inputmode="numeric" placeholder="مثلاً 40781904" style="direction:ltr"><button class="btn btn-s" id="adFind" style="width:110px">بحث</button></div><div id="adUser"></div>');
  m.querySelector('#adFind').onclick = async () => {
    const id = m.querySelector('#adId').value.replace(/\D/g, ''); if (!id) return;
    const box = m.querySelector('#adUser'); box.innerHTML = '...';
    try {
      const q = await db.collection('users').where('hid', '==', id).limit(1).get();
      if (q.empty) { box.innerHTML = '<div class="empty">ماكو مستخدم بهذا الـ ID</div>'; return; }
      const d = q.docs[0], u = Object.assign({ uid: d.id }, d.data());
      box.innerHTML = '<div class="ci" style="padding:12px 0">' + avHtml(u, 46) + '<div class="ci-m"><div class="ci-n">' + esc(u.name) + '</div><div class="ci-l">رصيده: ◆ ' + (u.diamonds || 0).toLocaleString('en') + '</div></div></div><label class="l">عدد الماسات</label><input id="adAmt" inputmode="numeric" style="direction:ltr"><div class="opts" id="adQ">' + (C.recharge.packages || []).map(x => '<button data-v="' + x.d + '">' + x.d.toLocaleString('en') + '</button>').join('') + '</div><button class="btn btn-p" id="adGo">💎 إضافة الماسات</button>';
      box.querySelector('#adQ').onclick = e => { const v = e.target.dataset.v; if (v) box.querySelector('#adAmt').value = v; };
      box.querySelector('#adGo').onclick = async () => {
        const n = parseInt(box.querySelector('#adAmt').value.replace(/\D/g, ''), 10); if (!n || n <= 0) return toast('اكتب العدد');
        try {
          const b = db.batch();
          b.update(db.collection('users').doc(u.uid), { diamonds: FV.increment(n), recharged: FV.increment(n) });
          b.set(db.collection('recharges').doc(), { to: u.uid, toHid: u.hid, toName: u.name, amount: n, by: ME.uid, byName: ME.name, ts: FV.serverTimestamp() });
          await b.commit(); m.close(); toast('✅ انضافت ' + n.toLocaleString('en') + ' ماسة لـ ' + u.name);
        } catch (e) { toast(errMsg(e)); }
      };
    } catch (e) { box.innerHTML = '<div class="empty">' + esc(errMsg(e)) + '</div>'; }
  };
}
async function logout() { await leaveRoom(true); auth.signOut(); }

/* ---------- HOME ---------- */
let roomsUnsub = null, roomsData = [], homeTab = 'trend', homeTimer = null, FOLLOW = new Set(), FAVS = new Set(), followUnsub = null, favUnsub = null;
const EXTRA = {};
const HTABS = [{ k: 'fav', n: '⭐ المفضلة' }, { k: 'trend', n: '🔥 الترند' }, { k: 'follow', n: '👥 المتابَعين' }, { k: 'recent', n: '🕘 آخر الرومات' }, { k: 'rec', n: '✨ موصى به' }];
$('homeCats').innerHTML = HTABS.map(c => '<button data-k="' + c.k + '" class="' + (c.k === homeTab ? 'on' : '') + '">' + c.n + '</button>').join('');
$('homeCats').onclick = e => { const b = e.target.closest('button'); if (!b) return; homeTab = b.dataset.k; [...$('homeCats').children].forEach(x => x.classList.toggle('on', x === b)); renderRooms(); };
function startHome() {
  roomsUnsub = db.collection('rooms').orderBy('lastActive', 'desc').limit(80).onSnapshot(s => { roomsData = s.docs.map(d => Object.assign({ id: d.id }, d.data())); renderRooms(); }, e => toast(errMsg(e)));
  followUnsub = db.collection('users').doc(ME.uid).collection('following').onSnapshot(s => { FOLLOW = new Set(s.docs.map(d => d.id)); renderRooms(); }, () => {});
  favUnsub = db.collection('users').doc(ME.uid).collection('favRooms').onSnapshot(s => { FAVS = new Set(s.docs.map(d => d.id)); renderRooms(); }, () => {});
  homeTimer = setInterval(renderRooms, 30000);
  if (window.loadHomeHero) loadHomeHero();
}
function recentIds() { try { return JSON.parse(localStorage.getItem('hj_recent') || '[]'); } catch (e) { return []; } }
function pushRecent(id) { try { const l = recentIds().filter(x => x !== id); l.unshift(id); localStorage.setItem('hj_recent', JSON.stringify(l.slice(0, 20))); } catch (e) {} }
const isLive = r => r && !r.closed && ms(r.lastActive) > Date.now() - 3 * 60000;
const heat = r => (r.online || 0) * 10 + Object.values(r.hearts || {}).reduce((a, b) => a + b, 0) / 100;
function roomById(id) { const r = roomsData.find(x => x.id === id) || EXTRA[id]; if (!r && EXTRA[id] === undefined) { EXTRA[id] = null; db.collection('rooms').doc(id).get().then(s => { if (s.exists) { EXTRA[id] = Object.assign({ id }, s.data()); renderRooms(); } }).catch(() => {}); } return r || null; }
function renderRooms() {
  const live = roomsData.filter(isLive);
  let list = [], empty = '';
  if (homeTab === 'trend') { list = live.slice().sort((a, b) => heat(b) - heat(a)); empty = 'ماكو رومات مفتوحة هسه|كون أول واحد يفتح روم ويجمع الناس'; }
  else if (homeTab === 'fav') { list = [...FAVS].map(roomById).filter(Boolean).sort((a, b) => isLive(b) - isLive(a)); empty = 'ما ضفت رومات للمفضلة|ادخل أي روم واضغط ⋯ ← ⭐ أضف للمفضلة'; }
  else if (homeTab === 'follow') { list = roomsData.filter(r => !r.closed && (FOLLOW.has(r.ownerUid) || (r.seats || []).some(x => x && FOLLOW.has(x.uid)))).sort((a, b) => isLive(b) - isLive(a) || heat(b) - heat(a)); empty = 'ماكو رومات لناس تتابعهم|تابع الناس من بطاقتهم حتى تلكى رومهم هنا'; }
  else if (homeTab === 'recent') { list = recentIds().map(roomById).filter(r => r && !r.closed); empty = 'بعدك ما دخلت أي روم|الرومات اللي تدخلها تبين هنا'; }
  else { list = live.slice().sort((a, b) => ((b.city === ME.city) * 50 + heat(b) + (FOLLOW.has(b.ownerUid) ? 30 : 0)) - ((a.city === ME.city) * 50 + heat(a) + (FOLLOW.has(a.ownerUid) ? 30 : 0))); empty = 'ماكو رومات نوصيك بيها هسه|ارجع بعد شوية'; }
  const [et, es] = empty.split('|');
  $('roomsEmpty').hidden = list.length > 0;
  $('roomsEmpty').querySelector('b').textContent = et; $('roomsEmpty').querySelector('span').textContent = es;
  $('roomsCount').textContent = list.length ? toAr(list.length) + ' روم' : '';
  $('roomsTitle').textContent = (HTABS.find(t => t.k === homeTab) || HTABS[1]).n;
  $('roomsGrid').innerHTML = list.map(r => {
    const cat = CATS.find(c => c.k === r.cat) || CATS[1], th = THEMES.find(t => t.k === (r.theme || '')) || THEMES[0], lv = isLive(r);
    const cv = r.coverV ? coverOf(r) : '';
    return '<div class="rc' + (lv ? '' : ' off') + '" onclick="enterRoom(\'' + r.id + '\')"><div class="rc-top" data-cover="' + r.id + '" style="background:' + (cv ? 'url(' + cv + ') center/cover' : 'radial-gradient(circle at 50% 30%,' + th.c + ',#140A04)') + '">' + (cv ? '' : cat.e) + (lv ? '<span class="rc-live">مباشر</span><span class="rc-cnt">👤 ' + toAr(Math.max(1, r.online || 0)) + '</span>' : '<span class="rc-live off">غير مباشر</span>') + (r.locked ? '<span class="rc-lock">🔒</span>' : '') + (FAVS.has(r.id) ? '<span class="rc-fav">⭐</span>' : '') + '</div><div class="rc-b"><div class="rc-t">' + esc(r.title) + '</div><div class="rc-h">' + esc(r.ownerName) + ' · ' + esc(r.city || '') + '</div></div></div>';
  }).join('');
}
async function toggleFav() {
  const ref = db.collection('users').doc(ME.uid).collection('favRooms').doc(R.id);
  if (FAVS.has(R.id)) { await ref.delete().catch(e => toast(errMsg(e))); toast('انشال من المفضلة'); }
  else { await ref.set({ title: R.data.title, ts: Date.now() }).catch(e => toast(errMsg(e))); toast('⭐ انضاف للمفضلة'); }
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
const isMod = () => isOwner() || !!(R.data && ME && (R.data.admins || []).includes(ME.uid));
const agoraOK = () => window.AgoraRTC && C.agoraAppId && C.agoraAppId !== 'AGORA_APP_ID';

async function enterRoom(id, skipPw) {
  if (R.id === id) { show('room'); return; }
  if (R.id) await leaveRoom(true);
  let snap; try { snap = await db.collection('rooms').doc(id).get(); } catch (e) { return toast(errMsg(e)); }
  if (!snap.exists) return toast('الروم انسد');
  const d = snap.data();
  if (((d.banned || {})[ME.uid] || 0) > Date.now()) return toast('🚫 مطرود من هذا الروم مؤقتاً');
  if (d.password && d.ownerUid !== ME.uid && !skipPw) {
    const m = modal('<h3>🔒 روم خاص</h3><input id="pwI" placeholder="اكتب الرمز السري" style="text-align:center"><button class="btn btn-p" id="pwG">دخول</button>');
    m.querySelector('#pwG').onclick = () => { if (m.querySelector('#pwI').value.trim() === d.password) { m.close(); enterRoom(id, true); } else toast('الرمز غلط'); };
    return;
  }
  pushRecent(id);
  R = { id, data: d, unsubs: [], members: {}, mySeat: -1, muted: false, spkOff: false, joinTs: Date.now(), speaking: new Set(), seen: new Set() };
  $('room').className = 'scr ' + (d.theme || ''); show('room'); $('rmChat').innerHTML = ''; renderRoom(); loadRoomBg(d);
  const me = meLite();
  roomRef().collection('members').doc(ME.uid).set(Object.assign({ ts: FV.serverTimestamp() }, me)).catch(() => {});
  roomRef().update({ lastActive: FV.serverTimestamp() }).catch(() => {});
  R.unsubs.push(roomRef().onSnapshot(s => {
    if (!s.exists || (s.data().closed && !isOwner())) { toast('صاحب الروم سدّه'); leaveRoom(); return; }
    if (((s.data().banned || {})[ME.uid] || 0) > Date.now()) { toast('🚫 انطردت من الروم'); leaveRoom(); return; }
    const prevBg = R.data && R.data.bgV; R.data = s.data(); $('room').className = 'scr ' + (R.data.theme || ''); renderRoom(); syncMySeat(); if (R.data.bgV !== prevBg) loadRoomBg(R.data); syncYT(); syncGameBanner(); if (window.syncPK) syncPK(); if (window.syncNotice) syncNotice();
  }));
  R.unsubs.push(roomRef().collection('members').onSnapshot(s => { R.members = {}; s.docs.forEach(d => R.members[d.id] = d.data()); renderCount(); }));
  R.unsubs.push(roomRef().collection('messages').orderBy('ts', 'desc').limit(40).onSnapshot(s => {
    const adds = s.docChanges().filter(c => c.type === 'added').map(c => Object.assign({ id: c.doc.id }, c.doc.data())).reverse();
    adds.forEach(onRoomMsg);
  }));
  let lastJ = 0; try { lastJ = +localStorage.getItem('hj_join_' + id) || 0; } catch (e) {}
  if (Date.now() - lastJ > 15 * 60000) { try { localStorage.setItem('hj_join_' + id, Date.now()); } catch (e) {} roomRef().collection('messages').add(Object.assign({ type: 'join', ts: FV.serverTimestamp() }, meLite())).catch(() => {}); }
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
    if (!s) return '<div class="seat' + ((d.locks || [])[i] ? ' locked' : '') + '" data-i="' + i + '"><div class="seat-ring">' + ((d.locks || [])[i] ? '🔒' : i === 0 ? '👑' : '🎙️') + '</div><div class="seat-n" style="color:var(--fg3)">' + (i === 0 ? 'المضيف' : toAr(i)) + '</div></div>';
    const host = s.uid === d.ownerUid;
    return '<div class="seat full' + (host ? ' host' : '') + (R.speaking.has(s.uid) ? ' speak' : '') + '" data-i="' + i + '" data-uid="' + esc(s.uid) + '">' + (host ? '<span class="seat-crown">👑</span>' : '') + '<div class="seat-ring">' + avHtml(s, 52) + '<span class="seat-mic">' + (s.muted ? '🔇' : '🎙️') + '</span></div><div class="seat-n">' + nameHtml(s, true) + '</div><div class="seat-h">💗 ' + fmtK(hearts[s.uid] || 0) + '</div></div>';
  }).join('');
}
$('seats').onclick = e => { const el = e.target.closest('.seat'); if (!el) return; const i = +el.dataset.i, s = (R.data.seats || [])[i]; if (s) userCard(s.uid); else if (window.emptySeatClick) emptySeatClick(i); else takeSeat(i); };
function syncMySeat() {
  const i = (R.data.seats || []).findIndex(s => s && s.uid === ME.uid);
  if (i === -1 && R.mySeat !== -1) { R.mySeat = -1; stopPublish(); toast('نزلت من المايك'); }
  else if (i !== -1 && R.mySeat === -1) { R.mySeat = i; startPublish(); }
  else R.mySeat = i;
  $('rbMic').hidden = R.mySeat === -1;
  const ms_ = i >= 0 ? R.data.seats[i] : null;
  if (ms_ && ms_.fm && !R.muted) { R.muted = true; if (R.localTrack) R.localTrack.setMuted(true); updMicBtn(); toast('🔇 المشرف كتم مايكك'); }
}
async function takeSeat(i) {
  if (i === 0 && !isOwner()) return toast('هذا كرسي صاحب الروم');
  if ((R.data.locks || [])[i] && !isMod()) return toast('🔒 هذا الكرسي مقفول');
  if (!agoraOK()) toast('الصوت بعده مو مفعّل بالإعدادات');
  const ref = roomRef();
  try {
    await db.runTransaction(async tx => {
      const s = await tx.get(ref); const st = (s.data().seats || Array(10).fill(null)).slice();
      if (st[i]) throw new Error('taken');
      for (let k = 0; k < st.length; k++) if (st[k] && st[k].uid === ME.uid) st[k] = null;
      st[i] = Object.assign({ muted: false }, meLite());
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
    c.on('connection-state-change', (cur, prev, reason) => {
      if (cur === 'DISCONNECTED' && reason !== 'LEAVE' && R.client === c && R.id) {
        toast('📡 انقطع الصوت، دا نرجع نتصل...'); const id = R.id, wasSeat = R.mySeat !== -1;
        try { if (R.localTrack) R.localTrack.close(); } catch (e) {} R.localTrack = null; R.client = null;
        setTimeout(() => { if (R.id === id) joinVoice(id); }, 2500);
      }
    });
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
    const fx = vipOf(ME.recharged || 0) >= 3 && ME.vfx && ME.vfx !== 'none' ? ME.vfx : null;
    R.localTrack = fx ? await makeFxTrack(fx) : await AgoraRTC.createMicrophoneAudioTrack({ AEC: true, ANS: true, AGC: true, encoderConfig: 'speech_standard' });
    await R.client.publish(R.localTrack);
    R.muted = false; updMicBtn(); chime();
  } catch (e) { console.error(e); toast('اسمح للتطبيق يستخدم المايك'); leaveSeat(); }
  R.publishing = false;
}
async function stopPublish() {
  try { if (R.localTrack) { await R.client.unpublish(R.localTrack).catch(() => {}); R.localTrack.close(); } R.localTrack = null; if (R.fxStop) { R.fxStop(); R.fxStop = null; } if (R.client) await R.client.setClientRole('audience'); } catch (e) {}
}
async function toggleMic() {
  if (R.mySeat === -1) return;
  const m = modal('<h3>🎙️ المايك</h3><button class="btn btn-s" id="mM">' + (R.muted ? '🎙️ شغّل المايك' : '🔇 اكتم المايك') + '</button><button class="btn btn-s" id="mL" style="color:var(--danger)">⬇️ انزل من المايك</button>');
  m.querySelector('#mM').onclick = async () => { m.close(); const ss = (R.data.seats || [])[R.mySeat]; if (R.muted && ss && ss.fm) return toast('🔇 المشرف كاتم مايكك'); R.muted = !R.muted; if (R.localTrack) await R.localTrack.setMuted(R.muted); setMuteFlag(R.muted); updMicBtn(); };
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
  $('rbMic').hidden = true; $('sayRow').hidden = true; $('rmBar').hidden = false; ytStop(); $('pkBar').hidden = true; $('rmNotice').hidden = true; $('room').style.backgroundImage = ''; if (window.gameClose) gameClose(true);
  if (!silent) show('home');
}
window.addEventListener('pagehide', () => { if (R.id) leaveRoom(true); });

/* ---- room chat ---- */
function openSay() { $('rmBar').hidden = true; $('sayRow').hidden = false; $('sayInput').focus(); }
$('sayRow').onsubmit = e => {
  e.preventDefault(); const t = $('sayInput').value.trim(); $('sayInput').value = '';
  $('sayRow').hidden = true; $('rmBar').hidden = false;
  if (!t || !R.id) return;
  roomRef().collection('messages').add(Object.assign({ type: 'msg', text: t.slice(0, 200), ts: FV.serverTimestamp() }, meLite())).catch(e => toast(errMsg(e)));
};
$('sayInput').onblur = () => setTimeout(() => { if (!$('sayInput').value) { $('sayRow').hidden = true; $('rmBar').hidden = false; } }, 150);
function onRoomMsg(m) {
  if (R.seen.has(m.id)) return; R.seen.add(m.id);
  if (m.type === 'msg' && ME.blocked && ME.blocked.includes(m.uid)) return;
  const box = $('rmChat'), el = document.createElement('div');
  const nm = '<b onclick="userCard(\'' + esc(m.uid) + '\')">' + nameHtml(m, true) + '</b>';
  if (m.type === 'join') { el.className = 'cm sys'; el.innerHTML = (m.vip ? '👑 ' : '👋 ') + nameHtml(m) + ' دخل الروم'; if (m.vip >= 3 && (!m.ts || ms(m.ts) > R.joinTs - 3000)) vipEntrance(m); }
  else if (m.type === 'gift') {
    const g = giftBy(m.gift), to = (m.to || []).map(t => t.name).join('، ');
    el.className = 'cm gift'; el.innerHTML = '<div class="gc-line">' + nm + ' <span class="v">ارسال</span> ' + esc(to) + '</div><div class="gc-box"><img src="' + gArt(g) + '" alt=""><span>' + (m.qty || 1) + 'x</span></div>';
    const fresh = !m.ts || ms(m.ts) > R.joinTs - 3000;
    if (fresh) playGift(g, m);
  } else if (m.type === 'react') { if (!m.ts || ms(m.ts) > R.joinTs - 3000) floatReact(m); return;
  } else if (m.type === 'sys') { el.className = 'cm sys'; el.textContent = m.text; }
  else { el.className = 'cm'; el.innerHTML = nm + ': ' + esc(m.text); }
  box.appendChild(el);
  while (box.children.length > 80) box.firstChild.remove();
  box.scrollTop = box.scrollHeight;
}

/* ---- gifts ---- */
function openGifts(preUid) {
  const seated = (R.data.seats || []).filter(s => s && s.uid !== ME.uid);
  if (preUid && preUid !== ME.uid && !seated.some(s => s.uid === preUid)) { const mm = R.members[preUid]; if (mm) seated.unshift(Object.assign({ uid: preUid }, mm)); }
  const sel = new Set(seated.length ? [preUid && seated.some(s => s.uid === preUid) ? preUid : (seated.find(s => s.uid === R.data.ownerUid) || seated[0]).uid] : []);
  let gi = 0, cur = 'love';
  const list = () => cur === 's' ? SGIFTS : GIFTS.filter(g => g.c === cur);
  const grid = () => list().map((g, i) => '<div class="gi' + (i === gi ? ' on' : '') + '" data-i="' + i + '">' + (g.fx ? '<span class="fx">🎬</span>' : '') + '<img src="' + gArt(g) + '" alt=""><span class="n">' + g.n + '</span><span class="p"' + (cur === 's' ? ' style="color:#C9D1DC"' : '') + '>' + (cur !== 's' ? '◆ ' : SC + ' ') + g.p + '</span></div>').join('');
  const m = modal('<div class="gs-to"><span>إلى</span><div class="gs-avs" id="gAv"></div><button class="gs-all" id="gAll"><i>✓</i>الكل</button></div><div class="cats" id="gTabs" style="padding:0">' + GCATS.map(c => '<button data-c="' + c.k + '" class="' + (c.k === 'love' ? 'on' : '') + '">' + c.n + '</button>').join('') + '</div><div class="gifts" id="gGrid">' + grid() + '</div><div class="gs-bar"><div class="gs-bal" id="gBal"></div><div class="gs-send"><select id="gQ"><option>1</option><option>5</option><option>10</option><option>66</option><option>99</option></select><button id="gS">إرسال</button></div></div>');
  const bal = () => { m.querySelector('#gBal').innerHTML = cur !== 's' ? '<span class="d">◆ ' + fmtK(ME.diamonds || 0) + '</span><span style="color:var(--or);cursor:pointer" onclick="closeTopModal();openRecharge()">شحن ‹</span>' : '<span style="color:#C9D1DC">' + SC + ' ' + fmtK(ME.silver || 0) + '</span>'; };
  bal();
  m.querySelector('#gTabs').onclick = e => { const c = e.target.dataset.c; if (!c) return; cur = c; gi = 0; [...e.currentTarget.children].forEach(x => x.classList.toggle('on', x.dataset.c === c)); m.querySelector('#gGrid').innerHTML = grid(); bal(); };
  const drawAv = () => { if (!seated.length) { m.querySelector('#gAv').innerHTML = '<span style="font-size:12.5px;color:var(--fg2)">ماكو أحد عالمايك هسه، تكدر تتفرج على الهدايا</span>'; m.querySelector('#gAll').hidden = true; return; } m.querySelector('#gAv').innerHTML = seated.map(s => '<div class="av' + (sel.has(s.uid) ? ' on' : '') + '" data-u="' + esc(s.uid) + '" style="background:' + esc(s.color) + '">' + esc(s.name.charAt(0)) + '</div>').join(''); m.querySelector('#gAll').classList.toggle('on', sel.size === seated.length); };
  drawAv();
  m.querySelector('#gAv').onclick = e => { const u = e.target.dataset.u; if (!u) return; if (sel.has(u)) { if (sel.size > 1) sel.delete(u); } else sel.add(u); drawAv(); };
  m.querySelector('#gAll').onclick = () => { if (sel.size === seated.length) { const f = [...sel][0]; sel.clear(); sel.add(f); } else seated.forEach(s => sel.add(s.uid)); drawAv(); };
  m.querySelector('#gGrid').onclick = e => { const el = e.target.closest('.gi'); if (!el) return; gi = +el.dataset.i; m.querySelectorAll('.gi').forEach(x => x.classList.toggle('on', x === el)); };
  m.querySelector('#gS').onclick = async () => {
    const g = list()[gi], qty = +m.querySelector('#gQ').value, targets = seated.filter(s => sel.has(s.uid));
    if (!targets.length) return toast('اختار شخص عالمايك حتى تهديه، أو اضغط على اسم أي واحد بالروم');
    m.close(); sendGift(g, qty, targets);
  };
}
async function sendGift(g, qty, targets) {
  const sv = !!g.s, field = sv ? 'silver' : 'diamonds';
  const each = g.p * qty, total = each * targets.length, heart = sv ? Math.ceil(each / 10) : each;
  const myRef = db.collection('users').doc(ME.uid), ref = roomRef();
  try {
    await db.runTransaction(async tx => {
      const s = await tx.get(myRef); const d = (s.data() || {})[field] || 0;
      if (d < total) throw new Error('nobal');
      const mine = { [field]: d - total }; if (!sv) mine.xp = FV.increment(total);
      tx.update(myRef, mine);
      const hu = { lastActive: FV.serverTimestamp() };
      targets.forEach(t => { tx.update(db.collection('users').doc(t.uid), { charm: FV.increment(heart), ['gw.' + g.k]: FV.increment(qty) }); hu['hearts.' + t.uid] = FV.increment(heart); const pu = window.pkGiftUpdate && pkGiftUpdate(t.uid, heart); if (pu) hu[pu[0]] = FV.increment(pu[1]); });
      const sk = 'sup.' + ME.uid + '.'; hu[sk + 'v'] = FV.increment(heart * targets.length); hu[sk + 'n'] = ME.name; hu[sk + 'c'] = ME.color || ''; hu[sk + 'vip'] = vipOf(ME.recharged || 0); hu[sk + 'pv'] = ME.pv || 0;
      tx.update(ref, hu);
    });
    targets.forEach(t => { if (t.uid !== ME.uid) db.collection('users').doc(t.uid).collection('supporters').doc(ME.uid).set({ name: ME.name, color: ME.color || '', amt: FV.increment(heart), ts: FV.serverTimestamp() }, { merge: true }).catch(() => {}); });
    if (window.notify) targets.forEach(t => notify(t.uid, 'gift', 'أهداك ' + g.n + (qty > 1 ? ' x' + qty : '')));
    if (!sv && ME.family && ME.family.id) db.collection('families').doc(ME.family.id).update({ total: FV.increment(total) }).catch(() => {});
    await ref.collection('messages').add({ type: 'gift', ...meLite(), gift: g.k, qty, val: heart, to: targets.map(t => ({ uid: t.uid, name: t.name })), ts: FV.serverTimestamp() });
  } catch (e) {
    if (e.message === 'nobal') { if (sv) toast('عملاتك الفضية ما تكفي، خذ هدية اليوم 🎁'); else { toast('ماساتك ما تكفي (' + total + ' ◆)'); openRecharge(); } }
    else toast(errMsg(e));
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
  w.innerHTML = h + '<img src="gifts/bouquet.webp?v=1" alt=""><div class="lbl">' + lbl + ' 🌹</div>';
  document.body.appendChild(w); setTimeout(() => w.remove(), 4500);
}
function levelUpFx(l) {
  const w = document.createElement('div'); w.className = 'lvup'; w.innerHTML = '<div class="hx">' + l + '</div><div class="t">ارتقيت للمستوى ' + toAr(l) + ' 🎉</div>';
  document.body.appendChild(w); setTimeout(() => w.remove(), 2800); chime(true);
}

/* ---- room menu / members ---- */
function openMembers() {
  const list = freshMembers();
  const m = modal('<h3>الموجودين (' + toAr(list.length) + ')</h3>' + list.map(u => '<div class="ci" data-u="' + esc(u.uid) + '">' + avHtml(u, 42) + '<div class="ci-m"><div class="ci-n">' + nameHtml(u) + (u.uid === R.data.ownerUid ? ' 👑' : '') + '</div></div></div>').join(''));
  m.onclick = e => { const el = e.target.closest('[data-u]'); if (el) { m.close(); userCard(el.dataset.u); } };
}
function openRoomMenu() {
  if (isOwner()) {
    const m = modal('<h3>إدارة الروم</h3><button class="btn btn-s" id="rmF">' + (FAVS.has(R.id) ? '★ شيل من المفضلة' : '⭐ أضف للمفضلة') + '</button><button class="btn btn-s" id="rmE">✏️ تعديل الروم (الاسم والرمز السري)</button><button class="btn btn-s" id="rmBg">🖼️ خلفية الروم من الاستوديو</button>' + (vipOf(ME.recharged || 0) >= 3 ? '<button class="btn btn-s" id="rmCv">🎞️ صورة الروم المتحركة (VIP3)</button>' : '') + '<button class="btn btn-s" id="rmNt">📢 إعلان الروم</button><button class="btn btn-s" id="rmPk">⚔️ تحدي PK للدعم</button><button class="btn btn-s" id="rmYt">▶️ يوتيوب بالروم</button><button class="btn btn-s" id="rmC" style="color:var(--danger)">⛔ سد الروم</button>');
    m.querySelector('#rmPk').onclick = () => { m.close(); openPK(); };
    m.querySelector('#rmNt').onclick = () => { m.close(); editNotice(); };
    m.querySelector('#rmE').onclick = () => { m.close(); openCreate(); };
    m.querySelector('#rmF').onclick = () => { m.close(); toggleFav(); };
    m.querySelector('#rmBg').onclick = () => { m.close(); setRoomImage('bg'); };
    if (m.querySelector('#rmCv')) m.querySelector('#rmCv').onclick = () => { m.close(); setRoomImage('cover'); };
    m.querySelector('#rmYt').onclick = () => { m.close(); openYT(); };
    m.querySelector('#rmC').onclick = async () => { m.close(); await roomRef().update({ closed: true, seats: Array(10).fill(null), online: 0 }).catch(() => {}); leaveRoom(); };
  } else {
    const m = modal('<h3>' + esc(R.data.title) + '</h3>' + (isMod() ? '<button class="btn btn-s" id="rmNt">📢 إعلان الروم</button>' : '') + '<button class="btn btn-s" id="rmF">' + (FAVS.has(R.id) ? '★ شيل من المفضلة' : '⭐ أضف للمفضلة') + '</button>' + (R.mySeat !== -1 ? '<button class="btn btn-s" id="rmYt">▶️ يوتيوب بالروم</button>' : '') + '<button class="btn btn-s" id="rmR">🚩 إبلاغ عن الروم</button>');
    if (m.querySelector('#rmYt')) m.querySelector('#rmYt').onclick = () => { m.close(); openYT(); };
    m.querySelector('#rmF').onclick = () => { m.close(); toggleFav(); };
    if (m.querySelector('#rmNt')) m.querySelector('#rmNt').onclick = () => { m.close(); editNotice(); };
    m.querySelector('#rmR').onclick = () => { db.collection('reports').add({ room: R.id, by: ME.uid, ts: FV.serverTimestamp() }); m.close(); toast('وصل البلاغ للإدارة، شكراً'); };
  }
}

/* ---------- USER CARD / FOLLOW ---------- */
function on2(m, id, f) { const b = m.querySelector(id); if (b) b.onclick = f; }
async function userCard(uid) {
  let u; try { const s = await db.collection('users').doc(uid).get(); u = Object.assign({ uid }, s.data() || { name: '؟' }); } catch (e) { return toast(errMsg(e)); }
  u.vip = vipOf(u.recharged || 0);
  const self = uid === ME.uid;
  let following = false;
  if (!self) { try { following = (await db.collection('users').doc(ME.uid).collection('following').doc(uid).get()).exists; } catch (e) {} }
  const seated = R.id && (R.data.seats || []).some(s => s && s.uid === uid);
  const m = modal('<div class="uc">' + avHtml(u, 84) + '<div class="pf-name">' + nameHtml(u) + '</div><div class="pf-id">ID: ' + esc(u.hid || '') + '</div>' + (u.bio ? '<div class="uc-bio">' + esc(u.bio) + '</div>' : '') + '<div class="tags"><span class="tag lv">⭐ ' + toAr(lvlOf(u.xp)) + '</span><span class="tag">📍 ' + esc(u.city || '') + '</span><span class="tag" onclick="closeTopModal();openCharm(\'' + uid + '\')" style="cursor:pointer">💗 ' + fmtK(u.charm || 0) + '</span><span class="tag" onclick="closeTopModal();openPeople(\'followers\',\'' + uid + '\')" style="cursor:pointer">👥 ' + fmtK(u.followers || 0) + '</span></div>' + (window.giftWall ? giftWall(u) : '') + '</div>' +
    (self ? (R.mySeat !== -1 && seated ? '<button class="btn btn-s" id="ucDown">⬇️ انزل من المايك</button>' : '') :
      '<div class="row2"><button class="btn ' + (following ? 'btn-s' : 'btn-p') + '" id="ucF">' + (following ? '✓ تتابعه' : '+ متابعة') + '</button><button class="btn btn-s" id="ucM">💬 رسالة</button></div>' +
      (R.id ? '<button class="btn btn-s" id="ucG">🎁 أهديه</button>' : '') +
      (window.modButtons ? modButtons(u, seated) : '') + '<div class="uc-mini"><button id="ucB">' + ((ME.blocked || []).includes(uid) ? '✅ فك الحظر' : '🚫 حظر') + '</button><button id="ucR">🚩 إبلاغ</button></div>'));
  on2(m, '#ucB', () => { m.close(); toggleBlock(u); }); on2(m, '#ucR', () => { m.close(); reportUser(u); });
  if (window.bindModButtons) bindModButtons(m, u);
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
  await batch.commit().then(() => { toast(was ? 'ألغيت المتابعة' : 'صرت تتابع ' + u.name); if (!was && window.notify) notify(u.uid, 'follow', 'صار يتابعك');
    const fr = b.collection('followers').doc(ME.uid); (was ? fr.delete() : fr.set({ name: ME.name, color: ME.color || '', ts: FV.serverTimestamp() })).catch(() => {}); }).catch(e => toast(errMsg(e)));
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
  if ((ME.blocked || []).includes(u.uid)) return toast('إنت حاظره، فك الحظر أول');
  if ((u.blocked || []).includes(ME.uid)) return toast('ما تكدر تراسل هذا الشخص');
  DM = { u, id: chatId(ME.uid, u.uid), from: curScr };
  $('dmName').textContent = u.name; $('dmAv').outerHTML = avHtml(u, 38).replace('class="av"', 'class="av" id="dmAv"');
  $('dmMsgs').innerHTML = ''; show('dm');
  const cref = db.collection('chats').doc(DM.id);
  cref.update({ ['unread.' + ME.uid]: 0 }).catch(() => {});
  dmUnsub = cref.collection('messages').orderBy('ts', 'desc').limit(100).onSnapshot(s => {
    $('dmMsgs').innerHTML = s.docs.slice().reverse().map(d => { const m = d.data(); return '<div class="bub ' + (m.uid === ME.uid ? 'me' : 'them') + (m.img ? ' img' : '') + '">' + (m.img ? '<img src="' + m.img + '" alt="" onclick="viewImg(this.src)">' : '') + esc(m.text || '') + '</div>'; }).join('');
    $('dmMsgs').scrollTop = 1e9;
    if (s.docChanges().some(c => c.type === 'added' && c.doc.data().uid !== ME.uid)) cref.update({ ['unread.' + ME.uid]: 0 }).catch(() => {});
  });
}
function closeDM() { if (dmUnsub) dmUnsub(); dmUnsub = null; const back = DM && DM.from; DM = null; show(back === 'room' && R.id ? 'room' : 'chats'); }
function dmSend(t, img) {
  if (!DM) return;
  const cref = db.collection('chats').doc(DM.id), o = DM.u;
  const batch = db.batch();
  batch.set(cref.collection('messages').doc(), Object.assign({ uid: ME.uid, text: t.slice(0, 500), ts: FV.serverTimestamp() }, img ? { img } : {}));
  batch.set(cref, { members: [ME.uid, o.uid], info: { [ME.uid]: { name: ME.name, color: ME.color }, [o.uid]: { name: o.name, color: o.color } }, last: img ? '📷 صورة' : t.slice(0, 80), lastTs: FV.serverTimestamp(), unread: { [o.uid]: FV.increment(1) } }, { merge: true });
  batch.commit().catch(e => toast(errMsg(e)));
}
$('dmForm').onsubmit = e => { e.preventDefault(); const t = $('dmInput').value.trim(); if (!t || !DM) return; $('dmInput').value = ''; dmSend(t); };
async function dmPhoto() { try { const img = await pickImage({ size: 900, maxKB: 230 }); dmSend('', img); } catch (e) {} }
function viewImg(src) { const d = document.createElement('div'); d.className = 'imgview'; d.innerHTML = '<img src="' + src + '" alt="">'; d.onclick = () => d.remove(); document.body.appendChild(d); }

/* ---------- RANK ---------- */
let rankBy = 'xp';
document.querySelectorAll('#rank [data-r]').forEach(b => b.onclick = () => { rankBy = b.dataset.r; document.querySelectorAll('#rank [data-r]').forEach(x => x.classList.toggle('on', x === b)); loadRank(); });
async function loadRank() {
  $('rankList').innerHTML = '<div class="empty">...</div>';
  try {
    const s = await db.collection('users').orderBy(rankBy, 'desc').limit(30).get();
    const list = s.docs.map(d => Object.assign({ uid: d.id }, d.data())).filter(u => (u[rankBy] || 0) > 0); list.forEach(u => u.vip = vipOf(u.recharged || 0));
    $('rankList').innerHTML = list.length ? list.map((u, i) => '<div class="ci" data-u="' + esc(u.uid) + '"><b style="width:26px;text-align:center;font-size:' + (i < 3 ? 22 : 15) + 'px">' + (['🥇', '🥈', '🥉'][i] || toAr(i + 1)) + '</b>' + avHtml(u, 46) + '<div class="ci-m"><div class="ci-n">' + esc(u.name) + '</div><div class="ci-l">⭐ ' + toAr(lvlOf(u.xp)) + ' · ' + esc(u.city || '') + '</div></div><b style="color:var(--or2)">' + (rankBy === 'xp' ? '◆ ' : '💗 ') + fmtK(u[rankBy]) + '</b></div>').join('') : '<div class="empty"><div class="e">🏆</div><b>الترتيب بعده فارغ</b><span>أول واحد يدز هدية يصير بالقمة</span></div>';
  } catch (e) { $('rankList').innerHTML = '<div class="empty">' + esc(errMsg(e)) + '</div>'; }
}
$('rankList').onclick = e => { const el = e.target.closest('[data-u]'); if (el) userCard(el.dataset.u); };

/* ---------- VIP ---------- */
const VIP_INFO = [
  { t: 'الاسم الملوّن', d: 'اسمك يطلع بألوان قوس قزح بكل مكان بالتطبيق', e: '🌈' },
  { t: 'صورة متحركة', d: 'إطار متحرك حول صورتك، وتكدر تحط صورتك أو GIF متحرك', e: '🖼️' },
  { t: 'النهائي', d: 'مؤثرات صوتية للمايك، وترحيب صوتي وشريط ذهبي لما تدخل أي روم، وصورة متحركة لرومك', e: '👑' }
];
function openVip() {
  const r = ME.recharged || 0, v = vipOf(r), next = VIPT[v] || null;
  const pct = next ? Math.min(100, r / next * 100) : 100;
  const m = modal('<h3>👑 VIP</h3><div class="vip-cur">' + (v ? '<span class="vipb v' + v + '" style="font-size:16px;padding:4px 14px">VIP' + v + '</span>' : '<span style="color:var(--fg2)">بعدك مو VIP</span>') + '</div>' +
    '<div style="font-size:12.5px;color:var(--fg2);text-align:center">مجموع شحنك: ◆ ' + r.toLocaleString('en') + (next ? ' — باقي ◆ ' + (next - r).toLocaleString('en') + ' للمستوى الجاي' : ' — وصلت أعلى مستوى 🎉') + '</div><div class="xp"><i style="width:' + pct + '%"></i></div>' +
    VIP_INFO.map((x, i) => '<div class="vip-row' + (v > i ? ' on' : '') + '" data-l="' + i + '" style="cursor:pointer"><span class="e">' + x.e + '</span><div style="flex:1;min-width:0"><b>VIP' + (i + 1) + ' — ' + x.t + '</b><div>' + x.d + '</div><small>شحن ◆ ' + VIPT[i].toLocaleString('en') + '</small></div><span>' + (v > i ? '✅' : '🔒') + ' ‹</span></div>').join('') +
    (v >= 2 ? '<button class="btn btn-s" id="vAv">📷 غيّر صورتك (صورة أو GIF)</button>' : '') +
    (v >= 3 ? '<button class="btn btn-s" id="vFx">🎙️ مؤثر الصوت: ' + fxName(ME.vfx) + '</button>' : '') +
    '<button class="btn btn-p" id="vR">◆ اشحن ماسات</button>');
  const on = (id, f) => { const b = m.querySelector(id); if (b) b.onclick = f; };
  on('#vAv', () => { m.close(); setAvatar(); });
  on('#vFx', () => { m.close(); openFx(); });
  on('#vR', () => { m.close(); openRecharge(); });
  m.querySelectorAll('.vip-row').forEach(el => el.onclick = () => { m.close(); openVipLevel(+el.dataset.l); });
}
const VIP_DETAIL = [
  ['اسمك يتلون بألوان قوس قزح متحركة', 'يبين بالكراسي، والدردشة، وملفك، والترتيب، وبطاقتك', 'شارة VIP1 زرقاء يم اسمك'],
  ['كل مميزات VIP1', 'إطار ملون يدور حول صورتك بكل مكان', 'تكدر تحط صورتك الخاصة أو صورة GIF متحركة', 'اسمك يصير بلون ذهبي-وردي', 'شارة VIP2 برتقالية'],
  ['كل مميزات VIP1 و VIP2', 'مؤثرات صوت للمايك: صدى، قاعة، راديو، روبوت', 'لما تدخل أي روم: شريط ذهبي باسمك يطلع للكل، وموسيقى وترحيب صوتي', 'صورة متحركة (GIF) لرومك تبين بالصفحة الرئيسية', 'اسمك بلون ذهبي لامع، وشارة VIP3 ذهبية']
];
function openVipLevel(i) {
  const lv = i + 1, have = vipOf(ME.recharged || 0) >= lv, need = Math.max(0, VIPT[i] - (ME.recharged || 0));
  const demo = Object.assign(meLite(), { vip: lv });
  const m = modal('<h3>' + VIP_INFO[i].e + ' VIP' + lv + ' — ' + VIP_INFO[i].t + '</h3>' +
    '<div class="vip-demo">' + avHtml(demo, 76) + '<div style="font-size:19px">' + nameHtml(demo) + '</div><small>هيج راح تبين للناس</small></div>' +
    '<div class="list" style="margin:0">' + VIP_DETAIL[i].map(t => '<div class="li" style="cursor:default;font-weight:700;font-size:13.5px"><span class="ic">✨</span>' + t + '</div>').join('') + '</div>' +
    '<div style="text-align:center;font-weight:900;color:' + (have ? 'var(--live)' : 'var(--or2)') + '">' + (have ? '✅ هذا المستوى مفعّل عندك' : '🔒 تحتاج تشحن ◆ ' + VIPT[i].toLocaleString('en') + ' بالمجموع (باقيلك ◆ ' + need.toLocaleString('en') + ')') + '</div>' +
    (lv === 3 ? '<button class="btn btn-s" id="vlDemo">👀 شوف مثال الدخول للروم</button>' : '') +
    (have ? (lv === 2 ? '<button class="btn btn-p" id="vlAv">📷 غيّر صورتك</button>' : lv === 3 ? '<button class="btn btn-p" id="vlFx">🎙️ اختار مؤثر الصوت</button>' : '') : '<button class="btn btn-p" id="vlR">◆ اشحن وصير VIP' + lv + '</button>') +
    '<button class="btn btn-s" id="vlB">→ رجوع</button>');
  const on = (id, f) => { const b = m.querySelector(id); if (b) b.onclick = f; };
  on('#vlDemo', () => vipEntrance(demo));
  on('#vlAv', () => { m.close(); setAvatar(); });
  on('#vlFx', () => { m.close(); openFx(); });
  on('#vlR', () => { m.close(); openRecharge(); });
  on('#vlB', () => { m.close(); openVip(); });
}
const FX = [{ k: 'none', n: 'بدون' }, { k: 'echo', n: 'صدى' }, { k: 'hall', n: 'قاعة' }, { k: 'radio', n: 'راديو' }, { k: 'robot', n: 'روبوت' }];
const fxName = k => (FX.find(f => f.k === (k || 'none')) || FX[0]).n;
function openFx() {
  const m = modal('<h3>🎙️ مؤثر الصوت</h3><div class="opts" id="fxO">' + FX.map(f => '<button data-k="' + f.k + '" class="' + ((ME.vfx || 'none') === f.k ? 'on' : '') + '">' + f.n + '</button>').join('') + '</div><p style="font-size:12px;color:var(--fg2);text-align:center">الكل يسمع صوتك بالمؤثر لما تكون عالمايك</p>');
  m.querySelector('#fxO').onclick = async e => {
    const k = e.target.dataset.k; if (!k) return; m.close();
    await db.collection('users').doc(ME.uid).update({ vfx: k }).catch(er => toast(errMsg(er)));
    ME.vfx = k; toast('🎙️ ' + fxName(k));
    if (R.id && R.mySeat !== -1) { await stopPublish(); startPublish(); }
  };
}
async function makeFxTrack(kind) {
  const st = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  const src = ac.createMediaStreamSource(st), out = ac.createMediaStreamDestination(), dry = ac.createGain();
  src.connect(dry);
  if (kind === 'echo') { const d = ac.createDelay(1); d.delayTime.value = .22; const fb = ac.createGain(); fb.gain.value = .38; const wet = ac.createGain(); wet.gain.value = .55; src.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(out); dry.connect(out); }
  else if (kind === 'hall') { const cv = ac.createConvolver(), len = ac.sampleRate * 2.4, ir = ac.createBuffer(2, len, ac.sampleRate); for (let c = 0; c < 2; c++) { const ch = ir.getChannelData(c); for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); } cv.buffer = ir; const wet = ac.createGain(); wet.gain.value = .5; src.connect(cv); cv.connect(wet); wet.connect(out); dry.connect(out); }
  else if (kind === 'radio') { const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 600; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2800; const ws = ac.createWaveShaper(), c = new Float32Array(256); for (let i = 0; i < 256; i++) { const x = i / 128 - 1; c[i] = Math.tanh(x * 2.5); } ws.curve = c; const g = ac.createGain(); g.gain.value = 1.6; src.connect(hp); hp.connect(lp); lp.connect(ws); ws.connect(g); g.connect(out); }
  else if (kind === 'robot') { const osc = ac.createOscillator(); osc.frequency.value = 50; const mod = ac.createGain(); mod.gain.value = 0; osc.connect(mod.gain); src.connect(mod); const g = ac.createGain(); g.gain.value = 1.8; mod.connect(g); g.connect(out); osc.start(); }
  else dry.connect(out);
  R.fxStop = () => { st.getTracks().forEach(t => t.stop()); ac.close().catch(() => {}); };
  return AgoraRTC.createCustomAudioTrack({ mediaStreamTrack: out.stream.getAudioTracks()[0] });
}
function vipEntrance(m) {
  const w = document.createElement('div'); w.className = 'vip-in';
  w.innerHTML = '<div class="vip-in-r">' + avHtml(m, 46) + '<div><span class="vipb v3">VIP3</span><div class="t">' + nameHtml(m, true) + ' دخل الروم ✨</div></div></div>';
  document.body.appendChild(w); setTimeout(() => w.remove(), 4200);
  [392, 523, 659, 784, 1047].forEach((f, i) => sfx(f, .4, 'sawtooth', .05, i * .12));
  try { if (window.speechSynthesis) { const u = new SpeechSynthesisUtterance('أهلاً وسهلاً ب ' + m.name); u.lang = 'ar'; u.rate = .95; setTimeout(() => speechSynthesis.speak(u), 700); } } catch (e) {}
}

/* ---------- الصور ---------- */
function pickImage(opt) {
  return new Promise((res, rej) => {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = () => {
      const f = inp.files && inp.files[0]; if (!f) return rej(new Error('cancel'));
      if (opt.gif && f.type === 'image/gif') {
        if (f.size > opt.maxKB * 1024) return rej(new Error('big'));
        const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); return;
      }
      const img = new Image(); img.onload = () => {
        const sc = Math.min(1, opt.size / Math.max(img.width, img.height)), c = document.createElement('canvas');
        c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        let q = .85, d = c.toDataURL('image/jpeg', q); while (d.length > opt.maxKB * 1370 && q > .3) { q -= .1; d = c.toDataURL('image/jpeg', q); }
        URL.revokeObjectURL(img.src); res(d);
      }; img.onerror = rej; img.src = URL.createObjectURL(f);
    };
    inp.style.display = 'none'; document.body.appendChild(inp); setTimeout(() => inp.remove(), 120000);
    inp.click();
  });
}
async function setAvatar() {
  let d; try { d = await pickImage({ size: 320, maxKB: 280, gif: true }); } catch (e) { if (e.message === 'big') toast('الـ GIF كبير، لازم أقل من 280 كيلوبايت'); return; }
  toast('جاري الرفع...');
  try { await db.collection('avatars').doc(ME.uid).set({ img: d }); await db.collection('users').doc(ME.uid).update({ pv: Date.now() }); toast('✅ تغيرت صورتك'); } catch (e) { toast(errMsg(e)); }
}
const RMEDIA = {};
async function roomMedia(id, kind, v) { const k = id + kind + v; if (RMEDIA[k] !== undefined) return RMEDIA[k]; RMEDIA[k] = null; try { const s = await db.collection('roomMedia').doc(id + '_' + kind).get(); RMEDIA[k] = s.exists ? s.data().img : ''; } catch (e) { RMEDIA[k] = ''; } return RMEDIA[k]; }
function coverOf(r) { const k = r.id + 'cover' + r.coverV; if (RMEDIA[k]) return RMEDIA[k]; if (RMEDIA[k] === undefined) roomMedia(r.id, 'cover', r.coverV).then(u => { const el = document.querySelector('[data-cover="' + r.id + '"]'); if (u && el) { el.style.background = 'url(' + u + ') center/cover'; el.childNodes[0] && el.childNodes[0].nodeType === 3 && el.childNodes[0].remove(); } }); return ''; }
async function loadRoomBg(d) {
  const id = R.id; if (!d.bgV) { $('room').style.backgroundImage = ''; return; }
  const u = await roomMedia(id, 'bg', d.bgV);
  if (u && R.id === id) { $('room').style.backgroundImage = 'linear-gradient(rgba(10,5,2,.35),rgba(10,5,2,.65)),url(' + u + ')'; $('room').style.backgroundSize = 'cover'; $('room').style.backgroundPosition = 'center'; }
}
async function setRoomImage(kind) {
  let d; try { d = await pickImage(kind === 'bg' ? { size: 900, maxKB: 260 } : { size: 400, maxKB: 280, gif: true }); } catch (e) { if (e.message === 'big') toast('الـ GIF كبير، لازم أقل من 280 كيلوبايت'); return; }
  toast('جاري الرفع...');
  try { await db.collection('roomMedia').doc(R.id + '_' + kind).set({ img: d, owner: ME.uid }); await roomRef().update({ [kind + 'V']: Date.now() }); toast('✅ انحفظت'); } catch (e) { toast(errMsg(e)); }
}

/* ---------- يوتيوب بالروم ---------- */
let YTP = null, ytApi = null;
function ytId(u) { const m = String(u).match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(u.trim()) ? u.trim() : null); }
function loadYTApi() { if (ytApi) return ytApi; ytApi = new Promise(res => { if (window.YT && YT.Player) return res(); window.onYouTubeIframeAPIReady = () => res(); const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s); }); return ytApi; }
function openYT() {
  const canSet = isOwner() || R.mySeat !== -1;
  const key = C.youtubeKey;
  const m = modal('<h3>▶️ يوتيوب بالروم</h3>' + (canSet ? (key ? '<div class="row2"><input id="ytQ" placeholder="ابحث عن فيديو..."><button class="btn btn-p" id="ytS" style="width:90px">بحث</button></div><div id="ytR"></div><div class="or-line">أو</div>' : '') + '<input id="ytU" placeholder="الصق رابط يوتيوب هنا" style="direction:ltr"><button class="btn btn-p" id="ytGo">▶️ شغّل للكل</button>' : '<p style="text-align:center;color:var(--fg2)">لازم تكعد عالمايك حتى تشغل فيديو</p>') + (R.data.yt ? '<button class="btn btn-s" id="ytX" style="color:var(--danger)">⏹️ إيقاف الفيديو للكل</button>' : ''));
  const play = vid => { m.close(); roomRef().update({ yt: { vid, at: Date.now(), by: ME.name } }).catch(e => toast(errMsg(e))); };
  const go = m.querySelector('#ytGo'); if (go) go.onclick = () => { const v = ytId(m.querySelector('#ytU').value); v ? play(v) : toast('الرابط غلط'); };
  const x = m.querySelector('#ytX'); if (x) x.onclick = () => { m.close(); roomRef().update({ yt: null }); };
  const sb = m.querySelector('#ytS'); if (sb) sb.onclick = async () => {
    const q = m.querySelector('#ytQ').value.trim(); if (!q) return; const box = m.querySelector('#ytR'); box.innerHTML = '...';
    try { const r = await fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=' + encodeURIComponent(q) + '&key=' + key).then(r => r.json());
      box.innerHTML = (r.items || []).map(it => '<div class="ci" data-v="' + it.id.videoId + '" style="padding:8px 0"><img src="' + it.snippet.thumbnails.default.url + '" style="width:80px;border-radius:8px"><div class="ci-m"><div class="ci-l" style="white-space:normal;color:var(--fg)">' + esc(it.snippet.title) + '</div></div></div>').join('') || 'ماكو نتائج';
      box.onclick = e => { const el = e.target.closest('[data-v]'); if (el) play(el.dataset.v); };
    } catch (e) { box.innerHTML = 'ما اشتغل البحث'; }
  };
}
async function syncYT() {
  const y = R.data && R.data.yt;
  if (!y || !y.vid) { ytStop(); return; }
  if (R.ytVid === y.vid && R.ytAt === y.at) return;
  R.ytVid = y.vid; R.ytAt = y.at;
  $('ytBox').hidden = false; $('ytBy').textContent = '▶️ شغّله ' + (y.by || '');
  await loadYTApi();
  const start = Math.max(0, Math.floor((Date.now() - y.at) / 1000));
  if (YTP && YTP.loadVideoById) YTP.loadVideoById({ videoId: y.vid, startSeconds: start });
  else YTP = new YT.Player('ytP', { videoId: y.vid, playerVars: { autoplay: 1, start, playsinline: 1, rel: 0, modestbranding: 1 }, events: { onReady: e => { e.target.setVolume(+$('ytVol').value); e.target.playVideo(); } } });
}
function ytStop() { R.ytVid = null; if (YTP && YTP.destroy) { try { YTP.destroy(); } catch (e) {} } YTP = null; const b = $('ytBox'); if (b) { b.hidden = true; b.querySelector('#ytWrap').innerHTML = '<div id="ytP"></div>'; } }
$('ytVol').oninput = e => { if (YTP && YTP.setVolume) YTP.setVolume(+e.target.value); };

/* ---------- misc ---------- */
function stopAll() { [roomsUnsub, chatsUnsub, dmUnsub, followUnsub, favUnsub].forEach(u => u && u()); roomsUnsub = chatsUnsub = dmUnsub = null; clearInterval(homeTimer); }
// زر الرجوع بالأندرويد
window.hajinaBack = function () {
  if (closeTopModal()) return 'x';
  if (!$('sayRow').hidden) { $('sayRow').hidden = true; $('rmBar').hidden = false; return 'x'; }
  if (curScr === 'dm') { closeDM(); return 'x'; }
  if (curScr === 'room') { leaveRoom(); return 'x'; }
  if (curScr === 'chats' || curScr === 'rank' || curScr === 'me') { show('home'); return 'x'; }
  return 'exit';
};
