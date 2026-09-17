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

})();
