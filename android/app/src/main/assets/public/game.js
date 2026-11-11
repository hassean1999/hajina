/* حجينه — لعبة تحدي الكلمات */
'use strict';
const WG_CATS = {
  'مدن عراقية': ['بغداد', 'بصرة', 'موصل', 'نجف', 'كربلاء', 'أربيل', 'كوت', 'حلة', 'سماوة', 'عمارة', 'دهوك', 'كركوك', 'زاخو', 'ديالى', 'تكريت'],
  'أكلات عراقية': ['دولمة', 'كبة', 'تمن', 'قيمر', 'كاهي', 'سمك', 'باجة', 'تشريب', 'كليجة', 'مسكوف', 'برياني', 'لبلبي', 'كباب', 'شاي'],
  'أغراض البيت': ['باب', 'شباك', 'سرير', 'كرسي', 'ميز', 'مروحة', 'ثلاجة', 'قنفة', 'سجادة', 'مرآة', 'بطانية', 'مخدة'],
  'حيوانات': ['أسد', 'نمر', 'جمل', 'حصان', 'غزال', 'ذيب', 'قطة', 'صقر', 'حمامة', 'دجاجة', 'أرنب', 'فيل', 'ثعلب'],
  'ألعاب وتسلية': ['محيبس', 'دومنة', 'طاولي', 'شطرنج', 'كرة', 'سباحة', 'لعبة', 'تحدي', 'سباق', 'ورق']
};
const WG_COLS = 5, WG_ROWS = 6, WG_N = WG_COLS * WG_ROWS;
const WG_FILL = 'ابتجحدرزسشصطعفقكلمنهوي';
const WG_TILE = ['#7CC6F2', '#B48CF0', '#F5A04A', '#F7D54E', '#F28AB0', '#8FD694', '#C79A6B', '#6FB8E0', '#E58F5A'];
let WG = null;

function wgNeighbors(i) { const r = Math.floor(i / WG_COLS), c = i % WG_COLS, n = []; if (r > 0) n.push(i - WG_COLS); if (r < WG_ROWS - 1) n.push(i + WG_COLS); if (c > 0) n.push(i - 1); if (c < WG_COLS - 1) n.push(i + 1); return n; }
function wgShuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function wgBuild() {
  for (let attempt = 0; attempt < 80; attempt++) {
    const cats = Object.keys(WG_CATS), cat = cats[Math.floor(Math.random() * cats.length)];
    const pool = wgShuffle(WG_CATS[cat].slice()); const words = []; let len = 0;
    for (const w of pool) { const l = Array.from(w).length; if (words.length < 4 && len + l <= 24) { words.push(w); len += l; } }
    const grid = Array(WG_N).fill(''), place = {}; let ok = true;
    for (const w of words) {
      const ch = Array.from(w); let path = null;
      for (let t = 0; t < 60 && !path; t++) {
        const free = grid.map((x, i) => x ? -1 : i).filter(i => i >= 0); const start = free[Math.floor(Math.random() * free.length)];
        const dfs = (p) => { if (p.length === ch.length) return p; for (const n of wgShuffle(wgNeighbors(p[p.length - 1]))) { if (!grid[n] && !p.includes(n)) { const r = dfs(p.concat(n)); if (r) return r; } } return null; };
        path = dfs([start]);
      }
      if (!path) { ok = false; break; }
      path.forEach((i, k) => grid[i] = ch[k]); place[w] = path;
    }
    if (!ok) continue;
    for (let i = 0; i < WG_N; i++) if (!grid[i]) grid[i] = WG_FILL[Math.floor(Math.random() * WG_FILL.length)];
    return { cat, words, grid, place };
  }
  return null;
}
const wgRef = id => db.collection('games').doc(id);

