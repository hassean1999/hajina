/* حجينه — ألعاب الروم الإضافية */
'use strict';
const GT = {
  word: { n: 'تحدي الكلمات', e: '🧩', d: 'لاكي الكلمات المخفية بين الحروف قبل خصمك', duo: 1 },
  muhaibis: { n: 'المحيبس', e: '💍', d: 'لعبة رمضان العراقية: خبّي المحبس وخلي خصمك يلكاه', duo: 1 },
  quiz: { n: 'سؤال وجواب', e: '❓', d: 'أسئلة للكل بالروم، أسرع جواب صحيح ياخذ النقطة', duo: 0 },
  xo: { n: 'إكس أو', e: '⭕', d: 'ثلاثة بخط واحد وتفوز', duo: 1 },
  rps: { n: 'حجرة ورقة مقص', e: '✊', d: 'أول واحد يوصل 3 نقاط يفوز', duo: 1 },
  dice: { n: 'الزار', e: '🎲', d: 'ارمِ الزار، والأعلى ياخذ الجولة، من 3 جولات', duo: 1 }
};
window.GINIT = {};
const QUIZ = [
  ['شنو عاصمة العراق؟', ['بغداد', 'البصرة', 'الموصل', 'أربيل'], 0], ['أطول نهر بالعراق؟', ['دجلة', 'الفرات', 'الزاب', 'ديالى'], 1],
  ['بأي مدينة ملوية سامراء؟', ['سامراء', 'تكريت', 'الحلة', 'كركوك'], 0], ['شط العرب يتكون من التقاء؟', ['دجلة والفرات', 'الزاب ودجلة', 'الفرات والخابور', 'ديالى ودجلة'], 0],
  ['أكلة عراقية من ورق العنب والخضرة المحشية؟', ['دولمة', 'كبة', 'تشريب', 'باجة'], 0], ['المسگوف يسوونه من؟', ['سمك', 'دجاج', 'لحم', 'باذنجان'], 0],
  ['كم محافظة بالعراق (رسمياً قبل استحداث حلبجة)؟', ['18', '15', '20', '12'], 0], ['مدينة بابل الأثرية قريبة من؟', ['الحلة', 'النجف', 'الكوت', 'العمارة'], 0],
  ['منو كتب "مداخل شعرية" ويلقب بشاعر العرب الأكبر؟', ['الجواهري', 'السياب', 'نزار قباني', 'المتنبي'], 0], ['بدر شاكر السياب من أي مدينة؟', ['البصرة', 'بغداد', 'الموصل', 'الناصرية'], 0],
  ['المتنبي ولد بأي مدينة؟', ['الكوفة', 'بغداد', 'البصرة', 'حلب'], 0], ['كم لاعب بفريق كرة القدم داخل الملعب؟', ['11', '10', '9', '12'], 0],
  ['العراق فاز ببطولة كأس آسيا سنة؟', ['2007', '2004', '2011', '1996'], 0], ['أسود الرافدين لقب منتخب؟', ['العراق', 'سوريا', 'الأردن', 'الكويت'], 0],
  ['شنو أكبر كوكب بالمجموعة الشمسية؟', ['المشتري', 'زحل', 'الأرض', 'المريخ'], 0], ['كم يوم بالسنة الكبيسة؟', ['366', '365', '364', '360'], 0],
  ['أسرع حيوان بري؟', ['الفهد', 'الأسد', 'الحصان', 'الغزال'], 0], ['شنو عاصمة مصر؟', ['القاهرة', 'الإسكندرية', 'الجيزة', 'أسوان'], 0],
  ['كم قارة بالعالم؟', ['7', '5', '6', '8'], 0], ['أطول نهر بالعالم؟', ['النيل', 'الأمازون', 'دجلة', 'الفولغا'], 0],
  ['مقام عراقي مشهور بصوت محمد القبانجي؟', ['المقام العراقي', 'الموشح', 'الدبكة', 'الجالغي'], 0], ['الكليجة تنعمل بأي مناسبة؟', ['العيد', 'الصيف', 'المدرسة', 'الشتاء'], 0],
  ['جبل حمرين يقع بين؟', ['ديالى وصلاح الدين', 'أربيل ودهوك', 'البصرة وميسان', 'الأنبار ونينوى'], 0], ['أعلى قمة بالعراق تقريباً؟', ['جبل جيكا دار', 'جبل حمرين', 'جبل سنجار', 'جبل مكحول'], 0],
  ['الأهوار تقع بجنوب العراق بمحافظات؟', ['ميسان وذي قار والبصرة', 'الأنبار وكربلاء', 'نينوى ودهوك', 'ديالى وواسط'], 0], ['حروف اللغة العربية كم حرف؟', ['28', '26', '30', '24'], 0],
  ['شنو لون علم العراق من فوك؟', ['أحمر', 'أخضر', 'أسود', 'أبيض'], 0], ['منو اخترع المصباح الكهربائي؟', ['أديسون', 'نيوتن', 'تسلا', 'غاليليو'], 0],
  ['أكبر محيط بالعالم؟', ['الهادئ', 'الأطلسي', 'الهندي', 'المتجمد'], 0], ['كم ساعة باليوم؟', ['24', '12', '20', '36'], 0],
  ['أي حيوان يسمونه سفينة الصحراء؟', ['الجمل', 'الحصان', 'الفيل', 'الغزال'], 0], ['عملة العراق؟', ['الدينار', 'الريال', 'الليرة', 'الدرهم'], 0],
  ['جامعة المستنصرية تأسست بزمن؟', ['العباسيين', 'الأمويين', 'العثمانيين', 'الحديث'], 0], ['قلعة أربيل من أقدم؟', ['المدن المأهولة', 'الجسور', 'السدود', 'المطارات'], 0],
  ['شارع المتنبي مشهور بـ؟', ['الكتب', 'الذهب', 'الملابس', 'السيارات'], 0], ['السمك المشهور بدجلة؟', ['الشبوط', 'السلمون', 'التونة', 'السردين'], 0]
].map(q => { const correct = q[1][q[2]]; return { q: q[0], o: q[1], c: correct }; });
const GREF = id => db.collection('games').doc(id);
function gShuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---- اللوبي ---- */
function gLive() { const g = R.data && R.data.game; return g && g.status !== 'done' && Date.now() - (g.ts || 0) < 30 * 60000 ? g : null; }
window.openGames = function () {
  const live = gLive();
  const m = modal('<h3>🎮 ألعاب الروم</h3>' + (live ? '<div class="li" id="gLive" style="border:2px solid var(--or);border-radius:16px;background:rgba(255,138,31,.12)"><span class="ic" style="font-size:28px">' + (GT[live.type || 'word'] || GT.word).e + '</span><div style="flex:1"><b>' + (GT[live.type || 'word'] || GT.word).n + ' شغالة هسه</b><div style="font-size:12px;color:var(--fg2)">فتحها ' + esc(live.by) + '</div></div><span class="chip">ادخل</span></div>' + (live.byUid === ME.uid || isOwner() ? '<button class="btn btn-s" id="gEnd" style="color:var(--danger)">⛔ إنهاء اللعبة الحالية</button>' : '') : '') +
    '<div class="glist">' + Object.entries(GT).map(([k, t]) => '<div class="gcard" data-k="' + k + '"><span class="ge">' + t.e + '</span><b>' + t.n + '</b><small>' + t.d + '</small><span class="gt">' + (t.duo ? '👥 لاعبين' : '👨‍👩‍👧 الكل') + '</span></div>').join('') + '</div>');
  const lv = m.querySelector('#gLive'); if (lv) lv.onclick = () => { m.close(); gameOpen(live.id); };
  const en = m.querySelector('#gEnd'); if (en) en.onclick = async () => { m.close(); await GREF(live.id).update({ status: 'done' }).catch(() => {}); roomRef().update({ 'game.status': 'done' }).catch(() => {}); toast('انتهت اللعبة'); };
  m.querySelector('.glist').onclick = e => { const c = e.target.closest('.gcard'); if (!c) return; if (live) return toast('أكو لعبة شغالة، ادخلها أو انهيها أول'); m.close(); c.dataset.k === 'word' ? gameCreate() : gCreate(c.dataset.k); };
};
async function gCreate(type) {
  const ref = db.collection('games').doc(), base = { room: R.id, type, status: type === 'quiz' ? 'play' : 'wait', players: [meLite()], scores: { [ME.uid]: 0 }, by: ME.uid, ts: Date.now() };
  if (type === 'xo') Object.assign(base, { board: Array(9).fill(''), turn: ME.uid });
  if (type === 'rps' || type === 'dice') Object.assign(base, { picks: {}, round: 1, last: null });
  if (type === 'muhaibis') Object.assign(base, { round: 1, hider: ME.uid, ring: -1, opened: [], phase: 'hide', last: null });
  if (GINIT[type]) Object.assign(base, GINIT[type]());
  if (type === 'quiz') Object.assign(base, { qs: gShuffle(QUIZ.map((_, i) => i)).slice(0, 10), cur: 0, qTs: Date.now(), ans: null, names: { [ME.uid]: ME.name } });
  try {
    await ref.set(base);
    await roomRef().update({ game: { id: ref.id, type, status: base.status, by: ME.name, byUid: ME.uid, ts: Date.now() } });
    roomRef().collection('messages').add({ type: 'sys', uid: ME.uid, text: GT[type].e + ' ' + ME.name + ' فتح لعبة ' + GT[type].n + (GT[type].duo ? '، منو يتحداه؟' : '، الكل يشارك!'), ts: FV.serverTimestamp() }).catch(() => {});
    gameOpen(ref.id);
  } catch (e) { toast(errMsg(e)); }
}
window.syncGameBanner = function () {
  const el = $('gameBanner'), g = gLive();
  if (!g) { el.hidden = true; return; }
  const t = GT[g.type || 'word'] || GT.word;
  el.hidden = false;
  el.innerHTML = t.e + ' ' + esc(g.by) + (g.status === 'wait' ? ' يتحداكم بـ' + t.n : ' — ' + t.n + ' شغالة') + '<button>' + (g.status === 'wait' || !t.duo ? 'العب' : 'شاهد') + '</button>';
  el.onclick = () => gameOpen(g.id);
};
async function gFinish(g, winner) {
  roomRef().update({ 'game.status': 'done' }).catch(() => {});
  const w = (g.players || []).find(p => p.uid === winner);
  const name = w ? w.name : (g.names && g.names[winner]);
  roomRef().collection('messages').add({ type: 'sys', uid: ME.uid, text: name ? '🏆 ' + name + ' فاز بلعبة ' + GT[g.type].n + '!' : '🤝 تعادل بلعبة ' + GT[g.type].n, ts: FV.serverTimestamp() }).catch(() => {});
}

