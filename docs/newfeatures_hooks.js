/* حجينه — ربط الميزات الجديدة بالواجهة الموجودة */
'use strict';

/* ═══════════════════════════════════════════════
   زر "نادي الروم + ألعاب الروم" في قائمة الروم
   ═══════════════════════════════════════════════ */
const _openRoomMenu = window.openRoomMenu;
window.openRoomMenu = function() {
  /* استدعاء القائمة الأصلية أولاً */
  if (_openRoomMenu) _openRoomMenu.call(this);
  /* إضافة أزرار الميزات الجديدة */
  setTimeout(() => {
    const modal = document.querySelector('.modal-box');
    if (!modal) return;
    const extra = document.createElement('div');
    extra.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-top:8px;border-top:1px solid rgba(255,255,255,.08);padding-top:10px;';
    extra.innerHTML =
      '<button class="btn btn-s" id="_nf_club">🏆 نادي الروم والمهام</button>' +
      '<button class="btn btn-s" id="_nf_wg">🔤 لعبة تخمين الكلمات</button>' +
      '<button class="btn btn-s" id="_nf_vg">🎙️ لعبة تخمين الصوت</button>';
    modal.appendChild(extra);
    extra.querySelector('#_nf_club').onclick = () => { closeTopModal(); openRoomClub(); };
    extra.querySelector('#_nf_wg').onclick   = () => { closeTopModal(); openWordGame(); };
    extra.querySelector('#_nf_vg').onclick   = () => { closeTopModal(); openVoiceGame(); };
  }, 80);
};

/* ═══════════════════════════════════════════════
   hook على ucHook لإضافة ألبوم + شارات + CP
   ═══════════════════════════════════════════════ */
const _prevUcHook = window.ucHook;
window.ucHook = function(m, u) {
  if (_prevUcHook) _prevUcHook.call(this, m, u);
  const isMe = u.uid === ME.uid;

  /* ── الشارات ── */
  if (window.computeBadges) {
    const bs = computeBadges(u);
    if (bs.length) {
      const bdgRow = document.createElement('div');
      bdgRow.className = 'uc-badges';
      bdgRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;padding:6px 0 2px;cursor:pointer';
      bdgRow.innerHTML = bs.slice(0, 4).map(badgeChip).join('');
      bdgRow.title = 'عرض كل الشارات';
      bdgRow.onclick = () => openBadges(u.uid);
      const bioEl = m.querySelector('.uc-bio') || m.querySelector('.pf-id');
      if (bioEl) bioEl.insertAdjacentElement('afterend', bdgRow);
    }
  }

  /* ── ألبوم الصور ── */
  if (window.openPhotoAlbum && (u.photos || []).length) {
    const photos = (u.photos || []).slice(0, 6);
    const grid = document.createElement('div');
    grid.className = 'uc-album';
    grid.innerHTML = photos.map((url, i) =>
      i < 5
        ? '<img src="' + esc(url) + '" alt="صورة" onclick="openPhotoFull(\'' + esc(url) + '\')">'
        : '<div class="uc-album-more" onclick="openPhotoAlbum(\'' + esc(u.uid) + '\')">+' + ((u.photos||[]).length - 5) + '</div>'
    ).join('');
    m.querySelector('.uc').appendChild(grid);
  }

  /* ── أزرار: ألبوم، شارات، CP ── */
  const extraBtns = document.createElement('div');
  extraBtns.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;';
  if (window.openPhotoAlbum) {
    const ab = document.createElement('button');
    ab.className = 'btn btn-s';
    ab.textContent = '📷 الألبوم';
    ab.onclick = () => openPhotoAlbum(u.uid, isMe);
    extraBtns.appendChild(ab);
  }
  if (window.openBadges) {
    const bb = document.createElement('button');
    bb.className = 'btn btn-s';
    bb.textContent = '🏅 الشارات';
    bb.onclick = () => openBadges(u.uid);
    extraBtns.appendChild(bb);
  }
  if (window.openCpPanel && !isMe) {
    const cb = document.createElement('button');
    cb.className = 'btn btn-s';
    cb.style.cssText = 'border-color:#E8384D;color:#E8384D';
    cb.textContent = '💑 CP';
    cb.onclick = () => openCpPanel(u.uid);
    extraBtns.appendChild(cb);
  }
  if (extraBtns.children.length) m.querySelector('.uc').appendChild(extraBtns);

  /* ── CP Badge ── */
  if (u.cp && window.openCpPanel) {
    const cpBadge = document.createElement('div');
    cpBadge.className = 'cp-badge';
    cpBadge.innerHTML = '❤️ CP';
    cpBadge.onclick = () => openCpPanel(u.uid);
    const nameEl = m.querySelector('.pf-name');
    if (nameEl) nameEl.insertAdjacentElement('afterend', cpBadge);
  }
};

/* ═══════════════════════════════════════════════
   زر متجر مؤثرات الدخول + الإطارات في المتجر
   ═══════════════════════════════════════════════ */
const _prevOpenStore = window.openStore;
window.openStore = function(tab, sub) {
  if (_prevOpenStore) _prevOpenStore.apply(this, arguments);
  /* إضافة تبويبات للمتجر بعد فتحه */
  setTimeout(() => {
    const existing = document.querySelector('#_nf_storeExtra');
    if (existing) return;
    const modal = document.querySelector('.modal-box');
    if (!modal) return;
    const row = document.createElement('div');
    row.id = '_nf_storeExtra';
    row.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;padding:10px 0 0;border-top:1px solid rgba(255,255,255,.08);margin-top:8px;';
    row.innerHTML =
      '<button class="btn btn-s" id="_nf_entStore">🎭 مؤثرات الدخول</button>' +
      '<button class="btn btn-s" id="_nf_frStore">🖼️ إطارات الملف</button>' +
      '<button class="btn btn-s" id="_nf_knife">🗡️ تحدي السكاكين</button>';
    modal.appendChild(row);
    row.querySelector('#_nf_entStore').onclick = () => { closeTopModal(); openEntStore(); };
    row.querySelector('#_nf_frStore').onclick  = () => { closeTopModal(); openFrameStore(); };
    row.querySelector('#_nf_knife').onclick    = () => {
      closeTopModal();
      const seated = R && R.data && (R.data.seats||[]).filter(s=>s&&s.uid!==ME.uid);
      if (!seated || !seated.length) return toast('لازم يكون أحد على المايك');
      openKnifeGame(seated[0].uid);
    };
  }, 100);
};
