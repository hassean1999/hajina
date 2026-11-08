/* حجينه — ساحة العائلات، إنشاء عائلة بـ 1000 ماسة، صفحة العائلة */
'use strict';
const FAM_COST = 1000, FAM_MAX = 50;
const famLv = t => { const L = [0, 5e3, 2e4, 6e4, 15e4, 4e5, 1e6, 25e5, 6e6, 15e6]; let i = 0; while (i < L.length - 1 && (t || 0) >= L[i + 1]) i++; return i + 1; };
const famOn = f => Object.values(f.on || {}).filter(t => Date.now() - t < 15 * 60000).length;
function famCover(f, s) { return f.img ? '<div class="fm-cv" style="width:' + s + 'px;height:' + s + 'px;background-image:url(' + f.img + ')"></div>' : '<div class="fm-cv emo" style="width:' + s + 'px;height:' + s + 'px;font-size:' + Math.round(s * .5) + 'px">' + esc(f.emoji || '🦅') + '</div>'; }
const famBadge = f => '<span class="fm-lv">🛡️ ' + toAr(famLv(f.total)) + '</span>';
// نبضة نشاط العائلة
setInterval(() => { if (typeof ME !== 'undefined' && ME && ME.family && ME.family.id && !document.hidden) db.collection('families').doc(ME.family.id).update({ ['on.' + ME.uid]: Date.now() }).catch(() => {}); }, 5 * 60000);
setTimeout(function famPing() { if (typeof ME === 'undefined' || !ME || !ME.uid) return setTimeout(famPing, 5000); if (ME.family && ME.family.id) db.collection('families').doc(ME.family.id).update({ ['on.' + ME.uid]: Date.now() }).catch(() => {}); }, 4000);

