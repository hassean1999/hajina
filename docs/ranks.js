/* حجينه — قوائم الترتيب: الأغنياء، المشاهير، مجد PK (يومي/أسبوعي/شهري) والمكافآت */
'use strict';
const BT = 3 * 3600e3; // توقيت بغداد
const pad2 = n => String(n).padStart(2, '0');
function rkPeriod(per, off) { // يرجع {key, end}
  const now = new Date(Date.now() + BT);
  let y = now.getUTCFullYear(), mo = now.getUTCMonth(), d = now.getUTCDate();
  if (per === 'd') { const s = Date.UTC(y, mo, d - (off || 0)), e = s + 864e5; const t = new Date(s); return { key: 'd' + t.getUTCFullYear() + pad2(t.getUTCMonth() + 1) + pad2(t.getUTCDate()), end: e - BT }; }
  if (per === 'w') { const dow = (now.getUTCDay() + 1) % 7; const s = Date.UTC(y, mo, d - dow - 7 * (off || 0)), t = new Date(s); return { key: 'w' + t.getUTCFullYear() + pad2(t.getUTCMonth() + 1) + pad2(t.getUTCDate()), end: s + 7 * 864e5 - BT }; } // الأسبوع يبدي السبت
  const s = Date.UTC(y, mo - (off || 0), 1), t = new Date(s); return { key: 'm' + t.getUTCFullYear() + pad2(t.getUTCMonth() + 1), end: Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 1) - BT };
}
const rkRef = (type, key) => db.collection('ranks').doc(type + '_' + key).collection('u');
function rkLite(u) { const o = { name: u.name || '', color: u.color || '', pv: u.pv || 0, vip: u.vip || 0 }; if (u.fr) o.fr = u.fr; if (u.lv) o.lv = u.lv; if (u.pl) o.pl = u.pl; if (u.sup) o.sup = u.sup; return o; }
function rkAdd(type, id, info, v) {
  if (!v) return;
  ['d', 'w', 'm'].forEach(p => rkRef(type, rkPeriod(p).key).doc(id).set(Object.assign(rkLite(info), { v: FV.increment(v), ts: Date.now() }), { merge: true }).catch(() => {}));
}
window.rankGift = function (diam, heart, targets) {
  const me = Object.assign(meLite(), { lv: lvlOf(ME.xp) });
  if (diam) rkAdd('rich', ME.uid, me, diam);
  targets.forEach(t => { if (t.uid === ME.uid) return; const s = (R.data && (R.data.seats || []).find(x => x && x.uid === t.uid)) || (R.members || {})[t.uid] || t; rkAdd('fame', t.uid, Object.assign({ uid: t.uid }, s), heart); });
};
const rkU = u => { const o = { uid: u.uid, name: u.name || '', color: u.color || '', pv: u.pv || 0, v: u.v || 0 }; if (u.fr) o.fr = u.fr; return o; };
function rkPK(pts, pl, sup) { if (!R.id || !pts) return; rkAdd('pk', R.id, { name: R.data.title || 'روم', color: R.data.ownerColor || '#FF8A1F', pv: 0, pl: (pl || []).slice(0, 4).map(rkU), sup: (sup || []).slice(0, 3).map(rkU) }, pts); }
const _pkFinR = window.pkFinish;
if (_pkFinR) window.pkFinish = async function () { const p = R.data && R.data.pk; const r = await _pkFinR.apply(this, arguments); if (p && !p.done) rkPK((p.sa || 0) + (p.sb || 0), [Object.assign({}, p.a, { v: p.sa || 0 }), Object.assign({}, p.b, { v: p.sb || 0 })].sort((x, y) => y.v - x.v), []); return r; };
const _tpFinR = window.tpFinish;
if (_tpFinR) window.tpFinish = async function () { const t = R.data && R.data.tpk; const r = await _tpFinR.apply(this, arguments); if (t && !t.done) { const seats = R.data.seats || [], rc = t.rcv || {}; const pl = [1, 2, 3, 4, 5, 6, 7, 8].map(i => seats[i]).filter(Boolean).map(s => Object.assign({}, s, { v: rc[s.uid] || 0 })).sort((x, y) => y.v - x.v); rkPK((t.sa || 0) + (t.sb || 0), pl, tpSups(t)); } return r; };

