/* حجينه — واجهة v2: كروت الرومات والبانرات */
'use strict';
const CAT_ART = { chat: ['coffee', '#FF8A1F', '#9A2E06'], sport: ['sport', '#2EAD5B', '#0B4A26'], music: ['music', '#B266FF', '#4A1680'], poetry: ['poetry', '#E0A84A', '#6E4A12'], games: ['games', '#2E9BD6', '#173A78'], religion: ['religion', '#1ABC9C', '#0B4A3E'], love: ['love', '#FF5A8A', '#8A0A3A'] };
window.renderRooms = function () {
  const live = roomsData.filter(isLive);
  let list = [], empty = '';
  if (homeTab === 'trend') { list = live.slice().sort((a, b) => heat(b) - heat(a)); empty = 'ماكو رومات مفتوحة هسه|كون أول واحد يفتح روم ويجمع الناس'; }
  else if (homeTab === 'fav') { list = [...FAVS].map(roomById).filter(Boolean).sort((a, b) => isLive(b) - isLive(a)); empty = 'ما ضفت رومات للمفضلة|ادخل أي روم واضغط ⋯ ← ⭐ أضف للمفضلة'; }
  else if (homeTab === 'follow') { list = roomsData.filter(r => !r.closed && (FOLLOW.has(r.ownerUid) || (r.seats || []).some(x => x && FOLLOW.has(x.uid)))).sort((a, b) => isLive(b) - isLive(a) || heat(b) - heat(a)); empty = 'ماكو رومات لناس تتابعهم|تابع الناس من بطاقتهم حتى تلكى رومهم هنا'; }
  else if (homeTab === 'recent') { list = recentIds().map(roomById).filter(r => r && !r.closed); empty = 'بعدك ما دخلت أي روم|الرومات اللي تدخلها تبين هنا'; }
  else { list = live.slice().sort((a, b) => ((b.city === ME.city) * 50 + heat(b) + (FOLLOW.has(b.ownerUid) ? 30 : 0)) - ((a.city === ME.city) * 50 + heat(a) + (FOLLOW.has(a.ownerUid) ? 30 : 0))); empty = 'ماكو رومات نوصيك بيها هسه|ارجع بعد شوية'; }
  const [et, es] = empty.split('|');
  $('roomsEmpty').hidden = list.length > 0;
  $('roomsEmpty').querySelector('b').textContent = et; $('roomsEmpty').querySelector('span').textContent = es;
  $('roomsCount').textContent = list.length ? toAr(list.length) + ' روم' : '';
  $('roomsTitle').textContent = (HTABS.find(t => t.k === homeTab) || HTABS[1]).n;
  const hotIds = new Set(live.slice().sort((a, b) => heat(b) - heat(a)).slice(0, 3).filter(r => heat(r) > 5).map(r => r.id));
  $('roomsGrid').innerHTML = list.map((r, idx) => {
    const art = CAT_ART[r.cat] || CAT_ART.chat, lv = isLive(r), cv = r.coverV ? coverOf(r) : '';
    const th = { 'th-blue': ['#2E7BD6', '#0F1D3D'], 'th-green': ['#2EAD5B', '#0B2E1F'], 'th-purple': ['#9B59B6', '#2A1040'] }[r.theme] || [art[1], art[2]];
    const mics = (r.seats || []).filter(Boolean).slice(0, 4);
    const feat = homeTab === 'trend' && idx === 0 && list.length > 1;
    return '<div class="rc2' + (feat ? ' feat' : '') + (lv ? '' : ' off') + '" onclick="enterRoom(\'' + r.id + '\')">' +
      '<div class="rc2-bg" data-cover="' + r.id + '" style="background:' + (cv ? 'url(' + cv + ') center/cover' : 'linear-gradient(150deg,' + th[0] + ',' + th[1] + ')') + '"></div>' +
      (cv ? '' : '<img class="rc2-art" src="ui/' + art[0] + '.webp" alt="">') +
      '<div class="rc2-tags">' + (lv ? '<span class="rc2-live"><span class="eq"><i></i><i></i><i></i></span>مباشر</span><span class="rc2-cnt">👤 ' + toAr(Math.max(1, r.online || 0)) + '</span>' : '<span class="rc2-live" style="opacity:.8">⏸ غير مباشر</span>') + '</div>' +
      (hotIds.has(r.id) ? '<span class="rc2-hot">🔥 HOT</span>' : '') + (r.locked ? '<span class="rc2-lock">🔒</span>' : '') +
      '<div class="rc2-b"><div class="t">' + (FAVS.has(r.id) ? '⭐ ' : '') + esc(r.title) + '</div>' +
      '<div class="rc2-h">' + avHtml({ uid: r.ownerUid, name: r.ownerName, color: r.ownerColor }, 20) + '<span>' + esc(r.ownerName || '') + ' · ' + esc(r.city || '') + '</span></div>' +
      (mics.length ? '<div class="rc2-m">' + mics.map(s => avHtml(s, 22)).join('') + '<small>' + toAr(mics.length) + ' عالمايك</small></div>' : '') + '</div></div>';
  }).join('');
};
// غلاف الروم يتحمل بعدين
const _coverOf = window.coverOf;
window.coverOf = function (r) { const k = r.id + 'cover' + r.coverV; if (RMEDIA[k]) return RMEDIA[k]; if (RMEDIA[k] === undefined) roomMedia(r.id, 'cover', r.coverV).then(u => { const el = document.querySelector('[data-cover="' + r.id + '"]'); if (u && el) { el.style.background = 'url(' + u + ') center/cover'; const a = el.parentNode.querySelector('.rc2-art'); if (a) a.remove(); } }); return ''; };
// البانرات المتحركة
(function () {
  const bn = $('banners'), dots = $('bnDots'); if (!bn) return;
  const n = bn.children.length; dots.innerHTML = Array.from({ length: n }, (_, i) => '<i class="' + (i ? '' : 'on') + '"></i>').join('');
  let cur = 0, timer;
  const idx = () => Math.round(Math.abs(bn.scrollLeft) / (bn.children[0].offsetWidth + 10));
  bn.addEventListener('scroll', () => { const i = Math.min(n - 1, idx()); if (i !== cur) { cur = i; [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i)); } }, { passive: true });
  const next = () => { if ($('home').hidden) return; const i = (cur + 1) % n; bn.children[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); };
  const start = () => { clearInterval(timer); timer = setInterval(next, 4500); };
  bn.addEventListener('touchstart', () => clearInterval(timer), { passive: true }); bn.addEventListener('touchend', start, { passive: true });
  start();
})();