/* ---- قوالب مشتركة ---- */
function gTop(g, mid) {
  const me = ME.uid, ps = g.players || [], mine = ps.find(p => p.uid === me), opp = ps.find(p => p.uid !== me);
  const a = mine || ps[0], b = mine ? opp : ps[1];
  const pl = (p, lbl) => p ? '<div class="wg-p' + (g.turn === p.uid ? ' turn' : '') + '">' + avHtml(p, 56) + '<b>' + nameHtml(p, true) + '</b><span>' + toAr((g.scores || {})[p.uid] || 0) + '</span></div>' : '<div class="wg-p"><div class="av" style="width:56px;height:56px;background:rgba(255,255,255,.15)">👤</div><b>' + lbl + '</b><span>-</span></div>';
  const t = GT[g.type];
  return '<div class="wg-top"><button class="x" onclick="gameClose()">✕</button><b>' + t.e + ' ' + t.n + '</b><span class="coins">' + SC + ' ' + fmtK(ME.silver || 0) + '</span></div>' +
    '<div class="wg-pl">' + pl(a, 'أنا') + '<div class="wg-mid">' + (mid || '') + '</div>' + pl(b, 'الخصم') + '</div>';
}
function gWait(g) {
  const w = WG.el, me = ME.uid, iAmIn = (g.players || []).some(p => p.uid === me), p1 = (g.players || [])[0];
  w.innerHTML = gTop(g, 'VS') + '<div class="wg-wait">' + (g.by === me ? '<b>⏳ ننتظر واحد يتحداك...</b><span style="color:#cfe6f5">أي واحد بالروم يكدر يضغط «العب»</span>' : (iAmIn ? '<b>⏳</b>' : '<b>' + esc(p1 ? p1.name : '') + ' يتحداك!</b><button class="btn btn-p" style="width:auto;padding:12px 36px" id="gJoin">⚔️ اقبل التحدي</button>')) + '</div>';
  const j = w.querySelector('#gJoin'); if (j) j.onclick = async () => {
    const ref = GREF(WG.id);
    try {
      await db.runTransaction(async tx => { const s = await tx.get(ref), d = s.data(); if ((d.players || []).length >= 2 || d.status !== 'wait') throw new Error('full'); tx.update(ref, { players: d.players.concat(meLite()), ['scores.' + me]: 0, status: 'play' }); });
      roomRef().update({ 'game.status': 'play' }).catch(() => {});
    } catch (e) { toast(e.message === 'full' ? 'اللعبة اكتملت' : errMsg(e)); }
  };
}
function gDone(g, prev) {
  const w = (g.players || []).find(p => p.uid === g.winner);
  const name = w ? w.name : (g.names && g.names[g.winner]);
  if (!prev || prev.status !== 'done') { chime(true); if (g.winner === ME.uid) toast('🏆 فزت!'); }
  return '<div class="g-result">' + (name ? '🏆<b>' + esc(name) + ' فاز!</b>' : '🤝<b>تعادل</b>') + '<button class="btn btn-s" style="width:auto;padding:10px 30px" onclick="gameClose()">رجوع للروم</button></div>';
}
const amPlayer = g => (g.players || []).some(p => p.uid === ME.uid);
const other = g => ((g.players || []).find(p => p.uid !== ME.uid) || {}).uid;

