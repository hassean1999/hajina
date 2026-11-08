/* حجينه — اللحظات، الإشعارات، حائط الهدايا، الحظر */
'use strict';
const ago = t => { const s = Math.floor((Date.now() - (t || Date.now())) / 1000); if (s < 60) return 'هسه'; if (s < 3600) return 'قبل ' + toAr(Math.floor(s / 60)) + ' دقيقة'; if (s < 86400) return 'قبل ' + toAr(Math.floor(s / 3600)) + ' ساعة'; return 'قبل ' + toAr(Math.floor(s / 86400)) + ' يوم'; };
const blockedSet = () => new Set((ME && ME.blocked) || []);

/* ---------- الإشعارات ---------- */
window.notify = function (uid, t, text, extra) {
  if (!uid || uid === ME.uid) return;
  db.collection('users').doc(uid).collection('notifs').add(Object.assign({ t, text, from: meLite(), ts: Date.now(), read: false }, extra || {})).catch(() => {});
};
let notifUnsub = null, NOTIFS = [];
window.startNotifs = function () {
  if (notifUnsub) notifUnsub();
  notifUnsub = db.collection('users').doc(ME.uid).collection('notifs').orderBy('ts', 'desc').limit(40).onSnapshot(s => {
    const prevTop = NOTIFS[0] && NOTIFS[0].id; NOTIFS = s.docs.map(d => Object.assign({ id: d.id }, d.data()));
    const un = NOTIFS.filter(n => !n.read).length, b = $('ntBadge'); b.hidden = !un; b.textContent = un > 9 ? '9+' : un;
    if (prevTop && NOTIFS[0] && NOTIFS[0].id !== prevTop && !NOTIFS[0].read) { sfx(880, .12, 'sine', .06); toast('🔔 ' + NOTIFS[0].from.name + ' ' + NOTIFS[0].text); }
  }, () => {});
};
const NT_IC = { follow: '👤', gift: '🎁', like: '❤️', comment: '💬', family: '👨‍👩‍👧', admin: '🛡️', room: '🎙️' };
window.openNotifs = function () {
  const m = modal('<h3>🔔 الإشعارات</h3>' + (NOTIFS.length ? NOTIFS.map(n => '<div class="ci nt' + (n.read ? '' : ' un') + '" data-u="' + esc(n.from.uid) + '" data-p="' + esc(n.post || '') + '">' + avHtml(n.from, 42) + '<div class="ci-m"><div class="ci-l" style="color:var(--fg);white-space:normal"><b>' + nameHtml(n.from, true) + '</b> ' + esc(n.text) + '</div><div class="ci-t">' + ago(n.ts) + '</div></div><span style="font-size:20px">' + (NT_IC[n.t] || '🔔') + '</span></div>').join('') : '<div class="empty"><div class="e">🔔</div><b>ماكو إشعارات</b><span>من أحد يتابعك أو يهديك تلكاها هنا</span></div>'));
  m.querySelectorAll('[data-u]').forEach(el => el.onclick = () => { m.close(); el.dataset.r ? enterRoom(el.dataset.r) : el.dataset.p ? openPost(el.dataset.p) : userCard(el.dataset.u); });
  const un = NOTIFS.filter(n => !n.read); if (un.length) { const b = db.batch(); un.slice(0, 40).forEach(n => b.update(db.collection('users').doc(ME.uid).collection('notifs').doc(n.id), { read: true })); b.commit().catch(() => {}); }
};

