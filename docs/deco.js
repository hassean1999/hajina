/* حجينه — إطارات الصور (ثابتة ومتحركة) وأغلفة الحساب، المتجر، وتسجيل الدخول المتتالي */
'use strict';
const DAY = 864e5;
// k: النوع (lv مستوى، sv فضة، vip، st تسجيل دخول متتالي) — r: الشرط — d: الزخارف [صورة, x%, y%, حجم%, حركة, تأخير]
const FRAMES = [
  { id: 'lv_bronze', n: 'برونزي', k: 'lv', r: 3, d: [] },
  { id: 'lv_silver', n: 'فضي لامع', k: 'lv', r: 6, d: [['sparkles', 78, 2, 26, 'tw', 0], ['sparkles', 2, 72, 20, 'tw', .8]] },
  { id: 'lv_gold', n: 'ذهبي', k: 'lv', r: 10, d: [['gstar', 38, -12, 30, 'tw', 0], ['sparkles', 84, 70, 20, 'tw', .6]] },
  { id: 'lv_clover', n: 'البرسيم', k: 'lv', r: 15, d: [['clover', 36, 76, 30, 'bob', 0], ['clover', 2, 8, 20, 'bob', .7]] },
  { id: 'lv_moon', n: 'ليل القمر', k: 'lv', r: 20, a: 1, d: [['cmoon', 70, -8, 36, 'bob', 0], ['gstar', 0, 10, 18, 'tw', .3], ['gstar', 6, 74, 14, 'tw', 1.1], ['gstar', 84, 74, 16, 'tw', .7]] },
  { id: 'st_week', n: 'المواظب', k: 'st', r: 7, a: 1, d: [['comet', 0, 0, 100, 'orb', 0]], orb: [['comet', 70, -6, 26]] },
  { id: 'sv_rose', n: 'الورد', k: 'sv', r: 300, d: [['rose', -6, 62, 36, 'sw', 0], ['rose', 72, -6, 28, 'sw', .5], ['heart', 84, 66, 16, 'tw', .2]] },
  { id: 'sv_sakura', n: 'زهر الكرز', k: 'sv', r: 300, a: 1, d: [], orb: [['sakura', 40, -10, 24], ['sakura', 90, 50, 20], ['sakura', 40, 92, 22], ['sakura', -10, 50, 18]] },
  { id: 'sv_snow', n: 'الثلج', k: 'sv', r: 400, a: 1, d: [['snow', 34, 74, 30, 'spin', 0]], orb: [['snow', 40, -10, 20], ['snow', 92, 44, 16], ['snow', -8, 44, 18]] },
  { id: 'sv_butterfly', n: 'الفراشة', k: 'sv', r: 500, a: 1, d: [['butterfly', 66, -10, 38, 'flap', 0], ['butterfly', -8, 62, 26, 'flap', .4], ['hibiscus', 74, 70, 24, 'sw', 0]] },
  { id: 'sv_hearts', n: 'القلوب', k: 'sv', r: 500, a: 1, d: [], orb: [['heart', 40, -12, 24], ['heart', 92, 40, 18], ['heart', 40, 94, 20], ['heart', -10, 40, 16]] },
  { id: 'sv_sun', n: 'الشمس', k: 'sv', r: 600, a: 1, d: [['sun', 30, -22, 44, 'spin', 0], ['sunflower', -4, 70, 26, 'sw', .3]] },
  { id: 'sv_notes', n: 'الموسيقى', k: 'sv', r: 600, a: 1, d: [['notes', 74, 10, 26, 'up', 0], ['notes', 0, 30, 22, 'up', 1], ['notes', 60, 60, 20, 'up', 2]] },
  { id: 'v_neon', n: 'نيون', k: 'vip', r: 1, a: 1, d: [] },
  { id: 'v_fire', n: 'النار', k: 'vip', r: 1, a: 1, d: [['fire', 30, 70, 40, 'flk', 0], ['fire', -6, 56, 26, 'flk', .25], ['fire', 76, 56, 26, 'flk', .5]] },
  { id: 'v_bolt', n: 'البرق', k: 'vip', r: 2, a: 1, d: [['bolt', 74, -8, 32, 'fl', 0], ['bolt', -6, 64, 26, 'fl', .45], ['bolt', 80, 68, 20, 'fl', .9]] },
  { id: 'v_wings', n: 'الأجنحة', k: 'vip', r: 2, a: 1, d: [['wing', -40, -6, 64, 'wgl', 0], ['wing', 76, -6, 64, 'wgr', 0], ['gstar', 38, -18, 24, 'tw', 0]] },
  { id: 'v_crown', n: 'الملكي', k: 'vip', r: 3, a: 1, d: [['crown', 24, -36, 52, 'bob', 0], ['gem', -8, 62, 24, 'tw', .3], ['gem', 84, 62, 24, 'tw', .9], ['sparkles', 82, 4, 20, 'tw', .5]] },
  { id: 'v_dragon', n: 'التنين', k: 'vip', r: 3, a: 1, d: [['dragon', 52, -26, 56, 'bob', 0], ['fire', -8, 64, 30, 'flk', .2], ['gem', 80, 74, 20, 'tw', .6]] }
];
const COVERS = [
  { id: 'c_def', n: 'الأساسي', k: 'free', r: 0 },
  { id: 'c_sunset', n: 'الغروب', k: 'lv', r: 5 },
  { id: 'c_ocean', n: 'البحر', k: 'lv', r: 10, a: 1 },
  { id: 'c_sakura', n: 'زهر الكرز', k: 'sv', r: 400, a: 1 },
  { id: 'c_stars', n: 'سما النجوم', k: 'sv', r: 400, a: 1 },
  { id: 'c_aurora', n: 'الشفق', k: 'sv', r: 600, a: 1 },
  { id: 'c_gold', n: 'الذهب', k: 'vip', r: 1, a: 1 },
  { id: 'c_baghdad', n: 'ليل بغداد', k: 'vip', r: 2, a: 1 },
  { id: 'c_galaxy', n: 'المجرة', k: 'vip', r: 2, a: 1 },
  { id: 'c_royal', n: 'القصر الملكي', k: 'vip', r: 3, a: 1 }
];
const frById = id => FRAMES.find(f => f.id === id), covById = id => COVERS.find(c => c.id === id);
const SV_DAYS = 7;
function eligible(it, u) {
  if (!it) return false;
  if (it.k === 'free') return true;
  if (it.k === 'lv') return lvlOf(u.xp) >= it.r;
  if (it.k === 'vip') return (u.vip != null ? u.vip : vipOf(u.recharged || 0)) >= it.r;
  return ((u.owned || {})[it.id] || 0) > Date.now();
}
function frOf(u) { // الإطار اللي يبين
  if (u.fr === 'none') return null;
  if (u.fr) { const f = frById(u.fr); if (f && (u.owned === undefined && u.recharged === undefined ? true : eligible(f, u))) return f; }
  return (u.vip || 0) >= 2 && u.fr === undefined ? frById('v_neon') : null;
}
function frDeco(f, s) {
  if (s < 34) return '';
  const im = x => '<img src="fx/' + x[0] + '.webp" alt="" class="' + (x[4] || '') + '" style="left:' + x[1] + '%;top:' + x[2] + '%;width:' + x[3] + '%' + (x[5] ? ';animation-delay:' + x[5] + 's' : '') + '">';
  return '<span class="frd">' + f.d.filter(x => x[4] !== 'orb').map(im).join('') + (f.orb ? '<span class="frorb">' + f.orb.map(x => im([x[0], x[1], x[2], x[3]])).join('') + '</span>' : '') + '</span>';
}
window.avHtml = function (u, size) {
  const s = size || 44, st = 'width:' + s + 'px;height:' + s + 'px;font-size:' + Math.round(s * .4) + 'px;', inner = avInner(u), f = frOf(u);
  if (f) return '<div class="av fr fr-' + f.id + '" style="' + st + 'padding:' + Math.max(2, Math.round(s * .07)) + 'px"><i data-av="' + esc(u.uid || '') + '" style="background:' + esc(u.color || '#FF8A1F') + '">' + inner + '</i>' + frDeco(f, s) + '</div>';
  return '<div class="av" data-av="' + esc(u.uid || '') + '" style="' + st + 'background:' + esc(u.color || '#FF8A1F') + '">' + inner + '</div>';
};
const _meLite = window.meLite;
window.meLite = function () { const o = _meLite(); const f = ME.fr; if (f === 'none') o.fr = 'none'; else if (f && eligible(frById(f), Object.assign({}, ME, { vip: o.vip }))) o.fr = f; return o; };

