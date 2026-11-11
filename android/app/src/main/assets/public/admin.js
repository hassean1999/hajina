/* حجينه — لوحة الإدارة الكاملة، الإعدادات، الترحيب */
'use strict';
const _openAdminCharge = window.openAdmin;
window.openAdmin = function () {
  if (!ME.admin) return;
  const m = modal('<h3>🛠️ لوحة الإدارة</h3><div class="adm-g">' +
    '<button data-a="charge"><span>💎</span>شحن ماسات</button><button data-a="reports"><span>🚩</span>البلاغات</button>' +
    '<button data-a="ban"><span>⛔</span>حظر حساب</button><button data-a="hist"><span>🧾</span>سجل الشحن</button>' +
    '<button data-a="events"><span>🎉</span>الأنشطة</button><button data-a="admins"><span>🛡️</span>تعيين مدير</button></div>');
  m.querySelector('.adm-g').onclick = e => { const b = e.target.closest('button'); if (!b || !b.dataset.a) return; m.close();
    ({ charge: _openAdminCharge, reports: admReports, ban: admBan, hist: admHist, events: () => openEvents(), admins: admAdmins })[b.dataset.a](); };
};
async function admFindUser(label, cb) {
  const m = modal('<h3>' + label + '</h3><label class="l">ID المستخدم</label><div class="row2"><input id="afI" inputmode="numeric" style="direction:ltr"><button class="btn btn-s" id="afG" style="width:100px">بحث</button></div><div id="afR"></div>');
  m.querySelector('#afG').onclick = async () => {
    const id = m.querySelector('#afI').value.replace(/\D/g, ''); if (!id) return; const box = m.querySelector('#afR');
    try { const q = await db.collection('users').where('hid', '==', id).limit(1).get(); if (q.empty) { box.innerHTML = '<div class="empty">ماكو مستخدم بهذا الـ ID</div>'; return; }
      const u = Object.assign({ uid: q.docs[0].id }, q.docs[0].data()); u.vip = vipOf(u.recharged || 0); cb(m, box, u); } catch (e) { box.innerHTML = '<div class="empty">' + esc(errMsg(e)) + '</div>'; }
  };
}
function admBan() {
  admFindUser('⛔ حظر حساب', (m, box, u) => {
    box.innerHTML = '<div class="ci" style="padding:10px 0">' + avHtml(u, 44) + '<div class="ci-m"><div class="ci-n">' + nameHtml(u) + '</div><div class="ci-l">' + (u.banned ? '⛔ محظور حالياً' : 'حسابه شغال') + '</div></div></div><button class="btn ' + (u.banned ? 'btn-s' : 'btn-p') + '" id="abG" style="' + (u.banned ? '' : 'background:var(--danger)') + '">' + (u.banned ? '✅ فك الحظر' : '⛔ احظر الحساب') + '</button>';
    box.querySelector('#abG').onclick = async () => { try { await db.collection('users').doc(u.uid).update({ banned: !u.banned }); m.close(); toast(u.banned ? 'انفك الحظر عن ' + u.name : '⛔ انحظر ' + u.name); } catch (e) { toast(errMsg(e)); } };
  });
}
function admAdmins() {
  admFindUser('🛡️ تعيين مدير للتطبيق', (m, box, u) => {
    box.innerHTML = '<div class="ci" style="padding:10px 0">' + avHtml(u, 44) + '<div class="ci-m"><div class="ci-n">' + nameHtml(u) + '</div><div class="ci-l">' + (u.admin ? '🛡️ مدير' : 'مستخدم عادي') + '</div></div></div><p style="font-size:12px;color:var(--fg2)">المدير يكدر يشحن ماسات ويحظر ويشوف البلاغات. انطيها بس للي تثق بيهم.</p><button class="btn btn-p" id="aaG">' + (u.admin ? '❌ شيل الإدارة' : '🛡️ خليه مدير') + '</button>';
    box.querySelector('#aaG').onclick = async () => { try { await db.collection('users').doc(u.uid).update({ admin: !u.admin }); m.close(); toast('✅ تم'); } catch (e) { toast(errMsg(e)); } };
  });
}
async function admReports() {
  let list = []; try { const s = await db.collection('reports').orderBy('ts', 'desc').limit(50).get(); list = s.docs.map(d => Object.assign({ id: d.id }, d.data())); } catch (e) { return toast(errMsg(e)); }
  const m = modal('<h3>🚩 البلاغات (' + toAr(list.length) + ')</h3>' + (list.length ? list.map(r => '<div class="rep"><div><b>' + (r.user ? '👤 ' + esc(r.userName || r.user) : '🏠 روم') + '</b><small>' + esc(r.why || 'إبلاغ عن روم') + ' · ' + (typeof r.ts === 'number' ? ago(r.ts) : '') + '</small></div><div class="rep-a">' + (r.user ? '<button data-u="' + esc(r.user) + '">شوف</button>' : r.room ? '<button data-r="' + esc(r.room) + '">ادخل</button>' : '') + '<button data-d="' + r.id + '">✓ تم</button></div></div>').join('') : '<div class="empty"><div class="e">✅</div><b>ماكو بلاغات</b></div>'));
  m.onclick = async e => { const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.u) { m.close(); userCard(b.dataset.u); } else if (b.dataset.r) { m.close(); enterRoom(b.dataset.r, true); }
    else if (b.dataset.d) { await db.collection('reports').doc(b.dataset.d).delete().catch(() => {}); b.closest('.rep').remove(); } };
}
async function admHist() {
  let list = []; try { const s = await db.collection('recharges').orderBy('ts', 'desc').limit(60).get(); list = s.docs.map(d => d.data()); } catch (e) { return toast(errMsg(e)); }
  const tot = list.reduce((a, r) => a + (r.amount || 0), 0);
  modal('<h3>🧾 سجل الشحن</h3><div style="text-align:center;font-weight:900;color:var(--cyan)">مجموع آخر ' + toAr(list.length) + ' عملية: ◆ ' + tot.toLocaleString('en') + '</div>' + list.map(r => '<div class="rep"><div><b>' + esc(r.toName || '') + ' <span style="color:var(--fg3);font-size:11px">ID ' + esc(r.toHid || '') + '</span></b><small>بواسطة ' + esc(r.byName || '') + (r.ts && r.ts.toMillis ? ' · ' + new Date(r.ts.toMillis()).toLocaleString('ar-IQ') : '') + '</small></div><b style="color:var(--cyan)">◆ ' + (r.amount || 0).toLocaleString('en') + '</b></div>').join(''));
}

