/* حجينه — الكيرم داخل الروم (اللوحة مكان الكراسي، والكراسي صف صغير تحتها) */
'use strict';
const CR_CLOSED = new Set();
const isCarromId = id => { const g = R.data && R.data.game; return g && g.id === id && g.type === 'carrom'; };
const _gameOpenC = window.gameOpen;
window.gameOpen = async function (id) {
  if (!R.id) return _gameOpenC(id);
  if (!isCarromId(id)) { let t = null; try { const s = await GREF(id).get(); t = s.exists && s.data().type; } catch (e) {} if (t !== 'carrom') return _gameOpenC(id); }
  if (WG && WG.id === id) return;
  gameClose(true); CR_CLOSED.delete(id);
  const w = document.createElement('div'); w.className = 'wg inroom';
  $('seats').before(w); document.body.classList.add('cr-mode');
  WG = { id, el: w, sel: [], g: null };
  WG.unsub = GREF(id).onSnapshot(s => { if (!s.exists) { gameClose(); return; } const prev = WG.g; WG.g = s.data(); gRenderType(WG.g, prev); }, e => toast(errMsg(e)));
};
const _gameCloseC = window.gameClose;
window.gameClose = function (silent) { const wasIn = WG && WG.el.classList.contains('inroom'); if (wasIn && !silent && WG) CR_CLOSED.add(WG.id); _gameCloseC(silent); document.body.classList.remove('cr-mode'); };
// الكل يشوف اللوحة تلقائياً
const _sgbC = window.syncGameBanner;
window.syncGameBanner = function () {
  _sgbC();
  const g = R.data && R.data.game;
  if (g && g.type === 'carrom' && g.id && g.status !== 'done' && Date.now() - (g.ts || 0) < 30 * 60000) {
    if ((!WG || WG.id !== g.id) && !CR_CLOSED.has(g.id)) gameOpen(g.id);
    if (WG && WG.id === g.id) $('gameBanner').hidden = true;
  }
};
const _leaveC = window.leaveRoom;
window.leaveRoom = function () { if (WG && WG.el.classList.contains('inroom')) gameClose(true); return _leaveC.apply(this, arguments); };

// رأس اللاعبين بستايل الرومات
const _crRender = window.carromRender;
window.carromRender = function (g, prev) {
  _crRender(g, prev);
  if (!WG || !WG.el.classList.contains('inroom') || g.status === 'wait') return;
  const head = WG.el.querySelector('.cr-head'); if (!head) return;
  const ps = g.players || [], sc = g.scores || {}, me = ME.uid, myTurn = g.turn === me && g.status === 'play';
  const pl = (p, side, col) => p ? '<div class="crp ' + side + (g.turn === p.uid && g.status === 'play' ? ' turn' : '') + '">' + avHtml(p, 50) + '<div class="crp-i"><b>' + esc(p.name) + '</b><div class="crp-s"><i class="crc ' + col + '"></i><span>' + toAr(sc[p.uid] || 0) + '</span></div></div></div>' : '<div></div>';
  const done = head.querySelector('.g-result'), log = head.querySelector('.ld-log');
  head.innerHTML = '<div class="crh">' + pl(ps[0], 'l', 'w') + '<div class="crh-m">' + (g.status === 'done' ? '🏁' : myTurn ? '<b class="crh-you">دورك</b>' : amPlayer(g) ? '<small>دور الخصم</small>' : '<small>👀 تشاهد</small>') + '</div>' + pl(ps[1], 'r', 'b') + '<button class="crh-x" onclick="gameClose()" title="صغّر">✕</button></div>';
  if (done) head.append(done); if (log) head.append(log);
};
const _crBuild = window.crBuild;
window.crBuild = function (g, flip) {
  _crBuild(g, flip);
  if (!WG.el.classList.contains('inroom')) return;
  const cv = CR.cv, fr = document.createElement('div'); fr.className = 'cr-frame'; cv.before(fr); fr.append(cv);
  const size = Math.min(WG.el.clientWidth - 44, window.innerHeight * .46), d = Math.min(2, devicePixelRatio || 1);
  cv.style.width = cv.style.height = size + 'px'; cv.width = cv.height = Math.round(size * d); CR.ctx = cv.getContext('2d'); CR.ctx.setTransform(size * d / 100, 0, 0, size * d / 100, 0, 0); CR.size = size;
};