window.openFamilies = async function () {
  const m = modal('<div class="fm"><div class="fm-hd"><button class="rk-ic dk" id="fmBk">→</button><b>ساحة العائلات</b><button class="fm-new" id="fmNew">' + (ME.family && ME.family.id ? '🏠 عائلتي' : '➕ إنشاء عائلة') + '</button></div>' +
    '<div class="fm-search"><span>🔍</span><input id="fmQ" placeholder="اكتب ID أو اسم العائلة"><button id="fmGo">بحث</button></div><div id="fmBody"><div class="empty" style="padding:50px 0">⏳ لحظة...</div></div></div>', 'full fmfull');
  m.querySelector('#fmBk').onclick = () => m.close();
  m.querySelector('#fmNew').onclick = () => { if (ME.family && ME.family.id) { m.close(); familyPage(ME.family.id); } else openCreateFamily(m); };
  let all = [], tab = 'all';
  try { const s = await db.collection('families').orderBy('total', 'desc').limit(80).get(); all = s.docs.map(d => Object.assign({ id: d.id }, d.data())); } catch (e) { m.querySelector('#fmBody').innerHTML = '<div class="empty">' + esc(errMsg(e)) + '</div>'; return; }
  // أصدقائي بالعائلات
  let friends = {};
  try {
    const fs = await db.collection('users').doc(ME.uid).collection('following').limit(30).get(), ids = fs.docs.map(d => d.id);
    for (let i = 0; i < ids.length; i += 10) { const q = await db.collection('users').where(firebase.firestore.FieldPath.documentId(), 'in', ids.slice(i, i + 10)).get(); q.docs.forEach(d => { const f = (d.data() || {}).family; if (f && f.id) (friends[f.id] = friends[f.id] || Object.assign({ n: 0 }, f)).n++; }); }
  } catch (e) {}
  const row = f => '<div class="fm-r" data-f="' + f.id + '">' + famCover(f, 84) + '<div class="fm-ri"><div class="fm-rn"><b>' + esc(f.name) + '</b>' + famBadge(f) + '</div><div class="fm-rs"><span class="fm-pill">👥 ' + toAr(f.count || 1) + '</span><span class="fm-on">' + toAr(famOn(f)) + ' أونلاين</span><span class="fm-dia">◆ ' + fmtK(f.total || 0) + '</span></div>' + (f.motto ? '<small>' + esc(f.motto) + '</small>' : '') + '</div></div>';
  const draw = () => {
    const list = tab === 'act' ? all.filter(f => famOn(f) > 0 || Date.now() - (f.lastGift || 0) < 864e5).sort((a, b) => famOn(b) - famOn(a)) : tab === 'new' ? all.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0)) : all;
    const fr = Object.entries(friends);
    m.querySelector('#fmBody').innerHTML =
      (fr.length ? '<div class="fm-card"><div class="fm-ct">أصدقائي بهذي العائلات (' + toAr(fr.length) + ')</div><div class="fm-fg">' + fr.map(([id, f]) => { const full = all.find(x => x.id === id) || f; return '<div class="fm-f" data-f="' + id + '">' + famCover(full, 76) + '<b>' + esc(full.name || '') + '</b><small>' + toAr(f.n) + ' صديق</small></div>'; }).join('') + '</div></div>' : '') +
      '<div class="fm-card"><div class="fm-ct">ترتيب العائلات</div><div class="fm-tabs"><button data-t="all"' + (tab === 'all' ? ' class="on"' : '') + '>الجميع (' + toAr(all.length) + ')</button><button data-t="act"' + (tab === 'act' ? ' class="on"' : '') + '>النشطة (' + toAr(all.filter(f => famOn(f) > 0 || Date.now() - (f.lastGift || 0) < 864e5).length) + ')</button><button data-t="new"' + (tab === 'new' ? ' class="on"' : '') + '>الجديدة</button></div>' +
      (list.length ? list.map((f, i) => (tab === 'all' && i < 3 ? row(f).replace('<div class="fm-r"', '<div class="fm-r top t' + i + '"') : row(f))).join('') : '<div class="empty"><div class="e">🏠</div><b>بعد ماكو عائلات</b><span>كون أول واحد يسوي عائلة</span></div>') + '</div>';
  };
  m.querySelector('#fmBody').onclick = e => { const t = e.target.closest('[data-t]'); if (t) { tab = t.dataset.t; return draw(); } const f = e.target.closest('[data-f]'); if (f) { m.close(); familyPage(f.dataset.f); } };
  const search = async () => {
    const q = m.querySelector('#fmQ').value.trim(); if (!q) return draw();
    let res = all.filter(f => (f.name || '').includes(q) || f.hid === q);
    if (!res.length) { try { const s = /^\d+$/.test(q) ? await db.collection('families').where('hid', '==', q).limit(5).get() : await db.collection('families').where('name', '>=', q).where('name', '<=', q + '').limit(10).get(); res = s.docs.map(d => Object.assign({ id: d.id }, d.data())); } catch (e) {} }
    m.querySelector('#fmBody').innerHTML = '<div class="fm-card"><div class="fm-ct">نتائج البحث</div>' + (res.length ? res.map(row).join('') : '<div class="empty"><span>ما لكينا عائلة بهذا الاسم أو الـ ID</span></div>') + '</div>';
  };
  m.querySelector('#fmGo').onclick = search; m.querySelector('#fmQ').onkeydown = e => { if (e.key === 'Enter') search(); };
  draw();
};

