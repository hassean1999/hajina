/* حجينه — لوحة الهدايا المتطورة (نفس فكرة وياي) */
'use strict';

/* ───── ثوابت ───── */
const G3_QTY  = [1, 10, 66, 99, 188, 520, 1314];
const G3_BAG_FREE_KEY = 'hj_bagfree_';

/* هدايا تحمل شارة "جديد" (أحدث 20 هدية بالترتيب العكسي) */
const G3_NEW  = new Set(GIFTS.slice(-20).map(g => g.k));
/* هدايا مفاجأة (بشكل دوري) */
const G3_SURP = new Set(['dragon','unicorn','ufo','goldrose','roses','fireworks','whale','shark','eagle']);
/* هدايا أرستقراطية (فاخرة، سعرها ≥ 500) */
const G3_LUX  = GIFTS.filter(g => g.p >= 500);

/* ───── فتح اللوحة ───── */
window.openGifts = function (preUid) {
  if (!R || !R.id) return;

  /* ── المستلمون: المقاعد المشغولة عدا أنا ── */
  const seated = (R.data.seats || [])
    .map((s, i) => s && s.uid !== ME.uid ? Object.assign({ si: i }, s) : null)
    .filter(Boolean);

  /* المختارون مبدئياً */
  let sel = new Set(preUid ? [preUid] : seated.map(s => s.uid));
  let gTab = 'pop';   // pop | lux | bag
  let sortAsc = false;
  let gi = 0;         // index في القائمة الحالية
  let bagData = {};   // {k: count} من Firestore

  /* ── مشروع اللوحة ── */
  const m = modal(
    '<div class="g3-wrap">' +
      /* صف المستلمين */
      '<div class="g3-to"><span>إلى</span><div class="g3-avs" id="g3Avs"></div>' +
        '<button class="g3-all" id="g3All">الكل</button></div>' +
      /* التبويبات */
      '<div class="g3-tabs">' +
        '<button class="on" data-gt="pop">شائع <span class="g3-sort" id="g3Sort">↕</span></button>' +
        '<button data-gt="lux">الأرستقراطية</button>' +
        '<div class="g3-sep"></div>' +
        '<button data-gt="bag">الحقيبة 👜</button>' +
      '</div>' +
      /* الشبكة */
      '<div class="g3-grid" id="g3Grid"></div>' +
      /* الشريط السفلي */
      '<div class="g3-bar">' +
        '<div class="g3-balbox">' +
          '<span class="g3-dbal" id="g3Dbal">0 ◆</span><button class="g3-ch" onclick="openRecharge()">شحن ›</button>' +
        '</div>' +
        '<span class="g3-sbal" id="g3Sbal">0 🪙</span>' +
        '<div class="g3-send">' +
          '<select id="g3Q">' + G3_QTY.map(q => '<option' + (q===1?' selected':'') + '>' + q + '</option>').join('') + '</select>' +
          '<button class="g3-sbtn" id="g3S">إرسال</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  /* ── قائمة الهدايا حسب التبويب ── */
  const list = () => {
    if (gTab === 'lux') return G3_LUX;
    if (gTab === 'bag') {
      return Object.entries(bagData)
        .filter(([, c]) => c > 0)
        .map(([k, c]) => Object.assign({ _cnt: c }, giftBy(k)))
        .filter(g => g.k)
        .sort((a, b) => a.p - b.p);
    }
    /* شائع: كل الهدايا + الفضية، مرتبة حسب الشعبية (السعر) */
    const all = GIFTS.concat(SGIFTS);
    return sortAsc ? all.slice().sort((a, b) => a.p - b.p) : all.slice().sort((a, b) => b.p - a.p);
  };

  /* ── بناء الشبكة ── */
  const renderGrid = () => {
    const ls = list();
    if (!ls.length) {
      $('g3Grid').innerHTML = '<div class="g3-empty"><div>👜</div><span>حقيبتك فارغة</span><small>تلقى هدايا تنحفظ هنا</small></div>';
      return;
    }
    $('g3Grid').innerHTML = ls.map((g, i) => {
      const sv    = !!g.s;
      const isNew = G3_NEW.has(g.k) && gTab === 'pop';
      const isSurp= G3_SURP.has(g.k);
      const badge = isNew ? '<span class="g3-badge new">جديد</span>' : isSurp ? '<span class="g3-badge surp">مفاجأة</span>' : '';
      const cnt   = gTab === 'bag' && g._cnt ? '<span class="g3-bcnt">x' + g._cnt + '</span>' : '';
      return '<div class="g3-item' + (i === gi ? ' on' : '') + '" data-gi="' + i + '">' +
        badge + cnt +
        '<img src="' + gArt(g) + '" alt="' + esc(g.n) + '" loading="lazy">' +
        '<span class="g3-n">' + esc(g.n) + '</span>' +
        '<span class="g3-p' + (sv ? ' sv' : '') + '">' + (sv ? '🪙 ' : '◆ ') + toAr(g.p) + '</span>' +
      '</div>';
    }).join('');
  };

  /* ── صف الأفاتارات (المستلمون) ── */
  const renderTos = () => {
    const all = sel.size === seated.length && seated.length > 0;
    $('g3All').classList.toggle('on', all);
    $('g3Avs').innerHTML = seated.map(s =>
      '<button class="g3-av' + (sel.has(s.uid) ? ' on' : '') + '" data-uid="' + esc(s.uid) + '" title="' + esc(s.name || '') + '">' +
        avHtml(s, 46) +
        (sel.has(s.uid) ? '<i class="g3-chk">✓</i>' : '') +
      '</button>'
    ).join('') || '<span class="g3-none">ماكو أحد على المايك</span>';
  };

  /* ── الرصيد ── */
  const renderBal = () => {
    $('g3Dbal').textContent = toAr(ME.diamonds || 0) + ' ◆';
    $('g3Sbal').textContent = toAr(ME.silver   || 0) + ' 🪙';
  };

  /* ── تحميل بيانات الحقيبة ── */
  const loadBag = async () => {
    if (!ME || !ME.uid) return;
    try {
      const doc = await db.collection('users').doc(ME.uid).get();
      bagData = (doc.data() || {}).bag || {};
    } catch (e) {}
    if (gTab === 'bag') renderGrid();
  };

  /* ── هدية مجانية يومية بالحقيبة ── */
  const tryFreeBag = async () => {
    const key = G3_BAG_FREE_KEY + ME.uid;
    let last = 0;
    try { last = +(localStorage.getItem(key) || 0); } catch (e) {}
    const now = Date.now();
    if (now - last < 86400000) return;
    try {
      await db.collection('users').doc(ME.uid).update({ 'bag.s_heart': firebase.firestore.FieldValue.increment(1) });
      localStorage.setItem(key, now);
      toast('🎁 هدية مجانية بالحقيبة اليوم: قلب ❤️');
      bagData['s_heart'] = (bagData['s_heart'] || 0) + 1;
      if (gTab === 'bag') renderGrid();
    } catch (e) {}
  };

  /* ── أول رسم ── */
  renderTos();
  renderBal();
  renderGrid();
  loadBag();
  tryFreeBag();

  /* ── أحداث الشبكة ── */
  $('g3Grid').onclick = e => {
    const it = e.target.closest('[data-gi]');
    if (!it) return;
    gi = +it.dataset.gi;
    $('g3Grid').querySelectorAll('.g3-item').forEach((x, i) => x.classList.toggle('on', i === gi));
  };

  /* ── أحداث الأفاتارات (تحديد/إلغاء) ── */
  $('g3Avs').onclick = e => {
    const b = e.target.closest('[data-uid]');
    if (!b) return;
    const uid = b.dataset.uid;
    if (sel.has(uid)) sel.delete(uid); else sel.add(uid);
    renderTos();
  };

  /* ── الكل ── */
  $('g3All').onclick = () => {
    const all = sel.size < seated.length;
    sel = new Set(all ? seated.map(s => s.uid) : []);
    renderTos();
  };

  /* ── التبويبات ── */
  m.querySelector('.g3-tabs').onclick = e => {
    const b = e.target.closest('[data-gt]');
    const s = e.target.closest('#g3Sort');
    if (s && gTab === 'pop') {
      sortAsc = !sortAsc;
      s.textContent = sortAsc ? '↑' : '↕';
      gi = 0; renderGrid(); return;
    }
    if (!b) return;
    gTab = b.dataset.gt;
    gi = 0;
    m.querySelectorAll('.g3-tabs [data-gt]').forEach(x => x.classList.toggle('on', x === b));
    $('g3Sort').style.display = gTab === 'pop' ? '' : 'none';
    renderGrid();
    if (gTab === 'bag' && Object.keys(bagData).length === 0) loadBag();
  };

  /* ── إرسال ── */
  $('g3S').onclick = async () => {
    const ls  = list();
    const g   = ls[gi];
    if (!g) { toast('اختار هدية أول'); return; }
    const qty = +($('g3Q').value || 1);
    const targets = seated.filter(s => sel.has(s.uid));
    if (!targets.length) { toast('اختار مستلم'); return; }

    const fromBag = gTab === 'bag';
    $('g3S').disabled = true;
    try {
      await sendGift(g, qty, targets, fromBag);
      /* حدّث الرصيد بعد الإرسال */
      renderBal();
      if (fromBag) { await loadBag(); renderGrid(); }
    } catch (e) {}
    $('g3S').disabled = false;
  };
};
