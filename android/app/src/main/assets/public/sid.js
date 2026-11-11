/* حجينه — الآيدي المميز المدفوع */
'use strict';
const SID_T = {
  1: { n: 'أسطوري', c: 't1', ic: '👑' }, 2: { n: 'ملكي', c: 't2', ic: '💎' }, 3: { n: 'ماسي', c: 't3', ic: '✨' }, 4: { n: 'ذهبي', c: 't4', ic: '⭐' }, 5: { n: 'فضي', c: 't5', ic: '🔹' }
};
function sidKind(id) {
  const d = [...id], n = d.length, uniq = new Set(d).size;
  const rep = uniq === 1;
  const seq = n >= 3 && (d.every((x, i) => !i || +x === +d[i - 1] + 1) || d.every((x, i) => !i || +x === +d[i - 1] - 1));
  const pal = n >= 4 && id === d.slice().reverse().join('');
  const abab = n >= 4 && d.every((x, i) => x === d[i % 2]);
  const aabb = n >= 4 && n % 2 === 0 && d.every((x, i) => x === d[i - (i % 2)]);
  const round = /^[1-9]0+$/.test(id) || /^[1-9][0-9]0{3,}$/.test(id);
  return { rep, seq, pat: pal || abab || aabb || round || uniq <= 2 };
}
function sidPrice(id) { // يرجع {p, t} أو null إذا مو مميز
  id = String(id || '');
  if (!/^[1-9]\d{2,7}$/.test(id)) return null;
  const n = id.length, k = sidKind(id);
  if (n === 3) return { p: k.rep ? 90000 : 50000, t: 1 };
  if (n === 4) return { p: k.rep ? 40000 : k.seq || k.pat ? 28000 : 20000, t: 2 };
  if (n === 5) return { p: k.rep ? 20000 : k.seq ? 12000 : k.pat ? 10000 : 8000, t: 3 };
  if (n === 6) return { p: k.rep ? 10000 : k.seq ? 6000 : k.pat ? 5000 : 3000, t: 4 };
  if (n === 7) return { p: k.rep ? 6000 : k.seq ? 4000 : k.pat ? 3000 : 1500, t: 5 };
  if (k.rep) return { p: 4000, t: 5 };
  if (k.seq || (k.pat && new Set(id).size <= 2)) return { p: 2500, t: 5 };
  return null;
}
window.sidHtml = function (hid, big) {
  const s = sidPrice(hid);
  if (!s) return '<span class="sid-n">ID: ' + esc(hid || '') + '</span>';
  const T = SID_T[s.t];
  return '<span class="sid ' + T.c + (big ? ' big' : '') + '"><i>' + T.ic + '</i><b>' + esc(hid) + '</b><em>' + T.n + '</em></span>';
};
// تطبيق الشارة بالملف والبطاقة والبحث
const _renderMeS = window.renderMe;
window.renderMe = function () { _renderMeS.apply(this, arguments); const el = $('meId'); if (el && sidPrice(ME.hid)) el.innerHTML = sidHtml(ME.hid); };
const _ucS = window.userCard;
window.userCard = async function (uid) { await _ucS.apply(this, arguments); const el = document.querySelector('#modals .ov:last-child #uxId'); if (!el) return; let hid = (el.textContent.match(/\d+/) || [])[0]; if (hid && sidPrice(hid)) el.innerHTML = sidHtml(hid, true) + ' <span>⧉</span>'; };