/* ---------- اللحظات ---------- */
let postsUnsub = null, POSTS = [];
window.startMoments = function () {
  if (postsUnsub) return;
  postsUnsub = db.collection('posts').orderBy('ts', 'desc').limit(40).onSnapshot(s => { POSTS = s.docs.map(d => Object.assign({ id: d.id }, d.data())); renderPosts(); }, e => toast(errMsg(e)));
};
function postHtml(p) {
  const liked = (p.likes || []).includes(ME.uid), u = p.u || {};
  return '<div class="post" data-id="' + p.id + '"><div class="post-h" data-u="' + esc(u.uid) + '">' + avHtml(u, 42) + '<div style="flex:1;min-width:0"><b>' + nameHtml(u) + '</b><small>' + ago(p.ts) + '</small></div>' + (u.uid === ME.uid || ME.admin ? '<button class="post-del" data-del="' + p.id + '">⋯</button>' : '') + '</div>' +
    (p.text ? '<div class="post-t">' + esc(p.text) + '</div>' : '') + (p.img ? '<img class="post-img" src="' + p.img + '" alt="" loading="lazy">' : '') +
    '<div class="post-a"><button data-like="' + p.id + '" class="' + (liked ? 'on' : '') + '">' + (liked ? '❤️' : '🤍') + ' ' + toAr(p.likeN || 0) + '</button><button data-com="' + p.id + '">💬 ' + toAr(p.comN || 0) + '</button></div></div>';
}
function renderPosts() {
  const bl = blockedSet(), list = POSTS.filter(p => !bl.has((p.u || {}).uid));
  $('postsList').innerHTML = list.length ? list.map(postHtml).join('') : '<div class="empty"><div class="e">📸</div><b>ماكو لحظات بعد</b><span>كون أول واحد ينشر صورة أو كلام</span></div>';
}
$('postsList').onclick = e => {
  const t = e.target.closest('[data-like],[data-com],[data-del],[data-u]'); if (!t) return;
  if (t.dataset.like) return likePost(t.dataset.like);
  if (t.dataset.com) return openPost(t.dataset.com);
  if (t.dataset.del) return delPost(t.dataset.del);
  if (t.dataset.u) return userCard(t.dataset.u);
};
window.openCompose = function () {
  let img = '';
  const m = modal('<h3>📸 نشر لحظة</h3><textarea id="pT" rows="4" maxlength="500" placeholder="شنو ببالك؟"></textarea><div id="pImg"></div><div class="row2"><button class="btn btn-s" id="pPick">🖼️ صورة</button><button class="btn btn-p" id="pGo">نشر</button></div>');
  m.querySelector('#pPick').onclick = async () => { try { img = await pickImage({ size: 1000, maxKB: 260 }); m.querySelector('#pImg').innerHTML = '<img src="' + img + '" class="post-img" alt="">'; } catch (e) {} };
  m.querySelector('#pGo').onclick = async () => {
    const text = m.querySelector('#pT').value.trim(); if (!text && !img) return toast('اكتب شي أو اختار صورة');
    m.querySelector('#pGo').disabled = true;
    try { await db.collection('posts').add({ u: meLite(), text: text.slice(0, 500), img, ts: Date.now(), likes: [], likeN: 0, comN: 0 }); m.close(); toast('✅ انشرت'); } catch (e) { toast(errMsg(e)); m.querySelector('#pGo').disabled = false; }
  };
};
async function likePost(id) {
  const p = POSTS.find(x => x.id === id); if (!p) return; const liked = (p.likes || []).includes(ME.uid);
  try { await db.collection('posts').doc(id).update({ likes: liked ? FV.arrayRemove(ME.uid) : FV.arrayUnion(ME.uid), likeN: FV.increment(liked ? -1 : 1) }); if (!liked) { sfx(880, .1, 'sine', .05); notify(p.u.uid, 'like', 'عجبته لحظتك', { post: id }); } } catch (e) { toast(errMsg(e)); }
}
async function delPost(id) {
  const m = modal('<h3>اللحظة</h3><button class="btn btn-s" id="dpY" style="color:var(--danger)">🗑️ امسح اللحظة</button>');
  m.querySelector('#dpY').onclick = async () => { m.close(); await db.collection('posts').doc(id).delete().catch(e => toast(errMsg(e))); };
}
window.openPost = async function (id) {
  let p = POSTS.find(x => x.id === id);
  if (!p) { try { const s = await db.collection('posts').doc(id).get(); if (!s.exists) return toast('اللحظة انمسحت'); p = Object.assign({ id }, s.data()); } catch (e) { return toast(errMsg(e)); } }
  const m = modal('<div class="post" style="margin:0">' + postHtml(p).replace(/^<div class="post"[^>]*>/, '').replace(/<\/div>$/, '') + '</div><div style="font-weight:900">💬 التعليقات</div><div id="cmL"><div class="empty">...</div></div><form class="row2" id="cmF"><input id="cmI" maxlength="200" placeholder="اكتب تعليق..." autocomplete="off"><button class="btn btn-p" style="width:70px">➤</button></form>');
  const ref = db.collection('posts').doc(id).collection('comments'), bl = blockedSet();
  const load = async () => { const s = await ref.orderBy('ts', 'asc').limit(100).get(); const l = s.docs.map(d => d.data()).filter(c => !bl.has(c.u.uid)); m.querySelector('#cmL').innerHTML = l.length ? l.map(c => '<div class="cm-row">' + avHtml(c.u, 30) + '<div><b>' + nameHtml(c.u, true) + '</b><p>' + esc(c.text) + '</p><small>' + ago(c.ts) + '</small></div></div>').join('') : '<div style="color:var(--fg3);font-size:13px;text-align:center">ماكو تعليقات، كون الأول</div>'; };
  load().catch(() => {});
  m.querySelector('#cmF').onsubmit = async e => { e.preventDefault(); const t = m.querySelector('#cmI').value.trim(); if (!t) return; m.querySelector('#cmI').value = '';
    try { await ref.add({ u: meLite(), text: t.slice(0, 200), ts: Date.now() }); await db.collection('posts').doc(id).update({ comN: FV.increment(1) }); notify(p.u.uid, 'comment', 'علّق على لحظتك: ' + t.slice(0, 40), { post: id }); load(); } catch (er) { toast(errMsg(er)); } };
  m.querySelectorAll('[data-like]').forEach(b => b.onclick = () => { m.close(); likePost(id); });
};

