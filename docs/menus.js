/* حجينه — سحب القوائم لجوه، صفحة البحث الكاملة، قائمة الروم بالمربعات */
'use strict';
/* ---------- اسحب أي قائمة لجوه حتى تتسكر ---------- */
(function () {
  const box = $('modals'); if (!box) return;
  const attach = ov => {
    const sh = ov.querySelector('.sheet'); if (!sh || sh.classList.contains('full')) return;
    let y0 = null, dy = 0, t0 = 0;
    sh.addEventListener('touchstart', e => { const fromHandle = e.target.closest('.handle,h3'); if (sh.scrollTop > 0 && !fromHandle) { y0 = null; return; } if (e.target.closest('input,textarea,select,input[type=range]')) { y0 = null; return; } y0 = e.touches[0].clientY; dy = 0; t0 = Date.now(); sh.style.transition = 'none'; }, { passive: true });
    sh.addEventListener('touchmove', e => { if (y0 === null) return; dy = e.touches[0].clientY - y0; if (dy < 0) { dy = 0; } if (dy > 0 && sh.scrollTop <= 0) { sh.style.transform = 'translateY(' + dy + 'px)'; ov.style.background = 'rgba(0,0,0,' + Math.max(0, .55 - dy / 600) + ')'; } }, { passive: true });
    sh.addEventListener('touchend', () => { if (y0 === null) return; y0 = null; sh.style.transition = 'transform .22s ease';
      const fast = dy > 40 && Date.now() - t0 < 250;
      if (dy > 110 || fast) { sh.style.transform = 'translateY(100%)'; setTimeout(() => ov.remove(), 200); } else { sh.style.transform = ''; ov.style.background = ''; } });
  };
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && n.classList.contains('ov') && attach(n)))).observe(box, { childList: true });
})();

/* ---------- صفحة البحث ---------- */
const recentQ = () => { try { return JSON.parse(localStorage.getItem('hj_sq') || '[]'); } catch (e) { return []; } };
const saveQ = q => { try { const a = recentQ().filter(x => x !== q); a.unshift(q); localStorage.setItem('hj_sq', JSON.stringify(a.slice(0, 8))); } catch (e) {} };
function sRoomRow(r) { const art = (typeof CAT_ART !== 'undefined' && CAT_ART[r.cat]) || ['coffee', '#FF8A1F', '#9A2E06'];
  return '<div class="sr-room" data-r="' + r.id + '"><div class="sr-art" style="background:linear-gradient(150deg,' + art[1] + ',' + art[2] + ')"><img src="ui/' + art[0] + '.webp" alt=""></div><div class="ci-m"><div class="ci-n">' + esc(r.title) + '</div><div class="ci-l">' + esc(r.ownerName || '') + ' · ID ' + r.id.slice(0, 6) + '</div></div>' + (isLive(r) ? '<span class="sr-live">👤 ' + toAr(Math.max(1, r.online || 0)) + '</span>' : '') + '</div>'; }
