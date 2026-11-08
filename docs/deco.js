/* حجينه — إطارات الصور (ثابتة ومتحركة) وأغلفة الحساب، المتجر، وتسجيل الدخول المتتالي */
'use strict';
const DAY = 864e5;
// k: النوع (lv مستوى، sv فضة، vip، st تسجيل دخول متتالي) — r: الشرط — d: الزخارف [صورة, x%, y%, حجم%, حركة, تأخير]
const FRAMES = [
  { id: 'h_demon', n: 'الشيطان', k: 'vip', r: 3, a: 1, t: 'h' },
  { id: 'h_skull', n: 'نار الجماجم', k: 'vip', r: 2, a: 1, t: 'h' },
  { id: 'h_bat', n: 'مصاص الدماء', k: 'vip', r: 2, a: 1, t: 'h' },
  { id: 'h_reaper', n: 'حاصد الأرواح', k: 'vip', r: 1, a: 1, t: 'h' },
  { id: 'h_web', n: 'بيت العنكبوت', k: 'sv', r: 800, a: 1, t: 'h' },
  { id: 'r_emperor', n: 'الإمبراطور', k: 'vip', r: 3, a: 1, t: 'r' },
  { id: 'r_diamond', n: 'تاج الألماس', k: 'vip', r: 3, a: 1, t: 'r' },
  { id: 'r_sultan', n: 'السلطان', k: 'vip', r: 2, a: 1, t: 'r' },
  { id: 'lv_bronze', n: 'البرونز', k: 'lv', r: 3 },
  { id: 'lv_silver', n: 'الفضة الملكية', k: 'lv', r: 8 },
  { id: 'lv_gold', n: 'غصن الذهب', k: 'lv', r: 15 },
  { id: 'lv_moon', n: 'هلال الليل', k: 'lv', r: 25, a: 1 },
  { id: 'st_week', n: 'نجوم الزمرد', k: 'st', r: 7, a: 1 },
  { id: 'sv_rose', n: 'الورد الجوري', k: 'sv', r: 300, a: 1 },
  { id: 'sv_hearts', n: 'قلوب الياقوت', k: 'sv', r: 400, a: 1 },
  { id: 'sv_pearl', n: 'اللؤلؤ', k: 'sv', r: 500, a: 1 },
  { id: 'sv_ice', n: 'الكريستال', k: 'sv', r: 600, a: 1 },
  { id: 'v_fire', n: 'العنقاء', k: 'vip', r: 1, a: 1 },
  { id: 'v_amet', n: 'الجمشت', k: 'vip', r: 1, a: 1 },
  { id: 'v_bolt', n: 'اللهب الأزرق', k: 'vip', r: 2, a: 1 },
  { id: 'v_wings', n: 'الملاك', k: 'vip', r: 2, a: 1 },
  { id: 'v_crown', n: 'التاج الملكي', k: 'vip', r: 3, a: 1 },
  { id: 'v_gwings', n: 'الأجنحة الذهبية', k: 'vip', r: 3, a: 1 },
  { id: 'v_king', n: 'ملك الرومات', k: 'vip', r: 3, a: 1 }
];
const FX_CLS = { h_demon: 'pulse fire', h_skull: 'pulse toxic', h_bat: 'aura blood', h_reaper: 'pulse purp', h_web: 'aura amet', r_emperor: 'aura', r_diamond: 'aura ice', r_sultan: 'aura emer', v_fire: 'pulse fire', v_bolt: 'pulse bolt', v_king: 'pulse fire', v_wings: 'breathe', v_gwings: 'breathe', v_crown: 'aura', v_amet: 'aura amet', lv_moon: 'aura amet', st_week: 'aura emer', sv_ice: 'aura ice' };
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
  return (u.vip || 0) >= 2 && u.fr === undefined ? frById('v_bolt') : null;
}
function frSparks(s) { if (s < 40) return ''; return '<b class="fxs" style="left:14%;top:18%"></b><b class="fxs" style="left:80%;top:30%;animation-delay:.7s"></b><b class="fxs" style="left:70%;top:84%;animation-delay:1.3s"></b><b class="fxs" style="left:22%;top:78%;animation-delay:1.9s"></b>'; }
window.avHtml = function (u, size) {
  const s = size || 44, st = 'width:' + s + 'px;height:' + s + 'px;font-size:' + Math.round(s * .4) + 'px;', inner = avInner(u), f = frOf(u);
  if (f) return '<div class="av fx2 ' + (FX_CLS[f.id] || '') + '" style="' + st + '"><i data-av="' + esc(u.uid || '') + '" style="background:' + esc(u.color || '#FF8A1F') + '">' + inner + '</i><span class="fx2-f" style="--fi:url(frames/' + f.id + '.webp)">' + (f.a ? frSparks(s) : '') + '</span></div>';
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
    const u = me(), own = eligible(it, u), cur = isFr ? (ME.fr || (u.vip >= 2 ? 'v_bolt' : '')) === it.id : (ME.cov || 'c_def') === it.id;
    const exp = it.k === 'sv' || it.k === 'st' ? (ME.owned || {})[it.id] || 0 : 0;
    const prev = isFr ? avHtml({ uid: ME.uid, name: ME.name, color: ME.color, pv: ME.pv, fr: it.id }, 58) : '<div class="st-cv cv-' + it.id + '"><div class="cv-lay">' + covInner(it) + '</div></div>';
    let btn;
    if (cur) btn = '<button class="st-b on" disabled>✓ مستخدم</button>';
    else if (own) btn = '<button class="st-b use" data-use="' + it.id + '">لبس</button>';
    else if (it.k === 'sv') btn = '<button class="st-b buy" data-buy="' + it.id + '">' + SC + ' ' + it.r + '</button>';
    else btn = '<button class="st-b lock" data-lock="' + it.id + '">🔒 ' + reqTxt(it) + '</button>';
    return '<div class="st-it' + (cur ? ' cur' : '') + (isFr ? '' : ' wide') + '">' + (it.a ? '<span class="st-anim">متحرك</span>' : '') + '<div class="st-pv">' + prev + '</div><b>' + it.n + '</b><small>' + (exp > Date.now() ? '⏳ باقي ' + toAr(Math.ceil((exp - Date.now()) / DAY)) + ' يوم' : reqTxt(it)) + '</small>' + btn + '</div>';
  };
  const draw = () => {
    const isFr = tab === 'fr', list = isFr ? FRAMES : COVERS;
    const secs = [['h', '💀 الإطارات المرعبة', 1], ['r', '👑 الإطارات الملكية', 1], ['vip', '👑 خاص بالـ VIP'], ['sv', '<span>' + SC + ' بالعملات الفضية</span>'], ['st', '📅 الدخول اليومي'], ['lv', '⭐ حسب مستوى الحساب'], ['free', '🎁 مجاني']];
    box.innerHTML = (isFr ? streak() : '') + secs.map(([k, t, th]) => { const its = list.filter(x => th ? x.t === k : x.k === k && !x.t); return its.length ? '<div class="s-h" id="sec-' + k + '">' + t + '</div><div class="st-g' + (isFr ? '' : ' cv') + '">' + its.map(x => card(x, isFr)).join('') + '</div>' : ''; }).join('') +
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
