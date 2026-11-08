/* حجينه — قائمة أعضاء الروم بالترتيب ودعوة الأصدقاء */
'use strict';
const _meLiteM = window.meLite;
window.meLite = function () { const o = _meLiteM(); o.lv = lvlOf(ME.xp); if (ME.city) o.city = ME.city; if (ME.family && ME.family.name) o.fam = ME.family.name; return o; };
function memRank(u) {
  const d = R.data || {}, onMic = (d.seats || []).some(s => s && s.uid === u.uid);
  return (u.uid === d.ownerUid ? 1e9 : 0) + (onMic ? 1e8 : 0) + ((d.admins || []).includes(u.uid) ? 1e7 : 0) + (u.vip || 0) * 1e5 + (u.lv || 1) * 100;
}
function memBadges(u) {
  const d = R.data || {}, b = [];
  if (u.uid === d.ownerUid) b.push('<span class="mb own">👑 صاحب الروم</span>');
  else if ((d.admins || []).includes(u.uid)) b.push('<span class="mb adm">🛡️ مشرف</span>');
  if (u.city) b.push('<span class="mb city">🇮🇶 ' + esc(u.city) + '</span>');
  b.push('<span class="mb lv">⭐ ' + toAr(u.lv || 1) + '</span>');
  if (u.vip) b.push('<span class="mb vip v' + u.vip + '">VIP' + u.vip + '</span>');
  if (u.fam) b.push('<span class="mb fam">🏠 ' + esc(u.fam) + '</span>');
  return b.join('');
}
window.openMembers = function () {
  const can = isOwner() || isMod();
  const m = modal('<div class="mm-tabs"><button class="on" data-t="m">أعضاء الروم <small id="mmN"></small></button><button data-t="i">دعوة للروم</button></div><div id="mmB"></div>');
  const box = m.querySelector('#mmB');
  const members = () => {
    const d = R.data || {}, seats = d.seats || [];
    const list = freshMembers().slice().sort((a, b) => memRank(b) - memRank(a));
    m.querySelector('#mmN').textContent = '(' + toAr(list.length) + ')';
    box.innerHTML = list.map(u => {
      const si = seats.findIndex(s => s && s.uid === u.uid);
      const btn = si >= 0 ? '<button class="mm-b on" disabled>🎙️ على المايك</button>' : (can && u.uid !== ME.uid ? '<button class="mm-b inv" data-mic="' + esc(u.uid) + '">دعوة للمايك</button>' : '<button class="mm-b" disabled>مستمع</button>');
      return '<div class="mm-r" data-u="' + esc(u.uid) + '">' + avHtml(u, 54) + '<div class="mm-i"><div class="mm-n">' + nameHtml(u, true) + '</div><div class="mm-bs">' + memBadges(u) + '</div></div>' + btn + '</div>';
    }).join('') || '<div class="empty">ماكو أحد</div>';
  };
  const invite = async () => {
    box.innerHTML = '<div class="empty">⏳ لحظة...</div>'; let list = [];
    try { const s = await db.collection('users').doc(ME.uid).collection('following').limit(100).get(); list = s.docs.map(d => Object.assign({ uid: d.id }, d.data())); } catch (e) {}
    const here = new Set(freshMembers().map(x => x.uid));
    box.innerHTML = '<button class="btn btn-s" id="mmShare" style="margin:6px 0 10px">📤 انسخ رابط الروم ودزه لأي واحد</button>' + (list.length ? list.map(u => '<div class="mm-r" data-u="' + esc(u.uid) + '">' + avHtml(u, 50) + '<div class="mm-i"><div class="mm-n">' + esc(u.name || '') + '</div><div class="mm-bs">' + (here.has(u.uid) ? '<span class="mb lv">✅ موجود بالروم</span>' : '<span class="mb city">تتابعه</span>') + '</div></div>' +
      (here.has(u.uid) ? '' : '<button class="mm-b inv" data-inv="' + esc(u.uid) + '">دعوة</button>') + '</div>').join('') : '<div class="empty"><div class="e">👥</div><b>ما تتابع أحد بعد</b><span>تابع ناس حتى تكدر تدعيهم لرومك</span></div>');
    box.querySelector('#mmShare').onclick = () => { const t = 'تعال لروم «' + (R.data.title || '') + '» بحجينه — ID ' + R.id.slice(0, 6) + '\nhttps://hassean1999.github.io/hajina/'; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('📋 انسخ')).catch(() => toast('ID الروم: ' + R.id.slice(0, 6))); };
  };
  m.querySelector('.mm-tabs').onclick = e => { const b = e.target.closest('button'); if (!b) return; m.querySelectorAll('.mm-tabs button').forEach(x => x.classList.toggle('on', x === b)); b.dataset.t === 'm' ? members() : invite(); };
  box.onclick = e => {
    const mic = e.target.closest('[data-mic]'), inv = e.target.closest('[data-inv]');
    if (mic) { e.stopPropagation(); notify(mic.dataset.mic, 'room', 'يدعوك تصعد عالمايك بروم «' + (R.data.title || '') + '» 🎙️', { room: R.id }); mic.textContent = '✓ انرسلت'; mic.disabled = true; return; }
    if (inv) { e.stopPropagation(); notify(inv.dataset.inv, 'room', 'يدعوك لروم «' + (R.data.title || '') + '» 🎉', { room: R.id }); inv.textContent = '✓ انرسلت'; inv.disabled = true; return; }
    const r = e.target.closest('[data-u]'); if (r) { m.close(); userCard(r.dataset.u); }
  };
  members();
};
