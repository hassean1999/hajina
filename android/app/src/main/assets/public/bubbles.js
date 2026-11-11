/* حجينه — فقاقيع الدردشة + بطاقات الملف الشخصي + علاقات CP */
'use strict';

/* ═══════════════════════════════════════════════
   فقاقيع الدردشة — نعيد رسم رسائل الروم بتصميم
   ═══════════════════════════════════════════════ */

/* أنواع البطاقات / الإطارات المتاحة */
const CARD_FRAMES = [
  { id:'cf_gold',    n:'الذهبي',     k:'sv', r:500, cls:'cf-gold' },
  { id:'cf_chess',   n:'الشطرنج',    k:'sv', r:350, cls:'cf-chess' },
  { id:'cf_ramadan', n:'رمضان',      k:'sv', r:300, cls:'cf-ramadan' },
  { id:'cf_cherry',  n:'الكرز',      k:'sv', r:400, cls:'cf-cherry' },
  { id:'cf_royal',   n:'الملكي',     k:'vip', r:2,  cls:'cf-royal' },
  { id:'cf_diamond', n:'الألماس',    k:'vip', r:3,  cls:'cf-diamond' },
];

/* إطار النيم بالشات حسب إطار البطاقة */
function nameBubbleCls(m) {
  if (!m.cf) return '';
  const f = CARD_FRAMES.find(x => x.id === m.cf);
  return f ? ' ' + f.cls : '';
}

/* override onRoomMsg لرسم الفقاقيع */
const _ormBub = window.onRoomMsg;
window.onRoomMsg = function(m) {
  /* نعيد رسم رسائل msg فقط بالشكل الجديد */
  if (m.type === 'msg') {
    if (R && R.seen && R.seen.has(m.id)) return; R && R.seen && R.seen.add(m.id);
    if (ME.blocked && ME.blocked.includes(m.uid)) return;
    const box = $('rmChat');
    const el  = document.createElement('div');
    const isMine = m.uid === ME.uid;
    el.className = 'bub-wrap' + (isMine ? ' me' : '');
    const avEl   = isMine ? '' : '<div class="bub-av" onclick="userCard(\'' + esc(m.uid) + '\')">' + avHtml(m, 32) + '</div>';
    const nameEl = isMine ? '' :
      '<div class="bub-name' + nameBubbleCls(m) + '" onclick="userCard(\'' + esc(m.uid) + '\')">' + nameHtml(m, true) + '</div>';
    el.innerHTML =
      avEl +
      '<div class="bub-col">' +
        nameEl +
        '<div class="bub' + (isMine ? ' bub-me' : '') + '">' + esc(m.text) + '</div>' +
      '</div>';
    box.appendChild(el);
    while (box.children.length > 80) box.firstChild.remove();
    box.scrollTop = box.scrollHeight;
    return;          /* لا نستدعي _ormBub لأننا تكفلنا بـ msg */
  }
  /* بقية الأنواع (join, gift, sys, react) تمشي على الكود الأصلي */
  if (_ormBub) _ormBub.call(this, m);
};

/* meLite يضيف cf */
const _mlBub = window.meLite;
window.meLite = function() {
  const o = _mlBub();
  if (ME.cf) o.cf = ME.cf;
  return o;
};

/* ═══════════════════════════════════════════════
   بطاقات الملف الشخصي — متجر الإطارات
   ═══════════════════════════════════════════════ */
function openFrameStore() {
  const my = (ME.owned || {});
  const rows = CARD_FRAMES.map(f => {
    const have   = my[f.id] && my[f.id] > Date.now();
    const active = ME.cf === f.id;
    const price  = f.k === 'vip' ? 'VIP' + f.r : '🪙 ' + toAr(f.r);
    return '<div class="fs-row' + (active ? ' act' : '') + '">' +
      '<div class="fs-prev ' + f.cls + '"><span>' + f.n + '</span></div>' +
      '<div class="fs-info"><b>' + esc(f.n) + '</b>' +
        (have ? '<small style="color:#2ECC71">✓ تملكه (7 أيام)</small>' : '<small>' + price + '</small>') +
      '</div>' +
      '<button class="btn btn-s fs-btn" data-fid="' + f.id + '">' +
        (active ? '✓ نشط' : have ? 'تفعيل' : 'شراء') +
      '</button>' +
    '</div>';
  }).join('');
  const m = modal(
    '<h3>🖼️ إطارات الملف الشخصي</h3>' +
    '<p style="color:var(--fg2);font-size:12.5px">يظهر إطارك في الروم والملف الشخصي</p>' +
    '<div class="fs-list">' + rows + '</div>'
  );
  m.querySelectorAll('.fs-btn').forEach(btn => {
    btn.onclick = async () => {
      const fid = btn.dataset.fid;
      const f   = CARD_FRAMES.find(x => x.id === fid);
      if (!f) return;
      const have = (ME.owned || {})[fid] && (ME.owned || {})[fid] > Date.now();
      /* تفعيل أو إلغاء */
      if (have || ME.cf === fid) {
        try {
          const nv = ME.cf === fid ? '' : fid;
          await db.collection('users').doc(ME.uid).update({ cf: nv });
          ME.cf = nv;
          toast(nv ? '✓ تم تفعيل الإطار' : 'تم إيقاف الإطار');
          m.close(); openFrameStore();
        } catch (ex) { toast(errMsg(ex)); }
        return;
      }
      /* شراء بالفضية */
      if (f.k === 'sv') {
        if ((ME.silver || 0) < f.r) return toast('عملاتك الفضية ما تكفي');
        try {
          await db.runTransaction(async tx => {
            const s  = await tx.get(db.collection('users').doc(ME.uid));
            const sv = (s.data() || {}).silver || 0;
            if (sv < f.r) throw new Error('nobal');
            tx.update(db.collection('users').doc(ME.uid), {
              silver: FV.increment(-f.r),
              ['owned.' + fid]: Date.now() + 7 * 86400000,
              cf: fid
            });
          });
          ME.silver = (ME.silver || 0) - f.r;
          if (!ME.owned) ME.owned = {};
          ME.owned[fid] = Date.now() + 7 * 86400000;
          ME.cf = fid;
          toast('✓ تم شراء إطار «' + f.n + '» وتفعيله');
          m.close(); openFrameStore();
        } catch (ex) { toast(errMsg(ex)); }
        return;
      }
      /* VIP */
      if (vipOf(ME.recharged || 0) < f.r) return toast('هذا الإطار يحتاج VIP' + f.r);
      try {
        await db.collection('users').doc(ME.uid).update({ cf: fid });
        ME.cf = fid;
        toast('✓ تم تفعيل إطار «' + f.n + '»');
        m.close(); openFrameStore();
      } catch (ex) { toast(errMsg(ex)); }
    };
  });
}