/* ---- إكس أو ---- */
const XO_L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
function xoRender(g, prev) {
  if (g.status === 'wait') return gWait(g);
  const ps = g.players || [], mark = uid => ps[0] && uid === ps[0].uid ? 'X' : 'O';
  const myTurn = g.turn === ME.uid && g.status === 'play';
  WG.el.innerHTML = gTop(g, g.status === 'done' ? '' : (myTurn ? 'دورك (' + mark(ME.uid) + ')' : (amPlayer(g) ? 'دور الخصم' : '👀 تشاهد'))) +
    (g.status === 'done' ? gDone(g, prev) : '') +
    '<div class="xo">' + g.board.map((c, i) => '<button data-i="' + i + '" class="' + (c === 'X' ? 'x' : c === 'O' ? 'o' : '') + '">' + (c === 'X' ? '✕' : c === 'O' ? '◯' : '') + '</button>').join('') + '</div>';
  if (prev && prev.board && prev.board.join() !== g.board.join()) sfx(500, .08, 'sine', .06);
  WG.el.querySelector('.xo').onclick = async e => {
    const b = e.target.closest('button'); if (!b || !myTurn) return; const i = +b.dataset.i; if (g.board[i]) return;
    const ref = GREF(WG.id);
    try {
      let fin = null;
      await db.runTransaction(async tx => {
        const d = (await tx.get(ref)).data(); if (d.turn !== ME.uid || d.board[i] || d.status !== 'play') throw new Error('x');
        const bd = d.board.slice(); bd[i] = mark(ME.uid); const win = XO_L.some(l => l.every(k => bd[k] === bd[i]));
        const upd = { board: bd, turn: other(d) };
        if (win) { upd.status = 'done'; upd.winner = ME.uid; upd['scores.' + ME.uid] = 1; fin = ME.uid; }
        else if (bd.every(x => x)) { upd.status = 'done'; upd.winner = null; fin = 'tie'; }
        tx.update(ref, upd);
      });
      if (fin) gFinish(g, fin === 'tie' ? null : fin);
    } catch (er) {}
  };
}

