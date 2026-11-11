/* حجينه — دعوة للمايك: محد يصعد تلقائي، بعد 5 ثواني تجي دعوة (اصعد / لا) */
'use strict';
let MI = null;
function micFreeSeat() {
  const d = R.data || {}, seats = d.seats || [], locks = d.locks || [];
  if (isOwner()) return seats[0] ? -1 : 0;
  for (let i = 1; i < seats.length; i++) if (!seats[i] && !locks[i]) return i;
  return -1;
}
function micInvite(from, txt) {
  if (!R.id || R.mySeat !== -1) return;
  const i = micFreeSeat(); if (i < 0) return;
  micInvClose();
  const d = R.data || {}, host = from || { uid: d.ownerUid, name: d.ownerName, color: d.ownerColor };
  const el = document.createElement('div'); el.className = 'micinv';
  el.innerHTML = '<div class="mi-av">' + avHtml(host, 46) + '<span>🎙️</span></div><div class="mi-t"><b>' + esc(txt || (isOwner() ? 'كرسيك كمضيف فاضي' : 'دعوة للمايك')) + '</b><small>' + (isOwner() ? 'تصعد عالمايك وتبدي السهرة؟' : esc(host.name || '') + ' يدعوك تصعد وتسولف ويانا') + '</small></div>' +
    '<div class="mi-b"><button class="no">لا شكراً</button><button class="ok">اصعد</button></div><i class="mi-bar"></i>';
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('on'));
  el.querySelector('.ok').onclick = () => { micInvClose(); const j = micFreeSeat(); if (j < 0) return toast('ماكو كرسي فاضي هسه'); takeSeat(j); };
  el.querySelector('.no').onclick = () => micInvClose();
  MI = { el, t: setTimeout(micInvClose, 15000) };
  try { sfx(660, .08, 'sine', .04); } catch (e) {}
}
function micInvClose() { if (!MI) return; clearTimeout(MI.t); const el = MI.el; el.classList.remove('on'); setTimeout(() => el.remove(), 250); MI = null; }
const _enterMI = window.enterRoom;
window.enterRoom = async function (id) {
  micInvClose();
  const r = await _enterMI.apply(this, arguments);
  const rid = id;
  setTimeout(() => { if (R.id === rid && R.mySeat === -1) micInvite(); }, 5000);
  return r;
};
const _leaveMI = window.leaveRoom;
window.leaveRoom = function () { micInvClose(); return _leaveMI.apply(this, arguments); };
// دعوة من المشرف
const _onMsgMI = window.onRoomMsg;
window.onRoomMsg = function (m) {
  if (m.type === 'micinv') { if (!R.seen.has(m.id)) { R.seen.add(m.id); const fresh = !m.ts || ms(m.ts) > Date.now() - 60000; if (m.to === ME.uid && fresh) micInvite(m, (m.name || '') + ' يدعوك للمايك'); } return; }
  return _onMsgMI.apply(this, arguments);
};
// إذا صعد لوحده تختفي الدعوة
const _rrMI = window.renderRoom;
window.renderRoom = function () { _rrMI.apply(this, arguments); if (MI && R.mySeat !== -1) micInvClose(); };
