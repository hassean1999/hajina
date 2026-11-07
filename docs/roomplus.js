/* حجينه — ترتيب داعمين الروم، ومشغل الأغاني بالروم */
'use strict';
/* ---------- داعمين الروم ---------- */
function roomSups() { return Object.entries((R.data && R.data.sup) || {}).map(([uid, x]) => ({ uid, name: x.n, color: x.c, vip: x.vip || 0, pv: x.pv || 0, v: x.v || 0 })).filter(x => x.v > 0).sort((a, b) => b.v - a.v); }
function renderSupStrip() {
  let el = $('rmSup');
  if (!el) { el = document.createElement('div'); el.id = 'rmSup'; el.className = 'rm-sup'; el.onclick = openRoomRank; const c = $('rmCnt'); c.parentNode.insertBefore(el, c); }
  const top = roomSups().slice(0, 3);
  el.innerHTML = '<span class="cup">🏆</span>' + (top.length ? top.map((u, i) => '<span class="sa s' + i + '">' + avHtml(u, 24) + '</span>').join('') : '<small>الداعمين</small>');
}
window.openRoomRank = function () {
  const list = roomSups(), medal = ['🥇', '🥈', '🥉'];
  const m = modal('<h3>🏆 داعمين الروم</h3><p style="text-align:center;font-size:12px;color:var(--fg2);margin:-4px 0 8px">ترتيب أكثر الناس اللي دعموا بهذا الروم</p>' +
    (list.length ? '<div class="rr-pod">' + [1, 0, 2].map(i => list[i] ? '<div class="p' + i + '" data-u="' + esc(list[i].uid) + '"><span class="md">' + medal[i] + '</span>' + avHtml(list[i], i ? 52 : 66) + '<b>' + nameHtml(list[i], true) + '</b><small>💗 ' + fmtK(list[i].v) + '</small></div>' : '<div></div>').join('') + '</div>' +
      list.slice(3, 50).map((u, i) => '<div class="ci" data-u="' + esc(u.uid) + '" style="cursor:pointer"><b class="pp-rk">' + toAr(i + 4) + '</b>' + avHtml(u, 40) + '<div class="ci-m"><div class="ci-n">' + nameHtml(u) + '</div></div><b style="color:var(--gold,#FFD24A)">💗 ' + fmtK(u.v) + '</b></div>').join('')
      : '<div class="empty"><div class="e">🎁</div><b>بعد ماكو داعمين</b><span>أول واحد يدز هدية يصير الأول</span></div>') +
    '<button class="btn btn-p" id="rrG">🎁 ادعم هسه</button>');
  m.addEventListener('click', e => { const r = e.target.closest('[data-u]'); if (r) { m.close(); userCard(r.dataset.u); } });
  m.querySelector('#rrG').onclick = () => { m.close(); openGifts(); };
};
const _renderRoom = window.renderRoom;
window.renderRoom = function () { _renderRoom.apply(this, arguments); try { renderSupStrip(); } catch (e) {} };

/* ---------- مشغل الأغاني ---------- */
let MUS = null; // {track, name, file}
function musStop() { if (!MUS) return; try { if (R.client) R.client.unpublish(MUS.track).catch(() => {}); MUS.track.stopProcessAudioBuffer(); MUS.track.close(); } catch (e) {} MUS = null; updMusBtn(); }
function updMusBtn() { const b = $('rbMus'); if (!b) return; b.hidden = !R.id || R.mySeat === -1; b.classList.toggle('playing', !!MUS); }
window.openMusic = function () {
  if (R.mySeat === -1) return toast('اصعد عالمايك حتى تشغل أغاني');
  if (!R.client || !window.AgoraRTC) return toast('الصوت مو متصل');
  const m = modal('<h3>🎵 شغّل أغنية بالروم</h3>' +
    (MUS ? '<div class="mus-now"><div class="disc">💿</div><div><b>' + esc(MUS.name) + '</b><small>' + (MUS.paused ? 'متوقفة' : 'تشتغل هسه، كل الروم يسمعها') + '</small></div></div>' +
      '<div class="row2"><button class="btn btn-s" id="msP">' + (MUS.paused ? '▶️ كمّل' : '⏸ وكّف') + '</button><button class="btn btn-s" id="msS" style="color:var(--danger)">⏹ طفّي</button></div>' +
      '<label class="l">🔊 صوت الأغنية</label><input type="range" id="msV" min="0" max="100" value="' + MUS.vol + '" style="width:100%">' : '<p style="text-align:center;color:var(--fg2);font-size:13px;line-height:1.8">اختار أغنية من تلفونك، وكل اللي بالروم راح يسمعوها وية صوتك.</p>') +
    '<label class="btn btn-p" style="display:block;text-align:center">📂 اختار أغنية' + (MUS ? ' ثانية' : '') + '<input type="file" id="msF" accept="audio/*" hidden></label>' +
    '<label class="li" style="margin-top:8px"><span class="ic">🔁</span>تكرار الأغنية<input type="checkbox" class="tg" id="msL"' + (MUS && MUS.loop ? ' checked' : '') + '></label>');
  const q = s => m.querySelector(s);
  if (MUS) {
    q('#msP').onclick = () => { if (MUS.paused) MUS.track.resumeProcessAudioBuffer(); else MUS.track.pauseProcessAudioBuffer(); MUS.paused = !MUS.paused; m.close(); };
    q('#msS').onclick = () => { musStop(); m.close(); toast('طفّيت الأغنية'); };
    q('#msV').oninput = e => { MUS.vol = +e.target.value; MUS.track.setVolume(MUS.vol); };
  }
  q('#msL').onchange = e => { if (MUS) { MUS.loop = e.target.checked; } };
  q('#msF').onchange = async e => {
    const f = e.target.files[0]; if (!f) return; m.close();
    if (f.size > 40 * 1024 * 1024) return toast('الملف كلش كبير');
    toast('⏳ دا نجهز الأغنية...');
    try {
      const loop = q('#msL').checked; musStop();
      const track = await AgoraRTC.createBufferSourceAudioTrack({ source: f });
      track.startProcessAudioBuffer({ loop }); track.play(); track.setVolume(60);
      if (R.client.connectionState === 'CONNECTED') { if (!R.localTrack) await R.client.setClientRole('host'); await R.client.publish(track); }
      MUS = { track, name: f.name.replace(/\.[^.]+$/, ''), vol: 60, loop, paused: false };
      track.on && track.on('source-state-change', st => { if (st === 'stopped' && MUS && MUS.track === track && !MUS.loop) musStop(); });
      updMusBtn(); toast('🎵 تشتغل: ' + MUS.name);
      roomRef().collection('messages').add(Object.assign({ type: 'msg', text: '🎵 شغّل أغنية: ' + MUS.name, ts: FV.serverTimestamp() }, meLite())).catch(() => {});
    } catch (er) { console.error(er); toast('ما كدرت أشغل هذا الملف، جرب mp3'); }
  };
};
const _stopPublish = window.stopPublish;
window.stopPublish = async function () { musStop(); return _stopPublish.apply(this, arguments); };
const _leaveRoom = window.leaveRoom;
window.leaveRoom = function () { musStop(); return _leaveRoom.apply(this, arguments); };
(function () {
  const bar = $('rmBar'), mic = $('rbMic'); if (!bar || !mic) return;
  const b = document.createElement('button'); b.className = 'rb'; b.id = 'rbMus'; b.textContent = '🎵'; b.hidden = true; b.onclick = openMusic;
  mic.after(b);
  const _rr = window.renderRoom; window.renderRoom = function () { _rr.apply(this, arguments); updMusBtn(); };
})();