/* ---- حجرة ورقة مقص / الزار ---- */
const RPS = { r: '✊', p: '✋', s: '✌️' }, RPS_N = { r: 'حجرة', p: 'ورقة', s: 'مقص' };
const rpsBeat = (a, b) => (a === 'r' && b === 's') || (a === 'p' && b === 'r') || (a === 's' && b === 'p');
const DICE = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
function duelRender(g, prev) {
  if (g.status === 'wait') return gWait(g);
  const isR = g.type === 'rps', me = ME.uid, picked = (g.picks || {})[me];
  const last = g.last;
  let lastTxt = '';
  if (last) { const nm = uid => uid === me ? 'إنت' : (((g.players || []).find(p => p.uid === uid) || {}).name || ''); lastTxt = '<div class="duel-last">' + Object.entries(last.p).map(([u, v]) => '<div><span>' + (isR ? RPS[v] : DICE[v[0]] + DICE[v[1]]) + '</span><small>' + esc(nm(u)) + (isR ? '' : ' (' + (v[0] + v[1]) + ')') + '</small></div>').join('<b>VS</b>') + '<p>' + (last.w ? '🏅 ' + esc(nm(last.w)) + ' ربح الجولة' : 'تعادل بالجولة') + '</p></div>'; }
  WG.el.innerHTML = gTop(g, g.status === 'done' ? '' : 'جولة ' + toAr(g.round)) + (g.status === 'done' ? gDone(g, prev) : '') + lastTxt +
    (g.status === 'play' && amPlayer(g) ? (picked ? '<div class="duel-wait">⏳ ننتظر الخصم...</div>' : (isR ? '<div class="rps">' + Object.keys(RPS).map(k => '<button data-k="' + k + '"><span>' + RPS[k] + '</span>' + RPS_N[k] + '</button>').join('') + '</div>' : '<button class="btn btn-p dice-btn" id="dRoll">🎲 ارمِ الزار</button>')) : (g.status === 'play' ? '<div class="duel-wait">👀 تشاهد</div>' : ''));
  if (last && (!prev || JSON.stringify(prev.last) !== JSON.stringify(last))) sfx(last.w === me ? 880 : 300, .2, 'triangle', .07);
  const play = async val => {
    const ref = GREF(WG.id); let fin;
    try {
      await db.runTransaction(async tx => {
        const d = (await tx.get(ref)).data(); if (d.status !== 'play' || (d.picks || {})[me]) throw new Error('x');
        const picks = Object.assign({}, d.picks, { [me]: val }), op = other(d);
        if (!op || picks[op] === undefined) { tx.update(ref, { picks }); return; }
        const a = picks[me], b = picks[op]; let w = null;
        if (isR) { if (rpsBeat(a, b)) w = me; else if (rpsBeat(b, a)) w = op; }
        else { const sa = a[0] + a[1], sb = b[0] + b[1]; if (sa > sb) w = me; else if (sb > sa) w = op; }
        const scores = Object.assign({}, d.scores); if (w) scores[w] = (scores[w] || 0) + 1;
        const upd = { picks: {}, last: { p: picks, w }, scores, round: d.round + (w || !isR ? 1 : 0) };
        const target = isR ? 3 : 2;
        if (w && scores[w] >= target) { upd.status = 'done'; upd.winner = w; fin = w; }
        else if (!isR && d.round >= 3 && !w) { upd.status = 'done'; upd.winner = (scores[me] || 0) > (scores[op] || 0) ? me : (scores[op] || 0) > (scores[me] || 0) ? op : null; fin = upd.winner || 'tie'; }
        else if (!isR && d.round >= 3) { upd.status = 'done'; upd.winner = (scores[me] || 0) > (scores[op] || 0) ? me : (scores[op] || 0) > (scores[me] || 0) ? op : null; fin = upd.winner || 'tie'; }
        tx.update(ref, upd);
      });
      if (fin) gFinish(g, fin === 'tie' ? null : fin);
    } catch (e) {}
  };
  const rp = WG.el.querySelector('.rps'); if (rp) rp.onclick = e => { const b = e.target.closest('button'); if (b) play(b.dataset.k); };
  const dr = WG.el.querySelector('#dRoll'); if (dr) dr.onclick = () => { dr.disabled = true; play([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]); };
}

