/* حجينه — native.js — تجربة Android أصيلة */
'use strict';

/* ═══════════════════════════════════════════
   1. انيميشن الانتقال بين الشاشات
═══════════════════════════════════════════ */
(function patchShow() {
  if (typeof show === 'undefined') return setTimeout(patchShow, 100);
  const _show = show; // الدالة الأصلية

  // تاريخ التنقل لمعرفة الاتجاه
  const navHistory = [];
  const NAV_ORDER = ['home', 'moments', 'chats', 'rank', 'me'];

  window.show = function(id, opts = {}) {
    const prev = window.curScr;
    if (prev === id) return;

    // تحديد اتجاه الانيميشن
    const prevIdx = NAV_ORDER.indexOf(prev);
    const nextIdx = NAV_ORDER.indexOf(id);
    let dir = opts.dir;

    if (!dir) {
      if (prevIdx !== -1 && nextIdx !== -1) {
        dir = nextIdx > prevIdx ? 'left' : 'right';
      } else if (opts.back || (navHistory.length && navHistory[navHistory.length - 1] === id)) {
        dir = 'right'; // رجوع
      } else {
        dir = 'up'; // شاشة modal/room
      }
    }

    // تحديث التاريخ
    if (dir === 'right') navHistory.pop();
    else if (prev) navHistory.push(prev);

    const prevEl = prev ? document.getElementById(prev) : null;
    const nextEl = document.getElementById(id);
    if (!nextEl) return _show(id);

    // إيقاف أي انيميشن شغّال
    document.querySelectorAll('.scr').forEach(s => {
      s.style.transition = 'none';
      s.style.transform = '';
      s.style.opacity = '';
    });

    // إظهار الشاشة الجديدة خلف
    nextEl.hidden = false;
    nextEl.style.transition = 'none';

    const isTab = NAV_ORDER.includes(id) && NAV_ORDER.includes(prev || '');

    if (isTab) {
      // انتقال أفقي للتابات
      nextEl.style.transform = dir === 'left' ? 'translateX(100%)' : 'translateX(-100%)';
      nextEl.style.opacity = '1';
    } else if (dir === 'up') {
      // دخول من الأسفل لشاشات الغرف/الـ modal
      nextEl.style.transform = 'translateY(100%)';
      nextEl.style.opacity = '1';
    } else {
      // رجوع
      nextEl.style.transform = 'translateX(-30%)';
      nextEl.style.opacity = '0.6';
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const dur = isTab ? '280ms' : '320ms';
        const ease = isTab ? 'cubic-bezier(.32,.72,0,1)' : 'cubic-bezier(.25,.46,.45,.94)';

        if (prevEl && !prevEl.hidden) {
          prevEl.style.transition = `transform ${dur} ${ease}, opacity ${dur} ${ease}`;
          if (isTab) {
            prevEl.style.transform = dir === 'left' ? 'translateX(-30%)' : 'translateX(30%)';
            prevEl.style.opacity = '0.5';
          } else if (dir === 'up') {
            prevEl.style.transform = 'scale(.95)';
            prevEl.style.opacity = '0.7';
          } else {
            prevEl.style.transform = 'translateX(100%)';
            prevEl.style.opacity = '0.8';
          }
        }

        nextEl.style.transition = `transform ${dur} ${ease}, opacity ${dur} ${ease}`;
        nextEl.style.transform = 'translateX(0) translateY(0) scale(1)';
        nextEl.style.opacity = '1';

        setTimeout(() => {
          document.querySelectorAll('.scr').forEach(s => {
            if (s.id !== id) {
              s.hidden = true;
              s.style.transition = '';
              s.style.transform = '';
              s.style.opacity = '';
            }
          });
          nextEl.style.transition = '';
          nextEl.style.transform = '';
          nextEl.style.opacity = '';
        }, parseInt(dur));
      });
    });

    // تشغيل منطق show الأصلي (nav, curScr, rank, moments...)
    _show(id);

    // اهتزاز خفيف عند تغيير التاب
    if (isTab) vib(5);
  };
})();


/* ═══════════════════════════════════════════
   2. الاهتزاز (Haptic Feedback)
═══════════════════════════════════════════ */
function vib(ms = 10) {
  try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {}
}

// اهتزاز عند الضغط على الأزرار المهمة
document.addEventListener('pointerdown', e => {
  const t = e.target.closest('button,.rc,.rc2,.h3-row,.h3-card,.h3-mini,.h3-rich,.h3-my,.nav button,.seat,.rb,.wl-add,.btn-p');
  if (!t) return;
  if (t.closest('.nav')) vib(6);
  else if (t.matches('.btn-p,.wl-add')) vib(12);
  else vib(4);
}, { passive: true });

// اهتزاز عند الهدايا والإجراءات الكبيرة
const _origVib = window.vib;
window.giftVib = () => vib([10, 50, 10]);
window.successVib = () => { try { navigator.vibrate && navigator.vibrate([8, 40, 8, 40, 20]); } catch (e) {} };
window.errorVib = () => { try { navigator.vibrate && navigator.vibrate([30, 20, 30]); } catch (e) {} };