const RK_T = { rich: { n: 'الأغنياء', u: 'قيمة المساهمة', fr: 'rk_rich' }, fame: { n: 'المشاهير', u: 'الكاريزما', fr: 'rk_star' }, pk: { n: 'مجد PK', u: 'نقاط PK', fr: 'rk_pk' } };
const RK_P = { d: ['القائمة اليومية', 1, '24 ساعة'], w: ['القائمة الأسبوعية', 7, '7 أيام'], m: ['القائمة الشهرية', 30, '30 يوم'] };
let RKS = { type: 'rich', per: 'd', off: 0 };
window.openRich = window.openRank = function (type) {
  RKS = { type: type || 'rich', per: 'd', off: 0 };
  const m = modal('<div class="rk"><div class="rk-hd"><button class="rk-ic" id="rkBk">→</button><div class="rk-tabs">' + Object.entries(RK_T).map(([k, t]) => '<button data-t="' + k + '">' + t.n + '</button>').join('') + '</div><button class="rk-ic" id="rkQ">?</button></div>' +
    '<div class="rk-per">' + Object.entries(RK_P).map(([k, p]) => '<button data-p="' + k + '">' + p[0] + '</button>').join('') + '</div><div id="rkBody"></div></div>', 'full rkfull');
  m.querySelector('#rkBk').onclick = () => m.close();
  m.querySelector('#rkQ').onclick = () => openRkRules();
  m.querySelector('.rk-tabs').onclick = e => { const b = e.target.closest('[data-t]'); if (!b) return; RKS.type = b.dataset.t; RKS.off = 0; draw(); };
  m.querySelector('.rk-per').onclick = e => { const b = e.target.closest('[data-p]'); if (!b) return; RKS.per = b.dataset.p; RKS.off = 0; draw(); };
  let timer = null;
  const draw = async () => {
    clearInterval(timer);
    m.querySelectorAll('.rk-tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === RKS.type));
    m.querySelector('.rk').className = 'rk th-' + RKS.type;
    m.querySelectorAll('.rk-per button').forEach(b => b.classList.toggle('on', b.dataset.p === RKS.per));
    const body = m.querySelector('#rkBody'), T = RK_T[RKS.type], per = rkPeriod(RKS.per, RKS.off);
    body.innerHTML = '<div class="empty" style="padding:60px 0">⏳ لحظة...</div>';
    let list = [];
    try { const s = await rkRef(RKS.type, per.key).orderBy('v', 'desc').limit(50).get(); list = s.docs.map(d => Object.assign({ uid: d.id }, d.data())); } catch (e) {}
    const isRoom = RKS.type === 'pk', top = list[0];
    const lvB = u => (u.lv ? '<span class="rk-lv">⭐ ' + toAr(u.lv) + '</span>' : '') + (u.vip ? '<span class="rk-vip v' + u.vip + '">VIP' + u.vip + '</span>' : '');
    const av = (u, s) => isRoom ? '<div class="rk-room" style="width:' + s + 'px;height:' + s + 'px;background:' + esc(u.color || '#FF8A1F') + '">🏠</div>' : avHtml(u, s);
    const hero = top ? '<div class="rk-hero" data-u="' + esc(top.uid) + '"><div class="rk-hav">' + (isRoom ? av(top, 120) : avHtml(Object.assign({}, top, { fr: T.fr }), 120)) + '<span class="rk-n1">1</span></div><b class="rk-hn">' + esc(top.name) + '</b><div class="rk-bs">' + lvB(top) + '</div><div class="rk-hv">' + fmtK(top.v) + '</div></div>'
      : '<div class="rk-hero empty"><div class="rk-hav">' + avHtml({ name: '؟', color: '#C8902A', fr: T.fr }, 120) + '<span class="rk-n1">1</span></div><b class="rk-hn">المركز الأول ينتظرك!</b><div class="rk-hv" style="font-size:16px">' + (RKS.type === 'rich' ? 'دز هدايا وتصدّر' : RKS.type === 'fame' ? 'اجمع هدايا وتصدّر' : 'سوّوا PK برومكم') + '</div></div>';
    const cr = i => i === 1 ? '<span class="rk-cr s"><img src="fx/crown.webp" alt=""><i>2</i></span>' : i === 2 ? '<span class="rk-cr b"><img src="fx/crown.webp" alt=""><i>3</i></span>' : '<span class="rk-no">' + toAr(i + 1) + '</span>';
    const rows = list.slice(1).map((u, k) => { const i = k + 1; return '<div class="rk-r' + (i === 1 ? ' r2' : i === 2 ? ' r3' : '') + (u.uid === ME.uid ? ' me' : '') + '" data-u="' + esc(u.uid) + '">' + cr(i) + av(u, 50) + '<div class="rk-ri"><b>' + esc(u.name) + '</b><div class="rk-bs">' + lvB(u) + '</div></div><div class="rk-rv"><b>' + fmtK(u.v) + '</b><small>' + T.u + '</small></div></div>'; }).join('');
    const myId = isRoom ? (R.id || '') : ME.uid, myI = list.findIndex(x => x.uid === myId);
    if (isRoom) {
      const tops = ['gold', 'silver', 'bronze'];
      const card = (r, i) => '<div class="pkc c' + Math.min(i, 3) + '"><div class="pkc-hd"><div class="pkc-v"><b>' + (r.v || 0).toLocaleString('en') + ' <i class="pkb">PK</i></b><button data-u="' + esc(r.uid) + '">🎙️ ادخل الروم</button></div><div class="pkc-rk ' + (tops[i] || '') + '">' + (i < 3 ? '<img src="fx/crown.webp" alt=""><b>TOP ' + (i + 1) + '</b>' : '<b class="n">' + toAr(i + 1) + '</b>') + '</div></div>' +
        '<div class="pkc-room" data-u="' + esc(r.uid) + '">' + av(r, 40) + '<b>' + esc(r.name) + '</b></div>' +
        ((r.pl || []).length ? '<div class="pkc-pl">' + r.pl.map(u => '<div data-pu="' + esc(u.uid) + '">' + avHtml(u, 54) + '<b>' + esc(u.name) + '</b><small>' + (u.v || 0).toLocaleString('en') + ' <i class="pkb">PK</i></small></div>').join('') + '</div>' : '') +
        ((r.sup || []).length ? '<div class="pkc-st">مساهمة الفائزين</div><div class="pkc-sup">' + r.sup.map((u, k) => '<div data-pu="' + esc(u.uid) + '"><span class="pkc-sa">' + avHtml(u, 40) + (k ? '' : '<em>MVP</em>') + '</span><div><b>' + esc(u.name) + '</b><small>' + (u.v || 0).toLocaleString('en') + '</small></div></div>').join('') + '</div>' : '') + '</div>';
      body.innerHTML = '<div class="pk-top"><div class="pk-cd">' + (RKS.off ? '📜 القائمة النهائية' : 'مدة تصدر القائمة: <b id="rkCd"></b>') + '</div><button id="rkY">' + (RKS.off ? '⬅️ الحالية' : '🏆 السابقة') + '</button></div><div class="pk-list">' +
        (list.length ? list.map(card).join('') : '<div class="pkc c0" style="text-align:center;padding:40px 16px"><img src="fx/crown.webp" alt="" style="width:70px"><b style="display:block;font-size:17px;margin-top:8px">بعد ماكو رومات بمجد PK</b><small style="color:#8A7A9A">سوّوا تحدي PK أو PK الفرق برومكم، ونقاطه تنحسب هنا</small></div>') + '</div>';
      body.querySelector('#rkY').onclick = () => { RKS.off = RKS.off ? 0 : 1; draw(); };
      body.querySelectorAll('[data-u]').forEach(el => el.onclick = () => { m.close(); enterRoom(el.dataset.u); });
      body.querySelectorAll('[data-pu]').forEach(el => el.onclick = e => { e.stopPropagation(); userCard(el.dataset.pu); });
      if (!RKS.off) { const cd = () => { const el = body.querySelector('#rkCd'); if (!el) return clearInterval(timer); const l = Math.max(0, per.end - Date.now()), h = Math.floor(l / 36e5); el.textContent = (h >= 24 ? toAr(Math.floor(h / 24)) + ' يوم ' : '') + pad2(h % 24) + ':' + pad2(Math.floor(l / 6e4) % 60) + ':' + pad2(Math.floor(l / 1e3) % 60); }; cd(); timer = setInterval(cd, 1000); }
      return;
    }
    body.innerHTML = '<div class="rk-top">' + (RKS.off ? '<div class="rk-yest">📜 ' + (RKS.per === 'd' ? 'قائمة الأمس' : RKS.per === 'w' ? 'الأسبوع الفائت' : 'الشهر الفائت') + '</div>' : '') + hero + '</div>' +
      '<div class="rk-panel"><div class="rk-ph"><span>' + (RKS.off ? 'القائمة النهائية' : 'باقي على نهاية القائمة: <b id="rkCd"></b>') + '</span><button id="rkY">' + (RKS.off ? '⬅️ الحالية' : '🏆 ' + (RKS.per === 'd' ? 'قائمة الأمس' : 'القائمة السابقة')) + '</button></div>' +
      (rows || '<div class="empty"><span>' + (list.length ? '' : 'بعد ماكو أحد بهذي القائمة') + '</span></div>') + '</div>' +
      (!isRoom || R.id ? '<div class="rk-mine">' + (myI >= 0 ? '<span class="rk-no">' + toAr(myI + 1) + '</span>' : '<span class="rk-no">-</span>') + (isRoom ? av({ color: (R.data || {}).ownerColor }, 40) : avHtml(meLite(), 40)) + '<b>' + (isRoom ? esc((R.data || {}).title || '') : 'أنا') + '</b><span>' + (myI >= 0 ? fmtK(list[myI].v) : 'مو بالقائمة') + '</span></div>' : '');
    body.querySelector('#rkY').onclick = () => { RKS.off = RKS.off ? 0 : 1; draw(); };
    body.querySelectorAll('[data-u]').forEach(el => el.onclick = () => { if (isRoom) { m.close(); enterRoom(el.dataset.u); } else userCard(el.dataset.u); });
    if (!RKS.off) { const cd = () => { const el = body.querySelector('#rkCd'); if (!el) return clearInterval(timer); const l = Math.max(0, per.end - Date.now()), h = Math.floor(l / 36e5); el.textContent = (h >= 24 ? toAr(Math.floor(h / 24)) + ' يوم ' : '') + pad2(h % 24) + ':' + pad2(Math.floor(l / 6e4) % 60) + ':' + pad2(Math.floor(l / 1e3) % 60); }; cd(); timer = setInterval(cd, 1000); }
  };
  draw();
};
function openRkRules() {
  let t = RKS.type, p = RKS.per === 'm' ? 'm' : RKS.per;
  const m = modal('<div class="rkr"><h3>المكافآت والتفاصيل</h3><div class="rkr-box"><div class="rkr-ttl">مكافآت المركز الأول</div><div class="rk-tabs sm">' + Object.entries(RK_T).map(([k, x]) => '<button data-t="' + k + '">' + x.n + '</button>').join('') + '</div><div class="rk-per sm">' + Object.entries(RK_P).map(([k, x]) => '<button data-p="' + k + '">' + x[0] + '</button>').join('') + '</div><div id="rkrR"></div></div>' +
    '<div class="rkr-box"><div class="rkr-ttl">شرح القواعد</div><ul class="rkr-ul">' +
    '<li><b>الأغنياء:</b> الترتيب حسب قيمة الماسات اللي يدزها كل شخص هدايا.</li><li><b>المشاهير:</b> الترتيب حسب الكاريزما اللي يجمعها كل شخص من الهدايا اللي توصله.</li>' +
    '<li><b>مجد PK:</b> الترتيب للرومات، حسب نقاط تحديات PK اللي تصير بيها.</li><li>القائمة اليومية تتجدد كل يوم الساعة ١٢ بالليل بتوقيت بغداد، والأسبوعية كل سبت، والشهرية أول كل شهر.</li>' +
    '<li>الترتيب يتحدث مباشرة، وتكدر تشوف قائمة الأمس من زر «قائمة الأمس».</li><li>المكافأة توصل للمركز الأول تلقائياً من يفتح التطبيق بعد ما تخلص القائمة، وتبدي مدتها من وكتها.</li><li>إذا أخذت نفس المكافأة أكثر من مرة، تنضاف المدة على اللي باقي.</li></ul></div></div>', 'rkr-sh');
  const draw = () => {
    m.querySelectorAll('.rk-tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === t)); m.querySelectorAll('.rk-per button').forEach(b => b.classList.toggle('on', b.dataset.p === p));
    const T = RK_T[t], P = RK_P[p];
    m.querySelector('#rkrR').innerHTML = '<div class="rkr-g"><div><div class="rkr-pv">' + avHtml({ name: ME.name, color: ME.color, uid: ME.uid, pv: ME.pv, fr: T.fr }, 76) + '</div><b>إطار «' + frById(T.fr).n + '»</b><small>' + P[2] + '</small></div><div><div class="rkr-pv"><img src="fx/' + (t === 'rich' ? 'gem' : t === 'fame' ? 'heart' : 'crown') + '.webp" alt="" style="width:76px"></div><b>وسام «' + (t === 'rich' ? 'ملك الثراء' : t === 'fame' ? 'نجم المشاهير' : 'بطل PK') + '»</b><small>بجدار الأوسمة</small></div></div>' + (t === 'pk' ? '<p class="rkr-n">مكافأة مجد PK تروح لصاحب الروم الأول.</p>' : '');
  };
  m.querySelector('.rk-tabs').onclick = e => { const b = e.target.closest('[data-t]'); if (b) { t = b.dataset.t; draw(); } };
  m.querySelector('.rk-per').onclick = e => { const b = e.target.closest('[data-p]'); if (b) { p = b.dataset.p; draw(); } };
  draw();
}

/* ---------- إطارات المكافآت ---------- */
FRAMES.push({ id: 'rk_rich', n: 'ملك الثراء', k: 'rk', r: 'rich', a: 1, t: 'k' }, { id: 'rk_star', n: 'نجم المشاهير', k: 'rk', r: 'fame', a: 1, t: 'k' }, { id: 'rk_pk', n: 'بطل PK', k: 'rk', r: 'pk', a: 1, t: 'k' });
Object.assign(FX_CLS, { rk_rich: 'aura', rk_star: 'aura amet', rk_pk: 'aura ice' });
const _reqTxt = window.reqTxt;
window.reqTxt = function (it) { return it.k === 'rk' ? '🏆 المركز الأول ب' + RK_T[it.r].n : _reqTxt(it); };
// أوسمة الترتيب
if (window.MEDALS || typeof MEDALS !== 'undefined') MEDALS.push(
  { k: 'rk_rich', n: 'ملك الثراء', i: 'fx/gem', ok: u => ((u.titles || {}).rich || 0) > 0, r: 'المركز الأول بالأغنياء' },
  { k: 'rk_fame', n: 'نجم المشاهير', i: 'fx/heart', ok: u => ((u.titles || {}).fame || 0) > 0, r: 'المركز الأول بالمشاهير' },
  { k: 'rk_pk', n: 'بطل PK', i: 'fx/crown', ok: u => ((u.titles || {}).pk || 0) > 0, r: 'روم بالمركز الأول بمجد PK' });

/* ---------- توزيع المكافآت تلقائياً ---------- */
setTimeout(async function rkClaim() {
  if (typeof ME === 'undefined' || !ME || !ME.uid) return setTimeout(rkClaim, 5000);
  let done = {}; try { done = JSON.parse(localStorage.getItem('hj_rkc_' + ME.uid) || '{}'); } catch (e) {}
  let myRoom = null; try { const q = await db.collection('rooms').where('ownerUid', '==', ME.uid).limit(1).get(); if (!q.empty) myRoom = q.docs[0].id; } catch (e) {}
  const upd = {}, got = [];
  for (const type of ['rich', 'fame', 'pk']) for (const per of ['d', 'w', 'm']) {
    const P = rkPeriod(per, 1), tag = type + '_' + P.key; if (done[tag]) continue;
    const id = type === 'pk' ? myRoom : ME.uid; if (!id) continue;
    try { const s = await rkRef(type, P.key).orderBy('v', 'desc').limit(1).get(); done[tag] = 1;
      if (!s.empty && s.docs[0].id === id) { const fr = RK_T[type].fr, base = Math.max(Date.now(), ((ME.owned || {})[fr] || 0), upd['owned.' + fr] || 0);
        upd['owned.' + fr] = base + RK_P[per][1] * 864e5; upd['titles.' + type] = FV.increment(1); got.push(RK_T[type].n + ' (' + RK_P[per][0] + ')'); } } catch (e) {}
  }
  try { localStorage.setItem('hj_rkc_' + ME.uid, JSON.stringify(done)); } catch (e) {}
  if (!got.length) return;
  try { await db.collection('users').doc(ME.uid).update(upd); Object.keys(upd).forEach(k => { if (k.startsWith('owned.')) { ME.owned = Object.assign({}, ME.owned, { [k.slice(6)]: upd[k] }); } });
    const m = modal('<h3>🏆 مبروك! كنت الأول</h3><p style="text-align:center;color:var(--fg2)">' + got.map(esc).join('<br>') + '</p><div class="vip-demo">' + avHtml(Object.assign(meLite(), { fr: RK_T[got[0].includes('المشاهير') ? 'fame' : got[0].includes('PK') ? 'pk' : 'rich'].fr }), 90) + '<b>وصلتك مكافأة الإطار ووسام بجدارك</b></div><button class="btn btn-p" id="rkW">لبس الإطار</button>');
    m.querySelector('#rkW').onclick = () => { m.close(); openStore('fr', 'k'); };
  } catch (e) {}
}, 6000);