/* ---- المحيبس ---- */
function muhRender(g, prev) {
  if (g.status === 'wait') return gWait(g);
  const me = ME.uid, hider = g.hider, seeker = (g.players || []).find(p => p.uid !== hider) || {};
  const iHide = me === hider, iSeek = me === seeker.uid;
  let mid = 'جولة ' + toAr(g.round) + ' من ٥';
  let info = '';
  if (g.status === 'play') {
    if (g.phase === 'hide') info = iHide ? '🤲 اختار وين تخبي المحبس' : '⏳ ' + esc(((g.players || []).find(p => p.uid === hider) || {}).name || '') + ' دا يخبي المحبس...';
    else info = iSeek ? '👆 عندك محاولتين تلكى المحبس، اختار إيد' : (iHide ? '🤫 ' + esc(seeker.name || '') + ' دا يدور...' : '👀 تشاهد');
  }
  const hands = Array.from({ length: 6 }, (_, i) => { const op = (g.opened || []).includes(i), ring = op && i === g.ring; const showMine = iHide && i === g.ring && g.phase === 'seek';
    return '<button data-i="' + i + '" class="hand' + (op ? ' op' : '') + (ring ? ' ring' : '') + (showMine ? ' mine' : '') + '"><span>' + (ring ? '💍' : op ? '🖐️' : '✊') + '</span></button>'; }).join('');
  const lastTxt = g.last ? '<div class="duel-last"><p>' + esc(g.last) + '</p></div>' : '';
  WG.el.innerHTML = gTop(g, g.status === 'done' ? '' : mid) + (g.status === 'done' ? gDone(g, prev) : '') + lastTxt + '<div class="muh-info">' + info + '</div><div class="muh">' + hands + '</div>';
  if (prev && (prev.opened || []).length !== (g.opened || []).length) sfx(420, .12, 'triangle', .07);
  WG.el.querySelector('.muh').onclick = async e => {
    const b = e.target.closest('button'); if (!b || g.status !== 'play') return; const i = +b.dataset.i, ref = GREF(WG.id); let fin;
    try {
      await db.runTransaction(async tx => {
        const d = (await tx.get(ref)).data(); if (d.status !== 'play') throw new Error('x');
        const sk = (d.players || []).find(p => p.uid !== d.hider).uid;
        if (d.phase === 'hide') { if (me !== d.hider) throw new Error('x'); tx.update(ref, { ring: i, phase: 'seek', opened: [] }); return; }
        if (me !== sk || (d.opened || []).includes(i)) throw new Error('x');
        const opened = (d.opened || []).concat(i), found = i === d.ring;
        if (!found && opened.length < 2) { tx.update(ref, { opened }); return; }
        const pt = found ? sk : d.hider, scores = Object.assign({}, d.scores); scores[pt] = (scores[pt] || 0) + 1;
        const nm = u => ((d.players || []).find(p => p.uid === u) || {}).name || '';
        const upd = { opened: [], ring: -1, phase: 'hide', hider: sk, round: d.round + 1, scores, last: found ? '💍 ' + nm(sk) + ' لكى المحبس!' : '🙈 ' + nm(sk) + ' ما لكاه، كان بالإيد رقم ' + (d.ring + 1) };
        if (d.round >= 5 || scores[pt] >= 3) { upd.status = 'done'; const a = d.players[0].uid, c = d.players[1].uid; upd.winner = (scores[a] || 0) > (scores[c] || 0) ? a : (scores[c] || 0) > (scores[a] || 0) ? c : null; fin = upd.winner || 'tie'; }
        tx.update(ref, upd);
      });
      if (fin) gFinish(g, fin === 'tie' ? null : fin);
    } catch (er) {}
  };
}

