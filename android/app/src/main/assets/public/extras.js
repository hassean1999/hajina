/* حجينه — عجلة الحظ، البحث، أدوات المشرفين، إعلان الروم */
'use strict';
/* ---------- عجلة الحظ اليومية ---------- */
const WHEEL = [10, 30, 20, 100, 15, 50, 25, 40];
const WHEEL_W = [16, 14, 16, 3, 16, 9, 14, 12];
const WHEEL_C = ['#FF8A1F', '#E8304C', '#2E9BD6', '#FFD24A', '#2EAD5B', '#B266FF', '#F28AB0', '#1ABC9C'];
window.doCheckin = function () {
  const done = ME.lastCheckin === today();
  const seg = 360 / WHEEL.length;
  const grad = WHEEL.map((v, i) => WHEEL_C[i] + ' ' + (i * seg) + 'deg ' + ((i + 1) * seg) + 'deg').join(',');
  const labels = WHEEL.map((v, i) => '<span style="transform:rotate(' + (i * seg + seg / 2) + 'deg) translateY(-104px)">' + v + '</span>').join('');
  const m = modal('<h3>🎡 عجلة الحظ اليومية</h3><p style="text-align:center;font-size:12.5px;color:var(--fg2)">لفّها مرة كل يوم واربح عملات فضية ' + SC + '</p>' +
    '<div class="wheel-wrap"><div class="wheel-ptr">▼</div><div class="wheel" id="wh" style="background:conic-gradient(' + grad + ')">' + labels + '<div class="wheel-hub">' + SC + '</div></div></div>' +
    (done ? '<button class="btn btn-s" disabled>✅ لفّيت اليوم، تعال باچر 🌙</button>' : '<button class="btn btn-p" id="whGo">🎡 لفّ العجلة</button>'));
  const go = m.querySelector('#whGo'); if (!go) return;
  go.onclick = async () => {
    go.disabled = true;
    let r = Math.random() * WHEEL_W.reduce((a, b) => a + b, 0), k = 0; while (r > WHEEL_W[k]) { r -= WHEEL_W[k]; k++; }
    const val = WHEEL[k], target = 360 * 6 + (360 - (k * seg + seg / 2)) + (Math.random() * seg * .6 - seg * .3);
    const wh = m.querySelector('#wh'); wh.style.transition = 'transform 4.2s cubic-bezier(.17,.67,.12,1)'; wh.style.transform = 'rotate(' + target + 'deg)';
    let t = 0; const tick = setInterval(() => { t++; sfx(900 - t * 8, .03, 'square', .03); if (t > 60) clearInterval(tick); }, 70);
    setTimeout(async () => {
      try { await db.collection('users').doc(ME.uid).update({ silver: FV.increment(val), lastCheckin: today() }); ME.lastCheckin = today(); chime(true); go.outerHTML = '<div class="wheel-win">🎉 ربحت <b>' + val + '</b> ' + SC + '</div>'; }
      catch (e) { toast(errMsg(e)); }
    }, 4300);
  };
};

/* ---------- البحث ---------- */
window.openSearch = function () {
  const m = modal('<h3>🔍 بحث</h3><div class="row2"><input id="sq" placeholder="ID الشخص، اسمه، أو اسم الروم"><button class="btn btn-p" id="sGo" style="width:90px">بحث</button></div><div id="sRes"></div>');
  const inp = m.querySelector('#sq'); setTimeout(() => inp.focus(), 100);
  const run = async () => {
    const q = inp.value.trim(); if (!q) return; const box = m.querySelector('#sRes'); box.innerHTML = '<div class="empty">...</div>';
    let users = [], rooms = [];
    try {
      if (/^\d+$/.test(q)) { const s = await db.collection('users').where('hid', '==', q).limit(5).get(); users = s.docs.map(d => Object.assign({ uid: d.id }, d.data())); }
      else { const s = await db.collection('users').where('name', '>=', q).where('name', '<=', q + '').limit(10).get(); users = s.docs.map(d => Object.assign({ uid: d.id }, d.data())); }
    } catch (e) {}
    rooms = roomsData.filter(r => !r.closed && (r.title || '').includes(q)).slice(0, 10);
    users.forEach(u => u.vip = vipOf(u.recharged || 0));
    box.innerHTML = (users.length ? '<div class="s-h">👤 الأشخاص</div>' + users.map(u => '<div class="ci" data-u="' + esc(u.uid) + '">' + avHtml(u, 44) + '<div class="ci-m"><div class="ci-n">' + nameHtml(u) + '</div><div class="ci-l">ID: ' + esc(u.hid || '') + ' · ' + esc(u.city || '') + '</div></div></div>').join('') : '') +
      (rooms.length ? '<div class="s-h">🏠 الرومات</div>' + rooms.map(r => '<div class="ci" data-r="' + r.id + '"><span style="font-size:30px">' + ((CATS.find(c => c.k === r.cat) || CATS[1]).e) + '</span><div class="ci-m"><div class="ci-n">' + esc(r.title) + '</div><div class="ci-l">' + esc(r.ownerName) + (isLive(r) ? ' · 🟢 مباشر' : '') + '</div></div></div>').join('') : '') ||
      '<div class="empty"><div class="e">🔍</div><b>ما لكينا شي</b><span>جرب الـ ID الكامل أو بداية الاسم</span></div>';
    box.querySelectorAll('[data-u]').forEach(el => el.onclick = () => { m.close(); userCard(el.dataset.u); });
    box.querySelectorAll('[data-r]').forEach(el => el.onclick = () => { m.close(); enterRoom(el.dataset.r); });
  };
  m.querySelector('#sGo').onclick = run; inp.onkeydown = e => { if (e.key === 'Enter') run(); };
};

