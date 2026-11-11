/* حجينه — ألبوم صور الملف الشخصي */
'use strict';

/* Firebase Storage متاح بعد إضافة firebase-storage-compat.js */
let _storage = null;
function getStorage() {
  if (!_storage) _storage = firebase.storage();
  return _storage;
}

/* ═══════════════════════════════════════════════
   فتح الألبوم (عرض + رفع)
   ═══════════════════════════════════════════════ */
async function openPhotoAlbum(uid, editable) {
  const isMe = !uid || uid === ME.uid;
  const targetUid = isMe ? ME.uid : uid;
  if (!targetUid) return;

  /* تحميل الصور */
  let photos = [];
  try {
    const doc = await db.collection('users').doc(targetUid).get();
    photos = (doc.data() || {}).photos || [];
  } catch (e) {}

  function renderGrid() {
    return photos.length
      ? photos.map((url, i) =>
          '<div class="pa-item">' +
            '<img src="' + esc(url) + '" alt="صورة ' + (i+1) + '" loading="lazy" onclick="openPhotoFull(\'' + esc(url) + '\')">' +
            (isMe ? '<button class="pa-del" data-i="' + i + '" title="حذف">✕</button>' : '') +
          '</div>'
        ).join('')
      : '<div class="pa-empty"><div>🖼️</div><span>لا توجد صور</span></div>';
  }

  const uploadBtn = isMe
    ? '<label class="btn pa-upload"><span>+ رفع صورة</span><input type="file" accept="image/*" id="paFile" hidden></label>'
    : '';
  const m = modal(
    '<div class="pa-wrap">' +
      '<div class="pa-head">' +
        '<h3>📷 ألبوم الصور</h3>' +
        uploadBtn +
      '</div>' +
      '<div class="pa-grid" id="paGrid">' + renderGrid() + '</div>' +
    '</div>'
  );

  /* حذف صورة */
  m.querySelector('#paGrid').addEventListener('click', async e => {
    const btn = e.target.closest('.pa-del');
    if (!btn) return;
    const idx = +btn.dataset.i;
    if (!confirm('حذف هذه الصورة؟')) return;
    /* حذف من Storage */
    const url = photos[idx];
    if (url && url.includes('firebasestorage')) {
      try { await getStorage().refFromURL(url).delete(); } catch (ex) {}
    }
    photos.splice(idx, 1);
    await db.collection('users').doc(ME.uid).update({ photos });
    m.querySelector('#paGrid').innerHTML = renderGrid();
    /* إعادة ربط أحداث الحذف */
    bindDel();
  });

  function bindDel() {
    m.querySelectorAll('.pa-del').forEach(btn => {
      btn.onclick = async () => {
        const idx = +btn.dataset.i;
        if (!confirm('حذف هذه الصورة؟')) return;
        const url = photos[idx];
        if (url && url.includes('firebasestorage')) {
          try { await getStorage().refFromURL(url).delete(); } catch (ex) {}
        }
        photos.splice(idx, 1);
        await db.collection('users').doc(ME.uid).update({ photos });
        m.querySelector('#paGrid').innerHTML = renderGrid();
        bindDel();
      };
    });
  }
  bindDel();

  /* رفع صورة جديدة */
  if (isMe) {
    m.querySelector('#paFile').onchange = async e => {
      const file = e.target.files[0];
      if (!file) return;
      if (photos.length >= 9) return toast('الحد الأقصى 9 صور');
      if (file.size > 5 * 1024 * 1024) return toast('الحجم الأقصى 5MB');
      toast('⏳ جاري الرفع...');
      try {
        const ref = getStorage().ref('photos/' + ME.uid + '/' + Date.now() + '_' + file.name.slice(-20));
        const snap = await ref.put(file);
        const url  = await snap.ref.getDownloadURL();
        photos.push(url);
        await db.collection('users').doc(ME.uid).update({ photos });
        m.querySelector('#paGrid').innerHTML = renderGrid();
        bindDel();
        toast('✓ تم رفع الصورة');
      } catch (err) {
        toast('فشل الرفع: ' + (err.message || err));
      }
      e.target.value = '';
    };
  }
}
window.openPhotoAlbum = openPhotoAlbum;

/* عرض صورة بالشاشة الكاملة */
window.openPhotoFull = function(url) {
  const m = modal(
    '<div class="pf-wrap">' +
      '<img src="' + esc(url) + '" alt="صورة" class="pf-img">' +
    '</div>',
    { noPad: true }
  );
};
