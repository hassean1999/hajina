/* حجينه — نادي الروم + المهام اليومية */
'use strict';

/* ═══════════════════════════════════════════════
   المهام اليومية للنادي
   ═══════════════════════════════════════════════ */
const RC_TASKS = [
  { id:'rc_chat',   n:'الدردشة على المايك',    desc:'اجلس على المايك 5 دقائق',       goal:5,   unit:'دقيقة',  pts:60,  field:'micMin'  },
  { id:'rc_msg',    n:'إرسال الرسائل',          desc:'أرسل رسائل في أي روم',          goal:10,  unit:'رسالة',  pts:10,  field:'msgs'    },
  { id:'rc_share',  n:'مشاركة الروم',           desc:'شارك رابط الروم مرة واحدة',    goal:1,   unit:'مرة',    pts:40,  field:'shares'  },
  { id:'rc_gift',   n:'إرسال / استقبال هدايا', desc:'هدايا ماسية مع الأعضاء',       goal:5,   unit:'هدية',   pts:1,   field:'giftDiam'},
];

/* مستويات نادي الروم */
const RC_LEVELS = [
  { lv:1, n:'ROOZ 1', min:0,     color:'#888' },
  { lv:2, n:'ROOZ 2', min:500,   color:'#4EC9B0' },
  { lv:3, n:'ROOZ 3', min:1500,  color:'#4FC1FF' },
  { lv:4, n:'ROOZ 4', min:3500,  color:'#C586C0' },
  { lv:5, n:'ROOZ 5', min:7000,  color:'#FFD700' },
];

function rcLevel(pts) {
  let lv = RC_LEVELS[0];
  for (const l of RC_LEVELS) if (pts >= l.min) lv = l; else break;
  return lv;
}

/* ── key اليوم ── */
function rcDayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
}
/* ── key الأسبوع (رقم الأسبوع) ── */
function rcWeekKey() {
  const d = new Date(), start = new Date(d.getFullYear(), 0, 1);
  return d.getFullYear() + '-W' + Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
}

/* ═══════════════════════════════════════════════
   الحساب بالنقاط + مشاركة اليومية
   ═══════════════════════════════════════════════ */
async function rcAwardPoints(roomId, field, inc) {
  if (!roomId || !ME.uid) return;
  const dk = rcDayKey();
  const ref = db.collection('rooms').doc(roomId)
                .collection('club').doc(ME.uid);
  try {
    await ref.set({
      uid: ME.uid, name: ME.name, av: ME.av || '',
      pts: FV.increment(0),         /* يتم إنشاؤه إذا ما كان */
      day: dk,
      ['day_' + dk + '.' + field]: FV.increment(inc),
    }, { merge: true });
  } catch (e) {}
}

/* عداد الميكروفون (يُستدعى من enterRoom / onMicChange) */
let _rcMicTimer = null;
function rcStartMicTimer(roomId) {
  if (_rcMicTimer) return;
  _rcMicTimer = setInterval(async () => {
    await rcAwardPoints(roomId, 'micMin', 1);
    /* أضف نقاط فعلية للنادي كل دقيقة على المايك */
    try {
      await db.collection('rooms').doc(roomId)
        .collection('club').doc(ME.uid)
        .update({ pts: FV.increment(RC_TASKS.find(t=>t.id==='rc_chat').pts / RC_TASKS.find(t=>t.id==='rc_chat').goal) });
    } catch(e){}
  }, 60000);
}
function rcStopMicTimer() {
  if (_rcMicTimer) { clearInterval(_rcMicTimer); _rcMicTimer = null; }
}
window.rcStartMicTimer = rcStartMicTimer;
window.rcStopMicTimer  = rcStopMicTimer;

/* عداد الرسائل */
window.rcOnMsg = async function(roomId) {
  if (!roomId) return;
  const dk = rcDayKey();
  const ref = db.collection('rooms').doc(roomId).collection('club').doc(ME.uid);
  try {
    await ref.set({
      uid: ME.uid, name: ME.name, av: ME.av || '', pts: FV.increment(0), day: dk,
      ['day_' + dk + '.msgs']: FV.increment(1),
    }, { merge: true });
    /* كل رسالة = pts/goal نقطة */
    await ref.update({ pts: FV.increment(RC_TASKS.find(t=>t.id==='rc_msg').pts / RC_TASKS.find(t=>t.id==='rc_msg').goal) });
  } catch(e) {}
};

/* هدية ماسية */
window.rcOnGift = async function(roomId, qty) {
  if (!roomId) return;
  const dk = rcDayKey();
  const ref = db.collection('rooms').doc(roomId).collection('club').doc(ME.uid);
  try {
    await ref.set({
      uid: ME.uid, name: ME.name, av: ME.av || '', pts: FV.increment(0), day: dk,
      ['day_' + dk + '.giftDiam']: FV.increment(qty || 1),
    }, { merge: true });
    await ref.update({ pts: FV.increment((qty || 1) * RC_TASKS.find(t=>t.id==='rc_gift').pts) });
  } catch(e) {}
};

/* ═══════════════════════════════════════════════
   فتح لوحة نادي الروم
   ═══════════════════════════════════════════════ */
