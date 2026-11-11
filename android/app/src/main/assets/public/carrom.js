/* حجينه — كيرم (لاعبين) */
'use strict';
GT.carrom = { n: 'كيرم', e: '🥏', d: 'اسحب الضاربة لورا وأطلقها، ودخّل حجاراتك بالجيوب', duo: 1 };
const CR_R = 2.15, CR_SR = 2.9, CR_POCK = [[4, 4], [96, 4], [4, 96], [96, 96]], CR_PR = 4.4, CR_BASE = 81;
GINIT.carrom = () => {
  const coins = [{ x: 50, y: 50, c: 'q' }];
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; coins.push({ x: 50 + Math.cos(a) * 4.4, y: 50 + Math.sin(a) * 4.4, c: i % 2 ? 'b' : 'w' }); }
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6 + Math.PI / 12; coins.push({ x: 50 + Math.cos(a) * 8.8, y: 50 + Math.sin(a) * 8.8, c: i % 2 ? 'w' : 'b' }); }
  return { coins, prev: null, shot: null, seq: 0, turn: null };
};
let CR = null;
function crSim(coins, shot, onFrame) {
  const bodies = coins.map(c => ({ x: c.x, y: c.y, vx: 0, vy: 0, r: CR_R, m: 1, c: c.c, out: false }));
  const st = { x: shot.x, y: shot.base, vx: Math.cos(shot.ang) * shot.pow, vy: Math.sin(shot.ang) * shot.pow, r: CR_SR, m: 1.6, c: 's', out: false };
  bodies.push(st);
  const dt = 1 / 120; let steps = 0; const frames = [];
  while (steps < 120 * 25) {
    steps++; let moving = false;
    for (const b of bodies) { if (b.out) continue; b.x += b.vx * dt; b.y += b.vy * dt; const sp = Math.hypot(b.vx, b.vy); if (sp > 0) { const ns = Math.max(0, sp - 26 * dt) * (1 - .35 * dt); b.vx *= ns / sp; b.vy *= ns / sp; } if (Math.hypot(b.vx, b.vy) > .25) moving = true; else { b.vx = 0; b.vy = 0; }
      if (b.x < b.r) { b.x = b.r; b.vx = -b.vx * .72; } if (b.x > 100 - b.r) { b.x = 100 - b.r; b.vx = -b.vx * .72; }
      if (b.y < b.r) { b.y = b.r; b.vy = -b.vy * .72; } if (b.y > 100 - b.r) { b.y = 100 - b.r; b.vy = -b.vy * .72; }
      for (const p of CR_POCK) if (Math.hypot(b.x - p[0], b.y - p[1]) < CR_PR) { b.out = true; b.vx = b.vy = 0; b.px = p[0]; b.py = p[1]; } }
    for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i], b = bodies[j]; if (a.out || b.out) continue; const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), md = a.r + b.r;
      if (d > 0 && d < md) { const nx = dx / d, ny = dy / d, ov = md - d, tm = a.m + b.m; a.x -= nx * ov * b.m / tm; a.y -= ny * ov * b.m / tm; b.x += nx * ov * a.m / tm; b.y += ny * ov * a.m / tm;
        const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (rv < 0) { const jj = -(1 + .9) * rv / (1 / a.m + 1 / b.m); a.vx -= jj * nx / a.m; a.vy -= jj * ny / a.m; b.vx += jj * nx / b.m; b.vy += jj * ny / b.m; moving = true; } } }
    if (onFrame && steps % 2 === 0) frames.push(bodies.map(b => [b.x, b.y, b.out]));
    if (!moving) break;
  }
  return { bodies, frames };
}
function carromRender(g, prev) {
  if (g.status === 'wait') return gWait(g);
  const me = ME.uid, ps = g.players || [];
  if (g.status === 'play' && !g.turn && g.by === me) { GREF(WG.id).update({ turn: ps[0].uid }).catch(() => {}); return; }
  const flip = ps[1] && ps[1].uid === me;
  if (!CR || CR.id !== WG.id) crBuild(g, flip);
  CR.g = g;
  const myTurn = g.turn === me && g.status === 'play';
  const col = uid => ps[0] && uid === ps[0].uid ? 'w' : 'b';
  WG.el.querySelector('.cr-head').innerHTML = gTop(g, g.status === 'done' ? '' : (myTurn ? 'دورك (' + (col(me) === 'w' ? '⚪' : '⚫') + ')' : (amPlayer(g) ? 'دور الخصم' : '👀 تشاهد'))) + (g.status === 'done' ? gDone(g, prev) : '') + (g.log ? '<div class="ld-log" style="text-align:center">' + esc(g.log) + '</div>' : '');
  WG.el.querySelector('.cr-ctl').hidden = !myTurn || CR.anim;
  if (g.shot && (!prev || !prev.shot || prev.shot.seq !== g.shot.seq) && g.shot.by !== me && g.prev) crAnimate(g.prev, g.shot, () => crDrawState(g.coins));
  else if (!CR.anim) crDrawState(g.coins);
}
function crBuild(g, flip) {
  WG.el.innerHTML = '<div class="cr-head"></div><canvas class="cr-cv"></canvas><div class="cr-ctl"><small>حرّك الضاربة يمين ويسار، وبعدين اسحب منها لورا وأطلق</small><input type="range" min="18" max="82" step=".5" value="50" class="cr-x"></div>';
  CR = { id: WG.id, cv: WG.el.querySelector('.cr-cv'), flip, sx: 50, anim: false, drag: null };
  const cv = CR.cv, size = Math.min(WG.el.clientWidth - 24, window.innerHeight * .56), d = Math.min(2, devicePixelRatio || 1);
  cv.style.width = cv.style.height = size + 'px'; cv.width = cv.height = Math.round(size * d); CR.ctx = cv.getContext('2d'); CR.ctx.setTransform(size * d / 100, 0, 0, size * d / 100, 0, 0); CR.size = size;
  WG.el.querySelector('.cr-x').oninput = e => { CR.sx = +e.target.value; crDrawState(CR.g.coins); };
  const toB = e => { const r = cv.getBoundingClientRect(); let x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100; if (CR.flip) { x = 100 - x; y = 100 - y; } return [x, y]; };
  const base = () => CR.flip ? 100 - CR_BASE : CR_BASE, sxp = () => CR.flip ? 100 - CR.sx : CR.sx;
  cv.onpointerdown = e => { if (!CR.g || CR.g.turn !== ME.uid || CR.anim || CR.g.status !== 'play') return; const [x, y] = toB(e); if (Math.hypot(x - sxp(), y - base()) > 9) return; CR.drag = [x, y]; cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = e => { if (!CR.drag) return; CR.drag = toB(e); crDrawState(CR.g.coins); };
  cv.onpointerup = () => { if (!CR.drag) return; const [x, y] = CR.drag; CR.drag = null; const dx = sxp() - x, dy = base() - y, len = Math.hypot(dx, dy); if (len < 3) { crDrawState(CR.g.coins); return; } crShoot({ x: sxp(), base: base(), ang: Math.atan2(dy, dx), pow: Math.min(1, len / 30) * 190 }); };
}
function crDrawState(coins, sim) {
  const c = CR.ctx; if (!c) return; c.save(); c.clearRect(0, 0, 100, 100);
  if (CR.flip) { c.translate(100, 100); c.rotate(Math.PI); }
  const g = c.createLinearGradient(0, 0, 100, 100); g.addColorStop(0, '#F3D9A4'); g.addColorStop(1, '#E2BE7E'); c.fillStyle = g; c.fillRect(0, 0, 100, 100);
  c.strokeStyle = '#6B3A16'; c.lineWidth = 1.6; c.strokeRect(.8, .8, 98.4, 98.4);
  c.lineWidth = .35; c.strokeStyle = '#8A4E22';
  [[CR_BASE, 1], [100 - CR_BASE, 1]].forEach(([y]) => { c.strokeRect(18, y - 2.9, 64, 5.8); });
  [[19, 1], [81, 0]].forEach(([x]) => { c.strokeRect(x - 2.9, 18, 5.8, 64); });
  c.beginPath(); c.arc(50, 50, 12, 0, 7); c.stroke(); c.beginPath(); c.arc(50, 50, 3, 0, 7); c.fillStyle = '#C0392B'; c.fill();
  CR_POCK.forEach(p => { c.beginPath(); c.arc(p[0], p[1], CR_PR, 0, 7); c.fillStyle = '#2A1606'; c.fill(); });
  const draw = (x, y, t, r) => { const gr = c.createRadialGradient(x - r * .35, y - r * .35, r * .1, x, y, r);
    if (t === 'w') { gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#D9CDB5'); } else if (t === 'b') { gr.addColorStop(0, '#6a6a6a'); gr.addColorStop(1, '#151515'); } else if (t === 'q') { gr.addColorStop(0, '#FF8A9B'); gr.addColorStop(1, '#B00C28'); } else { gr.addColorStop(0, '#E9F6FF'); gr.addColorStop(1, '#7FB2D8'); }
    c.beginPath(); c.arc(x, y, r, 0, 7); c.fillStyle = gr; c.fill(); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = .3; c.stroke(); c.beginPath(); c.arc(x, y, r * .55, 0, 7); c.stroke(); };
  if (sim) sim.forEach(b => { if (!b[2]) draw(b[0], b[1], b[3], b[3] === 's' ? CR_SR : CR_R); });
  else {
    (coins || []).forEach(k => draw(k.x, k.y, k.c, CR_R));
    if (CR.g && CR.g.turn === ME.uid && CR.g.status === 'play') { const bx = CR.flip ? 100 - CR.sx : CR.sx, by = CR.flip ? 100 - CR_BASE : CR_BASE; draw(bx, by, 's', CR_SR);
      if (CR.drag) { const dx = bx - CR.drag[0], dy = by - CR.drag[1], len = Math.min(30, Math.hypot(dx, dy)), a = Math.atan2(dy, dx); c.strokeStyle = 'rgba(255,255,255,.9)'; c.setLineDash([1.2, 1.2]); c.lineWidth = .6; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + Math.cos(a) * len * 2.2, by + Math.sin(a) * len * 2.2); c.stroke(); c.setLineDash([]);
        c.fillStyle = 'rgba(232,48,76,' + (.3 + len / 45) + ')'; c.beginPath(); c.arc(bx, by, CR_SR + len / 10, 0, 7); c.fill(); } }
  }
  c.restore();
}
function crAnimate(coins, shot, done) {
  CR.anim = true; WG.el.querySelector('.cr-ctl').hidden = true;
  const { frames } = crSim(coins, shot, true), types = coins.map(k => k.c).concat('s'); let i = 0;
  const step = () => { if (!CR || !WG) return; if (i >= frames.length) { CR.anim = false; done && done(); if (CR.g) WG.el.querySelector('.cr-ctl').hidden = !(CR.g.turn === ME.uid && CR.g.status === 'play'); return; }
    crDrawState(null, frames[i].map((f, k) => [f[0], f[1], f[2], types[k]])); if (i % 6 === 0) sfx(200 + Math.random() * 100, .03, 'sine', .02); i += 2; requestAnimationFrame(step); };
  step();
}
async function crShoot(shot) {
  const g = CR.g, coins = g.coins, me = ME.uid, ps = g.players, mycol = ps[0].uid === me ? 'w' : 'b', op = ps.find(p => p.uid !== me).uid;
  const { bodies } = crSim(coins, shot);
  const striker = bodies[bodies.length - 1], left = [], pot = { w: 0, b: 0, q: 0 };
  bodies.slice(0, -1).forEach(b => { if (b.out) pot[b.c]++; else left.push({ x: +b.x.toFixed(3), y: +b.y.toFixed(3), c: b.c }); });
  const sc = Object.assign({}, g.scores); const oc = mycol === 'w' ? 'b' : 'w';
  sc[me] = (sc[me] || 0) + pot[mycol] + pot.q * 3; sc[op] = (sc[op] || 0) + pot[oc];
  let keep = pot[mycol] > 0 || pot.q > 0, log = '';
  if (striker.out) { sc[me] = Math.max(0, sc[me] - 1); keep = false; log = '⚠️ الضاربة دخلت الجيب: -1'; }
  else log = (pot[mycol] || pot.q) ? '🎯 دخّل ' + (pot[mycol] + pot.q) + (pot.q ? ' (وياها الملكة +3)' : '') : (pot[oc] ? 'دخّل حجارة الخصم 😅' : '');
  const upd = { prev: coins, coins: left, shot: Object.assign({ seq: (g.seq || 0) + 1, by: me }, shot), seq: (g.seq || 0) + 1, scores: sc, turn: keep ? me : op, log };
  if (!left.some(k => k.c === 'w') || !left.some(k => k.c === 'b')) { upd.status = 'done'; const a = ps[0].uid, b = ps[1].uid; upd.winner = sc[a] > sc[b] ? a : sc[b] > sc[a] ? b : null; }
  crAnimate(coins, shot, async () => {
    try { await GREF(WG.id).update(upd); if (upd.status === 'done') gFinish(g, upd.winner); } catch (e) { toast(errMsg(e)); }
  });
}
window.crStop = () => { CR = null; };
