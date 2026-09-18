/**
 * main.js — Arkadeb Mondal Portfolio
 * Handles: scroll-based reveal animations, active nav tab, smooth scroll
 */

(function () {
  'use strict';

  /* ─── 1. INTERSECTION OBSERVER — Card Fade In & Fade Out ── */
  const revealEls = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Smoothly fade in when entering viewport
            entry.target.classList.add('is-inview');
          } else {
            // Smoothly fade out when leaving viewport (bi-directional)
            entry.target.classList.remove('is-inview');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach((el) => {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealEls.forEach((el) => {
      el.classList.add('is-inview');
    });
  }

  /* ─── 2. ACTIVE NAV STATE — based on scroll position ── */
  const sections = ['projects', 'vibe-coded', 'experiments', 'about'];
  const navLinks = {
    projects: document.getElementById('nav-projects'),
    'vibe-coded': document.getElementById('nav-vibe-coded'),
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
      threshold: 0.25,
    }
  );

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  /* ─── 3. ENHANCED SMOOTH SCROLL with header compensation ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Set active nav link immediately for immediate visual responsiveness
        setActiveNav(targetId);

        // Accessibility focus
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