/* ---------- أدوات المشرفين ---------- */
window.modButtons = function (u, seated) {
  if (!R.id || u.uid === ME.uid || u.uid === R.data.ownerUid || !isMod()) return '';
  const admin = (R.data.admins || []).includes(u.uid), seat = (R.data.seats || []).find(s => s && s.uid === u.uid);
  return '<div class="mod-box"><small>🛡️ أدوات الإشراف</small><div class="mod-g">' +
    (seated ? '<button id="mdDown">⬇️ نزّله</button><button id="mdMute">' + (seat && seat.fm ? '🎙️ فك الكتم' : '🔇 اكتم مايكه') + '</button>' : '') +
    '<button id="mdKick" class="d">🚫 اطرده ١٠ دقايق</button>' +
    (isOwner() ? '<button id="mdAdm">' + (admin ? '❌ شيل الإشراف' : '🛡️ خليه مشرف') + '</button>' : '') + '</div></div>';
};
window.bindModButtons = function (m, u) {
  const on = (id, f) => { const b = m.querySelector(id); if (b) b.onclick = async () => { m.close(); try { await f(); } catch (e) { toast(errMsg(e)); } }; };
  const ref = roomRef();
  on('#mdDown', () => leaveSeat(u.uid));
  on('#mdMute', () => db.runTransaction(async tx => { const d = (await tx.get(ref)).data(); const st = (d.seats || []).map(x => x && x.uid === u.uid ? Object.assign({}, x, { fm: !x.fm, muted: !x.fm ? true : x.muted }) : x); tx.update(ref, { seats: st }); }));
  on('#mdKick', async () => {
    await db.runTransaction(async tx => { const d = (await tx.get(ref)).data(); const st = (d.seats || []).map(x => x && x.uid === u.uid ? null : x); tx.update(ref, { seats: st, ['banned.' + u.uid]: Date.now() + 10 * 60000 }); });
    ref.collection('members').doc(u.uid).delete().catch(() => {});
    ref.collection('messages').add({ type: 'sys', uid: ME.uid, text: '🚫 ' + u.name + ' انطرد من الروم', ts: FV.serverTimestamp() }).catch(() => {});
  });
  on('#mdAdm', async () => {
    const admin = (R.data.admins || []).includes(u.uid);
    await ref.update({ admins: admin ? FV.arrayRemove(u.uid) : FV.arrayUnion(u.uid) });
    if (!admin) ref.collection('messages').add({ type: 'sys', uid: ME.uid, text: '🛡️ ' + u.name + ' صار مشرف بالروم', ts: FV.serverTimestamp() }).catch(() => {});
  });
};
window.emptySeatClick = function (i) {
  const locked = (R.data.locks || [])[i];
  if (!isMod() || i === 0) return takeSeat(i);
  const m = modal('<h3>الكرسي ' + toAr(i) + '</h3>' + (locked ? '' : '<button class="btn btn-p" id="esT">🎙️ اكعد عليه</button>') + '<button class="btn btn-s" id="esL">' + (locked ? '🔓 فك القفل' : '🔒 اقفل الكرسي') + '</button>');
  const t = m.querySelector('#esT'); if (t) t.onclick = () => { m.close(); takeSeat(i); };
  m.querySelector('#esL').onclick = async () => { m.close(); const locks = (R.data.locks || Array(10).fill(false)).slice(); while (locks.length < 10) locks.push(false); locks[i] = !locked; await roomRef().update({ locks }).catch(e => toast(errMsg(e))); };
};

/* ---------- إعلان الروم ---------- */
window.syncNotice = function () {
  const el = $('rmNotice'), n = R.data && R.data.notice;
  if (!n) { el.hidden = true; return; }
  el.hidden = false; el.innerHTML = '📢 <span>' + esc(n) + '</span>' + (isMod() ? '<button onclick="editNotice()">✏️</button>' : '');
};
window.editNotice = function () {
  const m = modal('<h3>📢 إعلان الروم</h3><p style="text-align:center;font-size:12px;color:var(--fg2)">يتثبت فوك الدردشة ويشوفه كل واحد يدخل</p><textarea id="ntx" rows="3" maxlength="150" placeholder="مثلاً: أهلاً بيكم، الاحترام واجب 🌹">' + esc(R.data.notice || '') + '</textarea><div class="row2"><button class="btn btn-p" id="ntS">حفظ</button><button class="btn btn-s" id="ntD">مسح</button></div>');
  m.querySelector('#ntS').onclick = async () => { m.close(); await roomRef().update({ notice: m.querySelector('#ntx').value.trim().slice(0, 150) }).catch(e => toast(errMsg(e))); };
  m.querySelector('#ntD').onclick = async () => { m.close(); await roomRef().update({ notice: '' }).catch(e => toast(errMsg(e))); };
};
