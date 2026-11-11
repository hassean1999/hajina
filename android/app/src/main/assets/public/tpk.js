/* حجينه — PK الفرق: الكراسي تنقسم فريقين (أحمر وأزرق)، والهدايا تنحسب للفريق */
'use strict';
const TP_A = [1, 2, 3, 4], TP_B = [5, 6, 7, 8];
const tpLive = () => { const t = R.data && R.data.tpk; return t && !t.done ? t : null; };
const tpTeamOfSeat = i => TP_A.includes(i) ? 'a' : TP_B.includes(i) ? 'b' : '';
function tpTeamOfUid(uid) { const i = (R.data.seats || []).findIndex(s => s && s.uid === uid); return tpTeamOfSeat(i); }

window.openTeamPK = function () {
  const live = tpLive();
  if (live) {
    const m = modal('<h3>⚔️ PK الفرق شغال</h3><p style="text-align:center;color:var(--fg2)">🔴 ' + fmtK(live.sa || 0) + ' ضد ' + fmtK(live.sb || 0) + ' 🔵</p><button class="btn btn-s" id="tpEnd" style="color:var(--danger)">⏹️ إنهاء هسه وإعلان الفائز</button>');
    m.querySelector('#tpEnd').onclick = () => { m.close(); tpFinish(); };
    return;
  }
  let dur = 5;
  const m = modal('<h3>⚔️ PK الفرق</h3><div class="tp-how"><div class="a">🔴 الفريق الأحمر<small>كراسي ١ - ٤</small></div><div class="vs">VS</div><div class="b">🔵 الفريق الأزرق<small>كراسي ٥ - ٨</small></div></div>' +
    '<p style="text-align:center;font-size:12.5px;color:var(--fg2);line-height:1.8">كل هدية توصل لواحد من الفريق تنحسب لفريقه. الفريق الأكثر دعم يفوز، وأكبر داعم يصير MVP 👑</p>' +
    '<label class="l">المدة</label><div class="opts" id="tpD">' + [3, 5, 10, 15, 30].map(x => '<button data-d="' + x + '" class="' + (x === 5 ? 'on' : '') + '">' + toAr(x) + ' دقايق</button>').join('') + '</div><button class="btn btn-p" id="tpGo">⚔️ ابدأ PK الفرق</button>');
  m.querySelector('#tpD').onclick = e => { const b = e.target.closest('button'); if (!b) return; dur = +b.dataset.d; [...e.currentTarget.children].forEach(x => x.classList.toggle('on', x === b)); };
  m.querySelector('#tpGo').onclick = async () => {
    try {
      await roomRef().update({ tpk: { sa: 0, sb: 0, start: Date.now(), end: Date.now() + dur * 60000, done: false, by: ME.uid, sup: {} } });
      roomRef().collection('messages').add({ type: 'sys', uid: ME.uid, text: '⚔️ بدأ PK الفرق! 🔴 الأحمر ضد 🔵 الأزرق — ادعموا فريقكم بالهدايا', ts: FV.serverTimestamp() }).catch(() => {});
      m.close();
    } catch (e) { toast(errMsg(e)); }
  };
};
// من sendGift
window.tpkGiftUpdate = function (targets, heart, hu) {
  const t = tpLive(); if (!t || Date.now() > t.end) return;
  let a = 0, b = 0; targets.forEach(x => { const tm = tpTeamOfUid(x.uid); if (tm === 'a') a += heart; else if (tm === 'b') b += heart; });
  targets.forEach(x => { if (tpTeamOfUid(x.uid)) hu['tpk.rcv.' + x.uid] = FV.increment(heart * targets.filter(y => y.uid === x.uid).length); });
  if (!a && !b) return;
  if (a) hu['tpk.sa'] = FV.increment(a); if (b) hu['tpk.sb'] = FV.increment(b);
  const k = 'tpk.sup.' + ME.uid + '.';
  hu[k + 'v'] = FV.increment(a + b); hu[k + 'n'] = ME.name; hu[k + 'c'] = ME.color || ''; hu[k + 'pv'] = ME.pv || 0; hu[k + 'vip'] = vipOf(ME.recharged || 0);
  if (ME.fr) hu[k + 'fr'] = ME.fr;
  if (a) hu[k + 'a'] = FV.increment(a); if (b) hu[k + 'b'] = FV.increment(b);
};
async function tpFinish() {
  const ref = roomRef(); let res = null;
  try {
    await db.runTransaction(async tx => { const d = (await tx.get(ref)).data(), t = d.tpk; if (!t || t.done) throw new Error('x'); tx.update(ref, { 'tpk.done': true, 'tpk.end': Math.min(t.end, Date.now()) }); res = t; });
    const w = res.sa > res.sb ? '🔴 الفريق الأحمر' : res.sb > res.sa ? '🔵 الفريق الأزرق' : '', mvp = tpMvp(res);
    roomRef().collection('messages').add({ type: 'sys', uid: ME.uid, text: (w ? '🏆 ' + w + ' فاز بـ PK الفرق (' + fmtK(Math.max(res.sa, res.sb)) + ' مقابل ' + fmtK(Math.min(res.sa, res.sb)) + ')' : '🤝 PK الفرق انتهى تعادل') + (mvp ? ' — 👑 MVP: ' + mvp.name : ''), ts: FV.serverTimestamp() }).catch(() => {});
  } catch (e) {}
}
const tpSups = (t, side) => Object.entries((t && t.sup) || {}).map(([uid, x]) => ({ uid, name: x.n, color: x.c, pv: x.pv || 0, vip: x.vip || 0, fr: x.fr, v: side ? (x[side] || 0) : (x.v || 0) })).filter(x => x.v > 0).sort((p, q) => q.v - p.v);
const tpMvp = t => tpSups(t)[0] || null;

