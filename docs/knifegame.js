/* حجينه — لعبة رمي السكاكين */
'use strict';

/* ═══════════════════════════════════════════════
   فتح تحدي السكين
   ═══════════════════════════════════════════════ */
function openKnifeGame(opponentUid) {
  if (!R || !R.id) return toast('لازم تكون بالروم');
  if (!opponentUid || opponentUid === ME.uid) return toast('اختر خصم أول');

  /* إرسال دعوة عبر رسالة روم */
  roomRef().collection('messages').add({
    type: 'game',
    game: 'knife',
    from: ME.uid, fromName: ME.name,
    to: opponentUid,
    ts: FV.serverTimestamp()
  }).then(() => toast('✓ تم إرسال التحدي')).catch(e => toast(errMsg(e)));
}
window.openKnifeGame = openKnifeGame;

/* استقبال دعوة السكين */
window.knifeInvite = function(m) {
  if (m.to !== ME.uid) return;
  const accept = confirm((m.fromName || 'شخص') + ' يتحداك بلعبة رمي السكاكين! تقبل؟');
  if (accept) startKnifeMatch(m.from, m.fromName);
};

/* ═══════════════════════════════════════════════
   المباراة — canvas
   ═══════════════════════════════════════════════ */
function startKnifeMatch(opUid, opName) {
  const STAGES = 5, KNIVES_PER = 5;
  let stage = 1, myScore = 0, opScore = 0;
  let throwing = false, anim = null;
  let knives = [];   /* السكاكين المغروزة */
  let flying = null; /* السكين الطائرة */

  /* log السكاكين الجاهزة */
  let myKnives = KNIVES_PER, opKnives = KNIVES_PER;

  const W = Math.min(360, window.innerWidth - 32);
  const H = 420;
  const CX = W / 2, CY = H / 2;

  const html =
    '<div class="kg-wrap">' +
      '<div class="kg-scores">' +
        '<div class="kg-player me"><span id="kgMyN">' + esc(ME.name || 'أنا') + '</span><span id="kgMyS">0</span></div>' +
        '<div class="kg-stage" id="kgStage">مرحلة 1/' + STAGES + '</div>' +
        '<div class="kg-player op"><span id="kgOpN">' + esc(opName || 'الخصم') + '</span><span id="kgOpS">0</span></div>' +
      '</div>' +
      '<canvas id="kgCvs" width="' + W + '" height="' + H + '"></canvas>' +
      '<div class="kg-bar">' +
        '<div class="kg-knives" id="kgKnives"></div>' +
        '<button class="btn" id="kgThrow">🗡️ ارمي</button>' +
      '</div>' +
    '</div>';

  const m = modal(html);
  const cvs = m.querySelector('#kgCvs');
  const ctx = cvs.getContext('2d');
  let logEl = m.querySelector('#kgKnives');
  let ang  = 0;      /* زاوية دوران الهدف */
  let dang = 0.025;  /* سرعة الدوران */

  /* ── الهدف الدائري ── */
  const TARGET_R = 65;
  const RING_COLS = ['#C0392B','#C0392B','#E67E22','#E67E22','#F1C40F','#F1C40F','#2ECC71','#2ECC71','#3498DB','#3498DB'];

  function drawTarget() {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(ang);
    for (let i = RING_COLS.length - 1; i >= 0; i--) {
      ctx.beginPath();
      ctx.arc(0, 0, TARGET_R * (i + 1) / RING_COLS.length, 0, Math.PI * 2);
      ctx.fillStyle = RING_COLS[i];
      ctx.fill();
    }
    /* مسمار المركز */
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
  }

  /* ── رسم سكين غروزة ── */
  function drawKnife(x, y, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    /* مقبض */
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-3, 2, 6, 14);
    /* نصل */
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(-3, 2);
    ctx.lineTo(3, 2);
    ctx.closePath();
    ctx.fillStyle = '#D0D0D0';
    ctx.fill();
    ctx.restore();
  }

  /* ── رسم كل شيء ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    /* خلفية */
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#141432';
    ctx.fillRect(0, 0, W, H);
    /* خط رمي */
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(CX, H - 30); ctx.lineTo(CX, CY + TARGET_R + 10); ctx.stroke();
    ctx.setLineDash([]);

    drawTarget();
    /* السكاكين المغروزة */
    knives.forEach(k => {
      const kx = CX + Math.cos(k.a - Math.PI/2) * TARGET_R;
      const ky = CY + Math.sin(k.a - Math.PI/2) * TARGET_R;
      drawKnife(kx, ky, k.a);
    });
    /* السكين الطائرة */
    if (flying) {
      const prog = flying.prog;
      const ky   = H - 30 - (H - 30 - (CY + TARGET_R + 10)) * prog;
      drawKnife(CX, ky, Math.PI * 2 * prog * 2);
    }
  }

  /* ── حلقة اللعبة ── */
  function loop() {
    ang += dang + stage * 0.005;
    if (flying) {
      flying.prog += 0.06;
      if (flying.prog >= 1) {
        /* وصل! تحقق من الاصطدام */
        const landAng = ang; /* زاوية الهدف لحظة الوصول */
        let hit = true;
        for (const k of knives) {
          if (Math.abs(k.a - landAng) % (Math.PI * 2) < 0.18) { hit = false; break; }
        }
        if (hit) {
          knives.push({ a: landAng });
          myScore++; myKnives--;
          m.querySelector('#kgMyS').textContent = myScore;
          toast('✓ أصبت!');
        } else {
          toast('💥 اصطدمت بسكين!');
        }
        flying = null;
        updateKnivesUI();
        if (myKnives === 0) nextStage();
      }
    }
    draw();
    anim = requestAnimationFrame(loop);
  }

  function updateKnivesUI() {
    logEl.innerHTML = Array.from({ length: KNIVES_PER }, (_, i) => '<span class="kg-k' + (i < myKnives ? '' : ' used') + '">🗡️</span>').join('');
    m.querySelector('#kgThrow').disabled = throwing || myKnives === 0;
  }

  function nextStage() {
    stage++;
    if (stage > STAGES) { endGame(); return; }
    knives = [];
    myKnives = KNIVES_PER + Math.floor(stage / 2);
    dang = 0.025 + stage * 0.01;
    m.querySelector('#kgStage').textContent = 'مرحلة ' + stage + '/' + STAGES;
    updateKnivesUI();
    toast('🎯 مرحلة ' + stage);
  }

  function endGame() {
    cancelAnimationFrame(anim);
    const won = myScore > opScore;
    setTimeout(() => {
      m.close();
      modal(
        '<div style="text-align:center;padding:16px 8px 24px">' +
          '<div style="font-size:48px;margin-bottom:8px">' + (won ? '🏆' : '😢') + '</div>' +
          '<b style="font-size:20px">' + (won ? 'فزت!' : 'خسرت!') + '</b>' +
          '<p style="color:var(--fg2);margin-top:8px">نقاطك: ' + myScore + '</p>' +
        '</div>'
      );
      /* تسجيل الفوز */
      if (won && R && R.id) {
        db.collection('rooms').doc(R.id).collection('club').doc(ME.uid)
          .update({ pts: FV.increment(50) }).catch(() => {});
      }
    }, 400);
  }

  /* ── إطلاق السكين ── */
  m.querySelector('#kgThrow').onclick = () => {
    if (throwing || flying || myKnives === 0) return;
    throwing = true;
    flying = { prog: 0 };
    setTimeout(() => { throwing = false; }, 400);
  };

  updateKnivesUI();
  loop();
  m.addEventListener('close', () => cancelAnimationFrame(anim));
}

/* ── hook على onRoomMsg لاستقبال دعوة السكين ── */
const _ormKnife = window.onRoomMsg;
window.onRoomMsg = function(m) {
  if (m.type === 'game' && m.game === 'knife') { window.knifeInvite(m); }
  if (_ormKnife) _ormKnife.call(this, m);
};
