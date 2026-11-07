/* حجينه — الأرباح والسحب، التفاعلات الطايرة */
'use strict';
const EARN = C.earnings || { minWithdraw: 10000, rateText: '' };
const availEarn = u => Math.max(0, (u.charm || 0) - (u.withdrawn || 0) - (u.pendingW || 0));
const _renderMe = window.renderMe;
window.renderMe = function () { _renderMe(); const e = $('meEarn'); if (e) e.textContent = '💗 ' + fmtK(availEarn(ME)); };
window.openEarnings = function () {
  const av = availEarn(ME), can = av >= EARN.minWithdraw;
  const m = modal('<h3>💰 أرباحي</h3><div class="earn-box"><small>الرصيد القابل للسحب</small><b>💗 ' + av.toLocaleString('en') + '</b>' + (EARN.rateText ? '<span>' + esc(EARN.rateText) + '</span>' : '') + '</div>' +
    '<div class="stats" style="margin:0"><div><b>' + fmtK(ME.charm || 0) + '</b><span>كل اللي استلمته</span></div><div><b>' + fmtK(ME.pendingW || 0) + '</b><span>قيد السحب</span></div><div><b>' + fmtK(ME.withdrawn || 0) + '</b><span>انسحب</span></div></div>' +
    '<p style="font-size:12.5px;color:var(--fg2);line-height:1.8;text-align:center">كل هدية توصلك تزيد أرباحك. من توصل ' + EARN.minWithdraw.toLocaleString('en') + ' نقطة تكدر تطلب سحب، والإدارة تتواصل وياك.</p>' +
    '<label class="l">طريقة الاستلام</label><select id="ewM"><option>زين كاش</option><option>آسياسيل (رصيد)</option><option>ماستر كارد / كي كارد</option><option>FIB</option></select><input id="ewA" placeholder="رقم المحفظة أو البطاقة" style="direction:ltr">' +
    '<button class="btn btn-p" id="ewGo"' + (can ? '' : ' disabled') + '>' + (can ? '💸 اطلب سحب' : '🔒 تحتاج ' + (EARN.minWithdraw - av).toLocaleString('en') + ' نقطة بعد') + '</button>');
  const g = m.querySelector('#ewGo'); if (!can) return;
  g.onclick = async () => {
    const acc = m.querySelector('#ewA').value.trim(); if (acc.length < 6) return toast('اكتب رقم المحفظة أو البطاقة');
    g.disabled = true;
    try {
      const me = db.collection('users').doc(ME.uid);
      await db.runTransaction(async tx => { const d = (await tx.get(me)).data(), a = availEarn(d); if (a < EARN.minWithdraw) throw new Error('low');
        tx.update(me, { pendingW: (d.pendingW || 0) + a }); tx.set(db.collection('withdrawals').doc(), { uid: ME.uid, name: ME.name, hid: ME.hid, amount: a, method: m.querySelector('#ewM').value, account: acc, status: 'pending', ts: Date.now() }); });
      m.close(); toast('✅ وصل طلب السحب للإدارة'); chime(true);
    } catch (e) { toast(e.message === 'low' ? 'الرصيد ما يكفي' : errMsg(e)); g.disabled = false; }
  };
};
// لوحة الإدارة: طلبات السحب
const _openAdmin2 = window.openAdmin;
window.openAdmin = function () {
  _openAdmin2();
  const g = document.querySelector('.adm-g'); if (!g) return;
  const b = document.createElement('button'); b.innerHTML = '<span>💸</span>طلبات السحب'; g.appendChild(b);
  b.onclick = () => { closeTopModal(); admWithdrawals(); };
};
async function admWithdrawals() {
  let list = []; try { const s = await db.collection('withdrawals').where('status', '==', 'pending').limit(50).get(); list = s.docs.map(d => Object.assign({ id: d.id }, d.data())).sort((a, b) => b.ts - a.ts); } catch (e) { return toast(errMsg(e)); }
  const m = modal('<h3>💸 طلبات السحب (' + toAr(list.length) + ')</h3>' + (list.length ? list.map(w => '<div class="rep"><div><b>' + esc(w.name) + ' <span style="color:var(--fg3);font-size:11px">ID ' + esc(w.hid || '') + '</span></b><small>💗 ' + w.amount.toLocaleString('en') + ' · ' + esc(w.method) + '<br><span style="direction:ltr;display:inline-block">' + esc(w.account) + '</span> · ' + ago(w.ts) + '</small></div><div class="rep-a"><button data-ok="' + w.id + '">✅ دفعت</button><button data-no="' + w.id + '">✗ رفض</button></div></div>').join('') : '<div class="empty"><div class="e">✅</div><b>ماكو طلبات</b></div>'));
  m.onclick = async e => { const b = e.target.closest('button'); if (!b) return; const id = b.dataset.ok || b.dataset.no; if (!id) return; const w = list.find(x => x.id === id), ok = !!b.dataset.ok;
    try { const batch = db.batch(); batch.update(db.collection('withdrawals').doc(id), { status: ok ? 'paid' : 'rejected', doneBy: ME.uid, doneTs: Date.now() });
      batch.update(db.collection('users').doc(w.uid), ok ? { pendingW: FV.increment(-w.amount), withdrawn: FV.increment(w.amount) } : { pendingW: FV.increment(-w.amount) });
      await batch.commit(); notify(w.uid, 'admin', ok ? 'دفعنا طلب سحبك 💸' : 'انرفض طلب السحب، تواصل وية الدعم'); b.closest('.rep').remove(); } catch (er) { toast(errMsg(er)); } };
}

/* ---------- التفاعلات الطايرة بالروم ---------- */
const REACTS = ['❤️', '😂', '👏', '🔥', '😍', '🌹', '😮', '🎉'];
window.openReacts = function () {
  const m = modal('<div class="react-g">' + REACTS.map(r => '<button>' + r + '</button>').join('') + '</div>');
  m.querySelector('.react-g').onclick = e => { const b = e.target.closest('button'); if (!b || !R.id) return; m.close();
    roomRef().collection('messages').add(Object.assign({ type: 'react', e: b.textContent, ts: FV.serverTimestamp() }, meLite())).catch(() => {}); };
};
window.floatReact = function (m) {
  const seat = document.querySelector('#seats .seat[data-uid="' + m.uid + '"]');
  let x = innerWidth / 2, y = innerHeight - 120;
  if (seat) { const b = seat.getBoundingClientRect(); x = b.left + b.width / 2; y = b.top + 20; }
  for (let i = 0; i < 5; i++) { const el = document.createElement('div'); el.className = 'freact'; el.textContent = m.e;
    el.style.left = (x - 16 + (Math.random() * 40 - 20)) + 'px'; el.style.top = y + 'px'; el.style.animationDelay = (i * .12) + 's';
    document.body.appendChild(el); setTimeout(() => el.remove(), 2200 + i * 120); }
};