/* ═══════════════════════════════════════════
   3. ردود فعل الضغط (Press Effect)
═══════════════════════════════════════════ */
const PRESS_SEL = '.rc,.rc2,.h3-row,.h3-card,.h3-mini,.h3-rich,.h3-my,.h3-btn,.wl,.wl-add,.tiles button,.quick button,.gbtn,.h3-b,.stats2>div,.vipcard,.wc,.lvcard';

document.addEventListener('pointerdown', e => {
  const t = e.target.closest(PRESS_SEL);
  if (!t || t._pressing) return;
  t._pressing = true;
  t.style.transition = 'transform .08s ease, filter .08s ease';
  t.style.transform = 'scale(.96)';
  t.style.filter = 'brightness(.88)';

  const up = () => {
    t._pressing = false;
    t.style.transform = '';
    t.style.filter = '';
    setTimeout(() => { t.style.transition = ''; }, 150);
    document.removeEventListener('pointerup', up);
    document.removeEventListener('pointercancel', up);
  };
  document.addEventListener('pointerup', up, { once: true });
  document.addEventListener('pointercancel', up, { once: true });
}, { passive: true });


/* ═══════════════════════════════════════════
   4. السحب للرجوع (Swipe Back)
═══════════════════════════════════════════ */
(function swipeBack() {
  let startX = 0, startY = 0, dragging = false;
  const NON_SWIPE = ['home', 'login', 'loading', 'setup'];

  document.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dragging = false;
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!e.touches.length) return;
    const dx = e.touches[0].clientX - startX;
    const dy = Math.abs(e.touches[0].clientY - startY);
    // سحب من اليمين فقط (RTL — من اليمين للتقدم، من اليسار للرجوع)
    // في RTL، السحب من اليسار = رجوع
    if (!dragging && dx < -15 && dy < 50 && startX > window.innerWidth - 60) {
      dragging = true;
    }
    if (!dragging || NON_SWIPE.includes(window.curScr)) return;
    const cur = document.getElementById(window.curScr);
    if (!cur) return;
    const pct = Math.max(0, Math.min(1, -dx / window.innerWidth));
    cur.style.transition = 'none';
    cur.style.transform = `translateX(${dx < 0 ? 0 : -dx}px)`;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (!dragging) return;
    dragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    const cur = document.getElementById(window.curScr);
    if (!cur) return;

    if (dx < -80) {
      // رجوع
      cur.style.transition = 'transform .25s cubic-bezier(.32,.72,0,1)';
      cur.style.transform = 'translateX(-100%)';
      setTimeout(() => {
        cur.style.transform = '';
        cur.style.transition = '';
        if (window.history && window.history.length > 1) window.history.back();
      }, 250);
    } else {
      cur.style.transition = 'transform .2s ease';
      cur.style.transform = '';
      setTimeout(() => { cur.style.transition = ''; }, 200);
    }
  }, { passive: true });
})();


/* ═══════════════════════════════════════════
   5. الكيبورد — رفع المحتوى بسلاسة
═══════════════════════════════════════════ */
(function keyboardHandler() {
  if (!window.visualViewport) return;
  let lastH = window.visualViewport.height;

  window.visualViewport.addEventListener('resize', () => {
    const newH = window.visualViewport.height;
    const diff = lastH - newH;
    lastH = newH;

    // الكيبورد يظهر
    if (diff > 100) {
      const focused = document.activeElement;
      if (!focused || !['INPUT', 'TEXTAREA'].includes(focused.tagName)) return;

      // تأكد إن العنصر المكتوب فيه ظاهر
      setTimeout(() => {
        focused.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      // رفع الـ composer في الغرفة
      const bar = document.querySelector('.rm-bar');
      if (bar) {
        bar.style.transition = 'transform .25s cubic-bezier(.32,.72,0,1)';
        bar.style.transform = `translateY(-${Math.min(diff, 320)}px)`;
      }
      const dmForm = document.getElementById('dmForm');
      if (dmForm) {
        dmForm.style.transition = 'transform .25s cubic-bezier(.32,.72,0,1)';
        dmForm.style.transform = `translateY(-${Math.min(diff, 320)}px)`;
      }
    }

    // الكيبورد يختفي
    if (diff < -50) {
      const bar = document.querySelector('.rm-bar');
      if (bar) { bar.style.transform = ''; setTimeout(() => bar.style.transition = '', 250); }
      const dmForm = document.getElementById('dmForm');
      if (dmForm) { dmForm.style.transform = ''; setTimeout(() => dmForm.style.transition = '', 250); }
    }
  });
})();


/* ═══════════════════════════════════════════
   6. شريط الحالة — يتلون مع الشاشة
═══════════════════════════════════════════ */
(function statusBar() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;

  const COLORS = {
    home: '#120814',
    me: '#120814',
    room: '#2E0F26',
    login: '#3a1a3a',
    chats: '#120814',
    moments: '#120814',
    rank: '#E8962E',
    setup: '#140A04',
  };

  const _orig = window.show;
  const origShow = _orig;
  // نراقب تغيير curScr
  let lastScr = '';
  setInterval(() => {
    const cur = window.curScr;
    if (cur === lastScr) return;
    lastScr = cur;
    const color = COLORS[cur] || '#120814';
    meta.setAttribute('content', color);
    // للـ Capacitor
    try {
      if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.StatusBar) {
        Capacitor.Plugins.StatusBar.setBackgroundColor({ color });
      }
    } catch (e) {}
  }, 200);
})();