/* ---- سؤال وجواب (للكل) ---- */
function quizRender(g, prev) {
  const me = ME.uid, done = g.status === 'done', qi = g.qs[g.cur], q = QUIZ[qi];
  const sc = Object.entries(g.scores || {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const board = '<div class="qz-board">' + sc.map(([u, n], i) => '<span>' + (['🥇', '🥈', '🥉'][i] || '•') + ' ' + esc((g.names || {})[u] || '') + ' <b>' + toAr(n) + '</b></span>').join('') + '</div>';
  if (done) { WG.el.innerHTML = '<div class="wg-top"><button class="x" onclick="gameClose()">✕</button><b>❓ سؤال وجواب</b></div>' + gDone(g, prev) + board; return; }
  if (!WG.qOrder || WG.qOrder.k !== g.cur) WG.qOrder = { k: g.cur, o: gShuffle(q.o.slice()), lock: false };
  const ans = g.ans;
  const left = Math.max(0, 20 - Math.floor((Date.now() - g.qTs) / 1000));
  WG.el.innerHTML = '<div class="wg-top"><button class="x" onclick="gameClose()">✕</button><b>❓ سؤال وجواب</b><span class="coins">' + toAr(g.cur + 1) + ' / ١٠</span></div>' + board +
    '<div class="qz-q">' + esc(q.q) + '<div class="qz-t" id="qzT">' + (ans ? '' : '⏱️ ' + toAr(left)) + '</div></div>' +
    '<div class="qz-o">' + WG.qOrder.o.map(o => '<button data-o="' + esc(o) + '" class="' + (ans && o === q.c ? 'ok' : '') + '">' + esc(o) + '</button>').join('') + '</div>' +
    (ans ? '<div class="duel-last"><p>' + (ans.uid ? '✅ ' + esc(ans.name) + ' جاوب صح!' : '⌛ خلص الوقت، الجواب: ' + esc(q.c)) + '</p></div>' : '');
  if (ans && (!prev || !prev.ans)) chime();
  clearInterval(WG.qTimer);
  WG.qTimer = setInterval(() => {
    const t = WG && WG.el.querySelector('#qzT'); const l = Math.max(0, 20 - Math.floor((Date.now() - g.qTs) / 1000)); if (t && !g.ans) t.textContent = '⏱️ ' + toAr(l);
    if (g.by === me && WG && WG.g === g) {
      if (!g.ans && l <= 0) GREF(WG.id).update({ ans: { uid: null } }).catch(() => {});
      if (g.ans && Date.now() - (g.ansTs || g.qTs) > 2600) quizNext(g);
    }
  }, 500);
  WG.el.querySelector('.qz-o').onclick = async e => {
    const b = e.target.closest('button'); if (!b || ans || WG.qOrder.lock) return;
    if (b.dataset.o !== q.c) { WG.qOrder.lock = true; b.classList.add('no'); sfx(160, .25, 'square', .05); toast('غلط ❌ انتظر السؤال الجاي'); return; }
    const ref = GREF(WG.id);
    try {
      await db.runTransaction(async tx => { const d = (await tx.get(ref)).data(); if (d.cur !== g.cur || d.ans) throw new Error('late');
        tx.update(ref, { ans: { uid: me, name: ME.name }, ansTs: Date.now(), ['scores.' + me]: ((d.scores || {})[me] || 0) + 1, ['names.' + me]: ME.name }); });
    } catch (er) { if (er.message === 'late') toast('سبقوك 😅'); }
  };
}
let quizBusy = false;
async function quizNext(g) {
  if (quizBusy) return; quizBusy = true;
  const ref = GREF(WG.id);
  try {
    let fin;
    await db.runTransaction(async tx => { const d = (await tx.get(ref)).data(); if (d.cur !== g.cur || !d.ans) throw new Error('x');
      if (d.cur >= d.qs.length - 1) { const sc = Object.entries(d.scores || {}).sort((a, b) => b[1] - a[1]); const w = sc.length && sc[0][1] > 0 && (!sc[1] || sc[1][1] < sc[0][1]) ? sc[0][0] : null; tx.update(ref, { status: 'done', winner: w }); fin = w || 'tie'; }
      else tx.update(ref, { cur: d.cur + 1, ans: null, qTs: Date.now() }); });
    if (fin) gFinish(g, fin === 'tie' ? null : fin);
  } catch (e) {}
  quizBusy = false;
}

/* ---- التوجيه ---- */
window.gRenderType = function (g, prev) {
  if (g.type === 'xo') xoRender(g, prev);
  else if (g.type === 'rps' || g.type === 'dice') duelRender(g, prev);
  else if (g.type === 'muhaibis') muhRender(g, prev);
  else if (g.type === 'quiz') quizRender(g, prev);
};