function sUserRow(u) { return '<div class="ci" data-u="' + esc(u.uid) + '">' + avHtml(u, 46) + '<div class="ci-m"><div class="ci-n">' + nameHtml(u) + '</div><div class="ci-l">ID: ' + esc(u.hid || '') + (u.city ? ' · ' + esc(u.city) : '') + '</div></div><span class="sr-go">‹</span></div>'; }
window.openSearch = function () {
  const m = modal('<div class="sr-top"><button class="sr-back" id="sBk">→</button><div class="sr-in"><span>🔍</span><input id="sq" placeholder="ابحث بالـ ID أو الاسم أو اسم الروم" autocomplete="off"><button id="sX" hidden>✕</button></div><button class="sr-go2" id="sGo">بحث</button></div>' +
    '<div class="tabs2 sr-tabs" hidden><button class="on" data-t="all">الكل</button><button data-t="u">الأشخاص</button><button data-t="r">الرومات</button></div><div id="sRes"></div>', 'full');
  const inp = m.querySelector('#sq'), box = m.querySelector('#sRes'), tabs = m.querySelector('.sr-tabs'); setTimeout(() => inp.focus(), 150);
  m.querySelector('#sBk').onclick = () => m.close();
  let last = { users: [], rooms: [] }, tab = 'all';
  const home = () => {
    tabs.hidden = true; const rq = recentQ();
    const hot = roomsData.filter(isLive).sort((a, b) => heat(b) - heat(a)).slice(0, 6);
    box.innerHTML = (rq.length ? '<div class="s-h">🕘 عمليات البحث الأخيرة <button class="sr-clr" id="sClr">مسح</button></div><div class="sr-chips">' + rq.map(q => '<button data-q="' + esc(q) + '">' + esc(q) + '</button>').join('') + '</div>' : '') +
      '<div class="s-h">🔥 رومات رائجة</div>' + (hot.length ? hot.map(sRoomRow).join('') : '<div class="empty"><span>ماكو رومات مباشرة هسه</span></div>');
    const c = box.querySelector('#sClr'); if (c) c.onclick = () => { try { localStorage.removeItem('hj_sq'); } catch (e) {} home(); };
  };
  const draw = () => {
    const { users, rooms } = last;
    const u = tab !== 'r' && users.length ? '<div class="s-h">👤 الأشخاص</div>' + users.map(sUserRow).join('') : '';
    const r = tab !== 'u' && rooms.length ? '<div class="s-h">🏠 الرومات</div>' + rooms.map(sRoomRow).join('') : '';
    box.innerHTML = (u + r) || '<div class="empty"><div class="e">🔍</div><b>ما لكينا شي</b><span>جرب الـ ID الكامل أو بداية الاسم</span></div>';
  };
  const run = async () => {
    const q = inp.value.trim(); if (!q) return home(); inp.blur(); saveQ(q);
    box.innerHTML = '<div class="empty">⏳ دا ندور...</div>'; let users = [];
    try {
      if (/^\d+$/.test(q)) { const s = await db.collection('users').where('hid', '==', q).limit(5).get(); users = s.docs.map(d => Object.assign({ uid: d.id }, d.data())); }
      else { const s = await db.collection('users').where('name', '>=', q).where('name', '<=', q + '').limit(15).get(); users = s.docs.map(d => Object.assign({ uid: d.id }, d.data())); }
    } catch (e) {}
    users.forEach(u => u.vip = vipOf(u.recharged || 0));
    const ql = q.toLowerCase();
    const rooms = roomsData.filter(r => !r.closed && ((r.title || '').toLowerCase().includes(ql) || r.id.toLowerCase().startsWith(ql) || (r.ownerName || '').includes(q))).sort((a, b) => isLive(b) - isLive(a)).slice(0, 15);
    last = { users, rooms }; tabs.hidden = false; draw();
  };
  inp.oninput = () => { m.querySelector('#sX').hidden = !inp.value; if (!inp.value) home(); };
  m.querySelector('#sX').onclick = () => { inp.value = ''; inp.oninput(); inp.focus(); };
  inp.onkeydown = e => { if (e.key === 'Enter') run(); };
  m.querySelector('#sGo').onclick = run;
  tabs.onclick = e => { const b = e.target.closest('button'); if (!b) return; tab = b.dataset.t; tabs.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); draw(); };
  box.onclick = e => { const q = e.target.closest('[data-q]'); if (q) { inp.value = q.dataset.q; inp.oninput(); return run(); }
    const u = e.target.closest('[data-u]'); if (u) { m.close(); return userCard(u.dataset.u); }
    const r = e.target.closest('[data-r]'); if (r) { m.close(); enterRoom(r.dataset.r); } };
  home();
};