/* ═══════════════════════════════════════════
   7. منع الإغلاق العرضي (Back Button Android)
═══════════════════════════════════════════ */
(function backButton() {
  // push state وهمي لاعتراض زر الرجوع
  history.pushState(null, '', location.href);

  window.addEventListener('popstate', () => {
    history.pushState(null, '', location.href);

    const cur = window.curScr;
    // إذا في شيت مفتوح، أغلقه
    const openSheet = document.querySelector('.ov:not([hidden])');
    if (openSheet) {
      const closeBtn = openSheet.querySelector('.rm-x, [onclick*="close"], [onclick*="Close"]');
      if (closeBtn) { closeBtn.click(); return; }
      openSheet.hidden = true;
      vib(8);
      return;
    }

    // إذا في غرفة، اخرج منها
    if (cur === 'room') {
      vib(8);
      if (window.leaveRoom) leaveRoom();
      return;
    }

    // إذا في شاشة فرعية، ارجع للرئيسية
    if (!['home', 'login', 'loading'].includes(cur)) {
      vib(5);
      show('home', { dir: 'right' });
      return;
    }

    // في الرئيسية — اسأل عن الخروج
    if (cur === 'home') {
      if (window._exitConfirm) {
        // ضغطتين متتاليتين = خروج
        delete window._exitConfirm;
        if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.App) {
          Capacitor.Plugins.App.exitApp();
        }
      } else {
        window._exitConfirm = true;
        if (window.toast) toast('اضغط مرة ثانية للخروج');
        setTimeout(() => delete window._exitConfirm, 2000);
      }
    }
  });
})();


/* ═══════════════════════════════════════════
   8. تحسين Scroll — إخفاء/إظهار Nav
═══════════════════════════════════════════ */
(function scrollNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  let lastY = 0, hidden = false;

  document.addEventListener('scroll', e => {
    const sc = e.target;
    if (!sc.classList || !sc.classList.contains('scroll')) return;
    const y = sc.scrollTop;
    const dy = y - lastY;
    lastY = y;

    if (dy > 8 && !hidden && y > 80) {
      hidden = true;
      nav.style.transition = 'transform .25s cubic-bezier(.32,.72,0,1)';
      nav.style.transform = 'translateY(100%)';
    } else if (dy < -5 && hidden) {
      hidden = false;
      nav.style.transition = 'transform .25s cubic-bezier(.32,.72,0,1)';
      nav.style.transform = '';
    }
  }, { passive: true, capture: true });
})();


/* ═══════════════════════════════════════════
   9. تأثير الموجة (Ripple) عند الضغط
═══════════════════════════════════════════ */
(function ripple() {
  const RIPPLE_SEL = '.btn-p,.btn-s,.nav button,.h3-tabs button,.h3-pills button,.cats button,.sr-tabs button,.rm-tabs button,.rk-tabs button,.fm-tabs button,.ch-t button';

  document.addEventListener('pointerdown', e => {
    const btn = e.target.closest(RIPPLE_SEL);
    if (!btn) return;

    const r = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    r.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${x}px;top:${y}px;border-radius:50%;background:rgba(255,255,255,.18);transform:scale(0);pointer-events:none;animation:ripple .5s ease-out forwards`;
    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(r);
    setTimeout(() => r.remove(), 500);
  }, { passive: true });

  if (!document.getElementById('rippleStyle')) {
    const s = document.createElement('style');
    s.id = 'rippleStyle';
    s.textContent = '@keyframes ripple{to{transform:scale(1);opacity:0}}';
    document.head.appendChild(s);
  }
})();


/* ═══════════════════════════════════════════
   10. تحسين الصور — Lazy Load + Fade In
═══════════════════════════════════════════ */
(function lazyImages() {
  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const img = en.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.style.transition = 'opacity .3s ease';
        img.onload = () => { img.style.opacity = '1'; };
        img.style.opacity = '0';
      }
      obs.unobserve(img);
    });
  }, { rootMargin: '100px' });

  // راقب الصور الجديدة
  const mo = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      n.querySelectorAll && n.querySelectorAll('img[data-src]').forEach(img => obs.observe(img));
      if (n.matches && n.matches('img[data-src]')) obs.observe(n);
    }));
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
