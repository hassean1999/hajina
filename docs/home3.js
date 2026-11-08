/* حجينه — الرئيسية البسيطة: ارتباطاتي، موصى بها، اكتشاف */
'use strict';
let H3 = { tab: (() => { try { return localStorage.getItem('hj_h3') || 'disc'; } catch (e) { return 'disc'; } })(), sub: 'follow' };
(function setup() {
  const home = $('home'); if (!home) return;
  home.classList.add('h3');
  const hd = home.querySelector('.hd');
  hd.innerHTML = '<div class="h3-tabs"><button data-t="mine">ارتباطاتي</button><button data-t="rec">موصى بها</button><button data-t="disc">اكتشاف</button></div>' +
    '<div class="h3-ic"><button class="h3-b" onclick="openNotifs()" aria-label="الإشعارات"><img src="ui/bell.webp" alt=""><span class="badge" id="ntBadge" hidden></span></button><button class="h3-b" onclick="openSearch()" aria-label="بحث"><img src="ui/search.webp" alt=""></button></div>';
  const sc = $('homeScroll'), old = document.createElement('div'); old.hidden = true; old.id = 'homeOld';
  [...sc.children].forEach(c => old.appendChild(c)); sc.appendChild(old);
  const box = document.createElement('div'); box.id = 'h3'; sc.prepend(box);
  hd.querySelector('.h3-tabs').onclick = e => { const b = e.target.closest('[data-t]'); if (!b) return; H3.tab = b.dataset.t; try { localStorage.setItem('hj_h3', H3.tab); } catch (er) {} sc.scrollTop = 0; h3Render(); };
  box.onclick = e => {
    const s = e.target.closest('[data-sub]'); if (s) { H3.sub = s.dataset.sub; return h3Render(); }
    const r = e.target.closest('[data-room]'); if (r) return enterRoom(r.dataset.room);
    const a = e.target.closest('[data-act]'); if (a) return ({ rich: () => openRich(), ev: () => openEvents(), fam: () => openFamilies(), wheel: () => doCheckin(), vip: () => openVip(), mine: () => { const my = roomsData.find(x => x.ownerUid === ME.uid && !x.closed); my ? enterRoom(my.id) : openCreate(); }, create: () => openCreate() })[a.dataset.act]();
  };
})();
const h3Badges = r => { const b = [], g = r.game; if (r.tpk && !r.tpk.done || r.pk && !r.pk.done) b.push('<i class="pk">PK</i>'); if (g && g.status !== 'done' && Date.now() - (g.ts || 0) < 30 * 60000) b.push('<i>' + ((typeof GT !== 'undefined' && GT[g.type || 'word']) || { e: '🎮' }).e + '</i>'); if (r.yt) b.push('<i>🎵</i>'); if (r.locked) b.push('<i>🔒</i>'); return b.length ? '<div class="h3-bd">' + b.join('') + '</div>' : ''; };
function h3Thumb(r, s) {
  const art = (typeof CAT_ART !== 'undefined' && CAT_ART[r.cat]) || ['coffee', '#FF8A1F', '#9A2E06'], cv = r.coverV ? coverOf(r) : '';
  return '<div class="h3-th" data-cover="' + r.id + '" style="width:' + s + 'px;height:' + s + 'px;background:' + (cv ? 'url(' + cv + ') center/cover' : 'linear-gradient(150deg,' + art[1] + ',' + art[2] + ')') + '">' + (cv ? '' : '<img class="rc2-art" src="ui/' + art[0] + '.webp" alt="">') + (isLive(r) ? '<span class="h3-eq"><i></i><i></i><i></i></span>' : '') + '</div>';
}
const h3Cnt = r => '<span class="h3-cnt">👤 ' + toAr(isLive(r) ? Math.max(1, r.online || 0) : 0) + '</span>';
const h3Row = r => '<div class="h3-row' + (isLive(r) ? '' : ' off') + '" data-room="' + r.id + '">' + h3Badges(r) + h3Thumb(r, 84) + '<div class="h3-ri"><b>' + esc(r.title) + '</b><small>' + esc(r.ownerName || '') + (r.city ? ' · ' + esc(r.city) : '') + '</small>' + h3Cnt(r) + '</div></div>';
const h3Card = r => { const host = (r.seats || [])[0] || { uid: r.ownerUid, name: r.ownerName, color: r.ownerColor };
  return '<div class="h3-card" data-room="' + r.id + '">' + h3Badges(r) + '<div class="h3-cav">' + avHtml(host, 92) + (isLive(r) ? '<span class="h3-eq on"><i></i><i></i><i></i></span>' : '') + '</div><b>' + esc(r.title) + '</b>' + h3Cnt(r) + '</div>'; };
