/* حجينه — بطاقة الشخص الجديدة (مثل البرامج الكبيرة) */
'use strict';
const MEDALS = [
  { k: 'vip', n: 'نبيل VIP', i: 'fx/crown', ok: u => (u.vip || 0) >= 1, r: 'اشحن وصير VIP' },
  { k: 'lv10', n: 'نجم صاعد', i: 'fx/gstar', ok: u => lvlOf(u.xp) >= 10, r: 'وصل المستوى ١٠' },
  { k: 'lv25', n: 'أسطورة', i: 'fx/comet', ok: u => lvlOf(u.xp) >= 25, r: 'وصل المستوى ٢٥' },
  { k: 'sup', n: 'داعم كريم', i: 'fx/gem', ok: u => (u.sent || 0) >= 10000, r: 'ادعم بـ ١٠ آلاف ماسة' },
  { k: 'sup2', n: 'ملك الدعم', i: 'fx/dragon', ok: u => (u.sent || 0) >= 100000, r: 'ادعم بـ ١٠٠ ألف ماسة' },
  { k: 'charm', n: 'محبوب', i: 'fx/heart', ok: u => (u.charm || 0) >= 10000, r: 'اجمع ١٠ آلاف جاذبية' },
  { k: 'charm2', n: 'نجم الرومات', i: 'fx/sun', ok: u => (u.charm || 0) >= 100000, r: 'اجمع ١٠٠ ألف جاذبية' },
  { k: 'fans', n: 'مشهور', i: 'fx/sparkles', ok: u => (u.followers || 0) >= 100, r: '١٠٠ متابع' },
  { k: 'fam', n: 'ابن العائلة', i: 'fx/clover', ok: u => !!u.family, r: 'انضم لعائلة' },
  { k: 'streak', n: 'المواظب', i: 'fx/fire', ok: u => (u.streak || 0) >= 7, r: 'ادخل ٧ أيام ورا بعض' }
];
function openMedals(u) {
  const got = MEDALS.filter(x => x.ok(u));
  modal('<h3>🏅 جدار الأوسمة</h3><p style="text-align:center;color:var(--fg2);font-size:12.5px;margin:-4px 0 10px">' + esc(u.name) + ' فعّل ' + toAr(got.length) + ' من ' + toAr(MEDALS.length) + '</p><div class="md-g">' +
    MEDALS.map(x => { const ok = x.ok(u); return '<div class="md' + (ok ? ' on' : '') + '"><span><img src="' + x.i + '.webp" alt=""></span><b>' + x.n + '</b><small>' + (ok ? '✅ مفعّل' : x.r) + '</small></div>'; }).join('') + '</div>');
}
window.userCard = async function (uid) {
  let u; try { const s = await db.collection('users').doc(uid).get(); u = Object.assign({ uid }, s.data() || { name: '؟' }); } catch (e) { return toast(errMsg(e)); }
  u.vip = vipOf(u.recharged || 0);
  const self = uid === ME.uid, inRoom = !!R.id;
  let following = false;
  if (!self) { try { following = (await db.collection('users').doc(ME.uid).collection('following').doc(uid).get()).exists; } catch (e) {} }
  const seated = inRoom && (R.data.seats || []).some(s => s && s.uid === uid);
  const owner = inRoom && R.data.ownerUid === uid, adm = inRoom && (R.data.admins || []).includes(uid);
  const gw = Object.entries(u.gw || {}).filter(([, n]) => n > 0).map(([k, n]) => [giftBy(k), n]).filter(([g]) => g).sort((a, b) => b[0].p - a[0].p);
  const kinds = gw.length, medals = MEDALS.filter(x => x.ok(u));
  const roomSup = inRoom && R.data.sup && R.data.sup[uid] ? R.data.sup[uid].v || 0 : 0;
  const badges = [
    owner ? '<span class="ux-b own">🏠 صاحب الروم</span>' : adm ? '<span class="ux-b adm">🛡️ مشرف</span>' : '',
    seated ? '<span class="ux-b mic">🎙️ عالمايك</span>' : '',
    '<span class="ux-b lv">⭐ ' + toAr(lvlOf(u.xp)) + '</span>',
    u.vip ? '<span class="ux-b vip v' + u.vip + '">👑 VIP' + u.vip + '</span>' : '',
    u.city ? '<span class="ux-b city">🇮🇶 ' + esc(u.city) + '</span>' : '',
    u.family && u.family.name ? '<span class="ux-b fam">' + esc(u.family.emoji || '🏠') + ' ' + esc(u.family.name) + '</span>' : ''
  ].join('');
  const m = modal('<div class="ux-cov"></div><div class="ux-top">' +
    (inRoom && !self ? '<button class="ux-ic" id="uxAt" title="منشن">@</button>' : '<span></span>') +
    '<div class="ux-av">' + avHtml(u, 92) + (u.online || seated ? '<i class="ux-dot"></i>' : '') + '</div>' +
    (self ? '<span></span>' : '<button class="ux-more" id="uxMore">⋯<small>بلاغ وأخرى</small></button>') + '</div>' +
    '<div class="ux-name">' + nameHtml(u, true) + '</div>' +
    '<div class="ux-id" id="uxId">ID: ' + esc(u.hid || '') + ' <span>⧉</span></div>' +
    (u.bio ? '<div class="ux-bio">' + esc(u.bio) + '</div>' : '') +
    '<div class="ux-bs">' + badges + '</div>' +
    '<div class="ux-st"><div class="c1" id="uxS1"><img src="fx/gem.webp" alt=""><small>المساهمة</small><b>' + fmtK(u.sent || 0) + '</b></div>' +
    '<div class="c2" id="uxS2"><img src="fx/heart.webp" alt=""><small>الكاريزما</small><b>' + fmtK(u.charm || 0) + '</b></div>' +
    '<div class="c3" id="uxS3"><img src="fx/sparkles.webp" alt=""><small>المعجبون</small><b>' + fmtK(u.followers || 0) + '</b></div></div>' +
    (roomSup ? '<div class="ux-rs">🏆 دعم هذا الروم: <b>' + fmtK(roomSup) + '</b></div>' : '') +
    '<div class="ux-wall" id="uxGW"><div><b>جدار الهدايا</b><small>' + (kinds ? toAr(kinds) + ' نوع هدية · ' + Math.round(kinds / GIFTS.length * 100) + '%' : 'بعد ما وصلته هدايا') + '</small></div><div class="ux-ims">' + gw.slice(0, 3).map(([g]) => '<img src="' + gArt(g) + '" alt="">').join('') + '</div><span class="ux-ar">‹</span></div>' +
    '<div class="ux-wall" id="uxMD"><div><b>جدار الأوسمة</b><small>' + (medals.length ? 'تم تفعيل ' + toAr(medals.length) : 'بعد ما فعّل أوسمة') + '</small></div><div class="ux-ims">' + medals.slice(0, 3).map(x => '<img src="' + x.i + '.webp" alt="">').join('') + '</div><span class="ux-ar">‹</span></div>' +
    (self ? '<div class="ux-act">' + (R.mySeat !== -1 && seated ? '<button class="ux-main" id="ucDown">⬇️ انزل من المايك</button>' : '<button class="ux-main" id="uxEdit">✏️ تعديل ملفي</button>') + '</div>'
      : '<div class="ux-act">' + (inRoom ? '<button class="ux-sq gift" id="ucG">🎁</button>' : '') + '<button class="ux-sq" id="ucM">💬</button><button class="ux-main' + (following ? ' on' : '') + '" id="ucF">' + (following ? '✓ تتابعه' : '+ متابعة') + '</button></div>'), 'ucx');
  const cv = covOf ? covOf(u) : null;
  if (cv) applyCover(m.querySelector('.ux-cov'), u); else m.querySelector('.ux-cov').classList.add('plain');
  const on = (id, f) => { const b = m.querySelector(id); if (b) b.onclick = f; };
  on('#uxId', () => { (navigator.clipboard ? navigator.clipboard.writeText(u.hid || '') : Promise.reject()).then(() => toast('📋 انسخ الـ ID')).catch(() => {}); });
  on('#uxS2', () => { m.close(); openCharm(uid); });
  on('#uxS3', () => { m.close(); openPeople('followers', uid); });
  on('#uxS1', () => toast('المساهمة: كل الماسات اللي دزها ' + u.name + ' هدايا'));
  on('#uxGW', () => { m.close(); openCharm(uid); });
  on('#uxMD', () => openMedals(u));
  on('#uxEdit', () => { m.close(); openEdit && openEdit(); });
  on('#ucDown', () => { m.close(); leaveSeat(); });
  on('#ucF', async () => { m.close(); await toggleFollow(u, following); });
  on('#ucM', () => { m.close(); openDM(u); });
  on('#ucG', () => { m.close(); openGifts(uid); });
  on('#uxAt', () => { m.close(); openSay(); const i = $('sayInput'); i.value = '@' + u.name + ' '; i.focus(); });
  on('#uxMore', () => {
    const mm = modal('<h3>' + esc(u.name) + '</h3>' + (window.modButtons ? modButtons(u, seated) : '') + '<div class="list" style="margin:0"><div class="li" id="umR"><span class="ic">🚩</span>إبلاغ عن الحساب</div><div class="li" id="umB"><span class="ic">🚫</span>' + ((ME.blocked || []).includes(uid) ? 'فك الحظر' : 'حظر') + '</div><div class="li" id="umC"><span class="ic">📋</span>نسخ الـ ID</div></div>');
    if (window.bindModButtons) bindModButtons(mm, u);
    on2(mm, '#umR', () => { mm.close(); m.close(); reportUser(u); }); on2(mm, '#umB', () => { mm.close(); m.close(); toggleBlock(u); });
    on2(mm, '#umC', () => { mm.close(); (navigator.clipboard ? navigator.clipboard.writeText(u.hid || '') : Promise.reject()).then(() => toast('📋 انسخ')).catch(() => {}); });
  });
};