function sidSuggest(len) {
  const out = new Set(), r = k => Math.floor(Math.random() * k);
  const add = s => { if (s.length === len && sidPrice(s)) out.add(s); };
  for (let i = 1; i <= 9; i++) add(String(i).repeat(len));
  for (let s = 1; s + len - 1 <= 9; s++) add(Array.from({ length: len }, (_, i) => s + i).join(''));
  for (let s = 9; s - len + 1 >= 0; s--) add(Array.from({ length: len }, (_, i) => s - i).join(''));
  let guard = 0; while (out.size < 18 && guard++ < 400) {
    const a = 1 + r(9), b = r(10), kind = r(4); let s;
    if (kind === 0) s = Array.from({ length: len }, (_, i) => i % 2 ? b : a).join('');
    else if (kind === 1) s = String(a) + '0'.repeat(len - 1);
    else if (kind === 2) s = String(a) + String(b).repeat(len - 1);
    else s = String(1 + r(9)) + Array.from({ length: len - 1 }, () => r(10)).join('');
    add(s);
  }
  return [...out].slice(0, 18).sort((x, y) => sidPrice(y).p - sidPrice(x).p);
}
window.openSID = function () {
  let len = 5;
  const m = modal('<div class="sd"><div class="sd-hd"><button class="rk-ic" id="sdBk">→</button><b>الآيدي المميز</b><span class="sd-bal">◆ ' + (ME.diamonds || 0).toLocaleString('en') + '</span></div>' +
    '<div class="sd-hero"><small>الآيدي مالتك هسه</small><div class="sd-cur">' + sidHtml(ME.hid, true) + '</div><p>اختار رقم مميز يبين بكل مكان: ملفك، بطاقتك، والبحث. كلما كان الرقم أقصر أو أحلى يصير أندر.</p></div>' +
    '<div class="sd-search"><input id="sdQ" inputmode="numeric" maxlength="8" placeholder="اكتب الرقم اللي تريده" style="direction:ltr"><button id="sdGo">تحقق</button></div><div id="sdRes"></div>' +
    '<div class="sd-tabs">' + [3, 4, 5, 6, 7].map(n => '<button data-l="' + n + '">' + toAr(n) + ' أرقام</button>').join('') + '</div><div class="sd-grid" id="sdG"></div>' +
    '<div class="sd-rules"><b>ملاحظات</b><ul><li>الآيدي المميز إلك للأبد، وما يقدر أحد ياخذه منك.</li><li>إذا بدلت لآيدي مميز ثاني، القديم يرجع متاح للناس.</li><li>الماسات اللي تندفع ما ترجع.</li><li>بعد التبديل، لا تنسى تكتب الآيدي الجديد من تشحن.</li></ul></div></div>', 'full sdfull');
  m.querySelector('#sdBk').onclick = () => m.close();
  const cell = id => { const s = sidPrice(id); return '<button class="sd-c ' + SID_T[s.t].c + '" data-id="' + id + '"><b>' + id + '</b><small>◆ ' + s.p.toLocaleString('en') + '</small></button>'; };
  const grid = () => { m.querySelectorAll('.sd-tabs button').forEach(b => b.classList.toggle('on', +b.dataset.l === len)); m.querySelector('#sdG').innerHTML = sidSuggest(len).map(cell).join(''); };
  m.querySelector('.sd-tabs').onclick = e => { const b = e.target.closest('[data-l]'); if (b) { len = +b.dataset.l; grid(); } };
  m.querySelector('#sdG').onclick = e => { const b = e.target.closest('[data-id]'); if (b) sidBuy(b.dataset.id, m); };
  const check = () => { const q = m.querySelector('#sdQ').value.replace(/\D/g, ''), s = sidPrice(q), box = m.querySelector('#sdRes');
    if (!q) { box.innerHTML = ''; return; }
    box.innerHTML = s ? '<div class="sd-r">' + sidHtml(q, true) + '<span>◆ ' + s.p.toLocaleString('en') + '</span><button id="sdB">اشتري</button></div>' : '<div class="sd-r bad">هذا الرقم مو مميز. لازم يكون من ٣ لـ ٧ أرقام، أو ٨ أرقام مكررة أو متسلسلة، وما يبدي بصفر.</div>';
    const b = box.querySelector('#sdB'); if (b) b.onclick = () => sidBuy(q, m); };
  m.querySelector('#sdGo').onclick = check; m.querySelector('#sdQ').oninput = check;
  grid();
};
async function sidBuy(id, store) {
  const s = sidPrice(id); if (!s) return;
  if (id === ME.hid) return toast('هذا الآيدي مالتك أصلاً');
  const have = ME.diamonds || 0;
  const m = modal('<h3>🆔 آيدي مميز</h3><div class="vip-demo">' + sidHtml(id, true) + '<b>مستوى ' + SID_T[s.t].n + '</b></div><div style="text-align:center;color:var(--fg2);font-size:13px">السعر: ◆ ' + s.p.toLocaleString('en') + ' · رصيدك: ◆ ' + have.toLocaleString('en') + '<br>الآيدي الحالي (' + esc(ME.hid || '') + ') راح يتبدل</div>' +
    (have >= s.p ? '<button class="btn btn-p" id="sbG">اشتري وبدّل الآيدي</button>' : '<button class="btn btn-p" id="sbR">💎 تحتاج ◆ ' + (s.p - have).toLocaleString('en') + ' بعد، اشحن</button>'));
  const r = m.querySelector('#sbR'); if (r) r.onclick = () => { m.close(); store.close(); openRecharge(); };
  const g = m.querySelector('#sbG'); if (!g) return;
  g.onclick = async () => {
    g.disabled = true; g.textContent = '⏳ دا نتأكد...';
    try {
      const q = await db.collection('users').where('hid', '==', id).limit(1).get(); if (!q.empty) throw new Error('taken');
      const me = db.collection('users').doc(ME.uid), sref = db.collection('specialIds').doc(id), old = ME.hid;
      await db.runTransaction(async tx => {
        const sd = await tx.get(sref); if (sd.exists) throw new Error('taken');
        const d = (await tx.get(me)).data(); if ((d.diamonds || 0) < s.p) throw new Error('nobal');
        tx.set(sref, { uid: ME.uid, name: ME.name, price: s.p, ts: Date.now() });
        tx.update(me, { diamonds: d.diamonds - s.p, hid: id, hidOld: old || '' });
        if (old && sidPrice(old)) tx.delete(db.collection('specialIds').doc(old));
      });
      ME.hid = id; ME.diamonds = have - s.p; m.close(); store.close(); renderMe();
      const c = modal('<div class="vip-demo"><div style="font-size:46px">🎉</div><b>مبروك! صار الآيدي مالتك</b>' + sidHtml(id, true) + '</div><button class="btn btn-p" id="sbOk">تمام</button>'); c.querySelector('#sbOk').onclick = () => c.close(); chime(true);
    } catch (e) { g.disabled = false; g.textContent = 'اشتري وبدّل الآيدي'; toast(e.message === 'taken' ? '😔 هذا الآيدي محجوز، اختار غيره' : e.message === 'nobal' ? 'الماسات ما تكفي' : errMsg(e)); }
  };
}