/* ---------- الإعدادات ---------- */
const PREF = (k, d) => { try { const v = localStorage.getItem('hj_' + k); return v === null ? d : v === '1'; } catch (e) { return d; } };
const SETPREF = (k, v) => { try { localStorage.setItem('hj_' + k, v ? '1' : '0'); } catch (e) {} };
window.openSettings = function () {
  const m = modal('<h3>⚙️ الإعدادات</h3><div class="list" style="margin:0">' +
    '<label class="li"><span class="ic">🔊</span>أصوات التطبيق<input type="checkbox" class="tg" id="stS"' + (PREF('sfx', true) ? ' checked' : '') + '></label>' +
    '<label class="li"><span class="ic">✨</span>حركات الهدايا الكبيرة<input type="checkbox" class="tg" id="stF"' + (PREF('fx', true) ? ' checked' : '') + '></label>' +
    '<div class="li" id="stB"><span class="ic">🚫</span>المحظورين<span class="end">' + toAr((ME.blocked || []).length) + '</span></div>' +
    '<a class="li" href="privacy.html" target="_blank" style="color:inherit;text-decoration:none"><span class="ic">🔒</span>سياسة الخصوصية</a>' +
    '<a class="li" href="terms.html" target="_blank" style="color:inherit;text-decoration:none"><span class="ic">📜</span>شروط الاستخدام</a>' +
    '<a class="li" href="https://t.me/' + esc(((C.recharge || {}).telegram) || '') + '" target="_blank" style="color:inherit;text-decoration:none"><span class="ic">💬</span>تواصل وية الدعم</a>' +
    '<div class="li" style="cursor:default"><span class="ic">ℹ️</span>حجينه<span class="end">الإصدار 3.1</span></div></div>' +
    '<button class="btn btn-s" id="stDel" style="color:var(--danger);font-size:13px">🗑️ طلب حذف الحساب</button>');
  m.querySelector('#stS').onchange = e => SETPREF('sfx', e.target.checked);
  m.querySelector('#stF').onchange = e => SETPREF('fx', e.target.checked);
  m.querySelector('#stB').onclick = async () => { m.close(); const ids = ME.blocked || []; if (!ids.length) return toast('ما حاظر أحد');
    const us = (await Promise.all(ids.map(id => db.collection('users').doc(id).get().catch(() => null)))).filter(s => s && s.exists).map(s => Object.assign({ uid: s.id }, s.data()));
    const mm = modal('<h3>🚫 المحظورين</h3>' + us.map(u => '<div class="ci">' + avHtml(u, 40) + '<div class="ci-m"><div class="ci-n">' + esc(u.name) + '</div></div><button class="chip" data-u="' + u.uid + '">فك الحظر</button></div>').join(''));
    mm.onclick = e => { const b = e.target.closest('[data-u]'); if (!b) return; const u = us.find(x => x.uid === b.dataset.u); toggleBlock(u); b.closest('.ci').remove(); }; };
  m.querySelector('#stDel').onclick = () => { m.close(); const mm = modal('<h3>حذف الحساب</h3><p style="text-align:center;color:var(--fg2);font-size:13px;line-height:1.8">راح يوصل طلبك للإدارة، وينحذف حسابك وكل بياناتك خلال 7 أيام. الماسات اللي بحسابك تروح وما ترجع.</p><button class="btn btn-p" id="dlY" style="background:var(--danger)">أكّد طلب الحذف</button>');
    mm.querySelector('#dlY').onclick = () => { db.collection('reports').add({ user: ME.uid, userName: ME.name, why: 'طلب حذف الحساب', by: ME.uid, ts: Date.now() }).catch(() => {}); mm.close(); toast('وصل طلبك ✅'); }; };
};
// احترام إعدادات الصوت والحركات
const _sfx = window.sfx; window.sfx = function () { if (!PREF('sfx', true)) return; return _sfx.apply(this, arguments); };
const _bigFx = window.bigFx; window.bigFx = function (g, lbl) { if (!PREF('fx', true)) return chime(); return _bigFx(g, lbl); };

