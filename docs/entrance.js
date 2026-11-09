/* حجينه — مؤثرات الدخول للروم */
'use strict';

/* أنواع مؤثرات الدخول */
const ENT_EFFECTS = [
  { id:'ent_diamond', n:'الماس الملتلأ',   k:'sv', r:800,  css:'ent-diamond' },
  { id:'ent_crystal', n:'الكريستال الجليدي', k:'sv', r:600,  css:'ent-crystal' },
  { id:'ent_lightning',n:'تيار الضوء',      k:'sv', r:1000, css:'ent-lightning' },
  { id:'ent_nature',  n:'الحضرة',           k:'sv', r:400,  css:'ent-nature' },
  { id:'ent_royal',   n:'الملكي',           k:'vip', r:2,   css:'ent-royal' },
  { id:'ent_fire',    n:'النار',            k:'vip', r:1,   css:'ent-fire' },
];

/* رسم شريط المؤثر عند الدخول */
let _entQueue = [], _entRunning = false;
function showEntrance(m) {
  if (!m || !m.name) return;
  _entQueue.push(m);
  if (!_entRunning) _entNext();
}
function _entNext() {
  if (!_entQueue.length) { _entRunning = false; return; }
  _entRunning = true;
  const m = _entQueue.shift();
  const eff = ENT_EFFECTS.find(e => e.id === m.ent) || null;
  const box = document.createElement('div');
  box.className = 'ent-banner' + (eff ? ' ' + eff.css : '');
  box.innerHTML =
    '<div class="ent-av">' + avHtml(m, 44) + '</div>' +
    '<div class="ent-info"><span class="ent-name">' + nameHtml(m, true) + '</span>' +
      (eff ? '<span class="ent-eff">' + eff.n + '</span>' : '<span class="ent-eff">دخل الروم</span>') +
    '</div>' +
    (m.vip >= 1 ? '<span class="ent-vip">VIP' + m.vip + '</span>' : '');
  document.body.appendChild(box);
  /* animate in */
  requestAnimationFrame(() => box.classList.add('show'));
  setTimeout(() => {
    box.classList.remove('show'); box.classList.add('hide');
    setTimeout(() => { box.remove(); _entNext(); }, 400);
  }, 2800);
}

/* override onRoomMsg لإظهار مؤثر الدخول */
const _ormE = window.onRoomMsg;
window.onRoomMsg = function(m) {
  if (m.type === 'join') {
    const fresh = !m.ts || (typeof ms !== 'undefined' ? ms(m.ts) : Date.now()) > (R && R.joinTs ? R.joinTs - 3000 : 0);
    if (fresh) showEntrance(m);
  }
  if (_ormE) _ormE.call(this, m);
};

/* ───── صفحة المتجر: مؤثرات الدخول ───── */
function openEntStore() {
  const my = (ME.owned || {});
  const rows = ENT_EFFECTS.map(e => {
    const have = my[e.id] && my[e.id] > Date.now();
    const active = ME.ent === e.id;
    const price = e.k === 'vip'
      ? 'VIP' + e.r
      : '🪙 ' + toAr(e.r);
    return '<div class="es-row' + (active ? ' act' : '') + '">' +
      '<div class="es-prev ' + e.css + '"><span>' + e.n + '</span></div>' +
      '<div class="es-info"><b>' + esc(e.n) + '</b>' +
        (have ? '<small style="color:#2ECC71">✓ تملكه (7 أيام)</small>' : '<small>' + price + '</small>') +
      '</div>' +
      '<button class="btn btn-s es-btn" data-eid="' + e.id + '">' +
        (active ? '✓ نشط' : have ? 'تفعيل' : 'شراء') +
      '</button>' +
    '</div>';
  }).join('');
  const m = modal('<h3>🎭 مؤثرات الدخول</h3><p style="color:var(--fg2);font-size:12.5px">يظهر اسمك مع مؤثر مميز عند دخولك أي روم</p><div class="es-list">' + rows + '</div>');
  m.querySelectorAll('.es-btn').forEach(btn => {
    btn.onclick = async () => {
      const eid = btn.dataset.eid;
      const e = ENT_EFFECTS.find(x => x.id === eid);
      if (!e) return;
      const have = (ME.owned || {})[eid] && (ME.owned || {})[eid] > Date.now();
      /* تفعيل فقط إذا عنده */
      if (have || ME.ent === eid) {
        try {
          await db.collection('users').doc(ME.uid).update({ ent: ME.ent === eid ? '' : eid });
          ME.ent = ME.ent === eid ? '' : eid;
          toast(ME.ent ? '✓ تم تفعيل المؤثر' : 'تم إيقاف المؤثر');
          m.close(); openEntStore();
        } catch (ex) { toast(errMsg(ex)); }
        return;
      }
      /* شراء بالفضية */
      if (e.k === 'sv') {
        if ((ME.silver || 0) < e.r) return toast('عملاتك الفضية ما تكفي');
        try {
          await db.runTransaction(async tx => {
            const s = await tx.get(db.collection('users').doc(ME.uid));
            const sv = (s.data() || {}).silver || 0;
            if (sv < e.r) throw new Error('nobal');
            const exp = Date.now() + 7 * 86400000;
            tx.update(db.collection('users').doc(ME.uid), {
              silver: FV.increment(-e.r),
              ['owned.' + eid]: exp,
              ent: eid
            });
          });
          ME.silver = (ME.silver || 0) - e.r;
          if (!ME.owned) ME.owned = {};
          ME.owned[eid] = Date.now() + 7 * 86400000;
          ME.ent = eid;
          toast('✓ تم شراء مؤثر «' + e.n + '» وتفعيله');
          m.close(); openEntStore();
        } catch (ex) { toast(errMsg(ex)); }
        return;
      }
      /* VIP */
      if (vipOf(ME.recharged || 0) < e.r) return toast('هذا المؤثر يحتاج VIP' + e.r);
      try {
        await db.collection('users').doc(ME.uid).update({ ent: eid });
        ME.ent = eid;
        toast('✓ تم تفعيل مؤثر «' + e.n + '»');
        m.close(); openEntStore();
      } catch (ex) { toast(errMsg(ex)); }
    };
  });
}

/* meLite يضيف ent */
const _mlEnt = window.meLite;
window.meLite = function() {
  const o = _mlEnt();
  if (ME.ent) o.ent = ME.ent;
  return o;
};
