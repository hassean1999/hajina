/* حجينه — تحدي PK للدعم */
'use strict';
const pkLive = () => { const p = R.data && R.data.pk; return p && !p.done ? p : null; };
window.openPK = function () {
  const live = pkLive();
  if (live) {
    const m = modal('<h3>⚔️ تحدي PK شغال</h3><p style="text-align:center;color:var(--fg2)">' + esc(live.a.name) + ' ضد ' + esc(live.b.name) + '</p><button class="btn btn-s" id="pkEnd" style="color:var(--danger)">⏹️ إنهاء التحدي هسه</button>');
    m.querySelector('#pkEnd').onclick = () => { m.close(); pkFinish(true); };
    return;
  }
  const seated = (R.data.seats || []).filter(Boolean);
  if (seated.length < 2) return toast('لازم يكون اثنين على الأقل عالمايك');
  const sel = [seated[0].uid, seated[1].uid]; let dur = 3;
  const m = modal('<h3>⚔️ تحدي PK للدعم</h3><p style="text-align:center;font-size:12.5px;color:var(--fg2)">اختار اثنين عالمايك، والهدايا اللي توصلهم خلال الوقت تنحسب لكل واحد. الأكثر دعم يفوز!</p><div class="pk-pick" id="pkP"></div><label class="l">المدة</label><div class="opts" id="pkD">' + [3, 5, 10, 15].map(x => '<button data-d="' + x + '" class="' + (x === 3 ? 'on' : '') + '">' + toAr(x) + ' دقايق</button>').join('') + '</div><button class="btn btn-p" id="pkGo">⚔️ ابدأ التحدي</button>');
  const draw = () => { m.querySelector('#pkP').innerHTML = seated.map(s => '<div class="pk-c' + (sel.includes(s.uid) ? ' on' : '') + (sel[0] === s.uid ? ' a' : sel[1] === s.uid ? ' b' : '') + '" data-u="' + esc(s.uid) + '">' + avHtml(s, 50) + '<small>' + esc(s.name) + '</small></div>').join(''); };
  draw();
  m.querySelector('#pkP').onclick = e => { const el = e.target.closest('[data-u]'); if (!el) return; const u = el.dataset.u; if (sel.includes(u)) return; sel.shift(); sel.push(u); draw(); };
  m.querySelector('#pkD').onclick = e => { const b = e.target.closest('button'); if (!b) return; dur = +b.dataset.d; [...e.currentTarget.children].forEach(x => x.classList.toggle('on', x === b)); };
  m.querySelector('#pkGo').onclick = async () => {
    const a = seated.find(s => s.uid === sel[0]), b = seated.find(s => s.uid === sel[1]);
    const lite = s => ({ uid: s.uid, name: s.name, color: s.color || '#FF8A1F', vip: s.vip || 0, pv: s.pv || 0 });
    try {
      await roomRef().update({ pk: { a: lite(a), b: lite(b), sa: 0, sb: 0, start: Date.now(), end: Date.now() + dur * 60000, done: false, by: ME.uid } });
      roomRef().collection('messages').add({ type: 'sys', uid: ME.uid, text: '⚔️ بدأ تحدي PK: ' + a.name + ' ضد ' + b.name + ' — ادعموا بالهدايا!', ts: FV.serverTimestamp() }).catch(() => {});
      m.close();
    } catch (e) { toast(errMsg(e)); }
  };
};
let pkTimer = null, pkShown = null;
window.syncPK = function () {
  const el = $('pkBar'), p = R.data && R.data.pk;
  clearInterval(pkTimer);
  if (!p || (p.done && Date.now() - (p.end || 0) > 15000)) { el.hidden = true; return; }
  el.hidden = false;
  const tot = (p.sa || 0) + (p.sb || 0), pa = tot ? (p.sa || 0) / tot * 100 : 50;
  const win = p.done ? (p.sa > p.sb ? 'a' : p.sb > p.sa ? 'b' : '') : '';
  el.innerHTML = '<div class="pk-side a' + (win === 'a' ? ' win' : '') + '">' + avHtml(p.a, 40) + '<div><b>' + esc(p.a.name) + '</b><span>' + fmtK(p.sa || 0) + '</span></div></div>' +
    '<div class="pk-mid"><div class="pk-vs">PK</div><div class="pk-time" id="pkT"></div></div>' +
    '<div class="pk-side b' + (win === 'b' ? ' win' : '') + '"><div><b>' + esc(p.b.name) + '</b><span>' + fmtK(p.sb || 0) + '</span></div>' + avHtml(p.b, 40) + '</div>' +
    '<div class="pk-bar"><i style="width:' + pa + '%"></i><em style="left:' + pa + '%">🔥</em></div>';
  const tick = () => {
    const left = Math.max(0, p.end - Date.now()), t = $('pkT'); if (!t) return;
    if (p.done) { t.textContent = win ? '🏆 ' + (win === 'a' ? p.a.name : p.b.name) : '🤝 تعادل'; return; }
    t.textContent = Math.floor(left / 60000) + ':' + String(Math.floor(left / 1000) % 60).padStart(2, '0');
    if (left <= 0) { clearInterval(pkTimer); if (p.by === ME.uid || isOwner()) pkFinish(false); }
  };
  tick(); pkTimer = setInterval(tick, 500);
  if (p.done && pkShown !== p.start) { pkShown = p.start; pkResultFx(p); }
};
async function pkFinish(early) {
  const ref = roomRef(); let res = null;
  try {
    await db.runTransaction(async tx => { const d = (await tx.get(ref)).data(), p = d.pk; if (!p || p.done) throw new Error('x'); tx.update(ref, { 'pk.done': true, 'pk.end': Math.min(p.end, Date.now()) }); res = p; });
    const w = res.sa > res.sb ? res.a : res.sb > res.sa ? res.b : null;
    roomRef().collection('messages').add({ type: 'sys', uid: ME.uid, text: w ? '🏆 ' + w.name + ' فاز بتحدي PK (' + fmtK(Math.max(res.sa, res.sb)) + ' مقابل ' + fmtK(Math.min(res.sa, res.sb)) + ')' : '🤝 تحدي PK انتهى بالتعادل', ts: FV.serverTimestamp() }).catch(() => {});
  } catch (e) {}
}
function pkResultFx(p) {
  const w = p.sa > p.sb ? p.a : p.sb > p.sa ? p.b : null;
  const d = document.createElement('div'); d.className = 'gfx pk-fx';
  d.innerHTML = '<div class="pk-win">' + (w ? avHtml(w, 110) + '<b>' + esc(w.name) + '</b><span>WIN 🏆</span>' : '<b>تعادل 🤝</b>') + '</div>';
  document.body.appendChild(d); setTimeout(() => d.remove(), 3400); chime(true);
}
// يُستدعى من sendGift: يرجع تحديثات الـ PK لهدية لهذا الشخص
window.pkGiftUpdate = function (uid, val) {
  const p = pkLive(); if (!p || Date.now() > p.end) return null;
  if (p.a.uid === uid) return ['pk.sa', val];
  if (p.b.uid === uid) return ['pk.sb', val];
  return null;
};
