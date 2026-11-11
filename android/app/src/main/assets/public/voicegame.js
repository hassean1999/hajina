/* حجينه — اللعبة الصوتية (تخمين الصوت) */
'use strict';

/* ═══════════════════════════════════════════════
   فتح اللعبة — الكاتب يسجل صوته
   ═══════════════════════════════════════════════ */
async function openVoiceGame() {
  if (!R || !R.id) return toast('لازم تكون بالروم');

  /* قائمة الأعضاء بالمقاعد + المتفرجين */
  const members = Object.values(R.members || {}).filter(m => m.uid !== ME.uid);
  if (members.length < 2) return toast('محتاج أكثر من شخصين بالروم');

  /* اختيار الشخص المُخمَّن (عشوائي) */
  const target = members[Math.floor(Math.random() * members.length)];

  const m = modal(
    '<div class="vg-wrap">' +
      '<h3>🎙️ لعبة الصوت</h3>' +
      '<p style="color:var(--fg2);font-size:13px">سجّل صوتك وخلي الأعضاء يخمنون مين صوتك!</p>' +
      '<div class="vg-rec-area" id="vgRecArea">' +
        '<div class="vg-mic" id="vgMicBtn">🎙️</div>' +
        '<div class="vg-rec-hint" id="vgHint">اضغط للتسجيل</div>' +
      '</div>' +
      '<div id="vgAudioWrap" hidden>' +
        '<audio id="vgAudio" controls style="width:100%;margin-top:8px"></audio>' +
        '<button class="btn" id="vgSend" style="margin-top:10px;width:100%">إرسال للأعضاء 🎯</button>' +
      '</div>' +
    '</div>'
  );

  let mediaRecorder = null, chunks = [], recording = false;
  let audioBlob = null, audioUrl = null;

  const micBtn  = m.querySelector('#vgMicBtn');
  const hint    = m.querySelector('#vgHint');
  const awrap   = m.querySelector('#vgAudioWrap');
  const audioEl = m.querySelector('#vgAudio');

  micBtn.onclick = async () => {
    if (recording) {
      /* إيقاف */
      mediaRecorder.stop();
      recording = false;
      micBtn.textContent = '🎙️';
      hint.textContent = 'جاري المعالجة...';
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      chunks = [];
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        audioBlob = new Blob(chunks, { type: 'audio/webm' });
        audioUrl  = URL.createObjectURL(audioBlob);
        audioEl.src = audioUrl;
        awrap.hidden = false;
        hint.textContent = 'استمع أو أعد التسجيل';
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      recording = true;
      micBtn.textContent = '⏹️';
      hint.textContent = 'جاري التسجيل... اضغط للإيقاف';
    } catch (err) {
      toast('تعذّر الوصول للميكروفون: ' + err.message);
    }
  };

  m.querySelector('#vgSend').onclick = async () => {
    if (!audioBlob) return;
    m.querySelector('#vgSend').disabled = true;
    toast('⏳ جاري الإرسال...');
    try {
      /* رفع الصوت على Storage */
      const ref = getStorage().ref('voicegame/' + R.id + '/' + Date.now() + '.webm');
      await ref.put(audioBlob);
      const url = await ref.getDownloadURL();
      /* أرسل رسالة للروم */
      await roomRef().collection('messages').add({
        type: 'game', game: 'voice',
        phase: 'clip',
        host: ME.uid, hostName: ME.name,
        audioUrl: url,
        members: members.slice(0, 20).map(x => ({ uid: x.uid, name: x.name })),
        ts: FV.serverTimestamp()
      });
      toast('✓ تم الإرسال! الأعضاء يخمنون الآن');
      m.close();
    } catch (err) {
      toast('فشل الإرسال: ' + err.message);
      m.querySelector('#vgSend').disabled = false;
    }
  };
}
window.openVoiceGame = openVoiceGame;

/* ═══════════════════════════════════════════════
   واجهة المُخمِّن
   ═══════════════════════════════════════════════ */
let _vgModal = null;
function openVoiceGuesser(msg) {
  if (_vgModal) return;
  if (msg.host === ME.uid) return; /* الكاتب لا يخمن */

  const memberBtns = (msg.members || []).map(mm =>
    '<button class="btn btn-s vg-opt" data-uid="' + esc(mm.uid) + '">' + esc(mm.name) + '</button>'
  ).join('');

  const modal2 = modal(
    '<div class="vg-wrap">' +
      '<h3>🎙️ خمّن الصوت!</h3>' +
      '<p style="color:var(--fg2);font-size:12.5px">مين يتكلم؟</p>' +
      '<audio id="vgA2" controls src="' + esc(msg.audioUrl) + '" style="width:100%;margin-bottom:12px"></audio>' +
      '<div class="vg-opts">' + memberBtns + '</div>' +
    '</div>'
  );
  _vgModal = modal2;

  modal2.querySelectorAll('.vg-opt').forEach(btn => {
    btn.onclick = async () => {
      const guess = btn.dataset.uid;
      btn.disabled = true;
      await roomRef().collection('messages').add({
        type: 'game', game: 'voice',
        phase: 'guess',
        guesser: ME.uid, guesserName: ME.name,
        guess, host: msg.host,
        ts: FV.serverTimestamp()
      }).catch(e => toast(errMsg(e)));
      toast('✓ تم إرسال تخمينك');
      modal2.close(); _vgModal = null;
    };
  });

  modal2.addEventListener('close', () => { _vgModal = null; });
}

/* ── hook ── */
const _ormVoice = window.onRoomMsg;
window.onRoomMsg = function(msg) {
  if (msg.type === 'game' && msg.game === 'voice') {
    if (msg.phase === 'clip')   openVoiceGuesser(msg);
    if (msg.phase === 'reveal') {
      toast('🎙️ الصوت كان: ' + (msg.revealName || ''));
      if (_vgModal) { _vgModal.close(); _vgModal = null; }
    }
  }
  if (_ormVoice) _ormVoice.call(this, msg);
};
