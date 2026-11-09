/* حجينه — لعبة تخمين الكلمات داخل الروم */
'use strict';

const WG_WORDS = [
  'تلفاز','سيارة','كتاب','مطبخ','طيارة','جسر','بحر','جبل','نجمة','قمر',
  'شمس','مدرسة','مستشفى','حديقة','مسجد','سوق','فندق','مطعم','ملعب','مكتبة',
  'برتقالة','فراولة','عنب','تفاحة','موز','رمان','خوخ','إجاصة','بطيخ','مانجو',
  'أسد','ببر','فيل','زرافة','قرد','تمساح','ثعبان','أرنب','بقرة','حصان',
  'طبيب','معلم','مهندس','طيار','شرطي','نجار','خياط','بناء','فلاح','طباخ',
  'حاسوب','هاتف','تلفون','مروحة','ثلاجة','غسالة','مكيف','مصباح','باب','نافذة',
  'عراق','بغداد','البصرة','الموصل','كركوك','أربيل','الحلة','كربلاء','النجف','ديالى',
];

/* ═══════════════════════════════════════════════
   فتح اللعبة (المُخمِّن الأول هو الكاتب)
   ═══════════════════════════════════════════════ */
function openWordGame() {
  if (!R || !R.id) return toast('لازم تكون بالروم');
  const word = WG_WORDS[Math.floor(Math.random() * WG_WORDS.length)];
  const hidden = Array.from(word).map((c, i) => i === 0 ? c : (i === word.length - 1 ? c : '_')).join(' ');

  /* أرسل بداية اللعبة للجميع */
  roomRef().collection('messages').add({
    type: 'game', game: 'word',
    phase: 'start',
    host: ME.uid, hostName: ME.name,
    hidden,
    wordLen: word.length,
    ts: FV.serverTimestamp()
  }).catch(e => toast(errMsg(e)));

  /* واجهة الكاتب */
  const m = modal(
    '<div class="wg-wrap">' +
      '<h3>🔤 لعبة الكلمات</h3>' +
      '<p style="color:var(--fg2);font-size:13px">الكلمة الخفية هي:</p>' +
      '<div class="wg-secret">' + esc(word) + '</div>' +
      '<p style="color:var(--fg2);font-size:12px">الأعضاء يخمنون، أعطهم تلميحات بالمايك</p>' +
      '<div class="wg-guesses" id="wgG"></div>' +
      '<div class="wg-row">' +
        '<button class="btn" id="wgReveal">كشف الكلمة 🎉</button>' +
      '</div>' +
    '</div>'
  );

  /* استقبال التخمينات */
  const unsub = roomRef().collection('messages')
    .where('type', '==', 'game').where('game', '==', 'word')
    .where('phase', '==', 'guess')
    .orderBy('ts', 'asc').limit(50)
    .onSnapshot(snap => {
      const el = m.querySelector('#wgG');
      if (!el) return;
      snap.docChanges().forEach(ch => {
        if (ch.type !== 'added') return;
        const d = ch.doc.data();
        const div = document.createElement('div');
        div.className = 'wg-guess' + (d.guess === word ? ' correct' : '');
        div.textContent = esc(d.guesserName) + ': ' + esc(d.guess);
        el.appendChild(div);
        el.scrollTop = el.scrollHeight;
        if (d.guess === word) {
          toast('🎉 ' + (d.guesserName || '؟') + ' خمّن الكلمة!');
        }
      });
    });

  /* كشف الكلمة */
  m.querySelector('#wgReveal').onclick = () => {
    roomRef().collection('messages').add({
      type: 'game', game: 'word',
      phase: 'reveal', word,
      ts: FV.serverTimestamp()
    }).catch(e => toast(errMsg(e)));
    unsub();
    m.close();
  };
  m.addEventListener('close', () => unsub());
}
window.openWordGame = openWordGame;

/* ═══════════════════════════════════════════════
   واجهة المُخمِّن (تظهر لبقية الروم)
   ═══════════════════════════════════════════════ */
let _wgGuesserModal = null;
function openWordGuesser(m) {
  if (_wgGuesserModal) return; /* مفتوح مسبقاً */
  const modal2 = modal(
    '<div class="wg-wrap">' +
      '<h3>🔤 خمّن الكلمة!</h3>' +
      '<p style="color:var(--fg2);font-size:12.5px">الكاتب: <b>' + esc(m.hostName || '') + '</b></p>' +
      '<div class="wg-hidden" id="wgHidden">' + esc(m.hidden || '') + '</div>' +
      '<div class="wg-row">' +
        '<input class="inp wg-inp" id="wgInp" placeholder="اكتب تخمينك..." maxlength="30">' +
        '<button class="btn" id="wgSend">إرسال</button>' +
      '</div>' +
      '<div class="wg-guesses" id="wgG2"></div>' +
    '</div>'
  );
  _wgGuesserModal = modal2;

  const send = async () => {
    const inp = modal2.querySelector('#wgInp');
    const guess = (inp.value || '').trim();
    if (!guess) return;
    inp.value = '';
    await roomRef().collection('messages').add({
      type: 'game', game: 'word',
      phase: 'guess', guess,
      guesser: ME.uid, guesserName: ME.name,
      ts: FV.serverTimestamp()
    }).catch(e => toast(errMsg(e)));
  };
  modal2.querySelector('#wgSend').onclick = send;
  modal2.querySelector('#wgInp').onkeydown = e => { if (e.key === 'Enter') send(); };

  /* استقبال تخمينات الآخرين */
  const unsub = roomRef().collection('messages')
    .where('type','==','game').where('game','==','word').where('phase','==','guess')
    .orderBy('ts','asc').limit(50)
    .onSnapshot(snap => {
      const el = modal2.querySelector('#wgG2');
      if (!el) return;
      snap.docChanges().forEach(ch => {
        if (ch.type !== 'added') return;
        const d = ch.doc.data();
        const div = document.createElement('div');
        div.className = 'wg-guess';
        div.textContent = esc(d.guesserName) + ': ' + esc(d.guess);
        el.appendChild(div);
        el.scrollTop = el.scrollHeight;
      });
    });

  modal2.addEventListener('close', () => { unsub(); _wgGuesserModal = null; });
}

/* ── hook على onRoomMsg ── */
const _ormWord = window.onRoomMsg;
window.onRoomMsg = function(msg) {
  if (msg.type === 'game' && msg.game === 'word') {
    if (msg.phase === 'start' && msg.host !== ME.uid) {
      openWordGuesser(msg);
    } else if (msg.phase === 'reveal') {
      toast('🔤 الكلمة كانت: ' + (msg.word || ''));
      if (_wgGuesserModal) { _wgGuesserModal.close(); _wgGuesserModal = null; }
    }
  }
  if (_ormWord) _ormWord.call(this, msg);
};
