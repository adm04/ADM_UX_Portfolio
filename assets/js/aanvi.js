/**
 * aanvi.js — Lightweight Progress & Scroll Engine for Aanvi Case Study
 */
(function () {
  'use strict';

  const progressBar = document.getElementById('aanvi-progress-bar');
  const topnav = document.querySelector('.aanvi-topnav');

  let ticking = false;

  function updateScrollState() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar calculation
    if (progressBar && docHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      progressBar.style.width = progress + '%';
    }

    // Topnav elevation shadow
    if (topnav) {
      if (scrollTop > 30) {
        topnav.classList.add('scrolled');
      } else {
        topnav.classList.remove('scrolled');
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateScrollState();
})();
