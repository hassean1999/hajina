/* حجينه — الشارات / الإشارات المكتسبة */
'use strict';

/* ═══════════════════════════════════════════════
   تعريف الشارات
   ═══════════════════════════════════════════════ */
const BADGES = [
  { id:'b_billionaire',  n:'البليونير',       e:'💎', cond: u => (u.diamonds||0) + (u.recharged||0) >= 1000000, desc:'شحن مليون ماسة' },
  { id:'b_luxury',       n:'الفخامة',          e:'👑', cond: u => (u.recharged||0) >= 100000, desc:'شحن 100 ألف ماسة' },
  { id:'b_dragon_slayer',n:'قاهر التنانين',    e:'🐉', cond: u => ((u.gw||{}).dragon||0) >= 100, desc:'إرسال 100 هدية تنين' },
  { id:'b_host',         n:'العريف',           e:'🎙️', cond: u => (u.rooms_created||0) >= 1, desc:'إنشاء روم واحد على الأقل' },
  { id:'b_generous',     n:'الكريم',           e:'🎁', cond: u => (u.sent||0) >= 10000, desc:'إرسال 10 آلاف نقطة هدايا' },
  { id:'b_charming',     n:'الساحر',           e:'✨', cond: u => (u.charm||0) >= 50000, desc:'جمع 50 ألف سحر' },
  { id:'b_veteran',      n:'المخضرم',          e:'🏅', cond: u => (u.created_at || Date.now()) < Date.now() - 180*86400000, desc:'عضو منذ 6 أشهر' },
  { id:'b_social',       n:'الاجتماعي',        e:'🤝', cond: u => (u.friends||0) >= 50, desc:'50 صديق' },
  { id:'b_vip',          n:'VIP',              e:'⭐', cond: u => (u.recharged||0) >= 5000, desc:'شحن 5000 ماسة' },
  { id:'b_roomclub5',    n:'ملك النادي',       e:'🏆', cond: u => (u.rcLv||0) >= 5, desc:'بلوغ ROOZ 5 في أي نادي' },
];

/* ── حساب الشارات المكتسبة ── */
function computeBadges(userData) {
  return BADGES.filter(b => { try { return b.cond(userData); } catch(e) { return false; } });
}

/* ── عرض شارة واحدة (مصغرة) ── */
function badgeChip(b) {
  return '<span class="bdg-chip" title="' + esc(b.desc) + '">' + b.e + ' ' + esc(b.n) + '</span>';
}

/* ── لوحة الشارات الكاملة ── */
function openBadges(uid) {
  const targetUid = uid || ME.uid;
  db.collection('users').doc(targetUid).get().then(s => {
    const data = s.data() || {};
    const earned  = computeBadges(data);
    const earnedIds = new Set(earned.map(b => b.id));
    const rows = BADGES.map(b => {
      const have = earnedIds.has(b.id);
      return '<div class="bdg-row' + (have ? ' earned' : '') + '">' +
        '<div class="bdg-ic">' + b.e + '</div>' +
        '<div class="bdg-info">' +
          '<b>' + esc(b.n) + '</b>' +
          '<small>' + esc(b.desc) + '</small>' +
        '</div>' +
        (have ? '<span class="bdg-tick">✓</span>' : '<span class="bdg-lock">🔒</span>') +
      '</div>';
    }).join('');
    modal(
      '<h3>🏅 الشارات</h3>' +
      '<p style="color:var(--fg2);font-size:12.5px">تُمنح تلقائياً عند استيفاء الشرط</p>' +
      '<div class="bdg-list">' + rows + '</div>'
    );
  }).catch(e => toast(errMsg(e)));
}
window.openBadges = openBadges;
window.computeBadges = computeBadges;
window.badgeChip = badgeChip;

/* ── Hook على userCard لإظهار الشارات ── */
const _ucBadge = window.userCard;
window.userCard = async function(uid) {
  if (_ucBadge) {
    _ucBadge.call(this, uid);
    /* نضيف الشارات بعد فتح البطاقة */
    setTimeout(async () => {
      try {
        const s = await db.collection('users').doc(uid || ME.uid).get();
        const bs = computeBadges(s.data() || {});
        const existing = document.querySelector('.uc-badges');
        if (existing || !bs.length) return;
        const slot = document.querySelector('.uc-name') || document.querySelector('.uc-wrap');
        if (!slot) return;
        const row = document.createElement('div');
        row.className = 'uc-badges';
        row.innerHTML = bs.slice(0, 4).map(badgeChip).join('');
        slot.insertAdjacentElement('afterend', row);
      } catch(e){}
    }, 300);
  }
};