/* ═══════════════════════════════════════════════
   علاقات CP — اقتران زوجي / صديق مقرب
   ═══════════════════════════════════════════════ */
function openCpPanel(targetUid) {
  const myCP = ME.cp || null;
  if (myCP) {
    /* عرض البطاقة المشتركة */
    db.collection('users').doc(myCP).get().then(s => {
      const p = s.data() || {};
      const m = modal(
        '<div class="cp-card">' +
          '<div class="cp-hearts">❤️</div>' +
          '<div class="cp-pair">' +
            '<div class="cp-side">' + avHtml(ME, 64) + '<div class="cp-sname">' + esc(ME.name || '') + '</div></div>' +
            '<div class="cp-mid">💑</div>' +
            '<div class="cp-side">' + avHtml(p, 64) + '<div class="cp-sname">' + esc(p.name || '') + '</div></div>' +
          '</div>' +
          (ME.cpPhoto ? '<img class="cp-photo" src="' + esc(ME.cpPhoto) + '" alt="صورة CP">' : '') +
          '<button class="btn btn-s" id="cpBreak" style="margin-top:14px;border-color:#E8384D;color:#E8384D">إنهاء العلاقة</button>' +
        '</div>'
      );
      m.querySelector('#cpBreak').onclick = async () => {
        if (!confirm('هل تريد إنهاء علاقة CP؟')) return;
        try {
          await db.batch()
            .update(db.collection('users').doc(ME.uid), { cp: '', cpPhoto: '' })
            .update(db.collection('users').doc(myCP), { cp: '', cpPhoto: '' })
            .commit();
          ME.cp = ''; ME.cpPhoto = '';
          toast('تم إنهاء العلاقة');
          m.close();
        } catch (e) { toast(errMsg(e)); }
      };
    });
    return;
  }
  if (!targetUid || targetUid === ME.uid) return toast('اختر شخص أول لطلب CP');
  /* إرسال طلب CP */
  const confirmHtml =
    '<div style="text-align:center;padding:8px 0 14px">' +
      '<div style="font-size:38px;margin-bottom:8px">💑</div>' +
      '<b style="font-size:16px">طلب علاقة CP</b>' +
      '<p style="color:var(--fg2);font-size:13px;margin-top:6px">سيصلهم إشعار بالطلب</p>' +
      '<button class="btn" id="cpSend" style="margin-top:12px;width:100%">إرسال الطلب ❤️</button>' +
    '</div>';
  const m = modal(confirmHtml);
  m.querySelector('#cpSend').onclick = async () => {
    try {
      await db.collection('users').doc(targetUid)
        .collection('notifs').add({
          type: 'cp_req', from: ME.uid, fromName: ME.name, fromAv: ME.av || '',
          ts: FV.serverTimestamp()
        });
      toast('✓ تم إرسال طلب CP');
      m.close();
    } catch (e) { toast(errMsg(e)); }
  };
}

/* قبول / رفض طلب CP من الإشعارات */
window.acceptCpReq = async function(fromUid) {
  if (ME.cp) return toast('أنت مرتبط فعلاً بشخص آخر');
  try {
    const s = await db.collection('users').doc(fromUid).get();
    if (!s.exists) return toast('المستخدم غير موجود');
    await db.batch()
      .update(db.collection('users').doc(ME.uid),  { cp: fromUid })
      .update(db.collection('users').doc(fromUid), { cp: ME.uid })
      .commit();
    ME.cp = fromUid;
    toast('🎉 تم الاقتران! أنتم الآن CP ❤️');
  } catch (e) { toast(errMsg(e)); }
};