/* ---------- حائط الهدايا ---------- */
window.giftWall = function (u) {
  const gw = Object.entries(u.gw || {}).filter(([, n]) => n > 0).sort((a, b) => (giftBy(b[0]).p * b[1]) - (giftBy(a[0]).p * a[1])).slice(0, 12);
  if (!gw.length) return '';
  return '<div class="gwall"><small>🎁 حائط الهدايا</small><div>' + gw.map(([k, n]) => '<span><img src="' + gArt(giftBy(k)) + '" alt=""><b>' + fmtK(n) + '</b></span>').join('') + '</div></div>';
};

/* ---------- الحظر والإبلاغ ---------- */
window.toggleBlock = async function (u) {
  const isB = blockedSet().has(u.uid);
  try { await db.collection('users').doc(ME.uid).update({ blocked: isB ? FV.arrayRemove(u.uid) : FV.arrayUnion(u.uid) }); toast(isB ? 'فكيت الحظر عن ' + u.name : '🚫 حظرت ' + u.name + '، ما تشوف رسايله بعد'); } catch (e) { toast(errMsg(e)); }
};
window.reportUser = function (u) {
  const m = modal('<h3>🚩 إبلاغ عن ' + esc(u.name) + '</h3><div class="opts" id="rpO">' + ['كلام مسيء', 'تحرش', 'احتيال', 'محتوى غير لائق', 'غير ذلك'].map((r, i) => '<button data-r="' + r + '" class="' + (i ? '' : 'on') + '">' + r + '</button>').join('') + '</div><button class="btn btn-p" id="rpGo">إرسال البلاغ</button>');
  let why = 'كلام مسيء';
  m.querySelector('#rpO').onclick = e => { const b = e.target.closest('button'); if (!b) return; why = b.dataset.r; [...e.currentTarget.children].forEach(x => x.classList.toggle('on', x === b)); };
  m.querySelector('#rpGo').onclick = () => { db.collection('reports').add({ user: u.uid, userName: u.name, why, by: ME.uid, room: R.id || null, ts: Date.now() }).catch(() => {}); m.close(); toast('وصل البلاغ للإدارة، شكراً 🙏'); };
};
