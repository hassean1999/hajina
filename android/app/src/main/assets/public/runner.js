/* حجينه — لعبة الركض VS (لاعبين حقيقيين، نفس المسار) */
'use strict';
GINIT.run = () => ({ seed: Math.floor(Math.random() * 1e9), run: {} });
GT.run = { n: 'ركض VS', e: '🏃', d: 'اركض بين القطارات واجمع عملات أكثر من خصمك', duo: 1 };
const RV = { on: false, raf: 0, last: 0, W: 0, H: 0, ctx: null, frame: 0, sendT: 0 };
let RVS = null;
const RVZ = 110, RVK = 0.085;
const rvp = z => 1 / (1 + Math.max(z, -7) * RVK);
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const RV_DECO = ['#E8A87C', '#C38D9E', '#85CDCA', '#E27D60', '#F4D35E', '#9BC1BC', '#7FA7D9', '#F2B5D4'];
const rvDeco = (z, side) => ({ z, side, h: 30 + Math.random() * 70, w: 26 + Math.random() * 30, c: RV_DECO[Math.floor(Math.random() * RV_DECO.length)], awn: Math.random() < .35 });
const RV_SKY = Array.from({ length: 22 }, (_, i) => ({ x: i / 22, w: .035 + Math.random() * .04, h: .03 + Math.random() * .09 }));