function openGames() {
  const g = R.data && R.data.game;
  const live = g && g.status !== 'done' && Date.now() - (g.ts || 0) < 30 * 60000;
  const m = modal('<h3>🎮 ألعاب الروم</h3><div class="li" id="gWord" style="border:1px solid var(--border);border-radius:16px;background:var(--surface)"><span class="ic" style="font-size:30px">🧩</span><div style="flex:1"><b>تحدي الكلمات</b><div style="font-size:12px;color:var(--fg2)">لاكي الكلمات المخفية بين الحروف قبل خصمك</div></div><span class="chip">' + (live ? 'ادخل' : 'العب') + '</span></div>');
  m.querySelector('#gWord').onclick = () => { m.close(); live ? gameOpen(g.id) : gameCreate(); };
}
async function gameCreate() {
  const b = wgBuild(); if (!b) return toast('صار خطأ، جرب مرة ثانية');
  const ref = db.collection('games').doc();
  try {
    await ref.set({ room: R.id, type: 'word', status: 'wait', players: [meLite()], cat: b.cat, words: b.words, grid: b.grid, place: Object.fromEntries(Object.entries(b.place).map(([k, v]) => [k, v])), found: {}, scores: { [ME.uid]: 0 }, by: ME.uid, ts: Date.now() });
    await roomRef().update({ game: { id: ref.id, type: 'word', status: 'wait', by: ME.name, byUid: ME.uid, ts: Date.now() } });
    roomRef().collection('messages').add(Object.assign({ type: 'sys', text: '🧩 ' + ME.name + ' فتح تحدي الكلمات، منو يتحداه؟', ts: FV.serverTimestamp() }, { uid: ME.uid })).catch(() => {});
    gameOpen(ref.id);
  } catch (e) { toast(errMsg(e)); }
}
function syncGameBanner() {
  const el = $('gameBanner'), g = R.data && R.data.game;
  const live = g && g.status !== 'done' && Date.now() - (g.ts || 0) < 30 * 60000;
  if (!live) { el.hidden = true; return; }
  el.hidden = false;
  el.innerHTML = '🧩 ' + esc(g.by) + (g.status === 'wait' ? ' يتحداكم بالكلمات' : ' — اللعبة شغالة') + '<button>' + (g.status === 'wait' ? 'العب' : 'شاهد') + '</button>';
  el.onclick = () => gameOpen(g.id);
}
function gameOpen(id) {
  if (WG && WG.id === id) return;
  gameClose(true);
  const w = document.createElement('div'); w.className = 'wg'; document.body.appendChild(w);
  WG = { id, el: w, sel: [], g: null };
  WG.unsub = wgRef(id).onSnapshot(s => { if (!s.exists) { gameClose(); return; } const prev = WG.g; WG.g = s.data(); if (WG.g.type && WG.g.type !== 'word') gRenderType(WG.g, prev); else wgRender(prev); }, e => toast(errMsg(e)));
}
window.gameClose = function (silent) { if (!WG) return; clearInterval(WG.qTimer); WG.unsub && WG.unsub(); WG.el.remove(); WG = null; };
function wgPlayer(g, i) { return (g.players || [])[i]; }
function wgRender(prev) {
  const g = WG.g, w = WG.el, me = ME.uid, iAmIn = (g.players || []).some(p => p.uid === me);
  const p1 = wgPlayer(g, 0), p2 = wgPlayer(g, 1);
  const opp = (g.players || []).find(p => p.uid !== me);
  const pl = (p, mine) => p ? '<div class="wg-p">' + avHtml(p, 58) + '<b>' + nameHtml(p, true) + '</b><span>' + toAr((g.scores || {})[p.uid] || 0) + '</span></div>' : '<div class="wg-p"><div class="av" style="width:58px;height:58px;background:rgba(255,255,255,.15)">👤</div><b>' + (mine ? 'أنا' : 'الخصم') + '</b><span>-</span></div>';
  const meP = (g.players || []).find(p => p.uid === me);
  const top = '<div class="wg-top"><button class="x" onclick="gameClose()">✕</button><b>🧩 تحدي الكلمات</b><span class="coins">' + SC + ' ' + fmtK(ME.silver || 0) + '</span></div>' +
    '<div class="wg-pl">' + pl(iAmIn ? meP : p1, true) + '<div class="wg-mid" id="wgMid"></div>' + pl(iAmIn ? opp : p2, false) + '</div>';
  if (g.status === 'wait') {
    const mine = g.by === me;
    w.innerHTML = top + '<div class="wg-wait">' + (mine ? '<b>⏳ ننتظر واحد يتحداك...</b><span style="color:#cfe6f5">أي واحد بالروم يكدر يضغط «العب»</span><button class="btn btn-p" style="width:auto;padding:12px 28px" id="wgSolo">ابدأ وحدي</button>' : (iAmIn ? '<b>⏳ ...</b>' : '<b>' + esc(p1 ? p1.name : '') + ' يتحداك!</b><button class="btn btn-p" style="width:auto;padding:12px 36px" id="wgJoin">⚔️ اقبل التحدي</button>')) + '</div>';
    const j = w.querySelector('#wgJoin'); if (j) j.onclick = wgJoin;
    const so = w.querySelector('#wgSolo'); if (so) so.onclick = () => wgStart();
    return;
  }
  const found = g.found || {};
  const owner = {}; Object.entries(found).forEach(([word, f]) => (f.path || []).forEach(i => owner[i] = f.uid));
  w.innerHTML = top +
    '<div class="wg-cat">الموضوع: ' + esc(g.cat) + ' — لاكي ' + toAr(g.words.length) + ' كلمات</div>' +
    '<div class="wg-words">' + g.words.map(x => { const f = found[x]; return '<span class="' + (f ? (f.uid === me ? 'me' : 'op') : '') + '">' + (f ? Array.from(x).join(' ') : Array.from(x).map(() => '_').join(' ')) + '</span>'; }).join('') + '</div>' +
    '<div class="wg-grid" id="wgGrid" style="grid-template-columns:repeat(' + WG_COLS + ',1fr)">' + g.grid.map((ch, i) => '<div class="wg-c' + (owner[i] ? (owner[i] === me ? ' me' : ' op') : '') + '" data-i="' + i + '" style="background:' + WG_TILE[(i * 7 + g.ts) % WG_TILE.length] + '">' + ch + '</div>').join('') + '</div>' +
    '<div class="wg-bot">' + (g.status === 'done' ? '<button onclick="gameClose()">رجوع للروم</button>' : '<button id="wgHint">تلميح (' + SC + ' 10)</button>') + '</div>';
  if (g.status === 'done') {
    const win = (g.players || []).find(p => p.uid === g.winner);
    w.querySelector('#wgMid').innerHTML = win ? '🏆 ' + esc(win.name) : 'تعادل 🤝';
    if (!prev || prev.status !== 'done') { chime(true); if (g.winner === me) toast('🏆 فزت بالتحدي!'); }
    return;
  }
  const h = w.querySelector('#wgHint'); if (h) h.onclick = wgHint;
  if (iAmIn) wgBind(); else w.querySelector('#wgMid').textContent = '👀 تشاهد';
  if (prev && Object.keys(prev.found || {}).length < Object.keys(found).length) { const last = Object.values(found).sort((a, b) => b.t - a.t)[0]; if (last && last.uid !== me) sfx(330, .25, 'square', .06); }
}
async function wgJoin() {
  const ref = wgRef(WG.id);
  try {
    await db.runTransaction(async tx => { const s = await tx.get(ref), g = s.data(); if ((g.players || []).length >= 2 || g.status !== 'wait') throw new Error('full'); tx.update(ref, { players: g.players.concat(meLite()), ['scores.' + ME.uid]: 0, status: 'play', started: Date.now() }); });
    roomRef().update({ 'game.status': 'play' }).catch(() => {});
  } catch (e) { toast(e.message === 'full' ? 'اللعبة اكتملت' : errMsg(e)); }
}
async function wgStart() { await wgRef(WG.id).update({ status: 'play', started: Date.now() }).catch(e => toast(errMsg(e))); roomRef().update({ 'game.status': 'play' }).catch(() => {}); }
function wgBind() {
  const grid = WG.el.querySelector('#wgGrid'); if (!grid) return;
  const cellAt = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.classList.contains('wg-c') ? +el.dataset.i : -1; };
  const paint = () => { grid.querySelectorAll('.wg-c').forEach(c => c.classList.toggle('sel', WG.sel.includes(+c.dataset.i))); WG.el.querySelector('#wgMid').textContent = WG.sel.map(i => WG.g.grid[i]).join(''); };
  let down = false;
  grid.onpointerdown = e => { const i = cellAt(e.clientX, e.clientY); if (i < 0) return; down = true; WG.sel = [i]; paint(); sfx(600, .05, 'sine', .04); try { grid.setPointerCapture(e.pointerId); } catch (_) {} };
  grid.onpointermove = e => { if (!down) return; const i = cellAt(e.clientX, e.clientY); if (i < 0) return; const s = WG.sel, last = s[s.length - 1];
    if (i === s[s.length - 2]) { s.pop(); paint(); return; }
    if (!s.includes(i) && wgNeighbors(last).includes(i)) { s.push(i); paint(); sfx(600 + s.length * 60, .05, 'sine', .04); } };
  const up = () => { if (!down) return; down = false; const word = WG.sel.map(i => WG.g.grid[i]).join(''), path = WG.sel.slice(); WG.sel = []; paint(); wgTry(word, path); };
  grid.onpointerup = up; grid.onpointercancel = up;
}
async function wgTry(word, path) {
  const g = WG.g; if (!word || path.length < 2) return;
  if (!g.words.includes(word)) { if (path.length > 2) { WG.el.querySelector('#wgMid').textContent = '✗'; sfx(160, .2, 'square', .05); } return; }
  if ((g.found || {})[word]) return toast('انلكت قبل');
  const ref = wgRef(WG.id), me = ME.uid;
  try {
    await db.runTransaction(async tx => {
      const s = await tx.get(ref), d = s.data(); if (d.status !== 'play' || (d.found || {})[word]) throw new Error('late');
      const found = Object.assign({}, d.found, { [word]: { uid: me, path, t: Date.now() } }), scores = Object.assign({}, d.scores, { [me]: ((d.scores || {})[me] || 0) + 1 });
      const upd = { found, scores };
      if (Object.keys(found).length === d.words.length) {
        upd.status = 'done'; const ps = d.players || []; let best = null, top = -1, tie = false;
        ps.forEach(p => { const sc = scores[p.uid] || 0; if (sc > top) { top = sc; best = p.uid; tie = false; } else if (sc === top) tie = true; });
        upd.winner = tie ? null : best;
      }
      tx.update(ref, upd);
    });
    chime();
    const after = (await ref.get()).data();
    if (after.status === 'done') {
      roomRef().update({ 'game.status': 'done' }).catch(() => {});
      const win = (after.players || []).find(p => p.uid === after.winner);
      roomRef().collection('messages').add({ type: 'sys', uid: ME.uid, text: win ? '🏆 ' + win.name + ' فاز بتحدي الكلمات!' : '🤝 تعادل بتحدي الكلمات', ts: FV.serverTimestamp() }).catch(() => {});
    }
  } catch (e) { if (e.message === 'late') toast('سبقك الخصم 😅'); else toast(errMsg(e)); }
}
async function wgHint() {
  const g = WG.g, left = g.words.filter(w => !(g.found || {})[w]); if (!left.length) return;
  const myRef = db.collection('users').doc(ME.uid);
  try {
    await db.runTransaction(async tx => { const s = await tx.get(myRef), sv = (s.data() || {}).silver || 0; if (sv < 10) throw new Error('nosil'); tx.update(myRef, { silver: sv - 10 }); });
    const w = left[Math.floor(Math.random() * left.length)], p = (g.place || {})[w] || [];
    const c = WG.el.querySelector('.wg-c[data-i="' + p[0] + '"]'); if (c) { c.classList.add('hint'); setTimeout(() => c.classList.remove('hint'), 2200); }
    toast('💡 الكلمة تبدي بحرف «' + Array.from(w)[0] + '»');
  } catch (e) { toast(e.message === 'nosil' ? 'عملاتك الفضية ما تكفي' : errMsg(e)); }
}