window.openCreateFamily = function (plaza) {
  const inFam = !!(ME.family && ME.family.id), dia = ME.diamonds || 0, okDia = dia >= FAM_COST, ok = !inFam && okDia;
  let emo = FAM_EMO[0], img = '';
  const m = modal('<div class="fc"><div class="fc-hd"><button class="rk-ic" id="fcBk">→</button><div class="fc-ban"><span id="fcBan">' + emo + '</span></div><b>إنشاء عائلة</b></div>' +
    '<div class="fc-card"><h4>شنو هي العائلة؟</h4><p><b>• تقربك من أصدقائك</b><br><small>العائلة تكدر تضم لحد ' + toAr(FAM_MAX) + ' شخص، ويبين اسمها وشعارها يم اسم كل عضو.</small></p><p><b>• حصالة العائلة</b><br><small>كل هدية يدزها أعضاء العائلة تنضاف لحصالتها، والعائلة يصعد مستواها وتتصدر الترتيب.</small></p></div>' +
    '<div class="fc-card"><h4>شروط إنشاء العائلة</h4><div class="fc-c"><span>ما تكون عضو بأي عائلة</span><b class="' + (inFam ? 'no' : 'ok') + '">' + (inFam ? '✗' : '✓') + '</b></div><div class="fc-c"><span>رسوم إنشاء العائلة ◆ ' + FAM_COST.toLocaleString('en') + ' ماسة</span><b class="' + (okDia ? 'ok' : 'no') + '">' + (okDia ? '✓' : fmtK(dia) + '/' + fmtK(FAM_COST)) + '</b></div></div>' +
    (ok ? '<div class="fc-card"><h4>معلومات العائلة</h4><div class="fc-img" id="fcImg"><span>📷</span><small>صورة العائلة (اختياري)</small></div><label class="l">اسم العائلة</label><input id="fN" maxlength="18" placeholder="مثلاً: عرش الملوك"><label class="l">الشعار</label><div class="opts" id="fE">' + FAM_EMO.map((e, i) => '<button data-e="' + e + '" class="' + (i ? '' : 'on') + '" style="font-size:22px">' + e + '</button>').join('') + '</div><label class="l">جملة العائلة</label><input id="fM" maxlength="40" placeholder="مثلاً: يد وحدة وقلب واحد"></div>' : '') +
    '<div class="fc-foot">' + (ok ? '<button class="btn btn-p" id="fGo">إنشاء العائلة · ◆ ' + FAM_COST.toLocaleString('en') + '</button>' : !okDia && !inFam ? '<button class="btn btn-p" id="fRc">💎 اشحن ماسات</button>' : '<button class="btn btn-s" disabled>ما تستوفي شروط الإنشاء</button>') + '</div></div>', 'full fcfull');
  m.querySelector('#fcBk').onclick = () => m.close();
  const rc = m.querySelector('#fRc'); if (rc) rc.onclick = () => { m.close(); openRecharge(); };
  if (!ok) return;
  m.querySelector('#fE').onclick = e => { const b = e.target.closest('button'); if (!b) return; emo = b.dataset.e; m.querySelector('#fcBan').textContent = emo; [...e.currentTarget.children].forEach(x => x.classList.toggle('on', x === b)); };
  m.querySelector('#fcImg').onclick = async () => { try { img = await pickImage({ size: 220, maxKB: 22 }); const el = m.querySelector('#fcImg'); el.style.backgroundImage = 'url(' + img + ')'; el.classList.add('has'); } catch (e) { if (e.message !== 'cancel') toast('ما كدرت أفتح الصورة'); } };
  m.querySelector('#fGo').onclick = async () => {
    const name = m.querySelector('#fN').value.trim(); if (name.length < 2) return toast('اكتب اسم العائلة');
    const b = m.querySelector('#fGo'); b.disabled = true;
    const ref = db.collection('families').doc(), me = db.collection('users').doc(ME.uid), hid = String(100000 + Math.floor(Math.random() * 900000));
    try {
      await db.runTransaction(async tx => { const d = (await tx.get(me)).data(); if ((d.diamonds || 0) < FAM_COST) throw new Error('nobal'); if (d.family && d.family.id) throw new Error('infam');
        tx.update(me, { diamonds: d.diamonds - FAM_COST, family: { id: ref.id, name, emoji: emo } });
        tx.set(ref, { name, emoji: emo, img, hid, motto: m.querySelector('#fM').value.trim(), owner: ME.uid, ownerName: ME.name, count: 1, total: 0, ts: Date.now(), on: { [ME.uid]: Date.now() } }); });
      ME.family = { id: ref.id, name, emoji: emo }; ME.diamonds = (ME.diamonds || 0) - FAM_COST;
      m.close(); if (plaza) plaza.close(); toast('🎉 انسوت عائلة ' + name); chime(true); familyPage(ref.id);
    } catch (e) { b.disabled = false; toast(e.message === 'nobal' ? 'ماساتك ما تكفي' : e.message === 'infam' ? 'إنت بعائلة هسه' : errMsg(e)); }
  };
};
window.createFamily = () => openCreateFamily();