function rvRender(g, prev) {
  if (g.status === 'wait') { if (!g.seed && g.by === ME.uid) GREF(WG.id).update({ seed: Math.floor(Math.random() * 1e9) }).catch(() => {}); return gWait(g); }
  const me = ME.uid, opp = other(g), runs = g.run || {};
  if (!WG.rv) rvBuild(g);
  if (g.status === 'play' && !g.startAt && amPlayer(g) && g.by === me) GREF(WG.id).update({ startAt: Date.now() + 4500 }).catch(() => {});
  if (g.startAt && !RV.started && amPlayer(g)) { RV.started = true; rvCountdown(g.startAt); }
  // HUD
  const ps = g.players || [], mine = ps.find(p => p.uid === me) || ps[0], op = ps.find(p => p.uid !== (mine && mine.uid)) || {};
  const card = (p, r, tag) => '<div class="run-card"><div class="run-card-tag">' + tag + '</div>' + avHtml(p || {}, 42) + '<div class="run-pl">' + esc((p && p.name) || '...') + '</div><div class="run-k">السكور:</div><div class="run-v">' + String(Math.floor((r && r.s) || 0)).padStart(5, '0') + '</div><div class="run-k">العملات:</div><div class="run-v">' + String((r && r.c) || 0).padStart(2, '0') + '</div><div class="run-k">مضاعف:</div><div class="run-v">x' + ((r && r.m) || 1) + '</div>' + (r && r.done ? '<div class="run-k" style="color:#FFD24A">' + (r.crash ? '💥 اصطدم' : '🏁 خلص') + '</div>' : '') + '</div>';
  WG.rv.cards.innerHTML = card(mine, amPlayer(g) && RVS ? { s: RVS.score, c: RVS.coins, m: RVS.mult, done: RVS.done, crash: RVS.crashed } : runs[mine && mine.uid], amPlayer(g) ? 'أنا' : 'لاعب ١') + card(op, runs[op.uid], 'خصم');
  if (RVS && opp && runs[opp]) RVS.ghost = runs[opp];
  // النهاية
  const both = ps.length === 2 && ps.every(p => (runs[p.uid] && runs[p.uid].done) || (p.uid === me && RVS && RVS.done));
  if (g.status === 'play' && both && amPlayer(g)) {
    GREF(WG.id).get().then(s => { const d = s.data(); if (d.status !== 'play') return; const r = d.run || {}; if (!ps.every(p => r[p.uid] && r[p.uid].done)) return;
      const a = ps[0].uid, b = ps[1].uid, sa = r[a].s, sb = r[b].s, w = sa > sb ? a : sb > sa ? b : null;
      GREF(WG.id).update({ status: 'done', winner: w }).then(() => gFinish(d, w)).catch(() => {}); });
  }
  if (g.status === 'done') { WG.rv.over.innerHTML = gDone(g, prev); WG.rv.over.hidden = false; }
  if (!amPlayer(g) && g.status === 'play') { WG.rv.hint.textContent = '👀 تشاهد السباق'; }
}
function rvBuild(g) {
  const w = WG.el; w.classList.add('rv');
  w.innerHTML = '<canvas class="rv-cv"></canvas><div class="run-hud"><div class="run-hud-left"><button class="run-sq" onclick="rvQuit()">✕</button><div class="run-sq vs">Vs</div></div><div class="run-cards"></div></div><div class="run-timer">⏱ 60</div><div class="run-hint">اسحب يمين/يسار تبدل المسار · اسحب فوك تقفز · أو المس يمين/يسار/وسط الشاشة</div><div class="rv-count"></div><div class="rv-over" hidden></div>';
  WG.rv = { cv: w.querySelector('.rv-cv'), cards: w.querySelector('.run-cards'), timer: w.querySelector('.run-timer'), hint: w.querySelector('.run-hint'), count: w.querySelector('.rv-count'), over: w.querySelector('.rv-over') };
  RV.started = false; RV.on = false;
  rvResize(); rvReset(g.seed || 1); rvDraw();
  const cv = WG.rv.cv; let sx = 0, sy = 0, down = false, fired = false;
  cv.addEventListener('pointerdown', e => { down = true; fired = false; sx = e.clientX; sy = e.clientY; });
  cv.addEventListener('pointermove', e => { if (!down || fired) return; const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 24 && Math.abs(dx) > Math.abs(dy)) { fired = true; rvMove(dx > 0 ? 1 : -1); } else if (dy < -24 && Math.abs(dy) > Math.abs(dx)) { fired = true; rvJump(); } });
  cv.addEventListener('pointerup', e => { if (!down) return; down = false; if (fired) return; const r = cv.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width; if (fx < .33) rvMove(-1); else if (fx > .67) rvMove(1); else rvJump(); });
  cv.addEventListener('pointercancel', () => { down = false; });
}
window.rvQuit = function () { if (RV.on && RVS && !RVS.done) { RVS.crashed = true; rvFinish(true); } gameClose(); };
function rvResize() { const cv = WG.rv.cv, r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.max(1, Math.round(r.width * d)); cv.height = Math.max(1, Math.round(r.height * d)); RV.W = r.width; RV.H = r.height; RV.ctx = cv.getContext('2d'); RV.ctx.setTransform(d, 0, 0, d, 0, 0); }
function rvReset(seed) {
  RVS = { t: 0, dist: 0, speed: 38, lane: 0, lx: 0, jh: 0, jv: 0, coins: 0, score: 0, mult: 1, time: 60, objs: [], deco: [], next: 40, decoAcc: 0, fx: [], id: 0, rnd: mulberry(seed), ghost: null, glx: 0, done: false };
  for (let z = -6; z < RVZ; z += 7) { RVS.deco.push(rvDeco(z, -1)); RVS.deco.push(rvDeco(z + 3.5, 1)); }
}
function rvCountdown(at) {
  const el = WG.rv.count;
  const tick = () => { if (!WG || !WG.rv) return; const left = Math.ceil((at - Date.now()) / 1000);
    if (left > 0) { el.textContent = left; el.hidden = false; sfx(600, .1, 'square', .05); setTimeout(tick, Math.min(1000, at - Date.now() - (left - 1) * 1000)); }
    else { el.textContent = 'يلا!'; setTimeout(() => el.hidden = true, 600); sfx(1000, .3, 'square', .07); RV.on = true; RV.last = performance.now(); RV.raf = requestAnimationFrame(rvLoop); } };
  tick();
}
function rvMove(d) { if (!RV.on) return; const n = Math.max(-1, Math.min(1, RVS.lane + d)); if (n !== RVS.lane) { RVS.lane = n; sfx(520, .08, 'triangle', .06); } }
function rvJump() { if (!RV.on) return; if (RVS.jh <= .001) { RVS.jv = 2.05; sfx(300, .2, 'square', .06); } }
function rvSpawn() {
  const s = RVS, R = s.rnd, lanes = [-1, 0, 1].map(l => [l, R()]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
  const nb = R() < .45 ? 2 : 1; let trains = 0, maxLen = 0;
  for (let i = 0; i < nb; i++) { let type = R() < .5 ? 'train' : 'barrier'; if (type === 'train' && nb === 2 && trains >= 1) type = 'barrier'; if (type === 'train') trains++;
    const len = type === 'train' ? 14 + R() * 8 : 0; maxLen = Math.max(maxLen, len);
    s.objs.push({ id: ++s.id, type, lane: lanes[i], z: RVZ, len, c: ['#2F7FD1', '#E5533C', '#2E9E6A'][Math.floor(R() * 3)] }); }
  const free = lanes[nb === 2 ? 2 : 1 + Math.floor(R() * 2)], n = 5 + Math.floor(R() * 3);
  for (let i = 0; i < n; i++) s.objs.push({ id: ++s.id, type: 'coin', lane: free, z: RVZ + 2 + i * 3, len: 0 });
  s.next = s.dist + maxLen + 22 + R() * 12;
}
const rvMult = c => c >= 30 ? 3 : c >= 12 ? 2 : 1;
function rvUpdate(dt) {
  const s = RVS; s.t += dt; s.time -= dt; s.speed = Math.min(72, s.speed + .55 * dt);
  const dz = s.speed * dt; s.dist += dz;
  s.objs.forEach(o => o.z -= dz); s.objs = s.objs.filter(o => o.z + o.len > -9);
  s.deco.forEach(o => o.z -= dz); s.deco = s.deco.filter(o => o.z > -8);
  s.decoAcc += dz; while (s.decoAcc >= 7) { s.decoAcc -= 7; s.deco.push(rvDeco(RVZ, -1)); s.deco.push(rvDeco(RVZ + 3.5, 1)); }
  if (s.dist >= s.next) rvSpawn();
  s.lx += (s.lane - s.lx) * Math.min(1, dt * 16);
  if (s.jh > 0 || s.jv > 0) { s.jh += s.jv * dt; s.jv -= 6.2 * dt; if (s.jh <= 0) { s.jh = 0; s.jv = 0; } }
  s.score += dz * .5 * s.mult;
  const pl = Math.round(s.lx);
  for (const o of s.objs) {
    if (o.lane !== pl) continue;
    if (o.type === 'coin' && !o.got && Math.abs(o.z) < 1.2) { o.got = 1; s.coins++; s.score += 10 * s.mult; const m = rvMult(s.coins); if (m > s.mult) { s.mult = m; sfx(880, .25, 'triangle', .1); } else sfx(1320, .08, 'sine', .08); s.fx.push({ x: rvLX(s.lx, 1), y: RV.H * .62, life: .6, txt: '+' + (10 * s.mult) }); }
    else if (o.type === 'barrier' && Math.abs(o.z) < .7 && s.jh < .1) return rvCrash();
    else if (o.type === 'train' && o.z < .6 && o.z + o.len > -.4) return rvCrash();
  }
  if (s.ghost) s.glx += ((s.ghost.l || 0) - s.glx) * Math.min(1, dt * 6);
  s.fx.forEach(f => { f.life -= dt; f.y -= 50 * dt; }); s.fx = s.fx.filter(f => f.life > 0);
  RV.sendT -= dt; if (RV.sendT <= 0) { RV.sendT = 1.2; rvSend(false); }
  if (s.time <= 0) { s.time = 0; rvFinish(false); }
}
function rvSend(done) { if (!WG) return; const s = RVS; GREF(WG.id).update({ ['run.' + ME.uid]: { s: Math.floor(s.score), c: s.coins, m: s.mult, l: s.lane, done: !!done, crash: !!s.crashed } }).catch(() => {}); }
function rvCrash() { sfx(140, .5, 'sawtooth', .2); RVS.crashed = true; WG.el.classList.remove('fx-shake'); void WG.el.offsetWidth; WG.el.classList.add('fx-shake'); rvFinish(true); }
function rvFinish(crashed) { RV.on = false; cancelAnimationFrame(RV.raf); RVS.done = true; rvDraw(); rvSend(true); WG.rv.hint.textContent = crashed ? '💥 اصطدمت! ننتظر الخصم يخلص...' : '🏁 خلص وقتك! ننتظر الخصم...'; }
function rvLoop(ts) { if (!RV.on || !WG || !WG.rv) return; RV.raf = requestAnimationFrame(rvLoop); const dt = Math.min(.05, (ts - RV.last) / 1000); RV.last = ts; RV.frame++; rvUpdate(dt); if (RV.on) { rvDraw(); if (RV.frame % 6 === 0) { WG.rv.timer.textContent = '⏱ ' + Math.ceil(RVS.time); const c = WG.rv.cards.querySelector('.run-card'); if (c) { const v = c.querySelectorAll('.run-v'); v[0].textContent = String(Math.floor(RVS.score)).padStart(5, '0'); v[1].textContent = String(RVS.coins).padStart(2, '0'); v[2].textContent = 'x' + RVS.mult; } } } }
/* رسم */
const rvHY = () => RV.H * .33, rvYP = () => RV.H * .8, rvY = p => rvHY() + (rvYP() - rvHY()) * p;
const rvRH = p => RV.W * (.03 + .36 * p), rvLX = (l, p) => RV.W / 2 + l * rvRH(p) * .64, rvLW = p => rvRH(p) * .64 * .92;
function rvRR(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function rvShade(hex, amt) { const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, v + amt)); return 'rgb(' + f(n >> 16) + ',' + f((n >> 8) & 255) + ',' + f(n & 255) + ')'; }
function rvDraw() {
  const c = RV.ctx, W = RV.W, H = RV.H; if (!c || !RVS) return; const s = RVS, hy = rvHY(), cx = W / 2, t = s.t;
  let g = c.createLinearGradient(0, 0, 0, hy); g.addColorStop(0, '#4FA8E8'); g.addColorStop(1, '#CDEBFF'); c.fillStyle = g; c.fillRect(0, 0, W, hy + 1);
  c.fillStyle = 'rgba(255,250,220,.9)'; c.beginPath(); c.arc(W * .8, hy * .32, 26, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,255,255,.85)'; [[.18, .25, 1], [.55, .15, .8], [.9, .4, .7]].forEach(([x, y, k], i) => { const xx = ((x * W - t * 6 * (i + 1)) % (W + 120) + W + 120) % (W + 120) - 60; c.beginPath(); c.ellipse(xx, y * hy, 34 * k, 12 * k, 0, 0, 7); c.ellipse(xx + 20 * k, y * hy - 8 * k, 22 * k, 13 * k, 0, 0, 7); c.fill(); });
  c.fillStyle = '#9DB6D3'; RV_SKY.forEach(b => c.fillRect(b.x * W, hy - b.h * H, b.w * W, b.h * H + 1));
  g = c.createLinearGradient(0, hy, 0, H); g.addColorStop(0, '#A9B4C2'); g.addColorStop(1, '#6D7A8C'); c.fillStyle = g; c.fillRect(0, hy, W, H - hy);
  const pBot = (H - hy) / (rvYP() - hy), pFar = rvp(RVZ);
  s.deco.slice().sort((a, b) => b.z - a.z).forEach(d => { const p = rvp(d.z), y = rvY(p), U = W / 180, bw = d.w * p * U, bh = d.h * p * U, edge = rvRH(p) * 1.06 + 4 * p * U, x = cx + d.side * (edge + bw / 2) - bw / 2;
    c.fillStyle = d.c; c.fillRect(x, y - bh, bw, bh); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(d.side < 0 ? x + bw * .82 : x, y - bh, bw * .18, bh);
    if (p > .18) { c.fillStyle = 'rgba(255,255,255,.55)'; const ww = bw * .16, wh = bh * .09; for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) c.fillRect(x + bw * .14 + k * bw * .28, y - bh + bh * .1 + r * bh * .2, ww, wh); }
    if (d.awn && p > .25) { c.fillStyle = '#E53935'; c.fillRect(x, y - bh * .32, bw, bh * .05); c.fillStyle = '#fff'; for (let k = 0; k < 5; k += 2) c.fillRect(x + k * bw / 5, y - bh * .32, bw / 5, bh * .05); } });
  c.fillStyle = '#8C7663'; c.beginPath(); c.moveTo(cx - rvRH(pFar), hy); c.lineTo(cx + rvRH(pFar), hy); c.lineTo(cx + rvRH(pBot), H); c.lineTo(cx - rvRH(pBot), H); c.fill();
  c.fillStyle = 'rgba(200,60,50,.55)'; c.beginPath(); c.moveTo(rvLX(-.42, pFar), hy); c.lineTo(rvLX(.42, pFar), hy); c.lineTo(rvLX(.42, pBot), H); c.lineTo(rvLX(-.42, pBot), H); c.fill();
  const off = s.dist % 2.6;
  for (let i = 0; i < 46; i++) { const z = i * 2.6 - off - 6; if (z > RVZ) break; const p = rvp(z), y = rvY(p), th = Math.max(1, 6 * p); c.fillStyle = 'rgba(70,50,35,' + (.35 + .45 * Math.min(1, p)) + ')'; for (let l = -1; l <= 1; l++) { const lw = rvLW(p) * .95; c.fillRect(rvLX(l, p) - lw / 2, y - th / 2, lw, th); } }
  c.strokeStyle = '#E8EDF4'; for (let l = -1; l <= 1; l++) for (const sd of [-.33, .33]) { c.beginPath(); c.moveTo(rvLX(l + sd, pFar), hy); c.lineTo(rvLX(l + sd, pBot), H); c.lineWidth = 2.4; c.stroke(); }
  const objs = s.objs.filter(o => !(o.type === 'coin' && o.got)).sort((a, b) => b.z - a.z);
  const set = (mn, mx) => objs.forEach(o => { if (o.z >= mn && o.z < mx) rvObj(c, o, t); });
  set(2.2, 999);
  if (s.ghost && !s.ghost.crash) rvGuy(c, rvLX(s.glx, rvp(2)), rvY(rvp(2)), H * .17 * rvp(2), 0, t, { hood: '#43A35A', accent: '#2C7A3F', pants: '#6B5A3A', cap: '#1E8F4E', goggles: 1, pack: '#8A5A2B' }, .85);
  set(.3, 2.2);
  rvGuy(c, rvLX(s.lx, 1), rvYP(), H * .17, s.jh, t, { hood: '#F4F1EA', accent: '#FF8A00', pants: '#3D5A99', cap: '#E53935', pack: '#2E3A55' }, 1);
  set(-99, .3);
  s.fx.forEach(f => { c.globalAlpha = Math.min(1, f.life * 2); c.fillStyle = '#FFD24A'; c.font = '900 18px Cairo,sans-serif'; c.textAlign = 'center'; c.lineWidth = 4; c.strokeStyle = '#6B3A0E'; c.strokeText(f.txt, f.x, f.y); c.fillText(f.txt, f.x, f.y); c.globalAlpha = 1; });
}
function rvObj(c, o, t) {
  if (o.type === 'coin') { const p = rvp(o.z), x = rvLX(o.lane, p), y = rvY(p) - rvLW(p) * .42, r = rvLW(p) * .17, sx = Math.max(.15, Math.abs(Math.cos(t * 5 + o.id)));
    const g = c.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, '#FFF3A8'); g.addColorStop(.6, '#FFC93C'); g.addColorStop(1, '#C9870E');
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r * sx, r, 0, 0, 7); c.fill(); c.strokeStyle = '#B87400'; c.lineWidth = Math.max(1, r * .12); c.stroke();
    if (r > 6 && sx > .5) { c.fillStyle = '#E0A010'; c.font = '900 ' + Math.round(r * 1.1) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('★', x, y + 1); c.textBaseline = 'alphabetic'; } return; }
  if (o.type === 'barrier') { const p = rvp(o.z), x = rvLX(o.lane, p), y = rvY(p), w = rvLW(p) * .95, h = w * .42, bh = h * .38;
    c.fillStyle = '#555'; c.fillRect(x - w * .42, y - h, w * .06, h); c.fillRect(x + w * .36, y - h, w * .06, h);
    for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#fff' : '#E53935'; c.fillRect(x - w / 2 + i * w / 6, y - h, w / 6 + .5, bh); } return; }
  const zf = Math.max(o.z, -1.5), pf = rvp(zf), pb = rvp(o.z + o.len), xf = rvLX(o.lane, pf), yf = rvY(pf), wf = rvLW(pf) * .98, hf = wf * 1.3, xb = rvLX(o.lane, pb), yb = rvY(pb), wb = rvLW(pb) * .98, hb = wb * 1.3;
  c.fillStyle = rvShade(o.c, -30);
  if (o.lane !== 0) { const sd = o.lane < 0 ? 1 : -1; c.beginPath(); c.moveTo(xf + sd * wf / 2, yf); c.lineTo(xf + sd * wf / 2, yf - hf); c.lineTo(xb + sd * wb / 2, yb - hb); c.lineTo(xb + sd * wb / 2, yb); c.fill(); }
  c.fillStyle = rvShade(o.c, 35); c.beginPath(); c.moveTo(xf - wf / 2, yf - hf); c.lineTo(xf + wf / 2, yf - hf); c.lineTo(xb + wb / 2, yb - hb); c.lineTo(xb - wb / 2, yb - hb); c.fill();
  if (o.z < -1.4) return;
  rvRR(c, xf - wf / 2, yf - hf, wf, hf, wf * .12); c.fillStyle = o.c; c.fill();
  c.fillStyle = '#FFD24A'; c.fillRect(xf - wf / 2, yf - hf * .42, wf, hf * .07);
  rvRR(c, xf - wf * .38, yf - hf * .9, wf * .76, hf * .36, wf * .06); c.fillStyle = '#BFE3FF'; c.fill();
  c.fillStyle = '#FFF7C2'; [-.28, .28].forEach(k => { c.beginPath(); c.arc(xf + k * wf, yf - hf * .2, wf * .07, 0, 7); c.fill(); });
  c.fillStyle = '#333'; c.fillRect(xf - wf * .45, yf - hf * .07, wf * .9, hf * .07);
}
function rvGuy(c, x, yG, h, jh, t, col, alpha) {
  c.save(); c.globalAlpha = alpha;
  const lift = jh * RV.H * .32 * (h / (RV.H * .17)), yF = yG - lift;
  c.fillStyle = 'rgba(0,0,0,' + (.28 * (1 - Math.min(.8, jh * 2))) + ')'; c.beginPath(); c.ellipse(x, yG, h * .22, h * .05, 0, 0, 7); c.fill();
  const ph = jh > 0 ? .7 : Math.sin(t * 15), legL = h * .32, legW = h * .11, hip = yF - legL;
  [-1, 1].forEach(sd => { const up = Math.max(0, sd * ph) * h * .08, lx = x + sd * h * .075 - legW / 2; rvRR(c, lx, hip, legW, legL - up, legW * .4); c.fillStyle = col.pants; c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.ellipse(lx + legW / 2, yF - up - h * .015, legW * .7, h * .035, 0, 0, 7); c.fill(); });
  const bw = h * .42, bh = h * .36, bt = hip - bh + h * .05;
  [-1, 1].forEach(sd => { const sw = -sd * ph * .5; c.save(); c.translate(x + sd * bw * .5, bt + h * .05); c.rotate(sw * .5 + sd * .15); rvRR(c, -h * .045, 0, h * .09, h * .26, h * .045); c.fillStyle = rvShade(col.hood, -25); c.fill(); c.fillStyle = '#F2C29B'; c.beginPath(); c.arc(0, h * .27, h * .04, 0, 7); c.fill(); c.restore(); });
  rvRR(c, x - bw / 2, bt, bw, bh, bw * .22); c.fillStyle = col.hood; c.fill();
  c.fillStyle = col.accent; c.fillRect(x - bw / 2, bt + bh * .72, bw, bh * .1);
  rvRR(c, x - bw * .3, bt + bh * .12, bw * .6, bh * .5, bw * .08); c.fillStyle = col.pack; c.fill();
  c.fillStyle = 'rgba(255,255,255,.75)'; c.font = '900 ' + Math.max(6, Math.round(h * .07)) + 'px Cairo,sans-serif'; c.textAlign = 'center'; c.fillText('حجينه', x, bt + bh * .42);
  const hr = h * .13, hcy = bt - hr * .75;
  c.fillStyle = '#4A2E1A'; c.beginPath(); c.arc(x, hcy, hr, 0, 7); c.fill();
  c.fillStyle = col.cap; c.beginPath(); c.arc(x, hcy - hr * .05, hr * 1.04, Math.PI, 0); c.fill();
  c.fillStyle = rvShade(col.cap, -40); c.beginPath(); c.ellipse(x, hcy - hr * .02, hr * .75, hr * .18, 0, 0, 7); c.fill();
  if (col.goggles) { c.fillStyle = '#FFC93C'; [-1, 1].forEach(sd => { c.beginPath(); c.arc(x + sd * hr * .42, hcy - hr * .62, hr * .26, 0, 7); c.fill(); }); }
  c.restore();
}
const _gRT = window.gRenderType;
window.gRenderType = function (g, prev) { if (g.type === 'run') return rvRender(g, prev); if (g.type === 'ludo' && window.ludoRender) return ludoRender(g, prev); if (g.type === 'carrom' && window.carromRender) return carromRender(g, prev); return _gRT(g, prev); };
const _gClose = window.gameClose;
window.gameClose = function (silent) { RV.on = false; cancelAnimationFrame(RV.raf); RVS = null; if (window.crStop) crStop(); _gClose(silent); };
