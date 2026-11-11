/* حجينه — قائمة الثراء، الأنشطة، العائلات */
'use strict';
window.loadHomeHero = async function () {
  try {
    const s = await db.collection('users').orderBy('xp', 'desc').limit(3).get();
    const top = s.docs.map(d => Object.assign({ uid: d.id }, d.data())).filter(u => (u.xp || 0) > 0);
    top.forEach(u => u.vip = vipOf(u.recharged || 0));
    $('richAv').innerHTML = top.length ? top.map(u => avHtml(u, 26)).join('') : '<small>كون الأول</small>';
  } catch (e) {}
  try { const e = await db.collection('events').orderBy('ts', 'desc').limit(1).get(); if (!e.empty) $('evT').textContent = e.docs[0].data().title; } catch (e) {}
  if (ME.family && ME.family.name) $('famT').textContent = ME.family.emoji + ' ' + ME.family.name;
};
window.openRich = function () { rankBy = 'xp'; document.querySelectorAll('#rank [data-r]').forEach(x => x.classList.toggle('on', x.dataset.r === 'xp')); show('rank'); };

/* ---------- الأنشطة ---------- */
const DEFAULT_EVENTS = [
  { e: '🎁', title: 'الهدية اليومية', body: 'ادخل كل يوم وخذ عملات فضية مجانية من زر الهدية فوك.' },
  { e: '🎮', title: 'ألعاب الروم', body: 'المحيبس، سؤال وجواب، تحدي الكلمات، إكس أو، وغيرها. افتح أي روم واضغط 🎮.' },
  { e: '👑', title: 'صير VIP', body: 'اشحن وصير VIP: اسم ملون، إطار متحرك، مؤثرات صوت، وترحيب ذهبي.' },
  { e: '👨‍👩‍👧', title: 'العائلات', body: 'سوّي عائلتك أو انضم لعائلة، وكل هدية تدزها ترفع ترتيب عائلتك.' }
];
window.openEvents = async function () {
  let list = [];
  try { const s = await db.collection('events').orderBy('ts', 'desc').limit(20).get(); list = s.docs.map(d => Object.assign({ id: d.id }, d.data())); } catch (e) {}
  const all = list.concat(DEFAULT_EVENTS);
  const m = modal('<h3>🎉 الأنشطة</h3>' + (ME.admin ? '<button class="btn btn-p" id="evAdd">+ إضافة نشاط جديد</button>' : '') +
    all.map(ev => '<div class="ev-card"><span class="e">' + esc(ev.e || '📢') + '</span><div style="flex:1;min-width:0"><b>' + esc(ev.title) + '</b><p>' + esc(ev.body || '') + '</p>' + (ev.date ? '<small>📅 ' + esc(ev.date) + '</small>' : '') + '</div>' + (ME.admin && ev.id ? '<button class="ev-del" data-id="' + ev.id + '">🗑️</button>' : '') + '</div>').join(''));
  const add = m.querySelector('#evAdd'); if (add) add.onclick = () => { m.close(); addEvent(); };
  m.querySelectorAll('.ev-del').forEach(b => b.onclick = async () => { await db.collection('events').doc(b.dataset.id).delete().catch(e => toast(errMsg(e))); m.close(); openEvents(); });
};
function addEvent() {
  const m = modal('<h3>نشاط جديد</h3><label class="l">إيموجي</label><input id="evE" value="🏆" maxlength="4"><label class="l">العنوان</label><input id="evTi" maxlength="40" placeholder="مثلاً: بطولة المحيبس"><label class="l">التفاصيل</label><textarea id="evB" rows="3" maxlength="300" placeholder="الوقت، الجوائز، الشروط..."></textarea><label class="l">التاريخ (اختياري)</label><input id="evD" maxlength="30" placeholder="الجمعة 9 مساءً"><button class="btn btn-p" id="evS">نشر</button>');
  m.querySelector('#evS').onclick = async () => {
    const t = m.querySelector('#evTi').value.trim(); if (!t) return toast('اكتب العنوان');
    try { await db.collection('events').add({ e: m.querySelector('#evE').value.trim() || '📢', title: t, body: m.querySelector('#evB').value.trim(), date: m.querySelector('#evD').value.trim(), ts: Date.now(), by: ME.uid }); m.close(); toast('✅ انشر النشاط'); openEvents(); } catch (e) { toast(errMsg(e)); }
  };
}