async function openRoomClub(roomId) {
  if (!roomId && R) roomId = R.id;
  if (!roomId) return toast('لازم تكون بالروم');

  /* تحميل البيانات */
  let myDoc = {}, topDocs = [];
  try {
    const me = await db.collection('rooms').doc(roomId).collection('club').doc(ME.uid).get();
    myDoc = me.data() || {};
    const top = await db.collection('rooms').doc(roomId).collection('club')
      .orderBy('pts', 'desc').limit(10).get();
    topDocs = top.docs.map(d => d.data());
  } catch(e) {}

  const myPts   = myDoc.pts || 0;
  const lv      = rcLevel(myPts);
  const nextLv  = RC_LEVELS.find(l => l.min > myPts);
  const pct     = nextLv ? Math.min(100, ((myPts - lv.min) / (nextLv.min - lv.min)) * 100) : 100;
  const dk      = rcDayKey();
  const dayData = myDoc['day_' + dk] || {};

  /* بناء HTML المهام */
  const tasksHtml = RC_TASKS.map(t => {
    const prog = Math.min(dayData[t.field] || 0, t.goal);
    const done = prog >= t.goal;
    const pctT = Math.min(100, (prog / t.goal) * 100);
    return '<div class="rc-task' + (done ? ' done' : '') + '">' +
      '<div class="rc-task-top"><span>' + esc(t.n) + '</span><span class="rc-pts">+' + (t.pts * t.goal) + ' نقطة</span></div>' +
      '<div class="rc-task-desc">' + esc(t.desc) + '</div>' +
      '<div class="rc-prog-wrap"><div class="rc-prog-bar" style="width:' + pctT + '%"></div></div>' +
      '<div class="rc-task-cnt">' + prog + ' / ' + t.goal + ' ' + t.unit + (done ? ' ✓' : '') + '</div>' +
    '</div>';
  }).join('');

  /* لوحة المتصدرين */
  const lbHtml = topDocs.length
    ? topDocs.map((u, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i+1) + '.';
        return '<div class="rc-lb-row' + (u.uid === ME.uid ? ' me' : '') + '">' +
          '<span class="rc-lb-rank">' + medal + '</span>' +
          '<div class="rc-lb-av">' + avHtml(u, 32) + '</div>' +
          '<span class="rc-lb-name">' + esc(u.name || '') + '</span>' +
          '<span class="rc-lb-pts">' + toAr(u.pts || 0) + ' 🌟</span>' +
        '</div>';
      }).join('')
    : '<div style="text-align:center;color:var(--fg2);padding:20px">لا يوجد أعضاء بعد</div>';

  const m = modal(
    '<div class="rc-wrap">' +
      /* رأس البطاقة */
      '<div class="rc-head" style="border-bottom-color:' + lv.color + '">' +
        '<div class="rc-lv-badge" style="background:' + lv.color + '">' + esc(lv.n) + '</div>' +
        '<div class="rc-pts-row"><span class="rc-mypts">' + toAr(myPts) + '</span><span class="rc-pts-lbl"> نقطة</span></div>' +
        '<div class="rc-xp-bar"><div class="rc-xp-fill" style="width:' + pct + '%;background:' + lv.color + '"></div></div>' +
        (nextLv ? '<div class="rc-next-lv">المستوى التالي: ' + esc(nextLv.n) + ' (' + toAr(nextLv.min) + ')</div>' : '<div class="rc-next-lv">أعلى مستوى 🏆</div>') +
      '</div>' +
      /* تبويبات */
      '<div class="rc-tabs">' +
        '<button class="on" data-rct="tasks">المهام اليومية</button>' +
        '<button data-rct="lb">المتصدرون</button>' +
      '</div>' +
      /* المحتوى */
      '<div class="rc-body">' +
        '<div class="rc-panel on" id="rcTasks">' + tasksHtml + '</div>' +
        '<div class="rc-panel"    id="rcLb">'    + lbHtml    + '</div>' +
      '</div>' +
    '</div>'
  );

  /* تبويبات */
  m.querySelector('.rc-tabs').onclick = e => {
    const b = e.target.closest('[data-rct]');
    if (!b) return;
    m.querySelectorAll('.rc-tabs button').forEach(x => x.classList.toggle('on', x === b));
    m.querySelector('#rcTasks').classList.toggle('on', b.dataset.rct === 'tasks');
    m.querySelector('#rcLb').classList.toggle('on',    b.dataset.rct === 'lb');
  };
}
window.openRoomClub = openRoomClub;

/* ── Hook على sayRoom لنقاط الرسائل ── */
const _sayRoomRC = window.sayRoom;
window.sayRoom = function() {
  if (_sayRoomRC) _sayRoomRC.apply(this, arguments);
  if (R && R.id) window.rcOnMsg(R.id);
};

/* ── Hook على sendGift لنقاط الهدايا ── */
const _sgRC = window.sendGift;
window.sendGift = async function(g, qty, targets, fromBag) {
  const r = await _sgRC.apply(this, arguments);
  if (!g.s && R && R.id) window.rcOnGift(R.id, qty * (targets || []).length);
  return r;
};