/* ---------- الأغلفة ---------- */
const SKY = '<svg viewBox="0 0 400 90" preserveAspectRatio="xMidYMax slice" class="cv-sky"><path fill="#0B0614" d="M0 90V62h18v-8h10v8h14V48c0-6 10-6 10 0v14h12V40h4v-8h2v-6h2v6h2v8h4v22h16V56c0-14 26-14 26 0v6h10V30h3v-6h1v-8h2v8h1v6h3v32h14V50h22v12h12V58c0-22 44-22 44 0v4h14V36h4v-8h2v-6h2v6h2v8h4v26h18V52h16v10h12V44c0-7 12-7 12 0v18h14V34h3v-8h1v-6h2v6h1v8h3v28h20v28z"/><g fill="#FFD27A" opacity=".8"><rect x="60" y="66" width="3" height="5"/><rect x="146" y="68" width="3" height="5"/><rect x="206" y="66" width="4" height="6"/><rect x="290" y="68" width="3" height="5"/><rect x="330" y="64" width="3" height="5"/></g></svg>';
function covInner(c) {
  const fall = (img, n) => Array.from({ length: n }, (_, i) => '<img class="cv-fall" src="fx/' + img + '.webp" alt="" style="left:' + ((i * 37 + 7) % 96) + '%;animation-delay:' + (i * 1.3 % 7).toFixed(1) + 's;animation-duration:' + (6 + (i % 3) * 1.5) + 's;width:' + (14 + (i % 3) * 5) + 'px">').join('');
  const stars = n => Array.from({ length: n }, (_, i) => '<i class="cv-st" style="left:' + ((i * 53 + 11) % 98) + '%;top:' + ((i * 29 + 5) % 70) + '%;animation-delay:' + (i * .37 % 3).toFixed(2) + 's"></i>').join('');
  switch (c && c.id) {
    case 'c_ocean': return '<i class="cv-wave w1"></i><i class="cv-wave w2"></i>';
    case 'c_sakura': return fall('sakura', 9);
    case 'c_stars': return stars(24) + '<img class="cv-moon" src="fx/cmoon.webp" alt="">';
    case 'c_aurora': return '<i class="cv-aur a1"></i><i class="cv-aur a2"></i>' + stars(10);
    case 'c_gold': return '<i class="cv-shine"></i>' + fall('sparkles', 5);
    case 'c_baghdad': return stars(18) + '<img class="cv-moon" src="fx/cmoon.webp" alt="">' + SKY;
    case 'c_galaxy': return stars(26) + '<img class="cv-comet" src="fx/comet.webp" alt="">';
    case 'c_royal': return '<i class="cv-shine"></i><img class="cv-crown" src="fx/crown.webp" alt="">' + fall('gem', 6);
    default: return '';
  }
}
function covOf(u) { const c = covById(u.cov); return c && eligible(c, u) ? c : null; }
function applyCover(el, u) { if (!el) return; const c = covOf(u); el.className = el.className.replace(/\bcv-\S+/g, '').trim() + (c ? ' cv-' + c.id : ''); let lay = el.querySelector('.cv-lay'); if (!lay) { lay = document.createElement('div'); lay.className = 'cv-lay'; el.prepend(lay); } lay.innerHTML = covInner(c); }
const _renderMe3 = window.renderMe;
window.renderMe = function () { _renderMe3.apply(this, arguments); applyCover(document.querySelector('.pf-cover'), ME); };
window.ucHook = function (m, u) { const c = covOf(u); if (!c) return; const uc = m.querySelector('.uc'); if (!uc) return; const d = document.createElement('div'); d.className = 'uc-cov'; uc.prepend(d); applyCover(d, u); m.querySelector('.sheet').classList.add('has-cov'); };