window.familyPage = async function (fid) {
  let f, mem = [];
  try { const s = await db.collection('families').doc(fid).get(); if (!s.exists) return toast('العائلة انحلت'); f = s.data();
    const q = await db.collection('users').where('family.id', '==', fid).limit(60).get(); mem = q.docs.map(d => Object.assign({ uid: d.id }, d.data())).sort((a, b) => (b.uid === f.owner) - (a.uid === f.owner) || (b.sent || 0) - (a.sent || 0)); mem.forEach(u => u.vip = vipOf(u.recharged || 0));
  } catch (e) { return toast(errMsg(e)); }
  const mine = ME.family && ME.family.id === fid, boss = f.owner === ME.uid, on = f.on || {};
  const m = modal('<div class="fp-hd"' + (f.img ? ' style="--img:url(' + f.img + ')"' : '') + '>' + famCover(f, 96) + '<b>' + esc(f.name) + '</b><div class="fp-tags">' + famBadge(f) + (f.hid ? '<span class="fm-pill">ID ' + esc(f.hid) + '</span>' : '') + '</div>' + (f.motto ? '<small>«' + esc(f.motto) + '»</small>' : '') + '</div>' +
    '<div class="fp-st"><div><b>' + toAr(f.count || mem.length) + '/' + toAr(FAM_MAX) + '</b><small>الأعضاء</small></div><div><b>' + toAr(famOn(f)) + '</b><small>أونلاين</small></div><div><b>◆ ' + fmtK(f.total || 0) + '</b><small>الحصالة</small></div></div>' +
    '<div class="fp-lv"><span>مستوى ' + toAr(famLv(f.total)) + '</span><i><em style="width:' + Math.min(100, ((f.total || 0) % 1e5) / 1e3) + '%"></em></i></div>' +
    '<div class="fm-ct" style="margin:12px 0 4px">الأعضاء</div>' + mem.map(u => '<div class="ci" data-u="' + esc(u.uid) + '">' + avHtml(u, 44) + '<div class="ci-m"><div class="ci-n">' + nameHtml(u) + (u.uid === f.owner ? ' <span class="mb own">👑 الكبير</span>' : '') + '</div><div class="ci-l">⭐ ' + toAr(lvlOf(u.xp)) + ' · ◆ ' + fmtK(u.sent || 0) + (Date.now() - (on[u.uid] || 0) < 15 * 60000 ? ' · <span style="color:#2EDB6B">● أونلاين</span>' : '') + '</div></div></div>').join('') +
    (mine ? (boss ? '<button class="btn btn-s" id="fDel" style="color:var(--danger)">⛔ حل العائلة</button>' : '<button class="btn btn-s" id="fLeave" style="color:var(--danger)">🚪 اطلع من العائلة</button>') : (ME.family && ME.family.id ? '<p style="text-align:center;font-size:12px;color:var(--fg2)">لازم تطلع من عائلتك أول حتى تنضم لغيرها</p>' : '<button class="btn btn-p" id="fJoin">➕ انضم للعائلة</button>')), 'fpsh');
  m.querySelectorAll('[data-u]').forEach(el => el.onclick = () => { m.close(); userCard(el.dataset.u); });
  const ref = db.collection('families').doc(fid), me = db.collection('users').doc(ME.uid);
  const bt = (id, fn) => { const b = m.querySelector(id); if (b) b.onclick = fn; };
  bt('#fJoin', async () => {
    try { await db.runTransaction(async tx => { const d = (await tx.get(ref)).data(); if ((d.count || 0) >= FAM_MAX) throw new Error('full'); tx.update(ref, { count: (d.count || 0) + 1, ['on.' + ME.uid]: Date.now() }); tx.update(me, { family: { id: fid, name: d.name, emoji: d.emoji } }); });
      ME.family = { id: fid, name: f.name, emoji: f.emoji }; m.close(); toast('🎉 صرت من ' + f.name); notify(f.owner, 'family', 'انضم لعائلتك ' + f.name); } catch (e) { toast(e.message === 'full' ? 'العائلة مليانة' : errMsg(e)); }
  });
  bt('#fLeave', async () => { try { const b = db.batch(); b.update(ref, { count: FV.increment(-1), ['on.' + ME.uid]: FV.delete() }); b.update(me, { family: FV.delete() }); await b.commit(); ME.family = null; m.close(); toast('طلعت من العائلة'); } catch (e) { toast(errMsg(e)); } });
  bt('#fDel', () => { const c = modal('<h3>⛔ تحل العائلة؟</h3><p style="text-align:center;color:var(--fg2);font-size:13px">العائلة تنمسح، والماسات اللي دفعتها ما ترجع.</p><div class="row2"><button class="btn btn-s" id="cN">لا</button><button class="btn btn-p" id="cY" style="background:var(--danger)">إي، حلها</button></div>');
    c.querySelector('#cN').onclick = () => c.close();
    c.querySelector('#cY').onclick = async () => { c.close(); try { await ref.delete(); await me.update({ family: FV.delete() }); ME.family = null; m.close(); toast('انحلت العائلة'); } catch (e) { toast(errMsg(e)); } }; });
};
