/**
 * main.js — Arkadeb Mondal Portfolio
 * Handles: scroll-based reveal animations, active nav tab, smooth scroll
 */

(function () {
  'use strict';

  /* ─── 1. INTERSECTION OBSERVER — Scroll Reveal ──────── */
  const revealEls = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger the CSS animation by ensuring opacity is reset if needed
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach((el) => {
      // Pause animation until element enters viewport
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealEls.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* ─── 2. ACTIVE NAV STATE — based on scroll position ── */
  const sections = ['projects', 'experiments', 'about'];
  const navLinks = {
    projects: document.getElementById('nav-projects'),
    experiments: document.getElementById('nav-experiments'),
    about: document.getElementById('nav-about'),
  };

  function setActiveNav(id) {
    Object.values(navLinks).forEach((link) => {
      if (!link) return;
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });
    if (navLinks[id]) {
      navLinks[id].classList.add('active');
      navLinks[id].setAttribute('aria-current', 'page');
    }
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    {
      threshold: 0.35,
    }
  );

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  /* ─── 3. SMOOTH SCROLL for anchor links ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Return focus to target for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener(
          'blur',
          () => target.removeAttribute('tabindex'),
          { once: true }
        );
      }
    });
  });

  /* ─── 4. HEADER shadow on scroll ────────────────────── */
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener(
    'scroll',
    () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 8) {
        header.style.boxShadow = '0 1px 0 rgba(0,0,0,0.06)';
      } else {
        header.style.boxShadow = 'none';
      }
      lastScroll = currentScroll;
    },
    { passive: true }
  );

})();