/* ---------- المتجر ---------- */
function reqTxt(it) { return it.k === 'lv' ? '⭐ المستوى ' + toAr(it.r) : it.k === 'vip' ? 'VIP' + it.r : it.k === 'st' ? '📅 ' + toAr(it.r) + ' أيام دخول' : it.k === 'sv' ? SC + ' ' + it.r + ' / ' + toAr(SV_DAYS) + ' أيام' : 'مجاني'; }
window.openStore = function (tab, sec) {
  tab = tab || 'fr';
  const m = modal('<div class="sr-top"><button class="sr-back" id="stBk">→</button><b class="st-title">🛍️ الإطارات والأغلفة</b><span class="st-bal">' + SC + ' ' + (ME.silver || 0).toLocaleString('en') + '</span></div>' +
    '<div class="sr-tabs st-tabs"><button data-t="fr"' + (tab === 'fr' ? ' class="on"' : '') + '>🖼️ إطارات الصورة</button><button data-t="cv"' + (tab === 'cv' ? ' class="on"' : '') + '>🌄 غلاف الحساب</button></div><div id="stB"></div>', 'full');
  m.querySelector('#stBk').onclick = () => m.close();
  const box = m.querySelector('#stB');
  const me = () => Object.assign({}, ME, { vip: vipOf(ME.recharged || 0) });
  const streak = () => { const s = ME.streak || 0, got = ((ME.owned || {}).st_week || 0) > Date.now();
    return '<div class="st-streak"><div><b>📅 الدخول اليومي</b><small>' + (got ? '✅ إطار «المواظب» عندك' : 'ادخل ' + toAr(7) + ' أيام ورا بعض وخذ إطار «المواظب» مجاناً') + '</small></div><div class="st-days">' + Array.from({ length: 7 }, (_, i) => '<i class="' + (i < s % 8 || got ? 'on' : '') + '">' + toAr(i + 1) + '</i>').join('') + '</div></div>'; };
  const card = (it, isFr) => {
    const u = me(), own = eligible(it, u), cur = isFr ? (ME.fr || (u.vip >= 2 ? 'v_neon' : '')) === it.id : (ME.cov || 'c_def') === it.id;
    const exp = it.k === 'sv' || it.k === 'st' ? (ME.owned || {})[it.id] || 0 : 0;
    const prev = isFr ? avHtml({ uid: ME.uid, name: ME.name, color: ME.color, pv: ME.pv, fr: it.id }, 62) : '<div class="st-cv cv-' + it.id + '"><div class="cv-lay">' + covInner(it) + '</div></div>';
    let btn;
    if (cur) btn = '<button class="st-b on" disabled>✓ مستخدم</button>';
    else if (own) btn = '<button class="st-b use" data-use="' + it.id + '">لبس</button>';
    else if (it.k === 'sv') btn = '<button class="st-b buy" data-buy="' + it.id + '">' + SC + ' ' + it.r + '</button>';
    else btn = '<button class="st-b lock" data-lock="' + it.id + '">🔒 ' + reqTxt(it) + '</button>';
    return '<div class="st-it' + (cur ? ' cur' : '') + (isFr ? '' : ' wide') + '">' + (it.a ? '<span class="st-anim">متحرك</span>' : '') + '<div class="st-pv">' + prev + '</div><b>' + it.n + '</b><small>' + (exp > Date.now() ? '⏳ باقي ' + toAr(Math.ceil((exp - Date.now()) / DAY)) + ' يوم' : reqTxt(it)) + '</small>' + btn + '</div>';
  };
  const draw = () => {
    const isFr = tab === 'fr', list = isFr ? FRAMES : COVERS;
    const secs = [['vip', '👑 خاص بالـ VIP'], ['sv', '<span>' + SC + ' بالعملات الفضية</span>'], ['st', '📅 الدخول اليومي'], ['lv', '⭐ حسب مستوى الحساب'], ['free', '🎁 مجاني']];
    box.innerHTML = (isFr ? streak() : '') + secs.map(([k, t]) => { const its = list.filter(x => x.k === k); return its.length ? '<div class="s-h" id="sec-' + k + '">' + t + '</div><div class="st-g' + (isFr ? '' : ' cv') + '">' + its.map(x => card(x, isFr)).join('') + '</div>' : ''; }).join('') +
      (isFr ? '<button class="btn btn-s" data-use="none" style="margin-top:12px">بدون إطار</button>' : '');
    if (sec) { const el = box.querySelector('#sec-' + sec); if (el) setTimeout(() => el.scrollIntoView({ block: 'start' }), 50); sec = null; }
  };
  m.querySelector('.st-tabs').onclick = e => { const b = e.target.closest('button'); if (!b) return; tab = b.dataset.t; m.querySelectorAll('.st-tabs button').forEach(x => x.classList.toggle('on', x === b)); draw(); };
  box.onclick = async e => {
    const b = e.target.closest('button'); if (!b) return; const isFr = tab === 'fr';
    if (b.dataset.use) { const f = isFr ? 'fr' : 'cov'; try { await db.collection('users').doc(ME.uid).update({ [f]: b.dataset.use }); ME[f] = b.dataset.use; renderMe(); draw(); toast('✅ تم'); } catch (er) { toast(errMsg(er)); } }
    else if (b.dataset.buy) { const it = (isFr ? frById : covById)(b.dataset.buy); buyItem(it, isFr, draw, m); }
    else if (b.dataset.lock) { const it = (isFr ? frById : covById)(b.dataset.lock);
      if (it.k === 'vip') { m.close(); openVipLevel(it.r - 1); } else if (it.k === 'lv') toast('اكعد بالرومات وتفاعل حتى يصعد مستواك لـ ' + toAr(it.r)); else toast('ادخل كل يوم، ' + toAr(7) + ' أيام ورا بعض'); }
  };
  draw();
};
function buyItem(it, isFr, redraw, store) {
  const have = ME.silver || 0;
  const m = modal('<h3>' + (isFr ? '🖼️' : '🌄') + ' ' + it.n + '</h3><div class="vip-demo">' + (isFr ? avHtml({ uid: ME.uid, name: ME.name, color: ME.color, pv: ME.pv, fr: it.id }, 90) : '<div class="st-cv big cv-' + it.id + '"><div class="cv-lay">' + covInner(it) + '</div></div>') + '</div>' +
    '<div style="text-align:center;font-size:13px;color:var(--fg2)">المدة: ' + toAr(SV_DAYS) + ' أيام · رصيدك: ' + SC + ' ' + have.toLocaleString('en') + '</div>' +
    (have >= it.r ? '<button class="btn btn-p" id="byG">اشتري بـ ' + SC + ' ' + it.r + ' ولبسه</button>' : '<button class="btn btn-s" disabled>تحتاج ' + SC + ' ' + (it.r - have) + ' بعد</button><button class="btn btn-p" id="byW">🎡 خذ فضة من عجلة الحظ</button>'));
  const g = m.querySelector('#byG');
  if (g) g.onclick = async () => { g.disabled = true;
    const ref = db.collection('users').doc(ME.uid), f = isFr ? 'fr' : 'cov';
    try {
      await db.runTransaction(async tx => { const d = (await tx.get(ref)).data(); if ((d.silver || 0) < it.r) throw new Error('low');
        const base = Math.max(Date.now(), ((d.owned || {})[it.id] || 0)); tx.update(ref, { silver: (d.silver || 0) - it.r, ['owned.' + it.id]: base + SV_DAYS * DAY, [f]: it.id }); });
      m.close(); toast('🎉 صار عندك ' + it.n); chime(true);
      try { const d = (await ref.get()).data(); Object.assign(ME, { silver: d.silver, owned: d.owned, [f]: it.id }); } catch (e) {}
      renderMe(); redraw(); if (store.querySelector('.st-bal')) store.querySelector('.st-bal').innerHTML = SC + ' ' + (ME.silver || 0).toLocaleString('en');
    } catch (er) { g.disabled = false; toast(er.message === 'low' ? 'الفضة ما تكفي' : errMsg(er)); } };
  const w = m.querySelector('#byW'); if (w) w.onclick = () => { m.close(); store.close(); doCheckin(); };
}

