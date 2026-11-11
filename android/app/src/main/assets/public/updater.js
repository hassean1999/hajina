/* حجينه — updater.js — نظام التحديث التلقائي */
'use strict';

(function checkUpdate() {

  // الإصدار المثبت حالياً
  const CURRENT_BUILD = 46;
  const CHECK_URL = 'https://hassean1999.github.io/hajina/version.json';
  const CHECK_INTERVAL = 6 * 60 * 60 * 1000; // كل 6 ساعات

  // لا تتحقق كثيراً
  try {
    const last = parseInt(localStorage.getItem('hj_upd_check') || '0');
    if (Date.now() - last < CHECK_INTERVAL) return;
    localStorage.setItem('hj_upd_check', Date.now());
  } catch (e) {}

  // انتظر حتى يكتمل التطبيق
  setTimeout(fetchVersion, 4000);

  function fetchVersion() {
    fetch(CHECK_URL + '?t=' + Date.now(), { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (!data || !data.build) return;
        if (data.build > CURRENT_BUILD) {
          showUpdateBanner(data);
        }
      })
      .catch(() => {}); // بدون ضجيج
  }

  function showUpdateBanner(data) {
    // لا تكرر الإشعار إذا ضغط المستخدم "لاحقاً"
    try {
      const dismissed = localStorage.getItem('hj_upd_dismiss');
      if (dismissed === String(data.build)) return;
    } catch (e) {}

    // أنشئ البانر
    const banner = document.createElement('div');
    banner.id = 'updBanner';
    banner.innerHTML = `
      <div class="upd-ic">🆕</div>
      <div class="upd-txt">
        <b>تحديث جديد متوفر!</b>
        <span>الإصدار ${data.version} — ${data.notes || ''}</span>
      </div>
      <div class="upd-btns">
        <button class="upd-now" id="updNow">تحديث</button>
        <button class="upd-later" id="updLater">لاحقاً</button>
      </div>
    `;

    // CSS
    if (!document.getElementById('updStyle')) {
      const s = document.createElement('style');
      s.id = 'updStyle';
      s.textContent = `
        #updBanner {
          position: fixed;
          bottom: calc(env(safe-area-inset-bottom, 0px) + 72px);
          left: 12px; right: 12px;
          background: linear-gradient(135deg, #2D1A38, #1E0F28);
          border: 1px solid rgba(180,80,220,.35);
          border-radius: 18px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 9999;
          box-shadow: 0 8px 32px rgba(0,0,0,.55);
          animation: updSlide .4s cubic-bezier(.32,.72,0,1) forwards;
        }
        @keyframes updSlide {
          from { transform: translateY(120%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .upd-ic { font-size: 26px; flex-shrink: 0; }
        .upd-txt { flex: 1; min-width: 0; }
        .upd-txt b { display: block; font-size: 14px; color: #FFF8F0; font-weight: 900; }
        .upd-txt span { display: block; font-size: 12px; color: rgba(255,255,255,.55); margin-top: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .upd-btns { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
        .upd-now {
          background: linear-gradient(135deg, #C060E0, #8030B0);
          color: #fff; border: 0; border-radius: 10px;
          padding: 7px 14px; font: inherit; font-weight: 900; font-size: 13px;
          cursor: pointer;
        }
        .upd-later {
          background: rgba(255,255,255,.08);
          color: rgba(255,255,255,.55); border: 0; border-radius: 10px;
          padding: 5px 10px; font: inherit; font-size: 12px;
          cursor: pointer;
        }
      `;
      document.head.appendChild(s);
    }

    document.body.appendChild(banner);

    // زر التحديث
    document.getElementById('updNow').onclick = () => {
      try { navigator.vibrate && navigator.vibrate(10); } catch (e) {}
      banner.remove();
      // افتح رابط التحديث
      const url = data.apk || data.url;
      if (url) window.open(url, '_blank');
    };

    // زر "لاحقاً"
    document.getElementById('updLater').onclick = () => {
      try { localStorage.setItem('hj_upd_dismiss', String(data.build)); } catch (e) {}
      banner.style.animation = 'updSlide .3s cubic-bezier(.32,.72,0,1) reverse forwards';
      setTimeout(() => banner.remove(), 300);
    };

    // يختفي تلقائياً بعد 10 ثواني إذا لم يتفاعل
    setTimeout(() => {
      if (document.getElementById('updBanner')) {
        banner.style.animation = 'updSlide .3s cubic-bezier(.32,.72,0,1) reverse forwards';
        setTimeout(() => banner.remove(), 300);
      }
    }, 10000);
  }

})();