/* ---------- رسم لوحة خشب حقيقية ---------- */
let CR_BG = null;
function crBoardBg() {
  if (CR_BG) return CR_BG;
  const S = 600, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'); x.scale(S / 100, S / 100);
  const g = x.createLinearGradient(0, 0, 100, 100); g.addColorStop(0, '#F2DDB4'); g.addColorStop(.5, '#E8CC98'); g.addColorStop(1, '#DDB97E'); x.fillStyle = g; x.fillRect(0, 0, 100, 100);
  let sd = 7; const rnd = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 70; i++) { const y0 = rnd() * 100, a = 0.4 + rnd() * 1.2, f = 0.05 + rnd() * .12; x.strokeStyle = 'rgba(150,100,50,' + (0.05 + rnd() * .1) + ')'; x.lineWidth = .15 + rnd() * .35; x.beginPath(); for (let k = 0; k <= 100; k += 2) { const y = y0 + Math.sin(k * f + i) * a; k ? x.lineTo(k, y) : x.moveTo(k, y); } x.stroke(); }
  const ink = '#9A5A2A';
  // خطوط القاعدة الأربع
  const rail = (horiz, p) => { x.strokeStyle = ink; x.lineWidth = .45; const a = 19, b = 81, w = 6;
    if (horiz) { x.beginPath(); x.moveTo(a, p - w / 2); x.lineTo(b, p - w / 2); x.moveTo(a, p + w / 2); x.lineTo(b, p + w / 2); x.stroke(); [a, b].forEach(px => { x.beginPath(); x.arc(px, p, w / 2, 0, 7); x.fillStyle = '#D9776A'; x.fill(); x.stroke(); x.beginPath(); x.arc(px, p, w / 2 - 1.2, 0, 7); x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = .3; x.stroke(); x.strokeStyle = ink; x.lineWidth = .45; }); }
    else { x.beginPath(); x.moveTo(p - w / 2, a); x.lineTo(p - w / 2, b); x.moveTo(p + w / 2, a); x.lineTo(p + w / 2, b); x.stroke(); [a, b].forEach(py => { x.beginPath(); x.arc(p, py, w / 2, 0, 7); x.fillStyle = '#D9776A'; x.fill(); x.stroke(); }); } };
  rail(1, 81); rail(1, 19); rail(0, 19); rail(0, 81);
  // الأسهم القطرية
  [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sy]) => { const cx = 50 - sx * 27, cy = 50 - sy * 27; x.strokeStyle = ink; x.lineWidth = .35; x.beginPath(); x.moveTo(50 - sx * 41, 50 - sy * 41); x.lineTo(cx + sx * 3.5, cy + sy * 3.5); x.stroke();
    x.beginPath(); x.arc(cx, cy, 3.6, 0, 7); x.stroke(); });
  // الدائرة الوسطية بزخرفة
  x.strokeStyle = ink; x.lineWidth = .45; x.beginPath(); x.arc(50, 50, 14, 0, 7); x.stroke();
  x.fillStyle = 'rgba(190,140,80,.25)'; x.beginPath(); for (let i = 0; i < 16; i++) { const r = i % 2 ? 6 : 12.5, a = i * Math.PI / 8; const px = 50 + Math.cos(a) * r, py = 50 + Math.sin(a) * r; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.closePath(); x.fill(); x.stroke();
  x.beginPath(); x.arc(50, 50, 3.4, 0, 7); x.fillStyle = '#C0392B'; x.fill(); x.beginPath(); x.arc(50, 50, 2, 0, 7); x.strokeStyle = '#fff'; x.lineWidth = .3; x.stroke();
  // الجيوب
  CR_POCK.forEach(p => { const gr = x.createRadialGradient(p[0], p[1], .5, p[0], p[1], CR_PR + .6); gr.addColorStop(0, '#000'); gr.addColorStop(.7, '#2A1405'); gr.addColorStop(1, '#6B3A16'); x.beginPath(); x.arc(p[0], p[1], CR_PR + .6, 0, 7); x.fillStyle = gr; x.fill(); x.strokeStyle = '#4A2208'; x.lineWidth = .6; x.stroke(); });
  return CR_BG = c;
}
window.crDrawState = function (coins, sim) {
  const c = CR && CR.ctx; if (!c) return; c.save(); c.clearRect(0, 0, 100, 100);
  if (CR.flip) { c.translate(100, 100); c.rotate(Math.PI); }
  c.drawImage(crBoardBg(), 0, 0, 100, 100);
  const draw = (x, y, t, r) => {
    c.save(); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 1.2; c.shadowOffsetY = .5;
    const gr = c.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r);
    if (t === 'w') { gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(.7, '#EFE6D2'); gr.addColorStop(1, '#BFB197'); }
    else if (t === 'b') { gr.addColorStop(0, '#7A7A7A'); gr.addColorStop(.6, '#2A2A2A'); gr.addColorStop(1, '#0A0A0A'); }
    else if (t === 'q') { gr.addColorStop(0, '#FF8A9B'); gr.addColorStop(.6, '#D81B3A'); gr.addColorStop(1, '#7A0016'); }
    else { gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(.75, '#F4ECD8'); gr.addColorStop(1, '#C8B48A'); }
    c.beginPath(); c.arc(x, y, r, 0, 7); c.fillStyle = gr; c.fill(); c.restore();
    c.lineWidth = .25; c.strokeStyle = t === 'b' ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.25)';
    [.72, .45].forEach(k => { c.beginPath(); c.arc(x, y, r * k, 0, 7); c.stroke(); });
    if (t === 's') { c.strokeStyle = '#C8902A'; c.lineWidth = .35; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.ellipse(x + Math.cos(a) * r * .38, y + Math.sin(a) * r * .38, r * .3, r * .12, a, 0, 7); c.stroke(); } c.beginPath(); c.arc(x, y, r, 0, 7); c.strokeStyle = '#B07A20'; c.lineWidth = .5; c.stroke(); }
    if (t === 'q') { c.beginPath(); c.arc(x, y, r * .45, 0, 7); c.fillStyle = 'rgba(255,255,255,.35)'; c.fill(); }
  };
  if (sim) sim.forEach(b => { if (!b[2]) draw(b[0], b[1], b[3], b[3] === 's' ? CR_SR : CR_R); });
  else {
    (coins || []).forEach(k => draw(k.x, k.y, k.c, CR_R));
    if (CR.g && CR.g.turn === ME.uid && CR.g.status === 'play') {
      const bx = CR.flip ? 100 - CR.sx : CR.sx, by = CR.flip ? 100 - CR_BASE : CR_BASE;
      c.save(); c.shadowColor = '#FFC83C'; c.shadowBlur = 4; c.beginPath(); c.arc(bx, by, CR_SR + .9, 0, 7); c.strokeStyle = 'rgba(255,200,60,.9)'; c.lineWidth = .7; c.stroke(); c.restore();
      draw(bx, by, 's', CR_SR);
      if (CR.drag) { const dx = bx - CR.drag[0], dy = by - CR.drag[1], len = Math.min(30, Math.hypot(dx, dy)), a = Math.atan2(dy, dx);
        c.strokeStyle = 'rgba(255,255,255,.95)'; c.setLineDash([1.2, 1.2]); c.lineWidth = .6; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + Math.cos(a) * len * 2.2, by + Math.sin(a) * len * 2.2); c.stroke(); c.setLineDash([]);
        c.fillStyle = 'rgba(232,48,76,' + (.25 + len / 50) + ')'; c.beginPath(); c.arc(bx, by, CR_SR + len / 9, 0, 7); c.fill(); }
    }
  }
  c.restore();
};