/* ---------- قائمة الروم بالمربعات ---------- */
function gridMenu(title, items, sub) {
  const its = items.filter(Boolean);
  const m = modal((title ? '<h3>' + title + '</h3>' : '') + (sub || '') + '<div class="mg">' + its.map((it, i) => '<button data-i="' + i + '"' + (it.danger ? ' class="dg"' : '') + '><span style="background:' + (it.bg || 'rgba(255,255,255,.08)') + '">' + it.ic + '</span>' + it.t + '</button>').join('') + '</div>');
  m.querySelector('.mg').onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; m.close(); its[+b.dataset.i].f(); };
  return m;
}
const G = (a, b) => 'linear-gradient(135deg,' + a + ',' + b + ')';
window.openRoomMenu = function () {
  const d = R.data || {}, own = isOwner(), mod = isMod(), onSeat = R.mySeat !== -1, fav = FAVS.has(R.id);
  const share = () => { const t = 'تعال لرومي بحجينه: ' + d.title + ' — ID ' + R.id.slice(0, 6) + '\nhttps://hassean1999.github.io/hajina/';
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('📋 انسخ، دزه لأصدقائك')).catch(() => toast('ID الروم: ' + R.id.slice(0, 6))); };
  const sub = '<div class="mg-head">' + avHtml({ uid: d.ownerUid, name: d.ownerName, color: d.ownerColor }, 44) + '<div><b>' + esc(d.title || '') + '</b><small>ID ' + R.id.slice(0, 6) + ' · ' + esc(d.ownerName || '') + ' · 👤 ' + toAr(Math.max(1, d.online || 0)) + '</small></div></div>';
  const items = [
    { ic: fav ? '★' : '⭐', t: fav ? 'شيل من المفضلة' : 'المفضلة', bg: G('#FFD24A', '#E0A12A'), f: toggleFav },
    { ic: '📤', t: 'مشاركة', bg: G('#2E9BD6', '#173A78'), f: share },
    { ic: '👥', t: 'الموجودين', bg: G('#2EAD5B', '#0B4A26'), f: openMembers },
    { ic: '🏆', t: 'الداعمين', bg: G('#FF8A1F', '#9A2E06'), f: () => openRoomRank() },
    onSeat && { ic: '🎵', t: 'أغاني', bg: G('#B266FF', '#4A1680'), f: () => openMusic() },
    (own || onSeat) && { ic: '▶️', t: 'يوتيوب', bg: G('#FF4D4D', '#8A0A0A'), f: openYT },
    (own || mod) && { ic: '📢', t: 'إعلان الروم', bg: G('#1ABC9C', '#0B4A3E'), f: () => editNotice() },
    own && { ic: '⚔️', t: 'تحدي PK', bg: G('#E0457B', '#6A0A3A'), f: () => openPK() },
    own && { ic: '✏️', t: 'تعديل الروم', bg: G('#7F8C8D', '#2C3E50'), f: openCreate },
    own && { ic: '🖼️', t: 'الخلفية', bg: G('#9B59B6', '#3A1650'), f: () => setRoomImage('bg') },
    own && vipOf(ME.recharged || 0) >= 3 && { ic: '🎞️', t: 'صورة متحركة', bg: G('#F39C12', '#7A4A06'), f: () => setRoomImage('cover') },
    { ic: '🎮', t: 'الألعاب', bg: G('#2E7BD6', '#0F1D3D'), f: () => openGames() },
    !own && { ic: '🚩', t: 'إبلاغ', bg: G('#555', '#222'), f: () => { db.collection('reports').add({ room: R.id, by: ME.uid, ts: FV.serverTimestamp() }).catch(() => {}); toast('وصل البلاغ للإدارة، شكراً'); } },
    own && { ic: '⛔', t: 'سد الروم', danger: 1, bg: G('#E74C3C', '#7A0E0E'), f: confirmClose },
    { ic: '🚪', t: 'اطلع', bg: G('#555', '#222'), f: () => leaveRoom() }
  ];
  gridMenu('', items, sub);
};
function confirmClose() {
  const m = modal('<h3>⛔ تسد الروم؟</h3><p style="text-align:center;color:var(--fg2);font-size:13px">كل الموجودين راح يطلعون، وتكدر تفتحه مرة ثانية بعدين.</p><div class="row2"><button class="btn btn-s" id="ccN">لا</button><button class="btn btn-p" id="ccY" style="background:var(--danger)">إي، سده</button></div>');
  m.querySelector('#ccN').onclick = () => m.close();
  m.querySelector('#ccY').onclick = async () => { m.close(); await roomRef().update({ closed: true, seats: Array(10).fill(null), online: 0 }).catch(() => {}); leaveRoom(); };
}