let tpTimer = null, tpShown = null;
function tpLayout() {
  const box = $('seats'), d = R.data || {}, t = d.tpk;
  clearInterval(tpTimer);
  const on = t && !(t.done && Date.now() - (t.end || 0) > 20000);
  box.classList.toggle('tpk', !!on);
  if (!on) return;
  const seat = i => box.querySelector('.seat[data-i="' + i + '"]');
  [1, 2, 3, 4, 5, 6, 7, 8].forEach(i => { const s = seat(i); if (s) { s.classList.add('tp-' + tpTeamOfSeat(i)); if (!s.querySelector('.tp-no')) { const n = document.createElement('b'); n.className = 'tp-no'; n.textContent = i; s.prepend(n); } } });
  const mvp = tpMvp(t);
  const top = document.createElement('div'); top.className = 'tp-top';
  const mv = document.createElement('div'); mv.className = 'tp-mvp' + (mvp ? ' has' : '');
  mv.innerHTML = mvp ? avHtml(mvp, 54) + '<span class="tp-mvpb">MVP</span><small>' + esc(mvp.name) + '</small>' : '<div class="tp-mvp0"><img src="fx/crown.webp" alt=""><span class="tp-mvpb">MVP</span></div>';
  if (mvp) mv.onclick = e => { e.stopPropagation(); userCard(mvp.uid); };
  top.append(mv); [0, 9].forEach(i => { const s = seat(i); if (s) top.append(s); });
  const tot = (t.sa || 0) + (t.sb || 0), pa = tot ? Math.max(8, Math.min(92, (t.sa || 0) / tot * 100)) : 50;
  const win = t.done ? (t.sa > t.sb ? 'a' : t.sb > t.sa ? 'b' : 'd') : '';
  const sup3 = side => { const l = tpSups(t, side).slice(0, 3); return [0, 1, 2].map(k => l[k] ? '<span class="tp-s s' + k + '" data-su="' + esc(l[k].uid) + '">' + avHtml(l[k], 26) + '</span>' : '<span class="tp-s e"></span>').join(''); };
  const panel = document.createElement('div'); panel.className = 'tp-box' + (win ? ' over w-' + win : '');
  panel.innerHTML = '<div class="tp-bar"><span class="tp-va">' + fmtK(t.sa || 0) + '</span><i class="tp-fa" style="width:' + pa + '%"></i><i class="tp-fb"></i><em style="left:' + pa + '%">⚡</em><span class="tp-vb">' + fmtK(t.sb || 0) + '</span></div>' +
    '<div class="tp-time" id="tpT"></div><div class="tp-teams"><div class="tp-side a"><div class="tp-sups">' + sup3('a') + '</div><div class="tp-g ga"></div>' + (win === 'a' ? '<div class="tp-win">WIN 🏆</div>' : '') + '</div><div class="tp-side b"><div class="tp-sups">' + sup3('b') + '</div><div class="tp-g gb"></div>' + (win === 'b' ? '<div class="tp-win">WIN 🏆</div>' : '') + '</div></div>';
  TP_A.forEach(i => { const s = seat(i); if (s) panel.querySelector('.ga').append(s); });
  TP_B.forEach(i => { const s = seat(i); if (s) panel.querySelector('.gb').append(s); });
  panel.addEventListener('click', e => { const su = e.target.closest('[data-su]'); if (su) { e.stopPropagation(); userCard(su.dataset.su); } });
  box.innerHTML = ''; box.append(top, panel);
  const tick = () => { const el = $('tpT'); if (!el) return clearInterval(tpTimer);
    if (t.done) { el.textContent = win === 'd' ? '🤝 تعادل' : '🏆 انتهى'; return; }
    const left = Math.max(0, t.end - Date.now()); el.textContent = '⏱ ' + Math.floor(left / 60000) + ':' + String(Math.floor(left / 1000) % 60).padStart(2, '0');
    if (left <= 0) { clearInterval(tpTimer); if (t.by === ME.uid || isOwner()) tpFinish(); } };
  tick(); tpTimer = setInterval(tick, 500);
  if (t.done && tpShown !== t.start) { tpShown = t.start; tpResultFx(t, win); }
}
function tpResultFx(t, win) {
  const mvp = tpMvp(t), d = document.createElement('div'); d.className = 'gfx pk-fx';
  d.innerHTML = '<div class="pk-win tp-res ' + win + '"><b>' + (win === 'a' ? '🔴 الفريق الأحمر فاز' : win === 'b' ? '🔵 الفريق الأزرق فاز' : '🤝 تعادل') + '</b><span>' + fmtK(t.sa || 0) + ' : ' + fmtK(t.sb || 0) + '</span>' + (mvp ? avHtml(mvp, 90) + '<small>👑 MVP: ' + esc(mvp.name) + '</small>' : '') + '</div>';
  document.body.appendChild(d); setTimeout(() => d.remove(), 4000); chime(true);
}
const _rrT = window.renderRoom;
window.renderRoom = function () { _rrT.apply(this, arguments); try { tpLayout(); } catch (e) { console.error(e); } };
// زر بالقائمة
const _orm = window.openRoomMenu;
window.openRoomMenu = function () {
  _orm.apply(this, arguments);
  if (!(isOwner() || isMod())) return;
  const g = document.querySelector('#modals .ov:last-child .mg'); if (!g) return;
  const b = document.createElement('button'); b.innerHTML = '<span style="background:linear-gradient(135deg,#E8304C,#2E7BD6)">🆚</span>' + (tpLive() ? 'إنهاء PK الفرق' : 'PK الفرق');
  b.onclick = e => { e.stopPropagation(); closeTopModal(); openTeamPK(); };
  g.prepend(b);
};