/* ---------- ترحيب أول مرة ---------- */
window.welcomeTips = function () {
  try { if (localStorage.getItem('hj_welcomed')) return; localStorage.setItem('hj_welcomed', '1'); } catch (e) { return; }
  const steps = [['🎙️', 'افتح روم أو ادخل روم', 'اضغط + بالنص حتى تفتح رومك، أو ادخل أي روم من الترند.'], ['🎁', 'الهدايا', 'ادعم أصدقائك بأكثر من 100 هدية، والهدايا الفاخرة إلها حركة على الشاشة كاملة.'], ['🎡', 'عجلة الحظ', 'لفّها كل يوم وخذ عملات فضية ببلاش.'], ['🎮', 'الألعاب', 'لودو وكيرم ومحيبس وركض وغيرها، تلعبها وية الناس داخل الروم.']];
  let i = 0; const m = modal('<div id="wt"></div>');
  const draw = () => { const s = steps[i]; m.querySelector('#wt').innerHTML = '<div class="wt"><span>' + s[0] + '</span><b>' + s[1] + '</b><p>' + s[2] + '</p><div class="wt-dots">' + steps.map((_, k) => '<i class="' + (k === i ? 'on' : '') + '"></i>').join('') + '</div><button class="btn btn-p" id="wtN">' + (i < steps.length - 1 ? 'التالي ←' : 'يلا نبدي 🎉') + '</button></div>';
    m.querySelector('#wtN').onclick = () => { if (i < steps.length - 1) { i++; draw(); } else m.close(); }; };
  draw();
};