const h3Empty = (ic, t, s, btn) => '<div class="h3-empty"><img src="ui/' + ic + '.webp" alt=""><b>' + t + '</b><small>' + s + '</small>' + (btn || '') + '</div>';
function h3Render() {
  const box = $('h3'); if (!box || typeof ME === 'undefined' || !ME) return;
  document.querySelectorAll('#home .h3-tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === H3.tab));
  const live = roomsData.filter(isLive), byHeat = live.slice().sort((a, b) => heat(b) - heat(a));
  let h = '';
  if (H3.tab === 'mine') {
    const my = roomsData.find(x => x.ownerUid === ME.uid && !x.closed);
    h += '<div class="h3-my" data-act="mine"><div><b>غرفتي</b><small>' + (my ? esc(my.title) + (isLive(my) ? ' · 👤 ' + toAr(Math.max(1, my.online || 0)) : '') : 'افتح غرفتك واجمع أصدقائك') + '</small></div><img src="ui/house.webp" alt=""></div>';
    h += '<div class="h3-pills"><button data-sub="follow"' + (H3.sub === 'follow' ? ' class="on"' : '') + '>متابعاتي</button><button data-sub="recent"' + (H3.sub === 'recent' ? ' class="on"' : '') + '>شاهدت مؤخراً</button></div>';
    if (H3.sub === 'follow') {
      const ppl = [];
      live.forEach(r => { const seen = new Set(); [{ uid: r.ownerUid, name: r.ownerName, color: r.ownerColor }].concat((r.seats || []).filter(Boolean)).forEach(p => { if (p && FOLLOW.has(p.uid) && !seen.has(p.uid) && !ppl.some(x => x.p.uid === p.uid)) { seen.add(p.uid); ppl.push({ p, r }); } }); });
      h += '<div class="h3-sec">أصدقائي</div>' + (ppl.length ? ppl.map(({ p, r }) => '<div class="h3-row fr" data-room="' + r.id + '">' + h3Badges(r) + '<div class="h3-fav">' + avHtml(p, 64) + '<span class="h3-eq on"><i></i><i></i><i></i></span></div><div class="h3-ri"><b>' + esc(p.name || '') + ' <em>بالغرفة</em></b><small>🎙️ ' + esc(r.title) + '</small></div></div>').join('')
        : h3Empty('chat', 'ماكو أحد من أصدقائك برومات هسه', 'تابع ناس من بطاقتهم، ومن يدخلون روم يطلعولك هنا'));
    } else {
      const rec = recentIds().map(roomById).filter(r => r && !r.closed);
      h += '<div class="h3-sec">شاهدت مؤخراً</div>' + (rec.length ? rec.map(h3Row).join('') : h3Empty('studio', 'بعدك ما دخلت أي غرفة', 'الغرف اللي تدخلها تبين هنا'));
    }
  } else if (H3.tab === 'rec') {
    const list = live.slice().sort((a, b) => ((b.city === ME.city) * 50 + heat(b) + (FOLLOW.has(b.ownerUid) ? 30 : 0)) - ((a.city === ME.city) * 50 + heat(a) + (FOLLOW.has(a.ownerUid) ? 30 : 0)));
    h += '<div class="h3-sec">غرف تناسبك</div>' + (list.length ? '<div class="h3-grid">' + list.map(h3Card).join('') + '</div>' : h3Empty('studio', 'ماكو غرف مفتوحة هسه', 'افتح غرفتك وكون أول واحد', '<button class="h3-btn" data-act="create">+ افتح غرفة</button>'));
  } else {
    h += '<div class="h3-rich" data-act="rich"><img class="cup" src="ui/trophy.webp" alt=""><b>قائمة الثراء</b><div class="h3-pod" id="h3Pod"></div></div>' +
      '<div class="h3-two"><div class="h3-mini ev" data-act="ev"><b>الأنشطة</b><img src="ui/party.webp" alt=""></div><div class="h3-mini fam" data-act="fam"><b>ساحة العائلات</b><img src="ui/shield.webp" alt=""></div><div class="h3-mini wh" data-act="wheel"><b>عجلة الحظ</b><img src="ui/wheel.webp" alt=""></div><div class="h3-mini vp" data-act="vip"><b>VIP</b><img src="ui/crown.webp" alt=""></div></div>';
    const favs = [...FAVS].map(roomById).filter(r => r && !r.closed).sort((a, b) => isLive(b) - isLive(a));
    if (favs.length) h += '<div class="h3-sec">المفضلة</div>' + favs.map(h3Row).join('');
    h += '<div class="h3-sec">غرف الترند</div>' + (byHeat.length ? byHeat.map(h3Row).join('') : h3Empty('studio', 'ماكو غرف مفتوحة هسه', 'افتح غرفتك وجمّع الناس', '<button class="h3-btn" data-act="create">+ افتح غرفة</button>'));
  }
  box.innerHTML = h;
  if (H3.tab === 'disc') h3Pod();
}
let H3TOP = null, H3TOPts = 0;
async function h3Pod() {
  const el = $('h3Pod'); if (!el) return;
  const paint = () => { const t = H3TOP || []; const sl = [t[1], t[0], t[2]]; el.innerHTML = sl.map((u, i) => '<span class="p' + i + '">' + (u ? avHtml(u, i === 1 ? 52 : 38) : '<i class="h3-q">؟</i>') + (i === 1 ? '<em>1</em>' : '') + '</span>').join(''); };
  paint();
  if (Date.now() - H3TOPts < 60000) return; H3TOPts = Date.now();
  try { let s = await rkRef('rich', rkPeriod('d').key).orderBy('v', 'desc').limit(3).get(); if (s.empty) s = await rkRef('rich', rkPeriod('m').key).orderBy('v', 'desc').limit(3).get(); H3TOP = s.docs.map(d => Object.assign({ uid: d.id }, d.data())); paint(); } catch (e) {}
}
const _rrH3 = window.renderRooms;
window.renderRooms = function () { try { _rrH3.apply(this, arguments); } catch (e) {} h3Render(); };
setTimeout(h3Render, 300);