/* ---------- العائلات ---------- */
const FAM_EMO = ['🦅', '🦁', '🐺', '👑', '🔥', '⚔️', '🌙', '💎', '🌹', '🐎', '🦂', '🌴'];
window.openFamilies = async function () {
  let list = [];
  try { const s = await db.collection('families').orderBy('total', 'desc').limit(30).get(); list = s.docs.map(d => Object.assign({ id: d.id }, d.data())); } catch (e) { return toast(errMsg(e)); }
  const mine = ME.family && ME.family.id;
  if (mine && !list.some(f => f.id === mine)) { try { const s = await db.collection('families').doc(mine).get(); if (!s.exists) { await db.collection('users').doc(ME.uid).update({ family: FV.delete() }); } } catch (e) {} }
  const m = modal('<h3>👨‍👩‍👧 العائلات</h3>' +
    (mine ? '<div class="fam-mine" data-f="' + mine + '"><span>' + esc(ME.family.emoji) + '</span><div><small>عائلتك</small><b>' + esc(ME.family.name) + '</b></div><span class="chip">ادخل</span></div>' : '<button class="btn btn-p" id="famNew">+ سوّي عائلتك</button>') +
    '<div style="font-weight:900;margin-top:4px">🏆 ترتيب العائلات</div>' +
    (list.length ? list.map((f, i) => '<div class="ci fam-row" data-f="' + f.id + '"><b style="width:26px;text-align:center;font-size:' + (i < 3 ? 22 : 14) + 'px">' + (['🥇', '🥈', '🥉'][i] || toAr(i + 1)) + '</b><span class="fam-emo">' + esc(f.emoji) + '</span><div class="ci-m"><div class="ci-n">' + esc(f.name) + '</div><div class="ci-l">👥 ' + toAr(f.count || 0) + ' · الكبير: ' + esc(f.ownerName || '') + '</div></div><b style="color:var(--or2)">◆ ' + fmtK(f.total || 0) + '</b></div>').join('') : '<div class="empty"><div class="e">👨‍👩‍👧</div><b>ماكو عائلات بعد</b><span>كون أول واحد يسوي عائلة</span></div>'));
  const n = m.querySelector('#famNew'); if (n) n.onclick = () => { m.close(); createFamily(); };
  m.querySelectorAll('[data-f]').forEach(el => el.onclick = () => { m.close(); familyPage(el.dataset.f); });
};
function createFamily() {
  let emo = FAM_EMO[0];
  const m = modal('<h3>سوّي عائلة</h3><label class="l">اسم العائلة</label><input id="fN" maxlength="18" placeholder="مثلاً: عائلة الصقور"><label class="l">الشعار</label><div class="opts" id="fE">' + FAM_EMO.map((e, i) => '<button data-e="' + e + '" class="' + (i ? '' : 'on') + '" style="font-size:22px">' + e + '</button>').join('') + '</div><label class="l">شعار مكتوب (اختياري)</label><input id="fM" maxlength="60" placeholder="مثلاً: الأخوّة قبل كلشي"><button class="btn btn-p" id="fGo">إنشاء العائلة</button>');
  m.querySelector('#fE').onclick = e => { const b = e.target.closest('button'); if (!b) return; emo = b.dataset.e; [...e.currentTarget.children].forEach(x => x.classList.toggle('on', x === b)); };
  m.querySelector('#fGo').onclick = async () => {
    const name = m.querySelector('#fN').value.trim(); if (name.length < 2) return toast('اكتب اسم العائلة');
    try {
      const ref = db.collection('families').doc();
      await ref.set({ name, emoji: emo, motto: m.querySelector('#fM').value.trim(), owner: ME.uid, ownerName: ME.name, count: 1, total: 0, ts: Date.now() });
      await db.collection('users').doc(ME.uid).update({ family: { id: ref.id, name, emoji: emo } });
      ME.family = { id: ref.id, name, emoji: emo };
      m.close(); toast('🎉 انسوت ' + name); familyPage(ref.id);
    } catch (e) { toast(errMsg(e)); }
  };
}
async function familyPage(fid) {
  let f, mem = [];
  try { const s = await db.collection('families').doc(fid).get(); if (!s.exists) return toast('العائلة انحلت'); f = s.data();
    const q = await db.collection('users').where('family.id', '==', fid).limit(60).get(); mem = q.docs.map(d => Object.assign({ uid: d.id }, d.data())).sort((a, b) => (b.xp || 0) - (a.xp || 0)); mem.forEach(u => u.vip = vipOf(u.recharged || 0));
  } catch (e) { return toast(errMsg(e)); }
  const mine = ME.family && ME.family.id === fid, boss = f.owner === ME.uid;
  const m = modal('<div class="fam-head"><span>' + esc(f.emoji) + '</span><b>' + esc(f.name) + '</b>' + (f.motto ? '<small>«' + esc(f.motto) + '»</small>' : '') + '<div class="tags"><span class="tag">👥 ' + toAr(f.count || mem.length) + ' / ٥٠</span><span class="tag lv">◆ ' + fmtK(f.total || 0) + '</span></div></div>' +
    '<div style="font-weight:900">الأعضاء</div>' + mem.map(u => '<div class="ci" data-u="' + esc(u.uid) + '">' + avHtml(u, 40) + '<div class="ci-m"><div class="ci-n">' + nameHtml(u) + (u.uid === f.owner ? ' 👑' : '') + '</div><div class="ci-l">⭐ ' + toAr(lvlOf(u.xp)) + '</div></div></div>').join('') +
    (mine ? (boss ? '<button class="btn btn-s" id="fDel" style="color:var(--danger)">⛔ حل العائلة</button>' : '<button class="btn btn-s" id="fLeave" style="color:var(--danger)">🚪 اطلع من العائلة</button>') : (ME.family && ME.family.id ? '<p style="text-align:center;font-size:12px;color:var(--fg2)">لازم تطلع من عائلتك أول حتى تنضم لغيرها</p>' : '<button class="btn btn-p" id="fJoin">+ انضم للعائلة</button>')));
  m.querySelectorAll('[data-u]').forEach(el => el.onclick = () => { m.close(); userCard(el.dataset.u); });
  const ref = db.collection('families').doc(fid), me = db.collection('users').doc(ME.uid);
  const on = (id, fn) => { const b = m.querySelector(id); if (b) b.onclick = fn; };
  on('#fJoin', async () => {
    try { await db.runTransaction(async tx => { const d = (await tx.get(ref)).data(); if ((d.count || 0) >= 50) throw new Error('full'); tx.update(ref, { count: (d.count || 0) + 1 }); tx.update(me, { family: { id: fid, name: d.name, emoji: d.emoji } }); });
      ME.family = { id: fid, name: f.name, emoji: f.emoji }; m.close(); toast('🎉 صرت من ' + f.name); } catch (e) { toast(e.message === 'full' ? 'العائلة مليانة' : errMsg(e)); }
  });
  on('#fLeave', async () => { try { const b = db.batch(); b.update(ref, { count: FV.increment(-1) }); b.update(me, { family: FV.delete() }); await b.commit(); ME.family = null; m.close(); toast('طلعت من العائلة'); } catch (e) { toast(errMsg(e)); } });
  on('#fDel', async () => { try { await ref.delete(); await me.update({ family: FV.delete() }); ME.family = null; m.close(); toast('انحلت العائلة'); } catch (e) { toast(errMsg(e)); } });
}
