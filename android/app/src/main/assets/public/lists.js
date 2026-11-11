/* حجينه — قوائم المتابعين واللي يتابعهم، وصفحة الجاذبية */
'use strict';
function peopleRows(list, empty) {
  if (!list.length) return '<div class="empty"><div class="e">👥</div><b>' + empty + '</b></div>';
  return list.map(u => '<div class="ci" data-u="' + esc(u.uid) + '" style="cursor:pointer">' + avHtml(u, 42) + '<div class="ci-m"><div class="ci-n">' + esc(u.name || '') + '</div>' +
    (u.sub ? '<div class="ci-l">' + u.sub + '</div>' : '') + '</div>' + (u.rank ? '<b class="pp-rk">' + u.rank + '</b>' : '') + '</div>').join('');
}
function bindPeople(m) { m.addEventListener('click', e => { const r = e.target.closest('[data-u]'); if (!r) return; m.close(); userCard(r.dataset.u); }); }

window.openPeople = async function (kind, uid) {
  uid = uid || ME.uid; const mine = uid === ME.uid;
  const title = kind === 'followers' ? '👥 المتابعون' : '➕ يتابع';
  const m = modal('<h3>' + title + '</h3><div id="ppL"><div class="empty">⏳ لحظة...</div></div>');
  let list = [];
  try {
    const s = await db.collection('users').doc(uid).collection(kind).orderBy('ts', 'desc').limit(200).get();
    list = s.docs.map(d => Object.assign({ uid: d.id }, d.data()));
  } catch (e) {
    try { const s = await db.collection('users').doc(uid).collection(kind).limit(200).get(); list = s.docs.map(d => Object.assign({ uid: d.id }, d.data())); } catch (e2) {}
  }
  list.forEach(u => { if (u.ts && u.ts.toMillis) u.sub = (kind === 'followers' ? 'تابع ' : 'من ') + ago(u.ts.toMillis()); });
  const box = m.querySelector('#ppL'); if (!box) return;
  box.innerHTML = peopleRows(list, kind === 'followers' ? (mine ? 'بعد ماكو أحد يتابعك' : 'ماكو متابعين') : (mine ? 'بعدك ما تابعت أحد' : 'ما يتابع أحد'));
  bindPeople(m);
};

window.openCharm = async function (uid) {
  uid = uid || ME.uid; const mine = uid === ME.uid;
  let u = ME; if (!mine) { try { const s = await db.collection('users').doc(uid).get(); u = Object.assign({ uid }, s.data()); } catch (e) { return toast(errMsg(e)); } }
  const gw = Object.entries(u.gw || {}).filter(([, n]) => n > 0).map(([k, n]) => [giftBy(k), n]).filter(([g]) => g).sort((a, b) => b[0].p * b[1] - a[0].p * a[1]);
  const gcount = gw.reduce((a, [, n]) => a + n, 0);
  const m = modal('<h3>💗 الجاذبية</h3><div class="earn-box"><small>' + (mine ? 'جاذبيتك' : 'جاذبية ' + esc(u.name || '')) + '</small><b>💗 ' + (u.charm || 0).toLocaleString('en') + '</b><span>تزيد كل ما يوصلك هدية</span></div>' +
    '<div class="tabs2 ch-t"><button class="on" data-t="g">🎁 الهدايا (' + toAr(gcount) + ')</button><button data-t="s">🏆 الداعمين</button></div><div id="chB"></div>');
  const box = m.querySelector('#chB');
  const gifts = () => { box.innerHTML = gw.length ? '<div class="ch-g">' + gw.map(([g, n]) => '<div><img src="' + gArt(g) + '" alt=""><b>×' + fmtK(n) + '</b><small>' + esc(g.n) + '</small></div>').join('') + '</div>' : '<div class="empty"><div class="e">🎁</div><b>بعد ما وصلت هدايا</b><span>الهدايا اللي توصل تبين هنا</span></div>'; };
  const sups = async () => {
    box.innerHTML = '<div class="empty">⏳ لحظة...</div>'; let list = [];
    try { const s = await db.collection('users').doc(uid).collection('supporters').orderBy('amt', 'desc').limit(50).get(); list = s.docs.map(d => Object.assign({ uid: d.id }, d.data())); } catch (e) {}
    const medal = ['🥇', '🥈', '🥉'];
    list.forEach((x, i) => { x.sub = '💗 ' + fmtK(x.amt || 0); x.rank = medal[i] || toAr(i + 1); });
    box.innerHTML = peopleRows(list, 'بعد ماكو داعمين');
  };
  m.querySelector('.ch-t').onclick = e => { const b = e.target.closest('button'); if (!b) return; m.querySelectorAll('.ch-t button').forEach(x => x.classList.toggle('on', x === b)); b.dataset.t === 'g' ? gifts() : sups(); };
  gifts(); bindPeople(m);
};

// يرجّع قائمة المتابعين القديمة: كل واحد يكتب نفسه بقائمة متابعين اللي يتابعهم (مرة وحدة)
setTimeout(async function backfill() {
  if (typeof ME === 'undefined' || !ME || !ME.uid) return setTimeout(backfill, 4000);
  try { if (localStorage.getItem('hj_fbf_' + ME.uid)) return; } catch (e) { return; }
  try {
    const s = await db.collection('users').doc(ME.uid).collection('following').get();
    await Promise.all(s.docs.map(d => db.collection('users').doc(d.id).collection('followers').doc(ME.uid).set({ name: ME.name, color: ME.color || '', ts: (d.data().ts || FV.serverTimestamp()) }, { merge: true })));
    localStorage.setItem('hj_fbf_' + ME.uid, '1');
  } catch (e) {}
}, 5000);
