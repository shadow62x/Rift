/* ============================================================
   Rift — UI layer

   Event-driven only; there is no animation loop. Each button writes
   its own --mx / --my on pointermove (cursor offset from that button's
   centre, in px) and CSS turns those into magnetism and the spotlight.
   Rects are read on pointerenter and cached, so pointermove never
   touches layout.
   ============================================================ */

(function () {
  'use strict';

  var html = document.documentElement;
  var btns = Array.prototype.slice.call(document.querySelectorAll('.btn'));

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Label swap: clone each label so one copy can slide out ----
  // Done even under reduced-motion; CSS collapses the transition to 1ms.
  btns.forEach(function (btn) {
    var label = btn.querySelector('.btn__text');
    if (!label) return;

    var text = label.textContent.trim();
    label.textContent = '';

    var a = document.createElement('span');
    a.className = 'in';
    a.textContent = text;

    var b = document.createElement('span');
    b.className = 'out';
    b.textContent = text;
    b.setAttribute('aria-hidden', 'true');

    label.appendChild(a);
    label.appendChild(b);
  });

  if (reduced) return;            // no JS-driven motion past this point

  html.classList.add('js');       // arms the entrance animation

  // ---- Button magnetism + press ripple ----

  btns.forEach(function (btn) {
    var rect = null;

    function measure() { rect = btn.getBoundingClientRect(); }

    btn.addEventListener('pointerenter', measure, { passive: true });

    btn.addEventListener('pointermove', function (e) {
      if (!rect) measure();
      var mx = e.clientX - (rect.left + rect.width * 0.5);
      var my = e.clientY - (rect.top + rect.height * 0.5);
      btn.style.setProperty('--mx', mx.toFixed(1) + 'px');
      btn.style.setProperty('--my', my.toFixed(1) + 'px');
    }, { passive: true });

    btn.addEventListener('pointerleave', function () {
      rect = null;
      btn.style.setProperty('--mx', '0px');
      btn.style.setProperty('--my', '0px');
    }, { passive: true });

    btn.addEventListener('pointerdown', function (e) {
      if (!rect) measure();
      var rip = document.createElement('span');
      rip.className = 'ripple';
      rip.style.left = (e.clientX - rect.left) + 'px';
      rip.style.top = (e.clientY - rect.top) + 'px';
      rip.addEventListener('animationend', function () { rip.remove(); });
      btn.appendChild(rip);
    });
  });

  // Rects go stale on resize; drop them and re-measure on next enter.
  window.addEventListener('resize', function () {
    btns.forEach(function (b) {
      b.style.setProperty('--mx', '0px');
      b.style.setProperty('--my', '0px');
    });
  }, { passive: true });
})();