/* ---------- الدخول المتتالي ---------- */
setTimeout(async function streakTick() {
  if (typeof ME === 'undefined' || !ME || !ME.uid) return setTimeout(streakTick, 4000);
  const day = d => new Date(d).toISOString().slice(0, 10), today = day(Date.now()), yest = day(Date.now() - DAY);
  if (ME.lastDay === today) return;
  const s = ME.lastDay === yest ? (ME.streak || 0) + 1 : 1, upd = { lastDay: today, streak: s };
  if (s >= 7 && s % 7 === 0) upd['owned.st_week'] = Date.now() + 7 * DAY;
  try { await db.collection('users').doc(ME.uid).update(upd); ME.lastDay = today; ME.streak = s;
    if (upd['owned.st_week']) { ME.owned = Object.assign({}, ME.owned, { st_week: upd['owned.st_week'] }); setTimeout(() => { const m = modal('<h3>🎉 ' + toAr(7) + ' أيام ورا بعض!</h3><div class="vip-demo">' + avHtml({ uid: ME.uid, name: ME.name, color: ME.color, pv: ME.pv, fr: 'st_week' }, 90) + '<b>إطار «المواظب» صار إلك مجاناً لمدة أسبوع</b></div><button class="btn btn-p" id="swU">لبسه هسه</button>'); m.querySelector('#swU').onclick = () => { m.close(); db.collection('users').doc(ME.uid).update({ fr: 'st_week' }).then(() => { ME.fr = 'st_week'; renderMe(); }).catch(() => {}); }; }, 2500); }
  } catch (e) {}
}, 3000);
