/**
 * case-study.js — Career Restart Case Study
 * Handles: sticky tab active state on scroll, smooth scroll
 */
(function () {
  'use strict';

  /* ── Active tab on scroll ──────────────────────────── */
  const sections = ['overview', 'research', 'ideation', 'design', 'lessons'];
  const tabs = {};
  sections.forEach(id => {
    tabs[id] = document.getElementById('tab-' + id);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && tabs[entry.target.id]) {
        Object.values(tabs).forEach(t => t && t.classList.remove('active'));
        tabs[entry.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  /* ── Smooth scroll for anchor tabs ────────────────── */
  document.querySelectorAll('.cs-tab[href^="#"]').forEach(tab => {
    tab.addEventListener('click', e => {
      const target = document.querySelector(tab.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Topnav: frosted glass on scroll ───────────────── */
  const header = document.querySelector('.cs-topnav');
  if (header) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 12) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      },
      { passive: true }
    );
  }

  /* ── Dynamic Aurora Parallax ───────────────────────── */
  const aurora = document.querySelector('.aurora-bg');
  if (aurora && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener(
      'mousemove',
      (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 45;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 45;
      },
      { passive: true }
    );

    function animateAurora() {
      currentX += (mouseX - currentX) * 0.04;
      currentY += (mouseY - currentY) * 0.04;
      aurora.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      requestAnimationFrame(animateAurora);
    }
    requestAnimationFrame(animateAurora);
  }

})();

