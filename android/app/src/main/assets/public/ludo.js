/* حجينه — لودو (2 إلى 4 لاعبين) */
'use strict';
GT.ludo = { n: 'لودو', e: '🎯', d: 'من 2 إلى 4 لاعبين، ارمِ الزار وأوصل حجاراتك الأربعة للبيت', duo: 1 };
const LD_PATH = [[6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], [0, 7], [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], [7, 14], [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], [14, 7], [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0], [7, 0], [6, 0]];
const LD_COL = [{ n: 'أحمر', c: '#E8304C', start: 0, home: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]], base: [1, 1] }, { n: 'أخضر', c: '#2EAD5B', start: 13, home: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]], base: [1, 10] },
  { n: 'أصفر', c: '#F2B705', start: 26, home: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]], base: [10, 10] }, { n: 'أزرق', c: '#2E7BD6', start: 39, home: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]], base: [10, 1] }];
const LD_SAFE = new Set([0, 8, 13, 21, 26, 34, 39, 47]);
GINIT.ludo = () => ({ tokens: {}, turn: 0, dice: 0, phase: 'roll', log: '' });
const ldAbs = (ci, prog) => (LD_COL[ci].start + prog) % 52;
function ldCell(ci, prog, k) {
  if (prog < 0) { const b = LD_COL[ci].base, o = [[0, 0], [0, 2], [2, 0], [2, 2]][k]; return [b[0] + o[0] + .5, b[1] + o[1] + .5]; }
  if (prog >= 56) { const o = [[-.35, -.35], [-.35, .35], [.35, -.35], [.35, .35]][k]; const d = [[0, -1], [-1, 0], [0, 1], [1, 0]][ci]; return [7 + d[0] * .9 + o[0] * .6, 7 + d[1] * .9 + o[1] * .6]; }
  if (prog >= 51) return LD_COL[ci].home[prog - 51];
  return LD_PATH[ldAbs(ci, prog)];
}
function ldMovable(g, ci, uid) { const t = (g.tokens || {})[uid] || [-1, -1, -1, -1], d = g.dice; return t.map((p, k) => (p < 0 ? d === 6 : p + d <= 56) ? k : -1).filter(k => k >= 0); }
function ludoRender(g, prev) {
  const me = ME.uid, ps = g.players || [], myIdx = ps.findIndex(p => p.uid === me);
  if (g.status === 'wait') {
    WG.el.innerHTML = '<div class="wg-top"><button class="x" onclick="gameClose()">✕</button><b>🎯 لودو</b></div><div class="wg-wait"><b>اللاعبين (' + toAr(ps.length) + ' / ٤)</b><div class="ld-wait">' + ps.map((p, i) => '<div>' + avHtml(p, 54) + '<small style="color:' + LD_COL[i].c + '">' + esc(p.name) + '</small></div>').join('') + '</div>' +
      (myIdx < 0 && ps.length < 4 ? '<button class="btn btn-p" style="width:auto;padding:12px 34px" id="ldJoin">🎯 انضم</button>' : '') + (g.by === me ? (ps.length >= 2 ? '<button class="btn btn-p" style="width:auto;padding:12px 34px" id="ldGo">▶️ ابدأ اللعب</button>' : '<span style="color:#cfe6f5">ننتظر لاعب واحد على الأقل...</span>') : (myIdx >= 0 ? '<span style="color:#cfe6f5">⏳ ننتظر ' + esc(ps[0].name) + ' يبدي</span>' : '')) + '</div>';
    const j = WG.el.querySelector('#ldJoin'); if (j) j.onclick = async () => { const ref = GREF(WG.id); try { await db.runTransaction(async tx => { const d = (await tx.get(ref)).data(); if (d.status !== 'wait' || d.players.length >= 4 || d.players.some(p => p.uid === me)) throw new Error('x'); tx.update(ref, { players: d.players.concat(meLite()), ['scores.' + me]: 0 }); }); } catch (e) { toast('ما كدرت تنضم'); } };
    const s = WG.el.querySelector('#ldGo'); if (s) s.onclick = async () => { const tokens = {}; ps.forEach(p => tokens[p.uid] = [-1, -1, -1, -1]); await GREF(WG.id).update({ status: 'play', tokens, turn: 0, phase: 'roll', dice: 0 }).catch(e => toast(errMsg(e))); roomRef().update({ 'game.status': 'play' }).catch(() => {}); };
    return;
  }
  const cur = ps[g.turn] || {}, myTurn = cur.uid === me && g.status === 'play';
  const mov = myTurn && g.phase === 'move' ? ldMovable(g, g.turn, me) : [];
  let cells = '';
  for (let r = 0; r < 15; r++) for (let c = 0; c < 15; c++) {
    let cls = 'ldc', st = '';
    const bi = r < 6 && c < 6 ? 0 : r < 6 && c > 8 ? 1 : r > 8 && c > 8 ? 2 : r > 8 && c < 6 ? 3 : -1;
    if (bi >= 0) { cls += ' base'; st = 'background:' + LD_COL[bi].c; }
    else if (r >= 6 && r <= 8 && c >= 6 && c <= 8) cls += ' mid';
    else { const pi = LD_PATH.findIndex(p => p[0] === r && p[1] === c), hi = LD_COL.findIndex(cc => cc.home.some(h => h[0] === r && h[1] === c));
      if (hi >= 0) st = 'background:' + LD_COL[hi].c; else if (pi >= 0) { const si = LD_COL.findIndex(cc => cc.start === pi); if (si >= 0) st = 'background:' + LD_COL[si].c; else if (LD_SAFE.has(pi)) cls += ' safe'; } else cls += ' none'; }
    cells += '<i class="' + cls + '" style="' + st + '"></i>';
  }
  let toks = '';
  ps.forEach((p, ci) => { ((g.tokens || {})[p.uid] || [-1, -1, -1, -1]).forEach((pr, k) => { const [r, c] = ldCell(ci, pr, k); const can = ci === g.turn && mov.includes(k);
    toks += '<button class="ldt' + (can ? ' can' : '') + '" data-k="' + k + '" style="top:' + (r / 15 * 100 + .6) + '%;left:' + (c / 15 * 100 + .6) + '%;background:' + LD_COL[ci].c + '"></button>'; }); });
  const dice = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][g.dice] || '🎲';
  WG.el.innerHTML = '<div class="wg-top"><button class="x" onclick="gameClose()">✕</button><b>🎯 لودو</b></div>' +
    '<div class="ld-pl">' + ps.map((p, i) => '<div class="' + (i === g.turn ? 'on' : '') + '" style="--c:' + LD_COL[i].c + '">' + avHtml(p, 34) + '<small>' + esc(p.name) + '</small><b>🏠 ' + toAr(((g.tokens || {})[p.uid] || []).filter(x => x >= 56).length) + '</b></div>').join('') + '</div>' +
    (g.status === 'done' ? gDone(g, prev) : '') +
    '<div class="ld-board">' + cells + '<div class="ld-center"></div>' + toks + '</div>' +
    '<div class="ld-bot"><div class="ld-log">' + esc(g.log || '') + '</div>' + (g.status === 'play' ? (myTurn && g.phase === 'roll' ? '<button class="ld-dice roll" id="ldRoll">' + dice + '<small>ارمِ</small></button>' : '<div class="ld-dice">' + dice + '<small>' + (myTurn ? 'اختار حجارة' : 'دور ' + esc(cur.name || '')) + '</small></div>') : '') + '</div>';
  if (prev && prev.dice !== g.dice && g.dice) sfx(500, .1, 'square', .05);
  const rb = WG.el.querySelector('#ldRoll'); if (rb) rb.onclick = () => ldAct({ roll: 1 });
  WG.el.querySelectorAll('.ldt.can').forEach(b => b.onclick = () => ldAct({ k: +b.dataset.k }));
  if (myTurn && g.phase === 'move' && mov.length === 1 && !WG.ldAuto) { WG.ldAuto = 1; setTimeout(() => { WG.ldAuto = 0; ldAct({ k: mov[0] }); }, 650); }
}
async function ldAct(a) {
  const ref = GREF(WG.id), me = ME.uid; let fin;
  try {
    await db.runTransaction(async tx => {
      const d = (await tx.get(ref)).data(), ps = d.players, ci = d.turn; if (d.status !== 'play' || ps[ci].uid !== me) throw new Error('x');
      const next = () => (ci + 1) % ps.length, nm = ps[ci].name;
      if (a.roll) { if (d.phase !== 'roll') throw new Error('x'); const v = 1 + Math.floor(Math.random() * 6), g2 = Object.assign({}, d, { dice: v }), mv = ldMovable(g2, ci, me);
        if (!mv.length) tx.update(ref, { dice: v, phase: 'roll', turn: v === 6 ? ci : next(), log: nm + ' جاب ' + v + (v === 6 ? '، يرمي مرة ثانية' : '، ما عنده حركة') });
        else tx.update(ref, { dice: v, phase: 'move', log: nm + ' جاب ' + v }); return; }
      if (d.phase !== 'move' || !ldMovable(d, ci, me).includes(a.k)) throw new Error('x');
      const tokens = JSON.parse(JSON.stringify(d.tokens)), mine = tokens[me]; let np = mine[a.k] < 0 ? 0 : mine[a.k] + d.dice; mine[a.k] = np;
      let cap = false, log = nm + ' حرّك حجارة';
      if (np <= 50) { const ab = ldAbs(ci, np); if (!LD_SAFE.has(ab)) ps.forEach((p, oi) => { if (oi === ci) return; tokens[p.uid] = tokens[p.uid].map(op => { if (op >= 0 && op <= 50 && ldAbs(oi, op) === ab) { cap = true; return -1; } return op; }); }); }
      if (cap) log = '💥 ' + nm + ' أكل حجارة!'; if (np === 56) log = '🏠 ' + nm + ' وصّل حجارة للبيت';
      const upd = { tokens, phase: 'roll', log, turn: (d.dice === 6 || cap || np === 56) ? ci : next() };
      if (mine.every(x => x >= 56)) { upd.status = 'done'; upd.winner = me; fin = me; }
      tx.update(ref, upd);
    });
    if (fin) gFinish(WG.g, fin);
  } catch (e) {}
}
