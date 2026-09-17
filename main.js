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

  /* ─── 4. HEADER: transparent → frosted glass on scroll ── */
  const header = document.querySelector('.site-header');

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

  /* ─── 5. DYNAMIC AURORA PARALLAX ────────────────────── */
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
