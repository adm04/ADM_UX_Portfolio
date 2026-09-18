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

  /* ── Smooth scroll for anchor tabs with header offset ── */
  document.querySelectorAll('.cs-tab[href^="#"]').forEach(tab => {
    tab.addEventListener('click', e => {
      const href = tab.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 64;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── Bi-directional Card Fade In / Fade Out ────────── */
  const csCards = document.querySelectorAll(
    '.cs-stat-card, .cs-pain-card, .cs-rstat, .cs-insight-card, .cs-journey-card, .cs-placeholder, .cs-pullquote, .cs-ba-item, .cs-caption-item'
  );

  if ('IntersectionObserver' in window && csCards.length > 0) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
          } else {
            entry.target.classList.remove('is-inview');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    csCards.forEach((card) => cardObserver.observe(card));
  } else {
    csCards.forEach((card) => card.classList.add('is-inview'));
  }

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

